/*
 * Copyright (c) 2011 - 2012.
 * Originally published on walk.kokage.cc in 2011.
 * Rewrite and republished on services.meta-gadgets.info in 2012.
 * Then, Lograph @ Sourceforge.
 * Public Domain.
 */

var nattoh = {
  /*
   * variables.
   */
  // element definitions.
  eid_g_node  : "g_n_",
  eid_g_edge  : "g_e_",
  eid_l_node  : "l_n_",
  eid_l_edge  : "l_e_",
  eid_t_node  : "t_n_",
  eid_t_nodeb : "t_nb_",
  eid_t_edge  : "t_e_",
  
  did_table   : "div_tab",
  did_csv     : "div_csv",
  did_graph   : "div_graph",
  did_code    : "div_code",
  
  zindex_0    : 0,
  zindex_1    : 1,
  zindex_2    : 2,
  zindex_3    : 3,
  
  id_table    : "tab",
  id_table2   : "tab2",
  id_csv      : "csv",
  id_graph    : "graph",
  id_code     : "code",
  id_info     : "info",
  
  // constants for style.
  bold        : 2,
  max_square  : 1024,
  
  // interface variables.
  type_table  : 1,
  type_group  : 2,
  type_parent : 8,
  type_child  : 9,
  type_left   : 10,
  type_right  : 11,
  type_add    : 16,
  type_delete : 17,
  type_text   : 32,
  
  // constants for nattoh.
  k_hooke     : 1e-10,
  k_sq_inv    : - 1e5,
  k_sq_inv_ne : - 1e5,
  p_ee        : 1e5,
  step_min    : 1e-5,
  step_max    : 1,
  bignum      : Math.sqrt(Math.sqrt(Number.MAX_VALUE)),
  
  // constants used for stability,
  rcut        : 5,
  rmin        : 1e-3,
  salt        : 1e-1,
  
  cv_err      : 100,
  
  // variables used through object.
  n_colors    : 0,
  max_width   : 1024,
  m_depth     : 0,
  node_r      : new Array(),
  node_depth  : new Array(),
  edge_index  : new Array(),
  node_geom   : new Array(),
  edge_geom   : new Array(),
  sq_center   : 0,
  
  // used for init graph.
  r_max       : 0,
  
  // loop conditions.
  sleeps      : 10,
  loops       : 100,
  loop        : 0,
  running     : false,
  min_r       : 10,
  
  // mode conditions,
  d_and_d     : null,
  table_touch : true,
  
  // initialized default csv.
  default_csv : "%22512%2C%201024%2C%201%2C%201%22%2C%20tg%2C%0A%2C%22_%22%2C%0A%22_%22%2C%2C%0A",
  sample_csv  : "%22512%2C%201024%2C%207%2C%202%22%2C%20%2Ctg%2Ctg%2Ctg%2Ctg%2Ctg%2Ctg%2Ctg%2C%0A%2C%2C%22_%u4E94%u611F%22%2C%2C%2C%2C%2C%2C%22_%u77E5%u899A%22%2C%0A%2C%2C%2C%22_%u8996%u899A%22%2C%22_%u8074%u899A%22%2C%22_%u89E6%u899A%22%2C%22_%u5473%u899A%22%2C%22_%u55C5%u899A%22%2C%2C%0A%22_%u4E94%u611F%22%2C%2C%2C%2C%2C%2C%2C%2C%22_%5C%220%5C%22%2C%5C%22%u4F7F%u5F79%5C%22%22%2C%0A%2C%22_%u8996%u899A%22%2C%2C%2C%22_%5C%220%5C%22%2C%5C%22%u632F%u52D5%5C%22%22%2C%22_%5C%220%5C%22%2C%5C%22%u63A5%u89E6%5C%22%22%2C%22_%5C%220%5C%22%2C%5C%22%u9855%u5FAE%5C%22%22%2C%22_%5C%220%5C%22%2C%5C%22%u9855%u5FAE%5C%22%22%2C%22_%5C%220%5C%22%2C%5C%22%u898B%u3048%u308B%5C%22%22%2C%0A%2C%22_%u8074%u899A%22%2C%2C%22_%5C%220%5C%22%2C%5C%22%u30EC%u30FC%u30C0%u30FC%5C%22%22%2C%2C%22_%5C%220%5C%22%2C%5C%22%u63A5%u89E6%5C%22%22%2C%22_%5C%220%5C%22%2C%5C%22%3F%3F%3F%5C%22%22%2C%22_%5C%220%5C%22%2C%5C%22%3F%3F%3F%5C%22%22%2C%22_%5C%220%5C%22%2C%5C%22%u805E%u3053%u3048%u308B%5C%22%22%2C%0A%2C%22_%u89E6%u899A%22%2C%2C%22_%5C%220%5C%22%2C%5C%22%u7269%u8CEA%u5909%u5316%5C%22%22%2C%22_%5C%220%5C%22%2C%5C%22%u63A5%u89E6%5C%22%22%2C%2C%22_%5C%220%5C%22%2C%5C%22%u7269%u8CEA%u5909%u5316%5C%22%22%2C%22_%5C%220%5C%22%2C%5C%22%u7269%u8CEA%u5909%u5316%5C%22%22%2C%22_%5C%220%5C%22%2C%5C%22%u89E6%u308C%u308B%5C%22%22%2C%0A%2C%22_%u5473%u899A%22%2C%2C%22_%5C%220%5C%22%2C%5C%22%u63A5%u89E6%5C%22%22%2C%22_%5C%220%5C%22%2C%5C%22DB%5C%22%22%2C%22_%5C%220%5C%22%2C%5C%22%3F%3F%3F%5C%22%22%2C%2C%22_%5C%220%5C%22%2C%5C%22%u7269%u8CEA%u985E%u4F3C%5C%22%22%2C%22_%5C%220%5C%22%2C%5C%22%u5473%u308F%u3048%u308B%5C%22%22%2C%0A%2C%22_%u55C5%u899A%22%2C%2C%22_%5C%220%5C%22%2C%5C%22%3F%3F%3F%5C%22%22%2C%22_%5C%220%5C%22%2C%5C%22%3F%3F%3F%5C%22%22%2C%22_%5C%220%5C%22%2C%5C%22%u5909%u5316%5C%22%22%2C%22_%5C%220%5C%22%2C%5C%22%u7269%u8CEA%u985E%u4F3C%5C%22%22%2C%2C%22_%5C%220%5C%22%2C%5C%22%u55C5%u3052%u308B%5C%22%22%2C%0A%22_%u77E5%u899A%22%2C%2C%2C%2C%2C%2C%2C%2C%22_%5C%220%5C%22%2C%5C%22%u8003%u3048%u3089%u308C%u308B%5C%22%22%2C%0A",
  info        : "Source Code License:<br/>Public Domain.",
  
  /*
   * small inner tool functions.
   */
  
  // which element to escape.
  graphEscape : function(str) {
    return str + " ";
  },
  
  csvEscape : function(str) {
    return str.replace(new RegExp("\\\\", 'g'),
                       "\\\\").replace(new RegExp("\"", 'g'),
                                       "\\\"").replace(new RegExp("\n", 'g'));
  },
  
  // graph sub function.
  moveElem : function(elem, dx, dy, r) {
    if(elem == null) return;
    elem.style.left = String(Math.floor(r * (parseInt(elem.style.left) + dx))) + "px";
    elem.style.top  = String(Math.floor(r * (parseInt(elem.style.top ) + dy))) + "px";
    return;
  },
  
  getGeom : function() {
    this.node_geom = new Array();
    for(var i = 0; i < this.node_depth.length; i ++) {
      var elem = document.getElementById(this.eid_g_node + String(i));
      if(elem == null) continue;
      this.node_geom.push({
                          x       : parseInt(elem.style.left),
                          y       : parseInt(elem.style.top),
                          width   : parseInt(elem.offsetWidth),
                          height  : parseInt(elem.offsetHeight),
                          cx      : (parseInt(elem.style.left) + parseInt(elem.offsetWidth) / 2.),
                          cy      : (parseInt(elem.style.top) + parseInt(elem.offsetHeight) / 2.)
      });
    }
    this.edge_geom = new Array();
    for(var i = 0; i < this.edge_index.length; i ++) {
      this.edge_geom.push(new Array());
      for(var j = 0; j < this.edge_index.length; j ++) {
        this.edge_geom[i].push(new Array());
        for(var k = 0; k < this.edge_index[i][j]; k ++) {
          var elem = document.getElementById(this.eid_g_edge + String(i) + "_" + String(j) + "_" + String(k));
          this.edge_geom[i][j].push({
                                    x       : parseInt(elem.style.left),
                                    y       : parseInt(elem.style.top),
                                    width   : parseInt(elem.offsetWidth),
                                    height  : parseInt(elem.offsetHeight),
                                    cx      : (parseInt(elem.style.left) + parseInt(elem.offsetWidth) / 2.),
                                    cy      : (parseInt(elem.style.top) + parseInt(elem.offsetHeight) / 2.)
          });
        }
      }
    }
  },
  
  setGeom : function() {
    for(var i = 0; i < this.node_depth.length; i ++) {
      var elem = document.getElementById(this.eid_g_node + String(i));
      if(elem == null) continue;
      elem.style.left = String(Math.floor(this.node_geom[i].x)) + "px";
      elem.style.top  = String(Math.floor(this.node_geom[i].y)) + "px";
    }
    for(var i = 0; i < this.edge_index.length; i ++)
      for(var j = 0; j < this.edge_index.length; j ++)
        for(var k = 0; k < this.edge_index[i][j]; k ++) {
          var elem = document.getElementById(this.eid_g_edge + String(i) + "_" + String(j) + "_" + String(k));
          if(elem == null) continue;
          elem.style.left = String(Math.floor(this.edge_geom[i][j][k].x)) + "px";
          elem.style.top  = String(Math.floor(this.edge_geom[i][j][k].y)) + "px";
        }
  },
  
  /* graph functions. */
  // calc R s
  calcRs : function(idx) {
    var i_start = idx;
    var root    = new Array();
    for(var i = i_start + 1; i < this.node_depth.length; i ++) {
      if(this.node_depth[i_start] >= this.node_depth[i])
        break;
      if(this.node_depth[i_start] + 1 == this.node_depth[i])
        root.push(i);
    }
    if(root.length <= 0)
      return;
    for(var i = 0; i < root.length; i ++)
      this.calcRs(root[i]);
    
    var max_r = 0;
    for(var i = 0; i < root.length; i ++)
      max_r = Math.max(max_r, this.node_r[root[i]]);
    var elem = document.getElementById(this.eid_g_node + String(idx));
    this.node_r[idx] = (max_r / (root.length <= 1 ? 1 : Math.sin(Math.PI / root.length)) +
                        Math.sqrt(this.node_geom[idx].width * this.node_geom[idx].width +
                                  this.node_geom[idx].height * this.node_geom[idx].height));
    return;
  },
  
  // graph 1st replace, recursively add node sets.
  addReplace : function(idx) {
    var i_start = idx;
    var root    = new Array();
    for(var i = i_start + 1; i < this.node_depth.length; i ++) {
      if(this.node_depth[i_start] >= this.node_depth[i])
        break;
      if(this.node_depth[i_start] + 1 == this.node_depth[i])
        root.push(i);
    }
    if(root.length <= 0)
      return;
    
    var r = Math.sqrt(this.node_geom[idx].width * this.node_geom[idx].width +
                      this.node_geom[idx].height * this.node_geom[idx].height);
    
    // place new elements.
    for(var i = 0; i < root.length; i ++) {
      theta = 2 * i * Math.PI / root.length;
      this.node_geom[root[i]].x  = this.node_geom[idx].cx + (this.node_r[idx] - r) * Math.cos(theta) - this.node_geom[root[i]].width / 2.;
      this.node_geom[root[i]].y  = this.node_geom[idx].cy + (this.node_r[idx] - r) * Math.sin(theta) - this.node_geom[root[i]].height / 2.;
      this.node_geom[root[i]].cx = this.node_geom[idx].cx + (this.node_r[idx] - r) * Math.cos(theta);
      this.node_geom[root[i]].cy = this.node_geom[idx].cy + (this.node_r[idx] - r) * Math.sin(theta);
    }
    
    for(var i = 0; i < root.length; i ++)
      this.addReplace(root[i]);
    return;
  },
  
  // graph 1st replace, add edges.
  addReplaceEdge : function() {
    for(var i = 0; i < this.edge_index.length; i ++)
      for(var j = 0; j < this.edge_index.length; j ++)
        for(var k = 0; k < this.edge_index[i][j]; k ++) {
          this.edge_geom[i][j][k].x  = (this.node_geom[i].cx + this.node_geom[j].cx) / 2. - this.edge_geom[i][j][k].width / 2.;
          this.edge_geom[i][j][k].y  = (this.node_geom[i].cy + this.node_geom[j].cy) / 2. - this.edge_geom[i][j][k].height / 2.;
          this.edge_geom[i][j][k].cx = this.edge_geom[i][j][k].x + this.edge_geom[i][j][k].width / 2.;
          this.edge_geom[i][j][k].cy = this.edge_geom[i][j][k].y + this.edge_geom[i][j][k].height / 2.;
        }
    return;
  },
  
  // graph function. get normalize graph geometry.
  getCenterize : function() {
    var x_min = this.max_square, x_max = 0;
    var y_min = this.max_square, y_max = 0;
    for(var i = 0; i < this.node_depth.length; i ++) {
      x_min = Math.min(x_min, this.node_geom[i].x);
      y_min = Math.min(y_min, this.node_geom[i].y);
      x_max = Math.max(x_max, this.node_geom[i].x + this.node_geom[i].width);
      y_max = Math.max(y_max, this.node_geom[i].y + this.node_geom[i].height);
      /*
      var elem = document.getElementById(this.eid_l_node + String(i));
      if(elem != null) {
        x_min = Math.min(x_min, parseInt(elem.style.left));
        y_min = Math.min(y_min, parseInt(elem.style.top ));
        x_max = Math.max(x_max, parseInt(elem.style.left) + parseInt(elem.getAttribute("width")) );
        y_max = Math.max(y_max, parseInt(elem.style.top ) + parseInt(elem.getAttribute("height")));
      }
       */
    }
    for(var i = 0; i < this.edge_index.length; i ++)
      for(var j = 0; j < this.edge_index.length; j ++)
        for(var k = 0; k < this.edge_index[i][j]; k ++) {
          x_min = Math.min(x_min, this.edge_geom[i][j][k].x);
          y_min = Math.min(y_min, this.edge_geom[i][j][k].y);
          x_max = Math.max(x_max, this.edge_geom[i][j][k].x + this.edge_geom[i][j][k].width);
          y_max = Math.max(y_max, this.edge_geom[i][j][k].y + this.edge_geom[i][j][k].height);
          /*
          var elem = document.getElementById(this.eid_l_edge + String(i) + "_" + String(j) + "_" + String(k));
          if(elem != null) {
            x_min = Math.min(x_min, parseInt(elem.style.left));
            y_min = Math.min(y_min, parseInt(elem.style.top ));
            x_max = Math.max(x_max, parseInt(elem.style.left) + parseInt(elem.getAttribute("width")) );
            y_max = Math.max(y_max, parseInt(elem.style.top ) + parseInt(elem.getAttribute("height")));
          }
           */
        }
    this.sq_center  = Math.max(x_max - x_min, y_max - y_min);
    var ratio = Math.min(this.max_square / this.sq_center, 1);
    this.sq_center /= 2;
    if(!(x_min == 0 && y_min == 0 && ratio == 1)) {
      for(var i = 0; i < this.node_depth.length; i ++) {
        this.node_geom[i].x  = ratio * (this.node_geom[i].x - x_min);
        this.node_geom[i].y  = ratio * (this.node_geom[i].y - y_min);
        this.node_geom[i].cx = this.node_geom[i].x + this.node_geom[i].width / 2.;
        this.node_geom[i].cy = this.node_geom[i].y + this.node_geom[i].height / 2.;
        /*
        this.moveElem(document.getElementById(this.eid_l_node + String(i)),
                      - x_min, - y_min, ratio);
         */
      }
      for(var i = 0; i < this.edge_index.length; i ++)
        for(var j = 0; j <this.edge_index.length; j ++)
          for(var k = 0; k < this.edge_index[i][j]; k ++) {
            this.edge_geom[i][j][k].x  = ratio * (this.edge_geom[i][j][k].x - x_min);
            this.edge_geom[i][j][k].y  = ratio * (this.edge_geom[i][j][k].y - y_min);
            this.edge_geom[i][j][k].cx = this.edge_geom[i][j][k].x + this.edge_geom[i][j][k].width / 2.;
            this.edge_geom[i][j][k].cy = this.edge_geom[i][j][k].y + this.edge_geom[i][j][k].height / 2.;
            /*
            this.moveElem(document.getElementById(this.eid_l_edge + String(i) + "_" + String(j) + "_" + String(k) ),
                          - x_min, - y_min, ratio);
             */
          }
    }
  },
  
  // graph inner function, add or change line attributes.
  changeLine : function(id, left, top, width, height, x1, y1, x2, y2, stroke, color) {
    var elem = document.getElementById(id);
    if(elem != null)
      elem.parentNode.removeChild(elem);
    
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg:svg");
    svg.id             = id;
    svg.style.position = "absolute";
    svg.style.left     = String(Math.floor(left)) + "px";
    svg.style.top      = String(Math.floor(top )) + "px";
    svg.style.zIndex   = this.zindex_1;
    svg.setAttribute("xmlns",   "http://www.w3.org/2000/svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("width",   String(Math.floor(width  + stroke)) + "px");
    svg.setAttribute("height",  String(Math.floor(height + stroke)) + "px");
    
    var line = document.createElementNS("http://www.w3.org/2000/svg", "svg:line");
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", String(stroke) + "px");
    line.setAttribute("x1", String(Math.floor(x1 + stroke / 2)));
    line.setAttribute("y1", String(Math.floor(y1 + stroke / 2)));
    line.setAttribute("x2", String(Math.floor(x2 + stroke / 2)));
    line.setAttribute("y2", String(Math.floor(y2 + stroke / 2)));
    
    svg.appendChild(line);
    
    document.getElementById(this.id_graph).appendChild(svg);
    
    return svg;
  },
  
  // graph inner function, add or change curve attributes.
  changeCurve : function(id, left, top, width, height, x1, y1, x2, y2, x3, y3, stroke, color) {
    var elem = document.getElementById(id);
    if(elem != null)
      elem.parentNode.removeChild(elem);
    
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg:svg");
    svg.id             = id;
    svg.style.position = "absolute";
    svg.style.left     = String(Math.floor(left)) + "px";
    svg.style.top      = String(Math.floor(top))  + "px";
    svg.style.zIndex   = this.zindex_1;
    svg.setAttribute("xmlns",   "http://www.w3.org/2000/svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("width",   String(Math.floor(width  + stroke)) + "px");
    svg.setAttribute("height",  String(Math.floor(height + stroke)) + "px");
    
    // calculate circle.
/*
    var a00 = 2 * (x1 - x2), a01 = 2 * (y1 - y2);
    var a10 = 2 * (x1 - x3), a11 = 2 * (y1 - y3);
    var b0  = x1 * x1 + y1 * y1 - x2 * x2 - y2 * y2;
    var b1  = x1 * x1 + y1 * y1 - x3 * x3 - y3 * y3;
    
    var det = a00 * a11 - a10 * a01;
    if(Math.abs(det) == 0) { */
      var line = document.createElementNS("http://www.w3.org/2000/svg", "svg:path");
      line.setAttribute("fill", "none");
      line.setAttribute("stroke", color);
      line.setAttribute("stroke-width", String(stroke) + "px");
      line.setAttribute("d", "M" +
                        String(Math.floor(x1)) + "," +
                        String(Math.floor(y1)) + " L" +
                        String(Math.floor(x2)) + "," +
                        String(Math.floor(y2)) + " L" +
                        String(Math.floor(x3)) + "," +
                        String(Math.floor(y3)) );
      svg.appendChild(line);
    /*
    } else {
      var x00 = (a11 * b0 - a01 * b1) / det;
      var x01 = (- a10 * b0 + a00 * b1) / det;
      var r   = Math.sqrt((x3 - x00) * (x3 - x00) + (y3 - x01) * (y3 - x01));
      var circle = document.createElementNS("http://www.w3.org/2000/svg", "svg:circle");
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", color);
      circle.setAttribute("stroke-width", String(stroke) + "px");
      circle.setAttribute("cx", String(Math.floor(x00)) + "px");
      circle.setAttribute("cy", String(Math.floor(x01)) + "px");
      circle.setAttribute("r", String(Math.floor(r)) + "px");
      svg.appendChild(circle);
    }
    */
    document.getElementById(this.id_graph).appendChild(svg);
  },
  
  moveNode : function(elem, x, y) {
    elem.style.left = String(parseInt(elem.style.left) - parseInt(elem.offsetWidth) / 2 + x) + "px";
    elem.style.top  = String(parseInt(elem.style.top) - parseInt(elem.offsetHeight) / 2 + y) + "px";
  },
  
  // graph inner function, makes line for each nattoh.
  makeLine : function(elem) {
    for(var i = 0; i < this.node_depth.length; i ++) {
      document.getElementById(this.eid_g_node + String(i)).style.zIndex = this.zindex_2;
      var prev;
      for(var prev = i - 1; prev >= 0; prev --)
        if(this.node_depth[prev] == this.node_depth[i] - 1)
          break;
      if(prev < 0 || this.node_geom[i] == null || this.node_geom[prev] == null)
        continue;
      
      var depth = this.node_depth[prev];
      var x1 = this.node_geom[prev].cx;
      var y1 = this.node_geom[prev].cy;
      var x2 = this.node_geom[i].cx;
      var y2 = this.node_geom[i].cy;
      var orig_x = Math.min(x1, x2);
      var orig_y = Math.min(y1, y2);
      x1 -= orig_x; x2 -= orig_x;
      y1 -= orig_y; y2 -= orig_y;
      
      // give color index.
      this.changeLine(this.eid_l_node + String(i),
                      orig_x, orig_y,
                      Math.abs(x1 - x2),
                      Math.abs(y1 - y2),
                      x1, y1, x2, y2,
                      (this.m_depth - depth + 1) * this.bold,
                      elem != null &&
                      (elem.id == this.eid_g_node + String(prev) ||
                       elem.id == this.eid_g_node + String(i))   ? "black" : "green");
    }
    if(elem != null)
      elem.style.zIndex = this.zindex_3;
    
    for(var i = 0; i < this.edge_index.length; i ++)
      for(var j = 0; j < this.edge_index.length; j ++)
        for(var k = 0; k < this.edge_index[i][j]; k ++) {
          var elem_begin  = document.getElementById(this.eid_g_node + String(i));
          var elem_middle = document.getElementById(this.eid_g_edge + String(i) + "_" + String(j) + "_" + String(k) );
          var elem_end    = document.getElementById(this.eid_g_node + String(j));
          
          var x1 = this.node_geom[i].cx;
          var y1 = this.node_geom[i].cy;
          var x2 = this.edge_geom[i][j][k].cx;
          var y2 = this.edge_geom[i][j][k].cy;
          var x3 = this.node_geom[j].cx;
          var y3 = this.node_geom[j].cy;
          
          var orig_x = Math.min(Math.min(x1, x2), x3);
          var orig_y = Math.min(Math.min(y1, y2), y3);
          x1 -= orig_x; x2 -= orig_x; x3 -= orig_x;
          y1 -= orig_y; y2 -= orig_y; y3 -= orig_y;
          
          // give color index.
          this.changeCurve(this.eid_l_edge +
                           String(i) + "_" + String(j) + "_" + String(k),
                           orig_x, orig_y,
                           Math.max(Math.max(x1, x2), x3) - Math.min(Math.min(x1, x2), x3),
                           Math.max(Math.max(y1, y2), y3) - Math.min(Math.min(y1, y2), y3),
                           x1, y1, x2, y2, x3, y3,
                           (this.m_depth - Math.min(this.node_depth[i], this.node_depth[j]) + 1) * this.bold,
                           elem != null &&
                           (elem.id == this.eid_g_node + String(i)  ||
                            elem.id == this.eid_g_edge + String(i) + "_" + String(j) + "_" + String(k) ||
                            elem.id == this.eid_g_node + String(j)) ? "black" : "orange");
        }
  },
  
  // graph function, potentials.
  calcRelative : function(geom1, geom2) {
    if(geom1 == null || geom2 == null) return { r: this.rcut, theta1 : 0, theta2 : 0 };
    var r1    = Math.sqrt(geom1.width * geom1.width + geom1.height + geom1.height) / 2.;
    var r2    = Math.sqrt(geom2.width * geom2.width + geom2.height + geom2.height) / 2.;
    var rr    = Math.sqrt((geom2.cx - geom1.cx) * (geom2.cx - geom1.cx) +
                          (geom2.cy - geom1.cy) * (geom2.cy - geom1.cy)) - r1 - r2;
    var theta = Math.atan2(geom2.cy - geom1.cy, geom2.cx - geom1.cx);
    if(rr > this.rcut && !isNaN(rr))
      return {
        r      : rr,
        theta1 : theta,
        theta2 : theta + Math.PI
      };
    else if(rr < 1)
      return {
        r      : this.rmin,
        theta1 : theta           + this.salt * Math.random(),
        theta2 : theta + Math.PI + this.salt * Math.random()
      };
    return {
      r      : this.rcut,
      theta1 : theta,
      theta2 : theta + Math.PI
    };
  },
  
  // graph function, potential for each node level.
  nodePotential : function(val) {
//    return val + 1;
//    return 1. / ((val + 1) * (val + 1));
    return 1. / (val + 1);
  },
  
  // graph function, round ups.
  roundUp : function(num) {
    if(num < - this.bignum || num == Number.NEGATIVE_INFINITY)
      return - this.bignum;
    else if(num > this.bignum || num == Number.POSITIVE_INFINITY)
      return this.bignum;
    return num;
  },
  
  // graph function, inner nattoh.
  inner_nattoh : function() {
    this.running = true;
    try {
      // calculate potentials for each node and edge.
      // *_potential : {{dx, dy}, ...}
      var node_potential = new Array();
      var edge_potential = new Array();
      
      // initialize.
      for(var i = 0; i < this.node_depth.length; i ++)
        node_potential.push({x : 0, y : 0});
      for(var i = 0; i < this.edge_index.length; i ++) {
        var sub_edge_potential = new Array();
        for(var j = 0; j < this.edge_index.length; j ++) {
          var sub_sub_edge_potential = new Array();
          for(var k = 0; k < this.edge_index[i][j]; k ++)
            sub_sub_edge_potential.push({x : 0, y : 0});
          sub_edge_potential.push(sub_sub_edge_potential);
        }
        edge_potential.push(sub_edge_potential);
      }
      
      // hooke's law.
      for(var i = 0; i < this.node_depth.length; i ++) {
        var prev;
        for(var prev = i - 1; prev >= 0; prev --)
          if(this.node_depth[prev] == this.node_depth[i] - 1)
            break;
        if(prev < 0 || this.node_geom[i] == null || this.node_geom[prev] == null)
          continue;
        
        var rel = this.calcRelative(this.node_geom[i], this.node_geom[prev]);
        var drel = this.nodePotential(Math.min(this.node_depth[i], this.node_depth[prev]));
        node_potential[i].x    += drel * this.k_hooke * rel.r * Math.cos(rel.theta1);
        node_potential[i].y    += drel * this.k_hooke * rel.r * Math.sin(rel.theta1);
        node_potential[prev].x += drel * this.k_hooke * rel.r * Math.cos(rel.theta2);
        node_potential[prev].y += drel * this.k_hooke * rel.r * Math.sin(rel.theta2);
      }
      
      // band to be edge near line.
      var dummy = {
        x : 0, y : 0, cx : 0, cy : 0, width : 0, height : 0
      };
      for(var i = 0; i < this.edge_index.length; i ++)
        for(var j = 0; j < this.edge_index.length; j ++)
          for(var k = 0; k < this.edge_index[i][j]; k ++) {
            if(this.edge_geom[i][j][k] == null)
              continue;
            dummy.x = dummy.cx = (this.node_geom[i].cx + this.node_geom[j].cx) / 2.;
            dummy.y = dummy.cy = (this.node_geom[i].cy + this.node_geom[j].cy) / 2.;
            var rel = this.calcRelative(this.edge_geom[i][j][k], dummy);
            edge_potential[i][j][k].x += this.p_ee * this.k_hooke * rel.r * Math.cos(rel.theta1);
            edge_potential[i][j][k].y += this.p_ee * this.k_hooke * rel.r * Math.sin(rel.theta1);
          }
    
      // k/||r||^2
      for(var i = 0; i < this.node_depth.length; i ++) {
        // node - node.
        for(var j = i + 1; j < this.node_depth.length; j ++) {
          if(this.node_geom[i] == null || this.node_geom[j] == null)
            continue;
          else if(this.node_geom[i] == this.node_geom[j])
            continue;
          var rel  = this.calcRelative(this.node_geom[i], this.node_geom[j]);
          var drel = this.nodePotential(Math.min(this.node_depth[i], this.node_depth[j]));
          node_potential[i].x += drel * drel * this.k_sq_inv / (rel.r * rel.r) * Math.cos(rel.theta1);
          node_potential[i].y += drel * drel * this.k_sq_inv / (rel.r * rel.r) * Math.sin(rel.theta1);
          node_potential[j].x += drel * drel * this.k_sq_inv / (rel.r * rel.r) * Math.cos(rel.theta2);
          node_potential[j].y += drel * drel * this.k_sq_inv / (rel.r * rel.r) * Math.sin(rel.theta2);
        }
        // node - edge.
        for(var j = 0; j < this.edge_index.length; j ++)
          for(var k = 0; k < this.edge_index.length; k ++)
            for(var l = 0; l < this.edge_index[j][k]; l ++) {
              if(this.node_geom[i] == null || this.edge_index[j][k][l] == null)
                continue;
              var rel  = this.calcRelative(this.node_geom[i], this.edge_geom[j][k][l]);
              var drel = this.nodePotential(Math.min(this.node_depth[i],
                                                     (this.node_depth[j] + this.node_depth[k]) / 2) );
              node_potential[i].x       += drel * drel * this.k_sq_inv_ne / (rel.r * rel.r) * Math.cos(rel.theta1);
              node_potential[i].y       += drel * drel * this.k_sq_inv_ne / (rel.r * rel.r) * Math.sin(rel.theta1);
              edge_potential[j][k][l].x += drel * drel * this.k_sq_inv_ne / (rel.r * rel.r) * Math.cos(rel.theta2);
              edge_potential[j][k][l].y += drel * drel * this.k_sq_inv_ne / (rel.r * rel.r) * Math.sin(rel.theta2);
            }
      }
      // edge - edge.
      for(var i = 0; i < this.edge_index.length; i ++)
        for(var j = 0; j < this.edge_index.length; j ++)
          for(var k = 0; k < this.edge_index[i][j]; k ++)
            for(i2 = i; i2 < this.edge_index.length; i2 ++)
              for(j2 = j; j2 < this.edge_index.length; j2 ++)
                for(k2 = (i == i2 && j == j2 ? k + 1 : 0); k2 < this.edge_index[i2][j2]; k2 ++) {
                  if(this.edge_geom[i][j][k] == null || this.edge_geom[i2][j2][k2] == null)
                    continue;
                  var rel  = this.calcRelative(this.edge_geom[i][j][k], this.edge_geom[i2][j2][k2]);
                  var drel = this.nodePotential(Math.min(this.node_depth[i] + this.node_depth[j],
                                                         this.node_depth[i2] + this.node_depth[j2]) / 2) /
                             Math.sqrt(this.edge_index[i][j] * this.edge_index[i2][j2]);
                  edge_potential[i][j][k].x    += drel * drel * this.k_sq_inv / (rel.r * rel.r) * Math.cos(rel.theta1);
                  edge_potential[i][j][k].y    += drel * drel * this.k_sq_inv / (rel.r * rel.r) * Math.sin(rel.theta1);
                  edge_potential[i2][j2][k2].x += drel * drel * this.k_sq_inv / (rel.r * rel.r) * Math.cos(rel.theta2);
                  edge_potential[i2][j2][k2].y += drel * drel * this.k_sq_inv / (rel.r * rel.r) * Math.sin(rel.theta2);
                }
      
      // init norm.
      var norm_potential = 0;
      for(var i = 0; i < this.node_depth.length; i ++)
        norm_potential += node_potential[i].x * node_potential[i].x + node_potential[i].y * node_potential[i].y;
      for(var i = 0; i < this.edge_index.length; i ++)
        for(var j = 0; j < this.edge_index.length; j ++)
          for(var k = 0; k < this.edge_index[i][j]; k ++)
            norm_potential += edge_potential[i][j][k].x * edge_potential[i][j][k].x +
                              edge_potential[i][j][k].y * edge_potential[i][j][k].y;
      norm_potential = Math.sqrt(norm_potential);
      
      // init step.
      var step;
      var norm1 = this.node_depth.length;
      for(var i = 0; i < this.edge_index.length; i ++)
        for(var j = 0; j < this.edge_index.length; j ++)
          norm1 += this.edge_index[i][j];
      norm1 = Math.sqrt(norm1);
      if(norm_potential < this.step_min * norm1)
        step = this.step_min;
      else if(this.step_max * norm1 < norm_potential)
        step = this.step_max;
      else
        step = norm_potential / norm1;
      for(var i = 0; i < this.node_depth.length; i ++) {
        node_potential[i].x *= step * norm1 / norm_potential;
        node_potential[i].y *= step * norm1 / norm_potential;
      }
      for(var i = 0; i < this.edge_index.length; i ++)
        for(var j = 0; j < this.edge_index.length; j ++)
          for(var k = 0; k < this.edge_index[i][j]; k ++) {
            edge_potential[i][j][k].x *= step * norm1 / norm_potential;
            edge_potential[i][j][k].y *= step * norm1 / norm_potential;
          }
      
      // adopt next stage.
      for(var i = 0; i < this.node_depth.length; i ++) {
        this.node_geom[i].x  += node_potential[i].x;
        this.node_geom[i].y  += node_potential[i].y;
        this.node_geom[i].cx += node_potential[i].x;
        this.node_geom[i].cy += node_potential[i].y;
      }
      for(var i = 0; i < this.edge_index.length; i ++)
        for(var j = 0; j < this.edge_index.length; j ++)
          for(var k = 0; k < this.edge_index[i][j]; k ++) {
            this.edge_geom[i][j][k].x  += edge_potential[i][j][k].x;
            this.edge_geom[i][j][k].y  += edge_potential[i][j][k].y;
            this.edge_geom[i][j][k].cx += edge_potential[i][j][k].x;
            this.edge_geom[i][j][k].cy += edge_potential[i][j][k].y;
          }
      
      // make line, move to center.
      this.getCenterize();
      this.setGeom();
      this.makeLine(null);
      
      // judge if loop ends.
      if(this.loop > 0) this.loop --;
      
      x_min = parseInt(document.body.offsetWidth);
      y_min = parseInt(document.body.offsetHeight);
      for(var i = 0; i < this.node_depth.length; i ++) {
        for(var j = i + 1; j < this.node_depth.length; j ++) {
          if(i >= j) continue;
          var rel = this.calcRelative(this.node_geom[i], this.node_geom[j]);
          if(Math.abs(rel.r * Math.cos(rel.theta1)) <= x_min)
            x_min = Math.abs(rel.r * Math.cos(rel.theta1));
          if(Math.abs(rel.r * Math.cos(rel.theta2)) <= x_min)
            x_min = Math.abs(rel.r * Math.cos(rel.theta2));
          if(Math.abs(rel.r * Math.sin(rel.theta1)) <= y_min)
            y_min = Math.abs(rel.r * Math.sin(rel.theta1));
          if(Math.abs(rel.r * Math.sin(rel.theta2)) <= y_min)
            y_min = Math.abs(rel.r * Math.sin(rel.theta2));
        }
        for(var j = 0; j < this.edge_index.length; j ++)
          for(var k = 0; k < this.edge_index.length; k ++)
            for(var l = 0; l < this.edge_index[j][k]; l ++) {
              var rel = this.calcRelative(this.node_geom[i], this.edge_geom[j][k][l]);
              if(Math.abs(rel.r * Math.cos(rel.theta1)) <= x_min)
                x_min = Math.abs(rel.r * Math.cos(rel.theta1));
              if(Math.abs(rel.r * Math.cos(rel.theta2)) <= x_min)
                x_min = Math.abs(rel.r * Math.cos(rel.theta2));
              if(Math.abs(rel.r * Math.sin(rel.theta1)) <= y_min)
                y_min = Math.abs(rel.r * Math.sin(rel.theta1));
              if(Math.abs(rel.r * Math.sin(rel.theta2)) <= y_min)
                y_min = Math.abs(rel.r * Math.sin(rel.theta2));
            }
      }
      for(var i = 0; i < this.edge_index.length; i ++)
        for(var j = 0; j < this.edge_index.length; j ++)
          for(var k = 0; k < this.edge_index[i][j]; k ++)
            for(var i2 = i; i2 < this.edge_index.length; i2 ++)
              for(var j2 = j; j2 < this.edge_index.length; j2 ++)
                for(var k2 = (i == i2 && j == j2 ? k + 1 : 0); k2 < this.edge_index[i2][j2]; k2 ++) {
                  var rel   = this.calcRelative(this.edge_geom[i][j][k], this.edge_geom[i2][j2][k2]);
                  if(Math.abs(rel.r * Math.cos(rel.theta1)) <= x_min)
                    x_min = Math.abs(rel.r * Math.cos(rel.theta1));
                  if(Math.abs(rel.r * Math.cos(rel.theta2)) <= x_min)
                    x_min = Math.abs(rel.r * Math.cos(rel.theta2));
                  if(Math.abs(rel.r * Math.sin(rel.theta1)) <= y_min)
                    y_min = Math.abs(rel.r * Math.sin(rel.theta1));
                  if(Math.abs(rel.r * Math.sin(rel.theta2)) <= y_min)
                    y_min = Math.abs(rel.r * Math.sin(rel.theta2));
                }
      
      var dist = Math.sqrt(x_min * x_min + y_min * y_min);
      if(dist >= nattoh.min_r && !isNaN(dist))
        this.loop = 0;
    } catch( e ){
      alert(e);
      this.loop = 0;
      this.initGraph();
    }
    if(!this.running || this.loop == 0)
      this.running = false;
    else
      setTimeout("nattoh.inner_nattoh();", this.sleeps);
    
    return;
  },
  
  /* init/load/save functions */
  // inner function, called by loadDiv.
  addDiv : function(id, className, zIndex, innerHTML) {
    var elem;
    while((elem = document.getElementById(id)) != null)
      elem.parentNode.removeChild(elem);
    
    var newdiv = document.createElement("div");
    newdiv.id             = id;
    newdiv.className      = className;
    newdiv.style.zIndex   = this.zindex_2;
    newdiv.innerHTML      = innerHTML;
    
    var elem = document.getElementById(this.id_graph).appendChild(newdiv);
    if(elem.offsetWidth > this.max_width)
      newdiv.style.width = String(this.max_width) + "px";
    else
      newdiv.style.width = String(elem.offsetWidth) + "px";
    elem.parentNode.removeChild(elem);
    
    newdiv.style.position = "absolute";
    newdiv.style.display  = "inline-block";
    newdiv.style.left     = "0px";
    newdiv.style.top      = "0px";
    newdiv.onmousemove    = function (e) {
      if(!nattoh.table_touch && nattoh.d_and_d != null) {
        var runned = this.running;
        nattoh.running = false;
        while(this.running);
        var rect = e.target.getBoundingClientRect();
        nattoh.moveNode(document.getElementById(nattoh.d_and_d),
                        e.clientX - rect.left, e.clientY - rect.top);
        nattoh.getGeom();
        if(runned) {
          nattoh.running = runned;
          setTimeout("nattoh.inner_nattoh();", this.sleeps);
        }
      }
      nattoh.makeLine(document.getElementById(String(id)));
    };
    newdiv.onmousedown    = function () {
      nattoh.d_and_d      = id;
    };
    newdiv.onmouseup      = function () {
      nattoh.d_and_d      = null;
    };
    newdiv.onmouseout     = new Function("nattoh.makeLine(null);");
    document.getElementById(this.id_graph).appendChild(newdiv);
    
    return newdiv;
  },
  
  textarea : function(id, class_name, ph, onchange, value) {
    var elem         = document.createElement("textarea");
    elem.id          = id;
    elem.name        = id;
    elem.cols        = "30";
    elem.rows        = "3";
    elem.className   = class_name;
    elem.placeholder = ph;
    if(onchange != null)
      elem.onchange  = onchange;
    elem.value       = value;
    return elem;
  },
  
  // library function, make graph initialized.
  initGraph : function() {
    this.loop = 0;
    
    this.max_width  = document.getElementById("max_width").value;
    this.max_square = document.getElementById("max_window").value;
    
    var graph = document.getElementById(this.id_graph);
    graph.parentNode.removeChild(graph);
    
    graph    = document.createElement("div");
    graph.id = this.id_graph;
    graph.style.position = "relative";
    document.getElementById(this.did_graph).appendChild(graph);
    
    this.node_r = new Array();
    for(var i = 0; i < this.node_depth.length; i ++) {
      var elem = document.getElementById(this.eid_t_node + String(i) + "_" + String(this.node_depth[i]) );
      this.addDiv(this.eid_g_node + String(i), "node", "2", this.graphEscape(elem.value));
      
      elem = document.getElementById(this.eid_g_node + String(i));
      this.node_r.push(Math.sqrt(elem.offsetWidth * elem.offsetWidth + elem.offsetHeight * elem.offsetHeight));
    }
    for(var i = 0; i < this.edge_index.length; i ++)
      for(var j = 0; j < this.edge_index.length; j ++)
        for(var k = 0; k < this.edge_index[i][j]; k ++) {
          var elem = document.getElementById(this.eid_t_edge + String(i) + "_" + String(j) + "_" + String(k));
          this.addDiv(this.eid_g_edge + String(i) + "_" + String(j) + "_" + String(k),
                      elem.value == "" ? "unvisible" : "edge", "2", this.graphEscape(elem.value));
        }
    
    this.getGeom();
    
    // calculate each R.
    // replace first.
    var list  = new Array();
    var max_r = 0;
    for(var i = 0; i < this.node_depth.length; i ++)
      if(this.node_depth[i] <= 0) {
        list.push(i);
        this.calcRs(i);
        max_r = Math.max(max_r, this.node_r[i]);
      }
    max_r /= list.length <= 1 ? 1 : Math.sin(Math.PI / list.length);
    
    // place root elements.
    for(var i = 0; i < list.length; i ++) {
      theta = 2 * i * Math.PI / list.length;
      this.node_geom[list[i]].x  = max_r * Math.cos(theta) - this.node_geom[list[i]].width / 2.;
      this.node_geom[list[i]].y  = max_r * Math.sin(theta) - this.node_geom[list[i]].height / 2.;
      this.node_geom[list[i]].cx = max_r * Math.cos(theta);
      this.node_geom[list[i]].cy = max_r * Math.sin(theta);
    }
    for(var i = 0; i < list.length; i ++)
      this.addReplace(list[i]);
    this.addReplaceEdge();
    this.getCenterize();
    this.setGeom();
    this.makeLine(null);
    
    return;
  },
  
  loadTable : function() {
    var n_cols      = document.getElementById("n_cols").value;
    this.m_depth    = document.getElementById("n_depth").value;
    
    this.max_width  = document.getElementById("max_width").value;
    this.max_square = document.getElementById("max_window").value;
    
    this.node_depth = new Array();
    for(var i = 0; i < n_cols; i ++) {
      for(var j = 0; j < this.m_depth; j ++) {
        var elem = document.getElementById(this.eid_t_node + String(i) + "_" + String(j));
        if(elem != null)
          this.node_depth.push(j);
      }
    }
    
    this.edge_index = new Array();
    for(var i = 0; i < this.node_depth.length; i ++) {
      var sub_edge_index = new Array();
      for(var j = 0; j < this.node_depth.length; j ++)
        sub_edge_index.push(0);
      this.edge_index.push(sub_edge_index);
    }
    
    for(var i = 0; i < this.node_depth.length; i ++) {
      for(var j = 0; j < this.node_depth.length; j ++) {
        var k;
        for(k = 0; ; k ++) {
          var elem = document.getElementById(this.eid_t_edge +
                                             String(i) + "_" + String(j) + "_" + String(k));
          if(elem == null)
            break;
        }
        this.edge_index.push[i][j] = k;
      }
    }
    return;
  },
  
  splitCSVLine : function(str) {
    var buf       = "";
    var csv_buf   = new Array();
    var in_dquot  = false;
    var backslash = false;
    for(var j = 0; j < str.length; j ++) {
      switch(str[j]) {
        case "\\":
          if(backslash)
            buf += str[j];
          backslash = ! backslash;
          break;
        case "n":
          if(backslash)
            buf += "\n";
          else
            buf += str[j];
          backslash = false;
          break;
        case "\"":
          if(backslash)
            buf += str[j];
          else
            in_dquot = ! in_dquot;
          backslash = false;
          break;
        case ",":
          if(in_dquot == true) {
            buf += str[j];
            break;
          }
          csv_buf.push(buf);
          buf = "";
          backslash = false;
          j ++;
          for(; j < str.length && str[j] == " "; j ++);
          j --;
          break;
        default:
          buf += str[j];
          backslash = false;
      }
    }
    if(csv_buf.length != 0)
      csv_buf.push(buf);
    return csv_buf;
  },
  
  loadCSV : function() {
    var elem_csv = document.getElementById(this.id_csv);
    if(elem_csv == null)
      return;
    var csv_text = elem_csv.value;
    var lines    = csv_text.split("\n");
    var csv      = new Array();
    for(var i = 0; i < lines.length; i ++) {
      var csv_buf = this.splitCSVLine(lines[i]);
      if(csv_buf.length > 0)
        csv.push(csv_buf);
    }
    
    var div = document.createElement("div");
    div.id        = this.did_csv + "_temp";
    div.className = "unvisible";
    
    var statement = this.splitCSVLine(csv[0][0]);
    
    this.max_width  = parseInt(statement[0]);
    this.max_square = parseInt(statement[1]);
    document.getElementById("max_width").value  = this.max_width;
    document.getElementById("max_window").value = this.max_square;
    
    var n_cols  = parseInt(statement[2]);
    var n_depth = parseInt(statement[3]);
    document.getElementById("n_cols").value  = n_cols;
    document.getElementById("n_depth").value = n_depth;
    
    this.m_depth    = 1;
    this.node_depth = new Array();
    for(var i = n_depth; i < n_depth + n_cols; i ++) {
      div.appendChild(this.linkCol(this.eid_t_node + String(i - n_depth) + "_t",
                                   null, "col", i, this.type_table,
                                   "Is this parent makes table?",
                                   csv[0][i].match(new RegExp("T")) != null ? "T" : "t") );
      div.appendChild(this.linkCol(this.eid_t_node + String(i - n_depth) + "_g",
                                   null, "col", i, this.type_table,
                                   "Is this parent makes table?",
                                   csv[0][i].match(new RegExp("G")) != null ? "G" : "g") );
      var elem     = document.createElement("textarea");
      var j;
      for(j = 0; j < n_depth; j ++) {
        if(csv[j + 1][i].length > 0 && csv[j + 1][i][0] == "_") {
          div.appendChild(this.textarea(this.eid_t_node + String(i - n_depth) + "_" + String(j),
                                        "textareas", "node " + String(i - n_depth),
                                        new Function("nattoh.colChange(" + String(i - n_depth) + ", " +
                                                     String(this.type_text) + ");"),
                                        csv[j + 1][i].substr(1, csv[j + 1][i].length - 1)) );
          this.m_depth     = Math.max(this.m_depth, j + 1);
          this.node_depth.push(j);
          break;
        }
      }
      if(j == n_depth) {
        div.appendChild(this.textarea(this.eid_t_node + String(i - n_depth) + "_" + String(0),
                                      "textareas", "node " + String(i - n_depth),
                                      new Function("nattoh.colChange(" + String(i - n_depth) + ", " +
                                                   String(this.type_text) + ");"), "") );
        this.node_depth.push(0);
      }
      div.appendChild(elem);
    }
    
    this.edge_index = new Array();
    for(var i = 0; i < this.node_depth.length; i ++) {
      var sub_edge_index = new Array();
      for(var j = 0; j < this.node_depth.length; j ++)
        sub_edge_index.push(0);
      this.edge_index.push(sub_edge_index);
    }
    
    for(var i = n_depth + 1; i < csv.length; i ++) {
      var elem     = document.createElement("textarea");
      var j;
      for(j = 0; j < n_depth; j ++) {
        if(csv[i][j].length > 0 && csv[i][j][0] == "_") {
          div.appendChild(this.textarea(this.eid_t_nodeb + String(i - (n_depth + 1)) + "_" + String(j),
                                        "textareas", "node " + String(i - (n_depth + 1)), null,
                                        csv[i][j].substr(1, csv[i][j].length - 1)) );
          break;
        }
      }
      if(j == n_depth)
        div.appendChild(this.textarea(this.eid_t_nodeb + String(i - (n_depth + 1)) + "_" + String(0),
                                      "textareas", "node " + String(i - (n_depth + 1)), null, "") );
      
      // edges;
      for(j = n_depth; j < n_depth + n_cols; j ++ ){
        if(csv[i][j][0] == "_") {
          var line = this.splitCSVLine(csv[i][j].substr(1, csv[i][j].length - 1));
          for(var k = 0; k < line.length / 2; k ++)
            div.appendChild(this.textarea(this.eid_t_edge + String(i - (n_depth + 1)) + "_" +
                                          String(j - n_depth) + "_" + String(k),
                                          "textareas", "edge " + String(k), null, line[2 * k + 1]));
          this.edge_index[i - (n_depth + 1)][j - n_depth] = line.length / 2;
        }
      }
    }
    
    div.appendChild(document.getElementById("caption"));
    document.getElementById(this.did_csv).appendChild(div);
    
    var elem;
    while((elem = document.getElementById(this.id_table)) != null)
      elem.parentNode.removeChild(elem);
    
    document.getElementById("n_cols").value  = this.node_depth.length;
    document.getElementById("n_depth").value = this.m_depth;
    
    this.reCreateTable();
    
    div.parentNode.removeChild(div);
    
    return;
  },
  
  sampleCSV : function() {
    document.getElementById(this.id_csv).value = unescape(this.sample_csv);
    return;
  },
  
  defaultCSV : function() {
    document.getElementById(this.id_csv).value = unescape(this.default_csv);
    return;
  },
  
  escapeCSV : function() {
    document.getElementById(this.id_csv).value = escape(document.getElementById(this.id_csv).value);
    return;
  },
  
  unescapeCSV : function() {
    document.getElementById(this.id_csv).value = unescape(document.getElementById(this.id_csv).value);
    return;
  },
  
  saveCSV : function() {
    var csv = document.getElementById(this.id_csv);
    csv.value  = "";
    csv.value += '"' + this.csvEscape(String(document.getElementById("max_width").value) + ", " +
                                      String(document.getElementById("max_window").value) + ", " +
                                      String(document.getElementById("n_cols").value) + ", " +
                                      String(document.getElementById("n_depth").value)) + '", ';
    for(var i = 0; i < this.m_depth - 1; i ++)
      csv.value += ",";
    for(var i = 0; i < this.node_depth.length; i ++)
      csv.value += document.getElementById(this.eid_t_node + String(i) + "_t").innerHTML +
                   document.getElementById(this.eid_t_node + String(i) + "_g").innerHTML +
                   ",";
    csv.value += "\n";
    for(var i = 0; i < this.m_depth; i ++) {
      for(var j = 0; j < this.m_depth; j ++)
        csv.value += ",";
      for(var j = 0; j < this.node_depth.length; j ++) {
        var elem = document.getElementById(this.eid_t_node + String(j) + "_" + String(i));
        if(elem == null)
          csv.value += ",";
        else
          csv.value += '"' + this.csvEscape("_" + elem.value) + '",';
      }
      csv.value += "\n";
    }
    for(var i = 0; i < this.node_depth.length; i ++) {
      for(var j = 0; j < this.m_depth; j ++) {
        var elem = document.getElementById(this.eid_t_node + String(i) + "_" + String(j));
        if(elem == null)
          csv.value += ",";
        else
          csv.value += '"' + this.csvEscape("_" + elem.value) + '",';
      }
      for(var j = 0; j < this.node_depth.length; j ++) {
        var e_text = "";
        for(var k = 0; ; k ++) {
          var elem = document.getElementById(this.eid_t_edge +
                                             String(i) + "_" + String(j) + "_" + String(k));
          if(elem == null)
            break;
          e_text += '"0","' + this.csvEscape(elem.value) + '",';
        }
        if(e_text == "")
          csv.value += ",";
        else
          csv.value += '"' + this.csvEscape("_" + e_text.substr(0, e_text.length - 1)) + '",';
      }
      csv.value += "\n";
    }
    return;
  },
  
  /*
   * edit tools.
   */
  linkCol : function(id, class_name, col_or_row, col, type, title, inner) {
    var result = document.createElement("a");
    if(id != null)
      result.id        = id;
    if(class_name != null)
      result.className = class_name;
    result.href        = "javascript: nattoh." + col_or_row + "Change(" + String(col) + ", " + String(type) + ");";
    result.title       = title;
    result.innerHTML   = inner;
    return result;
  },
  
  linkEdge : function(id, class_name, col, row, k, type, title, inner) {
    var result = document.createElement("a");
    if(id != null)
      result.id        = id;
    if(class_name != null)
      result.className = class_name;
    result.href        = "javascript: nattoh.edgeChange(" +
                        String(col) + ", " + String(row) + ", " + String(type) + ", " + String(k) + ");";
    result.title       = title;
    result.innerHTML   = inner;
    return result;
  },
  
  reCreateTable : function() {
    this.table_touch = true;
    for(var i = 0; i < this.node_depth.length; i ++)
      this.colChange(i, this.type_text);
    
    var div   = document.getElementById(this.did_table);
    var newtab;
    while((newtab = document.getElementById(this.id_table2)) != null)
      newtab.parentNode.removeChild(newtab);
    newtab    = document.createElement("table");
    newtab.id = this.id_table2;
    newtab.appendChild(document.getElementById("caption"));
    
    var thead  = document.createElement("thead");
    {
      var tr     = document.createElement("tr");
      var th     = document.createElement("th");
      th.colSpan = String(this.m_depth);
      th.rowSpan = String(this.m_depth + 1);
      tr.appendChild(th);
      for(var i = 0; i < this.node_depth.length; i ++) {
        var th = document.createElement("th");
        var elem = document.getElementById(this.eid_t_node + String(i) + "_t");
        th.appendChild(this.linkCol(this.eid_t_node + String(i) + "_t", null, "col", i, this.type_table,
                                    "Is this parent makes table?",
                                    elem != null && elem.innerHTML == "T" ? "T" : "t") );
        th.innerHTML += " ";
        var elem = document.getElementById(this.eid_t_node + String(i) + "_g");
        th.appendChild(this.linkCol(this.eid_t_node + String(i) + "_g", null, "col", i, this.type_group,
                                    "Is this parent makes color group?",
                                    elem != null && elem.innerHTML == "G" ? "G" : "g") );
        th.innerHTML += " &nbsp;&nbsp; ";
        th.appendChild(this.linkCol(null, "up",    "col", i, this.type_parent, "Move to parent.", "^"));
        th.innerHTML += " ";
        th.appendChild(this.linkCol(null, "down",  "col", i, this.type_child,  "Move to child.",  "^"));
        th.innerHTML += " ";
        th.appendChild(this.linkCol(null, "left",  "col", i, this.type_left,   "Move to left.",   "^"));
        th.innerHTML += " ";
        th.appendChild(this.linkCol(null, "right", "col", i, this.type_right,  "Move to right.",  "^"));
        th.innerHTML += " &nbsp;&nbsp; ";
        th.appendChild(this.linkCol(null, null, "col", i, this.type_add, "Add node.", "+"));
        th.innerHTML += " &nbsp;&nbsp; ";
        th.appendChild(this.linkCol(null, null, "col", i, this.type_delete, "Delete node.", "-"));
        tr.appendChild(th);
      }
      thead.appendChild(tr);
    }
    for(var i = 0; i < this.m_depth; i ++) {
      var tr = document.createElement("tr");
      for(var j = 0; j < this.node_depth.length; j ++) {
        var th = document.createElement("th");
        if(this.node_depth[j] == i) {
          var old_elem = document.getElementById(this.eid_t_node + String(j) + "_" + String(i));
          th.appendChild(this.textarea(this.eid_t_node + String(j) + "_" + String(i),
                                       "textareas", "node " + String(j),
                                       new Function("nattoh.colChange(" +
                                                    String(j) + ", " + String(this.type_text) + ");"),
                                       old_elem != null ? old_elem.value : "") );
        }
        tr.appendChild(th);
      }
      thead.appendChild(tr);
    }
    newtab.appendChild(thead);
    
    var tbody = document.createElement("tbody");
    for(var i = 0; i < this.node_depth.length; i ++) {
      var tr = document.createElement("tr");
      for(var j = 0; j < this.m_depth; j ++) {
        var th = document.createElement("th");
        if(this.node_depth[i] == j) {
          var old_elem = document.getElementById(this.eid_t_nodeb + String(i) + "_" + String(j));
          th.appendChild(this.textarea(this.eid_t_nodeb + String(i) + "_" + String(j),
                                       "textareas", "node " + String(i), null,
                                       old_elem != null ? old_elem.value : "") );
        }
        tr.appendChild(th);
      }
      for(var j = 0; j < this.node_depth.length; j ++) {
        var td = document.createElement("td");
        var k = 0;
        for(; k < this.edge_index[i][j]; k ++) {
          var indiv = document.createElement("div");
          indiv.className  = "box";
          indiv.appendChild(this.linkEdge(null, null, j, i, k, this.type_delete, "Delete this edge.", "-"));
          indiv.innerHTML += " ";
          indiv.appendChild(this.linkEdge(null, null, j, i, k, this.type_add,    "Add edge.", "+"));
          td.appendChild(indiv);
          
          var elem = document.getElementById(this.eid_t_edge + String(i) + "_" + String(j) + "_" + String(k));
          td.appendChild(this.textarea(this.eid_t_edge + String(i) + "_" + String(j) + "_" + String(k),
                                       "textareas", "edge " + String(k), null,
                                       elem != null ? elem.value : "") );
        }
        var indiv = document.createElement("div");
        indiv.className  = "box";
        var elem1 = document.getElementById(this.eid_t_nodeb + String(i) + "_" + String(this.node_depth[i]));
        var elem2 = document.getElementById(this.eid_t_node  + String(j) + "_" + String(this.node_depth[j]));
        indiv.innerText  = "<" + (elem1 == null ? "\"\"" : elem1.value.substr(0, Math.max(10, elem1.value.length))) + "..., ^" +
              (elem2 == null ? "\"\"" : elem2.value.substr(0, Math.max(10, elem2.value.length))) + "...   ";
        indiv.appendChild(this.linkEdge(null, null, j, i, k, this.type_delete, "Delete this edge.", "-"));
        indiv.innerHTML += " ";
        indiv.appendChild(this.linkEdge(null, null, j, i, k, this.type_add,    "Add edge.", "+"));
        td.appendChild(indiv);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    newtab.appendChild(tbody);
    
    var oldtab;
    while((oldtab = document.getElementById(this.id_table)) != null)
      oldtab.parentNode.removeChild(oldtab);
    newtab.id = this.id_table;
    div.appendChild(newtab);
    this.table_touch = false;
    return;
  },
  
  moveCol : function(dst, src, only) {
    if(dst == src)
      return;
    
    // nodes.
    var elem_dst;
    while((elem_dst = document.getElementById(this.eid_t_node + String(dst) + "_" + String(this.node_depth[dst]))) != null)
      elem_dst.parentNode.removeChild(elem_dst);
    var elem_src = document.getElementById(this.eid_t_node + String(src) + "_" + String(this.node_depth[src]));
    elem_dst = this.textarea(this.eid_t_node + String(dst) + "_" + String(this.node_depth[src]),
                             "textareas", "node " + String(dst),
                             new Function("nattoh.colChange(" + String(dst) + ", " + String(this.type_text) + ");"),
                             elem_src != null && only == false ? elem_src.value : "");
    elem_src.parentNode.appendChild(elem_dst);
    
    while((elem_dst = document.getElementById(this.eid_t_nodeb + String(dst) + "_" + String(this.node_depth[dst]))) != null)
      elem_dst.parentNode.removeChild(elem_dst);
    var elem_src = document.getElementById(this.eid_t_nodeb + String(src) + "_" + String(this.node_depth[src]));
    elem_dst = this.textarea(this.eid_t_nodeb + String(dst) + "_" + String(this.node_depth[src]),
                             "textareas", "node " + String(dst), null,
                             elem_src != null && only == false ? elem_src.value : "");
    elem_src.parentNode.appendChild(elem_dst);
    
    this.node_depth[dst] = this.node_depth[src];
    
    // edges.
    for(var i = 0; i < this.node_depth.length; i ++) {
      for(var j = 0; ; j ++) {
        var elem_dst = document.getElementById(this.eid_t_edge + String(dst) + "_" + String(i) + "_" + String(j));
        if(elem_dst == null)
          break;
        elem_dst.parentNode.removeChild(elem_dst);
      }
      for(var j = 0; ; j ++) {
        var elem_dst = document.getElementById(this.eid_t_edge + String(i) + "_" + String(dst) + "_" + String(j));
        if(elem_dst == null)
          break;
        elem_dst.parentNode.removeChild(elem_dst);
      }
    }
    if(only == false) {
      for(var i = 0; i < this.node_depth.length; i ++) {
        if(i == dst || i == src) continue;
        for(var j = 0; ; j ++) {
          var elem_src = document.getElementById(this.eid_t_edge + String(src) + "_" + String(i) + "_" + String(j));
          if(elem_src == null)
            break;
          elem_src.parentNode.appendChild(this.textarea(this.eid_t_edge + String(dst) + "_" + String(i) + "_" + String(j),
                                                        "textareas", "edge " + String(j), null, elem_src.value));
        }
        for(var j = 0; ; j ++) {
          var elem_src = document.getElementById(this.eid_t_edge + String(i) + "_" + String(src) + "_" + String(j));
          if(elem_src == null)
            break;
          elem_src.parentNode.appendChild(this.textarea(this.eid_t_edge + String(i) + "_" + String(dst) + "_" + String(j),
                                                        "textareas", "edge " + String(j), null, elem_src.value));
        }
      }
      for(var j = 0; ; j ++) {
        var elem_src = document.getElementById(this.eid_t_edge + String(src) + "_" + String(src) + "_" + String(j));
        if(elem_src == null)
          break;
        elem_src.parentNode.appendChild(this.textarea(this.eid_t_edge + String(dst) + "_" + String(dst) + "_" + String(j),
                                                      "textareas", "edge " + String(j), null, elem_src.value));
      }
      
      for(var j = 0; ; j ++) {
        var elem_src = document.getElementById(this.eid_t_edge + String(src) + "_" + String(dst) + "_" + String(j));
        if(elem_src == null)
          break;
        elem_src.parentNode.appendChild(this.textarea(this.eid_t_edge + String(dst) + "_" + String(src) + "_" + String(j),
                                                      "textareas", "edge " + String(j), null, elem_src.value));
      }
      

      for(var j = 0; ; j ++) {
        var elem_src = document.getElementById(this.eid_t_edge + String(dst) + "_" + String(src) + "_" + String(j));
        if(elem_src == null)
          break;
        elem_src.parentNode.appendChild(this.textarea(this.eid_t_edge + String(src) + "_" + String(dst) + "_" + String(j),
                                                      "textareas", "edge " + String(j), null, elem_src.value));
      }
    }
    
    // edge indexes.
    if(only == true)
      for(var i = 0; i < this.edge_index.length; i ++) {
        this.edge_index[i][dst] = 0;
        this.edge_index[dst][i] = 0;
      }
    else {
      for(var i = 0; i < this.edge_index.length; i ++) {
        if(i == dst || i == src) continue;
        this.edge_index[i][dst] = this.edge_index[i][src];
        this.edge_index[dst][i] = this.edge_index[src][i];
      }
      this.edge_index[dst][dst] = this.edge_index[src][src];
      this.edge_index[src][dst] = this.edge_index[dst][src];
      this.edge_index[dst][src] = this.edge_index[src][dst];
    }
    
    // redraw needed.
    return;
  },
  
  xchgParent : function(type, col) {
    var dx = (type == this.type_left ? -1 : 1);
    var xchg;
    for(xchg = col + dx; 0 <= xchg && xchg < this.node_depth.length; xchg += dx)
      if(this.node_depth[col] >= this.node_depth[xchg])
        break;
    if(xchg < 0 || this.node_depth.length <= xchg)
      return;
    
    var col_size;
    for(col_size = 1; col + col_size < this.node_depth.length; col_size ++)
      if(this.node_depth[col] >= this.node_depth[col + col_size])
        break;
    var xchg_size;
    for(xchg_size = 1; xchg + xchg_size < this.node_depth.length; xchg_size ++)
      if(this.node_depth[xchg] >= this.node_depth[xchg + xchg_size])
        break;
    
    var orig_size = this.node_depth.length;
    for(var i = 0; i < orig_size; i ++)
      for(var j = 0; j < col_size + xchg_size; j ++)
        this.edge_index[i].push(0);
    for(var i = 0; i < col_size + xchg_size; i ++) {
      var sub_edge_index = new Array();
      for(var j = 0; j < orig_size + col_size + xchg_size; j ++)
        sub_edge_index.push(0);
      this.edge_index.push(sub_edge_index);
    }
    for(var i = 0; i < col_size + xchg_size; i ++)
      this.node_depth.push(0);
    
    for(var i = 0; i < col_size; i ++)
      this.moveCol(orig_size + i, col + i, false);
    for(var i = 0; i < xchg_size; i ++)
      this.moveCol(orig_size + col_size + i, xchg + i, false);
    
    if(col < xchg) {
      for(var i = 0; i < xchg_size; i ++)
        this.moveCol(col + i, orig_size + col_size + i, false);
      for(var i = 0; i < col_size; i ++)
        this.moveCol(col + xchg_size + i, orig_size + i, false);
    } else {
      for(var i = 0; i < col_size; i ++)
        this.moveCol(xchg + i, orig_size + i, false);
      for(var i = 0; i < xchg_size; i ++)
        this.moveCol(xchg + col_size + i, orig_size + col_size + i, false);
    }
    
    for(var i = 0; i < col_size + xchg_size; i ++) {
      this.node_depth.pop();
      this.edge_index.pop();
    }
    for(var i = 0; i < orig_size; i ++)
      for(var j = 0; j < col_size + xchg_size; j ++)
        this.edge_index[i].pop();
    
    // redraw needed.
    return;
  },
  
  colChange : function(col, type) {
    var elem = document.getElementById(this.eid_t_node + String(col) + "_" + this.node_depth[col]);
    if(elem == null)
      return;
    
    switch(type) {
      case this.type_table:
        var e = document.getElementById(this.eid_t_node + String(col) + "_t");
        if(e.innerHTML == "t")
          e.innerHTML = "T";
        else
          e.innerHTML = "t";
        return;
      case this.type_group:
        var e = document.getElementById(this.eid_t_node + String(col) + "_g");
        if(e.innerHTML == "g")
          e.innerHTML = "G";
        else
          e.innerHTML = "g";
        return;
      case this.type_parent:
        if(this.node_depth[col] <= 0) {
          alert("no more root.");
          return;
        } else {
          var elem = document.getElementById(this.eid_t_node + String(col) + "_" + String(this.node_depth[col]));
          elem.id = this.eid_t_node + String(col) + "_" + String(this.node_depth[col] - 1);
          this.node_depth[col] --;
        }
        break;
      case this.type_child:
        if(col == 0 || this.node_depth[col - 1] + 1 <= this.node_depth[col]) {
          alert("connection will be destroyed, not done.");
          return;
        } else {
          var elem = document.getElementById(this.eid_t_node + String(col) + "_" + String(this.node_depth[col]));
          elem.id = this.eid_t_node + String(col) + "_" + String(this.node_depth[col] + 1);
          this.node_depth[col] ++;
        }
        break;
      case this.type_left:
        this.xchgParent(this.type_left, col);
        break;
      case this.type_right:
        this.xchgParent(this.type_right, col);
        break;
      case this.type_add:
        var end;
        for(end = col + 1; end < this.node_depth.length; end ++)
          if(this.node_depth[col] >= this.node_depth[end])
            break;
        
        // dummy.
        var sub_edge_index = new Array();
        for(var i = 0; i < this.edge_index.length; i ++) {
          this.edge_index[i].push(0);
          sub_edge_index.push(0);
        }
        sub_edge_index.push(0);
        this.edge_index.push(sub_edge_index);
        
        this.node_depth.push(0);
        for(var i = this.node_depth.length - 2; i >= end; i --)
          this.moveCol(i + 1, i, false);
        this.moveCol(end, col, true);
        break;
      case this.type_delete:
        if(col == 0) {
          var i;
          for(i = 1; i < this.node_depth.length; i ++)
            if(this.node_depth[0] == this.node_depth[i])
              break;
          if(i == this.node_depth.length) {
            alert("can't delete all node");
            return;
          }
        }
        if(confirm('delete node: "' + String(elem.value.slice(0, 10)) + '..." AND ALL CHILD?')) {
          // count.
          var end;
          for(end = col + 1; end < this.node_depth.length; end ++)
            if(this.node_depth[col] >= this.node_depth[end])
              break;
          var eend = this.node_depth.length;
          var len  = end - col;
          
          // delete.
          var i;
          for(i = col; i + len < eend; i ++)
            this.moveCol(i, Math.min(i + len, eend - 1), false);
          for(; i < eend; i ++)
            this.node_depth.pop();
          for(i = 0; i < this.edge_index.length; i ++) {
            for(var j = 0; j < len; j ++)
              this.edge_index[i].pop();
          }
          this.edge_index.pop();
        }
        break;
      case this.type_text:
        var t_parent;
        for(var i = col - 1; i >= 0; i --)
          if(this.node_depth[col] - 1 == this.node_depth[i]) {
            t_parent = document.getElementById(this.eid_t_node + String(i) + "_t");
            break;
          }
        if(t_parent != null && t_parent.innerHTML == "T")
          break;
        
        var elem_col = document.getElementById(this.eid_t_node +
                                               String(col) + "_" +
                                               String(this.node_depth[col]) );
        var elem     = document.getElementById(this.eid_t_nodeb +
                                               String(col) + "_" +
                                               String(this.node_depth[col]) );
        if(elem != null && elem_col != null)
          elem.value = elem_col.value;
        return;
      default:
        alert("no handle.");
    }
    
    document.getElementById("n_cols").value = this.node_depth.length;
    
    this.m_depth = 1;
    for(var i = 0; i < this.node_depth.length; i ++) {
      if(this.m_depth < this.node_depth[i] + 1)
        this.m_depth = this.node_depth[i] + 1;
    }
    document.getElementById("n_depth").value = this.m_depth;
    
    this.reCreateTable();
    return;
  },
  
  edgeChange : function(edge_col, edge_row, type, edge_num) {
    var work_div = document.createElement("div");
    switch(type) {
      case this.type_add:
        for(var i = this.edge_index[edge_row][edge_col] - 1; i >= edge_num; i --) {
          var elem = document.getElementById(this.eid_t_edge + String(edge_row) + "_" + String(edge_col) + "_" + String(i) );
          if(elem == null) {
            elem       = document.createElement("textarea");
            elem.value = "";
            work_div.appendChild(elem);
          }
          elem.id = this.eid_t_edge + String(edge_row) + "_" + String(edge_col) + "_" + String(i + 1);
        }
        
        // add element.
        var textarea;
        var id = this.eid_t_edge + String(edge_row) + "_" + String(edge_col) + "_" + String(edge_num <= 0 ? 0 : edge_num);
        if((textarea = document.getElementById(id)) == null) {
          textarea    = document.createElement("textarea");
          textarea.id = id;
        }
        textarea.value = "";
        work_div.appendChild(textarea);
        
        // add element to edge_index.
        this.edge_index[edge_row][edge_col] ++;
        break;
      case this.type_delete:
        // delete and re-create div, update edge_index.
        if(this.edge_index[edge_row][edge_col] <= 0) return;
        // remove data.
        var elem = document.getElementById(this.eid_t_edge + String(edge_row) + "_" +
                                           String(edge_col) + "_" + String(edge_num));
        if(elem == null || !confirm('really delete edge: "' + String(elem.value.slice(0, 10)) + '..."?'))
          return;
        while((elem = document.getElementById(this.eid_t_edge + String(edge_row) + "_" +
                                              String(edge_col) + "_" + String(edge_num))) != null)
          elem.parentNode.removeChild(elem);
        for(var i = edge_num + 1; i < this.edge_index[idx][2]; i ++) {
          var elem = document.getElementById(this.eid_t_edge + String(edge_row) + "_" +
                                              String(edge_col) + "_" + String(i));
          elem.id = this.eid_t_edge + String(edge_row) + "_" + String(edge_col) + "_" + String(i - 1);
        }
        
        this.edge_index[edge_row][edge_col] --;
        if(this.edge_index[edge_row][edge_col] < 0)
          this.edge_index[edge_row][edge_col] = 0;
        break;
      default:
        alert("no handle.");
    }
    
    //    alert(this.edge_index);
    document.body.appendChild(work_div);
    this.reCreateTable();
    work_div.parentNode.removeChild(work_div);
    return;
  },

  /*
   * small tool functions to outer.
   */
  
  // library nattoh.
  nattoh : function(step, min_r) {
    this.loop  = step;
    this.min_r = min_r;
    if(this.running == false)
      setTimeout("nattoh.inner_nattoh();", this.sleeps);
    return;
  },
  
  // library point.
  mouse : function(id) {
    this.makeLine(document.getElementById(id));
    return;
  },
  
  // library change visibility.
  change : function(mode) {
    document.getElementById(this.did_table).style.display = "none";
    document.getElementById(this.did_csv).style.display   = "none";
    document.getElementById(this.did_graph).style.display  = "none";
    document.getElementById(this.did_code).style.display  = "none";
    document.getElementById(this.id_info).style.display   = "none";
    this.loop = 0;
    if(mode == "table")
      document.getElementById(this.did_table).style.display = "inline-block";
    else if(mode == "csv")
      document.getElementById(this.did_csv).style.display   = "inline-block";
    else if(mode == "graph") {
      this.nattoh(0, 10);
      document.getElementById(this.did_graph).style.display  = "inline-block";
    } else if(mode == "code") {
      var regexp = new RegExp("</(div|svg:svg|svg)>");
      var tags   = document.getElementById(this.id_graph).innerHTML.split(regexp);
      for(var i = 0; i < tags.length; i ++) {
        if(i % 2 == 0)
          document.getElementById(this.id_code).value += tags[i];
        else
          document.getElementById(this.id_code).value += "</" + tags[i] + ">\n";
      }
      document.getElementById(this.did_code).style.display  = "inline-block";
      document.getElementById(this.id_code).focus();
      document.getElementById(this.id_code).select();
    } else if(mode == "info") {
      var elem = document.getElementById(this.id_info);
      if(elem == null) {
        elem = document.createElement("div");
        document.body.appendChild(elem);
      }
      elem.style.display = "inline-block";
      elem.innerHTML = this.info;
    }
    return;
  },
  
  getInitialized : function(data, screen) {
    if(data == "table")
      this.loadTable();
    else if(data == "csv")
      this.loadCSV();
    else if(data == "sample") {
      this.sampleCSV();
      this.loadCSV();
    } else {
      // initialize with clearing data.
      this.defaultCSV();
      this.loadCSV();
    }
    
    this.reCreateTable();
    this.initGraph();
    
    if(screen == "table")
      this.change("table");
    else if(screen == "csv")
      this.change("csv");
    else if(screen == "graph")
      this.change("graph");
    else if(screen == "code") {
      this.nattoh(0, 10);
      this.change("code");
    }
    return;
  }
};
