#! /usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import math
import string
import re
import sys
import functools

import cgi
import cgitb
cgitb.enable()

max_font = 30
min_font = 8

# Input parsing functions.
def parse_form(s, t, dflt):
  # if((not s) or (not s.value) or s.value == ""):
  if(not s.value):
    return dflt
  if(t == "n"):
    return float(s.value)
  return s.value

def parse_split_form(s, spl, r, dflt):
  # if((not s) or (not s.value) or s.value == ""):
  if(not s.value):
    return dflt
  ss  = s.value.split(spl)
  res = []
  for i in range(0, len(ss)):
    m = r.search(ss[i])
    if(m and m.group(1)):
      res.append(m.group(1))
  return res

# Log parsing functions.
def parse_path(path, spl, escape):
  m = path.split(spl)
  if(not m or len(m) < 1):
    return []
  result = [m[0]]
  for i in range(1, len(m)):
    if(escape != "" and result[-1] != "" and result[-1][-1] == escape):
      result[-1].extend(m[i])
    else:
      result.append(m[i])
  return result

def parse_range(num, start, step):
  return {"Range" : int((num - start) / step) * step + start, "Value" : num}

def parse(f, fmt, grp, type):
  if(not f):
    return {"error" : ["cannot open file."], "log" : []}
  result = {"error" : [], "log" : []}
  while 1:
    line = f.readline().decode("utf-8")
    if not line: break
    m = fmt.search(line)
    if(not m):
      result["error"].append(line)
      continue
    data = {}
    parsemiss = 0
    for i in range(0, len(grp)):
      if(not m.group(i + 1) or len(m.groups()) <= i):
        parsemiss = 1
        data[grp[i]] = "_error_"
      elif(type[i][0] == "s"):
        data[grp[i]] = m.group(i + 1)
      elif(type[i][0] == "S"):
        data[grp[i]] = parse_path(m.group(i + 1), type[i][1], type[i][2])
      elif(type[i][0] == "n"):
        data[grp[i]] = float(m.group(i + 1))
      elif(type[i][0] == "N"):
        data[grp[i]] = parse_range(float(m.group(i + 1)), type[i][1], type[i][2])
    if(parsemiss != 0):
      result["error"].append(line)
    result["log"].append(data)
  return result

# Log logarithm functions.
def max_depth(types):
  mdepth = 0
  for i in range(0, len(types)):
    if(types[i][0] == "s" or types[i][0] == "n" or types[i][0] == "N"):
      mdepth += 1
    elif(types[i][0] == "S"):
      mdepth += types[i][3]
  return mdepth

def compare_type(x, y, type, is_return_depth):
  if(type[0] == "s" or type[0] == "n"):
    if(is_return_depth != 0):
      if(x != y):
        return 0
      else:
        return 1
    elif(x < y): return - 1
    return 1
  elif(type[0] == "S"):
    for i in range(0, min(min(len(x), len(y)), type[3])):
      if(x[i] != y[i]):
        if(is_return_depth != 0):
          return i
        elif(x[i] < y[i]): return - 1
        return 1
    if(is_return_depth != 0):
      if(len(x) != len(y) and min(len(x), len(y)) + 1 < type[3]):
        return min(len(x), len(y)) + 1
      return type[3]
    elif(type[3] <= min(len(x), len(y))):
      return 0
    elif(len(x) < len(y)): return - 1
    return 1
  elif(type[0] == "N"):
    if(is_return_depth != 0):
      if(x["Range"] != y["Range"]):
        return 0
      else:
        return 1
    return x["Range"] < y["Range"]
  return 0

def compare_log(x, y, keys, types, is_return_depth):
  res = 0
  for i in range(0, len(keys)):
    lres = compare_type(x[keys[i]], y[keys[i]], types[i], is_return_depth)
    if(is_return_depth != 0):
      if(lres < max_depth([types[i]])):
        return res + lres
      res += max_depth([types[i]])
    elif(lres):
      return lres
  return res

