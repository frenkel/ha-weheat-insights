var ne=globalThis,se=ne.ShadowRoot&&(ne.ShadyCSS===void 0||ne.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ue=Symbol(),Re=new WeakMap,Y=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==ue)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(se&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=Re.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&Re.set(t,e))}return e}toString(){return this.cssText}},ze=n=>new Y(typeof n=="string"?n:n+"",void 0,ue),q=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((r,s,o)=>r+(i=>{if(i._$cssResult$===!0)return i.cssText;if(typeof i=="number")return i;throw Error("Value passed to 'css' function must be a 'css' function result: "+i+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[o+1],n[0]);return new Y(t,n,ue)},Me=(n,e)=>{if(se)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let r=document.createElement("style"),s=ne.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=t.cssText,n.appendChild(r)}},pe=se?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return ze(t)})(n):n;var{is:st,defineProperty:ot,getOwnPropertyDescriptor:it,getOwnPropertyNames:at,getOwnPropertySymbols:lt,getPrototypeOf:dt}=Object,oe=globalThis,Oe=oe.trustedTypes,ct=Oe?Oe.emptyScript:"",ht=oe.reactiveElementPolyfillSupport,Z=(n,e)=>n,_e={toAttribute(n,e){switch(e){case Boolean:n=n?ct:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},We=(n,e)=>!st(n,e),De={attribute:!0,type:String,converter:_e,reflect:!1,useDefault:!1,hasChanged:We};Symbol.metadata??=Symbol("metadata"),oe.litPropertyMetadata??=new WeakMap;var L=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=De){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(e,r,t);s!==void 0&&ot(this.prototype,e,s)}}static getPropertyDescriptor(e,t,r){let{get:s,set:o}=it(this.prototype,e)??{get(){return this[t]},set(i){this[t]=i}};return{get:s,set(i){let l=s?.call(this);o?.call(this,i),this.requestUpdate(e,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??De}static _$Ei(){if(this.hasOwnProperty(Z("elementProperties")))return;let e=dt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Z("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Z("properties"))){let t=this.properties,r=[...at(t),...lt(t)];for(let s of r)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[r,s]of t)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let s=this._$Eu(t,r);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let s of r)t.unshift(pe(s))}else e!==void 0&&t.push(pe(e));return t}static _$Eu(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Me(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){let r=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,r);if(s!==void 0&&r.reflect===!0){let o=(r.converter?.toAttribute!==void 0?r.converter:_e).toAttribute(t,r.type);this._$Em=e,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){let r=this.constructor,s=r._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let o=r.getPropertyOptions(s),i=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:_e;this._$Em=s;let l=i.fromAttribute(t,o.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(e,t,r,s=!1,o){if(e!==void 0){let i=this.constructor;if(s===!1&&(o=this[e]),r??=i.getPropertyOptions(e),!((r.hasChanged??We)(o,t)||r.useDefault&&r.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(i._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:s,wrapped:o},i){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,i??t??this[e]),o!==!0||i!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,o]of r){let{wrapped:i}=o,l=this[s];i!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,o,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};L.elementStyles=[],L.shadowRootOptions={mode:"open"},L[Z("elementProperties")]=new Map,L[Z("finalized")]=new Map,ht?.({ReactiveElement:L}),(oe.reactiveElementVersions??=[]).push("2.1.2");var be=globalThis,je=n=>n,ie=be.trustedTypes,Ne=ie?ie.createPolicy("lit-html",{createHTML:n=>n}):void 0,Ge="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Fe="?"+T,ut=`<${Fe}>`,D=document,X=()=>D.createComment(""),Q=n=>n===null||typeof n!="object"&&typeof n!="function",we=Array.isArray,pt=n=>we(n)||typeof n?.[Symbol.iterator]=="function",me=`[ 	
\f\r]`,J=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ue=/-->/g,Ve=/>/g,M=RegExp(`>|${me}(?:([^\\s"'>=/]+)(${me}*=${me}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ie=/'/g,Ke=/"/g,Ye=/^(?:script|style|textarea|title)$/i,xe=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),y=xe(1),A=xe(2),Dt=xe(3),W=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Be=new WeakMap,O=D.createTreeWalker(D,129);function qe(n,e){if(!we(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ne!==void 0?Ne.createHTML(e):e}var _t=(n,e)=>{let t=n.length-1,r=[],s,o=e===2?"<svg>":e===3?"<math>":"",i=J;for(let l=0;l<t;l++){let a=n[l],p,m,c=-1,h=0;for(;h<a.length&&(i.lastIndex=h,m=i.exec(a),m!==null);)h=i.lastIndex,i===J?m[1]==="!--"?i=Ue:m[1]!==void 0?i=Ve:m[2]!==void 0?(Ye.test(m[2])&&(s=RegExp("</"+m[2],"g")),i=M):m[3]!==void 0&&(i=M):i===M?m[0]===">"?(i=s??J,c=-1):m[1]===void 0?c=-2:(c=i.lastIndex-m[2].length,p=m[1],i=m[3]===void 0?M:m[3]==='"'?Ke:Ie):i===Ke||i===Ie?i=M:i===Ue||i===Ve?i=J:(i=M,s=void 0);let f=i===M&&n[l+1].startsWith("/>")?" ":"";o+=i===J?a+ut:c>=0?(r.push(p),a.slice(0,c)+Ge+a.slice(c)+T+f):a+T+(c===-2?l:f)}return[qe(n,o+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},ee=class n{constructor({strings:e,_$litType$:t},r){let s;this.parts=[];let o=0,i=0,l=e.length-1,a=this.parts,[p,m]=_t(e,t);if(this.el=n.createElement(p,r),O.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=O.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let c of s.getAttributeNames())if(c.endsWith(Ge)){let h=m[i++],f=s.getAttribute(c).split(T),v=/([.?@])?(.*)/.exec(h);a.push({type:1,index:o,name:v[2],strings:f,ctor:v[1]==="."?fe:v[1]==="?"?ye:v[1]==="@"?ve:B}),s.removeAttribute(c)}else c.startsWith(T)&&(a.push({type:6,index:o}),s.removeAttribute(c));if(Ye.test(s.tagName)){let c=s.textContent.split(T),h=c.length-1;if(h>0){s.textContent=ie?ie.emptyScript:"";for(let f=0;f<h;f++)s.append(c[f],X()),O.nextNode(),a.push({type:2,index:++o});s.append(c[h],X())}}}else if(s.nodeType===8)if(s.data===Fe)a.push({type:2,index:o});else{let c=-1;for(;(c=s.data.indexOf(T,c+1))!==-1;)a.push({type:7,index:o}),c+=T.length-1}o++}}static createElement(e,t){let r=D.createElement("template");return r.innerHTML=e,r}};function K(n,e,t=n,r){if(e===W)return e;let s=r!==void 0?t._$Co?.[r]:t._$Cl,o=Q(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(n),s._$AT(n,t,r)),r!==void 0?(t._$Co??=[])[r]=s:t._$Cl=s),s!==void 0&&(e=K(n,s._$AS(n,e.values),s,r)),e}var ge=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:r}=this._$AD,s=(e?.creationScope??D).importNode(t,!0);O.currentNode=s;let o=O.nextNode(),i=0,l=0,a=r[0];for(;a!==void 0;){if(i===a.index){let p;a.type===2?p=new te(o,o.nextSibling,this,e):a.type===1?p=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(p=new $e(o,this,e)),this._$AV.push(p),a=r[++l]}i!==a?.index&&(o=O.nextNode(),i++)}return O.currentNode=D,s}p(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},te=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,s){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=K(this,e,t),Q(e)?e===_||e==null||e===""?(this._$AH!==_&&this._$AR(),this._$AH=_):e!==this._$AH&&e!==W&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):pt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_&&Q(this._$AH)?this._$AA.nextSibling.data=e:this.T(D.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:r}=e,s=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=ee.createElement(qe(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(t);else{let o=new ge(s,this),i=o.u(this.options);o.p(t),this.T(i),this._$AH=o}}_$AC(e){let t=Be.get(e.strings);return t===void 0&&Be.set(e.strings,t=new ee(e)),t}k(e){we(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,s=0;for(let o of e)s===t.length?t.push(r=new n(this.O(X()),this.O(X()),this,this.options)):r=t[s],r._$AI(o),s++;s<t.length&&(this._$AR(r&&r._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let r=je(e).nextSibling;je(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},B=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,s,o){this.type=1,this._$AH=_,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=_}_$AI(e,t=this,r,s){let o=this.strings,i=!1;if(o===void 0)e=K(this,e,t,0),i=!Q(e)||e!==this._$AH&&e!==W,i&&(this._$AH=e);else{let l=e,a,p;for(e=o[0],a=0;a<o.length-1;a++)p=K(this,l[r+a],t,a),p===W&&(p=this._$AH[a]),i||=!Q(p)||p!==this._$AH[a],p===_?e=_:e!==_&&(e+=(p??"")+o[a+1]),this._$AH[a]=p}i&&!s&&this.j(e)}j(e){e===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},fe=class extends B{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_?void 0:e}},ye=class extends B{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_)}},ve=class extends B{constructor(e,t,r,s,o){super(e,t,r,s,o),this.type=5}_$AI(e,t=this){if((e=K(this,e,t,0)??_)===W)return;let r=this._$AH,s=e===_&&r!==_||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,o=e!==_&&(r===_||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},$e=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){K(this,e)}};var mt=be.litHtmlPolyfillSupport;mt?.(ee,te),(be.litHtmlVersions??=[]).push("3.3.3");var Ze=(n,e,t)=>{let r=t?.renderBefore??e,s=r._$litPart$;if(s===void 0){let o=t?.renderBefore??null;r._$litPart$=s=new te(e.insertBefore(X(),o),o,void 0,t??{})}return s._$AI(n),s};var Ce=globalThis,H=class extends L{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ze(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};H._$litElement$=!0,H.finalized=!0,Ce.litElementHydrateSupport?.({LitElement:H});var gt=Ce.litElementPolyfillSupport;gt?.({LitElement:H});(Ce.litElementVersions??=[]).push("4.2.2");var Ae={title:"Weheat Insights",live:"Live",last_24h:"Last 24 hours",last_7d:"Last 7 days",temperatures:"Temperatures",power:"Power",cop:"COP",delta_t:"\u0394T supply/return",state:"Operating state",room:"Room",outdoor:"Outdoor",supply:"Supply",return:"Return",power_input:"Electrical power",power_output:"Heat output",no_pumps_title:"No heat pump set up yet",no_pumps_body:"Add the **Weheat Insights** integration under *Settings \u2192 Devices & services* and pick a heat pump. This dashboard fills itself in once that is done.",error_title:"Weheat Insights is not available",error_body:"The dashboard could not load its configuration. Check that the Weheat Insights integration is installed and loaded.",disclaimer:"Unofficial community project, not affiliated with Weheat.",performance:"Performance",cop_history:"COP over time",day:"Day",month:"Month",season:"Season",heating:"Heating",dhw:"Hot water",total:"Total",no_data:"No data for this period yet.",electricity:"electricity",heat:"heat",scop_season:"SCOP this season",cop_month:"COP this month",cop_today:"COP today",defrost_cop_impact:"COP lost to defrost",degree_days_month:"Degree days this month",degree_days_season:"Degree days this season",heat_per_degree_day:"Heating per degree day",heat_per_degree_day_last_year:"Same period last season",heat_per_degree_day_last_season:"Whole last season",energy_per_day:"Energy per day",degree_days_per_day:"Degree days per day",degree_days_per_month:"Degree days per month",defrost:"Defrost",house:"House",heat_loss_short:"Heat loss",heating_curve:"Heating curve",current_curve:"current curve",advised_curve:"advice",curve_advice:"Advice",curve_outdoor:"Outdoor",curve_current:"Current",curve_range:"Range",curve_extrapolated:"extrapolated",curve_no_heat:"no heat needed",curve_target:"Target room temperature",curve_measured:"measured indoor (last 2 weeks)",curve_no_advice:"No advice yet:",reason_no_heat_loss:"the heat-loss coefficient is not known yet (see the House tab).",reason_too_few_steady_hours:"not enough hours of steady heating yet (at least 24 in the last 60 days).",before_after:"Before and after the curve change",per_degree_day_before:"Before",per_degree_day_after:"After",change_effect:"Change",curve_definitions:"**How the advice is made.** For each outdoor temperature of the Weheat curve: the heat the house needs (from the heat-loss coefficient, at your target room temperature), and the water temperature at which your heating system delivers exactly that heat (calibrated on hours of steady heating, with the chosen heating system). Where no heat is needed, the advice is the room temperature. The advice has one decimal: enter it in the Weheat web portal, or round up to whole degrees in the app. The *range* comes from the uncertainty of the heat-loss coefficient. Points far outside the measured outdoor temperatures are *extrapolated*: treat them as a starting point. This is advice, not a guarantee: change the curve in small steps and check that the rooms stay warm. Set the change date under Configure to compare before and after (corrected for weather with degree days).",heat_loss_title:"Heat loss",supply_curve_title:"Supply temperature vs outdoor",indoor_outdoor_diff:"Indoor \u2212 outdoor (K)",heating_per_day:"Heating heat (kWh/day)",outdoor_temp:"Outdoor temperature (\xB0C)",supply_temp:"Supply temperature (\xB0C)",days_used:"days",excluded:"excluded",used:"used",fit_line:"fit",indoor_assumed_note:"No indoor sensor configured: 20 \xB0C assumed, so this is less reliable.",reason_too_few_days:"Not enough usable days yet (at least 14 needed).",reason_too_little_spread:"Not enough difference between mild and cold days yet (at least 6 K needed).",reason_no_relation:"No clear relation between temperature difference and heating yet.",heat_loss_coefficient:"Heat-loss coefficient",heat_loss_design:"At \u221210 \xB0C",balance_point:"Balance point",cool_down_tau:"Time constant",cool_down_rate:"Cool-down at 15 K",thermal_mass:"Thermal mass",house_definitions:"**Heat loss.** Each dot is one day: heating heat against the average indoor\u2212outdoor difference. The slope of the line is the heat-loss coefficient (W/K, shown with a 95 % confidence interval); where the line crosses zero tells how much free heat (sun, people, appliances) the house gets. Grey dots are days left out: missing data, too mild, a big indoor temperature change, or another heat source running. **Cool-down** uses periods of 4+ hours without heating and needs an indoor sensor. **Supply temperature vs outdoor** shows hours of space heating only; the colour is \u0394T supply\u2212return.",delta_t_short:"\u0394T",power_input_short:"Electricity",power_output_short:"Heat",heat_pump:"Heat pump",pumps:"pumps",this_season:"This season",this_month:"This month",today:"Today",defrost_loss:"Lost to defrost",last_year_to_date:"Last year to date",whole_last_season:"Last season",scop_heading:"SCOP this season",cop_heading:"COP",standby:"Standby",degree_days:"Degree days",definitions:"**How these numbers are calculated.** *Heat pump* COP/SCOP is all useful heat divided by the compressor electricity for heating, hot water and defrost; this matches the Weheat app. *Total* also counts standby and the indoor unit (circulation pumps): what your heat actually costs. *Heating* and *hot water* only count the compressor electricity for that mode plus its share of defrost (split by electricity use); standby and the indoor unit are left out. Defrost heat taken back from the water counts against the COP. *Heating per degree day* uses heating heat only and lets you compare winters of different coldness. Figures come from Home Assistant's long-term statistics and can lag up to about an hour."},ft={title:"Weheat Insights",live:"Live",last_24h:"Afgelopen 24 uur",last_7d:"Afgelopen 7 dagen",temperatures:"Temperaturen",power:"Vermogen",cop:"COP",delta_t:"\u0394T aanvoer/retour",state:"Bedrijfstoestand",room:"Kamer",outdoor:"Buiten",supply:"Aanvoer",return:"Retour",power_input:"Elektrisch vermogen",power_output:"Warmteafgifte",no_pumps_title:"Nog geen warmtepomp ingesteld",no_pumps_body:"Voeg de integratie **Weheat Insights** toe via *Instellingen \u2192 Apparaten & diensten* en kies een warmtepomp. Dit dashboard vult zich daarna vanzelf.",error_title:"Weheat Insights is niet beschikbaar",error_body:"Het dashboard kon zijn configuratie niet laden. Controleer of de integratie Weheat Insights is ge\xEFnstalleerd en geladen.",disclaimer:"Onofficieel communityproject, niet verbonden aan Weheat.",performance:"Prestaties",cop_history:"COP door de tijd",day:"Dag",month:"Maand",season:"Seizoen",heating:"Verwarming",dhw:"Warm water",total:"Totaal",no_data:"Nog geen gegevens voor deze periode.",electricity:"stroom",heat:"warmte",scop_season:"SCOP dit stookseizoen",cop_month:"COP deze maand",cop_today:"COP vandaag",defrost_cop_impact:"COP-verlies door ontdooien",degree_days_month:"Graaddagen deze maand",degree_days_season:"Graaddagen dit stookseizoen",heat_per_degree_day:"Verwarming per graaddag",heat_per_degree_day_last_year:"Zelfde periode vorig seizoen",heat_per_degree_day_last_season:"Heel vorig seizoen",energy_per_day:"Energie per dag",degree_days_per_day:"Graaddagen per dag",degree_days_per_month:"Graaddagen per maand",defrost:"Ontdooien",house:"Woning",heat_loss_short:"Warmteverlies",heating_curve:"Stooklijn",current_curve:"huidige stooklijn",advised_curve:"advies",curve_advice:"Advies",curve_outdoor:"Buiten",curve_current:"Huidig",curve_range:"Bandbreedte",curve_extrapolated:"ge\xEBxtrapoleerd",curve_no_heat:"geen warmte nodig",curve_target:"Gewenste kamertemperatuur",curve_measured:"gemeten binnen (afgelopen 2 weken)",curve_no_advice:"Nog geen advies:",reason_no_heat_loss:"de warmteverliesco\xEBffici\xEBnt is nog niet bekend (zie het tabblad Woning).",reason_too_few_steady_hours:"nog te weinig uren met continu verwarmen (minstens 24 in de afgelopen 60 dagen).",before_after:"Voor en na de stooklijnwijziging",per_degree_day_before:"Voor",per_degree_day_after:"Na",change_effect:"Verschil",curve_definitions:"**Zo komt het advies tot stand.** Voor elke buitentemperatuur van de Weheat-stooklijn: de warmte die het huis nodig heeft (uit de warmteverliesco\xEBffici\xEBnt, bij je gewenste kamertemperatuur), en de watertemperatuur waarbij je afgiftesysteem precies die warmte levert (gekalibreerd op uren met continu verwarmen, met het gekozen afgiftesysteem). Waar geen warmte nodig is, is het advies de kamertemperatuur. Het advies heeft \xE9\xE9n decimaal: vul het zo in via het Weheat-webportaal, of rond in de app naar boven af op hele graden. De *bandbreedte* komt uit de onzekerheid van de warmteverliesco\xEBffici\xEBnt. Punten ver buiten de gemeten buitentemperaturen zijn *ge\xEBxtrapoleerd*: zie ze als startpunt. Dit is een advies, geen garantie: pas de stooklijn in kleine stappen aan en controleer of de kamers warm blijven. Vul onder Configureren de datum van de wijziging in om voor en na te vergelijken (gecorrigeerd voor het weer met graaddagen).",heat_loss_title:"Warmteverlies",supply_curve_title:"Aanvoertemperatuur vs buiten",indoor_outdoor_diff:"Binnen \u2212 buiten (K)",heating_per_day:"Verwarmingswarmte (kWh/dag)",outdoor_temp:"Buitentemperatuur (\xB0C)",supply_temp:"Aanvoertemperatuur (\xB0C)",days_used:"dagen",excluded:"uitgesloten",used:"gebruikt",fit_line:"lijn",indoor_assumed_note:"Geen binnensensor ingesteld: 20 \xB0C aangenomen, dus minder betrouwbaar.",reason_too_few_days:"Nog niet genoeg bruikbare dagen (minstens 14 nodig).",reason_too_little_spread:"Nog te weinig verschil tussen zachte en koude dagen (minstens 6 K nodig).",reason_no_relation:"Nog geen duidelijk verband tussen temperatuurverschil en verwarming.",heat_loss_coefficient:"Warmteverliesco\xEBffici\xEBnt",heat_loss_design:"Bij \u221210 \xB0C",balance_point:"Stookgrens",cool_down_tau:"Tijdconstante",cool_down_rate:"Afkoeling bij 15 K",thermal_mass:"Warmtecapaciteit",house_definitions:"**Warmteverlies.** Elke stip is \xE9\xE9n dag: verwarmingswarmte tegen het gemiddelde verschil tussen binnen en buiten. De helling van de lijn is de warmteverliesco\xEBffici\xEBnt (W/K, met een betrouwbaarheidsinterval van 95 %); waar de lijn nul raakt zie je hoeveel gratis warmte (zon, mensen, apparaten) het huis krijgt. Grijze stippen zijn dagen die niet meetellen: ontbrekende gegevens, te zacht, een grote verandering binnen of een andere warmtebron. **Afkoeling** gebruikt periodes van minstens 4 uur zonder verwarming en heeft een binnensensor nodig. **Aanvoertemperatuur vs buiten** toont alleen uren met ruimteverwarming; de kleur is de \u0394T aanvoer\u2212retour.",delta_t_short:"\u0394T",power_input_short:"Stroom",power_output_short:"Warmte",heat_pump:"Warmtepomp",pumps:"pompen",this_season:"Dit seizoen",this_month:"Deze maand",today:"Vandaag",defrost_loss:"Ontdooiverlies",last_year_to_date:"Vorig jaar tot nu",whole_last_season:"Vorig seizoen",scop_heading:"SCOP dit stookseizoen",cop_heading:"COP",standby:"Stand-by",degree_days:"Graaddagen",definitions:"**Zo worden deze getallen berekend.** De COP/SCOP *warmtepomp* is alle nuttige warmte gedeeld door de compressorstroom voor verwarming, warm water en ontdooien; dat komt overeen met de Weheat-app. *Totaal* telt ook stand-by en de binnenunit (circulatiepompen) mee: wat je warmte echt kost. *Verwarming* en *warm water* tellen alleen de compressorstroom voor die functie plus hun deel van het ontdooien (verdeeld naar stroomverbruik); stand-by en de binnenunit tellen daar niet mee. Warmte die bij ontdooien uit het water wordt gehaald, telt negatief mee. *Verwarming per graaddag* gebruikt alleen verwarmingswarmte, zodat je winters van verschillende koude kunt vergelijken. De cijfers komen uit de langetermijnstatistieken van Home Assistant en kunnen tot ongeveer een uur achterlopen."},yt={en:Ae,nl:ft};function G(n){return(n.locale?.language??n.language??"en").split("-")[0]}function j(n){let e=yt[G(n)]??Ae;return t=>e[t]??Ae[t]}var N="weheat-insights-performance-card",ke=600,Se=220,k={left:30,right:8,top:10,bottom:26},vt=900*1e3,S=(n,e=2)=>n==null?"\u2013":n.toFixed(e);function Je(n,e,t){let r=new Date(`${n.start}T12:00:00`);if(e==="day")return String(r.getDate());if(e==="month")return r.toLocaleDateString(t,{month:"short"});let s=new Date(`${n.end}T12:00:00`),o=s.getMonth()===0?s.getFullYear()-1:s.getFullYear();return o===r.getFullYear()?String(r.getFullYear()):`${r.getFullYear()}/${String(o).slice(2)}`}function $t(n,e,t){let r=new Date(`${n.start}T12:00:00`);return e==="day"?r.toLocaleDateString(t,{weekday:"short",day:"numeric",month:"long"}):e==="month"?r.toLocaleDateString(t,{month:"long",year:"numeric"}):Je(n,e,t)}var ae=class extends H{constructor(){super(...arguments);this._kind="month"}static{this.properties={hass:{attribute:!1},_config:{state:!0},_kind:{state:!0},_data:{state:!0},_error:{state:!0}}}setConfig(t){if(!t.entry_id)throw new Error("entry_id is required");this._config=t,this._kind=t.period??"month"}getCardSize(){return 5}getGridOptions(){return{columns:"full",min_rows:4}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._fetch(!0),vt)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._timer)}willUpdate(t){(t.has("hass")||t.has("_kind")||t.has("_config"))&&this._fetch(!1)}async _fetch(t){if(!this.hass||!this._config)return;let r=`${this._config.entry_id}:${this._kind}`;if(!(!t&&r===this._fetchedKey)){this._fetchedKey=r;try{this._data=await this.hass.callWS({type:"weheat_insights/performance_history",entry_id:this._config.entry_id,period:this._kind}),this._error=void 0}catch(s){this._error=s instanceof Error?s.message:JSON.stringify(s)}}}render(){if(!this.hass||!this._config)return _;let t=j(this.hass);return y`
      <ha-card>
        <div class="header">
          <div class="title">${this._config.title??t("cop_history")}</div>
          <div class="kinds" role="tablist">
            ${["day","month","season"].map(r=>y`<button
                role="tab"
                aria-selected=${r===this._kind}
                class=${r===this._kind?"active":""}
                @click=${()=>this._kind=r}
              >
                ${t(r)}
              </button>`)}
          </div>
        </div>
        <div class="content">${this._renderBody(t)}</div>
      </ha-card>
    `}_renderBody(t){if(this._error)return y`<div class="message">${this._error}</div>`;let r=this._data;return!r||r.period!==this._kind?y`<div class="message">…</div>`:r.periods.some(s=>s.cop!=null)?y`${this._renderChart(r,t)}${this._renderLegend(r,t)}`:y`<div class="message">${t("no_data")}</div>`}_renderChart(t,r){let s=G(this.hass),o=t.periods.findIndex(d=>d.cop!=null||d.cop_heat_pump!=null),i=t.periods.slice(Math.max(0,o)),l=i.flatMap(d=>[d.cop_heat_pump,d.cop,d.cop_heating,t.has_dhw?d.cop_dhw:null]),a=Math.max(5,Math.ceil(Math.max(...l.map(d=>d??0))+.5)),p=ke-k.left-k.right,m=Se-k.top-k.bottom,c=d=>k.top+m-Math.max(0,d)/a*m,h=p/i.length,f=t.has_dhw?2:1,v=Math.max(2,Math.min(28,h*.75/f)),z=a>8?2:1,u=Math.ceil(i.length/12),he=[];for(let d=0;d<=a;d+=z)he.push(A`<line class="grid" x1=${k.left} x2=${ke-k.right} y1=${c(d)} y2=${c(d)}></line>
        <text class="axis" x=${k.left-6} y=${c(d)+4} text-anchor="end">${d}</text>`);let F=(d,C,P)=>d==null?_:A`<rect class=${P} x=${C} y=${c(d)} width=${v} height=${c(0)-c(d)} rx="2"></rect>`,U=(d,C,P)=>d==null?_:A`<line class=${P} x1=${C-2} x2=${C+v*f+2} y1=${c(d)} y2=${c(d)}></line>`,re=i.map((d,C)=>{let P=k.left+C*h+(h-v*f)/2,V=k.left+C*h+h/2,I=[$t(d,t.period,s),`${r("heat_pump")}: ${S(d.cop_heat_pump)} (${S(d.heat_kwh,1)} kWh ${r("heat")} / ${S(d.heat_pump_electricity_kwh,1)} kWh ${r("electricity")})`,`${r("total")}: ${S(d.cop)} (+ ${S(d.standby_kwh,1)} kWh ${r("standby").toLowerCase()}, + ${S(d.indoor_unit_kwh,1)} kWh ${r("pumps")})`,`${r("heating")}: ${S(d.cop_heating)} (${S(d.heating_heat_kwh,1)} / ${S(d.heating_electricity_kwh,1)} kWh)`,...t.has_dhw?[`${r("dhw")}: ${S(d.cop_dhw)} (${S(d.dhw_heat_kwh,1)} / ${S(d.dhw_electricity_kwh,1)} kWh)`]:[]].join(`
`);return A`<g>
        <title>${I}</title>
        <rect class="hit" x=${k.left+C*h} y=${k.top} width=${h} height=${m}></rect>
        ${F(d.cop_heating,P,"heating")}
        ${t.has_dhw?F(d.cop_dhw,P+v,"dhw"):_}
        ${U(d.cop_heat_pump,P,"heat-pump")}
        ${U(d.cop,P,"total")}
        ${C%u===0?A`<text class="axis" x=${V} y=${Se-8} text-anchor="middle">${Je(d,t.period,s)}</text>`:_}
      </g>`});return y`<svg viewBox="0 0 ${ke} ${Se}" role="img" aria-label=${r("cop_history")}>
      ${he}${re}
    </svg>`}_renderLegend(t,r){return y`<div class="legend">
      <span><i class="swatch heating"></i>${r("heating")}</span>
      ${t.has_dhw?y`<span><i class="swatch dhw"></i>${r("dhw")}</span>`:_}
      <span><i class="swatch heat-pump"></i>${r("heat_pump")}</span>
      <span><i class="swatch total"></i>${r("total")}</span>
    </div>`}static{this.styles=q`
    ha-card {
      padding: 12px 16px 12px;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .title {
      font-size: var(--ha-card-header-font-size, 24px);
      line-height: 1.3;
    }
    .kinds {
      display: inline-flex;
      border: 1px solid var(--divider-color);
      border-radius: 16px;
      overflow: hidden;
    }
    .kinds button {
      background: none;
      border: 0;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
      padding: 4px 12px;
      cursor: pointer;
    }
    .kinds button.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    svg {
      width: 100%;
      height: auto;
      display: block;
      margin-top: 8px;
    }
    .grid {
      stroke: var(--divider-color);
      stroke-width: 1;
    }
    .axis {
      fill: var(--secondary-text-color);
      font-size: 11px;
    }
    .hit {
      fill: transparent;
    }
    g:hover .hit {
      fill: var(--secondary-background-color);
      opacity: 0.5;
    }
    .heating {
      fill: var(--orange-color, #ff9800);
    }
    .dhw {
      fill: var(--blue-color, #2196f3);
    }
    line.heat-pump {
      stroke: var(--primary-text-color);
      stroke-width: 2.5;
      stroke-linecap: round;
    }
    line.total {
      stroke: var(--error-color, #db4437);
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-dasharray: 4 3;
    }
    .legend {
      display: flex;
      gap: 16px;
      justify-content: center;
      font-size: 13px;
      color: var(--secondary-text-color);
      margin-top: 4px;
    }
    .swatch {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 2px;
      margin-right: 6px;
      vertical-align: middle;
    }
    .swatch.heating {
      background: var(--orange-color, #ff9800);
    }
    .swatch.dhw {
      background: var(--blue-color, #2196f3);
    }
    .swatch.heat-pump {
      height: 3px;
      background: var(--primary-text-color);
    }
    .swatch.total {
      height: 3px;
      background: repeating-linear-gradient(90deg, var(--error-color, #db4437) 0 4px, transparent 4px 7px);
    }
    .message {
      padding: 24px 0;
      text-align: center;
      color: var(--secondary-text-color);
    }
  `}};var R="weheat-insights-scatter-card",Ee=600,Pe=300,x={left:46,right:12,top:12,bottom:40},bt=3600*1e3;function Xe(n,e,t=6){if(!isFinite(n)||!isFinite(e))return[];n===e&&(n-=1,e+=1);let r=(e-n)/t,s=10**Math.floor(Math.log10(r)),o=[1,2,2.5,5,10].map(l=>l*s).find(l=>l>=r)??r,i=[];for(let l=Math.floor(n/o)*o;l<=e+o*1e-9;l+=o)i.push(Math.round(l*1e6)/1e6);return i[i.length-1]<e&&i.push(i[i.length-1]+o),i}function wt(n,e){if(!n.length)return null;if(e<=n[0].x)return n.length>1?He(n[0],n[1],e):n[0].y;for(let r=1;r<n.length;r++)if(e<=n[r].x)return He(n[r-1],n[r],e);let t=n.length;return t>1?He(n[t-2],n[t-1],e):n[0].y}function He(n,e,t){return n.y+(e.y-n.y)*(t-n.x)/(e.x-n.x)}function xt(n,e,t){return`hsl(${(220-220*(t>e?Math.min(1,Math.max(0,(n-e)/(t-e))):.5)).toFixed(0)} 75% 48%)`}var le=class extends H{static{this.properties={hass:{attribute:!1},_config:{state:!0},_data:{state:!0},_error:{state:!0}}}setConfig(e){if(!e.entry_id)throw new Error("entry_id is required");if(e.mode!=="heat_loss"&&e.mode!=="supply_curve")throw new Error('mode must be "heat_loss" or "supply_curve"');this._config=e,this._data=void 0}getCardSize(){return 6}getGridOptions(){return{columns:"full",min_rows:5}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._fetch(!0),bt)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._timer)}willUpdate(e){(e.has("hass")||e.has("_config"))&&this._fetch(!1)}async _fetch(e){if(!this.hass||!this._config)return;let{entry_id:t,mode:r,days:s}=this._config,o=`${t}:${r}:${s??""}`;if(!(!e&&o===this._fetchedKey)){this._fetchedKey=o;try{this._data=r==="heat_loss"?await this.hass.callWS({type:"weheat_insights/heat_loss",entry_id:t}):await this.hass.callWS({type:"weheat_insights/supply_curve",entry_id:t,days:s??60}),this._error=void 0}catch(i){this._error=i instanceof Error?i.message:JSON.stringify(i)}}}render(){if(!this.hass||!this._config)return _;let e=j(this.hass),t=this._config.mode==="heat_loss";return y`<ha-card>
      <div class="title">${this._config.title??e(t?"heat_loss_title":"supply_curve_title")}</div>
      ${this._error?y`<div class="message">${this._error}</div>`:this._data?t?this._renderHeatLoss(this._data,e):this._renderSupply(this._data,e):y`<div class="message">…</div>`}
    </ha-card>`}_renderHeatLoss(e,t){let r=G(this.hass),s=new Intl.NumberFormat(r,{maximumFractionDigits:1}),o=e.points.map(a=>({x:a.delta_k,y:a.heating_kwh,cls:a.excluded?"excluded":"used",tip:`${a.day}: ${s.format(a.delta_k)} K, ${s.format(a.heating_kwh)} kWh${a.excluded?` (${t("excluded")})`:""}`})),i=e.fit,l=i?y`<div class="summary">
          <strong>${Math.round(e.coefficient_w_per_k)} ± ${Math.round(e.confidence_95_w_per_k)} W/K</strong>
          · R² ${i.r_squared.toFixed(2)} · ${e.days_used} ${t("days_used")}
        </div>`:y`<div class="summary muted">${e.reason?t(`reason_${e.reason}`):""}</div>`;return y`${l}
      ${this._chart(o,{xLabel:t("indoor_outdoor_diff"),yLabel:t("heating_per_day"),includeZeroY:!0,line:i?a=>i.slope*a+i.intercept:void 0})}
      <div class="legend">
        <span><i class="dot used"></i>${t("used")}</span>
        <span><i class="dot excluded"></i>${t("excluded")}</span>
        ${i?y`<span><i class="line"></i>${t("fit_line")}</span>`:_}
      </div>
      ${e.indoor_assumed?y`<div class="note">${t("indoor_assumed_note")}</div>`:_}`}_renderSupply(e,t){if(!e.points.length)return y`<div class="message">${t("no_data")}</div>`;let r=G(this.hass),s=new Intl.NumberFormat(r,{maximumFractionDigits:1}),o=e.points.map(h=>h.delta_t_k).sort((h,f)=>h-f),i=o[Math.floor(o.length*.05)],l=o[Math.min(o.length-1,Math.floor(o.length*.95))],a=e.points.map(h=>({x:h.outdoor_c,y:h.supply_c,color:xt(h.delta_t_k,i,l),tip:`${new Date(h.time).toLocaleString(r,{dateStyle:"short",timeStyle:"short"})}: ${s.format(h.outdoor_c)} \xB0C \u2192 ${s.format(h.supply_c)} \xB0C, \u0394T ${s.format(h.delta_t_k)} K`})),p=(h,f="supply_c")=>h.filter(v=>v[f]!=null).map(v=>({x:v.outdoor_c,y:v[f]})).sort((v,z)=>v.x-z.x),m=e.curves,c=[];return m?.advice.length&&c.push({cls:"advice",points:p(m.advice),band:[p(m.advice,"low_c"),p(m.advice,"high_c")]}),m&&m.current.length>1&&c.push({cls:"current",points:p(m.current)}),y`${this._chart(a,{xLabel:t("outdoor_temp"),yLabel:t("supply_temp"),curves:c})}
      <div class="legend">
        <span>ΔT ${s.format(i)} K</span>
        <i class="gradient"></i>
        <span>${s.format(l)} K</span>
        ${c.some(h=>h.cls==="current")?y`<span><i class="line current"></i>${t("current_curve")}</span>`:_}
        ${c.some(h=>h.cls==="advice")?y`<span><i class="line advice"></i>${t("advised_curve")}</span>`:_}
      </div>`}_chart(e,t){if(!e.length)return y`<div class="message">${j(this.hass)("no_data")}</div>`;let r=e.map(u=>u.x),s=e.map(u=>u.y),o=Xe(Math.min(...r),Math.max(...r)),i=Xe(t.includeZeroY?Math.min(0,...s):Math.min(...s),Math.max(...s)),[l,a]=[o[0],o[o.length-1]],[p,m]=[i[0],i[i.length-1]],c=Ee-x.left-x.right,h=Pe-x.top-x.bottom,f=u=>x.left+(u-l)/(a-l)*c,v=u=>x.top+h-(u-p)/(m-p)*h,z=u=>Math.min(m,Math.max(p,u));return y`<svg viewBox="0 0 ${Ee} ${Pe}" role="img" aria-label=${t.yLabel}>
      ${i.map(u=>A`<line class="grid" x1=${x.left} x2=${Ee-x.right} y1=${v(u)} y2=${v(u)}></line>
          <text class="axis" x=${x.left-6} y=${v(u)+4} text-anchor="end">${u}</text>`)}
      ${o.map(u=>A`<line class="grid" x1=${f(u)} x2=${f(u)} y1=${x.top} y2=${x.top+h}></line>
          <text class="axis" x=${f(u)} y=${x.top+h+16} text-anchor="middle">${u}</text>`)}
      <text class="label" x=${x.left+c/2} y=${Pe-4} text-anchor="middle">${t.xLabel}</text>
      <text class="label" transform="translate(12 ${x.top+h/2}) rotate(-90)" text-anchor="middle">${t.yLabel}</text>
      ${e.map(u=>A`<circle class=${u.cls??""} cx=${f(u.x)} cy=${v(u.y)} r="3.5" style=${u.color?`fill:${u.color}`:""}>
          <title>${u.tip}</title>
        </circle>`)}
      ${(t.curves??[]).map(u=>{let F=u.points.map(V=>V.x),U=u.band?l:Math.max(l,Math.min(...F)),re=u.band?a:Math.min(a,Math.max(...F));if(re<=U)return _;let d=Array.from({length:41},(V,I)=>U+(re-U)*I/40),C=V=>d.map(I=>`${f(I)},${v(z(wt(V,I)??p))}`).join(" "),P=u.band?A`<polygon class="band ${u.cls}" points=${`${C(u.band[1])} ${C(u.band[0]).split(" ").reverse().join(" ")}`}></polygon>`:_;return A`${P}<polyline class="curve ${u.cls}" points=${C(u.points)}></polyline>`})}
      ${t.line?A`<line class="fit" x1=${f(l)} y1=${v(z(t.line(l)))} x2=${f(a)} y2=${v(z(t.line(a)))}></line>`:_}
    </svg>`}static{this.styles=q`
    ha-card {
      padding: 12px 16px;
    }
    .title {
      font-size: var(--ha-card-header-font-size, 24px);
      line-height: 1.3;
    }
    .summary {
      margin-top: 4px;
      color: var(--primary-text-color);
    }
    .muted,
    .note {
      color: var(--secondary-text-color);
    }
    .note {
      font-size: 13px;
      margin-top: 4px;
    }
    svg {
      width: 100%;
      height: auto;
      display: block;
      margin-top: 8px;
    }
    .grid {
      stroke: var(--divider-color);
      stroke-width: 1;
    }
    .axis,
    .label {
      fill: var(--secondary-text-color);
      font-size: 11px;
    }
    circle {
      fill: var(--primary-color);
      fill-opacity: 0.8;
    }
    circle.excluded {
      fill: var(--disabled-text-color, #bdbdbd);
      fill-opacity: 0.6;
    }
    polyline.curve {
      fill: none;
      stroke-width: 2.5;
    }
    polyline.curve.advice {
      stroke: var(--primary-text-color);
    }
    polyline.curve.current {
      stroke: var(--secondary-text-color);
      stroke-dasharray: 6 4;
    }
    polygon.band {
      fill: var(--primary-text-color);
      fill-opacity: 0.08;
      stroke: none;
    }
    .line.current {
      background: repeating-linear-gradient(90deg, var(--secondary-text-color) 0 6px, transparent 6px 9px);
    }
    line.fit {
      stroke: var(--primary-text-color);
      stroke-width: 2;
    }
    .legend {
      display: flex;
      gap: 12px;
      justify-content: center;
      align-items: center;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 6px;
      vertical-align: middle;
    }
    .dot.used {
      background: var(--primary-color);
    }
    .dot.excluded {
      background: var(--disabled-text-color, #bdbdbd);
    }
    .line {
      display: inline-block;
      width: 14px;
      height: 2px;
      margin-right: 6px;
      vertical-align: middle;
      background: var(--primary-text-color);
    }
    .gradient {
      display: inline-block;
      width: 120px;
      height: 10px;
      border-radius: 5px;
      background: linear-gradient(90deg, hsl(220 75% 48%), hsl(110 75% 48%), hsl(40 75% 48%), hsl(0 75% 48%));
    }
    .message {
      padding: 24px 0;
      text-align: center;
      color: var(--secondary-text-color);
    }
  `}};var E=n=>n.filter(e=>!!e);function w(n,e){return{type:"heading",heading:n,heading_style:"title",...e?{icon:e}:{}}}function g(n,e){return n?{type:"tile",entity:n,name:e}:null}function b(n,e){return n?{entity:n,name:e}:null}function de(n,e,t){return e.length?{type:"history-graph",title:n,hours_to_show:t,entities:e,grid_options:{columns:"full"}}:null}function Le(n,e,t){return e.length?{type:"statistics-graph",title:n,entities:e,days_to_show:t,period:"hour",stat_types:["mean"],chart_type:"line",grid_options:{columns:"full"}}:null}function $(n,e,t=!1){let r=E(n);return r.length<=(t?0:1)?null:{type:"grid",cards:r,...e?{column_span:e}:{}}}function ce(n,e,t,r,s="full"){return e.length?{type:"statistics-graph",title:n,entities:e,period:t,days_to_show:r,stat_types:["change"],chart_type:"bar",grid_options:{columns:s}}:null}var Ct=["heating","dhw","legionella_prevention"];function At(n,e,t){if(!n)return null;let r={type:"gauge",entity:n,name:t("cop"),min:0,max:7,needle:!0,severity:{red:0,yellow:3,green:4}};return e?{type:"conditional",conditions:[{condition:"state",entity:e,state:Ct}],card:r}:r}function kt(n){return n.indoor_entity_id??n.weheat.thermostat_room_temperature}function St(n,e,t){let r=n.weheat,s=kt(n),o=n.outdoor_entity_id??r.outside_temperature,i=E([b(r.water_outlet_temperature,e("supply")),b(r.water_inlet_temperature,e("return")),b(o,e("outdoor")),b(s,e("room"))]),l=E([b(r.power_input,e("power_input")),b(r.power_output,e("power_output"))]),a=E([b(n.insights.delta_t,e("delta_t"))]),p=$([w(e("live"),"mdi:heat-pump"),g(r.heat_pump_state,e("state")),At(r.cop,r.heat_pump_state,e),g(s,e("room")),g(o,e("outdoor")),g(r.water_outlet_temperature,e("supply")),g(r.water_inlet_temperature,e("return")),g(n.insights.delta_t,e("delta_t_short")),g(r.power_input,e("power_input_short")),g(r.power_output,e("power_output_short"))]),m=$([w(e("last_24h"),"mdi:clock-outline"),de(e("temperatures"),i,24),de(e("power"),l,24),de(e("delta_t"),a,24),de(e("state"),E([b(r.heat_pump_state,e("state"))]),24)]),c=$([w(e("last_7d"),"mdi:calendar-week"),Le(e("temperatures"),i,7),Le(e("power"),l,7),Le(e("delta_t"),a,7)]);return{title:n.name,path:t===0?"heat-pump":`heat-pump-${t+1}`,icon:"mdi:heat-pump-outline",type:"sections",max_columns:3,sections:E([p,m,c])}}function Et(n,e,t){let r=n.weheat,s=n.insights,o=$([w(e("scop_heading"),"mdi:chart-bar"),g(s.scop_heat_pump_season,e("heat_pump")),g(s.scop_season,e("total")),g(s.scop_heating_season,e("heating")),g(s.scop_dhw_season,e("dhw")),g(s.defrost_cop_impact_season,e("defrost_loss")),w(e("cop_month"),"mdi:calendar-month"),g(s.cop_heat_pump_month,e("heat_pump")),g(s.cop_month,e("total")),w(e("cop_today"),"mdi:calendar-today"),g(s.cop_heat_pump_today,e("heat_pump")),g(s.cop_today,e("total"))]),i=$([{type:`custom:${N}`,entry_id:n.entry_id}],2,!0),l=$([w(e("energy_per_day"),"mdi:lightning-bolt"),ce(`${e("energy_per_day")} \xB7 ${e("electricity")}`,E([b(r.electricity_used_heating,e("heating")),b(r.electricity_used_dhw,e("dhw")),b(r.electricity_used_defrost,e("defrost")),b(r.electricity_used_standby,e("standby"))]),"day",30),ce(`${e("energy_per_day")} \xB7 ${e("heat")}`,E([b(r.energy_output_heating,e("heating")),b(r.energy_output_dhw,e("dhw")),b(r.energy_output_defrost,e("defrost"))]),"day",30)],2),a=$([w(e("title"),"mdi:information-outline"),{type:"markdown",content:`${e("definitions")}

_${e("disclaimer")}_`}]);return{title:`${n.name} \xB7 ${e("performance")}`,path:t===0?"performance":`performance-${t+1}`,icon:"mdi:chart-bar",type:"sections",max_columns:4,sections:E([o,i,l,a])}}function Pt(n,e,t){let r=n.insights,s=$([w(e("house"),"mdi:home-thermometer"),g(r.heat_loss_coefficient,e("heat_loss_short")),g(r.heat_loss_design_load,e("heat_loss_design")),g(r.balance_point,e("balance_point")),g(r.cool_down_time_constant,e("cool_down_tau")),g(r.cool_down_rate,e("cool_down_rate")),g(r.thermal_mass,e("thermal_mass"))]),o=$([{type:`custom:${R}`,entry_id:n.entry_id,mode:"heat_loss"}],2,!0),i=$([w(e("title"),"mdi:information-outline"),{type:"markdown",content:`${e("house_definitions")}

_${e("disclaimer")}_`}]),l=n.degree_days_statistic_id?{entity:n.degree_days_statistic_id,name:e("degree_days")}:null,a=$([w(e("heat_per_degree_day"),"mdi:home-thermometer-outline"),g(r.heat_per_degree_day_season,e("this_season")),g(r.heat_per_degree_day_last_year,e("last_year_to_date")),g(r.heat_per_degree_day_last_season,e("whole_last_season")),w(e("degree_days"),"mdi:thermometer-lines"),g(r.degree_days_month,e("this_month")),g(r.degree_days_season,e("this_season"))]),p=$([l?ce(e("degree_days_per_month"),[l],"month",400,6):null,l?ce(e("degree_days_per_day"),[l],"day",30,6):null],2,!0);return{title:`${n.name} \xB7 ${e("house")}`,path:t===0?"house":`house-${t+1}`,icon:"mdi:home-thermometer-outline",type:"sections",max_columns:4,sections:E([s,o,a,p,i])}}var Ht=[[-20,"curve_advice_minus_20"],[9,"curve_advice_9"],[15,"curve_advice_15"],[20,"curve_advice_20"],[25,"curve_advice_25"]],Qe=n=>n.replace(/\\/g,"\\\\").replace(/'/g,"\\'");function Lt(n,e){let t=Ht.filter(([,o])=>n.insights[o]);if(!t.length)return null;let r=n.insights[t[0][1]];return[`{% set reason = state_attr('${r}', 'no_advice_reason') %}`,`**${e("curve_target")}:** {{ state_attr('${r}', 'target_room_temperature') }} \xB0C \xB7 ${e("curve_measured")}: {{ state_attr('${r}', 'measured_indoor_temperature') or '\u2013' }} \xB0C`,"",`{% if reason %}${e("curve_no_advice")} {{ {'no_heat_loss': '${Qe(e("reason_no_heat_loss"))}', 'too_few_steady_hours': '${Qe(e("reason_too_few_steady_hours"))}'}.get(reason, reason) }}{% endif %}`,"",`| ${e("curve_outdoor")} (\xB0C) | ${e("curve_current")} (\xB0C) | ${e("curve_advice")} (\xB0C) | ${e("curve_range")} (\xB0C) |`,"|---:|---:|---:|:---|",...t.map(([o,i])=>{let l=n.insights[i],a=`states('${l}') | float(none)`,p=`state_attr('${l}', 'current')`;return`| ${o} | {{ ${p} if ${p} is not none else '\u2013' }} | {{ '**' ~ (${a}) ~ '**' if (${a}) is not none else '\u2013' }} | {% if state_attr('${l}', 'no_heat_needed') %}${e("curve_no_heat")}{% elif state_attr('${l}', 'range_low') is not none %}{{ state_attr('${l}', 'range_low') }}\u2013{{ state_attr('${l}', 'range_high') }}{% if state_attr('${l}', 'extrapolated') %} (${e("curve_extrapolated")}){% endif %}{% endif %} |`})].join(`
`)}function Tt(n,e,t){let r=n.insights,s=Lt(n,e),o=$([w(e("curve_advice"),"mdi:chart-bell-curve-cumulative"),s?{type:"markdown",content:s}:null]),i=$([{type:`custom:${R}`,entry_id:n.entry_id,mode:"supply_curve",days:60}],2,!0),l=$([w(e("before_after"),"mdi:swap-vertical"),g(r.heating_electricity_per_degree_day_before,e("per_degree_day_before")),g(r.heating_electricity_per_degree_day_after,e("per_degree_day_after")),g(r.heating_curve_change_effect,e("change_effect"))]),a=$([w(e("title"),"mdi:information-outline"),{type:"markdown",content:`${e("curve_definitions")}

_${e("disclaimer")}_`}]);return{title:`${n.name} \xB7 ${e("heating_curve")}`,path:t===0?"heating-curve":`heating-curve-${t+1}`,icon:"mdi:chart-bell-curve-cumulative",type:"sections",max_columns:4,sections:E([o,i,l,a])}}function et(n,e,t){return{title:n("title"),path:"weheat-insights",type:"panel",cards:[{type:"markdown",content:`## ${e}

${t}

_${n("disclaimer")}_`}]}}function tt(n,e){return n.length?{title:e("title"),views:n.flatMap((t,r)=>[Et(t,e,r),Pt(t,e,r),Tt(t,e,r),St(t,e,r)])}:{title:e("title"),views:[et(e,e("no_pumps_title"),e("no_pumps_body"))]}}function rt(n,e){return{title:n("title"),views:[et(n,n("error_title"),`${n("error_body")}

\`${e}\``)]}}var nt="ll-strategy-dashboard-weheat-insights",Te=class extends HTMLElement{static async generate(e,t){let r=j(t);try{let s=await t.callWS({type:"weheat_insights/dashboard_config"});return tt(s.heat_pumps,r)}catch(s){let o=s instanceof Error?s.message:JSON.stringify(s);return rt(r,o)}}};customElements.get(nt)||customElements.define(nt,Te);customElements.get(N)||customElements.define(N,ae);customElements.get(R)||customElements.define(R,le);window.customCards=window.customCards??[];window.customCards.some(n=>n.type===N)||window.customCards.push({type:N,name:"Weheat Insights performance",description:"COP per day, month or season for heating and hot water (unofficial)"});window.customCards.some(n=>n.type===R)||window.customCards.push({type:R,name:"Weheat Insights scatter",description:"Heat loss of the house or supply vs outdoor temperature (unofficial)"});window.customStrategies=window.customStrategies??[];window.customStrategies.some(n=>n.type==="weheat-insights")||window.customStrategies.push({type:"weheat-insights",strategyType:"dashboard",name:"Weheat Insights",description:"Live overview and history for Weheat heat pumps (unofficial)"});
