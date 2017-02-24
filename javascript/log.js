function toggle(elementid) {
  elem = document.getElementById(elementid);
  if(elem.style.display == "none")
    elem.style.display = "inline-block";
  else
    elem.style.display = "none";
  return;
}

// preset
function preset_select(set) {
  if(set == 'null') {
    document.getElementById("regex").value = "";
    document.getElementById("field").value = "";
    document.getElementById("type").value  = "";
    document.getElementById("sort").value  = "";
  } else if(set == 'apache_default_proxy') {
    document.getElementById("regex").value = unescape("%5E%28%5B0-9a-zA-Z%5C.%5D+%29%5B%5E%5C%5B%5D+%28%5C%5B.+%5C%5D%29%5B%5E%5C%22%5D+%5C%22%28GET%7CPOST%7CCONNECT%7CPROXY%7CHEAD%7COPTIONS%29%20%28%5B%5E%20%5D+%29%20.+%24");
    document.getElementById("field").value = unescape("From%2C%20Date%2C%20Method%2C%20URL");
    document.getElementById("type").value  = unescape("s%2C%20s%2C%20s%2C%20S%28/%3B%5C%3B3%29");
    document.getElementById("sort").value  = unescape("Method%2C%20URL");
  } else if(set == 'hostapd') {
    ;
  } else if(set == 'dhclient') {
    ;
  } else if(set == 'dhcpd') {
    ;
  } else if(set == 'pcap_tcpdump_option') {
    ;
  }
  return;
}

