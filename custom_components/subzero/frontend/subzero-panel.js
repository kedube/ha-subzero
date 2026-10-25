var Po=globalThis,Lo=Po.ShadowRoot&&(Po.ShadyCSS===void 0||Po.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Xr=Symbol(),Wa=new WeakMap,Pn=class{constructor(t,n,o){if(this._$cssResult$=!0,o!==Xr)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o,n=this.t;if(Lo&&t===void 0){let o=n!==void 0&&n.length===1;o&&(t=Wa.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&Wa.set(n,t))}return t}toString(){return this.cssText}},Za=e=>new Pn(typeof e=="string"?e:e+"",void 0,Xr),de=(e,...t)=>{let n=e.length===1?e[0]:t.reduce((o,r,i)=>o+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[i+1],e[0]);return new Pn(n,e,Xr)},qa=(e,t)=>{if(Lo)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(let n of t){let o=document.createElement("style"),r=Po.litNonce;r!==void 0&&o.setAttribute("nonce",r),o.textContent=n.cssText,e.appendChild(o)}},Qr=Lo?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(let o of t.cssRules)n+=o.cssText;return Za(n)})(e):e;var{is:Xd,defineProperty:Qd,getOwnPropertyDescriptor:Jd,getOwnPropertyNames:eu,getOwnPropertySymbols:tu,getPrototypeOf:nu}=Object,Oo=globalThis,Ya=Oo.trustedTypes,ou=Ya?Ya.emptyScript:"",ru=Oo.reactiveElementPolyfillSupport,Ln=(e,t)=>e,Jr={toAttribute(e,t){switch(t){case Boolean:e=e?ou:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Qa=(e,t)=>!Xd(e,t),Xa={attribute:!0,type:String,converter:Jr,reflect:!1,useDefault:!1,hasChanged:Qa};Symbol.metadata??=Symbol("metadata"),Oo.litPropertyMetadata??=new WeakMap;var xt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=Xa){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){let o=Symbol(),r=this.getPropertyDescriptor(t,o,n);r!==void 0&&Qd(this.prototype,t,r)}}static getPropertyDescriptor(t,n,o){let{get:r,set:i}=Jd(this.prototype,t)??{get(){return this[n]},set(a){this[n]=a}};return{get:r,set(a){let s=r?.call(this);i?.call(this,a),this.requestUpdate(t,s,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Xa}static _$Ei(){if(this.hasOwnProperty(Ln("elementProperties")))return;let t=nu(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ln("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ln("properties"))){let n=this.properties,o=[...eu(n),...tu(n)];for(let r of o)this.createProperty(r,n[r])}let t=this[Symbol.metadata];if(t!==null){let n=litPropertyMetadata.get(t);if(n!==void 0)for(let[o,r]of n)this.elementProperties.set(o,r)}this._$Eh=new Map;for(let[n,o]of this.elementProperties){let r=this._$Eu(n,o);r!==void 0&&this._$Eh.set(r,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let n=[];if(Array.isArray(t)){let o=new Set(t.flat(1/0).reverse());for(let r of o)n.unshift(Qr(r))}else t!==void 0&&n.push(Qr(t));return n}static _$Eu(t,n){let o=n.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,n=this.constructor.elementProperties;for(let o of n.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return qa(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,o){this._$AK(t,o)}_$ET(t,n){let o=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,o);if(r!==void 0&&o.reflect===!0){let i=(o.converter?.toAttribute!==void 0?o.converter:Jr).toAttribute(n,o.type);this._$Em=t,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(t,n){let o=this.constructor,r=o._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let i=o.getPropertyOptions(r),a=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Jr;this._$Em=r;let s=a.fromAttribute(n,i.type);this[r]=s??this._$Ej?.get(r)??s,this._$Em=null}}requestUpdate(t,n,o,r=!1,i){if(t!==void 0){let a=this.constructor;if(r===!1&&(i=this[t]),o??=a.getPropertyOptions(t),!((o.hasChanged??Qa)(i,n)||o.useDefault&&o.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,o))))return;this.C(t,n,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:o,reflect:r,wrapped:i},a){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??n??this[t]),i!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||o||(n=void 0),this._$AL.set(t,n)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,i]of this._$Ep)this[r]=i;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[r,i]of o){let{wrapped:a}=i,s=this[r];a!==!0||this._$AL.has(r)||s===void 0||this.C(r,void 0,i,s)}}let t=!1,n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(n)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};xt.elementStyles=[],xt.shadowRootOptions={mode:"open"},xt[Ln("elementProperties")]=new Map,xt[Ln("finalized")]=new Map,ru?.({ReactiveElement:xt}),(Oo.reactiveElementVersions??=[]).push("2.1.2");var ti=globalThis,Ja=e=>e,Vo=ti.trustedTypes,es=Vo?Vo.createPolicy("lit-html",{createHTML:e=>e}):void 0,ni="$lit$",zt=`lit$${Math.random().toFixed(9).slice(2)}$`,oi="?"+zt,iu=`<${oi}>`,Jt=document,Vn=()=>Jt.createComment(""),Hn=e=>e===null||typeof e!="object"&&typeof e!="function",ri=Array.isArray,as=e=>ri(e)||typeof e?.[Symbol.iterator]=="function",ei=`[ 	
\f\r]`,On=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ts=/-->/g,ns=/>/g,Xt=RegExp(`>|${ei}(?:([^\\s"'>=/]+)(${ei}*=${ei}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),os=/'/g,rs=/"/g,ss=/^(?:script|style|textarea|title)$/i,ii=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),A=ii(1),f=ii(2),Yg=ii(3),St=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),is=new WeakMap,Qt=Jt.createTreeWalker(Jt,129);function ls(e,t){if(!ri(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return es!==void 0?es.createHTML(t):t}var cs=(e,t)=>{let n=e.length-1,o=[],r,i=t===2?"<svg>":t===3?"<math>":"",a=On;for(let s=0;s<n;s++){let l=e[s],p,d,u=-1,h=0;for(;h<l.length&&(a.lastIndex=h,d=a.exec(l),d!==null);)h=a.lastIndex,a===On?d[1]==="!--"?a=ts:d[1]!==void 0?a=ns:d[2]!==void 0?(ss.test(d[2])&&(r=RegExp("</"+d[2],"g")),a=Xt):d[3]!==void 0&&(a=Xt):a===Xt?d[0]===">"?(a=r??On,u=-1):d[1]===void 0?u=-2:(u=a.lastIndex-d[2].length,p=d[1],a=d[3]===void 0?Xt:d[3]==='"'?rs:os):a===rs||a===os?a=Xt:a===ts||a===ns?a=On:(a=Xt,r=void 0);let g=a===Xt&&e[s+1].startsWith("/>")?" ":"";i+=a===On?l+iu:u>=0?(o.push(p),l.slice(0,u)+ni+l.slice(u)+zt+g):l+zt+(u===-2?s:g)}return[ls(e,i+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]},In=class e{constructor({strings:t,_$litType$:n},o){let r;this.parts=[];let i=0,a=0,s=t.length-1,l=this.parts,[p,d]=cs(t,n);if(this.el=e.createElement(p,o),Qt.currentNode=this.el.content,n===2||n===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=Qt.nextNode())!==null&&l.length<s;){if(r.nodeType===1){if(r.hasAttributes())for(let u of r.getAttributeNames())if(u.endsWith(ni)){let h=d[a++],g=r.getAttribute(u).split(zt),y=/([.?@])?(.*)/.exec(h);l.push({type:1,index:i,name:y[2],strings:g,ctor:y[1]==="."?Io:y[1]==="?"?Fo:y[1]==="@"?No:tn}),r.removeAttribute(u)}else u.startsWith(zt)&&(l.push({type:6,index:i}),r.removeAttribute(u));if(ss.test(r.tagName)){let u=r.textContent.split(zt),h=u.length-1;if(h>0){r.textContent=Vo?Vo.emptyScript:"";for(let g=0;g<h;g++)r.append(u[g],Vn()),Qt.nextNode(),l.push({type:2,index:++i});r.append(u[h],Vn())}}}else if(r.nodeType===8)if(r.data===oi)l.push({type:2,index:i});else{let u=-1;for(;(u=r.data.indexOf(zt,u+1))!==-1;)l.push({type:7,index:i}),u+=zt.length-1}i++}}static createElement(t,n){let o=Jt.createElement("template");return o.innerHTML=t,o}};function en(e,t,n=e,o){if(t===St)return t;let r=o!==void 0?n._$Co?.[o]:n._$Cl,i=Hn(t)?void 0:t._$litDirective$;return r?.constructor!==i&&(r?._$AO?.(!1),i===void 0?r=void 0:(r=new i(e),r._$AT(e,n,o)),o!==void 0?(n._$Co??=[])[o]=r:n._$Cl=r),r!==void 0&&(t=en(e,r._$AS(e,t.values),r,o)),t}var Ho=class{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:n},parts:o}=this._$AD,r=(t?.creationScope??Jt).importNode(n,!0);Qt.currentNode=r;let i=Qt.nextNode(),a=0,s=0,l=o[0];for(;l!==void 0;){if(a===l.index){let p;l.type===2?p=new yn(i,i.nextSibling,this,t):l.type===1?p=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(p=new Bo(i,this,t)),this._$AV.push(p),l=o[++s]}a!==l?.index&&(i=Qt.nextNode(),a++)}return Qt.currentNode=Jt,r}p(t){let n=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,n),n+=o.strings.length-2):o._$AI(t[n])),n++}},yn=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,o,r){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=o,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=en(this,t,n),Hn(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==St&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):as(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==w&&Hn(this._$AH)?this._$AA.nextSibling.data=t:this.T(Jt.createTextNode(t)),this._$AH=t}$(t){let{values:n,_$litType$:o}=t,r=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=In.createElement(ls(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===r)this._$AH.p(n);else{let i=new Ho(r,this),a=i.u(this.options);i.p(n),this.T(a),this._$AH=i}}_$AC(t){let n=is.get(t.strings);return n===void 0&&is.set(t.strings,n=new In(t)),n}k(t){ri(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,o,r=0;for(let i of t)r===n.length?n.push(o=new e(this.O(Vn()),this.O(Vn()),this,this.options)):o=n[r],o._$AI(i),r++;r<n.length&&(this._$AR(o&&o._$AB.nextSibling,r),n.length=r)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){let o=Ja(t).nextSibling;Ja(t).remove(),t=o}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},tn=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,o,r,i){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=n,this._$AM=r,this.options=i,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=w}_$AI(t,n=this,o,r){let i=this.strings,a=!1;if(i===void 0)t=en(this,t,n,0),a=!Hn(t)||t!==this._$AH&&t!==St,a&&(this._$AH=t);else{let s=t,l,p;for(t=i[0],l=0;l<i.length-1;l++)p=en(this,s[o+l],n,l),p===St&&(p=this._$AH[l]),a||=!Hn(p)||p!==this._$AH[l],p===w?t=w:t!==w&&(t+=(p??"")+i[l+1]),this._$AH[l]=p}a&&!r&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Io=class extends tn{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}},Fo=class extends tn{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}},No=class extends tn{constructor(t,n,o,r,i){super(t,n,o,r,i),this.type=5}_$AI(t,n=this){if((t=en(this,t,n,0)??w)===St)return;let o=this._$AH,r=t===w&&o!==w||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,i=t!==w&&(o===w||r);r&&this.element.removeEventListener(this.name,this,o),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Bo=class{constructor(t,n,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){en(this,t)}},ps={M:ni,P:zt,A:oi,C:1,L:cs,R:Ho,D:as,V:en,I:yn,H:tn,N:Fo,U:No,B:Io,F:Bo},au=ti.litHtmlPolyfillSupport;au?.(In,yn),(ti.litHtmlVersions??=[]).push("3.3.3");var ds=(e,t,n)=>{let o=n?.renderBefore??t,r=o._$litPart$;if(r===void 0){let i=n?.renderBefore??null;o._$litPart$=r=new yn(t.insertBefore(Vn(),i),i,void 0,n??{})}return r._$AI(e),r};var ai=globalThis,Me=class extends xt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ds(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return St}};Me._$litElement$=!0,Me.finalized=!0,ai.litElementHydrateSupport?.({LitElement:Me});var su=ai.litElementPolyfillSupport;su?.({LitElement:Me});(ai.litElementVersions??=[]).push("4.2.2");var us={"action.cancel_cycle":"Programm abbrechen","action.cancel_schedule":"Abbrechen","action.dismiss":"Best\xE4tigen","action.end":"Beenden","action.reset":"Zur\xFCcksetzen","action.start":"Starten","cavity.left":"Linker Backofen","cavity.lower":"Unterer Backofen","cavity.right":"Rechter Backofen","cavity.single":"Backofen","cavity.upper":"Oberer Backofen","confirm.cancel_cycle":"Sp\xFClgang abbrechen?","confirm.start.left":"Linken Backofen mit {setting} starten?","confirm.start.lower":"Unteren Backofen mit {setting} starten?","confirm.start.right":"Rechten Backofen mit {setting} starten?","confirm.start.single":"Backofen mit {setting} starten?","confirm.start.upper":"Oberen Backofen mit {setting} starten?","confirm.start_dishwasher":"{cycle} am Geschirrsp\xFCler starten?","control.accent_light":"Akzentbeleuchtung","control.air_filter":"Luftfilter","control.air_purification":"Luftreinigung","control.appliance_type":"Ger\xE4tetyp","control.broil_level":"Grillstufe","control.cancel_cycle":"Laufendes Programm","control.cancel_delay":"Geplante Eispause","control.clean_due":"Reinigung f\xE4llig","control.clean_stage":"Reinigungsschritt","control.control_lock":"Bedienungssperre","control.cook_mode":"Betriebsart","control.cook_timer":"Garzeit-Timer","control.crisper_mode":"Gem\xFCsefach-Temperatur","control.cycles_until_cleaning":"Eiszyklen bis zur Reinigung","control.delay_left":"Pause endet in","control.delay_schedule":"Zeitplan","control.delay_start":"Startverz\xF6gerung","control.delayed_shutoff":"Verz\xF6gerte Abschaltung","control.dishwasher_mode":"Modus","control.dispenser":"Innerer Wasserspender","control.door_open_delay":"T\xFCr-offen-Verz\xF6gerung","control.duration":"Dauer","control.end_delay":"Aktuelle Pause","control.extended_dry_on":"Verl\xE4ngertes Trocknen","control.failsafe":"Sicherheitsabschaltung","control.fan":"L\xFCfter","control.fan_sensitivity":"Automatik-Empfindlichkeit","control.fault":"St\xF6rung {code}","control.fault_code":"Code {code}","control.fault_unknown":"St\xF6rung","control.faults":"Aktive St\xF6rungen","control.filter_allowance":"Filter-Nutzungsdauer","control.filter_usage":"Filternutzung","control.gourmet":"Gourmet-Programm","control.halo":"Halo-Licht","control.heated_dry_on":"Extra trocken","control.high_temp_wash_on":"Hochtemperatursp\xFClen","control.high_use_left":"Intensivbetrieb endet in","control.humidity":"Feuchtigkeitsregelung","control.ice_maker":"Eisbereiter","control.key_tones":"Tastent\xF6ne","control.kitchen_timer":"K\xFCchentimer","control.kitchen_timer2":"K\xFCchentimer 2","control.light":"Licht","control.max_ice_left":"Max Eis endet in","control.model":"Modell","control.next_cleaning":"N\xE4chste Reinigung","control.night_mode":"Nachtmodus","control.operating_mode":"Modus","control.power":"Ein/Aus","control.probe":"Kerntemperaturf\xFChler","control.probe_target":"Kerntemperatur-Ziel","control.remote_ready":"Remote Ready","control.remote_start":"Fernstart","control.reset_air_filter":"Luftfilter zur\xFCcksetzen","control.rinse_aid":"Klarsp\xFCler","control.sabbath":"Sabbatmodus","control.sani_rinse_on":"Hygienesp\xFClen","control.schedule_delay":"Neue Eispause","control.service":"Kundendienst","control.shutoff_after":"Abschalten nach","control.softener":"Regeneriersalz","control.starts_in":"Start in","control.status":"Zustand","control.task_light":"Arbeitslicht","control.temperature":"Temperatur","control.time_left":"Restzeit","control.timer_finished":"Timer abgelaufen","control.top_rack_only_on":"Nur oberer Korb","control.uptime":"Betriebszeit","control.wash_cycle":"Sp\xFClprogramm","control.water_filter":"Wasserfilter","control.water_filter_capacity":"Wasserfilter-Kapazit\xE4t","control.wifi":"WLAN-Signal","control.wine_temp_alert":"Temperaturalarm","control.winterized":"Eingewintert","ctl.at":"Startzeit","ctl.brightness":"Helligkeit","ctl.custom":"Eigene","ctl.decrease":"Verringern","ctl.duration":"Dauer","ctl.increase":"Erh\xF6hen","ctl.later":"Sp\xE4ter heute","ctl.minutes":"Minuten","ctl.not_now":"Nicht jetzt","ctl.now":"Jetzt","ctl.off":"Aus","ctl.on":"Ein","ctl.repeat":"T\xE4glich wiederholen","ctl.saving":"Wird gespeichert \u2026","ctl.schedule":"Planen","ctl.set":"Festlegen","ctl.speed":"Stufe {n}","ctl.start":"Beginn","ctl.starts_in":"Beginnt in {time}","ctl.white":"Wei\xDFton","display.starts_at":"Start {time}","event.air_filter_expired":"Luftfilter abgelaufen","event.cavity.cooking_timer_complete":"Garzeit-Timer abgelaufen","event.cavity.cooking_timer_under_one_minute":"Garzeit-Timer l\xE4uft noch eine Minute","event.cavity.door_ajar":"T\xFCr offen","event.cavity.preheated":"Vorheizen abgeschlossen","event.cavity.probe_connected":"Kerntemperaturf\xFChler in Verwendung","event.cavity.probe_target_reached":"Kerntemperatur erreicht","event.cavity.probe_within_ten_degrees":"Kerntemperatur weniger als 10 \xB0F vom Zielwert entfernt","event.cavity.self_clean_complete":"Reinigung abgeschlossen","event.dishwasher_cancelled":"Sp\xFClgang abgebrochen","event.dishwasher_complete":"Sp\xFClgang abgeschlossen","event.dishwasher_paused":"Sp\xFClgang unterbrochen","event.dishwasher_service_required":"Geschirrsp\xFCler-Service erforderlich","event.dishwasher_started":"Sp\xFClgang gestartet","event.fault_notification":"Ger\xE4test\xF6rung","event.feedback_notification":"Feedback-Anfrage","event.freezer_door_ajar":"Gefrierschrankt\xFCr offen","event.freezer_setpoint_changed":"Solltemperatur des Gefrierschranks ge\xE4ndert","event.ice_cleaning_add_descaler":"Reinigungszyklus des Eisbereiters ben\xF6tigt Entkalker","event.ice_cleaning_add_sanitizer":"Reinigungszyklus des Eisbereiters ben\xF6tigt Desinfektionsmittel","event.ice_cleaning_cancelled":"Reinigungszyklus des Eisbereiters abgebrochen","event.ice_cleaning_complete":"Reinigungszyklus des Eisbereiters abgeschlossen","event.ice_cleaning_due_soon":"Reinigungszyklus des Eisbereiters bald f\xE4llig","event.ice_cleaning_required":"Reinigungszyklus des Eisbereiters f\xE4llig","event.ice_maker_door_ajar":"Eisbereitert\xFCr offen","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"K\xFCchentimer 2 abgelaufen","event.kitchen_timer_2_under_one_minute":"K\xFCchentimer 2 l\xE4uft noch eine Minute","event.kitchen_timer_complete":"K\xFCchentimer abgelaufen","event.kitchen_timer_under_one_minute":"K\xFCchentimer l\xE4uft noch eine Minute","event.lower_oven_cooking_timer_complete":"Garzeit-Timer des unteren Backofens abgelaufen","event.lower_oven_cooking_timer_under_one_minute":"Garzeit-Timer des unteren Backofens l\xE4uft noch eine Minute","event.lower_oven_door_ajar":"T\xFCr des unteren Backofens offen","event.lower_oven_preheated":"Vorheizen des unteren Backofens abgeschlossen","event.lower_oven_probe_connected":"Kerntemperaturf\xFChler des unteren Backofens in Verwendung","event.lower_oven_probe_target_reached":"Kerntemperatur im unteren Backofen erreicht","event.lower_oven_probe_within_ten_degrees":"Kerntemperatur im unteren Backofen weniger als 10 \xB0F vom Zielwert entfernt","event.lower_oven_self_clean_complete":"Reinigung des unteren Backofens abgeschlossen","event.oven_cooking_timer_complete":"Garzeit-Timer des Backofens abgelaufen","event.oven_cooking_timer_under_one_minute":"Garzeit-Timer des Backofens l\xE4uft noch eine Minute","event.oven_door_ajar":"Backofent\xFCr offen","event.oven_preheated":"Vorheizen des Backofens abgeschlossen","event.oven_probe_connected":"Kerntemperaturf\xFChler des Backofens in Verwendung","event.oven_probe_target_reached":"Kerntemperatur im Backofen erreicht","event.oven_probe_within_ten_degrees":"Kerntemperatur im Backofen weniger als 10 \xB0F vom Zielwert entfernt","event.oven_self_clean_complete":"Backofenreinigung abgeschlossen","event.oven_service_required":"Backofen-Service erforderlich","event.refrigerator_door_ajar":"K\xFChlschrankt\xFCr offen","event.refrigerator_service_required":"K\xFChlschrank-Service erforderlich","event.refrigerator_setpoint_changed":"Solltemperatur des K\xFChlschranks ge\xE4ndert","event.rinse_aid_low":"Wenig Klarsp\xFCler","event.softener_salt_low":"Wenig Regeneriersalz","event.unknown":"Unbekannt","event.water_filter_expired":"Wasserfilter abgelaufen","event.wine_door_ajar":"Weinschrankt\xFCr offen","event.wine_setpoint_changed":"Solltemperatur des Weinschranks ge\xE4ndert","event.wine_temperature_alert":"Weinschranktemperatur au\xDFerhalb des Bereichs","full.appearance":"Darstellung","full.appliance":"Hausger\xE4t","full.events_error":"Ereignisse konnten nicht geladen werden: {error}","full.events_loading":"Ereignisse werden geladen \u2026","full.failed":"Das hat nicht funktioniert.","full.no_events":"Keine Ereignisse in den letzten 7 Tagen.","full.recent_events":"Letzte Ereignisse","full.refresh":"Aktualisieren","full.refresh_hint":"Liest jetzt den Zustand des Hausger\xE4ts.","full.refreshing":"Wird aktualisiert \u2026","info.air_filter":"Luftfilter","info.cleaning":"Reinigung","info.cycle":"Programm","info.delay":"Eispause","info.ends":"Ende","info.fan":"L\xFCfter","info.filter":"Fettfilter","info.ice_maker":"Eisbereiter","info.light":"Licht","info.mode":"Modus","info.model":"Modell","info.next_cleaning":"N\xE4chste Reinigung","info.options":"Optionen","info.probe":"F\xFChler","info.set_to":"Eingestellt","info.starts":"Start","info.status":"Zustand","info.water_filter":"Wasserfilter","lock.cycle_no_delay":"Dieses Sp\xFClprogramm bietet keine Startverz\xF6gerung.","lock.cycle_no_option":"Dieses Sp\xFClprogramm bietet diese Option nicht.","lock.delay_not_idle":"Die Startverz\xF6gerung l\xE4sst sich nur \xE4ndern, solange der Geschirrsp\xFCler bereit ist oder auf den Start wartet.","lock.proof_light":"Beim G\xE4ren bleibt das Backofenlicht aus.","lock.sabbath":"Der Sabbatmodus ist an. Schalte ihn aus, um dies zu \xE4ndern.","lock.self_clean":"Der Backofen reinigt sich selbst. Er kann nur ausgeschaltet werden.","lock.wash_not_idle":"Sp\xFCloptionen lassen sich nur \xE4ndern, solange der Geschirrsp\xFCler bereit ist.","option.10_hours":"10 Stunden","option.10_minutes":"10 Minuten","option.11_hours":"11 Stunden","option.12_hours":"12 Stunden","option.1_hour":"1 Stunde","option.1_minute":"1 Minute","option.2_hours":"2 Stunden","option.2_minutes":"2 Minuten","option.3_hours":"3 Stunden","option.4_hours":"4 Stunden","option.5_hours":"5 Stunden","option.5_minutes":"5 Minuten","option.6_hours":"6 Stunden","option.7_hours":"7 Stunden","option.8_hours":"8 Stunden","option.9_hours":"9 Stunden","option.add_descaler":"Entkalker einf\xFCllen","option.add_sanitizer":"Desinfektionsmittel einf\xFCllen","option.auto":"Automatik","option.automatic":"Automatisch","option.bake":"Backen","option.bake_stone":"Backstein","option.broil":"Grillen","option.canceling":"Wird abgebrochen","option.child_lock":"Kindersicherung","option.cleaning_complete":"Reinigung abgeschlossen","option.cleaning_reset_flush":"Reinigung zur\xFCcksetzen: Sp\xFClen","option.cleaning_reset_rinse":"Reinigung zur\xFCcksetzen: Nachsp\xFClen","option.convection":"Hei\xDFluft","option.convection_bake":"Hei\xDFluft-Backen","option.convection_broil":"Hei\xDFluft-Grillen","option.convection_roast":"Hei\xDFluft-Braten","option.crystal_and_china":"Kristall und Porzellan","option.dehydrate":"D\xF6rren","option.delayed":"Verz\xF6gert","option.descale_clean":"Entkalken: Reinigen","option.descale_fill":"Entkalken: F\xFCllen","option.descale_flush":"Entkalken: Sp\xFClen","option.descale_rinse":"Entkalken: Nachsp\xFClen","option.disabled":"Deaktiviert","option.done":"Fertig","option.drying":"Trocknet","option.empty_bin":"Beh\xE4lter leeren","option.enabled":"Aktiviert","option.energy":"Eco","option.enhanced":"Erh\xF6ht","option.error":"Fehler","option.extra_quiet":"Extra leise","option.heavy":"Intensiv","option.high":"Hoch","option.high_use":"Intensivbetrieb","option.idle":"Bereit","option.light":"Leicht","option.long_vacation":"Langer Urlaub","option.low":"Niedrig","option.manual":"Manuell","option.manually_clean":"Manuell reinigen","option.max_ice":"Max Eis","option.medium":"Mittel","option.night_ice":"Nacht-Eis","option.none":"Keins","option.normal":"Normal","option.not_cleaning":"Keine Reinigung","option.off":"Aus","option.on":"Ein","option.paused":"Pausiert","option.plastics":"Kunststoffe","option.pots_and_pans":"T\xF6pfe und Pfannen","option.proof":"G\xE4ren","option.quick":"Kurz","option.rinse_and_hold":"Vorsp\xFClen","option.roast":"Braten","option.running":"L\xE4uft","option.sabbath":"Sabbat","option.sanitize_clean":"Desinfizieren: Reinigen","option.sanitize_fill":"Desinfizieren: F\xFCllen","option.sanitize_flush":"Desinfizieren: Sp\xFClen","option.sanitize_rinse":"Desinfizieren: Nachsp\xFClen","option.self_clean":"Selbstreinigung","option.short_vacation":"Kurzurlaub","option.soak_and_scrub":"Einweichen und Schrubben","option.warm":"Warmhalten","pill.cleaning":"Reinigung","pill.cleaning_due":"Reinigung f\xE4llig","pill.cooking":"Gart","pill.delayed_shutoff":"Verz\xF6gerte Abschaltung","pill.door_open":"T\xFCr offen","pill.fan":"L\xFCfter {speed}","pill.high_use":"Intensivbetrieb","pill.light":"Licht an","pill.making_ice":"Macht Eis","pill.normal":"Normalbetrieb","pill.off":"Aus","pill.offline":"Offline","pill.paused":"Pausiert","pill.preheated":"Vorgeheizt","pill.preheating":"Heizt vor {pct} %","pill.remote_ready":"Remote Ready","pill.sabbath":"Sabbat","pill.self_clean":"Selbstreinigung","pill.service":"Kundendienst","pill.temp_alert":"Temperaturalarm","pill.timer":"Timer {time}","pill.timer_done":"Timer abgelaufen","pill.vacation":"Urlaub","reason.choose_mode":"W\xE4hle zuerst eine Betriebsart.","reason.close_door":"Schlie\xDFe zuerst die T\xFCr.","reason.close_oven_door":"Schlie\xDFe zuerst die Backofent\xFCr.","reason.crisper_auto":"Stelle das Gem\xFCsefach auf Manuell, um dies zu \xE4ndern.","reason.dishwasher_busy":"Nur \xE4nderbar, solange der Geschirrsp\xFCler bereit ist.","reason.manual_mode":"Starte diese Betriebsart am Backofen.","reason.max_ice":"Schalte Max Eis aus, um die Gefriertemperatur zu \xE4ndern.","reason.mode_change_disabled":"Der Backofen nimmt gerade keinen Wechsel der Betriebsart an.","reason.no_temperature":"Diese Betriebsart hat keine einstellbare Temperatur.","reason.offline":"Das Hausger\xE4t ist offline.","reason.oven_not_ready":"Verf\xFCgbar, solange der Backofen l\xE4uft oder in Remote Ready ist.","reason.remote_ready_dishwasher":"Schalte zuerst Remote Ready am Geschirrsp\xFCler ein.","reason.remote_ready_oven":"Schalte Remote Ready am Backofen ein, um ihn von hier zu starten.","reason.set_temperature":"Stelle zuerst die Temperatur ein.","reason.start_at_oven":"Schalte ihn am Backofen ein.","reason.unavailable":"Gerade nicht verf\xFCgbar.","reason.use_start":"Schalte ihn unten mit Starten ein.","section.cleaning":"Reinigung","section.cycle":"Sp\xFClgang","section.delayed_shutoff":"Verz\xF6gerte Abschaltung","section.details":"Einzelheiten","section.fan_light":"L\xFCfter und Licht","section.filters":"Filter und Wartung","section.ice_delay":"Eispause","section.ice_maker":"Eisbereiter","section.maintenance":"Wartung","section.modes":"Modi","section.options":"Optionen","section.settings":"Einstellungen","section.temperatures":"Temperaturen","severity.critical":"Kritisch","severity.high":"Hoch","severity.low":"Niedrig","severity.medium":"Mittel","severity.undefined":"Nicht angegeben","severity.unknown":"Unbekannt","severity.urgent":"Dringend","unit.days":"{n} T","unit.days_hours":"{d} T {h} Std.","unit.hours":"{n} Std.","unit.hours_minutes":"{h} Std. {m} Min.","unit.minutes":"{n} Min.","value.alert":"Alarm","value.daily_for":"T\xE4glich f\xFCr {duration}","value.daily_from":"T\xE4glich ab {time} f\xFCr {duration}","value.done":"Fertig","value.door_open":"T\xFCr offen","value.due_now":"Jetzt","value.due_soon":"Bald","value.ends_at":"Endet um {time}","value.from_for":"Ab {time} f\xFCr {duration}","value.in_cycles":"In {n} Zyklen","value.inserted":"Eingesetzt","value.low":"Niedrig","value.missing":"Fehlt","value.no_faults":"Keine","value.none":"Keine","value.normal":"Unauff\xE4llig","value.not_connected":"Nicht eingesteckt","value.not_due":"Noch nicht","value.not_needed":"Nicht n\xF6tig","value.now":"Aktuell {temp}","value.off":"Aus","value.ok":"In Ordnung","value.on":"Ein","value.percent_used":"{pct} % verbraucht","value.probe_close":"Weniger als 10 \xB0F vom Ziel","value.probe_done":"Ziel erreicht","value.replace":"Wechseln","value.required":"Erforderlich","value.speed":"Stufe {speed}","value.under_minute":"Unter einer Minute","value.until":"Bis {time}","wifi.excellent":"Ausgezeichnet","wifi.fair":"M\xE4\xDFig","wifi.good":"Gut","wifi.weak":"Schwach","zone.crisp":"Gem\xFCsefach","zone.frz":"Gefrierschrank","zone.ref":"K\xFChlschrank","zone.ref2":"K\xFChlschublade","zone.short.crisp":"Gem\xFCsefach","zone.short.frz":"Gefrierschrank","zone.short.ref":"K\xFChlschrank","zone.short.ref2":"Schublade","zone.short.wine":"Wein","zone.short.wine_lower":"Unten","zone.short.wine_upper":"Oben","zone.wine":"Weinschrank","zone.wine_lower":"Untere Zone","zone.wine_upper":"Obere Zone"};var fs={"action.cancel_cycle":"Cancel cycle","action.cancel_schedule":"Cancel","action.dismiss":"Dismiss","action.end":"End","action.reset":"Reset","action.start":"Start","cavity.left":"Left oven","cavity.lower":"Lower oven","cavity.right":"Right oven","cavity.single":"Oven","cavity.upper":"Upper oven","confirm.cancel_cycle":"Cancel the wash cycle?","confirm.start.left":"Start the left oven at {setting}?","confirm.start.lower":"Start the lower oven at {setting}?","confirm.start.right":"Start the right oven at {setting}?","confirm.start.single":"Start the oven at {setting}?","confirm.start.upper":"Start the upper oven at {setting}?","confirm.start_dishwasher":"Start {cycle} on the dishwasher?","control.accent_light":"Accent light","control.air_filter":"Air filter","control.air_purification":"Air purification","control.appliance_type":"Appliance type","control.broil_level":"Broil level","control.cancel_cycle":"Current cycle","control.cancel_delay":"Ice delay schedule","control.clean_due":"Cleaning due","control.clean_stage":"Cleaning stage","control.control_lock":"Control lock","control.cook_mode":"Cooking mode","control.cook_timer":"Cooking timer","control.crisper_mode":"Crisper temperature","control.cycles_until_cleaning":"Ice cycles until cleaning","control.delay_left":"Delay ends in","control.delay_schedule":"Schedule","control.delay_start":"Delay start","control.delayed_shutoff":"Delayed shutoff","control.dishwasher_mode":"Mode","control.dispenser":"Internal water dispenser","control.door_open_delay":"Door open delay","control.duration":"Duration","control.end_delay":"Current delay","control.extended_dry_on":"Extended dry","control.failsafe":"Failsafe","control.fan":"Fan","control.fan_sensitivity":"Automatic fan sensitivity","control.fault":"Fault {code}","control.fault_code":"Code {code}","control.fault_unknown":"Fault","control.faults":"Active faults","control.filter_allowance":"Filter allowance","control.filter_usage":"Filter usage","control.gourmet":"Gourmet","control.halo":"Halo light","control.heated_dry_on":"Extra dry","control.high_temp_wash_on":"High temp wash","control.high_use_left":"High use ends in","control.humidity":"Humidity control","control.ice_maker":"Ice maker","control.key_tones":"Button tones","control.kitchen_timer":"Kitchen timer","control.kitchen_timer2":"Kitchen timer 2","control.light":"Light","control.max_ice_left":"Max ice ends in","control.model":"Model","control.next_cleaning":"Next cleaning","control.night_mode":"Night mode","control.operating_mode":"Mode","control.power":"Power","control.probe":"Probe","control.probe_target":"Probe target","control.remote_ready":"Remote Ready","control.remote_start":"Remote start","control.reset_air_filter":"Reset air filter","control.rinse_aid":"Rinse aid","control.sabbath":"Sabbath mode","control.sani_rinse_on":"Sani-rinse","control.schedule_delay":"New ice delay","control.service":"Service","control.shutoff_after":"Shut off after","control.softener":"Softener salt","control.starts_in":"Starts in","control.status":"Status","control.task_light":"Task light","control.temperature":"Temperature","control.time_left":"Time left","control.timer_finished":"Timer finished","control.top_rack_only_on":"Top rack only","control.uptime":"Uptime","control.wash_cycle":"Wash cycle","control.water_filter":"Water filter","control.water_filter_capacity":"Water filter capacity","control.wifi":"Wi-Fi signal","control.wine_temp_alert":"Temperature alert","control.winterized":"Winterized","ctl.at":"Start time","ctl.brightness":"Brightness","ctl.custom":"Custom","ctl.decrease":"Decrease","ctl.duration":"Duration","ctl.increase":"Increase","ctl.later":"Later today","ctl.minutes":"Minutes","ctl.not_now":"Not now","ctl.now":"Now","ctl.off":"Off","ctl.on":"On","ctl.repeat":"Repeat daily","ctl.saving":"Saving\u2026","ctl.schedule":"Schedule","ctl.set":"Set","ctl.speed":"Speed {n}","ctl.start":"Start","ctl.starts_in":"Starts in {time}","ctl.white":"White temperature","display.starts_at":"Starts {time}","event.air_filter_expired":"Air filter expired","event.cavity.cooking_timer_complete":"Cooking timer ended","event.cavity.cooking_timer_under_one_minute":"Cooking timer has one minute remaining","event.cavity.door_ajar":"Door open","event.cavity.preheated":"Preheat complete","event.cavity.probe_connected":"Probe in use","event.cavity.probe_target_reached":"Probe temperature reached","event.cavity.probe_within_ten_degrees":"Probe within 10\xB0F of target","event.cavity.self_clean_complete":"Clean complete","event.dishwasher_cancelled":"Wash cycle canceled","event.dishwasher_complete":"Wash cycle complete","event.dishwasher_paused":"Wash cycle interrupted","event.dishwasher_service_required":"Dishwasher service required","event.dishwasher_started":"Wash cycle started","event.fault_notification":"Appliance fault","event.feedback_notification":"Feedback request","event.freezer_door_ajar":"Freezer door open","event.freezer_setpoint_changed":"Freezer setpoint changed","event.ice_cleaning_add_descaler":"Ice maker clean cycle needs descaler","event.ice_cleaning_add_sanitizer":"Ice maker clean cycle needs sanitizer","event.ice_cleaning_cancelled":"Ice maker clean cycle canceled","event.ice_cleaning_complete":"Ice maker clean cycle complete","event.ice_cleaning_due_soon":"Ice maker clean cycle due soon","event.ice_cleaning_required":"Ice maker clean cycle due","event.ice_maker_door_ajar":"Ice maker door open","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"Kitchen timer 2 ended","event.kitchen_timer_2_under_one_minute":"Kitchen timer 2 has one minute remaining","event.kitchen_timer_complete":"Kitchen timer ended","event.kitchen_timer_under_one_minute":"Kitchen timer has one minute remaining","event.lower_oven_cooking_timer_complete":"Lower oven cooking timer ended","event.lower_oven_cooking_timer_under_one_minute":"Lower oven cooking timer has one minute remaining","event.lower_oven_door_ajar":"Lower oven door open","event.lower_oven_preheated":"Lower oven preheat complete","event.lower_oven_probe_connected":"Lower oven probe in use","event.lower_oven_probe_target_reached":"Lower oven probe temperature reached","event.lower_oven_probe_within_ten_degrees":"Lower oven probe within 10\xB0F of target","event.lower_oven_self_clean_complete":"Lower oven clean complete","event.oven_cooking_timer_complete":"Oven cooking timer ended","event.oven_cooking_timer_under_one_minute":"Oven cooking timer has one minute remaining","event.oven_door_ajar":"Oven door open","event.oven_preheated":"Oven preheat complete","event.oven_probe_connected":"Oven probe in use","event.oven_probe_target_reached":"Oven probe temperature reached","event.oven_probe_within_ten_degrees":"Oven probe within 10\xB0F of target","event.oven_self_clean_complete":"Oven clean complete","event.oven_service_required":"Oven service required","event.refrigerator_door_ajar":"Refrigerator door open","event.refrigerator_service_required":"Refrigerator service required","event.refrigerator_setpoint_changed":"Refrigerator setpoint changed","event.rinse_aid_low":"Rinse aid low","event.softener_salt_low":"Water softener salt low","event.unknown":"Unknown","event.water_filter_expired":"Water filter expired","event.wine_door_ajar":"Wine storage door open","event.wine_setpoint_changed":"Wine storage setpoint changed","event.wine_temperature_alert":"Wine storage temperature out of range","full.appearance":"Appearance","full.appliance":"Appliance","full.events_error":"Couldn't load the events: {error}","full.events_loading":"Loading events\u2026","full.failed":"That didn't work.","full.no_events":"No events in the last 7 days.","full.recent_events":"Recent events","full.refresh":"Refresh","full.refresh_hint":"Reads the appliance's state now.","full.refreshing":"Refreshing\u2026","info.air_filter":"Air filter","info.cleaning":"Cleaning","info.cycle":"Cycle","info.delay":"Ice delay","info.ends":"Ends","info.fan":"Fan","info.filter":"Filter","info.ice_maker":"Ice maker","info.light":"Light","info.mode":"Mode","info.model":"Model","info.next_cleaning":"Next cleaning","info.options":"Options","info.probe":"Probe","info.set_to":"Set to","info.starts":"Starts","info.status":"Status","info.water_filter":"Water filter","lock.cycle_no_delay":"This wash cycle doesn't offer delay start.","lock.cycle_no_option":"This wash cycle doesn't offer this option.","lock.delay_not_idle":"Delay start can change only while the dishwasher is idle or delayed.","lock.proof_light":"The oven light stays off during Proof.","lock.sabbath":"Sabbath mode is on. Turn it off to change this.","lock.self_clean":"The oven is self-cleaning. It can only be turned off.","lock.wash_not_idle":"Wash options can change only while the dishwasher is idle.","option.10_hours":"10 hours","option.10_minutes":"10 minutes","option.11_hours":"11 hours","option.12_hours":"12 hours","option.1_hour":"1 hour","option.1_minute":"1 minute","option.2_hours":"2 hours","option.2_minutes":"2 minutes","option.3_hours":"3 hours","option.4_hours":"4 hours","option.5_hours":"5 hours","option.5_minutes":"5 minutes","option.6_hours":"6 hours","option.7_hours":"7 hours","option.8_hours":"8 hours","option.9_hours":"9 hours","option.add_descaler":"Add descaler","option.add_sanitizer":"Add sanitizer","option.auto":"Auto","option.automatic":"Automatic","option.bake":"Bake","option.bake_stone":"Bake stone","option.broil":"Broil","option.canceling":"Canceling","option.child_lock":"Child lock","option.cleaning_complete":"Cleaning complete","option.cleaning_reset_flush":"Cleaning reset flush","option.cleaning_reset_rinse":"Cleaning reset rinse","option.convection":"Convection","option.convection_bake":"Convection bake","option.convection_broil":"Convection broil","option.convection_roast":"Convection roast","option.crystal_and_china":"Crystal and china","option.dehydrate":"Dehydrate","option.delayed":"Delayed","option.descale_clean":"Descale clean","option.descale_fill":"Descale fill","option.descale_flush":"Descale flush","option.descale_rinse":"Descale rinse","option.disabled":"Disabled","option.done":"Done","option.drying":"Drying","option.empty_bin":"Empty bin","option.enabled":"Enabled","option.energy":"Energy","option.enhanced":"Enhanced","option.error":"Error","option.extra_quiet":"Extra quiet","option.heavy":"Heavy","option.high":"High","option.high_use":"High use","option.idle":"Idle","option.light":"Light","option.long_vacation":"Long vacation","option.low":"Low","option.manual":"Manual","option.manually_clean":"Manually clean","option.max_ice":"Max ice","option.medium":"Medium","option.night_ice":"Night ice","option.none":"None","option.normal":"Normal","option.not_cleaning":"Not cleaning","option.off":"Off","option.on":"On","option.paused":"Paused","option.plastics":"Plastics","option.pots_and_pans":"Pots and pans","option.proof":"Proof","option.quick":"Quick","option.rinse_and_hold":"Rinse and hold","option.roast":"Roast","option.running":"Running","option.sabbath":"Sabbath","option.sanitize_clean":"Sanitize clean","option.sanitize_fill":"Sanitize fill","option.sanitize_flush":"Sanitize flush","option.sanitize_rinse":"Sanitize rinse","option.self_clean":"Self clean","option.short_vacation":"Short vacation","option.soak_and_scrub":"Soak and scrub","option.warm":"Warm","pill.cleaning":"Cleaning","pill.cleaning_due":"Cleaning due","pill.cooking":"Cooking","pill.delayed_shutoff":"Delayed shutoff","pill.door_open":"Door open","pill.fan":"Fan {speed}","pill.high_use":"High use","pill.light":"Light on","pill.making_ice":"Making ice","pill.normal":"Normal","pill.off":"Off","pill.offline":"Offline","pill.paused":"Paused","pill.preheated":"Preheated","pill.preheating":"Preheating {pct}%","pill.remote_ready":"Remote Ready","pill.sabbath":"Sabbath","pill.self_clean":"Self clean","pill.service":"Service","pill.temp_alert":"Temperature alert","pill.timer":"Timer {time}","pill.timer_done":"Timer done","pill.vacation":"Vacation","reason.choose_mode":"Choose a cooking mode first.","reason.close_door":"Close the door first.","reason.close_oven_door":"Close the oven door first.","reason.crisper_auto":"Set the crisper to Manual to change it.","reason.dishwasher_busy":"Can change only while the dishwasher is idle.","reason.manual_mode":"Start this mode at the oven.","reason.max_ice":"Turn off Max ice to change the freezer setpoint.","reason.mode_change_disabled":"The oven isn't taking mode changes right now.","reason.no_temperature":"This mode has no temperature to set.","reason.offline":"The appliance is offline.","reason.oven_not_ready":"Available while the oven is on or in Remote Ready.","reason.remote_ready_dishwasher":"Turn on Remote Ready at the dishwasher first.","reason.remote_ready_oven":"Turn on Remote Ready at the oven to start it from here.","reason.set_temperature":"Set the temperature first.","reason.start_at_oven":"Turn it on at the oven.","reason.unavailable":"Not available right now.","reason.use_start":"Use Start below to turn it on.","section.cleaning":"Cleaning","section.cycle":"Wash cycle","section.delayed_shutoff":"Delayed shutoff","section.details":"Details","section.fan_light":"Fan and light","section.filters":"Filters and maintenance","section.ice_delay":"Ice delay","section.ice_maker":"Ice maker","section.maintenance":"Maintenance","section.modes":"Modes","section.options":"Options","section.settings":"Settings","section.temperatures":"Temperatures","severity.critical":"Critical","severity.high":"High","severity.low":"Low","severity.medium":"Medium","severity.undefined":"Unspecified","severity.unknown":"Unknown","severity.urgent":"Urgent","unit.days":"{n} d","unit.days_hours":"{d} d {h} h","unit.hours":"{n} h","unit.hours_minutes":"{h} h {m} min","unit.minutes":"{n} min","value.alert":"Alert","value.daily_for":"Daily for {duration}","value.daily_from":"Daily from {time} for {duration}","value.done":"Done","value.door_open":"Door open","value.due_now":"Now","value.due_soon":"Soon","value.ends_at":"Ends at {time}","value.from_for":"From {time} for {duration}","value.in_cycles":"In {n} cycles","value.inserted":"Inserted","value.low":"Low","value.missing":"Missing","value.no_faults":"None","value.none":"None","value.normal":"Normal","value.not_connected":"Not connected","value.not_due":"Not yet","value.not_needed":"Not needed","value.now":"Now {temp}","value.off":"Off","value.ok":"OK","value.on":"On","value.percent_used":"{pct}% used","value.probe_close":"Within 10\xB0F of the target","value.probe_done":"Target reached","value.replace":"Replace","value.required":"Required","value.speed":"Speed {speed}","value.under_minute":"Under a minute","value.until":"Until {time}","wifi.excellent":"Excellent","wifi.fair":"Fair","wifi.good":"Good","wifi.weak":"Weak","zone.crisp":"Crisper","zone.frz":"Freezer","zone.ref":"Refrigerator","zone.ref2":"Refrigerator drawer","zone.short.crisp":"Crisper","zone.short.frz":"Freezer","zone.short.ref":"Refrigerator","zone.short.ref2":"Drawer","zone.short.wine":"Wine","zone.short.wine_lower":"Lower","zone.short.wine_upper":"Upper","zone.wine":"Wine storage","zone.wine_lower":"Lower zone","zone.wine_upper":"Upper zone"};var hs={"action.cancel_cycle":"Cancelar ciclo","action.cancel_schedule":"Cancelar","action.dismiss":"Descartar","action.end":"Finalizar","action.reset":"Restablecer","action.start":"Iniciar","cavity.left":"Horno izquierdo","cavity.lower":"Horno inferior","cavity.right":"Horno derecho","cavity.single":"Horno","cavity.upper":"Horno superior","confirm.cancel_cycle":"\xBFCancelar el ciclo de lavado?","confirm.start.left":"\xBFIniciar el horno izquierdo en {setting}?","confirm.start.lower":"\xBFIniciar el horno inferior en {setting}?","confirm.start.right":"\xBFIniciar el horno derecho en {setting}?","confirm.start.single":"\xBFIniciar el horno en {setting}?","confirm.start.upper":"\xBFIniciar el horno superior en {setting}?","confirm.start_dishwasher":"\xBFIniciar {cycle} en el lavavajillas?","control.accent_light":"Luz de acento","control.air_filter":"Filtro de aire","control.air_purification":"Purificaci\xF3n del aire","control.appliance_type":"Tipo de electrodom\xE9stico","control.broil_level":"Nivel de gratinado","control.cancel_cycle":"Ciclo en curso","control.cancel_delay":"Pausa de hielo programada","control.clean_due":"Limpieza pendiente","control.clean_stage":"Fase de limpieza","control.control_lock":"Bloqueo de controles","control.cook_mode":"Modo de cocci\xF3n","control.cook_timer":"Temporizador de cocci\xF3n","control.crisper_mode":"Temperatura del caj\xF3n de verduras","control.cycles_until_cleaning":"Ciclos de hielo hasta la limpieza","control.delay_left":"La pausa termina en","control.delay_schedule":"Programaci\xF3n","control.delay_start":"Inicio diferido","control.delayed_shutoff":"Apagado diferido","control.dishwasher_mode":"Modo","control.dispenser":"Dispensador de agua interior","control.door_open_delay":"Retardo de puerta abierta","control.duration":"Duraci\xF3n","control.end_delay":"Pausa actual","control.extended_dry_on":"Secado prolongado","control.failsafe":"Apagado de seguridad","control.fan":"Ventilador","control.fan_sensitivity":"Sensibilidad autom\xE1tica del ventilador","control.fault":"Aver\xEDa {code}","control.fault_code":"C\xF3digo {code}","control.fault_unknown":"Aver\xEDa","control.faults":"Aver\xEDas activas","control.filter_allowance":"Vida \xFAtil del filtro","control.filter_usage":"Uso del filtro","control.gourmet":"Programa gourmet","control.halo":"Luz halo","control.heated_dry_on":"Secado extra","control.high_temp_wash_on":"Lavado a alta temperatura","control.high_use_left":"El uso intensivo termina en","control.humidity":"Control de humedad","control.ice_maker":"M\xE1quina de hielo","control.key_tones":"Sonidos de botones","control.kitchen_timer":"Temporizador de cocina","control.kitchen_timer2":"Temporizador de cocina 2","control.light":"Luz","control.max_ice_left":"Hielo m\xE1ximo termina en","control.model":"Modelo","control.next_cleaning":"Pr\xF3xima limpieza","control.night_mode":"Modo nocturno","control.operating_mode":"Modo","control.power":"Encendido","control.probe":"Sonda","control.probe_target":"Objetivo de la sonda","control.remote_ready":"Remote Ready","control.remote_start":"Inicio remoto","control.reset_air_filter":"Restablecer el filtro de aire","control.rinse_aid":"Abrillantador","control.sabbath":"Modo sab\xE1tico","control.sani_rinse_on":"Aclarado higi\xE9nico","control.schedule_delay":"Nueva pausa de hielo","control.service":"Servicio t\xE9cnico","control.shutoff_after":"Apagar despu\xE9s de","control.softener":"Sal descalcificadora","control.starts_in":"Empieza en","control.status":"Estado","control.task_light":"Luz de trabajo","control.temperature":"Temperatura","control.time_left":"Tiempo restante","control.timer_finished":"Temporizador terminado","control.top_rack_only_on":"Solo cesta superior","control.uptime":"Tiempo en funcionamiento","control.wash_cycle":"Ciclo de lavado","control.water_filter":"Filtro de agua","control.water_filter_capacity":"Capacidad del filtro de agua","control.wifi":"Se\xF1al wifi","control.wine_temp_alert":"Alerta de temperatura","control.winterized":"Preparado para el invierno","ctl.at":"Hora de inicio","ctl.brightness":"Brillo","ctl.custom":"Personalizado","ctl.decrease":"Bajar","ctl.duration":"Duraci\xF3n","ctl.increase":"Subir","ctl.later":"M\xE1s tarde hoy","ctl.minutes":"Minutos","ctl.not_now":"Ahora no","ctl.now":"Ahora","ctl.off":"Apagado","ctl.on":"Encendido","ctl.repeat":"Repetir a diario","ctl.saving":"Guardando\u2026","ctl.schedule":"Programar","ctl.set":"Aplicar","ctl.speed":"Velocidad {n}","ctl.start":"Inicio","ctl.starts_in":"Empieza en {time}","ctl.white":"Tono de blanco","display.starts_at":"Empieza {time}","event.air_filter_expired":"Filtro de aire caducado","event.cavity.cooking_timer_complete":"Temporizador de cocci\xF3n finalizado","event.cavity.cooking_timer_under_one_minute":"Queda un minuto en el temporizador de cocci\xF3n","event.cavity.door_ajar":"Puerta abierta","event.cavity.preheated":"Precalentamiento completado","event.cavity.probe_connected":"Sonda en uso","event.cavity.probe_target_reached":"Temperatura de la sonda alcanzada","event.cavity.probe_within_ten_degrees":"Sonda a menos de 10 \xB0F del objetivo","event.cavity.self_clean_complete":"Limpieza completada","event.dishwasher_cancelled":"Ciclo de lavado cancelado","event.dishwasher_complete":"Ciclo de lavado completado","event.dishwasher_paused":"Ciclo de lavado interrumpido","event.dishwasher_service_required":"El lavavajillas necesita servicio t\xE9cnico","event.dishwasher_started":"Ciclo de lavado iniciado","event.fault_notification":"Fallo del electrodom\xE9stico","event.feedback_notification":"Solicitud de opini\xF3n","event.freezer_door_ajar":"Puerta del congelador abierta","event.freezer_setpoint_changed":"Temperatura objetivo del congelador cambiada","event.ice_cleaning_add_descaler":"El ciclo de limpieza de la m\xE1quina de hielo necesita desincrustante","event.ice_cleaning_add_sanitizer":"El ciclo de limpieza de la m\xE1quina de hielo necesita desinfectante","event.ice_cleaning_cancelled":"Ciclo de limpieza de la m\xE1quina de hielo cancelado","event.ice_cleaning_complete":"Ciclo de limpieza de la m\xE1quina de hielo completado","event.ice_cleaning_due_soon":"Ciclo de limpieza de la m\xE1quina de hielo pr\xF3ximo","event.ice_cleaning_required":"Ciclo de limpieza de la m\xE1quina de hielo pendiente","event.ice_maker_door_ajar":"Puerta de la m\xE1quina de hielo abierta","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"Temporizador de cocina 2 finalizado","event.kitchen_timer_2_under_one_minute":"Queda un minuto en el temporizador de cocina 2","event.kitchen_timer_complete":"Temporizador de cocina finalizado","event.kitchen_timer_under_one_minute":"Queda un minuto en el temporizador de cocina","event.lower_oven_cooking_timer_complete":"Temporizador de cocci\xF3n del horno inferior finalizado","event.lower_oven_cooking_timer_under_one_minute":"Queda un minuto en el temporizador de cocci\xF3n del horno inferior","event.lower_oven_door_ajar":"Puerta del horno inferior abierta","event.lower_oven_preheated":"Precalentamiento del horno inferior completado","event.lower_oven_probe_connected":"Sonda del horno inferior en uso","event.lower_oven_probe_target_reached":"Temperatura de la sonda del horno inferior alcanzada","event.lower_oven_probe_within_ten_degrees":"Sonda del horno inferior a menos de 10 \xB0F del objetivo","event.lower_oven_self_clean_complete":"Limpieza del horno inferior completada","event.oven_cooking_timer_complete":"Temporizador de cocci\xF3n del horno finalizado","event.oven_cooking_timer_under_one_minute":"Queda un minuto en el temporizador de cocci\xF3n del horno","event.oven_door_ajar":"Puerta del horno abierta","event.oven_preheated":"Precalentamiento del horno completado","event.oven_probe_connected":"Sonda del horno en uso","event.oven_probe_target_reached":"Temperatura de la sonda del horno alcanzada","event.oven_probe_within_ten_degrees":"Sonda del horno a menos de 10 \xB0F del objetivo","event.oven_self_clean_complete":"Limpieza del horno completada","event.oven_service_required":"El horno necesita servicio t\xE9cnico","event.refrigerator_door_ajar":"Puerta del frigor\xEDfico abierta","event.refrigerator_service_required":"El frigor\xEDfico necesita servicio t\xE9cnico","event.refrigerator_setpoint_changed":"Temperatura objetivo del frigor\xEDfico cambiada","event.rinse_aid_low":"Nivel bajo de abrillantador","event.softener_salt_low":"Nivel bajo de sal descalcificadora","event.unknown":"Desconocido","event.water_filter_expired":"Filtro de agua caducado","event.wine_door_ajar":"Puerta de la vinoteca abierta","event.wine_setpoint_changed":"Temperatura objetivo de la vinoteca cambiada","event.wine_temperature_alert":"Temperatura de la vinoteca fuera de rango","full.appearance":"Apariencia","full.appliance":"Electrodom\xE9stico","full.events_error":"No se pudieron cargar los eventos: {error}","full.events_loading":"Cargando eventos\u2026","full.failed":"No funcion\xF3.","full.no_events":"No hay eventos en los \xFAltimos 7 d\xEDas.","full.recent_events":"Eventos recientes","full.refresh":"Actualizar","full.refresh_hint":"Lee ahora el estado del electrodom\xE9stico.","full.refreshing":"Actualizando\u2026","info.air_filter":"Filtro de aire","info.cleaning":"Limpieza","info.cycle":"Ciclo","info.delay":"Pausa de hielo","info.ends":"Termina","info.fan":"Ventilador","info.filter":"Filtro","info.ice_maker":"M\xE1quina de hielo","info.light":"Luz","info.mode":"Modo","info.model":"Modelo","info.next_cleaning":"Pr\xF3xima limpieza","info.options":"Opciones","info.probe":"Sonda","info.set_to":"Ajustado a","info.starts":"Empieza","info.status":"Estado","info.water_filter":"Filtro de agua","lock.cycle_no_delay":"Este ciclo de lavado no ofrece inicio diferido.","lock.cycle_no_option":"Este ciclo de lavado no ofrece esta opci\xF3n.","lock.delay_not_idle":"El inicio diferido solo se puede cambiar con el lavavajillas en espera o diferido.","lock.proof_light":"La luz del horno se mantiene apagada durante la fermentaci\xF3n.","lock.sabbath":"El modo sab\xE1tico est\xE1 activado. Desact\xEDvalo para cambiar esto.","lock.self_clean":"El horno se est\xE1 autolimpiando. Solo se puede apagar.","lock.wash_not_idle":"Las opciones de lavado solo se pueden cambiar con el lavavajillas en espera.","option.10_hours":"10 horas","option.10_minutes":"10 minutos","option.11_hours":"11 horas","option.12_hours":"12 horas","option.1_hour":"1 hora","option.1_minute":"1 minuto","option.2_hours":"2 horas","option.2_minutes":"2 minutos","option.3_hours":"3 horas","option.4_hours":"4 horas","option.5_hours":"5 horas","option.5_minutes":"5 minutos","option.6_hours":"6 horas","option.7_hours":"7 horas","option.8_hours":"8 horas","option.9_hours":"9 horas","option.add_descaler":"A\xF1adir descalcificador","option.add_sanitizer":"A\xF1adir desinfectante","option.auto":"Autom\xE1tico","option.automatic":"Autom\xE1tico","option.bake":"Hornear","option.bake_stone":"Piedra para hornear","option.broil":"Gratinar","option.canceling":"Cancelando","option.child_lock":"Bloqueo infantil","option.cleaning_complete":"Limpieza completada","option.cleaning_reset_flush":"Reinicio de limpieza: vaciado","option.cleaning_reset_rinse":"Reinicio de limpieza: aclarado","option.convection":"Convecci\xF3n","option.convection_bake":"Hornear por convecci\xF3n","option.convection_broil":"Gratinar por convecci\xF3n","option.convection_roast":"Asar por convecci\xF3n","option.crystal_and_china":"Cristal y porcelana","option.dehydrate":"Deshidratar","option.delayed":"Diferido","option.descale_clean":"Descalcificaci\xF3n: limpieza","option.descale_fill":"Descalcificaci\xF3n: llenado","option.descale_flush":"Descalcificaci\xF3n: vaciado","option.descale_rinse":"Descalcificaci\xF3n: aclarado","option.disabled":"Desactivado","option.done":"Terminado","option.drying":"Secando","option.empty_bin":"Vaciar el dep\xF3sito","option.enabled":"Activado","option.energy":"Ahorro de energ\xEDa","option.enhanced":"Reforzado","option.error":"Aver\xEDa","option.extra_quiet":"Extrasilencioso","option.heavy":"Intensivo","option.high":"Alto","option.high_use":"Uso intensivo","option.idle":"En espera","option.light":"Ligero","option.long_vacation":"Vacaciones largas","option.low":"Bajo","option.manual":"Manual","option.manually_clean":"Limpiar a mano","option.max_ice":"Hielo m\xE1ximo","option.medium":"Medio","option.night_ice":"Hielo nocturno","option.none":"Ninguno","option.normal":"Normal","option.not_cleaning":"Sin limpieza","option.off":"Apagado","option.on":"Encendido","option.paused":"En pausa","option.plastics":"Pl\xE1sticos","option.pots_and_pans":"Ollas y sartenes","option.proof":"Fermentar","option.quick":"R\xE1pido","option.rinse_and_hold":"Aclarar y esperar","option.roast":"Asar","option.running":"En marcha","option.sabbath":"Sab\xE1tico","option.sanitize_clean":"Desinfecci\xF3n: limpieza","option.sanitize_fill":"Desinfecci\xF3n: llenado","option.sanitize_flush":"Desinfecci\xF3n: vaciado","option.sanitize_rinse":"Desinfecci\xF3n: aclarado","option.self_clean":"Autolimpieza","option.short_vacation":"Vacaciones cortas","option.soak_and_scrub":"Remojo y fregado","option.warm":"Mantener caliente","pill.cleaning":"Limpiando","pill.cleaning_due":"Limpieza pendiente","pill.cooking":"Cocinando","pill.delayed_shutoff":"Apagado diferido","pill.door_open":"Puerta abierta","pill.fan":"Ventilador {speed}","pill.high_use":"Uso intensivo","pill.light":"Luz encendida","pill.making_ice":"Haciendo hielo","pill.normal":"Normal","pill.off":"Apagado","pill.offline":"Sin conexi\xF3n","pill.paused":"En pausa","pill.preheated":"Precalentado","pill.preheating":"Precalentando {pct} %","pill.remote_ready":"Remote Ready","pill.sabbath":"Sab\xE1tico","pill.self_clean":"Autolimpieza","pill.service":"Servicio t\xE9cnico","pill.temp_alert":"Alerta de temperatura","pill.timer":"Temporizador {time}","pill.timer_done":"Temporizador terminado","pill.vacation":"Vacaciones","reason.choose_mode":"Elige primero un modo de cocci\xF3n.","reason.close_door":"Cierra primero la puerta.","reason.close_oven_door":"Cierra primero la puerta del horno.","reason.crisper_auto":"Pon el caj\xF3n de verduras en Manual para cambiarlo.","reason.dishwasher_busy":"Solo se puede cambiar con el lavavajillas en espera.","reason.manual_mode":"Inicia este modo en el horno.","reason.max_ice":"Desactiva Hielo m\xE1ximo para cambiar la temperatura del congelador.","reason.mode_change_disabled":"Ahora mismo el horno no acepta cambios de modo.","reason.no_temperature":"Este modo no tiene temperatura que ajustar.","reason.offline":"El electrodom\xE9stico est\xE1 sin conexi\xF3n.","reason.oven_not_ready":"Disponible con el horno encendido o en Remote Ready.","reason.remote_ready_dishwasher":"Activa primero Remote Ready en el lavavajillas.","reason.remote_ready_oven":"Activa Remote Ready en el horno para iniciarlo desde aqu\xED.","reason.set_temperature":"Ajusta primero la temperatura.","reason.start_at_oven":"Enci\xE9ndelo en el horno.","reason.unavailable":"No disponible ahora mismo.","reason.use_start":"Usa Iniciar, abajo, para encenderlo.","section.cleaning":"Limpieza","section.cycle":"Ciclo de lavado","section.delayed_shutoff":"Apagado diferido","section.details":"Detalles","section.fan_light":"Ventilador y luz","section.filters":"Filtros y mantenimiento","section.ice_delay":"Pausa de hielo","section.ice_maker":"M\xE1quina de hielo","section.maintenance":"Mantenimiento","section.modes":"Modos","section.options":"Opciones","section.settings":"Ajustes","section.temperatures":"Temperaturas","severity.critical":"Cr\xEDtica","severity.high":"Alta","severity.low":"Baja","severity.medium":"Media","severity.undefined":"Sin especificar","severity.unknown":"Desconocida","severity.urgent":"Urgente","unit.days":"{n} d","unit.days_hours":"{d} d {h} h","unit.hours":"{n} h","unit.hours_minutes":"{h} h {m} min","unit.minutes":"{n} min","value.alert":"Alerta","value.daily_for":"A diario durante {duration}","value.daily_from":"A diario desde {time} durante {duration}","value.done":"Listo","value.door_open":"Puerta abierta","value.due_now":"Ya","value.due_soon":"Pronto","value.ends_at":"Termina {time}","value.from_for":"Desde {time} durante {duration}","value.in_cycles":"En {n} ciclos","value.inserted":"Colocado","value.low":"Bajo","value.missing":"Falta","value.no_faults":"Ninguna","value.none":"Ninguna","value.normal":"Normal","value.not_connected":"No conectada","value.not_due":"Todav\xEDa no","value.not_needed":"No es necesario","value.now":"Ahora {temp}","value.off":"Apagado","value.ok":"Bien","value.on":"Encendido","value.percent_used":"{pct} % usado","value.probe_close":"A menos de 10 \xB0F del objetivo","value.probe_done":"Objetivo alcanzado","value.replace":"Cambiar","value.required":"Necesario","value.speed":"Velocidad {speed}","value.under_minute":"Menos de un minuto","value.until":"Hasta {time}","wifi.excellent":"Excelente","wifi.fair":"Aceptable","wifi.good":"Buena","wifi.weak":"D\xE9bil","zone.crisp":"Caj\xF3n de verduras","zone.frz":"Congelador","zone.ref":"Frigor\xEDfico","zone.ref2":"Caj\xF3n refrigerador","zone.short.crisp":"Verduras","zone.short.frz":"Congelador","zone.short.ref":"Frigor\xEDfico","zone.short.ref2":"Caj\xF3n","zone.short.wine":"Vino","zone.short.wine_lower":"Inferior","zone.short.wine_upper":"Superior","zone.wine":"Vinoteca","zone.wine_lower":"Zona inferior","zone.wine_upper":"Zona superior"};var ms={"action.cancel_cycle":"Annuler le cycle","action.cancel_schedule":"Annuler","action.dismiss":"Acquitter","action.end":"Terminer","action.reset":"R\xE9initialiser","action.start":"D\xE9marrer","cavity.left":"Four gauche","cavity.lower":"Four inf\xE9rieur","cavity.right":"Four droit","cavity.single":"Four","cavity.upper":"Four sup\xE9rieur","confirm.cancel_cycle":"Annuler le cycle de lavage\xA0?","confirm.start.left":"D\xE9marrer le four gauche en {setting}\xA0?","confirm.start.lower":"D\xE9marrer le four inf\xE9rieur en {setting}\xA0?","confirm.start.right":"D\xE9marrer le four droit en {setting}\xA0?","confirm.start.single":"D\xE9marrer le four en {setting}\xA0?","confirm.start.upper":"D\xE9marrer le four sup\xE9rieur en {setting}\xA0?","confirm.start_dishwasher":"D\xE9marrer {cycle} sur le lave-vaisselle\xA0?","control.accent_light":"\xC9clairage d'ambiance","control.air_filter":"Filtre \xE0 air","control.air_purification":"Purification de l'air","control.appliance_type":"Type d'appareil","control.broil_level":"Niveau du gril","control.cancel_cycle":"Cycle en cours","control.cancel_delay":"Pause programm\xE9e","control.clean_due":"Nettoyage \xE0 pr\xE9voir","control.clean_stage":"\xC9tape de nettoyage","control.control_lock":"Verrouillage des commandes","control.cook_mode":"Mode de cuisson","control.cook_timer":"Minuterie de cuisson","control.crisper_mode":"Temp\xE9rature du bac \xE0 l\xE9gumes","control.cycles_until_cleaning":"Cycles de glace avant nettoyage","control.delay_left":"La pause se termine dans","control.delay_schedule":"Programmation","control.delay_start":"D\xE9part diff\xE9r\xE9","control.delayed_shutoff":"Arr\xEAt diff\xE9r\xE9","control.dishwasher_mode":"Mode","control.dispenser":"Distributeur d'eau int\xE9rieur","control.door_open_delay":"D\xE9lai d'alerte de porte ouverte","control.duration":"Dur\xE9e","control.end_delay":"Pause en cours","control.extended_dry_on":"S\xE9chage prolong\xE9","control.failsafe":"Arr\xEAt de s\xE9curit\xE9","control.fan":"Ventilateur","control.fan_sensitivity":"Sensibilit\xE9 automatique du ventilateur","control.fault":"D\xE9faut {code}","control.fault_code":"Code {code}","control.fault_unknown":"D\xE9faut","control.faults":"D\xE9fauts actifs","control.filter_allowance":"Dur\xE9e de vie du filtre","control.filter_usage":"Utilisation du filtre","control.gourmet":"Programme gourmet","control.halo":"\xC9clairage halo","control.heated_dry_on":"S\xE9chage renforc\xE9","control.high_temp_wash_on":"Lavage haute temp\xE9rature","control.high_use_left":"L'utilisation intensive se termine dans","control.humidity":"Contr\xF4le de l'humidit\xE9","control.ice_maker":"Machine \xE0 gla\xE7ons","control.key_tones":"Sons des touches","control.kitchen_timer":"Minuteur de cuisine","control.kitchen_timer2":"Minuteur de cuisine 2","control.light":"\xC9clairage","control.max_ice_left":"Glace max se termine dans","control.model":"Mod\xE8le","control.next_cleaning":"Prochain nettoyage","control.night_mode":"Mode nuit","control.operating_mode":"Mode","control.power":"Marche","control.probe":"Sonde","control.probe_target":"Cible de la sonde","control.remote_ready":"Remote Ready","control.remote_start":"D\xE9marrage \xE0 distance","control.reset_air_filter":"R\xE9initialiser le filtre \xE0 air","control.rinse_aid":"Liquide de rin\xE7age","control.sabbath":"Mode sabbat","control.sani_rinse_on":"Rin\xE7age sanitaire","control.schedule_delay":"Nouvelle pause","control.service":"Entretien","control.shutoff_after":"Arr\xEAt apr\xE8s","control.softener":"Sel r\xE9g\xE9n\xE9rant","control.starts_in":"D\xE9marre dans","control.status":"\xC9tat","control.task_light":"\xC9clairage de travail","control.temperature":"Temp\xE9rature","control.time_left":"Temps restant","control.timer_finished":"Minuteur termin\xE9","control.top_rack_only_on":"Panier sup\xE9rieur seul","control.uptime":"Temps de fonctionnement","control.wash_cycle":"Programme de lavage","control.water_filter":"Filtre \xE0 eau","control.water_filter_capacity":"Capacit\xE9 du filtre \xE0 eau","control.wifi":"Signal Wi-Fi","control.wine_temp_alert":"Alerte de temp\xE9rature","control.winterized":"Hivernage","ctl.at":"Heure de d\xE9but","ctl.brightness":"Luminosit\xE9","ctl.custom":"Autre","ctl.decrease":"Diminuer","ctl.duration":"Dur\xE9e","ctl.increase":"Augmenter","ctl.later":"Plus tard aujourd'hui","ctl.minutes":"Nombre de minutes","ctl.not_now":"Pas maintenant","ctl.now":"Maintenant","ctl.off":"Arr\xEAt","ctl.on":"Marche","ctl.repeat":"R\xE9p\xE9ter chaque jour","ctl.saving":"Enregistrement\u2026","ctl.schedule":"Programmer","ctl.set":"Valider","ctl.speed":"Vitesse {n}","ctl.start":"D\xE9but","ctl.starts_in":"D\xE9marre dans {time}","ctl.white":"Temp\xE9rature de blanc","display.starts_at":"D\xE9part {time}","event.air_filter_expired":"Filtre \xE0 air expir\xE9","event.cavity.cooking_timer_complete":"Minuteur de cuisson termin\xE9","event.cavity.cooking_timer_under_one_minute":"Il reste une minute au minuteur de cuisson","event.cavity.door_ajar":"Porte ouverte","event.cavity.preheated":"Pr\xE9chauffage termin\xE9","event.cavity.probe_connected":"Sonde en cours d'utilisation","event.cavity.probe_target_reached":"Temp\xE9rature de la sonde atteinte","event.cavity.probe_within_ten_degrees":"Sonde \xE0 moins de 10 \xB0F de la cible","event.cavity.self_clean_complete":"Nettoyage termin\xE9","event.dishwasher_cancelled":"Cycle de lavage annul\xE9","event.dishwasher_complete":"Cycle de lavage termin\xE9","event.dishwasher_paused":"Cycle de lavage interrompu","event.dishwasher_service_required":"Entretien du lave-vaisselle requis","event.dishwasher_started":"Cycle de lavage d\xE9marr\xE9","event.fault_notification":"D\xE9faut de l'appareil","event.feedback_notification":"Demande d'avis","event.freezer_door_ajar":"Porte du cong\xE9lateur ouverte","event.freezer_setpoint_changed":"Consigne du cong\xE9lateur modifi\xE9e","event.ice_cleaning_add_descaler":"Le cycle de nettoyage de la machine \xE0 gla\xE7ons n\xE9cessite du d\xE9tartrant","event.ice_cleaning_add_sanitizer":"Le cycle de nettoyage de la machine \xE0 gla\xE7ons n\xE9cessite du d\xE9sinfectant","event.ice_cleaning_cancelled":"Cycle de nettoyage de la machine \xE0 gla\xE7ons annul\xE9","event.ice_cleaning_complete":"Cycle de nettoyage de la machine \xE0 gla\xE7ons termin\xE9","event.ice_cleaning_due_soon":"Cycle de nettoyage de la machine \xE0 gla\xE7ons bient\xF4t requis","event.ice_cleaning_required":"Cycle de nettoyage de la machine \xE0 gla\xE7ons requis","event.ice_maker_door_ajar":"Porte de la machine \xE0 gla\xE7ons ouverte","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"Minuteur de cuisine 2 termin\xE9","event.kitchen_timer_2_under_one_minute":"Il reste une minute au minuteur de cuisine 2","event.kitchen_timer_complete":"Minuteur de cuisine termin\xE9","event.kitchen_timer_under_one_minute":"Il reste une minute au minuteur de cuisine","event.lower_oven_cooking_timer_complete":"Minuteur de cuisson du four inf\xE9rieur termin\xE9","event.lower_oven_cooking_timer_under_one_minute":"Il reste une minute au minuteur de cuisson du four inf\xE9rieur","event.lower_oven_door_ajar":"Porte du four inf\xE9rieur ouverte","event.lower_oven_preheated":"Pr\xE9chauffage du four inf\xE9rieur termin\xE9","event.lower_oven_probe_connected":"Sonde du four inf\xE9rieur en cours d'utilisation","event.lower_oven_probe_target_reached":"Temp\xE9rature de la sonde du four inf\xE9rieur atteinte","event.lower_oven_probe_within_ten_degrees":"Sonde du four inf\xE9rieur \xE0 moins de 10 \xB0F de la cible","event.lower_oven_self_clean_complete":"Nettoyage du four inf\xE9rieur termin\xE9","event.oven_cooking_timer_complete":"Minuteur de cuisson du four termin\xE9","event.oven_cooking_timer_under_one_minute":"Il reste une minute au minuteur de cuisson du four","event.oven_door_ajar":"Porte du four ouverte","event.oven_preheated":"Pr\xE9chauffage du four termin\xE9","event.oven_probe_connected":"Sonde du four en cours d'utilisation","event.oven_probe_target_reached":"Temp\xE9rature de la sonde du four atteinte","event.oven_probe_within_ten_degrees":"Sonde du four \xE0 moins de 10 \xB0F de la cible","event.oven_self_clean_complete":"Nettoyage du four termin\xE9","event.oven_service_required":"Entretien du four requis","event.refrigerator_door_ajar":"Porte du r\xE9frig\xE9rateur ouverte","event.refrigerator_service_required":"Entretien du r\xE9frig\xE9rateur requis","event.refrigerator_setpoint_changed":"Consigne du r\xE9frig\xE9rateur modifi\xE9e","event.rinse_aid_low":"Niveau de liquide de rin\xE7age bas","event.softener_salt_low":"Niveau de sel r\xE9g\xE9n\xE9rant bas","event.unknown":"Inconnu","event.water_filter_expired":"Filtre \xE0 eau expir\xE9","event.wine_door_ajar":"Porte de la cave \xE0 vin ouverte","event.wine_setpoint_changed":"Consigne de la cave \xE0 vin modifi\xE9e","event.wine_temperature_alert":"Temp\xE9rature de la cave \xE0 vin hors plage","full.appearance":"Apparence","full.appliance":"Appareil","full.events_error":"Impossible de charger les \xE9v\xE9nements\xA0: {error}","full.events_loading":"Chargement des \xE9v\xE9nements\u2026","full.failed":"Cela n'a pas fonctionn\xE9.","full.no_events":"Aucun \xE9v\xE9nement ces 7 derniers jours.","full.recent_events":"\xC9v\xE9nements r\xE9cents","full.refresh":"Actualiser","full.refresh_hint":"Lit maintenant l'\xE9tat de l'appareil.","full.refreshing":"Actualisation\u2026","info.air_filter":"Filtre \xE0 air","info.cleaning":"Nettoyage","info.cycle":"Programme","info.delay":"Pause","info.ends":"Fin","info.fan":"Ventilateur","info.filter":"Filtre","info.ice_maker":"Machine \xE0 gla\xE7ons","info.light":"\xC9clairage","info.mode":"Mode","info.model":"Mod\xE8le","info.next_cleaning":"Prochain nettoyage","info.options":"Options","info.probe":"Sonde","info.set_to":"R\xE9gl\xE9 sur","info.starts":"D\xE9part","info.status":"\xC9tat","info.water_filter":"Filtre \xE0 eau","lock.cycle_no_delay":"Ce programme de lavage ne propose pas le d\xE9part diff\xE9r\xE9.","lock.cycle_no_option":"Ce programme de lavage ne propose pas cette option.","lock.delay_not_idle":"Le d\xE9part diff\xE9r\xE9 ne peut \xEAtre modifi\xE9 que lorsque le lave-vaisselle est \xE0 l'arr\xEAt ou en attente.","lock.proof_light":"L'\xE9clairage du four reste \xE9teint pendant la fermentation.","lock.sabbath":"Le mode sabbat est activ\xE9. D\xE9sactivez-le pour modifier ce r\xE9glage.","lock.self_clean":"Le four est en autonettoyage. Il peut seulement \xEAtre \xE9teint.","lock.wash_not_idle":"Les options de lavage ne peuvent \xEAtre modifi\xE9es que lorsque le lave-vaisselle est \xE0 l'arr\xEAt.","option.10_hours":"10 heures","option.10_minutes":"10 min","option.11_hours":"11 heures","option.12_hours":"12 heures","option.1_hour":"1 heure","option.1_minute":"1 min","option.2_hours":"2 heures","option.2_minutes":"2 min","option.3_hours":"3 heures","option.4_hours":"4 heures","option.5_hours":"5 heures","option.5_minutes":"5 min","option.6_hours":"6 heures","option.7_hours":"7 heures","option.8_hours":"8 heures","option.9_hours":"9 heures","option.add_descaler":"Ajouter du d\xE9tartrant","option.add_sanitizer":"Ajouter du d\xE9sinfectant","option.auto":"Automatique","option.automatic":"Automatique","option.bake":"Cuisson","option.bake_stone":"Pierre \xE0 pain","option.broil":"Gril","option.canceling":"Annulation","option.child_lock":"S\xE9curit\xE9 enfants","option.cleaning_complete":"Nettoyage termin\xE9","option.cleaning_reset_flush":"R\xE9initialisation du nettoyage\xA0: vidange","option.cleaning_reset_rinse":"R\xE9initialisation du nettoyage\xA0: rin\xE7age","option.convection":"Chaleur tournante","option.convection_bake":"Cuisson \xE0 convection","option.convection_broil":"Gril \xE0 convection","option.convection_roast":"R\xF4tissage \xE0 convection","option.crystal_and_china":"Cristal et porcelaine","option.dehydrate":"D\xE9shydratation","option.delayed":"Diff\xE9r\xE9","option.descale_clean":"D\xE9tartrage\xA0: nettoyage","option.descale_fill":"D\xE9tartrage\xA0: remplissage","option.descale_flush":"D\xE9tartrage\xA0: vidange","option.descale_rinse":"D\xE9tartrage\xA0: rin\xE7age","option.disabled":"D\xE9sactiv\xE9","option.done":"Termin\xE9","option.drying":"S\xE9chage","option.empty_bin":"Vider le bac","option.enabled":"Activ\xE9","option.energy":"\xC9co","option.enhanced":"Renforc\xE9","option.error":"Erreur","option.extra_quiet":"Extra silencieux","option.heavy":"Intensif","option.high":"\xC9lev\xE9","option.high_use":"Utilisation intensive","option.idle":"\xC0 l'arr\xEAt","option.light":"L\xE9ger","option.long_vacation":"Vacances longues","option.low":"Faible","option.manual":"Manuel","option.manually_clean":"Nettoyer \xE0 la main","option.max_ice":"Glace max","option.medium":"Moyen","option.night_ice":"Glace de nuit","option.none":"Aucun","option.normal":"Normal","option.not_cleaning":"Pas de nettoyage","option.off":"Arr\xEAt","option.on":"Marche","option.paused":"En pause","option.plastics":"Plastiques","option.pots_and_pans":"Casseroles et po\xEAles","option.proof":"Fermentation","option.quick":"Rapide","option.rinse_and_hold":"Rin\xE7age d'attente","option.roast":"R\xF4tissage","option.running":"En marche","option.sabbath":"Sabbat","option.sanitize_clean":"D\xE9sinfection\xA0: nettoyage","option.sanitize_fill":"D\xE9sinfection\xA0: remplissage","option.sanitize_flush":"D\xE9sinfection\xA0: vidange","option.sanitize_rinse":"D\xE9sinfection\xA0: rin\xE7age","option.self_clean":"Autonettoyage","option.short_vacation":"Vacances courtes","option.soak_and_scrub":"Trempage et r\xE9curage","option.warm":"Maintien au chaud","pill.cleaning":"Nettoyage","pill.cleaning_due":"Nettoyage \xE0 pr\xE9voir","pill.cooking":"Cuisson","pill.delayed_shutoff":"Arr\xEAt diff\xE9r\xE9","pill.door_open":"Porte ouverte","pill.fan":"Ventilateur {speed}","pill.high_use":"Utilisation intensive","pill.light":"\xC9clairage allum\xE9","pill.making_ice":"Fabrique de la glace","pill.normal":"Normal","pill.off":"Arr\xEAt","pill.offline":"Hors ligne","pill.paused":"En pause","pill.preheated":"Pr\xE9chauff\xE9","pill.preheating":"Pr\xE9chauffage {pct}\xA0%","pill.remote_ready":"Remote Ready","pill.sabbath":"Sabbat","pill.self_clean":"Autonettoyage","pill.service":"Entretien requis","pill.temp_alert":"Alerte de temp\xE9rature","pill.timer":"Minuteur {time}","pill.timer_done":"Minuteur termin\xE9","pill.vacation":"Vacances","reason.choose_mode":"Choisissez d'abord un mode de cuisson.","reason.close_door":"Fermez d'abord la porte.","reason.close_oven_door":"Fermez d'abord la porte du four.","reason.crisper_auto":"Passez le bac \xE0 l\xE9gumes en Manuel pour le modifier.","reason.dishwasher_busy":"Modifiable uniquement lorsque le lave-vaisselle est \xE0 l'arr\xEAt.","reason.manual_mode":"D\xE9marrez ce mode sur le four.","reason.max_ice":"D\xE9sactivez Glace max pour modifier la temp\xE9rature du cong\xE9lateur.","reason.mode_change_disabled":"Le four n'accepte pas de changement de mode pour le moment.","reason.no_temperature":"Ce mode n'a pas de temp\xE9rature \xE0 r\xE9gler.","reason.offline":"L'appareil est hors ligne.","reason.oven_not_ready":"Disponible lorsque le four est allum\xE9 ou en Remote Ready.","reason.remote_ready_dishwasher":"Activez d'abord Remote Ready sur le lave-vaisselle.","reason.remote_ready_oven":"Activez Remote Ready sur le four pour le d\xE9marrer d'ici.","reason.set_temperature":"R\xE9glez d'abord la temp\xE9rature.","reason.start_at_oven":"Allumez-le sur le four.","reason.unavailable":"Indisponible pour le moment.","reason.use_start":"Utilisez D\xE9marrer ci-dessous pour l'allumer.","section.cleaning":"Nettoyage","section.cycle":"Cycle de lavage","section.delayed_shutoff":"Arr\xEAt diff\xE9r\xE9","section.details":"D\xE9tails","section.fan_light":"Ventilateur et \xE9clairage","section.filters":"Filtres et entretien","section.ice_delay":"Pause de la machine \xE0 gla\xE7ons","section.ice_maker":"Machine \xE0 gla\xE7ons","section.maintenance":"Entretien","section.modes":"Modes","section.options":"Options","section.settings":"R\xE9glages","section.temperatures":"Temp\xE9ratures","severity.critical":"Critique","severity.high":"\xC9lev\xE9e","severity.low":"Faible","severity.medium":"Moyenne","severity.undefined":"Non pr\xE9cis\xE9e","severity.unknown":"Inconnue","severity.urgent":"Urgente","unit.days":"{n} j","unit.days_hours":"{d} j {h} h","unit.hours":"{n} h","unit.hours_minutes":"{h} h {m} min","unit.minutes":"{n} min","value.alert":"Alerte","value.daily_for":"Chaque jour pendant {duration}","value.daily_from":"Chaque jour d\xE8s {time} pendant {duration}","value.done":"Termin\xE9","value.door_open":"Porte ouverte","value.due_now":"Maintenant","value.due_soon":"Bient\xF4t","value.ends_at":"Se termine \xE0 {time}","value.from_for":"D\xE8s {time} pendant {duration}","value.in_cycles":"Dans {n} cycles","value.inserted":"En place","value.low":"Bas","value.missing":"Absent","value.no_faults":"Aucun","value.none":"Aucune","value.normal":"Normale","value.not_connected":"Non branch\xE9e","value.not_due":"Pas encore","value.not_needed":"Pas n\xE9cessaire","value.now":"Actuellement {temp}","value.off":"Arr\xEAt","value.ok":"Correct","value.on":"Marche","value.percent_used":"{pct}\xA0% utilis\xE9","value.probe_close":"\xC0 moins de 10 \xB0F de la cible","value.probe_done":"Cible atteinte","value.replace":"\xC0 remplacer","value.required":"N\xE9cessaire","value.speed":"Vitesse {speed}","value.under_minute":"Moins d'une minute","value.until":"Jusqu'\xE0 {time}","wifi.excellent":"Excellent","wifi.fair":"Moyen","wifi.good":"Bon","wifi.weak":"Faible","zone.crisp":"Bac \xE0 l\xE9gumes","zone.frz":"Cong\xE9lateur","zone.ref":"R\xE9frig\xE9rateur","zone.ref2":"Tiroir r\xE9frig\xE9r\xE9","zone.short.crisp":"L\xE9gumes","zone.short.frz":"Cong\xE9lateur","zone.short.ref":"R\xE9frig\xE9rateur","zone.short.ref2":"Tiroir","zone.short.wine":"Vin","zone.short.wine_lower":"Bas","zone.short.wine_upper":"Haut","zone.wine":"Cave \xE0 vin","zone.wine_lower":"Zone inf\xE9rieure","zone.wine_upper":"Zone sup\xE9rieure"};var gs={"action.cancel_cycle":"Annulla ciclo","action.cancel_schedule":"Annulla","action.dismiss":"Conferma","action.end":"Termina","action.reset":"Azzera","action.start":"Avvia","cavity.left":"Forno sinistro","cavity.lower":"Forno inferiore","cavity.right":"Forno destro","cavity.single":"Forno","cavity.upper":"Forno superiore","confirm.cancel_cycle":"Annullare il ciclo di lavaggio?","confirm.start.left":"Avviare il forno sinistro in {setting}?","confirm.start.lower":"Avviare il forno inferiore in {setting}?","confirm.start.right":"Avviare il forno destro in {setting}?","confirm.start.single":"Avviare il forno in {setting}?","confirm.start.upper":"Avviare il forno superiore in {setting}?","confirm.start_dishwasher":"Avviare {cycle} sulla lavastoviglie?","control.accent_light":"Luce d'accento","control.air_filter":"Filtro dell'aria","control.air_purification":"Purificazione dell'aria","control.appliance_type":"Tipo di elettrodomestico","control.broil_level":"Livello grill","control.cancel_cycle":"Ciclo in corso","control.cancel_delay":"Pausa programmata","control.clean_due":"Pulizia da fare","control.clean_stage":"Fase di pulizia","control.control_lock":"Blocco comandi","control.cook_mode":"Modalit\xE0 di cottura","control.cook_timer":"Timer di cottura","control.crisper_mode":"Temperatura del cassetto verdure","control.cycles_until_cleaning":"Cicli di ghiaccio prima della pulizia","control.delay_left":"La pausa termina tra","control.delay_schedule":"Programmazione","control.delay_start":"Partenza ritardata","control.delayed_shutoff":"Spegnimento ritardato","control.dishwasher_mode":"Modalit\xE0","control.dispenser":"Erogatore d'acqua interno","control.door_open_delay":"Ritardo allarme porta aperta","control.duration":"Durata","control.end_delay":"Pausa in corso","control.extended_dry_on":"Asciugatura prolungata","control.failsafe":"Arresto di sicurezza","control.fan":"Ventola","control.fan_sensitivity":"Sensibilit\xE0 automatica della ventola","control.fault":"Guasto {code}","control.fault_code":"Codice {code}","control.fault_unknown":"Guasto","control.faults":"Guasti attivi","control.filter_allowance":"Durata del filtro","control.filter_usage":"Uso del filtro","control.gourmet":"Programma gourmet","control.halo":"Luce halo","control.heated_dry_on":"Asciugatura extra","control.high_temp_wash_on":"Lavaggio ad alta temperatura","control.high_use_left":"L'uso intenso termina tra","control.humidity":"Controllo dell'umidit\xE0","control.ice_maker":"Fabbricatore di ghiaccio","control.key_tones":"Toni dei tasti","control.kitchen_timer":"Timer da cucina","control.kitchen_timer2":"Timer da cucina 2","control.light":"Luce","control.max_ice_left":"Ghiaccio max termina tra","control.model":"Modello","control.next_cleaning":"Prossima pulizia","control.night_mode":"Modalit\xE0 notte","control.operating_mode":"Modalit\xE0","control.power":"Accensione","control.probe":"Sonda","control.probe_target":"Obiettivo della sonda","control.remote_ready":"Remote Ready","control.remote_start":"Avvio remoto","control.reset_air_filter":"Azzera filtro dell'aria","control.rinse_aid":"Brillantante","control.sabbath":"Modalit\xE0 Sabbath","control.sani_rinse_on":"Risciacquo igienizzante","control.schedule_delay":"Nuova pausa","control.service":"Assistenza","control.shutoff_after":"Spegni dopo","control.softener":"Sale addolcitore","control.starts_in":"Inizia tra","control.status":"Stato","control.task_light":"Luce di lavoro","control.temperature":"Temperatura","control.time_left":"Tempo rimanente","control.timer_finished":"Timer terminato","control.top_rack_only_on":"Solo cestello superiore","control.uptime":"Tempo di attivit\xE0","control.wash_cycle":"Programma di lavaggio","control.water_filter":"Filtro dell'acqua","control.water_filter_capacity":"Capacit\xE0 del filtro dell'acqua","control.wifi":"Segnale Wi-Fi","control.wine_temp_alert":"Avviso di temperatura","control.winterized":"Predisposto per l'inverno","ctl.at":"Ora di inizio","ctl.brightness":"Luminosit\xE0","ctl.custom":"Personalizzato","ctl.decrease":"Diminuisci","ctl.duration":"Durata","ctl.increase":"Aumenta","ctl.later":"Pi\xF9 tardi oggi","ctl.minutes":"Minuti","ctl.not_now":"Non ora","ctl.now":"Ora","ctl.off":"Spento","ctl.on":"Acceso","ctl.repeat":"Ripeti ogni giorno","ctl.saving":"Salvataggio\u2026","ctl.schedule":"Programma","ctl.set":"Imposta","ctl.speed":"Velocit\xE0 {n}","ctl.start":"Inizio","ctl.starts_in":"Inizia tra {time}","ctl.white":"Tonalit\xE0 del bianco","display.starts_at":"Inizio {time}","event.air_filter_expired":"Filtro dell'aria scaduto","event.cavity.cooking_timer_complete":"Timer di cottura terminato","event.cavity.cooking_timer_under_one_minute":"Al timer di cottura manca un minuto","event.cavity.door_ajar":"Porta aperta","event.cavity.preheated":"Preriscaldamento completato","event.cavity.probe_connected":"Sonda in uso","event.cavity.probe_target_reached":"Temperatura della sonda raggiunta","event.cavity.probe_within_ten_degrees":"Sonda a meno di 10 \xB0F dall'obiettivo","event.cavity.self_clean_complete":"Pulizia completata","event.dishwasher_cancelled":"Ciclo di lavaggio annullato","event.dishwasher_complete":"Ciclo di lavaggio completato","event.dishwasher_paused":"Ciclo di lavaggio interrotto","event.dishwasher_service_required":"Assistenza alla lavastoviglie necessaria","event.dishwasher_started":"Ciclo di lavaggio avviato","event.fault_notification":"Guasto dell'elettrodomestico","event.feedback_notification":"Richiesta di feedback","event.freezer_door_ajar":"Porta del congelatore aperta","event.freezer_setpoint_changed":"Temperatura impostata del congelatore modificata","event.ice_cleaning_add_descaler":"Il ciclo di pulizia del fabbricatore di ghiaccio richiede il decalcificante","event.ice_cleaning_add_sanitizer":"Il ciclo di pulizia del fabbricatore di ghiaccio richiede il disinfettante","event.ice_cleaning_cancelled":"Ciclo di pulizia del fabbricatore di ghiaccio annullato","event.ice_cleaning_complete":"Ciclo di pulizia del fabbricatore di ghiaccio completato","event.ice_cleaning_due_soon":"Ciclo di pulizia del fabbricatore di ghiaccio necessario a breve","event.ice_cleaning_required":"Ciclo di pulizia del fabbricatore di ghiaccio necessario","event.ice_maker_door_ajar":"Sportello del fabbricatore di ghiaccio aperto","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"Timer da cucina 2 terminato","event.kitchen_timer_2_under_one_minute":"Al timer da cucina 2 manca un minuto","event.kitchen_timer_complete":"Timer da cucina terminato","event.kitchen_timer_under_one_minute":"Al timer da cucina manca un minuto","event.lower_oven_cooking_timer_complete":"Timer di cottura del forno inferiore terminato","event.lower_oven_cooking_timer_under_one_minute":"Al timer di cottura del forno inferiore manca un minuto","event.lower_oven_door_ajar":"Porta del forno inferiore aperta","event.lower_oven_preheated":"Preriscaldamento del forno inferiore completato","event.lower_oven_probe_connected":"Sonda del forno inferiore in uso","event.lower_oven_probe_target_reached":"Temperatura della sonda del forno inferiore raggiunta","event.lower_oven_probe_within_ten_degrees":"Sonda del forno inferiore a meno di 10 \xB0F dall'obiettivo","event.lower_oven_self_clean_complete":"Pulizia del forno inferiore completata","event.oven_cooking_timer_complete":"Timer di cottura del forno terminato","event.oven_cooking_timer_under_one_minute":"Al timer di cottura del forno manca un minuto","event.oven_door_ajar":"Porta del forno aperta","event.oven_preheated":"Preriscaldamento del forno completato","event.oven_probe_connected":"Sonda del forno in uso","event.oven_probe_target_reached":"Temperatura della sonda del forno raggiunta","event.oven_probe_within_ten_degrees":"Sonda del forno a meno di 10 \xB0F dall'obiettivo","event.oven_self_clean_complete":"Pulizia del forno completata","event.oven_service_required":"Assistenza al forno necessaria","event.refrigerator_door_ajar":"Porta del frigorifero aperta","event.refrigerator_service_required":"Assistenza al frigorifero necessaria","event.refrigerator_setpoint_changed":"Temperatura impostata del frigorifero modificata","event.rinse_aid_low":"Brillantante in esaurimento","event.softener_salt_low":"Sale addolcitore in esaurimento","event.unknown":"Sconosciuto","event.water_filter_expired":"Filtro dell'acqua scaduto","event.wine_door_ajar":"Porta della cantinetta aperta","event.wine_setpoint_changed":"Temperatura impostata della cantinetta modificata","event.wine_temperature_alert":"Temperatura della cantinetta fuori intervallo","full.appearance":"Aspetto","full.appliance":"Elettrodomestico","full.events_error":"Impossibile caricare gli eventi: {error}","full.events_loading":"Caricamento degli eventi\u2026","full.failed":"Non ha funzionato.","full.no_events":"Nessun evento negli ultimi 7 giorni.","full.recent_events":"Eventi recenti","full.refresh":"Aggiorna","full.refresh_hint":"Legge subito lo stato dell'elettrodomestico.","full.refreshing":"Aggiornamento\u2026","info.air_filter":"Filtro dell'aria","info.cleaning":"Pulizia","info.cycle":"Programma","info.delay":"Pausa ghiaccio","info.ends":"Fine","info.fan":"Ventola","info.filter":"Filtro","info.ice_maker":"Ghiaccio","info.light":"Luce","info.mode":"Modalit\xE0","info.model":"Modello","info.next_cleaning":"Prossima pulizia","info.options":"Opzioni","info.probe":"Sonda","info.set_to":"Impostato a","info.starts":"Inizio","info.status":"Stato","info.water_filter":"Filtro dell'acqua","lock.cycle_no_delay":"Questo programma di lavaggio non prevede la partenza ritardata.","lock.cycle_no_option":"Questo programma di lavaggio non prevede questa opzione.","lock.delay_not_idle":"La partenza ritardata si pu\xF2 cambiare solo con la lavastoviglie ferma o in attesa.","lock.proof_light":"La luce del forno resta spenta durante la lievitazione.","lock.sabbath":"La modalit\xE0 Sabbath \xE8 attiva. Disattivala per cambiare questa impostazione.","lock.self_clean":"Il forno \xE8 in autopulizia. Pu\xF2 solo essere spento.","lock.wash_not_idle":"Le opzioni di lavaggio si possono cambiare solo con la lavastoviglie ferma.","option.10_hours":"10 ore","option.10_minutes":"10 minuti","option.11_hours":"11 ore","option.12_hours":"12 ore","option.1_hour":"1 ora","option.1_minute":"1 minuto","option.2_hours":"2 ore","option.2_minutes":"2 minuti","option.3_hours":"3 ore","option.4_hours":"4 ore","option.5_hours":"5 ore","option.5_minutes":"5 minuti","option.6_hours":"6 ore","option.7_hours":"7 ore","option.8_hours":"8 ore","option.9_hours":"9 ore","option.add_descaler":"Aggiungi il decalcificante","option.add_sanitizer":"Aggiungi l'igienizzante","option.auto":"Automatico","option.automatic":"Automatico","option.bake":"Cottura","option.bake_stone":"Pietra refrattaria","option.broil":"Grill","option.canceling":"Annullamento","option.child_lock":"Blocco bambini","option.cleaning_complete":"Pulizia completata","option.cleaning_reset_flush":"Ripristino pulizia: scarico","option.cleaning_reset_rinse":"Ripristino pulizia: risciacquo","option.convection":"Ventilato","option.convection_bake":"Cottura ventilata","option.convection_broil":"Grill ventilato","option.convection_roast":"Arrosto ventilato","option.crystal_and_china":"Cristalli e porcellana","option.dehydrate":"Essiccazione","option.delayed":"Ritardato","option.descale_clean":"Decalcificazione: pulizia","option.descale_fill":"Decalcificazione: riempimento","option.descale_flush":"Decalcificazione: scarico","option.descale_rinse":"Decalcificazione: risciacquo","option.disabled":"Disattivato","option.done":"Finito","option.drying":"Asciugatura","option.empty_bin":"Svuota il contenitore","option.enabled":"Attivato","option.energy":"Risparmio energetico","option.enhanced":"Potenziato","option.error":"Errore","option.extra_quiet":"Extra silenzioso","option.heavy":"Intensivo","option.high":"Alto","option.high_use":"Uso intenso","option.idle":"In attesa","option.light":"Delicato","option.long_vacation":"Vacanza lunga","option.low":"Basso","option.manual":"Manuale","option.manually_clean":"Pulisci a mano","option.max_ice":"Ghiaccio max","option.medium":"Medio","option.night_ice":"Ghiaccio notturno","option.none":"Nessuno","option.normal":"Normale","option.not_cleaning":"Nessuna pulizia","option.off":"Spento","option.on":"Acceso","option.paused":"In pausa","option.plastics":"Plastica","option.pots_and_pans":"Pentole e padelle","option.proof":"Lievitazione","option.quick":"Rapido","option.rinse_and_hold":"Risciacquo e attesa","option.roast":"Arrosto","option.running":"In funzione","option.sabbath":"Sabbath","option.sanitize_clean":"Igienizzazione: pulizia","option.sanitize_fill":"Igienizzazione: riempimento","option.sanitize_flush":"Igienizzazione: scarico","option.sanitize_rinse":"Igienizzazione: risciacquo","option.self_clean":"Autopulizia","option.short_vacation":"Vacanza breve","option.soak_and_scrub":"Ammollo e strofinatura","option.warm":"Mantenimento in caldo","pill.cleaning":"Pulizia","pill.cleaning_due":"Pulizia da fare","pill.cooking":"In cottura","pill.delayed_shutoff":"Spegnimento ritardato","pill.door_open":"Porta aperta","pill.fan":"Ventola {speed}","pill.high_use":"Uso intenso","pill.light":"Luce accesa","pill.making_ice":"Produce ghiaccio","pill.normal":"Normale","pill.off":"Spento","pill.offline":"Non in linea","pill.paused":"In pausa","pill.preheated":"Preriscaldato","pill.preheating":"Preriscaldamento {pct}%","pill.remote_ready":"Remote Ready","pill.sabbath":"Sabbath","pill.self_clean":"Autopulizia","pill.service":"Assistenza","pill.temp_alert":"Avviso di temperatura","pill.timer":"Timer {time}","pill.timer_done":"Timer terminato","pill.vacation":"Vacanza","reason.choose_mode":"Scegli prima una modalit\xE0 di cottura.","reason.close_door":"Chiudi prima la porta.","reason.close_oven_door":"Chiudi prima la porta del forno.","reason.crisper_auto":"Imposta il cassetto verdure su Manuale per cambiarlo.","reason.dishwasher_busy":"Modificabile solo con la lavastoviglie ferma.","reason.manual_mode":"Avvia questa modalit\xE0 dal forno.","reason.max_ice":"Disattiva Ghiaccio max per cambiare la temperatura del congelatore.","reason.mode_change_disabled":"Al momento il forno non accetta cambi di modalit\xE0.","reason.no_temperature":"Questa modalit\xE0 non ha una temperatura da impostare.","reason.offline":"L'elettrodomestico non \xE8 in linea.","reason.oven_not_ready":"Disponibile con il forno acceso o in Remote Ready.","reason.remote_ready_dishwasher":"Attiva prima Remote Ready sulla lavastoviglie.","reason.remote_ready_oven":"Attiva Remote Ready sul forno per avviarlo da qui.","reason.set_temperature":"Imposta prima la temperatura.","reason.start_at_oven":"Accendilo dal forno.","reason.unavailable":"Non disponibile al momento.","reason.use_start":"Usa Avvia qui sotto per accenderlo.","section.cleaning":"Pulizia","section.cycle":"Ciclo di lavaggio","section.delayed_shutoff":"Spegnimento ritardato","section.details":"Dettagli","section.fan_light":"Ventola e luce","section.filters":"Filtri e manutenzione","section.ice_delay":"Pausa del ghiaccio","section.ice_maker":"Fabbricatore di ghiaccio","section.maintenance":"Manutenzione","section.modes":"Modalit\xE0","section.options":"Opzioni","section.settings":"Impostazioni","section.temperatures":"Temperature","severity.critical":"Critica","severity.high":"Alta","severity.low":"Bassa","severity.medium":"Media","severity.undefined":"Non specificata","severity.unknown":"Sconosciuta","severity.urgent":"Urgente","unit.days":"{n} g","unit.days_hours":"{d} g {h} h","unit.hours":"{n} h","unit.hours_minutes":"{h} h {m} min","unit.minutes":"{n} min","value.alert":"Avviso","value.daily_for":"Ogni giorno per {duration}","value.daily_from":"Ogni giorno dalle {time} per {duration}","value.done":"Finito","value.door_open":"Porta aperta","value.due_now":"Ora","value.due_soon":"A breve","value.ends_at":"Termina alle {time}","value.from_for":"Dalle {time} per {duration}","value.in_cycles":"Tra {n} cicli","value.inserted":"Inserito","value.low":"Basso","value.missing":"Mancante","value.no_faults":"Nessuno","value.none":"Nessuna","value.normal":"Normale","value.not_connected":"Non collegata","value.not_due":"Non ancora","value.not_needed":"Non necessaria","value.now":"Ora {temp}","value.off":"Spento","value.ok":"A posto","value.on":"Acceso","value.percent_used":"{pct}% usato","value.probe_close":"Entro 10 \xB0F dall'obiettivo","value.probe_done":"Obiettivo raggiunto","value.replace":"Da sostituire","value.required":"Necessaria","value.speed":"Velocit\xE0 {speed}","value.under_minute":"Meno di un minuto","value.until":"Fino alle {time}","wifi.excellent":"Ottimo","wifi.fair":"Discreto","wifi.good":"Buono","wifi.weak":"Debole","zone.crisp":"Cassetto verdure","zone.frz":"Congelatore","zone.ref":"Frigorifero","zone.ref2":"Cassetto frigorifero","zone.short.crisp":"Verdure","zone.short.frz":"Congelatore","zone.short.ref":"Frigorifero","zone.short.ref2":"Cassetto","zone.short.wine":"Vino","zone.short.wine_lower":"Sotto","zone.short.wine_upper":"Sopra","zone.wine":"Cantinetta","zone.wine_lower":"Zona inferiore","zone.wine_upper":"Zona superiore"};var ys={"action.cancel_cycle":"Programma annuleren","action.cancel_schedule":"Annuleren","action.dismiss":"Bevestigen","action.end":"Be\xEBindigen","action.reset":"Resetten","action.start":"Starten","cavity.left":"Linkeroven","cavity.lower":"Onderste oven","cavity.right":"Rechteroven","cavity.single":"Oven","cavity.upper":"Bovenste oven","confirm.cancel_cycle":"Afwasprogramma annuleren?","confirm.start.left":"Linkeroven starten op {setting}?","confirm.start.lower":"Onderste oven starten op {setting}?","confirm.start.right":"Rechteroven starten op {setting}?","confirm.start.single":"Oven starten op {setting}?","confirm.start.upper":"Bovenste oven starten op {setting}?","confirm.start_dishwasher":"{cycle} starten op de vaatwasser?","control.accent_light":"Sfeerverlichting","control.air_filter":"Luchtfilter","control.air_purification":"Luchtzuivering","control.appliance_type":"Apparaattype","control.broil_level":"Grillstand","control.cancel_cycle":"Lopend programma","control.cancel_delay":"Geplande ijspauze","control.clean_due":"Reiniging nodig","control.clean_stage":"Reinigingsstap","control.control_lock":"Bedieningsvergrendeling","control.cook_mode":"Bereidingswijze","control.cook_timer":"Kooktimer","control.crisper_mode":"Temperatuur groentelade","control.cycles_until_cleaning":"IJscycli tot reiniging","control.delay_left":"Pauze eindigt over","control.delay_schedule":"Schema","control.delay_start":"Uitgestelde start","control.delayed_shutoff":"Uitgestelde uitschakeling","control.dishwasher_mode":"Modus","control.dispenser":"Interne waterdispenser","control.door_open_delay":"Vertraging deur-open-melding","control.duration":"Duur","control.end_delay":"Huidige pauze","control.extended_dry_on":"Verlengd drogen","control.failsafe":"Veiligheidsuitschakeling","control.fan":"Ventilator","control.fan_sensitivity":"Automatische ventilatorgevoeligheid","control.fault":"Storing {code}","control.fault_code":"Code {code}","control.fault_unknown":"Storing","control.faults":"Actieve storingen","control.filter_allowance":"Levensduur filter","control.filter_usage":"Filtergebruik","control.gourmet":"Gourmetprogramma","control.halo":"Halolicht","control.heated_dry_on":"Extra drogen","control.high_temp_wash_on":"Afwassen op hoge temperatuur","control.high_use_left":"Intensief gebruik eindigt over","control.humidity":"Vochtigheidsregeling","control.ice_maker":"IJsmaker","control.key_tones":"Toetstonen","control.kitchen_timer":"Keukentimer","control.kitchen_timer2":"Keukentimer 2","control.light":"Lamp","control.max_ice_left":"Max ijs eindigt over","control.model":"Modelnummer","control.next_cleaning":"Volgende reiniging","control.night_mode":"Nachtmodus","control.operating_mode":"Modus","control.power":"Aan/uit","control.probe":"Kerntemperatuurmeter","control.probe_target":"Doeltemperatuur meter","control.remote_ready":"Remote Ready","control.remote_start":"Op afstand starten","control.reset_air_filter":"Luchtfilter resetten","control.rinse_aid":"Glansspoelmiddel","control.sabbath":"Sabbatmodus","control.sani_rinse_on":"Hygi\xEBnisch spoelen","control.schedule_delay":"Nieuwe ijspauze","control.service":"Onderhoud","control.shutoff_after":"Uitschakelen na","control.softener":"Onthardingszout","control.starts_in":"Start over","control.status":"Toestand","control.task_light":"Werklamp","control.temperature":"Temperatuur","control.time_left":"Resterende tijd","control.timer_finished":"Timer afgelopen","control.top_rack_only_on":"Alleen bovenste rek","control.uptime":"Bedrijfstijd","control.wash_cycle":"Afwasprogramma","control.water_filter":"Waterfilter","control.water_filter_capacity":"Capaciteit waterfilter","control.wifi":"Wifi-signaal","control.wine_temp_alert":"Temperatuurmelding","control.winterized":"Winterklaar","ctl.at":"Starttijd","ctl.brightness":"Helderheid","ctl.custom":"Aangepast","ctl.decrease":"Verlagen","ctl.duration":"Duur","ctl.increase":"Verhogen","ctl.later":"Later vandaag","ctl.minutes":"Minuten","ctl.not_now":"Niet nu","ctl.now":"Nu","ctl.off":"Uit","ctl.on":"Aan","ctl.repeat":"Dagelijks herhalen","ctl.saving":"Opslaan\u2026","ctl.schedule":"Plannen","ctl.set":"Instellen","ctl.speed":"Stand {n}","ctl.start":"Begin","ctl.starts_in":"Begint over {time}","ctl.white":"Kleurtemperatuur","display.starts_at":"Start {time}","event.air_filter_expired":"Luchtfilter verlopen","event.cavity.cooking_timer_complete":"Bereidingstimer afgelopen","event.cavity.cooking_timer_under_one_minute":"Bereidingstimer heeft nog \xE9\xE9n minuut","event.cavity.door_ajar":"Deur open","event.cavity.preheated":"Voorverwarmen voltooid","event.cavity.probe_connected":"Kerntemperatuurmeter in gebruik","event.cavity.probe_target_reached":"Kerntemperatuur bereikt","event.cavity.probe_within_ten_degrees":"Kerntemperatuurmeter binnen 10 \xB0F van doel","event.cavity.self_clean_complete":"Reiniging voltooid","event.dishwasher_cancelled":"Vaatwasprogramma geannuleerd","event.dishwasher_complete":"Vaatwasprogramma voltooid","event.dishwasher_paused":"Vaatwasprogramma onderbroken","event.dishwasher_service_required":"Onderhoud vaatwasser vereist","event.dishwasher_started":"Vaatwasprogramma gestart","event.fault_notification":"Apparaatstoring","event.feedback_notification":"Verzoek om feedback","event.freezer_door_ajar":"Vriezerdeur open","event.freezer_setpoint_changed":"Ingestelde temperatuur vriezer gewijzigd","event.ice_cleaning_add_descaler":"Reinigingscyclus ijsmachine heeft ontkalker nodig","event.ice_cleaning_add_sanitizer":"Reinigingscyclus ijsmachine heeft desinfectiemiddel nodig","event.ice_cleaning_cancelled":"Reinigingscyclus ijsmachine geannuleerd","event.ice_cleaning_complete":"Reinigingscyclus ijsmachine voltooid","event.ice_cleaning_due_soon":"Reinigingscyclus ijsmachine binnenkort nodig","event.ice_cleaning_required":"Reinigingscyclus ijsmachine nodig","event.ice_maker_door_ajar":"Deur van ijsmachine open","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"Kookwekker 2 afgelopen","event.kitchen_timer_2_under_one_minute":"Kookwekker 2 heeft nog \xE9\xE9n minuut","event.kitchen_timer_complete":"Kookwekker afgelopen","event.kitchen_timer_under_one_minute":"Kookwekker heeft nog \xE9\xE9n minuut","event.lower_oven_cooking_timer_complete":"Bereidingstimer onderste oven afgelopen","event.lower_oven_cooking_timer_under_one_minute":"Bereidingstimer onderste oven heeft nog \xE9\xE9n minuut","event.lower_oven_door_ajar":"Deur onderste oven open","event.lower_oven_preheated":"Voorverwarmen onderste oven voltooid","event.lower_oven_probe_connected":"Kerntemperatuurmeter onderste oven in gebruik","event.lower_oven_probe_target_reached":"Kerntemperatuur onderste oven bereikt","event.lower_oven_probe_within_ten_degrees":"Kerntemperatuurmeter onderste oven binnen 10 \xB0F van doel","event.lower_oven_self_clean_complete":"Reiniging onderste oven voltooid","event.oven_cooking_timer_complete":"Bereidingstimer oven afgelopen","event.oven_cooking_timer_under_one_minute":"Bereidingstimer oven heeft nog \xE9\xE9n minuut","event.oven_door_ajar":"Ovendeur open","event.oven_preheated":"Voorverwarmen oven voltooid","event.oven_probe_connected":"Kerntemperatuurmeter oven in gebruik","event.oven_probe_target_reached":"Kerntemperatuur oven bereikt","event.oven_probe_within_ten_degrees":"Kerntemperatuurmeter oven binnen 10 \xB0F van doel","event.oven_self_clean_complete":"Ovenreiniging voltooid","event.oven_service_required":"Onderhoud oven vereist","event.refrigerator_door_ajar":"Koelkastdeur open","event.refrigerator_service_required":"Onderhoud koelkast vereist","event.refrigerator_setpoint_changed":"Ingestelde temperatuur koelkast gewijzigd","event.rinse_aid_low":"Glansspoelmiddel bijna op","event.softener_salt_low":"Onthardingszout bijna op","event.unknown":"Onbekend","event.water_filter_expired":"Waterfilter verlopen","event.wine_door_ajar":"Deur van wijnklimaatkast open","event.wine_setpoint_changed":"Ingestelde temperatuur wijnklimaatkast gewijzigd","event.wine_temperature_alert":"Temperatuur wijnklimaatkast buiten bereik","full.appearance":"Weergave","full.appliance":"Apparaat","full.events_error":"Gebeurtenissen konden niet worden geladen: {error}","full.events_loading":"Gebeurtenissen laden\u2026","full.failed":"Dat is niet gelukt.","full.no_events":"Geen gebeurtenissen in de afgelopen 7 dagen.","full.recent_events":"Recente gebeurtenissen","full.refresh":"Vernieuwen","full.refresh_hint":"Leest nu de status van het apparaat.","full.refreshing":"Vernieuwen\u2026","info.air_filter":"Luchtfilter","info.cleaning":"Reiniging","info.cycle":"Programma","info.delay":"IJspauze","info.ends":"Klaar om","info.fan":"Ventilator","info.filter":"Filter","info.ice_maker":"IJsmaker","info.light":"Lamp","info.mode":"Modus","info.model":"Modelnummer","info.next_cleaning":"Volgende reiniging","info.options":"Opties","info.probe":"Meter","info.set_to":"Ingesteld op","info.starts":"Start om","info.status":"Toestand","info.water_filter":"Waterfilter","lock.cycle_no_delay":"Dit afwasprogramma heeft geen uitgestelde start.","lock.cycle_no_option":"Dit afwasprogramma heeft deze optie niet.","lock.delay_not_idle":"De uitgestelde start kan alleen worden gewijzigd als de vaatwasser stilstaat of wacht.","lock.proof_light":"De ovenlamp blijft uit tijdens het rijzen.","lock.sabbath":"De sabbatmodus staat aan. Zet hem uit om dit te wijzigen.","lock.self_clean":"De oven reinigt zichzelf. Hij kan alleen worden uitgezet.","lock.wash_not_idle":"Afwasopties kunnen alleen worden gewijzigd als de vaatwasser stilstaat.","option.10_hours":"10 uur","option.10_minutes":"10 minuten","option.11_hours":"11 uur","option.12_hours":"12 uur","option.1_hour":"1 uur","option.1_minute":"1 minuut","option.2_hours":"2 uur","option.2_minutes":"2 minuten","option.3_hours":"3 uur","option.4_hours":"4 uur","option.5_hours":"5 uur","option.5_minutes":"5 minuten","option.6_hours":"6 uur","option.7_hours":"7 uur","option.8_hours":"8 uur","option.9_hours":"9 uur","option.add_descaler":"Ontkalker toevoegen","option.add_sanitizer":"Desinfectiemiddel toevoegen","option.auto":"Automatisch","option.automatic":"Automatisch","option.bake":"Bakken","option.bake_stone":"Baksteen","option.broil":"Grillen","option.canceling":"Annuleren","option.child_lock":"Kinderslot","option.cleaning_complete":"Reiniging voltooid","option.cleaning_reset_flush":"Reiniging resetten: doorspoelen","option.cleaning_reset_rinse":"Reiniging resetten: naspoelen","option.convection":"Hetelucht","option.convection_bake":"Heteluchtbakken","option.convection_broil":"Heteluchtgrillen","option.convection_roast":"Heteluchtbraden","option.crystal_and_china":"Kristal en porselein","option.dehydrate":"Drogen","option.delayed":"Uitgesteld","option.descale_clean":"Ontkalken: reinigen","option.descale_fill":"Ontkalken: vullen","option.descale_flush":"Ontkalken: doorspoelen","option.descale_rinse":"Ontkalken: naspoelen","option.disabled":"Uitgeschakeld","option.done":"Klaar","option.drying":"Drogen","option.empty_bin":"Bak legen","option.enabled":"Ingeschakeld","option.energy":"Energiebesparend","option.enhanced":"Verhoogd","option.error":"Fout","option.extra_quiet":"Extra stil","option.heavy":"Intensief","option.high":"Hoog","option.high_use":"Intensief gebruik","option.idle":"Gereed","option.light":"Licht","option.long_vacation":"Lange vakantie","option.low":"Laag","option.manual":"Handmatig","option.manually_clean":"Met de hand reinigen","option.max_ice":"Max ijs","option.medium":"Gemiddeld","option.night_ice":"Nachtijs","option.none":"Geen","option.normal":"Normaal","option.not_cleaning":"Geen reiniging","option.off":"Uit","option.on":"Aan","option.paused":"Gepauzeerd","option.plastics":"Kunststof","option.pots_and_pans":"Pannen","option.proof":"Rijzen","option.quick":"Snel","option.rinse_and_hold":"Voorspoelen","option.roast":"Braden","option.running":"Bezig","option.sabbath":"Sabbat","option.sanitize_clean":"Desinfecteren: reinigen","option.sanitize_fill":"Desinfecteren: vullen","option.sanitize_flush":"Desinfecteren: doorspoelen","option.sanitize_rinse":"Desinfecteren: naspoelen","option.self_clean":"Zelfreiniging","option.short_vacation":"Korte vakantie","option.soak_and_scrub":"Weken en schrobben","option.warm":"Warmhouden","pill.cleaning":"Reinigen","pill.cleaning_due":"Reiniging nodig","pill.cooking":"Bereidt","pill.delayed_shutoff":"Uitgestelde uitschakeling","pill.door_open":"Deur open","pill.fan":"Ventilator {speed}","pill.high_use":"Intensief gebruik","pill.light":"Lamp aan","pill.making_ice":"Maakt ijs","pill.normal":"Normaal","pill.off":"Uit","pill.offline":"Offline","pill.paused":"Gepauzeerd","pill.preheated":"Voorverwarmd","pill.preheating":"Voorverwarmen {pct}%","pill.remote_ready":"Remote Ready","pill.sabbath":"Sabbat","pill.self_clean":"Zelfreiniging","pill.service":"Onderhoud nodig","pill.temp_alert":"Temperatuurmelding","pill.timer":"Timer {time}","pill.timer_done":"Timer afgelopen","pill.vacation":"Vakantie","reason.choose_mode":"Kies eerst een bereidingswijze.","reason.close_door":"Sluit eerst de deur.","reason.close_oven_door":"Sluit eerst de ovendeur.","reason.crisper_auto":"Zet de groentelade op Handmatig om dit te wijzigen.","reason.dishwasher_busy":"Alleen te wijzigen als de vaatwasser stilstaat.","reason.manual_mode":"Start deze bereidingswijze op de oven.","reason.max_ice":"Zet Max ijs uit om de vriestemperatuur te wijzigen.","reason.mode_change_disabled":"De oven accepteert nu geen andere bereidingswijze.","reason.no_temperature":"Deze bereidingswijze heeft geen instelbare temperatuur.","reason.offline":"Het apparaat is offline.","reason.oven_not_ready":"Beschikbaar als de oven aan staat of in Remote Ready.","reason.remote_ready_dishwasher":"Zet eerst Remote Ready aan op de vaatwasser.","reason.remote_ready_oven":"Zet Remote Ready aan op de oven om hem hier te starten.","reason.set_temperature":"Stel eerst de temperatuur in.","reason.start_at_oven":"Zet hem aan op de oven.","reason.unavailable":"Nu niet beschikbaar.","reason.use_start":"Gebruik Starten hieronder om hem aan te zetten.","section.cleaning":"Reiniging","section.cycle":"Afwasprogramma","section.delayed_shutoff":"Uitgestelde uitschakeling","section.details":"Gegevens","section.fan_light":"Ventilator en lamp","section.filters":"Filters en onderhoud","section.ice_delay":"IJspauze","section.ice_maker":"IJsmaker","section.maintenance":"Onderhoud","section.modes":"Modi","section.options":"Opties","section.settings":"Instellingen","section.temperatures":"Temperaturen","severity.critical":"Kritiek","severity.high":"Hoog","severity.low":"Laag","severity.medium":"Gemiddeld","severity.undefined":"Niet opgegeven","severity.unknown":"Onbekend","severity.urgent":"Dringend","unit.days":"{n} d","unit.days_hours":"{d} d {h} u","unit.hours":"{n} u","unit.hours_minutes":"{h} u {m} min","unit.minutes":"{n} min","value.alert":"Melding","value.daily_for":"Dagelijks gedurende {duration}","value.daily_from":"Dagelijks vanaf {time} gedurende {duration}","value.done":"Klaar","value.door_open":"Deur open","value.due_now":"Nu","value.due_soon":"Binnenkort","value.ends_at":"Klaar om {time}","value.from_for":"Vanaf {time} gedurende {duration}","value.in_cycles":"Over {n} cycli","value.inserted":"Geplaatst","value.low":"Laag","value.missing":"Ontbreekt","value.no_faults":"Geen","value.none":"Geen","value.normal":"Normaal","value.not_connected":"Niet aangesloten","value.not_due":"Nog niet","value.not_needed":"Niet nodig","value.now":"Nu {temp}","value.off":"Uit","value.ok":"Goed","value.on":"Aan","value.percent_used":"{pct}% verbruikt","value.probe_close":"Binnen 10 \xB0F van het doel","value.probe_done":"Doel bereikt","value.replace":"Vervangen","value.required":"Nodig","value.speed":"Stand {speed}","value.under_minute":"Minder dan een minuut","value.until":"Tot {time}","wifi.excellent":"Uitstekend","wifi.fair":"Redelijk","wifi.good":"Goed","wifi.weak":"Zwak","zone.crisp":"Groentelade","zone.frz":"Vriezer","zone.ref":"Koelkast","zone.ref2":"Koellade","zone.short.crisp":"Groente","zone.short.frz":"Vriezer","zone.short.ref":"Koelkast","zone.short.ref2":"Lade","zone.short.wine":"Wijn","zone.short.wine_lower":"Onder","zone.short.wine_upper":"Boven","zone.wine":"Wijnklimaatkast","zone.wine_lower":"Onderste zone","zone.wine_upper":"Bovenste zone"};var $s={"action.cancel_cycle":"Anuluj cykl","action.cancel_schedule":"Anuluj","action.dismiss":"Potwierd\u017A","action.end":"Zako\u0144cz","action.reset":"Zresetuj","action.start":"Uruchom","cavity.left":"Lewy piekarnik","cavity.lower":"Dolny piekarnik","cavity.right":"Prawy piekarnik","cavity.single":"Piekarnik","cavity.upper":"G\xF3rny piekarnik","confirm.cancel_cycle":"Anulowa\u0107 cykl zmywania?","confirm.start.left":"Uruchomi\u0107 lewy piekarnik w trybie {setting}?","confirm.start.lower":"Uruchomi\u0107 dolny piekarnik w trybie {setting}?","confirm.start.right":"Uruchomi\u0107 prawy piekarnik w trybie {setting}?","confirm.start.single":"Uruchomi\u0107 piekarnik w trybie {setting}?","confirm.start.upper":"Uruchomi\u0107 g\xF3rny piekarnik w trybie {setting}?","confirm.start_dishwasher":"Uruchomi\u0107 program {cycle} w zmywarce?","control.accent_light":"O\u015Bwietlenie dekoracyjne","control.air_filter":"Filtr powietrza","control.air_purification":"Oczyszczanie powietrza","control.appliance_type":"Typ urz\u0105dzenia","control.broil_level":"Poziom grilla","control.cancel_cycle":"Bie\u017C\u0105cy cykl","control.cancel_delay":"Zaplanowana przerwa","control.clean_due":"Termin czyszczenia","control.clean_stage":"Etap czyszczenia","control.control_lock":"Blokada przycisk\xF3w","control.cook_mode":"Tryb pieczenia","control.cook_timer":"Minutnik pieczenia","control.crisper_mode":"Temperatura szuflady na warzywa","control.cycles_until_cleaning":"Cykle lodu do czyszczenia","control.delay_left":"Przerwa ko\u0144czy si\u0119 za","control.delay_schedule":"Harmonogram","control.delay_start":"Op\xF3\u017Aniony start","control.delayed_shutoff":"Op\xF3\u017Anione wy\u0142\u0105czenie","control.dishwasher_mode":"Tryb","control.dispenser":"Wewn\u0119trzny dystrybutor wody","control.door_open_delay":"Op\xF3\u017Anienie alarmu otwartych drzwi","control.duration":"Czas trwania","control.end_delay":"Bie\u017C\u0105ca przerwa","control.extended_dry_on":"Wyd\u0142u\u017Cone suszenie","control.failsafe":"Wy\u0142\u0105czenie awaryjne","control.fan":"Wentylator","control.fan_sensitivity":"Czu\u0142o\u015B\u0107 automatycznego wentylatora","control.fault":"Usterka {code}","control.fault_code":"Kod {code}","control.fault_unknown":"Usterka","control.faults":"Aktywne usterki","control.filter_allowance":"\u017Bywotno\u015B\u0107 filtra","control.filter_usage":"Zu\u017Cycie filtra","control.gourmet":"Program Gourmet","control.halo":"O\u015Bwietlenie halo","control.heated_dry_on":"Dodatkowe suszenie","control.high_temp_wash_on":"Mycie w wysokiej temperaturze","control.high_use_left":"Intensywne u\u017Cytkowanie ko\u0144czy si\u0119 za","control.humidity":"Regulacja wilgotno\u015Bci","control.ice_maker":"Kostkarka do lodu","control.key_tones":"D\u017Awi\u0119ki przycisk\xF3w","control.kitchen_timer":"Minutnik kuchenny","control.kitchen_timer2":"Minutnik kuchenny 2","control.light":"O\u015Bwietlenie","control.max_ice_left":"Maks. l\xF3d ko\u0144czy si\u0119 za","control.model":"Numer modelu","control.next_cleaning":"Nast\u0119pne czyszczenie","control.night_mode":"Tryb nocny","control.operating_mode":"Tryb","control.power":"Zasilanie","control.probe":"Sonda","control.probe_target":"Docelowa temperatura sondy","control.remote_ready":"Remote Ready","control.remote_start":"Zdalne uruchomienie","control.reset_air_filter":"Zresetuj filtr powietrza","control.rinse_aid":"Nab\u0142yszczacz","control.sabbath":"Tryb szabatowy","control.sani_rinse_on":"P\u0142ukanie higieniczne","control.schedule_delay":"Nowa przerwa","control.service":"Serwis","control.shutoff_after":"Wy\u0142\u0105cz po","control.softener":"S\xF3l zmi\u0119kczaj\u0105ca","control.starts_in":"Start za","control.status":"Stan","control.task_light":"O\u015Bwietlenie robocze","control.temperature":"Temperatura","control.time_left":"Pozosta\u0142y czas","control.timer_finished":"Minutnik zako\u0144czy\u0142","control.top_rack_only_on":"Tylko g\xF3rny kosz","control.uptime":"Czas pracy","control.wash_cycle":"Program zmywania","control.water_filter":"Filtr wody","control.water_filter_capacity":"Pojemno\u015B\u0107 filtra wody","control.wifi":"Sygna\u0142 Wi-Fi","control.wine_temp_alert":"Alarm temperatury","control.winterized":"Przygotowano do zimy","ctl.at":"Godzina rozpocz\u0119cia","ctl.brightness":"Jasno\u015B\u0107","ctl.custom":"W\u0142asny","ctl.decrease":"Zmniejsz","ctl.duration":"Czas trwania","ctl.increase":"Zwi\u0119ksz","ctl.later":"P\xF3\u017Aniej dzisiaj","ctl.minutes":"Minuty","ctl.not_now":"Nie teraz","ctl.now":"Teraz","ctl.off":"Wy\u0142.","ctl.on":"W\u0142.","ctl.repeat":"Powtarzaj codziennie","ctl.saving":"Zapisywanie\u2026","ctl.schedule":"Zaplanuj","ctl.set":"Ustaw","ctl.speed":"Bieg {n}","ctl.start":"Pocz\u0105tek","ctl.starts_in":"Rozpocznie si\u0119 za {time}","ctl.white":"Barwa bieli","display.starts_at":"Start {time}","event.air_filter_expired":"Filtr powietrza do wymiany","event.cavity.cooking_timer_complete":"Minutnik pieczenia zako\u0144czy\u0142 odliczanie","event.cavity.cooking_timer_under_one_minute":"Na minutniku pieczenia zosta\u0142a minuta","event.cavity.door_ajar":"Drzwi otwarte","event.cavity.preheated":"Zako\u0144czono nagrzewanie","event.cavity.probe_connected":"Sonda w u\u017Cyciu","event.cavity.probe_target_reached":"Osi\u0105gni\u0119to temperatur\u0119 sondy","event.cavity.probe_within_ten_degrees":"Sonda mniej ni\u017C 10 \xB0F od celu","event.cavity.self_clean_complete":"Zako\u0144czono czyszczenie","event.dishwasher_cancelled":"Anulowano cykl zmywania","event.dishwasher_complete":"Zako\u0144czono cykl zmywania","event.dishwasher_paused":"Przerwano cykl zmywania","event.dishwasher_service_required":"Zmywarka wymaga serwisu","event.dishwasher_started":"Rozpocz\u0119to cykl zmywania","event.fault_notification":"Usterka urz\u0105dzenia","event.feedback_notification":"Pro\u015Bba o opini\u0119","event.freezer_door_ajar":"Drzwi zamra\u017Carki otwarte","event.freezer_setpoint_changed":"Zmieniono temperatur\u0119 zadan\u0105 zamra\u017Carki","event.ice_cleaning_add_descaler":"Cykl czyszczenia kostkarki do lodu wymaga odkamieniacza","event.ice_cleaning_add_sanitizer":"Cykl czyszczenia kostkarki do lodu wymaga \u015Brodka dezynfekuj\u0105cego","event.ice_cleaning_cancelled":"Anulowano cykl czyszczenia kostkarki do lodu","event.ice_cleaning_complete":"Zako\u0144czono cykl czyszczenia kostkarki do lodu","event.ice_cleaning_due_soon":"Wkr\xF3tce wymagany cykl czyszczenia kostkarki do lodu","event.ice_cleaning_required":"Wymagany cykl czyszczenia kostkarki do lodu","event.ice_maker_door_ajar":"Drzwi kostkarki do lodu otwarte","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"Minutnik kuchenny 2 zako\u0144czy\u0142 odliczanie","event.kitchen_timer_2_under_one_minute":"Na minutniku kuchennym 2 zosta\u0142a minuta","event.kitchen_timer_complete":"Minutnik kuchenny zako\u0144czy\u0142 odliczanie","event.kitchen_timer_under_one_minute":"Na minutniku kuchennym zosta\u0142a minuta","event.lower_oven_cooking_timer_complete":"Minutnik pieczenia dolnego piekarnika zako\u0144czy\u0142 odliczanie","event.lower_oven_cooking_timer_under_one_minute":"Na minutniku pieczenia dolnego piekarnika zosta\u0142a minuta","event.lower_oven_door_ajar":"Drzwi dolnego piekarnika otwarte","event.lower_oven_preheated":"Zako\u0144czono nagrzewanie dolnego piekarnika","event.lower_oven_probe_connected":"Sonda dolnego piekarnika w u\u017Cyciu","event.lower_oven_probe_target_reached":"Osi\u0105gni\u0119to temperatur\u0119 sondy dolnego piekarnika","event.lower_oven_probe_within_ten_degrees":"Sonda dolnego piekarnika mniej ni\u017C 10 \xB0F od celu","event.lower_oven_self_clean_complete":"Zako\u0144czono czyszczenie dolnego piekarnika","event.oven_cooking_timer_complete":"Minutnik pieczenia piekarnika zako\u0144czy\u0142 odliczanie","event.oven_cooking_timer_under_one_minute":"Na minutniku pieczenia piekarnika zosta\u0142a minuta","event.oven_door_ajar":"Drzwi piekarnika otwarte","event.oven_preheated":"Zako\u0144czono nagrzewanie piekarnika","event.oven_probe_connected":"Sonda piekarnika w u\u017Cyciu","event.oven_probe_target_reached":"Osi\u0105gni\u0119to temperatur\u0119 sondy piekarnika","event.oven_probe_within_ten_degrees":"Sonda piekarnika mniej ni\u017C 10 \xB0F od celu","event.oven_self_clean_complete":"Zako\u0144czono czyszczenie piekarnika","event.oven_service_required":"Piekarnik wymaga serwisu","event.refrigerator_door_ajar":"Drzwi lod\xF3wki otwarte","event.refrigerator_service_required":"Lod\xF3wka wymaga serwisu","event.refrigerator_setpoint_changed":"Zmieniono temperatur\u0119 zadan\u0105 lod\xF3wki","event.rinse_aid_low":"Niski poziom nab\u0142yszczacza","event.softener_salt_low":"Niski poziom soli zmi\u0119kczaj\u0105cej","event.unknown":"Nieznane","event.water_filter_expired":"Filtr wody do wymiany","event.wine_door_ajar":"Drzwi ch\u0142odziarki do wina otwarte","event.wine_setpoint_changed":"Zmieniono temperatur\u0119 zadan\u0105 ch\u0142odziarki do wina","event.wine_temperature_alert":"Temperatura w ch\u0142odziarce do wina poza zakresem","full.appearance":"Wygl\u0105d","full.appliance":"Urz\u0105dzenie","full.events_error":"Nie uda\u0142o si\u0119 wczyta\u0107 zdarze\u0144: {error}","full.events_loading":"Wczytywanie zdarze\u0144\u2026","full.failed":"Nie uda\u0142o si\u0119.","full.no_events":"Brak zdarze\u0144 w ci\u0105gu ostatnich 7 dni.","full.recent_events":"Ostatnie zdarzenia","full.refresh":"Od\u015Bwie\u017C","full.refresh_hint":"Odczytuje teraz stan urz\u0105dzenia.","full.refreshing":"Od\u015Bwie\u017Canie\u2026","info.air_filter":"Filtr powietrza","info.cleaning":"Czyszczenie","info.cycle":"Program","info.delay":"Przerwa","info.ends":"Koniec","info.fan":"Wentylator","info.filter":"Filtr","info.ice_maker":"Kostkarka","info.light":"O\u015Bwietlenie","info.mode":"Tryb","info.model":"Numer modelu","info.next_cleaning":"Nast\u0119pne czyszczenie","info.options":"Opcje","info.probe":"Sonda","info.set_to":"Ustawiono","info.starts":"Start","info.status":"Stan","info.water_filter":"Filtr wody","lock.cycle_no_delay":"Ten program zmywania nie oferuje op\xF3\u017Anionego startu.","lock.cycle_no_option":"Ten program zmywania nie oferuje tej opcji.","lock.delay_not_idle":"Op\xF3\u017Aniony start mo\u017Cna zmieni\u0107 tylko, gdy zmywarka stoi lub czeka na start.","lock.proof_light":"Podczas wyrastania ciasta o\u015Bwietlenie piekarnika pozostaje wy\u0142\u0105czone.","lock.sabbath":"Tryb szabatowy jest w\u0142\u0105czony. Wy\u0142\u0105cz go, aby to zmieni\u0107.","lock.self_clean":"Piekarnik si\u0119 samoczy\u015Bci. Mo\u017Cna go tylko wy\u0142\u0105czy\u0107.","lock.wash_not_idle":"Opcje zmywania mo\u017Cna zmieni\u0107 tylko, gdy zmywarka stoi.","option.10_hours":"10 godzin","option.10_minutes":"10 minut","option.11_hours":"11 godzin","option.12_hours":"12 godzin","option.1_hour":"1 godzina","option.1_minute":"1 minuta","option.2_hours":"2 godziny","option.2_minutes":"2 minuty","option.3_hours":"3 godziny","option.4_hours":"4 godziny","option.5_hours":"5 godzin","option.5_minutes":"5 minut","option.6_hours":"6 godzin","option.7_hours":"7 godzin","option.8_hours":"8 godzin","option.9_hours":"9 godzin","option.add_descaler":"Dodaj odkamieniacz","option.add_sanitizer":"Dodaj \u015Brodek dezynfekuj\u0105cy","option.auto":"Automatyczny","option.automatic":"Automatyczny","option.bake":"Pieczenie","option.bake_stone":"Kamie\u0144 do pieczenia","option.broil":"Grill","option.canceling":"Anulowanie","option.child_lock":"Blokada rodzicielska","option.cleaning_complete":"Czyszczenie zako\u0144czone","option.cleaning_reset_flush":"Reset czyszczenia: p\u0142ukanie","option.cleaning_reset_rinse":"Reset czyszczenia: p\u0142ukanie ko\u0144cowe","option.convection":"Termoobieg","option.convection_bake":"Pieczenie z termoobiegiem","option.convection_broil":"Grill z termoobiegiem","option.convection_roast":"Pieczenie mi\u0119s z termoobiegiem","option.crystal_and_china":"Kryszta\u0142 i porcelana","option.dehydrate":"Suszenie","option.delayed":"Op\xF3\u017Aniona","option.descale_clean":"Odkamienianie: czyszczenie","option.descale_fill":"Odkamienianie: nape\u0142nianie","option.descale_flush":"Odkamienianie: p\u0142ukanie","option.descale_rinse":"Odkamienianie: p\u0142ukanie ko\u0144cowe","option.disabled":"Wy\u0142\u0105czony","option.done":"Zako\u0144czono","option.drying":"Suszenie","option.empty_bin":"Opr\xF3\u017Cnij pojemnik","option.enabled":"W\u0142\u0105czony","option.energy":"Oszcz\u0119dny","option.enhanced":"Zwi\u0119kszony","option.error":"B\u0142\u0105d","option.extra_quiet":"Bardzo cichy","option.heavy":"Intensywny","option.high":"Wysoki","option.high_use":"Intensywne u\u017Cytkowanie","option.idle":"Gotowa","option.light":"Delikatny","option.long_vacation":"D\u0142ugi urlop","option.low":"Niski","option.manual":"R\u0119czny","option.manually_clean":"Wyczy\u015B\u0107 r\u0119cznie","option.max_ice":"Maks. l\xF3d","option.medium":"\u015Aredni","option.night_ice":"L\xF3d nocny","option.none":"Brak","option.normal":"Normalny","option.not_cleaning":"Brak czyszczenia","option.off":"Wy\u0142.","option.on":"W\u0142.","option.paused":"Wstrzymano","option.plastics":"Tworzywa sztuczne","option.pots_and_pans":"Garnki i patelnie","option.proof":"Wyrastanie ciasta","option.quick":"Szybki","option.rinse_and_hold":"P\u0142ukanie wst\u0119pne","option.roast":"Pieczenie mi\u0119s","option.running":"W toku","option.sabbath":"Szabat","option.sanitize_clean":"Dezynfekcja: czyszczenie","option.sanitize_fill":"Dezynfekcja: nape\u0142nianie","option.sanitize_flush":"Dezynfekcja: p\u0142ukanie","option.sanitize_rinse":"Dezynfekcja: p\u0142ukanie ko\u0144cowe","option.self_clean":"Samoczyszczenie","option.short_vacation":"Kr\xF3tki urlop","option.soak_and_scrub":"Namaczanie i szorowanie","option.warm":"Podgrzewanie","pill.cleaning":"Czyszczenie","pill.cleaning_due":"Wymaga czyszczenia","pill.cooking":"Pieczenie","pill.delayed_shutoff":"Op\xF3\u017Anione wy\u0142\u0105czenie","pill.door_open":"Drzwi otwarte","pill.fan":"Wentylator {speed}","pill.high_use":"Intensywne u\u017Cytkowanie","pill.light":"\u015Awiat\u0142o w\u0142.","pill.making_ice":"Robi l\xF3d","pill.normal":"Normalny","pill.off":"Wy\u0142.","pill.offline":"Offline","pill.paused":"Wstrzymano","pill.preheated":"Nagrzany","pill.preheating":"Nagrzewanie {pct}%","pill.remote_ready":"Remote Ready","pill.sabbath":"Szabat","pill.self_clean":"Samoczyszczenie","pill.service":"Serwis","pill.temp_alert":"Alarm temperatury","pill.timer":"Minutnik {time}","pill.timer_done":"Minutnik zako\u0144czy\u0142","pill.vacation":"Urlop","reason.choose_mode":"Najpierw wybierz tryb pieczenia.","reason.close_door":"Najpierw zamknij drzwi.","reason.close_oven_door":"Najpierw zamknij drzwi piekarnika.","reason.crisper_auto":"Ustaw szuflad\u0119 na warzywa na tryb r\u0119czny, aby to zmieni\u0107.","reason.dishwasher_busy":"Mo\u017Cna zmieni\u0107 tylko, gdy zmywarka stoi.","reason.manual_mode":"Uruchom ten tryb na piekarniku.","reason.max_ice":"Wy\u0142\u0105cz Maks. l\xF3d, aby zmieni\u0107 temperatur\u0119 zamra\u017Carki.","reason.mode_change_disabled":"Piekarnik nie przyjmuje teraz zmiany trybu.","reason.no_temperature":"Ten tryb nie ma temperatury do ustawienia.","reason.offline":"Urz\u0105dzenie jest offline.","reason.oven_not_ready":"Dost\u0119pne, gdy piekarnik dzia\u0142a lub jest w trybie Remote Ready.","reason.remote_ready_dishwasher":"Najpierw w\u0142\u0105cz Remote Ready na zmywarce.","reason.remote_ready_oven":"W\u0142\u0105cz Remote Ready na piekarniku, aby uruchomi\u0107 go st\u0105d.","reason.set_temperature":"Najpierw ustaw temperatur\u0119.","reason.start_at_oven":"W\u0142\u0105cz go na piekarniku.","reason.unavailable":"Teraz niedost\u0119pne.","reason.use_start":"W\u0142\u0105cz go przyciskiem Uruchom poni\u017Cej.","section.cleaning":"Czyszczenie","section.cycle":"Cykl zmywania","section.delayed_shutoff":"Op\xF3\u017Anione wy\u0142\u0105czenie","section.details":"Szczeg\xF3\u0142y","section.fan_light":"Wentylator i o\u015Bwietlenie","section.filters":"Filtry i konserwacja","section.ice_delay":"Przerwa w produkcji lodu","section.ice_maker":"Kostkarka do lodu","section.maintenance":"Konserwacja","section.modes":"Tryby","section.options":"Opcje","section.settings":"Ustawienia","section.temperatures":"Temperatury","severity.critical":"Krytyczna","severity.high":"Wysoka","severity.low":"Niska","severity.medium":"\u015Arednia","severity.undefined":"Nieokre\u015Blona","severity.unknown":"Nieznana","severity.urgent":"Pilna","unit.days":"{n} d","unit.days_hours":"{d} d {h} godz.","unit.hours":"{n} godz.","unit.hours_minutes":"{h} godz. {m} min","unit.minutes":"{n} min","value.alert":"Alarm","value.daily_for":"Codziennie przez {duration}","value.daily_from":"Codziennie od {time} przez {duration}","value.done":"Gotowe","value.door_open":"Drzwi otwarte","value.due_now":"Teraz","value.due_soon":"Wkr\xF3tce","value.ends_at":"Koniec o {time}","value.from_for":"Od {time} przez {duration}","value.in_cycles":"Pozosta\u0142o cykli: {n}","value.inserted":"Za\u0142o\u017Cony","value.low":"Niski poziom","value.missing":"Brak","value.no_faults":"Brak","value.none":"Brak","value.normal":"Normalna","value.not_connected":"Niepod\u0142\u0105czona","value.not_due":"Jeszcze nie","value.not_needed":"Niewymagany","value.now":"Teraz {temp}","value.off":"Wy\u0142.","value.ok":"W porz\u0105dku","value.on":"W\u0142.","value.percent_used":"Zu\u017Cyto {pct}%","value.probe_close":"W granicach 10 \xB0F od celu","value.probe_done":"Osi\u0105gni\u0119to cel","value.replace":"Do wymiany","value.required":"Wymagany","value.speed":"Bieg {speed}","value.under_minute":"Mniej ni\u017C minuta","value.until":"Do {time}","wifi.excellent":"Doskona\u0142y","wifi.fair":"\u015Aredni","wifi.good":"Dobry","wifi.weak":"S\u0142aby","zone.crisp":"Szuflada na warzywa","zone.frz":"Zamra\u017Carka","zone.ref":"Lod\xF3wka","zone.ref2":"Szuflada ch\u0142odz\u0105ca","zone.short.crisp":"Warzywa","zone.short.frz":"Zamra\u017Carka","zone.short.ref":"Lod\xF3wka","zone.short.ref2":"Szuflada","zone.short.wine":"Wino","zone.short.wine_lower":"D\xF3\u0142","zone.short.wine_upper":"G\xF3ra","zone.wine":"Ch\u0142odziarka do wina","zone.wine_lower":"Dolna strefa","zone.wine_upper":"G\xF3rna strefa"};var _s={"action.cancel_cycle":"Avbryt programmet","action.cancel_schedule":"Avbryt","action.dismiss":"Kvittera","action.end":"Avsluta","action.reset":"\xC5terst\xE4ll","action.start":"Starta","cavity.left":"V\xE4nster ugn","cavity.lower":"Nedre ugn","cavity.right":"H\xF6ger ugn","cavity.single":"Ugn","cavity.upper":"\xD6vre ugn","confirm.cancel_cycle":"Avbryta diskprogrammet?","confirm.start.left":"Starta v\xE4nster ugn p\xE5 {setting}?","confirm.start.lower":"Starta nedre ugnen p\xE5 {setting}?","confirm.start.right":"Starta h\xF6ger ugn p\xE5 {setting}?","confirm.start.single":"Starta ugnen p\xE5 {setting}?","confirm.start.upper":"Starta \xF6vre ugnen p\xE5 {setting}?","confirm.start_dishwasher":"Starta {cycle} p\xE5 diskmaskinen?","control.accent_light":"St\xE4mningsbelysning","control.air_filter":"Luftfilter","control.air_purification":"Luftrening","control.appliance_type":"Apparattyp","control.broil_level":"Grillniv\xE5","control.cancel_cycle":"P\xE5g\xE5ende program","control.cancel_delay":"Schemalagd ispaus","control.clean_due":"Reng\xF6ring beh\xF6vs","control.clean_stage":"Reng\xF6ringssteg","control.control_lock":"Knappl\xE5s","control.cook_mode":"Tillagningsl\xE4ge","control.cook_timer":"Tillagningstimer","control.crisper_mode":"Gr\xF6nsaksl\xE5dans temperatur","control.cycles_until_cleaning":"Iscykler till reng\xF6ring","control.delay_left":"Pausen slutar om","control.delay_schedule":"Schema","control.delay_start":"F\xF6rdr\xF6jd start","control.delayed_shutoff":"F\xF6rdr\xF6jd avst\xE4ngning","control.dishwasher_mode":"L\xE4ge","control.dispenser":"Inbyggd vattenautomat","control.door_open_delay":"F\xF6rdr\xF6jning f\xF6r d\xF6rrlarm","control.duration":"L\xE4ngd","control.end_delay":"P\xE5g\xE5ende paus","control.extended_dry_on":"F\xF6rl\xE4ngd torkning","control.failsafe":"S\xE4kerhetsavst\xE4ngning","control.fan":"Fl\xE4kt","control.fan_sensitivity":"Automatisk fl\xE4ktk\xE4nslighet","control.fault":"Fel {code}","control.fault_code":"Kod {code}","control.fault_unknown":"Fel","control.faults":"Aktiva fel","control.filter_allowance":"Filtrets livsl\xE4ngd","control.filter_usage":"Filteranv\xE4ndning","control.gourmet":"Gourmetprogram","control.halo":"Haloljus","control.heated_dry_on":"Extra torkning","control.high_temp_wash_on":"Disk med h\xF6g temperatur","control.high_use_left":"H\xF6g anv\xE4ndning slutar om","control.humidity":"Fuktreglering","control.ice_maker":"Ismaskin","control.key_tones":"Knappljud","control.kitchen_timer":"K\xF6kstimer","control.kitchen_timer2":"K\xF6kstimer 2","control.light":"Belysning","control.max_ice_left":"Max is slutar om","control.model":"Modell","control.next_cleaning":"N\xE4sta reng\xF6ring","control.night_mode":"Nattl\xE4ge","control.operating_mode":"L\xE4ge","control.power":"Str\xF6m","control.probe":"Stektermometer","control.probe_target":"M\xE5ltemperatur f\xF6r termometern","control.remote_ready":"Remote Ready","control.remote_start":"Fj\xE4rrstart","control.reset_air_filter":"\xC5terst\xE4ll luftfiltret","control.rinse_aid":"Spolglans","control.sabbath":"Sabbatsl\xE4ge","control.sani_rinse_on":"Hygiensk\xF6ljning","control.schedule_delay":"Ny ispaus","control.service":"Service","control.shutoff_after":"St\xE4ng av efter","control.softener":"Regenereringssalt","control.starts_in":"Startar om","control.status":"Tillst\xE5nd","control.task_light":"Arbetsbelysning","control.temperature":"Temperatur","control.time_left":"Tid kvar","control.timer_finished":"Timern \xE4r klar","control.top_rack_only_on":"Endast \xF6vre korgen","control.uptime":"Drifttid","control.wash_cycle":"Diskprogram","control.water_filter":"Vattenfilter","control.water_filter_capacity":"Vattenfiltrets kapacitet","control.wifi":"Wi-Fi-signal","control.wine_temp_alert":"Temperaturlarm","control.winterized":"Vinterf\xF6rvarad","ctl.at":"Starttid","ctl.brightness":"Ljusstyrka","ctl.custom":"Anpassad","ctl.decrease":"Minska","ctl.duration":"L\xE4ngd","ctl.increase":"\xD6ka","ctl.later":"Senare i dag","ctl.minutes":"Minuter","ctl.not_now":"Inte nu","ctl.now":"Nu","ctl.off":"Av","ctl.on":"P\xE5","ctl.repeat":"Upprepa dagligen","ctl.saving":"Sparar \u2026","ctl.schedule":"Schemal\xE4gg","ctl.set":"St\xE4ll in","ctl.speed":"Hastighet {n}","ctl.start":"B\xF6rjan","ctl.starts_in":"Startar om {time}","ctl.white":"Vit f\xE4rgton","display.starts_at":"Start {time}","event.air_filter_expired":"Luftfiltret beh\xF6ver bytas","event.cavity.cooking_timer_complete":"Tillagningstimern \xE4r klar","event.cavity.cooking_timer_under_one_minute":"Tillagningstimern har en minut kvar","event.cavity.door_ajar":"Luckan \xE4r \xF6ppen","event.cavity.preheated":"F\xF6rv\xE4rmningen \xE4r klar","event.cavity.probe_connected":"Stektermometern anv\xE4nds","event.cavity.probe_target_reached":"Stektermometern har n\xE5tt m\xE5ltemperaturen","event.cavity.probe_within_ten_degrees":"Stektermometern \xE4r inom 10 \xB0F fr\xE5n m\xE5let","event.cavity.self_clean_complete":"Reng\xF6ringen \xE4r klar","event.dishwasher_cancelled":"Diskprogrammet har avbrutits","event.dishwasher_complete":"Diskprogrammet \xE4r klart","event.dishwasher_paused":"Diskprogrammet har pausats","event.dishwasher_service_required":"Diskmaskinen beh\xF6ver service","event.dishwasher_started":"Diskprogrammet har startat","event.fault_notification":"Fel p\xE5 vitvaran","event.feedback_notification":"Beg\xE4ran om \xE5terkoppling","event.freezer_door_ajar":"Frysd\xF6rren \xE4r \xF6ppen","event.freezer_setpoint_changed":"Frysens inst\xE4llda temperatur har \xE4ndrats","event.ice_cleaning_add_descaler":"Ismaskinens reng\xF6ringscykel beh\xF6ver avkalkningsmedel","event.ice_cleaning_add_sanitizer":"Ismaskinens reng\xF6ringscykel beh\xF6ver desinfektionsmedel","event.ice_cleaning_cancelled":"Ismaskinens reng\xF6ringscykel har avbrutits","event.ice_cleaning_complete":"Ismaskinens reng\xF6ringscykel \xE4r klar","event.ice_cleaning_due_soon":"Ismaskinens reng\xF6ringscykel beh\xF6vs snart","event.ice_cleaning_required":"Ismaskinens reng\xF6ringscykel beh\xF6vs","event.ice_maker_door_ajar":"Ismaskinens lucka \xE4r \xF6ppen","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"K\xF6kstimer 2 \xE4r klar","event.kitchen_timer_2_under_one_minute":"K\xF6kstimer 2 har en minut kvar","event.kitchen_timer_complete":"K\xF6kstimern \xE4r klar","event.kitchen_timer_under_one_minute":"K\xF6kstimern har en minut kvar","event.lower_oven_cooking_timer_complete":"Nedre ugnens tillagningstimer \xE4r klar","event.lower_oven_cooking_timer_under_one_minute":"Nedre ugnens tillagningstimer har en minut kvar","event.lower_oven_door_ajar":"Nedre ugnens lucka \xE4r \xF6ppen","event.lower_oven_preheated":"Nedre ugnens f\xF6rv\xE4rmning \xE4r klar","event.lower_oven_probe_connected":"Nedre ugnens stektermometer anv\xE4nds","event.lower_oven_probe_target_reached":"Nedre ugnens stektermometer har n\xE5tt m\xE5ltemperaturen","event.lower_oven_probe_within_ten_degrees":"Nedre ugnens stektermometer \xE4r inom 10 \xB0F fr\xE5n m\xE5let","event.lower_oven_self_clean_complete":"Nedre ugnens reng\xF6ring \xE4r klar","event.oven_cooking_timer_complete":"Ugnens tillagningstimer \xE4r klar","event.oven_cooking_timer_under_one_minute":"Ugnens tillagningstimer har en minut kvar","event.oven_door_ajar":"Ugnsluckan \xE4r \xF6ppen","event.oven_preheated":"Ugnens f\xF6rv\xE4rmning \xE4r klar","event.oven_probe_connected":"Ugnens stektermometer anv\xE4nds","event.oven_probe_target_reached":"Ugnens stektermometer har n\xE5tt m\xE5ltemperaturen","event.oven_probe_within_ten_degrees":"Ugnens stektermometer \xE4r inom 10 \xB0F fr\xE5n m\xE5let","event.oven_self_clean_complete":"Ugnsreng\xF6ringen \xE4r klar","event.oven_service_required":"Ugnen beh\xF6ver service","event.refrigerator_door_ajar":"Kylsk\xE5psd\xF6rren \xE4r \xF6ppen","event.refrigerator_service_required":"Kylsk\xE5pet beh\xF6ver service","event.refrigerator_setpoint_changed":"Kylsk\xE5pets inst\xE4llda temperatur har \xE4ndrats","event.rinse_aid_low":"Spolglansen h\xE5ller p\xE5 att ta slut","event.softener_salt_low":"Avh\xE4rdningssaltet h\xE5ller p\xE5 att ta slut","event.unknown":"Ok\xE4nd","event.water_filter_expired":"Vattenfiltret beh\xF6ver bytas","event.wine_door_ajar":"Vinkylens d\xF6rr \xE4r \xF6ppen","event.wine_setpoint_changed":"Vinkylens inst\xE4llda temperatur har \xE4ndrats","event.wine_temperature_alert":"Vinkylens temperatur \xE4r utanf\xF6r intervallet","full.appearance":"Utseende","full.appliance":"Apparat","full.events_error":"Det gick inte att l\xE4sa in h\xE4ndelserna: {error}","full.events_loading":"L\xE4ser in h\xE4ndelser \u2026","full.failed":"Det fungerade inte.","full.no_events":"Inga h\xE4ndelser de senaste 7 dagarna.","full.recent_events":"Senaste h\xE4ndelser","full.refresh":"Uppdatera","full.refresh_hint":"L\xE4ser apparatens status nu.","full.refreshing":"Uppdaterar \u2026","info.air_filter":"Luftfilter","info.cleaning":"Reng\xF6ring","info.cycle":"Program","info.delay":"Ispaus","info.ends":"Klar","info.fan":"Fl\xE4kt","info.filter":"Filter","info.ice_maker":"Ismaskin","info.light":"Belysning","info.mode":"L\xE4ge","info.model":"Modell","info.next_cleaning":"N\xE4sta reng\xF6ring","info.options":"Tillval","info.probe":"Termometer","info.set_to":"Inst\xE4lld p\xE5","info.starts":"Startar","info.status":"Tillst\xE5nd","info.water_filter":"Vattenfilter","lock.cycle_no_delay":"Det h\xE4r diskprogrammet har ingen f\xF6rdr\xF6jd start.","lock.cycle_no_option":"Det h\xE4r diskprogrammet har inte det h\xE4r tillvalet.","lock.delay_not_idle":"F\xF6rdr\xF6jd start kan bara \xE4ndras n\xE4r diskmaskinen st\xE5r still eller v\xE4ntar.","lock.proof_light":"Ugnsbelysningen \xE4r sl\xE4ckt under j\xE4sning.","lock.sabbath":"Sabbatsl\xE4get \xE4r p\xE5. St\xE4ng av det f\xF6r att \xE4ndra det h\xE4r.","lock.self_clean":"Ugnen reng\xF6r sig sj\xE4lv. Den kan bara st\xE4ngas av.","lock.wash_not_idle":"Disktillvalen kan bara \xE4ndras n\xE4r diskmaskinen st\xE5r still.","option.10_hours":"10 timmar","option.10_minutes":"10 minuter","option.11_hours":"11 timmar","option.12_hours":"12 timmar","option.1_hour":"1 timme","option.1_minute":"1 minut","option.2_hours":"2 timmar","option.2_minutes":"2 minuter","option.3_hours":"3 timmar","option.4_hours":"4 timmar","option.5_hours":"5 timmar","option.5_minutes":"5 minuter","option.6_hours":"6 timmar","option.7_hours":"7 timmar","option.8_hours":"8 timmar","option.9_hours":"9 timmar","option.add_descaler":"Fyll p\xE5 avkalkningsmedel","option.add_sanitizer":"Fyll p\xE5 desinfektionsmedel","option.auto":"Automatiskt","option.automatic":"Automatisk","option.bake":"Baka","option.bake_stone":"Baksten","option.broil":"Grilla","option.canceling":"Avbryter","option.child_lock":"Barnl\xE5s","option.cleaning_complete":"Reng\xF6ringen \xE4r klar","option.cleaning_reset_flush":"\xC5terst\xE4llning av reng\xF6ring: genomspolning","option.cleaning_reset_rinse":"\xC5terst\xE4llning av reng\xF6ring: sk\xF6ljning","option.convection":"Varmluft","option.convection_bake":"Varmluft, baka","option.convection_broil":"Varmluftsgrill","option.convection_roast":"Varmluft, steka","option.crystal_and_china":"Kristall och porslin","option.dehydrate":"Torkning","option.delayed":"F\xF6rdr\xF6jd","option.descale_clean":"Avkalkning: reng\xF6ring","option.descale_fill":"Avkalkning: fyllning","option.descale_flush":"Avkalkning: genomspolning","option.descale_rinse":"Avkalkning: sk\xF6ljning","option.disabled":"Avaktiverad","option.done":"Klar","option.drying":"Torkar","option.empty_bin":"T\xF6m beh\xE5llaren","option.enabled":"Aktiverad","option.energy":"Energisn\xE5l","option.enhanced":"F\xF6rst\xE4rkt","option.error":"Fel","option.extra_quiet":"Extra tyst","option.heavy":"Intensiv","option.high":"H\xF6g","option.high_use":"H\xF6g anv\xE4ndning","option.idle":"Redo","option.light":"L\xE4tt","option.long_vacation":"L\xE5ng semester","option.low":"L\xE5g","option.manual":"Manuell","option.manually_clean":"Reng\xF6r f\xF6r hand","option.max_ice":"Max is","option.medium":"Medel","option.night_ice":"Nattis","option.none":"Inget","option.normal":"Normalt","option.not_cleaning":"Ingen reng\xF6ring","option.off":"Av","option.on":"P\xE5","option.paused":"Pausad","option.plastics":"Plast","option.pots_and_pans":"Kastruller och pannor","option.proof":"J\xE4sning","option.quick":"Snabb","option.rinse_and_hold":"Sk\xF6ljning och v\xE4ntan","option.roast":"Steka","option.running":"P\xE5g\xE5r","option.sabbath":"Sabbat","option.sanitize_clean":"Desinficering: reng\xF6ring","option.sanitize_fill":"Desinficering: fyllning","option.sanitize_flush":"Desinficering: genomspolning","option.sanitize_rinse":"Desinficering: sk\xF6ljning","option.self_clean":"Sj\xE4lvreng\xF6ring","option.short_vacation":"Kort semester","option.soak_and_scrub":"Bl\xF6tl\xE4ggning och skurning","option.warm":"Varmh\xE5llning","pill.cleaning":"Reng\xF6r","pill.cleaning_due":"Reng\xF6ring beh\xF6vs","pill.cooking":"Tillagar","pill.delayed_shutoff":"F\xF6rdr\xF6jd avst\xE4ngning","pill.door_open":"D\xF6rren \xF6ppen","pill.fan":"Fl\xE4kt {speed}","pill.high_use":"H\xF6g anv\xE4ndning","pill.light":"Belysning p\xE5","pill.making_ice":"G\xF6r is","pill.normal":"Normalt","pill.off":"Av","pill.offline":"Offline","pill.paused":"Pausad","pill.preheated":"F\xF6rv\xE4rmd","pill.preheating":"F\xF6rv\xE4rmer {pct} %","pill.remote_ready":"Remote Ready","pill.sabbath":"Sabbat","pill.self_clean":"Sj\xE4lvreng\xF6ring","pill.service":"Service beh\xF6vs","pill.temp_alert":"Temperaturlarm","pill.timer":"Timer {time}","pill.timer_done":"Timern \xE4r klar","pill.vacation":"Semester","reason.choose_mode":"V\xE4lj ett tillagningsl\xE4ge f\xF6rst.","reason.close_door":"St\xE4ng d\xF6rren f\xF6rst.","reason.close_oven_door":"St\xE4ng ugnsluckan f\xF6rst.","reason.crisper_auto":"St\xE4ll gr\xF6nsaksl\xE5dan p\xE5 Manuell f\xF6r att \xE4ndra den.","reason.dishwasher_busy":"Kan bara \xE4ndras n\xE4r diskmaskinen st\xE5r still.","reason.manual_mode":"Starta det h\xE4r l\xE4get p\xE5 ugnen.","reason.max_ice":"St\xE4ng av Max is f\xF6r att \xE4ndra frysens temperatur.","reason.mode_change_disabled":"Ugnen tar inte emot l\xE4gesbyten just nu.","reason.no_temperature":"Det h\xE4r l\xE4get har ingen temperatur att st\xE4lla in.","reason.offline":"Apparaten \xE4r offline.","reason.oven_not_ready":"Tillg\xE4nglig n\xE4r ugnen \xE4r p\xE5 eller i Remote Ready.","reason.remote_ready_dishwasher":"Sl\xE5 p\xE5 Remote Ready p\xE5 diskmaskinen f\xF6rst.","reason.remote_ready_oven":"Sl\xE5 p\xE5 Remote Ready p\xE5 ugnen f\xF6r att starta den h\xE4rifr\xE5n.","reason.set_temperature":"St\xE4ll in temperaturen f\xF6rst.","reason.start_at_oven":"Sl\xE5 p\xE5 den p\xE5 ugnen.","reason.unavailable":"Inte tillg\xE4nglig just nu.","reason.use_start":"Sl\xE5 p\xE5 den med Starta nedan.","section.cleaning":"Reng\xF6ring","section.cycle":"Diskprogram","section.delayed_shutoff":"F\xF6rdr\xF6jd avst\xE4ngning","section.details":"Detaljer","section.fan_light":"Fl\xE4kt och belysning","section.filters":"Filter och underh\xE5ll","section.ice_delay":"Ispaus","section.ice_maker":"Ismaskin","section.maintenance":"Underh\xE5ll","section.modes":"L\xE4gen","section.options":"Tillval","section.settings":"Inst\xE4llningar","section.temperatures":"Temperaturer","severity.critical":"Kritisk","severity.high":"H\xF6g","severity.low":"L\xE5g","severity.medium":"Medel","severity.undefined":"Ospecificerad","severity.unknown":"Ok\xE4nd","severity.urgent":"Br\xE5dskande","unit.days":"{n} d","unit.days_hours":"{d} d {h} tim","unit.hours":"{n} tim","unit.hours_minutes":"{h} tim {m} min","unit.minutes":"{n} min","value.alert":"Larm","value.daily_for":"Dagligen i {duration}","value.daily_from":"Dagligen fr\xE5n {time} i {duration}","value.done":"Klar","value.door_open":"D\xF6rren \xF6ppen","value.due_now":"Nu","value.due_soon":"Snart","value.ends_at":"Klar {time}","value.from_for":"Fr\xE5n {time} i {duration}","value.in_cycles":"Om {n} cykler","value.inserted":"Isatt","value.low":"L\xE5g niv\xE5","value.missing":"Saknas","value.no_faults":"Inga","value.none":"Inga","value.normal":"Normal","value.not_connected":"Inte ansluten","value.not_due":"Inte \xE4n","value.not_needed":"Beh\xF6vs inte","value.now":"Nu {temp}","value.off":"Av","value.ok":"Bra","value.on":"P\xE5","value.percent_used":"{pct} % anv\xE4nt","value.probe_close":"Inom 10 \xB0F fr\xE5n m\xE5let","value.probe_done":"M\xE5let n\xE5tt","value.replace":"Byt","value.required":"Beh\xF6vs","value.speed":"Hastighet {speed}","value.under_minute":"Under en minut","value.until":"Till {time}","wifi.excellent":"Utm\xE4rkt","wifi.fair":"Godtagbar","wifi.good":"Bra","wifi.weak":"Svag","zone.crisp":"Gr\xF6nsaksl\xE5da","zone.frz":"Frys","zone.ref":"Kylsk\xE5p","zone.ref2":"Kyll\xE5da","zone.short.crisp":"Gr\xF6nsaker","zone.short.frz":"Frys","zone.short.ref":"Kylsk\xE5p","zone.short.ref2":"L\xE5da","zone.short.wine":"Vin","zone.short.wine_lower":"Nedre","zone.short.wine_upper":"\xD6vre","zone.wine":"Vinkyl","zone.wine_lower":"Nedre zon","zone.wine_upper":"\xD6vre zon"};var bs={"action.cancel_cycle":"\u53D6\u6D88\u7A0B\u5E8F","action.cancel_schedule":"\u53D6\u6D88","action.dismiss":"\u786E\u8BA4","action.end":"\u7ED3\u675F","action.reset":"\u91CD\u7F6E","action.start":"\u542F\u52A8","cavity.left":"\u5DE6\u70E4\u7BB1","cavity.lower":"\u4E0B\u70E4\u7BB1","cavity.right":"\u53F3\u70E4\u7BB1","cavity.single":"\u70E4\u7BB1","cavity.upper":"\u4E0A\u70E4\u7BB1","confirm.cancel_cycle":"\u8981\u53D6\u6D88\u6D17\u6DA4\u7A0B\u5E8F\u5417\uFF1F","confirm.start.left":"\u8981\u4EE5{setting}\u542F\u52A8\u5DE6\u70E4\u7BB1\u5417\uFF1F","confirm.start.lower":"\u8981\u4EE5{setting}\u542F\u52A8\u4E0B\u70E4\u7BB1\u5417\uFF1F","confirm.start.right":"\u8981\u4EE5{setting}\u542F\u52A8\u53F3\u70E4\u7BB1\u5417\uFF1F","confirm.start.single":"\u8981\u4EE5{setting}\u542F\u52A8\u70E4\u7BB1\u5417\uFF1F","confirm.start.upper":"\u8981\u4EE5{setting}\u542F\u52A8\u4E0A\u70E4\u7BB1\u5417\uFF1F","confirm.start_dishwasher":"\u8981\u5728\u6D17\u7897\u673A\u4E0A\u542F\u52A8{cycle}\u5417\uFF1F","control.accent_light":"\u6C1B\u56F4\u706F","control.air_filter":"\u7A7A\u6C14\u6EE4\u7F51","control.air_purification":"\u7A7A\u6C14\u51C0\u5316","control.appliance_type":"\u7535\u5668\u7C7B\u578B","control.broil_level":"\u7099\u70E4\u6863\u4F4D","control.cancel_cycle":"\u5F53\u524D\u7A0B\u5E8F","control.cancel_delay":"\u5DF2\u5B89\u6392\u7684\u5236\u51B0\u6682\u505C","control.clean_due":"\u9700\u8981\u6E05\u6D01","control.clean_stage":"\u6E05\u6D01\u6B65\u9AA4","control.control_lock":"\u6309\u952E\u9501","control.cook_mode":"\u70F9\u996A\u6A21\u5F0F","control.cook_timer":"\u70F9\u996A\u5B9A\u65F6\u5668","control.crisper_mode":"\u679C\u852C\u76D2\u6E29\u5EA6","control.cycles_until_cleaning":"\u8DDD\u6E05\u6D01\u7684\u5236\u51B0\u6B21\u6570","control.delay_left":"\u6682\u505C\u5269\u4F59","control.delay_schedule":"\u8BA1\u5212","control.delay_start":"\u5EF6\u65F6\u542F\u52A8","control.delayed_shutoff":"\u5EF6\u65F6\u5173\u95ED","control.dishwasher_mode":"\u6A21\u5F0F","control.dispenser":"\u5185\u7F6E\u996E\u6C34\u673A","control.door_open_delay":"\u5F00\u95E8\u63D0\u9192\u5EF6\u65F6","control.duration":"\u65F6\u957F","control.end_delay":"\u5F53\u524D\u6682\u505C","control.extended_dry_on":"\u5EF6\u957F\u70D8\u5E72","control.failsafe":"\u5B89\u5168\u505C\u673A","control.fan":"\u98CE\u6247","control.fan_sensitivity":"\u98CE\u6247\u81EA\u52A8\u7075\u654F\u5EA6","control.fault":"\u6545\u969C {code}","control.fault_code":"\u4EE3\u7801 {code}","control.fault_unknown":"\u6545\u969C","control.faults":"\u5F53\u524D\u6545\u969C","control.filter_allowance":"\u6EE4\u7F51\u5BFF\u547D","control.filter_usage":"\u6EE4\u7F51\u4F7F\u7528\u65F6\u95F4","control.gourmet":"\u7F8E\u98DF\u7A0B\u5E8F","control.halo":"\u5149\u73AF\u706F","control.heated_dry_on":"\u5F3A\u529B\u70D8\u5E72","control.high_temp_wash_on":"\u9AD8\u6E29\u6D17\u6DA4","control.high_use_left":"\u9AD8\u4F7F\u7528\u6A21\u5F0F\u5269\u4F59","control.humidity":"\u6E7F\u5EA6\u63A7\u5236","control.ice_maker":"\u5236\u51B0\u673A","control.key_tones":"\u6309\u952E\u97F3","control.kitchen_timer":"\u53A8\u623F\u5B9A\u65F6\u5668","control.kitchen_timer2":"\u53A8\u623F\u5B9A\u65F6\u5668 2","control.light":"\u7167\u660E","control.max_ice_left":"\u6700\u5927\u5236\u51B0\u5269\u4F59","control.model":"\u578B\u53F7","control.next_cleaning":"\u4E0B\u6B21\u6E05\u6D01","control.night_mode":"\u591C\u95F4\u6A21\u5F0F","control.operating_mode":"\u6A21\u5F0F","control.power":"\u7535\u6E90","control.probe":"\u6E29\u5EA6\u63A2\u9488","control.probe_target":"\u63A2\u9488\u76EE\u6807\u6E29\u5EA6","control.remote_ready":"Remote Ready","control.remote_start":"\u8FDC\u7A0B\u542F\u52A8","control.reset_air_filter":"\u91CD\u7F6E\u7A7A\u6C14\u6EE4\u7F51","control.rinse_aid":"\u5149\u4EAE\u5242","control.sabbath":"\u5B89\u606F\u65E5\u6A21\u5F0F","control.sani_rinse_on":"\u6D88\u6BD2\u6F02\u6D17","control.schedule_delay":"\u65B0\u7684\u5236\u51B0\u6682\u505C","control.service":"\u7EF4\u4FEE","control.shutoff_after":"\u5173\u95ED\u65F6\u95F4","control.softener":"\u8F6F\u6C34\u76D0","control.starts_in":"\u8DDD\u5F00\u59CB","control.status":"\u72B6\u6001","control.task_light":"\u5DE5\u4F5C\u706F","control.temperature":"\u6E29\u5EA6","control.time_left":"\u5269\u4F59\u65F6\u95F4","control.timer_finished":"\u5B9A\u65F6\u7ED3\u675F","control.top_rack_only_on":"\u4EC5\u4E0A\u5C42\u7897\u7BEE","control.uptime":"\u8FD0\u884C\u65F6\u95F4","control.wash_cycle":"\u6D17\u6DA4\u7A0B\u5E8F","control.water_filter":"\u6EE4\u6C34\u5668","control.water_filter_capacity":"\u6EE4\u6C34\u5668\u5269\u4F59\u5BB9\u91CF","control.wifi":"Wi-Fi \u4FE1\u53F7","control.wine_temp_alert":"\u6E29\u5EA6\u8B66\u62A5","control.winterized":"\u8D8A\u51AC\u6A21\u5F0F","ctl.at":"\u5F00\u59CB\u65F6\u95F4","ctl.brightness":"\u4EAE\u5EA6","ctl.custom":"\u81EA\u5B9A\u4E49","ctl.decrease":"\u964D\u4F4E","ctl.duration":"\u65F6\u957F","ctl.increase":"\u63D0\u9AD8","ctl.later":"\u4ECA\u5929\u7A0D\u540E","ctl.minutes":"\u5206\u949F","ctl.not_now":"\u6682\u4E0D","ctl.now":"\u7ACB\u5373","ctl.off":"\u5173","ctl.on":"\u5F00","ctl.repeat":"\u6BCF\u5929\u91CD\u590D","ctl.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","ctl.schedule":"\u5B89\u6392","ctl.set":"\u8BBE\u7F6E","ctl.speed":"{n} \u6863","ctl.start":"\u5F00\u59CB","ctl.starts_in":"{time}\u540E\u5F00\u59CB","ctl.white":"\u8272\u6E29","display.starts_at":"{time} \u5F00\u59CB","event.air_filter_expired":"\u7A7A\u6C14\u8FC7\u6EE4\u5668\u5DF2\u5230\u671F","event.cavity.cooking_timer_complete":"\u70F9\u996A\u5B9A\u65F6\u5668\u7ED3\u675F","event.cavity.cooking_timer_under_one_minute":"\u70F9\u996A\u5B9A\u65F6\u5668\u5269\u4F59\u4E00\u5206\u949F","event.cavity.door_ajar":"\u95E8\u672A\u5173","event.cavity.preheated":"\u9884\u70ED\u5B8C\u6210","event.cavity.probe_connected":"\u63A2\u9488\u4F7F\u7528\u4E2D","event.cavity.probe_target_reached":"\u63A2\u9488\u5DF2\u8FBE\u5230\u76EE\u6807\u6E29\u5EA6","event.cavity.probe_within_ten_degrees":"\u63A2\u9488\u6E29\u5EA6\u8DDD\u76EE\u6807\u4E0D\u8DB3 10\xB0F","event.cavity.self_clean_complete":"\u6E05\u6D01\u5B8C\u6210","event.dishwasher_cancelled":"\u6D17\u6DA4\u7A0B\u5E8F\u5DF2\u53D6\u6D88","event.dishwasher_complete":"\u6D17\u6DA4\u7A0B\u5E8F\u5DF2\u5B8C\u6210","event.dishwasher_paused":"\u6D17\u6DA4\u7A0B\u5E8F\u5DF2\u4E2D\u65AD","event.dishwasher_service_required":"\u6D17\u7897\u673A\u9700\u8981\u7EF4\u4FEE","event.dishwasher_started":"\u6D17\u6DA4\u7A0B\u5E8F\u5DF2\u5F00\u59CB","event.fault_notification":"\u7535\u5668\u6545\u969C","event.feedback_notification":"\u53CD\u9988\u8BF7\u6C42","event.freezer_door_ajar":"\u51B7\u51BB\u5BA4\u95E8\u672A\u5173","event.freezer_setpoint_changed":"\u51B7\u51BB\u5BA4\u8BBE\u5B9A\u6E29\u5EA6\u5DF2\u66F4\u6539","event.ice_cleaning_add_descaler":"\u5236\u51B0\u673A\u6E05\u6D01\u7A0B\u5E8F\u9700\u8981\u6DFB\u52A0\u9664\u57A2\u5242","event.ice_cleaning_add_sanitizer":"\u5236\u51B0\u673A\u6E05\u6D01\u7A0B\u5E8F\u9700\u8981\u6DFB\u52A0\u6D88\u6BD2\u5242","event.ice_cleaning_cancelled":"\u5236\u51B0\u673A\u6E05\u6D01\u7A0B\u5E8F\u5DF2\u53D6\u6D88","event.ice_cleaning_complete":"\u5236\u51B0\u673A\u6E05\u6D01\u7A0B\u5E8F\u5DF2\u5B8C\u6210","event.ice_cleaning_due_soon":"\u5236\u51B0\u673A\u5373\u5C06\u9700\u8981\u6E05\u6D01","event.ice_cleaning_required":"\u5236\u51B0\u673A\u9700\u8981\u6E05\u6D01","event.ice_maker_door_ajar":"\u5236\u51B0\u673A\u95E8\u672A\u5173","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"\u53A8\u623F\u5B9A\u65F6\u5668 2 \u7ED3\u675F","event.kitchen_timer_2_under_one_minute":"\u53A8\u623F\u5B9A\u65F6\u5668 2 \u5269\u4F59\u4E00\u5206\u949F","event.kitchen_timer_complete":"\u53A8\u623F\u5B9A\u65F6\u5668\u7ED3\u675F","event.kitchen_timer_under_one_minute":"\u53A8\u623F\u5B9A\u65F6\u5668\u5269\u4F59\u4E00\u5206\u949F","event.lower_oven_cooking_timer_complete":"\u4E0B\u70E4\u7BB1\u70F9\u996A\u5B9A\u65F6\u5668\u7ED3\u675F","event.lower_oven_cooking_timer_under_one_minute":"\u4E0B\u70E4\u7BB1\u70F9\u996A\u5B9A\u65F6\u5668\u5269\u4F59\u4E00\u5206\u949F","event.lower_oven_door_ajar":"\u4E0B\u70E4\u7BB1\u95E8\u672A\u5173","event.lower_oven_preheated":"\u4E0B\u70E4\u7BB1\u9884\u70ED\u5B8C\u6210","event.lower_oven_probe_connected":"\u4E0B\u70E4\u7BB1\u63A2\u9488\u4F7F\u7528\u4E2D","event.lower_oven_probe_target_reached":"\u4E0B\u70E4\u7BB1\u63A2\u9488\u5DF2\u8FBE\u5230\u76EE\u6807\u6E29\u5EA6","event.lower_oven_probe_within_ten_degrees":"\u4E0B\u70E4\u7BB1\u63A2\u9488\u6E29\u5EA6\u8DDD\u76EE\u6807\u4E0D\u8DB3 10\xB0F","event.lower_oven_self_clean_complete":"\u4E0B\u70E4\u7BB1\u6E05\u6D01\u5B8C\u6210","event.oven_cooking_timer_complete":"\u70E4\u7BB1\u70F9\u996A\u5B9A\u65F6\u5668\u7ED3\u675F","event.oven_cooking_timer_under_one_minute":"\u70E4\u7BB1\u70F9\u996A\u5B9A\u65F6\u5668\u5269\u4F59\u4E00\u5206\u949F","event.oven_door_ajar":"\u70E4\u7BB1\u95E8\u672A\u5173","event.oven_preheated":"\u70E4\u7BB1\u9884\u70ED\u5B8C\u6210","event.oven_probe_connected":"\u70E4\u7BB1\u63A2\u9488\u4F7F\u7528\u4E2D","event.oven_probe_target_reached":"\u70E4\u7BB1\u63A2\u9488\u5DF2\u8FBE\u5230\u76EE\u6807\u6E29\u5EA6","event.oven_probe_within_ten_degrees":"\u70E4\u7BB1\u63A2\u9488\u6E29\u5EA6\u8DDD\u76EE\u6807\u4E0D\u8DB3 10\xB0F","event.oven_self_clean_complete":"\u70E4\u7BB1\u6E05\u6D01\u5B8C\u6210","event.oven_service_required":"\u70E4\u7BB1\u9700\u8981\u7EF4\u4FEE","event.refrigerator_door_ajar":"\u51B0\u7BB1\u95E8\u672A\u5173","event.refrigerator_service_required":"\u51B0\u7BB1\u9700\u8981\u7EF4\u4FEE","event.refrigerator_setpoint_changed":"\u51B0\u7BB1\u8BBE\u5B9A\u6E29\u5EA6\u5DF2\u66F4\u6539","event.rinse_aid_low":"\u5149\u4EAE\u5242\u4E0D\u8DB3","event.softener_salt_low":"\u8F6F\u6C34\u76D0\u4E0D\u8DB3","event.unknown":"\u672A\u77E5","event.water_filter_expired":"\u6EE4\u6C34\u5668\u5DF2\u5230\u671F","event.wine_door_ajar":"\u9152\u67DC\u95E8\u672A\u5173","event.wine_setpoint_changed":"\u9152\u67DC\u8BBE\u5B9A\u6E29\u5EA6\u5DF2\u66F4\u6539","event.wine_temperature_alert":"\u9152\u67DC\u6E29\u5EA6\u8D85\u51FA\u8303\u56F4","full.appearance":"\u5916\u89C2","full.appliance":"\u7535\u5668","full.events_error":"\u65E0\u6CD5\u52A0\u8F7D\u4E8B\u4EF6\uFF1A{error}","full.events_loading":"\u6B63\u5728\u52A0\u8F7D\u4E8B\u4EF6\u2026","full.failed":"\u64CD\u4F5C\u672A\u6210\u529F\u3002","full.no_events":"\u8FC7\u53BB 7 \u5929\u6CA1\u6709\u4E8B\u4EF6\u3002","full.recent_events":"\u6700\u8FD1\u4E8B\u4EF6","full.refresh":"\u5237\u65B0","full.refresh_hint":"\u7ACB\u5373\u8BFB\u53D6\u7535\u5668\u72B6\u6001\u3002","full.refreshing":"\u6B63\u5728\u5237\u65B0\u2026","info.air_filter":"\u7A7A\u6C14\u6EE4\u7F51","info.cleaning":"\u6E05\u6D01","info.cycle":"\u7A0B\u5E8F","info.delay":"\u5236\u51B0\u6682\u505C","info.ends":"\u7ED3\u675F","info.fan":"\u98CE\u6247","info.filter":"\u6EE4\u7F51","info.ice_maker":"\u5236\u51B0\u673A","info.light":"\u7167\u660E","info.mode":"\u6A21\u5F0F","info.model":"\u578B\u53F7","info.next_cleaning":"\u4E0B\u6B21\u6E05\u6D01","info.options":"\u9009\u9879","info.probe":"\u63A2\u9488","info.set_to":"\u8BBE\u5B9A","info.starts":"\u5F00\u59CB","info.status":"\u72B6\u6001","info.water_filter":"\u6EE4\u6C34\u5668","lock.cycle_no_delay":"\u6B64\u6D17\u6DA4\u7A0B\u5E8F\u4E0D\u63D0\u4F9B\u5EF6\u65F6\u542F\u52A8\u3002","lock.cycle_no_option":"\u6B64\u6D17\u6DA4\u7A0B\u5E8F\u4E0D\u63D0\u4F9B\u8BE5\u9009\u9879\u3002","lock.delay_not_idle":"\u53EA\u6709\u5728\u6D17\u7897\u673A\u5F85\u673A\u6216\u7B49\u5F85\u542F\u52A8\u65F6\u624D\u80FD\u66F4\u6539\u5EF6\u65F6\u542F\u52A8\u3002","lock.proof_light":"\u53D1\u9175\u671F\u95F4\u70E4\u7BB1\u706F\u4FDD\u6301\u5173\u95ED\u3002","lock.sabbath":"\u5B89\u606F\u65E5\u6A21\u5F0F\u5DF2\u5F00\u542F\u3002\u8BF7\u5148\u5173\u95ED\u5B83\u518D\u66F4\u6539\u6B64\u9879\u3002","lock.self_clean":"\u70E4\u7BB1\u6B63\u5728\u81EA\u6E05\u6D01\uFF0C\u53EA\u80FD\u5173\u95ED\u3002","lock.wash_not_idle":"\u53EA\u6709\u5728\u6D17\u7897\u673A\u5F85\u673A\u65F6\u624D\u80FD\u66F4\u6539\u6D17\u6DA4\u9009\u9879\u3002","option.10_hours":"10 \u5C0F\u65F6","option.10_minutes":"10 \u5206\u949F","option.11_hours":"11 \u5C0F\u65F6","option.12_hours":"12 \u5C0F\u65F6","option.1_hour":"1 \u5C0F\u65F6","option.1_minute":"1 \u5206\u949F","option.2_hours":"2 \u5C0F\u65F6","option.2_minutes":"2 \u5206\u949F","option.3_hours":"3 \u5C0F\u65F6","option.4_hours":"4 \u5C0F\u65F6","option.5_hours":"5 \u5C0F\u65F6","option.5_minutes":"5 \u5206\u949F","option.6_hours":"6 \u5C0F\u65F6","option.7_hours":"7 \u5C0F\u65F6","option.8_hours":"8 \u5C0F\u65F6","option.9_hours":"9 \u5C0F\u65F6","option.add_descaler":"\u6DFB\u52A0\u9664\u57A2\u5242","option.add_sanitizer":"\u6DFB\u52A0\u6D88\u6BD2\u5242","option.auto":"\u81EA\u52A8","option.automatic":"\u81EA\u52A8","option.bake":"\u70D8\u7119","option.bake_stone":"\u70D8\u7119\u77F3","option.broil":"\u7099\u70E4","option.canceling":"\u6B63\u5728\u53D6\u6D88","option.child_lock":"\u7AE5\u9501","option.cleaning_complete":"\u6E05\u6D01\u5B8C\u6210","option.cleaning_reset_flush":"\u6E05\u6D01\u590D\u4F4D\uFF1A\u51B2\u6D17","option.cleaning_reset_rinse":"\u6E05\u6D01\u590D\u4F4D\uFF1A\u6F02\u6D17","option.convection":"\u5BF9\u6D41","option.convection_bake":"\u5BF9\u6D41\u70D8\u7119","option.convection_broil":"\u5BF9\u6D41\u7099\u70E4","option.convection_roast":"\u5BF9\u6D41\u70E4\u8089","option.crystal_and_china":"\u6C34\u6676\u548C\u74F7\u5668","option.dehydrate":"\u70D8\u5E72","option.delayed":"\u5DF2\u5EF6\u65F6","option.descale_clean":"\u9664\u57A2\uFF1A\u6E05\u6D01","option.descale_fill":"\u9664\u57A2\uFF1A\u6CE8\u6C34","option.descale_flush":"\u9664\u57A2\uFF1A\u51B2\u6D17","option.descale_rinse":"\u9664\u57A2\uFF1A\u6F02\u6D17","option.disabled":"\u5DF2\u7981\u7528","option.done":"\u5DF2\u5B8C\u6210","option.drying":"\u70D8\u5E72\u4E2D","option.empty_bin":"\u6E05\u7A7A\u50A8\u51B0\u76D2","option.enabled":"\u5DF2\u542F\u7528","option.energy":"\u8282\u80FD","option.enhanced":"\u589E\u5F3A","option.error":"\u9519\u8BEF","option.extra_quiet":"\u8D85\u9759\u97F3","option.heavy":"\u5F3A\u529B","option.high":"\u9AD8","option.high_use":"\u9AD8\u4F7F\u7528","option.idle":"\u5F85\u673A","option.light":"\u8F7B\u67D4","option.long_vacation":"\u957F\u671F\u5EA6\u5047","option.low":"\u4F4E","option.manual":"\u624B\u52A8","option.manually_clean":"\u624B\u52A8\u6E05\u6D01","option.max_ice":"\u6700\u5927\u5236\u51B0","option.medium":"\u4E2D","option.night_ice":"\u591C\u95F4\u5236\u51B0","option.none":"\u65E0","option.normal":"\u6B63\u5E38","option.not_cleaning":"\u672A\u5728\u6E05\u6D01","option.off":"\u5173","option.on":"\u5F00","option.paused":"\u5DF2\u6682\u505C","option.plastics":"\u5851\u6599","option.pots_and_pans":"\u9505\u5177","option.proof":"\u53D1\u9175","option.quick":"\u5FEB\u901F","option.rinse_and_hold":"\u9884\u51B2\u6D17","option.roast":"\u70E4\u8089","option.running":"\u8FD0\u884C\u4E2D","option.sabbath":"\u5B89\u606F\u65E5","option.sanitize_clean":"\u6D88\u6BD2\uFF1A\u6E05\u6D01","option.sanitize_fill":"\u6D88\u6BD2\uFF1A\u6CE8\u6C34","option.sanitize_flush":"\u6D88\u6BD2\uFF1A\u51B2\u6D17","option.sanitize_rinse":"\u6D88\u6BD2\uFF1A\u6F02\u6D17","option.self_clean":"\u81EA\u6E05\u6D01","option.short_vacation":"\u77ED\u671F\u5EA6\u5047","option.soak_and_scrub":"\u6D78\u6CE1\u5237\u6D17","option.warm":"\u4FDD\u6E29","pill.cleaning":"\u6B63\u5728\u6E05\u6D01","pill.cleaning_due":"\u9700\u8981\u6E05\u6D01","pill.cooking":"\u6B63\u5728\u70F9\u996A","pill.delayed_shutoff":"\u5EF6\u65F6\u5173\u95ED","pill.door_open":"\u95E8\u672A\u5173","pill.fan":"\u98CE\u6247 {speed} \u6863","pill.high_use":"\u9AD8\u4F7F\u7528\u6A21\u5F0F","pill.light":"\u706F\u5DF2\u5F00","pill.making_ice":"\u6B63\u5728\u5236\u51B0","pill.normal":"\u6B63\u5E38","pill.off":"\u5173","pill.offline":"\u79BB\u7EBF","pill.paused":"\u5DF2\u6682\u505C","pill.preheated":"\u5DF2\u9884\u70ED","pill.preheating":"\u9884\u70ED\u4E2D {pct}%","pill.remote_ready":"Remote Ready","pill.sabbath":"\u5B89\u606F\u65E5","pill.self_clean":"\u81EA\u6E05\u6D01","pill.service":"\u9700\u7EF4\u4FEE","pill.temp_alert":"\u6E29\u5EA6\u8B66\u62A5","pill.timer":"\u5B9A\u65F6 {time}","pill.timer_done":"\u5B9A\u65F6\u7ED3\u675F","pill.vacation":"\u5EA6\u5047","reason.choose_mode":"\u8BF7\u5148\u9009\u62E9\u70F9\u996A\u6A21\u5F0F\u3002","reason.close_door":"\u8BF7\u5148\u5173\u4E0A\u95E8\u3002","reason.close_oven_door":"\u8BF7\u5148\u5173\u4E0A\u70E4\u7BB1\u95E8\u3002","reason.crisper_auto":"\u8BF7\u5C06\u679C\u852C\u76D2\u8BBE\u4E3A\u624B\u52A8\u540E\u518D\u66F4\u6539\u3002","reason.dishwasher_busy":"\u53EA\u6709\u5728\u6D17\u7897\u673A\u5F85\u673A\u65F6\u624D\u80FD\u66F4\u6539\u3002","reason.manual_mode":"\u8BF7\u5728\u70E4\u7BB1\u4E0A\u542F\u52A8\u6B64\u6A21\u5F0F\u3002","reason.max_ice":"\u8BF7\u5148\u5173\u95ED\u6700\u5927\u5236\u51B0\u518D\u66F4\u6539\u51B7\u51BB\u5BA4\u6E29\u5EA6\u3002","reason.mode_change_disabled":"\u70E4\u7BB1\u76EE\u524D\u4E0D\u63A5\u53D7\u66F4\u6539\u6A21\u5F0F\u3002","reason.no_temperature":"\u6B64\u6A21\u5F0F\u6CA1\u6709\u53EF\u8BBE\u7F6E\u7684\u6E29\u5EA6\u3002","reason.offline":"\u7535\u5668\u5DF2\u79BB\u7EBF\u3002","reason.oven_not_ready":"\u70E4\u7BB1\u5F00\u542F\u6216\u5904\u4E8E Remote Ready \u65F6\u53EF\u7528\u3002","reason.remote_ready_dishwasher":"\u8BF7\u5148\u5728\u6D17\u7897\u673A\u4E0A\u5F00\u542F Remote Ready\u3002","reason.remote_ready_oven":"\u8BF7\u5728\u70E4\u7BB1\u4E0A\u5F00\u542F Remote Ready\uFF0C\u624D\u80FD\u4ECE\u8FD9\u91CC\u542F\u52A8\u3002","reason.set_temperature":"\u8BF7\u5148\u8BBE\u7F6E\u6E29\u5EA6\u3002","reason.start_at_oven":"\u8BF7\u5728\u70E4\u7BB1\u4E0A\u5F00\u542F\u3002","reason.unavailable":"\u6682\u65F6\u4E0D\u53EF\u7528\u3002","reason.use_start":"\u8BF7\u4F7F\u7528\u4E0B\u65B9\u7684\u201C\u542F\u52A8\u201D\u5F00\u542F\u3002","section.cleaning":"\u6E05\u6D01","section.cycle":"\u6D17\u6DA4\u7A0B\u5E8F","section.delayed_shutoff":"\u5EF6\u65F6\u5173\u95ED","section.details":"\u8BE6\u7EC6\u4FE1\u606F","section.fan_light":"\u98CE\u6247\u548C\u7167\u660E","section.filters":"\u6EE4\u7F51\u548C\u4FDD\u517B","section.ice_delay":"\u5236\u51B0\u6682\u505C","section.ice_maker":"\u5236\u51B0\u673A","section.maintenance":"\u4FDD\u517B","section.modes":"\u6A21\u5F0F","section.options":"\u9009\u9879","section.settings":"\u8BBE\u7F6E","section.temperatures":"\u6E29\u5EA6","severity.critical":"\u4E25\u91CD","severity.high":"\u9AD8","severity.low":"\u4F4E","severity.medium":"\u4E2D","severity.undefined":"\u672A\u6307\u5B9A","severity.unknown":"\u672A\u77E5","severity.urgent":"\u7D27\u6025","unit.days":"{n} \u5929","unit.days_hours":"{d} \u5929 {h} \u5C0F\u65F6","unit.hours":"{n} \u5C0F\u65F6","unit.hours_minutes":"{h} \u5C0F\u65F6 {m} \u5206\u949F","unit.minutes":"{n} \u5206\u949F","value.alert":"\u8B66\u62A5","value.daily_for":"\u6BCF\u5929 {duration}","value.daily_from":"\u6BCF\u5929 {time} \u8D77\uFF0C\u6301\u7EED {duration}","value.done":"\u5B8C\u6210","value.door_open":"\u95E8\u672A\u5173","value.due_now":"\u73B0\u5728","value.due_soon":"\u5373\u5C06","value.ends_at":"{time} \u7ED3\u675F","value.from_for":"{time} \u8D77\uFF0C\u6301\u7EED {duration}","value.in_cycles":"{n} \u6B21\u540E","value.inserted":"\u5DF2\u5B89\u88C5","value.low":"\u4E0D\u8DB3","value.missing":"\u672A\u5B89\u88C5","value.no_faults":"\u65E0","value.none":"\u65E0","value.normal":"\u6B63\u5E38","value.not_connected":"\u672A\u8FDE\u63A5","value.not_due":"\u6682\u4E0D\u9700\u8981","value.not_needed":"\u4E0D\u9700\u8981","value.now":"\u5F53\u524D {temp}","value.off":"\u5173","value.ok":"\u6B63\u5E38","value.on":"\u5F00","value.percent_used":"\u5DF2\u7528 {pct}%","value.probe_close":"\u8DDD\u76EE\u6807 10\xB0F \u4EE5\u5185","value.probe_done":"\u5DF2\u8FBE\u76EE\u6807","value.replace":"\u9700\u66F4\u6362","value.required":"\u9700\u8981","value.speed":"{speed} \u6863","value.under_minute":"\u4E0D\u5230\u4E00\u5206\u949F","value.until":"\u81F3 {time}","wifi.excellent":"\u6781\u597D","wifi.fair":"\u4E00\u822C","wifi.good":"\u826F\u597D","wifi.weak":"\u5F31","zone.crisp":"\u679C\u852C\u76D2","zone.frz":"\u51B7\u51BB\u5BA4","zone.ref":"\u51B7\u85CF\u5BA4","zone.ref2":"\u51B7\u85CF\u62BD\u5C49","zone.short.crisp":"\u679C\u852C","zone.short.frz":"\u51B7\u51BB","zone.short.ref":"\u51B7\u85CF","zone.short.ref2":"\u62BD\u5C49","zone.short.wine":"\u9152\u67DC","zone.short.wine_lower":"\u4E0B\u5C42","zone.short.wine_upper":"\u4E0A\u5C42","zone.wine":"\u9152\u67DC","zone.wine_lower":"\u4E0B\u5C42\u533A\u57DF","zone.wine_upper":"\u4E0A\u5C42\u533A\u57DF"};var vs={"panel.title":"Sub-Zero","panel.menu":"Seitenleiste \xF6ffnen","panel.back":"Zur\xFCck","status.offline":"Offline","overview.no_area":"Kein Bereich","overview.loading":"Hausger\xE4te werden geladen \u2026","overview.error_title":"Die Hausger\xE4te konnten nicht geladen werden","overview.retry":"Erneut versuchen","overview.empty_title":"Noch keine Hausger\xE4te","overview.empty_text":"Hausger\xE4te erscheinen hier, sobald die Sub-Zero-Integration sie hinzugef\xFCgt hat. F\xFCge ein Konto hinzu oder w\xE4hle Hausger\xE4te in ihren Einstellungen aus.","overview.empty_text_user":"Hausger\xE4te erscheinen hier, sobald ein Administrator sie zur Sub-Zero-Integration hinzugef\xFCgt hat.","overview.empty_link":"Sub-Zero-Einstellungen \xF6ffnen","overview.not_found_title":"Hausger\xE4t nicht gefunden","overview.not_found_text":"Dieses Hausger\xE4t geh\xF6rt nicht mehr zur Sub-Zero-Integration, oder der Link ist falsch.","overview.back":"Zur\xFCck zu allen Hausger\xE4ten","card.label":"{name}, {status}. Alle Bedienelemente anzeigen","appearance.hint":"So wird dieses Hausger\xE4t im Panel dargestellt \u2013 f\xFCr alle, die es nutzen.","appearance.admin_only":"Nur Administratoren k\xF6nnen die Darstellung eines Hausger\xE4ts \xE4ndern.","appearance.preview":"Vorschau","appearance.finish":"Oberfl\xE4che","appearance.panel_color":"Frontfarbe","appearance.panel_color_value":"Frontfarbe {color}","appearance.custom_color":"Eigene Farbe","panel_color.white":"Wei\xDF","panel_color.cream":"Creme","panel_color.gray":"Grau","panel_color.navy":"Marineblau","panel_color.sage":"Salbeigr\xFCn","panel_color.black":"Schwarz","panel_color.walnut":"Nussbaum","panel_color.oak":"Eiche","appearance.knobs":"Knebel","appearance.handle":"Griffe","appearance.style":"Stil","appearance.form":"Bauform","appearance.detected":"{form} (erkannt)","appearance.reset":"Auf Standard zur\xFCcksetzen","appearance.reset_confirm":"Die Darstellung dieses Hausger\xE4ts f\xFCr alle auf den Standard zur\xFCcksetzen?","appearance.reset_action":"Zur\xFCcksetzen","appearance.save":"Speichern","appearance.saving":"Wird gespeichert \u2026","appearance.saved":"Gespeichert.","appearance.error":"Speichern fehlgeschlagen: {message}","finish.stainless":"Edelstahl","finish.panel":"F\xFCr M\xF6belfront","finish.black":"Schwarz","finish.carbon":"Carbon-Edelstahl","finish.white":"Wei\xDF","knobs.red":"Rot","knobs.black":"Schwarz","knobs.stainless":"Geb\xFCrsteter Edelstahl","handle.tubular":"Stangengriff","handle.pro":"Profi-Griff","handle.none":"Ohne","style.professional":"Profi","style.transitional":"Klassisch-modern","style.contemporary":"Modern","family.refrigeration":"K\xFChlger\xE4t","family.range":"Standherd","family.wall_oven":"Einbaubackofen","family.hood":"Dunstabzugshaube","family.dishwasher":"Geschirrsp\xFCler","family.generic":"Hausger\xE4t","form.side_by_side":"Side-by-Side","form.french_door":"French Door","form.over_under":"K\xFChl-Gefrier-Kombination","form.column_refrigerator":"K\xFChls\xE4ule","form.column_freezer":"Gefriers\xE4ule","form.column_wine":"Weins\xE4ule","form.tall_refrigerator":"Hoher K\xFChlschrank","form.tall_freezer":"Hoher Gefrierschrank","form.tall_over_under":"Hohe K\xFChl-Gefrier-Kombination","form.wine_over_drawers":"Weinschrank mit Schubladen","form.undercounter_refrigerator":"Unterbau-K\xFChlschrank","form.undercounter_beverage":"Unterbau-Getr\xE4nkek\xFChlschrank","form.undercounter_wine":"Unterbau-Weinschrank","form.undercounter_drawers":"Unterbau-Schubladen","form.ice_maker":"Eisbereiter","form.range":"Standherd","form.single":"Einfacher Einbaubackofen","form.double":"Doppelter Einbaubackofen","form.wall":"Wandhaube","form.island":"Inselhaube","form.insert":"L\xFCftereinsatz","form.hood":"Dunstabzugshaube","form.dishwasher":"Geschirrsp\xFCler","form.refrigerator":"K\xFChlschrank","form.wine":"Weinschrank","form.oven":"Backofen","form.appliance":"Hausger\xE4t"};var ws={"panel.title":"Sub-Zero","panel.menu":"Open the sidebar","panel.back":"Back","status.offline":"Offline","overview.no_area":"No area","overview.loading":"Loading appliances\u2026","overview.error_title":"Couldn't load the appliances","overview.retry":"Try again","overview.empty_title":"No appliances yet","overview.empty_text":"Appliances appear here once the Sub-Zero integration has added them. Add an account, or choose appliances in its settings.","overview.empty_text_user":"Appliances appear here once an administrator has added them to the Sub-Zero integration.","overview.empty_link":"Open Sub-Zero settings","overview.not_found_title":"Appliance not found","overview.not_found_text":"This appliance isn't in the Sub-Zero integration any more, or the link is wrong.","overview.back":"Back to all appliances","card.label":"{name}, {status}. Show all controls","appearance.hint":"How this appliance is drawn in the panel, for everyone who uses it.","appearance.admin_only":"Only administrators can change how an appliance is drawn.","appearance.preview":"Preview","appearance.finish":"Finish","appearance.panel_color":"Panel color","appearance.panel_color_value":"Panel color {color}","appearance.custom_color":"Custom color","panel_color.white":"White","panel_color.cream":"Cream","panel_color.gray":"Gray","panel_color.navy":"Navy","panel_color.sage":"Sage","panel_color.black":"Black","panel_color.walnut":"Walnut","panel_color.oak":"Oak","appearance.knobs":"Knobs","appearance.handle":"Handles","appearance.style":"Style","appearance.form":"Type","appearance.detected":"{form} (detected)","appearance.reset":"Reset to defaults","appearance.reset_confirm":"Reset how this appliance looks to the defaults, for everyone?","appearance.reset_action":"Reset","appearance.save":"Save","appearance.saving":"Saving\u2026","appearance.saved":"Saved.","appearance.error":"Couldn't save: {message}","finish.stainless":"Stainless steel","finish.panel":"Panel-ready","finish.black":"Black","finish.carbon":"Carbon stainless","finish.white":"White","knobs.red":"Red","knobs.black":"Black","knobs.stainless":"Brushed stainless","handle.tubular":"Tubular","handle.pro":"Pro","handle.none":"None","style.professional":"Professional","style.transitional":"Transitional","style.contemporary":"Contemporary","family.refrigeration":"Refrigeration","family.range":"Range","family.wall_oven":"Wall oven","family.hood":"Ventilation hood","family.dishwasher":"Dishwasher","family.generic":"Appliance","form.side_by_side":"Side-by-side","form.french_door":"French door","form.over_under":"Over-and-under","form.column_refrigerator":"Refrigerator column","form.column_freezer":"Freezer column","form.column_wine":"Wine column","form.tall_refrigerator":"Tall refrigerator","form.tall_freezer":"Tall freezer","form.tall_over_under":"Tall over-and-under","form.wine_over_drawers":"Wine storage over drawers","form.undercounter_refrigerator":"Undercounter refrigerator","form.undercounter_beverage":"Undercounter beverage center","form.undercounter_wine":"Undercounter wine storage","form.undercounter_drawers":"Undercounter drawers","form.ice_maker":"Ice maker","form.range":"Range","form.single":"Single wall oven","form.double":"Double wall oven","form.wall":"Wall hood","form.island":"Island hood","form.insert":"Hood insert","form.hood":"Hood","form.dishwasher":"Dishwasher","form.refrigerator":"Refrigerator","form.wine":"Wine storage","form.oven":"Oven","form.appliance":"Appliance"};var ks={"panel.title":"Sub-Zero","panel.menu":"Abrir la barra lateral","panel.back":"Atr\xE1s","status.offline":"Sin conexi\xF3n","overview.no_area":"Sin \xE1rea","overview.loading":"Cargando electrodom\xE9sticos\u2026","overview.error_title":"No se pudieron cargar los electrodom\xE9sticos","overview.retry":"Reintentar","overview.empty_title":"A\xFAn no hay electrodom\xE9sticos","overview.empty_text":"Los electrodom\xE9sticos aparecen aqu\xED cuando la integraci\xF3n Sub-Zero los ha a\xF1adido. A\xF1ade una cuenta o elige electrodom\xE9sticos en su configuraci\xF3n.","overview.empty_text_user":"Los electrodom\xE9sticos aparecen aqu\xED cuando un administrador los ha a\xF1adido a la integraci\xF3n Sub-Zero.","overview.empty_link":"Abrir la configuraci\xF3n de Sub-Zero","overview.not_found_title":"Electrodom\xE9stico no encontrado","overview.not_found_text":"Este electrodom\xE9stico ya no forma parte de la integraci\xF3n Sub-Zero, o el enlace es incorrecto.","overview.back":"Volver a todos los electrodom\xE9sticos","card.label":"{name}, {status}. Mostrar todos los controles","appearance.hint":"C\xF3mo se dibuja este electrodom\xE9stico en el panel, para todos los que lo usan.","appearance.admin_only":"Solo los administradores pueden cambiar c\xF3mo se dibuja un electrodom\xE9stico.","appearance.preview":"Vista previa","appearance.finish":"Acabado","appearance.panel_color":"Color del panel","appearance.panel_color_value":"Color del panel {color}","appearance.custom_color":"Color personalizado","panel_color.white":"Blanco","panel_color.cream":"Crema","panel_color.gray":"Gris","panel_color.navy":"Azul marino","panel_color.sage":"Verde salvia","panel_color.black":"Negro","panel_color.walnut":"Nogal","panel_color.oak":"Roble","appearance.knobs":"Mandos","appearance.handle":"Tiradores","appearance.style":"Estilo","appearance.form":"Tipo","appearance.detected":"{form} (detectado)","appearance.reset":"Restablecer valores predeterminados","appearance.reset_confirm":"\xBFRestablecer el aspecto predeterminado de este electrodom\xE9stico para todos?","appearance.reset_action":"Restablecer","appearance.save":"Guardar","appearance.saving":"Guardando\u2026","appearance.saved":"Guardado.","appearance.error":"No se pudo guardar: {message}","finish.stainless":"Acero inoxidable","finish.panel":"Integrable","finish.black":"Negro","finish.carbon":"Inoxidable carbono","finish.white":"Blanco","knobs.red":"Rojos","knobs.black":"Negros","knobs.stainless":"Acero cepillado","handle.tubular":"Tubulares","handle.pro":"Profesionales","handle.none":"Sin tiradores","style.professional":"Profesional","style.transitional":"Transicional","style.contemporary":"Contempor\xE1neo","family.refrigeration":"Refrigeraci\xF3n","family.range":"Cocina","family.wall_oven":"Horno empotrado","family.hood":"Campana extractora","family.dishwasher":"Lavavajillas","family.generic":"Electrodom\xE9stico","form.side_by_side":"Americano (side by side)","form.french_door":"Puerta francesa","form.over_under":"Combi","form.column_refrigerator":"Columna frigor\xEDfico","form.column_freezer":"Columna congelador","form.column_wine":"Columna vinoteca","form.tall_refrigerator":"Frigor\xEDfico alto","form.tall_freezer":"Congelador alto","form.tall_over_under":"Combi alto","form.wine_over_drawers":"Vinoteca con cajones","form.undercounter_refrigerator":"Frigor\xEDfico bajo encimera","form.undercounter_beverage":"Enfriador de bebidas bajo encimera","form.undercounter_wine":"Vinoteca bajo encimera","form.undercounter_drawers":"Cajones bajo encimera","form.ice_maker":"M\xE1quina de hielo","form.range":"Cocina","form.single":"Horno empotrado sencillo","form.double":"Horno empotrado doble","form.wall":"Campana de pared","form.island":"Campana de isla","form.insert":"Grupo filtrante","form.hood":"Campana extractora","form.dishwasher":"Lavavajillas","form.refrigerator":"Frigor\xEDfico","form.wine":"Vinoteca","form.oven":"Horno","form.appliance":"Electrodom\xE9stico"};var xs={"panel.title":"Sub-Zero","panel.menu":"Ouvrir la barre lat\xE9rale","panel.back":"Retour","status.offline":"Hors ligne","overview.no_area":"Aucune pi\xE8ce","overview.loading":"Chargement des appareils\u2026","overview.error_title":"Impossible de charger les appareils","overview.retry":"R\xE9essayer","overview.empty_title":"Aucun appareil pour l'instant","overview.empty_text":"Les appareils apparaissent ici une fois ajout\xE9s par l'int\xE9gration Sub-Zero. Ajoutez un compte ou choisissez des appareils dans ses param\xE8tres.","overview.empty_text_user":"Les appareils apparaissent ici une fois qu'un administrateur les a ajout\xE9s \xE0 l'int\xE9gration Sub-Zero.","overview.empty_link":"Ouvrir les param\xE8tres de Sub-Zero","overview.not_found_title":"Appareil introuvable","overview.not_found_text":"Cet appareil ne fait plus partie de l'int\xE9gration Sub-Zero, ou le lien est incorrect.","overview.back":"Retour \xE0 tous les appareils","card.label":"{name}, {status}. Afficher toutes les commandes","appearance.hint":"La fa\xE7on dont cet appareil est dessin\xE9 dans le panneau, pour tous ses utilisateurs.","appearance.admin_only":"Seuls les administrateurs peuvent modifier la fa\xE7on dont un appareil est dessin\xE9.","appearance.preview":"Aper\xE7u","appearance.finish":"Finition","appearance.panel_color":"Couleur du panneau","appearance.panel_color_value":"Couleur du panneau {color}","appearance.custom_color":"Couleur personnalis\xE9e","panel_color.white":"Blanc","panel_color.cream":"Cr\xE8me","panel_color.gray":"Gris","panel_color.navy":"Bleu marine","panel_color.sage":"Vert sauge","panel_color.black":"Noir","panel_color.walnut":"Noyer","panel_color.oak":"Ch\xEAne","appearance.knobs":"Boutons","appearance.handle":"Poign\xE9es","appearance.style":"Style","appearance.form":"Type","appearance.detected":"{form} (d\xE9tect\xE9)","appearance.reset":"R\xE9tablir les valeurs par d\xE9faut","appearance.reset_confirm":"R\xE9tablir l'apparence par d\xE9faut de cet appareil pour tout le monde\xA0?","appearance.reset_action":"R\xE9tablir","appearance.save":"Enregistrer","appearance.saving":"Enregistrement\u2026","appearance.saved":"Enregistr\xE9.","appearance.error":"\xC9chec de l'enregistrement : {message}","finish.stainless":"Inox","finish.panel":"Habillable","finish.black":"Noir","finish.carbon":"Inox carbone","finish.white":"Blanc","knobs.red":"Rouges","knobs.black":"Noirs","knobs.stainless":"Inox bross\xE9","handle.tubular":"Tubulaires","handle.pro":"Professionnelles","handle.none":"Sans poign\xE9e","style.professional":"Professionnel","style.transitional":"Transitionnel","style.contemporary":"Contemporain","family.refrigeration":"Froid","family.range":"Piano de cuisson","family.wall_oven":"Four encastrable","family.hood":"Hotte","family.dishwasher":"Lave-vaisselle","family.generic":"Appareil","form.side_by_side":"Am\xE9ricain","form.french_door":"Multiportes","form.over_under":"Combin\xE9","form.column_refrigerator":"Colonne r\xE9frig\xE9rateur","form.column_freezer":"Colonne cong\xE9lateur","form.column_wine":"Colonne cave \xE0 vin","form.tall_refrigerator":"R\xE9frig\xE9rateur grande hauteur","form.tall_freezer":"Cong\xE9lateur grande hauteur","form.tall_over_under":"Combin\xE9 grande hauteur","form.wine_over_drawers":"Cave \xE0 vin avec tiroirs","form.undercounter_refrigerator":"R\xE9frig\xE9rateur sous plan","form.undercounter_beverage":"Cave \xE0 boissons sous plan","form.undercounter_wine":"Cave \xE0 vin sous plan","form.undercounter_drawers":"Tiroirs sous plan","form.ice_maker":"Machine \xE0 gla\xE7ons","form.range":"Piano de cuisson","form.single":"Four encastrable simple","form.double":"Four encastrable double","form.wall":"Hotte murale","form.island":"Hotte \xEElot","form.insert":"Groupe filtrant","form.hood":"Hotte","form.dishwasher":"Lave-vaisselle","form.refrigerator":"R\xE9frig\xE9rateur","form.wine":"Cave \xE0 vin","form.oven":"Four","form.appliance":"Appareil"};var zs={"panel.title":"Sub-Zero","panel.menu":"Apri la barra laterale","panel.back":"Indietro","status.offline":"Non in linea","overview.no_area":"Nessuna area","overview.loading":"Caricamento degli elettrodomestici\u2026","overview.error_title":"Impossibile caricare gli elettrodomestici","overview.retry":"Riprova","overview.empty_title":"Ancora nessun elettrodomestico","overview.empty_text":"Gli elettrodomestici compaiono qui dopo che l'integrazione Sub-Zero li ha aggiunti. Aggiungi un account o scegli gli elettrodomestici nelle sue impostazioni.","overview.empty_text_user":"Gli elettrodomestici compaiono qui dopo che un amministratore li ha aggiunti all'integrazione Sub-Zero.","overview.empty_link":"Apri le impostazioni di Sub-Zero","overview.not_found_title":"Elettrodomestico non trovato","overview.not_found_text":"Questo elettrodomestico non fa pi\xF9 parte dell'integrazione Sub-Zero, oppure il link \xE8 errato.","overview.back":"Torna a tutti gli elettrodomestici","card.label":"{name}, {status}. Mostra tutti i comandi","appearance.hint":"Come questo elettrodomestico viene disegnato nel pannello, per tutti gli utenti.","appearance.admin_only":"Solo gli amministratori possono cambiare il modo in cui un elettrodomestico viene disegnato.","appearance.preview":"Anteprima","appearance.finish":"Finitura","appearance.panel_color":"Colore del pannello","appearance.panel_color_value":"Colore del pannello {color}","appearance.custom_color":"Colore personalizzato","panel_color.white":"Bianco","panel_color.cream":"Crema","panel_color.gray":"Grigio","panel_color.navy":"Blu navy","panel_color.sage":"Verde salvia","panel_color.black":"Nero","panel_color.walnut":"Noce","panel_color.oak":"Rovere","appearance.knobs":"Manopole","appearance.handle":"Maniglie","appearance.style":"Stile","appearance.form":"Tipologia","appearance.detected":"{form} (rilevato)","appearance.reset":"Ripristina i valori predefiniti","appearance.reset_confirm":"Ripristinare l'aspetto predefinito di questo elettrodomestico per tutti?","appearance.reset_action":"Ripristina","appearance.save":"Salva","appearance.saving":"Salvataggio\u2026","appearance.saved":"Salvato.","appearance.error":"Impossibile salvare: {message}","finish.stainless":"Acciaio inox","finish.panel":"Pannellabile","finish.black":"Nero","finish.carbon":"Inox carbonio","finish.white":"Bianco","knobs.red":"Rosse","knobs.black":"Nere","knobs.stainless":"Inox spazzolato","handle.tubular":"Tubolari","handle.pro":"Professionali","handle.none":"Senza maniglie","style.professional":"Professionale","style.transitional":"Transizionale","style.contemporary":"Contemporaneo","family.refrigeration":"Refrigerazione","family.range":"Cucina","family.wall_oven":"Forno da incasso","family.hood":"Cappa","family.dishwasher":"Lavastoviglie","family.generic":"Elettrodomestico","form.side_by_side":"Americano (side by side)","form.french_door":"Porte alla francese","form.over_under":"Combinato","form.column_refrigerator":"Colonna frigorifero","form.column_freezer":"Colonna congelatore","form.column_wine":"Colonna cantinetta","form.tall_refrigerator":"Frigorifero alto","form.tall_freezer":"Congelatore alto","form.tall_over_under":"Combinato alto","form.wine_over_drawers":"Cantinetta con cassetti","form.undercounter_refrigerator":"Frigorifero sottopiano","form.undercounter_beverage":"Frigo per bevande sottopiano","form.undercounter_wine":"Cantinetta sottopiano","form.undercounter_drawers":"Cassetti sottopiano","form.ice_maker":"Fabbricatore di ghiaccio","form.range":"Cucina","form.single":"Forno da incasso singolo","form.double":"Forno da incasso doppio","form.wall":"Cappa a parete","form.island":"Cappa a isola","form.insert":"Gruppo incasso","form.hood":"Cappa","form.dishwasher":"Lavastoviglie","form.refrigerator":"Frigorifero","form.wine":"Cantinetta","form.oven":"Forno","form.appliance":"Elettrodomestico"};var Ss={"panel.title":"Sub-Zero","panel.menu":"Zijbalk openen","panel.back":"Terug","status.offline":"Niet verbonden","overview.no_area":"Geen ruimte","overview.loading":"Apparaten laden\u2026","overview.error_title":"De apparaten konden niet worden geladen","overview.retry":"Opnieuw proberen","overview.empty_title":"Nog geen apparaten","overview.empty_text":"Apparaten verschijnen hier zodra de Sub-Zero-integratie ze heeft toegevoegd. Voeg een account toe of kies apparaten in de instellingen ervan.","overview.empty_text_user":"Apparaten verschijnen hier zodra een beheerder ze aan de Sub-Zero-integratie heeft toegevoegd.","overview.empty_link":"Sub-Zero-instellingen openen","overview.not_found_title":"Apparaat niet gevonden","overview.not_found_text":"Dit apparaat hoort niet meer bij de Sub-Zero-integratie, of de link klopt niet.","overview.back":"Terug naar alle apparaten","card.label":"{name}, {status}. Alle bedieningselementen tonen","appearance.hint":"Hoe dit apparaat in het paneel wordt getekend, voor iedereen die het gebruikt.","appearance.admin_only":"Alleen beheerders kunnen wijzigen hoe een apparaat wordt getekend.","appearance.preview":"Voorbeeld","appearance.finish":"Afwerking","appearance.panel_color":"Paneelkleur","appearance.panel_color_value":"Paneelkleur {color}","appearance.custom_color":"Eigen kleur","panel_color.white":"Wit","panel_color.cream":"Cr\xE8me","panel_color.gray":"Grijs","panel_color.navy":"Marineblauw","panel_color.sage":"Saliegroen","panel_color.black":"Zwart","panel_color.walnut":"Notenhout","panel_color.oak":"Eiken","appearance.knobs":"Knoppen","appearance.handle":"Grepen","appearance.style":"Stijl","appearance.form":"Uitvoering","appearance.detected":"{form} (herkend)","appearance.reset":"Standaardwaarden herstellen","appearance.reset_confirm":"De weergave van dit apparaat voor iedereen terugzetten naar de standaard?","appearance.reset_action":"Herstellen","appearance.save":"Opslaan","appearance.saving":"Bezig met opslaan\u2026","appearance.saved":"Opgeslagen.","appearance.error":"Opslaan mislukt: {message}","finish.stainless":"Roestvrij staal","finish.panel":"Integreerbaar","finish.black":"Zwart","finish.carbon":"Carbon-rvs","finish.white":"Wit","knobs.red":"Rood","knobs.black":"Zwart","knobs.stainless":"Geborsteld rvs","handle.tubular":"Buisgrepen","handle.pro":"Profgrepen","handle.none":"Geen grepen","style.professional":"Professioneel","style.transitional":"Klassiek-modern","style.contemporary":"Eigentijds","family.refrigeration":"Koeling","family.range":"Fornuis","family.wall_oven":"Inbouwoven","family.hood":"Afzuigkap","family.dishwasher":"Vaatwasser","family.generic":"Apparaat","form.side_by_side":"Amerikaanse koelkast","form.french_door":"Franse deuren","form.over_under":"Koel-vriescombinatie","form.column_refrigerator":"Koelkolom","form.column_freezer":"Vrieskolom","form.column_wine":"Wijnkolom","form.tall_refrigerator":"Hoge koelkast","form.tall_freezer":"Hoge vriezer","form.tall_over_under":"Hoge koel-vriescombinatie","form.wine_over_drawers":"Wijnklimaatkast met lades","form.undercounter_refrigerator":"Onderbouwkoelkast","form.undercounter_beverage":"Onderbouw-drankenkoeler","form.undercounter_wine":"Onderbouw-wijnklimaatkast","form.undercounter_drawers":"Onderbouwlades","form.ice_maker":"IJsmachine","form.range":"Fornuis","form.single":"Enkele inbouwoven","form.double":"Dubbele inbouwoven","form.wall":"Wandafzuigkap","form.island":"Eilandafzuigkap","form.insert":"Afzuigunit","form.hood":"Afzuigkap","form.dishwasher":"Vaatwasser","form.refrigerator":"Koelkast","form.wine":"Wijnklimaatkast","form.oven":"Oven","form.appliance":"Apparaat"};var Rs={"panel.title":"Sub-Zero","panel.menu":"Otw\xF3rz pasek boczny","panel.back":"Wstecz","status.offline":"Brak po\u0142\u0105czenia","overview.no_area":"Bez obszaru","overview.loading":"Wczytywanie urz\u0105dze\u0144\u2026","overview.error_title":"Nie uda\u0142o si\u0119 wczyta\u0107 urz\u0105dze\u0144","overview.retry":"Spr\xF3buj ponownie","overview.empty_title":"Brak urz\u0105dze\u0144","overview.empty_text":"Urz\u0105dzenia pojawi\u0105 si\u0119 tutaj, gdy integracja Sub-Zero je doda. Dodaj konto lub wybierz urz\u0105dzenia w jej ustawieniach.","overview.empty_text_user":"Urz\u0105dzenia pojawi\u0105 si\u0119 tutaj, gdy administrator doda je do integracji Sub-Zero.","overview.empty_link":"Otw\xF3rz ustawienia Sub-Zero","overview.not_found_title":"Nie znaleziono urz\u0105dzenia","overview.not_found_text":"To urz\u0105dzenie nie nale\u017Cy ju\u017C do integracji Sub-Zero albo link jest nieprawid\u0142owy.","overview.back":"Wr\xF3\u0107 do wszystkich urz\u0105dze\u0144","card.label":"{name}, {status}. Poka\u017C wszystkie elementy steruj\u0105ce","appearance.hint":"Jak to urz\u0105dzenie jest rysowane w panelu \u2013 dla wszystkich u\u017Cytkownik\xF3w.","appearance.admin_only":"Tylko administratorzy mog\u0105 zmieni\u0107 spos\xF3b rysowania urz\u0105dzenia.","appearance.preview":"Podgl\u0105d","appearance.finish":"Wyko\u0144czenie","appearance.panel_color":"Kolor frontu","appearance.panel_color_value":"Kolor frontu {color}","appearance.custom_color":"W\u0142asny kolor","panel_color.white":"Bia\u0142y","panel_color.cream":"Kremowy","panel_color.gray":"Szary","panel_color.navy":"Granatowy","panel_color.sage":"Sza\u0142wiowy","panel_color.black":"Czarny","panel_color.walnut":"Orzech","panel_color.oak":"D\u0105b","appearance.knobs":"Pokr\u0119t\u0142a","appearance.handle":"Uchwyty","appearance.style":"Styl","appearance.form":"Typ","appearance.detected":"{form} (wykryto)","appearance.reset":"Przywr\xF3\u0107 domy\u015Blne","appearance.reset_confirm":"Przywr\xF3ci\u0107 domy\u015Blny wygl\u0105d tego urz\u0105dzenia dla wszystkich?","appearance.reset_action":"Przywr\xF3\u0107","appearance.save":"Zapisz","appearance.saving":"Zapisywanie\u2026","appearance.saved":"Zapisano.","appearance.error":"Nie uda\u0142o si\u0119 zapisa\u0107: {message}","finish.stainless":"Stal nierdzewna","finish.panel":"Pod front meblowy","finish.black":"Czarny","finish.carbon":"Stal karbonowa","finish.white":"Bia\u0142y","knobs.red":"Czerwone","knobs.black":"Czarne","knobs.stainless":"Szczotkowana stal","handle.tubular":"Rurowe","handle.pro":"Profesjonalne","handle.none":"Bez uchwyt\xF3w","style.professional":"Profesjonalny","style.transitional":"Klasyczno-nowoczesny","style.contemporary":"Wsp\xF3\u0142czesny","family.refrigeration":"Ch\u0142odzenie","family.range":"Kuchnia wolnostoj\u0105ca","family.wall_oven":"Piekarnik do zabudowy","family.hood":"Okap","family.dishwasher":"Zmywarka","family.generic":"Urz\u0105dzenie","form.side_by_side":"Lod\xF3wka ameryka\u0144ska","form.french_door":"Drzwi francuskie","form.over_under":"Lod\xF3wko-zamra\u017Carka","form.column_refrigerator":"Kolumna ch\u0142odz\u0105ca","form.column_freezer":"Kolumna zamra\u017Caj\u0105ca","form.column_wine":"Kolumna na wino","form.tall_refrigerator":"Wysoka lod\xF3wka","form.tall_freezer":"Wysoka zamra\u017Carka","form.tall_over_under":"Wysoka lod\xF3wko-zamra\u017Carka","form.wine_over_drawers":"Ch\u0142odziarka do wina z szufladami","form.undercounter_refrigerator":"Lod\xF3wka podblatowa","form.undercounter_beverage":"Podblatowa ch\u0142odziarka do napoj\xF3w","form.undercounter_wine":"Podblatowa ch\u0142odziarka do wina","form.undercounter_drawers":"Szuflady podblatowe","form.ice_maker":"Kostkarka do lodu","form.range":"Kuchnia wolnostoj\u0105ca","form.single":"Piekarnik pojedynczy","form.double":"Piekarnik podw\xF3jny","form.wall":"Okap przy\u015Bcienny","form.island":"Okap wyspowy","form.insert":"Okap do zabudowy","form.hood":"Okap","form.dishwasher":"Zmywarka","form.refrigerator":"Lod\xF3wka","form.wine":"Ch\u0142odziarka do wina","form.oven":"Piekarnik","form.appliance":"Urz\u0105dzenie"};var As={"panel.title":"Sub-Zero","panel.menu":"\xD6ppna sidof\xE4ltet","panel.back":"Tillbaka","status.offline":"Ej ansluten","overview.no_area":"Inget omr\xE5de","overview.loading":"L\xE4ser in vitvaror\u2026","overview.error_title":"Det gick inte att l\xE4sa in vitvarorna","overview.retry":"F\xF6rs\xF6k igen","overview.empty_title":"Inga vitvaror \xE4nnu","overview.empty_text":"Vitvarorna visas h\xE4r n\xE4r Sub-Zero-integrationen har lagt till dem. L\xE4gg till ett konto eller v\xE4lj vitvaror i dess inst\xE4llningar.","overview.empty_text_user":"Vitvarorna visas h\xE4r n\xE4r en administrat\xF6r har lagt till dem i Sub-Zero-integrationen.","overview.empty_link":"\xD6ppna Sub-Zero-inst\xE4llningarna","overview.not_found_title":"Vitvaran hittades inte","overview.not_found_text":"Den h\xE4r vitvaran ing\xE5r inte l\xE4ngre i Sub-Zero-integrationen, eller s\xE5 \xE4r l\xE4nken fel.","overview.back":"Tillbaka till alla vitvaror","card.label":"{name}, {status}. Visa alla reglage","appearance.hint":"Hur den h\xE4r vitvaran ritas i panelen, f\xF6r alla som anv\xE4nder den.","appearance.admin_only":"Bara administrat\xF6rer kan \xE4ndra hur en vitvara ritas.","appearance.preview":"F\xF6rhandsvisning","appearance.finish":"Ytfinish","appearance.panel_color":"Luckf\xE4rg","appearance.panel_color_value":"Luckf\xE4rg {color}","appearance.custom_color":"Egen f\xE4rg","panel_color.white":"Vit","panel_color.cream":"Gr\xE4ddvit","panel_color.gray":"Gr\xE5","panel_color.navy":"Marinbl\xE5","panel_color.sage":"Salviagr\xF6n","panel_color.black":"Svart","panel_color.walnut":"Valn\xF6t","panel_color.oak":"Ek","appearance.knobs":"Vred","appearance.handle":"Handtag","appearance.style":"Stil","appearance.form":"Utf\xF6rande","appearance.detected":"{form} (identifierad)","appearance.reset":"\xC5terst\xE4ll standardv\xE4rden","appearance.reset_confirm":"\xC5terst\xE4lla vitvarans utseende till standard f\xF6r alla?","appearance.reset_action":"\xC5terst\xE4ll","appearance.save":"Spara","appearance.saving":"Sparar\u2026","appearance.saved":"Sparat.","appearance.error":"Det gick inte att spara: {message}","finish.stainless":"Rostfritt st\xE5l","finish.panel":"Integrerbar","finish.black":"Svart","finish.carbon":"Kolgr\xE5tt rostfritt","finish.white":"Vit","knobs.red":"R\xF6da","knobs.black":"Svarta","knobs.stainless":"Borstat rostfritt","handle.tubular":"R\xF6rhandtag","handle.pro":"Proffshandtag","handle.none":"Utan handtag","style.professional":"Professionell","style.transitional":"Klassisk-modern","style.contemporary":"Samtida","family.refrigeration":"Kyla","family.range":"Spis","family.wall_oven":"Inbyggnadsugn","family.hood":"K\xF6ksfl\xE4kt","family.dishwasher":"Diskmaskin","family.generic":"Vitvara","form.side_by_side":"Amerikanskt kylsk\xE5p","form.french_door":"Franska d\xF6rrar","form.over_under":"Kyl/frys","form.column_refrigerator":"Kylpelare","form.column_freezer":"Fryspelare","form.column_wine":"Vinpelare","form.tall_refrigerator":"H\xF6gt kylsk\xE5p","form.tall_freezer":"H\xF6g frys","form.tall_over_under":"H\xF6g kyl/frys","form.wine_over_drawers":"Vinkyl med l\xE5dor","form.undercounter_refrigerator":"Underbyggt kylsk\xE5p","form.undercounter_beverage":"Underbyggd dryckeskyl","form.undercounter_wine":"Underbyggd vinkyl","form.undercounter_drawers":"Underbyggda l\xE5dor","form.ice_maker":"Ismaskin","form.range":"Spis","form.single":"Enkel inbyggnadsugn","form.double":"Dubbel inbyggnadsugn","form.wall":"V\xE4ggfl\xE4kt","form.island":"K\xF6ks\xF6fl\xE4kt","form.insert":"Fl\xE4ktinsats","form.hood":"K\xF6ksfl\xE4kt","form.dishwasher":"Diskmaskin","form.refrigerator":"Kylsk\xE5p","form.wine":"Vinkyl","form.oven":"Ugn","form.appliance":"Vitvara"};var Ms={"panel.title":"Sub-Zero","panel.menu":"\u6253\u5F00\u4FA7\u8FB9\u680F","panel.back":"\u8FD4\u56DE","status.offline":"\u79BB\u7EBF","overview.no_area":"\u65E0\u533A\u57DF","overview.loading":"\u6B63\u5728\u52A0\u8F7D\u7535\u5668\u2026","overview.error_title":"\u65E0\u6CD5\u52A0\u8F7D\u7535\u5668","overview.retry":"\u91CD\u8BD5","overview.empty_title":"\u6682\u65E0\u7535\u5668","overview.empty_text":"Sub-Zero \u96C6\u6210\u6DFB\u52A0\u7535\u5668\u540E\uFF0C\u7535\u5668\u4F1A\u663E\u793A\u5728\u8FD9\u91CC\u3002\u8BF7\u6DFB\u52A0\u8D26\u6237\uFF0C\u6216\u5728\u96C6\u6210\u8BBE\u7F6E\u4E2D\u9009\u62E9\u7535\u5668\u3002","overview.empty_text_user":"\u7BA1\u7406\u5458\u5C06\u7535\u5668\u6DFB\u52A0\u5230 Sub-Zero \u96C6\u6210\u540E\uFF0C\u7535\u5668\u4F1A\u663E\u793A\u5728\u8FD9\u91CC\u3002","overview.empty_link":"\u6253\u5F00 Sub-Zero \u8BBE\u7F6E","overview.not_found_title":"\u672A\u627E\u5230\u7535\u5668","overview.not_found_text":"\u6B64\u7535\u5668\u5DF2\u4E0D\u5728 Sub-Zero \u96C6\u6210\u4E2D\uFF0C\u6216\u8005\u94FE\u63A5\u6709\u8BEF\u3002","overview.back":"\u8FD4\u56DE\u5168\u90E8\u7535\u5668","card.label":"{name}\uFF0C{status}\u3002\u663E\u793A\u5168\u90E8\u63A7\u5236\u9879","appearance.hint":"\u6B64\u7535\u5668\u5728\u9762\u677F\u4E2D\u7684\u7ED8\u5236\u65B9\u5F0F\uFF0C\u5BF9\u6240\u6709\u7528\u6237\u751F\u6548\u3002","appearance.admin_only":"\u53EA\u6709\u7BA1\u7406\u5458\u53EF\u4EE5\u66F4\u6539\u7535\u5668\u7684\u7ED8\u5236\u65B9\u5F0F\u3002","appearance.preview":"\u9884\u89C8","appearance.finish":"\u9970\u9762","appearance.panel_color":"\u9762\u677F\u989C\u8272","appearance.panel_color_value":"\u9762\u677F\u989C\u8272 {color}","appearance.custom_color":"\u81EA\u5B9A\u4E49\u989C\u8272","panel_color.white":"\u767D\u8272","panel_color.cream":"\u5976\u6CB9\u8272","panel_color.gray":"\u7070\u8272","panel_color.navy":"\u6D77\u519B\u84DD","panel_color.sage":"\u9F20\u5C3E\u8349\u7EFF","panel_color.black":"\u9ED1\u8272","panel_color.walnut":"\u80E1\u6843\u6728","panel_color.oak":"\u6A61\u6728","appearance.knobs":"\u65CB\u94AE","appearance.handle":"\u628A\u624B","appearance.style":"\u98CE\u683C","appearance.form":"\u7C7B\u578B","appearance.detected":"{form}\uFF08\u5DF2\u8BC6\u522B\uFF09","appearance.reset":"\u6062\u590D\u9ED8\u8BA4\u8BBE\u7F6E","appearance.reset_confirm":"\u8981\u4E3A\u6240\u6709\u4EBA\u5C06\u6B64\u7535\u5668\u7684\u5916\u89C2\u6062\u590D\u4E3A\u9ED8\u8BA4\u8BBE\u7F6E\u5417\uFF1F","appearance.reset_action":"\u6062\u590D","appearance.save":"\u4FDD\u5B58","appearance.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","appearance.saved":"\u5DF2\u4FDD\u5B58\u3002","appearance.error":"\u65E0\u6CD5\u4FDD\u5B58\uFF1A{message}","finish.stainless":"\u4E0D\u9508\u94A2","finish.panel":"\u53EF\u88C5\u6A71\u67DC\u9762\u677F","finish.black":"\u9ED1\u8272","finish.carbon":"\u78B3\u8272\u4E0D\u9508\u94A2","finish.white":"\u767D\u8272","knobs.red":"\u7EA2\u8272","knobs.black":"\u9ED1\u8272","knobs.stainless":"\u62C9\u4E1D\u4E0D\u9508\u94A2","handle.tubular":"\u5706\u7BA1\u628A\u624B","handle.pro":"\u4E13\u4E1A\u628A\u624B","handle.none":"\u65E0\u628A\u624B","style.professional":"\u4E13\u4E1A\u98CE\u683C","style.transitional":"\u8FC7\u6E21\u98CE\u683C","style.contemporary":"\u73B0\u4EE3\u98CE\u683C","family.refrigeration":"\u51B7\u85CF\u7535\u5668","family.range":"\u4E00\u4F53\u5F0F\u7089\u7076","family.wall_oven":"\u5D4C\u5165\u5F0F\u70E4\u7BB1","family.hood":"\u6CB9\u70DF\u673A","family.dishwasher":"\u6D17\u7897\u673A","family.generic":"\u7535\u5668","form.side_by_side":"\u5BF9\u5F00\u95E8\u51B0\u7BB1","form.french_door":"\u6CD5\u5F0F\u591A\u95E8\u51B0\u7BB1","form.over_under":"\u4E0A\u51B7\u85CF\u4E0B\u51B7\u51BB\u51B0\u7BB1","form.column_refrigerator":"\u51B7\u85CF\u67F1","form.column_freezer":"\u51B7\u51BB\u67F1","form.column_wine":"\u9152\u67DC\u67F1","form.tall_refrigerator":"\u9AD8\u8EAB\u51B7\u85CF\u67DC","form.tall_freezer":"\u9AD8\u8EAB\u51B7\u51BB\u67DC","form.tall_over_under":"\u9AD8\u8EAB\u4E0A\u51B7\u85CF\u4E0B\u51B7\u51BB\u51B0\u7BB1","form.wine_over_drawers":"\u9152\u67DC\u914D\u62BD\u5C49","form.undercounter_refrigerator":"\u53F0\u4E0B\u51B7\u85CF\u67DC","form.undercounter_beverage":"\u53F0\u4E0B\u996E\u6599\u67DC","form.undercounter_wine":"\u53F0\u4E0B\u9152\u67DC","form.undercounter_drawers":"\u53F0\u4E0B\u62BD\u5C49","form.ice_maker":"\u5236\u51B0\u673A","form.range":"\u4E00\u4F53\u5F0F\u7089\u7076","form.single":"\u5355\u5D4C\u5165\u5F0F\u70E4\u7BB1","form.double":"\u53CC\u5D4C\u5165\u5F0F\u70E4\u7BB1","form.wall":"\u58C1\u6302\u5F0F\u6CB9\u70DF\u673A","form.island":"\u5C9B\u5F0F\u6CB9\u70DF\u673A","form.insert":"\u5D4C\u5165\u5F0F\u6CB9\u70DF\u673A","form.hood":"\u6CB9\u70DF\u673A","form.dishwasher":"\u6D17\u7897\u673A","form.refrigerator":"\u51B0\u7BB1","form.wine":"\u9152\u67DC","form.oven":"\u70E4\u7BB1","form.appliance":"\u7535\u5668"};var Ts=["en","de","es","fr","it","nl","pl","sv","zh-Hans"],jo={en:{shell:ws,families:fs},de:{shell:vs,families:us},es:{shell:ks,families:hs},fr:{shell:xs,families:ms},it:{shell:zs,families:gs},nl:{shell:Ss,families:ys},pl:{shell:Rs,families:$s},sv:{shell:As,families:_s},"zh-Hans":{shell:Ms,families:bs}};function Su(e){if(!e)return"en";if(Ts.includes(e))return e;let t=e.split(/[-_]/)[0].toLowerCase();return t==="zh"?"zh-Hans":Ts.includes(t)?t:"en"}function Uo(e){let t=Su(e),n={...jo.en.shell,...jo.en.families,...jo[t].shell,...jo[t].families};return(o,r)=>{let i=n[o]??o;return r?i.replace(/\{(\w+)\}/g,(a,s)=>String(r[s]??a)):i}}function si(e){return e?.locale?.language||e?.language||"en"}var Cs=new Map;function Be(e){let t=si(e),n=Cs.get(t);return n||(n=Uo(t),Cs.set(t,n)),n}var Gs=new Map;function Es(e){let t=Gs.get(e);if(!t){try{t=new Intl.Collator(e,{numeric:!0,sensitivity:"base"})}catch{t=new Intl.Collator(void 0,{numeric:!0,sensitivity:"base"})}Gs.set(e,t)}return t}function Gt(e){if(e&&typeof e=="object"&&"message"in e){let t=e.message;if(typeof t=="string"&&t)return t}return typeof e=="string"&&e?e:String(e??"")}function Fn(e,t){let n=t?.devices?.[e.device_id];return n?.name_by_user||n?.name||e.name}var Ru=new Set(["column_wine","wine_over_drawers","undercounter_wine","undercounter_beverage"]),Au={refrigerator:0,wine:1,ice_maker:2,oven:4,hood:5,dishwasher:6,appliance:7};function Ds(e){switch(e.family){case"refrigeration":return e.form==="ice_maker"?2:Ru.has(e.form)?1:0;case"range":return 3;case"wall_oven":return 4;case"hood":return 5;case"dishwasher":return 6;case"generic":return Au[e.form]??7}}function Mu(e){let t=Object.values(e??{}),n=new Map;for(let r of t)r.floor_id&&!n.has(r.floor_id)&&n.set(r.floor_id,n.size);let o=t.map((r,i)=>({id:r.area_id,floor:n.get(r.floor_id??"")??n.size,index:i}));return o.sort((r,i)=>r.floor-i.floor||r.index-i.index),new Map(o.map((r,i)=>[r.id,i]))}function Ps(e,t){let n=Es(si(t)),o=new Map;for(let i of e){let a=t?.devices?.[i.device_id]?.area_id??null,s=a?t?.areas?.[a]:void 0,l=s?a:null,p=o.get(l);p||(p={areaId:l,name:s?.name??null,appliances:[]},o.set(l,p)),p.appliances.push({appliance:i,name:Fn(i,t)})}for(let i of o.values())i.appliances.sort((a,s)=>Ds(a.appliance.spec)-Ds(s.appliance.spec)||n.compare(a.name,s.name)||a.appliance.device_id.localeCompare(s.appliance.device_id));let r=Mu(t?.areas);return[...o.values()].sort((i,a)=>i.areaId===null||a.areaId===null?i.areaId===null?1:-1:(r.get(i.areaId)??0)-(r.get(a.areaId)??0))}function Ko(e,t,n){if(!e||e.language!==t.language||e.locale!==t.locale||e.themes!==t.themes||e.config!==t.config||e.user!==t.user||e.devices?.[n.device_id]!==t.devices?.[n.device_id])return!0;for(let o of Object.values(n.entities))for(let r of Object.values(o))if(r&&e.states[r]!==t.states[r])return!0;return!1}var Ls=new Set(["unavailable","unknown"]);function Tu(e){if(!Array.isArray(e))return[];let t=[];for(let n of e){if(!n||typeof n!="object")continue;let o=n.s??n.state,r=li(n.lc??n.lu??n.last_changed??n.last_updated);typeof o=="string"&&r!==null&&t.push({state:o,at:r})}return t}function li(e){if(typeof e=="number"&&Number.isFinite(e))return e<1e11?e*1e3:e;if(typeof e=="string"){let t=Date.parse(e);return Number.isNaN(t)?null:t}return null}function Os(e,t){return Ls.has(e)&&!Ls.has(t)}function Cu(e,t){let n,o=null;for(let r of e)Os(r.state,t)||(r.state===t&&n!==t&&(o=r.at),n=r.state);return o}function Gu(e,t){for(let n=e.length-1;n>=0;n--)if(!Os(e[n].state,t))return e[n].state}function Vs(e){let t=Number.parseFloat(e??"");return Number.isFinite(t)?t:null}function Eu(e){let t=null;for(let n of e){let o=Vs(n.state);o!==null&&(t===null||o<t)&&(t=o)}return t}var Wo=class{constructor(t=()=>{},n=Date.now){this.onChange=t;this.now=n;this.histories=new Map;this.values=new Map}since(t,n,o="on"){let r=n?t?.states[n]:void 0;if(!t||!n||!r)return null;let i=this.history(t,n,r.last_changed),a=li(r.last_changed);return i.failed?r.state===o?a:null:i.changes?r.state===o&&Gu(i.changes,o)!==o?a:Cu(i.changes,o):null}lowestAfter(t,n,o){if(!t||!n||!Number.isFinite(o))return null;let r=`${n}@${o}`,i=this.values.get(r),a=t.states[n],s=a?.last_changed??"";if(i&&!this.outdated(i,s))return i.value;let l=o-2e3,p=o+18e5,d={value:i?.value??null,retryAt:null,lastChanged:s,final:this.now()>=p};this.values.delete(r),this.values.set(r,d),this.values.size>64&&this.values.delete(this.values.keys().next().value);let u=li(s),h=u!==null&&u<=l?Vs(a?.state):null;return this.fetch(t,n,l,p).then(g=>{if(this.values.get(r)!==d)return;let y=Eu(g)??h;y!==d.value&&(d.value=y,this.onChange())},()=>{this.values.get(r)===d&&(d.retryAt=this.now()+6e4)}),d.value}outdated(t,n){return t.retryAt!==null?this.now()>=t.retryAt:t.value===null&&!t.final&&t.lastChanged!==n}history(t,n,o){let r=this.histories.get(n),i=r?.lastChanged===o;if(r&&i&&(r.retryAt===null||this.now()<r.retryAt))return r;let a={lastChanged:o,changes:null,failed:!!(i&&r?.failed),retryAt:null};return this.histories.set(n,a),this.fetch(t,n,this.now()-432e5).then(s=>{this.histories.get(n)===a&&(a.changes=s,a.failed=!1,this.onChange())},()=>{this.histories.get(n)===a&&(a.failed=!0,a.retryAt=this.now()+6e4,this.onChange())}),a}async fetch(t,n,o,r){let i=await t.callWS({type:"history/history_during_period",start_time:new Date(o).toISOString(),...r===void 0?{}:{end_time:new Date(r).toISOString(),include_start_time_state:!1},entity_ids:[n],minimal_response:!0,no_attributes:!0});return Tu(i?.[n])}};var Du=["cav","cav2"];function Hs(e,t,n){let o=t.entities[`${n}_unit_on`]?.binary_sensor,r=o?e.states[o]:void 0;if(o&&r&&(r.state==="on"||r.state==="off"))return{on:r.state==="on",entityId:o,onState:"on",changedAt:Date.parse(r.last_changed)};let i=t.entities[`${n}_set_temp`]?.climate,a=i?e.states[i]:void 0;if(!(!i||!a||a.state==="unavailable"||a.state==="unknown"))return{on:a.state!=="off",entityId:i,onState:a.state,changedAt:Date.parse(a.last_changed)}}function Pu(e,t,n){let o=t.entities[`${n}_temp`]?.sensor,r=Number.parseFloat(o?e.states[o]?.state??"":"");if(Number.isFinite(r))return r;let i=t.entities[`${n}_set_temp`]?.climate,a=Number(i?e.states[i]?.attributes.current_temperature:NaN);return Number.isFinite(a)?a:null}var Zo=class{constructor(t,n=Date.now){this.history=t;this.now=n;this.cavities=new Map}observe(t,n){for(let o of n)for(let r of Du)this.observeCavity(t,o,r)}start(t,n,o){if(!t)return null;let r=this.observeCavity(t,n,o);if(!r?.on)return null;if(r.witnessed)return r.coldest;if(!this.history)return null;let i=Hs(t,n,o),a=i?this.history.since(t,i.entityId,i.onState):null,s=n.entities[`${o}_temp`]?.sensor,l=a===null?null:this.history.lowestAfter(t,s,a);return l===null?null:r.coldest===null?l:Math.min(l,r.coldest)}observeCavity(t,n,o){let r=`${n.appliance_id}:${o}`,i=this.cavities.get(r),a=Hs(t,n,o),s=this.now();if(!a)return i&&(i.lookedAt=s),i;if(!a.on){let u={on:!1,seenAt:s,lookedAt:s,witnessed:!1,coldest:null};return this.cavities.set(r,u),u}let l=i,p=l?.on===!0&&s-l.lookedAt>5e3&&a.changedAt>l.seenAt;if(!l?.on||p){let u=!p&&l!==void 0&&s-l.seenAt<=5e3;l={on:!0,seenAt:s,lookedAt:s,witnessed:u,coldest:null},this.cavities.set(r,l)}l.seenAt=s,l.lookedAt=s;let d=Pu(t,n,o);return d!==null&&(l.coldest===null||d<l.coldest)&&(l.coldest=d),l}};var ci=class{constructor(t=Date.now){this.listeners=new Set;this.history=new Wo(()=>this.notify(),t),this.preheat=new Zo(this.history,t)}observe(t,n){this.hass=t,this.preheat.observe(t,n)}since(t,n="on"){return this.history.since(this.hass,t,n)}preheatStart(t,n){return this.preheat.start(this.hass,t,n)}onChange(t){return this.listeners.add(t),()=>{this.listeners.delete(t)}}notify(){for(let t of[...this.listeners])t()}},De=new ci;var Lu="/sub-zero";function qo(e){let[t]=(e??"").split(/[?#]/)[0].split("/").filter(Boolean);if(!t)return{view:"overview"};let n=t;try{n=decodeURIComponent(t)}catch{}return{view:"appliance",deviceId:n}}function pi(e,t){let n=(e||Lu).replace(/\/+$/,"");return t.view==="overview"?n:`${n}/${encodeURIComponent(t.deviceId)}`}function Yo(e,t={}){let n=t.replace===!0;n?history.replaceState(history.state,"",e):history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:n}}))}function Is(e){if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;let t=e.currentTarget;t instanceof HTMLAnchorElement&&(e.preventDefault(),Yo(t.getAttribute("href")??"/"))}var Xo=class{constructor(t,n){this.onMessage=t;this.onError=n}connect(t){if(t===this.connection||(this.disconnect(),!t))return;this.connection=t;let n;try{n=t.subscribeMessage(o=>{this.connection===t&&this.onMessage(o)},{type:"subzero/panel/subscribe"})}catch(o){n=Promise.reject(o)}this.unsubscribe=n.catch(o=>{this.connection===t&&this.onError(o)})}disconnect(){let t=this.unsubscribe;this.connection=void 0,this.unsubscribe=void 0,t?.then(n=>n?.()).catch(()=>{})}retry(){let t=this.connection;this.disconnect(),this.connect(t)}};var ht=de`
  :host {
    --sz-text: var(--primary-text-color, #1f2328);
    --sz-muted: var(--secondary-text-color, #6b7178);
    --sz-card-bg: var(--ha-card-background, var(--card-background-color, #ffffff));
    --sz-page-bg: var(--primary-background-color, #f4f5f6);
    --sz-radius: var(--ha-card-border-radius, 12px);
    --sz-border-width: var(--ha-card-border-width, 1px);
    --sz-border: var(--ha-card-border-color, var(--divider-color, rgba(0, 0, 0, 0.12)));
    --sz-divider: var(--divider-color, rgba(0, 0, 0, 0.12));
    --sz-accent: var(--primary-color, #03a9f4);
    --sz-on-accent: var(--text-primary-color, #ffffff);
    --sz-error: var(--error-color, #db4437);
    /* Tone text is the tone mixed toward the ink: darker on light themes, lighter on dark ones,
       so a status reads clearly on its tinted pill either way. */
    --sz-ink: #000000;
    --sz-tone-strength: 66%;
    --sz-tone-neutral: var(--primary-text-color, #1f2328);
    --sz-tone-accent: var(--primary-color, #03a9f4);
    --sz-tone-warm: #e8590c;
    --sz-tone-amber: #e69500;
    --sz-tone-green: var(--success-color, #43a047);
    --sz-tone-red: var(--error-color, #db4437);
    --sz-tone-gray: var(--secondary-text-color, #6b7178);
    /* Warning and error text, mixed toward the ink like the tones so it reaches 4.5:1 on the card;
       borders and fills keep the raw colors. */
    --sz-warning-text: color-mix(in srgb, var(--sz-tone-amber) var(--sz-tone-strength), var(--sz-ink));
    --sz-error-text: color-mix(in srgb, var(--sz-error) 80%, var(--sz-ink));
    /* Insets such as the info panel, and the fill of buttons and segmented controls. */
    --sz-inset-bg: rgba(0, 0, 0, 0.04);
    --sz-inset-edge: rgba(0, 0, 0, 0.08);
    --sz-control-bg: rgba(0, 0, 0, 0.06);
    --sz-control-hover: rgba(0, 0, 0, 0.1);
    --sz-lift: 0 8px 24px rgba(0, 0, 0, 0.12);
    /* A switch's off track, at 3:1 against the card so an off switch still reads as one. */
    --sz-switch-off: color-mix(in srgb, var(--sz-text) 50%, transparent);
    /* Fills behind white text (chosen segments, primary and danger buttons), darkened from the
       theme's colors so the text reaches 4.5:1. */
    --sz-accent-fill: color-mix(in srgb, var(--sz-accent) 80%, #000000);
    --sz-danger-fill: color-mix(in srgb, var(--sz-error) 88%, #000000);
  }
  :host([dark]) {
    --sz-ink: #ffffff;
    --sz-tone-strength: 76%;
    --sz-tone-warm: #ff8a4c;
    --sz-tone-amber: #ffb83d;
    --sz-inset-bg: rgba(8, 10, 12, 0.5);
    --sz-inset-edge: rgba(255, 255, 255, 0.08);
    --sz-control-bg: rgba(255, 255, 255, 0.09);
    --sz-control-hover: rgba(255, 255, 255, 0.14);
    --sz-lift: 0 8px 28px rgba(0, 0, 0, 0.45);
    --sz-switch-off: color-mix(in srgb, var(--sz-text) 40%, transparent);
  }
`,Qo=de`
  [data-tone="neutral"] {
    --tone: var(--sz-tone-neutral);
  }
  [data-tone="accent"] {
    --tone: var(--sz-tone-accent);
  }
  [data-tone="warm"] {
    --tone: var(--sz-tone-warm);
  }
  [data-tone="amber"] {
    --tone: var(--sz-tone-amber);
  }
  /* Amber is so light that its text needs more ink on a light theme to reach 4.5:1. */
  :host(:not([dark])) [data-tone="amber"] {
    --sz-tone-strength: 60%;
  }
  [data-tone="green"] {
    --tone: var(--sz-tone-green);
  }
  [data-tone="red"] {
    --tone: var(--sz-tone-red);
  }
  [data-tone="gray"] {
    --tone: var(--sz-tone-gray);
  }
`,mt=de`
  .sz-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 40px;
    padding: 8px 16px;
    border: none;
    border-radius: 999px;
    background: var(--sz-control-bg);
    color: var(--sz-text);
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    text-decoration: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    transition: background-color 0.15s, opacity 0.15s;
  }
  .sz-button:hover {
    background: var(--sz-control-hover);
  }
  .sz-button.primary {
    background: var(--sz-accent-fill, var(--sz-accent));
    color: var(--sz-on-accent);
  }
  .sz-button.danger {
    background: var(--sz-danger-fill, var(--sz-error));
    color: #ffffff;
  }
  .sz-button:is(.primary, .danger):hover:not(:disabled, [aria-disabled="true"]) {
    opacity: 0.9;
  }
  .sz-button:disabled,
  .sz-button[aria-disabled="true"] {
    opacity: 0.45;
    cursor: default;
  }
  /* A button that can't be pressed doesn't answer the pointer. */
  .sz-button:not(.primary, .danger):is(:disabled, [aria-disabled="true"]):hover {
    background: var(--sz-control-bg);
  }
  .sz-button:focus-visible {
    outline: 2px solid var(--sz-accent);
    outline-offset: 2px;
  }
  /* Touch laptops report a mouse as their main pointer, so any finger gets the bigger target. */
  @media (any-pointer: coarse) {
    .sz-button {
      min-height: 44px;
    }
  }
`;function gt(e,t){e.toggleAttribute("dark",t?.themes?.darkMode===!0)}var Fs={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ns=e=>(...t)=>({_$litDirective$:e,values:t}),Jo=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,n,o){this._$Ct=t,this._$AM=n,this._$Ci=o}_$AS(t,n){return this.update(t,n)}update(t,n){return this.render(...n)}};var{I:Ou}=ps,Bs=e=>e;var js=()=>document.createComment(""),$n=(e,t,n)=>{let o=e._$AA.parentNode,r=t===void 0?e._$AB:t._$AA;if(n===void 0){let i=o.insertBefore(js(),r),a=o.insertBefore(js(),r);n=new Ou(i,a,e,e.options)}else{let i=n._$AB.nextSibling,a=n._$AM,s=a!==e;if(s){let l;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(l=e._$AU)!==a._$AU&&n._$AP(l)}if(i!==r||s){let l=n._$AA;for(;l!==i;){let p=Bs(l).nextSibling;Bs(o).insertBefore(l,r),l=p}}}return n},Et=(e,t,n=e)=>(e._$AI(t,n),e),Vu={},Us=(e,t=Vu)=>e._$AH=t,Ks=e=>e._$AH,er=e=>{e._$AR(),e._$AA.remove()};var Ws=(e,t,n)=>{let o=new Map;for(let r=t;r<=n;r++)o.set(e[r],r);return o},Nn=Ns(class extends Jo{constructor(e){if(super(e),e.type!==Fs.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,t,n){let o;n===void 0?n=t:t!==void 0&&(o=t);let r=[],i=[],a=0;for(let s of e)r[a]=o?o(s,a):a,i[a]=n(s,a),a++;return{values:i,keys:r}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,o]){let r=Ks(e),{values:i,keys:a}=this.dt(t,n,o);if(!Array.isArray(r))return this.ut=a,i;let s=this.ut??=[],l=[],p,d,u=0,h=r.length-1,g=0,y=i.length-1;for(;u<=h&&g<=y;)if(r[u]===null)u++;else if(r[h]===null)h--;else if(s[u]===a[g])l[g]=Et(r[u],i[g]),u++,g++;else if(s[h]===a[y])l[y]=Et(r[h],i[y]),h--,y--;else if(s[u]===a[y])l[y]=Et(r[u],i[y]),$n(e,l[y+1],r[u]),u++,y--;else if(s[h]===a[g])l[g]=Et(r[h],i[g]),$n(e,r[u],r[h]),h--,g++;else if(p===void 0&&(p=Ws(a,g,y),d=Ws(s,u,h)),p.has(s[u]))if(p.has(s[h])){let $=d.get(a[g]),b=$!==void 0?r[$]:null;if(b===null){let _=$n(e,r[u]);Et(_,i[g]),l[g]=_}else l[g]=Et(b,i[g]),$n(e,r[u],b),r[$]=null;g++}else er(r[h]),h--;else er(r[u]),u++;for(;g<=y;){let $=$n(e,l[y+1]);Et($,i[g]),l[g++]=$}for(;u<=h;){let $=r[u++];$!==null&&er($)}return this.ut=a,Us(e,l),St}});async function Zs(e,t,n){if(t.type==="service"){let r=n&&typeof n=="object"?n:{};await e.callService(t.domain,t.service,{...t.data,...r});return}let o={entity_id:t.entity_id};switch(t.type){case"climate_temperature":await e.callService("climate","set_temperature",{temperature:Number(n)},o);return;case"climate_power":await e.callService("climate",n?"turn_on":"turn_off",{},o);return;case"number":await e.callService("number","set_value",{value:Number(n)},o);return;case"select":await e.callService("select","select_option",{option:String(n)},o);return;case"switch":await e.callService("switch",n?"turn_on":"turn_off",{},o);return;case"button":await e.callService("button","press",{},o);return;case"fan":{let r=Number(n);r?t.speeds<=1?await e.callService("fan","turn_on",{},o):await e.callService("fan","set_percentage",{percentage:Math.round(r/t.speeds*100)},o):await e.callService("fan","turn_off",{},o);return}case"light":{let r=n??{};if(!r.on){await e.callService("light","turn_off",{},o);return}let i={};typeof r.brightness=="number"&&(i.brightness_pct=Math.round(r.brightness)),typeof r.kelvin=="number"&&(i.color_temp_kelvin=Math.round(r.kelvin)),await e.callService("light","turn_on",i,o);return}}}var Dt=class{constructor(t,n){this.host=t;this.selector=n;this.observed=null;t.addController(this)}hostConnected(){this.hostUpdated()}hostUpdated(){let t=this.host.renderRoot?.querySelector(this.selector)??null;t!==this.observed&&(this.observer?.disconnect(),this.observed=t,!(!t||typeof ResizeObserver!="function")&&(this.observer??=new ResizeObserver(n=>this.measured(n)),this.observer.observe(t)))}hostDisconnected(){this.observer?.disconnect(),this.observed=null}measured(t){let n=Math.round(t[t.length-1]?.contentRect.height??0);n<=0||n===this.height||(this.height=n,this.host.requestUpdate())}};function tr(e){return e?.text?A`<span class="pill" data-tone=${e.tone}>${e.text}</span>`:w}function nr(e,t=!1){return e?.text?A`<div class="lcd ${t?"dim":""}">
    <span class="digits">${e.text}</span>
    ${e.caption?A`<span class="caption">${e.caption}</span>`:w}
  </div>`:w}function qs(e){return e.length?A`<dl class="info">
    ${e.map(t=>A`<div class="row"><dt>${t.label}</dt><dd>${t.value}</dd></div>`)}
  </dl>`:w}function or(e){let t=e.tone??"primary";return A`<div class="confirm ${t}" role="group" aria-label=${e.text}>
    <span class="question">${e.text}</span>
    <span class="actions">
      <button type="button" class="sz-button" ?disabled=${e.busy} @click=${e.onCancel}>
        ${e.cancel}
      </button>
      <button type="button" class="sz-button ${t}" ?disabled=${e.busy} @click=${e.onConfirm}>
        ${e.confirm}
      </button>
    </span>
  </div>`}var Pt=de`
  .pill {
    flex: none;
    max-width: 60%;
    overflow: hidden;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    white-space: nowrap;
    text-overflow: ellipsis;
    /* Fallbacks for browsers without color-mix. */
    color: var(--tone);
    background: rgba(127, 127, 127, 0.14);
    color: color-mix(in srgb, var(--tone) var(--sz-tone-strength), var(--sz-ink));
    background: color-mix(in srgb, var(--tone) 15%, transparent);
  }
  .pill[data-tone="neutral"] {
    color: var(--sz-text);
    background: color-mix(in srgb, var(--sz-text) 8%, transparent);
  }
  .pill[data-tone="gray"] {
    color: var(--sz-muted);
    background: color-mix(in srgb, var(--sz-muted) 14%, transparent);
  }

  /* The display is a physical part of the appliance, so it looks the same in both themes. */
  .lcd {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 7.5em;
    padding: 6px 14px 5px;
    box-sizing: border-box;
    border-radius: 8px;
    /* Dark glass with a faint glare across its upper half. */
    background:
      linear-gradient(168deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.015) 45%, transparent 46%),
      linear-gradient(180deg, #15171b 0%, #0a0b0d 100%);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.07),
      inset 0 2px 6px rgba(0, 0, 0, 0.8),
      0 1px 2px rgba(0, 0, 0, 0.25);
    line-height: 1;
  }
  /* The theme's sans with even-width digits: a monospace font's slashed zero reads as code. */
  .lcd .digits {
    font-family: inherit;
    font-size: 26px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.03em;
    color: #ffa53a;
    text-shadow: 0 0 10px rgba(255, 140, 30, 0.45);
    white-space: nowrap;
  }
  .lcd.dim .digits {
    color: #6b6e73;
    text-shadow: none;
  }
  .lcd .caption {
    margin-top: 4px;
    font-size: 11px;
    color: #9a9da2;
    white-space: nowrap;
  }

  .info {
    display: grid;
    gap: 3px;
    margin: 0;
    padding: 7px 12px;
    border-radius: 12px;
    background: var(--sz-inset-bg);
    box-shadow: inset 0 0 0 1px var(--sz-inset-edge);
    font-size: 13.5px;
    line-height: 1.35;
  }
  .info .row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    min-width: 0;
  }
  .info dt {
    flex: none;
    max-width: 50%;
    overflow: hidden;
    color: var(--sz-muted);
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  /* A long value (setpoints in German, say) wraps rather than losing its end. */
  .info dd {
    margin: 0;
    min-width: 0;
    font-weight: 500;
    text-align: end;
    overflow-wrap: anywhere;
    text-wrap: balance;
  }

  .confirm {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 8px 10px 8px 14px;
    border-radius: 12px;
    border: 1px solid var(--sz-accent);
    background: var(--sz-inset-bg);
  }
  .confirm.danger {
    border-color: var(--sz-error);
  }
  .confirm .question {
    flex: 1 1 14em;
    font-size: 14px;
  }
  .confirm .actions {
    display: flex;
    gap: 8px;
    margin-inline-start: auto;
  }
  /* On the bar's inset the neutral fill all but disappears in the dark theme; an edge keeps the
     safe choice looking like the button it is. */
  .confirm .sz-button:not(.primary, .danger) {
    background: var(--sz-control-hover);
    box-shadow: inset 0 0 0 1px var(--sz-inset-edge);
  }

  /* A drawing stands at the bottom of its stage and fits it: tall refrigerators fill the
     height, wide ranges the width. The drawing's svg has a viewBox in true proportions. */
  .stage {
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    box-sizing: border-box;
  }
  .stage .drawing {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  .stage .drawing > svg {
    display: block;
    width: 100%;
    height: auto;
    max-height: 100%;
  }
`;var _n=class{constructor(t){this.prefix=t.replace(/[^\w-]/g,"_")}id(t){return`${this.prefix}-${t}`}url(t){return`url(#${this.prefix}-${t})`}};function Xs(e,t="#e9e6df"){let n=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((e??"").trim()),o=n?n[1]:t.slice(1),r=o.length===3?[...o].map(i=>i+i).join(""):o;return[0,2,4].map(i=>parseInt(r.slice(i,i+2),16))}function Qs([e,t,n]){let o=r=>Math.round(Math.min(255,Math.max(0,r))).toString(16).padStart(2,"0");return`#${o(e)}${o(t)}${o(n)}`}function bn(e,t){let n=t>0?255:0,o=Math.abs(t);return Qs(e.map(r=>r+(n-r)*o))}function di([e,t,n]){let o=Math.max(e,t,n),r=Math.min(e,t,n);if(o===r)return!1;let i=(o+r)/510,a=(o-r)/255/(1-Math.abs(2*i-1)),s=0;return o===e?s=(t-n)/(o-r)%6:o===t?s=(n-e)/(o-r)+2:s=(e-t)/(o-r)+4,s=(s*60+360)%360,s>=15&&s<=45&&a>=.2&&a<=.75&&i>=.12&&i<=.62}var U=e=>Math.round(e*100)/100;function Pe(e,t,n,o,r=0){if(r<=0)return`M${U(e)} ${U(t)}h${U(n)}v${U(o)}h${U(-n)}Z`;let i=Math.min(r,n/2,o/2);return`M${U(e+i)} ${U(t)}H${U(e+n-i)}A${U(i)} ${U(i)} 0 0 1 ${U(e+n)} ${U(t+i)}V${U(t+o-i)}A${U(i)} ${U(i)} 0 0 1 ${U(e+n-i)} ${U(t+o)}H${U(e+i)}A${U(i)} ${U(i)} 0 0 1 ${U(e)} ${U(t+o-i)}V${U(t+i)}A${U(i)} ${U(i)} 0 0 1 ${U(e+i)} ${U(t)}Z`}function ue(e){return`M${e.map(([t,n])=>`${U(t)} ${U(n)}`).join("L")}Z`}function rr(e){return f`
    <linearGradient id=${e.id("ss")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b4b3b1" />
      <stop offset="0.1" stop-color="#bfbebc" />
      <stop offset="0.48" stop-color="#cfcecc" />
      <stop offset="0.82" stop-color="#c8c7c5" />
      <stop offset="1" stop-color="#b3b2b0" />
    </linearGradient>
    <linearGradient id=${e.id("ss-falloff")} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#34342f" stop-opacity="0.27" />
      <stop offset="0.06" stop-color="#34342f" stop-opacity="0.15" />
      <stop offset="0.24" stop-color="#ffffff" stop-opacity="0.04" />
      <stop offset="0.46" stop-color="#ffffff" stop-opacity="0.17" />
      <stop offset="0.7" stop-color="#ffffff" stop-opacity="0.05" />
      <stop offset="0.92" stop-color="#34342f" stop-opacity="0.16" />
      <stop offset="1" stop-color="#34342f" stop-opacity="0.3" />
    </linearGradient>
    <linearGradient id=${e.id("ss-env")} x1="0" y1="0" x2="1" y2="0.7">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="0.3" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="0.38" stop-color="#ffffff" stop-opacity="0.05" />
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.03" />
      <stop offset="0.62" stop-color="#000000" stop-opacity="0.035" />
      <stop offset="1" stop-color="#000000" stop-opacity="0" />
    </linearGradient>
    <radialGradient id=${e.id("ss-glow")} cx="0.5" cy="0.45" r="0.62">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.08" />
      <stop offset="0.55" stop-color="#ffffff" stop-opacity="0.04" />
      <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
    <linearGradient id=${e.id("chrome")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6e6d6b" />
      <stop offset="0.06" stop-color="#a7a7a5" />
      <stop offset="0.14" stop-color="#e2e2e1" />
      <stop offset="0.24" stop-color="#fbfbfb" />
      <stop offset="0.32" stop-color="#e4e4e3" />
      <stop offset="0.46" stop-color="#bebebc" />
      <stop offset="0.6" stop-color="#d4d4d2" />
      <stop offset="0.74" stop-color="#bbbbb9" />
      <stop offset="0.86" stop-color="#e2e2e0" />
      <stop offset="0.95" stop-color="#a3a3a1" />
      <stop offset="1" stop-color="#787775" />
    </linearGradient>
    <linearGradient id=${e.id("cap-l")} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="0.3" />
      <stop offset="0.22" stop-color="#000" stop-opacity="0.05" />
      <stop offset="0.45" stop-color="#fff" stop-opacity="0.12" />
      <stop offset="0.8" stop-color="#fff" stop-opacity="0" />
      <stop offset="1" stop-color="#000" stop-opacity="0.08" />
    </linearGradient>
    <linearGradient id=${e.id("cap-r")} x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="0.34" />
      <stop offset="0.22" stop-color="#000" stop-opacity="0.07" />
      <stop offset="0.45" stop-color="#fff" stop-opacity="0.08" />
      <stop offset="0.8" stop-color="#fff" stop-opacity="0" />
      <stop offset="1" stop-color="#000" stop-opacity="0.08" />
    </linearGradient>
    <linearGradient id=${e.id("chrome-v")} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#8b8a88" />
      <stop offset="0.1" stop-color="#cbcbc9" />
      <stop offset="0.28" stop-color="#f1f1f0" />
      <stop offset="0.5" stop-color="#d2d2d0" />
      <stop offset="0.72" stop-color="#e2e2e0" />
      <stop offset="0.9" stop-color="#afafad" />
      <stop offset="1" stop-color="#8d8c8a" />
    </linearGradient>
    <linearGradient id=${e.id("chrome-end")} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.35" />
      <stop offset="0.3" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="0.65" stop-color="#000000" stop-opacity="0.12" />
      <stop offset="1" stop-color="#000000" stop-opacity="0.4" />
    </linearGradient>
    <linearGradient id=${e.id("glass")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2b2e31" />
      <stop offset="0.45" stop-color="#16181a" />
      <stop offset="1" stop-color="#0c0d0e" />
    </linearGradient>
    <linearGradient id=${e.id("glass-env")} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.06" />
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.015" />
      <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
    <linearGradient id=${e.id("ao-down")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0.42" />
      <stop offset="0.35" stop-color="#000000" stop-opacity="0.14" />
      <stop offset="1" stop-color="#000000" stop-opacity="0" />
    </linearGradient>
    <linearGradient id=${e.id("ao-up")} x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#000000" stop-opacity="0.32" />
      <stop offset="1" stop-color="#000000" stop-opacity="0" />
    </linearGradient>
    <radialGradient id=${e.id("floor")} cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#000000" stop-opacity="0.5" />
      <stop offset="0.55" stop-color="#000000" stop-opacity="0.2" />
      <stop offset="1" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    ${Ys(e.id("grain"),"2 0.035")}
    ${Ys(e.id("grain-h"),"0.035 2")}
    <filter id=${e.id("blur-s")} x="-20%" y="-60%" width="140%" height="220%">
      <feGaussianBlur stdDeviation="1.4" />
    </filter>
    <filter id=${e.id("blur-m")} x="-30%" y="-80%" width="160%" height="260%">
      <feGaussianBlur stdDeviation="3.2" />
    </filter>
    <filter id=${e.id("offline")} x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
      <feColorMatrix type="saturate" values="0.06" />
      <feComponentTransfer>
        <feFuncR type="linear" slope="0.6" intercept="0.22" />
        <feFuncG type="linear" slope="0.6" intercept="0.22" />
        <feFuncB type="linear" slope="0.6" intercept="0.22" />
      </feComponentTransfer>
    </filter>
  `}function Ys(e,t){return f`<filter id=${e} x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=${t} numOctaves="2" seed="7" />
    <feColorMatrix type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" />
    <feComposite in2="SourceAlpha" operator="in" />
  </filter>`}function Bn(e){if(!di(e))return e;let t=.2126*e[0]+.7152*e[1]+.0722*e[2];return e.map(n=>n+(t-n)*.3)}function Js(e,t,n){let o=di(n),r=Bn(n);return f`
    <linearGradient id=${e.id(`${t}-base`)} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color=${bn(r,.05)} />
      <stop offset="0.55" stop-color=${Qs(r)} />
      <stop offset="1" stop-color=${bn(r,-.07)} />
    </linearGradient>
    <linearGradient id=${e.id(`${t}-sheen`)} x1="0" y1="0" x2="1" y2="0.9">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.09" />
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.035" />
      <stop offset="0.75" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="1" stop-color="#000000" stop-opacity="0.05" />
    </linearGradient>
    ${o?Hu(e.id(`${t}-wood`),"0.4 0.006","0.012 0.0045",11):w}
  `}function Hu(e,t,n,o){return f`<filter id=${e} x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=${t} numOctaves="3" seed=${o} result="grain" />
    <feTurbulence type="fractalNoise" baseFrequency=${n} numOctaves="2" seed=${o+1} result="warp" />
    <feDisplacementMap in="grain" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" />
    <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.065  1.5 0 0 0 -0.6" />
    <feComposite in2="SourceAlpha" operator="in" />
  </filter>`}function at(e,t,n={}){let o=n.grain??.1,r=e.url(n.brush==="h"?"grain-h":"grain");return f`
    <path d=${t} fill=${e.url("ss")} />
    <path d=${t} fill=${e.url("ss-falloff")} />
    <path d=${t} fill=${e.url("ss-env")} />
    <path d=${t} fill=${e.url("ss-glow")} />
    ${o>0?f`<path d=${t} fill="#000" filter=${r} opacity=${o} style="mix-blend-mode:soft-light" />`:w}
    ${n.dim?f`<path d=${t} fill="#000" opacity=${n.dim} />`:w}
  `}function el(e,t,n,o,r={}){return f`
    <path d=${n} fill=${e.url(`${t}-base`)} />
    ${di(o)?f`<path d=${n} fill="#000" filter=${e.url(`${t}-wood`)} opacity="0.22" />`:w}
    <path d=${n} fill=${e.url(`${t}-sheen`)} />
    ${r.dim?f`<path d=${n} fill="#000" opacity=${r.dim} />`:w}
  `}function ir(e,t){return f`
    <path d=${t} fill=${e.url("glass")} />
    <path d=${t} fill=${e.url("glass-env")} />
  `}function vn(e,t,n,o,r=1,i=.8){return f`
    <rect x=${e} y=${t} width=${n} height=${i} fill="#ffffff" opacity=${.7*r} />
    <rect x=${e} y=${t} width=${i} height=${o} fill="#ffffff" opacity=${.35*r} />
    <rect x=${e+n-i} y=${t} width=${i} height=${o} fill="#000000" opacity=${.2*r} />
    <rect x=${e} y=${t+o-i} width=${n} height=${i} fill="#000000" opacity=${.3*r} />
  `}function wn(e,t=.35,n=.6){return f`<path d=${e} fill="none" stroke="#2a2a28" stroke-opacity=${t} stroke-width=${n} />`}function Iu(e,t,n,o,r,i){return`M${U(e+r)} ${U(t)}H${U(e+n-i)}A${i} ${i} 0 0 1 ${U(e+n)} ${U(t+i)}V${U(t+o-i)}A${i} ${i} 0 0 1 ${U(e+n-i)} ${U(t+o)}H${U(e+r)}A${r} ${r} 0 0 1 ${U(e)} ${U(t+o-r)}V${U(t+r)}A${r} ${r} 0 0 1 ${U(e+r)} ${U(t)}Z`}function Rt(e,t,n,o,r,i=0){let a=r==="pro",s=a?13:6.4,l=s/2,p=a?{w:9.5,h:16}:null,d=p?t+p.w-1:t,u=p?n-p.w+1:n,h=i>0,g=h?.08:0,y=f`<rect x=${t+3} y=${o+l*.35} width=${n-t-6} height=${s*.85} rx=${l}
    fill="#000" opacity="0.13" filter=${e.url("blur-m")} />`,$=f`
    <rect x=${d} y=${o-l} width=${u-d} height=${s} rx=${p?0:l} fill=${e.url("chrome")} />
    ${g?f`<rect x=${d} y=${o-l} width=${u-d} height=${s} rx=${p?0:l} fill="#000"
      opacity=${g} />`:w}`;if(!p){let v=Math.round(s),k=[t+4,n-4].map(x=>h?f`<rect x=${x-v/2} y=${o-i} width=${v} height=${i+.5} rx=${v/2}
              ry="1.2" fill=${e.url("chrome-v")} />
            <rect x=${x-v/2} y=${o-i} width=${v} height=${i+.5} rx=${v/2}
              ry="1.2" fill="#000" opacity="0.12" />`:f`<rect x=${x-v/2-.5} y=${o+l-.4} width=${v+1} height="2" rx="1" fill="#000"
            opacity="0.14" filter=${e.url("blur-s")} />`);return f`${h?w:y}${k}${$}`}let b=o-p.h/2,_=[t,n-p.w].map((v,k)=>{let x=k===0,z=Iu(v,b,p.w,p.h,x?2:.6,x?.6:2),S=ue([[v,b-i],[v+p.w,b-i],[v+p.w,b],[v,b]]);return f`
      ${h?f`<path d=${S} fill="#c9cacb" />
          <path d=${S} fill=${e.url("chrome-end")} />
          <rect x=${v} y=${b-i} width=${p.w} height="0.5" fill="#fff" opacity="0.6" />`:f`<rect x=${v+.4} y=${b+1.6} width=${p.w-.8} height=${p.h} rx="1.5" fill="#000"
            opacity="0.2" filter=${e.url("blur-s")} />`}
      <path d=${z} fill=${e.url("chrome")} />
      <path d=${z} fill="#000" opacity=${h?.15:.07} />
      <path d=${z} fill=${e.url(x?"cap-l":"cap-r")} />
      <rect x=${x?v+p.w-.5:v} y=${o-l} width="0.5" height=${s} fill="#3b3a37"
        opacity="0.5" />
      <path d=${z} fill="none" stroke="#3b3a37" stroke-opacity="0.15" stroke-width="0.4" />
    `});return f`${h?w:y}${$}${_}`}function At(e,t,n,o,r=8){let i=r/2;return f`
    <rect x=${t-i+2.5} y=${n+3} width=${r} height=${o-n} rx=${i} fill="#000" opacity="0.16"
      filter=${e.url("blur-m")} />
    ${[n+4,o-4].map(a=>f`<rect x=${t-2} y=${a-2} width="5.5" height="4" rx="1" fill="#000" opacity="0.16"
        filter=${e.url("blur-s")} />`)}
    <rect x=${t-i} y=${n} width=${r} height=${o-n} rx=${i} fill=${e.url("chrome-v")} />
  `}function ar(e,t,n,o,r){let i=r==="dark"?1.5:1;return f`
    <ellipse cx=${t+n/2} cy=${o+1} rx=${n*.58} ry="7.5" fill=${e.url("floor")}
      opacity=${Math.min(1,.6*i)} />
    <rect x=${t+1.5} y=${o-1.4} width=${n-3} height="2.8" rx="1.4" fill="#000"
      opacity=${Math.min(1,.4*i)} filter=${e.url("blur-s")} />
  `}function sr(e,t,n,o,r){let i=[];for(let a=n+3;a<n+r-2;a+=3.4)i.push(`M${U(t+3)} ${U(a)}H${U(t+o-3)}`);return f`
    <rect x=${t} y=${n} width=${o} height=${r} fill="#1b1c1d" />
    <path d=${i.join("")} stroke="#5d6064" stroke-width="1.3" />
    <path d=${i.join("")} stroke="#9a9ea2" stroke-width="0.45" transform="translate(0 -0.5)" />
    <rect x=${t} y=${n} width=${o} height=${r} fill=${e.url("ao-down")} />
  `}var yt=345,tl=40,Un=1.25,ui=yt-tl,lr=ui-Un,jn=1.25;function nl(e){let t=e-2*jn;return{at:(n,o)=>[jn+n,Un+o],lift:0,width:t,height:lr}}function ol(e,t,n=.06){let o=e-2*jn,r=Math.cos(t),i=e/2;return{at:(a,s)=>{let l=lr-s,p=1+n*(l/lr);return[i+(a-o/2)*p,ui-l*r]},lift:Math.sin(t),width:o,height:lr}}function Ee(e,t,n,o,r){return ue([e.at(t,n),e.at(o,n),e.at(o,r),e.at(t,r)])}function Fu(e,t){let{width:n,height:o}=e;return f`
    <path d=${Ee(e,0,0,n,.9)} fill="#ffffff" opacity=${.75*t} />
    <path d=${Ee(e,0,.9,n,2.2)} fill="#ffffff" opacity=${.18*t} />
    <path d=${Ee(e,0,0,.8,o)} fill="#ffffff" opacity=${.12*t} />
    <path d=${Ee(e,.8,0,2,o)} fill="#000000" opacity=${.05*t} />
    <path d=${Ee(e,n-.9,0,n,o)} fill="#000000" opacity=${.22*t} />
    <path d=${Ee(e,n-2.2,0,n-.9,o)} fill="#000000" opacity=${.06*t} />
    <path d=${Ee(e,0,o-1,n,o)} fill="#000000" opacity=${.32*t} />
    ${wn(Ee(e,0,0,n,o),.4,.55)}
  `}function rl(e,t,n,o){let r=Math.min(n==="pro"?195:212.5,t.width-16),i=(t.width-r)/2,a=n==="pro"?24:18,[s,l]=t.at(i,o),[p]=t.at(t.width-i,o),d=a*t.lift;return Rt(e,s,p,l+d,n,d)}function il(e,t){return t.lift?f`
    <defs>
      <linearGradient id=${e.id("tilt")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000" stop-opacity="0.22" />
        <stop offset="0.04" stop-color="#000" stop-opacity="0.04" />
        <stop offset="0.3" stop-color="#fff" stop-opacity="0.06" />
        <stop offset="1" stop-color="#000" stop-opacity="0.08" />
      </linearGradient>
    </defs>
    <path d=${Ee(t,0,0,t.width,t.height)} fill=${e.url("tilt")} />
  `:w}function Nu(e,t,n){let{width:o,height:r}=t;return f`
    ${at(e,Ee(t,0,0,o,r),{dim:t.lift?.1*t.lift:0})}
    ${il(e,t)}
    ${Fu(t,1)}
    ${n?rl(e,t,n,16):w}
  `}function Bu(e,t,n,o){let{width:r,height:i}=t,a=t.lift?.1*t.lift:0;return f`
    ${el(e,"panel",Ee(t,0,0,r,i),n,{dim:a})}
    ${il(e,t)}
    <path d=${Ee(t,0,0,r,.5)} fill="#fff" opacity="0.3" />
    <path d=${Ee(t,0,.5,.5,i)} fill="#fff" opacity="0.3" />
    <path d=${Ee(t,.5,i-.5,r,i)} fill="#000" opacity="0.2" />
    <path d=${Ee(t,r-.5,.5,r,i-.5)} fill="#000" opacity="0.2" />
    ${wn(Ee(t,0,0,r,i),.3,.4)}
    ${o?rl(e,t,o,16):w}
  `}function fi(e,t,n){return n.kind==="stainless"?Nu(e,t,n.handle):Bu(e,t,n.color,n.handle)}function hi(e,t,n){let r=t-12,i=ui,a=tl,s=`M6 ${i}h${r}v${a}h${-r}Z`;return f`
    ${n.kind==="stainless"?at(e,s,{dim:.08}):f`<path d=${s} fill=${bn(Bn(n.color),-.22)} />`}
    <rect x=${6} y=${i} width=${r} height="5" fill=${e.url("ao-down")} opacity="0.3" />
    <rect x=${6} y=${i+.1} width=${r} height="0.6" fill="#fff" opacity="0.5" />
    <rect x=${6} y=${i+a-.8} width=${r} height="0.8" fill="#000" opacity="0.35" />
    <rect x=${6} y=${i} width="0.7" height=${a} fill="#000" opacity="0.2" />
    <rect x=${6+r-.7} y=${i} width="0.7" height=${a} fill="#000" opacity="0.25" />
  `}function al(e){return f`<rect x=${jn+.5} y="0" width=${e-2*jn-1} height=${Un}
    fill="#2b2c2d" opacity="0.55" />`}var cl=52*Math.PI/180,pl=.09,dl=22,ju=7.5,C=e=>Math.round(e*100)/100;function ul(e){return e.at(0,0)[1]-dl*e.lift}function sl(e,t,n){return e.map(([o,r])=>{let i=(r-n)/(r-t[1]);return`M${C(o)} ${C(r)}L${C(o+(t[0]-o)*i)} ${C(n)}`}).join("")}function mi(e,t,n,o){return f`
    <path d=${`M${C(e)} ${C(n+o*.4)}H${C(t)}`} stroke="#14181b" stroke-opacity="0.6"
      stroke-width=${o} stroke-linecap="round" />
    <path d=${`M${C(e)} ${C(n)}H${C(t)}`} stroke="#9aa1a6" stroke-width=${o} stroke-linecap="round" />
    <path d=${`M${C(e+1)} ${C(n-o*.28)}H${C(t-1)}`} stroke="#ffffff"
      stroke-opacity="0.55" stroke-width="0.4" />
  `}function ll(e,t,n,o){return f`
    <rect x=${e-n/2} y=${t+1.2} width=${n} height=${o} rx="2.4" fill="#000" opacity="0.45" />
    <rect x=${e-n/2} y=${t} width=${n} height=${o} rx="2.4" fill="#5d6267" />
    <rect x=${e-n/2+1} y=${t+.6} width=${n-2} height=${o*.22} rx="1.2" fill="#ffffff"
      opacity="0.2" />
    <rect x=${e-n/2+3} y=${t+o*.45} width=${n-6} height=${o*.3} rx="1" fill="#000"
      opacity="0.14" />
  `}function Kn(e,t,n,o,r){let i=[];for(let a=e;a<t;a+=n)i.push(`M${C(a)} ${C(o)}V${C(r)}`);return i.join("")}function Uu(e,t,n,o){let r=[],i=o+7;for(let d=0;d<9;d++){let u=d>=5,h=u?30+(d-5)*18:22+d*17.5,g=i+(u?9:d%2*3),y=n-g+(u?14:8);r.push(f`
      <rect x=${C(h)} y=${C(g)} width="15" height=${C(y)} rx="3" fill="#dfeaf5" fill-opacity="0.1"
        stroke="#f4f9ff" stroke-opacity="0.5" stroke-width="0.6" />
      <rect x=${C(h+1)} y=${C(g+.8)} width="13" height="2.4" rx="1.2" fill="#fff" opacity="0.22" />
      <path d=${`M${C(h+2.8)} ${C(g+4)}V${C(g+y-3)}`} stroke="#fff" stroke-opacity="0.6" stroke-width="0.9" />
      <path d=${`M${C(h+11.8)} ${C(g+6)}V${C(g+y-6)}`} stroke="#fff" stroke-opacity="0.22" stroke-width="0.6" />
      <path d=${`M${C(h+1.5)} ${C(g+y-1.2)}H${C(h+13.5)}`} stroke="#fff" stroke-opacity="0.45"
        stroke-width="0.8" />
    `)}let a=[],s=[],l=o+9;for(let d=0;d<8;d++){let u=t/2+2+d*3.6;a.push(ue([[u,n],[u+2.8,n],[u+6.8,l+d*.5],[u+4,l+d*.5]])),s.push(ue([[u+2.8,n],[u+3.4,n],[u+7.4,l+d*.5],[u+6.8,l+d*.5]]))}let p=[t/2-4,t/2+40,t/2+78].map(d=>f`
      <ellipse cx=${C(d+1)} cy=${C(n+13)} rx="17" ry="9.5" fill="#000" opacity="0.35"
        filter=${e.url("blur-s")} />
      <ellipse cx=${C(d)} cy=${C(n+11)} rx="16.5" ry="9" fill="#e9edf0" />
      <ellipse cx=${C(d)} cy=${C(n+12.2)} rx="12" ry="5.6" fill="#b9c3ca" />
      <ellipse cx=${C(d-4)} cy=${C(n+8)} rx="6" ry="1.6" fill="#fff" opacity="0.7" />
    `);return f`
    <path d=${a.join("")} fill="#e9edf0" />
    <path d=${s.join("")} fill="#8b97a0" opacity="0.6" />
    ${p}${r}`}function Ku(e,t,n,o){let r=[],i=[],a=[],s=t-e,l=3,p=(o-n)/l;for(let d=0;d<l;d++)for(let u=0;u<8;u++){let h=(d*5+u*3)%7/7,g=e+(u+.15*h)*(s/8)+d%2*5,y=s/8-4-3*h,$=n+p*(d+.35+.4*h),b=(h-.5)*2.4;g+y>t||(r.push(`M${C(g)} ${C($)}l${C(y)} ${C(b)}`),(d+u)%3===0&&i.push(`M${C(g+y-3.2)} ${C($+b-1)}h4.2v2h-4.2Z`),a.push(`M${C(g+y*.2)} ${C($-.35+b*.2)}l${C(y*.5)} ${C(b*.5)}`))}return f`
    <path d=${r.join("")} stroke="#000" stroke-opacity="0.4" stroke-width="1.6" stroke-linecap="round"
      transform="translate(0 0.8)" />
    <path d=${r.join("")} stroke="#b4bcc3" stroke-width="1" stroke-linecap="round" />
    <path d=${i.join("")} fill="#d5dbe0" />
    <path d=${a.join("")} stroke="#ffffff" stroke-opacity="0.8" stroke-width="0.4" stroke-linecap="round" />
  `}function fl(e,t,n){let o=t,r=8,i=12,a=10,s=n-r,l=`M${i} ${C(n)}V${r+a}A${a} ${a} 0 0 1 ${i+a} ${r}H${o-i-a}A${a} ${a} 0 0 1 ${o-i} ${r+a}V${C(n)}Z`,p=[o/2,-60],d=.8,u=M=>p[0]+(M-p[0])*d,h=M=>p[1]+(M-p[1])*d,g=ue([[i,r],[u(i),h(r)-20],[u(i),n+6],[i,n+6]]),y=r+s*.33,$=20,b=o-20,_=[];for(let M=$+4;M<b-1;M+=6.8)_.push([M,y]);let v=r+s*.74,k=18,x=o-18,z=h(v),S=[];for(let M=o/2+44;M<x-8;M+=6.8)S.push(`M${C(M)} ${C(v+1)}l-6 ${C(-s*.3)}`);let R=v-s*.2;return f`
    <defs>
      <clipPath id=${e.id("tub")}><path d=${l} /></clipPath>
      <linearGradient id=${e.id("tub-back")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#5f6c77" />
        <stop offset="0.35" stop-color="#424e58" />
        <stop offset="1" stop-color="#1c2227" />
      </linearGradient>
      <linearGradient id=${e.id("tub-side")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#3a444d" />
        <stop offset="0.6" stop-color="#788895" />
        <stop offset="1" stop-color="#56636e" />
      </linearGradient>
      <radialGradient id=${e.id("led")} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#ffffff" stop-opacity="1" />
        <stop offset="0.18" stop-color="#e6f1ff" stop-opacity="0.75" />
        <stop offset="0.5" stop-color="#c9ddf6" stop-opacity="0.22" />
        <stop offset="1" stop-color="#c2d8f2" stop-opacity="0" />
      </radialGradient>
    </defs>
    <path fill-rule="evenodd" fill="#1c1e20" d=${`M1.9 0H${o-1.9}V${C(n)}H1.9Z${l}`} />
    <g clip-path=${e.url("tub")}>
      <rect x="0" y="0" width=${o} height=${C(n+6)} fill=${e.url("tub-back")} />
      <path d=${g} fill=${e.url("tub-side")} />
      <path d=${g} fill=${e.url("tub-side")} transform=${`translate(${o} 0) scale(-1 1)`} />
      <path d=${`M${C(u(i))} 0V${C(n+6)}M${C(u(o-i))} 0V${C(n+6)}`}
        stroke="#14181b" stroke-opacity="0.5" stroke-width="0.8" />
      <path d=${`M${C(u(i)+3)} ${r}V${C(n)}M${C(u(o-i)-3)} ${r}V${C(n)}`}
        stroke="#eef6ff" stroke-opacity="0.55" stroke-width="1.2" />

      <rect x="0" y=${C(y+4)} width=${o} height=${C(s*.3)} fill="#000" opacity="0.25" />
      <path d=${Kn(u(k)+5,u(x)-2,6.8,z,v)} stroke="#6f7880" stroke-opacity="0.6"
        stroke-width="0.7" />
      <path d=${S.join("")} stroke="#5e666d" stroke-width="1" />
      ${Uu(e,o,v,y)}
      <path d=${`M${C(o/2+34)} ${C(R)}H${C(u(x)-6)}`} stroke="#8d969d" stroke-width="2" />
      <path d=${`M${C(o/2+34)} ${C(R-.7)}H${C(u(x)-6)}`} stroke="#fff" stroke-opacity="0.35"
        stroke-width="0.4" />
      <path d=${`M${C(u(k))} ${C(z)}H${C(u(x))}M${k} ${C(v)}L${C(u(k))} ${C(z)}M${x} ${C(v)}L${C(u(x))} ${C(z)}`}
        stroke="#9aa1a6" stroke-width="1.4" fill="none" />
      <path d=${Kn(k+3.5,x-1,6.8,v,n+4)} stroke="#14181b" stroke-opacity="0.5"
        stroke-width="1.5" />
      <path d=${Kn(k+3.5,x-1,6.8,v,n+4)} stroke="#9aa1a6" stroke-width="0.9"
        stroke-opacity="0.85" />
      <path d=${Kn(k+3.1,x-1.4,6.8,v+1,n+4)} stroke="#fff" stroke-opacity="0.35"
        stroke-width="0.4" />
      <path d=${`M${k} ${C(v+s*.2)}H${x}`} stroke="#9aa1a6" stroke-width="1.1" />
      ${mi(k,x,v,2.3)}
      ${ll(o/2,v+1.4,58,12)}
      <rect x=${k-4} y=${C(v-4)} width="7" height="10" rx="2" fill="#3f4448" />
      <rect x=${x-3} y=${C(v-4)} width="7" height="10" rx="2" fill="#3f4448" />

      <path d=${sl(_,p,r-2)} stroke="#14181b" stroke-opacity="0.45" stroke-width="1.4" />
      <path d=${sl(_,p,r-2)} stroke="#9aa1a6" stroke-width="0.75" />
      ${Ku($+4,b-4,r+5,y-3)}
      <path d=${Kn($+3,b-1,6.8,y,y+6)} stroke="#9aa1a6" stroke-width="0.75" />
      ${mi($,b,y+6,1.3)}
      ${mi($,b,y,2)}
      ${ll(o/2,y-4,52,10)}
      <rect x=${$-4} y=${C(y-4)} width="7" height="10" rx="2" fill="#3f4448" />
      <rect x=${b-3} y=${C(y-4)} width="7" height="10" rx="2" fill="#3f4448" />

      <ellipse cx="24" cy=${r+2} rx="34" ry="17" fill=${e.url("led")} />
      <ellipse cx=${o-24} cy=${r+2} rx="34" ry="17" fill=${e.url("led")} />
      <ellipse cx="24" cy=${r+1.5} rx="4" ry="1.4" fill="#ffffff" />
      <ellipse cx=${o-24} cy=${r+1.5} rx="4" ry="1.4" fill="#ffffff" />
      <ellipse cx="14" cy=${C(r+s*.72)} rx="9" ry="24" fill=${e.url("led")} opacity="0.85" />
      <ellipse cx=${o-14} cy=${C(r+s*.72)} rx="9" ry="24" fill=${e.url("led")} opacity="0.85" />
      <rect x="0" y=${C(n-10)} width=${o} height="10" fill=${e.url("ao-up")} />
    </g>
    <path d=${l} fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="0.8" />
    <path d=${`M2.3 ${C(n)}V0.4H${o-2.3}V${C(n)}`} fill="none" stroke="#5a5e62" stroke-width="0.8" />
  `}function hl(e,t,n,o){let[r,i]=t.at(0,0),[a]=t.at(t.width,0),s=i-ju*t.lift,l=i-dl*t.lift,d=(a-r)*.004,u=2.2,h=r+u+d,g=a-u-d,y=ue([[h-.4,s],[g+.4,s],[g,l],[h,l]]),$=ue([[r,i],[a,i],[a-d,s],[r+d,s]]),b=s-l,_=l+b*.5,v=g-h,k=[.255,.33,.395,.46,.53,.65,.715,.785,.85],x=[.022,.034,.028,.026,.04,.034,.025,.031,.022],z=k.map((G,T)=>{let O=x[T]*v,V=h+G*v-O/2;return`M${C(V)} ${C(_-.6)}h${C(O)}v1.2h${C(-O)}Z`}).join(""),S=h+.035*v,R=.135*v,M=Math.max(2.8,b*.34);return f`
    <defs>
      <linearGradient id=${e.id("ctl")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#9da1a4" />
        <stop offset="0.45" stop-color="#bfc2c4" />
        <stop offset="1" stop-color="#cfd1d2" />
      </linearGradient>
    </defs>
    <path d=${$} fill=${n.kind==="stainless"?"#cfcecc":bn(Bn(n.color),.12)} />
    <path d=${$} fill="#000" opacity=${n.kind==="stainless"?.04:.02} />
    <path d=${ue([[r,i-.8],[a,i-.8],[a,i],[r,i]])}
      fill="#ffffff" opacity="0.75" />
    <path d=${y} fill=${e.url("ctl")} />
    <path d=${y} fill="#000" filter=${e.url("grain")} opacity="0.12" style="mix-blend-mode:soft-light" />
    <path d=${ue([[h,l],[g,l],[g,l+.9],[h,l+.9]])}
      fill="#000" opacity="0.5" />
    <path d=${ue([[h,s-.5],[g,s-.5],[g,s],[h,s]])}
      fill="#000" opacity="0.2" />
    ${o?f`
        <rect x=${C(S)} y=${C(_-M/2)} width=${C(R)} height=${C(M)}
          rx="0.5" fill="#152c4a" />
        <rect x=${C(S+R*.07)} y=${C(_-.6)} width=${C(R*.3)} height="1.2"
          fill="#e8f1ff" opacity="0.92" />
        <rect x=${C(S+R*.68)} y=${C(_-.6)} width=${C(R*.24)} height="1.2"
          fill="#e8f1ff" opacity="0.92" />
        <path d=${z} fill="#ffffff" opacity="0.82" />`:null}
  `}var cr={running:"#ff3b30",drying:"#ff3b30",canceling:"#ff3b30",delayed:"#3d8bff",done:"#2fe06f"},Wu={idle:null,running:"running",paused:"paused",canceling:"canceling",drying:"drying",done:"done",delayed:"delayed start",error:"error"};function Wn(e){return!!(e.dishwasher?.door_open||e.doors.door_ajar)}function pr(e){let t=e.dishwasher;if(!t||!e.available)return{label:null,chips:[]};let n=[],o=null;switch(t.status){case"running":case"drying":case"canceling":t.progress!=null&&(o={progress:t.progress});break;case"delayed":o={icon:"clock"};break;case"paused":o={icon:"pause"};break;case"done":n.push("check");break;case"error":n.push("error");break;case"idle":break}return t.remote_ready&&n.push("remote"),t.rinse_aid_low&&n.push("rinse"),t.softener_low&&n.push("salt"),{label:o,chips:n}}function dr(e){if(!e.available)return["offline"];let t=[];Wn(e)&&t.push("door open");let n=e.dishwasher;if(!n)return t;let o=Wu[n.status];return o&&t.push(o),n.display&&(n.status==="running"||n.status==="drying")&&t.push(`${n.display} left`),n.display&&n.status==="delayed"&&t.push(`starts in ${n.display}`),n.remote_ready&&t.push("Remote Ready"),n.rinse_aid_low&&t.push("rinse aid low"),n.softener_low&&t.push("softener salt low"),t}var Zu="rgba(20, 22, 25, 0.6)",qu="rgba(255, 255, 255, 0.22)",Yu="font-family: var(--ha-font-family-body, Roboto, system-ui); font-variant-numeric: tabular-nums",Te=20,$i=12,gi=16,yi=7,Xu=9;function ur(e,t){let n=.125*e/Te;return t&&t>0?Math.min(e/t,n):.03*e/$i}function Qu(e,t){let n=0;for(let o of e)n+=/[:.,'° ]/.test(o)?.34:/[0-9]/.test(o)?.6:.64;return n*t}function ml(e,t,n,o,r){let i=r/2;return f`
    <rect x=${t+.5} y=${n+1.2} width=${o-1} height=${r} rx=${i} fill="#000" opacity="0.28"
      filter=${e.url("blur-s")} />
    <rect x=${t} y=${n} width=${o} height=${r} rx=${i} fill=${Zu} stroke=${qu} stroke-width="1" />
  `}function gl(e,t,n,o){let r=`translate(${t} ${n}) scale(${o/20})`,i=(()=>{switch(e){case"check":return f`<path d="M-6 0.5 L-1.8 4.6 L6.4 -4.4" fill="none" stroke="#fff" stroke-width="2.6"
          stroke-linecap="round" stroke-linejoin="round" />`;case"remote":return f`<g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round">
          <path d="M-7.2 -1.6 A10 10 0 0 1 7.2 -1.6" />
          <path d="M-4.4 1.4 A6 6 0 0 1 4.4 1.4" />
          <circle cx="0" cy="5" r="1.3" fill="#fff" stroke="none" />
        </g>`;case"rinse":return f`<path d="M0 -7.5 C3.2 -3.2 5.6 -0.4 5.6 2.6 A5.6 5.6 0 0 1 -5.6 2.6 C-5.6 -0.4 -3.2 -3.2 0 -7.5 Z"
            fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round" />
          <path d="M-4.3 3.6 A4.4 4.4 0 0 0 4.3 3.6 Z" fill="#fff" />`;case"salt":return f`<g fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round">
          <path d="M0 -6.5 L6 -3.2 L6 3.6 L0 6.9 L-6 3.6 L-6 -3.2 Z" />
          <path d="M-6 -3.2 L0 0.2 L6 -3.2 M0 0.2 L0 6.9" />
        </g>`;case"error":return f`<path d="M0 -6 V1.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round" />
          <circle cx="0" cy="5.6" r="1.6" fill="#fff" />`;case"clock":return f`<g fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round">
          <circle cx="0" cy="0" r="7" />
          <path d="M0 -3.8 V0 L2.8 2" />
        </g>`;case"pause":return f`<rect x="-4.6" y="-5.5" width="3.2" height="11" rx="1" fill="#fff" />
          <rect x="1.4" y="-5.5" width="3.2" height="11" rx="1" fill="#fff" />`}})();return f`<g transform=${r} opacity="0.85">${i}</g>`}function yl(e){let t=e.progress!=null||e.icon?gi:0,n=e.text?Qu(e.text,$i):0;return n?Math.max(Te,yi+t+n+Xu):Te}function Ju(e,t,n,o,r=!1){let i=yl(o),a=n-Te/2,s=o.progress!=null||!!o.icon,l=o.text?t+yi+gi/2:t+i/2,p=5.6,d=2*Math.PI*p,u=Math.min(1,Math.max(0,o.progress??0)),h=r?"":"transition: stroke-dashoffset 0.6s ease";return f`
    <g class="ui">
      ${ml(e,t,a,i,Te)}
      ${o.progress!=null?f`
          <circle cx=${l} cy=${n} r=${p} fill="none" stroke="#ffffff" stroke-opacity="0.24"
            stroke-width="1.9" />
          <circle cx=${l} cy=${n} r=${p} fill="none" stroke="#ffffff" stroke-width="1.9"
            stroke-linecap="round" stroke-dasharray=${d}
            stroke-dashoffset=${d*(1-u)}
            transform=${`rotate(-90 ${l} ${n})`} style=${h} />`:o.icon?gl(o.icon,l,n,13):w}
      ${o.text?f`<text x=${s?t+yi+gi:t+i/2} y=${n} fill="#fff" font-size=${$i}
            font-weight="600" text-anchor=${s?"start":"middle"} dominant-baseline="central"
            style=${Yu}>${o.text}</text>`:w}
    </g>
  `}function ef(e,t,n,o){return f`
    <g class="ui">
      ${ml(e,t-Te/2,n-Te/2,Te,Te)}
      ${gl(o,t,n,13)}
    </g>
  `}function Lt(e,t,n,o,r,i=!1,a=1){if(!o&&!r.length)return w;if(a!==1){let h=Math.round(a*1e3)/1e3;return f`<g transform=${`translate(${t} ${n}) scale(${h}) translate(${-t} ${-n})`}>
      ${Lt(e,t,n,o,r,i)}
    </g>`}let s=4,l=o?yl(o):0,p=l+r.length*Te+(o?r.length:r.length-1)*s,d=t-p/2,u=[];o&&(u.push(Ju(e,d,n,o,i)),d+=l+s);for(let h of r)u.push(ef(e,d+Te/2,n,h)),d+=Te+s;return f`${u}`}var $l=yt+20;function tf(e){let t=e.handle==="none"?null:e.handle==="pro"?"pro":"tubular";if(e.finish==="stainless")return{kind:"stainless",handle:t??"tubular"};let n={black:"#2a2b2d",carbon:"#3b3d40",white:"#f1f0ec"};return{kind:"panel",color:Xs(e.panel_color??n[e.finish],"#ebe8e1"),handle:t}}function _i(e,t,n,o,r,i){let a=n.handle==="pro"?8:n.handle?3.5:0;if(o){let s=ol(t,cl,pl),l=s.at(0,16)[1]+24*s.lift+a;return{body:f`
        ${fl(e,t,ul(s)+1)}
        ${hi(e,t,n)}
        ${fi(e,s,n)}
        ${hl(e,s,n,r)}
      `,statusY:Math.max(s.at(0,s.height*.35)[1],l+8+i/2)}}return{body:f`
      ${al(t)}
      ${hi(e,t,n)}
      ${fi(e,nl(t),n)}
    `,statusY:Math.max(53,Un+16+a+8+i/2)}}function bi(e,t,n){return f`
    <defs>
      <radialGradient id=${e.id("floor-light")} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color=${n} stop-opacity="0.75" />
        <stop offset="0.45" stop-color=${n} stop-opacity="0.3" />
        <stop offset="1" stop-color=${n} stop-opacity="0" />
      </radialGradient>
      <radialGradient id=${e.id("floor-spill")} cx="0.5" cy="1" r="0.55">
        <stop offset="0" stop-color=${n} stop-opacity="0.12" />
        <stop offset="1" stop-color=${n} stop-opacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx=${t/2} cy=${yt+5.5} rx=${t*.36} ry="6" fill=${e.url("floor-light")} />
    <ellipse cx=${t/2} cy=${yt+4} rx=${t*.17} ry="2" fill=${n} opacity="0.5"
      filter=${e.url("blur-s")} />
    <rect x="6" y=${yt-10} width=${t-12} height="10" fill=${e.url("floor-spill")} />
  `}var _l=e=>{let{spec:t,state:n}=e;if(t.family!=="dishwasher")return null;let o=new _n(e.uid),r=Math.round((t.width??24)*10),i=tf(e.appearance),a=Wn(n),s=!!e.reducedMotion,l=n.dishwasher,p=n.available&&!a&&l?cr[l.status]:void 0,d=ur($l,e.pixelHeight),{body:u,statusY:h}=_i(o,r,i,a,!0,Te*d),{label:g,chips:y}=pr(n),$=14;return A`<svg
    viewBox=${`${-$} -4 ${r+2*$} ${$l}`}
    role="img"
    aria-label=${["Dishwasher",...dr(n)].join(", ")}
  >
    <defs>
      ${rr(o)}
      ${i.kind==="panel"?Js(o,"panel",i.color):w}
    </defs>
    ${ar(o,0,r,yt,e.theme)}
    <g filter=${n.available?w:o.url("offline")}>${u}</g>
    ${p?bi(o,r,p):w}
    ${Lt(o,r/2,h,g,y,s,d)}
  </svg>`};function vl(e){return{id:t=>`${e}-${t}`,url:t=>`url(#${e}-${t})`}}var kn=[[0,133],[.05,135],[.12,138],[.2,160],[.3,190],[.4,207],[.5,219],[.58,221],[.66,211],[.75,190],[.85,156],[.95,136],[1,133]],vi=478.75;function Le(e,t){return`opacity:${Math.round(e*100)/100}${t?"":";transition:opacity .6s ease"}`}function Ot(e){let t=Math.round(Math.min(255,Math.max(0,e)));return`rgb(${t},${t},${Math.max(0,t-1)})`}function nf(e){let t=Math.min(1,Math.max(0,e));for(let n=1;n<kn.length;n++){let[o,r]=kn[n];if(t<=o){let[i,a]=kn[n-1];return a+(r-a)*(t-i)/(o-i)}}return kn[kn.length-1][1]}function wi(e,t){return nf(.5+(e-t/2)/vi)}var $t={red:{light:"#953c42",base:"#843236",dark:"#62191e",edge:"#4c1418",rim:"#a5676a",rimOpacity:.6,sheen:.05},black:{light:"#3c3c3f",base:"#262628",dark:"#141415",edge:"#060606",rim:"#58585c",rimOpacity:.6,sheen:.08},stainless:{light:"#d2d4d5",base:"#a9abad",dark:"#6a6d70",edge:"#45484b",rim:"#e6e7e8",rimOpacity:.4,sheen:.12}},qn=e=>Math.round(Math.min(1,Math.max(0,e))*1e3)/1e3;function Yn(e,t,n,o){return f`<linearGradient id=${e.id(t)} gradientUnits="userSpaceOnUse"
    x1=${n/2-vi/2} y1="0" x2=${n/2+vi/2} y2="0">
    ${kn.map(([r,i])=>{let[a,s]=o(i);return f`<stop offset=${r} stop-color=${a} stop-opacity=${s} />`})}
  </linearGradient>`}var nn=(e,t,n,o)=>Yn(e,t,n,r=>[Ot(r+o),1]),bl=(e,t,n,o)=>Yn(e,t,n,r=>["#000",qn((1-r/221)*o)]);function Zn(e,t,n,o,r=.4){return f`<linearGradient id=${e.id(t)} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color=${n>=0?"#fff":"#000"} stop-opacity=${Math.abs(n)} />
    <stop offset=${r} stop-color="#fff" stop-opacity="0" />
    <stop offset="1" stop-color=${o>=0?"#fff":"#000"} stop-opacity=${Math.abs(o)} />
  </linearGradient>`}function wl(e,t,n){let o=$t[n]??$t.red;return f`<defs>
    ${nn(e,"ss",t,0)}
    ${nn(e,"ss-rail",t,18)}
    ${nn(e,"ss-panel",t,-10)}
    ${nn(e,"ss-cover",t,-4)}
    ${nn(e,"ss-deck",t,8)}
    ${nn(e,"ss-dim",t,-26)}
    ${nn(e,"ss-toe",t,-32)}
    ${bl(e,"falloff",t,.78)}
    ${bl(e,"falloff-knob",t,.1)}
    ${Yn(e,"handle-shadow",t,r=>["#000",qn(1-132/r)])}
    ${Yn(e,"lower",t,r=>r>=185?["#000",qn((r-205)/r)]:["#fff",qn((165-r)*.0013)])}
    ${Yn(e,"glass-reflect",t,r=>["#fff",qn((r-133)*.00135)])}
    <linearGradient id=${e.id("lower-fade")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.3" stop-color="#000" />
      <stop offset="0.78" stop-color="#fff" />
    </linearGradient>
    <mask id=${e.id("lower-mask")} maskContentUnits="objectBoundingBox">
      <rect width="1" height="1" fill=${e.url("lower-fade")} />
    </mask>
    ${["l","r"].map(r=>f`<radialGradient id=${e.id(`corner-${r}`)} cx=${r==="l"?0:1} cy="0" r="1">
        <stop offset="0" stop-color="#000" stop-opacity="0.16" />
        <stop offset="0.5" stop-color="#000" stop-opacity="0.06" />
        <stop offset="1" stop-color="#000" stop-opacity="0" />
      </radialGradient>`)}
    ${Zn(e,"shade-door",.05,0)}
    ${Zn(e,"shade-panel",-.17,.05,.3)}
    ${Zn(e,"shade-rail",.4,-.06,.35)}
    ${Zn(e,"shade-plinth",.06,-.03,.5)}
    ${Zn(e,"shade-open",-.16,-.3,.5)}

    <linearGradient id=${e.id("rise")} x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#fff" />
      <stop offset="1" stop-color="#000" />
    </linearGradient>
    <mask id=${e.id("rise-mask")} maskContentUnits="objectBoundingBox">
      <rect width="1" height="1" fill=${e.url("rise")} />
    </mask>

    <linearGradient id=${e.id("tube")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8a8988" />
      <stop offset="0.07" stop-color="#a09f9d" />
      <stop offset="0.11" stop-color="#cac9c7" />
      <stop offset="0.15" stop-color="#fbfbfa" />
      <stop offset="0.3" stop-color="#ffffff" />
      <stop offset="0.35" stop-color="#f7f7f6" />
      <stop offset="0.4" stop-color="#dfdedc" />
      <stop offset="0.45" stop-color="#d6d5d3" />
      <stop offset="0.53" stop-color="#e2e1df" />
      <stop offset="0.62" stop-color="#d8d7d5" />
      <stop offset="0.73" stop-color="#cdccca" />
      <stop offset="0.79" stop-color="#dad9d7" />
      <stop offset="0.85" stop-color="#f9f9f8" />
      <stop offset="0.9" stop-color="#f0efee" />
      <stop offset="0.95" stop-color="#bebdbb" />
      <stop offset="1" stop-color="#8c8b89" />
    </linearGradient>
    <linearGradient id=${e.id("tube-glint")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0" />
      <stop offset="0.25" stop-color="#fff" stop-opacity="0.95" />
      <stop offset="0.7" stop-color="#fff" stop-opacity="0.95" />
      <stop offset="1" stop-color="#fff" stop-opacity="0" />
    </linearGradient>
    <linearGradient id=${e.id("post-top")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c4c3c1" />
      <stop offset="1" stop-color="#ecebea" />
    </linearGradient>
    <linearGradient id=${e.id("tube-side")} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="0.2" />
      <stop offset="0.25" stop-color="#000" stop-opacity="0" />
      <stop offset="0.75" stop-color="#000" stop-opacity="0" />
      <stop offset="1" stop-color="#000" stop-opacity="0.2" />
    </linearGradient>
    <linearGradient id=${e.id("post-end")} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7a7977" />
      <stop offset="0.6" stop-color="#6b6a68" />
      <stop offset="1" stop-color="#555452" />
    </linearGradient>
    <linearGradient id=${e.id("post-end-l")} x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stop-color="#7a7977" />
      <stop offset="0.6" stop-color="#6b6a68" />
      <stop offset="1" stop-color="#555452" />
    </linearGradient>

    <linearGradient id=${e.id("bezel")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c4c6c7" />
      <stop offset="0.5" stop-color="#929496" />
      <stop offset="1" stop-color="#a2a4a6" />
    </linearGradient>
    <linearGradient id=${e.id("bezel-in")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6c6e70" />
      <stop offset="1" stop-color="#5c5e60" />
    </linearGradient>
    <radialGradient id=${e.id("knob")} cx="0.45" cy="0.32" r="0.8">
      <stop offset="0" stop-color=${o.light} />
      <stop offset="0.45" stop-color=${o.base} />
      <stop offset="0.85" stop-color=${o.base} />
      <stop offset="1" stop-color=${o.dark} />
    </radialGradient>

    <linearGradient id=${e.id("glass")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#141516" />
      <stop offset="1" stop-color="#0f1011" />
    </linearGradient>
    <linearGradient id=${e.id("sheen")} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0.15" stop-color="#fff" stop-opacity="0" />
      <stop offset="0.3" stop-color="#fff" stop-opacity="0.028" />
      <stop offset="0.42" stop-color="#fff" stop-opacity="0.008" />
      <stop offset="0.55" stop-color="#fff" stop-opacity="0" />
    </linearGradient>

    <linearGradient id=${e.id("cavity")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#14161c" />
      <stop offset="1" stop-color="#0b0c10" />
    </linearGradient>
    <linearGradient id=${e.id("porcelain")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#232637" />
      <stop offset="0.55" stop-color="#1b1d2a" />
      <stop offset="1" stop-color="#131420" />
    </linearGradient>
    <radialGradient id=${e.id("lamp")} cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#fffaf0" />
      <stop offset="0.3" stop-color="#ffe6bd" stop-opacity="0.75" />
      <stop offset="1" stop-color="#ffd9a0" stop-opacity="0" />
    </radialGradient>
    <radialGradient id=${e.id("pool")} cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffdcae" stop-opacity="0.3" />
      <stop offset="0.5" stop-color="#ffd6a0" stop-opacity="0.1" />
      <stop offset="1" stop-color="#ffd6a0" stop-opacity="0" />
    </radialGradient>
    <radialGradient id=${e.id("heat")} cx="0.5" cy="-0.04" r="1">
      <stop offset="0" stop-color="#ff7a2a" stop-opacity="0.88" />
      <stop offset="0.18" stop-color="#ff5c16" stop-opacity="0.58" />
      <stop offset="0.42" stop-color="#c8340a" stop-opacity="0.26" />
      <stop offset="0.72" stop-color="#701606" stop-opacity="0.08" />
      <stop offset="1" stop-color="#3a0802" stop-opacity="0" />
    </radialGradient>
    <radialGradient id=${e.id("heat-clean")} cx="0.5" cy="-0.06" r="1.1">
      <stop offset="0" stop-color="#ff8a3a" stop-opacity="0.95" />
      <stop offset="0.25" stop-color="#ff4c14" stop-opacity="0.68" />
      <stop offset="0.6" stop-color="#b3200a" stop-opacity="0.36" />
      <stop offset="1" stop-color="#5a0c02" stop-opacity="0.1" />
    </radialGradient>
    <linearGradient id=${e.id("element")} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ff5a1f" />
      <stop offset="0.5" stop-color="#ffb066" />
      <stop offset="1" stop-color="#ff5a1f" />
    </linearGradient>

    <linearGradient id=${e.id("iron")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#434343" />
      <stop offset="0.3" stop-color="#383838" />
      <stop offset="1" stop-color="#2d2d2d" />
    </linearGradient>
    <linearGradient id=${e.id("pan")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#262626" />
      <stop offset="0.7" stop-color="#1c1c1c" />
      <stop offset="1" stop-color="#151515" />
    </linearGradient>
    <linearGradient id=${e.id("steel")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e3e4e5" />
      <stop offset="0.45" stop-color="#b7b9bb" />
      <stop offset="1" stop-color="#8f9295" />
    </linearGradient>
    <linearGradient id=${e.id("ftop")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9d9fa1" />
      <stop offset="1" stop-color="#898b8d" />
    </linearGradient>
    <linearGradient id=${e.id("ceramic")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3a3b3d" />
      <stop offset="0.35" stop-color="#232425" />
      <stop offset="1" stop-color="#121314" />
    </linearGradient>

    ${f`<linearGradient id=${e.id("foot")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000" stop-opacity="0.28" />
        <stop offset="0.25" stop-color="#000" stop-opacity="0.22" />
        <stop offset="1" stop-color="#000" stop-opacity="0.15" />
      </linearGradient>`}
    <linearGradient id=${e.id("toe-shade")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0.35" />
      <stop offset="0.45" stop-color="#000" stop-opacity="0" />
    </linearGradient>
    <linearGradient id=${e.id("reveal")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0.75" />
      <stop offset="0.22" stop-color="#000" stop-opacity="0.5" />
      <stop offset="0.3" stop-color="#000" stop-opacity="0.05" />
      <stop offset="0.85" stop-color="#000" stop-opacity="0.1" />
      <stop offset="1" stop-color="#000" stop-opacity="0.35" />
    </linearGradient>
    <linearGradient id=${e.id("screen")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#15181c" />
      <stop offset="1" stop-color="#0a0b0d" />
    </linearGradient>
    <linearGradient id=${e.id("band")} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#b3121f" stop-opacity="0" />
      <stop offset="0.25" stop-color="#c0141f" stop-opacity="0.9" />
      <stop offset="0.75" stop-color="#c0141f" stop-opacity="0.9" />
      <stop offset="1" stop-color="#b3121f" stop-opacity="0" />
    </linearGradient>

    <filter id=${e.id("noise")} x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.05 2" numOctaves="2" seed="7" stitchTiles="stitch" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.13 0 0 0 -0.078" result="light" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.13 0 0 0 0.052" result="dark" />
      <feMerge><feMergeNode in="dark" /><feMergeNode in="light" /></feMerge>
    </filter>
    <pattern id=${e.id("grain")} patternUnits="userSpaceOnUse" width="320" height="160">
      <rect width="320" height="160" fill="#fff" filter=${e.url("noise")} />
    </pattern>
    <filter id=${e.id("soft")} x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="1.1" />
    </filter>
    <filter id=${e.id("softer")} x="-30%" y="-60%" width="160%" height="220%">
      <feGaussianBlur stdDeviation="2.4" />
    </filter>
    <filter id=${e.id("floor")} x="-10%" y="-200%" width="120%" height="500%">
      <feGaussianBlur stdDeviation="3.2" />
    </filter>
    <filter id=${e.id("halo")} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="0.9" />
    </filter>
    <filter id=${e.id("glow")} x="-20%" y="-60%" width="140%" height="220%">
      <feGaussianBlur stdDeviation="2.2" />
    </filter>
    <filter id=${e.id("pill-shadow")} x="-30%" y="-60%" width="160%" height="220%">
      <feGaussianBlur stdDeviation="1.4" />
    </filter>
    <filter id=${e.id("offline")} color-interpolation-filters="sRGB">
      <feColorMatrix type="saturate" values="0.06" />
      <feComponentTransfer>
        <feFuncR type="linear" slope="0.6" intercept="0.24" />
        <feFuncG type="linear" slope="0.6" intercept="0.24" />
        <feFuncB type="linear" slope="0.6" intercept="0.24" />
      </feComponentTransfer>
    </filter>
  </defs>`}function kl(e){return e==="dark"?.62:.3}var fr=10;function zi(e){return e.height+e.below+(e.floor?16:8)+fr}function Xn(e,t,n,o){return ur(zi({height:t,below:n,floor:o}),e.pixelHeight)}var P=e=>Math.round(e*100)/100;function je(e,t,n,o,r,i={}){return f`
    ${at(e,Pe(t,n,o,r),i)}
    ${vn(t,n,o,r,.9)}
    ${wn(Pe(t,n,o,r),.4,.5)}
  `}function xl(e,t,n){return f`
    <rect x=${e} y=${t-.9} width=${n} height="1.8" fill="#1d1e1f" opacity="0.85" />
    <rect x=${e} y=${t+.9} width=${n} height="0.6" fill="#ffffff" opacity="0.55" />`}function zl(e,t,n){return f`<rect x=${e-.9} y=${t} width="1.8" height=${n} fill="#1d1e1f" opacity="0.85" />`}function ki(e,t,n,o,r,i){let a=Math.min(30,o*.09);return f`${je(e,t,n,o,r)}${Rt(e,t+a,t+o-a,n+i,"tubular")}`}function of(e,t,n,o,r,i,a){let s=a-i,l=u=>(u*7919+104729)%997/997,p=[];if(n==="freezer"){let u=["#eef3f6","#d3dfe7","#e4ddd0","#c2d1dc"];for(let h=0,g=o+3;g<r-12;h++){let y=Math.min(24+18*l(h),r-g-2),$=i+s*(.22+.38*l(h+5));p.push(f`
        <rect x=${P(g)} y=${P($)} width=${P(y)} height=${P(a-$+12)} rx="2.2" fill=${u[h%4]} />
        <rect x=${P(g+y-3)} y=${P($+1)} width="3" height=${P(a-$+10)} rx="1.5" fill="#000"
          opacity="0.1" />
        <rect x=${P(g+1.5)} y=${P($+.8)} width=${P(y-4)} height="1" rx="0.5" fill="#fff" opacity="0.75" />`),g+=y+2.5}}else{let u=[["fruit-r",7.5,6.8],["fruit-g",13,7.5],["fruit-o",6.8,6.2],["fruit-c",14,4.4],["fruit-y",6.4,5.2],["fruit-r",7,6.4],["fruit-g",11,7]];for(let h of[0,1]){let g=h?1:.8;for(let y=h*3,$=o+2+h*5;$<r-8;y++){let[b,_,v]=u[y%u.length],k=g*(.88+.24*l(y+11)),x=_*k,z=v*k,S=$+x,R=i+s*(h?.42+.16*l(y+2):.08+.14*l(y+4))+z,M=`M${P(S-x*.7)} ${P(R+z*.1)}Q${P(S)} ${P(R-z*.5)} ${P(S+x*.7)} ${P(R)}M${P(S-x*.2)} ${P(R-z*.25)}L${P(S-x*.05)} ${P(R+z*.6)}`,G=b==="fruit-g"?f`<path d=${M} fill="none" stroke="#d6e6a8" stroke-opacity="0.45" stroke-width="0.6" />`:f`<ellipse cx=${P(S-x*.32)} cy=${P(R-z*.42)} rx=${P(x*.22)} ry=${P(z*.13)}
                fill="#fff" opacity=${h?.22:.12} />`,T=h?w:f`<ellipse cx=${P(S)} cy=${P(R)} rx=${P(x)} ry=${P(z)} fill="#000" opacity="0.18" />`;p.push(f`
          <ellipse cx=${P(S+1)} cy=${P(R+1.6)} rx=${P(x)} ry=${P(z)} fill="#000" opacity="0.16" />
          <ellipse cx=${P(S)} cy=${P(R)} rx=${P(x)} ry=${P(z)} fill=${e.url(`${b}-${t}`)} />
          ${G}${T}`),$+=2*x-2+3*l(y+7)}}}let d=(u,h,g,y)=>f`
    <radialGradient id=${e.id(`${u}-${t}`)} cx="0.38" cy="0.32" r="0.75">
      <stop offset="0" stop-color=${h} />
      <stop offset="0.55" stop-color=${g} />
      <stop offset="1" stop-color=${y} />
    </radialGradient>`;return f`
    ${n==="produce"?f`<defs>
          ${d("fruit-r","#c4493d","#962c24","#5c1712")}
          ${d("fruit-g","#a3bf6a","#6b8f3c","#3a5722")}
          ${d("fruit-y","#ead36d","#c9a63a","#85681c")}
          ${d("fruit-o","#e9a456","#c27326","#7a4311")}
          ${d("fruit-c","#6f9450","#3f6630","#21391a")}
        </defs>`:w}
    ${p}
  `}function xi(e,t,n,o,r,i,a,s){let p=Math.round(Math.min(26,Math.max(14,i*.15))),d=n-(1.04-1)*r/2,u=o+p,h=r*1.04,g=i*1.04,y=5,$=4.5,b=o+3,_=u+.6,[v,k]=[n+y+3,n+r-y-3],[x,z]=[d+5*1.04,d+h-5*1.04],S=ue([[v+$,b],[k-$,b],[z-$*1.04,_],[x+$*1.04,_]]),R=ue([[v,b],[v+$,b],[x+$*1.04,_],[x,_]]),M=(v+k)/2,G=(x+z)/2,T=`translate(${P(d)} ${P(u)}) scale(${1.04}) translate(${P(-n)} ${P(-o)})`;return{body:f`
      <defs>
        <linearGradient id=${e.id(`bin-${t}`)} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#9eabb4" />
          <stop offset="0.45" stop-color="#dfe6eb" />
          <stop offset="1" stop-color="#f1f5f7" />
        </linearGradient>
        <linearGradient id=${e.id(`bin-side-${t}`)} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#c3ccd2" />
          <stop offset="1" stop-color="#8d9aa3" />
        </linearGradient>
        <clipPath id=${e.id(`bin-clip-${t}`)}><path d=${S} /></clipPath>
      </defs>
      <rect x=${n} y=${o} width=${r} height=${i} fill="#232527" />
      <rect x=${n+y} y=${o+2.5} width=${r-2*y} height=${i-4} fill="#0f1011" />
      <path d=${S} fill=${e.url(`bin-${t}`)} />
      <path d=${`M${P(M)} ${P(b)}L${P(G)} ${P(_)}`} stroke="#8796a0" stroke-width="1.6" />
      <path d=${`M${P(M-.8)} ${P(b)}L${P(G-.8)} ${P(_)}`} stroke="#fff" stroke-opacity="0.6"
        stroke-width="0.5" />
      <g clip-path=${e.url(`bin-clip-${t}`)}>
        ${of(e,t,s,v+$,k-$,b+2,_)}
      </g>
      <rect x=${n+y} y=${b} width=${r-2*y} height="5" fill="#000" opacity="0.28" />
      <path d=${R} fill=${e.url(`bin-side-${t}`)} />
      <path d=${R} fill=${e.url(`bin-side-${t}`)} transform=${`translate(${P(k+v)} 0) scale(-1 1)`} />
      <path d=${`M${P(v)} ${P(b)}L${P(x)} ${P(_)}M${P(k)} ${P(b)}L${P(z)} ${P(_)}`}
        stroke="#fff" stroke-opacity="0.6" stroke-width="0.8" />
      <rect x=${P(d+6)} y=${P(u+g-5)} width=${P(h-12)} height="11" fill="#000" opacity="0.34"
        filter=${e.url("blur-m")} />
      <g transform=${T}>${a}</g>
    `,at:(O,V)=>[d+(O-n)*1.04,u+(V-o)*1.04]}}function xn(e,t,n,o,r,i,a){let s=Math.min(16,r*.06),l=i*.025;return f`
    <defs>
      <linearGradient id=${e.id(`liner-${t}`)} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#eef3f6" />
        <stop offset="1" stop-color="#c9d3da" />
      </linearGradient>
    </defs>
    <rect x=${n} y=${o} width=${r} height=${i} fill=${e.url(`liner-${t}`)} />
    <path d=${ue([[n,o],[n+s,o+l],[n+s,o+i-l],[n,o+i]])} fill="#9fadb7"
      opacity="0.55" />
    <path d=${ue([[n+r,o],[n+r-s,o+l],[n+r-s,o+i-l],[n+r,o+i]])}
      fill="#ffffff" opacity="0.4" />
    ${a.map(p=>f`
        <rect x=${n+s} y=${P(o+i*p-5)} width=${r-2*s} height="5" fill="#ffffff" opacity="0.22" />
        <rect x=${n+1} y=${P(o+i*p)} width=${r-2} height="1.6" fill="#ffffff" opacity="0.85" />
        <rect x=${n+1} y=${P(o+i*p+1.6)} width=${r-2} height="2.2" fill="#6f7f8a" opacity="0.35" />`)}
    <rect x=${n} y=${o} width=${r} height="18" fill=${e.url("ao-down")} opacity="0.6" />
  `}function Vt(e,t,n,o,r,i,a,s,l=!1){let u=o*.34,h=Math.min(18,o*.08),g=Math.min(r*.015,fr-1),y=i==="left"?1:-1,$=i==="left"?t:t+o,b=$+y*u,_=b+y*h,v=G=>n-g*G,k=G=>n+r+g*G,x=ue([[$,v(0)],[b,v(1)],[b,k(1)],[$,k(0)]]),z=ue([[b,v(1)],[_,v(1)],[_,k(1)],[b,k(1)]]),S=ue([[_-y*3,v(1)],[_,v(1)],[_,k(1)],[_-y*3,k(1)]]),R=w;if(a==="v"){let G=1-14/o,T=$+y*u*G,O=T-y*.94*22,V=n+r*.2,Q=V+Math.min(420,r*.5);R=f`
      <path d=${`M${P(T)} ${P(V+6)}H${P(O)}M${P(T)} ${P(Q-6)}H${P(O)}`} stroke="#b9b9b7"
        stroke-width="4" />
      ${At(e,O,V,Q,8)}`}else if(a==="h"){let G=$+y*u*(16/o),T=$+y*u*(1-16/o);R=f`<rect x=${P(Math.min(G,T))} y=${P(v(.6)+15)} width=${P(Math.abs(T-G))} height="6.4"
      rx="3.2" fill=${e.url("chrome")} />`}let M=l?ue([[$+y*u*.1,v(.1)+22],[$+y*u*.88,v(.88)+22],[$+y*u*.88,k(.88)-30],[$+y*u*.1,k(.1)-30]]):null;return f`
    ${s}
    <path d=${ue([[_,n],[_+y*10,n],[_+y*10,n+r],[_,n+r]])} fill="#000" opacity="0.18"
      filter=${e.url("blur-s")} />
    ${at(e,x,{dim:.14})}
    ${M?f`<path d=${M} fill=${e.url("glass")} /><path d=${M} fill="#16130f" opacity="0.5" />`:w}
    <path d=${ue([[b-y*1,v(1)],[b,v(1)],[b,k(1)],[b-y*1,k(1)]])}
      fill="#ffffff" opacity="0.5" />
    <path d=${z} fill="#a9abac" />
    <path d=${z} fill=${e.url("ss-falloff")} />
    <path d=${S} fill="#2e3032" />
    ${wn(x,.35,.5)}
    ${R}
  `}function Sl(e,t,n,o,r){if(!t.available||!n.length)return[];let i=new Set,a=[],s=0;for(let[l,p]of Object.entries(t.readouts)){if(!p)continue;let d=n.find(u=>u.zone===l&&!i.has(u.zone));d||(d={...n[0],cy:n[0].cy+(Te+6)*r*++s}),i.add(d.zone),a.push(Lt(e,d.cx,d.cy,{text:p},[],o,r))}return a}function Ht(e,t,n){let{d:o,state:r}=e,i=t*10,a=n==="undercounter"||n==="drawers",s=a?345:840,l=a?40:45,p=s-l,d=(..._)=>r.available&&_.some(v=>r.doors[v]),u=r.available&&Object.values(r.doors).some(Boolean),h=[sr(o,5,p,i-10,l)],g=[],y=Math.min(420,p*.5),$=[.3,.52,.74];if(n==="column"||n==="undercounter"){if(u){let _=a?[.4,.7]:$;h.push(Vt(o,0,0,i,p,"right",a?"h":"v",xn(o,"door",0,0,i,p,_)))}else h.push(je(o,0,0,i,p)),a?h.push(Rt(o,16,i-16,18,"tubular")):h.push(At(o,14,p*.2,p*.2+y));g.push({zone:"ref",cx:i/2,cy:a?70:150},{zone:"frz",cx:i/2,cy:a?70:150})}else if(n==="drawers"){let _=p/2,v=_-.9,k=_+.9,x=p-k,z=d("ref2_door_ajar","frz_door_ajar"),S=ki(o,0,0,i,v,18),R=ki(o,0,k,i,x,19),M=u&&(!z||d("ref_door_ajar","door_ajar"))?xi(o,"upper",0,0,i,v,S,"produce"):null,G=d("frz_door_ajar")||r.readouts.frz?"freezer":"produce",T=z?xi(o,"lower",0,k,i,x,R,G):null;h.push(xl(0,_,i),T?T.body:R,M?M.body:S);let O=(V,Q)=>V?V.at(i/2,Q)[1]:Q;g.push({zone:"ref",cx:i/2,cy:O(M,70)},{zone:"ref2",cx:i/2,cy:O(T,_+70)}),g.push({zone:"frz",cx:i/2,cy:O(T,_+70)})}else if(n==="side_by_side"){let _=Math.round(i*.42),v=d("frz_door_ajar"),k=d("ref_door_ajar","door_ajar"),x=_-.9,z=_+.9,S=i-_-.9;if(v){let R=xn(o,"frz",0,0,x,p,[.22,.42,.62,.8]);h.push(Vt(o,0,0,x,p,"left","v",R))}else h.push(je(o,0,0,x,p),At(o,_-14,p*.22,p*.22+y));if(k){let R=xn(o,"ref",z,0,S,p,$);h.push(Vt(o,z,0,S,p,"right","v",R))}else h.push(je(o,z,0,S,p),At(o,_+14,p*.22,p*.22+y));h.push(zl(_,0,p)),g.push({zone:"frz",cx:_/2,cy:150},{zone:"ref",cx:_+(i-_)/2,cy:150})}else{let _=Math.round(p*.64),v=n==="french_door",k=d("ref_door_ajar","door_ajar"),x=_+.9,z=p-x,S=ki(o,0,x,i,z,24),R=d("frz_door_ajar")?xi(o,"frz",0,x,i,z,S,"freezer"):null;if(h.push(xl(0,_,i),R?R.body:S),v){let G=i/2-.9;k?(h.push(xn(o,"ref",0,0,i,_-.9,[.3,.6])),h.push(Vt(o,0,0,G,_-.9,"left","v",f``)),h.push(Vt(o,i/2+.9,0,G,_-.9,"right","v",f``))):(h.push(je(o,0,0,G,_-.9),je(o,i/2+.9,0,G,_-.9)),h.push(zl(i/2,0,_)),h.push(At(o,i/2-13,_*.3,_*.3+_*.45)),h.push(At(o,i/2+13,_*.3,_*.3+_*.45)))}else k?h.push(Vt(o,0,0,i,_-.9,"right","v",xn(o,"ref",0,0,i,_-.9,[.3,.6]))):(h.push(je(o,0,0,i,_-.9)),h.push(At(o,15,_*.3,_*.3+_*.48)));let M=R?R.at(i/2,_+80)[1]:_+80;g.push({zone:"ref",cx:i/2,cy:150},{zone:"frz",cx:i/2,cy:M})}let b=[a?"Undercounter refrigerator":"Refrigerator"];return u&&b.push("door open"),{width:i,height:s,below:0,floor:!0,body:f`${h}`,over:f`${Sl(o,r,g,e.reducedMotion,Xn(e,s,0,!0))}`,label:b}}function hr(e,t,n){let{d:o,state:r}=e,i=t*10,a=n?840:345,s=n?45:40,l=a-s,p=n?26:20,d=p,u=p,h=i-2*p,g=l-p-(n?36:28),y=!!r.readouts.wine2,$=r.available&&Object.values(r.doors).some(Boolean),b=Pe(d,u,h,g,3),_=u+6,k=(Q=>_+35*Q+27.5)(Math.max(0,Math.round((g/2-6-27.5)/35))),x=["bottle","bottle-amber","bottle-dark"],z=[];for(let Q=0;Q<4;Q++)for(let N=0;N<5;N++){let F=(Q*7+N*3+Q*N%4)%10,j=N*29+14.5,W=Q*35+14,ee=F===1||F===5||F===8;z.push(f`
        <circle cx=${j} cy=${W} r="12.2" fill=${o.url(x[F%3])} />
        ${ee?f`<circle cx=${j} cy=${W} r="5.2" fill=${F===5?"#c9a24e":"#6e1b2b"} />
              <circle cx=${j-1.5} cy=${W-1.7} r="1.5" fill="#fff" opacity="0.35" />`:f`<path d=${`M${j-8} ${W-6.5}A11 11 0 0 1 ${j-.5} ${W-10.7}`} fill="none" stroke="#e8f0e8"
              stroke-opacity="0.2" stroke-width="1.1" stroke-linecap="round" />`}
      `)}let S=[0,1,2,3].map(Q=>f`
      <rect x="0" y=${Q*35+27.5} width="145" height="4.2" fill="#9a774f" />
      <rect x="0" y=${Q*35+27.5} width="145" height="1" fill="#e2c49a" opacity="0.7" />
      <rect x="0" y=${Q*35+31.2} width="145" height="0.8" fill="#000" opacity="0.35" />`),R=f`
    <rect x=${d} y=${u} width=${h} height=${g} fill="#16130f" />
    <rect x=${d} y=${u} width=${h} height=${g} fill=${o.url("rack")} />
    ${y?f`<rect x=${d} y=${k-1} width=${h} height="6" fill="#0b0b0c" />
          <rect x=${d} y=${k-1} width=${h} height="0.6" fill="#fff" opacity="0.3" />`:w}
    <rect x=${d} y=${u} width=${h} height=${g} fill=${o.url("wine-light")} />`,M=["Wine storage"];$&&M.push("door open");let G=f`
    <defs>
      <clipPath id=${o.id("wine-glass")}><path d=${b} /></clipPath>
      ${[["bottle","#050706","#101712","#26332a","#4a5a4d","#151a16"],["bottle-amber","#0a0503","#22120a","#3a2312","#553a22","#160c06"],["bottle-dark","#030303","#0c0c0d","#1e1f21","#3c3e41","#111213"]].map(([Q,N,F,j,W,ee])=>f`<radialGradient id=${o.id(Q)} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color=${N} />
          <stop offset="0.42" stop-color=${F} />
          <stop offset="0.8" stop-color=${j} />
          <stop offset="0.93" stop-color=${W} />
          <stop offset="1" stop-color=${ee} />
        </radialGradient>`)}
      <pattern id=${o.id("rack")} width="145" height="140" patternUnits="userSpaceOnUse" x=${d+1} y=${_}>
        ${z}${S}
      </pattern>
      <linearGradient id=${o.id("wine-light")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff1d8" stop-opacity="0.55" />
        <stop offset="0.25" stop-color="#ffe9c4" stop-opacity="0.12" />
        <stop offset="1" stop-color="#000" stop-opacity="0.35" />
      </linearGradient>
    </defs>`,T=f`
    ${je(o,0,0,i,l)}
    <g clip-path=${o.url("wine-glass")}>
      ${R}
      <rect x=${d} y=${u} width=${h} height=${g} fill=${o.url("glass-env")} />
      <rect x=${d} y=${u} width=${h} height=${g} fill="#7a8a92" opacity="0.1" />
    </g>
    <path d=${b} fill="none" stroke="#0d0e0f" stroke-width="2" />
    <path d=${b} fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="0.6"
      transform="translate(0.8 0.8)" />
    ${At(o,i-11,l*.16,l*.16+Math.min(420,l*.6),7)}`,O=Vt(o,0,0,i,l,"left","v",f`<rect x="0" y="0" width=${i} height=${l} fill="#2a2520" />
      <g clip-path=${o.url("wine-glass")}>${R}</g>
      <rect x="0" y="0" width=${i} height="18" fill=${o.url("ao-down")} opacity="0.6" />`,!0),V=u+g*(y?.12:.18);return{width:i,height:a,below:0,floor:!0,body:f`
      ${G}
      ${sr(o,5,l,i-10,s)}
      ${$?O:T}
    `,over:f`
      ${Sl(o,r,[{zone:"wine",cx:i/2,cy:V},{zone:"wine2",cx:i/2,cy:k+5+g*.12}],e.reducedMotion,Xn(e,a,0,!0))}
    `,label:M}}function Si(e,t){let{d:n,state:o}=e,r=t*10,i=o.available&&Object.values(o.doors).some(Boolean),a=["Ice maker"];i&&a.push("door open"),o.available&&o.ice_maker?.cleaning&&a.push("cleaning");let s=[],l=r*.42,p=h=>(h*9301+49297)%233280/233280,d=0;for(let h=0;h<7;h++)for(let g=0;l+g*11<r-16;g++,d++){let y=7.5+3.5*p(d),$=l-4+g*11+h%2*5+4*p(d+7),b=158+h*11+5*p(d+13)-(h===0?4*p(d+3):0);s.push(Pe($,b,y,y*.85,2.2))}let u=f`
    ${xn(n,"ice",0,0,r,305,[.4])}
    <rect x="8" y="145" width=${r-16} height="150" rx="6" fill="#9fb0bd" />
    <path d=${s.join("")} fill="#f4f8fb" opacity="0.9" />
    <path d=${s.join("")} fill="none" stroke="#6f8494" stroke-width="0.7" />
    <rect x="8" y="145" width=${r-16} height="3" rx="1.5" fill="#ffffff" opacity="0.9" />`;return{width:r,height:345,below:0,floor:!0,body:f`
      ${sr(n,5,305,r-10,40)}
      ${i?Vt(n,0,0,r,305,"left","h",u):f`${je(n,0,0,r,305)}${Rt(n,14,r-14,19,"tubular")}`}
    `,label:a}}function Rl(e,t,n,o,r,i,a,s){let l=Pe(n,o,r,i,7),p=6,d=Pe(n+p,o+p,r-2*p,i-2*p,3),u=s&&!!a?.on,h=s&&!!a?.light,g=u?a?.preheated?.5:a?.progress!=null?.16+.64*a.progress:.35:0,y=[.42,.7].map($=>`M${P(n+p+4)} ${P(o+i*$)}H${P(n+r-p-4)}`).join("");return f`
    <defs>
      <clipPath id=${e.id(`win-${t}`)}><path d=${d} /></clipPath>
    </defs>
    ${ir(e,l)}
    <g clip-path=${e.url(`win-${t}`)}>
      ${h||u?f`
          <rect x=${n} y=${o} width=${r} height=${i} fill="#21180f" opacity=${h?.95:.7} />
          <path d=${y} stroke="#8f7a62" stroke-width="1.2" opacity=${h?.75:.3} />`:w}
      ${u?f`<rect x=${n} y=${o} width=${r} height=${i} fill=${e.url("heat")} opacity=${P(g)} />`:w}
      ${h?f`<rect x=${n} y=${o} width=${r} height=${i} fill=${e.url("cavity-light")} />`:w}
      ${h||u?f`<rect x=${n} y=${o} width=${r} height=${i} fill="#000" opacity="0.25" />`:w}
    </g>
    <path d=${`${l}${d}`} fill-rule="evenodd" fill="#050506" opacity="0.88" />
    <rect x=${n} y=${o} width=${r} height=${i} fill=${e.url("glass-env")} clip-path=${e.url(`win-${t}`)} />
    <path d=${l} fill="none" stroke="#000" stroke-opacity="0.6" stroke-width="1" />
  `}function Al(e,t){let n=$t[t]??$t.red;return f`
    <radialGradient id=${e.id("heat")} cx="0.5" cy="-0.05" r="1">
      <stop offset="0" stop-color="#c87a3e" stop-opacity="0.6" />
      <stop offset="0.3" stop-color="#8a4a1c" stop-opacity="0.42" />
      <stop offset="0.65" stop-color="#4a2510" stop-opacity="0.2" />
      <stop offset="1" stop-color="#1a0d06" stop-opacity="0" />
    </radialGradient>
    <linearGradient id=${e.id("cavity-light")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffd9a0" stop-opacity="0.25" />
      <stop offset="0.6" stop-color="#ffd9a0" stop-opacity="0.08" />
      <stop offset="1" stop-color="#ffd9a0" stop-opacity="0" />
    </linearGradient>
    <radialGradient id=${e.id("knob")} cx="0.4" cy="0.32" r="0.75">
      <stop offset="0" stop-color=${n.light} />
      <stop offset="0.55" stop-color=${n.base} />
      <stop offset="1" stop-color=${n.dark} />
    </radialGradient>
  `}function Ml(e,t,n){return e+Math.max(t*.28,Te*n/2+8)}function Tl(e,t){return t?t.on?[`${e} on${t.temp?` ${t.temp}`:""}`]:t.light?[`${e} light on`]:[]:[]}function Ri(e,t,n,o){let{d:r,state:i}=e,a=t*10,s=n?511:285,l=46,p=n?2:1,d=(s-l-2*p)/p,u=[],h=[],g=[n?"Double wall oven":"Wall oven"],y=[0,1].slice(0,p),$=Xn(e,s,0,!1),b=[];for(let _=0;_<5;_++)b.push(Pe(28+_*15,21,7,1.6,.8),Pe(a-98+_*15,21,7,1.6,.8));u.push(f`
    ${ir(r,Pe(0,0,a,l))}
    ${vn(0,0,a,l,.6)}
    <rect x=${a/2-34} y="11" width="68" height="22" rx="2.5" fill="#06090b" />
    <rect x=${a/2-34} y="11" width="68" height="22" rx="2.5" fill="none" stroke="#ffffff" stroke-opacity="0.12"
      stroke-width="0.6" />
    <path d=${b.join("")} fill="#ffffff" opacity="0.45" />
  `);for(let _ of y){let v=l+2+_*(d+2),k=o[_]??{prefix:_===0?"cav":"cav2",position:"single",width:null},x=i.ovens?.[k.prefix],z=n?_===0?"upper oven":"lower oven":"oven",S=d-66;if(u.push(f`
      ${je(r,0,v,a,d,{brush:"h"})}
      ${Rt(r,24,a-24,v+20,"tubular")}
      ${Rl(r,String(_),32,v+44,a-64,S,x,i.available)}
    `),i.available&&x?.on&&x.temp){let R=Ml(v+44,S,$);h.push(Lt(r,a/2,R,{text:x.temp},[],e.reducedMotion,$))}i.available&&g.push(...Tl(z,x))}return{width:a,height:s,below:0,floor:!1,body:f`<defs>${Al(r,e.knobs)}</defs>${u}`,over:f`${h}`,label:g}}function rf(e,t,n,o){let r=$t[o]??$t.red;return f`
    <circle cx=${t+1.2} cy=${n+2.6} r="13.5" fill="#000" opacity="0.25" filter=${e.url("blur-s")} />
    <circle cx=${t} cy=${n} r="13.5" fill=${e.url("chrome")} />
    <circle cx=${t} cy=${n} r="11" fill="#1b1617" />
    <circle cx=${t} cy=${n} r="10.4" fill=${e.url("knob")} />
    <rect x=${t-1.9} y=${n-8.6} width="3.8" height="17.2" rx="1.6" fill=${r.edge} opacity="0.85" />
    <rect x=${t-1.9} y=${n-8.2} width="1" height="16.4" rx="0.5" fill=${r.light} opacity="0.7" />
    <ellipse cx=${t-3.6} cy=${n-4.6} rx="3.8" ry="1.9" transform=${`rotate(-30 ${t-3.6} ${n-4.6})`}
      fill="#fff" opacity=${r.sheen*2} />
  `}function Cl(e,t,n,o){let{d:r,state:i}=e,a=t*10,s=360,l=20,p=66,d=l+p+2,u=42,h=s-u-d,g=o.length?o:[{prefix:"cav",position:"single",width:null}],y=g.reduce((R,M)=>R+(M.width??t/g.length),0),$=Math.max(4,n)+g.length,b=["Range"],_=[],v=Math.max(4,n),k=Xn(e,s,0,!0);for(let R=0;R<v;R++){let M=a/v*(R+.5);_.push(`M${P(M-16)} 9q16 -9 32 0`)}let x=[f`
      <rect x="2" y="5" width=${a-4} height="9" rx="1.5" fill="#1f2021" />
      <path d=${_.join("")} fill="none" stroke="#2c2d2f" stroke-width="5" stroke-linecap="round" />
      <path d=${_.join("")} fill="none" stroke="#5a5c5f" stroke-width="0.8" transform="translate(0 -2)" />
      ${at(r,Pe(0,13,a,7),{grain:0})}
      ${vn(0,13,a,7,1)}
      ${je(r,0,l,a,p,{brush:"h"})}
    `];for(let R=0;R<$;R++)x.push(rf(r,a/$*(R+.5),l+p/2,e.knobs));let z=0,S=[];return g.forEach((R,M)=>{let G=a*(R.width??t/g.length)/y-(M<g.length-1?1:0),T=i.ovens?.[R.prefix],O=h-82;x.push(f`
      ${je(r,z,d,G,h,{brush:"h"})}
      ${Rt(r,z+18,z+G-18,d+22,"pro")}
      ${Rl(r,String(M),z+26,d+52,G-52,O,T,i.available)}
    `),i.available&&T?.on&&T.temp&&S.push(Lt(r,z+G/2,Ml(d+52,O,k),{text:T.temp},[],e.reducedMotion,k)),i.available&&b.push(...Tl(g.length>1?`${R.position} oven`:"oven",T)),z+=G+2}),x.unshift(f`
    ${at(r,Pe(6,s-u,a-12,u),{dim:.12,grain:.08,brush:"h"})}
    <rect x="6" y=${s-u} width=${a-12} height="14" fill=${r.url("ao-down")} />
  `),{width:a,height:s,below:0,floor:!0,body:f`<defs>${Al(r,e.knobs)}</defs>${x}`,over:f`${S}`,label:b}}function af(e){if(e==null)return"#fff1d6";let t=Math.min(1,Math.max(0,(e-2700)/2300)),n=(o,r)=>Math.round(o+(r-o)*t);return`rgb(${n(255,238)}, ${n(214,244)}, ${n(160,255)})`}function Ai(e,t,n){let{d:o,state:r}=e,i=t*10,a=n!=="insert",s=a?350:130,l=a?175:0,p=s-50,d=n==="island"?140:112,u=r.available?r.hood:void 0,h=u?.light??!1,g=h?.35+.65*((u?.brightness??100)/100):0,y=af(u?.kelvin??null),$=[[i/2-i*.3,l],[i/2+i*.3,l],[i,p],[0,p]],b=["Ventilation hood"];return h&&b.push("light on"),u&&u.fan>0&&b.push(`fan speed ${u.fan}`),{width:i,height:s,below:110,floor:!1,body:f`
      <defs>
        <linearGradient id=${o.id("canopy-shade")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.16" />
          <stop offset="1" stop-color="#000000" stop-opacity="0.12" />
        </linearGradient>
      </defs>
      ${a?f`
          ${at(o,Pe(i/2-d/2,0,d,l+2),{brush:"h"})}
          ${vn(i/2-d/2,0,d,l+2,.6)}
          <rect x=${i/2-d/2} y=${l*.48} width=${d} height="1.2" fill="#000" opacity="0.25" />
          <rect x=${i/2-d/2} y=${l*.48+1.2} width=${d} height="0.7" fill="#fff" opacity="0.5" />
          <rect x=${i/2-d/2} y=${l-6} width=${d} height="8" fill=${o.url("ao-up")} />`:w}
      ${a?f`
          ${at(o,ue($),{brush:"h"})}
          <path d=${ue($)} fill=${o.url("canopy-shade")} />
          <path d=${`M${P($[0][0])} ${l}L${P($[1][0])} ${l}`} stroke="#fff" stroke-opacity="0.7"
            stroke-width="0.8" />`:w}
      ${je(o,0,p,i,46,{brush:"h"})}
      ${[0,1,2,3].map(_=>{let v=i-90+_*19,k=p+23;return f`
          <circle cx=${v+.5} cy=${k+1.2} r="3.4" fill="#000" opacity="0.25" filter=${o.url("blur-s")} />
          <circle cx=${v} cy=${k} r="3.2" fill=${o.url("chrome")} />
          <circle cx=${v} cy=${k} r="3.2" fill="none" stroke="#3b3a37" stroke-opacity="0.55" stroke-width="0.5" />
          <circle cx=${v-.8} cy=${k-1} r="1.1" fill="#fff" opacity="0.5" />`})}
      <rect x="2" y=${p+46} width=${i-4} height="4" fill="#3a3c3e" />
      <rect x="2" y=${p+49} width=${i-4} height="1" fill="#000" opacity="0.5" />
    `,over:h?f`
        <defs>
          <radialGradient id=${o.id("hood-light")} gradientUnits="userSpaceOnUse" cx=${i/2} cy=${s}
            r=${P(i*.6)} gradientTransform=${`translate(${i/2} ${s}) scale(1 0.32) translate(${-i/2} ${-s})`}>
            <stop offset="0" stop-color=${y} stop-opacity=${P(.8*g)} />
            <stop offset="0.5" stop-color=${y} stop-opacity=${P(.3*g)} />
            <stop offset="1" stop-color=${y} stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect x=${P(-i*.12)} y=${s} width=${P(i*1.24)} height="106" fill=${o.url("hood-light")} />
        <rect x="20" y=${s-1} width=${i-40} height="2" rx="1" fill=${y} opacity=${P(.9*g)} />`:w,label:b}}function Mi(e,t){let{d:n,state:o}=e,r=t*10,i=Wn(o),a=Xn(e,yt,0,!0),s={kind:"stainless",handle:"tubular"},{body:l,statusY:p}=_i(n,r,s,i,!1,Te*a),{label:d,chips:u}=pr(o),h=o.dishwasher,g=o.available&&!i&&h?cr[h.status]:void 0;return{width:r,height:yt,below:0,floor:!0,body:l,over:f`
      ${g?bi(n,r,g):w}
      ${Lt(n,r/2,p,d,u,e.reducedMotion,a)}
    `,label:["Dishwasher",...dr(o).filter(y=>y!=="offline")]}}function Gl(e,t){let{d:n}=e,o=t*10;return{width:o,height:345,below:0,floor:!0,body:f`
      ${at(n,Pe(6,305,o-12,40),{dim:.12,grain:.08})}
      <rect x="6" y="305" width=${o-12} height="14" fill=${n.url("ao-down")} />
      ${ir(n,Pe(0,0,o,38))}
      ${vn(0,0,o,38,.6)}
      <rect x=${o/2-26} y="12" width="52" height="14" rx="2" fill="#06090b" />
      <rect x=${o/2-26} y="12" width="52" height="14" rx="2" fill="none" stroke="#fff" stroke-opacity="0.12"
        stroke-width="0.6" />
      ${je(n,0,40,o,265)}
      ${Rt(n,20,o-20,60,"tubular")}
    `,label:["Appliance"]}}function ve(e,t){return e&&Number.isFinite(e)?Math.min(72,Math.max(12,e)):t}function lf(e,t){switch(e.form){case"column_wine":case"wine_over_drawers":return hr(t,ve(e.width,24),!0);case"undercounter_wine":case"undercounter_beverage":return hr(t,ve(e.width,24),!1);case"ice_maker":return Si(t,ve(e.width,15));case"undercounter_refrigerator":return Ht(t,ve(e.width,24),"undercounter");case"undercounter_drawers":return Ht(t,ve(e.width,24),"drawers");case"side_by_side":return Ht(t,ve(e.width,48),"side_by_side");case"french_door":return Ht(t,ve(e.width,36),"french_door");case"over_under":case"tall_over_under":return Ht(t,ve(e.width,e.form==="tall_over_under"?30:36),"over_under");default:return Ht(t,ve(e.width,30),"column")}}function cf(e,t){switch(e.form){case"refrigerator":{let n=ve(e.width,36);return Ht(t,n,n<=30?"column":n<42?"over_under":"side_by_side")}case"wine":{let n=ve(e.width,24);return hr(t,n,n===18||n>=30)}case"ice_maker":return Si(t,ve(e.width,15));case"oven":return Ri(t,ve(e.width,30),!!t.state.ovens?.cav2,[]);case"hood":return Ai(t,ve(e.width,36),"wall");case"dishwasher":return Mi(t,ve(e.width,24));default:return Gl(t,ve(e.width,24))}}function pf(e,t){switch(e.family){case"refrigeration":return lf(e,t);case"range":return Cl(t,ve(e.width,30),e.burners||4,e.ovens??[]);case"wall_oven":return Ri(t,ve(e.width,30),e.form==="double",e.ovens??[]);case"hood":return Ai(t,ve(e.width,36),e.form);case"dishwasher":return Mi(t,ve(e.width,24));default:return cf(e,t)}}function mr(e){let t=new _n(e.uid),{state:n}=e,o=pf(e.spec,{d:t,state:n,knobs:e.appearance?.knobs??"red",reducedMotion:!!e.reducedMotion,pixelHeight:e.pixelHeight}),r=14,i=n.available?o.label.join(", "):`${o.label[0]}, offline`;return A`<svg
    viewBox=${`${-r} ${-fr} ${o.width+2*r} ${zi(o)}`}
    role="img"
    aria-label=${i}
  >
    <defs>${rr(t)}</defs>
    ${o.floor?ar(t,0,o.width,o.height,e.theme):w}
    <g filter=${n.available?w:t.url("offline")}>${o.body}</g>
    ${n.available?o.over??w:w}
  </svg>`}var Pl={stainless:{mid:"#d1d0ce",grain:1},black:{mid:"#505256",grain:.7},carbon:{mid:"#84878b",grain:.85}},Ll=[[0,.561],[.05,.575],[.12,.624],[.2,.724],[.3,.86],[.4,.937],[.5,.991],[.58,1],[.66,.955],[.75,.86],[.85,.706],[.95,.588],[1,.566]],gr=[[0,.64],[.06,.69],[.15,.77],[.25,.89],[.35,.955],[.45,.96],[.55,.975],[.62,1],[.7,.95],[.8,.885],[.9,.785],[1,.7]],df=[[0,"#070707"],[.1,"#0c0c0c"],[.2,"#141414"],[.3,"#1f1f1f"],[.4,"#2a2a2a"],[.5,"#333333"],[.6,"#2b2b2b"],[.7,"#1f1f1f"],[.8,"#141414"],[.9,"#0c0c0c"],[1,"#070707"]],uf=[[0,"#1a1a1a"],[.17,"#262626"],[.27,"#2e2e2e"],[.4,"#393939"],[.5,"#3a3a3a"],[.6,"#363636"],[.7,"#2b2b2b"],[.8,"#222222"],[1,"#161616"]],El={red:{light:"#953c42",base:"#843236",dark:"#62191e",rim:"#a5676a"},black:{light:"#3c3c3f",base:"#262628",dark:"#141415",rim:"#58585c"},stainless:{light:"#dfe0e1",base:"#b4b6b8",dark:"#7f8285",rim:"#eff0f0"}};function yr(e){return{uid:e,metal:`${e}-metal`,sheen:`${e}-sheen`,glass:`${e}-glass`,blackGlass:`${e}-black-glass`,chrome:`${e}-chrome`,capEndLeft:`${e}-cap-l`,capEndRight:`${e}-cap-r`,knob:`${e}-knob`,knobRim:`${e}-knob-rim`,bezelRight:`${e}-bezel-r`,bezelLeft:`${e}-bezel-l`,bevelTop:`${e}-bevel-t`,bevelLeft:`${e}-bevel-l`,bevelRight:`${e}-bevel-r`,bevelBottom:`${e}-bevel-b`,recessRight:`${e}-recess-r`,recessBottom:`${e}-recess-b`,dropShadow:`${e}-drop`,grain:`${e}-grain`,offline:`${e}-offline`,blur:`${e}-blur`,blurWide:`${e}-blur-wide`,blurFine:`${e}-blur-fine`,pillShadow:`${e}-pill-shadow`}}var E=e=>`url(#${e})`;function Ti(e,t,n,o,r=1,i=Ll){let a=Pl[t].mid;return f`<linearGradient id=${e} gradientUnits="userSpaceOnUse" x1=${n} y1="0" x2=${n+o} y2="0">
    ${i.map(([s,l])=>f`<stop offset=${s} stop-color=${ff(a,1-(1-l)*r)} />`)}
  </linearGradient>`}function zn(e,[t,n,o,r],i,a){return f`<linearGradient id=${e} x1=${t} y1=${n} x2=${o} y2=${r}>
    <stop offset="0" stop-color="#fff" stop-opacity=${i} />
    <stop offset="1" stop-color="#fff" stop-opacity=${a} />
  </linearGradient>`}function $r(e,t){let n=Pl[t.finish],o=El[t.knobs]??El.red,r=t.parts??{},{x:i,y:a,width:s,height:l}=t,p=i+s,d=a+l,u=(.1*n.grain).toFixed(3),h=(.5-.05*n.grain).toFixed(3),g=$=>$.map(([b,_])=>f`<stop offset=${b} stop-color=${_} />`),y=f`
    <stop offset="0" stop-color="#fff" stop-opacity="0.08" />
    <stop offset="0.5" stop-color="#fff" stop-opacity="0.02" />
    <stop offset="1" stop-color="#000" stop-opacity="0.05" />`;return f`
    ${Ti(e.metal,t.finish,i,s,1,t.light??Ll)}
    <linearGradient id=${e.sheen} gradientUnits="userSpaceOnUse" x1="0" y1=${a} x2="0" y2=${d}>
      <stop offset="0" stop-color="#fff" stop-opacity="0.06" />
      <stop offset="0.35" stop-color="#fff" stop-opacity="0" />
      <stop offset="0.7" stop-color="#000" stop-opacity="0" />
      <stop offset="1" stop-color="#000" stop-opacity="0.05" />
    </linearGradient>
    ${r.glass?f`<linearGradient id=${e.glass} gradientUnits="userSpaceOnUse" x1=${i} y1="0" x2=${p} y2="0">
          ${g(uf)}
        </linearGradient>`:w}
    ${r.blackGlass?f`<linearGradient id=${e.blackGlass} gradientUnits="userSpaceOnUse" x1=${i} y1="0" x2=${p} y2="0">
          ${g(df)}
        </linearGradient>`:w}
    <linearGradient id=${e.chrome} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8a8988" />
      <stop offset="0.07" stop-color="#a09f9d" />
      <stop offset="0.11" stop-color="#cac9c7" />
      <stop offset="0.15" stop-color="#fbfbfa" />
      <stop offset="0.3" stop-color="#ffffff" />
      <stop offset="0.35" stop-color="#f7f7f6" />
      <stop offset="0.4" stop-color="#dfdedc" />
      <stop offset="0.45" stop-color="#d6d5d3" />
      <stop offset="0.53" stop-color="#e2e1df" />
      <stop offset="0.62" stop-color="#d8d7d5" />
      <stop offset="0.73" stop-color="#cdccca" />
      <stop offset="0.79" stop-color="#dad9d7" />
      <stop offset="0.85" stop-color="#f9f9f8" />
      <stop offset="0.9" stop-color="#f0efee" />
      <stop offset="0.95" stop-color="#bebdbb" />
      <stop offset="1" stop-color="#8c8b89" />
    </linearGradient>
    ${r.caps?f`
        <linearGradient id=${e.capEndLeft} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#000" stop-opacity="0.3" />
          <stop offset="0.25" stop-color="#000" stop-opacity="0.04" />
          <stop offset="0.4" stop-color="#fff" stop-opacity="0.1" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
        <linearGradient id=${e.capEndRight} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stop-color="#000" stop-opacity="0.34" />
          <stop offset="0.25" stop-color="#000" stop-opacity="0.06" />
          <stop offset="0.4" stop-color="#fff" stop-opacity="0.06" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>`:w}
    ${r.knob?f`
        <radialGradient id=${e.knob} cx="0.45" cy="0.32" r="0.8">
          <stop offset="0" stop-color=${o.light} />
          <stop offset="0.45" stop-color=${o.base} />
          <stop offset="0.85" stop-color=${o.base} />
          <stop offset="1" stop-color=${o.dark} />
        </radialGradient>`:w}
    ${r.bezel?f`
        <linearGradient id=${e.knobRim}><stop offset="0" stop-color=${o.rim} /></linearGradient>
        <linearGradient id=${e.bezelRight} x1="1" y1="0.65" x2="0" y2="0.35">${y}</linearGradient>
        <linearGradient id=${e.bezelLeft} x1="0" y1="0.65" x2="1" y2="0.35">${y}</linearGradient>`:w}
    ${r.bevel?f`
        ${zn(e.bevelTop,[0,0,0,1],.03,.1)}
        ${zn(e.bevelLeft,[0,0,1,0],.1,.3)}
        ${zn(e.bevelRight,[1,0,0,0],.05,.19)}
        ${zn(e.bevelBottom,[0,1,0,0],.08,.24)}`:w}
    ${r.recess?f`
        ${zn(e.recessRight,[0,0,1,0],.3,0)}
        ${zn(e.recessBottom,[0,0,0,1],.3,0)}`:w}
    ${r.dropShadow?f`
        <linearGradient id=${e.dropShadow} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#000" stop-opacity="0.34" />
          <stop offset="0.45" stop-color="#000" stop-opacity="0.12" />
          <stop offset="1" stop-color="#000" stop-opacity="0" />
        </linearGradient>`:w}
    <filter id=${e.grain} x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.006 0.85" numOctaves="2" seed="11" result="noise" />
      <feColorMatrix in="noise" type="matrix"
        values="0.5 0.5 0 0 0  0.5 0.5 0 0 0  0.5 0.5 0 0 0  0 0 0 0 1" result="gray" />
      <feComponentTransfer in="gray" result="grain">
        <feFuncR type="linear" slope=${u} intercept=${h} />
        <feFuncG type="linear" slope=${u} intercept=${h} />
        <feFuncB type="linear" slope=${u} intercept=${h} />
      </feComponentTransfer>
      <feBlend in="grain" in2="SourceGraphic" mode="overlay" result="brushed" />
      <feComposite in="brushed" in2="SourceAlpha" operator="in" />
    </filter>
    ${r.offline?f`
        <filter id=${e.offline} color-interpolation-filters="sRGB">
          <feColorMatrix type="saturate" values="0.08" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.62" intercept="0.2" />
            <feFuncG type="linear" slope="0.62" intercept="0.2" />
            <feFuncB type="linear" slope="0.62" intercept="0.2" />
          </feComponentTransfer>
        </filter>`:w}
    <filter id=${e.blur} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.4" />
    </filter>
    ${r.wideBlur?f`<filter id=${e.blurWide} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>`:w}
    ${r.fineBlur?f`<filter id=${e.blurFine} x="-10%" y="-200%" width="120%" height="500%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>`:w}
    ${r.pills?f`<filter id=${e.pillShadow} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>`:w}
  `}function Ol(e,t,n,o,r,i){let a=`${e.uid}-contact`,s=i==="dark"?.62:.3;return f`
    <radialGradient id=${a}>
      <stop offset="0" stop-color="#000" stop-opacity=${s} />
      <stop offset="0.6" stop-color="#000" stop-opacity=${s*.45} />
      <stop offset="1" stop-color="#000" stop-opacity="0" />
    </radialGradient>
    <ellipse cx=${t} cy=${n} rx=${o} ry=${r} fill=${E(a)} />
  `}function te(e){return e.map(([t,n])=>`${m(t)},${m(n)}`).join(" ")}function m(e){return Math.round(e*100)/100}function qe(e,t=0,n=1){return Math.min(n,Math.max(t,e))}function we(e,t,n){let o=Dl(e),r=Dl(t),i=qe(n);return`#${o.map((a,s)=>Math.round(a+(r[s]-a)*i)).map(a=>a.toString(16).padStart(2,"0")).join("")}`}function ff(e,t){return t<=1?we("#000000",e,t):we(e,"#ffffff",t-1)}function Dl(e){let t=e.replace("#","");return[0,2,4].map(n=>parseInt(t.slice(n,n+2),16))}var on=122,Qn=30,Jn=9.5,Sn=2.5,Mt=16,_r=3.5,Nl=1.5,eo=18.5,hf=13,mf=2.2,Bl=6.5,gf=.8,Gi=59,Vl=92,Ci=24,yf=17.7,$f=[0,18,32,46,60];function jl(e){return{baffles:`${e}-baffles`,canopy:`${e}-canopy`,flange:`${e}-flange`,lens:`${e}-lens`,lampGlow:`${e}-lamp-glow`,wood:`${e}-wood`,lightCone:`${e}-cone`,fade:`${e}-fade`,fadeMask:`${e}-fade-mask`,vapor:`${e}-vapor`}}var It=[[2700,"#ffd29a"],[3500,"#ffe8c8"],[4e3,"#fff4e6"],[5e3,"#eef4ff"]];function Ul(e){let t=qe(e??3800,It[0][0],It[It.length-1][0]);for(let n=1;n<It.length;n++){let[o,r]=It[n];if(t<=o){let[i,a]=It[n-1];return we(a,r,(t-i)/(o-i))}}return It[It.length-1][1]}function Ei(e){let t=e<=300?2:e<=420?3:e<=540?4:5,n=e/2,o=Array.from({length:t},(a,s)=>Vl+(e-Vl*2)*s/(t-1)),r=a=>{let s=n+a*Gi,l=o.filter(d=>a*(d-n)>1).sort((d,u)=>a*(u-d));if(!l.some(d=>Math.abs(d-s)<Ci))return l;let p=a<0?Math.min(l[0],s-Ci):Math.max(l[0],s+Ci);return l.map((d,u)=>p+(s-p)*u/l.length)},i=o.filter(a=>Math.abs(a-n)<=1);return[...r(-1),...i,...r(1)].sort((a,s)=>a-s)}function Kl(e,t,n,o){let r=(o?_r:0)+Nl;return[[e+r,n],[t-r,n],[t-eo,n+Mt],[e+eo,n+Mt]]}function Wl(e,t,n){let o=n==="light"?we(t.lightColor,"#ffffff",.5):t.lightColor;return f`
    <linearGradient id=${e.flange} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c6c8ca" />
      <stop offset="1" stop-color="#b3b5b7" />
    </linearGradient>
    <linearGradient id=${e.lens} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#d6d7d9" />
      <stop offset="0.3" stop-color="#e6e7e8" />
      <stop offset="0.62" stop-color="#cfd0d2" />
      <stop offset="0.85" stop-color="#a7a9ab" />
      <stop offset="1" stop-color="#b9bbbd" />
    </linearGradient>
    <linearGradient id=${e.lightCone} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color=${o} stop-opacity="0.85" />
      <stop offset="0.4" stop-color=${o} stop-opacity="0.32" />
      <stop offset="1" stop-color=${o} stop-opacity="0" />
    </linearGradient>
    <radialGradient id=${e.lampGlow}>
      <stop offset="0" stop-color=${t.lightColor} stop-opacity="0.8" />
      <stop offset="0.45" stop-color=${t.lightColor} stop-opacity="0.32" />
      <stop offset="1" stop-color=${t.lightColor} stop-opacity="0" />
    </radialGradient>
    <linearGradient id=${e.fade} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0" />
      <stop offset="0.6" stop-color="#fff" stop-opacity="1" />
    </linearGradient>
    <filter id=${e.vapor} x="-200%" y="-30%" width="500%" height="160%">
      <feGaussianBlur stdDeviation="4" />
    </filter>
  `}function Zl(e,t,n,o){let r=Math.min(90,n*.3),i=[[r,o],[n-r,o],[n,o+on],[0,o+on]];return f`
    ${Ti(t.canopy,"stainless",0,n,.35,gr)}
    <polygon points=${te(i)} fill=${E(t.canopy)} />
    <polygon points=${te(i)} fill=${E(e.sheen)} />
  `}function ql(e,t){let n=Math.min(90,e*.3);return f`
    <line x1=${n} y1=${t+.4} x2=${e-n} y2=${t+.4} stroke="#000" stroke-width="0.8"
      opacity="0.35" />
    <line x1=${n+.3} y1=${t+1.2} x2=${e-n-.3} y2=${t+1.2} stroke="#fff"
      stroke-width="0.6" opacity="0.35" />
    <line x1=${n} y1=${t} x2="0" y2=${t+on} stroke="#fff" stroke-width="0.8" opacity="0.4" />
    <line x1=${e-n} y1=${t} x2=${e} y2=${t+on} stroke="#000" stroke-width="0.8"
      opacity="0.2" />
  `}function Yl(e,t,n,o){let r=o+Qn,i=[[t,r],[n,r],[n-_r,r+Jn],[t+_r,r+Jn]];return f`
    <rect x=${t} y=${o} width=${m(n-t)} height=${Qn} fill=${E(e.metal)} />
    <polygon points=${te(i)} fill=${E(e.metal)} />
    <polygon points=${te(i)} fill="#000" opacity="0.07" />
  `}function Xl(e,t,n,o,r,i,a=!0){let s=o-n,l=(n+o)/2,p=r+Qn,d=a?p+Jn:r,u=d+Sn,h=u+Mt,g=a?_r:0,y=g+Nl,$=V=>y+(eo-y)*(V-u)/Mt,b=Kl(n,o,u,a),_=u+mf,v=_+Bl,k=h-gf,x=V=>$(V)+hf,z=[[n+x(_),_],[o-x(_),_],[o-x(k),k],[n+x(k),k]],S=Ei(s).map(V=>n+V),R=s>=420?[l-41,l+41,n+s*.2,o-s*.2]:[l-41,l+41],M=n+x(k),G=o-x(k),T=`${e.uid}-opening`,O=`${e.uid}-underside`;return f`
    ${a?f`
        <line x1=${n} y1=${r+.3} x2=${o} y2=${r+.3} stroke="#000" stroke-width="0.6" opacity="0.22" />
        <line x1=${n} y1=${r+1.3} x2=${o} y2=${r+1.3} stroke="#fff" stroke-width="0.5" opacity="0.25" />
        <line x1=${n} y1=${p} x2=${o} y2=${p} stroke="#000" stroke-width="0.5" opacity="0.16" />
        <line x1=${n} y1=${p+.6} x2=${o} y2=${p+.6} stroke="#fff" stroke-width="0.5"
          opacity="0.3" />`:w}
    <polygon points=${te([[n+g,d],[o-g,d],[o-y,u],[n+y,u]])}
      fill=${E(e.chrome)} />
    <line x1=${n+g} y1=${d+.2} x2=${o-g} y2=${d+.2} stroke="#000" stroke-width="0.6"
      opacity="0.4" />
    <clipPath id=${O}><polygon points=${te(b)} /></clipPath>
    <clipPath id=${T}><polygon points=${te(z)} /></clipPath>
    <polygon points=${te(b)} fill=${E(t.flange)} />
    <g clip-path=${E(T)}>
      <rect x=${n} y=${m(_)} width=${m(s)} height=${m(k-_)} fill="#57595b" />
      ${_f(t,M,G,l,_,R)}
      <rect x=${m(M)} y=${m(v)} width=${m(G-M)} height=${m(k-v)}
        fill="#828486" />
      <line x1=${m(M)} y1=${m(v+2.2)} x2=${m(G)} y2=${m(v+2.2)} stroke="#fff"
        stroke-width="0.4" opacity="0.1" />
      <line x1=${m(M)} y1=${m(v+4.4)} x2=${m(G)} y2=${m(v+4.4)} stroke="#000"
        stroke-width="0.4" opacity="0.08" />
      <line x1=${m(M)} y1=${m(v+.2)} x2=${m(G)} y2=${m(v+.2)} stroke="#000"
        stroke-width="0.5" opacity="0.3" />
      ${[M,G].map(V=>f`<line x1=${m(V)} y1=${m(_)} x2=${m(V)} y2=${m(k)} stroke="#000"
          stroke-width="0.4" opacity="0.3" />`)}
      <rect x=${n} y=${m(_)} width=${m(s)} height="1.6" fill="#000" opacity="0.18" />
    </g>
    <polygon points=${te(z)} fill="none" stroke="#000" stroke-width="0.5" opacity="0.35" />
    <rect x=${m(M)} y=${m(k)} width=${m(G-M)} height=${m(h-k)} fill="#e4e5e6" />
    ${i.light>0?f`<g clip-path=${E(O)}>${S.map(V=>f`<ellipse cx=${m(V)} cy=${m(u+4)} rx="30" ry=${Mt}
            fill=${E(t.lampGlow)} opacity=${m(.5+.5*i.light)} />`)}</g>`:w}
    <clipPath id=${`${e.uid}-below-edge`}>
      <rect x=${m(n-20)} y=${m(d)} width=${m(s+40)} height=${m(Mt+Sn+20)} />
    </clipPath>
    <g clip-path=${E(`${e.uid}-below-edge`)}>${S.map(V=>bf(e,t,V,u,i))}</g>
    ${Hl(e,l-Gi,u,"light",i.light>0?18+i.light*42:0)}
    ${Hl(e,l+Gi,u,"fan",$f[Math.round(qe(i.fan,0,4))])}
  `}function _f(e,t,n,o,r,i){let a=yf,s=6.8,l=4.5,p=Bl,d=2.5,u=p*.5,h=(b,_)=>f`
    <rect x=${m(b)} y="0" width=${m(_-b)} height=${p} fill=${E(`${e.baffles}-back`)} />
    <path fill="#6a6c6e" d=${`M ${m(b)} 0 H ${m(b+d)} V ${m(u)} Q ${m(b+d)} ${m(p*.88)} ${m(b)} ${p} Z`} />
    <path fill="#66686a" d=${`M ${m(_)} 0 H ${m(_-d)} V ${m(u)} Q ${m(_-d)} ${m(p*.88)} ${m(_)} ${p} Z`} />
    <line x1=${m(b+.15)} y1="0" x2=${m(b+.15)} y2=${p} stroke="#000" stroke-width="0.3" opacity="0.3" />`,g=[...i].sort((b,_)=>b-_),y=[t,...g,n],$=y.slice(0,-1).map((b,_)=>{let v=y[_+1],k=b<o&&v>o?o-s/2:v<=o?v-l-a:b+l+a-s,x=`${e.baffles}-${_}`;return f`
      <pattern id=${x} patternUnits="userSpaceOnUse" x=${m(k)} y=${m(r)} width=${m(a*2)} height=${p}>
        ${[0,a].map(z=>f`
            <rect x=${m(z)} y="0" width=${s} height=${p} fill="#9fa1a3" />
            ${h(z+s,z+a)}`)}
        <circle cx=${m(a+s+(a-s)/2)} cy=${m(p*.36)} r="0.38" fill="#1c1e20" />
        <rect x=${m(a+s+(a-s)/2-.16)} y=${m(p*.44)} width="0.32" height=${m(p*.26)}
          rx="0.16" fill="#26282a" />
      </pattern>
      <rect x=${m(b)} y=${m(r)} width=${m(v-b)} height=${p} fill=${E(x)} />`});return f`
    <linearGradient id=${`${e.baffles}-back`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#626466" />
      <stop offset="1" stop-color="#46484a" />
    </linearGradient>
    ${$}
    ${g.map(b=>f`<rect x=${m(b-2.4)} y=${m(r)} width="4.8" height=${p} fill="#9fa1a3" />
        <rect x=${m(b-.35)} y=${m(r)} width="0.7" height=${p} fill="#2c2e30" />`)}
  `}function bf(e,t,n,o,r){let a=o+.3,s=`M ${m(n-2.05)} ${m(a)} H ${m(n+2.05)} V ${m(a+4.5-2.05)} A ${2.05} ${2.05} 0 0 1 ${m(n-2.05)} ${m(a+4.5-2.05)} Z`;return r.light<=0?f`<path d=${s} transform="translate(0 0.6)" fill="#000" opacity="0.16" /><path d=${s} fill=${E(t.lens)} />`:f`
    <circle cx=${m(n)} cy=${m(a+2.4)} r="6" fill=${r.lightColor}
      opacity=${m(.6+.4*r.light)} filter=${E(e.blur)} />
    <path d=${s} fill="#ffffff" />
  `}function Hl(e,t,n,o,r){let i=n,a=r*Math.PI/180,s=Math.cos(a),l=Math.sin(a),p=3.45,d=1.7,u=Math.abs(p*2*s),h=Math.abs(d*l),g=Math.max(u+h,.6)/2,y=t-g,$=l>=0?y+u:y,b=Math.min(.8,g),_=i+1.5,v=i+2.2,k=i+5.4,x=[`M ${m(t-7.6)} ${m(_)} L ${m(t+7.6)} ${m(_)}`,`Q ${m(t+g)} ${m(_)} ${m(t+g)} ${m(v)}`,`L ${m(t+g)} ${m(k-b)} Q ${m(t+g)} ${m(k)} ${m(t+g-b)} ${m(k)}`,`L ${m(t-g+b)} ${m(k)} Q ${m(t-g)} ${m(k)} ${m(t-g)} ${m(k-b)}`,`L ${m(t-g)} ${m(v)} Q ${m(t-g)} ${m(_)} ${m(t-7.6)} ${m(_)} Z`].join(" "),z=s>.45;return f`
    <ellipse cx=${t} cy=${m(i+1.6)} rx="10.5" ry="1.6" fill="#000" opacity="0.2" />
    <path fill=${E(e.chrome)} d=${[`M ${m(t-9.9)} ${m(i-.3)} Q ${t} ${m(i-1.3)} ${m(t+9.9)} ${m(i-.3)}`,`L ${m(t+9.9)} ${m(i+.6)} Q ${t} ${m(i+1.6)} ${m(t-9.9)} ${m(i+.6)} Z`].join(" ")} />
    <path fill=${E(e.knob)} d=${x} />
    ${h>.2?f`<rect x=${m($)} y=${m(v)} width=${m(h)} height=${m(k-v-.3)} fill="#000"
          opacity="0.3" />`:w}
    <line x1=${m(t-7)} y1=${m(_+.15)} x2=${m(t+7)} y2=${m(_+.15)} stroke="#fff"
      stroke-width="0.3" opacity="0.25" />
    ${z?f`<g opacity=${m(s*.85)} fill="#f4f4f4">
          <rect x=${m(t-2.6*s-.45)} y=${m(i+2.75)} width="0.9" height="0.28" />
          <rect x=${m(t+2.6*s-.45)} y=${m(i+2.75)} width="0.9" height="0.28" />
          <rect x=${m(t+2.6*s-.14)} y=${m(i+2.44)} width="0.28" height="0.9" />
          ${o==="fan"?f`<circle cx=${m(t+l*1.2)} cy=${m(i+4)} r="0.7" fill="none" stroke="#f4f4f4"
                stroke-width="0.28" />`:f`<circle cx=${m(t+l*1.2)} cy=${m(i+4)} r="0.5" />`}
        </g>`:w}
  `}function Ql(e,t,n,o,r,i,a){if(r.light<=0)return f``;let s=m((.3+.6*r.light)*(a==="light"?.4:1));return f`
    <g opacity=${s} filter=${E(e.blurWide)}>
      ${n.map(l=>{let p=[[l-8,o-10],[l+8,o-10],[l+58,o+i],[l-58,o+i]];return f`<polygon points=${te(p)} fill=${E(t.lightCone)} />`})}
    </g>
  `}function Jl(e,t,n,o,r,i,a,s,l){if(a<=0)return f``;let p=2+Math.round(qe(a,0,4)),d=o-n,u=m(4.4-.8*a),h=`${e.uid}-vapor`,g=`${e.uid}-vapor-clip`,y=`${e.uid}-vapor-fade`,$=Array.from({length:p},(_,v)=>{let k=n+d*(.14+.72*(v+.5)/p)+(v%2?4:-4),x=v%2?6:-6,z=[`M ${m(k-x*.3)} ${m(i+42)}`,`C ${m(k+x)} ${m(i+31)} ${m(k-x)} ${m(i+17)}`,`${m(k+x*.2)} ${m(i+4)}`].join(" "),S=l?`transform: translateY(${v%3*9-6}px)`:`animation: ${h} ${u}s linear infinite; animation-delay: ${m(-u*v/p)}s`;return f`<path d=${z} fill="none" stroke=${E(y)} stroke-width="8" stroke-linecap="round" style=${S} />`}),b=s==="dark"?"#ffffff":"#9aa3ad";return f`
    ${l?w:f`<style>${`@keyframes ${h}{0%{transform:translateY(40px);opacity:0}35%{opacity:1}75%{opacity:.7}100%{transform:translateY(-8px);opacity:0}}`}</style>`}
    <linearGradient id=${y} gradientUnits="userSpaceOnUse" x1="0" y1=${m(i+4)} x2="0" y2=${m(i+42)}>
      <stop offset="0" stop-color=${b} stop-opacity="0" />
      <stop offset="0.3" stop-color=${b} stop-opacity="1" />
      <stop offset="0.6" stop-color=${b} stop-opacity="0.75" />
      <stop offset="1" stop-color=${b} stop-opacity="0" />
    </linearGradient>
    <clipPath id=${g}>
      <rect x=${m(n-30)} y=${m(r)} width=${m(d+60)} height=${m(i-r+120)} />
    </clipPath>
    <g clip-path=${E(g)}>
      <g opacity=${s==="dark"?.15:.2} filter=${E(t.vapor)}>${$}</g>
    </g>
  `}function ec(e,t,n,o,r=!0){let i="#ffeccc",a=`${e.uid}-halo-fall`,s=`${e.uid}-halo-clip`,l=o+Sn,p=l+Mt,d=Kl(t,n,l,r);return f`
    <linearGradient id=${a} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color=${i} stop-opacity="0.6" />
      <stop offset="1" stop-color=${i} stop-opacity="0" />
    </linearGradient>
    <clipPath id=${s}><polygon points=${te(d)} /></clipPath>
    <g clip-path=${E(s)}>
      <polygon points=${te(d)} fill=${i} opacity="0.22" />
      <g filter=${E(e.blur)}>
        <line x1=${t} y1=${l+.6} x2=${n} y2=${l+.6} stroke=${i} stroke-width="3" />
        <line x1=${t} y1=${p-1.2} x2=${n} y2=${p-1.2} stroke=${i} stroke-width="2.4" />
      </g>
      <line x1=${t} y1=${l+.3} x2=${n} y2=${l+.3} stroke="#fffaf2" stroke-width="0.7" />
    </g>
    <rect x=${m(t+eo)} y=${p} width=${m(n-t-eo*2)} height="16"
      fill=${E(a)} filter=${E(e.blur)} />
  `}function tc(e,t,n,o,r){let i=Math.min(150,n*.36),a=m((n-i)/2),s=m(o-r),l=m(o-r*.3);return f`
    <mask id=${t.fadeMask} maskUnits="userSpaceOnUse" x=${a-1} y=${s} width=${i+2} height=${r+1}>
      <rect x=${a-1} y=${s} width=${i+2} height=${r+1} fill=${E(t.fade)} />
    </mask>
    <g mask=${E(t.fadeMask)}>
      <g filter=${E(e.grain)}>
        <rect x=${a} y=${s} width=${m(i)} height=${r} fill=${E(e.metal)} />
      </g>
      <line x1=${a+.4} y1=${s} x2=${a+.4} y2=${o} stroke="#fff" stroke-width="0.8" opacity="0.45" />
      <line x1=${m(a+i-.4)} y1=${s} x2=${m(a+i-.4)} y2=${o} stroke="#000" stroke-width="0.8"
        opacity="0.2" />
      <line x1=${a+6} y1=${l} x2=${m(a+i-6)} y2=${l} stroke="#000" stroke-width="0.6"
        opacity="0.18" />
    </g>
    <line x1=${a} y1=${o-.4} x2=${m(a+i)} y2=${o-.4} stroke="#000" stroke-width="0.8" opacity="0.3" />
  `}var Il=Array.from({length:145},(e,t)=>t%8===7?.2:.62).join(" "),Fl="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1";function nc(e,t,n,o){return f`
    <filter id=${t.wood} x="-0.05" y="-0.05" width="1.1" height="1.1" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.9 0.004" numOctaves="2" seed="4" result="noise" />
      <feColorMatrix in="noise" type="matrix" values=${Fl} result="lines" />
      <feTurbulence type="fractalNoise" baseFrequency="0.022 0.0026" numOctaves="1" seed="7" result="slow" />
      <feColorMatrix in="slow" type="matrix" values=${Fl} result="field" />
      <feComponentTransfer in="field" result="rings">
        <feFuncR type="table" tableValues=${Il} />
        <feFuncG type="table" tableValues=${Il} />
      </feComponentTransfer>
      <feComposite in="rings" in2="lines" operator="arithmetic" k2="1" k3="0.5" k4="-0.37" result="figure" />
      <feColorMatrix in="figure" type="matrix" result="gray"
        values="0.6 0.4 0 0 0  0.6 0.4 0 0 0  0.6 0.4 0 0 0  0 0 0 0 1" />
      <feComponentTransfer in="gray" result="grain">
        <feFuncR type="linear" slope="0.1" intercept="0.455" />
        <feFuncG type="linear" slope="0.1" intercept="0.455" />
        <feFuncB type="linear" slope="0.1" intercept="0.455" />
      </feComponentTransfer>
      <feBlend in="grain" in2="SourceGraphic" mode="overlay" result="wood" />
      <feComposite in="wood" in2="SourceAlpha" operator="in" />
    </filter>
    <linearGradient id=${`${e.uid}-stain`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#4b4d4f" />
      <stop offset="0.5" stop-color="#5c5e60" />
      <stop offset="1" stop-color="#46484a" />
    </linearGradient>
    <rect x="0" y="0" width=${n} height=${o} fill=${E(`${e.uid}-stain`)}
      filter=${E(t.wood)} />
    <rect x="0" y="0" width=${n} height=${o} fill=${E(e.sheen)} />
    <line x1="0" y1="0.4" x2=${n} y2="0.4" stroke="#fff" stroke-width="0.6" opacity="0.2" />
    <rect x="0" y=${o-2} width=${n} height="2" fill="#000" opacity="0.3" />
  `}var oc=90,Di=150,rc=58,br=10,ic=e=>{let t=e.spec;if(t.family!=="hood")return null;let n=t.form==="island"||t.form==="insert"?t.form:"wall",o=qe(t.width??36,30,66)*10,r=e.state.hood,i={light:r?.light?qe(r.brightness/100,.05,1):0,lightColor:Ul(r?.kelvin??null),halo:r?.halo??!1,fan:r?.fan??0},a=yr(e.uid),s=jl(e.uid),l=n==="insert"?8:0,p=n==="insert"?Di:on,d=n==="insert"?Di:on+Qn+Jn,u=d+Sn+Mt,h=n==="island"?-oc:0,g=Ei(o-l*2).map(_=>_+l),y=[-br,h-br/2,o+br*2,m(u-h+br/2+rc)].join(" "),$=(e.theme==="dark"?.5:.18)*(1-.8*i.light),b=vf(n,i,e.state.available);return A`<svg viewBox=${y} role="img" aria-label=${b}>
    ${f`
      <defs>
        ${$r(a,{finish:"stainless",knobs:e.appearance.knobs,x:0,y:h,width:o,height:u-h,light:gr,parts:{knob:!0,wideBlur:i.light>0,offline:!e.state.available}})}
        ${Wl(s,i,e.theme)}
        <radialGradient id=${`${a.uid}-wall-shadow`}>
          <stop offset="0" stop-color="#000" stop-opacity=${$} />
          <stop offset="1" stop-color="#000" stop-opacity="0" />
        </radialGradient>
      </defs>
      ${n==="island"?w:f`<ellipse cx=${o/2} cy=${u+6} rx=${o*.52} ry="12"
            fill=${E(`${a.uid}-wall-shadow`)} />`}
      <g filter=${e.state.available?w:E(a.offline)}>
        ${Ql(a,s,g,u,i,rc,e.theme)}
        ${n==="island"?tc(a,s,o,0,oc):w}
        ${n==="insert"?nc(a,s,o,Di):w}
        ${n==="insert"?w:f`
            <g filter=${E(a.grain)}>${Zl(a,s,o,0)}${Yl(a,0,o,p)}</g>
            ${ql(o,0)}`}
        ${Xl(a,s,l,o-l,p,i,n!=="insert")}
        ${i.halo?ec(a,l,o-l,d,n!=="insert"):w}
        ${e.state.available?Jl(a,s,l,o-l,d+Sn,u,i.fan,e.theme,e.reducedMotion??!1):w}
      </g>
    `}
  </svg>`};function vf(e,t,n){let o=[e==="island"?"Island hood":e==="insert"?"Hood liner":"Wall hood"];return t.fan>0&&o.push(`fan speed ${t.fan}`),t.light>0&&o.push(`light ${Math.round(t.light*100)}%`),t.halo&&o.push("halo on"),n||o.push("offline"),o.join(", ")}function to(e,t,n,o,r,i,a,s=.5){return f`
    <rect x=${t} y=${n} width=${o} height=${r} fill=${e.url(i)} />
    <rect x=${t} y=${n} width=${o} height=${r} fill=${e.url(a)} />
    <rect x=${t} y=${n} width=${o} height=${r} fill=${e.url("grain")} />
    ${s?f`<line x1=${t} y1=${n+.35} x2=${t+o} y2=${n+.35} stroke="#fff" stroke-opacity=${s} stroke-width="0.7" />`:w}
  `}function vr(e,t,n,o,r){let i=o-n,a=n+i*.38,s=Math.min(.85,i*.19);return f`
    <rect x="0" y=${n} width=${t} height=${i} fill=${e.url("ss-dim")} />
    <rect x="0" y=${n} width=${t} height=${i} fill=${e.url("reveal")} />
    ${r.map(l=>f`<g fill="none" stroke="#2a2b2c" stroke-width="0.3">
        <circle cx=${l} cy=${a} r="0.65" />
        <path d=${`M${l-s} ${a+1.1}l${2*s} ${2*s}m0 ${-2*s}l${-2*s} ${2*s}`} />
      </g>`)}
  `}function ac(e,t,n){let o=e.width,r=e.floorY,i=r-e.levels.feet,a=kl(n),s=r-3.5;return f`
    <ellipse cx=${o/2} cy=${r+.6} rx=${o/2+5} ry="4.8" fill="#000" opacity=${a} filter=${t.url("floor")} />
    <rect x="13" y=${i} width=${o-26} height=${s-i} fill=${t.url("ss-toe")} />
    <rect x="13" y=${i} width=${o-26} height=${s-i} fill=${t.url("lower")} />
    <rect x="13" y=${i} width=${o-26} height=${s-i} fill=${t.url("toe-shade")} />
    ${e.doors.map(l=>{let p=(l.x0+l.x1)/2,d=(l.x1-l.x0)*.17;return f`
        <rect x=${p-d} y=${i+.6} width=${2*d} height="1.2" rx="0.6" fill="#1d1e20" opacity="0.85" />
        <line x1=${p-d+.6} y1=${i+2.1} x2=${p+d-.6} y2=${i+2.1} stroke="#fff"
          stroke-opacity="0.35" stroke-width="0.4" />
      `})}
    ${e.feet.map(l=>{let d=l.taper==="right"?`${l.x0},${i} ${l.x1},${i} ${l.x1-8.5},${r} ${l.x0},${r}`:l.taper==="left"?`${l.x0},${i} ${l.x1},${i} ${l.x1},${r} ${l.x0+8.5},${r}`:`${l.x0},${i} ${l.x1},${i} ${l.x1},${r} ${l.x0},${r}`,u=l.x0+(l.taper==="left"?8.5:0)+.3,h=l.taper===null?.55:1;return f`
        <ellipse cx=${(l.x0+l.x1)/2} cy=${r+.2} rx=${(l.x1-l.x0)/2+3} ry="1.6" fill="#000"
          opacity=${Math.min(.85,a*1.5)} filter=${t.url("soft")} />
        <polygon points=${d} fill=${t.url("ss")} />
        <polygon points=${d} fill=${t.url("foot")} opacity=${h} />
        <polygon points=${d} fill=${t.url("grain")} />
        <line x1=${l.x0+.3} y1=${i} x2=${u} y2=${r} stroke="#fff" stroke-opacity="0.35" stroke-width="0.5" />
      `})}
  `}function sc(e,t){let n=e.width,o=d=>e.floorY-d,{feet:r,plinth:i,drawer:a,doorBottom:s}=e.levels,l=e.doors.flatMap(d=>[d.x0+9.5,(d.x0+d.x1)/2,d.x1-9.5]),{doorTop:p}=e.levels;return f`
    <rect x="0" y=${o(p)} width=${n} height=${p-s} fill="#4b4c4e" />
    ${e.doors.slice(1).map((d,u)=>{let h=(e.doors[u].x1+d.x0)/2;return f`<line x1=${h} y1=${o(p)} x2=${h} y2=${o(s)} stroke="#b9bbbd" stroke-width="1.3" />`})}
    ${to(t,0,o(i),n,i-r,"ss","shade-plinth",.55)}
    ${a===null?f`<rect x="0" y=${o(i)} width=${n} height=${i-r} fill=${t.url("lower")} />`:f`<rect x="0" y=${o(i)} width=${n} height=${i-r} fill="#fff" opacity="0.35" />`}
    <line x1="0" y1=${o(r)-.35} x2=${n} y2=${o(r)-.35} stroke="#fff" stroke-opacity="0.55" stroke-width="0.7" />
    <line x1="0" y1=${o(r)+.3} x2=${n} y2=${o(r)+.3} stroke="#000" stroke-opacity="0.25" stroke-width="0.6" />
    ${a===null?vr(t,n,o(s),o(i),l):f`
          ${to(t,0,o(a),n,a-i,"ss","shade-door",.6)}
          <rect x="0" y=${o(a)} width=${n} height=${a-i} fill=${t.url("lower")} />
          <line x1="0" y1=${o(i)-.3} x2=${n} y2=${o(i)-.3} stroke="#000" stroke-opacity="0.4" stroke-width="0.7" />
          ${vr(t,n,o(s),o(a),l)}
        `}
  `}function lc(e,t){let n=e.width,o=l=>e.floorY-l,{doorTop:r,bandBottom:i,railBottom:a,rim:s}=e.levels;return a===null?f`
      ${vr(t,n,o(i),o(r),[])}
      ${to(t,0,o(s),n,s-i,"ss-rail","shade-rail",0)}
      <line x1="0" y1=${o(i)-.35} x2=${n} y2=${o(i)-.35} stroke="#000" stroke-opacity="0.3" stroke-width="0.7" />
    `:f`
    ${vr(t,n,o(i),o(r),[])}
    ${to(t,0,o(a),n,a-i,"ss-panel","shade-panel",0)}
    <line x1="0" y1=${o(i)-.35} x2=${n} y2=${o(i)-.35} stroke="#fff" stroke-opacity="0.3" stroke-width="0.6" />
    ${to(t,0,o(s),n,s-a,"ss-rail","shade-rail",0)}
    <line x1="0" y1=${o(a)+.3} x2=${n} y2=${o(a)+.3} stroke="#2e2f31" stroke-width="0.6" />
    <line x1="0" y1=${o(a)+1} x2=${n} y2=${o(a)+1} stroke="#000" stroke-opacity="0.18" stroke-width="1.2" />
  `}var wf={30:298.75,36:358.75,48:478.75,60:598.75},kf={feet:20,plinth:42,drawer:null,doorBottom:50,doorTop:272,bandBottom:279,railBottom:330,rim:350},xf={feet:24,plinth:44.5,drawer:92.5,doorBottom:97,doorTop:319,bandBottom:327,railBottom:null,rim:350},B={grateFront:26,grateBack:252,grateTop:358,grateBottom:354,wallBottom:351.6,burnerFront:92,burnerRear:187,trimFront:254,trimBack:266,trimTop:362.5,inductionTrim:49,glassBack:246,glassTop:351},hc=302,zf={griddle:1,charbroiler:1,double_griddle:2,french_top:2},Sf={griddle:1,charbroiler:1,double_griddle:2,french_top:1},cc=2.3,pc=47,dc=3,no=40.4,Pi=51.4,uc=16;function Tt(e){return 2160/(2160+e)}function ye(e,t,n,o){let r=Tt(o);return[e.cx+(t-e.cx)*r,e.floorY-(500+(n-500)*r)]}function Rf(e){if(e.fuel==="induction")return[];let t=Math.ceil(Math.max(0,e.burners)/2),n=a=>{let s=Math.min(2,e.burners-a*2);return{kind:"burners",burners:s,units:1,knobs:s}},o=e.surfaces.map(a=>({kind:a,burners:0,units:zf[a]??1,knobs:Sf[a]??1})),r=[],i=o.length?Math.max(0,t-1):t;for(let a=0;a<i;a++)r.push(n(a));return r.push(...o),o.length&&t>0&&r.push(n(t-1)),r}function Af(e,t){return e.width&&e.width>=24?e.width:e.fuel==="induction"?e.burners>=5?36:30:e.ovens.length>=2?t>=5?60:48:t>=3?36:30}function Mf(e,t,n){if(!e.length)return[];let o=[...e],r=t<=30&&e.length===2&&e.every(d=>d.kind==="burners");r&&o.splice(1,0,{kind:"filler",burners:0,units:0,knobs:0});let i=t<=36?18:19.5,a=o.reduce((d,u)=>d+u.units,0)||1,s=(n-2*i-(o.length-1)*cc-(r?pc:0))/a,l=i,p=!0;return o.map(d=>{let u=d.kind==="filler"?pc:s*d.units,h={kind:d.kind,x0:l,x1:l+u,burners:d.burners,knobs:d.knobs,small:d.kind==="burners"&&p&&d.burners===2};return d.kind==="burners"&&(p=!1),l+=u+cc,h})}var fc={left:0,upper:1,single:1,lower:1,right:2};function Tf(e,t,n){let o=e.ovens.length?[...e.ovens].sort((p,d)=>fc[p.position]-fc[d.position]):[{prefix:"cav",position:"single",width:null}],r=p=>o.length===1?t:o.length===2&&t<54?p===0?18:t-18:t/o.length,i=o.map((p,d)=>p.width&&p.width>0?p.width:r(d)),a=i.reduce((p,d)=>p+d,0),s=n-dc*(o.length-1),l=0;return o.map((p,d)=>{let u=s*i[d]/a,h={x0:l,x1:l+u,slot:p};return l+=u+dc,h})}function Cf(e,t){let n=[{x0:13,x1:55.5,taper:"right"},{x0:t-55.5,x1:t-13,taper:"left"}];for(let o=1;o<e.length;o++){let r=(e[o-1].x1+e[o].x0)/2;n.push({x0:r-20,x1:r+20,taper:null})}return n}function Gf(e,t,n,o){if(!e.length)return{knobs:[],panelX:null};let r=e.flatMap(z=>Array.from({length:z.knobs},(S,R)=>({kind:z.kind==="burners"?"burner":"surface",center:z.x0+(z.x1-z.x0)*(R+.5)/z.knobs}))),i=n/2;if(t.length>=2){let z=o?Pi:no/2,S=r.filter(V=>V.center<i-.5),R=r.filter(V=>V.center>=i-.5),M=V=>{if(!V)return[];let Q=i-z,N=no,F=40,j=Q-N;return F+(V-1)*N>j&&(F=j-(V-1)*N),F<24&&(F=24,N=(Q-24)/V),Array.from({length:V},(W,ee)=>F+ee*N)},G=M(S.length),T=M(R.length).map(V=>n-V).reverse();return{knobs:[...S.map((V,Q)=>({x:G[Q],kind:V.kind})),{x:i-z,kind:"oven",oven:t[0].slot.prefix},{x:i+z,kind:"oven",oven:t[t.length-1].slot.prefix},...R.map((V,Q)=>({x:T[Q],kind:V.kind}))],panelX:o?i:null}}let a=e[e.length-1],s=a.kind==="burners"?a.knobs:0,l=r.slice(0,r.length-s),p=r.slice(r.length-s),d=e.some(z=>z.kind!=="burners"&&z.kind!=="filler"),u=[],h=0;l.forEach((z,S)=>{S&&(h+=no),u.push({x:h,kind:z.kind})});let g=null;o?(l.length&&(h+=d?65.2:Pi),g=h,h+=Pi):l.length&&(h+=no),u.push({x:h,kind:"oven",oven:t[0]?.slot.prefix??"cav"}),p.forEach((z,S)=>{h+=S===0&&d&&o?54:no,u.push({x:h,kind:z.kind})});let y=u.map(z=>z.x).concat(g===null?[]:[g]),$=Math.min(...y),b=Math.max(...y),_=($+b)/2,v=b-$,k=v>n-54?(n-54)/v:1,x=z=>i+(z-_)*k;return{knobs:u.map(z=>({...z,x:x(z.x)})),panelX:g===null?null:x(g)}}function mc(e){let t=e.fuel==="induction",n=Rf(e),o=n.reduce((y,$)=>y+$.units,0),r=Af(e,o),i=wf[r]??r*10-1.25,a=e.fuel==="dual_fuel",s=Mf(n,r,i),l=Tf(e,r,i),{knobs:p,panelX:d}=Gf(s,l,i,a),u=t?xf:kf,h=t?500+(B.glassTop-500)*Tt(B.glassBack):500+(B.trimTop-500)*Tt(B.trimBack),g=Math.ceil(h+6);return{nominal:r,width:i,cx:i/2,induction:t,transitional:e.style==="transitional"||t&&e.style!=="professional",touchscreen:a,levels:u,modules:s,knobs:p,panelX:d,doors:l,feet:Cf(l,i),floorY:g,viewBox:{x:-uc,y:0,w:i+2*uc,h:g+12}}}var _t="'Helvetica Neue', Helvetica, Arial, sans-serif",ne=e=>Math.round(e*100)/100,Je=11.6,rn=13.4;function Ef(e,t,n,o,r,i,a){let s=$t[o]??$t.red,l=!!i?.on,p=Je*.58,d=Je*.44,u=k=>Math.sqrt(Je*Je-k*k)-.35,h=u(p),g=u(d),y=1.7,$=Math.sqrt(Je*Je-(y/2)**2),b=(i?.temp??"").replace(/[^0-9]/g,"")||"- - -",_=(k,x,z)=>{let S=O=>[t+k*Math.cos(O*Math.PI/180),n+k*Math.sin(O*Math.PI/180)],[R,M]=S(x),[G,T]=S(z);return`M${ne(R)} ${ne(M)}A${k} ${k} 0 0 1 ${ne(G)} ${ne(T)}`},v=t+d;return f`
    <g>
      <circle cx=${t+.2} cy=${n+.6} r=${rn+.2} fill="#000" opacity="0.06" filter=${e.url("soft")} />
      ${r==="oven"?f`<circle cx=${t} cy=${n} r=${rn+.8} fill="none" stroke="#fff4df" stroke-width="2"
              filter=${e.url("halo")} style=${Le(l?.95:0,a)} />`:w}
      <circle cx=${t} cy=${n} r=${rn} fill="#6f7173" />
      <circle cx=${t} cy=${n} r=${rn-.4} fill=${e.url("bezel")} />
      <circle cx=${t} cy=${n} r=${rn-.95} fill=${e.url("bezel-in")} />
      <path d=${_(rn-.65,250,290)} fill="none" stroke="#fff" stroke-opacity="0.5" stroke-width="0.4" stroke-linecap="round" />
      <circle cx=${t} cy=${n} r=${Je+.45} fill="#1b1617" />
      <circle cx=${t} cy=${n} r=${Je} fill=${e.url("knob")} />
      <path d=${`M${ne(t-$)} ${ne(n+y/2)}A${Je} ${Je} 0 1 1 ${ne(t+$)} ${ne(n+y/2)}A${Je} ${Je} 0 0 0 ${ne(t-$)} ${ne(n+y/2)}Z`}
        fill=${s.rim} opacity=${s.rimOpacity} />
      <path d=${`M${ne(t-p)} ${ne(n-h)}Q${ne(t-p-.9)} ${n} ${ne(t-p)} ${ne(n+h)}`}
        fill="none" stroke=${s.dark} stroke-width="0.6" stroke-opacity="0.85" />
      <path d=${`M${ne(v-.4)} ${ne(n-g)}Q${ne(v+.5)} ${n} ${ne(v-.4)} ${ne(n+g)}L${ne(v+1.3)} ${ne(n+g-.5)}Q${ne(v+2.2)} ${n} ${ne(v+1.3)} ${ne(n-g+.5)}Z`}
        fill=${s.edge} opacity="0.85" />
      <path d=${`M${ne(v+1.7)} ${ne(n-g+1)}Q${ne(v+2.6)} ${n} ${ne(v+1.7)} ${ne(n+g-1)}`}
        fill="none" stroke=${s.light} stroke-width="0.7" stroke-opacity="0.45" />
      <ellipse cx=${t-4} cy=${n-5.6} rx="4.4" ry="2.1" transform=${`rotate(-30 ${t-4} ${n-5.6})`}
        fill="#fff" opacity=${s.sheen} filter=${e.url("halo")} />
      <circle cx=${t} cy=${n} r=${rn} fill=${e.url("falloff-knob")} />
      ${r==="oven"?f`<g style=${Le(l?1:0,a)}>
              <rect x=${t-5.6} y=${n-8.6} width="11.2" height="4.6" rx="1" fill="#150607" opacity="0.92" />
              <text x=${t} y=${n-4.95} text-anchor="middle" font-family=${_t} font-size="3.6" font-weight="700"
                letter-spacing="0.2" fill="#ff5a3c" filter=${e.url("halo")}>${b}</text>
              <text x=${t} y=${n-4.95} text-anchor="middle" font-family=${_t} font-size="3.6" font-weight="700"
                letter-spacing="0.2" fill="#ff8a66">${b}</text>
            </g>`:w}
      <circle cx=${t} cy=${n-17} r="0.65" fill="#2d2e2f" />
      ${r==="oven"?w:f`<rect x=${t+12.3} y=${n+14.1} width="2.1" height="3.6" rx="0.45" fill="none" stroke="#5c5f62" stroke-width="0.32" />
              <circle cx=${t+13.35} cy=${n+15.05} r="0.42" fill="none" stroke="#55585b" stroke-width="0.25" />
              <circle cx=${t+13.35} cy=${n+16.75} r="0.45" fill="#484b4e" />`}
    </g>
  `}var Df=(e,t)=>{let n=e.toUpperCase();return n.length>t?`${n.slice(0,t-1)}\u2026`:n};function Pf(e,t,n,o,r,i){let a=t.state;if(!(!!a&&(a.on||a.self_clean)))return f`
      <text x=${n} y=${r+i*.56} text-anchor="middle" font-family=${_t} font-size="3" fill="#6f777f"
        letter-spacing="0.3">OFF</text>
      ${a?.remote_ready?gc(n,r+i*.3,"#9fb3c8"):w}
    `;let l=!a.self_clean&&!a.preheated&&a.progress!==null,p=a.self_clean?"SELF CLEAN":a.preheated?"PREHEATED":l?`PREHEATING ${Math.round((a.progress??0)*100)}%`:"HEATING",d=[];a.probe&&d.push(Lf(0,0)),a.remote_ready&&d.push(gc(0,0,"#ffffff")),a.self_clean&&d.push(Of(0,0));let u=4.2,h=n-(d.length-1)*u/2,g=Math.min(o*.62,20);return f`
    <rect x=${n-o/2} y=${r+i*.31} width=${o} height=${i*.36} fill=${e.url("band")} opacity="0.62" />
    ${d.map((y,$)=>f`<g transform=${`translate(${ne(h+$*u)} ${ne(r+i*.24)})`}>${y}</g>`)}
    <text x=${n} y=${r+i*.43} text-anchor="middle" font-family=${_t} font-size="2.9" font-weight="600"
      letter-spacing="0.25" fill="#ffffff">${Df(a.self_clean?"Clean":a.mode??"",12)}</text>
    <text x=${n} y=${r+i*.63} text-anchor="middle" font-family=${_t} font-size="5.4" font-weight="300"
      fill="#ffffff">${a.temp??""}</text>
    <text x=${n} y=${r+i*.75} text-anchor="middle" font-family=${_t} font-size="1.85" letter-spacing="0.2"
      fill=${a.preheated?"#ff6b6b":"#c9ced3"}>${p}</text>
    ${l?f`<rect x=${n-g/2} y=${r+i*.79} width=${g} height="0.7" rx="0.35" fill="#30353b" />
            <rect x=${n-g/2} y=${r+i*.79} width=${ne(g*Math.min(1,Math.max(0,a.progress??0)))}
              height="0.7" rx="0.35" fill="#e3343d" />`:w}
  `}function Lf(e,t){return f`<g transform=${`translate(${e} ${t})`}>
    <line x1="-1.2" y1="1.2" x2="1" y2="-1" stroke="#ffffff" stroke-width="0.45" stroke-linecap="round" />
    <circle cx="-1.3" cy="1.3" r="0.6" fill="#ffffff" />
  </g>`}function gc(e,t,n){return f`<g transform=${`translate(${e} ${t})`} fill="none" stroke=${n} stroke-width="0.35" stroke-linecap="round">
    <path d="M-1.9 -0.4A2.7 2.7 0 0 1 1.9 -0.4" />
    <path d="M-1.15 0.35A1.6 1.6 0 0 1 1.15 0.35" />
    <circle cx="0" cy="1.1" r="0.35" fill=${n} stroke="none" />
  </g>`}function Of(e,t){return f`<g transform=${`translate(${e} ${t})`}>
    <path d="M-0.8 -0.2V-0.9A0.8 0.8 0 0 1 0.8 -0.9V-0.2" fill="none" stroke="#ffffff" stroke-width="0.35" />
    <rect x="-1.2" y="-0.3" width="2.4" height="1.8" rx="0.3" fill="#ffffff" />
  </g>`}function Vf(e,t,n,o,r,i,a,s){let l=t.map(h=>({slot:h,state:n[h.slot.prefix]??null})),p=a/l.length,d=l.length>1?["TIMER 1","LIGHT","LIGHT","TIMER 2"]:["TIMER 1","LIGHT","TIMER 2"],u=h=>!!(l.length>1?l[h-1]:l[0])?.state?.light;return f`
    <text x=${r+a*.07} y=${i+s*.15} font-family=${_t} font-size="1.9" letter-spacing="0.2" fill="#8c949c">LOCK</text>
    <text x=${r+a*.93} y=${i+s*.15} text-anchor="end" font-family=${_t} font-size="1.9" letter-spacing="0.2"
      fill="#8c949c">SETTINGS</text>
    ${o?f`<circle cx=${r+a/2-5.2} cy=${i+s*.13-.55} r="1.05" fill="none" stroke="#ffffff" stroke-width="0.32" />
            <path d=${`M${r+a/2-5.2} ${i+s*.13-1.2}V${i+s*.13-.55}H${r+a/2-4.7}`}
              fill="none" stroke="#ffffff" stroke-width="0.28" />
            <text x=${r+a/2+.8} y=${i+s*.15} text-anchor="middle" font-family=${_t} font-size="2.6"
              font-weight="600" fill="#ffffff">${o}</text>`:w}
    ${l.map((h,g)=>Pf(e,h,r+p*(g+.5),p*.92,i,s))}
    ${d.map((h,g)=>{let y=r+a*(g+.5)/d.length,$=g===0&&!!o,b=$||h==="LIGHT"&&u(g);return f`
        <text x=${y} y=${i+s*.93} text-anchor="middle" font-family=${_t} font-size="1.8" letter-spacing="0.15"
          fill=${b?"#ffffff":"#8c949c"}>${$?o:h}</text>
        ${$?f`<rect x=${y-3.2} y=${i+s*.95} width="6.4" height="0.45" fill="#e3343d" />`:w}
      `})}
  `}function Li(e,t){return t?!0:Object.values(e).some(n=>!!n&&(n.on||n.self_clean||n.probe||n.remote_ready))}function Hf(e,t,n,o,r,i,a){let p=n-29.5,d=o-38.5/2,u=n+59/2,h=o+38.5/2,g=2.6,y=p+g,$=d+g,b=u-g,_=h-g,v=f`
    <path d=${`M${p} ${d}H${u}L${b} ${$}H${y}Z`} fill="#b4b5b6" />
    <path d=${`M${p} ${d}L${y} ${$}V${_}L${p} ${h}Z`} fill="#7e7f80" />
    <path d=${`M${u} ${d}V${h}L${b} ${_}V${$}Z`} fill="#87888a" />
    <path d=${`M${p} ${h}H${u}L${b} ${_}H${y}Z`} fill="#cfd0d1" />
    <rect x=${p} y=${d} width=${59} height=${38.5} fill="none" stroke="#f2f3f4" stroke-opacity="0.8" stroke-width="0.4" />
  `;if(!r)return f`
      ${v}
      <rect x=${y} y=${$} width=${b-y} height=${_-$} fill="#1c1d1e" />
      <rect x=${y+.8} y=${$+.8} width=${b-y-1.6} height=${_-$-1.6} fill=${t.url("ss-cover")} />
      <rect x=${y+.8} y=${$+.8} width=${b-y-1.6} height=${_-$-1.6} fill=${t.url("shade-door")} />
      <rect x=${y+.8} y=${$+.8} width=${b-y-1.6} height=${_-$-1.6} fill=${t.url("grain")} opacity="0.6" />
      <path transform=${`translate(${n} ${$+5.6}) scale(0.42)`} fill="#888b8e" opacity="0.85"
        d="M-0.9 -4.6a0.9 0.9 0 0 1 1.8 0V-0.7l2.3 0.5a1 1 0 0 1 0.8 1.1l-0.5 3.3a1.2 1.2 0 0 1-1.2 1H-1.1a1.2 1.2 0 0 1-1.1-0.7l-1.7-3.1a0.8 0.8 0 0 1 1.2-1l0.8 0.8Z" />
    `;let k=y+1.4,x=b-1.4,z=$+1.6,S=_+2.6,R=`M${k} ${z}H${x}L${x+1.8} ${S}H${k-1.8}Z`,M=t.id("screen-clip");return f`
    ${v}
    <rect x=${y} y=${$} width=${b-y} height=${_-$} fill="#08090a" />
    <ellipse cx=${n} cy=${S+2.6} rx=${(x-k)/2+2} ry="2.2" fill="#000" opacity="0.35" filter=${t.url("soft")} />
    <path d=${`M${k-1.8} ${S}H${x+1.8}L${x+1.6} ${S+1.2}H${k-1.6}Z`} fill="#c3c5c7" />
    <clipPath id=${M}><path d=${R} /></clipPath>
    <path d=${R} fill=${t.url("screen")} />
    <g clip-path=${`url(#${M})`}>
      ${Vf(t,e.doors,i,a,k,z,x-k,S-z)}
      <path d=${R} fill=${t.url("sheen")} />
    </g>
    <path d=${R} fill="none" stroke="#3a3d41" stroke-width="0.35" />
  `}function yc(e,t,n,o,r,i){let a=e.floorY-hc;return f`
    ${e.panelX===null?w:Hf(e,t,e.panelX,a,Li(o,r),o,r)}
    ${e.knobs.map(s=>Ef(t,s.x,a,n,s.kind,s.oven?o[s.oven]??null:null,i))}
  `}var I=e=>Math.round(e*100)/100;function Re(e,t,n,o){let[r,i]=ye(e,t,n,o);return`${I(r)} ${I(i)}`}function Ft(e,t,n){return`M${t.map(([o,r])=>Re(e,o,n,r)).join("L")}Z`}function fe(e,t,n,o){return[[e,n],[t,n],[t,o],[e,o]]}function Ff(e,t,n){let o=t[0]-e[0],r=t[1]-e[1],i=Math.hypot(o,r)||1,a=-r/i*(n/2),s=o/i*(n/2);return[[e[0]+a,e[1]+s],[t[0]+a,t[1]+s],[t[0]-a,t[1]-s],[e[0]-a,e[1]-s]]}function Nf(e,t,n){let o="",r="",i="";for(let{plan:a,bottom:s}of t){let p=a.reduce((d,[u,h],g)=>{let[y,$]=a[(g+1)%a.length];return d+u*$-y*h},0)<0?[...a].reverse():a;r+=Ft(e,p,n),p.forEach(([d,u],h)=>{let[g,y]=p[(h+1)%p.length],$=y-u,b=-(g-d),_=e.cx-(d+g)/2,v=-2160-(u+y)/2;$*_+b*v<=0||(o+=`M${Re(e,d,s,u)}L${Re(e,g,s,y)}L${Re(e,g,n,y)}L${Re(e,d,n,u)}Z`,Math.abs(b)>Math.abs($)*.5&&(i+=`M${Re(e,d,n,u)}L${Re(e,g,n,y)}`))})}return{sides:o,tops:r,edges:i}}var se=5,Ge=4.4,oo=21,Bf=B.grateBottom,jf=B.grateTop-3.2,Vi=e=>e.map(t=>({plan:t,bottom:Bf})),Hi=e=>e.map(t=>({plan:t,bottom:jf})),Ii=(e,t,n)=>({plan:fe(e,t,n,n+se),bottom:B.wallBottom});function Uf(e){let t=e.x0+.6,n=e.x1-.6,o=B.grateFront,r=B.grateBack,i=(t+n)/2,a=(B.burnerFront+B.burnerRear)/2,s=[Ii(t,n,o),...Vi([fe(t,n,r-se,r),fe(t,t+se,o,r),fe(n-se,n,o,r)])],l=[],p=e.burners===1?[a]:[B.burnerFront,B.burnerRear];e.burners!==1&&l.push(fe(t,n,a-Ge/2,a+Ge/2));let d=[o+se,...p.flatMap(u=>[u-oo,u+oo]),r-se];for(let u=0;u<d.length;u+=2){let h=d[u],g=d[u+1];g-h>2&&l.push(fe(i-Ge/2,i+Ge/2,h,g))}for(let u of p){l.push(fe(t+se,i-oo,u-Ge/2,u+Ge/2)),l.push(fe(i+oo,n-se,u-Ge/2,u+Ge/2));let h=e.burners===1||u===p[0]?o+se:a+Ge/2,g=e.burners===1?r-se:u===p[0]?a-Ge/2:r-se;for(let y of[[t+se,h],[n-se,h],[t+se,g],[n-se,g]]){let $=i-y[0],b=u-y[1],_=Math.hypot($,b),v=Math.max(.15,(_-oo*1.3)/_);l.push(Ff(y,[y[0]+$*v,y[1]+b*v],Ge))}}return[...s,...Hi(l)]}function Kf(e){let t=e.x0+.6,n=e.x1-.6,o=B.grateFront,r=B.grateBack,i=(n-t)/3;return[Ii(t,n,o),...Vi([fe(t,n,r-se,r),fe(t,t+se,o,r),fe(n-se,n,o,r)]),...Hi([fe(t+i-Ge/2,t+i+Ge/2,o,r),fe(n-i-Ge/2,n-i+Ge/2,o,r),...[.22,.5,.78].map(a=>o+(r-o)*a).map(a=>fe(t,n,a-Ge/2,a+Ge/2))])]}function Wf(e){let t=e.x0+.6,n=e.x1-.6,o=B.grateFront,r=B.grateBack,i=[Ii(t,n,o),...Vi([fe(t,n,r-se,r),fe(t,t+se,o,r),fe(n-se,n,o,r)])],a=[],s=Math.max(6,Math.round((n-t-2*se)/8.6)),l=(n-t-2*se)/s;for(let p=0;p<s-1;p++){let d=t+se+l*(p+1);a.push(fe(d-1.9,d+1.9,o+se,r-se))}return[...i,...Hi(a)]}function Oi(e,t,n){let o=Nf(e,n,B.grateTop);return f`
    <path d=${o.sides} fill=${t.url("iron")} />
    <path d=${o.tops} fill="#3b3b3b" />
    <path d=${o.edges} fill="none" stroke="#5e5e5e" stroke-opacity="0.45" stroke-width="0.35" stroke-linecap="round" />
  `}function wr(e,t,n,o,r){let[i]=ye(e,t,n,o),[,a]=ye(e,t,n,o-r),[,s]=ye(e,t,n,o+r);return{cx:i,cy:(a+s)/2,rx:r*Tt(o),ry:Math.max(.2,(a-s)/2)}}function Zf(e,t,n){let o=(n.x0+n.x1)/2,[,r]=ye(e,o,351.4,B.grateFront),i=[o-7.5,o+7.5].map(s=>ye(e,s,351.4,B.grateFront)[0]),a=n.kind!=="burners"?[]:n.burners===1?[{d:(B.burnerFront+B.burnerRear)/2,r:21.5}]:[{d:B.burnerFront,r:21.5},{d:B.burnerRear,r:n.small?16:21.5}];return f`
    ${i.map(s=>f`<line x1=${I(s-5.5)} y1=${I(r)} x2=${I(s+5.5)} y2=${I(r)} stroke="#fff" stroke-opacity="0.4"
        stroke-width="0.9" stroke-linecap="round" filter=${t.url("soft")} />`)}
    ${a.map(({d:s,r:l})=>{let p=wr(e,o,354,s,l),d=wr(e,o,355.6,s,l-2.4);return f`
        <ellipse cx=${I(p.cx)} cy=${I(p.cy)} rx=${I(p.rx)} ry=${I(p.ry+.5)} fill="#3e3e3e" />
        <ellipse cx=${I(p.cx)} cy=${I(p.cy-.25)} rx=${I(p.rx-.9)} ry=${I(p.ry+.2)} fill="#2c2c2c" />
        <ellipse cx=${I(d.cx)} cy=${I(d.cy)} rx=${I(d.rx)} ry=${I(d.ry+.4)} fill="#1f1f1f" />
      `})}
  `}function $c(e,t,n,o,r){let i=t.x0+1,a=t.x1-1,s=B.grateFront+2,l=B.grateBack-1,p=e.levels.rim+.5,d=`M${Re(e,i,p,s)}L${Re(e,a,p,s)}L${Re(e,a,n,s)}L${Re(e,i,n,s)}Z`,[u,h]=ye(e,i,n,s),[g]=ye(e,a,n,s);return f`
    <path d=${Ft(e,fe(i,a,s,l),n)} fill=${o} />
    ${r}
    <path d=${d} fill="#2b2c2d" />
    <line x1=${I(u)} y1=${I(h+.2)} x2=${I(g)} y2=${I(h+.2)} stroke="#c9cbcd" stroke-width="0.5" stroke-opacity="0.8" />
  `}function qf(e,t,n){let o=(n.x0+n.x1)/2;switch(n.kind){case"griddle":case"double_griddle":return $c(e,n,358.5,t.url("steel"),null);case"french_top":{let r=(B.grateFront+B.grateBack)/2,i=[26,50,76].map(s=>wr(e,o,358,r,s)),a=wr(e,o,358,r,1.6);return $c(e,n,358,t.url("ftop"),f`${i.map(s=>f`<ellipse cx=${I(s.cx)} cy=${I(s.cy)} rx=${I(s.rx)} ry=${I(s.ry)} fill="none" stroke="#4a4c4f" stroke-opacity="0.32" stroke-width="0.45" />
              <ellipse cx=${I(s.cx)} cy=${I(s.cy+.4)} rx=${I(s.rx)} ry=${I(s.ry)} fill="none" stroke="#c8cacc" stroke-opacity="0.22" stroke-width="0.35" />`)}<ellipse cx=${I(a.cx)} cy=${I(a.cy)} rx=${I(a.rx)} ry=${I(a.ry+.3)} fill="#5a5c5f" />`)}case"charbroiler":{let[r,i]=ye(e,n.x0+6,e.levels.rim-1,B.grateFront+16),[a]=ye(e,n.x1-6,e.levels.rim-1,B.grateFront+16);return f`
        <line x1=${I(r)} y1=${I(i)} x2=${I(a)} y2=${I(i)} stroke="#a2a2a2" stroke-width="0.7" stroke-dasharray="0.9 2.6" stroke-opacity="0.7" />
        ${Oi(e,t,Wf(n))}
      `}default:return f``}}function Yf(e,t){if(!e.modules.length)return f``;let n=e.modules[0].x0,o=e.modules[e.modules.length-1].x1,r=e.levels.rim-2.5,i=`M${Re(e,n,r,B.grateFront-3)}L${Re(e,o,r,B.grateFront-3)}L${Re(e,o,B.grateTop,B.grateBack+2)}L${Re(e,n,B.grateTop,B.grateBack+2)}Z`;return f`<path d=${i} fill=${t.url("pan")} />`}function _c(e,t){let n=e.width,o=e.levels.rim,{trimFront:r,trimBack:i,trimTop:a}=B,s=`M${Re(e,0,o,r)}L${Re(e,n,o,r)}L${Re(e,n,a,r)}L${Re(e,0,a,r)}Z`,l=Ft(e,fe(0,n,r,i),a),p=Ft(e,fe(0,n,0,r),o),[d,u]=ye(e,8,a,(r+i)/2),[h]=ye(e,n-8,a,(r+i)/2),[g,y]=ye(e,0,a,i),[$]=ye(e,n,a,i),[b,_]=ye(e,0,a,r),[v]=ye(e,n,a,r),k=e.floorY-o;return f`
    <g>
      <path d=${s} fill=${t.url("ss")} />
      <path d=${l} fill=${t.url("ss-rail")} />
      <line x1=${I(d)} y1=${I(u)} x2=${I(h)} y2=${I(u)} stroke="#2a2b2c" stroke-opacity="0.35" stroke-width="0.7" stroke-dasharray="1 0.8" />
      <line x1=${I(g)} y1=${I(y)} x2=${I($)} y2=${I(y)} stroke="#fff" stroke-opacity="0.7" stroke-width="0.5" />
      <line x1=${I(b)} y1=${I(_)} x2=${I(v)} y2=${I(_)} stroke="#fff" stroke-opacity="0.45" stroke-width="0.4" />
      <path d=${p} fill=${t.url("ss-deck")} />
      <path d=${p} fill=${t.url("grain")} opacity="0.5" />
      ${Yf(e,t)}
      ${e.modules.map(x=>x.kind==="burners"?f`${Zf(e,t,x)}${Oi(e,t,Uf(x))}`:x.kind==="filler"?Oi(e,t,Kf(x)):qf(e,t,x))}
      <line x1="0" y1=${k+.35} x2=${n} y2=${k+.35} stroke="#fff" stroke-opacity="0.85" stroke-width="0.8" />
    </g>
  `}var Xf=[[.054,.274,59,138],[.054,.274,147,227],[.347,.653,88,198],[.729,.949,59,138],[.729,.949,147,227]],Qf=[[.07,.42,59,150],[.13,.36,166,227],[.6,.9,59,138],[.6,.9,150,227]];function bc(e,t,n,o){let r=e.width,i=e.levels.rim,a=Ft(e,fe(0,r,0,B.inductionTrim),i),s=Ft(e,fe(1.5,r-1.5,B.inductionTrim,B.glassBack),B.glassTop),l=(e.nominal>=36?Xf:Qf).map(([y,$,b,_])=>Ft(e,fe(r*y,r*$,b,_),B.glassTop)),p=Ft(e,fe(e.cx-48,e.cx+48,8,38),i+.2),[d,u]=ye(e,1.5,B.glassTop,B.inductionTrim),[h]=ye(e,r-1.5,B.glassTop,B.inductionTrim),g=e.floorY-i;return f`
    <g>
      <path d=${a} fill=${t.url("ss-deck")} />
      <path d=${a} fill=${t.url("grain")} opacity="0.5" />
      <path d=${s} fill=${t.url("ceramic")} />
      <path d=${l.join("")} fill="none" stroke="#8a8e92" stroke-opacity="0.22" stroke-width="0.35" />
      <line x1=${I(d)} y1=${I(u)} x2=${I(h)} y2=${I(u)} stroke="#000" stroke-opacity="0.6" stroke-width="0.6" />
      <line x1=${I(d)} y1=${I(u-.5)} x2=${I(h)} y2=${I(u-.5)} stroke="#fff" stroke-opacity="0.25" stroke-width="0.3" />
      <path d=${p} fill="#0b0c0e" />
      <path d=${p} fill="#fff1e0" style=${Le(n?.35:0,o)} />
      <line x1="0" y1=${g+.35} x2=${r} y2=${g+.35} stroke="#fff" stroke-opacity="0.85" stroke-width="0.8" />
    </g>
  `}var L=e=>Math.round(e*100)/100,Jf=e=>Math.min(1,Math.max(0,e)),vc=45*Math.PI/180,Fi=24,wc=18,Bi=7.6;function xc(e){if(!e)return{lit:0,heat:0,element:0,probe:!1,clean:!1};if(e.self_clean)return{lit:0,heat:1,element:1,probe:!1,clean:!0};let t=e.light||e.door_open?1:0,n=0,o=0;return e.on&&(e.preheated?[n,o]=[.7,.6]:e.progress!==null?n=o=.25+.45*Jf(e.progress):[n,o]=[.5,.55]),{lit:t,heat:n,element:o,probe:e.probe,clean:!1}}var an=e=>`M${e.map(([t,n])=>`${L(t)} ${L(n)}`).join("L")}Z`;function eh(e,t){let n=(t.x0+t.x1)/2,o=t.x1-t.x0-47,r=e.levels.doorBottom+15;return{x0:n-o/2,x1:n+o/2,floor:r,ceiling:r+175,front:12,back:215}}function zc(e,t,n,o,r,i,a,s){let l=eh(e,n),p=(Y,oe,Ae)=>ye(e,Y,oe,Ae),d=(Y,oe,Ae,_e,it,kt)=>{let[ge,Ne]=p(Y,oe,Ae),[Qe,gn]=p(_e,it,kt);return`M${L(ge)} ${L(Ne)}L${L(Qe)} ${L(gn)}`},u=(Y,oe,Ae,_e)=>an([Y,oe,Ae,_e]),h=u(p(l.x0,l.floor,l.back),p(l.x1,l.floor,l.back),p(l.x1,l.ceiling,l.back),p(l.x0,l.ceiling,l.back)),g=u(p(l.x0,l.floor,l.front),p(l.x1,l.floor,l.front),p(l.x1,l.floor,l.back),p(l.x0,l.floor,l.back)),y=u(p(l.x0,l.ceiling,l.front),p(l.x1,l.ceiling,l.front),p(l.x1,l.ceiling,l.back),p(l.x0,l.ceiling,l.back)),$=u(p(l.x0,l.floor,l.front),p(l.x0,l.floor,l.back),p(l.x0,l.ceiling,l.back),p(l.x0,l.ceiling,l.front)),b=u(p(l.x1,l.floor,l.front),p(l.x1,l.floor,l.back),p(l.x1,l.ceiling,l.back),p(l.x1,l.ceiling,l.front)),_=l.x1-l.x0,v=Y=>l.floor+28*Y-3,k=o.clean?[]:(s==="window"?[2,4]:[3,5]).map(v),x="",z="",S="",R="";for(let Y of k){x+=d(l.x0+4,Y,18,l.x1-4,Y,18),z+=d(l.x0+4,Y,200,l.x1-4,Y,200),z+=d(l.x0+4,Y,18,l.x0+4,Y,200)+d(l.x1-4,Y,18,l.x1-4,Y,200),S+=d(l.x0+4,Y,110,l.x1-4,Y,110);let oe=Math.round((_-8)/11);for(let Ae=1;Ae<oe;Ae++){let _e=l.x0+4+(_-8)*Ae/oe;S+=d(_e,Y,18,_e,Y+.01,110),R+=d(_e,Y,110,_e,Y+.01,200)}}let M="";for(let Y=1;Y<=6;Y++){let oe=v(Y)-2.5;M+=d(l.x0,oe,24,l.x0,oe,196)+d(l.x1,oe,24,l.x1,oe,196)}let G=s==="window"?l.ceiling-35:l.ceiling-9,T=[30,70,110,150],O="";T.forEach((Y,oe)=>{let[Ae,_e]=oe%2?[l.x1-12,l.x0+12]:[l.x0+12,l.x1-12],[it,kt]=p(Ae,G,Y),[ge,Ne]=p(_e,G,Y);O+=oe?`L${L(it)} ${L(kt)}`:`M${L(it)} ${L(kt)}`,O+=`L${L(ge)} ${L(Ne)}`;let Qe=T[oe+1];if(Qe!==void 0){let gn=_e+(_e>Ae?8:-8),[qd,Yd]=p(gn,G,(Y+Qe)/2),[Ua,Ka]=p(_e,G,Qe);O+=`Q${L(qd)} ${L(Yd)} ${L(Ua)} ${L(Ka)}`,O+=`M${L(Ua)} ${L(Ka)}`}});let V=l.ceiling-26,Q=[p(l.x0+1,V,140),p(l.x1-1,V,140)],N=Tt(140),F=[p(l.x0+_*.16,V-40,l.back),p(l.x1-_*.16,V-40,l.back)],j=_*.42*Tt(l.back),W=u(p(l.x0+_*.2,l.ceiling-40,l.back),p(l.x1-_*.2,l.ceiling-40,l.back),p(l.x1-_*.2,l.ceiling-8,l.back),p(l.x0+_*.2,l.ceiling-8,l.back)),ee=k.length?k[0]:l.floor+50,be=p(l.x0+2,l.floor+125,40),Ce=p((l.x0+l.x1)/2-10,ee+12,105),re=`M${L(be[0])} ${L(be[1])}C${L(be[0]+18)} ${L(be[1]+26)} ${L(Ce[0]-30)} ${L(Ce[1]-8)} ${L(Ce[0])} ${L(Ce[1])}`,[pe,Ze]=Ce,me=`M${L(pe)} ${L(Ze)}l5 2.4`,J=`M${L(pe+5)} ${L(Ze+2.4)}l4.2 5.6`;return f`
    <g clip-path=${`url(#${r})`}>
      <rect x=${i.x} y=${i.y} width=${i.w} height=${i.h} fill=${t.url("cavity")} />
      <g style=${Le(o.lit,a)}>
        <path d=${h} fill=${t.url("porcelain")} />
        <path d=${g} fill="#111219" />
        <path d=${y} fill="#1e202c" />
        <path d=${$} fill="#171924" />
        <path d=${b} fill="#171924" />
        <path d=${W} fill="#1a1c27" stroke="#2a2d3d" stroke-width="0.5" />
        ${F.map(([Y,oe])=>f`<ellipse cx=${L(Y)} cy=${L(oe)} rx=${L(j)} ry=${L(j*.9)} fill=${t.url("pool")} />`)}
        <path d=${M} fill="none" stroke="#a39583" stroke-width="0.5" stroke-opacity="0.55" stroke-linecap="round" />
        ${Q.map(([Y,oe])=>f`
            <ellipse cx=${L(Y)} cy=${L(oe)} rx=${L(30*N)} ry=${L(38*N)} fill=${t.url("pool")} />
            <ellipse cx=${L(Y)} cy=${L(oe)} rx=${L(12*N)} ry=${L(9*N)} fill=${t.url("lamp")} />`)}
      </g>
      <rect x=${i.x} y=${i.y} width=${i.w} height=${i.h} fill=${t.url(o.clean?"heat-clean":"heat")}
        style=${Le(o.heat,a)} />
      <g style=${Le(o.element,a)}>
        <path d=${O} fill="none" stroke="#ff7a2e" stroke-width="4" stroke-linecap="round" opacity="0.55"
          filter=${t.url("glow")} />
        <path d=${O} fill="none" stroke=${t.url("element")} stroke-width="1.5" stroke-linecap="round" />
        <path d=${O} fill="none" stroke="#ffe2b0" stroke-width="0.45" stroke-linecap="round" opacity="0.8" />
      </g>
      <g style=${Le(o.lit,a)}>
        <path d=${R} fill="none" stroke="#c9b496" stroke-width="0.35" stroke-opacity="0.3" />
        <path d=${S} fill="none" stroke="#e6d3b2" stroke-width="0.4" stroke-opacity="0.55" />
        <path d=${z} fill="none" stroke="#d9c8ac" stroke-width="0.8" stroke-opacity="0.75" stroke-linecap="round" />
        <path d=${x} fill="none" stroke="#f8ead3" stroke-width="1.05" stroke-linecap="round" />
      </g>
      <path d=${x+z} fill="none" stroke="#ffa86a" stroke-width="1" stroke-linecap="round"
        style=${Le(o.heat*.5,a)} />
      ${o.probe?f`<g fill="none" stroke-linecap="round" style=${Le(Math.max(o.lit*.9,o.heat*.45),a)}>
              <path d=${re} stroke="#c9c9c9" stroke-width="0.6" />
              <path d=${me} stroke="#8e8e8e" stroke-width="1.9" />
              <path d=${me} stroke="#d8d8d8" stroke-width="0.5" transform="translate(0 -0.4)" />
              <path d=${J} stroke="#e4e4e4" stroke-width="0.45" />
            </g>`:w}
    </g>
  `}function kr(e,t,n,o){let r=n-t;if(e.transitional){let s=Math.min(41,r*.115);return{fx0:t+s,fy0:o+35,fx1:n-s,fy1:o+195,gx0:t+s+11,gy0:o+48,gx1:n-s-11,gy1:o+183}}let i=r<240?34:43,a=8.7;return{fx0:t+i,fy0:o+42.6,fx1:n-i,fy1:o+179,gx0:t+i+a,gy0:o+42.6+a,gx1:n-i-a,gy1:o+179-a}}function Sc(e,t,n,o,r,i=1,a=!1){let s=Bi*i,l=12.5*i,p=19*i,d=o-p/2,u=a?0:3.6*i,h=p/2-1.2*i,g=G=>(G==="outer"?3.5:5.5)*i,[y,$]=r.map(g),b=[{fx:t+y,edge:t+y+.4,end:y,side:-1,sweep:0,fill:"post-end-l"},{fx:n-$-l,edge:n-$-.4,end:$,side:1,sweep:1,fill:"post-end"}],_=t+y+l/2,v=n-$-l/2,k={x:t+y+l,w:n-$-l-(t+y+l)},x=b.map(({edge:G,end:T,sweep:O})=>`M${L(G)} ${L(o-h)}A${L(T)} ${L(h)} 0 0 ${O} ${L(G)} ${L(o+h)}Z`),z=L(1.5*i),S=(G,T)=>f`<rect x=${L(G)} y=${L(d)} width=${L(l)} height=${L(p)} rx=${z} fill=${T} />`,R=(G,T)=>u?f`<rect x=${L(G+z/2)} y=${L(d-u+.3*i)} width=${L(l-z)} height=${L(u)} fill=${T} />`:w,M=(G,T,O,V)=>f`
    <rect x=${L(G)} y=${L(O+V*.12)} width=${L(T)} height=${L(V*.26)} fill=${e.url("tube-glint")} opacity="0.9" />
    <rect x=${L(G)} y=${L(O+V*.8)} width=${L(T)} height=${L(V*.13)} fill=${e.url("tube-glint")} opacity="0.55" />`;return f`
    <rect x=${L(_)} y=${L(o-s)} width=${L(v-_)} height=${L(s*2)} fill=${e.url("tube")} />
    ${b.map(({fx:G,edge:T,end:O,side:V,fill:Q},N)=>f`
        <path d=${x[N]} fill=${e.url(Q)} />
        <line x1=${L(T+V*O*.45)} y1=${L(o-h+2.5*i)}
          x2=${L(T+V*O*.45)} y2=${L(o+h-2.5*i)}
          stroke="#fff" stroke-opacity="0.3" stroke-width=${L(.6*i)} stroke-linecap="round" />
        ${R(G,e.url("post-top"))}
        ${S(G,e.url("tube"))}
        ${S(G,e.url("tube-side"))}
        <rect x=${L(G)} y=${L(d)} width=${L(l)} height=${L(p)} rx=${z} fill="none"
          stroke="#6d6c6a" stroke-width="0.3" />
      `)}
    <g fill=${e.url("falloff")}>
      <rect x=${L(k.x)} y=${L(o-s)} width=${L(k.w)} height=${L(s*2)} />
      ${x.map(G=>f`<path d=${G} />`)}
      ${b.map(({fx:G})=>f`${S(G,e.url("falloff"))}${R(G,e.url("falloff"))}`)}
    </g>
    ${M(k.x,k.w,o-s,2*s)}
    ${b.map(({fx:G})=>M(G+1.5*i,l-3*i,d,p))}
  `}function Rc(e,t,n=1){let o=[t.x0<1?"outer":"inner",t.x1>e.width-1?"outer":"inner"],r=i=>(i==="outer"?.3:2)*n;return{x0:t.x0+r(o[0]),x1:t.x1-r(o[1]),ends:o}}function Ac(e,t,n,o){return f`
    <rect x=${t} y=${o-4} width="3.2" height="8" fill="#9a9997" />
    <rect x=${n-3.2} y=${o-4} width="3.2" height="8" fill="#9a9997" />
    <rect x=${t+1.2} y=${o-4.2} width=${n-t-2.4} height="8.4" rx="2.2" fill=${e.url("tube")} />
    <rect x=${t+1.2} y=${o-4.2} width=${n-t-2.4} height="8.4" rx="2.2" fill=${e.url("falloff")} />
    <rect x=${t+1.2} y=${o-4.2} width=${n-t-2.4} height="8.4" rx="2.2" fill="none" stroke="#7c7b79" stroke-width="0.3" />
  `}function th(e,t){let n=a=>wi(a,e.width),o=n((t.fx0+t.fx1)/2),r=n(t.fx0+120),i=n(t.fx1-120);return f`
    <path d=${`M${t.fx0} ${t.fy0}H${t.fx1}L${t.gx1} ${t.gy0}H${t.gx0}Z`} fill=${Ot(o*.75+35)} />
    <path d=${`M${t.fx0} ${t.fy1}H${t.fx1}L${t.gx1} ${t.gy1}H${t.gx0}Z`} fill=${Ot(o*.75+50)} />
    <path d=${`M${t.fx0} ${t.fy0}L${t.gx0} ${t.gy0}V${t.gy1}L${t.fx0} ${t.fy1}Z`} fill=${Ot(r)} />
    <path d=${`M${t.fx1} ${t.fy0}L${t.gx1} ${t.gy0}V${t.gy1}L${t.fx1} ${t.fy1}Z`} fill=${Ot(i)} />
    <path d=${`M${t.fx0} ${t.fy0}H${t.fx1}V${t.fy1}H${t.fx0}Z`} fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="0.4" />
    <rect x=${t.gx0} y=${t.gy0} width=${t.gx1-t.gx0} height=${t.gy1-t.gy0} fill="none" stroke="#141414" stroke-width="0.7" />
  `}function nh(e){return f`
    <path d=${`M${e.fx0} ${e.fy0}V${e.fy1}M${e.fx1} ${e.fy0}V${e.fy1}`} fill="none" stroke="#000"
      stroke-opacity="0.28" stroke-width="0.6" />
    <path d=${`M${e.fx0} ${e.fy0}H${e.fx1}`} fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="0.5" />
    <path d=${`M${e.fx0} ${e.fy1}H${e.fx1}`} fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="0.7" />
    <rect x=${e.gx0} y=${e.gy0} width=${e.gx1-e.gx0} height=${e.gy1-e.gy0} fill="none" stroke="#000"
      stroke-opacity="0.35" stroke-width="1.4" />
  `}function oh(e,t,n,o,r,i){let a=t.id(`glass-${n.slot.prefix}`),s={x:o.gx0,y:o.gy0,w:o.gx1-o.gx0,h:o.gy1-o.gy0},l=Math.max(r.lit,r.heat)>0;return f`
    <clipPath id=${a}><rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} /></clipPath>
    <rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill=${t.url("glass")} />
    <g style=${Le(l?1:0,i)}>
      ${zc(e,t,n,r,a,s,i,"window")}
      <rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="#000" opacity=${r.lit?.16:.12} />
    </g>
    <rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill=${t.url("glass-reflect")}
      style=${Le(l?.45:1,i)} />
    <rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill=${t.url("sheen")} />
  `}var Ni=60,kc=45;function rh(e,t,n,o,r,i,a=!1){let s=o-t,l=r-n;return f`
    <rect x=${t} y=${n} width=${s} height=${l} fill=${e.url("ss")} />
    <rect x=${t} y=${n} width=${s} height=${l} fill=${e.url("shade-door")} />
    <rect x=${t} y=${n} width=${s} height=${l} fill=${e.url("lower")} mask=${a?w:e.url("lower-mask")} />
    ${i?.left?f`<rect x=${t} y=${i.top} width=${Ni} height=${kc} fill=${e.url("corner-l")} />`:w}
    ${i?.right?f`<rect x=${o-Ni} y=${i.top} width=${Ni} height=${kc} fill=${e.url("corner-r")} />`:w}
    <rect x=${t} y=${n} width=${s} height=${l} fill=${e.url("grain")} />
    <line x1=${t+.5} y1=${n+.45} x2=${o-.5} y2=${n+.45} stroke="#fff" stroke-opacity="0.55" stroke-width="0.8" />
    <line x1=${t+.3} y1=${n+1} x2=${t+.3} y2=${r-.5} stroke="#fff" stroke-opacity="0.3" stroke-width="0.5" />
    <line x1=${o-.3} y1=${n+1} x2=${o-.3} y2=${r-.5} stroke="#000" stroke-opacity="0.22" stroke-width="0.6" />
    <line x1=${t+.5} y1=${r-.4} x2=${o-.5} y2=${r-.4} stroke="#000" stroke-opacity="0.3" stroke-width="0.8" />
  `}var Mc=16,Tc=19.4;function Cc(e,t,n,o,r){let i=e.floorY-e.levels.doorTop,a=e.floorY-e.levels.doorBottom,s=kr(e,n.x0,n.x1,i),l=xc(o),p=Math.min(39,(n.x1-n.x0)*.11),d=i+(e.transitional?Tc:Mc),u=Rc(e,n),h=e.transitional?null:{left:u.ends[0]==="outer",right:u.ends[1]==="outer",top:d+Bi};return f`
    <g>
      ${rh(t,n.x0,i,n.x1,a,h,e.transitional)}
      ${oh(e,t,n,s,l,r)}
      ${e.transitional?nh(s):th(e,s)}
      <rect x=${s.gx0-1} y=${s.gy0-1} width=${s.gx1-s.gx0+2} height=${s.gy1-s.gy0+2}
        fill="none" stroke="#ff9a4a" stroke-width="2" filter=${t.url("halo")} style=${Le(l.heat*.25,r)} />
      ${e.transitional?f`
            <rect x=${n.x0+p-2} y=${d-13.2} width=${n.x1-n.x0-2*p+4} height="9"
              fill=${t.url("handle-shadow")} mask=${t.url("rise-mask")} filter=${t.url("softer")} />
            ${Ac(t,n.x0+p,n.x1-p,d)}`:f`
            <rect x=${n.x0} y=${i+1} width=${n.x1-n.x0} height=${d-Bi-i-1}
              fill=${t.url("handle-shadow")} mask=${t.url("rise-mask")} />
            ${Sc(t,u.x0,u.x1,d,u.ends)}`}
    </g>
  `}function Gc(e,t,n,o,r){let{doorBottom:i,doorTop:a}=e.levels,s=a-i,l=e.floorY-a,p=e.floorY-i,{x0:d,x1:u}=n,h={...xc(o),lit:1},g=Math.cos(vc),y=Math.sin(vc),$=(re,pe,Ze=0)=>{let[,me]=ye(e,re,i+pe*g-Ze*y,-pe*y-Ze*g);return[re,me]},{ox0:b,ox1:_,oy0:v,oy1:k}=ji(e,n),x=t.id(`opening-${n.slot.prefix}`),z={x:b,y:v,w:_-b,h:k-v},S=Math.max(3,Math.round((_-b)/34)),R=Array.from({length:S},(re,pe)=>b+10+(_-b-20)*(pe+.5)/S),M=(re,pe,Ze,me,J=0)=>an([$(re,pe,J),$(Ze,pe,J),$(Ze,me,J),$(re,me,J)]),G=M(d,0,u,s),T=kr(e,d,u,0),O=re=>s-re,V=M(T.gx0,O(T.gy1),T.gx1,O(T.gy0)),Q=e.transitional?[]:[an([$(T.fx0,O(T.fy0)),$(T.fx1,O(T.fy0)),$(T.gx1,O(T.gy0)),$(T.gx0,O(T.gy0))]),an([$(T.fx0,O(T.fy1)),$(T.fx1,O(T.fy1)),$(T.gx1,O(T.gy1)),$(T.gx0,O(T.gy1))]),an([$(T.fx0,O(T.fy0)),$(T.gx0,O(T.gy0)),$(T.gx0,O(T.gy1)),$(T.fx0,O(T.fy1))]),an([$(T.fx1,O(T.fy0)),$(T.gx1,O(T.gy0)),$(T.gx1,O(T.gy1)),$(T.fx1,O(T.fy1))])],N=an([$(d,s),$(u,s),$(u,s,-Fi),$(d,s,-Fi)]),[,F]=$(d,s,-Fi*.5),j=s-(e.transitional?Tc:Mc),[,W]=$(d,j,wc),ee=Tt(-j*y-wc*g),be=Rc(e,n,ee),Ce=wi((d+u)/2,e.width);return f`
    <g>
      <rect x=${d} y=${l} width=${u-d} height=${p-l} fill=${t.url("ss-dim")} />
      <rect x=${d} y=${l} width=${u-d} height=${p-l} fill=${t.url("grain")} />
      ${R.map(re=>f`<g fill="#202122">
          <rect x=${re-5} y=${l+3.6} width="10" height="0.9" rx="0.45" />
          <rect x=${re-5} y=${l+6} width="10" height="0.9" rx="0.45" />
          <rect x=${re-5} y=${l+8.4} width="10" height="0.9" rx="0.45" />
        </g>`)}
      <circle cx=${b+3} cy=${l+6.4} r="1.3" fill="#2a2b2c" />
      <circle cx=${_-3} cy=${l+6.4} r="1.3" fill="#2a2b2c" />
      <clipPath id=${x}><rect x=${z.x} y=${z.y} width=${z.w} height=${z.h} rx="5" /></clipPath>
      ${zc(e,t,n,h,x,z,r,"open")}
      <rect x=${z.x} y=${z.y} width=${z.w} height=${z.h} rx="5" fill="none" stroke="#5a5650" stroke-width="2.2" />

      <path d=${G} fill=${t.url("ss")} />
      <path d=${G} fill=${t.url("shade-open")} />
      <path d=${G} fill=${t.url("grain")} />
      <path d=${V} fill=${t.url("glass")} />
      ${Q.map((re,pe)=>f`<path d=${re} fill=${Ot(Ce*.72+[30,45,40,34][pe])} />`)}
      <path d=${V} fill="none" stroke="#141414" stroke-width="0.6" />
      <path d=${N} fill=${Ot(Ce*.75+46)} />
      <line x1=${d+12} y1=${L(F)} x2=${u-12} y2=${L(F)} stroke="#2a2b2c" stroke-opacity="0.4" stroke-width="0.8" />
      <path d=${N} fill="none" stroke="#fff" stroke-opacity="0.4" stroke-width="0.4" />
      ${e.transitional?Ac(t,d+39,u-39,W):Sc(t,be.x0,be.x1,W,be.ends,ee,!0)}
    </g>
  `}function ji(e,t){let n=e.floorY-e.levels.doorTop,o=e.floorY-e.levels.doorBottom;return{ox0:t.x0+16,ox1:t.x1-16,oy0:n+14,oy1:o-8}}var ih="rgba(20, 22, 25, 0.6)",ah="rgba(255, 255, 255, 0.22)",sh="font-family: var(--ha-font-family-body, Roboto, system-ui); font-variant-numeric: tabular-nums",Ue=20,Zi=12,Ki=16,Wi=7,lh=9,xr=4,Ui=5.6;function Ec(e,t){let n=.125*e/Ue;return t&&t>0?Math.min(e/t,n):.03*e/Zi}function Dc(e){if(!e)return null;let t=[];e.probe&&t.push("probe"),e.remote_ready&&t.push("remote");let n=null;if(e.self_clean)n={text:e.temp,progress:null,icon:"lock"};else if(e.on){let o=!e.preheated&&e.progress!==null;n={text:e.temp,progress:o?Math.min(1,Math.max(0,e.progress??0)):null,icon:null},!n.text&&n.progress===null&&(n=null)}return n||t.length?{label:n,chips:t}:null}function ch(e){let t=0;for(let n of e)t+=/[:.,'° ]/.test(n)?.34:/[0-9]/.test(n)?.6:.64;return t*Zi}function Pc(e){if(!e.text)return Ue;let t=e.progress!==null||e.icon?Ki:0;return Math.max(Ue,Wi+t+ch(e.text)+lh)}function Lc(e,t,n,o=13){let r=e==="remote"?f`<g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round">
          <path d="M-7.2 -1.6A10 10 0 0 1 7.2 -1.6" />
          <path d="M-4.4 1.4A6 6 0 0 1 4.4 1.4" />
          <circle cx="0" cy="5" r="1.3" fill="#fff" stroke="none" />
        </g>`:e==="probe"?f`<g fill="none" stroke="#fff" stroke-linecap="round">
            <path d="M-2.4 2.4L6.4 -6.4" stroke-width="1.8" />
            <path d="M-6.6 6.6L-2.8 2.8" stroke-width="4.4" />
          </g>`:f`<path d="M-4 -1.5V-3.8A4 4 0 0 1 4 -3.8V-1.5" fill="none" stroke="#fff" stroke-width="2" />
            <rect x="-6" y="-1.5" width="12" height="9" rx="1.8" fill="#fff" />`;return f`<g transform=${`translate(${t} ${n}) scale(${o/20})`} opacity="0.85">${r}</g>`}function Oc(e,t,n,o){let r=Ue/2;return f`
    <rect x=${t+.5} y=${n+1.2} width=${o-1} height=${Ue} rx=${r} fill="#000" opacity="0.28"
      filter=${e.url("pill-shadow")} />
    <rect x=${t} y=${n} width=${o} height=${Ue} rx=${r} fill=${ih} stroke=${ah} stroke-width="1" />
  `}function ph(e,t,n,o,r){let i=Pc(o),a=o.progress!==null||!!o.icon,s=o.text?t+Wi+Ki/2:t+i/2,l=2*Math.PI*Ui;return f`
    ${Oc(e,t,n-Ue/2,i)}
    ${o.progress!==null?f`
          <circle cx=${s} cy=${n} r=${Ui} fill="none" stroke="#fff" stroke-opacity="0.24" stroke-width="1.9" />
          <circle cx=${s} cy=${n} r=${Ui} fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round"
            stroke-dasharray=${l} stroke-dashoffset=${l*(1-o.progress)}
            transform=${`rotate(-90 ${s} ${n})`}
            style=${r?"":"transition: stroke-dashoffset 0.6s ease"} />`:o.icon?Lc(o.icon,s,n):w}
    ${o.text?f`<text x=${a?t+Wi+Ki:t+i/2} y=${n} fill="#fff" font-size=${Zi} font-weight="600"
            text-anchor=${a?"start":"middle"} dominant-baseline="central" style=${sh}>${o.text}</text>`:w}
  `}function dh(e,t,n,o){return f`${Oc(e,t,n-Ue/2,Ue)}${Lc(o,t+Ue/2,n)}`}function Vc(e,t,n,o,r){let i=[...n.label?[{w:Pc(n.label),draw:(h,g)=>ph(e,h,g,n.label,r)}]:[],...n.chips.map(h=>({w:Ue,draw:(g,y)=>dh(e,g,y,h)}))],a=(t.x1-t.x0)/o-8,s=[];for(let h of i){let g=s[s.length-1],y=g?g.reduce(($,b)=>$+b.w+xr,0):0;g&&y+h.w<=a?g.push(h):s.push([h])}let l=(t.y1-t.y0)/o,p=Math.max(.3*l-Ue/2,.06*l),d=(t.x0+t.x1)/2,u=Math.round(o*1e3)/1e3;return f`<g transform=${`translate(${d} ${t.y0}) scale(${u})`}>
    ${s.map((h,g)=>{let y=h.reduce((_,v)=>_+v.w,0)+xr*(h.length-1),$=p+Ue/2+g*(Ue+xr),b=-y/2;return h.map(_=>{let v=_.draw(b,$);return b+=_.w+xr,v})})}
  </g>`}var Hc=e=>{if(e.spec.family!=="range")return null;let t=e.spec,n=mc(t),o=vl(e.uid),r=e.state.ovens??{},i=e.state.display??null,a=!!e.reducedMotion,s=n.viewBox;return A`<svg
    viewBox="${s.x} ${s.y} ${s.w} ${s.h}"
    role="img"
    aria-label=${fh(n,e.state)}
  >
    ${wl(o,n.width,e.appearance.knobs)}
    <g filter=${e.state.available?w:o.url("offline")}>
      ${ac(n,o,e.theme)} ${sc(n,o)}
      ${n.induction?bc(n,o,Li(r,i),a):_c(n,o)}
      ${lc(n,o)}
      ${n.doors.map(l=>r[l.slot.prefix]?.door_open?w:Cc(n,o,l,r[l.slot.prefix]??null,a))}
      ${yc(n,o,e.appearance.knobs,r,i,a)}
      ${n.doors.map(l=>r[l.slot.prefix]?.door_open?Gc(n,o,l,r[l.slot.prefix]??null,a):w)}
    </g>
    ${e.state.available?uh(n,o,r,Ec(s.h,e.pixelHeight),a):w}
  </svg>`};function uh(e,t,n,o,r){return e.doors.map(i=>{let a=n[i.slot.prefix]??null,s=Dc(a);if(!s)return w;let l;if(a?.door_open){let{ox0:p,ox1:d,oy0:u,oy1:h}=ji(e,i);l={x0:p,y0:u,x1:d,y1:h}}else{let p=kr(e,i.x0,i.x1,e.floorY-e.levels.doorTop);l={x0:p.gx0,y0:p.gy0,x1:p.gx1,y1:p.gy1}}return Vc(t,l,s,o,r)})}function fh(e,t){let n=[e.induction?"Induction range":"Range"];t.available||n.push("offline");for(let o of e.doors){let r=t.ovens?.[o.slot.prefix],i=o.slot.position==="left"?"left oven":o.slot.position==="right"?"right oven":"oven";r&&(r.door_open&&n.push(`${i} door open`),r.self_clean?n.push(`${i} self-cleaning`):r.on?n.push(`${i} ${r.preheated?"preheated":"heating"}${r.temp?` ${r.temp}`:""}`):r.door_open||n.push(`${i} off`),r.light&&!r.door_open&&!r.self_clean&&n.push(`${i} light on`),r.probe&&n.push(`${i} probe in`),r.remote_ready&&n.push(`${i} Remote Ready`))}return t.display&&n.push(`timer ${t.display}`),n.join(", ")}function c(e){return Math.round(e*10)/10}function et(e,t){return e.d/(e.d-t)}function tt(e,t,n,o){let r=et(e,o);return[e.cx+(t-e.cx)*r,e.cy+(n-e.cy)*r]}function Nt(e,t,n){let[o,r]=tt(e,t.x,t.y,n),i=et(e,n);return{x:o,y:r,w:t.w*i,h:t.h*i}}function X(e){return`${e.map(([t,n],o)=>`${o?"L":"M"}${c(t)} ${c(n)}`).join("")}Z`}function st(e){let t=e*2654435761>>>0||1;return()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296)}var hh=new Set(["undercounter_refrigerator","undercounter_beverage","undercounter_wine","undercounter_drawers","ice_maker"]),mh={side_by_side:48,french_door:36,over_under:30,column_refrigerator:30,column_freezer:24,column_wine:24,tall_refrigerator:30,tall_freezer:30,tall_over_under:36,wine_over_drawers:30,undercounter_refrigerator:24,undercounter_beverage:24,undercounter_wine:24,undercounter_drawers:30,ice_maker:15},gh={side_by_side:"Side-by-side refrigerator",french_door:"French door refrigerator",over_under:"Over-and-under refrigerator",column_refrigerator:"Column refrigerator",column_freezer:"Column freezer",column_wine:"Wine column",tall_refrigerator:"Refrigerator",tall_freezer:"Freezer",tall_over_under:"Over-and-under refrigerator",wine_over_drawers:"Wine storage with drawers",undercounter_refrigerator:"Undercounter refrigerator",undercounter_beverage:"Beverage center",undercounter_wine:"Wine storage",undercounter_drawers:"Refrigerator drawers",ice_maker:"Ice maker"},zr=2.5,Fc=3.5;function yh(e){let t=e.form,n=t==="side_by_side"||t==="french_door"||t==="over_under",o=t==="column_refrigerator"||t==="column_freezer"||t==="column_wine";return e.line==="pro"?n?"pro":"classic":e.line==="classic"||e.line==="built_in"?n||o?"classic":"designer":e.line==="designer"||e.line==="integrated"?"designer":n?"classic":"designer"}function $h(e,t,n,o){return t?{top:"flush",grille:null,band:null,x0:0,x1:n,y0:0,y1:306,kick:{x:0,y:306,w:n,h:o-306},frame:0}:e==="classic"?{top:"louvers",grille:{x:0,y:0,w:n,h:81},band:{x:0,y:81,w:n,h:6.5},x0:0,x1:n,y0:87.5,y1:806,kick:{x:0,y:806,w:n,h:34},frame:0}:e==="pro"?{top:"slots",grille:{x:0,y:0,w:n,h:108},band:{x:0,y:108,w:n,h:3},x0:12,x1:n-12,y0:111,y1:798,kick:{x:0,y:800,w:n,h:40},frame:12}:{top:"flush",grille:null,band:null,x0:0,x1:n,y0:0,y1:805,kick:{x:0,y:805,w:n,h:35},frame:0}}function Rn(e,t,n){let o=[],r=e;for(let i of n)o.push([r,r+i]),r+=i+zr;return o.push([r,t]),o}var _h={classic:[32,45,55],pro:[36,42,45],column:[34,80,92],over_drawers:[34,81,47],undercounter:[33.5,36,44]};function sn(e,t){let[n,o,r]=_h[t];return{x:e.x+n,y:e.y+o,w:e.w-2*n,h:e.h-o-r}}function Nc(e,t){let n=t?9:10;return{x:e.x+n,y:e.y+(t?9:12),w:e.w-2*n,h:e.h-(t?18:22)}}function Yi(e,t){let n=t.split!==null?22:0,o=(e[1]-e[0]-6-n)/t.count,r=Array.from({length:t.count},(a,s)=>e[0]+6+(t.split!==null&&s>=t.split?n:0)+(s+1)*o-16),i=t.split!==null?r[t.split-1]+17:null;return{pitch:o,bars:r,divider:i===null?null:{y:i,h:n-2}}}function qi(e,t){let n=e.x+e.w/2,{divider:o}=Yi([e.y,e.y+e.h],t);return[{zone:"wine",top:e.y+4,x:n},...o?[{zone:"wine2",top:o.y+o.h,x:n}]:[]]}function Bc(e){let t=yh(e),n=e.form,o=hh.has(n),r=n==="over_under"&&t==="pro"?36:mh[n],i=Math.min(Math.max(e.width??r,12),72)*10,a=(o?33:84)*10,s=$h(t,o,i,a),l=e.zones>=2,p=[],d=0,u=b=>{let _={window:null,dispenser:!1,ice:!1,racks:null,zones:[],...b,cavity:b.cavity??Nc(b.rect,o),cavityId:d++};return p.push(_),_},h=(b,_,v,k)=>({x:b,y:v,w:_-b,h:k-v}),g=t==="pro"?"pro":t==="classic"?"classic":"column",y=(b,_,v,k)=>{b.forEach(([x,z],S)=>{let[R,M,G]=k[Math.min(S,k.length-1)];u({kind:"drawer",rect:h(_,v,x,z),hinge:"left",handle:"top",contents:R,keys:M,zones:G?[{zone:G}]:[],ice:e.ice&&R==="freezer"&&S===k.findIndex(([T])=>T==="freezer"),name:R==="freezer"?"freezer drawer":"refrigerator drawer"})})};switch(n){case"side_by_side":{let b=t==="pro"?s.x0+184:Math.round(i*.398),_=t==="pro"?534:s.y1,v=u({kind:"door",rect:h(s.x0,b-Fc/2,s.y0,_),hinge:"left",handle:"edge",contents:"freezer",keys:["frz_door_ajar"],zones:[{zone:"frz",at:t==="pro"?.2:.15}],dispenser:e.dispenser==="external",ice:e.ice,name:"freezer door"}),k=h(b+Fc/2,s.x1,s.y0,_),x=e.glass?sn(k,g):null;if(u({kind:"door",rect:k,hinge:"right",handle:"edge",window:x,contents:e.glass?"food":"fridge",keys:["ref_door_ajar"],zones:[{zone:"ref",at:t==="pro"?.2:.15,x:x?x.x+x.w/2:void 0},...e.glass?[]:[{zone:"crisp",openOnly:!0}]],name:"refrigerator door"}),t==="pro"){let z=Rn(_+zr+.5,s.y1,[143]);y(z,v.rect.x,v.rect.x+v.rect.w,[["freezer",[],null]]),y(z,k.x,k.x+k.w,[["fridge",[],null]])}break}case"french_door":{let[[b,_],[v,k]]=Rn(s.y0,s.y1,[t==="designer"?544:515]),x=Nc(h(s.x0,s.x1,b,_),o),z=h(s.x0,i/2-zr/2,b,_),S=h(i/2+zr/2,s.x1,b,_),R=d;for(let[M,G]of[[z,"left"],[S,"right"]]){let T=u({kind:"door",rect:M,hinge:G,handle:"edge",window:e.glass?sn(M,g):null,contents:e.glass?"food":"fridge",cavity:x,keys:["ref_door_ajar"],zones:G==="left"?[{zone:"ref",at:.15},{zone:"crisp",openOnly:!0}]:[],dispenser:G==="left"&&e.dispenser==="external",name:"refrigerator door"});T.cavityId=R}d=R+1,u({kind:"drawer",rect:h(s.x0,s.x1,v,k),hinge:"left",handle:"top",contents:"freezer",keys:["frz_door_ajar"],zones:[{zone:"frz"}],ice:e.ice,name:"freezer drawer"});break}case"over_under":{if(t==="pro"){let[[z,S],...R]=Rn(s.y0,s.y1,[423,143]),M=h(s.x0,s.x1,z,S);u({kind:"door",rect:M,hinge:"right",handle:"edge",window:e.glass?sn(M,"pro"):null,contents:e.glass?"food":"fridge",keys:["ref_door_ajar"],zones:[{zone:"ref",at:.18}],name:"refrigerator door"}),y(R,s.x0,s.x1,[["freezer",["frz_door_ajar"],"frz"],["freezer",[],null]]);break}let[[b,_],[v,k]]=Rn(s.y0,s.y1,[t==="designer"?544:515]),x=h(s.x0,s.x1,b,_);u({kind:"door",rect:x,hinge:"right",handle:"edge",window:e.glass?sn(x,g):null,contents:e.glass?"food":"fridge",keys:["ref_door_ajar"],zones:[{zone:"ref",at:.16},...e.glass?[]:[{zone:"crisp",openOnly:!0}]],name:"refrigerator door"}),u({kind:"drawer",rect:h(s.x0,s.x1,v,k),hinge:"left",handle:"top",contents:"freezer",keys:["frz_door_ajar"],zones:[{zone:"frz"}],ice:e.ice,name:"freezer drawer"});break}case"column_refrigerator":case"column_freezer":case"column_wine":{let b=h(s.x0,s.x1,s.y0,s.y1),_=n==="column_wine",v=n==="column_freezer",k=_||e.glass&&!v,x=k?sn(b,t==="classic"?"classic":"column"):null,z=Math.max(6,Math.round((x?.h??600)/46)),S=l?Math.round(z*.36):null,R=_?qi(x,{count:z,split:S}):[{zone:v?"frz":"ref",at:.13,x:x?x.x+x.w/2:void 0}];u({kind:"door",rect:b,hinge:n==="column_refrigerator"?"right":"left",handle:"edge",window:x,contents:_?"wine":v?"freezer":k?"food":"fridge",keys:_?["wine_door_ajar","wine2_door_ajar"]:v?["frz_door_ajar"]:["ref_door_ajar"],zones:[...R,...!_&&!v&&!k?[{zone:"crisp",openOnly:!0}]:[]],ice:v&&e.ice,racks:_?{count:z,split:S}:null,name:_?"wine door":v?"freezer door":"refrigerator door"});break}case"tall_refrigerator":case"tall_freezer":case"tall_over_under":case"wine_over_drawers":{let[[b,_],...v]=Rn(s.y0,s.y1,[499,133.5]),k=h(s.x0,s.x1,b,_),x=n==="wine_over_drawers",z=x||e.glass&&n!=="tall_freezer"?sn(k,"over_drawers"):null,S=8,R=x&&l?6:null;u({kind:"door",rect:k,hinge:"left",handle:"edge",window:z,contents:x?"wine":n==="tall_freezer"?"freezer":z?"food":"fridge",keys:x?["wine_door_ajar","wine2_door_ajar"]:[n==="tall_freezer"?"frz_door_ajar":"ref_door_ajar"],zones:x?qi(z,{count:S,split:R}):[{zone:n==="tall_freezer"?"frz":"ref",at:.2,x:z?z.x+z.w/2:void 0}],ice:n==="tall_freezer"&&e.ice,racks:x?{count:S,split:R}:null,name:x?"wine door":n==="tall_freezer"?"freezer door":"refrigerator door"});let T=n==="tall_refrigerator"?[["fridge",["ref2_door_ajar"],"ref2"],["fridge",[],null]]:n==="tall_freezer"?[["freezer",[],null]]:n==="tall_over_under"?[["freezer",["frz_door_ajar"],"frz"],["freezer",[],null]]:e.drawers==="refrigerator"?[["fridge",["ref_door_ajar"],"ref"],["fridge",["ref2_door_ajar"],"ref2"]]:e.drawers==="freezer"?[["freezer",["frz_door_ajar"],"frz"],["freezer",[],null]]:[["fridge",["ref_door_ajar"],"ref"],["freezer",["frz_door_ajar"],"frz"]];y(v,s.x0,s.x1,T);break}case"undercounter_refrigerator":case"undercounter_beverage":case"undercounter_wine":case"ice_maker":{let b=h(s.x0,s.x1,s.y0,s.y1),_=n==="undercounter_wine",v=n==="undercounter_beverage",k=_||(v||n==="undercounter_refrigerator")&&e.glass,x=k?sn(b,"undercounter"):null,z=_&&l?2:null,S=x?x.x+x.w/2:void 0;u({kind:"door",rect:b,hinge:_||v?"left":"right",handle:"edge",window:x,contents:_?"wine":v?"beverage":n==="ice_maker"?"ice":k?"food":"fridge",keys:_?["wine_door_ajar","wine2_door_ajar"]:v?["ref_door_ajar","wine_door_ajar"]:n==="ice_maker"?["ice_door_ajar"]:["ref_door_ajar"],zones:_?qi(x,{count:6,split:z}):n==="ice_maker"?[]:[x?{zone:"ref",top:x.y+4,x:S}:{zone:"ref",at:.2}],racks:_?{count:6,split:z}:null,name:n==="ice_maker"?"ice maker door":_?"wine door":"door"});break}case"undercounter_drawers":{let b=Rn(s.y0,s.y1,[134]),_=e.drawers==="freezer"?[["freezer",["frz_door_ajar"],"frz"],["freezer",[],null]]:e.drawers==="combination"?[["fridge",["ref_door_ajar"],"ref"],["freezer",["frz_door_ajar"],"frz"]]:[["fridge",["ref_door_ajar"],"ref"],["fridge",["ref2_door_ajar"],"ref2"]];y(b,s.x0,s.x1,_);break}}let $=n==="undercounter_drawers"&&e.drawers==="freezer"?"Freezer drawers":n==="undercounter_drawers"&&e.drawers==="combination"?"Refrigerator and freezer drawers":gh[n];return{w:i,h:a,line:t,undercounter:o,top:s.top,grille:s.grille,band:s.band,span:{y0:s.y0,y1:s.y1},kick:s.kick,frame:s.frame,fronts:p,depth:o?200:225,internalDispenser:e.dispenser==="internal",name:$}}var bh={back:"#eef2f3",side:"#e3e8ea",ceiling:"#d3d9dc",floor:"#e9edef",led:"#ffffff",glare:.5},vh={back:"#3a302a",side:"#463a33",ceiling:"#2c2520",floor:"#302822",led:"#fff1d8",glare:.2},wh={back:"#4e5357",side:"#5a5f63",ceiling:"#44484b",floor:"#5f6366",led:"#eef6ff",glare:.25},Bt=(e,t,n,o)=>f`<g transform=${`translate(${c(e)} ${c(t)}) scale(${Math.round(n*1e3)/1e3})`}>${o}</g>`,Yc=(e,t,n="")=>f`<rect x=${c(e.x)} y=${c(e.y)} width=${c(e.w)} height=${c(e.h)} fill=${t} style=${n} />`,bt=e=>f`<ellipse cx="0" cy="-0.6" rx=${c(e*.56)} ry=${c(Math.max(1.4,e*.07))} fill="#000" opacity="0.18" />`;function Sr(e,t){let{w:n,h:o}=e,r=n*(e.tall?.3:.42),i=o*(e.tall?.6:.68),a=n*.14,s=`M${c(-n/2)} ${c(-a)}V${c(-i+n*.3)}C${c(-n/2)} ${c(-i-n*.1)} ${c(-r/2)} ${c(-i-o*.06)} ${c(-r/2)} ${c(-o*.83)}V${c(-o*.94)}H${c(r/2)}V${c(-o*.83)}C${c(r/2)} ${c(-i-o*.06)} ${c(n/2)} ${c(-i-n*.1)} ${c(n/2)} ${c(-i+n*.3)}V${c(-a)}Q${c(n/2)} 0 ${c(n/2-a)} 0H${c(-n/2+a)}Q${c(-n/2)} 0 ${c(-n/2)} ${c(-a)}Z`,l=-o*(e.tall?.7:.78),p=e.liquid?f`<rect x=${c(-n/2+.8)} y=${c(l)} width=${c(n-1.6)} height=${c(-l-1)} rx=${c(a)} fill=${e.liquid} />`:w,d=e.label?f`<rect x=${c(-n/2)} y=${c(-i*.82)} width=${c(n)} height=${c(i*.44)} fill=${e.label} /><rect x=${c(-n/2)} y=${c(-i*.62)} width=${c(n)} height=${c(i*.08)} fill="#000" opacity="0.12" />`:w;return f`${bt(n)}${p}<path d=${s} fill=${e.glass} fill-opacity=${e.glassOpacity} />${d}<rect x=${c(-r/2-.6)} y=${c(-o)} width=${c(r+1.2)} height=${c(o*.075)} rx="1" fill=${e.cap} /><path d=${s} fill=${t.ref("cyl")} /><path d=${`M${c(-n*.22)} ${c(-o*.12)}V${c(-i*.9)}`} stroke="#fff" stroke-opacity="0.38" stroke-width=${c(n*.06)} stroke-linecap="round" />`}function Xc(e,t,n,o,r){return f`${bt(e)}<rect x=${c(-e/2)} y=${c(-t*.86)} width=${c(e)} height=${c(t*.86)} rx=${c(e*.16)} fill=${n} /><rect x=${c(-e/2)} y=${c(-t*.86)} width=${c(e)} height=${c(t*.86)} rx=${c(e*.16)} fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-opacity="0.3" stroke-width="0.7" /><rect x=${c(-e*.45)} y=${c(-t)} width=${c(e*.9)} height=${c(t*.17)} rx="1.4" fill=${o} /><rect x=${c(-e*.45)} y=${c(-t)} width=${c(e*.9)} height=${c(t*.17)} rx="1.4" fill=${r.ref("cyl")} /><rect x=${c(-e/2)} y=${c(-t*.86)} width=${c(e)} height=${c(t*.86)} rx=${c(e*.16)} fill=${r.ref("cyl")} opacity="0.7" />`}function kh(e,t,n,o,r){let i=Array.from({length:6},(a,s)=>{let l=-e/2+6+(s+r()*.6)*((e-12)/6);return f`<ellipse cx=${c(l)} cy=${c(-t*.32)} rx=${c(e*.11)} ry=${c(t*.24)} fill=${n[s%n.length]} />`});return f`${bt(e)}${i}<rect x=${c(-e/2)} y=${c(-t*.86)} width=${c(e)} height=${c(t*.86)} rx="2.5" fill="#f4f8fa" fill-opacity="0.4" stroke="#ffffff" stroke-opacity="0.5" stroke-width="0.7" /><rect x=${c(-e/2-1)} y=${c(-t)} width=${c(e+2)} height=${c(t*.16)} rx="2" fill=${o} /><path d=${`M${c(-e/2+2)} ${c(-t*.7)}H${c(e/2-2)}`} stroke="#fff" stroke-opacity="0.4" stroke-width="0.7" />`}function xh(e,t,n,o){return f`${bt(e)}<path d=${`M${c(-e/2)} 0V${c(-t*.8)}L${c(-e*.3)} ${c(-t*.96)}H${c(e*.3)}L${c(e/2)} ${c(-t*.8)}V0Z`} fill=${n} /><rect x=${c(-e*.32)} y=${c(-t)} width=${c(e*.64)} height=${c(t*.05)} fill=${n} /><rect x=${c(-e/2)} y=${c(-t*.58)} width=${c(e)} height=${c(t*.24)} fill=${o} /><rect x=${c(e*.08)} y=${c(-t*.8)} width=${c(e*.42)} height=${c(t*.8)} fill="#000" opacity="0.1" />`}function zh(e,t,n){let o=t==="grapes"?["#a3b768","#93a85a","#b0c178"]:t==="oranges"?["#d9904a","#e09c55"]:["#9e3f4a","#4a4670","#ad4a55"],r=t==="oranges"?e*.16:t==="grapes"?e*.065:e*.07,i=[],a=t==="oranges"?5:16;for(let l=0;l<a;l++){let p=n(),d=(p-.5)*e*.7,u=-e*.28-n()*(e*.22)*Math.sin(p*Math.PI)-r*.4,h=o[Math.floor(n()*o.length)];i.push(f`<circle cx=${c(d)} cy=${c(u)} r=${c(r)} fill=${h} /><circle cx=${c(d+r*.25)} cy=${c(u+r*.2)} r=${c(r*.8)} fill="#000" opacity="0.12" /><circle cx=${c(d-r*.3)} cy=${c(u-r*.35)} r=${c(r*.28)} fill="#fff" opacity="0.28" />`)}let s=`M${c(-e/2)} ${c(-e*.3)}H${c(e/2)}C${c(e*.46)} ${c(-e*.08)} ${c(e*.2)} 0 0 0C${c(-e*.2)} 0 ${c(-e*.46)} ${c(-e*.08)} ${c(-e/2)} ${c(-e*.3)}Z`;return f`${bt(e*.7)}${i}<path d=${s} fill="#efe9df" /><path d=${s} fill="#000" opacity="0.06" /><path d=${`M${c(-e/2)} ${c(-e*.3)}H${c(e/2)}`} stroke="#fff" stroke-width="1.2" stroke-opacity="0.9" />`}function Sh(e){let t=Array.from({length:5},(n,o)=>{let r=-e/2+(o+.5)*(e/5);return f`<ellipse cx=${c(r)} cy=${c(-9)} rx=${c(e/11)} ry="8" fill="#d6b08e" /><ellipse cx=${c(r-e/40)} cy=${c(-12)} rx=${c(e/40)} ry="2.6" fill="#fff" opacity="0.3" />`});return f`${bt(e)}${t}<rect x=${c(-e/2)} y="-8" width=${c(e)} height="8" rx="1.5" fill="#f2f5f6" fill-opacity="0.6" stroke="#fff" stroke-opacity="0.6" stroke-width="0.7" />`}function Rh(e,t,n){return f`${bt(e)}<path d=${`M${c(-e/2)} ${c(-t)}H${c(e/2)}L${c(e*.4)} 0H${c(-e*.4)}Z`} fill="#f3f1eb" /><rect x=${c(-e/2-.5)} y=${c(-t-1.5)} width=${c(e+1)} height="2.6" rx="1" fill=${n} /><path d=${`M${c(e*.12)} ${c(-t)}L${c(e*.1)} 0`} stroke="#000" stroke-opacity="0.08" stroke-width=${c(e*.3)} />`}function jc(e,t,n,o,r){let i=Math.min(6,t*.16),a=Math.min(5,e*.1),s=`M${c(-e/2)} 0V${c(-t)}H${c(e/2-a)}V0Z`,l=`M${c(-e/2)} ${c(-t)}L${c(-e/2+a)} ${c(-t-i)}H${c(e/2)}L${c(e/2-a)} ${c(-t)}Z`,p=`M${c(e/2-a)} 0V${c(-t)}L${c(e/2)} ${c(-t-i)}V${c(-i)}Z`,d=(e-a)*(.4+r()*.25),u=-e/2+3+r()*(e-a-d-6);return f`${bt(e)}<path d=${s} fill=${n} /><path d=${l} fill=${n} /><path d=${l} fill="#fff" opacity="0.14" /><path d=${p} fill=${n} /><path d=${p} fill="#000" opacity="0.15" /><rect x=${c(u)} y=${c(-t*.62)} width=${c(d)} height=${c(t*.3)} rx="0.8" fill=${o} /><path d=${`M${c(-e/2)} ${c(-t+.5)}H${c(e/2-a)}`} stroke="#fff" stroke-opacity="0.45" stroke-width="0.7" />`}function Ah(e,t,n,o){let r=Array.from({length:9},(a,s)=>`${c(-e/2+s*e/8)} ${c(-t-(s%2?2:0))}`).join(" L"),i=Array.from({length:10},()=>{let a=(o()-.5)*e*.8,s=-t*(.15+o()*.55);return f`<circle cx=${c(a)} cy=${c(s)} r=${c(e*.06)} fill=${n} />`});return f`${bt(e)}<path d=${`M${c(-e/2)} 0V${c(-t)} L${r}V0Z`} fill="#dfe6ea" />${i}<path d=${`M${c(-e/2)} 0V${c(-t)} L${r}V0Z`} fill="#f2f6f8" fill-opacity="0.5" /><path d=${`M${c(-e/2)} ${c(-t*.84)}H${c(e/2)}`} stroke="#9aa6ad" stroke-opacity="0.5" stroke-width="0.8" /><path d=${`M${c(e*.3)} ${c(-t)}V0`} stroke="#000" stroke-opacity="0.06" stroke-width=${c(e*.25)} />`}function Qc(e,t,n,o,r){return f`${bt(e)}<rect x=${c(-e/2)} y=${c(-t)} width=${c(e)} height=${c(t)} rx=${c(e*.1)} fill=${n} /><rect x=${c(-e/2)} y=${c(-t*.66)} width=${c(e)} height=${c(t*.34)} fill=${o} /><rect x=${c(-e/2+.8)} y=${c(-t-.6)} width=${c(e-1.6)} height="3" rx="1.2" fill="#c3c7ca" /><rect x=${c(-e/2)} y=${c(-t)} width=${c(e)} height=${c(t)} rx=${c(e*.1)} fill=${r.ref("cyl")} /><path d=${`M${c(-e/2+e*.3)} ${c(-t+3)}V${c(-2)}`} stroke="#fff" stroke-opacity="0.5" stroke-width="1" />`}var Oe=(e,t)=>t[Math.floor(e()*t.length)];function Xi(e){return[()=>({w:28,h:96,draw:Sr({w:28,h:96,glass:"#e8f0f2",glassOpacity:.35,liquid:"#e2a446",cap:"#4a6f45",label:"#f1ead8"},e)}),()=>({w:32,h:84,draw:xh(32,84,"#f4f4f0","#7a93b0")}),t=>({w:24,h:36,draw:Xc(24,36,Oe(t,["#7a3a3f","#6f7a3c","#a8573a","#c79a45"]),Oe(t,["#c2a45c","#b9bec2","#3a3e42"]),e)}),t=>({w:62,h:28,draw:kh(62,28,Oe(t,[["#7a9a52","#93ad62"],["#dcc493","#cdb27a"],["#b75a48","#c97a52"]]),Oe(t,["#7d93ad","#8faa92","#d8dde0"]),t)}),t=>({w:66,h:42,draw:zh(66,Oe(t,["grapes","oranges","berries"]),t)}),()=>({w:30,h:116,draw:Sr({w:30,h:116,glass:"#33463a",glassOpacity:1,liquid:null,cap:"#cdbb8c",label:"#ece5d2",tall:!0},e)}),t=>({w:22,h:24,draw:Rh(22,24,Oe(t,["#7d93ad","#b0646c","#d6b25e"]))}),()=>({w:26,h:92,draw:Sr({w:26,h:92,glass:"#dfeaf0",glassOpacity:.45,liquid:"#e8eef1",cap:"#4f6f96",label:"#8ea3bd"},e)}),()=>({w:72,h:20,draw:Sh(72),single:!0})]}var Uc=[["#ecebe7","#a8786c"],["#c9b08a","#efe9dc"],["#f1f0ec","#7d93ab"],["#d6c2a0","#8a6a50"],["#e6e3dc","#86a07c"],["#f3f2ee","#c2a67a"]];function ro(e){return[t=>{let[n,o]=Oe(t,Uc);return{w:54,h:34,draw:jc(54,34,n,o,t)}},t=>{let[n,o]=Oe(t,Uc);return{w:40,h:56,draw:jc(40,56,n,o,t)}},t=>({w:50,h:42,draw:Ah(50,42,Oe(t,["#86a35e","#bfa36e","#a65a52","#d9d0b8"]),t)}),t=>({w:32,h:34,draw:Xc(32,34,Oe(t,["#efe6d2","#6e4a3a","#dcb3b8"]),"#f2efe8",e)})]}var An=[["#c9ccce","#e3b7b9"],["#d7d9db","#a9d3c0"],["#cfd2d4","#d9c48a"],["#e8e8e4","#8fa7c4"],["#b9bcbf","#f0ece4"],["#2f3b4a","#c9ccce"]];function Jc(e,t,n,o,r,i,a,s,l=new Set){let p=st(s),d=et(e.inside,a),u=[],h=n+5+p()*10,g=0;for(;h<o-20&&g++<40;){let y=Math.floor(p()*t.length),$=t[y](p);if($.h>i||h+$.w>o-4||$.single&&l.has(y)){h+=6;continue}$.single&&l.add(y);let[b,_]=tt(e.inside,h+$.w/2,r,a);u.push(Bt(b,_,d,$.draw)),h+=$.w+2+p()*10}return u}function Mh(e,t,n){let o=e.layout.depth,r=(v,k)=>tt(e.inside,v,k,-o),i=[t.x,t.y],a=[t.x+t.w,t.y],s=[t.x+t.w,t.y+t.h],l=[t.x,t.y+t.h],p=r(t.x,t.y),d=r(t.x+t.w,t.y),u=r(t.x+t.w,t.y+t.h),h=r(t.x,t.y+t.h),g={x:p[0],y:p[1],w:d[0]-p[0],h:h[1]-p[1]},y=[i,p,h,l],$=[d,a,s,u],b=[i,a,d,p],_=[h,u,s,l];return f`<path d=${X([p,d,u,h])} fill=${n.back} />
    ${Yc(g,e.ref("shadeDown"))}
    <path d=${X(y)} fill=${n.side} /><path d=${X(y)} fill=${e.ref("depthL")} />
    <path d=${X($)} fill=${n.side} /><path d=${X($)} fill=${e.ref("depthR")} />
    <path d=${X(b)} fill=${n.ceiling} /><path d=${X(b)} fill=${e.ref("depthT")} />
    <path d=${X(_)} fill=${n.floor} /><path d=${X(_)} fill=${e.ref("depthB")} />
    <path d=${`M${c(p[0])} ${c(p[1])}V${c(h[1])}H${c(u[0])}V${c(d[1])}Z`} fill="none" stroke="#000" stroke-opacity="0.1" stroke-width="1.6" />`}function Th(e,t,n,o){let r={x:t.x+8,y:t.y+2.5,w:t.w-16,h:3.4},i=o?[t.x+2,t.x+t.w-5.5].map(a=>f`<rect x=${c(a-3)} y=${c(t.y+12)} width="9" height=${c(t.h-30)} fill=${n.led} opacity="0.5" filter=${e.ref("blur")} />
          <rect x=${c(a)} y=${c(t.y+12)} width="3.4" height=${c(t.h-30)} rx="1.7" fill=${n.led} />`):w;return f`<rect x=${c(r.x)} y=${c(r.y-2)} width=${c(r.w)} height=${c(r.h+6)} fill=${n.led} opacity="0.6" filter=${e.ref("blur")} />
    <rect x=${c(r.x)} y=${c(r.y)} width=${c(r.w)} height=${c(r.h)} rx="1.7" fill=${n.led} />
    ${i}
    ${Yc({x:t.x,y:t.y,w:t.w,h:t.h*.5},e.ref("glare"),`opacity:${n.glare}`)}`}function Rr(e,t,n){let o=e.layout.depth,r=tt(e.inside,t.x+1,n,-14),i=tt(e.inside,t.x+t.w-1,n,-14),a=tt(e.inside,t.x+1,n,-o+8),s=tt(e.inside,t.x+t.w-1,n,-o+8),l=et(e.inside,-14);return{under:f`<path d=${X([a,s,i,r])} fill="#ffffff" fill-opacity="0.3" stroke="#ffffff" stroke-opacity="0.45" stroke-width="0.8" /><path d=${X([r,i,[i[0],i[1]+7],[r[0],r[1]+7]])} fill="#000" opacity="0.06" />`,trim:f`<rect x=${c(r[0])} y=${c(r[1]-1)} width=${c(i[0]-r[0])} height=${c(7*l)} fill="#b3b8bb" /><rect x=${c(r[0])} y=${c(r[1]+2.5*l)} width=${c(i[0]-r[0])} height=${c(3.5*l)} fill="#8e9497" /><path d=${`M${c(r[0])} ${c(r[1]-.6)}H${c(i[0])}`} stroke="#fff" stroke-opacity="0.95" stroke-width="1.1" /><path d=${`M${c(r[0])} ${c(r[1]+7*l-1)}H${c(i[0])}`} stroke="#000" stroke-opacity="0.3" stroke-width="0.9" />`}}var Ch=[["#7a9558","#6d884d"],["#93ad70","#85a062"],["#aac487","#9db87a"]],Gh=["#435b40","#4e6849","#5a7554"],Kc=["#4f6e3f","#5b7b48","#678753","#729160"];function Ar(e,t,n,o){let r=o*Math.PI/180,i=Math.cos(r),a=Math.sin(r);return e.map(([s,l])=>[t+(s-t)*i-(l-n)*a,n+(s-t)*a+(l-n)*i])}function Wc(e,t,n,o,r,i,a){let s=[],l=[];for(let g=1;g<9;g++){let y=g/9,$=n/2*Math.pow(Math.sin(Math.PI*(.08+.92*y)*.5),.6)*Math.sqrt(1-Math.pow(Math.max(0,y-.72)/.3,2))*(.9+a()*.14),b=t-o*y;s.push([e-$,b+(a()-.5)*o*.035]),l.unshift([e+$,b+(a()-.5)*o*.035])}let d=[e+(a()-.5)*n*.1,t-o],u=X(Ar([[e,t],...s,d,...l],e,t,r)),h=X(Ar([[e,t],d,...l],e,t,r));return f`<path d=${u} fill=${i} stroke=${i} stroke-width="0.6" stroke-linejoin="round" /><path d=${h} fill="#000" opacity="0.17" />`}function Eh(e,t,n,o,r,i,a){let s=[];for(let d=0;d<=18;d++){let u=d/18*Math.PI,h=d%2?.84+a()*.1:1;s.push([e-Math.cos(u)*(n/2)*Math.sin(u*.5+.6)*h,t-Math.sin(u)*o*.95*h-(1-Math.abs(Math.cos(u)))*o*.05])}let p=Ar([[e,t],...s.slice(18/2)],e,t,r);return f`<path d=${X(Ar(s,e,t,r))} fill=${i} /><path d=${X(p)} fill="#000" opacity="0.16" />`}function Dh(e,t,n,o){let r=[];for(let i=0;i<9;i++){let a=Math.PI*(.05+o()*.9),s=n*(.35+o()*.55),l=e-Math.cos(a)*s,p=t-Math.sin(a)*s*.8,d=n*(.32+o()*.14);r.push(f`<circle cx=${c(l)} cy=${c(p)} r=${c(d)} fill=${Oe(o,["#56704a","#4a6340","#5e7a50"])} /><circle cx=${c(l-d*.3)} cy=${c(p-d*.35)} r=${c(d*.35)} fill="#7f9a68" opacity="0.55" />`)}return f`<path d=${`M${c(e-n*.3)} ${c(t+n*1.3)}L${c(e-n*.22)} ${c(t)}H${c(e+n*.22)}L${c(e+n*.3)} ${c(t+n*1.3)}Z`} fill="#a7b98c" />
    <circle cx=${c(e)} cy=${c(t)} r=${c(n)} fill="#4e6943" />
    ${r}
    <path d=${`M${c(e)} ${c(t-n)}A${c(n)} ${c(n)} 0 0 1 ${c(e)} ${c(t+n)}Z`} fill="#000" opacity="0.15" />`}function ep(e,t,n,o,r,i){let a=[],s=n-t,l=t+s/2;if(e==="lettuce"||e==="kale"||e==="spinach"){let d=e==="spinach";return(d?[.9,.78,.62,.46]:[.95,.8,.62]).forEach((u,h)=>{let g=r*u*(d?.7:1),y=g*(e==="kale"?.5:d?.8:.56),$=Math.max(2,Math.ceil(s/(y*.5)));for(let b=0;b<$;b++){let _=t+(b+.5)*s/$+(i()-.5)*y*.35,v=g*(.82+i()*.22),k=y*(.85+i()*.25),x=(_-l)/s*36+(i()-.5)*18,z=o-(d?r*.32*(h/3):0);a.push(e==="kale"?Eh(_,z,k,v,x,Gh[h],i):Wc(_,z,k,v,x,d?Kc[h%Kc.length]:Ch[h][Math.floor(i()*2)],i))}}),a}if(e==="broccoli"){let d=Math.min(r*.3,s*.2);return[.66,.36].forEach((u,h)=>{for(let g=t+d*(h?1.4:.9);g<n-d*.5;g+=d*1.75)a.push(Dh(g,o-r*u,d*(h?1.05:.95),i))}),a}if(e==="radish"){for(let u=t+s*.12;u<n;u+=s*.2)a.push(Wc(u,o-r*.3,r*.36,r*.7,(i()-.5)*50,Oe(i,["#6f8b56","#7d9862","#65804e"]),i));let d=Math.round(s/4.2);for(let u=0;u<d;u++){let h=Math.min(5,r*.17)*(.7+i()*.45),g=t+h+i()*(s-2*h),y=o-h-i()*r*.42;a.push(f`<circle cx=${c(g)} cy=${c(y)} r=${c(h)} fill=${Oe(i,["#b04a5a","#bd5868","#a8424f","#c06474"])} /><path d=${`M${c(g-h*.6)} ${c(y+h*.55)}Q${c(g)} ${c(y+h*1.25)} ${c(g+h*.6)} ${c(y+h*.55)}`} fill="#efe6e2" /><path d=${`M${c(g)} ${c(y-h)}A${c(h)} ${c(h)} 0 0 1 ${c(g)} ${c(y+h)}Z`} fill="#000" opacity="0.16" /><circle cx=${c(g-h*.35)} cy=${c(y-h*.35)} r=${c(h*.28)} fill="#fff" opacity="0.25" />`)}return a}if(e==="herbs"){for(let d=t+2;d<n-1;d+=2.1+i()*1.2){let u=r*(.8+i()*.2),h=(d-l)*.12+(i()-.5)*3;a.push(f`<path d=${`M${c(d)} ${c(o)}L${c(d+h)} ${c(o-u)}`} stroke=${Oe(i,["#8ea36a","#7f965e","#9aae78"])} stroke-width="2.3" stroke-linecap="round" /><path d=${`M${c(d+h*.9)} ${c(o-u*.9)}L${c(d+h)} ${c(o-u)}`} stroke="#5c7044" stroke-width="2.5" stroke-linecap="round" />`)}return a}let p=Math.min(r*.21,s*.14);for(let d=0;d<3;d++)for(let u=t+p*(d%2?1.9:1)+i()*p*.4;u<n-p*.6;u+=p*(1.95+i()*.3)){let h=o-p-d*p*1.5-(i()-.5)*p*.5,g=Oe(i,["#d98f46","#e09a52","#d6bf5c"]);a.push(f`<circle cx=${c(u)} cy=${c(h)} r=${c(p)} fill=${g} /><circle cx=${c(u+p*.28)} cy=${c(h+p*.25)} r=${c(p*.78)} fill="#000" opacity="0.13" /><circle cx=${c(u-p*.35)} cy=${c(h-p*.38)} r=${c(p*.25)} fill="#fff" opacity="0.3" />`)}return a}var Zc=[["lettuce","herbs","spinach"],["lettuce","radish","broccoli"],["kale","citrus","spinach"],["kale","lettuce","spinach"]];function tp(e,t,n,o,r){let i=3*t,a=e.w*.22,s=Math.max(4,e.h*.18),l=e.x+(e.w-a)/2,p=n?[1,2].map(d=>f`<rect x=${c(e.x+e.w*d/3-.6)} y=${c(e.y+i)} width="1.2" height=${c(e.h-i)} fill="#fff" opacity="0.5" />`):w;return f`<g>
    <rect x=${c(e.x)} y=${c(e.y)} width=${c(e.w)} height=${c(e.h)} rx="2" fill="#000" opacity="0.05" />
    <clipPath id=${r}><rect x=${c(e.x)} y=${c(e.y-4)} width=${c(e.w)} height=${c(e.h+4)} /></clipPath>
    <g clip-path=${`url(#${r})`}>${o}</g>
    <rect x=${c(e.x)} y=${c(e.y+e.h*.35)} width=${c(e.w)} height=${c(e.h*.65)} fill="#fff" opacity="0.35" />
    <rect x=${c(e.x)} y=${c(e.y)} width=${c(e.w)} height=${c(e.h)} rx="2" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="0.8" />
    <rect x=${c(e.x)} y=${c(e.y)} width=${c(e.w)} height=${c(i)} fill="#fff" opacity="0.6" />
    ${p}
    <rect x=${c(l)} y=${c(e.y+i*.6)} width=${c(a)} height=${c(s)} rx="1" fill="#fff" fill-opacity="0.3" stroke="#9aa3a8" stroke-width="1.2" />
    <path d=${`M${c(e.x+2)} ${c(e.y+e.h-.8)}H${c(e.x+e.w-2)}`} stroke="#fff" stroke-opacity="0.8" stroke-width="1" />
  </g>`}function np(e){if(e.h<=260)return null;let t=e.h>520;return{top:e.y+e.h*(t?.63:.73),count:t?4:2}}function Qi(e,t,n,o,r){let i=(o-n)/r;return Array.from({length:r},(a,s)=>Nt(e.inside,{x:t.x+5,y:n+s*i+3,w:t.w-10,h:i-5},-18))}function op(e,t){if(t.contents!=="fridge"&&t.contents!=="food")return[];let n=np(t.cavity);return n?Qi(e,t.cavity,n.top,t.cavity.y+t.cavity.h*.995,n.count):[]}function Ph(e,t,n,o,r,i,a){let s=st(i);return Qi(e,t,n,o,r).map((l,p)=>{let d=Zc[p%Zc.length],u=l.y+l.h-2,h=d.map((g,y)=>{let $=l.x+l.w*y/3+1.5,b=l.w/3-3,_=`${a}b${p}s${y}`;return f`<clipPath id=${_}><rect x=${c($)} y=${c(l.y-3)} width=${c(b)} height=${c(l.h+3)} /></clipPath><g clip-path=${`url(#${_})`}>${ep(g,$+1,$+b-1,u,l.h*.92,s)}<rect x=${c($)} y=${c(l.y-3)} width=${c(b)} height=${c(l.h+3)} fill=${e.ref("binLight")} /></g>`});return tp(l,et(e.inside,-18),!0,h,`${a}b${p}`)})}function Lh(e,t,n,o,r,i,a){let s=st(i),p=et(e.inside,-58),d=ro(e);return Qi(e,t,n,o,r).map((u,h)=>{let g=[];return[.3,0].forEach((y,$)=>{let b=u.y+u.h-2-u.h*y,_=u.h*($?.95:.7);for(let v=u.x+4+$*12*p;v<u.x+u.w-26*p;v+=(36+s()*10)*p){let k=d[Math.floor(s()*3)](s),x=Math.min(p*($?1:.9),_/k.h);g.push(Bt(v+k.w/2*x,b,x,k.draw))}}),tp(u,et(e.inside,-18),!1,g,`${a}b${h}`)})}function Oh(e,t,n,o){let r=t.cavity,i=r.h>520,a=r.h>260,s=np(r),l=s?(s.top-r.y)/r.h:1,p=i?4:a?3:2,d=a?.17:.38,u=l<1?l-.12:.72,h=Array.from({length:p},(k,x)=>r.y+r.h*(d+(u-d)*x/Math.max(1,p-1)));l<1&&h.push(r.y+r.h*l);let g=e.layout.internalDispenser&&i&&t.contents==="fridge",y=Nt(e.inside,{x:r.x+1,y:r.y+r.h*.2,w:Math.min(50,r.w*.17),h:r.h*.25},-26),$=Xi(e),b=new Set,_=[];h.forEach((k,x)=>{let z=x?h[x-1]:r.y+r.h*.03,S=g&&k>y.y&&z<y.y+y.h,R=Rr(e,r,k);_.push(R.under),_.push(...Jc(e,$,S?y.x+y.w+6:r.x,r.x+r.w,k,(k-z)*.8,-62,n*31+x,b)),_.push(R.trim)});let v=g?f`<rect x=${c(y.x+2)} y=${c(y.y+3)} width=${c(y.w)} height=${c(y.h)} rx="2" fill="#000" opacity="0.16" filter=${e.ref("blur")} />
        <rect x=${c(y.x)} y=${c(y.y)} width=${c(y.w)} height=${c(y.h)} rx="2.5" fill="#f3f5f6" />
        <rect x=${c(y.x+y.w-4)} y=${c(y.y)} width="4" height=${c(y.h)} rx="2" fill="#000" opacity="0.08" />
        <rect x=${c(y.x+y.w*.12)} y=${c(y.y+y.h*.24)} width=${c(y.w*.76)} height=${c(y.h*.6)} rx="2" fill="#dfe4e7" />
        <path d=${`M${c(y.x+y.w*.5)} ${c(y.y+y.h*.3)}V${c(y.y+y.h*.78)}`} stroke="#9aa3a8" stroke-width="1.2" />
        <rect x=${c(y.x+y.w*.22)} y=${c(y.y+y.h*.08)} width=${c(y.w*.14)} height=${c(y.w*.14)} rx="0.6" fill="none" stroke="#7d878d" stroke-width="0.8" />
        <path d=${`M${c(y.x+y.w*.7)} ${c(y.y+y.h*.07)}c2 3 3 4 3 5a3 3 0 0 1 -6 0c0 -1 1 -2 3 -5z`} fill="none" stroke="#7d878d" stroke-width="0.8" />`:w;return f`${_}${v}${s?Ph(e,r,s.top,r.y+r.h*.995,s.count,n,o):w}`}function Vh(e,t,n){let o=Nt(e.inside,{x:t.x+t.w*.36,y:t.y+t.h*.03,w:t.w*.58,h:t.h*.22},-40),r={x:o.x+o.w*.12,y:o.y+o.h*.42,w:o.w*.76,h:o.h*.4};return f`<rect x=${c(o.x+2)} y=${c(o.y+3)} width=${c(o.w)} height=${c(o.h)} rx="2.5" fill="#000" opacity="0.2" filter=${e.ref("blur")} />
    <rect x=${c(o.x)} y=${c(o.y)} width=${c(o.w)} height=${c(o.h)} rx="2.5" fill="#d9dee1" stroke="#a3adb3" stroke-width="0.8" />
    <rect x=${c(o.x)} y=${c(o.y)} width=${c(o.w)} height=${c(o.h*.3)} rx="2.5" fill="#fff" opacity="0.4" />
    <rect x=${c(o.x)} y=${c(o.y+o.h-3.5)} width=${c(o.w)} height="3.5" rx="1.5" fill="#000" opacity="0.16" />
    <rect x=${c(r.x)} y=${c(r.y)} width=${c(r.w)} height=${c(r.h)} rx="1.5" fill="#9eabb3" />
    <g opacity="0.25">${rp(e,r,n,!1,11)}</g>
    <rect x=${c(r.x)} y=${c(r.y)} width=${c(r.w)} height=${c(r.h)} rx="1.5" fill="#eef3f5" fill-opacity="0.35" stroke="#8f9aa1" stroke-width="0.8" />
    <rect x=${c(r.x)} y=${c(r.y)} width=${c(r.w)} height=${c(r.h*.22)} rx="1.5" fill="#fff" opacity="0.3" />
    <rect x=${c(o.x+o.w*.12)} y=${c(o.y+o.h*.14)} width=${c(o.w*.3)} height=${c(Math.max(2,o.h*.08))} rx="1" fill="#aeb7bc" />`}function Hh(e,t,n,o){let r=t.cavity,i=r.h>520,a=i?.6:.66,s=t.ice,l=(s?[.32,.46]:[.2,.34,.47]).map(u=>r.y+r.h*u).concat([r.y+r.h*a]),p=[];s&&p.push(Vh(e,r,n));let d=ro(e);return l.forEach((u,h)=>{let g=h?l[h-1]:r.y+r.h*(s?.27:.03),y=Rr(e,r,u);p.push(y.under),p.push(...Jc(e,d,r.x,r.x+r.w,u,(u-g)*.78,-58,n*17+h)),p.push(y.trim)}),f`${p}${Lh(e,r,r.y+r.h*a,r.y+r.h*.995,i?3:2,n+3,o)}`}function rp(e,t,n,o,r=6){let i=st(n+11),a=[],s=Math.max(r,Math.min(12,t.w/10)),l=s*.78;for(let p=t.y+t.h-s*.4;p>t.y;p-=l*.8)for(let d=t.x+s*.3;d<t.x+t.w;d+=l){let u=(d-t.x)/t.w,h=t.y+t.h*(.32-.22*Math.sin(u*Math.PI))+i()*s*.6;if(p<h)continue;let g=s*(.75+i()*.4),y=d+(i()-.5)*s*.5,$=p+(i()-.5)*s*.4,b=(i()-.5)*40,_=.82+i()*.18;a.push(f`<rect x=${c(y-g/2)} y=${c($-g*.45)} width=${c(g)} height=${c(g*.9)} rx=${c(g*.22)} transform=${`rotate(${c(b)} ${c(y)} ${c($)})`} fill=${e.ref("ice")} opacity=${c(_*10)/10} />`)}return f`<g opacity=${o?.6:1}>${a}</g>`}function Ih(e,t,n,o){let r=t.cavity,i=t.racks??{count:6,split:null},{bars:a,divider:s}=Yi(n,i),l=st(o),p=["#8f7a45","#4a1520","#9a968a","#1b1b1b","#7d8083","#5e1822"],d=["#1d2a1e","#2b1d12","#141414","#22301f"],u=Math.max(3,Math.floor((r.w-8)/24.5)),h=(r.w-8)/u,g=[];if(a.forEach((y,$)=>{let b=[];for(let _=0;_<u;_++){let v=r.x+4+(_+.5)*h,k=y-5,x=d[Math.floor(l()*d.length)];b.push(($+_)%2===0?f`<circle cx=${c(v)} cy=${c(k)} r="13.5" fill=${x} /><circle cx=${c(v)} cy=${c(k)} r="9.5" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.4" /><circle cx=${c(v)} cy=${c(k)} r="5" fill="#000" opacity="0.35" /><ellipse cx=${c(v-5)} cy=${c(k-6.5)} rx="4" ry="2" fill="#fff" opacity="0.2" />`:f`<circle cx=${c(v)} cy=${c(k)} r="12" fill=${x} opacity="0.85" /><circle cx=${c(v)} cy=${c(k)} r="4.5" fill=${p[Math.floor(l()*p.length)]} stroke="#000" stroke-opacity="0.35" stroke-width="0.8" /><circle cx=${c(v-1.4)} cy=${c(k-1.5)} r="1.4" fill="#fff" opacity="0.25" />`)}g.push(f`${b}<rect x=${c(r.x+2)} y=${c(y)} width=${c(r.w-4)} height="15.5" rx="1" fill=${e.ref("wood")} /><path d=${`M${c(r.x+2)} ${c(y+.5)}H${c(r.x+r.w-2)}`} stroke="#fff" stroke-opacity="0.45" stroke-width="0.8" /><path d=${`M${c(r.x+2)} ${c(y+15.5)}H${c(r.x+r.w-2)}`} stroke="#000" stroke-opacity="0.5" stroke-width="1.2" />`)}),s){let y=r.x+r.w/2,$=s.y;g.push(f`<rect x=${c(r.x)} y=${c($)} width=${c(r.w)} height=${s.h} fill="#1b1612" />
      <path d=${`M${c(r.x)} ${c($+.6)}H${c(r.x+r.w)}`} stroke="#6a5a4c" stroke-width="1" />
      <rect x=${c(y-17)} y=${c($+6)} width="34" height="9" rx="1.5" fill="#090a0b" />
      <rect x=${c(y-12)} y=${c($+9.5)} width="24" height="2" rx="1" fill="#a9c8ff" opacity="0.6" />`)}return f`${g}`}var qc=[{w:24,h:90,glass:"#5a3a1c",glassOpacity:.95,liquid:null,cap:"#b9a36a",label:"#e4dccb"},{w:24,h:88,glass:"#4f3420",glassOpacity:.95,liquid:null,cap:"#8a8f93",label:"#c9b38c"},{w:26,h:100,glass:"#cfe0e4",glassOpacity:.45,liquid:"#e9efe9",cap:"#6f8a74",label:"#9fb9a6"},{w:26,h:96,glass:"#3d5a3e",glassOpacity:.9,liquid:null,cap:"#c9ccce",label:"#e9e6dc"},{w:30,h:116,glass:"#1f2a1c",glassOpacity:1,liquid:null,cap:"#6a2a30",label:"#ece5d2",tall:!0},{w:24,h:84,glass:"#d6e2e6",glassOpacity:.5,liquid:"#d9b26a",cap:"#30343a",label:"#2f3b4a"}];function Fh(e,t,n,o){let r=t.cavity,i=n[1]-n[0],a=b=>n[0]+i*b,s=st(o),l=Rr(e,r,a(.13)),p=Rr(e,r,a(.37)),d=-55,u=et(e.inside,d),h=[],g=r.x+7;for(;g<r.x+r.w-26;){let b=s()>.7,[_,v]=b?[21,60]:[25.5,48];if(g+_>r.x+r.w-5)break;let[k,x]=An[Math.floor(s()*An.length)],[z,S]=tt(e.inside,g+_/2,a(.37),d);h.push(Bt(z,S,u,Qc(_,v,k,x,e))),g+=_+1.5+s()*3}let y=[];for(g=r.x+6;g<r.x+r.w-28;){let b=qc[Math.floor(s()*qc.length)],_=.85+s()*.25,v={...b,h:Math.min(116,b.h*_)};if(g+v.w>r.x+r.w-4)break;let[k,x]=tt(e.inside,g+v.w/2,a(.75),-58);y.push(Bt(k,x,et(e.inside,-58),Sr(v,e))),g+=v.w+1+s()*4}let $=(b,_,v)=>{let k=st(v),x=a(_)-13,z=[];for(let S of[1,0]){let R=[],M=r.x+5+S*11+k()*4;for(;M<r.x+r.w-8;){let G=21+k()*3.5,T=a(b)+1.5-S*2.5+k()*1.5,[O,V]=An[Math.floor(k()*An.length)],Q=c(x-T+2);R.push(f`<rect x=${c(M)} y=${c(T)} width=${c(G)} height=${Q} fill=${k()>.45?V:O} /><rect x=${c(M)} y=${c(T)} width=${c(G)} height=${Q} fill=${e.ref("cyl")} /><ellipse cx=${c(M+G/2)} cy=${c(T)} rx=${c(G/2)} ry="1.8" fill="#c3c7ca" /><ellipse cx=${c(M+G/2)} cy=${c(T+.2)} rx=${c(G/2-2.2)} ry="1" fill="#8f969b" />`),M+=G+1+k()*2.5}z.push(f`<g opacity=${S?.7:1}>${R}</g>`)}return f`<rect x=${c(r.x+2)} y=${c(a(b)-5)} width=${c(r.w-4)} height=${c(a(_)-a(b)+5)} fill="#17130f" opacity="0.55" />
      ${z}
      ${[.4,.75].map(S=>f`<path d=${`M${c(r.x+4)} ${c(a(b)+(x-a(b))*S)}H${c(r.x+r.w-4)}`} stroke="#8a8279" stroke-opacity="0.35" stroke-width="0.6" />`)}
      <rect x=${c(r.x+2)} y=${c(x)} width=${c(r.w-4)} height="13" rx="1" fill=${e.ref("wood")} />
      <path d=${`M${c(r.x+2)} ${c(x+.5)}H${c(r.x+r.w-2)}`} stroke="#fff" stroke-opacity="0.45" stroke-width="0.8" />`};return f`${l.under}${l.trim}${p.under}${h}${p.trim}${y}${$(.77,.88,o+101)}${$(.9,1,o+202)}`}function Nh(e,t,n){let o=t.cavity,r=Nt(e.inside,{x:o.x+o.w*.12,y:o.y+o.h*.06,w:o.w*.76,h:o.h*.22},-120),i=Nt(e.inside,{x:o.x+4,y:o.y+o.h*.42,w:o.w-8,h:o.h*.56},-18);return f`<rect x=${c(r.x)} y=${c(r.y)} width=${c(r.w)} height=${c(r.h)} rx="1.5" fill="#a9aeb2" />
    ${Array.from({length:10},(a,s)=>f`<path d=${`M${c(r.x+(s+.5)*r.w/10)} ${c(r.y+2)}v${c(r.h-4)}`} stroke="#d9dde0" stroke-width="1.2" />`)}
    <rect x=${c(i.x)} y=${c(i.y)} width=${c(i.w)} height=${c(i.h)} rx="3" fill="#2a2d30" />
    ${rp(e,i,7,n)}
    <rect x=${c(i.x)} y=${c(i.y)} width=${c(i.w)} height=${c(i.h)} rx="3" fill="#dfe8ee" fill-opacity="0.1" stroke="#ffffff" stroke-opacity="0.35" stroke-width="0.8" />`}function Mr(e,t,n){let o=t.cavity,r=t.contents,i=r==="wine"||r==="beverage"?vh:r==="ice"?wh:bh,a=Math.round(o.x*7+o.y*13+o.w),s=e.id(`c${t.cavityId}${n.glass?`g${Math.round(t.rect.x)}`:""}`),l=t.window?[t.window.y,t.window.y+t.window.h]:[o.y,o.y+o.h],p=r==="fridge"||r==="food"?Oh(e,t,a,s):r==="freezer"?Hh(e,t,a,s):r==="wine"?Ih(e,t,l,a):r==="beverage"?Fh(e,t,l,a):Nh(e,t,n.state.ice_maker?.paused??!1);return f`<clipPath id=${s}><rect x=${c(o.x)} y=${c(o.y)} width=${c(o.w)} height=${c(o.h)} /></clipPath>
    <g clip-path=${`url(#${s})`}>
      ${Mh(e,o,i)}
      ${p}
      ${Th(e,o,i,r==="fridge"||r==="freezer"||r==="food")}
    </g>`}function ip(e,t,n,o){let r=st(n),i=[],a=2;for(let s=0;s<a;s++){let l=.8+.25*s,p=e.y+e.h*(.55+.45*s)+2;if(t==="freezer"){let d=ro(o);for(let u=e.x+26*l;u<e.x+e.w-24*l;u+=(50+r()*12)*l)i.push(Bt(u,p,l,d[Math.floor(r()*3)](r).draw))}else if(t==="beverage")for(let d=e.x+16*l;d<e.x+e.w-14*l;d+=28*l){let[u,h]=An[Math.floor(r()*An.length)];i.push(Bt(d,p,l,Qc(25,40,u,h,o)))}else{let d=["lettuce","broccoli","kale","citrus","lettuce","radish"],u=e.w/4;for(let h=0;h<4;h++){let g=e.x+h*u;i.push(...ep(d[(h+s*2+n)%d.length],g,g+u,p,30*l,r))}}}return f`${i}`}function sp(e){switch(e.finish){case"panel":{let t=/^#[0-9a-f]{6}$/i.test(e.panel_color??"")?e.panel_color:"#d9d4ca";return{kind:"panel",color:t,wood:jh(t)}}case"white":return{kind:"panel",color:"#f0efea",wood:!1};case"black":case"carbon":return{kind:"black",color:"#2b2d2f",wood:!1};default:return{kind:"stainless",color:"#c8c9ca",wood:!1}}}function lp(e){let t=parseInt(e.slice(1),16);return[t>>16&255,t>>8&255,t&255]}function Bh([e,t,n]){let o=r=>Math.round(Math.min(255,Math.max(0,r))).toString(16).padStart(2,"0");return`#${o(e)}${o(t)}${o(n)}`}function ln(e,t){let[n,o,r]=lp(e),i=t>=0?255:0,a=Math.abs(t);return Bh([n+(i-n)*a,o+(i-o)*a,r+(i-r)*a])}function jh(e){let[t,n,o]=lp(e).map(p=>p/255),r=Math.max(t,n,o),i=Math.min(t,n,o),a=(r+i)/2;if(r===i)return!1;let s=(r-i)/(1-Math.abs(2*a-1)),l=r===t?(n-o)/(r-i)%6:r===n?(o-t)/(r-i)+2:(t-n)/(r-i)+4;return l=(l*60+360)%360,l>=12&&l<=48&&s>=.18&&a>=.12&&a<=.78}var Uh=[[0,"#b9b9b9"],[.07,"#c1c1c1"],[.19,"#bfbfbf"],[.33,"#b8b8b8"],[.45,"#c5c5c5"],[.57,"#d7d7d7"],[.69,"#dedede"],[.78,"#d3d3d3"],[.89,"#bababa"],[1,"#a8a8a8"]],Kh=[[0,"#c6c6c6"],[.35,"#c0c0c0"],[.7,"#b8b8b8"],[1,"#b0b0b0"]],Wh=[[0,"#a3a3a3"],[.3,"#979797"],[.45,"#a9a9a9"],[.6,"#c8c8c8"],[.75,"#d0d0d0"],[.9,"#b4b4b4"],[1,"#9f9f9f"]];function cp(e){return e.undercounter?Kh:e.line==="pro"?Wh:Uh}var Zh=[[0,"#3b3d40"],[.08,"#424447"],[.33,"#333538"],[.57,"#47494c"],[.69,"#4c4e51"],[.85,"#37393c"],[1,"#2a2c2e"]];function qh(e,t){if(e.kind==="stainless")return cp(t);if(e.kind==="black")return Zh;let n=e.wood?ln(e.color,.05):e.color;return[[0,ln(n,.07)],[.3,ln(n,.02)],[.62,ln(n,.05)],[1,ln(n,-.1)]]}var Ke=e=>e.map(([t,n])=>f`<stop offset=${t} stop-color=${n} />`),Ve=e=>e.map(([t,n,o])=>f`<stop offset=${t} stop-color=${n} stop-opacity=${o} />`),ap=[[0,"#5d6063"],[.09,"#9fa2a5"],[.2,"#d6d8d9"],[.44,"#e4e5e6"],[.58,"#f7f8f8"],[.64,"#e6e7e8"],[.72,"#bfc1c3"],[.86,"#a3a6a8"],[.95,"#76797c"],[1,"#55585b"]];function pp(e){let{layout:t,finish:n}=e,{y0:o,y1:r}=t.span,i=e.theme==="dark",a=n.kind==="stainless"?.025:n.kind==="black"?.05:.07,l=t.fronts.some(u=>u.window&&u.contents==="beverage")?[[0,"#2a2018",.52],[.5,"#120d0a",.66],[1,"#1a130e",.6]]:[[0,"#2a2018",.42],[.5,"#120d0a",.58],[1,"#1a130e",.5]],p=n.kind==="black"?[[0,"#55575a"],[.15,"#47494c"],[1,"#36383a"]]:[[0,"#d6d6d6"],[.12,"#c4c4c4"],[1,"#b2b2b2"]],d=n.kind==="black"?[[0,"#2a2b2d"],[1,"#1b1c1d"]]:[[0,"#767676"],[.7,"#666666"],[1,"#585858"]];return f`<defs>
    <linearGradient id=${e.id("face")} gradientUnits="userSpaceOnUse" x1="0" y1=${o} x2="0" y2=${r}>
      ${Ke(qh(n,t))}
    </linearGradient>
    <linearGradient id=${e.id("steel")} gradientUnits="userSpaceOnUse" x1="0" y1=${o} x2="0" y2=${r}>
      ${Ke(cp(t))}
    </linearGradient>
    <linearGradient id=${e.id("faceX")} x1="0" y1="0" x2="1" y2="0">
      ${Ve([[0,"#ffffff",a],[.3,"#ffffff",0],[.7,"#000000",0],[1,"#000000",a]])}
    </linearGradient>
    <linearGradient id=${e.id("endShade")} x1="0" y1="0" x2="1" y2="0">
      ${Ve([[0,"#000000",0],[1,"#000000",1]])}
    </linearGradient>
    <linearGradient id=${e.id("tubeV")} x1="0" y1="0" x2="1" y2="0">${Ke(ap)}</linearGradient>
    <linearGradient id=${e.id("tubeH")} x1="0" y1="1" x2="0" y2="0">${Ke(ap)}</linearGradient>
    <linearGradient id=${e.id("capV")} x1="0" y1="0" x2="1" y2="0">
      ${Ke([[0,"#6f7275"],[.18,"#b6b9bb"],[.5,"#d3d5d6"],[.8,"#a9acae"],[1,"#6b6e71"]])}
    </linearGradient>
    <linearGradient id=${e.id("capH")} x1="0" y1="1" x2="0" y2="0">
      ${Ke([[0,"#6f7275"],[.18,"#b6b9bb"],[.5,"#d3d5d6"],[.8,"#a9acae"],[1,"#6b6e71"]])}
    </linearGradient>
    <linearGradient id=${e.id("louverTop")} x1="0" y1="0" x2="0" y2="1">${Ke(p)}</linearGradient>
    <linearGradient id=${e.id("louverFace")} x1="0" y1="0" x2="0" y2="1">${Ke(d)}</linearGradient>
    <linearGradient id=${e.id("band")} x1="0" y1="0" x2="0" y2="1">
      ${Ke([[0,"#1d1d1e"],[.6,"#2b2b2c"],[1,"#3a3a3b"]])}
    </linearGradient>
    <linearGradient id=${e.id("kick")} x1="0" y1="0" x2="0" y2="1">
      ${Ke([[0,"#8d8e8f"],[.16,"#9c9d9e"],[.7,"#a1a2a3"],[1,"#959697"]])}
    </linearGradient>
    <linearGradient id=${e.id("kickBlack")} x1="0" y1="0" x2="0" y2="1">
      ${Ke([[0,"#0f1011"],[.25,"#1e1f20"],[1,"#18191a"]])}
    </linearGradient>
    <linearGradient id=${e.id("tint")} x1="0" y1="0" x2="0" y2="1">${Ve(l)}</linearGradient>
    <linearGradient id=${e.id("sheen")} x1="0" y1="0" x2="0" y2="1">
      ${Ve([[0,"#ffffff",.08],[.3,"#ffffff",0],[.7,"#000000",0],[1,"#000000",.06]])}
    </linearGradient>
    <linearGradient id=${e.id("niche")} x1="0" y1="0" x2="0" y2="1">
      ${Ke([[0,"#0e0f10"],[.3,"#1f2123"],[1,"#2c2e31"]])}
    </linearGradient>
    <linearGradient id=${e.id("wood")} x1="0" y1="0" x2="0" y2="1">
      ${Ke([[0,"#e2bf98"],[.45,"#cfa077"],[1,"#a8774f"]])}
    </linearGradient>
    <linearGradient id=${e.id("cyl")} x1="0" y1="0" x2="1" y2="0">
      ${Ve([[0,"#000000",.45],[.22,"#000000",.05],[.34,"#ffffff",.35],[.46,"#ffffff",.05],[.8,"#000000",.12],[1,"#000000",.5]])}
    </linearGradient>
    <linearGradient id=${e.id("ice")} x1="0" y1="0" x2="0" y2="1">
      ${Ke([[0,"#fbfdfe"],[.3,"#e9f0f3"],[.6,"#d7e2e8"],[1,"#a7bac5"]])}
    </linearGradient>
    <linearGradient id=${e.id("shadeDown")} x1="0" y1="0" x2="0" y2="1">
      ${Ve([[0,"#000000",0],[1,"#000000",.2]])}
    </linearGradient>
    <linearGradient id=${e.id("binLight")} x1="0" y1="0" x2="0" y2="1">
      ${Ve([[0,"#ffffff",.14],[.45,"#ffffff",0],[1,"#000000",.14]])}
    </linearGradient>
    <linearGradient id=${e.id("depthL")} x1="0" y1="0" x2="1" y2="0">
      ${Ve([[0,"#000000",0],[1,"#000000",.2]])}
    </linearGradient>
    <linearGradient id=${e.id("depthR")} x1="0" y1="0" x2="1" y2="0">
      ${Ve([[0,"#000000",.2],[1,"#000000",0]])}
    </linearGradient>
    <linearGradient id=${e.id("depthT")} x1="0" y1="0" x2="0" y2="1">
      ${Ve([[0,"#000000",.04],[1,"#000000",.22]])}
    </linearGradient>
    <linearGradient id=${e.id("depthB")} x1="0" y1="0" x2="0" y2="1">
      ${Ve([[0,"#000000",.16],[1,"#000000",0]])}
    </linearGradient>
    <radialGradient id=${e.id("floor")} cx="0.5" cy="0.5" r="0.5">
      ${Ve([[0,"#000000",i?.62:.3],[.55,"#000000",i?.32:.13],[1,"#000000",0]])}
    </radialGradient>
    <radialGradient id=${e.id("pool")} cx="0.5" cy="0.5" r="0.5">
      ${Ve([[0,"#fff6e4",i?.32:.18],[1,"#fff6e4",0]])}
    </radialGradient>
    <radialGradient id=${e.id("glare")} cx="0.5" cy="0" r="0.75">
      ${Ve([[0,"#ffffff",.55],[1,"#ffffff",0]])}
    </radialGradient>
    <filter id=${e.id("grainF")} x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="1.1 0.016" numOctaves="2" seed="11" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="1.6 0 0 0 -0.3  1.6 0 0 0 -0.3  1.6 0 0 0 -0.3  0 0 0 0 1" />
    </filter>
    <pattern id=${e.id("grainV")} patternUnits="userSpaceOnUse" width="160" height="640">
      <rect width="160" height="640" filter=${e.ref("grainF")} />
    </pattern>
    <pattern id=${e.id("grainH")} patternUnits="userSpaceOnUse" width="160" height="640" patternTransform="rotate(90)">
      <rect width="160" height="640" filter=${e.ref("grainF")} />
    </pattern>
    ${n.wood?Yh(e):w}
    <filter id=${e.id("blur")} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.2" />
    </filter>
    <filter id=${e.id("blurL")} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="7" />
    </filter>
    <filter id=${e.id("pill")} x="-30%" y="-60%" width="160%" height="220%">
      <feGaussianBlur stdDeviation="1.4" />
    </filter>
    <filter id=${e.id("mute")} color-interpolation-filters="sRGB">
      <feColorMatrix type="saturate" values="0.78" />
    </filter>
    <filter id=${e.id("offline")} color-interpolation-filters="sRGB">
      <feColorMatrix type="saturate" values="0.06" />
      <feComponentTransfer>
        <feFuncR type="linear" slope="0.62" intercept="0.17" />
        <feFuncG type="linear" slope="0.62" intercept="0.17" />
        <feFuncB type="linear" slope="0.62" intercept="0.18" />
      </feComponentTransfer>
    </filter>
  </defs>`}function Yh(e){return f`<filter id=${e.id("woodF")} x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.7 0.008" numOctaves="4" seed="7" stitchTiles="stitch" result="fine" />
      <feColorMatrix in="fine" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="gray" />
      <feComponentTransfer in="gray" result="lines">
        <feFuncR type="table" tableValues="0.2 0.62 0.92 1 1 1" />
        <feFuncG type="table" tableValues="0.2 0.62 0.92 1 1 1" />
        <feFuncB type="table" tableValues="0.2 0.62 0.92 1 1 1" />
      </feComponentTransfer>
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.0025" numOctaves="2" seed="3" result="figure" />
      <feColorMatrix in="figure" type="matrix" values="1 0 0 0 0  0 0 0 0 0.5  0 0 0 0 0  0 0 0 0 1" result="shift" />
      <feDisplacementMap in="lines" in2="shift" scale="16" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <linearGradient id=${e.id("woodDrift")} x1="0" y1="0" x2="1" y2="0">
      ${Ve([[0,"#000000",0],[.3,"#000000",.08],[.5,"#000000",0],[.8,"#000000",.08],[1,"#000000",0]])}
    </linearGradient>
    <pattern id=${e.id("grainW")} patternUnits="userSpaceOnUse" x="-120" width="900" height="640" patternTransform="scale(1 1.4)">
      <rect width="900" height="640" fill="#ffffff" />
      <rect width="900" height="640" filter=${e.ref("woodF")} />
    </pattern>`}function Xh(e,t=1){let n=c(e.x),o=c(e.y),r=c(e.x+e.w),i=c(e.y+e.h);return f`<path d=${`M${n+1.2} ${o+.6}H${r-1.2}`} stroke="#fff" stroke-opacity=${.62*t} stroke-width="1.1" />
    <path d=${`M${n+.5} ${o+1.2}V${i-1.2}`} stroke="#fff" stroke-opacity=${.14*t} stroke-width="0.9" />
    <path d=${`M${r-.5} ${o+1.2}V${i-1.2}`} stroke="#000" stroke-opacity=${.2*t} stroke-width="1" />
    <path d=${`M${n+1.2} ${i-.7}H${r-1.2}`} stroke="#000" stroke-opacity=${.32*t} stroke-width="1.3" />`}function cn(e,t,n={}){let{kind:o,wood:r}=e.finish,i=n.radius??1.4,a={x:c(t.x),y:c(t.y),w:c(t.w),h:c(t.h)},s=e.ref(n.grain==="h"?"grainH":"grainV"),l=e.layout.undercounter?.04:.015,p=o==="stainless"?f`<rect x=${a.x} y=${a.y} width=${a.w} height=${a.h} rx=${i} fill=${s} opacity=${l} />`:o==="black"?f`<rect x=${a.x} y=${a.y} width=${a.w} height=${a.h} rx=${i} fill=${s} opacity="0.05" />`:r?f`<rect x=${a.x} y=${a.y} width=${a.w} height=${a.h} rx=${i} fill=${e.ref("grainW")} opacity="0.5" style="mix-blend-mode:multiply" />
              <rect x=${a.x} y=${a.y} width=${a.w} height=${a.h} rx=${i} fill=${e.ref("woodDrift")} />`:w;return f`<rect x=${a.x} y=${a.y} width=${a.w} height=${a.h} rx=${i} fill=${e.ref("face")} />
    ${p}
    <rect x=${a.x} y=${a.y} width=${a.w} height=${a.h} rx=${i} fill=${e.ref("faceX")} />
    ${Xh(t,n.edgeStrength??(o==="panel"?.6:1))}`}var $e=(e,t,n={})=>f`<rect x=${c(e.x)} y=${c(e.y)} width=${c(e.w)} height=${c(e.h)} rx=${n.rx??0} fill=${t} opacity=${n.opacity??1} />`;function Qh(e,t){let i={x:t.x+1.6,y:t.y+1.6,w:t.w-3.2,h:t.h-1.6-2.8},a=i.h/5,s=[];for(let d=0;d<5;d++){let u=i.y+d*a,h=d===4,g=a*.48,y=h?a-g:a*.36,$=[.18,.12,.06][d]??0;s.push(f`${$e({x:i.x,y:u,w:i.w,h:g},e.ref("louverTop"))}
      ${$e({x:i.x,y:u+g,w:i.w,h:y},e.ref("louverFace"))}
      ${h?w:$e({x:i.x,y:u+g+y,w:i.w,h:a-g-y},"#090909")}
      ${$?$e({x:i.x+i.w*.9,y:u,w:i.w*.1,h:g+y},e.ref("endShade"),{opacity:$}):w}
      <path d=${`M${c(i.x)} ${c(u+.5)}H${c(i.x+i.w)}`} stroke="#fff" stroke-opacity="0.55" stroke-width="0.8" />
      <path d=${`M${c(i.x)} ${c(u+g)}H${c(i.x+i.w)}`} stroke="#000" stroke-opacity="0.25" stroke-width="0.6" />
      <path d=${`M${c(i.x+i.w-3.5)} ${c(u+g)}L${c(i.x+i.w)} ${c(u+g+y)}V${c(u+g)}Z`} fill="#000" opacity="0.28" />`)}let l=t.x+t.w,p=t.y+t.h;return f`<g>
    ${$e(t,"#1a1a1a")}
    ${s}
    ${$e(i,e.ref("grainH"),{opacity:.045})}
    ${$e({x:t.x,y:t.y,w:t.w,h:1.6},"#cfd0d1")}
    ${$e({x:t.x,y:t.y,w:1.6,h:t.h},"#bcbdbe")}
    ${$e({x:l-1.6,y:t.y,w:1.6,h:t.h},"#a9aaab")}
    ${$e({x:t.x,y:p-2.8,w:t.w,h:2.8},"#c7c8c9")}
    <path d=${`M${c(t.x)} ${c(t.y+.4)}H${c(l)}`} stroke="#fff" stroke-opacity="0.7" stroke-width="0.8" />
    <path d=${`M${c(t.x)} ${c(p-2.8+.4)}H${c(l)}`} stroke="#fff" stroke-opacity="0.55" stroke-width="0.7" />
    <path d=${`M${c(t.x)} ${c(p-.4)}H${c(l)}`} stroke="#000" stroke-opacity="0.35" stroke-width="0.8" />
    <path d=${`M${c(t.x+.4)} ${c(t.y)}V${c(p)}M${c(l-.4)} ${c(t.y)}V${c(p)}`} stroke="#000" stroke-opacity="0.3" stroke-width="0.8" />
  </g>`}function Jh(e,t){let n={x:t.x+12,y:t.y+7,w:t.w-24,h:t.h-9},o=n.w*.86,r=n.x+(n.w-o)/2,i=[24,44,64].map(s=>{let l=n.y+s;return f`<rect x=${c(r)} y=${c(l)} width=${c(o)} height="8" rx="4" fill="#202122" />
      <rect x=${c(r+2)} y=${c(l+.6)} width=${c(o-4)} height="3" rx="1.5" fill="#000" opacity="0.7" />
      <path d=${`M${c(r+4)} ${c(l+8.7)}H${c(r+o-4)}`} stroke="#fff" stroke-opacity="0.6" stroke-width="0.8" />`}),a=s=>f`<rect x=${c(s-15)} y=${c(n.y+84)} width="30" height="9" rx="1.5" fill="#3b3e41" />
      <rect x=${c(s-15)} y=${c(n.y+84)} width="30" height="9" rx="1.5" fill="none" stroke="#000" stroke-opacity="0.4" stroke-width="0.8" />
      <rect x=${c(s-10)} y=${c(n.y+87.5)} width="20" height="2" rx="1" fill="#d9e2ea" opacity="0.35" />`;return f`<g>
    ${cn(e,t,{grain:"v",radius:.6})}
    <rect x=${c(n.x-1.2)} y=${c(n.y-1.2)} width=${c(n.w+2.4)} height=${c(n.h+2.4)} rx="1" fill="#1a1a1a" />
    ${cn(e,n,{grain:"h",radius:.6})}
    ${i}
    ${a(n.x+n.w*.08)}
    ${a(n.x+n.w*.92)}
  </g>`}function up(e){let t=e.layout;if(!t.grille)return f``;let n=t.band?t.band.h-Ji:0,o=t.top==="slots"?Jh(e,t.grille):e.finish.kind==="panel"?cn(e,{x:t.grille.x,y:t.grille.y,w:t.grille.w,h:t.grille.h+n-.6},{radius:.8}):Qh(e,t.grille);return f`${o}${t.band?em(e,t,t.band):w}`}var Ji=3;function em(e,t,n){let o=e.finish.kind!=="stainless",r=e.finish.kind==="panel"?{x:n.x,y:n.y+n.h-Ji,w:n.w,h:Ji}:n,i=r.h<4,a=[$e(r,e.ref("band"))];if(t.top==="louvers"){let s=t.fronts.filter(d=>d.kind==="door"&&Math.abs(d.rect.y-t.span.y0)<.6),l=i?r.y+.8:r.y+2.2,p=i?1.4:2.4;for(let d of s){let u=d.hinge==="left",h=u?d.rect.x:d.rect.x+d.rect.w,g=u?1:-1,y=u?h:h-4,$=u?h+9:h-33;if(a.push(f`<rect x=${c(y)} y=${c(r.y+.6)} width="4" height=${c(r.h-1)} rx="1" fill=${e.ref(o?"capV":"tubeV")} opacity=${o?.7:1} />
        <rect x=${c($)} y=${c(l)} width="24" height=${p} rx="0.7" fill=${o?"#3a3b3c":"#d9dadb"} />
        ${o?w:f`<path d=${`M${c($)} ${c(l+p)}h24`} stroke="#000" stroke-opacity="0.5" stroke-width="0.6" />`}`),d.rect.w>150&&!i){let b=h+g*98;a.push(f`<rect x=${c(b-7)} y=${c(r.y+2.4)} width="14" height="3.4" rx="1.6" fill="#474849" />
          ${o?w:f`<path d=${`M${c(b-6)} ${c(r.y+2.8)}h12`} stroke="#fff" stroke-opacity="0.25" stroke-width="0.5" />`}`)}}for(let d=1;d<s.length;d++){let u=s[d-1].rect;if(s[d].rect.y!==u.y)continue;let h=(u.x+u.w+s[d].rect.x)/2;a.push(o?f`<rect x=${c(h-1.7)} y=${c(r.y+.6)} width="3.4" height=${c(r.h-.6)} rx="1" fill="#4a4b4c" />`:f`<rect x=${c(h-1.7)} y=${c(r.y+1.2)} width="3.4" height=${c(r.h-1.2)} rx="1.2" fill=${e.ref("capV")} opacity="0.8" />`)}}return f`${a}`}function fp(e){let t=e.layout,n=t.band?t.band.y+t.band.h:0,o=t.kick.y;if(t.line==="pro"){let a={x:0,y:n-3,w:t.w,h:o-n+3};return f`${cn(e,a,{radius:.5})}
      ${t.fronts.map(s=>$e({x:s.rect.x-1.6,y:s.rect.y-1.6,w:s.rect.w+3.2,h:s.rect.h+3.2},"#151515",{rx:1.5}))}`}let r=[$e({x:0,y:n,w:t.w,h:o-n},"#1c1c1d")],i=t.fronts.filter(a=>a.kind==="door");for(let a=1;a<i.length;a++){let s=i[a-1].rect,l=i[a].rect;if(s.y!==l.y||l.x-(s.x+s.w)>6)continue;let p=(s.x+s.w+l.x)/2;r.push($e({x:p-.6,y:s.y+2,w:1.2,h:Math.min(s.h,l.h)-4},"#c4c5c6",{opacity:.85}))}return f`${r}`}function hp(e){let t=e.layout,n=t.kick,o=e.finish.kind!=="stainless",r=o?e.ref("kickBlack"):e.ref("kick"),i=a=>f`${$e(a,r)}
      ${o?w:$e(a,e.ref("grainH"),{opacity:.05})}
      ${$e({x:a.x,y:a.y,w:a.w,h:Math.min(t.line==="classic"?3:2,a.h)},"#000",{opacity:.1})}
      <path d=${`M${c(a.x)} ${c(a.y+a.h-.5)}H${c(a.x+a.w)}`} stroke="#000" stroke-opacity="0.45" stroke-width="1" />`;if(t.line==="pro"){let s={x:36,y:n.y+4,w:t.w-72,h:n.h-4},l=[0,t.w-36].map(p=>{let d=p===0?36:t.w-36,u=p===0?`M0 ${n.y}H${d}V${n.y+8}L${d-6} ${n.y+n.h}H0Z`:`M${t.w} ${n.y}H${d}V${n.y+8}L${d+6} ${n.y+n.h}H${t.w}Z`;return f`<path d=${u} fill=${e.ref("steel")} />
        <path d=${u} fill=${e.ref("grainV")} opacity="0.12" />
        <path d=${u} fill="#000" opacity="0.12" />`});return f`${$e(s,"#2a2b2c")}
      ${$e({x:s.x,y:s.y,w:s.w,h:8},"#000",{opacity:.4})}
      ${$e({x:0,y:n.y,w:t.w,h:4},"#3a3b3c")}
      ${l}`}if(t.line==="classic"){let a=[$e({x:0,y:n.y,w:t.w,h:1},"#2a2a2a"),i({x:7,y:n.y+1,w:t.w-14,h:n.h-1})];for(let s of t.fronts){if(s.kind!=="door"||Math.abs(s.rect.y+s.rect.h-n.y)>.6)continue;let l=s.hinge==="left",p=l?s.rect.x:s.rect.x+s.rect.w,d=l?1:-1,u=`M${p} ${n.y}h${d*50}l${d*3} 5v5h${-d*14}l${-d*4} -3H${p}Z`,h=l?p:p-4.2;a.push(f`<path d=${u} fill="#141414" />
        <path d=${`M${p} ${n.y+.6}h${d*50}`} stroke="#fff" stroke-opacity="0.22" stroke-width="0.7" />
        <g opacity="0.85">
          <rect x=${c(h)} y=${c(n.y+.4)} width="4.2" height="5" rx="1" fill=${e.ref("capV")} />
          <rect x=${c(h)} y=${c(n.y+6)} width="4.2" height="5" rx="1" fill=${e.ref("capV")} />
        </g>`)}return f`${a}`}return f`${$e({x:0,y:n.y,w:t.w,h:1},"#151515")}${i({x:5,y:n.y+1,w:t.w-10,h:n.h-1})}`}function mp(e){let t=e.layout;if(t.line!=="pro")return f``;let n=[];for(let o of t.fronts){if(o.kind!=="door")continue;let r=o.hinge==="left"?-4:t.w-8;for(let i of[o.rect.y+8,o.rect.y+o.rect.h-78])n.push(f`<rect x=${r+2} y=${c(i+3)} width="12" height="70" rx="2" fill="#000" opacity="0.3" filter=${e.ref("blur")} />
        <rect x=${r} y=${c(i)} width="12" height="70" rx="2.5" fill=${e.ref("tubeV")} />
        <path d=${`M${r+1} ${c(i+.8)}h10M${r+1} ${c(i+69.2)}h10`} stroke="#000" stroke-opacity="0.35" stroke-width="0.8" />`)}return f`${n}`}function io(e){return e.handle==="pro"?12.5:e.layout.line==="designer"?7:10}function ea(e){let t=e.layout;return t.line==="pro"?19:t.line==="designer"&&!t.undercounter?18:15}function ao(e,t){if(e.handle==="none")return null;let n=e.layout,o=t.rect;if(t.handle==="top"){let[l,p]=n.line==="pro"?[.68,36]:n.undercounter?[.85,14]:n.line==="classic"?[.87,24]:[.92,15],d=o.w*l;return{orient:"h",x:o.x+(o.w-d)/2,y:o.y+p,len:d}}let r=ea(e),i=t.hinge==="left"?o.x+o.w-r:o.x+r,[a,s]=[o.y+49,o.y+o.h-46];return n.undercounter?[a,s]=[o.y+35,o.y+o.h-37]:n.line==="pro"?[a,s]=[o.y+74,o.y+o.h-74]:n.line==="designer"&&([a,s]=o.h>700?[o.y+166,o.y+o.h-164]:[o.y+150,o.y+o.h-16]),{orient:"v",x:i,y:a,len:s-a}}function tm(e,t){let n=e.handle==="pro",o=io(e),r=25,i=t.orient==="v",a=n?17:o,s=n?.6:1,l=i?{x:t.x-a/2+s,y:t.y+2.4,w:a,h:t.len}:{x:t.x+s,y:t.y-a/2+2.4,w:t.len,h:a},p=n?f`<rect x=${-o/2} y=${r*.5} width=${o} height=${c(t.len-r)} fill=${e.ref("tubeV")} />
        <path d=${`M${o*.11} ${r*.5}V${c(t.len-r*.5)}`} stroke="#fff" stroke-opacity="0.7" stroke-width="0.8" />
        ${[0,t.len-r].map(u=>f`<rect x="-8.5" y=${c(u)} width="17" height=${r} rx="3.6" fill=${e.ref("capV")} />
            <rect x="-8.5" y=${c(u)} width="17" height=${r} rx="3.6" fill=${e.ref("grainV")} opacity="0.12" />
            <path d=${`M-6 ${c(u+.7)}H6`} stroke="#fff" stroke-opacity="0.65" stroke-width="0.8" />
            <path d=${`M-6 ${c(u+r-.7)}H6`} stroke="#000" stroke-opacity="0.35" stroke-width="0.9" />`)}`:f`<rect x=${-o/2} y="0" width=${o} height=${c(t.len)} rx=${c(o*.18)} fill=${e.ref("tubeV")} />
        <rect x=${-o/2} y="0" width=${o} height="2.4" rx=${c(o*.14)} fill="#000" opacity="0.2" />
        <rect x=${-o/2} y=${c(t.len-2.4)} width=${o} height="2.4" rx=${c(o*.14)} fill="#000" opacity="0.32" />
        <path d=${`M${c(o*.09)} 3.2V${c(t.len-3.2)}`} stroke="#fff" stroke-opacity="0.7" stroke-width=${c(o*.07)} />`,d=i?`translate(${c(t.x)} ${c(t.y)})`:`translate(${c(t.x)} ${c(t.y)}) rotate(-90)`;return f`<rect x=${c(l.x)} y=${c(l.y)} width=${c(l.w)} height=${c(l.h)} rx=${c(a/2)} fill="#000" opacity="0.18" filter=${e.ref("blur")} />
    <g transform=${d}>${p}</g>`}function nm(e,t){let n=t.rect,o=t.hinge==="right",r=n.x+(o?35:6),i=n.x+n.w-(o?6:35),a=Math.min(100,i-r-24),s=(r+i)/2-a/2,l=s+a/2,p=n.y+n.h*.3,d=150,u=2.5,h=[];for(let y=0;y<3;y++)for(let $=s+14+y%2*2.5;$<s+a-13;$+=5)h.push(f`<circle cx=${c($)} cy=${c(p+d-19+y*3.6)} r="0.8" fill="#0b0c0d" />`);let g=y=>f`<rect x=${c(y)} y=${c(p+40)} width="18" height="44" rx="2.2" fill="#2b2d30" />
      <path d=${`M${c(y+1.2)} ${c(p+41)}H${c(y+16.8)}M${c(y+.8)} ${c(p+42)}V${c(p+82)}`} stroke="#fff" stroke-opacity="0.22" stroke-width="0.6" />
      <rect x=${c(y)} y=${c(p+80)} width="18" height="4" rx="1.6" fill="#000" opacity="0.25" />`;return f`<g>
    <rect x=${c(s)} y=${c(p-24)} width=${c(a)} height="13" rx="2" fill="#121314" />
    ${[.3,.5,.7].map(y=>f`<circle cx=${c(s+a*y)} cy=${c(p-17.5)} r="1.6" fill="#8fa3b5" opacity="0.4" />`)}
    ${cn(e,{x:s-u,y:p-u,w:a+2*u,h:d+2*u},{grain:"h",radius:7,edgeStrength:.8})}
    <rect x=${c(s)} y=${c(p)} width=${c(a)} height=${d} rx="6" fill=${e.ref("niche")} />
    <rect x=${c(s)} y=${c(p)} width=${c(a)} height="22" rx="6" fill=${e.ref("shadeDown")} transform=${`rotate(180 ${c(l)} ${c(p+11)})`} opacity="0.9" />
    <circle cx=${c(l)} cy=${c(p+7)} r="5" fill="#ffd9a0" opacity="0.25" filter=${e.ref("blur")} />
    <circle cx=${c(l)} cy=${c(p+7)} r="1.5" fill="#ffe7c2" />
    <ellipse cx=${c(l)} cy=${c(p+26)} rx="7" ry="4" fill="#050505" stroke="#5a5d60" stroke-opacity="0.6" stroke-width="0.8" />
    ${g(l-20)}
    ${g(l+2)}
    <rect x=${c(s+8)} y=${c(p+d-24)} width=${c(a-16)} height="16" rx="2" fill="#2f3134" />
    ${h}
    <rect x=${c(s+6)} y=${c(p+d-8)} width=${c(a-12)} height="3" rx="1.2" fill=${e.ref("tubeH")} />
  </g>`}function om(e,t,n,o){let r=t.window,i=e.id(`w${n}`),a=t.contents==="food",s={x:c(r.x),y:c(r.y),w:c(r.w),h:c(r.h)},l=s.x+s.w,p=s.y+s.h;return f`<clipPath id=${i}><rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} /></clipPath>
    <rect x=${s.x-1} y=${s.y-1} width=${s.w+2} height=${s.h+2} rx="0.6" fill="#1d1d1d" opacity="0.85" />
    <g clip-path=${`url(#${i})`}>
      <g filter=${a?w:e.ref("mute")}>${Mr(e,t,{glass:!0,state:o})}</g>
      <rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill=${e.ref("tint")} opacity=${a?.4:1} />
      <rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill=${e.ref("sheen")} />
      <rect x=${s.x} y=${s.y} width=${s.w} height="7" fill="#000" opacity="0.35" />
    </g>
    <path d=${`M${c(s.x-1.6)} ${c(s.y-1.3)}H${c(l+1.3)}M${c(s.x-1.3)} ${c(s.y-1.6)}V${c(p+1.3)}`} stroke="#fff" stroke-opacity="0.35" stroke-width="0.6" />
    <path d=${`M${c(s.x-1)} ${c(p+1.3)}H${c(l+1.6)}M${c(l+1.3)} ${c(s.y-1)}V${c(p+1.6)}`} stroke="#000" stroke-opacity="0.25" stroke-width="0.6" />`}function Cr(e,t,n,o){let r=ao(e,t);return f`<g>
    ${cn(e,t.rect)}
    ${t.window?om(e,t,n,o):w}
    ${t.dispenser?nm(e,t):w}
    ${r?tm(e,r):w}
  </g>`}function gp(e,t){let{w:n,h:o}=e.layout,r=e.theme==="dark";return f`<ellipse cx=${c(n/2)} cy=${c(o+1)} rx=${c(n*.62)} ry=${c(t*.012)} fill=${e.ref("floor")} />
    <rect x="3" y=${c(o-1.5)} width=${c(n-6)} height="3" rx="1.5" fill="#000" opacity=${r?.6:.32} filter=${e.ref("blur")} />`}var so=20,yp=12,dp=8.5,Tr=13,rm="font-family:var(--ha-font-family-body, Roboto, system-ui);font-variant-numeric:tabular-nums";function im(e){let t=0;for(let n of e)t+=/[0-9]/.test(n)?.6:/[-°.,: ]/.test(n)?.38:.64;return t*yp}function $p(e,t){let n=so;return f`<rect x=${c(-t/2+.5)} y=${-n/2+1.2} width=${c(t-1)} height=${n} rx=${n/2} fill="#000" opacity="0.28" filter=${e.ref("pill")} />
    <rect x=${c(-t/2)} y=${-n/2} width=${c(t)} height=${n} rx=${n/2} fill="rgb(20,22,25)" fill-opacity="0.6" stroke="#fff" stroke-opacity="0.22" stroke-width="1" />`}var _p=(e,t,n)=>`translate(${c(e)} ${c(t)}) scale(${Math.round(n*1e3)/1e3})`,bp=f`<path d="M0 -8 7 -4V4L0 8-7 4V-4Z M-7 -4 0 0 7 -4M0 0V8" fill="#fff" fill-opacity="0.16" stroke="#fff" stroke-width="1.7" stroke-linejoin="round" />`;function am(e,t){let n=Tr/20,o=t==="max"?f`<path d="M11 -9V-3M8 -6H14" stroke="#fff" stroke-width="2" stroke-linecap="round" />`:t==="night"?f`<path d="M12.6 -10.4A3.6 3.6 0 1 0 14.4 -4.2 2.9 2.9 0 1 1 12.6 -10.4Z" fill="#fff" />`:w;return f`<g transform=${`translate(${c(e+Tr/2)} 0) scale(${n})`} opacity="0.85">${bp}${o}</g>`}var sm=e=>e?Tr+(e==="on"?0:5):0;function vp(e,t,n,o,r,i){let a=im(o),s=i?4:0,l=dp*2+a+s+sm(i),p=-l/2+dp;return f`<g class=${e.id("readout")} transform=${_p(t,n,r)}>
    ${$p(e,l)}
    <text x=${c(p+a/2)} y="0" dominant-baseline="central" text-anchor="middle" font-size=${yp} font-weight="600" fill="#fff" style=${rm}>${o}</text>
    ${i?am(p+a+s,i):w}
  </g>`}function wp(e,t,n,o,r){let i=r==="paused"?f`<rect x="-4.6" y="-5.5" width="3.2" height="11" rx="1" fill="#fff" />
          <rect x="1.4" y="-5.5" width="3.2" height="11" rx="1" fill="#fff" />`:r==="cleaning"?f`<path d="M-1 -7.5C2.4 -2.8 4.6 0 4.6 2.8A5.6 5.6 0 0 1 -6.6 2.8C-6.6 0 -4.4 -2.8 -1 -7.5Z" fill="#fff" fill-opacity="0.2" stroke="#fff" stroke-width="1.7" stroke-linejoin="round" />
            <path d="M6.2 -8.6 6.9 -6.9 8.6 -6.2 6.9 -5.5 6.2 -3.8 5.5 -5.5 3.8 -6.2 5.5 -6.9Z" fill="#fff" />`:bp;return f`<g class=${e.id("readout")} transform=${_p(t,n,o)}>
    ${$p(e,so)}
    <g transform=${`scale(${Tr/20})`} opacity="0.85">${i}</g>
  </g>`}function kp(e){return e.finish.kind==="panel"?ln(e.finish.color,-.18):e.finish.kind==="black"?"#26282a":"#a9abad"}var lm=113*Math.PI/180,cm=95*Math.PI/180;function xp(e,t,n){let{x:o,y:r,w:i,h:a}=t.rect,s=t.hinge==="left",l=s?o:o+i,p=e.layout.undercounter?cm:lm,d=Math.cos(p),u=Math.sin(p),h=e.layout.undercounter?22:26,g=t.window!==null,y=g||t.contents==="ice"?0:e.layout.undercounter?30:40,$=(N,F,j)=>{let W=N*d-F*u;return tt(e.camera,s?l+W:l-W,j,N*u+F*d)},b=(N,F)=>et(e.camera,N*u+F*d),_=(N,F,j,W,ee)=>[$(N,j,W),$(F,j,W),$(F,j,ee),$(N,j,ee)],v=_(0,i,-h,r,r+a),k=[$(i,-h,r),$(i,0,r),$(i,0,r+a),$(i,-h,r+a)],x=[...v,...k],z=[],S=g||t.contents==="ice",R=e.id(`sp${n}`);if(z.push(f`<linearGradient id=${R} x1=${s?1:0} y1="0" x2=${s?0:1} y2="0">
      <stop offset="0" stop-color="#fffaf0" stop-opacity="0.45" />
      <stop offset="1" stop-color="#fffaf0" stop-opacity="0" />
    </linearGradient>
    ${g?w:f`<path d=${X(v)} fill=${S?"#202224":"#868d92"} />`}`),g){let N=t.window,F=s?N.x-o:o+i-(N.x+N.w),j=_(F,F+N.w,-h,N.y,N.y+N.h),W=_(6,i-6,-h,r+6,r+a-6);z.push(f`<path d=${X(v)+X(j)} fill="#1f1c19" fill-rule="evenodd" />
      <path d=${X(W)+X(j)} fill="#2e2924" fill-rule="evenodd" />
      <path d=${X(j)} fill="#1c1611" fill-opacity="0.5" stroke="#0b0a09" stroke-opacity="0.85" stroke-width="1.6" />
      <path d=${X(j)} fill=${e.ref("sheen")} />`)}else{let N=_(9,i-9,-h,r+9,r+a-9);z.push(f`<path d=${X(N)} fill=${S?"#3a3d40":"#d9dee1"} />
      <path d=${X(N)} fill=${`url(#${R})`} />`)}if(y){let N=a>500?5:a>300?3:2,F=e.layout.undercounter?34:44,j=12,W=i-12,ee=-h-y,be=st(n*13+5),Ce=t.contents==="freezer"?ro(e):Xi(e).filter((me,J)=>J!==3&&J!==4&&J!==8),re=-h-y*.55,pe=(me,J,Y,oe,Ae)=>f`<path d=${`M${c(me[0])} ${c(me[1])}L${c(J[0])} ${c(J[1])}`} stroke=${Y} stroke-opacity=${oe} stroke-width=${Ae} />`,Ze=(me,J)=>[$(me,-h,J),$(me,ee,J),$(me,ee,J+F),$(me,-h,J+F)];for(let me=0;me<N;me++){let J=r+a*.09+me*(a*.8-F)/Math.max(1,N-1),Y=[];for(let it=j+14;it<W-10;it+=30+be()*16){let kt=Ce[Math.floor(be()*Ce.length)](be);if(kt.h>F*2.4)continue;let[ge,Ne]=$(it,re,J+F-3);Y.push(Bt(ge,Ne,b(it,re),kt.draw))}let oe=_(j,W,ee,J,J+F),Ae=[$(j,-h,J+F),$(W,-h,J+F),$(W,ee,J+F),$(j,ee,J+F)],_e=Ze(W,J);x.push(...oe),z.push(f`<path d=${X(Ae)} fill="#000" opacity="0.1" />
        <path d=${X(Ze(j,J))} fill="#e6eef1" fill-opacity="0.18" />
        ${Y}
        <path d=${X(_e)} fill="#e6eef1" fill-opacity="0.24" stroke="#ffffff" stroke-opacity="0.3" stroke-width="0.6" />
        <path d=${X(oe)} fill="#eaf1f4" fill-opacity="0.3" />
        <path d=${X(_(j,W,ee,J+F*.45,J+F))} fill="#ffffff" fill-opacity="0.16" />
        <path d=${X(_(j,W,ee,J+F-2.5,J+F))} fill="#ffffff" fill-opacity="0.45" />
        <path d=${X(_(j,W,ee,J,J+3.5))} fill="#f6f9fa" fill-opacity="0.88" />
        ${pe($(j,ee,J+3.5),$(W,ee,J+3.5),"#6f8089",.35,.6)}
        ${pe(oe[3],oe[2],"#8a9ba4",.5,.9)}
        ${pe(_e[0],_e[1],"#ffffff",.7,.9)}
        ${pe(_e[1],_e[2],"#ffffff",.6,.8)}`)}}z.push(f`<path d=${X(k)} fill=${kp(e)} />
    <path d=${X(k)} fill=${e.ref("faceX")} />
    <path d=${`M${c(k[1][0])} ${c(k[1][1])}L${c(k[2][0])} ${c(k[2][1])}`} stroke="#000" stroke-opacity="0.3" stroke-width="1" />
    <path d=${`M${c(k[0][0])} ${c(k[0][1])}L${c(k[3][0])} ${c(k[3][1])}`} stroke="#fff" stroke-opacity="0.35" stroke-width="0.8" />`);let M=ao(e,t);if(M&&M.orient==="v"){let N=e.handle==="pro",F=i-ea(e),j=N?30:26,W=$(F,j,M.y),ee=$(F,j,M.y+M.len),be=io(e)*b(F,j),Ce=[M.y+14,M.y+M.len-14].map(re=>{let pe=[$(F,1,re-5),$(F,j-3,re-5),$(F,j-3,re+5),$(F,1,re+5)];return f`<path d=${X(pe)} fill="#8f9295" />`});x.push(W,ee),z.push(f`${Ce}
      <rect x=${c(W[0]-be/2)} y=${c(W[1])} width=${c(be)} height=${c(ee[1]-W[1])} rx=${c(be/4)} fill=${e.ref("tubeV")} />`)}let G=Math.max(v[2][1],v[3][1],k[2][1]),T=[...v,...k].map(([N])=>N),O=Math.min(...T),V=Math.max(...T);x.push([O,G+5],[V,G+5]);let Q=f`<ellipse cx=${c((O+V)/2)} cy=${c(G+1.5)} rx=${c((V-O)/2+4)} ry="3" fill="#000" opacity=${e.theme==="dark"?.5:.24} filter=${e.ref("blur")} />`;return{back:f``,front:f`<g>${Q}${z}</g>`,points:x}}function zp(e,t,n,o){let r=t.rect,i=Nt(e.camera,r,.75*e.layout.depth),a=i.w/r.w,s={...i,y:i.y+Math.min(6,r.h*.05),k:a},l={x:r.x+6,y:r.y+3,w:r.w-12,h:r.h-5},p=[l.x+4,l.y+2],d=[l.x+l.w-4,l.y+2],u=[s.x+7*a,s.y+1],h=[s.x+s.w-7*a,s.y+1],g=5,y=[u[0]+g*a,u[1]],$=[h[0]-g*a,h[1]],b=[p[0]+g*.8,p[1]],_=[d[0]-g*.8,d[1]],v={x:y[0],y:l.y,w:$[0]-y[0],h:s.y-l.y},k=t.contents==="freezer",x=t.contents==="beverage"||t.contents==="wine",z=k?"#e6edf1":x?"#3a302a":"#eef2f3",S=x?"#2c2420":"#d4dce0",R=e.id(`dq${n}`),M=[b,_,$,y],G=f`<rect x=${c(r.x)} y=${c(r.y)} width=${c(r.w)} height=${c(r.h)} fill="#232527" />
    <rect x=${c(l.x)} y=${c(l.y)} width=${c(l.w)} height=${c(l.h)} fill="#0f1011" />
    <clipPath id=${R}><path d=${X(M)} /></clipPath>
    <path d=${X(M)} fill=${z} />
    <g clip-path=${`url(#${R})`}>
      <rect x=${c(l.x)} y=${c(l.y)} width=${c(l.w)} height="8" fill="#000" opacity="0.22" />
      ${ip(v,t.contents,n*7+3,e)}
    </g>
    <path d=${X([p,b,y,u])} fill=${S} />
    <path d=${X([p,b,y,u])} fill=${e.ref("depthL")} />
    <path d=${X([_,d,h,$])} fill=${S} />
    <path d=${X([_,d,h,$])} fill=${e.ref("depthR")} />
    <path d=${`M${c(p[0])} ${c(p[1])}L${c(u[0])} ${c(u[1])}M${c(d[0])} ${c(d[1])}L${c(h[0])} ${c(h[1])}`} stroke="#ffffff" stroke-opacity="0.55" stroke-width="0.8" />`,T=`translate(${c(s.x)} ${c(s.y)}) scale(${Math.round(a*1e3)/1e3}) translate(${c(-r.x)} ${c(-r.y)})`,O=s.y+s.h,V=f`<rect x=${c(s.x+6)} y=${c(O-5)} width=${c(s.w-12)} height="11" fill="#000" opacity="0.34" filter=${e.ref("blur")} />
    <g transform=${T}>${Cr(e,t,n,o)}</g>`;return{back:G,front:V,points:[[s.x,s.y],[s.x+s.w,O+10]],moved:s}}var pm=10,dm=26,Sp=10,Rp=.03,Ap=e=>{if(e.spec.family!=="refrigeration")return null;let t=Bc(e.spec),n=um(e,t),o=e.state,r=t.fronts.map(v=>v.keys.some(k=>o.doors[k]===!0)),i=[],a=[],s=[],l=new Map,p=new Set;t.fronts.forEach((v,k)=>{if(!r[k]){s.push(Cr(n,v,k,o));return}let x=Mp(n,v,k,o);if(l.set(k,x),v.kind==="door"){if(!p.has(v.cavityId)){p.add(v.cavityId);let z=t.fronts.filter(S=>S.cavityId===v.cavityId);i.push(gm(mm(z.map(S=>S.rect)),v)),i.push(Mr(n,v,{glass:!1,state:o}))}}else i.push(x.back);a.push(x.front)});let{reach:d,y0:u,y1:h}=fm(n,t,o,l),g={x:-d,y:u,w:t.w+2*d,h:h-u},y=hm(g.h,e.pixelHeight),$=t.fronts.filter((v,k)=>r[k]&&v.kind==="door").map(v=>f`<ellipse cx=${c(v.rect.x+v.rect.w/2)} cy=${c(t.h+1)} rx=${c(v.rect.w*.75)} ry=${c((h-t.h)*.7)} fill=${n.ref("pool")} />`),b=!o.available,_=km(t,r,o);return A`<svg
    viewBox=${[g.x,g.y,g.w,g.h].map(c).join(" ")}
    preserveAspectRatio="xMidYMax meet"
    role="img"
    aria-label=${_}
    xmlns="http://www.w3.org/2000/svg"
  >
    ${pp(n)}
    ${e.reducedMotion?w:f`<style>${`.${n.id("readout")}{transition:opacity .25s ease}`}</style>`}
    ${gp(n,g.h)}
    ${$}
    <g filter=${b?n.ref("offline"):w} opacity=${b&&n.theme==="dark"?.85:1}>
      ${fp(n)}
      ${up(n)}
      ${hp(n)}
      ${mp(n)}
      ${s}
      ${i}
      ${a}
    </g>
    <g opacity=${b?.7:1}>${$m(n,t,r,l,o,y)}</g>
  </svg>`};function um(e,t){let n=e.uid.replace(/[^A-Za-z0-9_-]/g,"_")||"rf",o=t.fronts.some(a=>a.kind==="drawer"),r=t.undercounter?o?{cx:t.w/2,cy:t.h-560,d:2200}:{cx:t.w/2,cy:t.span.y1/2,d:2200}:{cx:t.w/2,cy:t.h-470,d:2200},i={...r,d:t.undercounter?1e3:1150};return{id:a=>`${n}-${a}`,ref:a=>`url(#${n}-${a})`,layout:t,finish:sp(e.appearance),handle:e.appearance.handle,camera:r,inside:i,theme:e.theme}}function Mp(e,t,n,o){return t.kind==="door"?xp(e,t,n):zp(e,t,n,o)}function fm(e,t,n,o){let r=dm,i=-pm,a=t.h;return t.fronts.forEach((s,l)=>{if(s.keys.length)for(let[p,d]of(o.get(l)??Mp(e,s,l,n)).points)r=Math.max(r,-p+Sp,p-t.w+Sp),i=Math.min(i,d-6),a=Math.max(a,d+2)}),{reach:r,y0:i,y1:Math.max(a,t.h+Rp*(t.h-i)/(1-Rp))}}function hm(e,t){let n=.125*e/so;return t&&t>0?Math.min(e/t,n):.03*e/12}function mm(e){let t=Math.min(...e.map(i=>i.x)),n=Math.min(...e.map(i=>i.y)),o=Math.max(...e.map(i=>i.x+i.w)),r=Math.max(...e.map(i=>i.y+i.h));return{x:t,y:n,w:o-t,h:r-n}}function gm(e,t){let n=t.contents==="wine"||t.contents==="beverage"||t.contents==="ice";return f`<rect x=${c(e.x)} y=${c(e.y)} width=${c(e.w)} height=${c(e.h)} fill=${n?"#2a2522":"#dfe4e6"} />
    <rect x=${c(e.x)} y=${c(e.y)} width=${c(e.w)} height=${c(e.h)} fill="none" stroke="#000" stroke-opacity="0.25" stroke-width="1.2" />`}function ym(e){return e.ice?.on?e.ice.mode==="max"?"max":e.ice.mode==="night"?"night":"on":null}function $m(e,t,n,o,r,i){let a=so*i,s=[];return t.fronts.forEach((l,p)=>{let d=l.rect,u=l.kind==="door"?l.hinge==="left"?1:-1:0,h=d.x+d.w/2-u*18,g=n[p]&&l.kind==="door"?vm(l,a):null;for(let y of l.zones){let $=r.readouts[y.zone];if(!$||y.openOnly&&!n[p])continue;let b=y.openOnly?wm(e,l,a):l.kind==="drawer"?bm(_m(e,l,o.get(p),a),l,o,a):y.top!==void 0?{x:y.x??h,y:y.top+.8*a}:g??{x:y.x??h,y:d.y+d.h*(y.at??.15)},_=l.ice&&y.zone==="frz"?ym(r):null;s.push(vp(e,b.x,b.y,$,i,_))}if(l.contents==="ice"&&r.ice_maker){let y=r.ice_maker.cleaning?"cleaning":r.ice_maker.paused?"paused":r.ice_maker.making?"making":null,$=g??{x:h,y:d.y+d.h*.2};y&&s.push(wp(e,$.x,$.y,i,y))}}),s}function _m(e,t,n,o){let r=t.rect,i=ao(e,t),a=i?i.y-r.y+io(e)/2:r.h*.12,s=n?.moved??{...r,k:1};return{x:s.x+r.w/2*s.k,y:s.y+a*s.k+.25*o+o/2}}function bm(e,t,n,o){let r=e.y;for(let i of n.values()){let a=i.moved;if(!a||a.y>=t.rect.y)continue;let s=a.y+a.h;s>r-o/2&&(r=s+.25*o+o/2)}return{x:e.x,y:r}}function vm(e,t){let n=e.cavity;return{x:n.x+n.w/2,y:n.y+Math.max(t,.1*n.h)}}function wm(e,t,n){let[o]=op(e,t);return o?{x:o.x+o.w/6,y:o.y+.8*n}:{x:t.cavity.x+t.cavity.w/2,y:t.cavity.y+t.cavity.h*.8}}function km(e,t,n){let o=new Set;e.fronts.forEach((i,a)=>{t[a]&&o.add(`${i.name} open`)});let r=[e.name,...o];return n.available||r.push("offline"),r.join(", ")}function Tp(e){let t={top:0,height:49.5},n={top:49.5+1.3,height:221.5},o=e?[n,{top:n.top+221.5+1.7,height:221.5}]:[n],r=e?508.75:285,i=o[o.length-1],a=i.top+i.height;return{height:r,panel:t,doors:o,vent:{top:a,height:r-a}}}var jt=e=>[298.75/2-e,298.75/2+e],[ta,na]=jt(97.25),[xm,zm]=jt(116.5),[oa,ra]=jt(127.4),[Sm,Rm]=jt(127.9),[Am,Mm]=jt(136.5),[ia,aa]=jt(105.9),[Tm,Cm]=jt(112.5),[Gm,Em]=jt(102.3);function Cp(e,t){let n=t==="m";return e==="contemporary"?{glass:{u0:0,u1:298.75,v0:15.8,v1:221.5},window:{u0:ta,u1:na,v0:43.5,v1:178.2},bevel:0,recess:0,handle:{kind:"strip",u0:0,u1:298.75,v:7.9,size:15.8},frameLine:null}:e==="transitional"?n?{glass:{u0:ia,u1:aa,v0:1,v1:178.5},window:{u0:ia+9,u1:aa-9,v0:43.5,v1:172},bevel:0,recess:0,handle:{kind:"slim",u0:Gm,u1:Em,v:16.9,size:6},frameLine:{u0:Tm,u1:Cm,v0:-42.7,v1:185.4}}:{glass:{u0:0,u1:298.75,v0:44.2,v1:178.5},window:{u0:oa,u1:ra,v0:44.2,v1:178.5},bevel:0,recess:0,handle:{kind:"slim",u0:Am,u1:Mm,v:16.5,size:6},frameLine:null}:n?{glass:{u0:ta,u1:na,v0:43.5,v1:178.2},window:{u0:ta,u1:na,v0:43.5,v1:178.2},bevel:9.4,recess:0,handle:{kind:"pro",u0:xm,u1:zm,v:17,size:12.8},frameLine:null}:{glass:{u0:oa,u1:ra,v0:44.2,v1:178.5},window:{u0:oa,u1:ra,v0:44.2,v1:178.5},bevel:0,recess:4.5,handle:{kind:"pro",u0:Sm,u1:Rm,v:16.5,size:12.8},frameLine:null}}var sa={x:120.4,y:10.7,width:58,height:27.3},lo=24.3,co=10.5,la=15.2,Gp=[74.3,224.45],Ep=[44.2,88.2,210.55,254.55],Dp={u0:ia,u1:aa,top:12.6},ca=[[19.6,141.7],[157.05,279.15]];function Er(e,t,n,o){let r=e.d/(e.d-o);return[e.cx+(t-e.cx)*r,e.cy+(n-e.cy)*r]}function Op(e,t){return{shut:!0,at:(n,o)=>[e+n,t+o]}}function Vp(e,t,n,o,r){let i=Math.cos(o),a=Math.sin(o),s=t+n;return{shut:!1,at(l,p,d=0){let u=n-p;return Er(r,e+l,s-u*i+d*a,u*a+d*i)}}}function pa(e,t,n=!1){return{cx:298.75/2,cy:e+t*(n?.2:.3),d:850}}var Dm=e=>e.lamp>0||e.heat>0;function Hp(e,t,n=0){return[e.at(t.u0,t.v0,n),e.at(t.u1,t.v0,n),e.at(t.u1,t.v1,n),e.at(t.u0,t.v1,n)]}function vt(e,t,n,o=1,r=0){if(e.shut){let[i,a]=e.at(t.u0,t.v0);return f`<rect x=${m(i)} y=${m(a)} width=${m(t.u1-t.u0)} height=${m(t.v1-t.v0)}
      fill=${n} opacity=${o} />`}return f`<polygon points=${te(Hp(e,t,r))} fill=${n} opacity=${o} />`}function he(e,t,n,o,r,i,a,s,l=0){let[p,d]=e.at(t,n,l),[u,h]=e.at(o,r,l);return f`<line x1=${m(p)} y1=${m(d)} x2=${m(u)} y2=${m(h)} stroke=${i}
    stroke-width=${a} opacity=${s} />`}function Ip(e){let t={u0:0,u1:298.75,v0:0,v1:e.height};return f`${vt(e.map,t,E(e.m.metal))}${vt(e.map,t,E(e.m.sheen))}`}function Fp(e){let{m:t,map:n,design:o}=e,r=e.style!=="professional";return f`
    ${o.frameLine?Pm(n,o.frameLine,e.height):w}
    ${r?vt(n,o.glass,E(t.blackGlass)):w}
    ${r?Lm(n,o.glass):w}
    ${Om(e)}
    ${o.bevel?Vm(t,n,o.window,o.bevel):w}
    ${o.recess?Hm(t,n,o.window,o.recess):w}
    ${Im(t,n,o.handle)}
    ${he(n,.5,.4,298.75-.5,.4,"#fff",.8,.55)}
    ${he(n,.5,e.height-.4,298.75-.5,e.height-.4,"#000",.8,.3)}
  `}function Pm(e,t,n){let o=Math.max(t.v0,0),r=Math.min(t.v1,n);return f`
    ${he(e,t.u0,o,t.u0,r,"#fff",.45,.45)}
    ${he(e,t.u0+.6,o,t.u0+.6,r,"#000",.4,.14)}
    ${he(e,t.u1,o,t.u1,r,"#fff",.45,.35)}
    ${he(e,t.u1-.6,o,t.u1-.6,r,"#000",.4,.14)}
    ${t.v1<=n?he(e,t.u0,t.v1,t.u1,t.v1,"#fff",.45,.42):w}
    ${t.v1<=n?he(e,t.u0,t.v1-.6,t.u1,t.v1-.6,"#000",.4,.12):w}
  `}function Lm(e,t){return f`
    ${he(e,t.u0,t.v0+.4,t.u1,t.v0+.4,"#000",.8,.5)}
    ${he(e,t.u0,t.v0+1.1,t.u1,t.v0+1.1,"#fff",.5,.18)}
    ${he(e,t.u0,t.v1-.3,t.u1,t.v1-.3,"#fff",.6,.22)}
  `}function Om(e){let{m:t,map:n,design:o}=e,r=o.window,i=e.style!=="professional",a=`${t.uid}-win-${e.key}`,s=`${t.uid}-vignette-${e.key}`,[l,p]=n.at(r.u0,r.v0);return f`
    <clipPath id=${a}>
      <rect x=${m(l)} y=${m(p)} width=${m(r.u1-r.u0)} height=${m(r.v1-r.v0)} />
    </clipPath>
    <g clip-path=${E(a)}>
      ${i?w:vt(n,r,E(t.glass))}
      ${Dm(e.look)?f`${Bp(t,pa(e.top,e.height),da(e.top,e.height),e.look,e.key)}
            <radialGradient id=${s} cx="0.5" cy="0.45" r="0.72">
              <stop offset="0.55" stop-color="#000" stop-opacity="0" />
              <stop offset="1" stop-color="#000" stop-opacity="0.7" />
            </radialGradient>
            ${vt(n,r,E(s))}
            ${vt(n,r,"#000",i?.24:.1)}
            ${vt(n,r,E(i?t.blackGlass:t.glass),i?.26:.16)}`:w}
    </g>
  `}function Vm(e,t,n,o){let r={u0:n.u0-o,u1:n.u1+o,v0:n.v0-o,v1:n.v1+o},i=(a,s)=>f`<polygon points=${te(a.map(([l,p])=>t.at(l,p)))} fill=${s} />`;return f`
    ${i([[r.u0,r.v0],[r.u1,r.v0],[n.u1,n.v0],[n.u0,n.v0]],E(e.bevelTop))}
    ${i([[r.u0,r.v0],[n.u0,n.v0],[n.u0,n.v1],[r.u0,r.v1]],E(e.bevelLeft))}
    ${i([[n.u1,n.v0],[r.u1,r.v0],[r.u1,r.v1],[n.u1,n.v1]],E(e.bevelRight))}
    ${i([[n.u0,n.v1],[n.u1,n.v1],[r.u1,r.v1],[r.u0,r.v1]],E(e.bevelBottom))}
    ${he(t,r.u0,r.v1,r.u1,r.v1,"#fff",.6,.12)}
    ${he(t,n.u0-.3,n.v0-.3,n.u1+.3,n.v0-.3,"#fff",.6,.55)}
    ${he(t,n.u0-.3,n.v0,n.u0-.3,n.v1,"#fff",.6,.45)}
    ${he(t,n.u1+.3,n.v0,n.u1+.3,n.v1,"#fff",.6,.5)}
    ${he(t,n.u0-.3,n.v1+.3,n.u1+.3,n.v1+.3,"#fff",.6,.35)}
  `}function Hm(e,t,n,o){let r=(i,a)=>f`<polygon points=${te(i.map(([s,l])=>t.at(s,l)))} fill=${a} />`;return f`
    ${r([[n.u1,n.v0],[n.u1+o,n.v0],[n.u1+o,n.v1+o],[n.u1,n.v1]],E(e.recessRight))}
    ${r([[n.u0,n.v1],[n.u1,n.v1],[n.u1+o,n.v1+o],[n.u0,n.v1+o]],E(e.recessBottom))}
    ${he(t,n.u0,n.v0+.25,n.u1,n.v0+.25,"#000",.5,.3)}
    ${he(t,n.u0+.25,n.v0,n.u0+.25,n.v1,"#000",.5,.3)}
  `}var po=10.2,dn=8.3;function Im(e,t,n){if(n.kind==="strip")return Fm(e,t,n);let o=n.size/2,[r,i]=t.at(n.u0,n.v),[a]=t.at(n.u1,n.v);return n.kind==="slim"?f`
      <rect x=${m(r+4)} y=${m(i+o+.4)} width=${m(a-r-8)} height="0.9" fill="#000"
        opacity="0.45" filter=${E(e.blurFine)} />
      <rect x=${m(r)} y=${m(i-o)} width=${m(a-r)} height=${m(o*2)} rx=${m(o*.25)}
        fill=${E(e.chrome)} />
    `:f`
    <rect x=${m(r+4)} y=${m(i+o)} width=${m(a-r-8)} height=${m(o*.9)}
      fill=${E(e.dropShadow)} opacity="0.45" />
    <rect x=${m(r+po)} y=${m(i-o)} width=${m(a-r-po*2)}
      height=${m(o*2)} fill=${E(e.chrome)} />
    ${Lp(e,r,i,"left")}
    ${Lp(e,a-po,i,"right")}
  `}function Lp(e,t,n,o){let r=po,i=n-dn,a=n+dn,s=1.8,l=o==="left"?`M${m(t+s)} ${m(i)}H${m(t+r)}V${m(a)}H${m(t+s)}A${s} ${s} 0 0 1 ${m(t)} ${m(a-s)}V${m(i+s)}A${s} ${s} 0 0 1 ${m(t+s)} ${m(i)}Z`:`M${m(t)} ${m(i)}H${m(t+r-s)}A${s} ${s} 0 0 1 ${m(t+r)} ${m(i+s)}V${m(a-s)}A${s} ${s} 0 0 1 ${m(t+r-s)} ${m(a)}H${m(t)}Z`,p=o==="left"?t+r:t;return f`
    <path d=${l} transform="translate(0 1.2)" fill="#000" opacity="0.08" />
    <path d=${l} fill=${E(e.chrome)} />
    <path d=${l} fill="#000" opacity="0.07" />
    <path d=${l} fill=${E(o==="left"?e.capEndLeft:e.capEndRight)} />
    <line x1=${m(p)} y1=${m(i+.5)} x2=${m(p)} y2=${m(a-.5)} stroke="#000"
      stroke-width="0.4" opacity="0.25" />
  `}function Fm(e,t,n){let o={u0:n.u0,u1:n.u1,v0:0,v1:n.size};return f`
    ${vt(t,o,E(e.metal))}
    ${he(t,0,.6,298.75,.6,"#fff",1.1,.7)}
    ${he(t,0,2.2,298.75,2.2,"#fff",.6,.25)}
    ${he(t,0,n.size-.5,298.75,n.size-.5,"#000",1,.55)}
  `}function da(e,t){return{x0:20,x1:298.75-20,y0:e+20,y1:e+t-7,zFront:-24,zBack:-214}}function Np(e,t=!1){let n=e.selfClean?1:e.heat,o=e.lamp,r=n>0&&!t?0:o,i=n*(1+.3*o)*(t?.3:1),a=e.selfClean?"#5a1806":"#4a1e0a",s=(p,d,u,h)=>we(we(p,d,r),u,i*h),l=(p,d,u,h)=>we(we(p,d,n),we(u,h,n),o);return{backTop:s("#06080f","#2b2a3c","#b4521a",.43),backBottom:s("#030409","#10133a",a,.24),wall:s("#04060c","#1d1a2c",a,.27),wallLit:s("#080a12","#3d3035","#b45a20",.33),floor:s("#030409","#181a57",a,.3),glow:we("#ffe2b4",e.selfClean?"#ff6a22":"#ff8f2e",n/Math.max(o+n,.001)),wire:l("#24180f","#9a6a38","#ddd3c4","#e2b47c"),bar:l("#3a2a1c","#ffb862","#f6eee2","#ffd9a0"),glint:l("#5a4030","#ffe0b0","#ffffff","#fff3d6"),shine:qe(o+.9*n**1.2),weight:o,bulb:s("#34312c","#fbfbf5","#ffd391",.35)}}var pn=(e,t,n)=>{let[o,r]=e(t[0],t[1],t[2]),[i,a]=e(n[0],n[1],n[2]);return`M${m(o)} ${m(r)}L${m(i)} ${m(a)}`};function Bp(e,t,n,o,r,i=!1){let a=(ge,Ne,Qe)=>Er(t,ge,Ne,Qe),{x0:s,x1:l,y0:p,y1:d,zFront:u,zBack:h}=n,g=Np(o,i),y=a(s,p,u),$=a(l,p,u),b=a(l,d,u),_=a(s,d,u),v=a(s,p,h),k=a(l,p,h),x=a(l,d,h),z=a(s,d,h),S=ge=>`${e.uid}-${ge}-${r}`,R=d-p,M=o.selfClean?1:o.heat,G=[.16,.3,.44,.58,.72,.86].map(ge=>p+R*ge),T=o.selfClean?[]:[.3,.58,.86].map(ge=>p+R*ge),O=p+R*.14,V=u-38,Q=(ge,Ne,Qe)=>f`
    <linearGradient id=${ge} gradientUnits="userSpaceOnUse" x1=${m(Ne[0])} y1="0" x2=${m(Qe[0])} y2="0">
      <stop offset="0" stop-color=${g.wallLit} />
      <stop offset="0.45" stop-color=${g.wall} />
      <stop offset="1" stop-color=${we(g.wall,"#000000",.45)} />
    </linearGradient>`,N=v[1],F=z[1],j=f`
    ${Q(S("side"),y,v)}
    ${Q(S("side-r"),$,k)}
    <linearGradient id=${S("back")} gradientUnits="userSpaceOnUse" x1="0" y1=${m(N)} x2="0" y2=${m(F)}>
      <stop offset="0" stop-color=${g.backTop} />
      <stop offset="0.55" stop-color=${we(g.backTop,g.backBottom,.6)} />
      <stop offset="1" stop-color=${g.backBottom} />
    </linearGradient>
    <linearGradient id=${S("floor")} gradientUnits="userSpaceOnUse" x1="0" y1=${m(z[1])} x2="0" y2=${m(_[1])}>
      <stop offset="0" stop-color=${we(g.floor,"#000000",.5)} />
      <stop offset="1" stop-color=${g.floor} />
    </linearGradient>
    <polygon points=${te([v,k,x,z])} fill=${E(S("back"))} />
    <polygon points=${te([y,v,z,_])} fill=${E(S("side"))} />
    <polygon points=${te([k,$,b,x])} fill=${E(S("side-r"))} />
    ${p<t.cy?f`<polygon points=${te([y,$,k,v])} fill=${we(g.wall,"#000000",.3)} />`:w}
    ${d>t.cy?f`<polygon points=${te([z,x,b,_])} fill=${E(S("floor"))} />`:w}
  `,[W,ee]=a(s+(l-s)*.22,p+R*.17,h),[be,Ce]=a(l-(l-s)*.22,d-R*.17,h),re=be-W,pe=Ce-ee,Ze=[0,1,2].flatMap(ge=>[0,1].map(Ne=>f`<rect x=${m(W+re*(.14+Ne*.42))} y=${m(ee+pe*(.3+ge*.17))}
        width=${m(re*.3)} height=${m(Math.max(pe*.05,1))} rx=${m(Math.max(pe*.025,.5))}
        fill="#000" opacity="0.16" />`)),me=f`
    <rect x=${m(W)} y=${m(ee)} width=${m(re)} height=${m(pe)} rx="6" fill=${E(S("back"))} />
    <rect x=${m(W)} y=${m(ee)} width=${m(re)} height=${m(pe)} rx="6" fill="#000" opacity="0.1" />
    ${Ze}
    <line x1=${m(W+6)} y1=${m(ee+.4)} x2=${m(be-6)} y2=${m(ee+.4)} stroke="#fff" stroke-width="0.5"
      opacity="0.06" />
    <line x1=${m(W+6)} y1=${m(Ce)} x2=${m(be-6)} y2=${m(Ce)} stroke="#000" stroke-width="0.8"
      opacity="0.15" />`,J=T.map(ge=>jm(a,s+4,l-4,ge,u-10,h+14,g)),Y=f`<radialGradient id=${S("bloom")}>
    <stop offset="0" stop-color="#fff8ea" stop-opacity="0.9" />
    <stop offset="0.3" stop-color=${g.glow} stop-opacity="0.45" />
    <stop offset="1" stop-color=${g.glow} stop-opacity="0" />
  </radialGradient>`,oe=[s,l].map(ge=>{let[Ne,Qe]=a(ge,O,V),gn=ge===s?1.2:-1.2;return f`
      <ellipse cx=${m(Ne+gn*3)} cy=${m(Qe)} rx="13" ry="16" fill=${E(S("bloom"))}
        opacity=${m(.75*o.lamp+.15*M)} />
      <ellipse cx=${m(Ne+gn)} cy=${m(Qe)} rx="1.2" ry="3" fill=${g.bulb} />`}),[Ae]=a((s+l)/2,p,h),_e=qe(.08*o.lamp+(i?.3:.85)*M**1.5),it=f`
    <radialGradient id=${S("glow")} gradientUnits="userSpaceOnUse" cx=${m(Ae)} cy=${m(N)}
      r=${m((l-s)*.42)}>
      <stop offset="0" stop-color=${g.glow} stop-opacity="0.95" />
      <stop offset="0.25" stop-color=${g.glow} stop-opacity="0.5" />
      <stop offset="0.6" stop-color=${g.glow} stop-opacity="0.08" />
      <stop offset="1" stop-color=${g.glow} stop-opacity="0" />
    </radialGradient>
    <rect x=${m(y[0])} y=${m(y[1])} width=${m($[0]-y[0])} height=${m(_[1]-y[1])}
      fill=${E(S("glow"))} opacity=${m(_e)} />`,kt=o.lamp>0&&M>0?f`
        <linearGradient id=${S("wash")} gradientUnits="userSpaceOnUse" x1="0" y1=${m(y[1])} x2="0"
          y2=${m((y[1]+_[1])/2)}>
          <stop offset="0" stop-color="#fff1d6" stop-opacity=${m(.2*o.lamp*Math.min(1,M*2))} />
          <stop offset="1" stop-color="#fff1d6" stop-opacity="0" />
        </linearGradient>
        <rect x=${m(y[0])} y=${m(y[1])} width=${m($[0]-y[0])}
          height=${m((_[1]-y[1])/2)} fill=${E(S("wash"))} />`:w;return f`
    ${Y}
    ${j}
    ${me}
    ${it}
    ${kt}
    ${M>0&&p<t.cy?Nm(e,a,n,M,o.selfClean):w}
    ${Bm(a,n,G,g)}
    ${J}
    ${o.probe&&!o.selfClean?Um(a,n,T[1]??p+R*.58,g):w}
    ${oe}
  `}function Nm(e,t,n,o,r){let i=n.y0+3,a=n.x0+26,s=n.x1-26,l=[n.zFront-34,(n.zFront+n.zBack)/2,n.zBack+30],p=[];l.forEach((h,g)=>{let[y,$]=g%2?[s,a]:[a,s];p.push(t(y,i,h),t($,i,h))});let d=we("#3a1609",r?"#ff6326":"#ff7d22",o),u=we("#4a1c0b",r?"#ffb070":"#ffc06a",o);return f`
    <polyline points=${te(p)} fill="none" stroke=${d} stroke-width="5" stroke-linejoin="round"
      opacity=${m(.75*o)} filter=${E(e.blur)} />
    <polyline points=${te(p)} fill="none" stroke=${d} stroke-width="1.9" stroke-linejoin="round" />
    <polyline points=${te(p)} fill="none" stroke=${u} stroke-width="0.6" stroke-linejoin="round" />
  `}function Bm(e,t,n,o){let r=t.zFront-12,i=t.zBack+20,a=n[0]-8,s=n[n.length-1]+5,l="";for(let p of[t.x0+2.5,t.x1-2.5]){l+=pn(e,[p,a,r],[p,s,r])+pn(e,[p,a,i],[p,s,i]);for(let d of n)l+=pn(e,[p,d,r],[p,d,i]),l+=pn(e,[p,d,r-7],[p,d+2.6,r-7]),l+=pn(e,[p,d+2.6,r-7],[p,d+2.6,r])}return f`<path d=${l} fill="none" stroke=${o.wire} stroke-width=${m(.9+.3*o.weight)}
    stroke-linejoin="round" opacity=${m(.3+.55*o.shine)} />`}function jm(e,t,n,o,r,i,a){let l="";for(let d=0;d<=26;d++){let u=t+(n-t)*d/26;l+=pn(e,[u,o,r],[u,o,i])}let p=d=>pn(e,[t,o,d],[n,o,d]);return f`
    <path d=${p(i)+p((r+i)/2)} fill="none" stroke=${a.wire} stroke-width="0.6" opacity="0.5" />
    <path d=${l} fill="none" stroke=${a.wire} stroke-width=${m(.35+.3*a.weight)}
      opacity=${m(.32+.4*a.weight)} />
    <path d=${p(r)} fill="none" stroke="#000" stroke-width="1.3" opacity="0.35" transform="translate(0 1.2)" />
    <path d=${p(r)} fill="none" stroke=${a.bar} stroke-width=${m(1.3+.4*a.weight)}
      opacity=${m(.35+.65*a.shine)} />
    <path d=${p(r)} fill="none" stroke=${a.glint} stroke-width="0.7" stroke-linecap="round" stroke-dasharray="0.5 2"
      opacity=${m(a.shine)} />
  `}function Um(e,t,n,o){let[r,i]=e(t.x0,t.y0+(t.y1-t.y0)*.24,t.zFront-30),[a,s]=e((t.x0+t.x1)/2-12,n-6,(t.zFront+t.zBack)/2),l=`M${m(r)} ${m(i)}C${m(r+22)} ${m(i+30)} ${m(a-34)} ${m(s+6)} ${m(a)} ${m(s)}`;return f`<path d=${l} fill="none" stroke=${o.wire} stroke-width="0.5" stroke-linecap="round"
    opacity=${m(.3+.4*o.shine)} />`}function ua(e,t){let n=da(e,t),o=pa(e,t,!0),[r,i]=Er(o,n.x0,n.y0,n.zFront),[a,s]=Er(o,n.x1,n.y1,n.zFront);return{x0:r,y0:i,x1:a,y1:s}}function jp(e,t,n,o,r){let i=da(t,n),a=pa(t,n,!0),s=`${e.uid}-opening-${r}`,{x0:l,y0:p,x1:d,y1:u}=ua(t,n),h=22,g=d-l,y=u-p,$=(b,_,v,k,x)=>f`<rect x=${m(l+b)} y=${m(p+b)} width=${m(g-b*2)} height=${m(y-b*2)}
      rx=${m(h-b)} fill="none" stroke=${_} stroke-width=${v} opacity=${k}
      stroke-dasharray=${x??w} />`;return f`
    <rect x="0" y=${m(t)} width=${298.75} height=${m(n)} fill=${E(e.metal)} />
    <rect x="0" y=${m(t)} width=${298.75} height=${m(n)} fill="#000" opacity="0.2" />
    <rect x="0" y=${m(t)} width=${298.75} height="5" fill=${E(e.dropShadow)} />
    <clipPath id=${s}>
      <rect x=${m(l)} y=${m(p)} width=${m(g)} height=${m(y)} rx=${h} />
    </clipPath>
    <g clip-path=${E(s)}>${Bp(e,a,i,o,r,!0)}</g>
    ${$(0,"#8e8f90",5.5,1)}
    ${$(0,"#b4b5b6",5.5,.3,"0.5 0.7")}
    ${$(2.4,"#c3c4c5",.7,.55)}
    ${$(-2.6,"#000",.8,.35)}
  `}function Up(e){let{m:t,map:n}=e,o=24,r=e.height,i=Np(e.look,!0),a={u0:26,u1:298.75-26,v0:16,v1:r-24},s=`${t.uid}-inner-glass-${e.key}`,l=`${t.uid}-slot-${e.key}`,p=[n.at(0,0,-o),n.at(298.75,0,-o),n.at(298.75,0,0),n.at(0,0,0)],[,d]=n.at(0,a.v1,-o),[,u]=n.at(0,a.v0,-o),h=[.18,.42,.7].map(g=>he(n,a.u0+6,a.v1-(a.v1-a.v0)*g,a.u1-6,a.v1-(a.v1-a.v0)*g,i.bar,.8,m(.62-g*.3),-o));return f`
    <linearGradient id=${s} gradientUnits="userSpaceOnUse" x1="0" y1=${m(d)} x2="0" y2=${m(u)}>
      <stop offset="0" stop-color=${we("#2c2a2a",i.glow,.42)} />
      <stop offset="0.55" stop-color=${we("#222224",i.glow,.12)} />
      <stop offset="1" stop-color="#191a1c" />
    </linearGradient>
    <linearGradient id=${l} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2b2c2e" />
      <stop offset="1" stop-color="#3d3e40" />
    </linearGradient>
    <g filter=${E(t.grain)}>
      <polygon points=${te(Hp(n,{u0:0,u1:298.75,v0:0,v1:r},-o))} fill=${E(t.metal)} />
      <polygon points=${te(p)} fill=${E(t.metal)} />
    </g>
    ${vt(n,{u0:0,u1:298.75,v0:0,v1:r},"#fff",.1,-o)}
    ${vt(n,a,E(s),1,-o)}
    ${h}
    ${he(n,a.u0,a.v0,a.u1,a.v0,"#fff",.5,.35,-o)}
    ${he(n,0,r,298.75,r,"#000",.8,.45,-o)}
    <polygon points=${te(p)} fill="#000" opacity="0.28" />
    ${Km(n,l)}
    ${Wm(t,n,e.design.handle)}
  `}function Km(e,t){let n=24,o=[],r=5,i=14,a=7,s=(298.75-i*2-a*(r-1))/r,[,l]=e.at(0,0,-n*.73),[,p]=e.at(0,0,-n*.27),d=p-l;for(let u=0;u<r;u++){let h=i+u*(s+a),[g]=e.at(h,0,-n*.5),[y]=e.at(h+s,0,-n*.5),$=y-g;o.push(f`
      <rect x=${m(g-.7)} y=${m(l-.7)} width=${m($+1.4)} height=${m(d+1.4)}
        rx=${m(d/2+.7)} fill="#cfd0d1" opacity="0.45" />
      <rect x=${m(g)} y=${m(l)} width=${m($)} height=${m(d)} rx=${m(d/2)}
        fill=${E(t)} />`)}return f`
    ${o}
    <polyline points=${te([e.at(0,0,-n),e.at(298.75,0,-n)])} stroke="#fff" stroke-width="0.9" opacity="0.75" />
    <polyline points=${te([e.at(0,0,0),e.at(298.75,0,0)])} stroke="#000" stroke-width="0.8" opacity="0.35" />
  `}function Wm(e,t,n){if(n.kind==="strip")return f``;let o=Wp(n),r=n.size/2,i=n.kind==="pro"?po:0,[a,s]=t.at(n.u0+i,n.v,o),[l]=t.at(n.u1-i,n.v,o),p=(l-a)/(n.u1-n.u0-i*2),d=r*p,u=f`
    <rect x=${m(a)} y=${m(s-d)} width=${m(l-a)} height=${m(d*2)}
      rx=${n.kind==="slim"?m(d*.25):0} fill=${E(e.chrome)} />
    <rect x=${m(a)} y=${m(s-d)} width=${m(l-a)} height=${m(d)} fill="#000"
      opacity="0.22" />`;if(n.kind==="slim"){let g=[n.u0+6,n.u1-6].map(y=>{let[$,b]=t.at(y-1.8,n.v,0),[_,v]=t.at(y+1.8,n.v,o);return f`<rect x=${m($)} y=${m(b)} width=${m(_-$)} height=${m(v-b)}
        fill=${E(e.chrome)} />
        <rect x=${m($)} y=${m(b)} width=${m(_-$)} height=${m(v-b)} fill="#000"
          opacity="0.4" />`});return f`${g}${u}`}let h=[n.u0,n.u1-i].map((g,y)=>{let $=[t.at(g,n.v-dn,0),t.at(g+i,n.v-dn,0),t.at(g+i,n.v-dn,o+r),t.at(g,n.v-dn,o+r)];return f`
      <polygon points=${te($)} fill=${E(e.chrome)} />
      <polygon points=${te($)} fill=${E(y?e.capEndRight:e.capEndLeft)} />
      <polygon points=${te($)} fill="#000" opacity="0.42" />`});return f`${u}${h}`}function Kp(e){let t=e.design.handle;if(t.kind==="strip")return e.map.at(0,0,0)[1];let n=Wp(t),o=t.size/2,r=e.map.at(t.u0,t.v,n+o)[1],i=t.kind==="pro"?e.map.at(t.u0,t.v-dn,n+o)[1]:r;return Math.max(r,i)+1}var Wp=e=>e.kind==="pro"?18:18*.75;var Ut="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",uo="font-variant-numeric: tabular-nums",Zm=6;function Qp(e){let{m:t}=e;if(e.style==="contemporary")return f`
      <rect x="0" y="0" width=${298.75} height=${49.5} fill=${E(t.blackGlass)} />
      <line x1="0" y1="0.4" x2=${298.75} y2="0.4" stroke="#fff" stroke-width="0.8" opacity="0.18" />
      ${fa(e,!1)}
    `;if(e.style==="transitional"&&e.series==="m"){let o=Dp,r=o.u0-6.6,i=o.u1+6.6;return f`
      <line x1="0" y1="0.4" x2=${298.75} y2="0.4" stroke="#fff" stroke-width="0.8" opacity="0.5" />
      <line x1=${m(r)} y1="8.1" x2=${m(i)} y2="8.1" stroke="#fff" stroke-width="0.45" opacity="0.45" />
      <line x1=${m(r)} y1="8.7" x2=${m(i)} y2="8.7" stroke="#000" stroke-width="0.4" opacity="0.12" />
      <line x1=${m(r)} y1="8.1" x2=${m(r)} y2=${49.5} stroke="#fff" stroke-width="0.45" opacity="0.45" />
      <line x1=${m(i)} y1="8.1" x2=${m(i)} y2=${49.5} stroke="#fff" stroke-width="0.45" opacity="0.35" />
      <rect x=${m(o.u0)} y=${o.top} width=${m(o.u1-o.u0)} height=${m(49.5-o.top)}
        fill=${E(t.blackGlass)} />
      <line x1=${m(o.u0)} y1=${o.top+.4} x2=${m(o.u1)} y2=${o.top+.4} stroke="#000" stroke-width="0.8" opacity="0.5" />
      ${fa(e,!1)}
    `}let n=e.knobs&&e.style==="professional";return f`
    <line x1="0" y1="0.4" x2=${298.75} y2="0.4" stroke="#fff" stroke-width="0.8" opacity="0.5" />
    ${n?n0(e):o0(e.double,e.darkFinish)}
    ${qm(t)}
    ${fa(e,!0)}
  `}function qm(e){let{x:t,y:n,width:o,height:r}=sa,i=2.3;return f`
    <rect x=${t-i} y=${n-i} width=${o+i*2} height=${r+i*2} rx="0.8" fill="#fff" opacity="0.13" />
    <line x1=${t-i} y1=${n-i+.3} x2=${t+o+i} y2=${n-i+.3} stroke="#000" stroke-width="0.5" opacity="0.12" />
    <line x1=${t-i} y1=${n+r+i-.3} x2=${t+o+i} y2=${n+r+i-.3} stroke="#fff"
      stroke-width="0.6" opacity="0.5" />
    <rect x=${t} y=${n} width=${o} height=${r} fill="#2c2c2c" />
    <rect x=${t} y=${n} width=${o} height=${r} fill=${E(e.glass)} opacity="0.35" />
    <line x1=${t} y1=${n+.4} x2=${t+o} y2=${n+.4} stroke="#000" stroke-width="0.8" opacity="0.5" />
    <line x1=${t} y1=${n+r-.3} x2=${t+o} y2=${n+r-.3} stroke="#fff" stroke-width="0.4" opacity="0.12" />
  `}function fa(e,t){let{x:n,y:o,width:r,height:i}=sa,a=e.cavities.filter(v=>v.oven.on&&v.oven.temp),s=a.length===1&&a[0].position==="single"?4.6:3.6,l=e.unitsPerPixel===null||s/e.unitsPerPixel>=Zm,p=l&&e.cavities.some(v=>v.oven.probe),d=l&&e.cavities.some(v=>v.oven.remote_ready),u=l&&e.cavities.some(v=>v.oven.on&&v.oven.self_clean),h=[p?Xm:null,d?Qm:null,u?Jm:null].filter(v=>v!==null);if(!a.length&&!e.display&&!h.length)return f``;let g=t?3:1,y=n+g,$=n+r-g,b=[],_=v=>h.map((k,x)=>k($-3.2-x*7.2,v));if(!a.length)e.display&&b.push(f`<text x=${n+r/2} y=${o+i*.62} text-anchor="middle" font-size="10.5"
        font-weight="300" fill="#f2f2f2" font-family=${Ut} style=${uo}>${e.display}</text>`),b.push(..._(o+i-4.6));else if(a.length===1&&a[0].position==="single"){let v=a[0].oven,k=!v.preheated&&v.progress!==null&&v.progress<1,x=$-y-.4-(h.length?8:0);b.push(f`
      <text x=${y} y=${o+i*.58} font-size="11.5" font-weight="300" fill="#f4f4f4"
        font-family=${Ut} style=${uo}>${v.temp}</text>
      ${v.mode&&l?Zp(y+.4,o+i*.84,v.mode,4.6,x,"#c9c9c9"):w}
      ${k?qp(y,o+i-2.6,$-y,v.progress??0):w}`),e.display&&l&&b.push(f`<text x=${$} y=${o+6.6} text-anchor="end" font-size="4.8" fill="#e6e6e6"
        font-family=${Ut} style=${uo}>${e.display}</text>`),b.push(..._(o+i*.55))}else{let v=a.slice(0,2),k=(i-2)/2,x=$-(h.length?6.5:0);v.forEach((z,S)=>{let R=o+1+k*S,M=z.oven,G=!M.preheated&&M.progress!==null&&M.progress<1;b.push(f`
        ${Ym(y+.3,R+3,z.position==="lower")}
        <text x=${y+6} y=${R+k*.66} font-size="7" font-weight="300" fill="#f4f4f4"
          font-family=${Ut} style=${uo}>${M.temp}</text>
        ${M.mode&&l?Zp(y+27,R+k*.64,M.mode,3.6,x-y-27,"#c9c9c9"):w}
        ${G?qp(y+6,R+k-1.2,x-y-6,M.progress??0):w}`)}),e.display&&l&&b.push(f`<text x=${x} y=${o+i-1.6} text-anchor="end" font-size="3.6" fill="#e6e6e6"
        font-family=${Ut} style=${uo}>${e.display}</text>`),h.forEach((z,S)=>b.push(z($-2.6,o+5+S*7.6)))}return f`<g>${b}</g>`}function Zp(e,t,n,o,r,i){let s=n.length*o*.56>r?m(r):null;return f`<text x=${m(e)} y=${m(t)} font-size=${o} fill=${i} font-family=${Ut}
    textLength=${s??w} lengthAdjust=${s?"spacingAndGlyphs":w}>${n}</text>`}function qp(e,t,n,o){let r=Math.max(.8,n*Math.min(1,Math.max(0,o)));return f`
    <rect x=${m(e)} y=${m(t)} width=${m(n)} height="0.9" rx="0.45" fill="#fff" opacity="0.18" />
    <rect x=${m(e)} y=${m(t)} width=${m(r)} height="0.9" rx="0.45" fill="#c8333c" />
  `}function Ym(e,t,n){return f`
    <rect x=${m(e)} y=${m(t)} width="3.6" height="2.2" rx="0.4" fill=${n?"none":"#f0f0f0"}
      stroke="#f0f0f0" stroke-width="0.45" />
    <rect x=${m(e)} y=${m(t+2.9)} width="3.6" height="2.2" rx="0.4" fill=${n?"#f0f0f0":"none"}
      stroke="#f0f0f0" stroke-width="0.45" />
  `}function Xm(e,t){return f`<g fill="none" stroke="#f0f0f0" stroke-width="0.6" stroke-linecap="round">
    <line x1=${m(e-3)} y1=${m(t+2)} x2=${m(e+1.2)} y2=${m(t-2.2)} />
    <circle cx=${m(e+2)} cy=${m(t-3)} r="1.2" fill="#f0f0f0" />
  </g>`}function Qm(e,t){return f`<g fill="none" stroke="#f0f0f0" stroke-width="0.6" stroke-linecap="round">
    <path d=${`M ${m(e-3.2)} ${m(t-1.2)} A 4.6 4.6 0 0 1 ${m(e+3.2)} ${m(t-1.2)}`} />
    <path d=${`M ${m(e-1.9)} ${m(t+.2)} A 2.7 2.7 0 0 1 ${m(e+1.9)} ${m(t+.2)}`} />
    <circle cx=${m(e)} cy=${m(t+1.8)} r="0.6" fill="#f0f0f0" stroke="none" />
  </g>`}function Jm(e,t){return f`<g fill="none" stroke="#f0f0f0" stroke-width="0.6">
    <rect x=${m(e-2.1)} y=${m(t-.6)} width="4.2" height="3.2" rx="0.5" fill="#f0f0f0" />
    <path d=${`M ${m(e-1.3)} ${m(t-.6)} V ${m(t-1.9)} A 1.3 1.3 0 0 1 ${m(e+1.3)} ${m(t-1.9)} V ${m(t-.6)}`} />
  </g>`}var e0=[[-120,"MORE"],[-90,"ROAST"],[-60,"BROIL"],[-30,"BAKE"],[0,"OFF"],[30,"CONV"],[60,"C ROAST"],[90,"WARM"],[120,"GOURMET"]],t0=[[-52,"LO"],[-36,"\xB7"],[-22,"\xB7"],[0,"TEMP"],[22,"\xB7"],[36,"\xB7"],[52,"HI"]];function n0(e){let t=e.double?Ep:Gp,n=e.double?co*.975:co,o=n*(la/co)+1.5,r=a=>e.cavities.find(l=>l.position===a)?.oven.on?-30:0,i=e.double?[{mode:t[0],temp:t[1],angle:r("upper"),caption:"UPPER OVEN"},{mode:t[2],temp:t[3],angle:r("lower"),caption:"LOWER OVEN"}]:[{mode:t[0],temp:t[1],angle:r("single"),caption:null}];return f`${i.map(a=>f`
      ${Xp(a.mode,lo,o,e0,e.darkFinish)}
      ${Xp(a.temp,lo,o,t0,e.darkFinish)}
      ${a.caption?ed((a.mode+a.temp)/2,40.2,a.caption,e.darkFinish):w}
      ${Yp(e.m,a.mode,lo,n,a.angle,e.reducedMotion)}
      ${Yp(e.m,a.temp,lo,n,0,e.reducedMotion)}`)}`}function Yp(e,t,n,o,r,i){let a=o*(la/co),s=(a+o)/2,l=`transform-origin: ${t}px ${n}px; transform: rotate(${r}deg);${i?"":" transition: transform 400ms ease;"}`,p=o*.335,d=(u,h,g)=>{let y=$=>{let b=$*Math.PI/180;return`${m(t+g*Math.cos(b))} ${m(n+g*Math.sin(b))}`};return`M ${y(u)} A ${g} ${g} 0 0 1 ${y(h)}`};return f`
    <circle cx=${t} cy=${n+.9} r=${a+.5} fill="#000" opacity="0.06" />
    <circle cx=${t} cy=${n} r=${s} fill="none" stroke=${E(e.metal)} stroke-width=${m(a-o)} />
    <circle cx=${t} cy=${n} r=${s} fill="none" stroke=${E(t<298.75/2?e.bezelRight:e.bezelLeft)}
      stroke-width=${m(a-o)} />
    <circle cx=${t} cy=${n} r=${m(a+.4)} fill="none" stroke="#000" stroke-width="0.5" opacity="0.22" />
    <circle cx=${t} cy=${n} r=${m(o+.95)} fill="none" stroke="#fff" stroke-width="1" opacity="0.18" />
    <path d=${d(195,345,o+.9)} fill="none" stroke="#fff" stroke-width="0.6" stroke-linecap="round" opacity="0.4" />
    <circle cx=${t} cy=${n} r=${o} fill=${E(e.knob)} />
    <circle cx=${t} cy=${n} r=${m(o+.15)} fill="none" stroke="#000" stroke-width="0.7" opacity="0.5" />
    <path d=${d(200,340,o-.4)} fill="none" stroke=${E(e.knobRim)} stroke-width="0.8" stroke-linecap="round"
      opacity="0.6" />
    <g style=${l}>
      <rect x=${m(t-p)} y=${m(n-o*.94)} width=${m(p*2)} height=${m(o*1.88)}
        rx=${m(o*.2)} fill=${E(e.knob)} />
      <line x1=${m(t+p-.4)} y1=${m(n-o*.84)} x2=${m(t+p-.4)} y2=${m(n+o*.84)}
        stroke="#000" stroke-width="0.8" opacity="0.18" />
      <line x1=${m(t-p+.35)} y1=${m(n-o*.84)} x2=${m(t-p+.35)} y2=${m(n+o*.84)}
        stroke="#fff" stroke-width="0.6" opacity="0.12" />
    </g>
  `}var Jp=e=>e?"#d4d5d6":"#2a2c2f";function Xp(e,t,n,o,r){return f`${o.map(([i,a])=>f`<text x=${e} y=${m(t-n)} transform=${`rotate(${i} ${e} ${t})`}
      text-anchor="middle" font-size=${a==="\xB7"?2.6:1.85} font-weight="600" letter-spacing="0.03"
      fill=${Jp(r)} opacity=${r?.6:.92} font-family=${Ut}>${a}</text>`)}`}function ed(e,t,n,o,r=1.85){return f`<text x=${m(e)} y=${m(t)} text-anchor="middle" font-size=${r} font-weight="600"
    letter-spacing="0.03" fill=${Jp(o)} opacity=${o?.6:.92} font-family=${Ut}>${n}</text>`}function o0(e,t){let n=["BAKE","ROAST","BROIL","WARM","CLEAN"],o=["CONV","C ROAST","PROOF","GOURMET","MORE"],r=[],i=(a,s,l,p)=>r.push(ed(a,s,l,t,p));if(n.forEach((a,s)=>i(19.3+s*13.4,20.3,a)),o.forEach((a,s)=>i(19.3+s*13.4,30.2,a)),e)for(let[a,s]of[[84.5,!0],[97.5,!1]])i(a,19.4,s?"UPPER":"LOWER",1.6),i(a,21.3,"ON",1.6),i(a,29.3,s?"UPPER":"LOWER",1.6),i(a,31.2,"OFF",1.6);else i(94.9,30.2,"OFF");i(203.4,20.3,"CLEAR"),i(203.4,29.3,"START",1.6),i(203.4,31.2,"ENTER",1.6);for(let a=0;a<5;a++)i(228.3+a*12.7,20.4,String(a+1),2.2),i(228.3+a*12.7,30.3,String((a+6)%10),2.2);return f`${r}`}var r0="rgba(20, 22, 25, 0.6)",i0="rgba(255, 255, 255, 0.22)",a0="font-family: var(--ha-font-family-body, Roboto, system-ui); font-variant-numeric: tabular-nums",We=20,ya=12,ma=16,ga=7,s0=9,Dr=4,ha=5.6;function td(e,t){let n=.125*e/We;return t&&t>0?Math.min(e/t,n):.03*e/ya}function nd(e){let t=[];e.probe&&t.push("probe"),e.remote_ready&&t.push("remote");let n=null;if(e.on&&e.self_clean)n={text:e.temp,progress:null,icon:"lock"};else if(e.on){let r=!e.preheated&&e.progress!==null?Math.min(1,Math.max(0,e.progress??0)):null;(e.temp||r!==null)&&(n={text:e.temp,progress:r,icon:null})}return n||t.length?{label:n,chips:t}:null}function l0(e){let t=0;for(let n of e)t+=/[:.,'° ]/.test(n)?.34:/[0-9]/.test(n)?.6:.64;return t*ya}function od(e){if(!e.text)return We;let t=e.progress!==null||e.icon?ma:0;return Math.max(We,ga+t+l0(e.text)+s0)}function rd(e,t,n,o=13){let r=e==="remote"?f`<g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round">
          <path d="M-7.2 -1.6A10 10 0 0 1 7.2 -1.6" />
          <path d="M-4.4 1.4A6 6 0 0 1 4.4 1.4" />
          <circle cx="0" cy="5" r="1.3" fill="#fff" stroke="none" />
        </g>`:e==="probe"?f`<g fill="none" stroke="#fff" stroke-linecap="round">
            <path d="M-2.4 2.4L6.4 -6.4" stroke-width="1.8" />
            <path d="M-6.6 6.6L-2.8 2.8" stroke-width="4.4" />
          </g>`:f`<path d="M-4 -1.5V-3.8A4 4 0 0 1 4 -3.8V-1.5" fill="none" stroke="#fff" stroke-width="2" />
            <rect x="-6" y="-1.5" width="12" height="9" rx="1.8" fill="#fff" />`;return f`<g transform=${`translate(${t} ${n}) scale(${o/20})`} opacity="0.85">${r}</g>`}function id(e,t,n,o){let r=We/2;return f`
    <rect x=${t+.5} y=${n+1.2} width=${o-1} height=${We} rx=${r} fill="#000" opacity="0.28"
      filter=${E(e.pillShadow)} />
    <rect x=${t} y=${n} width=${o} height=${We} rx=${r} fill=${r0} stroke=${i0} stroke-width="1" />
  `}function c0(e,t,n,o,r){let i=od(o),a=o.progress!==null||!!o.icon,s=o.text?t+ga+ma/2:t+i/2,l=2*Math.PI*ha;return f`
    ${id(e,t,n-We/2,i)}
    ${o.progress!==null?f`
          <circle cx=${s} cy=${n} r=${ha} fill="none" stroke="#fff" stroke-opacity="0.24" stroke-width="1.9" />
          <circle cx=${s} cy=${n} r=${ha} fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round"
            stroke-dasharray=${m(l)} stroke-dashoffset=${m(l*(1-o.progress))}
            transform=${`rotate(-90 ${s} ${n})`}
            style=${r?"":"transition: stroke-dashoffset 0.6s ease"} />`:o.icon?rd(o.icon,s,n):w}
    ${o.text?f`<text x=${a?t+ga+ma:t+i/2} y=${n} fill="#fff" font-size=${ya} font-weight="600"
            text-anchor=${a?"start":"middle"} dominant-baseline="central" style=${a0}>${o.text}</text>`:w}
  `}function p0(e,t,n,o){return f`${id(e,t,n-We/2,We)}${rd(o,t+We/2,n)}`}function ad(e,t,n,o,r){let i=[...n.label?[{w:od(n.label),draw:(u,h)=>c0(e,u,h,n.label,r)}]:[],...n.chips.map(u=>({w:We,draw:(h,g)=>p0(e,h,g,u)}))],a=(t.x1-t.x0)/o-8,s=[];for(let u of i){let h=s[s.length-1],g=h?h.reduce((y,$)=>y+$.w+Dr,0):0;h&&g+u.w<=a?h.push(u):s.push([u])}let l=(t.y1-t.y0)/o,p=Math.max(.3*l-We/2,.06*l),d=(t.x0+t.x1)/2;return f`<g transform=${`translate(${m(d)} ${m(t.y0)}) scale(${Math.round(o*1e3)/1e3})`}>
    ${s.map((u,h)=>{let g=u.reduce((b,_)=>b+_.w,0)+Dr*(u.length-1),y=p+We/2+h*(We+Dr),$=-g/2;return u.map(b=>{let _=b.draw(m($),m(y));return $+=b.w+Dr,_})})}
  </g>`}var u0=88*Math.PI/180,fo={x:8,top:4,bottom:16},sd=e=>{let t=e.spec;if(t.family!=="wall_oven")return null;let n=t.form==="double",o=e.appearance.style??t.style??"professional",r=t.series==="m"||t.series===null?"m":"e",i=m0(e.appearance.finish),a=Tp(n),s=g0(t,n),l=yr(e.uid),p=Cp(o,r),d=e.reducedMotion??!1,u=s.map(S=>({position:S.position==="lower"?"lower":S.position==="upper"?"upper":"single",oven:e.state.ovens?.[S.prefix]??$a})),h=a.doors.map((S,R)=>{let M=u[R]?.oven??$a;return{m:l,map:M.door_open?Vp(0,S.top,S.height,u0,h0(S.top)):Op(0,S.top),design:p,style:o,height:S.height,look:y0(M),top:S.top,key:String(R)}}),g=h.filter(S=>!S.map.shut),y=Math.max(a.height,...g.map(Kp)),$=m(y+fo.top+fo.bottom),b=[-fo.x,-fo.top,m(298.75+fo.x*2),$].join(" "),_=e.state.available,v=b0(n,u,_),k=o==="professional"&&(r==="m"||t.knob),x=td($,e.pixelHeight),z=_?h.flatMap((S,R)=>{let M=nd(u[R]?.oven??$a);return M?[ad(l,f0(S),M,x,d)]:[]}):[];return A`<svg
    viewBox=${b}
    role="img"
    aria-label=${v}
    style="overflow: visible"
  >
    ${f`
      <defs>${$r(l,{finish:i,knobs:e.appearance.knobs,x:0,y:0,width:298.75,height:a.height,parts:{glass:o==="professional"||o==="transitional"&&r==="e",blackGlass:o!=="professional",caps:p.handle.kind==="pro",knob:k,bezel:k,bevel:p.bevel>0,recess:p.recess>0,dropShadow:p.handle.kind==="pro"||g.length>0,fineBlur:p.handle.kind==="slim",pills:z.length>0,offline:!_}})}</defs>
      ${Ol(l,298.75/2,y+3,298.75*.56,8,e.theme)}
      <g filter=${_?w:E(l.offline)}>
        <g filter=${E(l.grain)}>
          <rect x="0" y="0" width=${298.75} height=${49.5} fill=${E(l.metal)} />
          <rect x="0" y="0" width=${298.75} height=${49.5} fill=${E(l.sheen)} />
          ${h.filter(S=>S.map.shut).map(S=>Ip(S))}
          <rect x="0" y=${m(a.vent.top)} width=${298.75} height=${m(a.vent.height)}
            fill=${E(l.metal)} />
        </g>
        ${$0(a)}
        ${Qp({m:l,darkFinish:i!=="stainless",style:o,series:r,double:n,knobs:k,cavities:u,display:e.state.display??null,reducedMotion:d,unitsPerPixel:e.pixelHeight?$/e.pixelHeight:null})}
        ${h.map(S=>S.map.shut?Fp(S):w)}
        ${_0(l,a)}
        ${g.map(S=>jp(l,S.top,S.height,S.look,S.key))}
        ${g.map(S=>Up(S))}
      </g>
      ${z}
    `}
  </svg>`};function f0(e){if(!e.map.shut)return ua(e.top,e.height);let t=e.design.window;return{x0:t.u0,y0:e.top+t.v0,x1:t.u1,y1:e.top+t.v1}}var $a={on:!1,preheated:!1,progress:null,light:!1,door_open:!1,probe:!1,remote_ready:!1,self_clean:!1,temp:null,mode:null};function h0(e){return{cx:298.75/2,cy:e-110,d:2200}}function m0(e){return e==="black"||e==="carbon"?e:"stainless"}function g0(e,t){return e.ovens.length===(t?2:1)?e.ovens:t?[{prefix:"cav",position:"upper",width:null},{prefix:"cav2",position:"lower",width:null}]:[{prefix:"cav",position:"single",width:null}]}function y0(e){let t=0;return e.on&&(e.self_clean||e.preheated?t=1:e.progress===null?t=.6:t=.25+.75*qe(e.progress)),{lamp:e.light||e.door_open?1:0,heat:t,selfClean:e.on&&e.self_clean,probe:e.probe}}function $0(e){let t=e.doors.map((n,o)=>{let r=e.doors[o-1],i=r?r.top+r.height:49.5;return{top:i,height:n.top-i}});return f`${t.map(n=>f`
      <rect x="0" y=${m(n.top)} width=${298.75} height=${m(Math.max(n.height,1.3))}
        fill="#161718" />
      <line x1="0" y1=${m(n.top-.3)} x2=${298.75} y2=${m(n.top-.3)} stroke="#000"
        stroke-width="0.6" opacity="0.25" />`)}`}function _0(e,t){let n=t.vent.top,o=t.height,r=n+2,[[i,a],[s,l]]=ca,p=[[r+.6,2.7],[r+3.9,2.9]],d=(u,h,g,y,$)=>f`<rect x=${m(u)} y=${m(g)} width=${m(h-u)} height=${m(y)} fill=${$} />`;return f`
    ${d(8,298.75-8,n,2,"#0b0b0c")}
    ${d(0,8,n,2,"#8e9092")}
    ${d(298.75-8,298.75,n,2,"#8e9092")}
    <rect x="0" y=${m(r)} width=${298.75} height="0.6" fill="#f2f2f2" opacity="0.85" />
    ${d(0,i+2,r+.6,6.2,"#8e9092")}
    ${d(l-2,298.75,r+.6,6.2,"#8e9092")}
    ${d(a-2,s+2,r+.6,3.1,"#a3a5a7")}
    ${d(a-2,s+2,r+3.7,3.1,"#8b8d8f")}
    ${ca.map(([u,h])=>p.map(([g,y])=>f`<rect x=${u} y=${m(g)} width=${m(h-u)} height=${y}
          rx=${y/2} fill="#0b0b0c" />`))}
    <rect x="0" y=${m(r+3.3)} width=${298.75} height="0.6" fill="#f4f4f4" opacity="0.9" />
    <line x1="0" y1=${m(r+7)} x2=${298.75} y2=${m(r+7)} stroke="#fff" stroke-width="0.5"
      opacity="0.5" />
    <rect x="0" y=${m(r+6.8)} width=${298.75} height=${m(o-r-6.8)} fill=${E(e.chrome)}
      opacity="0.35" />
    <line x1="0" y1=${m(o-.4)} x2=${298.75} y2=${m(o-.4)} stroke="#000"
      stroke-width="0.8" opacity="0.4" />
  `}function b0(e,t,n){let o=[e?"Double wall oven":"Wall oven"];for(let{position:r,oven:i}of t){let a=r==="single"?"":`${r} oven `;i.on&&i.self_clean?o.push(`${a}self-cleaning`):i.on&&i.preheated?o.push(`${a}preheated`):i.on&&i.progress!==null&&i.progress<1?o.push(`${a}preheating`):i.on&&o.push(`${a}on`),i.door_open?o.push(`${a}door open`):i.light&&o.push(`${a}light on`)}return n||o.push("offline"),o.join(", ")}var v0={refrigeration:Ap,range:Hc,wall_oven:sd,hood:ic,dishwasher:_l};function ld(e){return v0[e.spec.family]?.(e)??mr(e)}function w0(e){return`option.${e.toLowerCase().replace(/[^a-z0-9]+/g,"_")}`}function le(e,t){let n=w0(t),o=e(n);return o===n?t:o}function lt(e){let t=e?.state;return t===void 0||t===""||t==="unavailable"||t==="unknown"?null:t}var k0=["sensor","binary_sensor","number","select","switch","climate","button","fan","light","event"];function q(e,t,...n){for(let o of n.length?n:k0){let r=lt(e.state(t,o));if(r!==null)return r}return null}function D(e,t,...n){let o=q(e,t,...n.length?n:["binary_sensor","switch"]);return o==="on"?!0:o==="off"?!1:null}function ae(e){if(typeof e=="number")return Number.isFinite(e)?e:null;if(typeof e!="string"||e.trim()==="")return null;let t=Number(e);return Number.isFinite(t)?t:null}function ke(e,t,...n){return ae(q(e,t,...n))}function H(e,t,...n){return e.entityId(t,...n)!==void 0}function un(e,t,n){return Math.min(n,Math.max(t,e))}function Wt(e,t){let n={};for(let o of t)H(e,o,"binary_sensor")&&(n[o]=D(e,o,"binary_sensor")===!0);return n}function Zt(e,t){return t.some(n=>D(e,n,"binary_sensor")===!0)}function ba(e){let t=(e.appliance_type??"").split(".");return t.length===3&&t.unshift("0"),t.length!==4||!t.every(n=>/^\d+$/.test(n))?null:[Number(t[1]),Number(t[2]),Number(t[3])]}function va(e){return e.config?.unit_system?.temperature||"\xB0F"}function fd(e){return va(e).includes("C")}function hd(e){return fd(e)?21:70}function He(e){if(e===null)return"\u2014";let t=Math.round(e);return`${t===0?0:t}\xB0`}function xe(e){if(typeof e!="string"||!e)return null;let t=Date.parse(e);return Number.isNaN(t)?null:t}function md(e){return e.locale?.language||e.language||"en"}var cd={comma_decimal:["en-US","en"],decimal_comma:["de","es","it"],space_comma:["fr","sv","cs"],system:void 0},pd=new Map;function wa(e,t,n=0,o=0){let r=e.locale?.number_format,i=r==="none"?"en-US":r&&r in cd?cd[r]:md(e),a=`${r}|${String(i)}|${o}|${n}`,s=pd.get(a);if(!s){let l={minimumFractionDigits:o,maximumFractionDigits:n,...r==="none"?{useGrouping:!1}:{}};try{s=new Intl.NumberFormat(i,l)}catch{s=new Intl.NumberFormat(void 0,l)}pd.set(a,s)}return s.format(t)}function Pr(e){return e.locale?.time_zone==="server"&&e.config?.time_zone||void 0}function x0(){try{return new Intl.DateTimeFormat(void 0,{hour:"numeric"}).resolvedOptions().hour12}catch{return}}function gd(e){let t=e.locale?.time_format,n=Pr(e),o=t==="12"?!0:t==="24"?!1:t==="system"?x0():void 0;return{hour:"numeric",minute:"2-digit",...o===void 0?{}:{hour12:o},...n?{timeZone:n}:{}}}function ka(e,t,n){try{return new Intl.DateTimeFormat(md(e),t).format(n)}catch{return new Intl.DateTimeFormat("en",{...t,timeZone:void 0}).format(n)}}function ct(e,t){return ka(e,gd(e),t)}function dd(e,t){return ka(e,{year:"numeric",month:"2-digit",day:"2-digit",timeZone:Pr(e)},t)}function mo(e,t,n){return dd(e,t)===dd(e,n)?ct(e,t):ka(e,{month:"short",day:"numeric",...gd(e)},t)}var _a=e=>String(e).padStart(2,"0");function pt(e,t=!1){let n=Math.max(0,Math.ceil(e/1e3)),o=Math.floor(n/3600),r=Math.floor(n%3600/60),i=n%60;return o||t?`${o}:${_a(r)}:${_a(i)}`:`${r}:${_a(i)}`}function qt(e,t,n="auto"){let o=Math.max(0,Math.round(t/60));if(o<60)return e("unit.minutes",{n:o});if(n==="hours")return e("unit.hours",{n:Math.round(o/60)});let r=Math.floor(o/60),i=o%60;if(r<48)return i?e("unit.hours_minutes",{h:r,m:i}):e("unit.hours",{n:r});let a=Math.floor(r/24),s=r%24;return s?e("unit.days_hours",{d:a,h:s}):e("unit.days",{n:a})}var ud={ms:.001,s:1,min:60,h:3600,d:86400};function wt(e){let t=ae(lt(e));if(t===null)return null;let n=e?.attributes?.unit_of_measurement;return t*(typeof n=="string"&&n in ud?ud[n]:1)}function yd(e,t){let n=lt(t);if(n===null||!t)return"\u2014";if(e.formatEntityState)try{return e.formatEntityState(t)}catch{}let o=ae(n),r=t.attributes?.unit_of_measurement,i=o===null?n:wa(e,o,1);return typeof r=="string"&&r?`${i} ${r}`:i}function dt(e,t=" \xB7 "){let n=e.filter(o=>typeof o=="string"&&o!=="");return n.length?n.join(t):null}function Lr(e){return e===null?"\u2014":`${Math.round(e)}%`}function z0(e,t,n=[]){for(let o of t){let r=e.appliance.locks?.[o];if(r&&!n.includes(r))return e.t(`lock.${r}`)}return null}function S0(e,t,n,o){if(!e.appliance.available)return{disabled:!0,reason:e.t("reason.offline")};let r=z0(e,o.locks??[t],o.ignoreLocks);if(r)return{disabled:!0,reason:r};for(let i of o.reasons??[])if(i)return{disabled:!0,reason:i};return!n||n.state==="unavailable"?{disabled:!0,reason:e.t("reason.unavailable")}:{disabled:!1,reason:null}}function fn(e,t,n){let o=e.entityId(t,n);return o?{entityId:o,entity:e.hass.states[o]}:null}function ut(e,t,n,o,r={}){return{id:r.id??t,label:n,hint:r.hint??null,...S0(e,t,o,r)}}function Or(e,t,n,o,r={}){let i=fn(e,t,"number");if(!i)return null;let a=i.entity?.attributes??{},s=ae(lt(i.entity));return{kind:"duration",...ut(e,t,n,i.entity,r),action:{type:"number",entity_id:i.entityId},value:s===null?null:Math.round(s),min:ae(a.min)??0,max:ae(a.max)??719,presets:o}}function go(e,t,n,o={}){let r=fn(e,t,"number");if(!r)return null;let i=r.entity?.attributes??{};return{kind:"setpoint",...ut(e,t,n,r.entity,o),action:{type:"number",entity_id:r.entityId},value:ae(lt(r.entity))??ke(e,t,"sensor"),min:ae(i.min)??0,max:ae(i.max)??100,step:ae(i.step)??1,unit:va(e.hass)}}function $d(e){let t=ae(e?.attributes?.supported_features);return t!==null?(t&1)===1:e?.attributes?.temperature!==void 0}function Vr(e,t,n,o={}){let r=fn(e,t,"climate");if(!r)return null;let i=r.entity?.attributes??{},a=!r.entity||r.entity.state==="unavailable";return{kind:"setpoint",...ut(e,t,n,r.entity,o),action:{type:"climate_temperature",entity_id:r.entityId},value:ae(i.temperature)??(a?ke(e,t,"sensor"):null),min:ae(i.min_temp)??0,max:ae(i.max_temp)??100,step:ae(i.target_temp_step)??(fd(e.hass)?.5:1),unit:va(e.hass)}}function ze(e,t,n,o={}){let r=fn(e,t,"select");if(!r)return null;let i=r.entity?.attributes?.options,a=Array.isArray(i)?i.filter(s=>typeof s=="string"):[];return{kind:"select",...ut(e,t,n,r.entity,o),action:{type:"select",entity_id:r.entityId},value:lt(r.entity)??o.fallback??null,options:a.map(s=>({value:s,label:le(e.t,s)}))}}function nt(e,t,n,o={}){let r=fn(e,t,"switch");if(!r)return null;let i=lt(r.entity);return{kind:"toggle",...ut(e,t,n,r.entity,o),action:{type:"switch",entity_id:r.entityId},value:i==="on"?!0:i==="off"?!1:null}}function ft(e,t,n,o,r={}){let i=fn(e,t,"button");return i?{kind:"action",...ut(e,t,n,i.entity,r),action:{type:"button",entity_id:i.entityId},confirm:r.confirm??null,button:o,...r.tone?{tone:r.tone}:{}}:null}function hn(e,t){let n=fn(e,t,"button");return!!(n?.entity&&n.entity.state!=="unavailable")}function Z(e,t,n,o={}){return{kind:"reading",id:e,label:t,value:n??"\u2014",hint:o.hint??null,...o.tone?{tone:o.tone}:{}}}function Yt(e,t,n,o=null){return{kind:"countdown",id:e,label:t,end:n,hint:o}}function ce(e,t,n,o=!1){let r=n.filter(i=>!!i);return r.length?{id:e,title:t,controls:r,...o?{collapsed:!0}:{}}:null}function Ie(e){return e.filter(t=>t!=null)}var R0=new Set(["undefined","low","medium","high","critical","urgent","unknown"]),A0=new Set(["high","critical","urgent"]);function ho(e){return typeof e=="string"&&e.trim()?e.trim():typeof e=="number"?String(e):null}function M0(e){let t=e.state("active_faults","sensor");if(!lt(t))return[];let n=t?.attributes?.faults;return Array.isArray(n)?n.filter(o=>!!o&&typeof o=="object"):[]}function T0(e){return ke(e,"active_faults","sensor")??0}function ot(e){return D(e,"service_required","binary_sensor")===!0||T0(e)>0}function C0(e,t,n){let o=e.t,r=ho(t.code),i=ho(t.title),a=ho(t.description),s=ho(t.severity)??"unknown",l=i??a??(r?o("control.fault",{code:r}):o("control.fault_unknown")),p=dt([r&&(i||a)?o("control.fault_code",{code:r}):null,i&&a&&a!==i?a:null,ho(t.resolution_steps)],`
`);return Z(`fault_${n}`,l,o(`severity.${R0.has(s)?s:"unknown"}`),{tone:A0.has(s)?"alert":"warning",hint:p})}function G0(e){return e>=-50?"excellent":e>=-60?"good":e>=-70?"fair":"weak"}function rt(e){let t=e.t,n=D(e,"service_required","binary_sensor"),o=M0(e),r=ke(e,"active_faults","sensor"),i=ke(e,"ap_rssi","sensor"),a=wt(e.state("uptime","sensor")),s=[H(e,"service_required","binary_sensor")?Z("service_required",t("control.service"),n===null?null:t(n?"value.required":"value.not_needed"),{tone:n?"alert":"normal"}):null,H(e,"active_faults","sensor")?Z("active_faults",t("control.faults"),r===null?null:r===0?t("value.no_faults"):String(r),{tone:r?"alert":"normal"}):null,...o.map((l,p)=>C0(e,l,p)),H(e,"ap_rssi","sensor")?Z("ap_rssi",t("control.wifi"),i===null?null:`${t(`wifi.${G0(i)}`)} \xB7 ${Math.round(i)} dBm`):null,H(e,"uptime","sensor")?Z("uptime",t("control.uptime"),a===null?null:qt(t,a)):null,e.appliance.model?Z("model",t("control.model"),e.appliance.model):null,e.appliance.appliance_type?Z("appliance_type",t("control.appliance_type"),e.appliance.appliance_type):null];return ce("details",t("section.details"),s,!(n||o.length||(r??0)>0))}var za={Idle:"idle",Running:"running",Paused:"paused",Canceling:"canceling",Drying:"drying",Done:"done",Delayed:"delayed",Error:"error"},Sa=Object.fromEntries(Object.entries(za).map(([e,t])=>[t,e])),yo=new Set(["running","paused","canceling","drying"]),vd=["heated_dry_on","extended_dry_on","high_temp_wash_on","sani_rinse_on","top_rack_only_on"],_d=["door_ajar"];function Mn(e){let t=q(e,"wash_status","sensor");if(t!==null&&t in za)return za[t];let n=D(e,"wash_cycle_on","binary_sensor");return n===null?null:n?"running":"idle"}function Tn(e,t){return t==="delayed"||D(e,"delay_start_timer_active","binary_sensor")===!0}function Ra(e){let t=q(e,"wash_cycle","sensor","select");return t===null?null:le(e.t,t)}function E0(e){let t=Mn(e);if(t==="done")return 1;if(t===null||!yo.has(t))return null;let n=e.entityId("wash_cycle_on","binary_sensor");if(!n)return null;let o=e.since(n),r=xe(q(e,"wash_cycle_end_time","sensor"));if(o===null||r===null)return null;let i=xe(q(e,"delay_start_timer_end_time","sensor")),a=i!==null&&i>o&&i<=e.now?i:o;return r<=a?null:un((e.now-a)/(r-a),0,1)}function xa(e,t){if(Tn(e,t)){let o=xe(q(e,"delay_start_timer_end_time","sensor"));return o===null?null:pt(o-e.now,!0)}if(t===null||!yo.has(t))return null;let n=xe(q(e,"wash_cycle_end_time","sensor"));return n===null?null:pt(n-e.now,!0)}function D0(e,t){let n=e.t,o=t!==null&&t!=="idle"?n("reason.dishwasher_busy"):null,r=Tn(e,t),i=t!==null&&yo.has(t),a=i?q(e,"wash_cycle_end_time","sensor"):null,s=xe(a),l=r?q(e,"delay_start_timer_end_time","sensor"):null,p=D(e,"remote_ready","binary_sensor"),d="remote_start_wash_cycle_on",u=g=>g===null?null:pt(g-e.now,!0),h=[H(e,"wash_status","sensor")?Z("wash_status",n("control.status"),t===null?null:le(n,Sa[t]),{tone:t==="error"?"alert":"normal"}):null,a?Z("wash_cycle_end_time",n("control.time_left"),u(s),{hint:s===null?null:n("value.ends_at",{time:ct(e.hass,s)})}):null,l?Z("delay_start_timer_end_time",n("control.starts_in"),u(xe(l))):null,ze(e,"wash_cycle",n("control.wash_cycle"),{reasons:[o],fallback:q(e,"wash_cycle","sensor")}),ze(e,"delay_start_timer_duration",n("control.delay_start"))];return!i&&!r&&H(e,d,"button")&&h.push(ft(e,d,n("control.remote_start"),n("action.start"),{confirm:n("confirm.start_dishwasher",{cycle:Ra(e)??"\u2014"}),tone:"primary",locks:[d,"wash_cycle_on"],reasons:hn(e,d)?[]:[p!==!0?n("reason.remote_ready_dishwasher"):null,D(e,"door_ajar","binary_sensor")?n("reason.close_door"):null,D(e,"sabbath_on","binary_sensor")?n("lock.sabbath"):null]})),(i||r)&&h.push(ft(e,"cancel_wash_cycle",n("control.cancel_cycle"),n("action.cancel_cycle"),{confirm:n("confirm.cancel_cycle"),tone:"danger",locks:["cancel_wash_cycle","wash_cycle_on"]})),H(e,"remote_ready","binary_sensor")&&h.push(Z("remote_ready",n("control.remote_ready"),p===null?null:n(p?"value.on":"value.off"))),ce("cycle",n("section.cycle"),h)}function P0(e){let t=e.t;return ce("options",t("section.options"),vd.map(n=>nt(e,n,t(`control.${n}`))))}function L0(e,t){let n=e.t,o=t!==null&&t!=="idle"?n("reason.dishwasher_busy"):null;return ce("modes",n("section.modes"),[ze(e,"mode",n("control.dishwasher_mode"),{reasons:[o]})])}function bd(e,t,n){if(!H(e,t,"binary_sensor"))return null;let o=D(e,t,"binary_sensor");return Z(t,n,o===null?null:e.t(o?"value.low":"value.ok"),{tone:o?"warning":"normal"})}function O0(e){let t=e.t;return ce("maintenance",t("section.maintenance"),[bd(e,"rinse_aid_low",t("control.rinse_aid")),bd(e,"softener_low",t("control.softener"))])}var $o={drawingState(e){let t=Mn(e);return{available:e.appliance.available,doors:Wt(e,_d),readouts:{},sabbath:D(e,"sabbath_on","binary_sensor")===!0,dishwasher:{status:t==="idle"&&Tn(e,t)?"delayed":t??"idle",progress:E0(e),remote_ready:D(e,"remote_ready","binary_sensor")===!0,door_open:D(e,"door_ajar","binary_sensor")===!0,rinse_aid_low:D(e,"rinse_aid_low","binary_sensor")===!0,softener_low:D(e,"softener_low","binary_sensor")===!0,display:xa(e,t)}}},status(e){let t=e.t;if(!e.appliance.available)return{text:t("pill.offline"),tone:"gray"};let n=Mn(e),o=r=>le(t,Sa[r]);return n==="error"?{text:o("error"),tone:"red"}:n==="running"||n==="drying"||n==="canceling"?{text:o(n),tone:"accent"}:n==="paused"?{text:o("paused"),tone:"neutral"}:Tn(e,n)?{text:o("delayed"),tone:"neutral"}:n==="done"?{text:o("done"),tone:"green"}:Zt(e,_d)?{text:t("pill.door_open"),tone:"amber"}:ot(e)?{text:t("pill.service"),tone:"red"}:D(e,"sabbath_on","binary_sensor")?{text:t("pill.sabbath"),tone:"gray"}:q(e,"mode","select")==="Child lock"?{text:le(t,"Child lock"),tone:"neutral"}:D(e,"remote_ready","binary_sensor")?{text:t("pill.remote_ready"),tone:"accent"}:{text:o("idle"),tone:"neutral"}},infoRows(e){let t=e.t,n=Mn(e),o=[{label:t("info.cycle"),value:Ra(e)??"\u2014"}],r=n!==null&&yo.has(n)?xe(q(e,"wash_cycle_end_time","sensor")):null,i=Tn(e,n)?xe(q(e,"delay_start_timer_end_time","sensor")):null;r!==null?o.push({label:t("info.ends"),value:ct(e.hass,r)}):i!==null&&o.push({label:t("info.starts"),value:ct(e.hass,i)});let s=vd.filter(l=>H(e,l,"switch")).map(l=>({key:l,on:D(e,l,"switch")}));if(s.some(({on:l})=>l!==null)){let l=dt(s.filter(({on:d})=>d===!0).map(({key:d})=>t(`control.${d}`))),p=s.some(({on:d})=>d===null);o.push({label:t("info.options"),value:l??(p?"\u2014":t("value.none"))})}return o.slice(0,3)},display(e){if(!e.appliance.available)return null;let t=e.t,n=Mn(e),o=Ra(e);if(Tn(e,n)){let r=xe(q(e,"delay_start_timer_end_time","sensor"));return{text:xa(e,n)??"--:--",caption:r===null?le(t,"Delayed"):t("display.starts_at",{time:ct(e.hass,r)})}}return n!==null&&yo.has(n)?{text:xa(e,n)??"--:--",caption:dt([o,n==="running"?null:le(t,Sa[n])])}:n==="done"?{text:"0:00:00",caption:le(t,"Done")}:n==="error"?{text:"--:--",caption:le(t,"Error")}:{text:"--:--",caption:o}},sections(e){let t=Mn(e);return Ie([D0(e,t),P0(e),L0(e,t),O0(e),rt(e)])}};function Hr(e){let t=e.entityId("fan_on","fan");if(!t)return null;let n=e.hass.states[t],o=n?.attributes??{},r=ae(o.supported_features),i=ae(o.percentage_step),a=r!==null&&(r&1)===0?1:i&&i>0?Math.round(100/i):4,s=lt(n),l=ae(o.percentage),p=0;return s==="on"&&(p=l===null?1:un(Math.round(l*a/100),1,a)),{entityId:t,entity:n,speed:p,speeds:a}}function Ir(e){let t=e.entityId("light_on","light");if(!t)return null;let n=e.hass.states[t],o=n?.attributes??{},r=Array.isArray(o.supported_color_modes)?o.supported_color_modes:[],i=lt(n)==="on",a=ae(o.brightness),s=r.includes("color_temp");return{entityId:t,entity:n,on:i,brightness:i&&a!==null?Math.round(a*100/255):i&&r.some(l=>l!=="onoff")?100:null,kelvin:i&&s?ae(o.color_temp_kelvin):null,minKelvin:ae(o.min_color_temp_kelvin)??2700,maxKelvin:ae(o.max_color_temp_kelvin)??5e3,hasKelvin:s}}function wd(e){let t=wt(e.state("filter_count","sensor")),n=wt(e.state("filter_max_count","sensor"));return t===null||!n?null:un(t*100/n,0,100)}function V0(e){let t=e.t,n=Hr(e),o=Ir(e),r=[];return n&&r.push({kind:"fan",...ut(e,"fan_on",t("control.fan"),n.entity),action:{type:"fan",entity_id:n.entityId,speeds:n.speeds},value:n.speed,speeds:n.speeds}),o&&r.push({kind:"light",...ut(e,"light_on",t("control.task_light"),o.entity),action:{type:"light",entity_id:o.entityId},on:o.on,brightness:o.brightness,kelvin:o.kelvin??(o.on&&o.hasKelvin?Math.round((o.minKelvin+o.maxKelvin)/2):null),min_kelvin:o.minKelvin,max_kelvin:o.maxKelvin}),r.push(nt(e,"halo_max_percent",t("control.halo"))),ce("fan_light",t("section.fan_light"),r)}function H0(e){let t=e.t;return ce("delayed_shutoff",t("section.delayed_shutoff"),[nt(e,"delay_enabled",t("control.delayed_shutoff")),Or(e,"delay_off_duration",t("control.shutoff_after"),[1,3,5,10,15])])}function I0(e){let t=e.t;return ce("settings",t("section.settings"),[ze(e,"auto_sensivity",t("control.fan_sensitivity")),nt(e,"key_tone_on",t("control.key_tones")),nt(e,"user_lock_on",t("control.control_lock"))],!0)}function F0(e){let t=e.t,n=wt(e.state("filter_count","sensor")),o=wt(e.state("filter_max_count","sensor")),r=wd(e);return ce("filters",t("section.filters"),[H(e,"filter_count","sensor")?Z("filter_count",t("control.filter_usage"),n===null?null:qt(t,n,"hours"),{hint:r===null?null:t("value.percent_used",{pct:Math.round(r)}),tone:r!==null&&r>=100?"warning":"normal"}):null,H(e,"filter_max_count","sensor")?Z("filter_max_count",t("control.filter_allowance"),o===null?null:qt(t,o,"hours")):null])}var _o={drawingState(e){let t=Hr(e),n=Ir(e);return{available:e.appliance.available,doors:{},readouts:{},hood:{fan:t?.speed??0,light:n?.on??!1,brightness:n?.on?n.brightness??100:0,kelvin:n?.hasKelvin?n.kelvin??Math.round((n.minKelvin+n.maxKelvin)/2):null,halo:D(e,"halo_max_percent","switch")===!0}}},status(e){let t=e.t;if(!e.appliance.available)return{text:t("pill.offline"),tone:"gray"};let n=Hr(e)?.speed??0;return n>0?{text:t("pill.fan",{speed:n}),tone:"accent"}:Ir(e)?.on?{text:t("pill.light"),tone:"neutral"}:ot(e)?{text:t("pill.service"),tone:"red"}:D(e,"delay_enabled","switch")?{text:t("pill.delayed_shutoff"),tone:"neutral"}:{text:t("pill.off"),tone:"neutral"}},infoRows(e){let t=e.t,n=[],o=Hr(e);o&&n.push({label:t("info.fan"),value:o.speed?t("value.speed",{speed:o.speed}):t("value.off")});let r=Ir(e);r&&n.push({label:t("info.light"),value:r.on?dt([r.brightness===null?null:`${r.brightness}%`,r.kelvin===null?null:`${Math.round(r.kelvin)} K`])??t("value.on"):t("value.off")});let i=wd(e);if(i!==null){let a=t("value.percent_used",{pct:Math.round(i)});n.push({label:t("info.filter"),value:i>=100?`${a} \xB7 ${t("value.replace")}`:a})}return n.slice(0,3)},display:()=>null,sections(e){return Ie([V0(e),H0(e),I0(e),F0(e),rt(e)])}};var N0=["ice_door_ajar"],B0=new Set(["Off","Not cleaning","Cleaning complete"]);function Ta(e){let t=D(e,"ice_maker_on","binary_sensor");if(t!==null)return t;let n=q(e,"ice_maker_mode","select");return n==="On"?!0:n==="Off"?!1:null}function Aa(e){let t=q(e,"ice_maker_clean_stage","sensor");return D(e,"ice_maker_clean_on","binary_sensor")===!0||t!==null&&!B0.has(t)}function bo(e){return D(e,"delay_active","binary_sensor")===!0}function kd(e){let t=wt(e.state("delay_duration","sensor"));if(!t)return null;let n=xe(q(e,"delay_start_time","sensor")),o=qt(e.t,t),r=D(e,"delay_recurring","binary_sensor")===!0;if(n===null)return r?e.t("value.daily_for",{duration:o}):o;let i=ct(e.hass,n);return e.t(r?"value.daily_from":"value.from_for",{time:i,duration:o})}function xd(e){let t=q(e,"ice_maker_status","sensor");if(t!==null)return le(e.t,t);let n=Ta(e);return n===null?null:e.t(n?"value.on":"value.off")}function j0(e){let t=e.t;return ce("ice",t("section.ice_maker"),[ze(e,"ice_maker_mode",t("control.ice_maker"),{locks:["ice_maker_mode","ice_maker_on"]}),H(e,"ice_maker_status","sensor")?Z("ice_maker_status",t("control.status"),xd(e)):null])}function U0(e){let t=e.t;if(!(H(e,"delay_duration","sensor")||H(e,"end_ice_delay","button")||H(e,"cancel_ice_delay","button")))return null;let o=bo(e)?q(e,"delay_end_time","sensor"):null,r=kd(e),i=D(e,"sabbath_on","binary_sensor")===!0,a={kind:"ice_delay",id:"schedule_ice_delay",label:t("control.schedule_delay"),device_id:e.appliance.device_id,disabled:!e.appliance.available||i,reason:e.appliance.available?i?t("lock.sabbath"):null:t("reason.offline")};return ce("ice_delay",t("section.ice_delay"),[o?Yt("delay_end_time",t("control.delay_left"),o):null,r?Z("delay_schedule",t("control.delay_schedule"),r):null,a,hn(e,"end_ice_delay")?ft(e,"end_ice_delay",t("control.end_delay"),t("action.end")):null,hn(e,"cancel_ice_delay")?ft(e,"cancel_ice_delay",t("control.cancel_delay"),t("action.cancel_schedule")):null])}function K0(e){let t=e.t,n=q(e,"ice_maker_clean_stage","sensor"),o=xe(q(e,"next_clean_time","sensor")),r=ke(e,"next_clean_cycles","sensor"),i=D(e,"clean_now_on","binary_sensor"),a=D(e,"clean_soon_on","binary_sensor"),s=i?t("value.due_now"):a?t("value.due_soon"):i===!1||a===!1?t("value.not_due"):null;return ce("cleaning",t("section.cleaning"),[H(e,"ice_maker_clean_stage","sensor")?Z("ice_maker_clean_stage",t("control.clean_stage"),n===null?null:le(t,n)):null,H(e,"clean_now_on","binary_sensor")||H(e,"clean_soon_on","binary_sensor")?Z("clean_due",t("control.clean_due"),s,{tone:i?"alert":a?"warning":"normal"}):null,H(e,"next_clean_time","sensor")?Z("next_clean_time",t("control.next_cleaning"),o===null?null:mo(e.hass,o,e.now)):null,H(e,"next_clean_cycles","sensor")?Z("next_clean_cycles",t("control.cycles_until_cleaning"),r===null?null:String(Math.round(r))):null])}function W0(e){let t=e.t,n=D(e,"water_filter_inserted","binary_sensor"),o=wt(e.state("filter_count","sensor")),r=wt(e.state("filter_max_count","sensor"));return ce("filters",t("section.filters"),[H(e,"water_filter_inserted","binary_sensor")?Z("water_filter_inserted",t("control.water_filter"),n===null?null:t(n?"value.inserted":"value.missing"),{tone:n===!1?"warning":"normal"}):null,H(e,"filter_count","sensor")?Z("filter_count",t("control.filter_usage"),o===null?null:qt(t,o,"hours")):null,H(e,"filter_max_count","sensor")?Z("filter_max_count",t("control.filter_allowance"),r===null?null:qt(t,r,"hours")):null])}function Ma(e,t){let n=D(e,t,"binary_sensor");return n===null?null:e.t(n?"value.on":"value.off")}function Z0(e){let t=e.t;return ce("settings",t("section.settings"),[ze(e,"door_ajar_timeout",t("control.door_open_delay")),H(e,"winterize_on","binary_sensor")?Z("winterize_on",t("control.winterized"),Ma(e,"winterize_on")):null,H(e,"failsafe_on","binary_sensor")?Z("failsafe_on",t("control.failsafe"),Ma(e,"failsafe_on"),{tone:D(e,"failsafe_on","binary_sensor")?"alert":"normal"}):null,H(e,"sabbath_on","binary_sensor")?Z("sabbath_on",t("control.sabbath"),Ma(e,"sabbath_on")):null],!0)}var vo={drawingState(e){let t=Ta(e)===!0,n=D(e,"winterize_on","binary_sensor")===!0,o=D(e,"failsafe_on","binary_sensor")===!0,r=Aa(e);return{available:e.appliance.available,doors:Wt(e,N0),readouts:{},sabbath:D(e,"sabbath_on","binary_sensor")===!0,ice_maker:{making:t&&!bo(e)&&!n&&!o&&!r,paused:bo(e),cleaning:r}}},status(e){let t=e.t;return e.appliance.available?D(e,"ice_door_ajar","binary_sensor")?{text:t("pill.door_open"),tone:"amber"}:ot(e)||D(e,"failsafe_on","binary_sensor")?{text:t("pill.service"),tone:"red"}:Aa(e)?{text:t("pill.cleaning"),tone:"accent"}:D(e,"clean_now_on","binary_sensor")?{text:t("pill.cleaning_due"),tone:"amber"}:D(e,"sabbath_on","binary_sensor")?{text:t("pill.sabbath"),tone:"gray"}:bo(e)?{text:t("pill.paused"),tone:"neutral"}:Ta(e)!==!0||D(e,"winterize_on","binary_sensor")?{text:t("pill.off"),tone:"neutral"}:{text:t("pill.making_ice"),tone:"accent"}:{text:t("pill.offline"),tone:"gray"}},infoRows(e){let t=e.t,n=[],o=xd(e);o!==null&&n.push({label:t("info.status"),value:o});let r=bo(e)?xe(q(e,"delay_end_time","sensor")):null,i=kd(e);r!==null?n.push({label:t("info.delay"),value:t("value.until",{time:ct(e.hass,r)})}):i&&n.push({label:t("info.delay"),value:i});let a=q(e,"ice_maker_clean_stage","sensor"),s=xe(q(e,"next_clean_time","sensor")),l=ke(e,"next_clean_cycles","sensor");return Aa(e)&&a!==null?n.push({label:t("info.cleaning"),value:le(t,a)}):s!==null?n.push({label:t("info.next_cleaning"),value:mo(e.hass,s,e.now)}):l!==null&&n.push({label:t("info.next_cleaning"),value:t("value.in_cycles",{n:Math.round(l)})}),n.slice(0,3)},display:()=>null,sections(e){return Ie([j0(e),U0(e),K0(e),W0(e),Z0(e),rt(e)])}};var Br=["kitchen_timer","kitchen_timer2"],q0=new Set(["Broil","Convection broil","Proof","Self clean"]),Y0=new Set(["4.1.3","4.2.3","8.1.0","8.2.0","8.3.0","8.4.1","8.4.2","8.5.1","8.6.1","8.6.2","15.1.3","15.2.3"]),X0=8,Q0=["unit_on","set_temp","temp","cook_mode","door_ajar","light_on","remote_ready"];function jr(e,t){return Q0.some(n=>H(e,`${t}_${n}`))||H(e,`remote_start_${t}_unit_on`)}function Sd(e){return jr(e,"cav")||jr(e,"cav2")||Br.some(t=>H(e,`${t}_active`))}function Ct(e){let t=e.appliance.spec;if((t.family==="range"||t.family==="wall_oven")&&t.ovens?.length){let o=t.ovens.map(({prefix:i,position:a})=>({prefix:i,position:a})),r=o.filter(i=>jr(e,i.prefix));return r.length?r:o}let n=["cav","cav2"].filter(o=>jr(e,o));return n.length<2?n.map(o=>({prefix:o,position:"single"})):ba(e.appliance)?.[0]===X0?[{prefix:"cav2",position:"left"},{prefix:"cav",position:"right"}]:[{prefix:"cav",position:"upper"},{prefix:"cav2",position:"lower"}]}function mn(e,t){return e.t(`cavity.${t.position}`)}function J0(e,t,n,o,r,i){if(!e)return null;if(t)return 1;if(n===null||o===null)return null;for(let a of[r,i])if(a!==null&&o>a)return un((n-a)/(o-a),0,1);return n>=o?1:0}function wo(e,t){let n=e.state(`${t}_set_temp`,"climate"),o=q(e,`${t}_set_temp`,"climate"),r=D(e,`${t}_unit_on`,"binary_sensor")??(o!==null&&o!=="off"),i=D(e,`${t}_at_set_temp`,"binary_sensor")===!0,a=ke(e,`${t}_temp`,"sensor")??ae(n?.attributes?.current_temperature),s=ke(e,`${t}_set_temp`,"sensor")??ae(n?.attributes?.temperature);return{on:r,preheated:i,temperature:a,setpoint:s,mode:q(e,`${t}_cook_mode`,"sensor","select"),light:D(e,`${t}_light_on`,"switch","binary_sensor")===!0,door:D(e,`${t}_door_ajar`,"binary_sensor")===!0,probe:D(e,`${t}_probe_on`,"binary_sensor")===!0,remoteReady:D(e,`${t}_remote_ready`,"binary_sensor")===!0,progress:J0(r,i,a,s,e.preheatStart(t),hd(e.hass))}}function Nr(e,t){return t.mode&&t.mode!=="Off"?le(e.t,t.mode):null}function Rd(e,t,n){let o=Nr(e,n),r=q(e,`${t}_broil_level`,"sensor");return o&&r?`${o} \xB7 ${le(e.t,r)}`:o&&n.setpoint!==null?`${o} ${He(n.setpoint)}`:o??(n.setpoint!==null?He(n.setpoint):null)}function eg(e){let t=ba(e.appliance);return t!==null&&Y0.has(t.join("."))}function Fr(e){return Ie(Br.map(t=>{if(D(e,`${t}_active`,"binary_sensor")!==!0)return null;let n=xe(q(e,`${t}_end_time`,"sensor"));return n===null?null:{prefix:t,left:Math.max(0,n-e.now)}})).sort((t,n)=>t.left-n.left)}function tg(e,t,n){let o=e.t;return[n.door?o("reason.close_oven_door"):null,!n.mode||n.mode==="Off"?o("reason.choose_mode"):null,q0.has(n.mode??"")||D(e,`${t}_gourmet_mode_on`,"binary_sensor")?o("reason.manual_mode"):null,n.setpoint===null?o("reason.set_temperature"):null]}function ng(e,t){let n=e.t,o=t.prefix,r=wo(e,o),i=r.on||r.remoteReady?null:n("reason.oven_not_ready"),a=e.entityId(`${o}_set_temp`,"climate"),s=a?e.hass.states[a]:void 0,l=`remote_start_${o}_unit_on`,p=[];if(a){let $=H(e,l,"button")?n(r.remoteReady?"reason.use_start":"reason.remote_ready_oven"):n("reason.start_at_oven");p.push({kind:"toggle",...ut(e,`${o}_unit_on`,n("control.power"),s,{id:`${o}_power`,reasons:[r.on?null:$]}),action:{type:"climate_power",entity_id:a},value:r.on})}let d=s?.state==="unavailable"||$d(s);if(!(r.on&&!d)){let $=r.mode&&r.mode!=="Off"?n("reason.no_temperature"):n("reason.choose_mode");p.push(Vr(e,`${o}_set_temp`,n("control.temperature"),{hint:r.on&&r.temperature!==null?n("value.now",{temp:He(r.temperature)}):null,reasons:[i,d?null:$]}))}let u=eg(e)&&D(e,`${o}_mode_change_enabled`,"binary_sensor")===!1;if(p.push(ze(e,`${o}_cook_mode`,n("control.cook_mode"),{reasons:[i,u?n("reason.mode_change_disabled"):null],fallback:q(e,`${o}_cook_mode`,"sensor")})),!r.on&&r.remoteReady&&H(e,l,"button")&&p.push(ft(e,l,n("control.remote_start"),n("action.start"),{confirm:n(`confirm.start.${t.position}`,{setting:Rd(e,o,r)??"\u2014"}),tone:"primary",locks:[l,`${o}_unit_on`],reasons:hn(e,l)?[]:tg(e,o,r)})),p.push(nt(e,`${o}_light_on`,n("control.light"))),H(e,`${o}_probe_on`,"binary_sensor")){let $=D(e,`${o}_probe_at_set_temp`,"binary_sensor")===!0,b=D(e,`${o}_probe_within_10deg`,"binary_sensor")===!0;p.push(Z(`${o}_probe`,n("control.probe"),r.probe?He(ke(e,`${o}_probe_temp`,"sensor")):n("value.not_connected"),{hint:r.probe?$?n("value.probe_done"):b?n("value.probe_close"):null:null,tone:r.probe&&$?"warning":"normal"})),r.probe&&p.push(go(e,`${o}_probe_set_temp`,n("control.probe_target"),{reasons:[i]}))}let h=D(e,`${o}_cook_timer_active`,"binary_sensor")?q(e,`${o}_cook_timer_end_time`,"sensor"):null;if(D(e,`${o}_cook_timer_complete`,"binary_sensor"))p.push(Z(`${o}_cook_timer`,n("control.cook_timer"),n("value.done"),{tone:"warning"}));else if(h){let $=D(e,`${o}_cook_timer_within_1min`,"binary_sensor");p.push(Yt(`${o}_cook_timer`,n("control.cook_timer"),h,$?n("value.under_minute"):null))}D(e,`${o}_gourmet_mode_on`,"binary_sensor")&&p.push(Z(`${o}_gourmet`,n("control.gourmet"),q(e,`${o}_gourmet_recipe`,"sensor")??n("value.on")));let g=q(e,`${o}_broil_level`,"sensor");g&&p.push(Z(`${o}_broil_level`,n("control.broil_level"),le(n,g)));let y=!r.on&&!r.remoteReady&&Ct(e).length>1;return ce(o,mn(e,t),p,y)}function og(e,t){let n=e.t,o=`${t}_duration`;if(!H(e,o,"number")&&!H(e,`${t}_active`,"binary_sensor"))return null;let r=D(e,`${t}_active`,"binary_sensor")?q(e,`${t}_end_time`,"sensor"):null,i=xe(r);return ce(t,n(`control.${t}`),[r?Yt(`${t}_end_time`,n("control.time_left"),r,i===null?null:n("value.ends_at",{time:ct(e.hass,i)})):null,Or(e,o,n("control.duration"),[5,10,15,30,60]),D(e,`${t}_complete`,"binary_sensor")?ft(e,`dismiss_${t}`,n("control.timer_finished"),n("action.dismiss"),{locks:[`dismiss_${t}`,o]}):null])}function rg(e){let t=e.t,n=D(e,"sabbath_on","binary_sensor");return ce("settings",t("section.settings"),[ze(e,"door_ajar_timeout",t("control.door_open_delay")),H(e,"sabbath_on","binary_sensor")?Z("sabbath_on",t("control.sabbath"),n===null?null:t(n?"value.on":"value.off")):null],!0)}function zd(e){return Ct(e).map(t=>`${t.prefix}_door_ajar`)}var ko={drawingState(e){let t={};for(let o of Ct(e)){let r=wo(e,o.prefix);t[o.prefix]={on:r.on,preheated:r.preheated,progress:r.progress,light:r.light,door_open:r.door,probe:r.probe,remote_ready:r.remoteReady,self_clean:r.mode==="Self clean",temp:r.on&&r.temperature!==null?He(r.temperature):null,mode:r.on?Nr(e,r):null}}let n=Fr(e)[0];return{available:e.appliance.available,doors:Wt(e,zd(e)),readouts:{},ovens:t,display:n?pt(n.left):null,sabbath:D(e,"sabbath_on","binary_sensor")===!0}},status(e){let t=e.t;if(!e.appliance.available)return{text:t("pill.offline"),tone:"gray"};let n=Ct(e).map(i=>wo(e,i.prefix));if(n.some(i=>i.on&&i.mode==="Self clean"))return{text:t("pill.self_clean"),tone:"warm"};let o=n.filter(i=>i.on&&!i.preheated&&i.progress!==null);if(o.length){let i=Math.min(99,Math.round(Math.min(...o.map(a=>a.progress??0))*100));return{text:t("pill.preheating",{pct:i}),tone:"warm"}}if(n.some(i=>i.on))return n.some(i=>i.on&&i.preheated)?{text:t("pill.preheated"),tone:"green"}:{text:t("pill.cooking"),tone:"warm"};if(ot(e))return{text:t("pill.service"),tone:"red"};if(D(e,"sabbath_on","binary_sensor"))return{text:t("pill.sabbath"),tone:"gray"};if(n.some(i=>i.remoteReady))return{text:t("pill.remote_ready"),tone:"accent"};let r=Fr(e)[0];return r?{text:t("pill.timer",{time:pt(r.left)}),tone:"accent"}:Br.some(i=>D(e,`${i}_complete`,"binary_sensor"))?{text:t("pill.timer_done"),tone:"green"}:Zt(e,zd(e))?{text:t("pill.door_open"),tone:"amber"}:{text:t("pill.off"),tone:"neutral"}},infoRows(e){let t=e.t,n=Ct(e),o=n.map(r=>{let i=wo(e,r.prefix);return{label:mn(e,r),value:i.on?Rd(e,r.prefix,i)??t("value.on"):t("value.off")}});for(let r of Fr(e))o.push({label:t(`control.${r.prefix}`),value:pt(r.left)});for(let r of n){if(D(e,`${r.prefix}_probe_on`,"binary_sensor")!==!0)continue;let i=ke(e,`${r.prefix}_probe_temp`,"sensor"),a=ke(e,`${r.prefix}_probe_set_temp`,"sensor","number");o.push({label:n.length>1?`${t("info.probe")} \xB7 ${mn(e,r)}`:t("info.probe"),value:a===null?He(i):`${He(i)} \u2192 ${He(a)}`})}return o.slice(0,3)},display(e){if(!e.appliance.available)return null;let t=e.t,n=Ct(e),o=n.map(i=>({cavity:i,now:wo(e,i.prefix)})).filter(({now:i})=>i.on);if(!o.length){let i=Fr(e)[0];return i?{text:pt(i.left),caption:t(`control.${i.prefix}`)}:{text:t("value.off"),caption:null}}let r=({now:i})=>He(i.temperature??i.setpoint);if(o.length===1){let[i]=o;return{text:r(i),caption:dt([n.length>1?mn(e,i.cavity):null,Nr(e,i.now)])}}return{text:o.map(r).join(" \xB7 "),caption:o.map(({cavity:i,now:a})=>Nr(e,a)??mn(e,i)).join(" \xB7 ")}},sections(e){return Ie([...Ct(e).map(t=>ng(e,t)),...Br.map(t=>og(e,t)),rg(e),rt(e)])}};var La=["ref","ref2","frz","wine","wine2"],Ur=La.map(e=>`${e}_door_ajar`);function Md(e){return La.filter(t=>H(e,`${t}_set_temp`))}function Ca(e,t,n=!1){let o=t==="wine2"?"wine_lower":t==="wine"&&H(e,"wine2_set_temp")?"wine_upper":t;return e.t(n?`zone.short.${o}`:`zone.${o}`)}function Ga(e,t){let n=`${t}_set_temp`;return ke(e,n,"sensor","number")??ae(e.state(n,"climate")?.attributes?.temperature)}var Ad={Off:"off",On:"on","Max ice":"max","Night ice":"night"},Td={off:"Off",on:"On",max:"Max ice",night:"Night ice"};function Ea(e){return H(e,"ice_maker_mode","select")||H(e,"ice_maker_on","binary_sensor")}function Da(e){let t=q(e,"ice_maker_mode","select");if(t!==null&&t in Ad)return Ad[t];let n=D(e,"ice_maker_on","binary_sensor");return n===null?null:D(e,"max_ice_on","binary_sensor")===!0?"max":D(e,"night_ice_on","binary_sensor")===!0?"night":n?"on":"off"}function Cd(e){let t=q(e,"operating_mode","select");return t!==null?t:D(e,"sabbath_on","binary_sensor")?"Sabbath":D(e,"high_use_on","binary_sensor")?"High use":D(e,"short_vacation_on","binary_sensor")?"Short vacation":D(e,"long_vacation_on","binary_sensor")?"Long vacation":H(e,"sabbath_on","binary_sensor")?"Normal":null}function Pa(e){return e===null?"normal":e<=0?"alert":e<=10?"warning":"normal"}function ig(e){let t=Ie(["water","air"].map(i=>{let a=ke(e,`${i}_filter_pct_remaining`,"sensor");return a===null?null:{kind:i,value:a}}));if(!t.length)return null;let n=t.reduce((i,a)=>a.value<i.value?a:i),o=Pa(n.value),r=o==="alert"?e.t("value.replace"):o==="warning"?e.t("value.low"):null;return{label:e.t(`info.${n.kind}_filter`),value:dt([Lr(n.value),r])??"\u2014"}}function ag(e){let t=e.t,n=[];for(let o of Md(e)){let r=`${o}_set_temp`,i=ke(e,`${o}_display_temp`,"sensor"),a=dt([i===null?null:t("value.now",{temp:He(i)}),D(e,`${o}_door_ajar`,"binary_sensor")?t("value.door_open"):null]),s=[o==="frz"&&D(e,"max_ice_on","binary_sensor")?t("reason.max_ice"):null],l=Ca(e,o);n.push(go(e,r,l,{hint:a,reasons:s})??Vr(e,r,l,{hint:a,reasons:s})??Z(r,l,He(Ga(e,o)),{hint:a}))}if(H(e,"crisp_temp_mode")||H(e,"crisp_set_temp")){let o=q(e,"crisp_temp_mode","select")==="Automatic";n.push(ze(e,"crisp_temp_mode",t("control.crisper_mode")),go(e,"crisp_set_temp",Ca(e,"crisp"),{reasons:[o?t("reason.crisper_auto"):null]}))}if(H(e,"wine_temp_alert_on","binary_sensor")){let o=D(e,"wine_temp_alert_on","binary_sensor");n.push(Z("wine_temp_alert_on",t("control.wine_temp_alert"),o===null?null:t(o?"value.alert":"value.normal"),{tone:o?"alert":"normal"}))}return ce("zones",t("section.temperatures"),n)}function sg(e){if(!Ea(e))return null;let t=e.t,n=Da(e),o=D(e,"max_ice_on","binary_sensor")?q(e,"max_ice_end_time","sensor"):null;return ce("ice",t("section.ice_maker"),[ze(e,"ice_maker_mode",t("control.ice_maker"),{locks:["ice_maker_mode","ice_maker_on"]})??Z("ice_maker_mode",t("control.ice_maker"),n===null?null:le(t,Td[n])),o?Yt("max_ice_end_time",t("control.max_ice_left"),o):null])}function lg(e){let t=e.t,n=D(e,"high_use_on","binary_sensor")?q(e,"high_use_end_time","sensor"):null,o=Cd(e);return ce("modes",t("section.modes"),[ze(e,"operating_mode",t("control.operating_mode"),{ignoreLocks:["sabbath"]})??(o===null?null:Z("operating_mode",t("control.operating_mode"),le(t,o))),n?Yt("high_use_end_time",t("control.high_use_left"),n):null])}function cg(e){let t=e.t;return ce("settings",t("section.settings"),[ze(e,"humidity_control",t("control.humidity")),ze(e,"night_mode",t("control.night_mode")),ze(e,"accent_light_level",t("control.accent_light")),ze(e,"door_ajar_timeout",t("control.door_open_delay")),nt(e,"air_filter_on",t("control.air_purification")),nt(e,"internal_dispenser_enabled",t("control.dispenser"))],!0)}function pg(e){let t=e.t,n=ke(e,"air_filter_pct_remaining","sensor"),o=ke(e,"water_filter_pct_remaining","sensor");return ce("filters",t("section.filters"),[H(e,"air_filter_pct_remaining","sensor")?Z("air_filter_pct_remaining",t("control.air_filter"),Lr(n),{tone:Pa(n)}):null,H(e,"water_filter_pct_remaining","sensor")?Z("water_filter_pct_remaining",t("control.water_filter"),Lr(o),{tone:Pa(o)}):null,H(e,"water_filter_gal_remaining","sensor")?Z("water_filter_gal_remaining",t("control.water_filter_capacity"),yd(e.hass,e.state("water_filter_gal_remaining","sensor"))):null,ft(e,"reset_air_filter",t("control.reset_air_filter"),t("action.reset"))])}var xo={drawingState(e){let t={available:e.appliance.available,doors:Wt(e,Ur),readouts:{},sabbath:D(e,"sabbath_on","binary_sensor")===!0};for(let o of[...La,"crisp"]){let r=Ga(e,o);r!==null&&(t.readouts[o]=He(r))}let n=Ea(e)?Da(e):null;return n!==null&&(t.ice={on:n!=="off",mode:n}),t},status(e){let t=e.t;return e.appliance.available?Zt(e,Ur)?{text:t("pill.door_open"),tone:"amber"}:ot(e)?{text:t("pill.service"),tone:"red"}:D(e,"wine_temp_alert_on","binary_sensor")?{text:t("pill.temp_alert"),tone:"red"}:D(e,"sabbath_on","binary_sensor")?{text:t("pill.sabbath"),tone:"gray"}:D(e,"unit_on","binary_sensor")===!1?{text:t("pill.off"),tone:"neutral"}:D(e,"high_use_on","binary_sensor")?{text:t("pill.high_use"),tone:"accent"}:D(e,"short_vacation_on","binary_sensor")||D(e,"long_vacation_on","binary_sensor")?{text:t("pill.vacation"),tone:"neutral"}:{text:t("pill.normal"),tone:"neutral"}:{text:t("pill.offline"),tone:"gray"}},infoRows(e){let t=e.t,n=[],o=Ie(Md(e).map(a=>{let s=Ga(e,a);return s===null?null:{zone:a,temp:He(s)}}));o.length===1?n.push({label:t("info.set_to"),value:o[0].temp}):o.length&&n.push({label:t("info.set_to"),value:o.map(({zone:a,temp:s})=>`${Ca(e,a,!0)} ${s}`).join(" \xB7 ")});let r=Ea(e)?Da(e):null;r!==null&&n.push({label:t("info.ice_maker"),value:le(t,Td[r])});let i=ig(e);if(i&&n.push(i),n.length<2){let a=Cd(e);a!==null&&n.push({label:t("info.mode"),value:le(t,a)})}return n.slice(0,3)},display:()=>null,sections(e){return Ie([ag(e),sg(e),lg(e),cg(e),pg(e),rt(e)])}};var dg=[{model:vo,fits:e=>H(e,"ice_maker_status","sensor")||H(e,"ice_door_ajar","binary_sensor")},{model:xo,fits:e=>["ref","ref2","frz","wine","wine2"].some(t=>H(e,`${t}_set_temp`))},{model:ko,fits:Sd},{model:$o,fits:e=>["wash_cycle","wash_status","wash_cycle_on"].some(t=>H(e,t))},{model:_o,fits:e=>H(e,"fan_on","fan")||H(e,"light_on","light")}],ug=[...Ur,"ice_door_ajar","door_ajar","cav_door_ajar","cav2_door_ajar"];function zo(e){return dg.filter(t=>t.fits(e)).map(t=>t.model)}function fg(e){let t=new Map;for(let o of e)for(let r of o){let i=t.get(r.id);if(!i){t.set(r.id,{...r,controls:[...r.controls]});continue}let a=new Set(i.controls.map(s=>s.id));i.controls.push(...r.controls.filter(s=>!a.has(s.id)))}let n=t.get("details");return t.delete("details"),n?[...t.values(),n]:[...t.values()]}var Oa={drawingState(e){let t={available:e.appliance.available,doors:{},readouts:{}};for(let n of zo(e)){let o=n.drawingState(e);Object.assign(t.doors,o.doors),Object.assign(t.readouts,o.readouts);for(let r of["ice","sabbath","ovens","display","dishwasher","hood","ice_maker"])o[r]!==void 0&&t[r]===void 0&&(t[r]=o[r])}return t},status(e){let[t]=zo(e);if(t)return t.status(e);let n=e.t;return e.appliance.available?Zt(e,ug)?{text:n("pill.door_open"),tone:"amber"}:ot(e)?{text:n("pill.service"),tone:"red"}:D(e,"sabbath_on","binary_sensor")?{text:n("pill.sabbath"),tone:"gray"}:{text:n("pill.normal"),tone:"neutral"}:{text:n("pill.offline"),tone:"gray"}},infoRows(e){let t=zo(e).flatMap(n=>n.infoRows(e));return!t.length&&e.appliance.model&&t.push({label:e.t("info.model"),value:e.appliance.model}),t.slice(0,3)},display(e){for(let t of zo(e)){let n=t.display(e);if(n)return n}return null},sections(e){let t=zo(e);return t.length?fg(t.map(n=>n.sections(e))):Ie([rt(e)])}};function Cn(e){let t=e.spec;switch(t?.family){case"refrigeration":return t.form==="ice_maker"?vo:xo;case"range":case"wall_oven":return ko;case"dishwasher":return $o;case"hood":return _o;case"generic":switch(t.form){case"refrigerator":case"wine":return xo;case"ice_maker":return vo;case"oven":return ko;case"hood":return _o;case"dishwasher":return $o}return Oa;default:return Oa}}function Gn(e,t,n,o,r){let i=(a,...s)=>{let l=e.entities?.[a];if(l){if(!s.length)return Object.values(l)[0];for(let p of s)if(l[p])return l[p]}};return{appliance:e,hass:t,t:n,now:o,entityId:i,state(a,...s){let l=i(a,...s);return l?t.states[l]:void 0},since:(a,s)=>r.since(a,s),preheatStart:a=>r.preheatStart(e,a)}}function Ha(e){if(e.ovens)return!Object.values(e.ovens).some(n=>n?.on)&&!e.display;let t=e.dishwasher?.status;return t==="idle"||t==="done"||t==="error"}var Va=new Set,hg=200;function Fe(e,t,n){try{return t()}catch(o){let r=`${e}: ${String(o)}`;return!Va.has(r)&&Va.size<hg&&(Va.add(r),console.error(`Sub-Zero panel: ${e} failed`,o)),n}}function Gd(e,t,n,o,r){let i=Cn(e),a=Gn(e,t,n,o,r),s=p=>`${e.spec.family} ${p} for ${e.device_id}`,l=Fe(s("drawing state"),()=>i.drawingState(a),{available:e.available,doors:{},readouts:{}});return e.available?{status:Fe(s("status"),()=>i.status(a),{text:"",tone:"neutral"}),rows:Fe(s("info rows"),()=>i.infoRows(a),[]),display:Fe(s("display"),()=>i.display(a),null),dim:Ha(l),state:l}:{status:{text:n("status.offline"),tone:"gray"},rows:Fe(s("info rows"),()=>i.infoRows(a),[]),display:null,dim:!0,state:{...l,available:!1}}}function mg(){try{return typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches}catch{return!1}}function En(e,t,n,o,r={}){return{uid:o,spec:r.spec??e.spec,appearance:r.appearance??e.appearance,state:e.available?t:{...t,available:!1},theme:n?.themes?.darkMode?"dark":"light",reducedMotion:mg(),...r.pixelHeight?{pixelHeight:r.pixelHeight}:{}}}function Dn(e){return Fe(`${e.spec.family} drawing`,()=>ld(e),null)??Fe(`${e.spec.family} generic drawing`,()=>mr(e),w)}var Ed=de`
  :host {
    display: block;
    color: var(--sz-text, var(--primary-text-color, #1f2328));
    font-size: 14px;
    line-height: 1.35;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px 16px;
    min-height: 40px;
  }
  .row.stacked {
    flex-direction: column;
    align-items: stretch;
  }
  /* In a column the flex basis would be a height, so stacked parts take their own. */
  .row.stacked .text,
  .row.stacked .widget {
    flex: none;
  }
  .text {
    display: flex;
    flex: 1 1 9em;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .title {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }
  .label {
    font-weight: 500;
  }
  /* Still read out: the label of a quiet control, and a reason the section shows once. */
  :host([quiet]) .row.stacked .label,
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
  .aside {
    color: var(--sz-muted, #6b7178);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .hint {
    color: var(--sz-muted, #6b7178);
    font-size: 12.5px;
    white-space: pre-line;
  }
  .widget {
    display: flex;
    flex: 0 1 auto;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    max-width: 100%;
  }
  .reason,
  .error {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    margin-top: 6px;
    font-size: 12.5px;
  }
  .reason {
    color: var(--sz-muted, #6b7178);
  }
  .reason svg {
    flex: none;
    width: 14px;
    height: 14px;
    margin-top: 1px;
    fill: currentColor;
  }
  .error {
    color: var(--sz-error-text, #b3261e);
  }
  .ask {
    margin-top: 8px;
  }

  /* A small ring while a call is in flight. */
  .spinner {
    flex: none;
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border: 2px solid var(--sz-control-bg, rgba(127, 127, 127, 0.25));
    border-top-color: var(--sz-accent, #03a9f4);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Choices as separate chips, the chosen one filled: the same whether they fit beside the label
     or wrap under it, and the same as the timer presets. */
  .segmented {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 6px;
    max-width: 100%;
  }
  .segmented button {
    flex: 0 0 auto;
    min-height: 40px;
    padding: 6px 14px;
    border: none;
    border-radius: 999px;
    background: var(--sz-control-bg, rgba(127, 127, 127, 0.14));
    color: inherit;
    font: inherit;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    transition: background-color 0.15s, color 0.15s;
  }
  .segmented button:hover:not([aria-disabled="true"]):not([aria-pressed="true"]) {
    background: var(--sz-control-hover, rgba(127, 127, 127, 0.2));
  }
  .segmented button[aria-pressed="true"] {
    background: var(--sz-accent-fill, var(--sz-accent, #03a9f4));
    color: var(--sz-on-accent, #ffffff);
  }
  .segmented button:disabled,
  .segmented button[aria-disabled="true"] {
    cursor: default;
  }
  .segmented.disabled {
    opacity: 0.55;
  }

  /* The dropdown for more than five choices. */
  .dropdown {
    position: relative;
    display: inline-flex;
    max-width: 100%;
  }
  .dropdown select {
    max-width: 100%;
    min-height: 40px;
    padding: 7px 36px 7px 14px;
    border: none;
    border-radius: 999px;
    background: var(--sz-control-bg, rgba(127, 127, 127, 0.14));
    color: inherit;
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    text-overflow: ellipsis;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
  }
  /* Locked but focusable: it doesn't open, by pointer or key (see SzSelect). */
  .dropdown select[aria-disabled="true"] {
    opacity: 0.55;
    cursor: default;
    pointer-events: none;
  }
  .dropdown svg {
    position: absolute;
    top: 50%;
    right: 12px;
    width: 18px;
    height: 18px;
    margin-top: -9px;
    fill: currentColor;
    pointer-events: none;
  }

  /* An on/off switch, in the same blue as a chosen chip. */
  .switch {
    position: relative;
    flex: none;
    width: 48px;
    height: 28px;
    padding: 0;
    border: none;
    border-radius: 999px;
    background: var(--sz-switch-off, rgba(127, 127, 127, 0.5));
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    transition: background-color 0.2s;
  }
  /* A 56 × 44 target for fingers around the smaller switch. */
  .switch::before {
    content: "";
    position: absolute;
    inset: -8px -4px;
  }
  .switch::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
    transition: transform 0.2s;
  }
  .switch[aria-checked="true"] {
    background: var(--sz-accent-fill, var(--sz-accent, #03a9f4));
  }
  .switch[aria-checked="true"]::after {
    transform: translateX(20px);
  }
  /* A switch whose entity has no state yet: neither on nor off. */
  .switch.unknown::after {
    transform: translateX(10px);
  }
  .switch:disabled,
  .switch[aria-disabled="true"] {
    opacity: 0.5;
    cursor: default;
  }

  /* Minus, the value, plus. */
  .stepper {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 3px;
    border-radius: 999px;
    background: var(--sz-control-bg, rgba(127, 127, 127, 0.14));
  }
  .stepper button {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .stepper button:hover:not(:disabled):not([aria-disabled="true"]) {
    background: var(--sz-control-hover, rgba(127, 127, 127, 0.2));
  }
  .stepper button:disabled,
  .stepper button[aria-disabled="true"] {
    opacity: 0.35;
    cursor: default;
  }
  .stepper svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
  .stepper output {
    min-width: 4.2em;
    font-size: 17px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    text-align: center;
  }
  .stepper output .unit {
    margin-inline-start: 1px;
    font-size: 13px;
    font-weight: 500;
    color: var(--sz-muted, #6b7178);
  }
  /* No setpoint, like a blank display. */
  .stepper output.empty {
    color: var(--sz-muted, #6b7178);
    font-weight: 500;
    letter-spacing: 0.06em;
  }
  .stepper.draft output {
    color: var(--sz-accent, #03a9f4);
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chips .sz-button {
    min-height: 40px;
    padding: 6px 14px;
    font-size: 13.5px;
  }
  .chips .sz-button[aria-pressed="true"] {
    background: var(--sz-accent-fill, var(--sz-accent, #03a9f4));
    color: var(--sz-on-accent, #ffffff);
  }

  .reading {
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    text-align: end;
  }
  /* Text tokens, not the raw tones: amber and red text need more ink to reach 4.5:1. */
  .reading[data-tone="warning"] {
    color: var(--sz-warning-text, #8a5a00);
  }
  .reading[data-tone="alert"] {
    color: var(--sz-error-text, #b3261e);
  }

  input[type="number"],
  input[type="time"] {
    min-height: 40px;
    box-sizing: border-box;
    padding: 6px 12px;
    border: 1px solid var(--sz-divider, rgba(127, 127, 127, 0.35));
    border-radius: 10px;
    background: transparent;
    color: inherit;
    font: inherit;
    font-variant-numeric: tabular-nums;
  }
  input[type="number"] {
    width: 6em;
  }

  .slider {
    display: grid;
    grid-template-columns: minmax(6em, auto) 1fr 4.2em;
    align-items: center;
    gap: 12px;
  }
  .slider span {
    color: var(--sz-muted, #6b7178);
    font-size: 13px;
  }
  .slider output {
    font-variant-numeric: tabular-nums;
    text-align: end;
  }
  /* Both sliders share a track and a thumb: brightness fills its track with the accent up to the
     value, white temperature shows its warm-to-cool range. */
  input[type="range"] {
    width: 100%;
    min-width: 0;
    height: 8px;
    margin: 0;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      var(--sz-accent-fill, var(--sz-accent, #03a9f4)) var(--filled, 0%),
      var(--sz-control-bg, rgba(127, 127, 127, 0.14)) var(--filled, 0%)
    );
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
  }
  input[type="range"].kelvin {
    background: linear-gradient(90deg, #ffb46b, #fff4e6 55%, #d6e6ff);
    box-shadow: inset 0 0 0 1px var(--sz-inset-edge, rgba(0, 0, 0, 0.08));
  }
  input[type="range"]::-moz-range-track {
    background: transparent;
  }
  input[type="range"]::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    background: var(--sz-accent-fill, var(--sz-accent, #03a9f4));
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
    -webkit-appearance: none;
    appearance: none;
  }
  input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    background: var(--sz-accent-fill, var(--sz-accent, #03a9f4));
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  }
  input[type="range"]:disabled {
    opacity: 0.5;
    cursor: default;
  }

  button:focus-visible,
  select:focus-visible,
  input:focus-visible {
    outline: 2px solid var(--sz-accent, #03a9f4);
    outline-offset: 2px;
  }

  /* Bigger targets wherever there's a finger: touch laptops report a mouse as their main pointer. */
  @media (any-pointer: coarse) {
    .segmented button,
    .chips .sz-button,
    .dropdown select,
    input[type="number"],
    input[type="time"] {
      min-height: 44px;
    }
    .stepper button {
      width: 44px;
      height: 44px;
    }
    input[type="range"]::-webkit-slider-thumb {
      width: 24px;
      height: 24px;
    }
    input[type="range"]::-moz-range-thumb {
      width: 20px;
      height: 20px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation-duration: 2.4s;
    }
    .switch,
    .switch::after,
    .segmented button {
      transition: none;
    }
  }
`;var Dd="sz-value",gg=2500,yg=Uo("en"),Ye={minus:f`<path d="M5 11h14v2H5z" />`,plus:f`<path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />`,chevron:f`<path d="M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6z" />`,lock:f`<path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 0 1 6 0v3H9Z" />`};function Xe(e){return A`<svg viewBox="0 0 24 24" aria-hidden="true">${e}</svg>`}var ie=class extends Me{constructor(){super(),this.t=yg,this.pending=!1,this.error=null,this.sharedReason=!1,this.optimistic=void 0}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.settleTimer)}current(){return this.control&&"value"in this.control?this.control.value:void 0}willUpdate(t){this.optimistic!==void 0&&(t.has("control")&&$g(this.current(),this.optimistic)||t.has("error")&&this.error)&&this.clearOptimistic()}updated(t){t.has("pending")&&t.get("pending")===!0&&!this.pending&&this.optimistic!==void 0&&(clearTimeout(this.settleTimer),this.settleTimer=setTimeout(()=>this.clearOptimistic(),gg))}clearOptimistic(){clearTimeout(this.settleTimer),this.settleTimer=void 0,this.optimistic=void 0}send(t){clearTimeout(this.settleTimer),this.optimistic=t,this.emit(t)}emit(t){this.dispatchEvent(new CustomEvent(Dd,{detail:{value:t},bubbles:!0,composed:!0}))}get disabled(){return!!this.control?.disabled}get locked(){return this.disabled?"true":w}describedBy(t=this.control?.hint??null){let n=[t?"hint":null,this.reason()?"reason":null].filter(Boolean);return n.length?n.join(" "):w}reason(){return this.control?.disabled&&this.control.reason||null}frame(t,n={}){return A`${this.head(t,n)}${this.errorLine()}`}head(t,n={}){let o=this.control;if(!o)return A``;let r=n.hint===void 0?o.hint:n.hint,i=this.reason();return A`
      <div class="row ${n.stacked?"stacked":""}">
        <div class="text">
          <div class="title">
            <span class="label" id="label">${o.label}</span>
            ${n.aside?A`<span class="aside">${n.aside}</span>`:w}
          </div>
          ${r?A`<span class="hint" id="hint">${r}</span>`:w}
        </div>
        <div class="widget">
          ${this.pending?A`<span class="spinner" role="progressbar" aria-label=${this.t("ctl.saving")}></span>`:w}
          ${t}
        </div>
      </div>
      ${i?A`<div class="reason ${this.sharedReason?"visually-hidden":""}" id="reason">
            ${Xe(Ye.lock)}<span>${i}</span>
          </div>`:w}
    `}errorLine(){return this.error?A`<div class="error" role="alert">${this.error}</div>`:w}};ie.properties={control:{attribute:!1},t:{attribute:!1},pending:{type:Boolean,reflect:!0},error:{attribute:!1},sharedReason:{attribute:!1},optimistic:{state:!0}},ie.styles=[mt,Ed];function $g(e,t){return e===t?!0:typeof e=="object"&&typeof t=="object"&&e!==null&&t!==null&&JSON.stringify(e)===JSON.stringify(t)}function Se(e,t){customElements.get(e)||customElements.define(e,t)}var So=class extends ie{constructor(){super();this.onKey=n=>{n.key==="Escape"&&this.asking&&(n.stopPropagation(),this.answer(!1))};this.asking=!1}async press(){if(!(this.disabled||this.pending)){if(!this.control?.confirm){this.emit(void 0);return}this.asking=!0,await this.updateComplete,this.renderRoot.querySelector(".confirm .sz-button")?.focus()}}answer(n){this.asking=!1,n&&!this.disabled&&this.emit(void 0),this.updateComplete.then(()=>this.renderRoot.querySelector(".row .sz-button")?.focus())}render(){let n=this.control;if(!n)return w;let o=n.tone==="danger"?"danger":n.tone==="primary"?"primary":"";return A`<div @keydown=${this.onKey}>
      ${this.head(A`<button
        type="button"
        class="sz-button ${this.asking?"":o}"
        aria-expanded=${n.confirm?this.asking?"true":"false":w}
        aria-disabled=${(this.disabled||this.pending)&&!this.asking?"true":w}
        aria-describedby=${this.describedBy()}
        ?disabled=${this.asking}
        @click=${()=>this.press()}
      >
        ${n.button}
      </button>`)}
      ${this.asking&&n.confirm?A`<div class="ask">
            ${or({text:n.confirm,confirm:n.button,cancel:this.t("ctl.not_now"),tone:n.tone==="danger"?"danger":"primary",busy:this.pending,onConfirm:()=>this.answer(!0),onCancel:()=>this.answer(!1)})}
          </div>`:w}
      ${this.errorLine()}
    </div>`}};So.properties={asking:{state:!0}},So.styles=[...ie.styles,Pt];Se("sz-action",So);var Ia=de`
  .row {
    min-height: 0;
  }
`,Kr=class extends ie{render(){let t=this.control;return t?this.frame(A`<span class="reading" data-tone=${t.tone??"normal"}>${t.value}</span>`):w}};Kr.styles=[...ie.styles,Ia];Se("sz-reading",Kr);var Wr=class extends ie{constructor(){super(...arguments);this.tick=()=>{this.requestUpdate(),this.timer=setTimeout(this.tick,1e3-Date.now()%1e3+5)}}connectedCallback(){super.connectedCallback(),this.tick()}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.timer),this.timer=void 0}render(){let n=this.control;if(!n)return w;let o=xe(n.end);return this.frame(A`<span class="reading" role="timer" aria-live="off">${o===null?"\u2014":pt(o-Date.now())}</span>`)}};Wr.styles=[...ie.styles,Ia];Se("sz-countdown",Wr);var Zr=class extends ie{constructor(){super();this.onSubmit=n=>{n.preventDefault();let o=this.renderRoot.querySelector("input[type=number]");o&&o.value!==""&&o.checkValidity()?this.choose(Number(o.value)):o?.reportValidity()};this.custom=!1}value(){return typeof this.optimistic=="number"?this.optimistic:this.control?.value??null}choose(n){let o=this.control;if(!o||this.disabled||!Number.isFinite(n))return;let r=Math.min(o.max,Math.max(o.min,Math.round(n)));this.custom=!1,r!==this.value()&&this.send(r)}minutes(n){return n===0?this.t("ctl.off"):this.t("unit.minutes",{n})}render(){let n=this.control;if(!n)return w;let o=this.value(),r=[...new Set([...n.min===0?[0]:[],...n.presets])].filter(l=>l>=n.min&&l<=n.max),i=o!==null&&!r.includes(o),a=this.disabled,s=this.describedBy();return this.frame(A`<div class="chips" role="group" aria-labelledby="label">
          ${r.map(l=>A`<button
              type="button"
              class="sz-button"
              aria-pressed=${l===o?"true":"false"}
              aria-disabled=${this.locked}
              aria-describedby=${s}
              @click=${()=>this.choose(l)}
            >
              ${this.minutes(l)}
            </button>`)}
          <button
            type="button"
            class="sz-button"
            aria-pressed=${i?"true":"false"}
            aria-expanded=${this.custom&&!a?"true":"false"}
            aria-disabled=${this.locked}
            aria-describedby=${s}
            @click=${()=>{this.disabled||(this.custom=!this.custom)}}
          >
            ${this.t("ctl.custom")}
          </button>
        </div>
        ${this.custom&&!a?A`<form class="chips" @submit=${this.onSubmit}>
              <input
                type="number"
                inputmode="numeric"
                min=${n.min}
                max=${n.max}
                step="1"
                required
                .value=${o===null||o===0?"":String(o)}
                aria-label=${this.t("ctl.minutes")}
              />
              <button type="submit" class="sz-button primary">${this.t("ctl.set")}</button>
            </form>`:w}`,{stacked:!0,aside:o===null?null:this.minutes(o)})}};Zr.properties={custom:{state:!0}};Se("sz-duration",Zr);var Fa=class extends ie{value(){return typeof this.optimistic=="number"?this.optimistic:this.control?.value??0}pick(t){this.disabled||t===this.value()||this.send(t)}render(){let t=this.control;if(!t)return w;let n=this.value(),o=Array.from({length:Math.max(1,t.speeds)+1},(i,a)=>a),r=this.describedBy();return this.frame(A`<div class="segmented ${this.disabled?"disabled":""}" role="group" aria-labelledby="label">
      ${o.map(i=>A`<button
          type="button"
          aria-pressed=${i===n?"true":"false"}
          aria-label=${i===0?this.t("ctl.off"):t.speeds===1?this.t("ctl.on"):this.t("ctl.speed",{n:i})}
          aria-disabled=${this.locked}
          aria-describedby=${r}
          @click=${()=>this.pick(i)}
        >
          ${i===0?this.t("ctl.off"):t.speeds===1?this.t("ctl.on"):String(i)}
        </button>`)}
    </div>`)}};Se("sz-fan",Fa);function _g(e,t){if(t)try{let n=new Intl.DateTimeFormat("en-US",{timeZone:t,hourCycle:"h23",hour:"2-digit",minute:"2-digit",second:"2-digit"}).formatToParts(e),o=r=>Number(n.find(i=>i.type===r)?.value??0);return o("hour")*60+o("minute")+o("second")/60}catch{}return e.getHours()*60+e.getMinutes()+e.getSeconds()/60}function Pd(e,t,n){let o=/^(\d{1,2}):(\d{2})$/.exec(e);if(!o)return null;let r=Math.ceil(Number(o[1])*60+Number(o[2])-_g(t,n));return r<=0&&(r+=1440),Math.min(1439,r)}var Ro=class extends ie{constructor(){super(),this.hours=8,this.later=!1,this.time="22:00",this.repeat=!1}current(){}submit(){if(this.disabled||this.pending)return;let t=this.later?Pd(this.time,new Date,this.timeZone):0;t!==null&&this.emit({duration:this.hours,start_in:t,repeat:this.repeat})}render(){if(!this.control)return w;let n=this.disabled||this.pending,o=this.later?Pd(this.time,new Date,this.timeZone):0,r=o===null||o===0?null:this.t("ctl.starts_in",{time:o>=60?this.t("unit.hours_minutes",{h:Math.floor(o/60),m:o%60}):this.t("unit.minutes",{n:o})});return A`
      ${this.head(w)}
      <div class="form" role="group" aria-labelledby="label">
        <div class="field">
          <span id="hours-label">${this.t("ctl.duration")}</span>
          <div class="stepper" role="group" aria-labelledby="hours-label">
            <button type="button" aria-label=${this.t("ctl.decrease")} ?disabled=${n||this.hours<=1} @click=${()=>this.hours-=1}>
              ${Xe(Ye.minus)}
            </button>
            <output aria-live="polite">${this.t("unit.hours",{n:this.hours})}</output>
            <button type="button" aria-label=${this.t("ctl.increase")} ?disabled=${n||this.hours>=12} @click=${()=>this.hours+=1}>
              ${Xe(Ye.plus)}
            </button>
          </div>
        </div>
        <div class="field">
          <span id="start-label">${this.t("ctl.start")}</span>
          <div class="when">
            <div class="segmented ${n?"disabled":""}" role="group" aria-labelledby="start-label">
              <button type="button" aria-pressed=${this.later?"false":"true"} ?disabled=${n} @click=${()=>this.later=!1}>
                ${this.t("ctl.now")}
              </button>
              <button type="button" aria-pressed=${this.later?"true":"false"} ?disabled=${n} @click=${()=>this.later=!0}>
                ${this.t("ctl.later")}
              </button>
            </div>
            ${this.later?A`<input
                  type="time"
                  aria-label=${this.t("ctl.at")}
                  .value=${this.time}
                  ?disabled=${n}
                  @change=${i=>this.time=i.target.value||this.time}
                />`:w}
          </div>
        </div>
        <div class="field">
          <span id="repeat-label">${this.t("ctl.repeat")}</span>
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${this.repeat?"true":"false"}
            aria-labelledby="repeat-label"
            ?disabled=${n}
            @click=${()=>this.repeat=!this.repeat}
          ></button>
        </div>
        <div class="actions">
          ${r?A`<span class="hint">${r}</span>`:w}
          <button type="button" class="sz-button primary" ?disabled=${n} @click=${()=>this.submit()}>
            ${this.t("ctl.schedule")}
          </button>
        </div>
      </div>
      ${this.errorLine()}
    `}};Ro.properties={timeZone:{attribute:!1},hours:{state:!0},later:{state:!0},time:{state:!0},repeat:{state:!0}},Ro.styles=[...ie.styles,de`
      .form {
        display: grid;
        gap: 10px;
        margin-top: 4px;
      }
      .field {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px 16px;
      }
      .field > span:first-child {
        color: var(--sz-muted, #6b7178);
      }
      .when {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
      }
      .actions .hint {
        flex: 1;
      }
    `];Se("sz-ice-delay",Ro);var qr=5,Ao=class extends ie{constructor(){super(),this.sliding={}}current(){let t=this.control;return t?{on:t.on,brightness:t.brightness,kelvin:t.kelvin}:void 0}state(){let t=this.control,n=this.optimistic;return{on:n?.on??t?.on??!1,brightness:n?.brightness??t?.brightness??null,kelvin:n?.kelvin??t?.kelvin??null}}change(t){this.disabled||(this.sliding={},this.send(t))}render(){let t=this.control;if(!t)return w;let n=this.state(),o=this.sliding.brightness??n.brightness,r=this.sliding.kelvin??n.kelvin,i=o===null?0:Math.max(qr,o),a=(i-qr)*100/(100-qr);return A`
      ${this.head(A`<button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${n.on?"true":"false"}
        aria-labelledby="label"
        aria-disabled=${this.locked}
        aria-describedby=${this.describedBy()}
        @click=${()=>this.change({on:!n.on})}
      ></button>`)}
      ${n.on&&(o!==null||r!==null)?A`<div class="sliders">
            ${o!==null?A`<label class="slider">
                  <span>${this.t("ctl.brightness")}</span>
                  <input
                    class="level"
                    type="range"
                    min=${qr}
                    max="100"
                    step="1"
                    style="--filled: ${a}%"
                    .value=${String(i)}
                    ?disabled=${this.disabled}
                    @input=${s=>this.sliding={...this.sliding,brightness:Number(s.target.value)}}
                    @change=${s=>this.change({on:!0,brightness:Number(s.target.value)})}
                  />
                  <output>${Math.round(i)}%</output>
                </label>`:w}
            ${r!==null?A`<label class="slider">
                  <span>${this.t("ctl.white")}</span>
                  <input
                    class="kelvin"
                    type="range"
                    min=${t.min_kelvin}
                    max=${t.max_kelvin}
                    step="50"
                    .value=${String(r)}
                    ?disabled=${this.disabled}
                    @input=${s=>this.sliding={...this.sliding,kelvin:Number(s.target.value)}}
                    @change=${s=>this.change({on:!0,kelvin:Number(s.target.value)})}
                  />
                  <output>${Math.round(r)} K</output>
                </label>`:w}
          </div>`:w}
      ${this.errorLine()}
    `}};Ao.properties={sliding:{state:!0}},Ao.styles=[...ie.styles,de`
      /* One set of columns for both sliders, so their tracks start and end together. */
      .sliders {
        display: grid;
        grid-template-columns: max-content minmax(0, 1fr) 4.2em;
        gap: 10px 12px;
        margin-top: 8px;
      }
      .sliders .slider {
        grid-column: 1 / -1;
        grid-template-columns: subgrid;
      }
    `];Se("sz-light",Ao);var bg=5,vg=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End","PageUp","PageDown"]);function Ld(e){return e.altKey||e.ctrlKey||e.metaKey?!1:vg.has(e.key)||e.key!==" "&&[...e.key].length===1}function wg(e){return e.altKey&&(e.key==="ArrowDown"||e.key==="ArrowUp")||e.key===" "||e.key==="Enter"||e.key==="F4"}var Na=class extends ie{constructor(){super(...arguments);this.onKey=n=>{let o=n.currentTarget;if(this.disabled){(Ld(n)||wg(n))&&n.preventDefault();return}if(Ld(n)){n.preventDefault();try{o.showPicker?.()}catch{}}}}value(){return typeof this.optimistic=="string"?this.optimistic:this.control?.value??null}pick(n){this.disabled||n===this.value()||this.send(n)}render(){let n=this.control;if(!n)return w;let o=this.value(),r=n.options.some(i=>i.value===o);if(n.options.length<=bg){let i=n.options.length>3||n.options.some(l=>l.label.length>12),a=r||o===null?null:this.t("value.now",{temp:le(this.t,o)}),s=[n.hint,a].filter(Boolean).join(`
`)||null;return this.frame(A`<div class="segmented ${this.disabled?"disabled":""}" role="group" aria-labelledby="label">
          ${n.options.map(l=>A`<button
              type="button"
              aria-pressed=${l.value===o?"true":"false"}
              aria-disabled=${this.locked}
              aria-describedby=${this.describedBy(s)}
              @click=${()=>this.pick(l.value)}
            >
              ${l.label}
            </button>`)}
        </div>`,{stacked:i,hint:s})}return this.frame(A`<span class="dropdown">
        <select
          aria-labelledby="label"
          aria-disabled=${this.locked}
          aria-describedby=${this.describedBy()}
          @keydown=${this.onKey}
          @change=${i=>this.pick(i.target.value)}
        >
          ${r?w:A`<option value="" disabled selected>${o===null?"\u2014":le(this.t,o)}</option>`}
          ${n.options.map(i=>A`<option value=${i.value} ?selected=${i.value===o}>${i.label}</option>`)}
        </select>
        ${Xe(Ye.chevron)}
      </span>`)}updated(n){super.updated(n);let o=this.renderRoot.querySelector("select"),r=this.value();o&&r!==null&&o.value!==r&&this.control?.options.some(i=>i.value===r)&&(o.value=r)}};Se("sz-select",Na);var kg=600,xg=(e,t)=>e.toFixed(t);function Od(e){let t=String(e);return t.includes(".")?t.length-t.indexOf(".")-1:0}function zg(e,t){return Number(e.toFixed(Od(t)))}var Yr=class extends ie{constructor(){super(...arguments);this.onKey=n=>{let o=n.key==="ArrowUp"||n.key==="ArrowRight"?1:n.key==="ArrowDown"||n.key==="ArrowLeft"?-1:0;o&&(n.preventDefault(),this.bump(o))}}disconnectedCallback(){this.commitTimer!==void 0&&this.commit(),super.disconnectedCallback()}shown(){return typeof this.optimistic=="number"?this.optimistic:this.control?.value??null}bump(n){let o=this.control;if(!o||this.disabled)return;let r=this.shown(),i=r===null?o.min+Math.round((o.max-o.min)/2/o.step)*o.step:r+n*o.step,a=Math.min(o.max,Math.max(o.min,zg(i,o.step)));a!==r&&(this.optimistic=a,clearTimeout(this.commitTimer),this.commitTimer=setTimeout(()=>this.commit(),kg))}commit(){clearTimeout(this.commitTimer),this.commitTimer=void 0;let n=this.optimistic;if(typeof n=="number"){if(n===this.control?.value){this.clearOptimistic();return}this.send(n)}}render(){let n=this.control;if(!n)return w;let o=this.shown(),r=this.disabled,i=o!==null&&o<=n.min,a=o!==null&&o>=n.max,s=this.describedBy();return this.frame(A`
      <div class="stepper ${this.commitTimer!==void 0?"draft":""}" role="group" aria-labelledby="label" @keydown=${this.onKey}>
        <button
          type="button"
          aria-label=${this.t("ctl.decrease")}
          aria-disabled=${i||r?"true":w}
          aria-describedby=${s}
          @click=${()=>this.bump(-1)}
        >
          ${Xe(Ye.minus)}
        </button>
        <!-- No setpoint (an oven that's off) reads as a blank display, not as a number. -->
        <output aria-live="polite" class=${o===null?"empty":w}>
          ${o===null?"--":(this.formatNumber??xg)(o,Od(n.step))}<span class="unit">${n.unit}</span>
        </output>
        <button
          type="button"
          aria-label=${this.t("ctl.increase")}
          aria-disabled=${a||r?"true":w}
          aria-describedby=${s}
          @click=${()=>this.bump(1)}
        >
          ${Xe(Ye.plus)}
        </button>
      </div>
    `)}};Yr.properties={formatNumber:{attribute:!1}};Se("sz-setpoint",Yr);var Ba=class extends ie{value(){return typeof this.optimistic=="boolean"?this.optimistic:this.control?.value??null}flip(){this.disabled||this.send(!this.value())}render(){if(!this.control)return w;let t=this.value();return t===null&&this.disabled?this.frame(A`<span class="reading">—</span>`):this.frame(A`<button
      type="button"
      class="switch ${t===null?"unknown":""}"
      role="switch"
      aria-checked=${t===!0?"true":"false"}
      aria-labelledby="label"
      aria-disabled=${this.locked}
      aria-describedby=${this.describedBy()}
      @click=${()=>this.flip()}
    ></button>`)}};Se("sz-toggle",Ba);function Vd(e,t){let{t:n,pending:o,error:r,onValue:i}=t,a=t.quiet===!0,s=t.sharedReason===!0;switch(e.kind){case"setpoint":return A`<sz-setpoint
        .control=${e}
        .t=${n}
        .pending=${o}
        .error=${r}
        .sharedReason=${s}
        .formatNumber=${t.formatNumber}
        ?quiet=${a}
        @sz-value=${i}
      ></sz-setpoint>`;case"select":return A`<sz-select .control=${e} .t=${n} .pending=${o} .error=${r} .sharedReason=${s} ?quiet=${a} @sz-value=${i}></sz-select>`;case"toggle":return A`<sz-toggle .control=${e} .t=${n} .pending=${o} .error=${r} .sharedReason=${s} ?quiet=${a} @sz-value=${i}></sz-toggle>`;case"action":return A`<sz-action .control=${e} .t=${n} .pending=${o} .error=${r} .sharedReason=${s} ?quiet=${a} @sz-value=${i}></sz-action>`;case"duration":return A`<sz-duration .control=${e} .t=${n} .pending=${o} .error=${r} .sharedReason=${s} ?quiet=${a} @sz-value=${i}></sz-duration>`;case"fan":return A`<sz-fan .control=${e} .t=${n} .pending=${o} .error=${r} .sharedReason=${s} ?quiet=${a} @sz-value=${i}></sz-fan>`;case"light":return A`<sz-light .control=${e} .t=${n} .pending=${o} .error=${r} .sharedReason=${s} ?quiet=${a} @sz-value=${i}></sz-light>`;case"reading":return A`<sz-reading .control=${e} .t=${n} ?quiet=${a}></sz-reading>`;case"countdown":return A`<sz-countdown .control=${e} .t=${n} ?quiet=${a}></sz-countdown>`;case"ice_delay":return A`<sz-ice-delay
        .control=${e}
        .t=${n}
        .pending=${o}
        .error=${r}
        .sharedReason=${s}
        .timeZone=${t.timeZone}
        ?quiet=${a}
        @sz-value=${i}
      ></sz-ice-delay>`}}var Sg=/^(lower_)?oven_(cooking_timer_complete|cooking_timer_under_one_minute|door_ajar|preheated|probe_connected|probe_target_reached|probe_within_ten_degrees|self_clean_complete)$/,Rg=864e5;function ja(e){if(typeof e=="number"&&Number.isFinite(e))return e<1e11?e*1e3:e;if(typeof e=="string"&&e){let t=Date.parse(e);return Number.isNaN(t)?null:t}return null}function Ag(e,t){if(!Array.isArray(e))return[];let n=new Set,o=[];for(let r of e){if(!r||typeof r!="object")continue;let i=r.s??r.state;if(typeof i!="string"||i==="unavailable"||i==="unknown")continue;let a=r.a??r.attributes??{},s=a.event_type;if(typeof s!="string"||!s)continue;let l=ja(a.appliance_timestamp)??ja(i)??ja(r.lc??r.lu??r.last_changed);if(l===null||l<t)continue;let p=`${l}|${s}`;n.has(p)||(n.add(p),o.push({type:s,time:l}))}return o.sort((r,i)=>i.time-r.time)}async function Hd(e,t,n,o=7){let r=n-o*Rg,i=await e.callWS({type:"history/history_during_period",start_time:new Date(r).toISOString(),entity_ids:[t],include_start_time_state:!1,significant_changes_only:!1,minimal_response:!1,no_attributes:!1});return Ag(i?.[t],r)}function Id(e){let t=e.appliance.spec,o=t?.family==="range"||t?.family==="wall_oven"||t?.family==="generic"&&t.form==="oven"?Ct(e):[];return o.length<2?{}:Object.fromEntries(o.map(r=>[r.prefix,mn(e,r)]))}function Fd(e,t,n={}){let o=Sg.exec(t),r=o?n[o[1]?"cav2":"cav"]:void 0;if(o&&r)return e("event.in_cavity",{cavity:r,event:e(`event.cavity.${o[2]}`)});let i=`event.${t}`,a=e(i);return a===i?t:a}var Nd=["finish","panel_color","knobs","handle","style","form"];function Bd(e,t){return Nd.every(n=>e[n]===t[n])}function Mo(e){return typeof e=="string"&&/^#[0-9a-f]{6}$/i.test(e)}var Mg={"#f4f2ec":"white","#ece4d2":"cream","#9aa0a6":"gray","#2f3b52":"navy","#9caf88":"sage","#1f2022":"black","#5b3a29":"walnut","#b08955":"oak"};function jd(e){return Mg[e.toLowerCase()]??null}function Ud(e,t,n){let o=new Set,r=n.finish??[];r.length&&o.add("finish"),r.includes("panel")&&o.add("panel_color"),n.knobs&&o.add("knobs"),n.handle&&o.add("handle"),n.style&&o.add("style"),n.forms?.length&&o.add("form");let i={};for(let a of Nd)o.has(a)&&t[a]!==e[a]&&(i[a]=t[a]);return i}function Kd(e){let t=e.appearance_options?.forms??[];return t.includes(e.detected_form)?[...t]:[e.detected_form,...t]}function Wd(e,t){let n=e.spec,o=t.form??e.detected_form;return n.form===o?n:n.family==="wall_oven"&&(o==="single"||o==="double")?Tg(n,o):{...n,form:o}}function Tg(e,t){let n=e.ovens[0]??{prefix:"cav",position:"single",width:e.width};if(t==="single")return{...e,form:t,ovens:[{...n,position:"single"}]};let o=e.ovens[1]??{prefix:"cav2",position:"lower",width:n.width};return{...e,form:t,ovens:[{...n,position:"upper"},{...o,position:"lower"}]}}var Cg=0,Gg={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1},To=class extends Me{constructor(){super();this.uid=`sza${++Cg}`;this.size=new Dt(this,".preview .drawing > svg");this.onAskKey=n=>{n.key==="Escape"&&(n.stopPropagation(),this.answerReset(!1))};this.onRadioKey=n=>{let o=Gg[n.key];if(!o)return;let i=[...n.currentTarget.querySelectorAll('[role="radio"]:not(:disabled)')],a=i.indexOf(n.target);if(a<0||i.length<2)return;n.preventDefault();let s=i[(a+o+i.length)%i.length];s.focus(),s.click()};this.saving=!1,this.message=null,this.askingReset=!1}willUpdate(n){gt(this,this.hass);let o=this.appliance;if(!n.has("appliance")||!o)return;let r=n.get("appliance")?.appliance_id!==o.appliance_id;(r||!this.pending||!this.saved||Bd(this.pending,this.saved))&&(this.pending={...o.appearance},r&&(this.message=null)),this.saved=o.appearance}render(){let{hass:n,appliance:o,pending:r}=this;if(!n||!o||!r)return w;let i=Be(n),a=n.user?.is_admin===!0,s=o.appearance_options,l=s.finish??[],p=this.saved?Ud(this.saved,r,s):{},d=Object.keys(p).length>0,u=!a||this.saving;return A`
      <div class="layout">
        <div class="preview stage" aria-label=${i("appearance.preview")} role="img">
          <div class="drawing">${this.renderPreview(o,r)}</div>
        </div>
        <div class="fields">
          <p class="note">${i(a?"appearance.hint":"appearance.admin_only")}</p>
          ${l.length>1?this.radios("finish",i("appearance.finish"),l.map(h=>({value:h,label:i(`finish.${h}`)})),r.finish,h=>this.setFinish(h,s.panel_colors),u):w}
          ${r.finish==="panel"?this.panelColors(i,s.panel_colors??[],u):w}
          ${s.knobs?this.radios("knobs",i("appearance.knobs"),s.knobs.map(h=>({value:h,label:i(`knobs.${h}`),swatch:`var(--sz-knob-${h})`})),r.knobs,h=>this.edit({knobs:h}),u,"swatches"):w}
          ${s.handle?this.radios("handle",i("appearance.handle"),s.handle.map(h=>({value:h,label:i(`handle.${h}`)})),r.handle,h=>this.edit({handle:h}),u):w}
          ${s.style?this.radios("style",i("appearance.style"),s.style.map(h=>({value:h,label:i(`style.${h}`)})),r.style??this.modelStyle()??s.style[0]??null,h=>this.edit({style:h}),u):w}
          ${this.formSelect(i,o,r,u)}
          <div class="actions">
            <button
              type="button"
              class="sz-button reset"
              aria-expanded=${this.askingReset?"true":"false"}
              ?disabled=${u||this.askingReset}
              @click=${()=>this.askReset()}
            >
              ${i("appearance.reset")}
            </button>
            <button
              type="button"
              class="sz-button primary"
              ?disabled=${u||!d}
              @click=${()=>this.save(p)}
            >
              ${this.saving?i("appearance.saving"):i("appearance.save")}
            </button>
          </div>
          ${this.askingReset&&a?A`<div class="ask" @keydown=${this.onAskKey}>
                ${or({text:i("appearance.reset_confirm"),confirm:i("appearance.reset_action"),cancel:i("ctl.not_now"),onConfirm:()=>this.answerReset(!0),onCancel:()=>this.answerReset(!1)})}
              </div>`:w}
          ${this.message?A`<p
                class="message ${this.message.kind}"
                role=${this.message.kind==="error"?"alert":"status"}
              >
                ${this.message.text}
              </p>`:w}
        </div>
      </div>
    `}renderPreview(n,o){let r=this.hass,a={...Fe(`${n.spec.family} preview state`,()=>Cn(n).drawingState(Gn(n,r,Be(r),Date.now(),De)),null)??{readouts:{}},available:!0,doors:{}},s={...n,available:!0};return Dn(En(s,a,r,this.uid,{appearance:o,spec:Wd(n,o),pixelHeight:this.size.height}))}modelStyle(){let n=this.appliance?.spec;return n&&(n.family==="wall_oven"||n.family==="range")?n.style:null}radios(n,o,r,i,a,s,l="segmented"){let p=`${this.uid}-${n}`,d=r.some(u=>u.value===i)?i:r[0]?.value;return A`<div class="field">
      <span class="label" id=${p}>${o}</span>
      <div class=${l} role="radiogroup" aria-labelledby=${p} @keydown=${this.onRadioKey}>
        ${r.map(u=>A`<button
            type="button"
            role="radio"
            class=${u.swatch?"swatch":"segment"}
            aria-checked=${u.value===i?"true":"false"}
            aria-label=${u.swatch?u.label:w}
            title=${u.swatch?u.label:w}
            tabindex=${u.value===d?0:-1}
            style=${u.swatch?`--swatch: ${u.swatch}`:w}
            ?disabled=${s}
            @click=${()=>a(u.value)}
          >
            ${u.swatch?w:u.label}
          </button>`)}
      </div>
    </div>`}panelColors(n,o,r){let i=this.pending?.panel_color??null,a=i!==null&&!o.some(h=>h.toLowerCase()===i.toLowerCase()),s=`${this.uid}-panel`,l=o.filter(Mo),p=a||!i?null:i.toLowerCase(),d=h=>{let g=jd(h);return g?n(`panel_color.${g}`):n("appearance.panel_color_value",{color:h.toUpperCase()})},u=p?d(p):a?n("appearance.custom_color"):null;return A`<div class="field">
      <span class="field-head">
        <span class="label" id=${s}>${n("appearance.panel_color")}</span>
        ${u?A`<span class="chosen" aria-hidden="true">${u}</span>`:w}
      </span>
      <div class="swatches" role="radiogroup" aria-labelledby=${s} @keydown=${this.onRadioKey}>
        ${l.map((h,g)=>{let y=h.toLowerCase()===p,$=d(h);return A`<button
            type="button"
            role="radio"
            class="swatch"
            aria-checked=${y?"true":"false"}
            aria-label=${$}
            title=${$}
            tabindex=${y||p===null&&!a&&g===0?0:-1}
            style="--swatch: ${h}"
            ?disabled=${r}
            @click=${()=>this.edit({panel_color:h})}
          ></button>`})}
        <label
          class="swatch custom ${a?"checked":""}"
          title=${n("appearance.custom_color")}
          style=${a?`--swatch: ${i}`:w}
        >
          <input
            type="color"
            aria-label=${n("appearance.custom_color")}
            .value=${Mo(i)?i:"#d9d4c7"}
            ?disabled=${r}
            @input=${h=>{let g=h.target.value;Mo(g)&&this.edit({panel_color:g.toLowerCase()})}}
          />
        </label>
      </div>
    </div>`}formSelect(n,o,r,i){let a=Kd(o);if(a.length<2)return w;let s=r.form??o.detected_form,l=`${this.uid}-form`;return A`<div class="field">
      <label class="label" for=${l}>${n("appearance.form")}</label>
      <span class="dropdown">
        <select
          id=${l}
          ?disabled=${i}
          @change=${p=>{let d=p.target.value;this.edit({form:d===o.detected_form?null:d})}}
        >
          ${a.map(p=>{let d=n(`form.${p}`);return A`<option value=${p} .selected=${p===s}>
              ${p===o.detected_form?n("appearance.detected",{form:d}):d}
            </option>`})}
        </select>
        ${Xe(Ye.chevron)}
      </span>
    </div>`}setFinish(n,o){let r=this.pending?.panel_color??null,i=n==="panel"?r??o?.find(Mo)??null:null;this.edit({finish:n,panel_color:i})}edit(n){this.pending&&(this.pending={...this.pending,...n},this.message=null)}async askReset(){this.askingReset=!0,this.message=null,await this.updateComplete,this.renderRoot.querySelector(".ask .sz-button")?.focus()}answerReset(n){this.askingReset=!1,n&&this.save(null),this.updateComplete.then(()=>this.renderRoot.querySelector(".actions .reset")?.focus())}async save(n){let{hass:o,appliance:r}=this;if(!o||!r||this.saving)return;let i=Be(o);this.saving=!0,this.message=null;try{let a=await o.callWS({type:"subzero/panel/set_appearance",appliance_id:r.appliance_id,appearance:n});a?.appearance&&(this.saved=a.appearance,this.pending={...a.appearance}),this.message={kind:"saved",text:i("appearance.saved")}}catch(a){this.message={kind:"error",text:i("appearance.error",{message:Gt(a)})}}finally{this.saving=!1}}};To.properties={hass:{attribute:!1},appliance:{attribute:!1},pending:{state:!0},saving:{state:!0},message:{state:!0},askingReset:{state:!0}},To.styles=[ht,mt,Pt,de`
      :host {
        display: block;
        color: var(--sz-text);
        container-type: inline-size;
        /* The knob swatches, lit from the upper left like the drawings. */
        --sz-knob-red: radial-gradient(circle at 35% 30%, #e2564c 0%, #b01c1c 45%, #6f0d10 100%);
        --sz-knob-black: radial-gradient(circle at 35% 30%, #6b6d70 0%, #232425 48%, #0b0b0c 100%);
        --sz-knob-stainless: radial-gradient(
          circle at 35% 30%,
          #ffffff 0%,
          #d3d7db 35%,
          #9ba1a7 75%,
          #c9cdd1 100%
        );
      }
      .layout {
        display: grid;
        gap: 20px;
      }
      @container (min-width: 560px) {
        .layout {
          grid-template-columns: minmax(180px, 2fr) 3fr;
          align-items: start;
        }
      }
      .preview {
        height: 260px;
        padding: 12px;
        border-radius: 12px;
        background: var(--sz-inset-bg);
        box-shadow: inset 0 0 0 1px var(--sz-inset-edge);
      }
      .fields {
        display: grid;
        gap: 16px;
        min-width: 0;
      }
      .note {
        margin: 0;
        font-size: 14px;
        line-height: 1.45;
        color: var(--sz-muted);
      }
      .field {
        display: grid;
        gap: 8px;
      }
      /* Labels, chips and the dropdown look like the full view's controls above. */
      .label {
        font-size: 14px;
        font-weight: 500;
        color: var(--sz-text);
      }
      .field-head {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 4px 8px;
      }
      .chosen {
        font-size: 13.5px;
        color: var(--sz-muted);
      }
      .segmented {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        max-width: 100%;
      }
      .segment {
        min-height: 40px;
        padding: 6px 14px;
        border: none;
        border-radius: 999px;
        background: var(--sz-control-bg);
        color: var(--sz-text);
        font: inherit;
        font-size: 13.5px;
        font-weight: 600;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }
      .segment:hover:not(:disabled):not([aria-checked="true"]) {
        background: var(--sz-control-hover);
      }
      .segment[aria-checked="true"] {
        background: var(--sz-accent-fill, var(--sz-accent));
        color: var(--sz-on-accent);
      }
      .swatches {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .swatch {
        position: relative;
        width: 40px;
        height: 40px;
        padding: 0;
        border: none;
        border-radius: 50%;
        background: var(--swatch, transparent);
        box-shadow:
          inset 0 0 0 1px rgba(0, 0, 0, 0.18),
          0 1px 2px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }
      .swatch[aria-checked="true"],
      .swatch.checked {
        box-shadow:
          inset 0 0 0 1px rgba(0, 0, 0, 0.18),
          0 0 0 2px var(--sz-card-bg),
          0 0 0 4px var(--sz-accent);
      }
      /* A light edge on a dark card, or the black panel color disappears into it. */
      :host([dark]) .swatch {
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.22),
          0 1px 2px rgba(0, 0, 0, 0.4);
      }
      :host([dark]) .swatch[aria-checked="true"],
      :host([dark]) .swatch.checked {
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.22),
          0 0 0 2px var(--sz-card-bg),
          0 0 0 4px var(--sz-accent);
      }
      .swatch.custom {
        display: grid;
        place-items: center;
        background: var(
          --swatch,
          conic-gradient(#e85d5d, #e8c35d, #8fd16a, #5dc3e8, #8a6de8, #e85dc3, #e85d5d)
        );
        overflow: hidden;
      }
      .swatch.custom input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
      .swatch.custom:focus-within,
      .swatch:focus-visible,
      select:focus-visible {
        outline: 2px solid var(--sz-accent);
        outline-offset: 2px;
      }
      .segment:focus-visible {
        outline: 2px solid var(--sz-accent);
        outline-offset: 2px;
      }
      button:disabled,
      select:disabled {
        opacity: 0.5;
        cursor: default;
      }
      /* Its own rule: a browser without :has() would drop the whole list above. */
      .swatch.custom:has(input:disabled) {
        opacity: 0.5;
        cursor: default;
      }
      .dropdown {
        position: relative;
        display: inline-flex;
        width: fit-content;
        max-width: 100%;
      }
      select {
        max-width: 100%;
        min-height: 40px;
        padding: 7px 36px 7px 14px;
        border: none;
        border-radius: 999px;
        background: var(--sz-control-bg);
        color: var(--sz-text);
        font: inherit;
        font-size: 14px;
        font-weight: 600;
        text-overflow: ellipsis;
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
      }
      :host([dark]) select {
        color-scheme: dark;
      }
      .dropdown svg {
        position: absolute;
        top: 50%;
        right: 12px;
        width: 18px;
        height: 18px;
        margin-top: -9px;
        fill: currentColor;
        pointer-events: none;
      }
      /* Any finger, not just a main one: touch laptops report a mouse as their main pointer. */
      @media (any-pointer: coarse) {
        .segment,
        select {
          min-height: 44px;
        }
        .swatch {
          width: 44px;
          height: 44px;
        }
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 8px;
        margin-top: 4px;
      }
      .message {
        margin: 0;
        font-size: 13.5px;
      }
      .message.error {
        color: var(--sz-error-text);
      }
      .message.saved {
        color: var(--sz-muted);
      }
    `];customElements.get("sz-appearance-editor")||customElements.define("sz-appearance-editor",To);var Eg=50,Dg=f`<path d="M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6z" />`,Pg=f`<path d="M17.7 6.3A8 8 0 1 0 19.7 14h-2.1A6 6 0 1 1 12 6c1.7 0 3.1.7 4.2 1.8L13 11h7V4l-2.3 2.3Z" />`,Lg=0;function Zd(e,t){let n={...e};return delete n[t],n}function Og(e,t){return e.trim().toLocaleLowerCase()===t.trim().toLocaleLowerCase()}function Vg(e){return e.kind==="ice_delay"?{type:"service",domain:"subzero",service:"schedule_ice_delay",data:{device_id:e.device_id}}:"action"in e?e.action:null}var Co=class extends Me{constructor(){super();this.uid=`szv${++Lg}`;this.size=new Dt(this,".stage .drawing > svg");this.clock=Date.now();this.eventsFor=null;this.tick=()=>{this.clock=Date.now(),this.now===void 0&&this.requestUpdate(),this.timer=setTimeout(this.tick,1e3-this.clock%1e3+5)};this.narrow=!1,this.isAdmin=!1,this.pending={},this.errors={},this.events=null,this.eventsError=null,this.refreshing=!1,this.refreshError=null}connectedCallback(){super.connectedCallback(),this.stopHelpers=De.onChange(()=>this.requestUpdate()),this.tick()}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.timer),this.timer=void 0,this.stopHelpers?.(),this.stopHelpers=void 0}shouldUpdate(n){return n.size===1&&n.has("hass")&&this.hass&&this.appliance?Ko(n.get("hass"),this.hass,this.appliance):!0}willUpdate(n){gt(this,this.hass);let o=n.get("appliance");n.has("appliance")&&o?.device_id!==this.appliance?.device_id&&(this.pending={},this.errors={},this.events=null,this.eventsError=null,this.refreshError=null,this.eventsFor=null),!this.helpers&&this.hass&&this.appliance&&De.observe(this.hass,[this.appliance])}updated(){this.fetchEventsIfNeeded()}fetchEventsIfNeeded(){let{hass:n,appliance:o}=this;if(!n||!o)return;let r=o.entities?.appliance_event?.event;if(!r)return;let i=`${o.device_id}|${r}|${n.states[r]?.state??""}`;i!==this.eventsFor&&(this.eventsFor=i,Hd(n,r,Date.now()).then(a=>{this.eventsFor===i&&(this.events=a,this.eventsError=null)},a=>{this.eventsFor===i&&(this.eventsError=Gt(a))}))}async apply(n,o,r){let i=this.hass,a=Vg(o);if(!(!i||!a)){this.pending={...this.pending,[n]:!0},this.errors=Zd(this.errors,n);try{await Zs(i,a,r)}catch(s){this.errors={...this.errors,[n]:Gt(s)||Be(i)("full.failed")}}finally{this.pending=Zd(this.pending,n)}}}async refresh(){let{hass:n,appliance:o}=this;if(!(!n||!o||this.refreshing)){this.refreshing=!0,this.refreshError=null;try{await n.callService("subzero","refresh",{device_id:[o.device_id]})}catch(r){this.refreshError=Gt(r)||Be(n)("full.failed")}finally{this.refreshing=!1}}}render(){let{hass:n,appliance:o}=this;if(!n||!o)return w;let r=Be(n),i=this.now??this.clock,a=Cn(o),s=Gn(o,n,r,i,this.helpers??De),l=$=>`${o.spec?.family} ${$} for ${o.device_id}`,p=Fe(l("drawing state"),()=>a.drawingState(s),{available:o.available,doors:{},readouts:{}}),d=Fe(l("status"),()=>a.status(s),{text:"",tone:"neutral"}),u=o.available?Fe(l("display"),()=>a.display(s),null):null,h=Fe(l("sections"),()=>a.sections(s),[]),g=Fe(l("oven names"),()=>Id(s),{}),y={timeZone:Pr(n),formatNumber:($,b)=>wa(n,$,b,b)};return A`<div class="layout">
      <section class="hero" aria-label=${r("full.appliance")}>
        <div class="hero-head">
          <!-- Not a live region: preheat and timer pills change every second. -->
          <div>${tr(d)}</div>
          ${nr(u,Ha(p))}
        </div>
        <div class="stage">
          <div class="drawing">
            ${Dn(En(o,p,n,this.uid,{pixelHeight:this.size.height}))}
          </div>
        </div>
      </section>
      <div class="sections">
        ${Nn(h,$=>$.id,$=>this.renderSection($,r,y))}
        ${this.renderEvents(r,n,i,g)} ${this.renderRefresh(r)} ${this.isAdmin?this.renderAppearance(r):w}
      </div>
    </div>`}card(n,o,r){return A`<details class="card" ?open=${r}>
      <summary>
        <h2>${n}</h2>
        <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true">${Dg}</svg>
      </summary>
      <div class="body">${o}</div>
    </details>`}renderSection(n,o,r){let i=new Map;for(let d of n.controls)d.disabled&&d.reason&&i.set(d.reason,(i.get(d.reason)??0)+1);let a=[...i].filter(([,d])=>d>1).map(([d])=>d),s=(d,u)=>A`<p class="note shared" aria-hidden=${u?"true":w}>${Xe(Ye.lock)}<span>${d}</span></p>`;if(a.length===1&&n.controls.every(d=>d.kind==="toggle"&&d.value===null&&d.disabled&&d.reason===a[0]))return this.card(n.title,s(a[0],!1),!n.collapsed);let p=n.controls.length===1&&Og(n.controls[0].label,n.title);return this.card(n.title,A`${a.map(d=>s(d,!0))}
      ${Nn(n.controls,d=>d.id,d=>{let u=`${n.id}/${d.id}`;return A`<div class="control">
            ${Vd(d,{t:o,pending:!!this.pending[u],error:this.errors[u]??null,onValue:h=>{this.apply(u,d,h.detail.value)},quiet:p,sharedReason:!!(d.disabled&&d.reason&&a.includes(d.reason)),...r})}
          </div>`})}`,!n.collapsed)}renderEvents(n,o,r,i){if(!this.appliance?.entities?.appliance_event?.event)return w;let a;return!this.events&&this.eventsError?a=A`<p class="note error" role="alert">${n("full.events_error",{error:this.eventsError})}</p>
        <button type="button" class="sz-button" @click=${()=>this.retryEvents()}>${n("overview.retry")}</button>`:this.events?this.events.length?a=A`<ol class="events">
        ${this.events.slice(0,Eg).map(s=>A`<li>
            <span>${Fd(n,s.type,i)}</span>
            <time datetime=${new Date(s.time).toISOString()}>${mo(o,s.time,r)}</time>
          </li>`)}
      </ol>`:a=A`<p class="note">${n("full.no_events")}</p>`:a=A`<p class="note">${n("full.events_loading")}</p>`,this.card(n("full.recent_events"),a,!0)}retryEvents(){this.eventsFor=null,this.eventsError=null}renderRefresh(n){return A`<div class="refresh">
      <button type="button" class="sz-button" ?disabled=${this.refreshing} @click=${()=>{this.refresh()}}>
        <svg class="${this.refreshing?"spinning":""}" viewBox="0 0 24 24" aria-hidden="true">${Pg}</svg>
        ${n(this.refreshing?"full.refreshing":"full.refresh")}
      </button>
      ${this.refreshError?A`<span class="error" role="alert">${this.refreshError}</span>`:A`<span class="note">${n("full.refresh_hint")}</span>`}
    </div>`}renderAppearance(n){return this.card(n("full.appearance"),A`<sz-appearance-editor .hass=${this.hass} .appliance=${this.appliance}></sz-appearance-editor>`,!1)}};Co.properties={hass:{attribute:!1},appliance:{attribute:!1},narrow:{type:Boolean,reflect:!0},isAdmin:{type:Boolean},now:{attribute:!1},helpers:{attribute:!1},pending:{state:!0},errors:{state:!0},events:{state:!0},eventsError:{state:!0},refreshing:{state:!0},refreshError:{state:!0}},Co.styles=[ht,Qo,mt,Pt,de`
      :host {
        display: block;
        color: var(--sz-text);
        container-type: inline-size;
      }
      :host([dark]) {
        color-scheme: dark;
      }
      .layout {
        display: grid;
        grid-template-columns: minmax(300px, 5fr) minmax(0, 7fr);
        align-items: start;
        gap: 20px;
        max-width: 1240px;
        margin: 0 auto;
      }
      .hero,
      .card {
        box-sizing: border-box;
        border: var(--sz-border-width) solid var(--sz-border);
        border-radius: var(--sz-radius);
        background: var(--sz-card-bg);
        box-shadow: var(--ha-card-box-shadow, none);
      }
      /* The page scrolls under the panel's sticky toolbar; the drawing stays in view below it. */
      .hero {
        position: sticky;
        top: calc(var(--sz-toolbar-height, 0px) + 16px);
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 14px 16px 18px;
      }
      .hero-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        min-height: 32px;
      }
      .hero-head .pill {
        max-width: none;
        padding: 4px 12px;
        font-size: 13px;
      }
      /* The drawing takes its own proportions, up to a height that keeps a tall column in
         view; a wide range is then no taller than it needs to be. */
      .stage,
      .stage .drawing {
        height: auto;
      }
      .stage .drawing > svg {
        max-height: min(68vh, 640px);
      }
      .sections {
        display: flex;
        flex-direction: column;
        gap: 12px;
        min-width: 0;
      }
      summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        min-height: 52px;
        padding: 0 16px;
        box-sizing: border-box;
        border-radius: var(--sz-radius);
        cursor: pointer;
        list-style: none;
        -webkit-tap-highlight-color: transparent;
      }
      summary::-webkit-details-marker {
        display: none;
      }
      summary:focus-visible {
        outline: 2px solid var(--sz-accent);
        outline-offset: -2px;
      }
      summary h2 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      .chevron {
        flex: none;
        width: 22px;
        height: 22px;
        fill: var(--sz-muted);
        transition: transform 0.2s;
      }
      details[open] > summary .chevron {
        transform: rotate(180deg);
      }
      .body {
        padding: 0 16px 10px;
      }
      .control {
        padding: 10px 0;
        border-top: 1px solid var(--sz-divider);
      }
      /* Values to read sit closer than controls to use, like Home Assistant's device info. */
      .control:has(> sz-reading, > sz-countdown) {
        padding: 7px 0;
      }
      .control:first-child {
        padding-top: 0;
        border-top: none;
      }
      .note {
        margin: 0 0 6px;
        color: var(--sz-muted);
      }
      .note.shared {
        display: flex;
        align-items: flex-start;
        gap: 6px;
        margin-bottom: 10px;
        font-size: 13px;
      }
      .note.shared svg {
        flex: none;
        width: 14px;
        height: 14px;
        margin-top: 2px;
        fill: currentColor;
      }
      .error {
        color: var(--sz-error-text);
      }
      .events {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .events li {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 2px 16px;
        padding: 9px 0;
        border-top: 1px solid var(--sz-divider);
      }
      .events li:first-child {
        padding-top: 0;
        border-top: none;
      }
      .events time {
        color: var(--sz-muted);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      .refresh {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 14px;
        padding: 4px 2px;
      }
      .refresh svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
      }
      .refresh .note {
        margin: 0;
        font-size: 13px;
      }
      .spinning {
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .chevron {
          transition: none;
        }
        .spinning {
          animation: none;
        }
      }
      /* Narrow: the drawing on top, short enough that the first controls show under it. */
      @container (max-width: 760px) {
        .layout {
          grid-template-columns: minmax(0, 1fr);
          gap: 12px;
        }
        .hero {
          position: static;
        }
        .stage .drawing > svg {
          max-height: min(42vh, 360px);
        }
      }
      :host([narrow]) .layout {
        grid-template-columns: minmax(0, 1fr);
        gap: 12px;
      }
      :host([narrow]) .hero {
        position: static;
      }
      :host([narrow]) .stage .drawing > svg {
        max-height: min(42vh, 360px);
      }
    `];customElements.get("sz-appliance-view")||customElements.define("sz-appliance-view",Co);var Hg="sz-open-appliance",Ig=0,Go=class extends Me{constructor(){super();this.uid=`szc${++Ig}`;this.size=new Dt(this,".drawing > svg");this.name="";this.now=Date.now(),this.helpers=De,this.addEventListener("click",()=>this.open()),this.addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" ")&&!n.repeat&&(n.preventDefault(),this.open())})}connectedCallback(){super.connectedCallback(),this.setAttribute("role","button"),this.hasAttribute("tabindex")||(this.tabIndex=0)}shouldUpdate(n){return!this.hass||!this.appliance?!1:n.size===1&&n.has("hass")?Ko(n.get("hass"),this.hass,this.appliance):!0}willUpdate(){let{hass:n,appliance:o}=this;if(!n||!o)return;let r=Be(n);gt(this,n),this.toggleAttribute("offline",!o.available),this.name=Fn(o,n),this.view=Gd(o,n,r,this.now,this.helpers);let i=this.view.status.text||r(`family.${o.spec.family}`);this.setAttribute("aria-label",r("card.label",{name:this.name,status:i}))}render(){let{hass:n,appliance:o,view:r}=this;return!n||!o||!r?w:A`
      <div class="head">
        <span class="name">${this.name}</span>
        ${tr(r.status)}
      </div>
      <div class="stage ${r.display?"has-display":""}">
        ${nr(r.display,r.dim)}
        <div class="drawing">
          ${Dn(En(o,r.state,n,this.uid,{pixelHeight:this.size.height}))}
        </div>
      </div>
      ${qs(r.rows.slice(0,3))}
    `}open(){this.appliance&&this.dispatchEvent(new CustomEvent(Hg,{detail:{deviceId:this.appliance.device_id},bubbles:!0,composed:!0}))}};Go.properties={hass:{attribute:!1},appliance:{attribute:!1},now:{attribute:!1},helpers:{attribute:!1}},Go.styles=[ht,Qo,Pt,de`
      :host {
        position: relative;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        min-width: 0;
        padding: 12px 14px 14px;
        border: var(--sz-border-width) solid var(--sz-border);
        border-radius: var(--sz-radius);
        background: var(--sz-card-bg);
        box-shadow: var(--ha-card-box-shadow, none);
        color: var(--sz-text);
        cursor: pointer;
        outline: none;
        container-type: inline-size;
        -webkit-tap-highlight-color: transparent;
        transition:
          box-shadow 0.2s ease,
          border-color 0.2s ease,
          transform 0.2s ease;
      }
      /* Only where there's a pointer to hover with: on touch, the lift would stay after a tap. */
      @media (hover: hover) {
        :host(:hover) {
          border-color: color-mix(in srgb, var(--sz-text) 20%, transparent);
          box-shadow: var(--sz-lift);
        }
      }
      :host(:active) {
        transform: scale(0.98);
      }
      :host(:focus-visible) {
        outline: 2px solid var(--sz-accent);
        outline-offset: 2px;
      }
      @media (prefers-reduced-motion: reduce) {
        :host {
          transition: none;
        }
        :host(:active) {
          transform: none;
        }
      }
      .head {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 28px;
        margin-bottom: 8px;
      }
      .name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        font-size: 17px;
        font-weight: 600;
        line-height: 1.3;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      :host([offline]) .name {
        color: var(--sz-muted);
      }
      /* Every card's stage is the same height and sits right under the title, so the appliances
         in a grid row stand on one floor line; the info panel takes up any slack below. A display
         sits on the appliance's axis above it, where the real ones are, and the drawing in that
         card starts below it so it never covers the appliance. */
      .stage {
        --drawing-height: clamp(240px, 92cqw, 380px);
        height: var(--drawing-height);
        margin: 0 0 12px;
        padding-bottom: 2px;
      }
      /* Phones: about two cards to a screen rather than one. By the screen, not the card: a card
         in a desktop grid is as narrow as one on a phone. Labels keep their size, since the
         drawings size them from the height they're shown at. */
      @media (max-width: 600px) {
        .stage {
          --drawing-height: clamp(220px, 70cqw, 300px);
        }
      }
      .stage.has-display .drawing {
        box-sizing: border-box;
        padding-top: 52px;
      }
      .stage .lcd {
        position: absolute;
        top: 0;
        left: 50%;
        z-index: 1;
        height: 50px;
        transform: translateX(-50%);
      }
      /* Three rows' height whatever it holds, the rows centered, as on the GE card. */
      .info {
        min-height: 75px;
        box-sizing: border-box;
        align-content: center;
        margin: auto 4% 0;
      }
    `];customElements.get("sz-appliance-card")||customElements.define("sz-appliance-card",Go);var Fg="/config/integrations/integration/subzero",Ng="M8,2H16A2,2 0 0 1 18,4V20A2,2 0 0 1 16,22H8A2,2 0 0 1 6,20V4A2,2 0 0 1 8,2ZM8,4V9H16V4ZM8,11V20H16V11ZM9,5H10.5V8H9ZM9,12H10.5V16H9Z",Eo=class extends Me{constructor(){super(),this.appliances=[],this.now=Date.now(),this.helpers=De}willUpdate(){gt(this,this.hass)}render(){let t=Be(this.hass);if(!this.appliances.length)return this.renderEmpty(t);let n=this.groups(),o=n.length>1||n[0]?.areaId!==null;return n.map(r=>A`
        <section class="area">
          ${o?A`<h2>${r.name??t("overview.no_area")}</h2>`:w}
          <div class="grid">
            ${Nn(r.appliances,i=>i.appliance.device_id,i=>A`<sz-appliance-card
                .hass=${this.hass}
                .appliance=${i.appliance}
                .now=${this.now}
                .helpers=${this.helpers}
              ></sz-appliance-card>`)}
          </div>
        </section>
      `)}groups(){let t=this.hass,n=[this.appliances,t?.devices,t?.areas,t?.language,t?.locale];return(!this.grouped||n.some((o,r)=>o!==this.grouped.key[r]))&&(this.grouped={key:n,groups:Ps(this.appliances,t)}),this.grouped.groups}renderEmpty(t){let n=this.hass?.user?.is_admin===!0;return A`<div class="empty">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d=${Ng}></path></svg>
      <h2>${t("overview.empty_title")}</h2>
      <p>${t(n?"overview.empty_text":"overview.empty_text_user")}</p>
      ${n?A`<a class="sz-button primary" href=${Fg} @click=${Is}>
            ${t("overview.empty_link")}
          </a>`:w}
    </div>`}};Eo.properties={hass:{attribute:!1},appliances:{attribute:!1},now:{attribute:!1},helpers:{attribute:!1}},Eo.styles=[ht,mt,de`
      :host {
        display: block;
        color: var(--sz-text);
      }
      .area + .area {
        margin-top: 28px;
      }
      /* A section title over the cards, not a caption: as strong as the card names under it. */
      h2 {
        margin: 0 4px 10px;
        font-size: 18px;
        font-weight: 500;
        line-height: 1.4;
        color: var(--sz-text);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
        gap: 16px;
        align-items: stretch;
      }
      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 420px;
        margin: 10vh auto 0;
        padding: 0 16px;
        text-align: center;
      }
      .empty svg {
        width: 56px;
        height: 56px;
        fill: var(--sz-muted);
        opacity: 0.6;
      }
      .empty h2 {
        margin: 16px 0 4px;
        font-size: 20px;
        color: var(--sz-text);
      }
      .empty p {
        margin: 0 0 20px;
        color: var(--sz-muted);
        line-height: 1.5;
      }
    `];customElements.get("sz-overview")||customElements.define("sz-overview",Eo);var Bg="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z",jg="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",Ug="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",Do=class extends Me{constructor(){super();this.subscription=new Xo(n=>{this.appliances=Array.isArray(n?.appliances)?n.appliances:[],this.error=null},n=>{this.error=Gt(n)});this.openedFromOverview=!1;this.tick=()=>{this.now=Date.now(),this.timer=setTimeout(this.tick,1e3-this.now%1e3+5)};this.onOpen=n=>{this.openedFromOverview=!0,Yo(pi(this.route?.prefix,{view:"appliance",deviceId:n.detail.deviceId}))};this.narrow=!1,this.appliances=null,this.error=null,this.now=Date.now()}connectedCallback(){super.connectedCallback(),this.toggleAttribute("framed",!!this.parentElement?.style.paddingTop),this.tick(),this.stopHelpers=De.onChange(()=>this.requestUpdate()),this.subscription.connect(this.hass?.connection)}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.timer),this.timer=void 0,this.stopHelpers?.(),this.stopHelpers=void 0,this.subscription.disconnect()}willUpdate(n){gt(this,this.hass),n.has("hass")&&this.isConnected&&this.subscription.connect(this.hass?.connection),this.hass&&this.appliances&&De.observe(this.hass,this.appliances)}updated(n){if(!n.has("route"))return;let o=n.get("route"),r=qo(o?.path),i=qo(this.route?.path);i.view==="overview"&&(this.openedFromOverview=!1),!(!o||r.view===i.view)&&this.restoreFocus(r)}async restoreFocus(n){let o=document.activeElement;if(o&&o!==document.body&&!this.shadowRoot?.activeElement)return;let r;if(n.view==="overview")r=this.renderRoot.querySelector(".toolbar .icon-button");else{let i=this.renderRoot.querySelector("sz-overview");await i?.updateComplete,r=[...i?.shadowRoot?.querySelectorAll("sz-appliance-card")??[]].find(a=>a.appliance?.device_id===n.deviceId)}r?.focus({preventScroll:!0})}render(){let n=Be(this.hass),o=qo(this.route?.path),r=o.view==="appliance"?this.appliances?.find(i=>i.device_id===o.deviceId):void 0;return A`
      ${this.renderToolbar(n,o,r)}
      <div class="content">${this.renderContent(n,o,r)}</div>
    `}renderToolbar(n,o,r){let i=o.view==="appliance",a=w;i?a=this.iconButton(jg,n("panel.back"),()=>this.showOverview()):(this.narrow||this.hass?.dockedSidebar==="always_hidden")&&(a=this.iconButton(Bg,n("panel.menu"),()=>this.toggleMenu()));let s=i&&r?Fn(r,this.hass):n("panel.title");return A`<header class="toolbar ${a===w?"":"with-button"}">
      ${a}
      <h1 class="title">${s}</h1>
    </header>`}iconButton(n,o,r){return A`<button type="button" class="icon-button" aria-label=${o} title=${o} @click=${r}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d=${n}></path></svg>
    </button>`}renderContent(n,o,r){return this.appliances?o.view==="overview"?A`<sz-overview
        .hass=${this.hass}
        .appliances=${this.appliances}
        .now=${this.now}
        .helpers=${De}
        @sz-open-appliance=${this.onOpen}
      ></sz-overview>`:r?A`<sz-appliance-view
      .hass=${this.hass}
      .appliance=${r}
      .narrow=${this.narrow}
      .isAdmin=${this.hass?.user?.is_admin===!0}
      .now=${this.now}
      .helpers=${De}
    ></sz-appliance-view>`:A`<div class="state">
        <h2>${n("overview.not_found_title")}</h2>
        <p>${n("overview.not_found_text")}</p>
        <button type="button" class="sz-button primary" @click=${()=>this.showOverview()}>
          ${n("overview.back")}
        </button>
      </div>`:this.error?A`<div class="state" role="alert">
          <svg class="state-icon" viewBox="0 0 24 24" aria-hidden="true"><path d=${Ug}></path></svg>
          <h2>${n("overview.error_title")}</h2>
          <p>${this.error}</p>
          <button type="button" class="sz-button primary" @click=${()=>this.retry()}>
            ${n("overview.retry")}
          </button>
        </div>`:A`<div class="state">
        <div class="spinner" role="progressbar" aria-label=${n("overview.loading")}></div>
        <p>${n("overview.loading")}</p>
      </div>`}showOverview(){if(this.openedFromOverview){this.openedFromOverview=!1,history.back();return}Yo(pi(this.route?.prefix,{view:"overview"}),{replace:!0})}toggleMenu(){this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))}retry(){this.error=null,this.subscription.retry()}};Do.properties={hass:{attribute:!1},narrow:{type:Boolean,reflect:!0},route:{attribute:!1},panel:{attribute:!1},appliances:{state:!0},error:{state:!0},now:{state:!0}},Do.styles=[ht,mt,de`
      /* The page scrolls, not the panel: Home Assistant gives a custom panel no fixed height.
         The toolbar sticks to the top instead, and the full view's drawing below it. */
      :host {
        --sz-inset-top: var(--safe-area-inset-top, 0px);
        --sz-inset-bottom: var(--safe-area-inset-bottom, 0px);
        --sz-inset-left: var(--safe-area-content-inset-left, var(--safe-area-inset-left, 0px));
        --sz-inset-right: var(--safe-area-content-inset-right, var(--safe-area-inset-right, 0px));
        --sz-toolbar-height: calc(var(--header-height, 56px) + var(--sz-inset-top));
        display: flex;
        flex-direction: column;
        min-height: 100%;
        background: var(--sz-page-bg);
        color: var(--sz-text);
        -webkit-font-smoothing: antialiased;
      }
      :host([framed]) {
        margin: calc(-1 * var(--sz-inset-top)) calc(-1 * var(--sz-inset-right)) calc(-1 * var(--sz-inset-bottom))
          calc(-1 * var(--sz-inset-left));
      }
      .toolbar {
        position: sticky;
        top: 0;
        z-index: 2;
        display: flex;
        flex: none;
        align-items: center;
        box-sizing: border-box;
        height: var(--sz-toolbar-height);
        padding: var(--sz-inset-top) calc(12px + var(--sz-inset-right)) 0 calc(12px + var(--sz-inset-left));
        background: var(--app-header-background-color, var(--sz-page-bg));
        color: var(--app-header-text-color, var(--sz-text));
        border-bottom: var(--app-header-border-bottom, none);
      }
      .title {
        flex: 1;
        min-width: 0;
        margin: 0 0 0 12px;
        overflow: hidden;
        font-size: 20px;
        font-weight: 400;
        line-height: 1.4;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .with-button .title {
        margin-inline-start: 24px;
      }
      .icon-button {
        display: grid;
        flex: none;
        place-items: center;
        width: 48px;
        height: 48px;
        padding: 0;
        border: none;
        border-radius: 50%;
        background: none;
        color: inherit;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }
      .icon-button:hover {
        background: var(--sz-control-bg);
      }
      .icon-button:focus-visible {
        outline: 2px solid var(--sz-accent);
        outline-offset: -2px;
      }
      .icon-button svg {
        width: 24px;
        height: 24px;
        fill: currentColor;
      }
      .content {
        flex: 1;
        box-sizing: border-box;
        padding: 16px calc(16px + var(--sz-inset-right)) calc(16px + var(--sz-inset-bottom))
          calc(16px + var(--sz-inset-left));
      }
      :host([narrow]) .content {
        padding: 12px calc(12px + var(--sz-inset-right)) calc(12px + var(--sz-inset-bottom))
          calc(12px + var(--sz-inset-left));
      }
      .state {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 420px;
        margin: 12vh auto 0;
        text-align: center;
        color: var(--sz-muted);
      }
      /* As the overview's empty state draws its icon. */
      .state-icon {
        width: 56px;
        height: 56px;
        margin-bottom: 16px;
        fill: var(--sz-muted);
        opacity: 0.6;
      }
      .state h2 {
        margin: 0 0 4px;
        font-size: 20px;
        font-weight: 500;
        color: var(--sz-text);
      }
      .state p {
        margin: 8px 0 20px;
        line-height: 1.5;
      }
      .spinner {
        width: 36px;
        height: 36px;
        box-sizing: border-box;
        border: 3px solid var(--sz-control-bg);
        border-top-color: var(--sz-accent);
        border-radius: 50%;
        animation: spin 0.9s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .spinner {
          animation: none;
        }
      }
    `];customElements.get("subzero-panel")||customElements.define("subzero-panel",Do);