def index2log(y, indices, keys, types, k, l, i, j):
  for ii in range(0, len(y["Start"])):
    if(0 != compare_type(indices[k]["Log"][indices[k]["Start"][l]][keys[k]], y["Log"][y["Start"][ii]][keys[k]], types[k], 0)):
      continue
    if(0 != compare_type(indices[i]["Log"][indices[i]["Start"][j]][keys[i]], y["Log"][y["Start"][ii]][keys[i]], types[i], 0)):
      continue
    return ii
  return -1

def logarithm(log, keys, types, threshold):
  result = {"Start" : [], "Count" : [], "Depth" : [], "Log" : []}
  for i in range(0, len(log["log"])):
    result["Log"].append(log["log"][i])
    if(len(result["Start"]) > 0):
      d = compare_log(log["log"][result["Start"][-1]], log["log"][i], keys, types, 1)
      if(d >= max_depth(types)):
        continue
      result["Count"][- 1] = i - result["Start"][- 1]
      result["Count"].append(0)
      result["Start"].append(i)
      result["Depth"].append(d)
    else:
      result["Count"].append(0)
      result["Start"].append(0)
      result["Depth"].append(0)
  result["Count"][- 1] = len(log["log"]) - result["Start"][- 1]
  
  if(threshold > 0):
    thresh = []
    for i in range(0, len(result["Count"])):
      thresh.append([i, result["Count"][i]])
    thresh.sort(lambda x, y: x[1] < y[1])
    res = { "Count" : [], "Start" : [], "Depth" : [], "Log" : result["Log"] }
    for i in range(0, min(threshold, len(result["Count"]))):
      res["Count"].append(result["Count"][thresh[i][0]])
      res["Start"].append(result["Start"][thresh[i][0]])
      res["Depth"].append(result["Depth"][thresh[i][0]])
    result = res
  return result

# Web interface functions.
def escape_csv(s):
  return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\'", "\\\'").replace(",", "\\,").replace("<", "&lt;").replace(">", "&gt;")

def escape_csv2(s):
  return escape_csv(escape_csv(s))

def escape_key(indices, j, key, type, i):
  idx = indices[j]["Start"][i]
  res = [""]
  if(type[j][0] == "s"):
    res = [indices[j]["Log"][idx][key[j]]]
  elif(type[j][0] == "n"):
    res = [str(indices[j]["Log"][idx][key[j]])]
  elif(type[j][0] == "S"):
    res = indices[j]["Log"][idx][key[j]]
    for i in range(len(res), max_depth([type[j]])):
      res.append("_none_")
  elif(type[j][0] == "N"):
    res = [str(indices[j]["Log"][idx][key[j]]["Range"])]
  return res

