import{a0 as S,a3 as F,aB as j,_ as u,g as q,s as H,a as Z,b as J,q as K,p as Q,l as z,c as X,D as Y,H as tt,N as et,e as rt,y as at,F as it}from"./mermaid.core-CGnUM3Pf.js";import{p as nt}from"./chunk-4BX2VUAB-CJMP9DSk.js";import{p as ot}from"./treemap-KMMF4GRG-Dyv2vs_g.js";import{d as I}from"./arc-jjpOPnGo.js";import{o as st}from"./ordinal-Cboi1Yqb.js";import"./main-Cueo9Gmc.js";import"./mermaid-NA5CF7SZ-LbR6-K3V.js";import"./button-r6mHSpo9.js";import"./input-DtfU5s6Y.js";import"./separator-CkqvZLcF.js";import"./dialog-CemJiPxP.js";import"./index-CZGrV-Ob.js";import"./react-icons.esm-Oflcc6fQ.js";import"./tooltip-DczS4KSX.js";import"./index-D2MWPP6r.js";import"./index-DWpIDjon.js";import"./tutorialManager-CBRURvBH.js";import"./trash-2-D_yKYRpA.js";import"./book-open-STSHqvFR.js";import"./brain-D4UtYFKR.js";import"./useAuth-C84NQqcP.js";import"./file-text-xKl8a3dw.js";import"./circle-alert-BnIKkVLL.js";import"./loader-circle-Cbks1rAA.js";import"./avatar-CwLR_mX4.js";import"./index-DOUzLCEu.js";import"./index-CuHsL6Sm.js";import"./index-B_YAqH_L.js";import"./search-c6_-r4tE.js";import"./user-Du091hZZ.js";import"./ProtectedRoute-AJQc2QAr.js";import"./min-D_pg29VH.js";import"./_baseUniq-DzPvdXYU.js";import"./init-Gi6I4Gst.js";function lt(t,r){return r<t?-1:r>t?1:r>=t?0:NaN}function ct(t){return t}function pt(){var t=ct,r=lt,m=null,y=S(0),o=S(F),l=S(0);function s(e){var i,c=(e=j(e)).length,d,x,h=0,p=new Array(c),n=new Array(c),v=+y.apply(this,arguments),w=Math.min(F,Math.max(-F,o.apply(this,arguments)-v)),f,C=Math.min(Math.abs(w)/c,l.apply(this,arguments)),$=C*(w<0?-1:1),g;for(i=0;i<c;++i)(g=n[p[i]=i]=+t(e[i],i,e))>0&&(h+=g);for(r!=null?p.sort(function(A,D){return r(n[A],n[D])}):m!=null&&p.sort(function(A,D){return m(e[A],e[D])}),i=0,x=h?(w-c*$)/h:0;i<c;++i,v=f)d=p[i],g=n[d],f=v+(g>0?g*x:0)+$,n[d]={data:e[d],index:i,value:g,startAngle:v,endAngle:f,padAngle:C};return n}return s.value=function(e){return arguments.length?(t=typeof e=="function"?e:S(+e),s):t},s.sortValues=function(e){return arguments.length?(r=e,m=null,s):r},s.sort=function(e){return arguments.length?(m=e,r=null,s):m},s.startAngle=function(e){return arguments.length?(y=typeof e=="function"?e:S(+e),s):y},s.endAngle=function(e){return arguments.length?(o=typeof e=="function"?e:S(+e),s):o},s.padAngle=function(e){return arguments.length?(l=typeof e=="function"?e:S(+e),s):l},s}var ut=it.pie,N={sections:new Map,showData:!1},T=N.sections,G=N.showData,dt=structuredClone(ut),gt=u(()=>structuredClone(dt),"getConfig"),mt=u(()=>{T=new Map,G=N.showData,at()},"clear"),ft=u(({label:t,value:r})=>{if(r<0)throw new Error(`"${t}" has invalid value: ${r}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);T.has(t)||(T.set(t,r),z.debug(`added new section: ${t}, with value: ${r}`))},"addSection"),ht=u(()=>T,"getSections"),vt=u(t=>{G=t},"setShowData"),St=u(()=>G,"getShowData"),L={getConfig:gt,clear:mt,setDiagramTitle:Q,getDiagramTitle:K,setAccTitle:J,getAccTitle:Z,setAccDescription:H,getAccDescription:q,addSection:ft,getSections:ht,setShowData:vt,getShowData:St},yt=u((t,r)=>{nt(t,r),r.setShowData(t.showData),t.sections.map(r.addSection)},"populateDb"),xt={parse:u(async t=>{const r=await ot("pie",t);z.debug(r),yt(r,L)},"parse")},wt=u(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),At=wt,Dt=u(t=>{const r=[...t.values()].reduce((o,l)=>o+l,0),m=[...t.entries()].map(([o,l])=>({label:o,value:l})).filter(o=>o.value/r*100>=1).sort((o,l)=>l.value-o.value);return pt().value(o=>o.value)(m)},"createPieArcs"),Ct=u((t,r,m,y)=>{z.debug(`rendering pie chart
`+t);const o=y.db,l=X(),s=Y(o.getConfig(),l.pie),e=40,i=18,c=4,d=450,x=d,h=tt(r),p=h.append("g");p.attr("transform","translate("+x/2+","+d/2+")");const{themeVariables:n}=l;let[v]=et(n.pieOuterStrokeWidth);v??=2;const w=s.textPosition,f=Math.min(x,d)/2-e,C=I().innerRadius(0).outerRadius(f),$=I().innerRadius(f*w).outerRadius(f*w);p.append("circle").attr("cx",0).attr("cy",0).attr("r",f+v/2).attr("class","pieOuterCircle");const g=o.getSections(),A=Dt(g),D=[n.pie1,n.pie2,n.pie3,n.pie4,n.pie5,n.pie6,n.pie7,n.pie8,n.pie9,n.pie10,n.pie11,n.pie12];let b=0;g.forEach(a=>{b+=a});const W=A.filter(a=>(a.data.value/b*100).toFixed(0)!=="0"),E=st(D);p.selectAll("mySlices").data(W).enter().append("path").attr("d",C).attr("fill",a=>E(a.data.label)).attr("class","pieCircle"),p.selectAll("mySlices").data(W).enter().append("text").text(a=>(a.data.value/b*100).toFixed(0)+"%").attr("transform",a=>"translate("+$.centroid(a)+")").style("text-anchor","middle").attr("class","slice"),p.append("text").text(o.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const O=[...g.entries()].map(([a,M])=>({label:a,value:M})),k=p.selectAll(".legend").data(O).enter().append("g").attr("class","legend").attr("transform",(a,M)=>{const R=i+c,B=R*O.length/2,V=12*i,U=M*R-B;return"translate("+V+","+U+")"});k.append("rect").attr("width",i).attr("height",i).style("fill",a=>E(a.label)).style("stroke",a=>E(a.label)),k.append("text").attr("x",i+c).attr("y",i-c).text(a=>o.getShowData()?`${a.label} [${a.value}]`:a.label);const _=Math.max(...k.selectAll("text").nodes().map(a=>a?.getBoundingClientRect().width??0)),P=x+e+i+c+_;h.attr("viewBox",`0 0 ${P} ${d}`),rt(h,d,P,s.useMaxWidth)},"draw"),$t={draw:Ct},oe={parser:xt,db:L,renderer:$t,styles:At};export{oe as diagram};
