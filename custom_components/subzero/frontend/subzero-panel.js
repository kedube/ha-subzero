var Ur=globalThis,Wr=Ur.ShadowRoot&&(Ur.ShadyCSS===void 0||Ur.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,yi=Symbol(),ys=new WeakMap,jn=class{constructor(t,n,r){if(this._$cssResult$=!0,r!==yi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o,n=this.t;if(Wr&&t===void 0){let r=n!==void 0&&n.length===1;r&&(t=ys.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&ys.set(n,t))}return t}toString(){return this.cssText}},_s=e=>new jn(typeof e=="string"?e:e+"",void 0,yi),te=(e,...t)=>{let n=e.length===1?e[0]:t.reduce((r,o,i)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[i+1],e[0]);return new jn(n,e,yi)},$s=(e,t)=>{if(Wr)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(let n of t){let r=document.createElement("style"),o=Ur.litNonce;o!==void 0&&r.setAttribute("nonce",o),r.textContent=n.cssText,e.appendChild(r)}},_i=Wr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(let r of t.cssRules)n+=r.cssText;return _s(n)})(e):e;var{is:ku,defineProperty:xu,getOwnPropertyDescriptor:zu,getOwnPropertyNames:Su,getOwnPropertySymbols:Ru,getPrototypeOf:Au}=Object,qr=globalThis,bs=qr.trustedTypes,Tu=bs?bs.emptyScript:"",Mu=qr.reactiveElementPolyfillSupport,Bn=(e,t)=>e,$i={toAttribute(e,t){switch(t){case Boolean:e=e?Tu:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},vs=(e,t)=>!ku(e,t),ws={attribute:!0,type:String,converter:$i,reflect:!1,useDefault:!1,hasChanged:vs};Symbol.metadata??=Symbol("metadata"),qr.litPropertyMetadata??=new WeakMap;var vt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=ws){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){let r=Symbol(),o=this.getPropertyDescriptor(t,r,n);o!==void 0&&xu(this.prototype,t,o)}}static getPropertyDescriptor(t,n,r){let{get:o,set:i}=zu(this.prototype,t)??{get(){return this[n]},set(a){this[n]=a}};return{get:o,set(a){let s=o?.call(this);i?.call(this,a),this.requestUpdate(t,s,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ws}static _$Ei(){if(this.hasOwnProperty(Bn("elementProperties")))return;let t=Au(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Bn("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Bn("properties"))){let n=this.properties,r=[...Su(n),...Ru(n)];for(let o of r)this.createProperty(o,n[o])}let t=this[Symbol.metadata];if(t!==null){let n=litPropertyMetadata.get(t);if(n!==void 0)for(let[r,o]of n)this.elementProperties.set(r,o)}this._$Eh=new Map;for(let[n,r]of this.elementProperties){let o=this._$Eu(n,r);o!==void 0&&this._$Eh.set(o,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let n=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let o of r)n.unshift(_i(o))}else t!==void 0&&n.push(_i(t));return n}static _$Eu(t,n){let r=n.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,n=this.constructor.elementProperties;for(let r of n.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return $s(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,r){this._$AK(t,r)}_$ET(t,n){let r=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,r);if(o!==void 0&&r.reflect===!0){let i=(r.converter?.toAttribute!==void 0?r.converter:$i).toAttribute(n,r.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,n){let r=this.constructor,o=r._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let i=r.getPropertyOptions(o),a=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:$i;this._$Em=o;let s=a.fromAttribute(n,i.type);this[o]=s??this._$Ej?.get(o)??s,this._$Em=null}}requestUpdate(t,n,r,o=!1,i){if(t!==void 0){let a=this.constructor;if(o===!1&&(i=this[t]),r??=a.getPropertyOptions(t),!((r.hasChanged??vs)(i,n)||r.useDefault&&r.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,r))))return;this.C(t,n,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:r,reflect:o,wrapped:i},a){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??n??this[t]),i!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(n=void 0),this._$AL.set(t,n)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[o,i]of r){let{wrapped:a}=i,s=this[o];a!==!0||this._$AL.has(o)||s===void 0||this.C(o,void 0,i,s)}}let t=!1,n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(n)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};vt.elementStyles=[],vt.shadowRootOptions={mode:"open"},vt[Bn("elementProperties")]=new Map,vt[Bn("finalized")]=new Map,Mu?.({ReactiveElement:vt}),(qr.reactiveElementVersions??=[]).push("2.1.2");var wi=globalThis,ks=e=>e,Zr=wi.trustedTypes,xs=Zr?Zr.createPolicy("lit-html",{createHTML:e=>e}):void 0,vi="$lit$",kt=`lit$${Math.random().toFixed(9).slice(2)}$`,ki="?"+kt,Cu=`<${ki}>`,Xt=document,Un=()=>Xt.createComment(""),Wn=e=>e===null||typeof e!="object"&&typeof e!="function",xi=Array.isArray,Ms=e=>xi(e)||typeof e?.[Symbol.iterator]=="function",bi=`[ 	
\f\r]`,Kn=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,zs=/-->/g,Ss=/>/g,Zt=RegExp(`>|${bi}(?:([^\\s"'>=/]+)(${bi}*=${bi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Rs=/'/g,As=/"/g,Cs=/^(?:script|style|textarea|title)$/i,zi=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),A=zi(1),h=zi(2),_y=zi(3),xt=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),Ts=new WeakMap,Yt=Xt.createTreeWalker(Xt,129);function Gs(e,t){if(!xi(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return xs!==void 0?xs.createHTML(t):t}var Es=(e,t)=>{let n=e.length-1,r=[],o,i=t===2?"<svg>":t===3?"<math>":"",a=Kn;for(let s=0;s<n;s++){let l=e[s],p,u,f=-1,m=0;for(;m<l.length&&(a.lastIndex=m,u=a.exec(l),u!==null);)m=a.lastIndex,a===Kn?u[1]==="!--"?a=zs:u[1]!==void 0?a=Ss:u[2]!==void 0?(Cs.test(u[2])&&(o=RegExp("</"+u[2],"g")),a=Zt):u[3]!==void 0&&(a=Zt):a===Zt?u[0]===">"?(a=o??Kn,f=-1):u[1]===void 0?f=-2:(f=a.lastIndex-u[2].length,p=u[1],a=u[3]===void 0?Zt:u[3]==='"'?As:Rs):a===As||a===Rs?a=Zt:a===zs||a===Ss?a=Kn:(a=Zt,o=void 0);let y=a===Zt&&e[s+1].startsWith("/>")?" ":"";i+=a===Kn?l+Cu:f>=0?(r.push(p),l.slice(0,f)+vi+l.slice(f)+kt+y):l+kt+(f===-2?s:y)}return[Gs(e,i+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},qn=class e{constructor({strings:t,_$litType$:n},r){let o;this.parts=[];let i=0,a=0,s=t.length-1,l=this.parts,[p,u]=Es(t,n);if(this.el=e.createElement(p,r),Yt.currentNode=this.el.content,n===2||n===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(o=Yt.nextNode())!==null&&l.length<s;){if(o.nodeType===1){if(o.hasAttributes())for(let f of o.getAttributeNames())if(f.endsWith(vi)){let m=u[a++],y=o.getAttribute(f).split(kt),g=/([.?@])?(.*)/.exec(m);l.push({type:1,index:i,name:g[2],strings:y,ctor:g[1]==="."?Xr:g[1]==="?"?Qr:g[1]==="@"?Jr:Jt}),o.removeAttribute(f)}else f.startsWith(kt)&&(l.push({type:6,index:i}),o.removeAttribute(f));if(Cs.test(o.tagName)){let f=o.textContent.split(kt),m=f.length-1;if(m>0){o.textContent=Zr?Zr.emptyScript:"";for(let y=0;y<m;y++)o.append(f[y],Un()),Yt.nextNode(),l.push({type:2,index:++i});o.append(f[m],Un())}}}else if(o.nodeType===8)if(o.data===ki)l.push({type:2,index:i});else{let f=-1;for(;(f=o.data.indexOf(kt,f+1))!==-1;)l.push({type:7,index:i}),f+=kt.length-1}i++}}static createElement(t,n){let r=Xt.createElement("template");return r.innerHTML=t,r}};function Qt(e,t,n=e,r){if(t===xt)return t;let o=r!==void 0?n._$Co?.[r]:n._$Cl,i=Wn(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(e),o._$AT(e,n,r)),r!==void 0?(n._$Co??=[])[r]=o:n._$Cl=o),o!==void 0&&(t=Qt(e,o._$AS(e,t.values),o,r)),t}var Yr=class{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:n},parts:r}=this._$AD,o=(t?.creationScope??Xt).importNode(n,!0);Yt.currentNode=o;let i=Yt.nextNode(),a=0,s=0,l=r[0];for(;l!==void 0;){if(a===l.index){let p;l.type===2?p=new bn(i,i.nextSibling,this,t):l.type===1?p=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(p=new eo(i,this,t)),this._$AV.push(p),l=r[++s]}a!==l?.index&&(i=Yt.nextNode(),a++)}return Yt.currentNode=Xt,o}p(t){let n=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,n),n+=r.strings.length-2):r._$AI(t[n])),n++}},bn=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,r,o){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=r,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=Qt(this,t,n),Wn(t)?t===v||t==null||t===""?(this._$AH!==v&&this._$AR(),this._$AH=v):t!==this._$AH&&t!==xt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ms(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==v&&Wn(this._$AH)?this._$AA.nextSibling.data=t:this.T(Xt.createTextNode(t)),this._$AH=t}$(t){let{values:n,_$litType$:r}=t,o=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=qn.createElement(Gs(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===o)this._$AH.p(n);else{let i=new Yr(o,this),a=i.u(this.options);i.p(n),this.T(a),this._$AH=i}}_$AC(t){let n=Ts.get(t.strings);return n===void 0&&Ts.set(t.strings,n=new qn(t)),n}k(t){xi(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,o=0;for(let i of t)o===n.length?n.push(r=new e(this.O(Un()),this.O(Un()),this,this.options)):r=n[o],r._$AI(i),o++;o<n.length&&(this._$AR(r&&r._$AB.nextSibling,o),n.length=o)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){let r=ks(t).nextSibling;ks(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Jt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,r,o,i){this.type=1,this._$AH=v,this._$AN=void 0,this.element=t,this.name=n,this._$AM=o,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=v}_$AI(t,n=this,r,o){let i=this.strings,a=!1;if(i===void 0)t=Qt(this,t,n,0),a=!Wn(t)||t!==this._$AH&&t!==xt,a&&(this._$AH=t);else{let s=t,l,p;for(t=i[0],l=0;l<i.length-1;l++)p=Qt(this,s[r+l],n,l),p===xt&&(p=this._$AH[l]),a||=!Wn(p)||p!==this._$AH[l],p===v?t=v:t!==v&&(t+=(p??"")+i[l+1]),this._$AH[l]=p}a&&!o&&this.j(t)}j(t){t===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Xr=class extends Jt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===v?void 0:t}},Qr=class extends Jt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==v)}},Jr=class extends Jt{constructor(t,n,r,o,i){super(t,n,r,o,i),this.type=5}_$AI(t,n=this){if((t=Qt(this,t,n,0)??v)===xt)return;let r=this._$AH,o=t===v&&r!==v||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,i=t!==v&&(r===v||o);o&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},eo=class{constructor(t,n,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){Qt(this,t)}},Os={M:vi,P:kt,A:ki,C:1,L:Es,R:Yr,D:Ms,V:Qt,I:bn,H:Jt,N:Qr,U:Jr,B:Xr,F:eo},Gu=wi.litHtmlPolyfillSupport;Gu?.(qn,bn),(wi.litHtmlVersions??=[]).push("3.3.3");var Ps=(e,t,n)=>{let r=n?.renderBefore??t,o=r._$litPart$;if(o===void 0){let i=n?.renderBefore??null;r._$litPart$=o=new bn(t.insertBefore(Un(),i),i,void 0,n??{})}return o._$AI(e),o};var Si=globalThis,ve=class extends vt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ps(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return xt}};ve._$litElement$=!0,ve.finalized=!0,Si.litElementHydrateSupport?.({LitElement:ve});var Eu=Si.litElementPolyfillSupport;Eu?.({LitElement:ve});(Si.litElementVersions??=[]).push("4.2.2");var Ds={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},to=e=>(...t)=>({_$litDirective$:e,values:t}),wn=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,n,r){this._$Ct=t,this._$AM=n,this._$Ci=r}_$AS(t,n){return this.update(t,n)}update(t,n){return this.render(...n)}};var{I:Ou}=Os,Ls=e=>e;var Is=()=>document.createComment(""),vn=(e,t,n)=>{let r=e._$AA.parentNode,o=t===void 0?e._$AB:t._$AA;if(n===void 0){let i=r.insertBefore(Is(),o),a=r.insertBefore(Is(),o);n=new Ou(i,a,e,e.options)}else{let i=n._$AB.nextSibling,a=n._$AM,s=a!==e;if(s){let l;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(l=e._$AU)!==a._$AU&&n._$AP(l)}if(i!==o||s){let l=n._$AA;for(;l!==i;){let p=Ls(l).nextSibling;Ls(r).insertBefore(l,o),l=p}}}return n},Gt=(e,t,n=e)=>(e._$AI(t,n),e),Pu={},no=(e,t=Pu)=>e._$AH=t,Vs=e=>e._$AH,ro=e=>{e._$AR(),e._$AA.remove()};var Hs=to(class extends wn{constructor(){super(...arguments),this.key=v}render(e,t){return this.key=e,t}update(e,[t,n]){return t!==this.key&&(no(e),this.key=t),n}});var Fs={"drawing.separator":", ","drawing.offline":"offline","drawing.appliance":"Hausger\xE4t","drawing.refrigeration.side_by_side":"Side-by-Side-K\xFChlschrank","drawing.refrigeration.french_door":"French-Door-K\xFChlschrank","drawing.refrigeration.over_under":"K\xFChl-Gefrier-Kombination","drawing.refrigeration.column_refrigerator":"K\xFChls\xE4ule","drawing.refrigeration.column_freezer":"Gefriers\xE4ule","drawing.refrigeration.column_wine":"Weins\xE4ule","drawing.refrigeration.tall_refrigerator":"K\xFChlschrank","drawing.refrigeration.tall_freezer":"Gefrierschrank","drawing.refrigeration.tall_over_under":"K\xFChl-Gefrier-Kombination","drawing.refrigeration.wine_over_drawers":"Weinschrank mit Schubladen","drawing.refrigeration.undercounter_refrigerator":"Unterbau-K\xFChlschrank","drawing.refrigeration.undercounter_beverage":"Getr\xE4nkek\xFChlschrank","drawing.refrigeration.undercounter_wine":"Weinschrank","drawing.refrigeration.undercounter_drawers":"K\xFChlschubladen","drawing.refrigeration.freezer_drawers":"Gefrierschubladen","drawing.refrigeration.combination_drawers":"K\xFChl- und Gefrierschubladen","drawing.refrigeration.ice_maker":"Eisbereiter","drawing.open.door":"T\xFCr offen","drawing.open.refrigerator_door":"K\xFChlschrankt\xFCr offen","drawing.open.freezer_door":"Gefrierschrankt\xFCr offen","drawing.open.wine_door":"Weinschrankt\xFCr offen","drawing.open.ice_maker_door":"Eisbereitert\xFCr offen","drawing.open.refrigerator_drawer":"K\xFChlschublade offen","drawing.open.freezer_drawer":"Gefrierschublade offen","drawing.ice_maker.cleaning":"Reinigung l\xE4uft","drawing.range":"Standherd","drawing.range_induction":"Induktions-Standherd","drawing.wall_oven":"Einbaubackofen","drawing.wall_oven_double":"Doppelter Einbaubackofen","drawing.oven.left":"linker Backofen","drawing.oven.right":"rechter Backofen","drawing.oven.upper":"oberer Backofen","drawing.oven.lower":"unterer Backofen","drawing.oven_state":"{oven}: {state}","drawing.state.door_open":"T\xFCr offen","drawing.state.self_cleaning":"Selbstreinigung l\xE4uft","drawing.state.preheated":"vorgeheizt","drawing.state.heating":"heizt","drawing.state.off":"aus","drawing.state.light_on":"Licht an","drawing.state.probe_in":"Kerntemperaturf\xFChler eingesteckt","drawing.state.remote_ready":"Remote Ready","drawing.timer":"Timer {time}","drawing.hood.wall":"Wandhaube","drawing.hood.island":"Inselhaube","drawing.hood.insert":"L\xFCftereinsatz","drawing.hood.hood":"Dunstabzugshaube","drawing.fan_speed":"L\xFCfterstufe {speed}","drawing.light_level":"Licht {percent} %","drawing.halo_on":"Halo-Licht an","drawing.dishwasher":"Geschirrsp\xFCler","drawing.wash.running":"l\xE4uft","drawing.wash.paused":"pausiert","drawing.wash.canceling":"wird abgebrochen","drawing.wash.drying":"trocknet","drawing.wash.done":"fertig","drawing.wash.delayed":"verz\xF6gerter Start","drawing.wash.error":"Fehler","drawing.time_left":"noch {time}","drawing.starts_in":"beginnt in {time}","drawing.rinse_aid_low":"wenig Klarsp\xFCler","drawing.softener_low":"wenig Regeneriersalz","drawing.screen.off":"Aus","drawing.screen.heating":"Heizt","drawing.screen.preheating":"Heizt vor {percent} %","drawing.screen.preheated":"Vorgeheizt","drawing.screen.self_clean":"Selbstreinigung","drawing.screen.clean":"Reinigung","drawing.screen.timer":"Timer {n}","drawing.screen.light":"Licht","drawing.screen.lock":"Sperre","drawing.screen.settings":"Einstellungen"};var Ns={"drawing.separator":", ","drawing.offline":"offline","drawing.appliance":"Appliance","drawing.refrigeration.side_by_side":"Side-by-side refrigerator","drawing.refrigeration.french_door":"French door refrigerator","drawing.refrigeration.over_under":"Over-and-under refrigerator","drawing.refrigeration.column_refrigerator":"Column refrigerator","drawing.refrigeration.column_freezer":"Column freezer","drawing.refrigeration.column_wine":"Wine column","drawing.refrigeration.tall_refrigerator":"Refrigerator","drawing.refrigeration.tall_freezer":"Freezer","drawing.refrigeration.tall_over_under":"Over-and-under refrigerator","drawing.refrigeration.wine_over_drawers":"Wine storage with drawers","drawing.refrigeration.undercounter_refrigerator":"Undercounter refrigerator","drawing.refrigeration.undercounter_beverage":"Beverage center","drawing.refrigeration.undercounter_wine":"Wine storage","drawing.refrigeration.undercounter_drawers":"Refrigerator drawers","drawing.refrigeration.freezer_drawers":"Freezer drawers","drawing.refrigeration.combination_drawers":"Refrigerator and freezer drawers","drawing.refrigeration.ice_maker":"Ice maker","drawing.open.door":"door open","drawing.open.refrigerator_door":"refrigerator door open","drawing.open.freezer_door":"freezer door open","drawing.open.wine_door":"wine door open","drawing.open.ice_maker_door":"ice maker door open","drawing.open.refrigerator_drawer":"refrigerator drawer open","drawing.open.freezer_drawer":"freezer drawer open","drawing.ice_maker.cleaning":"cleaning","drawing.range":"Range","drawing.range_induction":"Induction range","drawing.wall_oven":"Wall oven","drawing.wall_oven_double":"Double wall oven","drawing.oven.left":"left oven","drawing.oven.right":"right oven","drawing.oven.upper":"upper oven","drawing.oven.lower":"lower oven","drawing.oven_state":"{oven}: {state}","drawing.state.door_open":"door open","drawing.state.self_cleaning":"self-cleaning","drawing.state.preheated":"preheated","drawing.state.heating":"heating","drawing.state.off":"off","drawing.state.light_on":"light on","drawing.state.probe_in":"probe in","drawing.state.remote_ready":"Remote Ready","drawing.timer":"timer {time}","drawing.hood.wall":"Wall hood","drawing.hood.island":"Island hood","drawing.hood.insert":"Hood liner","drawing.hood.hood":"Ventilation hood","drawing.fan_speed":"fan speed {speed}","drawing.light_level":"light {percent}%","drawing.halo_on":"halo on","drawing.dishwasher":"Dishwasher","drawing.wash.running":"running","drawing.wash.paused":"paused","drawing.wash.canceling":"canceling","drawing.wash.drying":"drying","drawing.wash.done":"done","drawing.wash.delayed":"delayed start","drawing.wash.error":"error","drawing.time_left":"{time} left","drawing.starts_in":"starts in {time}","drawing.rinse_aid_low":"rinse aid low","drawing.softener_low":"softener salt low","drawing.screen.off":"Off","drawing.screen.heating":"Heating","drawing.screen.preheating":"Preheating {percent}%","drawing.screen.preheated":"Preheated","drawing.screen.self_clean":"Self clean","drawing.screen.clean":"Clean","drawing.screen.timer":"Timer {n}","drawing.screen.light":"Light","drawing.screen.lock":"Lock","drawing.screen.settings":"Settings"};var js={"drawing.separator":", ","drawing.offline":"sin conexi\xF3n","drawing.appliance":"Electrodom\xE9stico","drawing.refrigeration.side_by_side":"Frigor\xEDfico americano","drawing.refrigeration.french_door":"Frigor\xEDfico de puertas francesas","drawing.refrigeration.over_under":"Frigor\xEDfico combi","drawing.refrigeration.column_refrigerator":"Columna frigor\xEDfico","drawing.refrigeration.column_freezer":"Columna congelador","drawing.refrigeration.column_wine":"Columna vinoteca","drawing.refrigeration.tall_refrigerator":"Frigor\xEDfico","drawing.refrigeration.tall_freezer":"Congelador","drawing.refrigeration.tall_over_under":"Frigor\xEDfico combi","drawing.refrigeration.wine_over_drawers":"Vinoteca con cajones","drawing.refrigeration.undercounter_refrigerator":"Frigor\xEDfico bajo encimera","drawing.refrigeration.undercounter_beverage":"Enfriador de bebidas","drawing.refrigeration.undercounter_wine":"Vinoteca","drawing.refrigeration.undercounter_drawers":"Cajones frigor\xEDficos","drawing.refrigeration.freezer_drawers":"Cajones congeladores","drawing.refrigeration.combination_drawers":"Cajones frigor\xEDfico y congelador","drawing.refrigeration.ice_maker":"M\xE1quina de hielo","drawing.open.door":"puerta abierta","drawing.open.refrigerator_door":"puerta del frigor\xEDfico abierta","drawing.open.freezer_door":"puerta del congelador abierta","drawing.open.wine_door":"puerta de la vinoteca abierta","drawing.open.ice_maker_door":"puerta de la m\xE1quina de hielo abierta","drawing.open.refrigerator_drawer":"caj\xF3n del frigor\xEDfico abierto","drawing.open.freezer_drawer":"caj\xF3n del congelador abierto","drawing.ice_maker.cleaning":"limpiando","drawing.range":"Cocina","drawing.range_induction":"Cocina de inducci\xF3n","drawing.wall_oven":"Horno empotrado","drawing.wall_oven_double":"Horno empotrado doble","drawing.oven.left":"horno izquierdo","drawing.oven.right":"horno derecho","drawing.oven.upper":"horno superior","drawing.oven.lower":"horno inferior","drawing.oven_state":"{oven}: {state}","drawing.state.door_open":"puerta abierta","drawing.state.self_cleaning":"autolimpieza en curso","drawing.state.preheated":"precalentado","drawing.state.heating":"calentando","drawing.state.off":"apagado","drawing.state.light_on":"luz encendida","drawing.state.probe_in":"sonda conectada","drawing.state.remote_ready":"Remote Ready","drawing.timer":"temporizador {time}","drawing.hood.wall":"Campana de pared","drawing.hood.island":"Campana de isla","drawing.hood.insert":"Grupo filtrante","drawing.hood.hood":"Campana extractora","drawing.fan_speed":"velocidad del ventilador {speed}","drawing.light_level":"luz al {percent} %","drawing.halo_on":"luz halo encendida","drawing.dishwasher":"Lavavajillas","drawing.wash.running":"en marcha","drawing.wash.paused":"en pausa","drawing.wash.canceling":"cancelando","drawing.wash.drying":"secando","drawing.wash.done":"terminado","drawing.wash.delayed":"inicio diferido","drawing.wash.error":"aver\xEDa","drawing.time_left":"quedan {time}","drawing.starts_in":"empieza en {time}","drawing.rinse_aid_low":"nivel bajo de abrillantador","drawing.softener_low":"nivel bajo de sal descalcificadora","drawing.screen.off":"Apagado","drawing.screen.heating":"Calentando","drawing.screen.preheating":"Precalentando {percent} %","drawing.screen.preheated":"Precalentado","drawing.screen.self_clean":"Autolimpieza","drawing.screen.clean":"Limpieza","drawing.screen.timer":"Temporizador {n}","drawing.screen.light":"Luz","drawing.screen.lock":"Bloqueo","drawing.screen.settings":"Ajustes"};var Bs={"drawing.separator":", ","drawing.offline":"hors ligne","drawing.appliance":"Appareil","drawing.refrigeration.side_by_side":"R\xE9frig\xE9rateur am\xE9ricain","drawing.refrigeration.french_door":"R\xE9frig\xE9rateur multiportes","drawing.refrigeration.over_under":"R\xE9frig\xE9rateur combin\xE9","drawing.refrigeration.column_refrigerator":"Colonne r\xE9frig\xE9rateur","drawing.refrigeration.column_freezer":"Colonne cong\xE9lateur","drawing.refrigeration.column_wine":"Colonne cave \xE0 vin","drawing.refrigeration.tall_refrigerator":"R\xE9frig\xE9rateur","drawing.refrigeration.tall_freezer":"Cong\xE9lateur","drawing.refrigeration.tall_over_under":"R\xE9frig\xE9rateur combin\xE9","drawing.refrigeration.wine_over_drawers":"Cave \xE0 vin avec tiroirs","drawing.refrigeration.undercounter_refrigerator":"R\xE9frig\xE9rateur sous plan","drawing.refrigeration.undercounter_beverage":"Cave \xE0 boissons","drawing.refrigeration.undercounter_wine":"Cave \xE0 vin","drawing.refrigeration.undercounter_drawers":"Tiroirs r\xE9frig\xE9r\xE9s","drawing.refrigeration.freezer_drawers":"Tiroirs cong\xE9lateurs","drawing.refrigeration.combination_drawers":"Tiroirs r\xE9frig\xE9rateur et cong\xE9lateur","drawing.refrigeration.ice_maker":"Machine \xE0 gla\xE7ons","drawing.open.door":"porte ouverte","drawing.open.refrigerator_door":"porte du r\xE9frig\xE9rateur ouverte","drawing.open.freezer_door":"porte du cong\xE9lateur ouverte","drawing.open.wine_door":"porte de la cave \xE0 vin ouverte","drawing.open.ice_maker_door":"porte de la machine \xE0 gla\xE7ons ouverte","drawing.open.refrigerator_drawer":"tiroir du r\xE9frig\xE9rateur ouvert","drawing.open.freezer_drawer":"tiroir du cong\xE9lateur ouvert","drawing.ice_maker.cleaning":"nettoyage en cours","drawing.range":"Piano de cuisson","drawing.range_induction":"Piano de cuisson \xE0 induction","drawing.wall_oven":"Four encastrable","drawing.wall_oven_double":"Four encastrable double","drawing.oven.left":"four gauche","drawing.oven.right":"four droit","drawing.oven.upper":"four sup\xE9rieur","drawing.oven.lower":"four inf\xE9rieur","drawing.oven_state":"{oven} : {state}","drawing.state.door_open":"porte ouverte","drawing.state.self_cleaning":"autonettoyage en cours","drawing.state.preheated":"pr\xE9chauff\xE9","drawing.state.heating":"en chauffe","drawing.state.off":"\xE9teint","drawing.state.light_on":"\xE9clairage allum\xE9","drawing.state.probe_in":"sonde branch\xE9e","drawing.state.remote_ready":"Remote Ready","drawing.timer":"minuteur {time}","drawing.hood.wall":"Hotte murale","drawing.hood.island":"Hotte \xEElot","drawing.hood.insert":"Groupe filtrant","drawing.hood.hood":"Hotte","drawing.fan_speed":"vitesse du ventilateur {speed}","drawing.light_level":"\xE9clairage \xE0 {percent} %","drawing.halo_on":"\xE9clairage halo allum\xE9","drawing.dishwasher":"Lave-vaisselle","drawing.wash.running":"en marche","drawing.wash.paused":"en pause","drawing.wash.canceling":"annulation en cours","drawing.wash.drying":"s\xE9chage","drawing.wash.done":"termin\xE9","drawing.wash.delayed":"d\xE9part diff\xE9r\xE9","drawing.wash.error":"erreur","drawing.time_left":"il reste {time}","drawing.starts_in":"d\xE9marre dans {time}","drawing.rinse_aid_low":"niveau de liquide de rin\xE7age bas","drawing.softener_low":"niveau de sel r\xE9g\xE9n\xE9rant bas","drawing.screen.off":"Arr\xEAt","drawing.screen.heating":"Chauffe","drawing.screen.preheating":"Pr\xE9chauffage {percent} %","drawing.screen.preheated":"Pr\xE9chauff\xE9","drawing.screen.self_clean":"Autonettoyage","drawing.screen.clean":"Nettoyage","drawing.screen.timer":"Minuteur {n}","drawing.screen.light":"\xC9clairage","drawing.screen.lock":"Verrouillage","drawing.screen.settings":"R\xE9glages"};var Ks={"drawing.separator":", ","drawing.offline":"non in linea","drawing.appliance":"Elettrodomestico","drawing.refrigeration.side_by_side":"Frigorifero americano","drawing.refrigeration.french_door":"Frigorifero con porte alla francese","drawing.refrigeration.over_under":"Frigorifero combinato","drawing.refrigeration.column_refrigerator":"Colonna frigorifero","drawing.refrigeration.column_freezer":"Colonna congelatore","drawing.refrigeration.column_wine":"Colonna cantinetta","drawing.refrigeration.tall_refrigerator":"Frigorifero","drawing.refrigeration.tall_freezer":"Congelatore","drawing.refrigeration.tall_over_under":"Frigorifero combinato","drawing.refrigeration.wine_over_drawers":"Cantinetta con cassetti","drawing.refrigeration.undercounter_refrigerator":"Frigorifero sottopiano","drawing.refrigeration.undercounter_beverage":"Frigo per bevande","drawing.refrigeration.undercounter_wine":"Cantinetta","drawing.refrigeration.undercounter_drawers":"Cassetti frigorifero","drawing.refrigeration.freezer_drawers":"Cassetti congelatore","drawing.refrigeration.combination_drawers":"Cassetti frigorifero e congelatore","drawing.refrigeration.ice_maker":"Fabbricatore di ghiaccio","drawing.open.door":"porta aperta","drawing.open.refrigerator_door":"porta del frigorifero aperta","drawing.open.freezer_door":"porta del congelatore aperta","drawing.open.wine_door":"porta della cantinetta aperta","drawing.open.ice_maker_door":"porta del fabbricatore di ghiaccio aperta","drawing.open.refrigerator_drawer":"cassetto del frigorifero aperto","drawing.open.freezer_drawer":"cassetto del congelatore aperto","drawing.ice_maker.cleaning":"pulizia in corso","drawing.range":"Cucina","drawing.range_induction":"Cucina a induzione","drawing.wall_oven":"Forno da incasso","drawing.wall_oven_double":"Forno da incasso doppio","drawing.oven.left":"forno sinistro","drawing.oven.right":"forno destro","drawing.oven.upper":"forno superiore","drawing.oven.lower":"forno inferiore","drawing.oven_state":"{oven}: {state}","drawing.state.door_open":"porta aperta","drawing.state.self_cleaning":"autopulizia in corso","drawing.state.preheated":"preriscaldato","drawing.state.heating":"in riscaldamento","drawing.state.off":"spento","drawing.state.light_on":"luce accesa","drawing.state.probe_in":"sonda inserita","drawing.state.remote_ready":"Remote Ready","drawing.timer":"timer {time}","drawing.hood.wall":"Cappa a parete","drawing.hood.island":"Cappa a isola","drawing.hood.insert":"Gruppo incasso","drawing.hood.hood":"Cappa","drawing.fan_speed":"velocit\xE0 ventola {speed}","drawing.light_level":"luce al {percent}%","drawing.halo_on":"luce halo accesa","drawing.dishwasher":"Lavastoviglie","drawing.wash.running":"in funzione","drawing.wash.paused":"in pausa","drawing.wash.canceling":"annullamento in corso","drawing.wash.drying":"asciugatura","drawing.wash.done":"finito","drawing.wash.delayed":"avvio ritardato","drawing.wash.error":"errore","drawing.time_left":"mancano {time}","drawing.starts_in":"inizia tra {time}","drawing.rinse_aid_low":"brillantante in esaurimento","drawing.softener_low":"sale addolcitore in esaurimento","drawing.screen.off":"Spento","drawing.screen.heating":"Riscaldamento","drawing.screen.preheating":"Preriscaldamento {percent}%","drawing.screen.preheated":"Preriscaldato","drawing.screen.self_clean":"Autopulizia","drawing.screen.clean":"Pulizia","drawing.screen.timer":"Timer {n}","drawing.screen.light":"Luce","drawing.screen.lock":"Blocco","drawing.screen.settings":"Impostazioni"};var Us={"drawing.separator":", ","drawing.offline":"offline","drawing.appliance":"Apparaat","drawing.refrigeration.side_by_side":"Amerikaanse koelkast","drawing.refrigeration.french_door":"Koelkast met Franse deuren","drawing.refrigeration.over_under":"Koel-vriescombinatie","drawing.refrigeration.column_refrigerator":"Koelkolom","drawing.refrigeration.column_freezer":"Vrieskolom","drawing.refrigeration.column_wine":"Wijnkolom","drawing.refrigeration.tall_refrigerator":"Koelkast","drawing.refrigeration.tall_freezer":"Vriezer","drawing.refrigeration.tall_over_under":"Koel-vriescombinatie","drawing.refrigeration.wine_over_drawers":"Wijnklimaatkast met lades","drawing.refrigeration.undercounter_refrigerator":"Onderbouwkoelkast","drawing.refrigeration.undercounter_beverage":"Drankenkoeler","drawing.refrigeration.undercounter_wine":"Wijnklimaatkast","drawing.refrigeration.undercounter_drawers":"Koellades","drawing.refrigeration.freezer_drawers":"Vrieslades","drawing.refrigeration.combination_drawers":"Koel- en vrieslades","drawing.refrigeration.ice_maker":"IJsmachine","drawing.open.door":"deur open","drawing.open.refrigerator_door":"koelkastdeur open","drawing.open.freezer_door":"vriezerdeur open","drawing.open.wine_door":"deur van wijnklimaatkast open","drawing.open.ice_maker_door":"deur van ijsmachine open","drawing.open.refrigerator_drawer":"koellade open","drawing.open.freezer_drawer":"vrieslade open","drawing.ice_maker.cleaning":"reinigen","drawing.range":"Fornuis","drawing.range_induction":"Inductiefornuis","drawing.wall_oven":"Inbouwoven","drawing.wall_oven_double":"Dubbele inbouwoven","drawing.oven.left":"linkeroven","drawing.oven.right":"rechteroven","drawing.oven.upper":"bovenste oven","drawing.oven.lower":"onderste oven","drawing.oven_state":"{oven}: {state}","drawing.state.door_open":"deur open","drawing.state.self_cleaning":"zelfreiniging bezig","drawing.state.preheated":"voorverwarmd","drawing.state.heating":"warmt op","drawing.state.off":"uit","drawing.state.light_on":"lamp aan","drawing.state.probe_in":"kerntemperatuurmeter aangesloten","drawing.state.remote_ready":"Remote Ready","drawing.timer":"timer {time}","drawing.hood.wall":"Wandafzuigkap","drawing.hood.island":"Eilandafzuigkap","drawing.hood.insert":"Afzuigunit","drawing.hood.hood":"Afzuigkap","drawing.fan_speed":"ventilatorstand {speed}","drawing.light_level":"lamp {percent}%","drawing.halo_on":"halolicht aan","drawing.dishwasher":"Vaatwasser","drawing.wash.running":"bezig","drawing.wash.paused":"gepauzeerd","drawing.wash.canceling":"wordt geannuleerd","drawing.wash.drying":"drogen","drawing.wash.done":"klaar","drawing.wash.delayed":"uitgestelde start","drawing.wash.error":"fout","drawing.time_left":"nog {time}","drawing.starts_in":"begint over {time}","drawing.rinse_aid_low":"glansspoelmiddel bijna op","drawing.softener_low":"onthardingszout bijna op","drawing.screen.off":"Uit","drawing.screen.heating":"Opwarmen","drawing.screen.preheating":"Voorverwarmen {percent}%","drawing.screen.preheated":"Voorverwarmd","drawing.screen.self_clean":"Zelfreiniging","drawing.screen.clean":"Reinigen","drawing.screen.timer":"Timer {n}","drawing.screen.light":"Lamp","drawing.screen.lock":"Slot","drawing.screen.settings":"Instellingen"};var Ws={"drawing.separator":", ","drawing.offline":"offline","drawing.appliance":"Urz\u0105dzenie","drawing.refrigeration.side_by_side":"Lod\xF3wka ameryka\u0144ska","drawing.refrigeration.french_door":"Lod\xF3wka z drzwiami francuskimi","drawing.refrigeration.over_under":"Lod\xF3wko-zamra\u017Carka","drawing.refrigeration.column_refrigerator":"Kolumna ch\u0142odz\u0105ca","drawing.refrigeration.column_freezer":"Kolumna zamra\u017Caj\u0105ca","drawing.refrigeration.column_wine":"Kolumna na wino","drawing.refrigeration.tall_refrigerator":"Lod\xF3wka","drawing.refrigeration.tall_freezer":"Zamra\u017Carka","drawing.refrigeration.tall_over_under":"Lod\xF3wko-zamra\u017Carka","drawing.refrigeration.wine_over_drawers":"Ch\u0142odziarka do wina z szufladami","drawing.refrigeration.undercounter_refrigerator":"Lod\xF3wka podblatowa","drawing.refrigeration.undercounter_beverage":"Ch\u0142odziarka do napoj\xF3w","drawing.refrigeration.undercounter_wine":"Ch\u0142odziarka do wina","drawing.refrigeration.undercounter_drawers":"Szuflady ch\u0142odz\u0105ce","drawing.refrigeration.freezer_drawers":"Szuflady zamra\u017Caj\u0105ce","drawing.refrigeration.combination_drawers":"Szuflady ch\u0142odz\u0105ce i zamra\u017Caj\u0105ce","drawing.refrigeration.ice_maker":"Kostkarka do lodu","drawing.open.door":"drzwi otwarte","drawing.open.refrigerator_door":"drzwi lod\xF3wki otwarte","drawing.open.freezer_door":"drzwi zamra\u017Carki otwarte","drawing.open.wine_door":"drzwi ch\u0142odziarki do wina otwarte","drawing.open.ice_maker_door":"drzwi kostkarki otwarte","drawing.open.refrigerator_drawer":"szuflada lod\xF3wki otwarta","drawing.open.freezer_drawer":"szuflada zamra\u017Carki otwarta","drawing.ice_maker.cleaning":"czyszczenie","drawing.range":"Kuchnia wolnostoj\u0105ca","drawing.range_induction":"Kuchnia indukcyjna","drawing.wall_oven":"Piekarnik do zabudowy","drawing.wall_oven_double":"Podw\xF3jny piekarnik do zabudowy","drawing.oven.left":"lewy piekarnik","drawing.oven.right":"prawy piekarnik","drawing.oven.upper":"g\xF3rny piekarnik","drawing.oven.lower":"dolny piekarnik","drawing.oven_state":"{oven}: {state}","drawing.state.door_open":"drzwi otwarte","drawing.state.self_cleaning":"trwa samoczyszczenie","drawing.state.preheated":"nagrzany","drawing.state.heating":"grzanie","drawing.state.off":"wy\u0142\u0105czony","drawing.state.light_on":"\u015Bwiat\u0142o w\u0142\u0105czone","drawing.state.probe_in":"sonda pod\u0142\u0105czona","drawing.state.remote_ready":"Remote Ready","drawing.timer":"minutnik {time}","drawing.hood.wall":"Okap przy\u015Bcienny","drawing.hood.island":"Okap wyspowy","drawing.hood.insert":"Okap do zabudowy","drawing.hood.hood":"Okap","drawing.fan_speed":"bieg wentylatora {speed}","drawing.light_level":"\u015Bwiat\u0142o {percent}%","drawing.halo_on":"o\u015Bwietlenie halo w\u0142\u0105czone","drawing.dishwasher":"Zmywarka","drawing.wash.running":"w trakcie","drawing.wash.paused":"wstrzymana","drawing.wash.canceling":"anulowanie","drawing.wash.drying":"suszenie","drawing.wash.done":"zako\u0144czono","drawing.wash.delayed":"op\xF3\u017Aniony start","drawing.wash.error":"b\u0142\u0105d","drawing.time_left":"pozosta\u0142o {time}","drawing.starts_in":"rozpocznie si\u0119 za {time}","drawing.rinse_aid_low":"niski poziom nab\u0142yszczacza","drawing.softener_low":"niski poziom soli zmi\u0119kczaj\u0105cej","drawing.screen.off":"Wy\u0142.","drawing.screen.heating":"Grzanie","drawing.screen.preheating":"Nagrzewanie {percent}%","drawing.screen.preheated":"Nagrzany","drawing.screen.self_clean":"Samoczyszczenie","drawing.screen.clean":"Czyszczenie","drawing.screen.timer":"Minutnik {n}","drawing.screen.light":"\u015Awiat\u0142o","drawing.screen.lock":"Blokada","drawing.screen.settings":"Ustawienia"};var qs={"drawing.separator":", ","drawing.offline":"offline","drawing.appliance":"Vitvara","drawing.refrigeration.side_by_side":"Amerikanskt kylsk\xE5p","drawing.refrigeration.french_door":"Kylsk\xE5p med franska d\xF6rrar","drawing.refrigeration.over_under":"Kyl/frys","drawing.refrigeration.column_refrigerator":"Kylpelare","drawing.refrigeration.column_freezer":"Fryspelare","drawing.refrigeration.column_wine":"Vinpelare","drawing.refrigeration.tall_refrigerator":"Kylsk\xE5p","drawing.refrigeration.tall_freezer":"Frys","drawing.refrigeration.tall_over_under":"Kyl/frys","drawing.refrigeration.wine_over_drawers":"Vinkyl med l\xE5dor","drawing.refrigeration.undercounter_refrigerator":"Underbyggt kylsk\xE5p","drawing.refrigeration.undercounter_beverage":"Dryckeskyl","drawing.refrigeration.undercounter_wine":"Vinkyl","drawing.refrigeration.undercounter_drawers":"Kyll\xE5dor","drawing.refrigeration.freezer_drawers":"Frysl\xE5dor","drawing.refrigeration.combination_drawers":"Kyl- och frysl\xE5dor","drawing.refrigeration.ice_maker":"Ismaskin","drawing.open.door":"d\xF6rren \xF6ppen","drawing.open.refrigerator_door":"kylsk\xE5psd\xF6rren \xF6ppen","drawing.open.freezer_door":"frysd\xF6rren \xF6ppen","drawing.open.wine_door":"vinkylens d\xF6rr \xF6ppen","drawing.open.ice_maker_door":"ismaskinens d\xF6rr \xF6ppen","drawing.open.refrigerator_drawer":"kyll\xE5dan \xF6ppen","drawing.open.freezer_drawer":"frysl\xE5dan \xF6ppen","drawing.ice_maker.cleaning":"reng\xF6r","drawing.range":"Spis","drawing.range_induction":"Induktionsspis","drawing.wall_oven":"Inbyggnadsugn","drawing.wall_oven_double":"Dubbel inbyggnadsugn","drawing.oven.left":"v\xE4nster ugn","drawing.oven.right":"h\xF6ger ugn","drawing.oven.upper":"\xF6vre ugn","drawing.oven.lower":"nedre ugn","drawing.oven_state":"{oven}: {state}","drawing.state.door_open":"luckan \xF6ppen","drawing.state.self_cleaning":"sj\xE4lvreng\xF6ring p\xE5g\xE5r","drawing.state.preheated":"f\xF6rv\xE4rmd","drawing.state.heating":"v\xE4rmer","drawing.state.off":"av","drawing.state.light_on":"belysning p\xE5","drawing.state.probe_in":"stektermometer ansluten","drawing.state.remote_ready":"Remote Ready","drawing.timer":"timer {time}","drawing.hood.wall":"V\xE4ggfl\xE4kt","drawing.hood.island":"K\xF6ks\xF6fl\xE4kt","drawing.hood.insert":"Fl\xE4ktinsats","drawing.hood.hood":"K\xF6ksfl\xE4kt","drawing.fan_speed":"fl\xE4kthastighet {speed}","drawing.light_level":"belysning {percent} %","drawing.halo_on":"haloljus p\xE5","drawing.dishwasher":"Diskmaskin","drawing.wash.running":"p\xE5g\xE5r","drawing.wash.paused":"pausad","drawing.wash.canceling":"avbryts","drawing.wash.drying":"torkar","drawing.wash.done":"klar","drawing.wash.delayed":"f\xF6rdr\xF6jd start","drawing.wash.error":"fel","drawing.time_left":"{time} kvar","drawing.starts_in":"startar om {time}","drawing.rinse_aid_low":"spolglansen h\xE5ller p\xE5 att ta slut","drawing.softener_low":"regenereringssaltet h\xE5ller p\xE5 att ta slut","drawing.screen.off":"Av","drawing.screen.heating":"V\xE4rmer","drawing.screen.preheating":"F\xF6rv\xE4rmer {percent} %","drawing.screen.preheated":"F\xF6rv\xE4rmd","drawing.screen.self_clean":"Sj\xE4lvreng\xF6ring","drawing.screen.clean":"Reng\xF6ring","drawing.screen.timer":"Timer {n}","drawing.screen.light":"Ljus","drawing.screen.lock":"L\xE5s","drawing.screen.settings":"Inst\xE4llningar"};var Zs={"drawing.separator":"\uFF0C","drawing.offline":"\u79BB\u7EBF","drawing.appliance":"\u7535\u5668","drawing.refrigeration.side_by_side":"\u5BF9\u5F00\u95E8\u51B0\u7BB1","drawing.refrigeration.french_door":"\u6CD5\u5F0F\u591A\u95E8\u51B0\u7BB1","drawing.refrigeration.over_under":"\u4E0A\u51B7\u85CF\u4E0B\u51B7\u51BB\u51B0\u7BB1","drawing.refrigeration.column_refrigerator":"\u51B7\u85CF\u67F1","drawing.refrigeration.column_freezer":"\u51B7\u51BB\u67F1","drawing.refrigeration.column_wine":"\u9152\u67DC\u67F1","drawing.refrigeration.tall_refrigerator":"\u51B7\u85CF\u67DC","drawing.refrigeration.tall_freezer":"\u51B7\u51BB\u67DC","drawing.refrigeration.tall_over_under":"\u4E0A\u51B7\u85CF\u4E0B\u51B7\u51BB\u51B0\u7BB1","drawing.refrigeration.wine_over_drawers":"\u9152\u67DC\u914D\u62BD\u5C49","drawing.refrigeration.undercounter_refrigerator":"\u53F0\u4E0B\u51B7\u85CF\u67DC","drawing.refrigeration.undercounter_beverage":"\u996E\u6599\u67DC","drawing.refrigeration.undercounter_wine":"\u9152\u67DC","drawing.refrigeration.undercounter_drawers":"\u51B7\u85CF\u62BD\u5C49","drawing.refrigeration.freezer_drawers":"\u51B7\u51BB\u62BD\u5C49","drawing.refrigeration.combination_drawers":"\u51B7\u85CF\u548C\u51B7\u51BB\u62BD\u5C49","drawing.refrigeration.ice_maker":"\u5236\u51B0\u673A","drawing.open.door":"\u95E8\u672A\u5173","drawing.open.refrigerator_door":"\u51B7\u85CF\u5BA4\u95E8\u672A\u5173","drawing.open.freezer_door":"\u51B7\u51BB\u5BA4\u95E8\u672A\u5173","drawing.open.wine_door":"\u9152\u67DC\u95E8\u672A\u5173","drawing.open.ice_maker_door":"\u5236\u51B0\u673A\u95E8\u672A\u5173","drawing.open.refrigerator_drawer":"\u51B7\u85CF\u62BD\u5C49\u672A\u5173","drawing.open.freezer_drawer":"\u51B7\u51BB\u62BD\u5C49\u672A\u5173","drawing.ice_maker.cleaning":"\u6B63\u5728\u6E05\u6D01","drawing.range":"\u4E00\u4F53\u5F0F\u7089\u7076","drawing.range_induction":"\u7535\u78C1\u4E00\u4F53\u5F0F\u7089\u7076","drawing.wall_oven":"\u5D4C\u5165\u5F0F\u70E4\u7BB1","drawing.wall_oven_double":"\u53CC\u5D4C\u5165\u5F0F\u70E4\u7BB1","drawing.oven.left":"\u5DE6\u70E4\u7BB1","drawing.oven.right":"\u53F3\u70E4\u7BB1","drawing.oven.upper":"\u4E0A\u70E4\u7BB1","drawing.oven.lower":"\u4E0B\u70E4\u7BB1","drawing.oven_state":"{oven}\uFF1A{state}","drawing.state.door_open":"\u95E8\u672A\u5173","drawing.state.self_cleaning":"\u6B63\u5728\u81EA\u6E05\u6D01","drawing.state.preheated":"\u5DF2\u9884\u70ED","drawing.state.heating":"\u52A0\u70ED\u4E2D","drawing.state.off":"\u5DF2\u5173\u95ED","drawing.state.light_on":"\u706F\u5DF2\u5F00","drawing.state.probe_in":"\u5DF2\u63D2\u5165\u63A2\u9488","drawing.state.remote_ready":"Remote Ready","drawing.timer":"\u5B9A\u65F6 {time}","drawing.hood.wall":"\u58C1\u6302\u5F0F\u6CB9\u70DF\u673A","drawing.hood.island":"\u5C9B\u5F0F\u6CB9\u70DF\u673A","drawing.hood.insert":"\u5D4C\u5165\u5F0F\u6CB9\u70DF\u673A","drawing.hood.hood":"\u6CB9\u70DF\u673A","drawing.fan_speed":"\u98CE\u6247 {speed} \u6863","drawing.light_level":"\u706F\u5149 {percent}%","drawing.halo_on":"\u5149\u73AF\u706F\u5DF2\u5F00","drawing.dishwasher":"\u6D17\u7897\u673A","drawing.wash.running":"\u8FD0\u884C\u4E2D","drawing.wash.paused":"\u5DF2\u6682\u505C","drawing.wash.canceling":"\u6B63\u5728\u53D6\u6D88","drawing.wash.drying":"\u70D8\u5E72\u4E2D","drawing.wash.done":"\u5DF2\u5B8C\u6210","drawing.wash.delayed":"\u5EF6\u65F6\u542F\u52A8","drawing.wash.error":"\u9519\u8BEF","drawing.time_left":"\u5269\u4F59 {time}","drawing.starts_in":"{time}\u540E\u5F00\u59CB","drawing.rinse_aid_low":"\u5149\u4EAE\u5242\u4E0D\u8DB3","drawing.softener_low":"\u8F6F\u6C34\u76D0\u4E0D\u8DB3","drawing.screen.off":"\u5173","drawing.screen.heating":"\u52A0\u70ED\u4E2D","drawing.screen.preheating":"\u9884\u70ED\u4E2D {percent}%","drawing.screen.preheated":"\u5DF2\u9884\u70ED","drawing.screen.self_clean":"\u81EA\u6E05\u6D01","drawing.screen.clean":"\u6E05\u6D01","drawing.screen.timer":"\u5B9A\u65F6 {n}","drawing.screen.light":"\u7167\u660E","drawing.screen.lock":"\u9501\u5B9A","drawing.screen.settings":"\u8BBE\u7F6E"};var Ys={"action.cancel_cycle":"Programm abbrechen","action.cancel_schedule":"Abbrechen","action.dismiss":"Best\xE4tigen","action.end":"Beenden","action.reset":"Zur\xFCcksetzen","action.start":"Starten","action.turn_off":"Ausschalten","cavity.left":"Linker Backofen","cavity.lower":"Unterer Backofen","cavity.right":"Rechter Backofen","cavity.single":"Backofen","cavity.upper":"Oberer Backofen","confirm.cancel_cycle":"Sp\xFClgang abbrechen?","confirm.start.left":"Linken Backofen mit {setting} starten?","confirm.start.lower":"Unteren Backofen mit {setting} starten?","confirm.start.right":"Rechten Backofen mit {setting} starten?","confirm.start.single":"Backofen mit {setting} starten?","confirm.start.upper":"Oberen Backofen mit {setting} starten?","confirm.start_dishwasher":"{cycle} am Geschirrsp\xFCler starten?","confirm.stop.left":"Linken Backofen ausschalten?","confirm.stop.lower":"Unteren Backofen ausschalten?","confirm.stop.right":"Rechten Backofen ausschalten?","confirm.stop.single":"Backofen ausschalten?","confirm.stop.upper":"Oberen Backofen ausschalten?","control.accent_light":"Akzentbeleuchtung","control.air_filter":"Luftfilter","control.air_purification":"Luftreinigung","control.appliance_type":"Ger\xE4tetyp","control.broil_level":"Grillstufe","control.cancel_cycle":"Laufendes Programm","control.cancel_delay":"Geplante Eispause","control.clean_due":"Reinigung f\xE4llig","control.clean_stage":"Reinigungsschritt","control.control_lock":"Bedienungssperre","control.cook_mode":"Betriebsart","control.cook_timer":"Garzeit-Timer","control.crisper_mode":"Gem\xFCsefach-Temperatur","control.cycles_until_cleaning":"Eiszyklen bis zur Reinigung","control.delay_left":"Pause endet in","control.delay_schedule":"Zeitplan","control.delay_start":"Startverz\xF6gerung","control.delayed_shutoff":"Verz\xF6gerte Abschaltung","control.dishwasher_mode":"Modus","control.dispenser":"Innerer Wasserspender","control.door_open_delay":"T\xFCr-offen-Verz\xF6gerung","control.duration":"Dauer","control.end_delay":"Aktuelle Pause","control.extended_dry_on":"Verl\xE4ngertes Trocknen","control.failsafe":"Sicherheitsabschaltung","control.fan":"L\xFCfter","control.fan_sensitivity":"Automatik-Empfindlichkeit","control.fault":"St\xF6rung {code}","control.fault_code":"Code {code}","control.fault_unknown":"St\xF6rung","control.faults":"Aktive St\xF6rungen","control.filter_allowance":"Filter-Nutzungsdauer","control.filter_usage":"Filternutzung","control.gourmet":"Gourmet-Programm","control.halo":"Halo-Licht","control.heated_dry_on":"Extra trocken","control.high_temp_wash_on":"Hochtemperatursp\xFClen","control.high_use_left":"Intensivbetrieb endet in","control.humidity":"Feuchtigkeitsregelung","control.ice_maker":"Eisbereiter","control.key_tones":"Tastent\xF6ne","control.kitchen_timer":"K\xFCchentimer","control.kitchen_timer2":"K\xFCchentimer 2","control.light":"Licht","control.max_ice_left":"Max Eis endet in","control.model":"Modell","control.next_cleaning":"N\xE4chste Reinigung","control.night_mode":"Nachtmodus","control.operating_mode":"Modus","control.power":"Ein/Aus","control.probe":"Kerntemperaturf\xFChler","control.probe_target":"Kerntemperatur-Ziel","control.remote_ready":"Remote Ready","control.remote_start":"Fernstart","control.reset_air_filter":"Luftfilter zur\xFCcksetzen","control.rinse_aid":"Klarsp\xFCler","control.sabbath":"Sabbatmodus","control.sani_rinse_on":"Hygienesp\xFClen","control.schedule_delay":"Neue Eispause","control.service":"Kundendienst","control.shutoff_after":"Abschalten nach","control.softener":"Regeneriersalz","control.starts_in":"Start in","control.status":"Zustand","control.task_light":"Arbeitslicht","control.temperature":"Temperatur","control.time_left":"Restzeit","control.timer_finished":"Timer abgelaufen","control.top_rack_only_on":"Nur oberer Korb","control.uptime":"Betriebszeit","control.wash_cycle":"Sp\xFClprogramm","control.water_filter":"Wasserfilter","control.water_filter_capacity":"Wasserfilter-Kapazit\xE4t","control.wifi":"WLAN-Signal","control.wine_temp_alert":"Temperaturalarm","control.winterized":"Eingewintert","ctl.at":"Startzeit","ctl.brightness":"Helligkeit","ctl.custom":"Eigene","ctl.decrease":"Verringern","ctl.duration":"Dauer","ctl.increase":"Erh\xF6hen","ctl.later":"Sp\xE4ter heute","ctl.minutes":"Minuten","ctl.more_info":"{name}: weitere Informationen","ctl.not_now":"Nicht jetzt","ctl.now":"Jetzt","ctl.off":"Aus","ctl.on":"Ein","ctl.repeat":"T\xE4glich wiederholen","ctl.saving":"Wird gespeichert \u2026","ctl.schedule":"Planen","ctl.set":"Festlegen","ctl.speed":"Stufe {n}","ctl.start":"Beginn","ctl.starts_in":"Beginnt in {time}","ctl.white":"Wei\xDFton","display.starts_at":"Start {time}","event.air_filter_expired":"Luftfilter abgelaufen","event.cavity.cooking_timer_complete":"Garzeit-Timer abgelaufen","event.cavity.cooking_timer_under_one_minute":"Garzeit-Timer l\xE4uft noch eine Minute","event.cavity.door_ajar":"T\xFCr offen","event.cavity.preheated":"Vorheizen abgeschlossen","event.cavity.probe_connected":"Kerntemperaturf\xFChler in Verwendung","event.cavity.probe_target_reached":"Kerntemperatur erreicht","event.cavity.probe_within_ten_degrees":"Kerntemperatur weniger als 10 \xB0F vom Zielwert entfernt","event.cavity.self_clean_complete":"Reinigung abgeschlossen","event.dishwasher_cancelled":"Sp\xFClgang abgebrochen","event.dishwasher_complete":"Sp\xFClgang abgeschlossen","event.dishwasher_paused":"Sp\xFClgang unterbrochen","event.dishwasher_service_required":"Geschirrsp\xFCler-Service erforderlich","event.dishwasher_started":"Sp\xFClgang gestartet","event.fault_notification":"Ger\xE4test\xF6rung","event.feedback_notification":"Feedback-Anfrage","event.freezer_door_ajar":"Gefrierschrankt\xFCr offen","event.freezer_setpoint_changed":"Solltemperatur des Gefrierschranks ge\xE4ndert","event.ice_cleaning_add_descaler":"Reinigungszyklus des Eisbereiters ben\xF6tigt Entkalker","event.ice_cleaning_add_sanitizer":"Reinigungszyklus des Eisbereiters ben\xF6tigt Desinfektionsmittel","event.ice_cleaning_cancelled":"Reinigungszyklus des Eisbereiters abgebrochen","event.ice_cleaning_complete":"Reinigungszyklus des Eisbereiters abgeschlossen","event.ice_cleaning_due_soon":"Reinigungszyklus des Eisbereiters bald f\xE4llig","event.ice_cleaning_required":"Reinigungszyklus des Eisbereiters f\xE4llig","event.ice_maker_door_ajar":"Eisbereitert\xFCr offen","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"K\xFCchentimer 2 abgelaufen","event.kitchen_timer_2_under_one_minute":"K\xFCchentimer 2 l\xE4uft noch eine Minute","event.kitchen_timer_complete":"K\xFCchentimer abgelaufen","event.kitchen_timer_under_one_minute":"K\xFCchentimer l\xE4uft noch eine Minute","event.lower_oven_cooking_timer_complete":"Garzeit-Timer des unteren Backofens abgelaufen","event.lower_oven_cooking_timer_under_one_minute":"Garzeit-Timer des unteren Backofens l\xE4uft noch eine Minute","event.lower_oven_door_ajar":"T\xFCr des unteren Backofens offen","event.lower_oven_preheated":"Vorheizen des unteren Backofens abgeschlossen","event.lower_oven_probe_connected":"Kerntemperaturf\xFChler des unteren Backofens in Verwendung","event.lower_oven_probe_target_reached":"Kerntemperatur im unteren Backofen erreicht","event.lower_oven_probe_within_ten_degrees":"Kerntemperatur im unteren Backofen weniger als 10 \xB0F vom Zielwert entfernt","event.lower_oven_self_clean_complete":"Reinigung des unteren Backofens abgeschlossen","event.oven_cooking_timer_complete":"Garzeit-Timer des Backofens abgelaufen","event.oven_cooking_timer_under_one_minute":"Garzeit-Timer des Backofens l\xE4uft noch eine Minute","event.oven_door_ajar":"Backofent\xFCr offen","event.oven_preheated":"Vorheizen des Backofens abgeschlossen","event.oven_probe_connected":"Kerntemperaturf\xFChler des Backofens in Verwendung","event.oven_probe_target_reached":"Kerntemperatur im Backofen erreicht","event.oven_probe_within_ten_degrees":"Kerntemperatur im Backofen weniger als 10 \xB0F vom Zielwert entfernt","event.oven_self_clean_complete":"Backofenreinigung abgeschlossen","event.oven_service_required":"Backofen-Service erforderlich","event.refrigerator_door_ajar":"K\xFChlschrankt\xFCr offen","event.refrigerator_service_required":"K\xFChlschrank-Service erforderlich","event.refrigerator_setpoint_changed":"Solltemperatur des K\xFChlschranks ge\xE4ndert","event.rinse_aid_low":"Wenig Klarsp\xFCler","event.softener_salt_low":"Wenig Regeneriersalz","event.unknown":"Unbekannt","event.water_filter_expired":"Wasserfilter abgelaufen","event.wine_door_ajar":"Weinschrankt\xFCr offen","event.wine_setpoint_changed":"Solltemperatur des Weinschranks ge\xE4ndert","event.wine_temperature_alert":"Weinschranktemperatur au\xDFerhalb des Bereichs","full.appearance":"Darstellung","full.appliance":"Hausger\xE4t","full.events_error":"Ereignisse konnten nicht geladen werden: {error}","full.events_loading":"Ereignisse werden geladen \u2026","full.events_more":"{days} Tage anzeigen","full.failed":"Das hat nicht funktioniert.","full.no_events":"Keine Ereignisse in den letzten {days} Tagen.","full.recent_events":"Letzte Ereignisse","full.refresh":"Aktualisieren","full.refresh_hint":"Liest jetzt den Zustand des Hausger\xE4ts.","full.refreshing":"Wird aktualisiert \u2026","info.air_filter":"Luftfilter","info.cleaning":"Reinigung","info.cycle":"Programm","info.delay":"Eispause","info.ends":"Ende","info.fan":"L\xFCfter","info.filter":"Fettfilter","info.ice_maker":"Eisbereiter","info.light":"Licht","info.mode":"Modus","info.model":"Modell","info.next_cleaning":"N\xE4chste Reinigung","info.options":"Optionen","info.probe":"F\xFChler","info.set_to":"Eingestellt","info.starts":"Start","info.status":"Zustand","info.water_filter":"Wasserfilter","lock.cycle_no_delay":"Dieses Sp\xFClprogramm bietet keine Startverz\xF6gerung.","lock.cycle_no_option":"Dieses Sp\xFClprogramm bietet diese Option nicht.","lock.delay_not_idle":"Die Startverz\xF6gerung l\xE4sst sich nur \xE4ndern, solange der Geschirrsp\xFCler bereit ist oder auf den Start wartet.","lock.proof_light":"Beim G\xE4ren bleibt das Backofenlicht aus.","lock.sabbath":"Der Sabbatmodus ist an. Schalte ihn aus, um dies zu \xE4ndern.","lock.self_clean":"Der Backofen reinigt sich selbst. Er kann nur ausgeschaltet werden.","lock.wash_not_idle":"Sp\xFCloptionen lassen sich nur \xE4ndern, solange der Geschirrsp\xFCler bereit ist.","option.10_hours":"10 Stunden","option.10_minutes":"10 Minuten","option.11_hours":"11 Stunden","option.12_hours":"12 Stunden","option.1_hour":"1 Stunde","option.1_minute":"1 Minute","option.2_hours":"2 Stunden","option.2_minutes":"2 Minuten","option.3_hours":"3 Stunden","option.4_hours":"4 Stunden","option.5_hours":"5 Stunden","option.5_minutes":"5 Minuten","option.6_hours":"6 Stunden","option.7_hours":"7 Stunden","option.8_hours":"8 Stunden","option.9_hours":"9 Stunden","option.add_descaler":"Entkalker einf\xFCllen","option.add_sanitizer":"Desinfektionsmittel einf\xFCllen","option.auto":"Automatik","option.automatic":"Automatisch","option.bake":"Backen","option.bake_stone":"Backstein","option.broil":"Grillen","option.canceling":"Wird abgebrochen","option.child_lock":"Kindersicherung","option.cleaning_complete":"Reinigung abgeschlossen","option.cleaning_reset_flush":"Reinigung zur\xFCcksetzen: Sp\xFClen","option.cleaning_reset_rinse":"Reinigung zur\xFCcksetzen: Nachsp\xFClen","option.convection":"Hei\xDFluft","option.convection_bake":"Hei\xDFluft-Backen","option.convection_broil":"Hei\xDFluft-Grillen","option.convection_roast":"Hei\xDFluft-Braten","option.crystal_and_china":"Kristall und Porzellan","option.dehydrate":"D\xF6rren","option.delayed":"Verz\xF6gert","option.descale_clean":"Entkalken: Reinigen","option.descale_fill":"Entkalken: F\xFCllen","option.descale_flush":"Entkalken: Sp\xFClen","option.descale_rinse":"Entkalken: Nachsp\xFClen","option.disabled":"Deaktiviert","option.done":"Fertig","option.drying":"Trocknet","option.empty_bin":"Beh\xE4lter leeren","option.enabled":"Aktiviert","option.energy":"Eco","option.enhanced":"Erh\xF6ht","option.error":"Fehler","option.extra_quiet":"Extra leise","option.heavy":"Intensiv","option.high":"Hoch","option.high_use":"Intensivbetrieb","option.idle":"Bereit","option.light":"Leicht","option.long_vacation":"Langer Urlaub","option.low":"Niedrig","option.manual":"Manuell","option.manually_clean":"Manuell reinigen","option.max_ice":"Max Eis","option.medium":"Mittel","option.night_ice":"Nacht-Eis","option.none":"Keins","option.normal":"Normal","option.not_cleaning":"Keine Reinigung","option.off":"Aus","option.on":"Ein","option.paused":"Pausiert","option.plastics":"Kunststoffe","option.pots_and_pans":"T\xF6pfe und Pfannen","option.proof":"G\xE4ren","option.quick":"Kurz","option.rinse_and_hold":"Vorsp\xFClen","option.roast":"Braten","option.running":"L\xE4uft","option.sabbath":"Sabbat","option.sanitize_clean":"Desinfizieren: Reinigen","option.sanitize_fill":"Desinfizieren: F\xFCllen","option.sanitize_flush":"Desinfizieren: Sp\xFClen","option.sanitize_rinse":"Desinfizieren: Nachsp\xFClen","option.self_clean":"Selbstreinigung","option.short_vacation":"Kurzurlaub","option.soak_and_scrub":"Einweichen und Schrubben","option.warm":"Warmhalten","pill.cleaning":"Reinigung","pill.cleaning_due":"Reinigung f\xE4llig","pill.cooking":"Gart","pill.delayed_shutoff":"Verz\xF6gerte Abschaltung","pill.door_open":"T\xFCr offen","pill.door_open_for":"T\xFCr offen \xB7 {time}","pill.fan":"L\xFCfter {speed}","pill.high_use":"Intensivbetrieb","pill.light":"Licht an","pill.making_ice":"Macht Eis","pill.normal":"Normalbetrieb","pill.off":"Aus","pill.offline":"Offline","pill.paused":"Pausiert","pill.preheated":"Vorgeheizt","pill.preheating":"Heizt vor {pct} %","pill.remote_ready":"Remote Ready","pill.sabbath":"Sabbat","pill.self_clean":"Selbstreinigung","pill.service":"Kundendienst","pill.temp_alert":"Temperaturalarm","pill.timer":"Timer {time}","pill.timer_done":"Timer abgelaufen","pill.vacation":"Urlaub","reason.choose_mode":"W\xE4hle zuerst eine Betriebsart.","reason.close_door":"Schlie\xDFe zuerst die T\xFCr.","reason.close_oven_door":"Schlie\xDFe zuerst die Backofent\xFCr.","reason.crisper_auto":"Stelle das Gem\xFCsefach auf Manuell, um dies zu \xE4ndern.","reason.dishwasher_busy":"Nur \xE4nderbar, solange der Geschirrsp\xFCler bereit ist.","reason.manual_mode":"Starte diese Betriebsart am Backofen.","reason.max_ice":"Schalte Max Eis aus, um die Gefriertemperatur zu \xE4ndern.","reason.mode_change_disabled":"Der Backofen nimmt gerade keinen Wechsel der Betriebsart an.","reason.no_temperature":"Diese Betriebsart hat keine einstellbare Temperatur.","reason.offline":"Das Hausger\xE4t ist offline.","reason.oven_not_ready":"Verf\xFCgbar, solange der Backofen l\xE4uft oder in Remote Ready ist.","reason.remote_ready_dishwasher":"Schalte zuerst Remote Ready am Geschirrsp\xFCler ein.","reason.remote_ready_oven":"Schalte Remote Ready am Backofen ein, um ihn von hier zu starten.","reason.set_temperature":"Stelle zuerst die Temperatur ein.","reason.start_at_oven":"Schalte ihn am Backofen ein.","reason.unavailable":"Gerade nicht verf\xFCgbar.","reason.use_start":"Schalte ihn unten mit Starten ein.","section.cleaning":"Reinigung","section.cycle":"Sp\xFClgang","section.delayed_shutoff":"Verz\xF6gerte Abschaltung","section.details":"Einzelheiten","section.fan_light":"L\xFCfter und Licht","section.filters":"Filter und Wartung","section.ice_delay":"Eispause","section.ice_maker":"Eisbereiter","section.maintenance":"Wartung","section.modes":"Modi","section.options":"Optionen","section.settings":"Einstellungen","section.temperatures":"Temperaturen","severity.critical":"Kritisch","severity.high":"Hoch","severity.low":"Niedrig","severity.medium":"Mittel","severity.undefined":"Nicht angegeben","severity.unknown":"Unbekannt","severity.urgent":"Dringend","unit.days":"{n} T","unit.days_hours":"{d} T {h} Std.","unit.hours":"{n} Std.","unit.hours_minutes":"{h} Std. {m} Min.","unit.minutes":"{n} Min.","value.alert":"Alarm","value.daily_for":"T\xE4glich f\xFCr {duration}","value.daily_from":"T\xE4glich ab {time} f\xFCr {duration}","value.done":"Fertig","value.door_open":"T\xFCr offen","value.door_open_for":"T\xFCr offen \xB7 {time}","value.due_now":"Jetzt","value.due_soon":"Bald","value.ends_at":"Endet um {time}","value.from_for":"Ab {time} f\xFCr {duration}","value.in_cycles":"In {n} Zyklen","value.inserted":"Eingesetzt","value.low":"Niedrig","value.missing":"Fehlt","value.no_faults":"Keine","value.none":"Keine","value.normal":"Unauff\xE4llig","value.not_connected":"Nicht eingesteckt","value.not_due":"Noch nicht","value.not_needed":"Nicht n\xF6tig","value.now":"Aktuell {temp}","value.off":"Aus","value.ok":"In Ordnung","value.on":"Ein","value.percent_used":"{pct} % verbraucht","value.probe_close":"Weniger als 10 \xB0F vom Ziel","value.probe_done":"Ziel erreicht","value.replace":"Wechseln","value.required":"Erforderlich","value.speed":"Stufe {speed}","value.under_minute":"Unter einer Minute","value.until":"Bis {time}","wifi.excellent":"Ausgezeichnet","wifi.fair":"M\xE4\xDFig","wifi.good":"Gut","wifi.weak":"Schwach","zone.crisp":"Gem\xFCsefach","zone.frz":"Gefrierschrank","zone.ref":"K\xFChlschrank","zone.ref2":"K\xFChlschublade","zone.short.crisp":"Gem\xFCsefach","zone.short.frz":"Gefrierschrank","zone.short.ref":"K\xFChlschrank","zone.short.ref2":"Schublade","zone.short.wine":"Wein","zone.short.wine_lower":"Unten","zone.short.wine_upper":"Oben","zone.wine":"Weinschrank","zone.wine_lower":"Untere Zone","zone.wine_upper":"Obere Zone"};var Xs={"action.cancel_cycle":"Cancel cycle","action.cancel_schedule":"Cancel","action.dismiss":"Dismiss","action.end":"End","action.reset":"Reset","action.start":"Start","action.turn_off":"Turn off","cavity.left":"Left oven","cavity.lower":"Lower oven","cavity.right":"Right oven","cavity.single":"Oven","cavity.upper":"Upper oven","confirm.cancel_cycle":"Cancel the wash cycle?","confirm.start.left":"Start the left oven at {setting}?","confirm.start.lower":"Start the lower oven at {setting}?","confirm.start.right":"Start the right oven at {setting}?","confirm.start.single":"Start the oven at {setting}?","confirm.start.upper":"Start the upper oven at {setting}?","confirm.start_dishwasher":"Start {cycle} on the dishwasher?","confirm.stop.left":"Turn off the left oven?","confirm.stop.lower":"Turn off the lower oven?","confirm.stop.right":"Turn off the right oven?","confirm.stop.single":"Turn off the oven?","confirm.stop.upper":"Turn off the upper oven?","control.accent_light":"Accent light","control.air_filter":"Air filter","control.air_purification":"Air purification","control.appliance_type":"Appliance type","control.broil_level":"Broil level","control.cancel_cycle":"Current cycle","control.cancel_delay":"Ice delay schedule","control.clean_due":"Cleaning due","control.clean_stage":"Cleaning stage","control.control_lock":"Control lock","control.cook_mode":"Cooking mode","control.cook_timer":"Cooking timer","control.crisper_mode":"Crisper temperature","control.cycles_until_cleaning":"Ice cycles until cleaning","control.delay_left":"Delay ends in","control.delay_schedule":"Schedule","control.delay_start":"Delay start","control.delayed_shutoff":"Delayed shutoff","control.dishwasher_mode":"Mode","control.dispenser":"Internal water dispenser","control.door_open_delay":"Door open delay","control.duration":"Duration","control.end_delay":"Current delay","control.extended_dry_on":"Extended dry","control.failsafe":"Failsafe","control.fan":"Fan","control.fan_sensitivity":"Automatic fan sensitivity","control.fault":"Fault {code}","control.fault_code":"Code {code}","control.fault_unknown":"Fault","control.faults":"Active faults","control.filter_allowance":"Filter allowance","control.filter_usage":"Filter usage","control.gourmet":"Gourmet","control.halo":"Halo light","control.heated_dry_on":"Extra dry","control.high_temp_wash_on":"High temp wash","control.high_use_left":"High use ends in","control.humidity":"Humidity control","control.ice_maker":"Ice maker","control.key_tones":"Button tones","control.kitchen_timer":"Kitchen timer","control.kitchen_timer2":"Kitchen timer 2","control.light":"Light","control.max_ice_left":"Max ice ends in","control.model":"Model","control.next_cleaning":"Next cleaning","control.night_mode":"Night mode","control.operating_mode":"Mode","control.power":"Power","control.probe":"Probe","control.probe_target":"Probe target","control.remote_ready":"Remote Ready","control.remote_start":"Remote start","control.reset_air_filter":"Reset air filter","control.rinse_aid":"Rinse aid","control.sabbath":"Sabbath mode","control.sani_rinse_on":"Sani-rinse","control.schedule_delay":"New ice delay","control.service":"Service","control.shutoff_after":"Shut off after","control.softener":"Softener salt","control.starts_in":"Starts in","control.status":"Status","control.task_light":"Task light","control.temperature":"Temperature","control.time_left":"Time left","control.timer_finished":"Timer finished","control.top_rack_only_on":"Top rack only","control.uptime":"Uptime","control.wash_cycle":"Wash cycle","control.water_filter":"Water filter","control.water_filter_capacity":"Water filter capacity","control.wifi":"Wi-Fi signal","control.wine_temp_alert":"Temperature alert","control.winterized":"Winterized","ctl.at":"Start time","ctl.brightness":"Brightness","ctl.custom":"Custom","ctl.decrease":"Decrease","ctl.duration":"Duration","ctl.increase":"Increase","ctl.later":"Later today","ctl.minutes":"Minutes","ctl.more_info":"{name}: more information","ctl.not_now":"Not now","ctl.now":"Now","ctl.off":"Off","ctl.on":"On","ctl.repeat":"Repeat daily","ctl.saving":"Saving\u2026","ctl.schedule":"Schedule","ctl.set":"Set","ctl.speed":"Speed {n}","ctl.start":"Start","ctl.starts_in":"Starts in {time}","ctl.white":"White temperature","display.starts_at":"Starts {time}","event.air_filter_expired":"Air filter expired","event.cavity.cooking_timer_complete":"Cooking timer ended","event.cavity.cooking_timer_under_one_minute":"Cooking timer has one minute remaining","event.cavity.door_ajar":"Door open","event.cavity.preheated":"Preheat complete","event.cavity.probe_connected":"Probe in use","event.cavity.probe_target_reached":"Probe temperature reached","event.cavity.probe_within_ten_degrees":"Probe within 10\xB0F of target","event.cavity.self_clean_complete":"Clean complete","event.dishwasher_cancelled":"Wash cycle canceled","event.dishwasher_complete":"Wash cycle complete","event.dishwasher_paused":"Wash cycle interrupted","event.dishwasher_service_required":"Dishwasher service required","event.dishwasher_started":"Wash cycle started","event.fault_notification":"Appliance fault","event.feedback_notification":"Feedback request","event.freezer_door_ajar":"Freezer door open","event.freezer_setpoint_changed":"Freezer setpoint changed","event.ice_cleaning_add_descaler":"Ice maker clean cycle needs descaler","event.ice_cleaning_add_sanitizer":"Ice maker clean cycle needs sanitizer","event.ice_cleaning_cancelled":"Ice maker clean cycle canceled","event.ice_cleaning_complete":"Ice maker clean cycle complete","event.ice_cleaning_due_soon":"Ice maker clean cycle due soon","event.ice_cleaning_required":"Ice maker clean cycle due","event.ice_maker_door_ajar":"Ice maker door open","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"Kitchen timer 2 ended","event.kitchen_timer_2_under_one_minute":"Kitchen timer 2 has one minute remaining","event.kitchen_timer_complete":"Kitchen timer ended","event.kitchen_timer_under_one_minute":"Kitchen timer has one minute remaining","event.lower_oven_cooking_timer_complete":"Lower oven cooking timer ended","event.lower_oven_cooking_timer_under_one_minute":"Lower oven cooking timer has one minute remaining","event.lower_oven_door_ajar":"Lower oven door open","event.lower_oven_preheated":"Lower oven preheat complete","event.lower_oven_probe_connected":"Lower oven probe in use","event.lower_oven_probe_target_reached":"Lower oven probe temperature reached","event.lower_oven_probe_within_ten_degrees":"Lower oven probe within 10\xB0F of target","event.lower_oven_self_clean_complete":"Lower oven clean complete","event.oven_cooking_timer_complete":"Oven cooking timer ended","event.oven_cooking_timer_under_one_minute":"Oven cooking timer has one minute remaining","event.oven_door_ajar":"Oven door open","event.oven_preheated":"Oven preheat complete","event.oven_probe_connected":"Oven probe in use","event.oven_probe_target_reached":"Oven probe temperature reached","event.oven_probe_within_ten_degrees":"Oven probe within 10\xB0F of target","event.oven_self_clean_complete":"Oven clean complete","event.oven_service_required":"Oven service required","event.refrigerator_door_ajar":"Refrigerator door open","event.refrigerator_service_required":"Refrigerator service required","event.refrigerator_setpoint_changed":"Refrigerator setpoint changed","event.rinse_aid_low":"Rinse aid low","event.softener_salt_low":"Water softener salt low","event.unknown":"Unknown","event.water_filter_expired":"Water filter expired","event.wine_door_ajar":"Wine storage door open","event.wine_setpoint_changed":"Wine storage setpoint changed","event.wine_temperature_alert":"Wine storage temperature out of range","full.appearance":"Appearance","full.appliance":"Appliance","full.events_error":"Couldn't load the events: {error}","full.events_loading":"Loading events\u2026","full.events_more":"Show {days} days","full.failed":"That didn't work.","full.no_events":"No events in the last {days} days.","full.recent_events":"Recent events","full.refresh":"Refresh","full.refresh_hint":"Reads the appliance's state now.","full.refreshing":"Refreshing\u2026","info.air_filter":"Air filter","info.cleaning":"Cleaning","info.cycle":"Cycle","info.delay":"Ice delay","info.ends":"Ends","info.fan":"Fan","info.filter":"Filter","info.ice_maker":"Ice maker","info.light":"Light","info.mode":"Mode","info.model":"Model","info.next_cleaning":"Next cleaning","info.options":"Options","info.probe":"Probe","info.set_to":"Set to","info.starts":"Starts","info.status":"Status","info.water_filter":"Water filter","lock.cycle_no_delay":"This wash cycle doesn't offer delay start.","lock.cycle_no_option":"This wash cycle doesn't offer this option.","lock.delay_not_idle":"Delay start can change only while the dishwasher is idle or delayed.","lock.proof_light":"The oven light stays off during Proof.","lock.sabbath":"Sabbath mode is on. Turn it off to change this.","lock.self_clean":"The oven is self-cleaning. It can only be turned off.","lock.wash_not_idle":"Wash options can change only while the dishwasher is idle.","option.10_hours":"10 hours","option.10_minutes":"10 minutes","option.11_hours":"11 hours","option.12_hours":"12 hours","option.1_hour":"1 hour","option.1_minute":"1 minute","option.2_hours":"2 hours","option.2_minutes":"2 minutes","option.3_hours":"3 hours","option.4_hours":"4 hours","option.5_hours":"5 hours","option.5_minutes":"5 minutes","option.6_hours":"6 hours","option.7_hours":"7 hours","option.8_hours":"8 hours","option.9_hours":"9 hours","option.add_descaler":"Add descaler","option.add_sanitizer":"Add sanitizer","option.auto":"Auto","option.automatic":"Automatic","option.bake":"Bake","option.bake_stone":"Bake stone","option.broil":"Broil","option.canceling":"Canceling","option.child_lock":"Child lock","option.cleaning_complete":"Cleaning complete","option.cleaning_reset_flush":"Cleaning reset flush","option.cleaning_reset_rinse":"Cleaning reset rinse","option.convection":"Convection","option.convection_bake":"Convection bake","option.convection_broil":"Convection broil","option.convection_roast":"Convection roast","option.crystal_and_china":"Crystal and china","option.dehydrate":"Dehydrate","option.delayed":"Delayed","option.descale_clean":"Descale clean","option.descale_fill":"Descale fill","option.descale_flush":"Descale flush","option.descale_rinse":"Descale rinse","option.disabled":"Disabled","option.done":"Done","option.drying":"Drying","option.empty_bin":"Empty bin","option.enabled":"Enabled","option.energy":"Energy","option.enhanced":"Enhanced","option.error":"Error","option.extra_quiet":"Extra quiet","option.heavy":"Heavy","option.high":"High","option.high_use":"High use","option.idle":"Idle","option.light":"Light","option.long_vacation":"Long vacation","option.low":"Low","option.manual":"Manual","option.manually_clean":"Manually clean","option.max_ice":"Max ice","option.medium":"Medium","option.night_ice":"Night ice","option.none":"None","option.normal":"Normal","option.not_cleaning":"Not cleaning","option.off":"Off","option.on":"On","option.paused":"Paused","option.plastics":"Plastics","option.pots_and_pans":"Pots and pans","option.proof":"Proof","option.quick":"Quick","option.rinse_and_hold":"Rinse and hold","option.roast":"Roast","option.running":"Running","option.sabbath":"Sabbath","option.sanitize_clean":"Sanitize clean","option.sanitize_fill":"Sanitize fill","option.sanitize_flush":"Sanitize flush","option.sanitize_rinse":"Sanitize rinse","option.self_clean":"Self clean","option.short_vacation":"Short vacation","option.soak_and_scrub":"Soak and scrub","option.warm":"Warm","pill.cleaning":"Cleaning","pill.cleaning_due":"Cleaning due","pill.cooking":"Cooking","pill.delayed_shutoff":"Delayed shutoff","pill.door_open":"Door open","pill.door_open_for":"Door open \xB7 {time}","pill.fan":"Fan {speed}","pill.high_use":"High use","pill.light":"Light on","pill.making_ice":"Making ice","pill.normal":"Normal","pill.off":"Off","pill.offline":"Offline","pill.paused":"Paused","pill.preheated":"Preheated","pill.preheating":"Preheating {pct}%","pill.remote_ready":"Remote Ready","pill.sabbath":"Sabbath","pill.self_clean":"Self clean","pill.service":"Service","pill.temp_alert":"Temperature alert","pill.timer":"Timer {time}","pill.timer_done":"Timer done","pill.vacation":"Vacation","reason.choose_mode":"Choose a cooking mode first.","reason.close_door":"Close the door first.","reason.close_oven_door":"Close the oven door first.","reason.crisper_auto":"Set the crisper to Manual to change it.","reason.dishwasher_busy":"Can change only while the dishwasher is idle.","reason.manual_mode":"Start this mode at the oven.","reason.max_ice":"Turn off Max ice to change the freezer setpoint.","reason.mode_change_disabled":"The oven isn't taking mode changes right now.","reason.no_temperature":"This mode has no temperature to set.","reason.offline":"The appliance is offline.","reason.oven_not_ready":"Available while the oven is on or in Remote Ready.","reason.remote_ready_dishwasher":"Turn on Remote Ready at the dishwasher first.","reason.remote_ready_oven":"Turn on Remote Ready at the oven to start it from here.","reason.set_temperature":"Set the temperature first.","reason.start_at_oven":"Turn it on at the oven.","reason.unavailable":"Not available right now.","reason.use_start":"Use Start below to turn it on.","section.cleaning":"Cleaning","section.cycle":"Wash cycle","section.delayed_shutoff":"Delayed shutoff","section.details":"Details","section.fan_light":"Fan and light","section.filters":"Filters and maintenance","section.ice_delay":"Ice delay","section.ice_maker":"Ice maker","section.maintenance":"Maintenance","section.modes":"Modes","section.options":"Options","section.settings":"Settings","section.temperatures":"Temperatures","severity.critical":"Critical","severity.high":"High","severity.low":"Low","severity.medium":"Medium","severity.undefined":"Unspecified","severity.unknown":"Unknown","severity.urgent":"Urgent","unit.days":"{n} d","unit.days_hours":"{d} d {h} h","unit.hours":"{n} h","unit.hours_minutes":"{h} h {m} min","unit.minutes":"{n} min","value.alert":"Alert","value.daily_for":"Daily for {duration}","value.daily_from":"Daily from {time} for {duration}","value.done":"Done","value.door_open":"Door open","value.door_open_for":"Door open \xB7 {time}","value.due_now":"Now","value.due_soon":"Soon","value.ends_at":"Ends at {time}","value.from_for":"From {time} for {duration}","value.in_cycles":"In {n} cycles","value.inserted":"Inserted","value.low":"Low","value.missing":"Missing","value.no_faults":"None","value.none":"None","value.normal":"Normal","value.not_connected":"Not connected","value.not_due":"Not yet","value.not_needed":"Not needed","value.now":"Now {temp}","value.off":"Off","value.ok":"OK","value.on":"On","value.percent_used":"{pct}% used","value.probe_close":"Within 10\xB0F of the target","value.probe_done":"Target reached","value.replace":"Replace","value.required":"Required","value.speed":"Speed {speed}","value.under_minute":"Under a minute","value.until":"Until {time}","wifi.excellent":"Excellent","wifi.fair":"Fair","wifi.good":"Good","wifi.weak":"Weak","zone.crisp":"Crisper","zone.frz":"Freezer","zone.ref":"Refrigerator","zone.ref2":"Refrigerator drawer","zone.short.crisp":"Crisper","zone.short.frz":"Freezer","zone.short.ref":"Refrigerator","zone.short.ref2":"Drawer","zone.short.wine":"Wine","zone.short.wine_lower":"Lower","zone.short.wine_upper":"Upper","zone.wine":"Wine storage","zone.wine_lower":"Lower zone","zone.wine_upper":"Upper zone"};var Qs={"action.cancel_cycle":"Cancelar ciclo","action.cancel_schedule":"Cancelar","action.dismiss":"Descartar","action.end":"Finalizar","action.reset":"Restablecer","action.start":"Iniciar","action.turn_off":"Apagar","cavity.left":"Horno izquierdo","cavity.lower":"Horno inferior","cavity.right":"Horno derecho","cavity.single":"Horno","cavity.upper":"Horno superior","confirm.cancel_cycle":"\xBFCancelar el ciclo de lavado?","confirm.start.left":"\xBFIniciar el horno izquierdo en {setting}?","confirm.start.lower":"\xBFIniciar el horno inferior en {setting}?","confirm.start.right":"\xBFIniciar el horno derecho en {setting}?","confirm.start.single":"\xBFIniciar el horno en {setting}?","confirm.start.upper":"\xBFIniciar el horno superior en {setting}?","confirm.start_dishwasher":"\xBFIniciar {cycle} en el lavavajillas?","confirm.stop.left":"\xBFApagar el horno izquierdo?","confirm.stop.lower":"\xBFApagar el horno inferior?","confirm.stop.right":"\xBFApagar el horno derecho?","confirm.stop.single":"\xBFApagar el horno?","confirm.stop.upper":"\xBFApagar el horno superior?","control.accent_light":"Luz de acento","control.air_filter":"Filtro de aire","control.air_purification":"Purificaci\xF3n del aire","control.appliance_type":"Tipo de electrodom\xE9stico","control.broil_level":"Nivel de gratinado","control.cancel_cycle":"Ciclo en curso","control.cancel_delay":"Pausa de hielo programada","control.clean_due":"Limpieza pendiente","control.clean_stage":"Fase de limpieza","control.control_lock":"Bloqueo de controles","control.cook_mode":"Modo de cocci\xF3n","control.cook_timer":"Temporizador de cocci\xF3n","control.crisper_mode":"Temperatura del caj\xF3n de verduras","control.cycles_until_cleaning":"Ciclos de hielo hasta la limpieza","control.delay_left":"La pausa termina en","control.delay_schedule":"Programaci\xF3n","control.delay_start":"Inicio diferido","control.delayed_shutoff":"Apagado diferido","control.dishwasher_mode":"Modo","control.dispenser":"Dispensador de agua interior","control.door_open_delay":"Retardo de puerta abierta","control.duration":"Duraci\xF3n","control.end_delay":"Pausa actual","control.extended_dry_on":"Secado prolongado","control.failsafe":"Apagado de seguridad","control.fan":"Ventilador","control.fan_sensitivity":"Sensibilidad autom\xE1tica del ventilador","control.fault":"Aver\xEDa {code}","control.fault_code":"C\xF3digo {code}","control.fault_unknown":"Aver\xEDa","control.faults":"Aver\xEDas activas","control.filter_allowance":"Vida \xFAtil del filtro","control.filter_usage":"Uso del filtro","control.gourmet":"Programa gourmet","control.halo":"Luz halo","control.heated_dry_on":"Secado extra","control.high_temp_wash_on":"Lavado a alta temperatura","control.high_use_left":"El uso intensivo termina en","control.humidity":"Control de humedad","control.ice_maker":"M\xE1quina de hielo","control.key_tones":"Sonidos de botones","control.kitchen_timer":"Temporizador de cocina","control.kitchen_timer2":"Temporizador de cocina 2","control.light":"Luz","control.max_ice_left":"Hielo m\xE1ximo termina en","control.model":"Modelo","control.next_cleaning":"Pr\xF3xima limpieza","control.night_mode":"Modo nocturno","control.operating_mode":"Modo","control.power":"Encendido","control.probe":"Sonda","control.probe_target":"Objetivo de la sonda","control.remote_ready":"Remote Ready","control.remote_start":"Inicio remoto","control.reset_air_filter":"Restablecer el filtro de aire","control.rinse_aid":"Abrillantador","control.sabbath":"Modo sab\xE1tico","control.sani_rinse_on":"Aclarado higi\xE9nico","control.schedule_delay":"Nueva pausa de hielo","control.service":"Servicio t\xE9cnico","control.shutoff_after":"Apagar despu\xE9s de","control.softener":"Sal descalcificadora","control.starts_in":"Empieza en","control.status":"Estado","control.task_light":"Luz de trabajo","control.temperature":"Temperatura","control.time_left":"Tiempo restante","control.timer_finished":"Temporizador terminado","control.top_rack_only_on":"Solo cesta superior","control.uptime":"Tiempo en funcionamiento","control.wash_cycle":"Ciclo de lavado","control.water_filter":"Filtro de agua","control.water_filter_capacity":"Capacidad del filtro de agua","control.wifi":"Se\xF1al wifi","control.wine_temp_alert":"Alerta de temperatura","control.winterized":"Preparado para el invierno","ctl.at":"Hora de inicio","ctl.brightness":"Brillo","ctl.custom":"Personalizado","ctl.decrease":"Bajar","ctl.duration":"Duraci\xF3n","ctl.increase":"Subir","ctl.later":"M\xE1s tarde hoy","ctl.minutes":"Minutos","ctl.more_info":"{name}: m\xE1s informaci\xF3n","ctl.not_now":"Ahora no","ctl.now":"Ahora","ctl.off":"Apagado","ctl.on":"Encendido","ctl.repeat":"Repetir a diario","ctl.saving":"Guardando\u2026","ctl.schedule":"Programar","ctl.set":"Aplicar","ctl.speed":"Velocidad {n}","ctl.start":"Inicio","ctl.starts_in":"Empieza en {time}","ctl.white":"Tono de blanco","display.starts_at":"Empieza {time}","event.air_filter_expired":"Filtro de aire caducado","event.cavity.cooking_timer_complete":"Temporizador de cocci\xF3n finalizado","event.cavity.cooking_timer_under_one_minute":"Queda un minuto en el temporizador de cocci\xF3n","event.cavity.door_ajar":"Puerta abierta","event.cavity.preheated":"Precalentamiento completado","event.cavity.probe_connected":"Sonda en uso","event.cavity.probe_target_reached":"Temperatura de la sonda alcanzada","event.cavity.probe_within_ten_degrees":"Sonda a menos de 10 \xB0F del objetivo","event.cavity.self_clean_complete":"Limpieza completada","event.dishwasher_cancelled":"Ciclo de lavado cancelado","event.dishwasher_complete":"Ciclo de lavado completado","event.dishwasher_paused":"Ciclo de lavado interrumpido","event.dishwasher_service_required":"El lavavajillas necesita servicio t\xE9cnico","event.dishwasher_started":"Ciclo de lavado iniciado","event.fault_notification":"Fallo del electrodom\xE9stico","event.feedback_notification":"Solicitud de opini\xF3n","event.freezer_door_ajar":"Puerta del congelador abierta","event.freezer_setpoint_changed":"Temperatura objetivo del congelador cambiada","event.ice_cleaning_add_descaler":"El ciclo de limpieza de la m\xE1quina de hielo necesita desincrustante","event.ice_cleaning_add_sanitizer":"El ciclo de limpieza de la m\xE1quina de hielo necesita desinfectante","event.ice_cleaning_cancelled":"Ciclo de limpieza de la m\xE1quina de hielo cancelado","event.ice_cleaning_complete":"Ciclo de limpieza de la m\xE1quina de hielo completado","event.ice_cleaning_due_soon":"Ciclo de limpieza de la m\xE1quina de hielo pr\xF3ximo","event.ice_cleaning_required":"Ciclo de limpieza de la m\xE1quina de hielo pendiente","event.ice_maker_door_ajar":"Puerta de la m\xE1quina de hielo abierta","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"Temporizador de cocina 2 finalizado","event.kitchen_timer_2_under_one_minute":"Queda un minuto en el temporizador de cocina 2","event.kitchen_timer_complete":"Temporizador de cocina finalizado","event.kitchen_timer_under_one_minute":"Queda un minuto en el temporizador de cocina","event.lower_oven_cooking_timer_complete":"Temporizador de cocci\xF3n del horno inferior finalizado","event.lower_oven_cooking_timer_under_one_minute":"Queda un minuto en el temporizador de cocci\xF3n del horno inferior","event.lower_oven_door_ajar":"Puerta del horno inferior abierta","event.lower_oven_preheated":"Precalentamiento del horno inferior completado","event.lower_oven_probe_connected":"Sonda del horno inferior en uso","event.lower_oven_probe_target_reached":"Temperatura de la sonda del horno inferior alcanzada","event.lower_oven_probe_within_ten_degrees":"Sonda del horno inferior a menos de 10 \xB0F del objetivo","event.lower_oven_self_clean_complete":"Limpieza del horno inferior completada","event.oven_cooking_timer_complete":"Temporizador de cocci\xF3n del horno finalizado","event.oven_cooking_timer_under_one_minute":"Queda un minuto en el temporizador de cocci\xF3n del horno","event.oven_door_ajar":"Puerta del horno abierta","event.oven_preheated":"Precalentamiento del horno completado","event.oven_probe_connected":"Sonda del horno en uso","event.oven_probe_target_reached":"Temperatura de la sonda del horno alcanzada","event.oven_probe_within_ten_degrees":"Sonda del horno a menos de 10 \xB0F del objetivo","event.oven_self_clean_complete":"Limpieza del horno completada","event.oven_service_required":"El horno necesita servicio t\xE9cnico","event.refrigerator_door_ajar":"Puerta del frigor\xEDfico abierta","event.refrigerator_service_required":"El frigor\xEDfico necesita servicio t\xE9cnico","event.refrigerator_setpoint_changed":"Temperatura objetivo del frigor\xEDfico cambiada","event.rinse_aid_low":"Nivel bajo de abrillantador","event.softener_salt_low":"Nivel bajo de sal descalcificadora","event.unknown":"Desconocido","event.water_filter_expired":"Filtro de agua caducado","event.wine_door_ajar":"Puerta de la vinoteca abierta","event.wine_setpoint_changed":"Temperatura objetivo de la vinoteca cambiada","event.wine_temperature_alert":"Temperatura de la vinoteca fuera de rango","full.appearance":"Apariencia","full.appliance":"Electrodom\xE9stico","full.events_error":"No se pudieron cargar los eventos: {error}","full.events_loading":"Cargando eventos\u2026","full.events_more":"Mostrar {days} d\xEDas","full.failed":"No funcion\xF3.","full.no_events":"No hay eventos en los \xFAltimos {days} d\xEDas.","full.recent_events":"Eventos recientes","full.refresh":"Actualizar","full.refresh_hint":"Lee ahora el estado del electrodom\xE9stico.","full.refreshing":"Actualizando\u2026","info.air_filter":"Filtro de aire","info.cleaning":"Limpieza","info.cycle":"Ciclo","info.delay":"Pausa de hielo","info.ends":"Termina","info.fan":"Ventilador","info.filter":"Filtro","info.ice_maker":"M\xE1quina de hielo","info.light":"Luz","info.mode":"Modo","info.model":"Modelo","info.next_cleaning":"Pr\xF3xima limpieza","info.options":"Opciones","info.probe":"Sonda","info.set_to":"Ajustado a","info.starts":"Empieza","info.status":"Estado","info.water_filter":"Filtro de agua","lock.cycle_no_delay":"Este ciclo de lavado no ofrece inicio diferido.","lock.cycle_no_option":"Este ciclo de lavado no ofrece esta opci\xF3n.","lock.delay_not_idle":"El inicio diferido solo se puede cambiar con el lavavajillas en espera o diferido.","lock.proof_light":"La luz del horno se mantiene apagada durante la fermentaci\xF3n.","lock.sabbath":"El modo sab\xE1tico est\xE1 activado. Desact\xEDvalo para cambiar esto.","lock.self_clean":"El horno se est\xE1 autolimpiando. Solo se puede apagar.","lock.wash_not_idle":"Las opciones de lavado solo se pueden cambiar con el lavavajillas en espera.","option.10_hours":"10 horas","option.10_minutes":"10 minutos","option.11_hours":"11 horas","option.12_hours":"12 horas","option.1_hour":"1 hora","option.1_minute":"1 minuto","option.2_hours":"2 horas","option.2_minutes":"2 minutos","option.3_hours":"3 horas","option.4_hours":"4 horas","option.5_hours":"5 horas","option.5_minutes":"5 minutos","option.6_hours":"6 horas","option.7_hours":"7 horas","option.8_hours":"8 horas","option.9_hours":"9 horas","option.add_descaler":"A\xF1adir descalcificador","option.add_sanitizer":"A\xF1adir desinfectante","option.auto":"Autom\xE1tico","option.automatic":"Autom\xE1tico","option.bake":"Hornear","option.bake_stone":"Piedra para hornear","option.broil":"Gratinar","option.canceling":"Cancelando","option.child_lock":"Bloqueo infantil","option.cleaning_complete":"Limpieza completada","option.cleaning_reset_flush":"Reinicio de limpieza: vaciado","option.cleaning_reset_rinse":"Reinicio de limpieza: aclarado","option.convection":"Convecci\xF3n","option.convection_bake":"Hornear por convecci\xF3n","option.convection_broil":"Gratinar por convecci\xF3n","option.convection_roast":"Asar por convecci\xF3n","option.crystal_and_china":"Cristal y porcelana","option.dehydrate":"Deshidratar","option.delayed":"Diferido","option.descale_clean":"Descalcificaci\xF3n: limpieza","option.descale_fill":"Descalcificaci\xF3n: llenado","option.descale_flush":"Descalcificaci\xF3n: vaciado","option.descale_rinse":"Descalcificaci\xF3n: aclarado","option.disabled":"Desactivado","option.done":"Terminado","option.drying":"Secando","option.empty_bin":"Vaciar el dep\xF3sito","option.enabled":"Activado","option.energy":"Ahorro de energ\xEDa","option.enhanced":"Reforzado","option.error":"Aver\xEDa","option.extra_quiet":"Extrasilencioso","option.heavy":"Intensivo","option.high":"Alto","option.high_use":"Uso intensivo","option.idle":"En espera","option.light":"Ligero","option.long_vacation":"Vacaciones largas","option.low":"Bajo","option.manual":"Manual","option.manually_clean":"Limpiar a mano","option.max_ice":"Hielo m\xE1ximo","option.medium":"Medio","option.night_ice":"Hielo nocturno","option.none":"Ninguno","option.normal":"Normal","option.not_cleaning":"Sin limpieza","option.off":"Apagado","option.on":"Encendido","option.paused":"En pausa","option.plastics":"Pl\xE1sticos","option.pots_and_pans":"Ollas y sartenes","option.proof":"Fermentar","option.quick":"R\xE1pido","option.rinse_and_hold":"Aclarar y esperar","option.roast":"Asar","option.running":"En marcha","option.sabbath":"Sab\xE1tico","option.sanitize_clean":"Desinfecci\xF3n: limpieza","option.sanitize_fill":"Desinfecci\xF3n: llenado","option.sanitize_flush":"Desinfecci\xF3n: vaciado","option.sanitize_rinse":"Desinfecci\xF3n: aclarado","option.self_clean":"Autolimpieza","option.short_vacation":"Vacaciones cortas","option.soak_and_scrub":"Remojo y fregado","option.warm":"Mantener caliente","pill.cleaning":"Limpiando","pill.cleaning_due":"Limpieza pendiente","pill.cooking":"Cocinando","pill.delayed_shutoff":"Apagado diferido","pill.door_open":"Puerta abierta","pill.door_open_for":"Puerta abierta \xB7 {time}","pill.fan":"Ventilador {speed}","pill.high_use":"Uso intensivo","pill.light":"Luz encendida","pill.making_ice":"Haciendo hielo","pill.normal":"Normal","pill.off":"Apagado","pill.offline":"Sin conexi\xF3n","pill.paused":"En pausa","pill.preheated":"Precalentado","pill.preheating":"Precalentando {pct} %","pill.remote_ready":"Remote Ready","pill.sabbath":"Sab\xE1tico","pill.self_clean":"Autolimpieza","pill.service":"Servicio t\xE9cnico","pill.temp_alert":"Alerta de temperatura","pill.timer":"Temporizador {time}","pill.timer_done":"Temporizador terminado","pill.vacation":"Vacaciones","reason.choose_mode":"Elige primero un modo de cocci\xF3n.","reason.close_door":"Cierra primero la puerta.","reason.close_oven_door":"Cierra primero la puerta del horno.","reason.crisper_auto":"Pon el caj\xF3n de verduras en Manual para cambiarlo.","reason.dishwasher_busy":"Solo se puede cambiar con el lavavajillas en espera.","reason.manual_mode":"Inicia este modo en el horno.","reason.max_ice":"Desactiva Hielo m\xE1ximo para cambiar la temperatura del congelador.","reason.mode_change_disabled":"Ahora mismo el horno no acepta cambios de modo.","reason.no_temperature":"Este modo no tiene temperatura que ajustar.","reason.offline":"El electrodom\xE9stico est\xE1 sin conexi\xF3n.","reason.oven_not_ready":"Disponible con el horno encendido o en Remote Ready.","reason.remote_ready_dishwasher":"Activa primero Remote Ready en el lavavajillas.","reason.remote_ready_oven":"Activa Remote Ready en el horno para iniciarlo desde aqu\xED.","reason.set_temperature":"Ajusta primero la temperatura.","reason.start_at_oven":"Enci\xE9ndelo en el horno.","reason.unavailable":"No disponible ahora mismo.","reason.use_start":"Usa Iniciar, abajo, para encenderlo.","section.cleaning":"Limpieza","section.cycle":"Ciclo de lavado","section.delayed_shutoff":"Apagado diferido","section.details":"Detalles","section.fan_light":"Ventilador y luz","section.filters":"Filtros y mantenimiento","section.ice_delay":"Pausa de hielo","section.ice_maker":"M\xE1quina de hielo","section.maintenance":"Mantenimiento","section.modes":"Modos","section.options":"Opciones","section.settings":"Ajustes","section.temperatures":"Temperaturas","severity.critical":"Cr\xEDtica","severity.high":"Alta","severity.low":"Baja","severity.medium":"Media","severity.undefined":"Sin especificar","severity.unknown":"Desconocida","severity.urgent":"Urgente","unit.days":"{n} d","unit.days_hours":"{d} d {h} h","unit.hours":"{n} h","unit.hours_minutes":"{h} h {m} min","unit.minutes":"{n} min","value.alert":"Alerta","value.daily_for":"A diario durante {duration}","value.daily_from":"A diario desde {time} durante {duration}","value.done":"Listo","value.door_open":"Puerta abierta","value.door_open_for":"Puerta abierta \xB7 {time}","value.due_now":"Ya","value.due_soon":"Pronto","value.ends_at":"Termina {time}","value.from_for":"Desde {time} durante {duration}","value.in_cycles":"En {n} ciclos","value.inserted":"Colocado","value.low":"Bajo","value.missing":"Falta","value.no_faults":"Ninguna","value.none":"Ninguna","value.normal":"Normal","value.not_connected":"No conectada","value.not_due":"Todav\xEDa no","value.not_needed":"No es necesario","value.now":"Ahora {temp}","value.off":"Apagado","value.ok":"Bien","value.on":"Encendido","value.percent_used":"{pct} % usado","value.probe_close":"A menos de 10 \xB0F del objetivo","value.probe_done":"Objetivo alcanzado","value.replace":"Cambiar","value.required":"Necesario","value.speed":"Velocidad {speed}","value.under_minute":"Menos de un minuto","value.until":"Hasta {time}","wifi.excellent":"Excelente","wifi.fair":"Aceptable","wifi.good":"Buena","wifi.weak":"D\xE9bil","zone.crisp":"Caj\xF3n de verduras","zone.frz":"Congelador","zone.ref":"Frigor\xEDfico","zone.ref2":"Caj\xF3n refrigerador","zone.short.crisp":"Verduras","zone.short.frz":"Congelador","zone.short.ref":"Frigor\xEDfico","zone.short.ref2":"Caj\xF3n","zone.short.wine":"Vino","zone.short.wine_lower":"Inferior","zone.short.wine_upper":"Superior","zone.wine":"Vinoteca","zone.wine_lower":"Zona inferior","zone.wine_upper":"Zona superior"};var Js={"action.cancel_cycle":"Annuler le cycle","action.cancel_schedule":"Annuler","action.dismiss":"Acquitter","action.end":"Terminer","action.reset":"R\xE9initialiser","action.start":"D\xE9marrer","action.turn_off":"\xC9teindre","cavity.left":"Four gauche","cavity.lower":"Four inf\xE9rieur","cavity.right":"Four droit","cavity.single":"Four","cavity.upper":"Four sup\xE9rieur","confirm.cancel_cycle":"Annuler le cycle de lavage\xA0?","confirm.start.left":"D\xE9marrer le four gauche en {setting}\xA0?","confirm.start.lower":"D\xE9marrer le four inf\xE9rieur en {setting}\xA0?","confirm.start.right":"D\xE9marrer le four droit en {setting}\xA0?","confirm.start.single":"D\xE9marrer le four en {setting}\xA0?","confirm.start.upper":"D\xE9marrer le four sup\xE9rieur en {setting}\xA0?","confirm.start_dishwasher":"D\xE9marrer {cycle} sur le lave-vaisselle\xA0?","confirm.stop.left":"\xC9teindre le four gauche ?","confirm.stop.lower":"\xC9teindre le four inf\xE9rieur ?","confirm.stop.right":"\xC9teindre le four droit ?","confirm.stop.single":"\xC9teindre le four ?","confirm.stop.upper":"\xC9teindre le four sup\xE9rieur ?","control.accent_light":"\xC9clairage d'ambiance","control.air_filter":"Filtre \xE0 air","control.air_purification":"Purification de l'air","control.appliance_type":"Type d'appareil","control.broil_level":"Niveau du gril","control.cancel_cycle":"Cycle en cours","control.cancel_delay":"Pause programm\xE9e","control.clean_due":"Nettoyage \xE0 pr\xE9voir","control.clean_stage":"\xC9tape de nettoyage","control.control_lock":"Verrouillage des commandes","control.cook_mode":"Mode de cuisson","control.cook_timer":"Minuterie de cuisson","control.crisper_mode":"Temp\xE9rature du bac \xE0 l\xE9gumes","control.cycles_until_cleaning":"Cycles de glace avant nettoyage","control.delay_left":"La pause se termine dans","control.delay_schedule":"Programmation","control.delay_start":"D\xE9part diff\xE9r\xE9","control.delayed_shutoff":"Arr\xEAt diff\xE9r\xE9","control.dishwasher_mode":"Mode","control.dispenser":"Distributeur d'eau int\xE9rieur","control.door_open_delay":"D\xE9lai d'alerte de porte ouverte","control.duration":"Dur\xE9e","control.end_delay":"Pause en cours","control.extended_dry_on":"S\xE9chage prolong\xE9","control.failsafe":"Arr\xEAt de s\xE9curit\xE9","control.fan":"Ventilateur","control.fan_sensitivity":"Sensibilit\xE9 automatique du ventilateur","control.fault":"D\xE9faut {code}","control.fault_code":"Code {code}","control.fault_unknown":"D\xE9faut","control.faults":"D\xE9fauts actifs","control.filter_allowance":"Dur\xE9e de vie du filtre","control.filter_usage":"Utilisation du filtre","control.gourmet":"Programme gourmet","control.halo":"\xC9clairage halo","control.heated_dry_on":"S\xE9chage renforc\xE9","control.high_temp_wash_on":"Lavage haute temp\xE9rature","control.high_use_left":"L'utilisation intensive se termine dans","control.humidity":"Contr\xF4le de l'humidit\xE9","control.ice_maker":"Machine \xE0 gla\xE7ons","control.key_tones":"Sons des touches","control.kitchen_timer":"Minuteur de cuisine","control.kitchen_timer2":"Minuteur de cuisine 2","control.light":"\xC9clairage","control.max_ice_left":"Glace max se termine dans","control.model":"Mod\xE8le","control.next_cleaning":"Prochain nettoyage","control.night_mode":"Mode nuit","control.operating_mode":"Mode","control.power":"Marche","control.probe":"Sonde","control.probe_target":"Cible de la sonde","control.remote_ready":"Remote Ready","control.remote_start":"D\xE9marrage \xE0 distance","control.reset_air_filter":"R\xE9initialiser le filtre \xE0 air","control.rinse_aid":"Liquide de rin\xE7age","control.sabbath":"Mode sabbat","control.sani_rinse_on":"Rin\xE7age sanitaire","control.schedule_delay":"Nouvelle pause","control.service":"Entretien","control.shutoff_after":"Arr\xEAt apr\xE8s","control.softener":"Sel r\xE9g\xE9n\xE9rant","control.starts_in":"D\xE9marre dans","control.status":"\xC9tat","control.task_light":"\xC9clairage de travail","control.temperature":"Temp\xE9rature","control.time_left":"Temps restant","control.timer_finished":"Minuteur termin\xE9","control.top_rack_only_on":"Panier sup\xE9rieur seul","control.uptime":"Temps de fonctionnement","control.wash_cycle":"Programme de lavage","control.water_filter":"Filtre \xE0 eau","control.water_filter_capacity":"Capacit\xE9 du filtre \xE0 eau","control.wifi":"Signal Wi-Fi","control.wine_temp_alert":"Alerte de temp\xE9rature","control.winterized":"Hivernage","ctl.at":"Heure de d\xE9but","ctl.brightness":"Luminosit\xE9","ctl.custom":"Autre","ctl.decrease":"Diminuer","ctl.duration":"Dur\xE9e","ctl.increase":"Augmenter","ctl.later":"Plus tard aujourd'hui","ctl.minutes":"Nombre de minutes","ctl.more_info":"{name} : plus d'informations","ctl.not_now":"Pas maintenant","ctl.now":"Maintenant","ctl.off":"Arr\xEAt","ctl.on":"Marche","ctl.repeat":"R\xE9p\xE9ter chaque jour","ctl.saving":"Enregistrement\u2026","ctl.schedule":"Programmer","ctl.set":"Valider","ctl.speed":"Vitesse {n}","ctl.start":"D\xE9but","ctl.starts_in":"D\xE9marre dans {time}","ctl.white":"Temp\xE9rature de blanc","display.starts_at":"D\xE9part {time}","event.air_filter_expired":"Filtre \xE0 air expir\xE9","event.cavity.cooking_timer_complete":"Minuteur de cuisson termin\xE9","event.cavity.cooking_timer_under_one_minute":"Il reste une minute au minuteur de cuisson","event.cavity.door_ajar":"Porte ouverte","event.cavity.preheated":"Pr\xE9chauffage termin\xE9","event.cavity.probe_connected":"Sonde en cours d'utilisation","event.cavity.probe_target_reached":"Temp\xE9rature de la sonde atteinte","event.cavity.probe_within_ten_degrees":"Sonde \xE0 moins de 10 \xB0F de la cible","event.cavity.self_clean_complete":"Nettoyage termin\xE9","event.dishwasher_cancelled":"Cycle de lavage annul\xE9","event.dishwasher_complete":"Cycle de lavage termin\xE9","event.dishwasher_paused":"Cycle de lavage interrompu","event.dishwasher_service_required":"Entretien du lave-vaisselle requis","event.dishwasher_started":"Cycle de lavage d\xE9marr\xE9","event.fault_notification":"D\xE9faut de l'appareil","event.feedback_notification":"Demande d'avis","event.freezer_door_ajar":"Porte du cong\xE9lateur ouverte","event.freezer_setpoint_changed":"Consigne du cong\xE9lateur modifi\xE9e","event.ice_cleaning_add_descaler":"Le cycle de nettoyage de la machine \xE0 gla\xE7ons n\xE9cessite du d\xE9tartrant","event.ice_cleaning_add_sanitizer":"Le cycle de nettoyage de la machine \xE0 gla\xE7ons n\xE9cessite du d\xE9sinfectant","event.ice_cleaning_cancelled":"Cycle de nettoyage de la machine \xE0 gla\xE7ons annul\xE9","event.ice_cleaning_complete":"Cycle de nettoyage de la machine \xE0 gla\xE7ons termin\xE9","event.ice_cleaning_due_soon":"Cycle de nettoyage de la machine \xE0 gla\xE7ons bient\xF4t requis","event.ice_cleaning_required":"Cycle de nettoyage de la machine \xE0 gla\xE7ons requis","event.ice_maker_door_ajar":"Porte de la machine \xE0 gla\xE7ons ouverte","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"Minuteur de cuisine 2 termin\xE9","event.kitchen_timer_2_under_one_minute":"Il reste une minute au minuteur de cuisine 2","event.kitchen_timer_complete":"Minuteur de cuisine termin\xE9","event.kitchen_timer_under_one_minute":"Il reste une minute au minuteur de cuisine","event.lower_oven_cooking_timer_complete":"Minuteur de cuisson du four inf\xE9rieur termin\xE9","event.lower_oven_cooking_timer_under_one_minute":"Il reste une minute au minuteur de cuisson du four inf\xE9rieur","event.lower_oven_door_ajar":"Porte du four inf\xE9rieur ouverte","event.lower_oven_preheated":"Pr\xE9chauffage du four inf\xE9rieur termin\xE9","event.lower_oven_probe_connected":"Sonde du four inf\xE9rieur en cours d'utilisation","event.lower_oven_probe_target_reached":"Temp\xE9rature de la sonde du four inf\xE9rieur atteinte","event.lower_oven_probe_within_ten_degrees":"Sonde du four inf\xE9rieur \xE0 moins de 10 \xB0F de la cible","event.lower_oven_self_clean_complete":"Nettoyage du four inf\xE9rieur termin\xE9","event.oven_cooking_timer_complete":"Minuteur de cuisson du four termin\xE9","event.oven_cooking_timer_under_one_minute":"Il reste une minute au minuteur de cuisson du four","event.oven_door_ajar":"Porte du four ouverte","event.oven_preheated":"Pr\xE9chauffage du four termin\xE9","event.oven_probe_connected":"Sonde du four en cours d'utilisation","event.oven_probe_target_reached":"Temp\xE9rature de la sonde du four atteinte","event.oven_probe_within_ten_degrees":"Sonde du four \xE0 moins de 10 \xB0F de la cible","event.oven_self_clean_complete":"Nettoyage du four termin\xE9","event.oven_service_required":"Entretien du four requis","event.refrigerator_door_ajar":"Porte du r\xE9frig\xE9rateur ouverte","event.refrigerator_service_required":"Entretien du r\xE9frig\xE9rateur requis","event.refrigerator_setpoint_changed":"Consigne du r\xE9frig\xE9rateur modifi\xE9e","event.rinse_aid_low":"Niveau de liquide de rin\xE7age bas","event.softener_salt_low":"Niveau de sel r\xE9g\xE9n\xE9rant bas","event.unknown":"Inconnu","event.water_filter_expired":"Filtre \xE0 eau expir\xE9","event.wine_door_ajar":"Porte de la cave \xE0 vin ouverte","event.wine_setpoint_changed":"Consigne de la cave \xE0 vin modifi\xE9e","event.wine_temperature_alert":"Temp\xE9rature de la cave \xE0 vin hors plage","full.appearance":"Apparence","full.appliance":"Appareil","full.events_error":"Impossible de charger les \xE9v\xE9nements\xA0: {error}","full.events_loading":"Chargement des \xE9v\xE9nements\u2026","full.events_more":"Afficher {days} jours","full.failed":"Cela n'a pas fonctionn\xE9.","full.no_events":"Aucun \xE9v\xE9nement ces {days} derniers jours.","full.recent_events":"\xC9v\xE9nements r\xE9cents","full.refresh":"Actualiser","full.refresh_hint":"Lit maintenant l'\xE9tat de l'appareil.","full.refreshing":"Actualisation\u2026","info.air_filter":"Filtre \xE0 air","info.cleaning":"Nettoyage","info.cycle":"Programme","info.delay":"Pause","info.ends":"Fin","info.fan":"Ventilateur","info.filter":"Filtre","info.ice_maker":"Machine \xE0 gla\xE7ons","info.light":"\xC9clairage","info.mode":"Mode","info.model":"Mod\xE8le","info.next_cleaning":"Prochain nettoyage","info.options":"Options","info.probe":"Sonde","info.set_to":"R\xE9gl\xE9 sur","info.starts":"D\xE9part","info.status":"\xC9tat","info.water_filter":"Filtre \xE0 eau","lock.cycle_no_delay":"Ce programme de lavage ne propose pas le d\xE9part diff\xE9r\xE9.","lock.cycle_no_option":"Ce programme de lavage ne propose pas cette option.","lock.delay_not_idle":"Le d\xE9part diff\xE9r\xE9 ne peut \xEAtre modifi\xE9 que lorsque le lave-vaisselle est \xE0 l'arr\xEAt ou en attente.","lock.proof_light":"L'\xE9clairage du four reste \xE9teint pendant la fermentation.","lock.sabbath":"Le mode sabbat est activ\xE9. D\xE9sactivez-le pour modifier ce r\xE9glage.","lock.self_clean":"Le four est en autonettoyage. Il peut seulement \xEAtre \xE9teint.","lock.wash_not_idle":"Les options de lavage ne peuvent \xEAtre modifi\xE9es que lorsque le lave-vaisselle est \xE0 l'arr\xEAt.","option.10_hours":"10 heures","option.10_minutes":"10 min","option.11_hours":"11 heures","option.12_hours":"12 heures","option.1_hour":"1 heure","option.1_minute":"1 min","option.2_hours":"2 heures","option.2_minutes":"2 min","option.3_hours":"3 heures","option.4_hours":"4 heures","option.5_hours":"5 heures","option.5_minutes":"5 min","option.6_hours":"6 heures","option.7_hours":"7 heures","option.8_hours":"8 heures","option.9_hours":"9 heures","option.add_descaler":"Ajouter du d\xE9tartrant","option.add_sanitizer":"Ajouter du d\xE9sinfectant","option.auto":"Automatique","option.automatic":"Automatique","option.bake":"Cuisson","option.bake_stone":"Pierre \xE0 pain","option.broil":"Gril","option.canceling":"Annulation","option.child_lock":"S\xE9curit\xE9 enfants","option.cleaning_complete":"Nettoyage termin\xE9","option.cleaning_reset_flush":"R\xE9initialisation du nettoyage\xA0: vidange","option.cleaning_reset_rinse":"R\xE9initialisation du nettoyage\xA0: rin\xE7age","option.convection":"Chaleur tournante","option.convection_bake":"Cuisson \xE0 convection","option.convection_broil":"Gril \xE0 convection","option.convection_roast":"R\xF4tissage \xE0 convection","option.crystal_and_china":"Cristal et porcelaine","option.dehydrate":"D\xE9shydratation","option.delayed":"Diff\xE9r\xE9","option.descale_clean":"D\xE9tartrage\xA0: nettoyage","option.descale_fill":"D\xE9tartrage\xA0: remplissage","option.descale_flush":"D\xE9tartrage\xA0: vidange","option.descale_rinse":"D\xE9tartrage\xA0: rin\xE7age","option.disabled":"D\xE9sactiv\xE9","option.done":"Termin\xE9","option.drying":"S\xE9chage","option.empty_bin":"Vider le bac","option.enabled":"Activ\xE9","option.energy":"\xC9co","option.enhanced":"Renforc\xE9","option.error":"Erreur","option.extra_quiet":"Extra silencieux","option.heavy":"Intensif","option.high":"\xC9lev\xE9","option.high_use":"Utilisation intensive","option.idle":"\xC0 l'arr\xEAt","option.light":"L\xE9ger","option.long_vacation":"Vacances longues","option.low":"Faible","option.manual":"Manuel","option.manually_clean":"Nettoyer \xE0 la main","option.max_ice":"Glace max","option.medium":"Moyen","option.night_ice":"Glace de nuit","option.none":"Aucun","option.normal":"Normal","option.not_cleaning":"Pas de nettoyage","option.off":"Arr\xEAt","option.on":"Marche","option.paused":"En pause","option.plastics":"Plastiques","option.pots_and_pans":"Casseroles et po\xEAles","option.proof":"Fermentation","option.quick":"Rapide","option.rinse_and_hold":"Rin\xE7age d'attente","option.roast":"R\xF4tissage","option.running":"En marche","option.sabbath":"Sabbat","option.sanitize_clean":"D\xE9sinfection\xA0: nettoyage","option.sanitize_fill":"D\xE9sinfection\xA0: remplissage","option.sanitize_flush":"D\xE9sinfection\xA0: vidange","option.sanitize_rinse":"D\xE9sinfection\xA0: rin\xE7age","option.self_clean":"Autonettoyage","option.short_vacation":"Vacances courtes","option.soak_and_scrub":"Trempage et r\xE9curage","option.warm":"Maintien au chaud","pill.cleaning":"Nettoyage","pill.cleaning_due":"Nettoyage \xE0 pr\xE9voir","pill.cooking":"Cuisson","pill.delayed_shutoff":"Arr\xEAt diff\xE9r\xE9","pill.door_open":"Porte ouverte","pill.door_open_for":"Porte ouverte \xB7 {time}","pill.fan":"Ventilateur {speed}","pill.high_use":"Utilisation intensive","pill.light":"\xC9clairage allum\xE9","pill.making_ice":"Fabrique de la glace","pill.normal":"Normal","pill.off":"Arr\xEAt","pill.offline":"Hors ligne","pill.paused":"En pause","pill.preheated":"Pr\xE9chauff\xE9","pill.preheating":"Pr\xE9chauffage {pct}\xA0%","pill.remote_ready":"Remote Ready","pill.sabbath":"Sabbat","pill.self_clean":"Autonettoyage","pill.service":"Entretien requis","pill.temp_alert":"Alerte de temp\xE9rature","pill.timer":"Minuteur {time}","pill.timer_done":"Minuteur termin\xE9","pill.vacation":"Vacances","reason.choose_mode":"Choisissez d'abord un mode de cuisson.","reason.close_door":"Fermez d'abord la porte.","reason.close_oven_door":"Fermez d'abord la porte du four.","reason.crisper_auto":"Passez le bac \xE0 l\xE9gumes en Manuel pour le modifier.","reason.dishwasher_busy":"Modifiable uniquement lorsque le lave-vaisselle est \xE0 l'arr\xEAt.","reason.manual_mode":"D\xE9marrez ce mode sur le four.","reason.max_ice":"D\xE9sactivez Glace max pour modifier la temp\xE9rature du cong\xE9lateur.","reason.mode_change_disabled":"Le four n'accepte pas de changement de mode pour le moment.","reason.no_temperature":"Ce mode n'a pas de temp\xE9rature \xE0 r\xE9gler.","reason.offline":"L'appareil est hors ligne.","reason.oven_not_ready":"Disponible lorsque le four est allum\xE9 ou en Remote Ready.","reason.remote_ready_dishwasher":"Activez d'abord Remote Ready sur le lave-vaisselle.","reason.remote_ready_oven":"Activez Remote Ready sur le four pour le d\xE9marrer d'ici.","reason.set_temperature":"R\xE9glez d'abord la temp\xE9rature.","reason.start_at_oven":"Allumez-le sur le four.","reason.unavailable":"Indisponible pour le moment.","reason.use_start":"Utilisez D\xE9marrer ci-dessous pour l'allumer.","section.cleaning":"Nettoyage","section.cycle":"Cycle de lavage","section.delayed_shutoff":"Arr\xEAt diff\xE9r\xE9","section.details":"D\xE9tails","section.fan_light":"Ventilateur et \xE9clairage","section.filters":"Filtres et entretien","section.ice_delay":"Pause de la machine \xE0 gla\xE7ons","section.ice_maker":"Machine \xE0 gla\xE7ons","section.maintenance":"Entretien","section.modes":"Modes","section.options":"Options","section.settings":"R\xE9glages","section.temperatures":"Temp\xE9ratures","severity.critical":"Critique","severity.high":"\xC9lev\xE9e","severity.low":"Faible","severity.medium":"Moyenne","severity.undefined":"Non pr\xE9cis\xE9e","severity.unknown":"Inconnue","severity.urgent":"Urgente","unit.days":"{n} j","unit.days_hours":"{d} j {h} h","unit.hours":"{n} h","unit.hours_minutes":"{h} h {m} min","unit.minutes":"{n} min","value.alert":"Alerte","value.daily_for":"Chaque jour pendant {duration}","value.daily_from":"Chaque jour d\xE8s {time} pendant {duration}","value.done":"Termin\xE9","value.door_open":"Porte ouverte","value.door_open_for":"Porte ouverte \xB7 {time}","value.due_now":"Maintenant","value.due_soon":"Bient\xF4t","value.ends_at":"Se termine \xE0 {time}","value.from_for":"D\xE8s {time} pendant {duration}","value.in_cycles":"Dans {n} cycles","value.inserted":"En place","value.low":"Bas","value.missing":"Absent","value.no_faults":"Aucun","value.none":"Aucune","value.normal":"Normale","value.not_connected":"Non branch\xE9e","value.not_due":"Pas encore","value.not_needed":"Pas n\xE9cessaire","value.now":"Actuellement {temp}","value.off":"Arr\xEAt","value.ok":"Correct","value.on":"Marche","value.percent_used":"{pct}\xA0% utilis\xE9","value.probe_close":"\xC0 moins de 10 \xB0F de la cible","value.probe_done":"Cible atteinte","value.replace":"\xC0 remplacer","value.required":"N\xE9cessaire","value.speed":"Vitesse {speed}","value.under_minute":"Moins d'une minute","value.until":"Jusqu'\xE0 {time}","wifi.excellent":"Excellent","wifi.fair":"Moyen","wifi.good":"Bon","wifi.weak":"Faible","zone.crisp":"Bac \xE0 l\xE9gumes","zone.frz":"Cong\xE9lateur","zone.ref":"R\xE9frig\xE9rateur","zone.ref2":"Tiroir r\xE9frig\xE9r\xE9","zone.short.crisp":"L\xE9gumes","zone.short.frz":"Cong\xE9lateur","zone.short.ref":"R\xE9frig\xE9rateur","zone.short.ref2":"Tiroir","zone.short.wine":"Vin","zone.short.wine_lower":"Bas","zone.short.wine_upper":"Haut","zone.wine":"Cave \xE0 vin","zone.wine_lower":"Zone inf\xE9rieure","zone.wine_upper":"Zone sup\xE9rieure"};var el={"action.cancel_cycle":"Annulla ciclo","action.cancel_schedule":"Annulla","action.dismiss":"Conferma","action.end":"Termina","action.reset":"Azzera","action.start":"Avvia","action.turn_off":"Spegni","cavity.left":"Forno sinistro","cavity.lower":"Forno inferiore","cavity.right":"Forno destro","cavity.single":"Forno","cavity.upper":"Forno superiore","confirm.cancel_cycle":"Annullare il ciclo di lavaggio?","confirm.start.left":"Avviare il forno sinistro in {setting}?","confirm.start.lower":"Avviare il forno inferiore in {setting}?","confirm.start.right":"Avviare il forno destro in {setting}?","confirm.start.single":"Avviare il forno in {setting}?","confirm.start.upper":"Avviare il forno superiore in {setting}?","confirm.start_dishwasher":"Avviare {cycle} sulla lavastoviglie?","confirm.stop.left":"Spegnere il forno sinistro?","confirm.stop.lower":"Spegnere il forno inferiore?","confirm.stop.right":"Spegnere il forno destro?","confirm.stop.single":"Spegnere il forno?","confirm.stop.upper":"Spegnere il forno superiore?","control.accent_light":"Luce d'accento","control.air_filter":"Filtro dell'aria","control.air_purification":"Purificazione dell'aria","control.appliance_type":"Tipo di elettrodomestico","control.broil_level":"Livello grill","control.cancel_cycle":"Ciclo in corso","control.cancel_delay":"Pausa programmata","control.clean_due":"Pulizia da fare","control.clean_stage":"Fase di pulizia","control.control_lock":"Blocco comandi","control.cook_mode":"Modalit\xE0 di cottura","control.cook_timer":"Timer di cottura","control.crisper_mode":"Temperatura del cassetto verdure","control.cycles_until_cleaning":"Cicli di ghiaccio prima della pulizia","control.delay_left":"La pausa termina tra","control.delay_schedule":"Programmazione","control.delay_start":"Partenza ritardata","control.delayed_shutoff":"Spegnimento ritardato","control.dishwasher_mode":"Modalit\xE0","control.dispenser":"Erogatore d'acqua interno","control.door_open_delay":"Ritardo allarme porta aperta","control.duration":"Durata","control.end_delay":"Pausa in corso","control.extended_dry_on":"Asciugatura prolungata","control.failsafe":"Arresto di sicurezza","control.fan":"Ventola","control.fan_sensitivity":"Sensibilit\xE0 automatica della ventola","control.fault":"Guasto {code}","control.fault_code":"Codice {code}","control.fault_unknown":"Guasto","control.faults":"Guasti attivi","control.filter_allowance":"Durata del filtro","control.filter_usage":"Uso del filtro","control.gourmet":"Programma gourmet","control.halo":"Luce halo","control.heated_dry_on":"Asciugatura extra","control.high_temp_wash_on":"Lavaggio ad alta temperatura","control.high_use_left":"L'uso intenso termina tra","control.humidity":"Controllo dell'umidit\xE0","control.ice_maker":"Fabbricatore di ghiaccio","control.key_tones":"Toni dei tasti","control.kitchen_timer":"Timer da cucina","control.kitchen_timer2":"Timer da cucina 2","control.light":"Luce","control.max_ice_left":"Ghiaccio max termina tra","control.model":"Modello","control.next_cleaning":"Prossima pulizia","control.night_mode":"Modalit\xE0 notte","control.operating_mode":"Modalit\xE0","control.power":"Accensione","control.probe":"Sonda","control.probe_target":"Obiettivo della sonda","control.remote_ready":"Remote Ready","control.remote_start":"Avvio remoto","control.reset_air_filter":"Azzera filtro dell'aria","control.rinse_aid":"Brillantante","control.sabbath":"Modalit\xE0 Sabbath","control.sani_rinse_on":"Risciacquo igienizzante","control.schedule_delay":"Nuova pausa","control.service":"Assistenza","control.shutoff_after":"Spegni dopo","control.softener":"Sale addolcitore","control.starts_in":"Inizia tra","control.status":"Stato","control.task_light":"Luce di lavoro","control.temperature":"Temperatura","control.time_left":"Tempo rimanente","control.timer_finished":"Timer terminato","control.top_rack_only_on":"Solo cestello superiore","control.uptime":"Tempo di attivit\xE0","control.wash_cycle":"Programma di lavaggio","control.water_filter":"Filtro dell'acqua","control.water_filter_capacity":"Capacit\xE0 del filtro dell'acqua","control.wifi":"Segnale Wi-Fi","control.wine_temp_alert":"Avviso di temperatura","control.winterized":"Predisposto per l'inverno","ctl.at":"Ora di inizio","ctl.brightness":"Luminosit\xE0","ctl.custom":"Personalizzato","ctl.decrease":"Diminuisci","ctl.duration":"Durata","ctl.increase":"Aumenta","ctl.later":"Pi\xF9 tardi oggi","ctl.minutes":"Minuti","ctl.more_info":"{name}: maggiori informazioni","ctl.not_now":"Non ora","ctl.now":"Ora","ctl.off":"Spento","ctl.on":"Acceso","ctl.repeat":"Ripeti ogni giorno","ctl.saving":"Salvataggio\u2026","ctl.schedule":"Programma","ctl.set":"Imposta","ctl.speed":"Velocit\xE0 {n}","ctl.start":"Inizio","ctl.starts_in":"Inizia tra {time}","ctl.white":"Tonalit\xE0 del bianco","display.starts_at":"Inizio {time}","event.air_filter_expired":"Filtro dell'aria scaduto","event.cavity.cooking_timer_complete":"Timer di cottura terminato","event.cavity.cooking_timer_under_one_minute":"Al timer di cottura manca un minuto","event.cavity.door_ajar":"Porta aperta","event.cavity.preheated":"Preriscaldamento completato","event.cavity.probe_connected":"Sonda in uso","event.cavity.probe_target_reached":"Temperatura della sonda raggiunta","event.cavity.probe_within_ten_degrees":"Sonda a meno di 10 \xB0F dall'obiettivo","event.cavity.self_clean_complete":"Pulizia completata","event.dishwasher_cancelled":"Ciclo di lavaggio annullato","event.dishwasher_complete":"Ciclo di lavaggio completato","event.dishwasher_paused":"Ciclo di lavaggio interrotto","event.dishwasher_service_required":"Assistenza alla lavastoviglie necessaria","event.dishwasher_started":"Ciclo di lavaggio avviato","event.fault_notification":"Guasto dell'elettrodomestico","event.feedback_notification":"Richiesta di feedback","event.freezer_door_ajar":"Porta del congelatore aperta","event.freezer_setpoint_changed":"Temperatura impostata del congelatore modificata","event.ice_cleaning_add_descaler":"Il ciclo di pulizia del fabbricatore di ghiaccio richiede il decalcificante","event.ice_cleaning_add_sanitizer":"Il ciclo di pulizia del fabbricatore di ghiaccio richiede il disinfettante","event.ice_cleaning_cancelled":"Ciclo di pulizia del fabbricatore di ghiaccio annullato","event.ice_cleaning_complete":"Ciclo di pulizia del fabbricatore di ghiaccio completato","event.ice_cleaning_due_soon":"Ciclo di pulizia del fabbricatore di ghiaccio necessario a breve","event.ice_cleaning_required":"Ciclo di pulizia del fabbricatore di ghiaccio necessario","event.ice_maker_door_ajar":"Sportello del fabbricatore di ghiaccio aperto","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"Timer da cucina 2 terminato","event.kitchen_timer_2_under_one_minute":"Al timer da cucina 2 manca un minuto","event.kitchen_timer_complete":"Timer da cucina terminato","event.kitchen_timer_under_one_minute":"Al timer da cucina manca un minuto","event.lower_oven_cooking_timer_complete":"Timer di cottura del forno inferiore terminato","event.lower_oven_cooking_timer_under_one_minute":"Al timer di cottura del forno inferiore manca un minuto","event.lower_oven_door_ajar":"Porta del forno inferiore aperta","event.lower_oven_preheated":"Preriscaldamento del forno inferiore completato","event.lower_oven_probe_connected":"Sonda del forno inferiore in uso","event.lower_oven_probe_target_reached":"Temperatura della sonda del forno inferiore raggiunta","event.lower_oven_probe_within_ten_degrees":"Sonda del forno inferiore a meno di 10 \xB0F dall'obiettivo","event.lower_oven_self_clean_complete":"Pulizia del forno inferiore completata","event.oven_cooking_timer_complete":"Timer di cottura del forno terminato","event.oven_cooking_timer_under_one_minute":"Al timer di cottura del forno manca un minuto","event.oven_door_ajar":"Porta del forno aperta","event.oven_preheated":"Preriscaldamento del forno completato","event.oven_probe_connected":"Sonda del forno in uso","event.oven_probe_target_reached":"Temperatura della sonda del forno raggiunta","event.oven_probe_within_ten_degrees":"Sonda del forno a meno di 10 \xB0F dall'obiettivo","event.oven_self_clean_complete":"Pulizia del forno completata","event.oven_service_required":"Assistenza al forno necessaria","event.refrigerator_door_ajar":"Porta del frigorifero aperta","event.refrigerator_service_required":"Assistenza al frigorifero necessaria","event.refrigerator_setpoint_changed":"Temperatura impostata del frigorifero modificata","event.rinse_aid_low":"Brillantante in esaurimento","event.softener_salt_low":"Sale addolcitore in esaurimento","event.unknown":"Sconosciuto","event.water_filter_expired":"Filtro dell'acqua scaduto","event.wine_door_ajar":"Porta della cantinetta aperta","event.wine_setpoint_changed":"Temperatura impostata della cantinetta modificata","event.wine_temperature_alert":"Temperatura della cantinetta fuori intervallo","full.appearance":"Aspetto","full.appliance":"Elettrodomestico","full.events_error":"Impossibile caricare gli eventi: {error}","full.events_loading":"Caricamento degli eventi\u2026","full.events_more":"Mostra {days} giorni","full.failed":"Non ha funzionato.","full.no_events":"Nessun evento negli ultimi {days} giorni.","full.recent_events":"Eventi recenti","full.refresh":"Aggiorna","full.refresh_hint":"Legge subito lo stato dell'elettrodomestico.","full.refreshing":"Aggiornamento\u2026","info.air_filter":"Filtro dell'aria","info.cleaning":"Pulizia","info.cycle":"Programma","info.delay":"Pausa ghiaccio","info.ends":"Fine","info.fan":"Ventola","info.filter":"Filtro","info.ice_maker":"Ghiaccio","info.light":"Luce","info.mode":"Modalit\xE0","info.model":"Modello","info.next_cleaning":"Prossima pulizia","info.options":"Opzioni","info.probe":"Sonda","info.set_to":"Impostato a","info.starts":"Inizio","info.status":"Stato","info.water_filter":"Filtro dell'acqua","lock.cycle_no_delay":"Questo programma di lavaggio non prevede la partenza ritardata.","lock.cycle_no_option":"Questo programma di lavaggio non prevede questa opzione.","lock.delay_not_idle":"La partenza ritardata si pu\xF2 cambiare solo con la lavastoviglie ferma o in attesa.","lock.proof_light":"La luce del forno resta spenta durante la lievitazione.","lock.sabbath":"La modalit\xE0 Sabbath \xE8 attiva. Disattivala per cambiare questa impostazione.","lock.self_clean":"Il forno \xE8 in autopulizia. Pu\xF2 solo essere spento.","lock.wash_not_idle":"Le opzioni di lavaggio si possono cambiare solo con la lavastoviglie ferma.","option.10_hours":"10 ore","option.10_minutes":"10 minuti","option.11_hours":"11 ore","option.12_hours":"12 ore","option.1_hour":"1 ora","option.1_minute":"1 minuto","option.2_hours":"2 ore","option.2_minutes":"2 minuti","option.3_hours":"3 ore","option.4_hours":"4 ore","option.5_hours":"5 ore","option.5_minutes":"5 minuti","option.6_hours":"6 ore","option.7_hours":"7 ore","option.8_hours":"8 ore","option.9_hours":"9 ore","option.add_descaler":"Aggiungi il decalcificante","option.add_sanitizer":"Aggiungi l'igienizzante","option.auto":"Automatico","option.automatic":"Automatico","option.bake":"Cottura","option.bake_stone":"Pietra refrattaria","option.broil":"Grill","option.canceling":"Annullamento","option.child_lock":"Blocco bambini","option.cleaning_complete":"Pulizia completata","option.cleaning_reset_flush":"Ripristino pulizia: scarico","option.cleaning_reset_rinse":"Ripristino pulizia: risciacquo","option.convection":"Ventilato","option.convection_bake":"Cottura ventilata","option.convection_broil":"Grill ventilato","option.convection_roast":"Arrosto ventilato","option.crystal_and_china":"Cristalli e porcellana","option.dehydrate":"Essiccazione","option.delayed":"Ritardato","option.descale_clean":"Decalcificazione: pulizia","option.descale_fill":"Decalcificazione: riempimento","option.descale_flush":"Decalcificazione: scarico","option.descale_rinse":"Decalcificazione: risciacquo","option.disabled":"Disattivato","option.done":"Finito","option.drying":"Asciugatura","option.empty_bin":"Svuota il contenitore","option.enabled":"Attivato","option.energy":"Risparmio energetico","option.enhanced":"Potenziato","option.error":"Errore","option.extra_quiet":"Extra silenzioso","option.heavy":"Intensivo","option.high":"Alto","option.high_use":"Uso intenso","option.idle":"In attesa","option.light":"Delicato","option.long_vacation":"Vacanza lunga","option.low":"Basso","option.manual":"Manuale","option.manually_clean":"Pulisci a mano","option.max_ice":"Ghiaccio max","option.medium":"Medio","option.night_ice":"Ghiaccio notturno","option.none":"Nessuno","option.normal":"Normale","option.not_cleaning":"Nessuna pulizia","option.off":"Spento","option.on":"Acceso","option.paused":"In pausa","option.plastics":"Plastica","option.pots_and_pans":"Pentole e padelle","option.proof":"Lievitazione","option.quick":"Rapido","option.rinse_and_hold":"Risciacquo e attesa","option.roast":"Arrosto","option.running":"In funzione","option.sabbath":"Sabbath","option.sanitize_clean":"Igienizzazione: pulizia","option.sanitize_fill":"Igienizzazione: riempimento","option.sanitize_flush":"Igienizzazione: scarico","option.sanitize_rinse":"Igienizzazione: risciacquo","option.self_clean":"Autopulizia","option.short_vacation":"Vacanza breve","option.soak_and_scrub":"Ammollo e strofinatura","option.warm":"Mantenimento in caldo","pill.cleaning":"Pulizia","pill.cleaning_due":"Pulizia da fare","pill.cooking":"In cottura","pill.delayed_shutoff":"Spegnimento ritardato","pill.door_open":"Porta aperta","pill.door_open_for":"Porta aperta \xB7 {time}","pill.fan":"Ventola {speed}","pill.high_use":"Uso intenso","pill.light":"Luce accesa","pill.making_ice":"Produce ghiaccio","pill.normal":"Normale","pill.off":"Spento","pill.offline":"Non in linea","pill.paused":"In pausa","pill.preheated":"Preriscaldato","pill.preheating":"Preriscaldamento {pct}%","pill.remote_ready":"Remote Ready","pill.sabbath":"Sabbath","pill.self_clean":"Autopulizia","pill.service":"Assistenza","pill.temp_alert":"Avviso di temperatura","pill.timer":"Timer {time}","pill.timer_done":"Timer terminato","pill.vacation":"Vacanza","reason.choose_mode":"Scegli prima una modalit\xE0 di cottura.","reason.close_door":"Chiudi prima la porta.","reason.close_oven_door":"Chiudi prima la porta del forno.","reason.crisper_auto":"Imposta il cassetto verdure su Manuale per cambiarlo.","reason.dishwasher_busy":"Modificabile solo con la lavastoviglie ferma.","reason.manual_mode":"Avvia questa modalit\xE0 dal forno.","reason.max_ice":"Disattiva Ghiaccio max per cambiare la temperatura del congelatore.","reason.mode_change_disabled":"Al momento il forno non accetta cambi di modalit\xE0.","reason.no_temperature":"Questa modalit\xE0 non ha una temperatura da impostare.","reason.offline":"L'elettrodomestico non \xE8 in linea.","reason.oven_not_ready":"Disponibile con il forno acceso o in Remote Ready.","reason.remote_ready_dishwasher":"Attiva prima Remote Ready sulla lavastoviglie.","reason.remote_ready_oven":"Attiva Remote Ready sul forno per avviarlo da qui.","reason.set_temperature":"Imposta prima la temperatura.","reason.start_at_oven":"Accendilo dal forno.","reason.unavailable":"Non disponibile al momento.","reason.use_start":"Usa Avvia qui sotto per accenderlo.","section.cleaning":"Pulizia","section.cycle":"Ciclo di lavaggio","section.delayed_shutoff":"Spegnimento ritardato","section.details":"Dettagli","section.fan_light":"Ventola e luce","section.filters":"Filtri e manutenzione","section.ice_delay":"Pausa del ghiaccio","section.ice_maker":"Fabbricatore di ghiaccio","section.maintenance":"Manutenzione","section.modes":"Modalit\xE0","section.options":"Opzioni","section.settings":"Impostazioni","section.temperatures":"Temperature","severity.critical":"Critica","severity.high":"Alta","severity.low":"Bassa","severity.medium":"Media","severity.undefined":"Non specificata","severity.unknown":"Sconosciuta","severity.urgent":"Urgente","unit.days":"{n} g","unit.days_hours":"{d} g {h} h","unit.hours":"{n} h","unit.hours_minutes":"{h} h {m} min","unit.minutes":"{n} min","value.alert":"Avviso","value.daily_for":"Ogni giorno per {duration}","value.daily_from":"Ogni giorno dalle {time} per {duration}","value.done":"Finito","value.door_open":"Porta aperta","value.door_open_for":"Porta aperta \xB7 {time}","value.due_now":"Ora","value.due_soon":"A breve","value.ends_at":"Termina alle {time}","value.from_for":"Dalle {time} per {duration}","value.in_cycles":"Tra {n} cicli","value.inserted":"Inserito","value.low":"Basso","value.missing":"Mancante","value.no_faults":"Nessuno","value.none":"Nessuna","value.normal":"Normale","value.not_connected":"Non collegata","value.not_due":"Non ancora","value.not_needed":"Non necessaria","value.now":"Ora {temp}","value.off":"Spento","value.ok":"A posto","value.on":"Acceso","value.percent_used":"{pct}% usato","value.probe_close":"Entro 10 \xB0F dall'obiettivo","value.probe_done":"Obiettivo raggiunto","value.replace":"Da sostituire","value.required":"Necessaria","value.speed":"Velocit\xE0 {speed}","value.under_minute":"Meno di un minuto","value.until":"Fino alle {time}","wifi.excellent":"Ottimo","wifi.fair":"Discreto","wifi.good":"Buono","wifi.weak":"Debole","zone.crisp":"Cassetto verdure","zone.frz":"Congelatore","zone.ref":"Frigorifero","zone.ref2":"Cassetto frigorifero","zone.short.crisp":"Verdure","zone.short.frz":"Congelatore","zone.short.ref":"Frigorifero","zone.short.ref2":"Cassetto","zone.short.wine":"Vino","zone.short.wine_lower":"Sotto","zone.short.wine_upper":"Sopra","zone.wine":"Cantinetta","zone.wine_lower":"Zona inferiore","zone.wine_upper":"Zona superiore"};var tl={"action.cancel_cycle":"Programma annuleren","action.cancel_schedule":"Annuleren","action.dismiss":"Bevestigen","action.end":"Be\xEBindigen","action.reset":"Resetten","action.start":"Starten","action.turn_off":"Uitzetten","cavity.left":"Linkeroven","cavity.lower":"Onderste oven","cavity.right":"Rechteroven","cavity.single":"Oven","cavity.upper":"Bovenste oven","confirm.cancel_cycle":"Afwasprogramma annuleren?","confirm.start.left":"Linkeroven starten op {setting}?","confirm.start.lower":"Onderste oven starten op {setting}?","confirm.start.right":"Rechteroven starten op {setting}?","confirm.start.single":"Oven starten op {setting}?","confirm.start.upper":"Bovenste oven starten op {setting}?","confirm.start_dishwasher":"{cycle} starten op de vaatwasser?","confirm.stop.left":"Linkeroven uitzetten?","confirm.stop.lower":"Onderste oven uitzetten?","confirm.stop.right":"Rechteroven uitzetten?","confirm.stop.single":"Oven uitzetten?","confirm.stop.upper":"Bovenste oven uitzetten?","control.accent_light":"Sfeerverlichting","control.air_filter":"Luchtfilter","control.air_purification":"Luchtzuivering","control.appliance_type":"Apparaattype","control.broil_level":"Grillstand","control.cancel_cycle":"Lopend programma","control.cancel_delay":"Geplande ijspauze","control.clean_due":"Reiniging nodig","control.clean_stage":"Reinigingsstap","control.control_lock":"Bedieningsvergrendeling","control.cook_mode":"Bereidingswijze","control.cook_timer":"Kooktimer","control.crisper_mode":"Temperatuur groentelade","control.cycles_until_cleaning":"IJscycli tot reiniging","control.delay_left":"Pauze eindigt over","control.delay_schedule":"Schema","control.delay_start":"Uitgestelde start","control.delayed_shutoff":"Uitgestelde uitschakeling","control.dishwasher_mode":"Modus","control.dispenser":"Interne waterdispenser","control.door_open_delay":"Vertraging deur-open-melding","control.duration":"Duur","control.end_delay":"Huidige pauze","control.extended_dry_on":"Verlengd drogen","control.failsafe":"Veiligheidsuitschakeling","control.fan":"Ventilator","control.fan_sensitivity":"Automatische ventilatorgevoeligheid","control.fault":"Storing {code}","control.fault_code":"Code {code}","control.fault_unknown":"Storing","control.faults":"Actieve storingen","control.filter_allowance":"Levensduur filter","control.filter_usage":"Filtergebruik","control.gourmet":"Gourmetprogramma","control.halo":"Halolicht","control.heated_dry_on":"Extra drogen","control.high_temp_wash_on":"Afwassen op hoge temperatuur","control.high_use_left":"Intensief gebruik eindigt over","control.humidity":"Vochtigheidsregeling","control.ice_maker":"IJsmaker","control.key_tones":"Toetstonen","control.kitchen_timer":"Keukentimer","control.kitchen_timer2":"Keukentimer 2","control.light":"Lamp","control.max_ice_left":"Max ijs eindigt over","control.model":"Modelnummer","control.next_cleaning":"Volgende reiniging","control.night_mode":"Nachtmodus","control.operating_mode":"Modus","control.power":"Aan/uit","control.probe":"Kerntemperatuurmeter","control.probe_target":"Doeltemperatuur meter","control.remote_ready":"Remote Ready","control.remote_start":"Op afstand starten","control.reset_air_filter":"Luchtfilter resetten","control.rinse_aid":"Glansspoelmiddel","control.sabbath":"Sabbatmodus","control.sani_rinse_on":"Hygi\xEBnisch spoelen","control.schedule_delay":"Nieuwe ijspauze","control.service":"Onderhoud","control.shutoff_after":"Uitschakelen na","control.softener":"Onthardingszout","control.starts_in":"Start over","control.status":"Toestand","control.task_light":"Werklamp","control.temperature":"Temperatuur","control.time_left":"Resterende tijd","control.timer_finished":"Timer afgelopen","control.top_rack_only_on":"Alleen bovenste rek","control.uptime":"Bedrijfstijd","control.wash_cycle":"Afwasprogramma","control.water_filter":"Waterfilter","control.water_filter_capacity":"Capaciteit waterfilter","control.wifi":"Wifi-signaal","control.wine_temp_alert":"Temperatuurmelding","control.winterized":"Winterklaar","ctl.at":"Starttijd","ctl.brightness":"Helderheid","ctl.custom":"Aangepast","ctl.decrease":"Verlagen","ctl.duration":"Duur","ctl.increase":"Verhogen","ctl.later":"Later vandaag","ctl.minutes":"Minuten","ctl.more_info":"{name}: meer informatie","ctl.not_now":"Niet nu","ctl.now":"Nu","ctl.off":"Uit","ctl.on":"Aan","ctl.repeat":"Dagelijks herhalen","ctl.saving":"Opslaan\u2026","ctl.schedule":"Plannen","ctl.set":"Instellen","ctl.speed":"Stand {n}","ctl.start":"Begin","ctl.starts_in":"Begint over {time}","ctl.white":"Kleurtemperatuur","display.starts_at":"Start {time}","event.air_filter_expired":"Luchtfilter verlopen","event.cavity.cooking_timer_complete":"Bereidingstimer afgelopen","event.cavity.cooking_timer_under_one_minute":"Bereidingstimer heeft nog \xE9\xE9n minuut","event.cavity.door_ajar":"Deur open","event.cavity.preheated":"Voorverwarmen voltooid","event.cavity.probe_connected":"Kerntemperatuurmeter in gebruik","event.cavity.probe_target_reached":"Kerntemperatuur bereikt","event.cavity.probe_within_ten_degrees":"Kerntemperatuurmeter binnen 10 \xB0F van doel","event.cavity.self_clean_complete":"Reiniging voltooid","event.dishwasher_cancelled":"Vaatwasprogramma geannuleerd","event.dishwasher_complete":"Vaatwasprogramma voltooid","event.dishwasher_paused":"Vaatwasprogramma onderbroken","event.dishwasher_service_required":"Onderhoud vaatwasser vereist","event.dishwasher_started":"Vaatwasprogramma gestart","event.fault_notification":"Apparaatstoring","event.feedback_notification":"Verzoek om feedback","event.freezer_door_ajar":"Vriezerdeur open","event.freezer_setpoint_changed":"Ingestelde temperatuur vriezer gewijzigd","event.ice_cleaning_add_descaler":"Reinigingscyclus ijsmachine heeft ontkalker nodig","event.ice_cleaning_add_sanitizer":"Reinigingscyclus ijsmachine heeft desinfectiemiddel nodig","event.ice_cleaning_cancelled":"Reinigingscyclus ijsmachine geannuleerd","event.ice_cleaning_complete":"Reinigingscyclus ijsmachine voltooid","event.ice_cleaning_due_soon":"Reinigingscyclus ijsmachine binnenkort nodig","event.ice_cleaning_required":"Reinigingscyclus ijsmachine nodig","event.ice_maker_door_ajar":"Deur van ijsmachine open","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"Kookwekker 2 afgelopen","event.kitchen_timer_2_under_one_minute":"Kookwekker 2 heeft nog \xE9\xE9n minuut","event.kitchen_timer_complete":"Kookwekker afgelopen","event.kitchen_timer_under_one_minute":"Kookwekker heeft nog \xE9\xE9n minuut","event.lower_oven_cooking_timer_complete":"Bereidingstimer onderste oven afgelopen","event.lower_oven_cooking_timer_under_one_minute":"Bereidingstimer onderste oven heeft nog \xE9\xE9n minuut","event.lower_oven_door_ajar":"Deur onderste oven open","event.lower_oven_preheated":"Voorverwarmen onderste oven voltooid","event.lower_oven_probe_connected":"Kerntemperatuurmeter onderste oven in gebruik","event.lower_oven_probe_target_reached":"Kerntemperatuur onderste oven bereikt","event.lower_oven_probe_within_ten_degrees":"Kerntemperatuurmeter onderste oven binnen 10 \xB0F van doel","event.lower_oven_self_clean_complete":"Reiniging onderste oven voltooid","event.oven_cooking_timer_complete":"Bereidingstimer oven afgelopen","event.oven_cooking_timer_under_one_minute":"Bereidingstimer oven heeft nog \xE9\xE9n minuut","event.oven_door_ajar":"Ovendeur open","event.oven_preheated":"Voorverwarmen oven voltooid","event.oven_probe_connected":"Kerntemperatuurmeter oven in gebruik","event.oven_probe_target_reached":"Kerntemperatuur oven bereikt","event.oven_probe_within_ten_degrees":"Kerntemperatuurmeter oven binnen 10 \xB0F van doel","event.oven_self_clean_complete":"Ovenreiniging voltooid","event.oven_service_required":"Onderhoud oven vereist","event.refrigerator_door_ajar":"Koelkastdeur open","event.refrigerator_service_required":"Onderhoud koelkast vereist","event.refrigerator_setpoint_changed":"Ingestelde temperatuur koelkast gewijzigd","event.rinse_aid_low":"Glansspoelmiddel bijna op","event.softener_salt_low":"Onthardingszout bijna op","event.unknown":"Onbekend","event.water_filter_expired":"Waterfilter verlopen","event.wine_door_ajar":"Deur van wijnklimaatkast open","event.wine_setpoint_changed":"Ingestelde temperatuur wijnklimaatkast gewijzigd","event.wine_temperature_alert":"Temperatuur wijnklimaatkast buiten bereik","full.appearance":"Weergave","full.appliance":"Apparaat","full.events_error":"Gebeurtenissen konden niet worden geladen: {error}","full.events_loading":"Gebeurtenissen laden\u2026","full.events_more":"{days} dagen tonen","full.failed":"Dat is niet gelukt.","full.no_events":"Geen gebeurtenissen in de afgelopen {days} dagen.","full.recent_events":"Recente gebeurtenissen","full.refresh":"Vernieuwen","full.refresh_hint":"Leest nu de status van het apparaat.","full.refreshing":"Vernieuwen\u2026","info.air_filter":"Luchtfilter","info.cleaning":"Reiniging","info.cycle":"Programma","info.delay":"IJspauze","info.ends":"Klaar om","info.fan":"Ventilator","info.filter":"Filter","info.ice_maker":"IJsmaker","info.light":"Lamp","info.mode":"Modus","info.model":"Modelnummer","info.next_cleaning":"Volgende reiniging","info.options":"Opties","info.probe":"Meter","info.set_to":"Ingesteld op","info.starts":"Start om","info.status":"Toestand","info.water_filter":"Waterfilter","lock.cycle_no_delay":"Dit afwasprogramma heeft geen uitgestelde start.","lock.cycle_no_option":"Dit afwasprogramma heeft deze optie niet.","lock.delay_not_idle":"De uitgestelde start kan alleen worden gewijzigd als de vaatwasser stilstaat of wacht.","lock.proof_light":"De ovenlamp blijft uit tijdens het rijzen.","lock.sabbath":"De sabbatmodus staat aan. Zet hem uit om dit te wijzigen.","lock.self_clean":"De oven reinigt zichzelf. Hij kan alleen worden uitgezet.","lock.wash_not_idle":"Afwasopties kunnen alleen worden gewijzigd als de vaatwasser stilstaat.","option.10_hours":"10 uur","option.10_minutes":"10 minuten","option.11_hours":"11 uur","option.12_hours":"12 uur","option.1_hour":"1 uur","option.1_minute":"1 minuut","option.2_hours":"2 uur","option.2_minutes":"2 minuten","option.3_hours":"3 uur","option.4_hours":"4 uur","option.5_hours":"5 uur","option.5_minutes":"5 minuten","option.6_hours":"6 uur","option.7_hours":"7 uur","option.8_hours":"8 uur","option.9_hours":"9 uur","option.add_descaler":"Ontkalker toevoegen","option.add_sanitizer":"Desinfectiemiddel toevoegen","option.auto":"Automatisch","option.automatic":"Automatisch","option.bake":"Bakken","option.bake_stone":"Baksteen","option.broil":"Grillen","option.canceling":"Annuleren","option.child_lock":"Kinderslot","option.cleaning_complete":"Reiniging voltooid","option.cleaning_reset_flush":"Reiniging resetten: doorspoelen","option.cleaning_reset_rinse":"Reiniging resetten: naspoelen","option.convection":"Hetelucht","option.convection_bake":"Heteluchtbakken","option.convection_broil":"Heteluchtgrillen","option.convection_roast":"Heteluchtbraden","option.crystal_and_china":"Kristal en porselein","option.dehydrate":"Drogen","option.delayed":"Uitgesteld","option.descale_clean":"Ontkalken: reinigen","option.descale_fill":"Ontkalken: vullen","option.descale_flush":"Ontkalken: doorspoelen","option.descale_rinse":"Ontkalken: naspoelen","option.disabled":"Uitgeschakeld","option.done":"Klaar","option.drying":"Drogen","option.empty_bin":"Bak legen","option.enabled":"Ingeschakeld","option.energy":"Energiebesparend","option.enhanced":"Verhoogd","option.error":"Fout","option.extra_quiet":"Extra stil","option.heavy":"Intensief","option.high":"Hoog","option.high_use":"Intensief gebruik","option.idle":"Gereed","option.light":"Licht","option.long_vacation":"Lange vakantie","option.low":"Laag","option.manual":"Handmatig","option.manually_clean":"Met de hand reinigen","option.max_ice":"Max ijs","option.medium":"Gemiddeld","option.night_ice":"Nachtijs","option.none":"Geen","option.normal":"Normaal","option.not_cleaning":"Geen reiniging","option.off":"Uit","option.on":"Aan","option.paused":"Gepauzeerd","option.plastics":"Kunststof","option.pots_and_pans":"Pannen","option.proof":"Rijzen","option.quick":"Snel","option.rinse_and_hold":"Voorspoelen","option.roast":"Braden","option.running":"Bezig","option.sabbath":"Sabbat","option.sanitize_clean":"Desinfecteren: reinigen","option.sanitize_fill":"Desinfecteren: vullen","option.sanitize_flush":"Desinfecteren: doorspoelen","option.sanitize_rinse":"Desinfecteren: naspoelen","option.self_clean":"Zelfreiniging","option.short_vacation":"Korte vakantie","option.soak_and_scrub":"Weken en schrobben","option.warm":"Warmhouden","pill.cleaning":"Reinigen","pill.cleaning_due":"Reiniging nodig","pill.cooking":"Bereidt","pill.delayed_shutoff":"Uitgestelde uitschakeling","pill.door_open":"Deur open","pill.door_open_for":"Deur open \xB7 {time}","pill.fan":"Ventilator {speed}","pill.high_use":"Intensief gebruik","pill.light":"Lamp aan","pill.making_ice":"Maakt ijs","pill.normal":"Normaal","pill.off":"Uit","pill.offline":"Offline","pill.paused":"Gepauzeerd","pill.preheated":"Voorverwarmd","pill.preheating":"Voorverwarmen {pct}%","pill.remote_ready":"Remote Ready","pill.sabbath":"Sabbat","pill.self_clean":"Zelfreiniging","pill.service":"Onderhoud nodig","pill.temp_alert":"Temperatuurmelding","pill.timer":"Timer {time}","pill.timer_done":"Timer afgelopen","pill.vacation":"Vakantie","reason.choose_mode":"Kies eerst een bereidingswijze.","reason.close_door":"Sluit eerst de deur.","reason.close_oven_door":"Sluit eerst de ovendeur.","reason.crisper_auto":"Zet de groentelade op Handmatig om dit te wijzigen.","reason.dishwasher_busy":"Alleen te wijzigen als de vaatwasser stilstaat.","reason.manual_mode":"Start deze bereidingswijze op de oven.","reason.max_ice":"Zet Max ijs uit om de vriestemperatuur te wijzigen.","reason.mode_change_disabled":"De oven accepteert nu geen andere bereidingswijze.","reason.no_temperature":"Deze bereidingswijze heeft geen instelbare temperatuur.","reason.offline":"Het apparaat is offline.","reason.oven_not_ready":"Beschikbaar als de oven aan staat of in Remote Ready.","reason.remote_ready_dishwasher":"Zet eerst Remote Ready aan op de vaatwasser.","reason.remote_ready_oven":"Zet Remote Ready aan op de oven om hem hier te starten.","reason.set_temperature":"Stel eerst de temperatuur in.","reason.start_at_oven":"Zet hem aan op de oven.","reason.unavailable":"Nu niet beschikbaar.","reason.use_start":"Gebruik Starten hieronder om hem aan te zetten.","section.cleaning":"Reiniging","section.cycle":"Afwasprogramma","section.delayed_shutoff":"Uitgestelde uitschakeling","section.details":"Gegevens","section.fan_light":"Ventilator en lamp","section.filters":"Filters en onderhoud","section.ice_delay":"IJspauze","section.ice_maker":"IJsmaker","section.maintenance":"Onderhoud","section.modes":"Modi","section.options":"Opties","section.settings":"Instellingen","section.temperatures":"Temperaturen","severity.critical":"Kritiek","severity.high":"Hoog","severity.low":"Laag","severity.medium":"Gemiddeld","severity.undefined":"Niet opgegeven","severity.unknown":"Onbekend","severity.urgent":"Dringend","unit.days":"{n} d","unit.days_hours":"{d} d {h} u","unit.hours":"{n} u","unit.hours_minutes":"{h} u {m} min","unit.minutes":"{n} min","value.alert":"Melding","value.daily_for":"Dagelijks gedurende {duration}","value.daily_from":"Dagelijks vanaf {time} gedurende {duration}","value.done":"Klaar","value.door_open":"Deur open","value.door_open_for":"Deur open \xB7 {time}","value.due_now":"Nu","value.due_soon":"Binnenkort","value.ends_at":"Klaar om {time}","value.from_for":"Vanaf {time} gedurende {duration}","value.in_cycles":"Over {n} cycli","value.inserted":"Geplaatst","value.low":"Laag","value.missing":"Ontbreekt","value.no_faults":"Geen","value.none":"Geen","value.normal":"Normaal","value.not_connected":"Niet aangesloten","value.not_due":"Nog niet","value.not_needed":"Niet nodig","value.now":"Nu {temp}","value.off":"Uit","value.ok":"Goed","value.on":"Aan","value.percent_used":"{pct}% verbruikt","value.probe_close":"Binnen 10 \xB0F van het doel","value.probe_done":"Doel bereikt","value.replace":"Vervangen","value.required":"Nodig","value.speed":"Stand {speed}","value.under_minute":"Minder dan een minuut","value.until":"Tot {time}","wifi.excellent":"Uitstekend","wifi.fair":"Redelijk","wifi.good":"Goed","wifi.weak":"Zwak","zone.crisp":"Groentelade","zone.frz":"Vriezer","zone.ref":"Koelkast","zone.ref2":"Koellade","zone.short.crisp":"Groente","zone.short.frz":"Vriezer","zone.short.ref":"Koelkast","zone.short.ref2":"Lade","zone.short.wine":"Wijn","zone.short.wine_lower":"Onder","zone.short.wine_upper":"Boven","zone.wine":"Wijnklimaatkast","zone.wine_lower":"Onderste zone","zone.wine_upper":"Bovenste zone"};var nl={"action.cancel_cycle":"Anuluj cykl","action.cancel_schedule":"Anuluj","action.dismiss":"Potwierd\u017A","action.end":"Zako\u0144cz","action.reset":"Zresetuj","action.start":"Uruchom","action.turn_off":"Wy\u0142\u0105cz","cavity.left":"Lewy piekarnik","cavity.lower":"Dolny piekarnik","cavity.right":"Prawy piekarnik","cavity.single":"Piekarnik","cavity.upper":"G\xF3rny piekarnik","confirm.cancel_cycle":"Anulowa\u0107 cykl zmywania?","confirm.start.left":"Uruchomi\u0107 lewy piekarnik w trybie {setting}?","confirm.start.lower":"Uruchomi\u0107 dolny piekarnik w trybie {setting}?","confirm.start.right":"Uruchomi\u0107 prawy piekarnik w trybie {setting}?","confirm.start.single":"Uruchomi\u0107 piekarnik w trybie {setting}?","confirm.start.upper":"Uruchomi\u0107 g\xF3rny piekarnik w trybie {setting}?","confirm.start_dishwasher":"Uruchomi\u0107 program {cycle} w zmywarce?","confirm.stop.left":"Wy\u0142\u0105czy\u0107 lewy piekarnik?","confirm.stop.lower":"Wy\u0142\u0105czy\u0107 dolny piekarnik?","confirm.stop.right":"Wy\u0142\u0105czy\u0107 prawy piekarnik?","confirm.stop.single":"Wy\u0142\u0105czy\u0107 piekarnik?","confirm.stop.upper":"Wy\u0142\u0105czy\u0107 g\xF3rny piekarnik?","control.accent_light":"O\u015Bwietlenie dekoracyjne","control.air_filter":"Filtr powietrza","control.air_purification":"Oczyszczanie powietrza","control.appliance_type":"Typ urz\u0105dzenia","control.broil_level":"Poziom grilla","control.cancel_cycle":"Bie\u017C\u0105cy cykl","control.cancel_delay":"Zaplanowana przerwa","control.clean_due":"Termin czyszczenia","control.clean_stage":"Etap czyszczenia","control.control_lock":"Blokada przycisk\xF3w","control.cook_mode":"Tryb pieczenia","control.cook_timer":"Minutnik pieczenia","control.crisper_mode":"Temperatura szuflady na warzywa","control.cycles_until_cleaning":"Cykle lodu do czyszczenia","control.delay_left":"Przerwa ko\u0144czy si\u0119 za","control.delay_schedule":"Harmonogram","control.delay_start":"Op\xF3\u017Aniony start","control.delayed_shutoff":"Op\xF3\u017Anione wy\u0142\u0105czenie","control.dishwasher_mode":"Tryb","control.dispenser":"Wewn\u0119trzny dystrybutor wody","control.door_open_delay":"Op\xF3\u017Anienie alarmu otwartych drzwi","control.duration":"Czas trwania","control.end_delay":"Bie\u017C\u0105ca przerwa","control.extended_dry_on":"Wyd\u0142u\u017Cone suszenie","control.failsafe":"Wy\u0142\u0105czenie awaryjne","control.fan":"Wentylator","control.fan_sensitivity":"Czu\u0142o\u015B\u0107 automatycznego wentylatora","control.fault":"Usterka {code}","control.fault_code":"Kod {code}","control.fault_unknown":"Usterka","control.faults":"Aktywne usterki","control.filter_allowance":"\u017Bywotno\u015B\u0107 filtra","control.filter_usage":"Zu\u017Cycie filtra","control.gourmet":"Program Gourmet","control.halo":"O\u015Bwietlenie halo","control.heated_dry_on":"Dodatkowe suszenie","control.high_temp_wash_on":"Mycie w wysokiej temperaturze","control.high_use_left":"Intensywne u\u017Cytkowanie ko\u0144czy si\u0119 za","control.humidity":"Regulacja wilgotno\u015Bci","control.ice_maker":"Kostkarka do lodu","control.key_tones":"D\u017Awi\u0119ki przycisk\xF3w","control.kitchen_timer":"Minutnik kuchenny","control.kitchen_timer2":"Minutnik kuchenny 2","control.light":"O\u015Bwietlenie","control.max_ice_left":"Maks. l\xF3d ko\u0144czy si\u0119 za","control.model":"Numer modelu","control.next_cleaning":"Nast\u0119pne czyszczenie","control.night_mode":"Tryb nocny","control.operating_mode":"Tryb","control.power":"Zasilanie","control.probe":"Sonda","control.probe_target":"Docelowa temperatura sondy","control.remote_ready":"Remote Ready","control.remote_start":"Zdalne uruchomienie","control.reset_air_filter":"Zresetuj filtr powietrza","control.rinse_aid":"Nab\u0142yszczacz","control.sabbath":"Tryb szabatowy","control.sani_rinse_on":"P\u0142ukanie higieniczne","control.schedule_delay":"Nowa przerwa","control.service":"Serwis","control.shutoff_after":"Wy\u0142\u0105cz po","control.softener":"S\xF3l zmi\u0119kczaj\u0105ca","control.starts_in":"Start za","control.status":"Stan","control.task_light":"O\u015Bwietlenie robocze","control.temperature":"Temperatura","control.time_left":"Pozosta\u0142y czas","control.timer_finished":"Minutnik zako\u0144czy\u0142","control.top_rack_only_on":"Tylko g\xF3rny kosz","control.uptime":"Czas pracy","control.wash_cycle":"Program zmywania","control.water_filter":"Filtr wody","control.water_filter_capacity":"Pojemno\u015B\u0107 filtra wody","control.wifi":"Sygna\u0142 Wi-Fi","control.wine_temp_alert":"Alarm temperatury","control.winterized":"Przygotowano do zimy","ctl.at":"Godzina rozpocz\u0119cia","ctl.brightness":"Jasno\u015B\u0107","ctl.custom":"W\u0142asny","ctl.decrease":"Zmniejsz","ctl.duration":"Czas trwania","ctl.increase":"Zwi\u0119ksz","ctl.later":"P\xF3\u017Aniej dzisiaj","ctl.minutes":"Minuty","ctl.more_info":"{name}: wi\u0119cej informacji","ctl.not_now":"Nie teraz","ctl.now":"Teraz","ctl.off":"Wy\u0142.","ctl.on":"W\u0142.","ctl.repeat":"Powtarzaj codziennie","ctl.saving":"Zapisywanie\u2026","ctl.schedule":"Zaplanuj","ctl.set":"Ustaw","ctl.speed":"Bieg {n}","ctl.start":"Pocz\u0105tek","ctl.starts_in":"Rozpocznie si\u0119 za {time}","ctl.white":"Barwa bieli","display.starts_at":"Start {time}","event.air_filter_expired":"Filtr powietrza do wymiany","event.cavity.cooking_timer_complete":"Minutnik pieczenia zako\u0144czy\u0142 odliczanie","event.cavity.cooking_timer_under_one_minute":"Na minutniku pieczenia zosta\u0142a minuta","event.cavity.door_ajar":"Drzwi otwarte","event.cavity.preheated":"Zako\u0144czono nagrzewanie","event.cavity.probe_connected":"Sonda w u\u017Cyciu","event.cavity.probe_target_reached":"Osi\u0105gni\u0119to temperatur\u0119 sondy","event.cavity.probe_within_ten_degrees":"Sonda mniej ni\u017C 10 \xB0F od celu","event.cavity.self_clean_complete":"Zako\u0144czono czyszczenie","event.dishwasher_cancelled":"Anulowano cykl zmywania","event.dishwasher_complete":"Zako\u0144czono cykl zmywania","event.dishwasher_paused":"Przerwano cykl zmywania","event.dishwasher_service_required":"Zmywarka wymaga serwisu","event.dishwasher_started":"Rozpocz\u0119to cykl zmywania","event.fault_notification":"Usterka urz\u0105dzenia","event.feedback_notification":"Pro\u015Bba o opini\u0119","event.freezer_door_ajar":"Drzwi zamra\u017Carki otwarte","event.freezer_setpoint_changed":"Zmieniono temperatur\u0119 zadan\u0105 zamra\u017Carki","event.ice_cleaning_add_descaler":"Cykl czyszczenia kostkarki do lodu wymaga odkamieniacza","event.ice_cleaning_add_sanitizer":"Cykl czyszczenia kostkarki do lodu wymaga \u015Brodka dezynfekuj\u0105cego","event.ice_cleaning_cancelled":"Anulowano cykl czyszczenia kostkarki do lodu","event.ice_cleaning_complete":"Zako\u0144czono cykl czyszczenia kostkarki do lodu","event.ice_cleaning_due_soon":"Wkr\xF3tce wymagany cykl czyszczenia kostkarki do lodu","event.ice_cleaning_required":"Wymagany cykl czyszczenia kostkarki do lodu","event.ice_maker_door_ajar":"Drzwi kostkarki do lodu otwarte","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"Minutnik kuchenny 2 zako\u0144czy\u0142 odliczanie","event.kitchen_timer_2_under_one_minute":"Na minutniku kuchennym 2 zosta\u0142a minuta","event.kitchen_timer_complete":"Minutnik kuchenny zako\u0144czy\u0142 odliczanie","event.kitchen_timer_under_one_minute":"Na minutniku kuchennym zosta\u0142a minuta","event.lower_oven_cooking_timer_complete":"Minutnik pieczenia dolnego piekarnika zako\u0144czy\u0142 odliczanie","event.lower_oven_cooking_timer_under_one_minute":"Na minutniku pieczenia dolnego piekarnika zosta\u0142a minuta","event.lower_oven_door_ajar":"Drzwi dolnego piekarnika otwarte","event.lower_oven_preheated":"Zako\u0144czono nagrzewanie dolnego piekarnika","event.lower_oven_probe_connected":"Sonda dolnego piekarnika w u\u017Cyciu","event.lower_oven_probe_target_reached":"Osi\u0105gni\u0119to temperatur\u0119 sondy dolnego piekarnika","event.lower_oven_probe_within_ten_degrees":"Sonda dolnego piekarnika mniej ni\u017C 10 \xB0F od celu","event.lower_oven_self_clean_complete":"Zako\u0144czono czyszczenie dolnego piekarnika","event.oven_cooking_timer_complete":"Minutnik pieczenia piekarnika zako\u0144czy\u0142 odliczanie","event.oven_cooking_timer_under_one_minute":"Na minutniku pieczenia piekarnika zosta\u0142a minuta","event.oven_door_ajar":"Drzwi piekarnika otwarte","event.oven_preheated":"Zako\u0144czono nagrzewanie piekarnika","event.oven_probe_connected":"Sonda piekarnika w u\u017Cyciu","event.oven_probe_target_reached":"Osi\u0105gni\u0119to temperatur\u0119 sondy piekarnika","event.oven_probe_within_ten_degrees":"Sonda piekarnika mniej ni\u017C 10 \xB0F od celu","event.oven_self_clean_complete":"Zako\u0144czono czyszczenie piekarnika","event.oven_service_required":"Piekarnik wymaga serwisu","event.refrigerator_door_ajar":"Drzwi lod\xF3wki otwarte","event.refrigerator_service_required":"Lod\xF3wka wymaga serwisu","event.refrigerator_setpoint_changed":"Zmieniono temperatur\u0119 zadan\u0105 lod\xF3wki","event.rinse_aid_low":"Niski poziom nab\u0142yszczacza","event.softener_salt_low":"Niski poziom soli zmi\u0119kczaj\u0105cej","event.unknown":"Nieznane","event.water_filter_expired":"Filtr wody do wymiany","event.wine_door_ajar":"Drzwi ch\u0142odziarki do wina otwarte","event.wine_setpoint_changed":"Zmieniono temperatur\u0119 zadan\u0105 ch\u0142odziarki do wina","event.wine_temperature_alert":"Temperatura w ch\u0142odziarce do wina poza zakresem","full.appearance":"Wygl\u0105d","full.appliance":"Urz\u0105dzenie","full.events_error":"Nie uda\u0142o si\u0119 wczyta\u0107 zdarze\u0144: {error}","full.events_loading":"Wczytywanie zdarze\u0144\u2026","full.events_more":"Poka\u017C {days} dni","full.failed":"Nie uda\u0142o si\u0119.","full.no_events":"Brak zdarze\u0144 w ci\u0105gu ostatnich {days} dni.","full.recent_events":"Ostatnie zdarzenia","full.refresh":"Od\u015Bwie\u017C","full.refresh_hint":"Odczytuje teraz stan urz\u0105dzenia.","full.refreshing":"Od\u015Bwie\u017Canie\u2026","info.air_filter":"Filtr powietrza","info.cleaning":"Czyszczenie","info.cycle":"Program","info.delay":"Przerwa","info.ends":"Koniec","info.fan":"Wentylator","info.filter":"Filtr","info.ice_maker":"Kostkarka","info.light":"O\u015Bwietlenie","info.mode":"Tryb","info.model":"Numer modelu","info.next_cleaning":"Nast\u0119pne czyszczenie","info.options":"Opcje","info.probe":"Sonda","info.set_to":"Ustawiono","info.starts":"Start","info.status":"Stan","info.water_filter":"Filtr wody","lock.cycle_no_delay":"Ten program zmywania nie oferuje op\xF3\u017Anionego startu.","lock.cycle_no_option":"Ten program zmywania nie oferuje tej opcji.","lock.delay_not_idle":"Op\xF3\u017Aniony start mo\u017Cna zmieni\u0107 tylko, gdy zmywarka stoi lub czeka na start.","lock.proof_light":"Podczas wyrastania ciasta o\u015Bwietlenie piekarnika pozostaje wy\u0142\u0105czone.","lock.sabbath":"Tryb szabatowy jest w\u0142\u0105czony. Wy\u0142\u0105cz go, aby to zmieni\u0107.","lock.self_clean":"Piekarnik si\u0119 samoczy\u015Bci. Mo\u017Cna go tylko wy\u0142\u0105czy\u0107.","lock.wash_not_idle":"Opcje zmywania mo\u017Cna zmieni\u0107 tylko, gdy zmywarka stoi.","option.10_hours":"10 godzin","option.10_minutes":"10 minut","option.11_hours":"11 godzin","option.12_hours":"12 godzin","option.1_hour":"1 godzina","option.1_minute":"1 minuta","option.2_hours":"2 godziny","option.2_minutes":"2 minuty","option.3_hours":"3 godziny","option.4_hours":"4 godziny","option.5_hours":"5 godzin","option.5_minutes":"5 minut","option.6_hours":"6 godzin","option.7_hours":"7 godzin","option.8_hours":"8 godzin","option.9_hours":"9 godzin","option.add_descaler":"Dodaj odkamieniacz","option.add_sanitizer":"Dodaj \u015Brodek dezynfekuj\u0105cy","option.auto":"Automatyczny","option.automatic":"Automatyczny","option.bake":"Pieczenie","option.bake_stone":"Kamie\u0144 do pieczenia","option.broil":"Grill","option.canceling":"Anulowanie","option.child_lock":"Blokada rodzicielska","option.cleaning_complete":"Czyszczenie zako\u0144czone","option.cleaning_reset_flush":"Reset czyszczenia: p\u0142ukanie","option.cleaning_reset_rinse":"Reset czyszczenia: p\u0142ukanie ko\u0144cowe","option.convection":"Termoobieg","option.convection_bake":"Pieczenie z termoobiegiem","option.convection_broil":"Grill z termoobiegiem","option.convection_roast":"Pieczenie mi\u0119s z termoobiegiem","option.crystal_and_china":"Kryszta\u0142 i porcelana","option.dehydrate":"Suszenie","option.delayed":"Op\xF3\u017Aniona","option.descale_clean":"Odkamienianie: czyszczenie","option.descale_fill":"Odkamienianie: nape\u0142nianie","option.descale_flush":"Odkamienianie: p\u0142ukanie","option.descale_rinse":"Odkamienianie: p\u0142ukanie ko\u0144cowe","option.disabled":"Wy\u0142\u0105czony","option.done":"Zako\u0144czono","option.drying":"Suszenie","option.empty_bin":"Opr\xF3\u017Cnij pojemnik","option.enabled":"W\u0142\u0105czony","option.energy":"Oszcz\u0119dny","option.enhanced":"Zwi\u0119kszony","option.error":"B\u0142\u0105d","option.extra_quiet":"Bardzo cichy","option.heavy":"Intensywny","option.high":"Wysoki","option.high_use":"Intensywne u\u017Cytkowanie","option.idle":"Gotowa","option.light":"Delikatny","option.long_vacation":"D\u0142ugi urlop","option.low":"Niski","option.manual":"R\u0119czny","option.manually_clean":"Wyczy\u015B\u0107 r\u0119cznie","option.max_ice":"Maks. l\xF3d","option.medium":"\u015Aredni","option.night_ice":"L\xF3d nocny","option.none":"Brak","option.normal":"Normalny","option.not_cleaning":"Brak czyszczenia","option.off":"Wy\u0142.","option.on":"W\u0142.","option.paused":"Wstrzymano","option.plastics":"Tworzywa sztuczne","option.pots_and_pans":"Garnki i patelnie","option.proof":"Wyrastanie ciasta","option.quick":"Szybki","option.rinse_and_hold":"P\u0142ukanie wst\u0119pne","option.roast":"Pieczenie mi\u0119s","option.running":"W toku","option.sabbath":"Szabat","option.sanitize_clean":"Dezynfekcja: czyszczenie","option.sanitize_fill":"Dezynfekcja: nape\u0142nianie","option.sanitize_flush":"Dezynfekcja: p\u0142ukanie","option.sanitize_rinse":"Dezynfekcja: p\u0142ukanie ko\u0144cowe","option.self_clean":"Samoczyszczenie","option.short_vacation":"Kr\xF3tki urlop","option.soak_and_scrub":"Namaczanie i szorowanie","option.warm":"Podgrzewanie","pill.cleaning":"Czyszczenie","pill.cleaning_due":"Wymaga czyszczenia","pill.cooking":"Pieczenie","pill.delayed_shutoff":"Op\xF3\u017Anione wy\u0142\u0105czenie","pill.door_open":"Drzwi otwarte","pill.door_open_for":"Drzwi otwarte \xB7 {time}","pill.fan":"Wentylator {speed}","pill.high_use":"Intensywne u\u017Cytkowanie","pill.light":"\u015Awiat\u0142o w\u0142.","pill.making_ice":"Robi l\xF3d","pill.normal":"Normalny","pill.off":"Wy\u0142.","pill.offline":"Offline","pill.paused":"Wstrzymano","pill.preheated":"Nagrzany","pill.preheating":"Nagrzewanie {pct}%","pill.remote_ready":"Remote Ready","pill.sabbath":"Szabat","pill.self_clean":"Samoczyszczenie","pill.service":"Serwis","pill.temp_alert":"Alarm temperatury","pill.timer":"Minutnik {time}","pill.timer_done":"Minutnik zako\u0144czy\u0142","pill.vacation":"Urlop","reason.choose_mode":"Najpierw wybierz tryb pieczenia.","reason.close_door":"Najpierw zamknij drzwi.","reason.close_oven_door":"Najpierw zamknij drzwi piekarnika.","reason.crisper_auto":"Ustaw szuflad\u0119 na warzywa na tryb r\u0119czny, aby to zmieni\u0107.","reason.dishwasher_busy":"Mo\u017Cna zmieni\u0107 tylko, gdy zmywarka stoi.","reason.manual_mode":"Uruchom ten tryb na piekarniku.","reason.max_ice":"Wy\u0142\u0105cz Maks. l\xF3d, aby zmieni\u0107 temperatur\u0119 zamra\u017Carki.","reason.mode_change_disabled":"Piekarnik nie przyjmuje teraz zmiany trybu.","reason.no_temperature":"Ten tryb nie ma temperatury do ustawienia.","reason.offline":"Urz\u0105dzenie jest offline.","reason.oven_not_ready":"Dost\u0119pne, gdy piekarnik dzia\u0142a lub jest w trybie Remote Ready.","reason.remote_ready_dishwasher":"Najpierw w\u0142\u0105cz Remote Ready na zmywarce.","reason.remote_ready_oven":"W\u0142\u0105cz Remote Ready na piekarniku, aby uruchomi\u0107 go st\u0105d.","reason.set_temperature":"Najpierw ustaw temperatur\u0119.","reason.start_at_oven":"W\u0142\u0105cz go na piekarniku.","reason.unavailable":"Teraz niedost\u0119pne.","reason.use_start":"W\u0142\u0105cz go przyciskiem Uruchom poni\u017Cej.","section.cleaning":"Czyszczenie","section.cycle":"Cykl zmywania","section.delayed_shutoff":"Op\xF3\u017Anione wy\u0142\u0105czenie","section.details":"Szczeg\xF3\u0142y","section.fan_light":"Wentylator i o\u015Bwietlenie","section.filters":"Filtry i konserwacja","section.ice_delay":"Przerwa w produkcji lodu","section.ice_maker":"Kostkarka do lodu","section.maintenance":"Konserwacja","section.modes":"Tryby","section.options":"Opcje","section.settings":"Ustawienia","section.temperatures":"Temperatury","severity.critical":"Krytyczna","severity.high":"Wysoka","severity.low":"Niska","severity.medium":"\u015Arednia","severity.undefined":"Nieokre\u015Blona","severity.unknown":"Nieznana","severity.urgent":"Pilna","unit.days":"{n} d","unit.days_hours":"{d} d {h} godz.","unit.hours":"{n} godz.","unit.hours_minutes":"{h} godz. {m} min","unit.minutes":"{n} min","value.alert":"Alarm","value.daily_for":"Codziennie przez {duration}","value.daily_from":"Codziennie od {time} przez {duration}","value.done":"Gotowe","value.door_open":"Drzwi otwarte","value.door_open_for":"Drzwi otwarte \xB7 {time}","value.due_now":"Teraz","value.due_soon":"Wkr\xF3tce","value.ends_at":"Koniec o {time}","value.from_for":"Od {time} przez {duration}","value.in_cycles":"Pozosta\u0142o cykli: {n}","value.inserted":"Za\u0142o\u017Cony","value.low":"Niski poziom","value.missing":"Brak","value.no_faults":"Brak","value.none":"Brak","value.normal":"Normalna","value.not_connected":"Niepod\u0142\u0105czona","value.not_due":"Jeszcze nie","value.not_needed":"Niewymagany","value.now":"Teraz {temp}","value.off":"Wy\u0142.","value.ok":"W porz\u0105dku","value.on":"W\u0142.","value.percent_used":"Zu\u017Cyto {pct}%","value.probe_close":"W granicach 10 \xB0F od celu","value.probe_done":"Osi\u0105gni\u0119to cel","value.replace":"Do wymiany","value.required":"Wymagany","value.speed":"Bieg {speed}","value.under_minute":"Mniej ni\u017C minuta","value.until":"Do {time}","wifi.excellent":"Doskona\u0142y","wifi.fair":"\u015Aredni","wifi.good":"Dobry","wifi.weak":"S\u0142aby","zone.crisp":"Szuflada na warzywa","zone.frz":"Zamra\u017Carka","zone.ref":"Lod\xF3wka","zone.ref2":"Szuflada ch\u0142odz\u0105ca","zone.short.crisp":"Warzywa","zone.short.frz":"Zamra\u017Carka","zone.short.ref":"Lod\xF3wka","zone.short.ref2":"Szuflada","zone.short.wine":"Wino","zone.short.wine_lower":"D\xF3\u0142","zone.short.wine_upper":"G\xF3ra","zone.wine":"Ch\u0142odziarka do wina","zone.wine_lower":"Dolna strefa","zone.wine_upper":"G\xF3rna strefa"};var rl={"action.cancel_cycle":"Avbryt programmet","action.cancel_schedule":"Avbryt","action.dismiss":"Kvittera","action.end":"Avsluta","action.reset":"\xC5terst\xE4ll","action.start":"Starta","action.turn_off":"St\xE4ng av","cavity.left":"V\xE4nster ugn","cavity.lower":"Nedre ugn","cavity.right":"H\xF6ger ugn","cavity.single":"Ugn","cavity.upper":"\xD6vre ugn","confirm.cancel_cycle":"Avbryta diskprogrammet?","confirm.start.left":"Starta v\xE4nster ugn p\xE5 {setting}?","confirm.start.lower":"Starta nedre ugnen p\xE5 {setting}?","confirm.start.right":"Starta h\xF6ger ugn p\xE5 {setting}?","confirm.start.single":"Starta ugnen p\xE5 {setting}?","confirm.start.upper":"Starta \xF6vre ugnen p\xE5 {setting}?","confirm.start_dishwasher":"Starta {cycle} p\xE5 diskmaskinen?","confirm.stop.left":"St\xE4nga av v\xE4nster ugn?","confirm.stop.lower":"St\xE4nga av nedre ugnen?","confirm.stop.right":"St\xE4nga av h\xF6ger ugn?","confirm.stop.single":"St\xE4nga av ugnen?","confirm.stop.upper":"St\xE4nga av \xF6vre ugnen?","control.accent_light":"St\xE4mningsbelysning","control.air_filter":"Luftfilter","control.air_purification":"Luftrening","control.appliance_type":"Apparattyp","control.broil_level":"Grillniv\xE5","control.cancel_cycle":"P\xE5g\xE5ende program","control.cancel_delay":"Schemalagd ispaus","control.clean_due":"Reng\xF6ring beh\xF6vs","control.clean_stage":"Reng\xF6ringssteg","control.control_lock":"Knappl\xE5s","control.cook_mode":"Tillagningsl\xE4ge","control.cook_timer":"Tillagningstimer","control.crisper_mode":"Gr\xF6nsaksl\xE5dans temperatur","control.cycles_until_cleaning":"Iscykler till reng\xF6ring","control.delay_left":"Pausen slutar om","control.delay_schedule":"Schema","control.delay_start":"F\xF6rdr\xF6jd start","control.delayed_shutoff":"F\xF6rdr\xF6jd avst\xE4ngning","control.dishwasher_mode":"L\xE4ge","control.dispenser":"Inbyggd vattenautomat","control.door_open_delay":"F\xF6rdr\xF6jning f\xF6r d\xF6rrlarm","control.duration":"L\xE4ngd","control.end_delay":"P\xE5g\xE5ende paus","control.extended_dry_on":"F\xF6rl\xE4ngd torkning","control.failsafe":"S\xE4kerhetsavst\xE4ngning","control.fan":"Fl\xE4kt","control.fan_sensitivity":"Automatisk fl\xE4ktk\xE4nslighet","control.fault":"Fel {code}","control.fault_code":"Kod {code}","control.fault_unknown":"Fel","control.faults":"Aktiva fel","control.filter_allowance":"Filtrets livsl\xE4ngd","control.filter_usage":"Filteranv\xE4ndning","control.gourmet":"Gourmetprogram","control.halo":"Haloljus","control.heated_dry_on":"Extra torkning","control.high_temp_wash_on":"Disk med h\xF6g temperatur","control.high_use_left":"H\xF6g anv\xE4ndning slutar om","control.humidity":"Fuktreglering","control.ice_maker":"Ismaskin","control.key_tones":"Knappljud","control.kitchen_timer":"K\xF6kstimer","control.kitchen_timer2":"K\xF6kstimer 2","control.light":"Belysning","control.max_ice_left":"Max is slutar om","control.model":"Modell","control.next_cleaning":"N\xE4sta reng\xF6ring","control.night_mode":"Nattl\xE4ge","control.operating_mode":"L\xE4ge","control.power":"Str\xF6m","control.probe":"Stektermometer","control.probe_target":"M\xE5ltemperatur f\xF6r termometern","control.remote_ready":"Remote Ready","control.remote_start":"Fj\xE4rrstart","control.reset_air_filter":"\xC5terst\xE4ll luftfiltret","control.rinse_aid":"Spolglans","control.sabbath":"Sabbatsl\xE4ge","control.sani_rinse_on":"Hygiensk\xF6ljning","control.schedule_delay":"Ny ispaus","control.service":"Service","control.shutoff_after":"St\xE4ng av efter","control.softener":"Regenereringssalt","control.starts_in":"Startar om","control.status":"Tillst\xE5nd","control.task_light":"Arbetsbelysning","control.temperature":"Temperatur","control.time_left":"Tid kvar","control.timer_finished":"Timern \xE4r klar","control.top_rack_only_on":"Endast \xF6vre korgen","control.uptime":"Drifttid","control.wash_cycle":"Diskprogram","control.water_filter":"Vattenfilter","control.water_filter_capacity":"Vattenfiltrets kapacitet","control.wifi":"Wi-Fi-signal","control.wine_temp_alert":"Temperaturlarm","control.winterized":"Vinterf\xF6rvarad","ctl.at":"Starttid","ctl.brightness":"Ljusstyrka","ctl.custom":"Anpassad","ctl.decrease":"Minska","ctl.duration":"L\xE4ngd","ctl.increase":"\xD6ka","ctl.later":"Senare i dag","ctl.minutes":"Minuter","ctl.more_info":"{name}: mer information","ctl.not_now":"Inte nu","ctl.now":"Nu","ctl.off":"Av","ctl.on":"P\xE5","ctl.repeat":"Upprepa dagligen","ctl.saving":"Sparar \u2026","ctl.schedule":"Schemal\xE4gg","ctl.set":"St\xE4ll in","ctl.speed":"Hastighet {n}","ctl.start":"B\xF6rjan","ctl.starts_in":"Startar om {time}","ctl.white":"Vit f\xE4rgton","display.starts_at":"Start {time}","event.air_filter_expired":"Luftfiltret beh\xF6ver bytas","event.cavity.cooking_timer_complete":"Tillagningstimern \xE4r klar","event.cavity.cooking_timer_under_one_minute":"Tillagningstimern har en minut kvar","event.cavity.door_ajar":"Luckan \xE4r \xF6ppen","event.cavity.preheated":"F\xF6rv\xE4rmningen \xE4r klar","event.cavity.probe_connected":"Stektermometern anv\xE4nds","event.cavity.probe_target_reached":"Stektermometern har n\xE5tt m\xE5ltemperaturen","event.cavity.probe_within_ten_degrees":"Stektermometern \xE4r inom 10 \xB0F fr\xE5n m\xE5let","event.cavity.self_clean_complete":"Reng\xF6ringen \xE4r klar","event.dishwasher_cancelled":"Diskprogrammet har avbrutits","event.dishwasher_complete":"Diskprogrammet \xE4r klart","event.dishwasher_paused":"Diskprogrammet har pausats","event.dishwasher_service_required":"Diskmaskinen beh\xF6ver service","event.dishwasher_started":"Diskprogrammet har startat","event.fault_notification":"Fel p\xE5 vitvaran","event.feedback_notification":"Beg\xE4ran om \xE5terkoppling","event.freezer_door_ajar":"Frysd\xF6rren \xE4r \xF6ppen","event.freezer_setpoint_changed":"Frysens inst\xE4llda temperatur har \xE4ndrats","event.ice_cleaning_add_descaler":"Ismaskinens reng\xF6ringscykel beh\xF6ver avkalkningsmedel","event.ice_cleaning_add_sanitizer":"Ismaskinens reng\xF6ringscykel beh\xF6ver desinfektionsmedel","event.ice_cleaning_cancelled":"Ismaskinens reng\xF6ringscykel har avbrutits","event.ice_cleaning_complete":"Ismaskinens reng\xF6ringscykel \xE4r klar","event.ice_cleaning_due_soon":"Ismaskinens reng\xF6ringscykel beh\xF6vs snart","event.ice_cleaning_required":"Ismaskinens reng\xF6ringscykel beh\xF6vs","event.ice_maker_door_ajar":"Ismaskinens lucka \xE4r \xF6ppen","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"K\xF6kstimer 2 \xE4r klar","event.kitchen_timer_2_under_one_minute":"K\xF6kstimer 2 har en minut kvar","event.kitchen_timer_complete":"K\xF6kstimern \xE4r klar","event.kitchen_timer_under_one_minute":"K\xF6kstimern har en minut kvar","event.lower_oven_cooking_timer_complete":"Nedre ugnens tillagningstimer \xE4r klar","event.lower_oven_cooking_timer_under_one_minute":"Nedre ugnens tillagningstimer har en minut kvar","event.lower_oven_door_ajar":"Nedre ugnens lucka \xE4r \xF6ppen","event.lower_oven_preheated":"Nedre ugnens f\xF6rv\xE4rmning \xE4r klar","event.lower_oven_probe_connected":"Nedre ugnens stektermometer anv\xE4nds","event.lower_oven_probe_target_reached":"Nedre ugnens stektermometer har n\xE5tt m\xE5ltemperaturen","event.lower_oven_probe_within_ten_degrees":"Nedre ugnens stektermometer \xE4r inom 10 \xB0F fr\xE5n m\xE5let","event.lower_oven_self_clean_complete":"Nedre ugnens reng\xF6ring \xE4r klar","event.oven_cooking_timer_complete":"Ugnens tillagningstimer \xE4r klar","event.oven_cooking_timer_under_one_minute":"Ugnens tillagningstimer har en minut kvar","event.oven_door_ajar":"Ugnsluckan \xE4r \xF6ppen","event.oven_preheated":"Ugnens f\xF6rv\xE4rmning \xE4r klar","event.oven_probe_connected":"Ugnens stektermometer anv\xE4nds","event.oven_probe_target_reached":"Ugnens stektermometer har n\xE5tt m\xE5ltemperaturen","event.oven_probe_within_ten_degrees":"Ugnens stektermometer \xE4r inom 10 \xB0F fr\xE5n m\xE5let","event.oven_self_clean_complete":"Ugnsreng\xF6ringen \xE4r klar","event.oven_service_required":"Ugnen beh\xF6ver service","event.refrigerator_door_ajar":"Kylsk\xE5psd\xF6rren \xE4r \xF6ppen","event.refrigerator_service_required":"Kylsk\xE5pet beh\xF6ver service","event.refrigerator_setpoint_changed":"Kylsk\xE5pets inst\xE4llda temperatur har \xE4ndrats","event.rinse_aid_low":"Spolglansen h\xE5ller p\xE5 att ta slut","event.softener_salt_low":"Avh\xE4rdningssaltet h\xE5ller p\xE5 att ta slut","event.unknown":"Ok\xE4nd","event.water_filter_expired":"Vattenfiltret beh\xF6ver bytas","event.wine_door_ajar":"Vinkylens d\xF6rr \xE4r \xF6ppen","event.wine_setpoint_changed":"Vinkylens inst\xE4llda temperatur har \xE4ndrats","event.wine_temperature_alert":"Vinkylens temperatur \xE4r utanf\xF6r intervallet","full.appearance":"Utseende","full.appliance":"Apparat","full.events_error":"Det gick inte att l\xE4sa in h\xE4ndelserna: {error}","full.events_loading":"L\xE4ser in h\xE4ndelser \u2026","full.events_more":"Visa {days} dagar","full.failed":"Det fungerade inte.","full.no_events":"Inga h\xE4ndelser de senaste {days} dagarna.","full.recent_events":"Senaste h\xE4ndelser","full.refresh":"Uppdatera","full.refresh_hint":"L\xE4ser apparatens status nu.","full.refreshing":"Uppdaterar \u2026","info.air_filter":"Luftfilter","info.cleaning":"Reng\xF6ring","info.cycle":"Program","info.delay":"Ispaus","info.ends":"Klar","info.fan":"Fl\xE4kt","info.filter":"Filter","info.ice_maker":"Ismaskin","info.light":"Belysning","info.mode":"L\xE4ge","info.model":"Modell","info.next_cleaning":"N\xE4sta reng\xF6ring","info.options":"Tillval","info.probe":"Termometer","info.set_to":"Inst\xE4lld p\xE5","info.starts":"Startar","info.status":"Tillst\xE5nd","info.water_filter":"Vattenfilter","lock.cycle_no_delay":"Det h\xE4r diskprogrammet har ingen f\xF6rdr\xF6jd start.","lock.cycle_no_option":"Det h\xE4r diskprogrammet har inte det h\xE4r tillvalet.","lock.delay_not_idle":"F\xF6rdr\xF6jd start kan bara \xE4ndras n\xE4r diskmaskinen st\xE5r still eller v\xE4ntar.","lock.proof_light":"Ugnsbelysningen \xE4r sl\xE4ckt under j\xE4sning.","lock.sabbath":"Sabbatsl\xE4get \xE4r p\xE5. St\xE4ng av det f\xF6r att \xE4ndra det h\xE4r.","lock.self_clean":"Ugnen reng\xF6r sig sj\xE4lv. Den kan bara st\xE4ngas av.","lock.wash_not_idle":"Disktillvalen kan bara \xE4ndras n\xE4r diskmaskinen st\xE5r still.","option.10_hours":"10 timmar","option.10_minutes":"10 minuter","option.11_hours":"11 timmar","option.12_hours":"12 timmar","option.1_hour":"1 timme","option.1_minute":"1 minut","option.2_hours":"2 timmar","option.2_minutes":"2 minuter","option.3_hours":"3 timmar","option.4_hours":"4 timmar","option.5_hours":"5 timmar","option.5_minutes":"5 minuter","option.6_hours":"6 timmar","option.7_hours":"7 timmar","option.8_hours":"8 timmar","option.9_hours":"9 timmar","option.add_descaler":"Fyll p\xE5 avkalkningsmedel","option.add_sanitizer":"Fyll p\xE5 desinfektionsmedel","option.auto":"Automatiskt","option.automatic":"Automatisk","option.bake":"Baka","option.bake_stone":"Baksten","option.broil":"Grilla","option.canceling":"Avbryter","option.child_lock":"Barnl\xE5s","option.cleaning_complete":"Reng\xF6ringen \xE4r klar","option.cleaning_reset_flush":"\xC5terst\xE4llning av reng\xF6ring: genomspolning","option.cleaning_reset_rinse":"\xC5terst\xE4llning av reng\xF6ring: sk\xF6ljning","option.convection":"Varmluft","option.convection_bake":"Varmluft, baka","option.convection_broil":"Varmluftsgrill","option.convection_roast":"Varmluft, steka","option.crystal_and_china":"Kristall och porslin","option.dehydrate":"Torkning","option.delayed":"F\xF6rdr\xF6jd","option.descale_clean":"Avkalkning: reng\xF6ring","option.descale_fill":"Avkalkning: fyllning","option.descale_flush":"Avkalkning: genomspolning","option.descale_rinse":"Avkalkning: sk\xF6ljning","option.disabled":"Avaktiverad","option.done":"Klar","option.drying":"Torkar","option.empty_bin":"T\xF6m beh\xE5llaren","option.enabled":"Aktiverad","option.energy":"Energisn\xE5l","option.enhanced":"F\xF6rst\xE4rkt","option.error":"Fel","option.extra_quiet":"Extra tyst","option.heavy":"Intensiv","option.high":"H\xF6g","option.high_use":"H\xF6g anv\xE4ndning","option.idle":"Redo","option.light":"L\xE4tt","option.long_vacation":"L\xE5ng semester","option.low":"L\xE5g","option.manual":"Manuell","option.manually_clean":"Reng\xF6r f\xF6r hand","option.max_ice":"Max is","option.medium":"Medel","option.night_ice":"Nattis","option.none":"Inget","option.normal":"Normalt","option.not_cleaning":"Ingen reng\xF6ring","option.off":"Av","option.on":"P\xE5","option.paused":"Pausad","option.plastics":"Plast","option.pots_and_pans":"Kastruller och pannor","option.proof":"J\xE4sning","option.quick":"Snabb","option.rinse_and_hold":"Sk\xF6ljning och v\xE4ntan","option.roast":"Steka","option.running":"P\xE5g\xE5r","option.sabbath":"Sabbat","option.sanitize_clean":"Desinficering: reng\xF6ring","option.sanitize_fill":"Desinficering: fyllning","option.sanitize_flush":"Desinficering: genomspolning","option.sanitize_rinse":"Desinficering: sk\xF6ljning","option.self_clean":"Sj\xE4lvreng\xF6ring","option.short_vacation":"Kort semester","option.soak_and_scrub":"Bl\xF6tl\xE4ggning och skurning","option.warm":"Varmh\xE5llning","pill.cleaning":"Reng\xF6r","pill.cleaning_due":"Reng\xF6ring beh\xF6vs","pill.cooking":"Tillagar","pill.delayed_shutoff":"F\xF6rdr\xF6jd avst\xE4ngning","pill.door_open":"D\xF6rren \xF6ppen","pill.door_open_for":"D\xF6rren \xF6ppen \xB7 {time}","pill.fan":"Fl\xE4kt {speed}","pill.high_use":"H\xF6g anv\xE4ndning","pill.light":"Belysning p\xE5","pill.making_ice":"G\xF6r is","pill.normal":"Normalt","pill.off":"Av","pill.offline":"Offline","pill.paused":"Pausad","pill.preheated":"F\xF6rv\xE4rmd","pill.preheating":"F\xF6rv\xE4rmer {pct} %","pill.remote_ready":"Remote Ready","pill.sabbath":"Sabbat","pill.self_clean":"Sj\xE4lvreng\xF6ring","pill.service":"Service beh\xF6vs","pill.temp_alert":"Temperaturlarm","pill.timer":"Timer {time}","pill.timer_done":"Timern \xE4r klar","pill.vacation":"Semester","reason.choose_mode":"V\xE4lj ett tillagningsl\xE4ge f\xF6rst.","reason.close_door":"St\xE4ng d\xF6rren f\xF6rst.","reason.close_oven_door":"St\xE4ng ugnsluckan f\xF6rst.","reason.crisper_auto":"St\xE4ll gr\xF6nsaksl\xE5dan p\xE5 Manuell f\xF6r att \xE4ndra den.","reason.dishwasher_busy":"Kan bara \xE4ndras n\xE4r diskmaskinen st\xE5r still.","reason.manual_mode":"Starta det h\xE4r l\xE4get p\xE5 ugnen.","reason.max_ice":"St\xE4ng av Max is f\xF6r att \xE4ndra frysens temperatur.","reason.mode_change_disabled":"Ugnen tar inte emot l\xE4gesbyten just nu.","reason.no_temperature":"Det h\xE4r l\xE4get har ingen temperatur att st\xE4lla in.","reason.offline":"Apparaten \xE4r offline.","reason.oven_not_ready":"Tillg\xE4nglig n\xE4r ugnen \xE4r p\xE5 eller i Remote Ready.","reason.remote_ready_dishwasher":"Sl\xE5 p\xE5 Remote Ready p\xE5 diskmaskinen f\xF6rst.","reason.remote_ready_oven":"Sl\xE5 p\xE5 Remote Ready p\xE5 ugnen f\xF6r att starta den h\xE4rifr\xE5n.","reason.set_temperature":"St\xE4ll in temperaturen f\xF6rst.","reason.start_at_oven":"Sl\xE5 p\xE5 den p\xE5 ugnen.","reason.unavailable":"Inte tillg\xE4nglig just nu.","reason.use_start":"Sl\xE5 p\xE5 den med Starta nedan.","section.cleaning":"Reng\xF6ring","section.cycle":"Diskprogram","section.delayed_shutoff":"F\xF6rdr\xF6jd avst\xE4ngning","section.details":"Detaljer","section.fan_light":"Fl\xE4kt och belysning","section.filters":"Filter och underh\xE5ll","section.ice_delay":"Ispaus","section.ice_maker":"Ismaskin","section.maintenance":"Underh\xE5ll","section.modes":"L\xE4gen","section.options":"Tillval","section.settings":"Inst\xE4llningar","section.temperatures":"Temperaturer","severity.critical":"Kritisk","severity.high":"H\xF6g","severity.low":"L\xE5g","severity.medium":"Medel","severity.undefined":"Ospecificerad","severity.unknown":"Ok\xE4nd","severity.urgent":"Br\xE5dskande","unit.days":"{n} d","unit.days_hours":"{d} d {h} tim","unit.hours":"{n} tim","unit.hours_minutes":"{h} tim {m} min","unit.minutes":"{n} min","value.alert":"Larm","value.daily_for":"Dagligen i {duration}","value.daily_from":"Dagligen fr\xE5n {time} i {duration}","value.done":"Klar","value.door_open":"D\xF6rren \xF6ppen","value.door_open_for":"D\xF6rren \xF6ppen \xB7 {time}","value.due_now":"Nu","value.due_soon":"Snart","value.ends_at":"Klar {time}","value.from_for":"Fr\xE5n {time} i {duration}","value.in_cycles":"Om {n} cykler","value.inserted":"Isatt","value.low":"L\xE5g niv\xE5","value.missing":"Saknas","value.no_faults":"Inga","value.none":"Inga","value.normal":"Normal","value.not_connected":"Inte ansluten","value.not_due":"Inte \xE4n","value.not_needed":"Beh\xF6vs inte","value.now":"Nu {temp}","value.off":"Av","value.ok":"Bra","value.on":"P\xE5","value.percent_used":"{pct} % anv\xE4nt","value.probe_close":"Inom 10 \xB0F fr\xE5n m\xE5let","value.probe_done":"M\xE5let n\xE5tt","value.replace":"Byt","value.required":"Beh\xF6vs","value.speed":"Hastighet {speed}","value.under_minute":"Under en minut","value.until":"Till {time}","wifi.excellent":"Utm\xE4rkt","wifi.fair":"Godtagbar","wifi.good":"Bra","wifi.weak":"Svag","zone.crisp":"Gr\xF6nsaksl\xE5da","zone.frz":"Frys","zone.ref":"Kylsk\xE5p","zone.ref2":"Kyll\xE5da","zone.short.crisp":"Gr\xF6nsaker","zone.short.frz":"Frys","zone.short.ref":"Kylsk\xE5p","zone.short.ref2":"L\xE5da","zone.short.wine":"Vin","zone.short.wine_lower":"Nedre","zone.short.wine_upper":"\xD6vre","zone.wine":"Vinkyl","zone.wine_lower":"Nedre zon","zone.wine_upper":"\xD6vre zon"};var ol={"action.cancel_cycle":"\u53D6\u6D88\u7A0B\u5E8F","action.cancel_schedule":"\u53D6\u6D88","action.dismiss":"\u786E\u8BA4","action.end":"\u7ED3\u675F","action.reset":"\u91CD\u7F6E","action.start":"\u542F\u52A8","action.turn_off":"\u5173\u95ED","cavity.left":"\u5DE6\u70E4\u7BB1","cavity.lower":"\u4E0B\u70E4\u7BB1","cavity.right":"\u53F3\u70E4\u7BB1","cavity.single":"\u70E4\u7BB1","cavity.upper":"\u4E0A\u70E4\u7BB1","confirm.cancel_cycle":"\u8981\u53D6\u6D88\u6D17\u6DA4\u7A0B\u5E8F\u5417\uFF1F","confirm.start.left":"\u8981\u4EE5{setting}\u542F\u52A8\u5DE6\u70E4\u7BB1\u5417\uFF1F","confirm.start.lower":"\u8981\u4EE5{setting}\u542F\u52A8\u4E0B\u70E4\u7BB1\u5417\uFF1F","confirm.start.right":"\u8981\u4EE5{setting}\u542F\u52A8\u53F3\u70E4\u7BB1\u5417\uFF1F","confirm.start.single":"\u8981\u4EE5{setting}\u542F\u52A8\u70E4\u7BB1\u5417\uFF1F","confirm.start.upper":"\u8981\u4EE5{setting}\u542F\u52A8\u4E0A\u70E4\u7BB1\u5417\uFF1F","confirm.start_dishwasher":"\u8981\u5728\u6D17\u7897\u673A\u4E0A\u542F\u52A8{cycle}\u5417\uFF1F","confirm.stop.left":"\u8981\u5173\u95ED\u5DE6\u70E4\u7BB1\u5417\uFF1F","confirm.stop.lower":"\u8981\u5173\u95ED\u4E0B\u70E4\u7BB1\u5417\uFF1F","confirm.stop.right":"\u8981\u5173\u95ED\u53F3\u70E4\u7BB1\u5417\uFF1F","confirm.stop.single":"\u8981\u5173\u95ED\u70E4\u7BB1\u5417\uFF1F","confirm.stop.upper":"\u8981\u5173\u95ED\u4E0A\u70E4\u7BB1\u5417\uFF1F","control.accent_light":"\u6C1B\u56F4\u706F","control.air_filter":"\u7A7A\u6C14\u6EE4\u7F51","control.air_purification":"\u7A7A\u6C14\u51C0\u5316","control.appliance_type":"\u7535\u5668\u7C7B\u578B","control.broil_level":"\u7099\u70E4\u6863\u4F4D","control.cancel_cycle":"\u5F53\u524D\u7A0B\u5E8F","control.cancel_delay":"\u5DF2\u5B89\u6392\u7684\u5236\u51B0\u6682\u505C","control.clean_due":"\u9700\u8981\u6E05\u6D01","control.clean_stage":"\u6E05\u6D01\u6B65\u9AA4","control.control_lock":"\u6309\u952E\u9501","control.cook_mode":"\u70F9\u996A\u6A21\u5F0F","control.cook_timer":"\u70F9\u996A\u5B9A\u65F6\u5668","control.crisper_mode":"\u679C\u852C\u76D2\u6E29\u5EA6","control.cycles_until_cleaning":"\u8DDD\u6E05\u6D01\u7684\u5236\u51B0\u6B21\u6570","control.delay_left":"\u6682\u505C\u5269\u4F59","control.delay_schedule":"\u8BA1\u5212","control.delay_start":"\u5EF6\u65F6\u542F\u52A8","control.delayed_shutoff":"\u5EF6\u65F6\u5173\u95ED","control.dishwasher_mode":"\u6A21\u5F0F","control.dispenser":"\u5185\u7F6E\u996E\u6C34\u673A","control.door_open_delay":"\u5F00\u95E8\u63D0\u9192\u5EF6\u65F6","control.duration":"\u65F6\u957F","control.end_delay":"\u5F53\u524D\u6682\u505C","control.extended_dry_on":"\u5EF6\u957F\u70D8\u5E72","control.failsafe":"\u5B89\u5168\u505C\u673A","control.fan":"\u98CE\u6247","control.fan_sensitivity":"\u98CE\u6247\u81EA\u52A8\u7075\u654F\u5EA6","control.fault":"\u6545\u969C {code}","control.fault_code":"\u4EE3\u7801 {code}","control.fault_unknown":"\u6545\u969C","control.faults":"\u5F53\u524D\u6545\u969C","control.filter_allowance":"\u6EE4\u7F51\u5BFF\u547D","control.filter_usage":"\u6EE4\u7F51\u4F7F\u7528\u65F6\u95F4","control.gourmet":"\u7F8E\u98DF\u7A0B\u5E8F","control.halo":"\u5149\u73AF\u706F","control.heated_dry_on":"\u5F3A\u529B\u70D8\u5E72","control.high_temp_wash_on":"\u9AD8\u6E29\u6D17\u6DA4","control.high_use_left":"\u9AD8\u4F7F\u7528\u6A21\u5F0F\u5269\u4F59","control.humidity":"\u6E7F\u5EA6\u63A7\u5236","control.ice_maker":"\u5236\u51B0\u673A","control.key_tones":"\u6309\u952E\u97F3","control.kitchen_timer":"\u53A8\u623F\u5B9A\u65F6\u5668","control.kitchen_timer2":"\u53A8\u623F\u5B9A\u65F6\u5668 2","control.light":"\u7167\u660E","control.max_ice_left":"\u6700\u5927\u5236\u51B0\u5269\u4F59","control.model":"\u578B\u53F7","control.next_cleaning":"\u4E0B\u6B21\u6E05\u6D01","control.night_mode":"\u591C\u95F4\u6A21\u5F0F","control.operating_mode":"\u6A21\u5F0F","control.power":"\u7535\u6E90","control.probe":"\u6E29\u5EA6\u63A2\u9488","control.probe_target":"\u63A2\u9488\u76EE\u6807\u6E29\u5EA6","control.remote_ready":"Remote Ready","control.remote_start":"\u8FDC\u7A0B\u542F\u52A8","control.reset_air_filter":"\u91CD\u7F6E\u7A7A\u6C14\u6EE4\u7F51","control.rinse_aid":"\u5149\u4EAE\u5242","control.sabbath":"\u5B89\u606F\u65E5\u6A21\u5F0F","control.sani_rinse_on":"\u6D88\u6BD2\u6F02\u6D17","control.schedule_delay":"\u65B0\u7684\u5236\u51B0\u6682\u505C","control.service":"\u7EF4\u4FEE","control.shutoff_after":"\u5173\u95ED\u65F6\u95F4","control.softener":"\u8F6F\u6C34\u76D0","control.starts_in":"\u8DDD\u5F00\u59CB","control.status":"\u72B6\u6001","control.task_light":"\u5DE5\u4F5C\u706F","control.temperature":"\u6E29\u5EA6","control.time_left":"\u5269\u4F59\u65F6\u95F4","control.timer_finished":"\u5B9A\u65F6\u7ED3\u675F","control.top_rack_only_on":"\u4EC5\u4E0A\u5C42\u7897\u7BEE","control.uptime":"\u8FD0\u884C\u65F6\u95F4","control.wash_cycle":"\u6D17\u6DA4\u7A0B\u5E8F","control.water_filter":"\u6EE4\u6C34\u5668","control.water_filter_capacity":"\u6EE4\u6C34\u5668\u5269\u4F59\u5BB9\u91CF","control.wifi":"Wi-Fi \u4FE1\u53F7","control.wine_temp_alert":"\u6E29\u5EA6\u8B66\u62A5","control.winterized":"\u8D8A\u51AC\u6A21\u5F0F","ctl.at":"\u5F00\u59CB\u65F6\u95F4","ctl.brightness":"\u4EAE\u5EA6","ctl.custom":"\u81EA\u5B9A\u4E49","ctl.decrease":"\u964D\u4F4E","ctl.duration":"\u65F6\u957F","ctl.increase":"\u63D0\u9AD8","ctl.later":"\u4ECA\u5929\u7A0D\u540E","ctl.minutes":"\u5206\u949F","ctl.more_info":"{name}\uFF1A\u66F4\u591A\u4FE1\u606F","ctl.not_now":"\u6682\u4E0D","ctl.now":"\u7ACB\u5373","ctl.off":"\u5173","ctl.on":"\u5F00","ctl.repeat":"\u6BCF\u5929\u91CD\u590D","ctl.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","ctl.schedule":"\u5B89\u6392","ctl.set":"\u8BBE\u7F6E","ctl.speed":"{n} \u6863","ctl.start":"\u5F00\u59CB","ctl.starts_in":"{time}\u540E\u5F00\u59CB","ctl.white":"\u8272\u6E29","display.starts_at":"{time} \u5F00\u59CB","event.air_filter_expired":"\u7A7A\u6C14\u8FC7\u6EE4\u5668\u5DF2\u5230\u671F","event.cavity.cooking_timer_complete":"\u70F9\u996A\u5B9A\u65F6\u5668\u7ED3\u675F","event.cavity.cooking_timer_under_one_minute":"\u70F9\u996A\u5B9A\u65F6\u5668\u5269\u4F59\u4E00\u5206\u949F","event.cavity.door_ajar":"\u95E8\u672A\u5173","event.cavity.preheated":"\u9884\u70ED\u5B8C\u6210","event.cavity.probe_connected":"\u63A2\u9488\u4F7F\u7528\u4E2D","event.cavity.probe_target_reached":"\u63A2\u9488\u5DF2\u8FBE\u5230\u76EE\u6807\u6E29\u5EA6","event.cavity.probe_within_ten_degrees":"\u63A2\u9488\u6E29\u5EA6\u8DDD\u76EE\u6807\u4E0D\u8DB3 10\xB0F","event.cavity.self_clean_complete":"\u6E05\u6D01\u5B8C\u6210","event.dishwasher_cancelled":"\u6D17\u6DA4\u7A0B\u5E8F\u5DF2\u53D6\u6D88","event.dishwasher_complete":"\u6D17\u6DA4\u7A0B\u5E8F\u5DF2\u5B8C\u6210","event.dishwasher_paused":"\u6D17\u6DA4\u7A0B\u5E8F\u5DF2\u4E2D\u65AD","event.dishwasher_service_required":"\u6D17\u7897\u673A\u9700\u8981\u7EF4\u4FEE","event.dishwasher_started":"\u6D17\u6DA4\u7A0B\u5E8F\u5DF2\u5F00\u59CB","event.fault_notification":"\u7535\u5668\u6545\u969C","event.feedback_notification":"\u53CD\u9988\u8BF7\u6C42","event.freezer_door_ajar":"\u51B7\u51BB\u5BA4\u95E8\u672A\u5173","event.freezer_setpoint_changed":"\u51B7\u51BB\u5BA4\u8BBE\u5B9A\u6E29\u5EA6\u5DF2\u66F4\u6539","event.ice_cleaning_add_descaler":"\u5236\u51B0\u673A\u6E05\u6D01\u7A0B\u5E8F\u9700\u8981\u6DFB\u52A0\u9664\u57A2\u5242","event.ice_cleaning_add_sanitizer":"\u5236\u51B0\u673A\u6E05\u6D01\u7A0B\u5E8F\u9700\u8981\u6DFB\u52A0\u6D88\u6BD2\u5242","event.ice_cleaning_cancelled":"\u5236\u51B0\u673A\u6E05\u6D01\u7A0B\u5E8F\u5DF2\u53D6\u6D88","event.ice_cleaning_complete":"\u5236\u51B0\u673A\u6E05\u6D01\u7A0B\u5E8F\u5DF2\u5B8C\u6210","event.ice_cleaning_due_soon":"\u5236\u51B0\u673A\u5373\u5C06\u9700\u8981\u6E05\u6D01","event.ice_cleaning_required":"\u5236\u51B0\u673A\u9700\u8981\u6E05\u6D01","event.ice_maker_door_ajar":"\u5236\u51B0\u673A\u95E8\u672A\u5173","event.in_cavity":"{cavity} \xB7 {event}","event.kitchen_timer_2_complete":"\u53A8\u623F\u5B9A\u65F6\u5668 2 \u7ED3\u675F","event.kitchen_timer_2_under_one_minute":"\u53A8\u623F\u5B9A\u65F6\u5668 2 \u5269\u4F59\u4E00\u5206\u949F","event.kitchen_timer_complete":"\u53A8\u623F\u5B9A\u65F6\u5668\u7ED3\u675F","event.kitchen_timer_under_one_minute":"\u53A8\u623F\u5B9A\u65F6\u5668\u5269\u4F59\u4E00\u5206\u949F","event.lower_oven_cooking_timer_complete":"\u4E0B\u70E4\u7BB1\u70F9\u996A\u5B9A\u65F6\u5668\u7ED3\u675F","event.lower_oven_cooking_timer_under_one_minute":"\u4E0B\u70E4\u7BB1\u70F9\u996A\u5B9A\u65F6\u5668\u5269\u4F59\u4E00\u5206\u949F","event.lower_oven_door_ajar":"\u4E0B\u70E4\u7BB1\u95E8\u672A\u5173","event.lower_oven_preheated":"\u4E0B\u70E4\u7BB1\u9884\u70ED\u5B8C\u6210","event.lower_oven_probe_connected":"\u4E0B\u70E4\u7BB1\u63A2\u9488\u4F7F\u7528\u4E2D","event.lower_oven_probe_target_reached":"\u4E0B\u70E4\u7BB1\u63A2\u9488\u5DF2\u8FBE\u5230\u76EE\u6807\u6E29\u5EA6","event.lower_oven_probe_within_ten_degrees":"\u4E0B\u70E4\u7BB1\u63A2\u9488\u6E29\u5EA6\u8DDD\u76EE\u6807\u4E0D\u8DB3 10\xB0F","event.lower_oven_self_clean_complete":"\u4E0B\u70E4\u7BB1\u6E05\u6D01\u5B8C\u6210","event.oven_cooking_timer_complete":"\u70E4\u7BB1\u70F9\u996A\u5B9A\u65F6\u5668\u7ED3\u675F","event.oven_cooking_timer_under_one_minute":"\u70E4\u7BB1\u70F9\u996A\u5B9A\u65F6\u5668\u5269\u4F59\u4E00\u5206\u949F","event.oven_door_ajar":"\u70E4\u7BB1\u95E8\u672A\u5173","event.oven_preheated":"\u70E4\u7BB1\u9884\u70ED\u5B8C\u6210","event.oven_probe_connected":"\u70E4\u7BB1\u63A2\u9488\u4F7F\u7528\u4E2D","event.oven_probe_target_reached":"\u70E4\u7BB1\u63A2\u9488\u5DF2\u8FBE\u5230\u76EE\u6807\u6E29\u5EA6","event.oven_probe_within_ten_degrees":"\u70E4\u7BB1\u63A2\u9488\u6E29\u5EA6\u8DDD\u76EE\u6807\u4E0D\u8DB3 10\xB0F","event.oven_self_clean_complete":"\u70E4\u7BB1\u6E05\u6D01\u5B8C\u6210","event.oven_service_required":"\u70E4\u7BB1\u9700\u8981\u7EF4\u4FEE","event.refrigerator_door_ajar":"\u51B0\u7BB1\u95E8\u672A\u5173","event.refrigerator_service_required":"\u51B0\u7BB1\u9700\u8981\u7EF4\u4FEE","event.refrigerator_setpoint_changed":"\u51B0\u7BB1\u8BBE\u5B9A\u6E29\u5EA6\u5DF2\u66F4\u6539","event.rinse_aid_low":"\u5149\u4EAE\u5242\u4E0D\u8DB3","event.softener_salt_low":"\u8F6F\u6C34\u76D0\u4E0D\u8DB3","event.unknown":"\u672A\u77E5","event.water_filter_expired":"\u6EE4\u6C34\u5668\u5DF2\u5230\u671F","event.wine_door_ajar":"\u9152\u67DC\u95E8\u672A\u5173","event.wine_setpoint_changed":"\u9152\u67DC\u8BBE\u5B9A\u6E29\u5EA6\u5DF2\u66F4\u6539","event.wine_temperature_alert":"\u9152\u67DC\u6E29\u5EA6\u8D85\u51FA\u8303\u56F4","full.appearance":"\u5916\u89C2","full.appliance":"\u7535\u5668","full.events_error":"\u65E0\u6CD5\u52A0\u8F7D\u4E8B\u4EF6\uFF1A{error}","full.events_loading":"\u6B63\u5728\u52A0\u8F7D\u4E8B\u4EF6\u2026","full.events_more":"\u663E\u793A {days} \u5929","full.failed":"\u64CD\u4F5C\u672A\u6210\u529F\u3002","full.no_events":"\u8FC7\u53BB {days} \u5929\u6CA1\u6709\u4E8B\u4EF6\u3002","full.recent_events":"\u6700\u8FD1\u4E8B\u4EF6","full.refresh":"\u5237\u65B0","full.refresh_hint":"\u7ACB\u5373\u8BFB\u53D6\u7535\u5668\u72B6\u6001\u3002","full.refreshing":"\u6B63\u5728\u5237\u65B0\u2026","info.air_filter":"\u7A7A\u6C14\u6EE4\u7F51","info.cleaning":"\u6E05\u6D01","info.cycle":"\u7A0B\u5E8F","info.delay":"\u5236\u51B0\u6682\u505C","info.ends":"\u7ED3\u675F","info.fan":"\u98CE\u6247","info.filter":"\u6EE4\u7F51","info.ice_maker":"\u5236\u51B0\u673A","info.light":"\u7167\u660E","info.mode":"\u6A21\u5F0F","info.model":"\u578B\u53F7","info.next_cleaning":"\u4E0B\u6B21\u6E05\u6D01","info.options":"\u9009\u9879","info.probe":"\u63A2\u9488","info.set_to":"\u8BBE\u5B9A","info.starts":"\u5F00\u59CB","info.status":"\u72B6\u6001","info.water_filter":"\u6EE4\u6C34\u5668","lock.cycle_no_delay":"\u6B64\u6D17\u6DA4\u7A0B\u5E8F\u4E0D\u63D0\u4F9B\u5EF6\u65F6\u542F\u52A8\u3002","lock.cycle_no_option":"\u6B64\u6D17\u6DA4\u7A0B\u5E8F\u4E0D\u63D0\u4F9B\u8BE5\u9009\u9879\u3002","lock.delay_not_idle":"\u53EA\u6709\u5728\u6D17\u7897\u673A\u5F85\u673A\u6216\u7B49\u5F85\u542F\u52A8\u65F6\u624D\u80FD\u66F4\u6539\u5EF6\u65F6\u542F\u52A8\u3002","lock.proof_light":"\u53D1\u9175\u671F\u95F4\u70E4\u7BB1\u706F\u4FDD\u6301\u5173\u95ED\u3002","lock.sabbath":"\u5B89\u606F\u65E5\u6A21\u5F0F\u5DF2\u5F00\u542F\u3002\u8BF7\u5148\u5173\u95ED\u5B83\u518D\u66F4\u6539\u6B64\u9879\u3002","lock.self_clean":"\u70E4\u7BB1\u6B63\u5728\u81EA\u6E05\u6D01\uFF0C\u53EA\u80FD\u5173\u95ED\u3002","lock.wash_not_idle":"\u53EA\u6709\u5728\u6D17\u7897\u673A\u5F85\u673A\u65F6\u624D\u80FD\u66F4\u6539\u6D17\u6DA4\u9009\u9879\u3002","option.10_hours":"10 \u5C0F\u65F6","option.10_minutes":"10 \u5206\u949F","option.11_hours":"11 \u5C0F\u65F6","option.12_hours":"12 \u5C0F\u65F6","option.1_hour":"1 \u5C0F\u65F6","option.1_minute":"1 \u5206\u949F","option.2_hours":"2 \u5C0F\u65F6","option.2_minutes":"2 \u5206\u949F","option.3_hours":"3 \u5C0F\u65F6","option.4_hours":"4 \u5C0F\u65F6","option.5_hours":"5 \u5C0F\u65F6","option.5_minutes":"5 \u5206\u949F","option.6_hours":"6 \u5C0F\u65F6","option.7_hours":"7 \u5C0F\u65F6","option.8_hours":"8 \u5C0F\u65F6","option.9_hours":"9 \u5C0F\u65F6","option.add_descaler":"\u6DFB\u52A0\u9664\u57A2\u5242","option.add_sanitizer":"\u6DFB\u52A0\u6D88\u6BD2\u5242","option.auto":"\u81EA\u52A8","option.automatic":"\u81EA\u52A8","option.bake":"\u70D8\u7119","option.bake_stone":"\u70D8\u7119\u77F3","option.broil":"\u7099\u70E4","option.canceling":"\u6B63\u5728\u53D6\u6D88","option.child_lock":"\u7AE5\u9501","option.cleaning_complete":"\u6E05\u6D01\u5B8C\u6210","option.cleaning_reset_flush":"\u6E05\u6D01\u590D\u4F4D\uFF1A\u51B2\u6D17","option.cleaning_reset_rinse":"\u6E05\u6D01\u590D\u4F4D\uFF1A\u6F02\u6D17","option.convection":"\u5BF9\u6D41","option.convection_bake":"\u5BF9\u6D41\u70D8\u7119","option.convection_broil":"\u5BF9\u6D41\u7099\u70E4","option.convection_roast":"\u5BF9\u6D41\u70E4\u8089","option.crystal_and_china":"\u6C34\u6676\u548C\u74F7\u5668","option.dehydrate":"\u70D8\u5E72","option.delayed":"\u5DF2\u5EF6\u65F6","option.descale_clean":"\u9664\u57A2\uFF1A\u6E05\u6D01","option.descale_fill":"\u9664\u57A2\uFF1A\u6CE8\u6C34","option.descale_flush":"\u9664\u57A2\uFF1A\u51B2\u6D17","option.descale_rinse":"\u9664\u57A2\uFF1A\u6F02\u6D17","option.disabled":"\u5DF2\u7981\u7528","option.done":"\u5DF2\u5B8C\u6210","option.drying":"\u70D8\u5E72\u4E2D","option.empty_bin":"\u6E05\u7A7A\u50A8\u51B0\u76D2","option.enabled":"\u5DF2\u542F\u7528","option.energy":"\u8282\u80FD","option.enhanced":"\u589E\u5F3A","option.error":"\u9519\u8BEF","option.extra_quiet":"\u8D85\u9759\u97F3","option.heavy":"\u5F3A\u529B","option.high":"\u9AD8","option.high_use":"\u9AD8\u4F7F\u7528","option.idle":"\u5F85\u673A","option.light":"\u8F7B\u67D4","option.long_vacation":"\u957F\u671F\u5EA6\u5047","option.low":"\u4F4E","option.manual":"\u624B\u52A8","option.manually_clean":"\u624B\u52A8\u6E05\u6D01","option.max_ice":"\u6700\u5927\u5236\u51B0","option.medium":"\u4E2D","option.night_ice":"\u591C\u95F4\u5236\u51B0","option.none":"\u65E0","option.normal":"\u6B63\u5E38","option.not_cleaning":"\u672A\u5728\u6E05\u6D01","option.off":"\u5173","option.on":"\u5F00","option.paused":"\u5DF2\u6682\u505C","option.plastics":"\u5851\u6599","option.pots_and_pans":"\u9505\u5177","option.proof":"\u53D1\u9175","option.quick":"\u5FEB\u901F","option.rinse_and_hold":"\u9884\u51B2\u6D17","option.roast":"\u70E4\u8089","option.running":"\u8FD0\u884C\u4E2D","option.sabbath":"\u5B89\u606F\u65E5","option.sanitize_clean":"\u6D88\u6BD2\uFF1A\u6E05\u6D01","option.sanitize_fill":"\u6D88\u6BD2\uFF1A\u6CE8\u6C34","option.sanitize_flush":"\u6D88\u6BD2\uFF1A\u51B2\u6D17","option.sanitize_rinse":"\u6D88\u6BD2\uFF1A\u6F02\u6D17","option.self_clean":"\u81EA\u6E05\u6D01","option.short_vacation":"\u77ED\u671F\u5EA6\u5047","option.soak_and_scrub":"\u6D78\u6CE1\u5237\u6D17","option.warm":"\u4FDD\u6E29","pill.cleaning":"\u6B63\u5728\u6E05\u6D01","pill.cleaning_due":"\u9700\u8981\u6E05\u6D01","pill.cooking":"\u6B63\u5728\u70F9\u996A","pill.delayed_shutoff":"\u5EF6\u65F6\u5173\u95ED","pill.door_open":"\u95E8\u672A\u5173","pill.door_open_for":"\u95E8\u672A\u5173 \xB7 {time}","pill.fan":"\u98CE\u6247 {speed} \u6863","pill.high_use":"\u9AD8\u4F7F\u7528\u6A21\u5F0F","pill.light":"\u706F\u5DF2\u5F00","pill.making_ice":"\u6B63\u5728\u5236\u51B0","pill.normal":"\u6B63\u5E38","pill.off":"\u5173","pill.offline":"\u79BB\u7EBF","pill.paused":"\u5DF2\u6682\u505C","pill.preheated":"\u5DF2\u9884\u70ED","pill.preheating":"\u9884\u70ED\u4E2D {pct}%","pill.remote_ready":"Remote Ready","pill.sabbath":"\u5B89\u606F\u65E5","pill.self_clean":"\u81EA\u6E05\u6D01","pill.service":"\u9700\u7EF4\u4FEE","pill.temp_alert":"\u6E29\u5EA6\u8B66\u62A5","pill.timer":"\u5B9A\u65F6 {time}","pill.timer_done":"\u5B9A\u65F6\u7ED3\u675F","pill.vacation":"\u5EA6\u5047","reason.choose_mode":"\u8BF7\u5148\u9009\u62E9\u70F9\u996A\u6A21\u5F0F\u3002","reason.close_door":"\u8BF7\u5148\u5173\u4E0A\u95E8\u3002","reason.close_oven_door":"\u8BF7\u5148\u5173\u4E0A\u70E4\u7BB1\u95E8\u3002","reason.crisper_auto":"\u8BF7\u5C06\u679C\u852C\u76D2\u8BBE\u4E3A\u624B\u52A8\u540E\u518D\u66F4\u6539\u3002","reason.dishwasher_busy":"\u53EA\u6709\u5728\u6D17\u7897\u673A\u5F85\u673A\u65F6\u624D\u80FD\u66F4\u6539\u3002","reason.manual_mode":"\u8BF7\u5728\u70E4\u7BB1\u4E0A\u542F\u52A8\u6B64\u6A21\u5F0F\u3002","reason.max_ice":"\u8BF7\u5148\u5173\u95ED\u6700\u5927\u5236\u51B0\u518D\u66F4\u6539\u51B7\u51BB\u5BA4\u6E29\u5EA6\u3002","reason.mode_change_disabled":"\u70E4\u7BB1\u76EE\u524D\u4E0D\u63A5\u53D7\u66F4\u6539\u6A21\u5F0F\u3002","reason.no_temperature":"\u6B64\u6A21\u5F0F\u6CA1\u6709\u53EF\u8BBE\u7F6E\u7684\u6E29\u5EA6\u3002","reason.offline":"\u7535\u5668\u5DF2\u79BB\u7EBF\u3002","reason.oven_not_ready":"\u70E4\u7BB1\u5F00\u542F\u6216\u5904\u4E8E Remote Ready \u65F6\u53EF\u7528\u3002","reason.remote_ready_dishwasher":"\u8BF7\u5148\u5728\u6D17\u7897\u673A\u4E0A\u5F00\u542F Remote Ready\u3002","reason.remote_ready_oven":"\u8BF7\u5728\u70E4\u7BB1\u4E0A\u5F00\u542F Remote Ready\uFF0C\u624D\u80FD\u4ECE\u8FD9\u91CC\u542F\u52A8\u3002","reason.set_temperature":"\u8BF7\u5148\u8BBE\u7F6E\u6E29\u5EA6\u3002","reason.start_at_oven":"\u8BF7\u5728\u70E4\u7BB1\u4E0A\u5F00\u542F\u3002","reason.unavailable":"\u6682\u65F6\u4E0D\u53EF\u7528\u3002","reason.use_start":"\u8BF7\u4F7F\u7528\u4E0B\u65B9\u7684\u201C\u542F\u52A8\u201D\u5F00\u542F\u3002","section.cleaning":"\u6E05\u6D01","section.cycle":"\u6D17\u6DA4\u7A0B\u5E8F","section.delayed_shutoff":"\u5EF6\u65F6\u5173\u95ED","section.details":"\u8BE6\u7EC6\u4FE1\u606F","section.fan_light":"\u98CE\u6247\u548C\u7167\u660E","section.filters":"\u6EE4\u7F51\u548C\u4FDD\u517B","section.ice_delay":"\u5236\u51B0\u6682\u505C","section.ice_maker":"\u5236\u51B0\u673A","section.maintenance":"\u4FDD\u517B","section.modes":"\u6A21\u5F0F","section.options":"\u9009\u9879","section.settings":"\u8BBE\u7F6E","section.temperatures":"\u6E29\u5EA6","severity.critical":"\u4E25\u91CD","severity.high":"\u9AD8","severity.low":"\u4F4E","severity.medium":"\u4E2D","severity.undefined":"\u672A\u6307\u5B9A","severity.unknown":"\u672A\u77E5","severity.urgent":"\u7D27\u6025","unit.days":"{n} \u5929","unit.days_hours":"{d} \u5929 {h} \u5C0F\u65F6","unit.hours":"{n} \u5C0F\u65F6","unit.hours_minutes":"{h} \u5C0F\u65F6 {m} \u5206\u949F","unit.minutes":"{n} \u5206\u949F","value.alert":"\u8B66\u62A5","value.daily_for":"\u6BCF\u5929 {duration}","value.daily_from":"\u6BCF\u5929 {time} \u8D77\uFF0C\u6301\u7EED {duration}","value.done":"\u5B8C\u6210","value.door_open":"\u95E8\u672A\u5173","value.door_open_for":"\u95E8\u672A\u5173 \xB7 {time}","value.due_now":"\u73B0\u5728","value.due_soon":"\u5373\u5C06","value.ends_at":"{time} \u7ED3\u675F","value.from_for":"{time} \u8D77\uFF0C\u6301\u7EED {duration}","value.in_cycles":"{n} \u6B21\u540E","value.inserted":"\u5DF2\u5B89\u88C5","value.low":"\u4E0D\u8DB3","value.missing":"\u672A\u5B89\u88C5","value.no_faults":"\u65E0","value.none":"\u65E0","value.normal":"\u6B63\u5E38","value.not_connected":"\u672A\u8FDE\u63A5","value.not_due":"\u6682\u4E0D\u9700\u8981","value.not_needed":"\u4E0D\u9700\u8981","value.now":"\u5F53\u524D {temp}","value.off":"\u5173","value.ok":"\u6B63\u5E38","value.on":"\u5F00","value.percent_used":"\u5DF2\u7528 {pct}%","value.probe_close":"\u8DDD\u76EE\u6807 10\xB0F \u4EE5\u5185","value.probe_done":"\u5DF2\u8FBE\u76EE\u6807","value.replace":"\u9700\u66F4\u6362","value.required":"\u9700\u8981","value.speed":"{speed} \u6863","value.under_minute":"\u4E0D\u5230\u4E00\u5206\u949F","value.until":"\u81F3 {time}","wifi.excellent":"\u6781\u597D","wifi.fair":"\u4E00\u822C","wifi.good":"\u826F\u597D","wifi.weak":"\u5F31","zone.crisp":"\u679C\u852C\u76D2","zone.frz":"\u51B7\u51BB\u5BA4","zone.ref":"\u51B7\u85CF\u5BA4","zone.ref2":"\u51B7\u85CF\u62BD\u5C49","zone.short.crisp":"\u679C\u852C","zone.short.frz":"\u51B7\u51BB","zone.short.ref":"\u51B7\u85CF","zone.short.ref2":"\u62BD\u5C49","zone.short.wine":"\u9152\u67DC","zone.short.wine_lower":"\u4E0B\u5C42","zone.short.wine_upper":"\u4E0A\u5C42","zone.wine":"\u9152\u67DC","zone.wine_lower":"\u4E0B\u5C42\u533A\u57DF","zone.wine_upper":"\u4E0A\u5C42\u533A\u57DF"};var il={"panel.title":"Sub-Zero","panel.menu":"Seitenleiste \xF6ffnen","panel.back":"Zur\xFCck","overview.no_area":"Kein Bereich","overview.loading":"Hausger\xE4te werden geladen \u2026","overview.error_title":"Die Hausger\xE4te konnten nicht geladen werden","overview.retry":"Erneut versuchen","overview.empty_title":"Noch keine Hausger\xE4te","overview.empty_text":"Hausger\xE4te erscheinen hier, sobald die Sub-Zero-Integration sie hinzugef\xFCgt hat. F\xFCge ein Konto hinzu oder w\xE4hle Hausger\xE4te in ihren Einstellungen aus.","overview.empty_text_user":"Hausger\xE4te erscheinen hier, sobald ein Administrator sie zur Sub-Zero-Integration hinzugef\xFCgt hat.","overview.empty_link":"Sub-Zero-Einstellungen \xF6ffnen","overview.not_found_title":"Hausger\xE4t nicht gefunden","overview.not_found_text":"Dieses Hausger\xE4t geh\xF6rt nicht mehr zur Sub-Zero-Integration, oder der Link ist falsch.","overview.back":"Zur\xFCck zu allen Hausger\xE4ten","card.label":"{name}, {status}. Alle Bedienelemente anzeigen","appearance.hint":"So wird dieses Hausger\xE4t im Panel dargestellt \u2013 f\xFCr alle, die es nutzen.","appearance.admin_only":"Nur Administratoren k\xF6nnen die Darstellung eines Hausger\xE4ts \xE4ndern.","appearance.preview":"Vorschau","appearance.finish":"Oberfl\xE4che","appearance.panel_color":"Frontfarbe","appearance.panel_color_value":"Frontfarbe {color}","appearance.custom_color":"Eigene Farbe","panel_color.white":"Wei\xDF","panel_color.cream":"Creme","panel_color.gray":"Grau","panel_color.navy":"Marineblau","panel_color.sage":"Salbeigr\xFCn","panel_color.black":"Schwarz","panel_color.walnut":"Nussbaum","panel_color.oak":"Eiche","appearance.knobs":"Knebel","appearance.handle":"Griffe","appearance.style":"Stil","appearance.form":"Bauform","appearance.detected":"{form} (erkannt)","appearance.reset":"Auf Standard zur\xFCcksetzen","appearance.reset_confirm":"Die Darstellung dieses Hausger\xE4ts f\xFCr alle auf den Standard zur\xFCcksetzen?","appearance.reset_action":"Zur\xFCcksetzen","appearance.save":"Speichern","appearance.saving":"Wird gespeichert \u2026","appearance.saved":"Gespeichert.","appearance.error":"Speichern fehlgeschlagen: {message}","finish.stainless":"Edelstahl","finish.panel":"F\xFCr M\xF6belfront","finish.black":"Schwarz","finish.carbon":"Carbon-Edelstahl","finish.white":"Wei\xDF","knobs.red":"Rot","knobs.black":"Schwarz","knobs.stainless":"Geb\xFCrsteter Edelstahl","handle.tubular":"Stangengriff","handle.pro":"Profi-Griff","handle.none":"Ohne","style.professional":"Profi","style.transitional":"Klassisch-modern","style.contemporary":"Modern","family.refrigeration":"K\xFChlger\xE4t","family.range":"Standherd","family.wall_oven":"Einbaubackofen","family.hood":"Dunstabzugshaube","family.dishwasher":"Geschirrsp\xFCler","family.generic":"Hausger\xE4t","form.side_by_side":"Side-by-Side","form.french_door":"French Door","form.over_under":"K\xFChl-Gefrier-Kombination","form.column_refrigerator":"K\xFChls\xE4ule","form.column_freezer":"Gefriers\xE4ule","form.column_wine":"Weins\xE4ule","form.tall_refrigerator":"Hoher K\xFChlschrank","form.tall_freezer":"Hoher Gefrierschrank","form.tall_over_under":"Hohe K\xFChl-Gefrier-Kombination","form.wine_over_drawers":"Weinschrank mit Schubladen","form.undercounter_refrigerator":"Unterbau-K\xFChlschrank","form.undercounter_beverage":"Unterbau-Getr\xE4nkek\xFChlschrank","form.undercounter_wine":"Unterbau-Weinschrank","form.undercounter_drawers":"Unterbau-Schubladen","form.ice_maker":"Eisbereiter","form.range":"Standherd","form.single":"Einfacher Einbaubackofen","form.double":"Doppelter Einbaubackofen","form.wall":"Wandhaube","form.island":"Inselhaube","form.insert":"L\xFCftereinsatz","form.hood":"Dunstabzugshaube","form.dishwasher":"Geschirrsp\xFCler","form.refrigerator":"K\xFChlschrank","form.wine":"Weinschrank","form.oven":"Backofen","form.appliance":"Hausger\xE4t"};var al={"panel.title":"Sub-Zero","panel.menu":"Open the sidebar","panel.back":"Back","overview.no_area":"No area","overview.loading":"Loading appliances\u2026","overview.error_title":"Couldn't load the appliances","overview.retry":"Try again","overview.empty_title":"No appliances yet","overview.empty_text":"Appliances appear here once the Sub-Zero integration has added them. Add an account, or choose appliances in its settings.","overview.empty_text_user":"Appliances appear here once an administrator has added them to the Sub-Zero integration.","overview.empty_link":"Open Sub-Zero settings","overview.not_found_title":"Appliance not found","overview.not_found_text":"This appliance isn't in the Sub-Zero integration any more, or the link is wrong.","overview.back":"Back to all appliances","card.label":"{name}, {status}. Show all controls","appearance.hint":"How this appliance is drawn in the panel, for everyone who uses it.","appearance.admin_only":"Only administrators can change how an appliance is drawn.","appearance.preview":"Preview","appearance.finish":"Finish","appearance.panel_color":"Panel color","appearance.panel_color_value":"Panel color {color}","appearance.custom_color":"Custom color","panel_color.white":"White","panel_color.cream":"Cream","panel_color.gray":"Gray","panel_color.navy":"Navy","panel_color.sage":"Sage","panel_color.black":"Black","panel_color.walnut":"Walnut","panel_color.oak":"Oak","appearance.knobs":"Knobs","appearance.handle":"Handles","appearance.style":"Style","appearance.form":"Type","appearance.detected":"{form} (detected)","appearance.reset":"Reset to defaults","appearance.reset_confirm":"Reset how this appliance looks to the defaults, for everyone?","appearance.reset_action":"Reset","appearance.save":"Save","appearance.saving":"Saving\u2026","appearance.saved":"Saved.","appearance.error":"Couldn't save: {message}","finish.stainless":"Stainless steel","finish.panel":"Panel-ready","finish.black":"Black","finish.carbon":"Carbon stainless","finish.white":"White","knobs.red":"Red","knobs.black":"Black","knobs.stainless":"Brushed stainless","handle.tubular":"Tubular","handle.pro":"Pro","handle.none":"None","style.professional":"Professional","style.transitional":"Transitional","style.contemporary":"Contemporary","family.refrigeration":"Refrigeration","family.range":"Range","family.wall_oven":"Wall oven","family.hood":"Ventilation hood","family.dishwasher":"Dishwasher","family.generic":"Appliance","form.side_by_side":"Side-by-side","form.french_door":"French door","form.over_under":"Over-and-under","form.column_refrigerator":"Refrigerator column","form.column_freezer":"Freezer column","form.column_wine":"Wine column","form.tall_refrigerator":"Tall refrigerator","form.tall_freezer":"Tall freezer","form.tall_over_under":"Tall over-and-under","form.wine_over_drawers":"Wine storage over drawers","form.undercounter_refrigerator":"Undercounter refrigerator","form.undercounter_beverage":"Undercounter beverage center","form.undercounter_wine":"Undercounter wine storage","form.undercounter_drawers":"Undercounter drawers","form.ice_maker":"Ice maker","form.range":"Range","form.single":"Single wall oven","form.double":"Double wall oven","form.wall":"Wall hood","form.island":"Island hood","form.insert":"Hood insert","form.hood":"Hood","form.dishwasher":"Dishwasher","form.refrigerator":"Refrigerator","form.wine":"Wine storage","form.oven":"Oven","form.appliance":"Appliance"};var sl={"panel.title":"Sub-Zero","panel.menu":"Abrir la barra lateral","panel.back":"Atr\xE1s","overview.no_area":"Sin \xE1rea","overview.loading":"Cargando electrodom\xE9sticos\u2026","overview.error_title":"No se pudieron cargar los electrodom\xE9sticos","overview.retry":"Reintentar","overview.empty_title":"A\xFAn no hay electrodom\xE9sticos","overview.empty_text":"Los electrodom\xE9sticos aparecen aqu\xED cuando la integraci\xF3n Sub-Zero los ha a\xF1adido. A\xF1ade una cuenta o elige electrodom\xE9sticos en su configuraci\xF3n.","overview.empty_text_user":"Los electrodom\xE9sticos aparecen aqu\xED cuando un administrador los ha a\xF1adido a la integraci\xF3n Sub-Zero.","overview.empty_link":"Abrir la configuraci\xF3n de Sub-Zero","overview.not_found_title":"Electrodom\xE9stico no encontrado","overview.not_found_text":"Este electrodom\xE9stico ya no forma parte de la integraci\xF3n Sub-Zero, o el enlace es incorrecto.","overview.back":"Volver a todos los electrodom\xE9sticos","card.label":"{name}, {status}. Mostrar todos los controles","appearance.hint":"C\xF3mo se dibuja este electrodom\xE9stico en el panel, para todos los que lo usan.","appearance.admin_only":"Solo los administradores pueden cambiar c\xF3mo se dibuja un electrodom\xE9stico.","appearance.preview":"Vista previa","appearance.finish":"Acabado","appearance.panel_color":"Color del panel","appearance.panel_color_value":"Color del panel {color}","appearance.custom_color":"Color personalizado","panel_color.white":"Blanco","panel_color.cream":"Crema","panel_color.gray":"Gris","panel_color.navy":"Azul marino","panel_color.sage":"Verde salvia","panel_color.black":"Negro","panel_color.walnut":"Nogal","panel_color.oak":"Roble","appearance.knobs":"Mandos","appearance.handle":"Tiradores","appearance.style":"Estilo","appearance.form":"Tipo","appearance.detected":"{form} (detectado)","appearance.reset":"Restablecer valores predeterminados","appearance.reset_confirm":"\xBFRestablecer el aspecto predeterminado de este electrodom\xE9stico para todos?","appearance.reset_action":"Restablecer","appearance.save":"Guardar","appearance.saving":"Guardando\u2026","appearance.saved":"Guardado.","appearance.error":"No se pudo guardar: {message}","finish.stainless":"Acero inoxidable","finish.panel":"Integrable","finish.black":"Negro","finish.carbon":"Inoxidable carbono","finish.white":"Blanco","knobs.red":"Rojos","knobs.black":"Negros","knobs.stainless":"Acero cepillado","handle.tubular":"Tubulares","handle.pro":"Profesionales","handle.none":"Sin tiradores","style.professional":"Profesional","style.transitional":"Transicional","style.contemporary":"Contempor\xE1neo","family.refrigeration":"Refrigeraci\xF3n","family.range":"Cocina","family.wall_oven":"Horno empotrado","family.hood":"Campana extractora","family.dishwasher":"Lavavajillas","family.generic":"Electrodom\xE9stico","form.side_by_side":"Americano (side by side)","form.french_door":"Puerta francesa","form.over_under":"Combi","form.column_refrigerator":"Columna frigor\xEDfico","form.column_freezer":"Columna congelador","form.column_wine":"Columna vinoteca","form.tall_refrigerator":"Frigor\xEDfico alto","form.tall_freezer":"Congelador alto","form.tall_over_under":"Combi alto","form.wine_over_drawers":"Vinoteca con cajones","form.undercounter_refrigerator":"Frigor\xEDfico bajo encimera","form.undercounter_beverage":"Enfriador de bebidas bajo encimera","form.undercounter_wine":"Vinoteca bajo encimera","form.undercounter_drawers":"Cajones bajo encimera","form.ice_maker":"M\xE1quina de hielo","form.range":"Cocina","form.single":"Horno empotrado sencillo","form.double":"Horno empotrado doble","form.wall":"Campana de pared","form.island":"Campana de isla","form.insert":"Grupo filtrante","form.hood":"Campana extractora","form.dishwasher":"Lavavajillas","form.refrigerator":"Frigor\xEDfico","form.wine":"Vinoteca","form.oven":"Horno","form.appliance":"Electrodom\xE9stico"};var ll={"panel.title":"Sub-Zero","panel.menu":"Ouvrir la barre lat\xE9rale","panel.back":"Retour","overview.no_area":"Aucune pi\xE8ce","overview.loading":"Chargement des appareils\u2026","overview.error_title":"Impossible de charger les appareils","overview.retry":"R\xE9essayer","overview.empty_title":"Aucun appareil pour l'instant","overview.empty_text":"Les appareils apparaissent ici une fois ajout\xE9s par l'int\xE9gration Sub-Zero. Ajoutez un compte ou choisissez des appareils dans ses param\xE8tres.","overview.empty_text_user":"Les appareils apparaissent ici une fois qu'un administrateur les a ajout\xE9s \xE0 l'int\xE9gration Sub-Zero.","overview.empty_link":"Ouvrir les param\xE8tres de Sub-Zero","overview.not_found_title":"Appareil introuvable","overview.not_found_text":"Cet appareil ne fait plus partie de l'int\xE9gration Sub-Zero, ou le lien est incorrect.","overview.back":"Retour \xE0 tous les appareils","card.label":"{name}, {status}. Afficher toutes les commandes","appearance.hint":"La fa\xE7on dont cet appareil est dessin\xE9 dans le panneau, pour tous ses utilisateurs.","appearance.admin_only":"Seuls les administrateurs peuvent modifier la fa\xE7on dont un appareil est dessin\xE9.","appearance.preview":"Aper\xE7u","appearance.finish":"Finition","appearance.panel_color":"Couleur du panneau","appearance.panel_color_value":"Couleur du panneau {color}","appearance.custom_color":"Couleur personnalis\xE9e","panel_color.white":"Blanc","panel_color.cream":"Cr\xE8me","panel_color.gray":"Gris","panel_color.navy":"Bleu marine","panel_color.sage":"Vert sauge","panel_color.black":"Noir","panel_color.walnut":"Noyer","panel_color.oak":"Ch\xEAne","appearance.knobs":"Boutons","appearance.handle":"Poign\xE9es","appearance.style":"Style","appearance.form":"Type","appearance.detected":"{form} (d\xE9tect\xE9)","appearance.reset":"R\xE9tablir les valeurs par d\xE9faut","appearance.reset_confirm":"R\xE9tablir l'apparence par d\xE9faut de cet appareil pour tout le monde\xA0?","appearance.reset_action":"R\xE9tablir","appearance.save":"Enregistrer","appearance.saving":"Enregistrement\u2026","appearance.saved":"Enregistr\xE9.","appearance.error":"\xC9chec de l'enregistrement : {message}","finish.stainless":"Inox","finish.panel":"Habillable","finish.black":"Noir","finish.carbon":"Inox carbone","finish.white":"Blanc","knobs.red":"Rouges","knobs.black":"Noirs","knobs.stainless":"Inox bross\xE9","handle.tubular":"Tubulaires","handle.pro":"Professionnelles","handle.none":"Sans poign\xE9e","style.professional":"Professionnel","style.transitional":"Transitionnel","style.contemporary":"Contemporain","family.refrigeration":"Froid","family.range":"Piano de cuisson","family.wall_oven":"Four encastrable","family.hood":"Hotte","family.dishwasher":"Lave-vaisselle","family.generic":"Appareil","form.side_by_side":"Am\xE9ricain","form.french_door":"Multiportes","form.over_under":"Combin\xE9","form.column_refrigerator":"Colonne r\xE9frig\xE9rateur","form.column_freezer":"Colonne cong\xE9lateur","form.column_wine":"Colonne cave \xE0 vin","form.tall_refrigerator":"R\xE9frig\xE9rateur grande hauteur","form.tall_freezer":"Cong\xE9lateur grande hauteur","form.tall_over_under":"Combin\xE9 grande hauteur","form.wine_over_drawers":"Cave \xE0 vin avec tiroirs","form.undercounter_refrigerator":"R\xE9frig\xE9rateur sous plan","form.undercounter_beverage":"Cave \xE0 boissons sous plan","form.undercounter_wine":"Cave \xE0 vin sous plan","form.undercounter_drawers":"Tiroirs sous plan","form.ice_maker":"Machine \xE0 gla\xE7ons","form.range":"Piano de cuisson","form.single":"Four encastrable simple","form.double":"Four encastrable double","form.wall":"Hotte murale","form.island":"Hotte \xEElot","form.insert":"Groupe filtrant","form.hood":"Hotte","form.dishwasher":"Lave-vaisselle","form.refrigerator":"R\xE9frig\xE9rateur","form.wine":"Cave \xE0 vin","form.oven":"Four","form.appliance":"Appareil"};var cl={"panel.title":"Sub-Zero","panel.menu":"Apri la barra laterale","panel.back":"Indietro","overview.no_area":"Nessuna area","overview.loading":"Caricamento degli elettrodomestici\u2026","overview.error_title":"Impossibile caricare gli elettrodomestici","overview.retry":"Riprova","overview.empty_title":"Ancora nessun elettrodomestico","overview.empty_text":"Gli elettrodomestici compaiono qui dopo che l'integrazione Sub-Zero li ha aggiunti. Aggiungi un account o scegli gli elettrodomestici nelle sue impostazioni.","overview.empty_text_user":"Gli elettrodomestici compaiono qui dopo che un amministratore li ha aggiunti all'integrazione Sub-Zero.","overview.empty_link":"Apri le impostazioni di Sub-Zero","overview.not_found_title":"Elettrodomestico non trovato","overview.not_found_text":"Questo elettrodomestico non fa pi\xF9 parte dell'integrazione Sub-Zero, oppure il link \xE8 errato.","overview.back":"Torna a tutti gli elettrodomestici","card.label":"{name}, {status}. Mostra tutti i comandi","appearance.hint":"Come questo elettrodomestico viene disegnato nel pannello, per tutti gli utenti.","appearance.admin_only":"Solo gli amministratori possono cambiare il modo in cui un elettrodomestico viene disegnato.","appearance.preview":"Anteprima","appearance.finish":"Finitura","appearance.panel_color":"Colore del pannello","appearance.panel_color_value":"Colore del pannello {color}","appearance.custom_color":"Colore personalizzato","panel_color.white":"Bianco","panel_color.cream":"Crema","panel_color.gray":"Grigio","panel_color.navy":"Blu navy","panel_color.sage":"Verde salvia","panel_color.black":"Nero","panel_color.walnut":"Noce","panel_color.oak":"Rovere","appearance.knobs":"Manopole","appearance.handle":"Maniglie","appearance.style":"Stile","appearance.form":"Tipologia","appearance.detected":"{form} (rilevato)","appearance.reset":"Ripristina i valori predefiniti","appearance.reset_confirm":"Ripristinare l'aspetto predefinito di questo elettrodomestico per tutti?","appearance.reset_action":"Ripristina","appearance.save":"Salva","appearance.saving":"Salvataggio\u2026","appearance.saved":"Salvato.","appearance.error":"Impossibile salvare: {message}","finish.stainless":"Acciaio inox","finish.panel":"Pannellabile","finish.black":"Nero","finish.carbon":"Inox carbonio","finish.white":"Bianco","knobs.red":"Rosse","knobs.black":"Nere","knobs.stainless":"Inox spazzolato","handle.tubular":"Tubolari","handle.pro":"Professionali","handle.none":"Senza maniglie","style.professional":"Professionale","style.transitional":"Transizionale","style.contemporary":"Contemporaneo","family.refrigeration":"Refrigerazione","family.range":"Cucina","family.wall_oven":"Forno da incasso","family.hood":"Cappa","family.dishwasher":"Lavastoviglie","family.generic":"Elettrodomestico","form.side_by_side":"Americano (side by side)","form.french_door":"Porte alla francese","form.over_under":"Combinato","form.column_refrigerator":"Colonna frigorifero","form.column_freezer":"Colonna congelatore","form.column_wine":"Colonna cantinetta","form.tall_refrigerator":"Frigorifero alto","form.tall_freezer":"Congelatore alto","form.tall_over_under":"Combinato alto","form.wine_over_drawers":"Cantinetta con cassetti","form.undercounter_refrigerator":"Frigorifero sottopiano","form.undercounter_beverage":"Frigo per bevande sottopiano","form.undercounter_wine":"Cantinetta sottopiano","form.undercounter_drawers":"Cassetti sottopiano","form.ice_maker":"Fabbricatore di ghiaccio","form.range":"Cucina","form.single":"Forno da incasso singolo","form.double":"Forno da incasso doppio","form.wall":"Cappa a parete","form.island":"Cappa a isola","form.insert":"Gruppo incasso","form.hood":"Cappa","form.dishwasher":"Lavastoviglie","form.refrigerator":"Frigorifero","form.wine":"Cantinetta","form.oven":"Forno","form.appliance":"Elettrodomestico"};var dl={"panel.title":"Sub-Zero","panel.menu":"Zijbalk openen","panel.back":"Terug","overview.no_area":"Geen ruimte","overview.loading":"Apparaten laden\u2026","overview.error_title":"De apparaten konden niet worden geladen","overview.retry":"Opnieuw proberen","overview.empty_title":"Nog geen apparaten","overview.empty_text":"Apparaten verschijnen hier zodra de Sub-Zero-integratie ze heeft toegevoegd. Voeg een account toe of kies apparaten in de instellingen ervan.","overview.empty_text_user":"Apparaten verschijnen hier zodra een beheerder ze aan de Sub-Zero-integratie heeft toegevoegd.","overview.empty_link":"Sub-Zero-instellingen openen","overview.not_found_title":"Apparaat niet gevonden","overview.not_found_text":"Dit apparaat hoort niet meer bij de Sub-Zero-integratie, of de link klopt niet.","overview.back":"Terug naar alle apparaten","card.label":"{name}, {status}. Alle bedieningselementen tonen","appearance.hint":"Hoe dit apparaat in het paneel wordt getekend, voor iedereen die het gebruikt.","appearance.admin_only":"Alleen beheerders kunnen wijzigen hoe een apparaat wordt getekend.","appearance.preview":"Voorbeeld","appearance.finish":"Afwerking","appearance.panel_color":"Paneelkleur","appearance.panel_color_value":"Paneelkleur {color}","appearance.custom_color":"Eigen kleur","panel_color.white":"Wit","panel_color.cream":"Cr\xE8me","panel_color.gray":"Grijs","panel_color.navy":"Marineblauw","panel_color.sage":"Saliegroen","panel_color.black":"Zwart","panel_color.walnut":"Notenhout","panel_color.oak":"Eiken","appearance.knobs":"Knoppen","appearance.handle":"Grepen","appearance.style":"Stijl","appearance.form":"Uitvoering","appearance.detected":"{form} (herkend)","appearance.reset":"Standaardwaarden herstellen","appearance.reset_confirm":"De weergave van dit apparaat voor iedereen terugzetten naar de standaard?","appearance.reset_action":"Herstellen","appearance.save":"Opslaan","appearance.saving":"Bezig met opslaan\u2026","appearance.saved":"Opgeslagen.","appearance.error":"Opslaan mislukt: {message}","finish.stainless":"Roestvrij staal","finish.panel":"Integreerbaar","finish.black":"Zwart","finish.carbon":"Carbon-rvs","finish.white":"Wit","knobs.red":"Rood","knobs.black":"Zwart","knobs.stainless":"Geborsteld rvs","handle.tubular":"Buisgrepen","handle.pro":"Profgrepen","handle.none":"Geen grepen","style.professional":"Professioneel","style.transitional":"Klassiek-modern","style.contemporary":"Eigentijds","family.refrigeration":"Koeling","family.range":"Fornuis","family.wall_oven":"Inbouwoven","family.hood":"Afzuigkap","family.dishwasher":"Vaatwasser","family.generic":"Apparaat","form.side_by_side":"Amerikaanse koelkast","form.french_door":"Franse deuren","form.over_under":"Koel-vriescombinatie","form.column_refrigerator":"Koelkolom","form.column_freezer":"Vrieskolom","form.column_wine":"Wijnkolom","form.tall_refrigerator":"Hoge koelkast","form.tall_freezer":"Hoge vriezer","form.tall_over_under":"Hoge koel-vriescombinatie","form.wine_over_drawers":"Wijnklimaatkast met lades","form.undercounter_refrigerator":"Onderbouwkoelkast","form.undercounter_beverage":"Onderbouw-drankenkoeler","form.undercounter_wine":"Onderbouw-wijnklimaatkast","form.undercounter_drawers":"Onderbouwlades","form.ice_maker":"IJsmachine","form.range":"Fornuis","form.single":"Enkele inbouwoven","form.double":"Dubbele inbouwoven","form.wall":"Wandafzuigkap","form.island":"Eilandafzuigkap","form.insert":"Afzuigunit","form.hood":"Afzuigkap","form.dishwasher":"Vaatwasser","form.refrigerator":"Koelkast","form.wine":"Wijnklimaatkast","form.oven":"Oven","form.appliance":"Apparaat"};var pl={"panel.title":"Sub-Zero","panel.menu":"Otw\xF3rz pasek boczny","panel.back":"Wstecz","overview.no_area":"Bez obszaru","overview.loading":"Wczytywanie urz\u0105dze\u0144\u2026","overview.error_title":"Nie uda\u0142o si\u0119 wczyta\u0107 urz\u0105dze\u0144","overview.retry":"Spr\xF3buj ponownie","overview.empty_title":"Brak urz\u0105dze\u0144","overview.empty_text":"Urz\u0105dzenia pojawi\u0105 si\u0119 tutaj, gdy integracja Sub-Zero je doda. Dodaj konto lub wybierz urz\u0105dzenia w jej ustawieniach.","overview.empty_text_user":"Urz\u0105dzenia pojawi\u0105 si\u0119 tutaj, gdy administrator doda je do integracji Sub-Zero.","overview.empty_link":"Otw\xF3rz ustawienia Sub-Zero","overview.not_found_title":"Nie znaleziono urz\u0105dzenia","overview.not_found_text":"To urz\u0105dzenie nie nale\u017Cy ju\u017C do integracji Sub-Zero albo link jest nieprawid\u0142owy.","overview.back":"Wr\xF3\u0107 do wszystkich urz\u0105dze\u0144","card.label":"{name}, {status}. Poka\u017C wszystkie elementy steruj\u0105ce","appearance.hint":"Jak to urz\u0105dzenie jest rysowane w panelu \u2013 dla wszystkich u\u017Cytkownik\xF3w.","appearance.admin_only":"Tylko administratorzy mog\u0105 zmieni\u0107 spos\xF3b rysowania urz\u0105dzenia.","appearance.preview":"Podgl\u0105d","appearance.finish":"Wyko\u0144czenie","appearance.panel_color":"Kolor frontu","appearance.panel_color_value":"Kolor frontu {color}","appearance.custom_color":"W\u0142asny kolor","panel_color.white":"Bia\u0142y","panel_color.cream":"Kremowy","panel_color.gray":"Szary","panel_color.navy":"Granatowy","panel_color.sage":"Sza\u0142wiowy","panel_color.black":"Czarny","panel_color.walnut":"Orzech","panel_color.oak":"D\u0105b","appearance.knobs":"Pokr\u0119t\u0142a","appearance.handle":"Uchwyty","appearance.style":"Styl","appearance.form":"Typ","appearance.detected":"{form} (wykryto)","appearance.reset":"Przywr\xF3\u0107 domy\u015Blne","appearance.reset_confirm":"Przywr\xF3ci\u0107 domy\u015Blny wygl\u0105d tego urz\u0105dzenia dla wszystkich?","appearance.reset_action":"Przywr\xF3\u0107","appearance.save":"Zapisz","appearance.saving":"Zapisywanie\u2026","appearance.saved":"Zapisano.","appearance.error":"Nie uda\u0142o si\u0119 zapisa\u0107: {message}","finish.stainless":"Stal nierdzewna","finish.panel":"Pod front meblowy","finish.black":"Czarny","finish.carbon":"Stal karbonowa","finish.white":"Bia\u0142y","knobs.red":"Czerwone","knobs.black":"Czarne","knobs.stainless":"Szczotkowana stal","handle.tubular":"Rurowe","handle.pro":"Profesjonalne","handle.none":"Bez uchwyt\xF3w","style.professional":"Profesjonalny","style.transitional":"Klasyczno-nowoczesny","style.contemporary":"Wsp\xF3\u0142czesny","family.refrigeration":"Ch\u0142odzenie","family.range":"Kuchnia wolnostoj\u0105ca","family.wall_oven":"Piekarnik do zabudowy","family.hood":"Okap","family.dishwasher":"Zmywarka","family.generic":"Urz\u0105dzenie","form.side_by_side":"Lod\xF3wka ameryka\u0144ska","form.french_door":"Drzwi francuskie","form.over_under":"Lod\xF3wko-zamra\u017Carka","form.column_refrigerator":"Kolumna ch\u0142odz\u0105ca","form.column_freezer":"Kolumna zamra\u017Caj\u0105ca","form.column_wine":"Kolumna na wino","form.tall_refrigerator":"Wysoka lod\xF3wka","form.tall_freezer":"Wysoka zamra\u017Carka","form.tall_over_under":"Wysoka lod\xF3wko-zamra\u017Carka","form.wine_over_drawers":"Ch\u0142odziarka do wina z szufladami","form.undercounter_refrigerator":"Lod\xF3wka podblatowa","form.undercounter_beverage":"Podblatowa ch\u0142odziarka do napoj\xF3w","form.undercounter_wine":"Podblatowa ch\u0142odziarka do wina","form.undercounter_drawers":"Szuflady podblatowe","form.ice_maker":"Kostkarka do lodu","form.range":"Kuchnia wolnostoj\u0105ca","form.single":"Piekarnik pojedynczy","form.double":"Piekarnik podw\xF3jny","form.wall":"Okap przy\u015Bcienny","form.island":"Okap wyspowy","form.insert":"Okap do zabudowy","form.hood":"Okap","form.dishwasher":"Zmywarka","form.refrigerator":"Lod\xF3wka","form.wine":"Ch\u0142odziarka do wina","form.oven":"Piekarnik","form.appliance":"Urz\u0105dzenie"};var ul={"panel.title":"Sub-Zero","panel.menu":"\xD6ppna sidof\xE4ltet","panel.back":"Tillbaka","overview.no_area":"Inget omr\xE5de","overview.loading":"L\xE4ser in vitvaror\u2026","overview.error_title":"Det gick inte att l\xE4sa in vitvarorna","overview.retry":"F\xF6rs\xF6k igen","overview.empty_title":"Inga vitvaror \xE4nnu","overview.empty_text":"Vitvarorna visas h\xE4r n\xE4r Sub-Zero-integrationen har lagt till dem. L\xE4gg till ett konto eller v\xE4lj vitvaror i dess inst\xE4llningar.","overview.empty_text_user":"Vitvarorna visas h\xE4r n\xE4r en administrat\xF6r har lagt till dem i Sub-Zero-integrationen.","overview.empty_link":"\xD6ppna Sub-Zero-inst\xE4llningarna","overview.not_found_title":"Vitvaran hittades inte","overview.not_found_text":"Den h\xE4r vitvaran ing\xE5r inte l\xE4ngre i Sub-Zero-integrationen, eller s\xE5 \xE4r l\xE4nken fel.","overview.back":"Tillbaka till alla vitvaror","card.label":"{name}, {status}. Visa alla reglage","appearance.hint":"Hur den h\xE4r vitvaran ritas i panelen, f\xF6r alla som anv\xE4nder den.","appearance.admin_only":"Bara administrat\xF6rer kan \xE4ndra hur en vitvara ritas.","appearance.preview":"F\xF6rhandsvisning","appearance.finish":"Ytfinish","appearance.panel_color":"Luckf\xE4rg","appearance.panel_color_value":"Luckf\xE4rg {color}","appearance.custom_color":"Egen f\xE4rg","panel_color.white":"Vit","panel_color.cream":"Gr\xE4ddvit","panel_color.gray":"Gr\xE5","panel_color.navy":"Marinbl\xE5","panel_color.sage":"Salviagr\xF6n","panel_color.black":"Svart","panel_color.walnut":"Valn\xF6t","panel_color.oak":"Ek","appearance.knobs":"Vred","appearance.handle":"Handtag","appearance.style":"Stil","appearance.form":"Utf\xF6rande","appearance.detected":"{form} (identifierad)","appearance.reset":"\xC5terst\xE4ll standardv\xE4rden","appearance.reset_confirm":"\xC5terst\xE4lla vitvarans utseende till standard f\xF6r alla?","appearance.reset_action":"\xC5terst\xE4ll","appearance.save":"Spara","appearance.saving":"Sparar\u2026","appearance.saved":"Sparat.","appearance.error":"Det gick inte att spara: {message}","finish.stainless":"Rostfritt st\xE5l","finish.panel":"Integrerbar","finish.black":"Svart","finish.carbon":"Kolgr\xE5tt rostfritt","finish.white":"Vit","knobs.red":"R\xF6da","knobs.black":"Svarta","knobs.stainless":"Borstat rostfritt","handle.tubular":"R\xF6rhandtag","handle.pro":"Proffshandtag","handle.none":"Utan handtag","style.professional":"Professionell","style.transitional":"Klassisk-modern","style.contemporary":"Samtida","family.refrigeration":"Kyla","family.range":"Spis","family.wall_oven":"Inbyggnadsugn","family.hood":"K\xF6ksfl\xE4kt","family.dishwasher":"Diskmaskin","family.generic":"Vitvara","form.side_by_side":"Amerikanskt kylsk\xE5p","form.french_door":"Franska d\xF6rrar","form.over_under":"Kyl/frys","form.column_refrigerator":"Kylpelare","form.column_freezer":"Fryspelare","form.column_wine":"Vinpelare","form.tall_refrigerator":"H\xF6gt kylsk\xE5p","form.tall_freezer":"H\xF6g frys","form.tall_over_under":"H\xF6g kyl/frys","form.wine_over_drawers":"Vinkyl med l\xE5dor","form.undercounter_refrigerator":"Underbyggt kylsk\xE5p","form.undercounter_beverage":"Underbyggd dryckeskyl","form.undercounter_wine":"Underbyggd vinkyl","form.undercounter_drawers":"Underbyggda l\xE5dor","form.ice_maker":"Ismaskin","form.range":"Spis","form.single":"Enkel inbyggnadsugn","form.double":"Dubbel inbyggnadsugn","form.wall":"V\xE4ggfl\xE4kt","form.island":"K\xF6ks\xF6fl\xE4kt","form.insert":"Fl\xE4ktinsats","form.hood":"K\xF6ksfl\xE4kt","form.dishwasher":"Diskmaskin","form.refrigerator":"Kylsk\xE5p","form.wine":"Vinkyl","form.oven":"Ugn","form.appliance":"Vitvara"};var fl={"panel.title":"Sub-Zero","panel.menu":"\u6253\u5F00\u4FA7\u8FB9\u680F","panel.back":"\u8FD4\u56DE","overview.no_area":"\u65E0\u533A\u57DF","overview.loading":"\u6B63\u5728\u52A0\u8F7D\u7535\u5668\u2026","overview.error_title":"\u65E0\u6CD5\u52A0\u8F7D\u7535\u5668","overview.retry":"\u91CD\u8BD5","overview.empty_title":"\u6682\u65E0\u7535\u5668","overview.empty_text":"Sub-Zero \u96C6\u6210\u6DFB\u52A0\u7535\u5668\u540E\uFF0C\u7535\u5668\u4F1A\u663E\u793A\u5728\u8FD9\u91CC\u3002\u8BF7\u6DFB\u52A0\u8D26\u6237\uFF0C\u6216\u5728\u96C6\u6210\u8BBE\u7F6E\u4E2D\u9009\u62E9\u7535\u5668\u3002","overview.empty_text_user":"\u7BA1\u7406\u5458\u5C06\u7535\u5668\u6DFB\u52A0\u5230 Sub-Zero \u96C6\u6210\u540E\uFF0C\u7535\u5668\u4F1A\u663E\u793A\u5728\u8FD9\u91CC\u3002","overview.empty_link":"\u6253\u5F00 Sub-Zero \u8BBE\u7F6E","overview.not_found_title":"\u672A\u627E\u5230\u7535\u5668","overview.not_found_text":"\u6B64\u7535\u5668\u5DF2\u4E0D\u5728 Sub-Zero \u96C6\u6210\u4E2D\uFF0C\u6216\u8005\u94FE\u63A5\u6709\u8BEF\u3002","overview.back":"\u8FD4\u56DE\u5168\u90E8\u7535\u5668","card.label":"{name}\uFF0C{status}\u3002\u663E\u793A\u5168\u90E8\u63A7\u5236\u9879","appearance.hint":"\u6B64\u7535\u5668\u5728\u9762\u677F\u4E2D\u7684\u7ED8\u5236\u65B9\u5F0F\uFF0C\u5BF9\u6240\u6709\u7528\u6237\u751F\u6548\u3002","appearance.admin_only":"\u53EA\u6709\u7BA1\u7406\u5458\u53EF\u4EE5\u66F4\u6539\u7535\u5668\u7684\u7ED8\u5236\u65B9\u5F0F\u3002","appearance.preview":"\u9884\u89C8","appearance.finish":"\u9970\u9762","appearance.panel_color":"\u9762\u677F\u989C\u8272","appearance.panel_color_value":"\u9762\u677F\u989C\u8272 {color}","appearance.custom_color":"\u81EA\u5B9A\u4E49\u989C\u8272","panel_color.white":"\u767D\u8272","panel_color.cream":"\u5976\u6CB9\u8272","panel_color.gray":"\u7070\u8272","panel_color.navy":"\u6D77\u519B\u84DD","panel_color.sage":"\u9F20\u5C3E\u8349\u7EFF","panel_color.black":"\u9ED1\u8272","panel_color.walnut":"\u80E1\u6843\u6728","panel_color.oak":"\u6A61\u6728","appearance.knobs":"\u65CB\u94AE","appearance.handle":"\u628A\u624B","appearance.style":"\u98CE\u683C","appearance.form":"\u7C7B\u578B","appearance.detected":"{form}\uFF08\u5DF2\u8BC6\u522B\uFF09","appearance.reset":"\u6062\u590D\u9ED8\u8BA4\u8BBE\u7F6E","appearance.reset_confirm":"\u8981\u4E3A\u6240\u6709\u4EBA\u5C06\u6B64\u7535\u5668\u7684\u5916\u89C2\u6062\u590D\u4E3A\u9ED8\u8BA4\u8BBE\u7F6E\u5417\uFF1F","appearance.reset_action":"\u6062\u590D","appearance.save":"\u4FDD\u5B58","appearance.saving":"\u6B63\u5728\u4FDD\u5B58\u2026","appearance.saved":"\u5DF2\u4FDD\u5B58\u3002","appearance.error":"\u65E0\u6CD5\u4FDD\u5B58\uFF1A{message}","finish.stainless":"\u4E0D\u9508\u94A2","finish.panel":"\u53EF\u88C5\u6A71\u67DC\u9762\u677F","finish.black":"\u9ED1\u8272","finish.carbon":"\u78B3\u8272\u4E0D\u9508\u94A2","finish.white":"\u767D\u8272","knobs.red":"\u7EA2\u8272","knobs.black":"\u9ED1\u8272","knobs.stainless":"\u62C9\u4E1D\u4E0D\u9508\u94A2","handle.tubular":"\u5706\u7BA1\u628A\u624B","handle.pro":"\u4E13\u4E1A\u628A\u624B","handle.none":"\u65E0\u628A\u624B","style.professional":"\u4E13\u4E1A\u98CE\u683C","style.transitional":"\u8FC7\u6E21\u98CE\u683C","style.contemporary":"\u73B0\u4EE3\u98CE\u683C","family.refrigeration":"\u51B7\u85CF\u7535\u5668","family.range":"\u4E00\u4F53\u5F0F\u7089\u7076","family.wall_oven":"\u5D4C\u5165\u5F0F\u70E4\u7BB1","family.hood":"\u6CB9\u70DF\u673A","family.dishwasher":"\u6D17\u7897\u673A","family.generic":"\u7535\u5668","form.side_by_side":"\u5BF9\u5F00\u95E8\u51B0\u7BB1","form.french_door":"\u6CD5\u5F0F\u591A\u95E8\u51B0\u7BB1","form.over_under":"\u4E0A\u51B7\u85CF\u4E0B\u51B7\u51BB\u51B0\u7BB1","form.column_refrigerator":"\u51B7\u85CF\u67F1","form.column_freezer":"\u51B7\u51BB\u67F1","form.column_wine":"\u9152\u67DC\u67F1","form.tall_refrigerator":"\u9AD8\u8EAB\u51B7\u85CF\u67DC","form.tall_freezer":"\u9AD8\u8EAB\u51B7\u51BB\u67DC","form.tall_over_under":"\u9AD8\u8EAB\u4E0A\u51B7\u85CF\u4E0B\u51B7\u51BB\u51B0\u7BB1","form.wine_over_drawers":"\u9152\u67DC\u914D\u62BD\u5C49","form.undercounter_refrigerator":"\u53F0\u4E0B\u51B7\u85CF\u67DC","form.undercounter_beverage":"\u53F0\u4E0B\u996E\u6599\u67DC","form.undercounter_wine":"\u53F0\u4E0B\u9152\u67DC","form.undercounter_drawers":"\u53F0\u4E0B\u62BD\u5C49","form.ice_maker":"\u5236\u51B0\u673A","form.range":"\u4E00\u4F53\u5F0F\u7089\u7076","form.single":"\u5355\u5D4C\u5165\u5F0F\u70E4\u7BB1","form.double":"\u53CC\u5D4C\u5165\u5F0F\u70E4\u7BB1","form.wall":"\u58C1\u6302\u5F0F\u6CB9\u70DF\u673A","form.island":"\u5C9B\u5F0F\u6CB9\u70DF\u673A","form.insert":"\u5D4C\u5165\u5F0F\u6CB9\u70DF\u673A","form.hood":"\u6CB9\u70DF\u673A","form.dishwasher":"\u6D17\u7897\u673A","form.refrigerator":"\u51B0\u7BB1","form.wine":"\u9152\u67DC","form.oven":"\u70E4\u7BB1","form.appliance":"\u7535\u5668"};var hl=["en","de","es","fr","it","nl","pl","sv","zh-Hans"],kn={en:{shell:al,families:Xs,drawings:Ns},de:{shell:il,families:Ys,drawings:Fs},es:{shell:sl,families:Qs,drawings:js},fr:{shell:ll,families:Js,drawings:Bs},it:{shell:cl,families:el,drawings:Ks},nl:{shell:dl,families:tl,drawings:Us},pl:{shell:pl,families:nl,drawings:Ws},sv:{shell:ul,families:rl,drawings:qs},"zh-Hans":{shell:fl,families:ol,drawings:Zs}};function df(e){if(!e)return"en";if(hl.includes(e))return e;let t=e.split(/[-_]/)[0].toLowerCase();return t==="zh"?"zh-Hans":hl.includes(t)?t:"en"}function oo(e){let t=df(e),n={...kn.en.shell,...kn.en.families,...kn.en.drawings,...kn[t].shell,...kn[t].families,...kn[t].drawings};return(r,o)=>{let i=n[r]??r;return o?i.replace(/\{(\w+)\}/g,(a,s)=>String(o[s]??a)):i}}function xn(e){return e?.locale?.language||e?.language||"en"}var ml=new Map;function Re(e){let t=xn(e),n=ml.get(t);return n||(n=oo(t),ml.set(t,n)),n}var gl=new Map;function yl(e){let t=gl.get(e);if(!t){try{t=new Intl.Collator(e,{numeric:!0,sensitivity:"base"})}catch{t=new Intl.Collator(void 0,{numeric:!0,sensitivity:"base"})}gl.set(e,t)}return t}function Et(e){if(e&&typeof e=="object"&&"message"in e){let t=e.message;if(typeof t=="string"&&t)return t}return typeof e=="string"&&e?e:String(e??"")}function Zn(e,t){let n=t?.devices?.[e.device_id];return n?.name_by_user||n?.name||e.name}function $l(e){let t=new Set;return e.filter(n=>t.has(n.device_id)?!1:(t.add(n.device_id),!0))}var pf=new Set(["column_wine","wine_over_drawers","undercounter_wine","undercounter_beverage"]),uf={refrigerator:0,wine:1,ice_maker:2,oven:4,hood:5,dishwasher:6,appliance:7};function _l(e){switch(e.family){case"refrigeration":return e.form==="ice_maker"?2:pf.has(e.form)?1:0;case"range":return 3;case"wall_oven":return 4;case"hood":return 5;case"dishwasher":return 6;case"generic":return uf[e.form]??7}}function ff(e){let t=Object.values(e??{}),n=new Map;for(let o of t)o.floor_id&&!n.has(o.floor_id)&&n.set(o.floor_id,n.size);let r=t.map((o,i)=>({id:o.area_id,floor:n.get(o.floor_id??"")??n.size,index:i}));return r.sort((o,i)=>o.floor-i.floor||o.index-i.index),new Map(r.map((o,i)=>[o.id,i]))}function bl(e,t){let n=yl(xn(t)),r=new Map;for(let i of e){let a=t?.devices?.[i.device_id]?.area_id??null,s=a?t?.areas?.[a]:void 0,l=s?a:null,p=r.get(l);p||(p={areaId:l,name:s?.name??null,appliances:[]},r.set(l,p)),p.appliances.push({appliance:i,name:Zn(i,t)})}for(let i of r.values())i.appliances.sort((a,s)=>_l(a.appliance.spec)-_l(s.appliance.spec)||n.compare(a.name,s.name)||a.appliance.device_id.localeCompare(s.appliance.device_id));let o=ff(t?.areas);return[...r.values()].sort((i,a)=>i.areaId===null||a.areaId===null?i.areaId===null?1:-1:(o.get(i.areaId)??0)-(o.get(a.areaId)??0))}function io(e,t,n){if(!e||e.language!==t.language||e.locale!==t.locale||e.themes!==t.themes||e.config!==t.config||e.user!==t.user||e.devices?.[n.device_id]!==t.devices?.[n.device_id])return!0;for(let r of Object.values(n.entities))for(let o of Object.values(r))if(o&&e.states[o]!==t.states[o])return!0;return!1}var wl=new Set(["unavailable","unknown"]),hf=864e5;function ao(e){if(!Array.isArray(e))return[];let t=[];for(let n of e){if(!n||typeof n!="object")continue;let r=n.s??n.state;if(typeof r!="string")continue;let o=n.a??n.attributes;t.push({state:r,attributes:o&&typeof o=="object"?o:{},at:zn(n.lc??n.lu??n.last_changed??n.last_updated)})}return t}function mf(e){return ao(e).flatMap(({state:t,at:n})=>n===null?[]:[{state:t,at:n}])}function zn(e){if(typeof e=="number"&&Number.isFinite(e))return e<1e11?e*1e3:e;if(typeof e=="string"){let t=Date.parse(e);return Number.isNaN(t)?null:t}return null}async function vl(e,t,n,r={}){return(await e.callWS({type:"history/history_during_period",start_time:new Date(n).toISOString(),...r.end===void 0?{}:{end_time:new Date(r.end).toISOString(),include_start_time_state:!1},entity_ids:[t],...r.full?{include_start_time_state:!1,significant_changes_only:!1,minimal_response:!1,no_attributes:!1}:{minimal_response:!0,no_attributes:!0}}))?.[t]}function kl(e,t){return wl.has(e)&&!wl.has(t)}function gf(e,t){let n,r=null;for(let o of e)kl(o.state,t)||(o.state===t&&n!==t&&(r=o.at),n=o.state);return r}function yf(e,t){for(let n=e.length-1;n>=0;n--)if(!kl(e[n].state,t))return e[n].state}function xl(e){let t=Number.parseFloat(e??"");return Number.isFinite(t)?t:null}function _f(e){let t=null;for(let n of e){let r=xl(n.state);r!==null&&(t===null||r<t)&&(t=r)}return t}var Sn=class{constructor(t=()=>{},n=Date.now){this.onChange=t;this.now=n;this.histories=new Map;this.values=new Map;this.logs=new Map}since(t,n,r="on"){let o=n?t?.states[n]:void 0;if(!t||!n||!o)return null;let i=this.history(t,n,o.last_changed),a=zn(o.last_changed);return i.failed?o.state===r?a:null:i.changes?o.state===r&&yf(i.changes,r)!==r?a:gf(i.changes,r):null}lowestAfter(t,n,r){if(!t||!n||!Number.isFinite(r))return null;let o=`${n}@${r}`,i=this.values.get(o),a=t.states[n],s=a?.last_changed??"";if(i&&!this.outdated(i,s))return i.value;let l=r-2e3,p=r+18e5,u={value:i?.value??null,retryAt:null,lastChanged:s,final:this.now()>=p};this.values.delete(o),this.values.set(o,u),this.values.size>64&&this.values.delete(this.values.keys().next().value);let f=zn(s),m=f!==null&&f<=l?xl(a?.state):null;return this.fetch(t,n,l,p).then(y=>{if(this.values.get(o)!==u)return;let g=_f(y)??m;g!==u.value&&(u.value=g,this.onChange())},()=>{this.values.get(o)===u&&(u.retryAt=this.now()+6e4)}),u.value}outdated(t,n){return t.retryAt!==null?this.now()>=t.retryAt:t.value===null&&!t.final&&t.lastChanged!==n}history(t,n,r){let o=this.histories.get(n),i=o?.lastChanged===r;if(o&&i&&(o.retryAt===null||this.now()<o.retryAt))return o;let a={lastChanged:r,changes:null,failed:!!(i&&o?.failed),retryAt:null};return this.histories.set(n,a),this.fetch(t,n,this.now()-432e5).then(s=>{this.histories.get(n)===a&&(a.changes=s,a.failed=!1,this.onChange())},()=>{this.histories.get(n)===a&&(a.failed=!0,a.retryAt=this.now()+6e4,this.onChange())}),a}states(t,n,r){if(!t||!n)return{rows:null,error:null};let o=t.states[n],i=`${n}|${r}`,a=`${o?.state??""}|${o?.last_updated??""}`,s=this.logs.get(i),l=s!==void 0&&s.retryAt!==null&&this.now()>=s.retryAt;if(!s||s.marker!==a||l){let p=s?{...s,held:new Set(s.held),marker:a,error:l?s.error:null,retryAt:null}:{marker:a,rows:null,held:new Set,live:[],error:null,retryAt:null};this.logs.set(i,p),vl(t,n,this.now()-r*hf,{full:!0}).then(u=>{if(this.logs.get(i)!==p)return;let f=Array.isArray(u)?u:[],m=new Set(ao(f).map(y=>y.state));p.live=p.live.filter(y=>!m.has(y.state)),p.rows=[...f,...p.live],p.held=new Set([...m,...p.live.map(y=>y.state)]),p.error=null,this.onChange()},u=>{this.logs.get(i)===p&&(p.error=u??"",p.retryAt=this.now()+6e4,this.onChange())}),s=p}if(o&&s.rows&&!s.held.has(o.state)){let p={state:o.state,attributes:o.attributes,last_changed:o.last_changed};s.live=[...s.live,p],s.rows=[...s.rows,p],s.held.add(p.state)}return{rows:s.rows,error:s.error}}forgetStates(t,n){this.logs.delete(`${t}|${n}`)}async fetch(t,n,r,o){return mf(await vl(t,n,r,{end:o}))}};var $f=["cav","cav2"];function zl(e,t,n){let r=t.entities[`${n}_unit_on`]?.binary_sensor,o=r?e.states[r]:void 0;if(r&&o&&(o.state==="on"||o.state==="off"))return{on:o.state==="on",entityId:r,onState:"on",changedAt:Date.parse(o.last_changed)};let i=t.entities[`${n}_set_temp`]?.climate,a=i?e.states[i]:void 0;if(!(!i||!a||a.state==="unavailable"||a.state==="unknown"))return{on:a.state!=="off",entityId:i,onState:a.state,changedAt:Date.parse(a.last_changed)}}function bf(e,t,n){let r=t.entities[`${n}_temp`]?.sensor,o=Number.parseFloat(r?e.states[r]?.state??"":"");if(Number.isFinite(o))return o;let i=t.entities[`${n}_set_temp`]?.climate,a=Number(i?e.states[i]?.attributes.current_temperature:NaN);return Number.isFinite(a)?a:null}var so=class{constructor(t,n=Date.now){this.history=t;this.now=n;this.cavities=new Map}observe(t,n){for(let r of n)for(let o of $f)this.observeCavity(t,r,o)}start(t,n,r){if(!t)return null;let o=this.observeCavity(t,n,r);if(!o?.on)return null;if(o.witnessed)return o.coldest;if(!this.history)return null;let i=zl(t,n,r),a=i?this.history.since(t,i.entityId,i.onState):null,s=n.entities[`${r}_temp`]?.sensor,l=a===null?null:this.history.lowestAfter(t,s,a);return l===null?null:o.coldest===null?l:Math.min(l,o.coldest)}observeCavity(t,n,r){let o=`${n.appliance_id}:${r}`,i=this.cavities.get(o),a=zl(t,n,r),s=this.now();if(!a)return i&&(i.lookedAt=s),i;if(!a.on){let f={on:!1,seenAt:s,lookedAt:s,witnessed:!1,coldest:null};return this.cavities.set(o,f),f}let l=i,p=l?.on===!0&&s-l.lookedAt>5e3&&a.changedAt>l.seenAt;if(!l?.on||p){let f=!p&&l!==void 0&&s-l.seenAt<=5e3;l={on:!0,seenAt:s,lookedAt:s,witnessed:f,coldest:null},this.cavities.set(o,l)}l.seenAt=s,l.lookedAt=s;let u=bf(t,n,r);return u!==null&&(l.coldest===null||u<l.coldest)&&(l.coldest=u),l}};var Ri=class{constructor(t=Date.now){this.listeners=new Set;this.history=new Sn(()=>this.notify(),t),this.preheat=new so(this.history,t)}observe(t,n){this.hass=t,this.preheat.observe(t,n)}since(t,n="on"){return this.history.since(this.hass,t,n)}preheatStart(t,n){return this.preheat.start(this.hass,t,n)}onChange(t){return this.listeners.add(t),()=>{this.listeners.delete(t)}}notify(){for(let t of[...this.listeners])t()}},Ce=new Ri;var wf="/sub-zero";function lo(e){let[t]=(e??"").split(/[?#]/)[0].split("/").filter(Boolean);if(!t)return{view:"overview"};let n=t;try{n=decodeURIComponent(t)}catch{}return{view:"appliance",deviceId:n}}function Ai(e,t){let n=(e||wf).replace(/\/+$/,"");return t.view==="overview"?n:`${n}/${encodeURIComponent(t.deviceId)}`}function co(e,t={}){let n=t.replace===!0;n?history.replaceState(history.state,"",e):history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:n}}))}function Sl(e){if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;let t=e.currentTarget;t instanceof HTMLAnchorElement&&(e.preventDefault(),co(t.getAttribute("href")??"/"))}function Rl(e){Promise.resolve().then(e).catch(()=>{})}var po=class{constructor(t,n){this.onMessage=t;this.onError=n}connect(t){if(t===this.connection||(this.disconnect(),!t))return;this.connection=t;let n=()=>{this.current=void 0},r=()=>this.subscribe(t);t.addEventListener("disconnected",n),t.addEventListener("ready",r),this.stopListening=()=>{t.removeEventListener("disconnected",n),t.removeEventListener("ready",r)},this.subscribe(t)}subscribe(t){let n={};this.current=n;let r;try{r=t.subscribeMessage(o=>{this.current===n&&this.onMessage(o)},{type:"subzero/panel/subscribe"},{resubscribe:!1})}catch(o){r=Promise.reject(o)}r.then(o=>{this.current===n?n.unsubscribe=o:Rl(o)},o=>{this.current===n&&this.onError(o)})}disconnect(){let t=this.current;this.stopListening?.(),this.stopListening=void 0,this.connection=void 0,this.current=void 0,t?.unsubscribe&&Rl(t.unsubscribe)}retry(){let t=this.connection;this.disconnect(),this.connect(t)}};var pt=te`
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
`,uo=te`
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
`,ut=te`
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
`;function ft(e,t){e.toggleAttribute("dark",t?.themes?.darkMode===!0)}var Al=(e,t,n)=>{let r=new Map;for(let o=t;o<=n;o++)r.set(e[o],o);return r},Yn=to(class extends wn{constructor(e){if(super(e),e.type!==Ds.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,t,n){let r;n===void 0?n=t:t!==void 0&&(r=t);let o=[],i=[],a=0;for(let s of e)o[a]=r?r(s,a):a,i[a]=n(s,a),a++;return{values:i,keys:o}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,r]){let o=Vs(e),{values:i,keys:a}=this.dt(t,n,r);if(!Array.isArray(o))return this.ut=a,i;let s=this.ut??=[],l=[],p,u,f=0,m=o.length-1,y=0,g=i.length-1;for(;f<=m&&y<=g;)if(o[f]===null)f++;else if(o[m]===null)m--;else if(s[f]===a[y])l[y]=Gt(o[f],i[y]),f++,y++;else if(s[m]===a[g])l[g]=Gt(o[m],i[g]),m--,g--;else if(s[f]===a[g])l[g]=Gt(o[f],i[g]),vn(e,l[g+1],o[f]),f++,g--;else if(s[m]===a[y])l[y]=Gt(o[m],i[y]),vn(e,o[f],o[m]),m--,y++;else if(p===void 0&&(p=Al(a,y,g),u=Al(s,f,m)),p.has(s[f]))if(p.has(s[m])){let _=u.get(a[y]),b=_!==void 0?o[_]:null;if(b===null){let $=vn(e,o[f]);Gt($,i[y]),l[y]=$}else l[y]=Gt(b,i[y]),vn(e,o[f],b),o[_]=null;y++}else ro(o[m]),m--;else ro(o[f]),f++;for(;y<=g;){let _=vn(e,l[g+1]);Gt(_,i[y]),l[y++]=_}for(;f<=m;){let _=o[f++];_!==null&&ro(_)}return this.ut=a,no(e,l),xt}});async function Tl(e,t,n){if(t.type==="service"){let o=n&&typeof n=="object"?n:{};await e.callService(t.domain,t.service,{...t.data,...o});return}let r={entity_id:t.entity_id};switch(t.type){case"climate_temperature":await e.callService("climate","set_temperature",{temperature:Number(n)},r);return;case"climate_power":await e.callService("climate",n?"turn_on":"turn_off",{},r);return;case"number":await e.callService("number","set_value",{value:Number(n)},r);return;case"select":await e.callService("select","select_option",{option:String(n)},r);return;case"switch":await e.callService("switch",n?"turn_on":"turn_off",{},r);return;case"button":await e.callService("button","press",{},r);return;case"fan":{let o=Number(n);o?t.speeds<=1?await e.callService("fan","turn_on",{},r):await e.callService("fan","set_percentage",{percentage:Math.round(o/t.speeds*100)},r):await e.callService("fan","turn_off",{},r);return}case"light":{let o=n??{};if(!o.on){await e.callService("light","turn_off",{},r);return}let i={};typeof o.brightness=="number"&&(i.brightness_pct=Math.round(o.brightness)),typeof o.kelvin=="number"&&(i.color_temp_kelvin=Math.round(o.kelvin)),await e.callService("light","turn_on",i,r);return}}}var Ot=class{constructor(t,n){this.host=t;this.selector=n;this.observed=null;t.addController(this)}hostConnected(){this.hostUpdated()}hostUpdated(){let t=this.host.renderRoot?.querySelector(this.selector)??null;t!==this.observed&&(this.observer?.disconnect(),this.observed=t,!(!t||typeof ResizeObserver!="function")&&(this.observer??=new ResizeObserver(n=>this.measured(n)),this.observer.observe(t)))}hostDisconnected(){this.observer?.disconnect(),this.observed=null}measured(t){let n=Math.round(t[t.length-1]?.contentRect.height??0);n<=0||n===this.height||(this.height=n,this.host.requestUpdate())}};function fo(e){return e?.text?A`<span class="pill" data-tone=${e.tone}>${e.text}</span>`:v}function ho(e,t=!1){return e?.text?A`<div class="lcd ${t?"dim":""}">
    <span class="digits">${e.text}</span>
    ${e.caption?A`<span class="caption">${e.caption}</span>`:v}
  </div>`:v}function Ml(e){return e.length?A`<dl class="info">
    ${e.map(t=>A`<div class="row"><dt>${t.label}</dt><dd>${t.value}</dd></div>`)}
  </dl>`:v}function Cl(e){let t=e.tone??"primary";return A`<div class="confirm ${t}" role="group" aria-label=${e.text}>
    <span class="question">${e.text}</span>
    <span class="actions">
      <button type="button" class="sz-button" ?disabled=${e.busy} @click=${e.onCancel}>
        ${e.cancel}
      </button>
      <button type="button" class="sz-button ${t}" ?disabled=${e.busy} @click=${e.onConfirm}>
        ${e.confirm}
      </button>
    </span>
  </div>`}var ht=te`
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
`;var Ve=class{constructor(t){let n=t.replace(/[^A-Za-z0-9_-]/g,"_");this.uid=/^[A-Za-z]/.test(n)?n:`d${n}`}id(t){return`${this.uid}-${t}`}url(t){return`url(#${this.uid}-${t})`}};function c(e){return Math.round(e*100)/100}function ke(e,t=0,n=1){return Math.min(n,Math.max(t,e))}function q(e,t=c){return`M${e.map(([n,r])=>`${t(n)} ${t(r)}`).join("L")}Z`}function Y(e){return e.map(([t,n])=>`${c(t)},${c(n)}`).join(" ")}function en(e){let t=parseInt(e.slice(1),16);return[t>>16&255,t>>8&255,t&255]}function mo([e,t,n]){let r=o=>Math.round(Math.min(255,Math.max(0,o))).toString(16).padStart(2,"0");return`#${r(e)}${r(t)}${r(n)}`}function zt(e,t){let n=t>0?255:0,r=Math.abs(t);return mo([e[0]+(n-e[0])*r,e[1]+(n-e[1])*r,e[2]+(n-e[2])*r])}function he(e,t,n){let r=en(e),o=en(t),i=ke(n);return mo([r[0]+(o[0]-r[0])*i,r[1]+(o[1]-r[1])*i,r[2]+(o[2]-r[2])*i])}function Rn(e){let[t,n,r]=e.map(p=>p/255),o=Math.max(t,n,r),i=Math.min(t,n,r),a=(o+i)/2;if(o===i)return!1;let s=(o-i)/(1-Math.abs(2*a-1)),l=o===t?(n-r)/(o-i)%6:o===n?(r-t)/(o-i)+2:(t-n)/(o-i)+4;return l=(l*60+360)%360,l>=12&&l<=48&&s>=.18&&a>=.12&&a<=.78}function Pt(e,t){let[n,r,o]=typeof t.lift=="number"?[t.lift,t.lift,t.lift]:t.lift,i=t.margin,a=i?`-${i}%`:v,s=i?`${100+2*i}%`:v;return h`<filter id=${e} x=${a} y=${a} width=${s} height=${s} color-interpolation-filters="sRGB">
    <feColorMatrix type="saturate" values=${t.saturation} />
    <feComponentTransfer>
      <feFuncR type="linear" slope=${t.slope} intercept=${n} />
      <feFuncG type="linear" slope=${t.slope} intercept=${r} />
      <feFuncB type="linear" slope=${t.slope} intercept=${o} />
    </feComponentTransfer>
  </filter>`}var vf=[[0,"#8a8988"],[.07,"#a09f9d"],[.11,"#cac9c7"],[.15,"#fbfbfa"],[.3,"#ffffff"],[.35,"#f7f7f6"],[.4,"#dfdedc"],[.45,"#d6d5d3"],[.53,"#e2e1df"],[.62,"#d8d7d5"],[.73,"#cdccca"],[.79,"#dad9d7"],[.85,"#f9f9f8"],[.9,"#f0efee"],[.95,"#bebdbb"],[1,"#8c8b89"]];function go(e){return h`<linearGradient id=${e} x1="0" y1="0" x2="0" y2="1">
    ${vf.map(([t,n])=>h`<stop offset=${t} stop-color=${n} />`)}
  </linearGradient>`}var Ne={red:{light:"#953c42",base:"#843236",dark:"#62191e",edge:"#4c1418",rim:"#a5676a",rimOpacity:.6,sheen:.05},black:{light:"#3c3c3f",base:"#262628",dark:"#141415",edge:"#060606",rim:"#58585c",rimOpacity:.6,sheen:.08},stainless:{light:"#d2d4d5",base:"#a9abad",dark:"#6a6d70",edge:"#45484b",rim:"#e6e7e8",rimOpacity:.4,sheen:.12}};function yo(e,t){return h`<radialGradient id=${e} cx="0.45" cy="0.32" r="0.8">
    <stop offset="0" stop-color=${t.light} />
    <stop offset="0.45" stop-color=${t.base} />
    <stop offset="0.85" stop-color=${t.base} />
    <stop offset="1" stop-color=${t.dark} />
  </radialGradient>`}function An(e){return e==="dark"?.62:.3}function El(e,t="#e9e6df"){let n=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((e??"").trim()),r=n?n[1]:t.slice(1),o=r.length===3?[...r].map(i=>i+i).join(""):r;return en(`#${o}`)}function Ge(e,t,n,r,o=0){if(o<=0)return`M${c(e)} ${c(t)}h${c(n)}v${c(r)}h${c(-n)}Z`;let i=Math.min(o,n/2,r/2);return`M${c(e+i)} ${c(t)}H${c(e+n-i)}A${c(i)} ${c(i)} 0 0 1 ${c(e+n)} ${c(t+i)}V${c(t+r-i)}A${c(i)} ${c(i)} 0 0 1 ${c(e+n-i)} ${c(t+r)}H${c(e+i)}A${c(i)} ${c(i)} 0 0 1 ${c(e)} ${c(t+r-i)}V${c(t+i)}A${c(i)} ${c(i)} 0 0 1 ${c(e+i)} ${c(t)}Z`}var kf={saturation:.06,slope:.6,lift:.22,margin:5};function _o(e){return h`
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
    ${Gl(e.id("grain"),"2 0.035")}
    ${Gl(e.id("grain-h"),"0.035 2")}
    <filter id=${e.id("blur-s")} x="-20%" y="-60%" width="140%" height="220%">
      <feGaussianBlur stdDeviation="1.4" />
    </filter>
    <filter id=${e.id("blur-m")} x="-30%" y="-80%" width="160%" height="260%">
      <feGaussianBlur stdDeviation="3.2" />
    </filter>
    ${Pt(e.id("offline"),kf)}
  `}function Gl(e,t){return h`<filter id=${e} x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=${t} numOctaves="2" seed="7" />
    <feColorMatrix type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" />
    <feComposite in2="SourceAlpha" operator="in" />
  </filter>`}function Xn(e){if(!Rn(e))return e;let t=.2126*e[0]+.7152*e[1]+.0722*e[2];return e.map(n=>n+(t-n)*.3)}function Ol(e,t,n){let r=Rn(n),o=Xn(n);return h`
    <linearGradient id=${e.id(`${t}-base`)} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color=${zt(o,.05)} />
      <stop offset="0.55" stop-color=${mo(o)} />
      <stop offset="1" stop-color=${zt(o,-.07)} />
    </linearGradient>
    <linearGradient id=${e.id(`${t}-sheen`)} x1="0" y1="0" x2="1" y2="0.9">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.09" />
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.035" />
      <stop offset="0.75" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="1" stop-color="#000000" stop-opacity="0.05" />
    </linearGradient>
    ${r?xf(e.id(`${t}-wood`),"0.4 0.006","0.012 0.0045",11):v}
  `}function xf(e,t,n,r){return h`<filter id=${e} x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=${t} numOctaves="3" seed=${r} result="grain" />
    <feTurbulence type="fractalNoise" baseFrequency=${n} numOctaves="2" seed=${r+1} result="warp" />
    <feDisplacementMap in="grain" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" />
    <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.065  1.5 0 0 0 -0.6" />
    <feComposite in2="SourceAlpha" operator="in" />
  </filter>`}function tt(e,t,n={}){let r=n.grain??.1,o=e.url(n.brush==="h"?"grain-h":"grain");return h`
    <path d=${t} fill=${e.url("ss")} />
    <path d=${t} fill=${e.url("ss-falloff")} />
    <path d=${t} fill=${e.url("ss-env")} />
    <path d=${t} fill=${e.url("ss-glow")} />
    ${r>0?h`<path d=${t} fill="#000" filter=${o} opacity=${r} style="mix-blend-mode:soft-light" />`:v}
    ${n.dim?h`<path d=${t} fill="#000" opacity=${n.dim} />`:v}
  `}function Pl(e,t,n,r,o={}){return h`
    <path d=${n} fill=${e.url(`${t}-base`)} />
    ${Rn(r)?h`<path d=${n} fill="#000" filter=${e.url(`${t}-wood`)} opacity="0.22" />`:v}
    <path d=${n} fill=${e.url(`${t}-sheen`)} />
    ${o.dim?h`<path d=${n} fill="#000" opacity=${o.dim} />`:v}
  `}function $o(e,t){return h`
    <path d=${t} fill=${e.url("glass")} />
    <path d=${t} fill=${e.url("glass-env")} />
  `}function Tn(e,t,n,r,o=1,i=.8){return h`
    <rect x=${e} y=${t} width=${n} height=${i} fill="#ffffff" opacity=${.7*o} />
    <rect x=${e} y=${t} width=${i} height=${r} fill="#ffffff" opacity=${.35*o} />
    <rect x=${e+n-i} y=${t} width=${i} height=${r} fill="#000000" opacity=${.2*o} />
    <rect x=${e} y=${t+r-i} width=${n} height=${i} fill="#000000" opacity=${.3*o} />
  `}function Mn(e,t=.35,n=.6){return h`<path d=${e} fill="none" stroke="#2a2a28" stroke-opacity=${t} stroke-width=${n} />`}function zf(e,t,n,r,o,i){return`M${c(e+o)} ${c(t)}H${c(e+n-i)}A${i} ${i} 0 0 1 ${c(e+n)} ${c(t+i)}V${c(t+r-i)}A${i} ${i} 0 0 1 ${c(e+n-i)} ${c(t+r)}H${c(e+o)}A${o} ${o} 0 0 1 ${c(e)} ${c(t+r-o)}V${c(t+o)}A${o} ${o} 0 0 1 ${c(e+o)} ${c(t)}Z`}function St(e,t,n,r,o,i=0){let a=o==="pro",s=a?13:6.4,l=s/2,p=a?{w:9.5,h:16}:null,u=p?t+p.w-1:t,f=p?n-p.w+1:n,m=i>0,y=m?.08:0,g=h`<rect x=${t+3} y=${r+l*.35} width=${n-t-6} height=${s*.85} rx=${l}
    fill="#000" opacity="0.13" filter=${e.url("blur-m")} />`,_=h`
    <rect x=${u} y=${r-l} width=${f-u} height=${s} rx=${p?0:l} fill=${e.url("chrome")} />
    ${y?h`<rect x=${u} y=${r-l} width=${f-u} height=${s} rx=${p?0:l} fill="#000"
      opacity=${y} />`:v}`;if(!p){let w=Math.round(s),k=[t+4,n-4].map(x=>m?h`<rect x=${x-w/2} y=${r-i} width=${w} height=${i+.5} rx=${w/2}
              ry="1.2" fill=${e.url("chrome-v")} />
            <rect x=${x-w/2} y=${r-i} width=${w} height=${i+.5} rx=${w/2}
              ry="1.2" fill="#000" opacity="0.12" />`:h`<rect x=${x-w/2-.5} y=${r+l-.4} width=${w+1} height="2" rx="1" fill="#000"
            opacity="0.14" filter=${e.url("blur-s")} />`);return h`${m?v:g}${k}${_}`}let b=r-p.h/2,$=[t,n-p.w].map((w,k)=>{let x=k===0,z=zf(w,b,p.w,p.h,x?2:.6,x?.6:2),R=q([[w,b-i],[w+p.w,b-i],[w+p.w,b],[w,b]]);return h`
      ${m?h`<path d=${R} fill="#c9cacb" />
          <path d=${R} fill=${e.url("chrome-end")} />
          <rect x=${w} y=${b-i} width=${p.w} height="0.5" fill="#fff" opacity="0.6" />`:h`<rect x=${w+.4} y=${b+1.6} width=${p.w-.8} height=${p.h} rx="1.5" fill="#000"
            opacity="0.2" filter=${e.url("blur-s")} />`}
      <path d=${z} fill=${e.url("chrome")} />
      <path d=${z} fill="#000" opacity=${m?.15:.07} />
      <path d=${z} fill=${e.url(x?"cap-l":"cap-r")} />
      <rect x=${x?w+p.w-.5:w} y=${r-l} width="0.5" height=${s} fill="#3b3a37"
        opacity="0.5" />
      <path d=${z} fill="none" stroke="#3b3a37" stroke-opacity="0.15" stroke-width="0.4" />
    `});return h`${m?v:g}${_}${$}`}function Rt(e,t,n,r,o=8){let i=o/2;return h`
    <rect x=${t-i+2.5} y=${n+3} width=${o} height=${r-n} rx=${i} fill="#000" opacity="0.16"
      filter=${e.url("blur-m")} />
    ${[n+4,r-4].map(a=>h`<rect x=${t-2} y=${a-2} width="5.5" height="4" rx="1" fill="#000" opacity="0.16"
        filter=${e.url("blur-s")} />`)}
    <rect x=${t-i} y=${n} width=${o} height=${r-n} rx=${i} fill=${e.url("chrome-v")} />
  `}function tn(e){return{shadow:e.url("blur-s")}}function bo(e,t,n,r,o){let i=o==="dark"?1.5:1;return h`
    <ellipse cx=${t+n/2} cy=${r+1} rx=${n*.58} ry="7.5" fill=${e.url("floor")}
      opacity=${Math.min(1,.6*i)} />
    <rect x=${t+1.5} y=${r-1.4} width=${n-3} height="2.8" rx="1.4" fill="#000"
      opacity=${Math.min(1,.4*i)} filter=${e.url("blur-s")} />
  `}function wo(e,t,n,r,o){let i=[];for(let a=n+3;a<n+o-2;a+=3.4)i.push(`M${c(t+3)} ${c(a)}H${c(t+r-3)}`);return h`
    <rect x=${t} y=${n} width=${r} height=${o} fill="#1b1c1d" />
    <path d=${i.join("")} stroke="#5d6064" stroke-width="1.3" />
    <path d=${i.join("")} stroke="#9a9ea2" stroke-width="0.45" transform="translate(0 -0.5)" />
    <rect x=${t} y=${n} width=${r} height=${o} fill=${e.url("ao-down")} />
  `}var mt=345,Dl=40,Jn=1.25,Ti=mt-Dl,vo=Ti-Jn,Qn=1.25;function Ll(e){let t=e-2*Qn;return{at:(n,r)=>[Qn+n,Jn+r],lift:0,width:t,height:vo}}function Il(e,t,n=.06){let r=e-2*Qn,o=Math.cos(t),i=e/2;return{at:(a,s)=>{let l=vo-s,p=1+n*(l/vo);return[i+(a-r/2)*p,Ti-l*o]},lift:Math.sin(t),width:r,height:vo}}function Ae(e,t,n,r,o){return q([e.at(t,n),e.at(r,n),e.at(r,o),e.at(t,o)])}function Sf(e,t){let{width:n,height:r}=e;return h`
    <path d=${Ae(e,0,0,n,.9)} fill="#ffffff" opacity=${.75*t} />
    <path d=${Ae(e,0,.9,n,2.2)} fill="#ffffff" opacity=${.18*t} />
    <path d=${Ae(e,0,0,.8,r)} fill="#ffffff" opacity=${.12*t} />
    <path d=${Ae(e,.8,0,2,r)} fill="#000000" opacity=${.05*t} />
    <path d=${Ae(e,n-.9,0,n,r)} fill="#000000" opacity=${.22*t} />
    <path d=${Ae(e,n-2.2,0,n-.9,r)} fill="#000000" opacity=${.06*t} />
    <path d=${Ae(e,0,r-1,n,r)} fill="#000000" opacity=${.32*t} />
    ${Mn(Ae(e,0,0,n,r),.4,.55)}
  `}function Vl(e,t,n,r){let o=Math.min(n==="pro"?195:212.5,t.width-16),i=(t.width-o)/2,a=n==="pro"?24:18,[s,l]=t.at(i,r),[p]=t.at(t.width-i,r),u=a*t.lift;return St(e,s,p,l+u,n,u)}function Hl(e,t){return t.lift?h`
    <defs>
      <linearGradient id=${e.id("tilt")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000" stop-opacity="0.22" />
        <stop offset="0.04" stop-color="#000" stop-opacity="0.04" />
        <stop offset="0.3" stop-color="#fff" stop-opacity="0.06" />
        <stop offset="1" stop-color="#000" stop-opacity="0.08" />
      </linearGradient>
    </defs>
    <path d=${Ae(t,0,0,t.width,t.height)} fill=${e.url("tilt")} />
  `:v}function Rf(e,t,n){let{width:r,height:o}=t;return h`
    ${tt(e,Ae(t,0,0,r,o),{dim:t.lift?.1*t.lift:0})}
    ${Hl(e,t)}
    ${Sf(t,1)}
    ${n?Vl(e,t,n,16):v}
  `}function Af(e,t,n,r){let{width:o,height:i}=t,a=t.lift?.1*t.lift:0;return h`
    ${Pl(e,"panel",Ae(t,0,0,o,i),n,{dim:a})}
    ${Hl(e,t)}
    <path d=${Ae(t,0,0,o,.5)} fill="#fff" opacity="0.3" />
    <path d=${Ae(t,0,.5,.5,i)} fill="#fff" opacity="0.3" />
    <path d=${Ae(t,.5,i-.5,o,i)} fill="#000" opacity="0.2" />
    <path d=${Ae(t,o-.5,.5,o,i-.5)} fill="#000" opacity="0.2" />
    ${Mn(Ae(t,0,0,o,i),.3,.4)}
    ${r?Vl(e,t,r,16):v}
  `}function Mi(e,t,n){return n.kind==="stainless"?Rf(e,t,n.handle):Af(e,t,n.color,n.handle)}function Ci(e,t,n){let o=t-12,i=Ti,a=Dl,s=`M6 ${i}h${o}v${a}h${-o}Z`;return h`
    ${n.kind==="stainless"?tt(e,s,{dim:.08}):h`<path d=${s} fill=${zt(Xn(n.color),-.22)} />`}
    <rect x=${6} y=${i} width=${o} height="5" fill=${e.url("ao-down")} opacity="0.3" />
    <rect x=${6} y=${i+.1} width=${o} height="0.6" fill="#fff" opacity="0.5" />
    <rect x=${6} y=${i+a-.8} width=${o} height="0.8" fill="#000" opacity="0.35" />
    <rect x=${6} y=${i} width="0.7" height=${a} fill="#000" opacity="0.2" />
    <rect x=${6+o-.7} y=${i} width="0.7" height=${a} fill="#000" opacity="0.25" />
  `}function Fl(e){return h`<rect x=${Qn+.5} y="0" width=${e-2*Qn-1} height=${Jn}
    fill="#2b2c2d" opacity="0.55" />`}var Bl=52*Math.PI/180,Kl=.09,Ul=22,Tf=7.5;function Wl(e){return e.at(0,0)[1]-Ul*e.lift}function Nl(e,t,n){return e.map(([r,o])=>{let i=(o-n)/(o-t[1]);return`M${c(r)} ${c(o)}L${c(r+(t[0]-r)*i)} ${c(n)}`}).join("")}function Gi(e,t,n,r){return h`
    <path d=${`M${c(e)} ${c(n+r*.4)}H${c(t)}`} stroke="#14181b" stroke-opacity="0.6"
      stroke-width=${r} stroke-linecap="round" />
    <path d=${`M${c(e)} ${c(n)}H${c(t)}`} stroke="#9aa1a6" stroke-width=${r} stroke-linecap="round" />
    <path d=${`M${c(e+1)} ${c(n-r*.28)}H${c(t-1)}`} stroke="#ffffff"
      stroke-opacity="0.55" stroke-width="0.4" />
  `}function jl(e,t,n,r){return h`
    <rect x=${e-n/2} y=${t+1.2} width=${n} height=${r} rx="2.4" fill="#000" opacity="0.45" />
    <rect x=${e-n/2} y=${t} width=${n} height=${r} rx="2.4" fill="#5d6267" />
    <rect x=${e-n/2+1} y=${t+.6} width=${n-2} height=${r*.22} rx="1.2" fill="#ffffff"
      opacity="0.2" />
    <rect x=${e-n/2+3} y=${t+r*.45} width=${n-6} height=${r*.3} rx="1" fill="#000"
      opacity="0.14" />
  `}function er(e,t,n,r,o){let i=[];for(let a=e;a<t;a+=n)i.push(`M${c(a)} ${c(r)}V${c(o)}`);return i.join("")}function Mf(e,t,n,r){let o=[],i=r+7;for(let u=0;u<9;u++){let f=u>=5,m=f?30+(u-5)*18:22+u*17.5,y=i+(f?9:u%2*3),g=n-y+(f?14:8);o.push(h`
      <rect x=${c(m)} y=${c(y)} width="15" height=${c(g)} rx="3" fill="#dfeaf5" fill-opacity="0.1"
        stroke="#f4f9ff" stroke-opacity="0.5" stroke-width="0.6" />
      <rect x=${c(m+1)} y=${c(y+.8)} width="13" height="2.4" rx="1.2" fill="#fff" opacity="0.22" />
      <path d=${`M${c(m+2.8)} ${c(y+4)}V${c(y+g-3)}`} stroke="#fff" stroke-opacity="0.6" stroke-width="0.9" />
      <path d=${`M${c(m+11.8)} ${c(y+6)}V${c(y+g-6)}`} stroke="#fff" stroke-opacity="0.22" stroke-width="0.6" />
      <path d=${`M${c(m+1.5)} ${c(y+g-1.2)}H${c(m+13.5)}`} stroke="#fff" stroke-opacity="0.45"
        stroke-width="0.8" />
    `)}let a=[],s=[],l=r+9;for(let u=0;u<8;u++){let f=t/2+2+u*3.6;a.push(q([[f,n],[f+2.8,n],[f+6.8,l+u*.5],[f+4,l+u*.5]])),s.push(q([[f+2.8,n],[f+3.4,n],[f+7.4,l+u*.5],[f+6.8,l+u*.5]]))}let p=[t/2-4,t/2+40,t/2+78].map(u=>h`
      <ellipse cx=${c(u+1)} cy=${c(n+13)} rx="17" ry="9.5" fill="#000" opacity="0.35"
        filter=${e.url("blur-s")} />
      <ellipse cx=${c(u)} cy=${c(n+11)} rx="16.5" ry="9" fill="#e9edf0" />
      <ellipse cx=${c(u)} cy=${c(n+12.2)} rx="12" ry="5.6" fill="#b9c3ca" />
      <ellipse cx=${c(u-4)} cy=${c(n+8)} rx="6" ry="1.6" fill="#fff" opacity="0.7" />
    `);return h`
    <path d=${a.join("")} fill="#e9edf0" />
    <path d=${s.join("")} fill="#8b97a0" opacity="0.6" />
    ${p}${o}`}function Cf(e,t,n,r){let o=[],i=[],a=[],s=t-e,l=3,p=(r-n)/l;for(let u=0;u<l;u++)for(let f=0;f<8;f++){let m=(u*5+f*3)%7/7,y=e+(f+.15*m)*(s/8)+u%2*5,g=s/8-4-3*m,_=n+p*(u+.35+.4*m),b=(m-.5)*2.4;y+g>t||(o.push(`M${c(y)} ${c(_)}l${c(g)} ${c(b)}`),(u+f)%3===0&&i.push(`M${c(y+g-3.2)} ${c(_+b-1)}h4.2v2h-4.2Z`),a.push(`M${c(y+g*.2)} ${c(_-.35+b*.2)}l${c(g*.5)} ${c(b*.5)}`))}return h`
    <path d=${o.join("")} stroke="#000" stroke-opacity="0.4" stroke-width="1.6" stroke-linecap="round"
      transform="translate(0 0.8)" />
    <path d=${o.join("")} stroke="#b4bcc3" stroke-width="1" stroke-linecap="round" />
    <path d=${i.join("")} fill="#d5dbe0" />
    <path d=${a.join("")} stroke="#ffffff" stroke-opacity="0.8" stroke-width="0.4" stroke-linecap="round" />
  `}function ql(e,t,n){let r=t,o=8,i=12,a=10,s=n-o,l=`M${i} ${c(n)}V${o+a}A${a} ${a} 0 0 1 ${i+a} ${o}H${r-i-a}A${a} ${a} 0 0 1 ${r-i} ${o+a}V${c(n)}Z`,p=[r/2,-60],u=.8,f=S=>p[0]+(S-p[0])*u,m=S=>p[1]+(S-p[1])*u,y=q([[i,o],[f(i),m(o)-20],[f(i),n+6],[i,n+6]]),g=o+s*.33,_=20,b=r-20,$=[];for(let S=_+4;S<b-1;S+=6.8)$.push([S,g]);let w=o+s*.74,k=18,x=r-18,z=m(w),R=[];for(let S=r/2+44;S<x-8;S+=6.8)R.push(`M${c(S)} ${c(w+1)}l-6 ${c(-s*.3)}`);let T=w-s*.2;return h`
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
    <path fill-rule="evenodd" fill="#1c1e20" d=${`M1.9 0H${r-1.9}V${c(n)}H1.9Z${l}`} />
    <g clip-path=${e.url("tub")}>
      <rect x="0" y="0" width=${r} height=${c(n+6)} fill=${e.url("tub-back")} />
      <path d=${y} fill=${e.url("tub-side")} />
      <path d=${y} fill=${e.url("tub-side")} transform=${`translate(${r} 0) scale(-1 1)`} />
      <path d=${`M${c(f(i))} 0V${c(n+6)}M${c(f(r-i))} 0V${c(n+6)}`}
        stroke="#14181b" stroke-opacity="0.5" stroke-width="0.8" />
      <path d=${`M${c(f(i)+3)} ${o}V${c(n)}M${c(f(r-i)-3)} ${o}V${c(n)}`}
        stroke="#eef6ff" stroke-opacity="0.55" stroke-width="1.2" />

      <rect x="0" y=${c(g+4)} width=${r} height=${c(s*.3)} fill="#000" opacity="0.25" />
      <path d=${er(f(k)+5,f(x)-2,6.8,z,w)} stroke="#6f7880" stroke-opacity="0.6"
        stroke-width="0.7" />
      <path d=${R.join("")} stroke="#5e666d" stroke-width="1" />
      ${Mf(e,r,w,g)}
      <path d=${`M${c(r/2+34)} ${c(T)}H${c(f(x)-6)}`} stroke="#8d969d" stroke-width="2" />
      <path d=${`M${c(r/2+34)} ${c(T-.7)}H${c(f(x)-6)}`} stroke="#fff" stroke-opacity="0.35"
        stroke-width="0.4" />
      <path d=${`M${c(f(k))} ${c(z)}H${c(f(x))}M${k} ${c(w)}L${c(f(k))} ${c(z)}M${x} ${c(w)}L${c(f(x))} ${c(z)}`}
        stroke="#9aa1a6" stroke-width="1.4" fill="none" />
      <path d=${er(k+3.5,x-1,6.8,w,n+4)} stroke="#14181b" stroke-opacity="0.5"
        stroke-width="1.5" />
      <path d=${er(k+3.5,x-1,6.8,w,n+4)} stroke="#9aa1a6" stroke-width="0.9"
        stroke-opacity="0.85" />
      <path d=${er(k+3.1,x-1.4,6.8,w+1,n+4)} stroke="#fff" stroke-opacity="0.35"
        stroke-width="0.4" />
      <path d=${`M${k} ${c(w+s*.2)}H${x}`} stroke="#9aa1a6" stroke-width="1.1" />
      ${Gi(k,x,w,2.3)}
      ${jl(r/2,w+1.4,58,12)}
      <rect x=${k-4} y=${c(w-4)} width="7" height="10" rx="2" fill="#3f4448" />
      <rect x=${x-3} y=${c(w-4)} width="7" height="10" rx="2" fill="#3f4448" />

      <path d=${Nl($,p,o-2)} stroke="#14181b" stroke-opacity="0.45" stroke-width="1.4" />
      <path d=${Nl($,p,o-2)} stroke="#9aa1a6" stroke-width="0.75" />
      ${Cf(_+4,b-4,o+5,g-3)}
      <path d=${er(_+3,b-1,6.8,g,g+6)} stroke="#9aa1a6" stroke-width="0.75" />
      ${Gi(_,b,g+6,1.3)}
      ${Gi(_,b,g,2)}
      ${jl(r/2,g-4,52,10)}
      <rect x=${_-4} y=${c(g-4)} width="7" height="10" rx="2" fill="#3f4448" />
      <rect x=${b-3} y=${c(g-4)} width="7" height="10" rx="2" fill="#3f4448" />

      <ellipse cx="24" cy=${o+2} rx="34" ry="17" fill=${e.url("led")} />
      <ellipse cx=${r-24} cy=${o+2} rx="34" ry="17" fill=${e.url("led")} />
      <ellipse cx="24" cy=${o+1.5} rx="4" ry="1.4" fill="#ffffff" />
      <ellipse cx=${r-24} cy=${o+1.5} rx="4" ry="1.4" fill="#ffffff" />
      <ellipse cx="14" cy=${c(o+s*.72)} rx="9" ry="24" fill=${e.url("led")} opacity="0.85" />
      <ellipse cx=${r-14} cy=${c(o+s*.72)} rx="9" ry="24" fill=${e.url("led")} opacity="0.85" />
      <rect x="0" y=${c(n-10)} width=${r} height="10" fill=${e.url("ao-up")} />
    </g>
    <path d=${l} fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="0.8" />
    <path d=${`M2.3 ${c(n)}V0.4H${r-2.3}V${c(n)}`} fill="none" stroke="#5a5e62" stroke-width="0.8" />
  `}function Zl(e,t,n,r){let[o,i]=t.at(0,0),[a]=t.at(t.width,0),s=i-Tf*t.lift,l=i-Ul*t.lift,u=(a-o)*.004,f=2.2,m=o+f+u,y=a-f-u,g=q([[m-.4,s],[y+.4,s],[y,l],[m,l]]),_=q([[o,i],[a,i],[a-u,s],[o+u,s]]),b=s-l,$=l+b*.5,w=y-m,k=[.255,.33,.395,.46,.53,.65,.715,.785,.85],x=[.022,.034,.028,.026,.04,.034,.025,.031,.022],z=k.map((C,M)=>{let O=x[M]*w,P=m+C*w-O/2;return`M${c(P)} ${c($-.6)}h${c(O)}v1.2h${c(-O)}Z`}).join(""),R=m+.035*w,T=.135*w,S=Math.max(2.8,b*.34);return h`
    <defs>
      <linearGradient id=${e.id("ctl")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#9da1a4" />
        <stop offset="0.45" stop-color="#bfc2c4" />
        <stop offset="1" stop-color="#cfd1d2" />
      </linearGradient>
    </defs>
    <path d=${_} fill=${n.kind==="stainless"?"#cfcecc":zt(Xn(n.color),.12)} />
    <path d=${_} fill="#000" opacity=${n.kind==="stainless"?.04:.02} />
    <path d=${q([[o,i-.8],[a,i-.8],[a,i],[o,i]])}
      fill="#ffffff" opacity="0.75" />
    <path d=${g} fill=${e.url("ctl")} />
    <path d=${g} fill="#000" filter=${e.url("grain")} opacity="0.12" style="mix-blend-mode:soft-light" />
    <path d=${q([[m,l],[y,l],[y,l+.9],[m,l+.9]])}
      fill="#000" opacity="0.5" />
    <path d=${q([[m,s-.5],[y,s-.5],[y,s],[m,s]])}
      fill="#000" opacity="0.2" />
    ${r?h`
        <rect x=${c(R)} y=${c($-S/2)} width=${c(T)} height=${c(S)}
          rx="0.5" fill="#152c4a" />
        <rect x=${c(R+T*.07)} y=${c($-.6)} width=${c(T*.3)} height="1.2"
          fill="#e8f1ff" opacity="0.92" />
        <rect x=${c(R+T*.68)} y=${c($-.6)} width=${c(T*.24)} height="1.2"
          fill="#e8f1ff" opacity="0.92" />
        <path d=${z} fill="#ffffff" opacity="0.82" />`:null}
  `}var ko={running:"#ff3b30",drying:"#ff3b30",canceling:"#ff3b30",delayed:"#3d8bff",done:"#2fe06f"};function tr(e){return!!(e.dishwasher?.door_open||e.doors.door_ajar)}function xo(e){let t=e.dishwasher;if(!t||!e.available)return{label:null,chips:[]};let n=[],r=null;switch(t.status){case"running":case"drying":case"canceling":t.progress!=null&&(r={progress:t.progress});break;case"delayed":r={icon:"clock"};break;case"paused":r={icon:"pause"};break;case"done":n.push("check");break;case"error":n.push("error");break;case"idle":break}return t.remote_ready&&n.push("remote"),t.rinse_aid_low&&n.push("rinse"),t.softener_low&&n.push("salt"),{label:r,chips:n}}function zo(e,t){if(!t.available)return[];let n=[];tr(t)&&n.push(e("drawing.state.door_open"));let r=t.dishwasher;return r&&(r.status!=="idle"&&n.push(e(`drawing.wash.${r.status}`)),r.display&&(r.status==="running"||r.status==="drying")&&n.push(e("drawing.time_left",{time:r.display})),r.display&&r.status==="delayed"&&n.push(e("drawing.starts_in",{time:r.display})),r.remote_ready&&n.push(e("drawing.state.remote_ready")),r.rinse_aid_low&&n.push(e("drawing.rinse_aid_low")),r.softener_low&&n.push(e("drawing.softener_low"))),n}var ne=20,nr=12,So=13,nn=4,Pi=16,Di=7,Gf=9,Ei=5.6,Ef={fill:"rgba(20, 22, 25, 0.6)",stroke:"rgba(255, 255, 255, 0.22)"},Li="font-family: var(--ha-font-family-body, Roboto, system-ui); font-variant-numeric: tabular-nums",Ii=e=>e;function gt(e,t){let n=.125*e/ne;return t&&t>0?Math.min(e/t,n):.03*e/nr}function Ro(e){return Math.round(e*1e3)/1e3}var Of={narrow:/[:.,'° ]/,narrowEm:.34};function Vi(e,t=Of){let n=0;for(let r of e)n+=t.narrow.test(r)?t.narrowEm:/[0-9]/.test(r)?.6:.64;return n*nr}function Ao(e,t,n,r,o=Ii,i=Ef){let a=ne/2;return h`
    <rect x=${o(t+.5)} y=${n+1.2} width=${o(r-1)} height=${ne} rx=${a} fill="#000" opacity="0.28"
      filter=${e} />
    <rect x=${o(t)} y=${n} width=${o(r)} height=${ne} rx=${a} fill=${i.fill}
      fill-opacity=${i.fillOpacity??v} stroke=${i.stroke} stroke-opacity=${i.strokeOpacity??v}
      stroke-width="1" />
  `}var Oi=h`<path d="M0 -8 7 -4V4L0 8-7 4V-4Z M-7 -4 0 0 7 -4M0 0V8" fill="#fff" fill-opacity="0.16" stroke="#fff" stroke-width="1.7" stroke-linejoin="round" />`;function Pf(e){switch(e){case"probe":return h`<g fill="none" stroke="#fff" stroke-linecap="round">
        <path d="M-2.4 2.4L6.4 -6.4" stroke-width="1.8" />
        <path d="M-6.6 6.6L-2.8 2.8" stroke-width="4.4" />
      </g>`;case"remote":return h`<g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round">
        <path d="M-7.2 -1.6A10 10 0 0 1 7.2 -1.6" />
        <path d="M-4.4 1.4A6 6 0 0 1 4.4 1.4" />
        <circle cx="0" cy="5" r="1.3" fill="#fff" stroke="none" />
      </g>`;case"lock":return h`<path d="M-4 -1.5V-3.8A4 4 0 0 1 4 -3.8V-1.5" fill="none" stroke="#fff" stroke-width="2" />
        <rect x="-6" y="-1.5" width="12" height="9" rx="1.8" fill="#fff" />`;case"check":return h`<path d="M-6 0.5 L-1.8 4.6 L6.4 -4.4" fill="none" stroke="#fff" stroke-width="2.6"
        stroke-linecap="round" stroke-linejoin="round" />`;case"rinse":return h`<path d="M0 -7.5 C3.2 -3.2 5.6 -0.4 5.6 2.6 A5.6 5.6 0 0 1 -5.6 2.6 C-5.6 -0.4 -3.2 -3.2 0 -7.5 Z"
          fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round" />
        <path d="M-4.3 3.6 A4.4 4.4 0 0 0 4.3 3.6 Z" fill="#fff" />`;case"salt":return h`<g fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round">
        <path d="M0 -6.5 L6 -3.2 L6 3.6 L0 6.9 L-6 3.6 L-6 -3.2 Z" />
        <path d="M-6 -3.2 L0 0.2 L6 -3.2 M0 0.2 L0 6.9" />
      </g>`;case"error":return h`<path d="M0 -6 V1.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round" />
        <circle cx="0" cy="5.6" r="1.6" fill="#fff" />`;case"clock":return h`<g fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round">
        <circle cx="0" cy="0" r="7" />
        <path d="M0 -3.8 V0 L2.8 2" />
      </g>`;case"pause":return h`<rect x="-4.6" y="-5.5" width="3.2" height="11" rx="1" fill="#fff" />
        <rect x="1.4" y="-5.5" width="3.2" height="11" rx="1" fill="#fff" />`;case"ice":return Oi;case"ice-max":return h`${Oi}<path d="M11 -9V-3M8 -6H14" stroke="#fff" stroke-width="2" stroke-linecap="round" />`;case"ice-night":return h`${Oi}<path d="M12.6 -10.4A3.6 3.6 0 1 0 14.4 -4.2 2.9 2.9 0 1 1 12.6 -10.4Z" fill="#fff" />`;case"cleaning":return h`<path d="M-1 -7.5C2.4 -2.8 4.6 0 4.6 2.8A5.6 5.6 0 0 1 -6.6 2.8C-6.6 0 -4.4 -2.8 -1 -7.5Z" fill="#fff" fill-opacity="0.2" stroke="#fff" stroke-width="1.7" stroke-linejoin="round" />
        <path d="M6.2 -8.6 6.9 -6.9 8.6 -6.2 6.9 -5.5 6.2 -3.8 5.5 -5.5 3.8 -6.2 5.5 -6.9Z" fill="#fff" />`}}function rr(e,t,n,r=So){return h`<g transform=${`translate(${t} ${n}) scale(${r/20})`} opacity="0.85">${Pf(e)}</g>`}function Hi(e){if(!e.text)return ne;let t=e.progress!=null||e.icon?Pi:0;return Math.max(ne,Di+t+Vi(e.text)+Gf)}function Yl(e,t,n,r,o){let i=e.fix??Ii,a=Hi(r),s=r.progress!=null||!!r.icon,l=r.text?t+Di+Pi/2:t+a/2,p=2*Math.PI*Ei,u=ke(r.progress??0);return h`
    ${Ao(e.shadow,t,n-ne/2,a)}
    ${r.progress!=null?h`
          <circle cx=${l} cy=${n} r=${Ei} fill="none" stroke="#fff" stroke-opacity="0.24" stroke-width="1.9" />
          <circle cx=${l} cy=${n} r=${Ei} fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round"
            stroke-dasharray=${i(p)} stroke-dashoffset=${i(p*(1-u))}
            transform=${`rotate(-90 ${l} ${n})`}
            style=${o?"":"transition: stroke-dashoffset 0.6s ease"} />`:r.icon?rr(r.icon,l,n):v}
    ${r.text?h`<text x=${s?t+Di+Pi:t+a/2} y=${n} fill="#fff" font-size=${nr} font-weight="600"
            text-anchor=${s?"start":"middle"} dominant-baseline="central" style=${Li}>${r.text}</text>`:v}
  `}function Xl(e,t,n,r){return h`${Ao(e.shadow,t,n-ne/2,ne)}${rr(r,t+ne/2,n)}`}function To(e,t,n,r,o){let i=e.fix??Ii,{label:a,chips:s}=n,l=[...a?[{w:Hi(a),draw:(g,_)=>Yl(e,g,_,a,o)}]:[],...s.map(g=>({w:ne,draw:(_,b)=>Xl(e,_,b,g)}))],p=(t.x1-t.x0)/r-8,u=[];for(let g of l){let _=u[u.length-1],b=_?_.reduce(($,w)=>$+w.w+nn,0):0;_&&b+g.w<=p?_.push(g):u.push([g])}let f=(t.y1-t.y0)/r,m=Math.max(.3*f-ne/2,.06*f),y=(t.x0+t.x1)/2;return h`<g transform=${`translate(${i(y)} ${i(t.y0)}) scale(${Ro(r)})`}>
    ${u.map((g,_)=>{let b=g.reduce((k,x)=>k+x.w,0)+nn*(g.length-1),$=m+ne/2+_*(ne+nn),w=-b/2;return g.map(k=>{let x=k.draw(i(w),i($));return w+=k.w+nn,x})})}
  </g>`}function Dt(e,t,n,r,o,i=!1,a=1){if(!r&&!o.length)return v;if(a!==1)return h`<g transform=${`translate(${t} ${n}) scale(${Ro(a)}) translate(${-t} ${-n})`}>
      ${Dt(e,t,n,r,o,i)}
    </g>`;let s=r?Hi(r):0,l=s+o.length*ne+(r?o.length:o.length-1)*nn,p=t-l/2,u=[];r&&(u.push(h`<g class="ui">${Yl(e,p,n,r,i)}</g>`),p+=s+nn);for(let f of o)u.push(h`<g class="ui">${Xl(e,p,n,f)}</g>`),p+=ne+nn;return h`${u}`}function We(e,t){return t.filter(n=>!!n).join(e("drawing.separator"))}function Ql(e,t,n){if(t==="single")return n;let r=e(`drawing.oven.${t}`);return n.map(o=>e("drawing.oven_state",{oven:r,state:o}))}function Jl(e,t){return t?`${e} ${t}`:e}var ec=mt+20;function Df(e){let t=e.handle==="none"?null:e.handle==="pro"?"pro":"tubular";if(e.finish==="stainless")return{kind:"stainless",handle:t??"tubular"};let n={black:"#2a2b2d",carbon:"#3b3d40",white:"#f1f0ec"};return{kind:"panel",color:El(e.panel_color??n[e.finish],"#ebe8e1"),handle:t}}function Fi(e,t,n,r,o,i){let a=n.handle==="pro"?8:n.handle?3.5:0;if(r){let s=Il(t,Bl,Kl),l=s.at(0,16)[1]+24*s.lift+a;return{body:h`
        ${ql(e,t,Wl(s)+1)}
        ${Ci(e,t,n)}
        ${Mi(e,s,n)}
        ${Zl(e,s,n,o)}
      `,statusY:Math.max(s.at(0,s.height*.35)[1],l+8+i/2)}}return{body:h`
      ${Fl(t)}
      ${Ci(e,t,n)}
      ${Mi(e,Ll(t),n)}
    `,statusY:Math.max(53,Jn+16+a+8+i/2)}}function Ni(e,t,n){return h`
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
    <ellipse cx=${t/2} cy=${mt+5.5} rx=${t*.36} ry="6" fill=${e.url("floor-light")} />
    <ellipse cx=${t/2} cy=${mt+4} rx=${t*.17} ry="2" fill=${n} opacity="0.5"
      filter=${e.url("blur-s")} />
    <rect x="6" y=${mt-10} width=${t-12} height="10" fill=${e.url("floor-spill")} />
  `}var tc=e=>{let{spec:t,state:n}=e;if(t.family!=="dishwasher")return null;let r=new Ve(e.uid),o=Math.round((t.width??24)*10),i=Df(e.appearance),a=tr(n),s=!!e.reducedMotion,l=n.dishwasher,p=n.available&&!a&&l?ko[l.status]:void 0,u=gt(ec,e.pixelHeight),{body:f,statusY:m}=Fi(r,o,i,a,!0,ne*u),{label:y,chips:g}=xo(n),{t:_}=e,b=We(_,[_("drawing.dishwasher"),...zo(_,n),n.available?null:_("drawing.offline")]),$=14;return A`<svg
    viewBox=${`${-$} -4 ${o+2*$} ${ec}`}
    role="img"
    aria-label=${b}
  >
    <defs>
      ${_o(r)}
      ${i.kind==="panel"?Ol(r,"panel",i.color):v}
    </defs>
    ${bo(r,0,o,mt,e.theme)}
    <g filter=${n.available?v:r.url("offline")}>${f}</g>
    ${p?Ni(r,o,p):v}
    ${Dt(tn(r),o/2,m,y,g,s,u)}
  </svg>`};function nt(e){return!!e&&e.on&&e.self_clean}function rn(e,t){return e?.on?t.clean!==void 0&&nt(e)?t.clean:e.preheated?t.preheated:e.progress===null?t.unknown:t.start+t.span*ke(e.progress):0}function Mo(e){if(!e)return null;let t=[];e.probe&&t.push("probe"),e.remote_ready&&t.push("remote");let n=null;if(nt(e))n={text:e.temp,progress:null,icon:"lock"};else if(e.on){let r=!e.preheated&&e.progress!==null?ke(e.progress):null;(e.temp||r!==null)&&(n={text:e.temp,progress:r,icon:null})}return n||t.length?{label:n,chips:t}:null}function Lf(e,t){let n=nt(t),r=[];return t.door_open&&r.push(e("drawing.state.door_open")),n?r.push(e("drawing.state.self_cleaning")):t.on?r.push(Jl(e(t.preheated?"drawing.state.preheated":"drawing.state.heating"),t.temp)):t.door_open||r.push(e("drawing.state.off")),t.light&&!t.door_open&&!n&&r.push(e("drawing.state.light_on")),t.probe&&r.push(e("drawing.state.probe_in")),t.remote_ready&&r.push(e("drawing.state.remote_ready")),r}function on(e,t,n){let r=[];for(let{position:o,state:i}of t)i&&r.push(...Ql(e,o,Lf(e,i)));return n&&r.push(e("drawing.timer",{time:n})),r}var Co=10;function Ki(e){return e.height+e.below+(e.floor?16:8)+Co}function or(e,t,n,r){return gt(Ki({height:t,below:n,floor:r}),e.pixelHeight)}function He(e,t,n,r,o,i={}){return h`
    ${tt(e,Ge(t,n,r,o),i)}
    ${Tn(t,n,r,o,.9)}
    ${Mn(Ge(t,n,r,o),.4,.5)}
  `}function nc(e,t,n){return h`
    <rect x=${e} y=${t-.9} width=${n} height="1.8" fill="#1d1e1f" opacity="0.85" />
    <rect x=${e} y=${t+.9} width=${n} height="0.6" fill="#ffffff" opacity="0.55" />`}function rc(e,t,n){return h`<rect x=${e-.9} y=${t} width="1.8" height=${n} fill="#1d1e1f" opacity="0.85" />`}function ji(e,t,n,r,o,i){let a=Math.min(30,r*.09);return h`${He(e,t,n,r,o)}${St(e,t+a,t+r-a,n+i,"tubular")}`}function If(e,t,n,r,o,i,a){let s=a-i,l=f=>(f*7919+104729)%997/997,p=[];if(n==="freezer"){let f=["#eef3f6","#d3dfe7","#e4ddd0","#c2d1dc"];for(let m=0,y=r+3;y<o-12;m++){let g=Math.min(24+18*l(m),o-y-2),_=i+s*(.22+.38*l(m+5));p.push(h`
        <rect x=${c(y)} y=${c(_)} width=${c(g)} height=${c(a-_+12)} rx="2.2" fill=${f[m%4]} />
        <rect x=${c(y+g-3)} y=${c(_+1)} width="3" height=${c(a-_+10)} rx="1.5" fill="#000"
          opacity="0.1" />
        <rect x=${c(y+1.5)} y=${c(_+.8)} width=${c(g-4)} height="1" rx="0.5" fill="#fff" opacity="0.75" />`),y+=g+2.5}}else{let f=[["fruit-r",7.5,6.8],["fruit-g",13,7.5],["fruit-o",6.8,6.2],["fruit-c",14,4.4],["fruit-y",6.4,5.2],["fruit-r",7,6.4],["fruit-g",11,7]];for(let m of[0,1]){let y=m?1:.8;for(let g=m*3,_=r+2+m*5;_<o-8;g++){let[b,$,w]=f[g%f.length],k=y*(.88+.24*l(g+11)),x=$*k,z=w*k,R=_+x,T=i+s*(m?.42+.16*l(g+2):.08+.14*l(g+4))+z,S=`M${c(R-x*.7)} ${c(T+z*.1)}Q${c(R)} ${c(T-z*.5)} ${c(R+x*.7)} ${c(T)}M${c(R-x*.2)} ${c(T-z*.25)}L${c(R-x*.05)} ${c(T+z*.6)}`,C=b==="fruit-g"?h`<path d=${S} fill="none" stroke="#d6e6a8" stroke-opacity="0.45" stroke-width="0.6" />`:h`<ellipse cx=${c(R-x*.32)} cy=${c(T-z*.42)} rx=${c(x*.22)} ry=${c(z*.13)}
                fill="#fff" opacity=${m?.22:.12} />`,M=m?v:h`<ellipse cx=${c(R)} cy=${c(T)} rx=${c(x)} ry=${c(z)} fill="#000" opacity="0.18" />`;p.push(h`
          <ellipse cx=${c(R+1)} cy=${c(T+1.6)} rx=${c(x)} ry=${c(z)} fill="#000" opacity="0.16" />
          <ellipse cx=${c(R)} cy=${c(T)} rx=${c(x)} ry=${c(z)} fill=${e.url(`${b}-${t}`)} />
          ${C}${M}`),_+=2*x-2+3*l(g+7)}}}let u=(f,m,y,g)=>h`
    <radialGradient id=${e.id(`${f}-${t}`)} cx="0.38" cy="0.32" r="0.75">
      <stop offset="0" stop-color=${m} />
      <stop offset="0.55" stop-color=${y} />
      <stop offset="1" stop-color=${g} />
    </radialGradient>`;return h`
    ${n==="produce"?h`<defs>
          ${u("fruit-r","#c4493d","#962c24","#5c1712")}
          ${u("fruit-g","#a3bf6a","#6b8f3c","#3a5722")}
          ${u("fruit-y","#ead36d","#c9a63a","#85681c")}
          ${u("fruit-o","#e9a456","#c27326","#7a4311")}
          ${u("fruit-c","#6f9450","#3f6630","#21391a")}
        </defs>`:v}
    ${p}
  `}function Bi(e,t,n,r,o,i,a,s){let p=Math.round(Math.min(26,Math.max(14,i*.15))),u=n-(1.04-1)*o/2,f=r+p,m=o*1.04,y=i*1.04,g=5,_=4.5,b=r+3,$=f+.6,[w,k]=[n+g+3,n+o-g-3],[x,z]=[u+5*1.04,u+m-5*1.04],R=q([[w+_,b],[k-_,b],[z-_*1.04,$],[x+_*1.04,$]]),T=q([[w,b],[w+_,b],[x+_*1.04,$],[x,$]]),S=(w+k)/2,C=(x+z)/2,M=`translate(${c(u)} ${c(f)}) scale(${1.04}) translate(${c(-n)} ${c(-r)})`;return{body:h`
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
        <clipPath id=${e.id(`bin-clip-${t}`)}><path d=${R} /></clipPath>
      </defs>
      <rect x=${n} y=${r} width=${o} height=${i} fill="#232527" />
      <rect x=${n+g} y=${r+2.5} width=${o-2*g} height=${i-4} fill="#0f1011" />
      <path d=${R} fill=${e.url(`bin-${t}`)} />
      <path d=${`M${c(S)} ${c(b)}L${c(C)} ${c($)}`} stroke="#8796a0" stroke-width="1.6" />
      <path d=${`M${c(S-.8)} ${c(b)}L${c(C-.8)} ${c($)}`} stroke="#fff" stroke-opacity="0.6"
        stroke-width="0.5" />
      <g clip-path=${e.url(`bin-clip-${t}`)}>
        ${If(e,t,s,w+_,k-_,b+2,$)}
      </g>
      <rect x=${n+g} y=${b} width=${o-2*g} height="5" fill="#000" opacity="0.28" />
      <path d=${T} fill=${e.url(`bin-side-${t}`)} />
      <path d=${T} fill=${e.url(`bin-side-${t}`)} transform=${`translate(${c(k+w)} 0) scale(-1 1)`} />
      <path d=${`M${c(w)} ${c(b)}L${c(x)} ${c($)}M${c(k)} ${c(b)}L${c(z)} ${c($)}`}
        stroke="#fff" stroke-opacity="0.6" stroke-width="0.8" />
      <rect x=${c(u+6)} y=${c(f+y-5)} width=${c(m-12)} height="11" fill="#000" opacity="0.34"
        filter=${e.url("blur-m")} />
      <g transform=${M}>${a}</g>
    `,at:(O,P)=>[u+(O-n)*1.04,f+(P-r)*1.04]}}function Cn(e,t,n,r,o,i,a){let s=Math.min(16,o*.06),l=i*.025;return h`
    <defs>
      <linearGradient id=${e.id(`liner-${t}`)} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#eef3f6" />
        <stop offset="1" stop-color="#c9d3da" />
      </linearGradient>
    </defs>
    <rect x=${n} y=${r} width=${o} height=${i} fill=${e.url(`liner-${t}`)} />
    <path d=${q([[n,r],[n+s,r+l],[n+s,r+i-l],[n,r+i]])} fill="#9fadb7"
      opacity="0.55" />
    <path d=${q([[n+o,r],[n+o-s,r+l],[n+o-s,r+i-l],[n+o,r+i]])}
      fill="#ffffff" opacity="0.4" />
    ${a.map(p=>h`
        <rect x=${n+s} y=${c(r+i*p-5)} width=${o-2*s} height="5" fill="#ffffff" opacity="0.22" />
        <rect x=${n+1} y=${c(r+i*p)} width=${o-2} height="1.6" fill="#ffffff" opacity="0.85" />
        <rect x=${n+1} y=${c(r+i*p+1.6)} width=${o-2} height="2.2" fill="#6f7f8a" opacity="0.35" />`)}
    <rect x=${n} y=${r} width=${o} height="18" fill=${e.url("ao-down")} opacity="0.6" />
  `}function Lt(e,t,n,r,o,i,a,s,l=!1){let f=r*.34,m=Math.min(18,r*.08),y=Math.min(o*.015,Co-1),g=i==="left"?1:-1,_=i==="left"?t:t+r,b=_+g*f,$=b+g*m,w=C=>n-y*C,k=C=>n+o+y*C,x=q([[_,w(0)],[b,w(1)],[b,k(1)],[_,k(0)]]),z=q([[b,w(1)],[$,w(1)],[$,k(1)],[b,k(1)]]),R=q([[$-g*3,w(1)],[$,w(1)],[$,k(1)],[$-g*3,k(1)]]),T=v;if(a==="v"){let C=1-14/r,M=_+g*f*C,O=M-g*.94*22,P=n+o*.2,U=P+Math.min(420,o*.5);T=h`
      <path d=${`M${c(M)} ${c(P+6)}H${c(O)}M${c(M)} ${c(U-6)}H${c(O)}`} stroke="#b9b9b7"
        stroke-width="4" />
      ${Rt(e,O,P,U,8)}`}else if(a==="h"){let C=_+g*f*(16/r),M=_+g*f*(1-16/r);T=h`<rect x=${c(Math.min(C,M))} y=${c(w(.6)+15)} width=${c(Math.abs(M-C))} height="6.4"
      rx="3.2" fill=${e.url("chrome")} />`}let S=l?q([[_+g*f*.1,w(.1)+22],[_+g*f*.88,w(.88)+22],[_+g*f*.88,k(.88)-30],[_+g*f*.1,k(.1)-30]]):null;return h`
    ${s}
    <path d=${q([[$,n],[$+g*10,n],[$+g*10,n+o],[$,n+o]])} fill="#000" opacity="0.18"
      filter=${e.url("blur-s")} />
    ${tt(e,x,{dim:.14})}
    ${S?h`<path d=${S} fill=${e.url("glass")} /><path d=${S} fill="#16130f" opacity="0.5" />`:v}
    <path d=${q([[b-g*1,w(1)],[b,w(1)],[b,k(1)],[b-g*1,k(1)]])}
      fill="#ffffff" opacity="0.5" />
    <path d=${z} fill="#a9abac" />
    <path d=${z} fill=${e.url("ss-falloff")} />
    <path d=${R} fill="#2e3032" />
    ${Mn(x,.35,.5)}
    ${T}
  `}function oc(e,t,n,r,o){if(!t.available||!n.length)return[];let i=new Set,a=[],s=0;for(let[l,p]of Object.entries(t.readouts)){if(!p)continue;let u=n.find(f=>f.zone===l&&!i.has(f.zone));u||(u={...n[0],cy:n[0].cy+(ne+6)*o*++s}),i.add(u.zone),a.push(Dt(tn(e),u.cx,u.cy,{text:p},[],r,o))}return a}function It(e,t,n){let{d:r,state:o}=e,i=t*10,a=n==="undercounter"||n==="drawers",s=a?345:840,l=a?40:45,p=s-l,u=(...$)=>o.available&&$.some(w=>o.doors[w]),f=o.available&&Object.values(o.doors).some(Boolean),m=[wo(r,5,p,i-10,l)],y=[],g=Math.min(420,p*.5),_=[.3,.52,.74];if(n==="column"||n==="undercounter"){if(f){let $=a?[.4,.7]:_;m.push(Lt(r,0,0,i,p,"right",a?"h":"v",Cn(r,"door",0,0,i,p,$)))}else m.push(He(r,0,0,i,p)),a?m.push(St(r,16,i-16,18,"tubular")):m.push(Rt(r,14,p*.2,p*.2+g));y.push({zone:"ref",cx:i/2,cy:a?70:150},{zone:"frz",cx:i/2,cy:a?70:150})}else if(n==="drawers"){let $=p/2,w=$-.9,k=$+.9,x=p-k,z=u("ref2_door_ajar","frz_door_ajar"),R=ji(r,0,0,i,w,18),T=ji(r,0,k,i,x,19),S=f&&(!z||u("ref_door_ajar","door_ajar"))?Bi(r,"upper",0,0,i,w,R,"produce"):null,C=u("frz_door_ajar")||o.readouts.frz?"freezer":"produce",M=z?Bi(r,"lower",0,k,i,x,T,C):null;m.push(nc(0,$,i),M?M.body:T,S?S.body:R);let O=(P,U)=>P?P.at(i/2,U)[1]:U;y.push({zone:"ref",cx:i/2,cy:O(S,70)},{zone:"ref2",cx:i/2,cy:O(M,$+70)}),y.push({zone:"frz",cx:i/2,cy:O(M,$+70)})}else if(n==="side_by_side"){let $=Math.round(i*.42),w=u("frz_door_ajar"),k=u("ref_door_ajar","door_ajar"),x=$-.9,z=$+.9,R=i-$-.9;if(w){let T=Cn(r,"frz",0,0,x,p,[.22,.42,.62,.8]);m.push(Lt(r,0,0,x,p,"left","v",T))}else m.push(He(r,0,0,x,p),Rt(r,$-14,p*.22,p*.22+g));if(k){let T=Cn(r,"ref",z,0,R,p,_);m.push(Lt(r,z,0,R,p,"right","v",T))}else m.push(He(r,z,0,R,p),Rt(r,$+14,p*.22,p*.22+g));m.push(rc($,0,p)),y.push({zone:"frz",cx:$/2,cy:150},{zone:"ref",cx:$+(i-$)/2,cy:150})}else{let $=Math.round(p*.64),w=n==="french_door",k=u("ref_door_ajar","door_ajar"),x=$+.9,z=p-x,R=ji(r,0,x,i,z,24),T=u("frz_door_ajar")?Bi(r,"frz",0,x,i,z,R,"freezer"):null;if(m.push(nc(0,$,i),T?T.body:R),w){let C=i/2-.9;k?(m.push(Cn(r,"ref",0,0,i,$-.9,[.3,.6])),m.push(Lt(r,0,0,C,$-.9,"left","v",h``)),m.push(Lt(r,i/2+.9,0,C,$-.9,"right","v",h``))):(m.push(He(r,0,0,C,$-.9),He(r,i/2+.9,0,C,$-.9)),m.push(rc(i/2,0,$)),m.push(Rt(r,i/2-13,$*.3,$*.3+$*.45)),m.push(Rt(r,i/2+13,$*.3,$*.3+$*.45)))}else k?m.push(Lt(r,0,0,i,$-.9,"right","v",Cn(r,"ref",0,0,i,$-.9,[.3,.6]))):(m.push(He(r,0,0,i,$-.9)),m.push(Rt(r,15,$*.3,$*.3+$*.48)));let S=T?T.at(i/2,$+80)[1]:$+80;y.push({zone:"ref",cx:i/2,cy:150},{zone:"frz",cx:i/2,cy:S})}let b=[e.t(a?"drawing.refrigeration.undercounter_refrigerator":"drawing.refrigeration.tall_refrigerator")];return f&&b.push(e.t("drawing.open.door")),{width:i,height:s,below:0,floor:!0,body:h`${m}`,over:h`${oc(r,o,y,e.reducedMotion,or(e,s,0,!0))}`,label:b}}function Go(e,t,n){let{d:r,state:o}=e,i=t*10,a=n?840:345,s=n?45:40,l=a-s,p=n?26:20,u=p,f=p,m=i-2*p,y=l-p-(n?36:28),g=!!o.readouts.wine2,_=o.available&&Object.values(o.doors).some(Boolean),b=Ge(u,f,m,y,3),$=f+6,k=(U=>$+35*U+27.5)(Math.max(0,Math.round((y/2-6-27.5)/35))),x=["bottle","bottle-amber","bottle-dark"],z=[];for(let U=0;U<4;U++)for(let I=0;I<5;I++){let L=(U*7+I*3+U*I%4)%10,H=I*29+14.5,N=U*35+14,Z=L===1||L===5||L===8;z.push(h`
        <circle cx=${H} cy=${N} r="12.2" fill=${r.url(x[L%3])} />
        ${Z?h`<circle cx=${H} cy=${N} r="5.2" fill=${L===5?"#c9a24e":"#6e1b2b"} />
              <circle cx=${H-1.5} cy=${N-1.7} r="1.5" fill="#fff" opacity="0.35" />`:h`<path d=${`M${H-8} ${N-6.5}A11 11 0 0 1 ${H-.5} ${N-10.7}`} fill="none" stroke="#e8f0e8"
              stroke-opacity="0.2" stroke-width="1.1" stroke-linecap="round" />`}
      `)}let R=[0,1,2,3].map(U=>h`
      <rect x="0" y=${U*35+27.5} width="145" height="4.2" fill="#9a774f" />
      <rect x="0" y=${U*35+27.5} width="145" height="1" fill="#e2c49a" opacity="0.7" />
      <rect x="0" y=${U*35+31.2} width="145" height="0.8" fill="#000" opacity="0.35" />`),T=h`
    <rect x=${u} y=${f} width=${m} height=${y} fill="#16130f" />
    <rect x=${u} y=${f} width=${m} height=${y} fill=${r.url("rack")} />
    ${g?h`<rect x=${u} y=${k-1} width=${m} height="6" fill="#0b0b0c" />
          <rect x=${u} y=${k-1} width=${m} height="0.6" fill="#fff" opacity="0.3" />`:v}
    <rect x=${u} y=${f} width=${m} height=${y} fill=${r.url("wine-light")} />`,S=[e.t("drawing.refrigeration.undercounter_wine")];_&&S.push(e.t("drawing.open.door"));let C=h`
    <defs>
      <clipPath id=${r.id("wine-glass")}><path d=${b} /></clipPath>
      ${[["bottle","#050706","#101712","#26332a","#4a5a4d","#151a16"],["bottle-amber","#0a0503","#22120a","#3a2312","#553a22","#160c06"],["bottle-dark","#030303","#0c0c0d","#1e1f21","#3c3e41","#111213"]].map(([U,I,L,H,N,Z])=>h`<radialGradient id=${r.id(U)} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color=${I} />
          <stop offset="0.42" stop-color=${L} />
          <stop offset="0.8" stop-color=${H} />
          <stop offset="0.93" stop-color=${N} />
          <stop offset="1" stop-color=${Z} />
        </radialGradient>`)}
      <pattern id=${r.id("rack")} width="145" height="140" patternUnits="userSpaceOnUse" x=${u+1} y=${$}>
        ${z}${R}
      </pattern>
      <linearGradient id=${r.id("wine-light")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff1d8" stop-opacity="0.55" />
        <stop offset="0.25" stop-color="#ffe9c4" stop-opacity="0.12" />
        <stop offset="1" stop-color="#000" stop-opacity="0.35" />
      </linearGradient>
    </defs>`,M=h`
    ${He(r,0,0,i,l)}
    <g clip-path=${r.url("wine-glass")}>
      ${T}
      <rect x=${u} y=${f} width=${m} height=${y} fill=${r.url("glass-env")} />
      <rect x=${u} y=${f} width=${m} height=${y} fill="#7a8a92" opacity="0.1" />
    </g>
    <path d=${b} fill="none" stroke="#0d0e0f" stroke-width="2" />
    <path d=${b} fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="0.6"
      transform="translate(0.8 0.8)" />
    ${Rt(r,i-11,l*.16,l*.16+Math.min(420,l*.6),7)}`,O=Lt(r,0,0,i,l,"left","v",h`<rect x="0" y="0" width=${i} height=${l} fill="#2a2520" />
      <g clip-path=${r.url("wine-glass")}>${T}</g>
      <rect x="0" y="0" width=${i} height="18" fill=${r.url("ao-down")} opacity="0.6" />`,!0),P=f+y*(g?.12:.18);return{width:i,height:a,below:0,floor:!0,body:h`
      ${C}
      ${wo(r,5,l,i-10,s)}
      ${_?O:M}
    `,over:h`
      ${oc(r,o,[{zone:"wine",cx:i/2,cy:P},{zone:"wine2",cx:i/2,cy:k+5+y*.12}],e.reducedMotion,or(e,a,0,!0))}
    `,label:S}}function Ui(e,t){let{d:n,state:r}=e,o=t*10,i=r.available&&Object.values(r.doors).some(Boolean),a=[e.t("drawing.refrigeration.ice_maker")];i&&a.push(e.t("drawing.open.door")),r.available&&r.ice_maker?.cleaning&&a.push(e.t("drawing.ice_maker.cleaning"));let s=[],l=o*.42,p=m=>(m*9301+49297)%233280/233280,u=0;for(let m=0;m<7;m++)for(let y=0;l+y*11<o-16;y++,u++){let g=7.5+3.5*p(u),_=l-4+y*11+m%2*5+4*p(u+7),b=158+m*11+5*p(u+13)-(m===0?4*p(u+3):0);s.push(Ge(_,b,g,g*.85,2.2))}let f=h`
    ${Cn(n,"ice",0,0,o,305,[.4])}
    <rect x="8" y="145" width=${o-16} height="150" rx="6" fill="#9fb0bd" />
    <path d=${s.join("")} fill="#f4f8fb" opacity="0.9" />
    <path d=${s.join("")} fill="none" stroke="#6f8494" stroke-width="0.7" />
    <rect x="8" y="145" width=${o-16} height="3" rx="1.5" fill="#ffffff" opacity="0.9" />`;return{width:o,height:345,below:0,floor:!0,body:h`
      ${wo(n,5,305,o-10,40)}
      ${i?Lt(n,0,0,o,305,"left","h",f):h`${He(n,0,0,o,305)}${St(n,14,o-14,19,"tubular")}`}
    `,label:a}}function ic(e,t,n,r,o,i,a,s){let l=Ge(n,r,o,i,7),p=6,u=Ge(n+p,r+p,o-2*p,i-2*p,3),f=s&&!!a?.on,m=s&&!!a?.light,y=f?rn(a,Vf):0,g=[.42,.7].map(_=>`M${c(n+p+4)} ${c(r+i*_)}H${c(n+o-p-4)}`).join("");return h`
    <defs>
      <clipPath id=${e.id(`win-${t}`)}><path d=${u} /></clipPath>
    </defs>
    ${$o(e,l)}
    <g clip-path=${e.url(`win-${t}`)}>
      ${m||f?h`
          <rect x=${n} y=${r} width=${o} height=${i} fill="#21180f" opacity=${m?.95:.7} />
          <path d=${g} stroke="#8f7a62" stroke-width="1.2" opacity=${m?.75:.3} />`:v}
      ${f?h`<rect x=${n} y=${r} width=${o} height=${i} fill=${e.url("heat")} opacity=${c(y)} />`:v}
      ${m?h`<rect x=${n} y=${r} width=${o} height=${i} fill=${e.url("cavity-light")} />`:v}
      ${m||f?h`<rect x=${n} y=${r} width=${o} height=${i} fill="#000" opacity="0.25" />`:v}
    </g>
    <path d=${`${l}${u}`} fill-rule="evenodd" fill="#050506" opacity="0.88" />
    <rect x=${n} y=${r} width=${o} height=${i} fill=${e.url("glass-env")} clip-path=${e.url(`win-${t}`)} />
    <path d=${l} fill="none" stroke="#000" stroke-opacity="0.6" stroke-width="1" />
  `}var Vf={preheated:.5,start:.16,span:.64,unknown:.35};function ac(e,t){let n=Ne[t]??Ne.red;return h`
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
  `}function sc(e,t,n){return e+Math.max(t*.28,ne*n/2+8)}function Wi(e,t,n,r){let{d:o,state:i}=e,a=t*10,s=n?511:285,l=46,p=n?2:1,u=(s-l-2*p)/p,f=[],m=[],y=[],g=[0,1].slice(0,p),_=or(e,s,0,!1),b=[];for(let $=0;$<5;$++)b.push(Ge(28+$*15,21,7,1.6,.8),Ge(a-98+$*15,21,7,1.6,.8));f.push(h`
    ${$o(o,Ge(0,0,a,l))}
    ${Tn(0,0,a,l,.6)}
    <rect x=${a/2-34} y="11" width="68" height="22" rx="2.5" fill="#06090b" />
    <rect x=${a/2-34} y="11" width="68" height="22" rx="2.5" fill="none" stroke="#ffffff" stroke-opacity="0.12"
      stroke-width="0.6" />
    <path d=${b.join("")} fill="#ffffff" opacity="0.45" />
  `);for(let $ of g){let w=l+2+$*(u+2),k=r[$]??{prefix:$===0?"cav":"cav2",position:"single",width:null},x=i.ovens?.[k.prefix],z=n?$===0?"upper":"lower":"single",R=u-66;if(f.push(h`
      ${He(o,0,w,a,u,{brush:"h"})}
      ${St(o,24,a-24,w+20,"tubular")}
      ${ic(o,String($),32,w+44,a-64,R,x,i.available)}
    `),i.available&&x?.on&&x.temp){let T=sc(w+44,R,_);m.push(Dt(tn(o),a/2,T,{text:x.temp},[],e.reducedMotion,_))}y.push({position:z,state:x})}return{width:a,height:s,below:0,floor:!1,body:h`<defs>${ac(o,e.knobs)}</defs>${f}`,over:h`${m}`,label:[e.t(n?"drawing.wall_oven_double":"drawing.wall_oven"),...on(e.t,y,i.display)]}}function Hf(e,t,n,r){let o=Ne[r]??Ne.red;return h`
    <circle cx=${t+1.2} cy=${n+2.6} r="13.5" fill="#000" opacity="0.25" filter=${e.url("blur-s")} />
    <circle cx=${t} cy=${n} r="13.5" fill=${e.url("chrome")} />
    <circle cx=${t} cy=${n} r="11" fill="#1b1617" />
    <circle cx=${t} cy=${n} r="10.4" fill=${e.url("knob")} />
    <rect x=${t-1.9} y=${n-8.6} width="3.8" height="17.2" rx="1.6" fill=${o.edge} opacity="0.85" />
    <rect x=${t-1.9} y=${n-8.2} width="1" height="16.4" rx="0.5" fill=${o.light} opacity="0.7" />
    <ellipse cx=${t-3.6} cy=${n-4.6} rx="3.8" ry="1.9" transform=${`rotate(-30 ${t-3.6} ${n-4.6})`}
      fill="#fff" opacity=${o.sheen*2} />
  `}function lc(e,t,n,r){let{d:o,state:i}=e,a=t*10,s=360,l=20,p=66,u=l+p+2,f=42,m=s-f-u,y=r.length?r:[{prefix:"cav",position:"single",width:null}],g=y.reduce((T,S)=>T+(S.width??t/y.length),0),_=Math.max(4,n)+y.length,b=[],$=[],w=Math.max(4,n),k=or(e,s,0,!0);for(let T=0;T<w;T++){let S=a/w*(T+.5);$.push(`M${c(S-16)} 9q16 -9 32 0`)}let x=[h`
      <rect x="2" y="5" width=${a-4} height="9" rx="1.5" fill="#1f2021" />
      <path d=${$.join("")} fill="none" stroke="#2c2d2f" stroke-width="5" stroke-linecap="round" />
      <path d=${$.join("")} fill="none" stroke="#5a5c5f" stroke-width="0.8" transform="translate(0 -2)" />
      ${tt(o,Ge(0,13,a,7),{grain:0})}
      ${Tn(0,13,a,7,1)}
      ${He(o,0,l,a,p,{brush:"h"})}
    `];for(let T=0;T<_;T++)x.push(Hf(o,a/_*(T+.5),l+p/2,e.knobs));let z=0,R=[];return y.forEach((T,S)=>{let C=a*(T.width??t/y.length)/g-(S<y.length-1?1:0),M=i.ovens?.[T.prefix],O=m-82;x.push(h`
      ${He(o,z,u,C,m,{brush:"h"})}
      ${St(o,z+18,z+C-18,u+22,"pro")}
      ${ic(o,String(S),z+26,u+52,C-52,O,M,i.available)}
    `),i.available&&M?.on&&M.temp&&R.push(Dt(tn(o),z+C/2,sc(u+52,O,k),{text:M.temp},[],e.reducedMotion,k)),b.push({position:y.length>1?T.position:"single",state:M}),z+=C+2}),x.unshift(h`
    ${tt(o,Ge(6,s-f,a-12,f),{dim:.12,grain:.08,brush:"h"})}
    <rect x="6" y=${s-f} width=${a-12} height="14" fill=${o.url("ao-down")} />
  `),{width:a,height:s,below:0,floor:!0,body:h`<defs>${ac(o,e.knobs)}</defs>${x}`,over:h`${R}`,label:[e.t("drawing.range"),...on(e.t,b,i.display)]}}function Ff(e){if(e==null)return"#fff1d6";let t=Math.min(1,Math.max(0,(e-2700)/2300)),n=(r,o)=>Math.round(r+(o-r)*t);return`rgb(${n(255,238)}, ${n(214,244)}, ${n(160,255)})`}function qi(e,t,n){let{d:r,state:o}=e,i=t*10,a=n!=="insert",s=a?350:130,l=a?175:0,p=s-50,u=n==="island"?140:112,f=o.available?o.hood:void 0,m=f?.light??!1,y=m?.35+.65*((f?.brightness??100)/100):0,g=Ff(f?.kelvin??null),_=[[i/2-i*.3,l],[i/2+i*.3,l],[i,p],[0,p]],b=[e.t("drawing.hood.hood")];return m&&b.push(e.t("drawing.state.light_on")),f&&f.fan>0&&b.push(e.t("drawing.fan_speed",{speed:f.fan})),{width:i,height:s,below:110,floor:!1,body:h`
      <defs>
        <linearGradient id=${r.id("canopy-shade")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.16" />
          <stop offset="1" stop-color="#000000" stop-opacity="0.12" />
        </linearGradient>
      </defs>
      ${a?h`
          ${tt(r,Ge(i/2-u/2,0,u,l+2),{brush:"h"})}
          ${Tn(i/2-u/2,0,u,l+2,.6)}
          <rect x=${i/2-u/2} y=${l*.48} width=${u} height="1.2" fill="#000" opacity="0.25" />
          <rect x=${i/2-u/2} y=${l*.48+1.2} width=${u} height="0.7" fill="#fff" opacity="0.5" />
          <rect x=${i/2-u/2} y=${l-6} width=${u} height="8" fill=${r.url("ao-up")} />`:v}
      ${a?h`
          ${tt(r,q(_),{brush:"h"})}
          <path d=${q(_)} fill=${r.url("canopy-shade")} />
          <path d=${`M${c(_[0][0])} ${l}L${c(_[1][0])} ${l}`} stroke="#fff" stroke-opacity="0.7"
            stroke-width="0.8" />`:v}
      ${He(r,0,p,i,46,{brush:"h"})}
      ${[0,1,2,3].map($=>{let w=i-90+$*19,k=p+23;return h`
          <circle cx=${w+.5} cy=${k+1.2} r="3.4" fill="#000" opacity="0.25" filter=${r.url("blur-s")} />
          <circle cx=${w} cy=${k} r="3.2" fill=${r.url("chrome")} />
          <circle cx=${w} cy=${k} r="3.2" fill="none" stroke="#3b3a37" stroke-opacity="0.55" stroke-width="0.5" />
          <circle cx=${w-.8} cy=${k-1} r="1.1" fill="#fff" opacity="0.5" />`})}
      <rect x="2" y=${p+46} width=${i-4} height="4" fill="#3a3c3e" />
      <rect x="2" y=${p+49} width=${i-4} height="1" fill="#000" opacity="0.5" />
    `,over:m?h`
        <defs>
          <radialGradient id=${r.id("hood-light")} gradientUnits="userSpaceOnUse" cx=${i/2} cy=${s}
            r=${c(i*.6)} gradientTransform=${`translate(${i/2} ${s}) scale(1 0.32) translate(${-i/2} ${-s})`}>
            <stop offset="0" stop-color=${g} stop-opacity=${c(.8*y)} />
            <stop offset="0.5" stop-color=${g} stop-opacity=${c(.3*y)} />
            <stop offset="1" stop-color=${g} stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect x=${c(-i*.12)} y=${s} width=${c(i*1.24)} height="106" fill=${r.url("hood-light")} />
        <rect x="20" y=${s-1} width=${i-40} height="2" rx="1" fill=${g} opacity=${c(.9*y)} />`:v,label:b}}function Zi(e,t){let{d:n,state:r}=e,o=t*10,i=tr(r),a=or(e,mt,0,!0),s={kind:"stainless",handle:"tubular"},{body:l,statusY:p}=Fi(n,o,s,i,!1,ne*a),{label:u,chips:f}=xo(r),m=r.dishwasher,y=r.available&&!i&&m?ko[m.status]:void 0;return{width:o,height:mt,below:0,floor:!0,body:l,over:h`
      ${y?Ni(n,o,y):v}
      ${Dt(tn(n),o/2,p,u,f,e.reducedMotion,a)}
    `,label:[e.t("drawing.dishwasher"),...zo(e.t,r)]}}function cc(e,t){let{d:n}=e,r=t*10;return{width:r,height:345,below:0,floor:!0,body:h`
      ${tt(n,Ge(6,305,r-12,40),{dim:.12,grain:.08})}
      <rect x="6" y="305" width=${r-12} height="14" fill=${n.url("ao-down")} />
      ${$o(n,Ge(0,0,r,38))}
      ${Tn(0,0,r,38,.6)}
      <rect x=${r/2-26} y="12" width="52" height="14" rx="2" fill="#06090b" />
      <rect x=${r/2-26} y="12" width="52" height="14" rx="2" fill="none" stroke="#fff" stroke-opacity="0.12"
        stroke-width="0.6" />
      ${He(n,0,40,r,265)}
      ${St(n,20,r-20,60,"tubular")}
    `,label:[e.t("drawing.appliance")]}}function ge(e,t){return e&&Number.isFinite(e)?Math.min(72,Math.max(12,e)):t}function jf(e,t){switch(e.form){case"column_wine":case"wine_over_drawers":return Go(t,ge(e.width,24),!0);case"undercounter_wine":case"undercounter_beverage":return Go(t,ge(e.width,24),!1);case"ice_maker":return Ui(t,ge(e.width,15));case"undercounter_refrigerator":return It(t,ge(e.width,24),"undercounter");case"undercounter_drawers":return It(t,ge(e.width,24),"drawers");case"side_by_side":return It(t,ge(e.width,48),"side_by_side");case"french_door":return It(t,ge(e.width,36),"french_door");case"over_under":case"tall_over_under":return It(t,ge(e.width,e.form==="tall_over_under"?30:36),"over_under");default:return It(t,ge(e.width,30),"column")}}function Bf(e,t){switch(e.form){case"refrigerator":{let n=ge(e.width,36);return It(t,n,n<=30?"column":n<42?"over_under":"side_by_side")}case"wine":{let n=ge(e.width,24);return Go(t,n,n===18||n>=30)}case"ice_maker":return Ui(t,ge(e.width,15));case"oven":return Wi(t,ge(e.width,30),!!t.state.ovens?.cav2,[]);case"hood":return qi(t,ge(e.width,36),"wall");case"dishwasher":return Zi(t,ge(e.width,24));default:return cc(t,ge(e.width,24))}}function Kf(e,t){switch(e.family){case"refrigeration":return jf(e,t);case"range":return lc(t,ge(e.width,30),e.burners||4,e.ovens??[]);case"wall_oven":return Wi(t,ge(e.width,30),e.form==="double",e.ovens??[]);case"hood":return qi(t,ge(e.width,36),e.form);case"dishwasher":return Zi(t,ge(e.width,24));default:return Bf(e,t)}}function Eo(e){let t=new Ve(e.uid),{state:n}=e,r=Kf(e.spec,{d:t,state:n,t:e.t,knobs:e.appearance?.knobs??"red",reducedMotion:!!e.reducedMotion,pixelHeight:e.pixelHeight}),o=14,i=We(e.t,n.available?r.label:[r.label[0],e.t("drawing.offline")]);return A`<svg
    viewBox=${`${-o} ${-Co} ${r.width+2*o} ${Ki(r)}`}
    role="img"
    aria-label=${i}
  >
    <defs>${_o(t)}</defs>
    ${r.floor?bo(t,0,r.width,r.height,e.theme):v}
    <g filter=${n.available?v:t.url("offline")}>${r.body}</g>
    ${n.available?r.over??v:v}
  </svg>`}var pc={stainless:{mid:"#d1d0ce",grain:1},black:{mid:"#505256",grain:.7},carbon:{mid:"#84878b",grain:.85}},uc=[[0,.561],[.05,.575],[.12,.624],[.2,.724],[.3,.86],[.4,.937],[.5,.991],[.58,1],[.66,.955],[.75,.86],[.85,.706],[.95,.588],[1,.566]],Oo=[[0,.64],[.06,.69],[.15,.77],[.25,.89],[.35,.955],[.45,.96],[.55,.975],[.62,1],[.7,.95],[.8,.885],[.9,.785],[1,.7]],Uf=[[0,"#070707"],[.1,"#0c0c0c"],[.2,"#141414"],[.3,"#1f1f1f"],[.4,"#2a2a2a"],[.5,"#333333"],[.6,"#2b2b2b"],[.7,"#1f1f1f"],[.8,"#141414"],[.9,"#0c0c0c"],[1,"#070707"]],Wf=[[0,"#1a1a1a"],[.17,"#262626"],[.27,"#2e2e2e"],[.4,"#393939"],[.5,"#3a3a3a"],[.6,"#363636"],[.7,"#2b2b2b"],[.8,"#222222"],[1,"#161616"]],dc={...Ne,stainless:{light:"#dfe0e1",base:"#b4b6b8",dark:"#7f8285",rim:"#eff0f0"}},qf={saturation:.08,slope:.62,lift:.2};function Po(e){return{ids:e,metal:e.id("metal"),sheen:e.id("sheen"),glass:e.id("glass"),blackGlass:e.id("black-glass"),chrome:e.id("chrome"),capEndLeft:e.id("cap-l"),capEndRight:e.id("cap-r"),knob:e.id("knob"),knobRim:e.id("knob-rim"),bezelRight:e.id("bezel-r"),bezelLeft:e.id("bezel-l"),bevelTop:e.id("bevel-t"),bevelLeft:e.id("bevel-l"),bevelRight:e.id("bevel-r"),bevelBottom:e.id("bevel-b"),recessRight:e.id("recess-r"),recessBottom:e.id("recess-b"),dropShadow:e.id("drop"),grain:e.id("grain"),offline:e.id("offline"),blur:e.id("blur"),blurWide:e.id("blur-wide"),blurFine:e.id("blur-fine"),pillShadow:e.id("pill-shadow")}}var G=e=>`url(#${e})`;function Yi(e,t,n,r,o=1,i=uc){let a=pc[t].mid;return h`<linearGradient id=${e} gradientUnits="userSpaceOnUse" x1=${n} y1="0" x2=${n+r} y2="0">
    ${i.map(([s,l])=>h`<stop offset=${s} stop-color=${Zf(a,1-(1-l)*o)} />`)}
  </linearGradient>`}function Gn(e,[t,n,r,o],i,a){return h`<linearGradient id=${e} x1=${t} y1=${n} x2=${r} y2=${o}>
    <stop offset="0" stop-color="#fff" stop-opacity=${i} />
    <stop offset="1" stop-color="#fff" stop-opacity=${a} />
  </linearGradient>`}function Do(e,t){let n=pc[t.finish],r=dc[t.knobs]??dc.red,o=t.parts??{},{x:i,y:a,width:s,height:l}=t,p=i+s,u=a+l,f=(.1*n.grain).toFixed(3),m=(.5-.05*n.grain).toFixed(3),y=_=>_.map(([b,$])=>h`<stop offset=${b} stop-color=${$} />`),g=h`
    <stop offset="0" stop-color="#fff" stop-opacity="0.08" />
    <stop offset="0.5" stop-color="#fff" stop-opacity="0.02" />
    <stop offset="1" stop-color="#000" stop-opacity="0.05" />`;return h`
    ${Yi(e.metal,t.finish,i,s,1,t.light??uc)}
    <linearGradient id=${e.sheen} gradientUnits="userSpaceOnUse" x1="0" y1=${a} x2="0" y2=${u}>
      <stop offset="0" stop-color="#fff" stop-opacity="0.06" />
      <stop offset="0.35" stop-color="#fff" stop-opacity="0" />
      <stop offset="0.7" stop-color="#000" stop-opacity="0" />
      <stop offset="1" stop-color="#000" stop-opacity="0.05" />
    </linearGradient>
    ${o.glass?h`<linearGradient id=${e.glass} gradientUnits="userSpaceOnUse" x1=${i} y1="0" x2=${p} y2="0">
          ${y(Wf)}
        </linearGradient>`:v}
    ${o.blackGlass?h`<linearGradient id=${e.blackGlass} gradientUnits="userSpaceOnUse" x1=${i} y1="0" x2=${p} y2="0">
          ${y(Uf)}
        </linearGradient>`:v}
    ${go(e.chrome)}
    ${o.caps?h`
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
        </linearGradient>`:v}
    ${o.knob?yo(e.knob,r):v}
    ${o.bezel?h`
        <linearGradient id=${e.knobRim}><stop offset="0" stop-color=${r.rim} /></linearGradient>
        <linearGradient id=${e.bezelRight} x1="1" y1="0.65" x2="0" y2="0.35">${g}</linearGradient>
        <linearGradient id=${e.bezelLeft} x1="0" y1="0.65" x2="1" y2="0.35">${g}</linearGradient>`:v}
    ${o.bevel?h`
        ${Gn(e.bevelTop,[0,0,0,1],.03,.1)}
        ${Gn(e.bevelLeft,[0,0,1,0],.1,.3)}
        ${Gn(e.bevelRight,[1,0,0,0],.05,.19)}
        ${Gn(e.bevelBottom,[0,1,0,0],.08,.24)}`:v}
    ${o.recess?h`
        ${Gn(e.recessRight,[0,0,1,0],.3,0)}
        ${Gn(e.recessBottom,[0,0,0,1],.3,0)}`:v}
    ${o.dropShadow?h`
        <linearGradient id=${e.dropShadow} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#000" stop-opacity="0.34" />
          <stop offset="0.45" stop-color="#000" stop-opacity="0.12" />
          <stop offset="1" stop-color="#000" stop-opacity="0" />
        </linearGradient>`:v}
    <filter id=${e.grain} x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.006 0.85" numOctaves="2" seed="11" result="noise" />
      <feColorMatrix in="noise" type="matrix"
        values="0.5 0.5 0 0 0  0.5 0.5 0 0 0  0.5 0.5 0 0 0  0 0 0 0 1" result="gray" />
      <feComponentTransfer in="gray" result="grain">
        <feFuncR type="linear" slope=${f} intercept=${m} />
        <feFuncG type="linear" slope=${f} intercept=${m} />
        <feFuncB type="linear" slope=${f} intercept=${m} />
      </feComponentTransfer>
      <feBlend in="grain" in2="SourceGraphic" mode="overlay" result="brushed" />
      <feComposite in="brushed" in2="SourceAlpha" operator="in" />
    </filter>
    ${o.offline?Pt(e.offline,qf):v}
    <filter id=${e.blur} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.4" />
    </filter>
    ${o.wideBlur?h`<filter id=${e.blurWide} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>`:v}
    ${o.fineBlur?h`<filter id=${e.blurFine} x="-10%" y="-200%" width="120%" height="500%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>`:v}
    ${o.pills?h`<filter id=${e.pillShadow} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>`:v}
  `}function fc(e,t,n,r,o,i){let a=e.ids.id("contact"),s=An(i);return h`
    <radialGradient id=${a}>
      <stop offset="0" stop-color="#000" stop-opacity=${s} />
      <stop offset="0.6" stop-color="#000" stop-opacity=${s*.45} />
      <stop offset="1" stop-color="#000" stop-opacity="0" />
    </radialGradient>
    <ellipse cx=${t} cy=${n} rx=${r} ry=${o} fill=${G(a)} />
  `}function Zf(e,t){return t<=1?he("#000000",e,t):he(e,"#ffffff",t-1)}var an=122,ir=30,ar=9.5,En=2.5,At=16,Lo=3.5,_c=1.5,sr=18.5,Yf=13,Xf=2.2,$c=6.5,Qf=.8,Qi=59,hc=92,Xi=24,Jf=17.7,eh=[0,18,32,46,60];function bc(e){return{baffles:e.id("baffles"),canopy:e.id("canopy"),flange:e.id("flange"),lens:e.id("lens"),lampGlow:e.id("lamp-glow"),wood:e.id("wood"),lightCone:e.id("cone"),fade:e.id("fade"),fadeMask:e.id("fade-mask"),vapor:e.id("vapor")}}var Vt=[[2700,"#ffd29a"],[3500,"#ffe8c8"],[4e3,"#fff4e6"],[5e3,"#eef4ff"]];function wc(e){let t=ke(e??3800,Vt[0][0],Vt[Vt.length-1][0]);for(let n=1;n<Vt.length;n++){let[r,o]=Vt[n];if(t<=r){let[i,a]=Vt[n-1];return he(a,o,(t-i)/(r-i))}}return Vt[Vt.length-1][1]}function Ji(e){let t=e<=300?2:e<=420?3:e<=540?4:5,n=e/2,r=Array.from({length:t},(a,s)=>hc+(e-hc*2)*s/(t-1)),o=a=>{let s=n+a*Qi,l=r.filter(u=>a*(u-n)>1).sort((u,f)=>a*(f-u));if(!l.some(u=>Math.abs(u-s)<Xi))return l;let p=a<0?Math.min(l[0],s-Xi):Math.max(l[0],s+Xi);return l.map((u,f)=>p+(s-p)*f/l.length)},i=r.filter(a=>Math.abs(a-n)<=1);return[...o(-1),...i,...o(1)].sort((a,s)=>a-s)}function vc(e,t,n,r){let o=(r?Lo:0)+_c;return[[e+o,n],[t-o,n],[t-sr,n+At],[e+sr,n+At]]}function kc(e,t,n){let r=n==="light"?he(t.lightColor,"#ffffff",.5):t.lightColor;return h`
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
      <stop offset="0" stop-color=${r} stop-opacity="0.85" />
      <stop offset="0.4" stop-color=${r} stop-opacity="0.32" />
      <stop offset="1" stop-color=${r} stop-opacity="0" />
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
  `}function xc(e,t,n,r){let o=Math.min(90,n*.3),i=[[o,r],[n-o,r],[n,r+an],[0,r+an]];return h`
    ${Yi(t.canopy,"stainless",0,n,.35,Oo)}
    <polygon points=${Y(i)} fill=${G(t.canopy)} />
    <polygon points=${Y(i)} fill=${G(e.sheen)} />
  `}function zc(e,t){let n=Math.min(90,e*.3);return h`
    <line x1=${n} y1=${t+.4} x2=${e-n} y2=${t+.4} stroke="#000" stroke-width="0.8"
      opacity="0.35" />
    <line x1=${n+.3} y1=${t+1.2} x2=${e-n-.3} y2=${t+1.2} stroke="#fff"
      stroke-width="0.6" opacity="0.35" />
    <line x1=${n} y1=${t} x2="0" y2=${t+an} stroke="#fff" stroke-width="0.8" opacity="0.4" />
    <line x1=${e-n} y1=${t} x2=${e} y2=${t+an} stroke="#000" stroke-width="0.8"
      opacity="0.2" />
  `}function Sc(e,t,n,r){let o=r+ir,i=[[t,o],[n,o],[n-Lo,o+ar],[t+Lo,o+ar]];return h`
    <rect x=${t} y=${r} width=${c(n-t)} height=${ir} fill=${G(e.metal)} />
    <polygon points=${Y(i)} fill=${G(e.metal)} />
    <polygon points=${Y(i)} fill="#000" opacity="0.07" />
  `}function Rc(e,t,n,r,o,i,a=!0){let s=r-n,l=(n+r)/2,p=o+ir,u=a?p+ar:o,f=u+En,m=f+At,y=a?Lo:0,g=y+_c,_=P=>g+(sr-g)*(P-f)/At,b=vc(n,r,f,a),$=f+Xf,w=$+$c,k=m-Qf,x=P=>_(P)+Yf,z=[[n+x($),$],[r-x($),$],[r-x(k),k],[n+x(k),k]],R=Ji(s).map(P=>n+P),T=s>=420?[l-41,l+41,n+s*.2,r-s*.2]:[l-41,l+41],S=n+x(k),C=r-x(k),M=e.ids.id("opening"),O=e.ids.id("underside");return h`
    ${a?h`
        <line x1=${n} y1=${o+.3} x2=${r} y2=${o+.3} stroke="#000" stroke-width="0.6" opacity="0.22" />
        <line x1=${n} y1=${o+1.3} x2=${r} y2=${o+1.3} stroke="#fff" stroke-width="0.5" opacity="0.25" />
        <line x1=${n} y1=${p} x2=${r} y2=${p} stroke="#000" stroke-width="0.5" opacity="0.16" />
        <line x1=${n} y1=${p+.6} x2=${r} y2=${p+.6} stroke="#fff" stroke-width="0.5"
          opacity="0.3" />`:v}
    <polygon points=${Y([[n+y,u],[r-y,u],[r-g,f],[n+g,f]])}
      fill=${G(e.chrome)} />
    <line x1=${n+y} y1=${u+.2} x2=${r-y} y2=${u+.2} stroke="#000" stroke-width="0.6"
      opacity="0.4" />
    <clipPath id=${O}><polygon points=${Y(b)} /></clipPath>
    <clipPath id=${M}><polygon points=${Y(z)} /></clipPath>
    <polygon points=${Y(b)} fill=${G(t.flange)} />
    <g clip-path=${G(M)}>
      <rect x=${n} y=${c($)} width=${c(s)} height=${c(k-$)} fill="#57595b" />
      ${th(t,S,C,l,$,T)}
      <rect x=${c(S)} y=${c(w)} width=${c(C-S)} height=${c(k-w)}
        fill="#828486" />
      <line x1=${c(S)} y1=${c(w+2.2)} x2=${c(C)} y2=${c(w+2.2)} stroke="#fff"
        stroke-width="0.4" opacity="0.1" />
      <line x1=${c(S)} y1=${c(w+4.4)} x2=${c(C)} y2=${c(w+4.4)} stroke="#000"
        stroke-width="0.4" opacity="0.08" />
      <line x1=${c(S)} y1=${c(w+.2)} x2=${c(C)} y2=${c(w+.2)} stroke="#000"
        stroke-width="0.5" opacity="0.3" />
      ${[S,C].map(P=>h`<line x1=${c(P)} y1=${c($)} x2=${c(P)} y2=${c(k)} stroke="#000"
          stroke-width="0.4" opacity="0.3" />`)}
      <rect x=${n} y=${c($)} width=${c(s)} height="1.6" fill="#000" opacity="0.18" />
    </g>
    <polygon points=${Y(z)} fill="none" stroke="#000" stroke-width="0.5" opacity="0.35" />
    <rect x=${c(S)} y=${c(k)} width=${c(C-S)} height=${c(m-k)} fill="#e4e5e6" />
    ${i.light>0?h`<g clip-path=${G(O)}>${R.map(P=>h`<ellipse cx=${c(P)} cy=${c(f+4)} rx="30" ry=${At}
            fill=${G(t.lampGlow)} opacity=${c(.5+.5*i.light)} />`)}</g>`:v}
    <clipPath id=${e.ids.id("below-edge")}>
      <rect x=${c(n-20)} y=${c(u)} width=${c(s+40)} height=${c(At+En+20)} />
    </clipPath>
    <g clip-path=${G(e.ids.id("below-edge"))}>${R.map(P=>nh(e,t,P,f,i))}</g>
    ${mc(e,l-Qi,f,"light",i.light>0?18+i.light*42:0)}
    ${mc(e,l+Qi,f,"fan",eh[Math.round(ke(i.fan,0,4))])}
  `}function th(e,t,n,r,o,i){let a=Jf,s=6.8,l=4.5,p=$c,u=2.5,f=p*.5,m=(b,$)=>h`
    <rect x=${c(b)} y="0" width=${c($-b)} height=${p} fill=${G(`${e.baffles}-back`)} />
    <path fill="#6a6c6e" d=${`M ${c(b)} 0 H ${c(b+u)} V ${c(f)} Q ${c(b+u)} ${c(p*.88)} ${c(b)} ${p} Z`} />
    <path fill="#66686a" d=${`M ${c($)} 0 H ${c($-u)} V ${c(f)} Q ${c($-u)} ${c(p*.88)} ${c($)} ${p} Z`} />
    <line x1=${c(b+.15)} y1="0" x2=${c(b+.15)} y2=${p} stroke="#000" stroke-width="0.3" opacity="0.3" />`,y=[...i].sort((b,$)=>b-$),g=[t,...y,n],_=g.slice(0,-1).map((b,$)=>{let w=g[$+1],k=b<r&&w>r?r-s/2:w<=r?w-l-a:b+l+a-s,x=`${e.baffles}-${$}`;return h`
      <pattern id=${x} patternUnits="userSpaceOnUse" x=${c(k)} y=${c(o)} width=${c(a*2)} height=${p}>
        ${[0,a].map(z=>h`
            <rect x=${c(z)} y="0" width=${s} height=${p} fill="#9fa1a3" />
            ${m(z+s,z+a)}`)}
        <circle cx=${c(a+s+(a-s)/2)} cy=${c(p*.36)} r="0.38" fill="#1c1e20" />
        <rect x=${c(a+s+(a-s)/2-.16)} y=${c(p*.44)} width="0.32" height=${c(p*.26)}
          rx="0.16" fill="#26282a" />
      </pattern>
      <rect x=${c(b)} y=${c(o)} width=${c(w-b)} height=${p} fill=${G(x)} />`});return h`
    <linearGradient id=${`${e.baffles}-back`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#626466" />
      <stop offset="1" stop-color="#46484a" />
    </linearGradient>
    ${_}
    ${y.map(b=>h`<rect x=${c(b-2.4)} y=${c(o)} width="4.8" height=${p} fill="#9fa1a3" />
        <rect x=${c(b-.35)} y=${c(o)} width="0.7" height=${p} fill="#2c2e30" />`)}
  `}function nh(e,t,n,r,o){let a=r+.3,s=`M ${c(n-2.05)} ${c(a)} H ${c(n+2.05)} V ${c(a+4.5-2.05)} A ${2.05} ${2.05} 0 0 1 ${c(n-2.05)} ${c(a+4.5-2.05)} Z`;return o.light<=0?h`<path d=${s} transform="translate(0 0.6)" fill="#000" opacity="0.16" /><path d=${s} fill=${G(t.lens)} />`:h`
    <circle cx=${c(n)} cy=${c(a+2.4)} r="6" fill=${o.lightColor}
      opacity=${c(.6+.4*o.light)} filter=${G(e.blur)} />
    <path d=${s} fill="#ffffff" />
  `}function mc(e,t,n,r,o){let i=n,a=o*Math.PI/180,s=Math.cos(a),l=Math.sin(a),p=3.45,u=1.7,f=Math.abs(p*2*s),m=Math.abs(u*l),y=Math.max(f+m,.6)/2,g=t-y,_=l>=0?g+f:g,b=Math.min(.8,y),$=i+1.5,w=i+2.2,k=i+5.4,x=[`M ${c(t-7.6)} ${c($)} L ${c(t+7.6)} ${c($)}`,`Q ${c(t+y)} ${c($)} ${c(t+y)} ${c(w)}`,`L ${c(t+y)} ${c(k-b)} Q ${c(t+y)} ${c(k)} ${c(t+y-b)} ${c(k)}`,`L ${c(t-y+b)} ${c(k)} Q ${c(t-y)} ${c(k)} ${c(t-y)} ${c(k-b)}`,`L ${c(t-y)} ${c(w)} Q ${c(t-y)} ${c($)} ${c(t-7.6)} ${c($)} Z`].join(" "),z=s>.45;return h`
    <ellipse cx=${t} cy=${c(i+1.6)} rx="10.5" ry="1.6" fill="#000" opacity="0.2" />
    <path fill=${G(e.chrome)} d=${[`M ${c(t-9.9)} ${c(i-.3)} Q ${t} ${c(i-1.3)} ${c(t+9.9)} ${c(i-.3)}`,`L ${c(t+9.9)} ${c(i+.6)} Q ${t} ${c(i+1.6)} ${c(t-9.9)} ${c(i+.6)} Z`].join(" ")} />
    <path fill=${G(e.knob)} d=${x} />
    ${m>.2?h`<rect x=${c(_)} y=${c(w)} width=${c(m)} height=${c(k-w-.3)} fill="#000"
          opacity="0.3" />`:v}
    <line x1=${c(t-7)} y1=${c($+.15)} x2=${c(t+7)} y2=${c($+.15)} stroke="#fff"
      stroke-width="0.3" opacity="0.25" />
    ${z?h`<g opacity=${c(s*.85)} fill="#f4f4f4">
          <rect x=${c(t-2.6*s-.45)} y=${c(i+2.75)} width="0.9" height="0.28" />
          <rect x=${c(t+2.6*s-.45)} y=${c(i+2.75)} width="0.9" height="0.28" />
          <rect x=${c(t+2.6*s-.14)} y=${c(i+2.44)} width="0.28" height="0.9" />
          ${r==="fan"?h`<circle cx=${c(t+l*1.2)} cy=${c(i+4)} r="0.7" fill="none" stroke="#f4f4f4"
                stroke-width="0.28" />`:h`<circle cx=${c(t+l*1.2)} cy=${c(i+4)} r="0.5" />`}
        </g>`:v}
  `}function Ac(e,t,n,r,o,i,a){if(o.light<=0)return h``;let s=c((.3+.6*o.light)*(a==="light"?.4:1));return h`
    <g opacity=${s} filter=${G(e.blurWide)}>
      ${n.map(l=>{let p=[[l-8,r-10],[l+8,r-10],[l+58,r+i],[l-58,r+i]];return h`<polygon points=${Y(p)} fill=${G(t.lightCone)} />`})}
    </g>
  `}function Tc(e,t,n,r,o,i,a,s,l){if(a<=0)return h``;let p=2+Math.round(ke(a,0,4)),u=r-n,f=c(4.4-.8*a),m=e.ids.id("vapor"),y=e.ids.id("vapor-clip"),g=e.ids.id("vapor-fade"),_=Array.from({length:p},($,w)=>{let k=n+u*(.14+.72*(w+.5)/p)+(w%2?4:-4),x=w%2?6:-6,z=[`M ${c(k-x*.3)} ${c(i+42)}`,`C ${c(k+x)} ${c(i+31)} ${c(k-x)} ${c(i+17)}`,`${c(k+x*.2)} ${c(i+4)}`].join(" "),R=l?`transform: translateY(${w%3*9-6}px)`:`animation: ${m} ${f}s linear infinite; animation-delay: ${c(-f*w/p)}s`;return h`<path d=${z} fill="none" stroke=${G(g)} stroke-width="8" stroke-linecap="round" style=${R} />`}),b=s==="dark"?"#ffffff":"#9aa3ad";return h`
    ${l?v:h`<style>${`@keyframes ${m}{0%{transform:translateY(40px);opacity:0}35%{opacity:1}75%{opacity:.7}100%{transform:translateY(-8px);opacity:0}}`}</style>`}
    <linearGradient id=${g} gradientUnits="userSpaceOnUse" x1="0" y1=${c(i+4)} x2="0" y2=${c(i+42)}>
      <stop offset="0" stop-color=${b} stop-opacity="0" />
      <stop offset="0.3" stop-color=${b} stop-opacity="1" />
      <stop offset="0.6" stop-color=${b} stop-opacity="0.75" />
      <stop offset="1" stop-color=${b} stop-opacity="0" />
    </linearGradient>
    <clipPath id=${y}>
      <rect x=${c(n-30)} y=${c(o)} width=${c(u+60)} height=${c(i-o+120)} />
    </clipPath>
    <g clip-path=${G(y)}>
      <g opacity=${s==="dark"?.15:.2} filter=${G(t.vapor)}>${_}</g>
    </g>
  `}function Mc(e,t,n,r,o=!0){let i="#ffeccc",a=e.ids.id("halo-fall"),s=e.ids.id("halo-clip"),l=r+En,p=l+At,u=vc(t,n,l,o);return h`
    <linearGradient id=${a} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color=${i} stop-opacity="0.6" />
      <stop offset="1" stop-color=${i} stop-opacity="0" />
    </linearGradient>
    <clipPath id=${s}><polygon points=${Y(u)} /></clipPath>
    <g clip-path=${G(s)}>
      <polygon points=${Y(u)} fill=${i} opacity="0.22" />
      <g filter=${G(e.blur)}>
        <line x1=${t} y1=${l+.6} x2=${n} y2=${l+.6} stroke=${i} stroke-width="3" />
        <line x1=${t} y1=${p-1.2} x2=${n} y2=${p-1.2} stroke=${i} stroke-width="2.4" />
      </g>
      <line x1=${t} y1=${l+.3} x2=${n} y2=${l+.3} stroke="#fffaf2" stroke-width="0.7" />
    </g>
    <rect x=${c(t+sr)} y=${p} width=${c(n-t-sr*2)} height="16"
      fill=${G(a)} filter=${G(e.blur)} />
  `}function Cc(e,t,n,r,o){let i=Math.min(150,n*.36),a=c((n-i)/2),s=c(r-o),l=c(r-o*.3);return h`
    <mask id=${t.fadeMask} maskUnits="userSpaceOnUse" x=${a-1} y=${s} width=${i+2} height=${o+1}>
      <rect x=${a-1} y=${s} width=${i+2} height=${o+1} fill=${G(t.fade)} />
    </mask>
    <g mask=${G(t.fadeMask)}>
      <g filter=${G(e.grain)}>
        <rect x=${a} y=${s} width=${c(i)} height=${o} fill=${G(e.metal)} />
      </g>
      <line x1=${a+.4} y1=${s} x2=${a+.4} y2=${r} stroke="#fff" stroke-width="0.8" opacity="0.45" />
      <line x1=${c(a+i-.4)} y1=${s} x2=${c(a+i-.4)} y2=${r} stroke="#000" stroke-width="0.8"
        opacity="0.2" />
      <line x1=${a+6} y1=${l} x2=${c(a+i-6)} y2=${l} stroke="#000" stroke-width="0.6"
        opacity="0.18" />
    </g>
    <line x1=${a} y1=${r-.4} x2=${c(a+i)} y2=${r-.4} stroke="#000" stroke-width="0.8" opacity="0.3" />
  `}var gc=Array.from({length:145},(e,t)=>t%8===7?.2:.62).join(" "),yc="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1";function Gc(e,t,n,r){return h`
    <filter id=${t.wood} x="-0.05" y="-0.05" width="1.1" height="1.1" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.9 0.004" numOctaves="2" seed="4" result="noise" />
      <feColorMatrix in="noise" type="matrix" values=${yc} result="lines" />
      <feTurbulence type="fractalNoise" baseFrequency="0.022 0.0026" numOctaves="1" seed="7" result="slow" />
      <feColorMatrix in="slow" type="matrix" values=${yc} result="field" />
      <feComponentTransfer in="field" result="rings">
        <feFuncR type="table" tableValues=${gc} />
        <feFuncG type="table" tableValues=${gc} />
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
    <linearGradient id=${e.ids.id("stain")} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#4b4d4f" />
      <stop offset="0.5" stop-color="#5c5e60" />
      <stop offset="1" stop-color="#46484a" />
    </linearGradient>
    <rect x="0" y="0" width=${n} height=${r} fill=${G(e.ids.id("stain"))}
      filter=${G(t.wood)} />
    <rect x="0" y="0" width=${n} height=${r} fill=${G(e.sheen)} />
    <line x1="0" y1="0.4" x2=${n} y2="0.4" stroke="#fff" stroke-width="0.6" opacity="0.2" />
    <rect x="0" y=${r-2} width=${n} height="2" fill="#000" opacity="0.3" />
  `}var Ec=90,ea=150,Oc=58,Io=10,Pc=e=>{let t=e.spec;if(t.family!=="hood")return null;let n=t.form==="island"||t.form==="insert"?t.form:"wall",r=ke(t.width??36,30,66)*10,o=e.state.hood,i={light:o?.light?ke(o.brightness/100,.05,1):0,lightColor:wc(o?.kelvin??null),halo:o?.halo??!1,fan:o?.fan??0},a=new Ve(e.uid),s=Po(a),l=bc(a),p=n==="insert"?8:0,u=n==="insert"?ea:an,f=n==="insert"?ea:an+ir+ar,m=f+En+At,y=n==="island"?-Ec:0,g=Ji(r-p*2).map(w=>w+p),_=[-Io,y-Io/2,r+Io*2,c(m-y+Io/2+Oc)].join(" "),b=(e.theme==="dark"?.5:.18)*(1-.8*i.light),$=rh(e.t,n,i,e.state.available);return A`<svg viewBox=${_} role="img" aria-label=${$}>
    ${h`
      <defs>
        ${Do(s,{finish:"stainless",knobs:e.appearance.knobs,x:0,y,width:r,height:m-y,light:Oo,parts:{knob:!0,wideBlur:i.light>0,offline:!e.state.available}})}
        ${kc(l,i,e.theme)}
        <radialGradient id=${s.ids.id("wall-shadow")}>
          <stop offset="0" stop-color="#000" stop-opacity=${b} />
          <stop offset="1" stop-color="#000" stop-opacity="0" />
        </radialGradient>
      </defs>
      ${n==="island"?v:h`<ellipse cx=${r/2} cy=${m+6} rx=${r*.52} ry="12"
            fill=${G(s.ids.id("wall-shadow"))} />`}
      <g filter=${e.state.available?v:G(s.offline)}>
        ${Ac(s,l,g,m,i,Oc,e.theme)}
        ${n==="island"?Cc(s,l,r,0,Ec):v}
        ${n==="insert"?Gc(s,l,r,ea):v}
        ${n==="insert"?v:h`
            <g filter=${G(s.grain)}>${xc(s,l,r,0)}${Sc(s,0,r,u)}</g>
            ${zc(r,0)}`}
        ${Rc(s,l,p,r-p,u,i,n!=="insert")}
        ${i.halo?Mc(s,p,r-p,f,n!=="insert"):v}
        ${e.state.available?Tc(s,l,p,r-p,f+En,m,i.fan,e.theme,e.reducedMotion??!1):v}
      </g>
    `}
  </svg>`};function rh(e,t,n,r){let o=[e(`drawing.hood.${t}`)];return n.fan>0&&o.push(e("drawing.fan_speed",{speed:n.fan})),n.light>0&&o.push(e("drawing.light_level",{percent:Math.round(n.light*100)})),n.halo&&o.push(e("drawing.halo_on")),r||o.push(e("drawing.offline")),We(e,o)}function lr(e,t,n,r,o,i,a,s=.5){return h`
    <rect x=${t} y=${n} width=${r} height=${o} fill=${e.url(i)} />
    <rect x=${t} y=${n} width=${r} height=${o} fill=${e.url(a)} />
    <rect x=${t} y=${n} width=${r} height=${o} fill=${e.url("grain")} />
    ${s?h`<line x1=${t} y1=${n+.35} x2=${t+r} y2=${n+.35} stroke="#fff" stroke-opacity=${s} stroke-width="0.7" />`:v}
  `}function Vo(e,t,n,r,o){let i=r-n,a=n+i*.38,s=Math.min(.85,i*.19);return h`
    <rect x="0" y=${n} width=${t} height=${i} fill=${e.url("ss-dim")} />
    <rect x="0" y=${n} width=${t} height=${i} fill=${e.url("reveal")} />
    ${o.map(l=>h`<g fill="none" stroke="#2a2b2c" stroke-width="0.3">
        <circle cx=${l} cy=${a} r="0.65" />
        <path d=${`M${l-s} ${a+1.1}l${2*s} ${2*s}m0 ${-2*s}l${-2*s} ${2*s}`} />
      </g>`)}
  `}function Dc(e,t,n){let r=e.width,o=e.floorY,i=o-e.levels.feet,a=An(n),s=o-3.5;return h`
    <ellipse cx=${r/2} cy=${o+.6} rx=${r/2+5} ry="4.8" fill="#000" opacity=${a} filter=${t.url("floor")} />
    <rect x="13" y=${i} width=${r-26} height=${s-i} fill=${t.url("ss-toe")} />
    <rect x="13" y=${i} width=${r-26} height=${s-i} fill=${t.url("lower")} />
    <rect x="13" y=${i} width=${r-26} height=${s-i} fill=${t.url("toe-shade")} />
    ${e.doors.map(l=>{let p=(l.x0+l.x1)/2,u=(l.x1-l.x0)*.17;return h`
        <rect x=${p-u} y=${i+.6} width=${2*u} height="1.2" rx="0.6" fill="#1d1e20" opacity="0.85" />
        <line x1=${p-u+.6} y1=${i+2.1} x2=${p+u-.6} y2=${i+2.1} stroke="#fff"
          stroke-opacity="0.35" stroke-width="0.4" />
      `})}
    ${e.feet.map(l=>{let u=l.taper==="right"?`${l.x0},${i} ${l.x1},${i} ${l.x1-8.5},${o} ${l.x0},${o}`:l.taper==="left"?`${l.x0},${i} ${l.x1},${i} ${l.x1},${o} ${l.x0+8.5},${o}`:`${l.x0},${i} ${l.x1},${i} ${l.x1},${o} ${l.x0},${o}`,f=l.x0+(l.taper==="left"?8.5:0)+.3,m=l.taper===null?.55:1;return h`
        <ellipse cx=${(l.x0+l.x1)/2} cy=${o+.2} rx=${(l.x1-l.x0)/2+3} ry="1.6" fill="#000"
          opacity=${Math.min(.85,a*1.5)} filter=${t.url("soft")} />
        <polygon points=${u} fill=${t.url("ss")} />
        <polygon points=${u} fill=${t.url("foot")} opacity=${m} />
        <polygon points=${u} fill=${t.url("grain")} />
        <line x1=${l.x0+.3} y1=${i} x2=${f} y2=${o} stroke="#fff" stroke-opacity="0.35" stroke-width="0.5" />
      `})}
  `}function Lc(e,t){let n=e.width,r=u=>e.floorY-u,{feet:o,plinth:i,drawer:a,doorBottom:s}=e.levels,l=e.doors.flatMap(u=>[u.x0+9.5,(u.x0+u.x1)/2,u.x1-9.5]),{doorTop:p}=e.levels;return h`
    <rect x="0" y=${r(p)} width=${n} height=${p-s} fill="#4b4c4e" />
    ${e.doors.slice(1).map((u,f)=>{let m=(e.doors[f].x1+u.x0)/2;return h`<line x1=${m} y1=${r(p)} x2=${m} y2=${r(s)} stroke="#b9bbbd" stroke-width="1.3" />`})}
    ${lr(t,0,r(i),n,i-o,"ss","shade-plinth",.55)}
    ${a===null?h`<rect x="0" y=${r(i)} width=${n} height=${i-o} fill=${t.url("lower")} />`:h`<rect x="0" y=${r(i)} width=${n} height=${i-o} fill="#fff" opacity="0.35" />`}
    <line x1="0" y1=${r(o)-.35} x2=${n} y2=${r(o)-.35} stroke="#fff" stroke-opacity="0.55" stroke-width="0.7" />
    <line x1="0" y1=${r(o)+.3} x2=${n} y2=${r(o)+.3} stroke="#000" stroke-opacity="0.25" stroke-width="0.6" />
    ${a===null?Vo(t,n,r(s),r(i),l):h`
          ${lr(t,0,r(a),n,a-i,"ss","shade-door",.6)}
          <rect x="0" y=${r(a)} width=${n} height=${a-i} fill=${t.url("lower")} />
          <line x1="0" y1=${r(i)-.3} x2=${n} y2=${r(i)-.3} stroke="#000" stroke-opacity="0.4" stroke-width="0.7" />
          ${Vo(t,n,r(s),r(a),l)}
        `}
  `}function Ic(e,t){let n=e.width,r=l=>e.floorY-l,{doorTop:o,bandBottom:i,railBottom:a,rim:s}=e.levels;return a===null?h`
      ${Vo(t,n,r(i),r(o),[])}
      ${lr(t,0,r(s),n,s-i,"ss-rail","shade-rail",0)}
      <line x1="0" y1=${r(i)-.35} x2=${n} y2=${r(i)-.35} stroke="#000" stroke-opacity="0.3" stroke-width="0.7" />
    `:h`
    ${Vo(t,n,r(i),r(o),[])}
    ${lr(t,0,r(a),n,a-i,"ss-panel","shade-panel",0)}
    <line x1="0" y1=${r(i)-.35} x2=${n} y2=${r(i)-.35} stroke="#fff" stroke-opacity="0.3" stroke-width="0.6" />
    ${lr(t,0,r(s),n,s-a,"ss-rail","shade-rail",0)}
    <line x1="0" y1=${r(a)+.3} x2=${n} y2=${r(a)+.3} stroke="#2e2f31" stroke-width="0.6" />
    <line x1="0" y1=${r(a)+1} x2=${n} y2=${r(a)+1} stroke="#000" stroke-opacity="0.18" stroke-width="1.2" />
  `}var oh={30:298.75,36:358.75,48:478.75,60:598.75},ih={feet:20,plinth:42,drawer:null,doorBottom:50,doorTop:272,bandBottom:279,railBottom:330,rim:350},ah={feet:24,plinth:44.5,drawer:92.5,doorBottom:97,doorTop:319,bandBottom:327,railBottom:null,rim:350},V={grateFront:26,grateBack:252,grateTop:358,grateBottom:354,wallBottom:351.6,burnerFront:92,burnerRear:187,trimFront:254,trimBack:266,trimTop:362.5,inductionTrim:49,glassBack:246,glassTop:351},Bc=302,sh={griddle:1,charbroiler:1,double_griddle:2,french_top:2},lh={griddle:1,charbroiler:1,double_griddle:2,french_top:1},Vc=2.3,Hc=47,Fc=3,cr=40.4,ta=51.4,Nc=16;function Tt(e){return 2160/(2160+e)}function pe(e,t,n,r){let o=Tt(r);return[e.cx+(t-e.cx)*o,e.floorY-(500+(n-500)*o)]}function ch(e){if(e.fuel==="induction")return[];let t=Math.ceil(Math.max(0,e.burners)/2),n=a=>{let s=Math.min(2,e.burners-a*2);return{kind:"burners",burners:s,units:1,knobs:s}},r=e.surfaces.map(a=>({kind:a,burners:0,units:sh[a]??1,knobs:lh[a]??1})),o=[],i=r.length?Math.max(0,t-1):t;for(let a=0;a<i;a++)o.push(n(a));return o.push(...r),r.length&&t>0&&o.push(n(t-1)),o}function dh(e,t){return e.width&&e.width>=24?e.width:e.fuel==="induction"?e.burners>=5?36:30:e.ovens.length>=2?t>=5?60:48:t>=3?36:30}function ph(e,t,n){if(!e.length)return[];let r=[...e],o=t<=30&&e.length===2&&e.every(u=>u.kind==="burners");o&&r.splice(1,0,{kind:"filler",burners:0,units:0,knobs:0});let i=t<=36?18:19.5,a=r.reduce((u,f)=>u+f.units,0)||1,s=(n-2*i-(r.length-1)*Vc-(o?Hc:0))/a,l=i,p=!0;return r.map(u=>{let f=u.kind==="filler"?Hc:s*u.units,m={kind:u.kind,x0:l,x1:l+f,burners:u.burners,knobs:u.knobs,small:u.kind==="burners"&&p&&u.burners===2};return u.kind==="burners"&&(p=!1),l+=f+Vc,m})}var jc={left:0,upper:1,single:1,lower:1,right:2};function uh(e,t,n){let r=e.ovens.length?[...e.ovens].sort((p,u)=>jc[p.position]-jc[u.position]):[{prefix:"cav",position:"single",width:null}],o=p=>r.length===1?t:r.length===2&&t<54?p===0?18:t-18:t/r.length,i=r.map((p,u)=>p.width&&p.width>0?p.width:o(u)),a=i.reduce((p,u)=>p+u,0),s=n-Fc*(r.length-1),l=0;return r.map((p,u)=>{let f=s*i[u]/a,m={x0:l,x1:l+f,slot:p};return l+=f+Fc,m})}function fh(e,t){let n=[{x0:13,x1:55.5,taper:"right"},{x0:t-55.5,x1:t-13,taper:"left"}];for(let r=1;r<e.length;r++){let o=(e[r-1].x1+e[r].x0)/2;n.push({x0:o-20,x1:o+20,taper:null})}return n}function hh(e,t,n,r){if(!e.length)return{knobs:[],panelX:null};let o=e.flatMap(z=>Array.from({length:z.knobs},(R,T)=>({kind:z.kind==="burners"?"burner":"surface",center:z.x0+(z.x1-z.x0)*(T+.5)/z.knobs}))),i=n/2;if(t.length>=2){let z=r?ta:cr/2,R=o.filter(P=>P.center<i-.5),T=o.filter(P=>P.center>=i-.5),S=P=>{if(!P)return[];let U=i-z,I=cr,L=40,H=U-I;return L+(P-1)*I>H&&(L=H-(P-1)*I),L<24&&(L=24,I=(U-24)/P),Array.from({length:P},(N,Z)=>L+Z*I)},C=S(R.length),M=S(T.length).map(P=>n-P).reverse();return{knobs:[...R.map((P,U)=>({x:C[U],kind:P.kind})),{x:i-z,kind:"oven",oven:t[0].slot.prefix},{x:i+z,kind:"oven",oven:t[t.length-1].slot.prefix},...T.map((P,U)=>({x:M[U],kind:P.kind}))],panelX:r?i:null}}let a=e[e.length-1],s=a.kind==="burners"?a.knobs:0,l=o.slice(0,o.length-s),p=o.slice(o.length-s),u=e.some(z=>z.kind!=="burners"&&z.kind!=="filler"),f=[],m=0;l.forEach((z,R)=>{R&&(m+=cr),f.push({x:m,kind:z.kind})});let y=null;r?(l.length&&(m+=u?65.2:ta),y=m,m+=ta):l.length&&(m+=cr),f.push({x:m,kind:"oven",oven:t[0]?.slot.prefix??"cav"}),p.forEach((z,R)=>{m+=R===0&&u&&r?54:cr,f.push({x:m,kind:z.kind})});let g=f.map(z=>z.x).concat(y===null?[]:[y]),_=Math.min(...g),b=Math.max(...g),$=(_+b)/2,w=b-_,k=w>n-54?(n-54)/w:1,x=z=>i+(z-$)*k;return{knobs:f.map(z=>({...z,x:x(z.x)})),panelX:y===null?null:x(y)}}function Kc(e){let t=e.fuel==="induction",n=ch(e),r=n.reduce((g,_)=>g+_.units,0),o=dh(e,r),i=oh[o]??o*10-1.25,a=e.fuel==="dual_fuel",s=ph(n,o,i),l=uh(e,o,i),{knobs:p,panelX:u}=hh(s,l,i,a),f=t?ah:ih,m=t?500+(V.glassTop-500)*Tt(V.glassBack):500+(V.trimTop-500)*Tt(V.trimBack),y=Math.ceil(m+6);return{nominal:o,width:i,cx:i/2,induction:t,transitional:e.style==="transitional"||t&&e.style!=="professional",touchscreen:a,levels:f,modules:s,knobs:p,panelX:u,doors:l,feet:fh(l,i),floorY:y,viewBox:{x:-Nc,y:0,w:i+2*Nc,h:y+12}}}var On=[[0,133],[.05,135],[.12,138],[.2,160],[.3,190],[.4,207],[.5,219],[.58,221],[.66,211],[.75,190],[.85,156],[.95,136],[1,133]],na=478.75,mh={saturation:.06,slope:.6,lift:.24};function Ee(e,t){return`opacity:${Math.round(e*100)/100}${t?"":";transition:opacity .6s ease"}`}function Ht(e){let t=Math.round(Math.min(255,Math.max(0,e)));return`rgb(${t},${t},${Math.max(0,t-1)})`}function gh(e){let t=Math.min(1,Math.max(0,e));for(let n=1;n<On.length;n++){let[r,o]=On[n];if(t<=r){let[i,a]=On[n-1];return a+(o-a)*(t-i)/(r-i)}}return On[On.length-1][1]}function ra(e,t){return gh(.5+(e-t/2)/na)}var pr=e=>Math.round(Math.min(1,Math.max(0,e))*1e3)/1e3;function ur(e,t,n,r){return h`<linearGradient id=${e.id(t)} gradientUnits="userSpaceOnUse"
    x1=${n/2-na/2} y1="0" x2=${n/2+na/2} y2="0">
    ${On.map(([o,i])=>{let[a,s]=r(i);return h`<stop offset=${o} stop-color=${a} stop-opacity=${s} />`})}
  </linearGradient>`}var sn=(e,t,n,r)=>ur(e,t,n,o=>[Ht(o+r),1]),Uc=(e,t,n,r)=>ur(e,t,n,o=>["#000",pr((1-o/221)*r)]);function dr(e,t,n,r,o=.4){return h`<linearGradient id=${e.id(t)} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color=${n>=0?"#fff":"#000"} stop-opacity=${Math.abs(n)} />
    <stop offset=${o} stop-color="#fff" stop-opacity="0" />
    <stop offset="1" stop-color=${r>=0?"#fff":"#000"} stop-opacity=${Math.abs(r)} />
  </linearGradient>`}function Wc(e,t,n){let r=Ne[n]??Ne.red;return h`<defs>
    ${sn(e,"ss",t,0)}
    ${sn(e,"ss-rail",t,18)}
    ${sn(e,"ss-panel",t,-10)}
    ${sn(e,"ss-cover",t,-4)}
    ${sn(e,"ss-deck",t,8)}
    ${sn(e,"ss-dim",t,-26)}
    ${sn(e,"ss-toe",t,-32)}
    ${Uc(e,"falloff",t,.78)}
    ${Uc(e,"falloff-knob",t,.1)}
    ${ur(e,"handle-shadow",t,o=>["#000",pr(1-132/o)])}
    ${ur(e,"lower",t,o=>o>=185?["#000",pr((o-205)/o)]:["#fff",pr((165-o)*.0013)])}
    ${ur(e,"glass-reflect",t,o=>["#fff",pr((o-133)*.00135)])}
    <linearGradient id=${e.id("lower-fade")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.3" stop-color="#000" />
      <stop offset="0.78" stop-color="#fff" />
    </linearGradient>
    <mask id=${e.id("lower-mask")} maskContentUnits="objectBoundingBox">
      <rect width="1" height="1" fill=${e.url("lower-fade")} />
    </mask>
    ${["l","r"].map(o=>h`<radialGradient id=${e.id(`corner-${o}`)} cx=${o==="l"?0:1} cy="0" r="1">
        <stop offset="0" stop-color="#000" stop-opacity="0.16" />
        <stop offset="0.5" stop-color="#000" stop-opacity="0.06" />
        <stop offset="1" stop-color="#000" stop-opacity="0" />
      </radialGradient>`)}
    ${dr(e,"shade-door",.05,0)}
    ${dr(e,"shade-panel",-.17,.05,.3)}
    ${dr(e,"shade-rail",.4,-.06,.35)}
    ${dr(e,"shade-plinth",.06,-.03,.5)}
    ${dr(e,"shade-open",-.16,-.3,.5)}

    <linearGradient id=${e.id("rise")} x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#fff" />
      <stop offset="1" stop-color="#000" />
    </linearGradient>
    <mask id=${e.id("rise-mask")} maskContentUnits="objectBoundingBox">
      <rect width="1" height="1" fill=${e.url("rise")} />
    </mask>

    ${go(e.id("tube"))}
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
    ${yo(e.id("knob"),r)}

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

    ${h`<linearGradient id=${e.id("foot")} x1="0" y1="0" x2="0" y2="1">
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
    ${Pt(e.id("offline"),mh)}
  </defs>`}var Pn="'Helvetica Neue', Helvetica, Arial, sans-serif",qe=11.6,ln=13.4;function yh(e,t,n,r,o,i,a){let s=Ne[r]??Ne.red,l=!!i?.on,p=qe*.58,u=qe*.44,f=k=>Math.sqrt(qe*qe-k*k)-.35,m=f(p),y=f(u),g=1.7,_=Math.sqrt(qe*qe-(g/2)**2),b=(i?.temp??"").replace(/[^0-9]/g,"")||"- - -",$=(k,x,z)=>{let R=O=>[t+k*Math.cos(O*Math.PI/180),n+k*Math.sin(O*Math.PI/180)],[T,S]=R(x),[C,M]=R(z);return`M${c(T)} ${c(S)}A${k} ${k} 0 0 1 ${c(C)} ${c(M)}`},w=t+u;return h`
    <g>
      <circle cx=${t+.2} cy=${n+.6} r=${ln+.2} fill="#000" opacity="0.06" filter=${e.url("soft")} />
      ${o==="oven"?h`<circle cx=${t} cy=${n} r=${ln+.8} fill="none" stroke="#fff4df" stroke-width="2"
              filter=${e.url("halo")} style=${Ee(l?.95:0,a)} />`:v}
      <circle cx=${t} cy=${n} r=${ln} fill="#6f7173" />
      <circle cx=${t} cy=${n} r=${ln-.4} fill=${e.url("bezel")} />
      <circle cx=${t} cy=${n} r=${ln-.95} fill=${e.url("bezel-in")} />
      <path d=${$(ln-.65,250,290)} fill="none" stroke="#fff" stroke-opacity="0.5" stroke-width="0.4" stroke-linecap="round" />
      <circle cx=${t} cy=${n} r=${qe+.45} fill="#1b1617" />
      <circle cx=${t} cy=${n} r=${qe} fill=${e.url("knob")} />
      <path d=${`M${c(t-_)} ${c(n+g/2)}A${qe} ${qe} 0 1 1 ${c(t+_)} ${c(n+g/2)}A${qe} ${qe} 0 0 0 ${c(t-_)} ${c(n+g/2)}Z`}
        fill=${s.rim} opacity=${s.rimOpacity} />
      <path d=${`M${c(t-p)} ${c(n-m)}Q${c(t-p-.9)} ${n} ${c(t-p)} ${c(n+m)}`}
        fill="none" stroke=${s.dark} stroke-width="0.6" stroke-opacity="0.85" />
      <path d=${`M${c(w-.4)} ${c(n-y)}Q${c(w+.5)} ${n} ${c(w-.4)} ${c(n+y)}L${c(w+1.3)} ${c(n+y-.5)}Q${c(w+2.2)} ${n} ${c(w+1.3)} ${c(n-y+.5)}Z`}
        fill=${s.edge} opacity="0.85" />
      <path d=${`M${c(w+1.7)} ${c(n-y+1)}Q${c(w+2.6)} ${n} ${c(w+1.7)} ${c(n+y-1)}`}
        fill="none" stroke=${s.light} stroke-width="0.7" stroke-opacity="0.45" />
      <ellipse cx=${t-4} cy=${n-5.6} rx="4.4" ry="2.1" transform=${`rotate(-30 ${t-4} ${n-5.6})`}
        fill="#fff" opacity=${s.sheen} filter=${e.url("halo")} />
      <circle cx=${t} cy=${n} r=${ln} fill=${e.url("falloff-knob")} />
      ${o==="oven"?h`<g style=${Ee(l?1:0,a)}>
              <rect x=${t-5.6} y=${n-8.6} width="11.2" height="4.6" rx="1" fill="#150607" opacity="0.92" />
              <text x=${t} y=${n-4.95} text-anchor="middle" font-family=${Pn} font-size="3.6" font-weight="700"
                letter-spacing="0.2" fill="#ff5a3c" filter=${e.url("halo")}>${b}</text>
              <text x=${t} y=${n-4.95} text-anchor="middle" font-family=${Pn} font-size="3.6" font-weight="700"
                letter-spacing="0.2" fill="#ff8a66">${b}</text>
            </g>`:v}
      <circle cx=${t} cy=${n-17} r="0.65" fill="#2d2e2f" />
      ${o==="oven"?v:h`<rect x=${t+12.3} y=${n+14.1} width="2.1" height="3.6" rx="0.45" fill="none" stroke="#5c5f62" stroke-width="0.32" />
              <circle cx=${t+13.35} cy=${n+15.05} r="0.42" fill="none" stroke="#55585b" stroke-width="0.25" />
              <circle cx=${t+13.35} cy=${n+16.75} r="0.45" fill="#484b4e" />`}
    </g>
  `}var _h=(e,t)=>{let n=e.toUpperCase();return n.length>t?`${n.slice(0,t-1)}\u2026`:n};function fr(e,t,n,r){let o=n.toUpperCase(),i=[...o].reduce((s,l)=>s+r.size*((l.codePointAt(0)??0)>=11904?1:.68)+r.spacing,0),a=i>r.max?r.max/i:1;return h`<text x=${e} y=${t} text-anchor=${r.anchor??"middle"} font-family=${Pn} font-size=${c(r.size*a)}
    font-weight=${r.weight??v} letter-spacing=${c(r.spacing*a)} fill=${r.fill}>${o}</text>`}function $h(e,t,n,r,o,i,a){let s=t.state;if(!s?.on)return h`
      ${fr(n,o+i*.56,a("drawing.screen.off"),{size:3,spacing:.3,max:r*.9,fill:"#6f777f"})}
      ${s?.remote_ready?qc(n,o+i*.3,"#9fb3c8"):v}
    `;let l=nt(s),p=!l&&!s.preheated&&s.progress!==null,u=l?a("drawing.screen.self_clean"):s.preheated?a("drawing.screen.preheated"):p?a("drawing.screen.preheating",{percent:Math.round((s.progress??0)*100)}):a("drawing.screen.heating"),f=[];s.probe&&f.push(bh(0,0)),s.remote_ready&&f.push(qc(0,0,"#ffffff")),l&&f.push(wh(0,0));let m=4.2,y=n-(f.length-1)*m/2,g=Math.min(r*.62,20);return h`
    <rect x=${n-r/2} y=${o+i*.31} width=${r} height=${i*.36} fill=${e.url("band")} opacity="0.62" />
    ${f.map((_,b)=>h`<g transform=${`translate(${c(y+b*m)} ${c(o+i*.24)})`}>${_}</g>`)}
    <text x=${n} y=${o+i*.43} text-anchor="middle" font-family=${Pn} font-size="2.9" font-weight="600"
      letter-spacing="0.25" fill="#ffffff">${_h(l?a("drawing.screen.clean"):s.mode??"",12)}</text>
    <text x=${n} y=${o+i*.63} text-anchor="middle" font-family=${Pn} font-size="5.4" font-weight="300"
      fill="#ffffff">${s.temp??""}</text>
    ${fr(n,o+i*.75,u,{size:1.85,spacing:.2,max:r*.9,fill:s.preheated?"#ff6b6b":"#c9ced3"})}
    ${p?h`<rect x=${n-g/2} y=${o+i*.79} width=${g} height="0.7" rx="0.35" fill="#30353b" />
            <rect x=${n-g/2} y=${o+i*.79} width=${c(g*Math.min(1,Math.max(0,s.progress??0)))}
              height="0.7" rx="0.35" fill="#e3343d" />`:v}
  `}function bh(e,t){return h`<g transform=${`translate(${e} ${t})`}>
    <line x1="-1.2" y1="1.2" x2="1" y2="-1" stroke="#ffffff" stroke-width="0.45" stroke-linecap="round" />
    <circle cx="-1.3" cy="1.3" r="0.6" fill="#ffffff" />
  </g>`}function qc(e,t,n){return h`<g transform=${`translate(${e} ${t})`} fill="none" stroke=${n} stroke-width="0.35" stroke-linecap="round">
    <path d="M-1.9 -0.4A2.7 2.7 0 0 1 1.9 -0.4" />
    <path d="M-1.15 0.35A1.6 1.6 0 0 1 1.15 0.35" />
    <circle cx="0" cy="1.1" r="0.35" fill=${n} stroke="none" />
  </g>`}function wh(e,t){return h`<g transform=${`translate(${e} ${t})`}>
    <path d="M-0.8 -0.2V-0.9A0.8 0.8 0 0 1 0.8 -0.9V-0.2" fill="none" stroke="#ffffff" stroke-width="0.35" />
    <rect x="-1.2" y="-0.3" width="2.4" height="1.8" rx="0.3" fill="#ffffff" />
  </g>`}function vh(e,t,n,r,o,i,a,s,l){let p=t.map(_=>({slot:_,state:n[_.slot.prefix]??null})),u=a/p.length,f=p.length>1?["timer1","light","light","timer2"]:["timer1","light","timer2"],m=_=>_==="light"?l("drawing.screen.light"):l("drawing.screen.timer",{n:_==="timer1"?1:2}),y=_=>!!(p.length>1?p[_-1]:p[0])?.state?.light,g={size:1.9,spacing:.2,max:a*.3,fill:"#8c949c"};return h`
    ${fr(o+a*.07,i+s*.15,l("drawing.screen.lock"),{...g,anchor:"start"})}
    ${fr(o+a*.93,i+s*.15,l("drawing.screen.settings"),{...g,anchor:"end"})}
    ${r?h`<circle cx=${o+a/2-5.2} cy=${i+s*.13-.55} r="1.05" fill="none" stroke="#ffffff" stroke-width="0.32" />
            <path d=${`M${o+a/2-5.2} ${i+s*.13-1.2}V${i+s*.13-.55}H${o+a/2-4.7}`}
              fill="none" stroke="#ffffff" stroke-width="0.28" />
            <text x=${o+a/2+.8} y=${i+s*.15} text-anchor="middle" font-family=${Pn} font-size="2.6"
              font-weight="600" fill="#ffffff">${r}</text>`:v}
    ${p.map((_,b)=>$h(e,_,o+u*(b+.5),u*.92,i,s,l))}
    ${f.map((_,b)=>{let $=o+a*(b+.5)/f.length,w=b===0&&!!r,k=w||_==="light"&&y(b);return h`
        ${fr($,i+s*.93,w?r??"":m(_),{size:1.8,spacing:.15,max:a/f.length*.9,fill:k?"#ffffff":"#8c949c"})}
        ${w?h`<rect x=${$-3.2} y=${i+s*.95} width="6.4" height="0.45" fill="#e3343d" />`:v}
      `})}
  `}function oa(e,t){return t?!0:Object.values(e).some(n=>!!n&&(n.on||n.probe||n.remote_ready))}function kh(e,t,n,r,o,i,a,s){let u=n-29.5,f=r-38.5/2,m=n+59/2,y=r+38.5/2,g=2.6,_=u+g,b=f+g,$=m-g,w=y-g,k=h`
    <path d=${`M${u} ${f}H${m}L${$} ${b}H${_}Z`} fill="#b4b5b6" />
    <path d=${`M${u} ${f}L${_} ${b}V${w}L${u} ${y}Z`} fill="#7e7f80" />
    <path d=${`M${m} ${f}V${y}L${$} ${w}V${b}Z`} fill="#87888a" />
    <path d=${`M${u} ${y}H${m}L${$} ${w}H${_}Z`} fill="#cfd0d1" />
    <rect x=${u} y=${f} width=${59} height=${38.5} fill="none" stroke="#f2f3f4" stroke-opacity="0.8" stroke-width="0.4" />
  `;if(!o)return h`
      ${k}
      <rect x=${_} y=${b} width=${$-_} height=${w-b} fill="#1c1d1e" />
      <rect x=${_+.8} y=${b+.8} width=${$-_-1.6} height=${w-b-1.6} fill=${t.url("ss-cover")} />
      <rect x=${_+.8} y=${b+.8} width=${$-_-1.6} height=${w-b-1.6} fill=${t.url("shade-door")} />
      <rect x=${_+.8} y=${b+.8} width=${$-_-1.6} height=${w-b-1.6} fill=${t.url("grain")} opacity="0.6" />
      <path transform=${`translate(${n} ${b+5.6}) scale(0.42)`} fill="#888b8e" opacity="0.85"
        d="M-0.9 -4.6a0.9 0.9 0 0 1 1.8 0V-0.7l2.3 0.5a1 1 0 0 1 0.8 1.1l-0.5 3.3a1.2 1.2 0 0 1-1.2 1H-1.1a1.2 1.2 0 0 1-1.1-0.7l-1.7-3.1a0.8 0.8 0 0 1 1.2-1l0.8 0.8Z" />
    `;let x=_+1.4,z=$-1.4,R=b+1.6,T=w+2.6,S=`M${x} ${R}H${z}L${z+1.8} ${T}H${x-1.8}Z`,C=t.id("screen-clip");return h`
    ${k}
    <rect x=${_} y=${b} width=${$-_} height=${w-b} fill="#08090a" />
    <ellipse cx=${n} cy=${T+2.6} rx=${(z-x)/2+2} ry="2.2" fill="#000" opacity="0.35" filter=${t.url("soft")} />
    <path d=${`M${x-1.8} ${T}H${z+1.8}L${z+1.6} ${T+1.2}H${x-1.6}Z`} fill="#c3c5c7" />
    <clipPath id=${C}><path d=${S} /></clipPath>
    <path d=${S} fill=${t.url("screen")} />
    <g clip-path=${`url(#${C})`}>
      ${vh(t,e.doors,i,a,x,R,z-x,T-R,s)}
      <path d=${S} fill=${t.url("sheen")} />
    </g>
    <path d=${S} fill="none" stroke="#3a3d41" stroke-width="0.35" />
  `}function Zc(e,t,n,r,o,i,a){let s=e.floorY-Bc;return h`
    ${e.panelX===null?v:kh(e,t,e.panelX,s,oa(r,o),r,o,a)}
    ${e.knobs.map(l=>yh(t,l.x,s,n,l.kind,l.oven?r[l.oven]??null:null,i))}
  `}function $e(e,t,n,r){let[o,i]=pe(e,t,n,r);return`${c(o)} ${c(i)}`}function Ft(e,t,n){return`M${t.map(([r,o])=>$e(e,r,n,o)).join("L")}Z`}function se(e,t,n,r){return[[e,n],[t,n],[t,r],[e,r]]}function zh(e,t,n){let r=t[0]-e[0],o=t[1]-e[1],i=Math.hypot(r,o)||1,a=-o/i*(n/2),s=r/i*(n/2);return[[e[0]+a,e[1]+s],[t[0]+a,t[1]+s],[t[0]-a,t[1]-s],[e[0]-a,e[1]-s]]}function Sh(e,t,n){let r="",o="",i="";for(let{plan:a,bottom:s}of t){let p=a.reduce((u,[f,m],y)=>{let[g,_]=a[(y+1)%a.length];return u+f*_-g*m},0)<0?[...a].reverse():a;o+=Ft(e,p,n),p.forEach(([u,f],m)=>{let[y,g]=p[(m+1)%p.length],_=g-f,b=-(y-u),$=e.cx-(u+y)/2,w=-2160-(f+g)/2;_*$+b*w<=0||(r+=`M${$e(e,u,s,f)}L${$e(e,y,s,g)}L${$e(e,y,n,g)}L${$e(e,u,n,f)}Z`,Math.abs(b)>Math.abs(_)*.5&&(i+=`M${$e(e,u,n,f)}L${$e(e,y,n,g)}`))})}return{sides:r,tops:o,edges:i}}var re=5,ze=4.4,hr=21,Rh=V.grateBottom,Ah=V.grateTop-3.2,aa=e=>e.map(t=>({plan:t,bottom:Rh})),sa=e=>e.map(t=>({plan:t,bottom:Ah})),la=(e,t,n)=>({plan:se(e,t,n,n+re),bottom:V.wallBottom});function Th(e){let t=e.x0+.6,n=e.x1-.6,r=V.grateFront,o=V.grateBack,i=(t+n)/2,a=(V.burnerFront+V.burnerRear)/2,s=[la(t,n,r),...aa([se(t,n,o-re,o),se(t,t+re,r,o),se(n-re,n,r,o)])],l=[],p=e.burners===1?[a]:[V.burnerFront,V.burnerRear];e.burners!==1&&l.push(se(t,n,a-ze/2,a+ze/2));let u=[r+re,...p.flatMap(f=>[f-hr,f+hr]),o-re];for(let f=0;f<u.length;f+=2){let m=u[f],y=u[f+1];y-m>2&&l.push(se(i-ze/2,i+ze/2,m,y))}for(let f of p){l.push(se(t+re,i-hr,f-ze/2,f+ze/2)),l.push(se(i+hr,n-re,f-ze/2,f+ze/2));let m=e.burners===1||f===p[0]?r+re:a+ze/2,y=e.burners===1?o-re:f===p[0]?a-ze/2:o-re;for(let g of[[t+re,m],[n-re,m],[t+re,y],[n-re,y]]){let _=i-g[0],b=f-g[1],$=Math.hypot(_,b),w=Math.max(.15,($-hr*1.3)/$);l.push(zh(g,[g[0]+_*w,g[1]+b*w],ze))}}return[...s,...sa(l)]}function Mh(e){let t=e.x0+.6,n=e.x1-.6,r=V.grateFront,o=V.grateBack,i=(n-t)/3;return[la(t,n,r),...aa([se(t,n,o-re,o),se(t,t+re,r,o),se(n-re,n,r,o)]),...sa([se(t+i-ze/2,t+i+ze/2,r,o),se(n-i-ze/2,n-i+ze/2,r,o),...[.22,.5,.78].map(a=>r+(o-r)*a).map(a=>se(t,n,a-ze/2,a+ze/2))])]}function Ch(e){let t=e.x0+.6,n=e.x1-.6,r=V.grateFront,o=V.grateBack,i=[la(t,n,r),...aa([se(t,n,o-re,o),se(t,t+re,r,o),se(n-re,n,r,o)])],a=[],s=Math.max(6,Math.round((n-t-2*re)/8.6)),l=(n-t-2*re)/s;for(let p=0;p<s-1;p++){let u=t+re+l*(p+1);a.push(se(u-1.9,u+1.9,r+re,o-re))}return[...i,...sa(a)]}function ia(e,t,n){let r=Sh(e,n,V.grateTop);return h`
    <path d=${r.sides} fill=${t.url("iron")} />
    <path d=${r.tops} fill="#3b3b3b" />
    <path d=${r.edges} fill="none" stroke="#5e5e5e" stroke-opacity="0.45" stroke-width="0.35" stroke-linecap="round" />
  `}function Ho(e,t,n,r,o){let[i]=pe(e,t,n,r),[,a]=pe(e,t,n,r-o),[,s]=pe(e,t,n,r+o);return{cx:i,cy:(a+s)/2,rx:o*Tt(r),ry:Math.max(.2,(a-s)/2)}}function Gh(e,t,n){let r=(n.x0+n.x1)/2,[,o]=pe(e,r,351.4,V.grateFront),i=[r-7.5,r+7.5].map(s=>pe(e,s,351.4,V.grateFront)[0]),a=n.kind!=="burners"?[]:n.burners===1?[{d:(V.burnerFront+V.burnerRear)/2,r:21.5}]:[{d:V.burnerFront,r:21.5},{d:V.burnerRear,r:n.small?16:21.5}];return h`
    ${i.map(s=>h`<line x1=${c(s-5.5)} y1=${c(o)} x2=${c(s+5.5)} y2=${c(o)} stroke="#fff" stroke-opacity="0.4"
        stroke-width="0.9" stroke-linecap="round" filter=${t.url("soft")} />`)}
    ${a.map(({d:s,r:l})=>{let p=Ho(e,r,354,s,l),u=Ho(e,r,355.6,s,l-2.4);return h`
        <ellipse cx=${c(p.cx)} cy=${c(p.cy)} rx=${c(p.rx)} ry=${c(p.ry+.5)} fill="#3e3e3e" />
        <ellipse cx=${c(p.cx)} cy=${c(p.cy-.25)} rx=${c(p.rx-.9)} ry=${c(p.ry+.2)} fill="#2c2c2c" />
        <ellipse cx=${c(u.cx)} cy=${c(u.cy)} rx=${c(u.rx)} ry=${c(u.ry+.4)} fill="#1f1f1f" />
      `})}
  `}function Yc(e,t,n,r,o){let i=t.x0+1,a=t.x1-1,s=V.grateFront+2,l=V.grateBack-1,p=e.levels.rim+.5,u=`M${$e(e,i,p,s)}L${$e(e,a,p,s)}L${$e(e,a,n,s)}L${$e(e,i,n,s)}Z`,[f,m]=pe(e,i,n,s),[y]=pe(e,a,n,s);return h`
    <path d=${Ft(e,se(i,a,s,l),n)} fill=${r} />
    ${o}
    <path d=${u} fill="#2b2c2d" />
    <line x1=${c(f)} y1=${c(m+.2)} x2=${c(y)} y2=${c(m+.2)} stroke="#c9cbcd" stroke-width="0.5" stroke-opacity="0.8" />
  `}function Eh(e,t,n){let r=(n.x0+n.x1)/2;switch(n.kind){case"griddle":case"double_griddle":return Yc(e,n,358.5,t.url("steel"),null);case"french_top":{let o=(V.grateFront+V.grateBack)/2,i=[26,50,76].map(s=>Ho(e,r,358,o,s)),a=Ho(e,r,358,o,1.6);return Yc(e,n,358,t.url("ftop"),h`${i.map(s=>h`<ellipse cx=${c(s.cx)} cy=${c(s.cy)} rx=${c(s.rx)} ry=${c(s.ry)} fill="none" stroke="#4a4c4f" stroke-opacity="0.32" stroke-width="0.45" />
              <ellipse cx=${c(s.cx)} cy=${c(s.cy+.4)} rx=${c(s.rx)} ry=${c(s.ry)} fill="none" stroke="#c8cacc" stroke-opacity="0.22" stroke-width="0.35" />`)}<ellipse cx=${c(a.cx)} cy=${c(a.cy)} rx=${c(a.rx)} ry=${c(a.ry+.3)} fill="#5a5c5f" />`)}case"charbroiler":{let[o,i]=pe(e,n.x0+6,e.levels.rim-1,V.grateFront+16),[a]=pe(e,n.x1-6,e.levels.rim-1,V.grateFront+16);return h`
        <line x1=${c(o)} y1=${c(i)} x2=${c(a)} y2=${c(i)} stroke="#a2a2a2" stroke-width="0.7" stroke-dasharray="0.9 2.6" stroke-opacity="0.7" />
        ${ia(e,t,Ch(n))}
      `}default:return h``}}function Oh(e,t){if(!e.modules.length)return h``;let n=e.modules[0].x0,r=e.modules[e.modules.length-1].x1,o=e.levels.rim-2.5,i=`M${$e(e,n,o,V.grateFront-3)}L${$e(e,r,o,V.grateFront-3)}L${$e(e,r,V.grateTop,V.grateBack+2)}L${$e(e,n,V.grateTop,V.grateBack+2)}Z`;return h`<path d=${i} fill=${t.url("pan")} />`}function Xc(e,t){let n=e.width,r=e.levels.rim,{trimFront:o,trimBack:i,trimTop:a}=V,s=`M${$e(e,0,r,o)}L${$e(e,n,r,o)}L${$e(e,n,a,o)}L${$e(e,0,a,o)}Z`,l=Ft(e,se(0,n,o,i),a),p=Ft(e,se(0,n,0,o),r),[u,f]=pe(e,8,a,(o+i)/2),[m]=pe(e,n-8,a,(o+i)/2),[y,g]=pe(e,0,a,i),[_]=pe(e,n,a,i),[b,$]=pe(e,0,a,o),[w]=pe(e,n,a,o),k=e.floorY-r;return h`
    <g>
      <path d=${s} fill=${t.url("ss")} />
      <path d=${l} fill=${t.url("ss-rail")} />
      <line x1=${c(u)} y1=${c(f)} x2=${c(m)} y2=${c(f)} stroke="#2a2b2c" stroke-opacity="0.35" stroke-width="0.7" stroke-dasharray="1 0.8" />
      <line x1=${c(y)} y1=${c(g)} x2=${c(_)} y2=${c(g)} stroke="#fff" stroke-opacity="0.7" stroke-width="0.5" />
      <line x1=${c(b)} y1=${c($)} x2=${c(w)} y2=${c($)} stroke="#fff" stroke-opacity="0.45" stroke-width="0.4" />
      <path d=${p} fill=${t.url("ss-deck")} />
      <path d=${p} fill=${t.url("grain")} opacity="0.5" />
      ${Oh(e,t)}
      ${e.modules.map(x=>x.kind==="burners"?h`${Gh(e,t,x)}${ia(e,t,Th(x))}`:x.kind==="filler"?ia(e,t,Mh(x)):Eh(e,t,x))}
      <line x1="0" y1=${k+.35} x2=${n} y2=${k+.35} stroke="#fff" stroke-opacity="0.85" stroke-width="0.8" />
    </g>
  `}var Ph=[[.054,.274,59,138],[.054,.274,147,227],[.347,.653,88,198],[.729,.949,59,138],[.729,.949,147,227]],Dh=[[.07,.42,59,150],[.13,.36,166,227],[.6,.9,59,138],[.6,.9,150,227]];function Qc(e,t,n,r){let o=e.width,i=e.levels.rim,a=Ft(e,se(0,o,0,V.inductionTrim),i),s=Ft(e,se(1.5,o-1.5,V.inductionTrim,V.glassBack),V.glassTop),l=(e.nominal>=36?Ph:Dh).map(([g,_,b,$])=>Ft(e,se(o*g,o*_,b,$),V.glassTop)),p=Ft(e,se(e.cx-48,e.cx+48,8,38),i+.2),[u,f]=pe(e,1.5,V.glassTop,V.inductionTrim),[m]=pe(e,o-1.5,V.glassTop,V.inductionTrim),y=e.floorY-i;return h`
    <g>
      <path d=${a} fill=${t.url("ss-deck")} />
      <path d=${a} fill=${t.url("grain")} opacity="0.5" />
      <path d=${s} fill=${t.url("ceramic")} />
      <path d=${l.join("")} fill="none" stroke="#8a8e92" stroke-opacity="0.22" stroke-width="0.35" />
      <line x1=${c(u)} y1=${c(f)} x2=${c(m)} y2=${c(f)} stroke="#000" stroke-opacity="0.6" stroke-width="0.6" />
      <line x1=${c(u)} y1=${c(f-.5)} x2=${c(m)} y2=${c(f-.5)} stroke="#fff" stroke-opacity="0.25" stroke-width="0.3" />
      <path d=${p} fill="#0b0c0e" />
      <path d=${p} fill="#fff1e0" style=${Ee(n?.35:0,r)} />
      <line x1="0" y1=${y+.35} x2=${o} y2=${y+.35} stroke="#fff" stroke-opacity="0.85" stroke-width="0.8" />
    </g>
  `}var Jc=45*Math.PI/180,ca=24,ed=18,pa=7.6,Lh={clean:1,preheated:.7,start:.25,span:.45,unknown:.5},Ih={clean:1,preheated:.6,start:.25,span:.45,unknown:.55};function nd(e){let t=nt(e);return{lit:e&&!t&&(e.light||e.door_open)?1:0,heat:rn(e,Lh),element:rn(e,Ih),probe:!!e&&!t&&e.probe,clean:t}}function Vh(e,t){let n=(t.x0+t.x1)/2,r=t.x1-t.x0-47,o=e.levels.doorBottom+15;return{x0:n-r/2,x1:n+r/2,floor:o,ceiling:o+175,front:12,back:215}}function rd(e,t,n,r,o,i,a,s){let l=Vh(e,n),p=(j,X,we)=>pe(e,j,X,we),u=(j,X,we,fe,et,wt)=>{let[de,Ie]=p(j,X,we),[Ue,$n]=p(fe,et,wt);return`M${c(de)} ${c(Ie)}L${c(Ue)} ${c($n)}`},f=(j,X,we,fe)=>q([j,X,we,fe]),m=f(p(l.x0,l.floor,l.back),p(l.x1,l.floor,l.back),p(l.x1,l.ceiling,l.back),p(l.x0,l.ceiling,l.back)),y=f(p(l.x0,l.floor,l.front),p(l.x1,l.floor,l.front),p(l.x1,l.floor,l.back),p(l.x0,l.floor,l.back)),g=f(p(l.x0,l.ceiling,l.front),p(l.x1,l.ceiling,l.front),p(l.x1,l.ceiling,l.back),p(l.x0,l.ceiling,l.back)),_=f(p(l.x0,l.floor,l.front),p(l.x0,l.floor,l.back),p(l.x0,l.ceiling,l.back),p(l.x0,l.ceiling,l.front)),b=f(p(l.x1,l.floor,l.front),p(l.x1,l.floor,l.back),p(l.x1,l.ceiling,l.back),p(l.x1,l.ceiling,l.front)),$=l.x1-l.x0,w=j=>l.floor+28*j-3,k=r.clean?[]:(s==="window"?[2,4]:[3,5]).map(w),x="",z="",R="",T="";for(let j of k){x+=u(l.x0+4,j,18,l.x1-4,j,18),z+=u(l.x0+4,j,200,l.x1-4,j,200),z+=u(l.x0+4,j,18,l.x0+4,j,200)+u(l.x1-4,j,18,l.x1-4,j,200),R+=u(l.x0+4,j,110,l.x1-4,j,110);let X=Math.round(($-8)/11);for(let we=1;we<X;we++){let fe=l.x0+4+($-8)*we/X;R+=u(fe,j,18,fe,j+.01,110),T+=u(fe,j,110,fe,j+.01,200)}}let S="";for(let j=1;j<=6;j++){let X=w(j)-2.5;S+=u(l.x0,X,24,l.x0,X,196)+u(l.x1,X,24,l.x1,X,196)}let C=s==="window"?l.ceiling-35:l.ceiling-9,M=[30,70,110,150],O="";M.forEach((j,X)=>{let[we,fe]=X%2?[l.x1-12,l.x0+12]:[l.x0+12,l.x1-12],[et,wt]=p(we,C,j),[de,Ie]=p(fe,C,j);O+=X?`L${c(et)} ${c(wt)}`:`M${c(et)} ${c(wt)}`,O+=`L${c(de)} ${c(Ie)}`;let Ue=M[X+1];if(Ue!==void 0){let $n=fe+(fe>we?8:-8),[wu,vu]=p($n,C,(j+Ue)/2),[ms,gs]=p(fe,C,Ue);O+=`Q${c(wu)} ${c(vu)} ${c(ms)} ${c(gs)}`,O+=`M${c(ms)} ${c(gs)}`}});let P=l.ceiling-26,U=[p(l.x0+1,P,140),p(l.x1-1,P,140)],I=Tt(140),L=[p(l.x0+$*.16,P-40,l.back),p(l.x1-$*.16,P-40,l.back)],H=$*.42*Tt(l.back),N=f(p(l.x0+$*.2,l.ceiling-40,l.back),p(l.x1-$*.2,l.ceiling-40,l.back),p(l.x1-$*.2,l.ceiling-8,l.back),p(l.x0+$*.2,l.ceiling-8,l.back)),Z=k.length?k[0]:l.floor+50,me=p(l.x0+2,l.floor+125,40),xe=p((l.x0+l.x1)/2-10,Z+12,105),ee=`M${c(me[0])} ${c(me[1])}C${c(me[0]+18)} ${c(me[1]+26)} ${c(xe[0]-30)} ${c(xe[1]-8)} ${c(xe[0])} ${c(xe[1])}`,[ae,Fe]=xe,ce=`M${c(ae)} ${c(Fe)}l5 2.4`,W=`M${c(ae+5)} ${c(Fe+2.4)}l4.2 5.6`;return h`
    <g clip-path=${`url(#${o})`}>
      <rect x=${i.x} y=${i.y} width=${i.w} height=${i.h} fill=${t.url("cavity")} />
      <g style=${Ee(r.lit,a)}>
        <path d=${m} fill=${t.url("porcelain")} />
        <path d=${y} fill="#111219" />
        <path d=${g} fill="#1e202c" />
        <path d=${_} fill="#171924" />
        <path d=${b} fill="#171924" />
        <path d=${N} fill="#1a1c27" stroke="#2a2d3d" stroke-width="0.5" />
        ${L.map(([j,X])=>h`<ellipse cx=${c(j)} cy=${c(X)} rx=${c(H)} ry=${c(H*.9)} fill=${t.url("pool")} />`)}
        <path d=${S} fill="none" stroke="#a39583" stroke-width="0.5" stroke-opacity="0.55" stroke-linecap="round" />
        ${U.map(([j,X])=>h`
            <ellipse cx=${c(j)} cy=${c(X)} rx=${c(30*I)} ry=${c(38*I)} fill=${t.url("pool")} />
            <ellipse cx=${c(j)} cy=${c(X)} rx=${c(12*I)} ry=${c(9*I)} fill=${t.url("lamp")} />`)}
      </g>
      <rect x=${i.x} y=${i.y} width=${i.w} height=${i.h} fill=${t.url(r.clean?"heat-clean":"heat")}
        style=${Ee(r.heat,a)} />
      <g style=${Ee(r.element,a)}>
        <path d=${O} fill="none" stroke="#ff7a2e" stroke-width="4" stroke-linecap="round" opacity="0.55"
          filter=${t.url("glow")} />
        <path d=${O} fill="none" stroke=${t.url("element")} stroke-width="1.5" stroke-linecap="round" />
        <path d=${O} fill="none" stroke="#ffe2b0" stroke-width="0.45" stroke-linecap="round" opacity="0.8" />
      </g>
      <g style=${Ee(r.lit,a)}>
        <path d=${T} fill="none" stroke="#c9b496" stroke-width="0.35" stroke-opacity="0.3" />
        <path d=${R} fill="none" stroke="#e6d3b2" stroke-width="0.4" stroke-opacity="0.55" />
        <path d=${z} fill="none" stroke="#d9c8ac" stroke-width="0.8" stroke-opacity="0.75" stroke-linecap="round" />
        <path d=${x} fill="none" stroke="#f8ead3" stroke-width="1.05" stroke-linecap="round" />
      </g>
      <path d=${x+z} fill="none" stroke="#ffa86a" stroke-width="1" stroke-linecap="round"
        style=${Ee(r.heat*.5,a)} />
      ${r.probe?h`<g fill="none" stroke-linecap="round" style=${Ee(Math.max(r.lit*.9,r.heat*.45),a)}>
              <path d=${ee} stroke="#c9c9c9" stroke-width="0.6" />
              <path d=${ce} stroke="#8e8e8e" stroke-width="1.9" />
              <path d=${ce} stroke="#d8d8d8" stroke-width="0.5" transform="translate(0 -0.4)" />
              <path d=${W} stroke="#e4e4e4" stroke-width="0.45" />
            </g>`:v}
    </g>
  `}function Fo(e,t,n,r){let o=n-t;if(e.transitional){let s=Math.min(41,o*.115);return{fx0:t+s,fy0:r+35,fx1:n-s,fy1:r+195,gx0:t+s+11,gy0:r+48,gx1:n-s-11,gy1:r+183}}let i=o<240?34:43,a=8.7;return{fx0:t+i,fy0:r+42.6,fx1:n-i,fy1:r+179,gx0:t+i+a,gy0:r+42.6+a,gx1:n-i-a,gy1:r+179-a}}function od(e,t,n,r,o,i=1,a=!1){let s=pa*i,l=12.5*i,p=19*i,u=r-p/2,f=a?0:3.6*i,m=p/2-1.2*i,y=C=>(C==="outer"?3.5:5.5)*i,[g,_]=o.map(y),b=[{fx:t+g,edge:t+g+.4,end:g,side:-1,sweep:0,fill:"post-end-l"},{fx:n-_-l,edge:n-_-.4,end:_,side:1,sweep:1,fill:"post-end"}],$=t+g+l/2,w=n-_-l/2,k={x:t+g+l,w:n-_-l-(t+g+l)},x=b.map(({edge:C,end:M,sweep:O})=>`M${c(C)} ${c(r-m)}A${c(M)} ${c(m)} 0 0 ${O} ${c(C)} ${c(r+m)}Z`),z=c(1.5*i),R=(C,M)=>h`<rect x=${c(C)} y=${c(u)} width=${c(l)} height=${c(p)} rx=${z} fill=${M} />`,T=(C,M)=>f?h`<rect x=${c(C+z/2)} y=${c(u-f+.3*i)} width=${c(l-z)} height=${c(f)} fill=${M} />`:v,S=(C,M,O,P)=>h`
    <rect x=${c(C)} y=${c(O+P*.12)} width=${c(M)} height=${c(P*.26)} fill=${e.url("tube-glint")} opacity="0.9" />
    <rect x=${c(C)} y=${c(O+P*.8)} width=${c(M)} height=${c(P*.13)} fill=${e.url("tube-glint")} opacity="0.55" />`;return h`
    <rect x=${c($)} y=${c(r-s)} width=${c(w-$)} height=${c(s*2)} fill=${e.url("tube")} />
    ${b.map(({fx:C,edge:M,end:O,side:P,fill:U},I)=>h`
        <path d=${x[I]} fill=${e.url(U)} />
        <line x1=${c(M+P*O*.45)} y1=${c(r-m+2.5*i)}
          x2=${c(M+P*O*.45)} y2=${c(r+m-2.5*i)}
          stroke="#fff" stroke-opacity="0.3" stroke-width=${c(.6*i)} stroke-linecap="round" />
        ${T(C,e.url("post-top"))}
        ${R(C,e.url("tube"))}
        ${R(C,e.url("tube-side"))}
        <rect x=${c(C)} y=${c(u)} width=${c(l)} height=${c(p)} rx=${z} fill="none"
          stroke="#6d6c6a" stroke-width="0.3" />
      `)}
    <g fill=${e.url("falloff")}>
      <rect x=${c(k.x)} y=${c(r-s)} width=${c(k.w)} height=${c(s*2)} />
      ${x.map(C=>h`<path d=${C} />`)}
      ${b.map(({fx:C})=>h`${R(C,e.url("falloff"))}${T(C,e.url("falloff"))}`)}
    </g>
    ${S(k.x,k.w,r-s,2*s)}
    ${b.map(({fx:C})=>S(C+1.5*i,l-3*i,u,p))}
  `}function id(e,t,n=1){let r=[t.x0<1?"outer":"inner",t.x1>e.width-1?"outer":"inner"],o=i=>(i==="outer"?.3:2)*n;return{x0:t.x0+o(r[0]),x1:t.x1-o(r[1]),ends:r}}function ad(e,t,n,r){return h`
    <rect x=${t} y=${r-4} width="3.2" height="8" fill="#9a9997" />
    <rect x=${n-3.2} y=${r-4} width="3.2" height="8" fill="#9a9997" />
    <rect x=${t+1.2} y=${r-4.2} width=${n-t-2.4} height="8.4" rx="2.2" fill=${e.url("tube")} />
    <rect x=${t+1.2} y=${r-4.2} width=${n-t-2.4} height="8.4" rx="2.2" fill=${e.url("falloff")} />
    <rect x=${t+1.2} y=${r-4.2} width=${n-t-2.4} height="8.4" rx="2.2" fill="none" stroke="#7c7b79" stroke-width="0.3" />
  `}function Hh(e,t){let n=a=>ra(a,e.width),r=n((t.fx0+t.fx1)/2),o=n(t.fx0+120),i=n(t.fx1-120);return h`
    <path d=${`M${t.fx0} ${t.fy0}H${t.fx1}L${t.gx1} ${t.gy0}H${t.gx0}Z`} fill=${Ht(r*.75+35)} />
    <path d=${`M${t.fx0} ${t.fy1}H${t.fx1}L${t.gx1} ${t.gy1}H${t.gx0}Z`} fill=${Ht(r*.75+50)} />
    <path d=${`M${t.fx0} ${t.fy0}L${t.gx0} ${t.gy0}V${t.gy1}L${t.fx0} ${t.fy1}Z`} fill=${Ht(o)} />
    <path d=${`M${t.fx1} ${t.fy0}L${t.gx1} ${t.gy0}V${t.gy1}L${t.fx1} ${t.fy1}Z`} fill=${Ht(i)} />
    <path d=${`M${t.fx0} ${t.fy0}H${t.fx1}V${t.fy1}H${t.fx0}Z`} fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="0.4" />
    <rect x=${t.gx0} y=${t.gy0} width=${t.gx1-t.gx0} height=${t.gy1-t.gy0} fill="none" stroke="#141414" stroke-width="0.7" />
  `}function Fh(e){return h`
    <path d=${`M${e.fx0} ${e.fy0}V${e.fy1}M${e.fx1} ${e.fy0}V${e.fy1}`} fill="none" stroke="#000"
      stroke-opacity="0.28" stroke-width="0.6" />
    <path d=${`M${e.fx0} ${e.fy0}H${e.fx1}`} fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="0.5" />
    <path d=${`M${e.fx0} ${e.fy1}H${e.fx1}`} fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="0.7" />
    <rect x=${e.gx0} y=${e.gy0} width=${e.gx1-e.gx0} height=${e.gy1-e.gy0} fill="none" stroke="#000"
      stroke-opacity="0.35" stroke-width="1.4" />
  `}function Nh(e,t,n,r,o,i){let a=t.id(`glass-${n.slot.prefix}`),s={x:r.gx0,y:r.gy0,w:r.gx1-r.gx0,h:r.gy1-r.gy0},l=Math.max(o.lit,o.heat)>0;return h`
    <clipPath id=${a}><rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} /></clipPath>
    <rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill=${t.url("glass")} />
    <g style=${Ee(l?1:0,i)}>
      ${rd(e,t,n,o,a,s,i,"window")}
      <rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill="#000" opacity=${o.lit?.16:.12} />
    </g>
    <rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill=${t.url("glass-reflect")}
      style=${Ee(l?.45:1,i)} />
    <rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill=${t.url("sheen")} />
  `}var da=60,td=45;function jh(e,t,n,r,o,i,a=!1){let s=r-t,l=o-n;return h`
    <rect x=${t} y=${n} width=${s} height=${l} fill=${e.url("ss")} />
    <rect x=${t} y=${n} width=${s} height=${l} fill=${e.url("shade-door")} />
    <rect x=${t} y=${n} width=${s} height=${l} fill=${e.url("lower")} mask=${a?v:e.url("lower-mask")} />
    ${i?.left?h`<rect x=${t} y=${i.top} width=${da} height=${td} fill=${e.url("corner-l")} />`:v}
    ${i?.right?h`<rect x=${r-da} y=${i.top} width=${da} height=${td} fill=${e.url("corner-r")} />`:v}
    <rect x=${t} y=${n} width=${s} height=${l} fill=${e.url("grain")} />
    <line x1=${t+.5} y1=${n+.45} x2=${r-.5} y2=${n+.45} stroke="#fff" stroke-opacity="0.55" stroke-width="0.8" />
    <line x1=${t+.3} y1=${n+1} x2=${t+.3} y2=${o-.5} stroke="#fff" stroke-opacity="0.3" stroke-width="0.5" />
    <line x1=${r-.3} y1=${n+1} x2=${r-.3} y2=${o-.5} stroke="#000" stroke-opacity="0.22" stroke-width="0.6" />
    <line x1=${t+.5} y1=${o-.4} x2=${r-.5} y2=${o-.4} stroke="#000" stroke-opacity="0.3" stroke-width="0.8" />
  `}var sd=16,ld=19.4;function cd(e,t,n,r,o){let i=e.floorY-e.levels.doorTop,a=e.floorY-e.levels.doorBottom,s=Fo(e,n.x0,n.x1,i),l=nd(r),p=Math.min(39,(n.x1-n.x0)*.11),u=i+(e.transitional?ld:sd),f=id(e,n),m=e.transitional?null:{left:f.ends[0]==="outer",right:f.ends[1]==="outer",top:u+pa};return h`
    <g>
      ${jh(t,n.x0,i,n.x1,a,m,e.transitional)}
      ${Nh(e,t,n,s,l,o)}
      ${e.transitional?Fh(s):Hh(e,s)}
      <rect x=${s.gx0-1} y=${s.gy0-1} width=${s.gx1-s.gx0+2} height=${s.gy1-s.gy0+2}
        fill="none" stroke="#ff9a4a" stroke-width="2" filter=${t.url("halo")} style=${Ee(l.heat*.25,o)} />
      ${e.transitional?h`
            <rect x=${n.x0+p-2} y=${u-13.2} width=${n.x1-n.x0-2*p+4} height="9"
              fill=${t.url("handle-shadow")} mask=${t.url("rise-mask")} filter=${t.url("softer")} />
            ${ad(t,n.x0+p,n.x1-p,u)}`:h`
            <rect x=${n.x0} y=${i+1} width=${n.x1-n.x0} height=${u-pa-i-1}
              fill=${t.url("handle-shadow")} mask=${t.url("rise-mask")} />
            ${od(t,f.x0,f.x1,u,f.ends)}`}
    </g>
  `}function dd(e,t,n,r,o){let{doorBottom:i,doorTop:a}=e.levels,s=a-i,l=e.floorY-a,p=e.floorY-i,{x0:u,x1:f}=n,m={...nd(r),lit:1},y=Math.cos(Jc),g=Math.sin(Jc),_=(ee,ae,Fe=0)=>{let[,ce]=pe(e,ee,i+ae*y-Fe*g,-ae*g-Fe*y);return[ee,ce]},{ox0:b,ox1:$,oy0:w,oy1:k}=ua(e,n),x=t.id(`opening-${n.slot.prefix}`),z={x:b,y:w,w:$-b,h:k-w},R=Math.max(3,Math.round(($-b)/34)),T=Array.from({length:R},(ee,ae)=>b+10+($-b-20)*(ae+.5)/R),S=(ee,ae,Fe,ce,W=0)=>q([_(ee,ae,W),_(Fe,ae,W),_(Fe,ce,W),_(ee,ce,W)]),C=S(u,0,f,s),M=Fo(e,u,f,0),O=ee=>s-ee,P=S(M.gx0,O(M.gy1),M.gx1,O(M.gy0)),U=e.transitional?[]:[q([_(M.fx0,O(M.fy0)),_(M.fx1,O(M.fy0)),_(M.gx1,O(M.gy0)),_(M.gx0,O(M.gy0))]),q([_(M.fx0,O(M.fy1)),_(M.fx1,O(M.fy1)),_(M.gx1,O(M.gy1)),_(M.gx0,O(M.gy1))]),q([_(M.fx0,O(M.fy0)),_(M.gx0,O(M.gy0)),_(M.gx0,O(M.gy1)),_(M.fx0,O(M.fy1))]),q([_(M.fx1,O(M.fy0)),_(M.gx1,O(M.gy0)),_(M.gx1,O(M.gy1)),_(M.fx1,O(M.fy1))])],I=q([_(u,s),_(f,s),_(f,s,-ca),_(u,s,-ca)]),[,L]=_(u,s,-ca*.5),H=s-(e.transitional?ld:sd),[,N]=_(u,H,ed),Z=Tt(-H*g-ed*y),me=id(e,n,Z),xe=ra((u+f)/2,e.width);return h`
    <g>
      <rect x=${u} y=${l} width=${f-u} height=${p-l} fill=${t.url("ss-dim")} />
      <rect x=${u} y=${l} width=${f-u} height=${p-l} fill=${t.url("grain")} />
      ${T.map(ee=>h`<g fill="#202122">
          <rect x=${ee-5} y=${l+3.6} width="10" height="0.9" rx="0.45" />
          <rect x=${ee-5} y=${l+6} width="10" height="0.9" rx="0.45" />
          <rect x=${ee-5} y=${l+8.4} width="10" height="0.9" rx="0.45" />
        </g>`)}
      <circle cx=${b+3} cy=${l+6.4} r="1.3" fill="#2a2b2c" />
      <circle cx=${$-3} cy=${l+6.4} r="1.3" fill="#2a2b2c" />
      <clipPath id=${x}><rect x=${z.x} y=${z.y} width=${z.w} height=${z.h} rx="5" /></clipPath>
      ${rd(e,t,n,m,x,z,o,"open")}
      <rect x=${z.x} y=${z.y} width=${z.w} height=${z.h} rx="5" fill="none" stroke="#5a5650" stroke-width="2.2" />

      <path d=${C} fill=${t.url("ss")} />
      <path d=${C} fill=${t.url("shade-open")} />
      <path d=${C} fill=${t.url("grain")} />
      <path d=${P} fill=${t.url("glass")} />
      ${U.map((ee,ae)=>h`<path d=${ee} fill=${Ht(xe*.72+[30,45,40,34][ae])} />`)}
      <path d=${P} fill="none" stroke="#141414" stroke-width="0.6" />
      <path d=${I} fill=${Ht(xe*.75+46)} />
      <line x1=${u+12} y1=${c(L)} x2=${f-12} y2=${c(L)} stroke="#2a2b2c" stroke-opacity="0.4" stroke-width="0.8" />
      <path d=${I} fill="none" stroke="#fff" stroke-opacity="0.4" stroke-width="0.4" />
      ${e.transitional?ad(t,u+39,f-39,N):od(t,me.x0,me.x1,N,me.ends,Z,!0)}
    </g>
  `}function ua(e,t){let n=e.floorY-e.levels.doorTop,r=e.floorY-e.levels.doorBottom;return{ox0:t.x0+16,ox1:t.x1-16,oy0:n+14,oy1:r-8}}var pd=e=>{if(e.spec.family!=="range")return null;let t=e.spec,n=Kc(t),r=new Ve(e.uid),o=e.state.ovens??{},i=e.state.display??null,a=!!e.reducedMotion,s=n.viewBox;return A`<svg
    viewBox="${s.x} ${s.y} ${s.w} ${s.h}"
    role="img"
    aria-label=${Kh(e.t,n,e.state)}
  >
    ${Wc(r,n.width,e.appearance.knobs)}
    <g filter=${e.state.available?v:r.url("offline")}>
      ${Dc(n,r,e.theme)} ${Lc(n,r)}
      ${n.induction?Qc(n,r,oa(o,i),a):Xc(n,r)}
      ${Ic(n,r)}
      ${n.doors.map(l=>o[l.slot.prefix]?.door_open?v:cd(n,r,l,o[l.slot.prefix]??null,a))}
      ${Zc(n,r,e.appearance.knobs,o,i,a,e.t)}
      ${n.doors.map(l=>o[l.slot.prefix]?.door_open?dd(n,r,l,o[l.slot.prefix]??null,a):v)}
    </g>
    ${e.state.available?Bh(n,r,o,gt(s.h,e.pixelHeight),a):v}
  </svg>`};function Bh(e,t,n,r,o){let i={shadow:t.url("pill-shadow")};return e.doors.map(a=>{let s=n[a.slot.prefix]??null,l=Mo(s);if(!l)return v;let p;if(s?.door_open){let{ox0:u,ox1:f,oy0:m,oy1:y}=ua(e,a);p={x0:u,y0:m,x1:f,y1:y}}else{let u=Fo(e,a.x0,a.x1,e.floorY-e.levels.doorTop);p={x0:u.gx0,y0:u.gy0,x1:u.gx1,y1:u.gy1}}return To(i,p,l,r,o)})}function Kh(e,t,n){let r=t.doors.map(o=>({position:o.slot.position,state:n.ovens?.[o.slot.prefix]}));return We(e,[e(t.induction?"drawing.range_induction":"drawing.range"),n.available?null:e("drawing.offline"),...on(e,r,n.display)])}var fa=10;function d(e){return Math.round(e*10)/10}function Ze(e,t){return e.d/(e.d-t)}function Ye(e,t,n,r){let o=Ze(e,r);return[e.cx+(t-e.cx)*o,e.cy+(n-e.cy)*o]}function Nt(e,t,n){let[r,o]=Ye(e,t.x,t.y,n),i=Ze(e,n);return{x:r,y:o,w:t.w*i,h:t.h*i}}function B(e){return q(e,d)}function rt(e){let t=e*2654435761>>>0||1;return()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296)}var Uh=new Set(["undercounter_refrigerator","undercounter_beverage","undercounter_wine","undercounter_drawers","ice_maker"]),Wh={side_by_side:48,french_door:36,over_under:30,column_refrigerator:30,column_freezer:24,column_wine:24,tall_refrigerator:30,tall_freezer:30,tall_over_under:36,wine_over_drawers:30,undercounter_refrigerator:24,undercounter_beverage:24,undercounter_wine:24,undercounter_drawers:30,ice_maker:15},No=2.5,ud=3.5;function qh(e){let t=e.form,n=t==="side_by_side"||t==="french_door"||t==="over_under",r=t==="column_refrigerator"||t==="column_freezer"||t==="column_wine";return e.line==="pro"?n?"pro":"classic":e.line==="classic"||e.line==="built_in"?n||r?"classic":"designer":e.line==="designer"||e.line==="integrated"?"designer":n?"classic":"designer"}function Zh(e,t,n,r){return t?{top:"flush",grille:null,band:null,x0:0,x1:n,y0:0,y1:306,kick:{x:0,y:306,w:n,h:r-306},frame:0}:e==="classic"?{top:"louvers",grille:{x:0,y:0,w:n,h:81},band:{x:0,y:81,w:n,h:6.5},x0:0,x1:n,y0:87.5,y1:806,kick:{x:0,y:806,w:n,h:34},frame:0}:e==="pro"?{top:"slots",grille:{x:0,y:0,w:n,h:108},band:{x:0,y:108,w:n,h:3},x0:12,x1:n-12,y0:111,y1:798,kick:{x:0,y:800,w:n,h:40},frame:12}:{top:"flush",grille:null,band:null,x0:0,x1:n,y0:0,y1:805,kick:{x:0,y:805,w:n,h:35},frame:0}}function Dn(e,t,n){let r=[],o=e;for(let i of n)r.push([o,o+i]),o+=i+No;return r.push([o,t]),r}var Yh={classic:[32,45,55],pro:[36,42,45],column:[34,80,92],over_drawers:[34,81,47],undercounter:[33.5,36,44]};function cn(e,t){let[n,r,o]=Yh[t];return{x:e.x+n,y:e.y+r,w:e.w-2*n,h:e.h-r-o}}function fd(e,t){let n=t?9:10;return{x:e.x+n,y:e.y+(t?9:12),w:e.w-2*n,h:e.h-(t?18:22)}}function ma(e,t){let n=t.split!==null?22:0,r=(e[1]-e[0]-6-n)/t.count,o=Array.from({length:t.count},(a,s)=>e[0]+6+(t.split!==null&&s>=t.split?n:0)+(s+1)*r-16),i=t.split!==null?o[t.split-1]+17:null;return{pitch:r,bars:o,divider:i===null?null:{y:i,h:n-2}}}function ha(e,t){let n=e.x+e.w/2,{divider:r}=ma([e.y,e.y+e.h],t);return[{zone:"wine",top:e.y+4,x:n},...r?[{zone:"wine2",top:r.y+r.h,x:n}]:[]]}function hd(e){let t=qh(e),n=e.form,r=Uh.has(n),o=n==="over_under"&&t==="pro"?36:Wh[n],i=Math.min(Math.max(e.width??o,12),72)*fa,a=(r?33:84)*fa,s=Zh(t,r,i,a),l=e.zones>=2,p=[],u=0,f=b=>{let $={window:null,dispenser:!1,ice:!1,racks:null,zones:[],...b,cavity:b.cavity??fd(b.rect,r),cavityId:u++};return p.push($),$},m=(b,$,w,k)=>({x:b,y:w,w:$-b,h:k-w}),y=t==="pro"?"pro":t==="classic"?"classic":"column",g=(b,$,w,k)=>{b.forEach(([x,z],R)=>{let[T,S,C]=k[Math.min(R,k.length-1)];f({kind:"drawer",rect:m($,w,x,z),hinge:"left",handle:"top",contents:T,keys:S,zones:C?[{zone:C}]:[],ice:e.ice&&T==="freezer"&&R===k.findIndex(([M])=>M==="freezer"),name:T==="freezer"?"freezer_drawer":"refrigerator_drawer"})})};switch(n){case"side_by_side":{let b=t==="pro"?s.x0+184:Math.round(i*.398),$=t==="pro"?534:s.y1,w=f({kind:"door",rect:m(s.x0,b-ud/2,s.y0,$),hinge:"left",handle:"edge",contents:"freezer",keys:["frz_door_ajar"],zones:[{zone:"frz",at:t==="pro"?.2:.15}],dispenser:e.dispenser==="external",ice:e.ice,name:"freezer_door"}),k=m(b+ud/2,s.x1,s.y0,$),x=e.glass?cn(k,y):null;if(f({kind:"door",rect:k,hinge:"right",handle:"edge",window:x,contents:e.glass?"food":"fridge",keys:["ref_door_ajar"],zones:[{zone:"ref",at:t==="pro"?.2:.15,x:x?x.x+x.w/2:void 0},...e.glass?[]:[{zone:"crisp",openOnly:!0}]],name:"refrigerator_door"}),t==="pro"){let z=Dn($+No+.5,s.y1,[143]);g(z,w.rect.x,w.rect.x+w.rect.w,[["freezer",[],null]]),g(z,k.x,k.x+k.w,[["fridge",[],null]])}break}case"french_door":{let[[b,$],[w,k]]=Dn(s.y0,s.y1,[t==="designer"?544:515]),x=fd(m(s.x0,s.x1,b,$),r),z=m(s.x0,i/2-No/2,b,$),R=m(i/2+No/2,s.x1,b,$),T=u;for(let[S,C]of[[z,"left"],[R,"right"]]){let M=f({kind:"door",rect:S,hinge:C,handle:"edge",window:e.glass?cn(S,y):null,contents:e.glass?"food":"fridge",cavity:x,keys:["ref_door_ajar"],zones:C==="left"?[{zone:"ref",at:.15},{zone:"crisp",openOnly:!0}]:[],dispenser:C==="left"&&e.dispenser==="external",name:"refrigerator_door"});M.cavityId=T}u=T+1,f({kind:"drawer",rect:m(s.x0,s.x1,w,k),hinge:"left",handle:"top",contents:"freezer",keys:["frz_door_ajar"],zones:[{zone:"frz"}],ice:e.ice,name:"freezer_drawer"});break}case"over_under":{if(t==="pro"){let[[z,R],...T]=Dn(s.y0,s.y1,[423,143]),S=m(s.x0,s.x1,z,R);f({kind:"door",rect:S,hinge:"right",handle:"edge",window:e.glass?cn(S,"pro"):null,contents:e.glass?"food":"fridge",keys:["ref_door_ajar"],zones:[{zone:"ref",at:.18}],name:"refrigerator_door"}),g(T,s.x0,s.x1,[["freezer",["frz_door_ajar"],"frz"],["freezer",[],null]]);break}let[[b,$],[w,k]]=Dn(s.y0,s.y1,[t==="designer"?544:515]),x=m(s.x0,s.x1,b,$);f({kind:"door",rect:x,hinge:"right",handle:"edge",window:e.glass?cn(x,y):null,contents:e.glass?"food":"fridge",keys:["ref_door_ajar"],zones:[{zone:"ref",at:.16},...e.glass?[]:[{zone:"crisp",openOnly:!0}]],name:"refrigerator_door"}),f({kind:"drawer",rect:m(s.x0,s.x1,w,k),hinge:"left",handle:"top",contents:"freezer",keys:["frz_door_ajar"],zones:[{zone:"frz"}],ice:e.ice,name:"freezer_drawer"});break}case"column_refrigerator":case"column_freezer":case"column_wine":{let b=m(s.x0,s.x1,s.y0,s.y1),$=n==="column_wine",w=n==="column_freezer",k=$||e.glass&&!w,x=k?cn(b,t==="classic"?"classic":"column"):null,z=Math.max(6,Math.round((x?.h??600)/46)),R=l?Math.round(z*.36):null,T=$?ha(x,{count:z,split:R}):[{zone:w?"frz":"ref",at:.13,x:x?x.x+x.w/2:void 0}];f({kind:"door",rect:b,hinge:n==="column_refrigerator"?"right":"left",handle:"edge",window:x,contents:$?"wine":w?"freezer":k?"food":"fridge",keys:$?["wine_door_ajar","wine2_door_ajar"]:w?["frz_door_ajar"]:["ref_door_ajar"],zones:[...T,...!$&&!w&&!k?[{zone:"crisp",openOnly:!0}]:[]],ice:w&&e.ice,racks:$?{count:z,split:R}:null,name:$?"wine_door":w?"freezer_door":"refrigerator_door"});break}case"tall_refrigerator":case"tall_freezer":case"tall_over_under":case"wine_over_drawers":{let[[b,$],...w]=Dn(s.y0,s.y1,[499,133.5]),k=m(s.x0,s.x1,b,$),x=n==="wine_over_drawers",z=x||e.glass&&n!=="tall_freezer"?cn(k,"over_drawers"):null,R=8,T=x&&l?6:null;f({kind:"door",rect:k,hinge:"left",handle:"edge",window:z,contents:x?"wine":n==="tall_freezer"?"freezer":z?"food":"fridge",keys:x?["wine_door_ajar","wine2_door_ajar"]:[n==="tall_freezer"?"frz_door_ajar":"ref_door_ajar"],zones:x?ha(z,{count:R,split:T}):[{zone:n==="tall_freezer"?"frz":"ref",at:.2,x:z?z.x+z.w/2:void 0}],ice:n==="tall_freezer"&&e.ice,racks:x?{count:R,split:T}:null,name:x?"wine_door":n==="tall_freezer"?"freezer_door":"refrigerator_door"});let M=n==="tall_refrigerator"?[["fridge",["ref2_door_ajar"],"ref2"],["fridge",[],null]]:n==="tall_freezer"?[["freezer",[],null]]:n==="tall_over_under"?[["freezer",["frz_door_ajar"],"frz"],["freezer",[],null]]:e.drawers==="refrigerator"?[["fridge",["ref_door_ajar"],"ref"],["fridge",["ref2_door_ajar"],"ref2"]]:e.drawers==="freezer"?[["freezer",["frz_door_ajar"],"frz"],["freezer",[],null]]:[["fridge",["ref_door_ajar"],"ref"],["freezer",["frz_door_ajar"],"frz"]];g(w,s.x0,s.x1,M);break}case"undercounter_refrigerator":case"undercounter_beverage":case"undercounter_wine":case"ice_maker":{let b=m(s.x0,s.x1,s.y0,s.y1),$=n==="undercounter_wine",w=n==="undercounter_beverage",k=$||(w||n==="undercounter_refrigerator")&&e.glass,x=k?cn(b,"undercounter"):null,z=$&&l?2:null,R=x?x.x+x.w/2:void 0;f({kind:"door",rect:b,hinge:$||w?"left":"right",handle:"edge",window:x,contents:$?"wine":w?"beverage":n==="ice_maker"?"ice":k?"food":"fridge",keys:$?["wine_door_ajar","wine2_door_ajar"]:w?["ref_door_ajar","wine_door_ajar"]:n==="ice_maker"?["ice_door_ajar"]:["ref_door_ajar"],zones:$?ha(x,{count:6,split:z}):n==="ice_maker"?[]:[x?{zone:"ref",top:x.y+4,x:R}:{zone:"ref",at:.2}],racks:$?{count:6,split:z}:null,name:n==="ice_maker"?"ice_maker_door":$?"wine_door":"door"});break}case"undercounter_drawers":{let b=Dn(s.y0,s.y1,[134]),$=e.drawers==="freezer"?[["freezer",["frz_door_ajar"],"frz"],["freezer",[],null]]:e.drawers==="combination"?[["fridge",["ref_door_ajar"],"ref"],["freezer",["frz_door_ajar"],"frz"]]:[["fridge",["ref_door_ajar"],"ref"],["fridge",["ref2_door_ajar"],"ref2"]];g(b,s.x0,s.x1,$);break}}let _=n==="undercounter_drawers"&&e.drawers==="freezer"?"freezer_drawers":n==="undercounter_drawers"&&e.drawers==="combination"?"combination_drawers":n;return{w:i,h:a,line:t,undercounter:r,top:s.top,grille:s.grille,band:s.band,span:{y0:s.y0,y1:s.y1},kick:s.kick,frame:s.frame,fronts:p,depth:r?200:225,internalDispenser:e.dispenser==="internal",name:_}}var Xh={back:"#eef2f3",side:"#e3e8ea",ceiling:"#d3d9dc",floor:"#e9edef",led:"#ffffff",glare:.5},Qh={back:"#3a302a",side:"#463a33",ceiling:"#2c2520",floor:"#302822",led:"#fff1d8",glare:.2},Jh={back:"#4e5357",side:"#5a5f63",ceiling:"#44484b",floor:"#5f6366",led:"#eef6ff",glare:.25},jt=(e,t,n,r)=>h`<g transform=${`translate(${d(e)} ${d(t)}) scale(${Math.round(n*1e3)/1e3})`}>${r}</g>`,wd=(e,t,n="")=>h`<rect x=${d(e.x)} y=${d(e.y)} width=${d(e.w)} height=${d(e.h)} fill=${t} style=${n} />`,yt=e=>h`<ellipse cx="0" cy="-0.6" rx=${d(e*.56)} ry=${d(Math.max(1.4,e*.07))} fill="#000" opacity="0.18" />`;function jo(e,t){let{w:n,h:r}=e,o=n*(e.tall?.3:.42),i=r*(e.tall?.6:.68),a=n*.14,s=`M${d(-n/2)} ${d(-a)}V${d(-i+n*.3)}C${d(-n/2)} ${d(-i-n*.1)} ${d(-o/2)} ${d(-i-r*.06)} ${d(-o/2)} ${d(-r*.83)}V${d(-r*.94)}H${d(o/2)}V${d(-r*.83)}C${d(o/2)} ${d(-i-r*.06)} ${d(n/2)} ${d(-i-n*.1)} ${d(n/2)} ${d(-i+n*.3)}V${d(-a)}Q${d(n/2)} 0 ${d(n/2-a)} 0H${d(-n/2+a)}Q${d(-n/2)} 0 ${d(-n/2)} ${d(-a)}Z`,l=-r*(e.tall?.7:.78),p=e.liquid?h`<rect x=${d(-n/2+.8)} y=${d(l)} width=${d(n-1.6)} height=${d(-l-1)} rx=${d(a)} fill=${e.liquid} />`:v,u=e.label?h`<rect x=${d(-n/2)} y=${d(-i*.82)} width=${d(n)} height=${d(i*.44)} fill=${e.label} /><rect x=${d(-n/2)} y=${d(-i*.62)} width=${d(n)} height=${d(i*.08)} fill="#000" opacity="0.12" />`:v;return h`${yt(n)}${p}<path d=${s} fill=${e.glass} fill-opacity=${e.glassOpacity} />${u}<rect x=${d(-o/2-.6)} y=${d(-r)} width=${d(o+1.2)} height=${d(r*.075)} rx="1" fill=${e.cap} /><path d=${s} fill=${t.ref("cyl")} /><path d=${`M${d(-n*.22)} ${d(-r*.12)}V${d(-i*.9)}`} stroke="#fff" stroke-opacity="0.38" stroke-width=${d(n*.06)} stroke-linecap="round" />`}function vd(e,t,n,r,o){return h`${yt(e)}<rect x=${d(-e/2)} y=${d(-t*.86)} width=${d(e)} height=${d(t*.86)} rx=${d(e*.16)} fill=${n} /><rect x=${d(-e/2)} y=${d(-t*.86)} width=${d(e)} height=${d(t*.86)} rx=${d(e*.16)} fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-opacity="0.3" stroke-width="0.7" /><rect x=${d(-e*.45)} y=${d(-t)} width=${d(e*.9)} height=${d(t*.17)} rx="1.4" fill=${r} /><rect x=${d(-e*.45)} y=${d(-t)} width=${d(e*.9)} height=${d(t*.17)} rx="1.4" fill=${o.ref("cyl")} /><rect x=${d(-e/2)} y=${d(-t*.86)} width=${d(e)} height=${d(t*.86)} rx=${d(e*.16)} fill=${o.ref("cyl")} opacity="0.7" />`}function em(e,t,n,r,o){let i=Array.from({length:6},(a,s)=>{let l=-e/2+6+(s+o()*.6)*((e-12)/6);return h`<ellipse cx=${d(l)} cy=${d(-t*.32)} rx=${d(e*.11)} ry=${d(t*.24)} fill=${n[s%n.length]} />`});return h`${yt(e)}${i}<rect x=${d(-e/2)} y=${d(-t*.86)} width=${d(e)} height=${d(t*.86)} rx="2.5" fill="#f4f8fa" fill-opacity="0.4" stroke="#ffffff" stroke-opacity="0.5" stroke-width="0.7" /><rect x=${d(-e/2-1)} y=${d(-t)} width=${d(e+2)} height=${d(t*.16)} rx="2" fill=${r} /><path d=${`M${d(-e/2+2)} ${d(-t*.7)}H${d(e/2-2)}`} stroke="#fff" stroke-opacity="0.4" stroke-width="0.7" />`}function tm(e,t,n,r){return h`${yt(e)}<path d=${`M${d(-e/2)} 0V${d(-t*.8)}L${d(-e*.3)} ${d(-t*.96)}H${d(e*.3)}L${d(e/2)} ${d(-t*.8)}V0Z`} fill=${n} /><rect x=${d(-e*.32)} y=${d(-t)} width=${d(e*.64)} height=${d(t*.05)} fill=${n} /><rect x=${d(-e/2)} y=${d(-t*.58)} width=${d(e)} height=${d(t*.24)} fill=${r} /><rect x=${d(e*.08)} y=${d(-t*.8)} width=${d(e*.42)} height=${d(t*.8)} fill="#000" opacity="0.1" />`}function nm(e,t,n){let r=t==="grapes"?["#a3b768","#93a85a","#b0c178"]:t==="oranges"?["#d9904a","#e09c55"]:["#9e3f4a","#4a4670","#ad4a55"],o=t==="oranges"?e*.16:t==="grapes"?e*.065:e*.07,i=[],a=t==="oranges"?5:16;for(let l=0;l<a;l++){let p=n(),u=(p-.5)*e*.7,f=-e*.28-n()*(e*.22)*Math.sin(p*Math.PI)-o*.4,m=r[Math.floor(n()*r.length)];i.push(h`<circle cx=${d(u)} cy=${d(f)} r=${d(o)} fill=${m} /><circle cx=${d(u+o*.25)} cy=${d(f+o*.2)} r=${d(o*.8)} fill="#000" opacity="0.12" /><circle cx=${d(u-o*.3)} cy=${d(f-o*.35)} r=${d(o*.28)} fill="#fff" opacity="0.28" />`)}let s=`M${d(-e/2)} ${d(-e*.3)}H${d(e/2)}C${d(e*.46)} ${d(-e*.08)} ${d(e*.2)} 0 0 0C${d(-e*.2)} 0 ${d(-e*.46)} ${d(-e*.08)} ${d(-e/2)} ${d(-e*.3)}Z`;return h`${yt(e*.7)}${i}<path d=${s} fill="#efe9df" /><path d=${s} fill="#000" opacity="0.06" /><path d=${`M${d(-e/2)} ${d(-e*.3)}H${d(e/2)}`} stroke="#fff" stroke-width="1.2" stroke-opacity="0.9" />`}function rm(e){let t=Array.from({length:5},(n,r)=>{let o=-e/2+(r+.5)*(e/5);return h`<ellipse cx=${d(o)} cy=${d(-9)} rx=${d(e/11)} ry="8" fill="#d6b08e" /><ellipse cx=${d(o-e/40)} cy=${d(-12)} rx=${d(e/40)} ry="2.6" fill="#fff" opacity="0.3" />`});return h`${yt(e)}${t}<rect x=${d(-e/2)} y="-8" width=${d(e)} height="8" rx="1.5" fill="#f2f5f6" fill-opacity="0.6" stroke="#fff" stroke-opacity="0.6" stroke-width="0.7" />`}function om(e,t,n){return h`${yt(e)}<path d=${`M${d(-e/2)} ${d(-t)}H${d(e/2)}L${d(e*.4)} 0H${d(-e*.4)}Z`} fill="#f3f1eb" /><rect x=${d(-e/2-.5)} y=${d(-t-1.5)} width=${d(e+1)} height="2.6" rx="1" fill=${n} /><path d=${`M${d(e*.12)} ${d(-t)}L${d(e*.1)} 0`} stroke="#000" stroke-opacity="0.08" stroke-width=${d(e*.3)} />`}function md(e,t,n,r,o){let i=Math.min(6,t*.16),a=Math.min(5,e*.1),s=`M${d(-e/2)} 0V${d(-t)}H${d(e/2-a)}V0Z`,l=`M${d(-e/2)} ${d(-t)}L${d(-e/2+a)} ${d(-t-i)}H${d(e/2)}L${d(e/2-a)} ${d(-t)}Z`,p=`M${d(e/2-a)} 0V${d(-t)}L${d(e/2)} ${d(-t-i)}V${d(-i)}Z`,u=(e-a)*(.4+o()*.25),f=-e/2+3+o()*(e-a-u-6);return h`${yt(e)}<path d=${s} fill=${n} /><path d=${l} fill=${n} /><path d=${l} fill="#fff" opacity="0.14" /><path d=${p} fill=${n} /><path d=${p} fill="#000" opacity="0.15" /><rect x=${d(f)} y=${d(-t*.62)} width=${d(u)} height=${d(t*.3)} rx="0.8" fill=${r} /><path d=${`M${d(-e/2)} ${d(-t+.5)}H${d(e/2-a)}`} stroke="#fff" stroke-opacity="0.45" stroke-width="0.7" />`}function im(e,t,n,r){let o=Array.from({length:9},(a,s)=>`${d(-e/2+s*e/8)} ${d(-t-(s%2?2:0))}`).join(" L"),i=Array.from({length:10},()=>{let a=(r()-.5)*e*.8,s=-t*(.15+r()*.55);return h`<circle cx=${d(a)} cy=${d(s)} r=${d(e*.06)} fill=${n} />`});return h`${yt(e)}<path d=${`M${d(-e/2)} 0V${d(-t)} L${o}V0Z`} fill="#dfe6ea" />${i}<path d=${`M${d(-e/2)} 0V${d(-t)} L${o}V0Z`} fill="#f2f6f8" fill-opacity="0.5" /><path d=${`M${d(-e/2)} ${d(-t*.84)}H${d(e/2)}`} stroke="#9aa6ad" stroke-opacity="0.5" stroke-width="0.8" /><path d=${`M${d(e*.3)} ${d(-t)}V0`} stroke="#000" stroke-opacity="0.06" stroke-width=${d(e*.25)} />`}function kd(e,t,n,r,o){return h`${yt(e)}<rect x=${d(-e/2)} y=${d(-t)} width=${d(e)} height=${d(t)} rx=${d(e*.1)} fill=${n} /><rect x=${d(-e/2)} y=${d(-t*.66)} width=${d(e)} height=${d(t*.34)} fill=${r} /><rect x=${d(-e/2+.8)} y=${d(-t-.6)} width=${d(e-1.6)} height="3" rx="1.2" fill="#c3c7ca" /><rect x=${d(-e/2)} y=${d(-t)} width=${d(e)} height=${d(t)} rx=${d(e*.1)} fill=${o.ref("cyl")} /><path d=${`M${d(-e/2+e*.3)} ${d(-t+3)}V${d(-2)}`} stroke="#fff" stroke-opacity="0.5" stroke-width="1" />`}var Oe=(e,t)=>t[Math.floor(e()*t.length)];function ga(e){return[()=>({w:28,h:96,draw:jo({w:28,h:96,glass:"#e8f0f2",glassOpacity:.35,liquid:"#e2a446",cap:"#4a6f45",label:"#f1ead8"},e)}),()=>({w:32,h:84,draw:tm(32,84,"#f4f4f0","#7a93b0")}),t=>({w:24,h:36,draw:vd(24,36,Oe(t,["#7a3a3f","#6f7a3c","#a8573a","#c79a45"]),Oe(t,["#c2a45c","#b9bec2","#3a3e42"]),e)}),t=>({w:62,h:28,draw:em(62,28,Oe(t,[["#7a9a52","#93ad62"],["#dcc493","#cdb27a"],["#b75a48","#c97a52"]]),Oe(t,["#7d93ad","#8faa92","#d8dde0"]),t)}),t=>({w:66,h:42,draw:nm(66,Oe(t,["grapes","oranges","berries"]),t)}),()=>({w:30,h:116,draw:jo({w:30,h:116,glass:"#33463a",glassOpacity:1,liquid:null,cap:"#cdbb8c",label:"#ece5d2",tall:!0},e)}),t=>({w:22,h:24,draw:om(22,24,Oe(t,["#7d93ad","#b0646c","#d6b25e"]))}),()=>({w:26,h:92,draw:jo({w:26,h:92,glass:"#dfeaf0",glassOpacity:.45,liquid:"#e8eef1",cap:"#4f6f96",label:"#8ea3bd"},e)}),()=>({w:72,h:20,draw:rm(72),single:!0})]}var gd=[["#ecebe7","#a8786c"],["#c9b08a","#efe9dc"],["#f1f0ec","#7d93ab"],["#d6c2a0","#8a6a50"],["#e6e3dc","#86a07c"],["#f3f2ee","#c2a67a"]];function mr(e){return[t=>{let[n,r]=Oe(t,gd);return{w:54,h:34,draw:md(54,34,n,r,t)}},t=>{let[n,r]=Oe(t,gd);return{w:40,h:56,draw:md(40,56,n,r,t)}},t=>({w:50,h:42,draw:im(50,42,Oe(t,["#86a35e","#bfa36e","#a65a52","#d9d0b8"]),t)}),t=>({w:32,h:34,draw:vd(32,34,Oe(t,["#efe6d2","#6e4a3a","#dcb3b8"]),"#f2efe8",e)})]}var Ln=[["#c9ccce","#e3b7b9"],["#d7d9db","#a9d3c0"],["#cfd2d4","#d9c48a"],["#e8e8e4","#8fa7c4"],["#b9bcbf","#f0ece4"],["#2f3b4a","#c9ccce"]];function xd(e,t,n,r,o,i,a,s,l=new Set){let p=rt(s),u=Ze(e.inside,a),f=[],m=n+5+p()*10,y=0;for(;m<r-20&&y++<40;){let g=Math.floor(p()*t.length),_=t[g](p);if(_.h>i||m+_.w>r-4||_.single&&l.has(g)){m+=6;continue}_.single&&l.add(g);let[b,$]=Ye(e.inside,m+_.w/2,o,a);f.push(jt(b,$,u,_.draw)),m+=_.w+2+p()*10}return f}function am(e,t,n){let r=e.layout.depth,o=(w,k)=>Ye(e.inside,w,k,-r),i=[t.x,t.y],a=[t.x+t.w,t.y],s=[t.x+t.w,t.y+t.h],l=[t.x,t.y+t.h],p=o(t.x,t.y),u=o(t.x+t.w,t.y),f=o(t.x+t.w,t.y+t.h),m=o(t.x,t.y+t.h),y={x:p[0],y:p[1],w:u[0]-p[0],h:m[1]-p[1]},g=[i,p,m,l],_=[u,a,s,f],b=[i,a,u,p],$=[m,f,s,l];return h`<path d=${B([p,u,f,m])} fill=${n.back} />
    ${wd(y,e.ref("shadeDown"))}
    <path d=${B(g)} fill=${n.side} /><path d=${B(g)} fill=${e.ref("depthL")} />
    <path d=${B(_)} fill=${n.side} /><path d=${B(_)} fill=${e.ref("depthR")} />
    <path d=${B(b)} fill=${n.ceiling} /><path d=${B(b)} fill=${e.ref("depthT")} />
    <path d=${B($)} fill=${n.floor} /><path d=${B($)} fill=${e.ref("depthB")} />
    <path d=${`M${d(p[0])} ${d(p[1])}V${d(m[1])}H${d(f[0])}V${d(u[1])}Z`} fill="none" stroke="#000" stroke-opacity="0.1" stroke-width="1.6" />`}function sm(e,t,n,r){let o={x:t.x+8,y:t.y+2.5,w:t.w-16,h:3.4},i=r?[t.x+2,t.x+t.w-5.5].map(a=>h`<rect x=${d(a-3)} y=${d(t.y+12)} width="9" height=${d(t.h-30)} fill=${n.led} opacity="0.5" filter=${e.ref("blur")} />
          <rect x=${d(a)} y=${d(t.y+12)} width="3.4" height=${d(t.h-30)} rx="1.7" fill=${n.led} />`):v;return h`<rect x=${d(o.x)} y=${d(o.y-2)} width=${d(o.w)} height=${d(o.h+6)} fill=${n.led} opacity="0.6" filter=${e.ref("blur")} />
    <rect x=${d(o.x)} y=${d(o.y)} width=${d(o.w)} height=${d(o.h)} rx="1.7" fill=${n.led} />
    ${i}
    ${wd({x:t.x,y:t.y,w:t.w,h:t.h*.5},e.ref("glare"),`opacity:${n.glare}`)}`}function Bo(e,t,n){let r=e.layout.depth,o=Ye(e.inside,t.x+1,n,-14),i=Ye(e.inside,t.x+t.w-1,n,-14),a=Ye(e.inside,t.x+1,n,-r+8),s=Ye(e.inside,t.x+t.w-1,n,-r+8),l=Ze(e.inside,-14);return{under:h`<path d=${B([a,s,i,o])} fill="#ffffff" fill-opacity="0.3" stroke="#ffffff" stroke-opacity="0.45" stroke-width="0.8" /><path d=${B([o,i,[i[0],i[1]+7],[o[0],o[1]+7]])} fill="#000" opacity="0.06" />`,trim:h`<rect x=${d(o[0])} y=${d(o[1]-1)} width=${d(i[0]-o[0])} height=${d(7*l)} fill="#b3b8bb" /><rect x=${d(o[0])} y=${d(o[1]+2.5*l)} width=${d(i[0]-o[0])} height=${d(3.5*l)} fill="#8e9497" /><path d=${`M${d(o[0])} ${d(o[1]-.6)}H${d(i[0])}`} stroke="#fff" stroke-opacity="0.95" stroke-width="1.1" /><path d=${`M${d(o[0])} ${d(o[1]+7*l-1)}H${d(i[0])}`} stroke="#000" stroke-opacity="0.3" stroke-width="0.9" />`}}var lm=[["#7a9558","#6d884d"],["#93ad70","#85a062"],["#aac487","#9db87a"]],cm=["#435b40","#4e6849","#5a7554"],yd=["#4f6e3f","#5b7b48","#678753","#729160"];function Ko(e,t,n,r){let o=r*Math.PI/180,i=Math.cos(o),a=Math.sin(o);return e.map(([s,l])=>[t+(s-t)*i-(l-n)*a,n+(s-t)*a+(l-n)*i])}function _d(e,t,n,r,o,i,a){let s=[],l=[];for(let y=1;y<9;y++){let g=y/9,_=n/2*Math.pow(Math.sin(Math.PI*(.08+.92*g)*.5),.6)*Math.sqrt(1-Math.pow(Math.max(0,g-.72)/.3,2))*(.9+a()*.14),b=t-r*g;s.push([e-_,b+(a()-.5)*r*.035]),l.unshift([e+_,b+(a()-.5)*r*.035])}let u=[e+(a()-.5)*n*.1,t-r],f=B(Ko([[e,t],...s,u,...l],e,t,o)),m=B(Ko([[e,t],u,...l],e,t,o));return h`<path d=${f} fill=${i} stroke=${i} stroke-width="0.6" stroke-linejoin="round" /><path d=${m} fill="#000" opacity="0.17" />`}function dm(e,t,n,r,o,i,a){let s=[];for(let u=0;u<=18;u++){let f=u/18*Math.PI,m=u%2?.84+a()*.1:1;s.push([e-Math.cos(f)*(n/2)*Math.sin(f*.5+.6)*m,t-Math.sin(f)*r*.95*m-(1-Math.abs(Math.cos(f)))*r*.05])}let p=Ko([[e,t],...s.slice(18/2)],e,t,o);return h`<path d=${B(Ko(s,e,t,o))} fill=${i} /><path d=${B(p)} fill="#000" opacity="0.16" />`}function pm(e,t,n,r){let o=[];for(let i=0;i<9;i++){let a=Math.PI*(.05+r()*.9),s=n*(.35+r()*.55),l=e-Math.cos(a)*s,p=t-Math.sin(a)*s*.8,u=n*(.32+r()*.14);o.push(h`<circle cx=${d(l)} cy=${d(p)} r=${d(u)} fill=${Oe(r,["#56704a","#4a6340","#5e7a50"])} /><circle cx=${d(l-u*.3)} cy=${d(p-u*.35)} r=${d(u*.35)} fill="#7f9a68" opacity="0.55" />`)}return h`<path d=${`M${d(e-n*.3)} ${d(t+n*1.3)}L${d(e-n*.22)} ${d(t)}H${d(e+n*.22)}L${d(e+n*.3)} ${d(t+n*1.3)}Z`} fill="#a7b98c" />
    <circle cx=${d(e)} cy=${d(t)} r=${d(n)} fill="#4e6943" />
    ${o}
    <path d=${`M${d(e)} ${d(t-n)}A${d(n)} ${d(n)} 0 0 1 ${d(e)} ${d(t+n)}Z`} fill="#000" opacity="0.15" />`}function zd(e,t,n,r,o,i){let a=[],s=n-t,l=t+s/2;if(e==="lettuce"||e==="kale"||e==="spinach"){let u=e==="spinach";return(u?[.9,.78,.62,.46]:[.95,.8,.62]).forEach((f,m)=>{let y=o*f*(u?.7:1),g=y*(e==="kale"?.5:u?.8:.56),_=Math.max(2,Math.ceil(s/(g*.5)));for(let b=0;b<_;b++){let $=t+(b+.5)*s/_+(i()-.5)*g*.35,w=y*(.82+i()*.22),k=g*(.85+i()*.25),x=($-l)/s*36+(i()-.5)*18,z=r-(u?o*.32*(m/3):0);a.push(e==="kale"?dm($,z,k,w,x,cm[m],i):_d($,z,k,w,x,u?yd[m%yd.length]:lm[m][Math.floor(i()*2)],i))}}),a}if(e==="broccoli"){let u=Math.min(o*.3,s*.2);return[.66,.36].forEach((f,m)=>{for(let y=t+u*(m?1.4:.9);y<n-u*.5;y+=u*1.75)a.push(pm(y,r-o*f,u*(m?1.05:.95),i))}),a}if(e==="radish"){for(let f=t+s*.12;f<n;f+=s*.2)a.push(_d(f,r-o*.3,o*.36,o*.7,(i()-.5)*50,Oe(i,["#6f8b56","#7d9862","#65804e"]),i));let u=Math.round(s/4.2);for(let f=0;f<u;f++){let m=Math.min(5,o*.17)*(.7+i()*.45),y=t+m+i()*(s-2*m),g=r-m-i()*o*.42;a.push(h`<circle cx=${d(y)} cy=${d(g)} r=${d(m)} fill=${Oe(i,["#b04a5a","#bd5868","#a8424f","#c06474"])} /><path d=${`M${d(y-m*.6)} ${d(g+m*.55)}Q${d(y)} ${d(g+m*1.25)} ${d(y+m*.6)} ${d(g+m*.55)}`} fill="#efe6e2" /><path d=${`M${d(y)} ${d(g-m)}A${d(m)} ${d(m)} 0 0 1 ${d(y)} ${d(g+m)}Z`} fill="#000" opacity="0.16" /><circle cx=${d(y-m*.35)} cy=${d(g-m*.35)} r=${d(m*.28)} fill="#fff" opacity="0.25" />`)}return a}if(e==="herbs"){for(let u=t+2;u<n-1;u+=2.1+i()*1.2){let f=o*(.8+i()*.2),m=(u-l)*.12+(i()-.5)*3;a.push(h`<path d=${`M${d(u)} ${d(r)}L${d(u+m)} ${d(r-f)}`} stroke=${Oe(i,["#8ea36a","#7f965e","#9aae78"])} stroke-width="2.3" stroke-linecap="round" /><path d=${`M${d(u+m*.9)} ${d(r-f*.9)}L${d(u+m)} ${d(r-f)}`} stroke="#5c7044" stroke-width="2.5" stroke-linecap="round" />`)}return a}let p=Math.min(o*.21,s*.14);for(let u=0;u<3;u++)for(let f=t+p*(u%2?1.9:1)+i()*p*.4;f<n-p*.6;f+=p*(1.95+i()*.3)){let m=r-p-u*p*1.5-(i()-.5)*p*.5,y=Oe(i,["#d98f46","#e09a52","#d6bf5c"]);a.push(h`<circle cx=${d(f)} cy=${d(m)} r=${d(p)} fill=${y} /><circle cx=${d(f+p*.28)} cy=${d(m+p*.25)} r=${d(p*.78)} fill="#000" opacity="0.13" /><circle cx=${d(f-p*.35)} cy=${d(m-p*.38)} r=${d(p*.25)} fill="#fff" opacity="0.3" />`)}return a}var $d=[["lettuce","herbs","spinach"],["lettuce","radish","broccoli"],["kale","citrus","spinach"],["kale","lettuce","spinach"]];function Sd(e,t,n,r,o){let i=3*t,a=e.w*.22,s=Math.max(4,e.h*.18),l=e.x+(e.w-a)/2,p=n?[1,2].map(u=>h`<rect x=${d(e.x+e.w*u/3-.6)} y=${d(e.y+i)} width="1.2" height=${d(e.h-i)} fill="#fff" opacity="0.5" />`):v;return h`<g>
    <rect x=${d(e.x)} y=${d(e.y)} width=${d(e.w)} height=${d(e.h)} rx="2" fill="#000" opacity="0.05" />
    <clipPath id=${o}><rect x=${d(e.x)} y=${d(e.y-4)} width=${d(e.w)} height=${d(e.h+4)} /></clipPath>
    <g clip-path=${`url(#${o})`}>${r}</g>
    <rect x=${d(e.x)} y=${d(e.y+e.h*.35)} width=${d(e.w)} height=${d(e.h*.65)} fill="#fff" opacity="0.35" />
    <rect x=${d(e.x)} y=${d(e.y)} width=${d(e.w)} height=${d(e.h)} rx="2" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="0.8" />
    <rect x=${d(e.x)} y=${d(e.y)} width=${d(e.w)} height=${d(i)} fill="#fff" opacity="0.6" />
    ${p}
    <rect x=${d(l)} y=${d(e.y+i*.6)} width=${d(a)} height=${d(s)} rx="1" fill="#fff" fill-opacity="0.3" stroke="#9aa3a8" stroke-width="1.2" />
    <path d=${`M${d(e.x+2)} ${d(e.y+e.h-.8)}H${d(e.x+e.w-2)}`} stroke="#fff" stroke-opacity="0.8" stroke-width="1" />
  </g>`}function Rd(e){if(e.h<=260)return null;let t=e.h>520;return{top:e.y+e.h*(t?.63:.73),count:t?4:2}}function ya(e,t,n,r,o){let i=(r-n)/o;return Array.from({length:o},(a,s)=>Nt(e.inside,{x:t.x+5,y:n+s*i+3,w:t.w-10,h:i-5},-18))}function Ad(e,t){if(t.contents!=="fridge"&&t.contents!=="food")return[];let n=Rd(t.cavity);return n?ya(e,t.cavity,n.top,t.cavity.y+t.cavity.h*.995,n.count):[]}function um(e,t,n,r,o,i,a){let s=rt(i);return ya(e,t,n,r,o).map((l,p)=>{let u=$d[p%$d.length],f=l.y+l.h-2,m=u.map((y,g)=>{let _=l.x+l.w*g/3+1.5,b=l.w/3-3,$=`${a}b${p}s${g}`;return h`<clipPath id=${$}><rect x=${d(_)} y=${d(l.y-3)} width=${d(b)} height=${d(l.h+3)} /></clipPath><g clip-path=${`url(#${$})`}>${zd(y,_+1,_+b-1,f,l.h*.92,s)}<rect x=${d(_)} y=${d(l.y-3)} width=${d(b)} height=${d(l.h+3)} fill=${e.ref("binLight")} /></g>`});return Sd(l,Ze(e.inside,-18),!0,m,`${a}b${p}`)})}function fm(e,t,n,r,o,i,a){let s=rt(i),p=Ze(e.inside,-58),u=mr(e);return ya(e,t,n,r,o).map((f,m)=>{let y=[];return[.3,0].forEach((g,_)=>{let b=f.y+f.h-2-f.h*g,$=f.h*(_?.95:.7);for(let w=f.x+4+_*12*p;w<f.x+f.w-26*p;w+=(36+s()*10)*p){let k=u[Math.floor(s()*3)](s),x=Math.min(p*(_?1:.9),$/k.h);y.push(jt(w+k.w/2*x,b,x,k.draw))}}),Sd(f,Ze(e.inside,-18),!1,y,`${a}b${m}`)})}function hm(e,t,n,r){let o=t.cavity,i=o.h>520,a=o.h>260,s=Rd(o),l=s?(s.top-o.y)/o.h:1,p=i?4:a?3:2,u=a?.17:.38,f=l<1?l-.12:.72,m=Array.from({length:p},(k,x)=>o.y+o.h*(u+(f-u)*x/Math.max(1,p-1)));l<1&&m.push(o.y+o.h*l);let y=e.layout.internalDispenser&&i&&t.contents==="fridge",g=Nt(e.inside,{x:o.x+1,y:o.y+o.h*.2,w:Math.min(50,o.w*.17),h:o.h*.25},-26),_=ga(e),b=new Set,$=[];m.forEach((k,x)=>{let z=x?m[x-1]:o.y+o.h*.03,R=y&&k>g.y&&z<g.y+g.h,T=Bo(e,o,k);$.push(T.under),$.push(...xd(e,_,R?g.x+g.w+6:o.x,o.x+o.w,k,(k-z)*.8,-62,n*31+x,b)),$.push(T.trim)});let w=y?h`<rect x=${d(g.x+2)} y=${d(g.y+3)} width=${d(g.w)} height=${d(g.h)} rx="2" fill="#000" opacity="0.16" filter=${e.ref("blur")} />
        <rect x=${d(g.x)} y=${d(g.y)} width=${d(g.w)} height=${d(g.h)} rx="2.5" fill="#f3f5f6" />
        <rect x=${d(g.x+g.w-4)} y=${d(g.y)} width="4" height=${d(g.h)} rx="2" fill="#000" opacity="0.08" />
        <rect x=${d(g.x+g.w*.12)} y=${d(g.y+g.h*.24)} width=${d(g.w*.76)} height=${d(g.h*.6)} rx="2" fill="#dfe4e7" />
        <path d=${`M${d(g.x+g.w*.5)} ${d(g.y+g.h*.3)}V${d(g.y+g.h*.78)}`} stroke="#9aa3a8" stroke-width="1.2" />
        <rect x=${d(g.x+g.w*.22)} y=${d(g.y+g.h*.08)} width=${d(g.w*.14)} height=${d(g.w*.14)} rx="0.6" fill="none" stroke="#7d878d" stroke-width="0.8" />
        <path d=${`M${d(g.x+g.w*.7)} ${d(g.y+g.h*.07)}c2 3 3 4 3 5a3 3 0 0 1 -6 0c0 -1 1 -2 3 -5z`} fill="none" stroke="#7d878d" stroke-width="0.8" />`:v;return h`${$}${w}${s?um(e,o,s.top,o.y+o.h*.995,s.count,n,r):v}`}function mm(e,t,n){let r=Nt(e.inside,{x:t.x+t.w*.36,y:t.y+t.h*.03,w:t.w*.58,h:t.h*.22},-40),o={x:r.x+r.w*.12,y:r.y+r.h*.42,w:r.w*.76,h:r.h*.4};return h`<rect x=${d(r.x+2)} y=${d(r.y+3)} width=${d(r.w)} height=${d(r.h)} rx="2.5" fill="#000" opacity="0.2" filter=${e.ref("blur")} />
    <rect x=${d(r.x)} y=${d(r.y)} width=${d(r.w)} height=${d(r.h)} rx="2.5" fill="#d9dee1" stroke="#a3adb3" stroke-width="0.8" />
    <rect x=${d(r.x)} y=${d(r.y)} width=${d(r.w)} height=${d(r.h*.3)} rx="2.5" fill="#fff" opacity="0.4" />
    <rect x=${d(r.x)} y=${d(r.y+r.h-3.5)} width=${d(r.w)} height="3.5" rx="1.5" fill="#000" opacity="0.16" />
    <rect x=${d(o.x)} y=${d(o.y)} width=${d(o.w)} height=${d(o.h)} rx="1.5" fill="#9eabb3" />
    <g opacity="0.25">${Td(e,o,n,!1,11)}</g>
    <rect x=${d(o.x)} y=${d(o.y)} width=${d(o.w)} height=${d(o.h)} rx="1.5" fill="#eef3f5" fill-opacity="0.35" stroke="#8f9aa1" stroke-width="0.8" />
    <rect x=${d(o.x)} y=${d(o.y)} width=${d(o.w)} height=${d(o.h*.22)} rx="1.5" fill="#fff" opacity="0.3" />
    <rect x=${d(r.x+r.w*.12)} y=${d(r.y+r.h*.14)} width=${d(r.w*.3)} height=${d(Math.max(2,r.h*.08))} rx="1" fill="#aeb7bc" />`}function gm(e,t,n,r){let o=t.cavity,i=o.h>520,a=i?.6:.66,s=t.ice,l=(s?[.32,.46]:[.2,.34,.47]).map(f=>o.y+o.h*f).concat([o.y+o.h*a]),p=[];s&&p.push(mm(e,o,n));let u=mr(e);return l.forEach((f,m)=>{let y=m?l[m-1]:o.y+o.h*(s?.27:.03),g=Bo(e,o,f);p.push(g.under),p.push(...xd(e,u,o.x,o.x+o.w,f,(f-y)*.78,-58,n*17+m)),p.push(g.trim)}),h`${p}${fm(e,o,o.y+o.h*a,o.y+o.h*.995,i?3:2,n+3,r)}`}function Td(e,t,n,r,o=6){let i=rt(n+11),a=[],s=Math.max(o,Math.min(12,t.w/10)),l=s*.78;for(let p=t.y+t.h-s*.4;p>t.y;p-=l*.8)for(let u=t.x+s*.3;u<t.x+t.w;u+=l){let f=(u-t.x)/t.w,m=t.y+t.h*(.32-.22*Math.sin(f*Math.PI))+i()*s*.6;if(p<m)continue;let y=s*(.75+i()*.4),g=u+(i()-.5)*s*.5,_=p+(i()-.5)*s*.4,b=(i()-.5)*40,$=.82+i()*.18;a.push(h`<rect x=${d(g-y/2)} y=${d(_-y*.45)} width=${d(y)} height=${d(y*.9)} rx=${d(y*.22)} transform=${`rotate(${d(b)} ${d(g)} ${d(_)})`} fill=${e.ref("ice")} opacity=${d($*10)/10} />`)}return h`<g opacity=${r?.6:1}>${a}</g>`}function ym(e,t,n,r){let o=t.cavity,i=t.racks??{count:6,split:null},{bars:a,divider:s}=ma(n,i),l=rt(r),p=["#8f7a45","#4a1520","#9a968a","#1b1b1b","#7d8083","#5e1822"],u=["#1d2a1e","#2b1d12","#141414","#22301f"],f=Math.max(3,Math.floor((o.w-8)/24.5)),m=(o.w-8)/f,y=[];if(a.forEach((g,_)=>{let b=[];for(let $=0;$<f;$++){let w=o.x+4+($+.5)*m,k=g-5,x=u[Math.floor(l()*u.length)];b.push((_+$)%2===0?h`<circle cx=${d(w)} cy=${d(k)} r="13.5" fill=${x} /><circle cx=${d(w)} cy=${d(k)} r="9.5" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.4" /><circle cx=${d(w)} cy=${d(k)} r="5" fill="#000" opacity="0.35" /><ellipse cx=${d(w-5)} cy=${d(k-6.5)} rx="4" ry="2" fill="#fff" opacity="0.2" />`:h`<circle cx=${d(w)} cy=${d(k)} r="12" fill=${x} opacity="0.85" /><circle cx=${d(w)} cy=${d(k)} r="4.5" fill=${p[Math.floor(l()*p.length)]} stroke="#000" stroke-opacity="0.35" stroke-width="0.8" /><circle cx=${d(w-1.4)} cy=${d(k-1.5)} r="1.4" fill="#fff" opacity="0.25" />`)}y.push(h`${b}<rect x=${d(o.x+2)} y=${d(g)} width=${d(o.w-4)} height="15.5" rx="1" fill=${e.ref("wood")} /><path d=${`M${d(o.x+2)} ${d(g+.5)}H${d(o.x+o.w-2)}`} stroke="#fff" stroke-opacity="0.45" stroke-width="0.8" /><path d=${`M${d(o.x+2)} ${d(g+15.5)}H${d(o.x+o.w-2)}`} stroke="#000" stroke-opacity="0.5" stroke-width="1.2" />`)}),s){let g=o.x+o.w/2,_=s.y;y.push(h`<rect x=${d(o.x)} y=${d(_)} width=${d(o.w)} height=${s.h} fill="#1b1612" />
      <path d=${`M${d(o.x)} ${d(_+.6)}H${d(o.x+o.w)}`} stroke="#6a5a4c" stroke-width="1" />
      <rect x=${d(g-17)} y=${d(_+6)} width="34" height="9" rx="1.5" fill="#090a0b" />
      <rect x=${d(g-12)} y=${d(_+9.5)} width="24" height="2" rx="1" fill="#a9c8ff" opacity="0.6" />`)}return h`${y}`}var bd=[{w:24,h:90,glass:"#5a3a1c",glassOpacity:.95,liquid:null,cap:"#b9a36a",label:"#e4dccb"},{w:24,h:88,glass:"#4f3420",glassOpacity:.95,liquid:null,cap:"#8a8f93",label:"#c9b38c"},{w:26,h:100,glass:"#cfe0e4",glassOpacity:.45,liquid:"#e9efe9",cap:"#6f8a74",label:"#9fb9a6"},{w:26,h:96,glass:"#3d5a3e",glassOpacity:.9,liquid:null,cap:"#c9ccce",label:"#e9e6dc"},{w:30,h:116,glass:"#1f2a1c",glassOpacity:1,liquid:null,cap:"#6a2a30",label:"#ece5d2",tall:!0},{w:24,h:84,glass:"#d6e2e6",glassOpacity:.5,liquid:"#d9b26a",cap:"#30343a",label:"#2f3b4a"}];function _m(e,t,n,r){let o=t.cavity,i=n[1]-n[0],a=b=>n[0]+i*b,s=rt(r),l=Bo(e,o,a(.13)),p=Bo(e,o,a(.37)),u=-55,f=Ze(e.inside,u),m=[],y=o.x+7;for(;y<o.x+o.w-26;){let b=s()>.7,[$,w]=b?[21,60]:[25.5,48];if(y+$>o.x+o.w-5)break;let[k,x]=Ln[Math.floor(s()*Ln.length)],[z,R]=Ye(e.inside,y+$/2,a(.37),u);m.push(jt(z,R,f,kd($,w,k,x,e))),y+=$+1.5+s()*3}let g=[];for(y=o.x+6;y<o.x+o.w-28;){let b=bd[Math.floor(s()*bd.length)],$=.85+s()*.25,w={...b,h:Math.min(116,b.h*$)};if(y+w.w>o.x+o.w-4)break;let[k,x]=Ye(e.inside,y+w.w/2,a(.75),-58);g.push(jt(k,x,Ze(e.inside,-58),jo(w,e))),y+=w.w+1+s()*4}let _=(b,$,w)=>{let k=rt(w),x=a($)-13,z=[];for(let R of[1,0]){let T=[],S=o.x+5+R*11+k()*4;for(;S<o.x+o.w-8;){let C=21+k()*3.5,M=a(b)+1.5-R*2.5+k()*1.5,[O,P]=Ln[Math.floor(k()*Ln.length)],U=d(x-M+2);T.push(h`<rect x=${d(S)} y=${d(M)} width=${d(C)} height=${U} fill=${k()>.45?P:O} /><rect x=${d(S)} y=${d(M)} width=${d(C)} height=${U} fill=${e.ref("cyl")} /><ellipse cx=${d(S+C/2)} cy=${d(M)} rx=${d(C/2)} ry="1.8" fill="#c3c7ca" /><ellipse cx=${d(S+C/2)} cy=${d(M+.2)} rx=${d(C/2-2.2)} ry="1" fill="#8f969b" />`),S+=C+1+k()*2.5}z.push(h`<g opacity=${R?.7:1}>${T}</g>`)}return h`<rect x=${d(o.x+2)} y=${d(a(b)-5)} width=${d(o.w-4)} height=${d(a($)-a(b)+5)} fill="#17130f" opacity="0.55" />
      ${z}
      ${[.4,.75].map(R=>h`<path d=${`M${d(o.x+4)} ${d(a(b)+(x-a(b))*R)}H${d(o.x+o.w-4)}`} stroke="#8a8279" stroke-opacity="0.35" stroke-width="0.6" />`)}
      <rect x=${d(o.x+2)} y=${d(x)} width=${d(o.w-4)} height="13" rx="1" fill=${e.ref("wood")} />
      <path d=${`M${d(o.x+2)} ${d(x+.5)}H${d(o.x+o.w-2)}`} stroke="#fff" stroke-opacity="0.45" stroke-width="0.8" />`};return h`${l.under}${l.trim}${p.under}${m}${p.trim}${g}${_(.77,.88,r+101)}${_(.9,1,r+202)}`}function $m(e,t,n){let r=t.cavity,o=Nt(e.inside,{x:r.x+r.w*.12,y:r.y+r.h*.06,w:r.w*.76,h:r.h*.22},-120),i=Nt(e.inside,{x:r.x+4,y:r.y+r.h*.42,w:r.w-8,h:r.h*.56},-18);return h`<rect x=${d(o.x)} y=${d(o.y)} width=${d(o.w)} height=${d(o.h)} rx="1.5" fill="#a9aeb2" />
    ${Array.from({length:10},(a,s)=>h`<path d=${`M${d(o.x+(s+.5)*o.w/10)} ${d(o.y+2)}v${d(o.h-4)}`} stroke="#d9dde0" stroke-width="1.2" />`)}
    <rect x=${d(i.x)} y=${d(i.y)} width=${d(i.w)} height=${d(i.h)} rx="3" fill="#2a2d30" />
    ${Td(e,i,7,n)}
    <rect x=${d(i.x)} y=${d(i.y)} width=${d(i.w)} height=${d(i.h)} rx="3" fill="#dfe8ee" fill-opacity="0.1" stroke="#ffffff" stroke-opacity="0.35" stroke-width="0.8" />`}function Uo(e,t,n){let r=t.cavity,o=t.contents,i=o==="wine"||o==="beverage"?Qh:o==="ice"?Jh:Xh,a=Math.round(r.x*7+r.y*13+r.w),s=e.id(`c${t.cavityId}${n.glass?`g${Math.round(t.rect.x)}`:""}`),l=t.window?[t.window.y,t.window.y+t.window.h]:[r.y,r.y+r.h],p=o==="fridge"||o==="food"?hm(e,t,a,s):o==="freezer"?gm(e,t,a,s):o==="wine"?ym(e,t,l,a):o==="beverage"?_m(e,t,l,a):$m(e,t,n.state.ice_maker?.paused??!1);return h`<clipPath id=${s}><rect x=${d(r.x)} y=${d(r.y)} width=${d(r.w)} height=${d(r.h)} /></clipPath>
    <g clip-path=${`url(#${s})`}>
      ${am(e,r,i)}
      ${p}
      ${sm(e,r,i,o==="fridge"||o==="freezer"||o==="food")}
    </g>`}function Md(e,t,n,r){let o=rt(n),i=[],a=2;for(let s=0;s<a;s++){let l=.8+.25*s,p=e.y+e.h*(.55+.45*s)+2;if(t==="freezer"){let u=mr(r);for(let f=e.x+26*l;f<e.x+e.w-24*l;f+=(50+o()*12)*l)i.push(jt(f,p,l,u[Math.floor(o()*3)](o).draw))}else if(t==="beverage")for(let u=e.x+16*l;u<e.x+e.w-14*l;u+=28*l){let[f,m]=Ln[Math.floor(o()*Ln.length)];i.push(jt(u,p,l,kd(25,40,f,m,r)))}else{let u=["lettuce","broccoli","kale","citrus","lettuce","radish"],f=e.w/4;for(let m=0;m<4;m++){let y=e.x+m*f;i.push(...zd(u[(m+s*2+n)%u.length],y,y+f,p,30*l,o))}}}return h`${i}`}function Gd(e){switch(e.finish){case"panel":{let t=/^#[0-9a-f]{6}$/i.test(e.panel_color??"")?e.panel_color:"#d9d4ca";return{kind:"panel",color:t,wood:Rn(en(t))}}case"white":return{kind:"panel",color:"#f0efea",wood:!1};case"black":case"carbon":return{kind:"black",color:"#2b2d2f",wood:!1};default:return{kind:"stainless",color:"#c8c9ca",wood:!1}}}function dn(e,t){return zt(en(e),t)}var bm=[[0,"#b9b9b9"],[.07,"#c1c1c1"],[.19,"#bfbfbf"],[.33,"#b8b8b8"],[.45,"#c5c5c5"],[.57,"#d7d7d7"],[.69,"#dedede"],[.78,"#d3d3d3"],[.89,"#bababa"],[1,"#a8a8a8"]],wm=[[0,"#c6c6c6"],[.35,"#c0c0c0"],[.7,"#b8b8b8"],[1,"#b0b0b0"]],vm=[[0,"#a3a3a3"],[.3,"#979797"],[.45,"#a9a9a9"],[.6,"#c8c8c8"],[.75,"#d0d0d0"],[.9,"#b4b4b4"],[1,"#9f9f9f"]];function Ed(e){return e.undercounter?wm:e.line==="pro"?vm:bm}var km=[[0,"#3b3d40"],[.08,"#424447"],[.33,"#333538"],[.57,"#47494c"],[.69,"#4c4e51"],[.85,"#37393c"],[1,"#2a2c2e"]];function xm(e,t){if(e.kind==="stainless")return Ed(t);if(e.kind==="black")return km;let n=e.wood?dn(e.color,.05):e.color;return[[0,dn(n,.07)],[.3,dn(n,.02)],[.62,dn(n,.05)],[1,dn(n,-.1)]]}var je=e=>e.map(([t,n])=>h`<stop offset=${t} stop-color=${n} />`),Pe=e=>e.map(([t,n,r])=>h`<stop offset=${t} stop-color=${n} stop-opacity=${r} />`),Cd=[[0,"#5d6063"],[.09,"#9fa2a5"],[.2,"#d6d8d9"],[.44,"#e4e5e6"],[.58,"#f7f8f8"],[.64,"#e6e7e8"],[.72,"#bfc1c3"],[.86,"#a3a6a8"],[.95,"#76797c"],[1,"#55585b"]],zm={saturation:.06,slope:.62,lift:[.17,.17,.18]};function Od(e){let{layout:t,finish:n}=e,{y0:r,y1:o}=t.span,i=e.theme==="dark",a=n.kind==="stainless"?.025:n.kind==="black"?.05:.07,l=t.fronts.some(f=>f.window&&f.contents==="beverage")?[[0,"#2a2018",.52],[.5,"#120d0a",.66],[1,"#1a130e",.6]]:[[0,"#2a2018",.42],[.5,"#120d0a",.58],[1,"#1a130e",.5]],p=n.kind==="black"?[[0,"#55575a"],[.15,"#47494c"],[1,"#36383a"]]:[[0,"#d6d6d6"],[.12,"#c4c4c4"],[1,"#b2b2b2"]],u=n.kind==="black"?[[0,"#2a2b2d"],[1,"#1b1c1d"]]:[[0,"#767676"],[.7,"#666666"],[1,"#585858"]];return h`<defs>
    <linearGradient id=${e.id("face")} gradientUnits="userSpaceOnUse" x1="0" y1=${r} x2="0" y2=${o}>
      ${je(xm(n,t))}
    </linearGradient>
    <linearGradient id=${e.id("steel")} gradientUnits="userSpaceOnUse" x1="0" y1=${r} x2="0" y2=${o}>
      ${je(Ed(t))}
    </linearGradient>
    <linearGradient id=${e.id("faceX")} x1="0" y1="0" x2="1" y2="0">
      ${Pe([[0,"#ffffff",a],[.3,"#ffffff",0],[.7,"#000000",0],[1,"#000000",a]])}
    </linearGradient>
    <linearGradient id=${e.id("endShade")} x1="0" y1="0" x2="1" y2="0">
      ${Pe([[0,"#000000",0],[1,"#000000",1]])}
    </linearGradient>
    <linearGradient id=${e.id("tubeV")} x1="0" y1="0" x2="1" y2="0">${je(Cd)}</linearGradient>
    <linearGradient id=${e.id("tubeH")} x1="0" y1="1" x2="0" y2="0">${je(Cd)}</linearGradient>
    <linearGradient id=${e.id("capV")} x1="0" y1="0" x2="1" y2="0">
      ${je([[0,"#6f7275"],[.18,"#b6b9bb"],[.5,"#d3d5d6"],[.8,"#a9acae"],[1,"#6b6e71"]])}
    </linearGradient>
    <linearGradient id=${e.id("louverTop")} x1="0" y1="0" x2="0" y2="1">${je(p)}</linearGradient>
    <linearGradient id=${e.id("louverFace")} x1="0" y1="0" x2="0" y2="1">${je(u)}</linearGradient>
    <linearGradient id=${e.id("band")} x1="0" y1="0" x2="0" y2="1">
      ${je([[0,"#1d1d1e"],[.6,"#2b2b2c"],[1,"#3a3a3b"]])}
    </linearGradient>
    <linearGradient id=${e.id("kick")} x1="0" y1="0" x2="0" y2="1">
      ${je([[0,"#8d8e8f"],[.16,"#9c9d9e"],[.7,"#a1a2a3"],[1,"#959697"]])}
    </linearGradient>
    <linearGradient id=${e.id("kickBlack")} x1="0" y1="0" x2="0" y2="1">
      ${je([[0,"#0f1011"],[.25,"#1e1f20"],[1,"#18191a"]])}
    </linearGradient>
    <linearGradient id=${e.id("tint")} x1="0" y1="0" x2="0" y2="1">${Pe(l)}</linearGradient>
    <linearGradient id=${e.id("sheen")} x1="0" y1="0" x2="0" y2="1">
      ${Pe([[0,"#ffffff",.08],[.3,"#ffffff",0],[.7,"#000000",0],[1,"#000000",.06]])}
    </linearGradient>
    <linearGradient id=${e.id("niche")} x1="0" y1="0" x2="0" y2="1">
      ${je([[0,"#0e0f10"],[.3,"#1f2123"],[1,"#2c2e31"]])}
    </linearGradient>
    <linearGradient id=${e.id("wood")} x1="0" y1="0" x2="0" y2="1">
      ${je([[0,"#e2bf98"],[.45,"#cfa077"],[1,"#a8774f"]])}
    </linearGradient>
    <linearGradient id=${e.id("cyl")} x1="0" y1="0" x2="1" y2="0">
      ${Pe([[0,"#000000",.45],[.22,"#000000",.05],[.34,"#ffffff",.35],[.46,"#ffffff",.05],[.8,"#000000",.12],[1,"#000000",.5]])}
    </linearGradient>
    <linearGradient id=${e.id("ice")} x1="0" y1="0" x2="0" y2="1">
      ${je([[0,"#fbfdfe"],[.3,"#e9f0f3"],[.6,"#d7e2e8"],[1,"#a7bac5"]])}
    </linearGradient>
    <linearGradient id=${e.id("shadeDown")} x1="0" y1="0" x2="0" y2="1">
      ${Pe([[0,"#000000",0],[1,"#000000",.2]])}
    </linearGradient>
    <linearGradient id=${e.id("binLight")} x1="0" y1="0" x2="0" y2="1">
      ${Pe([[0,"#ffffff",.14],[.45,"#ffffff",0],[1,"#000000",.14]])}
    </linearGradient>
    <linearGradient id=${e.id("depthL")} x1="0" y1="0" x2="1" y2="0">
      ${Pe([[0,"#000000",0],[1,"#000000",.2]])}
    </linearGradient>
    <linearGradient id=${e.id("depthR")} x1="0" y1="0" x2="1" y2="0">
      ${Pe([[0,"#000000",.2],[1,"#000000",0]])}
    </linearGradient>
    <linearGradient id=${e.id("depthT")} x1="0" y1="0" x2="0" y2="1">
      ${Pe([[0,"#000000",.04],[1,"#000000",.22]])}
    </linearGradient>
    <linearGradient id=${e.id("depthB")} x1="0" y1="0" x2="0" y2="1">
      ${Pe([[0,"#000000",.16],[1,"#000000",0]])}
    </linearGradient>
    <radialGradient id=${e.id("floor")} cx="0.5" cy="0.5" r="0.5">
      ${Pe([[0,"#000000",An(e.theme)],[.55,"#000000",i?.32:.13],[1,"#000000",0]])}
    </radialGradient>
    <radialGradient id=${e.id("pool")} cx="0.5" cy="0.5" r="0.5">
      ${Pe([[0,"#fff6e4",i?.32:.18],[1,"#fff6e4",0]])}
    </radialGradient>
    <radialGradient id=${e.id("glare")} cx="0.5" cy="0" r="0.75">
      ${Pe([[0,"#ffffff",.55],[1,"#ffffff",0]])}
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
    ${n.wood?Sm(e):v}
    <filter id=${e.id("blur")} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.2" />
    </filter>
    <filter id=${e.id("pill")} x="-30%" y="-60%" width="160%" height="220%">
      <feGaussianBlur stdDeviation="1.4" />
    </filter>
    <filter id=${e.id("mute")} color-interpolation-filters="sRGB">
      <feColorMatrix type="saturate" values="0.78" />
    </filter>
    ${Pt(e.id("offline"),zm)}
  </defs>`}function Sm(e){return h`<filter id=${e.id("woodF")} x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
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
      ${Pe([[0,"#000000",0],[.3,"#000000",.08],[.5,"#000000",0],[.8,"#000000",.08],[1,"#000000",0]])}
    </linearGradient>
    <pattern id=${e.id("grainW")} patternUnits="userSpaceOnUse" x="-120" width="900" height="640" patternTransform="scale(1 1.4)">
      <rect width="900" height="640" fill="#ffffff" />
      <rect width="900" height="640" filter=${e.ref("woodF")} />
    </pattern>`}function Rm(e,t=1){let n=d(e.x),r=d(e.y),o=d(e.x+e.w),i=d(e.y+e.h);return h`<path d=${`M${n+1.2} ${r+.6}H${o-1.2}`} stroke="#fff" stroke-opacity=${.62*t} stroke-width="1.1" />
    <path d=${`M${n+.5} ${r+1.2}V${i-1.2}`} stroke="#fff" stroke-opacity=${.14*t} stroke-width="0.9" />
    <path d=${`M${o-.5} ${r+1.2}V${i-1.2}`} stroke="#000" stroke-opacity=${.2*t} stroke-width="1" />
    <path d=${`M${n+1.2} ${i-.7}H${o-1.2}`} stroke="#000" stroke-opacity=${.32*t} stroke-width="1.3" />`}function pn(e,t,n={}){let{kind:r,wood:o}=e.finish,i=n.radius??1.4,a={x:d(t.x),y:d(t.y),w:d(t.w),h:d(t.h)},s=e.ref(n.grain==="h"?"grainH":"grainV"),l=e.layout.undercounter?.04:.015,p=r==="stainless"?h`<rect x=${a.x} y=${a.y} width=${a.w} height=${a.h} rx=${i} fill=${s} opacity=${l} />`:r==="black"?h`<rect x=${a.x} y=${a.y} width=${a.w} height=${a.h} rx=${i} fill=${s} opacity="0.05" />`:o?h`<rect x=${a.x} y=${a.y} width=${a.w} height=${a.h} rx=${i} fill=${e.ref("grainW")} opacity="0.5" style="mix-blend-mode:multiply" />
              <rect x=${a.x} y=${a.y} width=${a.w} height=${a.h} rx=${i} fill=${e.ref("woodDrift")} />`:v;return h`<rect x=${a.x} y=${a.y} width=${a.w} height=${a.h} rx=${i} fill=${e.ref("face")} />
    ${p}
    <rect x=${a.x} y=${a.y} width=${a.w} height=${a.h} rx=${i} fill=${e.ref("faceX")} />
    ${Rm(t,n.edgeStrength??(r==="panel"?.6:1))}`}var ue=(e,t,n={})=>h`<rect x=${d(e.x)} y=${d(e.y)} width=${d(e.w)} height=${d(e.h)} rx=${n.rx??0} fill=${t} opacity=${n.opacity??1} />`;function Am(e,t){let i={x:t.x+1.6,y:t.y+1.6,w:t.w-3.2,h:t.h-1.6-2.8},a=i.h/5,s=[];for(let u=0;u<5;u++){let f=i.y+u*a,m=u===4,y=a*.48,g=m?a-y:a*.36,_=[.18,.12,.06][u]??0;s.push(h`${ue({x:i.x,y:f,w:i.w,h:y},e.ref("louverTop"))}
      ${ue({x:i.x,y:f+y,w:i.w,h:g},e.ref("louverFace"))}
      ${m?v:ue({x:i.x,y:f+y+g,w:i.w,h:a-y-g},"#090909")}
      ${_?ue({x:i.x+i.w*.9,y:f,w:i.w*.1,h:y+g},e.ref("endShade"),{opacity:_}):v}
      <path d=${`M${d(i.x)} ${d(f+.5)}H${d(i.x+i.w)}`} stroke="#fff" stroke-opacity="0.55" stroke-width="0.8" />
      <path d=${`M${d(i.x)} ${d(f+y)}H${d(i.x+i.w)}`} stroke="#000" stroke-opacity="0.25" stroke-width="0.6" />
      <path d=${`M${d(i.x+i.w-3.5)} ${d(f+y)}L${d(i.x+i.w)} ${d(f+y+g)}V${d(f+y)}Z`} fill="#000" opacity="0.28" />`)}let l=t.x+t.w,p=t.y+t.h;return h`<g>
    ${ue(t,"#1a1a1a")}
    ${s}
    ${ue(i,e.ref("grainH"),{opacity:.045})}
    ${ue({x:t.x,y:t.y,w:t.w,h:1.6},"#cfd0d1")}
    ${ue({x:t.x,y:t.y,w:1.6,h:t.h},"#bcbdbe")}
    ${ue({x:l-1.6,y:t.y,w:1.6,h:t.h},"#a9aaab")}
    ${ue({x:t.x,y:p-2.8,w:t.w,h:2.8},"#c7c8c9")}
    <path d=${`M${d(t.x)} ${d(t.y+.4)}H${d(l)}`} stroke="#fff" stroke-opacity="0.7" stroke-width="0.8" />
    <path d=${`M${d(t.x)} ${d(p-2.8+.4)}H${d(l)}`} stroke="#fff" stroke-opacity="0.55" stroke-width="0.7" />
    <path d=${`M${d(t.x)} ${d(p-.4)}H${d(l)}`} stroke="#000" stroke-opacity="0.35" stroke-width="0.8" />
    <path d=${`M${d(t.x+.4)} ${d(t.y)}V${d(p)}M${d(l-.4)} ${d(t.y)}V${d(p)}`} stroke="#000" stroke-opacity="0.3" stroke-width="0.8" />
  </g>`}function Tm(e,t){let n={x:t.x+12,y:t.y+7,w:t.w-24,h:t.h-9},r=n.w*.86,o=n.x+(n.w-r)/2,i=[24,44,64].map(s=>{let l=n.y+s;return h`<rect x=${d(o)} y=${d(l)} width=${d(r)} height="8" rx="4" fill="#202122" />
      <rect x=${d(o+2)} y=${d(l+.6)} width=${d(r-4)} height="3" rx="1.5" fill="#000" opacity="0.7" />
      <path d=${`M${d(o+4)} ${d(l+8.7)}H${d(o+r-4)}`} stroke="#fff" stroke-opacity="0.6" stroke-width="0.8" />`}),a=s=>h`<rect x=${d(s-15)} y=${d(n.y+84)} width="30" height="9" rx="1.5" fill="#3b3e41" />
      <rect x=${d(s-15)} y=${d(n.y+84)} width="30" height="9" rx="1.5" fill="none" stroke="#000" stroke-opacity="0.4" stroke-width="0.8" />
      <rect x=${d(s-10)} y=${d(n.y+87.5)} width="20" height="2" rx="1" fill="#d9e2ea" opacity="0.35" />`;return h`<g>
    ${pn(e,t,{grain:"v",radius:.6})}
    <rect x=${d(n.x-1.2)} y=${d(n.y-1.2)} width=${d(n.w+2.4)} height=${d(n.h+2.4)} rx="1" fill="#1a1a1a" />
    ${pn(e,n,{grain:"h",radius:.6})}
    ${i}
    ${a(n.x+n.w*.08)}
    ${a(n.x+n.w*.92)}
  </g>`}function Dd(e){let t=e.layout;if(!t.grille)return h``;let n=t.band?t.band.h-_a:0,r=t.top==="slots"?Tm(e,t.grille):e.finish.kind==="panel"?pn(e,{x:t.grille.x,y:t.grille.y,w:t.grille.w,h:t.grille.h+n-.6},{radius:.8}):Am(e,t.grille);return h`${r}${t.band?Mm(e,t,t.band):v}`}var _a=3;function Mm(e,t,n){let r=e.finish.kind!=="stainless",o=e.finish.kind==="panel"?{x:n.x,y:n.y+n.h-_a,w:n.w,h:_a}:n,i=o.h<4,a=[ue(o,e.ref("band"))];if(t.top==="louvers"){let s=t.fronts.filter(u=>u.kind==="door"&&Math.abs(u.rect.y-t.span.y0)<.6),l=i?o.y+.8:o.y+2.2,p=i?1.4:2.4;for(let u of s){let f=u.hinge==="left",m=f?u.rect.x:u.rect.x+u.rect.w,y=f?1:-1,g=f?m:m-4,_=f?m+9:m-33;if(a.push(h`<rect x=${d(g)} y=${d(o.y+.6)} width="4" height=${d(o.h-1)} rx="1" fill=${e.ref(r?"capV":"tubeV")} opacity=${r?.7:1} />
        <rect x=${d(_)} y=${d(l)} width="24" height=${p} rx="0.7" fill=${r?"#3a3b3c":"#d9dadb"} />
        ${r?v:h`<path d=${`M${d(_)} ${d(l+p)}h24`} stroke="#000" stroke-opacity="0.5" stroke-width="0.6" />`}`),u.rect.w>150&&!i){let b=m+y*98;a.push(h`<rect x=${d(b-7)} y=${d(o.y+2.4)} width="14" height="3.4" rx="1.6" fill="#474849" />
          ${r?v:h`<path d=${`M${d(b-6)} ${d(o.y+2.8)}h12`} stroke="#fff" stroke-opacity="0.25" stroke-width="0.5" />`}`)}}for(let u=1;u<s.length;u++){let f=s[u-1].rect;if(s[u].rect.y!==f.y)continue;let m=(f.x+f.w+s[u].rect.x)/2;a.push(r?h`<rect x=${d(m-1.7)} y=${d(o.y+.6)} width="3.4" height=${d(o.h-.6)} rx="1" fill="#4a4b4c" />`:h`<rect x=${d(m-1.7)} y=${d(o.y+1.2)} width="3.4" height=${d(o.h-1.2)} rx="1.2" fill=${e.ref("capV")} opacity="0.8" />`)}}return h`${a}`}function Ld(e){let t=e.layout,n=t.band?t.band.y+t.band.h:0,r=t.kick.y;if(t.line==="pro"){let a={x:0,y:n-3,w:t.w,h:r-n+3};return h`${pn(e,a,{radius:.5})}
      ${t.fronts.map(s=>ue({x:s.rect.x-1.6,y:s.rect.y-1.6,w:s.rect.w+3.2,h:s.rect.h+3.2},"#151515",{rx:1.5}))}`}let o=[ue({x:0,y:n,w:t.w,h:r-n},"#1c1c1d")],i=t.fronts.filter(a=>a.kind==="door");for(let a=1;a<i.length;a++){let s=i[a-1].rect,l=i[a].rect;if(s.y!==l.y||l.x-(s.x+s.w)>6)continue;let p=(s.x+s.w+l.x)/2;o.push(ue({x:p-.6,y:s.y+2,w:1.2,h:Math.min(s.h,l.h)-4},"#c4c5c6",{opacity:.85}))}return h`${o}`}function Id(e){let t=e.layout,n=t.kick,r=e.finish.kind!=="stainless",o=r?e.ref("kickBlack"):e.ref("kick"),i=a=>h`${ue(a,o)}
      ${r?v:ue(a,e.ref("grainH"),{opacity:.05})}
      ${ue({x:a.x,y:a.y,w:a.w,h:Math.min(t.line==="classic"?3:2,a.h)},"#000",{opacity:.1})}
      <path d=${`M${d(a.x)} ${d(a.y+a.h-.5)}H${d(a.x+a.w)}`} stroke="#000" stroke-opacity="0.45" stroke-width="1" />`;if(t.line==="pro"){let s={x:36,y:n.y+4,w:t.w-72,h:n.h-4},l=[0,t.w-36].map(p=>{let u=p===0?36:t.w-36,f=p===0?`M0 ${n.y}H${u}V${n.y+8}L${u-6} ${n.y+n.h}H0Z`:`M${t.w} ${n.y}H${u}V${n.y+8}L${u+6} ${n.y+n.h}H${t.w}Z`;return h`<path d=${f} fill=${e.ref("steel")} />
        <path d=${f} fill=${e.ref("grainV")} opacity="0.12" />
        <path d=${f} fill="#000" opacity="0.12" />`});return h`${ue(s,"#2a2b2c")}
      ${ue({x:s.x,y:s.y,w:s.w,h:8},"#000",{opacity:.4})}
      ${ue({x:0,y:n.y,w:t.w,h:4},"#3a3b3c")}
      ${l}`}if(t.line==="classic"){let a=[ue({x:0,y:n.y,w:t.w,h:1},"#2a2a2a"),i({x:7,y:n.y+1,w:t.w-14,h:n.h-1})];for(let s of t.fronts){if(s.kind!=="door"||Math.abs(s.rect.y+s.rect.h-n.y)>.6)continue;let l=s.hinge==="left",p=l?s.rect.x:s.rect.x+s.rect.w,u=l?1:-1,f=`M${p} ${n.y}h${u*50}l${u*3} 5v5h${-u*14}l${-u*4} -3H${p}Z`,m=l?p:p-4.2;a.push(h`<path d=${f} fill="#141414" />
        <path d=${`M${p} ${n.y+.6}h${u*50}`} stroke="#fff" stroke-opacity="0.22" stroke-width="0.7" />
        <g opacity="0.85">
          <rect x=${d(m)} y=${d(n.y+.4)} width="4.2" height="5" rx="1" fill=${e.ref("capV")} />
          <rect x=${d(m)} y=${d(n.y+6)} width="4.2" height="5" rx="1" fill=${e.ref("capV")} />
        </g>`)}return h`${a}`}return h`${ue({x:0,y:n.y,w:t.w,h:1},"#151515")}${i({x:5,y:n.y+1,w:t.w-10,h:n.h-1})}`}function Vd(e){let t=e.layout;if(t.line!=="pro")return h``;let n=[];for(let r of t.fronts){if(r.kind!=="door")continue;let o=r.hinge==="left"?-4:t.w-8;for(let i of[r.rect.y+8,r.rect.y+r.rect.h-78])n.push(h`<rect x=${o+2} y=${d(i+3)} width="12" height="70" rx="2" fill="#000" opacity="0.3" filter=${e.ref("blur")} />
        <rect x=${o} y=${d(i)} width="12" height="70" rx="2.5" fill=${e.ref("tubeV")} />
        <path d=${`M${o+1} ${d(i+.8)}h10M${o+1} ${d(i+69.2)}h10`} stroke="#000" stroke-opacity="0.35" stroke-width="0.8" />`)}return h`${n}`}function gr(e){return e.handle==="pro"?12.5:e.layout.line==="designer"?7:10}function $a(e){let t=e.layout;return t.line==="pro"?19:t.line==="designer"&&!t.undercounter?18:15}function yr(e,t){if(e.handle==="none")return null;let n=e.layout,r=t.rect;if(t.handle==="top"){let[l,p]=n.line==="pro"?[.68,36]:n.undercounter?[.85,14]:n.line==="classic"?[.87,24]:[.92,15],u=r.w*l;return{orient:"h",x:r.x+(r.w-u)/2,y:r.y+p,len:u}}let o=$a(e),i=t.hinge==="left"?r.x+r.w-o:r.x+o,[a,s]=[r.y+49,r.y+r.h-46];return n.undercounter?[a,s]=[r.y+35,r.y+r.h-37]:n.line==="pro"?[a,s]=[r.y+74,r.y+r.h-74]:n.line==="designer"&&([a,s]=r.h>700?[r.y+166,r.y+r.h-164]:[r.y+150,r.y+r.h-16]),{orient:"v",x:i,y:a,len:s-a}}function Cm(e,t){let n=e.handle==="pro",r=gr(e),o=25,i=t.orient==="v",a=n?17:r,s=n?.6:1,l=i?{x:t.x-a/2+s,y:t.y+2.4,w:a,h:t.len}:{x:t.x+s,y:t.y-a/2+2.4,w:t.len,h:a},p=n?h`<rect x=${-r/2} y=${o*.5} width=${r} height=${d(t.len-o)} fill=${e.ref("tubeV")} />
        <path d=${`M${r*.11} ${o*.5}V${d(t.len-o*.5)}`} stroke="#fff" stroke-opacity="0.7" stroke-width="0.8" />
        ${[0,t.len-o].map(f=>h`<rect x="-8.5" y=${d(f)} width="17" height=${o} rx="3.6" fill=${e.ref("capV")} />
            <rect x="-8.5" y=${d(f)} width="17" height=${o} rx="3.6" fill=${e.ref("grainV")} opacity="0.12" />
            <path d=${`M-6 ${d(f+.7)}H6`} stroke="#fff" stroke-opacity="0.65" stroke-width="0.8" />
            <path d=${`M-6 ${d(f+o-.7)}H6`} stroke="#000" stroke-opacity="0.35" stroke-width="0.9" />`)}`:h`<rect x=${-r/2} y="0" width=${r} height=${d(t.len)} rx=${d(r*.18)} fill=${e.ref("tubeV")} />
        <rect x=${-r/2} y="0" width=${r} height="2.4" rx=${d(r*.14)} fill="#000" opacity="0.2" />
        <rect x=${-r/2} y=${d(t.len-2.4)} width=${r} height="2.4" rx=${d(r*.14)} fill="#000" opacity="0.32" />
        <path d=${`M${d(r*.09)} 3.2V${d(t.len-3.2)}`} stroke="#fff" stroke-opacity="0.7" stroke-width=${d(r*.07)} />`,u=i?`translate(${d(t.x)} ${d(t.y)})`:`translate(${d(t.x)} ${d(t.y)}) rotate(-90)`;return h`<rect x=${d(l.x)} y=${d(l.y)} width=${d(l.w)} height=${d(l.h)} rx=${d(a/2)} fill="#000" opacity="0.18" filter=${e.ref("blur")} />
    <g transform=${u}>${p}</g>`}function Gm(e,t){let n=t.rect,r=t.hinge==="right",o=n.x+(r?35:6),i=n.x+n.w-(r?6:35),a=Math.min(100,i-o-24),s=(o+i)/2-a/2,l=s+a/2,p=n.y+n.h*.3,u=150,f=2.5,m=[];for(let g=0;g<3;g++)for(let _=s+14+g%2*2.5;_<s+a-13;_+=5)m.push(h`<circle cx=${d(_)} cy=${d(p+u-19+g*3.6)} r="0.8" fill="#0b0c0d" />`);let y=g=>h`<rect x=${d(g)} y=${d(p+40)} width="18" height="44" rx="2.2" fill="#2b2d30" />
      <path d=${`M${d(g+1.2)} ${d(p+41)}H${d(g+16.8)}M${d(g+.8)} ${d(p+42)}V${d(p+82)}`} stroke="#fff" stroke-opacity="0.22" stroke-width="0.6" />
      <rect x=${d(g)} y=${d(p+80)} width="18" height="4" rx="1.6" fill="#000" opacity="0.25" />`;return h`<g>
    <rect x=${d(s)} y=${d(p-24)} width=${d(a)} height="13" rx="2" fill="#121314" />
    ${[.3,.5,.7].map(g=>h`<circle cx=${d(s+a*g)} cy=${d(p-17.5)} r="1.6" fill="#8fa3b5" opacity="0.4" />`)}
    ${pn(e,{x:s-f,y:p-f,w:a+2*f,h:u+2*f},{grain:"h",radius:7,edgeStrength:.8})}
    <rect x=${d(s)} y=${d(p)} width=${d(a)} height=${u} rx="6" fill=${e.ref("niche")} />
    <rect x=${d(s)} y=${d(p)} width=${d(a)} height="22" rx="6" fill=${e.ref("shadeDown")} transform=${`rotate(180 ${d(l)} ${d(p+11)})`} opacity="0.9" />
    <circle cx=${d(l)} cy=${d(p+7)} r="5" fill="#ffd9a0" opacity="0.25" filter=${e.ref("blur")} />
    <circle cx=${d(l)} cy=${d(p+7)} r="1.5" fill="#ffe7c2" />
    <ellipse cx=${d(l)} cy=${d(p+26)} rx="7" ry="4" fill="#050505" stroke="#5a5d60" stroke-opacity="0.6" stroke-width="0.8" />
    ${y(l-20)}
    ${y(l+2)}
    <rect x=${d(s+8)} y=${d(p+u-24)} width=${d(a-16)} height="16" rx="2" fill="#2f3134" />
    ${m}
    <rect x=${d(s+6)} y=${d(p+u-8)} width=${d(a-12)} height="3" rx="1.2" fill=${e.ref("tubeH")} />
  </g>`}function Em(e,t,n,r){let o=t.window,i=e.id(`w${n}`),a=t.contents==="food",s={x:d(o.x),y:d(o.y),w:d(o.w),h:d(o.h)},l=s.x+s.w,p=s.y+s.h;return h`<clipPath id=${i}><rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} /></clipPath>
    <rect x=${s.x-1} y=${s.y-1} width=${s.w+2} height=${s.h+2} rx="0.6" fill="#1d1d1d" opacity="0.85" />
    <g clip-path=${`url(#${i})`}>
      <g filter=${a?v:e.ref("mute")}>${Uo(e,t,{glass:!0,state:r})}</g>
      <rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill=${e.ref("tint")} opacity=${a?.4:1} />
      <rect x=${s.x} y=${s.y} width=${s.w} height=${s.h} fill=${e.ref("sheen")} />
      <rect x=${s.x} y=${s.y} width=${s.w} height="7" fill="#000" opacity="0.35" />
    </g>
    <path d=${`M${d(s.x-1.6)} ${d(s.y-1.3)}H${d(l+1.3)}M${d(s.x-1.3)} ${d(s.y-1.6)}V${d(p+1.3)}`} stroke="#fff" stroke-opacity="0.35" stroke-width="0.6" />
    <path d=${`M${d(s.x-1)} ${d(p+1.3)}H${d(l+1.6)}M${d(l+1.3)} ${d(s.y-1)}V${d(p+1.6)}`} stroke="#000" stroke-opacity="0.25" stroke-width="0.6" />`}function Wo(e,t,n,r){let o=yr(e,t);return h`<g>
    ${pn(e,t.rect)}
    ${t.window?Em(e,t,n,r):v}
    ${t.dispenser?Gm(e,t):v}
    ${o?Cm(e,o):v}
  </g>`}function Hd(e,t){let{w:n,h:r}=e.layout,o=e.theme==="dark";return h`<ellipse cx=${d(n/2)} cy=${d(r+1)} rx=${d(n*.62)} ry=${d(t*.012)} fill=${e.ref("floor")} />
    <rect x="3" y=${d(r-1.5)} width=${d(n-6)} height="3" rx="1.5" fill="#000" opacity=${o?.6:.32} filter=${e.ref("blur")} />`}var Pd=8.5,Om={narrow:/[-°.,: ]/,narrowEm:.38},Fd=(e,t,n)=>`translate(${d(e)} ${d(t)}) scale(${Ro(n)})`,Pm={fill:"rgb(20,22,25)",fillOpacity:.6,stroke:"#fff",strokeOpacity:.22},Nd=(e,t)=>Ao(e.ref("pill"),-t/2,-ne/2,t,d,Pm),Dm={on:"ice",max:"ice-max",night:"ice-night"},Lm=e=>e?So+(e==="on"?0:5):0;function jd(e,t,n,r,o,i){let a=Vi(r,Om),s=i?4:0,l=Pd*2+a+s+Lm(i),p=-l/2+Pd;return h`<g class=${e.id("readout")} transform=${Fd(t,n,o)}>
    ${Nd(e,l)}
    <text x=${d(p+a/2)} y="0" dominant-baseline="central" text-anchor="middle" font-size=${nr} font-weight="600" fill="#fff" style=${Li}>${r}</text>
    ${i?rr(Dm[i],d(p+a+s+So/2),0):v}
  </g>`}var Im={making:"ice",paused:"pause",cleaning:"cleaning"};function Bd(e,t,n,r,o){return h`<g class=${e.id("readout")} transform=${Fd(t,n,r)}>
    ${Nd(e,ne)}
    ${rr(Im[o],0,0)}
  </g>`}function Kd(e){return e.finish.kind==="panel"?dn(e.finish.color,-.18):e.finish.kind==="black"?"#26282a":"#a9abad"}var Vm=113*Math.PI/180,Hm=95*Math.PI/180;function Ud(e,t,n){let{x:r,y:o,w:i,h:a}=t.rect,s=t.hinge==="left",l=s?r:r+i,p=e.layout.undercounter?Hm:Vm,u=Math.cos(p),f=Math.sin(p),m=e.layout.undercounter?22:26,y=t.window!==null,g=y||t.contents==="ice"?0:e.layout.undercounter?30:40,_=(I,L,H)=>{let N=I*u-L*f;return Ye(e.camera,s?l+N:l-N,H,I*f+L*u)},b=(I,L)=>Ze(e.camera,I*f+L*u),$=(I,L,H,N,Z)=>[_(I,H,N),_(L,H,N),_(L,H,Z),_(I,H,Z)],w=$(0,i,-m,o,o+a),k=[_(i,-m,o),_(i,0,o),_(i,0,o+a),_(i,-m,o+a)],x=[...w,...k],z=[],R=y||t.contents==="ice",T=e.id(`sp${n}`);if(z.push(h`<linearGradient id=${T} x1=${s?1:0} y1="0" x2=${s?0:1} y2="0">
      <stop offset="0" stop-color="#fffaf0" stop-opacity="0.45" />
      <stop offset="1" stop-color="#fffaf0" stop-opacity="0" />
    </linearGradient>
    ${y?v:h`<path d=${B(w)} fill=${R?"#202224":"#868d92"} />`}`),y){let I=t.window,L=s?I.x-r:r+i-(I.x+I.w),H=$(L,L+I.w,-m,I.y,I.y+I.h),N=$(6,i-6,-m,o+6,o+a-6);z.push(h`<path d=${B(w)+B(H)} fill="#1f1c19" fill-rule="evenodd" />
      <path d=${B(N)+B(H)} fill="#2e2924" fill-rule="evenodd" />
      <path d=${B(H)} fill="#1c1611" fill-opacity="0.5" stroke="#0b0a09" stroke-opacity="0.85" stroke-width="1.6" />
      <path d=${B(H)} fill=${e.ref("sheen")} />`)}else{let I=$(9,i-9,-m,o+9,o+a-9);z.push(h`<path d=${B(I)} fill=${R?"#3a3d40":"#d9dee1"} />
      <path d=${B(I)} fill=${`url(#${T})`} />`)}if(g){let I=a>500?5:a>300?3:2,L=e.layout.undercounter?34:44,H=12,N=i-12,Z=-m-g,me=rt(n*13+5),xe=t.contents==="freezer"?mr(e):ga(e).filter((ce,W)=>W!==3&&W!==4&&W!==8),ee=-m-g*.55,ae=(ce,W,j,X,we)=>h`<path d=${`M${d(ce[0])} ${d(ce[1])}L${d(W[0])} ${d(W[1])}`} stroke=${j} stroke-opacity=${X} stroke-width=${we} />`,Fe=(ce,W)=>[_(ce,-m,W),_(ce,Z,W),_(ce,Z,W+L),_(ce,-m,W+L)];for(let ce=0;ce<I;ce++){let W=o+a*.09+ce*(a*.8-L)/Math.max(1,I-1),j=[];for(let et=H+14;et<N-10;et+=30+me()*16){let wt=xe[Math.floor(me()*xe.length)](me);if(wt.h>L*2.4)continue;let[de,Ie]=_(et,ee,W+L-3);j.push(jt(de,Ie,b(et,ee),wt.draw))}let X=$(H,N,Z,W,W+L),we=[_(H,-m,W+L),_(N,-m,W+L),_(N,Z,W+L),_(H,Z,W+L)],fe=Fe(N,W);x.push(...X),z.push(h`<path d=${B(we)} fill="#000" opacity="0.1" />
        <path d=${B(Fe(H,W))} fill="#e6eef1" fill-opacity="0.18" />
        ${j}
        <path d=${B(fe)} fill="#e6eef1" fill-opacity="0.24" stroke="#ffffff" stroke-opacity="0.3" stroke-width="0.6" />
        <path d=${B(X)} fill="#eaf1f4" fill-opacity="0.3" />
        <path d=${B($(H,N,Z,W+L*.45,W+L))} fill="#ffffff" fill-opacity="0.16" />
        <path d=${B($(H,N,Z,W+L-2.5,W+L))} fill="#ffffff" fill-opacity="0.45" />
        <path d=${B($(H,N,Z,W,W+3.5))} fill="#f6f9fa" fill-opacity="0.88" />
        ${ae(_(H,Z,W+3.5),_(N,Z,W+3.5),"#6f8089",.35,.6)}
        ${ae(X[3],X[2],"#8a9ba4",.5,.9)}
        ${ae(fe[0],fe[1],"#ffffff",.7,.9)}
        ${ae(fe[1],fe[2],"#ffffff",.6,.8)}`)}}z.push(h`<path d=${B(k)} fill=${Kd(e)} />
    <path d=${B(k)} fill=${e.ref("faceX")} />
    <path d=${`M${d(k[1][0])} ${d(k[1][1])}L${d(k[2][0])} ${d(k[2][1])}`} stroke="#000" stroke-opacity="0.3" stroke-width="1" />
    <path d=${`M${d(k[0][0])} ${d(k[0][1])}L${d(k[3][0])} ${d(k[3][1])}`} stroke="#fff" stroke-opacity="0.35" stroke-width="0.8" />`);let S=yr(e,t);if(S&&S.orient==="v"){let I=e.handle==="pro",L=i-$a(e),H=I?30:26,N=_(L,H,S.y),Z=_(L,H,S.y+S.len),me=gr(e)*b(L,H),xe=[S.y+14,S.y+S.len-14].map(ee=>{let ae=[_(L,1,ee-5),_(L,H-3,ee-5),_(L,H-3,ee+5),_(L,1,ee+5)];return h`<path d=${B(ae)} fill="#8f9295" />`});x.push(N,Z),z.push(h`${xe}
      <rect x=${d(N[0]-me/2)} y=${d(N[1])} width=${d(me)} height=${d(Z[1]-N[1])} rx=${d(me/4)} fill=${e.ref("tubeV")} />`)}let C=Math.max(w[2][1],w[3][1],k[2][1]),M=[...w,...k].map(([I])=>I),O=Math.min(...M),P=Math.max(...M);x.push([O,C+5],[P,C+5]);let U=h`<ellipse cx=${d((O+P)/2)} cy=${d(C+1.5)} rx=${d((P-O)/2+4)} ry="3" fill="#000" opacity=${e.theme==="dark"?.5:.24} filter=${e.ref("blur")} />`;return{back:h``,front:h`<g>${U}${z}</g>`,points:x}}function Wd(e,t,n,r){let o=t.rect,i=Nt(e.camera,o,.75*e.layout.depth),a=i.w/o.w,s={...i,y:i.y+Math.min(6,o.h*.05),k:a},l={x:o.x+6,y:o.y+3,w:o.w-12,h:o.h-5},p=[l.x+4,l.y+2],u=[l.x+l.w-4,l.y+2],f=[s.x+7*a,s.y+1],m=[s.x+s.w-7*a,s.y+1],y=5,g=[f[0]+y*a,f[1]],_=[m[0]-y*a,m[1]],b=[p[0]+y*.8,p[1]],$=[u[0]-y*.8,u[1]],w={x:g[0],y:l.y,w:_[0]-g[0],h:s.y-l.y},k=t.contents==="freezer",x=t.contents==="beverage"||t.contents==="wine",z=k?"#e6edf1":x?"#3a302a":"#eef2f3",R=x?"#2c2420":"#d4dce0",T=e.id(`dq${n}`),S=[b,$,_,g],C=h`<rect x=${d(o.x)} y=${d(o.y)} width=${d(o.w)} height=${d(o.h)} fill="#232527" />
    <rect x=${d(l.x)} y=${d(l.y)} width=${d(l.w)} height=${d(l.h)} fill="#0f1011" />
    <clipPath id=${T}><path d=${B(S)} /></clipPath>
    <path d=${B(S)} fill=${z} />
    <g clip-path=${`url(#${T})`}>
      <rect x=${d(l.x)} y=${d(l.y)} width=${d(l.w)} height="8" fill="#000" opacity="0.22" />
      ${Md(w,t.contents,n*7+3,e)}
    </g>
    <path d=${B([p,b,g,f])} fill=${R} />
    <path d=${B([p,b,g,f])} fill=${e.ref("depthL")} />
    <path d=${B([$,u,m,_])} fill=${R} />
    <path d=${B([$,u,m,_])} fill=${e.ref("depthR")} />
    <path d=${`M${d(p[0])} ${d(p[1])}L${d(f[0])} ${d(f[1])}M${d(u[0])} ${d(u[1])}L${d(m[0])} ${d(m[1])}`} stroke="#ffffff" stroke-opacity="0.55" stroke-width="0.8" />`,M=`translate(${d(s.x)} ${d(s.y)}) scale(${Math.round(a*1e3)/1e3}) translate(${d(-o.x)} ${d(-o.y)})`,O=s.y+s.h,P=h`<rect x=${d(s.x+6)} y=${d(O-5)} width=${d(s.w-12)} height="11" fill="#000" opacity="0.34" filter=${e.ref("blur")} />
    <g transform=${M}>${Wo(e,t,n,r)}</g>`;return{back:C,front:P,points:[[s.x,s.y],[s.x+s.w,O+10]],moved:s}}var Fm=10,Nm=26,qd=10,Zd=.03,Yd=e=>{if(e.spec.family!=="refrigeration")return null;let t=hd(e.spec),n=jm(e,t),r=e.state,o=t.fronts.map(w=>w.keys.some(k=>r.doors[k]===!0)),i=[],a=[],s=[],l=new Map,p=new Set;t.fronts.forEach((w,k)=>{if(!o[k]){s.push(Wo(n,w,k,r));return}let x=Xd(n,w,k,r);if(l.set(k,x),w.kind==="door"){if(!p.has(w.cavityId)){p.add(w.cavityId);let z=t.fronts.filter(R=>R.cavityId===w.cavityId);i.push(Um(Km(z.map(R=>R.rect)),w)),i.push(Uo(n,w,{glass:!1,state:r}))}}else i.push(x.back);a.push(x.front)});let{reach:u,y0:f,y1:m}=Bm(n,t,r,l),y={x:-u,y:f,w:t.w+2*u,h:m-f},g=gt(y.h,e.pixelHeight),_=t.fronts.filter((w,k)=>o[k]&&w.kind==="door").map(w=>h`<ellipse cx=${d(w.rect.x+w.rect.w/2)} cy=${d(t.h+1)} rx=${d(w.rect.w*.75)} ry=${d((m-t.h)*.7)} fill=${n.ref("pool")} />`),b=!r.available,$=Jm(e.t,t,o,r);return A`<svg
    viewBox=${[y.x,y.y,y.w,y.h].map(d).join(" ")}
    preserveAspectRatio="xMidYMax meet"
    role="img"
    aria-label=${$}
    xmlns="http://www.w3.org/2000/svg"
  >
    ${Od(n)}
    ${e.reducedMotion?v:h`<style>${`.${n.id("readout")}{transition:opacity .25s ease}`}</style>`}
    ${Hd(n,y.h)}
    ${_}
    <g filter=${b?n.ref("offline"):v} opacity=${b&&n.theme==="dark"?.85:1}>
      ${Ld(n)}
      ${Dd(n)}
      ${Id(n)}
      ${Vd(n)}
      ${s}
      ${i}
      ${a}
    </g>
    <g opacity=${b?.7:1}>${qm(n,t,o,l,r,g)}</g>
  </svg>`};function jm(e,t){let n=new Ve(e.uid),r=t.fronts.some(a=>a.kind==="drawer"),o=t.undercounter?r?{cx:t.w/2,cy:t.h-560,d:2200}:{cx:t.w/2,cy:t.span.y1/2,d:2200}:{cx:t.w/2,cy:t.h-470,d:2200},i={...o,d:t.undercounter?1e3:1150};return{id:a=>n.id(a),ref:a=>n.url(a),layout:t,finish:Gd(e.appearance),handle:e.appearance.handle,camera:o,inside:i,theme:e.theme}}function Xd(e,t,n,r){return t.kind==="door"?Ud(e,t,n):Wd(e,t,n,r)}function Bm(e,t,n,r){let o=Nm,i=-Fm,a=t.h;return t.fronts.forEach((s,l)=>{if(s.keys.length)for(let[p,u]of(r.get(l)??Xd(e,s,l,n)).points)o=Math.max(o,-p+qd,p-t.w+qd),i=Math.min(i,u-6),a=Math.max(a,u+2)}),{reach:o,y0:i,y1:Math.max(a,t.h+Zd*(t.h-i)/(1-Zd))}}function Km(e){let t=Math.min(...e.map(i=>i.x)),n=Math.min(...e.map(i=>i.y)),r=Math.max(...e.map(i=>i.x+i.w)),o=Math.max(...e.map(i=>i.y+i.h));return{x:t,y:n,w:r-t,h:o-n}}function Um(e,t){let n=t.contents==="wine"||t.contents==="beverage"||t.contents==="ice";return h`<rect x=${d(e.x)} y=${d(e.y)} width=${d(e.w)} height=${d(e.h)} fill=${n?"#2a2522":"#dfe4e6"} />
    <rect x=${d(e.x)} y=${d(e.y)} width=${d(e.w)} height=${d(e.h)} fill="none" stroke="#000" stroke-opacity="0.25" stroke-width="1.2" />`}function Wm(e){return e.ice?.on?e.ice.mode==="max"?"max":e.ice.mode==="night"?"night":"on":null}function qm(e,t,n,r,o,i){let a=ne*i,s=[];return t.fronts.forEach((l,p)=>{let u=l.rect,f=l.kind==="door"?l.hinge==="left"?1:-1:0,m=u.x+u.w/2-f*18,y=n[p]&&l.kind==="door"?Xm(l,a):null;for(let g of l.zones){let _=o.readouts[g.zone];if(!_||g.openOnly&&!n[p])continue;let b=g.openOnly?Qm(e,l,a):l.kind==="drawer"?Ym(Zm(e,l,r.get(p),a),l,r,a):g.top!==void 0?{x:g.x??m,y:g.top+.8*a}:y??{x:g.x??m,y:u.y+u.h*(g.at??.15)},$=l.ice&&g.zone==="frz"?Wm(o):null;s.push(jd(e,b.x,b.y,_,i,$))}if(l.contents==="ice"&&o.ice_maker){let g=o.ice_maker.cleaning?"cleaning":o.ice_maker.paused?"paused":o.ice_maker.making?"making":null,_=y??{x:m,y:u.y+u.h*.2};g&&s.push(Bd(e,_.x,_.y,i,g))}}),s}function Zm(e,t,n,r){let o=t.rect,i=yr(e,t),a=i?i.y-o.y+gr(e)/2:o.h*.12,s=n?.moved??{...o,k:1};return{x:s.x+o.w/2*s.k,y:s.y+a*s.k+.25*r+r/2}}function Ym(e,t,n,r){let o=e.y;for(let i of n.values()){let a=i.moved;if(!a||a.y>=t.rect.y)continue;let s=a.y+a.h;s>o-r/2&&(o=s+.25*r+r/2)}return{x:e.x,y:o}}function Xm(e,t){let n=e.cavity;return{x:n.x+n.w/2,y:n.y+Math.max(t,.1*n.h)}}function Qm(e,t,n){let[r]=Ad(e,t);return r?{x:r.x+r.w/6,y:r.y+.8*n}:{x:t.cavity.x+t.cavity.w/2,y:t.cavity.y+t.cavity.h*.8}}function Jm(e,t,n,r){let o=new Set;return t.fronts.forEach((i,a)=>{n[a]&&o.add(e(`drawing.open.${i.name}`))}),We(e,[e(`drawing.refrigeration.${t.name}`),...o,r.available?null:e("drawing.offline")])}var Se=298.75,eg=285,tg=508.75,ot=49.5,qo=221.5,Aa=1.3,ng=1.7,Ta=18,_r=24;function Qd(e){return Se*ke(e??30,24,36)/30}function xa(e,t){return e>Se/2?e+(t-Se):e}function Ma(e,t){return t.style??e.style??"professional"}function Zo(e,t){return Ma(e,t)==="professional"&&(e.knob||e.series==="m"||e.series===null)}function Jd(e,t=Se){let n={top:0,height:ot},r={top:ot+Aa,height:qo},o=e?[r,{top:r.top+qo+ng,height:qo}]:[r],i=e?tg:eg,a=o[o.length-1],s=a.top+a.height;return{width:t,height:i,panel:n,doors:o,vent:{top:s,height:i-s}}}var Bt=e=>[Se/2-e,Se/2+e],[ba,wa]=Bt(97.25),[rg,og]=Bt(116.5),[va,ka]=Bt(127.4),[ig,ag]=Bt(127.9),[sg,lg]=Bt(136.5),[za,Sa]=Bt(105.9),[cg,dg]=Bt(112.5),[pg,ug]=Bt(102.3);function ep(e,t,n=Se){let r=fg(e,t);if(n===Se)return r;let o=i=>({...i,u0:xa(i.u0,n),u1:xa(i.u1,n)});return{...r,glass:o(r.glass),window:o(r.window),handle:o(r.handle),frameLine:r.frameLine&&o(r.frameLine)}}function fg(e,t){let n=t==="m";return e==="contemporary"?{glass:{u0:0,u1:Se,v0:15.8,v1:qo},window:{u0:ba,u1:wa,v0:43.5,v1:178.2},bevel:0,recess:0,handle:{kind:"strip",u0:0,u1:Se,v:7.9,size:15.8},frameLine:null}:e==="transitional"?n?{glass:{u0:za,u1:Sa,v0:1,v1:178.5},window:{u0:za+9,u1:Sa-9,v0:43.5,v1:172},bevel:0,recess:0,handle:{kind:"slim",u0:pg,u1:ug,v:16.9,size:6},frameLine:{u0:cg,u1:dg,v0:-42.7,v1:185.4}}:{glass:{u0:0,u1:Se,v0:44.2,v1:178.5},window:{u0:va,u1:ka,v0:44.2,v1:178.5},bevel:0,recess:0,handle:{kind:"slim",u0:sg,u1:lg,v:16.5,size:6},frameLine:null}:n?{glass:{u0:ba,u1:wa,v0:43.5,v1:178.2},window:{u0:ba,u1:wa,v0:43.5,v1:178.2},bevel:9.4,recess:0,handle:{kind:"pro",u0:rg,u1:og,v:17,size:12.8},frameLine:null}:{glass:{u0:va,u1:ka,v0:44.2,v1:178.5},window:{u0:va,u1:ka,v0:44.2,v1:178.5},bevel:0,recess:4.5,handle:{kind:"pro",u0:ig,u1:ag,v:16.5,size:12.8},frameLine:null}}var Ra={x:120.4,y:10.7,width:58,height:27.3},Ca=2.3;function Ga(e){return{...Ra,x:Ra.x+(e-Se)/2}}function Ea(e){let t=Ra.x-Ca;return(t+(e-Se)/2)/t}function Oa(e,t){let n=Ea(t);return e<Se/2?e*n:e+(t-Se)+(Se-e)*(1-n)}var $r=24.3,br=10.5,Pa=15.2,tp=[74.3,224.45],np=[44.2,88.2,210.55,254.55];function rp(e){return{u0:za,u1:xa(Sa,e),top:12.6}}function op(e){let t=e-Se;return[[19.6,141.7+t/2],[157.05+t/2,279.15+t]]}function Yo(e,t,n,r){let o=e.d/(e.d-r);return[e.cx+(t-e.cx)*o,e.cy+(n-e.cy)*o]}function ap(e,t){return{shut:!0,at:(n,r)=>[e+n,t+r]}}function sp(e,t,n,r,o){let i=Math.cos(r),a=Math.sin(r),s=t+n;return{shut:!1,at(l,p,u=0){let f=n-p;return Yo(o,e+l,s-f*i+u*a,f*a+u*i)}}}function Da(e,t,n,r=!1){return{cx:e/2,cy:t+n*(r?.2:.3),d:850}}var hg=e=>e.lamp>0||e.heat>0;function lp(e,t,n=0){return[e.at(t.u0,t.v0,n),e.at(t.u1,t.v0,n),e.at(t.u1,t.v1,n),e.at(t.u0,t.v1,n)]}function _t(e,t,n,r=1,o=0){if(e.shut){let[i,a]=e.at(t.u0,t.v0);return h`<rect x=${c(i)} y=${c(a)} width=${c(t.u1-t.u0)} height=${c(t.v1-t.v0)}
      fill=${n} opacity=${r} />`}return h`<polygon points=${Y(lp(e,t,o))} fill=${n} opacity=${r} />`}function le(e,t,n,r,o,i,a,s,l=0){let[p,u]=e.at(t,n,l),[f,m]=e.at(r,o,l);return h`<line x1=${c(p)} y1=${c(u)} x2=${c(f)} y2=${c(m)} stroke=${i}
    stroke-width=${a} opacity=${s} />`}function cp(e){let t={u0:0,u1:e.width,v0:0,v1:e.height};return h`${_t(e.map,t,G(e.m.metal))}${_t(e.map,t,G(e.m.sheen))}`}function dp(e){let{m:t,map:n,design:r}=e,o=e.style!=="professional";return h`
    ${r.frameLine?mg(n,r.frameLine,e.height):v}
    ${o?_t(n,r.glass,G(t.blackGlass)):v}
    ${o?gg(n,r.glass):v}
    ${yg(e)}
    ${r.bevel?_g(t,n,r.window,r.bevel):v}
    ${r.recess?$g(t,n,r.window,r.recess):v}
    ${bg(t,n,r.handle)}
    ${le(n,.5,.4,e.width-.5,.4,"#fff",.8,.55)}
    ${le(n,.5,e.height-.4,e.width-.5,e.height-.4,"#000",.8,.3)}
  `}function mg(e,t,n){let r=Math.max(t.v0,0),o=Math.min(t.v1,n);return h`
    ${le(e,t.u0,r,t.u0,o,"#fff",.45,.45)}
    ${le(e,t.u0+.6,r,t.u0+.6,o,"#000",.4,.14)}
    ${le(e,t.u1,r,t.u1,o,"#fff",.45,.35)}
    ${le(e,t.u1-.6,r,t.u1-.6,o,"#000",.4,.14)}
    ${t.v1<=n?le(e,t.u0,t.v1,t.u1,t.v1,"#fff",.45,.42):v}
    ${t.v1<=n?le(e,t.u0,t.v1-.6,t.u1,t.v1-.6,"#000",.4,.12):v}
  `}function gg(e,t){return h`
    ${le(e,t.u0,t.v0+.4,t.u1,t.v0+.4,"#000",.8,.5)}
    ${le(e,t.u0,t.v0+1.1,t.u1,t.v0+1.1,"#fff",.5,.18)}
    ${le(e,t.u0,t.v1-.3,t.u1,t.v1-.3,"#fff",.6,.22)}
  `}function yg(e){let{m:t,map:n,design:r}=e,o=r.window,i=e.style!=="professional",a=t.ids.id(`win-${e.key}`),s=t.ids.id(`vignette-${e.key}`),[l,p]=n.at(o.u0,o.v0);return h`
    <clipPath id=${a}>
      <rect x=${c(l)} y=${c(p)} width=${c(o.u1-o.u0)} height=${c(o.v1-o.v0)} />
    </clipPath>
    <g clip-path=${G(a)}>
      ${i?v:_t(n,o,G(t.glass))}
      ${hg(e.look)?h`${up(t,Da(e.width,e.top,e.height),La(e.width,e.top,e.height),e.look,e.key)}
            <radialGradient id=${s} cx="0.5" cy="0.45" r="0.72">
              <stop offset="0.55" stop-color="#000" stop-opacity="0" />
              <stop offset="1" stop-color="#000" stop-opacity="0.7" />
            </radialGradient>
            ${_t(n,o,G(s))}
            ${_t(n,o,"#000",i?.24:.1)}
            ${_t(n,o,G(i?t.blackGlass:t.glass),i?.26:.16)}`:v}
    </g>
  `}function _g(e,t,n,r){let o={u0:n.u0-r,u1:n.u1+r,v0:n.v0-r,v1:n.v1+r},i=(a,s)=>h`<polygon points=${Y(a.map(([l,p])=>t.at(l,p)))} fill=${s} />`;return h`
    ${i([[o.u0,o.v0],[o.u1,o.v0],[n.u1,n.v0],[n.u0,n.v0]],G(e.bevelTop))}
    ${i([[o.u0,o.v0],[n.u0,n.v0],[n.u0,n.v1],[o.u0,o.v1]],G(e.bevelLeft))}
    ${i([[n.u1,n.v0],[o.u1,o.v0],[o.u1,o.v1],[n.u1,n.v1]],G(e.bevelRight))}
    ${i([[n.u0,n.v1],[n.u1,n.v1],[o.u1,o.v1],[o.u0,o.v1]],G(e.bevelBottom))}
    ${le(t,o.u0,o.v1,o.u1,o.v1,"#fff",.6,.12)}
    ${le(t,n.u0-.3,n.v0-.3,n.u1+.3,n.v0-.3,"#fff",.6,.55)}
    ${le(t,n.u0-.3,n.v0,n.u0-.3,n.v1,"#fff",.6,.45)}
    ${le(t,n.u1+.3,n.v0,n.u1+.3,n.v1,"#fff",.6,.5)}
    ${le(t,n.u0-.3,n.v1+.3,n.u1+.3,n.v1+.3,"#fff",.6,.35)}
  `}function $g(e,t,n,r){let o=(i,a)=>h`<polygon points=${Y(i.map(([s,l])=>t.at(s,l)))} fill=${a} />`;return h`
    ${o([[n.u1,n.v0],[n.u1+r,n.v0],[n.u1+r,n.v1+r],[n.u1,n.v1]],G(e.recessRight))}
    ${o([[n.u0,n.v1],[n.u1,n.v1],[n.u1+r,n.v1+r],[n.u0,n.v1+r]],G(e.recessBottom))}
    ${le(t,n.u0,n.v0+.25,n.u1,n.v0+.25,"#000",.5,.3)}
    ${le(t,n.u0+.25,n.v0,n.u0+.25,n.v1,"#000",.5,.3)}
  `}var wr=10.2,fn=8.3;function bg(e,t,n){if(n.kind==="strip")return wg(e,t,n);let r=n.size/2,[o,i]=t.at(n.u0,n.v),[a]=t.at(n.u1,n.v);return n.kind==="slim"?h`
      <rect x=${c(o+4)} y=${c(i+r+.4)} width=${c(a-o-8)} height="0.9" fill="#000"
        opacity="0.45" filter=${G(e.blurFine)} />
      <rect x=${c(o)} y=${c(i-r)} width=${c(a-o)} height=${c(r*2)} rx=${c(r*.25)}
        fill=${G(e.chrome)} />
    `:h`
    <rect x=${c(o+4)} y=${c(i+r)} width=${c(a-o-8)} height=${c(r*.9)}
      fill=${G(e.dropShadow)} opacity="0.45" />
    <rect x=${c(o+wr)} y=${c(i-r)} width=${c(a-o-wr*2)}
      height=${c(r*2)} fill=${G(e.chrome)} />
    ${ip(e,o,i,"left")}
    ${ip(e,a-wr,i,"right")}
  `}function ip(e,t,n,r){let o=wr,i=n-fn,a=n+fn,s=1.8,l=r==="left"?`M${c(t+s)} ${c(i)}H${c(t+o)}V${c(a)}H${c(t+s)}A${s} ${s} 0 0 1 ${c(t)} ${c(a-s)}V${c(i+s)}A${s} ${s} 0 0 1 ${c(t+s)} ${c(i)}Z`:`M${c(t)} ${c(i)}H${c(t+o-s)}A${s} ${s} 0 0 1 ${c(t+o)} ${c(i+s)}V${c(a-s)}A${s} ${s} 0 0 1 ${c(t+o-s)} ${c(a)}H${c(t)}Z`,p=r==="left"?t+o:t;return h`
    <path d=${l} transform="translate(0 1.2)" fill="#000" opacity="0.08" />
    <path d=${l} fill=${G(e.chrome)} />
    <path d=${l} fill="#000" opacity="0.07" />
    <path d=${l} fill=${G(r==="left"?e.capEndLeft:e.capEndRight)} />
    <line x1=${c(p)} y1=${c(i+.5)} x2=${c(p)} y2=${c(a-.5)} stroke="#000"
      stroke-width="0.4" opacity="0.25" />
  `}function wg(e,t,n){let r={u0:n.u0,u1:n.u1,v0:0,v1:n.size};return h`
    ${_t(t,r,G(e.metal))}
    ${le(t,n.u0,.6,n.u1,.6,"#fff",1.1,.7)}
    ${le(t,n.u0,2.2,n.u1,2.2,"#fff",.6,.25)}
    ${le(t,n.u0,n.size-.5,n.u1,n.size-.5,"#000",1,.55)}
  `}function La(e,t,n){return{x0:20,x1:e-20,y0:t+20,y1:t+n-7,zFront:-_r,zBack:-_r-190}}function pp(e,t=!1){let n=e.selfClean?1:e.heat,r=e.lamp,o=n>0&&!t?0:r,i=n*(1+.3*r)*(t?.3:1),a=e.selfClean?"#5a1806":"#4a1e0a",s=(p,u,f,m)=>he(he(p,u,o),f,i*m),l=(p,u,f,m)=>he(he(p,u,n),he(f,m,n),r);return{backTop:s("#06080f","#2b2a3c","#b4521a",.43),backBottom:s("#030409","#10133a",a,.24),wall:s("#04060c","#1d1a2c",a,.27),wallLit:s("#080a12","#3d3035","#b45a20",.33),floor:s("#030409","#181a57",a,.3),glow:he("#ffe2b4",e.selfClean?"#ff6a22":"#ff8f2e",n/Math.max(r+n,.001)),wire:l("#24180f","#9a6a38","#ddd3c4","#e2b47c"),bar:l("#3a2a1c","#ffb862","#f6eee2","#ffd9a0"),glint:l("#5a4030","#ffe0b0","#ffffff","#fff3d6"),shine:ke(r+.9*n**1.2),weight:r,bulb:s("#34312c","#fbfbf5","#ffd391",.35)}}var un=(e,t,n)=>{let[r,o]=e(t[0],t[1],t[2]),[i,a]=e(n[0],n[1],n[2]);return`M${c(r)} ${c(o)}L${c(i)} ${c(a)}`};function up(e,t,n,r,o,i=!1){let a=(de,Ie,Ue)=>Yo(t,de,Ie,Ue),{x0:s,x1:l,y0:p,y1:u,zFront:f,zBack:m}=n,y=pp(r,i),g=a(s,p,f),_=a(l,p,f),b=a(l,u,f),$=a(s,u,f),w=a(s,p,m),k=a(l,p,m),x=a(l,u,m),z=a(s,u,m),R=de=>e.ids.id(`${de}-${o}`),T=u-p,S=r.selfClean?1:r.heat,C=[.16,.3,.44,.58,.72,.86].map(de=>p+T*de),M=r.selfClean?[]:[.3,.58,.86].map(de=>p+T*de),O=p+T*.14,P=f-38,U=(de,Ie,Ue)=>h`
    <linearGradient id=${de} gradientUnits="userSpaceOnUse" x1=${c(Ie[0])} y1="0" x2=${c(Ue[0])} y2="0">
      <stop offset="0" stop-color=${y.wallLit} />
      <stop offset="0.45" stop-color=${y.wall} />
      <stop offset="1" stop-color=${he(y.wall,"#000000",.45)} />
    </linearGradient>`,I=w[1],L=z[1],H=h`
    ${U(R("side"),g,w)}
    ${U(R("side-r"),_,k)}
    <linearGradient id=${R("back")} gradientUnits="userSpaceOnUse" x1="0" y1=${c(I)} x2="0" y2=${c(L)}>
      <stop offset="0" stop-color=${y.backTop} />
      <stop offset="0.55" stop-color=${he(y.backTop,y.backBottom,.6)} />
      <stop offset="1" stop-color=${y.backBottom} />
    </linearGradient>
    <linearGradient id=${R("floor")} gradientUnits="userSpaceOnUse" x1="0" y1=${c(z[1])} x2="0" y2=${c($[1])}>
      <stop offset="0" stop-color=${he(y.floor,"#000000",.5)} />
      <stop offset="1" stop-color=${y.floor} />
    </linearGradient>
    <polygon points=${Y([w,k,x,z])} fill=${G(R("back"))} />
    <polygon points=${Y([g,w,z,$])} fill=${G(R("side"))} />
    <polygon points=${Y([k,_,b,x])} fill=${G(R("side-r"))} />
    ${p<t.cy?h`<polygon points=${Y([g,_,k,w])} fill=${he(y.wall,"#000000",.3)} />`:v}
    ${u>t.cy?h`<polygon points=${Y([z,x,b,$])} fill=${G(R("floor"))} />`:v}
  `,[N,Z]=a(s+(l-s)*.22,p+T*.17,m),[me,xe]=a(l-(l-s)*.22,u-T*.17,m),ee=me-N,ae=xe-Z,Fe=[0,1,2].flatMap(de=>[0,1].map(Ie=>h`<rect x=${c(N+ee*(.14+Ie*.42))} y=${c(Z+ae*(.3+de*.17))}
        width=${c(ee*.3)} height=${c(Math.max(ae*.05,1))} rx=${c(Math.max(ae*.025,.5))}
        fill="#000" opacity="0.16" />`)),ce=h`
    <rect x=${c(N)} y=${c(Z)} width=${c(ee)} height=${c(ae)} rx="6" fill=${G(R("back"))} />
    <rect x=${c(N)} y=${c(Z)} width=${c(ee)} height=${c(ae)} rx="6" fill="#000" opacity="0.1" />
    ${Fe}
    <line x1=${c(N+6)} y1=${c(Z+.4)} x2=${c(me-6)} y2=${c(Z+.4)} stroke="#fff" stroke-width="0.5"
      opacity="0.06" />
    <line x1=${c(N+6)} y1=${c(xe)} x2=${c(me-6)} y2=${c(xe)} stroke="#000" stroke-width="0.8"
      opacity="0.15" />`,W=M.map(de=>xg(a,s+4,l-4,de,f-10,m+14,y)),j=h`<radialGradient id=${R("bloom")}>
    <stop offset="0" stop-color="#fff8ea" stop-opacity="0.9" />
    <stop offset="0.3" stop-color=${y.glow} stop-opacity="0.45" />
    <stop offset="1" stop-color=${y.glow} stop-opacity="0" />
  </radialGradient>`,X=[s,l].map(de=>{let[Ie,Ue]=a(de,O,P),$n=de===s?1.2:-1.2;return h`
      <ellipse cx=${c(Ie+$n*3)} cy=${c(Ue)} rx="13" ry="16" fill=${G(R("bloom"))}
        opacity=${c(.75*r.lamp+.15*S)} />
      <ellipse cx=${c(Ie+$n)} cy=${c(Ue)} rx="1.2" ry="3" fill=${y.bulb} />`}),[we]=a((s+l)/2,p,m),fe=ke(.08*r.lamp+(i?.3:.85)*S**1.5),et=h`
    <radialGradient id=${R("glow")} gradientUnits="userSpaceOnUse" cx=${c(we)} cy=${c(I)}
      r=${c((l-s)*.42)}>
      <stop offset="0" stop-color=${y.glow} stop-opacity="0.95" />
      <stop offset="0.25" stop-color=${y.glow} stop-opacity="0.5" />
      <stop offset="0.6" stop-color=${y.glow} stop-opacity="0.08" />
      <stop offset="1" stop-color=${y.glow} stop-opacity="0" />
    </radialGradient>
    <rect x=${c(g[0])} y=${c(g[1])} width=${c(_[0]-g[0])} height=${c($[1]-g[1])}
      fill=${G(R("glow"))} opacity=${c(fe)} />`,wt=r.lamp>0&&S>0?h`
        <linearGradient id=${R("wash")} gradientUnits="userSpaceOnUse" x1="0" y1=${c(g[1])} x2="0"
          y2=${c((g[1]+$[1])/2)}>
          <stop offset="0" stop-color="#fff1d6" stop-opacity=${c(.2*r.lamp*Math.min(1,S*2))} />
          <stop offset="1" stop-color="#fff1d6" stop-opacity="0" />
        </linearGradient>
        <rect x=${c(g[0])} y=${c(g[1])} width=${c(_[0]-g[0])}
          height=${c(($[1]-g[1])/2)} fill=${G(R("wash"))} />`:v;return h`
    ${j}
    ${H}
    ${ce}
    ${et}
    ${wt}
    ${S>0&&p<t.cy?vg(e,a,n,S,r.selfClean):v}
    ${kg(a,n,C,y)}
    ${W}
    ${r.probe&&!r.selfClean?zg(a,n,M[1]??p+T*.58,y):v}
    ${X}
  `}function vg(e,t,n,r,o){let i=n.y0+3,a=n.x0+26,s=n.x1-26,l=[n.zFront-34,(n.zFront+n.zBack)/2,n.zBack+30],p=[];l.forEach((m,y)=>{let[g,_]=y%2?[s,a]:[a,s];p.push(t(g,i,m),t(_,i,m))});let u=he("#3a1609",o?"#ff6326":"#ff7d22",r),f=he("#4a1c0b",o?"#ffb070":"#ffc06a",r);return h`
    <polyline points=${Y(p)} fill="none" stroke=${u} stroke-width="5" stroke-linejoin="round"
      opacity=${c(.75*r)} filter=${G(e.blur)} />
    <polyline points=${Y(p)} fill="none" stroke=${u} stroke-width="1.9" stroke-linejoin="round" />
    <polyline points=${Y(p)} fill="none" stroke=${f} stroke-width="0.6" stroke-linejoin="round" />
  `}function kg(e,t,n,r){let o=t.zFront-12,i=t.zBack+20,a=n[0]-8,s=n[n.length-1]+5,l="";for(let p of[t.x0+2.5,t.x1-2.5]){l+=un(e,[p,a,o],[p,s,o])+un(e,[p,a,i],[p,s,i]);for(let u of n)l+=un(e,[p,u,o],[p,u,i]),l+=un(e,[p,u,o-7],[p,u+2.6,o-7]),l+=un(e,[p,u+2.6,o-7],[p,u+2.6,o])}return h`<path d=${l} fill="none" stroke=${r.wire} stroke-width=${c(.9+.3*r.weight)}
    stroke-linejoin="round" opacity=${c(.3+.55*r.shine)} />`}function xg(e,t,n,r,o,i,a){let l="";for(let u=0;u<=26;u++){let f=t+(n-t)*u/26;l+=un(e,[f,r,o],[f,r,i])}let p=u=>un(e,[t,r,u],[n,r,u]);return h`
    <path d=${p(i)+p((o+i)/2)} fill="none" stroke=${a.wire} stroke-width="0.6" opacity="0.5" />
    <path d=${l} fill="none" stroke=${a.wire} stroke-width=${c(.35+.3*a.weight)}
      opacity=${c(.32+.4*a.weight)} />
    <path d=${p(o)} fill="none" stroke="#000" stroke-width="1.3" opacity="0.35" transform="translate(0 1.2)" />
    <path d=${p(o)} fill="none" stroke=${a.bar} stroke-width=${c(1.3+.4*a.weight)}
      opacity=${c(.35+.65*a.shine)} />
    <path d=${p(o)} fill="none" stroke=${a.glint} stroke-width="0.7" stroke-linecap="round" stroke-dasharray="0.5 2"
      opacity=${c(a.shine)} />
  `}function zg(e,t,n,r){let[o,i]=e(t.x0,t.y0+(t.y1-t.y0)*.24,t.zFront-30),[a,s]=e((t.x0+t.x1)/2-12,n-6,(t.zFront+t.zBack)/2),l=`M${c(o)} ${c(i)}C${c(o+22)} ${c(i+30)} ${c(a-34)} ${c(s+6)} ${c(a)} ${c(s)}`;return h`<path d=${l} fill="none" stroke=${r.wire} stroke-width="0.5" stroke-linecap="round"
    opacity=${c(.3+.4*r.shine)} />`}function Ia(e,t,n){let r=La(n,e,t),o=Da(n,e,t,!0),[i,a]=Yo(o,r.x0,r.y0,r.zFront),[s,l]=Yo(o,r.x1,r.y1,r.zFront);return{x0:i,y0:a,x1:s,y1:l}}function fp(e){let{m:t,top:n,height:r,look:o,key:i,width:a}=e,s=La(a,n,r),l=Da(a,n,r,!0),p=t.ids.id(`opening-${i}`),{x0:u,y0:f,x1:m,y1:y}=Ia(n,r,a),g=22,_=m-u,b=y-f,$=(w,k,x,z,R)=>h`<rect x=${c(u+w)} y=${c(f+w)} width=${c(_-w*2)} height=${c(b-w*2)}
      rx=${c(g-w)} fill="none" stroke=${k} stroke-width=${x} opacity=${z}
      stroke-dasharray=${R??v} />`;return h`
    <rect x="0" y=${c(n)} width=${a} height=${c(r)} fill=${G(t.metal)} />
    <rect x="0" y=${c(n)} width=${a} height=${c(r)} fill="#000" opacity="0.2" />
    <rect x="0" y=${c(n)} width=${a} height="5" fill=${G(t.dropShadow)} />
    <clipPath id=${p}>
      <rect x=${c(u)} y=${c(f)} width=${c(_)} height=${c(b)} rx=${g} />
    </clipPath>
    <g clip-path=${G(p)}>${up(t,l,s,o,i,!0)}</g>
    ${$(0,"#8e8f90",5.5,1)}
    ${$(0,"#b4b5b6",5.5,.3,"0.5 0.7")}
    ${$(2.4,"#c3c4c5",.7,.55)}
    ${$(-2.6,"#000",.8,.35)}
  `}function hp(e){let{m:t,map:n}=e,r=_r,o=e.height,i=e.width,a=pp(e.look,!0),s={u0:26,u1:i-26,v0:16,v1:o-24},l=t.ids.id(`inner-glass-${e.key}`),p=t.ids.id(`slot-${e.key}`),u=[n.at(0,0,-r),n.at(i,0,-r),n.at(i,0,0),n.at(0,0,0)],[,f]=n.at(0,s.v1,-r),[,m]=n.at(0,s.v0,-r),y=[.18,.42,.7].map(g=>le(n,s.u0+6,s.v1-(s.v1-s.v0)*g,s.u1-6,s.v1-(s.v1-s.v0)*g,a.bar,.8,c(.62-g*.3),-r));return h`
    <linearGradient id=${l} gradientUnits="userSpaceOnUse" x1="0" y1=${c(f)} x2="0" y2=${c(m)}>
      <stop offset="0" stop-color=${he("#2c2a2a",a.glow,.42)} />
      <stop offset="0.55" stop-color=${he("#222224",a.glow,.12)} />
      <stop offset="1" stop-color="#191a1c" />
    </linearGradient>
    <linearGradient id=${p} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2b2c2e" />
      <stop offset="1" stop-color="#3d3e40" />
    </linearGradient>
    <g filter=${G(t.grain)}>
      <polygon points=${Y(lp(n,{u0:0,u1:i,v0:0,v1:o},-r))} fill=${G(t.metal)} />
      <polygon points=${Y(u)} fill=${G(t.metal)} />
    </g>
    ${_t(n,{u0:0,u1:i,v0:0,v1:o},"#fff",.1,-r)}
    ${_t(n,s,G(l),1,-r)}
    ${y}
    ${le(n,s.u0,s.v0,s.u1,s.v0,"#fff",.5,.35,-r)}
    ${le(n,0,o,i,o,"#000",.8,.45,-r)}
    <polygon points=${Y(u)} fill="#000" opacity="0.28" />
    ${Sg(n,p,i)}
    ${Rg(t,n,e.design.handle)}
  `}function Sg(e,t,n){let r=_r,o=[],i=5,a=14,s=7,l=(n-a*2-s*(i-1))/i,[,p]=e.at(0,0,-r*.73),[,u]=e.at(0,0,-r*.27),f=u-p;for(let m=0;m<i;m++){let y=a+m*(l+s),[g]=e.at(y,0,-r*.5),[_]=e.at(y+l,0,-r*.5),b=_-g;o.push(h`
      <rect x=${c(g-.7)} y=${c(p-.7)} width=${c(b+1.4)} height=${c(f+1.4)}
        rx=${c(f/2+.7)} fill="#cfd0d1" opacity="0.45" />
      <rect x=${c(g)} y=${c(p)} width=${c(b)} height=${c(f)} rx=${c(f/2)}
        fill=${G(t)} />`)}return h`
    ${o}
    <polyline points=${Y([e.at(0,0,-r),e.at(n,0,-r)])} stroke="#fff" stroke-width="0.9" opacity="0.75" />
    <polyline points=${Y([e.at(0,0,0),e.at(n,0,0)])} stroke="#000" stroke-width="0.8" opacity="0.35" />
  `}function Rg(e,t,n){if(n.kind==="strip")return h``;let r=gp(n),o=n.size/2,i=n.kind==="pro"?wr:0,[a,s]=t.at(n.u0+i,n.v,r),[l]=t.at(n.u1-i,n.v,r),p=(l-a)/(n.u1-n.u0-i*2),u=o*p,f=h`
    <rect x=${c(a)} y=${c(s-u)} width=${c(l-a)} height=${c(u*2)}
      rx=${n.kind==="slim"?c(u*.25):0} fill=${G(e.chrome)} />
    <rect x=${c(a)} y=${c(s-u)} width=${c(l-a)} height=${c(u)} fill="#000"
      opacity="0.22" />`;if(n.kind==="slim"){let y=[n.u0+6,n.u1-6].map(g=>{let[_,b]=t.at(g-1.8,n.v,0),[$,w]=t.at(g+1.8,n.v,r);return h`<rect x=${c(_)} y=${c(b)} width=${c($-_)} height=${c(w-b)}
        fill=${G(e.chrome)} />
        <rect x=${c(_)} y=${c(b)} width=${c($-_)} height=${c(w-b)} fill="#000"
          opacity="0.4" />`});return h`${y}${f}`}let m=[n.u0,n.u1-i].map((y,g)=>{let _=[t.at(y,n.v-fn,0),t.at(y+i,n.v-fn,0),t.at(y+i,n.v-fn,r+o),t.at(y,n.v-fn,r+o)];return h`
      <polygon points=${Y(_)} fill=${G(e.chrome)} />
      <polygon points=${Y(_)} fill=${G(g?e.capEndRight:e.capEndLeft)} />
      <polygon points=${Y(_)} fill="#000" opacity="0.42" />`});return h`${f}${m}`}function mp(e){let t=e.design.handle;if(t.kind==="strip")return e.map.at(0,0,0)[1];let n=gp(t),r=t.size/2,o=e.map.at(t.u0,t.v,n+r)[1],i=t.kind==="pro"?e.map.at(t.u0,t.v-fn,n+r)[1]:o;return Math.max(o,i)+1}var gp=e=>e.kind==="pro"?Ta:Ta*.75;var Kt="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",vr="font-variant-numeric: tabular-nums",Ag=6;function wp(e){let{m:t}=e;if(e.style==="contemporary")return h`
      <rect x="0" y="0" width=${e.width} height=${ot} fill=${G(t.blackGlass)} />
      <line x1="0" y1="0.4" x2=${e.width} y2="0.4" stroke="#fff" stroke-width="0.8" opacity="0.18" />
      ${Va(e,!1)}
    `;if(e.style==="transitional"&&e.series==="m"){let r=rp(e.width),o=r.u0-6.6,i=r.u1+6.6;return h`
      <line x1="0" y1="0.4" x2=${e.width} y2="0.4" stroke="#fff" stroke-width="0.8" opacity="0.5" />
      <line x1=${c(o)} y1="8.1" x2=${c(i)} y2="8.1" stroke="#fff" stroke-width="0.45" opacity="0.45" />
      <line x1=${c(o)} y1="8.7" x2=${c(i)} y2="8.7" stroke="#000" stroke-width="0.4" opacity="0.12" />
      <line x1=${c(o)} y1="8.1" x2=${c(o)} y2=${ot} stroke="#fff" stroke-width="0.45" opacity="0.45" />
      <line x1=${c(i)} y1="8.1" x2=${c(i)} y2=${ot} stroke="#fff" stroke-width="0.45" opacity="0.35" />
      <rect x=${c(r.u0)} y=${r.top} width=${c(r.u1-r.u0)} height=${c(ot-r.top)}
        fill=${G(t.blackGlass)} />
      <line x1=${c(r.u0)} y1=${r.top+.4} x2=${c(r.u1)} y2=${r.top+.4} stroke="#000" stroke-width="0.8" opacity="0.5" />
      ${Va(e,!1)}
    `}let n=e.knobs&&e.style==="professional";return h`
    <line x1="0" y1="0.4" x2=${e.width} y2="0.4" stroke="#fff" stroke-width="0.8" opacity="0.5" />
    ${n?Dg(e):Lg(e.double,e.darkFinish,e.width)}
    ${Tg(t,e.width)}
    ${Va(e,!0)}
  `}function Tg(e,t){let{x:n,y:r,width:o,height:i}=Ga(t),a=Ca;return h`
    <rect x=${n-a} y=${r-a} width=${o+a*2} height=${i+a*2} rx="0.8" fill="#fff" opacity="0.13" />
    <line x1=${n-a} y1=${r-a+.3} x2=${n+o+a} y2=${r-a+.3} stroke="#000" stroke-width="0.5" opacity="0.12" />
    <line x1=${n-a} y1=${r+i+a-.3} x2=${n+o+a} y2=${r+i+a-.3} stroke="#fff"
      stroke-width="0.6" opacity="0.5" />
    <rect x=${n} y=${r} width=${o} height=${i} fill="#2c2c2c" />
    <rect x=${n} y=${r} width=${o} height=${i} fill=${G(e.glass)} opacity="0.35" />
    <line x1=${n} y1=${r+.4} x2=${n+o} y2=${r+.4} stroke="#000" stroke-width="0.8" opacity="0.5" />
    <line x1=${n} y1=${r+i-.3} x2=${n+o} y2=${r+i-.3} stroke="#fff" stroke-width="0.4" opacity="0.12" />
  `}function Va(e,t){let{x:n,y:r,width:o,height:i}=Ga(e.width),a=e.cavities.filter(w=>w.oven.on&&w.oven.temp),s=a.length===1&&a[0].position==="single"?4.6:3.6,l=e.unitsPerPixel===null||s/e.unitsPerPixel>=Ag,p=l&&e.cavities.some(w=>w.oven.probe),u=l&&e.cavities.some(w=>w.oven.remote_ready),f=l&&e.cavities.some(w=>nt(w.oven)),m=[p?Cg:null,u?Gg:null,f?Eg:null].filter(w=>w!==null);if(!a.length&&!e.display&&!m.length)return h``;let y=t?3:1,g=n+y,_=n+o-y,b=[],$=w=>m.map((k,x)=>k(_-3.2-x*7.2,w));if(!a.length)e.display&&b.push(h`<text x=${n+o/2} y=${r+i*.62} text-anchor="middle" font-size="10.5"
        font-weight="300" fill="#f2f2f2" font-family=${Kt} style=${vr}>${e.display}</text>`),b.push(...$(r+i-4.6));else if(a.length===1&&a[0].position==="single"){let w=a[0].oven,k=!w.preheated&&w.progress!==null&&w.progress<1,x=_-g-.4-(m.length?8:0);b.push(h`
      <text x=${g} y=${r+i*.58} font-size="11.5" font-weight="300" fill="#f4f4f4"
        font-family=${Kt} style=${vr}>${w.temp}</text>
      ${w.mode&&l?yp(g+.4,r+i*.84,w.mode,4.6,x,"#c9c9c9"):v}
      ${k?_p(g,r+i-2.6,_-g,w.progress??0):v}`),e.display&&l&&b.push(h`<text x=${_} y=${r+6.6} text-anchor="end" font-size="4.8" fill="#e6e6e6"
        font-family=${Kt} style=${vr}>${e.display}</text>`),b.push(...$(r+i*.55))}else{let w=a.slice(0,2),k=(i-2)/2,x=_-(m.length?6.5:0);w.forEach((z,R)=>{let T=r+1+k*R,S=z.oven,C=!S.preheated&&S.progress!==null&&S.progress<1;b.push(h`
        ${Mg(g+.3,T+3,z.position==="lower")}
        <text x=${g+6} y=${T+k*.66} font-size="7" font-weight="300" fill="#f4f4f4"
          font-family=${Kt} style=${vr}>${S.temp}</text>
        ${S.mode&&l?yp(g+27,T+k*.64,S.mode,3.6,x-g-27,"#c9c9c9"):v}
        ${C?_p(g+6,T+k-1.2,x-g-6,S.progress??0):v}`)}),e.display&&l&&b.push(h`<text x=${x} y=${r+i-1.6} text-anchor="end" font-size="3.6" fill="#e6e6e6"
        font-family=${Kt} style=${vr}>${e.display}</text>`),m.forEach((z,R)=>b.push(z(_-2.6,r+5+R*7.6)))}return h`<g>${b}</g>`}function yp(e,t,n,r,o,i){let s=n.length*r*.56>o?c(o):null;return h`<text x=${c(e)} y=${c(t)} font-size=${r} fill=${i} font-family=${Kt}
    textLength=${s??v} lengthAdjust=${s?"spacingAndGlyphs":v}>${n}</text>`}function _p(e,t,n,r){let o=Math.max(.8,n*Math.min(1,Math.max(0,r)));return h`
    <rect x=${c(e)} y=${c(t)} width=${c(n)} height="0.9" rx="0.45" fill="#fff" opacity="0.18" />
    <rect x=${c(e)} y=${c(t)} width=${c(o)} height="0.9" rx="0.45" fill="#c8333c" />
  `}function Mg(e,t,n){return h`
    <rect x=${c(e)} y=${c(t)} width="3.6" height="2.2" rx="0.4" fill=${n?"none":"#f0f0f0"}
      stroke="#f0f0f0" stroke-width="0.45" />
    <rect x=${c(e)} y=${c(t+2.9)} width="3.6" height="2.2" rx="0.4" fill=${n?"#f0f0f0":"none"}
      stroke="#f0f0f0" stroke-width="0.45" />
  `}function Cg(e,t){return h`<g fill="none" stroke="#f0f0f0" stroke-width="0.6" stroke-linecap="round">
    <line x1=${c(e-3)} y1=${c(t+2)} x2=${c(e+1.2)} y2=${c(t-2.2)} />
    <circle cx=${c(e+2)} cy=${c(t-3)} r="1.2" fill="#f0f0f0" />
  </g>`}function Gg(e,t){return h`<g fill="none" stroke="#f0f0f0" stroke-width="0.6" stroke-linecap="round">
    <path d=${`M ${c(e-3.2)} ${c(t-1.2)} A 4.6 4.6 0 0 1 ${c(e+3.2)} ${c(t-1.2)}`} />
    <path d=${`M ${c(e-1.9)} ${c(t+.2)} A 2.7 2.7 0 0 1 ${c(e+1.9)} ${c(t+.2)}`} />
    <circle cx=${c(e)} cy=${c(t+1.8)} r="0.6" fill="#f0f0f0" stroke="none" />
  </g>`}function Eg(e,t){return h`<g fill="none" stroke="#f0f0f0" stroke-width="0.6">
    <rect x=${c(e-2.1)} y=${c(t-.6)} width="4.2" height="3.2" rx="0.5" fill="#f0f0f0" />
    <path d=${`M ${c(e-1.3)} ${c(t-.6)} V ${c(t-1.9)} A 1.3 1.3 0 0 1 ${c(e+1.3)} ${c(t-1.9)} V ${c(t-.6)}`} />
  </g>`}var Og=[[-120,"MORE"],[-90,"ROAST"],[-60,"BROIL"],[-30,"BAKE"],[0,"OFF"],[30,"CONV"],[60,"C ROAST"],[90,"WARM"],[120,"GOURMET"]],Pg=[[-52,"LO"],[-36,"\xB7"],[-22,"\xB7"],[0,"TEMP"],[22,"\xB7"],[36,"\xB7"],[52,"HI"]];function Dg(e){let t=(e.double?np:tp).map(s=>Oa(s,e.width)),n=Math.min(1,Math.sqrt(Ea(e.width))),r=(e.double?br*.975:br)*n,o=r*(Pa/br)+1.5,i=s=>e.cavities.find(p=>p.position===s)?.oven.on?-30:0,a=e.double?[{mode:t[0],temp:t[1],angle:i("upper"),caption:"UPPER OVEN"},{mode:t[2],temp:t[3],angle:i("lower"),caption:"LOWER OVEN"}]:[{mode:t[0],temp:t[1],angle:i("single"),caption:null}];return h`${a.map(s=>h`
      ${bp(s.mode,$r,o,Og,e.darkFinish)}
      ${bp(s.temp,$r,o,Pg,e.darkFinish)}
      ${s.caption?kp((s.mode+s.temp)/2,40.2,s.caption,e.darkFinish):v}
      ${$p(e.m,s.mode,$r,r,s.angle,e.reducedMotion,e.width)}
      ${$p(e.m,s.temp,$r,r,0,e.reducedMotion,e.width)}`)}`}function $p(e,t,n,r,o,i,a){let s=r*(Pa/br),l=(s+r)/2,p=`transform-origin: ${t}px ${n}px; transform: rotate(${o}deg);${i?"":" transition: transform 400ms ease;"}`,u=r*.335,f=(m,y,g)=>{let _=b=>{let $=b*Math.PI/180;return`${c(t+g*Math.cos($))} ${c(n+g*Math.sin($))}`};return`M ${_(m)} A ${g} ${g} 0 0 1 ${_(y)}`};return h`
    <circle cx=${t} cy=${n+.9} r=${s+.5} fill="#000" opacity="0.06" />
    <circle cx=${t} cy=${n} r=${l} fill="none" stroke=${G(e.metal)} stroke-width=${c(s-r)} />
    <circle cx=${t} cy=${n} r=${l} fill="none" stroke=${G(t<a/2?e.bezelRight:e.bezelLeft)}
      stroke-width=${c(s-r)} />
    <circle cx=${t} cy=${n} r=${c(s+.4)} fill="none" stroke="#000" stroke-width="0.5" opacity="0.22" />
    <circle cx=${t} cy=${n} r=${c(r+.95)} fill="none" stroke="#fff" stroke-width="1" opacity="0.18" />
    <path d=${f(195,345,r+.9)} fill="none" stroke="#fff" stroke-width="0.6" stroke-linecap="round" opacity="0.4" />
    <circle cx=${t} cy=${n} r=${r} fill=${G(e.knob)} />
    <circle cx=${t} cy=${n} r=${c(r+.15)} fill="none" stroke="#000" stroke-width="0.7" opacity="0.5" />
    <path d=${f(200,340,r-.4)} fill="none" stroke=${G(e.knobRim)} stroke-width="0.8" stroke-linecap="round"
      opacity="0.6" />
    <g style=${p}>
      <rect x=${c(t-u)} y=${c(n-r*.94)} width=${c(u*2)} height=${c(r*1.88)}
        rx=${c(r*.2)} fill=${G(e.knob)} />
      <line x1=${c(t+u-.4)} y1=${c(n-r*.84)} x2=${c(t+u-.4)} y2=${c(n+r*.84)}
        stroke="#000" stroke-width="0.8" opacity="0.18" />
      <line x1=${c(t-u+.35)} y1=${c(n-r*.84)} x2=${c(t-u+.35)} y2=${c(n+r*.84)}
        stroke="#fff" stroke-width="0.6" opacity="0.12" />
    </g>
  `}var vp=e=>e?"#d4d5d6":"#2a2c2f";function bp(e,t,n,r,o){return h`${r.map(([i,a])=>h`<text x=${e} y=${c(t-n)} transform=${`rotate(${i} ${e} ${t})`}
      text-anchor="middle" font-size=${a==="\xB7"?2.6:1.85} font-weight="600" letter-spacing="0.03"
      fill=${vp(o)} opacity=${o?.6:.92} font-family=${Kt}>${a}</text>`)}`}function kp(e,t,n,r,o=1.85){return h`<text x=${c(e)} y=${c(t)} text-anchor="middle" font-size=${o} font-weight="600"
    letter-spacing="0.03" fill=${vp(r)} opacity=${r?.6:.92} font-family=${Kt}>${n}</text>`}function Lg(e,t,n){let r=["BAKE","ROAST","BROIL","WARM","CLEAN"],o=["CONV","C ROAST","PROOF","GOURMET","MORE"],i=[],a=(s,l,p,u)=>i.push(kp(Oa(s,n),l,p,t,u));if(r.forEach((s,l)=>a(19.3+l*13.4,20.3,s)),o.forEach((s,l)=>a(19.3+l*13.4,30.2,s)),e)for(let[s,l]of[[84.5,!0],[97.5,!1]])a(s,19.4,l?"UPPER":"LOWER",1.6),a(s,21.3,"ON",1.6),a(s,29.3,l?"UPPER":"LOWER",1.6),a(s,31.2,"OFF",1.6);else a(94.9,30.2,"OFF");a(203.4,20.3,"CLEAR"),a(203.4,29.3,"START",1.6),a(203.4,31.2,"ENTER",1.6);for(let s=0;s<5;s++)a(228.3+s*12.7,20.4,String(s+1),2.2),a(228.3+s*12.7,30.3,String((s+6)%10),2.2);return h`${i}`}var Ig=88*Math.PI/180,kr={x:8,top:4,bottom:16},xp=e=>{let t=e.spec;if(t.family!=="wall_oven")return null;let n=t.form==="double",r=Ma(t,e.appearance),o=t.series==="m"||t.series===null?"m":"e",i=Fg(e.appearance.finish),a=Ng(t,n),s=Qd(t.width??a[0].width),l=Jd(n,s),p=Po(new Ve(e.uid)),u=ep(r,o,s),f=e.reducedMotion??!1,m=a.map(S=>({position:zp(S),oven:e.state.ovens?.[S.prefix]??Ha})),y=l.doors.map((S,C)=>{let M=m[C]?.oven??Ha;return{m:p,map:M.door_open?sp(0,S.top,S.height,Ig,Hg(S.top,s)):ap(0,S.top),design:u,style:r,width:s,height:S.height,look:Bg(M),top:S.top,key:String(C)}}),g=y.filter(S=>!S.map.shut),_=Math.max(l.height,...g.map(mp)),b=c(_+kr.top+kr.bottom),$=[-kr.x,-kr.top,c(s+kr.x*2),b].join(" "),w=e.state.available,k=Wg(e,n,a),x=Zo(t,e.appearance),z=gt(b,e.pixelHeight),R={shadow:G(p.pillShadow),fix:c},T=w?y.flatMap((S,C)=>{let M=Mo(m[C]?.oven??Ha);return M?[To(R,Vg(S),M,z,f)]:[]}):[];return A`<svg
    viewBox=${$}
    role="img"
    aria-label=${k}
    style="overflow: visible"
  >
    ${h`
      <defs>${Do(p,{finish:i,knobs:e.appearance.knobs,x:0,y:0,width:s,height:l.height,parts:{glass:r==="professional"||r==="transitional"&&o==="e",blackGlass:r!=="professional",caps:u.handle.kind==="pro",knob:x,bezel:x,bevel:u.bevel>0,recess:u.recess>0,dropShadow:u.handle.kind==="pro"||g.length>0,fineBlur:u.handle.kind==="slim",pills:T.length>0,offline:!w}})}</defs>
      ${fc(p,s/2,_+3,s*.56,8,e.theme)}
      <g filter=${w?v:G(p.offline)}>
        <g filter=${G(p.grain)}>
          <rect x="0" y="0" width=${s} height=${ot} fill=${G(p.metal)} />
          <rect x="0" y="0" width=${s} height=${ot} fill=${G(p.sheen)} />
          ${y.filter(S=>S.map.shut).map(S=>cp(S))}
          <rect x="0" y=${c(l.vent.top)} width=${s} height=${c(l.vent.height)}
            fill=${G(p.metal)} />
        </g>
        ${Kg(l)}
        ${wp({m:p,width:s,darkFinish:i!=="stainless",style:r,series:o,double:n,knobs:x,cavities:m,display:e.state.display??null,reducedMotion:f,unitsPerPixel:e.pixelHeight?b/e.pixelHeight:null})}
        ${y.map(S=>S.map.shut?dp(S):v)}
        ${Ug(p,l)}
        ${g.map(S=>fp(S))}
        ${g.map(S=>hp(S))}
      </g>
      ${T}
    `}
  </svg>`};function zp(e){return e.position==="lower"?"lower":e.position==="upper"?"upper":"single"}function Vg(e){if(!e.map.shut)return Ia(e.top,e.height,e.width);let t=e.design.window;return{x0:t.u0,y0:e.top+t.v0,x1:t.u1,y1:e.top+t.v1}}var Ha={on:!1,preheated:!1,progress:null,light:!1,door_open:!1,probe:!1,remote_ready:!1,self_clean:!1,temp:null,mode:null};function Hg(e,t){return{cx:t/2,cy:e-110,d:2200}}function Fg(e){return e==="black"||e==="carbon"?e:"stainless"}function Ng(e,t){return e.ovens.length===(t?2:1)?e.ovens:t?[{prefix:"cav",position:"upper",width:null},{prefix:"cav2",position:"lower",width:null}]:[{prefix:"cav",position:"single",width:null}]}var jg={clean:1,preheated:1,start:.25,span:.75,unknown:.6};function Bg(e){return{lamp:e.light||e.door_open?1:0,heat:rn(e,jg),selfClean:nt(e),probe:e.probe}}function Kg(e){let t=e.doors.map((n,r)=>{let o=e.doors[r-1],i=o?o.top+o.height:ot;return{top:i,height:n.top-i}});return h`${t.map(n=>h`
      <rect x="0" y=${c(n.top)} width=${e.width} height=${c(Math.max(n.height,Aa))}
        fill="#161718" />
      <line x1="0" y1=${c(n.top-.3)} x2=${e.width} y2=${c(n.top-.3)} stroke="#000"
        stroke-width="0.6" opacity="0.25" />`)}`}function Ug(e,t){let n=t.vent.top,r=t.height,o=n+2,i=t.width,a=op(i),[[s,l],[p,u]]=a,f=[[o+.6,2.7],[o+3.9,2.9]],m=(y,g,_,b,$)=>h`<rect x=${c(y)} y=${c(_)} width=${c(g-y)} height=${c(b)} fill=${$} />`;return h`
    ${m(8,i-8,n,2,"#0b0b0c")}
    ${m(0,8,n,2,"#8e9092")}
    ${m(i-8,i,n,2,"#8e9092")}
    <rect x="0" y=${c(o)} width=${i} height="0.6" fill="#f2f2f2" opacity="0.85" />
    ${m(0,s+2,o+.6,6.2,"#8e9092")}
    ${m(u-2,i,o+.6,6.2,"#8e9092")}
    ${m(l-2,p+2,o+.6,3.1,"#a3a5a7")}
    ${m(l-2,p+2,o+3.7,3.1,"#8b8d8f")}
    ${a.map(([y,g])=>f.map(([_,b])=>h`<rect x=${c(y)} y=${c(_)} width=${c(g-y)} height=${b}
          rx=${b/2} fill="#0b0b0c" />`))}
    <rect x="0" y=${c(o+3.3)} width=${i} height="0.6" fill="#f4f4f4" opacity="0.9" />
    <line x1="0" y1=${c(o+7)} x2=${i} y2=${c(o+7)} stroke="#fff" stroke-width="0.5"
      opacity="0.5" />
    <rect x="0" y=${c(o+6.8)} width=${i} height=${c(r-o-6.8)} fill=${G(e.chrome)}
      opacity="0.35" />
    <line x1="0" y1=${c(r-.4)} x2=${i} y2=${c(r-.4)} stroke="#000"
      stroke-width="0.8" opacity="0.4" />
  `}function Wg(e,t,n){let{t:r,state:o}=e,i=n.map(a=>({position:zp(a),state:o.ovens?.[a.prefix]}));return We(r,[r(t?"drawing.wall_oven_double":"drawing.wall_oven"),o.available?null:r("drawing.offline"),...on(r,i,o.display)])}var qg={refrigeration:Yd,range:pd,wall_oven:xp,hood:Pc,dishwasher:tc};function Sp(e){return qg[e.spec.family]?.(e)??Eo(e)}function Zg(e){return`option.${e.toLowerCase().replace(/[^a-z0-9]+/g,"_")}`}function oe(e,t){let n=Zg(t),r=e(n);return r===n?t:r}function Te(e){let t=e?.state;return t===void 0||t===""||t==="unavailable"||t==="unknown"?null:t}var Yg=["sensor","binary_sensor","number","select","switch","climate","button","fan","light","event"];function F(e,t,...n){for(let r of n.length?n:Yg){let o=Te(e.state(t,r));if(o!==null)return o}return null}function E(e,t,...n){let r=F(e,t,...n.length?n:["binary_sensor","switch"]);return r==="on"?!0:r==="off"?!1:null}function Q(e){if(typeof e=="number")return Number.isFinite(e)?e:null;if(typeof e!="string"||e.trim()==="")return null;let t=Number(e);return Number.isFinite(t)?t:null}function Me(e,t,...n){return Q(F(e,t,...n))}function D(e,t,...n){return e.entityId(t,...n)!==void 0}function hn(e,t,n){return Math.min(n,Math.max(t,e))}function Ut(e,t){let n={};for(let r of t)D(e,r,"binary_sensor")&&(n[r]=E(e,r,"binary_sensor")===!0);return n}function Wt(e,t){return t.some(n=>E(e,n,"binary_sensor")===!0)}function In(e,t){let n=t?.attributes?.unit_of_measurement;return typeof n=="string"&&n||e.config?.unit_system?.temperature||"\xB0F"}function Xg(e){return In(e).includes("C")}function Na(e){return e.includes("C")?"C":e.includes("F")?"F":e.trim()==="K"?"K":null}function Cp(e,t,n){let r=Na(t),o=Na(n);if(e===null||!r||!o)return null;if(r===o)return e;let i=r==="C"?e:r==="F"?(e-32)*5/9:e-273.15;return o==="C"?i:o==="F"?i*9/5+32:i+273.15}function Gp(e){let t=Na(e);return t==="C"?21:t==="K"?294:70}function De(e){if(e===null)return"\u2014";let t=Math.round(e);return`${t===0?0:t}\xB0`}function be(e){if(typeof e!="string"||!e)return null;let t=Date.parse(e);return Number.isNaN(t)?null:t}var Rp={comma_decimal:["en-US","en"],decimal_comma:["de","es","it"],space_comma:["fr","sv","cs"],quote_decimal:["de-CH"],system:void 0},Ap=new Map;function ja(e,t,n=0,r=0){let o=e.locale?.number_format,i=o==="none"?"en-US":o&&o in Rp?Rp[o]:xn(e),a=`${o}|${String(i)}|${r}|${n}`,s=Ap.get(a);if(!s){let l={minimumFractionDigits:r,maximumFractionDigits:n,...o==="none"?{useGrouping:!1}:{}};try{s=new Intl.NumberFormat(i,l)}catch{s=new Intl.NumberFormat(void 0,l)}Ap.set(a,s)}return s.format(t)}function Xo(e){return e.locale?.time_zone==="server"&&e.config?.time_zone||void 0}function Qg(){try{return new Intl.DateTimeFormat(void 0,{hour:"numeric"}).resolvedOptions().hour12}catch{return}}function Ep(e){let t=e.locale?.time_format,n=Xo(e),r=t==="12"?!0:t==="24"?!1:t==="system"?Qg():void 0;return{hour:"numeric",minute:"2-digit",...r===void 0?{}:{hour12:r},...n?{timeZone:n}:{}}}function Ba(e,t,n){try{return new Intl.DateTimeFormat(xn(e),t).format(n)}catch{return new Intl.DateTimeFormat("en",{...t,timeZone:void 0}).format(n)}}function it(e,t){return Ba(e,Ep(e),t)}function Tp(e,t){return Ba(e,{year:"numeric",month:"2-digit",day:"2-digit",timeZone:Xo(e)},t)}function mn(e,t,n){return Tp(e,t)===Tp(e,n)?it(e,t):Ba(e,{month:"short",day:"numeric",...Ep(e)},t)}var Fa=e=>String(e).padStart(2,"0");function $t(e,t=!1){let n=Math.max(0,Math.ceil(e/1e3)),r=Math.floor(n/3600),o=Math.floor(n%3600/60),i=n%60;return r||t?`${r}:${Fa(o)}:${Fa(i)}`:`${o}:${Fa(i)}`}function Mt(e,t,n="auto"){let r=Math.max(0,Math.round(t/60));if(r<60)return e("unit.minutes",{n:r});if(n==="hours")return e("unit.hours",{n:Math.round(r/60)});let o=Math.floor(r/60),i=r%60;if(o<48)return i?e("unit.hours_minutes",{h:o,m:i}):e("unit.hours",{n:o});let a=Math.floor(o/24),s=o%24;return s?e("unit.days_hours",{d:a,h:s}):e("unit.days",{n:a})}var Mp={ms:.001,s:1,min:60,h:3600,d:86400};function bt(e){let t=Q(Te(e));if(t===null)return null;let n=e?.attributes?.unit_of_measurement;return t*(typeof n=="string"&&n in Mp?Mp[n]:1)}function Op(e,t){let n=Te(t);if(n===null||!t)return"\u2014";if(e.formatEntityState)try{return e.formatEntityState(t)}catch{}let r=Q(n),o=t.attributes?.unit_of_measurement,i=r===null?n:ja(e,r,1);return typeof o=="string"&&o?`${i} ${o}`:i}function at(e,t,n="pill.door_open"){let r=null;for(let i of t){if(E(e,i,"binary_sensor")!==!0)continue;let a=e.entityId(i,"binary_sensor"),s=a?e.since(a):null;s!==null&&(r===null||s<r)&&(r=s)}let o=r===null?0:Math.floor((e.now-r)/6e4);return o<1?e.t(n):e.t(`${n}_for`,{time:Mt(e.t,o*60)})}function st(e,t=" \xB7 "){let n=e.filter(r=>typeof r=="string"&&r!=="");return n.length?n.join(t):null}function Qo(e){return e===null?"\u2014":`${Math.round(e)}%`}function Jg(e,t,n=[]){for(let r of t){let o=e.appliance.locks?.[r];if(o&&!n.includes(o))return e.t(`lock.${o}`)}return null}function e0(e,t,n,r){if(!e.appliance.available)return{disabled:!0,reason:e.t("reason.offline")};let o=Jg(e,r.locks??[t],r.ignoreLocks);if(o)return{disabled:!0,reason:o};for(let i of r.reasons??[])if(i)return{disabled:!0,reason:i};return!n||n.state==="unavailable"?{disabled:!0,reason:e.t("reason.unavailable")}:{disabled:!1,reason:null}}function gn(e,t,n){let r=e.entityId(t,n);return r?{entityId:r,entity:e.hass.states[r]}:null}function lt(e,t,n,r,o={}){return{id:o.id??t,label:n,hint:o.hint??null,...e0(e,t,r,o)}}function Jo(e,t,n,r,o={}){let i=gn(e,t,"number");if(!i)return null;let a=i.entity?.attributes??{},s=Q(Te(i.entity));return{kind:"duration",...lt(e,t,n,i.entity,o),action:{type:"number",entity_id:i.entityId},value:s===null?null:Math.round(s),min:Q(a.min)??0,max:Q(a.max)??719,presets:r,...o.remaining?{remaining:!0}:{}}}function zr(e,t,n,r={}){let o=gn(e,t,"number");if(!o)return null;let i=o.entity?.attributes??{},a=Q(Te(o.entity)),s=e.state(t,"sensor");return{kind:"setpoint",...lt(e,t,n,o.entity,r),action:{type:"number",entity_id:o.entityId},value:a??Q(Te(s)),min:Q(i.min)??0,max:Q(i.max)??100,step:Q(i.step)??1,unit:In(e.hass,a===null&&Te(s)!==null?s:o.entity)}}function Pp(e){let t=Q(e?.attributes?.supported_features);return t!==null?(t&1)===1:e?.attributes?.temperature!==void 0}function ei(e,t,n,r={}){let o=gn(e,t,"climate");if(!o)return null;let i=o.entity?.attributes??{},a=!o.entity||o.entity.state==="unavailable",s=Q(i.temperature),l=s===null&&a?e.state(t,"sensor"):void 0;return{kind:"setpoint",...lt(e,t,n,o.entity,r),action:{type:"climate_temperature",entity_id:o.entityId},value:s??Q(Te(l)),min:Q(i.min_temp)??0,max:Q(i.max_temp)??100,step:Q(i.target_temp_step)??(Xg(e.hass)?.5:1),unit:In(e.hass,l)}}function ye(e,t,n,r={}){let o=gn(e,t,"select");if(!o)return null;let i=o.entity?.attributes?.options,a=Array.isArray(i)?i.filter(s=>typeof s=="string"):[];return{kind:"select",...lt(e,t,n,o.entity,r),action:{type:"select",entity_id:o.entityId},value:Te(o.entity)??r.fallback??null,options:a.map(s=>({value:s,label:oe(e.t,s)}))}}function Xe(e,t,n,r={}){let o=gn(e,t,"switch");if(!o)return null;let i=Te(o.entity);return{kind:"toggle",...lt(e,t,n,o.entity,r),action:{type:"switch",entity_id:o.entityId},value:i==="on"?!0:i==="off"?!1:null}}function ct(e,t,n,r,o={}){let i=gn(e,t,"button");return i?{kind:"action",...lt(e,t,n,i.entity,o),action:{type:"button",entity_id:i.entityId},confirm:o.confirm??null,button:r,...o.tone?{tone:o.tone}:{}}:null}function yn(e,t){let n=gn(e,t,"button");return!!(n?.entity&&n.entity.state!=="unavailable")}function K(e,t,n,r={}){return{kind:"reading",id:e,label:t,value:n??"\u2014",hint:r.hint??null,...r.tone?{tone:r.tone}:{},...r.entity_id?{entity_id:r.entity_id}:{}}}function dt(e,t,n,r=null,o={}){return{kind:"countdown",id:e,label:t,end:n,hint:r,...o.entity_id?{entity_id:o.entity_id}:{},...o.hours?{hours:!0}:{}}}function Dp(e,t){if(!(t.kind==="ice_delay"||t.kind==="action"))return"action"in t?"entity_id"in t.action?t.action.entity_id:void 0:t.entity_id??e.entityId(t.id,"sensor","binary_sensor")}function ie(e,t,n,r=!1){let o=n.filter(i=>!!i);return o.length?{id:e,title:t,controls:o,...r?{collapsed:!0}:{}}:null}function Le(e){return e.filter(t=>t!=null)}var t0=new Set(["undefined","low","medium","high","critical","urgent","unknown"]),n0=new Set(["high","critical","urgent"]);function xr(e){return typeof e=="string"&&e.trim()?e.trim():typeof e=="number"?String(e):null}function r0(e){let t=e.state("active_faults","sensor");if(!Te(t))return[];let n=t?.attributes?.faults;return Array.isArray(n)?n.filter(r=>!!r&&typeof r=="object"):[]}function o0(e){return Me(e,"active_faults","sensor")??0}function Qe(e){return E(e,"service_required","binary_sensor")===!0||o0(e)>0}function i0(e,t,n){let r=e.t,o=xr(t.code),i=xr(t.title),a=xr(t.description),s=xr(t.severity)??"unknown",l=i??a??(o?r("control.fault",{code:o}):r("control.fault_unknown")),p=st([o&&(i||a)?r("control.fault_code",{code:o}):null,i&&a&&a!==i?a:null,xr(t.resolution_steps)],`
`);return K(`fault_${n}`,l,r(`severity.${t0.has(s)?s:"unknown"}`),{tone:n0.has(s)?"alert":"warning",hint:p})}function a0(e){return e>=-50?"excellent":e>=-60?"good":e>=-70?"fair":"weak"}function Je(e){let t=e.t,n=E(e,"service_required","binary_sensor"),r=r0(e),o=Me(e,"active_faults","sensor"),i=Me(e,"ap_rssi","sensor"),a=bt(e.state("uptime","sensor")),s=[D(e,"service_required","binary_sensor")?K("service_required",t("control.service"),n===null?null:t(n?"value.required":"value.not_needed"),{tone:n?"alert":"normal"}):null,D(e,"active_faults","sensor")?K("active_faults",t("control.faults"),o===null?null:o===0?t("value.no_faults"):String(o),{tone:o?"alert":"normal"}):null,...r.map((l,p)=>i0(e,l,p)),D(e,"ap_rssi","sensor")?K("ap_rssi",t("control.wifi"),i===null?null:`${t(`wifi.${a0(i)}`)} \xB7 ${Math.round(i)} dBm`):null,D(e,"uptime","sensor")?K("uptime",t("control.uptime"),a===null?null:Mt(t,a)):null,e.appliance.model?K("model",t("control.model"),e.appliance.model):null,e.appliance.appliance_type?K("appliance_type",t("control.appliance_type"),e.appliance.appliance_type):null];return ie("details",t("section.details"),s,!(n||r.length||(o??0)>0))}var ri=["kitchen_timer","kitchen_timer2"],s0=new Set(["Broil","Convection broil","Proof","Self clean"]),l0=["unit_on","set_temp","temp","cook_mode","door_ajar","light_on","remote_ready"];function oi(e,t){return l0.some(n=>D(e,`${t}_${n}`))||D(e,`remote_start_${t}_unit_on`)}function Ip(e){return oi(e,"cav")||oi(e,"cav2")||ri.some(t=>D(e,`${t}_active`))}function Ct(e){let t=e.appliance.spec;if((t.family==="range"||t.family==="wall_oven")&&t.ovens?.length){let r=t.ovens.map(({prefix:i,position:a})=>({prefix:i,position:a})),o=r.filter(i=>oi(e,i.prefix));return o.length?o:r}let n=["cav","cav2"].filter(r=>oi(e,r));return n.length<2?n.map(r=>({prefix:r,position:"single"})):e.appliance.traits?.left_right_ovens?[{prefix:"cav2",position:"left"},{prefix:"cav",position:"right"}]:[{prefix:"cav",position:"upper"},{prefix:"cav2",position:"lower"}]}function _n(e,t){return e.t(`cavity.${t.position}`)}function c0(e,t,n,r,o,i){if(!e)return null;if(t)return 1;if(n===null||r===null)return null;for(let a of[o,i])if(a!==null&&r>a)return hn((n-a)/(r-a),0,1);return n>=r?1:0}function Sr(e,t){let n=e.state(`${t}_set_temp`,"climate"),r=F(e,`${t}_set_temp`,"climate"),o=E(e,`${t}_unit_on`,"binary_sensor")??(r!==null&&r!=="off"),i=E(e,`${t}_remote_ready`,"binary_sensor")===!0,a=!o&&i,s=E(e,`${t}_at_set_temp`,"binary_sensor")===!0,l=In(e.hass),p=Lp(e,`${t}_temp`)??{value:Q(n?.attributes?.current_temperature),unit:l},u=Lp(e,`${t}_set_temp`),f=Q(n?.attributes?.temperature),m=a&&f!==null||!u?{value:f,unit:l}:u;return{on:o,preheated:s,temperature:p.value,setpoint:m.value,mode:a?F(e,`${t}_cook_mode`,"select","sensor"):F(e,`${t}_cook_mode`,"sensor","select"),light:E(e,`${t}_light_on`,"switch","binary_sensor")===!0,door:E(e,`${t}_door_ajar`,"binary_sensor")===!0,probe:E(e,`${t}_probe_on`,"binary_sensor")===!0,remoteReady:i,progress:c0(o,s,p.value,Cp(m.value,m.unit,p.unit),e.preheatStart(t),Gp(p.unit))}}function Lp(e,t){let n=e.state(t,"sensor"),r=Q(Te(n));return r===null?null:{value:r,unit:In(e.hass,n)}}function ni(e,t){return t.mode&&t.mode!=="Off"?oe(e.t,t.mode):null}function Vp(e,t,n){let r=ni(e,n),o=F(e,`${t}_broil_level`,"sensor");return r&&o?`${r} \xB7 ${oe(e.t,o)}`:r&&n.setpoint!==null?`${r} ${De(n.setpoint)}`:r??(n.setpoint!==null?De(n.setpoint):null)}function ti(e){return Le(ri.map(t=>{if(E(e,`${t}_active`,"binary_sensor")!==!0)return null;let n=be(F(e,`${t}_end_time`,"sensor"));return n===null?null:{prefix:t,left:Math.max(0,n-e.now)}})).sort((t,n)=>t.left-n.left)}function d0(e,t,n){let r=e.t;return[n.door?r("reason.close_oven_door"):null,!n.mode||n.mode==="Off"?r("reason.choose_mode"):null,s0.has(n.mode??"")||E(e,`${t}_gourmet_mode_on`,"binary_sensor")?r("reason.manual_mode"):null,n.setpoint===null?r("reason.set_temperature"):null]}function p0(e,t){let n=e.t,r=t.prefix,o=Sr(e,r),i=o.on||o.remoteReady?null:n("reason.oven_not_ready"),a=e.entityId(`${r}_set_temp`,"climate"),s=a?e.hass.states[a]:void 0,l=`remote_start_${r}_unit_on`,p=[];if(a){let _=D(e,l,"button")?n(o.remoteReady?"reason.use_start":"reason.remote_ready_oven"):n("reason.start_at_oven");p.push({kind:"toggle",...lt(e,`${r}_unit_on`,n("control.power"),s,{id:`${r}_power`,reasons:[o.on?null:_]}),action:{type:"climate_power",entity_id:a},value:o.on,confirmOff:{text:n(`confirm.stop.${t.position}`),button:n("action.turn_off")}})}let u=s?.state==="unavailable"||Pp(s);if(!(o.on&&!u)){let _=o.mode&&o.mode!=="Off"?n("reason.no_temperature"):n("reason.choose_mode");p.push(ei(e,`${r}_set_temp`,n("control.temperature"),{hint:o.on&&o.temperature!==null?n("value.now",{temp:De(o.temperature)}):null,reasons:[i,u?null:_]}))}let f=e.appliance.traits?.knob_oven===!0&&E(e,`${r}_mode_change_enabled`,"binary_sensor")===!1;if(p.push(ye(e,`${r}_cook_mode`,n("control.cook_mode"),{reasons:[i,f?n("reason.mode_change_disabled"):null],fallback:F(e,`${r}_cook_mode`,"sensor")})),!o.on&&o.remoteReady&&D(e,l,"button")&&p.push(ct(e,l,n("control.remote_start"),n("action.start"),{confirm:n(`confirm.start.${t.position}`,{setting:Vp(e,r,o)??"\u2014"}),tone:"primary",locks:[l,`${r}_unit_on`],reasons:yn(e,l)?[]:d0(e,r,o)})),p.push(Xe(e,`${r}_light_on`,n("control.light"))),D(e,`${r}_probe_on`,"binary_sensor")){let _=E(e,`${r}_probe_at_set_temp`,"binary_sensor")===!0,b=E(e,`${r}_probe_within_10deg`,"binary_sensor")===!0;p.push(K(`${r}_probe`,n("control.probe"),o.probe?De(Me(e,`${r}_probe_temp`,"sensor")):n("value.not_connected"),{hint:o.probe?_?n("value.probe_done"):b?n("value.probe_close"):null:null,tone:o.probe&&_?"warning":"normal",entity_id:e.entityId(`${r}_probe_temp`,"sensor")})),o.probe&&p.push(zr(e,`${r}_probe_set_temp`,n("control.probe_target"),{reasons:[i]}))}let m=E(e,`${r}_cook_timer_active`,"binary_sensor")?F(e,`${r}_cook_timer_end_time`,"sensor"):null;if(E(e,`${r}_cook_timer_complete`,"binary_sensor"))p.push(K(`${r}_cook_timer`,n("control.cook_timer"),n("value.done"),{tone:"warning",entity_id:e.entityId(`${r}_cook_timer_complete`,"binary_sensor")}));else if(m){let _=E(e,`${r}_cook_timer_within_1min`,"binary_sensor");p.push(dt(`${r}_cook_timer`,n("control.cook_timer"),m,_?n("value.under_minute"):null,{entity_id:e.entityId(`${r}_cook_timer_end_time`,"sensor")}))}E(e,`${r}_gourmet_mode_on`,"binary_sensor")&&p.push(K(`${r}_gourmet`,n("control.gourmet"),F(e,`${r}_gourmet_recipe`,"sensor")??n("value.on"),{entity_id:e.entityId(`${r}_gourmet_recipe`,"sensor")??e.entityId(`${r}_gourmet_mode_on`,"binary_sensor")}));let y=F(e,`${r}_broil_level`,"sensor");y&&p.push(K(`${r}_broil_level`,n("control.broil_level"),oe(n,y)));let g=!o.on&&!o.remoteReady&&Ct(e).length>1;return ie(r,_n(e,t),p,g)}function u0(e,t){let n=e.t,r=`${t}_duration`;if(!D(e,r,"number")&&!D(e,`${t}_active`,"binary_sensor"))return null;let o=E(e,`${t}_active`,"binary_sensor")?F(e,`${t}_end_time`,"sensor"):null,i=be(o);return ie(t,n(`control.${t}`),[o?dt(`${t}_end_time`,n("control.time_left"),o,i===null?null:n("value.ends_at",{time:it(e.hass,i)})):null,Jo(e,r,n("control.duration"),[5,10,15,30,60],{remaining:!0}),E(e,`${t}_complete`,"binary_sensor")?ct(e,`dismiss_${t}`,n("control.timer_finished"),n("action.dismiss"),{locks:[`dismiss_${t}`,r]}):null])}function f0(e){let t=e.t,n=E(e,"sabbath_on","binary_sensor");return ie("settings",t("section.settings"),[ye(e,"door_ajar_timeout",t("control.door_open_delay")),D(e,"sabbath_on","binary_sensor")?K("sabbath_on",t("control.sabbath"),n===null?null:t(n?"value.on":"value.off")):null],!0)}function Ka(e){return Ct(e).map(t=>`${t.prefix}_door_ajar`)}var Rr={drawingState(e){let t={};for(let r of Ct(e)){let o=Sr(e,r.prefix);t[r.prefix]={on:o.on,preheated:o.preheated,progress:o.progress,light:o.light,door_open:o.door,probe:o.probe,remote_ready:o.remoteReady,self_clean:o.on&&o.mode==="Self clean",temp:o.on&&o.temperature!==null?De(o.temperature):null,mode:o.on?ni(e,o):null}}let n=ti(e)[0];return{available:e.appliance.available,doors:Ut(e,Ka(e)),readouts:{},ovens:t,display:n?$t(n.left):null,sabbath:E(e,"sabbath_on","binary_sensor")===!0}},status(e){let t=e.t;if(!e.appliance.available)return{text:t("pill.offline"),tone:"gray"};let n=Ct(e).map(i=>Sr(e,i.prefix));if(n.some(i=>i.on&&i.mode==="Self clean"))return{text:t("pill.self_clean"),tone:"warm"};let r=n.filter(i=>i.on&&!i.preheated&&i.progress!==null);if(r.length){let i=Math.min(99,Math.round(Math.min(...r.map(a=>a.progress??0))*100));return{text:t("pill.preheating",{pct:i}),tone:"warm"}}if(n.some(i=>i.on))return n.some(i=>i.on&&i.preheated)?{text:t("pill.preheated"),tone:"green"}:{text:t("pill.cooking"),tone:"warm"};if(Qe(e))return{text:t("pill.service"),tone:"red"};if(E(e,"sabbath_on","binary_sensor"))return{text:t("pill.sabbath"),tone:"gray"};if(n.some(i=>i.remoteReady))return{text:t("pill.remote_ready"),tone:"accent"};let o=ti(e)[0];return o?{text:t("pill.timer",{time:$t(o.left)}),tone:"accent"}:ri.some(i=>E(e,`${i}_complete`,"binary_sensor"))?{text:t("pill.timer_done"),tone:"green"}:Wt(e,Ka(e))?{text:at(e,Ka(e)),tone:"amber"}:{text:t("pill.off"),tone:"neutral"}},infoRows(e){let t=e.t,n=Ct(e),r=n.map(o=>{let i=Sr(e,o.prefix);return{label:_n(e,o),value:i.on?Vp(e,o.prefix,i)??t("value.on"):t("value.off")}});for(let o of ti(e))r.push({label:t(`control.${o.prefix}`),value:$t(o.left)});for(let o of n){if(E(e,`${o.prefix}_probe_on`,"binary_sensor")!==!0)continue;let i=Me(e,`${o.prefix}_probe_temp`,"sensor"),a=Me(e,`${o.prefix}_probe_set_temp`,"sensor","number");r.push({label:n.length>1?`${t("info.probe")} \xB7 ${_n(e,o)}`:t("info.probe"),value:a===null?De(i):`${De(i)} \u2192 ${De(a)}`})}return r.slice(0,3)},display(e){if(!e.appliance.available)return null;let t=e.t,n=Ct(e),r=n.map(i=>({cavity:i,now:Sr(e,i.prefix)})).filter(({now:i})=>i.on);if(!r.length){let i=ti(e)[0];return i?{text:$t(i.left),caption:t(`control.${i.prefix}`)}:{text:t("value.off"),caption:null}}let o=({now:i})=>De(i.temperature??i.setpoint);if(r.length===1){let[i]=r;return{text:o(i),caption:st([n.length>1?_n(e,i.cavity):null,ni(e,i.now)])}}return{text:r.map(o).join(" \xB7 "),caption:r.map(({cavity:i,now:a})=>ni(e,a)??_n(e,i)).join(" \xB7 ")}},sections(e){return Le([...Ct(e).map(t=>p0(e,t)),...ri.map(t=>u0(e,t)),f0(e),Je(e)])}};var h0=/^(lower_)?oven_(cooking_timer_complete|cooking_timer_under_one_minute|door_ajar|preheated|probe_connected|probe_target_reached|probe_within_ten_degrees|self_clean_complete)$/;function Ua(e,t){let n=new Set,r=[];for(let{state:o,attributes:i,at:a}of ao(e)){if(o==="unavailable"||o==="unknown")continue;let s=i.event_type;if(typeof s!="string"||!s)continue;let l=zn(i.appliance_timestamp)??zn(o)??a;if(l===null||l<t)continue;let p=`${l}|${s}`;n.has(p)||(n.add(p),r.push({type:s,time:l}))}return r.sort((o,i)=>i.time-o.time)}function Hp(e){if(!e)return null;let t={state:e.state,attributes:e.attributes,last_changed:e.last_changed};return Ua([t],Number.NEGATIVE_INFINITY)[0]??null}function ii(e){let t=e.appliance.spec,r=t?.family==="range"||t?.family==="wall_oven"||t?.family==="generic"&&t.form==="oven"?Ct(e):[];return r.length<2?{}:Object.fromEntries(r.map(o=>[o.prefix,_n(e,o)]))}function ai(e,t,n={}){let r=h0.exec(t),o=r?n[r[1]?"cav2":"cav"]:void 0;if(r&&o)return e("event.in_cavity",{cavity:o,event:e(`event.cavity.${r[2]}`)});let i=`event.${t}`,a=e(i);return a===i?t:a}var Za={Idle:"idle",Running:"running",Paused:"paused",Canceling:"canceling",Drying:"drying",Done:"done",Delayed:"delayed",Error:"error"},Ya=Object.fromEntries(Object.entries(Za).map(([e,t])=>[t,e])),Ar=new Set(["running","paused","canceling","drying"]),Np=["heated_dry_on","extended_dry_on","high_temp_wash_on","sani_rinse_on","top_rack_only_on"],Wa=["door_ajar"];function Vn(e){let t=F(e,"wash_status","sensor");if(t!==null&&t in Za)return Za[t];let n=E(e,"wash_cycle_on","binary_sensor");return n===null?null:n?"running":"idle"}function Hn(e,t){return t==="delayed"||E(e,"delay_start_timer_active","binary_sensor")===!0}function Xa(e){let t=F(e,"wash_cycle","sensor","select");return t===null?null:oe(e.t,t)}function m0(e){let t=Vn(e);if(t==="done")return 1;if(t===null||!Ar.has(t))return null;let n=e.entityId("wash_cycle_on","binary_sensor");if(!n)return null;let r=e.since(n),o=be(F(e,"wash_cycle_end_time","sensor"));if(r===null||o===null)return null;let i=be(F(e,"delay_start_timer_end_time","sensor")),a=i!==null&&i>r&&i<=e.now?i:r;return o<=a?null:hn((e.now-a)/(o-a),0,1)}function qa(e,t){if(Hn(e,t)){let r=be(F(e,"delay_start_timer_end_time","sensor"));return r===null?null:$t(r-e.now,!0)}if(t===null||!Ar.has(t))return null;let n=be(F(e,"wash_cycle_end_time","sensor"));return n===null?null:$t(n-e.now,!0)}function g0(e,t){let n=e.t,r=t!==null&&t!=="idle"?n("reason.dishwasher_busy"):null,o=Hn(e,t),i=t!==null&&Ar.has(t),a=i?F(e,"wash_cycle_end_time","sensor"):null,s=be(a),l=o?F(e,"delay_start_timer_end_time","sensor"):null,p=E(e,"remote_ready","binary_sensor"),u="remote_start_wash_cycle_on",f={hours:!0},m=[D(e,"wash_status","sensor")?K("wash_status",n("control.status"),t===null?null:oe(n,Ya[t]),{tone:t==="error"?"alert":"normal"}):null,a?dt("wash_cycle_end_time",n("control.time_left"),a,s===null?null:n("value.ends_at",{time:it(e.hass,s)}),f):null,l?dt("delay_start_timer_end_time",n("control.starts_in"),l,null,f):null,ye(e,"wash_cycle",n("control.wash_cycle"),{reasons:[r],fallback:F(e,"wash_cycle","sensor")}),ye(e,"delay_start_timer_duration",n("control.delay_start"))];return!i&&!o&&D(e,u,"button")&&m.push(ct(e,u,n("control.remote_start"),n("action.start"),{confirm:n("confirm.start_dishwasher",{cycle:Xa(e)??"\u2014"}),tone:"primary",locks:[u,"wash_cycle_on"],reasons:yn(e,u)?[]:[p!==!0?n("reason.remote_ready_dishwasher"):null,E(e,"door_ajar","binary_sensor")?n("reason.close_door"):null,E(e,"sabbath_on","binary_sensor")?n("lock.sabbath"):null]})),(i||o)&&m.push(ct(e,"cancel_wash_cycle",n("control.cancel_cycle"),n("action.cancel_cycle"),{confirm:n("confirm.cancel_cycle"),tone:"danger",locks:["cancel_wash_cycle","wash_cycle_on"]})),D(e,"remote_ready","binary_sensor")&&m.push(K("remote_ready",n("control.remote_ready"),p===null?null:n(p?"value.on":"value.off"))),ie("cycle",n("section.cycle"),m)}function y0(e){let t=e.t;return ie("options",t("section.options"),Np.map(n=>Xe(e,n,t(`control.${n}`))))}function _0(e,t){let n=e.t,r=t!==null&&t!=="idle"?n("reason.dishwasher_busy"):null;return ie("modes",n("section.modes"),[ye(e,"mode",n("control.dishwasher_mode"),{reasons:[r]})])}function Fp(e,t,n){if(!D(e,t,"binary_sensor"))return null;let r=E(e,t,"binary_sensor");return K(t,n,r===null?null:e.t(r?"value.low":"value.ok"),{tone:r?"warning":"normal"})}function $0(e){let t=e.t;return ie("maintenance",t("section.maintenance"),[Fp(e,"rinse_aid_low",t("control.rinse_aid")),Fp(e,"softener_low",t("control.softener"))])}var Tr={drawingState(e){let t=Vn(e);return{available:e.appliance.available,doors:Ut(e,Wa),readouts:{},sabbath:E(e,"sabbath_on","binary_sensor")===!0,dishwasher:{status:t==="idle"&&Hn(e,t)?"delayed":t??"idle",progress:m0(e),remote_ready:E(e,"remote_ready","binary_sensor")===!0,door_open:E(e,"door_ajar","binary_sensor")===!0,rinse_aid_low:E(e,"rinse_aid_low","binary_sensor")===!0,softener_low:E(e,"softener_low","binary_sensor")===!0,display:qa(e,t)}}},status(e){let t=e.t;if(!e.appliance.available)return{text:t("pill.offline"),tone:"gray"};let n=Vn(e),r=o=>oe(t,Ya[o]);return n==="error"?{text:r("error"),tone:"red"}:n==="running"||n==="drying"||n==="canceling"?{text:r(n),tone:"accent"}:n==="paused"?{text:r("paused"),tone:"neutral"}:Hn(e,n)?{text:r("delayed"),tone:"neutral"}:n==="done"?{text:r("done"),tone:"green"}:Wt(e,Wa)?{text:at(e,Wa),tone:"amber"}:Qe(e)?{text:t("pill.service"),tone:"red"}:E(e,"sabbath_on","binary_sensor")?{text:t("pill.sabbath"),tone:"gray"}:F(e,"mode","select")==="Child lock"?{text:oe(t,"Child lock"),tone:"neutral"}:E(e,"remote_ready","binary_sensor")?{text:t("pill.remote_ready"),tone:"accent"}:{text:r("idle"),tone:"neutral"}},infoRows(e){let t=e.t,n=Vn(e),r=[{label:t("info.cycle"),value:Xa(e)??"\u2014"}],o=n!==null&&Ar.has(n)?be(F(e,"wash_cycle_end_time","sensor")):null,i=Hn(e,n)?be(F(e,"delay_start_timer_end_time","sensor")):null;o!==null?r.push({label:t("info.ends"),value:it(e.hass,o)}):i!==null&&r.push({label:t("info.starts"),value:it(e.hass,i)});let s=Np.filter(l=>D(e,l,"switch")).map(l=>({key:l,on:E(e,l,"switch")}));if(s.some(({on:l})=>l!==null)){let l=st(s.filter(({on:u})=>u===!0).map(({key:u})=>t(`control.${u}`))),p=s.some(({on:u})=>u===null);r.push({label:t("info.options"),value:l??(p?"\u2014":t("value.none"))})}return r.slice(0,3)},display(e){if(!e.appliance.available)return null;let t=e.t,n=Vn(e),r=Xa(e);if(Hn(e,n)){let o=be(F(e,"delay_start_timer_end_time","sensor"));return{text:qa(e,n)??"--:--",caption:o===null?oe(t,"Delayed"):t("display.starts_at",{time:it(e.hass,o)})}}return n!==null&&Ar.has(n)?{text:qa(e,n)??"--:--",caption:st([r,n==="running"?null:oe(t,Ya[n])])}:n==="done"?{text:"0:00:00",caption:oe(t,"Done")}:n==="error"?{text:"--:--",caption:oe(t,"Error")}:{text:"--:--",caption:r}},sections(e){let t=Vn(e);return Le([g0(e,t),y0(e),_0(e,t),$0(e),Je(e)])}};function si(e){let t=e.entityId("fan_on","fan");if(!t)return null;let n=e.hass.states[t],r=n?.attributes??{},o=Q(r.supported_features),i=Q(r.percentage_step),a=o!==null&&(o&1)===0?1:i&&i>0?Math.round(100/i):4,s=Te(n),l=Q(r.percentage),p=0;return s==="on"&&(p=l===null?1:hn(Math.round(l*a/100),1,a)),{entityId:t,entity:n,speed:p,speeds:a}}function li(e){let t=e.entityId("light_on","light");if(!t)return null;let n=e.hass.states[t],r=n?.attributes??{},o=Array.isArray(r.supported_color_modes)?r.supported_color_modes:[],i=Te(n)==="on",a=Q(r.brightness),s=o.includes("color_temp");return{entityId:t,entity:n,on:i,brightness:i&&a!==null?Math.round(a*100/255):i&&o.some(l=>l!=="onoff")?100:null,kelvin:i&&s?Q(r.color_temp_kelvin):null,minKelvin:Q(r.min_color_temp_kelvin)??2700,maxKelvin:Q(r.max_color_temp_kelvin)??5e3,hasKelvin:s}}function jp(e){let t=bt(e.state("filter_count","sensor")),n=bt(e.state("filter_max_count","sensor"));return t===null||!n?null:hn(t*100/n,0,100)}function b0(e){let t=e.t,n=si(e),r=li(e),o=[];return n&&o.push({kind:"fan",...lt(e,"fan_on",t("control.fan"),n.entity),action:{type:"fan",entity_id:n.entityId,speeds:n.speeds},value:n.speed,speeds:n.speeds}),r&&o.push({kind:"light",...lt(e,"light_on",t("control.task_light"),r.entity),action:{type:"light",entity_id:r.entityId},on:r.on,brightness:r.brightness,kelvin:r.kelvin??(r.on&&r.hasKelvin?Math.round((r.minKelvin+r.maxKelvin)/2):null),min_kelvin:r.minKelvin,max_kelvin:r.maxKelvin}),o.push(Xe(e,"halo_max_percent",t("control.halo"))),ie("fan_light",t("section.fan_light"),o)}function w0(e){let t=e.t;return ie("delayed_shutoff",t("section.delayed_shutoff"),[Xe(e,"delay_enabled",t("control.delayed_shutoff")),Jo(e,"delay_off_duration",t("control.shutoff_after"),[1,3,5,10,15])])}function v0(e){let t=e.t;return ie("settings",t("section.settings"),[ye(e,"auto_sensivity",t("control.fan_sensitivity")),Xe(e,"key_tone_on",t("control.key_tones")),Xe(e,"user_lock_on",t("control.control_lock"))],!0)}function k0(e){let t=e.t,n=bt(e.state("filter_count","sensor")),r=bt(e.state("filter_max_count","sensor")),o=jp(e);return ie("filters",t("section.filters"),[D(e,"filter_count","sensor")?K("filter_count",t("control.filter_usage"),n===null?null:Mt(t,n,"hours"),{hint:o===null?null:t("value.percent_used",{pct:Math.round(o)}),tone:o!==null&&o>=100?"warning":"normal"}):null,D(e,"filter_max_count","sensor")?K("filter_max_count",t("control.filter_allowance"),r===null?null:Mt(t,r,"hours")):null])}var Mr={drawingState(e){let t=si(e),n=li(e);return{available:e.appliance.available,doors:{},readouts:{},hood:{fan:t?.speed??0,light:n?.on??!1,brightness:n?.on?n.brightness??100:0,kelvin:n?.hasKelvin?n.kelvin??Math.round((n.minKelvin+n.maxKelvin)/2):null,halo:E(e,"halo_max_percent","switch")===!0}}},status(e){let t=e.t;if(!e.appliance.available)return{text:t("pill.offline"),tone:"gray"};let n=si(e)?.speed??0;return n>0?{text:t("pill.fan",{speed:n}),tone:"accent"}:li(e)?.on?{text:t("pill.light"),tone:"neutral"}:Qe(e)?{text:t("pill.service"),tone:"red"}:E(e,"delay_enabled","switch")?{text:t("pill.delayed_shutoff"),tone:"neutral"}:{text:t("pill.off"),tone:"neutral"}},infoRows(e){let t=e.t,n=[],r=si(e);r&&n.push({label:t("info.fan"),value:r.speed?t("value.speed",{speed:r.speed}):t("value.off")});let o=li(e);o&&n.push({label:t("info.light"),value:o.on?st([o.brightness===null?null:`${o.brightness}%`,o.kelvin===null?null:`${Math.round(o.kelvin)} K`])??t("value.on"):t("value.off")});let i=jp(e);if(i!==null){let a=t("value.percent_used",{pct:Math.round(i)});n.push({label:t("info.filter"),value:i>=100?`${a} \xB7 ${t("value.replace")}`:a})}return n.slice(0,3)},display:()=>null,sections(e){return Le([b0(e),w0(e),v0(e),k0(e),Je(e)])}};var Bp=["ice_door_ajar"],x0=new Set(["Off","Not cleaning","Cleaning complete"]);function es(e){let t=E(e,"ice_maker_on","binary_sensor");if(t!==null)return t;let n=F(e,"ice_maker_mode","select");return n==="On"?!0:n==="Off"?!1:null}function Qa(e){let t=F(e,"ice_maker_clean_stage","sensor");return E(e,"ice_maker_clean_on","binary_sensor")===!0||t!==null&&!x0.has(t)}function Cr(e){return E(e,"delay_active","binary_sensor")===!0}function Kp(e){let t=bt(e.state("delay_duration","sensor"));if(!t)return null;let n=be(F(e,"delay_start_time","sensor")),r=Mt(e.t,t),o=E(e,"delay_recurring","binary_sensor")===!0;if(n===null)return o?e.t("value.daily_for",{duration:r}):r;let i=it(e.hass,n);return e.t(o?"value.daily_from":"value.from_for",{time:i,duration:r})}function Up(e){let t=F(e,"ice_maker_status","sensor");if(t!==null)return oe(e.t,t);let n=es(e);return n===null?null:e.t(n?"value.on":"value.off")}function z0(e){let t=e.t;return ie("ice",t("section.ice_maker"),[ye(e,"ice_maker_mode",t("control.ice_maker"),{locks:["ice_maker_mode","ice_maker_on"]}),D(e,"ice_maker_status","sensor")?K("ice_maker_status",t("control.status"),Up(e)):null])}function S0(e){let t=e.t;if(!(D(e,"delay_duration","sensor")||D(e,"end_ice_delay","button")||D(e,"cancel_ice_delay","button")))return null;let r=Cr(e)?F(e,"delay_end_time","sensor"):null,o=Kp(e),i=E(e,"sabbath_on","binary_sensor")===!0,a={kind:"ice_delay",id:"schedule_ice_delay",label:t("control.schedule_delay"),device_id:e.appliance.device_id,disabled:!e.appliance.available||i,reason:e.appliance.available?i?t("lock.sabbath"):null:t("reason.offline")};return ie("ice_delay",t("section.ice_delay"),[r?dt("delay_end_time",t("control.delay_left"),r):null,o?K("delay_schedule",t("control.delay_schedule"),o,{entity_id:e.entityId("delay_duration","sensor")}):null,a,yn(e,"end_ice_delay")?ct(e,"end_ice_delay",t("control.end_delay"),t("action.end")):null,yn(e,"cancel_ice_delay")?ct(e,"cancel_ice_delay",t("control.cancel_delay"),t("action.cancel_schedule")):null])}function R0(e){let t=e.t,n=F(e,"ice_maker_clean_stage","sensor"),r=be(F(e,"next_clean_time","sensor")),o=Me(e,"next_clean_cycles","sensor"),i=E(e,"clean_now_on","binary_sensor"),a=E(e,"clean_soon_on","binary_sensor"),s=i?t("value.due_now"):a?t("value.due_soon"):i===!1||a===!1?t("value.not_due"):null;return ie("cleaning",t("section.cleaning"),[D(e,"ice_maker_clean_stage","sensor")?K("ice_maker_clean_stage",t("control.clean_stage"),n===null?null:oe(t,n)):null,D(e,"clean_now_on","binary_sensor")||D(e,"clean_soon_on","binary_sensor")?K("clean_due",t("control.clean_due"),s,{tone:i?"alert":a?"warning":"normal",entity_id:e.entityId(a&&!i?"clean_soon_on":"clean_now_on","binary_sensor")??e.entityId("clean_soon_on","binary_sensor")}):null,D(e,"next_clean_time","sensor")?K("next_clean_time",t("control.next_cleaning"),r===null?null:mn(e.hass,r,e.now)):null,D(e,"next_clean_cycles","sensor")?K("next_clean_cycles",t("control.cycles_until_cleaning"),o===null?null:String(Math.round(o))):null])}function A0(e){let t=e.t,n=E(e,"water_filter_inserted","binary_sensor"),r=bt(e.state("filter_count","sensor")),o=bt(e.state("filter_max_count","sensor"));return ie("filters",t("section.filters"),[D(e,"water_filter_inserted","binary_sensor")?K("water_filter_inserted",t("control.water_filter"),n===null?null:t(n?"value.inserted":"value.missing"),{tone:n===!1?"warning":"normal"}):null,D(e,"filter_count","sensor")?K("filter_count",t("control.filter_usage"),r===null?null:Mt(t,r,"hours")):null,D(e,"filter_max_count","sensor")?K("filter_max_count",t("control.filter_allowance"),o===null?null:Mt(t,o,"hours")):null])}function Ja(e,t){let n=E(e,t,"binary_sensor");return n===null?null:e.t(n?"value.on":"value.off")}function T0(e){let t=e.t;return ie("settings",t("section.settings"),[ye(e,"door_ajar_timeout",t("control.door_open_delay")),D(e,"winterize_on","binary_sensor")?K("winterize_on",t("control.winterized"),Ja(e,"winterize_on")):null,D(e,"failsafe_on","binary_sensor")?K("failsafe_on",t("control.failsafe"),Ja(e,"failsafe_on"),{tone:E(e,"failsafe_on","binary_sensor")?"alert":"normal"}):null,D(e,"sabbath_on","binary_sensor")?K("sabbath_on",t("control.sabbath"),Ja(e,"sabbath_on")):null],!0)}var Gr={drawingState(e){let t=es(e)===!0,n=E(e,"winterize_on","binary_sensor")===!0,r=E(e,"failsafe_on","binary_sensor")===!0,o=Qa(e);return{available:e.appliance.available,doors:Ut(e,Bp),readouts:{},sabbath:E(e,"sabbath_on","binary_sensor")===!0,ice_maker:{making:t&&!Cr(e)&&!n&&!r&&!o,paused:Cr(e),cleaning:o}}},status(e){let t=e.t;return e.appliance.available?E(e,"ice_door_ajar","binary_sensor")?{text:at(e,Bp),tone:"amber"}:Qe(e)||E(e,"failsafe_on","binary_sensor")?{text:t("pill.service"),tone:"red"}:Qa(e)?{text:t("pill.cleaning"),tone:"accent"}:E(e,"clean_now_on","binary_sensor")?{text:t("pill.cleaning_due"),tone:"amber"}:E(e,"sabbath_on","binary_sensor")?{text:t("pill.sabbath"),tone:"gray"}:Cr(e)?{text:t("pill.paused"),tone:"neutral"}:es(e)!==!0||E(e,"winterize_on","binary_sensor")?{text:t("pill.off"),tone:"neutral"}:{text:t("pill.making_ice"),tone:"accent"}:{text:t("pill.offline"),tone:"gray"}},infoRows(e){let t=e.t,n=[],r=Up(e);r!==null&&n.push({label:t("info.status"),value:r});let o=Cr(e)?be(F(e,"delay_end_time","sensor")):null,i=Kp(e);o!==null?n.push({label:t("info.delay"),value:t("value.until",{time:it(e.hass,o)})}):i&&n.push({label:t("info.delay"),value:i});let a=F(e,"ice_maker_clean_stage","sensor"),s=be(F(e,"next_clean_time","sensor")),l=Me(e,"next_clean_cycles","sensor");return Qa(e)&&a!==null?n.push({label:t("info.cleaning"),value:oe(t,a)}):s!==null?n.push({label:t("info.next_cleaning"),value:mn(e.hass,s,e.now)}):l!==null&&n.push({label:t("info.next_cleaning"),value:t("value.in_cycles",{n:Math.round(l)})}),n.slice(0,3)},display:()=>null,sections(e){return Le([z0(e),S0(e),R0(e),A0(e),T0(e),Je(e)])}};var as=["ref","ref2","frz","wine","wine2"],Er=as.map(e=>`${e}_door_ajar`);function qp(e){return as.filter(t=>D(e,`${t}_set_temp`))}function ts(e,t,n=!1){let r=t==="wine2"?"wine_lower":t==="wine"&&D(e,"wine2_set_temp")?"wine_upper":t;return e.t(n?`zone.short.${r}`:`zone.${r}`)}function ns(e,t){let n=`${t}_set_temp`;return Me(e,n,"sensor","number")??Q(e.state(n,"climate")?.attributes?.temperature)}var Wp={Off:"off",On:"on","Max ice":"max","Night ice":"night"},Zp={off:"Off",on:"On",max:"Max ice",night:"Night ice"};function rs(e){return D(e,"ice_maker_mode","select")||D(e,"ice_maker_on","binary_sensor")}function os(e){let t=F(e,"ice_maker_mode","select");if(t!==null&&t in Wp)return Wp[t];let n=E(e,"ice_maker_on","binary_sensor");return n===null?null:E(e,"max_ice_on","binary_sensor")===!0?"max":E(e,"night_ice_on","binary_sensor")===!0?"night":n?"on":"off"}function Yp(e){let t=F(e,"operating_mode","select");return t!==null?t:E(e,"sabbath_on","binary_sensor")?"Sabbath":E(e,"high_use_on","binary_sensor")?"High use":E(e,"short_vacation_on","binary_sensor")?"Short vacation":E(e,"long_vacation_on","binary_sensor")?"Long vacation":D(e,"sabbath_on","binary_sensor")?"Normal":null}function is(e){return e===null?"normal":e<=0?"alert":e<=10?"warning":"normal"}function M0(e){let t=Le(["water","air"].map(i=>{let a=Me(e,`${i}_filter_pct_remaining`,"sensor");return a===null?null:{kind:i,value:a}}));if(!t.length)return null;let n=t.reduce((i,a)=>a.value<i.value?a:i),r=is(n.value),o=r==="alert"?e.t("value.replace"):r==="warning"?e.t("value.low"):null;return{label:e.t(`info.${n.kind}_filter`),value:st([Qo(n.value),o])??"\u2014"}}function C0(e){let t=e.t,n=[];for(let r of qp(e)){let o=`${r}_set_temp`,i=Me(e,`${r}_display_temp`,"sensor"),a=st([i===null?null:t("value.now",{temp:De(i)}),E(e,`${r}_door_ajar`,"binary_sensor")?at(e,[`${r}_door_ajar`],"value.door_open"):null]),s=[r==="frz"&&E(e,"max_ice_on","binary_sensor")?t("reason.max_ice"):null],l=ts(e,r);n.push(zr(e,o,l,{hint:a,reasons:s})??ei(e,o,l,{hint:a,reasons:s})??K(o,l,De(ns(e,r)),{hint:a}))}if(D(e,"crisp_temp_mode")||D(e,"crisp_set_temp")){let r=F(e,"crisp_temp_mode","select")==="Automatic";n.push(ye(e,"crisp_temp_mode",t("control.crisper_mode")),zr(e,"crisp_set_temp",ts(e,"crisp"),{reasons:[r?t("reason.crisper_auto"):null]}))}if(D(e,"wine_temp_alert_on","binary_sensor")){let r=E(e,"wine_temp_alert_on","binary_sensor");n.push(K("wine_temp_alert_on",t("control.wine_temp_alert"),r===null?null:t(r?"value.alert":"value.normal"),{tone:r?"alert":"normal"}))}return ie("zones",t("section.temperatures"),n)}function G0(e){if(!rs(e))return null;let t=e.t,n=os(e),r=E(e,"max_ice_on","binary_sensor")?F(e,"max_ice_end_time","sensor"):null;return ie("ice",t("section.ice_maker"),[ye(e,"ice_maker_mode",t("control.ice_maker"),{locks:["ice_maker_mode","ice_maker_on"]})??K("ice_maker_mode",t("control.ice_maker"),n===null?null:oe(t,Zp[n]),{entity_id:e.entityId("ice_maker_on","binary_sensor")}),r?dt("max_ice_end_time",t("control.max_ice_left"),r):null])}function E0(e){let t=e.t,n=E(e,"high_use_on","binary_sensor")?F(e,"high_use_end_time","sensor"):null,r=Yp(e);return ie("modes",t("section.modes"),[ye(e,"operating_mode",t("control.operating_mode"),{ignoreLocks:["sabbath"]})??(r===null?null:K("operating_mode",t("control.operating_mode"),oe(t,r))),n?dt("high_use_end_time",t("control.high_use_left"),n):null])}function O0(e){let t=e.t;return ie("settings",t("section.settings"),[ye(e,"humidity_control",t("control.humidity")),ye(e,"night_mode",t("control.night_mode")),ye(e,"accent_light_level",t("control.accent_light")),ye(e,"door_ajar_timeout",t("control.door_open_delay")),Xe(e,"air_filter_on",t("control.air_purification")),Xe(e,"internal_dispenser_enabled",t("control.dispenser"))],!0)}function P0(e){let t=e.t,n=Me(e,"air_filter_pct_remaining","sensor"),r=Me(e,"water_filter_pct_remaining","sensor");return ie("filters",t("section.filters"),[D(e,"air_filter_pct_remaining","sensor")?K("air_filter_pct_remaining",t("control.air_filter"),Qo(n),{tone:is(n)}):null,D(e,"water_filter_pct_remaining","sensor")?K("water_filter_pct_remaining",t("control.water_filter"),Qo(r),{tone:is(r)}):null,D(e,"water_filter_gal_remaining","sensor")?K("water_filter_gal_remaining",t("control.water_filter_capacity"),Op(e.hass,e.state("water_filter_gal_remaining","sensor"))):null,ct(e,"reset_air_filter",t("control.reset_air_filter"),t("action.reset"))])}var Or={drawingState(e){let t={available:e.appliance.available,doors:Ut(e,Er),readouts:{},sabbath:E(e,"sabbath_on","binary_sensor")===!0};for(let r of[...as,"crisp"]){let o=ns(e,r);o!==null&&(t.readouts[r]=De(o))}let n=rs(e)?os(e):null;return n!==null&&(t.ice={on:n!=="off",mode:n}),t},status(e){let t=e.t;return e.appliance.available?Wt(e,Er)?{text:at(e,Er),tone:"amber"}:Qe(e)?{text:t("pill.service"),tone:"red"}:E(e,"wine_temp_alert_on","binary_sensor")?{text:t("pill.temp_alert"),tone:"red"}:E(e,"sabbath_on","binary_sensor")?{text:t("pill.sabbath"),tone:"gray"}:E(e,"unit_on","binary_sensor")===!1?{text:t("pill.off"),tone:"neutral"}:E(e,"high_use_on","binary_sensor")?{text:t("pill.high_use"),tone:"accent"}:E(e,"short_vacation_on","binary_sensor")||E(e,"long_vacation_on","binary_sensor")?{text:t("pill.vacation"),tone:"neutral"}:{text:t("pill.normal"),tone:"neutral"}:{text:t("pill.offline"),tone:"gray"}},infoRows(e){let t=e.t,n=[],r=Le(qp(e).map(a=>{let s=ns(e,a);return s===null?null:{zone:a,temp:De(s)}}));r.length===1?n.push({label:t("info.set_to"),value:r[0].temp}):r.length&&n.push({label:t("info.set_to"),value:r.map(({zone:a,temp:s})=>`${ts(e,a,!0)} ${s}`).join(" \xB7 ")});let o=rs(e)?os(e):null;o!==null&&n.push({label:t("info.ice_maker"),value:oe(t,Zp[o])});let i=M0(e);if(i&&n.push(i),n.length<2){let a=Yp(e);a!==null&&n.push({label:t("info.mode"),value:oe(t,a)})}return n.slice(0,3)},display:()=>null,sections(e){return Le([C0(e),G0(e),E0(e),O0(e),P0(e),Je(e)])}};var D0=[{model:Gr,fits:e=>D(e,"ice_maker_status","sensor")||D(e,"ice_door_ajar","binary_sensor")},{model:Or,fits:e=>["ref","ref2","frz","wine","wine2"].some(t=>D(e,`${t}_set_temp`))},{model:Rr,fits:Ip},{model:Tr,fits:e=>["wash_cycle","wash_status","wash_cycle_on"].some(t=>D(e,t))},{model:Mr,fits:e=>D(e,"fan_on","fan")||D(e,"light_on","light")}],Xp=[...Er,"ice_door_ajar","door_ajar","cav_door_ajar","cav2_door_ajar"];function Pr(e){return D0.filter(t=>t.fits(e)).map(t=>t.model)}function L0(e){let t=new Map;for(let r of e)for(let o of r){let i=t.get(o.id);if(!i){t.set(o.id,{...o,controls:[...o.controls]});continue}let a=new Set(i.controls.map(s=>s.id));i.controls.push(...o.controls.filter(s=>!a.has(s.id)))}let n=t.get("details");return t.delete("details"),n?[...t.values(),n]:[...t.values()]}var ss={drawingState(e){let t={available:e.appliance.available,doors:{},readouts:{}};for(let n of Pr(e)){let r=n.drawingState(e);Object.assign(t.doors,r.doors),Object.assign(t.readouts,r.readouts);for(let o of["ice","sabbath","ovens","display","dishwasher","hood","ice_maker"])r[o]!==void 0&&t[o]===void 0&&(t[o]=r[o])}return t},status(e){let[t]=Pr(e);if(t)return t.status(e);let n=e.t;return e.appliance.available?Wt(e,Xp)?{text:at(e,Xp),tone:"amber"}:Qe(e)?{text:n("pill.service"),tone:"red"}:E(e,"sabbath_on","binary_sensor")?{text:n("pill.sabbath"),tone:"gray"}:{text:n("pill.normal"),tone:"neutral"}:{text:n("pill.offline"),tone:"gray"}},infoRows(e){let t=Pr(e).flatMap(n=>n.infoRows(e));return!t.length&&e.appliance.model&&t.push({label:e.t("info.model"),value:e.appliance.model}),t.slice(0,3)},display(e){for(let t of Pr(e)){let n=t.display(e);if(n)return n}return null},sections(e){let t=Pr(e);return t.length?L0(t.map(n=>n.sections(e))):Le([Je(e)])}};function Qp(e){let t=e.spec;switch(t?.family){case"refrigeration":return t.form==="ice_maker"?Gr:Or;case"range":case"wall_oven":return Rr;case"dishwasher":return Tr;case"hood":return Mr;case"generic":switch(t.form){case"refrigerator":case"wine":return Or;case"ice_maker":return Gr;case"oven":return Rr;case"hood":return Mr;case"dishwasher":return Tr}return ss;default:return ss}}function Jp(e,t,n,r,o){let i=(a,...s)=>{let l=e.entities?.[a];if(l){if(!s.length)return Object.values(l)[0];for(let p of s)if(l[p])return l[p]}};return{appliance:e,hass:t,t:n,now:r,entityId:i,state(a,...s){let l=i(a,...s);return l?t.states[l]:void 0},since:(a,s)=>o.since(a,s),preheatStart:a=>o.preheatStart(e,a)}}function I0(e){if(e.ovens)return!Object.values(e.ovens).some(n=>n?.on)&&!e.display;let t=e.dishwasher?.status;return t==="idle"||t==="done"||t==="error"}var ls=new Set,V0=200;function cs(e,t,n){try{return t()}catch(r){let o=`${e}: ${String(r)}`;return!ls.has(o)&&ls.size<V0&&(ls.add(o),console.error(`Sub-Zero panel: ${e} failed`,r)),n}}function Dr(e,t,n,r,o){let i=Qp(e),a=Jp(e,t,n,r,o),s=(p,u,f)=>cs(`${e.spec?.family} ${p} for ${e.device_id}`,()=>u(i),f),l=s("drawing state",()=>i.drawingState(a),{available:e.available,doors:{},readouts:{}});return e.available?{ctx:a,state:l,status:s("status",()=>i.status(a),{text:"",tone:"neutral"}),display:s("display",()=>i.display(a),null),dim:I0(l),part:s}:{ctx:a,state:{...l,available:!1},status:{text:n("pill.offline"),tone:"gray"},display:null,dim:!0,part:s}}function eu(e,t,n,r,o){let{state:i,status:a,display:s,dim:l,ctx:p,part:u}=Dr(e,t,n,r,o),f=e.entities?.appliance_event?.event,m=f?Hp(t.states[f]):null;return{status:a,rows:u("info rows",y=>y.infoRows(p),[]),display:s,dim:l,state:i,event:m&&{name:ai(n,m.type,u("oven names",()=>ii(p),{})),time:m.time}}}function H0(){try{return typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches}catch{return!1}}function Fn(e,t,n,r,o={}){return{uid:r,spec:o.spec??e.spec,appearance:o.appearance??e.appearance,state:e.available?t:{...t,available:!1},theme:n?.themes?.darkMode?"dark":"light",t:Re(n),reducedMotion:H0(),...o.pixelHeight?{pixelHeight:o.pixelHeight}:{}}}function Nn(e){return cs(`${e.spec.family} drawing`,()=>Sp(e),null)??cs(`${e.spec.family} generic drawing`,()=>Eo(e),v)}var ci=te`
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
  }
  .segmented button:hover:not(:disabled, [aria-disabled="true"], [aria-pressed="true"], [aria-checked="true"]) {
    background: var(--sz-control-hover, rgba(127, 127, 127, 0.2));
  }
  .segmented button:is([aria-pressed="true"], [aria-checked="true"]) {
    background: var(--sz-accent-fill, var(--sz-accent, #03a9f4));
    color: var(--sz-on-accent, #ffffff);
  }
  .segmented button:disabled,
  .segmented button[aria-disabled="true"] {
    cursor: default;
  }
  .segmented button:focus-visible {
    outline: 2px solid var(--sz-accent, #03a9f4);
    outline-offset: 2px;
  }
  /* Bigger targets wherever there's a finger: touch laptops report a mouse as their main pointer. */
  @media (any-pointer: coarse) {
    .segmented button {
      min-height: 44px;
    }
  }
`,di=te`
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
  .dropdown select:focus-visible {
    outline: 2px solid var(--sz-accent, #03a9f4);
    outline-offset: 2px;
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
  @media (any-pointer: coarse) {
    .dropdown select {
      min-height: 44px;
    }
  }
`,tu=te`
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
  /* A label that opens Home Assistant's more-info dialog for its entity. It reads as the label
     it is, and shows it can be pressed when pointed at or focused. */
  .more {
    position: relative;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 4px;
    background: none;
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  /* More to tap than a line of text, without moving anything. */
  .more::before {
    content: "";
    position: absolute;
    inset: -8px -6px;
  }
  .more:hover .label {
    text-decoration: underline;
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

  /* The chips of a control change color over a moment, and dim together while it's locked. */
  .segmented button {
    transition: background-color 0.15s, color 0.15s;
  }
  .segmented.disabled {
    opacity: 0.55;
  }

  /* Locked but focusable: it doesn't open, by pointer or key (see SzSelect). */
  .dropdown select[aria-disabled="true"] {
    opacity: 0.55;
    cursor: default;
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
    .chips .sz-button,
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
`;var nu="sz-value",ru="hass-more-info",F0=2500,N0=oo("en"),Be={minus:h`<path d="M5 11h14v2H5z" />`,plus:h`<path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />`,chevron:h`<path d="M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6z" />`,lock:h`<path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 0 1 6 0v3H9Z" />`};function Ke(e){return A`<svg viewBox="0 0 24 24" aria-hidden="true">${e}</svg>`}var J=class extends ve{constructor(){super();this.moreInfo=()=>{this.dispatchEvent(new CustomEvent(ru,{detail:{entityId:this.entityId},bubbles:!0,composed:!0}))};this.t=N0,this.pending=!1,this.error=null,this.sharedReason=!1,this.quiet=!1,this.optimistic=void 0}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.settleTimer)}current(){return this.control&&"value"in this.control?this.control.value:void 0}willUpdate(n){this.optimistic!==void 0&&(n.has("control")&&j0(this.current(),this.optimistic)||n.has("error")&&this.error)&&this.clearOptimistic()}updated(n){n.has("pending")&&n.get("pending")===!0&&!this.pending&&this.optimistic!==void 0&&(clearTimeout(this.settleTimer),this.settleTimer=setTimeout(()=>this.clearOptimistic(),F0))}clearOptimistic(){clearTimeout(this.settleTimer),this.settleTimer=void 0,this.optimistic=void 0}send(n){clearTimeout(this.settleTimer),this.optimistic=n,this.emit(n)}emit(n){this.dispatchEvent(new CustomEvent(nu,{detail:{value:n},bubbles:!0,composed:!0}))}get disabled(){return!!this.control?.disabled}get locked(){return this.disabled?"true":v}describedBy(n=this.control?.hint??null){let r=[n?"hint":null,this.reason()?"reason":null].filter(Boolean);return r.length?r.join(" "):v}reason(){return this.control?.disabled&&this.control.reason||null}frame(n,r={}){return A`${this.head(n,r)}${this.errorLine()}`}head(n,r={}){let o=this.control;if(!o)return A``;let i=r.hint===void 0?o.hint:r.hint,a=this.reason(),s=A`<span class="label" id="label">${o.label}</span>`,l=this.entityId!==void 0&&!(this.quiet&&r.stacked);return A`
      <div class="row ${r.stacked?"stacked":""}">
        <div class="text">
          <div class="title">
            ${l?A`<button type="button" class="more" aria-label=${this.t("ctl.more_info",{name:o.label})} @click=${this.moreInfo}>
                  ${s}
                </button>`:s}
            ${r.aside?A`<span class="aside">${r.aside}</span>`:v}
          </div>
          ${i?A`<span class="hint" id="hint">${i}</span>`:v}
        </div>
        <div class="widget">
          ${this.pending?A`<span class="spinner" role="progressbar" aria-label=${this.t("ctl.saving")}></span>`:v}
          ${n}
        </div>
      </div>
      ${a?A`<div class="reason ${this.sharedReason?"visually-hidden":""}" id="reason">
            ${Ke(Be.lock)}<span>${a}</span>
          </div>`:v}
    `}errorLine(){return this.error?A`<div class="error" role="alert">${this.error}</div>`:v}};J.properties={control:{attribute:!1},t:{attribute:!1},pending:{type:Boolean,reflect:!0},error:{attribute:!1},sharedReason:{attribute:!1},entityId:{attribute:!1},quiet:{type:Boolean,reflect:!0},optimistic:{state:!0}},J.styles=[ut,ci,di,tu];function j0(e,t){if(e===t)return!0;if(typeof e!="object"||typeof t!="object"||e===null||t===null)return!1;let n=e;return Object.entries(t).every(([r,o])=>n[r]===o)}function _e(e,t){customElements.get(e)||customElements.define(e,t)}var qt=class{constructor(t,n){this.host=t;this.asker=n;this.asking=!1;this.onKey=t=>{t.key==="Escape"&&(t.stopPropagation(),this.close())}}async ask(){this.asking=!0,this.host.requestUpdate(),await this.host.updateComplete,this.host.renderRoot.querySelector(".confirm .sz-button")?.focus()}close(){this.asking=!1,this.host.requestUpdate(),this.host.updateComplete.then(()=>this.host.renderRoot.querySelector(this.asker)?.focus())}drop(){this.asking=!1}bar(t,n){if(!this.asking)return v;let r=()=>{this.close(),n()};return A`<div class="ask" @keydown=${this.onKey}>${Cl({...t,onConfirm:r,onCancel:()=>this.close()})}</div>`}};var pi=class extends J{constructor(){super(...arguments);this.confirmation=new qt(this,".row .sz-button")}press(){this.disabled||this.pending||(this.control?.confirm?this.confirmation.ask():this.emit(void 0))}render(){let n=this.control;if(!n)return v;let r=n.tone==="danger"?"danger":n.tone==="primary"?"primary":"",o=this.confirmation.asking&&n.confirm!==null;return A`
      ${this.head(A`<button
        type="button"
        class="sz-button ${o?"":r}"
        aria-expanded=${n.confirm?o?"true":"false":v}
        aria-disabled=${(this.disabled||this.pending)&&!o?"true":v}
        aria-describedby=${this.describedBy()}
        ?disabled=${o}
        @click=${()=>this.press()}
      >
        ${n.button}
      </button>`)}
      ${n.confirm?this.confirmation.bar({text:n.confirm,confirm:n.button,cancel:this.t("ctl.not_now"),tone:n.tone==="danger"?"danger":"primary",busy:this.pending},()=>{this.disabled||this.emit(void 0)}):v}
      ${this.errorLine()}
    `}};pi.styles=[...J.styles,ht];_e("sz-action",pi);var ds=te`
  .row {
    min-height: 0;
  }
`,ui=class extends J{render(){let t=this.control;return t?this.frame(A`<span class="reading" data-tone=${t.tone??"normal"}>${t.value}</span>`):v}};ui.styles=[...J.styles,ds];_e("sz-reading",ui);var ou=()=>1e3-Date.now()%1e3+5,Lr=class extends J{constructor(){super(...arguments);this.tick=()=>{this.requestUpdate(),this.timer=setTimeout(this.tick,ou())}}connectedCallback(){super.connectedCallback(),this.keepTime()}disconnectedCallback(){super.disconnectedCallback(),this.keepTime()}updated(n){super.updated(n),n.has("now")&&this.keepTime()}keepTime(){this.isConnected&&this.now===void 0?this.timer===void 0&&(this.timer=setTimeout(this.tick,ou())):(clearTimeout(this.timer),this.timer=void 0)}render(){let n=this.control;if(!n)return v;let r=be(n.end),o=r===null?"\u2014":$t(r-(this.now??Date.now()),n.hours===!0);return this.frame(A`<span class="reading" role="timer" aria-live="off">${o}</span>`)}};Lr.properties={now:{attribute:!1}},Lr.styles=[...J.styles,ds];_e("sz-countdown",Lr);var fi=class extends J{constructor(){super();this.draft="";this.onSubmit=n=>{n.preventDefault();let r=this.renderRoot.querySelector("input[type=number]");r&&r.value!==""&&r.checkValidity()?this.choose(Number(r.value)):r?.reportValidity()};this.custom=!1}value(){return typeof this.optimistic=="number"?this.optimistic:this.control?.value??null}choose(n){let r=this.control;if(!r||this.disabled||!Number.isFinite(n))return;let o=Math.min(r.max,Math.max(r.min,Math.round(n)));this.custom=!1,(r.remaining||o!==this.value())&&this.send(o)}toggleCustom(){if(this.disabled)return;this.custom=!this.custom;let n=this.value();this.draft=n===null||n===0?"":String(n)}minutes(n){return n===0?this.t("ctl.off"):this.t("unit.minutes",{n})}render(){let n=this.control;if(!n)return v;let r=this.value(),o=[...new Set([...n.min===0?[0]:[],...n.presets])].filter(l=>l>=n.min&&l<=n.max),i=r!==null&&!o.includes(r),a=this.disabled,s=this.describedBy();return this.frame(A`<div class="chips" role="group" aria-labelledby="label">
          ${o.map(l=>A`<button
              type="button"
              class="sz-button"
              aria-pressed=${l===r?"true":"false"}
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
            @click=${()=>this.toggleCustom()}
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
                .value=${this.draft}
                aria-label=${this.t("ctl.minutes")}
              />
              <button type="submit" class="sz-button primary">${this.t("ctl.set")}</button>
            </form>`:v}`,{stacked:!0,aside:r===null?null:this.minutes(r)})}};fi.properties={custom:{state:!0}};_e("sz-duration",fi);var ps=class extends J{value(){return typeof this.optimistic=="number"?this.optimistic:this.control?.value??0}pick(t){this.disabled||t===this.value()||this.send(t)}render(){let t=this.control;if(!t)return v;let n=this.value(),r=Array.from({length:Math.max(1,t.speeds)+1},(i,a)=>a),o=this.describedBy();return this.frame(A`<div class="segmented ${this.disabled?"disabled":""}" role="group" aria-labelledby="label">
      ${r.map(i=>A`<button
          type="button"
          aria-pressed=${i===n?"true":"false"}
          aria-label=${i===0?this.t("ctl.off"):t.speeds===1?this.t("ctl.on"):this.t("ctl.speed",{n:i})}
          aria-disabled=${this.locked}
          aria-describedby=${o}
          @click=${()=>this.pick(i)}
        >
          ${i===0?this.t("ctl.off"):t.speeds===1?this.t("ctl.on"):String(i)}
        </button>`)}
    </div>`)}};_e("sz-fan",ps);var su=6e4,us=864e5;function lu(e,t){let n=new Intl.DateTimeFormat("en-US",{timeZone:e,hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).formatToParts(t),r=o=>Number(n.find(i=>i.type===o)?.value??0);return Date.UTC(r("year"),r("month")-1,r("day"),r("hour"),r("minute"),r("second"))}function iu(e,t,n){let r=i=>lu(e,i)-Math.floor(i/1e3)*1e3,o=t-r(n);return t-r(o)}function B0(e,t,n,r){let o=lu(e,r),i=o-o%us+(t*60+n)*su,a=iu(e,i,r);return a>r?a:iu(e,i+us,a+us)}function K0(e,t,n){let r=new Date(n);return r.setHours(e,t,0,0),r.getTime()<=n&&r.setDate(r.getDate()+1),r.getTime()}function au(e,t,n){let r=/^(\d{1,2}):(\d{2})$/.exec(e);if(!r)return null;let o=Number(r[1]),i=Number(r[2]),a;if(n)try{a=B0(n,o,i,t.getTime())}catch{}return a??=K0(o,i,t.getTime()),Math.min(1439,Math.max(1,Math.ceil((a-t.getTime())/su)))}var Ir=class extends J{constructor(){super(),this.hours=8,this.later=!1,this.time="22:00",this.repeat=!1}current(){}submit(){if(this.disabled||this.pending)return;let t=this.later?au(this.time,new Date,this.timeZone):0;t!==null&&this.emit({duration:this.hours,start_in:t,repeat:this.repeat})}render(){if(!this.control)return v;let n=this.disabled||this.pending,r=this.later?au(this.time,new Date,this.timeZone):0,o=r===null||r===0?null:this.t("ctl.starts_in",{time:r>=60?this.t("unit.hours_minutes",{h:Math.floor(r/60),m:r%60}):this.t("unit.minutes",{n:r})});return A`
      ${this.head(v)}
      <div class="form" role="group" aria-labelledby="label">
        <div class="field">
          <span id="hours-label">${this.t("ctl.duration")}</span>
          <div class="stepper" role="group" aria-labelledby="hours-label">
            <button type="button" aria-label=${this.t("ctl.decrease")} ?disabled=${n||this.hours<=1} @click=${()=>this.hours-=1}>
              ${Ke(Be.minus)}
            </button>
            <output aria-live="polite">${this.t("unit.hours",{n:this.hours})}</output>
            <button type="button" aria-label=${this.t("ctl.increase")} ?disabled=${n||this.hours>=12} @click=${()=>this.hours+=1}>
              ${Ke(Be.plus)}
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
                />`:v}
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
          ${o?A`<span class="hint">${o}</span>`:v}
          <button type="button" class="sz-button primary" ?disabled=${n} @click=${()=>this.submit()}>
            ${this.t("ctl.schedule")}
          </button>
        </div>
      </div>
      ${this.errorLine()}
    `}};Ir.properties={timeZone:{attribute:!1},hours:{state:!0},later:{state:!0},time:{state:!0},repeat:{state:!0}},Ir.styles=[...J.styles,te`
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
    `];_e("sz-ice-delay",Ir);var hi=5,Vr=class extends J{constructor(){super(),this.sliding={}}current(){let t=this.control;return t?{on:t.on,brightness:t.brightness,kelvin:t.kelvin}:void 0}state(){let t=this.control,n=this.optimistic;return{on:n?.on??t?.on??!1,brightness:n?.brightness??t?.brightness??null,kelvin:n?.kelvin??t?.kelvin??null}}change(t){this.disabled||(this.sliding={},this.send(t))}render(){let t=this.control;if(!t)return v;let n=this.state(),r=this.sliding.brightness??n.brightness,o=this.sliding.kelvin??n.kelvin,i=r===null?0:Math.max(hi,r),a=(i-hi)*100/(100-hi);return A`
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
      ${n.on&&(r!==null||o!==null)?A`<div class="sliders">
            ${r!==null?A`<label class="slider">
                  <span>${this.t("ctl.brightness")}</span>
                  <input
                    class="level"
                    type="range"
                    min=${hi}
                    max="100"
                    step="1"
                    style="--filled: ${a}%"
                    .value=${String(i)}
                    ?disabled=${this.disabled}
                    @input=${s=>this.sliding={...this.sliding,brightness:Number(s.target.value)}}
                    @change=${s=>this.change({on:!0,brightness:Number(s.target.value)})}
                  />
                  <output>${Math.round(i)}%</output>
                </label>`:v}
            ${o!==null?A`<label class="slider">
                  <span>${this.t("ctl.white")}</span>
                  <input
                    class="kelvin"
                    type="range"
                    min=${t.min_kelvin}
                    max=${t.max_kelvin}
                    step="50"
                    .value=${String(o)}
                    ?disabled=${this.disabled}
                    @input=${s=>this.sliding={...this.sliding,kelvin:Number(s.target.value)}}
                    @change=${s=>this.change({on:!0,kelvin:Number(s.target.value)})}
                  />
                  <output>${Math.round(o)} K</output>
                </label>`:v}
          </div>`:v}
      ${this.errorLine()}
    `}};Vr.properties={sliding:{state:!0}},Vr.styles=[...J.styles,te`
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
    `];_e("sz-light",Vr);var U0=5,W0=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End","PageUp","PageDown"]);function cu(e){return e.altKey||e.ctrlKey||e.metaKey?!1:W0.has(e.key)||e.key!==" "&&[...e.key].length===1}function q0(e){return e.altKey&&(e.key==="ArrowDown"||e.key==="ArrowUp")||e.key===" "||e.key==="Enter"||e.key==="F4"}var fs=class extends J{constructor(){super(...arguments);this.onKey=n=>{let r=n.currentTarget;if(this.disabled){(cu(n)||q0(n))&&n.preventDefault();return}if(cu(n)){n.preventDefault();try{r.showPicker?.()}catch{}}}}value(){return typeof this.optimistic=="string"?this.optimistic:this.control?.value??null}pick(n){this.disabled||n===this.value()||this.send(n)}render(){let n=this.control;if(!n)return v;let r=this.value(),o=n.options.some(i=>i.value===r);if(n.options.length<=U0){let i=n.options.length>3||n.options.some(l=>l.label.length>12),a=o||r===null?null:this.t("value.now",{temp:oe(this.t,r)}),s=[n.hint,a].filter(Boolean).join(`
`)||null;return this.frame(A`<div class="segmented ${this.disabled?"disabled":""}" role="group" aria-labelledby="label">
          ${n.options.map(l=>A`<button
              type="button"
              aria-pressed=${l.value===r?"true":"false"}
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
          ${o?v:A`<option value="" disabled selected>${r===null?"\u2014":oe(this.t,r)}</option>`}
          ${n.options.map(i=>A`<option value=${i.value} ?selected=${i.value===r}>${i.label}</option>`)}
        </select>
        ${Ke(Be.chevron)}
      </span>`)}updated(n){super.updated(n);let r=this.renderRoot.querySelector("select"),o=this.value();r&&o!==null&&r.value!==o&&this.control?.options.some(i=>i.value===o)&&(r.value=o)}};_e("sz-select",fs);var Z0=600,Y0=(e,t)=>e.toFixed(t);function du(e){let t=String(e);return t.includes(".")?t.length-t.indexOf(".")-1:0}function X0(e,t){return Number(e.toFixed(du(t)))}var mi=class extends J{constructor(){super(...arguments);this.onKey=n=>{let r=n.key==="ArrowUp"||n.key==="ArrowRight"?1:n.key==="ArrowDown"||n.key==="ArrowLeft"?-1:0;r&&(n.preventDefault(),this.bump(r))}}disconnectedCallback(){this.commitTimer!==void 0&&this.commit(),super.disconnectedCallback()}shown(){return typeof this.optimistic=="number"?this.optimistic:this.control?.value??null}bump(n){let r=this.control;if(!r||this.disabled)return;let o=this.shown(),i=o===null?r.min+Math.round((r.max-r.min)/2/r.step)*r.step:o+n*r.step,a=Math.min(r.max,Math.max(r.min,X0(i,r.step)));a!==o&&(this.optimistic=a,clearTimeout(this.commitTimer),this.commitTimer=setTimeout(()=>this.commit(),Z0))}commit(){clearTimeout(this.commitTimer),this.commitTimer=void 0;let n=this.optimistic;if(typeof n=="number"){if(n===this.control?.value){this.clearOptimistic();return}this.send(n)}}render(){let n=this.control;if(!n)return v;let r=this.shown(),o=this.disabled,i=r!==null&&r<=n.min,a=r!==null&&r>=n.max,s=this.describedBy();return this.frame(A`
      <div class="stepper ${this.commitTimer!==void 0?"draft":""}" role="group" aria-labelledby="label" @keydown=${this.onKey}>
        <button
          type="button"
          aria-label=${this.t("ctl.decrease")}
          aria-disabled=${i||o?"true":v}
          aria-describedby=${s}
          @click=${()=>this.bump(-1)}
        >
          ${Ke(Be.minus)}
        </button>
        <!-- No setpoint (an oven that's off) reads as a blank display, not as a number. -->
        <output aria-live="polite" class=${r===null?"empty":v}>
          ${r===null?"--":(this.formatNumber??Y0)(r,du(n.step))}<span class="unit">${n.unit}</span>
        </output>
        <button
          type="button"
          aria-label=${this.t("ctl.increase")}
          aria-disabled=${a||o?"true":v}
          aria-describedby=${s}
          @click=${()=>this.bump(1)}
        >
          ${Ke(Be.plus)}
        </button>
      </div>
    `)}};mi.properties={formatNumber:{attribute:!1}};_e("sz-setpoint",mi);var gi=class extends J{constructor(){super(...arguments);this.confirmation=new qt(this,".switch")}value(){return typeof this.optimistic=="boolean"?this.optimistic:this.control?.value??null}flip(){if(this.disabled)return;let n=!this.value();!n&&this.control?.confirmOff?this.confirmation.ask():this.send(n)}willUpdate(n){super.willUpdate(n),this.confirmation.asking&&!(this.control?.confirmOff&&this.value()===!0&&!this.disabled)&&this.confirmation.drop()}render(){let n=this.control;if(!n)return v;let r=this.value();if(r===null&&this.disabled)return this.frame(A`<span class="reading">—</span>`);let o=n.confirmOff,i=this.confirmation.asking&&o!==void 0;return A`
      ${this.head(A`<button
        type="button"
        class="switch ${r===null?"unknown":""}"
        role="switch"
        aria-checked=${r===!0?"true":"false"}
        aria-labelledby="label"
        aria-disabled=${this.locked}
        aria-describedby=${this.describedBy()}
        ?disabled=${i}
        @click=${()=>this.flip()}
      ></button>`)}
      ${i?this.confirmation.bar({text:o.text,confirm:o.button,cancel:this.t("ctl.not_now"),tone:"danger",busy:this.pending},()=>this.send(!1)):v}
      ${this.errorLine()}
    `}};gi.styles=[...J.styles,ht];_e("sz-toggle",gi);function pu(e,t){let{t:n,pending:r,error:o,onValue:i}=t,a=t.quiet===!0,s=t.sharedReason===!0,l=t.entityId;switch(e.kind){case"setpoint":return A`<sz-setpoint
        .control=${e}
        .t=${n}
        .pending=${r}
        .error=${o}
        .sharedReason=${s}
        .entityId=${l}
        .formatNumber=${t.formatNumber}
        ?quiet=${a}
        @sz-value=${i}
      ></sz-setpoint>`;case"select":return A`<sz-select .control=${e} .t=${n} .pending=${r} .error=${o} .sharedReason=${s} .entityId=${l} ?quiet=${a} @sz-value=${i}></sz-select>`;case"toggle":return A`<sz-toggle .control=${e} .t=${n} .pending=${r} .error=${o} .sharedReason=${s} .entityId=${l} ?quiet=${a} @sz-value=${i}></sz-toggle>`;case"action":return A`<sz-action .control=${e} .t=${n} .pending=${r} .error=${o} .sharedReason=${s} .entityId=${l} ?quiet=${a} @sz-value=${i}></sz-action>`;case"duration":return A`<sz-duration .control=${e} .t=${n} .pending=${r} .error=${o} .sharedReason=${s} .entityId=${l} ?quiet=${a} @sz-value=${i}></sz-duration>`;case"fan":return A`<sz-fan .control=${e} .t=${n} .pending=${r} .error=${o} .sharedReason=${s} .entityId=${l} ?quiet=${a} @sz-value=${i}></sz-fan>`;case"light":return A`<sz-light .control=${e} .t=${n} .pending=${r} .error=${o} .sharedReason=${s} .entityId=${l} ?quiet=${a} @sz-value=${i}></sz-light>`;case"reading":return A`<sz-reading .control=${e} .t=${n} .entityId=${l} ?quiet=${a}></sz-reading>`;case"countdown":return A`<sz-countdown .control=${e} .t=${n} .entityId=${l} .now=${t.now} ?quiet=${a}></sz-countdown>`;case"ice_delay":return A`<sz-ice-delay
        .control=${e}
        .t=${n}
        .pending=${r}
        .error=${o}
        .sharedReason=${s}
        .timeZone=${t.timeZone}
        ?quiet=${a}
        @sz-value=${i}
      ></sz-ice-delay>`}}var uu=["finish","panel_color","knobs","handle","style","form"];function fu(e,t){return uu.every(n=>e[n]===t[n])}function Hr(e){return typeof e=="string"&&/^#[0-9a-f]{6}$/i.test(e)}var Q0={"#f4f2ec":"white","#ece4d2":"cream","#9aa0a6":"gray","#2f3b52":"navy","#9caf88":"sage","#1f2022":"black","#5b3a29":"walnut","#b08955":"oak"};function hu(e){return Q0[e.toLowerCase()]??null}function mu(e,t,n){let r=new Set,o=n.finish??[];o.length&&r.add("finish"),o.includes("panel")&&r.add("panel_color"),n.knobs&&r.add("knobs"),n.handle&&r.add("handle"),n.style&&r.add("style"),n.forms?.length&&r.add("form");let i={};for(let a of uu)r.has(a)&&t[a]!==e[a]&&(i[a]=t[a]);return i}function gu(e){let t=e.appearance_options?.forms??[];return t.includes(e.detected_form)?[...t]:[e.detected_form,...t]}function hs(e,t){let n=e.spec,r=t.form??e.detected_form,o=e.form_specs?.[r];return o||(n.form===r?n:n.family==="wall_oven"&&(r==="single"||r==="double")?J0(n,r):{...n,form:r})}function J0(e,t){let n=e.ovens[0]??{prefix:"cav",position:"single",width:e.width};if(t==="single")return{...e,form:t,ovens:[{...n,position:"single"}]};let r=e.ovens[1]??{prefix:"cav2",position:"lower",width:n.width};return{...e,form:t,ovens:[{...n,position:"upper"},{...r,position:"lower"}]}}var yu=0,ey={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1},Fr=class extends ve{constructor(){super();this.uid=`sza${++yu}`;this.drawingUid=`szp${yu}`;this.size=new Ot(this,".preview .drawing > svg");this.resetting=new qt(this,".actions .reset");this.onRadioKey=n=>{let r=ey[n.key];if(!r)return;let i=[...n.currentTarget.querySelectorAll('[role="radio"]:not(:disabled)')],a=i.indexOf(n.target);if(a<0||i.length<2)return;n.preventDefault();let s=i[(a+r+i.length)%i.length];s.focus(),s.click()};this.saving=!1,this.message=null}willUpdate(n){ft(this,this.hass);let r=this.appliance;if(!n.has("appliance")||!r)return;let o=n.get("appliance")?.appliance_id!==r.appliance_id;(o||!this.pending||!this.saved||fu(this.pending,this.saved))&&(this.pending={...r.appearance},o&&(this.message=null)),this.saved=r.appearance}render(){let{hass:n,appliance:r,pending:o}=this;if(!n||!r||!o)return v;let i=Re(n),a=n.user?.is_admin===!0,s=r.appearance_options,l=s.finish??[],p=this.saved?mu(this.saved,o,s):{},u=Object.keys(p).length>0,f=!a||this.saving;return A`
      <div class="layout">
        <div class="preview stage" aria-label=${i("appearance.preview")} role="img">
          <div class="drawing">${this.renderPreview(r,o)}</div>
        </div>
        <div class="fields">
          <p class="note">${i(a?"appearance.hint":"appearance.admin_only")}</p>
          ${l.length>1?this.radios("finish",i("appearance.finish"),l.map(m=>({value:m,label:i(`finish.${m}`)})),o.finish,m=>this.setFinish(m,s.panel_colors),f):v}
          ${o.finish==="panel"?this.panelColors(i,s.panel_colors??[],f):v}
          ${s.knobs&&this.hasKnobs(r,o)?this.radios("knobs",i("appearance.knobs"),s.knobs.map(m=>({value:m,label:i(`knobs.${m}`),swatch:`var(--sz-knob-${m})`})),o.knobs,m=>this.edit({knobs:m}),f,"swatches"):v}
          ${s.handle?this.radios("handle",i("appearance.handle"),s.handle.map(m=>({value:m,label:i(`handle.${m}`)})),o.handle,m=>this.edit({handle:m}),f):v}
          ${s.style?this.radios("style",i("appearance.style"),s.style.map(m=>({value:m,label:i(`style.${m}`)})),o.style??this.modelStyle()??s.style[0]??null,m=>this.edit({style:m}),f):v}
          ${this.formSelect(i,r,o,f)}
          <div class="actions">
            <button
              type="button"
              class="sz-button reset"
              aria-expanded=${this.resetting.asking?"true":"false"}
              ?disabled=${f||this.resetting.asking}
              @click=${()=>this.askReset()}
            >
              ${i("appearance.reset")}
            </button>
            <button
              type="button"
              class="sz-button primary"
              ?disabled=${f||!u}
              @click=${()=>this.save(p)}
            >
              ${this.saving?i("appearance.saving"):i("appearance.save")}
            </button>
          </div>
          ${a?this.resetting.bar({text:i("appearance.reset_confirm"),confirm:i("appearance.reset_action"),cancel:i("ctl.not_now")},()=>{this.save(null)}):v}
          ${this.message?A`<p
                class="message ${this.message.kind}"
                role=${this.message.kind==="error"?"alert":"status"}
              >
                ${this.message.text}
              </p>`:v}
        </div>
      </div>
    `}renderPreview(n,r){let o=this.hass,a={...Dr(n,o,Re(o),Date.now(),Ce).state,available:!0,doors:{}},s={...n,available:!0};return Nn(Fn(s,a,o,this.drawingUid,{appearance:r,spec:hs(n,r),pixelHeight:this.size.height}))}hasKnobs(n,r){let o=hs(n,r);return o.family!=="wall_oven"||Zo(o,r)}modelStyle(){let n=this.appliance?.spec;return n&&(n.family==="wall_oven"||n.family==="range")?n.style:null}radios(n,r,o,i,a,s,l="segmented"){let p=`${this.uid}-${n}`,u=o.some(f=>f.value===i)?i:o[0]?.value;return A`<div class="field">
      <span class="label" id=${p}>${r}</span>
      <div class=${l} role="radiogroup" aria-labelledby=${p} @keydown=${this.onRadioKey}>
        ${o.map(f=>A`<button
            type="button"
            role="radio"
            class=${f.swatch?"swatch":v}
            aria-checked=${f.value===i?"true":"false"}
            aria-label=${f.swatch?f.label:v}
            title=${f.swatch?f.label:v}
            tabindex=${f.value===u?0:-1}
            style=${f.swatch?`--swatch: ${f.swatch}`:v}
            ?disabled=${s}
            @click=${()=>a(f.value)}
          >
            ${f.swatch?v:f.label}
          </button>`)}
      </div>
    </div>`}panelColors(n,r,o){let i=this.pending?.panel_color??null,a=i!==null&&!r.some(m=>m.toLowerCase()===i.toLowerCase()),s=`${this.uid}-panel`,l=r.filter(Hr),p=a||!i?null:i.toLowerCase(),u=m=>{let y=hu(m);return y?n(`panel_color.${y}`):n("appearance.panel_color_value",{color:m.toUpperCase()})},f=p?u(p):a?n("appearance.custom_color"):null;return A`<div class="field">
      <span class="field-head">
        <span class="label" id=${s}>${n("appearance.panel_color")}</span>
        ${f?A`<span class="chosen" aria-hidden="true">${f}</span>`:v}
      </span>
      <div class="swatches" role="radiogroup" aria-labelledby=${s} @keydown=${this.onRadioKey}>
        ${l.map((m,y)=>{let g=m.toLowerCase()===p,_=u(m);return A`<button
            type="button"
            role="radio"
            class="swatch"
            aria-checked=${g?"true":"false"}
            aria-label=${_}
            title=${_}
            tabindex=${g||p===null&&!a&&y===0?0:-1}
            style="--swatch: ${m}"
            ?disabled=${o}
            @click=${()=>this.edit({panel_color:m})}
          ></button>`})}
        <label
          class="swatch custom ${a?"checked":""}"
          title=${n("appearance.custom_color")}
          style=${a?`--swatch: ${i}`:v}
        >
          <input
            type="color"
            aria-label=${n("appearance.custom_color")}
            .value=${Hr(i)?i:"#d9d4c7"}
            ?disabled=${o}
            @input=${m=>{let y=m.target.value;Hr(y)&&this.edit({panel_color:y.toLowerCase()})}}
          />
        </label>
      </div>
    </div>`}formSelect(n,r,o,i){let a=gu(r);if(a.length<2)return v;let s=o.form??r.detected_form,l=`${this.uid}-form`;return A`<div class="field">
      <label class="label" for=${l}>${n("appearance.form")}</label>
      <span class="dropdown">
        <select
          id=${l}
          ?disabled=${i}
          @change=${p=>{let u=p.target.value;this.edit({form:u===r.detected_form?null:u})}}
        >
          ${a.map(p=>{let u=n(`form.${p}`);return A`<option value=${p} .selected=${p===s}>
              ${p===r.detected_form?n("appearance.detected",{form:u}):u}
            </option>`})}
        </select>
        ${Ke(Be.chevron)}
      </span>
    </div>`}setFinish(n,r){let o=this.pending?.panel_color??null,i=n==="panel"?o??r?.find(Hr)??null:null;this.edit({finish:n,panel_color:i})}edit(n){this.pending&&(this.pending={...this.pending,...n},this.message=null)}askReset(){this.message=null,this.resetting.ask()}async save(n){let{hass:r,appliance:o}=this;if(!r||!o||this.saving)return;let i=Re(r);this.saving=!0,this.message=null;try{let a=await r.callWS({type:"subzero/panel/set_appearance",appliance_id:o.appliance_id,appearance:n});a?.appearance&&(this.saved=a.appearance,this.pending={...a.appearance}),this.message={kind:"saved",text:i("appearance.saved")}}catch(a){this.message={kind:"error",text:i("appearance.error",{message:Et(a)})}}finally{this.saving=!1}}};Fr.properties={hass:{attribute:!1},appliance:{attribute:!1},pending:{state:!0},saving:{state:!0},message:{state:!0}},Fr.styles=[pt,ut,ht,ci,di,te`
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
      /* Labels look like the full view's controls above; the chips and the dropdown are theirs
         (segmentedStyles, dropdownStyles). */
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
      .swatch:focus-visible {
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
      /* In the field's grid the dropdown is as wide as its select, not the field. */
      .dropdown {
        width: fit-content;
      }
      :host([dark]) select {
        color-scheme: dark;
      }
      /* Any finger, not just a main one: touch laptops report a mouse as their main pointer. */
      @media (any-pointer: coarse) {
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
    `];customElements.get("sz-appearance-editor")||customElements.define("sz-appearance-editor",Fr);var _u={days:7,shown:50},$u={days:30,shown:200},ty=864e5,ny=h`<path d="M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6z" />`,ry=h`<path d="M17.7 6.3A8 8 0 1 0 19.7 14h-2.1A6 6 0 1 1 12 6c1.7 0 3.1.7 4.2 1.8L13 11h7V4l-2.3 2.3Z" />`,oy=0;function bu(e,t){let n={...e};return delete n[t],n}function iy(e,t){return e.trim().toLocaleLowerCase()===t.trim().toLocaleLowerCase()}function ay(e){return e.kind==="ice_delay"?{type:"service",domain:"subzero",service:"schedule_ice_delay",data:{device_id:e.device_id}}:"action"in e?e.action:null}var Nr=class extends ve{constructor(){super();this.uid=`szv${++oy}`;this.size=new Ot(this,".stage .drawing > svg");this.clock=Date.now();this.eventLog=new Sn(()=>this.requestUpdate(),()=>this.now??Date.now());this.tick=()=>{this.clock=Date.now(),this.requestUpdate(),this.timer=setTimeout(this.tick,1e3-this.clock%1e3+5)};this.narrow=!1,this.isAdmin=!1,this.pending={},this.errors={},this.eventSpan=_u,this.refreshing=!1,this.refreshError=null}connectedCallback(){super.connectedCallback(),this.stopHelpers=Ce.onChange(()=>this.requestUpdate()),this.keepTime()}disconnectedCallback(){super.disconnectedCallback(),this.keepTime(),this.stopHelpers?.(),this.stopHelpers=void 0}updated(n){n.has("now")&&this.keepTime()}keepTime(){this.isConnected&&this.now===void 0?this.timer===void 0&&(this.clock=Date.now(),this.timer=setTimeout(this.tick,1e3-this.clock%1e3+5)):(clearTimeout(this.timer),this.timer=void 0)}shouldUpdate(n){return n.size===1&&n.has("hass")&&this.hass&&this.appliance?io(n.get("hass"),this.hass,this.appliance):!0}willUpdate(){ft(this,this.hass),!this.helpers&&this.hass&&this.appliance&&Ce.observe(this.hass,[this.appliance])}async apply(n,r,o){let i=this.hass,a=ay(r);if(!(!i||!a)){this.pending={...this.pending,[n]:(this.pending[n]??0)+1},this.errors=bu(this.errors,n);try{await Tl(i,a,o)}catch(s){this.errors={...this.errors,[n]:Et(s)||Re(i)("full.failed")}}finally{let s=(this.pending[n]??1)-1;this.pending=s>0?{...this.pending,[n]:s}:bu(this.pending,n)}}}async refresh(){let{hass:n,appliance:r}=this;if(!(!n||!r||this.refreshing)){this.refreshing=!0,this.refreshError=null;try{await n.callService("subzero","refresh",{device_id:[r.device_id]})}catch(o){this.refreshError=Et(o)||Re(n)("full.failed")}finally{this.refreshing=!1}}}render(){let{hass:n,appliance:r}=this;if(!n||!r)return v;let o=Re(n),i=this.now??this.clock,{state:a,status:s,display:l,dim:p,ctx:u,part:f}=Dr(r,n,o,i,this.helpers??Ce),m=f("sections",_=>_.sections(u),[]),y=f("oven names",()=>ii(u),{}),g={now:i,timeZone:Xo(n),formatNumber:(_,b)=>ja(n,_,b,b),entityOf:_=>Dp(u,_)};return A`<div class="layout">
      <section class="hero" aria-label=${o("full.appliance")}>
        <div class="hero-head">
          <!-- Not a live region: preheat and timer pills change every second. -->
          <div>${fo(s)}</div>
          ${ho(l,p)}
        </div>
        <div class="stage">
          <div class="drawing">
            ${Nn(Fn(r,a,n,this.uid,{pixelHeight:this.size.height}))}
          </div>
        </div>
      </section>
      <div class="sections">
        ${Yn(m,_=>_.id,_=>this.renderSection(_,o,g))}
        ${this.renderEvents(o,n,i,y)} ${this.renderRefresh(o)} ${this.isAdmin?this.renderAppearance(o):v}
      </div>
    </div>`}card(n,r,o){return A`<details class="card" ?open=${o}>
      <summary>
        <h2>${n}</h2>
        <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true">${ny}</svg>
      </summary>
      <div class="body">${r}</div>
    </details>`}renderSection(n,r,o){let i=new Map;for(let u of n.controls)u.disabled&&u.reason&&i.set(u.reason,(i.get(u.reason)??0)+1);let a=[...i].filter(([,u])=>u>1).map(([u])=>u),s=(u,f)=>A`<p class="note shared" aria-hidden=${f?"true":v}>${Ke(Be.lock)}<span>${u}</span></p>`;if(a.length===1&&n.controls.every(u=>u.kind==="toggle"&&u.value===null&&u.disabled&&u.reason===a[0]))return this.card(n.title,s(a[0],!1),!n.collapsed);let p=n.controls.length===1&&iy(n.controls[0].label,n.title);return this.card(n.title,A`${a.map(u=>s(u,!0))}
      ${Yn(n.controls,u=>u.id,u=>{let f=`${n.id}/${u.id}`;return A`<div class="control">
            ${pu(u,{t:r,pending:!!this.pending[f],error:this.errors[f]??null,onValue:m=>{this.apply(f,u,m.detail.value)},quiet:p,sharedReason:!!(u.disabled&&u.reason&&a.includes(u.reason)),now:o.now,timeZone:o.timeZone,formatNumber:o.formatNumber,entityId:o.entityOf(u)})}
          </div>`})}`,!n.collapsed)}renderEvents(n,r,o,i){let a=this.appliance?.entities?.appliance_event?.event;if(!a)return v;let s=this.eventSpan,{rows:l,error:p}=this.eventLog.states(r,a,s.days),u=l&&Ua(l,o-s.days*ty),f;if(!u&&p!==null)f=A`<p class="note error" role="alert">${n("full.events_error",{error:Et(p)||n("full.failed")})}</p>
        <button type="button" class="sz-button" @click=${()=>this.retryEvents(a)}>${n("overview.retry")}</button>`;else if(!u)f=A`<p class="note">${n("full.events_loading")}</p>`;else{let m=u.length?A`<ol class="events">
            ${u.slice(0,s.shown).map(y=>A`<li>
                <span>${ai(n,y.type,i)}</span>
                <time datetime=${new Date(y.time).toISOString()}>${mn(r,y.time,o)}</time>
              </li>`)}
          </ol>`:A`<p class="note">${n("full.no_events",{days:s.days})}</p>`;f=A`${m}
      ${s===_u?A`<button type="button" class="sz-button more-events" @click=${()=>this.eventSpan=$u}>
            ${n("full.events_more",{days:$u.days})}
          </button>`:v}`}return this.card(n("full.recent_events"),f,!0)}retryEvents(n){this.eventLog.forgetStates(n,this.eventSpan.days),this.requestUpdate()}renderRefresh(n){return A`<div class="refresh">
      <button type="button" class="sz-button" ?disabled=${this.refreshing} @click=${()=>{this.refresh()}}>
        <svg class="${this.refreshing?"spinning":""}" viewBox="0 0 24 24" aria-hidden="true">${ry}</svg>
        ${n(this.refreshing?"full.refreshing":"full.refresh")}
      </button>
      ${this.refreshError?A`<span class="error" role="alert">${this.refreshError}</span>`:A`<span class="note">${n("full.refresh_hint")}</span>`}
    </div>`}renderAppearance(n){return this.card(n("full.appearance"),A`<sz-appearance-editor .hass=${this.hass} .appliance=${this.appliance}></sz-appearance-editor>`,!1)}};Nr.properties={hass:{attribute:!1},appliance:{attribute:!1},narrow:{type:Boolean,reflect:!0},isAdmin:{type:Boolean},now:{attribute:!1},helpers:{attribute:!1},pending:{state:!0},errors:{state:!0},eventSpan:{state:!0},refreshing:{state:!0},refreshError:{state:!0}},Nr.styles=[pt,uo,ut,ht,te`
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
      .more-events {
        margin-top: 10px;
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
    `];customElements.get("sz-appliance-view")||customElements.define("sz-appliance-view",Nr);var sy="sz-open-appliance",ly=0,jr=class extends ve{constructor(){super();this.uid=`szc${++ly}`;this.size=new Ot(this,".drawing > svg");this.name="";this.now=Date.now(),this.helpers=Ce,this.addEventListener("click",()=>this.open()),this.addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" ")&&!n.repeat&&(n.preventDefault(),this.open())})}connectedCallback(){super.connectedCallback(),this.setAttribute("role","button"),this.hasAttribute("tabindex")||(this.tabIndex=0)}shouldUpdate(n){return!this.hass||!this.appliance?!1:n.size===1&&n.has("hass")?io(n.get("hass"),this.hass,this.appliance):!0}willUpdate(){let{hass:n,appliance:r}=this;if(!n||!r)return;let o=Re(n);ft(this,n),this.toggleAttribute("offline",!r.available),this.name=Zn(r,n),this.view=eu(r,n,o,this.now,this.helpers);let i=this.view.status.text||o(`family.${r.spec.family}`);this.setAttribute("aria-label",o("card.label",{name:this.name,status:i}))}render(){let{hass:n,appliance:r,view:o}=this;return!n||!r||!o?v:A`
      <div class="head">
        <span class="name">${this.name}</span>
        ${fo(o.status)}
      </div>
      <div class="stage ${o.display?"has-display":""}">
        ${ho(o.display,o.dim)}
        <div class="drawing">
          ${Nn(Fn(r,o.state,n,this.uid,{pixelHeight:this.size.height}))}
        </div>
      </div>
      ${Ml(o.rows.slice(0,3))} ${this.renderEvent(n,r,o)}
    `}renderEvent(n,r,o){if(!r.entities?.appliance_event?.event)return v;let i=o.event;return A`<div class="event">
      ${i?A`<span class="what">${i.name}</span>
            <time datetime=${new Date(i.time).toISOString()}>${mn(n,i.time,this.now)}</time>`:v}
    </div>`}open(){this.appliance&&this.dispatchEvent(new CustomEvent(sy,{detail:{deviceId:this.appliance.device_id},bubbles:!0,composed:!0}))}};jr.properties={hass:{attribute:!1},appliance:{attribute:!1},now:{attribute:!1},helpers:{attribute:!1}},jr.styles=[pt,uo,ht,te`
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
      /* One quiet line in the panel's columns: what last happened, and when. */
      .event {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        min-height: 18px;
        margin: 6px 4% 0;
        padding: 0 12px;
        color: var(--sz-muted);
        font-size: 12.5px;
        line-height: 18px;
      }
      .event .what {
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .event time {
        flex: none;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
    `];customElements.get("sz-appliance-card")||customElements.define("sz-appliance-card",jr);var cy="/config/integrations/integration/subzero",dy="M8,2H16A2,2 0 0 1 18,4V20A2,2 0 0 1 16,22H8A2,2 0 0 1 6,20V4A2,2 0 0 1 8,2ZM8,4V9H16V4ZM8,11V20H16V11ZM9,5H10.5V8H9ZM9,12H10.5V16H9Z",Br=class extends ve{constructor(){super(),this.appliances=[],this.now=Date.now(),this.helpers=Ce}willUpdate(){ft(this,this.hass)}render(){let t=Re(this.hass);if(!this.appliances.length)return this.renderEmpty(t);let n=this.groups(),r=n.length>1||n[0]?.areaId!==null;return n.map(o=>A`
        <section class="area">
          ${r?A`<h2>${o.name??t("overview.no_area")}</h2>`:v}
          <div class="grid">
            ${Yn(o.appliances,i=>i.appliance.device_id,i=>A`<sz-appliance-card
                .hass=${this.hass}
                .appliance=${i.appliance}
                .now=${this.now}
                .helpers=${this.helpers}
              ></sz-appliance-card>`)}
          </div>
        </section>
      `)}groups(){let t=this.hass,n=[this.appliances,t?.devices,t?.areas,t?.language,t?.locale];return(!this.grouped||n.some((r,o)=>r!==this.grouped.key[o]))&&(this.grouped={key:n,groups:bl(this.appliances,t)}),this.grouped.groups}renderEmpty(t){let n=this.hass?.user?.is_admin===!0;return A`<div class="empty">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d=${dy}></path></svg>
      <h2>${t("overview.empty_title")}</h2>
      <p>${t(n?"overview.empty_text":"overview.empty_text_user")}</p>
      ${n?A`<a class="sz-button primary" href=${cy} @click=${Sl}>
            ${t("overview.empty_link")}
          </a>`:v}
    </div>`}};Br.properties={hass:{attribute:!1},appliances:{attribute:!1},now:{attribute:!1},helpers:{attribute:!1}},Br.styles=[pt,ut,te`
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
    `];customElements.get("sz-overview")||customElements.define("sz-overview",Br);var py="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z",uy="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",fy="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",Kr=class extends ve{constructor(){super();this.subscription=new po(n=>{this.appliances=Array.isArray(n?.appliances)?$l(n.appliances):[],this.error=null},n=>{this.appliances=null,this.error=Et(n)});this.openedFromOverview=!1;this.tick=()=>{this.now=Date.now(),this.timer=setTimeout(this.tick,1e3-this.now%1e3+5)};this.onOpen=n=>{this.openedFromOverview=!0,co(Ai(this.route?.prefix,{view:"appliance",deviceId:n.detail.deviceId}))};this.narrow=!1,this.appliances=null,this.error=null,this.now=Date.now()}connectedCallback(){super.connectedCallback(),this.toggleAttribute("framed",!!this.parentElement?.style.paddingTop),this.tick(),this.stopHelpers=Ce.onChange(()=>this.requestUpdate()),this.subscription.connect(this.hass?.connection)}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.timer),this.timer=void 0,this.stopHelpers?.(),this.stopHelpers=void 0,this.subscription.disconnect()}willUpdate(n){ft(this,this.hass),n.has("hass")&&this.isConnected&&this.subscription.connect(this.hass?.connection),this.hass&&this.appliances&&Ce.observe(this.hass,this.appliances)}updated(n){if(!n.has("route"))return;let r=n.get("route"),o=lo(r?.path),i=lo(this.route?.path);i.view==="overview"&&(this.openedFromOverview=!1),!(!r||o.view===i.view)&&this.restoreFocus(o)}async restoreFocus(n){let r=document.activeElement;if(r&&r!==document.body&&!this.shadowRoot?.activeElement)return;let o;if(n.view==="overview")o=this.renderRoot.querySelector(".toolbar .icon-button");else{let i=this.renderRoot.querySelector("sz-overview");await i?.updateComplete,o=[...i?.shadowRoot?.querySelectorAll("sz-appliance-card")??[]].find(a=>a.appliance?.device_id===n.deviceId)}o?.focus({preventScroll:!0})}render(){let n=Re(this.hass),r=lo(this.route?.path),o=r.view==="appliance"?this.appliances?.find(i=>i.device_id===r.deviceId):void 0;return A`
      ${this.renderToolbar(n,r,o)}
      <div class="content">${this.renderContent(n,r,o)}</div>
    `}renderToolbar(n,r,o){let i=r.view==="appliance",a=v;i?a=this.iconButton(uy,n("panel.back"),()=>this.showOverview()):(this.narrow||this.hass?.dockedSidebar==="always_hidden")&&(a=this.iconButton(py,n("panel.menu"),()=>this.toggleMenu()));let s=i&&o?Zn(o,this.hass):n("panel.title");return A`<header class="toolbar ${a===v?"":"with-button"}">
      ${a}
      <h1 class="title">${s}</h1>
    </header>`}iconButton(n,r,o){return A`<button type="button" class="icon-button" aria-label=${r} title=${r} @click=${o}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d=${n}></path></svg>
    </button>`}renderContent(n,r,o){return this.appliances?r.view==="overview"?A`<sz-overview
        .hass=${this.hass}
        .appliances=${this.appliances}
        .now=${this.now}
        .helpers=${Ce}
        @sz-open-appliance=${this.onOpen}
      ></sz-overview>`:o?Hs(o.device_id,A`<sz-appliance-view
        .hass=${this.hass}
        .appliance=${o}
        .narrow=${this.narrow}
        .isAdmin=${this.hass?.user?.is_admin===!0}
        .now=${this.now}
        .helpers=${Ce}
      ></sz-appliance-view>`):A`<div class="state">
        <h2>${n("overview.not_found_title")}</h2>
        <p>${n("overview.not_found_text")}</p>
        <button type="button" class="sz-button primary" @click=${()=>this.showOverview()}>
          ${n("overview.back")}
        </button>
      </div>`:this.error?A`<div class="state" role="alert">
          <svg class="state-icon" viewBox="0 0 24 24" aria-hidden="true"><path d=${fy}></path></svg>
          <h2>${n("overview.error_title")}</h2>
          <p>${this.error}</p>
          <button type="button" class="sz-button primary" @click=${()=>this.retry()}>
            ${n("overview.retry")}
          </button>
        </div>`:A`<div class="state">
        <div class="spinner" role="progressbar" aria-label=${n("overview.loading")}></div>
        <p>${n("overview.loading")}</p>
      </div>`}showOverview(){if(this.openedFromOverview){this.openedFromOverview=!1,history.back();return}co(Ai(this.route?.prefix,{view:"overview"}),{replace:!0})}toggleMenu(){this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))}retry(){this.error=null,this.subscription.retry()}};Kr.properties={hass:{attribute:!1},narrow:{type:Boolean,reflect:!0},route:{attribute:!1},panel:{attribute:!1},appliances:{state:!0},error:{state:!0},now:{state:!0}},Kr.styles=[pt,ut,te`
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
    `];customElements.get("subzero-panel")||customElements.define("subzero-panel",Kr);
