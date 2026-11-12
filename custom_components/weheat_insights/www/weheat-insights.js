var _e=globalThis,me=_e.ShadowRoot&&(_e.ShadyCSS===void 0||_e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Se=Symbol(),et=new WeakMap,ne=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==Se)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(me&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=et.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&et.set(t,e))}return e}toString(){return this.cssText}},tt=n=>new ne(typeof n=="string"?n:n+"",void 0,Se),N=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((r,o,s)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+n[s+1],n[0]);return new ne(t,n,Se)},rt=(n,e)=>{if(me)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let r=document.createElement("style"),o=_e.litNonce;o!==void 0&&r.setAttribute("nonce",o),r.textContent=t.cssText,n.appendChild(r)}},Ee=me?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return tt(t)})(n):n;var{is:zt,defineProperty:Tt,getOwnPropertyDescriptor:Ht,getOwnPropertyNames:Lt,getOwnPropertySymbols:Ot,getPrototypeOf:Dt}=Object,ge=globalThis,nt=ge.trustedTypes,Rt=nt?nt.emptyScript:"",Mt=ge.reactiveElementPolyfillSupport,oe=(n,e)=>n,Pe={toAttribute(n,e){switch(e){case Boolean:n=n?Rt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},at=(n,e)=>!zt(n,e),ot={attribute:!0,type:String,converter:Pe,reflect:!1,useDefault:!1,hasChanged:at};Symbol.metadata??=Symbol("metadata"),ge.litPropertyMetadata??=new WeakMap;var I=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ot){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let r=Symbol(),o=this.getPropertyDescriptor(e,r,t);o!==void 0&&Tt(this.prototype,e,o)}}static getPropertyDescriptor(e,t,r){let{get:o,set:s}=Ht(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:o,set(a){let l=o?.call(this);s?.call(this,a),this.requestUpdate(e,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ot}static _$Ei(){if(this.hasOwnProperty(oe("elementProperties")))return;let e=Dt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(oe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(oe("properties"))){let t=this.properties,r=[...Lt(t),...Ot(t)];for(let o of r)this.createProperty(o,t[o])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[r,o]of t)this.elementProperties.set(r,o)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let o=this._$Eu(t,r);o!==void 0&&this._$Eh.set(o,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let o of r)t.unshift(Ee(o))}else e!==void 0&&t.push(Ee(e));return t}static _$Eu(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){let r=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,r);if(o!==void 0&&r.reflect===!0){let s=(r.converter?.toAttribute!==void 0?r.converter:Pe).toAttribute(t,r.type);this._$Em=e,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(e,t){let r=this.constructor,o=r._$Eh.get(e);if(o!==void 0&&this._$Em!==o){let s=r.getPropertyOptions(o),a=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Pe;this._$Em=o;let l=a.fromAttribute(t,s.type);this[o]=l??this._$Ej?.get(o)??l,this._$Em=null}}requestUpdate(e,t,r,o=!1,s){if(e!==void 0){let a=this.constructor;if(o===!1&&(s=this[e]),r??=a.getPropertyOptions(e),!((r.hasChanged??at)(s,t)||r.useDefault&&r.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:o,wrapped:s},a){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),s!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),o===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,s]of this._$Ep)this[o]=s;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[o,s]of r){let{wrapped:a}=s,l=this[o];a!==!0||this._$AL.has(o)||l===void 0||this.C(o,void 0,s,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};I.elementStyles=[],I.shadowRootOptions={mode:"open"},I[oe("elementProperties")]=new Map,I[oe("finalized")]=new Map,Mt?.({ReactiveElement:I}),(ge.reactiveElementVersions??=[]).push("2.1.2");var Re=globalThis,st=n=>n,fe=Re.trustedTypes,it=fe?fe.createPolicy("lit-html",{createHTML:n=>n}):void 0,pt="$lit$",V=`lit$${Math.random().toFixed(9).slice(2)}$`,_t="?"+V,Wt=`<${_t}>`,K=document,se=()=>K.createComment(""),ie=n=>n===null||typeof n!="object"&&typeof n!="function",Me=Array.isArray,jt=n=>Me(n)||typeof n?.[Symbol.iterator]=="function",ze=`[ 	
\f\r]`,ae=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,dt=/-->/g,lt=/>/g,F=RegExp(`>|${ze}(?:([^\\s"'>=/]+)(${ze}*=${ze}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ct=/'/g,ht=/"/g,mt=/^(?:script|style|textarea|title)$/i,We=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),m=We(1),b=We(2),vr=We(3),Y=Symbol.for("lit-noChange"),y=Symbol.for("lit-nothing"),ut=new WeakMap,G=K.createTreeWalker(K,129);function gt(n,e){if(!Me(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return it!==void 0?it.createHTML(e):e}var Nt=(n,e)=>{let t=n.length-1,r=[],o,s=e===2?"<svg>":e===3?"<math>":"",a=ae;for(let l=0;l<t;l++){let d=n[l],h,c,i=-1,f=0;for(;f<d.length&&(a.lastIndex=f,c=a.exec(d),c!==null);)f=a.lastIndex,a===ae?c[1]==="!--"?a=dt:c[1]!==void 0?a=lt:c[2]!==void 0?(mt.test(c[2])&&(o=RegExp("</"+c[2],"g")),a=F):c[3]!==void 0&&(a=F):a===F?c[0]===">"?(a=o??ae,i=-1):c[1]===void 0?i=-2:(i=a.lastIndex-c[2].length,h=c[1],a=c[3]===void 0?F:c[3]==='"'?ht:ct):a===ht||a===ct?a=F:a===dt||a===lt?a=ae:(a=F,o=void 0);let p=a===F&&n[l+1].startsWith("/>")?" ":"";s+=a===ae?d+Wt:i>=0?(r.push(h),d.slice(0,i)+pt+d.slice(i)+V+p):d+V+(i===-2?l:p)}return[gt(n,s+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},de=class n{constructor({strings:e,_$litType$:t},r){let o;this.parts=[];let s=0,a=0,l=e.length-1,d=this.parts,[h,c]=Nt(e,t);if(this.el=n.createElement(h,r),G.currentNode=this.el.content,t===2||t===3){let i=this.el.content.firstChild;i.replaceWith(...i.childNodes)}for(;(o=G.nextNode())!==null&&d.length<l;){if(o.nodeType===1){if(o.hasAttributes())for(let i of o.getAttributeNames())if(i.endsWith(pt)){let f=c[a++],p=o.getAttribute(i).split(V),w=/([.?@])?(.*)/.exec(f);d.push({type:1,index:s,name:w[2],strings:p,ctor:w[1]==="."?He:w[1]==="?"?Le:w[1]==="@"?Oe:ee}),o.removeAttribute(i)}else i.startsWith(V)&&(d.push({type:6,index:s}),o.removeAttribute(i));if(mt.test(o.tagName)){let i=o.textContent.split(V),f=i.length-1;if(f>0){o.textContent=fe?fe.emptyScript:"";for(let p=0;p<f;p++)o.append(i[p],se()),G.nextNode(),d.push({type:2,index:++s});o.append(i[f],se())}}}else if(o.nodeType===8)if(o.data===_t)d.push({type:2,index:s});else{let i=-1;for(;(i=o.data.indexOf(V,i+1))!==-1;)d.push({type:7,index:s}),i+=V.length-1}s++}}static createElement(e,t){let r=K.createElement("template");return r.innerHTML=e,r}};function Q(n,e,t=n,r){if(e===Y)return e;let o=r!==void 0?t._$Co?.[r]:t._$Cl,s=ie(e)?void 0:e._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),s===void 0?o=void 0:(o=new s(n),o._$AT(n,t,r)),r!==void 0?(t._$Co??=[])[r]=o:t._$Cl=o),o!==void 0&&(e=Q(n,o._$AS(n,e.values),o,r)),e}var Te=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:r}=this._$AD,o=(e?.creationScope??K).importNode(t,!0);G.currentNode=o;let s=G.nextNode(),a=0,l=0,d=r[0];for(;d!==void 0;){if(a===d.index){let h;d.type===2?h=new le(s,s.nextSibling,this,e):d.type===1?h=new d.ctor(s,d.name,d.strings,this,e):d.type===6&&(h=new De(s,this,e)),this._$AV.push(h),d=r[++l]}a!==d?.index&&(s=G.nextNode(),a++)}return G.currentNode=K,o}p(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},le=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,o){this.type=2,this._$AH=y,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Q(this,e,t),ie(e)?e===y||e==null||e===""?(this._$AH!==y&&this._$AR(),this._$AH=y):e!==this._$AH&&e!==Y&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):jt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==y&&ie(this._$AH)?this._$AA.nextSibling.data=e:this.T(K.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:r}=e,o=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=de.createElement(gt(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===o)this._$AH.p(t);else{let s=new Te(o,this),a=s.u(this.options);s.p(t),this.T(a),this._$AH=s}}_$AC(e){let t=ut.get(e.strings);return t===void 0&&ut.set(e.strings,t=new de(e)),t}k(e){Me(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,o=0;for(let s of e)o===t.length?t.push(r=new n(this.O(se()),this.O(se()),this,this.options)):r=t[o],r._$AI(s),o++;o<t.length&&(this._$AR(r&&r._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let r=st(e).nextSibling;st(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},ee=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,o,s){this.type=1,this._$AH=y,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=y}_$AI(e,t=this,r,o){let s=this.strings,a=!1;if(s===void 0)e=Q(this,e,t,0),a=!ie(e)||e!==this._$AH&&e!==Y,a&&(this._$AH=e);else{let l=e,d,h;for(e=s[0],d=0;d<s.length-1;d++)h=Q(this,l[r+d],t,d),h===Y&&(h=this._$AH[d]),a||=!ie(h)||h!==this._$AH[d],h===y?e=y:e!==y&&(e+=(h??"")+s[d+1]),this._$AH[d]=h}a&&!o&&this.j(e)}j(e){e===y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},He=class extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===y?void 0:e}},Le=class extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==y)}},Oe=class extends ee{constructor(e,t,r,o,s){super(e,t,r,o,s),this.type=5}_$AI(e,t=this){if((e=Q(this,e,t,0)??y)===Y)return;let r=this._$AH,o=e===y&&r!==y||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,s=e!==y&&(r===y||o);o&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},De=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){Q(this,e)}};var It=Re.litHtmlPolyfillSupport;It?.(de,le),(Re.litHtmlVersions??=[]).push("3.3.3");var ft=(n,e,t)=>{let r=t?.renderBefore??e,o=r._$litPart$;if(o===void 0){let s=t?.renderBefore??null;r._$litPart$=o=new le(e.insertBefore(se(),s),s,void 0,t??{})}return o._$AI(n),o};var je=globalThis,L=class extends I{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ft(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Y}};L._$litElement$=!0,L.finalized=!0,je.litElementHydrateSupport?.({LitElement:L});var Ut=je.litElementPolyfillSupport;Ut?.({LitElement:L});(je.litElementVersions??=[]).push("4.2.2");var Ne={title:"Weheat Insights",live:"Live",last_24h:"Last 24 hours",last_7d:"Last 7 days",water_temperatures:"Water temperature",air_temperatures:"Outdoor and room temperature",power:"Power",cop:"COP",delta_t:"\u0394T supply/return",state:"Operating state",room:"Room",room_setpoint:"Room target",supply_setpoint:"Supply target",outdoor:"Outdoor",supply:"Supply",return:"Return",power_input:"Electrical power",power_output:"Heat output",no_pumps_title:"No heat pump set up yet",no_pumps_body:"Add the **Weheat Insights** integration under *Settings \u2192 Devices & services* and pick a heat pump. This dashboard fills itself in once that is done.",error_title:"Weheat Insights is not available",error_body:"The dashboard could not load its configuration. Check that the Weheat Insights integration is installed and loaded.",disclaimer:"Unofficial community project, not affiliated with Weheat.",performance:"Performance",cop_history:"COP over time",day:"Day",month:"Month",season:"Season",heating:"Heating",dhw:"Hot water",total:"Total",no_data:"No data for this period yet.",electricity:"electricity",heat:"heat",scop_season:"SCOP this season",cop_month:"COP this month",cop_today:"COP today",defrost_cop_impact:"COP lost to defrost",degree_days_month:"Degree days this month",degree_days_season:"Degree days this season",heat_per_degree_day:"Heating per degree day",heat_per_degree_day_last_year:"Same period last season",heat_per_degree_day_last_season:"Whole last season",energy_per_day:"Energy per day",degree_days_per_day:"Degree days per day",degree_days_per_month:"Degree days per month",defrost:"Defrost",house:"House",heat_loss_short:"Heat loss",heating_curve:"Heating curve",advised_curve:"advice",curve_advice:"Advice",curve_current:"Current",current_curve:"current curve",curve_enter_current:"To compare with your current heating curve, enter it under Settings \u2192 Devices & services \u2192 Weheat Insights \u2192 Configure (the five water temperatures from the Weheat app).",curve_outdoor:"Outdoor",curve_range:"Range",curve_extrapolated:"extrapolated",curve_extrapolated_note:"Based on extrapolation: this outdoor temperature is far outside the temperatures measured so far. Treat this advice as a starting point.",curve_no_heat:"no heat needed",curve_target:"Target room temperature",decimal_separator:".",operation:"Operation",op_share_30d:"Time per state, last 30 days",op_no_periods:"no periods yet",op_avg_short:"avg",legionella:"Legionella prevention",op_today:"Today",op_7d:"7\xA0days",op_30d:"30\xA0days",op_periods_per_day:"Periods per day",op_hours_per_day:"Hours per day",op_defrost_vs_cold:"Defrosts and degree days per day",op_timeline:"Operating state, last 24 hours",op_definitions:"**How this is counted.** A period is an uninterrupted stretch in one state. *Legionella prevention* is the periodic heating of the hot-water tank to a high temperature. Rare states such as a water check or a firmware update are not counted. The core Weheat integration reports the state every two minutes, so lengths are accurate to about two minutes and a very short defrost can be missed. Today, 7 days and 30 days count periods that ended in that window; a running period is not counted yet. The bar charts use running totals with long-term statistics, so they keep their history.",curve_emitters:"Heating system",emitter_radiators:"radiators",emitter_underfloor:"underfloor heating",emitter_mixed:"radiators and underfloor heating",curve_measured:"measured indoor (last 2 weeks)",curve_no_advice:"No advice yet:",reason_no_heat_loss:"the heat-loss coefficient is not known yet (see the House tab).",reason_too_few_steady_hours:"not enough hours of steady heating yet (at least 24 in the last 12 months).",before_after:"Before and after the curve change",per_degree_day_before:"Before",per_degree_day_after:"After",change_effect:"Change",curve_definitions:"**How the advice is made.** For each outdoor temperature of the Weheat curve: the heat the house needs (from the heat-loss coefficient, at your target room temperature), and the water temperature at which your heating system delivers exactly that heat (calibrated on hours of steady heating over the last 12 months, with the chosen heating system). Where no heat is needed, the advice is the room temperature. The advice has one decimal: enter it in the Weheat web portal, or round up to whole degrees in the app. The *range* comes from the uncertainty of the heat-loss coefficient. Points far outside the measured outdoor temperatures are *extrapolated*: treat them as a starting point. This is advice, not a guarantee: change the curve in small steps and check that the rooms stay warm. Enter your current curve under Settings \u2192 Devices & services \u2192 Weheat Insights \u2192 Configure: the table and chart then show it next to the advice. When you change those values later, the change date is stored automatically, and before/after compares heating electricity per degree day (corrected for weather).",heat_loss_title:"Heat loss",supply_curve_title:"Supply temperature vs outdoor",indoor_outdoor_diff:"Indoor \u2212 outdoor (K)",heating_per_day:"Heating heat (kWh/day)",outdoor_temp:"Outdoor temperature (\xB0C)",supply_temp:"Supply temperature (\xB0C)",days_used:"days",excluded:"excluded",used:"used",fit_line:"fit",indoor_assumed_note:"No indoor sensor configured: 20\xA0\xB0C assumed, so this is less reliable.",reason_too_few_days:"Not enough usable days yet (at least 14 needed).",reason_too_little_spread:"Not enough difference between mild and cold days yet (at least 6\xA0K needed).",reason_no_relation:"No clear relation between temperature difference and heating yet.",heat_loss_coefficient:"Heat-loss coefficient",heat_loss_design:"At \u221210\xA0\xB0C",balance_point:"Balance point",cool_down_tau:"Time constant",cool_down_rate:"Cool-down at 15\xA0K",thermal_mass:"Thermal mass",house_definitions:"**Heat loss.** Each dot is one day: heating heat against the average indoor\u2212outdoor difference. The slope of the line is the heat-loss coefficient (W/K, shown with a 95\xA0% confidence interval); where the line reaches zero tells how much free heat (sun, people, appliances) the house gets, and gives the balance point. Grey dots are days left out: missing data, too mild, no heating at all, a big indoor temperature change, or another heat source running. **Cool-down** uses periods of 4+ hours without heating and needs an indoor sensor. **Degree days** measure how cold it was: per day the base temperature (18\xA0\xB0C, a setting) minus the average outdoor temperature, weighted by season by default. **Heating per degree day** divides space-heating heat by degree days, so a mild and a cold winter can be compared.",delta_t_short:"\u0394T",power_input_short:"Electricity",power_output_short:"Heat",heat_pump:"Heat pump",pumps:"pumps",this_season:"This season",this_month:"This month",today:"Today",defrost_loss:"Lost to defrost",last_year_to_date:"Last year to date",whole_last_season:"Last season",scop_heading:"SCOP this season",cop_heading:"COP",standby:"Standby",degree_days:"Degree days",definitions:"**How these numbers are calculated.** *Heat pump* COP/SCOP is all useful heat divided by the compressor electricity for heating, hot water and defrost; this matches the Weheat app. *Total* also counts standby and the indoor unit (circulation pumps): what your heat actually costs. *Heating* and *hot water* only count the compressor electricity for that mode plus its share of defrost (split by electricity use); standby and the indoor unit are left out. Heat taken back from the water during defrost counts against the COP. *COP over time* shows the same figures per day, month or heating season. A COP is only shown once at least 0.5\xA0kWh of electricity was used. Figures come from Home Assistant's long-term statistics and can lag up to about an hour.",hot_water_tab:"Hot water",dhw_tank:"Tank",dhw_top:"Tank top",dhw_bottom:"Tank bottom",dhw_tank_48h:"Tank temperature, last 48 hours",dhw_per_day:"Per day",dhw_efficiency:"Efficiency",dhw_habits:"When and how much",dhw_target_title:"Tank heated to",dhw_energy_title:"Hot-water energy per day",dhw_cop_target_title:"COP against tank temperature",dhw_cop_outdoor_title:"COP against outdoor temperature",dhw_start_hours_title:"Start of heating per hour",dhw_standing_loss_title:"Standing loss per week",dhw_target_today:"Heated to today",dhw_target_typical:"Usually heated to",dhw_runs_per_day:"Runs per day",dhw_heat_per_run:"Heat per run",dhw_heat_per_day:"Heat per day",dhw_standing_loss:"Standing loss",dhw_summary_note:"Over the last {days} days. Heated to: highest temperature at the bottom of the tank.",dhw_tank_temperature:"Tank temperature",dhw_heat:"Heat",dhw_electricity:"Electricity",dhw_start_hours_note:"Hot-water runs and legionella prevention over the last {days} days, by the hour they started.",dhw_standing_loss_none:"No quiet nights measured yet: this needs a few nights without hot-water use or heating of the tank.",dhw_week_of:"Week of",dhw_standing_loss_note:"How fast the top of the tank cools at night while no hot water is used or made (median per week). Rising over time can mean worse insulation or a leaking valve.",dhw_fit_target:"Each \xB0C hotter in the tank changes the COP by {value}, at the same outdoor temperature (dashed line).",dhw_fit_outdoor:"Each \xB0C warmer outside changes the COP by {value}, at the same tank temperature (dashed line).",dhw_fit_narrow_target:"Your tank is heated to about the same temperature every day, so this cannot show yet what a degree more or less costs. Change the target for a while and it will.",dhw_fit_narrow_outdoor:"The outdoor temperature has varied too little yet to show its effect.",dhw_legionella_cop:"Legionella days: COP {legionella} on average, other days {other}.",dhw_color_outdoor:"colour: outdoor cold \u2192 warm",dhw_color_target:"colour: tank cooler \u2192 hotter",dhw_definitions:`**How hot water is measured**

- **Heated to**: the highest temperature of the *bottom* sensor that day; the heat pump stops once the bottom of the tank is at its target. On a legionella day that is the legionella temperature.
- **COP**: hot-water heat \xF7 hot-water electricity plus its share of defrost, per day from 0.25 kWh.
- **Dashed lines**: straight-line fits through the days without legionella prevention (hollow dots).
- **Standing loss**: how fast the *top* of the tank cools at night (00:00\u201307:00) without a run or tapping; depends on the tank and the room it is in.
- **History**: tank temperatures start when the Weheat integration was added to Home Assistant.`},Vt={title:"Weheat Insights",live:"Live",last_24h:"Afgelopen 24 uur",last_7d:"Afgelopen 7 dagen",water_temperatures:"Watertemperatuur",air_temperatures:"Buiten- en kamertemperatuur",power:"Vermogen",cop:"COP",delta_t:"\u0394T aanvoer/retour",state:"Bedrijfstoestand",room:"Kamer",room_setpoint:"Doel kamer",supply_setpoint:"Doel aanvoer",outdoor:"Buiten",supply:"Aanvoer",return:"Retour",power_input:"Elektrisch vermogen",power_output:"Warmteafgifte",no_pumps_title:"Nog geen warmtepomp ingesteld",no_pumps_body:"Voeg de integratie **Weheat Insights** toe via *Instellingen \u2192 Apparaten & diensten* en kies een warmtepomp. Dit dashboard vult zich daarna vanzelf.",error_title:"Weheat Insights is niet beschikbaar",error_body:"Het dashboard kon zijn configuratie niet laden. Controleer of de integratie Weheat Insights is ge\xEFnstalleerd en geladen.",disclaimer:"Onofficieel communityproject, niet verbonden aan Weheat.",performance:"Prestaties",cop_history:"COP door de tijd",day:"Dag",month:"Maand",season:"Seizoen",heating:"Verwarming",dhw:"Warm water",total:"Totaal",no_data:"Nog geen gegevens voor deze periode.",electricity:"stroom",heat:"warmte",scop_season:"SCOP dit stookseizoen",cop_month:"COP deze maand",cop_today:"COP vandaag",defrost_cop_impact:"COP-verlies door ontdooien",degree_days_month:"Graaddagen deze maand",degree_days_season:"Graaddagen dit stookseizoen",heat_per_degree_day:"Verwarming per graaddag",heat_per_degree_day_last_year:"Zelfde periode vorig seizoen",heat_per_degree_day_last_season:"Heel vorig seizoen",energy_per_day:"Energie per dag",degree_days_per_day:"Graaddagen per dag",degree_days_per_month:"Graaddagen per maand",defrost:"Ontdooien",house:"Woning",heat_loss_short:"Warmteverlies",heating_curve:"Stooklijn",advised_curve:"advies",curve_advice:"Advies",curve_current:"Huidig",current_curve:"huidige stooklijn",curve_enter_current:"Om te vergelijken met je huidige stooklijn: vul hem in onder Instellingen \u2192 Apparaten & diensten \u2192 Weheat Insights \u2192 Configureren (de vijf watertemperaturen uit de Weheat-app).",curve_outdoor:"Buiten",curve_range:"Bandbreedte",curve_extrapolated:"ge\xEBxtrapoleerd",curve_extrapolated_note:"Gebaseerd op extrapolatie: deze buitentemperatuur ligt ver buiten de tot nu toe gemeten temperaturen. Zie dit advies als startpunt.",curve_no_heat:"geen warmte nodig",curve_target:"Gewenste kamertemperatuur",decimal_separator:",",operation:"Bedrijf",op_share_30d:"Tijd per toestand, afgelopen 30 dagen",op_no_periods:"nog geen periodes",op_avg_short:"gem.",legionella:"Legionellapreventie",op_today:"Vandaag",op_7d:"7\xA0dagen",op_30d:"30\xA0dagen",op_periods_per_day:"Periodes per dag",op_hours_per_day:"Uren per dag",op_defrost_vs_cold:"Ontdooiperiodes en graaddagen per dag",op_timeline:"Bedrijfstoestand, afgelopen 24 uur",op_definitions:"**Zo wordt geteld.** Een periode is een ononderbroken stuk in \xE9\xE9n toestand. *Legionellapreventie* is het periodiek opwarmen van het warmwatervat tot een hoge temperatuur. Zeldzame toestanden zoals een watercontrole of een firmware-update tellen niet mee. De Weheat-integratie geeft de toestand elke twee minuten door, dus lengtes kloppen tot op ongeveer twee minuten en een heel korte ontdooiing kan gemist worden. Vandaag, 7 dagen en 30 dagen tellen periodes die in die tijd zijn ge\xEBindigd; een lopende periode telt nog niet mee. De staafgrafieken gebruiken lopende totalen met langetermijnstatistieken en houden dus hun geschiedenis.",curve_emitters:"Afgiftesysteem",emitter_radiators:"radiatoren",emitter_underfloor:"vloerverwarming",emitter_mixed:"radiatoren en vloerverwarming",curve_measured:"gemeten binnen (afgelopen 2 weken)",curve_no_advice:"Nog geen advies:",reason_no_heat_loss:"de warmteverliesco\xEBffici\xEBnt is nog niet bekend (zie het tabblad Woning).",reason_too_few_steady_hours:"nog te weinig uren met continu verwarmen (minstens 24 in de afgelopen 12 maanden).",before_after:"Voor en na de stooklijnwijziging",per_degree_day_before:"Voor",per_degree_day_after:"Na",change_effect:"Verschil",curve_definitions:"**Zo komt het advies tot stand.** Voor elke buitentemperatuur van de Weheat-stooklijn: de warmte die het huis nodig heeft (uit de warmteverliesco\xEBffici\xEBnt, bij je gewenste kamertemperatuur), en de watertemperatuur waarbij je afgiftesysteem precies die warmte levert (gekalibreerd op uren met continu verwarmen in de afgelopen 12 maanden, met het gekozen afgiftesysteem). Waar geen warmte nodig is, is het advies de kamertemperatuur. Het advies heeft \xE9\xE9n decimaal: vul het zo in via het Weheat-webportaal, of rond in de app naar boven af op hele graden. De *bandbreedte* komt uit de onzekerheid van de warmteverliesco\xEBffici\xEBnt. Punten ver buiten de gemeten buitentemperaturen zijn *ge\xEBxtrapoleerd*: zie ze als startpunt. Dit is een advies, geen garantie: pas de stooklijn in kleine stappen aan en controleer of de kamers warm blijven. Vul je huidige stooklijn in onder Instellingen \u2192 Apparaten & diensten \u2192 Weheat Insights \u2192 Configureren: tabel en grafiek tonen hem dan naast het advies. Pas je die waarden later aan, dan wordt de datum van de wijziging automatisch opgeslagen en vergelijkt voor/na het stroomverbruik voor verwarming per graaddag (gecorrigeerd voor het weer).",heat_loss_title:"Warmteverlies",supply_curve_title:"Aanvoertemperatuur vs buiten",indoor_outdoor_diff:"Binnen \u2212 buiten (K)",heating_per_day:"Verwarmingswarmte (kWh/dag)",outdoor_temp:"Buitentemperatuur (\xB0C)",supply_temp:"Aanvoertemperatuur (\xB0C)",days_used:"dagen",excluded:"uitgesloten",used:"gebruikt",fit_line:"lijn",indoor_assumed_note:"Geen binnensensor ingesteld: 20\xA0\xB0C aangenomen, dus minder betrouwbaar.",reason_too_few_days:"Nog niet genoeg bruikbare dagen (minstens 14 nodig).",reason_too_little_spread:"Nog te weinig verschil tussen zachte en koude dagen (minstens 6\xA0K nodig).",reason_no_relation:"Nog geen duidelijk verband tussen temperatuurverschil en verwarming.",heat_loss_coefficient:"Warmteverliesco\xEBffici\xEBnt",heat_loss_design:"Bij \u221210\xA0\xB0C",balance_point:"Stookgrens",cool_down_tau:"Tijdconstante",cool_down_rate:"Afkoeling bij 15\xA0K",thermal_mass:"Warmtecapaciteit",house_definitions:"**Warmteverlies.** Elke stip is \xE9\xE9n dag: verwarmingswarmte tegen het gemiddelde verschil tussen binnen en buiten. De helling van de lijn is de warmteverliesco\xEBffici\xEBnt (W/K, met een betrouwbaarheidsinterval van 95\xA0%); waar de lijn nul raakt zie je hoeveel gratis warmte (zon, mensen, apparaten) het huis krijgt, en daarmee de stookgrens. Grijze stippen zijn dagen die niet meetellen: ontbrekende gegevens, te zacht, helemaal niet verwarmd, een grote verandering binnen of een andere warmtebron. **Afkoeling** gebruikt periodes van minstens 4 uur zonder verwarming en heeft een binnensensor nodig. **Graaddagen** geven aan hoe koud het was: per dag de basistemperatuur (18\xA0\xB0C, instelbaar) min de gemiddelde buitentemperatuur, standaard gewogen naar seizoen. **Verwarming per graaddag** deelt de verwarmingswarmte door de graaddagen, zodat je een zachte en een koude winter kunt vergelijken.",delta_t_short:"\u0394T",power_input_short:"Stroom",power_output_short:"Warmte",heat_pump:"Warmtepomp",pumps:"pompen",this_season:"Dit seizoen",this_month:"Deze maand",today:"Vandaag",defrost_loss:"Ontdooiverlies",last_year_to_date:"Vorig jaar tot nu",whole_last_season:"Vorig seizoen",scop_heading:"SCOP dit stookseizoen",cop_heading:"COP",standby:"Stand-by",degree_days:"Graaddagen",definitions:"**Zo worden deze getallen berekend.** De COP/SCOP *warmtepomp* is alle nuttige warmte gedeeld door de compressorstroom voor verwarming, warm water en ontdooien; dat komt overeen met de Weheat-app. *Totaal* telt ook stand-by en de binnenunit (circulatiepompen) mee: wat je warmte echt kost. *Verwarming* en *warm water* tellen alleen de compressorstroom voor die functie plus hun deel van het ontdooien (verdeeld naar stroomverbruik); stand-by en de binnenunit tellen daar niet mee. Warmte die bij ontdooien uit het water wordt gehaald, telt negatief mee. *COP door de tijd* toont dezelfde cijfers per dag, maand of stookseizoen. Een COP verschijnt pas als er minstens 0,5\xA0kWh stroom is gebruikt. De cijfers komen uit de langetermijnstatistieken van Home Assistant en kunnen tot ongeveer een uur achterlopen.",hot_water_tab:"Warm water",dhw_tank:"Boiler",dhw_top:"Boiler boven",dhw_bottom:"Boiler onder",dhw_tank_48h:"Boilertemperatuur, afgelopen 48 uur",dhw_per_day:"Per dag",dhw_efficiency:"Rendement",dhw_habits:"Wanneer en hoeveel",dhw_target_title:"Boiler opgewarmd tot",dhw_energy_title:"Warmwaterenergie per dag",dhw_cop_target_title:"COP tegen boilertemperatuur",dhw_cop_outdoor_title:"COP tegen buitentemperatuur",dhw_start_hours_title:"Start van opwarmen per uur",dhw_standing_loss_title:"Stilstandsverlies per week",dhw_target_today:"Vandaag opgewarmd tot",dhw_target_typical:"Meestal opgewarmd tot",dhw_runs_per_day:"Runs per dag",dhw_heat_per_run:"Warmte per run",dhw_heat_per_day:"Warmte per dag",dhw_standing_loss:"Stilstandsverlies",dhw_summary_note:"Over de laatste {days} dagen. Opgewarmd tot: hoogste temperatuur onderin de boiler.",dhw_tank_temperature:"Boilertemperatuur",dhw_heat:"Warmte",dhw_electricity:"Stroom",dhw_start_hours_note:"Warmwaterruns en legionellapreventie van de laatste {days} dagen, naar het uur waarin ze begonnen.",dhw_standing_loss_none:"Nog geen rustige nachten gemeten: daarvoor zijn een paar nachten nodig zonder warmwatergebruik of opwarmen van de boiler.",dhw_week_of:"Week van",dhw_standing_loss_note:"Hoe snel de bovenkant van de boiler 's nachts afkoelt als er geen warm water wordt gebruikt of gemaakt (mediaan per week). Stijgt dit, dan kan de isolatie slechter zijn of lekt er een klep.",dhw_fit_target:"Elke \xB0C heter in de boiler verandert de COP met {value}, bij dezelfde buitentemperatuur (stippellijn).",dhw_fit_outdoor:"Elke \xB0C warmer buiten verandert de COP met {value}, bij dezelfde boilertemperatuur (stippellijn).",dhw_fit_narrow_target:"Je boiler wordt elke dag tot ongeveer dezelfde temperatuur opgewarmd, dus hier is nog niet te zien wat een graad meer of minder kost. Verander de doeltemperatuur een tijdje, dan wel.",dhw_fit_narrow_outdoor:"De buitentemperatuur varieerde nog te weinig om het effect te laten zien.",dhw_legionella_cop:"Legionelladagen: gemiddeld COP {legionella}, andere dagen {other}.",dhw_color_outdoor:"kleur: buiten koud \u2192 warm",dhw_color_target:"kleur: boiler koeler \u2192 heter",dhw_definitions:`**Zo wordt warm water gemeten**

- **Opgewarmd tot**: de hoogste temperatuur van de *onderste* sensor die dag; de warmtepomp stopt zodra de onderkant van de boiler op temperatuur is. Op een legionelladag is dat de legionellatemperatuur.
- **COP**: warmwaterwarmte \xF7 warmwaterstroom plus het deel van het ontdooien, per dag vanaf 0,25 kWh.
- **Stippellijnen**: rechte lijnen door de dagen zonder legionellapreventie (open rondjes).
- **Stilstandsverlies**: hoe snel de *bovenkant* van de boiler 's nachts (00:00\u201307:00) afkoelt zonder run of tappen; hangt af van de boiler en de ruimte waarin hij staat.
- **Geschiedenis**: boilertemperaturen beginnen pas sinds de Weheat-integratie aan Home Assistant is toegevoegd.`},Bt={en:Ne,nl:Vt};function D(n){return(n.locale?.language??n.language??"en").split("-")[0]}function j(n){let e=Bt[D(n)]??Ne;return t=>e[t]??Ne[t]}var B="weheat-insights-scatter-card",Ie=600,Ue=300,O={left:46,right:12,top:12,bottom:40},Ft=3600*1e3;function te(n,e,t=6){if(!isFinite(n)||!isFinite(e))return[];n===e&&(n-=1,e+=1);let r=(e-n)/t,o=10**Math.floor(Math.log10(r)),s=[1,2,2.5,5,10].map(l=>l*o).find(l=>l>=r)??r,a=[];for(let l=Math.floor(n/s)*s;l<=e+s*1e-9;l+=s)a.push(Math.round(l*1e6)/1e6);return a[a.length-1]<e&&a.push(a[a.length-1]+s),a}function Gt(n,e){if(!n.length)return null;if(e<=n[0].x)return n.length>1?Ve(n[0],n[1],e):n[0].y;for(let r=1;r<n.length;r++)if(e<=n[r].x)return Ve(n[r-1],n[r],e);let t=n.length;return t>1?Ve(n[t-2],n[t-1],e):n[0].y}function Ve(n,e,t){return n.y+(e.y-n.y)*(t-n.x)/(e.x-n.x)}function Kt(n,e,t,r,o){let s=(n(t)-n(e))/(t-e),[a,l]=[e,t];if(s===0)return n(e)>=r&&n(e)<=o?[a,l]:null;let d=i=>e+(i-n(e))/s,[h,c]=[d(r),d(o)].sort((i,f)=>i-f);return a=Math.max(a,h),l=Math.min(l,c),a<l?[a,l]:null}var Yt=25;function qt(n,e,t){return`hsl(${(220-220*(t>e?Math.min(1,Math.max(0,(n-e)/(t-e))):.5)).toFixed(0)} 75% 48%)`}var ye=class extends L{static{this.properties={hass:{attribute:!1},_config:{state:!0},_data:{state:!0},_error:{state:!0}}}setConfig(e){if(!e.entry_id)throw new Error("entry_id is required");if(e.mode!=="heat_loss"&&e.mode!=="supply_curve")throw new Error('mode must be "heat_loss" or "supply_curve"');this._config=e,this._data=void 0}getCardSize(){return 6}getGridOptions(){return{columns:"full",min_rows:5}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._fetch(!0),Ft)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._timer)}willUpdate(e){(e.has("hass")||e.has("_config"))&&this._fetch(!1)}async _fetch(e){if(!this.hass||!this._config)return;let{entry_id:t,mode:r,days:o}=this._config,s=`${t}:${r}:${o??""}`;if(!(!e&&s===this._fetchedKey)){this._fetchedKey=s;try{this._data=r==="heat_loss"?await this.hass.callWS({type:"weheat_insights/heat_loss",entry_id:t}):await this.hass.callWS({type:"weheat_insights/supply_curve",entry_id:t,days:o??365}),this._error=void 0}catch(a){this._error=a instanceof Error?a.message:JSON.stringify(a)}}}render(){if(!this.hass||!this._config)return y;let e=j(this.hass),t=this._config.mode==="heat_loss";return m`<ha-card>
      <div class="title">${this._config.title??e(t?"heat_loss_title":"supply_curve_title")}</div>
      ${this._error?m`<div class="message">${this._error}</div>`:this._data?t?this._renderHeatLoss(this._data,e):this._renderSupply(this._data,e):m`<div class="message">…</div>`}
    </ha-card>`}_renderHeatLoss(e,t){let r=D(this.hass),o=new Intl.NumberFormat(r,{maximumFractionDigits:1}),s=e.points.map(d=>({x:d.delta_k,y:d.heating_kwh,cls:d.excluded?"excluded":"used",tip:`${d.day}: ${o.format(d.delta_k)}\xA0K, ${o.format(d.heating_kwh)}\xA0kWh${d.excluded?` (${t("excluded")})`:""}`})),a=e.fit,l=a?m`<div class="summary">
          <strong>${Math.round(e.coefficient_w_per_k)} ± ${Math.round(e.confidence_95_w_per_k)} W/K</strong>
          · R² ${a.r_squared.toFixed(2)} · ${e.days_used} ${t("days_used")}
        </div>`:m`<div class="summary muted">${e.reason?t(`reason_${e.reason}`):""}</div>`;return m`${l}
      ${this._chart(s,{xLabel:t("indoor_outdoor_diff"),yLabel:t("heating_per_day"),includeZeroY:!0,line:a?d=>a.slope*d+a.intercept:void 0})}
      <div class="legend">
        <span><i class="dot used"></i>${t("used")}</span>
        <span><i class="dot excluded"></i>${t("excluded")}</span>
        ${a?m`<span><i class="line"></i>${t("fit_line")}</span>`:y}
      </div>
      ${e.indoor_assumed?m`<div class="note">${t("indoor_assumed_note")}</div>`:y}`}_renderSupply(e,t){let r={...e,points:e.points.filter(p=>p.outdoor_c<=Yt)};if(!r.points.length)return m`<div class="message">${t("no_data")}</div>`;let o=D(this.hass),s=new Intl.NumberFormat(o,{maximumFractionDigits:1}),a=r.points.map(p=>p.delta_t_k).sort((p,w)=>p-w),l=a[Math.floor(a.length*.05)],d=a[Math.min(a.length-1,Math.floor(a.length*.95))],h=r.points.map(p=>({x:p.outdoor_c,y:p.supply_c,color:qt(p.delta_t_k,l,d),tip:`${new Date(p.time).toLocaleString(o,{dateStyle:"short",timeStyle:"short"})}: ${s.format(p.outdoor_c)}\xA0\xB0C \u2192 ${s.format(p.supply_c)}\xA0\xB0C, \u0394T ${s.format(p.delta_t_k)}\xA0K`})),c=(p,w="supply_c")=>p.filter(k=>k[w]!=null).map(k=>({x:k.outdoor_c,y:k[w]})).sort((k,H)=>k.x-H.x),i=r.curves,f=[];return i?.advice.length&&f.push({cls:"advice",points:c(i.advice),band:[c(i.advice,"low_c"),c(i.advice,"high_c")]}),i?.current&&i.current.length>1&&f.push({cls:"current",points:c(i.current)}),m`${this._chart(h,{xLabel:t("outdoor_temp"),yLabel:t("supply_temp"),curves:f})}
      <div class="legend">
        <span>ΔT ${s.format(l)} K</span>
        <i class="gradient"></i>
        <span>${s.format(d)} K</span>
        ${f.some(p=>p.cls==="current")?m`<span><i class="line current"></i>${t("current_curve")}</span>`:y}
        ${f.some(p=>p.cls==="advice")?m`<span><i class="line advice"></i>${t("advised_curve")}</span>`:y}
      </div>`}_chart(e,t){if(!e.length)return m`<div class="message">${j(this.hass)("no_data")}</div>`;let r=e.map(_=>_.x),o=e.map(_=>_.y),s=te(Math.min(...r),Math.max(...r)),a=te(t.includeZeroY?Math.min(0,...o):Math.min(...o),Math.max(...o)),[l,d]=[s[0],s[s.length-1]],[h,c]=[a[0],a[a.length-1]],i=Ie-O.left-O.right,f=Ue-O.top-O.bottom,p=_=>O.left+(_-l)/(d-l)*i,w=_=>O.top+f-(_-h)/(c-h)*f,k=_=>Math.min(c,Math.max(h,_)),H=t.line?Kt(t.line,l,d,h,c):null;return m`<svg viewBox="0 0 ${Ie} ${Ue}" role="img" aria-label=${t.yLabel}>
      ${a.map(_=>b`<line class="grid" x1=${O.left} x2=${Ie-O.right} y1=${w(_)} y2=${w(_)}></line>
          <text class="axis" x=${O.left-6} y=${w(_)+4} text-anchor="end">${_}</text>`)}
      ${s.map(_=>b`<line class="grid" x1=${p(_)} x2=${p(_)} y1=${O.top} y2=${O.top+f}></line>
          <text class="axis" x=${p(_)} y=${O.top+f+16} text-anchor="middle">${_}</text>`)}
      <text class="label" x=${O.left+i/2} y=${Ue-4} text-anchor="middle">${t.xLabel}</text>
      <text class="label" transform="translate(12 ${O.top+f/2}) rotate(-90)" text-anchor="middle">${t.yLabel}</text>
      ${e.map(_=>b`<circle class=${_.cls??""} cx=${p(_.x)} cy=${w(_.y)} r="3.5" style=${_.color?`fill:${_.color}`:""}>
          <title>${_.tip}</title>
        </circle>`)}
      ${(t.curves??[]).map(_=>{let E=Array.from({length:41},(P,z)=>l+(d-l)*z/40),T=P=>E.map(z=>`${p(z)},${w(k(Gt(P,z)??h))}`).join(" "),g=_.band?b`<polygon class="band ${_.cls}" points=${`${T(_.band[1])} ${T(_.band[0]).split(" ").reverse().join(" ")}`}></polygon>`:y;return b`${g}<polyline class="curve ${_.cls}" points=${T(_.points)}></polyline>`})}
      ${H?b`<line class="fit" x1=${p(H[0])} y1=${w(t.line(H[0]))} x2=${p(H[1])} y2=${w(t.line(H[1]))}></line>`:y}
    </svg>`}static{this.styles=N`
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
  `}};var Z="weheat-insights-dhw-card",yt=["summary","cop_target","cop_outdoor","start_hours","standing_loss"],ce=600,we=240,$={left:40,right:12,top:18,bottom:34},Be=ce-$.left-$.right,q=we-$.top-$.bottom,Zt=3600*1e3,Jt=90;function wt(n,e){let t=[...n].sort((r,o)=>r-o);return t[Math.min(t.length-1,Math.max(0,Math.round(e*(t.length-1))))]}function vt(n){return n.length?wt(n,.9)-wt(n,.1):0}var ve=8,Xt=3;function Qt(n){if(n.length<ve||vt(n.map(d=>d.x))<Xt)return null;let e=d=>d.reduce((h,c)=>h+c,0)/d.length,t=n.filter(d=>d.z!=null);if(t.length>=ve&&vt(t.map(d=>d.z))>=1){let[d,h,c]=[e(t.map(_=>_.x)),e(t.map(_=>_.z)),e(t.map(_=>_.y))],[i,f,p,w,k]=[0,0,0,0,0];for(let _ of t){let[R,E,T]=[_.x-d,_.z-h,_.y-c];i+=R*R,f+=E*E,p+=R*E,w+=R*T,k+=E*T}let H=i*f-p*p;if(H>1e-9*i*f){let _=(f*w-p*k)/H;return{slope:_,at:R=>c+_*(R-d)}}}let[r,o]=[e(n.map(d=>d.x)),e(n.map(d=>d.y))],[s,a]=[0,0];for(let d of n)s+=(d.x-r)**2,a+=(d.x-r)*(d.y-o);let l=a/s;return{slope:l,at:d=>o+l*(d-r)}}function er(n){return n==null?"var(--disabled-text-color, #9e9e9e)":`hsl(${(220-220*Math.min(1,Math.max(0,(n+5)/25))).toFixed(0)} 70% 50%)`}var $e=class extends L{static{this.properties={hass:{attribute:!1},_config:{state:!0},_data:{state:!0},_error:{state:!0}}}setConfig(e){if(!e.entry_id)throw new Error("entry_id is required");if(!yt.includes(e.mode))throw new Error(`mode must be one of ${yt.join(", ")}`);this._config=e,this._data=void 0}getCardSize(){return this._config?.mode==="summary"?2:5}getGridOptions(){return{columns:"full",min_rows:this._config?.mode==="summary"?2:4}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._fetch(!0),Zt)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._timer)}willUpdate(e){(e.has("hass")||e.has("_config"))&&this._fetch(!1)}async _fetch(e){if(!this.hass||!this._config)return;let t=Math.max(Jt,this._config.days??0),r=`${this._config.entry_id}:${t}`;if(!(!e&&r===this._fetchedKey)){this._fetchedKey=r;try{this._data=await this.hass.callWS({type:"weheat_insights/dhw",entry_id:this._config.entry_id,days:Math.min(t,365)}),this._error=void 0}catch(o){this._error=o instanceof Error?o.message:JSON.stringify(o)}}}render(){if(!this.hass||!this._config)return y;let e=j(this.hass),t=this._config.mode,r=this._config.title??(t==="summary"?null:e(`dhw_${t}_title`));return m`<ha-card>
      ${r?m`<div class="title">${r}</div>`:y}
      ${this._error?m`<div class="message">${this._error}</div>`:this._data?this._renderMode(t,this._data,e):m`<div class="message">…</div>`}
    </ha-card>`}_fmt(e){return new Intl.NumberFormat(D(this.hass),{minimumFractionDigits:e,maximumFractionDigits:e})}_dayLabel(e){return new Date(`${e}T12:00:00`).toLocaleDateString(D(this.hass),{day:"numeric",month:"short"})}_recent(e,t){return e.days.slice(-(this._config.days??t))}_renderMode(e,t,r){switch(e){case"summary":return this._renderSummary(t,r);case"cop_target":return this._renderCopScatter(t,r,"target");case"cop_outdoor":return this._renderCopScatter(t,r,"outdoor");case"start_hours":return this._renderStartHours(t,r);case"standing_loss":return this._renderStandingLoss(t,r)}}_renderSummary(e,t){let r=e.summary,o=this._fmt(0),s=this._fmt(1),a=this._fmt(2),l=(h,c,i)=>h==null?"\u2014":`${c.format(h)}\xA0${i}`,d=[["mdi:thermometer-water",t("dhw_target_today"),l(r.target_today_c,o,"\xB0C")],["mdi:thermometer-check",t("dhw_target_typical"),l(r.target_typical_c,o,"\xB0C")],["mdi:counter",t("dhw_runs_per_day"),l(r.runs_per_day,s,"\xD7")],["mdi:water-boiler",t("dhw_heat_per_run"),l(r.heat_per_run_kwh,s,"kWh")],["mdi:fire",t("dhw_heat_per_day"),l(r.heat_per_day_kwh,s,"kWh")],["mdi:thermometer-minus",t("dhw_standing_loss"),l(r.standing_loss_k_per_h,a,"K/h")]];return m`<div class="stats">
        ${d.map(([h,c,i])=>m`<div class="stat">
            <ha-icon .icon=${h}></ha-icon>
            <div><div class="stat-value">${i}</div><div class="stat-label">${c}</div></div>
          </div>`)}
      </div>
      <div class="note">${t("dhw_summary_note").replace("{days}",String(r.days))}</div>`}_renderStartHours(e,t){let r=e.start_hours.map((o,s)=>({label:s%3===0?String(s):"",value:o,cls:"target",tip:`${String(s).padStart(2,"0")}:00\u2013${String(s).padStart(2,"0")}:59: ${o}\xD7`}));return e.start_hours.some(o=>o>0)?m`${this._bars(r,{min:0,unit:"\xD7",integer:!0})}
      <div class="note">${t("dhw_start_hours_note").replace("{days}",String(e.start_hours_days))}</div>`:m`<div class="message">${t("no_data")}</div>`}_renderStandingLoss(e,t){let r=e.standing_loss_weeks.slice(-12);if(!r.length)return m`<div class="message">${t("dhw_standing_loss_none")}</div>`;let o=this._fmt(2),s=r.map(a=>({label:this._dayLabel(a.week),value:a.k_per_h,cls:"loss",note:o.format(a.k_per_h),tip:`${t("dhw_week_of")} ${a.week}: ${o.format(a.k_per_h)} K/h`}));return m`${this._bars(s,{min:0,unit:"K/h"})}
      <div class="note">${t("dhw_standing_loss_note")}</div>`}_bars(e,t){let r=e.map(i=>i.value??t.min),o=te(t.min,Math.max(t.min+(t.integer?3:1),...r),5);t.integer&&(o=o.filter(i=>Number.isInteger(i)));let[s,a]=[o[0],o[o.length-1]],l=i=>$.top+q-(Math.min(a,Math.max(s,i))-s)/(a-s)*q,d=Be/e.length,h=Math.min(34,d*.7),c=new Intl.NumberFormat(D(this.hass),{maximumFractionDigits:2});return m`<svg viewBox="0 0 ${ce} ${we}" role="img">
      ${o.map(i=>b`<line class="grid" x1=${$.left} x2=${ce-$.right} y1=${l(i)} y2=${l(i)}></line>
          <text class="axis" x=${$.left-6} y=${l(i)+4} text-anchor="end">${c.format(i)}</text>`)}
      <text class="axis" x=${$.left-6} y=${$.top-6} text-anchor="end">${t.unit}</text>
      ${e.map((i,f)=>{let p=$.left+d*(f+.5),w=i.value==null?y:b`<rect class="bar ${i.cls??""}" x=${p-h/2} y=${l(i.value)} width=${h} height=${Math.max(0,l(s)-l(i.value))} rx="2"><title>${i.tip}</title></rect>`,k=i.note&&i.value!=null?b`<text class="note-text" x=${p} y=${l(i.value)-4} text-anchor="middle">${i.note}</text>`:y;return b`${w}${k}
          <text class="axis" x=${p} y=${$.top+q+16} text-anchor="middle">${i.label}</text>`})}
    </svg>`}_renderCopScatter(e,t,r){let o=this._recent(e,90).filter(u=>u.cop!=null&&(r==="target"?u.target_c:u.outdoor_c)!=null);if(o.length<3)return m`<div class="message">${t("no_data")}</div>`;let s=this._fmt(1),a=o.map(u=>({x:r==="target"?u.target_c:u.outdoor_c,z:r==="target"?u.outdoor_c:u.target_c,y:u.cop,d:u})),l=a.filter(u=>!u.d.legionella),d=l.length>=ve,h=d?l:a,c=Qt(h),i=Math.min(...h.map(u=>u.x)),f=Math.max(...h.map(u=>u.x)),p=te(Math.min(...a.map(u=>u.x)),Math.max(...a.map(u=>u.x)),6),w=te(Math.min(...a.map(u=>u.y))-.3,Math.max(...a.map(u=>u.y))+.2,5),[k,H]=[p[0],p[p.length-1]],[_,R]=[w[0],w[w.length-1]],E=u=>$.left+(u-k)/(H-k)*Be,T=u=>$.top+q-(u-_)/(R-_)*q,g=o.map(u=>u.target_c).filter(u=>u!=null),[P,z]=[Math.min(...g),Math.max(...g)],Ae=u=>u==null?"var(--disabled-text-color, #9e9e9e)":`hsl(${(220-220*(z>P?(u-P)/(z-P):.5)).toFixed(0)} 70% 50%)`,pe=u=>r==="target"?er(u.outdoor_c):Ae(u.target_c),St="\xB0C",qe=this._fmt(2),Ze=c?t(r==="target"?"dhw_fit_target":"dhw_fit_outdoor").replace("{value}",new Intl.NumberFormat(D(this.hass),{maximumFractionDigits:2,signDisplay:"always"}).format(c.slope)):h.length>=ve?t(r==="target"?"dhw_fit_narrow_target":"dhw_fit_narrow_outdoor"):null,Je=a.filter(u=>u.d.legionella),Xe=u=>u.reduce((Et,Pt)=>Et+Pt.y,0)/u.length,Qe=r==="target"&&d&&Je.length?t("dhw_legionella_cop").replace("{legionella}",qe.format(Xe(Je))).replace("{other}",qe.format(Xe(l))):null;return m`${Ze?m`<div class="summary">${Ze}</div>`:y}
      ${Qe?m`<div class="summary">${Qe}</div>`:y}
      <svg viewBox="0 0 ${ce} ${we+10}" role="img">
        ${w.map(u=>b`<line class="grid" x1=${$.left} x2=${ce-$.right} y1=${T(u)} y2=${T(u)}></line>
            <text class="axis" x=${$.left-6} y=${T(u)+4} text-anchor="end">${u}</text>`)}
        ${p.map(u=>b`<line class="grid" x1=${E(u)} x2=${E(u)} y1=${$.top} y2=${$.top+q}></line>
            <text class="axis" x=${E(u)} y=${$.top+q+16} text-anchor="middle">${u}</text>`)}
        <text class="axis" x=${$.left-6} y=${$.top-6} text-anchor="end">COP</text>
        <text class="label" x=${$.left+Be/2} y=${we+6} text-anchor="middle"
          >${r==="target"?`${t("dhw_tank_temperature")} (\xB0C)`:t("outdoor_temp")}</text
        >
        ${a.map(u=>b`<circle class=${u.d.legionella?"hollow":""} cx=${E(u.x)} cy=${T(u.y)} r="4.5"
            style=${u.d.legionella?`stroke:${pe(u.d)}`:`fill:${pe(u.d)}`}>
            <title>${u.d.day}: COP ${s.format(u.y)}, ${s.format(u.x)} ${St}${u.d.legionella?` (${t("legionella")})`:""}</title>
          </circle>`)}
        ${c?b`<line class="fit" x1=${E(i)} y1=${T(c.at(i))} x2=${E(f)} y2=${T(c.at(f))}></line>`:y}
      </svg>
      <div class="legend">
        <span>${t(r==="target"?"dhw_color_outdoor":"dhw_color_target")}</span>
        <i class="gradient"></i>
        ${a.some(u=>u.d.legionella)?m`<span><i class="ring"></i>${t("legionella")}</span>`:y}
      </div>`}static{this.styles=N`
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
  `}};var J="weheat-insights-performance-card",Fe=600,Ge=220,M={left:30,right:8,top:10,bottom:26},tr=900*1e3,W=(n,e=2)=>n==null?"\u2013":n.toFixed(e);function $t(n,e,t){let r=new Date(`${n.start}T12:00:00`);if(e==="day")return String(r.getDate());if(e==="month")return r.toLocaleDateString(t,{month:"short"});let o=new Date(`${n.end}T12:00:00`),s=o.getMonth()===0?o.getFullYear()-1:o.getFullYear();return s===r.getFullYear()?String(r.getFullYear()):`${r.getFullYear()}/${String(s).slice(2)}`}function rr(n,e,t){let r=new Date(`${n.start}T12:00:00`);return e==="day"?r.toLocaleDateString(t,{weekday:"short",day:"numeric",month:"long"}):e==="month"?r.toLocaleDateString(t,{month:"long",year:"numeric"}):$t(n,e,t)}var be=class extends L{constructor(){super(...arguments);this._kind="month"}static{this.properties={hass:{attribute:!1},_config:{state:!0},_kind:{state:!0},_data:{state:!0},_error:{state:!0}}}setConfig(t){if(!t.entry_id)throw new Error("entry_id is required");this._config=t,this._kind=t.period??"month"}getCardSize(){return 5}getGridOptions(){return{columns:"full",min_rows:4}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._fetch(!0),tr)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._timer)}willUpdate(t){(t.has("hass")||t.has("_kind")||t.has("_config"))&&this._fetch(!1)}async _fetch(t){if(!this.hass||!this._config)return;let r=`${this._config.entry_id}:${this._kind}`;if(!(!t&&r===this._fetchedKey)){this._fetchedKey=r;try{this._data=await this.hass.callWS({type:"weheat_insights/performance_history",entry_id:this._config.entry_id,period:this._kind}),this._error=void 0}catch(o){this._error=o instanceof Error?o.message:JSON.stringify(o)}}}render(){if(!this.hass||!this._config)return y;let t=j(this.hass);return m`
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
    `}_renderBody(t){if(this._error)return m`<div class="message">${this._error}</div>`;let r=this._data;return!r||r.period!==this._kind?m`<div class="message">…</div>`:r.periods.some(o=>o.cop!=null)?m`${this._renderChart(r,t)}${this._renderLegend(r,t)}`:m`<div class="message">${t("no_data")}</div>`}_renderChart(t,r){let o=D(this.hass),s=t.periods.findIndex(g=>g.cop!=null||g.cop_heat_pump!=null),a=t.periods.slice(Math.max(0,s)),l=a.flatMap(g=>[g.cop_heat_pump,g.cop,g.cop_heating,t.has_dhw?g.cop_dhw:null]),d=Math.max(5,Math.ceil(Math.max(...l.map(g=>g??0))+.5)),h=Fe-M.left-M.right,c=Ge-M.top-M.bottom,i=g=>M.top+c-Math.max(0,g)/d*c,f=h/a.length,p=t.has_dhw?2:1,w=Math.max(2,Math.min(28,f*.75/p)),k=d>8?2:1,H=Math.ceil(a.length/12),_=[];for(let g=0;g<=d;g+=k)_.push(b`<line class="grid" x1=${M.left} x2=${Fe-M.right} y1=${i(g)} y2=${i(g)}></line>
        <text class="axis" x=${M.left-6} y=${i(g)+4} text-anchor="end">${g}</text>`);let R=(g,P,z)=>g==null?y:b`<rect class=${z} x=${P} y=${i(g)} width=${w} height=${i(0)-i(g)} rx="2"></rect>`,E=(g,P,z)=>g==null?y:b`<line class=${z} x1=${P-2} x2=${P+w*p+2} y1=${i(g)} y2=${i(g)}></line>`,T=a.map((g,P)=>{let z=M.left+P*f+(f-w*p)/2,Ae=M.left+P*f+f/2,pe=[rr(g,t.period,o),`${r("heat_pump")}: ${W(g.cop_heat_pump)} (${W(g.heat_kwh,1)}\xA0kWh ${r("heat")} / ${W(g.heat_pump_electricity_kwh,1)}\xA0kWh ${r("electricity")})`,`${r("total")}: ${W(g.cop)} (+ ${W(g.standby_kwh,1)}\xA0kWh ${r("standby").toLowerCase()}, + ${W(g.indoor_unit_kwh,1)}\xA0kWh ${r("pumps")})`,`${r("heating")}: ${W(g.cop_heating)} (${W(g.heating_heat_kwh,1)} / ${W(g.heating_electricity_kwh,1)}\xA0kWh)`,...t.has_dhw?[`${r("dhw")}: ${W(g.cop_dhw)} (${W(g.dhw_heat_kwh,1)} / ${W(g.dhw_electricity_kwh,1)}\xA0kWh)`]:[]].join(`
`);return b`<g>
        <title>${pe}</title>
        <rect class="hit" x=${M.left+P*f} y=${M.top} width=${f} height=${c}></rect>
        ${R(g.cop_heating,z,"heating")}
        ${t.has_dhw?R(g.cop_dhw,z+w,"dhw"):y}
        ${E(g.cop_heat_pump,z,"heat-pump")}
        ${E(g.cop,z,"total")}
        ${P%H===0?b`<text class="axis" x=${Ae} y=${Ge-8} text-anchor="middle">${$t(g,t.period,o)}</text>`:y}
      </g>`});return m`<svg viewBox="0 0 ${Fe} ${Ge}" role="img" aria-label=${r("cop_history")}>
      ${_}${T}
    </svg>`}_renderLegend(t,r){return m`<div class="legend">
      <span><i class="swatch heating"></i>${r("heating")}</span>
      ${t.has_dhw?m`<span><i class="swatch dhw"></i>${r("dhw")}</span>`:y}
      <span><i class="swatch heat-pump"></i>${r("heat_pump")}</span>
      <span><i class="swatch total"></i>${r("total")}</span>
    </div>`}static{this.styles=N`
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
  `}};var X="weheat-insights-operating-card",Ke=["heating","dhw","defrost","legionella","standby"],xe={heating:{icon:"mdi:radiator",color:"var(--orange-color, #ff9800)"},dhw:{icon:"mdi:water-boiler",color:"var(--blue-color, #2196f3)"},defrost:{icon:"mdi:snowflake-melt",color:"var(--cyan-color, #00bcd4)"},legionella:{icon:"mdi:bacteria-outline",color:"var(--purple-color, #9c27b0)"},standby:{icon:"mdi:power-sleep",color:"var(--grey-color, #9e9e9e)"}},ke=class extends L{static{this.properties={hass:{attribute:!1},_config:{state:!0}}}setConfig(e){if(!e.entities||!Object.keys(e.entities).length)throw new Error("entities is required (operating_<state> sensors per state)");this._config=e}getCardSize(){return 6}getGridOptions(){return{columns:"full",min_rows:5}}_states(){return Ke.filter(e=>this._config?.entities[e]&&this._attrs(e))}_attrs(e){let t=this._config?.entities[e];return t?this.hass?.states?.[t]?.attributes:void 0}_num(e,t){let r=this._attrs(e)?.[t];return typeof r=="number"?r:null}render(){if(!this.hass||!this._config)return y;let e=j(this.hass),t=D(this.hass),r=this._states();if(!r.length)return m`<ha-card><div class="message">${e("no_data")}</div></ha-card>`;let o=r.map(c=>({s:c,value:this._num(c,"30d_hours")??0})),s=o.reduce((c,i)=>c+i.value,0)||1,a=o.map(({s:c,value:i})=>({s:c,value:i/s*100})),l=new Intl.NumberFormat(t,{maximumFractionDigits:0}),d=new Intl.NumberFormat(t,{maximumFractionDigits:0}),h=c=>e(c==="standby"?"standby":c);return m`<ha-card>
      ${this._config.title?m`<div class="title">${this._config.title}</div>`:y}
      <div class="subtitle">${e("op_share_30d")}</div>
      <div class="bar" role="img" aria-label=${e("op_share_30d")}>
        ${a.map(({s:c,value:i})=>m`<span
              style="width:${i}%;background:${xe[c].color}"
              title="${h(c)}: ${l.format(i)} %"
            ></span>`)}
      </div>
      <div class="legend">
        ${a.map(({s:c,value:i})=>m`<span><i style="background:${xe[c].color}"></i>${h(c)} ${l.format(i)}&nbsp;%</span>`)}
      </div>

      <div class="rows">
        <div class="row header">
          <span></span>
          <span></span>
          <span class="count">${e("op_today")}</span>
          <span class="count">${e("op_7d")}</span>
          <span class="count">${e("op_30d")}</span>
        </div>
        ${r.map(c=>this._row(c,h(c),e,d))}
      </div>
    </ha-card>`}_row(e,t,r,o){let s=this._num(e,"30d_avg_minutes"),a=this._num(e,"30d_min_minutes"),l=this._num(e,"30d_max_minutes"),d=a==null||l==null||Math.round(a)===Math.round(l)?"":` \xB7 ${o.format(a)}\u2013${o.format(l)} min`,h=s==null?r("op_no_periods"):`${r("op_avg_short")} ${o.format(s)} min${d}`;return m`<div class="row">
      <ha-icon .icon=${xe[e].icon} style="color:${xe[e].color}"></ha-icon>
      <span class="name">
        <span>${t}</span>
        <span class="detail">${h}</span>
      </span>
      ${["today_count","7d_count","30d_count"].map(c=>{let i=this._num(e,c);return m`<span class="count big">${i==null?"\u2013":m`${i}<span class="times">×</span>`}</span>`})}
    </div>`}static{this.styles=N`
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
  `}};var A=n=>n.filter(e=>!!e);function S(n,e){return{type:"heading",heading:n,heading_style:"title",...e?{icon:e}:{}}}function v(n,e){return n?{type:"tile",entity:n,name:e}:null}function nr(n){if(!n)return null;let e=n.entity;return{type:"conditional",conditions:[{condition:"state",entity:e,state_not:"unavailable"},{condition:"state",entity:e,state_not:"unknown"}],card:n}}function x(n,e){return n?{entity:n,name:e}:null}function re(n,e,t){return e.length?{type:"history-graph",title:n,hours_to_show:t,entities:e,grid_options:{columns:"full"}}:null}function bt(n,e,t){return e.length?{type:"statistics-graph",title:n,entities:e,days_to_show:t,period:"hour",stat_types:["mean"],chart_type:"line",grid_options:{columns:"full"}}:null}function C(n,e,t=!1){let r=A(n);return r.length<=(t?0:1)?null:{type:"grid",cards:r,...e?{column_span:e}:{}}}function ue(n,e){return C([S(n("title"),"mdi:information-outline"),{type:"markdown",content:`${n(e)}

_${n("disclaimer")}_`,grid_options:{columns:"full"}}],2)}function U(n,e,t,r,o="full"){return e.length?{type:"statistics-graph",title:n,entities:e,period:t,days_to_show:r,stat_types:["change"],chart_type:"bar",grid_options:{columns:o}}:null}var or=["heating","dhw","legionella_prevention"];function ar(n,e,t){if(!n)return null;let r={type:"gauge",entity:n,name:t("cop"),min:0,max:7,needle:!0,severity:{red:0,yellow:3,green:4}};return e?{type:"conditional",conditions:[{condition:"state",entity:e,state:or}],card:r}:r}function sr(n){return n.indoor_entity_id??n.weheat.thermostat_room_temperature}function ir(n,e,t){let r=n.weheat,o=sr(n),s=n.outdoor_entity_id??r.outside_temperature,a=A([x(r.water_outlet_temperature,e("supply")),x(r.water_inlet_temperature,e("return")),x(r.thermostat_water_setpoint,e("supply_setpoint"))]),l=A([x(s,e("outdoor")),x(o,e("room"))]),d=A([x(r.power_input,e("power_input")),x(r.power_output,e("power_output"))]),h=A([x(n.insights.delta_t,e("delta_t"))]),c=C([S(e("live"),"mdi:heat-pump"),v(r.heat_pump_state,e("state")),ar(r.cop,r.heat_pump_state,e),v(o,e("room")),nr(v(r.thermostat_room_temperature_setpoint,e("room_setpoint"))),v(s,e("outdoor")),v(r.water_outlet_temperature,e("supply")),v(r.thermostat_water_setpoint,e("supply_setpoint")),v(r.water_inlet_temperature,e("return")),v(n.insights.delta_t,e("delta_t_short")),v(r.power_input,e("power_input_short")),v(r.power_output,e("power_output_short"))]),i=C([S(e("last_24h"),"mdi:clock-outline"),re(e("water_temperatures"),a,24),re(e("air_temperatures"),l,24),re(e("power"),d,24),re(e("delta_t"),h,24)]),f=C([S(e("last_7d"),"mdi:calendar-week"),bt(e("water_temperatures"),a,7),bt(e("air_temperatures"),l,7)]);return{title:n.name,path:t===0?"heat-pump":`heat-pump-${t+1}`,icon:"mdi:heat-pump-outline",type:"sections",max_columns:3,sections:A([c,i,f])}}function dr(n,e,t){let r=n.weheat,o=n.insights,s=C([S(e("scop_heading"),"mdi:chart-bar"),v(o.scop_heat_pump_season,e("heat_pump")),v(o.scop_season,e("total")),v(o.scop_heating_season,e("heating")),v(o.scop_dhw_season,e("dhw")),v(o.defrost_cop_impact_season,e("defrost_loss")),S(e("cop_month"),"mdi:calendar-month"),v(o.cop_heat_pump_month,e("heat_pump")),v(o.cop_month,e("total")),S(e("cop_today"),"mdi:calendar-today"),v(o.cop_heat_pump_today,e("heat_pump")),v(o.cop_today,e("total"))]),a=C([{type:`custom:${J}`,entry_id:n.entry_id}],2,!0),l=C([S(e("energy_per_day"),"mdi:lightning-bolt"),U(`${e("energy_per_day")} \xB7 ${e("electricity")}`,A([x(r.electricity_used_heating,e("heating")),x(r.electricity_used_dhw,e("dhw")),x(r.electricity_used_defrost,e("defrost")),x(r.electricity_used_standby,e("standby"))]),"day",30),U(`${e("energy_per_day")} \xB7 ${e("heat")}`,A([x(r.energy_output_heating,e("heating")),x(r.energy_output_dhw,e("dhw")),x(r.energy_output_defrost,e("defrost"))]),"day",30)],2),d=ue(e,"definitions");return{title:`${n.name} \xB7 ${e("performance")}`,path:t===0?"performance":`performance-${t+1}`,icon:"mdi:chart-bar",type:"sections",max_columns:4,sections:A([s,a,l,d])}}function lr(n,e,t){let r=n.insights,o=C([S(e("house"),"mdi:home-thermometer"),v(r.heat_loss_coefficient,e("heat_loss_short")),v(r.heat_loss_design_load,e("heat_loss_design")),v(r.balance_point,e("balance_point")),v(r.cool_down_time_constant,e("cool_down_tau")),v(r.cool_down_rate,e("cool_down_rate")),v(r.thermal_mass,e("thermal_mass"))]),s=C([{type:`custom:${B}`,entry_id:n.entry_id,mode:"heat_loss"}],2,!0),a=ue(e,"house_definitions"),l=n.degree_days_statistic_id?{entity:n.degree_days_statistic_id,name:e("degree_days")}:null,d=C([S(e("heat_per_degree_day"),"mdi:home-thermometer-outline"),v(r.heat_per_degree_day_season,e("this_season")),v(r.heat_per_degree_day_last_year,e("last_year_to_date")),v(r.heat_per_degree_day_last_season,e("whole_last_season")),S(e("degree_days"),"mdi:thermometer-lines"),v(r.degree_days_month,e("this_month")),v(r.degree_days_season,e("this_season"))]),h=C([l?U(e("degree_days_per_month"),[l],"month",400,12):null,l?U(e("degree_days_per_day"),[l],"day",30,12):null],2,!0);return{title:`${n.name} \xB7 ${e("house")}`,path:t===0?"house":`house-${t+1}`,icon:"mdi:home-thermometer-outline",type:"sections",max_columns:4,sections:A([o,s,d,h,a])}}var cr=[[-20,"curve_advice_minus_20"],[9,"curve_advice_9"],[15,"curve_advice_15"],[20,"curve_advice_20"],[25,"curve_advice_25"]],he=n=>n.replace(/\\/g,"\\\\").replace(/'/g,"\\'"),Ce=n=>n.replace(/ /g,"\xA0").replace(/-/g,"\u2011");function hr(n,e,t=1){return`{{ (('%.${t}f' | format(${n})) | replace('.', '${e}')) if (${n}) is not none else '\u2013' }}`}function ur(n,e){let t=cr.filter(([,h])=>n.insights[h]);if(!t.length)return null;let r=n.insights[t[0][1]],o=e("decimal_separator"),s=h=>hr(h,o),a=h=>`state_attr('${h}', 'extrapolated') and not state_attr('${h}', 'no_heat_needed')`,l=JSON.stringify(t.map(([,h])=>n.insights[h]));return[`{% set reason = state_attr('${r}', 'no_advice_reason') %}`,`{% set cur = ${l} | map('state_attr', 'current') | reject('none') | list | count > 0 %}`,`**${e("curve_target")}:** ${s(`state_attr('${r}', 'target_room_temperature')`)}\xA0\xB0C \xB7 ${e("curve_measured")}: ${s(`state_attr('${r}', 'measured_indoor_temperature')`)}\xA0\xB0C`,"",`**${e("curve_emitters")}:** {{ {'radiators': '${he(e("emitter_radiators"))}', 'underfloor': '${he(e("emitter_underfloor"))}', 'mixed': '${he(e("emitter_mixed"))}'}.get(state_attr('${r}', 'emitter_type'), '\u2013') }}`,"",`{% if reason %}${e("curve_no_advice")} {{ {'no_heat_loss': '${he(e("reason_no_heat_loss"))}', 'too_few_steady_hours': '${he(e("reason_too_few_steady_hours"))}'}.get(reason, reason) }}{% endif %}`,"",`| ${Ce(`${e("curve_outdoor")} (\xB0C)`)} | {% if cur %}${Ce(`${e("curve_current")} (\xB0C)`)} | {% endif %}${Ce(`${e("curve_advice")} (\xB0C)`)} | ${Ce(`${e("curve_range")} (\xB0C)`)} |`,"|---:|{% if cur %}---:|{% endif %}---:|:---|",...t.map(([h,c])=>{let i=n.insights[c],f=`states('${i}') | float(none)`;return`| ${h} | {% if cur %}${s(`state_attr('${i}', 'current')`)} | {% endif %}{% if (${f}) is not none %}**${s(f)}**{% if ${a(i)} %}\\*{% endif %}{% else %}\u2013{% endif %} | {% if state_attr('${i}', 'no_heat_needed') %}${e("curve_no_heat")}{% elif state_attr('${i}', 'range_low') is not none %}${s(`state_attr('${i}', 'range_low')`)}\u2013${s(`state_attr('${i}', 'range_high')`)}{% endif %} |`}),"",`{% if ${l} | select('is_state_attr', 'extrapolated', true) | reject('is_state_attr', 'no_heat_needed', true) | list | count > 0 %}\\* ${e("curve_extrapolated_note")}{% endif %}`,"",`{% if not cur %}_${e("curve_enter_current")}_{% endif %}`].join(`
`)}function pr(n,e,t){let r=n.insights,o=ur(n,e),s=C([S(e("curve_advice"),"mdi:chart-bell-curve-cumulative"),o?{type:"markdown",content:o,grid_options:{columns:"full"}}:null],2),a=C([{type:`custom:${B}`,entry_id:n.entry_id,mode:"supply_curve",days:365}],2,!0),l=C([S(e("before_after"),"mdi:swap-vertical"),v(r.heating_electricity_per_degree_day_before,e("per_degree_day_before")),v(r.heating_electricity_per_degree_day_after,e("per_degree_day_after")),v(r.heating_curve_change_effect,e("change_effect"))]),d=ue(e,"curve_definitions");return{title:`${n.name} \xB7 ${e("heating_curve")}`,path:t===0?"heating-curve":`heating-curve-${t+1}`,icon:"mdi:chart-bell-curve-cumulative",type:"sections",max_columns:4,sections:A([s,a,l,d])}}function _r(n,e,t){let r=n.insights,o=n.weheat,s=p=>e(p==="standby"?"standby":p),a=(p,w)=>A(w.map(k=>x(r[`${k}${p}`],s(k)))),l=Object.fromEntries(Ke.filter(p=>r[`operating_${p}`]).map(p=>[p,r[`operating_${p}`]])),d=C([S(e("operation"),"mdi:state-machine"),re(e("op_timeline"),A([x(o.heat_pump_state,e("state"))]),24),Object.keys(l).length?{type:`custom:${X}`,entities:l,grid_options:{columns:"full"}}:null],2),h=C([U(e("op_periods_per_day"),a("_periods_total",["heating","dhw","defrost","legionella"]),"day",30),U(e("op_hours_per_day"),a("_time_total",["heating","dhw","defrost","legionella"]),"day",30)],2,!0),c=n.degree_days_statistic_id?{entity:n.degree_days_statistic_id,name:e("degree_days")}:null,i=C([S(e("op_defrost_vs_cold"),"mdi:snowflake-melt"),U(e("defrost"),a("_periods_total",["defrost"]),"day",30,12),c?U(e("degree_days_per_day"),[c],"day",30,12):null],2),f=ue(e,"op_definitions");return{title:`${n.name} \xB7 ${e("operation")}`,path:t===0?"operation":`operation-${t+1}`,icon:"mdi:state-machine",type:"sections",max_columns:4,sections:A([d,h,i,f])}}function mr(n,e,t){let r=n.weheat;if(!n.has_dhw)return null;let o=(c,i={})=>({type:`custom:${Z}`,entry_id:n.entry_id,mode:c,...i}),s=C([S(e("hot_water_tab"),"mdi:water-boiler"),o("summary"),re(e("dhw_tank_48h"),A([x(r.dhw_top_temperature,e("dhw_top")),x(r.dhw_bottom_temperature,e("dhw_bottom"))]),48)],2),a=A([x(r.dhw_bottom_temperature,e("dhw_bottom"))]),l=C([S(e("dhw_per_day"),"mdi:calendar-today"),a.length?{type:"statistics-graph",title:e("dhw_target_title"),entities:a,period:"day",days_to_show:14,stat_types:["max"],chart_type:"bar",fit_y_data:!0,grid_options:{columns:"full"}}:null,U(e("dhw_energy_title"),A([x(r.energy_output_dhw,e("dhw_heat")),x(r.electricity_used_dhw,e("dhw_electricity"))]),"day",14)],2),d=C([S(e("dhw_efficiency"),"mdi:gauge"),o("cop_target",{days:90}),o("cop_outdoor",{days:90})],2),h=C([S(e("dhw_habits"),"mdi:clock-outline"),o("start_hours"),o("standing_loss")],2);return{title:`${n.name} \xB7 ${e("hot_water_tab")}`,path:t===0?"hot-water":`hot-water-${t+1}`,icon:"mdi:water-boiler",type:"sections",max_columns:4,sections:A([s,l,d,h,ue(e,"dhw_definitions")])}}function xt(n,e,t){return{title:n("title"),path:"weheat-insights",type:"panel",cards:[{type:"markdown",content:`## ${e}

${t}

_${n("disclaimer")}_`}]}}function kt(n,e){return n.length?{title:e("title"),views:n.flatMap((t,r)=>A([dr(t,e,r),lr(t,e,r),pr(t,e,r),_r(t,e,r),mr(t,e,r),ir(t,e,r)]))}:{title:e("title"),views:[xt(e,e("no_pumps_title"),e("no_pumps_body"))]}}function Ct(n,e){return{title:n("title"),views:[xt(n,n("error_title"),`${n("error_body")}

\`${e}\``)]}}var At="ll-strategy-dashboard-weheat-insights",Ye=class extends HTMLElement{static async generate(e,t){let r=j(t);try{let o=await t.callWS({type:"weheat_insights/dashboard_config"});return kt(o.heat_pumps,r)}catch(o){let s=o instanceof Error?o.message:JSON.stringify(o);return Ct(r,s)}}};customElements.get(At)||customElements.define(At,Ye);customElements.get(J)||customElements.define(J,be);customElements.get(X)||customElements.define(X,ke);customElements.get(B)||customElements.define(B,ye);customElements.get(Z)||customElements.define(Z,$e);window.customCards=window.customCards??[];window.customCards.some(n=>n.type===J)||window.customCards.push({type:J,name:"Weheat Insights performance",description:"COP per day, month or season for heating and hot water (unofficial)"});window.customCards.some(n=>n.type===B)||window.customCards.push({type:B,name:"Weheat Insights scatter",description:"Heat loss of the house or supply vs outdoor temperature (unofficial)"});window.customCards.some(n=>n.type===X)||window.customCards.push({type:X,name:"Weheat Insights operation",description:"Time per operating state and number and length of periods (unofficial)"});window.customCards.some(n=>n.type===Z)||window.customCards.push({type:Z,name:"Weheat Insights hot water",description:"Hot-water tank temperature, COP, run times and standing loss (unofficial)"});window.customStrategies=window.customStrategies??[];window.customStrategies.some(n=>n.type==="weheat-insights")||window.customStrategies.push({type:"weheat-insights",strategyType:"dashboard",name:"Weheat Insights",description:"Live overview and history for Weheat heat pumps (unofficial)"});
