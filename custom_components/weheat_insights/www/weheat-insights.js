var ne=globalThis,se=ne.ShadowRoot&&(ne.ShadyCSS===void 0||ne.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,me=Symbol(),De=new WeakMap,Y=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==me)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(se&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=De.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&De.set(t,e))}return e}toString(){return this.cssText}},We=n=>new Y(typeof n=="string"?n:n+"",void 0,me),W=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((r,s,o)=>r+(i=>{if(i._$cssResult$===!0)return i.cssText;if(typeof i=="number")return i;throw Error("Value passed to 'css' function must be a 'css' function result: "+i+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[o+1],n[0]);return new Y(t,n,me)},Me=(n,e)=>{if(se)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let r=document.createElement("style"),s=ne.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=t.cssText,n.appendChild(r)}},ge=se?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return We(t)})(n):n;var{is:lt,defineProperty:ct,getOwnPropertyDescriptor:ht,getOwnPropertyNames:pt,getOwnPropertySymbols:ut,getPrototypeOf:_t}=Object,oe=globalThis,Ne=oe.trustedTypes,mt=Ne?Ne.emptyScript:"",gt=oe.reactiveElementPolyfillSupport,q=(n,e)=>n,fe={toAttribute(n,e){switch(e){case Boolean:n=n?mt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},Ue=(n,e)=>!lt(n,e),Ie={attribute:!0,type:String,converter:fe,reflect:!1,useDefault:!1,hasChanged:Ue};Symbol.metadata??=Symbol("metadata"),oe.litPropertyMetadata??=new WeakMap;var H=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ie){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(e,r,t);s!==void 0&&ct(this.prototype,e,s)}}static getPropertyDescriptor(e,t,r){let{get:s,set:o}=ht(this.prototype,e)??{get(){return this[t]},set(i){this[t]=i}};return{get:s,set(i){let d=s?.call(this);o?.call(this,i),this.requestUpdate(e,d,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ie}static _$Ei(){if(this.hasOwnProperty(q("elementProperties")))return;let e=_t(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(q("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(q("properties"))){let t=this.properties,r=[...pt(t),...ut(t)];for(let s of r)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[r,s]of t)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let s=this._$Eu(t,r);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let s of r)t.unshift(ge(s))}else e!==void 0&&t.push(ge(e));return t}static _$Eu(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Me(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){let r=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,r);if(s!==void 0&&r.reflect===!0){let o=(r.converter?.toAttribute!==void 0?r.converter:fe).toAttribute(t,r.type);this._$Em=e,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){let r=this.constructor,s=r._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let o=r.getPropertyOptions(s),i=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:fe;this._$Em=s;let d=i.fromAttribute(t,o.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(e,t,r,s=!1,o){if(e!==void 0){let i=this.constructor;if(s===!1&&(o=this[e]),r??=i.getPropertyOptions(e),!((r.hasChanged??Ue)(o,t)||r.useDefault&&r.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(i._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:s,wrapped:o},i){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,i??t??this[e]),o!==!0||i!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,o]of r){let{wrapped:i}=o,d=this[s];i!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,o,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};H.elementStyles=[],H.shadowRootOptions={mode:"open"},H[q("elementProperties")]=new Map,H[q("finalized")]=new Map,gt?.({ReactiveElement:H}),(oe.reactiveElementVersions??=[]).push("2.1.2");var Ce=globalThis,Ve=n=>n,ie=Ce.trustedTypes,Ge=ie?ie.createPolicy("lit-html",{createHTML:n=>n}):void 0,Ze="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,Je="?"+R,ft=`<${Je}>`,I=document,J=()=>I.createComment(""),X=n=>n===null||typeof n!="object"&&typeof n!="function",ke=Array.isArray,yt=n=>ke(n)||typeof n?.[Symbol.iterator]=="function",ye=`[ 	
\f\r]`,Z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ke=/-->/g,Be=/>/g,M=RegExp(`>|${ye}(?:([^\\s"'>=/]+)(${ye}*=${ye}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Fe=/'/g,Ye=/"/g,Xe=/^(?:script|style|textarea|title)$/i,Ae=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),f=Ae(1),k=Ae(2),Gt=Ae(3),U=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),qe=new WeakMap,N=I.createTreeWalker(I,129);function Qe(n,e){if(!ke(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ge!==void 0?Ge.createHTML(e):e}var vt=(n,e)=>{let t=n.length-1,r=[],s,o=e===2?"<svg>":e===3?"<math>":"",i=Z;for(let d=0;d<t;d++){let a=n[d],h,c,l=-1,u=0;for(;u<a.length&&(i.lastIndex=u,c=i.exec(a),c!==null);)u=i.lastIndex,i===Z?c[1]==="!--"?i=Ke:c[1]!==void 0?i=Be:c[2]!==void 0?(Xe.test(c[2])&&(s=RegExp("</"+c[2],"g")),i=M):c[3]!==void 0&&(i=M):i===M?c[0]===">"?(i=s??Z,l=-1):c[1]===void 0?l=-2:(l=i.lastIndex-c[2].length,h=c[1],i=c[3]===void 0?M:c[3]==='"'?Ye:Fe):i===Ye||i===Fe?i=M:i===Ke||i===Be?i=Z:(i=M,s=void 0);let v=i===M&&n[d+1].startsWith("/>")?" ":"";o+=i===Z?a+ft:l>=0?(r.push(h),a.slice(0,l)+Ze+a.slice(l)+R+v):a+R+(l===-2?d:v)}return[Qe(n,o+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},Q=class n{constructor({strings:e,_$litType$:t},r){let s;this.parts=[];let o=0,i=0,d=e.length-1,a=this.parts,[h,c]=vt(e,t);if(this.el=n.createElement(h,r),N.currentNode=this.el.content,t===2||t===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(s=N.nextNode())!==null&&a.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let l of s.getAttributeNames())if(l.endsWith(Ze)){let u=c[i++],v=s.getAttribute(l).split(R),g=/([.?@])?(.*)/.exec(u);a.push({type:1,index:o,name:g[2],strings:v,ctor:g[1]==="."?$e:g[1]==="?"?we:g[1]==="@"?be:F}),s.removeAttribute(l)}else l.startsWith(R)&&(a.push({type:6,index:o}),s.removeAttribute(l));if(Xe.test(s.tagName)){let l=s.textContent.split(R),u=l.length-1;if(u>0){s.textContent=ie?ie.emptyScript:"";for(let v=0;v<u;v++)s.append(l[v],J()),N.nextNode(),a.push({type:2,index:++o});s.append(l[u],J())}}}else if(s.nodeType===8)if(s.data===Je)a.push({type:2,index:o});else{let l=-1;for(;(l=s.data.indexOf(R,l+1))!==-1;)a.push({type:7,index:o}),l+=R.length-1}o++}}static createElement(e,t){let r=I.createElement("template");return r.innerHTML=e,r}};function B(n,e,t=n,r){if(e===U)return e;let s=r!==void 0?t._$Co?.[r]:t._$Cl,o=X(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(n),s._$AT(n,t,r)),r!==void 0?(t._$Co??=[])[r]=s:t._$Cl=s),s!==void 0&&(e=B(n,s._$AS(n,e.values),s,r)),e}var ve=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:r}=this._$AD,s=(e?.creationScope??I).importNode(t,!0);N.currentNode=s;let o=N.nextNode(),i=0,d=0,a=r[0];for(;a!==void 0;){if(i===a.index){let h;a.type===2?h=new ee(o,o.nextSibling,this,e):a.type===1?h=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(h=new xe(o,this,e)),this._$AV.push(h),a=r[++d]}i!==a?.index&&(o=N.nextNode(),i++)}return N.currentNode=I,s}p(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},ee=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,s){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=B(this,e,t),X(e)?e===m||e==null||e===""?(this._$AH!==m&&this._$AR(),this._$AH=m):e!==this._$AH&&e!==U&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):yt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==m&&X(this._$AH)?this._$AA.nextSibling.data=e:this.T(I.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:r}=e,s=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=Q.createElement(Qe(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(t);else{let o=new ve(s,this),i=o.u(this.options);o.p(t),this.T(i),this._$AH=o}}_$AC(e){let t=qe.get(e.strings);return t===void 0&&qe.set(e.strings,t=new Q(e)),t}k(e){ke(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,s=0;for(let o of e)s===t.length?t.push(r=new n(this.O(J()),this.O(J()),this,this.options)):r=t[s],r._$AI(o),s++;s<t.length&&(this._$AR(r&&r._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let r=Ve(e).nextSibling;Ve(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},F=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,s,o){this.type=1,this._$AH=m,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=m}_$AI(e,t=this,r,s){let o=this.strings,i=!1;if(o===void 0)e=B(this,e,t,0),i=!X(e)||e!==this._$AH&&e!==U,i&&(this._$AH=e);else{let d=e,a,h;for(e=o[0],a=0;a<o.length-1;a++)h=B(this,d[r+a],t,a),h===U&&(h=this._$AH[a]),i||=!X(h)||h!==this._$AH[a],h===m?e=m:e!==m&&(e+=(h??"")+o[a+1]),this._$AH[a]=h}i&&!s&&this.j(e)}j(e){e===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},$e=class extends F{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===m?void 0:e}},we=class extends F{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==m)}},be=class extends F{constructor(e,t,r,s,o){super(e,t,r,s,o),this.type=5}_$AI(e,t=this){if((e=B(this,e,t,0)??m)===U)return;let r=this._$AH,s=e===m&&r!==m||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,o=e!==m&&(r===m||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},xe=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){B(this,e)}};var $t=Ce.litHtmlPolyfillSupport;$t?.(Q,ee),(Ce.litHtmlVersions??=[]).push("3.3.3");var et=(n,e,t)=>{let r=t?.renderBefore??e,s=r._$litPart$;if(s===void 0){let o=t?.renderBefore??null;r._$litPart$=s=new ee(e.insertBefore(J(),o),o,void 0,t??{})}return s._$AI(n),s};var Se=globalThis,S=class extends H{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=et(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return U}};S._$litElement$=!0,S.finalized=!0,Se.litElementHydrateSupport?.({LitElement:S});var wt=Se.litElementPolyfillSupport;wt?.({LitElement:S});(Se.litElementVersions??=[]).push("4.2.2");var Ee={title:"Weheat Insights",live:"Live",last_24h:"Last 24 hours",last_7d:"Last 7 days",temperatures:"Temperatures",power:"Power",cop:"COP",delta_t:"\u0394T supply/return",state:"Operating state",room:"Room",outdoor:"Outdoor",supply:"Supply",return:"Return",power_input:"Electrical power",power_output:"Heat output",no_pumps_title:"No heat pump set up yet",no_pumps_body:"Add the **Weheat Insights** integration under *Settings \u2192 Devices & services* and pick a heat pump. This dashboard fills itself in once that is done.",error_title:"Weheat Insights is not available",error_body:"The dashboard could not load its configuration. Check that the Weheat Insights integration is installed and loaded.",disclaimer:"Unofficial community project, not affiliated with Weheat.",performance:"Performance",cop_history:"COP over time",day:"Day",month:"Month",season:"Season",heating:"Heating",dhw:"Hot water",total:"Total",no_data:"No data for this period yet.",electricity:"electricity",heat:"heat",scop_season:"SCOP this season",cop_month:"COP this month",cop_today:"COP today",defrost_cop_impact:"COP lost to defrost",degree_days_month:"Degree days this month",degree_days_season:"Degree days this season",heat_per_degree_day:"Heating per degree day",heat_per_degree_day_last_year:"Same period last season",heat_per_degree_day_last_season:"Whole last season",energy_per_day:"Energy per day",degree_days_per_day:"Degree days per day",degree_days_per_month:"Degree days per month",defrost:"Defrost",house:"House",heat_loss_short:"Heat loss",heating_curve:"Heating curve",advised_curve:"advice",curve_advice:"Advice",curve_current:"Current",current_curve:"current curve",curve_enter_current:"To compare with your current heating curve, enter it under Settings \u2192 Devices & services \u2192 Weheat Insights \u2192 Configure (the five water temperatures from the Weheat app).",curve_outdoor:"Outdoor",curve_range:"Range",curve_extrapolated:"extrapolated",curve_extrapolated_note:"Based on extrapolation: this outdoor temperature is far outside the temperatures measured so far. Treat this advice as a starting point.",curve_no_heat:"no heat needed",curve_target:"Target room temperature",decimal_separator:".",operation:"Operation",op_share_30d:"Time per state, last 30 days",op_no_periods:"no periods yet",op_avg_short:"avg",legionella:"Legionella prevention",op_today:"Today",op_7d:"7\xA0days",op_30d:"30\xA0days",op_periods_per_day:"Periods per day",op_hours_per_day:"Hours per day",op_defrost_vs_cold:"Defrosts and degree days per day",op_timeline:"Operating state, last 24 hours",op_definitions:"**How this is counted.** A period is an uninterrupted stretch in one state. *Legionella prevention* is the periodic heating of the hot-water tank to a high temperature. Rare states such as a water check or a firmware update are not counted. The core Weheat integration reports the state every two minutes, so lengths are accurate to about two minutes and a very short defrost can be missed. Today, 7 days and 30 days count periods that ended in that window; a running period is not counted yet. The bar charts use running totals with long-term statistics, so they keep their history.",curve_emitters:"Heating system",emitter_radiators:"radiators",emitter_underfloor:"underfloor heating",emitter_mixed:"radiators and underfloor heating",curve_measured:"measured indoor (last 2 weeks)",curve_no_advice:"No advice yet:",reason_no_heat_loss:"the heat-loss coefficient is not known yet (see the House tab).",reason_too_few_steady_hours:"not enough hours of steady heating yet (at least 24 in the last 12 months).",before_after:"Before and after the curve change",per_degree_day_before:"Before",per_degree_day_after:"After",change_effect:"Change",curve_definitions:"**How the advice is made.** For each outdoor temperature of the Weheat curve: the heat the house needs (from the heat-loss coefficient, at your target room temperature), and the water temperature at which your heating system delivers exactly that heat (calibrated on hours of steady heating over the last 12 months, with the chosen heating system). Where no heat is needed, the advice is the room temperature. The advice has one decimal: enter it in the Weheat web portal, or round up to whole degrees in the app. The *range* comes from the uncertainty of the heat-loss coefficient. Points far outside the measured outdoor temperatures are *extrapolated*: treat them as a starting point. This is advice, not a guarantee: change the curve in small steps and check that the rooms stay warm. Enter your current curve under Settings \u2192 Devices & services \u2192 Weheat Insights \u2192 Configure: the table and chart then show it next to the advice. When you change those values later, the change date is stored automatically, and before/after compares heating electricity per degree day (corrected for weather).",heat_loss_title:"Heat loss",supply_curve_title:"Supply temperature vs outdoor",indoor_outdoor_diff:"Indoor \u2212 outdoor (K)",heating_per_day:"Heating heat (kWh/day)",outdoor_temp:"Outdoor temperature (\xB0C)",supply_temp:"Supply temperature (\xB0C)",days_used:"days",excluded:"excluded",used:"used",fit_line:"fit",indoor_assumed_note:"No indoor sensor configured: 20\xA0\xB0C assumed, so this is less reliable.",reason_too_few_days:"Not enough usable days yet (at least 14 needed).",reason_too_little_spread:"Not enough difference between mild and cold days yet (at least 6\xA0K needed).",reason_no_relation:"No clear relation between temperature difference and heating yet.",heat_loss_coefficient:"Heat-loss coefficient",heat_loss_design:"At \u221210\xA0\xB0C",balance_point:"Balance point",cool_down_tau:"Time constant",cool_down_rate:"Cool-down at 15\xA0K",thermal_mass:"Thermal mass",house_definitions:"**Heat loss.** Each dot is one day: heating heat against the average indoor\u2212outdoor difference. The slope of the line is the heat-loss coefficient (W/K, shown with a 95\xA0% confidence interval); where the line reaches zero tells how much free heat (sun, people, appliances) the house gets, and gives the balance point. Grey dots are days left out: missing data, too mild, no heating at all, a big indoor temperature change, or another heat source running. **Cool-down** uses periods of 4+ hours without heating and needs an indoor sensor. **Degree days** measure how cold it was: per day the base temperature (18\xA0\xB0C, a setting) minus the average outdoor temperature, weighted by season by default. **Heating per degree day** divides space-heating heat by degree days, so a mild and a cold winter can be compared.",delta_t_short:"\u0394T",power_input_short:"Electricity",power_output_short:"Heat",heat_pump:"Heat pump",pumps:"pumps",this_season:"This season",this_month:"This month",today:"Today",defrost_loss:"Lost to defrost",last_year_to_date:"Last year to date",whole_last_season:"Last season",scop_heading:"SCOP this season",cop_heading:"COP",standby:"Standby",degree_days:"Degree days",definitions:"**How these numbers are calculated.** *Heat pump* COP/SCOP is all useful heat divided by the compressor electricity for heating, hot water and defrost; this matches the Weheat app. *Total* also counts standby and the indoor unit (circulation pumps): what your heat actually costs. *Heating* and *hot water* only count the compressor electricity for that mode plus its share of defrost (split by electricity use); standby and the indoor unit are left out. Heat taken back from the water during defrost counts against the COP. *COP over time* shows the same figures per day, month or heating season. A COP is only shown once at least 0.5\xA0kWh of electricity was used. Figures come from Home Assistant's long-term statistics and can lag up to about an hour."},bt={title:"Weheat Insights",live:"Live",last_24h:"Afgelopen 24 uur",last_7d:"Afgelopen 7 dagen",temperatures:"Temperaturen",power:"Vermogen",cop:"COP",delta_t:"\u0394T aanvoer/retour",state:"Bedrijfstoestand",room:"Kamer",outdoor:"Buiten",supply:"Aanvoer",return:"Retour",power_input:"Elektrisch vermogen",power_output:"Warmteafgifte",no_pumps_title:"Nog geen warmtepomp ingesteld",no_pumps_body:"Voeg de integratie **Weheat Insights** toe via *Instellingen \u2192 Apparaten & diensten* en kies een warmtepomp. Dit dashboard vult zich daarna vanzelf.",error_title:"Weheat Insights is niet beschikbaar",error_body:"Het dashboard kon zijn configuratie niet laden. Controleer of de integratie Weheat Insights is ge\xEFnstalleerd en geladen.",disclaimer:"Onofficieel communityproject, niet verbonden aan Weheat.",performance:"Prestaties",cop_history:"COP door de tijd",day:"Dag",month:"Maand",season:"Seizoen",heating:"Verwarming",dhw:"Warm water",total:"Totaal",no_data:"Nog geen gegevens voor deze periode.",electricity:"stroom",heat:"warmte",scop_season:"SCOP dit stookseizoen",cop_month:"COP deze maand",cop_today:"COP vandaag",defrost_cop_impact:"COP-verlies door ontdooien",degree_days_month:"Graaddagen deze maand",degree_days_season:"Graaddagen dit stookseizoen",heat_per_degree_day:"Verwarming per graaddag",heat_per_degree_day_last_year:"Zelfde periode vorig seizoen",heat_per_degree_day_last_season:"Heel vorig seizoen",energy_per_day:"Energie per dag",degree_days_per_day:"Graaddagen per dag",degree_days_per_month:"Graaddagen per maand",defrost:"Ontdooien",house:"Woning",heat_loss_short:"Warmteverlies",heating_curve:"Stooklijn",advised_curve:"advies",curve_advice:"Advies",curve_current:"Huidig",current_curve:"huidige stooklijn",curve_enter_current:"Om te vergelijken met je huidige stooklijn: vul hem in onder Instellingen \u2192 Apparaten & diensten \u2192 Weheat Insights \u2192 Configureren (de vijf watertemperaturen uit de Weheat-app).",curve_outdoor:"Buiten",curve_range:"Bandbreedte",curve_extrapolated:"ge\xEBxtrapoleerd",curve_extrapolated_note:"Gebaseerd op extrapolatie: deze buitentemperatuur ligt ver buiten de tot nu toe gemeten temperaturen. Zie dit advies als startpunt.",curve_no_heat:"geen warmte nodig",curve_target:"Gewenste kamertemperatuur",decimal_separator:",",operation:"Bedrijf",op_share_30d:"Tijd per toestand, afgelopen 30 dagen",op_no_periods:"nog geen periodes",op_avg_short:"gem.",legionella:"Legionellapreventie",op_today:"Vandaag",op_7d:"7\xA0dagen",op_30d:"30\xA0dagen",op_periods_per_day:"Periodes per dag",op_hours_per_day:"Uren per dag",op_defrost_vs_cold:"Ontdooiperiodes en graaddagen per dag",op_timeline:"Bedrijfstoestand, afgelopen 24 uur",op_definitions:"**Zo wordt geteld.** Een periode is een ononderbroken stuk in \xE9\xE9n toestand. *Legionellapreventie* is het periodiek opwarmen van het warmwatervat tot een hoge temperatuur. Zeldzame toestanden zoals een watercontrole of een firmware-update tellen niet mee. De Weheat-integratie geeft de toestand elke twee minuten door, dus lengtes kloppen tot op ongeveer twee minuten en een heel korte ontdooiing kan gemist worden. Vandaag, 7 dagen en 30 dagen tellen periodes die in die tijd zijn ge\xEBindigd; een lopende periode telt nog niet mee. De staafgrafieken gebruiken lopende totalen met langetermijnstatistieken en houden dus hun geschiedenis.",curve_emitters:"Afgiftesysteem",emitter_radiators:"radiatoren",emitter_underfloor:"vloerverwarming",emitter_mixed:"radiatoren en vloerverwarming",curve_measured:"gemeten binnen (afgelopen 2 weken)",curve_no_advice:"Nog geen advies:",reason_no_heat_loss:"de warmteverliesco\xEBffici\xEBnt is nog niet bekend (zie het tabblad Woning).",reason_too_few_steady_hours:"nog te weinig uren met continu verwarmen (minstens 24 in de afgelopen 12 maanden).",before_after:"Voor en na de stooklijnwijziging",per_degree_day_before:"Voor",per_degree_day_after:"Na",change_effect:"Verschil",curve_definitions:"**Zo komt het advies tot stand.** Voor elke buitentemperatuur van de Weheat-stooklijn: de warmte die het huis nodig heeft (uit de warmteverliesco\xEBffici\xEBnt, bij je gewenste kamertemperatuur), en de watertemperatuur waarbij je afgiftesysteem precies die warmte levert (gekalibreerd op uren met continu verwarmen in de afgelopen 12 maanden, met het gekozen afgiftesysteem). Waar geen warmte nodig is, is het advies de kamertemperatuur. Het advies heeft \xE9\xE9n decimaal: vul het zo in via het Weheat-webportaal, of rond in de app naar boven af op hele graden. De *bandbreedte* komt uit de onzekerheid van de warmteverliesco\xEBffici\xEBnt. Punten ver buiten de gemeten buitentemperaturen zijn *ge\xEBxtrapoleerd*: zie ze als startpunt. Dit is een advies, geen garantie: pas de stooklijn in kleine stappen aan en controleer of de kamers warm blijven. Vul je huidige stooklijn in onder Instellingen \u2192 Apparaten & diensten \u2192 Weheat Insights \u2192 Configureren: tabel en grafiek tonen hem dan naast het advies. Pas je die waarden later aan, dan wordt de datum van de wijziging automatisch opgeslagen en vergelijkt voor/na het stroomverbruik voor verwarming per graaddag (gecorrigeerd voor het weer).",heat_loss_title:"Warmteverlies",supply_curve_title:"Aanvoertemperatuur vs buiten",indoor_outdoor_diff:"Binnen \u2212 buiten (K)",heating_per_day:"Verwarmingswarmte (kWh/dag)",outdoor_temp:"Buitentemperatuur (\xB0C)",supply_temp:"Aanvoertemperatuur (\xB0C)",days_used:"dagen",excluded:"uitgesloten",used:"gebruikt",fit_line:"lijn",indoor_assumed_note:"Geen binnensensor ingesteld: 20\xA0\xB0C aangenomen, dus minder betrouwbaar.",reason_too_few_days:"Nog niet genoeg bruikbare dagen (minstens 14 nodig).",reason_too_little_spread:"Nog te weinig verschil tussen zachte en koude dagen (minstens 6\xA0K nodig).",reason_no_relation:"Nog geen duidelijk verband tussen temperatuurverschil en verwarming.",heat_loss_coefficient:"Warmteverliesco\xEBffici\xEBnt",heat_loss_design:"Bij \u221210\xA0\xB0C",balance_point:"Stookgrens",cool_down_tau:"Tijdconstante",cool_down_rate:"Afkoeling bij 15\xA0K",thermal_mass:"Warmtecapaciteit",house_definitions:"**Warmteverlies.** Elke stip is \xE9\xE9n dag: verwarmingswarmte tegen het gemiddelde verschil tussen binnen en buiten. De helling van de lijn is de warmteverliesco\xEBffici\xEBnt (W/K, met een betrouwbaarheidsinterval van 95\xA0%); waar de lijn nul raakt zie je hoeveel gratis warmte (zon, mensen, apparaten) het huis krijgt, en daarmee de stookgrens. Grijze stippen zijn dagen die niet meetellen: ontbrekende gegevens, te zacht, helemaal niet verwarmd, een grote verandering binnen of een andere warmtebron. **Afkoeling** gebruikt periodes van minstens 4 uur zonder verwarming en heeft een binnensensor nodig. **Graaddagen** geven aan hoe koud het was: per dag de basistemperatuur (18\xA0\xB0C, instelbaar) min de gemiddelde buitentemperatuur, standaard gewogen naar seizoen. **Verwarming per graaddag** deelt de verwarmingswarmte door de graaddagen, zodat je een zachte en een koude winter kunt vergelijken.",delta_t_short:"\u0394T",power_input_short:"Stroom",power_output_short:"Warmte",heat_pump:"Warmtepomp",pumps:"pompen",this_season:"Dit seizoen",this_month:"Deze maand",today:"Vandaag",defrost_loss:"Ontdooiverlies",last_year_to_date:"Vorig jaar tot nu",whole_last_season:"Vorig seizoen",scop_heading:"SCOP dit stookseizoen",cop_heading:"COP",standby:"Stand-by",degree_days:"Graaddagen",definitions:"**Zo worden deze getallen berekend.** De COP/SCOP *warmtepomp* is alle nuttige warmte gedeeld door de compressorstroom voor verwarming, warm water en ontdooien; dat komt overeen met de Weheat-app. *Totaal* telt ook stand-by en de binnenunit (circulatiepompen) mee: wat je warmte echt kost. *Verwarming* en *warm water* tellen alleen de compressorstroom voor die functie plus hun deel van het ontdooien (verdeeld naar stroomverbruik); stand-by en de binnenunit tellen daar niet mee. Warmte die bij ontdooien uit het water wordt gehaald, telt negatief mee. *COP door de tijd* toont dezelfde cijfers per dag, maand of stookseizoen. Een COP verschijnt pas als er minstens 0,5\xA0kWh stroom is gebruikt. De cijfers komen uit de langetermijnstatistieken van Home Assistant en kunnen tot ongeveer een uur achterlopen."},xt={en:Ee,nl:bt};function O(n){return(n.locale?.language??n.language??"en").split("-")[0]}function L(n){let e=xt[O(n)]??Ee;return t=>e[t]??Ee[t]}var V="weheat-insights-performance-card",Pe=600,Te=220,E={left:30,right:8,top:10,bottom:26},Ct=900*1e3,P=(n,e=2)=>n==null?"\u2013":n.toFixed(e);function tt(n,e,t){let r=new Date(`${n.start}T12:00:00`);if(e==="day")return String(r.getDate());if(e==="month")return r.toLocaleDateString(t,{month:"short"});let s=new Date(`${n.end}T12:00:00`),o=s.getMonth()===0?s.getFullYear()-1:s.getFullYear();return o===r.getFullYear()?String(r.getFullYear()):`${r.getFullYear()}/${String(o).slice(2)}`}function kt(n,e,t){let r=new Date(`${n.start}T12:00:00`);return e==="day"?r.toLocaleDateString(t,{weekday:"short",day:"numeric",month:"long"}):e==="month"?r.toLocaleDateString(t,{month:"long",year:"numeric"}):tt(n,e,t)}var ae=class extends S{constructor(){super(...arguments);this._kind="month"}static{this.properties={hass:{attribute:!1},_config:{state:!0},_kind:{state:!0},_data:{state:!0},_error:{state:!0}}}setConfig(t){if(!t.entry_id)throw new Error("entry_id is required");this._config=t,this._kind=t.period??"month"}getCardSize(){return 5}getGridOptions(){return{columns:"full",min_rows:4}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._fetch(!0),Ct)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._timer)}willUpdate(t){(t.has("hass")||t.has("_kind")||t.has("_config"))&&this._fetch(!1)}async _fetch(t){if(!this.hass||!this._config)return;let r=`${this._config.entry_id}:${this._kind}`;if(!(!t&&r===this._fetchedKey)){this._fetchedKey=r;try{this._data=await this.hass.callWS({type:"weheat_insights/performance_history",entry_id:this._config.entry_id,period:this._kind}),this._error=void 0}catch(s){this._error=s instanceof Error?s.message:JSON.stringify(s)}}}render(){if(!this.hass||!this._config)return m;let t=L(this.hass);return f`
      <ha-card>
        <div class="header">
          <div class="title">${this._config.title??t("cop_history")}</div>
          <div class="kinds" role="tablist">
            ${["day","month","season"].map(r=>f`<button
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
    `}_renderBody(t){if(this._error)return f`<div class="message">${this._error}</div>`;let r=this._data;return!r||r.period!==this._kind?f`<div class="message">…</div>`:r.periods.some(s=>s.cop!=null)?f`${this._renderChart(r,t)}${this._renderLegend(r,t)}`:f`<div class="message">${t("no_data")}</div>`}_renderChart(t,r){let s=O(this.hass),o=t.periods.findIndex(p=>p.cop!=null||p.cop_heat_pump!=null),i=t.periods.slice(Math.max(0,o)),d=i.flatMap(p=>[p.cop_heat_pump,p.cop,p.cop_heating,t.has_dhw?p.cop_dhw:null]),a=Math.max(5,Math.ceil(Math.max(...d.map(p=>p??0))+.5)),h=Pe-E.left-E.right,c=Te-E.top-E.bottom,l=p=>E.top+c-Math.max(0,p)/a*c,u=h/i.length,v=t.has_dhw?2:1,g=Math.max(2,Math.min(28,u*.75/v)),T=a>8?2:1,_=Math.ceil(i.length/12),ue=[];for(let p=0;p<=a;p+=T)ue.push(k`<line class="grid" x1=${E.left} x2=${Pe-E.right} y1=${l(p)} y2=${l(p)}></line>
        <text class="axis" x=${E.left-6} y=${l(p)+4} text-anchor="end">${p}</text>`);let re=(p,x,z)=>p==null?m:k`<rect class=${z} x=${x} y=${l(p)} width=${g} height=${l(0)-l(p)} rx="2"></rect>`,K=(p,x,z)=>p==null?m:k`<line class=${z} x1=${x-2} x2=${x+g*v+2} y1=${l(p)} y2=${l(p)}></line>`,_e=i.map((p,x)=>{let z=E.left+x*u+(u-g*v)/2,at=E.left+x*u+u/2,dt=[kt(p,t.period,s),`${r("heat_pump")}: ${P(p.cop_heat_pump)} (${P(p.heat_kwh,1)}\xA0kWh ${r("heat")} / ${P(p.heat_pump_electricity_kwh,1)}\xA0kWh ${r("electricity")})`,`${r("total")}: ${P(p.cop)} (+ ${P(p.standby_kwh,1)}\xA0kWh ${r("standby").toLowerCase()}, + ${P(p.indoor_unit_kwh,1)}\xA0kWh ${r("pumps")})`,`${r("heating")}: ${P(p.cop_heating)} (${P(p.heating_heat_kwh,1)} / ${P(p.heating_electricity_kwh,1)}\xA0kWh)`,...t.has_dhw?[`${r("dhw")}: ${P(p.cop_dhw)} (${P(p.dhw_heat_kwh,1)} / ${P(p.dhw_electricity_kwh,1)}\xA0kWh)`]:[]].join(`
`);return k`<g>
        <title>${dt}</title>
        <rect class="hit" x=${E.left+x*u} y=${E.top} width=${u} height=${c}></rect>
        ${re(p.cop_heating,z,"heating")}
        ${t.has_dhw?re(p.cop_dhw,z+g,"dhw"):m}
        ${K(p.cop_heat_pump,z,"heat-pump")}
        ${K(p.cop,z,"total")}
        ${x%_===0?k`<text class="axis" x=${at} y=${Te-8} text-anchor="middle">${tt(p,t.period,s)}</text>`:m}
      </g>`});return f`<svg viewBox="0 0 ${Pe} ${Te}" role="img" aria-label=${r("cop_history")}>
      ${ue}${_e}
    </svg>`}_renderLegend(t,r){return f`<div class="legend">
      <span><i class="swatch heating"></i>${r("heating")}</span>
      ${t.has_dhw?f`<span><i class="swatch dhw"></i>${r("dhw")}</span>`:m}
      <span><i class="swatch heat-pump"></i>${r("heat_pump")}</span>
      <span><i class="swatch total"></i>${r("total")}</span>
    </div>`}static{this.styles=W`
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
  `}};var G="weheat-insights-operating-card",He=["heating","dhw","defrost","legionella","standby"],de={heating:{icon:"mdi:radiator",color:"var(--orange-color, #ff9800)"},dhw:{icon:"mdi:water-boiler",color:"var(--blue-color, #2196f3)"},defrost:{icon:"mdi:snowflake-melt",color:"var(--cyan-color, #00bcd4)"},legionella:{icon:"mdi:bacteria-outline",color:"var(--purple-color, #9c27b0)"},standby:{icon:"mdi:power-sleep",color:"var(--grey-color, #9e9e9e)"}},le=class extends S{static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){if(!e.entities||!Object.keys(e.entities).length)throw new Error("entities is required (operating_<state> sensors per state)");this._config=e}getCardSize(){return 6}getGridOptions(){return{columns:"full",min_rows:5}}_states(){return He.filter(e=>this._config?.entities[e]&&this._attrs(e))}_attrs(e){let t=this._config?.entities[e];return t?this.hass?.states?.[t]?.attributes:void 0}_num(e,t){let r=this._attrs(e)?.[t];return typeof r=="number"?r:null}render(){if(!this.hass||!this._config)return m;let e=L(this.hass),t=O(this.hass),r=this._states();if(!r.length)return f`<ha-card><div class="message">${e("no_data")}</div></ha-card>`;let s=r.map(c=>({s:c,value:this._num(c,"30d_hours")??0})),o=s.reduce((c,l)=>c+l.value,0)||1,i=s.map(({s:c,value:l})=>({s:c,value:l/o*100})),d=new Intl.NumberFormat(t,{maximumFractionDigits:0}),a=new Intl.NumberFormat(t,{maximumFractionDigits:0}),h=c=>e(c==="standby"?"standby":c);return f`<ha-card>
      ${this._config.title?f`<div class="title">${this._config.title}</div>`:m}
      <div class="subtitle">${e("op_share_30d")}</div>
      <div class="bar" role="img" aria-label=${e("op_share_30d")}>
        ${i.map(({s:c,value:l})=>f`<span
              style="width:${l}%;background:${de[c].color}"
              title="${h(c)}: ${d.format(l)} %"
            ></span>`)}
      </div>
      <div class="legend">
        ${i.map(({s:c,value:l})=>f`<span><i style="background:${de[c].color}"></i>${h(c)} ${d.format(l)}&nbsp;%</span>`)}
      </div>

      <div class="rows">
        <div class="row header">
          <span></span>
          <span></span>
          <span class="count">${e("op_today")}</span>
          <span class="count">${e("op_7d")}</span>
          <span class="count">${e("op_30d")}</span>
        </div>
        ${r.map(c=>this._row(c,h(c),e,a))}
      </div>
    </ha-card>`}_row(e,t,r,s){let o=this._num(e,"30d_avg_minutes"),i=this._num(e,"30d_min_minutes"),d=this._num(e,"30d_max_minutes"),a=i==null||d==null||Math.round(i)===Math.round(d)?"":` \xB7 ${s.format(i)}\u2013${s.format(d)} min`,h=o==null?r("op_no_periods"):`${r("op_avg_short")} ${s.format(o)} min${a}`;return f`<div class="row">
      <ha-icon .icon=${de[e].icon} style="color:${de[e].color}"></ha-icon>
      <span class="name">
        <span>${t}</span>
        <span class="detail">${h}</span>
      </span>
      ${["today_count","7d_count","30d_count"].map(c=>{let l=this._num(e,c);return f`<span class="count big">${l==null?"\u2013":f`${l}<span class="times">×</span>`}</span>`})}
    </div>`}static{this.styles=W`
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
  `}};var j="weheat-insights-scatter-card",Le=600,ze=300,C={left:46,right:12,top:12,bottom:40},At=3600*1e3;function rt(n,e,t=6){if(!isFinite(n)||!isFinite(e))return[];n===e&&(n-=1,e+=1);let r=(e-n)/t,s=10**Math.floor(Math.log10(r)),o=[1,2,2.5,5,10].map(d=>d*s).find(d=>d>=r)??r,i=[];for(let d=Math.floor(n/o)*o;d<=e+o*1e-9;d+=o)i.push(Math.round(d*1e6)/1e6);return i[i.length-1]<e&&i.push(i[i.length-1]+o),i}function St(n,e){if(!n.length)return null;if(e<=n[0].x)return n.length>1?Re(n[0],n[1],e):n[0].y;for(let r=1;r<n.length;r++)if(e<=n[r].x)return Re(n[r-1],n[r],e);let t=n.length;return t>1?Re(n[t-2],n[t-1],e):n[0].y}function Re(n,e,t){return n.y+(e.y-n.y)*(t-n.x)/(e.x-n.x)}function Et(n,e,t){return`hsl(${(220-220*(t>e?Math.min(1,Math.max(0,(n-e)/(t-e))):.5)).toFixed(0)} 75% 48%)`}var ce=class extends S{static{this.properties={hass:{attribute:!1},_config:{state:!0},_data:{state:!0},_error:{state:!0}}}setConfig(e){if(!e.entry_id)throw new Error("entry_id is required");if(e.mode!=="heat_loss"&&e.mode!=="supply_curve")throw new Error('mode must be "heat_loss" or "supply_curve"');this._config=e,this._data=void 0}getCardSize(){return 6}getGridOptions(){return{columns:"full",min_rows:5}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._fetch(!0),At)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._timer)}willUpdate(e){(e.has("hass")||e.has("_config"))&&this._fetch(!1)}async _fetch(e){if(!this.hass||!this._config)return;let{entry_id:t,mode:r,days:s}=this._config,o=`${t}:${r}:${s??""}`;if(!(!e&&o===this._fetchedKey)){this._fetchedKey=o;try{this._data=r==="heat_loss"?await this.hass.callWS({type:"weheat_insights/heat_loss",entry_id:t}):await this.hass.callWS({type:"weheat_insights/supply_curve",entry_id:t,days:s??365}),this._error=void 0}catch(i){this._error=i instanceof Error?i.message:JSON.stringify(i)}}}render(){if(!this.hass||!this._config)return m;let e=L(this.hass),t=this._config.mode==="heat_loss";return f`<ha-card>
      <div class="title">${this._config.title??e(t?"heat_loss_title":"supply_curve_title")}</div>
      ${this._error?f`<div class="message">${this._error}</div>`:this._data?t?this._renderHeatLoss(this._data,e):this._renderSupply(this._data,e):f`<div class="message">…</div>`}
    </ha-card>`}_renderHeatLoss(e,t){let r=O(this.hass),s=new Intl.NumberFormat(r,{maximumFractionDigits:1}),o=e.points.map(a=>({x:a.delta_k,y:a.heating_kwh,cls:a.excluded?"excluded":"used",tip:`${a.day}: ${s.format(a.delta_k)}\xA0K, ${s.format(a.heating_kwh)}\xA0kWh${a.excluded?` (${t("excluded")})`:""}`})),i=e.fit,d=i?f`<div class="summary">
          <strong>${Math.round(e.coefficient_w_per_k)} ± ${Math.round(e.confidence_95_w_per_k)} W/K</strong>
          · R² ${i.r_squared.toFixed(2)} · ${e.days_used} ${t("days_used")}
        </div>`:f`<div class="summary muted">${e.reason?t(`reason_${e.reason}`):""}</div>`;return f`${d}
      ${this._chart(o,{xLabel:t("indoor_outdoor_diff"),yLabel:t("heating_per_day"),includeZeroY:!0,line:i?a=>i.slope*a+i.intercept:void 0})}
      <div class="legend">
        <span><i class="dot used"></i>${t("used")}</span>
        <span><i class="dot excluded"></i>${t("excluded")}</span>
        ${i?f`<span><i class="line"></i>${t("fit_line")}</span>`:m}
      </div>
      ${e.indoor_assumed?f`<div class="note">${t("indoor_assumed_note")}</div>`:m}`}_renderSupply(e,t){if(!e.points.length)return f`<div class="message">${t("no_data")}</div>`;let r=O(this.hass),s=new Intl.NumberFormat(r,{maximumFractionDigits:1}),o=e.points.map(u=>u.delta_t_k).sort((u,v)=>u-v),i=o[Math.floor(o.length*.05)],d=o[Math.min(o.length-1,Math.floor(o.length*.95))],a=e.points.map(u=>({x:u.outdoor_c,y:u.supply_c,color:Et(u.delta_t_k,i,d),tip:`${new Date(u.time).toLocaleString(r,{dateStyle:"short",timeStyle:"short"})}: ${s.format(u.outdoor_c)}\xA0\xB0C \u2192 ${s.format(u.supply_c)}\xA0\xB0C, \u0394T ${s.format(u.delta_t_k)}\xA0K`})),h=(u,v="supply_c")=>u.filter(g=>g[v]!=null).map(g=>({x:g.outdoor_c,y:g[v]})).sort((g,T)=>g.x-T.x),c=e.curves,l=[];return c?.advice.length&&l.push({cls:"advice",points:h(c.advice),band:[h(c.advice,"low_c"),h(c.advice,"high_c")]}),c?.current&&c.current.length>1&&l.push({cls:"current",points:h(c.current)}),f`${this._chart(a,{xLabel:t("outdoor_temp"),yLabel:t("supply_temp"),curves:l})}
      <div class="legend">
        <span>ΔT ${s.format(i)} K</span>
        <i class="gradient"></i>
        <span>${s.format(d)} K</span>
        ${l.some(u=>u.cls==="current")?f`<span><i class="line current"></i>${t("current_curve")}</span>`:m}
        ${l.some(u=>u.cls==="advice")?f`<span><i class="line advice"></i>${t("advised_curve")}</span>`:m}
      </div>`}_chart(e,t){if(!e.length)return f`<div class="message">${L(this.hass)("no_data")}</div>`;let r=e.map(_=>_.x),s=e.map(_=>_.y),o=rt(Math.min(...r),Math.max(...r)),i=rt(t.includeZeroY?Math.min(0,...s):Math.min(...s),Math.max(...s)),[d,a]=[o[0],o[o.length-1]],[h,c]=[i[0],i[i.length-1]],l=Le-C.left-C.right,u=ze-C.top-C.bottom,v=_=>C.left+(_-d)/(a-d)*l,g=_=>C.top+u-(_-h)/(c-h)*u,T=_=>Math.min(c,Math.max(h,_));return f`<svg viewBox="0 0 ${Le} ${ze}" role="img" aria-label=${t.yLabel}>
      ${i.map(_=>k`<line class="grid" x1=${C.left} x2=${Le-C.right} y1=${g(_)} y2=${g(_)}></line>
          <text class="axis" x=${C.left-6} y=${g(_)+4} text-anchor="end">${_}</text>`)}
      ${o.map(_=>k`<line class="grid" x1=${v(_)} x2=${v(_)} y1=${C.top} y2=${C.top+u}></line>
          <text class="axis" x=${v(_)} y=${C.top+u+16} text-anchor="middle">${_}</text>`)}
      <text class="label" x=${C.left+l/2} y=${ze-4} text-anchor="middle">${t.xLabel}</text>
      <text class="label" transform="translate(12 ${C.top+u/2}) rotate(-90)" text-anchor="middle">${t.yLabel}</text>
      ${e.map(_=>k`<circle class=${_.cls??""} cx=${v(_.x)} cy=${g(_.y)} r="3.5" style=${_.color?`fill:${_.color}`:""}>
          <title>${_.tip}</title>
        </circle>`)}
      ${(t.curves??[]).map(_=>{let re=Array.from({length:41},(p,x)=>d+(a-d)*x/40),K=p=>re.map(x=>`${v(x)},${g(T(St(p,x)??h))}`).join(" "),_e=_.band?k`<polygon class="band ${_.cls}" points=${`${K(_.band[1])} ${K(_.band[0]).split(" ").reverse().join(" ")}`}></polygon>`:m;return k`${_e}<polyline class="curve ${_.cls}" points=${K(_.points)}></polyline>`})}
      ${t.line?k`<line class="fit" x1=${v(d)} y1=${g(T(t.line(d)))} x2=${v(a)} y2=${g(T(t.line(a)))}></line>`:m}
    </svg>`}static{this.styles=W`
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
  `}};var A=n=>n.filter(e=>!!e);function w(n,e){return{type:"heading",heading:n,heading_style:"title",...e?{icon:e}:{}}}function y(n,e){return n?{type:"tile",entity:n,name:e}:null}function b(n,e){return n?{entity:n,name:e}:null}function pe(n,e,t){return e.length?{type:"history-graph",title:n,hours_to_show:t,entities:e,grid_options:{columns:"full"}}:null}function Oe(n,e,t){return e.length?{type:"statistics-graph",title:n,entities:e,days_to_show:t,period:"hour",stat_types:["mean"],chart_type:"line",grid_options:{columns:"full"}}:null}function $(n,e,t=!1){let r=A(n);return r.length<=(t?0:1)?null:{type:"grid",cards:r,...e?{column_span:e}:{}}}function D(n,e,t,r,s="full"){return e.length?{type:"statistics-graph",title:n,entities:e,period:t,days_to_show:r,stat_types:["change"],chart_type:"bar",grid_options:{columns:s}}:null}var Pt=["heating","dhw","legionella_prevention"];function Tt(n,e,t){if(!n)return null;let r={type:"gauge",entity:n,name:t("cop"),min:0,max:7,needle:!0,severity:{red:0,yellow:3,green:4}};return e?{type:"conditional",conditions:[{condition:"state",entity:e,state:Pt}],card:r}:r}function Ht(n){return n.indoor_entity_id??n.weheat.thermostat_room_temperature}function Lt(n,e,t){let r=n.weheat,s=Ht(n),o=n.outdoor_entity_id??r.outside_temperature,i=A([b(r.water_outlet_temperature,e("supply")),b(r.water_inlet_temperature,e("return")),b(o,e("outdoor")),b(s,e("room"))]),d=A([b(r.power_input,e("power_input")),b(r.power_output,e("power_output"))]),a=A([b(n.insights.delta_t,e("delta_t"))]),h=$([w(e("live"),"mdi:heat-pump"),y(r.heat_pump_state,e("state")),Tt(r.cop,r.heat_pump_state,e),y(s,e("room")),y(o,e("outdoor")),y(r.water_outlet_temperature,e("supply")),y(r.water_inlet_temperature,e("return")),y(n.insights.delta_t,e("delta_t_short")),y(r.power_input,e("power_input_short")),y(r.power_output,e("power_output_short"))]),c=$([w(e("last_24h"),"mdi:clock-outline"),pe(e("temperatures"),i,24),pe(e("power"),d,24),pe(e("delta_t"),a,24)]),l=$([w(e("last_7d"),"mdi:calendar-week"),Oe(e("temperatures"),i,7),Oe(e("power"),d,7),Oe(e("delta_t"),a,7)]);return{title:n.name,path:t===0?"heat-pump":`heat-pump-${t+1}`,icon:"mdi:heat-pump-outline",type:"sections",max_columns:3,sections:A([h,c,l])}}function zt(n,e,t){let r=n.weheat,s=n.insights,o=$([w(e("scop_heading"),"mdi:chart-bar"),y(s.scop_heat_pump_season,e("heat_pump")),y(s.scop_season,e("total")),y(s.scop_heating_season,e("heating")),y(s.scop_dhw_season,e("dhw")),y(s.defrost_cop_impact_season,e("defrost_loss")),w(e("cop_month"),"mdi:calendar-month"),y(s.cop_heat_pump_month,e("heat_pump")),y(s.cop_month,e("total")),w(e("cop_today"),"mdi:calendar-today"),y(s.cop_heat_pump_today,e("heat_pump")),y(s.cop_today,e("total"))]),i=$([{type:`custom:${V}`,entry_id:n.entry_id}],2,!0),d=$([w(e("energy_per_day"),"mdi:lightning-bolt"),D(`${e("energy_per_day")} \xB7 ${e("electricity")}`,A([b(r.electricity_used_heating,e("heating")),b(r.electricity_used_dhw,e("dhw")),b(r.electricity_used_defrost,e("defrost")),b(r.electricity_used_standby,e("standby"))]),"day",30),D(`${e("energy_per_day")} \xB7 ${e("heat")}`,A([b(r.energy_output_heating,e("heating")),b(r.energy_output_dhw,e("dhw")),b(r.energy_output_defrost,e("defrost"))]),"day",30)],2),a=$([w(e("title"),"mdi:information-outline"),{type:"markdown",content:`${e("definitions")}

_${e("disclaimer")}_`}]);return{title:`${n.name} \xB7 ${e("performance")}`,path:t===0?"performance":`performance-${t+1}`,icon:"mdi:chart-bar",type:"sections",max_columns:4,sections:A([o,i,d,a])}}function Rt(n,e,t){let r=n.insights,s=$([w(e("house"),"mdi:home-thermometer"),y(r.heat_loss_coefficient,e("heat_loss_short")),y(r.heat_loss_design_load,e("heat_loss_design")),y(r.balance_point,e("balance_point")),y(r.cool_down_time_constant,e("cool_down_tau")),y(r.cool_down_rate,e("cool_down_rate")),y(r.thermal_mass,e("thermal_mass"))]),o=$([{type:`custom:${j}`,entry_id:n.entry_id,mode:"heat_loss"}],2,!0),i=$([w(e("title"),"mdi:information-outline"),{type:"markdown",content:`${e("house_definitions")}

_${e("disclaimer")}_`}]),d=n.degree_days_statistic_id?{entity:n.degree_days_statistic_id,name:e("degree_days")}:null,a=$([w(e("heat_per_degree_day"),"mdi:home-thermometer-outline"),y(r.heat_per_degree_day_season,e("this_season")),y(r.heat_per_degree_day_last_year,e("last_year_to_date")),y(r.heat_per_degree_day_last_season,e("whole_last_season")),w(e("degree_days"),"mdi:thermometer-lines"),y(r.degree_days_month,e("this_month")),y(r.degree_days_season,e("this_season"))]),h=$([d?D(e("degree_days_per_month"),[d],"month",400,12):null,d?D(e("degree_days_per_day"),[d],"day",30,12):null],2,!0);return{title:`${n.name} \xB7 ${e("house")}`,path:t===0?"house":`house-${t+1}`,icon:"mdi:home-thermometer-outline",type:"sections",max_columns:4,sections:A([s,o,a,h,i])}}var Ot=[[-20,"curve_advice_minus_20"],[9,"curve_advice_9"],[15,"curve_advice_15"],[20,"curve_advice_20"],[25,"curve_advice_25"]],te=n=>n.replace(/\\/g,"\\\\").replace(/'/g,"\\'"),he=n=>n.replace(/ /g,"\xA0").replace(/-/g,"\u2011");function jt(n,e,t=1){return`{{ (('%.${t}f' | format(${n})) | replace('.', '${e}')) if (${n}) is not none else '\u2013' }}`}function Dt(n,e){let t=Ot.filter(([,h])=>n.insights[h]);if(!t.length)return null;let r=n.insights[t[0][1]],s=e("decimal_separator"),o=h=>jt(h,s),i=h=>`state_attr('${h}', 'extrapolated') and not state_attr('${h}', 'no_heat_needed')`,d=JSON.stringify(t.map(([,h])=>n.insights[h]));return[`{% set reason = state_attr('${r}', 'no_advice_reason') %}`,`{% set cur = ${d} | map('state_attr', 'current') | reject('none') | list | count > 0 %}`,`**${e("curve_target")}:** ${o(`state_attr('${r}', 'target_room_temperature')`)}\xA0\xB0C \xB7 ${e("curve_measured")}: ${o(`state_attr('${r}', 'measured_indoor_temperature')`)}\xA0\xB0C`,"",`**${e("curve_emitters")}:** {{ {'radiators': '${te(e("emitter_radiators"))}', 'underfloor': '${te(e("emitter_underfloor"))}', 'mixed': '${te(e("emitter_mixed"))}'}.get(state_attr('${r}', 'emitter_type'), '\u2013') }}`,"",`{% if reason %}${e("curve_no_advice")} {{ {'no_heat_loss': '${te(e("reason_no_heat_loss"))}', 'too_few_steady_hours': '${te(e("reason_too_few_steady_hours"))}'}.get(reason, reason) }}{% endif %}`,"",`| ${he(`${e("curve_outdoor")} (\xB0C)`)} | {% if cur %}${he(`${e("curve_current")} (\xB0C)`)} | {% endif %}${he(`${e("curve_advice")} (\xB0C)`)} | ${he(`${e("curve_range")} (\xB0C)`)} |`,"|---:|{% if cur %}---:|{% endif %}---:|:---|",...t.map(([h,c])=>{let l=n.insights[c],u=`states('${l}') | float(none)`;return`| ${h} | {% if cur %}${o(`state_attr('${l}', 'current')`)} | {% endif %}{% if (${u}) is not none %}**${o(u)}**{% if ${i(l)} %}\\*{% endif %}{% else %}\u2013{% endif %} | {% if state_attr('${l}', 'no_heat_needed') %}${e("curve_no_heat")}{% elif state_attr('${l}', 'range_low') is not none %}${o(`state_attr('${l}', 'range_low')`)}\u2013${o(`state_attr('${l}', 'range_high')`)}{% endif %} |`}),"",`{% if ${d} | select('is_state_attr', 'extrapolated', true) | reject('is_state_attr', 'no_heat_needed', true) | list | count > 0 %}\\* ${e("curve_extrapolated_note")}{% endif %}`,"",`{% if not cur %}_${e("curve_enter_current")}_{% endif %}`].join(`
`)}function Wt(n,e,t){let r=n.insights,s=Dt(n,e),o=$([w(e("curve_advice"),"mdi:chart-bell-curve-cumulative"),s?{type:"markdown",content:s,grid_options:{columns:"full"}}:null],2),i=$([{type:`custom:${j}`,entry_id:n.entry_id,mode:"supply_curve",days:365}],2,!0),d=$([w(e("before_after"),"mdi:swap-vertical"),y(r.heating_electricity_per_degree_day_before,e("per_degree_day_before")),y(r.heating_electricity_per_degree_day_after,e("per_degree_day_after")),y(r.heating_curve_change_effect,e("change_effect"))]),a=$([w(e("title"),"mdi:information-outline"),{type:"markdown",content:`${e("curve_definitions")}

_${e("disclaimer")}_`}]);return{title:`${n.name} \xB7 ${e("heating_curve")}`,path:t===0?"heating-curve":`heating-curve-${t+1}`,icon:"mdi:chart-bell-curve-cumulative",type:"sections",max_columns:4,sections:A([o,i,d,a])}}function Mt(n,e,t){let r=n.insights,s=n.weheat,o=g=>e(g==="standby"?"standby":g),i=(g,T)=>A(T.map(_=>b(r[`${_}${g}`],o(_)))),d=Object.fromEntries(He.filter(g=>r[`operating_${g}`]).map(g=>[g,r[`operating_${g}`]])),a=$([w(e("operation"),"mdi:state-machine"),Object.keys(d).length?{type:`custom:${G}`,entities:d,grid_options:{columns:"full"}}:null],2),h=$([D(e("op_periods_per_day"),i("_periods_total",["heating","dhw","defrost","legionella"]),"day",30),D(e("op_hours_per_day"),i("_time_total",["heating","dhw","defrost","legionella","standby"]),"day",30)],2,!0),c=n.degree_days_statistic_id?{entity:n.degree_days_statistic_id,name:e("degree_days")}:null,l=$([w(e("op_defrost_vs_cold"),"mdi:snowflake-melt"),D(e("defrost"),i("_periods_total",["defrost"]),"day",30,12),c?D(e("degree_days_per_day"),[c],"day",30,12):null],2),u=$([w(e("op_timeline"),"mdi:timeline-clock-outline"),pe(e("state"),A([b(s.heat_pump_state,e("state"))]),24)]),v=$([w(e("title"),"mdi:information-outline"),{type:"markdown",content:`${e("op_definitions")}

_${e("disclaimer")}_`}]);return{title:`${n.name} \xB7 ${e("operation")}`,path:t===0?"operation":`operation-${t+1}`,icon:"mdi:state-machine",type:"sections",max_columns:4,sections:A([a,h,l,u,v])}}function nt(n,e,t){return{title:n("title"),path:"weheat-insights",type:"panel",cards:[{type:"markdown",content:`## ${e}

${t}

_${n("disclaimer")}_`}]}}function st(n,e){return n.length?{title:e("title"),views:n.flatMap((t,r)=>[zt(t,e,r),Rt(t,e,r),Wt(t,e,r),Mt(t,e,r),Lt(t,e,r)])}:{title:e("title"),views:[nt(e,e("no_pumps_title"),e("no_pumps_body"))]}}function ot(n,e){return{title:n("title"),views:[nt(n,n("error_title"),`${n("error_body")}

\`${e}\``)]}}var it="ll-strategy-dashboard-weheat-insights",je=class extends HTMLElement{static async generate(e,t){let r=L(t);try{let s=await t.callWS({type:"weheat_insights/dashboard_config"});return st(s.heat_pumps,r)}catch(s){let o=s instanceof Error?s.message:JSON.stringify(s);return ot(r,o)}}};customElements.get(it)||customElements.define(it,je);customElements.get(V)||customElements.define(V,ae);customElements.get(G)||customElements.define(G,le);customElements.get(j)||customElements.define(j,ce);window.customCards=window.customCards??[];window.customCards.some(n=>n.type===V)||window.customCards.push({type:V,name:"Weheat Insights performance",description:"COP per day, month or season for heating and hot water (unofficial)"});window.customCards.some(n=>n.type===j)||window.customCards.push({type:j,name:"Weheat Insights scatter",description:"Heat loss of the house or supply vs outdoor temperature (unofficial)"});window.customCards.some(n=>n.type===G)||window.customCards.push({type:G,name:"Weheat Insights operation",description:"Time per operating state and number and length of periods (unofficial)"});window.customStrategies=window.customStrategies??[];window.customStrategies.some(n=>n.type==="weheat-insights")||window.customStrategies.push({type:"weheat-insights",strategyType:"dashboard",name:"Weheat Insights",description:"Live overview and history for Weheat heat pumps (unofficial)"});
