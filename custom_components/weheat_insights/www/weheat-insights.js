var Q=globalThis,X=Q.ShadowRoot&&(Q.ShadyCSS===void 0||Q.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ie=Symbol(),Pe=new WeakMap,K=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==ie)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(X&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=Pe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Pe.set(t,e))}return e}toString(){return this.cssText}},He=o=>new K(typeof o=="string"?o:o+"",void 0,ie),V=(o,...e)=>{let t=o.length===1?o[0]:e.reduce((s,n,r)=>s+(i=>{if(i._$cssResult$===!0)return i.cssText;if(typeof i=="number")return i;throw Error("Value passed to 'css' function must be a 'css' function result: "+i+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+o[r+1],o[0]);return new K(t,o,ie)},Le=(o,e)=>{if(X)o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),n=Q.litNonce;n!==void 0&&s.setAttribute("nonce",n),s.textContent=t.cssText,o.appendChild(s)}},ae=X?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return He(t)})(o):o;var{is:st,defineProperty:ot,getOwnPropertyDescriptor:nt,getOwnPropertyNames:rt,getOwnPropertySymbols:it,getPrototypeOf:at}=Object,ee=globalThis,Te=ee.trustedTypes,lt=Te?Te.emptyScript:"",dt=ee.reactiveElementPolyfillSupport,B=(o,e)=>o,le={toAttribute(o,e){switch(e){case Boolean:o=o?lt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},Me=(o,e)=>!st(o,e),Re={attribute:!0,type:String,converter:le,reflect:!1,useDefault:!1,hasChanged:Me};Symbol.metadata??=Symbol("metadata"),ee.litPropertyMetadata??=new WeakMap;var H=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Re){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),n=this.getPropertyDescriptor(e,s,t);n!==void 0&&ot(this.prototype,e,n)}}static getPropertyDescriptor(e,t,s){let{get:n,set:r}=nt(this.prototype,e)??{get(){return this[t]},set(i){this[t]=i}};return{get:n,set(i){let l=n?.call(this);r?.call(this,i),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Re}static _$Ei(){if(this.hasOwnProperty(B("elementProperties")))return;let e=at(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(B("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(B("properties"))){let t=this.properties,s=[...rt(t),...it(t)];for(let n of s)this.createProperty(n,t[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,n]of t)this.elementProperties.set(s,n)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let n=this._$Eu(t,s);n!==void 0&&this._$Eh.set(n,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let n of s)t.unshift(ae(n))}else e!==void 0&&t.push(ae(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Le(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,s);if(n!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:le).toAttribute(t,s.type);this._$Em=e,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(e,t){let s=this.constructor,n=s._$Eh.get(e);if(n!==void 0&&this._$Em!==n){let r=s.getPropertyOptions(n),i=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:le;this._$Em=n;let l=i.fromAttribute(t,r.type);this[n]=l??this._$Ej?.get(n)??l,this._$Em=null}}requestUpdate(e,t,s,n=!1,r){if(e!==void 0){let i=this.constructor;if(n===!1&&(r=this[e]),s??=i.getPropertyOptions(e),!((s.hasChanged??Me)(r,t)||s.useDefault&&s.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(i._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:n,wrapped:r},i){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,i??t??this[e]),r!==!0||i!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),n===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[n,r]of s){let{wrapped:i}=r,l=this[n];i!==!0||this._$AL.has(n)||l===void 0||this.C(n,void 0,r,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};H.elementStyles=[],H.shadowRootOptions={mode:"open"},H[B("elementProperties")]=new Map,H[B("finalized")]=new Map,dt?.({ReactiveElement:H}),(ee.reactiveElementVersions??=[]).push("2.1.2");var me=globalThis,Oe=o=>o,te=me.trustedTypes,ze=te?te.createPolicy("lit-html",{createHTML:o=>o}):void 0,Ie="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Ke="?"+T,ht=`<${Ke}>`,z=document,F=()=>z.createComment(""),q=o=>o===null||typeof o!="object"&&typeof o!="function",ge=Array.isArray,ct=o=>ge(o)||typeof o?.[Symbol.iterator]=="function",de=`[ 	
\f\r]`,G=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,De=/-->/g,We=/>/g,M=RegExp(`>|${de}(?:([^\\s"'>=/]+)(${de}*=${de}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ne=/'/g,Ue=/"/g,Ve=/^(?:script|style|textarea|title)$/i,fe=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),f=fe(1),k=fe(2),Lt=fe(3),D=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),je=new WeakMap,O=z.createTreeWalker(z,129);function Be(o,e){if(!ge(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return ze!==void 0?ze.createHTML(e):e}var pt=(o,e)=>{let t=o.length-1,s=[],n,r=e===2?"<svg>":e===3?"<math>":"",i=G;for(let l=0;l<t;l++){let a=o[l],h,m,c=-1,g=0;for(;g<a.length&&(i.lastIndex=g,m=i.exec(a),m!==null);)g=i.lastIndex,i===G?m[1]==="!--"?i=De:m[1]!==void 0?i=We:m[2]!==void 0?(Ve.test(m[2])&&(n=RegExp("</"+m[2],"g")),i=M):m[3]!==void 0&&(i=M):i===M?m[0]===">"?(i=n??G,c=-1):m[1]===void 0?c=-2:(c=i.lastIndex-m[2].length,h=m[1],i=m[3]===void 0?M:m[3]==='"'?Ue:Ne):i===Ue||i===Ne?i=M:i===De||i===We?i=G:(i=M,n=void 0);let y=i===M&&o[l+1].startsWith("/>")?" ":"";r+=i===G?a+ht:c>=0?(s.push(h),a.slice(0,c)+Ie+a.slice(c)+T+y):a+T+(c===-2?l:y)}return[Be(o,r+(o[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},Y=class o{constructor({strings:e,_$litType$:t},s){let n;this.parts=[];let r=0,i=0,l=e.length-1,a=this.parts,[h,m]=pt(e,t);if(this.el=o.createElement(h,s),O.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(n=O.nextNode())!==null&&a.length<l;){if(n.nodeType===1){if(n.hasAttributes())for(let c of n.getAttributeNames())if(c.endsWith(Ie)){let g=m[i++],y=n.getAttribute(c).split(T),$=/([.?@])?(.*)/.exec(g);a.push({type:1,index:r,name:$[2],strings:y,ctor:$[1]==="."?ce:$[1]==="?"?pe:$[1]==="@"?ue:j}),n.removeAttribute(c)}else c.startsWith(T)&&(a.push({type:6,index:r}),n.removeAttribute(c));if(Ve.test(n.tagName)){let c=n.textContent.split(T),g=c.length-1;if(g>0){n.textContent=te?te.emptyScript:"";for(let y=0;y<g;y++)n.append(c[y],F()),O.nextNode(),a.push({type:2,index:++r});n.append(c[g],F())}}}else if(n.nodeType===8)if(n.data===Ke)a.push({type:2,index:r});else{let c=-1;for(;(c=n.data.indexOf(T,c+1))!==-1;)a.push({type:7,index:r}),c+=T.length-1}r++}}static createElement(e,t){let s=z.createElement("template");return s.innerHTML=e,s}};function U(o,e,t=o,s){if(e===D)return e;let n=s!==void 0?t._$Co?.[s]:t._$Cl,r=q(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),r===void 0?n=void 0:(n=new r(o),n._$AT(o,t,s)),s!==void 0?(t._$Co??=[])[s]=n:t._$Cl=n),n!==void 0&&(e=U(o,n._$AS(o,e.values),n,s)),e}var he=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,n=(e?.creationScope??z).importNode(t,!0);O.currentNode=n;let r=O.nextNode(),i=0,l=0,a=s[0];for(;a!==void 0;){if(i===a.index){let h;a.type===2?h=new Z(r,r.nextSibling,this,e):a.type===1?h=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(h=new _e(r,this,e)),this._$AV.push(h),a=s[++l]}i!==a?.index&&(r=O.nextNode(),i++)}return O.currentNode=z,n}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},Z=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,n){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=U(this,e,t),q(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==D&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ct(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&q(this._$AH)?this._$AA.nextSibling.data=e:this.T(z.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,n=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=Y.createElement(Be(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===n)this._$AH.p(t);else{let r=new he(n,this),i=r.u(this.options);r.p(t),this.T(i),this._$AH=r}}_$AC(e){let t=je.get(e.strings);return t===void 0&&je.set(e.strings,t=new Y(e)),t}k(e){ge(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,n=0;for(let r of e)n===t.length?t.push(s=new o(this.O(F()),this.O(F()),this,this.options)):s=t[n],s._$AI(r),n++;n<t.length&&(this._$AR(s&&s._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=Oe(e).nextSibling;Oe(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},j=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,n,r){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(e,t=this,s,n){let r=this.strings,i=!1;if(r===void 0)e=U(this,e,t,0),i=!q(e)||e!==this._$AH&&e!==D,i&&(this._$AH=e);else{let l=e,a,h;for(e=r[0],a=0;a<r.length-1;a++)h=U(this,l[s+a],t,a),h===D&&(h=this._$AH[a]),i||=!q(h)||h!==this._$AH[a],h===p?e=p:e!==p&&(e+=(h??"")+r[a+1]),this._$AH[a]=h}i&&!n&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ce=class extends j{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}},pe=class extends j{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}},ue=class extends j{constructor(e,t,s,n,r){super(e,t,s,n,r),this.type=5}_$AI(e,t=this){if((e=U(this,e,t,0)??p)===D)return;let s=this._$AH,n=e===p&&s!==p||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==p&&(s===p||n);n&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},_e=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){U(this,e)}};var ut=me.litHtmlPolyfillSupport;ut?.(Y,Z),(me.litHtmlVersions??=[]).push("3.3.3");var Ge=(o,e,t)=>{let s=t?.renderBefore??e,n=s._$litPart$;if(n===void 0){let r=t?.renderBefore??null;s._$litPart$=n=new Z(e.insertBefore(F(),r),r,void 0,t??{})}return n._$AI(o),n};var ye=globalThis,S=class extends H{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ge(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return D}};S._$litElement$=!0,S.finalized=!0,ye.litElementHydrateSupport?.({LitElement:S});var _t=ye.litElementPolyfillSupport;_t?.({LitElement:S});(ye.litElementVersions??=[]).push("4.2.2");var $e={title:"Weheat Insights",live:"Live",last_24h:"Last 24 hours",last_7d:"Last 7 days",temperatures:"Temperatures",power:"Power",cop:"COP",delta_t:"\u0394T supply/return",state:"Operating state",room:"Room",outdoor:"Outdoor",supply:"Supply",return:"Return",power_input:"Electrical power",power_output:"Heat output",no_pumps_title:"No heat pump set up yet",no_pumps_body:"Add the **Weheat Insights** integration under *Settings \u2192 Devices & services* and pick a heat pump. This dashboard fills itself in once that is done.",error_title:"Weheat Insights is not available",error_body:"The dashboard could not load its configuration. Check that the Weheat Insights integration is installed and loaded.",disclaimer:"Unofficial community project, not affiliated with Weheat.",performance:"Performance",cop_history:"COP over time",day:"Day",month:"Month",season:"Season",heating:"Heating",dhw:"Hot water",total:"Total",no_data:"No data for this period yet.",electricity:"electricity",heat:"heat",scop_season:"SCOP this season",cop_month:"COP this month",cop_today:"COP today",defrost_cop_impact:"COP lost to defrost",degree_days_month:"Degree days this month",degree_days_season:"Degree days this season",heat_per_degree_day:"Heating per degree day",heat_per_degree_day_last_year:"Same period last season",heat_per_degree_day_last_season:"Whole last season",energy_per_day:"Energy per day",degree_days_per_day:"Degree days per day",degree_days_per_month:"Degree days per month",defrost:"Defrost",house:"House",heat_loss_short:"Heat loss",heating_curve:"Heating curve",heat_loss_title:"Heat loss",supply_curve_title:"Supply temperature vs outdoor",indoor_outdoor_diff:"Indoor \u2212 outdoor (K)",heating_per_day:"Heating heat (kWh/day)",outdoor_temp:"Outdoor temperature (\xB0C)",supply_temp:"Supply temperature (\xB0C)",days_used:"days",excluded:"excluded",used:"used",fit_line:"fit",indoor_assumed_note:"No indoor sensor configured: 20 \xB0C assumed, so this is less reliable.",reason_too_few_days:"Not enough usable days yet (at least 14 needed).",reason_too_little_spread:"Not enough difference between mild and cold days yet (at least 6 K needed).",reason_no_relation:"No clear relation between temperature difference and heating yet.",heat_loss_coefficient:"Heat-loss coefficient",heat_loss_design:"At \u221210 \xB0C",balance_point:"Balance point",cool_down_tau:"Time constant",cool_down_rate:"Cool-down at 15 K",thermal_mass:"Thermal mass",house_definitions:"**Heat loss.** Each dot is one day: heating heat against the average indoor\u2212outdoor difference. The slope of the line is the heat-loss coefficient (W/K, shown with a 95 % confidence interval); where the line crosses zero tells how much free heat (sun, people, appliances) the house gets. Grey dots are days left out: missing data, too mild, a big indoor temperature change, or another heat source running. **Cool-down** uses periods of 4+ hours without heating and needs an indoor sensor. **Supply temperature vs outdoor** shows hours of space heating only; the colour is \u0394T supply\u2212return.",delta_t_short:"\u0394T",power_input_short:"Electricity",power_output_short:"Heat",heat_pump:"Heat pump",pumps:"pumps",this_season:"This season",this_month:"This month",today:"Today",defrost_loss:"Lost to defrost",last_year_to_date:"Last year to date",whole_last_season:"Last season",scop_heading:"SCOP this season",cop_heading:"COP",standby:"Standby",degree_days:"Degree days",definitions:"**How these numbers are calculated.** *Heat pump* COP/SCOP is all useful heat divided by the compressor electricity for heating, hot water and defrost; this matches the Weheat app. *Total* also counts standby and the indoor unit (circulation pumps): what your heat actually costs. *Heating* and *hot water* only count the compressor electricity for that mode plus its share of defrost (split by electricity use); standby and the indoor unit are left out. Defrost heat taken back from the water counts against the COP. *Heating per degree day* uses heating heat only and lets you compare winters of different coldness. Figures come from Home Assistant's long-term statistics and can lag up to about an hour."},mt={title:"Weheat Insights",live:"Live",last_24h:"Afgelopen 24 uur",last_7d:"Afgelopen 7 dagen",temperatures:"Temperaturen",power:"Vermogen",cop:"COP",delta_t:"\u0394T aanvoer/retour",state:"Bedrijfstoestand",room:"Kamer",outdoor:"Buiten",supply:"Aanvoer",return:"Retour",power_input:"Elektrisch vermogen",power_output:"Warmteafgifte",no_pumps_title:"Nog geen warmtepomp ingesteld",no_pumps_body:"Voeg de integratie **Weheat Insights** toe via *Instellingen \u2192 Apparaten & diensten* en kies een warmtepomp. Dit dashboard vult zich daarna vanzelf.",error_title:"Weheat Insights is niet beschikbaar",error_body:"Het dashboard kon zijn configuratie niet laden. Controleer of de integratie Weheat Insights is ge\xEFnstalleerd en geladen.",disclaimer:"Onofficieel communityproject, niet verbonden aan Weheat.",performance:"Prestaties",cop_history:"COP door de tijd",day:"Dag",month:"Maand",season:"Seizoen",heating:"Verwarming",dhw:"Warm water",total:"Totaal",no_data:"Nog geen gegevens voor deze periode.",electricity:"stroom",heat:"warmte",scop_season:"SCOP dit stookseizoen",cop_month:"COP deze maand",cop_today:"COP vandaag",defrost_cop_impact:"COP-verlies door ontdooien",degree_days_month:"Graaddagen deze maand",degree_days_season:"Graaddagen dit stookseizoen",heat_per_degree_day:"Verwarming per graaddag",heat_per_degree_day_last_year:"Zelfde periode vorig seizoen",heat_per_degree_day_last_season:"Heel vorig seizoen",energy_per_day:"Energie per dag",degree_days_per_day:"Graaddagen per dag",degree_days_per_month:"Graaddagen per maand",defrost:"Ontdooien",house:"Woning",heat_loss_short:"Warmteverlies",heating_curve:"Stooklijn",heat_loss_title:"Warmteverlies",supply_curve_title:"Aanvoertemperatuur vs buiten",indoor_outdoor_diff:"Binnen \u2212 buiten (K)",heating_per_day:"Verwarmingswarmte (kWh/dag)",outdoor_temp:"Buitentemperatuur (\xB0C)",supply_temp:"Aanvoertemperatuur (\xB0C)",days_used:"dagen",excluded:"uitgesloten",used:"gebruikt",fit_line:"lijn",indoor_assumed_note:"Geen binnensensor ingesteld: 20 \xB0C aangenomen, dus minder betrouwbaar.",reason_too_few_days:"Nog niet genoeg bruikbare dagen (minstens 14 nodig).",reason_too_little_spread:"Nog te weinig verschil tussen zachte en koude dagen (minstens 6 K nodig).",reason_no_relation:"Nog geen duidelijk verband tussen temperatuurverschil en verwarming.",heat_loss_coefficient:"Warmteverliesco\xEBffici\xEBnt",heat_loss_design:"Bij \u221210 \xB0C",balance_point:"Stookgrens",cool_down_tau:"Tijdconstante",cool_down_rate:"Afkoeling bij 15 K",thermal_mass:"Warmtecapaciteit",house_definitions:"**Warmteverlies.** Elke stip is \xE9\xE9n dag: verwarmingswarmte tegen het gemiddelde verschil tussen binnen en buiten. De helling van de lijn is de warmteverliesco\xEBffici\xEBnt (W/K, met een betrouwbaarheidsinterval van 95 %); waar de lijn nul raakt zie je hoeveel gratis warmte (zon, mensen, apparaten) het huis krijgt. Grijze stippen zijn dagen die niet meetellen: ontbrekende gegevens, te zacht, een grote verandering binnen of een andere warmtebron. **Afkoeling** gebruikt periodes van minstens 4 uur zonder verwarming en heeft een binnensensor nodig. **Aanvoertemperatuur vs buiten** toont alleen uren met ruimteverwarming; de kleur is de \u0394T aanvoer\u2212retour.",delta_t_short:"\u0394T",power_input_short:"Stroom",power_output_short:"Warmte",heat_pump:"Warmtepomp",pumps:"pompen",this_season:"Dit seizoen",this_month:"Deze maand",today:"Vandaag",defrost_loss:"Ontdooiverlies",last_year_to_date:"Vorig jaar tot nu",whole_last_season:"Vorig seizoen",scop_heading:"SCOP dit stookseizoen",cop_heading:"COP",standby:"Stand-by",degree_days:"Graaddagen",definitions:"**Zo worden deze getallen berekend.** De COP/SCOP *warmtepomp* is alle nuttige warmte gedeeld door de compressorstroom voor verwarming, warm water en ontdooien; dat komt overeen met de Weheat-app. *Totaal* telt ook stand-by en de binnenunit (circulatiepompen) mee: wat je warmte echt kost. *Verwarming* en *warm water* tellen alleen de compressorstroom voor die functie plus hun deel van het ontdooien (verdeeld naar stroomverbruik); stand-by en de binnenunit tellen daar niet mee. Warmte die bij ontdooien uit het water wordt gehaald, telt negatief mee. *Verwarming per graaddag* gebruikt alleen verwarmingswarmte, zodat je winters van verschillende koude kunt vergelijken. De cijfers komen uit de langetermijnstatistieken van Home Assistant en kunnen tot ongeveer een uur achterlopen."},gt={en:$e,nl:mt};function I(o){return(o.locale?.language??o.language??"en").split("-")[0]}function W(o){let e=gt[I(o)]??$e;return t=>e[t]??$e[t]}var N="weheat-insights-performance-card",ve=600,we=220,x={left:30,right:8,top:10,bottom:26},ft=900*1e3,C=(o,e=2)=>o==null?"\u2013":o.toFixed(e);function Fe(o,e,t){let s=new Date(`${o.start}T12:00:00`);if(e==="day")return String(s.getDate());if(e==="month")return s.toLocaleDateString(t,{month:"short"});let n=new Date(`${o.end}T12:00:00`),r=n.getMonth()===0?n.getFullYear()-1:n.getFullYear();return r===s.getFullYear()?String(s.getFullYear()):`${s.getFullYear()}/${String(r).slice(2)}`}function yt(o,e,t){let s=new Date(`${o.start}T12:00:00`);return e==="day"?s.toLocaleDateString(t,{weekday:"short",day:"numeric",month:"long"}):e==="month"?s.toLocaleDateString(t,{month:"long",year:"numeric"}):Fe(o,e,t)}var se=class extends S{constructor(){super(...arguments);this._kind="month"}static{this.properties={hass:{attribute:!1},_config:{state:!0},_kind:{state:!0},_data:{state:!0},_error:{state:!0}}}setConfig(t){if(!t.entry_id)throw new Error("entry_id is required");this._config=t,this._kind=t.period??"month"}getCardSize(){return 5}getGridOptions(){return{columns:"full",min_rows:4}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._fetch(!0),ft)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._timer)}willUpdate(t){(t.has("hass")||t.has("_kind")||t.has("_config"))&&this._fetch(!1)}async _fetch(t){if(!this.hass||!this._config)return;let s=`${this._config.entry_id}:${this._kind}`;if(!(!t&&s===this._fetchedKey)){this._fetchedKey=s;try{this._data=await this.hass.callWS({type:"weheat_insights/performance_history",entry_id:this._config.entry_id,period:this._kind}),this._error=void 0}catch(n){this._error=n instanceof Error?n.message:JSON.stringify(n)}}}render(){if(!this.hass||!this._config)return p;let t=W(this.hass);return f`
      <ha-card>
        <div class="header">
          <div class="title">${this._config.title??t("cop_history")}</div>
          <div class="kinds" role="tablist">
            ${["day","month","season"].map(s=>f`<button
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
    `}_renderBody(t){if(this._error)return f`<div class="message">${this._error}</div>`;let s=this._data;return!s||s.period!==this._kind?f`<div class="message">…</div>`:s.periods.some(n=>n.cop!=null)?f`${this._renderChart(s,t)}${this._renderLegend(s,t)}`:f`<div class="message">${t("no_data")}</div>`}_renderChart(t,s){let n=I(this.hass),r=t.periods.findIndex(d=>d.cop!=null||d.cop_heat_pump!=null),i=t.periods.slice(Math.max(0,r)),l=i.flatMap(d=>[d.cop_heat_pump,d.cop,d.cop_heating,t.has_dhw?d.cop_dhw:null]),a=Math.max(5,Math.ceil(Math.max(...l.map(d=>d??0))+.5)),h=ve-x.left-x.right,m=we-x.top-x.bottom,c=d=>x.top+m-Math.max(0,d)/a*m,g=h/i.length,y=t.has_dhw?2:1,$=Math.max(2,Math.min(28,g*.75/y)),J=a>8?2:1,u=Math.ceil(i.length/12),ke=[];for(let d=0;d<=a;d+=J)ke.push(k`<line class="grid" x1=${x.left} x2=${ve-x.right} y1=${c(d)} y2=${c(d)}></line>
        <text class="axis" x=${x.left-6} y=${c(d)+4} text-anchor="end">${d}</text>`);let Se=(d,P,L)=>d==null?p:k`<rect class=${L} x=${P} y=${c(d)} width=${$} height=${c(0)-c(d)} rx="2"></rect>`,Ee=(d,P,L)=>d==null?p:k`<line class=${L} x1=${P-2} x2=${P+$*y+2} y1=${c(d)} y2=${c(d)}></line>`,Xe=i.map((d,P)=>{let L=x.left+P*g+(g-$*y)/2,et=x.left+P*g+g/2,tt=[yt(d,t.period,n),`${s("heat_pump")}: ${C(d.cop_heat_pump)} (${C(d.heat_kwh,1)} kWh ${s("heat")} / ${C(d.heat_pump_electricity_kwh,1)} kWh ${s("electricity")})`,`${s("total")}: ${C(d.cop)} (+ ${C(d.standby_kwh,1)} kWh ${s("standby").toLowerCase()}, + ${C(d.indoor_unit_kwh,1)} kWh ${s("pumps")})`,`${s("heating")}: ${C(d.cop_heating)} (${C(d.heating_heat_kwh,1)} / ${C(d.heating_electricity_kwh,1)} kWh)`,...t.has_dhw?[`${s("dhw")}: ${C(d.cop_dhw)} (${C(d.dhw_heat_kwh,1)} / ${C(d.dhw_electricity_kwh,1)} kWh)`]:[]].join(`
`);return k`<g>
        <title>${tt}</title>
        <rect class="hit" x=${x.left+P*g} y=${x.top} width=${g} height=${m}></rect>
        ${Se(d.cop_heating,L,"heating")}
        ${t.has_dhw?Se(d.cop_dhw,L+$,"dhw"):p}
        ${Ee(d.cop_heat_pump,L,"heat-pump")}
        ${Ee(d.cop,L,"total")}
        ${P%u===0?k`<text class="axis" x=${et} y=${we-8} text-anchor="middle">${Fe(d,t.period,n)}</text>`:p}
      </g>`});return f`<svg viewBox="0 0 ${ve} ${we}" role="img" aria-label=${s("cop_history")}>
      ${ke}${Xe}
    </svg>`}_renderLegend(t,s){return f`<div class="legend">
      <span><i class="swatch heating"></i>${s("heating")}</span>
      ${t.has_dhw?f`<span><i class="swatch dhw"></i>${s("dhw")}</span>`:p}
      <span><i class="swatch heat-pump"></i>${s("heat_pump")}</span>
      <span><i class="swatch total"></i>${s("total")}</span>
    </div>`}static{this.styles=V`
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
  `}};var R="weheat-insights-scatter-card",be=600,xe=300,w={left:46,right:12,top:12,bottom:40},$t=3600*1e3;function qe(o,e,t=6){if(!isFinite(o)||!isFinite(e))return[];o===e&&(o-=1,e+=1);let s=(e-o)/t,n=10**Math.floor(Math.log10(s)),r=[1,2,2.5,5,10].map(l=>l*n).find(l=>l>=s)??s,i=[];for(let l=Math.floor(o/r)*r;l<=e+r*1e-9;l+=r)i.push(Math.round(l*1e6)/1e6);return i[i.length-1]<e&&i.push(i[i.length-1]+r),i}function vt(o,e,t){return`hsl(${(220-220*(t>e?Math.min(1,Math.max(0,(o-e)/(t-e))):.5)).toFixed(0)} 75% 48%)`}var oe=class extends S{static{this.properties={hass:{attribute:!1},_config:{state:!0},_data:{state:!0},_error:{state:!0}}}setConfig(e){if(!e.entry_id)throw new Error("entry_id is required");if(e.mode!=="heat_loss"&&e.mode!=="supply_curve")throw new Error('mode must be "heat_loss" or "supply_curve"');this._config=e,this._data=void 0}getCardSize(){return 6}getGridOptions(){return{columns:"full",min_rows:5}}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>this._fetch(!0),$t)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._timer)}willUpdate(e){(e.has("hass")||e.has("_config"))&&this._fetch(!1)}async _fetch(e){if(!this.hass||!this._config)return;let{entry_id:t,mode:s,days:n}=this._config,r=`${t}:${s}:${n??""}`;if(!(!e&&r===this._fetchedKey)){this._fetchedKey=r;try{this._data=s==="heat_loss"?await this.hass.callWS({type:"weheat_insights/heat_loss",entry_id:t}):await this.hass.callWS({type:"weheat_insights/supply_curve",entry_id:t,days:n??60}),this._error=void 0}catch(i){this._error=i instanceof Error?i.message:JSON.stringify(i)}}}render(){if(!this.hass||!this._config)return p;let e=W(this.hass),t=this._config.mode==="heat_loss";return f`<ha-card>
      <div class="title">${this._config.title??e(t?"heat_loss_title":"supply_curve_title")}</div>
      ${this._error?f`<div class="message">${this._error}</div>`:this._data?t?this._renderHeatLoss(this._data,e):this._renderSupply(this._data,e):f`<div class="message">…</div>`}
    </ha-card>`}_renderHeatLoss(e,t){let s=I(this.hass),n=new Intl.NumberFormat(s,{maximumFractionDigits:1}),r=e.points.map(a=>({x:a.delta_k,y:a.heating_kwh,cls:a.excluded?"excluded":"used",tip:`${a.day}: ${n.format(a.delta_k)} K, ${n.format(a.heating_kwh)} kWh${a.excluded?` (${t("excluded")})`:""}`})),i=e.fit,l=i?f`<div class="summary">
          <strong>${Math.round(e.coefficient_w_per_k)} ± ${Math.round(e.confidence_95_w_per_k)} W/K</strong>
          · R² ${i.r_squared.toFixed(2)} · ${e.days_used} ${t("days_used")}
        </div>`:f`<div class="summary muted">${e.reason?t(`reason_${e.reason}`):""}</div>`;return f`${l}
      ${this._chart(r,{xLabel:t("indoor_outdoor_diff"),yLabel:t("heating_per_day"),includeZeroY:!0,line:i?a=>i.slope*a+i.intercept:void 0})}
      <div class="legend">
        <span><i class="dot used"></i>${t("used")}</span>
        <span><i class="dot excluded"></i>${t("excluded")}</span>
        ${i?f`<span><i class="line"></i>${t("fit_line")}</span>`:p}
      </div>
      ${e.indoor_assumed?f`<div class="note">${t("indoor_assumed_note")}</div>`:p}`}_renderSupply(e,t){if(!e.points.length)return f`<div class="message">${t("no_data")}</div>`;let s=I(this.hass),n=new Intl.NumberFormat(s,{maximumFractionDigits:1}),r=e.points.map(h=>h.delta_t_k).sort((h,m)=>h-m),i=r[Math.floor(r.length*.05)],l=r[Math.min(r.length-1,Math.floor(r.length*.95))],a=e.points.map(h=>({x:h.outdoor_c,y:h.supply_c,color:vt(h.delta_t_k,i,l),tip:`${new Date(h.time).toLocaleString(s,{dateStyle:"short",timeStyle:"short"})}: ${n.format(h.outdoor_c)} \xB0C \u2192 ${n.format(h.supply_c)} \xB0C, \u0394T ${n.format(h.delta_t_k)} K`}));return f`${this._chart(a,{xLabel:t("outdoor_temp"),yLabel:t("supply_temp")})}
      <div class="legend">
        <span>ΔT ${n.format(i)} K</span>
        <i class="gradient"></i>
        <span>${n.format(l)} K</span>
      </div>`}_chart(e,t){if(!e.length)return f`<div class="message">${W(this.hass)("no_data")}</div>`;let s=e.map(u=>u.x),n=e.map(u=>u.y),r=qe(Math.min(...s),Math.max(...s)),i=qe(t.includeZeroY?Math.min(0,...n):Math.min(...n),Math.max(...n)),[l,a]=[r[0],r[r.length-1]],[h,m]=[i[0],i[i.length-1]],c=be-w.left-w.right,g=xe-w.top-w.bottom,y=u=>w.left+(u-l)/(a-l)*c,$=u=>w.top+g-(u-h)/(m-h)*g,J=u=>Math.min(m,Math.max(h,u));return f`<svg viewBox="0 0 ${be} ${xe}" role="img" aria-label=${t.yLabel}>
      ${i.map(u=>k`<line class="grid" x1=${w.left} x2=${be-w.right} y1=${$(u)} y2=${$(u)}></line>
          <text class="axis" x=${w.left-6} y=${$(u)+4} text-anchor="end">${u}</text>`)}
      ${r.map(u=>k`<line class="grid" x1=${y(u)} x2=${y(u)} y1=${w.top} y2=${w.top+g}></line>
          <text class="axis" x=${y(u)} y=${w.top+g+16} text-anchor="middle">${u}</text>`)}
      <text class="label" x=${w.left+c/2} y=${xe-4} text-anchor="middle">${t.xLabel}</text>
      <text class="label" transform="translate(12 ${w.top+g/2}) rotate(-90)" text-anchor="middle">${t.yLabel}</text>
      ${e.map(u=>k`<circle class=${u.cls??""} cx=${y(u.x)} cy=${$(u.y)} r="3.5" style=${u.color?`fill:${u.color}`:""}>
          <title>${u.tip}</title>
        </circle>`)}
      ${t.line?k`<line class="fit" x1=${y(l)} y1=${$(J(t.line(l)))} x2=${y(a)} y2=${$(J(t.line(a)))}></line>`:p}
    </svg>`}static{this.styles=V`
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
  `}};var E=o=>o.filter(e=>!!e);function b(o,e){return{type:"heading",heading:o,heading_style:"title",...e?{icon:e}:{}}}function _(o,e){return o?{type:"tile",entity:o,name:e}:null}function v(o,e){return o?{entity:o,name:e}:null}function ne(o,e,t){return e.length?{type:"history-graph",title:o,hours_to_show:t,entities:e,grid_options:{columns:"full"}}:null}function Ce(o,e,t){return e.length?{type:"statistics-graph",title:o,entities:e,days_to_show:t,period:"hour",stat_types:["mean"],chart_type:"line",grid_options:{columns:"full"}}:null}function A(o,e,t=!1){let s=E(o);return s.length<=(t?0:1)?null:{type:"grid",cards:s,...e?{column_span:e}:{}}}function re(o,e,t,s){return e.length?{type:"statistics-graph",title:o,entities:e,period:t,days_to_show:s,stat_types:["change"],chart_type:"bar",grid_options:{columns:"full"}}:null}var wt=["heating","dhw","legionella_prevention"];function bt(o,e,t){if(!o)return null;let s={type:"gauge",entity:o,name:t("cop"),min:0,max:7,needle:!0,severity:{red:0,yellow:3,green:4}};return e?{type:"conditional",conditions:[{condition:"state",entity:e,state:wt}],card:s}:s}function xt(o){return o.indoor_entity_id??o.weheat.thermostat_room_temperature}function Ct(o,e,t){let s=o.weheat,n=xt(o),r=o.outdoor_entity_id??s.outside_temperature,i=E([v(s.water_outlet_temperature,e("supply")),v(s.water_inlet_temperature,e("return")),v(r,e("outdoor")),v(n,e("room"))]),l=E([v(s.power_input,e("power_input")),v(s.power_output,e("power_output"))]),a=E([v(o.insights.delta_t,e("delta_t"))]),h=A([b(e("live"),"mdi:heat-pump"),_(s.heat_pump_state,e("state")),bt(s.cop,s.heat_pump_state,e),_(n,e("room")),_(r,e("outdoor")),_(s.water_outlet_temperature,e("supply")),_(s.water_inlet_temperature,e("return")),_(o.insights.delta_t,e("delta_t_short")),_(s.power_input,e("power_input_short")),_(s.power_output,e("power_output_short"))]),m=A([b(e("last_24h"),"mdi:clock-outline"),ne(e("temperatures"),i,24),ne(e("power"),l,24),ne(e("delta_t"),a,24),ne(e("state"),E([v(s.heat_pump_state,e("state"))]),24)]),c=A([b(e("last_7d"),"mdi:calendar-week"),Ce(e("temperatures"),i,7),Ce(e("power"),l,7),Ce(e("delta_t"),a,7)]);return{title:o.name,path:t===0?"heat-pump":`heat-pump-${t+1}`,icon:"mdi:heat-pump-outline",type:"sections",max_columns:3,sections:E([h,m,c])}}function At(o,e,t){let s=o.weheat,n=o.insights,r=A([b(e("scop_heading"),"mdi:chart-bar"),_(n.scop_heat_pump_season,e("heat_pump")),_(n.scop_season,e("total")),_(n.scop_heating_season,e("heating")),_(n.scop_dhw_season,e("dhw")),_(n.defrost_cop_impact_season,e("defrost_loss")),b(e("cop_month"),"mdi:calendar-month"),_(n.cop_heat_pump_month,e("heat_pump")),_(n.cop_month,e("total")),b(e("cop_today"),"mdi:calendar-today"),_(n.cop_heat_pump_today,e("heat_pump")),_(n.cop_today,e("total"))]),i=A([{type:`custom:${N}`,entry_id:o.entry_id}],2,!0),l=A([b(e("energy_per_day"),"mdi:lightning-bolt"),re(`${e("energy_per_day")} \xB7 ${e("electricity")}`,E([v(s.electricity_used_heating,e("heating")),v(s.electricity_used_dhw,e("dhw")),v(s.electricity_used_defrost,e("defrost")),v(s.electricity_used_standby,e("standby"))]),"day",30),re(`${e("energy_per_day")} \xB7 ${e("heat")}`,E([v(s.energy_output_heating,e("heating")),v(s.energy_output_dhw,e("dhw")),v(s.energy_output_defrost,e("defrost"))]),"day",30)],2),a=A([b(e("title"),"mdi:information-outline"),{type:"markdown",content:`${e("definitions")}

_${e("disclaimer")}_`}]);return{title:`${o.name} \xB7 ${e("performance")}`,path:t===0?"performance":`performance-${t+1}`,icon:"mdi:chart-bar",type:"sections",max_columns:4,sections:E([r,i,l,a])}}function kt(o,e,t){let s=o.insights,n=A([b(e("house"),"mdi:home-thermometer"),_(s.heat_loss_coefficient,e("heat_loss_short")),_(s.heat_loss_design_load,e("heat_loss_design")),_(s.balance_point,e("balance_point")),_(s.cool_down_time_constant,e("cool_down_tau")),_(s.cool_down_rate,e("cool_down_rate")),_(s.thermal_mass,e("thermal_mass"))]),r=A([{type:`custom:${R}`,entry_id:o.entry_id,mode:"heat_loss"}],2,!0),i=A([b(e("heating_curve"),"mdi:chart-bell-curve-cumulative"),{type:`custom:${R}`,entry_id:o.entry_id,mode:"supply_curve",days:60}],2),l=A([b(e("title"),"mdi:information-outline"),{type:"markdown",content:`${e("house_definitions")}

_${e("disclaimer")}_`}]),a=o.degree_days_statistic_id?{entity:o.degree_days_statistic_id,name:e("degree_days")}:null,h=A([b(e("heat_per_degree_day"),"mdi:home-thermometer-outline"),_(s.heat_per_degree_day_season,e("this_season")),_(s.heat_per_degree_day_last_year,e("last_year_to_date")),_(s.heat_per_degree_day_last_season,e("whole_last_season")),b(e("degree_days"),"mdi:thermometer-lines"),_(s.degree_days_month,e("this_month")),_(s.degree_days_season,e("this_season")),a?re(e("degree_days_per_month"),[a],"month",400):null,a?re(e("degree_days_per_day"),[a],"day",30):null]);return{title:`${o.name} \xB7 ${e("house")}`,path:t===0?"house":`house-${t+1}`,icon:"mdi:home-thermometer-outline",type:"sections",max_columns:4,sections:E([n,r,h,i,l])}}function Ye(o,e,t){return{title:o("title"),path:"weheat-insights",type:"panel",cards:[{type:"markdown",content:`## ${e}

${t}

_${o("disclaimer")}_`}]}}function Ze(o,e){return o.length?{title:e("title"),views:o.flatMap((t,s)=>[At(t,e,s),kt(t,e,s),Ct(t,e,s)])}:{title:e("title"),views:[Ye(e,e("no_pumps_title"),e("no_pumps_body"))]}}function Je(o,e){return{title:o("title"),views:[Ye(o,o("error_title"),`${o("error_body")}

\`${e}\``)]}}var Qe="ll-strategy-dashboard-weheat-insights",Ae=class extends HTMLElement{static async generate(e,t){let s=W(t);try{let n=await t.callWS({type:"weheat_insights/dashboard_config"});return Ze(n.heat_pumps,s)}catch(n){let r=n instanceof Error?n.message:JSON.stringify(n);return Je(s,r)}}};customElements.get(Qe)||customElements.define(Qe,Ae);customElements.get(N)||customElements.define(N,se);customElements.get(R)||customElements.define(R,oe);window.customCards=window.customCards??[];window.customCards.some(o=>o.type===N)||window.customCards.push({type:N,name:"Weheat Insights performance",description:"COP per day, month or season for heating and hot water (unofficial)"});window.customCards.some(o=>o.type===R)||window.customCards.push({type:R,name:"Weheat Insights scatter",description:"Heat loss of the house or supply vs outdoor temperature (unofficial)"});window.customStrategies=window.customStrategies??[];window.customStrategies.some(o=>o.type==="weheat-insights")||window.customStrategies.push({type:"weheat-insights",strategyType:"dashboard",name:"Weheat Insights",description:"Live overview and history for Weheat heat pumps (unofficial)"});
