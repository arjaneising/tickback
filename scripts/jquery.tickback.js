(function(){var e,t,n,r,i,s,o,u,a,f,l,c,h,p;e=window.jQuery;t={activeItemsFirst:!0,animationType:"move",duration:600,easing:"linear",itemInactiveClass:"tb-hidden",sortDom:!0,sortItems:!0};p=[];f=!1;h=function(){var r,i,s,o,a;s=this;if(arguments.length===2){r=arguments[0];a=arguments[1]}else typeof arguments[0]=="string"?r=arguments[0]:a=arguments[0];i={};o=s.data("settings");e.extend(i,t,o,a);i.activeItemsFirst&&!i.sortItems&&(i.sortItems=!0);s.data("settings",i);r==null&&(r="render");switch(r){case"setDefaults":l(i);break;case"destroy":n(s,i);break;default:u(s,i)}return s};r=function(t,n){var r,i,s;if(n.filterCallback==null)throw"No specified filterCallback";for(i=0,s=t.length;i<s;i++){r=t[i];r=e(r);n.filterCallback.call(this,r)?r.addClass(n.itemInactiveClass):r.removeClass(n.itemInactiveClass)}return t};s=function(n,r){if(!t.sortItems)return n;n.sort(function(t,n){var i,s;t=e(t);n=e(n);i=t.hasClass(r.itemInactiveClass);s=n.hasClass(r.itemInactiveClass);return!r.activeItemsFirst||i===s?(typeof r.sortCallback=="function"?r.sortCallback(t,n):void 0)||0:i&&!s?1:-1});return n};u=function(t,n){var i,u,a,l,h,d,v,m,g,y,b,w,E,S,x,T,N;for(w=0,S=t.length;w<S;w++){v=t[w];v=e(v);if(v.data("busy")===!0)return;v.data("busy",!0);v.data("count",0);m=v.hasClass("tickback");if(!m){v.addClass("tickback");v.attr("aria-live","polite");v.css({position:"relative",overflow:"hidden",height:v.height()});v.children().css({"float":"none",position:"absolute"});p.push(v)}h=v.children();i=v.width();l=h.eq(0).outerWidth(!0);a=h.eq(0).outerHeight(!0);r(h,n);g=s(h,n);c(g,i,l,a);d=m&&!f?n.duration:0;(T=n.beforeAnimationCallback)!=null&&T.call(v);v.transition({height:e(g[g.length-1]).data("to-top")+a},d,n.easing);for(E=0,x=h.length;E<x;E++){u=h[E];u=e(u);if((N=n.animationType)==="fade"||N==="scale")b=e.extend({},n.itemViaStyles);y=e.extend({},u.hasClass(n.itemInactiveClass)?n.itemInactiveStyles:n.itemActiveStyles);switch(n.animationType){case"fade":e.extend(b,{opacity:0});e.extend(y,{opacity:1});break;case"scale":e.extend(b,{scale:0});e.extend(y,{scale:1});break;default:e.extend(y,{left:u.data("to-left")+"px",top:u.data("to-top")+"px"})}b!=null?u.stop().transition(b,d/2,n.easing).transition({left:u.data("to-left")+"px",top:u.data("to-top")+"px"},0).transition(y,d/2,n.easing,o):u.stop().transition(y,d,n.easing,o)}}};c=function(t,n,r,i){var s,o,u,a,f,l,c,h;f=Math.floor(n/r);o=0;h=[];for(l=0,c=t.length;l<c;l++){s=t[l];u=o%f;a=Math.floor(o/f);s=e(s);s.data({index:o,"to-left":u*r,"to-top":a*i});h.push(++o)}return h};a=function(t){var n,r,i,s,o,u;r=t.children();i=function(){var t,i,s;s=[];for(t=0,i=r.length;t<i;t++){n=r[t];n=e(n);s.push([n.data("index"),n])}return s}();i.sort(function(e,t){return e[0]===t[0]?0:e[0]<t[0]?-1:1});u=[];for(s=0,o=i.length;s<o;s++){n=i[s];u.push(t.append(n[1]))}return u};o=function(){var t,n,r,i,s;r=e(this).closest(".tickback");n=r.data("count");++n;r.data("count",n);t=r.children().length;if(n>=t){i=r.data("settings");i.sortDom&&a(r);r.data("busy",!1);f=!1;return(s=i.afterAnimationCallback)!=null?s.call(r):void 0}};l=function(n){return e.extend(t,n)};n=function(t,n){var r,i,s,o,u,a,f,l,c;o=e.extend({},n.itemInactiveStyles,n.itemActiveStyles);s={"float":"",position:"",top:"",left:""};for(i in o){u=o[i];s[i]=""}t.removeClass("tickback").removeAttr("aria-live");t.css({height:"",overflow:"",position:""});l=t.children().removeClass(n.itemInactiveClass);c=[];for(a=0,f=l.length;a<f;a++){r=l[a];c.push(e(r).css(s))}return c};i=function(){var e,t,n,r,i;i=[];for(n=0,r=p.length;n<r;n++){e=p[n];t=e.data("settings");f=!0;i.push(e.tickback(t))}return i};jQuery.fn.tickback=h;e(window).on("resize",i)}).call(this);