def create_output_graph(log, keys, types, threshold, thresholdnode):
  logs    = [[]]
  indices = []
  for i in range(0, len(keys)):
    for j in range(i + 1, len(keys)):
      log["log"].sort(key = functools.cmp_to_key(lambda x, y: compare_log(x, y, [keys[i], keys[j]], [types[i], types[j]], 0)))
      logs[-1].append(logarithm(log, [keys[i], keys[j]], [types[i], types[j]], thresholdnode).copy())
    logs.append([])
    log["log"].sort(key = functools.cmp_to_key(lambda x, y: compare_log(x, y, [keys[i]], [types[i]], 0)))
    indices.append(logarithm(log, [keys[i]], [types[i]], thresholdnode).copy())
  
  depth  = 0
  for i in range(0, len(indices)):
    depth = max(depth, max_depth([types[i]]))
  depth += 1
  cols   = 1 + len(indices)
  max_num = 0
  for i in range(0, len(indices)):
    mdepth = max_depth([types[i]])
    for j in range(0, len(indices[i]["Start"])):
      cols += mdepth - indices[i]["Depth"][j]
      max_num = max(max_num, indices[i]["Count"][j])
  
  output.write("\"2048, 4096, " + str(cols) + ", " + str(depth) + "\", ")
  for i in range(1, depth):
    output.write(", ")
  for i in range(0, cols):
    output.write("tg, ")
  output.write("\n")
  
  for i in range(0, depth):
    output.write(", ")
  for i in range(0, len(indices)):
    output.write("\"_" + escape_csv(keys[i]) + "\", ")
    for j in range(0, len(indices[i]["Start"])):
      for k in range(indices[i]["Depth"][j], max_depth([types[i]])):
        output.write(", ")
  output.write("\"_" + escape_csv("Cannot parse:<br/><textarea cols=\"30\" rows=\"10\">"))
  for i in range(0, min(threshold, len(log["error"]))):
    output.write(escape_csv(log["error"][i] + "\n"))
  output.write(escape_csv("</textarea>"))
  if(len(log["error"]) > threshold):
    output.write(escape_csv("&gt;" + str(len(log["error"])) + "logs"))
  output.write("\", \n")
  
  for i in range(0, depth - 1):
    for j in range(0, depth):
      output.write(", ")
    for j in range(0, len(indices)):
      output.write(", ")
      for k in range(0, len(indices[j]["Start"])):
        for l in range(indices[j]["Depth"][k], max_depth([types[j]]) - 1):
          if(l == i):
            output.write("\"_" + escape_csv(escape_key(indices, j, keys, types, k)[l]) + "\", ")
          else:
            output.write(", ")
        if(i == max_depth([types[j]]) - 1):
          name = "_".join(escape_key(indices, j, keys, types, k))
          output.write("\"_" + escape_csv("<a href=\"javascript: toggle"))
          output.write(escape_csv("(\'_log_" + name + "_" + str(i) + "\');\" style=\"font-size: "))
          output.write(escape_csv(str(max(math.floor(math.log(indices[j]["Count"][k]) / math.log(max_num + 1) * max_font) + min_font, min_font))))
          output.write(escape_csv("pt;\">" + name + "</a>"))
          output.write(escape_csv("<textarea id=\'_log_" + name + "_" + str(i) + "\' cols=\"80\" rows=\"25\" style=\"display: none;\">"))
          for l in range(0, min(threshold, indices[j]["Count"][k])):
            output.write(escape_csv(str(indices[j]["Log"][l + indices[j]["Start"][k]]) + "\n"))
          output.write(escape_csv("</textarea><br/>" + str(indices[j]["Count"][k])))
          if(indices[j]["Count"][k] > threshold):
            output.write("&gt;" + str(threshold))
          output.write("\", ")
        else:
          output.write(", ")
    output.write(", \n")
  
  for i in range(0, len(indices)):
    for j in range(0, depth + cols):
      output.write(", ")
    output.write("\n")
    for j in range(0, len(indices[i]["Start"])):
      for k in range(indices[i]["Depth"][j], max_depth([types[i]]) - 1):
        for l in range(0, depth + cols):
          output.write(", ")
        output.write("\n")
      for k in range(0, depth):
        output.write(", ")
      for k in range(0, len(indices)):
        output.write(", ")
        for l in range(0, len(indices[k]["Start"])):
          if(i <= k):
            for m in range(indices[k]["Depth"][l], max_depth([types[k]])):
              output.write(", ")
            continue
          for m in range(indices[k]["Depth"][l], max_depth([types[k]]) - 1):
            output.write(", ")
          
          # seek differ.
          idx = index2log(logs[k][i - k - 1], indices, keys, types, k, l, i, j)
          if(idx >= 0):
            name = "_".join(escape_key(indices, k, keys, types, l)) + "_" + "_".join(escape_key(indices, i, keys, types, j))
            output.write("\"_\\\"0\\\",\\\"" + escape_csv2("<a href=\"javascript: toggle"))
            output.write(escape_csv2("(\'_log_" + name + "_" + str(idx) +  "\');\">" + name + "</a>"))
            output.write(escape_csv2("<textarea id=\'_log_" + name + "_" + str(idx) + "\'"))
            output.write(escape_csv2(" cols=\"80\" rows=\"25\" style=\"display: none;\">"))
            for m in range(0, min(threshold, logs[k][i - k - 1]["Count"][idx])):
              output.write(escape_csv2(str(logs[k][i - k - 1]["Log"][m + logs[k][i - k - 1]["Start"][idx]]) + "\n"))
            output.write(escape_csv2("</textarea><br/>" + str(logs[k][i - k - 1]["Count"][idx])))
            if(logs[k][i - k - 1]["Count"][idx] > threshold):
              output.write(escape_csv2("&gt;" + str(threshold)))
            output.write("\\\"\", ")
          else:
            output.write(", ")
      output.write(", , \n")

