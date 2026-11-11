var Q=globalThis,X=Q.ShadowRoot&&(Q.ShadyCSS===void 0||Q.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ie=Symbol(),Pe=new WeakMap,I=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==ie)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(X&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=Pe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Pe.set(t,e))}return e}toString(){return this.cssText}},He=r=>new I(typeof r=="string"?r:r+"",void 0,ie),K=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,o,n)=>s+(i=>{if(i._$cssResult$===!0)return i.cssText;if(typeof i=="number")return i;throw Error("Value passed to 'css' function must be a 'css' function result: "+i+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+r[n+1],r[0]);return new I(t,r,ie)},Le=(r,e)=>{if(X)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),o=Q.litNonce;o!==void 0&&s.setAttribute("nonce",o),s.textContent=t.cssText,r.appendChild(s)}},ae=X?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return He(t)})(r):r;var{is:st,defineProperty:rt,getOwnPropertyDescriptor:ot,getOwnPropertyNames:nt,getOwnPropertySymbols:it,getPrototypeOf:at}=Object,ee=globalThis,Te=ee.trustedTypes,lt=Te?Te.emptyScript:"",dt=ee.reactiveElementPolyfillSupport,V=(r,e)=>r,le={toAttribute(r,e){switch(e){case Boolean:r=r?lt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},Me=(r,e)=>!st(r,e),Re={attribute:!0,type:String,converter:le,reflect:!1,useDefault:!1,hasChanged:Me};Symbol.metadata??=Symbol("metadata"),ee.litPropertyMetadata??=new WeakMap;var E=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Re){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),o=this.getPropertyDescriptor(e,s,t);o!==void 0&&rt(this.prototype,e,o)}}static getPropertyDescriptor(e,t,s){let{get:o,set:n}=ot(this.prototype,e)??{get(){return this[t]},set(i){this[t]=i}};return{get:o,set(i){let l=o?.call(this);n?.call(this,i),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Re}static _$Ei(){if(this.hasOwnProperty(V("elementProperties")))return;let e=at(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(V("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(V("properties"))){let t=this.properties,s=[...nt(t),...it(t)];for(let o of s)this.createProperty(o,t[o])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,o]of t)this.elementProperties.set(s,o)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let o=this._$Eu(t,s);o!==void 0&&this._$Eh.set(o,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let o of s)t.unshift(ae(o))}else e!==void 0&&t.push(ae(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Le(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,s);if(o!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:le).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(e,t){let s=this.constructor,o=s._$Eh.get(e);if(o!==void 0&&this._$Em!==o){let n=s.getPropertyOptions(o),i=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:le;this._$Em=o;let l=i.fromAttribute(t,n.type);this[o]=l??this._$Ej?.get(o)??l,this._$Em=null}}requestUpdate(e,t,s,o=!1,n){if(e!==void 0){let i=this.constructor;if(o===!1&&(n=this[e]),s??=i.getPropertyOptions(e),!((s.hasChanged??Me)(n,t)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(i._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:o,wrapped:n},i){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,i??t??this[e]),n!==!0||i!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),o===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[o,n]of s){let{wrapped:i}=n,l=this[o];i!==!0||this._$AL.has(o)||l===void 0||this.C(o,void 0,n,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[V("elementProperties")]=new Map,E[V("finalized")]=new Map,dt?.({ReactiveElement:E}),(ee.reactiveElementVersions??=[]).push("2.1.2");var me=globalThis,Oe=r=>r,te=me.trustedTypes,ze=te?te.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ie="$lit$",L=`lit$${Math.random().toFixed(9).slice(2)}$`,Ke="?"+L,ht=`<${Ke}>`,O=document,G=()=>O.createComment(""),F=r=>r===null||typeof r!="object"&&typeof r!="function",ge=Array.isArray,ct=r=>ge(r)||typeof r?.[Symbol.iterator]=="function",de=`[ 	
\f\r]`,B=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,De=/-->/g,Ne=/>/g,R=RegExp(`>|${de}(?:([^\\s"'>=/]+)(${de}*=${de}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),We=/'/g,Ue=/"/g,Ve=/^(?:script|style|textarea|title)$/i,fe=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),g=fe(1),C=fe(2),Ht=fe(3),z=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),je=new WeakMap,M=O.createTreeWalker(O,129);function Be(r,e){if(!ge(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ze!==void 0?ze.createHTML(e):e}var pt=(r,e)=>{let t=r.length-1,s=[],o,n=e===2?"<svg>":e===3?"<math>":"",i=B;for(let l=0;l<t;l++){let a=r[l],h,u,c=-1,m=0;for(;m<a.length&&(i.lastIndex=m,u=i.exec(a),u!==null);)m=i.lastIndex,i===B?u[1]==="!--"?i=De:u[1]!==void 0?i=Ne:u[2]!==void 0?(Ve.test(u[2])&&(o=RegExp("</"+u[2],"g")),i=R):u[3]!==void 0&&(i=R):i===R?u[0]===">"?(i=o??B,c=-1):u[1]===void 0?c=-2:(c=i.lastIndex-u[2].length,h=u[1],i=u[3]===void 0?R:u[3]==='"'?Ue:We):i===Ue||i===We?i=R:i===De||i===Ne?i=B:(i=R,o=void 0);let y=i===R&&r[l+1].startsWith("/>")?" ":"";n+=i===B?a+ht:c>=0?(s.push(h),a.slice(0,c)+Ie+a.slice(c)+L+y):a+L+(c===-2?l:y)}return[Be(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},q=class r{constructor({strings:e,_$litType$:t},s){let o;this.parts=[];let n=0,i=0,l=e.length-1,a=this.parts,[h,u]=pt(e,t);if(this.el=r.createElement(h,s),M.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(o=M.nextNode())!==null&&a.length<l;){if(o.nodeType===1){if(o.hasAttributes())for(let c of o.getAttributeNames())if(c.endsWith(Ie)){let m=u[i++],y=o.getAttribute(c).split(L),$=/([.?@])?(.*)/.exec(m);a.push({type:1,index:n,name:$[2],strings:y,ctor:$[1]==="."?ce:$[1]==="?"?pe:$[1]==="@"?ue:U}),o.removeAttribute(c)}else c.startsWith(L)&&(a.push({type:6,index:n}),o.removeAttribute(c));if(Ve.test(o.tagName)){let c=o.textContent.split(L),m=c.length-1;if(m>0){o.textContent=te?te.emptyScript:"";for(let y=0;y<m;y++)o.append(c[y],G()),M.nextNode(),a.push({type:2,index:++n});o.append(c[m],G())}}}else if(o.nodeType===8)if(o.data===Ke)a.push({type:2,index:n});else{let c=-1;for(;(c=o.data.indexOf(L,c+1))!==-1;)a.push({type:7,index:n}),c+=L.length-1}n++}}static createElement(e,t){let s=O.createElement("template");return s.innerHTML=e,s}};function W(r,e,t=r,s){if(e===z)return e;let o=s!==void 0?t._$Co?.[s]:t._$Cl,n=F(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),n===void 0?o=void 0:(o=new n(r),o._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=o:t._$Cl=o),o!==void 0&&(e=W(r,o._$AS(r,e.values),o,s)),e}var he=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,o=(e?.creationScope??O).importNode(t,!0);M.currentNode=o;let n=M.nextNode(),i=0,l=0,a=s[0];for(;a!==void 0;){if(i===a.index){let h;a.type===2?h=new Y(n,n.nextSibling,this,e):a.type===1?h=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(h=new _e(n,this,e)),this._$AV.push(h),a=s[++l]}i!==a?.index&&(n=M.nextNode(),i++)}return M.currentNode=O,o}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},Y=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,o){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=W(this,e,t),F(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==z&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ct(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&F(this._$AH)?this._$AA.nextSibling.data=e:this.T(O.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,o=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=q.createElement(Be(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===o)this._$AH.p(t);else{let n=new he(o,this),i=n.u(this.options);n.p(t),this.T(i),this._$AH=n}}_$AC(e){let t=je.get(e.strings);return t===void 0&&je.set(e.strings,t=new q(e)),t}k(e){ge(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,o=0;for(let n of e)o===t.length?t.push(s=new r(this.O(G()),this.O(G()),this,this.options)):s=t[o],s._$AI(n),o++;o<t.length&&(this._$AR(s&&s._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=Oe(e).nextSibling;Oe(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},U=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,o,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(e,t=this,s,o){let n=this.strings,i=!1;if(n===void 0)e=W(this,e,t,0),i=!F(e)||e!==this._$AH&&e!==z,i&&(this._$AH=e);else{let l=e,a,h;for(e=n[0],a=0;a<n.length-1;a++)h=W(this,l[s+a],t,a),h===z&&(h=this._$AH[a]),i||=!F(h)||h!==this._$AH[a],h===p?e=p:e!==p&&(e+=(h??"")+n[a+1]),this._$AH[a]=h}i&&!o&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ce=class extends U{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}},pe=class extends U{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}},ue=class extends U{constructor(e,t,s,o,n){super(e,t,s,o,n),this.type=5}_$AI(e,t=this){if((e=W(this,e,t,0)??p)===z)return;let s=this._$AH,o=e===p&&s!==p||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==p&&(s===p||o);o&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},_e=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){W(this,e)}};var ut=me.litHtmlPolyfillSupport;ut?.(q,Y),(me.litHtmlVersions??=[]).push("3.3.3");var Ge=(r,e,t)=>{let s=t?.renderBefore??e,o=s._$litPart$;if(o===void 0){let n=t?.renderBefore??null;s._$litPart$=o=new Y(e.insertBefore(G(),n),n,void 0,t??{})}return o._$AI(r),o};var ye=globalThis,A=class extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ge(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return z}};A._$litElement$=!0,A.finalized=!0,ye.litElementHydrateSupport?.({LitElement:A});var _t=ye.litElementPolyfillSupport;_t?.({LitElement:A});(ye.litElementVersions??=[]).push("4.2.2");var $e={title:"Weheat Insights",live:"Live",last_24h:"Last 24 hours",last_7d:"Last 7 days",temperatures:"Temperatures",power:"Power",cop:"COP",delta_t:"\u0394T supply/return",state:"Operating state",room:"Room",outdoor:"Outdoor",supply:"Supply",return:"Return",power_input:"Electrical power",power_output:"Heat output",no_pumps_title:"No heat pump set up yet",no_pumps_body:"Add the **Weheat Insights** integration under *Settings \u2192 Devices & services* and pick a heat pump. This dashboard fills itself in once that is done.",error_title:"Weheat Insights is not available",error_body:"The dashboard could not load its configuration. Check that the Weheat Insights integration is installed and loaded.",disclaimer:"Unofficial community project, not affiliated with Weheat.",performance:"Performance",cop_history:"COP over time",day:"Day",month:"Month",season:"Season",heating:"Heating",dhw:"Hot water",total:"Total",no_data:"No data for this period yet.",electricity:"electricity",heat:"heat",scop_season:"SCOP this season",cop_month:"COP this month",cop_today:"COP today",defrost_cop_impact:"COP lost to defrost",degree_days_month:"Degree days this month",degree_days_season:"Degree days this season",heat_per_degree_day:"Heating per degree day",heat_per_degree_day_last_year:"Same period last season",heat_per_degree_day_last_season:"Whole last season",energy_per_day:"Energy per day",degree_days_per_day:"Degree days per day",degree_days_per_month:"Degree days per month",defrost:"Defrost",house:"House",heat_loss_title:"Heat loss",supply_curve_title:"Supply temperature vs outdoor",indoor_outdoor_diff:"Indoor \u2212 outdoor (K)",heating_per_day:"Heating heat (kWh/day)",outdoor_temp:"Outdoor temperature (\xB0C)",supply_temp:"Supply temperature (\xB0C)",days_used:"days",excluded:"excluded",used:"used",fit_line:"fit",indoor_assumed_note:"No indoor sensor configured: 20 \xB0C assumed, so this is less reliable.",reason_too_few_days:"Not enough usable days yet (at least 14 needed).",reason_too_little_spread:"Not enough difference between mild and cold days yet (at least 6 K needed).",reason_no_relation:"No clear relation between temperature difference and heating yet.",heat_loss_coefficient:"Heat-loss coefficient",heat_loss_design:"At \u221210 \xB0C",balance_point:"Balance point",cool_down_tau:"Time constant",cool_down_rate:"Cool-down at 15 K",thermal_mass:"Thermal mass",house_definitions:"**Heat loss.** Each dot is one day: heating heat against the average indoor\u2212outdoor difference. The slope of the line is the heat-loss coefficient (W/K, shown with a 95 % confidence interval); where the line crosses zero tells how much free heat (sun, people, appliances) the house gets. Grey dots are days left out: missing data, too mild, a big indoor temperature change, or another heat source running. **Cool-down** uses periods of 4+ hours without heating and needs an indoor sensor. **Supply temperature vs outdoor** shows hours of space heating only; the colour is \u0394T supply\u2212return.",delta_t_short:"\u0394T",power_input_short:"Electricity",power_output_short:"Heat",heat_pump:"Heat pump",pumps:"pumps",this_season:"This season",this_month:"This month",today:"Today",defrost_loss:"Lost to defrost",last_year_to_date:"Last year to date",whole_last_season:"Last season",scop_heading:"SCOP this season",cop_heading:"COP",standby:"Standby",degree_days:"Degree days",definitions:"**How these numbers are calculated.** *Heat pump* COP/SCOP is all useful heat divided by the compressor electricity for heating, hot water and defrost; this matches the Weheat app. *Total* also counts standby and the indoor unit (circulation pumps): what your heat actually costs. *Heating* and *hot water* only count the compressor electricity for that mode plus its share of defrost (split by electricity use); standby and the indoor unit are left out. Defrost heat taken back from the water counts against the COP. *Heating per degree day* uses heating heat only and lets you compare winters of different coldness. Figures come from Home Assistant's long-term statistics and can lag up to about an hour."},mt={title:"Weheat Insights",live:"Live",last_24h:"Afgelopen 24 uur",last_7d:"Afgelopen 7 dagen",temperatures:"Temperaturen",power:"Vermogen",cop:"COP",delta_t:"\u0394T aanvoer/retour",state:"Bedrijfstoestand",room:"Kamer",outdoor:"Buiten",supply:"Aanvoer",return:"Retour",power_input:"Elektrisch vermogen",power_output:"Warmteafgifte",no_pumps_title:"Nog geen warmtepomp ingesteld",no_pumps_body:"Voeg de integratie **Weheat Insights** toe via *Instellingen \u2192 Apparaten & diensten* en kies een warmtepomp. Dit dashboard vult zich daarna vanzelf.",error_title:"Weheat Insights is niet beschikbaar",error_body:"Het dashboard kon zijn configuratie niet laden. Controleer of de integratie Weheat Insights is ge\xEFnstalleerd en geladen.",disclaimer:"Onofficieel communityproject, niet verbonden aan Weheat.",performance:"Prestaties",cop_history:"COP door de tijd",day:"Dag",month:"Maand",season:"Seizoen",heating:"Verwarming",dhw:"Warm water",total:"Totaal",no_data:"Nog geen gegevens voor deze periode.",electricity:"stroom",heat:"warmte",scop_season:"SCOP dit stookseizoen",cop_month:"COP deze maand",cop_today:"COP vandaag",defrost_cop_impact:"COP-verlies door ontdooien",degree_days_month:"Graaddagen deze maand",degree_days_season:"Graaddagen dit stookseizoen",heat_per_degree_day:"Verwarming per graaddag",heat_per_degree_day_last_year:"Zelfde periode vorig seizoen",heat_per_degree_day_last_season:"Heel vorig seizoen",energy_per_day:"Energie per dag",degree_days_per_day:"Graaddagen per dag",degree_days_per_month:"Graaddagen per maand",defrost:"Ontdooien",house:"Woning",heat_loss_title:"Warmteverlies",supply_curve_title:"Aanvoertemperatuur vs buiten",indoor_outdoor_diff:"Binnen \u2212 buiten (K)",heating_per_day:"Verwarmingswarmte (kWh/dag)",outdoor_temp:"Buitentemperatuur (\xB0C)",supply_temp:"Aanvoertemperatuur (\xB0C)",days_used:"dagen",excluded:"uitgesloten",used:"gebruikt",fit_line:"lijn",indoor_assumed_note:"Geen binnensensor ingesteld: 20 \xB0C aangenomen, dus minder betrouwbaar.",reason_too_few_days:"Nog niet genoeg bruikbare dagen (minstens 14 nodig).",reason_too_little_spread:"Nog te weinig verschil tussen zachte en koude dagen (minstens 6 K nodig).",reason_no_relation:"Nog geen duidelijk verband tussen temperatuurverschil en verwarming.",heat_loss_coefficient:"Warmteverliesco\xEBffici\xEBnt",heat_loss_design:"Bij \u221210 \xB0C",balance_point:"Stookgrens",cool_down_tau:"Tijdconstante",cool_down_rate:"Afkoeling bij 15 K",thermal_mass:"Warmtecapaciteit",house_definitions:"**Warmteverlies.** Elke stip is \xE9\xE9n dag: verwarmingswarmte tegen het gemiddelde verschil tussen binnen en buiten. De helling van de lijn is de warmteverliesco\xEBffici\xEBnt (W/K, met een betrouwbaarheidsinterval van 95 %); waar de lijn nul raakt zie je hoeveel gratis warmte (zon, mensen, apparaten) het huis krijgt. Grijze stippen zijn dagen die niet meetellen: ontbrekende gegevens, te zacht, een grote verandering binnen of een andere warmtebron. **Afkoeling** gebruikt periodes van minstens 4 uur zonder verwarming en heeft een binnensensor nodig. **Aanvoertemperatuur vs buiten** toont alleen uren met ruimteverwarming; de kleur is de \u0394T aanvoer\u2212retour.",delta_t_short:"\u0394T",power_input_short:"Stroom",power_output_short:"Warmte",heat_pump:"Warmtepomp",pumps:"pompen",this_season:"Dit seizoen",this_month:"Deze maand",today:"Vandaag",defrost_loss:"Ontdooiverlies",last_year_to_date:"Vorig jaar tot nu",whole_last_season:"Vorig seizoen",scop_heading:"SCOP dit stookseizoen",cop_heading:"COP",standby:"Stand-by",degree_days:"Graaddagen",definitions:"**Zo worden deze getallen berekend.** De COP/SCOP *warmtepomp* is alle nuttige warmte gedeeld door de compressorstroom voor verwarming, warm water en ontdooien; dat komt overeen met de Weheat-app. *Totaal* telt ook stand-by en de binnenunit (circulatiepompen) mee: wat je warmte echt kost. *Verwarming* en *warm water* tellen alleen de compressorstroom voor die functie plus hun deel van het ontdooien (verdeeld naar stroomverbruik); stand-by en de binnenunit tellen daar niet mee. Warmte die bij ontdooien uit het water wordt gehaald, telt negatief mee. *Verwarming per graaddag* gebruikt alleen verwarmingswarmte, zodat je winters van verschillende koude kunt vergelijken. De cijfers komen uit de langetermijnstatistieken van Home Assistant en kunnen tot ongeveer een uur achterlopen."},gt={en:$e,nl:mt};function j(r){return(r.locale?.language??r.language??"en").split("-")[0]}function D(r){let e=gt[j(r)]??$e;return t=>e[t]??$e[t]}var N="weheat-insights-performance-card",ve=600,we=220,b={left:30,right:8,top:10,bottom:26},ft=900*1e3,x=(r,e=2)=>r==null?"\u2013":r.toFixed(e);function Fe(r,e,t){let s=new Date(`${r.start}T12:00:00`);if(e==="day")return String(s.getDate());if(e==="month")return s.toLocaleDateString(t,{month:"short"});let o=new Date(`${r.end}T12:00:00`),n=o.getMonth()===0?o.getFullYear()-1:o.getFullYear();return n===s.getFullYear()?String(s.getFullYear()):`${s.getFullYear()}/${String(n).slice(2)}`}function yt(r,e,t){let s=new Date(`${r.start}T12:00:00`);return e==="day"?s.toLocaleDateString(t,{weekday:"short",day:"numeric",month:"long"}):e==="month"?s.toLocaleDateString(t,{month:"long",year:"numeric"}):Fe(r,e,t)}var se=class extends A{constructor(){super(...arguments);this._kind="month"}static{this.properties={hass:{attribute:!1},_config:{state:!0},_kind:{state:!0},_data:{state:!0},_error:{state:!0}}}setConfig(t){if(!t.entry_id)throw new Error("entry_id is required");this._config=t,this._kind=t.period??"month"}getCardSize(){return 5}getGridOptions(){return{columns:"full",min_rows:4}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._fetch(!0),ft)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._timer)}willUpdate(t){(t.has("hass")||t.has("_kind")||t.has("_config"))&&this._fetch(!1)}async _fetch(t){if(!this.hass||!this._config)return;let s=`${this._config.entry_id}:${this._kind}`;if(!(!t&&s===this._fetchedKey)){this._fetchedKey=s;try{this._data=await this.hass.callWS({type:"weheat_insights/performance_history",entry_id:this._config.entry_id,period:this._kind}),this._error=void 0}catch(o){this._error=o instanceof Error?o.message:JSON.stringify(o)}}}render(){if(!this.hass||!this._config)return p;let t=D(this.hass);return g`
      <ha-card>
        <div class="header">
          <div class="title">${this._config.title??t("cop_history")}</div>
          <div class="kinds" role="tablist">
            ${["day","month","season"].map(s=>g`<button
                role="tab"
                aria-selected=${s===this._kind}
                class=${s===this._kind?"active":""}
                @click=${()=>this._kind=s}
              >
                ${t(s)}
              </button>`)}
          </div>
        </div>
        <div class="content">${this._renderBody(t)}</div>
      </ha-card>
    `}_renderBody(t){if(this._error)return g`<div class="message">${this._error}</div>`;let s=this._data;return!s||s.period!==this._kind?g`<div class="message">…</div>`:s.periods.some(o=>o.cop!=null)?g`${this._renderChart(s,t)}${this._renderLegend(s,t)}`:g`<div class="message">${t("no_data")}</div>`}_renderChart(t,s){let o=j(this.hass),n=t.periods.findIndex(d=>d.cop!=null||d.cop_heat_pump!=null),i=t.periods.slice(Math.max(0,n)),l=i.flatMap(d=>[d.cop_heat_pump,d.cop,d.cop_heating,t.has_dhw?d.cop_dhw:null]),a=Math.max(5,Math.ceil(Math.max(...l.map(d=>d??0))+.5)),h=ve-b.left-b.right,u=we-b.top-b.bottom,c=d=>b.top+u-Math.max(0,d)/a*u,m=h/i.length,y=t.has_dhw?2:1,$=Math.max(2,Math.min(28,m*.75/y)),J=a>8?2:1,_=Math.ceil(i.length/12),ke=[];for(let d=0;d<=a;d+=J)ke.push(C`<line class="grid" x1=${b.left} x2=${ve-b.right} y1=${c(d)} y2=${c(d)}></line>
        <text class="axis" x=${b.left-6} y=${c(d)+4} text-anchor="end">${d}</text>`);let Se=(d,S,H)=>d==null?p:C`<rect class=${H} x=${S} y=${c(d)} width=${$} height=${c(0)-c(d)} rx="2"></rect>`,Ee=(d,S,H)=>d==null?p:C`<line class=${H} x1=${S-2} x2=${S+$*y+2} y1=${c(d)} y2=${c(d)}></line>`,Xe=i.map((d,S)=>{let H=b.left+S*m+(m-$*y)/2,et=b.left+S*m+m/2,tt=[yt(d,t.period,o),`${s("heat_pump")}: ${x(d.cop_heat_pump)} (${x(d.heat_kwh,1)} kWh ${s("heat")} / ${x(d.heat_pump_electricity_kwh,1)} kWh ${s("electricity")})`,`${s("total")}: ${x(d.cop)} (+ ${x(d.standby_kwh,1)} kWh ${s("standby").toLowerCase()}, + ${x(d.indoor_unit_kwh,1)} kWh ${s("pumps")})`,`${s("heating")}: ${x(d.cop_heating)} (${x(d.heating_heat_kwh,1)} / ${x(d.heating_electricity_kwh,1)} kWh)`,...t.has_dhw?[`${s("dhw")}: ${x(d.cop_dhw)} (${x(d.dhw_heat_kwh,1)} / ${x(d.dhw_electricity_kwh,1)} kWh)`]:[]].join(`
`);return C`<g>
        <title>${tt}</title>
        <rect class="hit" x=${b.left+S*m} y=${b.top} width=${m} height=${u}></rect>
        ${Se(d.cop_heating,H,"heating")}
        ${t.has_dhw?Se(d.cop_dhw,H+$,"dhw"):p}
        ${Ee(d.cop_heat_pump,H,"heat-pump")}
        ${Ee(d.cop,H,"total")}
        ${S%_===0?C`<text class="axis" x=${et} y=${we-8} text-anchor="middle">${Fe(d,t.period,o)}</text>`:p}
      </g>`});return g`<svg viewBox="0 0 ${ve} ${we}" role="img" aria-label=${s("cop_history")}>
      ${ke}${Xe}
    </svg>`}_renderLegend(t,s){return g`<div class="legend">
      <span><i class="swatch heating"></i>${s("heating")}</span>
      ${t.has_dhw?g`<span><i class="swatch dhw"></i>${s("dhw")}</span>`:p}
      <span><i class="swatch heat-pump"></i>${s("heat_pump")}</span>
      <span><i class="swatch total"></i>${s("total")}</span>
    </div>`}static{this.styles=K`
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
  `}};var P=r=>r.filter(e=>!!e);function k(r,e){return{type:"heading",heading:r,heading_style:"title",...e?{icon:e}:{}}}function f(r,e){return r?{type:"tile",entity:r,name:e}:null}function v(r,e){return r?{entity:r,name:e}:null}function re(r,e,t){return e.length?{type:"history-graph",title:r,hours_to_show:t,entities:e,grid_options:{columns:"full"}}:null}function be(r,e,t){return e.length?{type:"statistics-graph",title:r,entities:e,days_to_show:t,period:"hour",stat_types:["mean"],chart_type:"line",grid_options:{columns:"full"}}:null}function T(r,e,t=!1){let s=P(r);return s.length<=(t?0:1)?null:{type:"grid",cards:s,...e?{column_span:e}:{}}}function oe(r,e,t,s){return e.length?{type:"statistics-graph",title:r,entities:e,period:t,days_to_show:s,stat_types:["change"],chart_type:"bar",grid_options:{columns:"full"}}:null}var $t=["heating","dhw","legionella_prevention"];function vt(r,e,t){if(!r)return null;let s={type:"gauge",entity:r,name:t("cop"),min:0,max:7,needle:!0,severity:{red:0,yellow:3,green:4}};return e?{type:"conditional",conditions:[{condition:"state",entity:e,state:$t}],card:s}:s}function wt(r){return r.indoor_entity_id??r.weheat.thermostat_room_temperature}function bt(r,e,t){let s=r.weheat,o=wt(r),n=r.outdoor_entity_id??s.outside_temperature,i=P([v(s.water_outlet_temperature,e("supply")),v(s.water_inlet_temperature,e("return")),v(n,e("outdoor")),v(o,e("room"))]),l=P([v(s.power_input,e("power_input")),v(s.power_output,e("power_output"))]),a=P([v(r.insights.delta_t,e("delta_t"))]),h=T([k(e("live"),"mdi:heat-pump"),f(s.heat_pump_state,e("state")),vt(s.cop,s.heat_pump_state,e),f(o,e("room")),f(n,e("outdoor")),f(s.water_outlet_temperature,e("supply")),f(s.water_inlet_temperature,e("return")),f(r.insights.delta_t,e("delta_t_short")),f(s.power_input,e("power_input_short")),f(s.power_output,e("power_output_short"))]),u=T([k(e("last_24h"),"mdi:clock-outline"),re(e("temperatures"),i,24),re(e("power"),l,24),re(e("delta_t"),a,24),re(e("state"),P([v(s.heat_pump_state,e("state"))]),24)]),c=T([k(e("last_7d"),"mdi:calendar-week"),be(e("temperatures"),i,7),be(e("power"),l,7),be(e("delta_t"),a,7)]);return{title:r.name,path:t===0?"heat-pump":`heat-pump-${t+1}`,icon:"mdi:heat-pump-outline",type:"sections",max_columns:3,sections:P([h,u,c])}}function xt(r,e,t){let s=r.weheat,o=r.insights,n=T([k(e("scop_heading"),"mdi:chart-bar"),f(o.scop_heat_pump_season,e("heat_pump")),f(o.scop_season,e("total")),f(o.scop_heating_season,e("heating")),f(o.scop_dhw_season,e("dhw")),f(o.defrost_cop_impact_season,e("defrost_loss")),k(e("cop_month"),"mdi:calendar-month"),f(o.cop_heat_pump_month,e("heat_pump")),f(o.cop_month,e("total")),k(e("cop_today"),"mdi:calendar-today"),f(o.cop_heat_pump_today,e("heat_pump")),f(o.cop_today,e("total"))]),i=T([{type:`custom:${N}`,entry_id:r.entry_id}],2,!0),l=r.degree_days_statistic_id?{entity:r.degree_days_statistic_id,name:e("degree_days")}:null,a=T([k(e("heat_per_degree_day"),"mdi:home-thermometer-outline"),f(o.heat_per_degree_day_season,e("this_season")),f(o.heat_per_degree_day_last_year,e("last_year_to_date")),f(o.heat_per_degree_day_last_season,e("whole_last_season")),k(e("degree_days"),"mdi:thermometer-lines"),f(o.degree_days_month,e("this_month")),f(o.degree_days_season,e("this_season")),l?oe(e("degree_days_per_month"),[l],"month",400):null,l?oe(e("degree_days_per_day"),[l],"day",30):null]),h=T([k(e("energy_per_day"),"mdi:lightning-bolt"),oe(`${e("energy_per_day")} \xB7 ${e("electricity")}`,P([v(s.electricity_used_heating,e("heating")),v(s.electricity_used_dhw,e("dhw")),v(s.electricity_used_defrost,e("defrost")),v(s.electricity_used_standby,e("standby"))]),"day",30),oe(`${e("energy_per_day")} \xB7 ${e("heat")}`,P([v(s.energy_output_heating,e("heating")),v(s.energy_output_dhw,e("dhw")),v(s.energy_output_defrost,e("defrost"))]),"day",30)],2),u=T([k(e("title"),"mdi:information-outline"),{type:"markdown",content:`${e("definitions")}

_${e("disclaimer")}_`}]);return{title:`${r.name} \xB7 ${e("performance")}`,path:t===0?"performance":`performance-${t+1}`,icon:"mdi:chart-bar",type:"sections",max_columns:4,sections:P([n,i,a,h,u])}}function qe(r,e,t){return{title:r("title"),path:"weheat-insights",type:"panel",cards:[{type:"markdown",content:`## ${e}

${t}

_${r("disclaimer")}_`}]}}function Ye(r,e){return r.length?{title:e("title"),views:r.flatMap((t,s)=>[xt(t,e,s),bt(t,e,s)])}:{title:e("title"),views:[qe(e,e("no_pumps_title"),e("no_pumps_body"))]}}function Ze(r,e){return{title:r("title"),views:[qe(r,r("error_title"),`${r("error_body")}

\`${e}\``)]}}var Z="weheat-insights-scatter-card",xe=600,Ce=300,w={left:46,right:12,top:12,bottom:40},Ct=3600*1e3;function Je(r,e,t=6){if(!isFinite(r)||!isFinite(e))return[];r===e&&(r-=1,e+=1);let s=(e-r)/t,o=10**Math.floor(Math.log10(s)),n=[1,2,2.5,5,10].map(l=>l*o).find(l=>l>=s)??s,i=[];for(let l=Math.floor(r/n)*n;l<=e+n*1e-9;l+=n)i.push(Math.round(l*1e6)/1e6);return i[i.length-1]<e&&i.push(i[i.length-1]+n),i}function At(r,e,t){return`hsl(${(220-220*(t>e?Math.min(1,Math.max(0,(r-e)/(t-e))):.5)).toFixed(0)} 75% 48%)`}var ne=class extends A{static{this.properties={hass:{attribute:!1},_config:{state:!0},_data:{state:!0},_error:{state:!0}}}setConfig(e){if(!e.entry_id)throw new Error("entry_id is required");if(e.mode!=="heat_loss"&&e.mode!=="supply_curve")throw new Error('mode must be "heat_loss" or "supply_curve"');this._config=e,this._data=void 0}getCardSize(){return 6}getGridOptions(){return{columns:"full",min_rows:5}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._fetch(!0),Ct)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._timer)}willUpdate(e){(e.has("hass")||e.has("_config"))&&this._fetch(!1)}async _fetch(e){if(!this.hass||!this._config)return;let{entry_id:t,mode:s,days:o}=this._config,n=`${t}:${s}:${o??""}`;if(!(!e&&n===this._fetchedKey)){this._fetchedKey=n;try{this._data=s==="heat_loss"?await this.hass.callWS({type:"weheat_insights/heat_loss",entry_id:t}):await this.hass.callWS({type:"weheat_insights/supply_curve",entry_id:t,days:o??60}),this._error=void 0}catch(i){this._error=i instanceof Error?i.message:JSON.stringify(i)}}}render(){if(!this.hass||!this._config)return p;let e=D(this.hass),t=this._config.mode==="heat_loss";return g`<ha-card>
      <div class="title">${this._config.title??e(t?"heat_loss_title":"supply_curve_title")}</div>
      ${this._error?g`<div class="message">${this._error}</div>`:this._data?t?this._renderHeatLoss(this._data,e):this._renderSupply(this._data,e):g`<div class="message">…</div>`}
    </ha-card>`}_renderHeatLoss(e,t){let s=j(this.hass),o=new Intl.NumberFormat(s,{maximumFractionDigits:1}),n=e.points.map(a=>({x:a.delta_k,y:a.heating_kwh,cls:a.excluded?"excluded":"used",tip:`${a.day}: ${o.format(a.delta_k)} K, ${o.format(a.heating_kwh)} kWh${a.excluded?` (${t("excluded")})`:""}`})),i=e.fit,l=i?g`<div class="summary">
          <strong>${Math.round(e.coefficient_w_per_k)} ± ${Math.round(e.confidence_95_w_per_k)} W/K</strong>
          · R² ${i.r_squared.toFixed(2)} · ${e.days_used} ${t("days_used")}
        </div>`:g`<div class="summary muted">${e.reason?t(`reason_${e.reason}`):""}</div>`;return g`${l}
      ${this._chart(n,{xLabel:t("indoor_outdoor_diff"),yLabel:t("heating_per_day"),includeZeroY:!0,line:i?a=>i.slope*a+i.intercept:void 0})}
      <div class="legend">
        <span><i class="dot used"></i>${t("used")}</span>
        <span><i class="dot excluded"></i>${t("excluded")}</span>
        ${i?g`<span><i class="line"></i>${t("fit_line")}</span>`:p}
      </div>
      ${e.indoor_assumed?g`<div class="note">${t("indoor_assumed_note")}</div>`:p}`}_renderSupply(e,t){if(!e.points.length)return g`<div class="message">${t("no_data")}</div>`;let s=j(this.hass),o=new Intl.NumberFormat(s,{maximumFractionDigits:1}),n=e.points.map(h=>h.delta_t_k).sort((h,u)=>h-u),i=n[Math.floor(n.length*.05)],l=n[Math.min(n.length-1,Math.floor(n.length*.95))],a=e.points.map(h=>({x:h.outdoor_c,y:h.supply_c,color:At(h.delta_t_k,i,l),tip:`${new Date(h.time).toLocaleString(s,{dateStyle:"short",timeStyle:"short"})}: ${o.format(h.outdoor_c)} \xB0C \u2192 ${o.format(h.supply_c)} \xB0C, \u0394T ${o.format(h.delta_t_k)} K`}));return g`${this._chart(a,{xLabel:t("outdoor_temp"),yLabel:t("supply_temp")})}
      <div class="legend">
        <span>ΔT ${o.format(i)} K</span>
        <i class="gradient"></i>
        <span>${o.format(l)} K</span>
      </div>`}_chart(e,t){if(!e.length)return g`<div class="message">${D(this.hass)("no_data")}</div>`;let s=e.map(_=>_.x),o=e.map(_=>_.y),n=Je(Math.min(...s),Math.max(...s)),i=Je(t.includeZeroY?Math.min(0,...o):Math.min(...o),Math.max(...o)),[l,a]=[n[0],n[n.length-1]],[h,u]=[i[0],i[i.length-1]],c=xe-w.left-w.right,m=Ce-w.top-w.bottom,y=_=>w.left+(_-l)/(a-l)*c,$=_=>w.top+m-(_-h)/(u-h)*m,J=_=>Math.min(u,Math.max(h,_));return g`<svg viewBox="0 0 ${xe} ${Ce}" role="img" aria-label=${t.yLabel}>
      ${i.map(_=>C`<line class="grid" x1=${w.left} x2=${xe-w.right} y1=${$(_)} y2=${$(_)}></line>
          <text class="axis" x=${w.left-6} y=${$(_)+4} text-anchor="end">${_}</text>`)}
      ${n.map(_=>C`<line class="grid" x1=${y(_)} x2=${y(_)} y1=${w.top} y2=${w.top+m}></line>
          <text class="axis" x=${y(_)} y=${w.top+m+16} text-anchor="middle">${_}</text>`)}
      <text class="label" x=${w.left+c/2} y=${Ce-4} text-anchor="middle">${t.xLabel}</text>
      <text class="label" transform="translate(12 ${w.top+m/2}) rotate(-90)" text-anchor="middle">${t.yLabel}</text>
      ${e.map(_=>C`<circle class=${_.cls??""} cx=${y(_.x)} cy=${$(_.y)} r="3.5" style=${_.color?`fill:${_.color}`:""}>
          <title>${_.tip}</title>
        </circle>`)}
      ${t.line?C`<line class="fit" x1=${y(l)} y1=${$(J(t.line(l)))} x2=${y(a)} y2=${$(J(t.line(a)))}></line>`:p}
    </svg>`}static{this.styles=K`
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
  `}};var Qe="ll-strategy-dashboard-weheat-insights",Ae=class extends HTMLElement{static async generate(e,t){let s=D(t);try{let o=await t.callWS({type:"weheat_insights/dashboard_config"});return Ye(o.heat_pumps,s)}catch(o){let n=o instanceof Error?o.message:JSON.stringify(o);return Ze(s,n)}}};customElements.get(Qe)||customElements.define(Qe,Ae);customElements.get(N)||customElements.define(N,se);customElements.get(Z)||customElements.define(Z,ne);window.customCards=window.customCards??[];window.customCards.some(r=>r.type===N)||window.customCards.push({type:N,name:"Weheat Insights performance",description:"COP per day, month or season for heating and hot water (unofficial)"});window.customCards.some(r=>r.type===Z)||window.customCards.push({type:Z,name:"Weheat Insights scatter",description:"Heat loss of the house or supply vs outdoor temperature (unofficial)"});window.customStrategies=window.customStrategies??[];window.customStrategies.some(r=>r.type==="weheat-insights")||window.customStrategies.push({type:"weheat-insights",strategyType:"dashboard",name:"Weheat Insights",description:"Live overview and history for Weheat heat pumps (unofficial)"});
