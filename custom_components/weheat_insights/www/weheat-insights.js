var _e=globalThis,me=_e.ShadowRoot&&(_e.ShadyCSS===void 0||_e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ae=Symbol(),Ye=new WeakMap,ne=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==Ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(me&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=Ye.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&Ye.set(t,e))}return e}toString(){return this.cssText}},Ze=n=>new ne(typeof n=="string"?n:n+"",void 0,Ae),j=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((r,o,a)=>r+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+n[a+1],n[0]);return new ne(t,n,Ae)},Je=(n,e)=>{if(me)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let r=document.createElement("style"),o=_e.litNonce;o!==void 0&&r.setAttribute("nonce",o),r.textContent=t.cssText,n.appendChild(r)}},Se=me?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return Ze(t)})(n):n;var{is:vt,defineProperty:$t,getOwnPropertyDescriptor:bt,getOwnPropertyNames:xt,getOwnPropertySymbols:kt,getPrototypeOf:Ct}=Object,ge=globalThis,Xe=ge.trustedTypes,At=Xe?Xe.emptyScript:"",St=ge.reactiveElementPolyfillSupport,oe=(n,e)=>n,Ee={toAttribute(n,e){switch(e){case Boolean:n=n?At:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},et=(n,e)=>!vt(n,e),Qe={attribute:!0,type:String,converter:Ee,reflect:!1,useDefault:!1,hasChanged:et};Symbol.metadata??=Symbol("metadata"),ge.litPropertyMetadata??=new WeakMap;var N=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Qe){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let r=Symbol(),o=this.getPropertyDescriptor(e,r,t);o!==void 0&&$t(this.prototype,e,o)}}static getPropertyDescriptor(e,t,r){let{get:o,set:a}=bt(this.prototype,e)??{get(){return this[t]},set(s){this[t]=s}};return{get:o,set(s){let d=o?.call(this);a?.call(this,s),this.requestUpdate(e,d,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Qe}static _$Ei(){if(this.hasOwnProperty(oe("elementProperties")))return;let e=Ct(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(oe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(oe("properties"))){let t=this.properties,r=[...xt(t),...kt(t)];for(let o of r)this.createProperty(o,t[o])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[r,o]of t)this.elementProperties.set(r,o)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let o=this._$Eu(t,r);o!==void 0&&this._$Eh.set(o,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let o of r)t.unshift(Se(o))}else e!==void 0&&t.push(Se(e));return t}static _$Eu(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Je(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){let r=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,r);if(o!==void 0&&r.reflect===!0){let a=(r.converter?.toAttribute!==void 0?r.converter:Ee).toAttribute(t,r.type);this._$Em=e,a==null?this.removeAttribute(o):this.setAttribute(o,a),this._$Em=null}}_$AK(e,t){let r=this.constructor,o=r._$Eh.get(e);if(o!==void 0&&this._$Em!==o){let a=r.getPropertyOptions(o),s=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:Ee;this._$Em=o;let d=s.fromAttribute(t,a.type);this[o]=d??this._$Ej?.get(o)??d,this._$Em=null}}requestUpdate(e,t,r,o=!1,a){if(e!==void 0){let s=this.constructor;if(o===!1&&(a=this[e]),r??=s.getPropertyOptions(e),!((r.hasChanged??et)(a,t)||r.useDefault&&r.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:o,wrapped:a},s){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),a!==!0||s!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),o===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,a]of this._$Ep)this[o]=a;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[o,a]of r){let{wrapped:s}=a,d=this[o];s!==!0||this._$AL.has(o)||d===void 0||this.C(o,void 0,a,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};N.elementStyles=[],N.shadowRootOptions={mode:"open"},N[oe("elementProperties")]=new Map,N[oe("finalized")]=new Map,St?.({ReactiveElement:N}),(ge.reactiveElementVersions??=[]).push("2.1.2");var De=globalThis,tt=n=>n,fe=De.trustedTypes,rt=fe?fe.createPolicy("lit-html",{createHTML:n=>n}):void 0,dt="$lit$",V=`lit$${Math.random().toFixed(9).slice(2)}$`,lt="?"+V,Et=`<${lt}>`,K=document,ae=()=>K.createComment(""),ie=n=>n===null||typeof n!="object"&&typeof n!="function",Oe=Array.isArray,Tt=n=>Oe(n)||typeof n?.[Symbol.iterator]=="function",Te=`[ 	
\f\r]`,se=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,nt=/-->/g,ot=/>/g,F=RegExp(`>|${Te}(?:([^\\s"'>=/]+)(${Te}*=${Te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),st=/'/g,at=/"/g,ct=/^(?:script|style|textarea|title)$/i,Me=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),m=Me(1),b=Me(2),dr=Me(3),q=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),it=new WeakMap,G=K.createTreeWalker(K,129);function ht(n,e){if(!Oe(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return rt!==void 0?rt.createHTML(e):e}var Pt=(n,e)=>{let t=n.length-1,r=[],o,a=e===2?"<svg>":e===3?"<math>":"",s=se;for(let d=0;d<t;d++){let l=n[d],c,h,i=-1,g=0;for(;g<l.length&&(s.lastIndex=g,h=s.exec(l),h!==null);)g=s.lastIndex,s===se?h[1]==="!--"?s=nt:h[1]!==void 0?s=ot:h[2]!==void 0?(ct.test(h[2])&&(o=RegExp("</"+h[2],"g")),s=F):h[3]!==void 0&&(s=F):s===F?h[0]===">"?(s=o??se,i=-1):h[1]===void 0?i=-2:(i=s.lastIndex-h[2].length,c=h[1],s=h[3]===void 0?F:h[3]==='"'?at:st):s===at||s===st?s=F:s===nt||s===ot?s=se:(s=F,o=void 0);let u=s===F&&n[d+1].startsWith("/>")?" ":"";a+=s===se?l+Et:i>=0?(r.push(c),l.slice(0,i)+dt+l.slice(i)+V+u):l+V+(i===-2?d:u)}return[ht(n,a+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},de=class n{constructor({strings:e,_$litType$:t},r){let o;this.parts=[];let a=0,s=0,d=e.length-1,l=this.parts,[c,h]=Pt(e,t);if(this.el=n.createElement(c,r),G.currentNode=this.el.content,t===2||t===3){let i=this.el.content.firstChild;i.replaceWith(...i.childNodes)}for(;(o=G.nextNode())!==null&&l.length<d;){if(o.nodeType===1){if(o.hasAttributes())for(let i of o.getAttributeNames())if(i.endsWith(dt)){let g=h[s++],u=o.getAttribute(i).split(V),v=/([.?@])?(.*)/.exec(g);l.push({type:1,index:a,name:v[2],strings:u,ctor:v[1]==="."?He:v[1]==="?"?ze:v[1]==="@"?Le:ee}),o.removeAttribute(i)}else i.startsWith(V)&&(l.push({type:6,index:a}),o.removeAttribute(i));if(ct.test(o.tagName)){let i=o.textContent.split(V),g=i.length-1;if(g>0){o.textContent=fe?fe.emptyScript:"";for(let u=0;u<g;u++)o.append(i[u],ae()),G.nextNode(),l.push({type:2,index:++a});o.append(i[g],ae())}}}else if(o.nodeType===8)if(o.data===lt)l.push({type:2,index:a});else{let i=-1;for(;(i=o.data.indexOf(V,i+1))!==-1;)l.push({type:7,index:a}),i+=V.length-1}a++}}static createElement(e,t){let r=K.createElement("template");return r.innerHTML=e,r}};function Q(n,e,t=n,r){if(e===q)return e;let o=r!==void 0?t._$Co?.[r]:t._$Cl,a=ie(e)?void 0:e._$litDirective$;return o?.constructor!==a&&(o?._$AO?.(!1),a===void 0?o=void 0:(o=new a(n),o._$AT(n,t,r)),r!==void 0?(t._$Co??=[])[r]=o:t._$Cl=o),o!==void 0&&(e=Q(n,o._$AS(n,e.values),o,r)),e}var Pe=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:r}=this._$AD,o=(e?.creationScope??K).importNode(t,!0);G.currentNode=o;let a=G.nextNode(),s=0,d=0,l=r[0];for(;l!==void 0;){if(s===l.index){let c;l.type===2?c=new le(a,a.nextSibling,this,e):l.type===1?c=new l.ctor(a,l.name,l.strings,this,e):l.type===6&&(c=new Re(a,this,e)),this._$AV.push(c),l=r[++d]}s!==l?.index&&(a=G.nextNode(),s++)}return G.currentNode=K,o}p(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},le=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,o){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Q(this,e,t),ie(e)?e===f||e==null||e===""?(this._$AH!==f&&this._$AR(),this._$AH=f):e!==this._$AH&&e!==q&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Tt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==f&&ie(this._$AH)?this._$AA.nextSibling.data=e:this.T(K.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:r}=e,o=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=de.createElement(ht(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===o)this._$AH.p(t);else{let a=new Pe(o,this),s=a.u(this.options);a.p(t),this.T(s),this._$AH=a}}_$AC(e){let t=it.get(e.strings);return t===void 0&&it.set(e.strings,t=new de(e)),t}k(e){Oe(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,o=0;for(let a of e)o===t.length?t.push(r=new n(this.O(ae()),this.O(ae()),this,this.options)):r=t[o],r._$AI(a),o++;o<t.length&&(this._$AR(r&&r._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let r=tt(e).nextSibling;tt(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},ee=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,o,a){this.type=1,this._$AH=f,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=a,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=f}_$AI(e,t=this,r,o){let a=this.strings,s=!1;if(a===void 0)e=Q(this,e,t,0),s=!ie(e)||e!==this._$AH&&e!==q,s&&(this._$AH=e);else{let d=e,l,c;for(e=a[0],l=0;l<a.length-1;l++)c=Q(this,d[r+l],t,l),c===q&&(c=this._$AH[l]),s||=!ie(c)||c!==this._$AH[l],c===f?e=f:e!==f&&(e+=(c??"")+a[l+1]),this._$AH[l]=c}s&&!o&&this.j(e)}j(e){e===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},He=class extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===f?void 0:e}},ze=class extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==f)}},Le=class extends ee{constructor(e,t,r,o,a){super(e,t,r,o,a),this.type=5}_$AI(e,t=this){if((e=Q(this,e,t,0)??f)===q)return;let r=this._$AH,o=e===f&&r!==f||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,a=e!==f&&(r===f||o);o&&this.element.removeEventListener(this.name,this,r),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Re=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){Q(this,e)}};var Ht=De.litHtmlPolyfillSupport;Ht?.(de,le),(De.litHtmlVersions??=[]).push("3.3.3");var ut=(n,e,t)=>{let r=t?.renderBefore??e,o=r._$litPart$;if(o===void 0){let a=t?.renderBefore??null;r._$litPart$=o=new le(e.insertBefore(ae(),a),a,void 0,t??{})}return o._$AI(n),o};var We=globalThis,P=class extends N{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ut(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};P._$litElement$=!0,P.finalized=!0,We.litElementHydrateSupport?.({LitElement:P});var zt=We.litElementPolyfillSupport;zt?.({LitElement:P});(We.litElementVersions??=[]).push("4.2.2");var je={title:"Weheat Insights",live:"Live",last_24h:"Last 24 hours",last_7d:"Last 7 days",water_temperatures:"Water temperature",air_temperatures:"Outdoor and room temperature",power:"Power",cop:"COP",delta_t:"\u0394T supply/return",state:"Operating state",room:"Room",room_setpoint:"Target temperature",outdoor:"Outdoor",supply:"Supply",return:"Return",power_input:"Electrical power",power_output:"Heat output",no_pumps_title:"No heat pump set up yet",no_pumps_body:"Add the **Weheat Insights** integration under *Settings \u2192 Devices & services* and pick a heat pump. This dashboard fills itself in once that is done.",error_title:"Weheat Insights is not available",error_body:"The dashboard could not load its configuration. Check that the Weheat Insights integration is installed and loaded.",disclaimer:"Unofficial community project, not affiliated with Weheat.",performance:"Performance",cop_history:"COP over time",day:"Day",month:"Month",season:"Season",heating:"Heating",dhw:"Hot water",total:"Total",no_data:"No data for this period yet.",electricity:"electricity",heat:"heat",scop_season:"SCOP this season",cop_month:"COP this month",cop_today:"COP today",defrost_cop_impact:"COP lost to defrost",degree_days_month:"Degree days this month",degree_days_season:"Degree days this season",heat_per_degree_day:"Heating per degree day",heat_per_degree_day_last_year:"Same period last season",heat_per_degree_day_last_season:"Whole last season",energy_per_day:"Energy per day",degree_days_per_day:"Degree days per day",degree_days_per_month:"Degree days per month",defrost:"Defrost",house:"House",heat_loss_short:"Heat loss",heating_curve:"Heating curve",advised_curve:"advice",curve_advice:"Advice",curve_current:"Current",current_curve:"current curve",curve_enter_current:"To compare with your current heating curve, enter it under Settings \u2192 Devices & services \u2192 Weheat Insights \u2192 Configure (the five water temperatures from the Weheat app).",curve_outdoor:"Outdoor",curve_range:"Range",curve_extrapolated:"extrapolated",curve_extrapolated_note:"Based on extrapolation: this outdoor temperature is far outside the temperatures measured so far. Treat this advice as a starting point.",curve_no_heat:"no heat needed",curve_target:"Target room temperature",decimal_separator:".",operation:"Operation",op_share_30d:"Time per state, last 30 days",op_no_periods:"no periods yet",op_avg_short:"avg",legionella:"Legionella prevention",op_today:"Today",op_7d:"7\xA0days",op_30d:"30\xA0days",op_periods_per_day:"Periods per day",op_hours_per_day:"Hours per day",op_defrost_vs_cold:"Defrosts and degree days per day",op_timeline:"Operating state, last 24 hours",op_definitions:"**How this is counted.** A period is an uninterrupted stretch in one state. *Legionella prevention* is the periodic heating of the hot-water tank to a high temperature. Rare states such as a water check or a firmware update are not counted. The core Weheat integration reports the state every two minutes, so lengths are accurate to about two minutes and a very short defrost can be missed. Today, 7 days and 30 days count periods that ended in that window; a running period is not counted yet. The bar charts use running totals with long-term statistics, so they keep their history.",curve_emitters:"Heating system",emitter_radiators:"radiators",emitter_underfloor:"underfloor heating",emitter_mixed:"radiators and underfloor heating",curve_measured:"measured indoor (last 2 weeks)",curve_no_advice:"No advice yet:",reason_no_heat_loss:"the heat-loss coefficient is not known yet (see the House tab).",reason_too_few_steady_hours:"not enough hours of steady heating yet (at least 24 in the last 12 months).",before_after:"Before and after the curve change",per_degree_day_before:"Before",per_degree_day_after:"After",change_effect:"Change",curve_definitions:"**How the advice is made.** For each outdoor temperature of the Weheat curve: the heat the house needs (from the heat-loss coefficient, at your target room temperature), and the water temperature at which your heating system delivers exactly that heat (calibrated on hours of steady heating over the last 12 months, with the chosen heating system). Where no heat is needed, the advice is the room temperature. The advice has one decimal: enter it in the Weheat web portal, or round up to whole degrees in the app. The *range* comes from the uncertainty of the heat-loss coefficient. Points far outside the measured outdoor temperatures are *extrapolated*: treat them as a starting point. This is advice, not a guarantee: change the curve in small steps and check that the rooms stay warm. Enter your current curve under Settings \u2192 Devices & services \u2192 Weheat Insights \u2192 Configure: the table and chart then show it next to the advice. When you change those values later, the change date is stored automatically, and before/after compares heating electricity per degree day (corrected for weather).",heat_loss_title:"Heat loss",supply_curve_title:"Supply temperature vs outdoor",indoor_outdoor_diff:"Indoor \u2212 outdoor (K)",heating_per_day:"Heating heat (kWh/day)",outdoor_temp:"Outdoor temperature (\xB0C)",supply_temp:"Supply temperature (\xB0C)",days_used:"days",excluded:"excluded",used:"used",fit_line:"fit",indoor_assumed_note:"No indoor sensor configured: 20\xA0\xB0C assumed, so this is less reliable.",reason_too_few_days:"Not enough usable days yet (at least 14 needed).",reason_too_little_spread:"Not enough difference between mild and cold days yet (at least 6\xA0K needed).",reason_no_relation:"No clear relation between temperature difference and heating yet.",heat_loss_coefficient:"Heat-loss coefficient",heat_loss_design:"At \u221210\xA0\xB0C",balance_point:"Balance point",cool_down_tau:"Time constant",cool_down_rate:"Cool-down at 15\xA0K",thermal_mass:"Thermal mass",house_definitions:"**Heat loss.** Each dot is one day: heating heat against the average indoor\u2212outdoor difference. The slope of the line is the heat-loss coefficient (W/K, shown with a 95\xA0% confidence interval); where the line reaches zero tells how much free heat (sun, people, appliances) the house gets, and gives the balance point. Grey dots are days left out: missing data, too mild, no heating at all, a big indoor temperature change, or another heat source running. **Cool-down** uses periods of 4+ hours without heating and needs an indoor sensor. **Degree days** measure how cold it was: per day the base temperature (18\xA0\xB0C, a setting) minus the average outdoor temperature, weighted by season by default. **Heating per degree day** divides space-heating heat by degree days, so a mild and a cold winter can be compared.",delta_t_short:"\u0394T",power_input_short:"Electricity",power_output_short:"Heat",heat_pump:"Heat pump",pumps:"pumps",this_season:"This season",this_month:"This month",today:"Today",defrost_loss:"Lost to defrost",last_year_to_date:"Last year to date",whole_last_season:"Last season",scop_heading:"SCOP this season",cop_heading:"COP",standby:"Standby",degree_days:"Degree days",definitions:"**How these numbers are calculated.** *Heat pump* COP/SCOP is all useful heat divided by the compressor electricity for heating, hot water and defrost; this matches the Weheat app. *Total* also counts standby and the indoor unit (circulation pumps): what your heat actually costs. *Heating* and *hot water* only count the compressor electricity for that mode plus its share of defrost (split by electricity use); standby and the indoor unit are left out. Heat taken back from the water during defrost counts against the COP. *COP over time* shows the same figures per day, month or heating season. A COP is only shown once at least 0.5\xA0kWh of electricity was used. Figures come from Home Assistant's long-term statistics and can lag up to about an hour.",hot_water_tab:"Hot water",dhw_tank:"Tank",dhw_top:"Tank top",dhw_bottom:"Tank bottom",dhw_tank_48h:"Tank temperature, last 48 hours",dhw_per_day:"Per day",dhw_efficiency:"Efficiency",dhw_habits:"When and how much",dhw_target_title:"Tank heated to",dhw_energy_title:"Hot-water energy per day",dhw_cop_target_title:"COP against tank temperature",dhw_cop_outdoor_title:"COP against outdoor temperature",dhw_start_hours_title:"Start of heating per hour",dhw_standing_loss_title:"Standing loss per week",dhw_target_today:"Heated to today",dhw_target_typical:"Usually heated to",dhw_runs_per_day:"Runs per day",dhw_heat_per_run:"Heat per run",dhw_heat_per_day:"Heat per day",dhw_standing_loss:"Standing loss",dhw_summary_note:"Averages over the last {days} complete days; heated to is the highest temperature of the bottom sensor, and usually the median over those days.",dhw_tank_temperature:"Tank temperature",dhw_setpoint:"Set target",dhw_heat:"Heat",dhw_electricity:"Electricity",dhw_start_hours_note:"Hot-water runs and legionella prevention over the last {days} days, by the hour they started.",dhw_standing_loss_none:"No quiet nights measured yet: this needs a few nights without hot-water use or heating of the tank.",dhw_week_of:"Week of",dhw_standing_loss_note:"How fast the top of the tank cools at night while no hot water is used or made (median per week). Rising over time can mean worse insulation or a leaking valve.",dhw_fit_target:"Each \xB0C hotter changes the COP by {value} (dashed line).",dhw_fit_outdoor:"Each \xB0C warmer outside changes the COP by {value} (dashed line).",dhw_color_outdoor:"colour: outdoor cold \u2192 warm",dhw_color_target:"colour: tank cooler \u2192 hotter",dhw_definitions:"**How hot water is measured.** What the tank was *heated to* on a day is the highest temperature of the *bottom* sensor: the heat pump stops heating once the bottom of the tank is at its target. On a day with legionella prevention that is the higher legionella temperature; those days are hollow in the scatter charts. *COP* is hot-water heat divided by hot-water electricity plus its share of defrost, per day once at least 0.25 kWh was used. The dashed lines are straight-line fits through the days without legionella prevention (through all days if it runs almost daily). *Standing loss* is how fast the *top* of the tank cools at night (00:00\u201307:00) in hours without a run, an hour after a run, or a sudden drop from tapping; it depends on the tank and on the room it stands in. Tank temperatures have history only since the Weheat integration was added to Home Assistant."},Lt={title:"Weheat Insights",live:"Live",last_24h:"Afgelopen 24 uur",last_7d:"Afgelopen 7 dagen",water_temperatures:"Watertemperatuur",air_temperatures:"Buiten- en kamertemperatuur",power:"Vermogen",cop:"COP",delta_t:"\u0394T aanvoer/retour",state:"Bedrijfstoestand",room:"Kamer",room_setpoint:"Doeltemperatuur",outdoor:"Buiten",supply:"Aanvoer",return:"Retour",power_input:"Elektrisch vermogen",power_output:"Warmteafgifte",no_pumps_title:"Nog geen warmtepomp ingesteld",no_pumps_body:"Voeg de integratie **Weheat Insights** toe via *Instellingen \u2192 Apparaten & diensten* en kies een warmtepomp. Dit dashboard vult zich daarna vanzelf.",error_title:"Weheat Insights is niet beschikbaar",error_body:"Het dashboard kon zijn configuratie niet laden. Controleer of de integratie Weheat Insights is ge\xEFnstalleerd en geladen.",disclaimer:"Onofficieel communityproject, niet verbonden aan Weheat.",performance:"Prestaties",cop_history:"COP door de tijd",day:"Dag",month:"Maand",season:"Seizoen",heating:"Verwarming",dhw:"Warm water",total:"Totaal",no_data:"Nog geen gegevens voor deze periode.",electricity:"stroom",heat:"warmte",scop_season:"SCOP dit stookseizoen",cop_month:"COP deze maand",cop_today:"COP vandaag",defrost_cop_impact:"COP-verlies door ontdooien",degree_days_month:"Graaddagen deze maand",degree_days_season:"Graaddagen dit stookseizoen",heat_per_degree_day:"Verwarming per graaddag",heat_per_degree_day_last_year:"Zelfde periode vorig seizoen",heat_per_degree_day_last_season:"Heel vorig seizoen",energy_per_day:"Energie per dag",degree_days_per_day:"Graaddagen per dag",degree_days_per_month:"Graaddagen per maand",defrost:"Ontdooien",house:"Woning",heat_loss_short:"Warmteverlies",heating_curve:"Stooklijn",advised_curve:"advies",curve_advice:"Advies",curve_current:"Huidig",current_curve:"huidige stooklijn",curve_enter_current:"Om te vergelijken met je huidige stooklijn: vul hem in onder Instellingen \u2192 Apparaten & diensten \u2192 Weheat Insights \u2192 Configureren (de vijf watertemperaturen uit de Weheat-app).",curve_outdoor:"Buiten",curve_range:"Bandbreedte",curve_extrapolated:"ge\xEBxtrapoleerd",curve_extrapolated_note:"Gebaseerd op extrapolatie: deze buitentemperatuur ligt ver buiten de tot nu toe gemeten temperaturen. Zie dit advies als startpunt.",curve_no_heat:"geen warmte nodig",curve_target:"Gewenste kamertemperatuur",decimal_separator:",",operation:"Bedrijf",op_share_30d:"Tijd per toestand, afgelopen 30 dagen",op_no_periods:"nog geen periodes",op_avg_short:"gem.",legionella:"Legionellapreventie",op_today:"Vandaag",op_7d:"7\xA0dagen",op_30d:"30\xA0dagen",op_periods_per_day:"Periodes per dag",op_hours_per_day:"Uren per dag",op_defrost_vs_cold:"Ontdooiperiodes en graaddagen per dag",op_timeline:"Bedrijfstoestand, afgelopen 24 uur",op_definitions:"**Zo wordt geteld.** Een periode is een ononderbroken stuk in \xE9\xE9n toestand. *Legionellapreventie* is het periodiek opwarmen van het warmwatervat tot een hoge temperatuur. Zeldzame toestanden zoals een watercontrole of een firmware-update tellen niet mee. De Weheat-integratie geeft de toestand elke twee minuten door, dus lengtes kloppen tot op ongeveer twee minuten en een heel korte ontdooiing kan gemist worden. Vandaag, 7 dagen en 30 dagen tellen periodes die in die tijd zijn ge\xEBindigd; een lopende periode telt nog niet mee. De staafgrafieken gebruiken lopende totalen met langetermijnstatistieken en houden dus hun geschiedenis.",curve_emitters:"Afgiftesysteem",emitter_radiators:"radiatoren",emitter_underfloor:"vloerverwarming",emitter_mixed:"radiatoren en vloerverwarming",curve_measured:"gemeten binnen (afgelopen 2 weken)",curve_no_advice:"Nog geen advies:",reason_no_heat_loss:"de warmteverliesco\xEBffici\xEBnt is nog niet bekend (zie het tabblad Woning).",reason_too_few_steady_hours:"nog te weinig uren met continu verwarmen (minstens 24 in de afgelopen 12 maanden).",before_after:"Voor en na de stooklijnwijziging",per_degree_day_before:"Voor",per_degree_day_after:"Na",change_effect:"Verschil",curve_definitions:"**Zo komt het advies tot stand.** Voor elke buitentemperatuur van de Weheat-stooklijn: de warmte die het huis nodig heeft (uit de warmteverliesco\xEBffici\xEBnt, bij je gewenste kamertemperatuur), en de watertemperatuur waarbij je afgiftesysteem precies die warmte levert (gekalibreerd op uren met continu verwarmen in de afgelopen 12 maanden, met het gekozen afgiftesysteem). Waar geen warmte nodig is, is het advies de kamertemperatuur. Het advies heeft \xE9\xE9n decimaal: vul het zo in via het Weheat-webportaal, of rond in de app naar boven af op hele graden. De *bandbreedte* komt uit de onzekerheid van de warmteverliesco\xEBffici\xEBnt. Punten ver buiten de gemeten buitentemperaturen zijn *ge\xEBxtrapoleerd*: zie ze als startpunt. Dit is een advies, geen garantie: pas de stooklijn in kleine stappen aan en controleer of de kamers warm blijven. Vul je huidige stooklijn in onder Instellingen \u2192 Apparaten & diensten \u2192 Weheat Insights \u2192 Configureren: tabel en grafiek tonen hem dan naast het advies. Pas je die waarden later aan, dan wordt de datum van de wijziging automatisch opgeslagen en vergelijkt voor/na het stroomverbruik voor verwarming per graaddag (gecorrigeerd voor het weer).",heat_loss_title:"Warmteverlies",supply_curve_title:"Aanvoertemperatuur vs buiten",indoor_outdoor_diff:"Binnen \u2212 buiten (K)",heating_per_day:"Verwarmingswarmte (kWh/dag)",outdoor_temp:"Buitentemperatuur (\xB0C)",supply_temp:"Aanvoertemperatuur (\xB0C)",days_used:"dagen",excluded:"uitgesloten",used:"gebruikt",fit_line:"lijn",indoor_assumed_note:"Geen binnensensor ingesteld: 20\xA0\xB0C aangenomen, dus minder betrouwbaar.",reason_too_few_days:"Nog niet genoeg bruikbare dagen (minstens 14 nodig).",reason_too_little_spread:"Nog te weinig verschil tussen zachte en koude dagen (minstens 6\xA0K nodig).",reason_no_relation:"Nog geen duidelijk verband tussen temperatuurverschil en verwarming.",heat_loss_coefficient:"Warmteverliesco\xEBffici\xEBnt",heat_loss_design:"Bij \u221210\xA0\xB0C",balance_point:"Stookgrens",cool_down_tau:"Tijdconstante",cool_down_rate:"Afkoeling bij 15\xA0K",thermal_mass:"Warmtecapaciteit",house_definitions:"**Warmteverlies.** Elke stip is \xE9\xE9n dag: verwarmingswarmte tegen het gemiddelde verschil tussen binnen en buiten. De helling van de lijn is de warmteverliesco\xEBffici\xEBnt (W/K, met een betrouwbaarheidsinterval van 95\xA0%); waar de lijn nul raakt zie je hoeveel gratis warmte (zon, mensen, apparaten) het huis krijgt, en daarmee de stookgrens. Grijze stippen zijn dagen die niet meetellen: ontbrekende gegevens, te zacht, helemaal niet verwarmd, een grote verandering binnen of een andere warmtebron. **Afkoeling** gebruikt periodes van minstens 4 uur zonder verwarming en heeft een binnensensor nodig. **Graaddagen** geven aan hoe koud het was: per dag de basistemperatuur (18\xA0\xB0C, instelbaar) min de gemiddelde buitentemperatuur, standaard gewogen naar seizoen. **Verwarming per graaddag** deelt de verwarmingswarmte door de graaddagen, zodat je een zachte en een koude winter kunt vergelijken.",delta_t_short:"\u0394T",power_input_short:"Stroom",power_output_short:"Warmte",heat_pump:"Warmtepomp",pumps:"pompen",this_season:"Dit seizoen",this_month:"Deze maand",today:"Vandaag",defrost_loss:"Ontdooiverlies",last_year_to_date:"Vorig jaar tot nu",whole_last_season:"Vorig seizoen",scop_heading:"SCOP dit stookseizoen",cop_heading:"COP",standby:"Stand-by",degree_days:"Graaddagen",definitions:"**Zo worden deze getallen berekend.** De COP/SCOP *warmtepomp* is alle nuttige warmte gedeeld door de compressorstroom voor verwarming, warm water en ontdooien; dat komt overeen met de Weheat-app. *Totaal* telt ook stand-by en de binnenunit (circulatiepompen) mee: wat je warmte echt kost. *Verwarming* en *warm water* tellen alleen de compressorstroom voor die functie plus hun deel van het ontdooien (verdeeld naar stroomverbruik); stand-by en de binnenunit tellen daar niet mee. Warmte die bij ontdooien uit het water wordt gehaald, telt negatief mee. *COP door de tijd* toont dezelfde cijfers per dag, maand of stookseizoen. Een COP verschijnt pas als er minstens 0,5\xA0kWh stroom is gebruikt. De cijfers komen uit de langetermijnstatistieken van Home Assistant en kunnen tot ongeveer een uur achterlopen.",hot_water_tab:"Warm water",dhw_tank:"Boiler",dhw_top:"Boiler boven",dhw_bottom:"Boiler onder",dhw_tank_48h:"Boilertemperatuur, afgelopen 48 uur",dhw_per_day:"Per dag",dhw_efficiency:"Rendement",dhw_habits:"Wanneer en hoeveel",dhw_target_title:"Boiler opgewarmd tot",dhw_energy_title:"Warmwaterenergie per dag",dhw_cop_target_title:"COP tegen boilertemperatuur",dhw_cop_outdoor_title:"COP tegen buitentemperatuur",dhw_start_hours_title:"Start van opwarmen per uur",dhw_standing_loss_title:"Stilstandsverlies per week",dhw_target_today:"Vandaag opgewarmd tot",dhw_target_typical:"Meestal opgewarmd tot",dhw_runs_per_day:"Runs per dag",dhw_heat_per_run:"Warmte per run",dhw_heat_per_day:"Warmte per dag",dhw_standing_loss:"Stilstandsverlies",dhw_summary_note:"Gemiddelden over de laatste {days} volledige dagen; opgewarmd tot is de hoogste temperatuur van de onderste sensor, en meestal de mediaan over die dagen.",dhw_tank_temperature:"Boilertemperatuur",dhw_setpoint:"Ingestelde doeltemperatuur",dhw_heat:"Warmte",dhw_electricity:"Stroom",dhw_start_hours_note:"Warmwaterruns en legionellapreventie van de laatste {days} dagen, naar het uur waarin ze begonnen.",dhw_standing_loss_none:"Nog geen rustige nachten gemeten: daarvoor zijn een paar nachten nodig zonder warmwatergebruik of opwarmen van de boiler.",dhw_week_of:"Week van",dhw_standing_loss_note:"Hoe snel de bovenkant van de boiler 's nachts afkoelt als er geen warm water wordt gebruikt of gemaakt (mediaan per week). Stijgt dit, dan kan de isolatie slechter zijn of lekt er een klep.",dhw_fit_target:"Elke \xB0C warmer verandert de COP met {value} (stippellijn).",dhw_fit_outdoor:"Elke \xB0C warmer buiten verandert de COP met {value} (stippellijn).",dhw_color_outdoor:"kleur: buiten koud \u2192 warm",dhw_color_target:"kleur: boiler koeler \u2192 heter",dhw_definitions:"**Zo wordt warm water gemeten.** Waartoe de boiler op een dag is *opgewarmd*, is de hoogste temperatuur van de *onderste* sensor: de warmtepomp stopt met opwarmen zodra de onderkant van de boiler op temperatuur is. Op een dag met legionellapreventie is dat de hogere legionellatemperatuur; die dagen zijn open rondjes in de puntgrafieken. De *COP* is warmwaterwarmte gedeeld door warmwaterstroom plus het deel van het ontdooien, per dag zodra er minstens 0,25 kWh is gebruikt. De stippellijnen zijn rechte lijnen door de dagen zonder legionellapreventie (door alle dagen als die bijna dagelijks draait). *Stilstandsverlies* is hoe snel de *bovenkant* van de boiler 's nachts (00:00\u201307:00) afkoelt, in uren zonder run, zonder het uur na een run en zonder plotselinge daling door tappen; het hangt af van de boiler en van de ruimte waarin hij staat. Boilertemperaturen hebben pas geschiedenis sinds de Weheat-integratie aan Home Assistant is toegevoegd."},Rt={en:je,nl:Lt};function z(n){return(n.locale?.language??n.language??"en").split("-")[0]}function M(n){let e=Rt[z(n)]??je;return t=>e[t]??je[t]}var B="weheat-insights-scatter-card",Ne=600,Ie=300,H={left:46,right:12,top:12,bottom:40},Dt=3600*1e3;function te(n,e,t=6){if(!isFinite(n)||!isFinite(e))return[];n===e&&(n-=1,e+=1);let r=(e-n)/t,o=10**Math.floor(Math.log10(r)),a=[1,2,2.5,5,10].map(d=>d*o).find(d=>d>=r)??r,s=[];for(let d=Math.floor(n/a)*a;d<=e+a*1e-9;d+=a)s.push(Math.round(d*1e6)/1e6);return s[s.length-1]<e&&s.push(s[s.length-1]+a),s}function Ot(n,e){if(!n.length)return null;if(e<=n[0].x)return n.length>1?Ue(n[0],n[1],e):n[0].y;for(let r=1;r<n.length;r++)if(e<=n[r].x)return Ue(n[r-1],n[r],e);let t=n.length;return t>1?Ue(n[t-2],n[t-1],e):n[0].y}function Ue(n,e,t){return n.y+(e.y-n.y)*(t-n.x)/(e.x-n.x)}function Mt(n,e,t,r,o){let a=(n(t)-n(e))/(t-e),[s,d]=[e,t];if(a===0)return n(e)>=r&&n(e)<=o?[s,d]:null;let l=i=>e+(i-n(e))/a,[c,h]=[l(r),l(o)].sort((i,g)=>i-g);return s=Math.max(s,c),d=Math.min(d,h),s<d?[s,d]:null}var Wt=25;function jt(n,e,t){return`hsl(${(220-220*(t>e?Math.min(1,Math.max(0,(n-e)/(t-e))):.5)).toFixed(0)} 75% 48%)`}var ye=class extends P{static{this.properties={hass:{attribute:!1},_config:{state:!0},_data:{state:!0},_error:{state:!0}}}setConfig(e){if(!e.entry_id)throw new Error("entry_id is required");if(e.mode!=="heat_loss"&&e.mode!=="supply_curve")throw new Error('mode must be "heat_loss" or "supply_curve"');this._config=e,this._data=void 0}getCardSize(){return 6}getGridOptions(){return{columns:"full",min_rows:5}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._fetch(!0),Dt)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._timer)}willUpdate(e){(e.has("hass")||e.has("_config"))&&this._fetch(!1)}async _fetch(e){if(!this.hass||!this._config)return;let{entry_id:t,mode:r,days:o}=this._config,a=`${t}:${r}:${o??""}`;if(!(!e&&a===this._fetchedKey)){this._fetchedKey=a;try{this._data=r==="heat_loss"?await this.hass.callWS({type:"weheat_insights/heat_loss",entry_id:t}):await this.hass.callWS({type:"weheat_insights/supply_curve",entry_id:t,days:o??365}),this._error=void 0}catch(s){this._error=s instanceof Error?s.message:JSON.stringify(s)}}}render(){if(!this.hass||!this._config)return f;let e=M(this.hass),t=this._config.mode==="heat_loss";return m`<ha-card>
      <div class="title">${this._config.title??e(t?"heat_loss_title":"supply_curve_title")}</div>
      ${this._error?m`<div class="message">${this._error}</div>`:this._data?t?this._renderHeatLoss(this._data,e):this._renderSupply(this._data,e):m`<div class="message">…</div>`}
    </ha-card>`}_renderHeatLoss(e,t){let r=z(this.hass),o=new Intl.NumberFormat(r,{maximumFractionDigits:1}),a=e.points.map(l=>({x:l.delta_k,y:l.heating_kwh,cls:l.excluded?"excluded":"used",tip:`${l.day}: ${o.format(l.delta_k)}\xA0K, ${o.format(l.heating_kwh)}\xA0kWh${l.excluded?` (${t("excluded")})`:""}`})),s=e.fit,d=s?m`<div class="summary">
          <strong>${Math.round(e.coefficient_w_per_k)} ± ${Math.round(e.confidence_95_w_per_k)} W/K</strong>
          · R² ${s.r_squared.toFixed(2)} · ${e.days_used} ${t("days_used")}
        </div>`:m`<div class="summary muted">${e.reason?t(`reason_${e.reason}`):""}</div>`;return m`${d}
      ${this._chart(a,{xLabel:t("indoor_outdoor_diff"),yLabel:t("heating_per_day"),includeZeroY:!0,line:s?l=>s.slope*l+s.intercept:void 0})}
      <div class="legend">
        <span><i class="dot used"></i>${t("used")}</span>
        <span><i class="dot excluded"></i>${t("excluded")}</span>
        ${s?m`<span><i class="line"></i>${t("fit_line")}</span>`:f}
      </div>
      ${e.indoor_assumed?m`<div class="note">${t("indoor_assumed_note")}</div>`:f}`}_renderSupply(e,t){let r={...e,points:e.points.filter(u=>u.outdoor_c<=Wt)};if(!r.points.length)return m`<div class="message">${t("no_data")}</div>`;let o=z(this.hass),a=new Intl.NumberFormat(o,{maximumFractionDigits:1}),s=r.points.map(u=>u.delta_t_k).sort((u,v)=>u-v),d=s[Math.floor(s.length*.05)],l=s[Math.min(s.length-1,Math.floor(s.length*.95))],c=r.points.map(u=>({x:u.outdoor_c,y:u.supply_c,color:jt(u.delta_t_k,d,l),tip:`${new Date(u.time).toLocaleString(o,{dateStyle:"short",timeStyle:"short"})}: ${a.format(u.outdoor_c)}\xA0\xB0C \u2192 ${a.format(u.supply_c)}\xA0\xB0C, \u0394T ${a.format(u.delta_t_k)}\xA0K`})),h=(u,v="supply_c")=>u.filter(S=>S[v]!=null).map(S=>({x:S.outdoor_c,y:S[v]})).sort((S,L)=>S.x-L.x),i=r.curves,g=[];return i?.advice.length&&g.push({cls:"advice",points:h(i.advice),band:[h(i.advice,"low_c"),h(i.advice,"high_c")]}),i?.current&&i.current.length>1&&g.push({cls:"current",points:h(i.current)}),m`${this._chart(c,{xLabel:t("outdoor_temp"),yLabel:t("supply_temp"),curves:g})}
      <div class="legend">
        <span>ΔT ${a.format(d)} K</span>
        <i class="gradient"></i>
        <span>${a.format(l)} K</span>
        ${g.some(u=>u.cls==="current")?m`<span><i class="line current"></i>${t("current_curve")}</span>`:f}
        ${g.some(u=>u.cls==="advice")?m`<span><i class="line advice"></i>${t("advised_curve")}</span>`:f}
      </div>`}_chart(e,t){if(!e.length)return m`<div class="message">${M(this.hass)("no_data")}</div>`;let r=e.map(y=>y.x),o=e.map(y=>y.y),a=te(Math.min(...r),Math.max(...r)),s=te(t.includeZeroY?Math.min(0,...o):Math.min(...o),Math.max(...o)),[d,l]=[a[0],a[a.length-1]],[c,h]=[s[0],s[s.length-1]],i=Ne-H.left-H.right,g=Ie-H.top-H.bottom,u=y=>H.left+(y-d)/(l-d)*i,v=y=>H.top+g-(y-c)/(h-c)*g,S=y=>Math.min(h,Math.max(c,y)),L=t.line?Mt(t.line,d,l,c,h):null;return m`<svg viewBox="0 0 ${Ne} ${Ie}" role="img" aria-label=${t.yLabel}>
      ${s.map(y=>b`<line class="grid" x1=${H.left} x2=${Ne-H.right} y1=${v(y)} y2=${v(y)}></line>
          <text class="axis" x=${H.left-6} y=${v(y)+4} text-anchor="end">${y}</text>`)}
      ${a.map(y=>b`<line class="grid" x1=${u(y)} x2=${u(y)} y1=${H.top} y2=${H.top+g}></line>
          <text class="axis" x=${u(y)} y=${H.top+g+16} text-anchor="middle">${y}</text>`)}
      <text class="label" x=${H.left+i/2} y=${Ie-4} text-anchor="middle">${t.xLabel}</text>
      <text class="label" transform="translate(12 ${H.top+g/2}) rotate(-90)" text-anchor="middle">${t.yLabel}</text>
      ${e.map(y=>b`<circle class=${y.cls??""} cx=${u(y.x)} cy=${v(y.y)} r="3.5" style=${y.color?`fill:${y.color}`:""}>
          <title>${y.tip}</title>
        </circle>`)}
      ${(t.curves??[]).map(y=>{let O=Array.from({length:41},(E,T)=>d+(l-d)*T/40),U=E=>O.map(T=>`${u(T)},${v(S(Ot(E,T)??c))}`).join(" "),_=y.band?b`<polygon class="band ${y.cls}" points=${`${U(y.band[1])} ${U(y.band[0]).split(" ").reverse().join(" ")}`}></polygon>`:f;return b`${_}<polyline class="curve ${y.cls}" points=${U(y.points)}></polyline>`})}
      ${L?b`<line class="fit" x1=${u(L[0])} y1=${v(t.line(L[0]))} x2=${u(L[1])} y2=${v(t.line(L[1]))}></line>`:f}
    </svg>`}static{this.styles=j`
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
    .line.current {
      background: repeating-linear-gradient(90deg, var(--secondary-text-color) 0 6px, transparent 6px 9px);
    }
    polygon.band {
      fill: var(--primary-text-color);
      fill-opacity: 0.08;
      stroke: none;
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
  `}};var Z="weheat-insights-dhw-card",pt=["summary","cop_target","cop_outdoor","start_hours","standing_loss"],ce=600,we=240,$={left:40,right:12,top:18,bottom:34},Ve=ce-$.left-$.right,Y=we-$.top-$.bottom,Nt=3600*1e3,It=90;function Ut(n){if(n.length<8)return null;let e=n.map(d=>d.x);if(Math.max(...e)-Math.min(...e)<3)return null;let t=e.reduce((d,l)=>d+l,0)/e.length,r=n.reduce((d,l)=>d+l.y,0)/n.length,o=0,a=0;for(let d of n)o+=(d.x-t)*(d.y-r),a+=(d.x-t)**2;let s=o/a;return{slope:s,intercept:r-s*t}}function Vt(n){return n==null?"var(--disabled-text-color, #9e9e9e)":`hsl(${(220-220*Math.min(1,Math.max(0,(n+5)/25))).toFixed(0)} 70% 50%)`}var ve=class extends P{static{this.properties={hass:{attribute:!1},_config:{state:!0},_data:{state:!0},_error:{state:!0}}}setConfig(e){if(!e.entry_id)throw new Error("entry_id is required");if(!pt.includes(e.mode))throw new Error(`mode must be one of ${pt.join(", ")}`);this._config=e,this._data=void 0}getCardSize(){return this._config?.mode==="summary"?2:5}getGridOptions(){return{columns:"full",min_rows:this._config?.mode==="summary"?2:4}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._fetch(!0),Nt)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._timer)}willUpdate(e){(e.has("hass")||e.has("_config"))&&this._fetch(!1)}async _fetch(e){if(!this.hass||!this._config)return;let t=Math.max(It,this._config.days??0),r=`${this._config.entry_id}:${t}`;if(!(!e&&r===this._fetchedKey)){this._fetchedKey=r;try{this._data=await this.hass.callWS({type:"weheat_insights/dhw",entry_id:this._config.entry_id,days:Math.min(t,365)}),this._error=void 0}catch(o){this._error=o instanceof Error?o.message:JSON.stringify(o)}}}render(){if(!this.hass||!this._config)return f;let e=M(this.hass),t=this._config.mode,r=this._config.title??(t==="summary"?null:e(`dhw_${t}_title`));return m`<ha-card>
      ${r?m`<div class="title">${r}</div>`:f}
      ${this._error?m`<div class="message">${this._error}</div>`:this._data?this._renderMode(t,this._data,e):m`<div class="message">…</div>`}
    </ha-card>`}_fmt(e){return new Intl.NumberFormat(z(this.hass),{minimumFractionDigits:e,maximumFractionDigits:e})}_dayLabel(e){return new Date(`${e}T12:00:00`).toLocaleDateString(z(this.hass),{day:"numeric",month:"short"})}_recent(e,t){return e.days.slice(-(this._config.days??t))}_renderMode(e,t,r){switch(e){case"summary":return this._renderSummary(t,r);case"cop_target":return this._renderCopScatter(t,r,"target");case"cop_outdoor":return this._renderCopScatter(t,r,"outdoor");case"start_hours":return this._renderStartHours(t,r);case"standing_loss":return this._renderStandingLoss(t,r)}}_renderSummary(e,t){let r=e.summary,o=this._fmt(0),a=this._fmt(1),s=this._fmt(2),d=(c,h,i)=>c==null?"\u2014":`${h.format(c)}\xA0${i}`,l=[["mdi:thermometer-water",t("dhw_target_today"),d(r.target_today_c,o,"\xB0C")],["mdi:thermometer-check",t("dhw_target_typical"),d(r.target_typical_c,o,"\xB0C")],["mdi:counter",t("dhw_runs_per_day"),d(r.runs_per_day,a,"\xD7")],["mdi:water-boiler",t("dhw_heat_per_run"),d(r.heat_per_run_kwh,a,"kWh")],["mdi:fire",t("dhw_heat_per_day"),d(r.heat_per_day_kwh,a,"kWh")],["mdi:thermometer-minus",t("dhw_standing_loss"),d(r.standing_loss_k_per_h,s,"K/h")]];return m`<div class="stats">
        ${l.map(([c,h,i])=>m`<div class="stat">
            <ha-icon .icon=${c}></ha-icon>
            <div><div class="stat-value">${i}</div><div class="stat-label">${h}</div></div>
          </div>`)}
      </div>
      <div class="note">${t("dhw_summary_note").replace("{days}",String(r.days))}</div>`}_renderStartHours(e,t){let r=e.start_hours.map((o,a)=>({label:a%3===0?String(a):"",value:o,cls:"target",tip:`${String(a).padStart(2,"0")}:00\u2013${String(a).padStart(2,"0")}:59: ${o}\xD7`}));return e.start_hours.some(o=>o>0)?m`${this._bars(r,{min:0,unit:"\xD7",integer:!0})}
      <div class="note">${t("dhw_start_hours_note").replace("{days}",String(e.start_hours_days))}</div>`:m`<div class="message">${t("no_data")}</div>`}_renderStandingLoss(e,t){let r=e.standing_loss_weeks.slice(-12);if(!r.length)return m`<div class="message">${t("dhw_standing_loss_none")}</div>`;let o=this._fmt(2),a=r.map(s=>({label:this._dayLabel(s.week),value:s.k_per_h,cls:"loss",note:o.format(s.k_per_h),tip:`${t("dhw_week_of")} ${s.week}: ${o.format(s.k_per_h)} K/h`}));return m`${this._bars(a,{min:0,unit:"K/h"})}
      <div class="note">${t("dhw_standing_loss_note")}</div>`}_bars(e,t){let r=e.map(i=>i.value??t.min),o=te(t.min,Math.max(t.min+(t.integer?3:1),...r),5);t.integer&&(o=o.filter(i=>Number.isInteger(i)));let[a,s]=[o[0],o[o.length-1]],d=i=>$.top+Y-(Math.min(s,Math.max(a,i))-a)/(s-a)*Y,l=Ve/e.length,c=Math.min(34,l*.7),h=new Intl.NumberFormat(z(this.hass),{maximumFractionDigits:2});return m`<svg viewBox="0 0 ${ce} ${we}" role="img">
      ${o.map(i=>b`<line class="grid" x1=${$.left} x2=${ce-$.right} y1=${d(i)} y2=${d(i)}></line>
          <text class="axis" x=${$.left-6} y=${d(i)+4} text-anchor="end">${h.format(i)}</text>`)}
      <text class="axis" x=${$.left-6} y=${$.top-6} text-anchor="end">${t.unit}</text>
      ${e.map((i,g)=>{let u=$.left+l*(g+.5),v=i.value==null?f:b`<rect class="bar ${i.cls??""}" x=${u-c/2} y=${d(i.value)} width=${c} height=${Math.max(0,d(a)-d(i.value))} rx="2"><title>${i.tip}</title></rect>`,S=i.note&&i.value!=null?b`<text class="note-text" x=${u} y=${d(i.value)-4} text-anchor="middle">${i.note}</text>`:f;return b`${v}${S}
          <text class="axis" x=${u} y=${$.top+Y+16} text-anchor="middle">${i.label}</text>`})}
    </svg>`}_renderCopScatter(e,t,r){let o=this._recent(e,90).filter(p=>p.cop!=null&&(r==="target"?p.target_c:p.outdoor_c)!=null);if(o.length<3)return m`<div class="message">${t("no_data")}</div>`;let a=this._fmt(1),s=o.map(p=>({x:r==="target"?p.target_c:p.outdoor_c,y:p.cop,d:p})),d=s.filter(p=>!p.d.legionella),l=d.length>=8?d:s,c=Ut(l),h=Math.min(...l.map(p=>p.x)),i=Math.max(...l.map(p=>p.x)),g=te(Math.min(...s.map(p=>p.x)),Math.max(...s.map(p=>p.x)),6),u=te(Math.min(...s.map(p=>p.y))-.3,Math.max(...s.map(p=>p.y))+.2,5),[v,S]=[g[0],g[g.length-1]],[L,y]=[u[0],u[u.length-1]],W=p=>$.left+(p-v)/(S-v)*Ve,O=p=>$.top+Y-(p-L)/(y-L)*Y,U=o.map(p=>p.target_c).filter(p=>p!=null),[_,E]=[Math.min(...U),Math.max(...U)],T=p=>p==null?"var(--disabled-text-color, #9e9e9e)":`hsl(${(220-220*(E>_?(p-_)/(E-_):.5)).toFixed(0)} 70% 50%)`,pe=p=>r==="target"?Vt(p.outdoor_c):T(p.target_c),Ce="\xB0C",qe=c?t(r==="target"?"dhw_fit_target":"dhw_fit_outdoor").replace("{value}",new Intl.NumberFormat(z(this.hass),{maximumFractionDigits:2,signDisplay:"always"}).format(c.slope)):null;return m`${qe?m`<div class="summary">${qe}</div>`:f}
      <svg viewBox="0 0 ${ce} ${we+10}" role="img">
        ${u.map(p=>b`<line class="grid" x1=${$.left} x2=${ce-$.right} y1=${O(p)} y2=${O(p)}></line>
            <text class="axis" x=${$.left-6} y=${O(p)+4} text-anchor="end">${p}</text>`)}
        ${g.map(p=>b`<line class="grid" x1=${W(p)} x2=${W(p)} y1=${$.top} y2=${$.top+Y}></line>
            <text class="axis" x=${W(p)} y=${$.top+Y+16} text-anchor="middle">${p}</text>`)}
        <text class="axis" x=${$.left-6} y=${$.top-6} text-anchor="end">COP</text>
        <text class="label" x=${$.left+Ve/2} y=${we+6} text-anchor="middle"
          >${r==="target"?`${t("dhw_tank_temperature")} (\xB0C)`:t("outdoor_temp")}</text
        >
        ${s.map(p=>b`<circle class=${p.d.legionella?"hollow":""} cx=${W(p.x)} cy=${O(p.y)} r="4.5"
            style=${p.d.legionella?`stroke:${pe(p.d)}`:`fill:${pe(p.d)}`}>
            <title>${p.d.day}: COP ${a.format(p.y)}, ${a.format(p.x)} ${Ce}${p.d.legionella?` (${t("legionella")})`:""}</title>
          </circle>`)}
        ${c?b`<line class="fit" x1=${W(h)} y1=${O(c.intercept+c.slope*h)} x2=${W(i)} y2=${O(c.intercept+c.slope*i)}></line>`:f}
      </svg>
      <div class="legend">
        <span>${t(r==="target"?"dhw_color_outdoor":"dhw_color_target")}</span>
        <i class="gradient"></i>
        ${s.some(p=>p.d.legionella)?m`<span><i class="ring"></i>${t("legionella")}</span>`:f}
      </div>`}static{this.styles=j`
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
      font-size: 14px;
    }
    .message,
    .note {
      color: var(--secondary-text-color);
      font-size: 13px;
      margin-top: 4px;
    }
    .message {
      padding: 16px 0;
      text-align: center;
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
    .note-text {
      fill: var(--primary-text-color);
      font-size: 11px;
    }
    rect.bar.target {
      fill: var(--blue-color, #2196f3);
    }
    rect.bar.loss {
      fill: var(--teal-color, #009688);
    }
    line.fit {
      stroke: var(--primary-text-color);
      stroke-width: 2;
      stroke-dasharray: 6 4;
    }
    circle {
      fill-opacity: 0.85;
    }
    circle.hollow {
      fill: none;
      stroke-width: 2;
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      align-items: center;
      font-size: 13px;
      color: var(--secondary-text-color);
      margin-top: 4px;
    }
    .ring {
      display: inline-block;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      border: 2px solid var(--secondary-text-color);
      margin-right: 6px;
      vertical-align: middle;
    }
    .gradient {
      display: inline-block;
      width: 80px;
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(90deg, hsl(220 70% 50%), hsl(110 70% 50%), hsl(0 70% 50%));
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
      margin-top: 4px;
    }
    .stat {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .stat ha-icon {
      color: var(--state-icon-color, var(--secondary-text-color));
    }
    .stat-value {
      font-size: 18px;
      font-weight: 500;
    }
    .stat-label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
  `}};var J="weheat-insights-performance-card",Be=600,Fe=220,R={left:30,right:8,top:10,bottom:26},Bt=900*1e3,D=(n,e=2)=>n==null?"\u2013":n.toFixed(e);function _t(n,e,t){let r=new Date(`${n.start}T12:00:00`);if(e==="day")return String(r.getDate());if(e==="month")return r.toLocaleDateString(t,{month:"short"});let o=new Date(`${n.end}T12:00:00`),a=o.getMonth()===0?o.getFullYear()-1:o.getFullYear();return a===r.getFullYear()?String(r.getFullYear()):`${r.getFullYear()}/${String(a).slice(2)}`}function Ft(n,e,t){let r=new Date(`${n.start}T12:00:00`);return e==="day"?r.toLocaleDateString(t,{weekday:"short",day:"numeric",month:"long"}):e==="month"?r.toLocaleDateString(t,{month:"long",year:"numeric"}):_t(n,e,t)}var $e=class extends P{constructor(){super(...arguments);this._kind="month"}static{this.properties={hass:{attribute:!1},_config:{state:!0},_kind:{state:!0},_data:{state:!0},_error:{state:!0}}}setConfig(t){if(!t.entry_id)throw new Error("entry_id is required");this._config=t,this._kind=t.period??"month"}getCardSize(){return 5}getGridOptions(){return{columns:"full",min_rows:4}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._fetch(!0),Bt)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._timer)}willUpdate(t){(t.has("hass")||t.has("_kind")||t.has("_config"))&&this._fetch(!1)}async _fetch(t){if(!this.hass||!this._config)return;let r=`${this._config.entry_id}:${this._kind}`;if(!(!t&&r===this._fetchedKey)){this._fetchedKey=r;try{this._data=await this.hass.callWS({type:"weheat_insights/performance_history",entry_id:this._config.entry_id,period:this._kind}),this._error=void 0}catch(o){this._error=o instanceof Error?o.message:JSON.stringify(o)}}}render(){if(!this.hass||!this._config)return f;let t=M(this.hass);return m`
      <ha-card>
        <div class="header">
          <div class="title">${this._config.title??t("cop_history")}</div>
          <div class="kinds" role="tablist">
            ${["day","month","season"].map(r=>m`<button
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
    `}_renderBody(t){if(this._error)return m`<div class="message">${this._error}</div>`;let r=this._data;return!r||r.period!==this._kind?m`<div class="message">…</div>`:r.periods.some(o=>o.cop!=null)?m`${this._renderChart(r,t)}${this._renderLegend(r,t)}`:m`<div class="message">${t("no_data")}</div>`}_renderChart(t,r){let o=z(this.hass),a=t.periods.findIndex(_=>_.cop!=null||_.cop_heat_pump!=null),s=t.periods.slice(Math.max(0,a)),d=s.flatMap(_=>[_.cop_heat_pump,_.cop,_.cop_heating,t.has_dhw?_.cop_dhw:null]),l=Math.max(5,Math.ceil(Math.max(...d.map(_=>_??0))+.5)),c=Be-R.left-R.right,h=Fe-R.top-R.bottom,i=_=>R.top+h-Math.max(0,_)/l*h,g=c/s.length,u=t.has_dhw?2:1,v=Math.max(2,Math.min(28,g*.75/u)),S=l>8?2:1,L=Math.ceil(s.length/12),y=[];for(let _=0;_<=l;_+=S)y.push(b`<line class="grid" x1=${R.left} x2=${Be-R.right} y1=${i(_)} y2=${i(_)}></line>
        <text class="axis" x=${R.left-6} y=${i(_)+4} text-anchor="end">${_}</text>`);let W=(_,E,T)=>_==null?f:b`<rect class=${T} x=${E} y=${i(_)} width=${v} height=${i(0)-i(_)} rx="2"></rect>`,O=(_,E,T)=>_==null?f:b`<line class=${T} x1=${E-2} x2=${E+v*u+2} y1=${i(_)} y2=${i(_)}></line>`,U=s.map((_,E)=>{let T=R.left+E*g+(g-v*u)/2,pe=R.left+E*g+g/2,Ce=[Ft(_,t.period,o),`${r("heat_pump")}: ${D(_.cop_heat_pump)} (${D(_.heat_kwh,1)}\xA0kWh ${r("heat")} / ${D(_.heat_pump_electricity_kwh,1)}\xA0kWh ${r("electricity")})`,`${r("total")}: ${D(_.cop)} (+ ${D(_.standby_kwh,1)}\xA0kWh ${r("standby").toLowerCase()}, + ${D(_.indoor_unit_kwh,1)}\xA0kWh ${r("pumps")})`,`${r("heating")}: ${D(_.cop_heating)} (${D(_.heating_heat_kwh,1)} / ${D(_.heating_electricity_kwh,1)}\xA0kWh)`,...t.has_dhw?[`${r("dhw")}: ${D(_.cop_dhw)} (${D(_.dhw_heat_kwh,1)} / ${D(_.dhw_electricity_kwh,1)}\xA0kWh)`]:[]].join(`
`);return b`<g>
        <title>${Ce}</title>
        <rect class="hit" x=${R.left+E*g} y=${R.top} width=${g} height=${h}></rect>
        ${W(_.cop_heating,T,"heating")}
        ${t.has_dhw?W(_.cop_dhw,T+v,"dhw"):f}
        ${O(_.cop_heat_pump,T,"heat-pump")}
        ${O(_.cop,T,"total")}
        ${E%L===0?b`<text class="axis" x=${pe} y=${Fe-8} text-anchor="middle">${_t(_,t.period,o)}</text>`:f}
      </g>`});return m`<svg viewBox="0 0 ${Be} ${Fe}" role="img" aria-label=${r("cop_history")}>
      ${y}${U}
    </svg>`}_renderLegend(t,r){return m`<div class="legend">
      <span><i class="swatch heating"></i>${r("heating")}</span>
      ${t.has_dhw?m`<span><i class="swatch dhw"></i>${r("dhw")}</span>`:f}
      <span><i class="swatch heat-pump"></i>${r("heat_pump")}</span>
      <span><i class="swatch total"></i>${r("total")}</span>
    </div>`}static{this.styles=j`
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
  `}};var X="weheat-insights-operating-card",Ge=["heating","dhw","defrost","legionella","standby"],be={heating:{icon:"mdi:radiator",color:"var(--orange-color, #ff9800)"},dhw:{icon:"mdi:water-boiler",color:"var(--blue-color, #2196f3)"},defrost:{icon:"mdi:snowflake-melt",color:"var(--cyan-color, #00bcd4)"},legionella:{icon:"mdi:bacteria-outline",color:"var(--purple-color, #9c27b0)"},standby:{icon:"mdi:power-sleep",color:"var(--grey-color, #9e9e9e)"}},xe=class extends P{static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){if(!e.entities||!Object.keys(e.entities).length)throw new Error("entities is required (operating_<state> sensors per state)");this._config=e}getCardSize(){return 6}getGridOptions(){return{columns:"full",min_rows:5}}_states(){return Ge.filter(e=>this._config?.entities[e]&&this._attrs(e))}_attrs(e){let t=this._config?.entities[e];return t?this.hass?.states?.[t]?.attributes:void 0}_num(e,t){let r=this._attrs(e)?.[t];return typeof r=="number"?r:null}render(){if(!this.hass||!this._config)return f;let e=M(this.hass),t=z(this.hass),r=this._states();if(!r.length)return m`<ha-card><div class="message">${e("no_data")}</div></ha-card>`;let o=r.map(h=>({s:h,value:this._num(h,"30d_hours")??0})),a=o.reduce((h,i)=>h+i.value,0)||1,s=o.map(({s:h,value:i})=>({s:h,value:i/a*100})),d=new Intl.NumberFormat(t,{maximumFractionDigits:0}),l=new Intl.NumberFormat(t,{maximumFractionDigits:0}),c=h=>e(h==="standby"?"standby":h);return m`<ha-card>
      ${this._config.title?m`<div class="title">${this._config.title}</div>`:f}
      <div class="subtitle">${e("op_share_30d")}</div>
      <div class="bar" role="img" aria-label=${e("op_share_30d")}>
        ${s.map(({s:h,value:i})=>m`<span
              style="width:${i}%;background:${be[h].color}"
              title="${c(h)}: ${d.format(i)} %"
            ></span>`)}
      </div>
      <div class="legend">
        ${s.map(({s:h,value:i})=>m`<span><i style="background:${be[h].color}"></i>${c(h)} ${d.format(i)}&nbsp;%</span>`)}
      </div>

      <div class="rows">
        <div class="row header">
          <span></span>
          <span></span>
          <span class="count">${e("op_today")}</span>
          <span class="count">${e("op_7d")}</span>
          <span class="count">${e("op_30d")}</span>
        </div>
        ${r.map(h=>this._row(h,c(h),e,l))}
      </div>
    </ha-card>`}_row(e,t,r,o){let a=this._num(e,"30d_avg_minutes"),s=this._num(e,"30d_min_minutes"),d=this._num(e,"30d_max_minutes"),l=s==null||d==null||Math.round(s)===Math.round(d)?"":` \xB7 ${o.format(s)}\u2013${o.format(d)} min`,c=a==null?r("op_no_periods"):`${r("op_avg_short")} ${o.format(a)} min${l}`;return m`<div class="row">
      <ha-icon .icon=${be[e].icon} style="color:${be[e].color}"></ha-icon>
      <span class="name">
        <span>${t}</span>
        <span class="detail">${c}</span>
      </span>
      ${["today_count","7d_count","30d_count"].map(h=>{let i=this._num(e,h);return m`<span class="count big">${i==null?"\u2013":m`${i}<span class="times">×</span>`}</span>`})}
    </div>`}static{this.styles=j`
    ha-card {
      padding: 16px;
    }
    .title {
      font-size: var(--ha-card-header-font-size, 24px);
      line-height: 1.3;
      margin-bottom: 8px;
    }
    .subtitle {
      color: var(--secondary-text-color);
      font-size: 13px;
      margin-bottom: 6px;
    }
    .bar {
      display: flex;
      height: 14px;
      border-radius: 7px;
      overflow: hidden;
      background: var(--divider-color);
    }
    .bar span {
      display: block;
      height: 100%;
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 14px;
      margin-top: 8px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .legend span {
      white-space: nowrap;
    }
    .legend i {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 2px;
      margin-right: 6px;
      vertical-align: middle;
    }
    .rows {
      margin-top: 16px;
      display: grid;
      row-gap: 10px;
    }
    .row {
      display: grid;
      grid-template-columns: 32px 1fr repeat(3, minmax(56px, auto));
      align-items: center;
      column-gap: 12px;
    }
    .row.header {
      color: var(--secondary-text-color);
      font-size: 12px;
    }
    .name {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .detail {
      color: var(--secondary-text-color);
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .count {
      text-align: right;
      white-space: nowrap;
    }
    .times {
      font-size: 14px;
      font-weight: 400;
      color: var(--secondary-text-color);
      margin-left: 1px;
    }
    .big {
      font-size: 20px;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }
    .message {
      padding: 24px 0;
      text-align: center;
      color: var(--secondary-text-color);
    }
  `}};var C=n=>n.filter(e=>!!e);function A(n,e){return{type:"heading",heading:n,heading_style:"title",...e?{icon:e}:{}}}function w(n,e){return n?{type:"tile",entity:n,name:e}:null}function x(n,e){return n?{entity:n,name:e}:null}function re(n,e,t){return e.length?{type:"history-graph",title:n,hours_to_show:t,entities:e,grid_options:{columns:"full"}}:null}function mt(n,e,t){return e.length?{type:"statistics-graph",title:n,entities:e,days_to_show:t,period:"hour",stat_types:["mean"],chart_type:"line",grid_options:{columns:"full"}}:null}function k(n,e,t=!1){let r=C(n);return r.length<=(t?0:1)?null:{type:"grid",cards:r,...e?{column_span:e}:{}}}function ue(n,e){return k([A(n("title"),"mdi:information-outline"),{type:"markdown",content:`${n(e)}

_${n("disclaimer")}_`,grid_options:{columns:"full"}}],2)}function I(n,e,t,r,o="full"){return e.length?{type:"statistics-graph",title:n,entities:e,period:t,days_to_show:r,stat_types:["change"],chart_type:"bar",grid_options:{columns:o}}:null}var Gt=["heating","dhw","legionella_prevention"];function Kt(n,e,t){if(!n)return null;let r={type:"gauge",entity:n,name:t("cop"),min:0,max:7,needle:!0,severity:{red:0,yellow:3,green:4}};return e?{type:"conditional",conditions:[{condition:"state",entity:e,state:Gt}],card:r}:r}function qt(n){return n.indoor_entity_id??n.weheat.thermostat_room_temperature}function Yt(n,e,t){let r=n.weheat,o=qt(n),a=n.outdoor_entity_id??r.outside_temperature,s=C([x(r.water_outlet_temperature,e("supply")),x(r.water_inlet_temperature,e("return"))]),d=C([x(a,e("outdoor")),x(o,e("room"))]),l=C([x(r.power_input,e("power_input")),x(r.power_output,e("power_output"))]),c=C([x(n.insights.delta_t,e("delta_t"))]),h=k([A(e("live"),"mdi:heat-pump"),w(r.heat_pump_state,e("state")),Kt(r.cop,r.heat_pump_state,e),w(o,e("room")),w(r.thermostat_room_temperature_setpoint,e("room_setpoint")),w(a,e("outdoor")),w(r.water_outlet_temperature,e("supply")),w(r.water_inlet_temperature,e("return")),w(n.insights.delta_t,e("delta_t_short")),w(r.power_input,e("power_input_short")),w(r.power_output,e("power_output_short"))]),i=k([A(e("last_24h"),"mdi:clock-outline"),re(e("water_temperatures"),s,24),re(e("air_temperatures"),d,24),re(e("power"),l,24),re(e("delta_t"),c,24)]),g=k([A(e("last_7d"),"mdi:calendar-week"),mt(e("water_temperatures"),s,7),mt(e("air_temperatures"),d,7)]);return{title:n.name,path:t===0?"heat-pump":`heat-pump-${t+1}`,icon:"mdi:heat-pump-outline",type:"sections",max_columns:3,sections:C([h,i,g])}}function Zt(n,e,t){let r=n.weheat,o=n.insights,a=k([A(e("scop_heading"),"mdi:chart-bar"),w(o.scop_heat_pump_season,e("heat_pump")),w(o.scop_season,e("total")),w(o.scop_heating_season,e("heating")),w(o.scop_dhw_season,e("dhw")),w(o.defrost_cop_impact_season,e("defrost_loss")),A(e("cop_month"),"mdi:calendar-month"),w(o.cop_heat_pump_month,e("heat_pump")),w(o.cop_month,e("total")),A(e("cop_today"),"mdi:calendar-today"),w(o.cop_heat_pump_today,e("heat_pump")),w(o.cop_today,e("total"))]),s=k([{type:`custom:${J}`,entry_id:n.entry_id}],2,!0),d=k([A(e("energy_per_day"),"mdi:lightning-bolt"),I(`${e("energy_per_day")} \xB7 ${e("electricity")}`,C([x(r.electricity_used_heating,e("heating")),x(r.electricity_used_dhw,e("dhw")),x(r.electricity_used_defrost,e("defrost")),x(r.electricity_used_standby,e("standby"))]),"day",30),I(`${e("energy_per_day")} \xB7 ${e("heat")}`,C([x(r.energy_output_heating,e("heating")),x(r.energy_output_dhw,e("dhw")),x(r.energy_output_defrost,e("defrost"))]),"day",30)],2),l=ue(e,"definitions");return{title:`${n.name} \xB7 ${e("performance")}`,path:t===0?"performance":`performance-${t+1}`,icon:"mdi:chart-bar",type:"sections",max_columns:4,sections:C([a,s,d,l])}}function Jt(n,e,t){let r=n.insights,o=k([A(e("house"),"mdi:home-thermometer"),w(r.heat_loss_coefficient,e("heat_loss_short")),w(r.heat_loss_design_load,e("heat_loss_design")),w(r.balance_point,e("balance_point")),w(r.cool_down_time_constant,e("cool_down_tau")),w(r.cool_down_rate,e("cool_down_rate")),w(r.thermal_mass,e("thermal_mass"))]),a=k([{type:`custom:${B}`,entry_id:n.entry_id,mode:"heat_loss"}],2,!0),s=ue(e,"house_definitions"),d=n.degree_days_statistic_id?{entity:n.degree_days_statistic_id,name:e("degree_days")}:null,l=k([A(e("heat_per_degree_day"),"mdi:home-thermometer-outline"),w(r.heat_per_degree_day_season,e("this_season")),w(r.heat_per_degree_day_last_year,e("last_year_to_date")),w(r.heat_per_degree_day_last_season,e("whole_last_season")),A(e("degree_days"),"mdi:thermometer-lines"),w(r.degree_days_month,e("this_month")),w(r.degree_days_season,e("this_season"))]),c=k([d?I(e("degree_days_per_month"),[d],"month",400,12):null,d?I(e("degree_days_per_day"),[d],"day",30,12):null],2,!0);return{title:`${n.name} \xB7 ${e("house")}`,path:t===0?"house":`house-${t+1}`,icon:"mdi:home-thermometer-outline",type:"sections",max_columns:4,sections:C([o,a,l,c,s])}}var Xt=[[-20,"curve_advice_minus_20"],[9,"curve_advice_9"],[15,"curve_advice_15"],[20,"curve_advice_20"],[25,"curve_advice_25"]],he=n=>n.replace(/\\/g,"\\\\").replace(/'/g,"\\'"),ke=n=>n.replace(/ /g,"\xA0").replace(/-/g,"\u2011");function Qt(n,e,t=1){return`{{ (('%.${t}f' | format(${n})) | replace('.', '${e}')) if (${n}) is not none else '\u2013' }}`}function er(n,e){let t=Xt.filter(([,c])=>n.insights[c]);if(!t.length)return null;let r=n.insights[t[0][1]],o=e("decimal_separator"),a=c=>Qt(c,o),s=c=>`state_attr('${c}', 'extrapolated') and not state_attr('${c}', 'no_heat_needed')`,d=JSON.stringify(t.map(([,c])=>n.insights[c]));return[`{% set reason = state_attr('${r}', 'no_advice_reason') %}`,`{% set cur = ${d} | map('state_attr', 'current') | reject('none') | list | count > 0 %}`,`**${e("curve_target")}:** ${a(`state_attr('${r}', 'target_room_temperature')`)}\xA0\xB0C \xB7 ${e("curve_measured")}: ${a(`state_attr('${r}', 'measured_indoor_temperature')`)}\xA0\xB0C`,"",`**${e("curve_emitters")}:** {{ {'radiators': '${he(e("emitter_radiators"))}', 'underfloor': '${he(e("emitter_underfloor"))}', 'mixed': '${he(e("emitter_mixed"))}'}.get(state_attr('${r}', 'emitter_type'), '\u2013') }}`,"",`{% if reason %}${e("curve_no_advice")} {{ {'no_heat_loss': '${he(e("reason_no_heat_loss"))}', 'too_few_steady_hours': '${he(e("reason_too_few_steady_hours"))}'}.get(reason, reason) }}{% endif %}`,"",`| ${ke(`${e("curve_outdoor")} (\xB0C)`)} | {% if cur %}${ke(`${e("curve_current")} (\xB0C)`)} | {% endif %}${ke(`${e("curve_advice")} (\xB0C)`)} | ${ke(`${e("curve_range")} (\xB0C)`)} |`,"|---:|{% if cur %}---:|{% endif %}---:|:---|",...t.map(([c,h])=>{let i=n.insights[h],g=`states('${i}') | float(none)`;return`| ${c} | {% if cur %}${a(`state_attr('${i}', 'current')`)} | {% endif %}{% if (${g}) is not none %}**${a(g)}**{% if ${s(i)} %}\\*{% endif %}{% else %}\u2013{% endif %} | {% if state_attr('${i}', 'no_heat_needed') %}${e("curve_no_heat")}{% elif state_attr('${i}', 'range_low') is not none %}${a(`state_attr('${i}', 'range_low')`)}\u2013${a(`state_attr('${i}', 'range_high')`)}{% endif %} |`}),"",`{% if ${d} | select('is_state_attr', 'extrapolated', true) | reject('is_state_attr', 'no_heat_needed', true) | list | count > 0 %}\\* ${e("curve_extrapolated_note")}{% endif %}`,"",`{% if not cur %}_${e("curve_enter_current")}_{% endif %}`].join(`
`)}function tr(n,e,t){let r=n.insights,o=er(n,e),a=k([A(e("curve_advice"),"mdi:chart-bell-curve-cumulative"),o?{type:"markdown",content:o,grid_options:{columns:"full"}}:null],2),s=k([{type:`custom:${B}`,entry_id:n.entry_id,mode:"supply_curve",days:365}],2,!0),d=k([A(e("before_after"),"mdi:swap-vertical"),w(r.heating_electricity_per_degree_day_before,e("per_degree_day_before")),w(r.heating_electricity_per_degree_day_after,e("per_degree_day_after")),w(r.heating_curve_change_effect,e("change_effect"))]),l=ue(e,"curve_definitions");return{title:`${n.name} \xB7 ${e("heating_curve")}`,path:t===0?"heating-curve":`heating-curve-${t+1}`,icon:"mdi:chart-bell-curve-cumulative",type:"sections",max_columns:4,sections:C([a,s,d,l])}}function rr(n,e,t){let r=n.insights,o=n.weheat,a=u=>e(u==="standby"?"standby":u),s=(u,v)=>C(v.map(S=>x(r[`${S}${u}`],a(S)))),d=Object.fromEntries(Ge.filter(u=>r[`operating_${u}`]).map(u=>[u,r[`operating_${u}`]])),l=k([A(e("operation"),"mdi:state-machine"),re(e("op_timeline"),C([x(o.heat_pump_state,e("state"))]),24),Object.keys(d).length?{type:`custom:${X}`,entities:d,grid_options:{columns:"full"}}:null],2),c=k([I(e("op_periods_per_day"),s("_periods_total",["heating","dhw","defrost","legionella"]),"day",30),I(e("op_hours_per_day"),s("_time_total",["heating","dhw","defrost","legionella"]),"day",30)],2,!0),h=n.degree_days_statistic_id?{entity:n.degree_days_statistic_id,name:e("degree_days")}:null,i=k([A(e("op_defrost_vs_cold"),"mdi:snowflake-melt"),I(e("defrost"),s("_periods_total",["defrost"]),"day",30,12),h?I(e("degree_days_per_day"),[h],"day",30,12):null],2),g=ue(e,"op_definitions");return{title:`${n.name} \xB7 ${e("operation")}`,path:t===0?"operation":`operation-${t+1}`,icon:"mdi:state-machine",type:"sections",max_columns:4,sections:C([l,c,i,g])}}function nr(n,e,t){let r=n.weheat;if(!n.has_dhw)return null;let o=(h,i={})=>({type:`custom:${Z}`,entry_id:n.entry_id,mode:h,...i}),a=k([A(e("hot_water_tab"),"mdi:water-boiler"),o("summary"),re(e("dhw_tank_48h"),C([x(r.dhw_top_temperature,e("dhw_top")),x(r.dhw_bottom_temperature,e("dhw_bottom"))]),48)],2),s=C([x(r.dhw_bottom_temperature,e("dhw_bottom")),x(r.dhw_target_temperature,e("dhw_setpoint"))]),d=k([A(e("dhw_per_day"),"mdi:calendar-today"),s.length?{type:"statistics-graph",title:e("dhw_target_title"),entities:s,period:"day",days_to_show:14,stat_types:["max"],chart_type:"bar",fit_y_data:!0,grid_options:{columns:"full"}}:null,I(e("dhw_energy_title"),C([x(r.energy_output_dhw,e("dhw_heat")),x(r.electricity_used_dhw,e("dhw_electricity"))]),"day",14)],2),l=k([A(e("dhw_efficiency"),"mdi:gauge"),o("cop_target",{days:90}),o("cop_outdoor",{days:90})],2),c=k([A(e("dhw_habits"),"mdi:clock-outline"),o("start_hours"),o("standing_loss")],2);return{title:`${n.name} \xB7 ${e("hot_water_tab")}`,path:t===0?"hot-water":`hot-water-${t+1}`,icon:"mdi:water-boiler",type:"sections",max_columns:4,sections:C([a,d,l,c,ue(e,"dhw_definitions")])}}function gt(n,e,t){return{title:n("title"),path:"weheat-insights",type:"panel",cards:[{type:"markdown",content:`## ${e}

${t}

_${n("disclaimer")}_`}]}}function ft(n,e){return n.length?{title:e("title"),views:n.flatMap((t,r)=>C([Zt(t,e,r),Jt(t,e,r),tr(t,e,r),rr(t,e,r),nr(t,e,r),Yt(t,e,r)]))}:{title:e("title"),views:[gt(e,e("no_pumps_title"),e("no_pumps_body"))]}}function yt(n,e){return{title:n("title"),views:[gt(n,n("error_title"),`${n("error_body")}

\`${e}\``)]}}var wt="ll-strategy-dashboard-weheat-insights",Ke=class extends HTMLElement{static async generate(e,t){let r=M(t);try{let o=await t.callWS({type:"weheat_insights/dashboard_config"});return ft(o.heat_pumps,r)}catch(o){let a=o instanceof Error?o.message:JSON.stringify(o);return yt(r,a)}}};customElements.get(wt)||customElements.define(wt,Ke);customElements.get(J)||customElements.define(J,$e);customElements.get(X)||customElements.define(X,xe);customElements.get(B)||customElements.define(B,ye);customElements.get(Z)||customElements.define(Z,ve);window.customCards=window.customCards??[];window.customCards.some(n=>n.type===J)||window.customCards.push({type:J,name:"Weheat Insights performance",description:"COP per day, month or season for heating and hot water (unofficial)"});window.customCards.some(n=>n.type===B)||window.customCards.push({type:B,name:"Weheat Insights scatter",description:"Heat loss of the house or supply vs outdoor temperature (unofficial)"});window.customCards.some(n=>n.type===X)||window.customCards.push({type:X,name:"Weheat Insights operation",description:"Time per operating state and number and length of periods (unofficial)"});window.customCards.some(n=>n.type===Z)||window.customCards.push({type:Z,name:"Weheat Insights hot water",description:"Hot-water tank temperature, COP, run times and standing loss (unofficial)"});window.customStrategies=window.customStrategies??[];window.customStrategies.some(n=>n.type==="weheat-insights")||window.customStrategies.push({type:"weheat-insights",strategyType:"dashboard",name:"Weheat Insights",description:"Live overview and history for Weheat heat pumps (unofficial)"});