# fast response.
print("Content-Type: text/html")
print("")

# initialize in and out.
form   = cgi.FieldStorage()
output = sys.stdout

# sanitize and check form.
threshold = parse_form(form["threshold"], "n", 10)
if(threshold < 1):
  threshold = 1
thresholdnode = parse_form(form["thresholdnode"], "n", 15)
if(thresholdnode < 1):
  thresholdnode = 1
elif(60 < thresholdnode):
  thresholdnode = 60

regex   = re.compile(parse_form(form["regex"], "s", r"^(.+)$"))
a_keys  = parse_split_form(form["field"], ",", re.compile(r"([a-zA-Z0-9]+)"), ["none"])
a_types = parse_split_form(form["type"],  ",", re.compile(r"([sSnN](\((.?;)*.\))?)"), ["s"])
keys    = parse_split_form(form["sort"],  ",", re.compile(r"([a-zA-Z0-9]+)"), ["none"])

# type operation
for i in range(0, len(a_types)):
  if(a_types[i][0] == "s"):
    a_types[i] = ["s"]
  elif(a_types[i][0] == "S"):
    m = re.search(r"\((.);(.)?;([0-9]+)\)", a_types[i])
    if(m):
      a_types[i] = ["S", m.group(1), m.group(2), int(m.group(3))]
    else:
      a_types[i] = ["s"]
  elif(a_types[i][0] == "n"):
    a_types[i] = ["n"]
  elif(a_types[i][0] == "N"):
    m = re.search(r"\(([0-9\.]+);([0-9\.]+)\)", a_types[i])
    if(m):
      a_types[i] = ["N", float(m.group(1)), float(m.group(2))]
    else:
      a_types[i] = ["n"]
  else:
    a_types[i] = ["_"]

types = []
for i in range(0, len(keys)):
  k = len(a_keys)
  for j in range(0, len(a_keys)):
    if(keys[i] == a_keys[j]):
      k = j
      break
  if(k >= len(a_keys)):
    keys  = ["none"]
    types = ["s"]
    break
  if(k < len(a_types) and a_types[k]):
    types.append(a_types[k])
  else:
    types.append("s")

typeskip       = []
typenode       = []
typenthreshold = []

# output header.
f = open("log_header.html", "r")
for line in f:
  output.write(line)
f.close

# parse.
if(int(os.environ['CONTENT_LENGTH']) > 15 * 1024 * 1024):
  log = {"error" : ["Too large file (restricted &lt; 15MB for sample.)"]}
  for i in range(0, len(types)):
    result[a_keys[i]] = "_error_"
else:
  log = parse(form["logfile"].file, regex, a_keys, a_types)

flag = 0
if(len(log["log"]) <= 0):
  log["log"].append({})
  for i in range(0, len(a_keys)):
    log["log"][0][a_keys[i]] = "_error_"
  if(len(log["error"]) <= 0):
    log["error"].append("File is null.")

# output csv part.
create_output_graph(log, keys, types, int(threshold), int(thresholdnode))

# output footer.
f = open("log_footer.html", "r")
for line in f:
  output.write(line)
f.close

