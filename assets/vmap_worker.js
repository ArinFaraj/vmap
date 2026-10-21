// vmap web worker, built from lib 8e47bc6a
(function dartProgram(){function copyProperties(a,b){var s=Object.keys(a)
for(var r=0;r<s.length;r++){var q=s[r]
b[q]=a[q]}}function mixinPropertiesHard(a,b){var s=Object.keys(a)
for(var r=0;r<s.length;r++){var q=s[r]
if(!b.hasOwnProperty(q)){b[q]=a[q]}}}function mixinPropertiesEasy(a,b){Object.assign(b,a)}var z=function(){var s=function(){}
s.prototype={p:{}}
var r=new s()
if(!(Object.getPrototypeOf(r)&&Object.getPrototypeOf(r).p===s.prototype.p))return false
try{if(typeof navigator!="undefined"&&typeof navigator.userAgent=="string"&&navigator.userAgent.indexOf("Chrome/")>=0)return true
if(typeof version=="function"&&version.length==0){var q=version()
if(/^\d+\.\d+\.\d+\.\d+$/.test(q))return true}}catch(p){}return false}()
function inherit(a,b){a.prototype.constructor=a
a.prototype["$i"+a.name]=a
if(b!=null){if(z){Object.setPrototypeOf(a.prototype,b.prototype)
return}var s=Object.create(b.prototype)
copyProperties(a.prototype,s)
a.prototype=s}}function inheritMany(a,b){for(var s=0;s<b.length;s++){inherit(b[s],a)}}function mixinEasy(a,b){mixinPropertiesEasy(b.prototype,a.prototype)
a.prototype.constructor=a}function mixinHard(a,b){mixinPropertiesHard(b.prototype,a.prototype)
a.prototype.constructor=a}function lazy(a,b,c,d){var s=a
a[b]=s
a[c]=function(){if(a[b]===s){a[b]=d()}a[c]=function(){return this[b]}
return a[b]}}function lazyFinal(a,b,c,d){var s=a
a[b]=s
a[c]=function(){if(a[b]===s){var r=d()
if(a[b]!==s){A.zr(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.b(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.q4(b)
return new s(c,this)}:function(){if(s===null)s=A.q4(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.q4(a).prototype
return s}}var x=0
function tearOffParameters(a,b,c,d,e,f,g,h,i,j){if(typeof h=="number"){h+=x}return{co:a,iS:b,iI:c,rC:d,dV:e,cs:f,fs:g,fT:h,aI:i||0,nDA:j}}function installStaticTearOff(a,b,c,d,e,f,g,h){var s=tearOffParameters(a,true,false,c,d,e,f,g,h,false)
var r=staticTearOffGetter(s)
a[b]=r}function installInstanceTearOff(a,b,c,d,e,f,g,h,i,j){c=!!c
var s=tearOffParameters(a,false,c,d,e,f,g,h,i,!!j)
var r=instanceTearOffGetter(c,s)
a[b]=r}function setOrUpdateInterceptorsByTag(a){var s=v.interceptorsByTag
if(!s){v.interceptorsByTag=a
return}copyProperties(a,s)}function setOrUpdateLeafTags(a){var s=v.leafTags
if(!s){v.leafTags=a
return}copyProperties(a,s)}function updateTypes(a){var s=v.types
var r=s.length
s.push.apply(s,a)
return r}function updateHolder(a,b){copyProperties(b,a)
return a}var hunkHelpers=function(){var s=function(a,b,c,d,e){return function(f,g,h,i){return installInstanceTearOff(f,g,a,b,c,d,[h],i,e,false)}},r=function(a,b,c,d){return function(e,f,g,h){return installStaticTearOff(e,f,a,b,c,[g],h,d)}}
return{inherit:inherit,inheritMany:inheritMany,mixin:mixinEasy,mixinHard:mixinHard,installStaticTearOff:installStaticTearOff,installInstanceTearOff:installInstanceTearOff,_instance_0u:s(0,0,null,["$0"],0),_instance_1u:s(0,1,null,["$1"],0),_instance_2u:s(0,2,null,["$2"],0),_instance_0i:s(1,0,null,["$0"],0),_instance_1i:s(1,1,null,["$1"],0),_instance_2i:s(1,2,null,["$2"],0),_static_0:r(0,null,["$0"],0),_static_1:r(1,null,["$1"],0),_static_2:r(2,null,["$2"],0),makeConstList:makeConstList,lazy:lazy,lazyFinal:lazyFinal,updateHolder:updateHolder,convertToFastObject:convertToFastObject,updateTypes:updateTypes,setOrUpdateInterceptorsByTag:setOrUpdateInterceptorsByTag,setOrUpdateLeafTags:setOrUpdateLeafTags}}()
function initializeDeferredHunk(a){x=v.types.length
a(hunkHelpers,v,w,$)}var J={
q9(a,b,c,d){return{i:a,p:b,e:c,x:d}},
oE(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.q6==null){A.yQ()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.e(A.rA("Return interceptor for "+A.v(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.lX
if(o==null)o=$.lX=A.oD(n)
p=q[o]}if(p!=null)return p
p=A.yZ(a)
if(p!=null)return p
if(typeof a=="function")return B.b6
s=Object.getPrototypeOf(a)
if(s==null)return B.ag
if(s===Object.prototype)return B.ag
if(typeof q=="function"){o=$.lX
if(o==null)o=$.lX=A.oD(n)
Object.defineProperty(q,o,{value:B.W,enumerable:false,writable:true,configurable:true})
return B.W}return B.W},
pr(a,b){if(a<0||a>4294967295)throw A.e(A.a6(a,0,4294967295,"length",null))
return J.qZ(new Array(a),b)},
aW(a,b){if(a>4294967295)throw A.e(A.a6(a,0,4294967295,"length",null))
return J.qZ(new Array(a),b)},
qY(a,b){if(a<0)throw A.e(A.aK("Length must be a non-negative integer: "+a,null))
return A.b(new Array(a),b.i("p<0>"))},
pq(a,b){if(a<0)throw A.e(A.aK("Length must be a non-negative integer: "+a,null))
return A.b(new Array(a),b.i("p<0>"))},
qZ(a,b){var s=A.b(a,b.i("p<0>"))
s.$flags=1
return s},
vk(a,b){var s=t.bP
return J.uc(s.a(a),s.a(b))},
r_(a){if(a<256)switch(a){case 9:case 10:case 11:case 12:case 13:case 32:case 133:case 160:return!0
default:return!1}switch(a){case 5760:case 8192:case 8193:case 8194:case 8195:case 8196:case 8197:case 8198:case 8199:case 8200:case 8201:case 8202:case 8232:case 8233:case 8239:case 8287:case 12288:case 65279:return!0
default:return!1}},
r0(a,b){var s,r
for(s=a.length;b<s;){r=a.charCodeAt(b)
if(r!==32&&r!==13&&!J.r_(r))break;++b}return b},
r1(a,b){var s,r,q
for(s=a.length;b>0;b=r){r=b-1
if(!(r<s))return A.a(a,r)
q=a.charCodeAt(r)
if(q!==32&&q!==13&&!J.r_(q))break}return b},
ao(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.ex.prototype
return J.hc.prototype}if(typeof a=="string")return J.cc.prototype
if(a==null)return J.ey.prototype
if(typeof a=="boolean")return J.ew.prototype
if(Array.isArray(a))return J.p.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bF.prototype
if(typeof a=="symbol")return J.dB.prototype
if(typeof a=="bigint")return J.dA.prototype
return a}if(a instanceof A.n)return a
return J.oE(a)},
o(a){if(typeof a=="string")return J.cc.prototype
if(a==null)return a
if(Array.isArray(a))return J.p.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bF.prototype
if(typeof a=="symbol")return J.dB.prototype
if(typeof a=="bigint")return J.dA.prototype
return a}if(a instanceof A.n)return a
return J.oE(a)},
Y(a){if(a==null)return a
if(Array.isArray(a))return J.p.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bF.prototype
if(typeof a=="symbol")return J.dB.prototype
if(typeof a=="bigint")return J.dA.prototype
return a}if(a instanceof A.n)return a
return J.oE(a)},
yH(a){if(typeof a=="number")return J.cJ.prototype
if(a==null)return a
if(!(a instanceof A.n))return J.cp.prototype
return a},
yI(a){if(typeof a=="number")return J.cJ.prototype
if(typeof a=="string")return J.cc.prototype
if(a==null)return a
if(!(a instanceof A.n))return J.cp.prototype
return a},
yJ(a){if(typeof a=="string")return J.cc.prototype
if(a==null)return a
if(!(a instanceof A.n))return J.cp.prototype
return a},
e6(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.bF.prototype
if(typeof a=="symbol")return J.dB.prototype
if(typeof a=="bigint")return J.dA.prototype
return a}if(a instanceof A.n)return a
return J.oE(a)},
m(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.ao(a).D(a,b)},
al(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.yV(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.o(a).h(a,b)},
qn(a,b,c){return J.Y(a).m(a,b,c)},
iN(a,b){return J.Y(a).j(a,b)},
qo(a,b){return J.yJ(a).cn(a,b)},
qp(a,b){return J.Y(a).aw(a,b)},
qq(a,b,c){return J.e6(a).dZ(a,b,c)},
pi(a,b,c){return J.e6(a).e_(a,b,c)},
ua(a,b,c){return J.e6(a).e0(a,b,c)},
ub(a,b,c){return J.e6(a).e1(a,b,c)},
qr(a,b,c){return J.e6(a).e2(a,b,c)},
cw(a,b){return J.Y(a).bK(a,b)},
uc(a,b){return J.yI(a).ab(a,b)},
qs(a,b){return J.o(a).v(a,b)},
e9(a,b){return J.Y(a).P(a,b)},
qt(a,b){return J.Y(a).ad(a,b)},
pj(a,b){return J.Y(a).a3(a,b)},
qu(a){return J.e6(a).gam(a)},
iO(a){return J.Y(a).gu(a)},
bj(a){return J.ao(a).gR(a)},
de(a){return J.o(a).gC(a)},
pk(a){return J.o(a).gJ(a)},
F(a){return J.Y(a).gt(a)},
V(a){return J.o(a).gk(a)},
ud(a){return J.e6(a).geg(a)},
qv(a){return J.ao(a).gW(a)},
ue(a,b,c){return J.Y(a).bq(a,b,c)},
uf(a,b){return J.Y(a).ac(a,b)},
iP(a,b,c){return J.Y(a).aX(a,b,c)},
ug(a,b){return J.o(a).sk(a,b)},
uh(a,b,c,d,e){return J.Y(a).a7(a,b,c,d,e)},
df(a,b){return J.Y(a).U(a,b)},
ui(a,b){return J.Y(a).a_(a,b)},
iQ(a,b){return J.Y(a).ao(a,b)},
qw(a){return J.yH(a).S(a)},
uj(a){return J.Y(a).ey(a)},
qx(a){return J.Y(a).ez(a)},
bk(a){return J.ao(a).q(a)},
qy(a,b){return J.Y(a).cQ(a,b)},
h9:function h9(){},
ew:function ew(){},
ey:function ey(){},
ez:function ez(){},
cd:function cd(){},
hu:function hu(){},
cp:function cp(){},
bF:function bF(){},
dA:function dA(){},
dB:function dB(){},
p:function p(a){this.$ti=a},
hb:function hb(){},
jR:function jR(a){this.$ti=a},
b4:function b4(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cJ:function cJ(){},
ex:function ex(){},
hc:function hc(){},
cc:function cc(){}},A={ps:function ps(){},
dl(a,b,c){if(t.Q.b(a))return new A.f8(a,b.i("@<0>").H(c).i("f8<1,2>"))
return new A.cz(a,b.i("@<0>").H(c).i("cz<1,2>"))},
vl(a){return new A.dD("Field '"+a+"' has been assigned during initialization.")},
vn(a){return new A.dD("Field '"+a+"' has not been initialized.")},
vm(a){return new A.dD("Field '"+a+"' has already been initialized.")},
bM(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
l_(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
ct(a,b,c){return a},
q7(a){var s,r
for(s=$.aU.length,r=0;r<s;++r)if(a===$.aU[r])return!0
return!1},
aX(a,b,c,d){A.a9(b,"start")
if(c!=null){A.a9(c,"end")
if(b>c)A.t(A.a6(b,0,c,"start",null))}return new A.bL(a,b,c,d.i("bL<0>"))},
py(a,b,c,d){if(t.Q.b(a))return new A.cE(a,b,c.i("@<0>").H(d).i("cE<1,2>"))
return new A.cO(a,b,c.i("@<0>").H(d).i("cO<1,2>"))},
rv(a,b,c){var s="takeCount"
A.c3(b,s,t.S)
A.a9(b,s)
if(t.Q.b(a))return new A.el(a,b,c.i("el<0>"))
return new A.cY(a,b,c.i("cY<0>"))},
ro(a,b,c){var s="count"
if(t.Q.b(a)){A.c3(b,s,t.S)
A.a9(b,s)
return new A.dw(a,b,c.i("dw<0>"))}A.c3(b,s,t.S)
A.a9(b,s)
return new A.bJ(a,b,c.i("bJ<0>"))},
qV(a,b,c){return new A.cD(a,b,c.i("cD<0>"))},
aI(){return new A.ck("No element")},
qX(){return new A.ck("Too few elements")},
cq:function cq(){},
eg:function eg(a,b){this.a=a
this.$ti=b},
cz:function cz(a,b){this.a=a
this.$ti=b},
f8:function f8(a,b){this.a=a
this.$ti=b},
f6:function f6(){},
bv:function bv(a,b){this.a=a
this.$ti=b},
cA:function cA(a,b){this.a=a
this.$ti=b},
iW:function iW(a,b){this.a=a
this.b=b},
iV:function iV(a){this.a=a},
dD:function dD(a){this.a=a},
dq:function dq(a){this.a=a},
oT:function oT(){},
kv:function kv(){},
z:function z(){},
a1:function a1(){},
bL:function bL(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.$ti=d},
a2:function a2(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cO:function cO(a,b,c){this.a=a
this.b=b
this.$ti=c},
cE:function cE(a,b,c){this.a=a
this.b=b
this.$ti=c},
eD:function eD(a,b,c){var _=this
_.a=null
_.b=a
_.c=b
_.$ti=c},
ar:function ar(a,b,c){this.a=a
this.b=b
this.$ti=c},
aQ:function aQ(a,b,c){this.a=a
this.b=b
this.$ti=c},
f2:function f2(a,b,c){this.a=a
this.b=b
this.$ti=c},
cY:function cY(a,b,c){this.a=a
this.b=b
this.$ti=c},
el:function el(a,b,c){this.a=a
this.b=b
this.$ti=c},
eY:function eY(a,b,c){this.a=a
this.b=b
this.$ti=c},
bJ:function bJ(a,b,c){this.a=a
this.b=b
this.$ti=c},
dw:function dw(a,b,c){this.a=a
this.b=b
this.$ti=c},
eV:function eV(a,b,c){this.a=a
this.b=b
this.$ti=c},
em:function em(a){this.$ti=a},
en:function en(a){this.$ti=a},
bS:function bS(a,b){this.a=a
this.$ti=b},
cZ:function cZ(a,b){this.a=a
this.$ti=b},
bD:function bD(a,b,c){this.a=a
this.b=b
this.$ti=c},
cD:function cD(a,b,c){this.a=a
this.b=b
this.$ti=c},
bE:function bE(a,b,c){var _=this
_.a=a
_.b=b
_.c=-1
_.$ti=c},
a3:function a3(){},
bR:function bR(){},
dN:function dN(){},
bq:function bq(a,b){this.a=a
this.$ti=b},
fv:function fv(){},
uB(){throw A.e(A.ax("Cannot modify unmodifiable Map"))},
tH(a){var s=A.tG(a)
if(s!=null)return s
return"minified:"+a},
yV(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.dX.b(a)},
v(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.bk(a)
return s},
dJ(a){var s,r=$.rf
if(r==null)r=$.rf=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
vO(a,b){var s,r,q,p,o,n=null,m=/^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i.exec(a)
if(m==null)return n
if(3>=m.length)return A.a(m,3)
s=m[3]
if(b<2||b>36)throw A.e(A.a6(b,2,36,"radix",n))
if(b===10&&s!=null)return parseInt(a,10)
if(b<10||s==null){r=b<=10?47+b:86+b
q=m[1]
for(p=q.length,o=0;o<p;++o)if((q.charCodeAt(o)|32)>r)return n}return parseInt(a,b)},
P(a){var s,r
if(!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(a))return null
s=parseFloat(a)
if(isNaN(s)){r=B.d.bo(a)
if(r==="NaN"||r==="+NaN"||r==="-NaN")return s
return null}return s},
hx(a){var s,r,q,p
if(a instanceof A.n)return A.aT(A.a4(a),null)
s=J.ao(a)
if(s===B.b5||s===B.b7||t.cx.b(a)){r=B.a0(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.aT(A.a4(a),null)},
rg(a){var s,r,q
if(a==null||typeof a=="number"||A.H(a))return J.bk(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.c5)return a.q(0)
if(a instanceof A.bs)return a.dS(!0)
s=$.u4()
for(r=0;r<1;++r){q=s[r].iQ(a)
if(q!=null)return q}return"Instance of '"+A.hx(a)+"'"},
re(a){var s,r,q,p,o=a.length
if(o<=500)return String.fromCharCode.apply(null,a)
for(s="",r=0;r<o;r=q){q=r+500
p=q<o?q:o
s+=String.fromCharCode.apply(null,a.slice(r,p))}return s},
vP(a){var s,r,q,p=A.b([],t.t)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.h)(a),++r){q=a[r]
if(!A.e_(q))throw A.e(A.c2(q))
if(q<=65535)B.a.j(p,q)
else if(q<=1114111){B.a.j(p,55296+(B.b.K(q-65536,10)&1023))
B.a.j(p,56320+(q&1023))}else throw A.e(A.c2(q))}return A.re(p)},
rh(a){var s,r,q
for(s=a.length,r=0;r<s;++r){q=a[r]
if(!A.e_(q))throw A.e(A.c2(q))
if(q<0)throw A.e(A.c2(q))
if(q>65535)return A.vP(a)}return A.re(a)},
vQ(a,b,c){var s,r,q,p
if(c<=500&&b===0&&c===a.length)return String.fromCharCode.apply(null,a)
for(s=b,r="";s<c;s=q){q=s+500
p=q<c?q:c
r+=String.fromCharCode.apply(null,a.subarray(s,p))}return r},
Q(a){var s
if(0<=a){if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.b.K(s,10)|55296)>>>0,s&1023|56320)}}throw A.e(A.a6(a,0,1114111,null,null))},
vN(a){var s=a.$thrownJsError
if(s==null)return null
return A.cu(s)},
ri(a,b){var s
if(a.$thrownJsError==null){s=new Error()
A.ae(a,s)
a.$thrownJsError=s
s.stack=b.q(0)}},
ah(a){throw A.e(A.c2(a))},
a(a,b){if(a==null)J.V(a)
throw A.e(A.oB(a,b))},
oB(a,b){var s,r="index"
if(!A.e_(b))return new A.b3(!0,b,r,null)
s=A.D(J.V(a))
if(b<0||b>=s)return A.jP(b,s,a,r)
return A.rj(b,r)},
yA(a,b,c){if(a<0||a>c)return A.a6(a,0,c,"start",null)
if(b!=null)if(b<a||b>c)return A.a6(b,a,c,"end",null)
return new A.b3(!0,b,"end",null)},
c2(a){return new A.b3(!0,a,null,null)},
ys(a){return a},
e(a){return A.ae(a,new Error())},
ae(a,b){var s
if(a==null)a=new A.bO()
b.dartException=a
s=A.zu
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
zu(){return J.bk(this.dartException)},
t(a,b){throw A.ae(a,b==null?new Error():b)},
x(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.t(A.xl(a,b,c),s)},
xl(a,b,c){var s,r,q,p,o,n,m,l,k
if(typeof b=="string")s=b
else{r="[]=;add;removeWhere;retainWhere;removeRange;setRange;setInt8;setInt16;setInt32;setUint8;setUint16;setUint32;setFloat32;setFloat64".split(";")
q=r.length
p=b
if(p>q){c=p/q|0
p%=q}s=r[p]}o=typeof c=="string"?c:"modify;remove from;add to".split(";")[c]
n=t.j.b(a)?"list":"ByteData"
m=a.$flags|0
l="a "
if((m&4)!==0)k="constant "
else if((m&2)!==0){k="unmodifiable "
l="an "}else k=(m&1)!==0?"fixed-length ":""
return new A.f0("'"+s+"': Cannot "+o+" "+l+k+n)},
h(a){throw A.e(A.a5(a))},
bP(a){var s,r,q,p,o,n
a=A.tE(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.b([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.lo(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
lp(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
ry(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
pt(a,b){var s=b==null,r=s?null:b.method
return new A.hd(a,r,s?null:b.receiver)},
b2(a){var s
if(a==null)return new A.k6(a)
if(a instanceof A.eo){s=a.a
return A.cv(a,s==null?A.bh(s):s)}if(typeof a!=="object")return a
if("dartException" in a)return A.cv(a,a.dartException)
return A.yj(a)},
cv(a,b){if(t.C.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
yj(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.b.K(r,16)&8191)===10)switch(q){case 438:return A.cv(a,A.pt(A.v(s)+" (Error "+q+")",null))
case 445:case 5007:A.v(s)
return A.cv(a,new A.eM())}}if(a instanceof TypeError){p=$.tN()
o=$.tO()
n=$.tP()
m=$.tQ()
l=$.tT()
k=$.tU()
j=$.tS()
$.tR()
i=$.tW()
h=$.tV()
g=p.an(s)
if(g!=null)return A.cv(a,A.pt(A.W(s),g))
else{g=o.an(s)
if(g!=null){g.method="call"
return A.cv(a,A.pt(A.W(s),g))}else if(n.an(s)!=null||m.an(s)!=null||l.an(s)!=null||k.an(s)!=null||j.an(s)!=null||m.an(s)!=null||i.an(s)!=null||h.an(s)!=null){A.W(s)
return A.cv(a,new A.eM())}}return A.cv(a,new A.hW(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.eW()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.cv(a,new A.b3(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.eW()
return a},
cu(a){var s
if(a instanceof A.eo)return a.b
if(a==null)return new A.fj(a)
s=a.$cachedTrace
if(s!=null)return s
s=new A.fj(a)
if(typeof a==="object")a.$cachedTrace=s
return s},
oU(a){if(a==null)return J.bj(a)
if(typeof a=="object")return A.dJ(a)
return J.bj(a)},
yv(a){if(typeof a=="number")return B.c.gR(a)
if(a instanceof A.iD)return A.dJ(a)
if(a instanceof A.bs)return a.gR(a)
return A.oU(a)},
tu(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.m(0,a[s],a[r])}return b},
xA(a,b,c,d,e,f){t.gY.a(a)
switch(A.D(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.e(new A.lE("Unsupported number of arguments for wrapped closure"))},
e5(a,b){var s=a.$identity
if(!!s)return s
s=A.yw(a,b)
a.$identity=s
return s},
yw(a,b){var s
switch(b){case 0:s=a.$0
break
case 1:s=a.$1
break
case 2:s=a.$2
break
case 3:s=a.$3
break
case 4:s=a.$4
break
default:s=null}if(s!=null)return s.bind(a)
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.xA)},
uz(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.hG().constructor.prototype):Object.create(new A.dh(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.qG(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.uv(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.qG(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
uv(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.e("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.uq)}throw A.e("Error in functionType of tearoff")},
uw(a,b,c,d){var s=A.qC
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
qG(a,b,c,d){if(c)return A.uy(a,b,d)
return A.uw(b.length,d,a,b)},
ux(a,b,c,d){var s=A.qC,r=A.ur
switch(b?-1:a){case 0:throw A.e(new A.hA("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
uy(a,b,c){var s,r
if($.qA==null)$.qA=A.qz("interceptor")
if($.qB==null)$.qB=A.qz("receiver")
s=b.length
r=A.ux(s,c,a,b)
return r},
q4(a){return A.uz(a)},
uq(a,b){return A.fr(v.typeUniverse,A.a4(a.a),b)},
qC(a){return a.a},
ur(a){return a.b},
qz(a){var s,r,q,p=new A.dh("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.e(A.aK("Field name "+a+" not found.",null))},
oD(a){return v.getIsolateTag(a)},
A8(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
yZ(a){var s,r,q,p,o,n=A.W($.tv.$1(a)),m=$.oC[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.oM[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.dY($.to.$2(a,n))
if(q!=null){m=$.oC[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.oM[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.oQ(s)
$.oC[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.oM[n]=s
return s}if(p==="-"){o=A.oQ(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.tC(a,s)
if(p==="*")throw A.e(A.rA(n))
if(v.leafTags[n]===true){o=A.oQ(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.tC(a,s)},
tC(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.q9(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
oQ(a){return J.q9(a,!1,null,!!a.$iaM)},
z0(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.oQ(s)
else return J.q9(s,c,null,null)},
yQ(){if(!0===$.q6)return
$.q6=!0
A.yR()},
yR(){var s,r,q,p,o,n,m,l
$.oC=Object.create(null)
$.oM=Object.create(null)
A.yP()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.tD.$1(o)
if(n!=null){m=A.z0(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
yP(){var s,r,q,p,o,n,m=B.an()
m=A.e4(B.ao,A.e4(B.ap,A.e4(B.a1,A.e4(B.a1,A.e4(B.aq,A.e4(B.ar,A.e4(B.as(B.a0),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.tv=new A.oJ(p)
$.to=new A.oK(o)
$.tD=new A.oL(n)},
e4(a,b){return a(b)||b},
yy(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
r2(a,b,c,d,e,f){var s=b?"m":"",r=c?"":"i",q=d?"u":"",p=e?"s":"",o=function(g,h){try{return new RegExp(g,h)}catch(n){return n}}(a,s+r+q+p+f)
if(o instanceof RegExp)return o
throw A.e(A.es("Illegal RegExp pattern ("+String(o)+")",a,null))},
zk(a,b,c){var s
if(typeof b=="string")return a.indexOf(b,c)>=0
else if(b instanceof A.dz){s=B.d.aq(a,c)
return b.b.test(s)}else return!J.qo(b,B.d.aq(a,c)).gC(0)},
yB(a){if(a.indexOf("$",0)>=0)return a.replace(/\$/g,"$$$$")
return a},
tE(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
qe(a,b,c){var s=A.zl(a,b,c)
return s},
zl(a,b,c){var s,r,q
if(b===""){if(a==="")return c
s=a.length
for(r=c,q=0;q<s;++q)r=r+a[q]+c
return r.charCodeAt(0)==0?r:r}if(a.indexOf(b,0)<0)return a
if(a.length<500||c.indexOf("$",0)>=0)return a.split(b).join(c)
return a.replace(new RegExp(A.tE(b),"g"),A.yB(c))},
p3(a,b,c,d){var s=a.indexOf(b,d)
if(s<0)return a
return A.zm(a,s,s+b.length,c)},
zm(a,b,c,d){return a.substring(0,b)+d+a.substring(c)},
f:function f(a,b){this.a=a
this.b=b},
aS:function aS(a,b,c){this.a=a
this.b=b
this.c=c},
ds:function ds(){},
af:function af(a,b,c){this.a=a
this.b=b
this.$ti=c},
d4:function d4(a,b){this.a=a
this.$ti=b},
bX:function bX(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
c8:function c8(a,b){this.a=a
this.$ti=b},
dt:function dt(){},
b8:function b8(a,b,c){this.a=a
this.b=b
this.$ti=c},
c9:function c9(a,b){this.a=a
this.$ti=b},
eQ:function eQ(){},
lo:function lo(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
eM:function eM(){},
hd:function hd(a,b,c){this.a=a
this.b=b
this.c=c},
hW:function hW(a){this.a=a},
k6:function k6(a){this.a=a},
eo:function eo(a,b){this.a=a
this.b=b},
fj:function fj(a){this.a=a
this.b=null},
c5:function c5(){},
fL:function fL(){},
fM:function fM(){},
hO:function hO(){},
hG:function hG(){},
dh:function dh(a,b){this.a=a
this.b=b},
hA:function hA(a){this.a=a},
b9:function b9(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
jS:function jS(a){this.a=a},
jZ:function jZ(a,b){var _=this
_.a=a
_.b=b
_.d=_.c=null},
aq:function aq(a,b){this.a=a
this.$ti=b},
eA:function eA(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
ba:function ba(a,b){this.a=a
this.$ti=b},
cN:function cN(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bG:function bG(a,b){this.a=a
this.$ti=b},
cM:function cM(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
cK:function cK(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
oJ:function oJ(a){this.a=a},
oK:function oK(a){this.a=a},
oL:function oL(a){this.a=a},
bs:function bs(){},
dV:function dV(){},
dW:function dW(){},
dz:function dz(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
ir:function ir(a){this.b=a},
hZ:function hZ(a,b,c){this.a=a
this.b=b
this.c=c},
f3:function f3(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
eX:function eX(a,b){this.a=a
this.c=b},
iz:function iz(a,b,c){this.a=a
this.b=b
this.c=c},
iA:function iA(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
c0(a,b,c){},
R(a){return a},
vy(a,b,c){var s
A.c0(a,b,c)
s=new DataView(a,b,c)
return s},
vz(a,b,c){A.c0(a,b,c)
return new Float32Array(a,b,c)},
vA(a,b,c){A.c0(a,b,c)
return new Float64Array(a,b,c)},
cT(a){return new Int32Array(A.R(a))},
vB(a){return new Uint16Array(a)},
vC(a,b,c){A.c0(a,b,c)
return new Uint16Array(a,b,c)},
vD(a){return new Uint8Array(a)},
pz(a,b,c){A.c0(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
c_(a,b,c){if(a>>>0!==a||a>=c)throw A.e(A.oB(b,a))},
bi(a,b,c){var s
if(!(a>>>0!==a))if(b==null)s=a>c
else s=b>>>0!==b||a>b||b>c
else s=!0
if(s)throw A.e(A.yA(a,b,c))
if(b==null)return c
return b},
ce:function ce(){},
dI:function dI(){},
eI:function eI(){},
mc:function mc(a){this.a=a},
eH:function eH(){},
as:function as(){},
cf:function cf(){},
aN:function aN(){},
cQ:function cQ(){},
cR:function cR(){},
hn:function hn(){},
cS:function cS(){},
ho:function ho(){},
cU:function cU(){},
eJ:function eJ(){},
eK:function eK(){},
cg:function cg(){},
fd:function fd(){},
fe:function fe(){},
ff:function ff(){},
fg:function fg(){},
pB(a,b){var s=b.c
return s==null?b.c=A.fp(a,"ab",[b.x]):s},
rn(a){var s=a.w
if(s===6||s===7)return A.rn(a.x)
return s===11||s===12},
vW(a){return a.as},
ak(a){return A.mb(v.typeUniverse,a,!1)},
dc(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.dc(a1,s,a3,a4)
if(r===s)return a2
return A.rS(a1,r,!0)
case 7:s=a2.x
r=A.dc(a1,s,a3,a4)
if(r===s)return a2
return A.rR(a1,r,!0)
case 8:q=a2.y
p=A.e3(a1,q,a3,a4)
if(p===q)return a2
return A.fp(a1,a2.x,p)
case 9:o=a2.x
n=A.dc(a1,o,a3,a4)
m=a2.y
l=A.e3(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.pJ(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.e3(a1,j,a3,a4)
if(i===j)return a2
return A.rT(a1,k,i)
case 11:h=a2.x
g=A.dc(a1,h,a3,a4)
f=a2.y
e=A.yf(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.rQ(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.e3(a1,d,a3,a4)
o=a2.x
n=A.dc(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.pK(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.e(A.fG("Attempted to substitute unexpected RTI kind "+a0))}},
e3(a,b,c,d){var s,r,q,p,o=b.length,n=A.mg(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.dc(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
yg(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.mg(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.dc(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
yf(a,b,c,d){var s,r=b.a,q=A.e3(a,r,c,d),p=b.b,o=A.e3(a,p,c,d),n=b.c,m=A.yg(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.ih()
s.a=q
s.b=o
s.c=m
return s},
b(a,b){a[v.arrayRti]=b
return a},
q5(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.yM(s)
return a.$S()}return null},
yS(a,b){var s
if(A.rn(b))if(a instanceof A.c5){s=A.q5(a)
if(s!=null)return s}return A.a4(a)},
a4(a){if(a instanceof A.n)return A.u(a)
if(Array.isArray(a))return A.M(a)
return A.pP(J.ao(a))},
M(a){var s=a[v.arrayRti],r=t.dG
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
u(a){var s=a.$ti
return s!=null?s:A.pP(a)},
pP(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.xw(a,s)},
xw(a,b){var s=a instanceof A.c5?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.wW(v.typeUniverse,s.name)
b.$ccache=r
return r},
yM(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.mb(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
yK(a){return A.bt(A.u(a))},
q_(a){var s
if(a instanceof A.bs)return a.dl()
s=a instanceof A.c5?A.q5(a):null
if(s!=null)return s
if(t.aJ.b(a))return J.qv(a).a
if(Array.isArray(a))return A.M(a)
return A.a4(a)},
bt(a){var s=a.r
return s==null?a.r=new A.iD(a):s},
yC(a,b){var s,r,q=b,p=q.length
if(p===0)return t.aK
if(0>=p)return A.a(q,0)
s=A.fr(v.typeUniverse,A.q_(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.a(q,r)
s=A.rV(v.typeUniverse,s,A.q_(q[r]))}return A.fr(v.typeUniverse,s,a)},
b1(a){return A.bt(A.mb(v.typeUniverse,a,!1))},
xv(a){var s=this
s.b=A.yd(s)
return s.b(a)},
yd(a){var s,r,q,p,o
if(a===t.K)return A.xH
if(A.dd(a))return A.xL
s=a.w
if(s===6)return A.xr
if(s===1)return A.t9
if(s===7)return A.xC
r=A.yc(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.dd)){a.f="$i"+q
if(q==="l")return A.xF
if(a===t.m)return A.xE
return A.xK}}else if(s===10){p=A.yy(a.x,a.y)
o=p==null?A.t9:p
return o==null?A.bh(o):o}return A.xp},
yc(a){if(a.w===8){if(a===t.S)return A.e_
if(a===t.i||a===t.cZ)return A.xG
if(a===t.N)return A.xJ
if(a===t.B)return A.H}return null},
xu(a){var s=this,r=A.xo
if(A.dd(s))r=A.x7
else if(s===t.K)r=A.bh
else if(A.e7(s)){r=A.xq
if(s===t.aV)r=A.x5
else if(s===t.bl)r=A.dY
else if(s===t.fU)r=A.x3
else if(s===t.jh)r=A.fw
else if(s===t.jX)r=A.x4
else if(s===t.mU)r=A.x6}else if(s===t.S)r=A.D
else if(s===t.N)r=A.W
else if(s===t.B)r=A.pL
else if(s===t.cZ)r=A.ai
else if(s===t.i)r=A.db
else if(s===t.m)r=A.b0
s.a=r
return s.a(a)},
xp(a){var s=this
if(a==null)return A.e7(s)
return A.yW(v.typeUniverse,A.yS(a,s),s)},
xr(a){if(a==null)return!0
return this.x.b(a)},
xK(a){var s,r=this
if(a==null)return A.e7(r)
s=r.f
if(a instanceof A.n)return!!a[s]
return!!J.ao(a)[s]},
xF(a){var s,r=this
if(a==null)return A.e7(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.n)return!!a[s]
return!!J.ao(a)[s]},
xE(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.n)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
t8(a){if(typeof a=="object"){if(a instanceof A.n)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
xo(a){var s=this
if(a==null){if(A.e7(s))return a}else if(s.b(a))return a
throw A.ae(A.t4(a,s),new Error())},
xq(a){var s=this
if(a==null||s.b(a))return a
throw A.ae(A.t4(a,s),new Error())},
t4(a,b){return new A.fn("TypeError: "+A.rE(a,A.aT(b,null)))},
rE(a,b){return A.h1(a)+": type '"+A.aT(A.q_(a),null)+"' is not a subtype of type '"+b+"'"},
b_(a,b){return new A.fn("TypeError: "+A.rE(a,b))},
xC(a){var s=this
return s.x.b(a)||A.pB(v.typeUniverse,s).b(a)},
xH(a){return a!=null},
bh(a){if(a!=null)return a
throw A.ae(A.b_(a,"Object"),new Error())},
xL(a){return!0},
x7(a){return a},
t9(a){return!1},
H(a){return!0===a||!1===a},
pL(a){if(!0===a)return!0
if(!1===a)return!1
throw A.ae(A.b_(a,"bool"),new Error())},
x3(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.ae(A.b_(a,"bool?"),new Error())},
db(a){if(typeof a=="number")return a
throw A.ae(A.b_(a,"double"),new Error())},
x4(a){if(typeof a=="number")return a
if(a==null)return a
throw A.ae(A.b_(a,"double?"),new Error())},
e_(a){return typeof a=="number"&&Math.floor(a)===a},
D(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.ae(A.b_(a,"int"),new Error())},
x5(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.ae(A.b_(a,"int?"),new Error())},
xG(a){return typeof a=="number"},
ai(a){if(typeof a=="number")return a
throw A.ae(A.b_(a,"num"),new Error())},
fw(a){if(typeof a=="number")return a
if(a==null)return a
throw A.ae(A.b_(a,"num?"),new Error())},
xJ(a){return typeof a=="string"},
W(a){if(typeof a=="string")return a
throw A.ae(A.b_(a,"String"),new Error())},
dY(a){if(typeof a=="string")return a
if(a==null)return a
throw A.ae(A.b_(a,"String?"),new Error())},
b0(a){if(A.t8(a))return a
throw A.ae(A.b_(a,"JSObject"),new Error())},
x6(a){if(a==null)return a
if(A.t8(a))return a
throw A.ae(A.b_(a,"JSObject?"),new Error())},
th(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.aT(a[q],b)
return s},
y4(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.th(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.aT(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
t6(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
if(a5!=null){s=a5.length
if(a4==null)a4=A.b([],t.s)
else a2=a4.length
r=a4.length
for(q=s;q>0;--q)B.a.j(a4,"T"+(r+q))
for(p=t.O,o="<",n="",q=0;q<s;++q,n=a1){m=a4.length
l=m-1-q
if(!(l>=0))return A.a(a4,l)
o=o+n+a4[l]
k=a5[q]
j=k.w
if(!(j===2||j===3||j===4||j===5||k===p))o+=" extends "+A.aT(k,a4)}o+=">"}else o=""
p=a3.x
i=a3.y
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.aT(p,a4)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.aT(h[q],a4)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.aT(f[q],a4)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.aT(d[q+2],a4)+" "+d[q]}a+="}"}if(a2!=null){a4.toString
a4.length=a2}return o+"("+a+") => "+b},
aT(a,b){var s,r,q,p,o,n,m,l=a.w
if(l===5)return"erased"
if(l===2)return"dynamic"
if(l===3)return"void"
if(l===1)return"Never"
if(l===4)return"any"
if(l===6){s=a.x
r=A.aT(s,b)
q=s.w
return(q===11||q===12?"("+r+")":r)+"?"}if(l===7)return"FutureOr<"+A.aT(a.x,b)+">"
if(l===8){p=A.yi(a.x)
o=a.y
return o.length>0?p+("<"+A.th(o,b)+">"):p}if(l===10)return A.y4(a,b)
if(l===11)return A.t6(a,b,null)
if(l===12)return A.t6(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.a(b,n)
return b[n]}return"?"},
yi(a){var s=A.tG(a)
if(s!=null)return s
return"minified:"+a},
wX(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
wW(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.mb(a,b,!1)
else if(typeof m=="number"){s=m
r=A.fq(a,5,"#")
q=A.mg(s)
for(p=0;p<s;++p)q[p]=r
o=A.fp(a,b,q)
n[b]=o
return o}else return m},
wV(a,b){return A.rX(a.tR,b)},
wU(a,b){return A.rX(a.eT,b)},
mb(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.rU(a,null,b,!1)
r.set(b,s)
return s},
fr(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.rU(a,b,c,!0)
q.set(c,r)
return r},
rV(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.pJ(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
rU(a,b,c,d){return A.wM(A.wG(a,b,c,d))},
cs(a,b){b.a=A.xu
b.b=A.xv
return b},
fq(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.bc(null,null)
s.w=b
s.as=c
r=A.cs(a,s)
a.eC.set(c,r)
return r},
rS(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.wS(a,b,r,c)
a.eC.set(r,s)
return s},
wS(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.dd(b))if(!(b===t.P||b===t.x))if(s!==6)r=s===7&&A.e7(b.x)
if(r)return b
else if(s===1)return t.P}q=new A.bc(null,null)
q.w=6
q.x=b
q.as=c
return A.cs(a,q)},
rR(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.wQ(a,b,r,c)
a.eC.set(r,s)
return s},
wQ(a,b,c,d){var s,r
if(d){s=b.w
if(A.dd(b)||b===t.K)return b
else if(s===1)return A.fp(a,"ab",[b])
else if(b===t.P||b===t.x)return t.gK}r=new A.bc(null,null)
r.w=7
r.x=b
r.as=c
return A.cs(a,r)},
wT(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.bc(null,null)
s.w=13
s.x=b
s.as=q
r=A.cs(a,s)
a.eC.set(q,r)
return r},
fo(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
wP(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
fp(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.fo(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.bc(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.cs(a,r)
a.eC.set(p,q)
return q},
pJ(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.fo(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.bc(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.cs(a,o)
a.eC.set(q,n)
return n},
rT(a,b,c){var s,r,q="+"+(b+"("+A.fo(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.bc(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.cs(a,s)
a.eC.set(q,r)
return r},
rQ(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.fo(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.fo(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.wP(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.bc(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.cs(a,p)
a.eC.set(r,o)
return o},
pK(a,b,c,d){var s,r=b.as+("<"+A.fo(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.wR(a,b,c,r,d)
a.eC.set(r,s)
return s},
wR(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.mg(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.dc(a,b,r,0)
m=A.e3(a,c,r,0)
return A.pK(a,n,m,c!==m)}}l=new A.bc(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.cs(a,l)},
wG(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
wM(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.wI(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.rL(a,r,l,k,!1)
else if(q===46)r=A.rL(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.d8(a.u,a.e,k.pop()))
break
case 94:k.push(A.wT(a.u,k.pop()))
break
case 35:k.push(A.fq(a.u,5,"#"))
break
case 64:k.push(A.fq(a.u,2,"@"))
break
case 126:k.push(A.fq(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.wK(a,k)
break
case 38:A.wJ(a,k)
break
case 63:p=a.u
k.push(A.rS(p,A.d8(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.rR(p,A.d8(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.wH(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.rM(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.wN(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-2)
break
case 43:n=l.indexOf("(",r)
k.push(l.substring(r,n))
k.push(-4)
k.push(a.p)
a.p=k.length
r=n+1
break
default:throw"Bad character "+q}}}m=k.pop()
return A.d8(a.u,a.e,m)},
wI(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
rL(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.wX(s,o.x)[p]
if(n==null)A.t('No "'+p+'" in "'+A.vW(o)+'"')
d.push(A.fr(s,o,n))}else d.push(p)
return m},
wK(a,b){var s,r=a.u,q=A.rK(a,b),p=b.pop()
if(typeof p=="string")b.push(A.fp(r,p,q))
else{s=A.d8(r,a.e,p)
switch(s.w){case 11:b.push(A.pK(r,s,q,a.n))
break
default:b.push(A.pJ(r,s,q))
break}}},
wH(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.rK(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.d8(p,a.e,o)
q=new A.ih()
q.a=s
q.b=n
q.c=m
b.push(A.rQ(p,r,q))
return
case-4:b.push(A.rT(p,b.pop(),s))
return
default:throw A.e(A.fG("Unexpected state under `()`: "+A.v(o)))}},
wJ(a,b){var s=b.pop()
if(0===s){b.push(A.fq(a.u,1,"0&"))
return}if(1===s){b.push(A.fq(a.u,4,"1&"))
return}throw A.e(A.fG("Unexpected extended operation "+A.v(s)))},
rK(a,b){var s=b.splice(a.p)
A.rM(a.u,a.e,s)
a.p=b.pop()
return s},
d8(a,b,c){if(typeof c=="string")return A.fp(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.wL(a,b,c)}else return c},
rM(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.d8(a,b,c[s])},
wN(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.d8(a,b,c[s])},
wL(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.e(A.fG("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.e(A.fG("Bad index "+c+" for "+b.q(0)))},
yW(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.ag(a,b,null,c,null)
r.set(c,s)}return s},
ag(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.dd(d))return!0
s=b.w
if(s===4)return!0
if(A.dd(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.ag(a,c[b.x],c,d,e))return!0
q=d.w
p=t.P
if(b===p||b===t.x){if(q===7)return A.ag(a,b,c,d.x,e)
return d===p||d===t.x||q===6}if(d===t.K){if(s===7)return A.ag(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.ag(a,b.x,c,d,e))return!1
return A.ag(a,A.pB(a,b),c,d,e)}if(s===6)return A.ag(a,p,c,d,e)&&A.ag(a,b.x,c,d,e)
if(q===7){if(A.ag(a,b,c,d.x,e))return!0
return A.ag(a,b,c,A.pB(a,d),e)}if(q===6)return A.ag(a,b,c,p,e)||A.ag(a,b,c,d.x,e)
if(r)return!1
p=s!==11
if((!p||s===12)&&d===t.gY)return!0
o=s===10
if(o&&d===t.lZ)return!0
if(q===12){if(b===t.et)return!0
if(s!==12)return!1
n=b.y
m=d.y
l=n.length
if(l!==m.length)return!1
c=c==null?n:n.concat(c)
e=e==null?m:m.concat(e)
for(k=0;k<l;++k){j=n[k]
i=m[k]
if(!A.ag(a,j,c,i,e)||!A.ag(a,i,e,j,c))return!1}return A.t7(a,b.x,c,d.x,e)}if(q===11){if(b===t.et)return!0
if(p)return!1
return A.t7(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.xD(a,b,c,d,e)}if(o&&q===10)return A.xI(a,b,c,d,e)
return!1},
t7(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.ag(a3,a4.x,a5,a6.x,a7))return!1
s=a4.y
r=a6.y
q=s.a
p=r.a
o=q.length
n=p.length
if(o>n)return!1
m=n-o
l=s.b
k=r.b
j=l.length
i=k.length
if(o+j<n+i)return!1
for(h=0;h<o;++h){g=q[h]
if(!A.ag(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.ag(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.ag(a3,k[h],a7,g,a5))return!1}f=s.c
e=r.c
d=f.length
c=e.length
for(b=0,a=0;a<c;a+=3){a0=e[a]
for(;;){if(b>=d)return!1
a1=f[b]
b+=3
if(a0<a1)return!1
a2=f[b-2]
if(a1<a0){if(a2)return!1
continue}g=e[a+1]
if(a2&&!g)return!1
g=f[b-1]
if(!A.ag(a3,e[a+2],a7,g,a5))return!1
break}}while(b<d){if(f[b+1])return!1
b+=3}return!0},
xD(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.fr(a,b,r[o])
return A.rY(a,p,null,c,d.y,e)}return A.rY(a,b.y,null,c,d.y,e)},
rY(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.ag(a,b[s],d,e[s],f))return!1
return!0},
xI(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.ag(a,r[s],c,q[s],e))return!1
return!0},
e7(a){var s=a.w,r=!0
if(!(a===t.P||a===t.x))if(!A.dd(a))if(s!==6)r=s===7&&A.e7(a.x)
return r},
dd(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.O},
rX(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
mg(a){return a>0?new Array(a):v.typeUniverse.sEA},
bc:function bc(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
ih:function ih(){this.c=this.b=this.a=null},
iD:function iD(a){this.a=a},
ia:function ia(){},
fn:function fn(a){this.a=a},
wn(){var s,r,q
if(self.scheduleImmediate!=null)return A.ym()
if(self.MutationObserver!=null&&self.document!=null){s={}
r=self.document.createElement("div")
q=self.document.createElement("span")
s.a=null
new self.MutationObserver(A.e5(new A.lx(s),1)).observe(r,{childList:true})
return new A.lw(s,r,q)}else if(self.setImmediate!=null)return A.yn()
return A.yo()},
wo(a){self.scheduleImmediate(A.e5(new A.ly(t.M.a(a)),0))},
wp(a){self.setImmediate(A.e5(new A.lz(t.M.a(a)),0))},
wq(a){A.pF(B.aB,t.M.a(a))},
pF(a,b){return A.wO(a.a/1000|0,b)},
wO(a,b){var s=new A.m9()
s.eM(a,b)
return s},
aC(a){return new A.i_(new A.L($.J,a.i("L<0>")),a.i("i_<0>"))},
aB(a,b){a.$2(0,null)
b.b=!0
return b.a},
a0(a,b){A.x8(a,b)},
aA(a,b){b.cr(a)},
az(a,b){b.cs(A.b2(a),A.cu(a))},
x8(a,b){var s,r,q=new A.mi(b),p=new A.mj(b)
if(a instanceof A.L)a.dR(q,p,t.z)
else{s=t.z
if(a instanceof A.L)a.bl(q,p,s)
else{r=new A.L($.J,t._)
r.a=8
r.c=a
r.dR(q,p,s)}}},
aD(a){var s=function(b,c){return function(d,e){while(true){try{b(d,e)
break}catch(r){e=r
d=c}}}}(a,1)
return $.J.cI(new A.on(s),t.o,t.S,t.z)},
rP(a,b,c){return 0},
pl(a){var s
if(t.C.b(a)){s=a.gb2()
if(s!=null)return s}return B.B},
uX(a,b){var s
if(!b.b(null))throw A.e(A.iS(null,"computation","The type parameter is not nullable"))
s=new A.L($.J,b.i("L<0>"))
A.rx(a,new A.ju(null,s,b))
return s},
xx(a,b){if($.J===B.f)return null
return null},
xy(a,b){if($.J!==B.f)A.xx(a,b)
if(b==null)if(t.C.b(a)){b=a.gb2()
if(b==null){A.ri(a,B.B)
b=B.B}}else b=B.B
else if(t.C.b(a))A.ri(a,b)
return new A.am(a,b)},
lJ(a,b,c){var s,r,q,p,o={},n=o.a=a
for(s=t._;r=n.a,(r&4)!==0;n=a){a=s.a(n.c)
o.a=a}if(n===b){s=A.rp()
b.b5(new A.am(new A.b3(!0,n,null,"Cannot complete a future with itself"),s))
return}q=b.a&1
s=n.a=r|q
if((s&24)===0){p=t.F.a(b.c)
b.a=b.a&1|4
b.c=n
n.dG(p)
return}if(!c)if(b.c==null)n=(s&16)===0||q!==0
else n=!1
else n=!0
if(n){p=b.b9()
b.bw(o.a)
A.d3(b,p)
return}b.a^=2
A.e2(null,null,b.b,t.M.a(new A.lK(o,b)))},
d3(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d={},c=d.a=a
for(s=t.v,r=t.F;;){q={}
p=c.a
o=(p&16)===0
n=!o
if(b==null){if(n&&(p&1)===0){m=s.a(c.c)
A.iI(m.a,m.b)}return}q.a=b
l=b.a
for(c=b;l!=null;c=l,l=k){c.a=null
A.d3(d.a,c)
q.a=l
k=l.a}p=d.a
j=p.c
q.b=n
q.c=j
if(o){i=c.c
i=(i&1)!==0||(i&15)===8}else i=!0
if(i){h=c.b.b
if(n){p=p.b===h
p=!(p||p)}else p=!1
if(p){s.a(j)
A.iI(j.a,j.b)
return}g=$.J
if(g!==h)$.J=h
else g=null
c=c.c
if((c&15)===8)new A.lO(q,d,n).$0()
else if(o){if((c&1)!==0)new A.lN(q,j).$0()}else if((c&2)!==0)new A.lM(d,q).$0()
if(g!=null)$.J=g
c=q.c
if(c instanceof A.L){p=q.a.$ti
p=p.i("ab<2>").b(c)||!p.y[1].b(c)}else p=!1
if(p){f=q.a.b
if((c.a&24)!==0){e=r.a(f.c)
f.c=null
b=f.bE(e)
f.a=c.a&30|f.a&1
f.c=c.c
d.a=c
continue}else A.lJ(c,f,!0)
return}}f=q.a.b
e=r.a(f.c)
f.c=null
b=f.bE(e)
c=q.b
p=q.c
if(!c){f.$ti.c.a(p)
f.a=8
f.c=p}else{s.a(p)
f.a=f.a&1|16
f.c=p}d.a=f
c=f}},
y5(a,b){var s
if(t.ng.b(a))return b.cI(a,t.z,t.K,t.l)
s=t.E
if(s.b(a))return s.a(a)
throw A.e(A.iS(a,"onError",u.c))},
xV(){var s,r
for(s=$.e1;s!=null;s=$.e1){$.fA=null
r=s.b
$.e1=r
if(r==null)$.fz=null
s.a.$0()}},
ye(){$.pR=!0
try{A.xV()}finally{$.fA=null
$.pR=!1
if($.e1!=null)$.qj().$1(A.tp())}},
ti(a){var s=new A.i0(a),r=$.fz
if(r==null){$.e1=$.fz=s
if(!$.pR)$.qj().$1(A.tp())}else $.fz=r.b=s},
y9(a){var s,r,q,p=$.e1
if(p==null){A.ti(a)
$.fA=$.fz
return}s=new A.i0(a)
r=$.fA
if(r==null){s.b=p
$.e1=$.fA=s}else{q=r.b
s.b=q
$.fA=r.b=s
if(q==null)$.fz=s}},
ze(a){var s=null,r=$.J
if(B.f===r){A.e2(s,s,B.f,a)
return}A.e2(s,s,r,t.M.a(r.cq(a)))},
zE(a,b){return new A.d9(A.ct(a,"stream",t.K),b.i("d9<0>"))},
pY(a){return},
wr(a,b){if(b==null)b=A.yp()
if(t.b9.b(b))return a.cI(b,t.z,t.K,t.l)
if(t.i6.b(b))return t.E.a(b)
throw A.e(A.aK("handleError callback must take either an Object (the error), or both an Object (the error) and a StackTrace.",null))},
xY(a,b){A.iI(a,b)},
rx(a,b){var s=$.J
if(s===B.f)return A.pF(a,t.M.a(b))
return A.pF(a,t.M.a(s.cq(b)))},
iI(a,b){A.y9(new A.of(a,b))},
tf(a,b,c,d,e){var s,r=$.J
if(r===c)return d.$0()
$.J=c
s=r
try{r=d.$0()
return r}finally{$.J=s}},
tg(a,b,c,d,e,f,g){var s,r=$.J
if(r===c)return d.$1(e)
$.J=c
s=r
try{r=d.$1(e)
return r}finally{$.J=s}},
y7(a,b,c,d,e,f,g,h,i){var s,r=$.J
if(r===c)return d.$2(e,f)
$.J=c
s=r
try{r=d.$2(e,f)
return r}finally{$.J=s}},
e2(a,b,c,d){t.M.a(d)
if(B.f!==c){d=c.cq(d)
d=d}A.ti(d)},
lx:function lx(a){this.a=a},
lw:function lw(a,b,c){this.a=a
this.b=b
this.c=c},
ly:function ly(a){this.a=a},
lz:function lz(a){this.a=a},
m9:function m9(){this.b=null},
ma:function ma(a,b){this.a=a
this.b=b},
i_:function i_(a,b){this.a=a
this.b=!1
this.$ti=b},
mi:function mi(a){this.a=a},
mj:function mj(a){this.a=a},
on:function on(a){this.a=a},
da:function da(a,b){var _=this
_.a=a
_.e=_.d=_.c=_.b=null
_.$ti=b},
cr:function cr(a,b){this.a=a
this.$ti=b},
am:function am(a,b){this.a=a
this.b=b},
ju:function ju(a,b,c){this.a=a
this.b=b
this.c=c},
ln:function ln(a,b){this.a=a
this.b=b},
i6:function i6(){},
f5:function f5(a,b){this.a=a
this.$ti=b},
bf:function bf(a,b,c,d,e){var _=this
_.a=null
_.b=a
_.c=b
_.d=c
_.e=d
_.$ti=e},
L:function L(a,b){var _=this
_.a=0
_.b=a
_.c=null
_.$ti=b},
lG:function lG(a,b){this.a=a
this.b=b},
lL:function lL(a,b){this.a=a
this.b=b},
lK:function lK(a,b){this.a=a
this.b=b},
lI:function lI(a,b){this.a=a
this.b=b},
lH:function lH(a,b){this.a=a
this.b=b},
lO:function lO(a,b,c){this.a=a
this.b=b
this.c=c},
lP:function lP(a,b){this.a=a
this.b=b},
lQ:function lQ(a){this.a=a},
lN:function lN(a,b){this.a=a
this.b=b},
lM:function lM(a,b){this.a=a
this.b=b},
lR:function lR(a,b){this.a=a
this.b=b},
lS:function lS(a,b,c){this.a=a
this.b=b
this.c=c},
lT:function lT(a,b){this.a=a
this.b=b},
i0:function i0(a){this.a=a
this.b=null},
dK:function dK(){},
kC:function kC(a,b){this.a=a
this.b=b},
kD:function kD(a,b){this.a=a
this.b=b},
fk:function fk(){},
m8:function m8(a){this.a=a},
m7:function m7(a){this.a=a},
i1:function i1(){},
dQ:function dQ(a,b,c,d,e){var _=this
_.a=null
_.b=0
_.d=a
_.e=b
_.f=c
_.r=d
_.$ti=e},
dU:function dU(a,b){this.a=a
this.$ti=b},
d0:function d0(a,b,c,d,e){var _=this
_.w=a
_.a=b
_.d=c
_.e=d
_.r=_.f=null
_.$ti=e},
dR:function dR(){},
fm:function fm(){},
f7:function f7(){},
d1:function d1(a,b){this.b=a
this.a=null
this.$ti=b},
bg:function bg(a){var _=this
_.a=0
_.c=_.b=null
_.$ti=a},
m3:function m3(a,b){this.a=a
this.b=b},
d9:function d9(a,b){var _=this
_.a=null
_.b=a
_.c=!1
_.$ti=b},
fu:function fu(){},
iw:function iw(){},
m6:function m6(a,b){this.a=a
this.b=b},
of:function of(a,b){this.a=a
this.b=b},
pv(a,b){return new A.b9(a.i("@<0>").H(b).i("b9<1,2>"))},
eB(a,b,c){return b.i("@<0>").H(c).i("pu<1,2>").a(A.tu(a,new A.b9(b.i("@<0>").H(c).i("b9<1,2>"))))},
C(a,b){return new A.b9(a.i("@<0>").H(b).i("b9<1,2>"))},
r7(a){return new A.d6(a.i("d6<0>"))},
bb(a){return new A.d6(a.i("d6<0>"))},
pH(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
wF(a,b,c){var s=new A.d7(a,b,c.i("d7<0>"))
s.c=a.e
return s},
po(a,b,c){var s
A.a9(b,"index")
if(t.Q.b(a)){if(b>=a.length)return null
return J.e9(a,b)}s=J.F(a)
do if(!s.n())return null
while(--b,b>=0)
return s.gp()},
vp(a,b,c){var s=A.pv(b,c)
s.A(0,a)
return s},
vq(a,b){var s,r,q=A.r7(b)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.h)(a),++r)q.j(0,b.a(a[r]))
return q},
px(a){var s,r
if(A.q7(a))return"{...}"
s=new A.be("")
try{r={}
B.a.j($.aU,a)
s.a+="{"
r.a=!0
a.a3(0,new A.k0(r,s))
s.a+="}"}finally{if(0>=$.aU.length)return A.a($.aU,-1)
$.aU.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
vr(a,b,c){var s,r,q=A.M(b),p=new J.b4(b,b.length,q.i("b4<1>")),o=A.M(c),n=new J.b4(c,c.length,o.i("b4<1>")),m=p.n(),l=n.n()
q=q.c
o=o.c
for(;;){if(!(m&&l))break
s=p.d
if(s==null)s=q.a(s)
r=n.d
a.m(0,s,r==null?o.a(r):r)
m=p.n()
l=n.n()}if(m||l)throw A.e(A.aK("Iterables do not have same length.",null))},
d6:function d6(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
iq:function iq(a){this.a=a
this.b=null},
d7:function d7(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
y:function y(){},
T:function T(){},
k_:function k_(a){this.a=a},
k0:function k0(a,b){this.a=a
this.b=b},
fa:function fa(a,b){this.a=a
this.$ti=b},
fb:function fb(a,b,c){var _=this
_.a=a
_.b=b
_.c=null
_.$ti=c},
bI:function bI(){},
fi:function fi(){},
y_(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.b2(r)
q=A.es(String(s),null,null)
throw A.e(q)}q=A.mx(p)
return q},
mx(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.im(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.mx(a[s])
return a},
x_(a,b,c){var s,r,q,p,o,n=c-b
if(n<=4096)s=$.u_()
else s=new Uint8Array(n)
for(r=a.length,q=0;q<n;++q){p=b+q
if(!(p<r))return A.a(a,p)
o=a[p]
if((o&255)!==o)o=255
s[q]=o}return s},
wZ(a,b,c,d){var s=a?$.tZ():$.tY()
if(s==null)return null
if(0===c&&d===b.length)return A.rW(s,b)
return A.rW(s,b.subarray(c,d))},
rW(a,b){var s,r
try{s=a.decode(b)
return s}catch(r){}return null},
r3(a,b,c){return new A.dC(a,b)},
xk(a){return a.iZ()},
wC(a,b){return new A.lZ(a,[],A.yx())},
wD(a,b,c){var s,r=new A.be(""),q=A.wC(r,b)
q.bS(a)
s=r.a
return s.charCodeAt(0)==0?s:s},
x0(a){switch(a){case 65:return"Missing extension byte"
case 67:return"Unexpected extension byte"
case 69:return"Invalid UTF-8 byte"
case 71:return"Overlong encoding"
case 73:return"Out of unicode range"
case 75:return"Encoded surrogate"
case 77:return"Unfinished UTF-8 octet sequence"
default:return""}},
im:function im(a,b){this.a=a
this.b=b
this.c=null},
lY:function lY(a){this.a=a},
io:function io(a){this.a=a},
me:function me(){},
md:function md(){},
dr:function dr(){},
fT:function fT(){},
h0:function h0(){},
dC:function dC(a,b){this.a=a
this.b=b},
hf:function hf(a,b){this.a=a
this.b=b},
he:function he(){},
jU:function jU(a){this.b=a},
jT:function jT(a){this.a=a},
m_:function m_(){},
m0:function m0(a,b){this.a=a
this.b=b},
lZ:function lZ(a,b,c){this.c=a
this.a=b
this.b=c},
hX:function hX(){},
ls:function ls(){},
mf:function mf(a){this.b=0
this.c=a},
hY:function hY(a){this.a=a},
fs:function fs(a){this.a=a
this.b=16
this.c=0},
uS(a,b){a=A.ae(a,new Error())
if(a==null)a=A.bh(a)
a.stack=b.q(0)
throw a},
N(a,b,c,d){var s,r=c?J.qY(a,d):J.pr(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
r8(a,b,c){var s,r,q=A.b([],c.i("p<0>"))
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.h)(a),++r)B.a.j(q,c.a(a[r]))
if(b)return q
q.$flags=1
return q},
X(a,b){var s,r
if(Array.isArray(a))return A.b(a.slice(0),b.i("p<0>"))
s=A.b([],b.i("p<0>"))
for(r=J.F(a);r.n();)B.a.j(s,r.gp())
return s},
eC(a,b,c,d){var s,r=c?J.qY(a,d):J.pr(a,d)
for(s=0;s<a;++s)B.a.m(r,s,b.$1(s))
return r},
pw(a,b){var s=A.r8(a,!1,b)
s.$flags=3
return s},
dL(a,b,c){var s,r,q,p,o
A.a9(b,"start")
s=c==null
r=!s
if(r){q=c-b
if(q<0)throw A.e(A.a6(c,b,null,"end",null))
if(q===0)return""}if(Array.isArray(a)){p=a
o=p.length
if(s)c=o
return A.rh(b>0||c<o?p.slice(b,c):p)}if(t.hp.b(a))return A.w6(a,b,c)
if(r)a=J.iQ(a,c)
if(b>0)a=J.df(a,b)
s=A.X(a,t.S)
return A.rh(s)},
w6(a,b,c){var s=a.length
if(b>=s)return""
return A.vQ(a,b,c==null||c>s?s:c)},
hy(a){return new A.dz(a,A.r2(a,!1,!0,!1,!1,""))},
pD(a,b,c){var s=J.F(b)
if(!s.n())return a
if(c.length===0){do a+=A.v(s.gp())
while(s.n())}else{a+=A.v(s.gp())
while(s.n())a=a+c+A.v(s.gp())}return a},
wY(a,b,c,d){var s,r,q,p,o,n="0123456789ABCDEF"
if(c===B.u){s=$.tX()
s=s.b.test(b)}else s=!1
if(s)return b
r=B.au.ct(b)
for(s=r.length,q=0,p="";q<s;++q){o=r[q]
if(o<128&&("\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u03f6\x00\u0404\u03f4 \u03f4\u03f6\u01f6\u01f6\u03f6\u03fc\u01f4\u03ff\u03ff\u0584\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u05d4\u01f4\x00\u01f4\x00\u0504\u05c4\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u0400\x00\u0400\u0200\u03f7\u0200\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u0200\u0200\u0200\u03f7\x00".charCodeAt(o)&a)!==0)p+=A.Q(o)
else p=p+"%"+n[o>>>4&15]+n[o&15]}return p.charCodeAt(0)==0?p:p},
rp(){return A.cu(new Error())},
uR(a,b,c){var s,r
for(s=0;s<3;++s){r=a[s]
if(r.b===b)return r}throw A.e(A.iS(b,"name","No enum value with that name"))},
h1(a){if(typeof a=="number"||A.H(a)||a==null)return J.bk(a)
if(typeof a=="string")return JSON.stringify(a)
return A.rg(a)},
uT(a,b){A.ct(a,"error",t.K)
A.ct(b,"stackTrace",t.l)
A.uS(a,b)},
fG(a){return new A.fF(a)},
aK(a,b){return new A.b3(!1,null,b,a)},
iS(a,b,c){return new A.b3(!0,a,b,c)},
c3(a,b,c){return a},
rj(a,b){return new A.ci(null,null,!0,a,b,"Value not in range")},
a6(a,b,c,d,e){return new A.ci(b,c,!0,a,d,"Invalid value")},
vR(a,b,c,d){if(a<b||a>c)throw A.e(A.a6(a,b,c,d,null))
return a},
aw(a,b,c){if(0>a||a>c)throw A.e(A.a6(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.e(A.a6(b,a,c,"end",null))
return b}return c},
a9(a,b){if(a<0)throw A.e(A.a6(a,0,null,b,null))
return a},
jP(a,b,c,d){return new A.h8(b,!0,a,d,"Index out of range")},
ax(a){return new A.f0(a)},
rA(a){return new A.hV(a)},
cl(a){return new A.ck(a)},
a5(a){return new A.fP(a)},
es(a,b,c){return new A.aa(a,b,c)},
vj(a,b,c){var s,r
if(A.q7(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.b([],t.s)
B.a.j($.aU,a)
try{A.xM(a,s)}finally{if(0>=$.aU.length)return A.a($.aU,-1)
$.aU.pop()}r=A.pD(b,t.e7.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
pp(a,b,c){var s,r
if(A.q7(a))return b+"..."+c
s=new A.be(b)
B.a.j($.aU,a)
try{r=s
r.a=A.pD(r.a,a,", ")}finally{if(0>=$.aU.length)return A.a($.aU,-1)
$.aU.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
xM(a,b){var s,r,q,p,o,n,m,l=a.gt(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.n())return
s=A.v(l.gp())
B.a.j(b,s)
k+=s.length+2;++j}if(!l.n()){if(j<=5)return
if(0>=b.length)return A.a(b,-1)
r=b.pop()
if(0>=b.length)return A.a(b,-1)
q=b.pop()}else{p=l.gp();++j
if(!l.n()){if(j<=4){B.a.j(b,A.v(p))
return}r=A.v(p)
if(0>=b.length)return A.a(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gp();++j
for(;l.n();p=o,o=n){n=l.gp();++j
if(j>100){for(;;){if(!(k>75&&j>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2;--j}B.a.j(b,"...")
return}}q=A.v(p)
r=A.v(o)
k+=r.length+q.length+4}}if(j>b.length+2){k+=5
m="..."}else m=null
for(;;){if(!(k>80&&b.length>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2
if(m==null){k+=5
m="..."}}if(m!=null)B.a.j(b,m)
B.a.j(b,q)
B.a.j(b,r)},
r9(a,b,c,d,e){return new A.cA(a,b.i("@<0>").H(c).H(d).H(e).i("cA<1,2,3,4>"))},
pA(a,b,c,d){var s
if(B.L===c){s=B.b.gR(a)
b=J.bj(b)
return A.l_(A.bM(A.bM($.iM(),s),b))}if(B.L===d){s=B.b.gR(a)
b=J.bj(b)
c=J.bj(c)
return A.l_(A.bM(A.bM(A.bM($.iM(),s),b),c))}s=B.b.gR(a)
b=J.bj(b)
c=J.bj(c)
d=J.bj(d)
d=A.l_(A.bM(A.bM(A.bM(A.bM($.iM(),s),b),c),d))
return d},
vF(a){var s,r,q=$.iM()
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.h)(a),++r)q=A.bM(q,J.bj(a[r]))
return A.l_(q)},
vX(a){return new A.an(a)},
xh(a,b){return 65536+((a&1023)<<10)+(b&1023)},
bl:function bl(a){this.a=a},
i9:function i9(){},
a_:function a_(){},
fF:function fF(a){this.a=a},
bO:function bO(){},
b3:function b3(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ci:function ci(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
h8:function h8(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
f0:function f0(a){this.a=a},
hV:function hV(a){this.a=a},
ck:function ck(a){this.a=a},
fP:function fP(a){this.a=a},
hq:function hq(){},
eW:function eW(){},
lE:function lE(a){this.a=a},
aa:function aa(a,b,c){this.a=a
this.b=b
this.c=c},
i:function i(){},
ac:function ac(a,b,c){this.a=a
this.b=b
this.$ti=c},
a8:function a8(){},
n:function n(){},
iB:function iB(){},
an:function an(a){this.a=a},
cW:function cW(a){var _=this
_.a=a
_.c=_.b=0
_.d=-1},
be:function be(a){this.a=a},
t3(a,b,c,d){if(a)return""+d+"-"+c+"-begin"
if(b)return""+d+"-"+c+"-end"
return c},
te(a){var s=$.dZ.h(0,a)
if(s==null)return a
return a+"-"+A.v(s)},
xj(a){var s,r
if(!$.dZ.M(a))return
s=$.dZ.h(0,a)
s.toString
r=s-1
s=$.dZ
if(r<=0)s.aA(0,a)
else s.m(0,a,r)},
y6(a,b,c,d,e){var s,r,q,p,o,n
if(c===9||c===11||c===10)return
if($.e0>1e4&&$.dZ.a===0){$.fD().clearMarks()
$.fD().clearMeasures()
$.e0=0}s=c===1||c===5
r=c===2||c===7
q=A.t3(s,r,d,a)
if(s){p=$.dZ.h(0,q)
if(p==null)p=0
$.dZ.m(0,q,p+1)
q=A.te(q)}o=$.fD()
o.toString
o.mark(q,A.b0($.u3().parse(e)))
$.e0=$.e0+1
if(r){n=A.t3(!0,!1,d,a)
o=$.fD()
o.toString
o.measure(d,A.te(n),q)
$.e0=$.e0+1
A.xj(n)}B.b.E($.e0,0,10001)},
rw(a,b){if($.fD()==null)return
A.y6(0,-1,4,a,A.x2(b))},
x2(a){var s=a.a
if(s===0)return"{}"
return B.h.hY(a)},
ob:function ob(){},
mM:function mM(){},
k5:function k5(a){this.a=a},
xc(a,b,c){t.gY.a(a)
if(A.D(c)>=1)return a.$1(b)
return a.$0()},
qd(a,b){var s=new A.L($.J,b.i("L<0>")),r=new A.f5(s,b.i("f5<0>"))
a.then(A.e5(new A.oW(r,b),1),A.e5(new A.oX(r),1))
return s},
oW:function oW(a,b){this.a=a
this.b=b},
oX:function oX(a){this.a=a},
cn:function cn(a,b){this.a=a
this.b=b},
qM(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g=b.length,f=g!==0
if(f){if(0>=g)return A.a(b,0)
s=b[0]*2}else s=a.length
r=A.qK(a,0,s,2,null,!0)
q=A.b([],t.t)
if(r!=null){g=r.e
g===$&&A.j()
p=r.d
p===$&&A.j()
p=g===p
g=p}else g=!0
if(g)return q
if(f)r=A.uG(a,b,r,2)
g=a.length
if(g>160){o=a[0]
n=a[1]
for(m=n,l=o,k=2;k<s;k+=2){if(!(k<g))return A.a(a,k)
j=a[k]
p=k+1
if(!(p<g))return A.a(a,p)
i=a[p]
if(j<l)l=j
if(i<m)m=i
if(j>o)o=j
if(i>n)n=i}h=Math.max(o-l,n-m)
h=h!==0?1/h:0}else{l=0
m=0
h=5e-324}A.fY(r,q,2,l,m,h,-2147483648)
return q},
fY(a,b,c,d,e,f,g){var s,r,q,p,o
if(a==null)return
s=g===-2147483648
if(s&&f!==5e-324)A.uJ(a,d,e,f)
r=f!==5e-324
q=a
for(;;){p=a.d
p===$&&A.j()
o=a.e
o===$&&A.j()
if(!(p!==o))break
A:{if(r?A.uM(a,d,e,f):A.uL(a)){B.a.j(b,B.b.aa(p.a,c))
B.a.j(b,B.b.aa(a.a,c))
B.a.j(b,B.b.aa(o.a,c))
A.h_(a)
p=o.e
p===$&&A.j()
q=p
a=q
break A}if(o===q){if(s)A.fY(A.cC(o,null),b,c,d,e,f,1)
else if(g===1){s=A.cC(o,null)
s.toString
A.fY(A.uF(s,b,c),b,c,d,e,f,2)}else if(g===2)A.uQ(o,b,c,d,e,f)
break}a=o}}},
uQ(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k=-2147483648,j=a
do{s=j.e
s===$&&A.j()
s=s.e
s===$&&A.j()
r=j.a
q=j.b
p=j.c
o=s
for(;;){s=j.d
s===$&&A.j()
if(!(o!==s))break
n=o.a
m=!1
if(r!==n)if(j.e.a!==n)if(s.a!==n)if(!A.uK(j,o)){s=!1
if(A.fZ(j,o))if(A.fZ(o,j))if(A.uN(j,o)){s=j.d
n=o.d
n===$&&A.j()
s=A.a7(s,j,n)!==0||A.a7(j,n,o)!==0}if(!s)if(q===o.b&&p===o.c)if(A.a7(j.d,j,j.e)>0){s=o.d
s===$&&A.j()
n=o.e
n===$&&A.j()
n=A.a7(s,o,n)>0
s=n}else s=m
else s=m
else s=!0}else s=m
else s=m
else s=m
else s=m
if(s){l=A.qL(j,o)
s=A.cC(j,j.e)
s.toString
r=l.e
r===$&&A.j()
r=A.cC(l,r)
r.toString
A.fY(s,b,c,d,e,f,k)
A.fY(r,b,c,d,e,f,k)
return}s=o.e
s===$&&A.j()
o=s}j=j.e}while(j!==a)},
uN(a,b){var s,r,q,p,o=(a.b+b.b)/2,n=(a.c+b.c)/2,m=a,l=!1
do{s=m.c
r=m.e
r===$&&A.j()
q=r.c
if(s>n!==q>n){p=m.b
p=o<(r.b-p)*(n-s)/(q-s)+p
s=p}else s=!1
if(s)l=!l
if(r!==a){m=r
continue}else break}while(!0)
return l},
uK(a,b){var s,r,q,p=a.a,o=b.a,n=a
do{s=n.a
if(s!==p){r=n.e
r===$&&A.j()
q=r.a
s=q!==p&&s!==o&&q!==o&&A.qJ(n,r,a,b)}else s=!1
if(s)return!0
s=n.e
s===$&&A.j()
if(s!==a){n=s
continue}else break}while(!0)
return!1},
qJ(a,b,c,d){var s,r,q,p,o=a.b,n=c.b
if(!(o===n&&a.c===c.c&&b.b===d.b&&b.c===d.c))o=o===d.b&&a.c===d.c&&n===b.b&&c.c===b.c
else o=!0
if(o)return!0
o=A.a7(a,b,c)
if(o>0)s=1
else s=o<0?-1:0
o=A.a7(a,b,d)
if(o>0)r=1
else r=o<0?-1:0
o=A.a7(c,d,a)
if(o>0)q=1
else q=o<0?-1:0
o=A.a7(c,d,b)
if(o>0)p=1
else p=o<0?-1:0
if(s!==r&&q!==p)return!0
if(s===0&&A.jk(a,c,b))return!0
if(r===0&&A.jk(a,d,b))return!0
if(q===0&&A.jk(c,a,d))return!0
if(p===0&&A.jk(c,b,d))return!0
return!1},
jk(a,b,c){var s=b.b,r=a.b,q=c.b,p=!1
if(s<=Math.max(r,q))if(s>=Math.min(r,q)){s=b.c
r=a.c
q=c.c
s=s<=Math.max(r,q)&&s>=Math.min(r,q)}else s=p
else s=p
return s},
uF(a,b,c){var s,r,q,p=a
do{s=p.d
s===$&&A.j()
r=p.e
r===$&&A.j()
q=r.e
q===$&&A.j()
if(!(s.b===q.b&&s.c===q.c)&&A.qJ(s,p,r,q)&&A.fZ(s,q)&&A.fZ(q,s)){B.a.j(b,B.b.aa(s.a,c))
B.a.j(b,B.b.aa(p.a,c))
B.a.j(b,B.b.aa(q.a,c))
A.h_(p)
A.h_(p.e)
p=q
a=p}s=p.e
s===$&&A.j()
if(s!==a){p=s
continue}else break}while(!0)
return A.cC(s,null)},
uL(a){var s,r,q,p,o,n,m,l,k,j=a.d
j===$&&A.j()
s=a.e
s===$&&A.j()
if(A.a7(j,a,s)>=0)return!1
r=s.e
r===$&&A.j()
for(q=j.b,p=j.c,o=a.b,n=a.c,m=s.b,s=s.c,l=r;l!==j;l=r){if(A.ek(q,p,o,n,m,s,l.b,l.c)){r=l.d
r===$&&A.j()
k=l.e
k===$&&A.j()
k=A.a7(r,l,k)>=0
r=k}else r=!1
if(r)return!1
r=l.e
r===$&&A.j()}return!0},
uM(a,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a.d
b===$&&A.j()
s=a.e
s===$&&A.j()
if(A.a7(b,a,s)>=0)return!1
r=b.b
q=a.b
if(r<q){p=s.b
o=r<p?r:p}else{p=s.b
o=q<p?q:p}b=b.c
n=a.c
if(b<n){s=s.c
m=b<s?b:s}else{s=s.c
m=n<s?n:s}if(r>q)l=r>p?r:p
else l=q>p?q:p
if(b>n)k=b>s?b:s
else k=n>s?n:s
j=A.pm(o,m,a0,a1,a2)
i=A.pm(l,k,a0,a1,a2)
h=a.w
g=a.x
f=a.d
e=a.e
for(;;){if(!(h!=null&&h.f>=j&&g!=null&&g.f<=i))break
d=!1
if(h!==f)if(h!==e)if(A.ek(r,b,q,n,p,s,h.b,h.c)){d=h.d
d===$&&A.j()
c=h.e
c===$&&A.j()
c=A.a7(d,h,c)>=0
d=c}if(d)return!1
h=h.w
d=!1
if(g!==f)if(g!==e)if(A.ek(r,b,q,n,p,s,g.b,g.c)){d=g.d
d===$&&A.j()
c=g.e
c===$&&A.j()
c=A.a7(d,g,c)>=0
d=c}if(d)return!1
g=g.x}for(;;){if(!(h!=null&&h.f>=j))break
d=!1
if(h!==f)if(h!==e)if(A.ek(r,b,q,n,p,s,h.b,h.c)){d=h.d
d===$&&A.j()
c=h.e
c===$&&A.j()
c=A.a7(d,h,c)>=0
d=c}if(d)return!1
h=h.w}for(;;){if(!(g!=null&&g.f<=i))break
d=!1
if(g!==f)if(g!==e)if(A.ek(r,b,q,n,p,s,g.b,g.c)){d=g.d
d===$&&A.j()
c=g.e
c===$&&A.j()
c=A.a7(d,g,c)>=0
d=c}if(d)return!1
g=g.x}return!0},
pm(a,b,c,d,e){var s=B.c.S(32767*(a-c)*e),r=B.c.S(32767*(b-d)*e)
s=(s|s<<8)&16711935
s=(s|s<<4)&252645135
s=(s|s<<2)&858993459
r=(r|r<<8)&16711935
r=(r|r<<4)&252645135
r=(r|r<<2)&858993459
return((s|s<<1)&1431655765|((r|r<<1)&1431655765)<<1)>>>0},
uJ(a,b,c,d){var s,r=a
do{if(r.f===5e-324)r.f=A.pm(r.b,r.c,b,c,d)
s=r.d
s===$&&A.j()
r.w=s
s=r.e
s===$&&A.j()
r.x=s
if(s!==a){r=s
continue}else break}while(!0)
s.w=s.w.x=null
A.uP(s)},
uP(a){var s,r,q,p,o,n,m,l,k,j,i,h=1
do{for(s=a,a=null,r=0,q=null;s!=null;s=p){++r
for(p=s,o=0,n=0;n<h;++n){++o
p=p.x
if(p==null)break}m=h
for(;;){if(o<=0)l=m>0&&p!=null
else l=!0
if(!l)break
if(o===0){k=p.x;--m
j=p
p=k}else if(m===0||p==null){i=s.x;--o
j=s
s=i}else if(s.f<=p.f){i=s.x;--o
j=s
s=i}else{k=p.x;--m
j=p
p=k}if(q!=null)q.x=j
else a=j
j.w=q
q=j}}q.x=null
h*=2}while(r>1)
return a},
uG(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=A.b([],t.eB),e=b.length
for(s=a.length,r=e-1,q=0;q<e;q=l){p=b.length
if(!(q<p))return A.a(b,q)
o=b[q]
if(q<r){n=q+1
if(!(n<p))return A.a(b,n)
m=b[n]*d}else m=s
l=q+1
k=A.qK(a,o*d,m,d,l,!1)
p=k==null
if(p)o=null
else{o=k.e
o===$&&A.j()}if(k==o)if(!p)k.r=!0
k.toString
B.a.j(f,A.uI(k))}B.a.aG(f,new A.jj())
for(r=f.length,j=0;j<f.length;f.length===r||(0,A.h)(f),++j,c=p){i=f[j]
h=A.uH(i,c)
if(h!=null){g=A.qL(h,i)
p=h.e
p===$&&A.j()
A.cC(h,p)
p=g.e
p===$&&A.j()
A.cC(g,p)}p=c.e
p===$&&A.j()
p=A.cC(c,p)
p.toString}return c},
cC(a,b){var s,r,q,p,o,n,m,l
if(b==null)b=a
s=a
do{r=s.d
r===$&&A.j()
q=r.y
p=s.y
o=s.e
o===$&&A.j()
n=o.y
m=!1
if(!s.r){l=s.b
if(!(l===o.b&&s.c===o.c))l=r.b===l&&r.c===s.c
else l=!0
if(l)m=!0
else if(q!=null||q!==0||n!=null||n!==0||q==n||q!=p)m=A.a7(r,s,o)===0}if(m){A.h_(s)
s=s.d
r=s.e
r===$&&A.j()
if(s===r){b=s
break}b=s}else s=o}while(m||s!==b)
return b},
a7(a,b,c){var s=b.c,r=b.b
return(s-a.c)*(c.b-r)-(r-a.b)*(c.c-s)},
qL(a,b){var s,r=A.pI(a.a,a.b,a.c),q=A.pI(b.a,b.b,b.c),p=a.e
p===$&&A.j()
s=b.d
s===$&&A.j()
r.y=a.y
q.y=b.y
a.e=b
b.d=a
r.e=p
q.e=p.d=r
s.e=r.d=q
q.d=s
return q},
uH(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=a.b,g=a.c,f=b,e=-17976931348623157e292,d=null
do{s=f.c
if(g<=s){r=f.e
r===$&&A.j()
r=g>=r.c}else r=!1
if(r){r=f.b
q=f.e
q===$&&A.j()
p=q.b
o=q.c
n=r+(g-s)*(p-r)/(o-s)
if(n<=h&&n>e){if(n===h){if(g===s)return f
if(g===o)return q}if(r<p)d=f
else d=q
e=n}}s=f.e
s===$&&A.j()
if(s!==b){f=s
continue}else break}while(!0)
if(d==null)return null
if(h===e)return d
m=d.b
l=d.c
s=g<l
k=d
f=k
j=17976931348623157e292
do{r=f.b
q=!1
if(h>=r)if(r>=m){q=s?h:e
p=s?e:h
p=A.ek(q,g,m,l,p,g,r,f.c)
q=p}if(q){i=Math.abs(g-f.c)/(h-r)
q=!1
if(A.fZ(f,a))if(!(i<j))if(i===j){p=k.b
if(!(r>p))if(r===p){r=k.d
r===$&&A.j()
p=f.d
p===$&&A.j()
if(A.a7(r,k,p)<0){r=f.e
r===$&&A.j()
q=k.e
q===$&&A.j()
q=A.a7(r,k,q)<0
r=q}else r=q}else r=q
else r=!0}else r=q
else r=!0
else r=q
if(r){j=i
k=f}}r=f.e
r===$&&A.j()
if(r!==d){f=r
continue}else break}while(!0)
return k},
fZ(a,b){var s,r=a.d
r===$&&A.j()
s=a.e
s===$&&A.j()
if(A.a7(r,a,s)<0)r=A.a7(a,b,s)>=0&&A.a7(a,r,b)>=0
else r=A.a7(a,b,r)<0||A.a7(a,s,b)<0
return r},
ek(a,b,c,d,e,f,g,h){var s,r,q=e-g,p=b-h,o=a-g,n=f-h
if(q*p-o*n>=0){s=d-h
r=c-g
q=o*s-r*p>=0&&r*n-q*s>=0}else q=!1
return q},
uI(a){var s,r,q=a,p=q
do{s=p.b
r=q.b
if(!(s<r))s=s===r&&p.c<q.c
else s=!0
if(s)q=p
s=p.e
s===$&&A.j()
if(s!==a){p=s
continue}else break}while(!0)
return q},
qK(a,b,c,d,e,f){var s,r,q,p,o=null
if(f===A.uO(a,b,c,d)>0)for(s=a.length,r=b;r<c;r+=d){if(!(r>=0&&r<s))return A.a(a,r)
q=a[r]
p=r+1
if(!(p<s))return A.a(a,p)
o=A.qI(r,q,a[p],o)
o.y=e}else for(r=c-d,s=a.length;r>=b;r-=d){if(!(r>=0&&r<s))return A.a(a,r)
q=a[r]
p=r+1
if(!(p<s))return A.a(a,p)
o=A.qI(r,q,a[p],o)
o.y=e}if(o!=null){s=o.e
s===$&&A.j()
s=o.b===s.b&&o.c===s.c}else s=!1
if(s){A.h_(o)
s=o.e
s===$&&A.j()
s.y=e
o=s}return o},
h_(a){var s,r=a.e
r===$&&A.j()
s=a.d
s===$&&A.j()
r.d=s
a.d.e=r
r=a.w
if(r!=null)r.x=a.x
s=a.x
if(s!=null)s.w=r},
qI(a,b,c,d){var s,r=A.pI(a,b,c)
if(d==null){r.d=r
r.e=r}else{s=d.e
s===$&&A.j()
r.e=s
r.d=d
d.e=d.e.d=r}return r},
uO(a,b,c,d){var s,r,q,p,o,n,m,l,k=c-d
for(s=a.length,r=b,q=0;r<c;p=r+d,k=r,r=p){if(!(k>=0&&k<s))return A.a(a,k)
o=a[k]
if(!(r>=0&&r<s))return A.a(a,r)
n=a[r]
m=r+1
if(!(m<s))return A.a(a,m)
m=a[m]
l=k+1
if(!(l<s))return A.a(a,l)
q+=(o-n)*(m+a[l])}return q},
pI(a,b,c){return new A.bY(a,b,c)},
jj:function jj(){},
bY:function bY(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.e=_.d=$
_.f=5e-324
_.r=!1
_.y=_.x=_.w=null},
ch:function ch(a,b){var _=this
_.a=a
_.b=b
_.ax=_.Q=_.f=_.e=_.d=_.c=null
_.ay=!1
_.cx=_.CW=_.ch=null},
vZ(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e="read of 4 byte(s) at ",d=J.qq(B.j.gam(a),a.byteOffset,a.byteLength),c=new A.r(d,0)
if(d.byteLength<12)throw A.e(B.aN)
c.l(0,4)
s=d.getUint32(0,!1)
if(s===1953784678){c.l(8,4)
r=d.getUint32(8,!1)
if(b>=r)throw A.e(A.k("font index "+b+" out of range in a "+r+"-font collection"))
q=12+b*4
c.l(q,4)
p=d.getUint32(q,!1)
c.l(p,4)
s=d.getUint32(p,!1)}else p=0
if(s!==65536&&s!==1953658213&&s!==1330926671)throw A.e(A.k("unrecognised sfntVersion 0x"+B.d.em(B.b.bm(s,16),8,"0")))
q=p+4
c.l(q,2)
o=d.getUint16(q,!1)
n=A.C(t.S,t.l1)
for(q=p+12,m=0;m<o;++m){l=q+m*16
k=l+4<=d.byteLength
if(!k)A.t(A.k(e+l+" overruns a "+c.gk(0)+"-byte font"))
j=d.getUint32(l,!1)
k=l+8
i=k+4<=d.byteLength
if(!i)A.t(A.k(e+k+" overruns a "+c.gk(0)+"-byte font"))
h=d.getUint32(k,!1)
k=l+12
i=k+4<=d.byteLength
if(!i)A.t(A.k(e+k+" overruns a "+c.gk(0)+"-byte font"))
g=d.getUint32(k,!1)
k=d.byteLength
if(h>=k)throw A.e(A.k("table "+A.aJ(A.cX(j))+" starts at "+h+", past the "+c.gk(0)+"-byte file"))
f=h+g>k?k-h:g
i=l+4
k=i+4<=k
if(!k)A.t(A.k(e+i+" overruns a "+c.gk(0)+"-byte font"))
d.getUint32(i,!1)
n.m(0,j,new A.hN(j,h,f))}return new A.kw(c,n)},
hN:function hN(a,b,c){this.a=a
this.c=b
this.d=c},
kw:function kw(a,b){this.a=a
this.c=b},
ei(a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b="read of 2 byte(s) at ",a=a0.b
if(!a0.X(a,4))throw A.e(B.aJ)
s=a+2
a0.l(s,2)
r=a0.a
q=r.getUint16(s,!1)
s=a+4
if(!a0.X(s,q*8))throw A.e(A.k("cmap claims "+q+" encoding records it does not contain"))
p=A.b([],t.ig)
for(o=0;o<q;++o){n=s+o*8
m=n+4
if(m>=0)l=m+4<=r.byteLength
else l=!1
if(!l)A.t(A.k("read of 4 byte(s) at "+m+" overruns a "+a0.gk(0)+"-byte font"))
k=a+r.getUint32(m,!1)
m=k>=0
if(m)l=k+2<=r.byteLength
else l=!1
if(!l)continue
if(n>=0)l=n+2<=r.byteLength
else l=!1
if(!l)A.t(A.k(b+n+" overruns a "+a0.gk(0)+"-byte font"))
l=r.getUint16(n,!1)
j=n+2
if(j>=0)i=j+2<=r.byteLength
else i=!1
if(!i)A.t(A.k(b+j+" overruns a "+a0.gk(0)+"-byte font"))
j=r.getUint16(j,!1)
if(m)m=k+2<=r.byteLength
else m=!1
if(!m)A.t(A.k(b+k+" overruns a "+a0.gk(0)+"-byte font"))
B.a.j(p,new A.bw(l,j,k,r.getUint16(k,!1)))}if(p.length===0)throw A.e(B.aP)
s=t.aq
h=A.X(p,s)
B.a.aG(h,new A.jd())
r=h.length
e=0
for(;;){if(!(e<h.length)){g=null
f=null
break}A:{d=h[e]
c=A.uA(a0,d.c)
if(c==null)break A
f=d
g=c
break}h.length===r||(0,A.h)(h);++e}if(g==null||f==null)throw A.e(B.aL)
for(r=p.length,e=0;e<r;++e){d=p[e]
if(d.d===14){A.wx(a0,d.c)
break}}A.pw(p,s)
return new A.jc(g,f)},
uA(a,b){if(!a.X(b,2))return null
a.l(b,2)
switch(a.a.getUint16(b,!1)){case 0:return A.ww(a,b)
case 4:return A.wy(a,b)
case 6:return A.wz(a,b)
case 12:return A.rG(a,b,!1)
case 13:return A.rG(a,b,!0)
default:return null}},
ww(a,b){var s,r
if(!a.X(b,262))return null
s=b+6
a.l(s,256)
r=a.a
return new A.ic(J.qr(B.df.gam(r),r.byteOffset+s,256))},
wy(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(!a.X(b,14))return null
s=b+2
a.l(s,2)
r=a.a
q=r.getUint16(s,!1)
s=b+6
a.l(s,2)
p=r.getUint16(s,!1)
if(p===0||(p&1)===1)return null
o=p>>>1
n=b+14
m=n+p+2
l=m+p
k=l+p
if(!a.X(k,p))return null
j=new A.r(r,n).a0(o)
i=new A.r(r,m).a0(o)
h=new A.r(r,l).a0(o)
g=new A.r(r,k).a0(o)
f=b+q
if(f<k+p)f=r.byteLength
s=r.byteLength
return new A.ie(j,i,h,g,k,a,f>s?s:f)},
wz(a,b){var s,r,q,p
if(!a.X(b,10))return null
s=b+6
a.l(s,2)
r=a.a
q=r.getUint16(s,!1)
s=b+8
a.l(s,2)
p=r.getUint16(s,!1)
s=b+10
if(!a.X(s,p*2))return null
return new A.ig(q,new A.r(r,s).a0(p))},
rG(a,b,c){var s,r,q,p,o,n,m,l,k,j,i="read of 4 byte(s) at "
if(!a.X(b,16))return null
s=b+12
a.l(s,4)
r=a.a
q=r.getUint32(s,!1)
if(q>B.b.F(r.byteLength-b-16,12))return null
p=new Uint32Array(q)
o=new Uint32Array(q)
n=new Uint32Array(q)
for(s=b+16,m=0;m<q;++m){l=s+m*12
if(l>=0)k=l+4<=r.byteLength
else k=!1
if(!k)A.t(A.k(i+l+" overruns a "+a.gk(0)+"-byte font"))
k=r.getUint32(l,!1)
if(!(m<q))return A.a(p,m)
p[m]=k
k=l+4
if(k>=0)j=k+4<=r.byteLength
else j=!1
if(!j)A.t(A.k(i+k+" overruns a "+a.gk(0)+"-byte font"))
k=r.getUint32(k,!1)
if(!(m<q))return A.a(o,m)
o[m]=k
k=l+8
if(k>=0)j=k+4<=r.byteLength
else j=!1
if(!j)A.t(A.k(i+k+" overruns a "+a.gk(0)+"-byte font"))
k=r.getUint32(k,!1)
if(!(m<q))return A.a(n,m)
n[m]=k}return new A.id(p,o,n,c)},
wx(a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5="read of 4 byte(s) at "
if(!a6.X(a7,10))return null
s=a7+6
a6.l(s,4)
r=a6.a
q=r.getUint32(s,!1)
s=a7+10
if(!a6.X(s,q*11))return null
p=new Uint32Array(q)
o=A.b([],t.fC)
n=A.b([],t.nb)
for(m=t.S,l=t.t,k=0;k<q;++k){j=s+k*11
p[k]=a6.cN(j)
i=j+3
if(i>=0)h=i+4<=r.byteLength
else h=!1
if(!h)A.t(A.k(a5+i+" overruns a "+a6.gk(0)+"-byte font"))
g=r.getUint32(i,!1)
i=j+7
if(i>=0)h=i+4<=r.byteLength
else h=!1
if(!h)A.t(A.k(a5+i+" overruns a "+a6.gk(0)+"-byte font"))
f=r.getUint32(i,!1)
e=A.b([],l)
if(g!==0){d=a7+g
i=d>=0
if(i)h=d+4<=r.byteLength
else h=!1
if(h){if(i)i=d+4<=r.byteLength
else i=!1
if(!i)A.t(A.k(a5+d+" overruns a "+a6.gk(0)+"-byte font"))
c=r.getUint32(d,!1)
i=d+4
if(i>=0)h=i+c*4<=r.byteLength
else h=!1
if(h)for(b=0;b<c;++b){a=i+b*4
a0=a6.cN(a)
B.a.j(e,a0)
h=a+3
if(h>=0)a1=h+1<=r.byteLength
else a1=!1
if(!a1)A.t(A.k("read of 1 byte(s) at "+h+" overruns a "+a6.gk(0)+"-byte font"))
B.a.j(e,a0+r.getUint8(h))}}}B.a.j(o,e)
a2=A.C(m,m)
if(f!==0){a3=a7+f
i=a3>=0
if(i)h=a3+4<=r.byteLength
else h=!1
if(h){if(i)i=a3+4<=r.byteLength
else i=!1
if(!i)A.t(A.k(a5+a3+" overruns a "+a6.gk(0)+"-byte font"))
a4=r.getUint32(a3,!1)
i=a3+4
if(i>=0)h=i+a4*5<=r.byteLength
else h=!1
if(h)for(b=0;b<a4;++b){a=i+b*5
h=a6.cN(a)
a+=3
if(a>=0)a1=a+2<=r.byteLength
else a1=!1
if(!a1)A.t(A.k("read of 2 byte(s) at "+a+" overruns a "+a6.gk(0)+"-byte font"))
a2.m(0,h,r.getUint16(a,!1))}}}B.a.j(n,a2)}return new A.lF()},
jc:function jc(a,b){this.a=a
this.d=b},
jd:function jd(){},
bw:function bw(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ic:function ic(a){this.a=a},
ie:function ie(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
ig:function ig(a,b){this.a=a
this.b=b},
id:function id(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
lF:function lF(){},
vc(a){var s,r,q,p,o,n,m,l,k,j=a.b
if(!a.X(j,54))throw A.e(B.a4)
s=j+12
a.l(s,4)
r=a.a
q=r.getUint32(s,!1)
if(q!==1594834165)throw A.e(A.k("head.magicNumber is 0x"+B.b.bm(q,16)+", not 0x5F0F3CF5"))
s=j+18
a.l(s,2)
p=r.getUint16(s,!1)
if(p<16||p>16384)throw A.e(A.k("head.unitsPerEm "+p+" is outside the legal 16\u202616384"))
s=j+50
a.l(s,2)
o=r.getInt16(s,!1)
if(o!==0&&o!==1)throw A.e(A.k("head.indexToLocFormat "+o+" is neither short nor long"))
a.l(j,2)
r.getUint16(j,!1)
s=j+2
a.l(s,2)
r.getUint16(s,!1)
s=j+4
a.l(s,4)
r.getUint32(s,!1)
s=j+8
a.l(s,4)
r.getUint32(s,!1)
s=j+16
a.l(s,2)
r.getUint16(s,!1)
A.jK(a,j+20)
A.jK(a,j+28)
s=j+36
a.l(s,2)
s=r.getInt16(s,!1)
n=j+38
a.l(n,2)
n=r.getInt16(n,!1)
m=j+40
a.l(m,2)
m=r.getInt16(m,!1)
l=j+42
a.l(l,2)
l=r.getInt16(l,!1)
k=j+44
a.l(k,2)
r.getUint16(k,!1)
k=j+46
a.l(k,2)
r.getUint16(k,!1)
k=j+48
a.l(k,2)
r.getInt16(k,!1)
k=j+52
a.l(k,2)
r.getInt16(k,!1)
return new A.h5(p,s,n,m,l,o)},
jK(a,b){var s,r,q
a.l(b,4)
s=a.a
r=s.getUint32(b,!1)
q=b+4
a.l(q,4)
return r*4294967296+s.getUint32(q,!1)},
h5:function h5(a,b,c,d,e,f){var _=this
_.f=a
_.x=b
_.y=c
_.z=d
_.Q=e
_.ay=f},
ve(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d="read of 2 byte(s) at "
if(c<1&&b>0)throw A.e(B.aO)
s=c>b?b:c
r=a.b
q=s*4
if(!a.X(r,q))throw A.e(A.k("hmtx holds fewer than the "+s+" metric pairs hhea promises"))
p=new Uint16Array(s)
o=new Int16Array(s)
for(n=a.a,m=0;m<s;++m){l=r+m*4
if(l>=0)k=l+2<=n.byteLength
else k=!1
if(!k)A.t(A.k(d+l+" overruns a "+a.gk(0)+"-byte font"))
k=n.getUint16(l,!1)
if(!(m<s))return A.a(p,m)
p[m]=k
k=l+2
if(k>=0)j=k+2<=n.byteLength
else j=!1
if(!j)A.t(A.k(d+k+" overruns a "+a.gk(0)+"-byte font"))
k=n.getInt16(k,!1)
if(!(m<s))return A.a(o,m)
o[m]=k}i=r+q
h=b-s
g=n.byteLength
f=B.b.E(B.b.F(g-i,2),0,h)
e=new Int16Array(h)
for(m=0;m<f;++m){q=i+m*2
if(q>=0)k=q+2<=n.byteLength
else k=!1
if(!k)A.t(A.k(d+q+" overruns a "+a.gk(0)+"-byte font"))
q=n.getInt16(q,!1)
if(!(m<h))return A.a(e,m)
e[m]=q}return new A.jM(p,e)},
jM:function jM(a,b){this.a=a
this.c=b},
un(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e="read of 2 byte(s) at ",d=a.b
a.l(d,2)
s=a.a
r=s.getUint16(d,!1)
if(r!==1&&r!==2)throw A.e(A.k("avar version "+r+" is not 1 or 2"))
q=d+6
a.l(q,2)
p=s.getUint16(q,!1)
o=d+8
n=A.b([],t.iQ)
for(q=t.c5,m=0;m<p;++m){if(o>=0)l=o+2<=s.byteLength
else l=!1
if(!l)A.t(A.k(e+o+" overruns a "+a.gk(0)+"-byte font"))
k=s.getUint16(o,!1)
o+=2
l=k*4
if(o>=0)j=o+l<=s.byteLength
else j=!1
if(!j)throw A.e(B.aF)
i=J.aW(k,q)
for(h=0;h<k;++h){j=o+h*4
if(j>=0)g=j+2<=s.byteLength
else g=!1
if(!g)A.t(A.k(e+j+" overruns a "+a.gk(0)+"-byte font"))
g=s.getInt16(j,!1)
j+=2
if(j>=0)f=j+2<=s.byteLength
else f=!1
if(!f)A.t(A.k(e+j+" overruns a "+a.gk(0)+"-byte font"))
i[h]=new A.ec(g/16384,s.getInt16(j,!1)/16384)}o+=l
B.a.j(n,i)}if(r===2&&a.X(o,8)){a.l(o,4)
if(s.getUint32(o,!1)===0){q=o+4
a.l(q,4)
s.getUint32(q,!1)}}return new A.iT(n)},
ec:function ec(a,b){this.a=a
this.b=b},
iT:function iT(a){this.b=a},
uY(a){var s,r,q,p,o,n,m,l,k,j,i,h=a.b
a.l(h,2)
s=a.a
r=s.getUint16(h,!1)
if(r!==1)throw A.e(A.k("fvar version "+r+" is not 1"))
q=h+4
a.l(q,2)
p=s.getUint16(q,!1)
q=h+8
a.l(q,2)
o=s.getUint16(q,!1)
q=h+10
a.l(q,2)
n=s.getUint16(q,!1)
q=h+12
a.l(q,2)
m=s.getUint16(q,!1)
q=h+14
a.l(q,2)
l=s.getUint16(q,!1)
if(n<20)throw A.e(A.k("fvar axisSize "+n+" is below 20"))
s=o*4
if(l<s+4)throw A.e(A.k("fvar instanceSize "+l+" is too small"))
k=h+p
q=o*n
if(!a.X(k,q))throw A.e(B.aI)
j=A.eC(o,new A.jv(k,n,a),!1,t.iT)
i=k+q
if(!a.X(i,m*l))throw A.e(B.aK)
A.eC(m,new A.jw(i,l,l>=s+6,a,o),!1,t.h7)
return new A.dx(j)},
dO:function dO(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
dH:function dH(a){this.a=a},
dx:function dx(a){this.a=a},
jv:function jv(a,b,c){this.a=a
this.b=b
this.c=c},
jw:function jw(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
qW(a){var s,r,q,p,o,n,m,l,k,j,i=a.b
a.l(i,2)
s=a.a
r=s.getUint16(i,!1)
if(r!==1)throw A.e(A.k("ItemVariationStore format "+r))
q=i+2
a.l(q,4)
p=s.getUint32(q,!1)
q=i+6
a.l(q,2)
o=s.getUint16(q,!1)
n=A.vh(a,i+p)
m=A.b([],t.mc)
for(q=i+8,l=0;l<o;++l){k=q+l*4
if(k>=0)j=k+4<=s.byteLength
else j=!1
if(!j)A.t(A.k("read of 4 byte(s) at "+k+" overruns a "+a.gk(0)+"-byte font"))
B.a.j(m,A.vg(a,i+s.getUint32(k,!1),n))}return new A.ha(a,n,m,null)},
vi(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=a.b
a.l(f,2)
s=a.a
r=s.getUint16(f,!1)
if(r!==1)throw A.e(A.k("HVAR version "+r))
q=f+4
a.l(q,4)
p=A.qW(new A.r(s,f+s.getUint32(q,!1)))
q=f+8
a.l(q,4)
o=s.getUint32(q,!1)
if(o===0)return p
q=f+o
n=new A.r(s,q)
n.l(q,1)
m=s.getUint8(q)
l=m===0
if(!l&&m!==1)A.t(A.k("DeltaSetIndexMap format "+m))
k=q+1
n.l(k,1)
j=s.getUint8(k)
k=q+2
if(l){n.l(k,2)
i=s.getUint16(k,!1)
h=q+4}else{n.l(k,4)
i=s.getUint32(k,!1)
h=q+6}g=(j>>>4&3)+1
if(!n.X(h,i*g))A.t(B.aG)
return new A.ha(p.a,p.b,p.c,new A.ji(n,h,i,g,(j&15)+1))},
vh(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d="read of 2 byte(s) at "
a.l(b,2)
s=a.a
r=s.getUint16(b,!1)
q=b+2
a.l(q,2)
p=s.getUint16(q,!1)
o=r*6
q=b+4
if(!a.X(q,p*o))throw A.e(B.aM)
n=A.b([],t.fb)
for(m=t.i,l=0;l<p;++l){k=A.N(r,0,!1,m)
j=A.N(r,0,!1,m)
i=A.N(r,0,!1,m)
h=q+l*o
for(g=0;g<r;++g,h+=6){if(h>=0)f=h+2<=s.byteLength
else f=!1
if(!f)A.t(A.k(d+h+" overruns a "+a.gk(0)+"-byte font"))
B.a.m(k,g,s.getInt16(h,!1)/16384)
f=h+2
if(f>=0)e=f+2<=s.byteLength
else e=!1
if(!e)A.t(A.k(d+f+" overruns a "+a.gk(0)+"-byte font"))
B.a.m(j,g,s.getInt16(f,!1)/16384)
f=h+4
if(f>=0)e=f+2<=s.byteLength
else e=!1
if(!e)A.t(A.k(d+f+" overruns a "+a.gk(0)+"-byte font"))
B.a.m(i,g,s.getInt16(f,!1)/16384)}B.a.j(n,new A.iv(k,j,i))}return n},
vg(a,b,c){var s,r,q,p,o,n,m,l,k,j
a.l(b,2)
s=a.a
r=s.getUint16(b,!1)
q=b+2
a.l(q,2)
p=s.getUint16(q,!1)
q=b+4
a.l(q,2)
o=s.getUint16(q,!1)
n=(p&32768)!==0
m=p&32767
if(m>o)throw A.e(A.k("ItemVariationData claims "+m+" wide columns of only "+o))
l=A.eC(o,new A.jQ(a,b,c),!1,t.S)
s=o-m
k=n?m*4+s*2:m*2+s
j=b+6+o*2
if(!a.X(j,r*k))throw A.e(B.aH)
return new A.il(r,l,m,n,j,k)},
iv:function iv(a,b,c){this.a=a
this.b=b
this.c=c},
il:function il(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
ji:function ji(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
ha:function ha(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jQ:function jQ(a,b,c){this.a=a
this.b=b
this.c=c},
cB(a){var s,r,q,p,o=a.b
a.l(o,2)
s=a.a
r=s.getUint16(o,!1)
switch(r){case 1:q=o+2
a.l(q,2)
p=s.getUint16(q,!1)
q=o+4
a.l(q,2)
return new A.i3(p,new A.r(s,o+6).a0(s.getUint16(q,!1)))
case 2:q=o+2
a.l(q,2)
return new A.i4(new A.r(s,o+4).a0(s.getUint16(q,!1)*3))
default:throw A.e(A.k("unknown ClassDef format "+r))}},
c4:function c4(){},
i2:function i2(){},
i3:function i3(a,b){this.a=a
this.b=b},
i4:function i4(a){this.a=a},
pG(a){var s=a&65535
s-=s>>>1&21845
s=(s&13107)+(B.b.K(s,2)&13107)
return((s+(s>>>4)&3855)*257>>>8&255)*2},
fX(a){var s,r,q,p,o,n,m,l=a.b
a.l(l,2)
s=a.a
r=s.getUint16(l,!1)
q=l+2
a.l(q,2)
p=s.getUint16(q,!1)
q=l+4
a.l(q,2)
o=s.getUint16(q,!1)
if(o===32768)return new A.fW(r,p,o,$.tK())
if(o<1||o>3)throw A.e(A.k("unknown Device deltaFormat "+o))
n=p>=r?p-r+1:0
m=B.b.ba(16,o)
return new A.fW(r,p,o,new A.r(s,l+6).a0(B.b.aa(n+m-1,m)))},
iR(a){var s,r,q,p,o,n,m,l=null,k=a.b
a.l(k,2)
s=a.a
r=s.getUint16(k,!1)
q=k+2
a.l(q,2)
p=s.getInt16(q,!1)
q=k+4
a.l(q,2)
o=s.getInt16(q,!1)
switch(r){case 1:return new A.dg(p,o,l,l)
case 2:q=k+6
a.l(q,2)
s.getUint16(q,!1)
return new A.dg(p,o,l,l)
case 3:q=k+6
a.l(q,2)
n=s.getUint16(q,!1)
q=k+8
a.l(q,2)
m=s.getUint16(q,!1)
q=n===0?l:A.fX(new A.r(s,k+n))
return new A.dg(p,o,q,m===0?l:A.fX(new A.r(s,k+m)))
default:throw A.e(A.k("unknown Anchor format "+r))}},
tF(a,b,c){var s,r,q,p,o
if(a!==c)return new A.f(a,b)
s=b.b
b.l(s,2)
r=b.a
q=r.getUint16(s,!1)
if(q!==1)throw A.e(A.k("unknown extension subtable format "+q))
p=s+2
b.l(p,2)
o=r.getUint16(p,!1)
if(o===c)throw A.e(A.k("extension subtable nests another extension"))
p=s+4
b.l(p,4)
return new A.f(o,new A.r(r,s+r.getUint32(p,!1)))},
fW:function fW(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
dg:function dg(a,b,c,d){var _=this
_.a=a
_.b=b
_.d=c
_.e=d},
Z(a){var s,r,q,p=a.b
a.l(p,2)
s=a.a
r=s.getUint16(p,!1)
switch(r){case 1:q=p+2
a.l(q,2)
return new A.i7(new A.r(s,p+4).a0(s.getUint16(q,!1)))
case 2:q=p+2
a.l(q,2)
return new A.i8(new A.r(s,p+4).a0(s.getUint16(q,!1)*3))
default:throw A.e(A.k("unknown Coverage format "+r))}},
bx:function bx(){},
i7:function i7(a){this.a=a},
i8:function i8(a){this.a=a},
uZ(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=a.b
a.l(g,2)
s=a.a
r=s.getUint16(g,!1)
q=g+2
a.l(q,2)
p=s.getUint16(q,!1)
if(r!==1)throw A.e(A.k("unsupported GDEF version "+r+"."+p))
q=g+4
a.l(q,2)
o=s.getUint16(q,!1)
q=g+8
a.l(q,2)
s.getUint16(q,!1)
q=g+10
a.l(q,2)
n=s.getUint16(q,!1)
if(p>=2){q=g+12
a.l(q,2)
m=s.getUint16(q,!1)}else m=0
if(p>=3){q=g+14
a.l(q,4)
l=s.getUint32(q,!1)}else l=0
q=m===0
if(!q){k=g+m
a.l(k,2)
j=s.getUint16(k,!1)
if(j!==1)throw A.e(A.k("unknown MarkGlyphSets format "+j))
i=k+2
a.l(i,2)
h=A.N(s.getUint16(i,!1),null,!1,t.f1)}else h=null
i=o===0?B.k:A.cB(new A.r(s,g+o))
s=n===0?B.k:A.cB(new A.r(s,g+n))
q=q?0:g+m
return new A.dy(a,i,s,q,l===0?0:g+l,h,p)},
dy:function dy(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.f=e
_.r=f
_.w=g
_.y=null
_.z=!1},
v6(a){var s=A.r4(a)
return new A.cG(s,new A.r(s.a.a,s.b),A.N(s.w.length,null,!1,t.l7))},
qQ(a,b){var s,r
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.h)(a),++r)if(a[r].V(b))return!0
return!1},
v9(a,b){var s,r,q,p
for(s=a.a,r=a.b,q=0;q<s.length;++q){if(s[q].f!==3)continue
if(!(q<r.length))return A.a(r,q)
p=r[q]
p.b=p.a=0}},
v8(a){var s,r,q,p
for(s=a.a,r=a.b,q=0;q<s.length;++q){if(s[q].e!==5)continue
if(!(q<r.length))return A.a(r,q)
p=r[q]
p.d=p.c=p.b=p.a=0}},
v7(a){var s,r
for(s=a.a,r=0;r<s.length;++r)A.qR(a,r,64)},
qR(a,b,c){var s,r,q,p,o,n,m,l,k,j=a.b
if(!(b>=0&&b<j.length))return A.a(j,b)
s=j[b]
r=s.e
q=s.f
if(r===0)return
s.e=0
p=b+r
if(p<0||p>=a.a.length)return
if(c===0)return
A.qR(a,p,c-1)
if((q&2)!==0){s=j.length
if(!(b<s))return A.a(j,b)
o=j[b]
n=o.d
if(!(p>=0&&p<s))return A.a(j,p)
o.d=n+j[p].d
return}s=j.length
if(!(b<s))return A.a(j,b)
o=j[b]
n=o.c
if(!(p>=0&&p<s))return A.a(j,p)
m=j[p]
n=o.c=n+m.c
m=o.d=o.d+m.d
if(a.c===B.l)for(l=p+1;l<=b;++l,m=k){if(!(l<s))return A.a(j,l)
k=j[l]
n+=k.a
o.c=n
k=m+k.b
o.d=k}else for(l=p;l<b;++l,m=k){if(!(l<s))return A.a(j,l)
k=j[l]
n-=k.a
o.c=n
k=m-k.b
o.d=k}},
cG:function cG(a,b,c){this.a=a
this.b=b
this.c=c},
v5(a,b){var s,r,q,p,o,n,m,l=b.b
b.l(l,2)
s=b.a
r=s.getUint16(l,!1)
switch(a){case 1:return A.w3(b,l,r)
case 2:return A.vG(b,l,r)
case 3:if(r!==1)A.t(A.k("unknown CursivePos format "+r))
q=l+2
b.l(q,2)
return new A.fU(b,l,A.Z(new A.r(s,l+s.getUint16(q,!1))))
case 4:if(r!==1)A.t(A.k("unknown MarkBasePos format "+r))
q=l+2
b.l(q,2)
q=A.Z(new A.r(s,l+s.getUint16(q,!1)))
p=l+4
b.l(p,2)
p=A.Z(new A.r(s,l+s.getUint16(p,!1)))
o=l+6
b.l(o,2)
o=s.getUint16(o,!1)
n=l+8
b.l(n,2)
n=s.getUint16(n,!1)
m=l+10
b.l(m,2)
return new A.hi(q,p,o,new A.fc(b,l+n),new A.f4(b,l+s.getUint16(m,!1)))
case 5:if(r!==1)A.t(A.k("unknown MarkLigPos format "+r))
q=l+2
b.l(q,2)
q=A.Z(new A.r(s,l+s.getUint16(q,!1)))
p=l+4
b.l(p,2)
p=A.Z(new A.r(s,l+s.getUint16(p,!1)))
o=l+6
b.l(o,2)
o=s.getUint16(o,!1)
n=l+8
b.l(n,2)
n=s.getUint16(n,!1)
m=l+10
b.l(m,2)
return new A.hj(b,q,p,o,new A.fc(b,l+n),l+s.getUint16(m,!1))
case 6:if(r!==1)A.t(A.k("unknown MarkMarkPos format "+r))
q=l+2
b.l(q,2)
q=A.Z(new A.r(s,l+s.getUint16(q,!1)))
p=l+4
b.l(p,2)
p=A.Z(new A.r(s,l+s.getUint16(p,!1)))
o=l+6
b.l(o,2)
o=s.getUint16(o,!1)
n=l+8
b.l(n,2)
n=s.getUint16(n,!1)
m=l+10
b.l(m,2)
return new A.hk(q,p,o,new A.fc(b,l+n),new A.f4(b,l+s.getUint16(m,!1)))
case 7:return A.uC(b,l,r)
case 8:return A.us(b,l,r)
default:throw A.e(A.k("unknown GPOS lookup type "+a))}},
q3(a,b,c,d,e,f){var s,r,q,p,o,n,m,l={}
if(e===0)return
l.a=d
s=new A.op(l,b)
if((e&1)!==0){r=f.c
q=s.$0()
if(typeof q!=="number")return A.ah(q)
f.c=r+q}if((e&2)!==0){r=f.d
s=s.$0()
if(typeof s!=="number")return A.ah(s)
f.d=r+s}if((e&4)!==0){s=f.a
r=l.a
b.l(r,2)
f.a=s+b.a.getInt16(r,!1)
l.a+=2}if((e&8)!==0)l.a+=2
if((e&240)===0)return
s=a.e
s=s==null?null:s.length!==0
p=s===!0
o=a.f!==0||p
n=a.r!==0||p
if(!o&&!n)return
l=new A.oo(l,b)
if((e&16)!==0){m=l.$0()
if(o&&m!==0)f.c=f.c+a.bg(A.fX(new A.r(b.a,c+m)),!1)}if((e&32)!==0){m=l.$0()
if(n&&m!==0)f.d=f.d+a.bg(A.fX(new A.r(b.a,c+m)),!0)}if((e&64)!==0){m=l.$0()
if(o&&m!==0)f.a=f.a+a.bg(A.fX(new A.r(b.a,c+m)),!1)}if((e&128)!==0)l.$0()},
w3(a,b,c){var s,r,q,p=b+2
a.l(p,2)
s=a.a
r=A.Z(new A.r(s,b+s.getUint16(p,!1)))
p=b+4
a.l(p,2)
q=s.getUint16(p,!1)
switch(c){case 1:return new A.eT(a,b,r,q,!0)
case 2:return new A.eT(a,b,r,q,!1)
default:throw A.e(A.k("unknown SinglePos format "+c))}},
vG(a,b,c){var s,r,q,p,o,n,m,l,k,j=b+2
a.l(j,2)
s=a.a
r=A.Z(new A.r(s,b+s.getUint16(j,!1)))
j=b+4
a.l(j,2)
q=s.getUint16(j,!1)
j=b+6
a.l(j,2)
p=s.getUint16(j,!1)
switch(c){case 1:return new A.eN(a,b,r,q,p,1,null,null,0,0)
case 2:j=b+8
a.l(j,2)
o=s.getUint16(j,!1)
j=b+10
a.l(j,2)
n=s.getUint16(j,!1)
j=o===0?B.k:A.cB(new A.r(s,b+o))
m=n===0?B.k:A.cB(new A.r(s,b+n))
l=b+12
a.l(l,2)
l=s.getUint16(l,!1)
k=b+14
a.l(k,2)
return new A.eN(a,b,r,q,p,2,j,m,l,s.getUint16(k,!1))
default:throw A.e(A.k("unknown PairPos format "+c))}},
qH(a,b,c){var s,r,q,p,o=a.length
if(!(b>=0&&b<o))return A.a(a,b)
s=a[b]
r=s.e
q=s.f
if(r===0||(q&2)===0)return
s.e=0
p=b+r
if(p===c)return
if(p<0||p>=o)return
A.qH(a,p,c)
o=a.length
if(!(p>=0&&p<o))return A.a(a,p)
s=a[p]
if(!(b<o))return A.a(a,b)
s.d=-a[b].d
s.e=-r
s.f=q},
pM(a,b,c,d,e){var s,r,q,p,o,n,m
if(d==null)return!1
s=b.a
r=b.b
q=r+2+c*4+2
s.l(q,2)
s=s.a
p=s.getUint16(q,!1)
o=a.bJ(p===0?new A.dg(0,0,null,null):A.iR(new A.r(s,r+p)))
n=a.bJ(d)
s=a.a.b
r=a.w
if(!(r>=0&&r<s.length))return A.a(s,r)
m=s[r]
m.c=n.a-o.a
m.d=n.b-o.b
m.f=1
m.e=e-r
a.w=r+1
return!0},
vs(a,b){var s=a.w,r=b.w
if(s===r)return s===0||a.x===b.x
if(!(s>0&&a.x===0))s=r>0&&b.x===0
else s=!0
return s},
mh(a,b,c,d){var s,r,q,p,o
for(s=c.length,r=b.length,q=0;q<s;++q){p=c[q]
o=p.a
if(o>=r)continue
a.w=b[o]
a.iE(p.b)}a.w=d},
mZ(a,b,c,d,e){var s,r,q,p,o,n,m,l,k
if(b===0)return B.m
s=A.N(b,0,!1,t.S)
B.a.m(s,0,a.w)
r=a.w
for(q=d.a,p=a.a,o=a.d,n=1;n<b;++n){m=a.Q
if(m==null)m=a.Q=new A.aP(p,a.x,a.y,o)
l=c+(n-1)*2
if(l>=0)k=l+2<=q.byteLength
else k=!1
if(!k)A.t(A.k("read of 2 byte(s) at "+l+" overruns a "+d.gk(0)+"-byte font"))
r=a.iu(m,r,q.getUint16(l,!1),e)
if(r<0)return null
B.a.m(s,n,r)}return s},
ta(a,b,c,d,e){var s,r,q,p,o,n,m,l=a.w
for(s=d.a,r=a.a,q=a.d,p=0;p<b;++p){o=a.Q
if(o==null)o=a.Q=new A.aP(r,a.x,a.y,q)
n=c+p*2
if(n>=0)m=n+2<=s.byteLength
else m=!1
if(!m)A.t(A.k("read of 2 byte(s) at "+n+" overruns a "+d.gk(0)+"-byte font"))
l=a.ep(o,l,s.getUint16(n,!1),e,!1)
if(l<0)return!1}return!0},
tb(a,b,c,d,e,f){var s,r,q,p,o,n,m,l=f-1
for(s=d.a,r=a.a,q=a.d,p=0;p<b;++p){o=a.Q
if(o==null)o=a.Q=new A.aP(r,a.x,a.y,q)
n=c+p*2
if(n>=0)m=n+2<=s.byteLength
else m=!1
if(!m)A.t(A.k("read of 2 byte(s) at "+n+" overruns a "+d.gk(0)+"-byte font"))
l=a.cG(o,l,s.getUint16(n,!1),e,!1)
if(l<0)return!1}return!0},
oc(a,b,c){var s,r,q,p,o,n="read of 2 byte(s) at ",m=J.aW(c,t.ih)
for(s=a.a,r=0;r<c;++r){q=b+r*4
if(q>=0)p=q+2<=s.byteLength
else p=!1
if(!p)A.t(A.k(n+q+" overruns a "+a.gk(0)+"-byte font"))
p=s.getUint16(q,!1)
q+=2
if(q>=0)o=q+2<=s.byteLength
else o=!1
if(!o)A.t(A.k(n+q+" overruns a "+a.gk(0)+"-byte font"))
m[r]=new A.hh(p,s.getUint16(q,!1))}return m},
xT(a,b){return a.a===b},
uC(a,b,c){var s,r,q
switch(c){case 1:s=b+2
a.l(s,2)
r=a.a
return new A.du(a,b,1,A.Z(new A.r(r,b+r.getUint16(s,!1))),null)
case 2:s=b+4
a.l(s,2)
r=a.a
q=r.getUint16(s,!1)
s=b+2
a.l(s,2)
s=A.Z(new A.r(r,b+r.getUint16(s,!1)))
return new A.du(a,b,2,s,q===0?B.k:A.cB(new A.r(r,b+q)))
case 3:return new A.du(a,b,3,null,null)
default:throw A.e(A.k("unknown ContextPos format "+c))}},
t2(a,b){return new A.my(A.C(t.S,t.c),a,b)},
us(a,b,c){var s,r,q,p=null
switch(c){case 1:s=b+2
a.l(s,2)
r=a.a
return new A.dm(a,b,1,A.Z(new A.r(r,b+r.getUint16(s,!1))),p,p,p)
case 2:s=new A.j_(a,b)
r=b+2
a.l(r,2)
q=a.a
return new A.dm(a,b,2,A.Z(new A.r(q,b+q.getUint16(r,!1))),s.$1(b+4),s.$1(b+6),s.$1(b+8))
case 3:return new A.dm(a,b,3,p,p,p,p)
default:throw A.e(A.k("unknown ChainContextPos format "+c))}},
hh:function hh(a,b){this.a=a
this.b=b},
jH:function jH(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.y=_.x=_.w=0
_.z=64
_.Q=null},
aL:function aL(){},
op:function op(a,b){this.a=a
this.b=b},
oo:function oo(a,b){this.a=a
this.b=b},
eT:function eT(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
eN:function eN(a,b,c,d,e,f,g,h,i,j){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j},
fU:function fU(a,b,c){this.a=a
this.b=b
this.c=c},
fc:function fc(a,b){this.a=a
this.b=b},
f4:function f4(a,b){this.a=a
this.b=b},
hi:function hi(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
hj:function hj(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
hk:function hk(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
du:function du(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
je:function je(a){this.a=a},
my:function my(a,b,c){this.a=a
this.b=b
this.c=c},
dm:function dm(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
j_:function j_(a,b){this.a=a
this.b=b},
iX:function iX(a){this.a=a},
iY:function iY(a){this.a=a},
iZ:function iZ(a){this.a=a},
vb(a){var s=A.r4(a)
return new A.cH(s,A.N(s.w.length,null,!1,t.hJ))},
ii:function ii(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
cH:function cH(a,b){this.a=a
this.b=b},
oR(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h=null,g=a.gt(0),f=A.N(b,0,!1,t.S)
B.a.m(f,0,a.f)
if(b===1)return f
s=a.a.a
r=a.f
if(!(r>=0&&r<s.length))return A.a(s,r)
q=s[r]
p=q.w
o=q.x
for(n=p!==0,m=o!==0,l=r,k=h,j=1;j<b;++j){l=g.cF(l)
if(l<0)return h
if(!(l<s.length))return A.a(s,l)
i=s[l]
if(!c.$2(j,i.a))return h
B.a.m(f,j,l)
if(n&&m){if(p!==i.w||o!==i.x){if(k==null)k=A.xR(a,p)
if(!k)return h}}else{r=i.w
if(r!==0&&i.x!==0&&r!==p)return h}}return f},
xR(a,b){var s,r,q=a.a.a,p=a.f,o=q.length
for(;;){if(p>0){r=p-1
if(!(r<o))return A.a(q,r)
r=q[r].w===b}else r=!1
if(!r){s=!1
break}--p
if(!(p>=0&&p<o))return A.a(q,p)
if(q[p].x===0){s=!0
break}}if(s){o=a.gt(0)
if(!(p>=0&&p<q.length))return A.a(q,p)
o=o.aP(q[p])}else o=!1
return o},
qa(a,b,c){var s,r,q=a.gt(0),p=a.f
for(s=a.a.a,r=0;r<b;++r){p=q.eo(p)
if(p<0)return!1
if(!(p<s.length))return A.a(s,p)
if(!c.$2(r,s[p].a))return!1}return!0},
qb(a,b,c,d){var s,r,q=a.gt(0),p=c-1
for(s=a.a.a,r=0;r<b;++r){p=q.cF(p)
if(p<0)return!1
if(!(p<s.length))return A.a(s,p)
if(!d.$2(r,s[p].a))return!1}return!0},
q2(a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a1.length,a=A.N(64,0,!1,t.S)
if(b>64)return!0
B.a.Z(a,0,b,a1)
for(s=a3.length,r=a0.a.a,q=a0.e,p=a2,o=0;o<s;++o){n=a3[o]
m=n.a
if(m>=b)continue
if(!(m<64))return A.a(a,m)
l=a[m]
k=r.length
if(l>=k)continue
a0.f=l
if(!q.$2(a0,n.b))continue
j=r.length-k
if(j===0)continue
p+=j
i=a[m]
if(p<i){p=i
break}h=m+1
if(j>0){if(j+b>64)break
g=h}else{f=h-b
if(j<f)j=f
g=h-j}e=b-g
if(j>0)for(d=e-1,l=g+j;d>=0;--d){k=l+d
c=g+d
if(!(c>=0&&c<64))return A.a(a,c)
c=a[c]
if(!(k>=0&&k<64))return A.a(a,k)
a[k]=c}else for(l=g+j,d=0;d<e;++d){k=l+d
c=g+d
if(!(c>=0&&c<64))return A.a(a,c)
c=a[c]
if(!(k>=0&&k<64))return A.a(a,k)
a[k]=c}g+=j
b+=j
for(d=h;d<g;++d){l=d-1
if(!(l<64))return A.a(a,l)
B.a.m(a,d,a[l]+1)}for(h=g;h<b;++h){if(!(h>=0&&h<64))return A.a(a,h)
B.a.m(a,h,a[h]+j)}}a0.f=p
return!0},
z9(a,b){var s,r,q,p,o,n,m=A.tF(a,b,7),l=m.a,k=m.b,j=k.b
k.l(j,2)
s=k.a
r=s.getUint16(j,!1)
switch(l){case 1:return A.w4(k,r)
case 2:return A.vt(k,r)
case 3:return A.uk(k,r)
case 4:return A.vo(k,r)
case 5:A:{if(1===r){j=k.b
q=j+2
k.l(q,2)
p=A.Z(new A.r(s,j+s.getUint16(q,!1)))
q=j+4
k.l(q,2)
q=A.n1(k,j,j+6,s.getUint16(q,!1))
q=new A.fQ(p,new A.dX(k,q,A.tx(),A.N(q.length,null,!1,t.h)))
s=q
break A}if(2===r){j=k.b
q=j+2
k.l(q,2)
p=A.Z(new A.r(s,j+s.getUint16(q,!1)))
q=j+4
k.l(q,2)
o=s.getUint16(q,!1)
q=j+6
k.l(q,2)
n=s.getUint16(q,!1)
s=o===0?B.k:A.cB(new A.r(s,j+o))
q=A.n1(k,j,j+8,n)
q=new A.fR(p,s,new A.dX(k,q,A.tx(),A.N(q.length,null,!1,t.h)))
s=q
break A}if(3===r){s=A.uD(k)
break A}s=A.t(A.k("unknown Context subst format "+r))}return s
case 6:B:{if(1===r){j=k.b
q=j+2
k.l(q,2)
p=A.Z(new A.r(s,j+s.getUint16(q,!1)))
q=j+4
k.l(q,2)
q=A.n1(k,j,j+6,s.getUint16(q,!1))
q=new A.fI(p,new A.dX(k,q,A.tw(),A.N(q.length,null,!1,t.h)))
s=q
break B}if(2===r){s=A.ut(k)
break B}if(3===r){s=A.uu(k)
break B}s=A.t(A.k("unknown ChainContext subst format "+r))}return s
case 8:return A.vT(k,r)
default:throw A.e(A.k("unknown GSUB lookup type "+l))}},
w4(a,b){var s,r,q=a.b,p=q+2
a.l(p,2)
s=a.a
r=A.Z(new A.r(s,q+s.getUint16(p,!1)))
switch(b){case 1:p=q+4
a.l(p,2)
return new A.eU(r,s.getInt16(p,!1),null)
case 2:p=q+4
a.l(p,2)
return new A.eU(r,0,new A.r(s,q+6).a0(s.getUint16(p,!1)))
default:throw A.e(A.k("unknown SingleSubst format "+b))}},
vt(a,b){var s,r,q,p,o,n,m,l,k
if(b!==1)throw A.e(A.k("unknown MultipleSubst format "+b))
s=a.b
r=s+2
a.l(r,2)
q=a.a
p=A.Z(new A.r(q,s+q.getUint16(r,!1)))
r=s+4
a.l(r,2)
o=q.getUint16(r,!1)
n=J.aW(o,t.S)
for(r=s+6,m=0;m<o;++m){l=r+m*2
if(l>=0)k=l+2<=q.byteLength
else k=!1
if(!k)A.t(A.k("read of 2 byte(s) at "+l+" overruns a "+a.gk(0)+"-byte font"))
n[m]=s+q.getUint16(l,!1)}return new A.hm(p,a,n,A.N(o,null,!1,t.T))},
uk(a,b){var s,r,q,p,o,n,m,l,k
if(b!==1)throw A.e(A.k("unknown AlternateSubst format "+b))
s=a.b
r=s+2
a.l(r,2)
q=a.a
p=A.Z(new A.r(q,s+q.getUint16(r,!1)))
r=s+4
a.l(r,2)
o=q.getUint16(r,!1)
n=J.aW(o,t.S)
for(r=s+6,m=0;m<o;++m){l=r+m*2
if(l>=0)k=l+2<=q.byteLength
else k=!1
if(!k)A.t(A.k("read of 2 byte(s) at "+l+" overruns a "+a.gk(0)+"-byte font"))
n[m]=s+q.getUint16(l,!1)}return new A.fE(p,a,n,A.N(o,null,!1,t.T))},
vo(a,b){var s,r,q,p,o,n,m,l,k
if(b!==1)throw A.e(A.k("unknown LigatureSubst format "+b))
s=a.b
r=s+2
a.l(r,2)
q=a.a
p=A.Z(new A.r(q,s+q.getUint16(r,!1)))
r=s+4
a.l(r,2)
o=q.getUint16(r,!1)
n=J.aW(o,t.S)
for(r=s+6,m=0;m<o;++m){l=r+m*2
if(l>=0)k=l+2<=q.byteLength
else k=!1
if(!k)A.t(A.k("read of 2 byte(s) at "+l+" overruns a "+a.gk(0)+"-byte font"))
n[m]=s+q.getUint16(l,!1)}return new A.hg(p,a,n,A.N(o,null,!1,t.d1))},
xQ(a,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a.a,d=e.a,c=a0.length,b=c-1
if(!(b>=0))return A.a(a0,b)
s=a0[b]
A.xU(e,a.f,s+1)
if(0>=c)return A.a(a0,0)
s=a0[0]
r=d.length
if(!(s>=0&&s<r))return A.a(d,s)
s=d[s].f
q=s===1
p=s===3
for(o=1;o<c;++o){s=a0[o]
if(!(s>=0&&s<r))return A.a(d,s)
if(d[s].f!==3){q=!1
p=!1
break}}n=!q&&!p
m=n?2:0
l=n?A.x1(e):0
s=a.f
if(!(s>=0&&s<d.length))return A.a(d,s)
r=d[s]
k=r.w
if(n){r.w=l
r.x=0
if(r.e===1)r.e=6}a.bW(s,a1,m)
for(j=1,i=0,o=1;o<c;++o){for(h=a0[o-1]+1,s=j-1;r=a0[o],h<r;++h){if(n){if(!(h>=0&&h<d.length))return A.a(d,h)
r=d[h]
g=r.x
if(g===0)g=1
r.w=l
r.x=s+(g<1?g:1)}++i}if(!(r>=0&&r<d.length))return A.a(d,r)
k=d[r].w;++j}for(s=e.b,o=b;o>=1;--o){B.a.aM(d,a0[o])
B.a.aM(s,a0[o])}f=a.f+1+i
if(!p&&k!==0)for(b=j-1,o=f;s=d.length,o<s;++o){if(!(o>=0))return A.a(d,o)
s=d[o]
if(s.w!==k)break
g=s.x
if(g===0)break
s.w=l
s.x=b+(g<1?g:1)}a.f=f},
x1(a){var s,r,q,p,o
for(s=a.a,r=s.length,q=0,p=0;p<r;++p){o=s[p].w
if(o>0&&o<8)q|=B.b.a4(1,o)}for(o=1;o<8;++o)if((q&B.b.a4(1,o))>>>0===0)return o
return 1},
xU(a,b,c){var s,r,q,p,o,n
if(c-b<2)return
s=a.a
r=s.length
if(!(b>=0&&b<r))return A.a(s,b)
q=s[b].c
for(p=b+1,o=q;p<c;++p){if(!(p<r))return A.a(s,p)
n=s[p].c
if(n<o)o=n}p=b
for(;;){if(p>0){r=p-1
if(!(r<s.length))return A.a(s,r)
r=s[r].c===q}else r=!1
if(!r)break;--p
if(!(p>=0&&p<s.length))return A.a(s,p)
s[p].c=o}for(p=b;p<c;++p){if(!(p<s.length))return A.a(s,p)
s[p].c=o}},
od(a,b,c){var s,r,q,p,o,n="read of 2 byte(s) at ",m=J.aW(c,t.nu)
for(s=a.a,r=0;r<c;++r){q=b+r*4
if(q>=0)p=q+2<=s.byteLength
else p=!1
if(!p)A.t(A.k(n+q+" overruns a "+a.gk(0)+"-byte font"))
p=s.getUint16(q,!1)
q+=2
if(q>=0)o=q+2<=s.byteLength
else o=!1
if(!o)A.t(A.k(n+q+" overruns a "+a.gk(0)+"-byte font"))
m[r]=new A.hB(p,s.getUint16(q,!1))}return m},
y3(a,b){var s,r,q,p,o,n
t.bb.a(a)
A.D(b)
a.l(b,2)
s=a.a
r=s.getUint16(b,!1)
q=b+2
a.l(q,2)
p=s.getUint16(q,!1)
q=b+4
o=r===0?0:r-1
n=new A.r(s,q).a0(o)
return new A.bV(B.m,n,B.m,A.od(a,q+n.length*2,p))},
y1(a,b){var s,r,q,p,o,n,m,l,k
t.bb.a(a)
A.D(b)
a.l(b,2)
s=a.a
r=s.getUint16(b,!1)
q=new A.r(s,b+2).a0(r)
p=b+(2+r*2)
a.l(p,2)
o=s.getUint16(p,!1)
n=o===0?0:o-1
m=new A.r(s,p+2).a0(n)
p+=2+m.length*2
a.l(p,2)
l=s.getUint16(p,!1)
k=new A.r(s,p+2).a0(l)
p+=2+l*2
a.l(p,2)
return new A.bV(q,m,k,A.od(a,p+2,s.getUint16(p,!1)))},
n1(a,b,c,d){return A.eC(d,new A.n2(a,c,b),!1,t.S)},
mY(a,b,c,d,e){var s,r,q=A.oR(a,b.b.length+1,d)
if(q==null)return!1
s=q.length
r=s-1
if(!(r>=0))return A.a(q,r)
s=q[r]
if(!A.qb(a,b.c.length,s+1,e))return!1
if(!A.qa(a,b.a.length,c))return!1
A.q2(a,q,q[r]+1,b.d)
return!0},
uD(a){var s,r,q,p,o,n,m,l=a.b,k=l+2
a.l(k,2)
s=a.a
r=s.getUint16(k,!1)
k=l+4
a.l(k,2)
q=s.getUint16(k,!1)
p=J.aW(r,t.c)
for(k=l+6,o=0;o<r;++o){n=k+o*2
if(n>=0)m=n+2<=s.byteLength
else m=!1
if(!m)A.t(A.k("read of 2 byte(s) at "+n+" overruns a "+a.gk(0)+"-byte font"))
p[o]=A.Z(new A.r(s,l+s.getUint16(n,!1)))}return new A.fS(p,A.od(a,k+r*2,q))},
ut(a){var s,r,q,p,o,n=a.b,m=n+2
a.l(m,2)
s=a.a
r=A.Z(new A.r(s,n+s.getUint16(m,!1)))
m=new A.j6(a,n)
q=n+10
a.l(q,2)
p=s.getUint16(q,!1)
q=m.$1(n+4)
s=m.$1(n+6)
m=m.$1(n+8)
o=A.n1(a,n,n+12,p)
return new A.fJ(r,q,s,m,new A.dX(a,o,A.tw(),A.N(o.length,null,!1,t.h)))},
uu(a){var s,r,q,p,o,n={},m=a.b
n.a=m+2
s=new A.ja(n,a,m)
r=s.$0()
q=s.$0()
p=s.$0()
s=n.a
a.l(s,2)
o=a.a.getUint16(s,!1)
return new A.fK(r,q,p,A.od(a,n.a+2,o))},
xX(a,b){return!1},
vT(a,b){var s,r,q,p,o,n,m,l={}
if(b!==1)throw A.e(A.k("unknown ReverseChainSingleSubst format "+b))
s=a.b
r=s+2
a.l(r,2)
q=a.a
p=A.Z(new A.r(q,s+q.getUint16(r,!1)))
l.a=s+4
r=new A.kl(l,a,s)
o=r.$0()
n=r.$0()
r=l.a
a.l(r,2)
m=q.getUint16(r,!1)
return new A.hz(p,o,n,new A.r(q,l.a+2).a0(m))},
hB:function hB(a,b){this.a=a
this.b=b},
eu:function eu(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.x=_.w=_.r=_.f=0
_.y=null},
aF:function aF(){},
eU:function eU(a,b,c){this.a=a
this.b=b
this.c=c},
hm:function hm(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fE:function fE(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
d5:function d5(a,b){this.a=a
this.b=b},
hg:function hg(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jW:function jW(a,b){this.a=a
this.b=b},
jX:function jX(a){this.a=a},
bV:function bV(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
dX:function dX(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
n2:function n2(a,b,c){this.a=a
this.b=b
this.c=c},
fQ:function fQ(a,b){this.a=a
this.b=b},
jf:function jf(a){this.a=a},
fR:function fR(a,b,c){this.a=a
this.b=b
this.c=c},
jg:function jg(a,b){this.a=a
this.b=b},
fS:function fS(a,b){this.a=a
this.b=b},
jh:function jh(a){this.a=a},
fI:function fI(a,b){this.a=a
this.b=b},
j1:function j1(a){this.a=a},
j0:function j0(a){this.a=a},
j2:function j2(a){this.a=a},
fJ:function fJ(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
j6:function j6(a,b){this.a=a
this.b=b},
j4:function j4(a,b){this.a=a
this.b=b},
j3:function j3(a,b){this.a=a
this.b=b},
j5:function j5(a,b){this.a=a
this.b=b},
fK:function fK(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ja:function ja(a,b,c){this.a=a
this.b=b
this.c=c},
j7:function j7(a){this.a=a},
j8:function j8(a){this.a=a},
j9:function j9(a){this.a=a},
hz:function hz(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
kl:function kl(a,b,c){this.a=a
this.b=b
this.c=c},
kj:function kj(a){this.a=a},
kk:function kk(a){this.a=a},
aP:function aP(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
r4(a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a="read of 4 byte(s) at ",a0="read of 2 byte(s) at ",a1=a2.b
a2.l(a1,2)
s=a2.a
r=s.getUint16(a1,!1)
q=a1+2
a2.l(q,2)
p=s.getUint16(q,!1)
if(r!==1)throw A.e(A.k("unsupported layout table version "+r+"."+p))
q=a1+4
a2.l(q,2)
o=s.getUint16(q,!1)
q=a1+6
a2.l(q,2)
n=s.getUint16(q,!1)
q=a1+8
a2.l(q,2)
m=s.getUint16(q,!1)
if(p>=1){q=a1+10
a2.l(q,4)
s.getUint32(q,!1)}q=t.S
l=A.C(q,q)
if(o!==0){k=a1+o
a2.l(k,2)
j=s.getUint16(k,!1)
for(q=k+2,i=0;i<j;++i){h=q+i*6
if(h>=0)g=h+4<=s.byteLength
else g=!1
if(!g)A.t(A.k(a+h+" overruns a "+a2.gk(0)+"-byte font"))
g=s.getUint32(h,!1)
f=h+4
if(f>=0)e=f+2<=s.byteLength
else e=!1
if(!e)A.t(A.k(a0+f+" overruns a "+a2.gk(0)+"-byte font"))
l.m(0,g,k+s.getUint16(f,!1))}}q=t.t
d=A.b([],q)
c=A.b([],q)
if(n!==0){k=a1+n
a2.l(k,2)
j=s.getUint16(k,!1)
for(g=k+2,i=0;i<j;++i){h=g+i*6
if(h>=0)f=h+4<=s.byteLength
else f=!1
if(!f)A.t(A.k(a+h+" overruns a "+a2.gk(0)+"-byte font"))
B.a.j(d,s.getUint32(h,!1))
f=h+4
if(f>=0)e=f+2<=s.byteLength
else e=!1
if(!e)A.t(A.k(a0+f+" overruns a "+a2.gk(0)+"-byte font"))
B.a.j(c,k+s.getUint16(f,!1))}}b=A.b([],q)
if(m!==0){k=a1+m
a2.l(k,2)
j=s.getUint16(k,!1)
for(q=k+2,i=0;i<j;++i){g=q+i*2
if(g>=0)f=g+2<=s.byteLength
else f=!1
if(!f)A.t(A.k(a0+g+" overruns a "+a2.gk(0)+"-byte font"))
B.a.j(b,k+s.getUint16(g,!1))}}return new A.jV(a2,a1,l,d,c,A.N(d.length,null,!1,t.T),p,b)},
jV:function jV(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
hF:function hF(a,b){this.a=a
this.b=b},
kB:function kB(){},
um(a){var s,r,q,p,o,n,m,l,k,j=a.a,i=j.length,h=A.N(i,7,!1,t.S)
for(s=0,r=-1,q=0;q<i;++q){if(!(q<j.length))return A.a(j,q)
p=A.ul(j[q])
if(p<0){B.a.m(h,q,7)
continue}o=$.u5()
n=s*6+p
if(!(n<42))return A.a(o,n)
m=o[n]
l=m>>>8&15
k=m&15
if(l!==7&&r>=0)B.a.m(h,r,l)
B.a.m(h,q,m>>>4&15)
r=q
s=k}return h},
ul(a){var s,r,q=a.d
if(q===5)return-1
s=a.b
if(s>=1792&&s<=1871){if(s===1808)return 4
if(B.eZ.v(0,s))return 5}A:{r=3
if(1===q){r=1
break A}if(2===q){r=2
break A}if(3===q)break A
if(4===q)break A
r=0
break A}return r},
G(a,b,c){return(a<<8|b<<4|c)>>>0},
ea:function ea(){},
yt(a,b){var s,r
a.aE(1920365166)
a.bI()
if(a.c===B.l){a.aE(1920232545)
a.bH(1920232557)}else{a.aE(1819570785)
a.aE(1819570797)}a.bH(1718772067)
a.bH(1853189490)
a.bH(1684959085)
b.e6(a)
for(s=0;s<7;++s){r=B.cD[s]
a.aU(r,(r===1835102827||r===1835756907?6:0)|1,1)}for(s=0;s<7;++s){r=B.d_[s]
a.aU(r,(r===1801810542?8:0)|1,1)}},
eS:function eS(){},
fV:function fV(){},
aH:function aH(a,b,c,d,e,f,g,h,i,j,k){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k},
cb:function cb(a){var _=this
_.a=a
_.f=_.e=_.d=_.c=_.b=0},
eZ:function eZ(a,b){this.a=a
this.b=b},
jA:function jA(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=0},
jB:function jB(){},
ra(a,b){var s,r,q,p=a.a
if(b===p)return
B.a.a2(p)
B.a.A(p,b)
p=a.b
B.a.a2(p)
s=b.length
r=J.pq(s,t.lr)
for(q=0;q<s;++q)r[q]=new A.cb(0)
B.a.A(p,r)},
vE(a,b,c){var s,r,q,p=a.a,o=p.length
if(!(b>=0&&b<o))return A.a(p,b)
s=p[b].c
for(r=b+1;r<c;++r){if(!(r<o))return A.a(p,r)
q=p[r].c
if(q<s)s=q}for(r=b;r<c;++r){if(!(r<p.length))return A.a(p,r)
p[r].c=s}},
xe(a){var s,r,q,p,o,n,m,l,k,j,i
if(a>=44032&&a<55204){s=a-44032
r=B.b.T(s,28)
if(r!==0)return new A.f(44032+s-r,4519+r)
return new A.f(4352+B.b.F(s,588),4449+B.b.F(B.b.T(s,588),28))}q=$.u7()
p=q.length
o=(p/3|0)-1
for(n=0;n<=o;){m=B.b.K(n+o,1)
l=m*3
if(!(l<p))return A.a(q,l)
k=q[l]
if(a<k)o=m-1
else if(a>k)n=m+1
else{j=l+1
if(!(j<p))return A.a(q,j)
j=q[j]
i=l+2
if(!(i<p))return A.a(q,i)
return new A.f(j,q[i])}}return B.ah},
xd(a,b){var s,r,q,p,o,n,m,l,k
if(a>=4352&&a<4371)if(b>=4449&&b<4470)return 44032+((a-4352)*21+(b-4449))*28
if(a>=44032&&a<55204)if(B.b.T(a-44032,28)===0&&b>4519&&b<4547)return a+(b-4519)
s=$.u6()
r=s.length
q=(r/3|0)-1
for(p=0;p<=q;){o=B.b.K(p+q,1)
n=o*3
if(!(n<r))return A.a(s,n)
m=s[n]
l=n+1
if(!(l<r))return A.a(s,l)
k=s[l]
if(a>=m)l=a===m&&b<k
else l=!0
if(l)q=o-1
else{if(a<=m)l=a===m&&b>k
else l=!0
if(l)p=o+1
else{l=n+2
if(!(l<r))return A.a(s,l)
return s[l]}}}return-1},
hp:function hp(a,b){this.a=a
this.b=b},
k4:function k4(a){this.a=a},
n_:function n_(){},
w1(a){var s,r,q,p,o,n,m,l,k,j
for(s=a.a,r=0,q=1;p=s.length,q<=p;++q){if(q<p){o=s[q]
n=o.e
m=n===1||n===2||n===3||o.b===8205}else m=!1
if(m)continue
if(q-r>1){if(!(r>=0&&r<p))return A.a(s,r)
l=s[r].c
for(k=r+1;k<q;++k){j=s[k].c
if(j<l)l=j}for(k=r;k<q;++k){if(!(k<s.length))return A.a(s,k)
s[k].c=l}}r=q}},
w0(a){var s=B.eY.v(0,a.d)?B.l:B.y
if(a.c===s)return
a.eu()
a.c=a.c===B.l?B.y:B.l},
w_(a,b){var s,r,q,p,o,n
if(b==null||b.b===B.k)return
for(s=a.a,r=s.length,q=b.b,p=b.c,o=0;o<s.length;s.length===r||(0,A.h)(s),++o){n=s[o]
n.f=q.O(n.a)
n.r=p.O(n.a)}},
yU(a){var s
if(a<173)return!1
s=!0
if(a!==173)if(a!==847)if(a!==1564)if(!(a>=4447&&a<=4448))if(!(a>=6068&&a<=6069))if(!(a>=6155&&a<=6159))if(!(a>=8203&&a<=8207))if(!(a>=8234&&a<=8238))if(!(a>=8288&&a<=8303))if(a!==12644)if(!(a>=65024&&a<=65039))if(a!==65279)if(a!==65440)if(!(a>=65520&&a<=65528))if(!(a>=113824&&a<=113827))if(!(a>=119155&&a<=119162))s=a>=917504&&a<=921599
return s},
hC:function hC(a,b,c){this.a=a
this.b=b
this.c=c},
kx:function kx(){},
hD:function hD(a,b,c){var _=this
_.a=a
_.b=b
_.c=$
_.d=c},
w2(a){var s
for(s=0;a>0;){++s
a=a>>>1}return s},
hw:function hw(a,b){this.a=a
this.b=b},
hv:function hv(a){this.a=a},
hE:function hE(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
bW:function bW(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.r=_.f=0},
kz:function kz(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.r=_.e=0},
kA:function kA(){},
up(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=A.uo(a)
if(d.length<=1)return A.rN(a,null).ev()
s=J.o(a)
r=s.gk(a)
q=new Uint8Array(r)
r=t.lW
p=A.b([],r)
o=A.b([],r)
n=A.b([],r)
for(m=0,l=0,k=0;k<d.length;++k,m=j){j=d[k]
i=A.rN(s.I(a,m,j),null).ev()
B.j.bU(q,m,i.a)
for(r=i.c,h=r.length,g=0;g<r.length;r.length===h||(0,A.h)(r),++g){f=r[g]
B.a.j(p,new A.bu(f.a+m,f.b+m,f.c))}for(r=i.d,h=r.length,g=0;g<r.length;r.length===h||(0,A.h)(r),++g){f=r[g]
B.a.j(o,new A.bu(f.a+m,f.b+m,f.c))}e=i.b
B.a.j(n,new A.bu(m,j,e))
if(k===0)l=e}return new A.ed(q,l,p,o)},
uo(a){var s,r,q,p=A.b([],t.t)
for(s=J.o(a),r=0;r<s.gk(a);++r){q=s.h(a,r)
if(A.ap($.qm(),q)!==10)continue
if(s.h(a,r)===13){q=r+1
q=q<s.gk(a)&&s.h(a,q)===10}else q=!1
if(q)continue
B.a.j(p,r+1)}if(p.length===0||B.a.gN(p)!==s.gk(a))B.a.j(p,s.gk(a))
return p},
rN(a,b){var s,r,q,p=J.o(a),o=p.gk(a),n=p.gk(a)
n=new Uint8Array(n)
s=p.gk(a)
s=new Uint8Array(s)
r=p.gk(a)
r=new Uint8Array(r)
q=p.gk(a)
q=new Int32Array(q)
p=p.gk(a)
p=new A.m5(a,b,o,n,s,r,q,new Int32Array(p))
p.eL(a,b)
return p},
wB(a,b,c,d,e){var s,r,q,p,o,n=b.length,m=t.S,l=J.aW(n,m)
for(s=a.e,r=b.length,q=s.length,p=0;p<n;++p){if(!(p<r))return A.a(b,p)
o=b[p]
if(!(o<q))return A.a(s,o)
l[p]=s[o]}s=new A.ik(a,b,l,c,d,e)
m=A.X(l,m)
m.$flags=1
s.d=t.L.a(m)
return s},
rJ(a){var s
A:{if(0===a){s=0
break A}if(1===a||3===a||6===a){s=1
break A}s=-1
break A}return s},
rI(a){B.a.aG(a,new A.lW())
return a},
rH(a){var s
A:{if(12296===a){s=9001
break A}if(12297===a){s=9002
break A}s=a
break A}return s},
bu:function bu(a,b,c){this.a=a
this.b=b
this.c=c},
ed:function ed(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
m5:function m5(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.z=_.y=_.x=$},
ik:function ik(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=$
_.e=d
_.f=e
_.r=f},
lW:function lW(){},
vY(a){var s,r,q,p,o,n,m,l,k=1145457748,j=a.length
if(j===0)return B.cN
s=A.b([],t.m1)
for(r=0,q=-1,p=0;p<j;++p){if(!(p<a.length))return A.a(a,p)
o=a[p]
n=A.ap($.u9(),o)
if(n===$.u1()||n===$.u2()||n===0)continue
m=k
if(n>=0&&n<$.qk().length){o=$.qk()
if(!(n>=0&&n<o.length))return A.a(o,n)
l=o[n]}else l=m
if(q===-1)q=l
else if(l!==q){B.a.j(s,new A.eR(r,p,q))
q=l
r=p}}B.a.j(s,new A.eR(r,j,q===-1?k:q))
return s},
eR:function eR(a,b,c){this.a=a
this.b=b
this.c=c},
oh:function oh(){},
k(a){return new A.aE(a)},
r:function r(a,b){this.a=a
this.b=b},
aE:function aE(a){this.a=a},
qE(a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=a9.length,a3=a2/12|0,a4=a3*4,a5=new Float32Array(a4),a6=new Float32Array(256),a7=new Int32Array(256)
for(s=a8.length,r=0;r<a3;++r){q=r*12
p=q+4
if(!(p<a2))return A.a(a9,p)
o=B.c.S(a9[p])
p=q+5
if(!(p<a2))return A.a(a9,p)
for(p=o+B.c.S(a9[p]),n=o,m=1/0,l=1/0,k=-1/0,j=-1/0;n<p;++n){i=n*4
if(!(i>=0&&i<s))return A.a(a8,i)
h=a8[i]
m=Math.min(m,h)
k=Math.max(k,h);++i
if(!(i<s))return A.a(a8,i)
i=a8[i]
l=Math.min(l,i)
j=Math.max(j,i)}p=r*4
if(!(p<a4))return A.a(a5,p)
a5[p]=m
i=p+1
if(!(i<a4))return A.a(a5,i)
a5[i]=l
i=p+2
if(!(i<a4))return A.a(a5,i)
a5[i]=k
p+=3
if(!(p<a4))return A.a(a5,p)
a5[p]=j
for(g=B.b.E(B.c.a5(l/4096*16),0,15),p=j/4096*16,i=m/4096*16,h=k/4096*16;g<=B.b.E(B.c.a5(p),0,15);++g)for(f=B.b.E(B.c.a5(i),0,15),e=g*16;f<=B.b.E(B.c.a5(h),0,15);++f){d=e+f
if(!(d>=0&&d<256))return A.a(a7,d)
c=a7[d]
if(!(d<256))return A.a(a7,d)
a7[d]=c+1
c=a6[d]
if(!(q<a2))return A.a(a9,q)
c=Math.max(c,a9[q])
if(!(d<256))return A.a(a6,d)
a6[d]=c}}b=new Float32Array(257)
for(d=0;d<256;d=a){a=d+1
a2=b[d]
s=a7[d]
if(!(a<257))return A.a(b,a)
b[a]=a2+s}a2=B.c.S(b[256])
a0=new Float32Array(a2)
a1=new Int32Array(256)
for(r=0;r<a3;++r){s=r*4
p=s+1
if(!(p<a4))return A.a(a5,p)
g=B.b.E(B.c.a5(a5[p]/4096*16),0,15)
p=s+3
if(!(p<a4))return A.a(a5,p)
i=s+2
for(;g<=B.b.E(B.c.a5(a5[p]/4096*16),0,15);++g){if(!(s<a4))return A.a(a5,s)
f=B.b.E(B.c.a5(a5[s]/4096*16),0,15)
if(!(i<a4))return A.a(a5,i)
h=g*16
for(;f<=B.b.E(B.c.a5(a5[i]/4096*16),0,15);++f){d=h+f
if(!(d>=0&&d<257))return A.a(b,d)
e=B.c.S(b[d])
if(!(d<256))return A.a(a1,d)
c=a1[d]
if(!(d<256))return A.a(a1,d)
a1[d]=c+1
c=e+c
if(!(c>=0&&c<a2))return A.a(a0,c)
a0[c]=r}}}return new A.iU(a5,b,a0,a6)},
iU:function iU(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
vM(a,b){var s,r,q,p,o,n,m,l,k,j,i=A.b([],t.d2)
for(s=b.d.gai(),s=s.gt(s),r=t.u,q=t.j,p=t.s,o=t.I;s.n();){n=s.gp()
m=n.a
l=n.b
n=new A.iC(m)
l=q.b(l)?l:B.D
k=J.o(l)
j=k.gC(l)?null:k.gu(l)
n.b=r.a(A.w(k.gk(l)>1?k.h(l,1):null))
n.c=r.a(A.w(typeof j=="string"?A.b([j,A.b(["accumulated"],p),A.b(["get",m],p)],o):j))
i.push(n)}i=new A.kg(b,i,new A.A(B.e,B.e),A.C(t.S,t.el))
i.eI(a,b)
return i},
jb:function jb(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
iC:function iC(a){this.a=a
this.c=this.b=$},
b6:function b6(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=null
_.f=0},
kg:function kg(a,b,c,d){var _=this
_.a=a
_.b=$
_.c=b
_.d=c
_.e=1
_.f=d},
ki:function ki(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
kh:function kh(a){this.a=a},
rm(a,b,c){var s=a.a,r=a.b,q=a.c,p=a.d
return new A.ad(s+(b.a-s)*c,r+(b.b-r)*c,q+(b.c-q)*c,p+(b.d-p)*c)},
rk(a,b,c,d){var s,r,q=new A.km(),p=new A.kn(),o=(a+16)/116,n=q.$1(o),m=q.$1(o+b/500)
if(typeof m!=="number")return A.ah(m)
s=0.96422*m
q=q.$1(o-c/200)
if(typeof q!=="number")return A.ah(q)
r=0.82521*q
return new A.ad(p.$1(3.1338561*s-1.6168667*n-0.4906146*r),p.$1(-0.9787684*s+1.9161415*n+0.033454*r),p.$1(0.0719453*s-0.2289914*n+1.4052427*r),d)},
aO(a){if(a instanceof A.ad)return a
if(typeof a!="string")return null
return $.vV.bj(a,new A.ku(a))},
vU(a){var s,r,q,p,o,n,m,l,k,j,i=null,h=B.d.bo(a).toLowerCase()
if(B.d.ap(h,"#")){s=B.d.aq(h,1)
r=s.length
if(r===3||r===4)s=new A.ar(A.b(s.split(""),t.s),t.gL.a(new A.kq()),t.gQ).bP(0)
q=A.vO(s,16)
if(q==null)return i
r=s.length
if(r===6)return new A.ad((B.b.K(q,16)&255)/255,(B.b.K(q,8)&255)/255,(q&255)/255,1)
if(r===8)return new A.ad((B.b.K(q,24)&255)/255,(B.b.K(q,16)&255)/255,(B.b.K(q,8)&255)/255,(q&255)/255)
return i}p=B.d.aF(h,"(")
if(p>0&&B.d.cz(h,")")){r=B.d.cX(B.d.a9(h,p+1,h.length-1),A.hy("[,/\\s]+"))
o=A.M(r)
n=o.i("aQ<1>")
m=A.X(new A.aQ(r,o.i("B(1)").a(new A.kr()),n),n.i("i.E"))
r=new A.ks(m)
o=m.length
if(o<3)return i
l=o>3?r.$2(3,1):1
k=B.d.a9(h,0,p)
if(k==="rgb"||k==="rgba")return new A.ad(r.$2(0,255),r.$2(1,255),r.$2(2,255),l)
if(k==="hsl"||k==="hsla"){if(0>=m.length)return A.a(m,0)
o=m[0]
o=A.P(A.qe(o,"deg",""))
return A.rl(B.c.T(o==null?0:o,360)/360,r.$2(1,100),r.$2(2,100),l)}return i}j=B.de.h(0,h)
if(j==null)return i
return new A.ad((j>>>16&255)/255,(j>>>8&255)/255,(j&255)/255,(j>>>24&255)/255)},
rl(a,b,c,d){var s=c<0.5?c*(1+b):c+b-c*b,r=new A.kt(2*c-s,s)
return new A.ad(r.$1(a+0.3333333333333333),r.$1(a),r.$1(a-0.3333333333333333),d)},
ad:function ad(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
kp:function kp(){},
ko:function ko(){},
km:function km(){},
kn:function kn(){},
ku:function ku(a){this.a=a},
kq:function kq(){},
kr:function kr(){},
ks:function ks(a){this.a=a},
kt:function kt(a,b){this.a=a
this.b=b},
E(a){var s
if(typeof a=="number")s=a
else if(typeof a=="string")s=A.P(a)
else if(A.H(a))s=a?1:0
else s=null
return s},
au(a){if(a==null)return""
if(typeof a=="number"&&a===B.c.a1(a))return B.b.q(B.c.S(a))
return J.bk(a)},
q1(a){var s,r,q,p
if(a==null)return"null"
if(A.H(a))return"boolean"
if(typeof a=="number")return"number"
if(typeof a=="string")return"string"
if(a instanceof A.ad)return"color"
if(a instanceof A.bn)return"formatted"
if(t.j.b(a)){for(s=J.Y(a),r=s.gt(a),q=null;r.n();){p=A.q1(r.gp())
if(q==null)q=p
else if(q!==p){q="value"
break}}r=q==null?"value":q
return"array<"+r+", "+s.gk(a)+">"}return"object"},
tl(a){var s,r=!1
if(a!=null){s=J.ao(a)
if(!s.D(a,!1))if(!s.D(a,0))if(!s.D(a,""))r=!(typeof a=="number"&&isNaN(a))}return r},
t_(a,b){var s=new A.mp(a,b)
$.pO.m(0,a,s)
return s},
aj(a){return new A.mw(a)},
w(a){var s
if(t.f.b(a))return a.M("stops")||a.M("property")?A.pT(a):A.aj(a)
if(t.j.b(a)){s=J.o(a)
s=s.gJ(a)&&B.eX.v(0,s.gu(a))}else s=!1
if(s){s=J.Y(a)
return A.xZ(A.W(s.gu(a)),s.a_(a,1))}return A.aj(a)},
tr(a){var s
if(typeof a=="string"&&B.d.v(a,"{"))return A.tk(a)
s=A.w(a)
if(t.f.b(a)&&a.h(0,"property")==null)return new A.oy(s,A.C(t.N,t.u))
return new A.oz(s)},
tk(a){var s,r,q,p,o,n,m,l,k=A.b([],t.I)
for(s=A.hy("\\{([^}]*)\\}").cn(0,a),s=new A.f3(s.a,s.b,s.c),r=t.s,q=t.lu,p=0;s.n();){o=s.d
n=(o==null?q.a(o):o).b
m=n.index
if(m>p)B.a.j(k,B.d.a9(a,p,m))
if(1>=n.length)return A.a(n,1)
l=n[1]
l.toString
B.a.j(k,A.b([l],r))
p=m+n[0].length}if(p<a.length)B.a.j(k,B.d.aq(a,p))
return new A.oi(k)},
yu(a){return A.iJ(new A.ov().$1(a))},
iJ(a){return new A.ox(A.tr(a))},
os(a){if(a==null)return new A.ot()
return new A.ou(A.mA(a))},
mA(a){var s,r,q,p,o,n,m,l,k,j=t.j
if(!j.b(a)||J.de(a))return A.aj(!J.m(a,!1))
s=J.Y(a)
r=s.gu(a)
q=s.a_(a,1)
p=new A.mK()
s=J.o(q)
if(s.gJ(q))if(typeof s.gu(q)=="string"){o=q.length
n=!0
if(o>=2){if(1>=o)return A.a(q,1)
if(j.b(q[1])){o=J.ao(r)
o=o.D(r,"in")||o.D(r,"!in")}else o=n}else o=n
n=o}else n=!1
else n=!1
if("all"===r){j=A.b([],t.V)
for(s=q.length,m=0;m<q.length;q.length===s||(0,A.h)(q),++m)j.push(A.mA(q[m]))
return new A.mB(j)}if("any"===r){j=A.b([],t.V)
for(s=q.length,m=0;m<q.length;q.length===s||(0,A.h)(q),++m)j.push(A.mA(q[m]))
return new A.mC(j)}if("none"===r){j=A.b([],t.V)
for(s=q.length,m=0;m<q.length;q.length===s||(0,A.h)(q),++m)j.push(A.mA(q[m]))
return new A.mD(j)}if("!has"===r)return new A.mE(s.gu(q))
if("!in"===r){l=s.gu(q)
return new A.mF(J.qx(s.a_(q,1)),p,l)}o=!1
if("in"===r)if(n){o=q.length
if(o===2){if(1>=o)return A.a(q,1)
j=!j.b(q[1])}else j=!0}else j=o
else j=o
if(j){l=s.gu(q)
return new A.mG(J.qx(s.a_(q,1)),p,l)}j="=="===r
if((j||"!="===r||"<"===r||"<="===r||">"===r||">="===r)&&n){l=s.gu(q)
if(1>=q.length)return A.a(q,1)
k=q[1]
A:{if(j){j=new A.mH(p,l,k)
break A}if("!="===r){j=new A.mI(p,l,k)
break A}j=new A.mJ(r,p,l,k)
break A}return j}return A.w(a)},
tn(a){var s=t.J
return A.dL(A.py(new A.an(a),s.i("c(i.E)").a(new A.om()),s.i("i.E"),t.S),0,null)},
pN(a,b,c){var s,r
if(typeof b=="number"&&typeof c=="number")s=B.c.ab(b,c)
else if(typeof b=="string"&&typeof c=="string")s=B.d.ab(b,c)
else return!1
A:{if("<"===a){r=s<0
break A}if("<="===a){r=s<=0
break A}if(">"===a){r=s>0
break A}r=s>=0
break A}return r},
xZ(d5,d6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1=null,d2=new A.n6(d6),d3=new A.n5(d6),d4=new A.o9(d2)
if("literal"===d5){s=J.o(d6)
return A.aj(s.gC(d6)?d1:s.gu(d6))}if("get"===d5){s=J.o(d6)
r=s.gC(d6)?d1:s.gu(d6)
if(d6.length>1){q=d2.$1(0)
return new A.n7(d2.$1(1),q)}if(typeof r=="string")return new A.n8(r)
return new A.n9(d2.$1(0))}if("has"===d5){s=J.o(d6)
r=s.gC(d6)?d1:s.gu(d6)
if(d6.length>1){q=d2.$1(0)
return new A.nk(d2.$1(1),q)}return new A.nv(r)}if("!has"===d5){s=J.o(d6)
return new A.nG(s.gC(d6)?d1:s.gu(d6))}if("properties"===d5)return new A.nR()
if("id"===d5)return new A.o1()
if("accumulated"===d5)return new A.o5()
if("feature-state"===d5){s=J.o(d6)
r=s.gC(d6)?d1:s.gu(d6)
if(typeof r=="string")return new A.o6(r)
return new A.o7(d2.$1(0))}if("$transition"===d5){p=d2.$1(0)
o=d2.$1(1)
s=t.O
n=A.E(A.po(d6,2,s))
if(n==null)n=0
m=A.E(A.po(d6,3,s))
if(m==null)m=0
l=A.E(A.po(d6,4,s))
return new A.na(m,n,l==null?0:l,o,p)}if("$images"===d5)return new A.nb(d3.$0())
if("semiliteral"===d5){s=J.o(d6)
k=s.gC(d6)?d1:s.gu(d6)
if(!t.j.b(k))return A.aj(k)
s=A.b([],t.V)
for(j=J.F(k);j.n();)s.push(A.w(j.gp()))
return new A.nc(s)}if("let"===d5){i=A.C(t.N,t.u)
for(s=J.o(d6),h=0;g=h+2,g<d6.length;h=g){if(!(h>=0&&h<d6.length))return A.a(d6,h)
j=A.v(d6[h])
f=h+1
if(!(f>=0&&f<d6.length))return A.a(d6,f)
i.m(0,j,A.w(d6[f]))}B.a.j($.fB,i)
try{s=s.gC(d6)?A.aj(d1):A.w(s.gN(d6))
return s}finally{if(0>=$.fB.length)return A.a($.fB,-1)
$.fB.pop()}}if("var"===d5){for(s=A.M($.fB).i("bq<1>"),j=new A.bq($.fB,s),j=new A.a2(j,j.gk(0),s.i("a2<a1.E>")),f=J.o(d6),s=s.i("a1.E");j.n();){e=j.d
if(e==null)e=s.a(e)
d=e.h(0,f.gC(d6)?"":A.v(f.gu(d6)))
if(d!=null)return d}return A.aj(d1)}if("heatmap-density"===d5||"line-progress"===d5)return new A.nd()
if("image"===d5)return d2.$1(0)
if("is-supported-script"===d5)return A.aj(!0)
if("resolved-locale"===d5)return new A.ne(d2.$1(0))
if("within"===d5){s=J.o(d6)
c=A.rc(s.gC(d6)?d1:s.gu(d6))
if(c==null)return A.aj(!1)
s=[d5]
B.a.A(s,d6)
return A.t_("$geometry:"+B.h.ak(s,d1),new A.nf(c))}if("distance"===d5){s=J.o(d6)
c=A.rc(s.gC(d6)?d1:s.gu(d6))
if(c==null)return A.aj(d1)
s=[d5]
B.a.A(s,d6)
return A.t_("$geometry:"+B.h.ak(s,d1),new A.ng(c))}if("typeof"===d5)return new A.nh(d2.$1(0))
if("to-rgba"===d5)return new A.ni(d2.$1(0))
if("slice"===d5){b=d2.$1(0)
p=d2.$1(1)
return new A.nj(b,p,d6.length>2?d2.$1(2):d1)}if("index-of"===d5){a=d2.$1(0)
a0=d2.$1(1)
return new A.nl(a0,a,d6.length>2?d2.$1(2):d1)}if("sin"===d5)return d4.$1(A.z6())
if("cos"===d5)return d4.$1(A.z4())
if("tan"===d5)return d4.$1(A.z8())
if("asin"===d5)return d4.$1(A.z2())
if("acos"===d5)return d4.$1(A.z1())
if("atan"===d5)return d4.$1(A.z3())
if("zoom"===d5)return new A.nm()
if("geometry-type"===d5)return new A.nn()
if("!"===d5)return new A.no(d2.$1(0))
a1="=="===d5
a2=d1
a3=d1
a4=!1
a5=d1
a6=!1
a7=d1
a8=!1
s=!0
if(!a1){a9="!="===d5
b0=!a9
if(b0){a2="<"===d5
a4=!a2
if(a4){a3="<="===d5
a6=!a3
if(a6){a5=">"===d5
a8=!a5
if(a8){a7=">="===d5
s=a7}}}}}else{a9=d1
b0=!1}if(s&&d6.length>2)return new A.np(d2.$1(0),d2.$1(1),d2.$1(2),d5)
if("collator"===d5){s=J.o(d6)
if(s.gJ(d6)&&t.f.b(s.gu(d6))){s=s.gu(d6)
s.toString
t.f.a(s)
b1=s}else b1=B.w
return new A.nq(A.w(b1.h(0,"case-sensitive")),A.w(b1.h(0,"diacritic-sensitive")),A.w(b1.h(0,"locale")))}if(a1)return new A.nr(d2.$1(0),d2.$1(1))
if(a9)return new A.ns(d2.$1(0),d2.$1(1))
s=!0
if(!(b0?a2:"<"===d5))if(!(a4?a3:"<="===d5))if(!(a6?a5:">"===d5))s=a8?a7:">="===d5
if(s)return new A.nt(d5,d2.$1(0),d2.$1(1))
if("all"===d5)return new A.nu(d3.$0())
if("any"===d5)return new A.nw(d3.$0())
if("none"===d5)return new A.nx(d3.$0())
if("case"===d5)return new A.ny(d3.$0())
if("match"===d5){b=d2.$1(0)
b2=A.C(t.O,t.u)
for(s=t.j,h=1;j=h+1,j<d6.length;h+=2){if(!(j>=0&&j<d6.length))return A.a(d6,j)
b3=A.w(d6[j])
if(!(h>=0&&h<d6.length))return A.a(d6,h)
b4=d6[h]
j=J.F(s.b(b4)?b4:[b4])
while(j.n())b2.m(0,j.gp(),b3)}if(h<d6.length){if(!(h>=0&&h<d6.length))return A.a(d6,h)
b5=A.w(d6[h])}else b5=A.aj(d1)
return new A.nz(b2,b,b5)}if("coalesce"===d5)return new A.nA(d3.$0())
if("step"===d5){b=d2.$1(0)
b6=d2.$1(1)
b7=A.b([],t.n)
b8=A.b([],t.V)
for(h=2;s=h+1,s<d6.length;h+=2){if(!(h>=0&&h<d6.length))return A.a(d6,h)
j=d6[h]
if(!(typeof j=="number"))if(typeof j=="string")j=A.P(j)
else if(A.H(j))j=j?1:0
else j=d1
B.a.j(b7,j==null?0:j)
if(!(s>=0&&s<d6.length))return A.a(d6,s)
B.a.j(b8,A.w(d6[s]))}return new A.nB(b,b6,b7,b8)}if("interpolate"===d5||"interpolate-hcl"===d5||"interpolate-lab"===d5){s=J.o(d6)
if(s.gJ(d6)&&t.j.b(s.gu(d6))){s=s.gu(d6)
s.toString
t.j.a(s)
b9=s}else b9=B.ae
s=t.n
b7=A.b([],s)
b8=A.b([],t.V)
for(h=2;j=h+1,j<d6.length;h+=2){if(!(h>=0&&h<d6.length))return A.a(d6,h)
f=d6[h]
if(!(typeof f=="number"))if(typeof f=="string")f=A.P(f)
else if(A.H(f))f=f?1:0
else f=d1
B.a.j(b7,f==null?0:f)
if(!(j>=0&&j<d6.length))return A.a(d6,j)
B.a.j(b8,A.w(d6[j]))}j=d2.$1(1)
A:{if("interpolate-hcl"===d5){f="hcl"
break A}if("interpolate-lab"===d5){f="lab"
break A}f=d1
break A}e=J.Y(b9)
if(J.m(e.gu(b9),"exponential")&&e.gk(b9)>1){c0=A.E(e.h(b9,1))
if(c0==null)c0=1}else c0=1
c1=J.m(e.gu(b9),"geometric")
if(J.m(e.gu(b9),"cubic-bezier")&&e.gk(b9)>4){s=A.b([],s)
for(h=1;h<5;++h){c2=e.h(b9,h)
if(!(typeof c2=="number"))if(typeof c2=="string")c2=A.P(c2)
else if(A.H(c2))c2=c2?1:0
else c2=d1
s.push(c2==null?0:c2)}}else s=d1
return A.pQ(j,b7,b8,c0,s,c1,f)}if("to-string"===d5)return new A.nC(d2.$1(0))
if("number-format"===d5){c3=d2.$1(0)
if(d6.length>1){if(1<0||1>=d6.length)return A.a(d6,1)
s=t.f.b(d6[1])}else s=!1
if(s){if(1<0||1>=d6.length)return A.a(d6,1)
b1=t.f.a(d6[1])}else b1=B.w
return new A.nD(c3,A.w(b1.h(0,"min-fraction-digits")),A.w(b1.h(0,"max-fraction-digits")))}if("split"===d5)return new A.nE(d2.$1(0),d2.$1(1))
if("join"===d5)return new A.nF(d2.$1(0),d2.$1(1))
if("hsl"===d5||"hsla"===d5)return new A.nH(d3.$0())
if("to-number"===d5)return new A.nI(d3.$0())
if("number"===d5||"string"===d5||"boolean"===d5||"object"===d5)return new A.nJ(d3.$0(),d5)
if("to-boolean"===d5)return new A.nK(d2.$1(0))
if("to-color"===d5)return new A.nL(d3.$0())
if("array"===d5){s=J.o(d6)
if(d6.length>1&&typeof s.gu(d6)=="string"){j=s.gu(d6)
j.toString
A.W(j)
c4=j}else c4=d1
if(d6.length>2){if(1<0||1>=d6.length)return A.a(d6,1)
j=A.E(d6[1])
c5=j==null?d1:B.c.S(j)}else c5=d1
return new A.nM(s.gC(d6)?A.aj(d1):A.w(s.gN(d6)),c5,c4)}if("format"===d5){c6=A.b([],t.hc)
for(s=d6.length,j=t.j,f=t.f,e=t.N,c0=t.u,c7=0;c7<d6.length;d6.length===s||(0,A.h)(d6),++c7){c3=d6[c7]
if(f.b(c3)){c1=c6.length
if(c1===0)continue
if(0>=c1)return A.a(c6,-1)
c8=c6.pop()
c1=A.C(e,c0)
for(c2=c3.gai(),c2=c2.gt(c2);c2.n();){c9=c2.gp()
q=c9.a
k=c9.b
c1.m(0,A.v(q),A.w(k))}B.a.j(c6,new A.aS(c8.a,c1,c8.c))}else{c1=A.w(c3)
if(j.b(c3)){c2=J.o(c3)
c2=c2.gJ(c3)&&J.m(c2.gu(c3),"image")}else c2=!1
B.a.j(c6,new A.aS(c1,B.dd,c2))}}return new A.nN(c6)}if("concat"===d5){s=A.b([],t.V)
for(j=d6.length,f=t.f,c7=0;c7<d6.length;d6.length===j||(0,A.h)(d6),++c7){c3=d6[c7]
if(!f.b(c3))s.push(A.w(c3))}return new A.nO(s)}if("upcase"===d5)return new A.nP(d2.$1(0))
if("downcase"===d5)return new A.nQ(d2.$1(0))
if("+"===d5||"*"===d5||"min"===d5||"max"===d5)return new A.nS(d5,d3.$0())
if("-"===d5||"/"===d5||"%"===d5||"^"===d5){c3=d2.$1(0)
if(d6.length===1)return d4.$1(new A.nT())
return new A.nU(c3,d2.$1(1),d5)}if("round"===d5)return d4.$1(new A.nV())
if("floor"===d5)return d4.$1(new A.nW())
if("ceil"===d5)return d4.$1(new A.nX())
if("abs"===d5)return d4.$1(new A.nY())
if("sqrt"===d5)return d4.$1(A.z7())
if("ln"===d5)return d4.$1(A.z5())
if("log10"===d5)return d4.$1(new A.nZ())
if("log2"===d5)return d4.$1(new A.o_())
if("e"===d5)return A.aj(2.718281828459045)
if("pi"===d5)return A.aj(3.141592653589793)
if("ln2"===d5)return A.aj(0.6931471805599453)
if("length"===d5)return new A.o0(d2.$1(0))
if("in"===d5){a=d2.$1(0)
return new A.o2(d2.$1(1),a)}if("at"===d5){d0=d2.$1(0)
return new A.o3(d2.$1(1),d0)}if("rgb"===d5||"rgba"===d5)return new A.o4(d3.$0())
return A.aj(d1)},
xs(a,b,c){var s,r,q,p,o,n,m,l,k,j
if(!isFinite(a)){if(isNaN(a))s="NaN"
else s=a<0?"-\u221e":"\u221e"
return s}s=Math.abs(a)
r=B.c.q(s)
q=B.d.aF(r,".")
p=!B.d.v(r,"e")&&r.length-q-1<=c?r:B.c.iN(s,Math.min(c,20))
if(B.d.v(p,".")){s=B.d.aF(p,".")
o=new A.f(B.d.a9(p,0,s),B.d.aq(p,s+1))}else o=new A.f(p,"")
n=o.a
m=o.b
for(;;){s=m.length
if(!(s>b&&B.d.cz(m,"0")))break
m=B.d.a9(m,0,s-1)}m=B.d.iz(m,b,"0")
l=new A.be("")
for(s=n.length,k=0,j="";k<s;++k){if(k>0&&B.b.T(s-k,3)===0)j=l.a=j+","
j+=n[k]
l.a=j}p=m.length===0?l.q(0):l.q(0)+"."+m
return a<0&&B.d.v(p,A.hy("[1-9]"))?"-"+p:p},
xm(a){var s,r
if(a<=0)return 0
if(a>=1)return 1
s=a*a
r=s*a
return 4*(a<0.5?r:3*(a-s)+r-0.75)},
rZ(a,b,c){var s,r,q,p,o,n
if(typeof a=="number"&&typeof b=="number")return a+(b-a)*c
s=t.j
if(s.b(a)&&s.b(b)&&J.V(a)===J.V(b)){s=[]
for(r=J.o(a),q=J.o(b),p=0;p<r.gk(a);++p)s.push(A.rZ(r.h(a,p),q.h(b,p),c))
return s}o=A.aO(a)
n=A.aO(b)
if(o!=null&&n!=null)return A.rm(o,n,c)
return c<1?a:b},
t1(a){var s,r,q,p,o
if(t.j.b(a)){s=J.o(a)
s=(s.gk(a)===3||s.gk(a)===4)&&s.ad(a,new A.mr())}else s=!1
if(s){s=A.b([],t.n)
for(r=J.F(a);r.n();)s.push(A.ai(r.gp()))
if(A.aX(s,0,A.ct(3,"count",t.S),t.i).aw(0,new A.ms()))return null
r=s.length
q=r>3?s[3]:1
if(q<0||q>1)return null
if(0>=r)return A.a(s,0)
p=s[0]
if(1>=r)return A.a(s,1)
o=s[1]
if(2>=r)return A.a(s,2)
return new A.ad(p/255,o/255,s[2]/255,q)}return A.aO(a)},
pQ(a,b,c,d,e,f,g){if(b.length===0)return A.aj(null)
return new A.mL(a,b,c,e,d,f,g)},
xa(a,b){var s,r,q,p,o,n,m=new A.mn()
for(s=0,r=1,q=0;q<24;++q){p=(s+r)/2
o=a.length
if(0>=o)return A.a(a,0)
n=a[0]
if(2>=o)return A.a(a,2)
n=m.$3(p,n,a[2])
if(typeof n!=="number")return n.br()
if(n<b)s=p
else r=p}o=a.length
if(1>=o)return A.a(a,1)
n=a[1]
if(3>=o)return A.a(a,3)
return m.$3((s+r)/2,n,a[3])},
pT(a0){var s,r,q,p,o,n,m,l,k,j,i,h,g=a0.h(0,"property"),f=a0.h(0,"type"),e=a0.h(0,"default"),d=a0.h(0,"stops"),c=typeof g=="string",b=c?new A.mP(g):new A.mQ(),a=J.ao(f)
if(a.D(f,"identity")||!t.j.b(d)||J.de(d))return new A.mR(b,e)
if(c&&J.qt(d,new A.mS()))return A.xi(a0,d)
s=[]
r=[]
for(q=J.F(d),p=t.j,o=t.f;q.n();){n=q.gp()
if(p.b(n)){m=J.o(n)
m=m.gk(n)<2||o.b(m.gu(n))}else m=!0
if(m)return A.aj(e)
m=J.o(n)
s.push(m.h(n,0))
r.push(m.h(n,1))}if(a.D(f,"categorical")){c=t.O
l=A.pv(c,c)
A.vr(l,s,r)
return new A.mT(l,b,e)}k=B.a.ad(r,new A.mU())
q=A.b([],t.n)
for(p=s.length,j=0;j<s.length;s.length===p||(0,A.h)(s),++j){i=s[j]
if(typeof i=="number")o=i
else if(typeof i=="string")o=A.P(i)
else if(A.H(i))o=i?1:0
else o=null
q.push(o==null?0:o)}p=A.b([],t.V)
for(o=r.length,j=0;j<r.length;r.length===o||(0,A.h)(r),++j)p.push(A.aj(r[j]))
if(!a.D(f,"interval"))a=!k&&!a.D(f,"exponential")
else a=!0
if(a)return new A.mV(b,e,r,q)
a=A.E(a0.h(0,"base"))
if(a==null)a=1
h=A.pQ(b,q,p,a,null,!1,A.dY(a0.h(0,"colorSpace")))
if(!c)return h
return new A.mW(g,h,e)},
xi(a,b){var s,r,q,p,o,n,m,l,k,j,i="colorSpace",h=t.W,g=A.C(t.i,h)
for(h=J.cw(b,h),s=h.$ti,h=new A.a2(h,h.gk(0),s.i("a2<y.E>")),r=t.f,s=s.i("y.E");h.n();){q=h.d
if(q==null)q=s.a(q)
p=J.Y(q)
o=p.gu(q)
o.toString
r.a(o)
n=o.h(0,"zoom")
if(typeof n=="number")m=n
else{if(typeof n=="string")n=A.P(n)
else if(A.H(n))n=n?1:0
else n=null
m=n}if(m==null)m=0
n=g.h(0,m)
if(n==null){n=[]
g.m(0,m,n)}o=o.h(0,"value")
B.a.j(n,[o,p.gk(q)>1?p.h(q,1):null])}h=g.$ti.i("aq<1>")
l=A.X(new A.aq(g,h),h.i("i.E"))
B.a.aQ(l)
if(J.m(a.h(0,"type"),"interval")){h=A.b([],t.V)
for(s=l.length,r=t.O,k=0;k<l.length;l.length===s||(0,A.h)(l),++k){j=l[k]
q=A.pv(r,r)
q.A(0,a)
q.m(0,"stops",g.h(0,j))
h.push(A.pT(q))}return new A.mt(l,h)}h=A.b([],t.V)
for(s=l.length,r=t.O,k=0;k<l.length;l.length===s||(0,A.h)(l),++k){j=l[k]
h.push(A.pT(A.eB(["type",a.h(0,"type"),"property",a.h(0,"property"),"default",a.h(0,"default"),"colorSpace",a.h(0,i),"stops",g.h(0,j)],r,r)))}s=A.E(a.h(0,"base"))
if(s==null)s=1
return A.pQ(new A.mu(),l,h,s,null,!1,A.dY(a.h(0,i)))},
A:function A(a,b){var _=this
_.a=0
_.b=a
_.c=""
_.e=b
_.w=_.f=null},
mp:function mp(a,b){this.a=a
this.b=b},
mw:function mw(a){this.a=a},
oy:function oy(a,b){this.a=a
this.b=b},
oz:function oz(a){this.a=a},
oi:function oi(a){this.a=a},
ov:function ov(){},
ow:function ow(){},
ox:function ox(a){this.a=a},
ot:function ot(){},
ou:function ou(a){this.a=a},
mK:function mK(){},
mB:function mB(a){this.a=a},
mC:function mC(a){this.a=a},
mD:function mD(a){this.a=a},
mE:function mE(a){this.a=a},
mF:function mF(a,b,c){this.a=a
this.b=b
this.c=c},
mG:function mG(a,b,c){this.a=a
this.b=b
this.c=c},
mH:function mH(a,b,c){this.a=a
this.b=b
this.c=c},
mI:function mI(a,b,c){this.a=a
this.b=b
this.c=c},
mJ:function mJ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
d_:function d_(a,b,c){this.a=a
this.b=b
this.c=c},
om:function om(){},
n6:function n6(a){this.a=a},
n5:function n5(a){this.a=a},
o9:function o9(a){this.a=a},
oa:function oa(a,b){this.a=a
this.b=b},
n7:function n7(a,b){this.a=a
this.b=b},
n8:function n8(a){this.a=a},
n9:function n9(a){this.a=a},
nk:function nk(a,b){this.a=a
this.b=b},
nv:function nv(a){this.a=a},
nG:function nG(a){this.a=a},
nR:function nR(){},
o1:function o1(){},
o5:function o5(){},
o6:function o6(a){this.a=a},
o7:function o7(a){this.a=a},
na:function na(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
nb:function nb(a){this.a=a},
n4:function n4(){},
nc:function nc(a){this.a=a},
nd:function nd(){},
ne:function ne(a){this.a=a},
nf:function nf(a){this.a=a},
ng:function ng(a){this.a=a},
nh:function nh(a){this.a=a},
ni:function ni(a){this.a=a},
nj:function nj(a,b,c){this.a=a
this.b=b
this.c=c},
o8:function o8(a){this.a=a},
nl:function nl(a,b,c){this.a=a
this.b=b
this.c=c},
nm:function nm(){},
nn:function nn(){},
no:function no(a){this.a=a},
np:function np(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
nq:function nq(a,b,c){this.a=a
this.b=b
this.c=c},
nr:function nr(a,b){this.a=a
this.b=b},
ns:function ns(a,b){this.a=a
this.b=b},
nt:function nt(a,b,c){this.a=a
this.b=b
this.c=c},
nu:function nu(a){this.a=a},
nw:function nw(a){this.a=a},
nx:function nx(a){this.a=a},
ny:function ny(a){this.a=a},
nz:function nz(a,b,c){this.a=a
this.b=b
this.c=c},
nA:function nA(a){this.a=a},
nB:function nB(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
nC:function nC(a){this.a=a},
nD:function nD(a,b,c){this.a=a
this.b=b
this.c=c},
nE:function nE(a,b){this.a=a
this.b=b},
nF:function nF(a,b){this.a=a
this.b=b},
nH:function nH(a){this.a=a},
nI:function nI(a){this.a=a},
nJ:function nJ(a,b){this.a=a
this.b=b},
nK:function nK(a){this.a=a},
nL:function nL(a){this.a=a},
nM:function nM(a,b,c){this.a=a
this.b=b
this.c=c},
n3:function n3(a){this.a=a},
nN:function nN(a){this.a=a},
nO:function nO(a){this.a=a},
nP:function nP(a){this.a=a},
nQ:function nQ(a){this.a=a},
nS:function nS(a,b){this.a=a
this.b=b},
nT:function nT(){},
nU:function nU(a,b,c){this.a=a
this.b=b
this.c=c},
nV:function nV(){},
nW:function nW(){},
nX:function nX(){},
nY:function nY(){},
nZ:function nZ(){},
o_:function o_(){},
o0:function o0(a){this.a=a},
o2:function o2(a,b){this.a=a
this.b=b},
o3:function o3(a,b){this.a=a
this.b=b},
o4:function o4(a){this.a=a},
mr:function mr(){},
ms:function ms(){},
mL:function mL(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
mn:function mn(){},
mP:function mP(a){this.a=a},
mQ:function mQ(){},
mR:function mR(a,b){this.a=a
this.b=b},
mS:function mS(){},
mT:function mT(a,b,c){this.a=a
this.b=b
this.c=c},
mU:function mU(){},
mO:function mO(){},
mV:function mV(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
mW:function mW(a,b,c){this.a=a
this.b=b
this.c=c},
mt:function mt(a,b){this.a=a
this.b=b},
mu:function mu(){},
uU(a,b,c){var s,r,q,p,o,n=A.b([],t.n),m=A.b([],t.t),l=new A.hL(13,4096/c,n,m)
for(s=b.length,r=0;q=r+2,q<s;r+=3){if(!(r<s))return A.a(b,r)
p=b[r]
o=r+1
if(!(o<s))return A.a(b,o)
l.dW(0,a,p,b[o],b[q])}return new A.f(new Float32Array(A.R(n)),new Uint32Array(A.R(m)))},
ef:function ef(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
h2:function h2(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k
_.Q=l
_.as=m
_.at=n
_.ax=o},
jm:function jm(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jn:function jn(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
yX(a){var s,r,q,p,o,n,m,l,k
if(!(a instanceof A.bn))return new A.f(A.iL(J.bk(a==null?"":a)),null)
s=a.a
if(B.a.ad(s,new A.oO()))return new A.f(A.iL(a.q(0)),null)
for(r=0,q="";p=s.length,r<p;++r){o=s[r].b
if(r===0)o=B.d.iO(o)
if(r===s.length-1)o=B.d.iP(o)
q=q+A.Q(57344)+A.Q(57600+r)
if(!(r<s.length))return A.a(s,r)
q=s[r].a==null?q+o:q+A.Q(57599)}n=[]
for(m=0;m<s.length;s.length===p||(0,A.h)(s),++m){l=s[m]
k=l.e
k=k==null?null:(B.c.Y(B.c.E(k.d,0,1)*255)<<24|B.c.Y(B.c.E(k.a,0,1)*255)<<16|B.c.Y(B.c.E(k.b,0,1)*255)<<8|B.c.Y(B.c.E(k.c,0,1)*255))>>>0
n.push([l.c,l.d,k,l.f,l.a])}return new A.f(q.charCodeAt(0)==0?q:q,n)},
oV(a){var s,r,q,p
if(!B.d.v(a,A.Q(57344)))return a
s=new A.be("")
r=A.X(new A.an(a),t.J.i("i.E"))
for(q=0;q<r.length;++q){p=r[q]
if(p===57344){++q
continue}if(p===57599)continue
p=A.Q(p)
s.a+=p}p=s.a
return p.charCodeAt(0)==0?p:p},
iL(a){var s,r,q,p
if(!B.d.v(a,"\n"))return B.d.bo(a)
s=A.b([],t.s)
for(r=a.split("\n"),q=r.length,p=0;p<q;++p)s.push(B.d.bo(r[p]))
return B.a.ad(s,new A.pf())?"":B.a.ac(s,"\n")},
bB:function bB(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
bn:function bn(a){this.a=a},
jt:function jt(){},
oO:function oO(){},
pf:function pf(){},
qO(a,b,c,d,e,f){var s,r=A.b([],t.ha),q=A.b([],t.r),p=c!=null,o=b==null,n=Math.min(128,(o?128:b)*4096/512)
o=o?128:b
s=d==null?null:A.os(d)
o=new A.bC(f,e,s,new A.A(B.e,B.e),r,p,q,n,o*4096/512)
o.dj(a)
if(p)o.x=A.vM(q,c)
return o},
v_(a){var s,r,q,p,o,n,m=a.length,l=m-2
if(!(l>=0))return A.a(a,l)
s=a[l]
l=m-1
if(!(l>=0))return A.a(a,l)
r=a[l]
for(q=0,p=0;p<m;p+=2,r=o,s=n){l=p+1
if(!(l<m))return A.a(a,l)
o=a[l]
n=a[p]
q+=s*o-n*r}return q},
h3(a){var s,r,q,p,o,n,m,l,k,j,i=J.o(a),h=i.gk(a)*2,g=new Float64Array(h)
for(i=i.gt(a),s=t.j,r=0;i.n();){q=i.gp()
if(!s.b(q)||J.V(q)<2)continue
p=J.o(q)
o=p.gk(q)>=2
if(o){n=p.h(q,0)
m=p.h(q,1)}else{n=null
m=null}if(!o)throw A.e(A.cl("Pattern matching error"))
if(typeof n!="number"||typeof m!="number")continue
l=r+1
if(!(r<h))return A.a(g,r)
g[r]=(n+180)/360
r=l+1
k=Math.sin(m*3.141592653589793/180)
j=0.5-0.25*Math.log((1+k)/(1-k))/3.141592653589793
if(isNaN(j))p=k>0?0:1
else p=B.c.E(j,0,1)
if(!(l<h))return A.a(g,l)
g[l]=p}return r===h?g:A.bA(g,0,r)},
bC:function bC(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=0
_.d=c
_.e=d
_.f=e
_.r=f
_.w=g
_.x=null
_.y=h
_.z=i},
jy:function jy(a,b,c){this.a=a
this.b=b
this.c=c},
jx:function jx(a){this.a=a},
jz:function jz(a,b){this.a=a
this.b=b},
ib:function ib(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
ip:function ip(a){this.a=a},
dS:function dS(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ty(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=new A.oN(a),e=A.b([],t.t)
for(s=!1,r=0;q=a.length,r<q;++r){if(!(r>=0))return A.a(a,r)
p=a[r]
o=B.T.h(0,p)
if(o==null)o=0
n=!1
if(o===1){B.a.j(e,p)
continue}m=f.$1(r)
if(p===1604&&m!=null){if(m>>>0!==m||m>=a.length)return A.a(a,m)
l=B.d8.h(0,a[m])}else l=null
if(l!=null){k=l[s?1:0]
q=k===0
B.a.j(e,q?p:k)
j=r+1
m.toString
for(;j<m;++j){if(!(j<a.length))return A.a(a,j)
B.a.j(e,a[j])}if(q){if(!(m>=0&&m<a.length))return A.a(a,m)
q=a[m]}else q=-1
B.a.j(e,q)
r=m
s=n
continue}if(s)i=o===2||o===3||o===5
else i=!1
if(o===2||o===4||o===5)if(m!=null){if(m>>>0!==m||m>=a.length)return A.a(a,m)
q=B.T.h(0,a[m])
if(q==null)q=0
q=q===2||q===3||q===5
h=q}else h=n
else h=n
g=B.d9.h(0,p)
if(g==null)k=0
else{if(i)q=h?3:1
else q=h?2:0
k=g[q]}B.a.j(e,k===0?p:k)
s=h}return e},
oN:function oN(a){this.a=a},
zq(a){var s,r,q,p
for(s=new A.dq(a),r=t.gS,s=new A.a2(s,s.gk(0),r.i("a2<y.E>")),r=r.i("y.E");s.n();){q=s.d
if(q==null)q=r.a(q)
if(!(q>=1424&&q<=2303))p=q>=64285&&q<=65276
else p=!0
if(p)return!0
if(q>=65&&q<=591)return!1}return!1},
v0(a,b){var s,r,q,p,o,n=t.S,m=A.b([],t.oJ)
for(s=a.$ti,r=new A.a2(a,a.gk(0),s.i("a2<y.E>")),s=s.i("y.E");r.n();){q=r.d
m.push(new A.ch(A.vZ(q==null?s.a(q):q,0),null))}s=A.b([],t.s)
for(r=a.a,q=J.o(r),p=b!=null,o=0;o<q.gk(r);++o)s.push(A.qP(p&&o<J.V(b.a)?b.$ti.y[1].a(J.al(b.a,o)):""))
return new A.jC(m,s,A.C(t.N,t.L),A.C(n,t.kJ),A.C(n,t.gp))},
qP(a){var s,r,q,p,o=A.b([],t.s)
for(s=B.d.cX(a.toLowerCase(),A.hy("[\\s_-]+")),r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q]
if(p.length!==0&&!B.eW.v(0,p))o.push(p)}return B.a.bP(o)},
v1(a){return B.b.E(B.c.Y(a/100)*100,100,900)},
pZ(c5,c6,c7,c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1=1751474532,c2=t.n,c3=A.b([],c2),c4=J.o(c6)
if(c4.gC(c6))return new A.f(c3,0)
for(s=A.up(c6).d,r=s.length,q=c8!==0,p=c5.c,o=J.Y(c9),n=c5.r,m=c7/100,l=t.S,k=t.gc,j=t.R,i=t.q,h=0,g=0;g<s.length;s.length===r||(0,A.h)(s),++g){f=s[g]
e=c4.I(c6,f.a,f.b)
d=(f.c&1)===1
c=A.vY(e)
b=J.F(d?new A.bq(c,A.M(c).i("bq<1>")):c)
a=!d
a0=J.Y(e)
while(b.n()){a1=b.gp()
a2=a0.I(e,a1.a,a1.b)
a4=o.gt(c9)
a1=a1.c
a5=0
for(;;){if(!a4.n()){a3=null
break}a5=a4.gp()
a6=a5*1000+B.b.E(B.c.Y(m)*100,100,900)
a7=n.h(0,a6)
if(a7==null){a7=new A.hD(c5.i6(a5,c7),A.C(l,k),new A.jA(A.b([],j),A.b([],i),B.y))
n.m(0,a6,a7)
a6=a7}else a6=a7
a8=a6.eD(a2,d?B.l:B.y,a1)
a6=a8.a
a7=a6.length
b0=0
for(;;){if(!(b0<a7)){a9=!0
break}b1=a6[b0]
if(b1.a===0){b2=b1.b
b3=!0
if(b2!==8203)if(b2!==8204)if(b2!==8205)if(b2!==8206)if(b2!==8207)if(b2!==1564)if(b2!==65279)if(b2!==173)if(!(b2>=8234&&b2<=8238))if(!(b2>=8294&&b2<=8297))b2=b2>=65024&&b2<=65039
else b2=b3
else b2=b3
else b2=b3
else b2=b3
else b2=b3
else b2=b3
else b2=b3
else b2=b3
else b2=b3
else b2=b3
b2=!b2}else b2=!1
if(b2){a9=!1
break}++b0}if(a9){a3=a8
break}}if(a3==null)return null
if(!(a5>=0&&a5<p.length))return A.a(p,a5)
a1=p[a5]
a4=a1.c
if(a4==null){a4=a1.a
b4=a4.c.h(0,c1)
b5=b4==null?null:new A.r(a4.a.a,b4.c)
if(b5==null)A.t(A.k("font has no "+A.aJ(A.cX(c1))+" table"))
a1=a1.c=A.vc(b5)}else a1=a4
b6=a1.f
for(a1=a3.a,a4=a3.b,b7=0;b7<a1.length;++b7){b8=a1[b7]
if(!(b7<a4.length))return A.a(a4,b7)
b9=a4[b7]
c0=b9.a/b6
a6=b8.a
if(a6!==0)B.a.A(c3,A.b([a5,a6,h+b9.c/b6,-b9.d/b6,c0],c2))
h+=c0
if(a&&q&&c0>0)h+=c8}}}return new A.f(c3,h)},
xb(a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=t.fC,c=A.b([],d),b=t.t,a=A.b([],b)
for(s=a1.length,r=0;r<a1.length;a1.length===s||(0,A.h)(a1),++r){q=a1[r]
if(q===32||q===160||q===12288){if(a.length!==0)B.a.j(c,a)
a=A.b([],b)}else B.a.j(a,q)}if(a.length!==0)B.a.j(c,a)
if(c.length<2)return A.b([a1],d)
s=A.pZ(a0,B.bc,a2,a3,a5)
p=s==null?null:s.b
if(p==null)p=0.25
s=A.b([],t.n)
for(o=c.length,r=0;r<c.length;c.length===o||(0,A.h)(c),++r){n=c[r]
m=A.pZ(a0,n,a2,a3,a5)
m=m==null?null:m.b
s.push(m==null?n.length*0.5:m)}l=B.a.bM(s,0,new A.mo(),t.i)+p*(c.length-1)
if(l<=a4)return A.b([a1],d)
k=B.c.bL(l/a4)
j=l/k
i=A.b([],d)
h=A.b([],b)
for(d=k-1,g=0,f=0;f<c.length;++f){o=h.length===0
m=o?0:p
if(!(f<s.length))return A.a(s,f)
e=s[f]
if(!o){o=g+(m+e)
o=o>j&&o-j>j-g&&i.length<d}else o=!1
if(o){B.a.j(i,h)
h=A.b([],b)
g=0}if(h.length!==0)B.a.j(h,32)
if(!(f<c.length))return A.a(c,f)
B.a.A(h,c[f])
o=h.length
if(!(f<c.length))return A.a(c,f)
o=o===c[f].length?0:p
if(!(f<s.length))return A.a(s,f)
g+=o+s[f]}if(h.length!==0)B.a.j(i,h)
return i},
tz(a,b,c,d,e,f,g,h,i){var s,r,q,p,o={},n=a.iy(h),m=A.b([],t.fC)
o.a=A.b([],t.t)
s=new A.oP(o,g,f,m,a,i,d,n)
for(r=new A.cW(b);r.n();){q=r.d
if(q===10||q===13||q===8232||q===8233){if(g)B.a.j(o.a,32)
else s.$0()
continue}p=o.a
B.a.j(p,q===9?32:q)}s.$0()
return A.xO(a,m,i,d,e,c,n,null)},
xO(a3,a4,a5,a6,a7,a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=A.b([],t.k_)
for(s=a4.length,r=0;r<a4.length;a4.length===s||(0,A.h)(a4),++r){q=A.pZ(a3,a4[r],a5,a6,a9)
if(q==null)return null
B.a.j(a2,q)}p=B.a.bM(a2,0,new A.mN(),t.i)
s=A.D(J.iO(a9))
o=a3.c
if(!(s>=0&&s<o.length))return A.a(o,s)
n=o[s]
m=n.a.bk(1751672161)
l=n.gi9().f
s=m.b+4
m.l(s,2)
o=m.a
s=o.getInt16(s,!1)
k=m.b+6
m.l(k,2)
k=o.getInt16(k,!1)
j=b0==null?(s/l- -k/l)/2:b0
s=t.n
i=A.b([],s)
for(o=A.qV(a2,0,t.hT),k=J.F(o.a),h=o.b,o=new A.bE(k,h,A.u(o).i("bE<1>")),g=a8>0,f=a8<0;o.n();){e=o.c
e=e>=0?new A.f(h+e,k.gp()):A.t(A.aI())
d=e.b
c=d.a
b=d.b
A:{if(f){a=0
break A}if(g){a=p-b
break A}a=(p-b)/2
break A}a0=(e.a+0.5)*a7+j
for(e=J.o(c),a1=0;a1<e.gk(c);a1+=5)B.a.A(i,A.b([e.h(c,a1),e.h(c,a1+1),e.h(c,a1+2)+a,e.h(c,a1+3)+a0,e.h(c,a1+4)],s))}s=new Float32Array(A.R(i))
o=a2.length
return new A.ky(s,p,o*a7,o)},
jC:function jC(a,b,c,d,e){var _=this
_.c=a
_.d=b
_.e=c
_.f=d
_.r=e},
jE:function jE(a,b){this.a=a
this.b=b},
jD:function jD(a,b,c){this.a=a
this.b=b
this.c=c},
ky:function ky(a,b,c,d){var _=this
_.d=a
_.e=b
_.f=c
_.r=d},
mo:function mo(){},
oP:function oP(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
mN:function mN(){},
v3(a){var s,r,q,p,o,n=A.b([],t.ez),m=a.length,l=new A.fh(a,0,m)
while(l.b<m){s=l.B()
r=s&7
if(s>>>3===1&&r===2){q=l.ek()
for(p=q.c;q.b<p;){s=q.B()
o=s&7
if(s>>>3===3&&o===2)B.a.j(n,A.v2(q.ek()))
else q.U(0,o)}}else l.U(0,r)}return n},
v2(a){var s,r,q,p,o,n,m
new Uint8Array(0)
for(s=a.c,r=a.a,q=0,p=0;a.b<s;){o=a.B()
switch(o>>>3){case 1:q=a.B()
break
case 2:n=a.ag(0)
m=a.b
A.bQ(r,m,m+n)
a.b+=n
break
case 3:a.B()
break
case 4:a.B()
break
case 5:a.B()
break
case 6:a.B()
break
case 7:p=a.B()
break
default:a.U(0,o&7)}}return new A.bH(q,p)},
bH:function bH(a,b){this.a=a
this.r=b},
fh:function fh(a,b,c){this.a=a
this.b=b
this.c=c},
jF:function jF(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=null},
jG:function jG(a,b){this.a=a
this.b=b},
h4(a,b){var s=new A.jJ(),r=s.$1(a)
s=s.$1(b)
if(typeof s!=="number")return s.aO()
if(typeof r!=="number")return r.bT()
return r+s*4096},
va(a){var s,r,q,p,o,n,m,l
A:{s=a instanceof A.bm
r=null
q=!1
if(s){p=a.cx==null
if(p){r=!a.dx
q=r}o=p}else{p=null
o=!1}if(q){q=0
break A}if(s)q=o?r:!a.dx
else q=!1
if(q){q=2
break A}if(a instanceof A.dn){q=3
break A}if(a instanceof A.cI){q=6
break A}q=a instanceof A.dF
n=null
m=!1
l=!1
if(q)if(s?p:a.cy==null){n=a.id==null
l=n
m=!0}if(l){q=1
break A}if(q)l=m?n:a.id==null
else l=!1
if(l){q=4
break A}if(q){q=5
break A}q=-1
break A}return q},
qS(a,b){var s,r
if(a==null)s=null
else{if(!(b<a.length))return A.a(a,b)
s=a[b]}A:{if(0===s){r=0
break A}if(1===s){r=127
break A}if(3===s){r=1
break A}if(4===s){r=2
break A}if(5===s){r=125
break A}if(6===s){r=126
break A}r=64
break A}return r},
qT(f7,f8,f9,g0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5=null,f6=new A.A(B.e,B.e)
f6.a=g0
s=A.C(t.S,t.ke)
for(r=f8.length,q=t.hD,p=0;p<f8.length;f8.length===r||(0,A.h)(f8),++p){o=f8[p]
n=o.a
m=s.h(0,n)
if(m==null){m=A.b([],q)
s.m(0,n,m)
n=m}else n=m
B.a.j(n,o)}l=new A.aV(new Float64Array(16384))
k=new A.jO(new Uint32Array(16384))
j=A.b([],t.cm)
r=t.t
i=A.b([],r)
q=f7.ch
n=q.length+1
h=new Int32Array(n)
g=A.b([],t.iv)
for(m=t.dn,f=t.if,e=t.n,d=0,c=0,b=0;a=q.length,b<a;++b){a=k.b
if(!(b<n))return A.a(h,b)
h[b]=a
a0=q[b]
a1=A.va(a0)
if(a1<0)continue
a=s.h(0,a0.b)
if(a==null)a=B.ab
a2=a.length
a3=a1!==0
a4=a1*16384
a5=a1!==1
a6=a1===5
a7=a1!==3
a8=a1===6
a9=a1!==4
b0=a1===2
b1=a0 instanceof A.dn
p=0
for(;p<a.length;a.length===a2||(0,A.h)(a),++p){o=a[p]
b2=o.b
b3=!a7||a8
if(!b3&&b2.d.length===0)continue
if(b3&&b2.b.length===0)continue
b4=j.length
if(b4-c>=80){B.a.A(i,A.b([d,k.b-d,c],r))
d=k.b
c=j.length
b4=c}b5=b4-c
b4=o.c
B.a.j(j,new A.f(b,b4))
b6=B.b.F(l.b,6)
b7=b2.b
b8=!a5||!a9||a6
b9=b8?b2.c:f5
c0=b8?b2.f:f5
c1=b8?b2.e:f5
c2=!1
if(a6)if(c0==null){m.a(a0)
c3=a0.dy!=null||a0.fx.length!==0
c2=c3}c4=b8?b2.r:f5
c3=b7.length
c5=c3/2|0
if(b3){if(b1){c6=a0.db?0:1
c7=c6+(a0.dx?0:2)
f6.sae(b4==null?B.e:b4)
b4=a0.dy
b4=b4==null?f5:b4.$1(f6)
if(!(typeof b4=="number"))if(typeof b4=="string")b4=A.P(b4)
else if(A.H(b4))b4=b4?1:0
else b4=f5
if(b4==null)b4=0
c8=Math.max(0,b4)}else{c7=0
c8=0}for(b4=b5+a4,c9=0;c9<c5;++c9){d0=B.b.F(l.b,6)
for(c6=c9*2,d1=c6+1,d2=0;d2<4;++d2){d3=B.bd[d2]
if(!(c6<c3))return A.a(b7,c6)
d4=b7[c6]
if(!(d1<c3))return A.a(b7,d1)
l.av(d4,b7[d1],A.h4(d3.a,d3.b),c8)
l.aJ(b4,c7)}for(d2=0;d2<6;++d2)k.j(0,d0+B.d3[d2])}continue}d5=!a5||!a9||a6?0:f9
if(d5>0){d6=A.b([],e)
b4=A.b([],r)
d7=new A.hL(8,4096/d5,d6,b4)
c6=c5*8
d8=new Float32Array(c6)
for(d1=c1==null,d3=!d1,d4=c0==null,d9=!d4,e0=b9==null,e1=!e0,c9=0;c9<c5;++c9){e2=c9*8
e3=c9*2
if(!(e3<c3))return A.a(b7,e3)
e4=b7[e3]
if(!(e2<c6))return A.a(d8,e2)
d8[e2]=e4
e4=e2+1
e5=e3+1
if(!(e5<c3))return A.a(b7,e5)
e6=b7[e5]
if(!(e4<c6))return A.a(d8,e4)
d8[e4]=e6
if(e1){e4=e2+2
e6=b9.length
if(!(e3<e6))return A.a(b9,e3)
e7=b9[e3]
if(!(e4<c6))return A.a(d8,e4)
d8[e4]=e7
e7=e2+3
if(!(e5<e6))return A.a(b9,e5)
e6=b9[e5]
if(!(e7<c6))return A.a(d8,e7)
d8[e7]=e6}if(d9){e4=e2+4
e6=c0.length
if(!(e3<e6))return A.a(c0,e3)
e7=c0[e3]
if(!(e4<c6))return A.a(d8,e4)
d8[e4]=e7
e7=e2+5
if(!(e5<e6))return A.a(c0,e5)
e5=c0[e5]
if(!(e7<c6))return A.a(d8,e7)
d8[e7]=e5}if(d3){e4=e2+6
e5=e3+(c2?1:0)
e6=c1.length
if(!(e5<e6))return A.a(c1,e5)
e5=c1[e5]
if(!(e4<c6))return A.a(d8,e4)
d8[e4]=e5
if(c2){e4=e2+4
if(!(e3<e6))return A.a(c1,e3)
e3=c1[e3]
if(!(e4<c6))return A.a(d8,e4)
d8[e4]=e3}}e2+=7
e3=A.qS(c4,c9)
if(!(e2<c6))return A.a(d8,e2)
d8[e2]=e3}e8=b2.d
for(c3=e8.length,e9=0;c6=e9+2,c6<c3;e9+=3){if(!(e9<c3))return A.a(e8,e9)
d3=e8[e9]
d9=e9+1
if(!(d9<c3))return A.a(e8,d9)
d7.dW(0,d8,d3,e8[d9],e8[c6])}for(c3=b5+a4,c9=0;c6=d6.length,c9<(c6/8|0);++c9){f0=c9*8
if(!(f0<c6))return A.a(d6,f0)
d3=d6[f0]
d9=f0+1
if(!(d9<c6))return A.a(d6,d9)
d9=d6[d9]
if(e0)c6=0
else{e1=f0+2
if(!(e1<c6))return A.a(d6,e1)
e1=d6[e1]
e2=f0+3
if(!(e2<c6))return A.a(d6,e2)
e2=A.h4(e1,d6[e2])
c6=e2}if(c2){e1=f0+4
if(!(e1<d6.length))return A.a(d6,e1)
e1=d6[e1]}else if(d4)e1=0
else{e1=f0+4
e2=d6.length
if(!(e1<e2))return A.a(d6,e1)
e1=d6[e1]
e3=f0+5
if(!(e3<e2))return A.a(d6,e3)
e3=A.h4(e1,d6[e3])
e1=e3}l.av(d3,d9,c6,e1)
e1=f0+7
if(!(e1<d6.length))return A.a(d6,e1)
e1=B.b.E(B.c.Y(d6[e1]),0,127)
if(d1)c6=0
else{c6=f0+6
if(!(c6<d6.length))return A.a(d6,c6)
c6=d6[c6]}l.aJ(c3+e1*131072,c6)}for(c3=b4.length,d2=0;d2<b4.length;b4.length===c3||(0,A.h)(b4),++d2)k.j(0,b6+b4[d2])
continue}for(b4=c1==null,c6=b5+a4,d1=c0==null,d3=b9==null,c9=0;c9<c5;++c9){d4=c9*2
if(!(d4<c3))return A.a(b7,d4)
d9=b7[d4]
e0=d4+1
if(!(e0<c3))return A.a(b7,e0)
e1=b7[e0]
if(d3)e2=0
else{e2=b9.length
if(!(d4<e2))return A.a(b9,d4)
e3=b9[d4]
if(!(e0<e2))return A.a(b9,e0)
e3=A.h4(e3,b9[e0])
e2=e3}if(c2){if(!(d4<c1.length))return A.a(c1,d4)
e0=c1[d4]}else if(d1)e0=0
else{e3=c0.length
if(!(d4<e3))return A.a(c0,d4)
e4=c0[d4]
if(!(e0<e3))return A.a(c0,e0)
e0=A.h4(e4,c0[e0])}l.av(d9,e1,e2,e0)
e0=A.qS(c4,c9)
if(b4)d4=0
else{d4+=c2?1:0
if(!(d4<c1.length))return A.a(c1,d4)
d4=c1[d4]}l.aJ(c6+e0*131072,d4)}for(b4=b2.d,c3=b4.length,d2=0;d2<c3;++d2)k.j(0,b6+b4[d2])
f1=b2.a
if((!a3||b0)&&f1!=null&&f.a(a0).db!=null){f2=i.length/3|0
if(g.length!==0&&B.a.gN(g).a===b&&B.a.gN(g).b===f2)f3=B.a.gN(g).c
else{B.a.j(g,new A.aS(b,f2,A.b([],r)))
f3=B.a.gN(g).c}for(b4=f1.length,d2=0;d2<b4;++d2)B.a.j(f3,b6+f1[d2])}}}q=k.b
if(q===0)return f5
if(!(a<n))return A.a(h,a)
h[a]=q
B.a.A(i,A.b([d,q-d,c],r))
f4=A.b([],r)
for(q=g.length,p=0;p<g.length;g.length===q||(0,A.h)(g),++p){n=g[p]
f3=n.c
m=J.o(f3)
if(m.gC(f3))continue
B.a.A(f4,A.b([n.a,n.b,k.b,m.gk(f3)],r))
for(n=m.gt(f3);n.n();)k.j(0,n.gp())}r=new Float32Array(A.R(A.bA(l.a,0,l.b)))
q=B.i.I(k.a,0,k.b)
n=new Int32Array(A.R(i))
m=new Int32Array(A.R(f4))
return new A.jI(m,h,r,q,j,n)},
jI:function jI(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
jJ:function jJ(){},
yz(a){var s,r,q,p,o,n,m,l,k=A.b([],t.e),j=new A.lD(a)
try{for(o=a.length;j.b<o;){s=j.B()
n=j.b
m=s
if(typeof m!=="number")return A.ah(m)
r=n+m
n=r
if(typeof n!=="number")return n.eC()
if(n>o)throw A.e(B.b3)
q=j.B()
if(J.m(q,1)||J.m(q,2)){p=A.y2(j)
if(p!=null)J.iN(k,p)}j.siC(r)}}catch(l){if(t.f7.b(A.b2(l)))throw A.e(B.aX)
else throw l}return k},
rD(a,b){var s,r,q,p,o=a.B()
if(o>=10)s=a.aR()
else if(b)throw A.e(A.es("MLT field type "+o,null,null))
else s=o<4?"id":"geometry"
r=A.b([],t.c8)
if(o===30||o===31)for(q=a.B(),p=0;p<q;++p)B.a.j(r,A.rD(a,!0))
return new A.i5(o,s,r)},
at(a){var s,r,q,p,o=new A.m2(),n=a.a,m=a.b,l=a.b=m+1,k=n.length
if(!(m<k))return A.a(n,m)
s=n[m]
o.a=s>>>4
o.b=s&15
a.b=l+1
if(!(l<k))return A.a(n,l)
r=n[l]
l=o.c=r>>>5
n=r>>>2&7
o.d=n
m=r&3
o.e=m
q=o.f=a.B()
p=a.B()
o.r=p
o.w=q
if(l===4){o.y=a.B()
o.z=a.B()
n=q}else if((l===3||n===3)&&m!==0){o.x=a.B()
n=a.B()
o.w=n}else n=q
if(q>16777216||n>16777216||p>k-a.b)A.t(B.aQ)
return o},
y2(a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=null,a1=a4.aR(),a2=a4.B(),a3=A.b([],t.c8)
for(s=a4.B(),r=0;r<s;++r)a3.push(A.rD(a4,!1))
q=A.b([],t.s)
p=A.b([],t.D)
for(o=a3.length,n=t.aV,m=a0,l=m,k=0,j=0;j<a3.length;a3.length===o||(0,A.h)(a3),++j){i=a3[j]
h=i.a
if(h<4){g=(h&1)===1?A.fx(a4,A.at(a4)):a0
f=A.at(a4)
k=g==null?a0:g.length
if(k==null){e=f.w
e===$&&A.j()
k=e}l=J.cw(A.og(A.iE((h&2)!==0?A.iG(a4,f,!1):A.aG(a4,f,!1),k,g),g),n)}else if(h===4){m=A.wA(a4,a4.B(),k)
if(k===0)k=m.a.length}else{e=h>=10
if(e&&h<30){d=B.b.K(h-10,1)
c=d===9?a4.B():1
if(c===0)continue
b=e&&h<30
g=(b?(h&1)===1:h===31)?A.fx(a4,A.at(a4)):a0
B.a.j(q,i.b)
e=e&&h<30
B.a.j(p,A.y8(a4,d,(e?(h&1)===1:h===31)?c-1:c,g,k))}else if(h===30){if(a4.B()===0)continue
for(h=A.ya(a4,i),e=h.length,a=0;a<h.length;h.length===e||(0,A.h)(h),++a){d=h[a]
B.a.j(q,d.a)
B.a.j(p,d.b)}}else if(h===31){c=a4.B()
if(c===0)continue
for(h=A.xW(a4,i,c),e=h.length,a=0;a<h.length;h.length===e||(0,A.h)(h),++a){d=h[a]
B.a.j(q,d.a)
B.a.j(p,d.b)}}else break}}if(m==null)return a0
a3=new A.it(a1,a2,l,q,p,m)
a3.eK(a1,a2,l,q,p,m)
return a3},
y8(a,b,c,d,e){var s,r,q,p,o,n,m,l,k
if(b===9)return A.tj(a,c,d)
s=A.at(a)
r=a.b
A:{if(0===b){q=[]
for(p=A.fx(a,s),o=p.length,n=0;n<o;++n)q.push(p[n]===1)
m=q
break A}if(1===b||3===b){m=A.iE(A.aG(a,s,!0),e,d)
break A}if(2===b||4===b){m=A.iE(A.aG(a,s,!1),e,d)
break A}if(5===b){m=A.iE(A.iG(a,s,!0),e,d)
break A}if(6===b){m=A.iE(A.iG(a,s,!1),e,d)
break A}if(7===b){q=s.r
q===$&&A.j()
l=A.cy(a.a,r,r+q)
q=[]
k=0
for(;;){p=s.f
p===$&&A.j()
if(!(k<p))break
q.push(l.getFloat32(k*4,!0));++k}m=q
break A}if(8===b){q=s.r
q===$&&A.j()
l=A.cy(a.a,r,r+q)
q=[]
k=0
for(;;){p=s.f
p===$&&A.j()
if(!(k<p))break
q.push(l.getFloat64(k*8,!0));++k}m=q
break A}throw A.e(A.es("MLT scalar type "+b,null,null))}q=s.r
q===$&&A.j()
a.b=r+q
return A.og(m,d)},
iE(a,b,c){var s=c==null?b:B.j.bM(c,0,new A.mv(),t.S),r=a.length
if(r!==1||s<=1)return a
if(0>=r)return A.a(a,0)
return A.N(s,a[0],!1,t.S)},
og(a,b){var s,r,q,p,o
if(b==null)return a
s=[]
for(r=b.length,q=0,p=0;p<r;++p)if(b[p]===1&&q<a.length){o=q+1
if(!(q<a.length))return A.a(a,q)
s.push(a[q])
q=o}else s.push(null)
return s},
tj(a,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=null
for(s=a.a,r=a1,q=b,p=q,o=p,n=o,m=n,l=m,k=l,j=0;j<a0;++j){i=A.at(a)
h=i.a
h===$&&A.j()
switch(h){case 0:g=A.fx(a,i)
if(r==null)r=g
break
case 2:k=A.aG(a,i,!1)
break
case 3:f=A.td(A.aG(a,i,!1))
h=i.b
h===$&&A.j()
switch(h){case 6:l=f
break
case 5:m=f
break
default:n=f}break
case 1:h=a.b
e=i.r
e===$&&A.j()
d=A.bQ(s,h,h+e)
a.b+=e
A:{h=i.b
h===$&&A.j()
if(5===h){p=d
break A}if(1===h||2===h){o=d
break A}if(0===h)q=d}break
default:h=a.b
e=i.r
e===$&&A.j()
a.b=h+e}}if(p!=null&&o!=null){m.toString
o=A.t5(p,m,o)}if(o!=null){l.toString
s=A.q0(o,l)
k.toString
return A.pW(s,k,r)}if(q==null||n==null)return B.D
c=A.q0(q,n)
if(k!=null)return A.pW(c,k,r)
return A.og(c,r)},
pW(a,b,c){var s,r,q,p,o=[]
for(s=b.length,r=0;r<s;++r){q=b[r]
p=a.length
if(q<p){if(!(q>=0))return A.a(a,q)
p=a[q]}else p=null
o.push(p)}return A.og(o,c)},
q0(a,b){var s,r,q,p,o,n,m=A.b([],t.s)
for(s=b.length,r=t.L,q=a.length,p=0;o=p+1,o<s;p=o){if(!(p<s))return A.a(b,p)
n=r.a(A.bQ(a,Math.min(b[p],q),Math.min(b[o],q)))
m.push(new A.fs(!0).c2(n,0,null,!0))}return m},
td(a){var s,r,q,p,o=a.length,n=o+1,m=new Uint32Array(n)
for(s=0;s<o;s=r){r=s+1
q=m[s]
p=a[s]
if(!(r<n))return A.a(m,r)
m[r]=q+p}return m},
ya(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=null
for(s=a.a,r=b,q=r,p=q,o=p;q==null;){n=A.at(a)
m=n.a
m===$&&A.j()
if(m===3){l=A.td(A.aG(a,n,!1))
m=n.b
m===$&&A.j()
if(m===6)o=l
else p=l}else{k=a.b
j=n.r
j===$&&A.j()
i=A.bQ(s,k,k+j)
a.b+=j
if(m===1){m=n.b
m===$&&A.j()
m=m===1||m===2}else m=!1
if(m)q=i
else r=i}}if(r!=null){p.toString
q=A.t5(r,p,q)}o.toString
h=A.q0(q,o)
g=A.b([],t.mH)
for(s=a0.c,m=s.length,k=a0.b,f=0;f<s.length;s.length===m||(0,A.h)(s),++f){e=s[f]
if(a.B()===0)continue
j=e.a
if(j>=4)d=j>=10&&j<30
else d=!0
c=(d?(j&1)===1:j===31)?A.fx(a,A.at(a)):b
B.a.j(g,new A.f(k+e.b,A.pW(h,A.aG(a,A.at(a),!1),c)))}return g},
xW(a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=null,a6=a9.c,a7=t.s
if(a6.length===0)s=A.b([a9.b],a7)
else{a7=A.b([],a7)
for(r=a6.length,q=a9.b,p=0;p<a6.length;a6.length===r||(0,A.h)(a6),++p)a7.push(q+a6[p].b)
s=a7}a6=a8.a
a7=a8.b++
r=a6.length
if(!(a7<r))return A.a(a6,a7)
o=a6[a7]
n=A.aG(a8,A.at(a8),!1)
m=b0-1
l=[]
if((o&1)!==0){a7=a8.b++
if(!(a7<r))return A.a(a6,a7)
k=a6[a7]
B.a.A(l,A.tj(a8,k,a5))
m-=k}if((o&2)!==0){B.a.A(l,A.aG(a8,A.at(a8),!0));--m}else if((o&8)!==0){B.a.A(l,A.iG(a8,A.at(a8),!0));--m}if((o&4)!==0){B.a.A(l,A.aG(a8,A.at(a8),!1));--m}else if((o&16)!==0){B.a.A(l,A.iG(a8,A.at(a8),!1));--m}for(a7=[B.er,B.eA],p=0;p<2;++p){r=a7[p]
if((o&r.a)===0)continue
j=A.at(a8)
q=a8.b
i=j.r
i===$&&A.j()
h=A.cy(a6,q,q+i)
r=r.b===4
g=0
for(;;){q=j.f
q===$&&A.j()
if(!(g<q))break
l.push(r?h.getFloat32(g*4,!0):h.getFloat64(g*8,!0));++g}a8.b+=i;--m}if((o&128)!==0){f=A.fx(a8,A.at(a8));--m}else f=a5
e=m>0?A.aG(a8,A.at(a8),!1):B.m
a6=f==null
a7=a6?a5:f.length
if(a7==null)a7=n.length
d=B.b.aa(a7,s.length)
c=A.b([],t.mH)
for(a7=n.length,r=t.O,a6=!a6,b=0,a=0,a0=0;a0<s.length;++a0){a1=A.N(d,a5,!1,r)
for(q=a0*d,a2=0;a2<d;++a2){if(a6){i=q+a2
if(!(i<f.length))return A.a(f,i)
i=f[i]===0}else i=!1
if(i)continue
a3=b+1
if(!(b>=0&&b<a7))return A.a(n,b)
a4=a+n[b]
i=e.length
if(a4>i)throw A.e(B.b4)
if(a4-a!==1){if(!(a>=0&&a<i))return A.a(e,a)
i=e[a]===3}else i=!0
B.a.m(a1,a2,i?new A.iu(e,l).cO(a,a4).a:new A.iu(e,l).ed(a,a4))
a=a4
b=a3}if(!(a0<s.length))return A.a(s,a0)
B.a.j(c,new A.f(s[a0],a1))}return c},
t5(a,b,c){var s,r,q,p,o,n,m,l,k,j=c.length,i=j*8,h=new Uint8Array(i)
for(s=b.length,r=a.length,q=0,p=0;p<j;++p){o=c[p]
if(o===255){++p
if(p<j){n=q+1
m=c[p]
if(!(q>=0&&q<i))return A.a(h,q)
h[q]=m
q=n}}else{m=o+1
if(m<s){if(!(o<s))return A.a(b,o)
l=b[o]
for(;l<b[m];++l,q=n){n=q+1
if(!(l>=0&&l<r))return A.a(a,l)
k=a[l]
if(!(q>=0&&q<i))return A.a(h,q)
h[q]=k}}}}return A.bQ(h,0,q)},
fx(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=b.f
d===$&&A.j()
s=d+7>>>3
r=new Uint8Array(s)
q=a.b
p=b.r
p===$&&A.j()
o=q+p
q=a.a
p=q.length
n=0
for(;;){if(!(n<s&&a.b<o))break
m=a.b
l=a.b=m+1
if(!(m<p))return A.a(q,m)
k=q[m]
if(k<=127){a.b=l+1
if(!(l<p))return A.a(q,l)
j=q[l]
i=Math.min(n+k+3,s)
B.j.az(r,n,i,j)
n=i}else{h=256-k
m=l
for(;;){if(!(h>0&&n<s))break
g=n+1
l=m+1
a.b=l
if(!(m<p))return A.a(q,m)
m=q[m]
if(!(n>=0&&n<s))return A.a(r,n)
r[n]=m;--h
m=l
n=g}}}a.b=o
f=new Uint8Array(d)
for(e=0;e<d;++e){q=e>>>3
if(!(q<s))return A.a(r,q)
q=r[q]
if(!(e<d))return A.a(f,e)
f[e]=q>>>(e&7)&1}return f},
aG(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a.b,d=b.e
d===$&&A.j()
switch(d){case 1:d=b.r
d===$&&A.j()
s=b.f
s===$&&A.j()
r=A.wv(a.a,e,d,s)
break
case 2:d=b.f
d===$&&A.j()
r=new Uint32Array(d)
for(q=0;q<d;++q)r[q]=a.B()
break
default:d=b.r
d===$&&A.j()
p=A.cy(a.a,e,e+d)
d=b.f
d===$&&A.j()
r=new Uint32Array(d)
for(q=0;q<d;++q)r[q]=p.getUint32(q*4,!0)}d=b.r
d===$&&A.j()
a.b=e+d
d=b.w
if(c){d===$&&A.j()
o=new Int32Array(d)}else{d===$&&A.j()
o=new Uint32Array(d)}d=b.c
d===$&&A.j()
switch(d){case 1:d=b.d
d===$&&A.j()
n=d===3?A.mz(r,b):r
d=o.$flags|0
s=n.length
m=o.length
l=0
q=0
for(;;){if(!(q<m&&q<s))break
if(!(q<s))return A.a(n,q)
k=n[q]
j=k>>>1
l+=(k&1)===0?j:-j-1
d&2&&A.x(o)
if(!(q<m))return A.a(o,q)
o[q]=l;++q}break
case 3:i=A.mz(r,b)
d=o.$flags|0
s=i.length
m=o.length
q=0
for(;;){if(!(q<m&&q<s))break
if(c){if(!(q<s))return A.a(i,q)
k=i[q]
j=k>>>1
k=(k&1)===0?j:-j-1}else{if(!(q<s))return A.a(i,q)
k=i[q]}d&2&&A.x(o)
if(!(q<m))return A.a(o,q)
o[q]=k;++q}break
case 4:d=r.length
s=o.$flags|0
m=o.length
l=0
q=0
for(;;){if(!(q<m&&q<d))break
if(!(q<d))return A.a(r,q)
l+=r[q]
s&2&&A.x(o)
if(!(q<m))return A.a(o,q)
o[q]=l;++q}break
case 2:d=o.$flags|0
s=r.length
m=o.length
h=0
g=0
q=0
for(;;){k=q+1
if(!(k<m&&k<s))break
if(!(q<s))return A.a(r,q)
j=r[q]
f=j>>>1
h+=(j&1)===0?f:-f-1
if(!(k<s))return A.a(r,k)
f=r[k]
j=f>>>1
g+=(f&1)===0?j:-j-1
d&2&&A.x(o)
if(!(q<m))return A.a(o,q)
o[q]=h
if(!(k<m))return A.a(o,k)
o[k]=g
q+=2}break
default:d=o.$flags|0
s=r.length
m=o.length
q=0
for(;;){if(!(q<m&&q<s))break
if(c){if(!(q<s))return A.a(r,q)
k=r[q]
j=k>>>1
k=(k&1)===0?j:-j-1}else{if(!(q<s))return A.a(r,q)
k=r[q]}d&2&&A.x(o)
if(!(q<m))return A.a(o,q)
o[q]=k;++q}}return o},
iG(a,b,c){var s,r,q,p,o,n,m,l,k,j=a.b,i=b.e
i===$&&A.j()
s=t.t
if(i===2){i=A.b([],s)
r=0
for(;;){s=b.f
s===$&&A.j()
if(!(r<s))break
i.push(a.B());++r}q=i}else{i=b.r
i===$&&A.j()
p=A.cy(a.a,j,j+i)
s=A.b([],s)
r=0
for(;;){i=b.f
i===$&&A.j()
if(!(r<i))break
i=r*8
s.push(p.getUint32(i+4,!0)*4294967296+p.getUint32(i,!0));++r}q=s}i=b.r
i===$&&A.j()
a.b=j+i
i=b.w
i===$&&A.j()
o=A.N(i,0,!1,t.S)
s=b.c
s===$&&A.j()
switch(s){case 1:s=b.d
s===$&&A.j()
n=s===3?A.mz(q,b):q
m=0
r=0
for(;;){if(!(r<i&&r<n.length))break
if(!(r<n.length))return A.a(n,r)
s=n[r]
m+=(s&1)===0?B.b.F(s,2):-B.b.F(s+1,2)
B.a.m(o,r,m);++r}break
case 3:l=A.mz(q,b)
s=l.length
r=0
for(;;){if(!(r<i&&r<s))break
if(c){if(!(r<s))return A.a(l,r)
k=l[r]
k=(k&1)===0?B.b.F(k,2):-B.b.F(k+1,2)}else{if(!(r<s))return A.a(l,r)
k=l[r]}B.a.m(o,r,k);++r}break
default:r=0
for(;;){if(!(r<i&&r<q.length))break
s=q.length
if(c){if(!(r<s))return A.a(q,r)
s=q[r]
s=(s&1)===0?B.b.F(s,2):-B.b.F(s+1,2)}else{if(!(r<s))return A.a(q,r)
s=q[r]}B.a.m(o,r,s);++r}}return o},
mz(a,b){var s,r,q,p,o,n,m,l=b.x
if(l==null)l=a.length/2|0
s=b.w
s===$&&A.j()
r=A.N(s,0,!1,t.S)
q=0
p=0
for(;;){if(!(p<l&&p+l<a.length))break
o=a.length
if(!(p<o))return A.a(a,p)
n=Math.min(q+a[p],s)
m=p+l
if(!(m<o))return A.a(a,m)
B.a.az(r,q,n,a[m]);++p
q=n}return r},
wA(a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=null,a=A.aG(a1,A.at(a1),!1),a0=a.length
if(a0===1&&a3>1){s=new Uint32Array(a3)
if(0>=a0)return A.a(a,0)
B.i.az(s,0,a3,a[0])
a=s}for(a0=a2-1,r=b,q=r,p=q,o=p,n=o,m=n,l=!1,k=0;k<a0;++k){j=A.at(a1)
i=j.a
i===$&&A.j()
switch(i){case 3:h=A.aG(a1,j,!1)
i=j.b
i===$&&A.j()
switch(i){case 1:m=h
break
case 2:n=h
break
case 3:o=h
break}break
case 2:g=A.aG(a1,j,!1)
i=j.b
i===$&&A.j()
if(i===0)p=g
if(i===1)l=!0
break
case 1:i=j.b
i===$&&A.j()
if(i===4){q=A.aG(a1,j,!1)
r=j}else q=A.aG(a1,j,!0)
break
default:i=a1.b
f=j.r
f===$&&A.j()
a1.b=i+f}}if(l)p=b
e=b
if(m!=null){d=A.pX(a,m,2)
a0=n!=null
if(a0&&o!=null){c=A.pU(a,d,n,!1)
e=A.xP(a,d,c,o)}else c=a0?A.pU(a,d,n,b):b}else{a0=n!=null
if(a0&&o!=null){c=A.pX(a,n,1)
e=A.pU(a,c,o,!0)}else c=a0?A.pX(a,n,0):b
d=b}if(q==null)a0=new Int32Array(0)
else a0=q
return A.ws(a,d,c,e,p,a0,r).hO()},
pX(a,b,c){var s,r,q,p,o,n,m,l=a.length,k=l+1,j=new Uint32Array(k)
for(s=b.length,r=0,q=0;q<l;q=p){p=q+1
o=j[q]
if(a[q]>c&&r<s){n=r+1
if(!(r<s))return A.a(b,r)
m=b[r]
r=n}else m=1
if(!(p<k))return A.a(j,p)
j[p]=o+m}return j},
pU(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e
if(B.i.gN(b)>16777216)throw A.e(B.aU)
s=B.i.gN(b)+1
r=new Uint32Array(s)
for(q=a.length,p=b.length,o=c.length,n=d==null,m=1,l=0,k=0;k<q;){j=a[k]
if(n)i=j===1||j===4
else{i=!0
if(j!==5){if(j!==2)if(d)h=j===4||j===1
else h=!1
else h=i
i=h}}if(!(k<p))return A.a(b,k)
g=b[k];++k
if(!(k<p))return A.a(b,k)
for(;g<b[k];++g){h=m-1
if(!(h>=0&&h<s))return A.a(r,h)
h=r[h]
if(i&&l<o){f=l+1
if(!(l>=0&&l<o))return A.a(c,l)
e=c[l]
l=f}else e=1
if(!(m>=0&&m<s))return A.a(r,m)
r[m]=h+e;++m}}return r},
xP(a,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
if(B.i.gN(a1)>16777216)throw A.e(B.aW)
s=B.i.gN(a1)+1
r=new Uint32Array(s)
for(q=a.length,p=a0.length,o=a1.length,n=a2.length,m=1,l=1,k=0,j=0;j<q;){i=a[j]
if(!(j<p))return A.a(a0,j)
h=a0[j];++j
if(!(j<p))return A.a(a0,j)
g=i!==0
f=i!==3
for(;h<a0[j];++h){if(g&&f){if(!(m>=0&&m<o))return A.a(a1,m)
e=a1[m]
d=m-1
if(!(d>=0))return A.a(a1,d)
c=e-a1[d]
for(;c>0;--c){e=l-1
if(!(e>=0&&e<s))return A.a(r,e)
e=r[e]
if(k<n){b=k+1
if(!(k>=0))return A.a(a2,k)
d=a2[k]
k=b}else d=0
if(!(l>=0&&l<s))return A.a(r,l)
r[l]=e+d;++l}}else{e=l-1
if(!(e>=0&&e<s))return A.a(r,e)
e=r[e]
if(!(l>=0&&l<s))return A.a(r,l)
r[l]=e+1;++l}++m}}return r},
ws(a,b,c,d,e,f,g){var s=t.t,r=A.b([],s)
s=A.b([],s)
return new A.lB(a,b,c,d,e,f,g,J.qp(a,new A.lC()),r,s)},
tm(a,b){var s,r
for(s=0,r=0;r<b;++r)s=(s|B.b.a4(B.b.K(a,2*r)&1,r))>>>0
return s},
wv(a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a2>>>2,a=new Uint32Array(b)
for(s=a0.length,r=a1,q=0;q<b;++q,r+=4){if(!(r<s))return A.a(a0,r)
p=a0[r]
o=r+1
if(!(o<s))return A.a(a0,o)
o=a0[o]
n=r+2
if(!(n<s))return A.a(a0,n)
n=a0[n]
m=r+3
if(!(m<s))return A.a(a0,m)
m=a0[m]
if(!(q<b))return A.a(a,q)
a[q]=(p<<24|o<<16|n<<8|m)>>>0}l=new Uint32Array(a3)
k=0
if(!B.i.gC(a)){if(0>=b)return A.a(a,0)
j=a[0]
if(B.b.T(j,256)!==0||j>a3)throw A.e(B.aV)
for(i=1;k<j;){h=Math.min(65536,j-k)
i=A.wu(a,l,i,k,h)
k+=h}}else i=0
g=0
f=0
e=0
for(;;){if(!(k<a3&&i<b))break
if(!(i>=0&&i<b))return A.a(a,i)
d=B.b.ce(a[i],e)&255
e+=8
if(e===32){++i
e=0}g=(g|B.b.a4(d&127,f))>>>0
if((d&128)!==0){c=k+1
if(!(k<a3))return A.a(l,k)
l[k]=g
k=c
g=0
f=0}else f+=7}return l},
wu(a9,b0,b1,b2,b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8=a9.length
if(!(b1>=0&&b1<a8))return A.a(a9,b1)
s=b1+a9[b1]
if(!(s<a8))return A.a(a9,s)
r=a9[s]
q=s+1
p=new Uint8Array(r)
for(o=0;o<r;++o){n=q+(o>>>2)
if(!(n<a8))return A.a(a9,n)
n=B.b.ce(a9[n],(o&3)*8)
if(!(o<r))return A.a(p,o)
p[o]=n&255}m=q+(r+3>>>2)
l=m+1
if(!(m<a8))return A.a(a9,m)
k=a9[m]
j=A.N(33,null,!1,t.lf)
i=A.N(33,0,!1,t.S)
for(m=l,h=2;h<=32;++h){if((B.b.eE(k,h-1)&1)===0)continue
l=m+1
if(!(m>=0&&m<a8))return A.a(a9,m)
g=a9[m]
f=new Uint32Array((g+31&4294967264)>>>0)
for(m=l,e=0;e<g;e+=32){A.rF(a9,m,f,e,h)
m+=h}m-=B.b.K((e-g)*h,5)
B.a.m(j,h,f)}d=b1+1
for(a8=B.b.F(b3,256),n=b0.length,c=0,b=0;b<a8;++b){a=c+1
if(!(c>=0&&c<r))return A.a(p,c)
h=p[c]
c=a+1
if(!(a>=0&&a<r))return A.a(p,a)
a0=p[a]
a1=b2+b*256
if(h===32){B.i.a7(b0,a1,a1+256,a9,d)
d+=256}else if(h>0)for(a2=0;a2<8;++a2){A.rF(a9,d,b0,a1+a2*32,h)
d+=h}if(a0===0)continue
a=c+1
if(!(c>=0&&c<r))return A.a(p,c)
a3=p[c]-h
if(a3===1)for(a4=b0.$flags|0,c=a,o=0;o<a0;++o,c=a){a=c+1
if(!(c>=0&&c<r))return A.a(p,c)
a5=a1+p[c]
if(!(a5>=0&&a5<n))return A.a(b0,a5)
a6=b0[a5]
a7=B.b.a4(1,h)
a4&2&&A.x(b0)
b0[a5]=(a6|a7)>>>0}else{if(!(a3>=0&&a3<33))return A.a(j,a3)
f=j[a3]
if(f==null)throw A.e(B.aY)
for(a4=f.length,c=a,o=0;o<a0;++o,c=a){a=c+1
if(!(c>=0&&c<r))return A.a(p,c)
a5=a1+p[c]
if(!(a5>=0&&a5<n))return A.a(b0,a5)
a6=b0[a5]
a7=i[a3]
B.a.m(i,a3,a7+1)
if(!(a7<a4))return A.a(f,a7)
a7=B.b.a4(f[a7],h)
b0.$flags&2&&A.x(b0)
b0[a5]=(a6|a7)>>>0}}}return m},
rF(a,b,c,d,e){var s,r,q,p,o,n,m,l,k=e===32?4294967295:B.b.a4(1,e)-1
for(s=c.$flags|0,r=a.length,q=0;q<32;++q){p=q*e
o=b+(p>>>5)
n=p&31
if(!(o>=0&&o<r))return A.a(a,o)
m=a[o]>>>n
if(n+e>32){l=o+1
if(!(l<r))return A.a(a,l)
m|=B.b.a8(a[l],32-n)}l=d+q
s&2&&A.x(c)
if(!(l>=0&&l<c.length))return A.a(c,l)
c[l]=(m&k)>>>0}},
i5:function i5(a,b,c){this.a=a
this.b=b
this.c=c},
m2:function m2(){var _=this
_.w=_.r=_.f=_.e=_.d=_.c=_.b=_.a=$
_.x=null
_.z=_.y=0},
mv:function mv(){},
iu:function iu(a,b){this.a=a
this.b=b},
lU:function lU(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
lB:function lB(a,b,c,d,e,f,g,h,i,j){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=0
_.at=_.as=_.Q=1},
lC:function lC(){},
it:function it(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=$},
is:function is(a,b){this.a=a
this.b=b},
lD:function lD(a){this.a=a
this.b=0},
vx(a){var s,r,q,p,o=A.C(t.N,t.dl),n=a.length,m=new A.bZ(a,0,n)
while(m.b<n){s=m.B()
if(s===26){r=m.ag(0)
q=m.b
p=A.vv(a,q,q+r)
o.m(0,p.a,p)
m.b+=r}else m.U(0,s&7)}return new A.k1(o)},
vv(a,b,c){var s,r,q,p,o,n=A.b([],t.s),m=[],l=A.b([],t.ef),k=new A.bZ(a,b,c)
for(s="",r=4096;k.b<c;){q=k.B()
switch(q){case 10:s=k.aR()
break
case 18:p=k.ag(0)
o=k.b
B.a.j(l,A.vu(a,o,o+p))
k.b+=p
break
case 26:B.a.j(n,k.aR())
break
case 34:p=k.ag(0)
o=k.b
m.push(A.vw(a,o,o+p))
k.b+=p
break
case 40:r=k.B()
break
default:k.U(0,q&7)}}return new A.eG(s,r,n,m,l)},
vw(a,b,c){var s,r,q,p,o=new A.bZ(a,b,c)
for(s=null;o.b<c;){r=o.B()
switch(r){case 10:s=o.aR()
break
case 21:q=o.b
p=A.cy(a,q,q+4).getFloat32(0,!0)
o.b+=4
s=p
break
case 25:q=o.b
p=A.cy(a,q,q+8).getFloat64(0,!0)
o.b+=8
s=p
break
case 32:case 40:s=o.B()
break
case 48:p=o.B()
s=(p&1)===0?B.b.F(p,2):-B.b.F(p+1,2)
break
case 56:s=o.B()!==0
break
default:o.U(0,r&7)}}return s},
vu(a,b,c){var s,r,q,p,o,n,m,l,k=new A.bZ(a,b,c)
for(s=0,r=null,q=0,p=0,o=0,n=0;k.b<c;){m=k.B()
switch(m){case 8:r=k.B()
break
case 18:l=k.ag(0)
q=k.b
p=q+l
k.b=p
break
case 24:s=k.B()
break
case 34:l=k.ag(0)
o=k.b
n=o+l
k.b=n
break
default:k.U(0,m&7)}}return new A.eF(a,s,r,q,p,o,n)},
k1:function k1(a){this.a=a},
eG:function eG(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
eF:function eF(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
et:function et(a,b){this.a=a
this.b=0
this.c=b},
bZ:function bZ(a,b,c){this.a=a
this.b=b
this.c=c},
rc(a){var s=A.b([],t.n),r=A.b([],t.b),q=A.b([],t.ot),p=new A.hs(s,r,q)
p.cc(a)
return s.length===0&&r.length===0&&q.length===0?null:p},
k9(a){var s,r,q,p=t.n,o=A.b([],p),n=t.j
if(n.b(a))for(s=J.F(a);s.n();){r=s.gp()
if(n.b(r)){q=J.o(r)
q=q.gk(r)>=2&&typeof q.h(r,0)=="number"&&typeof q.h(r,1)=="number"}else q=!1
if(q){q=J.o(r)
B.a.A(o,A.b([A.ai(q.h(r,0)),A.ai(q.h(r,1))],p))}}return o},
vI(a,b,c,d,e,f,g,h){var s=new A.k8(),r=s.$6(e,f,g,h,a,b),q=s.$6(e,f,g,h,c,d),p=s.$6(a,b,c,d,e,f),o=s.$6(a,b,c,d,g,h)
return r*q<0&&p*o<0},
rb(a,b,c){var s,r,q,p,o,n,m,l,k
for(s=J.o(c),r=s.gk(c)-2,q=!1,p=0;p<s.gk(c);o=p+2,r=p,p=o){n=s.h(c,p)
m=s.h(c,p+1)
l=s.h(c,r)
k=s.h(c,r+1)
if(m>b!==k>b&&a<(l-n)*(b-m)/(k-m)+n)q=!q}return q},
vH(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=J.o(a)
if(e.gk(a)<2||J.V(b)<2)return 1/0
s=e.gk(a)<4?1:e.gk(a)-2
r=J.o(b)
q=r.gk(b)<4?1:r.gk(b)-2
for(p=1/0,o=0;o<s;o+=2){n=e.h(a,o)*c
m=e.h(a,o+1)
l=e.gk(a)<4?n:e.h(a,o+2)*c
k=e.gk(a)<4?m:e.h(a,o+3)
for(j=0;j<q;j+=2){i=r.h(b,j)*c
h=r.h(b,j+1)
g=r.gk(b)<4?i:r.h(b,j+2)*c
f=A.vJ(n,m,l,k,i,h,g,r.gk(b)<4?h:r.h(b,j+3))
if(f<p)p=f}}return p},
vJ(a,b,c,d,e,f,g,h){var s=new A.ka(),r=s.$6(e,f,g,h,a,b),q=s.$6(e,f,g,h,c,d),p=s.$6(a,b,c,d,e,f),o=s.$6(a,b,c,d,g,h)
if(!(r>0&&q<0))s=r<0&&q>0
else s=!0
if(s)if(!(p>0&&o<0))s=p<0&&o>0
else s=!0
else s=!1
if(s)return 0
return Math.min(Math.min(A.ht(a,b,e,f,g,h),A.ht(c,d,e,f,g,h)),Math.min(A.ht(e,f,a,b,c,d),A.ht(g,h,a,b,c,d)))},
ht(a,b,c,d,e,f){var s=e-c,r=f-d,q=s*s+r*r,p=q===0?0:B.c.E(((a-c)*s+(b-d)*r)/q,0,1),o=a-c-s*p,n=b-d-r*p
return Math.sqrt(o*o+n*n)},
hs:function hs(a,b,c){this.a=a
this.b=b
this.c=c},
kc:function kc(){},
k8:function k8(){},
kb:function kb(a,b){this.a=a
this.b=b},
ka:function ka(){},
qU(a,b){return new A.jN(a,b)},
cV:function cV(a,b){this.a=a
this.b=b},
jN:function jN(a,b){this.a=a
this.b=b},
qg(a,b){var s=0,r=A.aC(t.o)
var $async$qg=A.aD(function(c,d){if(c===1)return A.az(d,r)
for(;;)switch(s){case 0:return A.aA(null,r)}})
return A.aB($async$qg,r)},
oI(a){var s=0,r=A.aC(t.p),q,p,o,n
var $async$oI=A.aD(function(b,c){if(b===1)return A.az(c,r)
for(;;)switch(s){case 0:p=v.G
o=A.b0(A.b0(A.b0(new p.Blob(A.b([a],t.aA))).stream()).pipeThrough(A.b0(new p.DecompressionStream("gzip"))))
n=A
s=3
return A.a0(A.qd(A.b0(A.b0(new p.Response(o)).arrayBuffer()),t.eb),$async$oI)
case 3:q=n.pz(c,0,null)
s=1
break
case 1:return A.aA(q,r)}})
return A.aB($async$oI,r)},
eL:function eL(){},
k3:function k3(a,b){this.a=a
this.b=b},
k2:function k2(a){this.a=a},
jp:function jp(a){this.a=a},
pV(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=null,e=new A.be(""),d=[null]
for(s=J.F(a),r=t.e7,q=t.f,p=t.bW,o=t.p,n=t.kI,m=t.hM,l=t.pk;s.n();){k=s.gp()
if(k==null){e.a+="n"
d.push(f)
continue}j=A.H(k)
i=j?k:f
if(j){e.a+="b"
d.push(i)
continue}j=typeof k=="string"
i=j?k:f
if(j){e.a+="s"
d.push(i)
continue}j=A.e_(k)
i=j?k:f
if(j){e.a+="i"
d.push(i)
continue}j=typeof k=="number"
i=j?k:f
if(j){e.a+="d"
d.push(i)
continue}j=l.b(k)
i=j?k:f
if(j){e.a+="F"
d.push(A.iH(i,i,b))
continue}j=m.b(k)
i=j?k:f
if(j){e.a+="S"
d.push(A.iH(i,i,b))
continue}j=n.b(k)
i=j?k:f
if(j){e.a+="D"
d.push(A.iH(i,i,b))
continue}j=o.b(k)
i=j?k:f
if(j){e.a+="U"
d.push(A.iH(i,i,b))
continue}j=p.b(k)
i=j?k:f
if(j){e.a+="I"
d.push(A.iH(i,i,b))
continue}j=q.b(k)
i=j?k:f
if(j){e.a+="m"
j=[]
for(h=i.gai(),h=h.gt(h);h.n();){g=h.gp()
B.a.A(j,[g.a,g.b])}d.push(A.pV(j,b))
continue}j=r.b(k)
i=j?k:f
if(j){e.a+="l"
d.push(A.pV(i,b))
continue}throw A.e(A.aK("A "+J.qv(k).q(0)+" cannot be sent to a worker",f))}s=e.a
B.a.m(d,0,s.charCodeAt(0)==0?s:s)
return d},
iH(a,b,c){var s
if(a.byteOffset===0&&a.byteLength===J.ud(J.qu(a))&&a.byteLength>0){s=t.eb.a(J.qu(a))
if(!B.a.aw(c,new A.n0(s)))B.a.j(c,s)}return b},
pS(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(0<0||0>=a.length)return A.a(a,0)
s=a[0]
s.toString
A.W(s)
r=s.length
q=A.N(r,null,!0,t.O)
for(p=t.dM,o=t.da,n=t.hp,m=t.g_,l=t.nZ,k=t.bi,j=0;j<r;j=i){i=j+1
if(!(i>=0&&i<a.length))return A.a(a,i)
h=a[i]
g=s[j]
A:{if("n"===g){f=null
break A}if("b"===g){h.toString
A.pL(h)
f=h
break A}if("s"===g){h.toString
A.W(h)
f=h
break A}if("i"===g){h.toString
h=A.D(A.db(h))
f=h
break A}if("d"===g){h.toString
A.db(h)
f=h
break A}if("F"===g){h.toString
k.a(h)
f=h
break A}if("S"===g){h.toString
l.a(h)
f=h
break A}if("D"===g){h.toString
m.a(h)
f=h
break A}if("U"===g){h.toString
n.a(h)
f=h
break A}if("I"===g){h.toString
o.a(h)
f=h
break A}if("m"===g){h.toString
f=A.xS(A.pS(p.a(h)))
break A}h.toString
f=A.pS(p.a(h))
break A}B.a.m(q,j,f)}return q},
xS(a){var s,r,q,p,o=t.O
o=A.C(o,o)
for(s=0;r=a.length,s<r;s+=2){q=a[s]
p=s+1
if(!(p<r))return A.a(a,p)
o.m(0,q,a[p])}return o},
n0:function n0(a){this.a=a},
vL(a,b,c){var s,r,q,p,o,n,m,l,k,j
for(s=0,r=1,q=0;q<a;++q){s+=r
r*=4}p=a===0?0:B.b.a8(1,a-1)
o=c
n=b
for(;p>0;p=p>>>1){m=(n&p)>>>0!==0?1:0
l=(o&p)>>>0!==0?1:0
s+=p*p*((3*m^l)>>>0)
if(l===0){if(m===1){k=p-1
n=k-n
o=k-o}j=o
o=n
n=j}}return s},
vK(a,b){var s,r,q=a.length,p=q-1
for(s=0;s<=p;){r=B.b.K(s+p,1)
if(!(r<q))return A.a(a,r)
if(a[r].a<=b)s=r+1
else p=r-1}if(p<0)q=null
else{if(!(p<q))return A.a(a,p)
q=a[p]}return q},
eO(a,b){var s=0,r=A.aC(t.p),q,p
var $async$eO=A.aD(function(c,d){if(c===1)return A.az(d,r)
for(;;)switch(s){case 0:if(0===b||1===b){p=a
s=3
break}s=2===b?4:5
break
case 4:s=6
return A.a0(A.oI(a),$async$eO)
case 6:p=d
s=3
break
case 5:p=A.t(B.b2)
case 3:q=p
s=1
break
case 1:return A.aA(q,r)}})
return A.aB($async$eO,r)},
rd(a){var s,r,q,p,o,n,m,l,k,j,i,h,g={}
g.a=0
s=new A.ke(g,a)
r=s.$0()
if(r<0||r>a.length)throw A.e(B.b0)
q=t.S
p=A.N(r,0,!1,q)
o=A.N(r,0,!1,q)
n=A.N(r,0,!1,q)
for(m=0,l=0;l<r;++l){q=s.$0()
if(typeof q!=="number")return A.ah(q)
m+=q
B.a.m(p,l,m)}for(l=0;l<r;++l)B.a.m(o,l,s.$0())
for(l=0;l<r;++l)B.a.m(n,l,s.$0())
k=A.b([],t.fB)
for(j=0,l=0;l<r;++l){i=s.$0()
h=i===0&&l>0?j:i-1
q=n[l]
j=h+q
B.a.j(k,new A.f9(p[l],o[l],h,q))}return k},
kd:function kd(a,b,c,d){var _=this
_.a=a
_.c=b
_.d=c
_.r=_.f=null
_.w=d},
kf:function kf(a){this.a=a},
ke:function ke(a,b){this.a=a
this.b=b},
ij:function ij(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
f9:function f9(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
za(a){var s,r,q,p=A.b([],t.G)
for(s=A.xg(a),r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q)B.a.j(p,A.y0(s[q],8))
return p},
xg(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=a.a,e=A.b([],t.ot)
for(s=a.c,r=f.length,q=t.n,p=t.b,o=null,n=null,m=0;m<s.length-1;){l=s[m];++m
k=s[m]
j=A.b([],q)
for(i=l*2,h=k*2;i<h;++i){if(!(i<r))return A.a(f,i)
j.push(f[i])}g=A.yb(j)
if(g===0)continue
if(n==null)n=g<0
if(n===g<0){if(o!=null)B.a.j(e,o)
o=A.b([j],p)}else if(o!=null)B.a.j(o,j)}if(o!=null)B.a.j(e,o)
return e},
yb(a){var s,r,q,p,o,n,m,l,k
for(s=a.length,r=s-2,q=0,p=0;p<s;o=p+2,r=p,p=o){if(!(r>=0&&r<s))return A.a(a,r)
n=a[r]
m=a[p]
l=p+1
if(!(l<s))return A.a(a,l)
l=a[l]
k=r+1
if(!(k<s))return A.a(a,k)
q+=(n-m)*(l+a[k])}return q},
wt(a,b,c,d){var s=A.fy(a,b,d),r=new A.bU(a,b,c,s)
r.e=s+c*1.4142135623730951
return r},
y0(a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=J.al(a3,0)
for(s=J.o(a2),r=1/0,q=1/0,p=-1/0,o=-1/0,n=0;n<s.gk(a2);n+=2){r=Math.min(r,s.h(a2,n))
p=Math.max(p,s.h(a2,n))
m=n+1
q=Math.min(q,s.h(a2,m))
o=Math.max(o,s.h(a2,m))}l=Math.min(p-r,o-q)
if(l===0)return new A.f(r,q)
k=l/2
s=A.b([],t.ji)
j=new A.lV(s)
for(m=k*1.4142135623730951,i=r;i<p;i+=l)for(h=i+k,g=q;g<o;g+=l){f=g+k
e=A.fy(h,f,a3)
f=new A.bU(h,f,k,e)
f.e=e+m
j.bi(f)}d=A.xf(a3)
for(c=d;s.length!==0;){b=j.iB()
m=c.d
if(b.d>m||m===0||isNaN(m))c=b
m=b.e
m===$&&A.j()
if(m-c.d<=a4)continue
k=b.c/2
m=b.a
h=m-k
f=b.b
e=f-k
a=A.fy(h,e,a3)
a0=new A.bU(h,e,k,a)
a1=k*1.4142135623730951
a0.e=a+a1
j.bi(a0)
m+=k
a0=A.fy(m,e,a3)
e=new A.bU(m,e,k,a0)
e.e=a0+a1
j.bi(e)
f+=k
e=A.fy(h,f,a3)
h=new A.bU(h,f,k,e)
h.e=e+a1
j.bi(h)
h=A.fy(m,f,a3)
f=new A.bU(m,f,k,h)
f.e=h+a1
j.bi(f)}s=d.d
if(s>0&&c.d-s<=a4)return new A.f(d.a,d.b)
return new A.f(c.a,c.b)},
xf(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=J.al(a,0)
for(s=J.o(g),r=s.gk(g)-2,q=0,p=0,o=0,n=0;n<s.gk(g);m=n+2,r=n,n=m){l=s.h(g,n)
k=s.h(g,n+1)
j=s.h(g,r)
i=s.h(g,r+1)
h=l*i-j*k
p+=(l+j)*h
o+=(k+i)*h
q+=h*3}return A.wt(p/q,o/q,0,a)},
fy(a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a
for(s=J.F(a2),r=!1,q=1/0;s.n();){p=s.gp()
for(o=J.o(p),n=o.gk(p)-2,m=0;m<o.gk(p);l=m+2,n=m,m=l){k=o.h(p,m)
j=o.h(p,m+1)
i=o.h(p,n)
h=o.h(p,n+1)
if(j>a1!==h>a1&&a0<(i-k)*(a1-j)/(h-j)+k)r=!r
g=i-k
f=h-j
if(g!==0||f!==0){e=((a0-k)*g+(a1-j)*f)/(g*g+f*f)
if(e>1){d=h
c=i}else if(e>0){c=k+g*e
d=j+f*e}else{d=j
c=k}}else{d=j
c=k}b=a0-c
a=a1-d
q=Math.min(q,b*b+a*a)}}s=r?1:-1
return s*Math.sqrt(q)},
bU:function bU(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=$},
lV:function lV(a){this.a=a},
wm(a){var s,r,q,p,o,n,m,l,k,j,i,h=J.o(a),g=h.h(a,0)
g.toString
A.D(g)
s=new A.lu(a)
r=new A.lt(a)
q=h.h(a,1)
A:{if("build"===q){p=s.$0()
o=h.h(a,6)
o.toString
A.D(o)
n=p.a
m=p.b
p=p.c
h=h.h(a,5)
h.toString
g=new A.ee(new A.aY(n,m,p,o),A.D(h),g)
h=g
break A}if("find"===q){p=s.$0()
o=r.$1(5)
n=r.$1(6)
m=r.$1(7)
l=r.$1(8)
g=new A.er(p,o,n,m,l,h.h(a,9)==null?null:new A.f(r.$1(9),r.$1(10)),g)
h=g
break A}if("cluster"===q){p=h.h(a,2)
p.toString
p=A.uR(B.cE,A.W(p),t.j8)
o=h.h(a,3)
o.toString
A.D(o)
n=h.h(a,4)
n.toString
A.D(n)
h=h.h(a,5)
h.toString
g=new A.eb(p,o,n,A.D(h),g)
h=g
break A}if("states"===q){p=A.b([],t.eL)
h=h.h(a,2)
h.toString
o=t.j
h=J.F(o.a(h))
n=t.f
m=t.N
l=t.O
while(h.n()){k=o.a(h.gp())
j=J.o(k)
i=j.h(k,0)
k=j.h(k,1)
k.toString
p.push(new A.f(i,n.a(k).bf(0,m,l)))}h=new A.f1(p,g)
break A}h=A.t(A.aK("No worker request is called "+A.v(q),null))}return h},
lv:function lv(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
bT:function bT(){},
lu:function lu(a){this.a=a},
lt:function lt(a){this.a=a},
ee:function ee(a,b,c){this.b=a
this.c=b
this.a=c},
f1:function f1(a,b){this.b=a
this.a=b},
er:function er(a,b,c,d,e,f,g){var _=this
_.b=a
_.c=b
_.d=c
_.e=d
_.f=e
_.r=f
_.a=g},
c6:function c6(a,b){this.a=a
this.b=b},
eb:function eb(a,b,c,d,e){var _=this
_.b=a
_.c=b
_.d=c
_.e=d
_.a=e},
ay:function ay(){},
hT:function hT(){},
hQ:function hQ(a,b){this.c=a
this.a=b},
hS:function hS(a,b){this.c=a
this.a=b},
eq:function eq(a,b){this.b=a
this.a=b},
eh:function eh(a,b){this.b=a
this.a=b},
dp:function dp(a,b){this.b=a
this.a=b},
fN:function fN(a,b,c){this.a=a
this.b=b
this.c=c},
hR:function hR(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
zb(c2,c3,c4,c5,c6,c7,c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1=new A.A(B.e,B.e)
c1.a=c8
s=new Float64Array(4096)
r=t.t
q=A.b([],r)
p=new A.et(s,q)
o=A.b([],t.cb)
n=new A.oY(c8)
for(s=J.F(c2),m=t.bs,l=m.i("a2<a1.E>"),k=c3.ch,j=c3.ay,i=m.i("a1.E"),h=c3.CW,g=t.s,f=t.A,e=c3.cx;s.n();){d=s.gp()
c=A.b([],r)
for(b=0;b<k.length;++b){a=k[b].b
if(!(a>=0&&a<j.length))return A.a(j,a)
a=j[a]
a0=!1
if(a.c===c4)if(a.d===d.gal()){if(!(b<k.length))return A.a(k,b)
a=k[b]
a=n.$2(a.c,a.d)}else a=a0
else a=a0
if(a)c.push(b)}a=A.b([],r)
for(b=0;b<h.length;++b){a0=h[b].b
a1=!1
if(a0.b===c4)if(a0.c===d.gal()){if(!(b<h.length))return A.a(h,b)
a0=h[b].b
a0=n.$2(a0.z,a0.Q)}else a0=a1
else a0=a1
if(a0)a.push(b)}if(c.length===0&&a.length===0)continue
a2=4096/d.gaV()
a3=c5/a2
a4=c6/a2
a5=c7/a2
if(!(c4>=0&&c4<e.length))return A.a(e,c4)
a6=e[c4]
a7=a6 instanceof A.ca?null:a6.cC(d.gal())
for(a0=d.gaL(),a1=a0.length,a8=a7!=null,a9=0;a9<a0.length;a0.length===a1||(0,A.h)(a0),++a9){b0=a0[a9]
p.b=0
B.a.a2(q)
b0.aZ(p)
A:{if(f.b(c9)){b1=c9.a/a2
b2=c9.b/a2
b2=A.yh(b0.gL(),p,a3-b1,a4-b2,a3+b1,a4+b2)
b1=b2
break A}if(c9==null){b1=A.xt(b0.gL(),p,a3,a4,a5)
break A}b1=null}if(!b1)continue
b3=b0.aK(d)
if(a8&&b3.h(0,a7)!=null)b3.m(0,"$id",b3.h(0,a7))
c1.sae(b3)
b4=b0.gL()
B:{if(1===b4){b1="Point"
break B}if(2===b4){b1="LineString"
break B}b1="Polygon"
break B}c1.c=b1
b5=A.b([],g)
for(b1=new A.bq(a,m),b1=new A.a2(b1,b1.gk(0),l),b6=-1;b1.n();){b2=b1.d
if(b2==null)b2=i.a(b2)
if(b2>>>0!==b2||b2>=h.length)return A.a(h,b2)
if(!h[b2].i3(c1))continue
if(b2>>>0!==b2||b2>=h.length)return A.a(h,b2)
B.a.j(b5,h[b2].a)
if(b6<0)b6=k.length+b2}for(b1=new A.bq(c,m),b1=new A.a2(b1,b1.gk(0),l);b1.n();){b2=b1.d
b7=b2==null?i.a(b2):b2
if(b7>>>0!==b7||b7>=k.length)return A.a(k,b7)
b8=k[b7]
b2=b8.b
if(!(b2>=0&&b2<j.length))return A.a(j,b2)
b9=j[b2]
c0=b9.f
C:{if(B.A===c0||B.K===c0){b2=b0.gL()===3
break C}if(B.t===c0){b2=b0.gL()===1
break C}if(B.r===c0){b2=b0.gL()!==1
break C}b2=null}if(!b2||!b9.e.$1(c1))continue
b2=b8.a
if(!B.a.v(b5,b2))B.a.j(b5,b2)
if(b6<0)b6=b7}if(b5.length===0)continue
B.a.j(o,new A.hR(b6,d.gal(),c1.c,b5,c1.b))}}return o},
xt(a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=a3.a
if(a2===1){for(s=a3.b,r=a6*a6,q=a1.length,p=0;p<s;p+=2){if(!(p<q))return A.a(a1,p)
o=a1[p]-a4
n=p+1
if(!(n<q))return A.a(a1,n)
m=a1[n]-a5
if(o*o+m*m<=r)return!0}return!1}for(s=a3.c,r=a6*a6,q=a1.length,l=a2===3,k=!1,j=0;j<s.length-1;){i=s[j];++j
h=s[j]
if(h-i<2)continue
n=l?h*2-2:i*2
if(!(n>=0&&n<q))return A.a(a1,n)
g=a1[n]
n=l?h*2-1:i*2+1
if(!(n>=0&&n<q))return A.a(a1,n)
f=a1[n]
p=l?i:i+1
for(;p<h;++p,f=d,g=e){n=p*2
if(!(n<q))return A.a(a1,n)
e=a1[n];++n
if(!(n<q))return A.a(a1,n)
d=a1[n]
if(l){if(f>a5!==d>a5&&a4<(e-g)*(a5-f)/(d-f)+g)k=!k}else{o=e-g
m=d-f
c=o*o+m*m
b=B.c.E(c===0?0:((a4-g)*o+(a5-f)*m)/c,0,1)
a=g+o*b-a4
a0=f+m*b-a5
if(a*a+a0*a0<=r)return!0}}}return k},
yh(a,b,c,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=b.a,d=new A.ol(c,a1,a0,a2)
if(a===1){for(s=e.length,r=0;r<b.b;r+=2){if(!(r<s))return A.a(e,r)
q=e[r]
p=r+1
if(!(p<s))return A.a(e,p)
if(d.$2(q,e[p]))return!0}return!1}o=new A.oj()
n=a===3
for(s=b.c,q=e.length,m=!1,l=0;l<s.length-1;){k=s[l];++l
j=s[l]
if(j-k<2)continue
p=n?j*2-2:k*2
if(!(p>=0&&p<q))return A.a(e,p)
i=e[p]
p=n?j*2-1:k*2+1
if(!(p>=0&&p<q))return A.a(e,p)
h=e[p]
r=n?k:k+1
for(;r<j;++r,h=f,i=g){p=r*2
if(!(p<q))return A.a(e,p)
g=e[p];++p
if(!(p<q))return A.a(e,p)
f=e[p]
if(d.$2(i,h)||d.$2(g,f)||o.$8(i,h,g,f,c,a0,a1,a0)||o.$8(i,h,g,f,a1,a0,a1,a2)||o.$8(i,h,g,f,a1,a2,c,a2)||o.$8(i,h,g,f,c,a2,c,a0))return!0
if(n&&h>a0!==f>a0&&c<(g-i)*(a0-h)/(f-h)+i)m=!m}}return m},
oY:function oY(a){this.a=a},
ol:function ol(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
oj:function oj(){},
ok:function ok(){},
uE(a){var s,r,q,p,o=a.h(0,"encoding")
A:{if("terrarium"===o){s=B.aA
break A}if("custom"===o){s=A.E(a.h(0,"redFactor"))
if(s==null)s=1
r=A.E(a.h(0,"greenFactor"))
if(r==null)r=1
q=A.E(a.h(0,"blueFactor"))
if(q==null)q=1
p=A.E(a.h(0,"baseShift"))
s=new A.ej(s,r,q,p==null?0:p)
break A}s=B.az
break A}return s},
bp:function bp(){},
h7:function h7(){},
hU:function hU(){},
hr:function hr(){},
h6:function h6(){},
ej:function ej(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fO:function fO(){},
hP:function hP(){},
yT(a,b,c,d){var s
if(a===c)s=a<0||a>4096
else s=!1
if(!s)if(b===d)s=b<0||b>4096
else s=!1
else s=!0
return s},
zc(a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a0.length,a=b/2|0
if(a1<=0||a<3)return a0
s=t.n
r=A.b([],s)
q=new A.oZ(a0,r,a1)
p=(a-1)*2
if(!(p>=0&&p<b))return A.a(a0,p)
o=a0[p];++p
if(!(p<b))return A.a(a0,p)
p=a0[p]
n=a0[0]
if(1>=b)return A.a(a0,1)
m=A.yT(o,p,n,a0[1])
for(l=0;l<a;l=k,m=g){k=l+1
j=k%a
p=l*2
if(!(p<b))return A.a(a0,p)
o=a0[p];++p
if(!(p<b))return A.a(a0,p)
n=a0[p]
i=j*2
if(!(i<b))return A.a(a0,i)
h=a0[i];++i
if(!(i<b))return A.a(a0,i)
i=a0[i]
if(o===h)h=o<0||o>4096
else h=!1
if(!h)if(n===i){n=n<0||n>4096
g=n}else g=!1
else g=!0
if(m||g){B.a.j(r,o)
B.a.j(r,a0[p])}else q.$3(B.b.T(l-1+a,a),l,j)}f=A.b([],s)
for(l=0;l<r.length;l+=2){e=B.c.a1(r[l]*2)/2
b=l+1
if(!(b<r.length))return A.a(r,b)
d=B.c.a1(r[b]*2)/2
c=f.length
if(c>0){b=c-2
if(!(b>=0))return A.a(f,b)
b=f[b]===e&&f[c-1]===d}else b=!1
if(b)continue
B.a.j(f,e)
B.a.j(f,d)}for(;;){b=f.length
if(!(b>2&&f[0]===f[b-2]&&f[1]===f[b-1]))break
B.a.sk(f,b-2)}if(b<6)return a0
return new Float64Array(A.R(f))},
zh(a){var s,r,q,p=a.length/2|0,o=new Float64Array(p*4),n=new A.p1(a,o)
for(s=0;s<p;s=q){r=s*4
n.$3(s,B.b.T(s-1+p,p),r)
q=s+1
n.$3(s,q%p,r+2)}return o},
oZ:function oZ(a,b,c){this.a=a
this.b=b
this.c=c},
p1:function p1(a,b){this.a=a
this.b=b},
lj:function lj(a,b,c){this.a=a
this.b=b
this.c=c},
iF(a){var s,r,q=A.E(a)
A:{if(q!=null){s=isFinite(q)
r=q}else{r=null
s=!1}if(s){s=J.qw(r)
break A}s=null
break A}return s},
c1(a){var s,r
try{s=B.h.ak(a,null)
return s}catch(r){if(A.b2(r) instanceof A.dC)return A.v(a)
else throw r}},
wE(a){var s,r,q,p,o,n,m,l=a.h(0,"id")
l=A.v(l==null?"":l)
s=a.h(0,"type")
r=a.h(0,"paint")
q=t.f
r=q.b(r)?r:B.w
p=a.h(0,"layout")
q=q.b(p)?p:B.w
o=A.E(a.h(0,"minzoom"))
A:{if(typeof o=="number"){p=o>0
n=o}else{n=null
p=!1}if(p){p=n
break A}p=-24
break A}m=A.E(a.h(0,"maxzoom"))
return new A.m1(l,s,a,r,q,p,m==null?30:m)},
hJ(a,b){var s,r,q=A.bb(t.N)
for(s=b.length,r=0;r<b.length;b.length===s||(0,A.h)(b),++r)A.bK(a.h(0,b[r]),q)
return q},
rt(a){var s,r
A:{s=t.j.b(a)
if(s){r=J.o(a)
r=r.gk(a)>=1&&"feature-state"===r.h(a,0)}else r=!1
if(r){s=!0
break A}if(s){s=J.qp(a,A.zn())
break A}s=!1
break A}return s},
bK(a,b){var s,r,q
if(t.j.b(a)){s=J.o(a)
if(s.gk(a)===2)r=(J.m(s.h(a,0),"get")||J.m(s.h(a,0),"has"))&&typeof s.h(a,1)=="string"
else r=!1
if(r)b.j(0,A.W(s.h(a,1)))
if(s.gJ(a))r=J.m(s.h(a,0),"feature-state")||J.m(s.h(a,0),"id")
else r=!1
if(r)b.j(0,"$id")
if(s.gJ(a))r=J.m(s.h(a,0),"within")||J.m(s.h(a,0),"distance")
else r=!1
if(r)b.j(0,"$geometry:"+B.h.ak(a,null))
for(s=s.gt(a);s.n();)A.bK(s.gp(),b)}else if(t.f.b(a)){q=a.h(0,"property")
if(typeof q=="string")b.j(0,q)}},
w8(a){var s,r,q,p,o,n,m,l,k=null,j=t.j
if(!j.b(a)||J.V(a)!==4)return k
s=new Float64Array(8)
for(r=J.o(a),q=0;q<4;++q){p=r.h(a,q)
if(!j.b(p)||J.V(p)<2)return k
o=J.o(p)
n=o.h(p,0)
if(!(typeof n=="number"))if(typeof n=="string"){m=A.P(n)
n=m}else{if(A.H(n))m=n?1:0
else m=k
n=m}l=o.h(p,1)
if(!(typeof l=="number"))if(typeof l=="string"){o=A.P(l)
l=o}else{if(A.H(l))o=l?1:0
else o=k
l=o}if(n==null||l==null)return k
o=q*2
if(!(o<8))return A.a(s,o)
s[o]=(n+180)/360;++o
m=A.tI(l)
if(!(o<8))return A.a(s,o)
s[o]=m}return s},
we(a){var s,r,q,p,o,n,m=null,l=t.j
if(l.b(a)){s=J.o(a)
s=s.gk(a)===2&&J.m(s.h(a,0),"literal")}else s=!1
r=s?J.al(a,1):a
if(l.b(r)){l=J.o(r)
l=l.gC(r)||l.gk(r)>4}else l=!0
if(l)return m
l=A.b([],t.nn)
for(s=J.F(r);s.n();){q=s.gp()
if(typeof q=="number")p=q
else if(typeof q=="string")p=A.P(q)
else if(A.H(q))p=q?1:0
else p=m
l.push(p==null?m:p)}if(B.a.v(l,m))return m
s=l.length
p=s>=1
o=p?l[0]:m
if(!p)throw A.e(A.cl("Pattern matching error"))
A:{if(1===s){o.toString
l=A.b([o,o,o,o],t.n)
break A}if(2===s){o.toString
if(1>=s)return A.a(l,1)
l=l[1]
l.toString
l=A.b([o,l,o,l],t.n)
break A}if(3===s){o.toString
if(1>=s)return A.a(l,1)
p=l[1]
p.toString
if(2>=s)return A.a(l,2)
l=l[2]
l.toString
p=A.b([o,p,l,p],t.n)
l=p
break A}o.toString
if(1>=s)return A.a(l,1)
p=l[1]
p.toString
if(2>=s)return A.a(l,2)
n=l[2]
n.toString
if(3>=s)return A.a(l,3)
l=l[3]
l.toString
l=A.b([o,p,n,l],t.n)
break A}return l},
K(a,b){var s,r,q=A.w(b)
if(a==null)return q
s=A.w(a)
if(typeof b=="string"&&A.aO(b)!=null){r=t.f.b(a)?a.h(0,"default"):null
return new A.kT(s,A.aO(r)!=null?r:null,q)}return new A.kU(s,q)},
wb(a){var s,r,q="viewport-y",p=new A.kN(a),o=a.h(0,"symbol-z-order")
if(o==null)o="auto"
s=J.ao(o)
r=!s.D(o,q)&&a.h(0,"symbol-sort-key")!=null
if(!s.D(o,q))s=s.D(o,"auto")&&!r
else s=!0
if(s)p=p.$2("text-overlap","text-allow-overlap")||p.$2("icon-overlap","icon-allow-overlap")||J.m(a.h(0,"text-ignore-placement"),!0)||J.m(a.h(0,"icon-ignore-placement"),!0)
else p=!1
return p},
kP(a,b){var s,r=a.h(0,b+"-overlap")
A:{if(typeof r=="string"){s=r
break A}s=J.m(a.h(0,b+"-allow-overlap"),!0)?"always":"never"
break A}return s},
w7(a,b){var s,r,q,p,o,n,m=t.j,l=null,k=!1,j=!1
if(m.b(a)){s=J.o(a)
if(s.gk(a)===2){k="literal"===s.h(a,0)
if(k){l=s.h(a,1)
j=m.b(l)}}}if(j){j=k?l:J.al(a,1)
t.W.a(j)
r=j}else r=a
if(m.b(r)&&J.V(r)>=2){q=A.b([],t.s)
p=A.b([],t.G)
for(j=J.o(r),o=0;s=o+1,s<j.gk(r);o+=2){n=j.h(r,o)
if(typeof n=="string"){B.a.j(q,n)
B.a.j(p,A.pE(j.h(r,s)))}}if(q.length!==0)return new A.f(q,p)}if(m.b(b)){m=J.qy(b,t.N)
m=A.X(m,m.$ti.i("i.E"))}else m=B.ad
return new A.f(m,null)},
rr(a){var s
if(a!=null)if(t.j.b(a)){s=J.o(a)
s=s.gk(a)===2&&s.ad(a,new A.kO())}else s=!1
else s=!0
return s},
pE(a){var s,r,q=t.j
if(q.b(a)){s=J.o(a)
s=s.gk(a)===2&&J.m(s.h(a,0),"literal")}else s=!1
r=s?J.al(a,1):a
if(!q.b(r)||J.V(r)!==2)return B.dn
q=J.o(r)
s=A.E(q.h(r,0))
if(s==null)s=0
q=A.E(q.h(r,1))
return new A.f(s,q==null?0:q)},
rq(a,b){var s,r
if(t.j.b(a)){s=J.o(a)
s=s.gJ(a)&&s.ad(a,new A.kJ())}else s=!1
if(s){s=A.b([],t.V)
for(r=J.F(a);r.n();)s.push(A.w(r.gp()))
return s}return A.b([A.w(a==null?b:a)],t.V)},
rs(a,b){var s,r,q,p,o=t.j.b(a)?a:[a],n=t.n,m=A.b([],n)
for(s=J.F(o);s.n();){r=s.gp()
if(typeof r=="number")q=r
else if(typeof r=="string"){p=A.P(r)
q=p}else{if(A.H(r))p=r?1:0
else p=null
q=p}if(q!=null)m.push(q)}return m.length===0?A.b([b],n):m},
wa(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=A.b([],t.lN),e=null,d=!1
if(t.f.b(a)){s=a.h(0,"stops")
if(s==null)r=a.M("stops")
else r=!0
if(r)if(t.j.b(s)){d=a.h(0,"property")==null
e=s}}if(d)for(d=J.F(e),r=t.j;d.n();){q=d.gp()
if(r.b(q)&&J.V(q)===2){p=J.o(q)
B.a.j(f,new A.f(p.h(q,0),p.h(q,1)))}}else{d=t.j
r=!1
if(d.b(a)){p=J.o(a)
if(p.gk(a)>=3)if("step"===p.h(a,0)){o=p.h(a,1)
if(d.b(o)){t.W.a(o)
d=J.o(o)
if(d.gk(o)===1)d="zoom"===d.h(o,0)
else d=r}else d=r}else d=r
else d=r}else d=r
if(d){d=J.o(a)
n=d.h(a,2)
m=d.a_(a,3)
B.a.j(f,new A.f(-1/0,n))
for(l=0;d=l+1,r=m.length,d<r;l+=2){if(!(l<r))return A.a(m,l)
B.a.j(f,new A.f(m[l],m[d]))}}else return B.E}k=A.b([],t.bU)
for(d=f.length,j=0;j<f.length;f.length===d||(0,A.h)(f),++j){r=f[j]
i=r.a
if(typeof i=="number")p=i==1/0||i==-1/0
else p=!1
if(p)h=i
else{if(typeof i=="number")p=i
else if(typeof i=="string")p=A.P(i)
else if(A.H(i))p=i?1:0
else p=null
h=p==null?null:p}g=A.kK(r.b)
if(h==null||g==null)return B.E
B.a.j(k,new A.f(h,g))}return k},
w9(a){var s=A.b([],t.w)
new A.kL(s).$1(a)
return s},
wd(a,b){var s,r,q=a.length,p=b.length
if(q!==p)return!1
for(s=0;s<q;++s){r=a[s]
if(!(s<p))return A.a(b,s)
if(r!==b[s])return!1}return!0},
kK(a){var s,r,q,p,o,n,m,l=null,k=t.j
if(k.b(a)){s=J.o(a)
s=s.gk(a)===2&&J.m(s.h(a,0),"literal")}else s=!1
r=s?J.al(a,1):a
if(!k.b(r)||J.V(r)<2)return l
k=J.o(r)
s=k.gk(r)
q=new Float64Array(s)
for(p=0,o=0;o<s;++o){n=k.h(r,o)
if(!(typeof n=="number"))if(typeof n=="string"){m=A.P(n)
n=m}else{if(A.H(n))m=n?1:0
else m=l
n=m}if(n==null||n<0)return l
if(!(o<s))return A.a(q,o)
q[o]=n
if((o&1)===1)p+=n}return p<=0?l:q},
wc(a){var s,r,q,p,o,n,m
A:{s=t.j
r=s.b(a)
q=null
p=!1
o=!1
if(r){n=J.o(a)
if(n.gk(a)===2){p="literal"===n.h(a,0)
if(p){q=n.h(a,1)
s=s.b(q)}else s=o}else s=o}else s=o
if(s){s=p?q:J.al(a,1)
t.W.a(s)
break A}if(r){s=a
break A}s=B.D
break A}r=A.b([],t.s)
for(s=J.F(s);s.n();){m=s.gp()
if(typeof m=="string")r.push(m)}return r},
wf(a){if(B.d.v(a,"black")||B.d.v(a,"heavy"))return 900
if(B.d.v(a,"extrabold")||B.d.v(a,"extra bold"))return 800
if(B.d.v(a,"semibold")||B.d.v(a,"semi bold")||B.d.v(a,"demi"))return 600
if(B.d.v(a,"bold"))return 700
if(B.d.v(a,"medium"))return 500
if(B.d.v(a,"light"))return 300
if(B.d.v(a,"thin"))return 100
return 400},
m1:function m1(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
ft:function ft(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
hI:function hI(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k
_.Q=l
_.as=m
_.at=n
_.ax=o
_.ay=p
_.ch=-1
_.CW=null},
kS:function kS(a,b){this.a=a
this.b=b},
kH:function kH(a){this.a=a},
kG:function kG(a,b){this.a=a
this.b=b},
kE:function kE(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
kF:function kF(){},
kI:function kI(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k
_.Q=l
_.as=m
_.at=n
_.ax=o
_.ay=p},
kR:function kR(a,b){this.a=a
this.b=b},
kQ:function kQ(a,b,c){this.a=a
this.b=b
this.c=c},
kT:function kT(a,b,c){this.a=a
this.b=b
this.c=c},
kU:function kU(a,b){this.a=a
this.b=b},
kN:function kN(a){this.a=a},
kO:function kO(){},
kJ:function kJ(){},
kL:function kL(a){this.a=a},
kM:function kM(a){this.a=a},
uV(a){var s,r,q,p,o=t.f.b(a)?a:B.af,n=new A.A(B.e,B.e),m=o.h(0,"position"),l=A.w(m==null?A.b([1.15,210,30],t.g2):m).$1(n)
m=o.h(0,"intensity")
m=A.E(A.w(m==null?0.5:m).$1(n))
if(m==null)m=0.5
s=o.h(0,"color")
A.aO(A.w(s==null?"#ffffff":s).$1(n))
if(t.j.b(l)&&J.V(l)===3){s=A.b([],t.n)
for(r=J.F(l);r.n();){q=r.gp()
if(typeof q=="number")p=q
else if(typeof q=="string")p=A.P(q)
else if(A.H(q))p=q?1:0
else p=null
s.push(p==null?0:p)}}J.m(o.h(0,"anchor"),"map")
return new A.jo(m)},
qD(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r){return new A.di(i,q,a,b,c,d,e,g,o,n,h,l,j,k,m,p,f,r)},
r5(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1){return new A.dF(q,d,f,j,k,b,m,l)},
vd(a,b,c){var s,r,q,p,o=a==null?B.d4:a,n=t.n,m=A.b([],n)
if(t.j.b(o)){s=J.o(o)
s=s.gk(o)>4&&J.m(s.h(o,0),"interpolate")&&B.h.ak(s.h(o,1),null)==='["linear"]'&&B.h.ak(s.h(o,2),null)==='["heatmap-density"]'}else s=!1
if(s)for(s=J.o(o),r=3;r+1<s.gk(o);r+=2){q=s.h(o,r)
if(!(typeof q=="number"))if(typeof q=="string"){p=A.P(q)
q=p}else{if(A.H(q))p=q?1:0
else p=null
q=p}if(q!=null)B.a.j(m,B.c.E(q,0,1))}if(m.length<2){B.a.a2(m)
n=A.b([],n)
for(r=0;r<=8;++r)n.push(r/8)
B.a.A(m,n)}A.w(o)
return new A.jL()},
wi(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=B.h.ak(a,null),b=a.h(0,"source")
b.toString
A.D(b)
s=a.h(0,"sourceLayer")
s.toString
A.W(s)
r=A.os(a.h(0,"filter"))
q=a.h(0,"text")
A:{if(q==null){p=new A.kZ()
break A}p=A.tr(q)
break A}o=a.h(0,"icon")
B:{if(o==null){n=null
break B}n=A.yu(o)
break B}m=A.w(a.h(0,"placement"))
l=a.h(0,"spacing")
l.toString
A.ai(l)
k=J.m(a.h(0,"textUpright"),!0)
j=J.m(a.h(0,"iconUpright"),!0)
i=a.h(0,"minZoom")
i.toString
A.ai(i)
h=a.h(0,"maxZoom")
h.toString
A.ai(h)
g=a.h(0,"sortKey")
C:{if(g==null){f=null
break C}f=A.w(g)
break C}e=a.h(0,"iconRotate")
e=A.w(e==null?0:e)
d=a.h(0,"paintKeys")
d.toString
return new A.kY(c,b,s,r,p,n,m,l,k,j,i,h,f,e,J.cw(t.j.a(d),t.N))},
f_(a){var s,r,q=a.h(0,"bounds"),p=A.E(a.h(0,"minzoom"))
p=p==null?null:B.c.S(p)
if(p==null)p=0
if(t.j.b(q)){s=J.o(q)
s=s.gk(q)===4&&s.ad(q,new A.lg())}else s=!1
if(s){s=A.b([],t.n)
for(r=J.F(q);r.n();)s.push(A.ai(r.gp()))}else s=null
return new A.lf(p,s,J.m(a.h(0,"scheme"),"tms"))},
ru(a){var s=A.wg(t.f.b(a)?a.h(0,"type"):null)
return s==null||s.length===0||B.a.ad(s,new A.kW())?B.f0:new A.hK(s)},
kV(a){var s
A:{if("mercator"===a){s=0
break A}if("vertical-perspective"===a){s=1
break A}s=null
break A}return s},
wg(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=null,d=J.ao(a)
if(d.D(a,"globe"))return B.cX
s=A.kV(a)
if(s!=null)return A.b([new A.f(0,s)],t.G)
r=t.j
q=r.b(a)
p=!1
if(q)if(d.gk(a)>=3)if("interpolate"===d.h(a,0)){o=d.h(a,2)
if(r.b(o)){t.W.a(o)
n=J.o(o)
if(n.gk(o)===1)p="zoom"===n.h(o,0)}}if(p){m=d.a_(a,3)
l=A.b([],t.G)
for(k=0;d=k+1,r=m.length,d<r;k+=2){if(!(k<r))return A.a(m,k)
j=m[k]
i=A.kV(m[d])
if(typeof j!="number"||i==null)return e
B.a.j(l,new A.f(j,i))}return l}p=!1
if(q)if(d.gk(a)>=3)if("step"===d.h(a,0)){h=d.h(a,1)
if(r.b(h)){t.W.a(h)
r=J.o(h)
if(r.gk(h)===1)r="zoom"===r.h(h,0)
else r=p}else r=p}else r=p
else r=p
else r=p
if(r){g=d.h(a,2)
m=d.a_(a,3)
f=A.kV(g)
if(f==null)return e
l=A.b([new A.f(-1/0,f)],t.G)
for(k=0;d=k+1,r=m.length,d<r;k+=2){if(!(k<r))return A.a(m,k)
j=m[k]
i=A.kV(m[d])
if(typeof j!="number"||i==null)return e
B.a.j(l,new A.f(j-1e-9,B.a.gN(l).b))
B.a.j(l,new A.f(j,i))}return l}return e},
yE(a){var s,r
A:{s=!1
if(typeof a=="number"){if(isFinite(a))s=a===(a<0?Math.ceil(a):Math.floor(a))
r=a}else r=null
if(s){s=B.b.q(J.qw(r))
break A}s=A.v(a)
break A}return s},
cx:function cx(a,b){this.a=a
this.b=b},
jl:function jl(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
jo:function jo(a){this.a=a},
ep:function ep(a,b){this.b=a
this.d=b},
di:function di(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k
_.Q=l
_.as=m
_.at=n
_.ax=o
_.ay=p
_.ch=q
_.CW=r
_.cx=30
_.cy=0},
dv:function dv(a,b){this.a=a
this.b=b},
bo:function bo(){},
hl:function hl(){},
bm:function bm(a,b,c,d,e,f,g){var _=this
_.cx=a
_.db=b
_.dx=c
_.a=d
_.b=e
_.c=f
_.d=g},
dF:function dF(a,b,c,d,e,f,g,h){var _=this
_.cy=a
_.dy=b
_.fx=c
_.id=d
_.a=e
_.b=f
_.c=g
_.d=h},
dn:function dn(a,b,c,d,e,f,g){var _=this
_.db=a
_.dx=b
_.dy=c
_.a=d
_.b=e
_.c=f
_.d=g},
cI:function cI(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jL:function jL(){},
kY:function kY(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k
_.Q=l
_.as=m
_.at=n
_.ax=o},
kZ:function kZ(){},
hM:function hM(a,b,c,d,e,f,g,h,i,j,k,l){var _=this
_.a=a
_.b=b
_.c=c
_.w=d
_.y=e
_.z=f
_.at=g
_.ax=h
_.ay=i
_.k1=j
_.k2=k
_.cA=l},
lf:function lf(a,b,c){this.a=a
this.b=b
this.c=c},
lg:function lg(){},
lh:function lh(a){this.a=a},
li:function li(a){this.a=a},
dP:function dP(){},
ca:function ca(a,b,c,d,e,f,g){var _=this
_.e=a
_.f=b
_.r=c
_.w=d
_.x=e
_.b=f
_.c=g},
dM:function dM(a,b,c,d){var _=this
_.r=a
_.w=b
_.b=c
_.c=d},
fH:function fH(){},
cm:function cm(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
pC:function pC(){},
hK:function hK(a){this.a=a},
kW:function kW(){},
kX:function kX(a,b,c,d,e,f,g,h,i){var _=this
_.d=a
_.f=b
_.ay=c
_.ch=d
_.CW=e
_.cx=f
_.db=g
_.fr=h
_.fx=i},
wh(a){var s
t.H.a(a)
s=J.o(a)
return s.h(a,1)<-32767.5||s.h(a,1)>32766.5},
tt(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i=t.n,h=A.b([],i),g=A.b([],i),f=new A.oA(d,g)
for(i=a.length,s=b;s<c;++s){r=s*2
if(!(r<i))return A.a(a,r)
q=a[r]
p=r+1
if(!(p<i))return A.a(a,p)
o=a[p]
if(s>b){p=r-2
if(!(p>=0&&p<i))return A.a(a,p)
n=a[p];--r
if(!(r>=0&&r<i))return A.a(a,r)
m=a[r]
B.a.a2(g)
f.$2(n,q)
f.$2(m,o)
B.a.aQ(g)
for(r=g.length,p=q-n,l=o-m,k=0;k<g.length;g.length===r||(0,A.h)(g),++k){j=g[k]
B.a.j(h,n+p*j)
B.a.j(h,m+l*j)}}B.a.j(h,q)
B.a.j(h,o)}return new Float64Array(A.R(h))},
hL:function hL(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
oA:function oA(a,b){this.a=a
this.b=b},
rC(a,b,c){var s=new Float32Array(0),r=new Float32Array(0),q=new Float32Array(2048),p=new Float32Array(0),o=new Uint8Array(0),n=new Uint16Array(4096)
return new A.lA(a,b,c,s,r,q,p,o,n,new Uint16Array(0),A.b([],t.bw))},
qN(a,b,c){var s,r,q,p,o,n,m,l=new A.jr(c,b),k=t.n,j=A.b([],k),i=a.length/2|0
for(s=0;s<i;){r=s*2
q=a.length
if(!(r<q))return A.a(a,r)
p=a[r];++r
if(!(r<q))return A.a(a,r)
o=a[r];++s
r=s%i*2
if(!(r<q))return A.a(a,r)
n=a[r];++r
if(!(r<q))return A.a(a,r)
m=a[r]
if(l.$1(o))B.a.A(j,A.b([p,o],k))
if(!J.m(l.$1(o),l.$1(m)))B.a.A(j,A.b([p+(n-p)*((b-o)/(m-o)),b],k))}return j},
r6(a,b,c,d){var s=c-a,r=d-b,q=Math.sqrt(s*s+r*r)
return new A.f(-r/q,s/q)},
cL:function cL(a,b){this.a=a
this.b=b},
dE:function dE(a,b){this.a=a
this.b=b},
aZ:function aZ(a,b){this.a=a
this.b=b},
eE:function eE(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
lA:function lA(a,b,c,d,e,f,g,h,i,j,k){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.as=_.Q=_.z=0
_.at=k},
jq:function jq(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jr:function jr(a,b){this.a=a
this.b=b},
jY:function jY(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.f=_.e=_.d=0
_.r=null
_.w=0
_.z=2
_.Q=1.05
_.at=d
_.ay=_.ax=-1},
wk(a,b){var s,r=a.b.as
if(r==null)return 50
s=r.$1(b)
return typeof s=="number"?B.b.E(B.c.Y(s),0,4095):50},
tB(a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=A.b([],t.k9),c=t.N,b=t.S,a=A.C(c,b),a0=A.C(c,b),a1=new A.oS()
for(c=J.F(a2),b=t.Y;c.n();){s=c.gp()
r=A.b([B.a.gu(s.x)],b)
q=s.c
p=a1.$3$end(q,B.a.gu(r),!1)
o=a1.$3$end(q,B.a.gN(r),!0)
n=a0.h(0,p)
m=a.h(0,o)
l=n!=null
if(l&&m!=null&&n!==m){s=d.length
if(n>>>0!==n||n>=s)return A.a(d,n)
l=d[n]
l.toString
if(m>>>0!==m||m>=s)return A.a(d,m)
s=d[m]
s.toString
l=l.b
B.a.A(l,r)
B.a.A(l,s.b)
B.a.m(d,m,null)
a0.aA(0,p)
a.aA(0,o)
a0.m(0,a1.$3$end(q,B.a.gN(l),!0),n)}else if(l){if(n>>>0!==n||n>=d.length)return A.a(d,n)
B.a.A(d[n].b,r)
a0.aA(0,p)
a0.m(0,o,n)}else if(m!=null){if(m>>>0!==m||m>=d.length)return A.a(d,m)
B.a.cD(d[m].b,0,r)
a.aA(0,o)
a.m(0,p,m)}else{B.a.j(d,new A.f(s,r))
a.m(0,p,d.length-1)
a0.m(0,o,d.length-1)}}c=A.b([],t.gw)
for(s=d.length,q=t.A,l=t.iu,k=0;k<d.length;d.length===s||(0,A.h)(d),++k){j=d[k]
if(q.b(j)){i=j.a
h=A.b([A.xN(l.a(j.b))],b)
g=i.x
f=A.M(g)
e=new A.bL(g,1,null,f.i("bL<1>"))
e.d1(g,1,null,f.c)
B.a.A(h,e)
i.siH(h)
c.push(i)}}return c},
xN(a){var s,r,q,p,o,n=J.o(a)
if(n.gk(a)===1)return n.gu(a)
s=A.X(n.gu(a),t.i)
for(n=n.U(a,1),r=n.$ti,n=new A.a2(n,n.gk(0),r.i("a2<a1.E>")),r=r.i("a1.E");n.n();){q=n.d
if(q==null)q=r.a(q)
p=A.a4(q)
o=new A.bL(q,2,null,p.i("bL<y.E>"))
o.d1(q,2,null,p.i("y.E"))
B.a.A(s,o)}return new Float32Array(A.R(s))},
tq(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=4096,f={},e=new A.or(),d=A.b([],t.Y)
f.a=null
s=new A.oq(f,d)
for(r=a.length,q=t.n,p=2;p<r;p+=2){o=a[p-2]
n=a[p-1]
m=a[p]
l=p+1
if(!(l<r))return A.a(a,l)
k=a[l]
l=o<0
if(l&&m<0)continue
if(l){n=e.$1(n+(k-n)*((0-o)/(m-o)))
o=0}else if(m<0){k=e.$1(n+(k-n)*((0-o)/(m-o)))
m=0}if(typeof n!=="number")return n.br()
l=n<0
if(l){if(typeof k!=="number")return k.br()
j=k<0}else j=!1
if(j)continue
if(l){if(typeof k!=="number")return k.aC()
o=e.$1(o+(m-o)*((0-n)/(k-n)))
n=0}else{if(typeof k!=="number")return k.br()
if(k<0){m=e.$1(o+(m-o)*((0-n)/(k-n)))
k=0}}if(typeof o!=="number")return o.b1()
l=o>=4096
if(l){if(typeof m!=="number")return m.b1()
j=m>=4096}else j=!1
if(j)continue
if(l){if(typeof m!=="number")return m.aC()
n=e.$1(n+(k-n)*((4096-o)/(m-o)))
o=g}else{if(typeof m!=="number")return m.b1()
if(m>=4096){k=e.$1(n+(k-n)*((4096-o)/(m-o)))
m=g}}if(typeof n!=="number")return n.b1()
l=n>=4096
if(l){if(typeof k!=="number")return k.b1()
j=k>=4096}else j=!1
if(j)continue
if(l){if(typeof k!=="number")return k.aC()
o=e.$1(o+(m-o)*((4096-n)/(k-n)))
n=g}else{if(typeof k!=="number")return k.b1()
if(k>=4096){m=e.$1(o+(m-o)*((4096-n)/(k-n)))
k=g}}i=f.a
l=!0
if(i!=null){j=i.length
h=j-2
if(!(h>=0))return A.a(i,h)
if(i[h]===o){l=j-1
if(!(l>=0))return A.a(i,l)
l=i[l]!==n}}if(l){s.$0()
l=f.a=A.b([o,n],q)}else l=i
B.a.A(l,A.b([m,k],q))}s.$0()
return d},
mX(a){var s,r,q,p,o,n
for(s=a.length,r=0,q=2;q<s;q+=2){p=a[q]-a[q-2]
o=q+1
if(!(o<s))return A.a(a,o)
n=a[o]-a[q-1]
r+=Math.sqrt(p*p+n*n)}return r},
tA(a,b,c,d,e,f,g){var s,r,q,p=a.length
if(0>=p)return A.a(a,0)
s=a[0]
r=!0
if(s!==0)if(s!==4096){if(1>=p)return A.a(a,1)
p=a[1]
p=p===0||p===4096
r=p}p=b/4
if(b-c<p)b=c+p
q=A.oe(a,r?B.c.T(b/2*g,b):B.c.T((c/2+d)*g,b),b,c,e,f)
if(q.length===0&&!r)return A.oe(a,A.mX(a)/2,b,c,e,f)
return q},
oe(a4,a5,a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a7/2,a=A.mX(a4),a0=A.b([],t.eN),a1=isFinite(a6),a2=a1?a5-a6:a5,a3=a1?a6:0
a1=!a1
s=a8!==0
r=a4.length
q=0
p=!1
o=2
for(;;){if(!(o<r&&!p))break
n=o-2
if(!(n<r))return A.a(a4,n)
m=a4[n]
n=o-1
if(!(n<r))return A.a(a4,n)
l=a4[n]
if(!(o<r))return A.a(a4,o)
k=a4[o]
n=o+1
if(!(n<r))return A.a(a4,n)
j=k-m
n=a4[n]-l
i=Math.sqrt(j*j+n*n)
for(h=q+i;g=a2+a3,g<h;a2=g){f=(g-q)/i
e=B.c.a1(m+j*f)
d=B.c.a1(l+n*f)
c=!1
if(e>=0)if(e<4096)if(d>=0)if(d<4096)if(g-b>=0)if(g+b<=a)c=!s||A.x9(a4,B.b.F(o,2)-1,e,d,a7,a8,a9)
if(c)B.a.j(a0,new A.aS(e,d,Math.atan2(n,j)))
if(a1){a2=g
p=!0
break}}o+=2
q=h}return a0},
x9(a,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
if(a3===0)return!0
s=new A.ml(a)
r=new A.mm(a)
q=new A.mk()
p=a0+1
for(o=-a3/2,n=a2,m=a1,l=0;l>o;){--p
if(p<0)return!1
k=q.$4(s.$1(p),r.$1(p),m,n)
if(typeof k!=="number")return A.ah(k)
l-=k
m=s.$1(p)
n=r.$1(p)}j=p+1
o=q.$4(s.$1(p),r.$1(p),s.$1(j),r.$1(j))
if(typeof o!=="number")return A.ah(o)
l+=o
i=A.b([],t.G)
h=a.length/2|0
for(o=a3/2,p=j,g=0;l<o;p=j){j=p+1
if(j>=h)return!1
k=r.$1(p)
f=p-1
e=r.$1(f)
if(typeof k!=="number")return k.aC()
if(typeof e!=="number")return A.ah(e)
d=s.$1(p)
f=s.$1(f)
if(typeof d!=="number")return d.aC()
if(typeof f!=="number")return A.ah(f)
c=Math.atan2(k-e,d-f)
f=r.$1(j)
d=r.$1(p)
if(typeof f!=="number")return f.aC()
if(typeof d!=="number")return A.ah(d)
e=s.$1(j)
k=s.$1(p)
if(typeof e!=="number")return e.aC()
if(typeof k!=="number")return A.ah(k)
b=Math.abs(B.c.T(c-Math.atan2(f-d,e-k)+9.42477796076938,6.283185307179586)-3.141592653589793)
B.a.j(i,new A.f(l,b))
g+=b
while(l-B.a.gu(i).a>a4)g-=B.a.aM(i,0).b
if(g>a5)return!1
k=q.$4(s.$1(p),r.$1(p),s.$1(j),r.$1(j))
if(typeof k!=="number")return A.ah(k)
l+=k}return!0},
dj:function dj(a,b,c){this.a=a
this.b=b
this.c=c},
b5:function b5(a,b,c,d,e,f,g,h,i,j){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=""
_.as=_.Q=null},
dk:function dk(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
aR:function aR(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
l0:function l0(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=!1
_.x=h
_.y=i
_.z=j
_.Q=k
_.as=l
_.at=m
_.ax=n
_.ay=o
_.ch=p
_.CW=1
_.cx=q},
lb:function lb(a,b){this.a=a
this.b=b},
ld:function ld(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
lc:function lc(a,b,c){this.a=a
this.b=b
this.c=c},
le:function le(a,b,c){this.a=a
this.b=b
this.c=c},
l7:function l7(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
l6:function l6(a,b){this.a=a
this.b=b},
l8:function l8(a,b,c,d,e,f,g,h,i,j){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j},
l9:function l9(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
la:function la(){},
l2:function l2(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
l3:function l3(a){this.a=a},
l1:function l1(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
l5:function l5(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
l4:function l4(a,b,c){this.a=a
this.b=b
this.c=c},
cP:function cP(a,b,c,d,e,f,g,h,i,j){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j},
oS:function oS(){},
or:function or(){},
oq:function oq(a,b){this.a=a
this.b=b},
ml:function ml(a){this.a=a},
mm:function mm(a){this.a=a},
mk:function mk(){},
aY:function aY(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
zg(b6,b7,b8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4=B.b.a8(1,b8.a-b7.a),b5=A.b([],t.e)
for(s=J.F(b6),r=t.n,q=t.b,p=t.i,o=t.t,n=b8.b-b7.b*b4,m=b8.c-b7.c*b4,l=t.d;s.n();){k=s.gp()
j=k.gaV()
i=n*j
h=m*j
g=Math.max(128,B.c.Y(128*j/4096))
f=A.b([],l)
e=new Float64Array(4096)
d=A.b([],o)
c=new A.et(e,d)
for(e=k.gaL(),b=e.length,a=-g,a0=j+g,a1=0;a1<e.length;e.length===b||(0,A.h)(e),++a1){a2=e[a1]
c.b=0
B.a.a2(d)
a2.aZ(c)
a3=A.b([],q)
for(a4=0;a4<d.length-1;){a5=A.b([],r)
if(!(a4<d.length))return A.a(d,a4)
a6=d[a4];++a4
for(;;){if(!(a4<d.length))return A.a(d,a4)
if(!(a6<d[a4]))break
a7=c.a
a8=a6*2
a9=a7.length
if(!(a8<a9))return A.a(a7,a8)
b0=a7[a8];++a8
if(!(a8<a9))return A.a(a7,a8)
B.a.A(a5,A.b([b0*b4-i,a7[a8]*b4-h],r));++a6}a3.push(a5)}b1=a2.gL()
if(b1===3){a5=A.b([],q)
for(a7=a3.length,b2=0;b2<a3.length;a3.length===a7||(0,A.h)(a3),++b2){a4=a3[b2]
if(a4.length>=2){a8=A.X(a4,p)
if(0>=a4.length)return A.a(a4,0)
a8.push(a4[0])
if(1>=a4.length)return A.a(a4,1)
a8.push(a4[1])
a5.push(a8)}}b3=a5}else b3=a3
b3=A.t0(A.t0(b3,b1,a,a0,0),b1,a,a0,1)
if(b3.length===0)continue
B.a.j(f,new A.ix(b1,a2.aK(k),A.xn(b3,b1)))}if(f.length!==0)B.a.j(b5,new A.iy(k.gal(),j,f))}return b5},
xn(a,b){var s,r,q,p,o=A.b([],t.b)
for(s=a.length,r=b===3,q=0;q<a.length;a.length===s||(0,A.h)(a),++q){p=a[q]
o.push(r?B.a.I(p,0,p.length-2):p)}return o},
t0(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=A.b([],t.b)
if(a4===1){for(s=a3.length,r=t.n,q=0;q<a3.length;a3.length===s||(0,A.h)(a3),++q){p=a3[q]
for(o=0;n=p.length,o<n;o+=2){m=o+a7
if(!(m<n))return A.a(p,m)
l=p[m]
if(l>=a5&&l<=a6){m=p[o]
k=o+1
if(!(k<n))return A.a(p,k)
B.a.j(a2,A.b([m,p[k]],r))}}}return a2}if(a4!==2&&a4!==3)return a2
j=a4===3
for(s=a3.length,r=!j,n=t.n,q=0;q<a3.length;a3.length===s||(0,A.h)(a3),++q){i=a3[q]
h={}
g=B.b.F(i.length,2)
if(g===0)continue
h.a=A.b([],n)
f=new A.mq(h,i,a7)
for(m=g-1,o=0;o<m;++o){k=o*2
e=k+a7
d=i.length
if(!(e<d))return A.a(i,e)
c=i[e]
e=k+2+a7
if(!(e<d))return A.a(i,e)
b=i[e]
if(c<a5){if(b>a5)f.$3(o,o+1,a5)}else if(c>a6){if(b<a6)f.$3(o,o+1,a6)}else{e=h.a
if(!(k<d))return A.a(i,k)
a=i[k];++k
if(!(k<d))return A.a(i,k)
B.a.A(e,A.b([a,i[k]],n))}a0=b<a5&&c>=a5
if(a0)f.$3(o,o+1,a5)
if(b>a6&&c<=a6){f.$3(o,o+1,a6)
a0=!0}if(r&&a0){B.a.j(a2,h.a)
h.a=A.b([],n)}}m*=2
k=m+a7
e=i.length
if(!(k>=0&&k<e))return A.a(i,k)
a1=i[k]
if(a1>=a5&&a1<=a6){k=h.a
if(!(m>=0&&m<e))return A.a(i,m)
d=i[m];++m
if(!(m<e))return A.a(i,m)
B.a.A(k,A.b([d,i[m]],n))}m=!1
if(j){k=h.a
e=k.length
if(e!==0){if(0>=e)return A.a(k,0)
m=k[0]
d=e-2
if(!(d>=0))return A.a(k,d)
if(m===k[d]){if(1>=e)return A.a(k,1)
m=k[1]!==k[e-1]}else m=!0}}if(m){m=h.a
k=m.length
if(0>=k)return A.a(m,0)
e=m[0]
if(1>=k)return A.a(m,1)
B.a.A(m,A.b([e,m[1]],n))}m=h.a
if(m.length!==0)B.a.j(a2,m)}return a2},
mq:function mq(a,b,c){this.a=a
this.b=b
this.c=c},
iy:function iy(a,b,c){this.a=a
this.b=b
this.c=c},
ix:function ix(a,b,c){this.a=a
this.b=b
this.c=c},
lk:function lk(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
ll:function ll(){},
lm:function lm(){},
aV:function aV(a){this.a=a
this.b=0},
jO:function jO(a){this.a=a
this.b=0},
iK(a,b,c){return A.zt(a,b,c)},
zt(c5,c6,c7){var s=0,r=A.aC(t.o),q,p=2,o=[],n=[],m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4
var $async$iK=A.aD(function(c8,c9){if(c8===1){o.push(c9)
s=p}for(;;)switch(s){case 0:c3={}
c4=c5.length
if(0>=c4){q=A.a(c5,0)
s=1
break}j=c5[0]
j.toString
A.W(j)
if(1>=c4){q=A.a(c5,1)
s=1
break}i=A.dY(c5[1])
if(2>=c4){q=A.a(c5,2)
s=1
break}h=c5[2]
h.toString
A.W(h)
if(3>=c4){q=A.a(c5,3)
s=1
break}c4=c5[3]
c4.toString
g=t.f
f=t.N
c4=g.a(c4).bf(0,f,f)
if(4>=c5.length){q=A.a(c5,4)
s=1
break}e=c5[4]
e.toString
d=t.O
e=g.a(e).bf(0,f,d)
if(5>=c5.length){q=A.a(c5,5)
s=1
break}c=t.lH
b=c.a(c5[5])
b=b==null?null:J.cw(b,f)
a=c5.length
if(6>=a){q=A.a(c5,6)
s=1
break}a0=c5[6]
a0.toString
A.ai(a0)
if(7>=a){q=A.a(c5,7)
s=1
break}a1=c5[7]
a1.toString
A.D(a1)
if(a>8){a=c.a(c5[8])
a=a==null?null:J.cw(a,t.p)}else a=null
if(c5.length>9){c=c.a(c5[9])
c=c==null?null:J.cw(c,f)}else c=null
a2=c5.length>10&&J.m(c5[10],!0)
a3=new A.eL()
a4=A.b([],t.jA)
a5=A.b([],t.o_)
a6=t.S
a7=A.b([],t.o9)
a8=A.b([],t.oW)
a9=A.b([],t.kv)
b0=A.b([],t.nv)
b1=A.b([],t.jQ)
b2=A.b([],t.n_)
b3=e.a
b4=e.$ti.i("4?")
b5=b4.a(b3.h(0,"sources"))
g=g.b(b5)?b5:B.w
b5=A.v(a0)
b3=A.ru(b4.a(b3.h(0,"projection"))).a.length!==0?b5+" globe":b5
b6=new A.hI(e,b,a0,g,a4,A.C(d,t.aV),a5,A.C(f,a6),a7,a8,a9,b0,b1,b2,new A.be(b3),A.C(a6,t.u)).hS()
b3=b6.cx
if(!(a1>=0&&a1<b3.length)){q=A.a(b3,a1)
s=1
break}b7=b3[a1]
b8=b6.fx
g=a==null
b9=g&&b8!=null?new A.jF(b8,h,c4,new A.p6(),A.b([],t.s),A.C(f,a6),A.b([],t.iE),A.bb(a6),A.bb(a6)):null
g=g?null:A.v0(a,c)
d=t.L
a4=new Float64Array(4096)
a5=t.t
a7=A.b([],a5)
a8=A.b([],a5)
a9=A.b([],a5)
c0=new A.l0(A.bb(a6),B.db,B.dc,b6,a1,g,b9,a2,A.C(f,d),A.C(f,d),new A.A(B.e,B.e),new A.et(a4,a7),a8,a9,new Float64Array(4096),A.b([],a5),A.C(f,t.i))
c0.eJ(b6,g,a2,b9,a1)
m=new A.p5(c6)
g=b6.fr
c1=g.length===0?null:A.p2(g,a3,c4).ex(new A.p7(c0),t.a)
c3.a=c3.b=null
if(b7 instanceof A.ca)c3.b=new A.p8(b7.e,new A.pe(b7),a3,new A.lv(a2,c,a,j,new A.lj(i,h,c4),e,b,a0,a1)).$0()
else if(b7 instanceof A.dM){h=A.yr(j)
g=new A.eL()
f=B.d.ap(j,"pmtiles://")
f=f?new A.kd(B.d.aq(j,10),c4,g,A.C(a6,t.je)):null
c3.a=new A.lk(j,b7.r,"tiles-"+h,g,".pbf",c4,f,i)}c2=b7.b
c3.c=c2==null?b7.gec():c2
l=new A.pc(c3,c0,new A.pb(c3,new A.pa(c3,A.C(a6,t.p)),b7),c1,b9,b6,a1)
c4=new A.d9(A.ct(c7,"stream",t.K),t.b6)
p=3
j=t.W,i=t.o
case 6:s=8
return A.a0(c4.n(),$async$iK)
case 8:if(!c9){s=7
break}k=c4.gp()
h=k
h.toString
l.$1(A.wm(j.a(h))).ex(new A.p9(m),i)
s=6
break
case 7:n.push(5)
s=4
break
case 3:n=[2]
case 4:p=2
s=9
return A.a0(c4.be(),$async$iK)
case 9:s=n.pop()
break
case 5:case 1:return A.aA(q,r)
case 2:return A.az(o.at(-1),r)}})
return A.aB($async$iK,r)},
tc(a){var s,r=A.b([],t.i9),q=a==null?B.F:a,p=q.length,o=0
for(;o<q.length;q.length===p||(0,A.h)(q),++o){s=q[o]
r.push(new A.fN(s.a,s.b,s.d))}return r},
p6:function p6(){},
p5:function p5(a){this.a=a},
p7:function p7(a){this.a=a},
pe:function pe(a){this.a=a},
p8:function p8(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
pa:function pa(a,b){this.a=a
this.b=b},
pb:function pb(a,b,c){this.a=a
this.b=b
this.c=c},
pc:function pc(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
pd:function pd(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
p9:function p9(a){this.a=a},
zd(){var s,r={},q=v.G
r.a=null
r=new A.p0(r,q)
if(typeof r=="function")A.t(A.aK("Attempting to rewrap a JS function.",null))
s=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.xc,r)
s[$.qh()]=r
q.onmessage=s},
p0:function p0(a,b){this.a=a
this.b=b},
p_:function p_(a){this.a=a},
cy(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.aw(b,c,B.b.aa(a.byteLength,s))
return J.qq(B.j.gam(a),a.byteOffset+b*s,(c-b)*s)},
bQ(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.aw(b,c,B.b.aa(a.byteLength,s))
return J.qr(B.j.gam(a),a.byteOffset+b*s,(c-b)*s)},
rz(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.aw(b,c,B.b.aa(a.byteLength,s))-b)*s
if(B.b.T(r,2)!==0)throw A.e(A.aK("The number of bytes to view must be a multiple of 2",null))
return J.ub(B.U.gam(a),a.byteOffset+b*s,B.b.F(r,2))},
js(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.aw(b,c,B.b.aa(a.byteLength,s))-b)*s
if(B.b.T(r,4)!==0)throw A.e(A.aK("The number of bytes to view must be a multiple of 4",null))
return J.pi(B.o.gam(a),a.byteOffset+b*s,B.b.F(r,4))},
bA(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.aw(b,c,B.b.aa(a.byteLength,s))-b)*s
if(B.b.T(r,8)!==0)throw A.e(A.aK("The number of bytes to view must be a multiple of 8",null))
return J.ua(B.q.gam(a),a.byteOffset+b*s,B.b.F(r,8))},
tG(a){return v.mangledGlobalNames[a]},
zr(a){throw A.ae(A.vl(a),new Error())},
j(){throw A.ae(A.vn(""),new Error())},
p4(){throw A.ae(A.vm(""),new Error())},
zj(a){return Math.sqrt(A.ai(a))},
zf(a){return Math.sin(A.ai(a))},
ts(a){return Math.cos(A.ai(a))},
zp(a){return Math.tan(a)},
yk(a){return Math.acos(a)},
yl(a){return Math.asin(a)},
yq(a){return Math.atan(A.ai(a))},
yY(a){return Math.log(A.ai(a))},
ap(a,b){var s,r,q,p,o=a.length,n=(o/3|0)-1
for(s=0;s<=n;){r=B.b.K(s+n,1)
q=r*3
if(!(q<o))return A.a(a,q)
if(b<a[q])n=r-1
else{p=q+1
if(!(p<o))return A.a(a,p)
if(b>a[p])s=r+1
else{p=q+2
if(!(p<o))return A.a(a,p)
return a[p]}}}return 0},
cX(a){return a},
wj(a){var s,r,q,p
for(s=a.length,r=0,q=0;q<4;++q){if(q<s){if(!(q<s))return A.a(a,q)
p=a.charCodeAt(q)}else p=32
r=(r<<8|p)>>>0}return r},
aJ(a){return A.dL(A.b([B.b.K(a,24)&255,B.b.K(a,16)&255,B.b.K(a,8)&255,a&255],t.t),0,null)},
xB(a){var s,r,q,p
for(s=0,r=86;s<=r;){q=B.b.K(s+r,1)
if(!(q<87))return A.a(B.a9,q)
p=B.a9[q]
if(a<p.a)r=q-1
else if(a>p.b)s=q+1
else return!0}return!1},
q8(a,b){var s
if(b===0)return 0
for(s=new A.cW(a);s.n();)if(A.xB(s.d))return 0
return b},
tI(a){var s=B.c.E(a,-85.0511,85.0511)*3.141592653589793/180
return(1-Math.log(Math.tan(s)+1/Math.cos(s))/3.141592653589793)/2},
qf(a){var s,r,q,p,o,n,m
if(!t.j.b(a))return null
s=A.b([],t.s)
for(r=J.qy(a,t.N),q=J.F(r.a),r=r.$ti,p=new A.cZ(q,r.i("cZ<1>")),r=r.c;p.n();){o=r.a(q.gp())
if(B.d.v(o,"{s}"))for(n=0;n<3;++n){m=B.cH[n]
s.push(A.p3(o,"{s}",m,0))}else s.push(o)}return s.length===0?null:B.a.ac(s," ")},
zs(a,b,c,d){var s,r,q,p,o,n=a.split(" "),m=n.length,l=B.b.T(c+d,m),k=A.b([],t.s)
for(s=""+d,r=""+c,q=""+b,p=0;p<m;++p){o=n[B.b.T(l+p,m)]
o=A.p3(o,"{z}",q,0)
o=A.p3(o,"{x}",r,0)
k.push(A.p3(o,"{y}",s,0))}return k},
oF(a,b,c,d,e,f){return A.yL(a,b,c,d,e,f)},
yL(a,b,c,d,e,f){var s=0,r=A.aC(t.l_),q,p=2,o=[],n,m,l,k,j,i,h,g
var $async$oF=A.aD(function(a0,a1){if(a0===1){o.push(a1)
s=p}for(;;)switch(s){case 0:i=A.zs(b,c,d,e)
h=0
case 3:n=J.m(h,J.V(i)-1)
p=6
s=9
return A.a0(a.bp(J.al(i,h),f),$async$oF)
case 9:m=a1
l=m.a
if(n||J.m(l,200)||J.m(l,204)||J.m(l,404)){k=new A.f(J.al(i,h),m)
q=k
s=1
break}p=2
s=8
break
case 6:p=5
g=o.pop()
if(n)throw g
s=8
break
case 5:s=2
break
case 8:k=h
if(typeof k!=="number"){q=k.bT()
s=1
break}h=k+1
s=3
break
case 4:case 1:return A.aA(q,r)
case 2:return A.az(o.at(-1),r)}})
return A.aB($async$oF,r)},
yr(a){var s,r,q,p
for(s=new A.dq(a),r=t.gS,s=new A.a2(s,s.gk(0),r.i("a2<y.E>")),r=r.i("y.E"),q=2166136261;s.n();){p=s.d
q=(q^(p==null?r.a(p):p))>>>0
q=q+(q<<1>>>0)+(q<<4>>>0)+(q<<7>>>0)+(q<<8>>>0)+(q<<24>>>0)>>>0}return B.b.bm(q,36)},
p2(a,b,c){return A.zi(a,b,c)},
zi(b5,b6,b7){var s=0,r=A.aC(t.a),q,p=2,o=[],n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4
var $async$p2=A.aD(function(b8,b9){if(b8===1){o.push(b9)
s=p}for(;;)A:switch(s){case 0:b3=A.C(t.N,t.aL)
c=b5.length,b=t.f,a=t.L,a0=0
case 3:if(!(a0<b5.length)){s=5
break}a1=b5[a0]
n=null
n=a1.a
a2=a1.b
a3=B.d.aF(a2,"?")
a1=a3<0
m=a1?a2:B.d.a9(a2,0,a3)
l=a1?"":B.d.aq(a2,a3)
a4=0
case 6:if(!(a4<2)){s=8
break}k=B.cz[a4]
p=10
s=13
return A.a0(b6.bp(A.v(m)+A.v(k)+".json"+A.v(l),b7),$async$p2)
case 13:j=b9
if(j.a!==200){s=7
break}a1=a.a(j.b)
i=b.a(B.h.eb(new A.fs(!1).c2(a1,0,null,!0),null))
for(a1=i.gai(),a1=a1.gt(a1);a1.n();){h=a1.gp()
g=null
f=null
e=h
g=e.a
f=e.b
if(!b.b(f))continue
a5=A.fw(f.h(0,"pixelRatio"))
d=a5==null?1:a5
a6=A.v(n)
a7=A.v(g)
a8=A.fw(f.h(0,"width"))
if(a8==null)a8=0
a9=d
if(typeof a9!=="number"){q=A.ah(a9)
s=1
break A}b0=A.fw(f.h(0,"height"))
if(b0==null)b0=0
b1=d
if(typeof b1!=="number"){q=A.ah(b1)
s=1
break A}J.qn(b3,a6+a7,new A.f(a8/a9,b0/b1))}s=8
break
p=2
s=12
break
case 10:p=9
b4=o.pop()
s=12
break
case 9:s=2
break
case 12:case 7:++a4
s=6
break
case 8:case 4:b5.length===c||(0,A.h)(b5),++a0
s=3
break
case 5:q=b3
s=1
break
case 1:return A.aA(q,r)
case 2:return A.az(o.at(-1),r)}})
return A.aB($async$p2,r)},
z_(){return A.zd()}},B={}
var w=[A,J,B]
var $={}
A.ps.prototype={}
J.h9.prototype={
D(a,b){return a===b},
gR(a){return A.dJ(a)},
q(a){return"Instance of '"+A.hx(a)+"'"},
gW(a){return A.bt(A.pP(this))}}
J.ew.prototype={
q(a){return String(a)},
cR(a,b){A.pL(b)
return b&&a},
gR(a){return a?519018:218159},
gW(a){return A.bt(t.B)},
$iU:1,
$iB:1}
J.ey.prototype={
D(a,b){return null==b},
q(a){return"null"},
gR(a){return 0},
$iU:1,
$ia8:1}
J.ez.prototype={$iS:1}
J.cd.prototype={
gR(a){return 0},
gW(a){return B.fb},
q(a){return String(a)}}
J.hu.prototype={}
J.cp.prototype={}
J.bF.prototype={
q(a){var s=a[$.tJ()]
if(s==null)s=a[$.qh()]
if(s==null)return this.eH(a)
return"JavaScript function for "+J.bk(s)},
$icF:1}
J.dA.prototype={
gR(a){return 0},
q(a){return String(a)}}
J.dB.prototype={
gR(a){return 0},
q(a){return String(a)}}
J.p.prototype={
bK(a,b){return new A.bv(a,A.M(a).i("@<1>").H(b).i("bv<1,2>"))},
j(a,b){A.M(a).c.a(b)
a.$flags&1&&A.x(a,29)
a.push(b)},
aM(a,b){a.$flags&1&&A.x(a,"removeAt",1)
if(b<0||b>=a.length)throw A.e(A.rj(b,null))
return a.splice(b,1)[0]},
cD(a,b,c){var s,r
A.M(a).i("i<1>").a(c)
a.$flags&1&&A.x(a,"insertAll",2)
A.vR(b,0,a.length,"index")
if(!t.Q.b(c))c=J.uj(c)
s=J.V(c)
a.length=a.length+s
r=b+s
this.a7(a,r,a.length,a,b)
this.Z(a,b,r,c)},
cP(a,b){var s=A.M(a)
return new A.aQ(a,s.i("B(1)").a(b),s.i("aQ<1>"))},
A(a,b){var s
A.M(a).i("i<1>").a(b)
a.$flags&1&&A.x(a,"addAll",2)
if(Array.isArray(b)){this.eO(a,b)
return}for(s=J.F(b);s.n();)a.push(s.gp())},
eO(a,b){var s,r
t.dG.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.e(A.a5(a))
for(r=0;r<s;++r)a.push(b[r])},
a2(a){a.$flags&1&&A.x(a,"clear","clear")
a.length=0},
a3(a,b){var s,r
A.M(a).i("~(1)").a(b)
s=a.length
for(r=0;r<s;++r){b.$1(a[r])
if(a.length!==s)throw A.e(A.a5(a))}},
aX(a,b,c){var s=A.M(a)
return new A.ar(a,s.H(c).i("1(2)").a(b),s.i("@<1>").H(c).i("ar<1,2>"))},
ac(a,b){var s,r=A.N(a.length,"",!1,t.N)
for(s=0;s<a.length;++s)this.m(r,s,A.v(a[s]))
return r.join(b)},
bP(a){return this.ac(a,"")},
ao(a,b){return A.aX(a,0,A.ct(b,"count",t.S),A.M(a).c)},
U(a,b){return A.aX(a,b,null,A.M(a).c)},
bM(a,b,c,d){var s,r,q
d.a(b)
A.M(a).H(d).i("1(1,2)").a(c)
s=a.length
for(r=b,q=0;q<s;++q){r=c.$2(r,a[q])
if(a.length!==s)throw A.e(A.a5(a))}return r},
P(a,b){if(!(b>=0&&b<a.length))return A.a(a,b)
return a[b]},
I(a,b,c){if(b<0||b>a.length)throw A.e(A.a6(b,0,a.length,"start",null))
if(c==null)c=a.length
else if(c<b||c>a.length)throw A.e(A.a6(c,b,a.length,"end",null))
if(b===c)return A.b([],A.M(a))
return A.b(a.slice(b,c),A.M(a))},
a_(a,b){return this.I(a,b,null)},
bq(a,b,c){A.aw(b,c,a.length)
return A.aX(a,b,c,A.M(a).c)},
gu(a){if(a.length>0)return a[0]
throw A.e(A.aI())},
gN(a){var s=a.length
if(s>0)return a[s-1]
throw A.e(A.aI())},
a7(a,b,c,d,e){var s,r,q,p,o
A.M(a).i("i<1>").a(d)
a.$flags&2&&A.x(a,5)
A.aw(b,c,a.length)
s=c-b
if(s===0)return
A.a9(e,"skipCount")
if(t.j.b(d)){r=d
q=e}else{r=J.df(d,e).b_(0,!1)
q=0}p=J.o(r)
if(q+s>p.gk(r))throw A.e(A.qX())
if(q<b)for(o=s-1;o>=0;--o)a[b+o]=p.h(r,q+o)
else for(o=0;o<s;++o)a[b+o]=p.h(r,q+o)},
Z(a,b,c,d){return this.a7(a,b,c,d,0)},
az(a,b,c,d){var s
A.M(a).i("1?").a(d)
a.$flags&2&&A.x(a,"fillRange")
A.aw(b,c,a.length)
for(s=b;s<c;++s)a[s]=d},
aw(a,b){var s,r
A.M(a).i("B(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.e(A.a5(a))}return!1},
ad(a,b){var s,r
A.M(a).i("B(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.e(A.a5(a))}return!0},
aG(a,b){var s,r,q,p,o,n=A.M(a)
n.i("c(1,1)?").a(b)
a.$flags&2&&A.x(a,"sort")
s=a.length
if(s<2)return
if(b==null)b=J.xz()
if(s===2){r=a[0]
q=a[1]
n=b.$2(r,q)
if(typeof n!=="number")return n.eC()
if(n>0){a[0]=q
a[1]=r}return}p=0
if(n.c.b(null))for(o=0;o<a.length;++o)if(a[o]===void 0){a[o]=null;++p}a.sort(A.e5(b,2))
if(p>0)this.hd(a,p)},
aQ(a){return this.aG(a,null)},
hd(a,b){var s,r=a.length
for(;s=r-1,r>0;r=s)if(a[s]===null){a[s]=void 0;--b
if(b===0)break}},
aW(a,b,c){var s,r=a.length
if(c>=r)return-1
if(c<0)c=0
for(s=c;s<r;++s){if(!(s<a.length))return A.a(a,s)
if(J.m(a[s],b))return s}return-1},
aF(a,b){return this.aW(a,b,0)},
v(a,b){var s
for(s=0;s<a.length;++s)if(J.m(a[s],b))return!0
return!1},
gC(a){return a.length===0},
gJ(a){return a.length!==0},
q(a){return A.pp(a,"[","]")},
b_(a,b){var s=A.b(a.slice(0),A.M(a))
return s},
ey(a){return this.b_(a,!0)},
ez(a){return A.vq(a,A.M(a).c)},
gt(a){return new J.b4(a,a.length,A.M(a).i("b4<1>"))},
gR(a){return A.dJ(a)},
gk(a){return a.length},
sk(a,b){a.$flags&1&&A.x(a,"set length","change the length of")
if(b<0)throw A.e(A.a6(b,0,null,"newLength",null))
if(b>a.length)A.M(a).c.a(null)
a.length=b},
h(a,b){A.D(b)
if(!(b>=0&&b<a.length))throw A.e(A.oB(a,b))
return a[b]},
m(a,b,c){A.M(a).c.a(c)
a.$flags&2&&A.x(a)
if(!(b>=0&&b<a.length))throw A.e(A.oB(a,b))
a[b]=c},
cQ(a,b){return new A.bS(a,b.i("bS<0>"))},
gW(a){return A.bt(A.M(a))},
$iz:1,
$ii:1,
$il:1,
i5(a,b){return this.gu(a).$1(b)},
il(a,b){return this.gN(a).$1(b)}}
J.hb.prototype={
iQ(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.hx(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.jR.prototype={}
J.b4.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.h(q)
throw A.e(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$iI:1}
J.cJ.prototype={
ab(a,b){var s
A.ai(b)
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gbO(b)
if(this.gbO(a)===s)return 0
if(this.gbO(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gbO(a){return a===0?1/a<0:a<0},
S(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.e(A.ax(""+a+".toInt()"))},
bL(a){var s,r
if(a>=0){if(a<=2147483647){s=a|0
return a===s?s:s+1}}else if(a>=-2147483648)return a|0
r=Math.ceil(a)
if(isFinite(r))return r
throw A.e(A.ax(""+a+".ceil()"))},
a5(a){var s,r
if(a>=0){if(a<=2147483647)return a|0}else if(a>=-2147483648){s=a|0
return a===s?s:s-1}r=Math.floor(a)
if(isFinite(r))return r
throw A.e(A.ax(""+a+".floor()"))},
Y(a){if(a>0){if(a!==1/0)return Math.round(a)}else if(a>-1/0)return 0-Math.round(0-a)
throw A.e(A.ax(""+a+".round()"))},
a1(a){if(a<0)return-Math.round(-a)
else return Math.round(a)},
E(a,b,c){if(this.ab(b,c)>0)throw A.e(A.c2(b))
if(this.ab(a,b)<0)return b
if(this.ab(a,c)>0)return c
return a},
iN(a,b){var s
if(b<0||b>20)throw A.e(A.a6(b,0,20,"fractionDigits",null))
s=a.toFixed(b)
if(a===0&&this.gbO(a))return"-"+s
return s},
bm(a,b){var s,r,q,p,o
if(b<2||b>36)throw A.e(A.a6(b,2,36,"radix",null))
s=a.toString(b)
r=s.length
q=r-1
if(!(q>=0))return A.a(s,q)
if(s.charCodeAt(q)!==41)return s
p=/^([\da-z]+)(?:\.([\da-z]+))?\(e\+(\d+)\)$/.exec(s)
if(p==null)A.t(A.ax("Unexpected toString result: "+s))
r=p.length
if(1>=r)return A.a(p,1)
s=p[1]
if(3>=r)return A.a(p,3)
o=+p[3]
r=p[2]
if(r!=null){s+=r
o-=r.length}return s+B.d.aO("0",o)},
q(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gR(a){var s,r,q,p,o=a|0
if(a===o)return o&536870911
s=Math.abs(a)
r=Math.log(s)/0.6931471805599453|0
q=Math.pow(2,r)
p=s<1?s/q:q/s
return((p*9007199254740992|0)+(p*3542243181176521|0))*599197+r*1259&536870911},
T(a,b){var s=a%b
if(s===0)return 0
if(s>0)return s
if(b<0)return s-b
else return s+b},
aa(a,b){if((a|0)===a)if(b>=1||b<-1)return a/b|0
return this.dP(a,b)},
F(a,b){return(a|0)===a?a/b|0:this.dP(a,b)},
dP(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.e(A.ax("Result of truncating division is "+A.v(s)+": "+A.v(a)+" ~/ "+b))},
a8(a,b){if(b<0)throw A.e(A.c2(b))
return b>31?0:a<<b>>>0},
a4(a,b){return b>31?0:a<<b>>>0},
cW(a,b){var s
if(b<0)throw A.e(A.c2(b))
if(a>0)s=this.ba(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
K(a,b){var s
if(a>0)s=this.ba(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
bF(a,b){if(0>b)throw A.e(A.c2(b))
return this.ba(a,b)},
ba(a,b){return b>31?0:a>>>b},
eE(a,b){if(b<0)throw A.e(A.c2(b))
return this.ce(a,b)},
ce(a,b){if(b>31)return 0
return a>>>b},
gW(a){return A.bt(t.cZ)},
$ib7:1,
$id:1,
$iav:1}
J.ex.prototype={
gW(a){return A.bt(t.S)},
$iU:1,
$ic:1}
J.hc.prototype={
gW(a){return A.bt(t.i)},
$iU:1}
J.cc.prototype={
co(a,b,c){var s=b.length
if(c>s)throw A.e(A.a6(c,0,s,null,null))
return new A.iz(b,a,c)},
cn(a,b){return this.co(a,b,0)},
cz(a,b){var s=b.length,r=a.length
if(s>r)return!1
return b===this.aq(a,r-s)},
cX(a,b){var s
if(typeof b=="string")return A.b(a.split(b),t.s)
else{if(b instanceof A.dz){s=b.e
s=!(s==null?b.e=b.fm():s)}else s=!1
if(s)return A.b(a.split(b.b),t.s)
else return this.fs(a,b)}},
fs(a,b){var s,r,q,p,o,n,m=A.b([],t.s)
for(s=J.qo(b,a),s=s.gt(s),r=0,q=1;s.n();){p=s.gp()
o=p.gcY()
n=p.gcw()
q=n-o
if(q===0&&r===o)continue
B.a.j(m,this.a9(a,r,o))
r=n}if(r<a.length||q>0)B.a.j(m,this.aq(a,r))
return m},
ap(a,b){var s=b.length
if(s>a.length)return!1
return b===a.substring(0,s)},
a9(a,b,c){return a.substring(b,A.aw(b,c,a.length))},
aq(a,b){return this.a9(a,b,null)},
bo(a){var s,r,q,p=a.trim(),o=p.length
if(o===0)return p
if(0>=o)return A.a(p,0)
if(p.charCodeAt(0)===133){s=J.r0(p,1)
if(s===o)return""}else s=0
r=o-1
if(!(r>=0))return A.a(p,r)
q=p.charCodeAt(r)===133?J.r1(p,r):o
if(s===0&&q===o)return p
return p.substring(s,q)},
iO(a){var s=a.trimStart(),r=s.length
if(r===0)return s
if(0>=r)return A.a(s,0)
if(s.charCodeAt(0)!==133)return s
return s.substring(J.r0(s,1))},
iP(a){var s,r=a.trimEnd(),q=r.length
if(q===0)return r
s=q-1
if(!(s>=0))return A.a(r,s)
if(r.charCodeAt(s)!==133)return r
return r.substring(0,J.r1(r,s))},
aO(a,b){var s,r
if(0>=b)return""
if(b===1||a.length===0)return a
if(b!==b>>>0)throw A.e(B.at)
for(s=a,r="";;){if((b&1)===1)r=s+r
b=b>>>1
if(b===0)break
s+=s}return r},
em(a,b,c){var s=b-a.length
if(s<=0)return a
return this.aO(c,s)+a},
iz(a,b,c){var s=b-a.length
if(s<=0)return a
return a+this.aO(c,s)},
aW(a,b,c){var s
if(c<0||c>a.length)throw A.e(A.a6(c,0,a.length,null,null))
s=a.indexOf(b,c)
return s},
aF(a,b){return this.aW(a,b,0)},
v(a,b){return A.zk(a,b,0)},
ab(a,b){var s
A.W(b)
if(a===b)s=0
else s=a<b?-1:1
return s},
q(a){return a},
gR(a){var s,r,q
for(s=a.length,r=0,q=0;q<s;++q){r=r+a.charCodeAt(q)&536870911
r=r+((r&524287)<<10)&536870911
r^=r>>6}r=r+((r&67108863)<<3)&536870911
r^=r>>11
return r+((r&16383)<<15)&536870911},
gW(a){return A.bt(t.N)},
gk(a){return a.length},
$iU:1,
$ib7:1,
$ik7:1,
$iq:1}
A.cq.prototype={
gt(a){return new A.eg(J.F(this.gaj()),A.u(this).i("eg<1,2>"))},
gk(a){return J.V(this.gaj())},
gC(a){return J.de(this.gaj())},
gJ(a){return J.pk(this.gaj())},
U(a,b){var s=A.u(this)
return A.dl(J.df(this.gaj(),b),s.c,s.y[1])},
ao(a,b){var s=A.u(this)
return A.dl(J.iQ(this.gaj(),b),s.c,s.y[1])},
P(a,b){return A.u(this).y[1].a(J.e9(this.gaj(),b))},
gu(a){return A.u(this).y[1].a(J.iO(this.gaj()))},
v(a,b){return J.qs(this.gaj(),b)},
q(a){return J.bk(this.gaj())}}
A.eg.prototype={
n(){return this.a.n()},
gp(){return this.$ti.y[1].a(this.a.gp())},
$iI:1}
A.cz.prototype={
gaj(){return this.a}}
A.f8.prototype={$iz:1}
A.f6.prototype={
h(a,b){return this.$ti.y[1].a(J.al(this.a,A.D(b)))},
m(a,b,c){var s=this.$ti
J.qn(this.a,b,s.c.a(s.y[1].a(c)))},
sk(a,b){J.ug(this.a,b)},
j(a,b){var s=this.$ti
J.iN(this.a,s.c.a(s.y[1].a(b)))},
bq(a,b,c){var s=this.$ti
return A.dl(J.ue(this.a,b,c),s.c,s.y[1])},
a7(a,b,c,d,e){var s=this.$ti
J.uh(this.a,b,c,A.dl(s.i("i<2>").a(d),s.y[1],s.c),e)},
Z(a,b,c,d){return this.a7(0,b,c,d,0)},
$iz:1,
$il:1}
A.bv.prototype={
bK(a,b){return new A.bv(this.a,this.$ti.i("@<1>").H(b).i("bv<1,2>"))},
gaj(){return this.a}}
A.cA.prototype={
bf(a,b,c){return new A.cA(this.a,this.$ti.i("@<1,2>").H(b).H(c).i("cA<1,2,3,4>"))},
M(a){return this.a.M(a)},
h(a,b){return this.$ti.i("4?").a(this.a.h(0,b))},
a3(a,b){this.a.a3(0,new A.iW(this,this.$ti.i("~(3,4)").a(b)))},
ga6(){var s=this.$ti
return A.dl(this.a.ga6(),s.c,s.y[2])},
gaN(){var s=this.$ti
return A.dl(this.a.gaN(),s.y[1],s.y[3])},
gk(a){var s=this.a
return s.gk(s)},
gC(a){var s=this.a
return s.gC(s)},
gJ(a){var s=this.a
return s.gJ(s)},
gai(){return this.a.gai().aX(0,new A.iV(this),this.$ti.i("ac<3,4>"))}}
A.iW.prototype={
$2(a,b){var s=this.a.$ti
s.c.a(a)
s.y[1].a(b)
this.b.$2(s.y[2].a(a),s.y[3].a(b))},
$S(){return this.a.$ti.i("~(1,2)")}}
A.iV.prototype={
$1(a){var s=this.a.$ti
s.i("ac<1,2>").a(a)
return new A.ac(s.y[2].a(a.a),s.y[3].a(a.b),s.i("ac<3,4>"))},
$S(){return this.a.$ti.i("ac<3,4>(ac<1,2>)")}}
A.dD.prototype={
q(a){return"LateInitializationError: "+this.a}}
A.dq.prototype={
gk(a){return this.a.length},
h(a,b){var s
A.D(b)
s=this.a
if(!(b>=0&&b<s.length))return A.a(s,b)
return s.charCodeAt(b)}}
A.oT.prototype={
$0(){var s=new A.L($.J,t.cU)
s.b4(null)
return s},
$S:101}
A.kv.prototype={}
A.z.prototype={}
A.a1.prototype={
gt(a){var s=this
return new A.a2(s,s.gk(s),A.u(s).i("a2<a1.E>"))},
gC(a){return this.gk(this)===0},
gu(a){if(this.gk(this)===0)throw A.e(A.aI())
return this.P(0,0)},
v(a,b){var s,r=this,q=r.gk(r)
for(s=0;s<q;++s){if(J.m(r.P(0,s),b))return!0
if(q!==r.gk(r))throw A.e(A.a5(r))}return!1},
aw(a,b){var s,r,q=this
A.u(q).i("B(a1.E)").a(b)
s=q.gk(q)
for(r=0;r<s;++r){if(b.$1(q.P(0,r)))return!0
if(s!==q.gk(q))throw A.e(A.a5(q))}return!1},
ac(a,b){var s,r,q,p=this,o=p.gk(p)
if(b.length!==0){if(o===0)return""
s=A.v(p.P(0,0))
if(o!==p.gk(p))throw A.e(A.a5(p))
for(r=s,q=1;q<o;++q){r=r+b+A.v(p.P(0,q))
if(o!==p.gk(p))throw A.e(A.a5(p))}return r.charCodeAt(0)==0?r:r}else{for(q=0,r="";q<o;++q){r+=A.v(p.P(0,q))
if(o!==p.gk(p))throw A.e(A.a5(p))}return r.charCodeAt(0)==0?r:r}},
bP(a){return this.ac(0,"")},
aX(a,b,c){var s=A.u(this)
return new A.ar(this,s.H(c).i("1(a1.E)").a(b),s.i("@<a1.E>").H(c).i("ar<1,2>"))},
U(a,b){return A.aX(this,b,null,A.u(this).i("a1.E"))},
ao(a,b){return A.aX(this,0,A.ct(b,"count",t.S),A.u(this).i("a1.E"))}}
A.bL.prototype={
d1(a,b,c,d){var s,r=this.b
A.a9(r,"start")
s=this.c
if(s!=null){A.a9(s,"end")
if(r>s)throw A.e(A.a6(r,0,s,"start",null))}},
gfu(){var s=J.V(this.a),r=this.c
if(r==null||r>s)return s
return r},
ghr(){var s=J.V(this.a),r=this.b
if(r>s)return s
return r},
gk(a){var s,r=J.V(this.a),q=this.b
if(q>=r)return 0
s=this.c
if(s==null||s>=r)return r-q
return s-q},
P(a,b){var s=this,r=s.ghr()+b
if(b<0||r>=s.gfu())throw A.e(A.jP(b,s.gk(0),s,"index"))
return J.e9(s.a,r)},
U(a,b){var s,r,q=this
A.a9(b,"count")
s=q.b+b
r=q.c
if(r!=null&&s>=r)return new A.em(q.$ti.i("em<1>"))
return A.aX(q.a,s,r,q.$ti.c)},
ao(a,b){var s,r,q,p=this
A.a9(b,"count")
s=p.c
r=p.b
q=r+b
if(s==null)return A.aX(p.a,r,q,p.$ti.c)
else{if(s<q)return p
return A.aX(p.a,r,q,p.$ti.c)}},
b_(a,b){var s,r,q,p=this,o=p.b,n=p.a,m=J.o(n),l=m.gk(n),k=p.c
if(k!=null&&k<l)l=k
s=l-o
if(s<=0){n=J.pr(0,p.$ti.c)
return n}r=A.N(s,m.P(n,o),!1,p.$ti.c)
for(q=1;q<s;++q){B.a.m(r,q,m.P(n,o+q))
if(m.gk(n)<l)throw A.e(A.a5(p))}return r}}
A.a2.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=J.o(q),o=p.gk(q)
if(r.b!==o)throw A.e(A.a5(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.P(q,s);++r.c
return!0},
$iI:1}
A.cO.prototype={
gt(a){return new A.eD(J.F(this.a),this.b,A.u(this).i("eD<1,2>"))},
gk(a){return J.V(this.a)},
gC(a){return J.de(this.a)},
gu(a){return this.b.$1(J.iO(this.a))},
P(a,b){return this.b.$1(J.e9(this.a,b))}}
A.cE.prototype={$iz:1}
A.eD.prototype={
n(){var s=this,r=s.b
if(r.n()){s.a=s.c.$1(r.gp())
return!0}s.a=null
return!1},
gp(){var s=this.a
return s==null?this.$ti.y[1].a(s):s},
$iI:1}
A.ar.prototype={
gk(a){return J.V(this.a)},
P(a,b){return this.b.$1(J.e9(this.a,b))}}
A.aQ.prototype={
gt(a){return new A.f2(J.F(this.a),this.b,this.$ti.i("f2<1>"))}}
A.f2.prototype={
n(){var s,r
for(s=this.a,r=this.b;s.n();)if(r.$1(s.gp()))return!0
return!1},
gp(){return this.a.gp()},
$iI:1}
A.cY.prototype={
gt(a){var s=this.a
return new A.eY(s.gt(s),this.b,A.u(this).i("eY<1>"))}}
A.el.prototype={
gk(a){var s=this.a,r=s.gk(s)
s=this.b
if(r>s)return s
return r},
$iz:1}
A.eY.prototype={
n(){if(--this.b>=0)return this.a.n()
this.b=-1
return!1},
gp(){if(this.b<0){this.$ti.c.a(null)
return null}return this.a.gp()},
$iI:1}
A.bJ.prototype={
U(a,b){A.c3(b,"count",t.S)
A.a9(b,"count")
return new A.bJ(this.a,this.b+b,A.u(this).i("bJ<1>"))},
gt(a){var s=this.a
return new A.eV(s.gt(s),this.b,A.u(this).i("eV<1>"))}}
A.dw.prototype={
gk(a){var s=this.a,r=s.gk(s)-this.b
if(r>=0)return r
return 0},
U(a,b){A.c3(b,"count",t.S)
A.a9(b,"count")
return new A.dw(this.a,this.b+b,this.$ti)},
$iz:1}
A.eV.prototype={
n(){var s,r
for(s=this.a,r=0;r<this.b;++r)s.n()
this.b=0
return s.n()},
gp(){return this.a.gp()},
$iI:1}
A.em.prototype={
gt(a){return B.am},
gC(a){return!0},
gk(a){return 0},
gu(a){throw A.e(A.aI())},
P(a,b){throw A.e(A.a6(b,0,0,"index",null))},
v(a,b){return!1},
U(a,b){A.a9(b,"count")
return this},
ao(a,b){A.a9(b,"count")
return this}}
A.en.prototype={
n(){return!1},
gp(){throw A.e(A.aI())},
$iI:1}
A.bS.prototype={
gt(a){return new A.cZ(J.F(this.a),this.$ti.i("cZ<1>"))}}
A.cZ.prototype={
n(){var s,r
for(s=this.a,r=this.$ti.c;s.n();)if(r.b(s.gp()))return!0
return!1},
gp(){return this.$ti.c.a(this.a.gp())},
$iI:1}
A.bD.prototype={
gk(a){return J.V(this.a)},
gC(a){return J.de(this.a)},
gJ(a){return J.pk(this.a)},
gu(a){return new A.f(this.b,J.iO(this.a))},
P(a,b){return new A.f(b+this.b,J.e9(this.a,b))},
v(a,b){var s,r,q,p=null,o=null,n=!1
if(t.A.b(b)){s=b.a
if(A.e_(s)){A.D(s)
r=b.b
n=s>=this.b
o=r
p=s}}if(n){if(typeof p!=="number")return p.aC()
n=J.df(this.a,p-this.b)
q=n.gt(n)
return q.n()&&J.m(q.gp(),o)}return!1},
ao(a,b){A.c3(b,"count",t.S)
A.a9(b,"count")
return new A.bD(J.iQ(this.a,b),this.b,A.u(this).i("bD<1>"))},
U(a,b){A.c3(b,"count",t.S)
A.a9(b,"count")
return new A.bD(J.df(this.a,b),b+this.b,A.u(this).i("bD<1>"))},
gt(a){return new A.bE(J.F(this.a),this.b,A.u(this).i("bE<1>"))}}
A.cD.prototype={
v(a,b){var s,r,q,p,o=null,n=null,m=!1
if(t.A.b(b)){s=b.a
if(A.e_(s)){A.D(s)
r=b.b
m=s>=this.b
n=r
o=s}}if(m){if(typeof o!=="number")return o.aC()
q=o-this.b
m=this.a
p=J.o(m)
return q<p.gk(m)&&J.m(p.P(m,q),n)}return!1},
ao(a,b){A.c3(b,"count",t.S)
A.a9(b,"count")
return new A.cD(J.iQ(this.a,b),this.b,this.$ti)},
U(a,b){A.c3(b,"count",t.S)
A.a9(b,"count")
return new A.cD(J.df(this.a,b),this.b+b,this.$ti)},
$iz:1}
A.bE.prototype={
n(){if(++this.c>=0&&this.a.n())return!0
this.c=-2
return!1},
gp(){var s=this.c
return s>=0?new A.f(this.b+s,this.a.gp()):A.t(A.aI())},
$iI:1}
A.a3.prototype={
sk(a,b){throw A.e(A.ax("Cannot change the length of a fixed-length list"))},
j(a,b){A.a4(a).i("a3.E").a(b)
throw A.e(A.ax("Cannot add to a fixed-length list"))}}
A.bR.prototype={
m(a,b,c){A.u(this).i("bR.E").a(c)
throw A.e(A.ax("Cannot modify an unmodifiable list"))},
sk(a,b){throw A.e(A.ax("Cannot change the length of an unmodifiable list"))},
j(a,b){A.u(this).i("bR.E").a(b)
throw A.e(A.ax("Cannot add to an unmodifiable list"))},
a7(a,b,c,d,e){A.u(this).i("i<bR.E>").a(d)
throw A.e(A.ax("Cannot modify an unmodifiable list"))},
Z(a,b,c,d){return this.a7(0,b,c,d,0)}}
A.dN.prototype={}
A.bq.prototype={
gk(a){return J.V(this.a)},
P(a,b){var s=this.a,r=J.o(s)
return r.P(s,r.gk(s)-1-b)}}
A.fv.prototype={}
A.f.prototype={$r:"+(1,2)",$s:1}
A.aS.prototype={$r:"+(1,2,3)",$s:2}
A.ds.prototype={
bf(a,b,c){var s=A.u(this)
return A.r9(this,s.c,s.y[1],b,c)},
gC(a){return this.gk(this)===0},
gJ(a){return this.gk(this)!==0},
q(a){return A.px(this)},
m(a,b,c){var s=A.u(this)
s.c.a(b)
s.y[1].a(c)
A.uB()},
gai(){return new A.cr(this.i_(),A.u(this).i("cr<ac<1,2>>"))},
i_(){var s=this
return function(){var r=0,q=1,p=[],o,n,m,l,k
return function $async$gai(a,b,c){if(b===1){p.push(c)
r=q}for(;;)switch(r){case 0:o=s.ga6(),o=o.gt(o),n=A.u(s),m=n.y[1],n=n.i("ac<1,2>")
case 2:if(!o.n()){r=3
break}l=o.gp()
k=s.h(0,l)
r=4
return a.b=new A.ac(l,k==null?m.a(k):k,n),1
case 4:r=2
break
case 3:return 0
case 1:return a.c=p.at(-1),3}}}},
$iO:1}
A.af.prototype={
gk(a){return this.b.length},
gdn(){var s=this.$keys
if(s==null){s=Object.keys(this.a)
this.$keys=s}return s},
M(a){if(typeof a!="string")return!1
if("__proto__"===a)return!1
return this.a.hasOwnProperty(a)},
h(a,b){if(!this.M(b))return null
return this.b[this.a[b]]},
a3(a,b){var s,r,q,p
this.$ti.i("~(1,2)").a(b)
s=this.gdn()
r=this.b
for(q=s.length,p=0;p<q;++p)b.$2(s[p],r[p])},
ga6(){return new A.d4(this.gdn(),this.$ti.i("d4<1>"))},
gaN(){return new A.d4(this.b,this.$ti.i("d4<2>"))}}
A.d4.prototype={
gk(a){return this.a.length},
gC(a){return 0===this.a.length},
gJ(a){return 0!==this.a.length},
gt(a){var s=this.a
return new A.bX(s,s.length,this.$ti.i("bX<1>"))}}
A.bX.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$iI:1}
A.c8.prototype={
aD(){var s=this,r=s.$map
if(r==null){r=new A.cK(s.$ti.i("cK<1,2>"))
A.tu(s.a,r)
s.$map=r}return r},
M(a){return this.aD().M(a)},
h(a,b){return this.aD().h(0,b)},
a3(a,b){this.$ti.i("~(1,2)").a(b)
this.aD().a3(0,b)},
ga6(){var s=this.aD()
return new A.aq(s,A.u(s).i("aq<1>"))},
gaN(){var s=this.aD()
return new A.ba(s,A.u(s).i("ba<2>"))},
gk(a){return this.aD().a}}
A.dt.prototype={}
A.b8.prototype={
gk(a){return this.b},
gC(a){return this.b===0},
gJ(a){return this.b!==0},
gt(a){var s,r=this,q=r.$keys
if(q==null){q=Object.keys(r.a)
r.$keys=q}s=q
return new A.bX(s,s.length,r.$ti.i("bX<1>"))},
v(a,b){if(typeof b!="string")return!1
if("__proto__"===b)return!1
return this.a.hasOwnProperty(b)}}
A.c9.prototype={
gk(a){return this.a.length},
gC(a){return this.a.length===0},
gJ(a){return this.a.length!==0},
gt(a){var s=this.a
return new A.bX(s,s.length,this.$ti.i("bX<1>"))},
aD(){var s,r,q,p,o=this,n=o.$map
if(n==null){n=new A.cK(o.$ti.i("cK<1,1>"))
for(s=o.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q]
n.m(0,p,p)}o.$map=n}return n},
v(a,b){return this.aD().M(b)}}
A.eQ.prototype={}
A.lo.prototype={
an(a){var s,r,q=this,p=new RegExp(q.a).exec(a)
if(p==null)return null
s=Object.create(null)
r=q.b
if(r!==-1)s.arguments=p[r+1]
r=q.c
if(r!==-1)s.argumentsExpr=p[r+1]
r=q.d
if(r!==-1)s.expr=p[r+1]
r=q.e
if(r!==-1)s.method=p[r+1]
r=q.f
if(r!==-1)s.receiver=p[r+1]
return s}}
A.eM.prototype={
q(a){return"Null check operator used on a null value"}}
A.hd.prototype={
q(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.hW.prototype={
q(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.k6.prototype={
q(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.eo.prototype={}
A.fj.prototype={
q(a){var s,r=this.b
if(r!=null)return r
r=this.a
s=r!==null&&typeof r==="object"?r.stack:null
return this.b=s==null?"":s},
$ibd:1}
A.c5.prototype={
q(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.tH(r==null?"unknown":r)+"'"},
gW(a){var s=A.q5(this)
return A.bt(s==null?A.a4(this):s)},
$icF:1,
giX(){return this},
$C:"$1",
$R:1,
$D:null}
A.fL.prototype={$C:"$0",$R:0}
A.fM.prototype={$C:"$2",$R:2}
A.hO.prototype={}
A.hG.prototype={
q(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.tH(s)+"'"}}
A.dh.prototype={
D(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.dh))return!1
return this.$_target===b.$_target&&this.a===b.a},
gR(a){return(A.oU(this.a)^A.dJ(this.$_target))>>>0},
q(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.hx(this.a)+"'")}}
A.hA.prototype={
q(a){return"RuntimeError: "+this.a}}
A.b9.prototype={
gk(a){return this.a},
gC(a){return this.a===0},
gJ(a){return this.a!==0},
ga6(){return new A.aq(this,A.u(this).i("aq<1>"))},
gaN(){return new A.ba(this,A.u(this).i("ba<2>"))},
gai(){return new A.bG(this,A.u(this).i("bG<1,2>"))},
M(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.ie(a)},
ie(a){var s=this.d
if(s==null)return!1
return this.bh(this.dk(s,a),a)>=0},
A(a,b){A.u(this).i("O<1,2>").a(b).a3(0,new A.jS(this))},
h(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.ig(b)},
ig(a){var s,r,q=this.d
if(q==null)return null
s=this.dk(q,a)
r=this.bh(s,a)
if(r<0)return null
return s[r].b},
m(a,b,c){var s,r,q=this,p=A.u(q)
p.c.a(b)
p.y[1].a(c)
if(typeof b=="string"){s=q.b
q.d2(s==null?q.b=q.ca():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=q.c
q.d2(r==null?q.c=q.ca():r,b,c)}else q.ii(b,c)},
ii(a,b){var s,r,q,p,o=this,n=A.u(o)
n.c.a(a)
n.y[1].a(b)
s=o.d
if(s==null)s=o.d=o.ca()
r=o.bN(a)
q=s[r]
if(q==null)s[r]=[o.bX(a,b)]
else{p=o.bh(q,a)
if(p>=0)q[p].b=b
else q.push(o.bX(a,b))}},
bj(a,b){var s,r,q=this,p=A.u(q)
p.c.a(a)
p.i("2()").a(b)
if(q.M(a)){s=q.h(0,a)
return s==null?p.y[1].a(s):s}r=b.$0()
q.m(0,a,r)
return r},
aA(a,b){var s=this
if(typeof b=="string")return s.dJ(s.b,b)
else if(typeof b=="number"&&(b&0x3fffffff)===b)return s.dJ(s.c,b)
else return s.ih(b)},
ih(a){var s,r,q,p,o=this,n=o.d
if(n==null)return null
s=o.bN(a)
r=n[s]
q=o.bh(r,a)
if(q<0)return null
p=r.splice(q,1)[0]
o.dU(p)
if(r.length===0)delete n[s]
return p.b},
a3(a,b){var s,r,q=this
A.u(q).i("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.e(A.a5(q))
s=s.c}},
d2(a,b,c){var s,r=A.u(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.bX(b,c)
else s.b=c},
dJ(a,b){var s
if(a==null)return null
s=a[b]
if(s==null)return null
this.dU(s)
delete a[b]
return s.b},
dv(){this.r=this.r+1&1073741823},
bX(a,b){var s=this,r=A.u(s),q=new A.jZ(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else{r=s.f
r.toString
q.d=r
s.f=r.c=q}++s.a
s.dv()
return q},
dU(a){var s=this,r=a.d,q=a.c
if(r==null)s.e=q
else r.c=q
if(q==null)s.f=r
else q.d=r;--s.a
s.dv()},
bN(a){return J.bj(a)&1073741823},
dk(a,b){return a[this.bN(b)]},
bh(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.m(a[r].a,b))return r
return-1},
q(a){return A.px(this)},
ca(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$ipu:1}
A.jS.prototype={
$2(a,b){var s=this.a,r=A.u(s)
s.m(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.u(this.a).i("~(1,2)")}}
A.jZ.prototype={}
A.aq.prototype={
gk(a){return this.a.a},
gC(a){return this.a.a===0},
gt(a){var s=this.a
return new A.eA(s,s.r,s.e,this.$ti.i("eA<1>"))},
v(a,b){return this.a.M(b)}}
A.eA.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.a5(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$iI:1}
A.ba.prototype={
gk(a){return this.a.a},
gC(a){return this.a.a===0},
gt(a){var s=this.a
return new A.cN(s,s.r,s.e,this.$ti.i("cN<1>"))}}
A.cN.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.a5(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$iI:1}
A.bG.prototype={
gk(a){return this.a.a},
gC(a){return this.a.a===0},
gt(a){var s=this.a
return new A.cM(s,s.r,s.e,this.$ti.i("cM<1,2>"))}}
A.cM.prototype={
gp(){var s=this.d
s.toString
return s},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.a5(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.ac(s.a,s.b,r.$ti.i("ac<1,2>"))
r.c=s.c
return!0}},
$iI:1}
A.cK.prototype={
bN(a){return A.yv(a)&1073741823},
bh(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.m(a[r].a,b))return r
return-1}}
A.oJ.prototype={
$1(a){return this.a(a)},
$S:41}
A.oK.prototype={
$2(a,b){return this.a(a,b)},
$S:89}
A.oL.prototype={
$1(a){return this.a(A.W(a))},
$S:39}
A.bs.prototype={
gW(a){return A.bt(this.dl())},
dl(){return A.yC(this.$r,this.c8())},
q(a){return this.dS(!1)},
dS(a){var s,r,q,p,o,n=this.fz(),m=this.c8(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.a(m,q)
o=m[q]
l=a?l+A.rg(o):l+A.v(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
fz(){var s,r=this.$s
while($.m4.length<=r)B.a.j($.m4,null)
s=$.m4[r]
if(s==null){s=this.fl()
B.a.m($.m4,r,s)}return s},
fl(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=t.K,j=J.pq(l,k)
for(s=0;s<l;++s)j[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.a.m(j,q,r[s])}}return A.pw(j,k)}}
A.dV.prototype={
c8(){return[this.a,this.b]},
D(a,b){if(b==null)return!1
return b instanceof A.dV&&this.$s===b.$s&&J.m(this.a,b.a)&&J.m(this.b,b.b)},
gR(a){return A.pA(this.$s,this.a,this.b,B.L)}}
A.dW.prototype={
c8(){return[this.a,this.b,this.c]},
D(a,b){var s=this
if(b==null)return!1
return b instanceof A.dW&&s.$s===b.$s&&J.m(s.a,b.a)&&J.m(s.b,b.b)&&J.m(s.c,b.c)},
gR(a){var s=this
return A.pA(s.$s,s.a,s.b,s.c)}}
A.dz.prototype={
q(a){return"RegExp/"+this.a+"/"+this.b.flags},
gfV(){var s=this,r=s.c
if(r!=null)return r
r=s.b
return s.c=A.r2(s.a,r.multiline,!r.ignoreCase,r.unicode,r.dotAll,"g")},
fm(){var s,r=this.a
if(!B.d.v(r,"("))return!1
s=this.b.unicode?"u":""
return new RegExp("(?:)|"+r,s).exec("").length>1},
co(a,b,c){var s=b.length
if(c>s)throw A.e(A.a6(c,0,s,null,null))
return new A.hZ(this,b,c)},
cn(a,b){return this.co(0,b,0)},
fw(a,b){var s,r=this.gfV()
if(r==null)r=A.bh(r)
r.lastIndex=b
s=r.exec(a)
if(s==null)return null
return new A.ir(s)},
$ik7:1,
$ivS:1}
A.ir.prototype={
gcY(){return this.b.index},
gcw(){var s=this.b
return s.index+s[0].length},
$idG:1,
$ieP:1}
A.hZ.prototype={
gt(a){return new A.f3(this.a,this.b,this.c)}}
A.f3.prototype={
gp(){var s=this.d
return s==null?t.lu.a(s):s},
n(){var s,r,q,p,o,n,m=this,l=m.b
if(l==null)return!1
s=m.c
r=l.length
if(s<=r){q=m.a
p=q.fw(l,s)
if(p!=null){m.d=p
o=p.gcw()
if(p.b.index===o){s=!1
if(q.b.unicode){q=m.c
n=q+1
if(n<r){if(!(q>=0&&q<r))return A.a(l,q)
q=l.charCodeAt(q)
if(q>=55296&&q<=56319){if(!(n>=0))return A.a(l,n)
s=l.charCodeAt(n)
s=s>=56320&&s<=57343}}}o=(s?o+1:o)+1}m.c=o
return!0}}m.b=m.d=null
return!1},
$iI:1}
A.eX.prototype={
gcw(){return this.a+this.c.length},
$idG:1,
gcY(){return this.a}}
A.iz.prototype={
gt(a){return new A.iA(this.a,this.b,this.c)},
gu(a){var s=this.b,r=this.a.indexOf(s,this.c)
if(r>=0)return new A.eX(r,s)
throw A.e(A.aI())}}
A.iA.prototype={
n(){var s,r,q=this,p=q.c,o=q.b,n=o.length,m=q.a,l=m.length
if(p+n>l){q.d=null
return!1}s=m.indexOf(o,p)
if(s<0){q.c=l+1
q.d=null
return!1}r=s+n
q.d=new A.eX(s,o)
q.c=r===q.c?r+1:r
return!0},
gp(){var s=this.d
s.toString
return s},
$iI:1}
A.ce.prototype={
geg(a){return a.byteLength},
gW(a){return B.f4},
e2(a,b,c){A.c0(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
e1(a,b,c){A.c0(a,b,c)
return new Uint16Array(a,b,c)},
e_(a,b,c){A.c0(a,b,c)
return new Float32Array(a,b,c)},
e0(a,b,c){A.c0(a,b,c)
return new Float64Array(a,b,c)},
dZ(a,b,c){var s
A.c0(a,b,c)
s=new DataView(a,b,c)
return s},
$iU:1,
$ice:1}
A.dI.prototype={$idI:1}
A.eI.prototype={
gam(a){if(((a.$flags|0)&2)!==0)return new A.mc(a.buffer)
else return a.buffer},
fL(a,b,c,d){var s=A.a6(b,0,c,d,null)
throw A.e(s)},
da(a,b,c,d){if(b>>>0!==b||b>c)this.fL(a,b,c,d)}}
A.mc.prototype={
geg(a){return this.a.byteLength},
e2(a,b,c){var s=A.pz(this.a,b,c)
s.$flags=3
return s},
e1(a,b,c){var s=A.vC(this.a,b,c)
s.$flags=3
return s},
e_(a,b,c){var s=A.vz(this.a,b,c)
s.$flags=3
return s},
e0(a,b,c){var s=A.vA(this.a,b,c)
s.$flags=3
return s},
dZ(a,b,c){var s=A.vy(this.a,b,c)
s.$flags=3
return s}}
A.eH.prototype={
gW(a){return B.f5},
$iU:1,
$iqF:1}
A.as.prototype={
gk(a){return a.length},
dN(a,b,c,d,e){var s,r,q=a.length
this.da(a,b,q,"start")
this.da(a,c,q,"end")
if(b>c)throw A.e(A.a6(b,0,c,null,null))
s=c-b
if(e<0)throw A.e(A.aK(e,null))
r=d.length
if(r-e<s)throw A.e(A.cl("Not enough elements"))
if(e!==0||r!==s)d=d.subarray(e,e+s)
a.set(d,b)},
$iaM:1}
A.cf.prototype={
h(a,b){A.D(b)
A.c_(b,a,a.length)
return a[b]},
m(a,b,c){A.db(c)
a.$flags&2&&A.x(a)
A.c_(b,a,a.length)
a[b]=c},
a7(a,b,c,d,e){t.id.a(d)
a.$flags&2&&A.x(a,5)
if(t.dQ.b(d)){this.dN(a,b,c,d,e)
return}this.d0(a,b,c,d,e)},
Z(a,b,c,d){return this.a7(a,b,c,d,0)},
$iz:1,
$ii:1,
$il:1}
A.aN.prototype={
m(a,b,c){A.D(c)
a.$flags&2&&A.x(a)
A.c_(b,a,a.length)
a[b]=c},
a7(a,b,c,d,e){t.fm.a(d)
a.$flags&2&&A.x(a,5)
if(t.aj.b(d)){this.dN(a,b,c,d,e)
return}this.d0(a,b,c,d,e)},
Z(a,b,c,d){return this.a7(a,b,c,d,0)},
$iz:1,
$ii:1,
$il:1}
A.cQ.prototype={
gW(a){return B.f6},
I(a,b,c){return new Float32Array(a.subarray(b,A.bi(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iU:1,
$icQ:1,
$ibz:1}
A.cR.prototype={
gW(a){return B.f7},
I(a,b,c){return new Float64Array(a.subarray(b,A.bi(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iU:1,
$icR:1,
$ic7:1}
A.hn.prototype={
gW(a){return B.f8},
h(a,b){A.D(b)
A.c_(b,a,a.length)
return a[b]},
I(a,b,c){return new Int16Array(a.subarray(b,A.bi(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iU:1,
$ipn:1}
A.cS.prototype={
gW(a){return B.f9},
h(a,b){A.D(b)
A.c_(b,a,a.length)
return a[b]},
I(a,b,c){return new Int32Array(a.subarray(b,A.bi(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iU:1,
$icS:1,
$iev:1}
A.ho.prototype={
gW(a){return B.fa},
h(a,b){A.D(b)
A.c_(b,a,a.length)
return a[b]},
I(a,b,c){return new Int8Array(a.subarray(b,A.bi(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iU:1}
A.cU.prototype={
gW(a){return B.fd},
h(a,b){A.D(b)
A.c_(b,a,a.length)
return a[b]},
I(a,b,c){return new Uint16Array(a.subarray(b,A.bi(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iU:1,
$icU:1,
$ilq:1}
A.eJ.prototype={
gW(a){return B.fe},
h(a,b){A.D(b)
A.c_(b,a,a.length)
return a[b]},
I(a,b,c){return new Uint32Array(a.subarray(b,A.bi(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iU:1,
$ilr:1}
A.eK.prototype={
gW(a){return B.ff},
gk(a){return a.length},
h(a,b){A.D(b)
A.c_(b,a,a.length)
return a[b]},
I(a,b,c){return new Uint8ClampedArray(a.subarray(b,A.bi(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iU:1}
A.cg.prototype={
gW(a){return B.fg},
gk(a){return a.length},
h(a,b){A.D(b)
A.c_(b,a,a.length)
return a[b]},
I(a,b,c){return new Uint8Array(a.subarray(b,A.bi(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iU:1,
$icg:1,
$ico:1}
A.fd.prototype={}
A.fe.prototype={}
A.ff.prototype={}
A.fg.prototype={}
A.bc.prototype={
i(a){return A.fr(v.typeUniverse,this,a)},
H(a){return A.rV(v.typeUniverse,this,a)}}
A.ih.prototype={}
A.iD.prototype={
q(a){return A.aT(this.a,null)}}
A.ia.prototype={
q(a){return this.a}}
A.fn.prototype={$ibO:1}
A.lx.prototype={
$1(a){var s=this.a,r=s.a
s.a=null
r.$0()},
$S:21}
A.lw.prototype={
$1(a){var s,r
this.a.a=t.M.a(a)
s=this.b
r=this.c
s.firstChild?s.removeChild(r):s.appendChild(r)},
$S:48}
A.ly.prototype={
$0(){this.a.$0()},
$S:38}
A.lz.prototype={
$0(){this.a.$0()},
$S:38}
A.m9.prototype={
eM(a,b){if(self.setTimeout!=null)this.b=self.setTimeout(A.e5(new A.ma(this,b),0),a)
else throw A.e(A.ax("`setTimeout()` not found."))},
be(){if(self.setTimeout!=null){var s=this.b
if(s==null)return
self.clearTimeout(s)
this.b=null}else throw A.e(A.ax("Canceling a timer."))}}
A.ma.prototype={
$0(){this.a.b=null
this.b.$0()},
$S:0}
A.i_.prototype={
cr(a){var s,r=this,q=r.$ti
q.i("1/?").a(a)
if(a==null)a=q.c.a(a)
if(!r.b)r.a.b4(a)
else{s=r.a
if(q.i("ab<1>").b(a))s.d9(a)
else s.bx(a)}},
cs(a,b){var s=this.a
if(this.b)s.aH(new A.am(a,b))
else s.b5(new A.am(a,b))}}
A.mi.prototype={
$1(a){return this.a.$2(0,a)},
$S:18}
A.mj.prototype={
$2(a,b){this.a.$2(1,new A.eo(a,t.l.a(b)))},
$S:120}
A.on.prototype={
$2(a,b){this.a(A.D(a),b)},
$S:46}
A.da.prototype={
gp(){var s=this.b
return s==null?this.$ti.c.a(s):s},
hf(a,b){var s,r,q
a=A.D(a)
b=b
s=this.a
for(;;)try{r=s(this,a,b)
return r}catch(q){b=q
a=1}},
n(){var s,r,q,p,o=this,n=null,m=0
for(;;){s=o.d
if(s!=null)try{if(s.n()){o.b=s.gp()
return!0}else o.d=null}catch(r){n=r
m=1
o.d=null}q=o.hf(m,n)
if(1===q)return!0
if(0===q){o.b=null
p=o.e
if(p==null||p.length===0){o.a=A.rP
return!1}if(0>=p.length)return A.a(p,-1)
o.a=p.pop()
m=0
n=null
continue}if(2===q){m=0
n=null
continue}if(3===q){n=o.c
o.c=null
p=o.e
if(p==null||p.length===0){o.b=null
o.a=A.rP
throw n
return!1}if(0>=p.length)return A.a(p,-1)
o.a=p.pop()
m=1
continue}throw A.e(A.cl("sync*"))}return!1},
iY(a){var s,r,q=this
if(a instanceof A.cr){s=a.a()
r=q.e
if(r==null)r=q.e=[]
B.a.j(r,q.a)
q.a=s
return 2}else{q.d=J.F(a)
return 2}},
$iI:1}
A.cr.prototype={
gt(a){return new A.da(this.a(),this.$ti.i("da<1>"))}}
A.am.prototype={
q(a){return A.v(this.a)},
$ia_:1,
gb2(){return this.b}}
A.ju.prototype={
$0(){this.c.a(null)
this.b.c1(null)},
$S:0}
A.ln.prototype={
q(a){var s=this.b.q(0)
return"TimeoutException after "+s+": "+this.a}}
A.i6.prototype={
cs(a,b){var s=this.a
if((s.a&30)!==0)throw A.e(A.cl("Future already completed"))
s.b5(A.xy(a,b))},
e7(a){return this.cs(a,null)}}
A.f5.prototype={
cr(a){var s,r=this.$ti
r.i("1/?").a(a)
s=this.a
if((s.a&30)!==0)throw A.e(A.cl("Future already completed"))
s.b4(r.i("1/").a(a))}}
A.bf.prototype={
it(a){if((this.c&15)!==6)return!0
return this.b.b.cL(t.iW.a(this.d),a.a,t.B,t.K)},
i7(a){var s,r=this,q=r.e,p=null,o=t.z,n=t.K,m=a.a,l=r.b.b
if(t.ng.b(q))p=l.iI(q,m,a.b,o,n,t.l)
else p=l.cL(t.E.a(q),m,o,n)
try{o=r.$ti.i("2/").a(p)
return o}catch(s){if(t.do.b(A.b2(s))){if((r.c&1)!==0)throw A.e(A.aK("The error handler of Future.then must return a value of the returned future's type","onError"))
throw A.e(A.aK("The error handler of Future.catchError must return a value of the future's type","onError"))}else throw s}}}
A.L.prototype={
bl(a,b,c){var s,r,q,p=this.$ti
p.H(c).i("1/(2)").a(a)
s=$.J
if(s===B.f){if(b!=null&&!t.ng.b(b)&&!t.E.b(b))throw A.e(A.iS(b,"onError",u.c))}else{c.i("@<0/>").H(p.c).i("1(2)").a(a)
if(b!=null)b=A.y5(b,s)}r=new A.L(s,c.i("L<0>"))
q=b==null?1:3
this.b3(new A.bf(r,q,a,b,p.i("@<1>").H(c).i("bf<1,2>")))
return r},
ex(a,b){return this.bl(a,null,b)},
dR(a,b,c){var s,r=this.$ti
r.H(c).i("1/(2)").a(a)
s=new A.L($.J,c.i("L<0>"))
this.b3(new A.bf(s,19,a,b,r.i("@<1>").H(c).i("bf<1,2>")))
return s},
iU(a){var s,r
t.mY.a(a)
s=this.$ti
r=new A.L($.J,s)
this.b3(new A.bf(r,8,a,null,s.i("bf<1,1>")))
return r},
hm(a){this.$ti.c.a(a)
this.a=8
this.c=a},
hj(a){this.a=this.a&1|16
this.c=a},
bw(a){this.a=a.a&30|this.a&1
this.c=a.c},
b3(a){var s,r=this,q=r.a
if(q<=3){a.a=t.F.a(r.c)
r.c=a}else{if((q&4)!==0){s=t._.a(r.c)
if((s.a&24)===0){s.b3(a)
return}r.bw(s)}A.e2(null,null,r.b,t.M.a(new A.lG(r,a)))}},
dG(a){var s,r,q,p,o,n,m=this,l={}
l.a=a
if(a==null)return
s=m.a
if(s<=3){r=t.F.a(m.c)
m.c=a
if(r!=null){q=a.a
for(p=a;q!=null;p=q,q=o)o=q.a
p.a=r}}else{if((s&4)!==0){n=t._.a(m.c)
if((n.a&24)===0){n.dG(a)
return}m.bw(n)}l.a=m.bE(a)
A.e2(null,null,m.b,t.M.a(new A.lL(l,m)))}},
b9(){var s=t.F.a(this.c)
this.c=null
return this.bE(s)},
bE(a){var s,r,q
for(s=a,r=null;s!=null;r=s,s=q){q=s.a
s.a=r}return r},
c1(a){var s,r=this,q=r.$ti
q.i("1/").a(a)
if(q.i("ab<1>").b(a))A.lJ(a,r,!0)
else{s=r.b9()
q.c.a(a)
r.a=8
r.c=a
A.d3(r,s)}},
bx(a){var s,r=this
r.$ti.c.a(a)
s=r.b9()
r.a=8
r.c=a
A.d3(r,s)},
fk(a){var s,r,q=this
if((a.a&16)!==0){s=q.b===a.b
s=!(s||s)}else s=!1
if(s)return
r=q.b9()
q.bw(a)
A.d3(q,r)},
aH(a){var s=this.b9()
this.hj(a)
A.d3(this,s)},
fj(a,b){A.bh(a)
t.l.a(b)
this.aH(new A.am(a,b))},
b4(a){var s=this.$ti
s.i("1/").a(a)
if(s.i("ab<1>").b(a)){this.d9(a)
return}this.d8(a)},
d8(a){var s=this
s.$ti.c.a(a)
s.a^=2
A.e2(null,null,s.b,t.M.a(new A.lI(s,a)))},
d9(a){A.lJ(this.$ti.i("ab<1>").a(a),this,!1)
return},
b5(a){this.a^=2
A.e2(null,null,this.b,t.M.a(new A.lH(this,a)))},
iM(a){var s,r=this,q={}
if((r.a&24)!==0){q=new A.L($.J,r.$ti)
q.b4(r)
return q}s=new A.L($.J,r.$ti)
q.a=null
q.a=A.rx(a,new A.lR(s,a))
r.bl(new A.lS(q,r,s),new A.lT(q,s),t.P)
return s},
$iab:1}
A.lG.prototype={
$0(){A.d3(this.a,this.b)},
$S:0}
A.lL.prototype={
$0(){A.d3(this.b,this.a.a)},
$S:0}
A.lK.prototype={
$0(){A.lJ(this.a.a,this.b,!0)},
$S:0}
A.lI.prototype={
$0(){this.a.bx(this.b)},
$S:0}
A.lH.prototype={
$0(){this.a.aH(this.b)},
$S:0}
A.lO.prototype={
$0(){var s,r,q,p,o,n,m,l,k=this,j=null
try{q=k.a.a
j=q.b.b.ew(t.mY.a(q.d),t.z)}catch(p){s=A.b2(p)
r=A.cu(p)
if(k.c&&t.v.a(k.b.a.c).a===s){q=k.a
q.c=t.v.a(k.b.a.c)}else{q=s
o=r
if(o==null)o=A.pl(q)
n=k.a
n.c=new A.am(q,o)
q=n}q.b=!0
return}if(j instanceof A.L&&(j.a&24)!==0){if((j.a&16)!==0){q=k.a
q.c=t.v.a(j.c)
q.b=!0}return}if(j instanceof A.L){m=k.b.a
l=new A.L(m.b,m.$ti)
j.bl(new A.lP(l,m),new A.lQ(l),t.o)
q=k.a
q.c=l
q.b=!1}},
$S:0}
A.lP.prototype={
$1(a){this.a.fk(this.b)},
$S:21}
A.lQ.prototype={
$2(a,b){A.bh(a)
t.l.a(b)
this.a.aH(new A.am(a,b))},
$S:37}
A.lN.prototype={
$0(){var s,r,q,p,o,n,m,l
try{q=this.a
p=q.a
o=p.$ti
n=o.c
m=n.a(this.b)
q.c=p.b.b.cL(o.i("2/(1)").a(p.d),m,o.i("2/"),n)}catch(l){s=A.b2(l)
r=A.cu(l)
q=s
p=r
if(p==null)p=A.pl(q)
o=this.a
o.c=new A.am(q,p)
o.b=!0}},
$S:0}
A.lM.prototype={
$0(){var s,r,q,p,o,n,m,l=this
try{s=t.v.a(l.a.a.c)
p=l.b
if(p.a.it(s)&&p.a.e!=null){p.c=p.a.i7(s)
p.b=!1}}catch(o){r=A.b2(o)
q=A.cu(o)
p=t.v.a(l.a.a.c)
if(p.a===r){n=l.b
n.c=p
p=n}else{p=r
n=q
if(n==null)n=A.pl(p)
m=l.b
m.c=new A.am(p,n)
p=m}p.b=!0}},
$S:0}
A.lR.prototype={
$0(){var s=A.rp()
this.a.aH(new A.am(new A.ln("Future not completed",this.b),s))},
$S:0}
A.lS.prototype={
$1(a){var s
this.b.$ti.c.a(a)
s=this.a.a
if(s.b!=null){s.be()
this.c.bx(a)}},
$S(){return this.b.$ti.i("a8(1)")}}
A.lT.prototype={
$2(a,b){var s
A.bh(a)
t.l.a(b)
s=this.a.a
if(s.b!=null){s.be()
this.b.aH(new A.am(a,b))}},
$S:37}
A.i0.prototype={}
A.dK.prototype={
gk(a){var s={},r=new A.L($.J,t.hy)
s.a=0
this.eh(new A.kC(s,this),!0,new A.kD(s,r),r.gfi())
return r}}
A.kC.prototype={
$1(a){this.b.$ti.c.a(a);++this.a.a},
$S(){return this.b.$ti.i("~(1)")}}
A.kD.prototype={
$0(){this.b.c1(this.a.a)},
$S:0}
A.fk.prototype={
gh2(){var s,r=this
if((r.b&8)===0)return A.u(r).i("bg<1>?").a(r.a)
s=A.u(r)
return s.i("bg<1>?").a(s.i("fl<1>").a(r.a).gcj())},
fv(){var s,r,q=this
if((q.b&8)===0){s=q.a
if(s==null)s=q.a=new A.bg(A.u(q).i("bg<1>"))
return A.u(q).i("bg<1>").a(s)}r=A.u(q)
s=r.i("fl<1>").a(q.a).gcj()
return r.i("bg<1>").a(s)},
ghu(){var s=this.a
if((this.b&8)!==0)s=t.d3.a(s).gcj()
return A.u(this).i("d0<1>").a(s)},
f7(){if((this.b&4)!==0)return new A.ck("Cannot add event after closing")
return new A.ck("Cannot add event while adding a stream")},
ht(a,b,c,d){var s,r,q,p,o,n=this,m=A.u(n)
m.i("~(1)?").a(a)
t.jE.a(c)
if((n.b&3)!==0)throw A.e(A.cl("Stream has already been listened to."))
s=$.J
r=d?1:0
t.bm.H(m.c).i("1(2)").a(a)
A.wr(s,b)
t.M.a(c)
q=new A.d0(n,a,s,r|32,m.i("d0<1>"))
p=n.gh2()
if(((n.b|=1)&8)!==0){o=m.i("fl<1>").a(n.a)
o.scj(q)
o.cK()}else n.a=q
q.hk(p)
q.c9(new A.m8(n))
return q},
h9(a){var s,r,q,p,o,n,m,l,k,j=this,i=A.u(j)
i.i("hH<1>").a(a)
s=null
if((j.b&8)!==0)s=i.i("fl<1>").a(j.a).be()
j.a=null
j.b=j.b&4294967286|2
r=j.r
if(r!=null)if(s==null)try{q=r.$0()
if(q instanceof A.L)s=q}catch(n){p=A.b2(n)
o=A.cu(n)
m=new A.L($.J,t.cU)
i=A.bh(p)
l=t.l.a(o)
m.b5(new A.am(i,l))
s=m}else s=s.iU(r)
i=new A.m7(j)
if(s!=null){l=s
t.mY.a(i)
k=l.$ti
m=new A.L($.J,k)
l.b3(new A.bf(m,8,i,null,k.i("bf<1,1>")))
s=m}else i.$0()
return s},
$irO:1,
$id2:1}
A.m8.prototype={
$0(){A.pY(this.a.d)},
$S:0}
A.m7.prototype={
$0(){},
$S:0}
A.i1.prototype={
cd(a){var s=this.$ti
s.c.a(a)
this.ghu().eX(new A.d1(a,s.i("d1<1>")))}}
A.dQ.prototype={}
A.dU.prototype={
gR(a){return(A.dJ(this.a)^892482866)>>>0},
D(a,b){if(b==null)return!1
if(this===b)return!0
return b instanceof A.dU&&b.a===this.a}}
A.d0.prototype={
fW(){return this.w.h9(this)},
bC(){var s=this.w,r=A.u(s)
r.i("hH<1>").a(this)
if((s.b&8)!==0)r.i("fl<1>").a(s.a).en()
A.pY(s.e)},
bD(){var s=this.w,r=A.u(s)
r.i("hH<1>").a(this)
if((s.b&8)!==0)r.i("fl<1>").a(s.a).cK()
A.pY(s.f)}}
A.dR.prototype={
hk(a){var s=this
A.u(s).i("bg<1>?").a(a)
if(a==null)return
s.r=a
if(a.c!=null){s.e=(s.e|128)>>>0
a.bt(s)}},
en(){var s,r,q=this,p=q.e
if((p&8)!==0)return
s=(p+256|4)>>>0
q.e=s
if(p<256){r=q.r
if(r!=null)if(r.a===1)r.a=3}if((p&4)===0&&(s&64)===0)q.c9(q.gdw())},
cK(){var s=this,r=s.e
if((r&8)!==0)return
if(r>=256){r=s.e=r-256
if(r<256)if((r&128)!==0&&s.r.c!=null)s.r.bt(s)
else{r=(r&4294967291)>>>0
s.e=r
if((r&64)===0)s.c9(s.gdz())}}},
bC(){},
bD(){},
eX(a){var s,r=this,q=r.r
if(q==null)q=r.r=new A.bg(A.u(r).i("bg<1>"))
q.j(0,a)
s=r.e
if((s&128)===0){s=(s|128)>>>0
r.e=s
if(s<256)q.bt(r)}},
cd(a){var s,r=this,q=A.u(r).c
q.a(a)
s=r.e
r.e=(s|64)>>>0
r.d.iK(r.a,a,q)
r.e=(r.e&4294967231)>>>0
r.dc((s&4)!==0)},
c9(a){var s,r=this
t.M.a(a)
s=r.e
r.e=(s|64)>>>0
a.$0()
r.e=(r.e&4294967231)>>>0
r.dc((s&4)!==0)},
dc(a){var s,r,q=this,p=q.e
if((p&128)!==0&&q.r.c==null){p=q.e=(p&4294967167)>>>0
s=!1
if((p&4)!==0)if(p<256){s=q.r
s=s==null?null:s.c==null
s=s!==!1}if(s){p=(p&4294967291)>>>0
q.e=p}}for(;;a=r){if((p&8)!==0){q.r=null
return}r=(p&4)!==0
if(a===r)break
q.e=(p^64)>>>0
if(r)q.bC()
else q.bD()
p=(q.e&4294967231)>>>0
q.e=p}if((p&128)!==0&&p<256)q.r.bt(q)},
$ihH:1,
$id2:1}
A.fm.prototype={
eh(a,b,c,d){var s=this.$ti
s.i("~(1)?").a(a)
t.jE.a(c)
return this.a.ht(s.i("~(1)?").a(a),d,c,!0)}}
A.f7.prototype={}
A.d1.prototype={}
A.bg.prototype={
bt(a){var s,r=this
r.$ti.i("d2<1>").a(a)
s=r.a
if(s===1)return
if(s>=1){r.a=1
return}A.ze(new A.m3(r,a))
r.a=1},
j(a,b){var s=this,r=s.c
if(r==null)s.b=s.c=b
else s.c=r.a=b}}
A.m3.prototype={
$0(){var s,r,q,p=this.a,o=p.a
p.a=0
if(o===3)return
s=p.$ti.i("d2<1>").a(this.b)
r=p.b
q=r.a
p.b=q
if(q==null)p.c=null
A.u(r).i("d2<1>").a(s).cd(r.b)},
$S:0}
A.d9.prototype={
gp(){var s=this
if(s.c)return s.$ti.c.a(s.b)
return s.$ti.c.a(null)},
n(){var s,r=this,q=r.a
if(q!=null){if(r.c){s=new A.L($.J,t.k)
r.b=s
r.c=!1
q.cK()
return s}throw A.e(A.cl("Already waiting for next."))}return r.fK()},
fK(){var s,r,q=this,p=q.b
if(p!=null){q.$ti.i("dK<1>").a(p)
s=new A.L($.J,t.k)
q.b=s
r=p.eh(q.gfX(),!0,q.gfZ(),q.gh0())
if(q.b!=null)q.a=r
return s}return $.tL()},
be(){var s,r,q=this,p=q.a,o=q.b
q.b=null
if(p!=null){q.a=null
if(!q.c)t.k.a(o).b4(!1)
else q.c=!1
s=p.e=(p.e&4294967279)>>>0
if((s&8)===0){s=p.e=(s|8)>>>0
if((s&128)!==0){r=p.r
if(r.a===1)r.a=3}if((s&64)===0)p.r=null
p.f=p.fW()}s=p.f
return s==null?$.qi():s}return $.qi()},
fY(a){var s,r,q=this
q.$ti.c.a(a)
if(q.a==null)return
s=t.k.a(q.b)
q.b=a
q.c=!0
s.c1(!0)
if(q.c){r=q.a
if(r!=null)r.en()}},
h1(a,b){var s,r,q=this
A.bh(a)
t.l.a(b)
s=q.a
r=t.k.a(q.b)
q.b=q.a=null
if(s!=null)r.aH(new A.am(a,b))
else r.b5(new A.am(a,b))},
h_(){var s=this,r=s.a,q=t.k.a(s.b)
s.b=s.a=null
if(r!=null)q.bx(!1)
else q.d8(!1)}}
A.fu.prototype={$irB:1}
A.iw.prototype={
iJ(a){var s,r,q
t.M.a(a)
try{if(B.f===$.J){a.$0()
return}A.tf(null,null,this,a,t.o)}catch(q){s=A.b2(q)
r=A.cu(q)
A.iI(A.bh(s),t.l.a(r))}},
iK(a,b,c){var s,r,q
c.i("~(0)").a(a)
c.a(b)
try{if(B.f===$.J){a.$1(b)
return}A.tg(null,null,this,a,b,t.o,c)}catch(q){s=A.b2(q)
r=A.cu(q)
A.iI(A.bh(s),t.l.a(r))}},
cq(a){return new A.m6(this,t.M.a(a))},
ew(a,b){b.i("0()").a(a)
if($.J===B.f)return a.$0()
return A.tf(null,null,this,a,b)},
cL(a,b,c,d){c.i("@<0>").H(d).i("1(2)").a(a)
d.a(b)
if($.J===B.f)return a.$1(b)
return A.tg(null,null,this,a,b,c,d)},
iI(a,b,c,d,e,f){d.i("@<0>").H(e).H(f).i("1(2,3)").a(a)
e.a(b)
f.a(c)
if($.J===B.f)return a.$2(b,c)
return A.y7(null,null,this,a,b,c,d,e,f)},
cI(a,b,c,d){return b.i("@<0>").H(c).H(d).i("1(2,3)").a(a)}}
A.m6.prototype={
$0(){return this.a.iJ(this.b)},
$S:0}
A.of.prototype={
$0(){A.uT(this.a,this.b)},
$S:0}
A.d6.prototype={
gt(a){var s=this,r=new A.d7(s,s.r,A.u(s).i("d7<1>"))
r.c=s.e
return r},
gk(a){return this.a},
gC(a){return this.a===0},
gJ(a){return this.a!==0},
v(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.nF.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.nF.a(r[b])!=null}else return this.fn(b)},
fn(a){var s=this.d
if(s==null)return!1
return this.dh(s[this.dd(a)],a)>=0},
gu(a){var s=this.e
if(s==null)throw A.e(A.cl("No elements"))
return A.u(this).c.a(s.a)},
j(a,b){var s,r,q=this
A.u(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.d4(s==null?q.b=A.pH():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.d4(r==null?q.c=A.pH():r,b)}else return q.eN(b)},
eN(a){var s,r,q,p=this
A.u(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.pH()
r=p.dd(a)
q=s[r]
if(q==null)s[r]=[p.cb(a)]
else{if(p.dh(q,a)>=0)return!1
q.push(p.cb(a))}return!0},
d4(a,b){A.u(this).c.a(b)
if(t.nF.a(a[b])!=null)return!1
a[b]=this.cb(b)
return!0},
cb(a){var s=this,r=new A.iq(A.u(s).c.a(a))
if(s.e==null)s.e=s.f=r
else s.f=s.f.b=r;++s.a
s.r=s.r+1&1073741823
return r},
dd(a){return J.bj(a)&1073741823},
dh(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.m(a[r].a,b))return r
return-1}}
A.iq.prototype={}
A.d7.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.e(A.a5(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.i("1?").a(r.a)
s.c=r.b
return!0}},
$iI:1}
A.y.prototype={
gt(a){return new A.a2(a,this.gk(a),A.a4(a).i("a2<y.E>"))},
P(a,b){return this.h(a,b)},
a3(a,b){var s,r
A.a4(a).i("~(y.E)").a(b)
s=this.gk(a)
for(r=0;r<s;++r){b.$1(this.h(a,r))
if(s!==this.gk(a))throw A.e(A.a5(a))}},
gC(a){return this.gk(a)===0},
gJ(a){return!this.gC(a)},
gu(a){if(this.gk(a)===0)throw A.e(A.aI())
return this.h(a,0)},
gN(a){if(this.gk(a)===0)throw A.e(A.aI())
return this.h(a,this.gk(a)-1)},
v(a,b){var s,r=this.gk(a)
for(s=0;s<r;++s){if(J.m(this.h(a,s),b))return!0
if(r!==this.gk(a))throw A.e(A.a5(a))}return!1},
ad(a,b){var s,r
A.a4(a).i("B(y.E)").a(b)
s=this.gk(a)
for(r=0;r<s;++r){if(!b.$1(this.h(a,r)))return!1
if(s!==this.gk(a))throw A.e(A.a5(a))}return!0},
aw(a,b){var s,r
A.a4(a).i("B(y.E)").a(b)
s=this.gk(a)
for(r=0;r<s;++r){if(b.$1(this.h(a,r)))return!0
if(s!==this.gk(a))throw A.e(A.a5(a))}return!1},
ac(a,b){var s
if(this.gk(a)===0)return""
s=A.pD("",a,b)
return s.charCodeAt(0)==0?s:s},
cP(a,b){var s=A.a4(a)
return new A.aQ(a,s.i("B(y.E)").a(b),s.i("aQ<y.E>"))},
cQ(a,b){return new A.bS(a,b.i("bS<0>"))},
aX(a,b,c){var s=A.a4(a)
return new A.ar(a,s.H(c).i("1(y.E)").a(b),s.i("@<y.E>").H(c).i("ar<1,2>"))},
bM(a,b,c,d){var s,r,q
d.a(b)
A.a4(a).H(d).i("1(1,y.E)").a(c)
s=this.gk(a)
for(r=b,q=0;q<s;++q){r=c.$2(r,this.h(a,q))
if(s!==this.gk(a))throw A.e(A.a5(a))}return r},
U(a,b){return A.aX(a,b,null,A.a4(a).i("y.E"))},
ao(a,b){return A.aX(a,0,A.ct(b,"count",t.S),A.a4(a).i("y.E"))},
ez(a){var s,r=A.r7(A.a4(a).i("y.E"))
for(s=0;s<this.gk(a);++s)r.j(0,this.h(a,s))
return r},
j(a,b){var s
A.a4(a).i("y.E").a(b)
s=this.gk(a)
this.sk(a,s+1)
this.m(a,s,b)},
bK(a,b){return new A.bv(a,A.a4(a).i("@<y.E>").H(b).i("bv<1,2>"))},
I(a,b,c){var s,r=this.gk(a)
if(c==null)c=r
A.aw(b,c,r)
s=A.X(this.bq(a,b,c),A.a4(a).i("y.E"))
return s},
a_(a,b){return this.I(a,b,null)},
bq(a,b,c){A.aw(b,c,this.gk(a))
return A.aX(a,b,c,A.a4(a).i("y.E"))},
az(a,b,c,d){var s
A.a4(a).i("y.E?").a(d)
A.aw(b,c,this.gk(a))
for(s=b;s<c;++s)this.m(a,s,d)},
a7(a,b,c,d,e){var s,r,q,p,o
A.a4(a).i("i<y.E>").a(d)
A.aw(b,c,this.gk(a))
s=c-b
if(s===0)return
A.a9(e,"skipCount")
if(t.j.b(d)){r=e
q=d}else{q=J.df(d,e).b_(0,!1)
r=0}p=J.o(q)
if(r+s>p.gk(q))throw A.e(A.qX())
if(r<b)for(o=s-1;o>=0;--o)this.m(a,b+o,p.h(q,r+o))
else for(o=0;o<s;++o)this.m(a,b+o,p.h(q,r+o))},
Z(a,b,c,d){return this.a7(a,b,c,d,0)},
aW(a,b,c){var s
if(c<0)c=0
for(s=c;s<this.gk(a);++s)if(J.m(this.h(a,s),b))return s
return-1},
bU(a,b,c){var s,r
A.a4(a).i("i<y.E>").a(c)
if(t.j.b(c))this.Z(a,b,b+c.length,c)
else for(s=J.F(c);s.n();b=r){r=b+1
this.m(a,b,s.gp())}},
q(a){return A.pp(a,"[","]")},
$iz:1,
$ii:1,
$il:1}
A.T.prototype={
bf(a,b,c){var s=A.u(this)
return A.r9(this,s.i("T.K"),s.i("T.V"),b,c)},
a3(a,b){var s,r,q,p=A.u(this)
p.i("~(T.K,T.V)").a(b)
for(s=this.ga6(),s=s.gt(s),p=p.i("T.V");s.n();){r=s.gp()
q=this.h(0,r)
b.$2(r,q==null?p.a(q):q)}},
gai(){return this.ga6().aX(0,new A.k_(this),A.u(this).i("ac<T.K,T.V>"))},
M(a){return this.ga6().v(0,a)},
gk(a){var s=this.ga6()
return s.gk(s)},
gC(a){var s=this.ga6()
return s.gC(s)},
gJ(a){var s=this.ga6()
return s.gJ(s)},
gaN(){return new A.fa(this,A.u(this).i("fa<T.K,T.V>"))},
q(a){return A.px(this)},
$iO:1}
A.k_.prototype={
$1(a){var s=this.a,r=A.u(s)
r.i("T.K").a(a)
s=s.h(0,a)
if(s==null)s=r.i("T.V").a(s)
return new A.ac(a,s,r.i("ac<T.K,T.V>"))},
$S(){return A.u(this.a).i("ac<T.K,T.V>(T.K)")}}
A.k0.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.v(a)
r.a=(r.a+=s)+": "
s=A.v(b)
r.a+=s},
$S:36}
A.fa.prototype={
gk(a){var s=this.a
return s.gk(s)},
gC(a){var s=this.a
return s.gC(s)},
gJ(a){var s=this.a
return s.gJ(s)},
gu(a){var s=this.a,r=s.ga6()
r=s.h(0,r.gu(r))
return r==null?this.$ti.y[1].a(r):r},
gt(a){var s=this.a,r=s.ga6()
return new A.fb(r.gt(r),s,this.$ti.i("fb<1,2>"))}}
A.fb.prototype={
n(){var s=this,r=s.a
if(r.n()){s.c=s.b.h(0,r.gp())
return!0}s.c=null
return!1},
gp(){var s=this.c
return s==null?this.$ti.y[1].a(s):s},
$iI:1}
A.bI.prototype={
gC(a){return this.gk(this)===0},
gJ(a){return this.gk(this)!==0},
q(a){return A.pp(this,"{","}")},
ao(a,b){return A.rv(this,b,A.u(this).c)},
U(a,b){return A.ro(this,b,A.u(this).c)},
gu(a){var s=this.gt(this)
if(!s.n())throw A.e(A.aI())
return s.gp()},
P(a,b){var s,r
A.a9(b,"index")
s=this.gt(this)
for(r=b;s.n();){if(r===0)return s.gp();--r}throw A.e(A.jP(b,b-r,this,"index"))},
$iz:1,
$ii:1,
$icj:1}
A.fi.prototype={}
A.im.prototype={
h(a,b){var s,r=this.b
if(r==null)return this.c.h(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.h7(b):s}},
gk(a){return this.b==null?this.c.a:this.b6().length},
gC(a){return this.gk(0)===0},
gJ(a){return this.gk(0)>0},
ga6(){if(this.b==null){var s=this.c
return new A.aq(s,A.u(s).i("aq<1>"))}return new A.io(this)},
gaN(){var s,r=this
if(r.b==null){s=r.c
return new A.ba(s,A.u(s).i("ba<2>"))}return A.py(r.b6(),new A.lY(r),t.N,t.z)},
M(a){if(this.b==null)return this.c.M(a)
if(typeof a!="string")return!1
return Object.prototype.hasOwnProperty.call(this.a,a)},
a3(a,b){var s,r,q,p,o=this
t.jR.a(b)
if(o.b==null)return o.c.a3(0,b)
s=o.b6()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.mx(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.e(A.a5(o))}},
b6(){var s=t.lH.a(this.c)
if(s==null)s=this.c=A.b(Object.keys(this.a),t.s)
return s},
h7(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.mx(this.a[a])
return this.b[a]=s}}
A.lY.prototype={
$1(a){return this.a.h(0,A.W(a))},
$S:39}
A.io.prototype={
gk(a){return this.a.gk(0)},
P(a,b){var s=this.a
if(s.b==null)s=s.ga6().P(0,b)
else{s=s.b6()
if(!(b>=0&&b<s.length))return A.a(s,b)
s=s[b]}return s},
gt(a){var s=this.a
if(s.b==null){s=s.ga6()
s=s.gt(s)}else{s=s.b6()
s=new J.b4(s,s.length,A.M(s).i("b4<1>"))}return s},
v(a,b){return this.a.M(b)}}
A.me.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:true})
return s}catch(r){}return null},
$S:34}
A.md.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:false})
return s}catch(r){}return null},
$S:34}
A.dr.prototype={}
A.fT.prototype={}
A.h0.prototype={}
A.dC.prototype={
q(a){var s=A.h1(this.a)
return(this.b!=null?"Converting object to an encodable object failed:":"Converting object did not return an encodable object:")+" "+s}}
A.hf.prototype={
q(a){return"Cyclic error in JSON stringify"}}
A.he.prototype={
eb(a,b){var s=A.y_(a,this.ghV().a)
return s},
ak(a,b){var s=A.wD(a,this.ghZ().b,null)
return s},
hY(a){return this.ak(a,null)},
ghZ(){return B.b9},
ghV(){return B.b8}}
A.jU.prototype={}
A.jT.prototype={}
A.m_.prototype={
eB(a){var s,r,q,p,o,n,m=a.length
for(s=this.c,r=0,q=0;q<m;++q){p=a.charCodeAt(q)
if(p>92){if(p>=55296){o=p&64512
if(o===55296){n=q+1
n=!(n<m&&(a.charCodeAt(n)&64512)===56320)}else n=!1
if(!n)if(o===56320){o=q-1
o=!(o>=0&&(a.charCodeAt(o)&64512)===55296)}else o=!1
else o=!0
if(o){if(q>r)s.a+=B.d.a9(a,r,q)
r=q+1
o=A.Q(92)
s.a+=o
o=A.Q(117)
s.a+=o
o=A.Q(100)
s.a+=o
o=p>>>8&15
o=A.Q(o<10?48+o:87+o)
s.a+=o
o=p>>>4&15
o=A.Q(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.Q(o<10?48+o:87+o)
s.a+=o}}continue}if(p<32){if(q>r)s.a+=B.d.a9(a,r,q)
r=q+1
o=A.Q(92)
s.a+=o
switch(p){case 8:o=A.Q(98)
s.a+=o
break
case 9:o=A.Q(116)
s.a+=o
break
case 10:o=A.Q(110)
s.a+=o
break
case 12:o=A.Q(102)
s.a+=o
break
case 13:o=A.Q(114)
s.a+=o
break
default:o=A.Q(117)
s.a+=o
o=A.Q(48)
s.a=(s.a+=o)+o
o=p>>>4&15
o=A.Q(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.Q(o<10?48+o:87+o)
s.a+=o
break}}else if(p===34||p===92){if(q>r)s.a+=B.d.a9(a,r,q)
r=q+1
o=A.Q(92)
s.a+=o
o=A.Q(p)
s.a+=o}}if(r===0)s.a+=a
else if(r<m)s.a+=B.d.a9(a,r,m)},
c0(a){var s,r,q,p
for(s=this.a,r=s.length,q=0;q<r;++q){p=s[q]
if(a==null?p==null:a===p)throw A.e(new A.hf(a,null))}B.a.j(s,a)},
bS(a){var s,r,q,p,o=this
if(o.eA(a))return
o.c0(a)
try{s=o.b.$1(a)
if(!o.eA(s)){q=A.r3(a,null,o.gdB())
throw A.e(q)}q=o.a
if(0>=q.length)return A.a(q,-1)
q.pop()}catch(p){r=A.b2(p)
q=A.r3(a,r,o.gdB())
throw A.e(q)}},
eA(a){var s,r,q=this
if(typeof a=="number"){if(!isFinite(a))return!1
q.c.a+=B.c.q(a)
return!0}else if(a===!0){q.c.a+="true"
return!0}else if(a===!1){q.c.a+="false"
return!0}else if(a==null){q.c.a+="null"
return!0}else if(typeof a=="string"){s=q.c
s.a+='"'
q.eB(a)
s.a+='"'
return!0}else if(t.j.b(a)){q.c0(a)
q.iV(a)
s=q.a
if(0>=s.length)return A.a(s,-1)
s.pop()
return!0}else if(t.f.b(a)){q.c0(a)
r=q.iW(a)
s=q.a
if(0>=s.length)return A.a(s,-1)
s.pop()
return r}else return!1},
iV(a){var s,r,q=this.c
q.a+="["
s=J.o(a)
if(s.gJ(a)){this.bS(s.h(a,0))
for(r=1;r<s.gk(a);++r){q.a+=","
this.bS(s.h(a,r))}}q.a+="]"},
iW(a){var s,r,q,p,o,n,m=this,l={}
if(a.gC(a)){m.c.a+="{}"
return!0}s=a.gk(a)*2
r=A.N(s,null,!1,t.O)
q=l.a=0
l.b=!0
a.a3(0,new A.m0(l,r))
if(!l.b)return!1
p=m.c
p.a+="{"
for(o='"';q<s;q+=2,o=',"'){p.a+=o
m.eB(A.W(r[q]))
p.a+='":'
n=q+1
if(!(n<s))return A.a(r,n)
m.bS(r[n])}p.a+="}"
return!0}}
A.m0.prototype={
$2(a,b){var s,r
if(typeof a!="string")this.a.b=!1
s=this.b
r=this.a
B.a.m(s,r.a++,a)
B.a.m(s,r.a++,b)},
$S:36}
A.lZ.prototype={
gdB(){var s=this.c.a
return s.charCodeAt(0)==0?s:s}}
A.hX.prototype={
ea(a,b){t.L.a(a)
return(b===!0?B.fi:B.fh).ct(a)},
e9(a){return this.ea(a,null)}}
A.ls.prototype={
ct(a){var s,r,q,p=a.length,o=A.aw(0,null,p)
if(o===0)return new Uint8Array(0)
s=new Uint8Array(o*3)
r=new A.mf(s)
if(r.fA(a,0,o)!==o){q=o-1
if(!(q>=0&&q<p))return A.a(a,q)
r.ck()}return B.j.I(s,0,r.b)}}
A.mf.prototype={
ck(){var s,r=this,q=r.c,p=r.b,o=r.b=p+1
q.$flags&2&&A.x(q)
s=q.length
if(!(p<s))return A.a(q,p)
q[p]=239
p=r.b=o+1
if(!(o<s))return A.a(q,o)
q[o]=191
r.b=p+1
if(!(p<s))return A.a(q,p)
q[p]=189},
hG(a,b){var s,r,q,p,o,n=this
if((b&64512)===56320){s=65536+((a&1023)<<10)|b&1023
r=n.c
q=n.b
p=n.b=q+1
r.$flags&2&&A.x(r)
o=r.length
if(!(q<o))return A.a(r,q)
r[q]=s>>>18|240
q=n.b=p+1
if(!(p<o))return A.a(r,p)
r[p]=s>>>12&63|128
p=n.b=q+1
if(!(q<o))return A.a(r,q)
r[q]=s>>>6&63|128
n.b=p+1
if(!(p<o))return A.a(r,p)
r[p]=s&63|128
return!0}else{n.ck()
return!1}},
fA(a,b,c){var s,r,q,p,o,n,m,l,k=this
if(b!==c){s=c-1
if(!(s>=0&&s<a.length))return A.a(a,s)
s=(a.charCodeAt(s)&64512)===55296}else s=!1
if(s)--c
for(s=k.c,r=s.$flags|0,q=s.length,p=a.length,o=b;o<c;++o){if(!(o<p))return A.a(a,o)
n=a.charCodeAt(o)
if(n<=127){m=k.b
if(m>=q)break
k.b=m+1
r&2&&A.x(s)
s[m]=n}else{m=n&64512
if(m===55296){if(k.b+4>q)break
m=o+1
if(!(m<p))return A.a(a,m)
if(k.hG(n,a.charCodeAt(m)))o=m}else if(m===56320){if(k.b+3>q)break
k.ck()}else if(n<=2047){m=k.b
l=m+1
if(l>=q)break
k.b=l
r&2&&A.x(s)
if(!(m<q))return A.a(s,m)
s[m]=n>>>6|192
k.b=l+1
s[l]=n&63|128}else{m=k.b
if(m+2>=q)break
l=k.b=m+1
r&2&&A.x(s)
if(!(m<q))return A.a(s,m)
s[m]=n>>>12|224
m=k.b=l+1
if(!(l<q))return A.a(s,l)
s[l]=n>>>6&63|128
k.b=m+1
if(!(m<q))return A.a(s,m)
s[m]=n&63|128}}}return o}}
A.hY.prototype={
ct(a){return new A.fs(this.a).c2(t.L.a(a),0,null,!0)}}
A.fs.prototype={
c2(a,b,c,d){var s,r,q,p,o,n,m,l=this
t.L.a(a)
s=A.aw(b,c,a.length)
if(b===s)return""
if(a instanceof Uint8Array){r=a
q=r
p=0}else{q=A.x_(a,b,s)
s-=b
p=b
b=0}if(s-b>=15){o=l.a
n=A.wZ(o,q,b,s)
if(n!=null){if(!o)return n
if(n.indexOf("\ufffd")<0)return n}}n=l.c3(q,b,s,!0)
o=l.b
if((o&1)!==0){m=A.x0(o)
l.b=0
throw A.e(A.es(m,a,p+l.c))}return n},
c3(a,b,c,d){var s,r,q=this
if(c-b>1000){s=B.b.F(b+c,2)
r=q.c3(a,b,s,!1)
if((q.b&1)!==0)return r
return r+q.c3(a,s,c,d)}return q.hU(a,b,c,d)},
hU(a,b,a0,a1){var s,r,q,p,o,n,m,l,k=this,j="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFFFFFFFFFFFFFFFFGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHIHHHJEEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBKCCCCCCCCCCCCDCLONNNMEEEEEEEEEEE",i=" \x000:XECCCCCN:lDb \x000:XECCCCCNvlDb \x000:XECCCCCN:lDb AAAAA\x00\x00\x00\x00\x00AAAAA00000AAAAA:::::AAAAAGG000AAAAA00KKKAAAAAG::::AAAAA:IIIIAAAAA000\x800AAAAA\x00\x00\x00\x00 AAAAA",h=65533,g=k.b,f=k.c,e=new A.be(""),d=b+1,c=a.length
if(!(b>=0&&b<c))return A.a(a,b)
s=a[b]
A:for(r=k.a;;){for(;;d=o){if(!(s>=0&&s<256))return A.a(j,s)
q=j.charCodeAt(s)&31
f=g<=32?s&61694>>>q:(s&63|f<<6)>>>0
p=g+q
if(!(p>=0&&p<144))return A.a(i,p)
g=i.charCodeAt(p)
if(g===0){p=A.Q(f)
e.a+=p
if(d===a0)break A
break}else if((g&1)!==0){if(r)switch(g){case 69:case 67:p=A.Q(h)
e.a+=p
break
case 65:p=A.Q(h)
e.a+=p;--d
break
default:p=A.Q(h)
e.a=(e.a+=p)+p
break}else{k.b=g
k.c=d-1
return""}g=0}if(d===a0)break A
o=d+1
if(!(d>=0&&d<c))return A.a(a,d)
s=a[d]}o=d+1
if(!(d>=0&&d<c))return A.a(a,d)
s=a[d]
if(s<128){for(;;){if(!(o<a0)){n=a0
break}m=o+1
if(!(o>=0&&o<c))return A.a(a,o)
s=a[o]
if(s>=128){n=m-1
o=m
break}o=m}if(n-d<20)for(l=d;l<n;++l){if(!(l<c))return A.a(a,l)
p=A.Q(a[l])
e.a+=p}else{p=A.dL(a,d,n)
e.a+=p}if(n===a0)break A
d=o}else d=o}if(a1&&g>32)if(r){c=A.Q(h)
e.a+=c}else{k.b=77
k.c=a0
return""}k.b=g
k.c=f
c=e.a
return c.charCodeAt(0)==0?c:c}}
A.bl.prototype={
D(a,b){if(b==null)return!1
return b instanceof A.bl&&this.a===b.a},
gR(a){return B.b.gR(this.a)},
ab(a,b){return B.b.ab(this.a,t.jS.a(b).a)},
q(a){var s,r,q,p=this.a,o=p%36e8,n=B.b.F(o,6e7)
o%=6e7
s=n<10?"0":""
r=B.b.F(o,1e6)
q=r<10?"0":""
return""+(p/36e8|0)+":"+s+n+":"+q+r+"."+B.d.em(B.b.q(o%1e6),6,"0")},
$ib7:1}
A.i9.prototype={
q(a){return this.ar()},
$iby:1}
A.a_.prototype={
gb2(){return A.vN(this)}}
A.fF.prototype={
q(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.h1(s)
return"Assertion failed"}}
A.bO.prototype={}
A.b3.prototype={
gc6(){return"Invalid argument"+(!this.a?"(s)":"")},
gc5(){return""},
q(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+A.v(p),n=s.gc6()+q+o
if(!s.a)return n
return n+s.gc5()+": "+A.h1(s.gcE())},
gcE(){return this.b}}
A.ci.prototype={
gcE(){return A.fw(this.b)},
gc6(){return"RangeError"},
gc5(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.v(q):""
else if(q==null)s=": Not greater than or equal to "+A.v(r)
else if(q>r)s=": Not in inclusive range "+A.v(r)+".."+A.v(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.v(r)
return s}}
A.h8.prototype={
gcE(){return A.D(this.b)},
gc6(){return"RangeError"},
gc5(){if(A.D(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
$ici:1,
gk(a){return this.f}}
A.f0.prototype={
q(a){return"Unsupported operation: "+this.a}}
A.hV.prototype={
q(a){return"UnimplementedError: "+this.a}}
A.ck.prototype={
q(a){return"Bad state: "+this.a}}
A.fP.prototype={
q(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.h1(s)+"."}}
A.hq.prototype={
q(a){return"Out of Memory"},
gb2(){return null},
$ia_:1}
A.eW.prototype={
q(a){return"Stack Overflow"},
gb2(){return null},
$ia_:1}
A.lE.prototype={
q(a){return"Exception: "+this.a}}
A.aa.prototype={
q(a){var s,r,q,p,o,n,m,l,k,j,i,h=this.a,g=""!==h?"FormatException: "+h:"FormatException",f=this.c,e=this.b
if(typeof e=="string"){if(f!=null)s=f<0||f>e.length
else s=!1
if(s)f=null
if(f==null){if(e.length>78)e=B.d.a9(e,0,75)+"..."
return g+"\n"+e}for(r=e.length,q=1,p=0,o=!1,n=0;n<f;++n){if(!(n<r))return A.a(e,n)
m=e.charCodeAt(n)
if(m===10){if(p!==n||!o)++q
p=n+1
o=!1}else if(m===13){++q
p=n+1
o=!0}}g=q>1?g+(" (at line "+q+", character "+(f-p+1)+")\n"):g+(" (at character "+(f+1)+")\n")
for(n=f;n<r;++n){if(!(n>=0))return A.a(e,n)
m=e.charCodeAt(n)
if(m===10||m===13){r=n
break}}l=""
if(r-p>78){k="..."
if(f-p<75){j=p+75
i=p}else{if(r-f<75){i=r-75
j=r
k=""}else{i=f-36
j=f+36}l="..."}}else{j=r
i=p
k=""}return g+l+B.d.a9(e,i,j)+k+"\n"+B.d.aO(" ",f-i+l.length)+"^\n"}else return f!=null?g+(" (at offset "+A.v(f)+")"):g}}
A.i.prototype={
bK(a,b){return A.dl(this,A.u(this).i("i.E"),b)},
aX(a,b,c){var s=A.u(this)
return A.py(this,s.H(c).i("1(i.E)").a(b),s.i("i.E"),c)},
cP(a,b){var s=A.u(this)
return new A.aQ(this,s.i("B(i.E)").a(b),s.i("aQ<i.E>"))},
cQ(a,b){return new A.bS(this,b.i("bS<0>"))},
v(a,b){var s
for(s=this.gt(this);s.n();)if(J.m(s.gp(),b))return!0
return!1},
a3(a,b){var s
A.u(this).i("~(i.E)").a(b)
for(s=this.gt(this);s.n();)b.$1(s.gp())},
ad(a,b){var s
A.u(this).i("B(i.E)").a(b)
for(s=this.gt(this);s.n();)if(!b.$1(s.gp()))return!1
return!0},
ac(a,b){var s,r,q=this.gt(this)
if(!q.n())return""
s=J.bk(q.gp())
if(!q.n())return s
if(b.length===0){r=s
do r+=J.bk(q.gp())
while(q.n())}else{r=s
do r=r+b+J.bk(q.gp())
while(q.n())}return r.charCodeAt(0)==0?r:r},
aw(a,b){var s
A.u(this).i("B(i.E)").a(b)
for(s=this.gt(this);s.n();)if(b.$1(s.gp()))return!0
return!1},
b_(a,b){var s=A.u(this).i("i.E")
if(b)s=A.X(this,s)
else{s=A.X(this,s)
s.$flags=1
s=s}return s},
ey(a){return this.b_(0,!0)},
gk(a){var s,r=this.gt(this)
for(s=0;r.n();)++s
return s},
gC(a){return!this.gt(this).n()},
gJ(a){return!this.gC(this)},
ao(a,b){return A.rv(this,b,A.u(this).i("i.E"))},
U(a,b){return A.ro(this,b,A.u(this).i("i.E"))},
gu(a){var s=this.gt(this)
if(!s.n())throw A.e(A.aI())
return s.gp()},
P(a,b){var s,r
A.a9(b,"index")
s=this.gt(this)
for(r=b;s.n();){if(r===0)return s.gp();--r}throw A.e(A.jP(b,b-r,this,"index"))},
q(a){return A.vj(this,"(",")")}}
A.ac.prototype={
q(a){return"MapEntry("+A.v(this.a)+": "+A.v(this.b)+")"}}
A.a8.prototype={
gR(a){return A.n.prototype.gR.call(this,0)},
q(a){return"null"}}
A.n.prototype={$in:1,
D(a,b){return this===b},
gR(a){return A.dJ(this)},
q(a){return"Instance of '"+A.hx(this)+"'"},
gW(a){return A.yK(this)},
toString(){return this.q(this)}}
A.iB.prototype={
q(a){return""},
$ibd:1}
A.an.prototype={
gt(a){return new A.cW(this.a)}}
A.cW.prototype={
gp(){return this.d},
n(){var s,r,q,p=this,o=p.b=p.c,n=p.a,m=n.length
if(o===m){p.d=-1
return!1}if(!(o<m))return A.a(n,o)
s=n.charCodeAt(o)
r=o+1
if((s&64512)===55296&&r<m){if(!(r<m))return A.a(n,r)
q=n.charCodeAt(r)
if((q&64512)===56320){p.c=r+1
p.d=A.xh(s,q)
return!0}}p.c=r
p.d=s
return!0},
$iI:1}
A.be.prototype={
gk(a){return this.a.length},
q(a){var s=this.a
return s.charCodeAt(0)==0?s:s},
$iw5:1}
A.ob.prototype={
$0(){var s=v.G.performance
if(t.m.b(s))if(s.measure!=null&&s.mark!=null&&s.clearMeasures!=null&&s.clearMarks!=null)return s
return null},
$S:53}
A.mM.prototype={
$0(){var s=v.G.JSON
if(t.m.b(s))return s
throw A.e(A.ax("Missing JSON.parse() support"))},
$S:62}
A.k5.prototype={
q(a){return"Promise was rejected with a value of `"+(this.a?"undefined":"null")+"`."}}
A.oW.prototype={
$1(a){return this.a.cr(this.b.i("0/?").a(a))},
$S:18}
A.oX.prototype={
$1(a){if(a==null)return this.a.e7(new A.k5(a===undefined))
return this.a.e7(a)},
$S:18}
A.cn.prototype={
ar(){return"TextAlign."+this.b}}
A.jj.prototype={
$2(a,b){var s=t.dt
s=s.a(a).b-s.a(b).b
if(s>0)return 1
else if(s<0)return-1
return 0},
$S:67}
A.bY.prototype={}
A.ch.prototype={
gi9(){var s,r,q,p,o,n,m,l,k,j,i=this.c
if(i==null){i=this.a.bk(1751474532)
s=i.b
if(!i.X(s,54))A.t(B.a4)
r=s+12
i.l(r,4)
q=i.a
p=q.getUint32(r,!1)
if(p!==1594834165)A.t(A.k("head.magicNumber is 0x"+B.b.bm(p,16)+", not 0x5F0F3CF5"))
r=s+18
i.l(r,2)
o=q.getUint16(r,!1)
if(o<16||o>16384)A.t(A.k("head.unitsPerEm "+o+" is outside the legal 16\u202616384"))
r=s+50
i.l(r,2)
n=q.getInt16(r,!1)
if(n!==0&&n!==1)A.t(A.k("head.indexToLocFormat "+n+" is neither short nor long"))
i.l(s,2)
q.getUint16(s,!1)
r=s+2
i.l(r,2)
q.getUint16(r,!1)
r=s+4
i.l(r,4)
q.getUint32(r,!1)
r=s+8
i.l(r,4)
q.getUint32(r,!1)
r=s+16
i.l(r,2)
q.getUint16(r,!1)
A.jK(i,s+20)
A.jK(i,s+28)
r=s+36
i.l(r,2)
r=q.getInt16(r,!1)
m=s+38
i.l(m,2)
m=q.getInt16(m,!1)
l=s+40
i.l(l,2)
l=q.getInt16(l,!1)
k=s+42
i.l(k,2)
k=q.getInt16(k,!1)
j=s+44
i.l(j,2)
q.getUint16(j,!1)
j=s+46
i.l(j,2)
q.getUint16(j,!1)
j=s+48
i.l(j,2)
q.getInt16(j,!1)
j=s+52
i.l(j,2)
q.getInt16(j,!1)
k=this.c=new A.h5(o,r,m,l,k,n)
i=k}return i},
ge5(){var s=this.e
return s==null?this.e=A.ei(this.a.bk(1668112752)):s},
dT(a,b){var s=this.a.bk(a),r=s.b+b
s.l(r,2)
return s.a.getUint16(r,!1)},
gib(){var s,r=this
if(r.ay)return r.ax
r.ay=!0
s=r.a.bR(1213612370)
if(s==null)return null
return r.ax=A.vi(s)},
gcU(){var s=this.CW
return s==null?this.CW=this.bB(1196643650,A.yO(),t.b0):s},
gcT(){var s=this.cx
return s==null?this.cx=this.bB(1196445523,A.yN(),t.fA):s},
cm(a){var s,r,q,p,o,n=this,m=n.f
if(m==null){m=n.a.bk(1752003704)
s=n.dT(1751672161,34)
r=n.d
m=n.f=A.ve(m,r==null?n.d=n.dT(1835104368,4):r,s)}q=m.cm(a)
p=n.b
if(p==null)return q
o=n.gib()
if(o==null)return q
return q+B.c.Y(o.hW(a,p))},
ix(a){var s,r=this
t.eM.a(a)
s=r.Q
if(s==null)s=r.Q=r.bB(1719034226,A.yF(),t.kH)
if(s==null)return B.cM
return s.iw(a,r.a.bR(1635148146))},
bB(a,b,c){var s
c.i("0(r)").a(b)
s=this.a.bR(a)
return s==null?null:b.$1(s)}}
A.hN.prototype={
q(a){return A.aJ(this.a)+"@"+this.c+"+"+this.d},
gk(a){return this.d}}
A.kw.prototype={
bR(a){var s=this.c.h(0,a)
return s==null?null:new A.r(this.a.a,s.c)},
bk(a){var s=this.bR(a)
if(s==null)throw A.e(A.k("font has no "+A.aJ(A.cX(a))+" table"))
return s}}
A.jc.prototype={
gef(){var s=this.d
return s.a===3&&s.b===0},
ah(a){var s,r
if(a<0)return 0
s=this.a
r=s.ah(a)
if(r!==0||!this.gef())return r
if(a<=255)return s.ah(61440+a)
return 0},
q(a){var s=this.d,r=this.gef()?", symbolic":""
return"CmapTable(platform "+s.a+", encoding "+s.b+", format "+s.d+r+")"}}
A.jd.prototype={
$2(a,b){var s=t.aq
s.a(a)
s.a(b)
return B.b.ab(a.gdH(),b.gdH())},
$S:73}
A.bw.prototype={
gdH(){var s,r,q,p,o,n,m,l,k,j,i,h=null,g=this.a,f=this.b
A:{s=3===g
r=s
if(r){r=10===f
q=f
p=!0}else{q=h
p=!1
r=!1}o=4
if(r){r=0
break A}n=0===g
r=n
if(r){if(p)r=q
else{r=f
q=r
p=!0}r=6===r}else r=!1
if(r){r=1
break A}if(n){if(p)r=q
else{r=f
q=r
p=!0}r=4===r}else r=!1
if(r){r=1
break A}m=h
if(s){if(p)r=q
else{r=f
q=r
p=!0}m=1===r
r=m
l=!0}else{l=!1
r=!1}if(r){r=2
break A}if(n){if(p)r=q
else{r=f
q=r
p=!0}r=3===r}else r=!1
if(r){r=3
break A}if(n){if(p)r=q
else{r=f
q=r
p=!0}r=2===r}else r=!1
if(r){r=o
break A}if(n)if(l)r=m
else{if(p)r=q
else{r=f
q=r
p=!0}m=1===r
r=m}else r=!1
if(r){r=o
break A}k=h
if(n){if(p)r=q
else{r=f
q=r
p=!0}k=0===r
r=k
j=!0}else{j=!1
r=!1}if(r){r=o
break A}if(s)if(j)r=k
else{if(p)r=q
else{r=f
q=r
p=!0}k=0===r
r=k
j=!0}else r=!1
if(r){r=5
break A}if(1===g)if(j)r=k
else{k=0===(p?q:f)
r=k}else r=!1
if(r){r=6
break A}r=9
break A}i=this.d
B:{if(12===i){o=0
break B}if(13===i){o=1
break B}if(4===i){o=2
break B}if(6===i){o=3
break B}if(0===i){o=4
break B}o=8
break B}return r*10+o},
q(a){return"cmap("+this.a+","+this.b+") format "+this.d}}
A.ic.prototype={
ah(a){var s
if(a>=0&&a<256){s=this.a
if(!(a>=0&&a<s.length))return A.a(s,a)
s=s[a]}else s=0
return s},
$idT:1}
A.ie.prototype={
ah(a){var s,r,q,p,o,n,m,l,k,j,i=this
if(a<0||a>65535)return 0
s=i.a
r=s.length
q=r-1
for(p=0,o=-1;p<=q;){n=B.b.K(p+q,1)
if(!(n<r))return A.a(s,n)
if(s[n]<a)p=n+1
else{q=n-1
o=n}}if(o>=0){s=i.b
if(!(o>=0&&o<s.length))return A.a(s,o)
s=a<s[o]}else s=!0
if(s)return 0
s=i.c
if(!(o>=0&&o<s.length))return A.a(s,o)
m=s[o]
s=i.d
if(!(o<s.length))return A.a(s,o)
l=s[o]
if(l===0)return a+m&65535
s=i.b
if(!(o<s.length))return A.a(s,o)
k=i.e+o*2+l+(a-s[o])*2
if(k<0||k+2>i.r)return 0
s=i.f
s.l(k,2)
j=s.a.getUint16(k,!1)
return j===0?0:j+m&65535},
$idT:1}
A.ig.prototype={
ah(a){var s,r=a-this.a
if(r>=0&&r<this.b.length){s=this.b
if(!(r>=0&&r<s.length))return A.a(s,r)
s=s[r]}else s=0
return s},
$idT:1}
A.id.prototype={
ah(a){var s,r,q,p,o,n=this,m=n.a,l=m.length,k=l-1
for(s=n.b,r=s.length,q=0;q<=k;){p=B.b.K(q+k,1)
if(!(p<l))return A.a(m,p)
o=m[p]
if(a<o)k=p-1
else{if(!(p<r))return A.a(s,p)
if(a>s[p])q=p+1
else{m=n.c
l=m.length
if(n.d){if(!(p<l))return A.a(m,p)
m=m[p]}else{if(!(p<l))return A.a(m,p)
m=m[p]+(a-o)}return m}}}return 0},
$idT:1}
A.lF.prototype={}
A.h5.prototype={
q(a){var s=this,r=s.ay===0?"short":"long"
return"HeadTable(unitsPerEm: "+s.f+", loca: "+r+", bbox: "+s.x+" "+s.y+" "+s.z+" "+s.Q+")"}}
A.jM.prototype={
cm(a){var s,r,q
if(a>=0){s=this.a.length
s=a>=s+this.c.length||s===0}else s=!0
if(s)return 0
s=this.a
r=s.length
q=a<r?a:r-1
if(!(q>=0&&q<r))return A.a(s,q)
return s[q]},
q(a){var s=this.a.length
return"HmtxTable("+(s+this.c.length)+" glyphs, "+s+" metric pairs)"}}
A.ec.prototype={
q(a){return A.v(this.a)+"\u2192"+A.v(this.b)}}
A.iT.prototype={
ir(a,b,c){var s,r,q,p,o,n=this.b,m=n.length
if(b>=m)return c
if(!(b<m))return A.a(n,b)
s=n[b]
n=s.length
if(n<2)return c
if(c<=B.a.gu(s).a)return B.a.gu(s).b
for(r=1;r<n;++r){q=s[r]
m=q.a
if(c>m)continue
p=s[r-1]
n=p.a
o=m-n
if(o<=0)return q.b
m=p.b
return m+(c-n)/o*(q.b-m)}return B.a.gN(s).b}}
A.dO.prototype={
q(a){var s=this
return"VariationAxis("+A.aJ(s.a)+" "+A.v(s.b)+"/"+A.v(s.c)+"/"+A.v(s.d)+")"}}
A.dH.prototype={
q(a){return"NamedInstance("+A.v(this.a)+")"}}
A.dx.prototype={
iw(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g
t.eM.a(a)
s=this.a
r=s.length
q=A.N(r,0,!1,t.i)
for(p=0;p<r;++p){o=s[p]
n=a.h(0,A.aJ(o.a))
if(n==null)n=o.c
m=o.b
l=o.d
k=B.c.E(n,m,l)
n=o.c
if(k<n){j=n-m
i=j>0?(k-n)/j:0}else if(k>n){j=l-n
i=j>0?(k-n)/j:0}else i=0
h=B.c.a1(i*16384)/16384
if(h<-1)n=-1
else n=h>1?1:h
B.a.m(q,p,n)}if(b!=null){g=A.un(b)
for(p=0;p<r;++p){h=B.c.a1(g.ir(0,p,q[p])*16384)/16384
if(h<-1)s=-1
else s=h>1?1:h
B.a.m(q,p,s)}}return q}}
A.jv.prototype={
$1(a){var s,r,q,p,o,n,m=this.a+a*this.b,l=this.c
l.l(m,4)
s=l.a
r=s.getUint32(m,!1)
q=m+4
l.l(q,4)
q=s.getInt32(q,!1)
p=m+8
l.l(p,4)
p=s.getInt32(p,!1)
o=m+12
l.l(o,4)
o=s.getInt32(o,!1)
n=m+16
l.l(n,2)
s.getUint16(n,!1)
n=m+18
l.l(n,2)
s.getUint16(n,!1)
return new A.dO(r,q/65536,p/65536,o/65536)},
$S:64}
A.jw.prototype={
$1(a){var s,r,q,p,o,n,m,l,k=this,j=k.a+a*k.b
if(k.c){s=k.d
r=j+4+k.e*4
s.l(r,2)
s.a.getUint16(r,!1)}s=k.d
s.l(j,2)
r=s.a
r.getUint16(j,!1)
q=j+2
s.l(q,2)
r.getUint16(q,!1)
p=k.e
o=J.aW(p,t.i)
for(q=j+4,n=0;n<p;++n){m=q+n*4
if(m>=0)l=m+4<=r.byteLength
else l=!1
if(!l)A.t(A.k("read of 4 byte(s) at "+m+" overruns a "+s.gk(0)+"-byte font"))
o[n]=r.getInt32(m,!1)/65536}return new A.dH(o)},
$S:95}
A.iv.prototype={
bs(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
t.H.a(a)
for(s=this.b,r=s.length,q=this.a,p=q.length,o=this.c,n=o.length,m=a.length,l=1,k=0;k<r;++k){j=s[k]
if(j===0)continue
i=k<m?a[k]:0
if(i===j)continue
if(!(k<p))return A.a(q,k)
h=q[k]
if(!(k<n))return A.a(o,k)
g=o[k]
f=!0
if(!(h>j))if(!(j>g))if(h<0)f=g>0
else f=!1
if(f)continue
if(i<=h||g<=i)return 0
l*=i<j?(i-h)/(j-h):(g-i)/(g-j)}return l}}
A.il.prototype={}
A.ji.prototype={
gk(a){return this.c},
h(a,b){var s,r,q,p,o,n,m,l,k,j=this
A.D(b)
s=j.c
if(s===0)return new A.f(0,b)
if(b>=s)r=s-1
else r=b<0?0:b
s=j.d
q=j.b+r*s
for(p=j.a,o=p.a,n=0,m=0;m<s;++m){l=q+m
if(l>=0)k=l+1<=o.byteLength
else k=!1
if(!k)A.t(A.k("read of 1 byte(s) at "+l+" overruns a "+p.gk(0)+"-byte font"))
n=(n<<8|o.getUint8(l))>>>0}s=j.e
return new A.f(B.b.ba(n,s),(n&B.b.a4(1,s)-1)>>>0)}}
A.ha.prototype={
cu(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e="read of 2 byte(s) at "
t.H.a(c)
s=this.c
r=s.length
if(a>=r)return 0
if(!(a<r))return A.a(s,a)
q=s[a]
if(b<0||b>=q.a)return 0
p=q.e+b*q.f
for(s=q.b,r=s.length,o=this.b,n=this.a,m=q.d,l=q.c,k=n.a,j=0,i=0;i<r;++i){if(i<l)if(m){if(p>=0)h=p+4<=k.byteLength
else h=!1
if(!h)A.t(A.k("read of 4 byte(s) at "+p+" overruns a "+n.gk(0)+"-byte font"))
g=k.getInt32(p,!1)
p+=4}else{if(p>=0)h=p+2<=k.byteLength
else h=!1
if(!h)A.t(A.k(e+p+" overruns a "+n.gk(0)+"-byte font"))
g=k.getInt16(p,!1)
p+=2}else if(m){if(p>=0)h=p+2<=k.byteLength
else h=!1
if(!h)A.t(A.k(e+p+" overruns a "+n.gk(0)+"-byte font"))
g=k.getInt16(p,!1)
p+=2}else{if(p>=0)h=p+1<=k.byteLength
else h=!1
if(!h)A.t(A.k("read of 1 byte(s) at "+p+" overruns a "+n.gk(0)+"-byte font"))
g=k.getInt8(p);++p}if(g===0)continue
h=s[i]
if(!(h<o.length))return A.a(o,h)
f=o[h].bs(c)
if(f!==0)j+=g*f}return j},
hW(a,b){var s,r
t.H.a(b)
s=this.d
if(s==null)return this.cu(0,a,b)
r=s.h(0,a)
return this.cu(r.a,r.b,b)}}
A.jQ.prototype={
$1(a){var s,r=this.a,q=this.b+6+a*2
r.l(q,2)
s=r.a.getUint16(q,!1)
if(s>=this.c.length)throw A.e(A.k("region index "+s+" out of range"))
return s},
$S:13}
A.c4.prototype={}
A.i2.prototype={
O(a){return 0}}
A.i3.prototype={
O(a){var s,r=a-this.a
if(r>=0&&r<this.b.length){s=this.b
if(!(r>=0&&r<s.length))return A.a(s,r)
s=s[r]}else s=0
return s}}
A.i4.prototype={
O(a){var s,r,q,p,o=this.a,n=o.length,m=(n/3|0)-1
for(s=0;s<=m;){r=B.b.K(s+m,1)
q=r*3
if(!(q<n))return A.a(o,q)
if(a<o[q])m=r-1
else{p=q+1
if(!(p<n))return A.a(o,p)
if(a>o[p])s=r+1
else{p=q+2
if(!(p<n))return A.a(o,p)
return o[p]}}}return 0}}
A.fW.prototype={
iS(a){var s,r,q,p,o,n,m,l,k=this,j=k.c
if(j===32768)return 0
s=k.a
if(a<s||a>k.b)return 0
r=B.b.a4(1,j)
q=B.b.aa(16,r)
p=a-s
o=B.b.aa(p,q)
j=k.d
s=j.length
if(o>=s)return 0
n=B.b.T(p,q)
m=B.b.a4(1,r)
if(!(o>=0))return A.a(j,o)
l=B.b.bF(j[o],16-r*(n+1))&m-1
return l>=B.b.a8(1,r-1)?l-m:l},
q(a){var s=this.c,r=""+this.a,q=""+this.b
return s===32768?"VariationIndex("+r+"/"+q+")":"Device("+r+"\u2026"+q+", fmt "+s+")"}}
A.dg.prototype={
q(a){return"Anchor("+this.a+","+this.b+")"}}
A.bx.prototype={}
A.i7.prototype={
G(a){var s,r,q,p=this.a,o=p.length,n=o-1
for(s=0;s<=n;){r=B.b.K(s+n,1)
if(!(r<o))return A.a(p,r)
q=p[r]
if(a<q)n=r-1
else if(a>q)s=r+1
else return r}return-1}}
A.i8.prototype={
G(a){var s,r,q,p,o,n=this.a,m=n.length,l=(m/3|0)-1
for(s=0;s<=l;){r=B.b.K(s+l,1)
q=r*3
if(!(q<m))return A.a(n,q)
p=n[q]
if(a<p)l=r-1
else{o=q+1
if(!(o<m))return A.a(n,o)
if(a>n[o])s=r+1
else{o=q+2
if(!(o<m))return A.a(n,o)
return n[o]+(a-p)}}}return-1}}
A.dy.prototype={
ij(a,b){var s,r,q,p,o,n=this.r
if(n!=null)s=a>=n.length
else s=!0
if(s)return!1
if(!(a<n.length))return A.a(n,a)
r=n[a]
if(r==null){s=this.a
q=this.d
p=q+4+a*4
s.l(p,4)
s=s.a
o=s.getUint32(p,!1)
if(o===0)return!1
r=A.Z(new A.r(s,q+o))
B.a.m(n,a,r)}return r.G(b)>=0},
giT(){var s,r=this
if(r.z)return r.y
r.z=!0
s=r.f
if(s===0)return null
return r.y=A.qW(new A.r(r.a.a,s))},
q(a){return"GdefTable(1."+this.w+")"}}
A.cG.prototype={
ei(a){var s=this.b,r=this.a.w
if(!(a>=0&&a<r.length))return A.a(r,a)
r=r[a]+2
s.l(r,2)
return s.a.getUint16(r,!1)},
ej(a){var s,r,q,p=this.a.w
if(!(a>=0&&a<p.length))return A.a(p,a)
s=p[a]
p=this.b
r=s+2
p.l(r,2)
q=p.a
if((q.getUint16(r,!1)&16)===0)return 0
r=s+4
p.l(r,2)
r=s+6+q.getUint16(r,!1)*2
p.l(r,2)
return q.getUint16(r,!1)},
d_(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this.c
if(!(a>=0&&a<g.length))return A.a(g,a)
s=g[a]
if(s!=null)return s
r=this.a.w
if(!(a<r.length))return A.a(r,a)
q=r[a]
r=this.b
r.l(q,2)
p=r.a
o=p.getUint16(q,!1)
n=q+4
r.l(n,2)
m=p.getUint16(n,!1)
l=A.b([],t.fT)
for(n=q+6,k=0;k<m;++k){j=n+k*2
if(j>=0)i=j+2<=p.byteLength
else i=!1
if(!i)A.t(A.k("read of 2 byte(s) at "+j+" overruns a "+r.gk(0)+"-byte font"))
h=A.tF(o,new A.r(p,q+p.getUint16(j,!1)),9)
B.a.j(l,A.v5(h.a,h.b))}B.a.m(g,a,l)
return l},
hM(a,b,c,d,e){var s,r,q,p,o,n,m,l=this
t.nE.a(c)
if(a<0||a>=l.a.w.length)return!1
s=l.d_(a)
if(s.length===0||b.a.length===0)return!1
r=new A.jH(b,l,e,d,c,0,0)
q=l.ei(a)
p=l.ej(a)
r.x=q
r.y=p
for(q=b.a,o=!1,p=0;n=q.length,p<n;){if(!(p>=0))return A.a(q,p)
m=q[p]
if((m.y&e)>>>0!==0){n=r.Q
n=!(n==null?r.Q=new A.aP(b,r.x,r.y,d):n).aP(m)}else n=!1
if(!(n&&A.qQ(s,r)))p=++r.w
else{n=r.w
if(n<=p){++p
r.w=p}else p=n
o=!0}}return o},
hN(a,b){var s=this.a.w.length
if(a>=s)return!1
return A.qQ(this.d_(a),b)},
q(a){return"GposTable("+this.a.q(0)+")"},
$iv4:1}
A.hh.prototype={}
A.jH.prototype={
gt(a){var s=this,r=s.Q
return r==null?s.Q=new A.aP(s.a,s.x,s.y,s.d):r},
iE(a){var s,r,q,p,o,n=this,m=n.z
if(m===0)return!1
s=n.x
r=n.y
n.z=m-1
m=n.b
q=m.ei(a)
p=m.ej(a)
n.x=q
n.y=p
n.Q=null
o=m.hN(a,n)
n.x=s
n.y=r
n.Q=null;++n.z
return o},
du(a,b,c,d){t.mA.a(c)
if(b&&(a.y&this.c)>>>0===0)return 1
if(c==null)return 2
return c.$2(a,d)?0:1},
cG(a,b,c,d,e){var s,r,q,p,o,n
t.mA.a(d)
for(s=this.a.a,r=b;;){r=a.cF(r)
if(r<0)return-1
if(!(r<s.length))return A.a(s,r)
q=s[r]
p=this.du(q,e,d,c)
o=q.e===5
if(p!==0)n=p===2&&!o
else n=!0
if(n)return r
if(!o)return-1}},
el(a,b){return this.cG(a,b,0,null,!0)},
iu(a,b,c,d){return this.cG(a,b,c,d,!0)},
ep(a,b,c,d,e){var s,r,q,p,o,n
t.mA.a(d)
for(s=this.a.a,r=b;;){r=a.eo(r)
if(r<0)return-1
if(!(r<s.length))return A.a(s,r)
q=s[r]
p=this.du(q,e,d,c)
o=q.e===5
if(p!==0)n=p===2&&!o
else n=!0
if(n)return r
if(!o)return-1}},
cH(a,b){return this.ep(a,b,0,null,!0)},
bg(a,b){var s,r,q,p,o=this
if(a.c===32768){s=o.d
r=s==null?null:s.giT()
q=o.e
if(r==null||q==null||q.length===0)return 0
return B.c.Y(r.cu(a.a,a.b,q))}p=b?o.r:o.f
return p===0?0:a.iS(p)},
bJ(a){var s,r=a.a,q=a.b,p=a.d
if(p!=null)r+=this.bg(p,!1)
s=a.e
return new A.f(r,s!=null?q+this.bg(s,!0):q)}}
A.aL.prototype={}
A.op.prototype={
$0(){var s,r=this.b,q=this.a,p=q.a
r.l(p,2)
s=r.a.getInt16(p,!1)
q.a+=2
return s},
$S:7}
A.oo.prototype={
$0(){var s,r=this.b,q=this.a,p=q.a
r.l(p,2)
s=r.a.getUint16(p,!1)
q.a+=2
return s},
$S:7}
A.eT.prototype={
V(a){var s,r,q,p=this,o=a.a,n=o.a,m=a.w
if(!(m>=0&&m<n.length))return A.a(n,m)
s=p.c.G(n[m].a)
if(s<0)return!1
if(p.e){n=p.b
r=n+6}else{n=p.a
m=p.b
q=m+6
n.l(q,2)
if(s>=n.a.getUint16(q,!1))return!1
r=m+8+s*A.pG(p.d)
n=m}o=o.b
m=a.w
if(!(m>=0&&m<o.length))return A.a(o,m)
A.q3(a,p.a,n,r,p.d,o[m]);++a.w
return!0}}
A.eN.prototype={
V(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=a.w,d=f.c,c=a.a,b=c.a
if(!(e>=0&&e<b.length))return A.a(b,e)
if(d.G(b[e].a)<0)return!1
s=a.el(a.gt(0),e)
if(s<0)return!1
r=f.d
q=A.pG(r)
p=f.e
o=A.pG(p)
n=b.length
if(f.f===1){if(!(e<n))return A.a(b,e)
n=f.b
m=f.a
d=n+10+d.G(b[e].a)*2
m.l(d,2)
l=n+m.a.getUint16(d,!1)
if(!(s<b.length))return A.a(b,s)
k=f.fC(l,b[s].a,q+o)
if(k<0)return!1
j=k+2
i=l}else{d=f.r
d.toString
if(!(e<n))return A.a(b,e)
h=d.O(b[e].a)
d=f.w
d.toString
if(!(s<b.length))return A.a(b,s)
g=d.O(b[s].a)
if(h>=f.x||g>=f.y)return!1
i=f.b
j=i+16+(h*f.y+g)*(q+o)}d=f.a
c=c.b
if(!(e<c.length))return A.a(c,e)
A.q3(a,d,i,j,r,c[e])
if(!(s<c.length))return A.a(c,s)
A.q3(a,d,i,j+q,p,c[s])
a.w=o!==0?s+1:s
return!0},
fC(a,b,c){var s,r,q,p,o,n,m,l,k,j=this.a
j.l(a,2)
s=j.a
r=2+c
q=s.getUint16(a,!1)-1
for(p=a+2,o=0;o<=q;){n=B.b.K(o+q,1)
m=p+n*r
if(m>=0)l=m+2<=s.byteLength
else l=!1
if(!l)A.t(A.k("read of 2 byte(s) at "+m+" overruns a "+j.gk(0)+"-byte font"))
k=s.getUint16(m,!1)
if(b<k)q=n-1
else if(b>k)o=n+1
else return m}return-1}}
A.fU.prototype={
V(a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a4.w,a1=this.c,a2=a4.a,a3=a2.a
if(!(a0>=0&&a0<a3.length))return A.a(a3,a0)
s=a1.G(a3[a0].a)
if(s<0)return!1
r=this.a
q=this.b
p=q+6
o=p+s*4+2
r.l(o,2)
n=r.a
m=n.getUint16(o,!1)
if(m===0)return!1
l=a4.el(a4.gt(0),a0)
if(l<0)return!1
if(!(l<a3.length))return A.a(a3,l)
k=a1.G(a3[l].a)
if(k<0)return!1
a1=p+k*4
r.l(a1,2)
j=n.getUint16(a1,!1)
if(j===0)return!1
i=a4.bJ(A.iR(new A.r(n,q+m)))
h=i.a
g=a4.bJ(A.iR(new A.r(n,q+j)))
f=g.a
e=a2.b
a1=a2.c
a2=e.length
if(a1===B.l){if(!(a0<a2))return A.a(e,a0)
a1=e[a0]
a3=a1.c
d=h+a3
a1.a-=d
a1.c=a3-d
if(!(l<a2))return A.a(e,l)
a2=e[l]
a2.a=f+a2.c}else{if(!(a0<a2))return A.a(e,a0)
a1=e[a0]
a1.a=h+a1.c
if(!(l<a2))return A.a(e,l)
a2=e[l]
a1=a2.c
d=f+a1
a2.a-=d
a2.c=a1-d}c=g.b-i.b
if((a4.x&1)===0){c=-c
b=a0
a=l}else{b=l
a=a0}A.qH(e,a,b)
a1=e.length
if(!(a<a1))return A.a(e,a)
a2=e[a]
a2.f=2
a3=b-a
a2.e=a3
a2.d=c
if(!(b<a1))return A.a(e,b)
a1=e[b]
if(a1.e===-a3)a1.e=0;++a4.w
return!0}}
A.fc.prototype={
O(a){var s=this.a,r=this.b+2+a*4
s.l(r,2)
return s.a.getUint16(r,!1)}}
A.f4.prototype={
cp(a,b,c){var s,r,q,p=this,o=!0
if(a>=0)if(b<c){o=p.a
s=p.b
o.l(s,2)
s=a>=o.a.getUint16(s,!1)
o=s}if(o)return null
o=p.a
s=p.b
r=s+2+(a*c+b)*2
o.l(r,2)
o=o.a
q=o.getUint16(r,!1)
return q===0?null:A.iR(new A.r(o,s+q))}}
A.hi.prototype={
V(a){var s,r,q,p,o,n=this,m=a.a,l=m.a,k=a.w
if(!(k>=0&&k<l.length))return A.a(l,k)
s=n.a.G(l[k].a)
if(s<0)return!1
r=new A.aP(m,8,a.y,a.d)
q=a.w
for(;;){p=a.cH(r,q)
if(p<0)return!1
if(!(p<l.length))return A.a(l,p)
q=p
break}if(!(q>=0&&q<l.length))return A.a(l,q)
o=n.b.G(l[q].a)
if(o<0)return!1
m=n.d
return A.pM(a,m,s,n.e.cp(o,m.O(s),n.c),q)}}
A.hj.prototype={
V(a){var s,r,q,p,o,n,m,l,k,j=this,i=a.a,h=i.a,g=a.w
if(!(g>=0&&g<h.length))return A.a(h,g)
s=j.b.G(h[g].a)
if(s<0)return!1
r=a.cH(new A.aP(i,8,a.y,a.d),a.w)
if(r<0)return!1
if(!(r<h.length))return A.a(h,r)
q=j.c.G(h[r].a)
if(q<0)return!1
i=j.a
g=j.f
i.l(g,2)
p=i.a
if(q>=p.getUint16(g,!1))return!1
o=g+2+q*2
i.l(o,2)
o=g+p.getUint16(o,!1)
i.l(o,2)
n=p.getUint16(o,!1)
if(n===0)return!1
g=a.w
p=h.length
if(!(g>=0&&g<p))return A.a(h,g)
m=h[g]
if(!(r<p))return A.a(h,r)
h=h[r].w
if(h!==0&&h===m.w&&m.x>0){l=m.x
k=(l<n?l:n)-1}else k=n-1
h=j.e
return A.pM(a,h,s,new A.f4(i,o).cp(k,h.O(s),j.d),r)}}
A.hk.prototype={
V(a){var s,r,q,p,o=this,n=a.a,m=n.a,l=a.w
if(!(l>=0&&l<m.length))return A.a(m,l)
s=o.a.G(m[l].a)
if(s<0)return!1
r=a.cH(new A.aP(n,a.x&4294967281,a.y,a.d),a.w)
if(r<0)return!1
n=m.length
if(!(r<n))return A.a(m,r)
q=m[r]
if(q.f!==3)return!1
l=a.w
if(!(l>=0&&l<n))return A.a(m,l)
if(!A.vs(m[l],q))return!1
p=o.b.G(q.a)
if(p<0)return!1
n=o.d
return A.pM(a,n,s,o.e.cp(p,n.O(s),o.c),r)}}
A.du.prototype={
V(a){var s,r,q,p=this,o=a.a.a,n=a.w
if(!(n>=0&&n<o.length))return A.a(o,n)
s=o[n].a
switch(p.c){case 1:r=p.d.G(s)
if(r<0)return!1
return p.d6(a,r,A.oG(),!1)
case 2:if(p.d.G(s)<0)return!1
o=p.e
q=o.O(s)
return p.d6(a,q,new A.je(o),!0)
default:return p.bY(a)}},
d6(a,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b="read of 2 byte(s) at "
t.dW.a(a1)
s=this.a
r=this.b
q=r+(a2?6:4)
s.l(q,2)
p=s.a
o=p.getUint16(q,!1)
if(a0<0||a0>=o)return!1
q=r+(a2?8:6)+a0*2
s.l(q,2)
n=p.getUint16(q,!1)
if(n===0)return!1
m=r+n
s.l(m,2)
l=p.getUint16(m,!1)
for(r=m+2,k=0;k<l;++k){q=r+k*2
if(q>=0)j=q+2<=p.byteLength
else j=!1
if(!j)A.t(A.k(b+q+" overruns a "+s.gk(0)+"-byte font"))
i=p.getUint16(q,!1)
if(i===0)continue
h=m+i
if(h>=0)q=h+2<=p.byteLength
else q=!1
if(!q)A.t(A.k(b+h+" overruns a "+s.gk(0)+"-byte font"))
g=p.getUint16(h,!1)
q=h+2
if(q>=0)j=q+2<=p.byteLength
else j=!1
if(!j)A.t(A.k(b+q+" overruns a "+s.gk(0)+"-byte font"))
f=p.getUint16(q,!1)
e=h+4
d=A.mZ(a,g,e,s,a1)
if(d==null)continue
c=A.oc(s,e+(g===0?0:g-1)*2,f)
A.mh(a,d,c,d.length===0?a.w+1:B.a.gN(d)+1)
return!0}return!1},
bY(a){var s,r,q,p,o,n,m=this.a,l=this.b,k=l+2
m.l(k,2)
s=m.a
r=s.getUint16(k,!1)
if(r===0)return!1
k=l+4
m.l(k,2)
q=s.getUint16(k,!1)
p=l+6
m.l(p,2)
o=A.Z(new A.r(s,l+s.getUint16(p,!1)))
k=a.a.a
s=a.w
if(!(s>=0&&s<k.length))return A.a(k,s)
if(o.G(k[s].a)<0)return!1
n=A.mZ(a,r,p+2,m,A.t2(m,l))
if(n==null)return!1
A.mh(a,n,A.oc(m,p+r*2,q),B.a.gN(n)+1)
return!0}}
A.je.prototype={
$2(a,b){return this.a.O(a.a)===b},
$S:9}
A.my.prototype={
$2(a,b){var s=this.a,r=s.h(0,b)
if(r==null){r=A.Z(new A.r(this.b.a,this.c+b))
s.m(0,b,r)
s=r}else s=r
return s.G(a.a)>=0},
$S:9}
A.dm.prototype={
V(a){var s,r,q,p=this,o=a.a.a,n=a.w
if(!(n>=0&&n<o.length))return A.a(o,n)
s=o[n].a
switch(p.c){case 1:r=p.d.G(s)
if(r<0)return!1
return p.d7(a,r,4,A.oG(),A.oG(),A.oG())
case 2:if(p.d.G(s)<0)return!1
o=p.e
o.toString
n=p.f
n.toString
q=p.r
q.toString
return p.d7(a,n.O(s),10,new A.iX(o),new A.iY(n),new A.iZ(q))
default:return p.bY(a)}},
d7(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j,i=t.dW
i.a(d)
i.a(e)
i.a(f)
i=this.a
s=this.b
r=s+c
i.l(r,2)
q=i.a
p=q.getUint16(r,!1)
if(b<0||b>=p)return!1
r=r+2+b*2
i.l(r,2)
o=q.getUint16(r,!1)
if(o===0)return!1
n=s+o
i.l(n,2)
m=q.getUint16(n,!1)
for(s=n+2,l=0;l<m;++l){r=s+l*2
if(r>=0)k=r+2<=q.byteLength
else k=!1
if(!k)A.t(A.k("read of 2 byte(s) at "+r+" overruns a "+i.gk(0)+"-byte font"))
j=q.getUint16(r,!1)
if(j===0)continue
if(this.f6(a,n+j,d,e,f))return!0}return!1},
f6(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h=t.dW
h.a(c)
h.a(d)
h.a(e)
h=this.a
h.l(b,2)
s=h.a
r=s.getUint16(b,!1)
q=b+2
p=q+r*2
h.l(p,2)
o=s.getUint16(p,!1)
n=p+2
p=n+(o===0?0:o-1)*2
h.l(p,2)
m=s.getUint16(p,!1)
l=p+2
p=l+m*2
h.l(p,2)
k=s.getUint16(p,!1)
j=A.mZ(a,o,n,h,d)
if(j==null)return!1
i=j.length===0?a.w+1:B.a.gN(j)+1
if(!A.tb(a,m,l,h,e,i))return!1
if(!A.ta(a,r,q,h,c))return!1
A.mh(a,j,A.oc(h,p+2,k),i)
return!0},
bY(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this.b,e=f+2,d=this.a
d.l(e,2)
s=d.a
r=s.getUint16(e,!1)
q=e+2
e=q+r*2
d.l(e,2)
p=s.getUint16(e,!1)
o=e+2
e=o+p*2
d.l(e,2)
n=s.getUint16(e,!1)
m=e+2
e=m+n*2
d.l(e,2)
l=s.getUint16(e,!1)
if(p===0)return!1
d.l(o,2)
k=A.Z(new A.r(s,f+s.getUint16(o,!1)))
s=a.a.a
j=a.w
if(!(j>=0&&j<s.length))return A.a(s,j)
if(k.G(s[j].a)<0)return!1
i=A.t2(d,f)
h=A.mZ(a,p,o+2,d,i)
if(h==null)return!1
g=B.a.gN(h)+1
if(!A.tb(a,n,m,d,i,g))return!1
if(!A.ta(a,r,q,d,i))return!1
A.mh(a,h,A.oc(d,e+2,l),g)
return!0}}
A.j_.prototype={
$1(a){var s,r=this.a
r.l(a,2)
r=r.a
s=r.getUint16(a,!1)
return s===0?B.k:A.cB(new A.r(r,this.b+s))},
$S:29}
A.iX.prototype={
$2(a,b){return this.a.O(a.a)===b},
$S:9}
A.iY.prototype={
$2(a,b){return this.a.O(a.a)===b},
$S:9}
A.iZ.prototype={
$2(a,b){return this.a.O(a.a)===b},
$S:9}
A.ii.prototype={}
A.cH.prototype={
hL(a,b,c,d){var s,r,q=this
if(b.a.length===0)return!1
s=q.dt(a)
if(s.d.length===0)return!1
r=new A.eu(b,d,c,0,q.gha())
r.bV(s.b,s.c)
return s.a===8?q.f3(s,r):q.f4(s,r)},
f4(a,b){var s,r,q,p,o,n,m,l,k,j,i=b.a
b.f=0
for(s=i.a,r=b.b,q=b.c,p=a.d,o=!1,n=0;m=s.length,n<m;){if(!(n>=0))return A.a(s,n)
l=s[n]
if((l.y&r)>>>0!==0){m=b.y
m=!(m==null?b.y=new A.aP(i,b.w,b.x,q):m).aP(l)}else m=!1
k=!1
if(m)for(m=p.length,j=0;j<p.length;p.length===m||(0,A.h)(p),++j)if(p[j].V(b)){k=!0
break}if(!k){++n
b.f=n
continue}m=b.f
if(m<=n){++n
b.f=n}else n=m
o=!0}return o},
f3(a,b){var s,r,q,p,o,n,m,l,k=b.a
for(s=k.a,r=b.f=s.length-1,q=a.d,p=b.b,o=b.c,n=!1;r>=0;r=--b.f){if(!(r<s.length))return A.a(s,r)
m=s[r]
if((m.y&p)>>>0===0)continue
r=b.y
if((r==null?b.y=new A.aP(k,b.w,b.x,o):r).aP(m))continue
for(r=q.length,l=0;l<q.length;q.length===r||(0,A.h)(q),++l)if(q[l].V(b)){n=!0
break}}return n},
hb(a,b){var s,r,q,p,o,n,m
if(a.r>=64)return!1
if(b>=this.b.length)return!1
s=a.f
if(s<0||s>=a.a.a.length)return!1
r=this.dt(b)
q=a.w
p=a.x
a.bV(r.b,r.c);++a.r
s=r.d
n=s.length
m=0
for(;;){if(!(m<s.length)){o=!1
break}if(s[m].V(a)){o=!0
break}s.length===n||(0,A.h)(s);++m}--a.r
a.bV(q,p)
return o},
dt(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(a<0||a>=this.b.length)throw A.e(A.k("GSUB lookup index "+a+" out of range"))
s=this.b
if(!(a>=0&&a<s.length))return A.a(s,a)
r=s[a]
if(r!=null)return r
q=this.a
p=q.a.a
o=new A.r(p,q.b)
q=q.w
if(!(a<q.length))return A.a(q,a)
n=q[a]
o.l(n,2)
m=p.getUint16(n,!1)
q=n+2
o.l(q,2)
l=p.getUint16(q,!1)
q=n+4
o.l(q,2)
k=p.getUint16(q,!1)
if((l&16)!==0){q=n+6+k*2
o.l(q,2)
j=p.getUint16(q,!1)}else j=0
i=A.b([],t.fL)
for(q=n+6,h=0;h<k;++h){g=q+h*2
if(g>=0)f=g+2<=p.byteLength
else f=!1
if(!f)A.t(A.k("read of 2 byte(s) at "+g+" overruns a "+o.gk(0)+"-byte font"))
B.a.j(i,A.z9(m,new A.r(p,n+p.getUint16(g,!1))))}q=new A.ii(i.length===0?m:B.a.gu(i).gL(),l,j,i)
B.a.m(s,a,q)
return q},
q(a){return"GsubTable("+this.b.length+" lookups, "+this.a.q(0)+")"}}
A.hB.prototype={
q(a){return"SequenceLookupRecord("+this.a+" \u2192 "+this.b+")"}}
A.eu.prototype={
bV(a,b){var s=this
if(a===s.w&&b===s.x)return
s.w=a
s.x=b
s.y=null},
gt(a){var s=this,r=s.y
return r==null?s.y=new A.aP(s.a,s.w,s.x,s.c):r},
bW(a,b,c){var s,r,q=this.a.a
if(!(a>=0&&a<q.length))return A.a(q,a)
s=q[a]
s.a=b
r=this.c
if(r!=null&&r.b!==B.k){s.f=r.b.O(b)
s.r=r.c.O(b)}else if(c!==0)s.f=c},
bv(a,b){return this.bW(a,b,0)}}
A.aF.prototype={}
A.eU.prototype={
gL(){return 1},
hv(a){var s,r=this.a.G(a)
if(r<0)return null
s=this.c
if(s==null)return a+this.b&65535
return r<s.length?s[r]:null},
V(a){var s,r=a.a.a,q=a.f
if(!(q>=0&&q<r.length))return A.a(r,q)
s=this.hv(r[q].a)
if(s==null)return!1
a.bv(a.f,s);++a.f
return!0}}
A.hm.prototype={
gL(){return 2},
V(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=a.a,e=f.a,d=a.f
if(!(d>=0&&d<e.length))return A.a(e,d)
s=g.a.G(e[d].a)
if(s<0||s>=g.c.length)return!1
d=g.d
if(!(s>=0&&s<d.length))return A.a(d,s)
r=d[s]
if(r==null){q=g.b
p=g.c
if(!(s<p.length))return A.a(p,s)
p=p[s]
o=q.a
q.l(p,2)
r=new A.r(o,p+2).a0(o.getUint16(p,!1))
B.a.m(d,s,r)}d=r.length
if(d===1){f=a.f
if(0>=d)return A.a(r,0)
a.bv(f,r[0]);++a.f
return!0}if(d===0){B.a.aM(e,a.f)
B.a.aM(f.b,a.f)
return!0}n=a.f
if(!(n>=0&&n<e.length))return A.a(e,n)
m=e[n]
l=m.f===2?1:0
k=m.w
j=A.b([],t.R)
for(q=k===0,i=0;i<d;++i){h=new A.aH(m.a,m.b,m.c,m.d,m.e,m.f,m.r,m.w,m.x,m.y,!1)
if(q){h.w=0
h.x=i}B.a.j(j,h)}B.a.aM(e,n)
f=f.b
B.a.aM(f,n)
B.a.cD(e,n,j)
e=A.b([],t.q)
for(i=0;i<d;++i)e.push(new A.cb(0))
B.a.cD(f,n,e)
for(i=0;i<d;++i)a.bW(n+i,r[i],l)
a.f=n+d
return!0}}
A.fE.prototype={
gL(){return 3},
V(a){var s,r,q,p,o=this,n=a.a.a,m=a.f
if(!(m>=0&&m<n.length))return A.a(n,m)
s=o.a.G(n[m].a)
if(s<0||s>=o.c.length)return!1
n=o.d
if(!(s>=0&&s<n.length))return A.a(n,s)
r=n[s]
if(r==null){m=o.b
q=o.c
if(!(s<q.length))return A.a(q,s)
q=q[s]
p=m.a
m.l(q,2)
r=new A.r(p,q+2).a0(p.getUint16(q,!1))
B.a.m(n,s,r)}n=a.d
if(n>=r.length)return!1
a.bv(a.f,r[n]);++a.f
return!0}}
A.d5.prototype={}
A.hg.prototype={
gL(){return 4},
fP(a){var s,r,q,p,o=this,n=o.d
if(!(a>=0&&a<n.length))return A.a(n,a)
s=n[a]
if(s!=null)return s
r=o.c
if(!(a<r.length))return A.a(r,a)
q=r[a]
r=o.b
r.l(q,2)
p=A.eC(r.a.getUint16(q,!1),new A.jW(o,q),!1,t.nx)
B.a.m(n,a,p)
return p},
V(a){var s,r,q,p,o,n=a.a.a,m=a.f
if(!(m>=0&&m<n.length))return A.a(n,m)
s=this.a.G(n[m].a)
if(s<0||s>=this.c.length)return!1
for(n=this.fP(s),m=n.length,r=0;r<m;++r){q=n[r]
p=q.b
o=A.oR(a,p.length+1,new A.jX(p))
if(o==null)continue
A.xQ(a,o,q.a)
return!0}return!1}}
A.jW.prototype={
$1(a){var s,r,q,p=this.b,o=this.a.b,n=p+2+a*2
o.l(n,2)
s=o.a
r=p+s.getUint16(n,!1)
n=r+2
o.l(n,2)
q=s.getUint16(n,!1)
o.l(r,2)
o=s.getUint16(r,!1)
p=q===0?0:q-1
return new A.d5(o,new A.r(s,r+4).a0(p))},
$S:59}
A.jX.prototype={
$2(a,b){var s=this.a,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===b},
$S:3}
A.bV.prototype={}
A.dX.prototype={
gk(a){return this.b.length},
h(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g=this
A.D(b)
if(b<0||b>=g.b.length)return B.R
s=g.d
if(!(b>=0&&b<s.length))return A.a(s,b)
r=s[b]
if(r!=null)return r
q=g.b
if(!(b<q.length))return A.a(q,b)
p=q[b]
if(p===0){B.a.m(s,b,B.R)
return B.R}q=g.a
q.l(p,2)
o=q.a
n=o.getUint16(p,!1)
m=J.aW(n,t.kr)
for(l=g.c,k=p+2,j=0;j<n;++j){i=k+j*2
if(i>=0)h=i+2<=o.byteLength
else h=!1
if(!h)A.t(A.k("read of 2 byte(s) at "+i+" overruns a "+q.gk(0)+"-byte font"))
m[j]=l.$2(q,p+o.getUint16(i,!1))}B.a.m(s,b,m)
return m}}
A.n2.prototype={
$1(a){var s,r=this.a,q=this.b+a*2
r.l(q,2)
s=r.a.getUint16(q,!1)
return s===0?0:this.c+s},
$S:13}
A.fQ.prototype={
gL(){return 5},
V(a){var s,r,q,p=a.a.a,o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
s=this.a.G(p[o].a)
if(s<0)return!1
for(p=this.b.h(0,s),o=p.length,r=0;r<o;++r){q=p[r]
if(A.mY(a,q,A.oH(),new A.jf(q),A.oH()))return!0}return!1}}
A.jf.prototype={
$2(a,b){var s=this.a.b,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===b},
$S:3}
A.fR.prototype={
gL(){return 5},
V(a){var s,r,q=this,p=a.a.a,o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
if(q.a.G(p[o].a)<0)return!1
o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
for(p=q.c.h(0,q.b.O(p[o].a)),o=p.length,s=0;s<o;++s){r=p[s]
if(A.mY(a,r,A.oH(),new A.jg(q,r),A.oH()))return!0}return!1}}
A.jg.prototype={
$2(a,b){var s=this.b.b,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===this.a.b.O(b)},
$S:3}
A.fS.prototype={
gL(){return 5},
V(a){var s,r,q,p=this.a,o=p.length
if(o===0)return!1
if(0>=o)return A.a(p,0)
p=p[0]
s=a.a.a
r=a.f
if(!(r>=0&&r<s.length))return A.a(s,r)
if(p.G(s[r].a)<0)return!1
q=A.oR(a,o,new A.jh(this))
if(q==null)return!1
p=q.length
o=p-1
if(!(o>=0))return A.a(q,o)
A.q2(a,q,q[o]+1,this.b)
return!0}}
A.jh.prototype={
$2(a,b){var s=this.a.a
if(!(a<s.length))return A.a(s,a)
return s[a].G(b)>=0},
$S:3}
A.fI.prototype={
gL(){return 6},
V(a){var s,r,q,p=a.a.a,o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
s=this.a.G(p[o].a)
if(s<0)return!1
for(p=this.b.h(0,s),o=p.length,r=0;r<o;++r){q=p[r]
if(A.mY(a,q,new A.j0(q),new A.j1(q),new A.j2(q)))return!0}return!1}}
A.j1.prototype={
$2(a,b){var s=this.a.b,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===b},
$S:3}
A.j0.prototype={
$2(a,b){var s=this.a.a
if(!(a<s.length))return A.a(s,a)
return s[a]===b},
$S:3}
A.j2.prototype={
$2(a,b){var s=this.a.c
if(!(a<s.length))return A.a(s,a)
return s[a]===b},
$S:3}
A.fJ.prototype={
gL(){return 6},
V(a){var s,r,q=this,p=a.a.a,o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
if(q.a.G(p[o].a)<0)return!1
o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
for(p=q.e.h(0,q.c.O(p[o].a)),o=p.length,s=0;s<o;++s){r=p[s]
if(A.mY(a,r,new A.j3(q,r),new A.j4(q,r),new A.j5(q,r)))return!0}return!1}}
A.j6.prototype={
$1(a){var s,r=this.a
r.l(a,2)
r=r.a
s=r.getUint16(a,!1)
return s===0?B.k:A.cB(new A.r(r,this.b+s))},
$S:29}
A.j4.prototype={
$2(a,b){var s=this.b.b,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===this.a.c.O(b)},
$S:3}
A.j3.prototype={
$2(a,b){var s=this.b.a
if(!(a<s.length))return A.a(s,a)
return s[a]===this.a.b.O(b)},
$S:3}
A.j5.prototype={
$2(a,b){var s=this.b.c
if(!(a<s.length))return A.a(s,a)
return s[a]===this.a.d.O(b)},
$S:3}
A.fK.prototype={
gL(){return 6},
V(a){var s,r,q,p,o=this,n=o.b,m=n.length
if(m===0)return!1
if(0>=m)return A.a(n,0)
n=n[0]
s=a.a.a
r=a.f
if(!(r>=0&&r<s.length))return A.a(s,r)
if(n.G(s[r].a)<0)return!1
q=A.oR(a,m,new A.j7(o))
if(q==null)return!1
n=q.length
m=n-1
if(!(m>=0))return A.a(q,m)
p=q[m]+1
if(!A.qb(a,o.c.length,p,new A.j8(o)))return!1
if(!A.qa(a,o.a.length,new A.j9(o)))return!1
A.q2(a,q,p,o.d)
return!0}}
A.ja.prototype={
$0(){var s,r,q,p,o,n,m=this.b,l=this.a,k=l.a
m.l(k,2)
s=m.a
r=s.getUint16(k,!1)
q=J.aW(r,t.c)
for(k=this.c,p=0;p<r;++p){o=l.a+2+p*2
if(o>=0)n=o+2<=s.byteLength
else n=!1
if(!n)A.t(A.k("read of 2 byte(s) at "+o+" overruns a "+m.gk(0)+"-byte font"))
q[p]=A.Z(new A.r(s,k+s.getUint16(o,!1)))}l.a=l.a+(2+r*2)
return q},
$S:27}
A.j7.prototype={
$2(a,b){var s=this.a.b
if(!(a<s.length))return A.a(s,a)
return s[a].G(b)>=0},
$S:3}
A.j8.prototype={
$2(a,b){var s=this.a.c
if(!(a<s.length))return A.a(s,a)
return s[a].G(b)>=0},
$S:3}
A.j9.prototype={
$2(a,b){var s=this.a.a
if(!(a<s.length))return A.a(s,a)
return s[a].G(b)>=0},
$S:3}
A.hz.prototype={
gL(){return 8},
V(a){var s,r,q,p=this
if(a.r!==0)return!1
s=a.a.a
r=a.f
if(!(r>=0&&r<s.length))return A.a(s,r)
q=p.a.G(s[r].a)
if(q<0||q>=p.d.length)return!1
if(!A.qa(a,p.b.length,new A.kj(p)))return!1
if(!A.qb(a,p.c.length,a.f+1,new A.kk(p)))return!1
s=a.f
r=p.d
if(!(q>=0&&q<r.length))return A.a(r,q)
a.bv(s,r[q])
return!0}}
A.kl.prototype={
$0(){var s,r,q,p,o,n,m=this.b,l=this.a,k=l.a
m.l(k,2)
s=m.a
r=s.getUint16(k,!1)
q=J.aW(r,t.c)
for(k=this.c,p=0;p<r;++p){o=l.a+2+p*2
if(o>=0)n=o+2<=s.byteLength
else n=!1
if(!n)A.t(A.k("read of 2 byte(s) at "+o+" overruns a "+m.gk(0)+"-byte font"))
q[p]=A.Z(new A.r(s,k+s.getUint16(o,!1)))}l.a=l.a+(2+r*2)
return q},
$S:27}
A.kj.prototype={
$2(a,b){var s=this.a.b
if(!(a<s.length))return A.a(s,a)
return s[a].G(b)>=0},
$S:3}
A.kk.prototype={
$2(a,b){var s=this.a.c
if(!(a<s.length))return A.a(s,a)
return s[a].G(b)>=0},
$S:3}
A.aP.prototype={
aP(a){var s,r,q,p=this,o=a.f
if(o>=1&&o<=3&&(p.b&B.b.a4(1,o))!==0)return!0
if(o!==3)return!1
s=p.b
if((s&16)!==0){r=p.d
if(r==null)return!0
return!r.ij(p.c,a.a)}q=s&65280
if(q!==0)return a.r!==q>>>8
return!1},
cF(a){var s,r,q
for(s=a+1,r=this.a.a;q=r.length,s<q;++s){if(!(s>=0))return A.a(r,s)
if(!this.aP(r[s]))return s}return-1},
eo(a){var s=a-1,r=this.a.a,q=r.length
if(s>=q)s=q-1
for(;s>=0;--s){if(!(s<r.length))return A.a(r,s)
if(!this.aP(r[s]))return s}return-1}}
A.jV.prototype={
i0(a){var s,r,q,p,o,n,m,l,k,j,i,h=this
if(a<0||a>=h.e.length)throw A.e(A.k("feature index "+a+" out of range"))
s=h.f
if(!(a>=0&&a<s.length))return A.a(s,a)
r=s[a]
if(r!=null)return r
q=h.e
if(!(a<q.length))return A.a(q,a)
p=q[a]
q=h.a
o=p+2
q.l(o,2)
n=q.a
m=n.getUint16(o,!1)
l=J.aW(m,t.S)
for(o=p+4,k=0;k<m;++k){j=o+k*2
if(j>=0)i=j+2<=n.byteLength
else i=!1
if(!i)A.t(A.k("read of 2 byte(s) at "+j+" overruns a "+q.gk(0)+"-byte font"))
l[k]=n.getUint16(j,!1)}B.a.m(s,a,l)
return l},
e3(a,b){var s,r,q,p,o,n,m=this.dq(b,a)
if(m==null)return B.V
s=A.bb(t.S)
for(r=this.dg(m),q=r.length,p=this.d,o=0;o<r.length;r.length===q||(0,A.h)(r),++o){n=r[o]
if(!(n>=0&&n<p.length))return A.a(p,n)
s.j(0,p[n])}return s},
eF(a,b,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=t.nO
c.a(a)
s=d.dq(a0,b)
if(s==null)return B.cL
r=t.S
q=A.C(r,c)
for(c=d.dg(s),p=c.length,o=d.d,n=0;n<c.length;c.length===p||(0,A.h)(c),++n){m=c[n]
if(!(m>=0&&m<o.length))return A.a(o,m)
l=o[m]
if(!a.v(0,l))continue
for(k=d.i0(m),j=k.length,i=0;i<j;++i){h=k[i]
g=q.h(0,h)
if(g==null){g=A.bb(r)
q.m(0,h,g)}g.j(0,l)}}c=q.$ti.i("aq<1>")
f=A.X(new A.aq(q,c),c.i("i.E"))
B.a.aQ(f)
c=A.b([],t.kR)
for(r=f.length,n=0;n<f.length;f.length===r||(0,A.h)(f),++n){e=f[n]
p=q.h(0,e)
p.toString
c.push(new A.hF(e,p))}return c},
dq(a,b){var s,r,q,p,o,n,m,l=this.c,k=l.h(0,a)
if(k==null)k=l.h(0,1145457748)
if(k==null)return null
if(b!==0&&b!==1145457748){l=this.a
s=k+2
l.l(s,2)
r=l.a
q=r.getUint16(s,!1)
for(s=k+4,p=0;p<q;++p){o=s+p*6
if(o>=0)n=o+4<=r.byteLength
else n=!1
if(!n)A.t(A.k("read of 4 byte(s) at "+o+" overruns a "+l.gk(0)+"-byte font"))
if(r.getUint32(o,!1)===b){s=o+4
if(s>=0)n=s+2<=r.byteLength
else n=!1
if(!n)A.t(A.k("read of 2 byte(s) at "+s+" overruns a "+l.gk(0)+"-byte font"))
return k+r.getUint16(s,!1)}}}l=this.a
l.l(k,2)
m=l.a.getUint16(k,!1)
return m===0?null:k+m},
dg(a){var s,r,q,p,o,n,m,l,k=A.bb(t.S),j=this.a,i=a+2
j.l(i,2)
s=j.a
r=s.getUint16(i,!1)
if(r!==65535&&r<this.d.length)k.j(0,r)
i=a+4
j.l(i,2)
q=s.getUint16(i,!1)
for(i=this.d,p=a+6,o=0;o<q;++o){n=p+o*2
if(n>=0)m=n+2<=s.byteLength
else m=!1
if(!m)A.t(A.k("read of 2 byte(s) at "+n+" overruns a "+j.gk(0)+"-byte font"))
l=s.getUint16(n,!1)
if(l<i.length)k.j(0,l)}j=A.X(k,k.$ti.c)
B.a.aQ(j)
return j},
q(a){var s=this
return"LayoutTable(1."+s.r+", "+s.c.a+" scripts, "+s.d.length+" features, "+s.w.length+" lookups)"}}
A.hF.prototype={
q(a){var s=this.b,r=A.u(s)
return"StagedLookup("+this.a+", "+new A.cE(s,r.i("q(1)").a(new A.kB()),r.i("cE<1,q>")).ac(0,"+")+")"}}
A.kB.prototype={
$1(a){return A.aJ(A.D(a))},
$S:68}
A.ea.prototype={
e6(a){var s
a.aE(1937007464)
a.bI()
a.aE(1667460464)
a.aE(1819239276)
a.bI()
for(s=0;s<7;++s){a.hI(B.a8[s],8);++a.e}a.cv(1919118452,4)
a.cv(1667329140,4)
a.bI()
a.aE(1836279156)},
cV(a,b){var s,r,q,p,o,n,m,l=A.um(a),k=A.b([],t.t)
for(s=b.r,r=0;r<7;++r){q=s.h(0,B.a8[r])
k.push(q==null?0:q)}k.push(0)
for(s=a.a,q=l.length,p=0;p<s.length;++p){o=s[p]
n=o.y
if(!(p<q))return A.a(l,p)
m=l[p]
if(!(m<k.length))return A.a(k,m)
o.y=(n|k[m])>>>0}},
er(a,b,c){}}
A.eS.prototype={
e6(a){},
cV(a,b){},
er(a,b,c){}}
A.fV.prototype={}
A.aH.prototype={
q(a){return"GlyphInfo(gid: "+this.a+", cluster: "+this.c+")"}}
A.cb.prototype={
q(a){var s=this
return"GlyphPosition(adv: "+s.a+","+s.b+" off: "+s.c+","+s.d+")"}}
A.eZ.prototype={
ar(){return"TextDirection."+this.b}}
A.jA.prototype={
gk(a){return this.a.length},
eu(){var s,r,q,p,o,n,m
for(s=this.a,r=s.length-1,q=this.b,p=0;p<r;++p,--r){o=s.length
if(!(p<o))return A.a(s,p)
n=s[p]
if(!(r<o))return A.a(s,r)
o=s[r]
if(!(p>=0&&p<s.length))return A.a(s,p)
s[p]=o
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=n
o=q.length
if(!(p<o))return A.a(q,p)
m=q[p]
if(!(r<o))return A.a(q,r)
o=q[r]
if(!(p>=0&&p<q.length))return A.a(q,p)
q[p]=o
if(!(r>=0&&r<q.length))return A.a(q,r)
q[r]=m}},
q(a){var s=this.a,r=A.M(s)
return"GlyphBuffer("+s.length+" glyphs, "+this.c.q(0)+", "+new A.ar(s,r.i("c(1)").a(new A.jB()),r.i("ar<1,c>")).ac(0," ")+")"}}
A.jB.prototype={
$1(a){return t.og.a(a).a},
$S:44}
A.hp.prototype={
ar(){return"NormalizationMode."+this.b}}
A.k4.prototype={
iv(a,b){if(a.a.length===0)return
this.fq(a)
this.hp(a,b)
this.h8(a)},
fq(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=1668112752,f=A.b([],t.R)
for(s=a.a,r=s.length,q=this.a,p=q.a,o=p.c,n=0;n<s.length;s.length===r||(0,A.h)(s),++n){m=s[n]
l=m.b
k=q.e
if(k==null){j=o.h(0,g)
i=j==null?null:new A.r(p.a.a,j.c)
if(i==null)A.t(A.k("font has no "+A.aJ(A.cX(g))+" table"))
k=q.e=A.ei(i)}h=k.ah(l)
if(h!==0){m.a=h
B.a.j(f,m)
continue}if(!this.de(f,m,m.b,!0)){l=m.b
k=q.e
if(k==null){j=o.h(0,g)
i=j==null?null:new A.r(p.a.a,j.c)
if(i==null)A.t(A.k("font has no "+A.aJ(A.cX(g))+" table"))
k=q.e=A.ei(i)}m.a=k.ah(l)
B.a.j(f,m)}}A.ra(a,f)},
de(a,b,c,d){var s,r,q,p,o,n,m=this
t.n7.a(a)
s=A.xe(c)
r=s.a
q=s.b
if(r<0)return!1
p=q<0?0:m.a.ge5().ah(q)
o=q>=0
if(o&&p===0)return!1
n=m.a.ge5().ah(r)
if(d&&n!==0){B.a.j(a,m.b7(b,r,n))
if(o)B.a.j(a,m.b7(b,q,p))
return!0}if(m.de(a,b,r,d)){if(o)B.a.j(a,m.b7(b,q,p))
return!0}if(n!==0){B.a.j(a,m.b7(b,r,n))
if(o)B.a.j(a,m.b7(b,q,p))
return!0}return!1},
hp(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=a.a,g=h.length
for(s=0;s<g;++s){if(!(s>=0&&s<h.length))return A.a(h,s)
r=h[s].b
q=A.ap($.e8(),r)
r=$.fC()
p=r.length
if(q<p){if(!(q>=0))return A.a(r,q)
r=r[q]}else r=q
if(r===0)continue
o=s+1
n=o
for(;;){if(n<g){if(!(n<h.length))return A.a(h,n)
r=h[n].b
q=A.ap($.e8(),r)
r=$.fC()
p=r.length
if(q<p){if(!(q>=0))return A.a(r,q)
r=r[q]}else r=q
r=r!==0}else r=!1
if(!r)break;++n}if(n-s<=32){for(m=o;m<n;++m){if(!(m<h.length))return A.a(h,m)
l=h[m]
r=l.b
q=A.ap($.e8(),r)
r=$.fC()
p=r.length
if(q<p){if(!(q>=0))return A.a(r,q)
k=r[q]}else k=q
j=m
for(;;){if(j>s){r=j-1
if(!(r<h.length))return A.a(h,r)
r=h[r].b
q=A.ap($.e8(),r)
r=$.fC()
p=r.length
if(q<p){if(!(q>=0))return A.a(r,q)
r=r[q]}else r=q
r=r>k}else r=!1
if(!r)break
i=j-1
r=h.length
if(!(i>=0&&i<r))return A.a(h,i)
p=h[i]
if(!(j>=0&&j<r))return A.a(h,j)
h[j]=p
j=i}if(j!==m){if(!(j>=0&&j<h.length))return A.a(h,j)
h[j]=l
A.vE(a,j,m+1)}}b.er(a,s,n)}s=n-1}},
h8(a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=1668112752,a4=a5.a
if(a4.length<2)return
s=A.b([B.a.gu(a4)],t.R)
for(r=this.a,q=r.a,p=q.c,q=q.a.a,o=0,n=1;n<a4.length;++n){m=a4[n]
l=B.a.gN(s)
k=m.e
j=k===1||k===2||k===3
if(o!==s.length-1){k=l.b
i=$.e8()
h=A.ap(i,k)
k=$.fC()
g=k.length
if(h<g){if(!(h>=0))return A.a(k,h)
f=k[h]}else f=h
h=A.ap(i,m.b)
if(h<g){if(!(h>=0))return A.a(k,h)
k=k[h]}else k=h
e=f>=k}else e=!1
if(j&&!e){if(!(o>=0&&o<s.length))return A.a(s,o)
d=A.xd(s[o].b,m.b)
if(d>=0){k=r.e
if(k==null){c=p.h(0,a3)
b=c==null?null:new A.r(q,c.c)
if(b==null)A.t(A.k("font has no "+A.aJ(A.cX(a3))+" table"))
k=r.e=A.ei(b)}a=k.ah(d)
if(a!==0){a0=m.c
for(k=s.length,a1=o;a1<k;++a1){a2=s[a1].c
if(a2<a0)a0=a2}for(a1=o;k=s.length,a1<k;++a1)s[a1].c=a0
if(!(o<k))return A.a(s,o)
k=s[o]
k.b=d
k.a=a
k.e=A.ap($.pg(),d)
k.d=A.ap($.ph(),d)
continue}}}B.a.j(s,m)
k=m.b
if(A.ap($.e8(),k)===0)o=s.length-1}A.ra(a5,s)},
b7(a,b,c){var s=a.c,r=A.ap($.pg(),b)
return new A.aH(c,b,s,A.ap($.ph(),b),r,0,0,0,0,a.y,!1)}}
A.n_.prototype={
$0(){var s,r,q=new Uint8Array(256)
for(s=0;s<256;++s){if(!(s<256))return A.a(q,s)
q[s]=s}if(10>=256)return A.a(q,10)
q[10]=22
if(11>=256)return A.a(q,11)
q[11]=15
if(12>=256)return A.a(q,12)
q[12]=21
if(13>=256)return A.a(q,13)
q[13]=17
if(14>=256)return A.a(q,14)
q[14]=14
if(15>=256)return A.a(q,15)
q[15]=25
if(16>=256)return A.a(q,16)
q[16]=18
if(17>=256)return A.a(q,17)
q[17]=19
if(18>=256)return A.a(q,18)
q[18]=20
if(19>=256)return A.a(q,19)
q[19]=24
if(20>=256)return A.a(q,20)
q[20]=12
if(21>=256)return A.a(q,21)
q[21]=13
if(22>=256)return A.a(q,22)
q[22]=23
if(23>=256)return A.a(q,23)
q[23]=16
if(24>=256)return A.a(q,24)
q[24]=11
if(25>=256)return A.a(q,25)
q[25]=10
if(26>=256)return A.a(q,26)
q[26]=26
for(s=27;s<=35;s=r){r=s+1
if(!(s<256))return A.a(q,s)
q[s]=r}if(36>=256)return A.a(q,36)
q[36]=36
if(84>=256)return A.a(q,84)
q[84]=4
if(91>=256)return A.a(q,91)
q[91]=5
if(103>=256)return A.a(q,103)
q[103]=3
if(107>=256)return A.a(q,107)
q[107]=107
if(118>=256)return A.a(q,118)
q[118]=118
if(122>=256)return A.a(q,122)
q[122]=122
if(129>=256)return A.a(q,129)
q[129]=129
if(130>=256)return A.a(q,130)
q[130]=132
if(132>=256)return A.a(q,132)
q[132]=131
return q},
$S:74}
A.hC.prototype={
gk(a){return this.a.length},
q(a){var s=this.a,r=A.M(s)
return"ShapedRun("+s.length+" glyphs, "+this.c.q(0)+", "+new A.ar(s,r.i("c(1)").a(new A.kx()),r.i("ar<1,c>")).ac(0," ")+")"}}
A.kx.prototype={
$1(a){return t.og.a(a).a},
$S:44}
A.hD.prototype={
eD(a,b,c){var s,r
t.L.a(a)
s=A.b([],t.t)
for(r=0;r<a.length;++r)s.push(r)
return this.ho(a,s,b,B.cU,1145457748,c)},
ho(a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a=t.L
a.a(a0)
a.a(a1)
s=b.h4(a5,a4,a2,t.kT.a(a3))
r=B.aj.v(0,a5)?new A.ea():B.a_
q=b.d
a=q.a
B.a.a2(a)
p=q.b
B.a.a2(p)
q.c=B.y
q.d=0
q.c=a2
q.d=a5
for(o=0;o<a0.length;++o){n=a0[o]
if(!(o<a1.length))return A.a(a1,o)
B.a.j(a,new A.aH(0,n,a1[o],0,0,0,0,0,0,0,!1))
B.a.j(p,new A.cb(0))}if(a.length===0)return new A.hC(B.cV,B.cW,a2)
b.hl(q,s)
A.w1(q)
A.w0(q)
b.fS(q,s)
m=b.c;(m===$?b.c=new A.k4(b.a):m).iv(q,r)
r.cV(q,s)
n=b.a
l=n.ch
if(l==null)l=n.ch=n.bB(1195656518,A.yG(),t.lP)
A.w_(q,l)
k=n.gcU()
if(k!=null)for(j=s.d,i=j.length,h=0;h<j.length;j.length===i||(0,A.h)(j),++h)for(g=j[h].a,f=g.length,e=0;e<g.length;g.length===f||(0,A.h)(g),++e){d=g[e]
k.hL(d.a,q,l,d.b)}B.a.a2(p)
j=A.b([],t.q)
for(i=a.length,h=0;h<a.length;a.length===i||(0,A.h)(a),++h)j.push(new A.cb(n.cm(a[h].a)))
B.a.A(p,j)
c=n.gcT()
if(c!=null)for(j=s.e,i=j.length,n=n.b,h=0;h<j.length;j.length===i||(0,A.h)(j),++h)for(g=j[h].a,f=g.length,e=0;e<g.length;g.length===f||(0,A.h)(g),++e){d=g[e]
c.hM(d.a,q,n,l,d.b)}A.v9(q,!1)
A.v8(q)
A.v7(q)
n=q.c
if(n===B.l)q.eu()
b.fI(q)
a=A.X(a,t.og)
p=A.X(p,t.lr)
return new A.hC(a,p,q.c)},
h4(a,b,c,d){var s,r,q,p,o,n,m,l
t.kT.a(d)
s=[]
for(r=0;!1;++r){q=d[r]
s.push(q.giL().aO(0,31).bT(0,q.giR()))}p=A.pA(a,b,c,A.vF(s))
s=this.b
o=s.h(0,p)
if(o!=null)return o
n=new A.kz(a,b,c,A.b([],t.la))
A.yt(n,B.aj.v(0,a)?new A.ea():B.a_)
for(r=0;!1;++r){q=d[r]
n.aU(q.giL(),1,q.giR())}m=this.a
l=m.gcU()
l=l==null?null:l.a
m=m.gcT()
m=n.hT(m==null?null:m.a,l)
s.m(0,p,m)
return m},
hl(a,b){var s,r,q,p,o,n
for(s=a.a,r=s.length,q=b.f,p=0;p<s.length;s.length===r||(0,A.h)(s),++p){o=s[p]
n=o.b
o.e=A.ap($.pg(),n)
n=o.b
o.d=A.ap($.ph(),n)
o.y=q}},
fS(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=1668112752
if(a.c!==B.l)return
s=b.is(1920232557)
for(r=a.a,q=r.length,p=s!==0,o=this.a,n=o.a,m=n.c,l=0;l<r.length;r.length===q||(0,A.h)(r),++l){k=r[l]
j=k.b
i=A.ap($.ql(),j)
h=i===0?-1:B.b.K(i,2)
if(h>0){j=o.e
if(j==null){g=m.h(0,e)
f=g==null?null:new A.r(n.a.a,g.c)
if(f==null)A.t(A.k("font has no "+A.aJ(A.cX(e))+" table"))
j=o.e=A.ei(f)}j=j.ah(h)!==0}else j=!1
if(j)k.b=h
else if(p)k.y=(k.y|s)>>>0}},
fI(a){var s,r,q,p,o,n,m,l,k,j,i,h=1668112752
for(s=a.a,r=a.b,q=this.a,p=q.a,o=p.c,n=-1,m=0;m<s.length;++m){l=s[m]
if(!A.yU(l.b))continue
if(n<0){k=q.e
if(k==null){j=o.h(0,h)
i=j==null?null:new A.r(p.a.a,j.c)
if(i==null)A.t(A.k("font has no "+A.aJ(A.cX(h))+" table"))
k=q.e=A.ei(i)}n=k.ah(32)}if(n!==0)l.a=n
if(!(m<r.length))return A.a(r,m)
k=r[m]
k.d=k.c=k.b=k.a=0}}}
A.hw.prototype={
q(a){return"PlannedLookup("+this.a+", mask 0x"+B.b.bm(this.b,16)+")"}}
A.hv.prototype={
q(a){return"PlanStage("+this.a.length+" lookups)"}}
A.hE.prototype={
is(a){var s=this.r.h(0,a)
return s==null?0:s},
q(a){var s=this
return"ShapingPlan("+A.aJ(s.a)+"/"+A.aJ(s.b)+", "+s.c.q(0)+", "+s.d.length+" GSUB stages, "+s.e.length+" GPOS stages)"}}
A.bW.prototype={}
A.kz.prototype={
cv(a,b){return this.aU(a,b|1,1)},
aE(a){return this.cv(a,0)},
aU(a,b,c){var s=(b&1)!==0?c:0,r=new A.bW(a,b,c,s,this.r++)
r.f=this.e
B.a.j(this.d,r)},
bH(a){return this.aU(a,0,1)},
hI(a,b){return this.aU(a,b,1)},
bI(){return this.e++},
hT(a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=this,a3=A.r8(a2.d,!0,t.bY)
B.a.aG(a3,new A.kA())
s=A.b([],t.la)
for(r=a3.length,q=0;q<a3.length;a3.length===r||(0,A.h)(a3),++q){p=a3[q]
if(s.length!==0&&B.a.gN(s).a===p.a){o=B.a.gN(s)
n=p.b
m=o.b
if((n&1)!==0){n=o.b=m|1
o.c=p.c
o.d=p.d}else{n=o.b=m&4294967294
m=p.c
if(m>o.c)o.c=m}o.b=n|p.b&8
n=p.f
if(n<o.f)o.f=n
n=p.r
if(n<o.r)o.r=n}else B.a.j(s,p)}l=a5==null?B.V:a5.e3(a2.b,a2.a)
k=a4==null?B.V:a4.e3(a2.b,a2.a)
r=t.S
j=A.C(r,r)
i=A.bb(r)
h=A.C(r,r)
g=A.C(r,r)
f=A.C(r,r)
for(r=s.length,e=1,d=1,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q]
n=p.a
c=l.v(0,n)
b=k.v(0,n)
m=!c
if(!m||b)i.j(0,n)
if(m&&!b&&(p.b&8)===0)continue
if((p.b&1)!==0&&p.c===1)a=1
else{a0=A.w2(p.c)
a1=e+a0
if(a1>32)continue
a=B.b.a4(B.b.a4(1,a0)-1,e)
d=(d|B.b.a4(p.d,e)&a)>>>0
e=a1}j.m(0,n,a)
h.m(0,n,p.b)
g.m(0,n,p.f)
f.m(0,n,p.r)}return new A.hE(a2.a,a2.b,a2.c,a2.dL(a5,j,h,g,a2.e),a2.dL(a4,j,h,f,0),d,j)},
dL(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h,g=t.mV
g.a(b)
g.a(c)
g.a(d)
if(a==null)return B.cK
s=A.b([],t.lE)
for(g=t.gX,r=this.a,q=this.b,p=A.u(d).i("cM<1,2>"),o=t.S,n=0;n<=e;++n){m=A.bb(o)
for(l=new A.cM(d,d.r,d.e,p);l.n();){k=l.d
if(k.b===n)m.j(0,k.a)}if(m.a===0)continue
j=a.eF(m,q,r)
if(j.length===0)continue
l=A.b([],g)
for(i=j.length,h=0;h<j.length;j.length===i||(0,A.h)(j),++h)l.push(this.h3(j[h],m,b,c))
B.a.j(s,new A.hv(l))}return s},
h3(a,b,c,d){var s,r,q,p,o,n,m,l
t.nO.a(b)
s=t.mV
s.a(c)
s.a(d)
for(s=a.b,s=A.wF(s,s.r,A.u(s).c),r=s.$ti.c,q=0,p=!0,o=!0;s.n();){n=s.d
if(n==null)n=r.a(n)
if(!b.v(0,n))continue
m=c.h(0,n)
q=(q|(m==null?0:m))>>>0
l=d.h(0,n)
if(l==null)l=0
p=B.a6.cR(p,(l&2)===0)
o=B.a6.cR(o,(l&4)===0)}return new A.hw(a.a,q)}}
A.kA.prototype={
$2(a,b){var s,r=t.bY
r.a(a)
r.a(b)
r=a.a
s=b.a
return r!==s?r-s:a.e-b.e},
$S:80}
A.bu.prototype={
gk(a){return this.b-this.a},
q(a){return"BidiRun("+this.a+".."+this.b+", level "+this.c+")"}}
A.ed.prototype={}
A.m5.prototype={
eL(a,b){var s,r,q,p,o,n,m,l=this
for(s=l.c,r=l.d,q=l.a,p=J.o(q),o=r.$flags|0,n=0;n<s;++n){m=p.h(q,n)
m=A.ap($.qm(),m)
o&2&&A.x(r)
if(!(n<r.length))return A.a(r,n)
r[n]=m}B.j.bU(l.e,0,r)
l.ft()},
ev(){var s,r,q,p,o=this,n=o.c
if(n===0){n=new Uint8Array(0)
return new A.ed(n,0,B.P,B.P)}n=o.dA(0,n)
o.x=n
o.he()
s=o.fb()
for(n=s.length,r=0;r<s.length;s.length===n||(0,A.h)(s),++r){q=s[r]
q.hz()
q.hA()
q.hB()
q.hC()
q.hD()
q.hE()
q.hF()
q.fT()
q.fU()
q.fJ()}o.fN()
o.f5()
p=o.fO()
return new A.ed(o.f,o.x,p,o.hc(p))},
dA(a,b){var s,r,q,p,o,n
for(s=this.d,r=s.length,q=this.r,p=q.length,o=a;o<b;++o){if(!(o>=0&&o<r))return A.a(s,o)
n=s[o]
if(n===0)return 0
if(n===1||n===2)return 1
if(n===19||n===20||n===21){if(!(o<p))return A.a(q,o)
o=q[o]
if(o>=b)break}}return 0},
ft(){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=h.r,f=h.c
B.x.az(g,0,f,-1)
s=h.w
B.x.az(s,0,f,-1)
for(r=g.$flags|0,q=h.d,p=q.length,o=s.$flags|0,n=0;n<f;++n){if(!(n<p))return A.a(q,n)
m=q[n]
if(!(m===19||m===20||m===21))continue
k=n+1
j=1
for(;;){if(!(k<f)){l=f
break}if(!(k<p))return A.a(q,k)
i=q[k]
if(i===19||i===20||i===21)++j
else if(i===22){--j
if(j===0){o&2&&A.x(s)
if(!(k<s.length))return A.a(s,k)
s[k]=n
l=k
break}}++k}r&2&&A.x(g)
if(!(n<g.length))return A.a(g,n)
g[n]=l}},
he(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=this,a1=new Uint8Array(128),a2=new Uint8Array(128),a3=new Uint8Array(128),a4=a0.x
a4===$&&A.j()
a1[0]=a4
a2[0]=255
for(a4=a0.c,s=a0.f,r=s.$flags|0,q=a0.d,p=q.length,o=a0.e,n=o.$flags|0,m=a0.r,l=m.length,k=0,j=0,i=0,h=0,g=0;g<a4;++g){if(!(g<p))return A.a(q,g)
f=q[g]
e=0
switch(f){case 15:case 14:case 17:case 16:if(!(k>=0&&k<128))return A.a(a1,k)
d=a1[k]
r&2&&A.x(s)
if(!(g<s.length))return A.a(s,g)
s[g]=d
c=f===15||f===17?(a1[k]+1|1)>>>0:(a1[k]+2&4294967294)>>>0
if(c<=125&&j===0&&i===0){++k
if(!(k<128))return A.a(a1,k)
a1[k]=c
A:{if(17===f){d=1
break A}if(16===f){d=0
break A}d=255
break A}if(!(k<128))return A.a(a2,k)
a2[k]=d
if(!(k<128))return A.a(a3,k)
a3[k]=0}else if(j===0)++i
break
case 20:case 19:case 21:b=f===20
if(f===21){if(!(g<l))return A.a(m,g)
a=m[g]
d=a<a4?a:a4
b=a0.dA(g+1,d)===1}if(!(k>=0&&k<128))return A.a(a1,k)
d=a1[k]
r&2&&A.x(s)
if(!(g<s.length))return A.a(s,g)
s[g]=d
d=a2[k]
if(d!==255){n&2&&A.x(o)
if(!(g<o.length))return A.a(o,g)
o[g]=d}c=b?(a1[k]+1|1)>>>0:(a1[k]+2&4294967294)>>>0
if(c<=125&&j===0&&i===0){++h;++k
if(!(k<128))return A.a(a1,k)
a1[k]=c
if(!(k<128))return A.a(a2,k)
a2[k]=255
if(!(k<128))return A.a(a3,k)
a3[k]=1}else ++j
break
case 22:if(j>0)--j
else if(h!==0){for(;;){if(!(k>=0&&k<128))return A.a(a3,k)
if(!(a3[k]===0))break;--k}--k;--h
i=e}if(!(k>=0&&k<128))return A.a(a1,k)
d=a1[k]
r&2&&A.x(s)
if(!(g<s.length))return A.a(s,g)
s[g]=d
d=a2[k]
if(d!==255){n&2&&A.x(o)
if(!(g<o.length))return A.a(o,g)
o[g]=d}break
case 18:if(!(j>0))if(i>0)--i
else{if(!(k>=0&&k<128))return A.a(a3,k)
if(a3[k]===0&&k>=1)--k}if(!(k>=0&&k<128))return A.a(a1,k)
d=a1[k]
r&2&&A.x(s)
if(!(g<s.length))return A.a(s,g)
s[g]=d
break
case 10:d=a0.x
r&2&&A.x(s)
if(!(g<s.length))return A.a(s,g)
s[g]=d
i=e
k=0
j=0
h=0
break
default:if(!(k>=0&&k<128))return A.a(a1,k)
d=a1[k]
r&2&&A.x(s)
if(!(g<s.length))return A.a(s,g)
s[g]=d
d=a2[k]
if(d!==255){n&2&&A.x(o)
if(!(g<o.length))return A.a(o,g)
o[g]=d}}}for(g=0;g<a4;++g){if(!(g<p))return A.a(q,g)
s=q[g]
if(s===15||s===14||s===17||s===16||s===18||s===9){n&2&&A.x(o)
if(!(g<o.length))return A.a(o,g)
o[g]=9}}},
fb(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1=this,b2=t.t,b3=A.b([],b2),b4=b1.c,b5=new Int32Array(b4)
B.x.az(b5,0,b4,-1)
for(s=b1.d,r=s.length,q=0;q<b4;++q){if(!(q<r))return A.a(s,q)
p=s[q]
if(p===15||p===14||p===17||p===16||p===18||p===9)continue
p=b3.length
if(!(q<b4))return A.a(b5,q)
b5[q]=p
B.a.j(b3,q)}p=t.L
p.a(b3)
b1.y!==$&&A.p4()
b1.y=b3
b1.z!==$&&A.p4()
b1.z=b5
if(b3.length===0)return B.cO
o=A.b([],b2)
n=A.b([],b2)
m=new Int32Array(b4)
B.x.az(m,0,b4,-1)
for(l=b1.f,k=l.length,j=0,i=1;h=b3.length,i<=h;++i){if(i!==h){if(!(i<h))return A.a(b3,i)
g=b3[i]
if(!(g<k))return A.a(l,g)
g=l[g]
if(!(j>=0&&j<h))return A.a(b3,j)
h=b3[j]
if(!(h<k))return A.a(l,h)
h=g!==l[h]}else h=!0
if(h){f=o.length
B.a.j(o,j)
B.a.j(n,i)
for(h=b3.length,e=j;e<i;++e){if(!(e>=0&&e<h))return A.a(b3,e)
g=b3[e]
if(!(g<b4))return A.a(m,g)
m[g]=f}j=i}}d=A.b([],t.bD)
for(h=b1.r,g=h.length,c=b1.w,b=c.length,a=0;a<o.length;++a){a0=o[a]
if(!(a0<b3.length))return A.a(b3,a0)
a1=b3[a0]
if(!(a1<r))return A.a(s,a1)
if(s[a1]===22){if(!(a1<b))return A.a(c,a1)
a0=c[a1]>=0}else a0=!1
if(a0)continue
a2=A.b([],b2)
for(a3=a;;a3=a5){if(!(a3>=0&&a3<o.length))return A.a(o,a3)
i=o[a3]
for(;;){if(!(a3<n.length))return A.a(n,a3)
if(!(i<n[a3]))break
if(!(i<b3.length))return A.a(b3,i)
B.a.j(a2,b3[i]);++i}a4=B.a.gN(a2)
if(!(a4<r))return A.a(s,a4)
a0=s[a4]
if(a0===19||a0===20||a0===21){if(!(a4<g))return A.a(h,a4)
a0=h[a4]>=b4}else a0=!0
if(a0)break
if(!(a4<g))return A.a(h,a4)
a0=h[a4]
if(!(a0>=0&&a0<b4))return A.a(m,a0)
a5=m[a0]
if(a5>a3){if(!(a5>=0&&a5<o.length))return A.a(o,a5)
a6=o[a5]
if(!(a6<b3.length))return A.a(b3,a6)
a0=b3[a6]!==a0}else a0=!0
if(a0)break}p.a(a2)
a0=B.a.gu(a2)
if(!(a0<k))return A.a(l,a0)
a7=l[a0]
a0=B.a.gu(a2)
if(!(a0<b4))return A.a(b5,a0)
a8=b5[a0]
if(a8>0){a0=a8-1
if(!(a0<b3.length))return A.a(b3,a0)
a0=b3[a0]
if(!(a0<k))return A.a(l,a0)
a9=l[a0]}else{a0=b1.x
a0===$&&A.j()
a9=a0}a4=B.a.gN(a2)
if(!(a4<r))return A.a(s,a4)
a0=s[a4]
if(a0===19||a0===20||a0===21){if(!(a4<g))return A.a(h,a4)
a0=h[a4]>=b4}else a0=!1
if(a0){a0=b1.x
a0===$&&A.j()
b0=a0}else{if(!(a4<b4))return A.a(b5,a4)
a0=b5[a4]+1
a6=b3.length
if(a0<a6){if(!(a0>=0))return A.a(b3,a0)
a0=b3[a0]
if(!(a0<k))return A.a(l,a0)
b0=l[a0]}else{a0=b1.x
a0===$&&A.j()
b0=a0}}a0=((a7>a9?a7:a9)&1)===1?1:0
B.a.j(d,A.wB(b1,a2,a0,((a7>b0?a7:b0)&1)===1?1:0,a7))}return d},
fN(){var s,r,q,p,o,n,m,l,k=this
for(s=k.c,r=k.x,q=k.f,p=k.d,o=p.length,n=q.length,m=0;m<s;++m){if(!(m<o))return A.a(p,m)
l=p[m]
if(!(l===15||l===14||l===17||l===16||l===18||l===9))continue
if(m>0){l=m-1
if(!(l<n))return A.a(q,l)
l=q[l]}else{r===$&&A.j()
l=r}q.$flags&2&&A.x(q)
if(!(m<n))return A.a(q,m)
q[m]=l}},
f5(){var s,r,q,p,o,n,m,l,k,j,i,h=this
for(s=h.c,r=h.f,q=h.x,p=r.$flags|0,o=h.d,n=o.length,m=0;m<s;++m){if(!(m<n))return A.a(o,m)
l=o[m]
if(l!==10&&l!==11)continue
q===$&&A.j()
p&2&&A.x(r)
k=r.length
if(!(m<k))return A.a(r,m)
r[m]=q
for(j=m-1;j>=0;--j){if(!(j<n))return A.a(o,j)
i=o[j]
if(!(i===12||i===21||i===19||i===20||i===22||i===15||i===14||i===17||i===16||i===18||i===9))break
if(!(j<k))return A.a(r,j)
r[j]=q}}for(j=s-1;j>=0;--j){if(!(j<n))return A.a(o,j)
s=o[j]
if(!(s===12||s===21||s===19||s===20||s===22||s===15||s===14||s===17||s===16||s===18||s===9))break
q===$&&A.j()
p&2&&A.x(r)
if(!(j<r.length))return A.a(r,j)
r[j]=q}},
fO(){var s,r,q,p,o,n,m=A.b([],t.lW)
for(s=this.c,r=this.f,q=r.length,p=0,o=1;o<=s;++o){if(o!==s){if(!(o<q))return A.a(r,o)
n=r[o]
if(!(p>=0&&p<q))return A.a(r,p)
n=n!==r[p]}else n=!0
if(n){if(!(p>=0&&p<q))return A.a(r,p)
B.a.j(m,new A.bu(p,o,r[p]))
p=o}}return m},
hc(a){var s,r,q,p,o,n,m,l,k,j,i,h
t.kV.a(a)
s=a.length
if(s===0)return B.P
for(r=0,q=127,p=0;p<s;++p){o=a[p].c
if(o>r)r=o
if((o&1)===1&&o<q)q=o}n=A.X(a,t.kb)
for(s=n.length,m=r;m>=q;--m)for(l=0;l<s;){if(!(l>=0))return A.a(n,l)
if(n[l].c<m){++l
continue}k=l
for(;;){if(!(k<s&&n[k].c>=m))break;++k}for(j=k-1,i=l;i<j;++i,--j){if(!(i<s))return A.a(n,i)
h=n[i]
if(!(j<s))return A.a(n,j)
n[i]=n[j]
n[j]=h}l=k}return n}}
A.ik.prototype={
gk(a){return this.b.length},
hz(){var s,r,q,p,o=this.e
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
if(r[p]===8)B.a.m(r,p,o===19||o===20||o===21||o===22?13:o)
o=r[p]}},
hA(){var s,r,q,p,o,n=this.e
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
o=r[p]
if(o===0||o===1||o===2)n=o
else if(o===3&&n===2)B.a.m(r,p,6)}},
hB(){var s,r,q,p
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
if(r[p]===2)B.a.m(r,p,1)}},
hC(){var s,r,q,p,o,n,m,l
for(s=this.b,r=this.c,q=r.length,p=1;p<s.length-1;++p){if(!(p<q))return A.a(r,p)
o=r[p]
if(o!==4&&o!==7)continue
n=p-1
if(!(n<q))return A.a(r,n)
m=r[n]
n=p+1
if(!(n<q))return A.a(r,n)
l=r[n]
if(m===3&&l===3)B.a.m(r,p,3)
else if(o===7&&m===6&&l===6)B.a.m(r,p,6)}},
hD(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
for(s=f.b,r=f.f,q=f.e,p=f.c,o=p.length,n=0;m=s.length,n<m;++n){if(!(n>=0&&n<o))return A.a(p,n)
if(p[n]!==5)continue
l=n
for(;;){k=l<m
if(k){if(!(l<o))return A.a(p,l)
j=p[l]===5}else j=!1
if(!j)break;++l}if(n>0){m=n-1
if(!(m<o))return A.a(p,m)
i=p[m]}else i=q
if(k){if(!(l<o))return A.a(p,l)
h=p[l]}else h=r
if(i===3||h===3)for(g=n;g<l;++g)B.a.m(p,g,3)
n=l-1}},
hE(){var s,r,q,p,o
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
o=r[p]
if(o===5||o===4||o===7)B.a.m(r,p,13)}},
hF(){var s,r,q,p,o,n=this.e
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
o=r[p]
if(o===0||o===1)n=o
else if(o===3&&n===0)B.a.m(r,p,0)}},
fT(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=(e.r&1)===1?1:0,c=d===0?1:0
for(s=e.f8(),r=s.length,q=e.c,p=q.length,o=e.e,n=0;n<s.length;s.length===r||(0,A.h)(s),++n){m=s[n]
l=m.a
k=m.b
i=l+1
h=!1
for(;;){if(!(i<k)){j=-1
break}A:{if(!(i>=0&&i<p))return A.a(q,i)
g=A.rJ(q[i])
if(g===-1)break A
if(g===d){j=d
break}h=!0}++i}if(j===-1&&h){i=l-1
for(;;){if(!(i>=0)){f=o
break}if(!(i<p))return A.a(q,i)
g=A.rJ(q[i])
if(g!==-1){f=g
break}--i}j=f===c?c:d}if(j===-1)continue
B.a.m(q,l,j)
B.a.m(q,k,j)
e.d3(l,j)
e.d3(k,j)}},
d3(a,b){var s,r=a+1,q=this.c,p=this.b
for(;;){if(r<p.length){s=this.d
s===$&&A.j()
if(!(r>=0&&r<s.length))return A.a(s,r)
s=s[r]===8}else s=!1
if(!s)break
B.a.m(q,r,b);++r}},
f8(){var s,r,q,p,o,n,m,l,k,j,i,h,g=t.t,f=A.b([],g),e=A.b([],g),d=A.b([],t.ho)
for(g=this.b,s=this.a.a,r=J.o(s),q=this.c,p=q.length,o=f.$flags|0,n=e.$flags|0,m=0;m<g.length;++m){if(!(m<p))return A.a(q,m)
if(q[m]!==13)continue
l=r.h(s,g[m])
k=$.ql()
switch(A.ap(k,l)&3){case 1:if(f.length===63)return A.rI(d)
j=A.ap(k,l)
B.a.j(f,A.rH(j===0?-1:B.b.K(j,2)))
B.a.j(e,m)
break
case 2:i=A.rH(l)
for(h=f.length-1;h>=0;--h){if(f[h]!==i)continue
if(!(h<e.length))return A.a(e,h)
B.a.j(d,new A.f(e[h],m))
k=f.length
o&1&&A.x(f,18)
A.aw(h,k,k)
f.splice(h,k-h)
k=e.length
n&1&&A.x(e,18)
A.aw(h,k,k)
e.splice(h,k-h)
break}break}}return A.rI(d)},
fU(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=(e.r&1)===1?1:0
for(s=e.b,r=e.c,q=e.f,p=e.e,o=r.length,n=0;m=s.length,n<m;++n){if(!(n>=0&&n<o))return A.a(r,n)
l=r[n]
if(!(l===10||l===11||l===12||l===13||l===21||l===19||l===20||l===22))continue
k=n
for(;;){l=k<m
if(l){if(!(k<o))return A.a(r,k)
j=r[k]
j=j===10||j===11||j===12||j===13||j===21||j===19||j===20||j===22}else j=!1
if(!j)break;++k}if(n>0){m=n-1
if(!(m<o))return A.a(r,m)
m=r[m]
i=m===3||m===6?1:m}else i=p
if(l){if(!(k<o))return A.a(r,k)
m=r[k]
h=m===3||m===6?1:m}else h=q
if(i===h)m=i===0||i===1
else m=!1
g=m?i:d
for(f=n;f<k;++f)B.a.m(r,f,g)
n=k-1}},
fJ(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this
for(s=e.b,r=s.length,q=e.a.f,p=q.$flags|0,o=e.r,n=(o&1)===0,m=e.c,l=m.length,k=o+1,j=o+2,i=0;i<r;++i){if(!(i<l))return A.a(m,i)
h=m[i]
if(n)if(h===1)g=k
else g=h===6||h===3?j:o
else g=h===0||h===3||h===6?k:o
f=s[i]
p&2&&A.x(q)
if(!(f<q.length))return A.a(q,f)
q[f]=g}}}
A.lW.prototype={
$2(a,b){var s=t.gn
return B.b.ab(s.a(a).a,s.a(b).a)},
$S:81}
A.eR.prototype={
gk(a){return this.b-this.a},
q(a){return"ScriptRun("+this.a+".."+this.b+", "+A.aJ(this.c)+")"}}
A.oh.prototype={
$0(){var s,r,q,p=new Int32Array(171)
for(s=0;s<171;++s){r=B.da.h(0,B.S[s])
q=r==null?1145457748:A.wj(r)
if(!(s<171))return A.a(p,s)
p[s]=q}return p},
$S:83}
A.r.prototype={
gk(a){return this.a.byteLength},
X(a,b){return a>=0&&b>=0&&a+b<=this.a.byteLength},
cN(a){var s
this.l(a,3)
s=this.a
return(s.getUint8(a)<<16|s.getUint8(a+1)<<8|s.getUint8(a+2))>>>0},
a0(a){var s,r,q,p,o=this,n=a*2
o.l(o.b,n)
s=new Uint16Array(a)
for(r=o.a,q=0;q<a;++q){p=r.getUint16(o.b+q*2,!1)
if(!(q<a))return A.a(s,q)
s[q]=p}o.b+=n
return s},
l(a,b){if(!this.X(a,b))throw A.e(A.k("read of "+b+" byte(s) at "+a+" overruns a "+this.gk(0)+"-byte font"))}}
A.aE.prototype={
q(a){return"FontFormatException: "+this.a}}
A.iU.prototype={}
A.jb.prototype={}
A.iC.prototype={
gip(a){var s=this.b
s===$&&A.j()
return s},
giF(a){var s=this.c
s===$&&A.j()
return s},
iq(a,b){return this.gip(this).$1(b)},
iG(a,b){return this.giF(this).$1(b)}}
A.b6.prototype={
shQ(a){this.e=t.nw.a(a)}}
A.kg.prototype={
eI(a,b){var s,r=this,q=r.a.b,p=t.gz.a(A.N(q+2,B.F,!1,t.kp))
r.b!==$&&A.p4()
r.b=p
B.a.m(p,q+1,a)
for(;q>=0;--q){s=q+1
if(!(s<p.length))return A.a(p,s)
B.a.m(p,q,r.fF(p[s],q))}},
e4(a){var s=this.f.h(0,a)
s=s==null?null:s.e
return s==null?B.F:s},
im(a,b,c){var s={},r=A.b([],t.r)
s.a=0
B.a.a3(this.e4(a),new A.ki(s,r,b,c))
return r},
dV(a,b){var s,r=a.d
if(J.m(r.h(0,"cluster"),!0))return r.h(0,b.a)
s=this.d
s.sae(r)
return b.iq(0,s)},
hw(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
t.kp.a(b)
s=t.N
r=t.O
q=A.C(s,r)
for(p=f.c,o=p.length,n=f.d,m=0;m<p.length;p.length===o||(0,A.h)(p),++m){l=p[m]
k=f.dV(a,l)
for(j=b.length,i=l.a,h=0;h<b.length;b.length===j||(0,A.h)(b),++h){g=f.dV(b[h],l)
n.f=k
n.sae(A.eB([i,g],s,r))
k=l.iG(0,n)}q.m(0,i,k)}return q},
fF(b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3=this
t.kp.a(b4)
s=b3.a
r=s.a/(512*B.b.a8(1,b5))
q=A.C(t.S,t.L)
p=new A.kh(r)
for(o=t.t,n=0;m=b4.length,n<m;++n){m=b4[n]
m=p.$2(m.a,m.b)
l=q.h(0,m)
if(l==null){l=A.b([],o)
q.m(0,m,l)
m=l}else m=l
B.a.j(m,n)}k=new Uint8Array(m)
l=t.r
j=A.b([],l)
i=A.b([],o)
for(o=b3.c,h=b3.f,g=t.N,f=t.O,e=r*r,s=s.c,n=0;n<b4.length;++n){if(!(n<m))return A.a(k,n)
if(k[n]!==0)continue
d=b4[n]
B.a.a2(i)
c=d.c
for(b=d.a,a=d.b,a0=c,a1=-1;a1<=1;++a1)for(a2=a+a1*r,a3=-1;a3<=1;++a3){a4=q.h(0,p.$2(b+a3*r,a2))
if(a4==null)continue
for(a5=a4.length,a6=0;a6<a4.length;a4.length===a5||(0,A.h)(a4),++a6){a7=a4[a6]
if(a7!==n){if(!(a7>=0&&a7<m))return A.a(k,a7)
a8=k[a7]!==0}else a8=!0
if(a8)continue
if(!(a7>=0&&a7<b4.length))return A.a(b4,a7)
a8=b4[a7]
a9=a8.a-b
b0=a8.b-a
if(a9*a9+b0*b0>e)continue
B.a.j(i,a7)
if(!(a7<b4.length))return A.a(b4,a7)
a0+=b4[a7].c}}if(!(n<m))return A.a(k,n)
k[n]=1
a2=i.length
if(a2===0||a0<s){B.a.j(j,d)
continue}b1=b*c
b2=a*c
for(b=b4.length,a6=0;a6<a2;++a6){a7=i[a6]
if(!(a7>=0&&a7<m))return A.a(k,a7)
k[a7]=1
if(!(a7<b))return A.a(b4,a7)
a=b4[a7]
a5=a.c
b1+=a.a*a5
b2+=a.b*a5}b=b3.e++
a=A.C(g,f)
if(o.length===0)a2=null
else{a2=A.b([],l)
for(a5=i.length,a6=0;a6<i.length;i.length===a5||(0,A.h)(i),++a6){a7=i[a6]
if(!(a7>=0&&a7<b4.length))return A.a(b4,a7)
a2.push(b4[a7])}a2=b3.hw(d,a2)}if(a2!=null)a.A(0,a2)
a.m(0,"$id",b)
a.m(0,"cluster",!0)
a.m(0,"cluster_id",b)
a.m(0,"point_count",a0)
if(a0>=1e4)a2=""+B.c.Y(a0/1000)+"k"
else a2=a0>=1000?A.v(B.c.Y(a0/100)/10)+"k":a0
a.m(0,"point_count_abbreviated",a2)
a=new A.b6(b1/a0,b2/a0,a0,a)
a0=A.b([d],l)
for(a2=i.length,a6=0;a6<i.length;i.length===a2||(0,A.h)(i),++a6){a7=i[a6]
if(!(a7>=0&&a7<b4.length))return A.a(b4,a7)
a0.push(b4[a7])}a.shQ(a0)
a.f=b5
h.m(0,b,a)
B.a.j(j,a)}return j}}
A.ki.prototype={
$1(a){var s,r,q=this
t.el.a(a)
s=q.b
if(s.length>=q.c)return
r=a.e
if(r!=null)B.a.a3(r,q)
else if(q.a.a++>=q.d)B.a.j(s,a)},
$S:84}
A.kh.prototype={
$2(a,b){var s=this.a
return B.c.a5(a/s)*67108864+B.c.a5(b/s)},
$S:85}
A.ad.prototype={
gbA(){var s,r,q=new A.kp(),p=new A.ko(),o=this.a,n=q.$1(o),m=this.b,l=q.$1(m),k=this.c,j=q.$1(k),i=p.$1(0.2225045*n+0.7168786*l+0.0606169*j)
q=o===m
s=q&&m===k?i:p.$1((0.4360747*n+0.3850649*l+0.1430804*j)/0.96422)
r=q&&m===k?i:p.$1((0.0139322*n+0.0971045*l+0.7141733*j)/0.82521)
return new A.aS(Math.max(0,116*i-16),500*(s-i),200*(i-r))}}
A.kp.prototype={
$1(a){return a<=0.04045?a/12.92:Math.pow((a+0.055)/1.055,2.4)},
$S:4}
A.ko.prototype={
$1(a){return a>0.008856451679035631?Math.pow(a,0.3333333333333333):a/0.12841854934601665+0.13793103448275862},
$S:4}
A.km.prototype={
$1(a){return a>0.20689655172413793?a*a*a:0.12841854934601665*(a-0.13793103448275862)},
$S:4}
A.kn.prototype={
$1(a){return B.c.E(a<=0.0031308?12.92*a:1.055*Math.pow(a,0.4166666666666667)-0.055,0,1)},
$S:4}
A.ku.prototype={
$0(){return A.vU(this.a)},
$S:91}
A.kq.prototype={
$1(a){A.W(a)
return a+a},
$S:92}
A.kr.prototype={
$1(a){return A.W(a).length!==0},
$S:22}
A.ks.prototype={
$2(a,b){var s,r=this.a
if(!(a<r.length))return A.a(r,a)
s=r[a]
if(B.d.cz(s,"%")){r=A.P(B.d.a9(s,0,s.length-1))
r=(r==null?0:r)/100}else{r=A.P(s)
r=(r==null?0:r)/b}return r},
$S:45}
A.kt.prototype={
$1(a){var s,r=this
if(a<0)++a
if(a>1)--a
if(a<0.16666666666666666){s=r.a
return s+(r.b-s)*6*a}if(a<0.5)return r.b
if(a<0.6666666666666666){s=r.a
return s+(r.b-s)*(0.6666666666666666-a)*6}return r.a},
$S:4}
A.A.prototype={
sae(a){this.b=t.U.a(a)},
scZ(a){this.e=t.U.a(a)},
sio(a){this.w=t.n4.a(a)}}
A.mp.prototype={
$1(a){t.X.a(a)
return a.w==null?a.b.h(0,this.a):this.b.$1(a)},
$S:1}
A.mw.prototype={
$1(a){t.X.a(a)
return this.a},
$S:1}
A.oy.prototype={
$1(a){var s,r,q=this.a.$1(a)
if(typeof q=="string"&&B.d.v(q,"{")){s=this.b
r=s.h(0,q)
if(r==null){r=A.tk(q)
s.m(0,q,r)
s=r}else s=r
return s.$1(a)}return q instanceof A.bn?q:A.iL(A.au(q))},
$S:1}
A.oz.prototype={
$1(a){var s=this.a.$1(a)
return s instanceof A.bn?s:A.iL(A.au(s))},
$S:125}
A.oi.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=s.length,q=t.j,p=0,o="";p<s.length;s.length===r||(0,A.h)(s),++p){n=s[p]
o+=typeof n=="string"?n:A.au(a.b.h(0,B.a.gu(q.a(n))))}return A.iL(o.charCodeAt(0)==0?o:o)},
$S:5}
A.ov.prototype={
$1(a){var s,r,q,p
A:{s=t.j.b(a)
r=null
q=!1
if(s){p=J.o(a)
if(p.gk(a)>=1)if("coalesce"===p.h(a,0)){r=p.a_(a,1)
q=J.o(r)
q=q.gJ(r)&&q.ad(r,new A.ow())}}if(q){s=["$images"]
B.a.A(s,r)
break A}if(s){s=[]
for(q=J.F(a);q.n();)s.push(this.$1(q.gp()))
break A}s=a
break A}return s},
$S:47}
A.ow.prototype={
$1(a){var s
if(t.j.b(a)){s=J.o(a)
s=s.gJ(a)&&J.m(s.gu(a),"image")}else s=!1
return s},
$S:10}
A.ox.prototype={
$1(a){var s,r=this.a.$1(a)
A:{if(r instanceof A.bn){s=r.q(0)
break A}s=r
break A}return s},
$S:1}
A.ot.prototype={
$1(a){return!0},
$S:2}
A.ou.prototype={
$1(a){return J.m(this.a.$1(a),!0)},
$S:2}
A.mK.prototype={
$2(a,b){return J.m(b,"$type")?a.c:a.b.h(0,b)},
$S:49}
A.mB.prototype={
$1(a){var s,r,q
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q)if(!J.m(s[q].$1(a),!0))return!1
return!0},
$S:2}
A.mC.prototype={
$1(a){var s,r,q
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q)if(J.m(s[q].$1(a),!0))return!0
return!1},
$S:2}
A.mD.prototype={
$1(a){var s,r,q
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q)if(J.m(s[q].$1(a),!0))return!1
return!0},
$S:2}
A.mE.prototype={
$1(a){return!t.X.a(a).b.M(this.a)},
$S:2}
A.mF.prototype={
$1(a){return!this.a.v(0,this.b.$2(t.X.a(a),this.c))},
$S:2}
A.mG.prototype={
$1(a){return this.a.v(0,this.b.$2(t.X.a(a),this.c))},
$S:2}
A.mH.prototype={
$1(a){return J.m(this.a.$2(t.X.a(a),this.b),this.c)},
$S:2}
A.mI.prototype={
$1(a){return!J.m(this.a.$2(t.X.a(a),this.b),this.c)},
$S:2}
A.mJ.prototype={
$1(a){var s=this
t.X.a(a)
return A.pN(A.W(s.a),s.b.$2(a,s.c),s.d)},
$S:2}
A.d_.prototype={
hR(a,b){var s,r,q,p,o,n=a.toLowerCase(),m=b.toLowerCase(),l=B.d.ab(A.tn(n),A.tn(m))
if(l===0&&this.b)l=B.d.ab(n,m)
if(l===0&&this.a){s=t.J.i("i.E")
r=A.X(new A.an(a),s)
q=A.X(new A.an(b),s)
p=0
for(;;){if(!(l===0&&p<r.length&&p<q.length))break
if(!(p<r.length))return A.a(r,p)
o=A.Q(r[p])
s=o===o.toLowerCase()?0:1
if(!(p<q.length))return A.a(q,p)
o=A.Q(q[p])
l=B.b.ab(s,o===o.toLowerCase()?0:1);++p}}if(l>0)s=1
else s=l<0?-1:l
return s}}
A.om.prototype={
$1(a){var s
A.D(a)
s=$.u0().h(0,a)
return s==null?a:s},
$S:13}
A.n6.prototype={
$1(a){var s=this.a
return a<s.length?A.w(s[a]):A.aj(null)},
$S:50}
A.n5.prototype={
$0(){var s,r,q,p=A.b([],t.V)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q)p.push(A.w(s[q]))
return p},
$S:51}
A.o9.prototype={
$1(a){t.f3.a(a)
return new A.oa(this.a.$1(0),a)},
$S:52}
A.oa.prototype={
$1(a){var s=A.E(this.a.$1(t.X.a(a)))
return s==null?null:this.b.$1(s)},
$S:16}
A.n7.prototype={
$1(a){var s,r
t.X.a(a)
s=this.a.$1(a)
A:{if(t.f.b(s)){r=s.h(0,this.b.$1(a))
break A}r=null
break A}return r},
$S:1}
A.n8.prototype={
$1(a){return t.X.a(a).b.h(0,this.a)},
$S:1}
A.n9.prototype={
$1(a){t.X.a(a)
return a.b.h(0,this.a.$1(a))},
$S:1}
A.nk.prototype={
$1(a){var s,r
t.X.a(a)
s=this.a.$1(a)
A:{if(t.f.b(s)){r=s.M(this.b.$1(a))
break A}r=!1
break A}return r},
$S:2}
A.nv.prototype={
$1(a){return t.X.a(a).b.M(this.a)},
$S:2}
A.nG.prototype={
$1(a){return!t.X.a(a).b.M(this.a)},
$S:2}
A.nR.prototype={
$1(a){return t.X.a(a).b},
$S:54}
A.o1.prototype={
$1(a){return t.X.a(a).b.h(0,"$id")},
$S:1}
A.o5.prototype={
$1(a){return t.X.a(a).f},
$S:1}
A.o6.prototype={
$1(a){return t.X.a(a).e.h(0,this.a)},
$S:1}
A.o7.prototype={
$1(a){t.X.a(a)
return a.e.h(0,this.a.$1(a))},
$S:1}
A.na.prototype={
$1(a){var s,r,q=this
t.X.a(a)
s=q.a
r=s<=0?1:B.c.E((0-q.b-q.c)/s,0,1)
if(r>=1)return q.d.$1(a)
return A.rZ(q.e.$1(a),q.d.$1(a),A.xm(r))},
$S:1}
A.nb.prototype={
$1(a){var s,r,q,p
t.X.a(a)
s=A.b([],t.s)
for(r=this.a,q=r.length,p=0;p<r.length;r.length===q||(0,A.h)(r),++p)s.push(A.au(r[p].$1(a)))
return new A.aQ(s,t.dA.a(new A.n4()),t.cF).ac(0,"\x1f")},
$S:5}
A.n4.prototype={
$1(a){return A.W(a).length!==0},
$S:22}
A.nc.prototype={
$1(a){var s,r,q,p
t.X.a(a)
s=[]
for(r=this.a,q=r.length,p=0;p<r.length;r.length===q||(0,A.h)(r),++p)s.push(r[p].$1(a))
return s},
$S:55}
A.nd.prototype={
$1(a){t.X.a(a)
return 0},
$S:15}
A.ne.prototype={
$1(a){var s,r,q,p,o=this.a.$1(t.X.a(a))
A:{s=o instanceof A.d_
r=null
if(s){r=o.c
q=r
q=typeof q=="string"}else q=!1
if(q){p=s?r:o.c
if(p==null)p=A.W(p)
q=p
break A}q="en"
break A}return q},
$S:5}
A.nf.prototype={
$1(a){var s=a.w,r=s==null?null:s.$0()
if(r!=null){s=a.c
s=s!=="Polygon"&&this.a.ia(r,s==="LineString")}else s=!1
return s},
$S:2}
A.ng.prototype={
$1(a){var s=a.w,r=s==null?null:s.$0()
return r==null?null:this.a.hX(r,a.c)},
$S:16}
A.nh.prototype={
$1(a){return A.q1(this.a.$1(t.X.a(a)))},
$S:5}
A.ni.prototype={
$1(a){var s=A.t1(this.a.$1(t.X.a(a)))
return s==null?null:A.b([s.a*255,s.b*255,s.c*255,s.d],t.n)},
$S:57}
A.nj.prototype={
$1(a){var s,r,q,p,o,n,m,l,k
t.X.a(a)
s=this.a.$1(a)
r=typeof s=="string"
if(r)q=A.X(new A.an(s),t.J.i("i.E"))
else q=s
if(!t.j.b(q))return null
p=J.o(q)
o=p.gk(q)
n=new A.o8(o)
m=n.$2(this.b.$1(a),0)
l=this.c
k=p.I(q,m,Math.max(m,A.ys(n.$2(l==null?null:l.$1(a),o))))
return r?A.dL(J.cw(k,t.S),0,null):k},
$S:1}
A.o8.prototype={
$2(a,b){var s=A.E(a),r=s==null?null:B.c.S(s)
if(r==null)r=b
if(r<0)r+=this.a
return B.b.E(r,0,this.a)},
$S:58}
A.nl.prototype={
$1(a){var s,r,q,p,o,n,m,l,k,j=null
t.X.a(a)
s=this.a.$1(a)
r=this.b.$1(a)
q=this.c
p=q==null
o=A.E(p?j:q.$1(a))
o=o==null?j:B.c.S(o)
if(o==null)o=0
n=Math.max(0,o)
if(typeof s=="string"){m=A.X(new A.an(s),t.J.i("i.E"))
q=A.dL(A.aX(m,0,A.ct(n,"count",t.S),A.M(m).c),0,j)
if(A.H(r))p=A.v(r)
else p=r==null?"null":A.au(r)
l=B.d.aW(s,p,q.length)
return l<0?-1:new A.an(B.d.a9(s,0,l)).gk(0)}if(t.j.b(s)){q=A.E(p?j:q.$1(a))
k=q==null?j:B.c.S(q)
if(k==null)k=0
if(k<0)k=Math.max(0,k+J.V(s))
q=J.o(s)
return k>=q.gk(s)?-1:q.aW(s,r,k)}return-1},
$S:28}
A.nm.prototype={
$1(a){return t.X.a(a).a},
$S:15}
A.nn.prototype={
$1(a){return t.X.a(a).c},
$S:5}
A.no.prototype={
$1(a){return!A.tl(this.a.$1(t.X.a(a)))},
$S:2}
A.np.prototype={
$1(a){var s,r,q,p,o,n,m,l=this
t.X.a(a)
s=l.a.$1(a)
r=l.b.$1(a)
q=l.c.$1(a)
if(typeof s=="string"&&typeof r=="string"&&q instanceof A.d_){p=q.hR(s,r)
o=l.d
A:{if("=="===o){n=p===0
break A}if("!="===o){n=p!==0
break A}if("<"===o){n=p<0
break A}if("<="===o){n=p<=0
break A}if(">"===o){n=p>0
break A}n=p>=0
break A}return n}m=l.d
B:{if("=="===m){n=J.m(s,r)
break B}if("!="===m){n=!J.m(s,r)
break B}n=A.pN(m,s,r)
break B}return n},
$S:2}
A.nq.prototype={
$1(a){var s,r,q,p
t.X.a(a)
s=J.m(this.a.$1(a),!0)
r=J.m(this.b.$1(a),!0)
q=this.c.$1(a)
A:{if(typeof q=="string"){p=q
break A}p=null
break A}return new A.d_(s,r,p)},
$S:60}
A.nr.prototype={
$1(a){t.X.a(a)
return J.m(this.a.$1(a),this.b.$1(a))},
$S:2}
A.ns.prototype={
$1(a){t.X.a(a)
return!J.m(this.a.$1(a),this.b.$1(a))},
$S:2}
A.nt.prototype={
$1(a){t.X.a(a)
return A.pN(this.a,this.b.$1(a),this.c.$1(a))},
$S:2}
A.nu.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q].$1(a)
o=!1
if(p!=null){n=J.ao(p)
if(!n.D(p,!1))if(!n.D(p,0))if(!n.D(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(!p)return!1}return!0},
$S:2}
A.nw.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q].$1(a)
o=!1
if(p!=null){n=J.ao(p)
if(!n.D(p,!1))if(!n.D(p,0))if(!n.D(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(p)return!0}return!1},
$S:2}
A.nx.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q].$1(a)
o=!1
if(p!=null){n=J.ao(p)
if(!n.D(p,!1))if(!n.D(p,0))if(!n.D(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(p)return!1}return!0},
$S:2}
A.ny.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=0;q=r+1,p=s.length,q<p;r+=2){if(!(r<p))return A.a(s,r)
p=s[r].$1(a)
o=!1
if(p!=null){n=J.ao(p)
if(!n.D(p,!1))if(!n.D(p,0))if(!n.D(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(p){if(!(q<s.length))return A.a(s,q)
return s[q].$1(a)}}return r<p?s[r].$1(a):null},
$S:1}
A.nz.prototype={
$1(a){var s
t.X.a(a)
s=this.a.h(0,this.b.$1(a))
return(s==null?this.c:s).$1(a)},
$S:1}
A.nA.prototype={
$1(a){var s,r,q,p
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q].$1(a)
if(p!=null)return p}return null},
$S:1}
A.nB.prototype={
$1(a){var s,r,q,p,o,n,m,l=this
t.X.a(a)
s=A.E(l.a.$1(a))
if(s==null)return l.b.$1(a)
if(isNaN(s))return null
r=l.b
q=l.d
p=q.length
o=l.c
n=o.length
m=0
for(;;){if(!(m<n&&o[m]<=s))break
if(!(m<p))return A.a(q,m)
r=q[m];++m}return r.$1(a)},
$S:1}
A.nC.prototype={
$1(a){var s,r,q=this.a.$1(t.X.a(a))
A:{if(q instanceof A.ad){s="rgba("+B.c.Y(q.a*255)+","+B.c.Y(q.b*255)+","+B.c.Y(q.c*255)+","+A.au(q.d)+")"
break A}if(t.j.b(q)){s=B.h.ak(q,null)
break A}if(t.f.b(q)){s=B.h.ak(q,null)
break A}s=A.H(q)
if(s)r=A.v(q)
else r=q==null?"null":A.au(q)
if(r==="null")s=""
else if(s)s=A.v(q)
else s=q==null?"null":A.au(q)
break A}return s},
$S:5}
A.nD.prototype={
$1(a){var s,r,q
t.X.a(a)
s=A.E(this.a.$1(a))
if(s==null)return""
r=A.E(this.b.$1(a))
q=r==null?null:B.c.S(r)
if(q==null)q=0
r=A.E(this.c.$1(a))
r=r==null?null:B.c.S(r)
if(r==null)r=3
return A.xs(s,q,Math.max(q,r))},
$S:5}
A.nE.prototype={
$1(a){t.X.a(a)
return A.b(A.au(this.a.$1(a)).split(A.au(this.b.$1(a))),t.s)},
$S:61}
A.nF.prototype={
$1(a){var s,r
t.X.a(a)
s=this.a.$1(a)
A:{if(t.j.b(s)){r=J.iP(s,A.yD(),t.N).ac(0,A.au(this.b.$1(a)))
break A}r=""
break A}return r},
$S:5}
A.nH.prototype={
$1(a){var s,r,q,p,o
t.X.a(a)
s=A.b([],t.n)
for(r=this.a,q=r.length,p=0;p<r.length;r.length===q||(0,A.h)(r),++p){o=r[p].$1(a)
if(!(typeof o=="number"))if(typeof o=="string")o=A.P(o)
else if(A.H(o))o=o?1:0
else o=null
s.push(o==null?0:o)}if(s.length<3)return null
r=B.c.T(s[0],360)
q=B.c.E(s[1]/100,0,1)
if(2>=s.length)return A.a(s,2)
o=B.c.E(s[2]/100,0,1)
s=s.length>3?s[3]:1
return A.rl(r/360,q,o,s)},
$S:26}
A.nI.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q].$1(a)
if(p!=null)o=typeof p=="string"&&B.d.bo(p).length===0
else o=!0
if(o)return 0
if(typeof p=="number")n=p
else if(typeof p=="string"){o=A.P(p)
n=o}else{if(A.H(p))o=p?1:0
else o=null
n=o}if(n!=null&&!isNaN(n))return n}return null},
$S:16}
A.nJ.prototype={
$1(a){var s,r,q,p,o,n,m
t.X.a(a)
for(s=this.a,r=s.length,q=t.f,p=this.b,o=0;o<s.length;s.length===r||(0,A.h)(s),++o){n=s[o].$1(a)
A:{if("number"===p){m=typeof n=="number"
break A}if("string"===p){m=typeof n=="string"
break A}if("boolean"===p){m=A.H(n)
break A}m=q.b(n)
break A}if(m)return n}return null},
$S:1}
A.nK.prototype={
$1(a){return A.tl(this.a.$1(t.X.a(a)))},
$S:2}
A.nL.prototype={
$1(a){var s,r,q,p
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=A.t1(s[q].$1(a))
if(p!=null)return p}return null},
$S:26}
A.nM.prototype={
$1(a){var s,r=this.a.$1(t.X.a(a))
if(!t.j.b(r))return null
s=this.b
if(s!=null&&J.V(r)!==s)return null
s=this.c
if(s!=null&&s!=="value"&&!J.qt(r,new A.n3(s)))return null
return r},
$S:63}
A.n3.prototype={
$1(a){return A.q1(a)===this.a},
$S:8}
A.nN.prototype={
$1(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=null
t.X.a(a)
s=A.b([],t.eJ)
for(r=this.a,q=r.length,p=t.j,o=t.s,n=0;n<r.length;r.length===q||(0,A.h)(r),++n){m=r[n]
l=m.a
k=m.b
j=m.c
m=j?"":A.au(l.$1(a))
i=j?A.au(l.$1(a)):c
h=k.h(0,"font-scale")
h=h==null?c:h.$1(a)
if(!(typeof h=="number"))if(typeof h=="string")h=A.P(h)
else if(A.H(h))h=h?1:0
else h=c
if(h==null)h=1
g=k.h(0,"text-font")
f=g==null?c:g.$1(a)
A:{if(p.b(f)){g=A.b([],o)
for(e=J.F(f);e.n();)g.push(A.v(e.gp()))
break A}g=c
break A}e=k.h(0,"text-color")
e=A.aO(e==null?c:e.$1(a))
d=k.h(0,"vertical-align")
s.push(new A.bB(i,m,h,g,e,A.dY(d==null?c:d.$1(a))))}return new A.bn(s)},
$S:65}
A.nO.prototype={
$1(a){var s,r,q,p
t.X.a(a)
for(s=this.a,r=s.length,q=0,p="";q<s.length;s.length===r||(0,A.h)(s),++q)p+=A.au(s[q].$1(a))
return p.charCodeAt(0)==0?p:p},
$S:5}
A.nP.prototype={
$1(a){return A.au(this.a.$1(t.X.a(a))).toUpperCase()},
$S:5}
A.nQ.prototype={
$1(a){return A.au(this.a.$1(t.X.a(a))).toLowerCase()},
$S:5}
A.nS.prototype={
$1(a){var s,r,q,p,o,n,m
t.X.a(a)
s=this.a
A:{r=this.b
q=r.length
if(q!==0){p=null
break A}if("+"===s){p=0
break A}if("*"===s){p=1
break A}if("min"===s){p=1/0
break A}p=-1/0
break A}for(o=p,n=0;n<r.length;r.length===q||(0,A.h)(r),++n){m=r[n].$1(a)
if(!(typeof m=="number"))if(typeof m=="string"){p=A.P(m)
m=p}else{if(A.H(m))p=m?1:0
else p=null
m=p}if(m==null)return null
if(o==null)o=m
else{B:{if("+"===s){p=o+m
break B}if("*"===s){p=o*m
break B}if("min"===s){p=Math.min(o,m)
break B}p=Math.max(o,m)
break B}o=p}}return o},
$S:16}
A.nT.prototype={
$1(a){return-a},
$S:4}
A.nU.prototype={
$1(a){var s,r,q,p
t.X.a(a)
s=A.E(this.a.$1(a))
r=A.E(this.b.$1(a))
if(s==null||r==null)return null
q=this.c
A:{if("-"===q){p=s-r
break A}if("/"===q){p=s/r
break A}if("%"===q){p=B.c.T(s,r)
break A}p=Math.pow(s,r)
break A}return p},
$S:16}
A.nV.prototype={
$1(a){return B.c.a1(a)},
$S:4}
A.nW.prototype={
$1(a){return Math.floor(a)},
$S:4}
A.nX.prototype={
$1(a){return Math.ceil(a)},
$S:4}
A.nY.prototype={
$1(a){return Math.abs(a)},
$S:4}
A.nZ.prototype={
$1(a){return Math.log(a)/2.302585092994046},
$S:4}
A.o_.prototype={
$1(a){return Math.log(a)/0.6931471805599453},
$S:4}
A.o0.prototype={
$1(a){var s,r=this.a.$1(t.X.a(a))
if(typeof r=="string")s=new A.an(r).gk(0)
else s=t.j.b(r)?J.V(r):null
return s},
$S:66}
A.o2.prototype={
$1(a){var s,r,q
t.X.a(a)
s=this.a.$1(a)
r=this.b.$1(a)
if(t.j.b(s))return J.qs(s,r)
if(typeof s=="string"){if(r!=null){if(A.H(r))q=A.v(r)
else q=A.au(r)
q=B.d.v(s,q)&&s.length!==0}else q=!1
return q}return!1},
$S:2}
A.o3.prototype={
$1(a){var s,r,q
t.X.a(a)
s=this.a.$1(a)
r=A.E(this.b.$1(a))
q=r==null?null:B.c.S(r)
return t.j.b(s)&&q!=null&&q>=0&&q<J.V(s)?J.al(s,q):null},
$S:30}
A.o4.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
s=A.b([],t.n)
for(r=this.a,q=r.length,p=0;p<r.length;r.length===q||(0,A.h)(r),++p){o=r[p].$1(a)
if(!(typeof o=="number"))if(typeof o=="string")o=A.P(o)
else if(A.H(o))o=o?1:0
else o=null
s.push(o==null?0:o)}r=s.length
if(r<3)return null
q=s[0]
o=s[1]
n=s[2]
s=r>3?s[3]:1
return new A.ad(q/255,o/255,n/255,s)},
$S:26}
A.mr.prototype={
$1(a){return typeof a=="number"},
$S:8}
A.ms.prototype={
$1(a){A.db(a)
return a<0||a>255},
$S:31}
A.mL.prototype={
$1(a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=this,a4=null
t.X.a(a5)
s=A.E(a3.a.$1(a5))
r=s!=null
if(r&&isNaN(s))return a4
if(!r||s<=B.a.gu(a3.b))return B.a.i5(a3.c,a5)
r=a3.b
if(s>=B.a.gN(r))return B.a.il(a3.c,a5)
q=r.length
p=1
for(;;){if(!(p<q))return A.a(r,p)
o=r[p]
if(!(o<s))break;++p}q=p-1
r=r[q]
n=o-r
m=s-r
if(n===0)l=0
else{r=a3.d
if(r!=null){r=A.xa(r,m/n)
l=r}else{r=a3.e
r=r===1?m/n:(Math.pow(r,m)-1)/(Math.pow(r,n)-1)
l=r}}r=a3.c
if(!(q<r.length))return A.a(r,q)
k=r[q].$1(a5)
if(!(p<r.length))return A.a(r,p)
j=r[p].$1(a5)
if(typeof k=="number"&&typeof j=="number"){if(a3.f&&k>0&&j>0)return k*Math.pow(j/k,l)
return k+(j-k)*l}r=t.j
if(r.b(k)&&r.b(j)&&J.V(k)===J.V(j)){r=A.b([],t.n)
for(q=J.o(k),o=J.o(j),i=0;i<q.gk(k);++i){h=q.h(k,i)
if(!(typeof h=="number"))if(typeof h=="string")h=A.P(h)
else if(A.H(h))h=h?1:0
else h=a4
if(h==null)h=0
g=o.h(j,i)
if(!(typeof g=="number"))if(typeof g=="string")g=A.P(g)
else if(A.H(g))g=g?1:0
else g=a4
if(g==null)g=0
f=q.h(k,i)
if(!(typeof f=="number"))if(typeof f=="string")f=A.P(f)
else if(A.H(f))f=f?1:0
else f=a4
r.push(h+(g-(f==null?0:f))*l)}return r}e=A.aO(k)
d=A.aO(j)
if(e!=null&&d!=null){c=a3.r
A:{if("hcl"===c){k=e.gbA()
j=d.gbA()
r=k.c
q=k.b
b=Math.atan2(r,q)
o=j.c
h=j.b
a=Math.atan2(o,h)
a0=Math.sqrt(q*q+r*r)
a1=Math.sqrt(h*h+o*o)
a2=a-b
if(a2>3.141592653589793)a2-=6.283185307179586
b+=(a2<-3.141592653589793?a2+6.283185307179586:a2)*l
a5=a0+(a1-a0)*l
r=k.a
q=Math.cos(b)
o=Math.sin(b)
h=e.d
h=A.rk(r+(j.a-r)*l,q*a5,o*a5,h+(d.d-h)*l)
r=h
break A}if("lab"===c){k=e.gbA()
j=d.gbA()
r=k.a
q=k.b
o=k.c
h=e.d
h=A.rk(r+(j.a-r)*l,q+(j.b-q)*l,o+(j.c-o)*l,h+(d.d-h)*l)
r=h
break A}r=A.rm(e,d,l)
break A}return r}return k},
$S:1}
A.mn.prototype={
$3(a,b,c){var s=1-a,r=3*s
return r*s*a*b+r*a*a*c+a*a*a},
$S:69}
A.mP.prototype={
$1(a){return a.b.h(0,this.a)},
$S:1}
A.mQ.prototype={
$1(a){return a.a},
$S:15}
A.mR.prototype={
$1(a){var s=this.a.$1(t.X.a(a))
return s==null?this.b:s},
$S:1}
A.mS.prototype={
$1(a){var s
if(t.j.b(a)){s=J.o(a)
s=s.gJ(a)&&t.f.b(s.gu(a))}else s=!1
return s},
$S:8}
A.mT.prototype={
$1(a){var s=this.a.h(0,this.b.$1(t.X.a(a)))
return s==null?this.c:s},
$S:1}
A.mU.prototype={
$1(a){var s
if(typeof a!="number"){if(t.j.b(a)){s=J.o(a)
s=s.gJ(a)&&s.ad(a,new A.mO())}else s=!1
s=s||A.aO(a)!=null}else s=!0
return s},
$S:10}
A.mO.prototype={
$1(a){return typeof a=="number"},
$S:8}
A.mV.prototype={
$1(a){var s,r,q,p,o,n,m=this,l=m.a.$1(t.X.a(a))
if(typeof l!="number")return m.b
s=m.c
r=B.a.gu(s)
q=s.length
p=m.d
o=p.length
n=0
for(;;){if(!(n<o&&p[n]<=l))break
if(!(n<q))return A.a(s,n)
r=s[n];++n}return r},
$S:1}
A.mW.prototype={
$1(a){t.X.a(a)
return typeof a.b.h(0,this.a)=="number"?this.b.$1(a):this.c},
$S:1}
A.mt.prototype={
$1(a){var s,r,q,p,o
t.X.a(a)
s=this.a
r=s.length
q=a.a
p=0
for(;;){o=p+1
if(!(o<r&&s[o]<=q))break
p=o}s=this.b
if(!(p<s.length))return A.a(s,p)
return s[p].$1(a)},
$S:1}
A.mu.prototype={
$1(a){return a.a},
$S:15}
A.ef.prototype={}
A.h2.prototype={
hH(c7,c8,c9,d0,d1,d2,d3,d4,d5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4=this,c5={},c6=t.L
c6.a(c9)
c6.a(d0)
if(d1<d2)return
s=c5.a=-1
r=c4.x
r.b=0
q=A.b([],t.t)
c6=c4.e
p=B.b.F(c6.b,4)
o=c4.r
n=o.b
c5.b=c5.c=c5.d=0
c5.e=p
m=new A.jm(c5,c4,r,q)
for(l=c4.y,k=c4.z,j=d5>0,i=c8.length,h=0,g=0,f=0,e=0;e<c9.length;++e){d=c9[e]
if(!(e<d0.length))return A.a(d0,e)
c=d0[e]
b=c-d
if(b<3)continue
a=d*2
if(!(a<i))return A.a(c8,a)
a0=c8[a]
a1=(c-1)*2
if(!(a1>=0&&a1<i))return A.a(c8,a1)
if(a0===c8[a1]){a0=a+1
if(!(a0<i))return A.a(c8,a0)
a0=c8[a0];++a1
if(!(a1<i))return A.a(c8,a1)
a1=a0===c8[a1]
a0=a1}else a0=!1
if(a0)--b
a2=A.bA(c8,a,(d+b)*2)
if(j){a2=A.zc(a2,d5)
b=a2.length/2|0}for(a=a2.length,a3=0,a4=0;a4<b;a4=a5){a5=a4+1
a6=B.b.T(a5,b)
a0=a4*2
if(!(a0<a))return A.a(a2,a0)
a1=a2[a0]
a7=a6*2
a8=a7+1
if(!(a8>=0&&a8<a))return A.a(a2,a8)
a8=a2[a8]
if(!(a7>=0&&a7<a))return A.a(a2,a7)
a7=a2[a7];++a0
if(!(a0<a))return A.a(a2,a0)
a3+=a1*a8-a7*a2[a0]}if(Math.abs(a3)<1)continue
if(a3>0){m.$0()
a4=c5.a=0
f+=a3
for(;a4<b;++a4){a0=a4*2
if(!(a0<a))return A.a(a2,a0)
h+=a2[a0]*a3/b;++a0
if(!(a0<a))return A.a(a2,a0)
g+=a2[a0]*a3/b}}else if(c5.a>=0)B.a.j(q,B.b.F(r.b,2))
else continue
for(a4=0;a4<b;++a4){a0=c5.d
a1=a4*2
if(!(a1<a))return A.a(a2,a1)
c5.d=a0+a2[a1]
a0=c5.c;++a1
if(!(a1<a))return A.a(a2,a1)
c5.c=a0+a2[a1]}c5.b+=b
a0=b*2
a9=new Float64Array(a0)
for(a4=0;a4<b;){a1=a4*2
if(!(a1<a))return A.a(a2,a1)
b0=a2[a1]
a7=a1+1
if(!(a7<a))return A.a(a2,a7)
b1=a2[a7]
r.aJ(b0,b1);++a4
a8=B.b.T(a4,b)*2
if(!(a8>=0&&a8<a))return A.a(a2,a8)
b2=a2[a8];++a8
if(!(a8<a))return A.a(a2,a8)
b3=a2[a8]
if(b0===b2)a8=b0<0||b0>4096
else a8=!1
if(!a8)if(b1===b3)a8=b1<0||b1>4096
else a8=!1
else a8=!0
if(a8)continue
if(!(a1<a0))return A.a(a9,a1)
a9[a1]=b3-b1
if(!(a7<a0))return A.a(a9,a7)
a9[a7]=b0-b2}b4=j?A.zh(a9):null
for(a1=b4!=null,b5=0,a4=0;a4<b;++a4){a7=a4*2
if(!(a7<a0))return A.a(a9,a7)
b6=a9[a7]
a8=a7+1
if(!(a8<a0))return A.a(a9,a8)
b7=a9[a8]
if(b6===0&&b7===0)continue
a6=B.b.T(a4+1,b)
if(!(a7<a))return A.a(a2,a7)
a7=a2[a7]
if(!(a8<a))return A.a(a2,a8)
a8=a2[a8]
b8=a6*2
if(!(b8>=0&&b8<a))return A.a(a2,b8)
b9=a2[b8];++b8
if(!(b8<a))return A.a(a2,b8)
c6.av(a7,a8,b9,a2[b8])
b8=b6*b6+b7*b7
c0=Math.sqrt(b8)
if(b5+c0>16384)b5=0
a7=B.c.a1(b5*2)
b5+=c0
k.aJ(B.c.a1(b5*2)/2,a7/2)
if(a1){a7=a4*4
a8=b4.length
if(!(a7<a8))return A.a(b4,a7)
b8=b4[a7]
b9=a7+1
if(!(b9<a8))return A.a(b4,b9)
b9=b4[b9]
c1=a7+2
if(!(c1<a8))return A.a(b4,c1)
c1=b4[c1]
a7+=3
if(!(a7<a8))return A.a(b4,a7)
l.av(b8,b9,c1,b4[a7])}else{c2=Math.sqrt(b8)
a7=b6/c2
a8=b7/c2
l.av(a7,a8,a7,a8)}}}m.$0()
c3=B.b.F(c6.b,4)-p
if(c3===0||f===0)return
if(d4!=null){c6=c4.ax
s=B.a.aF(c6,d4)
if(s<0){s=c6.length
B.a.j(c6,d4)}}B.a.j(c4.at,s)
c6=c4.w
c6.av(d1,d2,h/f,g/f)
c6.av(p,c3,n,o.b-n)
o=d3.d
c6.av(d3.a*o,d3.b*o,d3.c*o,1)},
i4(e2,e3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9=this,e0={},e1=d9.w
if(e1.b===0)return null
s=d9.e
r=new Float32Array(A.R(A.bA(s.a,0,s.b)))
q=new Float32Array(A.R(A.bA(e1.a,0,e1.b)))
if(!e3){e1=d9.f
e1=new Float32Array(A.R(A.bA(e1.a,0,e1.b)))
s=d9.r
s=new Float32Array(A.R(A.bA(s.a,0,s.b)))
p=new Float32Array(0)
o=new Uint32Array(0)
n=A.qE(r,q)
m=A.X(d9.ax,t.N)
return new A.ef(n,p,o,m,d9.a,r,e1,s,q)}for(p=e1.b,o=e1.a,n=o.length,l=0,k=0,j=0;j<p;j+=12){m=j+5
if(!(m<n))return A.a(o,m)
m=B.c.S(o[m])
i=j+7
if(!(i<n))return A.a(o,i)
i=B.c.S(o[i])
l+=m*4+i
k+=m*6+i}h=new Float32Array(l*13)
g=new Uint32Array(k)
p=d9.f
o=B.b.F(p.b,2)
f=new Int32Array(o)
B.x.az(f,0,o,-1)
e0.a=0
for(n=d9.r,m=d9.as,i=d9.y,e=d9.z,d=d9.d,c=d9.Q,b=d9.at,a=0,j=0;j<e1.b;j+=12){a0=e1.a
a1=a0.length
if(!(j<a1))return A.a(a0,j)
a2=a0[j]
a3=j+1
if(!(a3<a1))return A.a(a0,a3)
a4=a0[a3]
a3=j+8
if(!(a3<a1))return A.a(a0,a3)
a5=a0[a3]
a3=j+9
if(!(a3<a1))return A.a(a0,a3)
a6=a0[a3]
a3=j+10
if(!(a3<a1))return A.a(a0,a3)
a7=a0[a3]
a3=j+11
if(!(a3<a1))return A.a(a0,a3)
a8=B.c.E(B.c.a1(a0[a3]*255),0,255)
a3=B.c.Y(a5*255)
a0=B.c.Y(a6*255)
a1=B.c.Y(a7*255)
a9=B.b.F(j,12)
if(!(a9<b.length))return A.a(b,a9)
b0=new A.jn(e0,d9,h,a3+a0*256+a1*65536,a8,a4,a2,b[a9]+1)
a9=j+4
a1=e1.a
a0=a1.length
if(!(a9<a0))return A.a(a1,a9)
b1=B.c.S(a1[a9])
a9=j+5
if(!(a9<a0))return A.a(a1,a9)
for(a0=b1+B.c.S(a1[a9]),b2=a4*d,b3=a2*d,b4=b1;b4<a0;++b4){a1=b4*4
a3=s.a
a9=a3.length
if(!(a1>=0&&a1<a9))return A.a(a3,a1)
b5=a3[a1]
b6=a1+1
if(!(b6<a9))return A.a(a3,b6)
b7=a3[b6]
b8=a1+2
if(!(b8<a9))return A.a(a3,b8)
b9=a3[b8]
c0=a1+3
if(!(c0<a9))return A.a(a3,c0)
c1=a3[c0]
if(b5===b9&&b7===c1)continue
a3=i.a
a9=a3.length
if(!(a1<a9))return A.a(a3,a1)
c2=a3[a1]
if(!(b6<a9))return A.a(a3,b6)
c3=a3[b6]
if(!(b8<a9))return A.a(a3,b8)
c4=a3[b8]
if(!(c0<a9))return A.a(a3,c0)
c5=a3[c0]
c0=b4*2
a3=e.a
a9=a3.length
if(!(c0>=0&&c0<a9))return A.a(a3,c0)
c6=a3[c0]
b8=c0+1
if(!(b8<a9))return A.a(a3,b8)
c7=a3[b8]
a3=c.a
a9=a3.length
if(!(c0<a9))return A.a(a3,c0)
c8=a3[c0]
if(!(b8<a9))return A.a(a3,b8)
c9=a3[b8]
d0=B.b.F(e0.a,13)
b0.$10(b5,b7,a4,c2,c3,0,c6,b2,c8,c9)
b0.$10(b9,c1,a4,c4,c5,0,c7,b2,c8,c9)
b0.$10(b9,c1,a2,c4,c5,1,c7,b3,c8,c9)
b0.$10(b5,b7,a2,c2,c3,1,c6,b3,c8,c9)
d1=a+1
if(!(a>=0&&a<k))return A.a(g,a)
g[a]=d0
a=d1+1
if(!(d1>=0&&d1<k))return A.a(g,d1)
g[d1]=d0+1
d1=a+1
b8=d0+2
if(!(a>=0&&a<k))return A.a(g,a)
g[a]=b8
a=d1+1
if(!(d1>=0&&d1<k))return A.a(g,d1)
g[d1]=d0
d1=a+1
if(!(a>=0&&a<k))return A.a(g,a)
g[a]=b8
a=d1+1
if(!(d1>=0&&d1<k))return A.a(g,d1)
g[d1]=d0+3}a0=j+6
a1=e1.a
a3=a1.length
if(!(a0<a3))return A.a(a1,a0)
d2=B.c.S(a1[a0])
a0=j+7
if(!(a0<a3))return A.a(a1,a0)
for(a0=d2+B.c.S(a1[a0]),b4=d2;b4<a0;++b4,a=d1){a1=n.a
if(!(b4>=0&&b4<a1.length))return A.a(a1,b4)
d3=B.c.S(a1[b4])
if(!(d3>=0&&d3<o))return A.a(f,d3)
if(f[d3]<0){a1=B.b.F(e0.a,13)
if(!(d3<o))return A.a(f,d3)
f[d3]=a1
a1=d3*2
a3=p.a
a9=a3.length
if(!(a1>=0&&a1<a9))return A.a(a3,a1)
d4=a3[a1]
b6=a1+1
if(!(b6<a9))return A.a(a3,b6)
d5=a3[b6]
a3=m.a
a9=a3.length
if(!(a1<a9))return A.a(a3,a1)
a1=a3[a1]
if(!(b6<a9))return A.a(a3,b6)
b0.$10(d4,d5,a2,0,0,1,d4,d5,a1,a3[b6])}d1=a+1
a1=f[d3]
if(!(a>=0&&a<k))return A.a(g,a)
g[a]=a1}}d6=B.o.I(h,0,e0.a)
d7=B.i.I(g,0,a)
if(e2>0){d8=A.uU(d6,d7,e2)
d6=d8.a
d7=d8.b}e1=new Float32Array(A.R(A.bA(p.a,0,p.b)))
n=new Float32Array(A.R(A.bA(n.a,0,n.b)))
s=A.qE(r,q)
p=A.X(d9.ax,t.N)
return new A.ef(s,d6,d7,p,d9.a,r,e1,n,q)}}
A.jm.prototype={
$0(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=f.a,d=e.b
if(d>0){s=Math.floor(e.d/d)
r=Math.floor(e.c/e.b)
for(q=e.e,d=f.b,p=d.e,o=d.Q;q<B.b.F(p.b,4);++q)o.aJ(s,r)
if(e.a>=0&&f.c.b>=6)for(p=f.c,d=d.as,n=0;n<B.b.F(p.b,2);++n)d.aJ(s,r)}e.b=e.d=e.c=0
d=f.b
e.e=B.b.F(d.e.b,4)
if(e.a<0||f.c.b<6){f.c.b=0
B.a.a2(f.d)
e.a=-1
return}p=f.c
o=f.d
m=A.qM(B.q.I(p.a,0,p.b),o)
l=d.f
k=l.b
j=B.b.F(k,2)
k+=p.b
if(k>l.a.length)l.bz(k)
k=l.a
i=l.b
B.q.Z(k,i,i+p.b,p.a)
l.b=l.b+p.b
for(l=m.length,d=d.r,h=0;h<m.length;m.length===l||(0,A.h)(m),++h){g=m[h]
k=d.b
if(k===d.a.length)d.bz(k+1)
k=d.a
i=d.b++
k.$flags&2&&A.x(k)
if(!(i<k.length))return A.a(k,i)
k[i]=j+g}p.b=0
B.a.a2(o)
e.a=-1},
$S:0}
A.jn.prototype={
$10(a,b,c,d,e,f,g,h,i,j){var s,r,q=this,p=q.c,o=q.a,n=o.a,m=o.a=n+1
p.$flags&2&&A.x(p)
s=p.length
if(!(n<s))return A.a(p,n)
p[n]=a
r=o.a=m+1
if(!(m<s))return A.a(p,m)
p[m]=b
m=o.a=r+1
if(!(r<s))return A.a(p,r)
p[r]=c
r=o.a=m+1
if(!(m<s))return A.a(p,m)
p[m]=q.d
m=o.a=r+1
if(!(r<s))return A.a(p,r)
p[r]=q.e
r=o.a=m+1
if(!(m<s))return A.a(p,m)
p[m]=d
m=o.a=r+1
if(!(r<s))return A.a(p,r)
p[r]=e
o.a=m+1
if(d===0&&e===0)n=1
else{n=q.b
n=n.c?B.c.E((f+Math.max(0,q.f))*Math.sqrt(Math.max(0,q.r)/150),0.7+0.28*(1-n.b.a),1):1}if(!(m<s))return A.a(p,m)
p[m]=n
n=o.a
m=o.a=n+1
if(!(n<s))return A.a(p,n)
p[n]=g
r=o.a=m+1
if(!(m<s))return A.a(p,m)
p[m]=h
m=o.a=r+1
if(!(r<s))return A.a(p,r)
p[r]=q.w
r=o.a=m+1
if(!(m<s))return A.a(p,m)
p[m]=i
o.a=r+1
if(!(r<s))return A.a(p,r)
p[r]=j},
$S:70}
A.bB.prototype={}
A.bn.prototype={
q(a){var s=this.a,r=A.M(s)
return new A.ar(s,r.i("q(1)").a(new A.jt()),r.i("ar<1,q>")).bP(0)}}
A.jt.prototype={
$1(a){return t.oc.a(a).b},
$S:71}
A.oO.prototype={
$1(a){t.oc.a(a)
return a.c===1&&a.d==null&&a.e==null&&a.f==null&&a.a==null},
$S:72}
A.pf.prototype={
$1(a){return A.W(a).length===0},
$S:22}
A.bC.prototype={
dj(a){var s,r,q,p,o,n,m,l,k,j=this,i="geometry",h=t.f
if(!h.b(a))return
switch(a.h(0,"type")){case"FeatureCollection":s=a.h(0,"features")
if(t.j.b(s))J.pj(s,j.gfG())
break
case"Feature":r=a.h(0,"properties")
q=A.C(t.N,t.O)
if(h.b(r))for(p=r.gai(),p=p.gt(p);p.n();){o=p.gp()
q.m(0,A.v(o.a),o.b)}if(j.b)n=j.c++
else{p=j.a
n=p!=null?q.h(0,p):a.h(0,"id")}q.aA(0,"$id")
if(n!=null)q.m(0,"$id",n)
m=j.d
if(m!=null){l=a.h(0,i)
p=j.e
p.sae(q)
k=h.b(l)?l.h(0,"type"):null
A:{if("Point"===k||"MultiPoint"===k){h="Point"
break A}if("LineString"===k||"MultiLineString"===k){h="LineString"
break A}if("Polygon"===k||"MultiPolygon"===k){h="Polygon"
break A}h=""
break A}p.c=h
if(!m.$1(p))return}j.c7(a.h(0,i),q)
break
default:j.c7(a,B.e)}},
c7(a,b){var s,r,q,p,o,n,m,l=this
t.U.a(b)
if(!t.f.b(a))return
s=a.h(0,"coordinates")
switch(a.h(0,"type")){case"Point":l.aS(1,b,A.b([A.h3([s])],t.w))
break
case"MultiPoint":if(t.j.b(s))l.aS(1,b,A.b([A.h3(s)],t.w))
break
case"LineString":if(t.j.b(s))l.aS(2,b,A.b([A.h3(s)],t.w))
break
case"MultiLineString":r=t.j
if(r.b(s)){q=A.b([],t.w)
for(p=J.F(s);p.n();){o=p.gp()
if(r.b(o))q.push(A.h3(o))}l.aS(2,b,q)}break
case"Polygon":if(t.j.b(s))l.aS(3,b,l.di(s))
break
case"MultiPolygon":r=t.j
if(r.b(s)){q=A.b([],t.w)
for(p=J.F(s);p.n();){n=p.gp()
if(r.b(n))B.a.A(q,l.di(n))}l.aS(3,b,q)}break
case"GeometryCollection":m=a.h(0,"geometries")
if(t.j.b(m))for(r=J.F(m);r.n();)l.c7(r.gp(),b)
break}},
di(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=A.b([],t.w)
for(s=J.o(a),r=t.j,q=0;q<s.gk(a);++q){p=s.h(a,q)
if(!r.b(p))continue
o=A.h3(p)
n=o.length
if(n<6)continue
if(A.v_(o)>0!==(q===0))for(m=n-2,n=o.$flags|0,l=0;l<m;l+=2,m-=2){k=o[l]
j=l+1
i=o[j]
h=o[m]
n&2&&A.x(o)
o[l]=h
h=m+1
o[j]=o[h]
o[m]=k
o[h]=i}B.a.j(g,o)}return g},
aS(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
t.U.a(b)
t.lt.a(c)
if(this.r&&a===1){for(s=c.length,r=this.w,q=0;q<c.length;c.length===s||(0,A.h)(c),++q){p=c[q]
for(o=p.length,n=0;n<o;n+=2){m=p[n]
l=n+1
if(!(l<o))return A.a(p,l)
B.a.j(r,new A.b6(m,p[l],1,b))}}return}for(s=c.length,k=1/0,j=1/0,i=-1/0,h=-1/0,q=0;q<s;++q){p=c[q]
for(r=p.length,n=0;n<r;n+=2){g=p[n]
if(g<k)k=g
if(g>i)i=g
o=n+1
if(!(o<r))return A.a(p,o)
f=p[o]
if(f<j)j=f
if(f>h)h=f}}if(k>i)return
B.a.j(this.f,new A.ib(a,b,c,k,j,i,h))},
aB(a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=B.b.a8(1,a5),b=d.y/4096/c,a=d.z/4096/c,a0=a6/c,a1=a7/c,a2=(a6+1)/c,a3=(a7+1)/c,a4=A.b([],t.d)
for(s=d.f,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q]
o=p.a===2?a:b
for(n=p.d,m=1+o,l=p.f,k=-o,j=l<=1,i=n>=0,h=0;h<3;++h){g=B.bb[h]
f=g!==0
if(f&&n+g>m)continue
if(f&&l+g<k)continue
if(g<0&&j)continue
if(g>0&&i)continue
d.fe(p,g,c,a6,a7,o,a0,a1,a2,a3,a4)}}s=d.x
if(s==null)s=null
else{r=s.b
r===$&&A.j()
s=B.b.E(a5,0,s.a.b+1)
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]}if(s==null)s=B.F
r=s.length
n=t.w
m=a0-b
l=a2+b
k=a1-b
j=a3+b
q=0
for(;q<s.length;s.length===r||(0,A.h)(s),++q){e=s[q]
i=e.a
f=!0
if(!(i<m))if(!(i>l)){f=e.b
f=f<k||f>j}if(f)continue
f=new Float64Array(2)
f[0]=B.c.a1((i*c-a6)*4096*2)/2
f[1]=B.c.a1((e.b*c-a7)*4096*2)/2
B.a.j(a4,new A.dS(null,1,e.d,A.b([f],n)))}return a4.length===0?B.ac:A.b([new A.ip(a4)],t.e)},
fe(a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
t.dg.a(a9)
if(a.f+a0<a5-a4||a.d+a0>a7+a4||a.r<a6-a4||a.e>a8+a4)return
s=A.b([],t.w)
r=a.a
q=r===2?A.b([],t.n):null
for(p=a.c,o=p.length,n=t.n,m=0;m<p.length;p.length===o||(0,A.h)(p),++m){l=p[m]
k=l.length
j=new Float64Array(k)
for(i=0;i<k;i+=2){h=B.c.a1(((l[i]+a0)*a1-a2)*4096*2)
if(!(i<k))return A.a(j,i)
j[i]=h/2
h=i+1
if(!(h<k))return A.a(l,h)
g=B.c.a1((l[h]*a1-a3)*4096*2)
if(!(h<k))return A.a(j,h)
j[h]=g/2}switch(r){case 1:B.a.j(s,j)
break
case 2:f=A.b([],n)
e=this.ff(j,s,f)
for(k=f.length,h=1/e,g=e===0,d=0;d<f.length;f.length===k||(0,A.h)(f),++d){c=f[d]
q.toString
B.a.j(q,g?0:c/e)
B.a.j(q,g?0:h)}break
default:b=this.fg(j)
if(b.length>=6)B.a.j(s,b)}}if(s.length!==0)B.a.j(a9,new A.dS(q,r,a.b,s))},
ff(a,b,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c={}
t.lt.a(b)
t.H.a(a0)
c.a=A.b([],t.n)
c.b=0
s=new A.jy(c,b,a0)
for(r=a.length,q=this.z,p=-q,q=4096+q,o=0,n=2;n<r;n+=2,o=f){m={}
l=a[n-2]
k=a[n-1]
j=a[n]-l
i=n+1
if(!(i<r))return A.a(a,i)
h=a[i]-k
g=Math.sqrt(j*j+h*h)
f=o+g
m.a=0
m.b=1
i=m.c=!0
e=new A.jx(m)
e.$2(-j,l-p)
e.$2(j,q-l)
e.$2(-h,k-p)
e.$2(h,q-k)
if(!m.c){s.$0()
continue}if(!(m.a>0)?c.a.length===0:i){s.$0()
i=m.a
c.b=o+g*i
d=c.a
B.a.j(d,l+j*i)
B.a.j(d,k+h*m.a)}i=c.a
B.a.j(i,l+j*m.b)
B.a.j(i,k+h*m.b)
if(m.b<1)s.$0()}s.$0()
return o},
fg(a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a
for(s=this.y,r=4096+s,s=-s,q=t.n,p=a0,o=0;o<4;++o){n=A.b([],q)
m=new A.jz(this,o)
l=p.length
if(l<6)return new Float64Array(0)
k=p[l-2]
j=p[l-1]
i=m.$2(k,j)
for(h=2===o,g=1===o,f=0===o,e=0;e<l;e+=2,i=a,j=b,k=d){d=p[e]
c=e+1
if(!(c<l))return A.a(p,c)
b=p[c]
a=m.$2(d,b)
if(a!==i){A:{if(f){c=(s-k)/(d-k)
break A}if(g){c=(r-k)/(d-k)
break A}if(h){c=(s-j)/(b-j)
break A}c=(r-j)/(b-j)
break A}B.a.j(n,k+(d-k)*c)
B.a.j(n,j+(b-j)*c)}if(a){B.a.j(n,d)
B.a.j(n,b)}}p=new Float64Array(A.R(n))}return p}}
A.jy.prototype={
$0(){var s=this.a,r=s.a
if(r.length>=4){B.a.j(this.b,new Float64Array(A.R(r)))
B.a.j(this.c,s.b)}s.a=A.b([],t.n)},
$S:0}
A.jx.prototype={
$2(a,b){var s,r=this.a
if(!r.c)return
if(a===0){if(b<0)r.c=!1
return}s=b/a
if(a<0){if(s>r.b)r.c=!1
else if(s>r.a)r.a=s}else if(s<r.a)r.c=!1
else if(s<r.b)r.b=s},
$S:32}
A.jz.prototype={
$2(a,b){var s,r=this,q=r.b
A:{if(0===q){s=a>=-r.a.y
break A}if(1===q){s=a<=4096+r.a.y
break A}if(2===q){s=b>=-r.a.y
break A}s=b<=4096+r.a.y
break A}return s},
$S:14}
A.ib.prototype={}
A.ip.prototype={
gal(){return""},
gaV(){return 4096},
$ibr:1,
gaL(){return this.a}}
A.dS.prototype={
aK(a){return this.c},
aZ(a){var s,r,q,p,o,n,m,l,k
for(s=this.d,r=s.length,q=a.c,p=0;p<s.length;s.length===r||(0,A.h)(s),++p){o=s[p]
B.a.j(q,a.b>>>1)
for(n=o.length,m=0;m<n;m+=2){l=o[m]
k=m+1
if(!(k<n))return A.a(o,k)
a.bd(l,o[k])}}B.a.j(q,a.b>>>1)},
$ibN:1,
gL(){return this.b}}
A.oN.prototype={
$1(a){var s,r,q
for(s=a+1,r=this.a;s<r.length;++s){q=B.T.h(0,r[s])
if((q==null?0:q)!==1)return s}return null},
$S:75}
A.jC.prototype={
iy(a){var s,r,q
t.bF.a(a)
s=B.a.ac(a,"\x01")
r=this.e
q=r.h(0,s)
if(q==null){q=new A.jE(this,a).$0()
r.m(0,s,q)
r=q}else r=q
return r},
gk(a){return this.c.length},
i6(a,b){var s=A.v1(b),r=this.f,q=a*1000+s,p=r.h(0,q)
if(p==null){p=new A.jD(this,a,s).$0()
r.m(0,q,p)
r=p}else r=p
return r}}
A.jE.prototype={
$0(){var s,r,q,p,o,n,m,l=A.b([],t.t)
for(s=this.b,r=s.length,q=this.a,p=q.c,q=q.d,o=0;o<s.length;s.length===r||(0,A.h)(s),++o){n=A.qP(s[o])
for(m=0;m<p.length;++m){if(!(m<q.length))return A.a(q,m)
if(q[m]===n&&!B.a.v(l,m))B.a.j(l,m)}}for(m=0;m<p.length;++m)if(!B.a.v(l,m))B.a.j(l,m)
return l},
$S:76}
A.jD.prototype={
$0(){var s,r=this.a.c,q=this.b
if(!(q>=0&&q<r.length))return A.a(r,q)
s=r[q]
r=s.a
if(!r.c.M(1719034226))return s
q=t.i
return new A.ch(r,A.pw(t.H.a(s.ix(A.eB(["wght",this.c],t.N,q))),q))},
$S:77}
A.ky.prototype={}
A.mo.prototype={
$2(a,b){return A.db(a)+A.db(b)},
$S:78}
A.oP.prototype={
$0(){var s,r,q,p,o=this
if(!o.b){s=o.c
s=s==1/0||s==-1/0}else s=!0
r=o.d
q=o.a
p=q.a
if(s)B.a.j(r,p)
else B.a.A(r,A.xb(o.e,p,o.f,o.r,o.c,o.w))
q.a=A.b([],t.t)},
$S:0}
A.mN.prototype={
$2(a,b){return Math.max(A.db(a),t.hT.a(b).b)},
$S:79}
A.bH.prototype={}
A.fh.prototype={
B(){var s,r,q,p,o,n
for(s=this.a,r=s.length,q=0,p=0;p<70;p+=7){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
q=(q|B.b.a4(n&127,p))>>>0
if(n<128)return q}throw A.e(B.C)},
ag(a){var s=this.B(),r=this.b
if(s>this.c-r)throw A.e(B.a5)
return s},
ek(){var s=this,r=s.ag(0),q=s.b,p=q+r
s.b=p
return new A.fh(s.a,q,p)},
U(a,b){var s,r=this
switch(b){case 0:r.B()
break
case 1:r.b+=8
break
case 2:s=r.ag(0)
r.b+=s
break
case 5:r.b+=4
break
default:throw A.e(A.es("glyph pbf: wire type "+b,null,null))}}}
A.jF.prototype={
ee(a){var s=J.uf(t.bF.a(a),",")
return this.f.bj(s,new A.jG(this,s))},
eq(a,b){var s,r,q,p,o,n,m
for(s=new A.cW(b),r=this.w,q=this.x,p=a<<16,o=!0;s.n();){n=B.b.K(s.d,8)
m=(p|n)>>>0
if(q.v(0,m))continue
if(r.j(0,m))this.by(a,n,m)
o=!1}return o},
by(a,b,a0){var s=0,r=A.aC(t.o),q,p=2,o=[],n=this,m,l,k,j,i,h,g,f,e,d,c
var $async$by=A.aD(function(a1,a2){if(a1===1){o.push(a2)
s=p}for(;;)switch(s){case 0:e=n.e
d=a-512
if(!(d>=0&&d<e.length)){q=A.a(e,d)
s=1
break}e=A.wY(2,e[d],B.u,!1)
e=A.qe(n.a,"{fontstack}",e)
j=b*256
m=A.qe(e,"{range}",""+j+"-"+(j+255))
l=B.cP
p=4
e=n.y
if(e==null)e=n.y=new A.eL()
s=7
return A.a0(e.bp(m,n.c),$async$by)
case 7:k=a2
if(k.a===200)l=A.v3(k.b)
p=2
s=6
break
case 4:p=3
c=o.pop()
s=6
break
case 3:s=2
break
case 6:e=n.r
if(!(d<e.length)){q=A.a(e,d)
s=1
break}h=e[d]
for(e=l,d=e.length,g=0;g<e.length;e.length===d||(0,A.h)(e),++g){f=e[g]
h.m(0,f.a,f)}n.x.j(0,a0)
n.d.$2(a,l)
case 1:return A.aA(q,r)
case 2:return A.az(o.at(-1),r)}})
return A.aB($async$by,r)}}
A.jG.prototype={
$0(){var s=this.a,r=s.e
B.a.j(r,this.b)
B.a.j(s.r,A.C(t.S,t.jv))
return 512+r.length-1},
$S:7}
A.jI.prototype={
cM(){var s,r,q,p,o,n=this,m=n.d
m=J.pi(B.i.gam(m),m.byteOffset,m.length)
s=A.b([],t.D)
for(r=n.e,q=r.length,p=0;p<r.length;r.length===q||(0,A.h)(r),++p){o=r[p]
s.push([o.a,o.b])}return[n.c,m,s,n.f,n.b,n.a]}}
A.jJ.prototype={
$1(a){return B.b.E(B.c.Y(a*128),-2048,2047)+2048},
$S:25}
A.i5.prototype={}
A.m2.prototype={}
A.mv.prototype={
$2(a,b){return A.D(a)+A.D(b)},
$S:35}
A.iu.prototype={
bs(a){var s,r=a-4
if(r<0||r>=this.b.length)throw A.e(B.b_)
s=this.b
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
ed(a,b){var s,r,q,p,o,n=A.C(t.N,t.O)
for(s=this.a,r=a;r<b;r=o){if(!(r>=0&&r<s.length))return A.a(s,r)
q=this.bs(s[r])
if(typeof q!="string")throw A.e(B.aZ)
p=this.cO(r+1,b)
o=p.b
n.m(0,q,p.a)}return n},
cO(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
if(a>=b)throw A.e(B.b1)
s=i.a
r=s.length
if(!(a>=0&&a<r))return A.a(s,a)
q=s[a]
if(0===q)return new A.f(!1,a+1)
if(1===q)return new A.f(!0,a+1)
if(2===q||3===q){p=a+1
if(p<b){if(!(p<r))return A.a(s,p)
o=s[p]
o=o<2||a+o>b}else o=!0
if(o)throw A.e(B.aS)
if(!(p<r))return A.a(s,p)
n=a+s[p]
if(q===2)return new A.f(i.ed(a+2,n),n)
m=[]
l=a+2
for(;l<n;l=j){k=i.cO(l,n)
j=k.b
m.push(k.a)}return new A.f(m,n)}return new A.f(i.bs(q),a+1)}}
A.lU.prototype={}
A.lB.prototype={
b8(a){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=h.x
B.a.j(h.y,g.length>>>1)
for(s=h.f,r=s.length,q=h.e,p=h.r,o=p!=null,n=q==null,m=0;m<a;++m){l=h.z++
if(n){l*=2
if(!(l<r))return A.a(s,l)
B.a.j(g,s[l]);++l
if(!(l<r))return A.a(s,l)
B.a.j(g,s[l])}else{k=q.length
if(o){if(!(l<k))return A.a(q,l)
l=q[l]
if(!(l>=0&&l<r))return A.a(s,l)
j=s[l]
B.a.j(g,A.tm(j,p.y)-p.z)
B.a.j(g,A.tm(B.b.K(j,1),p.y)-p.z)}else{if(!(l<k))return A.a(q,l)
i=q[l]*2
if(!(i>=0&&i<r))return A.a(s,i)
B.a.j(g,s[i])
l=i+1
if(!(l<r))return A.a(s,l)
B.a.j(g,s[l])}}}},
cf(a,b){var s,r,q
t.T.a(a)
if(a==null||b>=a.length)s=0
else{s=a.length
if(!(b>=0&&b<s))return A.a(a,b)
r=a[b]
q=b-1
if(!(q>=0&&q<s))return A.a(a,q)
q=r-a[q]
s=q}return s},
ds(){var s=this
if(s.w)return s.cf(s.d,s.at++)
return s.cf(s.c,s.as)},
hO(){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.a,e=f.length,d=e+1,c=new Int32Array(d)
for(s=g.y,r=g.b,q=t.T,p=r!=null,o=g.d!=null,n=g.c!=null,m=0;m<e;++m){l=s.length
if(!(m<d))return A.a(c,m)
c[m]=l
switch(f[m]){case 0:g.b8(1)
if(p)++g.Q
if(n)++g.as
if(o)++g.at
break
case 3:l=g.Q++
q.a(r)
if(!p||l>=r.length)k=0
else{j=r.length
if(!(l<j))return A.a(r,l)
i=r[l];--l
if(!(l>=0&&l<j))return A.a(r,l)
k=i-r[l]}g.b8(k)
g.as+=k
g.at+=k
break
case 1:k=g.ds();++g.as
g.b8(k)
if(p)++g.Q
break
case 2:g.dF()
if(p)++g.Q
break
case 4:l=g.Q++
q.a(r)
if(!p||l>=r.length)k=0
else{j=r.length
if(!(l<j))return A.a(r,l)
i=r[l];--l
if(!(l>=0&&l<j))return A.a(r,l)
k=i-r[l]}for(;k>0;--k){h=g.ds();++g.as
g.b8(h)}break
case 5:l=g.Q++
q.a(r)
if(!p||l>=r.length)k=0
else{j=r.length
if(!(l<j))return A.a(r,l)
i=r[l];--l
if(!(l>=0&&l<j))return A.a(r,l)
k=i-r[l]}for(;k>0;--k)g.dF()
break}}r=s.length
if(!(e<d))return A.a(c,e)
c[e]=r
r=g.x
B.a.j(s,r.length>>>1)
return new A.lU(f,new Int32Array(A.R(r)),new Int32Array(A.R(s)),c)},
dF(){var s,r,q,p,o,n,m=this
for(s=m.cf(m.c,m.as++),r=m.d,q=t.T;s>0;--s){p=m.at++
q.a(r)
if(r==null||p>=r.length)p=0
else{o=r.length
if(!(p>=0&&p<o))return A.a(r,p)
n=r[p];--p
if(!(p>=0&&p<o))return A.a(r,p)
p=n-r[p]}m.b8(p)}}}
A.lC.prototype={
$1(a){A.D(a)
return a===2||a===5},
$S:82}
A.it.prototype={
eK(a,b,c,d,e,f){var s,r,q=this,p=A.b([],t.d)
for(s=q.f.a.length,r=0;r<s;++r)p.push(new A.is(q,r))
t.dg.a(p)
q.r!==$&&A.p4()
q.r=p},
gaL(){var s=this.r
s===$&&A.j()
return s},
$ibr:1,
gal(){return this.a},
gaV(){return this.b}}
A.is.prototype={
gL(){var s,r=this.a.f.a,q=this.b
if(!(q<r.length))return A.a(r,q)
s=r[q]
A:{if(0===s||3===s){r=1
break A}if(1===s||4===s){r=2
break A}r=3
break A}return r},
aK(a){var s,r,q,p,o,n,m=this,l=m.a,k=l.c,j=k!=null&&m.b<J.V(k.a)?k.$ti.y[1].a(J.al(k.a,m.b)):null,i=A.C(t.N,t.O)
if(j!=null)i.m(0,"$id",j)
for(s=l.d,r=m.b,l=l.e,q=0;q<s.length;++q){if(!(q<l.length))return A.a(l,q)
p=l[q]
o=J.o(p)
n=r<o.gk(p)?o.h(p,r):null
if(n!=null){if(!(q<s.length))return A.a(s,q)
i.m(0,s[q],n)}}return i},
aZ(a){var s,r,q,p,o,n,m,l=this.a.f,k=l.b,j=l.d,i=this.b,h=j.length
if(!(i<h))return A.a(j,i)
s=j[i];++i
if(!(i<h))return A.a(j,i)
h=l.c
r=h.length
q=k.length
p=a.c
while(s<j[i]){B.a.j(p,a.b>>>1)
if(!(s>=0&&s<r))return A.a(h,s)
o=h[s];++s
if(!(s<r))return A.a(h,s)
for(;o<h[s];++o){n=o*2
if(!(n>=0&&n<q))return A.a(k,n)
m=k[n];++n
if(!(n<q))return A.a(k,n)
a.bd(m,k[n])}}B.a.j(p,a.b>>>1)},
$ibN:1}
A.lD.prototype={
B(){var s,r,q,p,o,n,m,l
for(s=this.a,r=s.length,q=0,p=0;p<28;p+=7){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
q=(q|B.b.a4(n&127,p))>>>0
if(n<128)return q}for(m=268435456,l=4;l<10;++l){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
q+=(n&127)*m
if(n<128)return q
m*=128}throw A.e(B.C)},
aR(){var s,r=this,q=r.B(),p=r.a,o=r.b
if(q>p.length-o)throw A.e(B.aT)
s=B.u.ea(A.bQ(p,o,o+q),!0)
r.b+=q
return s},
siC(a){this.b=A.D(a)}}
A.k1.prototype={}
A.eG.prototype={$ibr:1,
gal(){return this.a},
gaV(){return this.b},
gaL(){return this.e}}
A.eF.prototype={
aK(a){var s,r,q,p,o,n,m,l,k=this
t.dl.a(a)
s=A.C(t.N,t.O)
r=k.c
if(r!=null)s.m(0,"$id",r)
r=k.e
q=new A.bZ(k.a,k.d,r)
for(p=a.c,o=a.d;q.b<r;){n=q.B()
m=q.B()
if(!(n<p.length))return A.a(p,n)
l=p[n]
if(!(m<o.length))return A.a(o,m)
s.m(0,l,o[m])}return s},
aZ(a){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=h.r,f=new A.bZ(h.a,h.f,g),e=h.b===1
if(e)B.a.j(a.c,a.b>>>1)
for(s=!e,r=a.c,q=0,p=0;f.b<g;){o=f.B()
n=o&7
m=o>>>3
if(n===1)for(l=0;l<m;++l){k=f.B()
j=f.B()
i=k>>>1
q+=(k&1)===0?i:-i-1
i=j>>>1
p+=(j&1)===0?i:-i-1
if(s)B.a.j(r,a.b>>>1)
a.bd(q,p)}else if(n===2)for(l=0;l<m;++l){k=f.B()
j=f.B()
i=k>>>1
q+=(k&1)===0?i:-i-1
i=j>>>1
p+=(j&1)===0?i:-i-1
a.bd(q,p)}}B.a.j(r,a.b>>>1)},
$ibN:1,
gL(){return this.b}}
A.et.prototype={
bd(a,b){var s,r,q=this,p=q.b,o=q.a,n=o.length
if(p+2>n){s=new Float64Array(n*2)
B.q.Z(s,0,p,o)
q.a=s
p=s}else p=o
o=q.b
n=q.b=o+1
p.$flags&2&&A.x(p)
r=p.length
if(!(o<r))return A.a(p,o)
p[o]=a
q.b=n+1
if(!(n<r))return A.a(p,n)
p[n]=b}}
A.bZ.prototype={
B(){var s,r,q,p,o,n,m,l
for(s=this.a,r=s.length,q=0,p=0;p<28;p+=7){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
q=(q|B.b.a4(n&127,p))>>>0
if(n<128)return q}for(m=268435456,l=4;l<10;++l){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
q+=(n&127)*m
if(n<128)return q
m*=128}throw A.e(B.C)},
ag(a){var s=this.B(),r=this.b
if(s>this.c-r)throw A.e(B.a5)
return s},
aR(){var s=this,r=s.ag(0),q=s.b,p=B.u.e9(A.bQ(s.a,q,q+r))
s.b+=r
return p},
U(a,b){var s,r=this
switch(b){case 0:r.B()
break
case 1:r.b+=8
break
case 2:s=r.ag(0)
r.b+=s
break
case 5:r.b+=4
break}}}
A.hs.prototype={
cc(a){var s,r,q,p,o,n,m,l,k,j=this
if(!t.f.b(a))return
s=a.h(0,"coordinates")
switch(a.h(0,"type")){case"FeatureCollection":r=a.h(0,"features")
if(t.j.b(r))J.pj(r,j.gdD())
break
case"Feature":j.cc(a.h(0,"geometry"))
break
case"GeometryCollection":q=a.h(0,"geometries")
if(t.j.b(q))J.pj(q,j.gdD())
break
case"Point":B.a.A(j.a,A.k9([s]))
break
case"MultiPoint":B.a.A(j.a,A.k9(s))
break
case"LineString":B.a.j(j.b,A.k9(s))
break
case"MultiLineString":if(t.j.b(s))B.a.A(j.b,J.iP(s,A.qc(),t.H))
break
case"Polygon":if(t.j.b(s)){p=J.iP(s,A.qc(),t.H)
p=A.X(p,p.$ti.i("a1.E"))
B.a.j(j.c,p)}break
case"MultiPolygon":p=t.j
if(p.b(s))for(o=J.F(s),n=j.c,m=t.H;o.n();){l=o.gp()
if(p.b(l)){k=J.iP(l,A.qc(),m)
k=A.X(k,k.$ti.i("a1.E"))
B.a.j(n,k)}}break}},
ia(a,b){var s,r,q,p,o,n,m,l=this
t.y.a(a)
s=J.Y(a)
if(s.ad(a,new A.kc())||l.c.length===0)return!1
for(r=s.gt(a);r.n();){q=r.gp()
for(p=J.o(q),o=0;o<p.gk(q);o+=2){n=p.h(q,o)
m=p.h(q,o+1)
if(!(l.cg(n,m)||l.cg(n+360,m)||l.cg(n-360,m)))return!1}}if(!b)return!0
for(s=s.gt(a);s.n();)if(!l.fd(s.gp()))return!1
return!0},
fd(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
t.H.a(a)
for(s=J.o(a),r=this.c,q=0;p=q+3,p<s.gk(a);q=m)for(o=r.length,n=q+1,m=q+2,l=0;l<r.length;r.length===o||(0,A.h)(r),++l)for(k=B.a.gt(r[l]);k.n();){j=k.gp()
for(i=J.o(j),h=0;g=h+3,g<i.gk(j);h=f){f=h+2
if(A.vI(s.h(a,q),s.h(a,n),s.h(a,m),s.h(a,p),i.h(j,h),i.h(j,h+1),i.h(j,f),i.h(j,g)))return!1}}return!0},
cg(a,b){var s,r,q,p,o,n,m,l,k
for(s=this.c,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q)for(p=B.a.gt(s[q]);p.n();){o=p.gp()
for(n=J.o(o),m=0;l=m+3,l<n.gk(o);m=k){k=m+2
if(A.ht(a,b,n.h(o,m),n.h(o,m+1),n.h(o,k),n.h(o,l))===0)return!1}}return this.dm(a,b)},
dm(a,b){var s,r,q,p,o
for(s=this.c,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){for(p=B.a.gt(s[q]),o=!1;p.n();)if(A.rb(a,b,p.gp()))o=!o
if(o)return!0}return!1},
hX(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=this
t.y.a(a1)
s=t.n
r=A.b([],s)
for(q=J.Y(a1),p=q.gt(a1);p.n();)B.a.A(r,p.gp())
p=r.length
if(p===0)return 1/0
if(1>=p)return A.a(r,1)
o=Math.cos(r[1]*3.141592653589793/180)
n=1/(1-0.0066943799901413165*(1-o*o))
p=Math.sqrt(n)
m=111319.49079327358*Math.sqrt(n)*n*0.9933056200098587
l=111319.49079327358*p*o/m
if(a2==="Point"){p=A.b([],t.b)
for(k=0;j=r.length,k<j;k+=2){i=r[k]
h=k+1
if(!(h<j))return A.a(r,h)
p.push(A.b([i,r[h]],s))}g=p}else g=a1
p=A.b([],t.b)
for(j=a0.a,f=0;i=j.length,f<i;f+=2){h=j[f]
e=f+1
if(!(e<i))return A.a(j,e)
p.push(A.b([h,j[e]],s))}B.a.A(p,a0.b)
for(s=a0.c,j=s.length,d=0;d<s.length;s.length===j||(0,A.h)(s),++d)B.a.A(p,s[d])
for(k=0;s=r.length,k<s;k+=2){j=r[k]
i=k+1
if(!(i<s))return A.a(r,i)
if(a0.dm(j,r[i]))return 0}if(a2==="Polygon")for(s=p.length,d=0;d<p.length;p.length===s||(0,A.h)(p),++d){c=p[d]
for(r=J.o(c),k=0;k+1<r.gk(c);k+=2)if((q.cP(a1,new A.kb(c,k)).gk(0)&1)===1)return 0}for(s=J.F(g),b=1/0;s.n();){r=s.gp()
for(q=p.length,d=0;d<p.length;p.length===q||(0,A.h)(p),++d){a=A.vH(r,p[d],l)
if(a<b)b=a}}return b*m}}
A.kc.prototype={
$1(a){return J.de(t.H.a(a))},
$S:23}
A.k8.prototype={
$6(a,b,c,d,e,f){return(c-a)*(f-b)-(d-b)*(e-a)},
$S:20}
A.kb.prototype={
$1(a){var s,r,q
t.H.a(a)
s=this.a
r=this.b
q=J.o(s)
return A.rb(q.h(s,r),q.h(s,r+1),a)},
$S:23}
A.ka.prototype={
$6(a,b,c,d,e,f){return(c-a)*(f-b)-(d-b)*(e-a)},
$S:20}
A.cV.prototype={}
A.jN.prototype={
q(a){return"HTTP "+this.a+" for "+this.b}}
A.eL.prototype={
cS(a,b,c){return new A.k3(t.pp.a(b),a).$0().iM(c)},
bp(a,b){return this.cS(a,b,B.aD)}}
A.k3.prototype={
$0(){var s=0,r=A.aC(t.mk),q,p=this,o,n,m,l
var $async$$0=A.aD(function(a,b){if(a===1)return A.az(b,r)
for(;;)switch(s){case 0:m=v.G
l=A.b0(new m.Headers())
p.a.a3(0,new A.k2(l))
s=3
return A.a0(A.qd(A.b0(m.fetch(p.b,{headers:l})),t.m),$async$$0)
case 3:o=b
s=4
return A.a0(A.qd(A.b0(o.arrayBuffer()),t.eb),$async$$0)
case 4:n=b
q=new A.cV(A.D(o.status),A.pz(n,0,null))
s=1
break
case 1:return A.aA(q,r)}})
return A.aB($async$$0,r)},
$S:128}
A.k2.prototype={
$2(a,b){A.W(a)
A.W(b)
if(!B.f_.v(0,a.toLowerCase()))this.a.append(a,b)},
$S:86}
A.jp.prototype={
iD(a,b){return A.t(A.ax("A browser cannot read the file "+this.a))}}
A.n0.prototype={
$1(a){return A.b0(a)===this.a},
$S:87}
A.kd.prototype={
gdI(){var s=this.a
return B.d.ap(s,"http://")||B.d.ap(s,"https://")},
aB(a,b,a0){var s=0,r=A.aC(t.p),q,p=this,o,n,m,l,k,j,i,h,g,f,e,d,c
var $async$aB=A.aD(function(a1,a2){if(a1===1)return A.az(a2,r)
for(;;)switch(s){case 0:f=p.r
s=3
return A.a0(f==null?p.r=p.aT():f,$async$aB)
case 3:e=a2
if(a<e.f||a>e.r){q=new Uint8Array(0)
s=1
break}o=A.vL(a,b,a0)
n=e.a
f=p.w,m=e.b,l=e.d,k=A.u(f).i("aq<1>"),j=0
case 4:if(!(j<4)){s=6
break}i=A.vK(n,o)
if(i==null){q=new Uint8Array(0)
s=1
break}h=i.b
s=h>0?7:8
break
case 7:if(o>=i.a+h){q=new Uint8Array(0)
s=1
break}d=A
s=9
return A.a0(p.aI(e.c+i.c,i.d),$async$aB)
case 9:q=d.eO(a2,e.e)
s=1
break
case 8:h=i.c
n=f.h(0,h)
s=n==null?10:11
break
case 10:d=A
c=A
s=13
return A.a0(p.aI(m+h,i.d),$async$aB)
case 13:s=12
return A.a0(c.eO(a2,l),$async$aB)
case 12:n=d.rd(a2)
f.m(0,h,n)
case 11:if(f.a>48){g=new A.aq(f,k).gt(0)
if(!g.n())A.t(A.aI())
f.aA(0,g.gp())}case 5:++j
s=4
break
case 6:q=new Uint8Array(0)
s=1
break
case 1:return A.aA(q,r)}})
return A.aB($async$aB,r)},
aT(){var s=0,r=A.aC(t.iM),q,p=this,o,n,m,l,k,j,i,h,g,f,e,d
var $async$aT=A.aD(function(a,b){if(a===1)return A.az(b,r)
for(;;)switch(s){case 0:s=3
return A.a0(p.aI(0,16384),$async$aT)
case 3:h=b
g=h.length
f=!0
if(g>=127)if(A.dL(B.j.I(h,0,7),0,null)==="PMTiles"){if(7>=g){q=A.a(h,7)
s=1
break}f=h[7]!==3}if(f)throw A.e(B.aR)
f=new A.kf(A.cy(h,0,null))
o=f.$1(8)
n=f.$1(16)
if(97>=g){q=A.a(h,97)
s=1
break}m=h[97]
l=o+n
e=A
d=A
s=l<=g?5:7
break
case 5:b=A.bQ(h,o,l)
s=6
break
case 7:s=8
return A.a0(p.aI(o,n),$async$aT)
case 8:case 6:s=4
return A.a0(d.eO(b,m),$async$aT)
case 4:l=e.rd(b)
k=f.$1(40)
f=f.$1(56)
if(98>=g){q=A.a(h,98)
s=1
break}j=h[98]
if(100>=g){q=A.a(h,100)
s=1
break}i=h[100]
if(101>=g){q=A.a(h,101)
s=1
break}q=new A.ij(l,k,f,m,j,i,h[101])
s=1
break
case 1:return A.aA(q,r)}})
return A.aB($async$aT,r)},
aI(a,b){var s=0,r=A.aC(t.p),q,p=this,o,n,m,l,k,j
var $async$aI=A.aD(function(c,d){if(c===1)return A.az(d,r)
for(;;)switch(s){case 0:if(!p.gdI()){o=p.f
q=(o==null?p.f=new A.jp(p.a):o).iD(a,b)
s=1
break}o=p.d
n=p.a
m=t.N
m=A.vp(p.c,m,m)
l=a+b
m.m(0,"range","bytes="+a+"-"+(l-1))
m.m(0,"accept-encoding","identity")
s=3
return A.a0(o.cS(n,m,B.aE),$async$aI)
case 3:k=d
o=k.a
if(o!==206&&o!==200)throw A.e(A.qU(o,n))
j=k.b
q=o===200&&j.length>b?A.bQ(j,a,B.b.E(l,0,j.length)):j
s=1
break
case 1:return A.aA(q,r)}})
return A.aB($async$aI,r)}}
A.kf.prototype={
$1(a){var s=this.a
return s.getUint32(a,!0)+s.getUint32(a+4,!0)*4294967296},
$S:13}
A.ke.prototype={
$0(){var s,r,q,p,o,n,m,l
for(s=this.b,r=this.a,q=s.length,p=0,o=1,n=0;n<10;++n){m=r.a++
if(!(m<q))return A.a(s,m)
l=s[m]
p+=(l&127)*o
if(l<128)return p
o*=128}throw A.e(B.C)},
$S:7}
A.ij.prototype={}
A.f9.prototype={
gk(a){return this.d}}
A.bU.prototype={}
A.lV.prototype={
bi(a){var s,r,q,p,o,n=this.a
B.a.j(n,a)
s=n.length-1
for(;s>0;s=r){r=B.b.K(s-1,1)
if(!(r<n.length))return A.a(n,r)
q=n[r]
p=q.e
p===$&&A.j()
o=a.e
o===$&&A.j()
if(p>=o)break
if(!(s>=0&&s<n.length))return A.a(n,s)
n[s]=q}B.a.m(n,s,a)},
iB(){var s,r,q,p,o,n,m,l,k,j=this.a,i=B.a.gu(j)
if(0>=j.length)return A.a(j,-1)
s=j.pop()
r=j.length
if(r!==0){for(q=0;;q=k){p=q*2+1
o=p+1
n=s.e
n===$&&A.j()
if(p<r){if(!(p<j.length))return A.a(j,p)
m=j[p].e
m===$&&A.j()
m=m>n}else m=!1
if(m){if(!(p<j.length))return A.a(j,p)
n=j[p].e
n===$&&A.j()
l=n
k=p}else{l=n
k=q}if(o<r){if(!(o<j.length))return A.a(j,o)
n=j[o].e
n===$&&A.j()
n=n>l}else n=!1
if(n)k=o
if(k===q)break
if(!(k>=0&&k<j.length))return A.a(j,k)
n=j[k]
if(!(q>=0&&q<j.length))return A.a(j,q)
j[q]=n}B.a.m(j,q,s)}return i}}
A.lv.prototype={}
A.bT.prototype={}
A.lu.prototype={
$0(){var s,r=this.a,q=J.o(r),p=q.h(r,2)
p.toString
A.D(p)
s=q.h(r,3)
s.toString
A.D(s)
r=q.h(r,4)
r.toString
return new A.aY(p,s,A.D(r),0)},
$S:88}
A.lt.prototype={
$1(a){var s=J.al(this.a,a)
s.toString
return A.ai(s)},
$S:17}
A.ee.prototype={}
A.f1.prototype={}
A.er.prototype={}
A.c6.prototype={
ar(){return"ClusterQuestion."+this.b}}
A.eb.prototype={}
A.ay.prototype={}
A.hT.prototype={}
A.hQ.prototype={
bn(){return[this.a,"built",this.c.cM()]}}
A.hS.prototype={
bn(){return[this.a,"failed",this.c]}}
A.eq.prototype={
bn(){var s,r,q,p,o=A.b([],t.D)
for(s=this.b,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q]
o.push([p.a,p.b,p.c,p.d,p.e])}return[this.a,"found",o]}}
A.eh.prototype={
bn(){return[this.a,"zoom",this.b]}}
A.dp.prototype={
bn(){var s,r,q,p,o,n=A.b([],t.bo)
for(s=this.b,r=s.length,q=t.I,p=0;p<s.length;s.length===r||(0,A.h)(s),++p){o=s[p]
n.push(A.b([o.a,o.b,o.c],q))}return[this.a,"members",n]}}
A.fN.prototype={}
A.hR.prototype={}
A.oY.prototype={
$2(a,b){var s=this.a
return s>=a&&s<b},
$S:14}
A.ol.prototype={
$2(a,b){var s=this
return a>=s.a&&a<=s.b&&b>=s.c&&b<=s.d},
$S:14}
A.oj.prototype={
$8(a,b,c,d,e,f,g,h){var s=new A.ok(),r=s.$6(e,f,g,h,a,b),q=s.$6(e,f,g,h,c,d),p=s.$6(a,b,c,d,e,f),o=s.$6(a,b,c,d,g,h)
return r>0!==q>0&&p>0!==o>0},
$S:90}
A.ok.prototype={
$6(a,b,c,d,e,f){return(c-a)*(f-b)-(d-b)*(e-a)},
$S:20}
A.bp.prototype={}
A.h7.prototype={}
A.hU.prototype={}
A.hr.prototype={}
A.h6.prototype={}
A.ej.prototype={
q(a){var s=this
return A.v(s.a)+","+A.v(s.b)+","+A.v(s.c)+","+A.v(s.d)}}
A.fO.prototype={}
A.hP.prototype={}
A.oZ.prototype={
$3(a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5=a4.a,a6=a9*2,a7=a5.length
if(!(a6<a7))return A.a(a5,a6)
s=a5[a6];++a6
if(!(a6<a7))return A.a(a5,a6)
r=a5[a6]
a6=a8*2
if(!(a6>=0&&a6<a7))return A.a(a5,a6)
q=a5[a6]-s;++a6
if(!(a6<a7))return A.a(a5,a6)
p=a5[a6]-r
a6=b0*2
if(!(a6<a7))return A.a(a5,a6)
o=a5[a6]-s;++a6
if(!(a6<a7))return A.a(a5,a6)
n=a5[a6]-r
m=Math.sqrt(q*q+p*p)
l=Math.sqrt(o*o+n*n)
if(m<0.000001||l<0.000001){a5=a4.b
B.a.j(a5,s)
B.a.j(a5,r)
return}q/=m
p/=m
o/=l
n/=l
k=q*o+p*n
if(Math.abs(k)>Math.cos(0.08726646259971647)){a5=a4.b
B.a.j(a5,s)
B.a.j(a5,r)
return}j=Math.min(a4.c,Math.min(m*0.2,l*0.2))
i=q+o
h=p+n
g=Math.sqrt(i*i+h*h)
f=j/Math.sqrt((1+k)/2)/g
i=s+i*f
h=r+h*f
e=s+q*j-i
d=r+p*j-h
c=s+o*j-i
b=r+n*j-h
a=Math.atan2(e*b-d*c,e*c+d*b)
a0=Math.max(2,B.c.bL(Math.abs(a)/0.5235987755982988-0.000001))
for(a5=a4.b,a1=0;a1<=a0;++a1){a2=a*a1/a0
a9=Math.cos(a2)
a3=Math.sin(a2)
B.a.j(a5,i+e*a9-d*a3)
B.a.j(a5,h+e*a3+d*a9)}},
$S:40}
A.p1.prototype={
$3(a,b,c){var s,r,q,p,o,n,m,l,k,j,i=this.a,h=a*2,g=i.length
if(!(h<g))return A.a(i,h)
s=i[h];++h
if(!(h<g))return A.a(i,h)
r=i[h]
h=b*2
if(!(h>=0&&h<g))return A.a(i,h)
q=i[h];++h
if(!(h<g))return A.a(i,h)
p=i[h]
o=Math.sqrt(s*s+r*r)
n=Math.sqrt(q*q+p*p)
h=Math.cos(0.6108652381980153)
if(n>0&&!(s*q+r*p<h*o*n)&&o<2*n)if(n>=2*o){m=p
l=q}else{l=s+q
m=r+p}else{m=r
l=s}k=Math.sqrt(l*l+m*m)
i=this.b
h=k===0
g=h?0:l/k
i.$flags&2&&A.x(i)
j=i.length
if(!(c<j))return A.a(i,c)
i[c]=g
g=c+1
h=h?0:m/k
if(!(g<j))return A.a(i,g)
i[g]=h},
$S:40}
A.lj.prototype={}
A.m1.prototype={
gb0(){var s,r=this.d.h(0,A.v(this.b)+"-translate")
A:{if(r==null){s=null
break A}s=A.w(r)
break A}return s}}
A.ft.prototype={}
A.hI.prototype={
fD(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=A.C(t.S,t.nY)
for(s=A.qV(this.x,0,t.kY),r=J.F(s.a),q=s.b,s=new A.bE(r,q,A.u(s).i("bE<1>")),p=this.Q,o=this.r;s.n();){n=s.c
n=n>=0?new A.f(q+n,r.gp()):A.t(A.aI())
m=n.b
if(!(m instanceof A.bm)||m.dx)continue
l=m.b
k=o.length
if(!(l>=0&&l<k))return A.a(o,l)
j=o[l]
for(l=p.length,i=m.d,h=j.c,g=j.d,f=0;f<l;++f){e=p[f]
d=e.b
if(!(d>=0&&d<k))return A.a(o,d)
c=o[d]
if(i!==e.d||h!==c.c||g!==c.d)continue
b.m(0,n.a,e)
j.cy=Math.max(j.cy,i+1)
break}}return b},
hS(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8=this,b9=null,c0="url",c1="attribution",c2=b8.a,c3=c2.a
c2=c2.$ti.i("4?")
s=c2.a(c3.h(0,"layers"))
r=t.j
s=J.F(r.b(s)?s:B.D)
q=t.f
p=b8.geR()
o=b8.geV()
n=b8.geP()
m=b8.geT()
l=b8.gf_()
k=b8.at
j=b8.x
i=b8.as
h=b8.z
g=b8.ay
while(s.n()){f=s.gp()
if(!q.b(f))continue
e=A.wE(f)
if(J.m(e.e.h(0,"visibility"),"none"))continue
d=e.b
A:{if("symbol"===d){c=l
break A}if("heatmap"===d){c=m
break A}if("circle"===d){c=n
break A}if("line"===d){c=o
break A}if("fill"===d||"fill-extrusion"===d){c=p
break A}c=b9
break A}if(c!=null){b=j.length
a=b8.hy(e)
if(a!=null)c.$1(a)
if(J.m(d,"symbol")){b8.ch=j.length
b8.CW=new A.f(i.length,h.length)}a0=e.d.h(0,A.v(d)+"-layer-opacity")
if(a0!=null){a1=A.w(a0)
for(a2=b;a2<j.length;++a2)g.m(0,a2,a1)}}else{c=J.ao(d)
if(c.D(d,"background")){a3=e.d
a4=a3.h(0,"background-pattern")
B.a.j(k,new A.f(j.length,new A.cm(-1,i.length,-1,0)))
A.K(a3.h(0,"background-color"),"#000000")
A.K(a3.h(0,"background-opacity"),1)
if(a4!=null)A.iJ(a4)
B.a.j(i,new A.fH())}else if(c.D(d,"raster")||c.D(d,"hillshade")||c.D(d,"color-relief"))b8.eZ(e)}}a5=b8.hh()
a6=c2.a(c3.h(0,"sprite"))
b8.fD()
b8.hx()
if(c2.a(c3.h(0,"sky"))!=null){a7=c2.a(c3.h(0,"sky"))
a7=q.b(a7)?a7:B.af
s=a7.h(0,"sky-color")
A.w(s==null?"#88C6FC":s)
s=a7.h(0,"horizon-color")
A.w(s==null?"#ffffff":s)
s=a7.h(0,"sky-horizon-blend")
A.w(s==null?0.8:s)
s=a7.h(0,"fog-color")
A.w(s==null?"#ffffff":s)
s=a7.h(0,"fog-ground-blend")
A.w(s==null?0.5:s)
s=a7.h(0,"horizon-fog-blend")
A.w(s==null?0.8:s)
s=a7.h(0,"atmosphere-blend")
A.w(s==null?0.8:s)}s=A.ru(c2.a(c3.h(0,"projection")))
p=A.uV(c2.a(c3.h(0,"light")))
b8.fM(a5)
B:{o=typeof a6=="string"
if(o)break B
a8=b9
a9=b9
b0=!1
n=!1
if(r.b(a6)){m=J.o(a6)
b1=m.gk(a6)>=1
if(b1){a8=m.h(a6,0)
b0=q.b(a8)
if(b0){t.g.a(a8)
a9=a8.h(0,c0)
m=a9
if(m==null){t.g.a(a8)
m=a8.M(c0)}else m=!0
if(m)n=typeof a9=="string"}}}else b1=!1
if(n){if(b0)n=a9
else{n=b1?a8:J.al(a6,0)
a9=t.g.a(n).h(0,c0)
n=a9}A.W(n)
break B}break B}n=A.b([],t.m_)
if(o)n.push(new A.f("",a6))
if(r.b(a6))for(r=J.F(a6);r.n();){b2=r.gp()
b3=b9
b4=!1
b5=b9
o=!1
if(q.b(b2)){b6=b2.h(0,"id")
if(b6==null)m=b2.M("id")
else m=!0
if(m){b4=typeof b6=="string"
if(b4){b3=b2.h(0,c0)
if(b3==null)m=b2.M(c0)
else m=!0
if(m)o=typeof b3=="string"
b5=b6}}}if(o){b7=A.W(b4?b3:b2.h(0,c0))
n.push(new A.f(b5==="default"?"":A.v(b5)+":",b7))}}c2=c2.a(c3.h(0,"glyphs"))
c2=typeof c2=="string"?c2:b9
c3=A.bb(t.N)
for(r=b8.d.gaN(),r=r.gt(r);r.n();){b2=r.gp()
if(q.b(b2)&&typeof b2.h(0,c1)=="string")c3.j(0,A.W(b2.h(0,c1)))}A.X(c3,c3.$ti.c)
return new A.kX(p,s,b8.r,j,b8.y,b8.e,b8.c,n,c2)},
hy(a){var s,r,q,p=a.c,o=this.hq(p.h(0,"source"))
if(o==null)return null
s=p.h(0,"source-layer")
r=typeof s=="string"
if(!r){q=this.e
if(o>>>0!==o||o>=q.length)return A.a(q,o)
q=!(q[o] instanceof A.ca)}else q=!1
if(q)return null
r=r?s:""
return new A.ft(a,o,r,p.h(0,"filter"))},
hq(a){return this.f.bj(a,new A.kS(this,a))},
eZ(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=null,d=a.d,c=f.d.h(0,a.c.h(0,"source"))
if(!t.f.b(c))return
if(d.ga6().aw(0,B.ai.ge8(B.ai))){A.K(d.h(0,"raster-hue-rotate"),0)
A.K(d.h(0,"raster-saturation"),0)
A.K(d.h(0,"raster-contrast"),0)
A.K(d.h(0,"raster-brightness-min"),0)
A.K(d.h(0,"raster-brightness-max"),1)}J.m(d.h(0,"raster-resampling"),"nearest")
s=d.h(0,"resampling")
if(s!=null)A.w(s)
A.K(d.h(0,"raster-opacity"),1)
r=c.h(0,"url")
r=typeof r=="string"?r:e
q=A.qf(c.h(0,"tiles"))
p=A.E(c.h(0,"tileSize"))
if(p==null)p=512
o=A.iF(c.h(0,"maxzoom"))
n=a.b
m=c.h(0,"type")
A:{l="raster"===n
s=l
if(s){s="image"===m
k=m
j=!0}else{k=e
j=!1
s=!1}i=e
if(s){B:{if(A.w8(c.h(0,"coordinates"))!=null)s=r!=null
else s=!1
if(s){s=new A.h7()
break B}s=i
break B}break A}if(l){if(j)s=k
else{s=m
k=s
j=!0}s="raster"===s}else s=!1
if(s){A.f_(c)
s=A.E(d.h(0,"raster-fade-duration"))
B.c.E(s==null?300:s,0,1/0)
s=new A.hr()
break A}h="hillshade"===n
g=e
if(h){if(j)s=k
else{s=m
k=s
j=!0}g="raster-dem"===s
s=g}else s=!1
if(s){A.w(1)
A.f_(c)
J.m(c.h(0,"encoding"),"terrarium")
A.K(d.h(0,"hillshade-exaggeration"),0.5)
A.w("#000000")
A.w("#ffffff")
A.rq(d.h(0,"hillshade-shadow-color"),"#000000")
A.rq(d.h(0,"hillshade-highlight-color"),"#ffffff")
s=d.h(0,"hillshade-accent-color")
if(s!=null)A.w(s)
s=d.h(0,"hillshade-method")
A.v(s==null?"standard":s)
A.rs(d.h(0,"hillshade-illumination-direction"),335)
A.rs(d.h(0,"hillshade-illumination-altitude"),45)
s=new A.h6()
break A}if("color-relief"===n)if(h)s=g
else{g="raster-dem"===(j?k:m)
s=g}else s=!1
if(s){s=f.fh(a,c,o,r,p,q)
break A}s=i
break A}if(s==null)return
i=f.z
B.a.j(f.at,new A.f(f.x.length,new A.cm(i.length,-1,-1,0)))
B.a.j(i,s)},
fh(a,b,c,d,e,a0){var s,r,q,p,o,n,m,l=a.d,k=t.n,j=A.b([],k),i=A.b([],k),h=l.h(0,"color-relief-color"),g=t.j,f=!1
if(g.b(h)){s=J.o(h)
if(s.gk(h)>=3)if("interpolate"===s.h(h,0)){r=s.h(h,2)
if(g.b(r)){t.W.a(r)
g=J.o(r)
if(g.gk(r)===1)g="elevation"===g.h(r,0)
else g=f}else g=f}else g=f
else g=f}else g=f
if(g){q=J.ui(h,3)
p=new A.A(B.e,B.e)
for(o=0;g=o+1,f=q.length,g<f;o+=2){if(!(o<f))return A.a(q,o)
n=q[o]
if(!(typeof n=="number"))if(typeof n=="string"){f=A.P(n)
n=f}else{if(A.H(n))f=n?1:0
else f=null
n=f}if(n==null)continue
if(!(g<q.length))return A.a(q,g)
m=A.aO(A.w(q[g]).$1(p))
if(m==null)m=B.eU
B.a.j(j,n)
g=m.d
B.a.A(i,A.b([m.a*g,m.b*g,m.c*g,g],k))}}if(j.length===0){B.a.j(j,0)
B.a.A(i,A.b([0,0,0,0],k))}if(j.length<2){B.a.j(j,B.a.gu(j)+1)
B.a.A(i,B.a.I(i,0,4))}A.K(l.h(0,"color-relief-opacity"),1)
A.f_(b)
A.uE(b)
new Float64Array(A.R(j))
new Float64Array(A.R(i))
A.K(l.h(0,"resampling"),"linear")
return new A.fO()},
f0(e7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9=null,c0="text-font",c1="text-offset",c2="text-rotation-alignment",c3="viewport",c4="icon-rotation-alignment",c5="text-anchor",c6="icon-offset",c7="text-size",c8="icon-size",c9="symbol-height-offset",d0="symbol-sort-key",d1="text-transform",d2="lowercase",d3="text-letter-spacing",d4="text-max-width",d5="text-justify",d6="text-rotate",d7="vertical",d8="icon-padding",d9="icon-text-fit",e0=e7.a,e1=e0.d,e2=e0.e,e3=e2.h(0,"text-field"),e4=e2.h(0,"icon-image"),e5=e3!=null&&!J.m(e3,""),e6=e4!=null&&!J.m(e4,"")
if(!e5&&!e6)return
s=this.b
if(e5&&s!=null&&B.d.v(A.c1(e3),"name")){r=A.b(["coalesce"],t.I)
for(q=s.$ti,p=new A.a2(s,s.gk(0),q.i("a2<y.E>")),o=t.s,q=q.i("y.E");p.n();){n=p.d
r.push(A.b(["get",n==null?q.a(n):n],o))}e3=r}r=e2.h(0,c0)
m=A.c1(r==null?"":r).toLowerCase()
A.pE(e2.h(0,c1))
l=e2.h(0,"symbol-placement")
if(l==null)l="point"
k=A.E(e2.h(0,"symbol-spacing"))
if(k==null)k=250
j=J.m(e2.h(0,c2),c3)
i=J.m(e2.h(0,c4),c3)
e2.h(0,c5)
A.w7(e2.h(0,"text-variable-anchor-offset"),e2.h(0,"text-variable-anchor"))
h=e2.h(0,"icon-anchor")
A.pE(e2.h(0,c6))
r=t.N
g=A.bb(r)
for(f=0;f<10;++f)A.bK(e1.h(0,B.cG[f]),g)
A.bK(e2.h(0,c7),g)
A.bK(e2.h(0,c8),g)
A.bK(e2.h(0,c6),g)
A.bK(e2.h(0,c1),g)
A.bK(e2.h(0,c9),g)
for(f=0;f<8;++f)A.bK(e2.h(0,B.cw[f]),g)
e=new A.kH(e2)
q=e5?e3:b9
p=e6?e4:b9
o=e2.h(0,d0)
n=e2.h(0,"icon-rotate")
if(n==null)n=0
d=A.X(g,g.$ti.c)
B.a.aQ(d)
c=A.wi(A.eB(["source",e7.b,"sourceLayer",e7.c,"filter",e7.d,"text",q,"icon",p,"placement",l,"spacing",k,"textUpright",j,"iconUpright",i,"minZoom",e0.f,"maxZoom",e0.r,"sortKey",o,"iconRotate",n,"paintKeys",d],r,t.O))
q=A.K(e2.h(0,c7),16)
A.K(e1.h(0,"text-color"),"#000000")
A.K(e1.h(0,"text-opacity"),1)
A.w(e1.h(0,"text-halo-color"))
A.K(e1.h(0,"text-halo-width"),0)
p=A.wf(m)
if(!B.d.v(m,"italic"))B.d.v(m,"oblique")
o=A.wc(e2.h(0,c0))
n=J.m(e2.h(0,d1),"uppercase")
if(e.$1(d1)==null)if(J.m(e2.h(0,d1),d2))A.w(d2)
e.$1(d3)
e.$1(d4)
e.$1(d5)
e.$1(c5)
e.$1(d6)
e.$1(c0)
if(J.m(l,"point")){b=e2.h(0,"text-writing-mode")
A:{if(t.j.b(b)){d=A.b([],t.df)
for(a=J.F(b);a.n();){a0=a.gp()
a1=J.ao(a0)
if(a1.D(a0,d7)||a1.D(a0,"horizontal"))d.push(a1.D(a0,d7))}break A}break A}}d=A.E(e2.h(0,d3))
if(d==null)d=0
a=A.E(e2.h(0,"text-line-height"))
a2=e2.h(0,d5)
B:{if("left"===a2){a1=B.ak
break B}if("right"===a2){a1=B.al
break B}a1=B.f1
break B}J.m(e2.h(0,d5),"auto")
A.E(e2.h(0,"text-padding"))
J.m(e2.h(0,c2),"map")
J.m(e2.h(0,c4),"map")
A.E(e2.h(0,d8))
A.we(e2.h(0,d8))
J.m(e2.h(0,"text-ignore-placement"),!0)
a3=e2.h(0,"icon-pitch-alignment")
C:{if("map"===a3)break C
if("viewport"===a3)break C
a4=e2.h(0,c4)
D:{if("map"===a4)break D
if("viewport"===a4)break D
if(typeof l=="string")B.d.ap(l,"line")
break D}break C}a5=e2.h(0,"text-pitch-alignment")
E:{if("map"===a5)break E
if("viewport"===a5)break E
a6=e2.h(0,c2)
F:{if("map"===a6)break F
if("viewport"===a6)break F
if(typeof l=="string")B.d.ap(l,"line")
break F}break E}J.m(e2.h(0,"text-keep-upright"),!1)
J.m(e2.h(0,"icon-ignore-placement"),!0)
A.K(e1.h(0,"text-halo-blur"),0)
a7=A.E(e2.h(0,d4))
if(a7==null)a7=10
a8=A.K(e2.h(0,c8),1)
A.K(e1.h(0,"icon-opacity"),1)
A.K(e1.h(0,"icon-color"),"#000000")
A.E(e2.h(0,d6))
if(!A.rr(e2.h(0,c1)))A.w(e2.h(0,c1))
J.m(e2.h(0,"text-optional"),!0)
J.m(e2.h(0,"icon-optional"),!0)
A.kP(e2,"icon")
A.kP(e2,"text")
A.kP(e2,"icon")
A.kP(e2,"text")
A.wb(e2)
J.m(e2.h(0,"symbol-z-order"),"viewport-y")
e2.h(0,d0)
A.bK(e2.h(0,c8),A.bb(r))
r=e2.h(0,d9)
J.m(r==null?"none":r,"none")
e2.h(0,d9)
G:{break G}a9=e2.h(0,"icon-text-fit-padding")
H:{r=t.j
b0=b9
b1=!1
b2=!1
if(r.b(a9)){b3=J.o(a9)
if(b3.gk(a9)===4){b4=b3.h(a9,0)
if(typeof b4=="number"){A.ai(b4)
b5=b3.h(a9,1)
if(typeof b5=="number"){A.ai(b5)
b6=b3.h(a9,2)
b1=typeof b6=="number"
if(b1){A.ai(b6)
b0=b3.h(a9,3)
b2=typeof b0=="number"}}}}}if(b2){A.ai(b1?b0:J.al(a9,3))
break H}break H}A.E(e2.h(0,"text-radial-offset"))
if(r.b(h)||t.f.b(h))A.w(h)
if(!A.rr(e2.h(0,c6)))A.w(e2.h(0,c6))
r=e1.h(0,"text-translate")
if(r!=null)A.w(r)
J.m(e1.h(0,"text-translate-anchor"),c3)
r=e1.h(0,"icon-halo-color")
if(r!=null)A.w(r)
r=e1.h(0,"icon-halo-width")
if(r!=null)A.w(r)
r=e1.h(0,"icon-translate")
if(r!=null)A.w(r)
r=e1.h(0,"icon-halo-blur")
if(r!=null)A.w(r)
J.m(e1.h(0,"icon-translate-anchor"),c3)
b7=e2.h(0,c9)
I:{if(b7==null||0===b7)break I
A.w(b7)
break I}J.m(e2.h(0,"symbol-height-anchor"),"absolute")
b8=A.E(e2.h(0,"text-max-angle"))
J:{r=b9
if(b8!=null){r=b8*3.141592653589793/180
break J}break J}B.a.j(this.y,new A.hM(e0.a,c,q,p,o,n,d,a,a1,a7,a8,r))
r=this.ax
a8=A.c1(A.b(["s",c.a],t.s))
r.a+=a8},
eU(a){var s,r,q,p=a.a,o=p.d
A.K(o.h(0,"heatmap-radius"),30)
p.gb0()
J.m(o.h(0,A.v(p.b)+"-translate-anchor"),"viewport")
s=this.c_(a,B.t,A.hJ(o,B.cB))
A.w("#ffffff")
A.K(o.h(0,"heatmap-opacity"),1)
r=A.K(o.h(0,"heatmap-weight"),1)
q=A.K(o.h(0,"heatmap-intensity"),1)
A.vd(o.h(0,"heatmap-color"),q,r)
B.a.j(this.x,new A.cI(p.a,s,p.f,p.r))},
eQ(a){var s,r,q,p,o,n="viewport",m="circle-blur",l=a.a,k=l.d,j=A.hJ(k,B.d2)
A.K(k.h(0,"circle-radius"),5)
s=k.h(0,"circle-stroke-width")
l.gb0()
J.m(k.h(0,A.v(l.b)+"-translate-anchor"),n)
r=this.c_(a,B.t,j)
A.K(k.h(0,"circle-color"),"#000000")
A.K(k.h(0,"circle-opacity"),1)
if(s!=null){A.K(k.h(0,"circle-stroke-color"),"#000000")
A.w(s)
A.K(k.h(0,"circle-stroke-opacity"),1)}q=J.m(k.h(0,"circle-pitch-alignment"),"map")
p=J.m(k.h(0,"circle-pitch-scale"),n)
o=k.h(0,m)==null?null:A.w(k.h(0,m))
B.a.j(this.x,new A.dn(q,!p,o,l.a,r,l.f,l.r))},
eW(b8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6="line-gradient",a7=null,a8="line-cap",a9=b8.a,b0=a9.d,b1=a9.e,b2=A.hJ(b0,B.cA),b3=b0.h(0,"line-offset"),b4=b0.h(0,"line-blur"),b5=b0.h(0,a6)!=null&&b3!=null?a7:b0.h(0,"line-dasharray"),b6=A.wa(b5),b7=b6.length===0&&A.kK(b5)==null?A.w9(b5):B.Q
if(b6.length!==0)s=B.a.gu(b6).b
else s=b7.length!==0?B.a.gu(b7):A.kK(b5)
r=A.K(b0.h(0,"line-width"),1)
q=b0.h(0,"line-gap-width")
p=q==null?a7:A.w(q)
o=p!=null?new A.kG(r,p):r
n=b0.h(0,"line-pattern")
m=n==null
l=m?b0.h(0,a6):a7
k=this.ax
j=!m
i=l==null
h=!i
g=A.c1(A.b(["l",j,h],t.I))
k.a+=g
f=b4!=null&&m&&i
k=a9.gb0()
g=J.m(b0.h(0,A.v(a9.b)+"-translate-anchor"),"viewport")
if(j)j=B.n
else{e=b1.h(0,a8)
A:{if("round"===e){j=B.M
break A}if("square"===e){j=B.N
break A}j=B.n
break A}}d=s==null
c=!d||!m||f||h
d=f&&d
b=b3==null
a=b1.h(0,"line-join")
B:{if("round"===a){a0=B.a7
break B}if("bevel"===a){a0=B.O
break B}a0=B.v
break B}h=this.fa(b8,B.r,b2,j,c,d,a0,h,!b)
j=m&&i?A.K(b0.h(0,"line-color"),"#000000"):A.w("#ffffff")
i=i?a7:A.w(l)
d=A.K(b0.h(0,"line-opacity"),1)
c=b?a7:A.w(b3)
b=f?A.w(b4):a7
a0=m?s:a7
a1=m?b6:B.E
a2=m?b7:B.Q
a3=m&&b7.length!==0?A.w(b5):a7
a4=b1.h(0,a8)
C:{if("round"===a4){a5=B.ax
break C}if("square"===a4){a5=B.ay
break C}a5=B.a3
break C}m=m?a7:A.iJ(n)
B.a.j(this.x,A.r5(b,h,j,a0,a5,a2,a3,a1,p,i,a9.a,a9.r,a9.f,c,d,!1,m,b2.a!==0,k,g,o))},
eS(b1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=null,a1="#000000",a2="-translate-anchor",a3="viewport",a4="fill-antialias",a5="fill-outline-color",a6=b1.a,a7=a6.d,a8=A.W(a6.b),a9=a8+"-color",b0=a7.h(0,a9)
if(b0==null)b0=a1
s=a8+"-opacity"
r=a7.h(0,s)
if(r==null)r=1
q=a8+"-pattern"
p=A.hJ(a7,A.b([a9,s,q],t.s))
o=a7.h(0,q)
q=a.ax
s=o==null
a9=t.I
n=A.c1(A.b(["f",!s],a9))
q.a+=n
n=a.x
m=a6.a
a6.gb0()
J.m(a7.h(0,a8+a2),a3)
l=a.c_(b1,B.A,p)
k=a6.f
j=a6.r
if(s)A.K(b0,a1)
else A.w("#ffffff")
A.w(r)
i=s?a0:A.iJ(o)
if(!s)A.K(b0,a1)
h=!1
if(a8==="fill")if(!J.m(a7.h(0,a4),!1))h=!s||a7.h(0,a5)==null
if(h)h=s?A.K(b0,a1):A.w("#ffffff")
else h=a0
g=a8==="fill-extrusion"
B.a.j(n,new A.bm(i,h,g,m,l,k,j))
if(g){f=A.c1(["extrusion",b1.b,b1.c,b1.d,a7.h(0,"fill-extrusion-height"),a7.h(0,"fill-extrusion-base"),b0,a7.h(0,"fill-extrusion-vertical-gradient"),a6.e.h(0,"fill-extrusion-rounded-corner-distance"),o])
e=a.w.bj(f,new A.kE(a,b1,a7,o,b0,a6))
l=a.r
if(!(e>=0&&e<l.length))return A.a(l,e)
d=l[e]
if(k<d.cx)d.cx=k
if(j>d.cy)d.cy=j
a9=A.c1(A.b([f,k,j],a9))
q.a+=a9
A.w(r)
a6.gb0()
J.m(a7.h(0,a8+a2),a3)
B.a.j(a.Q,new A.ep(e,k))}c=a7.h(0,a5)
if(c==null||!s||J.m(a7.h(0,a4),!1))return
b=A.hJ(a7,B.d0)
a9=a6.gb0()
s=J.m(a7.h(0,a8+a2),a3)
B.a.j(n,A.r5(a0,a.f9(b1,B.r,b,!0),A.w(c),a0,B.a3,B.Q,a0,B.E,a0,a0,m,j,k,a0,A.w(r),!0,a0,b.a!==0,a9,s,new A.kF()))},
bZ(a0,a1,a2,a3,a4,a5,a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this,b=null,a={}
t.gi.a(a2)
a.a=a.b=a.c=null
s=a0.a
r=a0.b
a.c=r
q=a0.c
a.b=q
p=a0.d
a.a=p
o=a1===B.r
n=o?s.e.h(0,"line-join"):b
m=o?s.e.h(0,"line-cap"):b
l=t.j
k=l.b(m)||t.f.b(m)?m:b
j=o?s.e.h(0,"line-miter-limit"):b
i=o?s.e.h(0,"line-round-limit"):b
h=A.X(a2,A.u(a2).c)
B.a.aQ(h)
g=s.e.h(0,A.v(s.b)+"-sort-key")
o=[g,a1.a,r,q,p,a3.a,a4,a9,a8,a5,a7,a6.a,h]
if(l.b(n)||t.f.b(n))o.push(n)
if(k!=null)o.push(k)
if(j!=null)o.push(j)
if(i!=null)o.push(i)
f=A.c1(o)
e=c.w.bj(f,new A.kI(a,c,a1,a3,a4,a9,a8,a5,a7,a6,n,j,k,i,h,g))
a=c.r
if(!(e>=0&&e<a.length))return A.a(a,e)
d=a[e]
a=s.f
if(a<d.cx)d.cx=a
o=s.r
if(o>d.cy)d.cy=o
l=c.ax
o=A.c1(A.b([f,a,o],t.I))
l.a+=o
return e},
c_(a,b,c){return this.bZ(a,b,c,B.n,!1,!1,B.v,!1,!1,!1)},
fa(a,b,c,d,e,f,g,h,i){return this.bZ(a,b,c,d,e,f,g,h,i,!1)},
f9(a,b,c,d){return this.bZ(a,b,c,B.n,!1,!1,B.v,!1,!1,d)},
fM(a){var s,r,q,p,o,n,m,l,k
t.ia.a(a)
s=this.CW
if(s==null)return a.length
r=s.a
q=s.b
for(p=a.length,o=this.ch,n=0;n<p;++n){m=a[n]
l=!0
if(!(m.c>=0&&m.d>=o)){k=m.b
if(!(k>=0&&k>=r)){l=m.a
l=l>=0&&l>=q}}if(l)return n}return p},
hx(){var s,r=this.a,q=r.$ti.i("4?").a(r.a.h(0,"terrain"))
r=t.f
if(!r.b(q))return null
s=this.d.h(0,q.h(0,"source"))
if(!r.b(s)||!J.m(s.h(0,"type"),"raster-dem"))return null
A.w(1)
s.h(0,"url")
A.qf(s.h(0,"tiles"))
A.E(s.h(0,"tileSize"))
A.iF(s.h(0,"maxzoom"))
A.f_(s)
J.m(s.h(0,"encoding"),"terrarium")
A.E(q.h(0,"exaggeration"))
return new A.hP()},
hh(){var s,r,q,p,o,n,m,l,k,j,i,h=this,g={},f=h.x,e=A.b([],t.in)
g.a=0
s=new A.kR(h,f)
r=new A.kQ(g,e,s)
for(q=h.at,p=h.ay,o=0,n=0;n<=f.length;++n){for(;;){m=q.length
if(o<m){if(!(o>=0))return A.a(q,o)
m=q[o].a===n}else m=!1
if(!m)break
r.$1(n)
l=o+1
if(!(o>=0&&o<q.length))return A.a(q,o)
B.a.j(e,q[o].b)
o=l}m=!0
if(n!==f.length)if(n>g.a){if(J.m(s.$1(n),s.$1(g.a)))if(n!==h.ch){if(!(n<f.length))return A.a(f,n)
k=f[n].gbu()
j=g.a
if(!(j<f.length))return A.a(f,j)
if(k===f[j].gbu()){k=f.length
if(!(n<k))return A.a(f,n)
if(!(f[n] instanceof A.cI)){j=g.a
if(!(j<k))return A.a(f,j)
if(!(f[j] instanceof A.cI)){if(p.M(n)||p.M(g.a)){k=f.length
if(!(n<k))return A.a(f,n)
j=f[n]
i=n-1
if(!(i<k))return A.a(f,i)
i=j.a!==f[i].a
k=i}else k=!1
if(!k){k=f.length
if(!(n<k))return A.a(f,n)
j=f[n]
if(!(j instanceof A.bm&&j.dx)){m=g.a
if(!(m<k))return A.a(f,m)
m=f[m]
m=m instanceof A.bm&&m.dx}}}}}}}else m=!1
if(m)r.$1(n)}return e}}
A.kS.prototype={
$0(){var s,r,q,p,o,n,m,l,k,j,i,h=null,g="promoteId",f="generateId",e="encoding",d=this.a,c=this.b,b=d.d.h(0,c)
if(!t.f.b(b))return h
s=J.m(b.h(0,"type"),"geojson")
if(!s&&!J.m(b.h(0,"type"),"vector"))return h
A.qf(b.h(0,"tiles"))
r=b.h(0,"data")
q=A.iF(b.h(0,"maxzoom"))
if(s&&J.m(b.h(0,"cluster"),!0)){p=A.E(b.h(0,"clusterRadius"))
if(p==null)p=h
if(p==null)p=50
o=A.iF(b.h(0,"clusterMaxZoom"))
if(o==null)o=(q==null?18:q)-1
o=B.b.E(o,0,24)
n=A.iF(b.h(0,"clusterMinPoints"))
if(n==null)n=2
m=b.h(0,"clusterProperties")
A:{if(t.g.b(m)){l=A.C(t.N,t.O)
for(k=m.gai(),k=k.gt(k);k.n();){j=k.gp()
l.m(0,A.v(j.a),j.b)}break A}l=B.e
break A}i=new A.jb(p,o,n,l)}else i=h
d=d.e
if(s){A.v(c)
c=b.h(0,g)
p=J.m(b.h(0,f),!0)
o=b.h(0,"filter")
n=A.E(b.h(0,"buffer"))
if(n==null)n=h
A.v(typeof r=="string"?r:A.oU(r))
if(i!=null)B.h.ak(i.d,h)
A.v(b.h(0,g))
A.v(b.h(0,f))
A.c1(b.h(0,"filter"))
A.v(b.h(0,"buffer"))
c=new A.ca(r,n,o,i,p,q,c)}else{A.v(c)
b.h(0,"url")
c=b.h(0,g)
p=A.f_(b)
o=J.m(b.h(0,e),"mlt")
A.v(b.h(0,"url"))
A.v(b.h(0,g))
n=A.f_(b).b
if(n!=null)B.a.ac(n,",")
A.v(b.h(0,e))
c=new A.dM(p,o,q,c)}B.a.j(d,c)
return d.length-1},
$S:93}
A.kH.prototype={
$1(a){var s=this.a,r=s.h(0,a)
A:{if(t.j.b(r)||t.f.b(r)){s=A.w(s.h(0,a))
break A}s=null
break A}return s},
$S:94}
A.kG.prototype={
$1(a){var s,r=A.E(this.a.$1(a))
if(r==null)r=1
s=A.E(this.b.$1(a))
if(s==null)s=0
return r*2+s},
$S:15}
A.kE.prototype={
$0(){var s=this,r="fill-extrusion-height",q="fill-extrusion-base",p=null,o=s.a.r,n=s.b,m=A.os(n.d),l=s.c,k=A.K(l.h(0,r),0),j=A.K(l.h(0,q),0),i=s.d,h=i==null,g=h?A.K(s.e,"#000000"):A.w("#ffffff"),f=J.m(l.h(0,"fill-extrusion-vertical-gradient"),!1),e=s.f.e.h(0,"fill-extrusion-rounded-corner-distance")
e=A.w(e==null?0:e)
i=h?p:A.iJ(i)
l=[l.h(0,r),l.h(0,q)]
if(h)l.push(s.e)
B.a.j(o,A.qD(n.b,n.c,m,B.K,B.n,p,!1,!1,new A.jl(k,j,g,!f,e,i,A.rt(l)),B.v,p,!1,p,!1,!1,p,p,B.ad))
return o.length-1},
$S:7}
A.kF.prototype={
$1(a){return 1},
$S:28}
A.kI.prototype={
$0(){var s,r,q,p,o,n=this,m=null,l=n.b.r,k=n.a,j=k.c,i=k.b
k=A.os(k.a)
s=n.z
s=t.j.b(s)||t.f.b(s)?A.w(s):m
r=n.Q
r=r==null?m:A.w(r)
q=n.as
q=q==null?m:A.w(q)
p=n.at
p=p==null?m:A.w(p)
o=n.ay
o=o==null?m:A.w(o)
B.a.j(l,A.qD(j,i,k,n.c,n.d,q,n.e,n.w,m,n.y,s,n.x,r,n.r,n.f,p,o,n.ax))
return l.length-1},
$S:7}
A.kR.prototype={
$1(a){var s=this.a.r,r=this.b
if(!(a<r.length))return A.a(r,a)
r=r[a].b
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r].c},
$S:13}
A.kQ.prototype={
$1(a){var s=this.a,r=s.a
if(a>r)B.a.j(this.b,new A.cm(-1,-1,this.c.$1(r),s.a))
s.a=a},
$S:42}
A.kT.prototype={
$1(a){var s,r
t.X.a(a)
s=this.a.$1(a)
if(A.aO(s)!=null)return s
r=this.b
return r==null?this.c.$1(a):r},
$S:30}
A.kU.prototype={
$1(a){var s,r
t.X.a(a)
s=this.a.$1(a)
A:{if(s==null){r=this.b.$1(a)
break A}if(typeof s=="number")r=isNaN(s)
else r=!1
if(r){r=this.b.$1(a)
break A}r=s
break A}return r},
$S:1}
A.kN.prototype={
$2(a,b){var s=this.a,r=s.h(0,a)
A:{if(typeof r=="string"){s=r!=="never"
break A}s=J.m(s.h(0,b),!0)
break A}return s},
$S:96}
A.kO.prototype={
$1(a){return typeof a=="number"},
$S:8}
A.kJ.prototype={
$1(a){return typeof a=="string"&&A.aO(a)!=null},
$S:8}
A.kL.prototype={
$1(a){var s,r
if(!t.j.b(a))return
s=J.o(a)
if(s.gk(a)===2&&J.m(s.h(a,0),"literal")){r=A.kK(a)
if(r!=null&&!B.a.aw(this.a,new A.kM(r)))B.a.j(this.a,r)
return}for(s=s.gt(a);s.n();)this.$1(s.gp())},
$S:12}
A.kM.prototype={
$1(a){return A.wd(t.kI.a(a),this.a)},
$S:97}
A.cx.prototype={
ar(){return"BucketKind."+this.b}}
A.jl.prototype={}
A.jo.prototype={}
A.ep.prototype={}
A.di.prototype={}
A.dv.prototype={
ar(){return"DashCap."+this.b}}
A.bo.prototype={
gbu(){return!1}}
A.hl.prototype={}
A.bm.prototype={}
A.dF.prototype={}
A.dn.prototype={
gbu(){return!0}}
A.cI.prototype={
gbu(){return!0}}
A.jL.prototype={}
A.kY.prototype={}
A.kZ.prototype={
$1(a){return""},
$S:5}
A.hM.prototype={
gi2(){return this.b.d},
i3(a){return this.gi2().$1(a)}}
A.lf.prototype={
i8(a,b,c){var s,r,q,p,o
if(a<this.a)return!1
s=this.b
if(s==null)return!0
r=new A.lh(a)
q=new A.li(a)
if(0>=s.length)return A.a(s,0)
p=r.$1(s[0])
if(typeof p!=="number")return A.ah(p)
o=!1
if(b>=p){if(2>=s.length)return A.a(s,2)
r=r.$1(s[2])
if(typeof r!=="number")return A.ah(r)
if(b<=r){if(3>=s.length)return A.a(s,3)
r=q.$1(s[3])
if(typeof r!=="number")return A.ah(r)
if(c>=r){if(1>=s.length)return A.a(s,1)
r=q.$1(s[1])
if(typeof r!=="number")return A.ah(r)
r=c<=r}else r=o}else r=o}else r=o
return r}}
A.lg.prototype={
$1(a){return typeof a=="number"},
$S:8}
A.lh.prototype={
$1(a){var s=B.b.a8(1,this.a)
return B.b.E(B.c.a5((a+180)/360*s),0,s-1)},
$S:25}
A.li.prototype={
$1(a){var s=B.b.a8(1,this.a)
return B.b.E(B.c.a5(A.tI(a)*s),0,s-1)},
$S:25}
A.dP.prototype={
cC(a){var s,r=this.c
A:{if(typeof r=="string"){s=r
break A}if(t.f.b(r)){s=A.dY(r.h(0,a))
break A}s=null
break A}return s}}
A.ca.prototype={
gec(){return 18}}
A.dM.prototype={
gec(){return 22}}
A.fH.prototype={}
A.cm.prototype={}
A.pC.prototype={}
A.hK.prototype={}
A.kW.prototype={
$1(a){return t.aL.a(a).b===0},
$S:98}
A.kX.prototype={}
A.hL.prototype={
dW(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i=this,h=A.b([i.ci(b,c),i.ci(b,d),i.ci(b,e)],t.b)
for(s=1/0,r=-1/0,q=0;q<3;++q){p=h[q]
if(0>=p.length)return A.a(p,0)
o=p[0]
s=Math.min(s,o)
r=Math.max(r,o)}for(o=i.b,n=B.c.a5(s/o)+1,m=h;l=n*o,l<r;++n,m=j){k=i.dO(m,0,l)
j=k.b
i.dM(k.a)
if(j.length<3)return}i.dM(m)},
ci(a,b){var s,r,q,p,o,n=A.b([],t.n)
for(s=this.a,r=b*s,q=a.length,p=0;p<s;++p){o=r+p
if(!(o<q))return A.a(a,o)
n.push(a[o])}return n},
dM(a){var s,r,q,p,o,n,m,l,k,j,i=this
t.y.a(a)
if(a.length<3)return
if(B.a.aw(a,A.zo())){i.c4(a)
return}for(s=a.length,r=1/0,q=-1/0,p=0;p<s;++p){o=a[p]
if(1>=o.length)return A.a(o,1)
n=o[1]
r=Math.min(r,n)
q=Math.max(q,n)}for(s=i.b,m=B.c.a5(r/s)+1,l=a;n=m*s,n<q;++m,l=j){k=i.dO(l,1,n)
j=k.b
i.c4(k.a)
if(j.length<3)return}i.c4(l)},
dO(a,b,c){var s,r,q,p,o,n,m,l,k,j,i
t.y.a(a)
s=t.b
r=A.b([],s)
q=A.b([],s)
p=a.length
for(o=0;o<p;){s=a.length
if(!(o<s))return A.a(a,o)
n=a[o];++o
m=o%p
if(!(m<s))return A.a(a,m)
l=a[m]
s=n.length
if(1>=s)return A.a(n,1)
m=n[1]
if(m<-32767.5||m>32766.5){B.a.j(r,n)
B.a.j(q,n)
continue}if(!(b<s))return A.a(n,b)
k=n[b]
if(!(b<l.length))return A.a(l,b)
j=l[b]
if(k<=c)B.a.j(r,n)
if(k>=c)B.a.j(q,n)
if(1>=l.length)return A.a(l,1)
s=l[1]
if(s<-32767.5||s>32766.5)continue
if(!(k<c&&j>c))s=k>c&&j<c
else s=!0
if(s){i=this.fo(n,l,b,c)
B.a.j(r,i)
B.a.j(q,i)}}return new A.f(r,q)},
fo(a,b,c,d){var s,r,q,p,o,n,m,l,k=t.H
k.a(a)
k.a(b)
k=a.length
if(0>=k)return A.a(a,0)
s=a[0]
r=b.length
if(0>=r)return A.a(b,0)
q=b[0]
if(!(s>q))if(s===q){if(1>=k)return A.a(a,1)
k=a[1]
if(1>=r)return A.a(b,1)
k=k>b[1]
p=k}else p=!1
else p=!0
o=p?b:a
n=p?a:b
if(!(c<o.length))return A.a(o,c)
k=o[c]
if(!(c<n.length))return A.a(n,c)
m=(d-k)/(n[c]-k)
k=A.b([],t.n)
for(s=this.a,l=0;l<s;++l){if(l===c)r=d
else{if(!(l<o.length))return A.a(o,l)
r=o[l]
if(!(l<n.length))return A.a(n,l)
r+=(n[l]-r)*m}k.push(r)}return k},
c4(a){var s,r,q,p,o,n
t.y.a(a)
s=a.length
if(s<3)return
r=this.c
q=B.b.aa(r.length,this.a)
for(p=0;p<a.length;a.length===s||(0,A.h)(a),++p)B.a.A(r,a[p])
for(s=this.d,o=1;n=o+1,n<a.length;o=n){B.a.j(s,q)
r=q+o
B.a.j(s,r)
B.a.j(s,r+1)}}}
A.oA.prototype={
$2(a,b){var s,r,q,p,o,n,m
if(a===b)return
s=Math.min(a,b)
r=Math.max(a,b)
for(q=this.a,p=B.c.a5(s/q)+1,o=this.b,n=b-a;m=p*q,m<r;++p)B.a.j(o,(m-a)/n)},
$S:32}
A.cL.prototype={
ar(){return"LineJoin."+this.b}}
A.dE.prototype={
ar(){return"LineCap."+this.b}}
A.aZ.prototype={
ar(){return"_Join."+this.b}}
A.eE.prototype={}
A.lA.prototype={
cJ(a,b){var s,r,q,p=this,o=p.Q
if(o>0&&o+a>16e3)p.cB()
p.es(a)
o=p.as
s=o+b
r=p.x
q=r.length
if(s>q){q=Math.max(s,q*2)
q=new Uint16Array(q)
B.U.Z(q,0,o,r)
p.x=q}},
es(a){var s=this,r=s.Q,q=(r+a)*2,p=s.f,o=p.length
if(q>o){o=Math.max(q,o*2)
o=new Float32Array(o)
B.o.Z(o,0,r*2,p)
s.f=o
r=o}else r=p
p=s.a
if(p&&q>s.r.length){r=Math.max(q,r.length)
r=new Float32Array(r)
B.o.Z(r,0,s.Q*2,s.r)
s.r=r}if(p&&B.b.F(q,2)>s.w.length){r=B.c.F(Math.max(q,s.f.length),2)
r=new Uint8Array(r)
B.j.Z(r,0,s.Q,s.w)
s.w=r}if(s.b&&q>s.d.length){r=Math.max(q,s.f.length)
r=new Float32Array(r)
B.o.Z(r,0,s.Q*2,s.d)
s.d=r}if(s.c&&q>s.e.length){r=Math.max(q,s.f.length)
r=new Float32Array(r)
B.o.Z(r,0,s.Q*2,s.e)
s.e=r}},
cB(){var s,r,q,p,o,n,m=this,l=null,k=m.a
if(k&&(m.Q&1)===1){m.es(1)
s=m.f
r=m.Q
q=r*2
s.$flags&2&&A.x(s)
p=s.length
if(!(q>=0&&q<p))return A.a(s,q)
s[q]=0
o=q+1
if(!(o<p))return A.a(s,o)
s[o]=0
s=m.r
s.$flags&2&&A.x(s)
p=s.length
if(!(q<p))return A.a(s,q)
s[q]=0
if(!(o<p))return A.a(s,o)
s[o]=0
s=m.w
s.$flags&2&&A.x(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=2
if(m.b){s=m.d
s.$flags&2&&A.x(s)
if(!(q<s.length))return A.a(s,q)
s[q]=0}if(m.c){s=m.e
s.$flags&2&&A.x(s)
p=s.length
if(!(q<p))return A.a(s,q)
s[q]=0
if(!(o<p))return A.a(s,o)
s[o]=0}m.Q=r+1}if(m.as>0){s=new Float32Array(A.R(A.js(m.f,0,m.Q*2)))
r=k?new Float32Array(A.R(A.js(m.r,0,m.Q*2))):l
q=new Uint16Array(A.R(A.rz(m.x,0,m.as)))
p=m.b?new Float32Array(A.R(A.js(m.d,0,m.Q*2))):l
o=m.c?new Float32Array(A.R(A.js(m.e,0,m.Q*2))):l
k=k?new Uint8Array(A.R(A.bQ(m.w,0,m.Q))):l
n=m.y
n=n.length===0?l:new Uint16Array(A.R(A.rz(n,0,m.z)))
B.a.j(m.at,new A.eE(n,s,r,q,p,o,k))}m.z=m.as=m.Q=0}}
A.jq.prototype={
dY(a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this
t.L.a(a3)
s=a2-a1
if(s<3||s>65e3)return
r=A.bA(a0,a1*2,a2*2)
q=!a.c
if(!q||a.d){p=a.fp(r,a3)
r=p.a
a3=p.b
s=r.length/2|0
if(s<3||s>65e3)return}o=A.qM(r,a3)
if(o.length===0)return
n=!q||a.d?a.h6(r,o):B.cQ
q=a.a
m=n.length
q.cJ(s+m,o.length+m*3)
l=q.Q
k=q.f
j=l*2
for(m=s*2,i=r.length,h=k.$flags|0,g=0;g<m;++g,j=f){f=j+1
if(!(g<i))return A.a(r,g)
e=r[g]
h&2&&A.x(k)
if(!(j>=0&&j<k.length))return A.a(k,j)
k[j]=e}d=q.x
c=q.as
for(m=o.length,i=d.$flags|0,g=0;g<m;++g,c=b){b=c+1
h=o[g]
i&2&&A.x(d)
if(!(c<d.length))return A.a(d,c)
d[c]=l+h}if(a.b)a.hg(l,s,a3)
q.Q+=s
q.as=c
if(n.length!==0)a.fB(l,r,n)},
fp(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e
t.L.a(b)
s=t.n
r=A.b([],s)
q=A.b([],t.t)
p=a.length
o=p/2|0
for(n=this.d,m=this.c,l=0;k=b.length,l<=k;++l){j=l===0
if(j)i=0
else{h=l-1
if(!(h>=0))return A.a(b,h)
i=b[h]}g=l<k?b[l]:o
k=A.b([],s)
for(f=i*2,h=g*2;f<h;++f){if(!(f>=0&&f<p))return A.a(a,f)
k.push(a[f])}e=m?A.qN(k,0,!0):k
if(n)e=A.qN(e,4096,!1)
if(e.length<6){if(j)return new A.f(new Float64Array(0),B.m)
continue}if(l>0)B.a.j(q,r.length/2|0)
B.a.A(r,e)}return new A.f(new Float64Array(A.R(r)),q)},
h6(a,b){var s,r,q,p,o,n,m,l,k,j,i
t.L.a(b)
s=A.b([],t.oZ)
for(r=this.d,q=this.c,p=a.length,o=0;o+2<b.length;o+=3)for(n=0;n<3;){m=o+n
l=b.length
if(!(m<l))return A.a(b,m)
k=b[m];++n
m=o+n%3
if(!(m<l))return A.a(b,m)
j=b[m]
m=k*2+1
if(!(m>=0&&m<p))return A.a(a,m)
i=a[m]
m=j*2+1
if(!(m>=0&&m<p))return A.a(a,m)
if(i!==a[m])continue
if(q&&i===0)B.a.j(s,new A.aS(k,j,-32768))
if(r&&i===4096)B.a.j(s,new A.aS(k,j,32767))}return s},
fB(a,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
t.lK.a(a1)
s=this.a
r=s.f
q=s.x
p=s.Q
o=s.as
for(n=a1.length,m=a0.length,l=r.$flags|0,k=q.$flags|0,j=0;j<n;++j,o=b){i=a1[j]
h=i.a
g=i.b
f=p*2
e=h*2
if(!(e>=0&&e<m))return A.a(a0,e)
e=a0[e]
d=g*2
if(!(d>=0&&d<m))return A.a(a0,d)
d=a0[d]
l&2&&A.x(r)
c=r.length
if(!(f>=0&&f<c))return A.a(r,f)
r[f]=(e+d)/2;++f
if(!(f<c))return A.a(r,f)
r[f]=i.c
b=o+1
k&2&&A.x(q)
i=q.length
if(!(o<i))return A.a(q,o)
q[o]=a+h
o=b+1
if(!(b<i))return A.a(q,b)
q[b]=a+g
b=o+1
if(!(o<i))return A.a(q,o)
q[o]=p;++p}s.Q=p
s.as=o},
hg(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h
t.L.a(c)
s=this.a
r=s.y
q=r.length
p=s.z
o=p+b*2
if(q<o){q=Math.max(o,q*2)
q=new Uint16Array(q)
B.U.Z(q,0,p,r)
s.y=q
r=q}n=s.z
for(q=c.length,p=r.$flags|0,m=0;m<=q;++m){if(m===0)l=0
else{o=m-1
if(!(o>=0))return A.a(c,o)
l=c[o]}k=m<q?c[m]:b
for(j=l;j<k;){i=n+1
p&2&&A.x(r)
o=r.length
if(!(n>=0&&n<o))return A.a(r,n)
r[n]=a+j
n=i+1;++j
h=j<k?j:l
if(!(i>=0&&i<o))return A.a(r,i)
r[i]=a+h}}s.z=n}}
A.jr.prototype={
$1(a){var s=this.b
return this.a?a>=s:a<=s},
$S:31}
A.jY.prototype={
dX(g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9=this
if(g6==null)g6=f9.b
f9.z=g7==null?2:g7
f9.Q=g8==null?1.05:g8
s=g2-g1
if(s<2)return
if(s>1800){r=g1+1800-1
s=g9==null
q=0
if(!s)for(p=g1+1,o=g0.length;p<=r;++p){n=p*2
if(!(n>=0&&n<o))return A.a(g0,n)
m=g0[n]
l=n-2
if(!(l>=0&&l<o))return A.a(g0,l)
k=m-g0[l]
l=n+1
if(!(l<o))return A.a(g0,l)
l=g0[l];--n
if(!(n>=0&&n<o))return A.a(g0,n)
j=l-g0[n]
q+=Math.sqrt(k*k+j*j)}f9.cl(g0,g1,r+1,g3,g4,g6,g7,g8,g9,h0)
f9.cl(g0,r,g2,g3,g4,g6,g7,g8,s?null:g9+q*h0,h0)
return}f9.r=g9
f9.w=h0
o=f9.at
if(s*2>o.length)s=f9.at=new Float64Array(s*4)
else s=o
i=g3*g3
for(o=s.$flags|0,n=g0.length,m=s.length,l=g2-1,p=g1,h=0;p<g2;++p){g=p*2
if(!(g>=0&&g<n))return A.a(g0,g)
f=g0[g];++g
if(!(g<n))return A.a(g0,g)
e=g0[g]
if(h>0){g=h*2
d=g-2
if(!(d>=0&&d<m))return A.a(s,d)
k=f-s[d];--g
if(!(g>=0&&g<m))return A.a(s,g)
j=e-s[g]
c=k*k+j*j
if(c!==0)g=c<i&&p!==l
else g=!0
if(g)continue}g=h*2
o&2&&A.x(s)
if(!(g<m))return A.a(s,g)
s[g]=f;++g
if(!(g<m))return A.a(s,g)
s[g]=e;++h}if(h<2)return
f9.a.cJ(h*32+18,h*96+54)
f9.f=0
f9.ax=f9.ay=-1
if(g5){for(;;){o=!1
if(h>2){n=h*2
l=n-2
if(!(l>=0&&l<m))return A.a(s,l)
l=s[l]
if(0>=m)return A.a(s,0)
if(l===s[0]){o=n-1
if(!(o>=0&&o<m))return A.a(s,o)
o=s[o]
if(1>=m)return A.a(s,1)
o=o===s[1]}}if(!o)break;--h}if(h<3)return
o=h*2
if(0>=m)return A.a(s,0)
n=s[0]
s.$flags&2&&A.x(s)
if(!(o>=0&&o<m))return A.a(s,o)
s[o]=n;++o
if(1>=m)return A.a(s,1)
n=s[1]
if(!(o<m))return A.a(s,o)
s[o]=n;++h}b=g6===B.O?1.05:f9.z
a=f9.Q
a0=h-1
if(g5){o=a0*2
n=o-2
if(!(n>=0&&n<m))return A.a(s,n)
a1=s[n];--o
if(!(o>=0&&o<m))return A.a(s,o)
a2=s[o]
if(0>=m)return A.a(s,0)
o=s[0]
if(1>=m)return A.a(s,1)
a3=A.r6(a1,a2,o,s[1])
a4=a3.a
a5=a3.b}else{a1=0
a2=0
a4=0
a5=0}for(o=g4===B.N,n=g4===B.M,l=g6.a,g=g6===B.ba,a6=g5,a7=a6,a8=0,a9=0,b0=!1,b1=0,b2=0,p=0;p<h;++p,a7=!0,a6=!0){d=p<a0
b3=d||g5
if(d){b4=p*2+2
if(!(b4<m))return A.a(s,b4)
b5=s[b4]}else{if(2>=m)return A.a(s,2)
b5=s[2]}if(d){b4=p*2+3
if(!(b4<m))return A.a(s,b4)
b6=s[b4]}else{if(3>=m)return A.a(s,3)
b6=s[3]}if(a6){b2=a5
b1=a4}if(a7){a9=a2
a8=a1
b0=!0}b4=p*2
if(!(b4<m))return A.a(s,b4)
a1=s[b4];++b4
if(!(b4<m))return A.a(s,b4)
a2=s[b4]
if(b3){b7=A.r6(a1,a2,b5,b6)
a4=b7.a
a5=b7.b}else{a5=b2
a4=b1}if(!a6){b2=a5
b1=a4}b8=b1+a4
b9=b2+a5
b4=b8*b8+b9*b9
c0=Math.sqrt(b4)
if(c0>0){b8/=c0
b9/=c0}c1=b1*a4+b2*a5
c2=b8*a4+b9*a5
c3=c2!==0?1/c2:1/0
c4=Math.sqrt(Math.max(0,2-2*c2))
c5=c2<$.tM()&&b0&&b3
c6=b1*a5-b2*a4>0
c7=Math.min(c3,2)
c8=b8*c7
c9=b9*c7
d0=B.c.E((c3-3)/5,0,1)
if(c5&&p>0){d1=a1-a8
d2=a2-a9
d3=Math.sqrt(d1*d1+d2*d2)
if(d3>240){d4=120/d3
d5=a1-B.c.a1(d1*d4)
d6=a2-B.c.a1(d2*d4)
k=d5-a8
j=d6-a9
f9.f=f9.f+Math.sqrt(k*k+j*j)
f9.af(d5,d6,b1,b2,0,0,b1,b2)
a9=d6
a8=d5}}d7=b0&&b3
if(d7)if(g)d8=B.X
else{if(!(l<8))return A.a(B.aa,l)
d9=B.aa[l]
d8=d9}else if(g5)d8=B.J
else{if(n)d9=B.G
else d9=o?B.Z:B.J
d8=d9}if(d7&&d8===B.G)if(c3<a)d8=B.z
else if(c3<=2)d8=B.I
if(d8===B.z&&c3>b)d8=B.H
if(d8===B.H){if(c3>2)d8=B.Y
if(c3<b)d8=B.z}if(b0){k=a1-a8
j=a2-a9
f9.f=f9.f+Math.sqrt(k*k+j*j)}A:{if(B.z===d8){f9.af(a1,a2,b8*c3,b9*c3,0,0,c8,c9)
break A}if(B.Y===d8){if(c3>100){e0=-a4
e1=-a5}else{k=b1-a4
j=b2-a5
b4=Math.sqrt(b4)
c4=Math.sqrt(k*k+j*j)
d9=c6?-1:1
d4=c3*b4/c4*d9
e0=-b9*d4
e1=b8*d4}f9.af(a1,a2,e0,e1,0,0,c8+(e0-c8)*d0,c9+(e1-c9)*d0)
b4=-e0
c4=-e1
f9.af(a1,a2,b4,c4,0,0,c8+(b4-c8)*d0,c9+(c4-c9)*d0)
break A}if(B.H===d8||B.I===d8){e2=-Math.sqrt(c3*c3-1)
e3=c6?e2:0
e4=c6?0:e2
if(b0)f9.af(a1,a2,b1,b2,e3,e4,c8,c9)
if(d8===B.I){e5=B.c.Y(2*c4*180/3.141592653589793/20)
for(b4=a4-b1,c4=a5-b2,e6=1.0904+c1*(-3.2452+c1*(3.55645-c1*1.43519)),e7=0.848013+c1*(-1.06021+c1*0.215638),d9=-c8,e8=-c9,e9=1;e9<e5;++e9){f0=e9/e5
if(f0!==0.5){f1=f0-0.5
f0+=f0*f1*(f0-1)*(e6*f1*f1+e7)}f2=b4*f0+b1
f3=c4*f0+b2
f4=Math.sqrt(f2*f2+f3*f3)
d4=(c6?-1:1)/f4
f9.d=c6?d9:c8
f9.e=c6?e8:c9
f5=c6?1:0
f9.bb(f9.au(a1,a2,f2*d4,f3*d4,f5),c6)}}if(b3)f9.af(a1,a2,a4,a5,-e3,-e4,c8,c9)
break A}if(B.J===d8){if(!b0)f9.dC(a1,a2,b8,b9,c8,c9,!1)
f9.af(a1,a2,b8,b9,0,0,c8,c9)
if(b0)f9.dC(a1,a2,b8,b9,c8,c9,!0)
break A}if(B.Z===d8){d4=b0?1:-1
f9.af(a1,a2,b8,b9,d4,d4,c8,c9)
break A}if(B.X===d8){f9.af(a1,a2,b1,b2,0,0,b1,b2)
f9.ax=f9.ay=-1
f9.af(a1,a2,a4,a5,0,0,a4,a5)
break A}if(B.G===d8){if(b0){f6=c8+(b1-c8)*d0
f7=c9+(b2-c9)*d0
f9.af(a1,a2,b1,b2,0,0,f6,f7)
f9.d=f6
f9.e=f7
f9.df(a1,a2,b1,b2,3.141592653589793,-1)}if(b3){f6=c8+(a4-c8)*d0
f7=c9+(a5-c9)*d0
f9.d=f6
f9.e=f7
f9.df(a1,a2,a4,a5,3.141592653589793,1)
f9.ax=f9.ay=-1
f9.af(a1,a2,a4,a5,0,0,f6,f7)}}}if(c5&&d){d1=b5-a1
d2=b6-a2
f8=Math.sqrt(d1*d1+d2*d2)
if(f8>240){d4=120/f8
d5=a1+B.c.a1(d1*d4)
d6=a2+B.c.a1(d2*d4)
k=d5-a1
j=d6-a2
f9.f=f9.f+Math.sqrt(k*k+j*j)
f9.af(d5,d6,a4,a5,0,0,a4,a5)
a2=d6
a1=d5}}}},
cl(a,b,c,d,e,f,g,h,i,j){return this.dX(a,b,c,d,e,!1,f,g,h,i,j)},
hJ(a,b,c,d,e){var s=null
return this.dX(a,b,c,d,B.n,e,s,s,s,s,0)},
bb(a,b){var s,r,q,p,o,n=this,m=n.ax
if(m>=0&&n.ay>=0){s=n.a
r=s.x
q=s.as
p=q+1
r.$flags&2&&A.x(r)
o=r.length
if(!(q<o))return A.a(r,q)
r[q]=m
q=p+1
if(!(p<o))return A.a(r,p)
r[p]=a
m=n.ay
if(!(q<o))return A.a(r,q)
r[q]=m
s.as=q+1}if(b)n.ay=a
else n.ax=a},
dC(a,b,c,d,e,f,g){var s,r,q,p,o,n=this
n.d=e
n.e=f
s=n.au(a,b,c,d,0)
r=n.a
q=r.w
p=g?3:4
q.$flags&2&&A.x(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=p
n.bb(s,!1)
o=n.au(a,b,-c,-d,1)
r=r.w
q=g?5:6
r.$flags&2&&A.x(r)
if(!(o>=0&&o<r.length))return A.a(r,o)
r[o]=q
n.bb(o,!0)},
af(a,b,c,d,e,f,g,h){var s=this
s.d=g
s.e=h
s.bb(s.au(a,b,c+d*e,d-c*e,0),!1)
s.bb(s.au(a,b,-c+d*f,-d-c*f,1),!0)},
df(a,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.c?0:0.5,e=g.bc(a,a0,0,0,0.5,!0),d=Math.max(1,B.c.bL(a3/0.5235987755982988)),c=a3/d*a4,b=1/Math.cos(c/2)
g.bc(a,a0,a1,a2,f,!0)
for(s=0;s<d;++s){r=c*(s+0.5)
q=Math.cos(r)*b
p=Math.sin(r)*b
g.bc(a,a0,a1*q-a2*p,a1*p+a2*q,f,!0)}o=a3*a4
q=Math.cos(o)
p=Math.sin(o)
g.bc(a,a0,a1*q-a2*p,a1*p+a2*q,f,!0)
o=g.a
n=o.x
m=o.as
for(l=n.$flags|0,k=e+1,j=e+2,s=0;s<=d;++s,m=i){i=m+1
l&2&&A.x(n)
h=n.length
if(!(m<h))return A.a(n,m)
n[m]=e
m=i+1
if(!(i<h))return A.a(n,i)
n[i]=k+s
i=m+1
if(!(m<h))return A.a(n,m)
n[m]=j+s}o.as=m},
bc(a,b,c,d,e,f){var s,r,q,p,o,n,m=this,l=m.a,k=l.Q,j=k*2,i=l.f
i.$flags&2&&A.x(i)
s=i.length
if(!(j>=0&&j<s))return A.a(i,j)
i[j]=a
r=j+1
if(!(r<s))return A.a(i,r)
i[r]=b
i=l.r
i.$flags&2&&A.x(i)
s=i.length
if(!(j<s))return A.a(i,j)
i[j]=c
if(!(r<s))return A.a(i,r)
i[r]=d
i=l.w
if(f)s=2
else s=e<0.5?0:1
i.$flags&2&&A.x(i)
if(!(k>=0&&k<i.length))return A.a(i,k)
i[k]=s
if(l.b){q=m.r
i=l.d
s=q==null
p=m.f
o=s?p:(q+p*m.w)*256
i.$flags&2&&A.x(i)
n=i.length
if(!(j<n))return A.a(i,j)
i[j]=o
s=s?e:p
if(!(r<n))return A.a(i,r)
i[r]=s}if(l.c){i=l.e
s=m.d
i.$flags&2&&A.x(i)
p=i.length
if(!(j<p))return A.a(i,j)
i[j]=s
s=m.e
if(!(r<p))return A.a(i,r)
i[r]=s}l.Q=k+1
return k},
au(a,b,c,d,e){return this.bc(a,b,c,d,e,!1)},
hK(a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=this
if(a6-a5<2)return
a3.d=a3.e=a3.f=0
a3.r=null
for(s=a3.a,r=a4.length,q=a5;p=q+1,p<a6;q=p){o=q*2
if(!(o<r))return A.a(a4,o)
n=a4[o]
m=o+1
if(!(m<r))return A.a(a4,m)
l=a4[m]
m=o+2
if(!(m<r))return A.a(a4,m)
k=a4[m]
o+=3
if(!(o<r))return A.a(a4,o)
j=a4[o]
i=k-n
h=j-l
g=Math.sqrt(i*i+h*h)
if(g===0)continue
f=-h/g
e=i/g
s.cJ(4,6)
d=a3.au(n,l,f,e,0)
o=-f
m=-e
c=a3.au(n,l,o,m,1)
b=a3.au(k,j,f,e,0)
a=a3.au(k,j,o,m,1)
a0=s.x
a1=s.as
a2=a1+1
a0.$flags&2&&A.x(a0)
m=a0.length
if(!(a1<m))return A.a(a0,a1)
a0[a1]=d
a1=a2+1
if(!(a2<m))return A.a(a0,a2)
a0[a2]=c
a2=a1+1
if(!(a1<m))return A.a(a0,a1)
a0[a1]=b
a1=a2+1
if(!(a2<m))return A.a(a0,a2)
a0[a2]=c
a2=a1+1
if(!(a1<m))return A.a(a0,a1)
a0[a1]=a
if(!(a2<m))return A.a(a0,a2)
a0[a2]=b
s.as=a2+1}}}
A.dj.prototype={}
A.b5.prototype={
sae(a){this.Q=t.h9.a(a)}}
A.dk.prototype={
ik(a,b,c,d){var s,r,q,p,o,n,m=1/B.b.a8(1,a),l=b*m,k=c*m
for(s=this.c,r="r|"+a+"/"+b+"/"+c+"|",q=0;q<s.length;++q){p=s[q]
o=p.f!=null||p.y||p.c.length===0
n=""+p.a
p.z=o?r+n+"|"+q:"p|"+n+"|"+p.c+"|"+B.c.a5((l+p.d/4096*m)*d)+"|"+B.c.a5((k+p.e/4096*m)*d)}},
cM(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=null,d=t.D,c=A.b([],d)
for(s=f.b,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q]
o=p.b
n=[p.a,o.b]
m=o.c
if(m!=null)n.push(m)
else n.push(e)
n.push(o.d)
l=o.e
if(l!=null)n.push(l)
else n.push(e)
n.push(p.c)
k=o.f
if(k!=null)n.push(k)
else n.push(e)
c.push(n)}s=A.b([],d)
for(r=f.c,o=r.length,n=t.g2,q=0;q<r.length;r.length===o||(0,A.h)(r),++q){j=r[q]
i=[j.a,j.b,j.c,j.d,j.e,j.f,j.r,j.w,j.y,j.z,j.x,j.Q]
h=j.as
if(h!=null)i.push(A.b([h.e,h.f,h.r,h.d.length],n))
else i.push(e)
s.push(i)}d=A.b([],d)
for(r=f.d,o=r.length,q=0;q<r.length;r.length===o||(0,A.h)(r),++q){g=r[q]
n=g.c
i=g.a
d.push([g.e,g.f,g.r,g.w,g.x,g.b,J.pi(B.i.gam(n),n.byteOffset,n.length),i.a,i.b,i.c,i.d,g.d])}r=f.fH()
o=f.a
return[c,s,d,r,o==null?e:o.cM()]},
fH(){var s,r,q,p,o,n,m,l
for(s=this.c,r=s.length,q=0,p=0;p<r;++p){o=s[p].as
o=o==null?null:o.d.length
q+=o==null?0:o}if(q===0)return null
n=new Float32Array(q)
for(m=0,p=0;p<s.length;s.length===r||(0,A.h)(s),++p){o=s[p].as
l=o==null?null:o.d
if(l==null)continue
B.o.bU(n,m,l)
m+=l.length}return n}}
A.aR.prototype={
siA(a){this.e=t.nE.a(a)}}
A.l0.prototype={
eJ(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i=this
for(s=i.d,r=s.ay,q=i.y,p=i.e,o=t.t,n=0;n<r.length;++n){m=r[n]
if(m.c!==p)continue
m=m.d
l=q.h(0,m)
if(l==null){l=A.b([],o)
q.m(0,m,l)
m=l}else m=l
B.a.j(m,n)}for(r=s.CW,q=i.z,n=0;n<r.length;++n){m=r[n].b
if(m.b!==p)continue
m=m.c
l=q.h(0,m)
if(l==null){l=A.b([],o)
q.m(0,m,l)
m=l}else m=l
B.a.j(m,n)}if(i.x)for(s=s.ch,r=s.length,q=i.a,k=0;k<s.length;s.length===r||(0,A.h)(s),++k){j=s[k]
if(j instanceof A.bm)p=j.db!=null
else p=!1
if(p)q.j(0,j.b)}},
hn(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e
t.lL.a(a)
s=this.f
if(s==null)return
for(r=a.length,q=this.d.CW,p=0;p<a.length;a.length===r||(0,A.h)(a),++p){o=a[p]
n=o.a
if(n<0||o.c.length===0)continue
if(!(n>=0&&n<q.length))return A.a(q,n)
m=q[n]
l=A.oV(o.c)
k=m.z?l.toUpperCase():l
j=A.zq(k)
i=o.f!=null
n=A.q8(k,m.at)
h=m.ax
if(h==null)h=1.15
g=i?60:m.k1
f=m.ay
A:{if(B.ak===f){e=j?1:-1
break A}if(B.al===f){e=j?-1:1
break A}if(B.f2===f){e=j?1:-1
break A}if(B.f3===f){e=j?-1:1
break A}e=0
break A}o.as=A.tz(s,k,e,n,h,g,i,m.y,m.w)}},
hP(m7,m8,m9,n0,n1,n2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9,i0,i1,i2,i3,i4,i5,i6,i7,i8,i9,j0,j1,j2,j3,j4,j5,j6,j7,j8,j9,k0,k1,k2,k3,k4,k5,k6,k7,k8,k9,l0,l1,l2,l3,l4,l5,l6,l7,l8,l9,m0,m1,m2,m3,m4,m5=this,m6=null
t.mm.a(m7)
s=m5.d
r=s.ay
q=t.bQ
p=A.N(r.length,m6,!1,q)
o=t.N
n=t.S
m=A.N(r.length,0,!1,n)
l=A.N(r.length,m6,!1,q)
k=A.b([],t.fw)
j=A.b([],t.oM)
q=t.aB
i=A.C(n,q)
h=A.C(n,q)
g=A.C(n,t.lc)
f=m8>=m9
e=f?0.75:2
q=s.f.a
d=q.length!==0?B.b.bF(512,Math.min(m8,30)):0
c=d>0?4096/d:0
b=f?0:2
a=n0>m8?n0:m8
a0=m5.CW=B.b.a8(1,a-m8)
a1=a+s.db
m5.w=!1
a2=new A.lb(a1,f)
a3=m5.Q
a3.a=a1
a4=new A.ld(p,k,a3,A.C(o,t.ct),m,l)
for(n=J.F(m7),a5=a1+1,a6=t.O,a7=s.CW,a8=m5.as,a9=a8.c,b0=t.Y,b1=t.gw,b2=c>0,b3=t.n,b4=m5.a,b5=n2===0,b6=6.283185307179586*(n2+0.5),b7=m5.at,b8=m5.ax,b9=t.t,c0=t.s,c1=s.d,c2=t.c3,c3=m5.e,s=s.cx,c4=m5.z,c5=m5.y;n.n();){c6=n.gp()
c7=A.b([],b9)
c8=c5.h(0,c6.gal())
if(c8==null)c8=B.m
c9=c8.length
d0=0
for(;d0<c8.length;c8.length===c9||(0,A.h)(c8),++d0){d1=c8[d0]
if(!(d1>=0&&d1<r.length))return A.a(r,d1)
d2=r[d1]
if(a2.$2(d2.cx,d2.cy))c7.push(d1)}c8=A.b([],b9)
c9=c4.h(0,c6.gal())
if(c9==null)c9=B.m
d2=c9.length
d0=0
for(;d0<c9.length;c9.length===d2||(0,A.h)(c9),++d0){d3=c9[d0]
if(!(d3>=0&&d3<a7.length))return A.a(a7,d3)
d4=a7[d3].b
if(a2.$2(d4.z,d4.Q))c8.push(d3)}if(c7.length===0&&c8.length===0)continue
d5=4096/c6.gaV()
c9=s.length
if(c3<c9){if(!(c3>=0))return A.a(s,c3)
d6=s[c3]}else d6=m6
d7=d6==null||d6 instanceof A.ca?m6:d6.cC(c6.gal())
c9=c6.gaL()
d2=A.b([],b9)
for(d4=c7.length,d0=0;d0<c7.length;c7.length===d4||(0,A.h)(c7),++d0){d1=c7[d0]
if(!(d1>=0&&d1<r.length))return A.a(r,d1)
if(r[d1].b==null)d2.push(d1)}c8=A.b([new A.aS(c9,d2,c8)],c2)
for(c9=c7.length,d0=0;d0<c7.length;c7.length===c9||(0,A.h)(c7),++d0){d1=c7[d0]
if(!(d1>=0&&d1<r.length))return A.a(r,d1)
d8=r[d1].b
if(d8!=null)c8.push(new A.aS(m5.fc(c6,d8,d7),A.b([d1],b9),B.m))}for(c7=c8.length,c9=d7!=null,d0=0;d0<c8.length;c8.length===c7||(0,A.h)(c8),++d0){d2=c8[d0]
d9=d2.b
e0=d2.c
for(d2=J.F(d2.a),d4=J.Y(e0),e1=J.Y(d9);d2.n();){e2={}
e3=d2.gp()
e4=e3.aK(c6)
if(c9&&e4.h(0,d7)!=null)e4.m(0,"$id",e4.h(0,d7))
a3.sae(e4)
e5=e3.gL()
A:{if(1===e5){e6="Point"
break A}if(2===e5){e6="LineString"
break A}e6="Polygon"
break A}a3.c=e6
e2.a=!1
e2.b=d5
e7=new A.lc(e2,m5,e3)
e8=new A.le(e2,m5,e7)
a3.sio(new A.l7(e2,m5,e7,m8,n1,n2))
for(e6=e1.gt(d9),e9=e3 instanceof A.dS;e6.n();){f0=e6.gp()
if(f0>>>0!==f0||f0>=r.length)return A.a(r,f0)
f1=r[f0]
f2=f1.f
B:{if(B.A===f2||B.K===f2){f3=e3.gL()===3
break B}if(B.t===f2){f3=!0
break B}if(B.r===f2){f3=f1.x?e3.gL()===3:e3.gL()!==1
break B}f3=m6}if(!f3||!f1.e.$1(a3))continue
f4=f1.a
if(f4!=null){e8.$0()
if(f4.r){f3=m5.c.h(0,A.yE(a3.b.h(0,"$id")))
a3.scZ(f3==null?B.e:f3)}f3=f4.a.$1(a3)
if(!(typeof f3=="number"))if(typeof f3=="string")f3=A.P(f3)
else if(A.H(f3))f3=f3?1:0
else f3=m6
if(f3==null)f3=0
f5=Math.max(0,f3)
f3=f4.b.$1(a3)
if(!(typeof f3=="number"))if(typeof f3=="string")f3=A.P(f3)
else if(A.H(f3))f3=f3?1:0
else f3=m6
if(f3==null)f3=0
f6=Math.max(0,f3)
f7=A.aO(f4.c.$1(a3))
if(f7==null)f7=B.eV
B.a.a2(b7)
B.a.a2(b8)
for(f8=0;f8<a9.length-1;){B.a.j(b7,a9[f8]);++f8
if(!(f8<a9.length))return A.a(a9,f8)
B.a.j(b8,a9[f8])}f3=g.h(0,f0)
if(f3==null){f3=f4.d
f9=B.b.a8(1,m8)
g0=new Float64Array(256)
g1=new Float64Array(256)
g2=new Float64Array(256)
g3=new Float64Array(256)
g4=new Float64Array(256)
g5=new Float64Array(256)
g6=new Float64Array(256)
g7=new Float64Array(256)
f3=new A.h2(f0,c1,f3,-f9/8192,new A.aV(g0),new A.aV(g1),new A.aV(g2),new A.aV(g3),new A.aV(g4),new A.aV(g5),new A.aV(g6),new A.aV(g7),new A.aV(new Float64Array(256)),A.b([],b9),A.b([],c0))
g.m(0,f0,f3)
f0=f3}else f0=f3
f3=a8.a
f9=f4.e.$1(a3)
if(!(typeof f9=="number"))if(typeof f9=="string")f9=A.P(f9)
else if(A.H(f9))f9=f9?1:0
else f9=m6
if(f9==null)f9=0
g0=B.b.a8(1,m8)
g8=3.141592653589793-b6/g0
g1=Math.cos(Math.atan(0.5*(Math.exp(g8)-Math.exp(-g8))))
g2=f4.f
g9=g2==null?m6:g2.$1(a3)
C:{if(typeof g9=="string"){g2=g9.length!==0
h0=g9}else{h0=m6
g2=!1}if(g2){g2=h0
break C}g2=m6
break C}f0.hH(0,f3,b7,b8,f5,f6,f7,g2,f9/(40075016.68557849*g1)*g0*4096)
a3.scZ(B.e)
continue}h1=a4.$2(f0,f1)
if(f2===B.A){e7.$0()
f3=h1.c
if(f3==null){f0=b4.v(0,f0)
f3=B.b.a8(1,m8)
f3=h1.c=new A.jq(A.rC(!1,!1,!1),f0,b5,n2===f3-1)
f0=f3}else f0=f3
m5.eY(f0,e2.b,b)
continue}e8.$0()
if(f2===B.t){h2=h1.e
if(h2==null){h2=A.b([],b3)
h1.siA(h2)}h3=new A.l6(m5,h2)
for(f8=0;f8<a9.length-1;){h4=a9[f8]*2;++f8
h5=a9[f8]*2
for(h6=h4;h6<h5;h6+=2)h3.$1(h6)
f0=!1
if(e3.gL()===3)if(h5-h4>=6){f0=a8.a
f3=f0.length
if(!(h4<f3))return A.a(f0,h4)
f9=f0[h4]
g0=h5-2
if(!(g0>=0&&g0<f3))return A.a(f0,g0)
if(f9===f0[g0]){f9=h4+1
if(!(f9<f3))return A.a(f0,f9)
f9=f0[f9]
g0=h5-1
if(!(g0>=0&&g0<f3))return A.a(f0,g0)
g0=f9!==f0[g0]
f0=g0}else f0=!0}if(f0)h3.$1(h4)}continue}h7=h1.d
if(h7==null){f0=new Float64Array(512)
h7=h1.d=new A.jY(A.rC(!0,f1.w,f1.y),f1.as,f1.z,f0)}for(f0=f1.x,f3=f1.Q,f9=f1.ay,g0=f1.ax,g1=f1.at,g2=f1.r,g3=f1.ch,g4=f9==null,g5=g0==null,g6=g1==null,g7=g3==null,f8=0;f8<a9.length-1;f8=h8){h4=a9[f8]
h8=f8+1
h5=a9[h8]
if(e3.gL()===2){h9=f3&&e9?e3.a:m6
i0=h9!=null&&h9.length>f8*2+1
i1=a8.a
if(b2)i1=A.tt(i1,h4,h5,c)
i2=b2?0:h4
i3=b2?i1.length/2|0:h5
i4=g7?m6:g3.$1(a3)
D:{if("round"===i4){i5=B.M
break D}if("square"===i4){i5=B.N
break D}if("butt"===i4){i5=B.n
break D}i5=g2
break D}i6=g6?m6:g1.$1(a3)
E:{if("round"===i6){i7=B.a7
break E}if("bevel"===i6){i7=B.O
break E}if("miter"===i6){i7=B.v
break E}i7=m6
break E}i8=g5?m6:g0.$1(a3)
if(!(typeof i8=="number"))if(typeof i8=="string")i8=A.P(i8)
else if(A.H(i8))i8=i8?1:0
else i8=m6
if(i8==null)i8=m6
i9=g4?m6:f9.$1(a3)
if(!(typeof i9=="number"))if(typeof i9=="string")i9=A.P(i9)
else if(A.H(i9))i9=i9?1:0
else i9=m6
if(i9==null)i9=m6
if(i0){j0=f8*2
if(!(j0<h9.length))return A.a(h9,j0)
j0=h9[j0]}else j0=f3?0:m6
if(i0){j1=f8*2+1
if(!(j1<h9.length))return A.a(h9,j1)
j1=h9[j1]/d5}else j1=0
h7.cl(i1,i2,i3,e,i5,i7,i8,i9,j0,j1)
continue}j2=h5-h4
if(j2<3)continue
i2=m5.ay
h2=j2+1
if(i2.length<h2*2)i2=m5.ay=new Float64Array(h2*4)
i3=j2*2
B.q.a7(i2,0,i3,a8.a,h4*2)
i2=m5.ay
i5=i2.length
if(0>=i5)return A.a(i2,0)
i7=i2[0]
i2.$flags&2&&A.x(i2)
if(!(i3>=0&&i3<i5))return A.a(i2,i3)
i2[i3]=i7;++i3
if(1>=i5)return A.a(i2,1)
i7=i2[1]
if(!(i3<i5))return A.a(i2,i3)
i2[i3]=i7
if(b2)j3=A.tt(i2,0,h2,c)
else j3=i2
if(b2)h2=j3.length/2|0
if(f0)h7.hK(j3,0,h2)
else h7.hJ(j3,0,h2,e,!0)}}for(e6=d4.gt(e0);e6.n();){e9=e6.gp()
j4={}
if(e9>>>0!==e9||e9>=a7.length)return A.a(a7,e9)
j5=a7[e9]
f0=j5.b
if(!f0.d.$1(a3))continue
j4.a=null
j6=A.yX(f0.e.$1(a3))
j7=j4.a=j6.a
j8=j6.b
f3=f0.f
j9=f3==null?"":A.W(f3.$1(a3))
if(A.oV(j7).length===0&&!B.d.v(j7,A.Q(57599))&&j9.length===0)continue
k0=A.v(f0.r.$1(a3))
k1=B.d.ap(k0,"line")
f6=(a7.length-1-e9)*4096
k2=A.wk(j5,a3)
f3=f0.at.$1(a3)
if(!(typeof f3=="number"))if(typeof f3=="string")f3=A.P(f3)
else if(A.H(f3))f3=f3?1:0
else f3=m6
k3=(f3==null?0:f3)*3.141592653589793/180
f3=f0.ax
if(f3.gk(0)===0&&j8==null)k4=m6
else{f9=A.C(o,a6)
for(g0=f3.$ti,f3=new A.a2(f3,f3.gk(0),g0.i("a2<y.E>")),g0=g0.i("y.E");f3.n();){g1=f3.d
if(g1==null)g1=g0.a(g1)
if(B.d.ap(g1,"$geometry:")){g2=$.pO.h(0,g1)
g2=g2==null?m6:g2.$1(a3)}else g2=a3.b.h(0,g1)
f9.m(0,g1,g2)}if(j8!=null)f9.m(0,"$format",j8)
k4=f9}if(e3.gL()===3&&!k1){e8.$0()
for(f0=A.za(a8),f3=f0.length,f9=f6+k2,k5=0;k5<f0.length;f0.length===f3||(0,A.h)(f0),++k5){g0=f0[k5]
k6=g0.a
k7=g0.b
if(k6<0||k7<0||k6>=4096||k7>=4096)continue
g0=new A.b5(e9,f9,j4.a,k6,k7,m6,j9,k3,!1,!0)
g0.sae(k4)
B.a.j(j,g0)}continue}if(e3.gL()===1){if(k1)continue
e8.$0()
for(e9=m5.dE(e9,f6+k2,j4.a,j9,k3),f0=e9.$ti,e9=new A.da(e9.a(),f0.i("da<1>")),f0=f0.c;e9.n();){f3=e9.b
if(f3==null)f3=f0.a(f3)
f3.sae(k4)
B.a.j(j,f3)}continue}e8.$0()
k8=Math.max(0,B.c.bL(f0.z-a1))
f3=k0==="line-center"
k9=f3?1/0:f0.w*8/B.b.a8(1,k8)/a0
l0=a3.a
a3.a=a5
f9=j5.c
g8=f9.$1(a3)
if(!(typeof g8=="number"))if(typeof g8=="string"){g0=A.P(g8)
g8=g0}else{if(A.H(g8))g0=g8?1:0
else g0=m6
g8=g0}l1=g8!=null&&isFinite(g8)?g8:16
a3.a=18
g8=f9.$1(a3)
if(!(typeof g8=="number"))if(typeof g8=="string"){f9=A.P(g8)
g8=f9}else{if(A.H(g8))f9=g8?1:0
else f9=m6
g8=f9}l2=g8!=null&&isFinite(g8)?g8:l1
a3.a=l0
l3=l2*4096/512/a0
if(k1&&j4.a.length!==0&&!f0.x){f9=A.b([],b0)
for(f8=0;f8<a9.length-1;){g0=a8.a
g1=a9[f8]*2;++f8
f9.push(new Float32Array(A.R(new Float64Array(g0.subarray(g1,A.bi(g1,a9[f8]*2,g0.length))))))}f0=f0.as==null?50:k2
g0=j4.a
g1=m5.dQ(j5,g0,j8)
g2=j5.cA
if(g2==null)g2=0.7853981633974483
l4=new A.cP(0,f6+f0,g0,k9,g1*l3,l3,g2,k4,f9,j9)
if(k0==="line"&&f9.length!==0){f0=i.h(0,e9)
if(f0==null){f0=A.b([],b1)
i.m(0,e9,f0)
e9=f0}else e9=f0
J.iN(e9,l4)}else B.a.A(j,m5.fQ(e9,l4,f3))
continue}if(!k1){l5=a8.a
for(f0=f0.as==null,f3=l5.length,f8=0;f8<a9.length-1;++f8){l6=a9[f8]*2
if(!(l6<f3))return A.a(l5,l6)
k6=l5[l6]
f9=l6+1
if(!(f9<f3))return A.a(l5,f9)
k7=l5[f9]
if(k6<0||k7<0||k6>=4096||k7>=4096)continue
f9=f0?50:k2
f9=new A.b5(e9,f6+f9,j4.a,k6,k7,m6,j9,k3,!1,!1)
f9.sae(k4)
B.a.j(j,f9)}continue}l7=j4.a.length===0&&!f0.y
if(j9.length===0)l8=0
else{f9=m5.b.h(0,j9)
f9=f9==null?m6:f9.a
if(f9==null)f9=0
g0=j5.k2.$1(a3)
if(!(typeof g0=="number"))if(typeof g0=="string")g0=A.P(g0)
else if(A.H(g0))g0=g0?1:0
else g0=m6
l8=f9*(g0==null?1:g0)*l3/24}f9=j4.a
f9=f9.length===0?0:m5.dQ(j5,f9,j8)*l3
l9=Math.max(f9,l8)
if(k0==="line"&&j4.a.length!==0){f3=h.h(0,e9)
if(f3==null){f3=A.b([],b1)
h.m(0,e9,f3)
e9=f3}else e9=f3
f0=f0.as==null?50:k2
f3=j4.a
f9=j5.cA
if(f9==null)f9=0.7853981633974483
g0=A.b([],b0)
for(f8=0;f8<a9.length-1;){g1=a8.a
g2=a9[f8]*2;++f8
g0.push(new Float32Array(A.R(new Float64Array(g1.subarray(g2,A.bi(g2,a9[f8]*2,g1.length))))))}J.iN(e9,new A.cP(k3,f6+f0,f3,k9,l9,l3,f9,k4,g0,j9))
continue}f0=j5.cA
if(f0==null)f0=0.7853981633974483
m5.f2(k9,l9,l3,f0,f3,new A.l8(j4,j,e9,f6,j5,k2,j9,l7,k3,k4),j4.a.length!==0)}}}}for(s=new A.bG(h,h.$ti.i("bG<1,2>")).gt(0),r=t.gE;s.n();){m0={}
n=s.d
n.toString
m0.a=null
m0.a=n.a
m1=A.C(o,r)
for(n=A.tB(n.b),a5=n.length,d0=0;d0<n.length;n.length===a5||(0,A.h)(n),++d0){i1=n[d0]
m5.f1(i1.d,i1.e,i1.f,i1.r,!1,new A.l9(m0,m5,m1,i1,j),i1.x)}}for(s=new A.bG(i,i.$ti.i("bG<1,2>")).gt(0);s.n();){n=s.d
m2=n.a
m1=A.C(o,r)
for(n=A.tB(n.b),a5=n.length,d0=0;d0<n.length;n.length===a5||(0,A.h)(n),++d0)B.a.A(j,m5.fR(m2,n[d0],m1))}m3=A.b([],t.hD)
B.a.aG(k,new A.la())
for(s=k.length,d0=0;d0<k.length;k.length===s||(0,A.h)(k),++d0){h1=k[d0]
h2=h1.e
if(h2!=null&&h2.length!==0){r=new Float32Array(A.R(h2))
B.a.j(m3,new A.dj(h1.a,new A.eE(m6,r,m6,new Uint16Array(0),m6,m6,m6),h1.b))}r=h1.c
if(r==null)m4=m6
else{r=r.a
r.cB()
r=r.at
m4=r}if(m4==null){r=h1.d
if(r==null)m4=m6
else{r=r.a
r.cB()
r=r.at
m4=r}}if(m4==null)continue
for(r=m4.length,o=h1.a,n=h1.b,k5=0;k5<m4.length;m4.length===r||(0,A.h)(m4),++k5)B.a.j(m3,new A.dj(o,m4[k5],n))}m5.hn(j)
s=A.b([],t.dY)
for(r=new A.cN(g,g.r,g.e,g.$ti.i("cN<2>")),o=m5.x;r.n();){n=r.d
n=n.i4(q.length!==0?Math.max(B.b.bF(128,Math.min(m8,30)),2):0,o)
if(n!=null)s.push(n)}return new A.dk(o?m5.hs(m3,m8,a1):m6,m3,j,s)},
hs(a,b,c){var s
t.ke.a(a)
s=this.d
if(s.f.a.length===0)return A.qT(s,a,0,c)
return A.qT(s,a,Math.max(B.b.bF(128,Math.min(b,30)),2),c)},
d5(a0,a1,a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a
t.hi.a(a5)
t.hF.a(a6)
s=a7?0.6*a2:0
if(a6==null){r=A.b([],t.Y)
for(q=this.as,p=q.c,o=0;o<p.length-1;){n=q.a
m=p[o]*2;++o
r.push(new Float32Array(A.R(new Float64Array(n.subarray(m,A.bi(m,p[o]*2,n.length))))))}}else r=a6
q=r.length
p=2*a2
n=t.Y
l=0
for(;l<r.length;r.length===q||(0,A.h)(r),++l){k=r[l]
m=a4?A.b([k],n):A.tq(k)
j=m.length
i=0
for(;i<m.length;m.length===j||(0,A.h)(m),++i){h=m[i]
g=a4?A.oe(h,A.mX(h)/2,1/0,a1,s,a3):A.tA(h,a0,a1,p,s,a3,this.CW)
for(f=g.length,e=0;e<g.length;g.length===f||(0,A.h)(g),++e){d=g[e]
c=d.a
b=d.b
if(a4)a=!(c>=0&&c<4096&&b>=0&&b<4096)
else a=!1
if(a)continue
a5.$3(c,b,d.c)}}}},
f2(a,b,c,d,e,f,g){return this.d5(a,b,c,d,e,f,null,g)},
f1(a,b,c,d,e,f,g){return this.d5(a,b,c,d,e,f,g,!0)},
fc(a,b,c){var s,r,q,p,o,n,m,l
t.u.a(b)
s=a.gaL()
r=A.eC(s.length,new A.l2(this,s,a,c,b),!0,t.i)
q=s.length
p=J.pq(q,t.S)
for(o=0;o<q;++o)p[o]=o
B.a.aG(p,new A.l3(r))
n=A.b([],t.d)
for(m=p.length,l=0;l<p.length;p.length===m||(0,A.h)(p),++l){o=p[l]
if(!(o<s.length))return A.a(s,o)
n.push(s[o])}return n},
hi(a){var s,r,q,p,o=this.as,n=o.a
for(o=o.b,s=n.length,r=n.$flags|0,q=0;q<o;++q){if(!(q<s))return A.a(n,q)
p=n[q]
r&2&&A.x(n)
n[q]=p*a}},
eY(b2,b3,b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6=this,a7={},a8=a6.as,a9=a8.a,b0=a8.b,b1=a6.ay
if(b0>b1.length)b0=a6.ay=new Float64Array(b0*2)
else b0=b1
s=b4*b4
r=s*4
a7.a=0
a7.b=-1
b1=a6.ch
B.a.a2(b1)
q=new A.l1(a7,a6,b2,b0)
for(a8=a8.c,p=a9.length,o=b0.length,n=b0.$flags|0,m=0;m<a8.length-1;){l=a8[m];++m
k=a8[m]
j=a7.a
for(i=j,h=l;h<k;++h){g=h*2
if(!(g<p))return A.a(a9,g)
f=a9[g]*b3;++g
if(!(g<p))return A.a(a9,g)
e=a9[g]*b3
if(i>j){g=i*2
d=g-2
if(!(d>=0&&d<o))return A.a(b0,d)
c=f-b0[d];--g
if(!(g>=0&&g<o))return A.a(b0,g)
b=e-b0[g]
a=c*c+b*b
if(a===0||a<s)continue}g=i*2
n&2&&A.x(b0)
if(!(g<o))return A.a(b0,g)
b0[g]=f;++g
if(!(g<o))return A.a(b0,g)
b0[g]=e
a0=i+1
a7.a=a0
i=a0}a1=i-j
a2=0
if(a1>=3){g=i*2
d=g-2
if(!(d>=0&&d<o))return A.a(b0,d)
a3=b0[d];--g
if(!(g>=0&&g<o))return A.a(b0,g)
a4=b0[g]
for(h=j;h<i;++h,a4=e,a3=f){g=h*2
if(!(g<o))return A.a(b0,g)
f=b0[g];++g
if(!(g<o))return A.a(b0,g)
e=b0[g]
a2+=a3*e-f*a4}}a5=a2>0
if(a1<3||Math.abs(a2)*0.5<r){a7.a=j
if(a5)q.$0()
continue}if(a5){i=a7.b
if(i>=0){b2.dY(b0,i,j,b1)
B.a.a2(b1)}a7.b=j}else{i=a7.b
if(i>=0)B.a.j(b1,j-i)
else a7.a=j}}q.$0()},
dE(a,b,c,d,e){return new A.cr(this.h5(a,b,c,d,e),t.an)},
h5(a,b,c,d,e){var s=this
return function(){var r=a,q=b,p=c,o=d,n=e
var m=0,l=2,k=[],j,i,h,g,f,a0,a1
return function $async$dE(a2,a3,a4){if(a3===1){k.push(a4)
m=l}for(;;)switch(m){case 0:a0=s.as
a1=a0.a
j=a1.length,i=0
case 3:if(!(h=i+1,h<a0.b)){m=5
break}if(!(i<j)){A.a(a1,i)
m=1
break}g=a1[i]
if(!(h<j)){A.a(a1,h)
m=1
break}f=a1[h]
if(g<0||f<0||g>=4096||f>=4096){m=4
break}m=6
return a2.b=new A.b5(r,q,p,g,f,null,o,n,!1,!1),1
case 6:case 4:i+=2
m=3
break
case 5:case 1:return 0
case 2:return a2.c=k.at(-1),3}}}},
dQ(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=f.r
if(c!=null&&e!=null){s=f.fE(a,b,c,e)
if(s!=null)return s}r=A.oV(b)
q=a.z?r.toUpperCase():r
p=A.q8(q,a.at)
if(e!=null){o=e.ee(a.y)
n=A.b([],t.t)
m=A.X(new A.an(q),t.J.i("i.E"))
m=A.ty(m)
l=m.length
k=0
for(;k<m.length;m.length===l||(0,A.h)(m),++k){j=m[k]
if(j>=0)n.push(j)}if(e.eq(o,A.dL(n,0,null))){for(m=n.length,l=e.r,i=o-512,s=0,h=0,k=0;k<n.length;n.length===m||(0,A.h)(n),++k){j=n[k]
if(!(i>=0&&i<l.length))return A.a(l,i)
g=l[i].h(0,j)
if(g!=null){s+=g.r/24+p;++h}}return h===0?0:s-p}f.w=!0}n=f.cx
m=n.h(0,b)
if(m==null){m=new A.l5(f,b,q,a,p).$0()
n.m(0,b,m)
n=m}else n=m
return n},
fE(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=A.b([],t.t),a0=A.X(new A.an(a2),t.J.i("i.E"))
a0=A.ty(a0)
s=a0.length
r=0
for(;r<a0.length;a0.length===s||(0,A.h)(a0),++r){q=a0[r]
if(q>=0)a.push(q)}p=A.q8(A.oV(a2),a1.at)
for(a0=a4.r,s=a1.z,o=a1.y,n=t.j,m=t.N,l=0,k=0,j=0;i=a.length,j<i;++j){h=a[j]
if(h===57344&&j+1<i){++j
if(!(j<i))return A.a(a,j)
k=a[j]-57600
continue}if(h===57599)continue
i=a3.length
if(k<i){if(!(k>=0))return A.a(a3,k)
g=a3[k]}else g=null
i=n.b(g)
if(i){f=A.fw(J.al(g,0))
if(f==null)f=null
e=f==null?1:f}else e=1
d=a4.ee(i&&n.b(J.al(g,1))?J.cw(n.a(J.al(g,1)),m):o)
if(s){c=new A.an(A.Q(h).toUpperCase()).gt(0)
if(!c.n())A.t(A.aI())
q=c.gp()}else q=h
if(!a4.eq(d,A.Q(q))){this.w=!0
return null}i=d-512
if(!(i>=0&&i<a0.length))return A.a(a0,i)
b=a0[i].h(0,q)
if(b!=null)l+=(b.r/24+p)*e}return l},
dK(a,b,c,d){var s,r,q,p,o,n,m,l
t.l0.a(a)
s=b.d/2
r=b.c
q=a.h(0,r)
if(q==null){q=A.b([],t.G)
a.m(0,r,q)}for(r=q.length,p=s*s,o=0;o<r;++o){n=q[o]
m=n.a-c
l=n.b-d
if(m*m+l*l<p)return!0}B.a.j(q,new A.f(c,d))
return!1},
dr(a7,a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=new A.l4(this,t.jT.a(b0),a8),a3=A.b([],t.oM),a4=a8.f,a5=0.6*a4,a6=2*a4
for(a4=a8.x,s=a4.length,r=a8.b,q=a8.c,p=a8.y,o=a8.w,n=a8.d,m=a8.e,l=a8.r,k=t.Y,j=0;j<a4.length;a4.length===s||(0,A.h)(a4),++j){i=a4[j]
h=a9?A.b([i],k):A.tq(i)
g=h.length
f=0
for(;f<h.length;h.length===g||(0,A.h)(h),++f){e=h[f]
d=a9?A.oe(e,A.mX(e)/2,1/0,m,a5,l):A.tA(e,n,m,a6,a5,l,this.CW)
c=d.length
b=0
for(;b<d.length;d.length===c||(0,A.h)(d),++b){a=d[b]
a0=a.a
a1=a.b
if(a9)a=!(a0>=0&&a0<4096&&a1>=0&&a1<4096)
else a=!1
if(a)continue
if(a2.$2(a0,a1))continue
a=new A.b5(a7,r,q,a0,a1,e,p,0,!1,!1)
a.sae(o)
B.a.j(a3,a)}}}return a3},
fQ(a,b,c){return this.dr(a,b,c,null)},
fR(a,b,c){return this.dr(a,b,!1,c)},
sic(a){this.b=t.a.a(a)},
seG(a){this.c=t.hu.a(a)}}
A.lb.prototype={
$2(a,b){var s=this.a
if(b>s)s=this.b||a<s+1
else s=!1
return s},
$S:14}
A.ld.prototype={
$2(a,b){var s,r,q,p,o,n,m,l,k,j=this,i=b.CW,h=i.length
if(h===0){h=j.a
if(!(a>=0&&a<h.length))return A.a(h,a)
s=h[a]
if(s==null){s=new A.aR(a,null)
B.a.m(h,a,s)
B.a.j(j.b,s)}return s}r=[]
for(q=j.c,p=0;p<i.length;i.length===h||(0,A.h)(i),++p){o=i[p]
if(B.d.ap(o,"$geometry:")){n=$.pO.h(0,o)
n=n==null?null:n.$1(q)}else n=q.b.h(0,o)
r.push(n)}m=""+a+"|"+B.a.ac(r,"\x01")
h=j.d
s=h.h(0,m)
if(s!=null)return s
l=B.a.v(i,"$id")?4096:64
q=j.e
if(!(a>=0&&a<q.length))return A.a(q,a)
n=q[a]
if(n>=l){h=j.f
if(!(a<h.length))return A.a(h,a)
h=h[a]
h.toString
return h}B.a.m(q,a,n+1)
q=A.C(t.N,t.O)
for(k=0;k<i.length;++k){if(!(k<r.length))return A.a(r,k)
n=r[k]
if(n!=null)q.m(0,i[k],n)}s=new A.aR(a,q)
B.a.m(j.f,a,s)
h.m(0,m,s)
B.a.j(j.b,s)
return s},
$S:99}
A.lc.prototype={
$0(){var s=this.a
if(s.a)return
s.a=!0
s=this.b.as
s.b=0
B.a.a2(s.c)
this.c.aZ(s)},
$S:0}
A.le.prototype={
$0(){var s,r
this.c.$0()
s=this.a
r=s.b
if(r!==1){this.b.hi(r)
s.b=1}},
$S:0}
A.l7.prototype={
$0(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this
c.c.$0()
s=c.a.b/4096
r=B.b.a8(1,c.d)
q=A.b([],t.b)
for(p=c.b.as,o=p.c,n=c.e,m=c.f,l=t.n,k=0;k<o.length-1;){j=A.b([],l)
if(!(k<o.length))return A.a(o,k)
i=o[k];++k
for(;;){if(!(k<o.length))return A.a(o,k)
if(!(i<o[k]))break
h=p.a
g=i*2
f=h.length
if(!(g<f))return A.a(h,g)
e=h[g];++g
if(!(g<f))return A.a(h,g)
d=3.141592653589793*(1-2*((m+h[g]*s)/r))
B.a.A(j,A.b([(n+e*s)/r*360-180,Math.atan((Math.exp(d)-Math.exp(-d))/2)*180/3.141592653589793],l));++i}q.push(j)}return q},
$S:100}
A.l6.prototype={
$1(a){var s,r,q,p=this.a.as.a,o=p.length
if(!(a<o))return A.a(p,a)
s=p[a]
r=a+1
if(!(r<o))return A.a(p,r)
q=p[r]
if(s<0||q<0||s>=4096||q>=4096)return
p=this.b
B.a.j(p,s)
B.a.j(p,q)},
$S:42}
A.l8.prototype={
$3(a,b,c){var s=this,r=s.e.b.as==null?50:s.f,q=s.a.a,p=s.w,o=s.x
if(p)o=c+o
p=new A.b5(s.c,s.d+r,q,a,b,null,s.r,o,p,!0)
p.sae(s.y)
return B.a.j(s.b,p)},
$S:43}
A.l9.prototype={
$3(a,b,c){var s,r=this,q=r.d
if(r.b.dK(r.c,q,a,b))return
s=new A.b5(r.a.a,q.b,q.c,a,b,null,q.y,q.a,!1,!0)
s.sae(q.w)
B.a.j(r.e,s)},
$S:43}
A.la.prototype={
$2(a,b){var s=t.ct
return s.a(a).a-s.a(b).a},
$S:102}
A.l2.prototype={
$1(a){var s,r=this,q=r.b
if(!(a<q.length))return A.a(q,a)
s=q[a].aK(r.c)
q=r.d
if(q!=null&&s.h(0,q)!=null)s.m(0,"$id",s.h(0,q))
q=r.a.Q
q.sae(s)
q=A.E(r.e.$1(q))
return q==null?0:q},
$S:17}
A.l3.prototype={
$2(a,b){var s,r,q,p
A.D(a)
A.D(b)
s=this.a
r=s.length
if(!(a>=0&&a<r))return A.a(s,a)
q=s[a]
if(!(b>=0&&b<r))return A.a(s,b)
p=B.c.ab(q,s[b])
return p!==0?p:B.b.ab(a,b)},
$S:35}
A.l1.prototype={
$0(){var s=this,r=s.a,q=r.b
if(q>=0)s.c.dY(s.d,q,r.a,s.b.ch)
r.b=-1
B.a.a2(s.b.ch)},
$S:0}
A.l5.prototype={
$0(){var s,r=this,q=r.a.f
if(q==null)return new A.an(r.b).gk(0)*0.55
s=r.d
s=A.tz(q,r.c,0,r.e,1.2,1/0,!0,s.y,s.w)
s=s==null?null:s.e
return s==null?new A.an(r.b).gk(0)*0.55:s},
$S:103}
A.l4.prototype={
$2(a,b){var s=this.b
return s!=null&&this.a.dK(s,this.c,a,b)},
$S:14}
A.cP.prototype={
siH(a){this.x=t.iu.a(a)}}
A.oS.prototype={
$3$end(a,b,c){var s,r,q=a+":",p=b.length
if(c){s=p-2
if(!(s>=0))return A.a(b,s)
s=b[s]
r=p-1
if(!(r>=0))return A.a(b,r)
r=q+A.v(s)+":"+A.v(b[r])
q=r}else{if(0>=p)return A.a(b,0)
s=b[0]
if(1>=p)return A.a(b,1)
s=q+A.v(s)+":"+A.v(b[1])
q=s}return q},
$S:104}
A.or.prototype={
$1(a){return Math.floor(a*2+0.5)/2},
$S:4}
A.oq.prototype={
$0(){var s=this.a.a
if(s!=null&&s.length>=4)B.a.j(this.b,new Float32Array(A.R(s)))},
$S:0}
A.ml.prototype={
$1(a){var s=this.a,r=a*2
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
$S:17}
A.mm.prototype={
$1(a){var s=this.a,r=a*2+1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
$S:17}
A.mk.prototype={
$4(a,b,c,d){var s=c-a,r=d-b
return Math.sqrt(s*s+r*r)},
$S:105}
A.aY.prototype={
gaY(){var s=this.d,r=this.a
return s>r?s:r},
D(a,b){var s=this
if(b==null)return!1
return b instanceof A.aY&&b.a===s.a&&b.b===s.b&&b.c===s.c&&b.gaY()===s.gaY()},
gR(a){var s=this,r=s.a
return(r*4194304+s.b)*4194304+s.c+s.gaY()-r},
q(a){var s=this,r=s.a,q=""+r+"/",p=""+s.b,o=""+s.c
return s.gaY()>r?q+p+"/"+o+"@"+s.gaY():q+p+"/"+o}}
A.mq.prototype={
$3(a,b,c){var s,r,q=this.b,p=a*2,o=this.c,n=p+o,m=J.o(q),l=m.h(q,n),k=b*2,j=m.h(q,k+o)
n=m.h(q,n)
s=1-o
p+=s
r=m.h(q,p)+(m.h(q,k+s)-m.h(q,p))*((c-l)/(j-n))
q=t.n
p=this.a.a
if(o===0)B.a.A(p,A.b([c,r],q))
else B.a.A(p,A.b([r,c],q))},
$S:106}
A.iy.prototype={$ibr:1,
gal(){return this.a},
gaV(){return this.b},
gaL(){return this.c}}
A.ix.prototype={
aK(a){return this.b},
aZ(a){var s,r,q,p,o,n,m,l=this.a===1
if(l)B.a.j(a.c,a.b>>>1)
for(s=this.c,r=s.length,l=!l,q=a.c,p=0;p<s.length;s.length===r||(0,A.h)(s),++p){o=s[p]
if(l)B.a.j(q,a.b>>>1)
for(n=J.o(o),m=0;m<n.gk(o);m+=2)a.bd(n.h(o,m),n.h(o,m+1))}B.a.j(q,a.b>>>1)},
$ibN:1,
gL(){return this.a}}
A.lk.prototype={
i1(a,b,c){var s,r=this,q=r.w
if(q!=null){s=r.r
s=s==null?null:!s.gdI()
s=s===!0}else s=!0
if(s)return null
return q+"/"+r.c+"/"+a+"/"+b+"/"+c+r.e},
bQ(a,b,c){var s=0,r=A.aC(t.nh),q,p=this,o,n
var $async$bQ=A.aD(function(d,e){if(d===1)return A.az(e,r)
for(;;)switch(s){case 0:if(!p.b.i8(a,b,c)){q=new Uint8Array(0)
s=1
break}o=p.i1(a,b,c)
s=3
return A.a0(p.bG(a,b,c),$async$bQ)
case 3:n=e
if(o!=null&&n!=null&&!B.j.gC(n))A.qg(o,n).bl(new A.ll(),new A.lm(),t.o)
q=n
s=1
break
case 1:return A.aA(q,r)}})
return A.aB($async$bQ,r)},
bG(a,b,c){var s=0,r=A.aC(t.nh),q,p=this,o,n,m,l,k
var $async$bG=A.aD(function(d,e){if(d===1)return A.az(e,r)
for(;;)switch(s){case 0:k=p.r
if(k!=null){q=k.aB(a,b,c)
s=1
break}o=p.b.c?B.b.a8(1,a)-1-c:c
s=3
return A.a0(A.oF(p.d,p.a,a,b,o,p.f),$async$bG)
case 3:n=e
m=n.a
l=n.b
o=l.a
if(o===204){q=new Uint8Array(0)
s=1
break}if(o===404){q=null
s=1
break}if(o!==200)throw A.e(A.qU(o,m))
q=l.b
s=1
break
case 1:return A.aA(q,r)}})
return A.aB($async$bG,r)}}
A.ll.prototype={
$1(a){},
$S:107}
A.lm.prototype={
$1(a){},
$S:21}
A.aV.prototype={
aJ(a,b){var s,r,q,p=this,o=p.b+2
if(o>p.a.length)p.bz(o)
o=p.a
s=p.b
r=p.b=s+1
o.$flags&2&&A.x(o)
q=o.length
if(!(s<q))return A.a(o,s)
o[s]=a
p.b=r+1
if(!(r<q))return A.a(o,r)
o[r]=b},
av(a,b,c,d){var s,r,q,p=this,o=p.b+4
if(o>p.a.length)p.bz(o)
o=p.a
s=p.b
r=p.b=s+1
o.$flags&2&&A.x(o)
q=o.length
if(!(s<q))return A.a(o,s)
o[s]=a
s=p.b=r+1
if(!(r<q))return A.a(o,r)
o[r]=b
r=p.b=s+1
if(!(s<q))return A.a(o,s)
o[s]=c
p.b=r+1
if(!(r<q))return A.a(o,r)
o[r]=d},
bz(a){var s,r=this.a,q=r.length*2
while(q<a)q*=2
s=new Float64Array(q)
B.q.Z(s,0,this.b,r)
this.a=s},
gk(a){return this.b}}
A.jO.prototype={
j(a,b){var s=this,r=s.b,q=s.a,p=q.length
if(r===p){p=new Uint32Array(p*2)
B.i.Z(p,0,r,q)
s.a=p
r=p}else r=q
q=s.b++
r.$flags&2&&A.x(r)
if(!(q<r.length))return A.a(r,q)
r[q]=b},
gk(a){return this.b}}
A.p6.prototype={
$2(a,b){t.a2.a(b)},
$S:108}
A.p5.prototype={
$1(a){return this.a.$1(a.bn())},
$S:109}
A.p7.prototype={
$1(a){t.a.a(a)
this.a.sic(a)
return a},
$S:110}
A.pe.prototype={
$1(a){var s=this.a
return A.qO(a,s.f,s.w,s.r,s.x,s.cC(""))},
$S:111}
A.p8.prototype={
$0(){var s=0,r=A.aC(t.my),q,p=2,o=[],n=this,m,l,k,j
var $async$$0=A.aD(function(a,b){if(a===1){o.push(b)
s=p}for(;;)switch(s){case 0:k=n.a
if(typeof k!="string"){q=n.b.$1(k)
s=1
break}p=4
s=7
return A.a0(n.c.bp(k,n.d.e.c),$async$$0)
case 7:m=b
k=n.b.$1(B.h.eb(B.u.e9(m.b),null))
q=k
s=1
break
p=2
s=6
break
case 4:p=3
j=o.pop()
k=A.qO(null,null,null,null,!1,null)
q=k
s=1
break
s=6
break
case 3:s=2
break
case 6:case 1:return A.aA(q,r)
case 2:return A.az(o.at(-1),r)}})
return A.aB($async$$0,r)},
$S:112}
A.pa.prototype={
$1(a){var s=0,r=A.aC(t.p),q,p=this,o,n,m,l,k,j,i
var $async$$1=A.aD(function(b,c){if(b===1)return A.az(c,r)
for(;;)switch(s){case 0:n=a.a
m=a.b
l=a.c
k=(n*4194304+m)*4194304+l
j=p.b
i=j.aA(0,k)
if(i!=null){j.m(0,k,i)
q=i
s=1
break}s=3
return A.a0(p.a.a.bQ(n,m,l),$async$$1)
case 3:o=c
if(o==null)o=new Uint8Array(0)
j.m(0,k,o)
if(j.a>24)j.aA(0,new A.aq(j,A.u(j).i("aq<1>")).gu(0))
q=o
s=1
break
case 1:return A.aA(q,r)}})
return A.aB($async$$1,r)},
$S:113}
A.pb.prototype={
$1(a){var s=0,r=A.aC(t.mm),q,p=this,o,n,m,l,k,j
var $async$$1=A.aD(function(b,c){if(b===1)return A.az(c,r)
for(;;)switch(s){case 0:l=p.a
k=l.b
s=k!=null?3:4
break
case 3:s=5
return A.a0(k,$async$$1)
case 5:q=c.aB(a.a,a.b,a.c)
s=1
break
case 4:k=a.a
l=l.c
s=k>l?6:7
break
case 6:o=k-l
n=new A.aY(l,B.b.cW(a.b,o),B.b.cW(a.c,o),0)
j=A
s=8
return A.a0(p.$1(n),$async$$1)
case 8:q=j.zg(c,n,a)
s=1
break
case 7:s=9
return A.a0(p.b.$1(a),$async$$1)
case 9:m=c
if(m.length===0){q=B.ac
s=1
break}l=p.c
if(l instanceof A.dM&&l.w)l=A.yz(m)
else{l=A.vx(m).a
l=new A.ba(l,A.u(l).i("ba<2>"))}q=l
s=1
break
case 1:return A.aA(q,r)}})
return A.aB($async$$1,r)},
$S:114}
A.pc.prototype={
$1(b7){var s=0,r=A.aC(t.c_),q,p=2,o=[],n=this,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6
var $async$$1=A.aD(function(b8,b9){if(b8===1){o.push(b9)
s=p}for(;;)switch(s){case 0:b1=b7 instanceof A.f1
b2=b1?b7.b:null
if(b1){a=A.C(t.O,t.U)
for(b1=b2.length,a0=0;a0<b2.length;b2.length===b1||(0,A.h)(b2),++a0){a1=b2[a0]
a.m(0,a1.a,a1.b)}n.b.seG(a)
q=null
s=1
break}a2={}
m=null
a2.a=a2.b=null
b1=b7 instanceof A.ee
a1=null
a3=null
if(b1){m=b7.a
a4=b7.b
a2.b=a4
a5=b7.c
a2.a=a5
a3=a5
a1=a4}s=b1?3:4
break
case 3:b1=n.a
b1.c=a3
p=6
l=Date.now()
s=9
return A.a0(n.c.$1(a1),$async$$1)
case 9:k=b9
a=a1.a
a3=a1.b
a1=a1.c
a6=Date.now()
a7=l
if(typeof a7!=="number"){q=A.ah(a7)
s=1
break}a8=t.z
A.rw("vmap.tile.fetched",A.eB(["id",""+a+"/"+a3+"/"+a1,"ms",""+B.c.F(a6-a7,1000)],a8,a8))
j=Date.now()
a7=n.b
i=new A.pd(a2,b1,a7,k)
a=n.d
s=a!=null?10:11
break
case 10:s=12
return A.a0(a,$async$$1)
case 12:case 11:h=J.de(k)?new A.dk(null,B.ab,B.cI,B.cJ):i.$0()
s=J.pk(k)&&a7.w&&n.e!=null?13:14
break
case 13:g=0
a=t.o
b1=n.e
case 15:a1=g
if(typeof a1!=="number"){q=a1.br()
s=1
break}if(!(a1<300&&b1.w.a-b1.x.a>0)){s=16
break}s=17
return A.a0(A.uX(B.aC,a),$async$$1)
case 17:a1=g
if(typeof a1!=="number"){q=a1.bT()
s=1
break}g=a1+1
s=15
break
case 16:h=i.$0()
case 14:a=a2.b
b1=Date.now()
a1=j
if(typeof a1!=="number"){q=A.ah(a1)
s=1
break}A.rw("vmap.tile.built",A.eB(["id",""+a.a+"/"+a.b+"/"+a.c,"ms",""+B.c.F(b1-a1,1000)],a8,a8))
a8=m
a1=h
q=new A.hQ(a1,a8)
s=1
break
p=2
s=8
break
case 6:p=5
b3=o.pop()
f=A.b2(b3)
a=m
b1=A.v(f)
q=new A.hS(b1,a)
s=1
break
s=8
break
case 5:s=2
break
case 8:case 4:e=null
b1=b7 instanceof A.er
if(b1)e=b7
s=b1?18:19
break
case 18:p=21
a=e.a
b6=A
s=24
return A.a0(n.c.$1(e.b),$async$$1)
case 24:b1=b6.zb(b9,n.f,n.r,e.c,e.d,e.e,e.f,e.r)
q=new A.eq(b1,a)
s=1
break
p=2
s=23
break
case 21:p=20
b4=o.pop()
a=e.a
q=new A.eq(B.cR,a)
s=1
break
s=23
break
case 20:s=2
break
case 23:case 19:d=null
b1=b7 instanceof A.eb
if(b1)d=b7
s=b1?25:26
break
case 25:c=d.c
p=28
b1=n.a.b
s=b1==null?31:33
break
case 31:b9=null
s=32
break
case 33:s=34
return A.a0(b1,$async$$1)
case 34:b9=b9.x
case 32:b=b9
a=null
switch(d.b.a){case 0:b1=d.a
a1=b
if(a1==null)a1=null
else{a3=A.D(c)
b0=a1.f.h(0,a3)
a1=b0==null?null:b0.f+1}a=new A.eh(a1,b1)
break
case 1:b1=d.a
a1=b
a=new A.dp(A.tc(a1==null?null:a1.e4(c)),b1)
break
case 2:b1=d.a
a1=b
a=new A.dp(A.tc(a1==null?null:a1.im(c,d.d,d.e)),b1)
break}a=a
q=a
s=1
break
p=2
s=30
break
case 28:p=27
b5=o.pop()
a=d.b===B.a2?new A.eh(null,d.a):new A.dp(B.cT,d.a)
q=a
s=1
break
s=30
break
case 27:s=2
break
case 30:case 26:case 1:return A.aA(q,r)
case 2:return A.az(o.at(-1),r)}})
return A.aB($async$$1,r)},
$S:115}
A.pd.prototype={
$0(){var s=this,r=s.a,q=r.b,p=s.b,o=p.b,n=r.a
o=o==null?Math.max(n,18):n
q=s.c.hP(s.d,q.a,o,q.gaY(),q.b,q.c)
r=r.b
p=p.b==null?1024:16777216
q.ik(r.a,r.b,r.c,p)
return q},
$S:116}
A.p9.prototype={
$1(a){t.c_.a(a)
if(a!=null)this.a.$1(a)},
$S:117}
A.p0.prototype={
$1(a){var s,r,q,p=null,o=A.b0(a).data,n=o==null?p:A.pS(t.dM.a(o))
o=this.a
s=o.a
if(s!=null){o=A.u(s)
o.c.a(n)
r=s.b
if(r>=4)A.t(s.f7())
if((r&1)!==0)s.cd(n)
else if((r&3)===0)s.fv().j(0,new A.d1(n,o.i("d1<1>")))
return p}r=t.cI
q=new A.dQ(p,p,p,p,r)
o.a=q
o=this.b
o.postMessage(null)
n.toString
A.iK(n,new A.p_(o),new A.dU(q,r.i("dU<1>")))},
$S:118}
A.p_.prototype={
$1(a){var s=A.b([],t.kG),r=A.pV(a,s)
this.a.postMessage(r,s)},
$S:12};(function aliases(){var s=J.cd.prototype
s.eH=s.q
s=A.y.prototype
s.d0=s.a7})();(function installTearOffs(){var s=hunkHelpers._static_2,r=hunkHelpers._instance_1i,q=hunkHelpers._static_1,p=hunkHelpers._static_0,o=hunkHelpers._instance_2u,n=hunkHelpers._instance_0u,m=hunkHelpers._instance_1u,l=hunkHelpers._instance_0i
s(J,"xz","vk",119)
r(A.b8.prototype,"ge8","v",10)
r(A.c9.prototype,"ge8","v",10)
q(A,"ym","wo",24)
q(A,"yn","wp",24)
q(A,"yo","wq",24)
p(A,"tp","ye",0)
s(A,"yp","xY",19)
o(A.L.prototype,"gfi","fj",19)
var k
n(k=A.d0.prototype,"gdw","bC",0)
n(k,"gdz","bD",0)
n(k=A.dR.prototype,"gdw","bC",0)
n(k,"gdz","bD",0)
m(k=A.d9.prototype,"gfX","fY",12)
o(k,"gh0","h1",19)
n(k,"gfZ","h_",0)
q(A,"yx","xk",41)
q(A,"yF","uY",121)
q(A,"yG","uZ",122)
q(A,"yN","v6",123)
s(A,"oG","xT",9)
q(A,"yO","vb",124)
o(A.cH.prototype,"gha","hb",56)
s(A,"tx","y3",33)
s(A,"tw","y1",33)
s(A,"oH","xX",3)
q(A,"yD","au",126)
m(A.bC.prototype,"gfG","dj",12)
l(A.fh.prototype,"gk","ag",7)
l(A.bZ.prototype,"gk","ag",7)
q(A,"qc","k9",127)
m(A.hs.prototype,"gdD","cc",12)
q(A,"zn","rt",10)
m(k=A.hI.prototype,"gf_","f0",11)
m(k,"geT","eU",11)
m(k,"geP","eQ",11)
m(k,"geV","eW",11)
m(k,"geR","eS",11)
q(A,"zo","wh",23)
q(A,"z7","zj",6)
q(A,"z6","zf",6)
q(A,"z4","ts",6)
q(A,"z8","zp",6)
q(A,"z1","yk",6)
q(A,"z2","yl",6)
q(A,"z3","yq",6)
q(A,"z5","yY",6)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.n,null)
q(A.n,[A.ps,J.h9,A.eQ,J.b4,A.i,A.eg,A.T,A.c5,A.a_,A.y,A.kv,A.a2,A.eD,A.f2,A.eY,A.eV,A.en,A.cZ,A.bE,A.a3,A.bR,A.bs,A.ds,A.bX,A.bI,A.lo,A.k6,A.eo,A.fj,A.jZ,A.eA,A.cN,A.cM,A.dz,A.ir,A.f3,A.eX,A.iA,A.mc,A.bc,A.ih,A.iD,A.m9,A.i_,A.da,A.am,A.ln,A.i6,A.bf,A.L,A.i0,A.dK,A.fk,A.i1,A.dR,A.f7,A.bg,A.d9,A.fu,A.iq,A.d7,A.fb,A.dr,A.fT,A.m_,A.mf,A.fs,A.bl,A.i9,A.hq,A.eW,A.lE,A.aa,A.ac,A.a8,A.iB,A.cW,A.be,A.k5,A.bY,A.ch,A.hN,A.kw,A.jc,A.bw,A.ic,A.ie,A.ig,A.id,A.lF,A.h5,A.jM,A.ec,A.iT,A.dO,A.dH,A.dx,A.iv,A.il,A.ji,A.ha,A.c4,A.fW,A.dg,A.bx,A.dy,A.cG,A.hh,A.jH,A.aL,A.fc,A.f4,A.ii,A.cH,A.hB,A.eu,A.aF,A.d5,A.bV,A.dX,A.aP,A.jV,A.hF,A.eS,A.aH,A.cb,A.jA,A.k4,A.hC,A.hD,A.hw,A.hv,A.hE,A.bW,A.kz,A.bu,A.ed,A.m5,A.ik,A.eR,A.r,A.aE,A.iU,A.jb,A.iC,A.b6,A.kg,A.ad,A.A,A.d_,A.ef,A.h2,A.bB,A.bn,A.bC,A.ib,A.ip,A.dS,A.jC,A.ky,A.bH,A.fh,A.jF,A.jI,A.i5,A.m2,A.iu,A.lU,A.lB,A.it,A.is,A.lD,A.k1,A.eG,A.eF,A.et,A.bZ,A.hs,A.cV,A.jN,A.eL,A.jp,A.kd,A.ij,A.f9,A.bU,A.lV,A.lv,A.bT,A.ay,A.fN,A.hR,A.bp,A.ej,A.lj,A.m1,A.ft,A.hI,A.jl,A.jo,A.ep,A.di,A.bo,A.jL,A.kY,A.hM,A.lf,A.dP,A.fH,A.cm,A.pC,A.hK,A.kX,A.hL,A.eE,A.lA,A.jq,A.jY,A.dj,A.b5,A.dk,A.aR,A.l0,A.cP,A.aY,A.iy,A.ix,A.lk,A.aV,A.jO])
q(J.h9,[J.ew,J.ey,J.ez,J.dA,J.dB,J.cJ,J.cc])
q(J.ez,[J.cd,J.p,A.ce,A.eI])
q(J.cd,[J.hu,J.cp,J.bF])
r(J.hb,A.eQ)
r(J.jR,J.p)
q(J.cJ,[J.ex,J.hc])
q(A.i,[A.cq,A.z,A.cO,A.aQ,A.cY,A.bJ,A.bS,A.bD,A.d4,A.hZ,A.iz,A.cr,A.an])
q(A.cq,[A.cz,A.fv])
r(A.f8,A.cz)
r(A.f6,A.fv)
r(A.bv,A.f6)
q(A.T,[A.cA,A.b9,A.im])
q(A.c5,[A.fM,A.iV,A.fL,A.hO,A.oJ,A.oL,A.lx,A.lw,A.mi,A.lP,A.lS,A.kC,A.k_,A.lY,A.oW,A.oX,A.jv,A.jw,A.jQ,A.j_,A.jW,A.n2,A.j6,A.kB,A.jB,A.kx,A.ki,A.kp,A.ko,A.km,A.kn,A.kq,A.kr,A.kt,A.mp,A.mw,A.oy,A.oz,A.oi,A.ov,A.ow,A.ox,A.ot,A.ou,A.mB,A.mC,A.mD,A.mE,A.mF,A.mG,A.mH,A.mI,A.mJ,A.om,A.n6,A.o9,A.oa,A.n7,A.n8,A.n9,A.nk,A.nv,A.nG,A.nR,A.o1,A.o5,A.o6,A.o7,A.na,A.nb,A.n4,A.nc,A.nd,A.ne,A.nf,A.ng,A.nh,A.ni,A.nj,A.nl,A.nm,A.nn,A.no,A.np,A.nq,A.nr,A.ns,A.nt,A.nu,A.nw,A.nx,A.ny,A.nz,A.nA,A.nB,A.nC,A.nD,A.nE,A.nF,A.nH,A.nI,A.nJ,A.nK,A.nL,A.nM,A.n3,A.nN,A.nO,A.nP,A.nQ,A.nS,A.nT,A.nU,A.nV,A.nW,A.nX,A.nY,A.nZ,A.o_,A.o0,A.o2,A.o3,A.o4,A.mr,A.ms,A.mL,A.mn,A.mP,A.mQ,A.mR,A.mS,A.mT,A.mU,A.mO,A.mV,A.mW,A.mt,A.mu,A.jn,A.jt,A.oO,A.pf,A.oN,A.jJ,A.lC,A.kc,A.k8,A.kb,A.ka,A.n0,A.kf,A.lt,A.oj,A.ok,A.oZ,A.p1,A.kH,A.kG,A.kF,A.kR,A.kQ,A.kT,A.kU,A.kO,A.kJ,A.kL,A.kM,A.kZ,A.lg,A.lh,A.li,A.kW,A.jr,A.l6,A.l8,A.l9,A.l2,A.oS,A.or,A.ml,A.mm,A.mk,A.mq,A.ll,A.lm,A.p5,A.p7,A.pe,A.pa,A.pb,A.pc,A.p9,A.p0,A.p_])
q(A.fM,[A.iW,A.jS,A.oK,A.mj,A.on,A.lQ,A.lT,A.k0,A.m0,A.jj,A.jd,A.je,A.my,A.iX,A.iY,A.iZ,A.jX,A.jf,A.jg,A.jh,A.j1,A.j0,A.j2,A.j4,A.j3,A.j5,A.j7,A.j8,A.j9,A.kj,A.kk,A.kA,A.lW,A.kh,A.ks,A.mK,A.o8,A.jx,A.jz,A.mo,A.mN,A.mv,A.k2,A.oY,A.ol,A.kN,A.oA,A.lb,A.ld,A.la,A.l3,A.l4,A.p6])
q(A.a_,[A.dD,A.bO,A.hd,A.hW,A.hA,A.ia,A.dC,A.fF,A.b3,A.f0,A.hV,A.ck,A.fP])
r(A.dN,A.y)
r(A.dq,A.dN)
q(A.fL,[A.oT,A.ly,A.lz,A.ma,A.ju,A.lG,A.lL,A.lK,A.lI,A.lH,A.lO,A.lN,A.lM,A.lR,A.kD,A.m8,A.m7,A.m3,A.m6,A.of,A.me,A.md,A.ob,A.mM,A.op,A.oo,A.ja,A.kl,A.n_,A.oh,A.ku,A.n5,A.jm,A.jy,A.jE,A.jD,A.oP,A.jG,A.k3,A.ke,A.lu,A.kS,A.kE,A.kI,A.lc,A.le,A.l7,A.l1,A.l5,A.oq,A.p8,A.pd])
q(A.z,[A.a1,A.em,A.aq,A.ba,A.bG,A.fa])
q(A.a1,[A.bL,A.ar,A.bq,A.io])
r(A.cE,A.cO)
r(A.el,A.cY)
r(A.dw,A.bJ)
r(A.cD,A.bD)
q(A.bs,[A.dV,A.dW])
r(A.f,A.dV)
r(A.aS,A.dW)
q(A.ds,[A.af,A.c8])
q(A.bI,[A.dt,A.fi])
q(A.dt,[A.b8,A.c9])
r(A.eM,A.bO)
q(A.hO,[A.hG,A.dh])
r(A.cK,A.b9)
r(A.dI,A.ce)
q(A.eI,[A.eH,A.as])
q(A.as,[A.fd,A.ff])
r(A.fe,A.fd)
r(A.cf,A.fe)
r(A.fg,A.ff)
r(A.aN,A.fg)
q(A.cf,[A.cQ,A.cR])
q(A.aN,[A.hn,A.cS,A.ho,A.cU,A.eJ,A.eK,A.cg])
r(A.fn,A.ia)
r(A.f5,A.i6)
r(A.dQ,A.fk)
r(A.fm,A.dK)
r(A.dU,A.fm)
r(A.d0,A.dR)
r(A.d1,A.f7)
r(A.iw,A.fu)
r(A.d6,A.fi)
q(A.dr,[A.h0,A.he])
r(A.hf,A.dC)
q(A.fT,[A.jU,A.jT,A.ls,A.hY])
r(A.lZ,A.m_)
r(A.hX,A.h0)
q(A.b3,[A.ci,A.h8])
q(A.i9,[A.cn,A.eZ,A.hp,A.c6,A.cx,A.dv,A.cL,A.dE,A.aZ])
q(A.c4,[A.i2,A.i3,A.i4])
q(A.bx,[A.i7,A.i8])
q(A.aL,[A.eT,A.eN,A.fU,A.hi,A.hj,A.hk,A.du,A.dm])
q(A.aF,[A.eU,A.hm,A.fE,A.hg,A.fQ,A.fR,A.fS,A.fI,A.fJ,A.fK,A.hz])
q(A.eS,[A.ea,A.fV])
q(A.bT,[A.ee,A.f1,A.er,A.eb])
q(A.ay,[A.hT,A.eq,A.eh,A.dp])
q(A.hT,[A.hQ,A.hS])
q(A.bp,[A.h7,A.hU])
q(A.hU,[A.hr,A.h6,A.fO,A.hP])
q(A.bo,[A.hl,A.cI])
q(A.hl,[A.bm,A.dF,A.dn])
q(A.dP,[A.ca,A.dM])
s(A.dN,A.bR)
s(A.fv,A.y)
s(A.fd,A.y)
s(A.fe,A.a3)
s(A.ff,A.y)
s(A.fg,A.a3)
s(A.dQ,A.i1)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{c:"int",d:"double",av:"num",q:"String",B:"bool",a8:"Null",l:"List",n:"Object",O:"Map",S:"JSObject"},mangledNames:{},types:["~()","n?(A)","B(A)","B(c,c)","d(d)","q(A)","d(av)","c()","B(@)","B(aH,c)","B(n?)","~(ft)","~(n?)","c(c)","B(d,d)","d(A)","d?(A)","d(c)","~(@)","~(n,bd)","d(d,d,d,d,d,d)","a8(@)","B(q)","B(l<d>)","~(~())","c(d)","ad?(A)","l<bx>()","c(A)","c4(c)","@(A)","B(d)","~(d,d)","bV(r,c)","@()","c(c,c)","~(n?,n?)","a8(n,bd)","a8()","@(q)","~(c,c,c)","@(@)","~(c)","~(d,d,d)","c(aH)","d(c,d)","~(c,@)","n?(n?)","a8(~())","n?(A,n?)","n?(A)(c)","l<n?(A)>()","n?(A)(d(d))","S?()","O<q,n?>(A)","l<n?>(A)","B(eu,c)","l<d>?(A)","c(n?,c)","d5(c)","d_(A)","l<q>(A)","S()","l<@>?(A)","dO(c)","bn(A)","c?(A)","c(bY,bY)","q(c)","d(d,d,d)","~(d,d,d,d,d,d,d,d,d,d)","q(bB)","B(bB)","c(bw,bw)","co()","c?(c)","l<c>()","ch()","d(d,d)","d(d,+(l<d>,d))","c(bW,bW)","c(+(c,c),+(c,c))","B(c)","ev()","~(b6)","c(d,d)","~(q,q)","B(S)","aY()","@(@,q)","B(d,d,d,d,d,d,d,d)","ad?()","q(q)","c?()","n?(A)?(q)","dH(c)","B(q,q)","B(c7)","B(+(d,d))","aR(c,di)","l<l<d>>()","ab<~>()","c(aR,aR)","d()","q(q,bz{end!B})","d(d,d,d,d)","~(c,c,d)","a8(~)","~(c,l<bH>)","~(ay)","O<q,+(d,d)>(O<q,+(d,d)>)","bC(n?)","ab<bC>()","ab<co>(aY)","ab<i<br>>(aY)","ab<ay?>(bT)","dk()","a8(ay?)","~(S)","c(@,@)","a8(@,bd)","dx(r)","dy(r)","cG(r)","cH(r)","n(A)","q(n?)","l<d>(n?)","ab<cV>()"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"2;":(a,b)=>c=>c instanceof A.f&&a.b(c.a)&&b.b(c.b),"3;":(a,b,c)=>d=>d instanceof A.aS&&a.b(d.a)&&b.b(d.b)&&c.b(d.c)}}
A.wV(v.typeUniverse,JSON.parse('{"bF":"cd","hu":"cd","cp":"cd","zC":"ce","ew":{"B":[],"U":[]},"ey":{"a8":[],"U":[]},"ez":{"S":[]},"cd":{"S":[]},"p":{"l":["1"],"z":["1"],"S":[],"i":["1"]},"hb":{"eQ":[]},"jR":{"p":["1"],"l":["1"],"z":["1"],"S":[],"i":["1"]},"b4":{"I":["1"]},"cJ":{"d":[],"av":[],"b7":["av"]},"ex":{"d":[],"c":[],"av":[],"b7":["av"],"U":[]},"hc":{"d":[],"av":[],"b7":["av"],"U":[]},"cc":{"q":[],"b7":["q"],"k7":[],"U":[]},"cq":{"i":["2"]},"eg":{"I":["2"]},"cz":{"cq":["1","2"],"i":["2"],"i.E":"2"},"f8":{"cz":["1","2"],"cq":["1","2"],"z":["2"],"i":["2"],"i.E":"2"},"f6":{"y":["2"],"l":["2"],"cq":["1","2"],"z":["2"],"i":["2"]},"bv":{"f6":["1","2"],"y":["2"],"l":["2"],"cq":["1","2"],"z":["2"],"i":["2"],"y.E":"2","i.E":"2"},"cA":{"T":["3","4"],"O":["3","4"],"T.K":"3","T.V":"4"},"dD":{"a_":[]},"dq":{"y":["c"],"bR":["c"],"l":["c"],"z":["c"],"i":["c"],"y.E":"c","bR.E":"c"},"z":{"i":["1"]},"a1":{"z":["1"],"i":["1"]},"bL":{"a1":["1"],"z":["1"],"i":["1"],"i.E":"1","a1.E":"1"},"a2":{"I":["1"]},"cO":{"i":["2"],"i.E":"2"},"cE":{"cO":["1","2"],"z":["2"],"i":["2"],"i.E":"2"},"eD":{"I":["2"]},"ar":{"a1":["2"],"z":["2"],"i":["2"],"i.E":"2","a1.E":"2"},"aQ":{"i":["1"],"i.E":"1"},"f2":{"I":["1"]},"cY":{"i":["1"],"i.E":"1"},"el":{"cY":["1"],"z":["1"],"i":["1"],"i.E":"1"},"eY":{"I":["1"]},"bJ":{"i":["1"],"i.E":"1"},"dw":{"bJ":["1"],"z":["1"],"i":["1"],"i.E":"1"},"eV":{"I":["1"]},"em":{"z":["1"],"i":["1"],"i.E":"1"},"en":{"I":["1"]},"bS":{"i":["1"],"i.E":"1"},"cZ":{"I":["1"]},"bD":{"i":["+(c,1)"],"i.E":"+(c,1)"},"cD":{"bD":["1"],"z":["+(c,1)"],"i":["+(c,1)"],"i.E":"+(c,1)"},"bE":{"I":["+(c,1)"]},"dN":{"y":["1"],"bR":["1"],"l":["1"],"z":["1"],"i":["1"]},"bq":{"a1":["1"],"z":["1"],"i":["1"],"i.E":"1","a1.E":"1"},"f":{"dV":[],"bs":[]},"aS":{"dW":[],"bs":[]},"ds":{"O":["1","2"]},"af":{"ds":["1","2"],"O":["1","2"]},"d4":{"i":["1"],"i.E":"1"},"bX":{"I":["1"]},"c8":{"ds":["1","2"],"O":["1","2"]},"dt":{"bI":["1"],"cj":["1"],"z":["1"],"i":["1"]},"b8":{"dt":["1"],"bI":["1"],"cj":["1"],"z":["1"],"i":["1"]},"c9":{"dt":["1"],"bI":["1"],"cj":["1"],"z":["1"],"i":["1"]},"eM":{"bO":[],"a_":[]},"hd":{"a_":[]},"hW":{"a_":[]},"fj":{"bd":[]},"c5":{"cF":[]},"fL":{"cF":[]},"fM":{"cF":[]},"hO":{"cF":[]},"hG":{"cF":[]},"dh":{"cF":[]},"hA":{"a_":[]},"b9":{"T":["1","2"],"pu":["1","2"],"O":["1","2"],"T.K":"1","T.V":"2"},"aq":{"z":["1"],"i":["1"],"i.E":"1"},"eA":{"I":["1"]},"ba":{"z":["1"],"i":["1"],"i.E":"1"},"cN":{"I":["1"]},"bG":{"z":["ac<1,2>"],"i":["ac<1,2>"],"i.E":"ac<1,2>"},"cM":{"I":["ac<1,2>"]},"cK":{"b9":["1","2"],"T":["1","2"],"pu":["1","2"],"O":["1","2"],"T.K":"1","T.V":"2"},"dV":{"bs":[]},"dW":{"bs":[]},"dz":{"vS":[],"k7":[]},"ir":{"eP":[],"dG":[]},"hZ":{"i":["eP"],"i.E":"eP"},"f3":{"I":["eP"]},"eX":{"dG":[]},"iz":{"i":["dG"],"i.E":"dG"},"iA":{"I":["dG"]},"dI":{"ce":[],"S":[],"U":[]},"cg":{"aN":[],"co":[],"y":["c"],"as":["c"],"l":["c"],"aM":["c"],"z":["c"],"S":[],"i":["c"],"a3":["c"],"U":[],"y.E":"c","a3.E":"c"},"ce":{"S":[],"U":[]},"eI":{"S":[]},"eH":{"qF":[],"S":[],"U":[]},"as":{"aM":["1"],"S":[]},"cf":{"y":["d"],"as":["d"],"l":["d"],"aM":["d"],"z":["d"],"S":[],"i":["d"],"a3":["d"]},"aN":{"y":["c"],"as":["c"],"l":["c"],"aM":["c"],"z":["c"],"S":[],"i":["c"],"a3":["c"]},"cQ":{"cf":[],"bz":[],"y":["d"],"as":["d"],"l":["d"],"aM":["d"],"z":["d"],"S":[],"i":["d"],"a3":["d"],"U":[],"y.E":"d","a3.E":"d"},"cR":{"cf":[],"c7":[],"y":["d"],"as":["d"],"l":["d"],"aM":["d"],"z":["d"],"S":[],"i":["d"],"a3":["d"],"U":[],"y.E":"d","a3.E":"d"},"hn":{"aN":[],"pn":[],"y":["c"],"as":["c"],"l":["c"],"aM":["c"],"z":["c"],"S":[],"i":["c"],"a3":["c"],"U":[],"y.E":"c","a3.E":"c"},"cS":{"aN":[],"ev":[],"y":["c"],"as":["c"],"l":["c"],"aM":["c"],"z":["c"],"S":[],"i":["c"],"a3":["c"],"U":[],"y.E":"c","a3.E":"c"},"ho":{"aN":[],"y":["c"],"as":["c"],"l":["c"],"aM":["c"],"z":["c"],"S":[],"i":["c"],"a3":["c"],"U":[],"y.E":"c","a3.E":"c"},"cU":{"aN":[],"lq":[],"y":["c"],"as":["c"],"l":["c"],"aM":["c"],"z":["c"],"S":[],"i":["c"],"a3":["c"],"U":[],"y.E":"c","a3.E":"c"},"eJ":{"aN":[],"lr":[],"y":["c"],"as":["c"],"l":["c"],"aM":["c"],"z":["c"],"S":[],"i":["c"],"a3":["c"],"U":[],"y.E":"c","a3.E":"c"},"eK":{"aN":[],"y":["c"],"as":["c"],"l":["c"],"aM":["c"],"z":["c"],"S":[],"i":["c"],"a3":["c"],"U":[],"y.E":"c","a3.E":"c"},"ia":{"a_":[]},"fn":{"bO":[],"a_":[]},"da":{"I":["1"]},"cr":{"i":["1"],"i.E":"1"},"am":{"a_":[]},"f5":{"i6":["1"]},"L":{"ab":["1"]},"fk":{"rO":["1"],"d2":["1"]},"dQ":{"i1":["1"],"fk":["1"],"rO":["1"],"d2":["1"]},"dU":{"fm":["1"],"dK":["1"]},"d0":{"dR":["1"],"hH":["1"],"d2":["1"]},"dR":{"hH":["1"],"d2":["1"]},"fm":{"dK":["1"]},"d1":{"f7":["1"]},"fu":{"rB":[]},"iw":{"fu":[],"rB":[]},"d6":{"bI":["1"],"cj":["1"],"z":["1"],"i":["1"]},"d7":{"I":["1"]},"y":{"l":["1"],"z":["1"],"i":["1"]},"T":{"O":["1","2"]},"fa":{"z":["2"],"i":["2"],"i.E":"2"},"fb":{"I":["2"]},"bI":{"cj":["1"],"z":["1"],"i":["1"]},"fi":{"bI":["1"],"cj":["1"],"z":["1"],"i":["1"]},"im":{"T":["q","@"],"O":["q","@"],"T.K":"q","T.V":"@"},"io":{"a1":["q"],"z":["q"],"i":["q"],"i.E":"q","a1.E":"q"},"h0":{"dr":["q","l<c>"]},"dC":{"a_":[]},"hf":{"a_":[]},"he":{"dr":["n?","q"]},"hX":{"dr":["q","l<c>"]},"d":{"av":[],"b7":["av"]},"bl":{"b7":["bl"]},"c":{"av":[],"b7":["av"]},"l":{"z":["1"],"i":["1"]},"av":{"b7":["av"]},"eP":{"dG":[]},"cj":{"z":["1"],"i":["1"]},"q":{"b7":["q"],"k7":[]},"i9":{"by":[]},"fF":{"a_":[]},"bO":{"a_":[]},"b3":{"a_":[]},"ci":{"a_":[]},"h8":{"ci":[],"a_":[]},"f0":{"a_":[]},"hV":{"a_":[]},"ck":{"a_":[]},"fP":{"a_":[]},"hq":{"a_":[]},"eW":{"a_":[]},"iB":{"bd":[]},"an":{"i":["c"],"i.E":"c"},"cW":{"I":["c"]},"be":{"w5":[]},"cn":{"by":[]},"ic":{"dT":[]},"ie":{"dT":[]},"ig":{"dT":[]},"id":{"dT":[]},"i2":{"c4":[]},"i3":{"c4":[]},"i4":{"c4":[]},"i7":{"bx":[]},"i8":{"bx":[]},"cG":{"v4":[]},"eT":{"aL":[]},"eN":{"aL":[]},"fU":{"aL":[]},"hi":{"aL":[]},"hj":{"aL":[]},"hk":{"aL":[]},"du":{"aL":[]},"dm":{"aL":[]},"eU":{"aF":[]},"hm":{"aF":[]},"fE":{"aF":[]},"hg":{"aF":[]},"fQ":{"aF":[]},"fR":{"aF":[]},"fS":{"aF":[]},"fI":{"aF":[]},"fJ":{"aF":[]},"fK":{"aF":[]},"hz":{"aF":[]},"ea":{"eS":[]},"fV":{"eS":[]},"eZ":{"by":[]},"hp":{"by":[]},"ip":{"br":[]},"dS":{"bN":[]},"it":{"br":[]},"is":{"bN":[]},"eG":{"br":[]},"eF":{"bN":[]},"c6":{"by":[]},"ee":{"bT":[]},"f1":{"bT":[]},"er":{"bT":[]},"eb":{"bT":[]},"hT":{"ay":[]},"hQ":{"ay":[]},"hS":{"ay":[]},"eq":{"ay":[]},"eh":{"ay":[]},"dp":{"ay":[]},"h7":{"bp":[]},"hU":{"bp":[]},"hr":{"bp":[]},"h6":{"bp":[]},"fO":{"bp":[]},"hP":{"bp":[]},"cx":{"by":[]},"dv":{"by":[]},"hl":{"bo":[]},"bm":{"bo":[]},"dF":{"bo":[]},"dn":{"bo":[]},"cI":{"bo":[]},"ca":{"dP":[]},"dM":{"dP":[]},"aZ":{"by":[]},"cL":{"by":[]},"dE":{"by":[]},"iy":{"br":[]},"ix":{"bN":[]},"vf":{"l":["c"],"z":["c"],"i":["c"]},"co":{"l":["c"],"z":["c"],"i":["c"]},"wl":{"l":["c"],"z":["c"],"i":["c"]},"pn":{"l":["c"],"z":["c"],"i":["c"]},"lq":{"l":["c"],"z":["c"],"i":["c"]},"ev":{"l":["c"],"z":["c"],"i":["c"]},"lr":{"l":["c"],"z":["c"],"i":["c"]},"bz":{"l":["d"],"z":["d"],"i":["d"]},"c7":{"l":["d"],"z":["d"],"i":["d"]}}'))
A.wU(v.typeUniverse,JSON.parse('{"dN":1,"fv":2,"as":1,"f7":1,"fi":1,"fT":2}'))
var u={c:"Error handler must accept one Object or one Object and a StackTrace as arguments, and return a value of the returned future's type"}
var t=(function rtii(){var s=A.ak
return{bm:s("@<~>"),v:s("am"),c5:s("ec"),kb:s("bu"),bb:s("r"),el:s("b6"),j8:s("c6"),aq:s("bw"),gS:s("dq"),bP:s("b7<@>"),p1:s("af<q,q>"),Z:s("b8<q>"),c:s("bx"),jS:s("bl"),Q:s("z<@>"),C:s("a_"),X:s("A"),lc:s("h2"),nY:s("ep"),if:s("bm"),pk:s("bz"),kI:s("c7"),oc:s("bB"),gY:s("cF"),kH:s("dx"),lP:s("dy"),nD:s("c8<c,l<c>>"),cR:s("c9<c>"),my:s("bC"),og:s("aH"),lr:s("cb"),fA:s("cG"),b0:s("cH"),bW:s("ev"),mm:s("i<br>"),id:s("i<d>"),e7:s("i<@>"),fm:s("i<c>"),jQ:s("p<fH>"),lW:s("p<bu>"),o_:s("p<di>"),dY:s("p<ef>"),oM:s("p<b5>"),hD:s("p<dj>"),i9:s("p<fN>"),r:s("p<b6>"),ig:s("p<bw>"),nv:s("p<ep>"),Y:s("p<bz>"),w:s("p<c7>"),eJ:s("p<bB>"),R:s("p<aH>"),q:s("p<cb>"),fT:s("p<aL>"),fL:s("p<aF>"),kG:s("p<S>"),iQ:s("p<l<ec>>"),ot:s("p<l<l<d>>>"),bo:s("p<l<n>>"),b:s("p<l<d>>"),fC:s("p<l<c>>"),D:s("p<l<n?>>"),iE:s("p<O<c,bH>>"),nb:s("p<O<c,c>>"),bw:s("p<eE>"),ef:s("p<eF>"),gw:s("p<cP>"),aA:s("p<cg>"),I:s("p<n>"),oJ:s("p<ch>"),o9:s("p<bo>"),ez:s("p<bH>"),lE:s("p<hv>"),gX:s("p<hw>"),kv:s("p<bp>"),k_:s("p<+(l<d>,d)>"),mH:s("p<+(q,l<n?>)>"),m_:s("p<+(q,q)>"),bU:s("p<+(d,c7)>"),G:s("p<+(d,d)>"),n_:s("p<+(c,cm)>"),ho:s("p<+(c,c)>"),cm:s("p<+(c,O<q,n?>?)>"),eL:s("p<+(n?,O<q,n?>)>"),lN:s("p<+(n?,n?)>"),c3:s("p<+(l<bN>,l<c>,l<c>)>"),eN:s("p<+(d,d,d)>"),iv:s("p<+(c,c,l<c>)>"),oZ:s("p<+(c,c,d)>"),hc:s("p<+(n?(A),O<q,n?(A)>,B)>"),m1:s("p<eR>"),kR:s("p<hF>"),s:s("p<q>"),in:s("p<cm>"),oW:s("p<hM>"),d:s("p<bN>"),cb:s("p<hR>"),e:s("p<br>"),jA:s("p<dP>"),ji:s("p<bU>"),c8:s("p<i5>"),fB:s("p<f9>"),ha:s("p<ib>"),la:s("p<bW>"),fw:s("p<aR>"),bD:s("p<ik>"),mc:s("p<il>"),eB:s("p<bY>"),fb:s("p<iv>"),d2:s("p<iC>"),df:s("p<B>"),n:s("p<d>"),dG:s("p<@>"),t:s("p<c>"),dM:s("p<n?>"),k9:s("p<+(cP,l<bz>)?>"),nn:s("p<d?>"),g2:s("p<av>"),V:s("p<n?(A)>"),x:s("ey"),m:s("S"),et:s("bF"),dX:s("aM<@>"),dn:s("dF"),kV:s("l<bu>"),lL:s("l<b5>"),ke:s("l<dj>"),kp:s("l<b6>"),iu:s("l<bz>"),lt:s("l<c7>"),kT:s("l<uW>"),n7:s("l<aH>"),gz:s("l<l<b6>>"),y:s("l<l<d>>"),aB:s("l<cP>"),a2:s("l<bH>"),gE:s("l<+(d,d)>"),lK:s("l<+(c,c,d)>"),bF:s("l<q>"),ia:s("l<cm>"),dg:s("l<bN>"),je:s("l<f9>"),H:s("l<d>"),j:s("l<@>"),L:s("l<c>"),W:s("l<n?>"),ih:s("hh"),pp:s("O<q,q>"),eM:s("O<q,d>"),f:s("O<@,@>"),mV:s("O<c,c>"),l0:s("O<q,l<+(d,d)>>"),a:s("O<q,+(d,d)>"),U:s("O<q,n?>"),hu:s("O<n?,O<q,n?>>"),g:s("O<n?,n?>"),gQ:s("ar<q,q>"),dl:s("eG"),h7:s("dH"),eb:s("dI"),bi:s("cQ"),g_:s("cR"),da:s("cS"),dQ:s("cf"),aj:s("aN"),nZ:s("cU"),hp:s("cg"),P:s("a8"),K:s("n"),kJ:s("ch"),kY:s("bo"),jv:s("bH"),f7:s("ci"),lZ:s("zD"),aK:s("+()"),hT:s("+(l<d>,d)"),l_:s("+(q,cV)"),aL:s("+(d,d)"),gn:s("+(c,c)"),A:s("+(n?,n?)"),lu:s("eP"),mk:s("cV"),bs:s("bq<c>"),J:s("an"),nu:s("hB"),gi:s("cj<q>"),nO:s("cj<c>"),gp:s("hD"),gc:s("hE"),l:s("bd"),N:s("q"),gL:s("q(q)"),l1:s("hN"),aJ:s("U"),do:s("bO"),hM:s("lq"),p:s("co"),cx:s("cp"),iT:s("dO"),cF:s("aQ<q>"),cI:s("dQ<n?>"),kr:s("bV"),bY:s("bW"),k:s("L<B>"),_:s("L<@>"),hy:s("L<c>"),cU:s("L<~>"),ct:s("aR"),iM:s("ij"),nx:s("d5"),dt:s("bY"),d3:s("fl<n?>"),b6:s("d9<n?>"),an:s("cr<b5>"),B:s("B"),dW:s("B(aH,c)"),iW:s("B(n)"),dA:s("B(q)"),i:s("d"),f3:s("d(d)"),z:s("@"),mY:s("@()"),E:s("@(n)"),ng:s("@(n,bd)"),S:s("c"),f1:s("bx?"),gK:s("ab<a8>?"),mU:s("S?"),nw:s("l<b6>?"),hF:s("l<bz>?"),l7:s("l<aL>?"),n4:s("l<l<d>>()?"),h:s("l<bV>?"),d1:s("l<d5>?"),nE:s("l<d>?"),lH:s("l<@>?"),T:s("l<c>?"),jT:s("O<q,l<+(d,d)>>?"),h9:s("O<q,n?>?"),O:s("n?"),u:s("n?(A)"),bl:s("q?"),lf:s("lr?"),nh:s("co?"),c_:s("ay?"),F:s("bf<@,@>?"),bQ:s("aR?"),hJ:s("ii?"),nF:s("iq?"),fU:s("B?"),mA:s("B(aH,c)?"),jX:s("d?"),aV:s("c?"),jh:s("av?"),jE:s("~()?"),cZ:s("av"),o:s("~"),M:s("~()"),i6:s("~(n)"),b9:s("~(n,bd)"),jR:s("~(q,@)"),hi:s("~(d,d,d)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.b5=J.h9.prototype
B.a=J.p.prototype
B.a6=J.ew.prototype
B.b=J.ex.prototype
B.c=J.cJ.prototype
B.d=J.cc.prototype
B.b6=J.bF.prototype
B.b7=J.ez.prototype
B.df=A.eH.prototype
B.o=A.cQ.prototype
B.q=A.cR.prototype
B.x=A.cS.prototype
B.U=A.cU.prototype
B.i=A.eJ.prototype
B.j=A.cg.prototype
B.ag=J.hu.prototype
B.W=J.cp.prototype
B.A=new A.cx(0,"fill")
B.r=new A.cx(1,"line")
B.t=new A.cx(2,"circle")
B.K=new A.cx(3,"extrusion")
B.a_=new A.fV()
B.am=new A.en(A.ak("en<0&>"))
B.a0=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.an=function() {
  var toStringFunction = Object.prototype.toString;
  function getTag(o) {
    var s = toStringFunction.call(o);
    return s.substring(8, s.length - 1);
  }
  function getUnknownTag(object, tag) {
    if (/^HTML[A-Z].*Element$/.test(tag)) {
      var name = toStringFunction.call(object);
      if (name == "[object Object]") return null;
      return "HTMLElement";
    }
  }
  function getUnknownTagGenericBrowser(object, tag) {
    if (object instanceof HTMLElement) return "HTMLElement";
    return getUnknownTag(object, tag);
  }
  function prototypeForTag(tag) {
    if (typeof window == "undefined") return null;
    if (typeof window[tag] == "undefined") return null;
    var constructor = window[tag];
    if (typeof constructor != "function") return null;
    return constructor.prototype;
  }
  function discriminator(tag) { return null; }
  var isBrowser = typeof HTMLElement == "function";
  return {
    getTag: getTag,
    getUnknownTag: isBrowser ? getUnknownTagGenericBrowser : getUnknownTag,
    prototypeForTag: prototypeForTag,
    discriminator: discriminator };
}
B.as=function(getTagFallback) {
  return function(hooks) {
    if (typeof navigator != "object") return hooks;
    var userAgent = navigator.userAgent;
    if (typeof userAgent != "string") return hooks;
    if (userAgent.indexOf("DumpRenderTree") >= 0) return hooks;
    if (userAgent.indexOf("Chrome") >= 0) {
      function confirm(p) {
        return typeof window == "object" && window[p] && window[p].name == p;
      }
      if (confirm("Window") && confirm("HTMLElement")) return hooks;
    }
    hooks.getTag = getTagFallback;
  };
}
B.ao=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.ar=function(hooks) {
  if (typeof navigator != "object") return hooks;
  var userAgent = navigator.userAgent;
  if (typeof userAgent != "string") return hooks;
  if (userAgent.indexOf("Firefox") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "GeoGeolocation": "Geolocation",
    "Location": "!Location",
    "WorkerMessageEvent": "MessageEvent",
    "XMLDocument": "!Document"};
  function getTagFirefox(o) {
    var tag = getTag(o);
    return quickMap[tag] || tag;
  }
  hooks.getTag = getTagFirefox;
}
B.aq=function(hooks) {
  if (typeof navigator != "object") return hooks;
  var userAgent = navigator.userAgent;
  if (typeof userAgent != "string") return hooks;
  if (userAgent.indexOf("Trident/") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "HTMLDDElement": "HTMLElement",
    "HTMLDTElement": "HTMLElement",
    "HTMLPhraseElement": "HTMLElement",
    "Position": "Geoposition"
  };
  function getTagIE(o) {
    var tag = getTag(o);
    var newTag = quickMap[tag];
    if (newTag) return newTag;
    if (tag == "Object") {
      if (window.DataView && (o instanceof window.DataView)) return "DataView";
    }
    return tag;
  }
  function prototypeForTagIE(tag) {
    var constructor = window[tag];
    if (constructor == null) return null;
    return constructor.prototype;
  }
  hooks.getTag = getTagIE;
  hooks.prototypeForTag = prototypeForTagIE;
}
B.ap=function(hooks) {
  var getTag = hooks.getTag;
  var prototypeForTag = hooks.prototypeForTag;
  function getTagFixed(o) {
    var tag = getTag(o);
    if (tag == "Document") {
      if (!!o.xmlVersion) return "!Document";
      return "!HTMLDocument";
    }
    return tag;
  }
  function prototypeForTagFixed(tag) {
    if (tag == "Document") return null;
    return prototypeForTag(tag);
  }
  hooks.getTag = getTagFixed;
  hooks.prototypeForTag = prototypeForTagFixed;
}
B.a1=function(hooks) { return hooks; }

B.h=new A.he()
B.at=new A.hq()
B.L=new A.kv()
B.u=new A.hX()
B.au=new A.ls()
B.k=new A.i2()
B.f=new A.iw()
B.B=new A.iB()
B.a2=new A.c6(0,"zoom")
B.a3=new A.dv(0,"butt")
B.ax=new A.dv(1,"round")
B.ay=new A.dv(2,"square")
B.az=new A.ej(6553.6,25.6,0.1,1e4)
B.aA=new A.ej(256,1,0.00390625,32768)
B.aB=new A.bl(0)
B.aC=new A.bl(1e4)
B.aD=new A.bl(2e7)
B.aE=new A.bl(3e7)
B.a4=new A.aE("head is shorter than its 54 bytes")
B.aF=new A.aE("avar segment map overruns the font")
B.aG=new A.aE("DeltaSetIndexMap entries overrun the font")
B.aH=new A.aE("delta set rows overrun the font")
B.aI=new A.aE("fvar axis array overruns the font")
B.aJ=new A.aE("cmap is too short to hold a header")
B.aK=new A.aE("fvar instance array overruns the font")
B.aL=new A.aE("cmap has no subtable in a format this parser supports")
B.aM=new A.aE("variation region list overruns the font")
B.aN=new A.aE("too short to hold an SFNT header")
B.aO=new A.aE("hhea.numberOfHMetrics is 0, leaving every glyph without an advance")
B.aP=new A.aE("cmap has no usable encoding record")
B.aQ=new A.aa("An MLT stream is larger than its tile",null,null)
B.aR=new A.aa("Not a PMTiles version 3 archive",null,null)
B.aS=new A.aa("An MLT map nests past its end",null,null)
B.aT=new A.aa("A string runs past its tile",null,null)
B.aU=new A.aa("An MLT geometry has too many parts",null,null)
B.aV=new A.aa("A FastPFOR stream is misaligned",null,null)
B.aW=new A.aa("An MLT geometry has too many rings",null,null)
B.aX=new A.aa("An MLT tile reads past its end",null,null)
B.aY=new A.aa("A FastPFOR exception is missing",null,null)
B.aZ=new A.aa("An MLT map key is not a string",null,null)
B.b_=new A.aa("An MLT map value is out of its dictionary",null,null)
B.b0=new A.aa("The PMTiles directory is corrupt",null,null)
B.b1=new A.aa("An MLT map value is cut off",null,null)
B.C=new A.aa("A varint runs over ten bytes",null,null)
B.b2=new A.aa("The PMTiles archive is packed with brotli or zstd; only gzip is read",null,null)
B.b3=new A.aa("An MLT block runs past its tile",null,null)
B.b4=new A.aa("An MLT map runs past its values",null,null)
B.a5=new A.aa("A length runs past its message",null,null)
B.b8=new A.jT(null)
B.b9=new A.jU(null)
B.n=new A.dE(0,"butt")
B.M=new A.dE(1,"round")
B.N=new A.dE(2,"square")
B.a7=new A.cL(0,"round")
B.O=new A.cL(1,"bevel")
B.v=new A.cL(2,"miter")
B.ba=new A.cL(3,"none")
B.bb=s([0,-1,1],t.n)
B.bc=s([32],t.t)
B.ah=new A.f(-1,-1)
B.ej=new A.f(1,-1)
B.ei=new A.f(1,1)
B.eT=new A.f(-1,1)
B.bd=s([B.ah,B.ej,B.ei,B.eT],t.G)
B.cw=s(["text-transform","text-letter-spacing","text-max-width","text-justify","text-anchor","text-rotate","text-font","icon-anchor"],t.s)
B.cx=s([60,824,8814,61,824,8800,62,824,8815,65,768,192,65,769,193,65,770,194,65,771,195,65,772,256,65,774,258,65,775,550,65,776,196,65,777,7842,65,778,197,65,780,461,65,783,512,65,785,514,65,803,7840,65,805,7680,65,808,260,66,775,7682,66,803,7684,66,817,7686,67,769,262,67,770,264,67,775,266,67,780,268,67,807,199,68,775,7690,68,780,270,68,803,7692,68,807,7696,68,813,7698,68,817,7694,69,768,200,69,769,201,69,770,202,69,771,7868,69,772,274,69,774,276,69,775,278,69,776,203,69,777,7866,69,780,282,69,783,516,69,785,518,69,803,7864,69,807,552,69,808,280,69,813,7704,69,816,7706,70,775,7710,71,769,500,71,770,284,71,772,7712,71,774,286,71,775,288,71,780,486,71,807,290,72,770,292,72,775,7714,72,776,7718,72,780,542,72,803,7716,72,807,7720,72,814,7722,73,768,204,73,769,205,73,770,206,73,771,296,73,772,298,73,774,300,73,775,304,73,776,207,73,777,7880,73,780,463,73,783,520,73,785,522,73,803,7882,73,808,302,73,816,7724,74,770,308,75,769,7728,75,780,488,75,803,7730,75,807,310,75,817,7732,76,769,313,76,780,317,76,803,7734,76,807,315,76,813,7740,76,817,7738,77,769,7742,77,775,7744,77,803,7746,78,768,504,78,769,323,78,771,209,78,775,7748,78,780,327,78,803,7750,78,807,325,78,813,7754,78,817,7752,79,768,210,79,769,211,79,770,212,79,771,213,79,772,332,79,774,334,79,775,558,79,776,214,79,777,7886,79,779,336,79,780,465,79,783,524,79,785,526,79,795,416,79,803,7884,79,808,490,80,769,7764,80,775,7766,82,769,340,82,775,7768,82,780,344,82,783,528,82,785,530,82,803,7770,82,807,342,82,817,7774,83,769,346,83,770,348,83,775,7776,83,780,352,83,803,7778,83,806,536,83,807,350,84,775,7786,84,780,356,84,803,7788,84,806,538,84,807,354,84,813,7792,84,817,7790,85,768,217,85,769,218,85,770,219,85,771,360,85,772,362,85,774,364,85,776,220,85,777,7910,85,778,366,85,779,368,85,780,467,85,783,532,85,785,534,85,795,431,85,803,7908,85,804,7794,85,808,370,85,813,7798,85,816,7796,86,771,7804,86,803,7806,87,768,7808,87,769,7810,87,770,372,87,775,7814,87,776,7812,87,803,7816,88,775,7818,88,776,7820,89,768,7922,89,769,221,89,770,374,89,771,7928,89,772,562,89,775,7822,89,776,376,89,777,7926,89,803,7924,90,769,377,90,770,7824,90,775,379,90,780,381,90,803,7826,90,817,7828,97,768,224,97,769,225,97,770,226,97,771,227,97,772,257,97,774,259,97,775,551,97,776,228,97,777,7843,97,778,229,97,780,462,97,783,513,97,785,515,97,803,7841,97,805,7681,97,808,261,98,775,7683,98,803,7685,98,817,7687,99,769,263,99,770,265,99,775,267,99,780,269,99,807,231,100,775,7691,100,780,271,100,803,7693,100,807,7697,100,813,7699,100,817,7695,101,768,232,101,769,233,101,770,234,101,771,7869,101,772,275,101,774,277,101,775,279,101,776,235,101,777,7867,101,780,283,101,783,517,101,785,519,101,803,7865,101,807,553,101,808,281,101,813,7705,101,816,7707,102,775,7711,103,769,501,103,770,285,103,772,7713,103,774,287,103,775,289,103,780,487,103,807,291,104,770,293,104,775,7715,104,776,7719,104,780,543,104,803,7717,104,807,7721,104,814,7723,104,817,7830,105,768,236,105,769,237,105,770,238,105,771,297,105,772,299,105,774,301,105,776,239,105,777,7881,105,780,464,105,783,521,105,785,523,105,803,7883,105,808,303,105,816,7725,106,770,309,106,780,496,107,769,7729,107,780,489,107,803,7731,107,807,311,107,817,7733,108,769,314,108,780,318,108,803,7735,108,807,316,108,813,7741,108,817,7739,109,769,7743,109,775,7745,109,803,7747,110,768,505,110,769,324,110,771,241,110,775,7749,110,780,328,110,803,7751,110,807,326,110,813,7755,110,817,7753,111,768,242,111,769,243,111,770,244,111,771,245,111,772,333,111,774,335,111,775,559,111,776,246,111,777,7887,111,779,337,111,780,466,111,783,525,111,785,527,111,795,417,111,803,7885,111,808,491,112,769,7765,112,775,7767,114,769,341,114,775,7769,114,780,345,114,783,529,114,785,531,114,803,7771,114,807,343,114,817,7775,115,769,347,115,770,349,115,775,7777,115,780,353,115,803,7779,115,806,537,115,807,351,116,775,7787,116,776,7831,116,780,357,116,803,7789,116,806,539,116,807,355,116,813,7793,116,817,7791,117,768,249,117,769,250,117,770,251,117,771,361,117,772,363,117,774,365,117,776,252,117,777,7911,117,778,367,117,779,369,117,780,468,117,783,533,117,785,535,117,795,432,117,803,7909,117,804,7795,117,808,371,117,813,7799,117,816,7797,118,771,7805,118,803,7807,119,768,7809,119,769,7811,119,770,373,119,775,7815,119,776,7813,119,778,7832,119,803,7817,120,775,7819,120,776,7821,121,768,7923,121,769,253,121,770,375,121,771,7929,121,772,563,121,775,7823,121,776,255,121,777,7927,121,778,7833,121,803,7925,122,769,378,122,770,7825,122,775,380,122,780,382,122,803,7827,122,817,7829,168,768,8173,168,769,901,168,834,8129,194,768,7846,194,769,7844,194,771,7850,194,777,7848,196,772,478,197,769,506,198,769,508,198,772,482,199,769,7688,202,768,7872,202,769,7870,202,771,7876,202,777,7874,207,769,7726,212,768,7890,212,769,7888,212,771,7894,212,777,7892,213,769,7756,213,772,556,213,776,7758,214,772,554,216,769,510,220,768,475,220,769,471,220,772,469,220,780,473,226,768,7847,226,769,7845,226,771,7851,226,777,7849,228,772,479,229,769,507,230,769,509,230,772,483,231,769,7689,234,768,7873,234,769,7871,234,771,7877,234,777,7875,239,769,7727,244,768,7891,244,769,7889,244,771,7895,244,777,7893,245,769,7757,245,772,557,245,776,7759,246,772,555,248,769,511,252,768,476,252,769,472,252,772,470,252,780,474,258,768,7856,258,769,7854,258,771,7860,258,777,7858,259,768,7857,259,769,7855,259,771,7861,259,777,7859,274,768,7700,274,769,7702,275,768,7701,275,769,7703,332,768,7760,332,769,7762,333,768,7761,333,769,7763,346,775,7780,347,775,7781,352,775,7782,353,775,7783,360,769,7800,361,769,7801,362,776,7802,363,776,7803,383,775,7835,416,768,7900,416,769,7898,416,771,7904,416,777,7902,416,803,7906,417,768,7901,417,769,7899,417,771,7905,417,777,7903,417,803,7907,431,768,7914,431,769,7912,431,771,7918,431,777,7916,431,803,7920,432,768,7915,432,769,7913,432,771,7919,432,777,7917,432,803,7921,439,780,494,490,772,492,491,772,493,550,772,480,551,772,481,552,774,7708,553,774,7709,558,772,560,559,772,561,658,780,495,913,768,8122,913,769,902,913,772,8121,913,774,8120,913,787,7944,913,788,7945,913,837,8124,917,768,8136,917,769,904,917,787,7960,917,788,7961,919,768,8138,919,769,905,919,787,7976,919,788,7977,919,837,8140,921,768,8154,921,769,906,921,772,8153,921,774,8152,921,776,938,921,787,7992,921,788,7993,927,768,8184,927,769,908,927,787,8008,927,788,8009,929,788,8172,933,768,8170,933,769,910,933,772,8169,933,774,8168,933,776,939,933,788,8025,937,768,8186,937,769,911,937,787,8040,937,788,8041,937,837,8188,940,837,8116,942,837,8132,945,768,8048,945,769,940,945,772,8113,945,774,8112,945,787,7936,945,788,7937,945,834,8118,945,837,8115,949,768,8050,949,769,941,949,787,7952,949,788,7953,951,768,8052,951,769,942,951,787,7968,951,788,7969,951,834,8134,951,837,8131,953,768,8054,953,769,943,953,772,8145,953,774,8144,953,776,970,953,787,7984,953,788,7985,953,834,8150,959,768,8056,959,769,972,959,787,8000,959,788,8001,961,787,8164,961,788,8165,965,768,8058,965,769,973,965,772,8161,965,774,8160,965,776,971,965,787,8016,965,788,8017,965,834,8166,969,768,8060,969,769,974,969,787,8032,969,788,8033,969,834,8182,969,837,8179,970,768,8146,970,769,912,970,834,8151,971,768,8162,971,769,944,971,834,8167,974,837,8180,978,769,979,978,776,980,1030,776,1031,1040,774,1232,1040,776,1234,1043,769,1027,1045,768,1024,1045,774,1238,1045,776,1025,1046,774,1217,1046,776,1244,1047,776,1246,1048,768,1037,1048,772,1250,1048,774,1049,1048,776,1252,1050,769,1036,1054,776,1254,1059,772,1262,1059,774,1038,1059,776,1264,1059,779,1266,1063,776,1268,1067,776,1272,1069,776,1260,1072,774,1233,1072,776,1235,1075,769,1107,1077,768,1104,1077,774,1239,1077,776,1105,1078,774,1218,1078,776,1245,1079,776,1247,1080,768,1117,1080,772,1251,1080,774,1081,1080,776,1253,1082,769,1116,1086,776,1255,1091,772,1263,1091,774,1118,1091,776,1265,1091,779,1267,1095,776,1269,1099,776,1273,1101,776,1261,1110,776,1111,1140,783,1142,1141,783,1143,1240,776,1242,1241,776,1243,1256,776,1258,1257,776,1259,1575,1619,1570,1575,1620,1571,1575,1621,1573,1608,1620,1572,1610,1620,1574,1729,1620,1730,1746,1620,1747,1749,1620,1728,2344,2364,2345,2352,2364,2353,2355,2364,2356,2503,2494,2507,2503,2519,2508,2887,2878,2891,2887,2902,2888,2887,2903,2892,2962,3031,2964,3014,3006,3018,3014,3031,3020,3015,3006,3019,3142,3158,3144,3263,3285,3264,3270,3266,3274,3270,3285,3271,3270,3286,3272,3274,3285,3275,3398,3390,3402,3398,3415,3404,3399,3390,3403,3545,3530,3546,3545,3535,3548,3545,3551,3550,3548,3530,3549,4133,4142,4134,6917,6965,6918,6919,6965,6920,6921,6965,6922,6923,6965,6924,6925,6965,6926,6929,6965,6930,6970,6965,6971,6972,6965,6973,6974,6965,6976,6975,6965,6977,6978,6965,6979,7734,772,7736,7735,772,7737,7770,772,7772,7771,772,7773,7778,775,7784,7779,775,7785,7840,770,7852,7840,774,7862,7841,770,7853,7841,774,7863,7864,770,7878,7865,770,7879,7884,770,7896,7885,770,7897,7936,768,7938,7936,769,7940,7936,834,7942,7936,837,8064,7937,768,7939,7937,769,7941,7937,834,7943,7937,837,8065,7938,837,8066,7939,837,8067,7940,837,8068,7941,837,8069,7942,837,8070,7943,837,8071,7944,768,7946,7944,769,7948,7944,834,7950,7944,837,8072,7945,768,7947,7945,769,7949,7945,834,7951,7945,837,8073,7946,837,8074,7947,837,8075,7948,837,8076,7949,837,8077,7950,837,8078,7951,837,8079,7952,768,7954,7952,769,7956,7953,768,7955,7953,769,7957,7960,768,7962,7960,769,7964,7961,768,7963,7961,769,7965,7968,768,7970,7968,769,7972,7968,834,7974,7968,837,8080,7969,768,7971,7969,769,7973,7969,834,7975,7969,837,8081,7970,837,8082,7971,837,8083,7972,837,8084,7973,837,8085,7974,837,8086,7975,837,8087,7976,768,7978,7976,769,7980,7976,834,7982,7976,837,8088,7977,768,7979,7977,769,7981,7977,834,7983,7977,837,8089,7978,837,8090,7979,837,8091,7980,837,8092,7981,837,8093,7982,837,8094,7983,837,8095,7984,768,7986,7984,769,7988,7984,834,7990,7985,768,7987,7985,769,7989,7985,834,7991,7992,768,7994,7992,769,7996,7992,834,7998,7993,768,7995,7993,769,7997,7993,834,7999,8000,768,8002,8000,769,8004,8001,768,8003,8001,769,8005,8008,768,8010,8008,769,8012,8009,768,8011,8009,769,8013,8016,768,8018,8016,769,8020,8016,834,8022,8017,768,8019,8017,769,8021,8017,834,8023,8025,768,8027,8025,769,8029,8025,834,8031,8032,768,8034,8032,769,8036,8032,834,8038,8032,837,8096,8033,768,8035,8033,769,8037,8033,834,8039,8033,837,8097,8034,837,8098,8035,837,8099,8036,837,8100,8037,837,8101,8038,837,8102,8039,837,8103,8040,768,8042,8040,769,8044,8040,834,8046,8040,837,8104,8041,768,8043,8041,769,8045,8041,834,8047,8041,837,8105,8042,837,8106,8043,837,8107,8044,837,8108,8045,837,8109,8046,837,8110,8047,837,8111,8048,837,8114,8052,837,8130,8060,837,8178,8118,837,8119,8127,768,8141,8127,769,8142,8127,834,8143,8134,837,8135,8182,837,8183,8190,768,8157,8190,769,8158,8190,834,8159,8592,824,8602,8594,824,8603,8596,824,8622,8656,824,8653,8658,824,8655,8660,824,8654,8707,824,8708,8712,824,8713,8715,824,8716,8739,824,8740,8741,824,8742,8764,824,8769,8771,824,8772,8773,824,8775,8776,824,8777,8781,824,8813,8801,824,8802,8804,824,8816,8805,824,8817,8818,824,8820,8819,824,8821,8822,824,8824,8823,824,8825,8826,824,8832,8827,824,8833,8828,824,8928,8829,824,8929,8834,824,8836,8835,824,8837,8838,824,8840,8839,824,8841,8849,824,8930,8850,824,8931,8866,824,8876,8872,824,8877,8873,824,8878,8875,824,8879,8882,824,8938,8883,824,8939,8884,824,8940,8885,824,8941,12358,12441,12436,12363,12441,12364,12365,12441,12366,12367,12441,12368,12369,12441,12370,12371,12441,12372,12373,12441,12374,12375,12441,12376,12377,12441,12378,12379,12441,12380,12381,12441,12382,12383,12441,12384,12385,12441,12386,12388,12441,12389,12390,12441,12391,12392,12441,12393,12399,12441,12400,12399,12442,12401,12402,12441,12403,12402,12442,12404,12405,12441,12406,12405,12442,12407,12408,12441,12409,12408,12442,12410,12411,12441,12412,12411,12442,12413,12445,12441,12446,12454,12441,12532,12459,12441,12460,12461,12441,12462,12463,12441,12464,12465,12441,12466,12467,12441,12468,12469,12441,12470,12471,12441,12472,12473,12441,12474,12475,12441,12476,12477,12441,12478,12479,12441,12480,12481,12441,12482,12484,12441,12485,12486,12441,12487,12488,12441,12489,12495,12441,12496,12495,12442,12497,12498,12441,12499,12498,12442,12500,12501,12441,12502,12501,12442,12503,12504,12441,12505,12504,12442,12506,12507,12441,12508,12507,12442,12509,12527,12441,12535,12528,12441,12536,12529,12441,12537,12530,12441,12538,12541,12441,12542,67026,775,67017,67034,775,67044,69785,69818,69786,69787,69818,69788,69797,69818,69803,69937,69927,69934,69938,69927,69935,70471,70462,70475,70471,70487,70476,70530,70601,70531,70532,70587,70533,70539,70594,70542,70544,70601,70545,70594,70584,70599,70594,70594,70597,70594,70601,70600,70841,70832,70844,70841,70842,70843,70841,70845,70846,71096,71087,71098,71097,71087,71099,71989,71984,71992,90398,90398,90401,90398,90399,90403,90398,90400,90405,90398,90409,90402,90401,90399,90406,90401,90400,90408,90402,90399,90407,90409,90399,90404,93539,93543,93545,93543,93543,93544,93545,93543,93546],t.t)
B.cy=s([192,65,768,193,65,769,194,65,770,195,65,771,196,65,776,197,65,778,199,67,807,200,69,768,201,69,769,202,69,770,203,69,776,204,73,768,205,73,769,206,73,770,207,73,776,209,78,771,210,79,768,211,79,769,212,79,770,213,79,771,214,79,776,217,85,768,218,85,769,219,85,770,220,85,776,221,89,769,224,97,768,225,97,769,226,97,770,227,97,771,228,97,776,229,97,778,231,99,807,232,101,768,233,101,769,234,101,770,235,101,776,236,105,768,237,105,769,238,105,770,239,105,776,241,110,771,242,111,768,243,111,769,244,111,770,245,111,771,246,111,776,249,117,768,250,117,769,251,117,770,252,117,776,253,121,769,255,121,776,256,65,772,257,97,772,258,65,774,259,97,774,260,65,808,261,97,808,262,67,769,263,99,769,264,67,770,265,99,770,266,67,775,267,99,775,268,67,780,269,99,780,270,68,780,271,100,780,274,69,772,275,101,772,276,69,774,277,101,774,278,69,775,279,101,775,280,69,808,281,101,808,282,69,780,283,101,780,284,71,770,285,103,770,286,71,774,287,103,774,288,71,775,289,103,775,290,71,807,291,103,807,292,72,770,293,104,770,296,73,771,297,105,771,298,73,772,299,105,772,300,73,774,301,105,774,302,73,808,303,105,808,304,73,775,308,74,770,309,106,770,310,75,807,311,107,807,313,76,769,314,108,769,315,76,807,316,108,807,317,76,780,318,108,780,323,78,769,324,110,769,325,78,807,326,110,807,327,78,780,328,110,780,332,79,772,333,111,772,334,79,774,335,111,774,336,79,779,337,111,779,340,82,769,341,114,769,342,82,807,343,114,807,344,82,780,345,114,780,346,83,769,347,115,769,348,83,770,349,115,770,350,83,807,351,115,807,352,83,780,353,115,780,354,84,807,355,116,807,356,84,780,357,116,780,360,85,771,361,117,771,362,85,772,363,117,772,364,85,774,365,117,774,366,85,778,367,117,778,368,85,779,369,117,779,370,85,808,371,117,808,372,87,770,373,119,770,374,89,770,375,121,770,376,89,776,377,90,769,378,122,769,379,90,775,380,122,775,381,90,780,382,122,780,416,79,795,417,111,795,431,85,795,432,117,795,461,65,780,462,97,780,463,73,780,464,105,780,465,79,780,466,111,780,467,85,780,468,117,780,469,220,772,470,252,772,471,220,769,472,252,769,473,220,780,474,252,780,475,220,768,476,252,768,478,196,772,479,228,772,480,550,772,481,551,772,482,198,772,483,230,772,486,71,780,487,103,780,488,75,780,489,107,780,490,79,808,491,111,808,492,490,772,493,491,772,494,439,780,495,658,780,496,106,780,500,71,769,501,103,769,504,78,768,505,110,768,506,197,769,507,229,769,508,198,769,509,230,769,510,216,769,511,248,769,512,65,783,513,97,783,514,65,785,515,97,785,516,69,783,517,101,783,518,69,785,519,101,785,520,73,783,521,105,783,522,73,785,523,105,785,524,79,783,525,111,783,526,79,785,527,111,785,528,82,783,529,114,783,530,82,785,531,114,785,532,85,783,533,117,783,534,85,785,535,117,785,536,83,806,537,115,806,538,84,806,539,116,806,542,72,780,543,104,780,550,65,775,551,97,775,552,69,807,553,101,807,554,214,772,555,246,772,556,213,772,557,245,772,558,79,775,559,111,775,560,558,772,561,559,772,562,89,772,563,121,772,832,768,-1,833,769,-1,835,787,-1,836,776,769,884,697,-1,894,59,-1,901,168,769,902,913,769,903,183,-1,904,917,769,905,919,769,906,921,769,908,927,769,910,933,769,911,937,769,912,970,769,938,921,776,939,933,776,940,945,769,941,949,769,942,951,769,943,953,769,944,971,769,970,953,776,971,965,776,972,959,769,973,965,769,974,969,769,979,978,769,980,978,776,1024,1045,768,1025,1045,776,1027,1043,769,1031,1030,776,1036,1050,769,1037,1048,768,1038,1059,774,1049,1048,774,1081,1080,774,1104,1077,768,1105,1077,776,1107,1075,769,1111,1110,776,1116,1082,769,1117,1080,768,1118,1091,774,1142,1140,783,1143,1141,783,1217,1046,774,1218,1078,774,1232,1040,774,1233,1072,774,1234,1040,776,1235,1072,776,1238,1045,774,1239,1077,774,1242,1240,776,1243,1241,776,1244,1046,776,1245,1078,776,1246,1047,776,1247,1079,776,1250,1048,772,1251,1080,772,1252,1048,776,1253,1080,776,1254,1054,776,1255,1086,776,1258,1256,776,1259,1257,776,1260,1069,776,1261,1101,776,1262,1059,772,1263,1091,772,1264,1059,776,1265,1091,776,1266,1059,779,1267,1091,779,1268,1063,776,1269,1095,776,1272,1067,776,1273,1099,776,1570,1575,1619,1571,1575,1620,1572,1608,1620,1573,1575,1621,1574,1610,1620,1728,1749,1620,1730,1729,1620,1747,1746,1620,2345,2344,2364,2353,2352,2364,2356,2355,2364,2392,2325,2364,2393,2326,2364,2394,2327,2364,2395,2332,2364,2396,2337,2364,2397,2338,2364,2398,2347,2364,2399,2351,2364,2507,2503,2494,2508,2503,2519,2524,2465,2492,2525,2466,2492,2527,2479,2492,2611,2610,2620,2614,2616,2620,2649,2582,2620,2650,2583,2620,2651,2588,2620,2654,2603,2620,2888,2887,2902,2891,2887,2878,2892,2887,2903,2908,2849,2876,2909,2850,2876,2964,2962,3031,3018,3014,3006,3019,3015,3006,3020,3014,3031,3144,3142,3158,3264,3263,3285,3271,3270,3285,3272,3270,3286,3274,3270,3266,3275,3274,3285,3402,3398,3390,3403,3399,3390,3404,3398,3415,3546,3545,3530,3548,3545,3535,3549,3548,3530,3550,3545,3551,3907,3906,4023,3917,3916,4023,3922,3921,4023,3927,3926,4023,3932,3931,4023,3945,3904,4021,3955,3953,3954,3957,3953,3956,3958,4018,3968,3960,4019,3968,3969,3953,3968,3987,3986,4023,3997,3996,4023,4002,4001,4023,4007,4006,4023,4012,4011,4023,4025,3984,4021,4134,4133,4142,6918,6917,6965,6920,6919,6965,6922,6921,6965,6924,6923,6965,6926,6925,6965,6930,6929,6965,6971,6970,6965,6973,6972,6965,6976,6974,6965,6977,6975,6965,6979,6978,6965,7680,65,805,7681,97,805,7682,66,775,7683,98,775,7684,66,803,7685,98,803,7686,66,817,7687,98,817,7688,199,769,7689,231,769,7690,68,775,7691,100,775,7692,68,803,7693,100,803,7694,68,817,7695,100,817,7696,68,807,7697,100,807,7698,68,813,7699,100,813,7700,274,768,7701,275,768,7702,274,769,7703,275,769,7704,69,813,7705,101,813,7706,69,816,7707,101,816,7708,552,774,7709,553,774,7710,70,775,7711,102,775,7712,71,772,7713,103,772,7714,72,775,7715,104,775,7716,72,803,7717,104,803,7718,72,776,7719,104,776,7720,72,807,7721,104,807,7722,72,814,7723,104,814,7724,73,816,7725,105,816,7726,207,769,7727,239,769,7728,75,769,7729,107,769,7730,75,803,7731,107,803,7732,75,817,7733,107,817,7734,76,803,7735,108,803,7736,7734,772,7737,7735,772,7738,76,817,7739,108,817,7740,76,813,7741,108,813,7742,77,769,7743,109,769,7744,77,775,7745,109,775,7746,77,803,7747,109,803,7748,78,775,7749,110,775,7750,78,803,7751,110,803,7752,78,817,7753,110,817,7754,78,813,7755,110,813,7756,213,769,7757,245,769,7758,213,776,7759,245,776,7760,332,768,7761,333,768,7762,332,769,7763,333,769,7764,80,769,7765,112,769,7766,80,775,7767,112,775,7768,82,775,7769,114,775,7770,82,803,7771,114,803,7772,7770,772,7773,7771,772,7774,82,817,7775,114,817,7776,83,775,7777,115,775,7778,83,803,7779,115,803,7780,346,775,7781,347,775,7782,352,775,7783,353,775,7784,7778,775,7785,7779,775,7786,84,775,7787,116,775,7788,84,803,7789,116,803,7790,84,817,7791,116,817,7792,84,813,7793,116,813,7794,85,804,7795,117,804,7796,85,816,7797,117,816,7798,85,813,7799,117,813,7800,360,769,7801,361,769,7802,362,776,7803,363,776,7804,86,771,7805,118,771,7806,86,803,7807,118,803,7808,87,768,7809,119,768,7810,87,769,7811,119,769,7812,87,776,7813,119,776,7814,87,775,7815,119,775,7816,87,803,7817,119,803,7818,88,775,7819,120,775,7820,88,776,7821,120,776,7822,89,775,7823,121,775,7824,90,770,7825,122,770,7826,90,803,7827,122,803,7828,90,817,7829,122,817,7830,104,817,7831,116,776,7832,119,778,7833,121,778,7835,383,775,7840,65,803,7841,97,803,7842,65,777,7843,97,777,7844,194,769,7845,226,769,7846,194,768,7847,226,768,7848,194,777,7849,226,777,7850,194,771,7851,226,771,7852,7840,770,7853,7841,770,7854,258,769,7855,259,769,7856,258,768,7857,259,768,7858,258,777,7859,259,777,7860,258,771,7861,259,771,7862,7840,774,7863,7841,774,7864,69,803,7865,101,803,7866,69,777,7867,101,777,7868,69,771,7869,101,771,7870,202,769,7871,234,769,7872,202,768,7873,234,768,7874,202,777,7875,234,777,7876,202,771,7877,234,771,7878,7864,770,7879,7865,770,7880,73,777,7881,105,777,7882,73,803,7883,105,803,7884,79,803,7885,111,803,7886,79,777,7887,111,777,7888,212,769,7889,244,769,7890,212,768,7891,244,768,7892,212,777,7893,244,777,7894,212,771,7895,244,771,7896,7884,770,7897,7885,770,7898,416,769,7899,417,769,7900,416,768,7901,417,768,7902,416,777,7903,417,777,7904,416,771,7905,417,771,7906,416,803,7907,417,803,7908,85,803,7909,117,803,7910,85,777,7911,117,777,7912,431,769,7913,432,769,7914,431,768,7915,432,768,7916,431,777,7917,432,777,7918,431,771,7919,432,771,7920,431,803,7921,432,803,7922,89,768,7923,121,768,7924,89,803,7925,121,803,7926,89,777,7927,121,777,7928,89,771,7929,121,771,7936,945,787,7937,945,788,7938,7936,768,7939,7937,768,7940,7936,769,7941,7937,769,7942,7936,834,7943,7937,834,7944,913,787,7945,913,788,7946,7944,768,7947,7945,768,7948,7944,769,7949,7945,769,7950,7944,834,7951,7945,834,7952,949,787,7953,949,788,7954,7952,768,7955,7953,768,7956,7952,769,7957,7953,769,7960,917,787,7961,917,788,7962,7960,768,7963,7961,768,7964,7960,769,7965,7961,769,7968,951,787,7969,951,788,7970,7968,768,7971,7969,768,7972,7968,769,7973,7969,769,7974,7968,834,7975,7969,834,7976,919,787,7977,919,788,7978,7976,768,7979,7977,768,7980,7976,769,7981,7977,769,7982,7976,834,7983,7977,834,7984,953,787,7985,953,788,7986,7984,768,7987,7985,768,7988,7984,769,7989,7985,769,7990,7984,834,7991,7985,834,7992,921,787,7993,921,788,7994,7992,768,7995,7993,768,7996,7992,769,7997,7993,769,7998,7992,834,7999,7993,834,8000,959,787,8001,959,788,8002,8000,768,8003,8001,768,8004,8000,769,8005,8001,769,8008,927,787,8009,927,788,8010,8008,768,8011,8009,768,8012,8008,769,8013,8009,769,8016,965,787,8017,965,788,8018,8016,768,8019,8017,768,8020,8016,769,8021,8017,769,8022,8016,834,8023,8017,834,8025,933,788,8027,8025,768,8029,8025,769,8031,8025,834,8032,969,787,8033,969,788,8034,8032,768,8035,8033,768,8036,8032,769,8037,8033,769,8038,8032,834,8039,8033,834,8040,937,787,8041,937,788,8042,8040,768,8043,8041,768,8044,8040,769,8045,8041,769,8046,8040,834,8047,8041,834,8048,945,768,8049,940,-1,8050,949,768,8051,941,-1,8052,951,768,8053,942,-1,8054,953,768,8055,943,-1,8056,959,768,8057,972,-1,8058,965,768,8059,973,-1,8060,969,768,8061,974,-1,8064,7936,837,8065,7937,837,8066,7938,837,8067,7939,837,8068,7940,837,8069,7941,837,8070,7942,837,8071,7943,837,8072,7944,837,8073,7945,837,8074,7946,837,8075,7947,837,8076,7948,837,8077,7949,837,8078,7950,837,8079,7951,837,8080,7968,837,8081,7969,837,8082,7970,837,8083,7971,837,8084,7972,837,8085,7973,837,8086,7974,837,8087,7975,837,8088,7976,837,8089,7977,837,8090,7978,837,8091,7979,837,8092,7980,837,8093,7981,837,8094,7982,837,8095,7983,837,8096,8032,837,8097,8033,837,8098,8034,837,8099,8035,837,8100,8036,837,8101,8037,837,8102,8038,837,8103,8039,837,8104,8040,837,8105,8041,837,8106,8042,837,8107,8043,837,8108,8044,837,8109,8045,837,8110,8046,837,8111,8047,837,8112,945,774,8113,945,772,8114,8048,837,8115,945,837,8116,940,837,8118,945,834,8119,8118,837,8120,913,774,8121,913,772,8122,913,768,8123,902,-1,8124,913,837,8126,953,-1,8129,168,834,8130,8052,837,8131,951,837,8132,942,837,8134,951,834,8135,8134,837,8136,917,768,8137,904,-1,8138,919,768,8139,905,-1,8140,919,837,8141,8127,768,8142,8127,769,8143,8127,834,8144,953,774,8145,953,772,8146,970,768,8147,912,-1,8150,953,834,8151,970,834,8152,921,774,8153,921,772,8154,921,768,8155,906,-1,8157,8190,768,8158,8190,769,8159,8190,834,8160,965,774,8161,965,772,8162,971,768,8163,944,-1,8164,961,787,8165,961,788,8166,965,834,8167,971,834,8168,933,774,8169,933,772,8170,933,768,8171,910,-1,8172,929,788,8173,168,768,8174,901,-1,8175,96,-1,8178,8060,837,8179,969,837,8180,974,837,8182,969,834,8183,8182,837,8184,927,768,8185,908,-1,8186,937,768,8187,911,-1,8188,937,837,8189,180,-1,8192,8194,-1,8193,8195,-1,8486,937,-1,8490,75,-1,8491,197,-1,8602,8592,824,8603,8594,824,8622,8596,824,8653,8656,824,8654,8660,824,8655,8658,824,8708,8707,824,8713,8712,824,8716,8715,824,8740,8739,824,8742,8741,824,8769,8764,824,8772,8771,824,8775,8773,824,8777,8776,824,8800,61,824,8802,8801,824,8813,8781,824,8814,60,824,8815,62,824,8816,8804,824,8817,8805,824,8820,8818,824,8821,8819,824,8824,8822,824,8825,8823,824,8832,8826,824,8833,8827,824,8836,8834,824,8837,8835,824,8840,8838,824,8841,8839,824,8876,8866,824,8877,8872,824,8878,8873,824,8879,8875,824,8928,8828,824,8929,8829,824,8930,8849,824,8931,8850,824,8938,8882,824,8939,8883,824,8940,8884,824,8941,8885,824,9001,12296,-1,9002,12297,-1,10972,10973,824,12364,12363,12441,12366,12365,12441,12368,12367,12441,12370,12369,12441,12372,12371,12441,12374,12373,12441,12376,12375,12441,12378,12377,12441,12380,12379,12441,12382,12381,12441,12384,12383,12441,12386,12385,12441,12389,12388,12441,12391,12390,12441,12393,12392,12441,12400,12399,12441,12401,12399,12442,12403,12402,12441,12404,12402,12442,12406,12405,12441,12407,12405,12442,12409,12408,12441,12410,12408,12442,12412,12411,12441,12413,12411,12442,12436,12358,12441,12446,12445,12441,12460,12459,12441,12462,12461,12441,12464,12463,12441,12466,12465,12441,12468,12467,12441,12470,12469,12441,12472,12471,12441,12474,12473,12441,12476,12475,12441,12478,12477,12441,12480,12479,12441,12482,12481,12441,12485,12484,12441,12487,12486,12441,12489,12488,12441,12496,12495,12441,12497,12495,12442,12499,12498,12441,12500,12498,12442,12502,12501,12441,12503,12501,12442,12505,12504,12441,12506,12504,12442,12508,12507,12441,12509,12507,12442,12532,12454,12441,12535,12527,12441,12536,12528,12441,12537,12529,12441,12538,12530,12441,12542,12541,12441,63744,35912,-1,63745,26356,-1,63746,36554,-1,63747,36040,-1,63748,28369,-1,63749,20018,-1,63750,21477,-1,63751,40860,-1,63752,40860,-1,63753,22865,-1,63754,37329,-1,63755,21895,-1,63756,22856,-1,63757,25078,-1,63758,30313,-1,63759,32645,-1,63760,34367,-1,63761,34746,-1,63762,35064,-1,63763,37007,-1,63764,27138,-1,63765,27931,-1,63766,28889,-1,63767,29662,-1,63768,33853,-1,63769,37226,-1,63770,39409,-1,63771,20098,-1,63772,21365,-1,63773,27396,-1,63774,29211,-1,63775,34349,-1,63776,40478,-1,63777,23888,-1,63778,28651,-1,63779,34253,-1,63780,35172,-1,63781,25289,-1,63782,33240,-1,63783,34847,-1,63784,24266,-1,63785,26391,-1,63786,28010,-1,63787,29436,-1,63788,37070,-1,63789,20358,-1,63790,20919,-1,63791,21214,-1,63792,25796,-1,63793,27347,-1,63794,29200,-1,63795,30439,-1,63796,32769,-1,63797,34310,-1,63798,34396,-1,63799,36335,-1,63800,38706,-1,63801,39791,-1,63802,40442,-1,63803,30860,-1,63804,31103,-1,63805,32160,-1,63806,33737,-1,63807,37636,-1,63808,40575,-1,63809,35542,-1,63810,22751,-1,63811,24324,-1,63812,31840,-1,63813,32894,-1,63814,29282,-1,63815,30922,-1,63816,36034,-1,63817,38647,-1,63818,22744,-1,63819,23650,-1,63820,27155,-1,63821,28122,-1,63822,28431,-1,63823,32047,-1,63824,32311,-1,63825,38475,-1,63826,21202,-1,63827,32907,-1,63828,20956,-1,63829,20940,-1,63830,31260,-1,63831,32190,-1,63832,33777,-1,63833,38517,-1,63834,35712,-1,63835,25295,-1,63836,27138,-1,63837,35582,-1,63838,20025,-1,63839,23527,-1,63840,24594,-1,63841,29575,-1,63842,30064,-1,63843,21271,-1,63844,30971,-1,63845,20415,-1,63846,24489,-1,63847,19981,-1,63848,27852,-1,63849,25976,-1,63850,32034,-1,63851,21443,-1,63852,22622,-1,63853,30465,-1,63854,33865,-1,63855,35498,-1,63856,27578,-1,63857,36784,-1,63858,27784,-1,63859,25342,-1,63860,33509,-1,63861,25504,-1,63862,30053,-1,63863,20142,-1,63864,20841,-1,63865,20937,-1,63866,26753,-1,63867,31975,-1,63868,33391,-1,63869,35538,-1,63870,37327,-1,63871,21237,-1,63872,21570,-1,63873,22899,-1,63874,24300,-1,63875,26053,-1,63876,28670,-1,63877,31018,-1,63878,38317,-1,63879,39530,-1,63880,40599,-1,63881,40654,-1,63882,21147,-1,63883,26310,-1,63884,27511,-1,63885,36706,-1,63886,24180,-1,63887,24976,-1,63888,25088,-1,63889,25754,-1,63890,28451,-1,63891,29001,-1,63892,29833,-1,63893,31178,-1,63894,32244,-1,63895,32879,-1,63896,36646,-1,63897,34030,-1,63898,36899,-1,63899,37706,-1,63900,21015,-1,63901,21155,-1,63902,21693,-1,63903,28872,-1,63904,35010,-1,63905,35498,-1,63906,24265,-1,63907,24565,-1,63908,25467,-1,63909,27566,-1,63910,31806,-1,63911,29557,-1,63912,20196,-1,63913,22265,-1,63914,23527,-1,63915,23994,-1,63916,24604,-1,63917,29618,-1,63918,29801,-1,63919,32666,-1,63920,32838,-1,63921,37428,-1,63922,38646,-1,63923,38728,-1,63924,38936,-1,63925,20363,-1,63926,31150,-1,63927,37300,-1,63928,38584,-1,63929,24801,-1,63930,20102,-1,63931,20698,-1,63932,23534,-1,63933,23615,-1,63934,26009,-1,63935,27138,-1,63936,29134,-1,63937,30274,-1,63938,34044,-1,63939,36988,-1,63940,40845,-1,63941,26248,-1,63942,38446,-1,63943,21129,-1,63944,26491,-1,63945,26611,-1,63946,27969,-1,63947,28316,-1,63948,29705,-1,63949,30041,-1,63950,30827,-1,63951,32016,-1,63952,39006,-1,63953,20845,-1,63954,25134,-1,63955,38520,-1,63956,20523,-1,63957,23833,-1,63958,28138,-1,63959,36650,-1,63960,24459,-1,63961,24900,-1,63962,26647,-1,63963,29575,-1,63964,38534,-1,63965,21033,-1,63966,21519,-1,63967,23653,-1,63968,26131,-1,63969,26446,-1,63970,26792,-1,63971,27877,-1,63972,29702,-1,63973,30178,-1,63974,32633,-1,63975,35023,-1,63976,35041,-1,63977,37324,-1,63978,38626,-1,63979,21311,-1,63980,28346,-1,63981,21533,-1,63982,29136,-1,63983,29848,-1,63984,34298,-1,63985,38563,-1,63986,40023,-1,63987,40607,-1,63988,26519,-1,63989,28107,-1,63990,33256,-1,63991,31435,-1,63992,31520,-1,63993,31890,-1,63994,29376,-1,63995,28825,-1,63996,35672,-1,63997,20160,-1,63998,33590,-1,63999,21050,-1,64e3,20999,-1,64001,24230,-1,64002,25299,-1,64003,31958,-1,64004,23429,-1,64005,27934,-1,64006,26292,-1,64007,36667,-1,64008,34892,-1,64009,38477,-1,64010,35211,-1,64011,24275,-1,64012,20800,-1,64013,21952,-1,64016,22618,-1,64018,26228,-1,64021,20958,-1,64022,29482,-1,64023,30410,-1,64024,31036,-1,64025,31070,-1,64026,31077,-1,64027,31119,-1,64028,38742,-1,64029,31934,-1,64030,32701,-1,64032,34322,-1,64034,35576,-1,64037,36920,-1,64038,37117,-1,64042,39151,-1,64043,39164,-1,64044,39208,-1,64045,40372,-1,64046,37086,-1,64047,38583,-1,64048,20398,-1,64049,20711,-1,64050,20813,-1,64051,21193,-1,64052,21220,-1,64053,21329,-1,64054,21917,-1,64055,22022,-1,64056,22120,-1,64057,22592,-1,64058,22696,-1,64059,23652,-1,64060,23662,-1,64061,24724,-1,64062,24936,-1,64063,24974,-1,64064,25074,-1,64065,25935,-1,64066,26082,-1,64067,26257,-1,64068,26757,-1,64069,28023,-1,64070,28186,-1,64071,28450,-1,64072,29038,-1,64073,29227,-1,64074,29730,-1,64075,30865,-1,64076,31038,-1,64077,31049,-1,64078,31048,-1,64079,31056,-1,64080,31062,-1,64081,31069,-1,64082,31117,-1,64083,31118,-1,64084,31296,-1,64085,31361,-1,64086,31680,-1,64087,32244,-1,64088,32265,-1,64089,32321,-1,64090,32626,-1,64091,32773,-1,64092,33261,-1,64093,33401,-1,64094,33401,-1,64095,33879,-1,64096,35088,-1,64097,35222,-1,64098,35585,-1,64099,35641,-1,64100,36051,-1,64101,36104,-1,64102,36790,-1,64103,36920,-1,64104,38627,-1,64105,38911,-1,64106,38971,-1,64107,24693,-1,64108,148206,-1,64109,33304,-1,64112,20006,-1,64113,20917,-1,64114,20840,-1,64115,20352,-1,64116,20805,-1,64117,20864,-1,64118,21191,-1,64119,21242,-1,64120,21917,-1,64121,21845,-1,64122,21913,-1,64123,21986,-1,64124,22618,-1,64125,22707,-1,64126,22852,-1,64127,22868,-1,64128,23138,-1,64129,23336,-1,64130,24274,-1,64131,24281,-1,64132,24425,-1,64133,24493,-1,64134,24792,-1,64135,24910,-1,64136,24840,-1,64137,24974,-1,64138,24928,-1,64139,25074,-1,64140,25140,-1,64141,25540,-1,64142,25628,-1,64143,25682,-1,64144,25942,-1,64145,26228,-1,64146,26391,-1,64147,26395,-1,64148,26454,-1,64149,27513,-1,64150,27578,-1,64151,27969,-1,64152,28379,-1,64153,28363,-1,64154,28450,-1,64155,28702,-1,64156,29038,-1,64157,30631,-1,64158,29237,-1,64159,29359,-1,64160,29482,-1,64161,29809,-1,64162,29958,-1,64163,30011,-1,64164,30237,-1,64165,30239,-1,64166,30410,-1,64167,30427,-1,64168,30452,-1,64169,30538,-1,64170,30528,-1,64171,30924,-1,64172,31409,-1,64173,31680,-1,64174,31867,-1,64175,32091,-1,64176,32244,-1,64177,32574,-1,64178,32773,-1,64179,33618,-1,64180,33775,-1,64181,34681,-1,64182,35137,-1,64183,35206,-1,64184,35222,-1,64185,35519,-1,64186,35576,-1,64187,35531,-1,64188,35585,-1,64189,35582,-1,64190,35565,-1,64191,35641,-1,64192,35722,-1,64193,36104,-1,64194,36664,-1,64195,36978,-1,64196,37273,-1,64197,37494,-1,64198,38524,-1,64199,38627,-1,64200,38742,-1,64201,38875,-1,64202,38911,-1,64203,38923,-1,64204,38971,-1,64205,39698,-1,64206,40860,-1,64207,141386,-1,64208,141380,-1,64209,144341,-1,64210,15261,-1,64211,16408,-1,64212,16441,-1,64213,152137,-1,64214,154832,-1,64215,163539,-1,64216,40771,-1,64217,40846,-1,64285,1497,1460,64287,1522,1463,64298,1513,1473,64299,1513,1474,64300,64329,1473,64301,64329,1474,64302,1488,1463,64303,1488,1464,64304,1488,1468,64305,1489,1468,64306,1490,1468,64307,1491,1468,64308,1492,1468,64309,1493,1468,64310,1494,1468,64312,1496,1468,64313,1497,1468,64314,1498,1468,64315,1499,1468,64316,1500,1468,64318,1502,1468,64320,1504,1468,64321,1505,1468,64323,1507,1468,64324,1508,1468,64326,1510,1468,64327,1511,1468,64328,1512,1468,64329,1513,1468,64330,1514,1468,64331,1493,1465,64332,1489,1471,64333,1499,1471,64334,1508,1471,67017,67026,775,67044,67034,775,69786,69785,69818,69788,69787,69818,69803,69797,69818,69934,69937,69927,69935,69938,69927,70475,70471,70462,70476,70471,70487,70531,70530,70601,70533,70532,70587,70542,70539,70594,70545,70544,70601,70597,70594,70594,70599,70594,70584,70600,70594,70601,70843,70841,70842,70844,70841,70832,70846,70841,70845,71098,71096,71087,71099,71097,71087,71992,71989,71984,90401,90398,90398,90402,90398,90409,90403,90398,90399,90404,90409,90399,90405,90398,90400,90406,90401,90399,90407,90402,90399,90408,90401,90400,93544,93543,93543,93545,93539,93543,93546,93545,93543,119134,119127,119141,119135,119128,119141,119136,119135,119150,119137,119135,119151,119138,119135,119152,119139,119135,119153,119140,119135,119154,119227,119225,119141,119228,119226,119141,119229,119227,119150,119230,119228,119150,119231,119227,119151,119232,119228,119151,194560,20029,-1,194561,20024,-1,194562,20033,-1,194563,131362,-1,194564,20320,-1,194565,20398,-1,194566,20411,-1,194567,20482,-1,194568,20602,-1,194569,20633,-1,194570,20711,-1,194571,20687,-1,194572,13470,-1,194573,132666,-1,194574,20813,-1,194575,20820,-1,194576,20836,-1,194577,20855,-1,194578,132380,-1,194579,13497,-1,194580,20839,-1,194581,20877,-1,194582,132427,-1,194583,20887,-1,194584,20900,-1,194585,20172,-1,194586,20908,-1,194587,20917,-1,194588,168415,-1,194589,20981,-1,194590,20995,-1,194591,13535,-1,194592,21051,-1,194593,21062,-1,194594,21106,-1,194595,21111,-1,194596,13589,-1,194597,21191,-1,194598,21193,-1,194599,21220,-1,194600,21242,-1,194601,21253,-1,194602,21254,-1,194603,21271,-1,194604,21321,-1,194605,21329,-1,194606,21338,-1,194607,21363,-1,194608,21373,-1,194609,21375,-1,194610,21375,-1,194611,21375,-1,194612,133676,-1,194613,28784,-1,194614,21450,-1,194615,21471,-1,194616,133987,-1,194617,21483,-1,194618,21489,-1,194619,21510,-1,194620,21662,-1,194621,21560,-1,194622,21576,-1,194623,21608,-1,194624,21666,-1,194625,21750,-1,194626,21776,-1,194627,21843,-1,194628,21859,-1,194629,21892,-1,194630,21892,-1,194631,21913,-1,194632,21931,-1,194633,21939,-1,194634,21954,-1,194635,22294,-1,194636,22022,-1,194637,22295,-1,194638,22097,-1,194639,22132,-1,194640,20999,-1,194641,22766,-1,194642,22478,-1,194643,22516,-1,194644,22541,-1,194645,22411,-1,194646,22578,-1,194647,22577,-1,194648,22700,-1,194649,136420,-1,194650,22770,-1,194651,22775,-1,194652,22790,-1,194653,22810,-1,194654,22818,-1,194655,22882,-1,194656,136872,-1,194657,136938,-1,194658,23020,-1,194659,23067,-1,194660,23079,-1,194661,23e3,-1,194662,23142,-1,194663,14062,-1,194664,14076,-1,194665,23304,-1,194666,23358,-1,194667,23358,-1,194668,137672,-1,194669,23491,-1,194670,23512,-1,194671,23527,-1,194672,23539,-1,194673,138008,-1,194674,23551,-1,194675,23558,-1,194676,24403,-1,194677,23586,-1,194678,14209,-1,194679,23648,-1,194680,23662,-1,194681,23744,-1,194682,23693,-1,194683,138724,-1,194684,23875,-1,194685,138726,-1,194686,23918,-1,194687,23915,-1,194688,23932,-1,194689,24033,-1,194690,24034,-1,194691,14383,-1,194692,24061,-1,194693,24104,-1,194694,24125,-1,194695,24169,-1,194696,14434,-1,194697,139651,-1,194698,14460,-1,194699,24240,-1,194700,24243,-1,194701,24246,-1,194702,24266,-1,194703,172946,-1,194704,24318,-1,194705,140081,-1,194706,140081,-1,194707,33281,-1,194708,24354,-1,194709,24354,-1,194710,14535,-1,194711,144056,-1,194712,156122,-1,194713,24418,-1,194714,24427,-1,194715,14563,-1,194716,24474,-1,194717,24525,-1,194718,24535,-1,194719,24569,-1,194720,24705,-1,194721,14650,-1,194722,14620,-1,194723,24724,-1,194724,141012,-1,194725,24775,-1,194726,24904,-1,194727,24908,-1,194728,24910,-1,194729,24908,-1,194730,24954,-1,194731,24974,-1,194732,25010,-1,194733,24996,-1,194734,25007,-1,194735,25054,-1,194736,25074,-1,194737,25078,-1,194738,25104,-1,194739,25115,-1,194740,25181,-1,194741,25265,-1,194742,25300,-1,194743,25424,-1,194744,142092,-1,194745,25405,-1,194746,25340,-1,194747,25448,-1,194748,25475,-1,194749,25572,-1,194750,142321,-1,194751,25634,-1,194752,25541,-1,194753,25513,-1,194754,14894,-1,194755,25705,-1,194756,25726,-1,194757,25757,-1,194758,25719,-1,194759,14956,-1,194760,25935,-1,194761,25964,-1,194762,143370,-1,194763,26083,-1,194764,26360,-1,194765,26185,-1,194766,15129,-1,194767,26257,-1,194768,15112,-1,194769,15076,-1,194770,20882,-1,194771,20885,-1,194772,26368,-1,194773,26268,-1,194774,32941,-1,194775,17369,-1,194776,26391,-1,194777,26395,-1,194778,26401,-1,194779,26462,-1,194780,26451,-1,194781,144323,-1,194782,15177,-1,194783,26618,-1,194784,26501,-1,194785,26706,-1,194786,26757,-1,194787,144493,-1,194788,26766,-1,194789,26655,-1,194790,26900,-1,194791,15261,-1,194792,26946,-1,194793,27043,-1,194794,27114,-1,194795,27304,-1,194796,145059,-1,194797,27355,-1,194798,15384,-1,194799,27425,-1,194800,145575,-1,194801,27476,-1,194802,15438,-1,194803,27506,-1,194804,27551,-1,194805,27578,-1,194806,27579,-1,194807,146061,-1,194808,138507,-1,194809,146170,-1,194810,27726,-1,194811,146620,-1,194812,27839,-1,194813,27853,-1,194814,27751,-1,194815,27926,-1,194816,27966,-1,194817,28023,-1,194818,27969,-1,194819,28009,-1,194820,28024,-1,194821,28037,-1,194822,146718,-1,194823,27956,-1,194824,28207,-1,194825,28270,-1,194826,15667,-1,194827,28363,-1,194828,28359,-1,194829,147153,-1,194830,28153,-1,194831,28526,-1,194832,147294,-1,194833,147342,-1,194834,28614,-1,194835,28729,-1,194836,28702,-1,194837,28699,-1,194838,15766,-1,194839,28746,-1,194840,28797,-1,194841,28791,-1,194842,28845,-1,194843,132389,-1,194844,28997,-1,194845,148067,-1,194846,29084,-1,194847,148395,-1,194848,29224,-1,194849,29237,-1,194850,29264,-1,194851,149e3,-1,194852,29312,-1,194853,29333,-1,194854,149301,-1,194855,149524,-1,194856,29562,-1,194857,29579,-1,194858,16044,-1,194859,29605,-1,194860,16056,-1,194861,16056,-1,194862,29767,-1,194863,29788,-1,194864,29809,-1,194865,29829,-1,194866,29898,-1,194867,16155,-1,194868,29988,-1,194869,150582,-1,194870,30014,-1,194871,150674,-1,194872,30064,-1,194873,139679,-1,194874,30224,-1,194875,151457,-1,194876,151480,-1,194877,151620,-1,194878,16380,-1,194879,16392,-1,194880,30452,-1,194881,151795,-1,194882,151794,-1,194883,151833,-1,194884,151859,-1,194885,30494,-1,194886,30495,-1,194887,30495,-1,194888,30538,-1,194889,16441,-1,194890,30603,-1,194891,16454,-1,194892,16534,-1,194893,152605,-1,194894,30798,-1,194895,30860,-1,194896,30924,-1,194897,16611,-1,194898,153126,-1,194899,31062,-1,194900,153242,-1,194901,153285,-1,194902,31119,-1,194903,31211,-1,194904,16687,-1,194905,31296,-1,194906,31306,-1,194907,31311,-1,194908,153980,-1,194909,154279,-1,194910,154279,-1,194911,31470,-1,194912,16898,-1,194913,154539,-1,194914,31686,-1,194915,31689,-1,194916,16935,-1,194917,154752,-1,194918,31954,-1,194919,17056,-1,194920,31976,-1,194921,31971,-1,194922,32e3,-1,194923,155526,-1,194924,32099,-1,194925,17153,-1,194926,32199,-1,194927,32258,-1,194928,32325,-1,194929,17204,-1,194930,156200,-1,194931,156231,-1,194932,17241,-1,194933,156377,-1,194934,32634,-1,194935,156478,-1,194936,32661,-1,194937,32762,-1,194938,32773,-1,194939,156890,-1,194940,156963,-1,194941,32864,-1,194942,157096,-1,194943,32880,-1,194944,144223,-1,194945,17365,-1,194946,32946,-1,194947,33027,-1,194948,17419,-1,194949,33086,-1,194950,23221,-1,194951,157607,-1,194952,157621,-1,194953,144275,-1,194954,144284,-1,194955,33281,-1,194956,33284,-1,194957,36766,-1,194958,17515,-1,194959,33425,-1,194960,33419,-1,194961,33437,-1,194962,21171,-1,194963,33457,-1,194964,33459,-1,194965,33469,-1,194966,33510,-1,194967,158524,-1,194968,33509,-1,194969,33565,-1,194970,33635,-1,194971,33709,-1,194972,33571,-1,194973,33725,-1,194974,33767,-1,194975,33879,-1,194976,33619,-1,194977,33738,-1,194978,33740,-1,194979,33756,-1,194980,158774,-1,194981,159083,-1,194982,158933,-1,194983,17707,-1,194984,34033,-1,194985,34035,-1,194986,34070,-1,194987,160714,-1,194988,34148,-1,194989,159532,-1,194990,17757,-1,194991,17761,-1,194992,159665,-1,194993,159954,-1,194994,17771,-1,194995,34384,-1,194996,34396,-1,194997,34407,-1,194998,34409,-1,194999,34473,-1,195e3,34440,-1,195001,34574,-1,195002,34530,-1,195003,34681,-1,195004,34600,-1,195005,34667,-1,195006,34694,-1,195007,17879,-1,195008,34785,-1,195009,34817,-1,195010,17913,-1,195011,34912,-1,195012,34915,-1,195013,161383,-1,195014,35031,-1,195015,35038,-1,195016,17973,-1,195017,35066,-1,195018,13499,-1,195019,161966,-1,195020,162150,-1,195021,18110,-1,195022,18119,-1,195023,35488,-1,195024,35565,-1,195025,35722,-1,195026,35925,-1,195027,162984,-1,195028,36011,-1,195029,36033,-1,195030,36123,-1,195031,36215,-1,195032,163631,-1,195033,133124,-1,195034,36299,-1,195035,36284,-1,195036,36336,-1,195037,133342,-1,195038,36564,-1,195039,36664,-1,195040,165330,-1,195041,165357,-1,195042,37012,-1,195043,37105,-1,195044,37137,-1,195045,165678,-1,195046,37147,-1,195047,37432,-1,195048,37591,-1,195049,37592,-1,195050,37500,-1,195051,37881,-1,195052,37909,-1,195053,166906,-1,195054,38283,-1,195055,18837,-1,195056,38327,-1,195057,167287,-1,195058,18918,-1,195059,38595,-1,195060,23986,-1,195061,38691,-1,195062,168261,-1,195063,168474,-1,195064,19054,-1,195065,19062,-1,195066,38880,-1,195067,168970,-1,195068,19122,-1,195069,169110,-1,195070,38923,-1,195071,38923,-1,195072,38953,-1,195073,169398,-1,195074,39138,-1,195075,19251,-1,195076,39209,-1,195077,39335,-1,195078,39362,-1,195079,39422,-1,195080,19406,-1,195081,170800,-1,195082,39698,-1,195083,4e4,-1,195084,40189,-1,195085,19662,-1,195086,19693,-1,195087,40295,-1,195088,172238,-1,195089,19704,-1,195090,172293,-1,195091,172558,-1,195092,172689,-1,195093,40635,-1,195094,19798,-1,195095,40697,-1,195096,40702,-1,195097,40709,-1,195098,40719,-1,195099,40726,-1,195100,40763,-1,195101,173568,-1],t.t)
B.cz=s(["","@2x"],t.s)
B.cA=s(["line-color","line-opacity","line-width","line-gap-width","line-offset","line-blur","line-pattern","line-dasharray"],t.s)
B.cB=s(["heatmap-weight","heatmap-radius"],t.s)
B.a8=s([1769172844,1718185569,1718185522,1718185523,1835361385,1835361330,1768843636],t.t)
B.cC=s([0,64,25,65,90,74,91,96,25,97,122,74,123,169,25,170,170,74,171,185,25,186,186,74,187,191,25,192,214,74,215,215,25,216,246,74,247,247,25,248,696,74,697,735,25,736,740,74,741,745,25,746,747,13,748,767,25,768,879,58,880,883,45,884,884,25,885,887,45,890,893,45,894,894,25,895,895,45,900,900,45,901,901,25,902,902,45,903,903,25,904,906,45,908,908,45,910,929,45,931,993,45,994,1007,26,1008,1023,45,1024,1156,30,1157,1158,58,1159,1327,30,1329,1366,5,1369,1418,5,1421,1423,5,1425,1479,55,1488,1514,55,1519,1524,55,1536,1540,4,1541,1541,25,1542,1547,4,1548,1548,25,1549,1562,4,1563,1563,25,1564,1566,4,1567,1567,25,1568,1599,4,1600,1600,25,1601,1610,4,1611,1621,58,1622,1647,4,1648,1648,58,1649,1756,4,1757,1757,25,1758,1791,4,1792,1805,144,1807,1866,144,1869,1871,144,1872,1919,4,1920,1969,155,1984,2042,105,2045,2047,105,2048,2093,131,2096,2110,131,2112,2139,85,2142,2142,85,2144,2154,144,2160,2190,4,2192,2193,4,2199,2273,4,2274,2274,25,2275,2303,4,2304,2384,32,2385,2388,58,2389,2403,32,2404,2405,25,2406,2431,32,2432,2435,11,2437,2444,11,2447,2448,11,2451,2472,11,2474,2480,11,2482,2482,11,2486,2489,11,2492,2500,11,2503,2504,11,2507,2510,11,2519,2519,11,2524,2525,11,2527,2531,11,2534,2558,11,2561,2563,48,2565,2570,48,2575,2576,48,2579,2600,48,2602,2608,48,2610,2611,48,2613,2614,48,2616,2617,48,2620,2620,48,2622,2626,48,2631,2632,48,2635,2637,48,2641,2641,48,2649,2652,48,2654,2654,48,2662,2678,48,2689,2691,46,2693,2701,46,2703,2705,46,2707,2728,46,2730,2736,46,2738,2739,46,2741,2745,46,2748,2757,46,2759,2761,46,2763,2765,46,2768,2768,46,2784,2787,46,2790,2801,46,2809,2815,46,2817,2819,120,2821,2828,120,2831,2832,120,2835,2856,120,2858,2864,120,2866,2867,120,2869,2873,120,2876,2884,120,2887,2888,120,2891,2893,120,2901,2903,120,2908,2909,120,2911,2915,120,2918,2935,120,2946,2947,151,2949,2954,151,2958,2960,151,2962,2965,151,2969,2970,151,2972,2972,151,2974,2975,151,2979,2980,151,2984,2986,151,2990,3001,151,3006,3010,151,3014,3016,151,3018,3021,151,3024,3024,151,3031,3031,151,3046,3066,151,3072,3084,154,3086,3088,154,3090,3112,154,3114,3129,154,3132,3140,154,3142,3144,154,3146,3149,154,3157,3158,154,3160,3162,154,3165,3165,154,3168,3171,154,3174,3183,154,3191,3199,154,3200,3212,63,3214,3216,63,3218,3240,63,3242,3251,63,3253,3257,63,3260,3268,63,3270,3272,63,3274,3277,63,3285,3286,63,3293,3294,63,3296,3299,63,3302,3311,63,3313,3315,63,3328,3340,84,3342,3344,84,3346,3396,84,3398,3400,84,3402,3407,84,3412,3427,84,3430,3455,84,3457,3459,137,3461,3478,137,3482,3505,137,3507,3515,137,3517,3517,137,3520,3526,137,3530,3530,137,3535,3540,137,3542,3542,137,3544,3551,137,3558,3567,137,3570,3572,137,3585,3642,156,3647,3647,25,3648,3675,156,3713,3714,73,3716,3716,73,3718,3722,73,3724,3747,73,3749,3749,73,3751,3773,73,3776,3780,73,3782,3782,73,3784,3790,73,3792,3801,73,3804,3807,73,3840,3911,157,3913,3948,157,3953,3991,157,3993,4028,157,4030,4044,157,4046,4052,157,4053,4056,25,4057,4058,157,4096,4255,99,4256,4293,41,4295,4295,41,4301,4301,41,4304,4346,41,4347,4347,25,4348,4351,41,4352,4607,51,4608,4680,39,4682,4685,39,4688,4694,39,4696,4696,39,4698,4701,39,4704,4744,39,4746,4749,39,4752,4784,39,4786,4789,39,4792,4798,39,4800,4800,39,4802,4805,39,4808,4822,39,4824,4880,39,4882,4885,39,4888,4954,39,4957,4988,39,4992,5017,39,5024,5109,23,5112,5117,23,5120,5759,18,5760,5788,108,5792,5866,130,5867,5869,25,5870,5880,130,5888,5909,145,5919,5919,145,5920,5940,53,5941,5942,25,5952,5971,17,5984,5996,146,5998,6000,146,6002,6003,146,6016,6109,69,6112,6121,69,6128,6137,69,6144,6145,96,6146,6147,25,6148,6148,96,6149,6149,25,6150,6169,96,6176,6264,96,6272,6314,96,6320,6389,18,6400,6430,76,6432,6443,76,6448,6459,76,6464,6464,76,6468,6479,76,6480,6509,147,6512,6516,147,6528,6571,103,6576,6601,103,6608,6618,103,6622,6623,103,6624,6655,69,6656,6683,16,6686,6687,16,6688,6750,148,6752,6780,148,6783,6793,148,6800,6809,148,6816,6829,148,6832,6862,58,6912,6988,7,6990,7039,7,7040,7103,141,7104,7155,10,7164,7167,10,7168,7223,75,7227,7241,75,7245,7247,75,7248,7295,109,7296,7306,30,7312,7354,41,7357,7359,41,7360,7367,141,7376,7378,58,7379,7379,25,7380,7392,58,7393,7393,25,7394,7400,58,7401,7404,25,7405,7405,58,7406,7411,25,7412,7412,58,7413,7415,25,7416,7417,58,7418,7418,25,7424,7461,74,7462,7466,45,7467,7467,30,7468,7516,74,7517,7521,45,7522,7525,74,7526,7530,45,7531,7543,74,7544,7544,30,7545,7614,74,7615,7615,45,7616,7679,58,7680,7935,74,7936,7957,45,7960,7965,45,7968,8005,45,8008,8013,45,8016,8023,45,8025,8025,45,8027,8027,45,8029,8029,45,8031,8061,45,8064,8116,45,8118,8132,45,8134,8147,45,8150,8155,45,8157,8175,45,8178,8180,45,8182,8190,45,8192,8203,25,8204,8205,58,8206,8292,25,8294,8304,25,8305,8305,74,8308,8318,25,8319,8319,74,8320,8334,25,8336,8348,74,8352,8384,25,8400,8432,58,8448,8485,25,8486,8486,45,8487,8489,25,8490,8491,74,8492,8497,25,8498,8498,74,8499,8525,25,8526,8526,74,8527,8543,25,8544,8584,74,8585,8587,25,8592,9257,25,9280,9290,25,9312,10239,25,10240,10495,15,10496,11123,25,11126,11157,25,11159,11263,25,11264,11359,42,11360,11391,74,11392,11507,26,11513,11519,26,11520,11557,41,11559,11559,41,11565,11565,41,11568,11623,158,11631,11632,158,11647,11647,158,11648,11670,39,11680,11686,39,11688,11694,39,11696,11702,39,11704,11710,39,11712,11718,39,11720,11726,39,11728,11734,39,11736,11742,39,11744,11775,30,11776,11869,25,11904,11929,50,11931,12019,50,12032,12245,50,12272,12292,25,12293,12293,50,12294,12294,25,12295,12295,50,12296,12320,25,12321,12329,50,12330,12333,58,12334,12335,51,12336,12343,25,12344,12347,50,12348,12351,25,12353,12438,56,12441,12442,58,12443,12444,25,12445,12447,56,12448,12448,25,12449,12538,64,12539,12540,25,12541,12543,64,12549,12591,13,12593,12686,51,12688,12703,25,12704,12735,13,12736,12773,25,12783,12783,25,12784,12799,64,12800,12830,51,12832,12895,25,12896,12926,51,12927,13007,25,13008,13054,64,13055,13055,25,13056,13143,64,13144,13311,25,13312,19903,50,19904,19967,25,19968,40959,50,40960,42124,169,42128,42182,169,42192,42239,79,42240,42539,164,42560,42655,30,42656,42743,8,42752,42785,25,42786,42887,74,42888,42890,25,42891,42957,74,42960,42961,74,42963,42963,74,42965,42972,74,42994,43007,74,43008,43052,143,43056,43065,25,43072,43127,126,43136,43205,132,43214,43225,132,43232,43263,32,43264,43309,66,43310,43310,25,43311,43311,66,43312,43347,129,43359,43359,129,43360,43388,51,43392,43469,61,43471,43471,25,43472,43481,61,43486,43487,61,43488,43518,99,43520,43574,22,43584,43597,22,43600,43609,22,43612,43615,22,43616,43647,99,43648,43714,149,43739,43743,149,43744,43766,90,43777,43782,39,43785,43790,39,43793,43798,39,43808,43814,39,43816,43822,39,43824,43866,74,43867,43867,25,43868,43876,74,43877,43877,45,43878,43881,74,43882,43883,25,43888,43967,23,43968,44013,90,44016,44025,90,44032,55203,51,55216,55238,51,55243,55291,51,63744,64109,50,64112,64217,50,64256,64262,74,64275,64279,5,64285,64310,55,64312,64316,55,64318,64318,55,64320,64321,55,64323,64324,55,64326,64335,55,64336,64450,4,64467,64829,4,64830,64831,25,64832,64911,4,64914,64967,4,64975,64975,4,65008,65023,4,65024,65039,58,65040,65049,25,65056,65069,58,65070,65071,30,65072,65106,25,65108,65126,25,65128,65131,25,65136,65140,4,65142,65276,4,65279,65279,25,65281,65312,25,65313,65338,74,65339,65344,25,65345,65370,74,65371,65381,25,65382,65391,64,65392,65392,25,65393,65437,64,65438,65439,25,65440,65470,51,65474,65479,51,65482,65487,51,65490,65495,51,65498,65500,51,65504,65510,25,65512,65518,25,65529,65533,25,65536,65547,78,65549,65574,78,65576,65594,78,65596,65597,78,65599,65613,78,65616,65629,78,65664,65786,78,65792,65794,25,65799,65843,25,65847,65855,25,65856,65934,45,65936,65948,25,65952,65952,45,66e3,66044,25,66045,66045,58,66176,66204,80,66208,66256,19,66272,66272,58,66273,66299,25,66304,66339,112,66349,66351,112,66352,66378,43,66384,66426,114,66432,66461,163,66463,66463,163,66464,66499,115,66504,66517,115,66560,66639,31,66640,66687,134,66688,66717,122,66720,66729,122,66736,66771,121,66776,66811,121,66816,66855,37,66864,66915,20,66927,66927,20,66928,66938,165,66940,66954,165,66956,66962,165,66964,66965,165,66967,66977,165,66979,66993,165,66995,67001,165,67003,67004,165,67008,67059,160,67072,67382,77,67392,67413,77,67424,67431,77,67456,67461,74,67463,67504,74,67506,67514,74,67584,67589,28,67592,67592,28,67594,67637,28,67639,67640,28,67644,67644,28,67647,67647,28,67648,67669,57,67671,67679,57,67680,67711,124,67712,67742,100,67751,67759,100,67808,67826,54,67828,67829,54,67835,67839,54,67840,67867,127,67871,67871,127,67872,67897,81,67903,67903,81,67968,67999,93,68e3,68023,92,68028,68047,92,68050,68095,92,68096,68099,67,68101,68102,67,68108,68115,67,68117,68119,67,68121,68149,67,68152,68154,67,68159,68168,67,68176,68184,67,68192,68223,117,68224,68255,113,68288,68326,86,68331,68342,86,68352,68405,6,68409,68415,6,68416,68437,60,68440,68447,60,68448,68466,59,68472,68479,59,68480,68497,128,68505,68508,128,68521,68527,128,68608,68680,118,68736,68786,111,68800,68850,111,68858,68863,111,68864,68903,52,68912,68921,52,68928,68965,40,68969,68997,40,69006,69007,40,69216,69246,4,69248,69289,168,69291,69293,168,69296,69297,168,69314,69316,4,69372,69375,4,69376,69415,116,69424,69465,138,69488,69513,119,69552,69579,24,69600,69622,38,69632,69709,14,69714,69749,14,69759,69759,14,69760,69826,62,69837,69837,62,69840,69864,139,69872,69881,139,69888,69940,21,69942,69959,21,69968,70006,82,70016,70111,133,70113,70132,137,70144,70161,70,70163,70209,70,70272,70278,98,70280,70280,98,70282,70285,98,70287,70301,98,70303,70313,98,70320,70378,71,70384,70393,71,70400,70403,44,70405,70412,44,70415,70416,44,70419,70440,44,70442,70448,44,70450,70451,44,70453,70457,44,70459,70459,58,70460,70468,44,70471,70472,44,70475,70477,44,70480,70480,44,70487,70487,44,70493,70499,44,70502,70508,44,70512,70516,44,70528,70537,162,70539,70539,162,70542,70542,162,70544,70581,162,70583,70592,162,70594,70594,162,70597,70597,162,70599,70602,162,70604,70613,162,70615,70616,162,70625,70626,162,70656,70747,104,70749,70753,104,70784,70855,159,70864,70873,159,71040,71093,135,71096,71133,135,71168,71236,95,71248,71257,95,71264,71276,96,71296,71353,150,71360,71369,150,71376,71395,99,71424,71450,2,71453,71467,2,71472,71494,2,71680,71739,34,71840,71922,167,71935,71935,167,71936,71942,33,71945,71945,33,71948,71955,33,71957,71958,33,71960,71989,33,71991,71992,33,71995,72006,33,72016,72025,33,72096,72103,102,72106,72151,102,72154,72164,102,72192,72263,170,72272,72354,140,72368,72383,18,72384,72440,125,72448,72457,32,72640,72673,142,72688,72697,142,72704,72712,12,72714,72758,12,72760,72773,12,72784,72812,12,72816,72847,87,72850,72871,87,72873,72886,87,72960,72966,88,72968,72969,88,72971,73014,88,73018,73018,88,73020,73021,88,73023,73031,88,73040,73049,88,73056,73061,47,73063,73064,47,73066,73102,47,73104,73105,47,73107,73112,47,73120,73129,47,73440,73464,83,73472,73488,65,73490,73530,65,73534,73562,65,73648,73648,79,73664,73713,151,73727,73727,151,73728,74649,27,74752,74862,27,74864,74868,27,74880,75075,27,77712,77810,29,77824,78933,36,78944,82938,36,82944,83526,3,90368,90425,49,92160,92728,8,92736,92766,97,92768,92777,97,92782,92783,97,92784,92862,152,92864,92873,152,92880,92909,9,92912,92917,9,92928,92997,123,93008,93017,123,93019,93025,123,93027,93047,123,93053,93071,123,93504,93561,72,93760,93850,89,93952,94026,94,94031,94087,94,94095,94111,94,94176,94176,153,94177,94177,106,94178,94179,50,94180,94180,68,94192,94193,50,94208,100343,153,100352,101119,153,101120,101589,68,101631,101631,68,101632,101640,153,110576,110579,64,110581,110587,64,110589,110590,64,110592,110592,64,110593,110879,56,110880,110882,64,110898,110898,56,110928,110930,56,110933,110933,64,110948,110951,64,110960,111355,106,113664,113770,35,113776,113788,35,113792,113800,35,113808,113817,35,113820,113823,35,113824,113827,25,117760,118009,25,118016,118451,25,118528,118573,58,118576,118598,58,118608,118723,25,118784,119029,25,119040,119078,25,119081,119142,25,119143,119145,58,119146,119162,25,119163,119170,58,119171,119172,25,119173,119179,58,119180,119209,25,119210,119213,58,119214,119274,25,119296,119365,45,119488,119507,25,119520,119539,25,119552,119638,25,119648,119672,25,119808,119892,25,119894,119964,25,119966,119967,25,119970,119970,25,119973,119974,25,119977,119980,25,119982,119993,25,119995,119995,25,119997,120003,25,120005,120069,25,120071,120074,25,120077,120084,25,120086,120092,25,120094,120121,25,120123,120126,25,120128,120132,25,120134,120134,25,120138,120144,25,120146,120485,25,120488,120779,25,120782,120831,25,120832,121483,136,121499,121503,136,121505,121519,136,122624,122654,74,122661,122666,74,122880,122886,42,122888,122904,42,122907,122913,42,122915,122916,42,122918,122922,42,122928,122989,30,123023,123023,30,123136,123180,107,123184,123197,107,123200,123209,107,123214,123215,107,123536,123566,161,123584,123641,166,123647,123647,166,124112,124153,101,124368,124410,110,124415,124415,110,124896,124902,39,124904,124907,39,124909,124910,39,124912,124926,39,124928,125124,91,125127,125142,91,125184,125259,1,125264,125273,1,125278,125279,1,126065,126132,25,126209,126269,25,126464,126467,4,126469,126495,4,126497,126498,4,126500,126500,4,126503,126503,4,126505,126514,4,126516,126519,4,126521,126521,4,126523,126523,4,126530,126530,4,126535,126535,4,126537,126537,4,126539,126539,4,126541,126543,4,126545,126546,4,126548,126548,4,126551,126551,4,126553,126553,4,126555,126555,4,126557,126557,4,126559,126559,4,126561,126562,4,126564,126564,4,126567,126570,4,126572,126578,4,126580,126583,4,126585,126588,4,126590,126590,4,126592,126601,4,126603,126619,4,126625,126627,4,126629,126633,4,126635,126651,4,126704,126705,4,126976,127019,25,127024,127123,25,127136,127150,25,127153,127167,25,127169,127183,25,127185,127221,25,127232,127405,25,127462,127487,25,127488,127488,56,127489,127490,25,127504,127547,25,127552,127560,25,127568,127569,25,127584,127589,25,127744,128727,25,128732,128748,25,128752,128764,25,128768,128886,25,128891,128985,25,128992,129003,25,129008,129008,25,129024,129035,25,129040,129095,25,129104,129113,25,129120,129159,25,129168,129197,25,129200,129211,25,129216,129217,25,129280,129619,25,129632,129645,25,129648,129660,25,129664,129673,25,129679,129734,25,129742,129756,25,129759,129769,25,129776,129784,25,129792,129938,25,129940,130041,25,131072,173791,50,173824,177977,50,177984,178205,50,178208,183969,50,183984,191456,50,191472,192093,50,194560,195101,50,196608,201546,50,201552,205743,50,917505,917505,25,917536,917631,25,917760,917999,58],t.t)
B.cD=s([1633842797,1651275629,1667460464,1819239276,1835102827,1835756907,1919707495],t.t)
B.av=new A.c6(1,"children")
B.aw=new A.c6(2,"leaves")
B.cE=s([B.a2,B.av,B.aw],A.ak("p<c6>"))
B.cF=s([173,173,5,768,879,5,1155,1161,5,1425,1469,5,1471,1471,5,1473,1474,5,1476,1477,5,1479,1479,5,1552,1562,5,1564,1564,5,1568,1568,3,1570,1573,2,1574,1574,3,1575,1575,2,1576,1576,3,1577,1577,2,1578,1582,3,1583,1586,2,1587,1599,3,1600,1600,4,1601,1607,3,1608,1608,2,1609,1610,3,1611,1631,5,1646,1647,3,1648,1648,5,1649,1651,2,1653,1655,2,1656,1671,3,1672,1689,2,1690,1727,3,1728,1728,2,1729,1730,3,1731,1739,2,1740,1740,3,1741,1741,2,1742,1742,3,1743,1743,2,1744,1745,3,1746,1747,2,1749,1749,2,1750,1756,5,1759,1764,5,1767,1768,5,1770,1773,5,1774,1775,2,1786,1788,3,1791,1791,3,1807,1807,5,1808,1808,2,1809,1809,5,1810,1812,3,1813,1817,2,1818,1821,3,1822,1822,2,1823,1831,3,1832,1832,2,1833,1833,3,1834,1834,2,1835,1835,3,1836,1836,2,1837,1838,3,1839,1839,2,1840,1866,5,1869,1869,2,1870,1880,3,1881,1883,2,1884,1898,3,1899,1900,2,1901,1904,3,1905,1905,2,1906,1906,3,1907,1908,2,1909,1911,3,1912,1913,2,1914,1919,3,1958,1968,5,1994,2026,3,2027,2035,5,2042,2042,4,2045,2045,5,2070,2073,5,2075,2083,5,2085,2087,5,2089,2093,5,2112,2112,2,2113,2117,3,2118,2119,2,2120,2120,3,2121,2121,2,2122,2131,3,2132,2132,2,2133,2133,3,2134,2136,2,2137,2139,5,2144,2144,3,2146,2149,3,2151,2151,2,2152,2152,3,2153,2154,2,2160,2178,2,2179,2181,4,2182,2182,3,2185,2189,3,2190,2190,2,2199,2207,5,2208,2217,3,2218,2220,2,2222,2222,2,2223,2224,3,2225,2226,2,2227,2232,3,2233,2233,2,2234,2248,3,2250,2273,5,2275,2306,5,2362,2362,5,2364,2364,5,2369,2376,5,2381,2381,5,2385,2391,5,2402,2403,5,2433,2433,5,2492,2492,5,2497,2500,5,2509,2509,5,2530,2531,5,2558,2558,5,2561,2562,5,2620,2620,5,2625,2626,5,2631,2632,5,2635,2637,5,2641,2641,5,2672,2673,5,2677,2677,5,2689,2690,5,2748,2748,5,2753,2757,5,2759,2760,5,2765,2765,5,2786,2787,5,2810,2815,5,2817,2817,5,2876,2876,5,2879,2879,5,2881,2884,5,2893,2893,5,2901,2902,5,2914,2915,5,2946,2946,5,3008,3008,5,3021,3021,5,3072,3072,5,3076,3076,5,3132,3132,5,3134,3136,5,3142,3144,5,3146,3149,5,3157,3158,5,3170,3171,5,3201,3201,5,3260,3260,5,3263,3263,5,3270,3270,5,3276,3277,5,3298,3299,5,3328,3329,5,3387,3388,5,3393,3396,5,3405,3405,5,3426,3427,5,3457,3457,5,3530,3530,5,3538,3540,5,3542,3542,5,3633,3633,5,3636,3642,5,3655,3662,5,3761,3761,5,3764,3772,5,3784,3790,5,3864,3865,5,3893,3893,5,3895,3895,5,3897,3897,5,3953,3966,5,3968,3972,5,3974,3975,5,3981,3991,5,3993,4028,5,4038,4038,5,4141,4144,5,4146,4151,5,4153,4154,5,4157,4158,5,4184,4185,5,4190,4192,5,4209,4212,5,4226,4226,5,4229,4230,5,4237,4237,5,4253,4253,5,4957,4959,5,5906,5908,5,5938,5939,5,5970,5971,5,6002,6003,5,6068,6069,5,6071,6077,5,6086,6086,5,6089,6099,5,6109,6109,5,6151,6151,3,6154,6154,4,6155,6157,5,6159,6159,5,6176,6264,3,6277,6278,5,6279,6312,3,6313,6313,5,6314,6314,3,6432,6434,5,6439,6440,5,6450,6450,5,6457,6459,5,6679,6680,5,6683,6683,5,6742,6742,5,6744,6750,5,6752,6752,5,6754,6754,5,6757,6764,5,6771,6780,5,6783,6783,5,6832,6862,5,6912,6915,5,6964,6964,5,6966,6970,5,6972,6972,5,6978,6978,5,7019,7027,5,7040,7041,5,7074,7077,5,7080,7081,5,7083,7085,5,7142,7142,5,7144,7145,5,7149,7149,5,7151,7153,5,7212,7219,5,7222,7223,5,7376,7378,5,7380,7392,5,7394,7400,5,7405,7405,5,7412,7412,5,7416,7417,5,7616,7679,5,8203,8203,5,8205,8205,4,8206,8207,5,8234,8238,5,8288,8292,5,8298,8303,5,8400,8432,5,11503,11505,5,11647,11647,5,11744,11775,5,12330,12333,5,12441,12442,5,42607,42610,5,42612,42621,5,42654,42655,5,42736,42737,5,43010,43010,5,43014,43014,5,43019,43019,5,43045,43046,5,43052,43052,5,43072,43121,3,43122,43122,1,43204,43205,5,43232,43249,5,43263,43263,5,43302,43309,5,43335,43345,5,43392,43394,5,43443,43443,5,43446,43449,5,43452,43453,5,43493,43493,5,43561,43566,5,43569,43570,5,43573,43574,5,43587,43587,5,43596,43596,5,43644,43644,5,43696,43696,5,43698,43700,5,43703,43704,5,43710,43711,5,43713,43713,5,43756,43757,5,43766,43766,5,44005,44005,5,44008,44008,5,44013,44013,5,64286,64286,5,65024,65039,5,65056,65071,5,65279,65279,5,65529,65531,5,66045,66045,5,66272,66272,5,66422,66426,5,68097,68099,5,68101,68102,5,68108,68111,5,68152,68154,5,68159,68159,5,68288,68292,3,68293,68293,2,68295,68295,2,68297,68298,2,68301,68301,1,68302,68306,2,68307,68310,3,68311,68311,1,68312,68316,3,68317,68317,2,68318,68320,3,68321,68321,2,68324,68324,2,68325,68326,5,68331,68334,3,68335,68335,2,68480,68480,3,68481,68481,2,68482,68482,3,68483,68485,2,68486,68488,3,68489,68489,2,68490,68491,3,68492,68492,2,68493,68493,3,68494,68495,2,68496,68496,3,68497,68497,2,68521,68524,2,68525,68526,3,68864,68864,1,68865,68897,3,68898,68898,2,68899,68899,3,68900,68903,5,68969,68973,5,69291,69292,5,69314,69314,2,69315,69316,3,69372,69375,5,69424,69426,3,69427,69427,2,69428,69444,3,69446,69456,5,69457,69459,3,69460,69460,2,69488,69491,3,69492,69493,2,69494,69505,3,69506,69509,5,69552,69552,3,69554,69555,3,69556,69558,2,69560,69560,3,69561,69562,2,69563,69564,3,69565,69565,2,69566,69567,3,69569,69569,3,69570,69571,2,69572,69572,3,69577,69577,2,69578,69578,3,69579,69579,1,69633,69633,5,69688,69702,5,69744,69744,5,69747,69748,5,69759,69761,5,69811,69814,5,69817,69818,5,69826,69826,5,69888,69890,5,69927,69931,5,69933,69940,5,70003,70003,5,70016,70017,5,70070,70078,5,70089,70092,5,70095,70095,5,70191,70193,5,70196,70196,5,70198,70199,5,70206,70206,5,70209,70209,5,70367,70367,5,70371,70378,5,70400,70401,5,70459,70460,5,70464,70464,5,70502,70508,5,70512,70516,5,70587,70592,5,70606,70606,5,70608,70608,5,70610,70610,5,70625,70626,5,70712,70719,5,70722,70724,5,70726,70726,5,70750,70750,5,70835,70840,5,70842,70842,5,70847,70848,5,70850,70851,5,71090,71093,5,71100,71101,5,71103,71104,5,71132,71133,5,71219,71226,5,71229,71229,5,71231,71232,5,71339,71339,5,71341,71341,5,71344,71349,5,71351,71351,5,71453,71453,5,71455,71455,5,71458,71461,5,71463,71467,5,71727,71735,5,71737,71738,5,71995,71996,5,71998,71998,5,72003,72003,5,72148,72151,5,72154,72155,5,72160,72160,5,72193,72202,5,72243,72248,5,72251,72254,5,72263,72263,5,72273,72278,5,72281,72283,5,72330,72342,5,72344,72345,5,72752,72758,5,72760,72765,5,72767,72767,5,72850,72871,5,72874,72880,5,72882,72883,5,72885,72886,5,73009,73014,5,73018,73018,5,73020,73021,5,73023,73029,5,73031,73031,5,73104,73105,5,73109,73109,5,73111,73111,5,73459,73460,5,73472,73473,5,73526,73530,5,73536,73536,5,73538,73538,5,73562,73562,5,78896,78912,5,78919,78933,5,90398,90409,5,90413,90415,5,92912,92916,5,92976,92982,5,94031,94031,5,94095,94098,5,94180,94180,5,113821,113822,5,113824,113827,5,118528,118573,5,118576,118598,5,119143,119145,5,119155,119170,5,119173,119179,5,119210,119213,5,119362,119364,5,121344,121398,5,121403,121452,5,121461,121461,5,121476,121476,5,121499,121503,5,121505,121519,5,122880,122886,5,122888,122904,5,122907,122913,5,122915,122916,5,122918,122922,5,123023,123023,5,123184,123190,5,123566,123566,5,123628,123631,5,124140,124143,5,124398,124399,5,125136,125142,5,125184,125251,3,125252,125259,5,917505,917505,5,917536,917631,5,917760,917999,5],t.t)
B.e6=new A.f(1536,1540)
B.e7=new A.f(1542,1547)
B.e8=new A.f(1549,1562)
B.e9=new A.f(1564,1566)
B.ea=new A.f(1568,1599)
B.eb=new A.f(1601,1610)
B.ec=new A.f(1622,1647)
B.ed=new A.f(1649,1756)
B.ee=new A.f(1758,1805)
B.ef=new A.f(1807,1866)
B.eg=new A.f(1869,1919)
B.eh=new A.f(1984,2042)
B.ek=new A.f(2045,2047)
B.el=new A.f(2112,2139)
B.em=new A.f(2142,2142)
B.en=new A.f(2144,2154)
B.eo=new A.f(2160,2193)
B.ep=new A.f(2199,2273)
B.eq=new A.f(2275,2303)
B.et=new A.f(6144,6145)
B.eu=new A.f(6148,6148)
B.ev=new A.f(6150,6169)
B.ew=new A.f(6176,6264)
B.ex=new A.f(6272,6314)
B.es=new A.f(43072,43127)
B.ey=new A.f(64336,64829)
B.ez=new A.f(64832,64975)
B.eB=new A.f(65008,65023)
B.eC=new A.f(65136,65140)
B.eD=new A.f(65142,65276)
B.eE=new A.f(68288,68326)
B.eF=new A.f(68331,68342)
B.eG=new A.f(68480,68497)
B.eH=new A.f(68505,68508)
B.eI=new A.f(68521,68527)
B.eJ=new A.f(68864,68903)
B.eK=new A.f(68912,68921)
B.eL=new A.f(69216,69246)
B.eM=new A.f(69314,69319)
B.eN=new A.f(69328,69336)
B.eO=new A.f(69370,69375)
B.eP=new A.f(69424,69465)
B.eQ=new A.f(69488,69513)
B.eR=new A.f(69552,69579)
B.eS=new A.f(71264,71276)
B.dp=new A.f(113664,113770)
B.dq=new A.f(113776,113788)
B.dr=new A.f(113792,113800)
B.ds=new A.f(113808,113817)
B.dt=new A.f(113820,113823)
B.dv=new A.f(125184,125259)
B.dw=new A.f(125264,125273)
B.dx=new A.f(125278,125279)
B.dy=new A.f(126464,126467)
B.dz=new A.f(126469,126495)
B.dA=new A.f(126497,126498)
B.dB=new A.f(126500,126500)
B.dC=new A.f(126503,126503)
B.dD=new A.f(126505,126514)
B.dE=new A.f(126516,126519)
B.dF=new A.f(126521,126521)
B.dG=new A.f(126523,126523)
B.dH=new A.f(126530,126530)
B.dI=new A.f(126535,126535)
B.dJ=new A.f(126537,126537)
B.dK=new A.f(126539,126539)
B.dL=new A.f(126541,126543)
B.dM=new A.f(126545,126546)
B.dN=new A.f(126548,126548)
B.dO=new A.f(126551,126551)
B.dP=new A.f(126553,126553)
B.dQ=new A.f(126555,126555)
B.dR=new A.f(126557,126557)
B.dS=new A.f(126559,126559)
B.dT=new A.f(126561,126562)
B.dU=new A.f(126564,126564)
B.dV=new A.f(126567,126570)
B.dW=new A.f(126572,126578)
B.dX=new A.f(126580,126583)
B.dY=new A.f(126585,126588)
B.dZ=new A.f(126590,126590)
B.e_=new A.f(126592,126601)
B.e0=new A.f(126603,126619)
B.e1=new A.f(126625,126627)
B.e2=new A.f(126629,126633)
B.e3=new A.f(126635,126651)
B.e4=new A.f(126704,126705)
B.a9=s([B.e6,B.e7,B.e8,B.e9,B.ea,B.eb,B.ec,B.ed,B.ee,B.ef,B.eg,B.eh,B.ek,B.el,B.em,B.en,B.eo,B.ep,B.eq,B.et,B.eu,B.ev,B.ew,B.ex,B.es,B.ey,B.ez,B.eB,B.eC,B.eD,B.eE,B.eF,B.eG,B.eH,B.eI,B.eJ,B.eK,B.eL,B.eM,B.eN,B.eO,B.eP,B.eQ,B.eR,B.eS,B.dp,B.dq,B.dr,B.ds,B.dt,B.dv,B.dw,B.dx,B.dy,B.dz,B.dA,B.dB,B.dC,B.dD,B.dE,B.dF,B.dG,B.dH,B.dI,B.dJ,B.dK,B.dL,B.dM,B.dN,B.dO,B.dP,B.dQ,B.dR,B.dS,B.dT,B.dU,B.dV,B.dW,B.dX,B.dY,B.dZ,B.e_,B.e0,B.e1,B.e2,B.e3,B.e4],t.ho)
B.cG=s(["text-color","text-opacity","text-halo-color","text-halo-width","text-halo-blur","icon-color","icon-opacity","icon-halo-color","icon-halo-width","icon-halo-blur"],t.s)
B.cH=s(["a","b","c"],t.s)
B.G=new A.aZ(0,"round")
B.H=new A.aZ(1,"bevel")
B.z=new A.aZ(2,"miter")
B.X=new A.aZ(3,"none")
B.I=new A.aZ(4,"fakeround")
B.Y=new A.aZ(5,"flipbevel")
B.J=new A.aZ(6,"butt")
B.Z=new A.aZ(7,"square")
B.aa=s([B.G,B.H,B.z,B.X,B.I,B.Y,B.J,B.Z],A.ak("p<aZ>"))
B.P=s([],t.lW)
B.cJ=s([],t.dY)
B.cI=s([],t.oM)
B.ab=s([],t.hD)
B.cT=s([],t.i9)
B.F=s([],t.r)
B.Q=s([],t.w)
B.cU=s([],A.ak("p<uW>"))
B.cV=s([],t.R)
B.cW=s([],t.q)
B.cP=s([],t.ez)
B.cK=s([],t.lE)
B.cN=s([],t.m1)
B.cL=s([],t.kR)
B.ad=s([],t.s)
B.cR=s([],t.cb)
B.ac=s([],t.e)
B.R=s([],A.ak("p<bV>"))
B.cO=s([],t.bD)
B.cM=s([],t.n)
B.m=s([],t.t)
B.D=s([],t.dM)
B.E=s([],t.bU)
B.cQ=s([],t.oZ)
B.du=new A.f(11,1)
B.e5=new A.f(12,0)
B.cX=s([B.du,B.e5],t.G)
B.cY=s([768,788,230,789,789,232,790,793,220,794,794,232,795,795,216,796,800,220,801,802,202,803,806,220,807,808,202,809,819,220,820,824,1,825,828,220,829,836,230,837,837,240,838,838,230,839,841,220,842,844,230,845,846,220,848,850,230,851,854,220,855,855,230,856,856,232,857,858,220,859,859,230,860,860,233,861,862,234,863,863,233,864,865,234,866,866,233,867,879,230,1155,1159,230,1425,1425,220,1426,1429,230,1430,1430,220,1431,1433,230,1434,1434,222,1435,1435,220,1436,1441,230,1442,1447,220,1448,1449,230,1450,1450,220,1451,1452,230,1453,1453,222,1454,1454,228,1455,1455,230,1456,1456,10,1457,1457,11,1458,1458,12,1459,1459,13,1460,1460,14,1461,1461,15,1462,1462,16,1463,1463,17,1464,1464,18,1465,1466,19,1467,1467,20,1468,1468,21,1469,1469,22,1471,1471,23,1473,1473,24,1474,1474,25,1476,1476,230,1477,1477,220,1479,1479,18,1552,1559,230,1560,1560,30,1561,1561,31,1562,1562,32,1611,1611,27,1612,1612,28,1613,1613,29,1614,1614,30,1615,1615,31,1616,1616,32,1617,1617,33,1618,1618,34,1619,1620,230,1621,1622,220,1623,1627,230,1628,1628,220,1629,1630,230,1631,1631,220,1648,1648,35,1750,1756,230,1759,1762,230,1763,1763,220,1764,1764,230,1767,1768,230,1770,1770,220,1771,1772,230,1773,1773,220,1809,1809,36,1840,1840,230,1841,1841,220,1842,1843,230,1844,1844,220,1845,1846,230,1847,1849,220,1850,1850,230,1851,1852,220,1853,1853,230,1854,1854,220,1855,1857,230,1858,1858,220,1859,1859,230,1860,1860,220,1861,1861,230,1862,1862,220,1863,1863,230,1864,1864,220,1865,1866,230,2027,2033,230,2034,2034,220,2035,2035,230,2045,2045,220,2070,2073,230,2075,2083,230,2085,2087,230,2089,2093,230,2137,2139,220,2199,2200,230,2201,2203,220,2204,2207,230,2250,2254,230,2255,2259,220,2260,2273,230,2275,2275,220,2276,2277,230,2278,2278,220,2279,2280,230,2281,2281,220,2282,2284,230,2285,2287,220,2288,2288,27,2289,2289,28,2290,2290,29,2291,2293,230,2294,2294,220,2295,2296,230,2297,2298,220,2299,2303,230,2364,2364,7,2381,2381,9,2385,2385,230,2386,2386,220,2387,2388,230,2492,2492,7,2509,2509,9,2558,2558,230,2620,2620,7,2637,2637,9,2748,2748,7,2765,2765,9,2876,2876,7,2893,2893,9,3021,3021,9,3132,3132,7,3149,3149,9,3157,3157,84,3158,3158,91,3260,3260,7,3277,3277,9,3387,3388,9,3405,3405,9,3530,3530,9,3640,3641,103,3642,3642,9,3656,3659,107,3768,3769,118,3770,3770,9,3784,3787,122,3864,3865,220,3893,3893,220,3895,3895,220,3897,3897,216,3953,3953,129,3954,3954,130,3956,3956,132,3962,3965,130,3968,3968,130,3970,3971,230,3972,3972,9,3974,3975,230,4038,4038,220,4151,4151,7,4153,4154,9,4237,4237,220,4957,4959,230,5908,5909,9,5940,5940,9,6098,6098,9,6109,6109,230,6313,6313,228,6457,6457,222,6458,6458,230,6459,6459,220,6679,6679,230,6680,6680,220,6752,6752,9,6773,6780,230,6783,6783,220,6832,6836,230,6837,6842,220,6843,6844,230,6845,6845,220,6847,6848,220,6849,6850,230,6851,6852,220,6853,6857,230,6858,6858,220,6859,6862,230,6964,6964,7,6980,6980,9,7019,7019,230,7020,7020,220,7021,7027,230,7082,7083,9,7142,7142,7,7154,7155,9,7223,7223,7,7376,7378,230,7380,7380,1,7381,7385,220,7386,7387,230,7388,7391,220,7392,7392,230,7394,7400,1,7405,7405,220,7412,7412,230,7416,7417,230,7616,7617,230,7618,7618,220,7619,7625,230,7626,7626,220,7627,7628,230,7629,7629,234,7630,7630,214,7631,7631,220,7632,7632,202,7633,7669,230,7670,7670,232,7671,7672,228,7673,7673,220,7674,7674,218,7675,7675,230,7676,7676,233,7677,7677,220,7678,7678,230,7679,7679,220,8400,8401,230,8402,8403,1,8404,8407,230,8408,8410,1,8411,8412,230,8417,8417,230,8421,8422,1,8423,8423,230,8424,8424,220,8425,8425,230,8426,8427,1,8428,8431,220,8432,8432,230,11503,11505,230,11647,11647,9,11744,11775,230,12330,12330,218,12331,12331,228,12332,12332,232,12333,12333,222,12334,12335,224,12441,12442,8,42607,42607,230,42612,42621,230,42654,42655,230,42736,42737,230,43014,43014,9,43052,43052,9,43204,43204,9,43232,43249,230,43307,43309,220,43347,43347,9,43443,43443,7,43456,43456,9,43696,43696,230,43698,43699,230,43700,43700,220,43703,43704,230,43710,43711,230,43713,43713,230,43766,43766,9,44013,44013,9,64286,64286,26,65056,65062,230,65063,65069,220,65070,65071,230,66045,66045,220,66272,66272,220,66422,66426,230,68109,68109,220,68111,68111,230,68152,68152,230,68153,68153,1,68154,68154,220,68159,68159,9,68325,68325,230,68326,68326,220,68900,68903,230,68969,68973,230,69291,69292,230,69373,69375,220,69446,69447,220,69448,69450,230,69451,69451,220,69452,69452,230,69453,69456,220,69506,69506,230,69507,69507,220,69508,69508,230,69509,69509,220,69702,69702,9,69744,69744,9,69759,69759,9,69817,69817,9,69818,69818,7,69888,69890,230,69939,69940,9,70003,70003,7,70080,70080,9,70090,70090,7,70197,70197,9,70198,70198,7,70377,70377,7,70378,70378,9,70459,70460,7,70477,70477,9,70502,70508,230,70512,70516,230,70606,70608,9,70722,70722,9,70726,70726,7,70750,70750,230,70850,70850,9,70851,70851,7,71103,71103,9,71104,71104,7,71231,71231,9,71350,71350,9,71351,71351,7,71467,71467,9,71737,71737,9,71738,71738,7,71997,71998,9,72003,72003,7,72160,72160,9,72244,72244,9,72263,72263,9,72345,72345,9,72767,72767,9,73026,73026,7,73028,73029,9,73111,73111,9,73537,73538,9,90415,90415,9,92912,92916,1,92976,92982,230,94192,94193,6,113822,113822,1,119141,119142,216,119143,119145,1,119149,119149,226,119150,119154,216,119163,119170,220,119173,119177,230,119178,119179,220,119210,119213,230,119362,119364,230,122880,122886,230,122888,122904,230,122907,122913,230,122915,122916,230,122918,122922,230,123023,123023,230,123184,123190,230,123566,123566,230,123628,123631,230,124140,124141,232,124142,124142,220,124143,124143,230,124398,124398,230,124399,124399,220,125136,125142,220,125252,125257,230,125258,125258,7],t.t)
B.S=s(["Unknown","Adlam","Ahom","Anatolian_Hieroglyphs","Arabic","Armenian","Avestan","Balinese","Bamum","Bassa_Vah","Batak","Bengali","Bhaiksuki","Bopomofo","Brahmi","Braille","Buginese","Buhid","Canadian_Aboriginal","Carian","Caucasian_Albanian","Chakma","Cham","Cherokee","Chorasmian","Common","Coptic","Cuneiform","Cypriot","Cypro_Minoan","Cyrillic","Deseret","Devanagari","Dives_Akuru","Dogra","Duployan","Egyptian_Hieroglyphs","Elbasan","Elymaic","Ethiopic","Garay","Georgian","Glagolitic","Gothic","Grantha","Greek","Gujarati","Gunjala_Gondi","Gurmukhi","Gurung_Khema","Han","Hangul","Hanifi_Rohingya","Hanunoo","Hatran","Hebrew","Hiragana","Imperial_Aramaic","Inherited","Inscriptional_Pahlavi","Inscriptional_Parthian","Javanese","Kaithi","Kannada","Katakana","Kawi","Kayah_Li","Kharoshthi","Khitan_Small_Script","Khmer","Khojki","Khudawadi","Kirat_Rai","Lao","Latin","Lepcha","Limbu","Linear_A","Linear_B","Lisu","Lycian","Lydian","Mahajani","Makasar","Malayalam","Mandaic","Manichaean","Marchen","Masaram_Gondi","Medefaidrin","Meetei_Mayek","Mende_Kikakui","Meroitic_Cursive","Meroitic_Hieroglyphs","Miao","Modi","Mongolian","Mro","Multani","Myanmar","Nabataean","Nag_Mundari","Nandinagari","New_Tai_Lue","Newa","Nko","Nushu","Nyiakeng_Puachue_Hmong","Ogham","Ol_Chiki","Ol_Onal","Old_Hungarian","Old_Italic","Old_North_Arabian","Old_Permic","Old_Persian","Old_Sogdian","Old_South_Arabian","Old_Turkic","Old_Uyghur","Oriya","Osage","Osmanya","Pahawh_Hmong","Palmyrene","Pau_Cin_Hau","Phags_Pa","Phoenician","Psalter_Pahlavi","Rejang","Runic","Samaritan","Saurashtra","Sharada","Shavian","Siddham","SignWriting","Sinhala","Sogdian","Sora_Sompeng","Soyombo","Sundanese","Sunuwar","Syloti_Nagri","Syriac","Tagalog","Tagbanwa","Tai_Le","Tai_Tham","Tai_Viet","Takri","Tamil","Tangsa","Tangut","Telugu","Thaana","Thai","Tibetan","Tifinagh","Tirhuta","Todhri","Toto","Tulu_Tigalari","Ugaritic","Vai","Vithkuqi","Wancho","Warang_Citi","Yezidi","Yi","Zanabazar_Square"],t.s)
B.cZ=s([0,8,9,9,9,11,10,10,10,11,11,11,12,12,12,13,13,10,14,27,9,28,30,10,31,31,11,32,32,12,33,34,13,35,37,5,38,42,13,43,43,4,44,44,7,45,45,4,46,47,7,48,57,3,58,58,7,59,64,13,91,96,13,123,126,13,127,132,9,133,133,10,134,159,9,160,160,7,161,161,13,162,165,5,166,169,13,171,172,13,173,173,9,174,175,13,176,177,5,178,179,3,180,180,13,182,184,13,185,185,3,187,191,13,215,215,13,247,247,13,697,698,13,706,719,13,722,735,13,741,749,13,751,767,13,768,879,8,884,885,13,894,894,13,900,901,13,903,903,13,1014,1014,13,1155,1161,8,1418,1418,13,1421,1422,13,1423,1423,5,1424,1424,1,1425,1469,8,1470,1470,1,1471,1471,8,1472,1472,1,1473,1474,8,1475,1475,1,1476,1477,8,1478,1478,1,1479,1479,8,1480,1535,1,1536,1541,6,1542,1543,13,1544,1544,2,1545,1546,5,1547,1547,2,1548,1548,7,1549,1549,2,1550,1551,13,1552,1562,8,1563,1610,2,1611,1631,8,1632,1641,6,1642,1642,5,1643,1644,6,1645,1647,2,1648,1648,8,1649,1749,2,1750,1756,8,1757,1757,6,1758,1758,13,1759,1764,8,1765,1766,2,1767,1768,8,1769,1769,13,1770,1773,8,1774,1775,2,1776,1785,3,1786,1808,2,1809,1809,8,1810,1839,2,1840,1866,8,1867,1957,2,1958,1968,8,1969,1983,2,1984,2026,1,2027,2035,8,2036,2037,1,2038,2041,13,2042,2044,1,2045,2045,8,2046,2069,1,2070,2073,8,2074,2074,1,2075,2083,8,2084,2084,1,2085,2087,8,2088,2088,1,2089,2093,8,2094,2136,1,2137,2139,8,2140,2143,1,2144,2191,2,2192,2193,6,2194,2198,2,2199,2207,8,2208,2249,2,2250,2273,8,2274,2274,6,2275,2306,8,2362,2362,8,2364,2364,8,2369,2376,8,2381,2381,8,2385,2391,8,2402,2403,8,2433,2433,8,2492,2492,8,2497,2500,8,2509,2509,8,2530,2531,8,2546,2547,5,2555,2555,5,2558,2558,8,2561,2562,8,2620,2620,8,2625,2626,8,2631,2632,8,2635,2637,8,2641,2641,8,2672,2673,8,2677,2677,8,2689,2690,8,2748,2748,8,2753,2757,8,2759,2760,8,2765,2765,8,2786,2787,8,2801,2801,5,2810,2815,8,2817,2817,8,2876,2876,8,2879,2879,8,2881,2884,8,2893,2893,8,2901,2902,8,2914,2915,8,2946,2946,8,3008,3008,8,3021,3021,8,3059,3064,13,3065,3065,5,3066,3066,13,3072,3072,8,3076,3076,8,3132,3132,8,3134,3136,8,3142,3144,8,3146,3149,8,3157,3158,8,3170,3171,8,3192,3198,13,3201,3201,8,3260,3260,8,3276,3277,8,3298,3299,8,3328,3329,8,3387,3388,8,3393,3396,8,3405,3405,8,3426,3427,8,3457,3457,8,3530,3530,8,3538,3540,8,3542,3542,8,3633,3633,8,3636,3642,8,3647,3647,5,3655,3662,8,3761,3761,8,3764,3772,8,3784,3790,8,3864,3865,8,3893,3893,8,3895,3895,8,3897,3897,8,3898,3901,13,3953,3966,8,3968,3972,8,3974,3975,8,3981,3991,8,3993,4028,8,4038,4038,8,4141,4144,8,4146,4151,8,4153,4154,8,4157,4158,8,4184,4185,8,4190,4192,8,4209,4212,8,4226,4226,8,4229,4230,8,4237,4237,8,4253,4253,8,4957,4959,8,5008,5017,13,5120,5120,13,5760,5760,12,5787,5788,13,5906,5908,8,5938,5939,8,5970,5971,8,6002,6003,8,6068,6069,8,6071,6077,8,6086,6086,8,6089,6099,8,6107,6107,5,6109,6109,8,6128,6137,13,6144,6154,13,6155,6157,8,6158,6158,9,6159,6159,8,6277,6278,8,6313,6313,8,6432,6434,8,6439,6440,8,6450,6450,8,6457,6459,8,6464,6464,13,6468,6469,13,6622,6655,13,6679,6680,8,6683,6683,8,6742,6742,8,6744,6750,8,6752,6752,8,6754,6754,8,6757,6764,8,6771,6780,8,6783,6783,8,6832,6862,8,6912,6915,8,6964,6964,8,6966,6970,8,6972,6972,8,6978,6978,8,7019,7027,8,7040,7041,8,7074,7077,8,7080,7081,8,7083,7085,8,7142,7142,8,7144,7145,8,7149,7149,8,7151,7153,8,7212,7219,8,7222,7223,8,7376,7378,8,7380,7392,8,7394,7400,8,7405,7405,8,7412,7412,8,7416,7417,8,7616,7679,8,8125,8125,13,8127,8129,13,8141,8143,13,8157,8159,13,8173,8175,13,8189,8190,13,8192,8202,12,8203,8205,9,8207,8207,1,8208,8231,13,8232,8232,12,8233,8233,10,8234,8234,14,8235,8235,15,8236,8236,18,8237,8237,16,8238,8238,17,8239,8239,7,8240,8244,5,8245,8259,13,8260,8260,7,8261,8286,13,8287,8287,12,8288,8292,9,8294,8294,19,8295,8295,20,8296,8296,21,8297,8297,22,8298,8303,9,8304,8304,3,8308,8313,3,8314,8315,4,8316,8318,13,8320,8329,3,8330,8331,4,8332,8334,13,8352,8399,5,8400,8432,8,8448,8449,13,8451,8454,13,8456,8457,13,8468,8468,13,8470,8472,13,8478,8483,13,8485,8485,13,8487,8487,13,8489,8489,13,8494,8494,5,8506,8507,13,8512,8516,13,8522,8525,13,8528,8543,13,8585,8587,13,8592,8721,13,8722,8722,4,8723,8723,5,8724,9013,13,9083,9108,13,9110,9257,13,9280,9290,13,9312,9351,13,9352,9371,3,9450,9899,13,9901,10239,13,10496,11123,13,11126,11157,13,11159,11263,13,11493,11498,13,11503,11505,8,11513,11519,13,11647,11647,8,11744,11775,8,11776,11869,13,11904,11929,13,11931,12019,13,12032,12245,13,12272,12287,13,12288,12288,12,12289,12292,13,12296,12320,13,12330,12333,8,12336,12336,13,12342,12343,13,12349,12351,13,12441,12442,8,12443,12444,13,12448,12448,13,12539,12539,13,12736,12773,13,12783,12783,13,12829,12830,13,12880,12895,13,12924,12926,13,12977,12991,13,13004,13007,13,13175,13178,13,13278,13279,13,13311,13311,13,19904,19967,13,42128,42182,13,42509,42511,13,42607,42610,8,42611,42611,13,42612,42621,8,42622,42623,13,42654,42655,8,42736,42737,8,42752,42785,13,42888,42888,13,43010,43010,8,43014,43014,8,43019,43019,8,43045,43046,8,43048,43051,13,43052,43052,8,43064,43065,5,43124,43127,13,43204,43205,8,43232,43249,8,43263,43263,8,43302,43309,8,43335,43345,8,43392,43394,8,43443,43443,8,43446,43449,8,43452,43453,8,43493,43493,8,43561,43566,8,43569,43570,8,43573,43574,8,43587,43587,8,43596,43596,8,43644,43644,8,43696,43696,8,43698,43700,8,43703,43704,8,43710,43711,8,43713,43713,8,43756,43757,8,43766,43766,8,43882,43883,13,44005,44005,8,44008,44008,8,44013,44013,8,64285,64285,1,64286,64286,8,64287,64296,1,64297,64297,4,64298,64335,1,64336,64829,2,64830,64847,13,64848,64974,2,64975,64975,13,65008,65020,2,65021,65023,13,65024,65039,8,65040,65049,13,65056,65071,8,65072,65103,13,65104,65104,7,65105,65105,13,65106,65106,7,65108,65108,13,65109,65109,7,65110,65118,13,65119,65119,5,65120,65121,13,65122,65123,4,65124,65126,13,65128,65128,13,65129,65130,5,65131,65131,13,65136,65278,2,65279,65279,9,65281,65282,13,65283,65285,5,65286,65290,13,65291,65291,4,65292,65292,7,65293,65293,4,65294,65295,7,65296,65305,3,65306,65306,7,65307,65312,13,65339,65344,13,65371,65381,13,65504,65505,5,65506,65508,13,65509,65510,5,65512,65518,13,65529,65533,13,65793,65793,13,65856,65932,13,65936,65948,13,65952,65952,13,66045,66045,8,66272,66272,8,66273,66299,3,66422,66426,8,67584,67870,1,67871,67871,13,67872,68096,1,68097,68099,8,68100,68100,1,68101,68102,8,68103,68107,1,68108,68111,8,68112,68151,1,68152,68154,8,68155,68158,1,68159,68159,8,68160,68324,1,68325,68326,8,68327,68408,1,68409,68415,13,68416,68863,1,68864,68899,2,68900,68903,8,68904,68911,2,68912,68921,6,68922,68927,2,68928,68937,6,68938,68968,1,68969,68973,8,68974,68974,13,68975,69215,1,69216,69246,6,69247,69290,1,69291,69292,8,69293,69311,1,69312,69371,2,69372,69375,8,69376,69423,1,69424,69445,2,69446,69456,8,69457,69487,2,69488,69505,1,69506,69509,8,69510,69631,1,69633,69633,8,69688,69702,8,69714,69733,13,69744,69744,8,69747,69748,8,69759,69761,8,69811,69814,8,69817,69818,8,69826,69826,8,69888,69890,8,69927,69931,8,69933,69940,8,70003,70003,8,70016,70017,8,70070,70078,8,70089,70092,8,70095,70095,8,70191,70193,8,70196,70196,8,70198,70199,8,70206,70206,8,70209,70209,8,70367,70367,8,70371,70378,8,70400,70401,8,70459,70460,8,70464,70464,8,70502,70508,8,70512,70516,8,70587,70592,8,70606,70606,8,70608,70608,8,70610,70610,8,70625,70626,8,70712,70719,8,70722,70724,8,70726,70726,8,70750,70750,8,70835,70840,8,70842,70842,8,70847,70848,8,70850,70851,8,71090,71093,8,71100,71101,8,71103,71104,8,71132,71133,8,71219,71226,8,71229,71229,8,71231,71232,8,71264,71276,13,71339,71339,8,71341,71341,8,71344,71349,8,71351,71351,8,71453,71453,8,71455,71455,8,71458,71461,8,71463,71467,8,71727,71735,8,71737,71738,8,71995,71996,8,71998,71998,8,72003,72003,8,72148,72151,8,72154,72155,8,72160,72160,8,72193,72198,8,72201,72202,8,72243,72248,8,72251,72254,8,72263,72263,8,72273,72278,8,72281,72283,8,72330,72342,8,72344,72345,8,72752,72758,8,72760,72765,8,72850,72871,8,72874,72880,8,72882,72883,8,72885,72886,8,73009,73014,8,73018,73018,8,73020,73021,8,73023,73029,8,73031,73031,8,73104,73105,8,73109,73109,8,73111,73111,8,73459,73460,8,73472,73473,8,73526,73530,8,73536,73536,8,73538,73538,8,73562,73562,8,73685,73692,13,73693,73696,5,73697,73713,13,78912,78912,8,78919,78933,8,90398,90409,8,90413,90415,8,92912,92916,8,92976,92982,8,94031,94031,8,94095,94098,8,94178,94178,13,94180,94180,8,113821,113822,8,113824,113827,9,117760,117973,13,118e3,118009,3,118016,118451,13,118528,118573,8,118576,118598,8,119143,119145,8,119155,119162,9,119163,119170,8,119173,119179,8,119210,119213,8,119273,119274,13,119296,119361,13,119362,119364,8,119365,119365,13,119552,119638,13,120513,120513,13,120539,120539,13,120571,120571,13,120597,120597,13,120629,120629,13,120655,120655,13,120687,120687,13,120713,120713,13,120745,120745,13,120771,120771,13,120782,120831,3,121344,121398,8,121403,121452,8,121461,121461,8,121476,121476,8,121499,121503,8,121505,121519,8,122880,122886,8,122888,122904,8,122907,122913,8,122915,122916,8,122918,122922,8,123023,123023,8,123184,123190,8,123566,123566,8,123628,123631,8,123647,123647,5,124140,124143,8,124398,124399,8,124928,125135,1,125136,125142,8,125143,125251,1,125252,125258,8,125259,126063,1,126064,126143,2,126144,126207,1,126208,126287,2,126288,126463,1,126464,126703,2,126704,126705,13,126706,126719,2,126720,126975,1,126976,127019,13,127024,127123,13,127136,127150,13,127153,127167,13,127169,127183,13,127185,127221,13,127232,127242,3,127243,127247,13,127279,127279,13,127338,127343,13,127405,127405,13,127584,127589,13,127744,128727,13,128732,128748,13,128752,128764,13,128768,128886,13,128891,128985,13,128992,129003,13,129008,129008,13,129024,129035,13,129040,129095,13,129104,129113,13,129120,129159,13,129168,129197,13,129200,129211,13,129216,129217,13,129280,129619,13,129632,129645,13,129648,129660,13,129664,129673,13,129679,129734,13,129742,129756,13,129759,129769,13,129776,129784,13,129792,129938,13,129940,130031,13,130032,130041,3,917505,917505,9,917536,917631,9,917760,917999,8],t.t)
B.ae=s(["linear"],t.s)
B.d_=s([1667329140,1668049255,1668641395,1684632436,1801810542,1818847073,1919118452],t.t)
B.d0=s(["fill-outline-color","fill-opacity"],t.s)
B.d1=s([40,40,165,41,41,162,91,91,373,93,93,366,123,123,501,125,125,494,3898,3898,15597,3899,3899,15594,3900,3900,15605,3901,3901,15602,5787,5787,23153,5788,5788,23150,8261,8261,33049,8262,8262,33046,8317,8317,33273,8318,8318,33270,8333,8333,33337,8334,8334,33334,8968,8968,35877,8969,8969,35874,8970,8970,35885,8971,8971,35882,9001,9001,36009,9002,9002,36006,10088,10088,40357,10089,10089,40354,10090,10090,40365,10091,10091,40362,10092,10092,40373,10093,10093,40370,10094,10094,40381,10095,10095,40378,10096,10096,40389,10097,10097,40386,10098,10098,40397,10099,10099,40394,10100,10100,40405,10101,10101,40402,10181,10181,40729,10182,10182,40726,10214,10214,40861,10215,10215,40858,10216,10216,40869,10217,10217,40866,10218,10218,40877,10219,10219,40874,10220,10220,40885,10221,10221,40882,10222,10222,40893,10223,10223,40890,10627,10627,42513,10628,10628,42510,10629,10629,42521,10630,10630,42518,10631,10631,42529,10632,10632,42526,10633,10633,42537,10634,10634,42534,10635,10635,42545,10636,10636,42542,10637,10637,42561,10638,10638,42558,10639,10639,42553,10640,10640,42550,10641,10641,42569,10642,10642,42566,10643,10643,42577,10644,10644,42574,10645,10645,42585,10646,10646,42582,10647,10647,42593,10648,10648,42590,10712,10712,42853,10713,10713,42850,10714,10714,42861,10715,10715,42858,10748,10748,42997,10749,10749,42994,11810,11810,47245,11811,11811,47242,11812,11812,47253,11813,11813,47250,11814,11814,47261,11815,11815,47258,11816,11816,47269,11817,11817,47266,11861,11861,47449,11862,11862,47446,11863,11863,47457,11864,11864,47454,11865,11865,47465,11866,11866,47462,11867,11867,47473,11868,11868,47470,12296,12296,49189,12297,12297,49186,12298,12298,49197,12299,12299,49194,12300,12300,49205,12301,12301,49202,12302,12302,49213,12303,12303,49210,12304,12304,49221,12305,12305,49218,12308,12308,49237,12309,12309,49234,12310,12310,49245,12311,12311,49242,12312,12312,49253,12313,12313,49250,12314,12314,49261,12315,12315,49258,65113,65113,260457,65114,65114,260454,65115,65115,260465,65116,65116,260462,65117,65117,260473,65118,65118,260470,65288,65288,261157,65289,65289,261154,65339,65339,261365,65341,65341,261358,65371,65371,261493,65373,65373,261486,65375,65375,261505,65376,65376,261502,65378,65378,261517,65379,65379,261514],t.t)
B.d2=s(["circle-color","circle-opacity","circle-radius","circle-stroke-color","circle-stroke-width","circle-stroke-opacity","circle-blur"],t.s)
B.d3=s([0,1,2,0,2,3],t.t)
B.d5=s(["heatmap-density"],t.s)
B.d4=s(["interpolate",B.ae,B.d5,0,"rgba(0, 0, 255, 0)",0.1,"royalblue",0.3,"cyan",0.5,"lime",0.7,"yellow",1,"red"],t.I)
B.d6=s([0,47,6,48,57,4,58,172,6,173,173,5,174,767,6,768,879,1,880,887,6,890,895,6,900,906,6,908,908,6,910,929,6,931,1154,6,1155,1159,1,1160,1161,3,1162,1327,6,1329,1366,6,1369,1418,6,1421,1423,6,1425,1469,1,1470,1470,6,1471,1471,1,1472,1472,6,1473,1474,1,1475,1475,6,1476,1477,1,1478,1478,6,1479,1479,1,1488,1514,6,1519,1524,6,1536,1541,5,1542,1551,6,1552,1562,1,1563,1563,6,1564,1564,5,1565,1610,6,1611,1631,1,1632,1641,4,1642,1647,6,1648,1648,1,1649,1749,6,1750,1756,1,1757,1757,5,1758,1758,6,1759,1764,1,1765,1766,6,1767,1768,1,1769,1769,6,1770,1773,1,1774,1775,6,1776,1785,4,1786,1805,6,1807,1807,5,1808,1808,6,1809,1809,1,1810,1839,6,1840,1866,1,1869,1957,6,1958,1968,1,1969,1969,6,1984,1993,4,1994,2026,6,2027,2035,1,2036,2042,6,2045,2045,1,2046,2069,6,2070,2073,1,2074,2074,6,2075,2083,1,2084,2084,6,2085,2087,1,2088,2088,6,2089,2093,1,2096,2110,6,2112,2136,6,2137,2139,1,2142,2142,6,2144,2154,6,2160,2190,6,2192,2193,5,2199,2207,1,2208,2249,6,2250,2273,1,2274,2274,5,2275,2306,1,2307,2307,2,2308,2361,6,2362,2362,1,2363,2363,2,2364,2364,1,2365,2365,6,2366,2368,2,2369,2376,1,2377,2380,2,2381,2381,1,2382,2383,2,2384,2384,6,2385,2391,1,2392,2401,6,2402,2403,1,2404,2405,6,2406,2415,4,2416,2432,6,2433,2433,1,2434,2435,2,2437,2444,6,2447,2448,6,2451,2472,6,2474,2480,6,2482,2482,6,2486,2489,6,2492,2492,1,2493,2493,6,2494,2496,2,2497,2500,1,2503,2504,2,2507,2508,2,2509,2509,1,2510,2510,6,2519,2519,2,2524,2525,6,2527,2529,6,2530,2531,1,2534,2543,4,2544,2557,6,2558,2558,1,2561,2562,1,2563,2563,2,2565,2570,6,2575,2576,6,2579,2600,6,2602,2608,6,2610,2611,6,2613,2614,6,2616,2617,6,2620,2620,1,2622,2624,2,2625,2626,1,2631,2632,1,2635,2637,1,2641,2641,1,2649,2652,6,2654,2654,6,2662,2671,4,2672,2673,1,2674,2676,6,2677,2677,1,2678,2678,6,2689,2690,1,2691,2691,2,2693,2701,6,2703,2705,6,2707,2728,6,2730,2736,6,2738,2739,6,2741,2745,6,2748,2748,1,2749,2749,6,2750,2752,2,2753,2757,1,2759,2760,1,2761,2761,2,2763,2764,2,2765,2765,1,2768,2768,6,2784,2785,6,2786,2787,1,2790,2799,4,2800,2801,6,2809,2809,6,2810,2815,1,2817,2817,1,2818,2819,2,2821,2828,6,2831,2832,6,2835,2856,6,2858,2864,6,2866,2867,6,2869,2873,6,2876,2876,1,2877,2877,6,2878,2878,2,2879,2879,1,2880,2880,2,2881,2884,1,2887,2888,2,2891,2892,2,2893,2893,1,2901,2902,1,2903,2903,2,2908,2909,6,2911,2913,6,2914,2915,1,2918,2927,4,2928,2935,6,2946,2946,1,2947,2947,6,2949,2954,6,2958,2960,6,2962,2965,6,2969,2970,6,2972,2972,6,2974,2975,6,2979,2980,6,2984,2986,6,2990,3001,6,3006,3007,2,3008,3008,1,3009,3010,2,3014,3016,2,3018,3020,2,3021,3021,1,3024,3024,6,3031,3031,2,3046,3055,4,3056,3066,6,3072,3072,1,3073,3075,2,3076,3076,1,3077,3084,6,3086,3088,6,3090,3112,6,3114,3129,6,3132,3132,1,3133,3133,6,3134,3136,1,3137,3140,2,3142,3144,1,3146,3149,1,3157,3158,1,3160,3162,6,3165,3165,6,3168,3169,6,3170,3171,1,3174,3183,4,3191,3200,6,3201,3201,1,3202,3203,2,3204,3212,6,3214,3216,6,3218,3240,6,3242,3251,6,3253,3257,6,3260,3260,1,3261,3261,6,3262,3262,2,3263,3263,1,3264,3268,2,3270,3270,1,3271,3272,2,3274,3275,2,3276,3277,1,3285,3286,2,3293,3294,6,3296,3297,6,3298,3299,1,3302,3311,4,3313,3314,6,3315,3315,2,3328,3329,1,3330,3331,2,3332,3340,6,3342,3344,6,3346,3386,6,3387,3388,1,3389,3389,6,3390,3392,2,3393,3396,1,3398,3400,2,3402,3404,2,3405,3405,1,3406,3407,6,3412,3414,6,3415,3415,2,3416,3425,6,3426,3427,1,3430,3439,4,3440,3455,6,3457,3457,1,3458,3459,2,3461,3478,6,3482,3505,6,3507,3515,6,3517,3517,6,3520,3526,6,3530,3530,1,3535,3537,2,3538,3540,1,3542,3542,1,3544,3551,2,3558,3567,4,3570,3571,2,3572,3572,6,3585,3632,6,3633,3633,1,3634,3635,6,3636,3642,1,3647,3654,6,3655,3662,1,3663,3663,6,3664,3673,4,3674,3675,6,3713,3714,6,3716,3716,6,3718,3722,6,3724,3747,6,3749,3749,6,3751,3760,6,3761,3761,1,3762,3763,6,3764,3772,1,3773,3773,6,3776,3780,6,3782,3782,6,3784,3790,1,3792,3801,4,3804,3807,6,3840,3863,6,3864,3865,1,3866,3871,6,3872,3881,4,3882,3892,6,3893,3893,1,3894,3894,6,3895,3895,1,3896,3896,6,3897,3897,1,3898,3901,6,3902,3903,2,3904,3911,6,3913,3948,6,3953,3966,1,3967,3967,2,3968,3972,1,3973,3973,6,3974,3975,1,3976,3980,6,3981,3991,1,3993,4028,1,4030,4037,6,4038,4038,1,4039,4044,6,4046,4058,6,4096,4138,6,4139,4140,2,4141,4144,1,4145,4145,2,4146,4151,1,4152,4152,2,4153,4154,1,4155,4156,2,4157,4158,1,4159,4159,6,4160,4169,4,4170,4181,6,4182,4183,2,4184,4185,1,4186,4189,6,4190,4192,1,4193,4193,6,4194,4196,2,4197,4198,6,4199,4205,2,4206,4208,6,4209,4212,1,4213,4225,6,4226,4226,1,4227,4228,2,4229,4230,1,4231,4236,2,4237,4237,1,4238,4238,6,4239,4239,2,4240,4249,4,4250,4252,2,4253,4253,1,4254,4293,6,4295,4295,6,4301,4301,6,4304,4680,6,4682,4685,6,4688,4694,6,4696,4696,6,4698,4701,6,4704,4744,6,4746,4749,6,4752,4784,6,4786,4789,6,4792,4798,6,4800,4800,6,4802,4805,6,4808,4822,6,4824,4880,6,4882,4885,6,4888,4954,6,4957,4959,1,4960,4988,6,4992,5017,6,5024,5109,6,5112,5117,6,5120,5788,6,5792,5880,6,5888,5905,6,5906,5908,1,5909,5909,2,5919,5937,6,5938,5939,1,5940,5940,2,5941,5942,6,5952,5969,6,5970,5971,1,5984,5996,6,5998,6000,6,6002,6003,1,6016,6067,6,6068,6069,1,6070,6070,2,6071,6077,1,6078,6085,2,6086,6086,1,6087,6088,2,6089,6099,1,6100,6108,6,6109,6109,1,6112,6121,4,6128,6137,6,6144,6154,6,6155,6157,1,6158,6158,5,6159,6159,1,6160,6169,4,6176,6264,6,6272,6276,6,6277,6278,1,6279,6312,6,6313,6313,1,6314,6314,6,6320,6389,6,6400,6430,6,6432,6434,1,6435,6438,2,6439,6440,1,6441,6443,2,6448,6449,2,6450,6450,1,6451,6456,2,6457,6459,1,6464,6464,6,6468,6469,6,6470,6479,4,6480,6509,6,6512,6516,6,6528,6571,6,6576,6601,6,6608,6617,4,6618,6618,6,6622,6678,6,6679,6680,1,6681,6682,2,6683,6683,1,6686,6740,6,6741,6741,2,6742,6742,1,6743,6743,2,6744,6750,1,6752,6752,1,6753,6753,2,6754,6754,1,6755,6756,2,6757,6764,1,6765,6770,2,6771,6780,1,6783,6783,1,6784,6793,4,6800,6809,4,6816,6829,6,6832,6845,1,6846,6846,3,6847,6862,1,6912,6915,1,6916,6916,2,6917,6963,6,6964,6964,1,6965,6965,2,6966,6970,1,6971,6971,2,6972,6972,1,6973,6977,2,6978,6978,1,6979,6980,2,6981,6988,6,6990,6991,6,6992,7001,4,7002,7018,6,7019,7027,1,7028,7039,6,7040,7041,1,7042,7042,2,7043,7072,6,7073,7073,2,7074,7077,1,7078,7079,2,7080,7081,1,7082,7082,2,7083,7085,1,7086,7087,6,7088,7097,4,7098,7141,6,7142,7142,1,7143,7143,2,7144,7145,1,7146,7148,2,7149,7149,1,7150,7150,2,7151,7153,1,7154,7155,2,7164,7203,6,7204,7211,2,7212,7219,1,7220,7221,2,7222,7223,1,7227,7231,6,7232,7241,4,7245,7247,6,7248,7257,4,7258,7306,6,7312,7354,6,7357,7367,6,7376,7378,1,7379,7379,6,7380,7392,1,7393,7393,2,7394,7400,1,7401,7404,6,7405,7405,1,7406,7411,6,7412,7412,1,7413,7414,6,7415,7415,2,7416,7417,1,7418,7418,6,7424,7615,6,7616,7679,1,7680,7957,6,7960,7965,6,7968,8005,6,8008,8013,6,8016,8023,6,8025,8025,6,8027,8027,6,8029,8029,6,8031,8061,6,8064,8116,6,8118,8132,6,8134,8147,6,8150,8155,6,8157,8175,6,8178,8180,6,8182,8190,6,8192,8202,6,8203,8207,5,8208,8233,6,8234,8238,5,8239,8287,6,8288,8292,5,8294,8303,5,8304,8305,6,8308,8334,6,8336,8348,6,8352,8384,6,8400,8412,1,8413,8416,3,8417,8417,1,8418,8420,3,8421,8432,1,8448,8587,6,8592,9257,6,9280,9290,6,9312,11123,6,11126,11157,6,11159,11502,6,11503,11505,1,11506,11507,6,11513,11557,6,11559,11559,6,11565,11565,6,11568,11623,6,11631,11632,6,11647,11647,1,11648,11670,6,11680,11686,6,11688,11694,6,11696,11702,6,11704,11710,6,11712,11718,6,11720,11726,6,11728,11734,6,11736,11742,6,11744,11775,1,11776,11869,6,11904,11929,6,11931,12019,6,12032,12245,6,12272,12329,6,12330,12333,1,12334,12335,2,12336,12351,6,12353,12438,6,12441,12442,1,12443,12543,6,12549,12591,6,12593,12686,6,12688,12773,6,12783,12830,6,12832,42124,6,42128,42182,6,42192,42527,6,42528,42537,4,42538,42539,6,42560,42606,6,42607,42607,1,42608,42610,3,42611,42611,6,42612,42621,1,42622,42653,6,42654,42655,1,42656,42735,6,42736,42737,1,42738,42743,6,42752,42957,6,42960,42961,6,42963,42963,6,42965,42972,6,42994,43009,6,43010,43010,1,43011,43013,6,43014,43014,1,43015,43018,6,43019,43019,1,43020,43042,6,43043,43044,2,43045,43046,1,43047,43047,2,43048,43051,6,43052,43052,1,43056,43065,6,43072,43127,6,43136,43137,2,43138,43187,6,43188,43203,2,43204,43205,1,43214,43215,6,43216,43225,4,43232,43249,1,43250,43262,6,43263,43263,1,43264,43273,4,43274,43301,6,43302,43309,1,43310,43334,6,43335,43345,1,43346,43347,2,43359,43388,6,43392,43394,1,43395,43395,2,43396,43442,6,43443,43443,1,43444,43445,2,43446,43449,1,43450,43451,2,43452,43453,1,43454,43456,2,43457,43469,6,43471,43471,6,43472,43481,4,43486,43492,6,43493,43493,1,43494,43503,6,43504,43513,4,43514,43518,6,43520,43560,6,43561,43566,1,43567,43568,2,43569,43570,1,43571,43572,2,43573,43574,1,43584,43586,6,43587,43587,1,43588,43595,6,43596,43596,1,43597,43597,2,43600,43609,4,43612,43642,6,43643,43643,2,43644,43644,1,43645,43645,2,43646,43695,6,43696,43696,1,43697,43697,6,43698,43700,1,43701,43702,6,43703,43704,1,43705,43709,6,43710,43711,1,43712,43712,6,43713,43713,1,43714,43714,6,43739,43754,6,43755,43755,2,43756,43757,1,43758,43759,2,43760,43764,6,43765,43765,2,43766,43766,1,43777,43782,6,43785,43790,6,43793,43798,6,43808,43814,6,43816,43822,6,43824,43883,6,43888,44002,6,44003,44004,2,44005,44005,1,44006,44007,2,44008,44008,1,44009,44010,2,44011,44011,6,44012,44012,2,44013,44013,1,44016,44025,4,44032,55203,6,55216,55238,6,55243,55291,6,55296,64109,6,64112,64217,6,64256,64262,6,64275,64279,6,64285,64285,6,64286,64286,1,64287,64310,6,64312,64316,6,64318,64318,6,64320,64321,6,64323,64324,6,64326,64450,6,64467,64911,6,64914,64967,6,64975,64975,6,65008,65023,6,65024,65039,1,65040,65049,6,65056,65071,1,65072,65106,6,65108,65126,6,65128,65131,6,65136,65140,6,65142,65276,6,65279,65279,5,65281,65295,6,65296,65305,4,65306,65470,6,65474,65479,6,65482,65487,6,65490,65495,6,65498,65500,6,65504,65510,6,65512,65518,6,65529,65531,5,65532,65533,6,65536,65547,6,65549,65574,6,65576,65594,6,65596,65597,6,65599,65613,6,65616,65629,6,65664,65786,6,65792,65794,6,65799,65843,6,65847,65934,6,65936,65948,6,65952,65952,6,66e3,66044,6,66045,66045,1,66176,66204,6,66208,66256,6,66272,66272,1,66273,66299,6,66304,66339,6,66349,66378,6,66384,66421,6,66422,66426,1,66432,66461,6,66463,66499,6,66504,66517,6,66560,66717,6,66720,66729,4,66736,66771,6,66776,66811,6,66816,66855,6,66864,66915,6,66927,66938,6,66940,66954,6,66956,66962,6,66964,66965,6,66967,66977,6,66979,66993,6,66995,67001,6,67003,67004,6,67008,67059,6,67072,67382,6,67392,67413,6,67424,67431,6,67456,67461,6,67463,67504,6,67506,67514,6,67584,67589,6,67592,67592,6,67594,67637,6,67639,67640,6,67644,67644,6,67647,67669,6,67671,67742,6,67751,67759,6,67808,67826,6,67828,67829,6,67835,67867,6,67871,67897,6,67903,67903,6,67968,68023,6,68028,68047,6,68050,68096,6,68097,68099,1,68101,68102,1,68108,68111,1,68112,68115,6,68117,68119,6,68121,68149,6,68152,68154,1,68159,68159,1,68160,68168,6,68176,68184,6,68192,68255,6,68288,68324,6,68325,68326,1,68331,68342,6,68352,68405,6,68409,68437,6,68440,68466,6,68472,68497,6,68505,68508,6,68521,68527,6,68608,68680,6,68736,68786,6,68800,68850,6,68858,68899,6,68900,68903,1,68912,68921,4,68928,68937,4,68938,68965,6,68969,68973,1,68974,68997,6,69006,69007,6,69216,69246,6,69248,69289,6,69291,69292,1,69293,69293,6,69296,69297,6,69314,69316,6,69372,69375,1,69376,69415,6,69424,69445,6,69446,69456,1,69457,69465,6,69488,69505,6,69506,69509,1,69510,69513,6,69552,69579,6,69600,69622,6,69632,69632,2,69633,69633,1,69634,69634,2,69635,69687,6,69688,69702,1,69703,69709,6,69714,69733,6,69734,69743,4,69744,69744,1,69745,69746,6,69747,69748,1,69749,69749,6,69759,69761,1,69762,69762,2,69763,69807,6,69808,69810,2,69811,69814,1,69815,69816,2,69817,69818,1,69819,69820,6,69821,69821,5,69822,69825,6,69826,69826,1,69837,69837,5,69840,69864,6,69872,69881,4,69888,69890,1,69891,69926,6,69927,69931,1,69932,69932,2,69933,69940,1,69942,69951,4,69952,69956,6,69957,69958,2,69959,69959,6,69968,70002,6,70003,70003,1,70004,70006,6,70016,70017,1,70018,70018,2,70019,70066,6,70067,70069,2,70070,70078,1,70079,70080,2,70081,70088,6,70089,70092,1,70093,70093,6,70094,70094,2,70095,70095,1,70096,70105,4,70106,70111,6,70113,70132,6,70144,70161,6,70163,70187,6,70188,70190,2,70191,70193,1,70194,70195,2,70196,70196,1,70197,70197,2,70198,70199,1,70200,70205,6,70206,70206,1,70207,70208,6,70209,70209,1,70272,70278,6,70280,70280,6,70282,70285,6,70287,70301,6,70303,70313,6,70320,70366,6,70367,70367,1,70368,70370,2,70371,70378,1,70384,70393,4,70400,70401,1,70402,70403,2,70405,70412,6,70415,70416,6,70419,70440,6,70442,70448,6,70450,70451,6,70453,70457,6,70459,70460,1,70461,70461,6,70462,70463,2,70464,70464,1,70465,70468,2,70471,70472,2,70475,70477,2,70480,70480,6,70487,70487,2,70493,70497,6,70498,70499,2,70502,70508,1,70512,70516,1,70528,70537,6,70539,70539,6,70542,70542,6,70544,70581,6,70583,70583,6,70584,70586,2,70587,70592,1,70594,70594,2,70597,70597,2,70599,70602,2,70604,70605,2,70606,70606,1,70607,70607,2,70608,70608,1,70609,70609,6,70610,70610,1,70611,70613,6,70615,70616,6,70625,70626,1,70656,70708,6,70709,70711,2,70712,70719,1,70720,70721,2,70722,70724,1,70725,70725,2,70726,70726,1,70727,70735,6,70736,70745,4,70746,70747,6,70749,70749,6,70750,70750,1,70751,70753,6,70784,70831,6,70832,70834,2,70835,70840,1,70841,70841,2,70842,70842,1,70843,70846,2,70847,70848,1,70849,70849,2,70850,70851,1,70852,70855,6,70864,70873,4,71040,71086,6,71087,71089,2,71090,71093,1,71096,71099,2,71100,71101,1,71102,71102,2,71103,71104,1,71105,71131,6,71132,71133,1,71168,71215,6,71216,71218,2,71219,71226,1,71227,71228,2,71229,71229,1,71230,71230,2,71231,71232,1,71233,71236,6,71248,71257,4,71264,71276,6,71296,71338,6,71339,71339,1,71340,71340,2,71341,71341,1,71342,71343,2,71344,71349,1,71350,71350,2,71351,71351,1,71352,71353,6,71360,71369,4,71376,71395,4,71424,71450,6,71453,71453,1,71454,71454,2,71455,71455,1,71456,71457,2,71458,71461,1,71462,71462,2,71463,71467,1,71472,71481,4,71482,71494,6,71680,71723,6,71724,71726,2,71727,71735,1,71736,71736,2,71737,71738,1,71739,71739,6,71840,71903,6,71904,71913,4,71914,71922,6,71935,71942,6,71945,71945,6,71948,71955,6,71957,71958,6,71960,71983,6,71984,71989,2,71991,71992,2,71995,71996,1,71997,71997,2,71998,71998,1,71999,71999,6,72e3,72e3,2,72001,72001,6,72002,72002,2,72003,72003,1,72004,72006,6,72016,72025,4,72096,72103,6,72106,72144,6,72145,72147,2,72148,72151,1,72154,72155,1,72156,72159,2,72160,72160,1,72161,72163,6,72164,72164,2,72192,72192,6,72193,72202,1,72203,72242,6,72243,72248,1,72249,72249,2,72250,72250,6,72251,72254,1,72255,72262,6,72263,72263,1,72272,72272,6,72273,72278,1,72279,72280,2,72281,72283,1,72284,72329,6,72330,72342,1,72343,72343,2,72344,72345,1,72346,72354,6,72368,72440,6,72448,72457,6,72640,72673,6,72688,72697,4,72704,72712,6,72714,72750,6,72751,72751,2,72752,72758,1,72760,72765,1,72766,72766,2,72767,72767,1,72768,72773,6,72784,72793,4,72794,72812,6,72816,72847,6,72850,72871,1,72873,72873,2,72874,72880,1,72881,72881,2,72882,72883,1,72884,72884,2,72885,72886,1,72960,72966,6,72968,72969,6,72971,73008,6,73009,73014,1,73018,73018,1,73020,73021,1,73023,73029,1,73030,73030,6,73031,73031,1,73040,73049,4,73056,73061,6,73063,73064,6,73066,73097,6,73098,73102,2,73104,73105,1,73107,73108,2,73109,73109,1,73110,73110,2,73111,73111,1,73112,73112,6,73120,73129,4,73440,73458,6,73459,73460,1,73461,73462,2,73463,73464,6,73472,73473,1,73474,73474,6,73475,73475,2,73476,73488,6,73490,73523,6,73524,73525,2,73526,73530,1,73534,73535,2,73536,73536,1,73537,73537,2,73538,73538,1,73539,73551,6,73552,73561,4,73562,73562,1,73648,73648,6,73664,73713,6,73727,74649,6,74752,74862,6,74864,74868,6,74880,75075,6,77712,77810,6,77824,78895,6,78896,78911,5,78912,78912,1,78913,78918,6,78919,78933,1,78944,82938,6,82944,83526,6,90368,90397,6,90398,90409,1,90410,90412,2,90413,90415,1,90416,90425,4,92160,92728,6,92736,92766,6,92768,92777,4,92782,92862,6,92864,92873,4,92880,92909,6,92912,92916,1,92917,92917,6,92928,92975,6,92976,92982,1,92983,92997,6,93008,93017,4,93019,93025,6,93027,93047,6,93053,93071,6,93504,93551,6,93552,93561,4,93760,93850,6,93952,94026,6,94031,94031,1,94032,94032,6,94033,94087,2,94095,94098,1,94099,94111,6,94176,94179,6,94180,94180,1,94192,94193,2,94208,100343,6,100352,101589,6,101631,101640,6,110576,110579,6,110581,110587,6,110589,110590,6,110592,110882,6,110898,110898,6,110928,110930,6,110933,110933,6,110948,110951,6,110960,111355,6,113664,113770,6,113776,113788,6,113792,113800,6,113808,113817,6,113820,113820,6,113821,113822,1,113823,113823,6,113824,113827,5,117760,117999,6,118e3,118009,4,118016,118451,6,118528,118573,1,118576,118598,1,118608,118723,6,118784,119029,6,119040,119078,6,119081,119140,6,119141,119142,2,119143,119145,1,119146,119148,6,119149,119154,2,119155,119162,5,119163,119170,1,119171,119172,6,119173,119179,1,119180,119209,6,119210,119213,1,119214,119274,6,119296,119361,6,119362,119364,1,119365,119365,6,119488,119507,6,119520,119539,6,119552,119638,6,119648,119672,6,119808,119892,6,119894,119964,6,119966,119967,6,119970,119970,6,119973,119974,6,119977,119980,6,119982,119993,6,119995,119995,6,119997,120003,6,120005,120069,6,120071,120074,6,120077,120084,6,120086,120092,6,120094,120121,6,120123,120126,6,120128,120132,6,120134,120134,6,120138,120144,6,120146,120485,6,120488,120779,6,120782,120831,4,120832,121343,6,121344,121398,1,121399,121402,6,121403,121452,1,121453,121460,6,121461,121461,1,121462,121475,6,121476,121476,1,121477,121483,6,121499,121503,1,121505,121519,1,122624,122654,6,122661,122666,6,122880,122886,1,122888,122904,1,122907,122913,1,122915,122916,1,122918,122922,1,122928,122989,6,123023,123023,1,123136,123180,6,123184,123190,1,123191,123197,6,123200,123209,4,123214,123215,6,123536,123565,6,123566,123566,1,123584,123627,6,123628,123631,1,123632,123641,4,123647,123647,6,124112,124139,6,124140,124143,1,124144,124153,4,124368,124397,6,124398,124399,1,124400,124400,6,124401,124410,4,124415,124415,6,124896,124902,6,124904,124907,6,124909,124910,6,124912,124926,6,124928,125124,6,125127,125135,6,125136,125142,1,125184,125251,6,125252,125258,1,125259,125259,6,125264,125273,4,125278,125279,6,126065,126132,6,126209,126269,6,126464,126467,6,126469,126495,6,126497,126498,6,126500,126500,6,126503,126503,6,126505,126514,6,126516,126519,6,126521,126521,6,126523,126523,6,126530,126530,6,126535,126535,6,126537,126537,6,126539,126539,6,126541,126543,6,126545,126546,6,126548,126548,6,126551,126551,6,126553,126553,6,126555,126555,6,126557,126557,6,126559,126559,6,126561,126562,6,126564,126564,6,126567,126570,6,126572,126578,6,126580,126583,6,126585,126588,6,126590,126590,6,126592,126601,6,126603,126619,6,126625,126627,6,126629,126633,6,126635,126651,6,126704,126705,6,126976,127019,6,127024,127123,6,127136,127150,6,127153,127167,6,127169,127183,6,127185,127221,6,127232,127405,6,127462,127490,6,127504,127547,6,127552,127560,6,127568,127569,6,127584,127589,6,127744,128727,6,128732,128748,6,128752,128764,6,128768,128886,6,128891,128985,6,128992,129003,6,129008,129008,6,129024,129035,6,129040,129095,6,129104,129113,6,129120,129159,6,129168,129197,6,129200,129211,6,129216,129217,6,129280,129619,6,129632,129645,6,129648,129660,6,129664,129673,6,129679,129734,6,129742,129756,6,129759,129769,6,129776,129784,6,129792,129938,6,129940,130031,6,130032,130041,4,131072,173791,6,173824,177977,6,177984,178205,6,178208,183969,6,183984,191456,6,191472,192093,6,194560,195101,6,196608,201546,6,201552,205743,6,917505,917505,5,917536,917631,5,917760,917999,1,983040,1048573,6,1048576,1114109,6],t.t)
B.dk={a:0,c:1,d:2,e:3,g:4,h:5,i:6,j:7,k:8,l:9,n:10,o:11,r:12,s:13,t:14,u:15,w:16,y:17,z:18}
B.d7=new A.af(B.dk,["\xe0\xe1\xe2\xe3\xe4\xe5\u0101\u0103\u0105","\xe7\u0107\u0109\u010b\u010d","\u010f\u0111","\xe8\xe9\xea\xeb\u0113\u0115\u0117\u0119\u011b","\u011d\u011f\u0121\u0123","\u0125\u0127","\xec\xed\xee\xef\u0129\u012b\u012d\u012f\u0131","\u0135","\u0137","\u013a\u013c\u013e\u0140\u0142","\xf1\u0144\u0146\u0148\u0149","\xf2\xf3\xf4\xf5\xf6\xf8\u014d\u014f\u0151","\u0155\u0157\u0159","\u015b\u015d\u015f\u0161","\u0163\u0165\u0167","\xf9\xfa\xfb\xfc\u0169\u016b\u016d\u016f\u0171\u0173","\u0175","\xfd\xff\u0177","\u017a\u017c\u017e"],t.p1)
B.cs=s([65269,65270,0,0],t.t)
B.ct=s([65271,65272,0,0],t.t)
B.cu=s([65273,65274,0,0],t.t)
B.cv=s([65275,65276,0,0],t.t)
B.bS=s([64579,64646,0,0],t.t)
B.d8=new A.c8([1570,B.cs,1571,B.ct,1573,B.cu,1575,B.cv,1609,B.bS],t.nD)
B.T=new A.c8([1552,1,1553,1,1554,1,1555,1,1556,1,1557,1,1558,1,1559,1,1560,1,1561,1,1562,1,1564,1,1568,2,1570,3,1571,3,1572,3,1573,3,1574,2,1575,3,1576,2,1577,3,1578,2,1579,2,1580,2,1581,2,1582,2,1583,3,1584,3,1585,3,1586,3,1587,2,1588,2,1589,2,1590,2,1591,2,1592,2,1593,2,1594,2,1595,2,1596,2,1597,2,1598,2,1599,2,1600,5,1601,2,1602,2,1603,2,1604,2,1605,2,1606,2,1607,2,1608,3,1609,2,1610,2,1611,1,1612,1,1613,1,1614,1,1615,1,1616,1,1617,1,1618,1,1619,1,1620,1,1621,1,1622,1,1623,1,1624,1,1625,1,1626,1,1627,1,1628,1,1629,1,1630,1,1631,1,1646,2,1647,2,1648,1,1649,3,1650,3,1651,3,1653,3,1654,3,1655,3,1656,2,1657,2,1658,2,1659,2,1660,2,1661,2,1662,2,1663,2,1664,2,1665,2,1666,2,1667,2,1668,2,1669,2,1670,2,1671,2,1672,3,1673,3,1674,3,1675,3,1676,3,1677,3,1678,3,1679,3,1680,3,1681,3,1682,3,1683,3,1684,3,1685,3,1686,3,1687,3,1688,3,1689,3,1690,2,1691,2,1692,2,1693,2,1694,2,1695,2,1696,2,1697,2,1698,2,1699,2,1700,2,1701,2,1702,2,1703,2,1704,2,1705,2,1706,2,1707,2,1708,2,1709,2,1710,2,1711,2,1712,2,1713,2,1714,2,1715,2,1716,2,1717,2,1718,2,1719,2,1720,2,1721,2,1722,2,1723,2,1724,2,1725,2,1726,2,1727,2,1728,3,1729,2,1730,2,1731,3,1732,3,1733,3,1734,3,1735,3,1736,3,1737,3,1738,3,1739,3,1740,2,1741,3,1742,2,1743,3,1744,2,1745,2,1746,3,1747,3,1749,3,1750,1,1751,1,1752,1,1753,1,1754,1,1755,1,1756,1,1759,1,1760,1,1761,1,1762,1,1763,1,1764,1,1767,1,1768,1,1770,1,1771,1,1772,1,1773,1,1774,3,1775,3,1786,2,1787,2,1788,2,1791,2,1807,1,1808,3,1809,1,1810,2,1811,2,1812,2,1813,3,1814,3,1815,3,1816,3,1817,3,1818,2,1819,2,1820,2,1821,2,1822,3,1823,2,1824,2,1825,2,1826,2,1827,2,1828,2,1829,2,1830,2,1831,2,1832,3,1833,2,1834,3,1835,2,1836,3,1837,2,1838,2,1839,3,1840,1,1841,1,1842,1,1843,1,1844,1,1845,1,1846,1,1847,1,1848,1,1849,1,1850,1,1851,1,1852,1,1853,1,1854,1,1855,1,1856,1,1857,1,1858,1,1859,1,1860,1,1861,1,1862,1,1863,1,1864,1,1865,1,1866,1,1869,3,1870,2,1871,2,1872,2,1873,2,1874,2,1875,2,1876,2,1877,2,1878,2,1879,2,1880,2,1881,3,1882,3,1883,3,1884,2,1885,2,1886,2,1887,2,1888,2,1889,2,1890,2,1891,2,1892,2,1893,2,1894,2,1895,2,1896,2,1897,2,1898,2,1899,3,1900,3,1901,2,1902,2,1903,2,1904,2,1905,3,1906,2,1907,3,1908,3,1909,2,1910,2,1911,2,1912,3,1913,3,1914,2,1915,2,1916,2,1917,2,1918,2,1919,2,1958,1,1959,1,1960,1,1961,1,1962,1,1963,1,1964,1,1965,1,1966,1,1967,1,1968,1,1994,2,1995,2,1996,2,1997,2,1998,2,1999,2,2000,2,2001,2,2002,2,2003,2,2004,2,2005,2,2006,2,2007,2,2008,2,2009,2,2010,2,2011,2,2012,2,2013,2,2014,2,2015,2,2016,2,2017,2,2018,2,2019,2,2020,2,2021,2,2022,2,2023,2,2024,2,2025,2,2026,2,2027,1,2028,1,2029,1,2030,1,2031,1,2032,1,2033,1,2034,1,2035,1,2042,5,2045,1,2070,1,2071,1,2072,1,2073,1,2075,1,2076,1,2077,1,2078,1,2079,1,2080,1,2081,1,2082,1,2083,1,2085,1,2086,1,2087,1,2089,1,2090,1,2091,1,2092,1,2093,1,2112,3,2113,2,2114,2,2115,2,2116,2,2117,2,2118,3,2119,3,2120,2,2121,3,2122,2,2123,2,2124,2,2125,2,2126,2,2127,2,2128,2,2129,2,2130,2,2131,2,2132,3,2133,2,2134,3,2135,3,2136,3,2137,1,2138,1,2139,1,2144,2,2146,2,2147,2,2148,2,2149,2,2151,3,2152,2,2153,3,2154,3,2160,3,2161,3,2162,3,2163,3,2164,3,2165,3,2166,3,2167,3,2168,3,2169,3,2170,3,2171,3,2172,3,2173,3,2174,3,2175,3,2176,3,2177,3,2178,3,2179,5,2180,5,2181,5,2182,2,2185,2,2186,2,2187,2,2188,2,2189,2,2190,3,2191,2,2199,1,2200,1,2201,1,2202,1,2203,1,2204,1,2205,1,2206,1,2207,1,2208,2,2209,2,2210,2,2211,2,2212,2,2213,2,2214,2,2215,2,2216,2,2217,2,2218,3,2219,3,2220,3,2222,3,2223,2,2224,2,2225,3,2226,3,2227,2,2228,2,2229,2,2230,2,2231,2,2232,2,2233,3,2234,2,2235,2,2236,2,2237,2,2238,2,2239,2,2240,2,2241,2,2242,2,2243,2,2244,2,2245,2,2246,2,2247,2,2248,2,2250,1,2251,1,2252,1,2253,1,2254,1,2255,1,2256,1,2257,1,2258,1,2259,1,2260,1,2261,1,2262,1,2263,1,2264,1,2265,1,2266,1,2267,1,2268,1,2269,1,2270,1,2271,1,2272,1,2273,1,2275,1,2276,1,2277,1,2278,1,2279,1,2280,1,2281,1,2282,1,2283,1,2284,1,2285,1,2286,1,2287,1,2288,1,2289,1,2290,1,2291,1,2292,1,2293,1,2294,1,2295,1,2296,1,2297,1,2298,1,2299,1,2300,1,2301,1,2302,1,2303,1,65279,1],A.ak("c8<c,c>"))
B.bT=s([65152,0,0,0],t.t)
B.bU=s([65153,65154,0,0],t.t)
B.bV=s([65155,65156,0,0],t.t)
B.bW=s([65157,65158,0,0],t.t)
B.bX=s([65159,65160,0,0],t.t)
B.bY=s([65161,65162,65163,65164],t.t)
B.bZ=s([65165,65166,0,0],t.t)
B.c_=s([65167,65168,65169,65170],t.t)
B.c0=s([65171,65172,0,0],t.t)
B.c1=s([65173,65174,65175,65176],t.t)
B.c2=s([65177,65178,65179,65180],t.t)
B.c3=s([65181,65182,65183,65184],t.t)
B.c4=s([65185,65186,65187,65188],t.t)
B.c5=s([65189,65190,65191,65192],t.t)
B.c6=s([65193,65194,0,0],t.t)
B.c7=s([65195,65196,0,0],t.t)
B.c8=s([65197,65198,0,0],t.t)
B.c9=s([65199,65200,0,0],t.t)
B.ca=s([65201,65202,65203,65204],t.t)
B.cb=s([65205,65206,65207,65208],t.t)
B.cc=s([65209,65210,65211,65212],t.t)
B.cd=s([65213,65214,65215,65216],t.t)
B.ce=s([65217,65218,65219,65220],t.t)
B.cf=s([65221,65222,65223,65224],t.t)
B.cg=s([65225,65226,65227,65228],t.t)
B.ch=s([65229,65230,65231,65232],t.t)
B.ci=s([65233,65234,65235,65236],t.t)
B.cj=s([65237,65238,65239,65240],t.t)
B.ck=s([65241,65242,65243,65244],t.t)
B.cl=s([65245,65246,65247,65248],t.t)
B.cm=s([65249,65250,65251,65252],t.t)
B.cn=s([65253,65254,65255,65256],t.t)
B.co=s([65257,65258,65259,65260],t.t)
B.cp=s([65261,65262,0,0],t.t)
B.cq=s([65263,65264,64488,64489],t.t)
B.cr=s([65265,65266,65267,65268],t.t)
B.be=s([64336,64337,0,0],t.t)
B.bM=s([64477,0,0,0],t.t)
B.bk=s([64358,64359,64360,64361],t.t)
B.bi=s([64350,64351,64352,64353],t.t)
B.bf=s([64338,64339,64340,64341],t.t)
B.bg=s([64342,64343,64344,64345],t.t)
B.bj=s([64354,64355,64356,64357],t.t)
B.bh=s([64346,64347,64348,64349],t.t)
B.bo=s([64374,64375,64376,64377],t.t)
B.bn=s([64370,64371,64372,64373],t.t)
B.bp=s([64378,64379,64380,64381],t.t)
B.bq=s([64382,64383,64384,64385],t.t)
B.bu=s([64392,64393,0,0],t.t)
B.bs=s([64388,64389,0,0],t.t)
B.br=s([64386,64387,0,0],t.t)
B.bt=s([64390,64391,0,0],t.t)
B.bw=s([64396,64397,0,0],t.t)
B.bv=s([64394,64395,0,0],t.t)
B.bl=s([64362,64363,64364,64365],t.t)
B.bm=s([64366,64367,64368,64369],t.t)
B.bx=s([64398,64399,64400,64401],t.t)
B.bI=s([64467,64468,64469,64470],t.t)
B.by=s([64402,64403,64404,64405],t.t)
B.bA=s([64410,64411,64412,64413],t.t)
B.bz=s([64406,64407,64408,64409],t.t)
B.bB=s([64414,64415,0,0],t.t)
B.bC=s([64416,64417,64418,64419],t.t)
B.bF=s([64426,64427,64428,64429],t.t)
B.bD=s([64420,64421,0,0],t.t)
B.bE=s([64422,64423,64424,64425],t.t)
B.bO=s([64480,64481,0,0],t.t)
B.bK=s([64473,64474,0,0],t.t)
B.bJ=s([64471,64472,0,0],t.t)
B.bL=s([64475,64476,0,0],t.t)
B.bP=s([64482,64483,0,0],t.t)
B.bN=s([64478,64479,0,0],t.t)
B.bR=s([64508,64509,64510,64511],t.t)
B.bQ=s([64484,64485,64486,64487],t.t)
B.bG=s([64430,64431,0,0],t.t)
B.bH=s([64432,64433,0,0],t.t)
B.d9=new A.c8([1569,B.bT,1570,B.bU,1571,B.bV,1572,B.bW,1573,B.bX,1574,B.bY,1575,B.bZ,1576,B.c_,1577,B.c0,1578,B.c1,1579,B.c2,1580,B.c3,1581,B.c4,1582,B.c5,1583,B.c6,1584,B.c7,1585,B.c8,1586,B.c9,1587,B.ca,1588,B.cb,1589,B.cc,1590,B.cd,1591,B.ce,1592,B.cf,1593,B.cg,1594,B.ch,1601,B.ci,1602,B.cj,1603,B.ck,1604,B.cl,1605,B.cm,1606,B.cn,1607,B.co,1608,B.cp,1609,B.cq,1610,B.cr,1649,B.be,1655,B.bM,1657,B.bk,1658,B.bi,1659,B.bf,1662,B.bg,1663,B.bj,1664,B.bh,1667,B.bo,1668,B.bn,1670,B.bp,1671,B.bq,1672,B.bu,1676,B.bs,1677,B.br,1678,B.bt,1681,B.bw,1688,B.bv,1700,B.bl,1702,B.bm,1705,B.bx,1709,B.bI,1711,B.by,1713,B.bA,1715,B.bz,1722,B.bB,1723,B.bC,1726,B.bF,1728,B.bD,1729,B.bE,1733,B.bO,1734,B.bK,1735,B.bJ,1736,B.bL,1737,B.bP,1739,B.bN,1740,B.bR,1744,B.bQ,1746,B.bG,1747,B.bH],t.nD)
B.dh={Arabic:0,Syriac:1,Nko:2,Thaana:3,Mongolian:4,Adlam:5,Mandaic:6,Manichaean:7,Psalter_Pahlavi:8,Hanifi_Rohingya:9,Sogdian:10,Old_Sogdian:11,Old_Uyghur:12,Chorasmian:13,Phags_Pa:14,Latin:15,Cyrillic:16,Greek:17,Hebrew:18,Armenian:19,Georgian:20,Coptic:21,Glagolitic:22,Gothic:23,Runic:24,Ogham:25,Cherokee:26,Deseret:27,Osage:28,Shavian:29,Vai:30,Tifinagh:31,Ethiopic:32,Canadian_Aboriginal:33,Braille:34,Han:35,Hiragana:36,Katakana:37,Hangul:38,Bopomofo:39,Yi:40,Nushu:41,Tangut:42,Devanagari:43,Bengali:44,Gurmukhi:45,Gujarati:46,Oriya:47,Tamil:48,Telugu:49,Kannada:50,Malayalam:51,Sinhala:52,Myanmar:53,Khmer:54,Thai:55,Lao:56,Tibetan:57,Tai_Tham:58,Tai_Le:59,New_Tai_Lue:60,Tai_Viet:61,Balinese:62,Javanese:63,Sundanese:64,Batak:65,Buginese:66,Rejang:67,Cham:68,Kayah_Li:69,Lepcha:70,Limbu:71,Meetei_Mayek:72,Syloti_Nagri:73,Chakma:74,Sharada:75,Takri:76,Khojki:77,Khudawadi:78,Multani:79,Modi:80,Grantha:81,Tirhuta:82,Newa:83,Ahom:84,Brahmi:85,Kaithi:86,Kharoshthi:87,Saurashtra:88,Mahajani:89}
B.da=new A.af(B.dh,["arab","syrc","nko","thaa","mong","adlm","mand","mani","phlp","rohg","sogd","sogo","ougr","chrs","phag","latn","cyrl","grek","hebr","armn","geor","copt","glag","goth","runr","ogam","cher","dsrt","osge","shaw","vai","tfng","ethi","cans","brai","hani","kana","kana","hang","bopo","yi","nshu","tang","dev2","bng2","gur2","gjr2","ory2","tml2","tel2","knd2","mlm2","sinh","mym2","khmr","thai","lao","tibt","lana","tale","talu","tavt","bali","java","sund","batk","bugi","rjng","cham","kali","lepc","limb","mtei","sylo","cakm","shrd","takr","khoj","sind","mult","modi","gran","tirh","newa","ahom","brah","kthi","khar","saur","mahj"],t.p1)
B.p={}
B.dd=new A.af(B.p,[],A.ak("af<q,n?(A)>"))
B.e=new A.af(B.p,[],A.ak("af<q,n?>"))
B.db=new A.af(B.p,[],A.ak("af<q,+(d,d)>"))
B.af=new A.af(B.p,[],A.ak("af<@,@>"))
B.dc=new A.af(B.p,[],A.ak("af<n?,O<q,n?>>"))
B.w=new A.af(B.p,[],A.ak("af<n?,n?>"))
B.dm={transparent:0,aliceblue:1,antiquewhite:2,aqua:3,aquamarine:4,azure:5,beige:6,bisque:7,black:8,blanchedalmond:9,blue:10,blueviolet:11,brown:12,burlywood:13,cadetblue:14,chartreuse:15,chocolate:16,coral:17,cornflowerblue:18,cornsilk:19,crimson:20,cyan:21,darkblue:22,darkcyan:23,darkgoldenrod:24,darkgray:25,darkgreen:26,darkgrey:27,darkkhaki:28,darkmagenta:29,darkolivegreen:30,darkorange:31,darkorchid:32,darkred:33,darksalmon:34,darkseagreen:35,darkslateblue:36,darkslategray:37,darkslategrey:38,darkturquoise:39,darkviolet:40,deeppink:41,deepskyblue:42,dimgray:43,dimgrey:44,dodgerblue:45,firebrick:46,floralwhite:47,forestgreen:48,fuchsia:49,gainsboro:50,ghostwhite:51,gold:52,goldenrod:53,gray:54,green:55,greenyellow:56,grey:57,honeydew:58,hotpink:59,indianred:60,indigo:61,ivory:62,khaki:63,lavender:64,lavenderblush:65,lawngreen:66,lemonchiffon:67,lightblue:68,lightcoral:69,lightcyan:70,lightgoldenrodyellow:71,lightgray:72,lightgreen:73,lightgrey:74,lightpink:75,lightsalmon:76,lightseagreen:77,lightskyblue:78,lightslategray:79,lightslategrey:80,lightsteelblue:81,lightyellow:82,lime:83,limegreen:84,linen:85,magenta:86,maroon:87,mediumaquamarine:88,mediumblue:89,mediumorchid:90,mediumpurple:91,mediumseagreen:92,mediumslateblue:93,mediumspringgreen:94,mediumturquoise:95,mediumvioletred:96,midnightblue:97,mintcream:98,mistyrose:99,moccasin:100,navajowhite:101,navy:102,oldlace:103,olive:104,olivedrab:105,orange:106,orangered:107,orchid:108,palegoldenrod:109,palegreen:110,paleturquoise:111,palevioletred:112,papayawhip:113,peachpuff:114,peru:115,pink:116,plum:117,powderblue:118,purple:119,rebeccapurple:120,red:121,rosybrown:122,royalblue:123,saddlebrown:124,salmon:125,sandybrown:126,seagreen:127,seashell:128,sienna:129,silver:130,skyblue:131,slateblue:132,slategray:133,slategrey:134,snow:135,springgreen:136,steelblue:137,tan:138,teal:139,thistle:140,tomato:141,turquoise:142,violet:143,wheat:144,white:145,whitesmoke:146,yellow:147,yellowgreen:148}
B.de=new A.af(B.dm,[0,4293982463,4294634455,4278255615,4286578644,4293984255,4294309340,4294960324,4278190080,4294962125,4278190335,4287245282,4289014314,4292786311,4284456608,4286578432,4291979550,4294934352,4284782061,4294965468,4292613180,4278255615,4278190219,4278225803,4290283019,4289309097,4278215680,4289309097,4290623339,4287299723,4283788079,4294937600,4288230092,4287299584,4293498490,4287609999,4282924427,4281290575,4281290575,4278243025,4287889619,4294907027,4278239231,4285098345,4285098345,4280193279,4289864226,4294966e3,4280453922,4294902015,4292664540,4294506751,4294956800,4292519200,4286611584,4278222848,4289593135,4286611584,4293984240,4294928820,4291648604,4283105410,4294967280,4293977740,4293322490,4294963445,4286381056,4294965965,4289583334,4293951616,4292935679,4294638290,4292072403,4287688336,4292072403,4294948545,4294942842,4280332970,4287090426,4286023833,4286023833,4289774814,4294967264,4278255360,4281519410,4294635750,4294902015,4286578688,4284927402,4278190285,4290401747,4287852763,4282168177,4286277870,4278254234,4282962380,4291237253,4279834992,4294311930,4294960353,4294960309,4294958765,4278190208,4294833638,4286611456,4285238819,4294944e3,4294919424,4292505814,4293847210,4288215960,4289720046,4292571283,4294963157,4294957753,4291659071,4294951115,4292714717,4289781990,4286578816,4284887961,4294901760,4290547599,4282477025,4287317267,4294606962,4294222944,4281240407,4294964718,4288696877,4290822336,4287090411,4285160141,4285563024,4285563024,4294966010,4278255487,4282811060,4291998860,4278222976,4292394968,4294927175,4282441936,4293821166,4294303411,4294967295,4294309365,4294967040,4288335154],A.ak("af<q,c>"))
B.fj=new A.hp(2,"composedDiacritics")
B.dn=new A.f(0,0)
B.er=new A.f(32,4)
B.eA=new A.f(64,8)
B.eU=new A.ad(0,0,0,0)
B.eV=new A.ad(0,0,0,1)
B.dl={thin:0,hairline:1,extralight:2,ultralight:3,light:4,regular:5,normal:6,book:7,medium:8,semibold:9,demibold:10,demi:11,bold:12,extrabold:13,ultrabold:14,black:15,heavy:16,italic:17,oblique:18,condensed:19,semicondensed:20,expanded:21,extra:22,semi:23,ultra:24}
B.eW=new A.b8(B.dl,25,t.Z)
B.dj={literal:0,get:1,has:2,"!":3,"==":4,"!=":5,"<":6,"<=":7,">":8,">=":9,all:10,any:11,none:12,case:13,match:14,coalesce:15,step:16,interpolate:17,"interpolate-hcl":18,"interpolate-lab":19,zoom:20,"geometry-type":21,"to-string":22,"to-number":23,"to-boolean":24,"to-color":25,string:26,number:27,boolean:28,array:29,object:30,concat:31,upcase:32,downcase:33,"+":34,"-":35,"*":36,"/":37,"%":38,"^":39,min:40,max:41,round:42,floor:43,ceil:44,abs:45,sqrt:46,ln:47,log10:48,log2:49,length:50,in:51,"!in":52,"!has":53,at:54,format:55,"number-format":56,rgb:57,rgba:58,var:59,let:60,id:61,properties:62,"feature-state":63,image:64,typeof:65,collator:66,"resolved-locale":67,"is-supported-script":68,slice:69,"index-of":70,e:71,pi:72,ln2:73,"line-progress":74,"heatmap-density":75,sin:76,cos:77,tan:78,asin:79,acos:80,atan:81,within:82,distance:83,accumulated:84,"to-rgba":85,hsl:86,hsla:87,split:88,join:89,semiliteral:90,$images:91,$transition:92}
B.eX=new A.b8(B.dj,93,t.Z)
B.eY=new A.c9([1634885986,1937338979,1852534560,1952997729,1835101796,1633971309,1751474802,1935764850,1835363940,1835101801,1885891696,1919903847,1936680804,1936680815,1869965170,1667789427,1634889065,1635152756,1668313716,1802002802,1819894889,1835364975,1835364963,1851880034,1851941236,1885432941,1885891689,1885892216,1886549097,1935766114,1869769576,1751217266,1752526439,2036693609,1701607789],t.cR)
B.eZ=new A.c9([1813,1814,1834,1792],t.cR)
B.dg={"raster-hue-rotate":0,"raster-saturation":1,"raster-contrast":2,"raster-brightness-min":3,"raster-brightness-max":4}
B.ai=new A.b8(B.dg,5,t.Z)
B.aj=new A.c9([1634885986,1937338979,1852534560,1836019303,1885888871,1835101796,1835101801,1885891696,1919903847,1936680804,1936680815,1869965170,1667789427],t.cR)
B.V=new A.b8(B.p,0,A.ak("b8<c>"))
B.di={"user-agent":0,"accept-encoding":1}
B.f_=new A.b8(B.di,2,t.Z)
B.cS=s([],t.G)
B.f0=new A.hK(B.cS)
B.ak=new A.cn(0,"left")
B.al=new A.cn(1,"right")
B.f1=new A.cn(2,"center")
B.f2=new A.cn(4,"start")
B.f3=new A.cn(5,"end")
B.y=new A.eZ(0,"ltr")
B.l=new A.eZ(1,"rtl")
B.f4=A.b1("zv")
B.f5=A.b1("qF")
B.f6=A.b1("bz")
B.f7=A.b1("c7")
B.f8=A.b1("pn")
B.f9=A.b1("ev")
B.fa=A.b1("vf")
B.fb=A.b1("S")
B.fc=A.b1("n")
B.fd=A.b1("lq")
B.fe=A.b1("lr")
B.ff=A.b1("wl")
B.fg=A.b1("co")
B.fh=new A.hY(!1)
B.fi=new A.hY(!0)})();(function staticFields(){$.lX=null
$.aU=A.b([],t.I)
$.rf=null
$.qB=null
$.qA=null
$.tv=null
$.to=null
$.tD=null
$.oC=null
$.oM=null
$.q6=null
$.m4=A.b([],A.ak("p<l<n>?>"))
$.e1=null
$.fz=null
$.fA=null
$.pR=!1
$.J=B.f
$.e0=0
$.dZ=A.C(t.N,t.S)
$.vV=A.C(t.N,A.ak("ad?"))
$.fB=A.b([],A.ak("p<O<q,n?(A)>>"))
$.pO=A.C(t.N,t.u)})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal,r=hunkHelpers.lazy
s($,"zx","tJ",()=>A.oD("_$dart_dartClosure"))
s($,"zw","qh",()=>A.oD("_$dart_dartClosure_dartJSInterop"))
s($,"Ab","u8",()=>B.f.ew(new A.oT(),A.ak("ab<~>")))
s($,"A0","u4",()=>A.b([new J.hb()],A.ak("p<eQ>")))
s($,"zF","tN",()=>A.bP(A.lp({
toString:function(){return"$receiver$"}})))
s($,"zG","tO",()=>A.bP(A.lp({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"zH","tP",()=>A.bP(A.lp(null)))
s($,"zI","tQ",()=>A.bP(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(q){return q.message}}()))
s($,"zL","tT",()=>A.bP(A.lp(void 0)))
s($,"zM","tU",()=>A.bP(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(q){return q.message}}()))
s($,"zK","tS",()=>A.bP(A.ry(null)))
s($,"zJ","tR",()=>A.bP(function(){try{null.$method$}catch(q){return q.message}}()))
s($,"zO","tW",()=>A.bP(A.ry(void 0)))
s($,"zN","tV",()=>A.bP(function(){try{(void 0).$method$}catch(q){return q.message}}()))
s($,"zP","qj",()=>A.wn())
s($,"zA","qi",()=>$.u8())
s($,"zz","tL",()=>{var q=new A.L(B.f,t.k)
q.hm(!1)
return q})
s($,"zT","u_",()=>A.vD(4096))
s($,"zR","tY",()=>new A.me().$0())
s($,"zS","tZ",()=>new A.md().$0())
s($,"zQ","tX",()=>A.hy("^[\\-\\.0-9A-Z_a-z~]*$"))
s($,"zW","iM",()=>A.oU(B.fc))
r($,"A_","fD",()=>new A.ob().$0())
r($,"zY","u3",()=>new A.mM().$0())
s($,"zy","tK",()=>A.vB(0))
s($,"A1","u5",()=>A.b([A.G(7,7,0),A.G(7,0,2),A.G(7,0,1),A.G(7,0,2),A.G(7,0,1),A.G(7,0,6),A.G(7,7,0),A.G(7,0,2),A.G(7,0,1),A.G(7,0,2),A.G(7,2,5),A.G(7,0,6),A.G(7,7,0),A.G(7,0,2),A.G(6,1,1),A.G(6,1,3),A.G(6,1,4),A.G(6,1,6),A.G(7,7,0),A.G(7,0,2),A.G(4,1,1),A.G(4,1,3),A.G(4,1,4),A.G(4,1,6),A.G(7,7,0),A.G(7,0,2),A.G(5,0,1),A.G(5,0,2),A.G(5,2,5),A.G(5,0,6),A.G(7,7,0),A.G(7,0,2),A.G(0,0,1),A.G(0,0,2),A.G(0,2,5),A.G(0,0,6),A.G(7,7,0),A.G(7,0,2),A.G(7,0,1),A.G(7,0,2),A.G(7,3,5),A.G(7,0,6)],t.t))
s($,"zZ","fC",()=>new A.n_().$0())
s($,"zV","u1",()=>B.a.aF(B.S,"Common"))
s($,"zX","u2",()=>B.a.aF(B.S,"Inherited"))
s($,"A2","qk",()=>new A.oh().$0())
s($,"Aa","ph",()=>A.cT(B.cF))
s($,"A9","pg",()=>A.cT(B.d6))
s($,"A4","qm",()=>A.cT(B.cZ))
s($,"A3","ql",()=>A.cT(B.d1))
s($,"A7","e8",()=>A.cT(B.cY))
s($,"Ac","u9",()=>A.cT(B.cC))
s($,"A6","u7",()=>A.cT(B.cy))
s($,"A5","u6",()=>A.cT(B.cx))
s($,"zU","u0",()=>{var q,p,o,n,m,l=t.S
l=A.C(l,l)
for(q=B.d7.gai().gt(0);q.n();){p=q.gp()
o=p.a
for(p=A.vX(p.b).gt(0),n=o.length;p.n();){m=p.d
if(0>=n)return A.a(o,0)
l.m(0,m,o.charCodeAt(0))}}return l})
s($,"zB","tM",()=>A.ts(0.6544984694978736))})();(function nativeSupport(){!function(){var s=function(a){var m={}
m[a]=1
return Object.keys(hunkHelpers.convertToFastObject(m))[0]}
v.getIsolateTag=function(a){return s("___dart_"+a+v.isolateTag)}
var r="___dart_isolate_tags_"
var q=Object[r]||(Object[r]=Object.create(null))
var p="_ZxYxX"
for(var o=0;;o++){var n=s(p+"_"+o+"_")
if(!(n in q)){q[n]=1
v.isolateTag=n
break}}v.dispatchPropertyName=v.getIsolateTag("dispatch_record")}()
hunkHelpers.setOrUpdateInterceptorsByTag({SharedArrayBuffer:A.ce,ArrayBuffer:A.dI,ArrayBufferView:A.eI,DataView:A.eH,Float32Array:A.cQ,Float64Array:A.cR,Int16Array:A.hn,Int32Array:A.cS,Int8Array:A.ho,Uint16Array:A.cU,Uint32Array:A.eJ,Uint8ClampedArray:A.eK,CanvasPixelArray:A.eK,Uint8Array:A.cg})
hunkHelpers.setOrUpdateLeafTags({SharedArrayBuffer:true,ArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.as.$nativeSuperclassTag="ArrayBufferView"
A.fd.$nativeSuperclassTag="ArrayBufferView"
A.fe.$nativeSuperclassTag="ArrayBufferView"
A.cf.$nativeSuperclassTag="ArrayBufferView"
A.ff.$nativeSuperclassTag="ArrayBufferView"
A.fg.$nativeSuperclassTag="ArrayBufferView"
A.aN.$nativeSuperclassTag="ArrayBufferView"})()
Function.prototype.$1=function(a){return this(a)}
Function.prototype.$2=function(a,b){return this(a,b)}
Function.prototype.$0=function(){return this()}
Function.prototype.$3=function(a,b,c){return this(a,b,c)}
Function.prototype.$4=function(a,b,c,d){return this(a,b,c,d)}
Function.prototype.$2$0=function(){return this()}
Function.prototype.$1$0=function(){return this()}
Function.prototype.$1$1=function(a){return this(a)}
Function.prototype.$8=function(a,b,c,d,e,f,g,h){return this(a,b,c,d,e,f,g,h)}
Function.prototype.$6=function(a,b,c,d,e,f){return this(a,b,c,d,e,f)}
Function.prototype.$5=function(a,b,c,d,e){return this(a,b,c,d,e)}
Function.prototype.$10=function(a,b,c,d,e,f,g,h,i,j){return this(a,b,c,d,e,f,g,h,i,j)}
convertAllToFastObject(w)
convertToFastObject($);(function(a){if(typeof document==="undefined"){a(null)
return}if(typeof document.currentScript!="undefined"){a(document.currentScript)
return}var s=document.scripts
function onLoad(b){for(var q=0;q<s.length;++q){s[q].removeEventListener("load",onLoad,false)}a(b.target)}for(var r=0;r<s.length;++r){s[r].addEventListener("load",onLoad,false)}})(function(a){v.currentScript=a
var s=A.z_
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()