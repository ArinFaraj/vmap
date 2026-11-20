// vmap web worker, built from lib 5f138415
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
if(a[b]!==s){A.yD(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.b(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.pv(b)
return new s(c,this)}:function(){if(s===null)s=A.pv(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.pv(a).prototype
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
pC(a,b,c,d){return{i:a,p:b,e:c,x:d}},
nZ(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.py==null){A.xS()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.f(A.qX("Return interceptor for "+A.u(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.le
if(o==null)o=$.le=A.nY(n)
p=q[o]}if(p!=null)return p
p=A.y2(a)
if(p!=null)return p
if(typeof a=="function")return B.bv
s=Object.getPrototypeOf(a)
if(s==null)return B.aR
if(s===Object.prototype)return B.aR
if(typeof q=="function"){o=$.le
if(o==null)o=$.le=A.nY(n)
Object.defineProperty(q,o,{value:B.as,enumerable:false,writable:true,configurable:true})
return B.as}return B.as},
qn(a,b){if(a<0||a>4294967295)throw A.f(A.aa(a,0,4294967295,"length",null))
return J.un(new Array(a),b)},
oW(a,b){if(a<0)throw A.f(A.aN("Length must be a non-negative integer: "+a,null))
return A.b(new Array(a),b.i("p<0>"))},
qm(a,b){if(a<0)throw A.f(A.aN("Length must be a non-negative integer: "+a,null))
return A.b(new Array(a),b.i("p<0>"))},
un(a,b){var s=A.b(a,b.i("p<0>"))
s.$flags=1
return s},
uo(a,b){var s=t.bP
return J.tB(s.a(a),s.a(b))},
qo(a){if(a<256)switch(a){case 9:case 10:case 11:case 12:case 13:case 32:case 133:case 160:return!0
default:return!1}switch(a){case 5760:case 8192:case 8193:case 8194:case 8195:case 8196:case 8197:case 8198:case 8199:case 8200:case 8201:case 8202:case 8232:case 8233:case 8239:case 8287:case 12288:case 65279:return!0
default:return!1}},
qp(a,b){var s,r
for(s=a.length;b<s;){r=a.charCodeAt(b)
if(r!==32&&r!==13&&!J.qo(r))break;++b}return b},
qq(a,b){var s,r,q
for(s=a.length;b>0;b=r){r=b-1
if(!(r<s))return A.a(a,r)
q=a.charCodeAt(r)
if(q!==32&&q!==13&&!J.qo(q))break}return b},
as(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.e6.prototype
return J.fK.prototype}if(typeof a=="string")return J.ce.prototype
if(a==null)return J.e7.prototype
if(typeof a=="boolean")return J.e5.prototype
if(Array.isArray(a))return J.p.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bG.prototype
if(typeof a=="symbol")return J.di.prototype
if(typeof a=="bigint")return J.dh.prototype
return a}if(a instanceof A.m)return a
return J.nZ(a)},
n(a){if(typeof a=="string")return J.ce.prototype
if(a==null)return a
if(Array.isArray(a))return J.p.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bG.prototype
if(typeof a=="symbol")return J.di.prototype
if(typeof a=="bigint")return J.dh.prototype
return a}if(a instanceof A.m)return a
return J.nZ(a)},
Q(a){if(a==null)return a
if(Array.isArray(a))return J.p.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bG.prototype
if(typeof a=="symbol")return J.di.prototype
if(typeof a=="bigint")return J.dh.prototype
return a}if(a instanceof A.m)return a
return J.nZ(a)},
xH(a){if(typeof a=="number")return J.cF.prototype
if(a==null)return a
if(!(a instanceof A.m))return J.co.prototype
return a},
xI(a){if(typeof a=="number")return J.cF.prototype
if(typeof a=="string")return J.ce.prototype
if(a==null)return a
if(!(a instanceof A.m))return J.co.prototype
return a},
xJ(a){if(typeof a=="string")return J.ce.prototype
if(a==null)return a
if(!(a instanceof A.m))return J.co.prototype
return a},
dL(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.bG.prototype
if(typeof a=="symbol")return J.di.prototype
if(typeof a=="bigint")return J.dh.prototype
return a}if(a instanceof A.m)return a
return J.nZ(a)},
l(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.as(a).D(a,b)},
R(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.xW(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.n(a).h(a,b)},
hW(a,b,c){return J.Q(a).m(a,b,c)},
fd(a,b){return J.Q(a).j(a,b)},
pN(a,b){return J.xJ(a).cu(a,b)},
oM(a,b){return J.Q(a).aj(a,b)},
tx(a,b,c){return J.dL(a).e3(a,b,c)},
oN(a,b,c){return J.dL(a).e4(a,b,c)},
ty(a,b,c){return J.dL(a).e5(a,b,c)},
tz(a,b,c){return J.dL(a).e6(a,b,c)},
tA(a,b,c){return J.dL(a).e7(a,b,c)},
bx(a,b){return J.Q(a).bH(a,b)},
tB(a,b){return J.xI(a).a6(a,b)},
pO(a,b){return J.n(a).u(a,b)},
dN(a,b){return J.Q(a).O(a,b)},
pP(a,b){return J.Q(a).a4(a,b)},
oO(a,b){return J.Q(a).Z(a,b)},
pQ(a){return J.dL(a).gaz(a)},
hX(a){return J.Q(a).gt(a)},
ao(a){return J.as(a).gS(a)},
d2(a){return J.n(a).gB(a)},
hY(a){return J.n(a).gJ(a)},
B(a){return J.Q(a).gp(a)},
oP(a){return J.Q(a).gE(a)},
S(a){return J.n(a).gk(a)},
tC(a){return J.dL(a).geo(a)},
pR(a){return J.as(a).gV(a)},
tD(a,b,c){return J.Q(a).bj(a,b,c)},
tE(a,b){return J.Q(a).ab(a,b)},
hZ(a,b,c){return J.Q(a).aJ(a,b,c)},
tF(a,b){return J.n(a).sk(a,b)},
tG(a,b,c,d,e){return J.Q(a).Y(a,b,c,d,e)},
d3(a,b){return J.Q(a).T(a,b)},
tH(a,b){return J.Q(a).W(a,b)},
i_(a,b){return J.Q(a).am(a,b)},
pS(a){return J.xH(a).N(a)},
pT(a){return J.Q(a).ey(a)},
pU(a){return J.Q(a).ez(a)},
bj(a){return J.as(a).q(a)},
pV(a,b){return J.Q(a).cQ(a,b)},
fH:function fH(){},
e5:function e5(){},
e7:function e7(){},
e8:function e8(){},
cf:function cf(){},
fX:function fX(){},
co:function co(){},
bG:function bG(){},
dh:function dh(){},
di:function di(){},
p:function p(a){this.$ti=a},
fJ:function fJ(){},
iT:function iT(a){this.$ti=a},
b6:function b6(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cF:function cF(){},
e6:function e6(){},
fK:function fK(){},
ce:function ce(){}},A={oX:function oX(){},
cz(a,b,c){if(t.P.b(a))return new A.eE(a,b.i("@<0>").G(c).i("eE<1,2>"))
return new A.cy(a,b.i("@<0>").G(c).i("cy<1,2>"))},
qt(a){return new A.dk("Field '"+a+"' has been assigned during initialization.")},
ur(a){return new A.dk("Field '"+a+"' has not been initialized.")},
uq(a){return new A.dk("Field '"+a+"' has already been initialized.")},
aL(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
h6(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
qR(a,b,c){return A.h6(A.aL(A.aL(c,a),b))},
bv(a,b,c){return a},
pA(a){var s,r
for(s=$.aY.length,r=0;r<s;++r)if(a===$.aY[r])return!0
return!1},
aU(a,b,c,d){A.ab(b,"start")
if(c!=null){A.ab(c,"end")
if(b>c)A.aF(A.aa(b,0,c,"start",null))}return new A.bM(a,b,c,d.i("bM<0>"))},
p1(a,b,c,d){if(t.P.b(a))return new A.dX(a,b,c.i("@<0>").G(d).i("dX<1,2>"))
return new A.cI(a,b,c.i("@<0>").G(d).i("cI<1,2>"))},
qS(a,b,c){var s="takeCount"
A.c6(b,s,t.S)
A.ab(b,s)
if(t.P.b(a))return new A.dY(a,b,c.i("dY<0>"))
return new A.cP(a,b,c.i("cP<0>"))},
qP(a,b,c){var s="count"
if(t.P.b(a)){A.c6(b,s,t.S)
A.ab(b,s)
return new A.dc(a,b,c.i("dc<0>"))}A.c6(b,s,t.S)
A.ab(b,s)
return new A.bL(a,b,c.i("bL<0>"))},
oT(a,b,c){return new A.cC(a,b,c.i("cC<0>"))},
ae(){return new A.cl("No element")},
ql(){return new A.cl("Too few elements")},
cp:function cp(){},
dS:function dS(a,b){this.a=a
this.$ti=b},
cy:function cy(a,b){this.a=a
this.$ti=b},
eE:function eE(a,b){this.a=a
this.$ti=b},
eB:function eB(){},
bz:function bz(a,b){this.a=a
this.$ti=b},
cA:function cA(a,b){this.a=a
this.$ti=b},
i6:function i6(a,b){this.a=a
this.b=b},
i5:function i5(a){this.a=a},
dk:function dk(a){this.a=a},
dU:function dU(a){this.a=a},
od:function od(){},
jU:function jU(){},
x:function x(){},
V:function V(){},
bM:function bM(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.$ti=d},
a1:function a1(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cI:function cI(a,b,c){this.a=a
this.b=b
this.$ti=c},
dX:function dX(a,b,c){this.a=a
this.b=b
this.$ti=c},
eb:function eb(a,b,c){var _=this
_.a=null
_.b=a
_.c=b
_.$ti=c},
aQ:function aQ(a,b,c){this.a=a
this.b=b
this.$ti=c},
aV:function aV(a,b,c){this.a=a
this.b=b
this.$ti=c},
ey:function ey(a,b,c){this.a=a
this.b=b
this.$ti=c},
cP:function cP(a,b,c){this.a=a
this.b=b
this.$ti=c},
dY:function dY(a,b,c){this.a=a
this.b=b
this.$ti=c},
es:function es(a,b,c){this.a=a
this.b=b
this.$ti=c},
bL:function bL(a,b,c){this.a=a
this.b=b
this.$ti=c},
dc:function dc(a,b,c){this.a=a
this.b=b
this.$ti=c},
ep:function ep(a,b,c){this.a=a
this.b=b
this.$ti=c},
dZ:function dZ(a){this.$ti=a},
e_:function e_(a){this.$ti=a},
bS:function bS(a,b){this.a=a
this.$ti=b},
cQ:function cQ(a,b){this.a=a
this.$ti=b},
bF:function bF(a,b,c){this.a=a
this.b=b
this.$ti=c},
cC:function cC(a,b,c){this.a=a
this.b=b
this.$ti=c},
ba:function ba(a,b,c){var _=this
_.a=a
_.b=b
_.c=-1
_.$ti=c},
a2:function a2(){},
bR:function bR(){},
du:function du(){},
aK:function aK(a,b){this.a=a
this.$ti=b},
f2:function f2(){},
tS(){throw A.f(A.aC("Cannot modify unmodifiable Map"))},
tT(){throw A.f(A.aC("Cannot modify constant Set"))},
ta(a){var s=A.t9(a)
if(s!=null)return s
return"minified:"+a},
xW(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.dX.b(a)},
u(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.bj(a)
return s},
dr(a){var s,r=$.qF
if(r==null)r=$.qF=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
uT(a,b){var s,r,q,p,o,n=null,m=/^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i.exec(a)
if(m==null)return n
if(3>=m.length)return A.a(m,3)
s=m[3]
if(b<2||b>36)throw A.f(A.aa(b,2,36,"radix",n))
if(b===10&&s!=null)return parseInt(a,10)
if(b<10||s==null){r=b<=10?47+b:86+b
q=m[1]
for(p=q.length,o=0;o<p;++o)if((q.charCodeAt(o)|32)>r)return n}return parseInt(a,b)},
L(a){var s,r
if(!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(a))return null
s=parseFloat(a)
if(isNaN(s)){r=B.d.bi(a)
if(r==="NaN"||r==="+NaN"||r==="-NaN")return s
return null}return s},
fY(a){var s,r,q,p
if(a instanceof A.m)return A.aX(A.a7(a),null)
s=J.as(a)
if(s===B.bu||s===B.bw||t.cx.b(a)){r=B.ay(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.aX(A.a7(a),null)},
qG(a){var s,r,q
if(a==null||typeof a=="number"||A.E(a))return J.bj(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.c9)return a.q(0)
if(a instanceof A.ay)return a.dW(!0)
s=$.tv()
for(r=0;r<1;++r){q=s[r].iY(a)
if(q!=null)return q}return"Instance of '"+A.fY(a)+"'"},
qE(a){var s,r,q,p,o=a.length
if(o<=500)return String.fromCharCode.apply(null,a)
for(s="",r=0;r<o;r=q){q=r+500
p=q<o?q:o
s+=String.fromCharCode.apply(null,a.slice(r,p))}return s},
uU(a){var s,r,q,p=A.b([],t.X)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.i)(a),++r){q=a[r]
if(!A.dG(q))throw A.f(A.c2(q))
if(q<=65535)B.a.j(p,q)
else if(q<=1114111){B.a.j(p,55296+(B.b.I(q-65536,10)&1023))
B.a.j(p,56320+(q&1023))}else throw A.f(A.c2(q))}return A.qE(p)},
qH(a){var s,r,q
for(s=a.length,r=0;r<s;++r){q=a[r]
if(!A.dG(q))throw A.f(A.c2(q))
if(q<0)throw A.f(A.c2(q))
if(q>65535)return A.uU(a)}return A.qE(a)},
uV(a,b,c){var s,r,q,p
if(c<=500&&b===0&&c===a.length)return String.fromCharCode.apply(null,a)
for(s=b,r="";s<c;s=q){q=s+500
p=q<c?q:c
r+=String.fromCharCode.apply(null,a.subarray(s,p))}return r},
O(a){var s
if(0<=a){if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.b.I(s,10)|55296)>>>0,s&1023|56320)}}throw A.f(A.aa(a,0,1114111,null,null))},
uS(a){var s=a.$thrownJsError
if(s==null)return null
return A.c5(s)},
qI(a,b){var s
if(a.$thrownJsError==null){s=new Error()
A.ad(a,s)
a.$thrownJsError=s
s.stack=b.q(0)}},
a6(a){throw A.f(A.c2(a))},
a(a,b){if(a==null)J.S(a)
throw A.f(A.nQ(a,b))},
nQ(a,b){var s,r="index"
if(!A.dG(b))return new A.b5(!0,b,r,null)
s=A.v(J.S(a))
if(b<0||b>=s)return A.iO(b,s,a,r)
return A.qJ(b,r)},
xx(a,b,c){if(a<0||a>c)return A.aa(a,0,c,"start",null)
if(b!=null)if(b<a||b>c)return A.aa(b,a,c,"end",null)
return new A.b5(!0,b,"end",null)},
c2(a){return new A.b5(!0,a,null,null)},
xj(a){return a},
f(a){return A.ad(a,new Error())},
ad(a,b){var s
if(a==null)a=new A.bO()
b.dartException=a
s=A.yG
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
yG(){return J.bj(this.dartException)},
aF(a,b){throw A.ad(a,b==null?new Error():b)},
r(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.aF(A.w2(a,b,c),s)},
w2(a,b,c){var s,r,q,p,o,n,m,l,k
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
return new A.ev("'"+s+"': Cannot "+o+" "+l+k+n)},
i(a){throw A.f(A.a0(a))},
bP(a){var s,r,q,p,o,n
a=A.t2(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.b([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.kB(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
kC(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
qV(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
oY(a,b){var s=b==null,r=s?null:b.method
return new A.fL(a,r,s?null:b.receiver)},
aG(a){var s
if(a==null)return new A.ju(a)
if(a instanceof A.e0){s=a.a
return A.cw(a,s==null?A.cu(s):s)}if(typeof a!=="object")return a
if("dartException" in a)return A.cw(a,a.dartException)
return A.x7(a)},
cw(a,b){if(t.C.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
x7(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.b.I(r,16)&8191)===10)switch(q){case 438:return A.cw(a,A.oY(A.u(s)+" (Error "+q+")",null))
case 445:case 5007:A.u(s)
return A.cw(a,new A.ej())}}if(a instanceof TypeError){p=$.tf()
o=$.tg()
n=$.th()
m=$.ti()
l=$.tl()
k=$.tm()
j=$.tk()
$.tj()
i=$.to()
h=$.tn()
g=p.al(s)
if(g!=null)return A.cw(a,A.oY(A.P(s),g))
else{g=o.al(s)
if(g!=null){g.method="call"
return A.cw(a,A.oY(A.P(s),g))}else if(n.al(s)!=null||m.al(s)!=null||l.al(s)!=null||k.al(s)!=null||j.al(s)!=null||m.al(s)!=null||i.al(s)!=null||h.al(s)!=null){A.P(s)
return A.cw(a,new A.ej())}}return A.cw(a,new A.hg(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.eq()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.cw(a,new A.b5(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.eq()
return a},
c5(a){var s
if(a instanceof A.e0)return a.b
if(a==null)return new A.eT(a)
s=a.$cachedTrace
if(s!=null)return s
s=new A.eT(a)
if(typeof a==="object")a.$cachedTrace=s
return s},
oe(a){if(a==null)return J.ao(a)
if(typeof a=="object")return A.dr(a)
return J.ao(a)},
xo(a){if(typeof a=="number")return B.c.gS(a)
if(a instanceof A.hM)return A.dr(a)
if(a instanceof A.ay)return a.gS(a)
return A.oe(a)},
rS(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.m(0,a[s],a[r])}return b},
wk(a,b,c,d,e,f){t.gY.a(a)
switch(A.v(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.f(new A.l2("Unsupported number of arguments for wrapped closure"))},
dK(a,b){var s=a.$identity
if(!!s)return s
s=A.xp(a,b)
a.$identity=s
return s},
xp(a,b){var s
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
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.wk)},
tR(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.h1().constructor.prototype):Object.create(new A.d4(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.q4(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.tN(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.q4(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
tN(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.f("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.tL)}throw A.f("Error in functionType of tearoff")},
tO(a,b,c,d){var s=A.q_
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
q4(a,b,c,d){if(c)return A.tQ(a,b,d)
return A.tO(b.length,d,a,b)},
tP(a,b,c,d){var s=A.q_,r=A.tM
switch(b?-1:a){case 0:throw A.f(new A.h_("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
tQ(a,b,c){var s,r
if($.pY==null)$.pY=A.pX("interceptor")
if($.pZ==null)$.pZ=A.pX("receiver")
s=b.length
r=A.tP(s,c,a,b)
return r},
pv(a){return A.tR(a)},
tL(a,b){return A.f0(v.typeUniverse,A.a7(a.a),b)},
q_(a){return a.a},
tM(a){return a.b},
pX(a){var s,r,q,p=new A.d4("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.f(A.aN("Field name "+a+" not found.",null))},
nY(a){return v.getIsolateTag(a)},
z9(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
y2(a){var s,r,q,p,o,n=A.P($.rU.$1(a)),m=$.nR[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.o4[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.dF($.rJ.$2(a,n))
if(q!=null){m=$.nR[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.o4[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.ob(s)
$.nR[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.o4[n]=s
return s}if(p==="-"){o=A.ob(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.t0(a,s)
if(p==="*")throw A.f(A.qX(n))
if(v.leafTags[n]===true){o=A.ob(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.t0(a,s)},
t0(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.pC(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
ob(a){return J.pC(a,!1,null,!!a.$iaP)},
y4(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.ob(s)
else return J.pC(s,c,null,null)},
xS(){if(!0===$.py)return
$.py=!0
A.xT()},
xT(){var s,r,q,p,o,n,m,l
$.nR=Object.create(null)
$.o4=Object.create(null)
A.xR()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.t1.$1(o)
if(n!=null){m=A.y4(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
xR(){var s,r,q,p,o,n,m=B.aW()
m=A.dJ(B.aX,A.dJ(B.aY,A.dJ(B.az,A.dJ(B.az,A.dJ(B.aZ,A.dJ(B.b_,A.dJ(B.b0(B.ay),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.rU=new A.o1(p)
$.rJ=new A.o2(o)
$.t1=new A.o3(n)},
dJ(a,b){return a(b)||b},
vx(a,b){var s,r
for(s=0;s<a.length;++s){r=a[s]
if(!(s<b.length))return A.a(b,s)
if(!J.l(r,b[s]))return!1}return!0},
xs(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
qr(a,b,c,d,e,f){var s=b?"m":"",r=c?"":"i",q=d?"u":"",p=e?"s":"",o=function(g,h){try{return new RegExp(g,h)}catch(n){return n}}(a,s+r+q+p+f)
if(o instanceof RegExp)return o
throw A.f(A.de("Illegal RegExp pattern ("+String(o)+")",a,null))},
yx(a,b,c){var s
if(typeof b=="string")return a.indexOf(b,c)>=0
else if(b instanceof A.dg){s=B.d.ao(a,c)
return b.b.test(s)}else return!J.pN(b,B.d.ao(a,c)).gB(0)},
xz(a){if(a.indexOf("$",0)>=0)return a.replace(/\$/g,"$$$$")
return a},
t2(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
pG(a,b,c){var s=A.yy(a,b,c)
return s},
yy(a,b,c){var s,r,q
if(b===""){if(a==="")return c
s=a.length
for(r=c,q=0;q<s;++q)r=r+a[q]+c
return r.charCodeAt(0)==0?r:r}if(a.indexOf(b,0)<0)return a
if(a.length<500||c.indexOf("$",0)>=0)return a.split(b).join(c)
return a.replace(new RegExp(A.t2(b),"g"),A.xz(c))},
os(a,b,c,d){var s=a.indexOf(b,d)
if(s<0)return a
return A.yz(a,s,s+b.length,c)},
yz(a,b,c,d){return a.substring(0,b)+d+a.substring(c)},
e:function e(a,b){this.a=a
this.b=b},
M:function M(a,b,c){this.a=a
this.b=b
this.c=c},
eO:function eO(a,b,c){this.a=a
this.b=b
this.c=c},
dD:function dD(a,b,c){this.a=a
this.b=b
this.c=c},
eP:function eP(a,b,c){this.a=a
this.b=b
this.c=c},
bu:function bu(a){this.a=a},
eQ:function eQ(a){this.a=a},
eR:function eR(a){this.a=a},
d9:function d9(){},
ap:function ap(a,b,c){this.a=a
this.b=b
this.$ti=c},
cX:function cX(a,b){this.a=a
this.$ti=b},
bW:function bW(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cc:function cc(a,b){this.a=a
this.$ti=b},
da:function da(){},
bk:function bk(a,b,c){this.a=a
this.b=b
this.$ti=c},
df:function df(a,b){this.a=a
this.$ti=b},
en:function en(){},
kB:function kB(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
ej:function ej(){},
fL:function fL(a,b,c){this.a=a
this.b=b
this.c=c},
hg:function hg(a){this.a=a},
ju:function ju(a){this.a=a},
e0:function e0(a,b){this.a=a
this.b=b},
eT:function eT(a){this.a=a
this.b=null},
c9:function c9(){},
fk:function fk(){},
fl:function fl(){},
h7:function h7(){},
h1:function h1(){},
d4:function d4(a,b){this.a=a
this.b=b},
h_:function h_(a){this.a=a},
bb:function bb(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
iU:function iU(a){this.a=a},
j3:function j3(a,b){var _=this
_.a=a
_.b=b
_.d=_.c=null},
aH:function aH(a,b){this.a=a
this.$ti=b},
ea:function ea(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bc:function bc(a,b){this.a=a
this.$ti=b},
bI:function bI(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bH:function bH(a,b){this.a=a
this.$ti=b},
e9:function e9(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
cG:function cG(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
o1:function o1(a){this.a=a},
o2:function o2(a){this.a=a},
o3:function o3(a){this.a=a},
ay:function ay(){},
dC:function dC(){},
bZ:function bZ(){},
cq:function cq(){},
dg:function dg(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
hB:function hB(a){this.b=a},
hl:function hl(a,b,c){this.a=a
this.b=b
this.c=c},
ez:function ez(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
er:function er(a,b){this.a=a
this.c=b},
hI:function hI(a,b,c){this.a=a
this.b=b
this.c=c},
hJ:function hJ(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
c1(a,b,c){},
N(a){return a},
uE(a,b,c){A.c1(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
uF(a,b,c){A.c1(a,b,c)
if(c==null)c=B.b.C(a.byteLength-b,4)
return new Float32Array(a,b,c)},
uG(a,b,c){A.c1(a,b,c)
if(c==null)c=B.b.C(a.byteLength-b,8)
return new Float64Array(a,b,c)},
uH(a,b,c){A.c1(a,b,c)
if(c==null)c=B.b.C(a.byteLength-b,2)
return new Uint16Array(a,b,c)},
uI(a){return new Uint8Array(a)},
p2(a,b,c){A.c1(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
c0(a,b,c){if(a>>>0!==a||a>=c)throw A.f(A.nQ(b,a))},
bi(a,b,c){var s
if(!(a>>>0!==a))if(b==null)s=a>c
else s=b>>>0!==b||a>b||b>c
else s=!0
if(s)throw A.f(A.xx(a,b,c))
if(b==null)return c
return b},
cg:function cg(){},
dq:function dq(){},
eg:function eg(){},
lB:function lB(a){this.a=a},
fP:function fP(){},
av:function av(){},
ch:function ch(){},
aR:function aR(){},
cK:function cK(){},
cL:function cL(){},
fQ:function fQ(){},
cM:function cM(){},
fR:function fR(){},
cN:function cN(){},
eh:function eh(){},
ei:function ei(){},
ci:function ci(){},
eJ:function eJ(){},
eK:function eK(){},
eL:function eL(){},
eM:function eM(){},
p4(a,b){var s=b.c
return s==null?b.c=A.eZ(a,"Z",[b.x]):s},
qN(a){var s=a.w
if(s===6||s===7)return A.qN(a.x)
return s===11||s===12},
v_(a){return a.as},
pE(a,b){var s,r=b.length
for(s=0;s<r;++s)if(!a[s].b(b[s]))return!1
return!0},
an(a){return A.lA(v.typeUniverse,a,!1)},
d0(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.d0(a1,s,a3,a4)
if(r===s)return a2
return A.rc(a1,r,!0)
case 7:s=a2.x
r=A.d0(a1,s,a3,a4)
if(r===s)return a2
return A.rb(a1,r,!0)
case 8:q=a2.y
p=A.dI(a1,q,a3,a4)
if(p===q)return a2
return A.eZ(a1,a2.x,p)
case 9:o=a2.x
n=A.d0(a1,o,a3,a4)
m=a2.y
l=A.dI(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.pa(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.dI(a1,j,a3,a4)
if(i===j)return a2
return A.rd(a1,k,i)
case 11:h=a2.x
g=A.d0(a1,h,a3,a4)
f=a2.y
e=A.x3(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.ra(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.dI(a1,d,a3,a4)
o=a2.x
n=A.d0(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.pb(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.f(A.ff("Attempted to substitute unexpected RTI kind "+a0))}},
dI(a,b,c,d){var s,r,q,p,o=b.length,n=A.lF(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.d0(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
x4(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.lF(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.d0(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
x3(a,b,c,d){var s,r=b.a,q=A.dI(a,r,c,d),p=b.b,o=A.dI(a,p,c,d),n=b.c,m=A.x4(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.hv()
s.a=q
s.b=o
s.c=m
return s},
b(a,b){a[v.arrayRti]=b
return a},
pw(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.xM(s)
return a.$S()}return null},
xU(a,b){var s
if(A.qN(b))if(a instanceof A.c9){s=A.pw(a)
if(s!=null)return s}return A.a7(a)},
a7(a){if(a instanceof A.m)return A.q(a)
if(Array.isArray(a))return A.D(a)
return A.pd(J.as(a))},
D(a){var s=a[v.arrayRti],r=t.dG
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
q(a){var s=a.$ti
return s!=null?s:A.pd(a)},
pd(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.wg(a,s)},
wg(a,b){var s=a instanceof A.c9?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.vH(v.typeUniverse,s.name)
b.$ccache=r
return r},
xM(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.lA(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
xK(a){return A.bw(A.q(a))},
pr(a){var s
if(a instanceof A.ay)return a.di()
s=a instanceof A.c9?A.pw(a):null
if(s!=null)return s
if(t.aJ.b(a))return J.pR(a).a
if(Array.isArray(a))return A.D(a)
return A.a7(a)},
bw(a){var s=a.r
return s==null?a.r=new A.hM(a):s},
xA(a,b){var s,r,q=b,p=q.length
if(p===0)return t.aK
if(0>=p)return A.a(q,0)
s=A.f0(v.typeUniverse,A.pr(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.a(q,r)
s=A.rf(v.typeUniverse,s,A.pr(q[r]))}return A.f0(v.typeUniverse,s,a)},
b4(a){return A.bw(A.lA(v.typeUniverse,a,!1))},
wf(a){var s=this
s.b=A.wZ(s)
return s.b(a)},
wZ(a){var s,r,q,p,o
if(a===t.K)return A.wr
if(A.d1(a))return A.wv
s=a.w
if(s===6)return A.w9
if(s===1)return A.rw
if(s===7)return A.wm
r=A.wY(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.d1)){a.f="$i"+q
if(q==="k")return A.wp
if(a===t.m)return A.wo
return A.wu}}else if(s===10){p=A.xs(a.x,a.y)
o=p==null?A.rw:p
return o==null?A.cu(o):o}return A.w7},
wY(a){if(a.w===8){if(a===t.S)return A.dG
if(a===t.i||a===t.cZ)return A.wq
if(a===t.N)return A.wt
if(a===t.y)return A.E}return null},
we(a){var s=this,r=A.w6
if(A.d1(s))r=A.vS
else if(s===t.K)r=A.cu
else if(A.dM(s)){r=A.w8
if(s===t.aV)r=A.vQ
else if(s===t.bl)r=A.dF
else if(s===t.fU)r=A.vO
else if(s===t.jh)r=A.f3
else if(s===t.jX)r=A.vP
else if(s===t.mU)r=A.vR}else if(s===t.S)r=A.v
else if(s===t.N)r=A.P
else if(s===t.y)r=A.lG
else if(s===t.cZ)r=A.ac
else if(s===t.i)r=A.ct
else if(s===t.m)r=A.aD
s.a=r
return s.a(a)},
w7(a){var s=this
if(a==null)return A.dM(s)
return A.xY(v.typeUniverse,A.xU(a,s),s)},
w9(a){if(a==null)return!0
return this.x.b(a)},
wu(a){var s,r=this
if(a==null)return A.dM(r)
s=r.f
if(a instanceof A.m)return!!a[s]
return!!J.as(a)[s]},
wp(a){var s,r=this
if(a==null)return A.dM(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.m)return!!a[s]
return!!J.as(a)[s]},
wo(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.m)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
rv(a){if(typeof a=="object"){if(a instanceof A.m)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
w6(a){var s=this
if(a==null){if(A.dM(s))return a}else if(s.b(a))return a
throw A.ad(A.rr(a,s),new Error())},
w8(a){var s=this
if(a==null||s.b(a))return a
throw A.ad(A.rr(a,s),new Error())},
rr(a,b){return new A.eX("TypeError: "+A.r0(a,A.aX(b,null)))},
r0(a,b){return A.fv(a)+": type '"+A.aX(A.pr(a),null)+"' is not a subtype of type '"+b+"'"},
b2(a,b){return new A.eX("TypeError: "+A.r0(a,b))},
wm(a){var s=this
return s.x.b(a)||A.p4(v.typeUniverse,s).b(a)},
wr(a){return a!=null},
cu(a){if(a!=null)return a
throw A.ad(A.b2(a,"Object"),new Error())},
wv(a){return!0},
vS(a){return a},
rw(a){return!1},
E(a){return!0===a||!1===a},
lG(a){if(!0===a)return!0
if(!1===a)return!1
throw A.ad(A.b2(a,"bool"),new Error())},
vO(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.ad(A.b2(a,"bool?"),new Error())},
ct(a){if(typeof a=="number")return a
throw A.ad(A.b2(a,"double"),new Error())},
vP(a){if(typeof a=="number")return a
if(a==null)return a
throw A.ad(A.b2(a,"double?"),new Error())},
dG(a){return typeof a=="number"&&Math.floor(a)===a},
v(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.ad(A.b2(a,"int"),new Error())},
vQ(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.ad(A.b2(a,"int?"),new Error())},
wq(a){return typeof a=="number"},
ac(a){if(typeof a=="number")return a
throw A.ad(A.b2(a,"num"),new Error())},
f3(a){if(typeof a=="number")return a
if(a==null)return a
throw A.ad(A.b2(a,"num?"),new Error())},
wt(a){return typeof a=="string"},
P(a){if(typeof a=="string")return a
throw A.ad(A.b2(a,"String"),new Error())},
dF(a){if(typeof a=="string")return a
if(a==null)return a
throw A.ad(A.b2(a,"String?"),new Error())},
aD(a){if(A.rv(a))return a
throw A.ad(A.b2(a,"JSObject"),new Error())},
vR(a){if(a==null)return a
if(A.rv(a))return a
throw A.ad(A.b2(a,"JSObject?"),new Error())},
rD(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.aX(a[q],b)
return s},
wP(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.rD(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.aX(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
rt(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
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
if(!(j===2||j===3||j===4||j===5||k===p))o+=" extends "+A.aX(k,a4)}o+=">"}else o=""
p=a3.x
i=a3.y
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.aX(p,a4)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.aX(h[q],a4)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.aX(f[q],a4)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.aX(d[q+2],a4)+" "+d[q]}a+="}"}if(a2!=null){a4.toString
a4.length=a2}return o+"("+a+") => "+b},
aX(a,b){var s,r,q,p,o,n,m,l=a.w
if(l===5)return"erased"
if(l===2)return"dynamic"
if(l===3)return"void"
if(l===1)return"Never"
if(l===4)return"any"
if(l===6){s=a.x
r=A.aX(s,b)
q=s.w
return(q===11||q===12?"("+r+")":r)+"?"}if(l===7)return"FutureOr<"+A.aX(a.x,b)+">"
if(l===8){p=A.x6(a.x)
o=a.y
return o.length>0?p+("<"+A.rD(o,b)+">"):p}if(l===10)return A.wP(a,b)
if(l===11)return A.rt(a,b,null)
if(l===12)return A.rt(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.a(b,n)
return b[n]}return"?"},
x6(a){var s=A.t9(a)
if(s!=null)return s
return"minified:"+a},
vI(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
vH(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.lA(a,b,!1)
else if(typeof m=="number"){s=m
r=A.f_(a,5,"#")
q=A.lF(s)
for(p=0;p<s;++p)q[p]=r
o=A.eZ(a,b,q)
n[b]=o
return o}else return m},
vG(a,b){return A.rh(a.tR,b)},
vF(a,b){return A.rh(a.eT,b)},
lA(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.re(a,null,b,!1)
r.set(b,s)
return s},
f0(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.re(a,b,c,!0)
q.set(c,r)
return r},
rf(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.pa(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
re(a,b,c,d){return A.vu(A.vo(a,b,c,d))},
cs(a,b){b.a=A.we
b.b=A.wf
return b},
f_(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.be(null,null)
s.w=b
s.as=c
r=A.cs(a,s)
a.eC.set(c,r)
return r},
rc(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.vD(a,b,r,c)
a.eC.set(r,s)
return s},
vD(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.d1(b))if(!(b===t.a||b===t.T))if(s!==6)r=s===7&&A.dM(b.x)
if(r)return b
else if(s===1)return t.a}q=new A.be(null,null)
q.w=6
q.x=b
q.as=c
return A.cs(a,q)},
rb(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.vB(a,b,r,c)
a.eC.set(r,s)
return s},
vB(a,b,c,d){var s,r
if(d){s=b.w
if(A.d1(b)||b===t.K)return b
else if(s===1)return A.eZ(a,"Z",[b])
else if(b===t.a||b===t.T)return t.gK}r=new A.be(null,null)
r.w=7
r.x=b
r.as=c
return A.cs(a,r)},
vE(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.be(null,null)
s.w=13
s.x=b
s.as=q
r=A.cs(a,s)
a.eC.set(q,r)
return r},
eY(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
vA(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
eZ(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.eY(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.be(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.cs(a,r)
a.eC.set(p,q)
return q},
pa(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.eY(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.be(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.cs(a,o)
a.eC.set(q,n)
return n},
rd(a,b,c){var s,r,q="+"+(b+"("+A.eY(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.be(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.cs(a,s)
a.eC.set(q,r)
return r},
ra(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.eY(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.eY(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.vA(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.be(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.cs(a,p)
a.eC.set(r,o)
return o},
pb(a,b,c,d){var s,r=b.as+("<"+A.eY(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.vC(a,b,c,r,d)
a.eC.set(r,s)
return s},
vC(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.lF(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.d0(a,b,r,0)
m=A.dI(a,c,r,0)
return A.pb(a,n,m,c!==m)}}l=new A.be(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.cs(a,l)},
vo(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
vu(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.vq(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.r4(a,r,l,k,!1)
else if(q===46)r=A.r4(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.cZ(a.u,a.e,k.pop()))
break
case 94:k.push(A.vE(a.u,k.pop()))
break
case 35:k.push(A.f_(a.u,5,"#"))
break
case 64:k.push(A.f_(a.u,2,"@"))
break
case 126:k.push(A.f_(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.vs(a,k)
break
case 38:A.vr(a,k)
break
case 63:p=a.u
k.push(A.rc(p,A.cZ(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.rb(p,A.cZ(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.vp(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.r5(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.vv(a.u,a.e,o)
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
return A.cZ(a.u,a.e,m)},
vq(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
r4(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.vI(s,o.x)[p]
if(n==null)A.aF('No "'+p+'" in "'+A.v_(o)+'"')
d.push(A.f0(s,o,n))}else d.push(p)
return m},
vs(a,b){var s,r=a.u,q=A.r3(a,b),p=b.pop()
if(typeof p=="string")b.push(A.eZ(r,p,q))
else{s=A.cZ(r,a.e,p)
switch(s.w){case 11:b.push(A.pb(r,s,q,a.n))
break
default:b.push(A.pa(r,s,q))
break}}},
vp(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.r3(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.cZ(p,a.e,o)
q=new A.hv()
q.a=s
q.b=n
q.c=m
b.push(A.ra(p,r,q))
return
case-4:b.push(A.rd(p,b.pop(),s))
return
default:throw A.f(A.ff("Unexpected state under `()`: "+A.u(o)))}},
vr(a,b){var s=b.pop()
if(0===s){b.push(A.f_(a.u,1,"0&"))
return}if(1===s){b.push(A.f_(a.u,4,"1&"))
return}throw A.f(A.ff("Unexpected extended operation "+A.u(s)))},
r3(a,b){var s=b.splice(a.p)
A.r5(a.u,a.e,s)
a.p=b.pop()
return s},
cZ(a,b,c){if(typeof c=="string")return A.eZ(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.vt(a,b,c)}else return c},
r5(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.cZ(a,b,c[s])},
vv(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.cZ(a,b,c[s])},
vt(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.f(A.ff("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.f(A.ff("Bad index "+c+" for "+b.q(0)))},
xY(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.am(a,b,null,c,null)
r.set(c,s)}return s},
am(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.d1(d))return!0
s=b.w
if(s===4)return!0
if(A.d1(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.am(a,c[b.x],c,d,e))return!0
q=d.w
p=t.a
if(b===p||b===t.T){if(q===7)return A.am(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.am(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.am(a,b.x,c,d,e))return!1
return A.am(a,A.p4(a,b),c,d,e)}if(s===6)return A.am(a,p,c,d,e)&&A.am(a,b.x,c,d,e)
if(q===7){if(A.am(a,b,c,d.x,e))return!0
return A.am(a,b,c,A.p4(a,d),e)}if(q===6)return A.am(a,b,c,p,e)||A.am(a,b,c,d.x,e)
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
if(!A.am(a,j,c,i,e)||!A.am(a,i,e,j,c))return!1}return A.ru(a,b.x,c,d.x,e)}if(q===11){if(b===t.et)return!0
if(p)return!1
return A.ru(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.wn(a,b,c,d,e)}if(o&&q===10)return A.ws(a,b,c,d,e)
return!1},
ru(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.am(a3,a4.x,a5,a6.x,a7))return!1
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
if(!A.am(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.am(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.am(a3,k[h],a7,g,a5))return!1}f=s.c
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
if(!A.am(a3,e[a+2],a7,g,a5))return!1
break}}while(b<d){if(f[b+1])return!1
b+=3}return!0},
wn(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.f0(a,b,r[o])
return A.ri(a,p,null,c,d.y,e)}return A.ri(a,b.y,null,c,d.y,e)},
ri(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.am(a,b[s],d,e[s],f))return!1
return!0},
ws(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.am(a,r[s],c,q[s],e))return!1
return!0},
dM(a){var s=a.w,r=!0
if(!(a===t.a||a===t.T))if(!A.d1(a))if(s!==6)r=s===7&&A.dM(a.x)
return r},
d1(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.O},
rh(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
lF(a){return a>0?new Array(a):v.typeUniverse.sEA},
be:function be(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
hv:function hv(){this.c=this.b=this.a=null},
hM:function hM(a){this.a=a},
hr:function hr(){},
eX:function eX(a){this.a=a},
vc(){var s,r,q
if(self.scheduleImmediate!=null)return A.xc()
if(self.MutationObserver!=null&&self.document!=null){s={}
r=self.document.createElement("div")
q=self.document.createElement("span")
s.a=null
new self.MutationObserver(A.dK(new A.kW(s),1)).observe(r,{childList:true})
return new A.kV(s,r,q)}else if(self.setImmediate!=null)return A.xd()
return A.xe()},
vd(a){self.scheduleImmediate(A.dK(new A.kX(t.M.a(a)),0))},
ve(a){self.setImmediate(A.dK(new A.kY(t.M.a(a)),0))},
vf(a){A.qU(B.b9,t.M.a(a))},
qU(a,b){return A.vz(a.a/1000|0,b)},
vz(a,b){var s=new A.ly()
s.eX(a,b)
return s},
aj(a){return new A.eA(new A.H($.G,a.i("H<0>")),a.i("eA<0>"))},
ai(a,b){a.$2(0,null)
b.b=!0
return b.a},
I(a,b){A.vT(a,b)},
ah(a,b){b.bd(a)},
ag(a,b){b.cw(A.aG(a),A.c5(a))},
vT(a,b){var s,r,q=new A.lH(b),p=new A.lI(b)
if(a instanceof A.H)a.dV(q,p,t.z)
else{s=t.z
if(a instanceof A.H)a.bh(q,p,s)
else{r=new A.H($.G,t._)
r.a=8
r.c=a
r.dV(q,p,s)}}},
ak(a){var s=function(b,c){return function(d,e){while(true){try{b(d,e)
break}catch(q){e=q
d=c}}}}(a,1),r=$.G
return r.ci(r,t.lD.a(new A.mq(s)),t.H,t.S,t.z)},
r9(a,b,c){return 0},
i1(a){var s
if(t.C.b(a)){s=a.gb_()
if(s!=null)return s}return B.a0},
ud(a,b){var s
if(!b.b(null))throw A.f(A.i0(null,"computation","The type parameter is not nullable"))
s=new A.H($.G,b.i("H<0>"))
A.qT(a,new A.io(null,s,b))
return s},
wh(a,b){var s=$.G
if(s===B.l)return null
s.fv(s,a,b)
return null},
wi(a,b){if($.G!==B.l)A.wh(a,b)
if(b==null)if(t.C.b(a)){b=a.gb_()
if(b==null){A.qI(a,B.a0)
b=B.a0}}else b=B.a0
else if(t.C.b(a))A.qI(a,b)
return new A.aB(a,b)},
p7(a,b,c){var s,r,q,p,o,n={},m=n.a=a
for(s=t._;r=m.a,(r&4)!==0;m=a){a=s.a(m.c)
n.a=a}if(m===b){s=A.v2()
b.b1(new A.aB(new A.b5(!0,m,null,"Cannot complete a future with itself"),s))
return}q=b.a&1
s=m.a=r|q
if((s&24)===0){p=t.F.a(b.c)
b.a=b.a&1|4
b.c=m
m.dH(p)
return}if(!c)if(b.c==null)m=(s&16)===0||q!==0
else m=!1
else m=!0
if(m){p=b.b6()
b.bs(n.a)
A.cW(b,p)
return}b.a^=2
o=b.b
o.b8(o,new A.l6(n,b))},
cW(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e={},d=e.a=a
for(s=t.v,r=t.F;;){q={}
p=d.a
o=(p&16)===0
n=!o
if(b==null){if(n&&(p&1)===0){m=s.a(d.c)
d=d.b
d.b3(d,m.a,m.b)}return}q.a=b
l=b.a
for(d=b;l!=null;d=l,l=k){d.a=null
A.cW(e.a,d)
q.a=l
k=l.a}j=e.a.c
q.b=n
q.c=j
if(o){p=d.c
p=(p&1)!==0||(p&15)===8}else p=!0
if(p){i=d.b.b
h=$.G
if(h!==i)$.G=i
else h=null
d=d.c
if((d&15)===8)new A.la(q,e,n).$0()
else if(o){if((d&1)!==0)new A.l9(q,j).$0()}else if((d&2)!==0)new A.l8(e,q).$0()
if(h!=null)$.G=h
d=q.c
if(d instanceof A.H){p=q.a.$ti
p=p.i("Z<2>").b(d)||!p.y[1].b(d)}else p=!1
if(p){g=q.a.b
if((d.a&24)!==0){f=r.a(g.c)
g.c=null
b=g.bB(f)
g.a=d.a&30|g.a&1
g.c=d.c
e.a=d
continue}else A.p7(d,g,!0)
return}}g=q.a.b
f=r.a(g.c)
g.c=null
b=g.bB(f)
d=q.b
p=q.c
if(!d){g.$ti.c.a(p)
g.a=8
g.c=p}else{s.a(p)
g.a=g.a&1|16
g.c=p}e.a=g
d=g}},
wQ(a,b){var s=t.ng
if(s.b(a))return b.ci(b,s.a(a),t.z,t.K,t.l)
s=t.mq
if(s.b(a))return b.bA(b,s.a(a),t.z,t.K)
throw A.f(A.i0(a,"onError",u.c))},
wC(){var s,r
for(s=$.dH;s!=null;s=$.dH){$.f6=null
r=s.b
$.dH=r
if(r==null)$.f5=null
s.a.$0()}},
x0(){$.pe=!0
try{A.wC()}finally{$.f6=null
$.pe=!1
if($.dH!=null)$.pM().$1(A.rK())}},
rE(a){var s=new A.hm(a),r=$.f5
if(r==null){$.dH=$.f5=s
if(!$.pe)$.pM().$1(A.rK())}else $.f5=r.b=s},
wV(a){var s,r,q,p=$.dH
if(p==null){A.rE(a)
$.f6=$.f5
return}s=new A.hm(a)
r=$.f6
if(r==null){s.b=p
$.dH=$.f6=s}else{q=r.b
s.b=q
$.f6=r.b=s
if(q==null)$.f5=s}},
yn(a){var s=$.G
if(B.l===s){A.po(B.l,a)
return}A.po(s,s.b5(s,a,t.H))
return},
yQ(a,b){return new A.c_(A.bv(a,"stream",t.K),b.i("c_<0>"))},
pp(a){return},
vg(a,b){if(b==null)b=A.xg()
if(t.b9.b(b))return a.ci(a,t.ng.a(b),t.z,t.K,t.l)
if(t.i6.b(b))return a.bA(a,t.mq.a(b),t.z,t.K)
throw A.f(A.aN("handleError callback must take either an Object (the error), or both an Object (the error) and a StackTrace.",null))},
wG(a,b){var s=$.G
s.b3(s,a,b)},
wF(){},
qT(a,b){var s=$.G
if(s===B.l)return s.dc(s,a,t.M.a(b))
return s.dc(s,a,t.M.a(s.hW(b)))},
wS(a,b){A.wV(new A.mi(a,b))},
po(a,b){if(B.l!==a)b=a.e9(b,t.H)
A.rE(b)},
kW:function kW(a){this.a=a},
kV:function kV(a,b,c){this.a=a
this.b=b
this.c=c},
kX:function kX(a){this.a=a},
kY:function kY(a){this.a=a},
ly:function ly(){this.b=null},
lz:function lz(a,b){this.a=a
this.b=b},
eA:function eA(a,b){this.a=a
this.b=!1
this.$ti=b},
lH:function lH(a){this.a=a},
lI:function lI(a){this.a=a},
mq:function mq(a){this.a=a},
d_:function d_(a,b){var _=this
_.a=a
_.e=_.d=_.c=_.b=null
_.$ti=b},
cr:function cr(a,b){this.a=a
this.$ti=b},
aB:function aB(a,b){this.a=a
this.b=b},
io:function io(a,b,c){this.a=a
this.b=b
this.c=c},
kA:function kA(a,b){this.a=a
this.b=b},
eC:function eC(){},
bT:function bT(a,b){this.a=a
this.$ti=b},
bV:function bV(a,b,c,d,e){var _=this
_.a=null
_.b=a
_.c=b
_.d=c
_.e=d
_.$ti=e},
H:function H(a,b){var _=this
_.a=0
_.b=a
_.c=null
_.$ti=b},
l3:function l3(a,b){this.a=a
this.b=b},
l7:function l7(a,b){this.a=a
this.b=b},
l6:function l6(a,b){this.a=a
this.b=b},
l5:function l5(a,b){this.a=a
this.b=b},
l4:function l4(a,b){this.a=a
this.b=b},
la:function la(a,b,c){this.a=a
this.b=b
this.c=c},
lb:function lb(a,b){this.a=a
this.b=b},
lc:function lc(a){this.a=a},
l9:function l9(a,b){this.a=a
this.b=b},
l8:function l8(a,b){this.a=a
this.b=b},
hm:function hm(a){this.a=a
this.b=null},
cm:function cm(){},
jZ:function jZ(a,b){this.a=a
this.b=b},
k_:function k_(a,b){this.a=a
this.b=b},
eU:function eU(){},
lx:function lx(a){this.a=a},
lw:function lw(a){this.a=a},
hn:function hn(){},
dw:function dw(a,b,c,d,e){var _=this
_.a=null
_.b=0
_.d=a
_.e=b
_.f=c
_.r=d
_.$ti=e},
dz:function dz(a,b){this.a=a
this.$ti=b},
cT:function cT(a,b,c,d,e){var _=this
_.w=a
_.a=b
_.d=c
_.e=d
_.r=_.f=null
_.$ti=e},
dx:function dx(){},
eW:function eW(){},
eD:function eD(){},
cU:function cU(a,b){this.b=a
this.a=null
this.$ti=b},
bh:function bh(a){var _=this
_.a=0
_.c=_.b=null
_.$ti=a},
ll:function ll(a,b){this.a=a
this.b=b},
c_:function c_(a,b){var _=this
_.a=null
_.b=a
_.c=!1
_.$ti=b},
kS:function kS(){},
kU:function kU(a,b,c){this.a=a
this.b=b
this.c=c},
kT:function kT(a,b){this.a=a
this.b=b},
mi:function mi(a,b){this.a=a
this.b=b},
p_(a,b){return new A.bb(a.i("@<0>").G(b).i("bb<1,2>"))},
j4(a,b,c){return b.i("@<0>").G(c).i("oZ<1,2>").a(A.rS(a,new A.bb(b.i("@<0>").G(c).i("bb<1,2>"))))},
A(a,b){return new A.bb(a.i("@<0>").G(b).i("bb<1,2>"))},
qx(a){return new A.cY(a.i("cY<0>"))},
bd(a){return new A.cY(a.i("cY<0>"))},
p8(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
oU(a,b,c){var s
A.ab(b,"index")
if(t.P.b(a)){if(b>=a.length)return null
return J.dN(a,b)}s=J.B(a)
do if(!s.l())return null
while(--b,b>=0)
return s.gn()},
uu(a,b,c){var s=A.p_(b,c)
s.v(0,a)
return s},
uv(a,b){var s,r,q=A.qx(b)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.i)(a),++r)q.j(0,b.a(a[r]))
return q},
p0(a){var s,r
if(A.pA(a))return"{...}"
s=new A.bg("")
try{r={}
B.a.j($.aY,a)
s.a+="{"
r.a=!0
a.Z(0,new A.jl(r,s))
s.a+="}"}finally{if(0>=$.aY.length)return A.a($.aY,-1)
$.aY.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
uy(a,b,c){var s,r,q=A.D(b),p=new J.b6(b,b.length,q.i("b6<1>")),o=A.D(c),n=new J.b6(c,c.length,o.i("b6<1>")),m=p.l(),l=n.l()
q=q.c
o=o.c
for(;;){if(!(m&&l))break
s=p.d
if(s==null)s=q.a(s)
r=n.d
a.m(0,s,r==null?o.a(r):r)
m=p.l()
l=n.l()}if(m||l)throw A.f(A.aN("Iterables do not have same length.",null))},
cY:function cY(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
hA:function hA(a){this.a=a
this.c=this.b=null},
eG:function eG(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
y:function y(){},
T:function T(){},
jk:function jk(a){this.a=a},
jl:function jl(a,b){this.a=a
this.b=b},
eH:function eH(a,b){this.a=a
this.$ti=b},
eI:function eI(a,b,c){var _=this
_.a=a
_.b=b
_.c=null
_.$ti=c},
bK:function bK(){},
eS:function eS(){},
wJ(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.aG(r)
q=A.de(String(s),null,null)
throw A.f(q)}q=A.lV(p)
return q},
lV(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.hx(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.lV(a[s])
return a},
vL(a,b,c){var s,r,q,p,o,n=c-b
if(n<=4096)s=$.ts()
else s=new Uint8Array(n)
for(r=a.length,q=0;q<n;++q){p=b+q
if(!(p<r))return A.a(a,p)
o=a[p]
if((o&255)!==o)o=255
s[q]=o}return s},
vK(a,b,c,d){var s=a?$.tr():$.tq()
if(s==null)return null
if(0===c&&d===b.length)return A.rg(s,b)
return A.rg(s,b.subarray(c,d))},
rg(a,b){var s,r
try{s=a.decode(b)
return s}catch(r){}return null},
qs(a,b,c){return new A.dj(a,b)},
w1(a){return a.ja()},
vl(a,b){return new A.lg(a,[],A.xq())},
vm(a,b,c){var s,r=new A.bg(""),q=A.vl(r,b)
q.bP(a)
s=r.a
return s.charCodeAt(0)==0?s:s},
vM(a){switch(a){case 65:return"Missing extension byte"
case 67:return"Unexpected extension byte"
case 69:return"Invalid UTF-8 byte"
case 71:return"Overlong encoding"
case 73:return"Out of unicode range"
case 75:return"Encoded surrogate"
case 77:return"Unfinished UTF-8 octet sequence"
default:return""}},
hx:function hx(a,b){this.a=a
this.b=b
this.c=null},
lf:function lf(a){this.a=a},
hy:function hy(a){this.a=a},
lD:function lD(){},
lC:function lC(){},
d8:function d8(){},
fq:function fq(){},
fu:function fu(){},
dj:function dj(a,b){this.a=a
this.b=b},
fN:function fN(a,b){this.a=a
this.b=b},
fM:function fM(){},
iW:function iW(a){this.b=a},
iV:function iV(a){this.a=a},
lh:function lh(){},
li:function li(a,b){this.a=a
this.b=b},
lg:function lg(a,b,c){this.c=a
this.a=b
this.b=c},
hh:function hh(){},
kF:function kF(){},
lE:function lE(a){this.b=0
this.c=a},
hi:function hi(a){this.a=a},
f1:function f1(a){this.a=a
this.b=16
this.c=0},
u7(a,b){a=A.ad(a,new Error())
if(a==null)a=A.cu(a)
a.stack=b.q(0)
throw a},
a9(a,b,c,d){var s,r=c?J.oW(a,d):J.qn(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
uw(a,b,c){var s,r,q=A.b([],c.i("p<0>"))
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.i)(a),++r)B.a.j(q,c.a(a[r]))
q.$flags=1
return q},
W(a,b){var s,r
if(Array.isArray(a))return A.b(a.slice(0),b.i("p<0>"))
s=A.b([],b.i("p<0>"))
for(r=J.B(a);r.l();)B.a.j(s,r.gn())
return s},
ux(a,b,c){var s,r=J.oW(a,c)
for(s=0;s<a;++s)B.a.m(r,s,b.$1(s))
return r},
bq(a,b,c){var s,r,q,p,o
A.ab(b,"start")
s=c==null
r=!s
if(r){q=c-b
if(q<0)throw A.f(A.aa(c,b,null,"end",null))
if(q===0)return""}if(Array.isArray(a)){p=a
o=p.length
if(s)c=o
return A.qH(b>0||c<o?p.slice(b,c):p)}if(t.ho.b(a))return A.v5(a,b,c)
if(r)a=J.i_(a,c)
if(b>0)a=J.d3(a,b)
s=A.W(a,t.S)
return A.qH(s)},
v5(a,b,c){var s=a.length
if(b>=s)return""
return A.uV(a,b,c==null||c>s?s:c)},
fZ(a){return new A.dg(a,A.qr(a,!1,!0,!1,!1,""))},
p6(a,b,c){var s=J.B(b)
if(!s.l())return a
if(c.length===0){do a+=A.u(s.gn())
while(s.l())}else{a+=A.u(s.gn())
while(s.l())a=a+c+A.u(s.gn())}return a},
vJ(a,b,c,d){var s,r,q,p,o,n="0123456789ABCDEF"
if(c===B.R){s=$.tp()
s=s.b.test(b)}else s=!1
if(s)return b
r=B.b2.cA(b)
for(s=r.length,q=0,p="";q<s;++q){o=r[q]
if(o<128&&("\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u03f6\x00\u0404\u03f4 \u03f4\u03f6\u01f6\u01f6\u03f6\u03fc\u01f4\u03ff\u03ff\u0584\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u05d4\u01f4\x00\u01f4\x00\u0504\u05c4\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u0400\x00\u0400\u0200\u03f7\u0200\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u0200\u0200\u0200\u03f7\x00".charCodeAt(o)&a)!==0)p+=A.O(o)
else p=p+"%"+n[o>>>4&15]+n[o&15]}return p.charCodeAt(0)==0?p:p},
v2(){return A.c5(new Error())},
u6(a,b,c){var s,r
for(s=0;s<3;++s){r=a[s]
if(r.b===b)return r}throw A.f(A.i0(b,"name","No enum value with that name"))},
fv(a){if(typeof a=="number"||A.E(a)||a==null)return J.bj(a)
if(typeof a=="string")return JSON.stringify(a)
return A.qG(a)},
u8(a,b){A.bv(a,"error",t.K)
A.bv(b,"stackTrace",t.l)
A.u7(a,b)},
ff(a){return new A.fe(a)},
aN(a,b){return new A.b5(!1,null,b,a)},
i0(a,b,c){return new A.b5(!0,a,b,c)},
c6(a,b,c){return a},
qJ(a,b){return new A.cj(null,null,!0,a,b,"Value not in range")},
aa(a,b,c,d,e){return new A.cj(b,c,!0,a,d,"Invalid value")},
uW(a,b,c,d){if(a<b||a>c)throw A.f(A.aa(a,b,c,d,null))
return a},
aw(a,b,c){if(0>a||a>c)throw A.f(A.aa(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.f(A.aa(b,a,c,"end",null))
return b}return c},
ab(a,b){if(a<0)throw A.f(A.aa(a,0,null,b,null))
return a},
iO(a,b,c,d){return new A.fG(b,!0,a,d,"Index out of range")},
aC(a){return new A.ev(a)},
qX(a){return new A.hf(a)},
bp(a){return new A.cl(a)},
a0(a){return new A.fp(a)},
de(a,b,c){return new A.a4(a,b,c)},
um(a,b,c){var s,r
if(A.pA(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.b([],t.s)
B.a.j($.aY,a)
try{A.ww(a,s)}finally{if(0>=$.aY.length)return A.a($.aY,-1)
$.aY.pop()}r=A.p6(b,t.e7.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
oV(a,b,c){var s,r
if(A.pA(a))return b+"..."+c
s=new A.bg(b)
B.a.j($.aY,a)
try{r=s
r.a=A.p6(r.a,a,", ")}finally{if(0>=$.aY.length)return A.a($.aY,-1)
$.aY.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
ww(a,b){var s,r,q,p,o,n,m,l=a.gp(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.l())return
s=A.u(l.gn())
B.a.j(b,s)
k+=s.length+2;++j}if(!l.l()){if(j<=5)return
if(0>=b.length)return A.a(b,-1)
r=b.pop()
if(0>=b.length)return A.a(b,-1)
q=b.pop()}else{p=l.gn();++j
if(!l.l()){if(j<=4){B.a.j(b,A.u(p))
return}r=A.u(p)
if(0>=b.length)return A.a(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gn();++j
for(;l.l();p=o,o=n){n=l.gn();++j
if(j>100){for(;;){if(!(k>75&&j>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2;--j}B.a.j(b,"...")
return}}q=A.u(p)
r=A.u(o)
k+=r.length+q.length+4}}if(j>b.length+2){k+=5
m="..."}else m=null
for(;;){if(!(k>80&&b.length>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2
if(m==null){k+=5
m="..."}}if(m!=null)B.a.j(b,m)
B.a.j(b,q)
B.a.j(b,r)},
qy(a,b,c,d,e){return new A.cA(a,b.i("@<0>").G(c).G(d).G(e).i("cA<1,2,3,4>"))},
jv(a,b,c,d,e){var s
if(B.B===c)return A.qR(J.ao(a),J.ao(b),$.fc())
if(B.B===d){s=J.ao(a)
b=J.ao(b)
c=J.ao(c)
return A.h6(A.aL(A.aL(A.aL($.fc(),s),b),c))}if(B.B===e){s=J.ao(a)
b=J.ao(b)
c=J.ao(c)
d=J.ao(d)
return A.h6(A.aL(A.aL(A.aL(A.aL($.fc(),s),b),c),d))}s=J.ao(a)
b=J.ao(b)
c=J.ao(c)
d=J.ao(d)
e=J.ao(e)
e=A.h6(A.aL(A.aL(A.aL(A.aL(A.aL($.fc(),s),b),c),d),e))
return e},
uJ(a){var s,r,q=$.fc()
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.i)(a),++r)q=A.aL(q,J.ao(a[r]))
return A.h6(q)},
uK(a){var s,r,q,p,o
for(s=a.gp(a),r=0,q=0;s.l();){p=J.ao(s.gn())
o=((p^p>>>16)>>>0)*569420461>>>0
o=((o^o>>>15)>>>0)*3545902487>>>0
r=r+((o^o>>>15)>>>0)&1073741823;++q}return A.qR(r,q,0)},
v0(a){return new A.aq(a)},
rm(a,b){return 65536+((a&1023)<<10)+(b&1023)},
bl:function bl(a){this.a=a},
hq:function hq(){},
Y:function Y(){},
fe:function fe(a){this.a=a},
bO:function bO(){},
b5:function b5(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
cj:function cj(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
fG:function fG(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
ev:function ev(a){this.a=a},
hf:function hf(a){this.a=a},
cl:function cl(a){this.a=a},
fp:function fp(a){this.a=a},
fT:function fT(){},
eq:function eq(){},
l2:function l2(a){this.a=a},
a4:function a4(a,b,c){this.a=a
this.b=b
this.c=c},
j:function j(){},
a5:function a5(a,b,c){this.a=a
this.b=b
this.$ti=c},
a3:function a3(){},
m:function m(){},
hK:function hK(){},
aq:function aq(a){this.a=a},
cO:function cO(a){var _=this
_.a=a
_.c=_.b=0
_.d=-1},
bg:function bg(a){this.a=a},
xN(){return v.G},
up(a){return a},
tK(a){return a},
v4(a){return a},
jt:function jt(a){this.a=a},
vX(a,b,c){t.gY.a(a)
if(A.v(c)>=1)return a.$1(b)
return a.$0()},
oh(a,b){var s=new A.H($.G,b.i("H<0>")),r=new A.bT(s,b.i("bT<0>"))
a.then(A.dK(new A.oi(r,b),1),A.dK(new A.oj(r),1))
return s},
oi:function oi(a,b){this.a=a
this.b=b},
oj:function oj(a){this.a=a},
ds:function ds(a,b){this.a=a
this.b=b},
q9(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g=b.length,f=g!==0
if(f){if(0>=g)return A.a(b,0)
s=b[0]*2}else s=a.length
r=A.q7(a,0,s,2,null,!0)
q=A.b([],t.X)
if(r!=null){g=r.e
g===$&&A.h()
p=r.d
p===$&&A.h()
p=g===p
g=p}else g=!0
if(g)return q
if(f)r=A.tW(a,b,r,2)
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
h=5e-324}A.fr(r,q,2,l,m,h,-2147483648)
return q},
fr(a,b,c,d,e,f,g){var s,r,q,p,o
if(a==null)return
s=g===-2147483648
if(s&&f!==5e-324)A.tZ(a,d,e,f)
r=f!==5e-324
q=a
for(;;){p=a.d
p===$&&A.h()
o=a.e
o===$&&A.h()
if(!(p!==o))break
A:{if(r?A.u1(a,d,e,f):A.u0(a)){B.a.j(b,B.b.a0(p.a,c))
B.a.j(b,B.b.a0(a.a,c))
B.a.j(b,B.b.a0(o.a,c))
A.ft(a)
p=o.e
p===$&&A.h()
q=p
a=q
break A}if(o===q){if(s)A.fr(A.cB(o,null),b,c,d,e,f,1)
else if(g===1){s=A.cB(o,null)
s.toString
A.fr(A.tV(s,b,c),b,c,d,e,f,2)}else if(g===2)A.u5(o,b,c,d,e,f)
break}a=o}}},
u5(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k=-2147483648,j=a
do{s=j.e
s===$&&A.h()
s=s.e
s===$&&A.h()
r=j.a
q=j.b
p=j.c
o=s
for(;;){s=j.d
s===$&&A.h()
if(!(o!==s))break
n=o.a
m=!1
if(r!==n)if(j.e.a!==n)if(s.a!==n)if(!A.u_(j,o)){s=!1
if(A.fs(j,o))if(A.fs(o,j))if(A.u2(j,o)){s=j.d
n=o.d
n===$&&A.h()
s=A.a8(s,j,n)!==0||A.a8(j,n,o)!==0}if(!s)if(q===o.b&&p===o.c)if(A.a8(j.d,j,j.e)>0){s=o.d
s===$&&A.h()
n=o.e
n===$&&A.h()
n=A.a8(s,o,n)>0
s=n}else s=m
else s=m
else s=!0}else s=m
else s=m
else s=m
else s=m
if(s){l=A.q8(j,o)
s=A.cB(j,j.e)
s.toString
r=l.e
r===$&&A.h()
r=A.cB(l,r)
r.toString
A.fr(s,b,c,d,e,f,k)
A.fr(r,b,c,d,e,f,k)
return}s=o.e
s===$&&A.h()
o=s}j=j.e}while(j!==a)},
u2(a,b){var s,r,q,p,o=(a.b+b.b)/2,n=(a.c+b.c)/2,m=a,l=!1
do{s=m.c
r=m.e
r===$&&A.h()
q=r.c
if(s>n!==q>n){p=m.b
p=o<(r.b-p)*(n-s)/(q-s)+p
s=p}else s=!1
if(s)l=!l
if(r!==a){m=r
continue}else break}while(!0)
return l},
u_(a,b){var s,r,q,p=a.a,o=b.a,n=a
do{s=n.a
if(s!==p){r=n.e
r===$&&A.h()
q=r.a
s=q!==p&&s!==o&&q!==o&&A.q6(n,r,a,b)}else s=!1
if(s)return!0
s=n.e
s===$&&A.h()
if(s!==a){n=s
continue}else break}while(!0)
return!1},
q6(a,b,c,d){var s,r,q,p,o=a.b,n=c.b
if(!(o===n&&a.c===c.c&&b.b===d.b&&b.c===d.c))o=o===d.b&&a.c===d.c&&n===b.b&&c.c===b.c
else o=!0
if(o)return!0
o=A.a8(a,b,c)
if(o>0)s=1
else s=o<0?-1:0
o=A.a8(a,b,d)
if(o>0)r=1
else r=o<0?-1:0
o=A.a8(c,d,a)
if(o>0)q=1
else q=o<0?-1:0
o=A.a8(c,d,b)
if(o>0)p=1
else p=o<0?-1:0
if(s!==r&&q!==p)return!0
if(s===0&&A.ia(a,c,b))return!0
if(r===0&&A.ia(a,d,b))return!0
if(q===0&&A.ia(c,a,d))return!0
if(p===0&&A.ia(c,b,d))return!0
return!1},
ia(a,b,c){var s=b.b,r=a.b,q=c.b,p=!1
if(s<=Math.max(r,q))if(s>=Math.min(r,q)){s=b.c
r=a.c
q=c.c
s=s<=Math.max(r,q)&&s>=Math.min(r,q)}else s=p
else s=p
return s},
tV(a,b,c){var s,r,q,p=a
do{s=p.d
s===$&&A.h()
r=p.e
r===$&&A.h()
q=r.e
q===$&&A.h()
if(!(s.b===q.b&&s.c===q.c)&&A.q6(s,p,r,q)&&A.fs(s,q)&&A.fs(q,s)){B.a.j(b,B.b.a0(s.a,c))
B.a.j(b,B.b.a0(p.a,c))
B.a.j(b,B.b.a0(q.a,c))
A.ft(p)
A.ft(p.e)
p=q
a=p}s=p.e
s===$&&A.h()
if(s!==a){p=s
continue}else break}while(!0)
return A.cB(s,null)},
u0(a){var s,r,q,p,o,n,m,l,k,j=a.d
j===$&&A.h()
s=a.e
s===$&&A.h()
if(A.a8(j,a,s)>=0)return!1
r=s.e
r===$&&A.h()
for(q=j.b,p=j.c,o=a.b,n=a.c,m=s.b,s=s.c,l=r;l!==j;l=r){if(A.dW(q,p,o,n,m,s,l.b,l.c)){r=l.d
r===$&&A.h()
k=l.e
k===$&&A.h()
k=A.a8(r,l,k)>=0
r=k}else r=!1
if(r)return!1
r=l.e
r===$&&A.h()}return!0},
u1(a,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a.d
b===$&&A.h()
s=a.e
s===$&&A.h()
if(A.a8(b,a,s)>=0)return!1
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
j=A.oQ(o,m,a0,a1,a2)
i=A.oQ(l,k,a0,a1,a2)
h=a.w
g=a.x
f=a.d
e=a.e
for(;;){if(!(h!=null&&h.f>=j&&g!=null&&g.f<=i))break
d=!1
if(h!==f)if(h!==e)if(A.dW(r,b,q,n,p,s,h.b,h.c)){d=h.d
d===$&&A.h()
c=h.e
c===$&&A.h()
c=A.a8(d,h,c)>=0
d=c}if(d)return!1
h=h.w
d=!1
if(g!==f)if(g!==e)if(A.dW(r,b,q,n,p,s,g.b,g.c)){d=g.d
d===$&&A.h()
c=g.e
c===$&&A.h()
c=A.a8(d,g,c)>=0
d=c}if(d)return!1
g=g.x}for(;;){if(!(h!=null&&h.f>=j))break
d=!1
if(h!==f)if(h!==e)if(A.dW(r,b,q,n,p,s,h.b,h.c)){d=h.d
d===$&&A.h()
c=h.e
c===$&&A.h()
c=A.a8(d,h,c)>=0
d=c}if(d)return!1
h=h.w}for(;;){if(!(g!=null&&g.f<=i))break
d=!1
if(g!==f)if(g!==e)if(A.dW(r,b,q,n,p,s,g.b,g.c)){d=g.d
d===$&&A.h()
c=g.e
c===$&&A.h()
c=A.a8(d,g,c)>=0
d=c}if(d)return!1
g=g.x}return!0},
oQ(a,b,c,d,e){var s=B.c.N(32767*(a-c)*e),r=B.c.N(32767*(b-d)*e)
s=(s|s<<8)&16711935
s=(s|s<<4)&252645135
s=(s|s<<2)&858993459
r=(r|r<<8)&16711935
r=(r|r<<4)&252645135
r=(r|r<<2)&858993459
return((s|s<<1)&1431655765|((r|r<<1)&1431655765)<<1)>>>0},
tZ(a,b,c,d){var s,r=a
do{if(r.f===5e-324)r.f=A.oQ(r.b,r.c,b,c,d)
s=r.d
s===$&&A.h()
r.w=s
s=r.e
s===$&&A.h()
r.x=s
if(s!==a){r=s
continue}else break}while(!0)
s.w=s.w.x=null
A.u4(s)},
u4(a){var s,r,q,p,o,n,m,l,k,j,i,h=1
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
tW(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=A.b([],t.eB),e=b.length
for(s=a.length,r=e-1,q=0;q<e;q=l){p=b.length
if(!(q<p))return A.a(b,q)
o=b[q]
if(q<r){n=q+1
if(!(n<p))return A.a(b,n)
m=b[n]*d}else m=s
l=q+1
k=A.q7(a,o*d,m,d,l,!1)
p=k==null
if(p)o=null
else{o=k.e
o===$&&A.h()}if(k==o)if(!p)k.r=!0
k.toString
B.a.j(f,A.tY(k))}B.a.aD(f,new A.i9())
for(r=f.length,j=0;j<f.length;f.length===r||(0,A.i)(f),++j,c=p){i=f[j]
h=A.tX(i,c)
if(h!=null){g=A.q8(h,i)
p=h.e
p===$&&A.h()
A.cB(h,p)
p=g.e
p===$&&A.h()
A.cB(g,p)}p=c.e
p===$&&A.h()
p=A.cB(c,p)
p.toString}return c},
cB(a,b){var s,r,q,p,o,n,m,l
if(b==null)b=a
s=a
do{r=s.d
r===$&&A.h()
q=r.y
p=s.y
o=s.e
o===$&&A.h()
n=o.y
m=!1
if(!s.r){l=s.b
if(!(l===o.b&&s.c===o.c))l=r.b===l&&r.c===s.c
else l=!0
if(l)m=!0
else if(q!=null||q!==0||n!=null||n!==0||q==n||q!=p)m=A.a8(r,s,o)===0}if(m){A.ft(s)
s=s.d
r=s.e
r===$&&A.h()
if(s===r){b=s
break}b=s}else s=o}while(m||s!==b)
return b},
a8(a,b,c){var s=b.c,r=b.b
return(s-a.c)*(c.b-r)-(r-a.b)*(c.c-s)},
q8(a,b){var s,r=A.p9(a.a,a.b,a.c),q=A.p9(b.a,b.b,b.c),p=a.e
p===$&&A.h()
s=b.d
s===$&&A.h()
r.y=a.y
q.y=b.y
a.e=b
b.d=a
r.e=p
q.e=p.d=r
s.e=r.d=q
q.d=s
return q},
tX(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=a.b,g=a.c,f=b,e=-17976931348623157e292,d=null
do{s=f.c
if(g<=s){r=f.e
r===$&&A.h()
r=g>=r.c}else r=!1
if(r){r=f.b
q=f.e
q===$&&A.h()
p=q.b
o=q.c
n=r+(g-s)*(p-r)/(o-s)
if(n<=h&&n>e){if(n===h){if(g===s)return f
if(g===o)return q}if(r<p)d=f
else d=q
e=n}}s=f.e
s===$&&A.h()
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
p=A.dW(q,g,m,l,p,g,r,f.c)
q=p}if(q){i=Math.abs(g-f.c)/(h-r)
q=!1
if(A.fs(f,a))if(!(i<j))if(i===j){p=k.b
if(!(r>p))if(r===p){r=k.d
r===$&&A.h()
p=f.d
p===$&&A.h()
if(A.a8(r,k,p)<0){r=f.e
r===$&&A.h()
q=k.e
q===$&&A.h()
q=A.a8(r,k,q)<0
r=q}else r=q}else r=q
else r=!0}else r=q
else r=!0
else r=q
if(r){j=i
k=f}}r=f.e
r===$&&A.h()
if(r!==d){f=r
continue}else break}while(!0)
return k},
fs(a,b){var s,r=a.d
r===$&&A.h()
s=a.e
s===$&&A.h()
if(A.a8(r,a,s)<0)r=A.a8(a,b,s)>=0&&A.a8(a,r,b)>=0
else r=A.a8(a,b,r)<0||A.a8(a,s,b)<0
return r},
dW(a,b,c,d,e,f,g,h){var s,r,q=e-g,p=b-h,o=a-g,n=f-h
if(q*p-o*n>=0){s=d-h
r=c-g
q=o*s-r*p>=0&&r*n-q*s>=0}else q=!1
return q},
tY(a){var s,r,q=a,p=q
do{s=p.b
r=q.b
if(!(s<r))s=s===r&&p.c<q.c
else s=!0
if(s)q=p
s=p.e
s===$&&A.h()
if(s!==a){p=s
continue}else break}while(!0)
return q},
q7(a,b,c,d,e,f){var s,r,q,p,o=null
if(f===A.u3(a,b,c,d)>0)for(s=a.length,r=b;r<c;r+=d){if(!(r>=0&&r<s))return A.a(a,r)
q=a[r]
p=r+1
if(!(p<s))return A.a(a,p)
o=A.q5(r,q,a[p],o)
o.y=e}else for(r=c-d,s=a.length;r>=b;r-=d){if(!(r>=0&&r<s))return A.a(a,r)
q=a[r]
p=r+1
if(!(p<s))return A.a(a,p)
o=A.q5(r,q,a[p],o)
o.y=e}if(o!=null){s=o.e
s===$&&A.h()
s=o.b===s.b&&o.c===s.c}else s=!1
if(s){A.ft(o)
s=o.e
s===$&&A.h()
s.y=e
o=s}return o},
ft(a){var s,r=a.e
r===$&&A.h()
s=a.d
s===$&&A.h()
r.d=s
a.d.e=r
r=a.w
if(r!=null)r.x=a.x
s=a.x
if(s!=null)s.w=r},
q5(a,b,c,d){var s,r=A.p9(a,b,c)
if(d==null){r.d=r
r.e=r}else{s=d.e
s===$&&A.h()
r.e=s
r.d=d
d.e=d.e.d=r}return r},
u3(a,b,c,d){var s,r,q,p,o,n,m,l,k=c-d
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
p9(a,b,c){return new A.bX(a,b,c)},
i9:function i9(){},
bX:function bX(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.e=_.d=$
_.f=5e-324
_.r=!1
_.y=_.x=_.w=null},
v7(a){var s
t.o.a(a)
s=J.n(a)
return s.h(a,1)<-32767.5||s.h(a,1)>32766.5},
rR(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i=t.n,h=A.b([],i),g=A.b([],i),f=new A.nM(d,g)
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
B.a.a1(g)
f.$2(n,q)
f.$2(m,o)
B.a.bl(g)
for(r=g.length,p=q-n,l=o-m,k=0;k<g.length;g.length===r||(0,A.i)(g),++k){j=g[k]
B.a.j(h,n+p*j)
B.a.j(h,m+l*j)}}B.a.j(h,q)
B.a.j(h,o)}return new Float64Array(A.N(h))},
h4:function h4(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
nM:function nM(a,b){this.a=a
this.b=b},
hj:function hj(a,b,c){this.a=a
this.b=b
this.c=c},
kO:function kO(){},
qk(a,b){return new A.iM(a,b)},
em:function em(a,b){this.a=a
this.b=b},
iM:function iM(a,b){this.a=a
this.b=b},
fj:function fj(a){this.a=!1
this.b=a},
dR:function dR(){},
pJ(a,b){var s=0,r=A.aj(t.H)
var $async$pJ=A.ak(function(c,d){if(c===1)return A.ag(d,r)
for(;;)switch(s){case 0:return A.ah(null,r)}})
return A.ai($async$pJ,r)},
o0(a){var s=0,r=A.aj(t.p),q,p,o,n
var $async$o0=A.ak(function(b,c){if(b===1)return A.ag(c,r)
for(;;)switch(s){case 0:p=v.G
o=A.aD(A.aD(A.aD(new p.Blob(A.b([a],t.aA))).stream()).pipeThrough(A.aD(new p.DecompressionStream("gzip"))))
n=A
s=3
return A.I(A.oh(A.aD(A.aD(new p.Response(o)).arrayBuffer()),t.eb),$async$o0)
case 3:q=n.p2(c,0,null)
s=1
break
case 1:return A.ah(q,r)}})
return A.ai($async$o0,r)},
hS(a,b,c){var s=0,r=A.aj(t.K),q,p,o
var $async$hS=A.ak(function(d,e){if(d===1)return A.ag(e,r)
for(;;)switch(s){case 0:if(!$.tu()){q=a
s=1
break}p=v.G
o=A
s=3
return A.I(A.oh(A.aD(p.createImageBitmap(A.aD(new p.ImageData(A.x2(a),b,c)))),t.m),$async$hS)
case 3:q=new o.ed(e)
s=1
break
case 1:return A.ah(q,r)}})
return A.ai($async$hS,r)},
x2(a){var s,r,q,p,o,n=a.length,m=new Uint8ClampedArray(n)
for(s=0;s<n;s+=4){r=s+3
if(!(r<n))return A.a(a,r)
q=a[r]
if(q===0)continue
p=B.b.a0(a[s]*255,q)
if(!(s<n))return A.a(m,s)
m[s]=p
p=s+1
if(!(p<n))return A.a(a,p)
o=B.b.a0(a[p]*255,q)
if(!(p<n))return A.a(m,p)
m[p]=o
o=s+2
if(!(o<n))return A.a(a,o)
p=B.b.a0(a[o]*255,q)
if(!(o<n))return A.a(m,o)
m[o]=p
if(!(r<n))return A.a(m,r)
m[r]=q}return m},
fS:function fS(){},
jq:function jq(a){this.a=a},
jr:function jr(a,b){this.a=a
this.b=b},
js:function js(a){this.a=a},
ig:function ig(a){this.a=a},
pk(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=null,e=new A.bg(""),d=[null]
for(s=J.B(a),r=t.e7,q=t.f,p=t.bW,o=t.p,n=t.kI,m=t.hM,l=t.pk;s.l();){k=s.gn()
if(k==null){e.a+="n"
d.push(f)
continue}j=A.E(k)
i=j?k:f
if(j){e.a+="b"
d.push(i)
continue}j=typeof k=="string"
i=j?k:f
if(j){e.a+="s"
d.push(i)
continue}j=A.dG(k)
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
d.push(A.hO(i,i,b))
continue}j=m.b(k)
i=j?k:f
if(j){e.a+="S"
d.push(A.hO(i,i,b))
continue}j=n.b(k)
i=j?k:f
if(j){e.a+="D"
d.push(A.hO(i,i,b))
continue}j=o.b(k)
i=j?k:f
if(j){e.a+="U"
d.push(A.hO(i,i,b))
continue}j=p.b(k)
i=j?k:f
if(j){e.a+="I"
d.push(A.hO(i,i,b))
continue}j=k instanceof A.ed
i=j?k:f
if(j){e.a+="o"
j=i.a
d.push(j)
B.a.j(b,j)
continue}j=q.b(k)
i=j?k:f
if(j){e.a+="m"
j=[]
for(h=i.ga7(),h=h.gp(h);h.l();){g=h.gn()
B.a.v(j,[g.a,g.b])}d.push(A.pk(j,b))
continue}j=r.b(k)
i=j?k:f
if(j){e.a+="l"
d.push(A.pk(i,b))
continue}throw A.f(A.aN("A "+J.pR(k).q(0)+" cannot be sent to a worker",f))}s=e.a
B.a.m(d,0,s.charCodeAt(0)==0?s:s)
return d},
hO(a,b,c){var s
if(a.byteOffset===0&&a.byteLength===J.tC(J.pQ(a))&&a.byteLength>0){s=t.eb.a(J.pQ(a))
if(!B.a.aj(c,new A.mh(s)))B.a.j(c,s)}return b},
pg(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(0<0||0>=a.length)return A.a(a,0)
s=a[0]
s.toString
A.P(s)
r=s.length
q=A.a9(r,null,!0,t.O)
for(p=t.dM,o=t.da,n=t.ho,m=t.g_,l=t.nZ,k=t.bi,j=0;j<r;j=i){i=j+1
if(!(i>=0&&i<a.length))return A.a(a,i)
h=a[i]
switch(s[j]){case"n":g=null
break
case"b":h.toString
A.lG(h)
g=h
break
case"s":h.toString
A.P(h)
g=h
break
case"i":h.toString
h=A.v(A.ct(h))
g=h
break
case"d":h.toString
A.ct(h)
g=h
break
case"F":h.toString
k.a(h)
g=h
break
case"S":h.toString
l.a(h)
g=h
break
case"D":h.toString
m.a(h)
g=h
break
case"U":h.toString
n.a(h)
g=h
break
case"I":h.toString
o.a(h)
g=h
break
case"o":h.toString
g=new A.ed(A.aD(h))
break
case"m":h.toString
g=A.wB(A.pg(p.a(h)))
break
default:h.toString
g=A.pg(p.a(h))
break}B.a.m(q,j,g)}return q},
wB(a){var s,r,q,p,o=t.O
o=A.A(o,o)
for(s=0;r=a.length,s<r;s+=2){q=a[s]
p=s+1
if(!(p<r))return A.a(a,p)
o.m(0,q,a[p])}return o},
ed:function ed(a){this.a=a},
mh:function mh(a){this.a=a},
fb(a,b,c){return A.yq(a,t.dq.a(b),c)},
yq(b2,b3,b4){var s=0,r=A.aj(t.H),q,p=2,o=[],n=[],m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1
var $async$fb=A.ak(function(b5,b6){if(b5===1){o.push(b6)
s=p}for(;;)A:switch(s){case 0:a9=new A.c_(A.bv(b4,"stream",t.K),t.b6)
p=3
f=t.nh,e=t.W,d=t.p,c=t.kI,b=t.e5
case 6:s=8
return A.I(a9.l(),$async$fb)
case 8:if(!b6){s=7
break}m=a9.gn()
a=m
a.toString
l=e.a(a)
a=J.R(l,2)
a.toString
k=A.v(a)
a=J.R(l,3)
a.toString
j=A.v(a)
a=J.R(l,1)
a.toString
d.a(a)
a0=J.l(J.R(l,4),1)
a1=J.R(l,5)
a1.toString
A.v(a1)
a2=J.R(l,6)
a2.toString
A.ac(a2)
a3=J.R(l,7)
a3.toString
A.v(a3)
a4=J.R(l,8)
a4.toString
A.ac(a4)
a5=J.R(l,9)
a5.toString
A.ac(a5)
a6=J.R(l,10)
a6.toString
c.a(a6)
a7=J.R(l,11)
a7.toString
c.a(a7)
i=A.b([],b)
h=12
for(;;){a8=h
if(typeof a8!=="number"){q=a8.bQ()
n=[1]
s=4
break A}if(!(a8<16))break
J.fd(i,f.a(J.R(l,h)))
a8=h
if(typeof a8!=="number"){q=a8.af()
n=[1]
s=4
break A}h=a8+1}g=A.yp(a,k,j,a0,new A.jV(a1,a2,a3,a4,a5,a6,a7),i)
a=J.R(l,0)
a0=k
if(typeof a0!=="number"){q=a0.af()
n=[1]
s=4
break}a1=j
if(typeof a1!=="number"){q=a1.af()
n=[1]
s=4
break}b0=b3
b1=a
s=9
return A.I(A.hS(g,a0+2,a1+2),$async$fb)
case 9:b0.$1([b1,b6])
s=6
break
case 7:n.push(5)
s=4
break
case 3:n=[2]
case 4:p=2
s=10
return A.I(a9.aA(),$async$fb)
case 10:s=n.pop()
break
case 5:case 1:return A.ah(q,r)
case 2:return A.ag(o.at(-1),r)}})
return A.ai($async$fb,r)},
yp(c0,c1,c2,c3,c4,c5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5=new A.oo(c3),b6=c1+4,b7=c2+4,b8=b6*b7,b9=new Float32Array(b8)
for(s=0;s<c2;++s)for(r=(s+2)*b6,q=s*c1,p=0;p<c1;++p)B.n.m(b9,r+p+2,b5.$2(c0,(q+p)*4))
r=c5.length
if(0>=r)return A.a(c5,0)
o=c5[0]
if(1>=r)return A.a(c5,1)
n=c5[1]
if(2>=r)return A.a(c5,2)
m=c5[2]
if(3>=r)return A.a(c5,3)
l=c5[3]
for(r=b6-2,q=n!=null,k=b7-2,j=o!=null,p=2;p<r;++p){for(i=1;i>=0;--i){if(j)h=b5.$2(o,(i*c1+p-2)*4)
else{h=(i+1)*b6+p
if(!(h>=0&&h<b8))return A.a(b9,h)
h=b9[h]
g=(i+2)*b6+p
if(!(g>=0&&g<b8))return A.a(b9,g)
g=2*h-b9[g]
h=g}B.n.m(b9,i*b6+p,h)}for(i=0;i<2;++i){s=k+i
if(q)h=b5.$2(n,(i*c1+p-2)*4)
else{h=(s-1)*b6+p
if(!(h>=0&&h<b8))return A.a(b9,h)
h=b9[h]
g=(s-2)*b6+p
if(!(g>=0&&g<b8))return A.a(b9,g)
g=2*h-b9[g]
h=g}B.n.m(b9,s*b6+p,h)}}for(q=l!=null,j=m!=null,s=0;s<b7;++s){f=s>=2&&s<k
for(h=s*b6,g=(s-2)*2,i=1;i>=0;--i){e=h+i
if(f&&j)d=b5.$2(m,(g+i)*4)
else{d=e+1
if(!(d>=0&&d<b8))return A.a(b9,d)
d=b9[d]
c=e+2
if(!(c>=0&&c<b8))return A.a(b9,c)
c=2*d-b9[c]
d=c}B.n.m(b9,e,d)}for(i=0;i<2;++i){e=h+(r+i)
if(f&&q)d=b5.$2(l,(g+i)*4)
else{d=e-1
if(!(d>=0&&d<b8))return A.a(b9,d)
d=b9[d]
c=e-2
if(!(c>=0&&c<b8))return A.a(b9,c)
c=2*d-b9[c]
d=c}B.n.m(b9,e,d)}}b=c1+2
r=c2+2
q=b*r*4
a=new Uint8Array(q)
a0=c4.c
if(a0<2)a1=0.4
else a1=a0<4.5?0.35:0.3
a2=c1/Math.pow(2,(a0<15?(a0-15)*a1:0)+3+25.2562-a0)
a3=new A.op()
a4=new Float64Array(4)
for(k=2*b6,j=c4.d,h=c4.e-j,s=0;s<r;++s){a5=Math.cos((j+h*((s-0.5)/c2))*3.141592653589793/180)
for(g=s*b6,e=s*b,p=0;p<b;++p){a6=g+p
if(!(a6>=0&&a6<b8))return A.a(b9,a6)
a7=b9[a6]
d=a6+1
if(!(d<b8))return A.a(b9,d)
a8=b9[d]
d=a6+2
if(!(d<b8))return A.a(b9,d)
a9=b9[d]
d=a6+b6
if(!(d>=0&&d<b8))return A.a(b9,d)
b0=b9[d]
d+=2
if(!(d<b8))return A.a(b9,d)
b1=b9[d]
a6+=k
if(!(a6>=0&&a6<b8))return A.a(b9,a6)
b2=b9[a6]
d=a6+1
if(!(d<b8))return A.a(b9,d)
b7=b9[d]
a6+=2
if(!(a6<b8))return A.a(b9,a6)
b3=b9[a6]
a6=a3.$1((a9+2*b1+b3-(a7+2*b0+b2))*a2)
if(typeof a6!=="number")return a6.eC()
d=a3.$1((b2+2*b7+b3-(a7+2*a8+a9))*a2)
if(typeof d!=="number")return d.eC()
c4.eK(a6/a5,d/a5,a4)
b4=(e+p)*4
for(i=0;i<4;++i){d=b4+i
c=B.c.M(B.c.H(a4[i],0,1)*255)
if(!(d>=0&&d<q))return A.a(a,d)
a[d]=c}}}return a},
qO(a,b){var s
if(a!==0)s=Math.atan2(b,-a)
else s=1.5707963267948966*(b>0?1:-1)
return s},
oo:function oo(a){this.a=a},
op:function op(){},
jV:function jV(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
qM(a,b,c){var s=a.a,r=a.b,q=a.c,p=a.d
return new A.af(s+(b.a-s)*c,r+(b.b-r)*c,q+(b.c-q)*c,p+(b.d-p)*c)},
qK(a,b,c,d){var s,r,q=new A.jL(),p=new A.jM(),o=(a+16)/116,n=q.$1(o),m=q.$1(o+b/500)
if(typeof m!=="number")return A.a6(m)
s=0.96422*m
q=q.$1(o-c/200)
if(typeof q!=="number")return A.a6(q)
r=0.82521*q
return new A.af(p.$1(3.1338561*s-1.6168667*n-0.4906146*r),p.$1(-0.9787684*s+1.9161415*n+0.033454*r),p.$1(0.0719453*s-0.2289914*n+1.4052427*r),d)},
aS(a){if(a instanceof A.af)return a
if(typeof a!="string")return null
return $.uZ.bg(a,new A.jT(a))},
uY(a){var s,r,q,p,o,n,m,l,k,j,i=null,h=B.d.bi(a).toLowerCase()
if(B.d.an(h,"#")){s=B.d.ao(h,1)
r=s.length
if(r===3||r===4)s=new A.aQ(A.b(s.split(""),t.s),t.gL.a(new A.jP()),t.gQ).bL(0)
q=A.uT(s,16)
if(q==null)return i
r=s.length
if(r===6)return new A.af((B.b.I(q,16)&255)/255,(B.b.I(q,8)&255)/255,(q&255)/255,1)
if(r===8)return new A.af((B.b.I(q,24)&255)/255,(B.b.I(q,16)&255)/255,(B.b.I(q,8)&255)/255,(q&255)/255)
return i}p=B.d.aT(h,"(")
if(p>0&&B.d.cC(h,")")){r=B.d.cV(B.d.a2(h,p+1,h.length-1),A.fZ("[,/\\s]+"))
o=A.D(r)
n=o.i("aV<1>")
m=A.W(new A.aV(r,o.i("w(1)").a(new A.jQ()),n),n.i("j.E"))
r=new A.jR(m)
o=m.length
if(o<3)return i
l=o>3?r.$2(3,1):1
k=B.d.a2(h,0,p)
if(k==="rgb"||k==="rgba")return new A.af(r.$2(0,255),r.$2(1,255),r.$2(2,255),l)
if(k==="hsl"||k==="hsla"){if(0>=m.length)return A.a(m,0)
o=m[0]
o=A.L(A.pG(o,"deg",""))
return A.qL(B.c.P(o==null?0:o,360)/360,r.$2(1,100),r.$2(2,100),l)}return i}j=B.cu.h(0,h)
if(j==null)return i
return new A.af((j>>>16&255)/255,(j>>>8&255)/255,(j&255)/255,(j>>>24&255)/255)},
qL(a,b,c,d){var s=c<0.5?c*(1+b):c+b-c*b,r=new A.jS(2*c-s,s)
return new A.af(r.$1(a+0.3333333333333333),r.$1(a),r.$1(a-0.3333333333333333),d)},
af:function af(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jO:function jO(){},
jN:function jN(){},
jL:function jL(){},
jM:function jM(){},
jT:function jT(a){this.a=a},
jP:function jP(){},
jQ:function jQ(){},
jR:function jR(a){this.a=a},
jS:function jS(a,b){this.a=a
this.b=b},
C(a){var s
if(typeof a=="number")s=a
else if(typeof a=="string")s=A.L(a)
else if(A.E(a))s=a?1:0
else s=null
return s},
az(a){if(a==null)return""
if(typeof a=="number"&&a===B.c.L(a))return B.b.q(B.c.N(a))
return J.bj(a)},
pI(a){var s,r,q,p
if(a==null)return"null"
if(A.E(a))return"boolean"
if(typeof a=="number")return"number"
if(typeof a=="string")return"string"
if(a instanceof A.af)return"color"
if(a instanceof A.bn)return"formatted"
if(t.j.b(a)){for(s=J.Q(a),r=s.gp(a),q=null;r.l();){p=A.pI(r.gn())
if(q==null)q=p
else if(q!==p){q="value"
break}}r=q==null?"value":q
return"array<"+r+", "+s.gk(a)+">"}return"object"},
t8(a){var s,r=!1
if(a!=null){s=J.as(a)
if(!s.D(a,!1))if(!s.D(a,0))if(!s.D(a,""))r=!(typeof a=="number"&&isNaN(a))}return r},
rM(a,b){var s=new A.mr(a,b)
$.pc.m(0,a,s)
return s},
ar(a){return new A.nL(a)},
t(a){var s
if(t.f.b(a))return a.K("stops")||a.K("property")?A.ph(a):A.ar(a)
if(t.j.b(a)){s=J.n(a)
s=s.gJ(a)&&B.eC.u(0,s.gt(a))}else s=!1
if(s){s=J.Q(a)
return A.xm(A.P(s.gt(a)),s.W(a,1))}return A.ar(a)},
rO(a){var s
if(typeof a=="string"&&B.d.u(a,"{"))return A.rG(a)
s=A.t(a)
if(t.f.b(a)&&a.h(0,"property")==null)return new A.nJ(s,A.A(t.N,t.u))
return new A.nK(s)},
rG(a){var s,r,q,p,o,n,m,l,k=A.b([],t.G)
for(s=A.fZ("\\{([^}]*)\\}").cu(0,a),s=new A.ez(s.a,s.b,s.c),r=t.s,q=t.lu,p=0;s.l();){o=s.d
n=(o==null?q.a(o):o).b
m=n.index
if(m>p)B.a.j(k,B.d.a2(a,p,m))
if(1>=n.length)return A.a(n,1)
l=n[1]
l.toString
B.a.j(k,A.b([l],r))
p=m+n[0].length}if(p<a.length)B.a.j(k,B.d.ao(a,p))
return new A.ml(k)},
xl(a){return A.hP(new A.my().$1(a))},
hP(a){return new A.mA(A.rO(a))},
mv(a){if(a==null)return new A.mw()
return new A.mx(A.lX(a))},
lX(a){var s,r,q,p,o,n,m,l,k,j=t.j
if(!j.b(a)||J.d2(a))return A.ar(!J.l(a,!1))
s=J.Q(a)
r=s.gt(a)
q=s.W(a,1)
p=new A.m6()
s=J.n(q)
if(s.gJ(q))if(typeof s.gt(q)=="string"){o=q.length
n=!0
if(o>=2){if(1>=o)return A.a(q,1)
if(j.b(q[1])){o=J.as(r)
o=o.D(r,"in")||o.D(r,"!in")}else o=n}else o=n
n=o}else n=!1
else n=!1
if("all"===r){j=A.b([],t.V)
for(s=q.length,m=0;m<q.length;q.length===s||(0,A.i)(q),++m)j.push(A.lX(q[m]))
return new A.lY(j)}if("any"===r){j=A.b([],t.V)
for(s=q.length,m=0;m<q.length;q.length===s||(0,A.i)(q),++m)j.push(A.lX(q[m]))
return new A.lZ(j)}if("none"===r){j=A.b([],t.V)
for(s=q.length,m=0;m<q.length;q.length===s||(0,A.i)(q),++m)j.push(A.lX(q[m]))
return new A.m_(j)}if("!has"===r)return new A.m0(s.gt(q))
if("!in"===r){l=s.gt(q)
return new A.m1(J.pU(s.W(q,1)),p,l)}o=!1
if("in"===r)if(n){o=q.length
if(o===2){if(1>=o)return A.a(q,1)
j=!j.b(q[1])}else j=!0}else j=o
else j=o
if(j){l=s.gt(q)
return new A.m2(J.pU(s.W(q,1)),p,l)}if(("=="===r||"!="===r||"<"===r||"<="===r||">"===r||">="===r)&&n){l=s.gt(q)
if(1>=q.length)return A.a(q,1)
k=q[1]
switch(r){case"==":j=new A.m3(p,l,k)
break
case"!=":j=new A.m4(p,l,k)
break
default:j=new A.m5(r,p,l,k)
break}return j}return A.t(a)},
pz(a,b,c,d,e,f,g){if(b.length===0)return A.ar(null)
return new A.o5(a,b,c,e,d,f,g)},
vV(a,b){var s,r,q,p,o,n,m=new A.lM()
for(s=0,r=1,q=0;q<24;++q){p=(s+r)/2
o=a.length
if(0>=o)return A.a(a,0)
n=a[0]
if(2>=o)return A.a(a,2)
n=m.$3(p,n,a[2])
if(typeof n!=="number")return n.bQ()
if(n<b)s=p
else r=p}o=a.length
if(1>=o)return A.a(a,1)
n=a[1]
if(3>=o)return A.a(a,3)
return m.$3((s+r)/2,n,a[3])},
ph(a0){var s,r,q,p,o,n,m,l,k,j,i,h,g=a0.h(0,"property"),f=a0.h(0,"type"),e=a0.h(0,"default"),d=a0.h(0,"stops"),c=typeof g=="string",b=c?new A.m9(g):new A.ma(),a=J.as(f)
if(a.D(f,"identity")||!t.j.b(d)||J.d2(d))return new A.mb(b,e)
if(c&&J.pP(d,new A.mc()))return A.w0(a0,d)
s=[]
r=[]
for(q=J.B(d),p=t.j,o=t.f;q.l();){n=q.gn()
if(p.b(n)){m=J.n(n)
m=m.gk(n)<2||o.b(m.gt(n))}else m=!0
if(m)return A.ar(e)
m=J.n(n)
s.push(m.h(n,0))
r.push(m.h(n,1))}if(a.D(f,"categorical")){c=t.O
l=A.p_(c,c)
A.uy(l,s,r)
return new A.md(l,b,e)}k=B.a.a4(r,new A.me())
q=A.b([],t.n)
for(p=s.length,j=0;j<s.length;s.length===p||(0,A.i)(s),++j){i=s[j]
if(typeof i=="number")o=i
else if(typeof i=="string")o=A.L(i)
else if(A.E(i))o=i?1:0
else o=null
q.push(o==null?0:o)}p=A.b([],t.V)
for(o=r.length,j=0;j<r.length;r.length===o||(0,A.i)(r),++j)p.push(A.ar(r[j]))
if(!a.D(f,"interval"))a=!k&&!a.D(f,"exponential")
else a=!0
if(a)return new A.mf(b,e,r,q)
a=A.C(a0.h(0,"base"))
if(a==null)a=1
h=A.pz(b,q,p,a,null,!1,A.dF(a0.h(0,"colorSpace")))
if(!c)return h
return new A.mg(g,h,e)},
w0(a,b){var s,r,q,p,o,n,m,l,k,j,i="colorSpace",h=t.W,g=A.A(t.i,h)
for(h=J.bx(b,h),s=h.$ti,h=new A.a1(h,h.gk(0),s.i("a1<y.E>")),r=t.f,s=s.i("y.E");h.l();){q=h.d
if(q==null)q=s.a(q)
p=J.Q(q)
o=p.gt(q)
o.toString
r.a(o)
n=o.h(0,"zoom")
if(typeof n=="number")m=n
else{if(typeof n=="string")n=A.L(n)
else if(A.E(n))n=n?1:0
else n=null
m=n}if(m==null)m=0
n=g.h(0,m)
if(n==null){n=[]
g.m(0,m,n)}o=o.h(0,"value")
B.a.j(n,[o,p.gk(q)>1?p.h(q,1):null])}h=g.$ti.i("aH<1>")
l=A.W(new A.aH(g,h),h.i("j.E"))
B.a.bl(l)
if(J.l(a.h(0,"type"),"interval")){h=A.b([],t.V)
for(s=l.length,r=t.O,k=0;k<l.length;l.length===s||(0,A.i)(l),++k){j=l[k]
q=A.p_(r,r)
q.v(0,a)
q.m(0,"stops",g.h(0,j))
h.push(A.ph(q))}return new A.lS(l,h)}h=A.b([],t.V)
for(s=l.length,r=t.O,k=0;k<l.length;l.length===s||(0,A.i)(l),++k){j=l[k]
h.push(A.ph(A.j4(["type",a.h(0,"type"),"property",a.h(0,"property"),"default",a.h(0,"default"),"colorSpace",a.h(0,i),"stops",g.h(0,j)],r,r)))}s=A.C(a.h(0,"base"))
if(s==null)s=1
return A.pz(new A.lT(),l,h,s,null,!1,A.dF(a.h(0,i)))},
z:function z(a,b){var _=this
_.a=0
_.b=a
_.c=""
_.e=b
_.w=_.f=null},
mr:function mr(a,b){this.a=a
this.b=b},
nL:function nL(a){this.a=a},
nJ:function nJ(a,b){this.a=a
this.b=b},
nK:function nK(a){this.a=a},
ml:function ml(a){this.a=a},
my:function my(){},
mz:function mz(){},
mA:function mA(a){this.a=a},
mw:function mw(){},
mx:function mx(a){this.a=a},
m6:function m6(){},
lY:function lY(a){this.a=a},
lZ:function lZ(a){this.a=a},
m_:function m_(a){this.a=a},
m0:function m0(a){this.a=a},
m1:function m1(a,b,c){this.a=a
this.b=b
this.c=c},
m2:function m2(a,b,c){this.a=a
this.b=b
this.c=c},
m3:function m3(a,b,c){this.a=a
this.b=b
this.c=c},
m4:function m4(a,b,c){this.a=a
this.b=b
this.c=c},
m5:function m5(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
o5:function o5(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
lM:function lM(){},
m9:function m9(a){this.a=a},
ma:function ma(){},
mb:function mb(a,b){this.a=a
this.b=b},
mc:function mc(){},
md:function md(a,b,c){this.a=a
this.b=b
this.c=c},
me:function me(){},
m8:function m8(){},
mf:function mf(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
mg:function mg(a,b,c){this.a=a
this.b=b
this.c=c},
lS:function lS(a,b){this.a=a
this.b=b},
lT:function lT(){},
rI(a){var s=t.J
return A.bq(A.p1(new A.aq(a),s.i("c(j.E)").a(new A.mp()),s.i("j.E"),t.S),0,null)},
px(a,b,c){var s,r
if(typeof b=="number"&&typeof c=="number")s=B.c.a6(b,c)
else if(typeof b=="string"&&typeof c=="string")s=B.d.a6(b,c)
else return!1
switch(a){case"<":r=s<0
break
case"<=":r=s<=0
break
case">":r=s>0
break
default:r=s>=0
break}return r},
xm(d5,d6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1=null,d2=new A.mE(d6),d3=new A.mD(d6),d4=new A.nH(d2)
if("literal"===d5){s=J.n(d6)
return A.ar(s.gB(d6)?d1:s.gt(d6))}if("get"===d5){s=J.n(d6)
r=s.gB(d6)?d1:s.gt(d6)
if(d6.length>1){q=d2.$1(0)
return new A.mF(d2.$1(1),q)}if(typeof r=="string")return new A.mG(r)
return new A.mH(d2.$1(0))}if("has"===d5){s=J.n(d6)
r=s.gB(d6)?d1:s.gt(d6)
if(d6.length>1){q=d2.$1(0)
return new A.mS(d2.$1(1),q)}return new A.n2(r)}if("!has"===d5){s=J.n(d6)
return new A.nd(s.gB(d6)?d1:s.gt(d6))}if("properties"===d5)return new A.no()
if("id"===d5)return new A.nz()
if("accumulated"===d5)return new A.nD()
if("feature-state"===d5){s=J.n(d6)
r=s.gB(d6)?d1:s.gt(d6)
if(typeof r=="string")return new A.nE(r)
return new A.nF(d2.$1(0))}if("$transition"===d5){p=d2.$1(0)
o=d2.$1(1)
s=t.O
n=A.C(A.oU(d6,2,s))
if(n==null)n=0
m=A.C(A.oU(d6,3,s))
if(m==null)m=0
l=A.C(A.oU(d6,4,s))
return new A.mI(m,n,l==null?0:l,o,p)}if("$images"===d5)return new A.mJ(d3.$0())
if("semiliteral"===d5){s=J.n(d6)
k=s.gB(d6)?d1:s.gt(d6)
if(!t.j.b(k))return A.ar(k)
s=A.b([],t.V)
for(j=J.B(k);j.l();)s.push(A.t(j.gn()))
return new A.mK(s)}if("let"===d5){i=A.A(t.N,t.u)
for(s=J.n(d6),h=0;g=h+2,g<d6.length;h=g){if(!(h>=0&&h<d6.length))return A.a(d6,h)
j=A.u(d6[h])
f=h+1
if(!(f>=0&&f<d6.length))return A.a(d6,f)
i.m(0,j,A.t(d6[f]))}B.a.j($.f9,i)
try{s=s.gB(d6)?A.ar(d1):A.t(s.gE(d6))
return s}finally{if(0>=$.f9.length)return A.a($.f9,-1)
$.f9.pop()}}if("var"===d5){for(s=A.D($.f9).i("aK<1>"),j=new A.aK($.f9,s),j=new A.a1(j,j.gk(0),s.i("a1<V.E>")),f=J.n(d6),s=s.i("V.E");j.l();){e=j.d
if(e==null)e=s.a(e)
d=e.h(0,f.gB(d6)?"":A.u(f.gt(d6)))
if(d!=null)return d}return A.ar(d1)}if("heatmap-density"===d5||"line-progress"===d5)return new A.mL()
if("image"===d5)return d2.$1(0)
if("is-supported-script"===d5)return A.ar(!0)
if("resolved-locale"===d5)return new A.mM(d2.$1(0))
if("within"===d5){s=J.n(d6)
c=A.qB(s.gB(d6)?d1:s.gt(d6))
if(c==null)return A.ar(!1)
s=[d5]
B.a.v(s,d6)
return A.rM("$geometry:"+B.t.aB(s,d1),new A.mN(c))}if("distance"===d5){s=J.n(d6)
c=A.qB(s.gB(d6)?d1:s.gt(d6))
if(c==null)return A.ar(d1)
s=[d5]
B.a.v(s,d6)
return A.rM("$geometry:"+B.t.aB(s,d1),new A.mO(c))}if("typeof"===d5)return new A.mP(d2.$1(0))
if("to-rgba"===d5)return new A.mQ(d2.$1(0))
if("slice"===d5){b=d2.$1(0)
p=d2.$1(1)
return new A.mR(b,p,d6.length>2?d2.$1(2):d1)}if("index-of"===d5){a=d2.$1(0)
a0=d2.$1(1)
return new A.mT(a0,a,d6.length>2?d2.$1(2):d1)}if("sin"===d5)return d4.$1(A.yb())
if("cos"===d5)return d4.$1(A.y9())
if("tan"===d5)return d4.$1(A.yd())
if("asin"===d5)return d4.$1(A.y7())
if("acos"===d5)return d4.$1(A.y6())
if("atan"===d5)return d4.$1(A.y8())
if("zoom"===d5)return new A.mU()
if("geometry-type"===d5)return new A.mV()
if("!"===d5)return new A.mW(d2.$1(0))
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
b0=!1}if(s&&d6.length>2)return new A.mX(d2.$1(0),d2.$1(1),d2.$1(2),d5)
if("collator"===d5){s=J.n(d6)
if(s.gJ(d6)&&t.f.b(s.gt(d6))){s=s.gt(d6)
s.toString
t.f.a(s)
b1=s}else b1=B.X
return new A.mY(A.t(b1.h(0,"case-sensitive")),A.t(b1.h(0,"diacritic-sensitive")),A.t(b1.h(0,"locale")))}if(a1)return new A.mZ(d2.$1(0),d2.$1(1))
if(a9)return new A.n_(d2.$1(0),d2.$1(1))
s=!0
if(!(b0?a2:"<"===d5))if(!(a4?a3:"<="===d5))if(!(a6?a5:">"===d5))s=a8?a7:">="===d5
if(s)return new A.n0(d5,d2.$1(0),d2.$1(1))
if("all"===d5)return new A.n1(d3.$0())
if("any"===d5)return new A.n3(d3.$0())
if("none"===d5)return new A.n4(d3.$0())
if("case"===d5)return new A.n5(d3.$0())
if("match"===d5){b=d2.$1(0)
b2=A.A(t.O,t.u)
for(s=t.j,h=1;j=h+1,j<d6.length;h+=2){if(!(j>=0&&j<d6.length))return A.a(d6,j)
b3=A.t(d6[j])
if(!(h>=0&&h<d6.length))return A.a(d6,h)
b4=d6[h]
j=J.B(s.b(b4)?b4:[b4])
while(j.l())b2.m(0,j.gn(),b3)}if(h<d6.length){if(!(h>=0&&h<d6.length))return A.a(d6,h)
b5=A.t(d6[h])}else b5=A.ar(d1)
return new A.n6(b2,b,b5)}if("coalesce"===d5)return new A.n7(d3.$0())
if("step"===d5){b=d2.$1(0)
b6=d2.$1(1)
b7=A.b([],t.n)
b8=A.b([],t.V)
for(h=2;s=h+1,s<d6.length;h+=2){if(!(h>=0&&h<d6.length))return A.a(d6,h)
j=d6[h]
if(!(typeof j=="number"))if(typeof j=="string")j=A.L(j)
else if(A.E(j))j=j?1:0
else j=d1
B.a.j(b7,j==null?0:j)
if(!(s>=0&&s<d6.length))return A.a(d6,s)
B.a.j(b8,A.t(d6[s]))}return new A.n8(b,b6,b7,b8)}if("interpolate"===d5||"interpolate-hcl"===d5||"interpolate-lab"===d5){s=J.n(d6)
if(s.gJ(d6)&&t.j.b(s.gt(d6))){s=s.gt(d6)
s.toString
t.j.a(s)
b9=s}else b9=B.ao
s=t.n
b7=A.b([],s)
b8=A.b([],t.V)
for(h=2;j=h+1,j<d6.length;h+=2){if(!(h>=0&&h<d6.length))return A.a(d6,h)
f=d6[h]
if(!(typeof f=="number"))if(typeof f=="string")f=A.L(f)
else if(A.E(f))f=f?1:0
else f=d1
B.a.j(b7,f==null?0:f)
if(!(j>=0&&j<d6.length))return A.a(d6,j)
B.a.j(b8,A.t(d6[j]))}j=d2.$1(1)
switch(d5){case"interpolate-hcl":f="hcl"
break
case"interpolate-lab":f="lab"
break
default:f=d1
break}e=J.Q(b9)
if(J.l(e.gt(b9),"exponential")&&e.gk(b9)>1){c0=A.C(e.h(b9,1))
if(c0==null)c0=1}else c0=1
c1=J.l(e.gt(b9),"geometric")
if(J.l(e.gt(b9),"cubic-bezier")&&e.gk(b9)>4){s=A.b([],s)
for(h=1;h<5;++h){c2=e.h(b9,h)
if(!(typeof c2=="number"))if(typeof c2=="string")c2=A.L(c2)
else if(A.E(c2))c2=c2?1:0
else c2=d1
s.push(c2==null?0:c2)}}else s=d1
return A.pz(j,b7,b8,c0,s,c1,f)}if("to-string"===d5)return new A.n9(d2.$1(0))
if("number-format"===d5){c3=d2.$1(0)
if(d6.length>1){if(1<0||1>=d6.length)return A.a(d6,1)
s=t.f.b(d6[1])}else s=!1
if(s){if(1<0||1>=d6.length)return A.a(d6,1)
b1=t.f.a(d6[1])}else b1=B.X
return new A.na(c3,A.t(b1.h(0,"min-fraction-digits")),A.t(b1.h(0,"max-fraction-digits")))}if("split"===d5)return new A.nb(d2.$1(0),d2.$1(1))
if("join"===d5)return new A.nc(d2.$1(0),d2.$1(1))
if("hsl"===d5||"hsla"===d5)return new A.ne(d3.$0())
if("to-number"===d5)return new A.nf(d3.$0())
if("number"===d5||"string"===d5||"boolean"===d5||"object"===d5)return new A.ng(d3.$0(),d5)
if("to-boolean"===d5)return new A.nh(d2.$1(0))
if("to-color"===d5)return new A.ni(d3.$0())
if("array"===d5){s=J.n(d6)
if(d6.length>1&&typeof s.gt(d6)=="string"){j=s.gt(d6)
j.toString
A.P(j)
c4=j}else c4=d1
if(d6.length>2){if(1<0||1>=d6.length)return A.a(d6,1)
j=A.C(d6[1])
c5=j==null?d1:B.c.N(j)}else c5=d1
return new A.nj(s.gB(d6)?A.ar(d1):A.t(s.gE(d6)),c5,c4)}if("format"===d5){c6=A.b([],t.hc)
for(s=d6.length,j=t.j,f=t.f,e=t.N,c0=t.u,c7=0;c7<d6.length;d6.length===s||(0,A.i)(d6),++c7){c3=d6[c7]
if(f.b(c3)){c1=c6.length
if(c1===0)continue
if(0>=c1)return A.a(c6,-1)
c8=c6.pop()
c1=A.A(e,c0)
for(c2=c3.ga7(),c2=c2.gp(c2);c2.l();){c9=c2.gn()
q=c9.a
k=c9.b
c1.m(0,A.u(q),A.t(k))}B.a.j(c6,new A.M(c8.a,c1,c8.c))}else{c1=A.t(c3)
if(j.b(c3)){c2=J.n(c3)
c2=c2.gJ(c3)&&J.l(c2.gt(c3),"image")}else c2=!1
B.a.j(c6,new A.M(c1,B.ct,c2))}}return new A.nk(c6)}if("concat"===d5){s=A.b([],t.V)
for(j=d6.length,f=t.f,c7=0;c7<d6.length;d6.length===j||(0,A.i)(d6),++c7){c3=d6[c7]
if(!f.b(c3))s.push(A.t(c3))}return new A.nl(s)}if("upcase"===d5)return new A.nm(d2.$1(0))
if("downcase"===d5)return new A.nn(d2.$1(0))
if("+"===d5||"*"===d5||"min"===d5||"max"===d5)return new A.np(d5,d3.$0())
if("-"===d5||"/"===d5||"%"===d5||"^"===d5){c3=d2.$1(0)
if(d6.length===1)return d4.$1(new A.nq())
return new A.nr(c3,d2.$1(1),d5)}if("round"===d5)return d4.$1(new A.ns())
if("floor"===d5)return d4.$1(new A.nt())
if("ceil"===d5)return d4.$1(new A.nu())
if("abs"===d5)return d4.$1(new A.nv())
if("sqrt"===d5)return d4.$1(A.yc())
if("ln"===d5)return d4.$1(A.ya())
if("log10"===d5)return d4.$1(new A.nw())
if("log2"===d5)return d4.$1(new A.nx())
if("e"===d5)return A.ar(2.718281828459045)
if("pi"===d5)return A.ar(3.141592653589793)
if("ln2"===d5)return A.ar(0.6931471805599453)
if("length"===d5)return new A.ny(d2.$1(0))
if("in"===d5){a=d2.$1(0)
return new A.nA(d2.$1(1),a)}if("at"===d5){d0=d2.$1(0)
return new A.nB(d2.$1(1),d0)}if("rgb"===d5||"rgba"===d5)return new A.nC(d3.$0())
return A.ar(d1)},
wc(a,b,c){var s,r,q,p,o,n,m,l,k,j
if(!isFinite(a)){if(isNaN(a))s="NaN"
else s=a<0?"-\u221e":"\u221e"
return s}s=Math.abs(a)
r=B.c.q(s)
q=B.d.aT(r,".")
p=!B.d.u(r,"e")&&r.length-q-1<=c?r:B.c.iV(s,Math.min(c,20))
if(B.d.u(p,".")){s=B.d.aT(p,".")
o=new A.e(B.d.a2(p,0,s),B.d.ao(p,s+1))}else o=new A.e(p,"")
n=o.a
m=o.b
for(;;){s=m.length
if(!(s>b&&B.d.cC(m,"0")))break
m=B.d.a2(m,0,s-1)}m=B.d.iG(m,b,"0")
l=new A.bg("")
for(s=n.length,k=0,j="";k<s;++k){if(k>0&&B.b.P(s-k,3)===0)j=l.a=j+","
j+=n[k]
l.a=j}p=m.length===0?l.q(0):l.q(0)+"."+m
return a<0&&B.d.u(p,A.fZ("[1-9]"))?"-"+p:p},
w4(a){var s,r
if(a<=0)return 0
if(a>=1)return 1
s=a*a
r=s*a
return 4*(a<0.5?r:3*(a-s)+r-0.75)},
rj(a,b,c){var s,r,q,p,o,n
if(typeof a=="number"&&typeof b=="number")return a+(b-a)*c
s=t.j
if(s.b(a)&&s.b(b)&&J.S(a)===J.S(b)){s=[]
for(r=J.n(a),q=J.n(b),p=0;p<r.gk(a);++p)s.push(A.rj(r.h(a,p),q.h(b,p),c))
return s}o=A.aS(a)
n=A.aS(b)
if(o!=null&&n!=null)return A.qM(o,n,c)
return c<1?a:b},
rl(a){var s,r,q,p,o
if(t.j.b(a)){s=J.n(a)
s=(s.gk(a)===3||s.gk(a)===4)&&s.a4(a,new A.lQ())}else s=!1
if(s){s=A.b([],t.n)
for(r=J.B(a);r.l();)s.push(A.ac(r.gn()))
if(A.aU(s,0,A.bv(3,"count",t.S),t.i).aj(0,new A.lR()))return null
r=s.length
q=r>3?s[3]:1
if(q<0||q>1)return null
if(0>=r)return A.a(s,0)
p=s[0]
if(1>=r)return A.a(s,1)
o=s[1]
if(2>=r)return A.a(s,2)
return new A.af(p/255,o/255,s[2]/255,q)}return A.aS(a)},
cS:function cS(a,b,c){this.a=a
this.b=b
this.c=c},
mp:function mp(){},
mE:function mE(a){this.a=a},
mD:function mD(a){this.a=a},
nH:function nH(a){this.a=a},
nI:function nI(a,b){this.a=a
this.b=b},
mF:function mF(a,b){this.a=a
this.b=b},
mG:function mG(a){this.a=a},
mH:function mH(a){this.a=a},
mS:function mS(a,b){this.a=a
this.b=b},
n2:function n2(a){this.a=a},
nd:function nd(a){this.a=a},
no:function no(){},
nz:function nz(){},
nD:function nD(){},
nE:function nE(a){this.a=a},
nF:function nF(a){this.a=a},
mI:function mI(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
mJ:function mJ(a){this.a=a},
mC:function mC(){},
mK:function mK(a){this.a=a},
mL:function mL(){},
mM:function mM(a){this.a=a},
mN:function mN(a){this.a=a},
mO:function mO(a){this.a=a},
mP:function mP(a){this.a=a},
mQ:function mQ(a){this.a=a},
mR:function mR(a,b,c){this.a=a
this.b=b
this.c=c},
nG:function nG(a){this.a=a},
mT:function mT(a,b,c){this.a=a
this.b=b
this.c=c},
mU:function mU(){},
mV:function mV(){},
mW:function mW(a){this.a=a},
mX:function mX(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
mY:function mY(a,b,c){this.a=a
this.b=b
this.c=c},
mZ:function mZ(a,b){this.a=a
this.b=b},
n_:function n_(a,b){this.a=a
this.b=b},
n0:function n0(a,b,c){this.a=a
this.b=b
this.c=c},
n1:function n1(a){this.a=a},
n3:function n3(a){this.a=a},
n4:function n4(a){this.a=a},
n5:function n5(a){this.a=a},
n6:function n6(a,b,c){this.a=a
this.b=b
this.c=c},
n7:function n7(a){this.a=a},
n8:function n8(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
n9:function n9(a){this.a=a},
na:function na(a,b,c){this.a=a
this.b=b
this.c=c},
nb:function nb(a,b){this.a=a
this.b=b},
nc:function nc(a,b){this.a=a
this.b=b},
ne:function ne(a){this.a=a},
nf:function nf(a){this.a=a},
ng:function ng(a,b){this.a=a
this.b=b},
nh:function nh(a){this.a=a},
ni:function ni(a){this.a=a},
nj:function nj(a,b,c){this.a=a
this.b=b
this.c=c},
mB:function mB(a){this.a=a},
nk:function nk(a){this.a=a},
nl:function nl(a){this.a=a},
nm:function nm(a){this.a=a},
nn:function nn(a){this.a=a},
np:function np(a,b){this.a=a
this.b=b},
nq:function nq(){},
nr:function nr(a,b,c){this.a=a
this.b=b
this.c=c},
ns:function ns(){},
nt:function nt(){},
nu:function nu(){},
nv:function nv(){},
nw:function nw(){},
nx:function nx(){},
ny:function ny(a){this.a=a},
nA:function nA(a,b){this.a=a
this.b=b},
nB:function nB(a,b){this.a=a
this.b=b},
nC:function nC(a){this.a=a},
lQ:function lQ(){},
lR:function lR(){},
xZ(a){var s,r,q,p,o,n,m,l,k
if(!(a instanceof A.bn))return new A.e(A.hV(J.bj(a==null?"":a)),null)
s=a.a
if(B.a.a4(s,new A.o9()))return new A.e(A.hV(a.q(0)),null)
for(r=0,q="";p=s.length,r<p;++r){o=s[r].b
if(r===0)o=B.d.iW(o)
if(r===s.length-1)o=B.d.iX(o)
q=q+A.O(57344)+A.O(57600+r)
if(!(r<s.length))return A.a(s,r)
q=s[r].a==null?q+o:q+A.O(57599)}n=[]
for(m=0;m<s.length;s.length===p||(0,A.i)(s),++m){l=s[m]
k=l.e
k=k==null?null:(B.c.M(B.c.H(k.d,0,1)*255)<<24|B.c.M(B.c.H(k.a,0,1)*255)<<16|B.c.M(B.c.H(k.b,0,1)*255)<<8|B.c.M(B.c.H(k.c,0,1)*255))>>>0
n.push([l.c,l.d,k,l.f,l.a])}return new A.e(q.charCodeAt(0)==0?q:q,n)},
og(a){var s,r,q,p
if(!B.d.u(a,A.O(57344)))return a
s=new A.bg("")
r=A.W(new A.aq(a),t.J.i("j.E"))
for(q=0;q<r.length;++q){p=r[q]
if(p===57344){++q
continue}if(p===57599)continue
p=A.O(p)
s.a+=p}p=s.a
return p.charCodeAt(0)==0?p:p},
hV(a){var s,r,q,p
if(!B.d.u(a,"\n"))return B.d.bi(a)
s=A.b([],t.s)
for(r=a.split("\n"),q=r.length,p=0;p<q;++p)s.push(B.d.bi(r[p]))
return B.a.a4(s,new A.oL())?"":B.a.ab(s,"\n")},
bD:function bD(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
bn:function bn(a){this.a=a},
im:function im(){},
o9:function o9(){},
oL:function oL(){},
qB(a){var s=A.b([],t.n),r=A.b([],t.b),q=A.b([],t.ot),p=new A.fV(s,r,q)
p.cg(a)
return s.length===0&&r.length===0&&q.length===0?null:p},
jy(a){var s,r,q,p=t.n,o=A.b([],p),n=t.j
if(n.b(a))for(s=J.B(a);s.l();){r=s.gn()
if(n.b(r)){q=J.n(r)
q=q.gk(r)>=2&&typeof q.h(r,0)=="number"&&typeof q.h(r,1)=="number"}else q=!1
if(q){q=J.n(r)
B.a.v(o,A.b([A.ac(q.h(r,0)),A.ac(q.h(r,1))],p))}}return o},
uM(a,b,c,d,e,f,g,h){var s=new A.jx(),r=s.$6(e,f,g,h,a,b),q=s.$6(e,f,g,h,c,d),p=s.$6(a,b,c,d,e,f),o=s.$6(a,b,c,d,g,h)
return r*q<0&&p*o<0},
qA(a,b,c){var s,r,q,p,o,n,m,l,k
for(s=J.n(c),r=s.gk(c)-2,q=!1,p=0;p<s.gk(c);o=p+2,r=p,p=o){n=s.h(c,p)
m=s.h(c,p+1)
l=s.h(c,r)
k=s.h(c,r+1)
if(m>b!==k>b&&a<(l-n)*(b-m)/(k-m)+n)q=!q}return q},
uL(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=J.n(a)
if(e.gk(a)<2||J.S(b)<2)return 1/0
s=e.gk(a)<4?1:e.gk(a)-2
r=J.n(b)
q=r.gk(b)<4?1:r.gk(b)-2
for(p=1/0,o=0;o<s;o+=2){n=e.h(a,o)*c
m=e.h(a,o+1)
l=e.gk(a)<4?n:e.h(a,o+2)*c
k=e.gk(a)<4?m:e.h(a,o+3)
for(j=0;j<q;j+=2){i=r.h(b,j)*c
h=r.h(b,j+1)
g=r.gk(b)<4?i:r.h(b,j+2)*c
f=A.uN(n,m,l,k,i,h,g,r.gk(b)<4?h:r.h(b,j+3))
if(f<p)p=f}}return p},
uN(a,b,c,d,e,f,g,h){var s=new A.jz(),r=s.$6(e,f,g,h,a,b),q=s.$6(e,f,g,h,c,d),p=s.$6(a,b,c,d,e,f),o=s.$6(a,b,c,d,g,h)
if(!(r>0&&q<0))s=r<0&&q>0
else s=!0
if(s)if(!(p>0&&o<0))s=p<0&&o>0
else s=!0
else s=!1
if(s)return 0
return Math.min(Math.min(A.fW(a,b,e,f,g,h),A.fW(c,d,e,f,g,h)),Math.min(A.fW(e,f,a,b,c,d),A.fW(g,h,a,b,c,d)))},
fW(a,b,c,d,e,f){var s=e-c,r=f-d,q=s*s+r*r,p=q===0?0:B.c.H(((a-c)*s+(b-d)*r)/q,0,1),o=a-c-s*p,n=b-d-r*p
return Math.sqrt(o*o+n*n)},
fV:function fV(a,b,c){this.a=a
this.b=b
this.c=c},
jB:function jB(){},
jx:function jx(){},
jA:function jA(a,b){this.a=a
this.b=b},
jz:function jz(){},
tU(a){var s,r,q,p
switch(a.h(0,"encoding")){case"terrarium":s=B.b8
break
case"custom":s=A.C(a.h(0,"redFactor"))
if(s==null)s=1
r=A.C(a.h(0,"greenFactor"))
if(r==null)r=1
q=A.C(a.h(0,"blueFactor"))
if(q==null)q=1
p=A.C(a.h(0,"baseShift"))
s=new A.dV(s,r,q,p==null?0:p)
break
default:s=B.b7
break}return s},
bo:function bo(){},
fF:function fF(){},
he:function he(){},
fU:function fU(){},
fE:function fE(){},
dV:function dV(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fn:function fn(){},
h8:function h8(){},
k0:function k0(a,b,c,d,e,f,g,h,i,j){var _=this
_.a=a
_.c=b
_.d=c
_.e=d
_.f=e
_.r=f
_.w=g
_.x=h
_.y=i
_.z=j
_.Q=-1
_.as=null},
k3:function k3(a,b){this.a=a
this.b=b},
k2:function k2(a,b){this.a=a
this.b=b},
k1:function k1(a,b,c){this.a=a
this.b=b
this.c=c},
ua(a){var s,r,q,p,o=t.f.b(a)?a:B.aQ,n=new A.z(B.e,B.e),m=o.h(0,"position"),l=A.t(m==null?A.b([1.15,210,30],t.g2):m).$1(n)
m=o.h(0,"intensity")
m=A.C(A.t(m==null?0.5:m).$1(n))
if(m==null)m=0.5
s=o.h(0,"color")
A.aS(A.t(s==null?"#ffffff":s).$1(n))
if(t.j.b(l)&&J.S(l)===3){s=A.b([],t.n)
for(r=J.B(l);r.l();){q=r.gn()
if(typeof q=="number")p=q
else if(typeof q=="string")p=A.L(q)
else if(A.E(q))p=q?1:0
else p=null
s.push(p==null?0:p)}}J.l(o.h(0,"anchor"),"map")
return new A.ie(m)},
ib:function ib(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
ie:function ie(a){this.a=a},
fx:function fx(){},
va(a){var s
A:{s=!0
if("symbol"===a||"heatmap"===a||"circle"===a||"line"===a)break A
if("fill"===a||"fill-extrusion"===a)break A
s=!1
break A}return s},
kH:function kH(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
kN:function kN(a){this.a=a},
kL:function kL(a,b){this.a=a
this.b=b},
kJ:function kJ(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
kK:function kK(){},
kI:function kI(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
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
kM:function kM(a,b){this.a=a
this.b=b},
q0(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r){return new A.by(i,q,a,b,c,d,e,g,o,n,h,l,j,k,m,p,f,r)},
qv(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1,a2){return new A.dm(r,d,f,j,l,b,n,m)},
uj(a,b,c){var s,r,q,p,o=a==null?B.cn:a,n=t.n,m=A.b([],n)
if(t.j.b(o)){s=J.n(o)
s=s.gk(o)>4&&J.l(s.h(o,0),"interpolate")&&A.o8(s.h(o,1),B.ao)&&A.o8(s.h(o,2),B.aO)}else s=!1
if(s)for(s=J.n(o),r=3;r+1<s.gk(o);r+=2){q=s.h(o,r)
if(!(typeof q=="number"))if(typeof q=="string"){p=A.L(q)
q=p}else{if(A.E(q))p=q?1:0
else p=null
q=p}if(q!=null)B.a.j(m,B.c.H(q,0,1))}if(m.length<2){B.a.a1(m)
n=A.b([],n)
for(r=0;r<=8;++r)n.push(r/8)
B.a.v(m,n)}A.t(o)
return new A.iL()},
qQ(a){var s=A.v6(t.f.b(a)?a.h(0,"type"):null)
return s==null||s.length===0||B.a.a4(s,new A.k5())?B.eG:new A.h3(s)},
k4(a){var s
switch(a){case"mercator":s=0
break
case"vertical-perspective":s=1
break
default:s=null
break}return s},
v6(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=null,d=J.as(a)
if(d.D(a,"globe"))return B.c7
s=A.k4(a)
if(s!=null)return A.b([new A.e(0,s)],t.I)
r=t.j
q=r.b(a)
p=!1
if(q)if(d.gk(a)>=3)if("interpolate"===d.h(a,0)){o=d.h(a,2)
if(r.b(o)){t.W.a(o)
n=J.n(o)
if(n.gk(o)===1)p="zoom"===n.h(o,0)}}if(p){m=d.W(a,3)
l=A.b([],t.I)
for(k=0;d=k+1,r=m.length,d<r;k+=2){if(!(k<r))return A.a(m,k)
j=m[k]
i=A.k4(m[d])
if(typeof j!="number"||i==null)return e
B.a.j(l,new A.e(j,i))}return l}p=!1
if(q)if(d.gk(a)>=3)if("step"===d.h(a,0)){h=d.h(a,1)
if(r.b(h)){t.W.a(h)
r=J.n(h)
if(r.gk(h)===1)r="zoom"===r.h(h,0)
else r=p}else r=p}else r=p
else r=p
else r=p
if(r){g=d.h(a,2)
m=d.W(a,3)
f=A.k4(g)
if(f==null)return e
l=A.b([new A.e(-1/0,f)],t.I)
for(k=0;d=k+1,r=m.length,d<r;k+=2){if(!(k<r))return A.a(m,k)
j=m[k]
i=A.k4(m[d])
if(typeof j!="number"||i==null)return e
B.a.j(l,new A.e(j-1e-9,B.a.gE(l).b))
B.a.j(l,new A.e(j,i))}return l}return e},
xD(a){var s,r
A:{s=!1
if(typeof a=="number"){if(isFinite(a))s=a===(a<0?Math.ceil(a):Math.floor(a))
r=a}else r=null
if(s){s=B.b.q(J.pS(r))
break A}s=A.u(a)
break A}return s},
cx:function cx(a,b){this.a=a
this.b=b},
by:function by(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r){var _=this
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
db:function db(a,b){this.a=a
this.b=b},
bJ:function bJ(){},
fO:function fO(){},
bB:function bB(a,b,c,d,e,f,g){var _=this
_.cx=a
_.db=b
_.dx=c
_.a=d
_.b=e
_.c=f
_.d=g},
dm:function dm(a,b,c,d,e,f,g,h){var _=this
_.cy=a
_.dy=b
_.fx=c
_.id=d
_.a=e
_.b=f
_.c=g
_.d=h},
d6:function d6(a,b,c,d,e,f,g){var _=this
_.db=a
_.dx=b
_.dy=c
_.a=d
_.b=e
_.c=f
_.d=g},
cE:function cE(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
iL:function iL(){},
fg:function fg(){},
cn:function cn(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
p5:function p5(){},
h3:function h3(a){this.a=a},
k5:function k5(){},
k6:function k6(a,b,c,d,e,f,g,h,i){var _=this
_.c=a
_.e=b
_.ax=c
_.ay=d
_.ch=e
_.CW=f
_.cy=g
_.dy=h
_.fr=i},
hQ(a){var s,r,q=A.C(a)
A:{if(q!=null){s=isFinite(q)
r=q}else{r=null
s=!1}if(s){s=J.pS(r)
break A}s=null
break A}return s},
cv(a){var s,r
try{s=B.t.aB(a,null)
return s}catch(r){if(A.aG(r) instanceof A.dj)return A.u(a)
else throw r}},
us(a){var s,r,q,p,o,n,m,l=a.h(0,"id")
l=A.u(l==null?"":l)
s=a.h(0,"type")
r=a.h(0,"paint")
q=t.f
r=q.b(r)?r:B.X
p=a.h(0,"layout")
q=q.b(p)?p:B.X
o=A.C(a.h(0,"minzoom"))
A:{if(typeof o=="number"){p=o>0
n=o}else{n=null
p=!1}if(p){p=n
break A}p=-24
break A}m=A.C(a.h(0,"maxzoom"))
return new A.iZ(l,s,a,r,q,p,m==null?30:m)},
hT(a,b){var s,r,q=A.bd(t.N)
for(s=b.length,r=0;r<b.length;b.length===s||(0,A.i)(b),++r)A.c4(a.h(0,b[r]),q)
return q},
t3(a){var s,r
A:{s=t.j.b(a)
if(s){r=J.n(a)
r=r.gk(a)>=1&&"feature-state"===r.h(a,0)}else r=!1
if(r){s=!0
break A}if(s){s=J.oM(a,A.yA())
break A}s=!1
break A}return s},
c4(a,b){var s,r,q
if(t.j.b(a)){s=J.n(a)
if(s.gk(a)===2)r=(J.l(s.h(a,0),"get")||J.l(s.h(a,0),"has"))&&typeof s.h(a,1)=="string"
else r=!1
if(r)b.j(0,A.P(s.h(a,1)))
if(s.gJ(a))r=J.l(s.h(a,0),"feature-state")||J.l(s.h(a,0),"id")
else r=!1
if(r)b.j(0,"$id")
if(s.gJ(a))r=J.l(s.h(a,0),"within")||J.l(s.h(a,0),"distance")
else r=!1
if(r)b.j(0,"$geometry:"+B.t.aB(a,null))
for(s=s.gp(a);s.l();)A.c4(s.gn(),b)}else if(t.f.b(a)){q=a.h(0,"property")
if(typeof q=="string")b.j(0,q)}},
xr(a){var s,r,q,p,o,n,m,l,k=null,j=t.j
if(!j.b(a)||J.S(a)!==4)return k
s=new Float64Array(8)
for(r=J.n(a),q=0;q<4;++q){p=r.h(a,q)
if(!j.b(p)||J.S(p)<2)return k
o=J.n(p)
n=o.h(p,0)
if(!(typeof n=="number"))if(typeof n=="string"){m=A.L(n)
n=m}else{if(A.E(n))m=n?1:0
else m=k
n=m}l=o.h(p,1)
if(!(typeof l=="number"))if(typeof l=="string"){o=A.L(l)
l=o}else{if(A.E(l))o=l?1:0
else o=k
l=o}if(n==null||l==null)return k
o=q*2
if(!(o<8))return A.a(s,o)
s[o]=(n+180)/360;++o
m=A.tb(l)
if(!(o<8))return A.a(s,o)
s[o]=m}return s},
yr(a){var s,r,q,p,o,n,m,l=null,k=t.j
if(k.b(a)){s=J.n(a)
s=s.gk(a)===2&&J.l(s.h(a,0),"literal")}else s=!1
r=s?J.R(a,1):a
if(k.b(r)){k=J.n(r)
k=k.gB(r)||k.gk(r)>4}else k=!0
if(k)return l
k=A.b([],t.nn)
for(s=J.B(r);s.l();){q=s.gn()
if(typeof q=="number")p=q
else if(typeof q=="string")p=A.L(q)
else if(A.E(q))p=q?1:0
else p=l
k.push(p==null?l:p)}if(B.a.u(k,l))return l
s=k.length
p=s>=1
o=p?k[0]:l
if(!p)throw A.f(A.bp("Pattern matching error"))
p=t.n
switch(s){case 1:o.toString
k=A.b([o,o,o,o],p)
break
case 2:o.toString
if(1>=s)return A.a(k,1)
k=k[1]
k.toString
p=A.b([o,k,o,k],p)
k=p
break
case 3:o.toString
if(1>=s)return A.a(k,1)
n=k[1]
n.toString
if(2>=s)return A.a(k,2)
k=k[2]
k.toString
p=A.b([o,n,k,n],p)
k=p
break
default:o.toString
if(1>=s)return A.a(k,1)
n=k[1]
n.toString
if(2>=s)return A.a(k,2)
m=k[2]
m.toString
if(3>=s)return A.a(k,3)
k=k[3]
k.toString
p=A.b([o,n,m,k],p)
k=p
break}return k},
J(a,b){var s,r,q=A.t(b)
if(a==null)return q
s=A.t(a)
if(typeof b=="string"&&A.aS(b)!=null){r=t.f.b(a)?a.h(0,"default"):null
return new A.nT(s,A.aS(r)!=null?r:null,q)}return new A.nU(s,q)},
xy(a){var s,r,q="viewport-y",p=new A.nS(a),o=a.h(0,"symbol-z-order")
if(o==null)o="auto"
s=J.as(o)
r=!s.D(o,q)&&a.h(0,"symbol-sort-key")!=null
if(!s.D(o,q))s=s.D(o,"auto")&&!r
else s=!0
if(s)p=p.$2("text-overlap","text-allow-overlap")||p.$2("icon-overlap","icon-allow-overlap")||J.l(a.h(0,"text-ignore-placement"),!0)||J.l(a.h(0,"icon-ignore-placement"),!0)
else p=!1
return p},
of(a,b){var s,r=a.h(0,b+"-overlap")
A:{if(typeof r=="string"){s=r
break A}s=J.l(a.h(0,b+"-allow-overlap"),!0)?"always":"never"
break A}return s},
xa(a,b){var s,r,q,p,o,n,m=t.j,l=null,k=!1,j=!1
if(m.b(a)){s=J.n(a)
if(s.gk(a)===2){k="literal"===s.h(a,0)
if(k){l=s.h(a,1)
j=m.b(l)}}}if(j){j=k?l:J.R(a,1)
t.W.a(j)
r=j}else r=a
if(m.b(r)&&J.S(r)>=2){q=A.b([],t.s)
p=A.b([],t.I)
for(j=J.n(r),o=0;s=o+1,s<j.gk(r);o+=2){n=j.h(r,o)
if(typeof n=="string"){B.a.j(q,n)
B.a.j(p,A.pD(j.h(r,s)))}}if(q.length!==0)return new A.e(q,p)}if(m.b(b)){m=J.pV(b,t.N)
m=A.W(m,m.$ti.i("j.E"))}else m=B.an
return new A.e(m,null)},
rV(a){var s
if(a!=null)if(t.j.b(a)){s=J.n(a)
s=s.gk(a)===2&&s.a4(a,new A.o6())}else s=!1
else s=!0
return s},
pD(a){var s,r,q=t.j
if(q.b(a)){s=J.n(a)
s=s.gk(a)===2&&J.l(s.h(a,0),"literal")}else s=!1
r=s?J.R(a,1):a
if(!q.b(r)||J.S(r)!==2)return B.aS
q=J.n(r)
s=A.C(q.h(r,0))
if(s==null)s=0
q=A.C(q.h(r,1))
return new A.e(s,q==null?0:q)},
rN(a,b){var s,r
if(t.j.b(a)){s=J.n(a)
s=s.gJ(a)&&s.a4(a,new A.mu())}else s=!1
if(s){s=A.b([],t.V)
for(r=J.B(a);r.l();)s.push(A.t(r.gn()))
return s}return A.b([A.t(a==null?b:a)],t.V)},
t_(a,b){var s,r,q,p,o=t.j.b(a)?a:[a],n=t.n,m=A.b([],n)
for(s=J.B(o);s.l();){r=s.gn()
if(typeof r=="number")q=r
else if(typeof r=="string"){p=A.L(r)
q=p}else{if(A.E(r))p=r?1:0
else p=null
q=p}if(q!=null)m.push(q)}return m.length===0?A.b([b],n):m},
xu(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=A.b([],t.lN),e=null,d=!1
if(t.f.b(a)){s=a.h(0,"stops")
if(s==null)r=a.K("stops")
else r=!0
if(r)if(t.j.b(s)){d=a.h(0,"property")==null
e=s}}if(d)for(d=J.B(e),r=t.j;d.l();){q=d.gn()
if(r.b(q)&&J.S(q)===2){p=J.n(q)
B.a.j(f,new A.e(p.h(q,0),p.h(q,1)))}}else{d=t.j
r=!1
if(d.b(a)){p=J.n(a)
if(p.gk(a)>=3)if("step"===p.h(a,0)){o=p.h(a,1)
if(d.b(o)){t.W.a(o)
d=J.n(o)
if(d.gk(o)===1)d="zoom"===d.h(o,0)
else d=r}else d=r}else d=r
else d=r}else d=r
if(d){d=J.n(a)
n=d.h(a,2)
m=d.W(a,3)
B.a.j(f,new A.e(-1/0,n))
for(l=0;d=l+1,r=m.length,d<r;l+=2){if(!(l<r))return A.a(m,l)
B.a.j(f,new A.e(m[l],m[d]))}}else return B.a4}k=A.b([],t.bU)
for(d=f.length,j=0;j<f.length;f.length===d||(0,A.i)(f),++j){r=f[j]
i=r.a
if(typeof i=="number")p=i==1/0||i==-1/0
else p=!1
if(p)h=i
else{if(typeof i=="number")p=i
else if(typeof i=="string")p=A.L(i)
else if(A.E(i))p=i?1:0
else p=null
h=p==null?null:p}g=A.nP(r.b)
if(h==null||g==null)return B.a4
B.a.j(k,new A.e(h,g))}return k},
xt(a){var s=A.b([],t.w)
new A.nN(s).$1(a)
return s},
wT(a,b){var s,r,q=a.length,p=b.length
if(q!==p)return!1
for(s=0;s<q;++s){r=a[s]
if(!(s<p))return A.a(b,s)
if(r!==b[s])return!1}return!0},
nP(a){var s,r,q,p,o,n,m,l=null,k=t.j
if(k.b(a)){s=J.n(a)
s=s.gk(a)===2&&J.l(s.h(a,0),"literal")}else s=!1
r=s?J.R(a,1):a
if(!k.b(r)||J.S(r)<2)return l
k=J.n(r)
s=k.gk(r)
q=new Float64Array(s)
for(p=0,o=0;o<s;++o){n=k.h(r,o)
if(!(typeof n=="number"))if(typeof n=="string"){m=A.L(n)
n=m}else{if(A.E(n))m=n?1:0
else m=l
n=m}if(n==null||n<0)return l
if(!(o<s))return A.a(q,o)
q[o]=n
if((o&1)===1)p+=n}return p<=0?l:q},
xF(a){var s,r,q,p,o,n,m
A:{s=t.j
r=s.b(a)
q=null
p=!1
o=!1
if(r){n=J.n(a)
if(n.gk(a)===2){p="literal"===n.h(a,0)
if(p){q=n.h(a,1)
s=s.b(q)}else s=o}else s=o}else s=o
if(s){s=p?q:J.R(a,1)
t.W.a(s)
break A}if(r){s=a
break A}s=B.a3
break A}r=A.b([],t.s)
for(s=J.B(s);s.l();){m=s.gn()
if(typeof m=="string")r.push(m)}return r},
xG(a){if(B.d.u(a,"black")||B.d.u(a,"heavy"))return 900
if(B.d.u(a,"extrabold")||B.d.u(a,"extra bold"))return 800
if(B.d.u(a,"semibold")||B.d.u(a,"semi bold")||B.d.u(a,"demi"))return 600
if(B.d.u(a,"bold"))return 700
if(B.d.u(a,"medium"))return 500
if(B.d.u(a,"light"))return 300
if(B.d.u(a,"thin"))return 100
return 400},
iZ:function iZ(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
kG:function kG(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
nT:function nT(a,b,c){this.a=a
this.b=b
this.c=c},
nU:function nU(a,b){this.a=a
this.b=b},
nS:function nS(a){this.a=a},
o6:function o6(){},
mu:function mu(){},
nN:function nN(a){this.a=a},
nO:function nO(a){this.a=a},
et(a){var s,r,q=a.h(0,"bounds"),p=A.C(a.h(0,"minzoom"))
p=p==null?null:B.c.N(p)
if(p==null)p=0
if(t.j.b(q)){s=J.n(q)
s=s.gk(q)===4&&s.a4(q,new A.ku())}else s=!1
if(s){s=A.b([],t.n)
for(r=J.B(q);r.l();)s.push(A.ac(r.gn()))}else s=null
return new A.kt(p,s,J.l(a.h(0,"scheme"),"tms"))},
kt:function kt(a,b,c){this.a=a
this.b=b
this.c=c},
ku:function ku(){},
kv:function kv(a){this.a=a},
kw:function kw(a){this.a=a},
dv:function dv(){},
cd:function cd(a,b,c,d,e,f,g){var _=this
_.e=a
_.f=b
_.r=c
_.w=d
_.x=e
_.b=f
_.c=g},
dt:function dt(a,b,c,d){var _=this
_.r=a
_.w=b
_.b=c
_.c=d},
v8(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=B.t.aB(a,null),b=a.h(0,"source")
b.toString
A.v(b)
s=a.h(0,"sourceLayer")
s.toString
A.P(s)
r=A.mv(a.h(0,"filter"))
q=a.h(0,"text")
A:{if(q==null){p=new A.ke()
break A}p=A.rO(q)
break A}o=a.h(0,"icon")
B:{if(o==null){n=null
break B}n=A.xl(o)
break B}m=A.t(a.h(0,"placement"))
l=a.h(0,"spacing")
l.toString
A.ac(l)
k=J.l(a.h(0,"textUpright"),!0)
j=J.l(a.h(0,"iconUpright"),!0)
i=a.h(0,"minZoom")
i.toString
A.ac(i)
h=a.h(0,"maxZoom")
h.toString
A.ac(h)
g=a.h(0,"sortKey")
C:{if(g==null){f=null
break C}f=A.t(g)
break C}e=a.h(0,"iconRotate")
e=A.t(e==null?0:e)
d=a.h(0,"paintKeys")
d.toString
return new A.kd(c,b,s,r,p,n,m,l,k,j,i,h,f,e,J.bx(t.j.a(d),t.N))},
kd:function kd(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
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
ke:function ke(){},
h5:function h5(a,b,c,d,e,f,g,h,i,j,k,l){var _=this
_.a=a
_.b=b
_.c=c
_.w=d
_.y=e
_.z=f
_.at=g
_.ax=h
_.ay=i
_.k2=j
_.k3=k
_.cE=l},
pW(a){var s,r,q,p,o,n=J.n(a),m=n.gk(a),l=new Uint8Array(m),k=A.b([],t.X),j=A.b([],t.lW)
for(s=0,r=0;r<=n.gk(a);++r){q=r===n.gk(a)
if(!q){m=A.b3(B.W,n.h(a,r))
if(!(m<23))return A.a(B.u,m)
m=B.u[m]!==B.C}else m=!1
if(m)continue
p=q?r:r+1
if(p>s||k.length===0){o=A.vn(a,s,p,null,l)
m=o.r
m===$&&A.h()
B.a.j(k,m)
B.a.v(j,o.j0())}s=p}return new A.i3(l,k,j)},
x1(a){var s,r,q,p
for(s=a.gp(a),r=0;s.l();){q=A.b3(B.W,s.gn())
if(!(q<23))return A.a(B.u,q)
p=B.u[q]
if(B.m===p||B.i===p||B.j===p){++r
continue}if(B.r===p&&r>0){--r
continue}if(B.C===p&&r===0)return!1
if(B.f===p&&r===0)return!1
if((B.h===p||B.F===p)&&r===0)return!0}return!1},
mk(a){var s
A:{if(B.f===a){s=B.f
break A}if(B.h===a||B.F===a||B.k===a||B.J===a){s=B.h
break A}s=null
break A}return s},
vn(a,b,c,d,e){var s,r,q,p=t.S,o=A.b([],t.de)
for(s=J.n(a),r=b;r<c;++r){q=A.b3(B.W,s.h(a,r))
if(!(q<23))return A.a(B.u,q)
o.push(B.u[q])}p=new A.lj(a,b,e,o,A.A(p,p),A.bd(p))
p.eV(a,b,c,d,e)
return p},
r2(a){var s
switch(a){case 9001:s=12296
break
case 9002:s=12297
break
default:s=a
break}return s},
y0(a,b,c){var s,r,q,p,o=A.W(b,t.S)
for(s=J.n(a),r=s.gk(a)-1;r>=0;--r){q=A.b3(B.W,s.h(a,r))
if(!(q<23))return A.a(B.u,q)
p=B.u[q]
q=!1
if(p!==B.O)if(p!==B.N)if(p!==B.C)if(p!==B.r)if(!(p===B.m||p===B.i||p===B.j))q=!(p===B.A||p===B.x||p===B.p||p===B.y||p===B.q||p===B.z)
if(q)break
B.a.m(o,r,c)}for(r=0;r<s.gk(a);++r){q=A.b3(B.W,s.h(a,r))
if(!(q<23))return A.a(B.u,q)
q=B.u[q]
if(q===B.A||q===B.x||q===B.p||q===B.y||q===B.q||q===B.z){if(r===0)q=c
else{q=r-1
if(!(q>=0&&q<o.length))return A.a(o,q)
q=o[q]}B.a.m(o,r,q)}}return A.rC(o,0)},
rC(a,b){var s,r,q,p,o,n,m,l,k,j,i=A.b([],t.lW)
for(s=0,r=1;q=a.length,r<=q;++r){if(r<q){p=a[r]
if(!(s>=0&&s<q))return A.a(a,s)
p=p===a[s]}else p=!1
if(p)continue
if(!(s>=0&&s<q))return A.a(a,s)
B.a.j(i,new A.fh(b+s,b+r,a[s]))
s=r}q=i.length
if(q===0)return i
for(o=0,n=127,m=0;m<q;++m){p=i[m].c
o=Math.max(o,p)
if((p&1)===1)n=Math.min(n,p)}for(l=o;l>=n;--l)for(r=0;q=i.length,r<q;++r){if(!(r>=0))return A.a(i,r)
if(i[r].c<l)continue
k=r
for(;;){if(!(k<q&&i[k].c>=l))break;++k}q=B.a.F(i,r,k)
p=A.D(q).i("aK<1>")
j=A.W(new A.aK(q,p),p.i("V.E"))
B.a.R(i,r,k,j)
r=k}return i},
fh:function fh(a,b,c){this.a=a
this.b=b
this.c=c},
i3:function i3(a,b,c){this.a=a
this.b=b
this.c=c},
dA:function dA(a,b,c){this.a=a
this.b=b
this.c=c},
lj:function lj(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.d=c
_.e=d
_.r=_.f=$
_.w=e
_.x=f},
lk:function lk(){},
wK(a){var s,r=a.a,q=a.ax
if(q>=200)return q
if((r&4294967040)>>>0===3584)if(q===0){if(r!==3633)s=r>=3636&&r<=3639||r===3655
else s=!0
if(s)return 232
if(r>=3660&&r<=3662)return 232
if(r!==3761)s=r>=3764&&r<=3767||r===3771
else s=!0
if(s)return 230
if(r===3788||r===3789)return 230
if(r===3772)return 220}else if(r===3642)return 222
s=B.cv.h(0,q)
return s==null?q:s},
qY(a,b){var s=a.a.r
s===$&&A.h()
s=s.i8(b,a.b).a
return new A.cR(s[0],s[1],s[2],s[3])},
yh(a,b,c){var s,r,q
for(s=0,r=1;q=b.length,r<=q;++r){if(r<q&&b[r].as)continue
A.w_(a,b,s,r,c)
s=r}},
w_(a,b,c,d,e){var s,r,q,p
if(d-c<2)return
for(s=c;s<d;++s){r=b.length
if(!(s>=0&&s<r))return A.a(b,s)
if(b[s].as)continue
q=s+1
for(;;){if(q<d){if(!(q<r))return A.a(b,q)
p=b[q].as}else p=!1
if(!p)break;++q}A.vN(a,b,s,q,e)
s=q-1}},
vN(a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1
if(!(a4>=0&&a4<a3.length))return A.a(a3,a4)
s=a3[a4]
r=A.qY(a2,s.b)
r.b=r.b+s.cy
r.a=0
q=r.c=a2.aR(s.b)
p=s.x
o=s.gcz()
n=!a6
if(n){m=0-s.ch
l=0-s.CW}else{m=0
l=0}k=r.a
j=r.b
i=r.d
h=new A.cR(k,j,q,i)
g=new A.cR(k,j,q,i)
for(f=a4+1,q=o>1,k=p!==0,e=o-1,d=-1,c=255;f<a5;++f){if(!(f<a3.length))return A.a(a3,f)
b=a3[f]
a=A.wK(b)
if(a===0){j=b.ch
i=b.CW
if(n){m-=j
l-=i}else{m+=j
l+=i}continue}if(q){a0=(b.z>0?0:b.y)-1
if(!k||p!==b.x||a0>=o)a0=e
if(d!==a0){j=r.a
i=r.b
a1=r.c
h=new A.cR(j,i,a1,r.d)
h.a=j+(a6?e-a0:a0)*a1/o
h.c=a1/o
d=a0
c=255}}if(c!==a){g=new A.cR(h.a,h.b,h.c,h.d)
c=a}A.wL(a2,b,g,a,a6)
b.CW=b.ch=0
b.cx+=m
b.cy+=l}},
wL(a,b,c,d,e){var s,r,q,p,o=A.qY(a,b.b),n=a.a.c
n===$&&A.h()
s=n/16|0
b.cy=b.cx=0
A:{n=233!==d
if(!n||234===d){r=c.a
q=o.c
p=o.a
q/=2
r=b.cx=e?r-q-p:r+c.c-q-p
break A}if(200===d||218===d||228===d){r=b.cx=c.a-o.a
break A}if(216===d||222===d||232===d){r=b.cx=c.a+c.c-o.c-o.a
break A}r=b.cx=c.a+(c.c-o.c)/2-o.a}b.cx=r<0?Math.ceil(r):Math.floor(r)
B:{if(!n||218===d||220===d||222===d){c.d-=s
A.rB(b,c,o,s)
break B}if(200===d||202===d){A.rB(b,c,o,s)
break B}if(234===d||228===d||230===d||232===d){c.b+=s
c.d-=s
A.rA(b,c,o,s)
break B}if(214===d||216===d)A.rA(b,c,o,s)}},
rB(a,b,c,d){var s=b.b,r=b.d
s=a.cy=s+r-c.b
if(d>0===s>0){s=b.d=r-s
a.cy=0}else s=r
b.d=s+c.d},
rA(a,b,c,d){var s,r=b.b,q=a.cy=r-(c.b+c.d)
if(d>0!==q>0){r=-q/2
s=r<0?Math.ceil(r):Math.floor(r)
r=b.b+=s
b.d-=s
a.cy+=s}q=c.d
b.b=r-q
b.d+=q},
cR:function cR(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
aT:function aT(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=0
_.w=_.r=_.f=!1
_.z=_.y=_.x=0
_.at=_.as=_.Q=!1
_.ax=0
_.ay=!1
_.dx=_.db=_.cy=_.cx=_.CW=_.ch=0},
dE:function dE(a,b){this.a=a
this.b=b},
j5:function j5(){},
jj:function jj(a,b){this.a=a
this.b=b},
jb:function jb(a,b){this.a=a
this.b=b},
ja:function ja(a,b){this.a=a
this.b=b},
ji:function ji(a){this.a=a},
jf:function jf(a,b){this.a=a
this.b=b},
jg:function jg(a,b){this.a=a
this.b=b},
jh:function jh(a,b){this.a=a
this.b=b},
jc:function jc(a,b){this.a=a
this.b=b},
jd:function jd(a,b){this.a=a
this.b=b},
je:function je(a,b){this.a=a
this.b=b},
j9:function j9(a,b){this.a=a
this.b=b},
j6:function j6(a,b){this.a=a
this.b=b},
j7:function j7(a,b){this.a=a
this.b=b},
j8:function j8(a,b){this.a=a
this.b=b},
uc(a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6=null,a7=A.c8(a8,0,a6)
try{s=0
if(A.oR(a7,0)==="ttcf")s=a7.getUint32(12,!1)
r=a7.getUint32(s,!1)
if(!J.l(r,65536)&&A.oR(a7,s)!=="true")throw A.f(B.bq)
q=A.A(t.N,t.S)
p=0
n=t.X
for(;;){m=p
l=s
if(typeof l!=="number")return l.af()
l=a7.getUint16(l+4,!1)
if(typeof m!=="number")return m.bQ()
if(!(m<l))break
m=s
if(typeof m!=="number")return m.af()
l=p
if(typeof l!=="number")return l.ag()
o=m+12+l*16
l=a7
m=o
m=A.bq(A.b([l.getUint8(m),l.getUint8(m+1),l.getUint8(m+2),l.getUint8(m+3)],n),0,a6)
l=o
if(typeof l!=="number")return l.af()
J.hW(q,m,a7.getUint32(l+8,!1))
m=p
if(typeof m!=="number")return m.af()
p=m+1}n=a7
m=q
l=new A.ik(n,m)
k=l.aF("head")
j=l.aF("maxp")
i=l.aF("hhea")
h=n.getUint16(k+18,!1)
l.c!==$&&A.at()
l.c=h
h=n.getUint16(j+4,!1)
l.d!==$&&A.at()
l.d=h
g=n.getInt16(i+4,!1)
l.e!==$&&A.at()
l.e=g
g=n.getInt16(i+6,!1)
l.f!==$&&A.at()
l.f=g
g=l.aF("loca")
f=l.aF("glyf")
e=n.getInt16(k+50,!1)
d=l.aF("hmtx")
c=Math.max(1,n.getUint16(i+34,!1))
b=m.h(0,"gvar")
l.r!==$&&A.at()
l.r=new A.iE(n,e===1,h,g,f,d,c,b)
b=A.tJ(n,m.h(0,"fvar"),m.h(0,"avar"))
l.w!==$&&A.at()
l.w=b
b=new A.l1(n)
b.eT(n,l.aF("cmap"))
l.x!==$&&A.at()
l.x=b
a=m.h(0,"GDEF")
if(a==null)h=a6
else{h=A.oS(n,a,4)
g=A.oS(n,a,10)
f=a+2
e=n.getUint16(f,!1)>=2?A.oS(n,a,12):a6
h=new A.ip(n,h,g,e,n.getUint16(f,!1)>=3&&n.getUint32(a+14,!1)!==0?new A.fI(n,a+n.getUint32(a+14,!1)):a6)}l.y!==$&&A.at()
l.y=h
a0=m.h(0,"GSUB")
a1=m.h(0,"GPOS")
h=a0==null?a6:A.qu(n,a0,7)
l.z!==$&&A.at()
l.z=h
h=a1==null?a6:A.qu(n,a1,9)
l.Q!==$&&A.at()
l.Q=h
a2=m.h(0,"kern")
h=a2==null?a6:A.ut(n,a2)
l.as!==$&&A.at()
l.as=h
a3=m.h(0,"HVAR")
if(a3!=null){l.at=new A.fI(n,a3+n.getUint32(a3+4,!1))
a4=n.getUint32(a3+8,!1)
l.ax=a4===0?a6:new A.i8(n,a3+a4)}return l}catch(a5){if(t.b0.b(A.aG(a5)))throw A.f(B.bc)
else throw a5}},
ub(a,b){var s,r=a.d
r===$&&A.h()
s=new Int32Array(r)
B.a6.ak(s,0,r,-1)
return new A.dd(a,b,s)},
ik:function ik(a,b){var _=this
_.a=a
_.b=b
_.as=_.Q=_.z=_.y=_.x=_.w=_.r=_.f=_.e=_.d=_.c=$
_.ax=_.at=null},
dd:function dd(a,b,c){this.a=a
this.b=b
this.c=c},
il:function il(){},
l1:function l1(a){var _=this
_.a=a
_.c=_.b=null
_.d=!1},
qg(a,b,c,d,e){var s,r,q
if(c<b){s=a.a
if(!(c<s.length))return A.a(s,c)
B.a.m(s,c,s[c]+d)
s=a.b
if(!(c<s.length))return A.a(s,c)
B.a.m(s,c,s[c]+e)}else{s=a.e
r=(c-b)*2
if(!(r>=0&&r<8))return A.a(s,r)
q=s[r]
s.$flags&2&&A.r(s)
s[r]=q+d;++r
if(!(r<8))return A.a(s,r)
s[r]=s[r]+e}},
uh(a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
for(s=a5.length,r=a8.length,q=t.X,p=a6.length,o=a7.length,n=0,m=0;m<a5.length;a5.length===s||(0,A.i)(a5),++m){l=a5[m]
k=A.b([],q)
for(j=n;j<=l;++j){if(!(j>=0&&j<r))return A.a(a8,j)
if(a8[j])k.push(j)}i=k.length
if(i!==0&&i<=l-n)for(h=a3.length,g=a6.$flags|0,f=a4.length,e=a7.$flags|0,d=0;d<i;){c=k[d];++d
b=k[d%i]
for(j=c+1;;++j){if(j>l)j=n
if(j===b)break
if(!(j>=0&&j<h))return A.a(a3,j)
a=a3[j]
if(!(c>=0&&c<h))return A.a(a3,c)
a0=a3[c]
if(!(b>=0&&b<h))return A.a(a3,b)
a1=a3[b]
if(!(c<p))return A.a(a6,c)
a2=a6[c]
if(!(b<p))return A.a(a6,b)
a2=A.qh(a,a0,a1,a2,a6[b])
g&2&&A.r(a6)
if(!(j<p))return A.a(a6,j)
a6[j]=a2
if(!(j<f))return A.a(a4,j)
a2=a4[j]
if(!(c<f))return A.a(a4,c)
a1=a4[c]
if(!(b<f))return A.a(a4,b)
a0=a4[b]
if(!(c<o))return A.a(a7,c)
a=a7[c]
if(!(b<o))return A.a(a7,b)
a=A.qh(a2,a1,a0,a,a7[b])
e&2&&A.r(a7)
if(!(j<o))return A.a(a7,j)
a7[j]=a}}n=l+1}},
qh(a,b,c,d,e){var s,r,q,p,o
if(b===c)return d===e?d:0
s=(b<c?new A.bu([b,c,d,e]):new A.bu([c,b,e,d])).a
r=s[0]
q=s[1]
p=s[2]
o=s[3]
if(a<=r)return p
if(a>=q)return o
return p+(a-r)*(o-p)/(q-r)},
fA:function fA(a,b,c){this.a=a
this.b=b
this.c=c},
iw:function iw(a,b,c){this.a=a
this.b=b
this.c=c},
ix:function ix(a,b,c){this.a=a
this.b=b
this.c=c},
iv:function iv(a,b,c){this.a=a
this.b=b
this.c=c},
dB:function dB(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
iE:function iE(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
iH:function iH(a,b){this.a=a
this.b=b},
iF:function iF(a,b){this.a=a
this.b=b},
iG:function iG(a,b){this.a=a
this.b=b},
p3(a){var s,r
for(s=a&255,r=0;s!==0;s=s>>>1)r+=s&1
return r*2},
uR(a,b){var s
for(s=0;s<a.length;++s)A.qD(a,s,b,0)},
qD(a,b,c,d){var s,r,q,p,o,n,m=a.length
if(!(b>=0&&b<m))return A.a(a,b)
s=a[b]
r=s.db
if(r===0)return
s.db=0
q=b+r
if(q<0||q>=m||d>64)return
A.qD(a,q,c,d+1)
m=a.length
if(!(q>=0&&q<m))return A.a(a,q)
p=a[q]
if((s.dx&2)!==0){s.cy=s.cy+p.cy
return}o=s.cx=s.cx+p.cx
s.cy=s.cy+p.cy
if(c)for(n=q+1;n<=b;++n){if(!(n<m))return A.a(a,n)
o+=a[n].ch
s.cx=o}else for(n=q;n<b;++n){if(!(n<m))return A.a(a,n)
o-=a[n].ch
s.cx=o}},
jI:function jI(a,b,c,d){var _=this
_.y=a
_.a=b
_.b=c
_.c=d
_.d=$
_.e=0
_.r=_.f=!0
_.x=_.w=0},
jK:function jK(a,b){this.a=a
this.b=b},
jJ:function jJ(a,b,c){this.a=a
this.b=b
this.c=c},
k7:function k7(a,b,c){var _=this
_.y=1
_.a=a
_.b=b
_.c=c
_.d=$
_.e=0
_.r=_.f=!0
_.x=_.w=0},
k9:function k9(a,b){this.a=a
this.b=b},
k8:function k8(){},
kc:function kc(a,b){this.a=a
this.b=b},
ka:function ka(a,b,c){this.a=a
this.b=b
this.c=c},
kb:function kb(a,b,c){this.a=a
this.b=b
this.c=c},
ut(a,b){var s,r,q,p,o,n,m,l,k,j,i=a.getUint16(b,!1)===1,h=i?a.getUint32(b+4,!1):a.getUint16(b+2,!1),g=b+(i?8:4),f=A.b([],t.gd)
for(s=!1,r=0;r<h;++r){q=g+4
if(i){p=a.getUint32(g,!1)
o=a.getUint16(q,!1)
n=o&255
m=(o&32768)===0
l=(o&16384)!==0
k=(o&8192)!==0
j=g+8}else{p=a.getUint16(g+2,!1)
o=a.getUint16(q,!1)
n=o>>>8
m=(o&1)!==0
k=(o&2)!==0
l=(o&4)!==0
j=g+6}if(n===0&&m&&!k){B.a.j(f,new A.e(j,l))
s=B.ah.eJ(s,l)}if(p===0)break
g+=p}return f.length===0?null:new A.j1(a,f,s)},
j1:function j1(a,b,c){this.a=a
this.b=b
this.c=c},
aE(a,b,c){var s,r,q,p,o,n=a.getUint16(b,!1),m=a.getUint16(b+2,!1)-1
if(n===1)for(s=b+4,r=0;r<=m;){q=B.b.I(r+m,1)
p=a.getUint16(s+q*2,!1)
if(c<p)m=q-1
else if(c>p)r=q+1
else return q}else if(n===2)for(s=b+4,r=0;r<=m;){q=B.b.I(r+m,1)
o=s+q*6
if(c<a.getUint16(o,!1))m=q-1
else if(c>a.getUint16(o+2,!1))r=q+1
else return a.getUint16(o+4,!1)+c-a.getUint16(o,!1)}return-1},
c3(a,b,c){var s,r,q,p,o,n,m=a.getUint16(b,!1)
if(m===1){s=c-a.getUint16(b+2,!1)
return s>=0&&s<a.getUint16(b+4,!1)?a.getUint16(b+6+s*2,!1):0}if(m===2){r=a.getUint16(b+2,!1)-1
for(q=b+4,p=0;p<=r;){o=B.b.I(p+r,1)
n=q+o*6
if(c<a.getUint16(n,!1))r=o-1
else if(c>a.getUint16(n+2,!1))p=o+1
else return a.getUint16(n+4,!1)}}return 0},
oS(a,b,c){var s=a.getUint16(b+c,!1)
return s===0?null:b+s},
qu(a,b,c){var s=a.getUint16(b+4,!1),r=a.getUint16(b+6,!1),q=a.getUint16(b+8,!1),p=a.getUint16(b+2,!1)>=1&&a.getUint32(b+10,!1)!==0?b+a.getUint32(b+10,!1):null
return new A.j_(a,c,b+s,b+r,b+q,p,A.A(t.S,t.n7))},
ip:function ip(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
dn:function dn(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
j_:function j_(a,b,c,d,e,f,g){var _=this
_.a=a
_.c=b
_.d=c
_.e=d
_.f=e
_.r=f
_.w=g},
j0:function j0(a,b){this.a=a
this.b=b},
tJ(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e
if(b==null)return null
s=b+a.getUint16(b+4,!1)
r=a.getUint16(b+8,!1)
q=a.getUint16(b+10,!1)
p=A.b([],t.d1)
for(o=t.X,n=0;n<r;++n){m=s+n*q
p.push(new A.fy(A.bq(A.b([a.getUint8(m),a.getUint8(m+1),a.getUint8(m+2),a.getUint8(m+3)],o),0,null),a.getInt32(m+4,!1)/65536,a.getInt32(m+8,!1)/65536,a.getInt32(m+12,!1)/65536))}l=A.b([],t.eH)
if(c!=null&&a.getUint16(c,!1)===1){k=c+8
o=t.I
m=c+6
n=0
for(;;){if(!(n<a.getUint16(m,!1)&&n<r))break
j=a.getUint16(k,!1)
i=A.b([],o)
for(h=k+2,g=k+4,f=0;f<j;++f){e=f*4
i.push(new A.e(a.getInt16(h+e,!1)/16384,a.getInt16(g+e,!1)/16384))}B.a.j(l,i)
k+=2+j*4;++n}}return new A.i2(p,l)},
tI(a,b){var s,r,q,p,o,n,m,l
if(a.length<2)return b
if(b<=B.a.gt(a).a)return B.a.gt(a).b
for(s=a.length,r=1;r<s;++r){q=a[r]
p=q.a
o=q.b
if(b>p)continue
n=a[r-1]
m=n.a
l=n.b
return p===m?o:l+(b-m)*(o-l)/(p-m)}return B.a.gE(a).b},
t4(a,b,c,d){var s,r,q,p,o,n,m,l
for(s=a.length,r=1,q=0;q<s;++q){p=b.$1(q)
if(p===0)continue
o=a[q]
if(o===p)continue
if(c!=null&&d!=null){n=c.$1(q)
m=d.$1(q)
l=!0
if(!(n>p))if(!(p>m))if(n<0)l=m>0
else l=!1
if(l)continue
if(o<=n||o>=m)return 0
r*=o<p?(o-n)/(p-n):(m-o)/(m-p)}else{if(o===0||o<Math.min(0,p)||o>Math.max(0,p))return 0
r*=o/p}}return r},
fy:function fy(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
i2:function i2(a,b){this.a=a
this.b=b},
fI:function fI(a,b){var _=this
_.a=a
_.b=b
_.d=_.c=$},
iQ:function iQ(a,b){this.a=a
this.b=b},
iR:function iR(a,b){this.a=a
this.b=b},
iS:function iS(a,b){this.a=a
this.b=b},
i8:function i8(a,b){this.a=a
this.b=b},
pt(a){var s,r=!0
if(!(a>=1536&&a<=2303))if(!(a>=64336&&a<=65023))r=a>=65136&&a<=65279
if(!r)return 0
s=A.rX(a)
return s===6||s===7?3:s},
rW(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=new A.o7(a),d=A.b([],t.X)
for(s=!1,r=0;q=a.length,r<q;++r){if(!(r>=0))return A.a(a,r)
p=a[r]
o=A.pt(p)
n=!1
if(o===1){B.a.j(d,p)
continue}m=e.$1(r)
if(p===1604&&m!=null){if(m>>>0!==m||m>=a.length)return A.a(a,m)
l=A.f7(B.aF,5,a[m])
k=l<0?null:B.a.F(B.aF,l+1,l+5)}else k=null
if(k!=null){q=s?1:0
if(!(q<k.length))return A.a(k,q)
j=k[q]
q=j===0
B.a.j(d,q?p:j)
i=r+1
m.toString
for(;i<m;++i){if(!(i<a.length))return A.a(a,i)
B.a.j(d,a[i])}if(q){if(!(m>=0&&m<a.length))return A.a(a,m)
q=a[m]}else q=-1
B.a.j(d,q)
r=m
s=n
continue}if(s)h=o===2||o===3||o===5
else h=!1
if(o===2||o===4||o===5)if(m!=null){if(m>>>0!==m||m>=a.length)return A.a(a,m)
q=A.pt(a[m])
q=q===2||q===3||q===5
g=q}else g=n
else g=n
l=A.f7(B.aN,5,p)
f=l<0?null:B.a.F(B.aN,l+1,l+5)
if(f==null)j=0
else{if(h)q=g?3:1
else q=g?2:0
if(!(q<f.length))return A.a(f,q)
j=f[q]}B.a.j(d,j===0?p:j)
s=g}return d},
o7:function o7(a){this.a=a},
rT(a,b,c){var s={},r=new A.aO(new Float64Array(256))
s.a=s.b=0
a.j1(new A.nV(s,b,c,r),new A.nW(s,b,c),new A.nX(s,b,c,r))
return r},
rQ(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i=b*c,h=new Float32Array(i+2)
for(s=0;s<a.b;s+=4){r=a.a
q=r.length
if(!(s<q))return A.a(r,s)
p=r[s]
o=s+1
if(!(o<q))return A.a(r,o)
o=r[o]
n=s+2
if(!(n<q))return A.a(r,n)
n=r[n]
m=s+3
if(!(m<q))return A.a(r,m)
A.wA(h,b,c,p+d,o+e,n+d,r[m]+e)}l=new Float32Array(i)
for(k=0,s=0;s<i;++s){k+=h[s]
j=Math.abs(k)
if(j<0.001953125)r=0
else r=j>0.998046875?1:j
if(!(s<i))return A.a(l,s)
l[s]=r}return l},
wA(b0,b1,b2,b3,b4,b5,b6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9
if(b4===b6)return
if(b4<b6)s=1
else{r=b6
b6=b4
b4=r
r=b5
b5=b3
b3=r
s=-1}q=(b5-b3)/(b6-b4)
p=b4<0?b3-b4*q:b3
o=Math.min(b2,B.c.ae(b6))
for(n=Math.max(0,B.c.U(b4)),m=b0.length,l=b0.$flags|0;n<o;n=j,p=h){k=n*b1
j=n+1
i=Math.min(j,b6)-Math.max(n,b4)
h=p+q*i
g=i*s
f=p<h
e=f?p:h
d=f?h:p
c=Math.floor(e)
b=B.c.N(c)
a=Math.ceil(d)
a0=B.c.N(a)
f=k+b
if(a0<=b+1){if(!(f>=0&&f<m))return A.a(b0,f)
a1=b0[f]
a2=g*(0.5*(p+h)-c)
l&2&&A.r(b0)
b0[f]=a1+(g-a2);++f
if(!(f<m))return A.a(b0,f)
b0[f]=b0[f]+a2}else{a3=1/(d-e)
a4=e-c
a1=0.5*a3
a2=1-a4
a5=a1*a2*a2
a6=d-a+1
a7=a1*a6*a6
if(!(f>=0&&f<m))return A.a(b0,f)
a1=b0[f]
l&2&&A.r(b0)
b0[f]=a1+g*a5
a8=b+2;++f
if(a0===a8){if(!(f<m))return A.a(b0,f)
b0[f]=b0[f]+g*(1-a5-a7)}else{a9=a3*(1.5-a4)
if(!(f<m))return A.a(b0,f)
b0[f]=b0[f]+g*(a9-a5)
for(f=a0-1,a1=g*a3;a8<f;++a8){a2=k+a8
if(!(a2>=0&&a2<m))return A.a(b0,a2)
b0[a2]=b0[a2]+a1}f=k+a0-1
if(!(f>=0&&f<m))return A.a(b0,f)
b0[f]=b0[f]+g*(1-(a9+(a0-b-3)*a3)-a7)}f=k+a0
if(!(f>=0&&f<m))return A.a(b0,f)
b0[f]=b0[f]+g*a7}}},
rL(a){var s,r,q,p,o,n,m,l,k
for(s=a.b,r=a.a,q=r.length,p=1/0,o=1/0,n=-1/0,m=-1/0,l=0;l<s;l+=2){if(!(l<q))return A.a(r,l)
k=r[l]
p=Math.min(p,k)
n=Math.max(n,k)
k=l+1
if(!(k<q))return A.a(r,k)
k=r[k]
o=Math.min(o,k)
m=Math.max(m,k)}return new A.bu([p,o,n,m])},
t6(a,b,c){var s,r,q,p,o,n,m,l,k,j=b*c,i=new Float64Array(j),h=new Float64Array(j)
for(s=a.length,r=0;r<j;++r){if(!(r<s))return A.a(a,r)
q=a[r]
if(q>=1){if(!(r<j))return A.a(h,r)
h[r]=1e20}else if(q<=0){if(!(r<j))return A.a(i,r)
i[r]=1e20}else{p=0.5-q
o=p>0?p*p:0
if(!(r<j))return A.a(i,r)
i[r]=o
o=p<0?p*p:0
if(!(r<j))return A.a(h,r)
h[r]=o}}n=Math.max(b,c)
m=new Float64Array(n)
l=new Float64Array(n+1)
k=new Int32Array(n)
A.rp(i,b,c,m,k,l)
A.rp(h,b,c,m,k,l)
for(r=0;r<j;++r){s=Math.sqrt(i[r])
o=Math.sqrt(h[r])
if(!(r<j))return A.a(i,r)
i[r]=s-o}return i},
xQ(a,b,c,d,e){var s,r,q,p,o,n,m=A.t6(a,b,c),l=b*c,k=new Uint8Array(l),j=Math.max(0.5,e*1.5)
for(s=d+j,r=m.length,q=2*j,p=0;p<l;++p){if(!(p<r))return A.a(m,p)
o=(s-m[p])/q
if(o<0)o=0
else if(o>1)o=1
n=B.c.N(o*o*(3-2*o)*255+0.5)
if(!(p<l))return A.a(k,p)
k[p]=n}return k},
xE(b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0=24/b4*4,b1=A.rT(b3,b0,b5?0.2*b0:0)
if(b1.b===0)return null
s=A.rL(b1).a
r=s[0]
q=s[1]
p=s[2]
o=s[3]
n=B.c.U(r/4)
m=B.c.U(q/4)
l=Math.max(1,B.c.ae(p/4)-n)
k=Math.max(1,B.c.ae(o/4)-m)
j=l+6
i=k+6
h=j*4
g=i*4
f=A.t6(A.rQ(b1,h,g,(3-n)*4,(3-m)*4),h,g)
s=j*i
e=new Uint8Array(s)
for(d=f.length,c=0;c<i;++c)for(b=c*j,a=c*4+2,a0=a-1,a1=0;a1<j;++a1){for(a2=a1*4+2,a3=a2-1,a4=a0,a5=0;a4<=a;++a4)for(a6=a4*h,a7=a3;a7<=a2;++a7){a8=a6+a7
if(!(a8>=0&&a8<d))return A.a(f,a8)
a5+=f[a8]}a9=255-255*(a5/4/4/8+0.25)
a2=b+a1
if(a9<0)a6=0
else a6=a9>255?255:B.c.M(a9)
if(!(a2>=0&&a2<s))return A.a(e,a2)
e[a2]=a6}return new A.aJ(b2,e,l,k,n,-m,0)},
rp(a,b,c,d,e,f){var s,r
for(s=0;s<b;++s)A.rq(a,s,b,c,d,e,f)
for(r=0;r<c;++r)A.rq(a,r*b,1,b,d,e,f)},
rq(a,b,c,d,e,f,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g
for(s=a.length,r=e.$flags|0,q=0;q<d;++q){p=b+q*c
if(!(p>=0&&p<s))return A.a(a,p)
p=a[p]
r&2&&A.r(e)
if(!(q<e.length))return A.a(e,q)
e[q]=p}f.$flags&2&&A.r(f)
r=f.length
if(0>=r)return A.a(f,0)
f[0]=0
a0.$flags&2&&A.r(a0)
p=a0.length
if(0>=p)return A.a(a0,0)
a0[0]=-1e20
if(1>=p)return A.a(a0,1)
a0[1]=1e20
for(o=e.length,n=0,q=1;q<d;++q){m=q*q
do{if(!(n>=0&&n<r))return A.a(f,n)
l=f[n]
if(!(q<o))return A.a(e,q)
k=e[q]
if(!(l>=0&&l<o))return A.a(e,l)
j=(k-e[l]+m-l*l)/(q-l)/2
if(!(n<p))return A.a(a0,n)
if(j<=a0[n]){--n
k=n>-1}else k=!1}while(k);++n
if(!(n<r))return A.a(f,n)
f[n]=q
if(!(n<p))return A.a(a0,n)
a0[n]=j
m=n+1
if(!(m<p))return A.a(a0,m)
a0[m]=1e20}for(m=a.$flags|0,n=0,q=0;q<d;++q){for(;;){i=n+1
if(!(i>=0&&i<p))return A.a(a0,i)
if(!(a0[i]<q))break
n=i}if(!(n>=0&&n<r))return A.a(f,n)
l=f[n]
k=b+q*c
if(!(l>=0&&l<o))return A.a(e,l)
h=e[l]
g=q-l
m&2&&A.r(a)
if(!(k>=0&&k<s))return A.a(a,k)
a[k]=h+g*g}},
nW:function nW(a,b,c){this.a=a
this.b=b
this.c=c},
nV:function nV(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
nX:function nX(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
qc(a,b){var s,r,q,p,o,n,m,l=t.S,k=A.b([],t.cY)
for(s=J.Q(a),r=s.gp(a);r.l();){q=A.uc(r.gn())
p=new Float64Array(0)
o=q.d
o===$&&A.h()
n=new Int32Array(o)
B.a6.ak(n,0,o,-1)
k.push(new A.dd(q,p,n))}r=A.b([],t.s)
for(q=b!=null,m=0;m<s.gk(a);++m)r.push(A.qd(q&&m<J.S(b.a)?b.$ti.y[1].a(J.R(b.a,m)):""))
return new A.it(k,r,A.A(t.N,t.L),A.A(l,t.oX),A.A(l,t.gp))},
qd(a){var s,r,q,p,o=A.b([],t.s)
for(s=B.d.cV(a.toLowerCase(),A.fZ("[\\s_-]+")),r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q]
if(p.length!==0&&!B.eB.u(0,p))o.push(p)}return B.a.bL(o)},
qe(a){return B.b.H(B.c.M(a/100)*100,100,900)},
pq(b9,c0,c1,c2,c3,c4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6=t.n,b7=A.b([],b6),b8=J.n(c0)
if(b8.gB(c0))return new A.e(b7,0)
s=c4==null?A.pW(c0).c:A.y0(c0,c4.c,c4.b)
for(r=s.length,q=c2!==0,p=b9.c,o=J.Q(c3),n=b9.r,m=c1/100,l=t.lG,k=t.of,j=0,i=0;i<s.length;s.length===r||(0,A.i)(s),++i){h=s[i]
g=b8.F(c0,h.a,h.b)
f=(h.c&1)===1
e=A.yo(g)
d=J.B(f?new A.aK(e,A.D(e).i("aK<1>")):e)
c=!f
b=J.Q(g)
while(d.l()){a=d.gn()
a0=b.F(g,a.a,a.b)
a2=o.gp(c3)
a=a.c
a3=0
for(;;){if(!a2.l()){a1=null
break}a3=a2.gn()
a4=a3*1000+B.b.H(B.c.M(m)*100,100,900)
a5=n.h(0,a4)
if(a5==null){a5=new A.h0(b9.el(a3,c1),A.A(l,k))
n.m(0,a4,a5)
a4=a5}else a4=a5
a6=a4.eL(a0,f,a)
if(!B.a6.u(a6.a,0)){a1=a6
break}}if(a1==null)return null
if(!(a3>=0&&a3<p.length))return A.a(p,a3)
a=p[a3].a.c
a===$&&A.h()
for(a2=a1.a,a4=a2.length,a5=a1.b,a7=a5.length,a8=a1.c,a9=a8.length,b0=a1.d,b1=b0.length,b2=0;b2<a4;++b2){if(!(b2<a7))return A.a(a5,b2)
b3=a5[b2]/a
b4=a2[b2]
if(!(b2<a9))return A.a(a8,b2)
b5=a8[b2]
if(!(b2<b1))return A.a(b0,b2)
B.a.v(b7,A.b([a3,b4,j+b5/a,-b0[b2]/a,b3],b6))
j+=b3
if(c&&q&&b3>0)j+=c2}}}return new A.e(b7,j)},
vW(a1,a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=null,d=a2.a,c=A.b([],t.fC),b=t.X,a=A.b([],b),a0=A.b([],b)
for(s=0;s<d.length;++s){r=d[s]
if(r===32||r===160||r===12288){if(a0.length!==0)B.a.j(c,a0)
a0=A.b([],b)}else{if(a0.length===0)B.a.j(a,s)
if(!(s<d.length))return A.a(d,s)
B.a.j(a0,d[s])}}if(a0.length!==0)B.a.j(c,a0)
if(c.length<2)return A.b([a2],t.q)
q=new A.lO(a2,a,c)
b=A.pq(a1,B.bE,a3,a4,a6,e)
p=b==null?e:b.b
if(p==null)p=0.25
b=A.b([],t.n)
for(r=c.length,o=0;o<c.length;c.length===r||(0,A.i)(c),++o){n=c[o]
m=A.pq(a1,n,a3,a4,a6,e)
m=m==null?e:m.b
b.push(m==null?n.length*0.5:m)}l=B.a.bI(b,0,new A.lN(),t.i)+p*(c.length-1)
if(l<=a5)return A.b([a2],t.q)
k=B.c.ae(l/a5)
j=l/k
i=A.b([],t.q)
for(r=k-1,h=0,g=0,s=0;m=c.length,s<m;++s){m=s===h?0:p
if(!(s<b.length))return A.a(b,s)
f=b[s]
if(s>h){m=g+(m+f)
m=m>j&&m-j>j-g&&i.length<r}else m=!1
if(m){B.a.j(i,q.$2(h,s))
h=s
g=0}m=s===h?0:p
if(!(s<b.length))return A.a(b,s)
g+=m+b[s]}B.a.j(i,q.$2(h,m))
return i},
rY(a,b,c,d,e,f,g,h,i){var s,r,q,p,o={},n=a.iE(h),m=A.b([],t.q)
o.a=A.b([],t.X)
s=new A.oa(o,m,g,f,a,i,d,n)
for(r=new A.cO(b);r.l();){q=r.d
if(q===10||q===13||q===8232||q===8233){if(g)B.a.j(o.a,32)
else s.$0()
continue}p=o.a
B.a.j(p,q===9?32:q)}s.$0()
return A.wy(a,m,i,d,e,c,n,null)},
wy(a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=A.b([],t.cb)
for(s=a2.length,r=0;r<a2.length;a2.length===s||(0,A.i)(a2),++r){q=a2[r]
p=A.pq(a1,q.a,a3,a4,a7,q)
if(p==null)return null
B.a.j(a0,p)}o=B.a.bI(a0,0,new A.m7(),t.i)
s=A.v(J.hX(a7))
n=a1.c
if(!(s>=0&&s<n.length))return A.a(n,s)
s=n[s].a
n=s.c
n===$&&A.h()
m=s.e
m===$&&A.h()
s=s.f
s===$&&A.h()
l=a8==null?(m/n- -s/n)/2:a8
s=t.n
k=A.b([],s)
for(n=A.oT(a0,0,t.hT),m=J.B(n.a),j=n.b,n=new A.ba(m,j,A.q(n).i("ba<1>")),i=a6>0,h=a6<0;n.l();){g=n.c
g=g>=0?new A.e(j+g,m.gn()):A.aF(A.ae())
f=g.b
e=f.a
d=f.b
A:{if(h){c=0
break A}if(i){c=o-d
break A}c=(o-d)/2
break A}b=(g.a+0.5)*a5+l
for(g=J.n(e),a=0;a<g.gk(e);a+=5)B.a.v(k,A.b([g.h(e,a),g.h(e,a+1),g.h(e,a+2)+c,g.h(e,a+3)+b,g.h(e,a+4)],s))}s=new Float32Array(A.N(k))
n=a0.length
return new A.jX(s,o,n*a5,n)},
it:function it(a,b,c,d,e){var _=this
_.c=a
_.d=b
_.e=c
_.f=d
_.r=e},
iu:function iu(a,b){this.a=a
this.b=b},
jX:function jX(a,b,c,d){var _=this
_.d=a
_.e=b
_.f=c
_.r=d},
lO:function lO(a,b,c){this.a=a
this.b=b
this.c=c},
lN:function lN(){},
oa:function oa(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
m7:function m7(){},
qz(a){return new A.aJ(a,new Uint8Array(0),0,0,0,0,0)},
ug(a){var s,r,q,p,o,n=A.b([],t.A),m=a.length,l=new A.eN(a,0,m)
while(l.b<m){s=l.A()
r=s&7
if(s>>>3===1&&r===2){q=l.er()
for(p=q.c;q.b<p;){s=q.A()
o=s&7
if(s>>>3===3&&o===2)B.a.j(n,A.uf(q.er()))
else q.T(0,o)}}else l.T(0,r)}return n},
uf(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=new Uint8Array(0)
for(s=a.c,r=a.a,q=0,p=0,o=0,n=0,m=0,l=0;a.b<s;){k=a.A()
switch(k>>>3){case 1:q=a.A()
break
case 2:j=a.ac(0)
i=a.b
h=A.bQ(r,i,i+j)
a.b+=j
f=h
break
case 3:p=a.A()
break
case 4:o=a.A()
break
case 5:g=a.A()
n=(g&1)===0?B.b.C(g,2):B.b.C(-(g+1),2)
break
case 6:g=a.A()
m=(g&1)===0?B.b.C(g,2):B.b.C(-(g+1),2)
break
case 7:l=a.A()
break
default:a.T(0,k&7)}}return new A.aJ(q,f,p,o,n,m,l)},
aJ:function aJ(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
eN:function eN(a,b,c){this.a=a
this.b=b
this.c=c},
iy:function iy(a,b,c,d,e,f,g,h,i,j){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.r=f
_.w=g
_.x=h
_.y=i
_.z=j
_.Q=null},
iz:function iz(a,b){this.a=a
this.b=b},
qf(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j,i
for(s=e.b,r=e.a,q=f.length,p=a.$flags|0,o=0;o<s;++o){n=((d+o)*b+c)*4
m=o*r
for(l=0;l<r;++l,++m,n+=4){if(!(m>=0&&m<q))return A.a(f,m)
k=f[m]
p&2&&A.r(a)
j=a.length
if(!(n>=0&&n<j))return A.a(a,n)
a[n]=k
i=n+1
if(!(i<j))return A.a(a,i)
a[i]=k
i=n+2
if(!(i<j))return A.a(a,i)
a[i]=k
i=n+3
if(!(i<j))return A.a(a,i)
a[i]=k}}},
fB:function fB(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
bs:function bs(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
iA:function iA(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
iD:function iD(){},
iC:function iC(){},
iB:function iB(a,b,c){this.a=a
this.b=b
this.c=c},
fC:function fC(a,b){this.a=a
this.$ti=b},
f8(a,b,c){return A.xO(a,t.dq.a(b),c)},
xO(d1,d2,d3){var s=0,r=A.aj(t.H),q,p=2,o=[],n=[],m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0
var $async$f8=A.ak(function(d4,d5){if(d4===1){o.push(d5)
s=p}for(;;)switch(s){case 0:d0=A.b([],t.bs)
if(1>=d1.length){q=A.a(d1,1)
s=1
break}b2=d1[1]
b2.toString
b2=J.B(t.j.a(b2))
b3=t.p
while(b2.l()){b4=b2.gn()
b4.toString
d0.push(b3.a(b4))}if(2>=d1.length){q=A.a(d1,2)
s=1
break}b2=t.lH.a(d1[2])
b3=t.S
b5=t.kT
m=new A.iA(A.qc(d0,b2==null?null:J.bx(b2,t.N)),A.A(b3,t.ju),A.A(b3,t.hY),A.A(b5,t.dL))
b2=new A.c_(A.bv(d3,"stream",t.K),t.b6)
p=3
d0=t.W,b6=t.jv
case 6:s=8
return A.I(b2.l(),$async$f8)
case 8:if(!d5){s=7
break}l=b2.gn()
b7=l
b7.toString
k=A.vy(d0.a(b7))
j=null
i=!1
h=null
g=!1
f=null
e=!1
d=null
c=!1
b=null
b7=k instanceof A.hu
if(b7){if(i)b8=j
else{i=!0
b9=k.a
j=b9
b8=b9}b=b8}if(b7){b7=b5.a(b)
m.d.a5(0,b7)
s=6
break}a=null
a0=null
b7=k instanceof A.hk
if(b7){if(g)c0=h
else{g=!0
c1=k.a
h=c1
c0=c1}a=c0
if(e)c2=f
else{e=!0
c3=k.b
f=c3
c2=c3}a0=c2}if(b7){b7=m.b
c4=b7.h(0,a)
if(c4==null){c4=A.A(b3,b6)
b7.m(0,a,c4)}a1=c4
for(b7=a0,c5=b7.length,c6=0;c6<b7.length;b7.length===c5||(0,A.i)(b7),++c6){a2=b7[c6]
J.hW(a1,a2.a,a2)}s=6
break}a3=null
a4=null
a5=null
a6=null
a7=null
b7=k instanceof A.ht
if(b7){if(c)c7=d
else{c=!0
c8=k.a
d=c8
c7=c8}a3=c7
if(g)c0=h
else{g=!0
c1=k.b
h=c1
c0=c1}a4=c0
a5=k.c
a6=k.d
if(e)c2=f
else{e=!0
c3=k.e
f=c3
c2=c3}a7=c2}if(b7){d2.$1([a3,A.wb(m.ia(a4,a5,a6,a7))])
s=6
break}a8=null
a9=null
b0=null
b7=k instanceof A.hp
if(b7){if(c)c7=d
else{c=!0
c8=k.a
d=c8
c7=c8}a8=c7
if(i)b8=j
else{i=!0
b9=k.b
j=b9
b8=b9}a9=b8
b0=k.c}s=b7?9:10
break
case 9:b1=A.w3(m,a9,b0)
b7=a8
c5=b1
s=11
return A.I(A.hS(b1.c,b1.a,b1.b),$async$f8)
case 11:c9=d5
d2.$1([b7,c5.a,c5.b,c9,c5.d])
s=6
break
case 10:s=6
break
case 7:n.push(5)
s=4
break
case 3:n=[2]
case 4:p=2
s=12
return A.I(b2.aA(),$async$f8)
case 12:s=n.pop()
break
case 5:case 1:return A.ah(q,r)
case 2:return A.ag(o.at(-1),r)}})
return A.ai($async$f8,r)},
w3(a,b,c){var s,r
try{s=a.i5(b,c)
return s}catch(r){s=new Uint8Array(4)
return new A.fB(1,1,s,new Float64Array(0))}},
vy(a){var s,r,q,p,o=J.n(a)
switch(o.h(a,0)){case"d":s=o.h(a,1)
s.toString
A.v(s)
r=A.rx(a,2)
o=o.h(a,9)
o.toString
o=new A.hp(s,r,t.L.a(o))
break
case"s":s=o.h(a,1)
s.toString
A.v(s)
r=o.h(a,2)
r.toString
A.v(r)
q=o.h(a,3)
q.toString
A.v(q)
p=J.l(o.h(a,4),1)
o=o.h(a,5)
o.toString
o=new A.ht(s,r,q,p,t.L.a(o))
break
case"f":o=new A.hu(A.rx(a,1))
break
case"p":s=o.h(a,1)
s.toString
A.v(s)
o=o.h(a,2)
o.toString
o=new A.hk(s,A.wa(t.j.a(o)))
break
default:o=null
break}return o},
wb(a){var s,r,q,p,o=[]
for(s=a.length,r=t.G,q=0;q<a.length;a.length===s||(0,A.i)(a),++q){p=a[q]
o.push(A.b([p.a,p.b,p.c,p.d,p.e,p.f,p.r],r))}return o},
wa(a){var s,r,q,p,o,n,m,l,k,j,i,h=A.b([],t.A)
for(s=J.bx(a,t.W),r=s.$ti,s=new A.a1(s,s.gk(0),r.i("a1<y.E>")),q=t.p,r=r.i("y.E");s.l();){p=s.d
if(p==null)p=r.a(p)
o=J.n(p)
n=o.h(p,0)
n.toString
A.v(n)
m=o.h(p,1)
m.toString
q.a(m)
l=o.h(p,2)
l.toString
A.v(l)
k=o.h(p,3)
k.toString
A.v(k)
j=o.h(p,4)
j.toString
A.v(j)
i=o.h(p,5)
i.toString
A.v(i)
p=o.h(p,6)
p.toString
h.push(new A.aJ(n,m,l,k,j,i,A.v(p)))}return h},
rx(a,b){var s,r,q,p,o,n=J.n(a),m=n.h(a,b)
m.toString
A.v(m)
s=n.h(a,b+1)
s.toString
A.v(s)
r=J.l(n.h(a,b+2),1)
q=n.h(a,b+3)
q.toString
A.v(q)
p=n.h(a,b+4)
p.toString
A.v(p)
o=n.h(a,b+5)
o.toString
A.v(o)
n=n.h(a,b+6)
n.toString
return new A.eQ([p,q,r,A.v(n),o,m,s])},
lv:function lv(){},
hp:function hp(a,b,c){this.a=a
this.b=b
this.c=c},
ht:function ht(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
hu:function hu(a){this.a=a},
hk:function hk(a,b){this.a=a
this.b=b},
yo(a){var s,r,q,p,o=A.b([],t.m1)
for(s=0,r=1,q=0;q<a.length;++q){p=A.b3(B.bD,a[q])
if(p===1||p===2||p===r)continue
if(r===1){r=p
continue}B.a.j(o,new A.eo(s,q,r))
r=p
s=q}if(J.hY(a))B.a.j(o,new A.eo(s,a.length,r))
return o},
yg(a){var s,r
if(!(a<175))return A.a(B.D,a)
s=B.D[a]
A:{if("Zyyy"===s||"Zinh"===s||"Zzzz"===s){r=B.an
break A}if("Hira"===s||"Kana"===s||"Hrkt"===s){r=B.ca
break A}if("Laoo"===s){r=B.ck
break A}if("Yiii"===s){r=B.cj
break A}if("Nkoo"===s){r=B.co
break A}if("Vaii"===s){r=B.cf
break A}if("Deva"===s){r=B.c_
break A}if("Beng"===s){r=B.bZ
break A}if("Guru"===s){r=B.c9
break A}if("Gujr"===s){r=B.c8
break A}if("Orya"===s){r=B.cg
break A}if("Taml"===s){r=B.cm
break A}if("Telu"===s){r=B.cl
break A}if("Knda"===s){r=B.cb
break A}if("Mlym"===s){r=B.cd
break A}if("Mymr"===s){r=B.ce
break A}r=A.b([s.toLowerCase()],t.s)
break A}r=A.W(r,t.N)
r.push("DFLT")
r.push("dflt")
r.push("latn")
return r},
eo:function eo(a,b,c){this.a=a
this.b=b
this.c=c},
v1(a,b){var s,r,q,p,o,n,m,l,k,j=a.length,i=A.a9(j,0,!1,t.S)
for(s=-1,r=0,q=0;p=a.length,q<p;++q){o=A.rX(a[q].a)
A:{if(1===o){p=-1
break A}if(4===o){p=1
break A}if(3===o){p=2
break A}if(2===o||5===o){p=3
break A}if(6===o){p=4
break A}if(7===o){p=5
break A}p=0
break A}if(p<0)continue
if(!(r>=0&&r<7))return A.a(B.aM,r)
n=B.aM[r][p]
p=n.a
if(p!==0&&s>=0)B.a.m(i,s,p)
B.a.m(i,q,n.b)
r=n.c
s=q}for(q=0;q<p;++q){if(!(q<j))return A.a(i,q)
m=i[q]
if(m!==0){l=a[q]
k=l.c
if(!(m<b.length))return A.a(b,m)
l.c=(k|b[m])>>>0}}},
vw(a,b,c){var s
if(!(b<175))return A.a(B.D,b)
s=new A.hF(B.eE.u(0,B.D[b]))
s.eW(a,b,c,{})
return s},
r7(a,b){var s,r,q
for(s=a.length,r=0;r<s;++r){q=a[r]
if(q.a===b)return q.e}return 0},
r6(a,b,c,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=A.b([],t.jn)
for(s=t.cF,r=0;r<a1;++r)d.push(A.b([],s))
q=a.iv(b)
if(q==null)return d
p=new A.lm(a,a0,d,a1)
o=q.b
if(o!=null){n=a.ej(o)
p.$4(o,B.a.ek(c,new A.ln(n),new A.lo(n)).b,1,!0)}for(s=c.length,m=q.a,l=0;l<c.length;c.length===s||(0,A.i)(c),++l){k=c[l]
j=B.a.ek(m,new A.lp(a,k),new A.lq())
if(j<0)continue
p.$4(j,k.b,k.e,!k.d)}for(s=d.length,l=0;l<d.length;d.length===s||(0,A.i)(d),++l){i=d[l]
B.a.aD(i,new A.lr())
for(h=i.length-1;h>0;h=g){g=h-1
m=i.length
if(!(g<m))return A.a(i,g)
f=i[g]
if(!(h<m))return A.a(i,h)
e=i[h]
if(f.a!==e.a)continue
f.b=(f.b|e.b)>>>0
f.c=B.ah.cS(f.c,e.c)
f.d=B.ah.cS(f.d,e.d)
B.a.bN(i,h)}}return d},
jW:function jW(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
h0:function h0(a,b){this.a=a
this.b=b},
jY:function jY(){},
bt:function bt(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=0},
b1:function b1(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
hF:function hF(a){var _=this
_.a=a
_.f=_.e=_.d=_.c=$},
ls:function ls(a,b){this.a=a
this.b=b},
lt:function lt(a){this.a=a},
lm:function lm(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ln:function ln(a){this.a=a},
lo:function lo(a){this.a=a},
lp:function lp(a,b){this.a=a
this.b=b},
lq:function lq(){},
lr:function lr(){},
b3(a,b){var s,r,q,p,o=a.length,n=(o/3|0)-1
for(s=0;s<=n;){r=B.b.I(s+n,1)
q=r*3
if(!(q<o))return A.a(a,q)
if(b<a[q])n=r-1
else{p=q+1
if(!(p<o))return A.a(a,p)
if(b>a[p])s=r+1
else{p=q+2
if(!(p<o))return A.a(a,p)
return a[p]}}}return 0},
f7(a,b,c){var s,r,q,p,o=a.length,n=B.b.a0(o,b)-1
for(s=0;s<=n;){r=B.b.I(s+n,1)
q=r*b
if(!(q<o))return A.a(a,q)
p=a[q]
if(c<p)n=r-1
else if(c>p)s=r+1
else return q}return-1},
xX(a){var s=A.b3(B.a2,a)
return s>=1&&s<=3},
rX(a){var s,r=A.b3(B.bA,a)
if(r===8)return 0
if(r!==0)return r
s=A.b3(B.a2,a)
return s===1||s===3||s===5?1:0},
xw(a){var s,r,q,p,o=a-44032
if(o>=0&&o<11172){s=B.b.P(o,28)
return s!==0?new A.e(a-s,4519+s):new A.e(4352+B.b.C(o,588),4449+B.b.C(B.b.P(o,588),28))}r=A.f7(B.T,3,a)
if(r<0)q=null
else{q=r+1
if(!(q<6243))return A.a(B.T,q)
q=B.T[q]
p=r+2
if(!(p<6243))return A.a(B.T,p)
p=new A.e(q,B.T[p])
q=p}return q},
xn(a,b){var s,r,q,p,o,n,m,l,k,j=a-4352,i=b-4449
if(j>=0&&j<19&&i>=0&&i<21)return 44032+(j*21+i)*28
s=a-44032
r=b-4519
if(s>=0&&s<11172&&B.b.P(s,28)===0&&r>0&&r<28)return a+r
for(q=0,p=960;q<=p;){o=B.b.I(q+p,1)
n=o*3
if(!(n<2883))return A.a(B.L,n)
m=B.L[n]
l=n+1
if(!(l<2883))return A.a(B.L,l)
k=B.L[l]
if(a>=m)l=a===m&&b<k
else l=!0
if(l)p=o-1
else if(a>m||b>k)q=o+1
else{l=n+2
if(!(l<2883))return A.a(B.L,l)
return B.L[l]}}return null},
X:function X(a,b){this.a=a
this.b=b},
q1(a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=a9.length,a3=a2/12|0,a4=a3*4,a5=new Float32Array(a4),a6=new Float32Array(256),a7=new Int32Array(256)
for(s=a8.length,r=0;r<a3;++r){q=r*12
p=q+4
if(!(p<a2))return A.a(a9,p)
o=B.c.N(a9[p])
p=q+5
if(!(p<a2))return A.a(a9,p)
for(p=o+B.c.N(a9[p]),n=o,m=1/0,l=1/0,k=-1/0,j=-1/0;n<p;++n){i=n*4
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
g=B.c.U(l/4096*16)
if(g<0)f=0
else f=g>=16?15:g
p=j/4096*16
i=k/4096*16
h=m/4096*16
for(;;){g=B.c.U(p)
if(g<0)e=0
else e=g>=16?15:g
if(!(f<=e))break
g=B.c.U(h)
if(g<0)d=0
else d=g>=16?15:g
e=f*16
for(;;){g=B.c.U(i)
if(g<0)c=0
else c=g>=16?15:g
if(!(d<=c))break
g=e+d
if(!(g>=0&&g<256))return A.a(a7,g)
c=a7[g]
if(!(g<256))return A.a(a7,g)
a7[g]=c+1
c=a6[g]
if(!(q<a2))return A.a(a9,q)
c=Math.max(c,a9[q])
if(!(g<256))return A.a(a6,g)
a6[g]=c;++d}++f}}b=new Float32Array(257)
for(g=0;g<256;g=a){a=g+1
a2=b[g]
s=a7[g]
if(!(a<257))return A.a(b,a)
b[a]=a2+s}a2=B.c.N(b[256])
a0=new Float32Array(a2)
a1=new Int32Array(256)
for(r=0;r<a3;++r){s=r*4
p=s+1
if(!(p<a4))return A.a(a5,p)
g=B.c.U(a5[p]/4096*16)
if(g<0)f=0
else f=g>=16?15:g
p=s+3
if(!(p<a4))return A.a(a5,p)
i=s+2
for(;;){g=B.c.U(a5[p]/4096*16)
if(g<0)h=0
else h=g>=16?15:g
if(!(f<=h))break
if(!(s<a4))return A.a(a5,s)
g=B.c.U(a5[s]/4096*16)
if(g<0)d=0
else d=g>=16?15:g
if(!(i<a4))return A.a(a5,i)
h=f*16
for(;;){g=B.c.U(a5[i]/4096*16)
if(g<0)e=0
else e=g>=16?15:g
if(!(d<=e))break
g=h+d
if(!(g>=0&&g<257))return A.a(b,g)
e=B.c.N(b[g])
if(!(g<256))return A.a(a1,g)
c=a1[g]
if(!(g<256))return A.a(a1,g)
a1[g]=c+1
c=e+c
if(!(c>=0&&c<a2))return A.a(a0,c)
a0[c]=r;++d}++f}}return new A.i4(a5,b,a0,a6)},
i4:function i4(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
d5:function d5(a,b,c){this.a=a
this.b=b
this.c=c},
b7:function b7(a,b,c,d,e,f,g,h,i,j){var _=this
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
c7:function c7(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
uQ(a,b){var s,r,q,p,o,n,m,l,k,j,i=A.b([],t.d2)
for(s=b.d.ga7(),s=s.gp(s),r=t.u,q=t.j,p=t.s,o=t.G;s.l();){n=s.gn()
m=n.a
l=n.b
n=new A.hL(m)
l=q.b(l)?l:B.a3
k=J.n(l)
j=k.gB(l)?null:k.gt(l)
n.b=r.a(A.t(k.gk(l)>1?k.h(l,1):null))
n.c=r.a(A.t(typeof j=="string"?A.b([j,A.b(["accumulated"],p),A.b(["get",m],p)],o):j))
i.push(n)}i=new A.jF(b,i,new A.z(B.e,B.e),A.A(t.S,t.el))
i.eR(a,b)
return i},
i7:function i7(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
hL:function hL(a){this.a=a
this.c=this.b=$},
b8:function b8(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=null
_.f=0},
jF:function jF(a,b,c,d){var _=this
_.a=a
_.b=$
_.c=b
_.d=c
_.e=1
_.f=d},
jH:function jH(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jG:function jG(a){this.a=a},
q2(a,b,c,d,e,f,g,h,i){f.byteLength
return new A.fi(h,i,a,b,c,d,e,f,g)},
u9(a,b,c){var s,r,q,p,o,n=A.b([],t.n),m=A.b([],t.X),l=new A.h4(13,4096/c,n,m)
for(s=b.length,r=0;q=r+2,q<s;r+=3){if(!(r<s))return A.a(b,r)
p=b[r]
o=r+1
if(!(o<s))return A.a(b,o)
l.dZ(0,a,p,b[o],b[q])}return new A.e(new Float32Array(A.N(n)),new Uint32Array(A.N(m)))},
fi:function fi(a,b,c,d,e,f,g,h,i){var _=this
_.e=a
_.f=b
_.r=c
_.w=d
_.x=e
_.y=f
_.z=g
_.a=h
_.b=i},
fw:function fw(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
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
ic:function ic(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
id:function id(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
qb(a,b,c,d,e,f){var s,r=A.b([],t.hu),q=A.b([],t.r),p=c!=null,o=b==null,n=Math.min(128,(o?128:b)*4096/512)
o=o?128:b
s=d==null?null:A.mv(d)
o=new A.bE(f,e,s,new A.z(B.e,B.e),r,p,q,n,o*4096/512)
o.dg(a)
if(p)o.x=A.uQ(q,c)
return o},
ue(a){var s,r,q,p,o,n,m=a.length,l=m-2
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
fz(a){var s,r,q,p,o,n,m,l,k,j,i=J.n(a),h=i.gk(a)*2,g=new Float64Array(h)
for(i=i.gp(a),s=t.j,r=0;i.l();){q=i.gn()
if(!s.b(q)||J.S(q)<2)continue
p=J.n(q)
o=p.gk(q)>=2
if(o){n=p.h(q,0)
m=p.h(q,1)}else{n=null
m=null}if(!o)throw A.f(A.bp("Pattern matching error"))
if(typeof n!="number"||typeof m!="number")continue
l=r+1
if(!(r<h))return A.a(g,r)
g[r]=(n+180)/360
r=l+1
k=Math.sin(m*3.141592653589793/180)
j=0.5-0.25*Math.log((1+k)/(1-k))/3.141592653589793
if(isNaN(j))p=k>0?0:1
else p=B.c.H(j,0,1)
if(!(l<h))return A.a(g,l)
g[l]=p}return r===h?g:A.bC(g,0,r)},
bE:function bE(a,b,c,d,e,f,g,h,i){var _=this
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
ir:function ir(a,b,c){this.a=a
this.b=b
this.c=c},
iq:function iq(a){this.a=a},
is:function is(a,b){this.a=a
this.b=b},
hs:function hs(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
hz:function hz(a){this.a=a},
dy:function dy(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
iI:function iI(){},
fD(a,b){var s=new A.iK(),r=s.$1(a)
s=s.$1(b)
if(typeof s!=="number")return s.ag()
if(typeof r!=="number")return r.af()
return r+s*4096},
ui(a){var s,r,q,p,o,n,m,l
A:{s=a instanceof A.bB
r=null
q=!1
if(s){p=a.cx==null
if(p){r=!a.dx
q=r}o=p}else{p=null
o=!1}if(q){q=0
break A}if(s)q=o?r:!a.dx
else q=!1
if(q){q=2
break A}if(a instanceof A.d6){q=3
break A}if(a instanceof A.cE){q=6
break A}q=a instanceof A.dm
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
qi(a,b){var s
if(a==null)s=null
else{if(!(b<a.length))return A.a(a,b)
s=a[b]}switch(s){case 0:s=0
break
case 1:s=127
break
case 3:s=1
break
case 4:s=2
break
case 5:s=125
break
case 6:s=126
break
default:s=64
break}return s},
qj(f7,f8,f9,g0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5=null,f6=new A.z(B.e,B.e)
f6.a=g0
s=A.A(t.S,t.ke)
for(r=f8.length,q=t.hD,p=0;p<f8.length;f8.length===r||(0,A.i)(f8),++p){o=f8[p]
n=o.a
m=s.h(0,n)
if(m==null){m=A.b([],q)
s.m(0,n,m)
n=m}else n=m
B.a.j(n,o)}l=new A.aO(new Float64Array(16384))
k=new A.iN(new Uint32Array(16384))
j=A.b([],t.cm)
r=t.X
i=A.b([],r)
q=f7.ay
n=q.length+1
h=new Int32Array(n)
g=A.b([],t.iv)
for(m=t.dn,f=t.if,e=t.n,d=0,c=0,b=0;a=q.length,b<a;++b){a=k.b
if(!(b<n))return A.a(h,b)
h[b]=a
a0=q[b]
a1=A.ui(a0)
if(a1<0)continue
a=s.h(0,a0.b)
if(a==null)a=B.al
a2=a.length
a3=a1!==0
a4=a1*16384
a5=a1!==1
a6=a1===5
a7=a1!==3
a8=a1===6
a9=a1!==4
b0=a1===2
b1=a0 instanceof A.d6
p=0
for(;p<a.length;a.length===a2||(0,A.i)(a),++p){o=a[p]
b2=o.b
b3=!a7||a8
if(!b3&&b2.d.length===0)continue
if(b3&&b2.b.length===0)continue
b4=j.length
if(b4-c>=80){B.a.v(i,A.b([d,k.b-d,c],r))
d=k.b
c=j.length
b4=c}b5=b4-c
b4=o.c
B.a.j(j,new A.e(b,b4))
b6=B.b.C(l.b,6)
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
f6.sa8(b4==null?B.e:b4)
b4=a0.dy
b4=b4==null?f5:b4.$1(f6)
if(!(typeof b4=="number"))if(typeof b4=="string")b4=A.L(b4)
else if(A.E(b4))b4=b4?1:0
else b4=f5
if(b4==null)b4=0
c8=Math.max(0,b4)}else{c7=0
c8=0}for(b4=b5+a4,c9=0;c9<c5;++c9){d0=B.b.C(l.b,6)
for(c6=c9*2,d1=c6+1,d2=0;d2<4;++d2){d3=B.bH[d2]
if(!(c6<c3))return A.a(b7,c6)
d4=b7[c6]
if(!(d1<c3))return A.a(b7,d1)
l.ah(d4,b7[d1],A.fD(d3.a,d3.b),c8)
l.aG(b4,c7)}for(d2=0;d2<6;++d2)k.j(0,d0+B.ci[d2])}continue}d5=!a5||!a9||a6?0:f9
if(d5>0){d6=A.b([],e)
b4=A.b([],r)
d7=new A.h4(8,4096/d5,d6,b4)
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
e3=A.qi(c4,c9)
if(!(e2<c6))return A.a(d8,e2)
d8[e2]=e3}e8=b2.d
for(c3=e8.length,e9=0;c6=e9+2,c6<c3;e9+=3){if(!(e9<c3))return A.a(e8,e9)
d3=e8[e9]
d9=e9+1
if(!(d9<c3))return A.a(e8,d9)
d7.dZ(0,d8,d3,e8[d9],e8[c6])}for(c3=b5+a4,c9=0;c6=d6.length,c9<(c6/8|0);++c9){f0=c9*8
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
e2=A.fD(e1,d6[e2])
c6=e2}if(c2){e1=f0+4
if(!(e1<d6.length))return A.a(d6,e1)
e1=d6[e1]}else if(d4)e1=0
else{e1=f0+4
e2=d6.length
if(!(e1<e2))return A.a(d6,e1)
e1=d6[e1]
e3=f0+5
if(!(e3<e2))return A.a(d6,e3)
e3=A.fD(e1,d6[e3])
e1=e3}l.ah(d3,d9,c6,e1)
e1=f0+7
if(!(e1<d6.length))return A.a(d6,e1)
e1=B.b.H(B.c.M(d6[e1]),0,127)
if(d1)c6=0
else{c6=f0+6
if(!(c6<d6.length))return A.a(d6,c6)
c6=d6[c6]}l.aG(c3+e1*131072,c6)}for(c3=b4.length,d2=0;d2<b4.length;b4.length===c3||(0,A.i)(b4),++d2)k.j(0,b6+b4[d2])
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
e3=A.fD(e3,b9[e0])
e2=e3}if(c2){if(!(d4<c1.length))return A.a(c1,d4)
e0=c1[d4]}else if(d1)e0=0
else{e3=c0.length
if(!(d4<e3))return A.a(c0,d4)
e4=c0[d4]
if(!(e0<e3))return A.a(c0,e0)
e0=A.fD(e4,c0[e0])}l.ah(d9,e1,e2,e0)
e0=A.qi(c4,c9)
if(b4)d4=0
else{d4+=c2?1:0
if(!(d4<c1.length))return A.a(c1,d4)
d4=c1[d4]}l.aG(c6+e0*131072,d4)}for(b4=b2.d,c3=b4.length,d2=0;d2<c3;++d2)k.j(0,b6+b4[d2])
f1=b2.a
if((!a3||b0)&&f1!=null&&f.a(a0).db!=null){f2=i.length/3|0
if(g.length!==0&&B.a.gE(g).a===b&&B.a.gE(g).b===f2)f3=B.a.gE(g).c
else{B.a.j(g,new A.M(b,f2,A.b([],r)))
f3=B.a.gE(g).c}for(b4=f1.length,d2=0;d2<b4;++d2)B.a.j(f3,b6+f1[d2])}}}q=k.b
if(q===0)return f5
if(!(a<n))return A.a(h,a)
h[a]=q
B.a.v(i,A.b([d,q-d,c],r))
f4=A.b([],r)
for(q=g.length,p=0;p<g.length;g.length===q||(0,A.i)(g),++p){n=g[p]
f3=n.c
m=J.n(f3)
if(m.gB(f3))continue
B.a.v(f4,A.b([n.a,n.b,k.b,m.gk(f3)],r))
for(n=m.gp(f3);n.l();)k.j(0,n.gn())}r=new Float32Array(A.N(A.bC(l.a,0,l.b)))
q=B.o.F(k.a,0,k.b)
n=new Int32Array(A.N(i))
m=new Int32Array(A.N(f4))
r.byteLength
return new A.iJ(m,h,j,n,r,q)},
iJ:function iJ(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.r=c
_.w=d
_.a=e
_.b=f},
iK:function iK(){},
iX:function iX(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=!1
_.e=d},
iY:function iY(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
rZ(a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=A.b([],t.k9),c=t.N,b=t.S,a=A.A(c,b),a0=A.A(c,b),a1=new A.oc()
for(c=J.B(a2),b=t.Y;c.l();){s=c.gn()
r=A.b([B.a.gt(s.x)],b)
q=s.c
p=a1.$3$end(q,B.a.gt(r),!1)
o=a1.$3$end(q,B.a.gE(r),!0)
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
B.a.v(l,r)
B.a.v(l,s.b)
B.a.m(d,m,null)
a0.a5(0,p)
a.a5(0,o)
a0.m(0,a1.$3$end(q,B.a.gE(l),!0),n)}else if(l){if(n>>>0!==n||n>=d.length)return A.a(d,n)
B.a.v(d[n].b,r)
a0.a5(0,p)
a0.m(0,o,n)}else if(m!=null){if(m>>>0!==m||m>=d.length)return A.a(d,m)
B.a.en(d[m].b,0,r)
a.a5(0,o)
a.m(0,p,m)}else{B.a.j(d,new A.e(s,r))
a.m(0,p,d.length-1)
a0.m(0,o,d.length-1)}}c=A.b([],t.gw)
for(s=d.length,q=t.E,l=t.iu,k=0;k<d.length;d.length===s||(0,A.i)(d),++k){j=d[k]
if(q.b(j)){i=j.a
h=A.b([A.wx(l.a(j.b))],b)
g=i.x
f=A.D(g)
e=new A.bM(g,1,null,f.i("bM<1>"))
e.d_(g,1,null,f.c)
B.a.v(h,e)
i.siR(h)
c.push(i)}}return c},
wx(a){var s,r,q,p,o,n=J.n(a)
if(n.gk(a)===1)return n.gt(a)
s=A.W(n.gt(a),t.i)
for(n=n.T(a,1),r=n.$ti,n=new A.a1(n,n.gk(0),r.i("a1<V.E>")),r=r.i("V.E");n.l();){q=n.d
if(q==null)q=r.a(q)
p=A.a7(q)
o=new A.bM(q,2,null,p.i("bM<y.E>"))
o.d_(q,2,null,p.i("y.E"))
B.a.v(s,o)}return new Float32Array(A.N(s))},
xk(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=4096,f={},e=new A.mt(),d=A.b([],t.Y)
f.a=null
s=new A.ms(f,d)
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
m=0}l=n<0
if(l&&k<0)continue
if(l){o=e.$1(o+(m-o)*((0-n)/(k-n)))
n=0}else if(k<0){m=e.$1(o+(m-o)*((0-n)/(k-n)))
k=0}l=o>=4096
if(l&&m>=4096)continue
if(l){n=e.$1(n+(k-n)*((4096-o)/(m-o)))
o=g}else if(m>=4096){k=e.$1(n+(k-n)*((4096-o)/(m-o)))
m=g}l=n>=4096
if(l&&k>=4096)continue
if(l){o=e.$1(o+(m-o)*((4096-n)/(k-n)))
n=g}else if(k>=4096){m=e.$1(o+(m-o)*((4096-n)/(k-n)))
k=g}j=f.a
l=!0
if(j!=null){i=j.length
h=i-2
if(!(h>=0))return A.a(j,h)
if(j[h]===o){l=i-1
if(!(l>=0))return A.a(j,l)
l=j[l]!==n}}if(l){s.$0()
l=f.a=A.b([o,n],q)}else l=j
B.a.v(l,A.b([m,k],q))}s.$0()
return d},
pj(a){var s,r,q,p,o,n
for(s=a.length,r=0,q=2;q<s;q+=2){p=a[q]-a[q-2]
o=q+1
if(!(o<s))return A.a(a,o)
n=a[o]-a[q-1]
r+=Math.sqrt(p*p+n*n)}return r},
y_(a,b,c,d,e,f,g){var s,r,q,p=a.length
if(0>=p)return A.a(a,0)
s=a[0]
r=!0
if(s!==0)if(s!==4096){if(1>=p)return A.a(a,1)
p=a[1]
p=p===0||p===4096
r=p}p=b/4
if(b-c<p)b=c+p
q=A.pm(a,r?B.c.P(b/2*g,b):B.c.P((c/2+d)*g,b),b,c,e,f)
if(q.length===0&&!r)return A.pm(a,A.pj(a)/2,b,c,e,f)
return q},
pm(a4,a5,a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a7/2,a=A.pj(a4),a0=A.b([],t.eL),a1=isFinite(a6),a2=a1?a5-a6:a5,a3=a1?a6:0
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
e=B.c.L(m+j*f)
d=B.c.L(l+n*f)
c=!1
if(e>=0)if(e<4096)if(d>=0)if(d<4096)if(g-b>=0)if(g+b<=a)c=!s||A.vU(a4,B.b.C(o,2)-1,e,d,a7,a8,a9)
if(c)B.a.j(a0,new A.M(e,d,Math.atan2(n,j)))
if(a1){a2=g
p=!0
break}}o+=2
q=h}return a0},
vU(a,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
if(a3===0)return!0
s=new A.lK(a)
r=new A.lL(a)
q=new A.lJ()
p=a0+1
for(o=-a3/2,n=a2,m=a1,l=0;l>o;){--p
if(p<0)return!1
k=q.$4(s.$1(p),r.$1(p),m,n)
if(typeof k!=="number")return A.a6(k)
l-=k
m=s.$1(p)
n=r.$1(p)}j=p+1
o=q.$4(s.$1(p),r.$1(p),s.$1(j),r.$1(j))
if(typeof o!=="number")return A.a6(o)
l+=o
i=A.b([],t.I)
h=a.length/2|0
for(o=a3/2,p=j,g=0;l<o;p=j){j=p+1
if(j>=h)return!1
k=r.$1(p)
f=p-1
e=r.$1(f)
if(typeof k!=="number")return k.b0()
if(typeof e!=="number")return A.a6(e)
d=s.$1(p)
f=s.$1(f)
if(typeof d!=="number")return d.b0()
if(typeof f!=="number")return A.a6(f)
c=Math.atan2(k-e,d-f)
f=r.$1(j)
d=r.$1(p)
if(typeof f!=="number")return f.b0()
if(typeof d!=="number")return A.a6(d)
e=s.$1(j)
k=s.$1(p)
if(typeof e!=="number")return e.b0()
if(typeof k!=="number")return A.a6(k)
b=Math.abs(B.c.P(c-Math.atan2(f-d,e-k)+9.42477796076938,6.283185307179586)-3.141592653589793)
B.a.j(i,new A.e(l,b))
g+=b
while(l-B.a.gt(i).a>a4)g-=B.a.bN(i,0).b
if(g>a5)return!1
k=q.$4(s.$1(p),r.$1(p),s.$1(j),r.$1(j))
if(typeof k!=="number")return A.a6(k)
l+=k}return!0},
pu(a,b,a0,a1,a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=a6?0.6*a0:0
for(s=a.length,r=2*a0,q=t.Y,p=0;p<a.length;a.length===s||(0,A.i)(a),++p){o=a[p]
n=b?A.b([o],q):A.xk(o)
m=n.length
l=0
for(;l<n.length;n.length===m||(0,A.i)(n),++l){k=n[l]
j=b?A.pm(k,A.pj(k)/2,1/0,a1,c,a2):A.y_(k,a5,a1,r,c,a2,a3)
for(i=j.length,h=0;h<j.length;j.length===i||(0,A.i)(j),++h){g=j[h]
f=g.a
e=g.b
if(b)d=!(f>=0&&f<4096&&e>=0&&e<4096)
else d=!1
if(d)continue
a4.$4(f,e,g.c,k)}}}},
t5(a,b,c,d){var s,r,q,p,o,n=b.d/2,m=b.c,l=a.h(0,m)
if(l==null){l=A.b([],t.I)
a.m(0,m,l)}for(m=l.length,s=n*n,r=0;r<m;++r){q=l[r]
p=q.a-c
o=q.b-d
if(p*p+o*o<s)return!0}B.a.j(l,new A.e(c,d))
return!1},
cJ:function cJ(a,b,c,d,e,f,g,h,i,j){var _=this
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
oc:function oc(){},
mt:function mt(){},
ms:function ms(a,b){this.a=a
this.b=b},
lK:function lK(a){this.a=a},
lL:function lL(a){this.a=a},
lJ:function lJ(){},
xv(a){var s,r,q,p,o,n,m,l,k=A.b([],t.c),j=new A.jm(a)
try{for(o=a.length;j.b<o;){s=j.A()
n=j.b
m=s
if(typeof m!=="number")return A.a6(m)
r=n+m
n=r
if(typeof n!=="number")return n.eI()
if(n>o)throw A.f(B.bs)
q=j.A()
if(J.l(q,1)||J.l(q,2)){p=A.wN(j)
if(p!=null)J.fd(k,p)}j.siJ(r)}}catch(l){if(t.b0.b(A.aG(l)))throw A.f(B.bk)
else throw l}return k},
r_(a,b){var s,r,q,p,o=a.A()
if(o>=10)s=a.aM()
else if(b)throw A.f(A.de("MLT field type "+o,null,null))
else s=o<4?"id":"geometry"
r=A.b([],t.c8)
if(o===30||o===31)for(q=a.A(),p=0;p<q;++p)B.a.j(r,A.r_(a,!0))
return new A.ho(o,s,r)},
wN(a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=null,a1=a4.aM(),a2=a4.A(),a3=A.b([],t.c8)
for(s=a4.A(),r=0;r<s;++r)a3.push(A.r_(a4,!1))
q=A.b([],t.s)
p=A.b([],t.D)
for(o=a3.length,n=t.aV,m=a0,l=m,k=0,j=0;j<a3.length;a3.length===o||(0,A.i)(a3),++j){i=a3[j]
h=i.a
if(h<4){g=(h&1)===1?A.fa(a4,A.au(a4)):a0
f=A.au(a4)
k=g==null?a0:g.length
if(k==null){e=f.w
e===$&&A.h()
k=e}l=J.bx(A.mj(A.hN((h&2)!==0?A.hR(a4,f,!1):A.aI(a4,f,!1),k,g),g),n)}else if(h===4){m=A.uz(a4,a4.A(),k)
if(k===0)k=m.a.length}else{e=h>=10
if(e&&h<30){d=B.b.I(h-10,1)
c=d===9?a4.A():1
if(c===0)continue
b=e&&h<30
g=(b?(h&1)===1:h===31)?A.fa(a4,A.au(a4)):a0
B.a.j(q,i.b)
e=e&&h<30
B.a.j(p,A.wU(a4,d,(e?(h&1)===1:h===31)?c-1:c,g,k))}else if(h===30){if(a4.A()===0)continue
for(h=A.wW(a4,i),e=h.length,a=0;a<h.length;h.length===e||(0,A.i)(h),++a){d=h[a]
B.a.j(q,d.a)
B.a.j(p,d.b)}}else if(h===31){c=a4.A()
if(c===0)continue
for(h=A.wE(a4,i,c),e=h.length,a=0;a<h.length;h.length===e||(0,A.i)(h),++a){d=h[a]
B.a.j(q,d.a)
B.a.j(p,d.b)}}else break}}if(m==null)return a0
a3=new A.hD(a1,a2,l,q,p,m)
a3.eU(a1,a2,l,q,p,m)
return a3},
wU(a,b,c,d,e){var s,r,q,p,o,n,m,l,k
if(b===9)return A.rF(a,c,d)
s=A.au(a)
r=a.b
A:{if(0===b){q=[]
for(p=A.fa(a,s),o=p.length,n=0;n<o;++n)q.push(p[n]===1)
m=q
break A}if(1===b||3===b){m=A.hN(A.aI(a,s,!0),e,d)
break A}if(2===b||4===b){m=A.hN(A.aI(a,s,!1),e,d)
break A}if(5===b){m=A.hN(A.hR(a,s,!0),e,d)
break A}if(6===b){m=A.hN(A.hR(a,s,!1),e,d)
break A}if(7===b){q=s.r
q===$&&A.h()
l=A.c8(a.a,r,r+q)
q=[]
k=0
for(;;){p=s.f
p===$&&A.h()
if(!(k<p))break
q.push(l.getFloat32(k*4,!0));++k}m=q
break A}if(8===b){q=s.r
q===$&&A.h()
l=A.c8(a.a,r,r+q)
q=[]
k=0
for(;;){p=s.f
p===$&&A.h()
if(!(k<p))break
q.push(l.getFloat64(k*8,!0));++k}m=q
break A}throw A.f(A.de("MLT scalar type "+b,null,null))}q=s.r
q===$&&A.h()
a.b=r+q
return A.mj(m,d)},
hN(a,b,c){var s=c==null?b:B.E.bI(c,0,new A.lU(),t.S),r=a.length
if(r!==1||s<=1)return a
if(0>=r)return A.a(a,0)
return A.a9(s,a[0],!1,t.S)},
mj(a,b){var s,r,q,p,o
if(b==null)return a
s=[]
for(r=b.length,q=0,p=0;p<r;++p)if(b[p]===1&&q<a.length){o=q+1
if(!(q<a.length))return A.a(a,q)
s.push(a[q])
q=o}else s.push(null)
return s},
rF(a,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=null
for(s=a.a,r=a1,q=b,p=q,o=p,n=o,m=n,l=m,k=l,j=0;j<a0;++j){i=A.au(a)
h=i.a
h===$&&A.h()
switch(h){case 0:g=A.fa(a,i)
if(r==null)r=g
break
case 2:k=A.aI(a,i,!1)
break
case 3:f=A.rz(A.aI(a,i,!1))
h=i.b
h===$&&A.h()
switch(h){case 6:l=f
break
case 5:m=f
break
default:n=f}break
case 1:h=a.b
e=i.r
e===$&&A.h()
d=A.bQ(s,h,h+e)
a.b+=e
A:{h=i.b
h===$&&A.h()
if(5===h){p=d
break A}if(1===h||2===h){o=d
break A}if(0===h)q=d}break
default:h=a.b
e=i.r
e===$&&A.h()
a.b=h+e}}if(p!=null&&o!=null){m.toString
o=A.rs(p,m,o)}if(o!=null){l.toString
s=A.ps(o,l)
k.toString
return A.pl(s,k,r)}if(q==null||n==null)return B.a3
c=A.ps(q,n)
if(k!=null)return A.pl(c,k,r)
return A.mj(c,r)},
pl(a,b,c){var s,r,q,p,o=[]
for(s=b.length,r=0;r<s;++r){q=b[r]
p=a.length
if(q<p){if(!(q>=0))return A.a(a,q)
p=a[q]}else p=null
o.push(p)}return A.mj(o,c)},
ps(a,b){var s,r,q,p,o,n,m=A.b([],t.s)
for(s=b.length,r=t.L,q=a.length,p=0;o=p+1,o<s;p=o){if(!(p<s))return A.a(b,p)
n=r.a(A.bQ(a,Math.min(b[p],q),Math.min(b[o],q)))
m.push(new A.f1(!0).c2(n,0,null,!0))}return m},
rz(a){var s,r,q,p,o=a.length,n=o+1,m=new Uint32Array(n)
for(s=0;s<o;s=r){r=s+1
q=m[s]
p=a[s]
if(!(r<n))return A.a(m,r)
m[r]=q+p}return m},
wW(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=null
for(s=a.a,r=b,q=r,p=q,o=p;q==null;){n=A.au(a)
m=n.a
m===$&&A.h()
if(m===3){l=A.rz(A.aI(a,n,!1))
m=n.b
m===$&&A.h()
if(m===6)o=l
else p=l}else{k=a.b
j=n.r
j===$&&A.h()
i=A.bQ(s,k,k+j)
a.b+=j
if(m===1){m=n.b
m===$&&A.h()
m=m===1||m===2}else m=!1
if(m)q=i
else r=i}}if(r!=null){p.toString
q=A.rs(r,p,q)}o.toString
h=A.ps(q,o)
g=A.b([],t.mH)
for(s=a0.c,m=s.length,k=a0.b,f=0;f<s.length;s.length===m||(0,A.i)(s),++f){e=s[f]
if(a.A()===0)continue
j=e.a
if(j>=4)d=j>=10&&j<30
else d=!0
c=(d?(j&1)===1:j===31)?A.fa(a,A.au(a)):b
B.a.j(g,new A.e(k+e.b,A.pl(h,A.aI(a,A.au(a),!1),c)))}return g},
wE(a9,b0,b1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6=null,a7=b0.c,a8=t.s
if(a7.length===0)s=A.b([b0.b],a8)
else{a8=A.b([],a8)
for(r=a7.length,q=b0.b,p=0;p<a7.length;a7.length===r||(0,A.i)(a7),++p)a8.push(q+a7[p].b)
s=a8}a7=a9.a
a8=a9.b++
r=a7.length
if(!(a8<r))return A.a(a7,a8)
o=a7[a8]
n=A.aI(a9,A.au(a9),!1)
m=b1-1
l=[]
if((o&1)!==0){a8=a9.b++
if(!(a8<r))return A.a(a7,a8)
k=a7[a8]
B.a.v(l,A.rF(a9,k,a6))
m-=k}if((o&2)!==0){B.a.v(l,A.aI(a9,A.au(a9),!0));--m}else if((o&8)!==0){B.a.v(l,A.hR(a9,A.au(a9),!0));--m}if((o&4)!==0){B.a.v(l,A.aI(a9,A.au(a9),!1));--m}else if((o&16)!==0){B.a.v(l,A.hR(a9,A.au(a9),!1));--m}for(a8=[B.dM,B.dX],r=a8.length,p=0;p<r;++p){q=a8[p]
if((o&q.a)===0)continue
j=A.au(a9)
i=a9.b
h=j.r
h===$&&A.h()
g=A.c8(a7,i,i+h)
q=q.b===4
f=0
for(;;){i=j.f
i===$&&A.h()
if(!(f<i))break
l.push(q?g.getFloat32(f*4,!0):g.getFloat64(f*8,!0));++f}a9.b+=h;--m}if((o&128)!==0){e=A.fa(a9,A.au(a9));--m}else e=a6
d=m>0?A.aI(a9,A.au(a9),!1):B.U
a7=e==null
a8=a7?a6:e.length
if(a8==null)a8=n.length
c=B.b.a0(a8,s.length)
b=A.b([],t.mH)
for(a8=n.length,r=t.O,a7=!a7,a=0,a0=0,a1=0;a1<s.length;++a1){a2=A.a9(c,a6,!1,r)
for(q=a1*c,a3=0;a3<c;++a3){if(a7){i=q+a3
if(!(i<e.length))return A.a(e,i)
i=e[i]===0}else i=!1
if(i)continue
a4=a+1
if(!(a>=0&&a<a8))return A.a(n,a)
a5=a0+n[a]
i=d.length
if(a5>i)throw A.f(B.bt)
if(a5-a0!==1){if(!(a0>=0&&a0<i))return A.a(d,a0)
i=d[a0]===3}else i=!0
B.a.m(a2,a3,i?new A.hE(d,l).cN(a0,a5).a:new A.hE(d,l).ei(a0,a5))
a0=a5
a=a4}if(!(a1<s.length))return A.a(s,a1)
B.a.j(b,new A.e(s[a1],a2))}return b},
rs(a,b,c){var s,r,q,p,o,n,m,l,k,j=c.length,i=j*8,h=new Uint8Array(i)
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
ho:function ho(a,b,c){this.a=a
this.b=b
this.c=c},
lU:function lU(){},
hE:function hE(a,b){this.a=a
this.b=b},
hD:function hD(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=$},
hC:function hC(a,b){this.a=a
this.b=b},
uz(a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=null,a=A.aI(a1,A.au(a1),!1),a0=a.length
if(a0===1&&a3>1){s=new Uint32Array(a3)
if(0>=a0)return A.a(a,0)
B.o.ak(s,0,a3,a[0])
a=s}for(a0=a2-1,r=b,q=r,p=q,o=p,n=o,m=n,l=!1,k=0;k<a0;++k){j=A.au(a1)
i=j.a
i===$&&A.h()
switch(i){case 3:h=A.aI(a1,j,!1)
i=j.b
i===$&&A.h()
switch(i){case 1:m=h
break
case 2:n=h
break
case 3:o=h
break}break
case 2:g=A.aI(a1,j,!1)
i=j.b
i===$&&A.h()
if(i===0)p=g
if(i===1)l=!0
break
case 1:i=j.b
i===$&&A.h()
if(i===4){q=A.aI(a1,j,!1)
r=j}else q=A.aI(a1,j,!0)
break
default:i=a1.b
f=j.r
f===$&&A.h()
a1.b=i+f}}if(l)p=b
e=b
if(m!=null){d=A.pn(a,m,2)
a0=n!=null
if(a0&&o!=null){c=A.pi(a,d,n,!1)
e=A.wz(a,d,c,o)}else c=a0?A.pi(a,d,n,b):b}else{a0=n!=null
if(a0&&o!=null){c=A.pn(a,n,1)
e=A.pi(a,c,o,!0)}else c=a0?A.pn(a,n,0):b
d=b}if(q==null)a0=new Int32Array(0)
else a0=q
return A.vh(a,d,c,e,p,a0,r).hX()},
pn(a,b,c){var s,r,q,p,o,n,m,l=a.length,k=l+1,j=new Uint32Array(k)
for(s=b.length,r=0,q=0;q<l;q=p){p=q+1
o=j[q]
if(a[q]>c&&r<s){n=r+1
if(!(r<s))return A.a(b,r)
m=b[r]
r=n}else m=1
if(!(p<k))return A.a(j,p)
j[p]=o+m}return j},
pi(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e
if(B.o.gE(b)>16777216)throw A.f(B.bh)
s=B.o.gE(b)+1
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
wz(a,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
if(B.o.gE(a1)>16777216)throw A.f(B.bj)
s=B.o.gE(a1)+1
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
vh(a,b,c,d,e,f,g){var s=t.X,r=A.b([],s)
s=A.b([],s)
return new A.l_(a,b,c,d,e,f,g,J.oM(a,new A.l0()),r,s)},
rH(a,b){var s,r
for(s=0,r=0;r<b;++r)s=(s|B.b.aw(B.b.I(a,2*r)&1,r))>>>0
return s},
jn:function jn(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
l_:function l_(a,b,c,d,e,f,g,h,i,j){var _=this
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
l0:function l0(){},
au(a){var s,r,q,p,o=new A.jo(),n=a.a,m=a.b,l=a.b=m+1,k=n.length
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
q=o.f=a.A()
p=a.A()
o.r=p
o.w=q
if(l===4){o.y=a.A()
o.z=a.A()
n=q}else if((l===3||n===3)&&m!==0){o.x=a.A()
n=a.A()
o.w=n}else n=q
if(q>16777216||n>16777216||p>k-a.b)A.aF(B.bd)
return o},
fa(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=b.f
d===$&&A.h()
s=d+7>>>3
r=new Uint8Array(s)
q=a.b
p=b.r
p===$&&A.h()
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
B.E.ak(r,n,i,j)
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
aI(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a.b,d=b.e
d===$&&A.h()
switch(d){case 1:d=b.r
d===$&&A.h()
s=b.f
s===$&&A.h()
r=A.vk(a.a,e,d,s)
break
case 2:d=b.f
d===$&&A.h()
r=new Uint32Array(d)
for(q=0;q<d;++q)r[q]=a.A()
break
default:d=b.r
d===$&&A.h()
p=A.c8(a.a,e,e+d)
d=b.f
d===$&&A.h()
r=new Uint32Array(d)
for(q=0;q<d;++q)r[q]=p.getUint32(q*4,!0)}d=b.r
d===$&&A.h()
a.b=e+d
d=b.w
if(c){d===$&&A.h()
o=new Int32Array(d)}else{d===$&&A.h()
o=new Uint32Array(d)}d=b.c
d===$&&A.h()
switch(d){case 1:d=b.d
d===$&&A.h()
n=d===3?A.lW(r,b):r
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
d&2&&A.r(o)
if(!(q<m))return A.a(o,q)
o[q]=l;++q}break
case 3:i=A.lW(r,b)
d=o.$flags|0
s=i.length
m=o.length
q=0
for(;;){if(!(q<m&&q<s))break
if(c){if(!(q<s))return A.a(i,q)
k=i[q]
j=k>>>1
k=(k&1)===0?j:-j-1}else{if(!(q<s))return A.a(i,q)
k=i[q]}d&2&&A.r(o)
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
s&2&&A.r(o)
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
d&2&&A.r(o)
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
k=r[q]}d&2&&A.r(o)
if(!(q<m))return A.a(o,q)
o[q]=k;++q}}return o},
hR(a,b,c){var s,r,q,p,o,n,m,l,k,j=a.b,i=b.e
i===$&&A.h()
s=t.X
if(i===2){i=A.b([],s)
r=0
for(;;){s=b.f
s===$&&A.h()
if(!(r<s))break
i.push(a.A());++r}q=i}else{i=b.r
i===$&&A.h()
p=A.c8(a.a,j,j+i)
s=A.b([],s)
r=0
for(;;){i=b.f
i===$&&A.h()
if(!(r<i))break
i=r*8
s.push(p.getUint32(i+4,!0)*4294967296+p.getUint32(i,!0));++r}q=s}i=b.r
i===$&&A.h()
a.b=j+i
i=b.w
i===$&&A.h()
o=A.a9(i,0,!1,t.S)
s=b.c
s===$&&A.h()
switch(s){case 1:s=b.d
s===$&&A.h()
n=s===3?A.lW(q,b):q
m=0
r=0
for(;;){if(!(r<i&&r<n.length))break
if(!(r<n.length))return A.a(n,r)
s=n[r]
m+=(s&1)===0?B.b.C(s,2):-B.b.C(s+1,2)
B.a.m(o,r,m);++r}break
case 3:l=A.lW(q,b)
s=l.length
r=0
for(;;){if(!(r<i&&r<s))break
if(c){if(!(r<s))return A.a(l,r)
k=l[r]
k=(k&1)===0?B.b.C(k,2):-B.b.C(k+1,2)}else{if(!(r<s))return A.a(l,r)
k=l[r]}B.a.m(o,r,k);++r}break
default:r=0
for(;;){if(!(r<i&&r<q.length))break
s=q.length
if(c){if(!(r<s))return A.a(q,r)
s=q[r]
s=(s&1)===0?B.b.C(s,2):-B.b.C(s+1,2)}else{if(!(r<s))return A.a(q,r)
s=q[r]}B.a.m(o,r,s);++r}}return o},
lW(a,b){var s,r,q,p,o,n,m,l=b.x
if(l==null)l=a.length/2|0
s=b.w
s===$&&A.h()
r=A.a9(s,0,!1,t.S)
q=0
p=0
for(;;){if(!(p<l&&p+l<a.length))break
o=a.length
if(!(p<o))return A.a(a,p)
n=Math.min(q+a[p],s)
m=p+l
if(!(m<o))return A.a(a,m)
B.a.ak(r,q,n,a[m]);++p
q=n}return r},
vk(a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a2>>>2,a=new Uint32Array(b)
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
if(!B.o.gB(a)){if(0>=b)return A.a(a,0)
j=a[0]
if(B.b.P(j,256)!==0||j>a3)throw A.f(B.bi)
for(i=1;k<j;){h=Math.min(65536,j-k)
i=A.vj(a,l,i,k,h)
k+=h}}else i=0
g=0
f=0
e=0
for(;;){if(!(k<a3&&i<b))break
if(!(i>=0&&i<b))return A.a(a,i)
d=B.b.cm(a[i],e)&255
e+=8
if(e===32){++i
e=0}g=(g|B.b.aw(d&127,f))>>>0
if((d&128)!==0){c=k+1
if(!(k<a3))return A.a(l,k)
l[k]=g
k=c
g=0
f=0}else f+=7}return l},
vj(a9,b0,b1,b2,b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8=a9.length
if(!(b1>=0&&b1<a8))return A.a(a9,b1)
s=b1+a9[b1]
if(!(s<a8))return A.a(a9,s)
r=a9[s]
q=s+1
p=new Uint8Array(r)
for(o=0;o<r;++o){n=q+(o>>>2)
if(!(n<a8))return A.a(a9,n)
n=B.b.cm(a9[n],(o&3)*8)
if(!(o<r))return A.a(p,o)
p[o]=n&255}m=q+(r+3>>>2)
l=m+1
if(!(m<a8))return A.a(a9,m)
k=a9[m]
j=A.a9(33,null,!1,t.lf)
i=A.a9(33,0,!1,t.S)
for(m=l,h=2;h<=32;++h){if((B.b.eM(k,h-1)&1)===0)continue
l=m+1
if(!(m>=0&&m<a8))return A.a(a9,m)
g=a9[m]
f=new Uint32Array((g+31&4294967264)>>>0)
for(m=l,e=0;e<g;e+=32){A.r1(a9,m,f,e,h)
m+=h}m-=B.b.I((e-g)*h,5)
B.a.m(j,h,f)}d=b1+1
for(a8=B.b.C(b3,256),n=b0.length,c=0,b=0;b<a8;++b){a=c+1
if(!(c>=0&&c<r))return A.a(p,c)
h=p[c]
c=a+1
if(!(a>=0&&a<r))return A.a(p,a)
a0=p[a]
a1=b2+b*256
if(h===32){B.o.Y(b0,a1,a1+256,a9,d)
d+=256}else if(h>0)for(a2=0;a2<8;++a2){A.r1(a9,d,b0,a1+a2*32,h)
d+=h}if(a0===0)continue
a=c+1
if(!(c>=0&&c<r))return A.a(p,c)
a3=p[c]-h
if(a3===1)for(a4=b0.$flags|0,c=a,o=0;o<a0;++o,c=a){a=c+1
if(!(c>=0&&c<r))return A.a(p,c)
a5=a1+p[c]
if(!(a5>=0&&a5<n))return A.a(b0,a5)
a6=b0[a5]
a7=B.b.aw(1,h)
a4&2&&A.r(b0)
b0[a5]=(a6|a7)>>>0}else{if(!(a3>=0&&a3<33))return A.a(j,a3)
f=j[a3]
if(f==null)throw A.f(B.bl)
for(a4=f.length,c=a,o=0;o<a0;++o,c=a){a=c+1
if(!(c>=0&&c<r))return A.a(p,c)
a5=a1+p[c]
if(!(a5>=0&&a5<n))return A.a(b0,a5)
a6=b0[a5]
a7=i[a3]
B.a.m(i,a3,a7+1)
if(!(a7<a4))return A.a(f,a7)
a7=B.b.aw(f[a7],h)
b0.$flags&2&&A.r(b0)
b0[a5]=(a6|a7)>>>0}}}return m},
r1(a,b,c,d,e){var s,r,q,p,o,n,m,l,k=e===32?4294967295:B.b.aw(1,e)-1
for(s=c.$flags|0,r=a.length,q=0;q<32;++q){p=q*e
o=b+(p>>>5)
n=p&31
if(!(o>=0&&o<r))return A.a(a,o)
m=a[o]>>>n
if(n+e>32){l=o+1
if(!(l<r))return A.a(a,l)
m|=B.b.a3(a[l],32-n)}l=d+q
s&2&&A.r(c)
if(!(l>=0&&l<c.length))return A.a(c,l)
c[l]=(m&k)>>>0}},
jo:function jo(){var _=this
_.w=_.r=_.f=_.e=_.d=_.c=_.b=_.a=$
_.x=null
_.z=_.y=0},
jm:function jm(a){this.a=a
this.b=0},
uD(a){var s,r,q,p,o=A.A(t.N,t.dl),n=a.length,m=new A.bY(a,0,n)
while(m.b<n){s=m.A()
if(s===26){r=m.ac(0)
q=m.b
p=A.uB(a,q,q+r)
o.m(0,p.a,p)
m.b+=r}else m.T(0,s&7)}return new A.jp(o)},
uB(a,b,c){var s,r,q,p,o,n=A.b([],t.s),m=[],l=A.b([],t.ef),k=new A.bY(a,b,c)
for(s="",r=4096;k.b<c;){q=k.A()
switch(q){case 10:s=k.aM()
break
case 18:p=k.ac(0)
o=k.b
B.a.j(l,A.uA(a,o,o+p))
k.b+=p
break
case 26:B.a.j(n,k.aM())
break
case 34:p=k.ac(0)
o=k.b
m.push(A.uC(a,o,o+p))
k.b+=p
break
case 40:r=k.A()
break
default:k.T(0,q&7)}}return new A.ef(s,r,n,m,l)},
uC(a,b,c){var s,r,q,p,o=new A.bY(a,b,c)
for(s=null;o.b<c;){r=o.A()
switch(r){case 10:s=o.aM()
break
case 21:q=o.b
p=A.c8(a,q,q+4).getFloat32(0,!0)
o.b+=4
s=p
break
case 25:q=o.b
p=A.c8(a,q,q+8).getFloat64(0,!0)
o.b+=8
s=p
break
case 32:case 40:s=o.A()
break
case 48:p=o.A()
s=(p&1)===0?B.b.C(p,2):-B.b.C(p+1,2)
break
case 56:s=o.A()!==0
break
default:o.T(0,r&7)}}return s},
uA(a,b,c){var s,r,q,p,o,n,m,l,k=new A.bY(a,b,c)
for(s=0,r=null,q=0,p=0,o=0,n=0;k.b<c;){m=k.A()
switch(m){case 8:r=k.A()
break
case 18:l=k.ac(0)
q=k.b
p=q+l
k.b=p
break
case 24:s=k.A()
break
case 34:l=k.ac(0)
o=k.b
n=o+l
k.b=n
break
default:k.T(0,m&7)}}return new A.ee(a,s,r,q,p,o,n)},
jp:function jp(a){this.a=a},
ef:function ef(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
ee:function ee(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
e4:function e4(a,b){this.a=a
this.b=0
this.c=b},
bY:function bY(a,b,c){this.a=a
this.b=b
this.c=c},
uP(a,b,c){var s,r,q,p,o,n,m,l,k,j
for(s=0,r=1,q=0;q<a;++q){s+=r
r*=4}p=a===0?0:B.b.a3(1,a-1)
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
uO(a,b){var s,r,q=a.length,p=q-1
for(s=0;s<=p;){r=B.b.I(s+p,1)
if(!(r<q))return A.a(a,r)
if(a[r].a<=b)s=r+1
else p=r-1}if(p<0)q=null
else{if(!(p<q))return A.a(a,p)
q=a[p]}return q},
ek(a,b){var s=0,r=A.aj(t.p),q,p
var $async$ek=A.ak(function(c,d){if(c===1)return A.ag(d,r)
for(;;)switch(s){case 0:if(0===b||1===b){p=a
s=3
break}s=2===b?4:5
break
case 4:s=6
return A.I(A.o0(a),$async$ek)
case 6:p=d
s=3
break
case 5:p=A.aF(B.br)
case 3:q=p
s=1
break
case 1:return A.ah(q,r)}})
return A.ai($async$ek,r)},
qC(a){var s,r,q,p,o,n,m,l,k,j,i,h,g={}
g.a=0
s=new A.jD(g,a)
r=s.$0()
if(r<0||r>a.length)throw A.f(B.bo)
q=t.S
p=A.a9(r,0,!1,q)
o=A.a9(r,0,!1,q)
n=A.a9(r,0,!1,q)
for(m=0,l=0;l<r;++l){q=s.$0()
if(typeof q!=="number")return A.a6(q)
m+=q
B.a.m(p,l,m)}for(l=0;l<r;++l)B.a.m(o,l,s.$0())
for(l=0;l<r;++l)B.a.m(n,l,s.$0())
k=A.b([],t.a8)
for(j=0,l=0;l<r;++l){i=s.$0()
h=i===0&&l>0?j:i-1
q=n[l]
j=h+q
B.a.j(k,new A.eF(p[l],o[l],h,q))}return k},
jC:function jC(a,b,c,d,e){var _=this
_.a=a
_.c=b
_.d=c
_.e=d
_.r=_.f=null
_.w=e},
jE:function jE(a){this.a=a},
jD:function jD(a,b){this.a=a
this.b=b},
hw:function hw(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
eF:function eF(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
yi(a){var s,r,q,p=A.b([],t.I)
for(s=A.vZ(a),r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q)B.a.j(p,A.wM(s[q],8))
return p},
vZ(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=a.a,e=A.b([],t.ot)
for(s=a.c,r=f.length,q=t.n,p=t.b,o=null,n=null,m=0;m<s.length-1;){l=s[m];++m
k=s[m]
j=A.b([],q)
for(i=l*2,h=k*2;i<h;++i){if(!(i<r))return A.a(f,i)
j.push(f[i])}g=A.wX(j)
if(g===0)continue
if(n==null)n=g<0
if(n===g<0){if(o!=null)B.a.j(e,o)
o=A.b([j],p)}else if(o!=null)B.a.j(o,j)}if(o!=null)B.a.j(e,o)
return e},
wX(a){var s,r,q,p,o,n,m,l,k
for(s=a.length,r=s-2,q=0,p=0;p<s;o=p+2,r=p,p=o){if(!(r>=0&&r<s))return A.a(a,r)
n=a[r]
m=a[p]
l=p+1
if(!(l<s))return A.a(a,l)
l=a[l]
k=r+1
if(!(k<s))return A.a(a,k)
q+=(n-m)*(l+a[k])}return q},
vi(a,b,c,d){var s=A.f4(a,b,d),r=new A.bU(a,b,c,s)
r.e=s+c*1.4142135623730951
return r},
wM(a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=J.R(a3,0)
for(s=J.n(a2),r=1/0,q=1/0,p=-1/0,o=-1/0,n=0;n<s.gk(a2);n+=2){r=Math.min(r,s.h(a2,n))
p=Math.max(p,s.h(a2,n))
m=n+1
q=Math.min(q,s.h(a2,m))
o=Math.max(o,s.h(a2,m))}l=Math.min(p-r,o-q)
if(l===0)return new A.e(r,q)
k=l/2
s=A.b([],t.ji)
j=new A.ld(s)
for(m=k*1.4142135623730951,i=r;i<p;i+=l)for(h=i+k,g=q;g<o;g+=l){f=g+k
e=A.f4(h,f,a3)
f=new A.bU(h,f,k,e)
f.e=e+m
j.bf(f)}d=A.vY(a3)
for(c=d;s.length!==0;){b=j.iI()
m=c.d
if(b.d>m||m===0||isNaN(m))c=b
m=b.e
m===$&&A.h()
if(m-c.d<=a4)continue
k=b.c/2
m=b.a
h=m-k
f=b.b
e=f-k
a=A.f4(h,e,a3)
a0=new A.bU(h,e,k,a)
a1=k*1.4142135623730951
a0.e=a+a1
j.bf(a0)
m+=k
a0=A.f4(m,e,a3)
e=new A.bU(m,e,k,a0)
e.e=a0+a1
j.bf(e)
f+=k
e=A.f4(h,f,a3)
h=new A.bU(h,f,k,e)
h.e=e+a1
j.bf(h)
h=A.f4(m,f,a3)
f=new A.bU(m,f,k,h)
f.e=h+a1
j.bf(f)}s=d.d
if(s>0&&c.d-s<=a4)return new A.e(d.a,d.b)
return new A.e(c.a,c.b)},
vY(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=J.R(a,0)
for(s=J.n(g),r=s.gk(g)-2,q=0,p=0,o=0,n=0;n<s.gk(g);m=n+2,r=n,n=m){l=s.h(g,n)
k=s.h(g,n+1)
j=s.h(g,r)
i=s.h(g,r+1)
h=l*i-j*k
p+=(l+j)*h
o+=(k+i)*h
q+=h*3}return A.vi(p/q,o/q,0,a)},
f4(a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a
for(s=J.B(a2),r=!1,q=1/0;s.l();){p=s.gn()
for(o=J.n(p),n=o.gk(p)-2,m=0;m<o.gk(p);l=m+2,n=m,m=l){k=o.h(p,m)
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
ld:function ld(a){this.a=a},
vb(a){var s,r,q,p,o,n,m,l,k,j,i,h=J.n(a),g=h.h(a,0)
g.toString
A.v(g)
s=new A.kQ(a)
r=new A.kP(a)
q=h.h(a,1)
A:{if("build"===q){p=s.$0()
o=h.h(a,6)
o.toString
A.v(o)
n=p.a
m=p.b
p=p.c
h=h.h(a,5)
h.toString
g=new A.dP(new A.aZ(n,m,p,o),A.v(h),g)
h=g
break A}if("find"===q){p=s.$0()
o=r.$1(5)
n=r.$1(6)
m=r.$1(7)
l=r.$1(8)
g=new A.e3(p,o,n,m,l,h.h(a,9)==null?null:new A.e(r.$1(9),r.$1(10)),g)
h=g
break A}if("cluster"===q){p=h.h(a,2)
p.toString
p=A.u6(B.bV,A.P(p),t.j8)
o=h.h(a,3)
o.toString
A.v(o)
n=h.h(a,4)
n.toString
A.v(n)
h=h.h(a,5)
h.toString
g=new A.dO(p,o,n,A.v(h),g)
h=g
break A}if("cancel"===q){h=new A.dQ(g)
break A}if("template"===q){h=h.h(a,2)
h.toString
h=new A.ex(A.P(h),0)
break A}if("fetched"===q){g=h.h(a,2)
g.toString
h=new A.e2(A.P(g),t.nh.a(h.h(a,3)),0)
break A}if("states"===q){p=A.b([],t.kb)
h=h.h(a,2)
h.toString
o=t.j
h=J.B(o.a(h))
n=t.f
m=t.N
l=t.O
while(h.l()){k=o.a(h.gn())
j=J.n(k)
i=j.h(k,0)
k=j.h(k,1)
k.toString
p.push(new A.e(i,n.a(k).bc(0,m,l)))}h=new A.ew(p,g)
break A}h=A.aF(A.aN("No worker request is called "+A.u(q),null))}return h},
kR:function kR(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
b_:function b_(){},
kQ:function kQ(a){this.a=a},
kP:function kP(a){this.a=a},
dP:function dP(a,b,c){this.b=a
this.c=b
this.a=c},
dQ:function dQ(a){this.a=a},
ex:function ex(a,b){this.b=a
this.a=b},
e2:function e2(a,b,c){this.b=a
this.c=b
this.a=c},
ew:function ew(a,b){this.b=a
this.a=b},
e3:function e3(a,b,c,d,e,f,g){var _=this
_.b=a
_.c=b
_.d=c
_.e=d
_.f=e
_.r=f
_.a=g},
ca:function ca(a,b){this.a=a
this.b=b},
dO:function dO(a,b,c,d,e){var _=this
_.b=a
_.c=b
_.d=c
_.e=d
_.a=e},
ax:function ax(){},
hd:function hd(a,b,c){this.b=a
this.c=b
this.a=c},
hc:function hc(){},
h9:function h9(a,b){this.c=a
this.a=b},
ha:function ha(a,b){this.a=a
this.b=b},
eu:function eu(a,b){this.c=a
this.a=b},
e1:function e1(a,b){this.b=a
this.a=b},
dT:function dT(a,b){this.b=a
this.a=b},
d7:function d7(a,b){this.b=a
this.a=b},
fm:function fm(a,b,c){this.a=a
this.b=b
this.c=c},
hb:function hb(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
yj(c8,c9,d0,d1,d2,d3,d4,d5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7=new A.z(B.e,B.e)
c7.a=d4
s=new Float64Array(4096)
r=t.X
q=A.b([],r)
p=new A.e4(s,q)
o=A.b([],t.aq)
n=new A.ok(d4)
for(s=J.B(c8),m=t.n,l=t.w,k=t.hl,j=k.i("a1<V.E>"),i=c9.ay,h=c9.ax,g=k.i("V.E"),f=c9.ch,e=t.s,d=t.E,c=c9.CW;s.l();){b=s.gn()
a=A.b([],r)
for(a0=0;a0<i.length;++a0){a1=i[a0].b
if(!(a1>=0&&a1<h.length))return A.a(h,a1)
a1=h[a1]
a2=!1
if(a1.c===d0)if(a1.d===b.gai()){if(!(a0<i.length))return A.a(i,a0)
a1=i[a0]
a1=n.$2(a1.c,a1.d)}else a1=a2
else a1=a2
if(a1)a.push(a0)}a1=A.b([],r)
for(a0=0;a0<f.length;++a0){a2=f[a0].b
a3=!1
if(a2.b===d0)if(a2.c===b.gai()){if(!(a0<f.length))return A.a(f,a0)
a2=f[a0].b
a2=n.$2(a2.z,a2.Q)}else a2=a3
else a2=a3
if(a2)a1.push(a0)}if(a.length===0&&a1.length===0)continue
a4=4096/b.gaS()
a5=d1/a4
a6=d2/a4
a7=d3/a4
if(!(d0>=0&&d0<c.length))return A.a(c,d0)
a8=c[d0]
a9=a8 instanceof A.cd?null:a8.cG(b.gai())
for(a2=b.gaI(),a3=a2.length,b0=a9!=null,b1=0;b1<a2.length;a2.length===a3||(0,A.i)(a2),++b1){b2=a2[b1]
p.b=0
B.a.a1(q)
b2.aW(p)
A:{if(d.b(d5)){b3=d5.a/a4
b4=d5.b/a4
b4=A.x5(b2.ga_(),p,a5-b3,a6-b4,a5+b3,a6+b4)
b3=b4
break A}if(d5==null){b3=A.wd(b2.ga_(),p,a5,a6,a7)
break A}b3=null}if(!b3)continue
b5=b2.aH(b)
if(b0&&b5.h(0,a9)!=null)b5.m(0,"$id",b5.h(0,a9))
c7.sa8(b5)
switch(b2.ga_()){case 1:b3="Point"
break
case 2:b3="LineString"
break
default:b3="Polygon"
break}c7.c=b3
b6=A.b([],e)
for(b3=new A.aK(a1,k),b3=new A.a1(b3,b3.gk(0),j),b7=-1;b3.l();){b4=b3.d
if(b4==null)b4=g.a(b4)
if(b4>>>0!==b4||b4>=f.length)return A.a(f,b4)
if(!f[b4].ie(c7))continue
if(b4>>>0!==b4||b4>=f.length)return A.a(f,b4)
B.a.j(b6,f[b4].a)
if(b7<0)b7=i.length+b4}for(b3=new A.aK(a,k),b3=new A.a1(b3,b3.gk(0),j);b3.l();){b4=b3.d
b8=b4==null?g.a(b4):b4
if(b8>>>0!==b8||b8>=i.length)return A.a(i,b8)
b9=i[b8]
b4=b9.b
if(!(b4>=0&&b4<h.length))return A.a(h,b4)
c0=h[b4]
c1=c0.f
B:{if(B.a_===c1||B.af===c1){b4=b2.ga_()===3
break B}if(B.Q===c1){b4=b2.ga_()===1
break B}if(B.P===c1){b4=b2.ga_()!==1
break B}b4=null}if(!b4||!c0.e.$1(c7))continue
b4=b9.a
if(!B.a.u(b6,b4))B.a.j(b6,b4)
if(b7<0)b7=b8}if(b6.length===0)continue
b3=b.gai()
b4=c7.c
c2=c7.b
c3=A.b([],l)
for(c4=0;c4<q.length-1;){c5=A.b([],m)
if(!(c4<q.length))return A.a(q,c4)
a0=q[c4]*2;++c4
for(;;){if(!(c4<q.length))return A.a(q,c4)
if(!(a0<q[c4]*2))break
c6=p.a
if(!(a0<c6.length))return A.a(c6,a0)
c5.push(c6[a0]*a4);++a0}c3.push(new Float64Array(A.N(c5)))}B.a.j(o,new A.hb(b7,b3,b4,b6,c2,c3))}}return o},
wd(a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=a3.a
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
b=B.c.H(c===0?0:((a4-g)*o+(a5-f)*m)/c,0,1)
a=g+o*b-a4
a0=f+m*b-a5
if(a*a+a0*a0<=r)return!0}}}return k},
x5(a,b,c,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=b.a,d=new A.mo(c,a1,a0,a2)
if(a===1){for(s=e.length,r=0;r<b.b;r+=2){if(!(r<s))return A.a(e,r)
q=e[r]
p=r+1
if(!(p<s))return A.a(e,p)
if(d.$2(q,e[p]))return!0}return!1}o=new A.mm()
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
ok:function ok(a){this.a=a},
mo:function mo(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
mm:function mm(){},
mn:function mn(){},
xV(a,b,c,d){var s
if(a===c)s=a<0||a>4096
else s=!1
if(!s)if(b===d)s=b<0||b>4096
else s=!1
else s=!0
return s},
yl(a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a0.length,a=b/2|0
if(a1<=0||a<3)return a0
s=t.n
r=A.b([],s)
q=new A.ol(a0,r,a1)
p=(a-1)*2
if(!(p>=0&&p<b))return A.a(a0,p)
o=a0[p];++p
if(!(p<b))return A.a(a0,p)
p=a0[p]
n=a0[0]
if(1>=b)return A.a(a0,1)
m=A.xV(o,p,n,a0[1])
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
B.a.j(r,a0[p])}else q.$3(B.b.P(l-1+a,a),l,j)}f=A.b([],s)
for(l=0;l<r.length;l+=2){e=B.c.L(r[l]*2)/2
b=l+1
if(!(b<r.length))return A.a(r,b)
d=B.c.L(r[b]*2)/2
c=f.length
if(c>0){b=c-2
if(!(b>=0))return A.a(f,b)
b=f[b]===e&&f[c-1]===d}else b=!1
if(b)continue
B.a.j(f,e)
B.a.j(f,d)}for(;;){b=f.length
if(!(b>2&&f[0]===f[b-2]&&f[1]===f[b-1]))break
B.a.sk(f,b-2)}if(b<6)return a0
return new Float64Array(A.N(f))},
yu(a){var s,r,q,p=a.length/2|0,o=new Float64Array(p*4),n=new A.oq(a,o)
for(s=0;s<p;s=q){r=s*4
n.$3(s,B.b.P(s-1+p,p),r)
q=s+1
n.$3(s,q%p,r+2)}return o},
ol:function ol(a,b,c){this.a=a
this.b=b
this.c=c},
oq:function oq(a,b){this.a=a
this.b=b},
qZ(a,b,c){var s=new Float32Array(0),r=new Float32Array(0),q=new Float32Array(2048),p=new Float32Array(0),o=new Uint8Array(0),n=new Uint16Array(4096)
return new A.kZ(a,b,c,s,r,q,p,o,n,new Uint16Array(0),A.b([],t.bw))},
qa(a,b,c){var s,r,q,p,o,n,m,l=new A.ii(c,b),k=t.n,j=A.b([],k),i=a.length/2|0
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
if(l.$1(o))B.a.v(j,A.b([p,o],k))
if(!J.l(l.$1(o),l.$1(m)))B.a.v(j,A.b([p+(n-p)*((b-o)/(m-o)),b],k))}return j},
qw(a,b,c,d){var s=c-a,r=d-b,q=Math.sqrt(s*s+r*r)
return new A.e(-r/q,s/q)},
cH:function cH(a,b){this.a=a
this.b=b},
dl:function dl(a,b){this.a=a
this.b=b},
b0:function b0(a,b){this.a=a
this.b=b},
ec:function ec(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
kZ:function kZ(a,b,c,d,e,f,g,h,i,j,k){var _=this
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
ih:function ih(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ii:function ii(a,b){this.a=a
this.b=b},
j2:function j2(a,b,c,d){var _=this
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
wH(a,b){var s,r=a.b.as
if(r==null)return 50
s=r.$1(b)
return typeof s=="number"?B.b.H(B.c.M(s),0,4095):50},
aW:function aW(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
kf:function kf(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
_.a=a
_.b=$
_.c=b
_.d=c
_.e=d
_.f=e
_.r=f
_.w=g
_.x=h
_.y=i
_.z=j
_.Q=k
_.as=l
_.at=m
_.ax=n
_.ay=o
_.ch=1},
kp:function kp(a,b){this.a=a
this.b=b},
kr:function kr(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
kq:function kq(a,b,c){this.a=a
this.b=b
this.c=c},
ks:function ks(a,b,c){this.a=a
this.b=b
this.c=c},
kl:function kl(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
kk:function kk(a,b){this.a=a
this.b=b},
km:function km(a,b,c,d,e,f,g,h,i,j){var _=this
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
kn:function kn(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ko:function ko(){},
kh:function kh(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
ki:function ki(a){this.a=a},
kg:function kg(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
kj:function kj(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
aZ:function aZ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
yt(b6,b7,b8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4=B.b.a3(1,b8.a-b7.a),b5=A.b([],t.c)
for(s=J.B(b6),r=t.n,q=t.b,p=t.i,o=t.X,n=b8.b-b7.b*b4,m=b8.c-b7.c*b4,l=t.Z;s.l();){k=s.gn()
j=k.gaS()
i=n*j
h=m*j
g=Math.max(128,B.c.M(128*j/4096))
f=A.b([],l)
e=new Float64Array(4096)
d=A.b([],o)
c=new A.e4(e,d)
for(e=k.gaI(),b=e.length,a=-g,a0=j+g,a1=0;a1<e.length;e.length===b||(0,A.i)(e),++a1){a2=e[a1]
c.b=0
B.a.a1(d)
a2.aW(c)
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
B.a.v(a5,A.b([b0*b4-i,a7[a8]*b4-h],r));++a6}a3.push(a5)}b1=a2.ga_()
if(b1===3){a5=A.b([],q)
for(a7=a3.length,b2=0;b2<a3.length;a3.length===a7||(0,A.i)(a3),++b2){a4=a3[b2]
if(a4.length>=2){a8=A.W(a4,p)
if(0>=a4.length)return A.a(a4,0)
a8.push(a4[0])
if(1>=a4.length)return A.a(a4,1)
a8.push(a4[1])
a5.push(a8)}}b3=a5}else b3=a3
b3=A.rk(A.rk(b3,b1,a,a0,0),b1,a,a0,1)
if(b3.length===0)continue
B.a.j(f,new A.hG(b1,a2.aH(k),A.w5(b3,b1)))}if(f.length!==0)B.a.j(b5,new A.hH(k.gai(),j,f))}return b5},
w5(a,b){var s,r,q,p,o=A.b([],t.b)
for(s=a.length,r=b===3,q=0;q<a.length;a.length===s||(0,A.i)(a),++q){p=a[q]
o.push(r?B.a.F(p,0,p.length-2):p)}return o},
rk(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=A.b([],t.b)
if(a4===1){for(s=a3.length,r=t.n,q=0;q<a3.length;a3.length===s||(0,A.i)(a3),++q){p=a3[q]
for(o=0;n=p.length,o<n;o+=2){m=o+a7
if(!(m<n))return A.a(p,m)
l=p[m]
if(l>=a5&&l<=a6){m=p[o]
k=o+1
if(!(k<n))return A.a(p,k)
B.a.j(a2,A.b([m,p[k]],r))}}}return a2}if(a4!==2&&a4!==3)return a2
j=a4===3
for(s=a3.length,r=!j,n=t.n,q=0;q<a3.length;a3.length===s||(0,A.i)(a3),++q){i=a3[q]
h={}
g=B.b.C(i.length,2)
if(g===0)continue
h.a=A.b([],n)
f=new A.lP(h,i,a7)
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
B.a.v(e,A.b([a,i[k]],n))}a0=b<a5&&c>=a5
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
B.a.v(k,A.b([d,i[m]],n))}m=!1
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
B.a.v(m,A.b([e,m[1]],n))}m=h.a
if(m.length!==0)B.a.j(a2,m)}return a2},
lP:function lP(a,b,c){this.a=a
this.b=b
this.c=c},
hH:function hH(a,b,c){this.a=a
this.b=b
this.c=c},
hG:function hG(a,b,c){this.a=a
this.b=b
this.c=c},
kx:function kx(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
ky:function ky(){},
kz:function kz(){},
aO:function aO(a){this.a=a
this.b=0},
iN:function iN(a){this.a=a
this.b=0},
hU(a,b,c){return A.yF(a,t.dq.a(b),c)},
yF(c8,c9,d0){var s=0,r=A.aj(t.H),q,p=2,o=[],n=[],m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7
var $async$hU=A.ak(function(d1,d2){if(d1===1){o.push(d2)
s=p}for(;;)switch(s){case 0:c6={}
c7=c8.length
if(0>=c7){q=A.a(c8,0)
s=1
break}j=c8[0]
j.toString
A.P(j)
if(1>=c7){q=A.a(c8,1)
s=1
break}i=A.dF(c8[1])
if(2>=c7){q=A.a(c8,2)
s=1
break}h=c8[2]
h.toString
A.P(h)
if(3>=c7){q=A.a(c8,3)
s=1
break}c7=c8[3]
c7.toString
g=t.f
f=t.N
c7=g.a(c7).bc(0,f,f)
if(4>=c8.length){q=A.a(c8,4)
s=1
break}e=c8[4]
e.toString
d=t.O
e=g.a(e).bc(0,f,d)
if(5>=c8.length){q=A.a(c8,5)
s=1
break}c=t.lH
b=c.a(c8[5])
b=b==null?null:J.bx(b,f)
a=c8.length
if(6>=a){q=A.a(c8,6)
s=1
break}a0=c8[6]
a0.toString
A.ac(a0)
if(7>=a){q=A.a(c8,7)
s=1
break}a1=c8[7]
a1.toString
A.v(a1)
if(8>=a){q=A.a(c8,8)
s=1
break}a=c.a(c8[8])
a=a==null?null:J.bx(a,t.p)
if(9>=c8.length){q=A.a(c8,9)
s=1
break}c=c.a(c8[9])
c=c==null?null:J.bx(c,f)
if(10>=c8.length){q=A.a(c8,10)
s=1
break}a2=c8[10]
a2.toString
A.lG(a2)
a3=new A.kR(a2,c,a,j,new A.hj(i,h,c7),e,b,a0,a1)
i=A.b([],t.jA)
a4=A.b([],t.kv)
a5=A.b([],t.jQ)
a6=A.b([],t.n_)
a7=t.S
a8=e.a
a9=e.$ti.i("4?")
b0=a9.a(a8.h(0,"sources"))
g=g.b(b0)?b0:B.X
b0=A.u(a0)
a8=A.qQ(a9.a(a8.h(0,"projection"))).a.length!==0?b0+" globe":b0
b1=new A.k0(e,a0,g,i,A.A(d,t.aV),new A.kH(b,A.b([],t.o_),A.b([],t.o9),A.b([],t.oW),A.b([],t.nu),new A.bg(a8),A.A(f,a7)),a4,a5,a6,A.A(a7,t.u)).i0()
a6=b1.CW
if(!(a1>=0&&a1<a6.length)){q=A.a(a6,a1)
s=1
break}b2=a6[a1]
b3=b1.fr
b4=A.A(f,t.j0)
b5=new A.oE(b4,c9)
i=a==null
b6=i&&b3!=null?new A.iy(b5,b3,h,c7,new A.ov(),A.b([],t.s),A.A(f,a7),new A.fC(A.b([],t.ez),t.aZ),A.bd(a7),A.bd(a7)):null
if(b6!=null)b6.iK(b1)
c7=i?null:A.qc(a,c)
i=t.L
h=new Float64Array(4096)
g=t.X
e=A.b([],g)
d=A.b([],g)
c=A.b([],g)
b7=new A.kf(A.bd(a7),B.cr,b1,a1,c7,b6,a2,A.A(f,i),A.A(f,i),new A.z(B.e,B.e),new A.e4(h,e),d,c,new Float64Array(4096),A.b([],g))
b7.eS(b1,c7,a2,b6,a1)
m=new A.ot(c9)
c7=b1.dy
b8=c7.length===0?null:A.or(c7,b5).ex(new A.ow(b7),t.h)
c6.a=c6.b=null
if(b2 instanceof A.cd)c6.b=new A.ox(b2.e,new A.oJ(b2),new A.fS(),a3).$0()
b9=A.A(a7,t.p)
c0=new A.bT(new A.H($.G,t.cU),t.ou)
c1=new A.oK(c6,b2,a3,b9,c0)
if(j.length!==0)c1.$1(j)
c2=A.A(a7,t.cP)
c3=A.bd(a7)
c4=A.bd(a7)
c5=b2.b
c6.c=c5==null?b2.geg():c5
l=new A.oG(c6,b7,c1,new A.ou(c3,c4,c2),b4,c3,new A.oF(c6,new A.oz(c6,b9,c2,c0),c4,b2),b8,b6,m,c4,b1,a1)
c7=new A.c_(A.bv(d0,"stream",t.K),t.b6)
p=3
j=t.W,i=t.H
case 6:s=8
return A.I(c7.l(),$async$hU)
case 8:if(!d2){s=7
break}k=c7.gn()
h=k
h.toString
l.$1(A.vb(j.a(h))).ex(new A.oy(m),i)
s=6
break
case 7:n.push(5)
s=4
break
case 3:n=[2]
case 4:p=2
s=9
return A.I(c7.aA(),$async$hU)
case 9:s=n.pop()
break
case 5:case 1:return A.ah(q,r)
case 2:return A.ag(o.at(-1),r)}})
return A.ai($async$hU,r)},
ry(a){var s,r=A.b([],t.i9),q=a==null?B.a5:a,p=q.length,o=0
for(;o<q.length;q.length===p||(0,A.i)(q),++o){s=q[o]
r.push(new A.fm(s.a,s.b,s.d))}return r},
oE:function oE(a,b){this.a=a
this.b=b},
ov:function ov(){},
ot:function ot(a){this.a=a},
ow:function ow(a){this.a=a},
oJ:function oJ(a){this.a=a},
ox:function ox(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
oK:function oK(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
oz:function oz(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
oA:function oA(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
oB:function oB(){},
oC:function oC(){},
oD:function oD(a,b,c){this.a=a
this.b=b
this.c=c},
ou:function ou(a,b,c){this.a=a
this.b=b
this.c=c},
oF:function oF(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
oG:function oG(a,b,c,d,e,f,g,h,i,j,k,l,m){var _=this
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
_.as=m},
oH:function oH(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
oI:function oI(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
oy:function oy(a){this.a=a},
ym(){var s,r={},q=v.G
r.a=null
r=new A.on(r,q)
if(typeof r=="function")A.aF(A.aN("Attempting to rewrap a JS function.",null))
s=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.vX,r)
s[$.pK()]=r
q.onmessage=s},
on:function on(a,b){this.a=a
this.b=b},
om:function om(a){this.a=a},
c8(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.aw(b,c,B.b.a0(a.byteLength,s))
return J.tx(B.E.gaz(a),a.byteOffset+b*s,(c-b)*s)},
bQ(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.aw(b,c,B.b.a0(a.byteLength,s))
return J.tA(B.E.gaz(a),a.byteOffset+b*s,(c-b)*s)},
qW(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.aw(b,c,B.b.a0(a.byteLength,s))-b)*s
if(B.b.P(r,2)!==0)throw A.f(A.aN("The number of bytes to view must be a multiple of 2",null))
return J.tz(B.ap.gaz(a),a.byteOffset+b*s,B.b.C(r,2))},
ij(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.aw(b,c,B.b.a0(a.byteLength,s))-b)*s
if(B.b.P(r,4)!==0)throw A.f(A.aN("The number of bytes to view must be a multiple of 4",null))
return J.oN(B.n.gaz(a),a.byteOffset+b*s,B.b.C(r,4))},
bC(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.aw(b,c,B.b.a0(a.byteLength,s))-b)*s
if(B.b.P(r,8)!==0)throw A.f(A.aN("The number of bytes to view must be a multiple of 8",null))
return J.ty(B.v.gaz(a),a.byteOffset+b*s,B.b.C(r,8))},
t9(a){return v.mangledGlobalNames[a]},
yD(a){throw A.ad(A.qt(a),new Error())},
h(){throw A.ad(A.ur(""),new Error())},
at(){throw A.ad(A.uq(""),new Error())},
t7(){throw A.ad(A.qt(""),new Error())},
yw(a){return Math.sqrt(A.ac(a))},
ys(a){return Math.sin(A.ac(a))},
rP(a){return Math.cos(A.ac(a))},
yC(a){return Math.tan(a)},
x9(a){return Math.acos(a)},
xb(a){return Math.asin(a)},
xh(a){return Math.atan(A.ac(a))},
y1(a){return Math.log(A.ac(a))},
y5(a,b,c,d){var s,r,q,p=a.a,o=p.gk(p),n=b.a,m=n.gk(n)
if(o!==m)return!1
if(a===b)return!0
for(o=a.$ti,m=A.cz(p.gX(),o.c,o.y[2]),s=J.B(m.a),m=A.q(m).y[1],r=b.$ti.i("4?"),o=o.i("4?");s.l();){q=m.a(s.gn())
if(!n.K(q)||!J.l(r.a(n.h(0,q)),o.a(p.h(0,q))))return!1}return!0},
tb(a){var s=B.c.H(a,-85.0511,85.0511)*3.141592653589793/180
return(1-Math.log(Math.tan(s)+1/Math.cos(s))/3.141592653589793)/2},
pH(a){var s,r,q,p,o,n,m
if(!t.j.b(a))return null
s=A.b([],t.s)
for(r=J.pV(a,t.N),q=J.B(r.a),r=r.$ti,p=new A.cQ(q,r.i("cQ<1>")),r=r.c;p.l();){o=r.a(q.gn())
if(B.d.u(o,"{s}"))for(n=0;n<3;++n){m=B.bY[n]
s.push(A.os(o,"{s}",m,0))}else s.push(o)}return s.length===0?null:B.a.ab(s," ")},
yE(a,b,c,d){var s,r,q,p,o,n=a.split(" "),m=n.length,l=B.b.P(c+d,m),k=A.b([],t.s)
for(s=""+d,r=""+c,q=""+b,p=0;p<m;++p){o=n[B.b.P(l+p,m)]
o=A.os(o,"{z}",q,0)
o=A.os(o,"{x}",r,0)
k.push(A.os(o,"{y}",s,0))}return k},
o_(a,b,c,d,e,f,g){return A.xL(a,b,c,d,e,f,g)},
xL(a,b,c,d,e,f,a0){var s=0,r=A.aj(t.l_),q,p=2,o=[],n,m,l,k,j,i,h,g
var $async$o_=A.ak(function(a1,a2){if(a1===1){o.push(a2)
s=p}for(;;)switch(s){case 0:i=A.yE(b,c,d,e)
h=0
case 3:n=J.l(h,J.S(i)-1)
p=6
s=9
return A.I(a.eE(J.R(i,h),f,a0),$async$o_)
case 9:m=a2
l=m.a
if(n||J.l(l,200)||J.l(l,204)||J.l(l,404)){k=new A.e(J.R(i,h),m)
q=k
s=1
break}p=2
s=8
break
case 6:p=5
g=o.pop()
if(A.aG(g) instanceof A.dR)throw g
else if(n)throw g
s=8
break
case 5:s=2
break
case 8:k=h
if(typeof k!=="number"){q=k.af()
s=1
break}h=k+1
s=3
break
case 4:case 1:return A.ah(q,r)
case 2:return A.ag(o.at(-1),r)}})
return A.ai($async$o_,r)},
xi(a){var s,r,q,p
for(s=new A.dU(a),r=t.gS,s=new A.a1(s,s.gk(0),r.i("a1<y.E>")),r=r.i("y.E"),q=2166136261;s.l();){p=s.d
q=(q^(p==null?r.a(p):p))>>>0
q=q+(q<<1>>>0)+(q<<4>>>0)+(q<<7>>>0)+(q<<8>>>0)+(q<<24>>>0)>>>0}return B.b.iU(q,36)},
o8(a,b){var s,r,q,p,o
if(a==null?b==null:a===b)return!0
s=t.f
if(s.b(a)&&s.b(b)){if(a.gk(a)!==b.gk(b))return!1
for(s=a.ga7(),s=s.gp(s);s.l();){r=s.gn()
q=r.a
p=r.b
if(!b.K(q)||!A.o8(p,b.h(0,q)))return!1}return!0}s=t.j
if(s.b(a)&&s.b(b)){s=J.n(a)
r=J.n(b)
if(s.gk(a)!==r.gk(b))return!1
for(o=0;o<s.gk(a);++o)if(!A.o8(s.h(a,o),r.h(b,o)))return!1
return!0}return J.l(a,b)},
or(a,b){return A.yv(a,b)},
yv(b5,b6){var s=0,r=A.aj(t.h),q,p=2,o=[],n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4
var $async$or=A.ak(function(b7,b8){if(b7===1){o.push(b8)
s=p}for(;;)A:switch(s){case 0:b3=A.A(t.N,t.aL)
c=b5.length,b=t.f,a=t.L,a0=0
case 3:if(!(a0<b5.length)){s=5
break}a1=b5[a0]
n=null
n=a1.a
a2=a1.b
a3=B.d.aT(a2,"?")
a1=a3<0
m=a1?a2:B.d.a2(a2,0,a3)
l=a1?"":B.d.ao(a2,a3)
a4=0
case 6:if(!(a4<2)){s=8
break}k=B.bP[a4]
p=10
s=13
return A.I(b6.$1(A.u(m)+A.u(k)+".json"+A.u(l)),$async$or)
case 13:j=b8
if(j==null){s=7
break}a1=a.a(j)
i=b.a(B.t.ef(new A.f1(!1).c2(a1,0,null,!0),null))
for(a1=i.ga7(),a1=a1.gp(a1);a1.l();){h=a1.gn()
g=null
f=null
e=h
g=e.a
f=e.b
if(!b.b(f))continue
a5=A.f3(f.h(0,"pixelRatio"))
d=a5==null?1:a5
a6=A.u(n)
a7=A.u(g)
a8=A.f3(f.h(0,"width"))
if(a8==null)a8=0
a9=d
if(typeof a9!=="number"){q=A.a6(a9)
s=1
break A}b0=A.f3(f.h(0,"height"))
if(b0==null)b0=0
b1=d
if(typeof b1!=="number"){q=A.a6(b1)
s=1
break A}J.hW(b3,a6+a7,new A.e(a8/a9,b0/b1))}s=8
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
case 8:case 4:b5.length===c||(0,A.i)(b5),++a0
s=3
break
case 5:q=b3
s=1
break
case 1:return A.ah(q,r)
case 2:return A.ag(o.at(-1),r)}})
return A.ai($async$or,r)},
oR(a,b){return A.bq(A.b([a.getUint8(b),a.getUint8(b+1),a.getUint8(b+2),a.getUint8(b+3)],t.X),0,null)},
wl(a){var s,r,q,p
for(s=0,r=86;s<=r;){q=B.b.I(s+r,1)
if(!(q<87))return A.a(B.aH,q)
p=B.aH[q]
if(a<p.a)r=q-1
else if(a>p.b)s=q+1
else return!0}return!1},
pB(a,b){var s
if(b===0)return 0
for(s=new A.cO(a);s.l();)if(A.wl(s.d))return 0
return b},
aM(a,b){var s=new A.aT(a,b)
s.Q=A.b3(B.bJ,a)!==0
s.as=A.xX(a)
s.at=A.b3(B.a2,a)===1
s.ax=A.wI(a)
return s},
wI(a){var s,r
if(a===6752||a===4038)return 254
if(a===3897)return 127
s=A.b3(B.bG,a)
r=B.cq.h(0,s)
return r==null?s:r},
pf(a){var s
A.v(a)
s=!0
if(!(a>=65024&&a<=65039))if(!(a>=917760&&a<=917999))s=a>=6155&&a<=6157||a===6159
return s},
ye(a,b,c){var s,r,q,p,o,n,m,l,k=A.b([],t.mX)
for(s=J.Q(b),r=!0,q=0;q<b.length;q=o){p=q+1
o=p
for(;;){n=b.length
if(o<n){if(!(o>=0))return A.a(b,o)
m=A.b3(B.a2,b[o])
n=m>=1&&m<=3}else n=!1
if(!n)break;++o}if(o===p){if(!(q>=0&&q<b.length))return A.a(b,q)
A.ro(a,b[q],!0,k)}else{if(J.oM(s.F(b,q,o),A.yf()))A.x8(a,b,q,o,k)
else for(l=q;l<o;++l){if(!(l>=0&&l<b.length))return A.a(b,l)
A.ro(a,b[l],!1,k)}r=!1}}if(r)return k
A.wR(k,c)
return A.wO(a,k)},
ro(a,b,c,d){var s,r,q,p=a.a.x
p===$&&A.h()
s=p.a9(b)
if(c&&s!==0){B.a.j(d,A.aM(b,s))
return}if(A.rn(a,b,c,d)>0)return
if(s!==0){B.a.j(d,A.aM(b,s))
return}if(B.aP.K(b)){r=p.a9(32)
if(r!==0){p=A.aM(b,r)
p.ay=!0
B.a.j(d,p)
return}}if(b===8209){q=p.a9(8208)
if(q!==0){B.a.j(d,A.aM(b,q))
return}}B.a.j(d,A.aM(b,0))},
rn(a,b,c,d){var s,r,q,p,o,n,m,l=A.xw(b)
if(l==null)return 0
s=l.a
r=l.b
q=r===0
if(q)p=0
else{o=a.a.x
o===$&&A.h()
p=o.a9(r)}if(!q&&p===0)return 0
o=a.a.x
o===$&&A.h()
n=o.a9(s)
if(c&&n!==0){B.a.j(d,A.aM(s,n))
if(q)return 1
B.a.j(d,A.aM(r,p))
return 2}m=A.rn(a,s,c,d)
if(m>0){if(q)return m
B.a.j(d,A.aM(r,p))
return m+1}if(n!==0){B.a.j(d,A.aM(s,n))
if(q)return 1
B.a.j(d,A.aM(r,p))
return 2}return 0},
x8(a,b,c,d,e){var s,r,q,p,o,n,m,l
for(s=a.a,r=c;r<d;){q=b.length
if(!(r>=0&&r<q))return A.a(b,r)
p=b[r]
o=r+1
if(o<d){if(!(o<q))return A.a(b,o)
n=A.pf(b[o])}else n=!1
m=s.x
if(n){if(!(o<q))return A.a(b,o)
q=b[o]
m===$&&A.h()
l=m.iZ(p,q)
if(l!=null){B.a.j(e,A.aM(p,l))
r+=2}else{B.a.j(e,A.aM(p,m.a9(p)))
r=o}for(;;){if(r<d){if(!(r<b.length))return A.a(b,r)
q=A.pf(b[r])}else q=!1
if(!q)break
if(!(r<b.length))return A.a(b,r)
q=b[r]
B.a.j(e,A.aM(q,m.a9(q)));++r}}else{m===$&&A.h()
B.a.j(e,A.aM(p,m.a9(p)))
r=o}}},
wR(a,b){var s,r,q,p
for(s=0;r=a.length,s<r;++s){if(!(s>=0))return A.a(a,s)
if(a[s].ax===0)continue
q=s+1
for(;;){if(!(q<r&&a[q].ax!==0))break;++q}if(q-s<=32){p=B.a.F(a,s,q)
A.x_(p)
B.a.R(a,s,q,p)
if(b)A.wD(a,s,q)}s=q}},
x_(a){var s,r,q,p,o,n,m
for(s=a.length,r=1;r<s;++r){q=a[r]
p=r-1
o=q.ax
for(;;){if(!(p>=0&&a[p].ax>o))break
n=p+1
if(!(p>=0))return A.a(a,p)
m=a[p]
if(!(n>=0))return A.a(a,n)
a[n]=m;--p}o=p+1
if(!(o>=0))return A.a(a,o)
a[o]=q}},
wD(a,b,c){var s,r,q,p,o,n,m,l,k,j
for(s=b,r=220;r<=230;r+=10){q=a.length
for(;;){if(s<c){if(!(s>=0&&s<q))return A.a(a,s)
p=a[s].ax<r}else p=!1
if(!p)break;++s}if(s===c)break
if(!(s>=0&&s<q))return A.a(a,s)
if(a[s].ax>r)continue
o=s
for(;;){if(o<c){if(!(o<a.length))return A.a(a,o)
q=a[o]
q=q.ax===r&&B.eD.u(0,q.a)}else q=!1
if(!q)break;++o}if(s===o)continue
n=B.a.F(a,s,o)
m=B.a.F(a,b,s)
B.a.R(a,b,b+n.length,n)
B.a.R(a,b+n.length,o,m)
l=r===220?22:26
for(k=b;j=b+n.length,k<j;++k){if(!(k>=0&&k<a.length))return A.a(a,k)
a[k].ax=l}s=o
b=j}},
wO(a,b){var s,r,q,p,o,n,m,l
if(b.length===0)return b
s=A.b([B.a.gt(b)],t.mX)
for(r=a.a,q=0,p=1;p<b.length;++p){o=b[p]
if(o.as)n=q===s.length-1||B.a.gE(s).ax<o.ax
else n=!1
if(n){if(!(q>=0&&q<s.length))return A.a(s,q)
m=A.xn(s[q].a,o.a)
if(m!=null){n=r.x
n===$&&A.h()
l=n.a9(m)
if(l!==0){B.a.m(s,q,A.aM(m,l))
continue}}}B.a.j(s,o)
if(o.ax===0)q=s.length-1}return s},
xC(a,b,c){var s,r,q,p,o,n,m,l=B.aP.h(0,b)
if(l==null)l=0
if(l>0){s=a.a.c
s===$&&A.h()
return B.c.L(s*l)}if(l===-1)return Math.floor(c/2)
if(l===0)return c
if(l===-2){s=A.b([],t.X)
for(r=48;r<=57;++r)s.push(r)
q=s}else q=B.bF
for(s=q.length,p=a.a,o=0;o<q.length;q.length===s||(0,A.i)(q),++o){b=q[o]
n=p.x
n===$&&A.h()
m=n.a9(b)
if(m!==0)return a.aR(m)}return c},
y3(){return A.ym()}},B={}
var w=[A,J,B]
var $={}
A.oX.prototype={}
J.fH.prototype={
D(a,b){return a===b},
gS(a){return A.dr(a)},
q(a){return"Instance of '"+A.fY(a)+"'"},
gV(a){return A.bw(A.pd(this))}}
J.e5.prototype={
q(a){return String(a)},
cS(a,b){A.lG(b)
return b&&a},
eJ(a,b){return b||a},
gS(a){return a?519018:218159},
gV(a){return A.bw(t.y)},
$iU:1,
$iw:1}
J.e7.prototype={
D(a,b){return null==b},
q(a){return"null"},
gS(a){return 0},
$iU:1,
$ia3:1}
J.e8.prototype={$ia_:1}
J.cf.prototype={
gS(a){return 0},
gV(a){return B.eS},
q(a){return String(a)}}
J.fX.prototype={}
J.co.prototype={}
J.bG.prototype={
q(a){var s=a[$.tc()]
if(s==null)s=a[$.pK()]
if(s==null)return this.eQ(a)
return"JavaScript function for "+J.bj(s)},
$icD:1}
J.dh.prototype={
gS(a){return 0},
q(a){return String(a)}}
J.di.prototype={
gS(a){return 0},
q(a){return String(a)}}
J.p.prototype={
bH(a,b){return new A.bz(a,A.D(a).i("@<1>").G(b).i("bz<1,2>"))},
j(a,b){A.D(a).c.a(b)
a.$flags&1&&A.r(a,29)
a.push(b)},
bN(a,b){a.$flags&1&&A.r(a,"removeAt",1)
if(b<0||b>=a.length)throw A.f(A.qJ(b,null))
return a.splice(b,1)[0]},
en(a,b,c){var s,r
A.D(a).i("j<1>").a(c)
a.$flags&1&&A.r(a,"insertAll",2)
A.uW(b,0,a.length,"index")
if(!t.P.b(c))c=J.pT(c)
s=J.S(c)
a.length=a.length+s
r=b+s
this.Y(a,r,a.length,a,b)
this.R(a,b,r,c)},
iP(a,b){A.D(a).i("w(1)").a(b)
a.$flags&1&&A.r(a,16)
this.hj(a,b,!0)},
hj(a,b,c){var s,r,q,p,o
A.D(a).i("w(1)").a(b)
s=[]
r=a.length
for(q=0;q<r;++q){p=a[q]
if(!b.$1(p))s.push(p)
if(a.length!==r)throw A.f(A.a0(a))}o=s.length
if(o===r)return
this.sk(a,o)
for(q=0;q<s.length;++q)a[q]=s[q]},
cP(a,b){var s=A.D(a)
return new A.aV(a,s.i("w(1)").a(b),s.i("aV<1>"))},
v(a,b){var s
A.D(a).i("j<1>").a(b)
a.$flags&1&&A.r(a,"addAll",2)
if(Array.isArray(b)){this.eZ(a,b)
return}for(s=J.B(b);s.l();)a.push(s.gn())},
eZ(a,b){var s,r
t.dG.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.f(A.a0(a))
for(r=0;r<s;++r)a.push(b[r])},
a1(a){a.$flags&1&&A.r(a,"clear","clear")
a.length=0},
Z(a,b){var s,r
A.D(a).i("~(1)").a(b)
s=a.length
for(r=0;r<s;++r){b.$1(a[r])
if(a.length!==s)throw A.f(A.a0(a))}},
aJ(a,b,c){var s=A.D(a)
return new A.aQ(a,s.G(c).i("1(2)").a(b),s.i("@<1>").G(c).i("aQ<1,2>"))},
ab(a,b){var s,r=A.a9(a.length,"",!1,t.N)
for(s=0;s<a.length;++s)this.m(r,s,A.u(a[s]))
return r.join(b)},
bL(a){return this.ab(a,"")},
am(a,b){return A.aU(a,0,A.bv(b,"count",t.S),A.D(a).c)},
T(a,b){return A.aU(a,b,null,A.D(a).c)},
bI(a,b,c,d){var s,r,q
d.a(b)
A.D(a).G(d).i("1(1,2)").a(c)
s=a.length
for(r=b,q=0;q<s;++q){r=c.$2(r,a[q])
if(a.length!==s)throw A.f(A.a0(a))}return r},
ek(a,b,c){var s,r,q,p=A.D(a)
p.i("w(1)").a(b)
p.i("1()?").a(c)
s=a.length
for(r=0;r<s;++r){q=a[r]
if(b.$1(q))return q
if(a.length!==s)throw A.f(A.a0(a))}if(c!=null)return c.$0()
throw A.f(A.ae())},
O(a,b){if(!(b>=0&&b<a.length))return A.a(a,b)
return a[b]},
F(a,b,c){if(b<0||b>a.length)throw A.f(A.aa(b,0,a.length,"start",null))
if(c==null)c=a.length
else if(c<b||c>a.length)throw A.f(A.aa(c,b,a.length,"end",null))
if(b===c)return A.b([],A.D(a))
return A.b(a.slice(b,c),A.D(a))},
W(a,b){return this.F(a,b,null)},
bj(a,b,c){A.aw(b,c,a.length)
return A.aU(a,b,c,A.D(a).c)},
gt(a){if(a.length>0)return a[0]
throw A.f(A.ae())},
gE(a){var s=a.length
if(s>0)return a[s-1]
throw A.f(A.ae())},
Y(a,b,c,d,e){var s,r,q,p,o
A.D(a).i("j<1>").a(d)
a.$flags&2&&A.r(a,5)
A.aw(b,c,a.length)
s=c-b
if(s===0)return
A.ab(e,"skipCount")
if(t.j.b(d)){r=d
q=e}else{r=J.d3(d,e).aX(0,!1)
q=0}p=J.n(r)
if(q+s>p.gk(r))throw A.f(A.ql())
if(q<b)for(o=s-1;o>=0;--o)a[b+o]=p.h(r,q+o)
else for(o=0;o<s;++o)a[b+o]=p.h(r,q+o)},
R(a,b,c,d){return this.Y(a,b,c,d,0)},
ak(a,b,c,d){var s,r,q=A.D(a)
q.i("1?").a(d)
a.$flags&2&&A.r(a,"fillRange")
A.aw(b,c,a.length)
s=d==null?q.c.a(d):d
for(r=b;r<c;++r)a[r]=s},
iQ(a,b,c,d){var s,r,q,p,o,n,m=this
A.D(a).i("j<1>").a(d)
a.$flags&1&&A.r(a,"replaceRange","remove from or add to")
A.aw(b,c,a.length)
if(!t.P.b(d))d=J.pT(d)
s=c-b
r=J.S(d)
q=b+r
p=a.length
if(s>=r){o=s-r
n=p-o
m.R(a,b,q,d)
if(o!==0){m.Y(a,q,n,a,c)
m.sk(a,n)}}else{n=p+(r-s)
a.length=n
m.Y(a,q,n,a,c)
m.R(a,b,q,d)}},
aj(a,b){var s,r
A.D(a).i("w(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.f(A.a0(a))}return!1},
a4(a,b){var s,r
A.D(a).i("w(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.f(A.a0(a))}return!0},
aD(a,b){var s,r,q,p,o,n=A.D(a)
n.i("c(1,1)?").a(b)
a.$flags&2&&A.r(a,"sort")
s=a.length
if(s<2)return
if(b==null)b=J.wj()
if(s===2){r=a[0]
q=a[1]
n=b.$2(r,q)
if(typeof n!=="number")return n.eI()
if(n>0){a[0]=q
a[1]=r}return}p=0
if(n.c.b(null))for(o=0;o<a.length;++o)if(a[o]===void 0){a[o]=null;++p}a.sort(A.dK(b,2))
if(p>0)this.hm(a,p)},
bl(a){return this.aD(a,null)},
hm(a,b){var s,r=a.length
for(;s=r-1,r>0;r=s)if(a[s]===null){a[s]=void 0;--b
if(b===0)break}},
aU(a,b,c){var s,r=a.length
if(c>=r)return-1
if(c<0)c=0
for(s=c;s<r;++s){if(!(s<a.length))return A.a(a,s)
if(J.l(a[s],b))return s}return-1},
aT(a,b){return this.aU(a,b,0)},
u(a,b){var s
for(s=0;s<a.length;++s)if(J.l(a[s],b))return!0
return!1},
gB(a){return a.length===0},
gJ(a){return a.length!==0},
q(a){return A.oV(a,"[","]")},
aX(a,b){var s=A.b(a.slice(0),A.D(a))
return s},
ey(a){return this.aX(a,!0)},
ez(a){return A.uv(a,A.D(a).c)},
gp(a){return new J.b6(a,a.length,A.D(a).i("b6<1>"))},
gS(a){return A.dr(a)},
gk(a){return a.length},
sk(a,b){a.$flags&1&&A.r(a,"set length","change the length of")
if(b<0)throw A.f(A.aa(b,0,null,"newLength",null))
if(b>a.length)A.D(a).c.a(null)
a.length=b},
h(a,b){A.v(b)
if(!(b>=0&&b<a.length))throw A.f(A.nQ(a,b))
return a[b]},
m(a,b,c){A.D(a).c.a(c)
a.$flags&2&&A.r(a)
if(!(b>=0&&b<a.length))throw A.f(A.nQ(a,b))
a[b]=c},
cQ(a,b){return new A.bS(a,b.i("bS<0>"))},
gV(a){return A.bw(A.D(a))},
$ix:1,
$ij:1,
$ik:1,
ih(a,b){return this.gt(a).$1(b)},
iw(a,b){return this.gE(a).$1(b)}}
J.fJ.prototype={
iY(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.fY(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.iT.prototype={}
J.b6.prototype={
gn(){var s=this.d
return s==null?this.$ti.c.a(s):s},
l(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.i(q)
throw A.f(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$iF:1}
J.cF.prototype={
a6(a,b){var s
A.ac(b)
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gbK(b)
if(this.gbK(a)===s)return 0
if(this.gbK(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gbK(a){return a===0?1/a<0:a<0},
N(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.f(A.aC(""+a+".toInt()"))},
ae(a){var s,r
if(a>=0){if(a<=2147483647){s=a|0
return a===s?s:s+1}}else if(a>=-2147483648)return a|0
r=Math.ceil(a)
if(isFinite(r))return r
throw A.f(A.aC(""+a+".ceil()"))},
U(a){var s,r
if(a>=0){if(a<=2147483647)return a|0}else if(a>=-2147483648){s=a|0
return a===s?s:s-1}r=Math.floor(a)
if(isFinite(r))return r
throw A.f(A.aC(""+a+".floor()"))},
M(a){if(a>0){if(a!==1/0)return Math.round(a)}else if(a>-1/0)return 0-Math.round(0-a)
throw A.f(A.aC(""+a+".round()"))},
L(a){if(a<0)return-Math.round(-a)
else return Math.round(a)},
H(a,b,c){if(this.a6(b,c)>0)throw A.f(A.c2(b))
if(this.a6(a,b)<0)return b
if(this.a6(a,c)>0)return c
return a},
iV(a,b){var s
if(b<0||b>20)throw A.f(A.aa(b,0,20,"fractionDigits",null))
s=a.toFixed(b)
if(a===0&&this.gbK(a))return"-"+s
return s},
iU(a,b){var s,r,q,p,o
if(b<2||b>36)throw A.f(A.aa(b,2,36,"radix",null))
s=a.toString(b)
r=s.length
q=r-1
if(!(q>=0))return A.a(s,q)
if(s.charCodeAt(q)!==41)return s
p=/^([\da-z]+)(?:\.([\da-z]+))?\(e\+(\d+)\)$/.exec(s)
if(p==null)A.aF(A.aC("Unexpected toString result: "+s))
r=p.length
if(1>=r)return A.a(p,1)
s=p[1]
if(3>=r)return A.a(p,3)
o=+p[3]
r=p[2]
if(r!=null){s+=r
o-=r.length}return s+B.d.ag("0",o)},
q(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gS(a){var s,r,q,p,o=a|0
if(a===o)return o&536870911
s=Math.abs(a)
r=Math.log(s)/0.6931471805599453|0
q=Math.pow(2,r)
p=s<1?s/q:q/s
return((p*9007199254740992|0)+(p*3542243181176521|0))*599197+r*1259&536870911},
P(a,b){var s=a%b
if(s===0)return 0
if(s>0)return s
if(b<0)return s-b
else return s+b},
a0(a,b){if((a|0)===a)if(b>=1||b<-1)return a/b|0
return this.dU(a,b)},
C(a,b){return(a|0)===a?a/b|0:this.dU(a,b)},
dU(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.f(A.aC("Result of truncating division is "+A.u(s)+": "+A.u(a)+" ~/ "+b))},
a3(a,b){if(b<0)throw A.f(A.c2(b))
return b>31?0:a<<b>>>0},
aw(a,b){return b>31?0:a<<b>>>0},
cU(a,b){var s
if(b<0)throw A.f(A.c2(b))
if(a>0)s=this.bE(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
I(a,b){var s
if(a>0)s=this.bE(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
cl(a,b){if(0>b)throw A.f(A.c2(b))
return this.bE(a,b)},
bE(a,b){return b>31?0:a>>>b},
eM(a,b){if(b<0)throw A.f(A.c2(b))
return this.cm(a,b)},
cm(a,b){if(b>31)return 0
return a>>>b},
gV(a){return A.bw(t.cZ)},
$ib9:1,
$id:1,
$iaA:1}
J.e6.prototype={
gV(a){return A.bw(t.S)},
$iU:1,
$ic:1}
J.fK.prototype={
gV(a){return A.bw(t.i)},
$iU:1}
J.ce.prototype={
cv(a,b,c){var s=b.length
if(c>s)throw A.f(A.aa(c,0,s,null,null))
return new A.hI(b,a,c)},
cu(a,b){return this.cv(a,b,0)},
cC(a,b){var s=b.length,r=a.length
if(s>r)return!1
return b===this.ao(a,r-s)},
cV(a,b){var s
if(typeof b=="string")return A.b(a.split(b),t.s)
else{if(b instanceof A.dg){s=b.e
s=!(s==null?b.e=b.fl():s)}else s=!1
if(s)return A.b(a.split(b.b),t.s)
else return this.fs(a,b)}},
fs(a,b){var s,r,q,p,o,n,m=A.b([],t.s)
for(s=J.pN(b,a),s=s.gp(s),r=0,q=1;s.l();){p=s.gn()
o=p.gcW()
n=p.gcB()
q=n-o
if(q===0&&r===o)continue
B.a.j(m,this.a2(a,r,o))
r=n}if(r<a.length||q>0)B.a.j(m,this.ao(a,r))
return m},
an(a,b){var s=b.length
if(s>a.length)return!1
return b===a.substring(0,s)},
a2(a,b,c){return a.substring(b,A.aw(b,c,a.length))},
ao(a,b){return this.a2(a,b,null)},
bi(a){var s,r,q,p=a.trim(),o=p.length
if(o===0)return p
if(0>=o)return A.a(p,0)
if(p.charCodeAt(0)===133){s=J.qp(p,1)
if(s===o)return""}else s=0
r=o-1
if(!(r>=0))return A.a(p,r)
q=p.charCodeAt(r)===133?J.qq(p,r):o
if(s===0&&q===o)return p
return p.substring(s,q)},
iW(a){var s=a.trimStart(),r=s.length
if(r===0)return s
if(0>=r)return A.a(s,0)
if(s.charCodeAt(0)!==133)return s
return s.substring(J.qp(s,1))},
iX(a){var s,r=a.trimEnd(),q=r.length
if(q===0)return r
s=q-1
if(!(s>=0))return A.a(r,s)
if(r.charCodeAt(s)!==133)return r
return r.substring(0,J.qq(r,s))},
ag(a,b){var s,r
if(0>=b)return""
if(b===1||a.length===0)return a
if(b!==b>>>0)throw A.f(B.b1)
for(s=a,r="";;){if((b&1)===1)r=s+r
b=b>>>1
if(b===0)break
s+=s}return r},
iF(a,b,c){var s=b-a.length
if(s<=0)return a
return this.ag(c,s)+a},
iG(a,b,c){var s=b-a.length
if(s<=0)return a
return a+this.ag(c,s)},
aU(a,b,c){var s
if(c<0||c>a.length)throw A.f(A.aa(c,0,a.length,null,null))
s=a.indexOf(b,c)
return s},
aT(a,b){return this.aU(a,b,0)},
u(a,b){return A.yx(a,b,0)},
a6(a,b){var s
A.P(b)
if(a===b)s=0
else s=a<b?-1:1
return s},
q(a){return a},
gS(a){var s,r,q
for(s=a.length,r=0,q=0;q<s;++q){r=r+a.charCodeAt(q)&536870911
r=r+((r&524287)<<10)&536870911
r^=r>>6}r=r+((r&67108863)<<3)&536870911
r^=r>>11
return r+((r&16383)<<15)&536870911},
gV(a){return A.bw(t.N)},
gk(a){return a.length},
$iU:1,
$ib9:1,
$ijw:1,
$io:1}
A.cp.prototype={
gp(a){return new A.dS(J.B(this.gad()),A.q(this).i("dS<1,2>"))},
gk(a){return J.S(this.gad())},
gB(a){return J.d2(this.gad())},
gJ(a){return J.hY(this.gad())},
T(a,b){var s=A.q(this)
return A.cz(J.d3(this.gad(),b),s.c,s.y[1])},
am(a,b){var s=A.q(this)
return A.cz(J.i_(this.gad(),b),s.c,s.y[1])},
O(a,b){return A.q(this).y[1].a(J.dN(this.gad(),b))},
gt(a){return A.q(this).y[1].a(J.hX(this.gad()))},
gE(a){return A.q(this).y[1].a(J.oP(this.gad()))},
u(a,b){return J.pO(this.gad(),b)},
q(a){return J.bj(this.gad())}}
A.dS.prototype={
l(){return this.a.l()},
gn(){return this.$ti.y[1].a(this.a.gn())},
$iF:1}
A.cy.prototype={
gad(){return this.a}}
A.eE.prototype={$ix:1}
A.eB.prototype={
h(a,b){return this.$ti.y[1].a(J.R(this.a,A.v(b)))},
m(a,b,c){var s=this.$ti
J.hW(this.a,b,s.c.a(s.y[1].a(c)))},
sk(a,b){J.tF(this.a,b)},
j(a,b){var s=this.$ti
J.fd(this.a,s.c.a(s.y[1].a(b)))},
bj(a,b,c){var s=this.$ti
return A.cz(J.tD(this.a,b,c),s.c,s.y[1])},
Y(a,b,c,d,e){var s=this.$ti
J.tG(this.a,b,c,A.cz(s.i("j<2>").a(d),s.y[1],s.c),e)},
R(a,b,c,d){return this.Y(0,b,c,d,0)},
$ix:1,
$ik:1}
A.bz.prototype={
bH(a,b){return new A.bz(this.a,this.$ti.i("@<1>").G(b).i("bz<1,2>"))},
gad(){return this.a}}
A.cA.prototype={
bc(a,b,c){return new A.cA(this.a,this.$ti.i("@<1,2>").G(b).G(c).i("cA<1,2,3,4>"))},
K(a){return this.a.K(a)},
h(a,b){return this.$ti.i("4?").a(this.a.h(0,b))},
m(a,b,c){var s=this.$ti
s.y[2].a(b)
s.y[3].a(c)
this.a.m(0,s.c.a(b),s.y[1].a(c))},
Z(a,b){this.a.Z(0,new A.i6(this,this.$ti.i("~(3,4)").a(b)))},
gX(){var s=this.$ti
return A.cz(this.a.gX(),s.c,s.y[2])},
gaL(){var s=this.$ti
return A.cz(this.a.gaL(),s.y[1],s.y[3])},
gk(a){var s=this.a
return s.gk(s)},
gB(a){var s=this.a
return s.gB(s)},
gJ(a){var s=this.a
return s.gJ(s)},
ga7(){return this.a.ga7().aJ(0,new A.i5(this),this.$ti.i("a5<3,4>"))}}
A.i6.prototype={
$2(a,b){var s=this.a.$ti
s.c.a(a)
s.y[1].a(b)
this.b.$2(s.y[2].a(a),s.y[3].a(b))},
$S(){return this.a.$ti.i("~(1,2)")}}
A.i5.prototype={
$1(a){var s=this.a.$ti
s.i("a5<1,2>").a(a)
return new A.a5(s.y[2].a(a.a),s.y[3].a(a.b),s.i("a5<3,4>"))},
$S(){return this.a.$ti.i("a5<3,4>(a5<1,2>)")}}
A.dk.prototype={
q(a){return"LateInitializationError: "+this.a}}
A.dU.prototype={
gk(a){return this.a.length},
h(a,b){var s
A.v(b)
s=this.a
if(!(b>=0&&b<s.length))return A.a(s,b)
return s.charCodeAt(b)}}
A.od.prototype={
$0(){var s=new A.H($.G,t.cU)
s.br(null)
return s},
$S:64}
A.jU.prototype={}
A.x.prototype={}
A.V.prototype={
gp(a){var s=this
return new A.a1(s,s.gk(s),A.q(s).i("a1<V.E>"))},
gB(a){return this.gk(this)===0},
gt(a){if(this.gk(this)===0)throw A.f(A.ae())
return this.O(0,0)},
gE(a){var s=this
if(s.gk(s)===0)throw A.f(A.ae())
return s.O(0,s.gk(s)-1)},
u(a,b){var s,r=this,q=r.gk(r)
for(s=0;s<q;++s){if(J.l(r.O(0,s),b))return!0
if(q!==r.gk(r))throw A.f(A.a0(r))}return!1},
aj(a,b){var s,r,q=this
A.q(q).i("w(V.E)").a(b)
s=q.gk(q)
for(r=0;r<s;++r){if(b.$1(q.O(0,r)))return!0
if(s!==q.gk(q))throw A.f(A.a0(q))}return!1},
ab(a,b){var s,r,q,p=this,o=p.gk(p)
if(b.length!==0){if(o===0)return""
s=A.u(p.O(0,0))
if(o!==p.gk(p))throw A.f(A.a0(p))
for(r=s,q=1;q<o;++q){r=r+b+A.u(p.O(0,q))
if(o!==p.gk(p))throw A.f(A.a0(p))}return r.charCodeAt(0)==0?r:r}else{for(q=0,r="";q<o;++q){r+=A.u(p.O(0,q))
if(o!==p.gk(p))throw A.f(A.a0(p))}return r.charCodeAt(0)==0?r:r}},
bL(a){return this.ab(0,"")},
aJ(a,b,c){var s=A.q(this)
return new A.aQ(this,s.G(c).i("1(V.E)").a(b),s.i("@<V.E>").G(c).i("aQ<1,2>"))},
T(a,b){return A.aU(this,b,null,A.q(this).i("V.E"))},
am(a,b){return A.aU(this,0,A.bv(b,"count",t.S),A.q(this).i("V.E"))}}
A.bM.prototype={
d_(a,b,c,d){var s,r=this.b
A.ab(r,"start")
s=this.c
if(s!=null){A.ab(s,"end")
if(r>s)throw A.f(A.aa(r,0,s,"start",null))}},
gft(){var s=J.S(this.a),r=this.c
if(r==null||r>s)return s
return r},
ghD(){var s=J.S(this.a),r=this.b
if(r>s)return s
return r},
gk(a){var s,r=J.S(this.a),q=this.b
if(q>=r)return 0
s=this.c
if(s==null||s>=r)return r-q
return s-q},
O(a,b){var s=this,r=s.ghD()+b
if(b<0||r>=s.gft())throw A.f(A.iO(b,s.gk(0),s,"index"))
return J.dN(s.a,r)},
T(a,b){var s,r,q=this
A.ab(b,"count")
s=q.b+b
r=q.c
if(r!=null&&s>=r)return new A.dZ(q.$ti.i("dZ<1>"))
return A.aU(q.a,s,r,q.$ti.c)},
am(a,b){var s,r,q,p=this
A.ab(b,"count")
s=p.c
r=p.b
q=r+b
if(s==null)return A.aU(p.a,r,q,p.$ti.c)
else{if(s<q)return p
return A.aU(p.a,r,q,p.$ti.c)}},
aX(a,b){var s,r,q,p=this,o=p.b,n=p.a,m=J.n(n),l=m.gk(n),k=p.c
if(k!=null&&k<l)l=k
s=l-o
if(s<=0){n=p.$ti.c
return b?J.oW(0,n):J.qn(0,n)}r=A.a9(s,m.O(n,o),b,p.$ti.c)
for(q=1;q<s;++q){B.a.m(r,q,m.O(n,o+q))
if(m.gk(n)<l)throw A.f(A.a0(p))}return r}}
A.a1.prototype={
gn(){var s=this.d
return s==null?this.$ti.c.a(s):s},
l(){var s,r=this,q=r.a,p=J.n(q),o=p.gk(q)
if(r.b!==o)throw A.f(A.a0(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.O(q,s);++r.c
return!0},
$iF:1}
A.cI.prototype={
gp(a){return new A.eb(J.B(this.a),this.b,A.q(this).i("eb<1,2>"))},
gk(a){return J.S(this.a)},
gB(a){return J.d2(this.a)},
gt(a){return this.b.$1(J.hX(this.a))},
gE(a){return this.b.$1(J.oP(this.a))},
O(a,b){return this.b.$1(J.dN(this.a,b))}}
A.dX.prototype={$ix:1}
A.eb.prototype={
l(){var s=this,r=s.b
if(r.l()){s.a=s.c.$1(r.gn())
return!0}s.a=null
return!1},
gn(){var s=this.a
return s==null?this.$ti.y[1].a(s):s},
$iF:1}
A.aQ.prototype={
gk(a){return J.S(this.a)},
O(a,b){return this.b.$1(J.dN(this.a,b))}}
A.aV.prototype={
gp(a){return new A.ey(J.B(this.a),this.b,this.$ti.i("ey<1>"))}}
A.ey.prototype={
l(){var s,r
for(s=this.a,r=this.b;s.l();)if(r.$1(s.gn()))return!0
return!1},
gn(){return this.a.gn()},
$iF:1}
A.cP.prototype={
gp(a){var s=this.a
return new A.es(s.gp(s),this.b,A.q(this).i("es<1>"))}}
A.dY.prototype={
gk(a){var s=this.a,r=s.gk(s)
s=this.b
if(r>s)return s
return r},
$ix:1}
A.es.prototype={
l(){if(--this.b>=0)return this.a.l()
this.b=-1
return!1},
gn(){if(this.b<0){this.$ti.c.a(null)
return null}return this.a.gn()},
$iF:1}
A.bL.prototype={
T(a,b){A.c6(b,"count",t.S)
A.ab(b,"count")
return new A.bL(this.a,this.b+b,A.q(this).i("bL<1>"))},
gp(a){var s=this.a
return new A.ep(s.gp(s),this.b,A.q(this).i("ep<1>"))}}
A.dc.prototype={
gk(a){var s=this.a,r=s.gk(s)-this.b
if(r>=0)return r
return 0},
T(a,b){A.c6(b,"count",t.S)
A.ab(b,"count")
return new A.dc(this.a,this.b+b,this.$ti)},
$ix:1}
A.ep.prototype={
l(){var s,r
for(s=this.a,r=0;r<this.b;++r)s.l()
this.b=0
return s.l()},
gn(){return this.a.gn()},
$iF:1}
A.dZ.prototype={
gp(a){return B.aV},
gB(a){return!0},
gk(a){return 0},
gt(a){throw A.f(A.ae())},
gE(a){throw A.f(A.ae())},
O(a,b){throw A.f(A.aa(b,0,0,"index",null))},
u(a,b){return!1},
T(a,b){A.ab(b,"count")
return this},
am(a,b){A.ab(b,"count")
return this}}
A.e_.prototype={
l(){return!1},
gn(){throw A.f(A.ae())},
$iF:1}
A.bS.prototype={
gp(a){return new A.cQ(J.B(this.a),this.$ti.i("cQ<1>"))}}
A.cQ.prototype={
l(){var s,r
for(s=this.a,r=this.$ti.c;s.l();)if(r.b(s.gn()))return!0
return!1},
gn(){return this.$ti.c.a(this.a.gn())},
$iF:1}
A.bF.prototype={
gk(a){return J.S(this.a)},
gB(a){return J.d2(this.a)},
gJ(a){return J.hY(this.a)},
gt(a){return new A.e(this.b,J.hX(this.a))},
O(a,b){return new A.e(b+this.b,J.dN(this.a,b))},
u(a,b){var s,r,q,p=null,o=null,n=!1
if(t.E.b(b)){s=b.a
if(A.dG(s)){A.v(s)
r=b.b
n=s>=this.b
o=r
p=s}}if(n){if(typeof p!=="number")return p.b0()
n=J.d3(this.a,p-this.b)
q=n.gp(n)
return q.l()&&J.l(q.gn(),o)}return!1},
am(a,b){A.c6(b,"count",t.S)
A.ab(b,"count")
return new A.bF(J.i_(this.a,b),this.b,A.q(this).i("bF<1>"))},
T(a,b){A.c6(b,"count",t.S)
A.ab(b,"count")
return new A.bF(J.d3(this.a,b),b+this.b,A.q(this).i("bF<1>"))},
gp(a){return new A.ba(J.B(this.a),this.b,A.q(this).i("ba<1>"))}}
A.cC.prototype={
gE(a){var s,r=this.a,q=J.n(r),p=q.gk(r)
if(p<=0)throw A.f(A.ae())
s=q.gE(r)
if(p!==q.gk(r))throw A.f(A.a0(this))
return new A.e(p-1+this.b,s)},
u(a,b){var s,r,q,p,o=null,n=null,m=!1
if(t.E.b(b)){s=b.a
if(A.dG(s)){A.v(s)
r=b.b
m=s>=this.b
n=r
o=s}}if(m){if(typeof o!=="number")return o.b0()
q=o-this.b
m=this.a
p=J.n(m)
return q<p.gk(m)&&J.l(p.O(m,q),n)}return!1},
am(a,b){A.c6(b,"count",t.S)
A.ab(b,"count")
return new A.cC(J.i_(this.a,b),this.b,this.$ti)},
T(a,b){A.c6(b,"count",t.S)
A.ab(b,"count")
return new A.cC(J.d3(this.a,b),this.b+b,this.$ti)},
$ix:1}
A.ba.prototype={
l(){if(++this.c>=0&&this.a.l())return!0
this.c=-2
return!1},
gn(){var s=this.c
return s>=0?new A.e(this.b+s,this.a.gn()):A.aF(A.ae())},
$iF:1}
A.a2.prototype={
sk(a,b){throw A.f(A.aC("Cannot change the length of a fixed-length list"))},
j(a,b){A.a7(a).i("a2.E").a(b)
throw A.f(A.aC("Cannot add to a fixed-length list"))}}
A.bR.prototype={
m(a,b,c){A.q(this).i("bR.E").a(c)
throw A.f(A.aC("Cannot modify an unmodifiable list"))},
sk(a,b){throw A.f(A.aC("Cannot change the length of an unmodifiable list"))},
j(a,b){A.q(this).i("bR.E").a(b)
throw A.f(A.aC("Cannot add to an unmodifiable list"))},
Y(a,b,c,d,e){A.q(this).i("j<bR.E>").a(d)
throw A.f(A.aC("Cannot modify an unmodifiable list"))},
R(a,b,c,d){return this.Y(0,b,c,d,0)}}
A.du.prototype={}
A.aK.prototype={
gk(a){return J.S(this.a)},
O(a,b){var s=this.a,r=J.n(s)
return r.O(s,r.gk(s)-1-b)}}
A.f2.prototype={}
A.e.prototype={$r:"+(1,2)",$s:1}
A.M.prototype={$r:"+(1,2,3)",$s:2}
A.eO.prototype={$r:"+bytes,cancel,jobs(1,2,3)",$s:3}
A.dD.prototype={$r:"+codes,level,levels(1,2,3)",$s:4}
A.eP.prototype={$r:"+features,required,script(1,2,3)",$s:5}
A.bu.prototype={$r:"+(1,2,3,4)",$s:6}
A.eQ.prototype={$r:"+blur,halo,italic,phase,sixteenths,size,weight(1,2,3,4,5,6,7)",$s:7}
A.eR.prototype={$r:"+a,arg1,arg2,b,c,d,flags,glyph(1,2,3,4,5,6,7,8)",$s:8}
A.d9.prototype={
bc(a,b,c){var s=A.q(this)
return A.qy(this,s.c,s.y[1],b,c)},
gB(a){return this.gk(this)===0},
gJ(a){return this.gk(this)!==0},
q(a){return A.p0(this)},
m(a,b,c){var s=A.q(this)
s.c.a(b)
s.y[1].a(c)
A.tS()},
ga7(){return new A.cr(this.i7(),A.q(this).i("cr<a5<1,2>>"))},
i7(){var s=this
return function(){var r=0,q=1,p=[],o,n,m,l,k
return function $async$ga7(a,b,c){if(b===1){p.push(c)
r=q}for(;;)switch(r){case 0:o=s.gX(),o=o.gp(o),n=A.q(s),m=n.y[1],n=n.i("a5<1,2>")
case 2:if(!o.l()){r=3
break}l=o.gn()
k=s.h(0,l)
r=4
return a.b=new A.a5(l,k==null?m.a(k):k,n),1
case 4:r=2
break
case 3:return 0
case 1:return a.c=p.at(-1),3}}}},
$iK:1}
A.ap.prototype={
gk(a){return this.b.length},
gdk(){var s=this.$keys
if(s==null){s=Object.keys(this.a)
this.$keys=s}return s},
K(a){if(typeof a!="string")return!1
if("__proto__"===a)return!1
return this.a.hasOwnProperty(a)},
h(a,b){if(!this.K(b))return null
return this.b[this.a[b]]},
Z(a,b){var s,r,q,p
this.$ti.i("~(1,2)").a(b)
s=this.gdk()
r=this.b
for(q=s.length,p=0;p<q;++p)b.$2(s[p],r[p])},
gX(){return new A.cX(this.gdk(),this.$ti.i("cX<1>"))},
gaL(){return new A.cX(this.b,this.$ti.i("cX<2>"))}}
A.cX.prototype={
gk(a){return this.a.length},
gB(a){return 0===this.a.length},
gJ(a){return 0!==this.a.length},
gp(a){var s=this.a
return new A.bW(s,s.length,this.$ti.i("bW<1>"))}}
A.bW.prototype={
gn(){var s=this.d
return s==null?this.$ti.c.a(s):s},
l(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$iF:1}
A.cc.prototype={
au(){var s=this,r=s.$map
if(r==null){r=new A.cG(s.$ti.i("cG<1,2>"))
A.rS(s.a,r)
s.$map=r}return r},
K(a){return this.au().K(a)},
h(a,b){return this.au().h(0,b)},
Z(a,b){this.$ti.i("~(1,2)").a(b)
this.au().Z(0,b)},
gX(){var s=this.au()
return new A.aH(s,A.q(s).i("aH<1>"))},
gaL(){var s=this.au()
return new A.bc(s,A.q(s).i("bc<2>"))},
gk(a){return this.au().a}}
A.da.prototype={
a5(a,b){A.tT()}}
A.bk.prototype={
gk(a){return this.b},
gB(a){return this.b===0},
gJ(a){return this.b!==0},
gp(a){var s,r=this,q=r.$keys
if(q==null){q=Object.keys(r.a)
r.$keys=q}s=q
return new A.bW(s,s.length,r.$ti.i("bW<1>"))},
u(a,b){if(typeof b!="string")return!1
if("__proto__"===b)return!1
return this.a.hasOwnProperty(b)}}
A.df.prototype={
gk(a){return this.a.length},
gB(a){return this.a.length===0},
gJ(a){return this.a.length!==0},
gp(a){var s=this.a
return new A.bW(s,s.length,this.$ti.i("bW<1>"))},
au(){var s,r,q,p,o=this,n=o.$map
if(n==null){n=new A.cG(o.$ti.i("cG<1,1>"))
for(s=o.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q]
n.m(0,p,p)}o.$map=n}return n},
u(a,b){return this.au().K(b)}}
A.en.prototype={}
A.kB.prototype={
al(a){var s,r,q=this,p=new RegExp(q.a).exec(a)
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
A.ej.prototype={
q(a){return"Null check operator used on a null value"}}
A.fL.prototype={
q(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.hg.prototype={
q(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.ju.prototype={
q(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.e0.prototype={}
A.eT.prototype={
q(a){var s,r=this.b
if(r!=null)return r
r=this.a
s=r!==null&&typeof r==="object"?r.stack:null
return this.b=s==null?"":s},
$ibf:1}
A.c9.prototype={
q(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.ta(r==null?"unknown":r)+"'"},
gV(a){var s=A.pw(this)
return A.bw(s==null?A.a7(this):s)},
$icD:1,
gj5(){return this},
$C:"$1",
$R:1,
$D:null}
A.fk.prototype={$C:"$0",$R:0}
A.fl.prototype={$C:"$2",$R:2}
A.h7.prototype={}
A.h1.prototype={
q(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.ta(s)+"'"}}
A.d4.prototype={
D(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.d4))return!1
return this.$_target===b.$_target&&this.a===b.a},
gS(a){return(A.oe(this.a)^A.dr(this.$_target))>>>0},
q(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.fY(this.a)+"'")}}
A.h_.prototype={
q(a){return"RuntimeError: "+this.a}}
A.bb.prototype={
gk(a){return this.a},
gB(a){return this.a===0},
gJ(a){return this.a!==0},
gX(){return new A.aH(this,A.q(this).i("aH<1>"))},
gaL(){return new A.bc(this,A.q(this).i("bc<2>"))},
ga7(){return new A.bH(this,A.q(this).i("bH<1,2>"))},
K(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.iq(a)},
iq(a){var s=this.d
if(s==null)return!1
return this.be(this.dh(s,a),a)>=0},
v(a,b){A.q(this).i("K<1,2>").a(b).Z(0,new A.iU(this))},
h(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.ir(b)},
ir(a){var s,r,q=this.d
if(q==null)return null
s=this.dh(q,a)
r=this.be(s,a)
if(r<0)return null
return s[r].b},
m(a,b,c){var s,r,q=this,p=A.q(q)
p.c.a(b)
p.y[1].a(c)
if(typeof b=="string"){s=q.b
q.d0(s==null?q.b=q.cd():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=q.c
q.d0(r==null?q.c=q.cd():r,b,c)}else q.it(b,c)},
it(a,b){var s,r,q,p,o=this,n=A.q(o)
n.c.a(a)
n.y[1].a(b)
s=o.d
if(s==null)s=o.d=o.cd()
r=o.bJ(a)
q=s[r]
if(q==null)s[r]=[o.bT(a,b)]
else{p=o.be(q,a)
if(p>=0)q[p].b=b
else q.push(o.bT(a,b))}},
bg(a,b){var s,r,q=this,p=A.q(q)
p.c.a(a)
p.i("2()").a(b)
if(q.K(a)){s=q.h(0,a)
return s==null?p.y[1].a(s):s}r=b.$0()
q.m(0,a,r)
return r},
a5(a,b){var s=this
if(typeof b=="string")return s.dM(s.b,b)
else if(typeof b=="number"&&(b&0x3fffffff)===b)return s.dM(s.c,b)
else return s.is(b)},
is(a){var s,r,q,p,o=this,n=o.d
if(n==null)return null
s=o.bJ(a)
r=n[s]
q=o.be(r,a)
if(q<0)return null
p=r.splice(q,1)[0]
o.dX(p)
if(r.length===0)delete n[s]
return p.b},
a1(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.bS()}},
Z(a,b){var s,r,q=this
A.q(q).i("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.f(A.a0(q))
s=s.c}},
d0(a,b,c){var s,r=A.q(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.bT(b,c)
else s.b=c},
dM(a,b){var s
if(a==null)return null
s=a[b]
if(s==null)return null
this.dX(s)
delete a[b]
return s.b},
bS(){this.r=this.r+1&1073741823},
bT(a,b){var s=this,r=A.q(s),q=new A.j3(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else{r=s.f
r.toString
q.d=r
s.f=r.c=q}++s.a
s.bS()
return q},
dX(a){var s=this,r=a.d,q=a.c
if(r==null)s.e=q
else r.c=q
if(q==null)s.f=r
else q.d=r;--s.a
s.bS()},
bJ(a){return J.ao(a)&1073741823},
dh(a,b){return a[this.bJ(b)]},
be(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.l(a[r].a,b))return r
return-1},
q(a){return A.p0(this)},
cd(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$ioZ:1}
A.iU.prototype={
$2(a,b){var s=this.a,r=A.q(s)
s.m(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.q(this.a).i("~(1,2)")}}
A.j3.prototype={}
A.aH.prototype={
gk(a){return this.a.a},
gB(a){return this.a.a===0},
gp(a){var s=this.a
return new A.ea(s,s.r,s.e,this.$ti.i("ea<1>"))},
u(a,b){return this.a.K(b)}}
A.ea.prototype={
gn(){return this.d},
l(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.f(A.a0(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$iF:1}
A.bc.prototype={
gk(a){return this.a.a},
gB(a){return this.a.a===0},
gp(a){var s=this.a
return new A.bI(s,s.r,s.e,this.$ti.i("bI<1>"))}}
A.bI.prototype={
gn(){return this.d},
l(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.f(A.a0(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$iF:1}
A.bH.prototype={
gk(a){return this.a.a},
gB(a){return this.a.a===0},
gp(a){var s=this.a
return new A.e9(s,s.r,s.e,this.$ti.i("e9<1,2>"))}}
A.e9.prototype={
gn(){var s=this.d
s.toString
return s},
l(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.f(A.a0(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.a5(s.a,s.b,r.$ti.i("a5<1,2>"))
r.c=s.c
return!0}},
$iF:1}
A.cG.prototype={
bJ(a){return A.xo(a)&1073741823},
be(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.l(a[r].a,b))return r
return-1}}
A.o1.prototype={
$1(a){return this.a(a)},
$S:40}
A.o2.prototype={
$2(a,b){return this.a(a,b)},
$S:100}
A.o3.prototype={
$1(a){return this.a(A.P(a))},
$S:38}
A.ay.prototype={
gV(a){return A.bw(this.di())},
di(){return A.xA(this.$r,this.bu())},
q(a){return this.dW(!1)},
dW(a){var s,r,q,p,o,n=this.fB(),m=this.bu(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.a(m,q)
o=m[q]
l=a?l+A.qG(o):l+A.u(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
fB(){var s,r=this.$s
while($.lu.length<=r)B.a.j($.lu,null)
s=$.lu[r]
if(s==null){s=this.fk()
B.a.m($.lu,r,s)}return s},
fk(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=t.K,j=J.qm(l,k)
for(s=0;s<l;++s)j[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.a.m(j,q,r[s])}}j=A.uw(j,!1,k)
j.$flags=3
return j}}
A.dC.prototype={
bu(){return[this.a,this.b]},
D(a,b){if(b==null)return!1
return b instanceof A.dC&&this.$s===b.$s&&J.l(this.a,b.a)&&J.l(this.b,b.b)},
gS(a){return A.jv(this.$s,this.a,this.b,B.B,B.B)}}
A.bZ.prototype={
bu(){return[this.a,this.b,this.c]},
D(a,b){var s=this
if(b==null)return!1
return b instanceof A.bZ&&s.$s===b.$s&&J.l(s.a,b.a)&&J.l(s.b,b.b)&&J.l(s.c,b.c)},
gS(a){var s=this
return A.jv(s.$s,s.a,s.b,s.c,B.B)}}
A.cq.prototype={
bu(){return this.a},
D(a,b){if(b==null)return!1
return b instanceof A.cq&&this.$s===b.$s&&A.vx(this.a,b.a)},
gS(a){return A.jv(this.$s,A.uJ(this.a),B.B,B.B,B.B)}}
A.dg.prototype={
q(a){return"RegExp/"+this.a+"/"+this.b.flags},
gh2(){var s=this,r=s.c
if(r!=null)return r
r=s.b
return s.c=A.qr(s.a,r.multiline,!r.ignoreCase,r.unicode,r.dotAll,"g")},
fl(){var s,r=this.a
if(!B.d.u(r,"("))return!1
s=this.b.unicode?"u":""
return new RegExp("(?:)|"+r,s).exec("").length>1},
cv(a,b,c){var s=b.length
if(c>s)throw A.f(A.aa(c,0,s,null,null))
return new A.hl(this,b,c)},
cu(a,b){return this.cv(0,b,0)},
fw(a,b){var s,r=this.gh2()
if(r==null)r=A.cu(r)
r.lastIndex=b
s=r.exec(a)
if(s==null)return null
return new A.hB(s)},
$ijw:1,
$iuX:1}
A.hB.prototype={
gcW(){return this.b.index},
gcB(){var s=this.b
return s.index+s[0].length},
$idp:1,
$iel:1}
A.hl.prototype={
gp(a){return new A.ez(this.a,this.b,this.c)}}
A.ez.prototype={
gn(){var s=this.d
return s==null?t.lu.a(s):s},
l(){var s,r,q,p,o,n,m=this,l=m.b
if(l==null)return!1
s=m.c
r=l.length
if(s<=r){q=m.a
p=q.fw(l,s)
if(p!=null){m.d=p
o=p.gcB()
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
$iF:1}
A.er.prototype={
gcB(){return this.a+this.c.length},
$idp:1,
gcW(){return this.a}}
A.hI.prototype={
gp(a){return new A.hJ(this.a,this.b,this.c)},
gt(a){var s=this.b,r=this.a.indexOf(s,this.c)
if(r>=0)return new A.er(r,s)
throw A.f(A.ae())}}
A.hJ.prototype={
l(){var s,r,q=this,p=q.c,o=q.b,n=o.length,m=q.a,l=m.length
if(p+n>l){q.d=null
return!1}s=m.indexOf(o,p)
if(s<0){q.c=l+1
q.d=null
return!1}r=s+n
q.d=new A.er(s,o)
q.c=r===q.c?r+1:r
return!0},
gn(){var s=this.d
s.toString
return s},
$iF:1}
A.cg.prototype={
geo(a){return a.byteLength},
gV(a){return B.eL},
e7(a,b,c){A.c1(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
e6(a,b,c){A.c1(a,b,c)
if(c==null)c=B.b.C(a.byteLength-b,2)
return new Uint16Array(a,b,c)},
e4(a,b,c){A.c1(a,b,c)
if(c==null)c=B.b.C(a.byteLength-b,4)
return new Float32Array(a,b,c)},
e5(a,b,c){A.c1(a,b,c)
if(c==null)c=B.b.C(a.byteLength-b,8)
return new Float64Array(a,b,c)},
e3(a,b,c){A.c1(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
$iU:1,
$icg:1}
A.dq.prototype={$idq:1}
A.eg.prototype={
gaz(a){if(((a.$flags|0)&2)!==0)return new A.lB(a.buffer)
else return a.buffer},
fQ(a,b,c,d){var s=A.aa(b,0,c,d,null)
throw A.f(s)},
d7(a,b,c,d){if(b>>>0!==b||b>c)this.fQ(a,b,c,d)}}
A.lB.prototype={
geo(a){return this.a.byteLength},
e7(a,b,c){var s=A.p2(this.a,b,c)
s.$flags=3
return s},
e6(a,b,c){var s=A.uH(this.a,b,c)
s.$flags=3
return s},
e4(a,b,c){var s=A.uF(this.a,b,c)
s.$flags=3
return s},
e5(a,b,c){var s=A.uG(this.a,b,c)
s.$flags=3
return s},
e3(a,b,c){var s=A.uE(this.a,b,c)
s.$flags=3
return s}}
A.fP.prototype={
gV(a){return B.eM},
$iU:1,
$iq3:1}
A.av.prototype={
gk(a){return a.length},
dP(a,b,c,d,e){var s,r,q=a.length
this.d7(a,b,q,"start")
this.d7(a,c,q,"end")
if(b>c)throw A.f(A.aa(b,0,c,null,null))
s=c-b
if(e<0)throw A.f(A.aN(e,null))
r=d.length
if(r-e<s)throw A.f(A.bp("Not enough elements"))
if(e!==0||r!==s)d=d.subarray(e,e+s)
a.set(d,b)},
$iaP:1}
A.ch.prototype={
h(a,b){A.v(b)
A.c0(b,a,a.length)
return a[b]},
m(a,b,c){A.ct(c)
a.$flags&2&&A.r(a)
A.c0(b,a,a.length)
a[b]=c},
Y(a,b,c,d,e){t.id.a(d)
a.$flags&2&&A.r(a,5)
if(t.dQ.b(d)){this.dP(a,b,c,d,e)
return}this.cZ(a,b,c,d,e)},
R(a,b,c,d){return this.Y(a,b,c,d,0)},
$ix:1,
$ij:1,
$ik:1}
A.aR.prototype={
m(a,b,c){A.v(c)
a.$flags&2&&A.r(a)
A.c0(b,a,a.length)
a[b]=c},
Y(a,b,c,d,e){t.fm.a(d)
a.$flags&2&&A.r(a,5)
if(t.aj.b(d)){this.dP(a,b,c,d,e)
return}this.cZ(a,b,c,d,e)},
R(a,b,c,d){return this.Y(a,b,c,d,0)},
$ix:1,
$ij:1,
$ik:1}
A.cK.prototype={
gV(a){return B.eN},
F(a,b,c){return new Float32Array(a.subarray(b,A.bi(b,c,a.length)))},
W(a,b){return this.F(a,b,null)},
$iU:1,
$icK:1,
$ibm:1}
A.cL.prototype={
gV(a){return B.eO},
F(a,b,c){return new Float64Array(a.subarray(b,A.bi(b,c,a.length)))},
W(a,b){return this.F(a,b,null)},
$iU:1,
$icL:1,
$icb:1}
A.fQ.prototype={
gV(a){return B.eP},
h(a,b){A.v(b)
A.c0(b,a,a.length)
return a[b]},
F(a,b,c){return new Int16Array(a.subarray(b,A.bi(b,c,a.length)))},
W(a,b){return this.F(a,b,null)},
$iU:1}
A.cM.prototype={
gV(a){return B.eQ},
h(a,b){A.v(b)
A.c0(b,a,a.length)
return a[b]},
F(a,b,c){return new Int32Array(a.subarray(b,A.bi(b,c,a.length)))},
W(a,b){return this.F(a,b,null)},
$iU:1,
$icM:1,
$iiP:1}
A.fR.prototype={
gV(a){return B.eR},
h(a,b){A.v(b)
A.c0(b,a,a.length)
return a[b]},
F(a,b,c){return new Int8Array(a.subarray(b,A.bi(b,c,a.length)))},
W(a,b){return this.F(a,b,null)},
$iU:1}
A.cN.prototype={
gV(a){return B.eU},
h(a,b){A.v(b)
A.c0(b,a,a.length)
return a[b]},
F(a,b,c){return new Uint16Array(a.subarray(b,A.bi(b,c,a.length)))},
W(a,b){return this.F(a,b,null)},
$iU:1,
$icN:1,
$ikD:1}
A.eh.prototype={
gV(a){return B.eV},
h(a,b){A.v(b)
A.c0(b,a,a.length)
return a[b]},
F(a,b,c){return new Uint32Array(a.subarray(b,A.bi(b,c,a.length)))},
W(a,b){return this.F(a,b,null)},
$iU:1,
$ikE:1}
A.ei.prototype={
gV(a){return B.eW},
gk(a){return a.length},
h(a,b){A.v(b)
A.c0(b,a,a.length)
return a[b]},
F(a,b,c){return new Uint8ClampedArray(a.subarray(b,A.bi(b,c,a.length)))},
W(a,b){return this.F(a,b,null)},
$iU:1}
A.ci.prototype={
gV(a){return B.eX},
gk(a){return a.length},
h(a,b){A.v(b)
A.c0(b,a,a.length)
return a[b]},
F(a,b,c){return new Uint8Array(a.subarray(b,A.bi(b,c,a.length)))},
W(a,b){return this.F(a,b,null)},
$iU:1,
$ici:1,
$ial:1}
A.eJ.prototype={}
A.eK.prototype={}
A.eL.prototype={}
A.eM.prototype={}
A.be.prototype={
i(a){return A.f0(v.typeUniverse,this,a)},
G(a){return A.rf(v.typeUniverse,this,a)}}
A.hv.prototype={}
A.hM.prototype={
q(a){return A.aX(this.a,null)}}
A.hr.prototype={
q(a){return this.a}}
A.eX.prototype={$ibO:1}
A.kW.prototype={
$1(a){var s=this.a,r=s.a
s.a=null
r.$0()},
$S:16}
A.kV.prototype={
$1(a){var s,r
this.a.a=t.M.a(a)
s=this.b
r=this.c
s.firstChild?s.removeChild(r):s.appendChild(r)},
$S:72}
A.kX.prototype={
$0(){this.a.$0()},
$S:28}
A.kY.prototype={
$0(){this.a.$0()},
$S:28}
A.ly.prototype={
eX(a,b){if(self.setTimeout!=null)this.b=self.setTimeout(A.dK(new A.lz(this,b),0),a)
else throw A.f(A.aC("`setTimeout()` not found."))},
aA(){if(self.setTimeout!=null){var s=this.b
if(s==null)return
self.clearTimeout(s)
this.b=null}else throw A.f(A.aC("Canceling a timer."))}}
A.lz.prototype={
$0(){this.a.b=null
this.b.$0()},
$S:0}
A.eA.prototype={
bd(a){var s,r=this,q=r.$ti
q.i("1/?").a(a)
if(a==null)a=q.c.a(a)
if(!r.b)r.a.br(a)
else{s=r.a
if(q.i("Z<1>").b(a))s.d6(a)
else s.c0(a)}},
cw(a,b){var s
if(b==null)b=A.i1(a)
s=this.a
if(this.b)s.b2(new A.aB(a,b))
else s.b1(new A.aB(a,b))},
$ifo:1}
A.lH.prototype={
$1(a){return this.a.$2(0,a)},
$S:33}
A.lI.prototype={
$2(a,b){this.a.$2(1,new A.e0(a,t.l.a(b)))},
$S:63}
A.mq.prototype={
$2(a,b){this.a(A.v(a),b)},
$S:70}
A.d_.prototype={
gn(){var s=this.b
return s==null?this.$ti.c.a(s):s},
ho(a,b){var s,r,q
a=A.v(a)
b=b
s=this.a
for(;;)try{r=s(this,a,b)
return r}catch(q){b=q
a=1}},
l(){var s,r,q,p,o=this,n=null,m=0
for(;;){s=o.d
if(s!=null)try{if(s.l()){o.b=s.gn()
return!0}else o.d=null}catch(r){n=r
m=1
o.d=null}q=o.ho(m,n)
if(1===q)return!0
if(0===q){o.b=null
p=o.e
if(p==null||p.length===0){o.a=A.r9
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
o.a=A.r9
throw n
return!1}if(0>=p.length)return A.a(p,-1)
o.a=p.pop()
m=1
continue}throw A.f(A.bp("sync*"))}return!1},
j7(a){var s,r,q=this
if(a instanceof A.cr){s=a.a()
r=q.e
if(r==null)r=q.e=[]
B.a.j(r,q.a)
q.a=s
return 2}else{q.d=J.B(a)
return 2}},
$iF:1}
A.cr.prototype={
gp(a){return new A.d_(this.a(),this.$ti.i("d_<1>"))}}
A.aB.prototype={
q(a){return A.u(this.a)},
$iY:1,
gb_(){return this.b}}
A.io.prototype={
$0(){this.c.a(null)
this.b.c_(null)},
$S:0}
A.kA.prototype={
q(a){var s=this.b.q(0)
return"TimeoutException after "+s+": "+this.a}}
A.eC.prototype={
cw(a,b){var s=this.a
if((s.a&30)!==0)throw A.f(A.bp("Future already completed"))
s.b1(A.wi(a,b))},
eb(a){return this.cw(a,null)},
$ifo:1}
A.bT.prototype={
bd(a){var s,r=this.$ti
r.i("1/?").a(a)
s=this.a
if((s.a&30)!==0)throw A.f(A.bp("Future already completed"))
s.br(r.i("1/").a(a))},
i1(){return this.bd(null)}}
A.bV.prototype={
iC(a){var s
if((this.c&15)!==6)return!0
s=this.b.b
return s.bC(s,t.iW.a(this.d),a.a,t.y,t.K)},
ij(a){var s,r=this,q=r.e,p=null,o=t.z,n=t.K,m=a.a,l=r.b.b
if(t.ng.b(q))p=l.hr(l,q,m,a.b,o,n,t.l)
else p=l.bC(l,t.mq.a(q),m,o,n)
try{o=r.$ti.i("2/").a(p)
return o}catch(s){if(t.do.b(A.aG(s))){if((r.c&1)!==0)throw A.f(A.aN("The error handler of Future.then must return a value of the returned future's type","onError"))
throw A.f(A.aN("The error handler of Future.catchError must return a value of the future's type","onError"))}else throw s}}}
A.H.prototype={
bh(a,b,c){var s,r,q,p=this.$ti
p.G(c).i("1/(2)").a(a)
s=$.G
if(s===B.l){if(b!=null&&!t.ng.b(b)&&!t.mq.b(b))throw A.f(A.i0(b,"onError",u.c))}else{r=p.c
a=s.bA(s,c.i("@<0/>").G(r).i("1(2)").a(a),c.i("0/"),r)
if(b!=null)b=A.wQ(b,s)}q=new A.H(s,c.i("H<0>"))
r=b==null?1:3
this.bp(new A.bV(q,r,a,b,p.i("@<1>").G(c).i("bV<1,2>")))
return q},
ex(a,b){return this.bh(a,null,b)},
dV(a,b,c){var s,r=this.$ti
r.G(c).i("1/(2)").a(a)
s=new A.H($.G,c.i("H<0>"))
this.bp(new A.bV(s,19,a,b,r.i("@<1>").G(c).i("bV<1,2>")))
return s},
cO(a){var s,r,q
t.mY.a(a)
s=this.$ti
r=$.G
q=new A.H(r,s)
if(r!==B.l)a=r.b5(r,a,t.z)
this.bp(new A.bV(q,8,a,null,s.i("bV<1,1>")))
return q},
hx(a){this.$ti.c.a(a)
this.a=8
this.c=a},
hv(a){this.a=this.a&1|16
this.c=a},
bs(a){this.a=a.a&30|this.a&1
this.c=a.c},
bp(a){var s,r=this,q=r.a
if(q<=3){a.a=t.F.a(r.c)
r.c=a}else{if((q&4)!==0){s=t._.a(r.c)
if((s.a&24)===0){s.bp(a)
return}r.bs(s)}q=r.b
q.b8(q,new A.l3(r,a))}},
dH(a){var s,r,q,p,o,n,m=this,l={}
l.a=a
if(a==null)return
s=m.a
if(s<=3){r=t.F.a(m.c)
m.c=a
if(r!=null){q=a.a
for(p=a;q!=null;p=q,q=o)o=q.a
p.a=r}}else{if((s&4)!==0){n=t._.a(m.c)
if((n.a&24)===0){n.dH(a)
return}m.bs(n)}l.a=m.bB(a)
s=m.b
s.b8(s,new A.l7(l,m))}},
b6(){var s=t.F.a(this.c)
this.c=null
return this.bB(s)},
bB(a){var s,r,q
for(s=a,r=null;s!=null;r=s,s=q){q=s.a
s.a=r}return r},
c_(a){var s,r=this,q=r.$ti
q.i("1/").a(a)
s=r.b6()
q.c.a(a)
r.a=8
r.c=a
A.cW(r,s)},
c0(a){var s,r=this
r.$ti.c.a(a)
s=r.b6()
r.a=8
r.c=a
A.cW(r,s)},
fi(a){var s=this.b6()
this.bs(a)
A.cW(this,s)},
b2(a){var s=this.b6()
this.hv(a)
A.cW(this,s)},
fh(a,b){A.cu(a)
t.l.a(b)
this.b2(new A.aB(a,b))},
br(a){var s=this.$ti
s.i("1/").a(a)
if(s.i("Z<1>").b(a)){this.d6(a)
return}this.d3(a)},
d3(a){var s,r=this
r.$ti.c.a(a)
r.a^=2
s=r.b
s.b8(s,new A.l5(r,a))},
d6(a){A.p7(this.$ti.i("Z<1>").a(a),this,!1)
return},
b1(a){var s
this.a^=2
s=this.b
s.b8(s,new A.l4(this,a))},
$iZ:1}
A.l3.prototype={
$0(){A.cW(this.a,this.b)},
$S:0}
A.l7.prototype={
$0(){A.cW(this.b,this.a.a)},
$S:0}
A.l6.prototype={
$0(){A.p7(this.a.a,this.b,!0)},
$S:0}
A.l5.prototype={
$0(){this.a.c0(this.b)},
$S:0}
A.l4.prototype={
$0(){this.a.b2(this.b)},
$S:0}
A.la.prototype={
$0(){var s,r,q,p,o,n,m,l,k=this,j=null
try{q=k.a.a
p=q.b.b
j=p.bD(p,t.mY.a(q.d),t.z)}catch(o){s=A.aG(o)
r=A.c5(o)
if(k.c&&t.v.a(k.b.a.c).a===s){q=k.a
q.c=t.v.a(k.b.a.c)}else{q=s
p=r
if(p==null)p=A.i1(q)
n=k.a
n.c=new A.aB(q,p)
q=n}q.b=!0
return}if(j instanceof A.H&&(j.a&24)!==0){if((j.a&16)!==0){q=k.a
q.c=t.v.a(j.c)
q.b=!0}return}if(j instanceof A.H){m=k.b.a
l=new A.H(m.b,m.$ti)
j.bh(new A.lb(l,m),new A.lc(l),t.H)
q=k.a
q.c=l
q.b=!1}},
$S:0}
A.lb.prototype={
$1(a){this.a.fi(this.b)},
$S:16}
A.lc.prototype={
$2(a,b){A.cu(a)
t.l.a(b)
this.a.b2(new A.aB(a,b))},
$S:83}
A.l9.prototype={
$0(){var s,r,q,p,o,n,m,l,k
try{q=this.a
p=q.a
o=p.$ti
n=o.c
m=n.a(this.b)
l=p.b.b
q.c=l.bC(l,o.i("2/(1)").a(p.d),m,o.i("2/"),n)}catch(k){s=A.aG(k)
r=A.c5(k)
q=s
p=r
if(p==null)p=A.i1(q)
o=this.a
o.c=new A.aB(q,p)
o.b=!0}},
$S:0}
A.l8.prototype={
$0(){var s,r,q,p,o,n,m,l=this
try{s=t.v.a(l.a.a.c)
p=l.b
if(p.a.iC(s)&&p.a.e!=null){p.c=p.a.ij(s)
p.b=!1}}catch(o){r=A.aG(o)
q=A.c5(o)
p=t.v.a(l.a.a.c)
if(p.a===r){n=l.b
n.c=p
p=n}else{p=r
n=q
if(n==null)n=A.i1(p)
m=l.b
m.c=new A.aB(p,n)
p=m}p.b=!0}},
$S:0}
A.hm.prototype={}
A.cm.prototype={
gk(a){var s={},r=new A.H($.G,t.h0)
s.a=0
this.ep(new A.jZ(s,this),!0,new A.k_(s,r),r.gfg())
return r}}
A.jZ.prototype={
$1(a){this.b.$ti.c.a(a);++this.a.a},
$S(){return this.b.$ti.i("~(1)")}}
A.k_.prototype={
$0(){this.b.c_(this.a.a)},
$S:0}
A.eU.prototype={
gha(){var s,r=this
if((r.b&8)===0)return A.q(r).i("bh<1>?").a(r.a)
s=A.q(r)
return s.i("bh<1>?").a(s.i("eV<1>").a(r.a).gcq())},
fu(){var s,r,q=this
if((q.b&8)===0){s=q.a
if(s==null)s=q.a=new A.bh(A.q(q).i("bh<1>"))
return A.q(q).i("bh<1>").a(s)}r=A.q(q)
s=r.i("eV<1>").a(q.a).gcq()
return r.i("bh<1>").a(s)},
ghG(){var s=this.a
if((this.b&8)!==0)s=t.d3.a(s).gcq()
return A.q(this).i("cT<1>").a(s)},
f3(){if((this.b&4)!==0)return new A.cl("Cannot add event after closing")
return new A.cl("Cannot add event while adding a stream")},
hF(a,b,c,d){var s,r,q,p,o,n,m,l,k,j=this,i=A.q(j)
i.i("~(1)?").a(a)
t.jE.a(c)
if((j.b&3)!==0)throw A.f(A.bp("Stream has already been listened to."))
s=i.c
r=$.G
q=d?1:0
p=b!=null?32:0
o=t.H
s=r.bA(r,t.bm.G(s).i("1(2)").a(a),o,s)
A.vg(r,b)
n=c==null?A.xf():c
r.b5(r,t.M.a(n),o)
m=new A.cT(j,s,r,q|p,i.i("cT<1>"))
l=j.gha()
if(((j.b|=1)&8)!==0){k=i.i("eV<1>").a(j.a)
k.scq(m)
k.cM()}else j.a=m
m.hw(l)
m.ca(new A.lx(j))
return m},
hf(a){var s,r,q,p,o,n,m,l,k=this,j=A.q(k)
j.i("h2<1>").a(a)
s=null
if((k.b&8)!==0)s=j.i("eV<1>").a(k.a).aA()
k.a=null
k.b=k.b&4294967286|2
r=k.r
if(r!=null)if(s==null)try{q=r.$0()
if(q instanceof A.H)s=q}catch(n){p=A.aG(n)
o=A.c5(n)
m=new A.H($.G,t.cU)
j=A.cu(p)
l=t.l.a(o)
m.b1(new A.aB(j,l))
s=m}else s=s.cO(r)
j=new A.lw(k)
if(s!=null)s=s.cO(j)
else j.$0()
return s},
$ir8:1,
$icV:1}
A.lx.prototype={
$0(){A.pp(this.a.d)},
$S:0}
A.lw.prototype={
$0(){},
$S:0}
A.hn.prototype={
ck(a){var s=this.$ti
s.c.a(a)
this.ghG().f_(new A.cU(a,s.i("cU<1>")))}}
A.dw.prototype={}
A.dz.prototype={
gS(a){return(A.dr(this.a)^892482866)>>>0},
D(a,b){if(b==null)return!1
if(this===b)return!0
return b instanceof A.dz&&b.a===this.a}}
A.cT.prototype={
h3(){return this.w.hf(this)},
by(){var s=this.w,r=A.q(s)
r.i("h2<1>").a(this)
if((s.b&8)!==0)r.i("eV<1>").a(s.a).eu()
A.pp(s.e)},
bz(){var s=this.w,r=A.q(s)
r.i("h2<1>").a(this)
if((s.b&8)!==0)r.i("eV<1>").a(s.a).cM()
A.pp(s.f)}}
A.dx.prototype={
hw(a){var s=this
A.q(s).i("bh<1>?").a(a)
if(a==null)return
s.r=a
if(a.c!=null){s.e=(s.e|128)>>>0
a.bk(s)}},
eu(){var s,r,q=this,p=q.e
if((p&8)!==0)return
s=(p+256|4)>>>0
q.e=s
if(p<256){r=q.r
if(r!=null)if(r.a===1)r.a=3}if((p&4)===0&&(s&64)===0)q.ca(q.gdz())},
cM(){var s=this,r=s.e
if((r&8)!==0)return
if(r>=256){r=s.e=r-256
if(r<256)if((r&128)!==0&&s.r.c!=null)s.r.bk(s)
else{r=(r&4294967291)>>>0
s.e=r
if((r&64)===0)s.ca(s.gdA())}}},
by(){},
bz(){},
f_(a){var s,r=this,q=r.r
if(q==null)q=r.r=new A.bh(A.q(r).i("bh<1>"))
q.j(0,a)
s=r.e
if((s&128)===0){s=(s|128)>>>0
r.e=s
if(s<256)q.bk(r)}},
ck(a){var s,r=this,q=A.q(r).c
q.a(a)
s=r.e
r.e=(s|64)>>>0
r.d.iT(r.a,a,q)
r.e=(r.e&4294967231)>>>0
r.d8((s&4)!==0)},
ca(a){var s,r=this
t.M.a(a)
s=r.e
r.e=(s|64)>>>0
a.$0()
r.e=(r.e&4294967231)>>>0
r.d8((s&4)!==0)},
d8(a){var s,r,q=this,p=q.e
if((p&128)!==0&&q.r.c==null){p=q.e=(p&4294967167)>>>0
s=!1
if((p&4)!==0)if(p<256){s=q.r
s=s==null?null:s.c==null
s=s!==!1}if(s){p=(p&4294967291)>>>0
q.e=p}}for(;;a=r){if((p&8)!==0){q.r=null
return}r=(p&4)!==0
if(a===r)break
q.e=(p^64)>>>0
if(r)q.by()
else q.bz()
p=(q.e&4294967231)>>>0
q.e=p}if((p&128)!==0&&p<256)q.r.bk(q)},
$ih2:1,
$icV:1}
A.eW.prototype={
ep(a,b,c,d){var s=this.$ti
s.i("~(1)?").a(a)
t.jE.a(c)
return this.a.hF(s.i("~(1)?").a(a),d,c,b===!0)}}
A.eD.prototype={}
A.cU.prototype={}
A.bh.prototype={
bk(a){var s,r=this
r.$ti.i("cV<1>").a(a)
s=r.a
if(s===1)return
if(s>=1){r.a=1
return}A.yn(new A.ll(r,a))
r.a=1},
j(a,b){var s=this,r=s.c
if(r==null)s.b=s.c=b
else s.c=r.a=b}}
A.ll.prototype={
$0(){var s,r,q,p=this.a,o=p.a
p.a=0
if(o===3)return
s=p.$ti.i("cV<1>").a(this.b)
r=p.b
q=r.a
p.b=q
if(q==null)p.c=null
A.q(r).i("cV<1>").a(s).ck(r.b)},
$S:0}
A.c_.prototype={
gn(){var s=this
if(s.c)return s.$ti.c.a(s.b)
return s.$ti.c.a(null)},
l(){var s,r=this,q=r.a
if(q!=null){if(r.c){s=new A.H($.G,t.k)
r.b=s
r.c=!1
q.cM()
return s}throw A.f(A.bp("Already waiting for next."))}return r.fP()},
fP(){var s,r,q=this,p=q.b
if(p!=null){q.$ti.i("cm<1>").a(p)
s=new A.H($.G,t.k)
q.b=s
r=p.ep(q.gh4(),!0,q.gh6(),q.gh8())
if(q.b!=null)q.a=r
return s}return $.td()},
aA(){var s,r,q=this,p=q.a,o=q.b
q.b=null
if(p!=null){q.a=null
if(!q.c)t.k.a(o).br(!1)
else q.c=!1
s=p.e=(p.e&4294967279)>>>0
if((s&8)===0){s=p.e=(s|8)>>>0
if((s&128)!==0){r=p.r
if(r.a===1)r.a=3}if((s&64)===0)p.r=null
p.f=p.h3()}s=p.f
return s==null?$.pL():s}return $.pL()},
h5(a){var s,r,q=this
q.$ti.c.a(a)
if(q.a==null)return
s=t.k.a(q.b)
q.b=a
q.c=!0
s.c_(!0)
if(q.c){r=q.a
if(r!=null)r.eu()}},
h9(a,b){var s,r,q=this
A.cu(a)
t.l.a(b)
s=q.a
r=t.k.a(q.b)
q.b=q.a=null
if(s!=null)r.b2(new A.aB(a,b))
else r.b1(new A.aB(a,b))},
h7(){var s=this,r=s.a,q=t.k.a(s.b)
s.b=s.a=null
if(r!=null)q.c0(!1)
else q.d3(!1)}}
A.kS.prototype={
iS(a){var s,r,q,p,o=this
t.M.a(a)
try{q=o.bD(o,a,t.H)
return q}catch(p){s=A.aG(p)
r=A.c5(p)
o.b3(o,s,r)}},
iT(a,b,c){var s,r,q,p,o=this
c.i("~(0)").a(a)
c.a(b)
try{q=o.bC(o,a,b,t.H,c)
return q}catch(p){s=A.aG(p)
r=A.c5(p)
o.b3(o,s,r)}},
e9(a,b){return new A.kU(this,this.b5(this,b.i("0()").a(a),b),b)},
hW(a){return new A.kT(this,this.b5(this,t.M.a(a),t.H))},
b3(a,b,c){var s,r,q,p,o,n,m,l
t.l.a(c)
s=null
if(s==null){A.wS(b,c)
return}r=s.gcR()
q=r.gj6()
p=$.G
try{$.G=q
s.ii(r,r.gcf(),a,b,c)
$.G=p}catch(m){o=A.aG(m)
n=A.c5(m)
$.G=p
l=b===o?c:n
q.b3(r,o,l)}},
bD(a,b,c){var s,r,q
c.i("0()").a(b)
r=$.G
if(r===a)return b.$0()
s=r
$.G=a
try{r=b.$0()
return r}finally{$.G=s}q=null.gcR()
return null.j8(q,q.gcf(),a,b)},
bC(a,b,c,d,e){var s,r,q
d.i("@<0>").G(e).i("1(2)").a(b)
e.a(c)
r=$.G
if(r===a)return b.$1(c)
s=r
$.G=a
try{r=b.$1(c)
return r}finally{$.G=s}q=null.gcR()
return null.ii(q,q.gcf(),a,b,c)},
hr(a,b,c,d,e,f,g){var s,r,q
e.i("@<0>").G(f).G(g).i("1(2,3)").a(b)
f.a(c)
g.a(d)
r=$.G
if(r===a)return b.$2(c,d)
s=r
$.G=a
try{r=b.$2(c,d)
return r}finally{$.G=s}q=null.gcR()
return null.j9(q,q.gcf(),a,b,c,d)},
b5(a,b,c){c.i("0()").a(b)
return b},
bA(a,b,c,d){c.i("@<0>").G(d).i("1(2)").a(b)
return b},
ci(a,b,c,d,e){c.i("@<0>").G(d).G(e).i("1(2,3)").a(b)
return b},
fv(a,b,c){return null},
b8(a,b){A.po(a,t.M.a(b))
return},
dc(a,b,c){t.M.a(c)
return A.qU(b,B.l!==a?a.e9(c,t.H):c)}}
A.kU.prototype={
$0(){var s=this.a
return s.bD(s,this.b,this.c)},
$S(){return this.c.i("0()")}}
A.kT.prototype={
$0(){return this.a.iS(this.b)},
$S:0}
A.mi.prototype={
$0(){A.u8(this.a,this.b)},
$S:0}
A.cY.prototype={
gp(a){var s=this,r=new A.eG(s,s.r,A.q(s).i("eG<1>"))
r.c=s.e
return r},
gk(a){return this.a},
gB(a){return this.a===0},
gJ(a){return this.a!==0},
u(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.g.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.g.a(r[b])!=null}else return this.fm(b)},
fm(a){var s=this.d
if(s==null)return!1
return this.c8(s[this.c1(a)],a)>=0},
gt(a){var s=this.e
if(s==null)throw A.f(A.bp("No elements"))
return A.q(this).c.a(s.a)},
gE(a){var s=this.f
if(s==null)throw A.f(A.bp("No elements"))
return A.q(this).c.a(s.a)},
j(a,b){var s,r,q=this
A.q(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.d1(s==null?q.b=A.p8():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.d1(r==null?q.c=A.p8():r,b)}else return q.eY(b)},
eY(a){var s,r,q,p=this
A.q(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.p8()
r=p.c1(a)
q=s[r]
if(q==null)s[r]=[p.ce(a)]
else{if(p.c8(q,a)>=0)return!1
q.push(p.ce(a))}return!0},
a5(a,b){if((b&1073741823)===b)return this.fe(this.c,b)
else return this.hi(b)},
hi(a){var s,r,q,p,o=this,n=o.d
if(n==null)return!1
s=o.c1(a)
r=n[s]
q=o.c8(r,a)
if(q<0)return!1
p=r.splice(q,1)[0]
if(0===r.length)delete n[s]
o.d9(p)
return!0},
d1(a,b){A.q(this).c.a(b)
if(t.g.a(a[b])!=null)return!1
a[b]=this.ce(b)
return!0},
fe(a,b){var s
if(a==null)return!1
s=t.g.a(a[b])
if(s==null)return!1
this.d9(s)
delete a[b]
return!0},
dv(){this.r=this.r+1&1073741823},
ce(a){var s,r=this,q=new A.hA(A.q(r).c.a(a))
if(r.e==null)r.e=r.f=q
else{s=r.f
s.toString
q.c=s
r.f=s.b=q}++r.a
r.dv()
return q},
d9(a){var s=this,r=a.c,q=a.b
if(r==null)s.e=q
else r.b=q
if(q==null)s.f=r
else q.c=r;--s.a
s.dv()},
c1(a){return J.ao(a)&1073741823},
c8(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.l(a[r].a,b))return r
return-1}}
A.hA.prototype={}
A.eG.prototype={
gn(){var s=this.d
return s==null?this.$ti.c.a(s):s},
l(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.f(A.a0(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.i("1?").a(r.a)
s.c=r.b
return!0}},
$iF:1}
A.y.prototype={
gp(a){return new A.a1(a,this.gk(a),A.a7(a).i("a1<y.E>"))},
O(a,b){return this.h(a,b)},
Z(a,b){var s,r
A.a7(a).i("~(y.E)").a(b)
s=this.gk(a)
for(r=0;r<s;++r){b.$1(this.h(a,r))
if(s!==this.gk(a))throw A.f(A.a0(a))}},
gB(a){return this.gk(a)===0},
gJ(a){return!this.gB(a)},
gt(a){if(this.gk(a)===0)throw A.f(A.ae())
return this.h(a,0)},
gE(a){if(this.gk(a)===0)throw A.f(A.ae())
return this.h(a,this.gk(a)-1)},
u(a,b){var s,r=this.gk(a)
for(s=0;s<r;++s){if(J.l(this.h(a,s),b))return!0
if(r!==this.gk(a))throw A.f(A.a0(a))}return!1},
a4(a,b){var s,r
A.a7(a).i("w(y.E)").a(b)
s=this.gk(a)
for(r=0;r<s;++r){if(!b.$1(this.h(a,r)))return!1
if(s!==this.gk(a))throw A.f(A.a0(a))}return!0},
aj(a,b){var s,r
A.a7(a).i("w(y.E)").a(b)
s=this.gk(a)
for(r=0;r<s;++r){if(b.$1(this.h(a,r)))return!0
if(s!==this.gk(a))throw A.f(A.a0(a))}return!1},
ab(a,b){var s
if(this.gk(a)===0)return""
s=A.p6("",a,b)
return s.charCodeAt(0)==0?s:s},
cP(a,b){var s=A.a7(a)
return new A.aV(a,s.i("w(y.E)").a(b),s.i("aV<y.E>"))},
cQ(a,b){return new A.bS(a,b.i("bS<0>"))},
aJ(a,b,c){var s=A.a7(a)
return new A.aQ(a,s.G(c).i("1(y.E)").a(b),s.i("@<y.E>").G(c).i("aQ<1,2>"))},
bI(a,b,c,d){var s,r,q
d.a(b)
A.a7(a).G(d).i("1(1,y.E)").a(c)
s=this.gk(a)
for(r=b,q=0;q<s;++q){r=c.$2(r,this.h(a,q))
if(s!==this.gk(a))throw A.f(A.a0(a))}return r},
T(a,b){return A.aU(a,b,null,A.a7(a).i("y.E"))},
am(a,b){return A.aU(a,0,A.bv(b,"count",t.S),A.a7(a).i("y.E"))},
ez(a){var s,r=A.qx(A.a7(a).i("y.E"))
for(s=0;s<this.gk(a);++s)r.j(0,this.h(a,s))
return r},
j(a,b){var s
A.a7(a).i("y.E").a(b)
s=this.gk(a)
this.sk(a,s+1)
this.m(a,s,b)},
bH(a,b){return new A.bz(a,A.a7(a).i("@<y.E>").G(b).i("bz<1,2>"))},
F(a,b,c){var s,r=this.gk(a)
if(c==null)c=r
A.aw(b,c,r)
s=A.W(this.bj(a,b,c),A.a7(a).i("y.E"))
return s},
W(a,b){return this.F(a,b,null)},
bj(a,b,c){A.aw(b,c,this.gk(a))
return A.aU(a,b,c,A.a7(a).i("y.E"))},
ak(a,b,c,d){var s,r,q=A.a7(a)
q.i("y.E?").a(d)
s=d==null?q.i("y.E").a(d):d
A.aw(b,c,this.gk(a))
for(r=b;r<c;++r)this.m(a,r,s)},
Y(a,b,c,d,e){var s,r,q,p,o
A.a7(a).i("j<y.E>").a(d)
A.aw(b,c,this.gk(a))
s=c-b
if(s===0)return
A.ab(e,"skipCount")
if(t.j.b(d)){r=e
q=d}else{q=J.d3(d,e).aX(0,!1)
r=0}p=J.n(q)
if(r+s>p.gk(q))throw A.f(A.ql())
if(r<b)for(o=s-1;o>=0;--o)this.m(a,b+o,p.h(q,r+o))
else for(o=0;o<s;++o)this.m(a,b+o,p.h(q,r+o))},
R(a,b,c,d){return this.Y(a,b,c,d,0)},
aU(a,b,c){var s
if(c<0)c=0
for(s=c;s<this.gk(a);++s)if(J.l(this.h(a,s),b))return s
return-1},
bR(a,b,c){var s,r
A.a7(a).i("j<y.E>").a(c)
if(t.j.b(c))this.R(a,b,b+c.length,c)
else for(s=J.B(c);s.l();b=r){r=b+1
this.m(a,b,s.gn())}},
q(a){return A.oV(a,"[","]")},
$ix:1,
$ij:1,
$ik:1}
A.T.prototype={
bc(a,b,c){var s=A.q(this)
return A.qy(this,s.i("T.K"),s.i("T.V"),b,c)},
Z(a,b){var s,r,q,p=A.q(this)
p.i("~(T.K,T.V)").a(b)
for(s=this.gX(),s=s.gp(s),p=p.i("T.V");s.l();){r=s.gn()
q=this.h(0,r)
b.$2(r,q==null?p.a(q):q)}},
ga7(){return this.gX().aJ(0,new A.jk(this),A.q(this).i("a5<T.K,T.V>"))},
K(a){return this.gX().u(0,a)},
gk(a){var s=this.gX()
return s.gk(s)},
gB(a){var s=this.gX()
return s.gB(s)},
gJ(a){var s=this.gX()
return s.gJ(s)},
gaL(){return new A.eH(this,A.q(this).i("eH<T.K,T.V>"))},
q(a){return A.p0(this)},
$iK:1}
A.jk.prototype={
$1(a){var s=this.a,r=A.q(s)
r.i("T.K").a(a)
s=s.h(0,a)
if(s==null)s=r.i("T.V").a(s)
return new A.a5(a,s,r.i("a5<T.K,T.V>"))},
$S(){return A.q(this.a).i("a5<T.K,T.V>(T.K)")}}
A.jl.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.u(a)
r.a=(r.a+=s)+": "
s=A.u(b)
r.a+=s},
$S:41}
A.eH.prototype={
gk(a){var s=this.a
return s.gk(s)},
gB(a){var s=this.a
return s.gB(s)},
gJ(a){var s=this.a
return s.gJ(s)},
gt(a){var s=this.a,r=s.gX()
r=s.h(0,r.gt(r))
return r==null?this.$ti.y[1].a(r):r},
gE(a){var s=this.a,r=s.gX()
r=s.h(0,r.gE(r))
return r==null?this.$ti.y[1].a(r):r},
gp(a){var s=this.a,r=s.gX()
return new A.eI(r.gp(r),s,this.$ti.i("eI<1,2>"))}}
A.eI.prototype={
l(){var s=this,r=s.a
if(r.l()){s.c=s.b.h(0,r.gn())
return!0}s.c=null
return!1},
gn(){var s=this.c
return s==null?this.$ti.y[1].a(s):s},
$iF:1}
A.bK.prototype={
gB(a){return this.gk(this)===0},
gJ(a){return this.gk(this)!==0},
q(a){return A.oV(this,"{","}")},
am(a,b){return A.qS(this,b,A.q(this).c)},
T(a,b){return A.qP(this,b,A.q(this).c)},
gt(a){var s=this.gp(this)
if(!s.l())throw A.f(A.ae())
return s.gn()},
gE(a){var s,r=this.gp(this)
if(!r.l())throw A.f(A.ae())
do s=r.gn()
while(r.l())
return s},
O(a,b){var s,r
A.ab(b,"index")
s=this.gp(this)
for(r=b;s.l();){if(r===0)return s.gn();--r}throw A.f(A.iO(b,b-r,this,"index"))},
$ix:1,
$ij:1,
$ick:1}
A.eS.prototype={}
A.hx.prototype={
h(a,b){var s,r=this.b
if(r==null)return this.c.h(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.hd(b):s}},
gk(a){return this.b==null?this.c.a:this.aN().length},
gB(a){return this.gk(0)===0},
gJ(a){return this.gk(0)>0},
gX(){if(this.b==null){var s=this.c
return new A.aH(s,A.q(s).i("aH<1>"))}return new A.hy(this)},
gaL(){var s,r=this
if(r.b==null){s=r.c
return new A.bc(s,A.q(s).i("bc<2>"))}return A.p1(r.aN(),new A.lf(r),t.N,t.z)},
m(a,b,c){var s,r,q=this
A.P(b)
if(q.b==null)q.c.m(0,b,c)
else if(q.K(b)){s=q.b
s[b]=c
r=q.a
if(r==null?s!=null:r!==s)r[b]=null}else q.hN().m(0,b,c)},
K(a){if(this.b==null)return this.c.K(a)
if(typeof a!="string")return!1
return Object.prototype.hasOwnProperty.call(this.a,a)},
Z(a,b){var s,r,q,p,o=this
t.jR.a(b)
if(o.b==null)return o.c.Z(0,b)
s=o.aN()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.lV(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.f(A.a0(o))}},
aN(){var s=t.lH.a(this.c)
if(s==null)s=this.c=A.b(Object.keys(this.a),t.s)
return s},
hN(){var s,r,q,p,o,n=this
if(n.b==null)return n.c
s=A.A(t.N,t.z)
r=n.aN()
for(q=0;p=r.length,q<p;++q){o=r[q]
s.m(0,o,n.h(0,o))}if(p===0)B.a.j(r,"")
else B.a.a1(r)
n.a=n.b=null
return n.c=s},
hd(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.lV(this.a[a])
return this.b[a]=s}}
A.lf.prototype={
$1(a){return this.a.h(0,A.P(a))},
$S:38}
A.hy.prototype={
gk(a){return this.a.gk(0)},
O(a,b){var s=this.a
if(s.b==null)s=s.gX().O(0,b)
else{s=s.aN()
if(!(b>=0&&b<s.length))return A.a(s,b)
s=s[b]}return s},
gp(a){var s=this.a
if(s.b==null){s=s.gX()
s=s.gp(s)}else{s=s.aN()
s=new J.b6(s,s.length,A.D(s).i("b6<1>"))}return s},
u(a,b){return this.a.K(b)}}
A.lD.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:true})
return s}catch(r){}return null},
$S:36}
A.lC.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:false})
return s}catch(r){}return null},
$S:36}
A.d8.prototype={}
A.fq.prototype={}
A.fu.prototype={}
A.dj.prototype={
q(a){var s=A.fv(this.a)
return(this.b!=null?"Converting object to an encodable object failed:":"Converting object did not return an encodable object:")+" "+s}}
A.fN.prototype={
q(a){return"Cyclic error in JSON stringify"}}
A.fM.prototype={
ef(a,b){var s=A.wJ(a,this.gi3().a)
return s},
aB(a,b){var s=A.vm(a,this.gi6().b,null)
return s},
gi6(){return B.by},
gi3(){return B.bx}}
A.iW.prototype={}
A.iV.prototype={}
A.lh.prototype={
eB(a){var s,r,q,p,o,n,m=a.length
for(s=this.c,r=0,q=0;q<m;++q){p=a.charCodeAt(q)
if(p>92){if(p>=55296){o=p&64512
if(o===55296){n=q+1
n=!(n<m&&(a.charCodeAt(n)&64512)===56320)}else n=!1
if(!n)if(o===56320){o=q-1
o=!(o>=0&&(a.charCodeAt(o)&64512)===55296)}else o=!1
else o=!0
if(o){if(q>r)s.a+=B.d.a2(a,r,q)
r=q+1
o=A.O(92)
s.a+=o
o=A.O(117)
s.a+=o
o=A.O(100)
s.a+=o
o=p>>>8&15
o=A.O(o<10?48+o:87+o)
s.a+=o
o=p>>>4&15
o=A.O(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.O(o<10?48+o:87+o)
s.a+=o}}continue}if(p<32){if(q>r)s.a+=B.d.a2(a,r,q)
r=q+1
o=A.O(92)
s.a+=o
switch(p){case 8:o=A.O(98)
s.a+=o
break
case 9:o=A.O(116)
s.a+=o
break
case 10:o=A.O(110)
s.a+=o
break
case 12:o=A.O(102)
s.a+=o
break
case 13:o=A.O(114)
s.a+=o
break
default:o=A.O(117)
s.a+=o
o=A.O(48)
s.a=(s.a+=o)+o
o=p>>>4&15
o=A.O(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.O(o<10?48+o:87+o)
s.a+=o
break}}else if(p===34||p===92){if(q>r)s.a+=B.d.a2(a,r,q)
r=q+1
o=A.O(92)
s.a+=o
o=A.O(p)
s.a+=o}}if(r===0)s.a+=a
else if(r<m)s.a+=B.d.a2(a,r,m)},
bZ(a){var s,r,q,p
for(s=this.a,r=s.length,q=0;q<r;++q){p=s[q]
if(a==null?p==null:a===p)throw A.f(new A.fN(a,null))}B.a.j(s,a)},
bP(a){var s,r,q,p,o=this
if(o.eA(a))return
o.bZ(a)
try{s=o.b.$1(a)
if(!o.eA(s)){q=A.qs(a,null,o.gdC())
throw A.f(q)}q=o.a
if(0>=q.length)return A.a(q,-1)
q.pop()}catch(p){r=A.aG(p)
q=A.qs(a,r,o.gdC())
throw A.f(q)}},
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
return!0}else if(t.j.b(a)){q.bZ(a)
q.j3(a)
s=q.a
if(0>=s.length)return A.a(s,-1)
s.pop()
return!0}else if(t.f.b(a)){q.bZ(a)
r=q.j4(a)
s=q.a
if(0>=s.length)return A.a(s,-1)
s.pop()
return r}else return!1},
j3(a){var s,r,q=this.c
q.a+="["
s=J.n(a)
if(s.gJ(a)){this.bP(s.h(a,0))
for(r=1;r<s.gk(a);++r){q.a+=","
this.bP(s.h(a,r))}}q.a+="]"},
j4(a){var s,r,q,p,o,n,m=this,l={}
if(a.gB(a)){m.c.a+="{}"
return!0}s=a.gk(a)*2
r=A.a9(s,null,!1,t.O)
q=l.a=0
l.b=!0
a.Z(0,new A.li(l,r))
if(!l.b)return!1
p=m.c
p.a+="{"
for(o='"';q<s;q+=2,o=',"'){p.a+=o
m.eB(A.P(r[q]))
p.a+='":'
n=q+1
if(!(n<s))return A.a(r,n)
m.bP(r[n])}p.a+="}"
return!0}}
A.li.prototype={
$2(a,b){var s,r
if(typeof a!="string")this.a.b=!1
s=this.b
r=this.a
B.a.m(s,r.a++,a)
B.a.m(s,r.a++,b)},
$S:41}
A.lg.prototype={
gdC(){var s=this.c.a
return s.charCodeAt(0)==0?s:s}}
A.hh.prototype={
ee(a,b){t.L.a(a)
return(b===!0?B.eZ:B.eY).cA(a)},
ed(a){return this.ee(a,null)}}
A.kF.prototype={
cA(a){var s,r,q,p=a.length,o=A.aw(0,null,p)
if(o===0)return new Uint8Array(0)
s=new Uint8Array(o*3)
r=new A.lE(s)
if(r.fD(a,0,o)!==o){q=o-1
if(!(q>=0&&q<p))return A.a(a,q)
r.cs()}return B.E.F(s,0,r.b)}}
A.lE.prototype={
cs(){var s,r=this,q=r.c,p=r.b,o=r.b=p+1
q.$flags&2&&A.r(q)
s=q.length
if(!(p<s))return A.a(q,p)
q[p]=239
p=r.b=o+1
if(!(o<s))return A.a(q,o)
q[o]=191
r.b=p+1
if(!(p<s))return A.a(q,p)
q[p]=189},
hQ(a,b){var s,r,q,p,o,n=this
if((b&64512)===56320){s=65536+((a&1023)<<10)|b&1023
r=n.c
q=n.b
p=n.b=q+1
r.$flags&2&&A.r(r)
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
return!0}else{n.cs()
return!1}},
fD(a,b,c){var s,r,q,p,o,n,m,l,k=this
if(b!==c){s=c-1
if(!(s>=0&&s<a.length))return A.a(a,s)
s=(a.charCodeAt(s)&64512)===55296}else s=!1
if(s)--c
for(s=k.c,r=s.$flags|0,q=s.length,p=a.length,o=b;o<c;++o){if(!(o<p))return A.a(a,o)
n=a.charCodeAt(o)
if(n<=127){m=k.b
if(m>=q)break
k.b=m+1
r&2&&A.r(s)
s[m]=n}else{m=n&64512
if(m===55296){if(k.b+4>q)break
m=o+1
if(!(m<p))return A.a(a,m)
if(k.hQ(n,a.charCodeAt(m)))o=m}else if(m===56320){if(k.b+3>q)break
k.cs()}else if(n<=2047){m=k.b
l=m+1
if(l>=q)break
k.b=l
r&2&&A.r(s)
if(!(m<q))return A.a(s,m)
s[m]=n>>>6|192
k.b=l+1
s[l]=n&63|128}else{m=k.b
if(m+2>=q)break
l=k.b=m+1
r&2&&A.r(s)
if(!(m<q))return A.a(s,m)
s[m]=n>>>12|224
m=k.b=l+1
if(!(l<q))return A.a(s,l)
s[l]=n>>>6&63|128
k.b=m+1
if(!(m<q))return A.a(s,m)
s[m]=n&63|128}}}return o}}
A.hi.prototype={
cA(a){return new A.f1(this.a).c2(t.L.a(a),0,null,!0)}}
A.f1.prototype={
c2(a,b,c,d){var s,r,q,p,o,n,m,l=this
t.L.a(a)
s=A.aw(b,c,a.length)
if(b===s)return""
if(a instanceof Uint8Array){r=a
q=r
p=0}else{q=A.vL(a,b,s)
s-=b
p=b
b=0}if(s-b>=15){o=l.a
n=A.vK(o,q,b,s)
if(n!=null){if(!o)return n
if(n.indexOf("\ufffd")<0)return n}}n=l.c3(q,b,s,!0)
o=l.b
if((o&1)!==0){m=A.vM(o)
l.b=0
throw A.f(A.de(m,a,p+l.c))}return n},
c3(a,b,c,d){var s,r,q=this
if(c-b>1000){s=B.b.C(b+c,2)
r=q.c3(a,b,s,!1)
if((q.b&1)!==0)return r
return r+q.c3(a,s,c,d)}return q.i2(a,b,c,d)},
i2(a,b,a0,a1){var s,r,q,p,o,n,m,l,k=this,j="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFFFFFFFFFFFFFFFFGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHIHHHJEEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBKCCCCCCCCCCCCDCLONNNMEEEEEEEEEEE",i=" \x000:XECCCCCN:lDb \x000:XECCCCCNvlDb \x000:XECCCCCN:lDb AAAAA\x00\x00\x00\x00\x00AAAAA00000AAAAA:::::AAAAAGG000AAAAA00KKKAAAAAG::::AAAAA:IIIIAAAAA000\x800AAAAA\x00\x00\x00\x00 AAAAA",h=65533,g=k.b,f=k.c,e=new A.bg(""),d=b+1,c=a.length
if(!(b>=0&&b<c))return A.a(a,b)
s=a[b]
A:for(r=k.a;;){for(;;d=o){if(!(s>=0&&s<256))return A.a(j,s)
q=j.charCodeAt(s)&31
f=g<=32?s&61694>>>q:(s&63|f<<6)>>>0
p=g+q
if(!(p>=0&&p<144))return A.a(i,p)
g=i.charCodeAt(p)
if(g===0){p=A.O(f)
e.a+=p
if(d===a0)break A
break}else if((g&1)!==0){if(r)switch(g){case 69:case 67:p=A.O(h)
e.a+=p
break
case 65:p=A.O(h)
e.a+=p;--d
break
default:p=A.O(h)
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
p=A.O(a[l])
e.a+=p}else{p=A.bq(a,d,n)
e.a+=p}if(n===a0)break A
d=o}else d=o}if(a1&&g>32)if(r){c=A.O(h)
e.a+=c}else{k.b=77
k.c=a0
return""}k.b=g
k.c=f
c=e.a
return c.charCodeAt(0)==0?c:c}}
A.bl.prototype={
D(a,b){if(b==null)return!1
return b instanceof A.bl&&this.a===b.a},
gS(a){return B.b.gS(this.a)},
a6(a,b){return B.b.a6(this.a,t.jS.a(b).a)},
q(a){var s,r,q,p=this.a,o=p%36e8,n=B.b.C(o,6e7)
o%=6e7
s=n<10?"0":""
r=B.b.C(o,1e6)
q=r<10?"0":""
return""+(p/36e8|0)+":"+s+n+":"+q+r+"."+B.d.iF(B.b.q(o%1e6),6,"0")},
$ib9:1}
A.hq.prototype={
q(a){return this.ap()},
$ibA:1}
A.Y.prototype={
gb_(){return A.uS(this)}}
A.fe.prototype={
q(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.fv(s)
return"Assertion failed"}}
A.bO.prototype={}
A.b5.prototype={
gc7(){return"Invalid argument"+(!this.a?"(s)":"")},
gc6(){return""},
q(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+A.u(p),n=s.gc7()+q+o
if(!s.a)return n
return n+s.gc6()+": "+A.fv(s.gcI())},
gcI(){return this.b}}
A.cj.prototype={
gcI(){return A.f3(this.b)},
gc7(){return"RangeError"},
gc6(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.u(q):""
else if(q==null)s=": Not greater than or equal to "+A.u(r)
else if(q>r)s=": Not in inclusive range "+A.u(r)+".."+A.u(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.u(r)
return s}}
A.fG.prototype={
gcI(){return A.v(this.b)},
gc7(){return"RangeError"},
gc6(){if(A.v(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
$icj:1,
gk(a){return this.f}}
A.ev.prototype={
q(a){return"Unsupported operation: "+this.a}}
A.hf.prototype={
q(a){return"UnimplementedError: "+this.a}}
A.cl.prototype={
q(a){return"Bad state: "+this.a}}
A.fp.prototype={
q(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.fv(s)+"."}}
A.fT.prototype={
q(a){return"Out of Memory"},
gb_(){return null},
$iY:1}
A.eq.prototype={
q(a){return"Stack Overflow"},
gb_(){return null},
$iY:1}
A.l2.prototype={
q(a){return"Exception: "+this.a}}
A.a4.prototype={
q(a){var s,r,q,p,o,n,m,l,k,j,i,h=this.a,g=""!==h?"FormatException: "+h:"FormatException",f=this.c,e=this.b
if(typeof e=="string"){if(f!=null)s=f<0||f>e.length
else s=!1
if(s)f=null
if(f==null){if(e.length>78)e=B.d.a2(e,0,75)+"..."
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
k=""}return g+l+B.d.a2(e,i,j)+k+"\n"+B.d.ag(" ",f-i+l.length)+"^\n"}else return f!=null?g+(" (at offset "+A.u(f)+")"):g}}
A.j.prototype={
bH(a,b){return A.cz(this,A.q(this).i("j.E"),b)},
aJ(a,b,c){var s=A.q(this)
return A.p1(this,s.G(c).i("1(j.E)").a(b),s.i("j.E"),c)},
cP(a,b){var s=A.q(this)
return new A.aV(this,s.i("w(j.E)").a(b),s.i("aV<j.E>"))},
cQ(a,b){return new A.bS(this,b.i("bS<0>"))},
u(a,b){var s
for(s=this.gp(this);s.l();)if(J.l(s.gn(),b))return!0
return!1},
Z(a,b){var s
A.q(this).i("~(j.E)").a(b)
for(s=this.gp(this);s.l();)b.$1(s.gn())},
a4(a,b){var s
A.q(this).i("w(j.E)").a(b)
for(s=this.gp(this);s.l();)if(!b.$1(s.gn()))return!1
return!0},
ab(a,b){var s,r,q=this.gp(this)
if(!q.l())return""
s=J.bj(q.gn())
if(!q.l())return s
if(b.length===0){r=s
do r+=J.bj(q.gn())
while(q.l())}else{r=s
do r=r+b+J.bj(q.gn())
while(q.l())}return r.charCodeAt(0)==0?r:r},
aj(a,b){var s
A.q(this).i("w(j.E)").a(b)
for(s=this.gp(this);s.l();)if(b.$1(s.gn()))return!0
return!1},
aX(a,b){var s=A.q(this).i("j.E")
if(b)s=A.W(this,s)
else{s=A.W(this,s)
s.$flags=1
s=s}return s},
ey(a){return this.aX(0,!0)},
gk(a){var s,r=this.gp(this)
for(s=0;r.l();)++s
return s},
gB(a){return!this.gp(this).l()},
gJ(a){return!this.gB(this)},
am(a,b){return A.qS(this,b,A.q(this).i("j.E"))},
T(a,b){return A.qP(this,b,A.q(this).i("j.E"))},
gt(a){var s=this.gp(this)
if(!s.l())throw A.f(A.ae())
return s.gn()},
gE(a){var s,r=this.gp(this)
if(!r.l())throw A.f(A.ae())
do s=r.gn()
while(r.l())
return s},
O(a,b){var s,r
A.ab(b,"index")
s=this.gp(this)
for(r=b;s.l();){if(r===0)return s.gn();--r}throw A.f(A.iO(b,b-r,this,"index"))},
q(a){return A.um(this,"(",")")}}
A.a5.prototype={
q(a){return"MapEntry("+A.u(this.a)+": "+A.u(this.b)+")"}}
A.a3.prototype={
gS(a){return A.m.prototype.gS.call(this,0)},
q(a){return"null"}}
A.m.prototype={$im:1,
D(a,b){return this===b},
gS(a){return A.dr(this)},
q(a){return"Instance of '"+A.fY(this)+"'"},
gV(a){return A.xK(this)},
toString(){return this.q(this)}}
A.hK.prototype={
q(a){return""},
$ibf:1}
A.aq.prototype={
gp(a){return new A.cO(this.a)},
gE(a){var s,r,q,p=this.a,o=p.length
if(o===0)throw A.f(A.bp("No elements."))
s=o-1
if(!(s>=0))return A.a(p,s)
r=p.charCodeAt(s)
if((r&64512)===56320&&o>1){s=o-2
if(!(s>=0))return A.a(p,s)
q=p.charCodeAt(s)
if((q&64512)===55296)return A.rm(q,r)}return r}}
A.cO.prototype={
gn(){return this.d},
l(){var s,r,q,p=this,o=p.b=p.c,n=p.a,m=n.length
if(o===m){p.d=-1
return!1}if(!(o<m))return A.a(n,o)
s=n.charCodeAt(o)
r=o+1
if((s&64512)===55296&&r<m){if(!(r<m))return A.a(n,r)
q=n.charCodeAt(r)
if((q&64512)===56320){p.c=r+1
p.d=A.rm(s,q)
return!0}}p.c=r
p.d=s
return!0},
$iF:1}
A.bg.prototype={
gk(a){return this.a.length},
q(a){var s=this.a
return s.charCodeAt(0)==0?s:s},
$iv3:1}
A.jt.prototype={
q(a){return"Promise was rejected with a value of `"+(this.a?"undefined":"null")+"`."}}
A.oi.prototype={
$1(a){return this.a.bd(this.b.i("0/?").a(a))},
$S:33}
A.oj.prototype={
$1(a){if(a==null)return this.a.eb(new A.jt(a===undefined))
return this.a.eb(a)},
$S:33}
A.ds.prototype={
ap(){return"TextAlign."+this.b}}
A.i9.prototype={
$2(a,b){var s=t.dt
s=s.a(a).b-s.a(b).b
if(s>0)return 1
else if(s<0)return-1
return 0},
$S:46}
A.bX.prototype={}
A.h4.prototype={
dZ(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i=this,h=A.b([i.cp(b,c),i.cp(b,d),i.cp(b,e)],t.b)
for(s=1/0,r=-1/0,q=0;q<3;++q){p=h[q]
if(0>=p.length)return A.a(p,0)
o=p[0]
s=Math.min(s,o)
r=Math.max(r,o)}for(o=i.b,n=B.c.U(s/o)+1,m=h;l=n*o,l<r;++n,m=j){k=i.dT(m,0,l)
j=k.b
i.dN(k.a)
if(j.length<3)return}i.dN(m)},
cp(a,b){var s,r,q,p,o,n=A.b([],t.n)
for(s=this.a,r=b*s,q=a.length,p=0;p<s;++p){o=r+p
if(!(o<q))return A.a(a,o)
n.push(a[o])}return n},
dN(a){var s,r,q,p,o,n,m,l,k,j,i=this
t.x.a(a)
if(a.length<3)return
if(B.a.aj(a,A.yB())){i.c5(a)
return}for(s=a.length,r=1/0,q=-1/0,p=0;p<s;++p){o=a[p]
if(1>=o.length)return A.a(o,1)
n=o[1]
r=Math.min(r,n)
q=Math.max(q,n)}for(s=i.b,m=B.c.U(r/s)+1,l=a;n=m*s,n<q;++m,l=j){k=i.dT(l,1,n)
j=k.b
i.c5(k.a)
if(j.length<3)return}i.c5(l)},
dT(a,b,c){var s,r,q,p,o,n,m,l,k,j,i
t.x.a(a)
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
B.a.j(q,i)}}return new A.e(r,q)},
fo(a,b,c,d){var s,r,q,p,o,n,m,l,k=t.o
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
c5(a){var s,r,q,p,o,n
t.x.a(a)
s=a.length
if(s<3)return
r=this.c
q=B.b.a0(r.length,this.a)
for(p=0;p<a.length;a.length===s||(0,A.i)(a),++p)B.a.v(r,a[p])
for(s=this.d,o=1;n=o+1,n<a.length;o=n){B.a.j(s,q)
r=q+o
B.a.j(s,r)
B.a.j(s,r+1)}}}
A.nM.prototype={
$2(a,b){var s,r,q,p,o,n,m
if(a===b)return
s=Math.min(a,b)
r=Math.max(a,b)
for(q=this.a,p=B.c.U(s/q)+1,o=this.b,n=b-a;m=p*q,m<r;++p)B.a.j(o,(m-a)/n)},
$S:17}
A.hj.prototype={
D(a,b){var s
if(b==null)return!1
s=!1
if(b instanceof A.hj)if(b.a==this.a)if(b.b===this.b){s=t.N
s=A.y5(b.c,this.c,s,s)}return s},
gS(a){return A.jv(this.a,this.b,A.uK(this.c.ga7().aJ(0,new A.kO(),t.O)),2,null)}}
A.kO.prototype={
$1(a){t.gc.a(a)
return new A.e(a.a,a.b)},
$S:54}
A.em.prototype={}
A.iM.prototype={
q(a){return"HTTP "+this.a+" for "+this.b}}
A.fj.prototype={
aA(){var s,r,q
if(this.a)return
this.a=!0
for(s=this.b,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q)s[q].$0()
B.a.a1(s)}}
A.dR.prototype={
q(a){return"Cancelled"}}
A.fS.prototype={
aC(a,b,c,d){return this.eG(a,t.pp.a(b),c,d)},
eE(a,b,c){return this.aC(a,b,c,B.aC)},
eF(a,b,c){return this.aC(a,b,null,c)},
eD(a,b){return this.aC(a,b,null,B.aC)},
eG(a,b,a0,a1){var s=0,r=A.aj(t.mk),q,p=2,o=[],n=[],m,l,k,j,i,h,g,f,e,d,c
var $async$aC=A.ak(function(a2,a3){if(a2===1){o.push(a3)
s=p}for(;;)switch(s){case 0:f={}
e=a0==null
d=e?null:a0.a
if(d===!0)throw A.f(B.ag)
d=v.G
m=A.aD(new d.Headers())
b.Z(0,new A.jq(m))
l=A.aD(new d.AbortController())
f.a=!1
k=A.qT(a1,new A.jr(f,l))
if(!e){h=t.M.a(new A.js(l))
if(a0.a)h.$0()
else B.a.j(a0.b,h)}p=4
s=7
return A.I(A.oh(A.aD(d.fetch(a,{headers:m,signal:A.aD(l.signal)})),t.m),$async$aC)
case 7:j=a3
s=8
return A.I(A.oh(A.aD(j.arrayBuffer()),t.eb),$async$aC)
case 8:i=a3
d=A.v(j.status)
h=A.p2(i,0,null)
q=new A.em(d,h)
n=[1]
s=5
break
n.push(6)
s=5
break
case 4:p=3
c=o.pop()
if(f.a)throw A.f(new A.kA("No answer from "+a,a1))
f=e?null:a0.a
if(f===!0)throw A.f(B.ag)
throw c
n.push(6)
s=5
break
case 3:n=[2]
case 5:p=2
k.aA()
s=n.pop()
break
case 6:case 1:return A.ah(q,r)
case 2:return A.ag(o.at(-1),r)}})
return A.ai($async$aC,r)}}
A.jq.prototype={
$2(a,b){A.P(a)
A.P(b)
if(!B.eF.u(0,a.toLowerCase()))this.a.append(a,b)},
$S:57}
A.jr.prototype={
$0(){this.a.a=!0
this.b.abort()},
$S:0}
A.js.prototype={
$0(){return this.a.abort()},
$S:0}
A.ig.prototype={
iM(a,b){return A.aF(A.aC("A browser cannot read the file "+this.a))}}
A.ed.prototype={}
A.mh.prototype={
$1(a){return A.aD(a)===this.a},
$S:62}
A.oo.prototype={
$2(a,b){var s,r,q,p,o=a.length
if(!(b>=0&&b<o))return A.a(a,b)
s=a[b]
r=b+1
if(!(r<o))return A.a(a,r)
q=a[r]
r=b+2
if(!(r<o))return A.a(a,r)
p=a[r]
return this.a?s*256+q+p/256-32768:-1e4+(s*65536+q*256+p)*0.1},
$S:60}
A.op.prototype={
$1(a){return B.c.M(B.c.H(a/8+0.5019607843137255,0,1)*255)/255*8-4.015686274509804},
$S:3}
A.jV.prototype={
av(a,b,c,d){var s,r,q,p,o,n,m
t.o.a(a)
for(s=this.r,r=b*10+c,q=s.length,p=a.$flags|0,o=0;o<4;++o){n=a[o]
m=r+o
if(!(m<q))return A.a(s,m)
m=s[m]
p&2&&A.r(a)
if(!(o<4))return A.a(a,o)
a[o]=n+m*d}},
eK(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h=this
t.o.a(c)
B.v.ak(c,0,4,0)
switch(h.a){case 1:s=h.b
r=a*s*2
q=b*s*2
p=B.c.H(Math.acos(B.c.H(h.dq(0,r,q),-1,1)),0,1.5707963267948966)
o=Math.atan(Math.sqrt(r*r+q*q))*4/3.141592653589793/3.141592653589793
h.av(c,0,2,p*o)
h.av(c,0,6,(1.5707963267948966-p)*o)
break
case 2:s=h.b
r=a*s*2
q=b*s*2
n=A.qO(r,q)
s=h.r
if(0>=s.length)return A.a(s,0)
s=s[0]
m=Math.atan(Math.sqrt(r*r+q*q))*2/3.141592653589793
s=(n+(s+3.141592653589793))/3.141592653589793+0.5
l=1-Math.abs(s-2*Math.floor(s/2)-1)
h.av(c,0,2,m*l)
h.av(c,0,6,m*(1-l))
break
case 3:s=h.b
r=a*s*2
q=b*s*2
for(s=h.r.length/10|0,k=0;k<s;++k){j=B.c.H(h.dr(k,r,q,!0),0,1)
i=2*j
if(j>0.5)h.av(c,k,6,(i-1)/s)
else h.av(c,k,2,(1-i)/s)}break
case 4:s=h.b
j=B.c.H(h.dq(0,a*s*2,b*s*2),0,1)
s=2*j
if(j>0.5)h.av(c,0,6,s-1)
else h.av(c,0,2,1-s)
break
default:h.hC(a,b,c)}},
dr(a,b,c,d){var s,r,q,p,o,n,m=this.r,l=a*10,k=m.length
if(!(l<k))return A.a(m,l)
s=m[l]
r=s+(d?0:3.141592653589793);++l
if(!(l<k))return A.a(m,l)
q=m[l]
p=d?-Math.cos(r):Math.cos(r)
o=d?-Math.sin(r):Math.sin(r)
n=Math.cos(q)
return(Math.sin(q)-(c*p*n-b*o*n))/Math.sqrt(1+b*b+c*c)},
dq(a,b,c){return this.dr(a,b,c,!1)},
hC(a,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
t.o.a(a1)
s=this.r
r=s.length
if(0>=r)return A.a(s,0)
q=s[0]
p=Math.atan(0.625*Math.sqrt(a*a+a0*a0))
o=A.qO(a,a0)
n=this.b
m=1.875-n*1.75
l=n!==0.5?(Math.pow(m,p)-1)/(Math.pow(m,1.5707963267948966)-1)*1.5707963267948966:p
k=B.c.H(n*2,0,1)
j=(1-Math.cos(l))*k
q=(o+(q+3.141592653589793))/3.141592653589793+0.5
i=Math.abs(q-2*Math.floor(q/2)-1)
h=Math.sin(l)*k
if(5>=r)return A.a(s,5)
q=s[5]
if(9>=r)return A.a(s,9)
for(n=this.f,g=n.length,q=1-(q+(s[9]-q)*i)*h,f=a1.$flags|0,e=0;e<4;++e){d=s[2+e]
c=6+e
if(!(c<r))return A.a(s,c)
c=s[c]
if(!(e<g))return A.a(n,e)
b=n[e]
f&2&&A.r(a1)
if(!(e<4))return A.a(a1,e)
a1[e]=b*j*q+(d+(c-d)*i)*h}}}
A.af.prototype={
gbx(){var s,r,q=new A.jO(),p=new A.jN(),o=this.a,n=q.$1(o),m=this.b,l=q.$1(m),k=this.c,j=q.$1(k),i=p.$1(0.2225045*n+0.7168786*l+0.0606169*j)
q=o===m
s=q&&m===k?i:p.$1((0.4360747*n+0.3850649*l+0.1430804*j)/0.96422)
r=q&&m===k?i:p.$1((0.0139322*n+0.0971045*l+0.7141733*j)/0.82521)
return new A.M(Math.max(0,116*i-16),500*(s-i),200*(i-r))}}
A.jO.prototype={
$1(a){return a<=0.04045?a/12.92:Math.pow((a+0.055)/1.055,2.4)},
$S:3}
A.jN.prototype={
$1(a){return a>0.008856451679035631?Math.pow(a,0.3333333333333333):a/0.12841854934601665+0.13793103448275862},
$S:3}
A.jL.prototype={
$1(a){return a>0.20689655172413793?a*a*a:0.12841854934601665*(a-0.13793103448275862)},
$S:3}
A.jM.prototype={
$1(a){return B.c.H(a<=0.0031308?12.92*a:1.055*Math.pow(a,0.4166666666666667)-0.055,0,1)},
$S:3}
A.jT.prototype={
$0(){return A.uY(this.a)},
$S:67}
A.jP.prototype={
$1(a){A.P(a)
return a+a},
$S:69}
A.jQ.prototype={
$1(a){return A.P(a).length!==0},
$S:19}
A.jR.prototype={
$2(a,b){var s,r=this.a
if(!(a<r.length))return A.a(r,a)
s=r[a]
if(B.d.cC(s,"%")){r=A.L(B.d.a2(s,0,s.length-1))
r=(r==null?0:r)/100}else{r=A.L(s)
r=(r==null?0:r)/b}return r},
$S:71}
A.jS.prototype={
$1(a){var s,r=this
if(a<0)++a
if(a>1)--a
if(a<0.16666666666666666){s=r.a
return s+(r.b-s)*6*a}if(a<0.5)return r.b
if(a<0.6666666666666666){s=r.a
return s+(r.b-s)*(0.6666666666666666-a)*6}return r.a},
$S:3}
A.z.prototype={
sa8(a){this.b=t.U.a(a)},
scX(a){this.e=t.U.a(a)},
siy(a){this.w=t.n4.a(a)}}
A.mr.prototype={
$1(a){t.t.a(a)
return a.w==null?a.b.h(0,this.a):this.b.$1(a)},
$S:1}
A.nL.prototype={
$1(a){t.t.a(a)
return this.a},
$S:1}
A.nJ.prototype={
$1(a){var s,r,q=this.a.$1(a)
if(typeof q=="string"&&B.d.u(q,"{")){s=this.b
r=s.h(0,q)
if(r==null){r=A.rG(q)
s.m(0,q,r)
s=r}else s=r
return s.$1(a)}return q instanceof A.bn?q:A.hV(A.az(q))},
$S:1}
A.nK.prototype={
$1(a){var s=this.a.$1(a)
return s instanceof A.bn?s:A.hV(A.az(s))},
$S:73}
A.ml.prototype={
$1(a){var s,r,q,p,o,n
t.t.a(a)
for(s=this.a,r=s.length,q=t.j,p=0,o="";p<s.length;s.length===r||(0,A.i)(s),++p){n=s[p]
o+=typeof n=="string"?n:A.az(a.b.h(0,B.a.gt(q.a(n))))}return A.hV(o.charCodeAt(0)==0?o:o)},
$S:5}
A.my.prototype={
$1(a){var s,r,q,p
A:{s=t.j.b(a)
r=null
q=!1
if(s){p=J.n(a)
if(p.gk(a)>=1)if("coalesce"===p.h(a,0)){r=p.W(a,1)
q=J.n(r)
q=q.gJ(r)&&q.a4(r,new A.mz())}}if(q){s=["$images"]
B.a.v(s,r)
break A}if(s){s=[]
for(q=J.B(a);q.l();)s.push(this.$1(q.gn()))
break A}s=a
break A}return s},
$S:91}
A.mz.prototype={
$1(a){var s
if(t.j.b(a)){s=J.n(a)
s=s.gJ(a)&&J.l(s.gt(a),"image")}else s=!1
return s},
$S:11}
A.mA.prototype={
$1(a){var s,r=this.a.$1(a)
A:{if(r instanceof A.bn){s=r.q(0)
break A}s=r
break A}return s},
$S:1}
A.mw.prototype={
$1(a){return!0},
$S:2}
A.mx.prototype={
$1(a){return J.l(this.a.$1(a),!0)},
$S:2}
A.m6.prototype={
$2(a,b){return J.l(b,"$type")?a.c:a.b.h(0,b)},
$S:121}
A.lY.prototype={
$1(a){var s,r,q
t.t.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q)if(!J.l(s[q].$1(a),!0))return!1
return!0},
$S:2}
A.lZ.prototype={
$1(a){var s,r,q
t.t.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q)if(J.l(s[q].$1(a),!0))return!0
return!1},
$S:2}
A.m_.prototype={
$1(a){var s,r,q
t.t.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q)if(J.l(s[q].$1(a),!0))return!1
return!0},
$S:2}
A.m0.prototype={
$1(a){return!t.t.a(a).b.K(this.a)},
$S:2}
A.m1.prototype={
$1(a){return!this.a.u(0,this.b.$2(t.t.a(a),this.c))},
$S:2}
A.m2.prototype={
$1(a){return this.a.u(0,this.b.$2(t.t.a(a),this.c))},
$S:2}
A.m3.prototype={
$1(a){return J.l(this.a.$2(t.t.a(a),this.b),this.c)},
$S:2}
A.m4.prototype={
$1(a){return!J.l(this.a.$2(t.t.a(a),this.b),this.c)},
$S:2}
A.m5.prototype={
$1(a){var s=this
t.t.a(a)
return A.px(A.P(s.a),s.b.$2(a,s.c),s.d)},
$S:2}
A.o5.prototype={
$1(a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=this,a3=null
t.t.a(a4)
s=A.C(a2.a.$1(a4))
r=s!=null
if(r&&isNaN(s))return a3
if(!r||s<=B.a.gt(a2.b))return B.a.ih(a2.c,a4)
r=a2.b
if(s>=B.a.gE(r))return B.a.iw(a2.c,a4)
q=r.length
p=1
for(;;){if(!(p<q))return A.a(r,p)
o=r[p]
if(!(o<s))break;++p}q=p-1
r=r[q]
n=o-r
m=s-r
if(n===0)l=0
else{r=a2.d
if(r!=null){r=A.vV(r,m/n)
l=r}else{r=a2.e
r=r===1?m/n:(Math.pow(r,m)-1)/(Math.pow(r,n)-1)
l=r}}r=a2.c
if(!(q<r.length))return A.a(r,q)
k=r[q].$1(a4)
if(!(p<r.length))return A.a(r,p)
j=r[p].$1(a4)
if(typeof k=="number"&&typeof j=="number"){if(a2.f&&k>0&&j>0)return k*Math.pow(j/k,l)
return k+(j-k)*l}r=t.j
if(r.b(k)&&r.b(j)&&J.S(k)===J.S(j)){r=A.b([],t.n)
for(q=J.n(k),o=J.n(j),i=0;i<q.gk(k);++i){h=q.h(k,i)
if(!(typeof h=="number"))if(typeof h=="string")h=A.L(h)
else if(A.E(h))h=h?1:0
else h=a3
if(h==null)h=0
g=o.h(j,i)
if(!(typeof g=="number"))if(typeof g=="string")g=A.L(g)
else if(A.E(g))g=g?1:0
else g=a3
if(g==null)g=0
f=q.h(k,i)
if(!(typeof f=="number"))if(typeof f=="string")f=A.L(f)
else if(A.E(f))f=f?1:0
else f=a3
r.push(h+(g-(f==null?0:f))*l)}return r}e=A.aS(k)
d=A.aS(j)
if(e!=null&&d!=null){switch(a2.r){case"hcl":k=e.gbx()
j=d.gbx()
r=k.c
q=k.b
c=Math.atan2(r,q)
o=j.c
h=j.b
b=Math.atan2(o,h)
a=Math.sqrt(q*q+r*r)
a0=Math.sqrt(h*h+o*o)
a1=b-c
if(a1>3.141592653589793)a1-=6.283185307179586
c+=(a1<-3.141592653589793?a1+6.283185307179586:a1)*l
a4=a+(a0-a)*l
r=k.a
q=Math.cos(c)
o=Math.sin(c)
h=e.d
h=A.qK(r+(j.a-r)*l,q*a4,o*a4,h+(d.d-h)*l)
r=h
break
case"lab":k=e.gbx()
j=d.gbx()
r=k.a
q=k.b
o=k.c
h=e.d
h=A.qK(r+(j.a-r)*l,q+(j.b-q)*l,o+(j.c-o)*l,h+(d.d-h)*l)
r=h
break
default:r=A.qM(e,d,l)
break}return r}return k},
$S:1}
A.lM.prototype={
$3(a,b,c){var s=1-a,r=3*s
return r*s*a*b+r*a*a*c+a*a*a},
$S:35}
A.m9.prototype={
$1(a){return a.b.h(0,this.a)},
$S:1}
A.ma.prototype={
$1(a){return a.a},
$S:14}
A.mb.prototype={
$1(a){var s=this.a.$1(t.t.a(a))
return s==null?this.b:s},
$S:1}
A.mc.prototype={
$1(a){var s
if(t.j.b(a)){s=J.n(a)
s=s.gJ(a)&&t.f.b(s.gt(a))}else s=!1
return s},
$S:9}
A.md.prototype={
$1(a){var s=this.a.h(0,this.b.$1(t.t.a(a)))
return s==null?this.c:s},
$S:1}
A.me.prototype={
$1(a){var s
if(typeof a!="number"){if(t.j.b(a)){s=J.n(a)
s=s.gJ(a)&&s.a4(a,new A.m8())}else s=!1
s=s||A.aS(a)!=null}else s=!0
return s},
$S:11}
A.m8.prototype={
$1(a){return typeof a=="number"},
$S:9}
A.mf.prototype={
$1(a){var s,r,q,p,o,n,m=this,l=m.a.$1(t.t.a(a))
if(typeof l!="number")return m.b
s=m.c
r=B.a.gt(s)
q=s.length
p=m.d
o=p.length
n=0
for(;;){if(!(n<o&&p[n]<=l))break
if(!(n<q))return A.a(s,n)
r=s[n];++n}return r},
$S:1}
A.mg.prototype={
$1(a){t.t.a(a)
return typeof a.b.h(0,this.a)=="number"?this.b.$1(a):this.c},
$S:1}
A.lS.prototype={
$1(a){var s,r,q,p,o
t.t.a(a)
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
A.lT.prototype={
$1(a){return a.a},
$S:14}
A.cS.prototype={
i_(a,b){var s,r,q,p,o,n=a.toLowerCase(),m=b.toLowerCase(),l=B.d.a6(A.rI(n),A.rI(m))
if(l===0&&this.b)l=B.d.a6(n,m)
if(l===0&&this.a){s=t.J.i("j.E")
r=A.W(new A.aq(a),s)
q=A.W(new A.aq(b),s)
p=0
for(;;){if(!(l===0&&p<r.length&&p<q.length))break
if(!(p<r.length))return A.a(r,p)
o=A.O(r[p])
s=o===o.toLowerCase()?0:1
if(!(p<q.length))return A.a(q,p)
o=A.O(q[p])
l=B.b.a6(s,o===o.toLowerCase()?0:1);++p}}if(l>0)s=1
else s=l<0?-1:l
return s}}
A.mp.prototype={
$1(a){var s
A.v(a)
s=$.tt().h(0,a)
return s==null?a:s},
$S:20}
A.mE.prototype={
$1(a){var s=this.a
return a<s.length?A.t(s[a]):A.ar(null)},
$S:49}
A.mD.prototype={
$0(){var s,r,q,p=A.b([],t.V)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q)p.push(A.t(s[q]))
return p},
$S:53}
A.nH.prototype={
$1(a){t.f3.a(a)
return new A.nI(this.a.$1(0),a)},
$S:58}
A.nI.prototype={
$1(a){var s=A.C(this.a.$1(t.t.a(a)))
return s==null?null:this.b.$1(s)},
$S:13}
A.mF.prototype={
$1(a){var s,r
t.t.a(a)
s=this.a.$1(a)
A:{if(t.f.b(s)){r=s.h(0,this.b.$1(a))
break A}r=null
break A}return r},
$S:1}
A.mG.prototype={
$1(a){return t.t.a(a).b.h(0,this.a)},
$S:1}
A.mH.prototype={
$1(a){t.t.a(a)
return a.b.h(0,this.a.$1(a))},
$S:1}
A.mS.prototype={
$1(a){var s,r
t.t.a(a)
s=this.a.$1(a)
A:{if(t.f.b(s)){r=s.K(this.b.$1(a))
break A}r=!1
break A}return r},
$S:2}
A.n2.prototype={
$1(a){return t.t.a(a).b.K(this.a)},
$S:2}
A.nd.prototype={
$1(a){return!t.t.a(a).b.K(this.a)},
$S:2}
A.no.prototype={
$1(a){return t.t.a(a).b},
$S:84}
A.nz.prototype={
$1(a){return t.t.a(a).b.h(0,"$id")},
$S:1}
A.nD.prototype={
$1(a){return t.t.a(a).f},
$S:1}
A.nE.prototype={
$1(a){return t.t.a(a).e.h(0,this.a)},
$S:1}
A.nF.prototype={
$1(a){t.t.a(a)
return a.e.h(0,this.a.$1(a))},
$S:1}
A.mI.prototype={
$1(a){var s,r,q=this
t.t.a(a)
s=q.a
r=s<=0?1:B.c.H((0-q.b-q.c)/s,0,1)
if(r>=1)return q.d.$1(a)
return A.rj(q.e.$1(a),q.d.$1(a),A.w4(r))},
$S:1}
A.mJ.prototype={
$1(a){var s,r,q,p
t.t.a(a)
s=A.b([],t.s)
for(r=this.a,q=r.length,p=0;p<r.length;r.length===q||(0,A.i)(r),++p)s.push(A.az(r[p].$1(a)))
return new A.aV(s,t.dA.a(new A.mC()),t.no).ab(0,"\x1f")},
$S:5}
A.mC.prototype={
$1(a){return A.P(a).length!==0},
$S:19}
A.mK.prototype={
$1(a){var s,r,q,p
t.t.a(a)
s=[]
for(r=this.a,q=r.length,p=0;p<r.length;r.length===q||(0,A.i)(r),++p)s.push(r[p].$1(a))
return s},
$S:97}
A.mL.prototype={
$1(a){t.t.a(a)
return 0},
$S:14}
A.mM.prototype={
$1(a){var s,r,q,p,o=this.a.$1(t.t.a(a))
A:{s=o instanceof A.cS
r=null
if(s){r=o.c
q=r
q=typeof q=="string"}else q=!1
if(q){p=s?r:o.c
if(p==null)p=A.P(p)
q=p
break A}q="en"
break A}return q},
$S:5}
A.mN.prototype={
$1(a){var s=a.w,r=s==null?null:s.$0()
if(r!=null){s=a.c
s=s!=="Polygon"&&this.a.im(r,s==="LineString")}else s=!1
return s},
$S:2}
A.mO.prototype={
$1(a){var s=a.w,r=s==null?null:s.$0()
return r==null?null:this.a.i4(r,a.c)},
$S:13}
A.mP.prototype={
$1(a){return A.pI(this.a.$1(t.t.a(a)))},
$S:5}
A.mQ.prototype={
$1(a){var s=A.rl(this.a.$1(t.t.a(a)))
return s==null?null:A.b([s.a*255,s.b*255,s.c*255,s.d],t.n)},
$S:122}
A.mR.prototype={
$1(a){var s,r,q,p,o,n,m,l,k
t.t.a(a)
s=this.a.$1(a)
r=typeof s=="string"
if(r)q=A.W(new A.aq(s),t.J.i("j.E"))
else q=s
if(!t.j.b(q))return null
p=J.n(q)
o=p.gk(q)
n=new A.nG(o)
m=n.$2(this.b.$1(a),0)
l=this.c
k=p.F(q,m,Math.max(m,A.xj(n.$2(l==null?null:l.$1(a),o))))
return r?A.bq(J.bx(k,t.S),0,null):k},
$S:1}
A.nG.prototype={
$2(a,b){var s=A.C(a),r=s==null?null:B.c.N(s)
if(r==null)r=b
if(r<0)r+=this.a
return B.b.H(r,0,this.a)},
$S:45}
A.mT.prototype={
$1(a){var s,r,q,p,o,n,m,l,k,j=null
t.t.a(a)
s=this.a.$1(a)
r=this.b.$1(a)
q=this.c
p=q==null
o=A.C(p?j:q.$1(a))
o=o==null?j:B.c.N(o)
if(o==null)o=0
n=Math.max(0,o)
if(typeof s=="string"){m=A.W(new A.aq(s),t.J.i("j.E"))
q=A.bq(A.aU(m,0,A.bv(n,"count",t.S),A.D(m).c),0,j)
if(A.E(r))p=A.u(r)
else p=r==null?"null":A.az(r)
l=B.d.aU(s,p,q.length)
return l<0?-1:new A.aq(B.d.a2(s,0,l)).gk(0)}if(t.j.b(s)){q=A.C(p?j:q.$1(a))
k=q==null?j:B.c.N(q)
if(k==null)k=0
if(k<0)k=Math.max(0,k+J.S(s))
q=J.n(s)
return k>=q.gk(s)?-1:q.aU(s,r,k)}return-1},
$S:37}
A.mU.prototype={
$1(a){return t.t.a(a).a},
$S:14}
A.mV.prototype={
$1(a){return t.t.a(a).c},
$S:5}
A.mW.prototype={
$1(a){return!A.t8(this.a.$1(t.t.a(a)))},
$S:2}
A.mX.prototype={
$1(a){var s,r,q,p,o,n=this
t.t.a(a)
s=n.a.$1(a)
r=n.b.$1(a)
q=n.c.$1(a)
if(typeof s=="string"&&typeof r=="string"&&q instanceof A.cS){p=q.i_(s,r)
switch(n.d){case"==":o=p===0
break
case"!=":o=p!==0
break
case"<":o=p<0
break
case"<=":o=p<=0
break
case">":o=p>0
break
default:o=p>=0
break}return o}o=n.d
switch(o){case"==":o=J.l(s,r)
break
case"!=":o=!J.l(s,r)
break
default:o=A.px(o,s,r)
break}return o},
$S:2}
A.mY.prototype={
$1(a){var s,r,q,p
t.t.a(a)
s=J.l(this.a.$1(a),!0)
r=J.l(this.b.$1(a),!0)
q=this.c.$1(a)
A:{if(typeof q=="string"){p=q
break A}p=null
break A}return new A.cS(s,r,p)},
$S:47}
A.mZ.prototype={
$1(a){t.t.a(a)
return J.l(this.a.$1(a),this.b.$1(a))},
$S:2}
A.n_.prototype={
$1(a){t.t.a(a)
return!J.l(this.a.$1(a),this.b.$1(a))},
$S:2}
A.n0.prototype={
$1(a){t.t.a(a)
return A.px(this.a,this.b.$1(a),this.c.$1(a))},
$S:2}
A.n1.prototype={
$1(a){var s,r,q,p,o,n
t.t.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].$1(a)
o=!1
if(p!=null){n=J.as(p)
if(!n.D(p,!1))if(!n.D(p,0))if(!n.D(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(!p)return!1}return!0},
$S:2}
A.n3.prototype={
$1(a){var s,r,q,p,o,n
t.t.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].$1(a)
o=!1
if(p!=null){n=J.as(p)
if(!n.D(p,!1))if(!n.D(p,0))if(!n.D(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(p)return!0}return!1},
$S:2}
A.n4.prototype={
$1(a){var s,r,q,p,o,n
t.t.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].$1(a)
o=!1
if(p!=null){n=J.as(p)
if(!n.D(p,!1))if(!n.D(p,0))if(!n.D(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(p)return!1}return!0},
$S:2}
A.n5.prototype={
$1(a){var s,r,q,p,o,n
t.t.a(a)
for(s=this.a,r=0;q=r+1,p=s.length,q<p;r+=2){if(!(r<p))return A.a(s,r)
p=s[r].$1(a)
o=!1
if(p!=null){n=J.as(p)
if(!n.D(p,!1))if(!n.D(p,0))if(!n.D(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(p){if(!(q<s.length))return A.a(s,q)
return s[q].$1(a)}}return r<p?s[r].$1(a):null},
$S:1}
A.n6.prototype={
$1(a){var s
t.t.a(a)
s=this.a.h(0,this.b.$1(a))
return(s==null?this.c:s).$1(a)},
$S:1}
A.n7.prototype={
$1(a){var s,r,q,p
t.t.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].$1(a)
if(p!=null)return p}return null},
$S:1}
A.n8.prototype={
$1(a){var s,r,q,p,o,n,m,l=this
t.t.a(a)
s=A.C(l.a.$1(a))
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
A.n9.prototype={
$1(a){var s,r,q=this.a.$1(t.t.a(a))
A:{if(q instanceof A.af){s="rgba("+B.c.M(q.a*255)+","+B.c.M(q.b*255)+","+B.c.M(q.c*255)+","+A.az(q.d)+")"
break A}if(t.j.b(q)){s=B.t.aB(q,null)
break A}if(t.f.b(q)){s=B.t.aB(q,null)
break A}s=A.E(q)
if(s)r=A.u(q)
else r=q==null?"null":A.az(q)
if(r==="null")s=""
else if(s)s=A.u(q)
else s=q==null?"null":A.az(q)
break A}return s},
$S:5}
A.na.prototype={
$1(a){var s,r,q
t.t.a(a)
s=A.C(this.a.$1(a))
if(s==null)return""
r=A.C(this.b.$1(a))
q=r==null?null:B.c.N(r)
if(q==null)q=0
r=A.C(this.c.$1(a))
r=r==null?null:B.c.N(r)
if(r==null)r=3
return A.wc(s,q,Math.max(q,r))},
$S:5}
A.nb.prototype={
$1(a){t.t.a(a)
return A.b(A.az(this.a.$1(a)).split(A.az(this.b.$1(a))),t.s)},
$S:48}
A.nc.prototype={
$1(a){var s,r
t.t.a(a)
s=this.a.$1(a)
A:{if(t.j.b(s)){r=J.hZ(s,A.xB(),t.N).ab(0,A.az(this.b.$1(a)))
break A}r=""
break A}return r},
$S:5}
A.ne.prototype={
$1(a){var s,r,q,p,o
t.t.a(a)
s=A.b([],t.n)
for(r=this.a,q=r.length,p=0;p<r.length;r.length===q||(0,A.i)(r),++p){o=r[p].$1(a)
if(!(typeof o=="number"))if(typeof o=="string")o=A.L(o)
else if(A.E(o))o=o?1:0
else o=null
s.push(o==null?0:o)}if(s.length<3)return null
r=B.c.P(s[0],360)
q=B.c.H(s[1]/100,0,1)
if(2>=s.length)return A.a(s,2)
o=B.c.H(s[2]/100,0,1)
s=s.length>3?s[3]:1
return A.qL(r/360,q,o,s)},
$S:21}
A.nf.prototype={
$1(a){var s,r,q,p,o,n
t.t.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].$1(a)
if(p!=null)o=typeof p=="string"&&B.d.bi(p).length===0
else o=!0
if(o)return 0
if(typeof p=="number")n=p
else if(typeof p=="string"){o=A.L(p)
n=o}else{if(A.E(p))o=p?1:0
else o=null
n=o}if(n!=null&&!isNaN(n))return n}return null},
$S:13}
A.ng.prototype={
$1(a){var s,r,q,p,o,n,m
t.t.a(a)
for(s=this.a,r=s.length,q=t.f,p=this.b,o=0;o<s.length;s.length===r||(0,A.i)(s),++o){n=s[o].$1(a)
switch(p){case"number":m=typeof n=="number"
break
case"string":m=typeof n=="string"
break
case"boolean":m=A.E(n)
break
default:m=q.b(n)
break}if(m)return n}return null},
$S:1}
A.nh.prototype={
$1(a){return A.t8(this.a.$1(t.t.a(a)))},
$S:2}
A.ni.prototype={
$1(a){var s,r,q,p
t.t.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=A.rl(s[q].$1(a))
if(p!=null)return p}return null},
$S:21}
A.nj.prototype={
$1(a){var s,r=this.a.$1(t.t.a(a))
if(!t.j.b(r))return null
s=this.b
if(s!=null&&J.S(r)!==s)return null
s=this.c
if(s!=null&&s!=="value"&&!J.pP(r,new A.mB(s)))return null
return r},
$S:50}
A.mB.prototype={
$1(a){return A.pI(a)===this.a},
$S:9}
A.nk.prototype={
$1(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=null
t.t.a(a)
s=A.b([],t.eJ)
for(r=this.a,q=r.length,p=t.j,o=t.s,n=0;n<r.length;r.length===q||(0,A.i)(r),++n){m=r[n]
l=m.a
k=m.b
j=m.c
m=j?"":A.az(l.$1(a))
i=j?A.az(l.$1(a)):c
h=k.h(0,"font-scale")
h=h==null?c:h.$1(a)
if(!(typeof h=="number"))if(typeof h=="string")h=A.L(h)
else if(A.E(h))h=h?1:0
else h=c
if(h==null)h=1
g=k.h(0,"text-font")
f=g==null?c:g.$1(a)
A:{if(p.b(f)){g=A.b([],o)
for(e=J.B(f);e.l();)g.push(A.u(e.gn()))
break A}g=c
break A}e=k.h(0,"text-color")
e=A.aS(e==null?c:e.$1(a))
d=k.h(0,"vertical-align")
s.push(new A.bD(i,m,h,g,e,A.dF(d==null?c:d.$1(a))))}return new A.bn(s)},
$S:51}
A.nl.prototype={
$1(a){var s,r,q,p
t.t.a(a)
for(s=this.a,r=s.length,q=0,p="";q<s.length;s.length===r||(0,A.i)(s),++q)p+=A.az(s[q].$1(a))
return p.charCodeAt(0)==0?p:p},
$S:5}
A.nm.prototype={
$1(a){return A.az(this.a.$1(t.t.a(a))).toUpperCase()},
$S:5}
A.nn.prototype={
$1(a){return A.az(this.a.$1(t.t.a(a))).toLowerCase()},
$S:5}
A.np.prototype={
$1(a){var s,r,q,p,o,n,m
t.t.a(a)
s=this.a
A:{r=this.b
q=r.length
if(q!==0){p=null
break A}if("+"===s){p=0
break A}if("*"===s){p=1
break A}if("min"===s){p=1/0
break A}p=-1/0
break A}for(o=p,n=0;n<r.length;r.length===q||(0,A.i)(r),++n){m=r[n].$1(a)
if(!(typeof m=="number"))if(typeof m=="string"){p=A.L(m)
m=p}else{if(A.E(m))p=m?1:0
else p=null
m=p}if(m==null)return null
if(o==null)o=m
else{switch(s){case"+":p=o+m
break
case"*":p=o*m
break
case"min":p=Math.min(o,m)
break
default:p=Math.max(o,m)
break}o=p}}return o},
$S:13}
A.nq.prototype={
$1(a){return-a},
$S:3}
A.nr.prototype={
$1(a){var s,r,q
t.t.a(a)
s=A.C(this.a.$1(a))
r=A.C(this.b.$1(a))
if(s==null||r==null)return null
switch(this.c){case"-":q=s-r
break
case"/":q=s/r
break
case"%":q=B.c.P(s,r)
break
default:q=Math.pow(s,r)
break}return q},
$S:13}
A.ns.prototype={
$1(a){return B.c.L(a)},
$S:3}
A.nt.prototype={
$1(a){return Math.floor(a)},
$S:3}
A.nu.prototype={
$1(a){return Math.ceil(a)},
$S:3}
A.nv.prototype={
$1(a){return Math.abs(a)},
$S:3}
A.nw.prototype={
$1(a){return Math.log(a)/2.302585092994046},
$S:3}
A.nx.prototype={
$1(a){return Math.log(a)/0.6931471805599453},
$S:3}
A.ny.prototype={
$1(a){var s,r=this.a.$1(t.t.a(a))
if(typeof r=="string")s=new A.aq(r).gk(0)
else s=t.j.b(r)?J.S(r):null
return s},
$S:52}
A.nA.prototype={
$1(a){var s,r,q
t.t.a(a)
s=this.a.$1(a)
r=this.b.$1(a)
if(t.j.b(s))return J.pO(s,r)
if(typeof s=="string"){if(r!=null){if(A.E(r))q=A.u(r)
else q=A.az(r)
q=B.d.u(s,q)&&s.length!==0}else q=!1
return q}return!1},
$S:2}
A.nB.prototype={
$1(a){var s,r,q
t.t.a(a)
s=this.a.$1(a)
r=A.C(this.b.$1(a))
q=r==null?null:B.c.N(r)
return t.j.b(s)&&q!=null&&q>=0&&q<J.S(s)?J.R(s,q):null},
$S:39}
A.nC.prototype={
$1(a){var s,r,q,p,o,n
t.t.a(a)
s=A.b([],t.n)
for(r=this.a,q=r.length,p=0;p<r.length;r.length===q||(0,A.i)(r),++p){o=r[p].$1(a)
if(!(typeof o=="number"))if(typeof o=="string")o=A.L(o)
else if(A.E(o))o=o?1:0
else o=null
s.push(o==null?0:o)}r=s.length
if(r<3)return null
q=s[0]
o=s[1]
n=s[2]
s=r>3?s[3]:1
return new A.af(q/255,o/255,n/255,s)},
$S:21}
A.lQ.prototype={
$1(a){return typeof a=="number"},
$S:9}
A.lR.prototype={
$1(a){A.ct(a)
return a<0||a>255},
$S:22}
A.bD.prototype={}
A.bn.prototype={
q(a){var s=this.a,r=A.D(s)
return new A.aQ(s,r.i("o(1)").a(new A.im()),r.i("aQ<1,o>")).bL(0)}}
A.im.prototype={
$1(a){return t.oc.a(a).b},
$S:55}
A.o9.prototype={
$1(a){t.oc.a(a)
return a.c===1&&a.d==null&&a.e==null&&a.f==null&&a.a==null},
$S:56}
A.oL.prototype={
$1(a){return A.P(a).length===0},
$S:19}
A.fV.prototype={
cg(a){var s,r,q,p,o,n,m,l,k,j=this
if(!t.f.b(a))return
s=a.h(0,"coordinates")
switch(a.h(0,"type")){case"FeatureCollection":r=a.h(0,"features")
if(t.j.b(r))J.oO(r,j.gdE())
break
case"Feature":j.cg(a.h(0,"geometry"))
break
case"GeometryCollection":q=a.h(0,"geometries")
if(t.j.b(q))J.oO(q,j.gdE())
break
case"Point":B.a.v(j.a,A.jy([s]))
break
case"MultiPoint":B.a.v(j.a,A.jy(s))
break
case"LineString":B.a.j(j.b,A.jy(s))
break
case"MultiLineString":if(t.j.b(s))B.a.v(j.b,J.hZ(s,A.pF(),t.o))
break
case"Polygon":if(t.j.b(s)){p=J.hZ(s,A.pF(),t.o)
p=A.W(p,p.$ti.i("V.E"))
B.a.j(j.c,p)}break
case"MultiPolygon":p=t.j
if(p.b(s))for(o=J.B(s),n=j.c,m=t.o;o.l();){l=o.gn()
if(p.b(l)){k=J.hZ(l,A.pF(),m)
k=A.W(k,k.$ti.i("V.E"))
B.a.j(n,k)}}break}},
im(a,b){var s,r,q,p,o,n,m,l=this
t.x.a(a)
s=J.Q(a)
if(s.a4(a,new A.jB())||l.c.length===0)return!1
for(r=s.gp(a);r.l();){q=r.gn()
for(p=J.n(q),o=0;o<p.gk(q);o+=2){n=p.h(q,o)
m=p.h(q,o+1)
if(!(l.co(n,m)||l.co(n+360,m)||l.co(n-360,m)))return!1}}if(!b)return!0
for(s=s.gp(a);s.l();)if(!l.fa(s.gn()))return!1
return!0},
fa(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
t.o.a(a)
for(s=J.n(a),r=this.c,q=0;p=q+3,p<s.gk(a);q=m)for(o=r.length,n=q+1,m=q+2,l=0;l<r.length;r.length===o||(0,A.i)(r),++l)for(k=B.a.gp(r[l]);k.l();){j=k.gn()
for(i=J.n(j),h=0;g=h+3,g<i.gk(j);h=f){f=h+2
if(A.uM(s.h(a,q),s.h(a,n),s.h(a,m),s.h(a,p),i.h(j,h),i.h(j,h+1),i.h(j,f),i.h(j,g)))return!1}}return!0},
co(a,b){var s,r,q,p,o,n,m,l,k
for(s=this.c,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q)for(p=B.a.gp(s[q]);p.l();){o=p.gn()
for(n=J.n(o),m=0;l=m+3,l<n.gk(o);m=k){k=m+2
if(A.fW(a,b,n.h(o,m),n.h(o,m+1),n.h(o,k),n.h(o,l))===0)return!1}}return this.dj(a,b)},
dj(a,b){var s,r,q,p,o
for(s=this.c,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){for(p=B.a.gp(s[q]),o=!1;p.l();)if(A.qA(a,b,p.gn()))o=!o
if(o)return!0}return!1},
i4(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=this
t.x.a(a1)
s=t.n
r=A.b([],s)
for(q=J.Q(a1),p=q.gp(a1);p.l();)B.a.v(r,p.gn())
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
p.push(A.b([h,j[e]],s))}B.a.v(p,a0.b)
for(s=a0.c,j=s.length,d=0;d<s.length;s.length===j||(0,A.i)(s),++d)B.a.v(p,s[d])
for(k=0;s=r.length,k<s;k+=2){j=r[k]
i=k+1
if(!(i<s))return A.a(r,i)
if(a0.dj(j,r[i]))return 0}if(a2==="Polygon")for(s=p.length,d=0;d<p.length;p.length===s||(0,A.i)(p),++d){c=p[d]
for(r=J.n(c),k=0;k+1<r.gk(c);k+=2)if((q.cP(a1,new A.jA(c,k)).gk(0)&1)===1)return 0}for(s=J.B(g),b=1/0;s.l();){r=s.gn()
for(q=p.length,d=0;d<p.length;p.length===q||(0,A.i)(p),++d){a=A.uL(r,p[d],l)
if(a<b)b=a}}return b*m}}
A.jB.prototype={
$1(a){return J.d2(t.o.a(a))},
$S:23}
A.jx.prototype={
$6(a,b,c,d,e,f){return(c-a)*(f-b)-(d-b)*(e-a)},
$S:29}
A.jA.prototype={
$1(a){var s,r,q
t.o.a(a)
s=this.a
r=this.b
q=J.n(s)
return A.qA(q.h(s,r),q.h(s,r+1),a)},
$S:23}
A.jz.prototype={
$6(a,b,c,d,e,f){return(c-a)*(f-b)-(d-b)*(e-a)},
$S:29}
A.bo.prototype={}
A.fF.prototype={}
A.he.prototype={}
A.fU.prototype={}
A.fE.prototype={}
A.dV.prototype={
q(a){var s=this
return A.u(s.a)+","+A.u(s.b)+","+A.u(s.c)+","+A.u(s.d)}}
A.fn.prototype={}
A.h8.prototype={}
A.k0.prototype={
i0(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4=this,b5=null,b6="url",b7="attribution",b8=b4.a,b9=b8.a
b8=b8.$ti.i("4?")
s=b8.a(b9.h(0,"layers"))
r=t.j
s=J.B(r.b(s)?s:B.a3)
q=t.f
p=b4.y
o=b4.r
n=o.c
m=b4.x
l=b4.w
k=b4.z
while(s.l()){j=s.gn()
if(!q.b(j))continue
i=A.us(j)
if(J.l(i.e.h(0,"visibility"),"none"))continue
h=i.b
if(A.va(h)){g=n.length
f=b4.hP(i)
if(f!=null)o.j(0,f)
if(J.l(h,"symbol")){b4.Q=n.length
b4.as=new A.e(m.length,l.length)}e=i.d.h(0,A.u(h)+"-layer-opacity")
if(e!=null){d=A.t(e)
for(c=g;c<n.length;++c)k.m(0,c,d)}}else{b=J.as(h)
if(b.D(h,"background")){a=i.d
a0=a.h(0,"background-pattern")
B.a.j(p,new A.e(n.length,new A.cn(-1,m.length,-1,0)))
A.J(a.h(0,"background-color"),"#000000")
A.J(a.h(0,"background-opacity"),1)
if(a0!=null)A.hP(a0)
B.a.j(m,new A.fg())}else if(b.D(h,"raster")||b.D(h,"hillshade")||b.D(h,"color-relief"))b4.f1(i)}}a1=b4.hs()
a2=b8.a(b9.h(0,"sprite"))
b4.hK()
if(b8.a(b9.h(0,"sky"))!=null){a3=b8.a(b9.h(0,"sky"))
a3=q.b(a3)?a3:B.aQ
s=a3.h(0,"sky-color")
A.t(s==null?"#88C6FC":s)
s=a3.h(0,"horizon-color")
A.t(s==null?"#ffffff":s)
s=a3.h(0,"sky-horizon-blend")
A.t(s==null?0.8:s)
s=a3.h(0,"fog-color")
A.t(s==null?"#ffffff":s)
s=a3.h(0,"fog-ground-blend")
A.t(s==null?0.5:s)
s=a3.h(0,"horizon-fog-blend")
A.t(s==null?0.8:s)
s=a3.h(0,"atmosphere-blend")
A.t(s==null?0.8:s)}s=A.qQ(b8.a(b9.h(0,"projection")))
p=A.ua(b8.a(b9.h(0,"light")))
b4.fR(a1)
A:{m=typeof a2=="string"
if(m)break A
a4=b5
a5=b5
a6=!1
l=!1
if(r.b(a2)){k=J.n(a2)
a7=k.gk(a2)>=1
if(a7){a4=k.h(a2,0)
a6=q.b(a4)
if(a6){t.e.a(a4)
a5=a4.h(0,b6)
k=a5
if(k==null){t.e.a(a4)
k=a4.K(b6)}else k=!0
if(k)l=typeof a5=="string"}}}else a7=!1
if(l){if(a6)l=a5
else{l=a7?a4:J.R(a2,0)
a5=t.e.a(l).h(0,b6)
l=a5}A.P(l)
break A}break A}l=A.b([],t.m_)
if(m)l.push(new A.e("",a2))
if(r.b(a2))for(r=J.B(a2);r.l();){a8=r.gn()
a9=b5
b0=!1
b1=b5
m=!1
if(q.b(a8)){b2=a8.h(0,"id")
if(b2==null)k=a8.K("id")
else k=!0
if(k){b0=typeof b2=="string"
if(b0){a9=a8.h(0,b6)
if(a9==null)k=a8.K(b6)
else k=!0
if(k)m=typeof a9=="string"
b1=b2}}}if(m){b3=A.P(b0?a9:a8.h(0,b6))
l.push(new A.e(b1==="default"?"":A.u(b1)+":",b3))}}b8=b8.a(b9.h(0,"glyphs"))
b8=typeof b8=="string"?b8:b5
b9=A.bd(t.N)
for(r=b4.d.gaL(),r=r.gp(r);r.l();){a8=r.gn()
if(q.b(a8)&&typeof a8.h(0,b7)=="string")b9.j(0,A.P(a8.h(0,b7)))}A.W(b9,b9.$ti.c)
return new A.k6(p,s,o.b,n,o.d,b4.e,b4.c,l,b8)},
hP(a){var s,r,q,p=a.c,o=this.hB(p.h(0,"source"))
if(o==null)return null
s=p.h(0,"source-layer")
r=typeof s=="string"
if(!r){q=this.e
if(o>>>0!==o||o>=q.length)return A.a(q,o)
q=!(q[o] instanceof A.cd)}else q=!1
if(q)return null
r=r?s:""
return new A.kG(a,o,r,p.h(0,"filter"))},
hB(a){return this.f.bg(a,new A.k3(this,a))},
f1(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=null,d=a.d,c=f.d.h(0,a.c.h(0,"source"))
if(!t.f.b(c))return
if(d.gX().aj(0,B.aU.gec(B.aU))){A.J(d.h(0,"raster-hue-rotate"),0)
A.J(d.h(0,"raster-saturation"),0)
A.J(d.h(0,"raster-contrast"),0)
A.J(d.h(0,"raster-brightness-min"),0)
A.J(d.h(0,"raster-brightness-max"),1)}J.l(d.h(0,"raster-resampling"),"nearest")
s=d.h(0,"resampling")
if(s!=null)A.t(s)
A.J(d.h(0,"raster-opacity"),1)
r=c.h(0,"url")
r=typeof r=="string"?r:e
q=A.pH(c.h(0,"tiles"))
p=A.C(c.h(0,"tileSize"))
if(p==null)p=512
o=A.hQ(c.h(0,"maxzoom"))
n=a.b
m=c.h(0,"type")
A:{l="raster"===n
s=l
if(s){s="image"===m
k=m
j=!0}else{k=e
j=!1
s=!1}i=e
if(s){B:{if(A.xr(c.h(0,"coordinates"))!=null)s=r!=null
else s=!1
if(s){s=new A.fF()
break B}s=i
break B}break A}if(l){if(j)s=k
else{s=m
k=s
j=!0}s="raster"===s}else s=!1
if(s){A.et(c)
s=A.C(d.h(0,"raster-fade-duration"))
B.c.H(s==null?300:s,0,1/0)
s=new A.fU()
break A}h="hillshade"===n
g=e
if(h){if(j)s=k
else{s=m
k=s
j=!0}g="raster-dem"===s
s=g}else s=!1
if(s){A.t(1)
A.et(c)
J.l(c.h(0,"encoding"),"terrarium")
A.J(d.h(0,"hillshade-exaggeration"),0.5)
A.t("#000000")
A.t("#ffffff")
A.rN(d.h(0,"hillshade-shadow-color"),"#000000")
A.rN(d.h(0,"hillshade-highlight-color"),"#ffffff")
s=d.h(0,"hillshade-accent-color")
if(s!=null)A.t(s)
s=d.h(0,"hillshade-method")
A.u(s==null?"standard":s)
A.t_(d.h(0,"hillshade-illumination-direction"),335)
A.t_(d.h(0,"hillshade-illumination-altitude"),45)
s=new A.fE()
break A}if("color-relief"===n)if(h)s=g
else{g="raster-dem"===(j?k:m)
s=g}else s=!1
if(s){s=f.ff(a,c,o,r,p,q)
break A}s=i
break A}if(s==null)return
i=f.w
B.a.j(f.y,new A.e(f.r.c.length,new A.cn(i.length,-1,-1,0)))
B.a.j(i,s)},
ff(a,b,c,d,e,a0){var s,r,q,p,o,n,m,l=a.d,k=t.n,j=A.b([],k),i=A.b([],k),h=l.h(0,"color-relief-color"),g=t.j,f=!1
if(g.b(h)){s=J.n(h)
if(s.gk(h)>=3)if("interpolate"===s.h(h,0)){r=s.h(h,2)
if(g.b(r)){t.W.a(r)
g=J.n(r)
if(g.gk(r)===1)g="elevation"===g.h(r,0)
else g=f}else g=f}else g=f
else g=f}else g=f
if(g){q=J.tH(h,3)
p=new A.z(B.e,B.e)
for(o=0;g=o+1,f=q.length,g<f;o+=2){if(!(o<f))return A.a(q,o)
n=q[o]
if(!(typeof n=="number"))if(typeof n=="string"){f=A.L(n)
n=f}else{if(A.E(n))f=n?1:0
else f=null
n=f}if(n==null)continue
if(!(g<q.length))return A.a(q,g)
m=A.aS(A.t(q[g]).$1(p))
if(m==null)m=B.ez
B.a.j(j,n)
g=m.d
B.a.v(i,A.b([m.a*g,m.b*g,m.c*g,g],k))}}if(j.length===0){B.a.j(j,0)
B.a.v(i,A.b([0,0,0,0],k))}if(j.length<2){B.a.j(j,B.a.gt(j)+1)
B.a.v(i,B.a.F(i,0,4))}A.J(l.h(0,"color-relief-opacity"),1)
A.et(b)
A.tU(b)
new Float64Array(A.N(j))
new Float64Array(A.N(i))
A.J(l.h(0,"resampling"),"linear")
return new A.fn()},
fR(a){var s,r,q,p,o,n,m,l,k
t.ia.a(a)
s=this.as
if(s==null)return a.length
r=s.a
q=s.b
for(p=a.length,o=this.Q,n=0;n<p;++n){m=a[n]
l=!0
if(!(m.c>=0&&m.d>=o)){k=m.b
if(!(k>=0&&k>=r)){l=m.a
l=l>=0&&l>=q}}if(l)return n}return p},
hK(){var s,r=this.a,q=r.$ti.i("4?").a(r.a.h(0,"terrain"))
r=t.f
if(!r.b(q))return null
s=this.d.h(0,q.h(0,"source"))
if(!r.b(s)||!J.l(s.h(0,"type"),"raster-dem"))return null
A.t(1)
s.h(0,"url")
A.pH(s.h(0,"tiles"))
A.C(s.h(0,"tileSize"))
A.hQ(s.h(0,"maxzoom"))
A.et(s)
J.l(s.h(0,"encoding"),"terrarium")
A.C(q.h(0,"exaggeration"))
return new A.h8()},
hs(){var s,r,q,p,o,n,m,l,k,j,i,h=this,g={},f=h.r.c,e=A.b([],t.in)
g.a=0
s=new A.k2(h,f)
r=new A.k1(g,e,s)
for(q=h.y,p=h.z,o=0,n=0;n<=f.length;++n){for(;;){m=q.length
if(o<m){if(!(o>=0))return A.a(q,o)
m=q[o].a===n}else m=!1
if(!m)break
r.$1(n)
l=o+1
if(!(o>=0&&o<q.length))return A.a(q,o)
B.a.j(e,q[o].b)
o=l}m=!0
if(n!==f.length)if(n>g.a){if(J.l(s.$1(n),s.$1(g.a)))if(n!==h.Q){if(!(n<f.length))return A.a(f,n)
k=f[n].gbm()
j=g.a
if(!(j<f.length))return A.a(f,j)
if(k===f[j].gbm()){k=f.length
if(!(n<k))return A.a(f,n)
if(!(f[n] instanceof A.cE)){j=g.a
if(!(j<k))return A.a(f,j)
if(!(f[j] instanceof A.cE)){if(p.K(n)||p.K(g.a)){k=f.length
if(!(n<k))return A.a(f,n)
j=f[n]
i=n-1
if(!(i<k))return A.a(f,i)
i=j.a!==f[i].a
k=i}else k=!1
if(!k){k=f.length
if(!(n<k))return A.a(f,n)
j=f[n]
if(!(j instanceof A.bB&&j.dx)){m=g.a
if(!(m<k))return A.a(f,m)
m=f[m]
m=m instanceof A.bB&&m.dx}}}}}}}else m=!1
if(m)r.$1(n)}return e}}
A.k3.prototype={
$0(){var s,r,q,p,o,n,m,l,k,j,i,h=null,g="promoteId",f="generateId",e="encoding",d=this.a,c=this.b,b=d.d.h(0,c)
if(!t.f.b(b))return h
s=J.l(b.h(0,"type"),"geojson")
if(!s&&!J.l(b.h(0,"type"),"vector"))return h
A.pH(b.h(0,"tiles"))
r=b.h(0,"data")
q=A.hQ(b.h(0,"maxzoom"))
if(s&&J.l(b.h(0,"cluster"),!0)){p=A.C(b.h(0,"clusterRadius"))
if(p==null)p=h
if(p==null)p=50
o=A.hQ(b.h(0,"clusterMaxZoom"))
if(o==null)o=(q==null?18:q)-1
o=B.b.H(o,0,24)
n=A.hQ(b.h(0,"clusterMinPoints"))
if(n==null)n=2
m=b.h(0,"clusterProperties")
A:{if(t.e.b(m)){l=A.A(t.N,t.O)
for(k=m.ga7(),k=k.gp(k);k.l();){j=k.gn()
l.m(0,A.u(j.a),j.b)}break A}l=B.e
break A}i=new A.i7(p,o,n,l)}else i=h
d=d.e
if(s){A.u(c)
c=b.h(0,g)
p=J.l(b.h(0,f),!0)
o=b.h(0,"filter")
n=A.C(b.h(0,"buffer"))
if(n==null)n=h
A.u(typeof r=="string"?r:A.oe(r))
if(i!=null)B.t.aB(i.d,h)
A.u(b.h(0,g))
A.u(b.h(0,f))
A.cv(b.h(0,"filter"))
A.u(b.h(0,"buffer"))
c=new A.cd(r,n,o,i,p,q,c)}else{A.u(c)
b.h(0,"url")
c=b.h(0,g)
p=A.et(b)
o=J.l(b.h(0,e),"mlt")
A.u(b.h(0,"url"))
A.u(b.h(0,g))
n=A.et(b).b
if(n!=null)B.a.ab(n,",")
A.u(b.h(0,e))
c=new A.dt(p,o,q,c)}B.a.j(d,c)
return d.length-1},
$S:59}
A.k2.prototype={
$1(a){var s=this.a.r.b,r=this.b
if(!(a<r.length))return A.a(r,a)
r=r[a].b
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r].c},
$S:20}
A.k1.prototype={
$1(a){var s=this.a,r=s.a
if(a>r)B.a.j(this.b,new A.cn(-1,-1,this.c.$1(r),s.a))
s.a=a},
$S:25}
A.ib.prototype={}
A.ie.prototype={}
A.fx.prototype={}
A.kH.prototype={
j(a,b){var s,r=this
switch(b.a.b){case"symbol":s=r.hI(b)
break
case"heatmap":s=r.fN(b)
break
case"circle":s=r.f9(b)
break
case"line":s=r.fV(b)
break
default:s=r.fC(b)
break}return s},
hI(e3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5=null,b6="text-font",b7="text-offset",b8="text-rotation-alignment",b9="viewport",c0="icon-rotation-alignment",c1="text-anchor",c2="icon-offset",c3="text-size",c4="icon-size",c5="symbol-height-offset",c6="symbol-sort-key",c7="text-transform",c8="lowercase",c9="text-letter-spacing",d0="text-max-width",d1="text-justify",d2="text-rotate",d3="vertical",d4="icon-padding",d5="icon-text-fit",d6=e3.a,d7=d6.d,d8=d6.e,d9=d8.h(0,"text-field"),e0=d8.h(0,"icon-image"),e1=d9!=null&&!J.l(d9,""),e2=e0!=null&&!J.l(e0,"")
if(!e1&&!e2)return
s=this.a
if(e1&&s!=null&&B.d.u(A.cv(d9),"name")){r=A.b(["coalesce"],t.G)
for(q=s.$ti,p=new A.a1(s,s.gk(0),q.i("a1<y.E>")),o=t.s,q=q.i("y.E");p.l();){n=p.d
r.push(A.b(["get",n==null?q.a(n):n],o))}d9=r}r=d8.h(0,b6)
m=A.cv(r==null?"":r).toLowerCase()
A.pD(d8.h(0,b7))
l=d8.h(0,"symbol-placement")
if(l==null)l="point"
k=A.C(d8.h(0,"symbol-spacing"))
if(k==null)k=250
j=J.l(d8.h(0,b8),b9)
i=J.l(d8.h(0,c0),b9)
d8.h(0,c1)
A.xa(d8.h(0,"text-variable-anchor-offset"),d8.h(0,"text-variable-anchor"))
h=d8.h(0,"icon-anchor")
A.pD(d8.h(0,c2))
r=t.N
g=A.bd(r)
for(f=0;f<10;++f)A.c4(d7.h(0,B.bX[f]),g)
A.c4(d8.h(0,c3),g)
A.c4(d8.h(0,c4),g)
A.c4(d8.h(0,c2),g)
A.c4(d8.h(0,b7),g)
A.c4(d8.h(0,c5),g)
for(f=0;f<8;++f)A.c4(d8.h(0,B.bM[f]),g)
e=new A.kN(d8)
q=e1?d9:b5
p=e2?e0:b5
o=d8.h(0,c6)
n=d8.h(0,"icon-rotate")
if(n==null)n=0
d=A.W(g,g.$ti.c)
B.a.bl(d)
c=A.v8(A.j4(["source",e3.b,"sourceLayer",e3.c,"filter",e3.d,"text",q,"icon",p,"placement",l,"spacing",k,"textUpright",j,"iconUpright",i,"minZoom",d6.f,"maxZoom",d6.r,"sortKey",o,"iconRotate",n,"paintKeys",d],r,t.O))
q=A.J(d8.h(0,c3),16)
A.J(d7.h(0,"text-color"),"#000000")
A.J(d7.h(0,"text-opacity"),1)
A.t(d7.h(0,"text-halo-color"))
A.J(d7.h(0,"text-halo-width"),0)
p=A.xG(m)
if(!B.d.u(m,"italic"))B.d.u(m,"oblique")
o=A.xF(d8.h(0,b6))
n=J.l(d8.h(0,c7),"uppercase")
if(e.$1(c7)==null)if(J.l(d8.h(0,c7),c8))A.t(c8)
e.$1(c9)
e.$1(d0)
e.$1(d1)
e.$1(c1)
e.$1(d2)
e.$1(b6)
if(J.l(l,"point")){b=d8.h(0,"text-writing-mode")
A:{if(t.j.b(b)){d=A.b([],t.d)
for(a=J.B(b);a.l();){a0=a.gn()
a1=J.as(a0)
if(a1.D(a0,d3)||a1.D(a0,"horizontal"))d.push(a1.D(a0,d3))}break A}break A}}d=A.C(d8.h(0,c9))
if(d==null)d=0
a=A.C(d8.h(0,"text-line-height"))
switch(d8.h(0,d1)){case"left":a1=B.eH
break
case"right":a1=B.eI
break
default:a1=B.eJ
break}J.l(d8.h(0,d1),"auto")
A.C(d8.h(0,"text-padding"))
J.l(d8.h(0,b8),"map")
J.l(d8.h(0,b8),"viewport-glyph")
J.l(d8.h(0,c0),"map")
A.C(d8.h(0,d4))
A.yr(d8.h(0,d4))
J.l(d8.h(0,"text-ignore-placement"),!0)
switch(d8.h(0,"icon-pitch-alignment")){case"map":break
case"viewport":break
default:switch(d8.h(0,c0)){case"map":break
case"viewport":break
default:if(typeof l=="string")B.d.an(l,"line")
break}break}switch(d8.h(0,"text-pitch-alignment")){case"map":break
case"viewport":break
default:a2=d8.h(0,b8)
B:{if("map"===a2)break B
if("viewport"===a2||"viewport-glyph"===a2)break B
if(typeof l=="string")B.d.an(l,"line")
break B}break}J.l(d8.h(0,"text-keep-upright"),!1)
J.l(d8.h(0,"icon-ignore-placement"),!0)
A.J(d7.h(0,"text-halo-blur"),0)
a3=A.C(d8.h(0,d0))
if(a3==null)a3=10
a4=A.J(d8.h(0,c4),1)
A.J(d7.h(0,"icon-opacity"),1)
A.J(d7.h(0,"icon-color"),"#000000")
A.C(d8.h(0,d2))
if(!A.rV(d8.h(0,b7)))A.t(d8.h(0,b7))
J.l(d8.h(0,"text-optional"),!0)
J.l(d8.h(0,"icon-optional"),!0)
A.of(d8,"icon")
A.of(d8,"text")
A.of(d8,"icon")
A.of(d8,"text")
A.xy(d8)
J.l(d8.h(0,"symbol-z-order"),"viewport-y")
d8.h(0,c6)
A.c4(d8.h(0,c4),A.bd(r))
r=d8.h(0,d5)
J.l(r==null?"none":r,"none")
d8.h(0,d5)
C:{break C}a5=d8.h(0,"icon-text-fit-padding")
D:{r=t.j
a6=b5
a7=!1
a8=!1
if(r.b(a5)){a9=J.n(a5)
if(a9.gk(a5)===4){b0=a9.h(a5,0)
if(typeof b0=="number"){A.ac(b0)
b1=a9.h(a5,1)
if(typeof b1=="number"){A.ac(b1)
b2=a9.h(a5,2)
a7=typeof b2=="number"
if(a7){A.ac(b2)
a6=a9.h(a5,3)
a8=typeof a6=="number"}}}}}if(a8){A.ac(a7?a6:J.R(a5,3))
break D}break D}A.C(d8.h(0,"text-radial-offset"))
if(r.b(h)||t.f.b(h))A.t(h)
if(!A.rV(d8.h(0,c2)))A.t(d8.h(0,c2))
r=d7.h(0,"text-translate")
if(r!=null)A.t(r)
J.l(d7.h(0,"text-translate-anchor"),b9)
r=d7.h(0,"icon-halo-color")
if(r!=null)A.t(r)
r=d7.h(0,"icon-halo-width")
if(r!=null)A.t(r)
r=d7.h(0,"icon-translate")
if(r!=null)A.t(r)
r=d7.h(0,"icon-halo-blur")
if(r!=null)A.t(r)
J.l(d7.h(0,"icon-translate-anchor"),b9)
b3=d8.h(0,c5)
E:{if(b3==null||0===b3)break E
A.t(b3)
break E}J.l(d8.h(0,"symbol-height-anchor"),"absolute")
b4=A.C(d8.h(0,"text-max-angle"))
F:{r=b5
if(b4!=null){r=b4*3.141592653589793/180
break F}break F}B.a.j(this.d,new A.h5(d6.a,c,q,p,o,n,d,a,a1,a3,a4,r))
r=this.f
a4=A.cv(A.b(["s",c.a],t.s))
r.a+=a4},
fN(a){var s,r,q,p=a.a,o=p.d
A.J(o.h(0,"heatmap-radius"),30)
p.gaZ()
J.l(o.h(0,A.u(p.b)+"-translate-anchor"),"viewport")
s=this.bY(a,B.Q,A.hT(o,B.bT))
A.t("#ffffff")
A.J(o.h(0,"heatmap-opacity"),1)
r=A.J(o.h(0,"heatmap-weight"),1)
q=A.J(o.h(0,"heatmap-intensity"),1)
A.uj(o.h(0,"heatmap-color"),q,r)
B.a.j(this.c,new A.cE(p.a,s,p.f,p.r))},
f9(a){var s,r,q,p,o,n="viewport",m="circle-blur",l=a.a,k=l.d,j=A.hT(k,B.ch)
A.J(k.h(0,"circle-radius"),5)
s=k.h(0,"circle-stroke-width")
l.gaZ()
J.l(k.h(0,A.u(l.b)+"-translate-anchor"),n)
r=this.bY(a,B.Q,j)
A.J(k.h(0,"circle-color"),"#000000")
A.J(k.h(0,"circle-opacity"),1)
if(s!=null){A.J(k.h(0,"circle-stroke-color"),"#000000")
A.t(s)
A.J(k.h(0,"circle-stroke-opacity"),1)}q=J.l(k.h(0,"circle-pitch-alignment"),"map")
p=J.l(k.h(0,"circle-pitch-scale"),n)
o=k.h(0,m)==null?null:A.t(k.h(0,m))
B.a.j(this.c,new A.d6(q,!p,o,l.a,r,l.f,l.r))},
fV(b6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4="line-gradient",a5=null,a6="line-cap",a7=b6.a,a8=a7.d,a9=a7.e,b0=A.hT(a8,B.bS),b1=a8.h(0,"line-offset"),b2=a8.h(0,"line-blur"),b3=a8.h(0,a4)!=null&&b1!=null?a5:a8.h(0,"line-dasharray"),b4=A.xu(b3),b5=b4.length===0&&A.nP(b3)==null?A.xt(b3):B.am
if(b4.length!==0)s=B.a.gt(b4).b
else s=b5.length!==0?B.a.gt(b5):A.nP(b3)
r=A.J(a8.h(0,"line-width"),1)
q=a8.h(0,"line-gap-width")
p=q==null?a5:A.t(q)
o=p!=null?new A.kL(r,p):r
n=a8.h(0,"line-pattern")
m=n==null
l=m?a8.h(0,a4):a5
k=this.f
j=!m
i=l==null
h=!i
g=A.cv(A.b(["l",j,h],t.G))
k.a+=g
f=b2!=null&&m&&i
k=a7.gaZ()
g=J.l(a8.h(0,A.u(a7.b)+"-translate-anchor"),"viewport")
if(j)j=B.G
else switch(a9.h(0,a6)){case"round":j=B.ai
break
case"square":j=B.aj
break
default:j=B.G
break}e=s==null
d=!e||!m||f||h
e=f&&e
c=b1==null
switch(a9.h(0,"line-join")){case"round":b=B.aE
break
case"bevel":b=B.ak
break
default:b=B.S
break}h=this.f7(b6,B.P,b0,j,d,e,b,h,!c)
j=m&&i?A.J(a8.h(0,"line-color"),"#000000"):A.t("#ffffff")
i=i?a5:A.t(l)
if(t.j.b(l)){e=J.n(l)
e=e.gJ(l)&&J.l(e.gt(l),"step")}else e=!1
d=A.J(a8.h(0,"line-opacity"),1)
c=c?a5:A.t(b1)
b=f?A.t(b2):a5
a=m?s:a5
a0=m?b4:B.a4
a1=m?b5:B.am
a2=m&&b5.length!==0?A.t(b3):a5
switch(a9.h(0,a6)){case"round":a3=B.b5
break
case"square":a3=B.b6
break
default:a3=B.aB
break}m=m?a5:A.hP(n)
B.a.j(this.c,A.qv(b,h,j,a,a3,a1,a2,a0,p,i,e,a7.a,a7.r,a7.f,c,d,!1,m,b0.a!==0,k,g,o))},
fC(a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=null,d="#000000",c="-translate-anchor",b="viewport",a="fill-antialias",a0="fill-outline-color",a1=a6.a,a2=a1.d,a3=A.P(a1.b),a4=a3+"-color",a5=a2.h(0,a4)
if(a5==null)a5=d
s=a3+"-opacity"
r=a2.h(0,s)
if(r==null)r=1
q=a3+"-pattern"
p=A.hT(a2,A.b([a4,s,q],t.s))
o=a2.h(0,q)
q=f.f
s=o==null
a4=A.cv(A.b(["f",!s],t.G))
q.a+=a4
a4=f.c
q=a1.a
a1.gaZ()
J.l(a2.h(0,a3+c),b)
n=f.bY(a6,B.a_,p)
m=a1.f
l=a1.r
if(s)A.J(a5,d)
else A.t("#ffffff")
A.t(r)
k=s?e:A.hP(o)
if(!s)A.J(a5,d)
j=!1
if(a3==="fill")if(!J.l(a2.h(0,a),!1))j=!s||a2.h(0,a0)==null
if(j)j=s?A.J(a5,d):A.t("#ffffff")
else j=e
i=a3==="fill-extrusion"
B.a.j(a4,new A.bB(k,j,i,q,n,m,l))
if(i){f.dQ(A.cv(["extrusion",a6.b,a6.c,a6.d,a2.h(0,"fill-extrusion-height"),a2.h(0,"fill-extrusion-base"),a5,a2.h(0,"fill-extrusion-vertical-gradient"),a1.e.h(0,"fill-extrusion-rounded-corner-distance"),o]),a1,new A.kJ(a6,a2,o,a5,a1))
A.t(r)
a1.gaZ()
J.l(a2.h(0,a3+c),b)
B.a.j(f.e,new A.fx())}h=a2.h(0,a0)
if(h==null||!s||J.l(a2.h(0,a),!1))return
g=A.hT(a2,B.cc)
s=a1.gaZ()
n=J.l(a2.h(0,a3+c),b)
B.a.j(a4,A.qv(e,f.f6(a6,B.P,g,!0),A.t(h),e,B.aB,B.am,e,B.a4,e,e,!1,q,l,m,e,A.t(r),!0,e,g.a!==0,s,n,new A.kK()))},
bX(a,b,c,d,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=null,e={}
t.gi.a(c)
e.a=e.b=e.c=null
s=a.a
r=a.b
e.c=r
q=a.c
e.b=q
p=a.d
e.a=p
o=b===B.P
n=o?s.e.h(0,"line-join"):f
m=o?s.e.h(0,"line-cap"):f
l=t.j
k=l.b(m)||t.f.b(m)?m:f
j=o?s.e.h(0,"line-miter-limit"):f
i=o?s.e.h(0,"line-round-limit"):f
h=A.W(c,A.q(c).c)
B.a.bl(h)
g=s.e.h(0,A.u(s.b)+"-sort-key")
o=[g,b.a,r,q,p,d.a,a0,a5,a4,a1,a3,a2.a,h]
if(l.b(n)||t.f.b(n))o.push(n)
if(k!=null)o.push(k)
if(j!=null)o.push(j)
if(i!=null)o.push(i)
return this.dQ(A.cv(o),s,new A.kI(e,b,d,a0,a5,a4,a1,a3,a2,n,j,k,i,h,g))},
bY(a,b,c){return this.bX(a,b,c,B.G,!1,!1,B.S,!1,!1,!1)},
f6(a,b,c,d){return this.bX(a,b,c,B.G,!1,!1,B.S,!1,!1,d)},
f7(a,b,c,d,e,f,g,h,i){return this.bX(a,b,c,d,e,f,g,h,i,!1)},
dQ(a,b,c){var s,r,q,p=this,o=p.r.bg(a,new A.kM(p,t.ea.a(c))),n=p.b
if(!(o>=0&&o<n.length))return A.a(n,o)
s=n[o]
n=b.f
if(n<s.cx)s.cx=n
r=b.r
if(r>s.cy)s.cy=r
q=p.f
r=A.cv(A.b([a,n,r],t.G))
q.a+=r
return o}}
A.kN.prototype={
$1(a){var s=this.a,r=s.h(0,a)
A:{if(t.j.b(r)||t.f.b(r)){s=A.t(s.h(0,a))
break A}s=null
break A}return s},
$S:61}
A.kL.prototype={
$1(a){var s,r=A.C(this.a.$1(a))
if(r==null)r=1
s=A.C(this.b.$1(a))
if(s==null)s=0
return r*2+s},
$S:14}
A.kJ.prototype={
$0(){var s=this,r="fill-extrusion-height",q="fill-extrusion-base",p=null,o=s.a,n=A.mv(o.d),m=s.b,l=A.J(m.h(0,r),0),k=A.J(m.h(0,q),0),j=s.c,i=j==null,h=i?A.J(s.d,"#000000"):A.t("#ffffff"),g=J.l(m.h(0,"fill-extrusion-vertical-gradient"),!1),f=s.e.e.h(0,"fill-extrusion-rounded-corner-distance")
f=A.t(f==null?0:f)
j=i?p:A.hP(j)
m=[m.h(0,r),m.h(0,q)]
if(i)m.push(s.d)
return A.q0(o.b,o.c,n,B.af,B.G,p,!1,!1,new A.ib(l,k,h,!g,f,j,A.t3(m)),B.S,p,!1,p,!1,!1,p,p,B.an)},
$S:34}
A.kK.prototype={
$1(a){return 1},
$S:37}
A.kI.prototype={
$0(){var s,r,q,p,o,n=this,m=null,l=n.a,k=l.c,j=l.b
l=A.mv(l.a)
s=n.y
s=t.j.b(s)||t.f.b(s)?A.t(s):m
r=n.z
r=r==null?m:A.t(r)
q=n.Q
q=q==null?m:A.t(q)
p=n.as
p=p==null?m:A.t(p)
o=n.ax
o=o==null?m:A.t(o)
return A.q0(k,j,l,n.b,n.c,q,n.d,n.r,m,n.x,s,n.w,r,n.f,n.e,p,o,n.at)},
$S:34}
A.kM.prototype={
$0(){var s=this.a.b
B.a.j(s,this.b.$0())
return s.length-1},
$S:8}
A.cx.prototype={
ap(){return"BucketKind."+this.b}}
A.by.prototype={}
A.db.prototype={
ap(){return"DashCap."+this.b}}
A.bJ.prototype={
gbm(){return!1}}
A.fO.prototype={}
A.bB.prototype={}
A.dm.prototype={}
A.d6.prototype={
gbm(){return!0}}
A.cE.prototype={
gbm(){return!0}}
A.iL.prototype={}
A.fg.prototype={}
A.cn.prototype={}
A.p5.prototype={}
A.h3.prototype={}
A.k5.prototype={
$1(a){return t.aL.a(a).b===0},
$S:44}
A.k6.prototype={}
A.iZ.prototype={
gaZ(){var s,r=this.d.h(0,A.u(this.b)+"-translate")
A:{if(r==null){s=null
break A}s=A.t(r)
break A}return s}}
A.kG.prototype={}
A.nT.prototype={
$1(a){var s,r
t.t.a(a)
s=this.a.$1(a)
if(A.aS(s)!=null)return s
r=this.b
return r==null?this.c.$1(a):r},
$S:39}
A.nU.prototype={
$1(a){var s,r
t.t.a(a)
s=this.a.$1(a)
A:{if(s==null){r=this.b.$1(a)
break A}if(typeof s=="number")r=isNaN(s)
else r=!1
if(r){r=this.b.$1(a)
break A}r=s
break A}return r},
$S:1}
A.nS.prototype={
$2(a,b){var s=this.a,r=s.h(0,a)
A:{if(typeof r=="string"){s=r!=="never"
break A}s=J.l(s.h(0,b),!0)
break A}return s},
$S:65}
A.o6.prototype={
$1(a){return typeof a=="number"},
$S:9}
A.mu.prototype={
$1(a){return typeof a=="string"&&A.aS(a)!=null},
$S:9}
A.nN.prototype={
$1(a){var s,r
if(!t.j.b(a))return
s=J.n(a)
if(s.gk(a)===2&&J.l(s.h(a,0),"literal")){r=A.nP(a)
if(r!=null&&!B.a.aj(this.a,new A.nO(r)))B.a.j(this.a,r)
return}for(s=s.gp(a);s.l();)this.$1(s.gn())},
$S:12}
A.nO.prototype={
$1(a){return A.wT(t.kI.a(a),this.a)},
$S:66}
A.kt.prototype={
ik(a,b,c){var s,r,q,p,o
if(a<this.a)return!1
s=this.b
if(s==null)return!0
r=new A.kv(a)
q=new A.kw(a)
if(0>=s.length)return A.a(s,0)
p=r.$1(s[0])
if(typeof p!=="number")return A.a6(p)
o=!1
if(b>=p){if(2>=s.length)return A.a(s,2)
r=r.$1(s[2])
if(typeof r!=="number")return A.a6(r)
if(b<=r){if(3>=s.length)return A.a(s,3)
r=q.$1(s[3])
if(typeof r!=="number")return A.a6(r)
if(c>=r){if(1>=s.length)return A.a(s,1)
r=q.$1(s[1])
if(typeof r!=="number")return A.a6(r)
r=c<=r}else r=o}else r=o}else r=o
return r}}
A.ku.prototype={
$1(a){return typeof a=="number"},
$S:9}
A.kv.prototype={
$1(a){var s=B.b.a3(1,this.a)
return B.b.H(B.c.U((a+180)/360*s),0,s-1)},
$S:27}
A.kw.prototype={
$1(a){var s=B.b.a3(1,this.a)
return B.b.H(B.c.U(A.tb(a)*s),0,s-1)},
$S:27}
A.dv.prototype={
cG(a){var s,r=this.c
A:{if(typeof r=="string"){s=r
break A}if(t.f.b(r)){s=A.dF(r.h(0,a))
break A}s=null
break A}return s}}
A.cd.prototype={
geg(){return 18}}
A.dt.prototype={
geg(){return 22}}
A.kd.prototype={}
A.ke.prototype={
$1(a){return""},
$S:5}
A.h5.prototype={
gic(){return this.b.d},
ie(a){return this.gic().$1(a)}}
A.fh.prototype={
q(a){return"BidiRun("+this.a+".."+this.b+", "+this.c+")"}}
A.i3.prototype={}
A.dA.prototype={}
A.lj.prototype={
eV(a,b,c,d,e){var s,r=this,q=r.e,p=A.W(q,t.oQ)
t.fc.a(p)
r.f!==$&&A.at()
r.f=p
r.h0()
q=r.de(0,q.length)
r.r!==$&&A.at()
r.r=q
r.fz()
for(q=r.hu(),p=q.length,s=0;s<q.length;q.length===p||(0,A.i)(q),++s)r.hn(q[s])
r.fO()
r.hL()},
gk(a){return this.e.length},
h0(){var s,r,q,p,o,n,m=A.b([],t.X)
for(s=this.e,r=this.w,q=this.x,p=0;p<s.length;++p){o=s[p]
if(o===B.m||o===B.i||o===B.j)B.a.j(m,p)
else if(o===B.r&&m.length!==0){if(0>=m.length)return A.a(m,-1)
r.m(0,m.pop(),p)
q.j(0,p)}}for(q=m.length,n=0;n<m.length;m.length===q||(0,A.i)(m),++n)r.m(0,m[n],s.length)},
de(a,b){var s,r,q,p,o
for(s=this.e,r=this.w,q=a;q<b;++q){if(!(q>=0&&q<s.length))return A.a(s,q)
p=s[q]
if(p===B.f)return 0
if(p===B.h||p===B.F)return 1
if(p===B.m||p===B.i||p===B.j){o=r.h(0,q)
o.toString
q=o}}return 0},
fz(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a.r
a0===$&&A.h()
s=A.b([new A.dA(a0,null,!1)],t.fB)
for(r=a.e,q=a.d,p=a.b,o=q.$flags|0,n=a.w,m=0,l=0,k=0,j=0;j<r.length;++j){i=r[j]
h=B.a.gE(s)
if(B.p===i||B.x===i||B.q===i||B.y===i){g=i===B.p||i===B.q
f=h.a
e=g?(f+1|1)>>>0:(f+2&4294967294)>>>0
if(e<=125&&m===0&&l===0){switch(i.a){case 17:d=B.h
break
case 15:d=B.f
break
default:d=null
break}B.a.j(s,new A.dA(e,d,!1))}else if(m===0)++l
d=p+j
o&2&&A.r(q)
if(!(d<q.length))return A.a(q,d)
q[d]=f
continue}if(B.i===i||B.m===i||B.j===i){f=h.a
d=p+j
o&2&&A.r(q)
if(!(d<q.length))return A.a(q,d)
q[d]=f
d=h.b
if(d!=null){c=a.f
c===$&&A.h()
B.a.m(c,j,d)}if(i!==B.i)if(i===B.j){d=n.h(0,j)
d.toString
d=a.de(j+1,d)===1
g=d}else g=!1
else g=!0
e=g?(f+1|1)>>>0:(f+2&4294967294)>>>0
if(e<=125&&m===0&&l===0){++k
B.a.j(s,new A.dA(e,null,!0))}else ++m
continue}if(B.r===i){if(m>0)--m
else if(k>0){while(!B.a.gE(s).c){if(0>=s.length)return A.a(s,-1)
s.pop()}if(0>=s.length)return A.a(s,-1)
s.pop();--k
l=0}b=B.a.gE(s)
f=p+j
o&2&&A.r(q)
if(!(f<q.length))return A.a(q,f)
q[f]=b.a
f=b.b
if(f!=null){d=a.f
d===$&&A.h()
B.a.m(d,j,f)}continue}if(B.z===i){if(m===0)if(l>0)--l
else if(!h.c&&s.length>=2){if(0>=s.length)return A.a(s,-1)
s.pop()}f=p+j
o&2&&A.r(q)
if(!(f<q.length))return A.a(q,f)
q[f]=h.a
continue}if(B.C===i){f=p+j
o&2&&A.r(q)
if(!(f<q.length))return A.a(q,f)
q[f]=a0
continue}if(B.A===i){f=p+j
o&2&&A.r(q)
if(!(f<q.length))return A.a(q,f)
q[f]=h.a
continue}f=p+j
o&2&&A.r(q)
if(!(f<q.length))return A.a(q,f)
q[f]=h.a
f=h.b
if(f!=null){d=a.f
d===$&&A.h()
B.a.m(d,j,f)}}},
hu(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a=t.fC,a0=A.b([],a)
for(s=b.e,r=b.d,q=b.b,p=r.length,o=t.X,n=null,m=-1,l=0;l<s.length;++l){k=s[l]
if(k===B.A||k===B.x||k===B.p||k===B.y||k===B.q||k===B.z)continue
if(n!=null){k=q+l
if(!(k<p))return A.a(r,k)
k=r[k]!==m}else k=!0
if(k){n=A.b([],o)
B.a.j(a0,n)
k=q+l
if(!(k<p))return A.a(r,k)
m=r[k]}B.a.j(n,l)}j=A.A(t.S,t.L)
for(r=a0.length,i=0;i<a0.length;a0.length===r||(0,A.i)(a0),++i){h=a0[i]
j.m(0,B.a.gt(h),h)}g=A.b([],a)
for(a=a0.length,r=b.w,q=b.x,i=0;i<a0.length;a0.length===a||(0,A.i)(a0),++i){h=a0[i]
p=B.a.gt(h)
if(!(p>=0&&p<s.length))return A.a(s,p)
if(s[p]===B.r&&q.u(0,B.a.gt(h)))continue
f=A.b([],o)
for(e=h;;e=c){B.a.v(f,e)
d=J.oP(e)
if(d>>>0!==d||d>=s.length)return A.a(s,d)
p=s[d]
if(!(p===B.m||p===B.i||p===B.j))break
p=r.h(0,d)
p.toString
c=p<s.length?j.h(0,p):null
if(c==null)break}B.a.j(g,f)}return g},
dw(a,b){var s,r=this,q=a+b,p=r.e,o=p.length
for(;;){if(!(q>=0&&q<o))break
if(!(q>=0&&q<o))return A.a(p,q)
s=p[q]
if(!(s===B.A||s===B.x||s===B.p||s===B.y||s===B.q||s===B.z)){p=r.d
o=r.b+q
if(!(o<p.length))return A.a(p,o)
return p[o]}q+=b}p=r.r
p===$&&A.h()
return p},
hn(a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this
t.L.a(a5)
s=J.Q(a5)
r=a4.d
q=a4.b
p=q+A.v(s.gt(a5))
o=r.length
if(!(p>=0&&p<o))return A.a(r,p)
n=r[p]
m=a4.dw(s.gt(a5),-1)
l=s.gE(a5)
p=a4.e
if(l>>>0!==l||l>=p.length)return A.a(p,l)
p=p[l]
if(p===B.m||p===B.i||p===B.j){p=a4.r
p===$&&A.h()
k=p}else k=a4.dw(l,1)
j=(Math.max(m,n)&1)===1?B.h:B.f
q+=l
if(!(q<o))return A.a(r,q)
i=(Math.max(k,r[q])&1)===1?B.h:B.f
r=A.b([],t.de)
for(q=s.gp(a5);q.l();){p=q.gn()
o=a4.f
o===$&&A.h()
if(p>>>0!==p||p>=o.length)return A.a(o,p)
r.push(o[p])}h=r.length
for(g=0;g<h;++g){q=r.length
if(!(g<q))return A.a(r,g)
if(r[g]!==B.ae)continue
if(g===0)B.a.m(r,g,j)
else{p=g-1
if(!(p>=0&&p<q))return A.a(r,p)
f=r[p]
B.a.m(r,g,f===B.m||f===B.i||f===B.j||f===B.r?B.I:f)}}for(e=j,g=0;g<h;++g){if(!(g<r.length))return A.a(r,g)
d=r[g]
if(d===B.f||d===B.h||d===B.F)e=d
else if(d===B.k&&e===B.F)B.a.m(r,g,B.J)}for(g=0;g<h;++g){if(!(g<r.length))return A.a(r,g)
if(r[g]===B.F)B.a.m(r,g,B.h)}for(q=h-1,g=1;g<q;g=c){p=g-1
o=r.length
if(!(p<o))return A.a(r,p)
f=r[p]
if(!(g<o))return A.a(r,g)
d=r[g]
c=g+1
if(!(c<o))return A.a(r,c)
b=r[c]
if(d===B.ac&&f===B.k&&b===B.k)B.a.m(r,g,B.k)
else{p=!1
if(d===B.ad)if(f===b)p=f===B.k||f===B.J
if(p)r[g]=f}}for(g=0;g<h;++g){q=r.length
if(!(g>=0&&g<q))return A.a(r,g)
if(r[g]!==B.Z)continue
a=g
for(;;){p=a<h
if(p){if(!(a<q))return A.a(r,a)
o=r[a]===B.Z}else o=!1
if(!o)break;++a}if(g>0){o=g-1
if(!(o<q))return A.a(r,o)
o=r[o]===B.k}else o=!1
if(!o)if(p){if(!(a<q))return A.a(r,a)
q=r[a]===B.k
a0=q}else a0=!1
else a0=!0
if(a0)B.a.ak(r,g,a,B.k)
g=a-1}for(g=0;g<h;++g){if(!(g<r.length))return A.a(r,g)
d=r[g]
if(d===B.ac||d===B.Z||d===B.ad)B.a.m(r,g,B.I)}for(e=j,g=0;g<h;++g){if(!(g<r.length))return A.a(r,g)
d=r[g]
if(d===B.f||d===B.h)e=d
else if(d===B.k&&e===B.f)B.a.m(r,g,B.f)}a1=(n&1)===1?B.h:B.f
a4.f5(a5,r,j,a1)
for(g=0;g<h;++g){q=r.length
if(!(g>=0&&g<q))return A.a(r,g)
p=r[g]
o=!0
if(p!==B.C)if(p!==B.N)if(p!==B.O)if(p!==B.I)p=p===B.m||p===B.i||p===B.j||p===B.r
else p=o
else p=o
else p=o
else p=o
if(!p)continue
a=g
for(;;){if(a<h){if(!(a<q))return A.a(r,a)
p=r[a]
o=!0
if(p!==B.C)if(p!==B.N)if(p!==B.O)if(p!==B.I)p=p===B.m||p===B.i||p===B.j||p===B.r
else p=o
else p=o
else p=o
else p=o}else p=!1
if(!p)break;++a}if(g===0)a2=j
else{p=g-1
if(!(p>=0&&p<q))return A.a(r,p)
a2=A.mk(r[p])}if(a===h)a3=i
else{if(!(a<q))return A.a(r,a)
a3=A.mk(r[a])}B.a.ak(r,g,a,a2==a3&&a2!=null?a2:a1)
g=a-1}for(g=0;g<h;++g){q=a4.f
q===$&&A.h()
p=s.h(a5,g)
if(!(g<r.length))return A.a(r,g)
B.a.m(q,p,r[g])}},
f5(a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5
t.L.a(a6)
t.fc.a(a7)
s=t.B
r=A.b([],s)
q=A.b([],s)
for(s=J.n(a6),p=this.a,o=this.b,n=J.n(p),m=q.$flags|0,l=0;l<s.gk(a6);++l){if(!(l<a7.length))return A.a(a7,l)
if(a7[l]!==B.I)continue
k=A.f7(B.V,3,n.h(p,o+s.h(a6,l)))
if(k<0)j=null
else{i=k+1
if(!(i<384))return A.a(B.V,i)
i=B.V[i]
h=k+2
if(!(h<384))return A.a(B.V,h)
j=new A.e(i,B.V[h]===0)}if(j==null)continue
g=j.a
if(j.b){if(q.length===63)break
B.a.j(q,new A.e(A.r2(g),l))
continue}f=A.r2(n.h(p,o+s.h(a6,l)))
for(e=q.length-1;e>=0;--e){i=q[e]
if(i.a!==f)continue
B.a.j(r,new A.e(i.b,l))
i=q.length
m&1&&A.r(q,18)
A.aw(e,i,i)
q.splice(e,i-e)
break}}B.a.aD(r,new A.lk())
d=a9===B.f?B.h:B.f
for(p=r.length,o=this.e,c=0;c<r.length;r.length===p||(0,A.i)(r),++c){n=r[c]
b=n.a
a=n.b
l=b+1
n=a7.length
a1=!1
for(;;){if(!(l<a)){a0=!1
break}if(!(l>=0&&l<n))return A.a(a7,l)
e=A.mk(a7[l])
if(e===a9){a0=!0
break}if(e===d)a1=!0;++l}if(a0)a2=a9
else if(a1){l=b-1
for(;;){if(!(l>=0)){a3=a8
break}if(!(l<n))return A.a(a7,l)
e=A.mk(a7[l])
if(e!=null){a3=e
break}--l}a2=a3===d?d:a9}else a2=null
if(a2==null)continue
for(n=[b,a],i=n.length,a4=0;a4<i;++a4){l=n[a4]
B.a.m(a7,l,a2)
for(a5=l+1;a5<s.gk(a6);++a5){h=s.h(a6,a5)
if(!(h>=0&&h<o.length))return A.a(o,h)
if(o[h]!==B.ae)break
B.a.m(a7,a5,a2)}}}},
fO(){var s,r,q,p,o,n,m,l,k,j,i,h=this
for(s=h.e,r=s.length,q=h.d,p=h.b,o=q.length,n=h.f,m=q.$flags|0,l=0;l<r;++l){k=s[l]
if(k===B.A||k===B.x||k===B.p||k===B.y||k===B.q||k===B.z)continue
k=p+l
if(!(k<o))return A.a(q,k)
j=q[k]
n===$&&A.h()
if(!(l<n.length))return A.a(n,l)
i=n[l]
if((j&1)===0){if(i===B.h){m&2&&A.r(q)
q[k]=j+1}else if(i===B.J||i===B.k){m&2&&A.r(q)
q[k]=j+2}}else if(i===B.f||i===B.k||i===B.J){m&2&&A.r(q)
q[k]=j+1}}},
hL(){var s,r,q,p,o,n,m,l,k,j,i,h,g=this
for(s=g.e,r=s.length,q=r-1,p=g.r,o=g.d,n=g.b,m=o.$flags|0,l=!0;q>=0;--q){k=s[q]
if(k===B.C||k===B.N){p===$&&A.h()
j=n+q
m&2&&A.r(o)
if(!(j<o.length))return A.a(o,j)
o[j]=p
l=!0}else{if(k!==B.O)j=k===B.m||k===B.i||k===B.j||k===B.r||k===B.A||k===B.x||k===B.p||k===B.y||k===B.q||k===B.z
else j=!0
if(j){if(l){p===$&&A.h()
j=n+q
m&2&&A.r(o)
if(!(j<o.length))return A.a(o,j)
o[j]=p}}else l=!1}}for(j=o.length,q=0;q<r;++q){i=s[q]
if(i===B.A||i===B.x||i===B.p||i===B.y||i===B.q||i===B.z){if(q===0){p===$&&A.h()
i=p}else{i=n+(q-1)
if(!(i>=0&&i<j))return A.a(o,i)
i=o[i]}h=n+q
m&2&&A.r(o)
if(!(h<j))return A.a(o,h)
o[h]=i}}},
j0(){var s,r,q,p,o,n,m=A.b([],t.X)
for(s=this.e,r=this.d,q=this.b,p=r.length,o=0;o<s.length;++o){n=q+o
if(!(n<p))return A.a(r,n)
m.push(r[n])}return A.rC(m,q)}}
A.lk.prototype={
$2(a,b){var s=t.gn
return s.a(a).a-s.a(b).a},
$S:68}
A.cR.prototype={}
A.aT.prototype={
gcz(){var s=this.z
return s>0&&this.d===2?s:1}}
A.dE.prototype={
ap(){return"_Skip."+this.b}}
A.j5.prototype={
e1(a,b,c,d){var s,r,q,p=this
p.d=p.b.eq(a)
p.e=b
p.f=c
p.r=d
if(!p.gaV()&&p.d.a===8){for(s=p.c,r=p.w=s.length-1;r>=0;r=--p.w){if(!(r<s.length))return A.a(s,r)
r=s[r]
if((r.c&p.e)>>>0!==0&&!p.em(r))p.bV()}return}p.w=0
for(s=p.c;r=p.w,q=s.length,r<q;){if(!(r>=0))return A.a(s,r)
r=s[r]
if((r.c&p.e)>>>0!==0&&!p.em(r)&&p.bV())continue;++p.w}},
bV(){var s,r,q,p=this.d
p===$&&A.h()
p=p.d
s=p.length
r=0
for(;r<p.length;p.length===s||(0,A.i)(p),++r){q=p[r]
if(this.e2(this.d.a,q))return!0}return!1},
cH(a,b){var s,r,q,p
if(b==null){s=this.d
s===$&&A.h()
r=s.b}else r=b
switch(a.d){case 1:return(r&2)!==0
case 2:return(r&4)!==0
case 3:if((r&8)!==0)return!0
if((r&16)!==0){s=this.a.a.y
s===$&&A.h()
if(s==null)s=null
else{q=this.d
q===$&&A.h()
q=s.ip(q.c,a.b)
s=q}return s!==!0}p=r>>>8
return p!==0&&p!==a.e}return!1},
em(a){return this.cH(a,null)},
dS(a,b,c){var s,r,q,p,o=this
if(o.cH(a,c))return B.aw
if(!o.gaV())s=b&&o.r
else s=!0
r=o.gaV()||b||o.f
q=!1
if(a.Q)if(!a.f)if(s||a.a!==8204)if(r||a.a!==8205)if(!o.gaV()){q=a.a
p=!0
if(q!==847)if(!(q>=6155&&q<=6157))if(q!==6159)q=q>=917536&&q<=917631
else q=p
else q=p
else q=p
q=!q}else q=!0
if(q)return B.f_
return B.ax},
bo(a,b,c,d,e){var s,r,q,p,o,n,m,l
t.i7.a(e)
s=a+b
r=e==null
q=!c
p=this.c
for(;;){if(!(s>=0&&s<p.length))break
A:{if(!(s>=0&&s<p.length))return A.a(p,s)
o=p[s]
n=this.dS(o,c,d)
if(n===B.aw)break A
if(!(!q||(o.c&this.e)>>>0!==0))m=!1
else m=r?null:e.$1(o)
if(m!==!0)l=m==null&&n===B.ax
else l=!0
if(l)return s
if(n===B.ax)return null}s+=b}return null},
bn(a,b,c,d){return this.bo(a,b,c,null,d)},
eP(a,b,c){return this.bo(a,b,!1,null,c)},
eO(a,b,c){return this.bo(a,b,!1,c,null)},
cY(a,b){return this.bo(a,b,!1,null,null)},
cJ(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=null
t.jP.a(b)
s=A.b([e.w],t.X)
r=e.c
q=e.w
if(!(q>=0&&q<r.length))return A.a(r,q)
p=r[q]
o=p.x
n=p.z>0?0:p.y
m=p.gcz()
for(l=o!==0,k=n!==0,j=q,i=d,h=1;h<a;++h,j=g){g=e.eP(j,1,new A.jj(b,h))
if(g==null)return d
B.a.j(s,g)
if(g>>>0!==g||g>=r.length)return A.a(r,g)
f=r[g]
if(l&&k){if(o===f.x)q=n!==(f.z>0?0:f.y)
else q=!0
if(q){if(i==null)i=e.fU(o)
if(!i)return d}}else{q=f.x
if(q!==0)q=(f.z>0?0:f.y)!==0&&q!==o
else q=!1
if(q)return d}q=f.z
m+=q>0&&f.d===2?q:1}return new A.e(s,m)},
fU(a){var s,r=this.w-1,q=this.c,p=q.length
for(;;){if(r>=0){if(!(r<p))return A.a(q,r)
s=q[r].x===a}else s=!1
if(!s)break
if(!(r>=0&&r<p))return A.a(q,r)
s=q[r]
if((s.z>0?0:s.y)===0)return this.dS(s,!1,null)===B.aw;--r}return!1},
du(a,b){var s,r,q
t.jP.a(b)
s=this.w
for(r=0;r<a;++r,s=q){q=this.bn(s,-1,!0,new A.jb(b,r))
if(q==null)return!1}return!0},
dt(a,b,c){var s,r,q
t.jP.a(c)
for(s=a,r=0;r<b;++r,s=q){q=this.bn(s,1,!0,new A.ja(c,r))
if(q==null)return!1}return!0},
bG(a,b){var s,r,q,p,o,n,m,l,k,j=this,i=j.c,h=j.w
if(!(h>=0&&h<i.length))return A.a(i,h)
s=i[h]
i=j.a.a.a
switch(i.getUint16(a,!1)){case 1:r=A.aE(i,a+i.getUint16(a+2,!1),s.b)
if(r<0||r>=i.getUint16(a+4,!1))return!1
q=i.getUint16(a+6+r*2,!1)
if(q===0)return!1
p=a+q
for(h=p+2,o=0;o<i.getUint16(p,!1);++o){n=new A.ji(j)
if(j.dO(p+i.getUint16(h+o*2,!1),b,n,n,n))return!0}return!1
case 2:m={}
if(A.aE(i,a+i.getUint16(a+2,!1),s.b)<0)return!1
m.a=m.b=m.c=null
h=a+4
l=a+6
if(b){m.c=a+i.getUint16(h,!1)
h=m.b=a+i.getUint16(l,!1)
m.a=a+i.getUint16(a+8,!1)
l=a+10}else h=m.c=m.a=m.b=a+i.getUint16(h,!1)
k=A.c3(i,h,s.b)
if(k>=i.getUint16(l,!1))return!1
q=i.getUint16(l+2+k*2,!1)
if(q===0)return!1
p=a+q
for(h=p+2,o=0;o<i.getUint16(p,!1);++o)if(j.dO(p+i.getUint16(h+o*2,!1),b,new A.jf(m,j),new A.jg(m,j),new A.jh(m,j)))return!0
return!1
case 3:return j.fn(a,b)}return!1},
dO(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i=this,h={},g=t.jP
g.a(c)
g.a(d)
g.a(e)
h.a=h.b=0
h.c=null
s=a+2
g=i.a.a
if(b){g=g.a
r=g.getUint16(a,!1)
h.b=s
q=a+(2+r*2)
p=g.getUint16(q,!1)
h.c=q+2
q+=2+Math.max(0,p-1)*2
o=g.getUint16(q,!1)
h.a=q+2
q+=2+o*2
n=g.getUint16(q,!1)
m=q+2}else{g=g.a
p=g.getUint16(a,!1)
n=g.getUint16(s,!1)
l=a+4
h.c=l
m=l+Math.max(0,p-1)*2
r=0
o=0}if(p===0)return!1
k=i.cJ(p,new A.jc(h,d))
if(k==null)return!1
j=k.a
if(!i.du(r,new A.jd(h,c)))return!1
if(!i.dt(B.a.gE(j),o,new A.je(h,e)))return!1
i.d2(j,m,n)
return!0},
fn(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e={},d=a+2
e.a=0
if(b){s=f.a.a.a.getUint16(d,!1)
e.a=d+2
r=d+(2+s*2)}else{r=d
s=0}q=f.a.a.a
p=q.getUint16(b?r:d,!1)
e.b=null
if(b){o=e.b=r+2
d=r+(2+p*2)}else{o=e.b=a+6
d=r}if(p===0)return!1
n=new A.j9(f,a)
m=f.c
l=f.w
if(!(l>=0&&l<m.length))return A.a(m,l)
if(!n.$2(m[l],o))return!1
k=e.c=0
if(b){k=q.getUint16(d,!1)
e.c=d+2
d+=2+k*2
j=q.getUint16(d,!1)
i=d+2}else{j=q.getUint16(a+4,!1)
i=o+p*2}h=f.cJ(p,new A.j6(e,n))
if(h==null)return!1
g=h.a
if(!f.du(s,new A.j7(e,n)))return!1
if(!f.dt(B.a.gE(g),k,new A.j8(e,n)))return!1
f.d2(g,i,j)
return!0},
d2(a,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
t.L.a(a)
s=B.a.gE(a)+1
for(r=a.$flags|0,q=b.c,p=b.a.a.a,o=t.S,n=0;n<a1;++n){m=a0+n*4
l=p.getUint16(m,!1)
k=p.getUint16(m+2,!1)
if(l>=a.length)continue
j=q.length
m=a[l]
if(m>=j)continue
b.w=m
if(!b.hg(k))continue
i=q.length-j
if(i===0)continue
s+=i
m=a.length
if(!(l<m))return A.a(a,l)
h=a[l]
if(s<h){i+=h-s
s=h}g=l+1
if(i>0){B.a.en(a,g,A.a9(i,0,!1,o))
for(f=g+i,e=g;e<f;++e){m=e-1
if(!(m<a.length))return A.a(a,m)
B.a.m(a,e,a[m]+1)}for(;f<a.length;++f)B.a.m(a,f,a[f]+i)}else{d=Math.min(-i,m-g)
c=g+d
r&1&&A.r(a,18)
A.aw(g,c,m)
a.splice(g,c-g)
for(f=g;f<a.length;++f)B.a.m(a,f,a[f]-d)}}b.w=s},
hg(a){var s,r,q=this
if(q.x<64){r=q.b
r=a>=r.a.getUint16(r.f,!1)}else r=!0
if(r)return!1
r=q.d
r===$&&A.h()
s=r
q.d=q.b.eq(a);++q.x
try{if(!q.gaV()&&q.d.a===8)return!1
r=q.bV()
return r}finally{--q.x
q.d=t.n7.a(s)}}}
A.jj.prototype={
$1(a){return this.a.$2(a,this.b)},
$S:10}
A.jb.prototype={
$1(a){return this.a.$2(a,this.b)},
$S:10}
A.ja.prototype={
$1(a){return this.a.$2(a,this.b)},
$S:10}
A.ji.prototype={
$2(a,b){return a.b===this.a.a.a.a.getUint16(b,!1)},
$S:4}
A.jf.prototype={
$2(a,b){var s=this.b.a.a.a
return A.c3(s,this.a.c,a.b)===s.getUint16(b,!1)},
$S:4}
A.jg.prototype={
$2(a,b){var s=this.b.a.a.a
return A.c3(s,this.a.b,a.b)===s.getUint16(b,!1)},
$S:4}
A.jh.prototype={
$2(a,b){var s=this.b.a.a.a
return A.c3(s,this.a.a,a.b)===s.getUint16(b,!1)},
$S:4}
A.jc.prototype={
$2(a,b){return this.b.$2(a,this.a.c+(b-1)*2)},
$S:4}
A.jd.prototype={
$2(a,b){return this.b.$2(a,this.a.b+b*2)},
$S:4}
A.je.prototype={
$2(a,b){return this.b.$2(a,this.a.a+b*2)},
$S:4}
A.j9.prototype={
$2(a,b){var s=this.a.a.a.a
return A.aE(s,this.b+s.getUint16(b,!1),a.b)>=0},
$S:4}
A.j6.prototype={
$2(a,b){return this.b.$2(a,this.a.b+b*2)},
$S:4}
A.j7.prototype={
$2(a,b){return this.b.$2(a,this.a.a+b*2)},
$S:4}
A.j8.prototype={
$2(a,b){return this.b.$2(a,this.a.c+b*2)},
$S:4}
A.ik.prototype={
aF(a){var s=this.b.h(0,a)
return s==null?A.aF(A.de("Font has no "+a+" table",null,null)):s},
hU(a,b){var s,r,q,p=this.r
p===$&&A.h()
s=p.aR(a)
if(b.length===0)return s
r=this.at
if(r==null)return p.j_(a,b)
p=this.ax
q=p==null?null:p.h(0,a)
if(q==null)q=new A.e(0,a)
return s+B.c.M(r.eh(q.a,q.b,b))}}
A.dd.prototype={
j2(a){var s,r,q
t.eM.a(a)
s=this.a
r=s.w
r===$&&A.h()
if(r==null)return this
q=r.iD(a)
if(B.v.a4(q,new A.il()))r=new Float64Array(0)
else r=q
return A.ub(s,r)},
aR(a){var s,r=this.c,q=r.length
if(a>=q)return 0
if(!(a>=0))return A.a(r,a)
s=r[a]
if(s>=0)return s
q=this.a.hU(a,this.b)
r.$flags&2&&A.r(r)
r[a]=q
return q}}
A.il.prototype={
$1(a){return A.ct(a)===0},
$S:22}
A.l1.prototype={
eT(a,b){var s,r,q,p,o,n,m=this,l=m.a,k=l.getUint16(b+2,!1),j=A.A(t.gn,t.S)
for(s=b+4,r=0;r<k;++r){q=s+r*8
j.m(0,new A.e(l.getUint16(q,!1),l.getUint16(q+2,!1)),b+l.getUint32(q+4,!1))}for(p=0;p<9;++p){o=B.bU[p]
n=j.h(0,o)
if(n==null||!B.a.u(B.bB,l.getUint16(n,!1)))continue
m.b=n
m.d=o.$s===B.aT.$s&&J.l(o.a,3)&&J.l(o.b,0)
break}m.c=j.h(0,B.cH)},
a9(a){var s,r=this,q=r.b
if(q==null)return 0
s=r.ds(q,a)
if(s===0&&r.d&&a<=255)return r.ds(q,61440+a)
return s},
ds(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this.a
switch(b.getUint16(a,!1)){case 0:return a0<256?b.getUint8(a+6+a0):0
case 4:if(a0>65535)return 0
s=b.getUint16(a+6,!1)/2|0
r=a+14
q=s*2
p=r+q+2
o=p+q
n=s-1
for(m=0;m<=n;){l=B.b.I(m+n,1)
k=l*2
if(a0>b.getUint16(r+k,!1)){m=l+1
continue}j=b.getUint16(p+k,!1)
if(a0<j){n=l-1
continue}i=b.getUint16(o+k,!1)
k=o+q+k
h=b.getUint16(k,!1)
if(h===0)return a0+i&65535
g=b.getUint16(k+h+(a0-j)*2,!1)
return g===0?0:g+i&65535}return 0
case 6:f=b.getUint16(a+6,!1)
e=b.getUint16(a+8,!1)
d=a0-f
return d>=0&&d<e?b.getUint16(a+10+d*2,!1):0
case 12:n=b.getUint32(a+12,!1)-1
for(q=a+16,m=0;m<=n;){l=B.b.I(m+n,1)
c=q+l*12
if(a0<b.getUint32(c,!1))n=l-1
else if(a0>b.getUint32(c+4,!1))m=l+1
else return b.getUint32(c+8,!1)+a0-b.getUint32(c,!1)}return 0}return 0},
iZ(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=null,b=this.c
if(b==null)return c
s=this.a
r=s.getUint32(b+6,!1)
for(q=b+10,p=0;p<r;++p){o=q+p*11
if((s.getUint16(o,!1)<<8|s.getUint8(o+2))>>>0!==a0)continue
n=s.getUint32(o+3,!1)
m=s.getUint32(o+7,!1)
if(m!==0){l=b+m
k=s.getUint32(l,!1)-1
for(q=l+4,j=0;j<=k;){i=B.b.I(j+k,1)
h=q+i*5
g=(s.getUint16(h,!1)<<8|s.getUint8(h+2))>>>0
if(a<g)k=i-1
else if(a>g)j=i+1
else return s.getUint16(h+3,!1)}}if(n!==0){l=b+n
for(q=l+4,f=0;f<s.getUint32(l,!1);++f){h=q+f*4
e=(s.getUint16(h,!1)<<8|s.getUint8(h+2))>>>0
if(a>=e&&a<=e+s.getUint8(h+3)){d=this.a9(a)
return d===0?c:d}}}return c}return c}}
A.fA.prototype={
j1(a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=this,a3={},a4=t.gJ
a4.a(a6)
a4.a(a5)
t.cE.a(a7)
a3.a=0
for(a4=a2.c,s=a4.length,r=0,q=0;r<s;++r,q=a1){p=a4[r]
o=p-q+1
if(o>=2){n=new A.iw(a3,a2,o)
m=new A.ix(a3,a2,o)
l=new A.iv(a3,a2,o)
k=0
for(;;){q=k<o
if(!(q&&!l.$1(k)))break;++k}if(q){j=n.$1(k)
i=m.$1(k)}else{k=o-1
q=n.$1(k)
h=n.$1(0)
if(typeof q!=="number")return q.af()
if(typeof h!=="number")return A.a6(h)
j=(q+h)/2
h=m.$1(k)
q=m.$1(0)
if(typeof h!=="number")return h.af()
if(typeof q!=="number")return A.a6(q)
i=(h+q)/2}a6.$2(j,i)
g=l.$1(k)?o:o+1
for(f=!1,e=0,d=0,c=1;c<=g;++c){b=c===g
a=b?j:n.$1(k+c)
a0=b?i:m.$1(k+c)
if(b||l.$1(k+c)){if(f)a7.$4(e,d,a,a0)
else a5.$2(a,a0)
f=!1}else{if(f)a7.$4(e,d,(e+a)/2,(d+a0)/2)
d=a0
e=a
f=!0}}}a1=p+1
a3.a=a1}}}
A.iw.prototype={
$1(a){var s=this.b.a,r=(this.a.a+B.b.P(a,this.c))*2
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
$S:6}
A.ix.prototype={
$1(a){var s=this.b.a,r=(this.a.a+B.b.P(a,this.c))*2+1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
$S:6}
A.iv.prototype={
$1(a){var s=this.b.b,r=this.a.a+B.b.P(a,this.c)
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]!==0},
$S:15}
A.dB.prototype={}
A.iE.prototype={
aR(a){return this.a.getUint16(this.f+Math.min(a,this.r-1)*4,!1)},
dl(a){var s=this.r,r=this.a,q=this.f
return a<s?r.getInt16(q+a*4+2,!1):r.getInt16(q+s*4+(a-s)*2,!1)},
es(a,b){var s,r,q,p,o,n,m,l,k,j,i,h
if(a>=this.c)return null
s=this.cb(a,b,0)
r=-s.e[0]
q=s.a
p=q.length
o=p*2
n=new Float64Array(o)
for(m=s.b,l=m.length,k=0;k<p;++k){j=k*2
i=q[k]
if(!(j<o))return A.a(n,j)
n[j]=i+r;++j
if(!(k<l))return A.a(m,k)
i=m[k]
if(!(j<o))return A.a(n,j)
n[j]=i}q=A.b([],t.X)
for(p=s.c,o=p.length,h=0;h<p.length;p.length===o||(0,A.i)(p),++h)q.push(p[h]?1:0)
return new A.fA(n,new Uint8Array(A.N(q)),new Uint16Array(A.N(s.d)))},
i8(a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this
if(a0>=a.c)return B.ar
s=a.dI(a0)
r=s.a
if(s.b<=r)return B.ar
if(a1.length===0){q=a.e+r
p=a.a
o=p.getInt16(q+2,!1)
n=p.getInt16(q+4,!1)
m=p.getInt16(q+6,!1)
l=p.getInt16(q+8,!1)
return new A.bu([a.dl(a0),Math.max(n,l),Math.abs(m-o),-Math.abs(l-n)])}k=a.es(a0,a1)
if(k.c.length===0)return B.ar
j=k.a
p=j.length
if(0>=p)return A.a(j,0)
i=j[0]
if(1>=p)return A.a(j,1)
h=j[1]
for(g=h,f=i,e=2;e<p;e+=2){d=j[e]
i=Math.min(i,d)
f=Math.max(f,d)
d=e+1
if(!(d<p))return A.a(j,d)
d=j[d]
h=Math.min(h,d)
g=Math.max(g,d)}c=B.c.L(i)
b=B.c.L(g)
return new A.bu([c,b,B.c.L(f-c),B.c.L(h-b)])},
j_(a,b){var s
if(a>=this.c)return 0
s=this.cb(a,b,0).e
return Math.max(0,B.c.M(s[2]-s[0]))},
dI(a){var s=this.a,r=this.d
if(this.b){r+=a*4
r=new A.e(s.getUint32(r,!1),s.getUint32(r+4,!1))
s=r}else{r+=a*2
r=new A.e(s.getUint16(r,!1)*2,s.getUint16(r+2,!1)*2)
s=r}return s},
cb(a,b,c){var s,r,q,p=this,o=p.dI(a),n=o.a,m=p.e+n,l=o.b<=n,k=l?0:p.a.getInt16(m+2,!1),j=k-p.dl(a),i=new Float64Array(8)
i[0]=j
i[2]=j+p.aR(a)
if(l){s=t.n
r=new A.dB(A.b([],s),A.b([],s),A.b([],t.d),A.b([],t.X),i)
p.cr(a,b,r,null)
return r}q=p.a.getInt16(m,!1)
return q>=0?p.hz(a,m,q,b,i):p.fj(a,m,b,i,c)},
hz(a,b,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=A.b([],t.X)
for(s=this.a,r=b+10,q=0;q<a0;++q)c.push(s.getUint16(r+q*2,!1))
p=c.length===0?0:B.a.gE(c)+1
o=r+a0*2
o+=2+s.getUint16(o,!1)
n=new Uint8Array(p)
for(q=0;q<p;){m=o+1
l=s.getUint8(o)
k=q+1
if(!(q>=0&&q<p))return A.a(n,q)
n[q]=l
if((l&8)!==0){o=m+1
j=s.getUint8(m)
q=k
for(;;){if(!(j>0&&q<p))break
k=q+1
if(!(q>=0&&q<p))return A.a(n,q)
n[q]=l;--j
q=k}}else{q=k
o=m}}r=t.i
i=A.a9(p,0,!1,r)
h=A.a9(p,0,!1,r)
for(g=0,q=0;q<p;++q){if(!(q<p))return A.a(n,q)
l=n[q]
if((l&2)!==0){m=o+1
f=s.getUint8(o)
g+=(l&16)!==0?f:-f
o=m}else if((l&16)===0){g+=s.getInt16(o,!1)
o+=2}B.a.m(i,q,g)}for(g=0,q=0;q<p;++q){if(!(q<p))return A.a(n,q)
l=n[q]
if((l&4)!==0){m=o+1
f=s.getUint8(o)
g+=(l&32)!==0?f:-f
o=m}else if((l&32)===0){g+=s.getInt16(o,!1)
o+=2}B.a.m(h,q,g)}s=A.b([],t.d)
for(e=0;e<p;++e)s.push((n[e]&1)!==0)
d=new A.dB(i,h,s,c,a2)
this.cr(a,a1,d,c)
return d},
fj(b8,b9,c0,c1,c2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6=A.b([],t.o5),b7=b9+10
for(s=this.a;;){r=s.getUint16(b7,!1)
q=s.getUint16(b7+2,!1)
b7+=4
p=(r&2)!==0
if((r&1)!==0){o=p?s.getInt16(b7,!1):s.getUint16(b7,!1)
n=b7+2
m=p?s.getInt16(n,!1):s.getUint16(n,!1)
b7+=4}else{o=p?s.getInt8(b7):s.getUint8(b7)
n=b7+1
m=p?s.getInt8(n):s.getUint8(n)
b7+=2}l=0
k=0
if((r&8)!==0){j=s.getInt16(b7,!1)/16384
b7+=2
i=j}else if((r&64)!==0){i=s.getInt16(b7,!1)/16384
j=s.getInt16(b7+2,!1)/16384
b7+=4}else if((r&128)!==0){i=s.getInt16(b7,!1)/16384
l=s.getInt16(b7+2,!1)/16384
k=s.getInt16(b7+4,!1)/16384
j=s.getInt16(b7+6,!1)/16384
b7+=8}else{i=1
j=1}B.a.j(b6,new A.eR([i,o,m,l,k,j,r,q]))
if((r&32)===0)break}s=t.n
n=A.b([],s)
for(h=b6.length,g=0;g<b6.length;b6.length===h||(0,A.i)(b6),++g){f=b6[g].a
n.push((f[6]&2)!==0?f[1]:0)}h=A.b([],s)
for(f=b6.length,g=0;g<b6.length;b6.length===f||(0,A.i)(b6),++g){e=b6[g].a
h.push((e[6]&2)!==0?e[2]:0)}f=t.d
e=t.X
this.cr(b8,c0,new A.dB(n,h,A.b([],f),A.b([],e),c1),null)
d=A.b([],s)
s=A.b([],s)
f=A.b([],f)
e=A.b([],e)
c=new A.dB(d,s,f,e,c1)
if(c2>8)return c
for(b=A.oT(b6,0,t.aI),a=J.B(b.a),a0=b.b,b=new A.ba(a,a0,A.q(b).i("ba<1>")),a1=c2+1;b.l();){a2=b.c
a2=a2>=0?new A.e(a0+a2,a.gn()):A.aF(A.ae())
a3=a2.a
a2=a2.b.a
a4=this.cb(a2[7],c0,a1)
a5=d.length
for(a6=a4.a,a7=a4.b,a8=0;a8<a6.length;++a8){a9=a6[a8]
if(!(a8<a7.length))return A.a(a7,a8)
b0=a7[a8]
B.a.j(d,a2[0]*a9+a2[4]*b0)
B.a.j(s,a2[3]*a9+a2[5]*b0)}B.a.v(f,a4.c)
for(a6=a4.d,a7=a6.length,g=0;g<a6.length;a6.length===a7||(0,A.i)(a6),++g)B.a.j(e,a5+a6[g])
a6=a2[6]
if((a6&2)!==0){if(!(a3>=0&&a3<n.length))return A.a(n,a3)
b1=n[a3]
if(!(a3<h.length))return A.a(h,a3)
b2=h[a3]
if((a6&2048)!==0&&(a6&4096)===0){b3=a2[0]*b1+a2[4]*b2
b2=a2[3]*b1+a2[5]*b2
b1=b3}if((a6&4)!==0){b1=B.c.L(b1)
b2=B.c.L(b2)}}else{b4=a2[1]
b5=a5+a2[2]
if(b4>=a5||b5>=d.length){b1=0
b2=0}else{a6=d.length
if(!(b4>=0&&b4<a6))return A.a(d,b4)
a7=d[b4]
if(!(b5>=0&&b5<a6))return A.a(d,b5)
b1=a7-d[b5]
a7=s.length
if(!(b4<a7))return A.a(s,b4)
a6=s[b4]
if(!(b5<a7))return A.a(s,b5)
b2=a6-s[b5]}}for(a8=a5;a8<d.length;++a8){B.a.m(d,a8,d[a8]+b1)
if(!(a8<s.length))return A.a(s,a8)
B.a.m(s,a8,s[a8]+b2)}if((a2[6]&512)!==0)B.v.bR(c1,0,a4.e)}return c},
cr(c6,c7,c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4=this,c5=null
t.f8.a(c9)
s=c4.w
if(s==null||c7.length===0)return
r=c4.a
q=r.getUint16(s+4,!1)
if(q!==c7.length||c6>=r.getUint16(s+12,!1))return
p=(r.getUint16(s+14,!1)&1)!==0
o=s+20
n=p?r.getUint32(o+c6*4,!1):r.getUint16(o+c6*2,!1)*2
if((p?r.getUint32(o+c6*4+4,!1):r.getUint16(o+c6*2+2,!1)*2)<=n)return
m=s+r.getUint32(s+16,!1)+n
l=s+r.getUint32(s+8,!1)
k=c8.a
j=k.length
i=j+4
h=t.i
g=A.W(k,h)
f=A.W(c8.b,h)
e=r.getUint16(m,!1)
d=m+r.getUint16(m+2,!1)
if((e&32768)!==0){c=c4.dK(d)
b=c.a
d=c.b}else b=c5
a=m+4
for(k=e&4095,h=c9!=null,a0=t.y,a1=q*2,a2=q*4,a3=0;a3<k;++a3,d=b1){a4={}
a5=r.getUint16(a,!1)
a6=r.getUint16(a+2,!1)
a+=4
a4.a=null
if((a6&32768)!==0){a4.a=a
a+=a1}else a4.a=l+(a6&4095)*q*2
a4.b=a4.c=null
if((a6&16384)!==0){a4.c=a
a7=a4.b=a+a1
a8=a+a2
a9=a7
a7=a
a=a8}else{a9=c5
a7=a9}a7=a7==null?c5:new A.iF(a4,c4)
a9=a9==null?c5:new A.iG(a4,c4)
b0=A.t4(c7,new A.iH(a4,c4),a7,a9)
b1=d+a5
if(b0===0)continue
if((a6&8192)!==0){b2=c4.dK(d)
b3=b2.a
b4=b2.b}else{b3=b
b4=d}a7=b3==null
b5=a7?c5:b3.length
if(b5==null)b5=i
b6=c4.dJ(b4,b5)
b7=b6.a
b8=c4.dJ(b6.b,b5).a
if(a7){for(b9=0;b9<i;++b9){if(!(b9<b7.length))return A.a(b7,b9)
a7=b7[b9]
if(!(b9<b8.length))return A.a(b8,b9)
A.qg(c8,j,b9,a7*b0,b8[b9]*b0)}continue}c0=new Float64Array(i)
c1=new Float64Array(i)
c2=A.a9(i,!1,!1,a0)
for(c3=0;c3<b3.length;++c3){b9=b3[c3]
if(b9>=i)continue
if(!(b9>=0))return A.a(c0,b9)
a7=c0[b9]
if(!(c3<b7.length))return A.a(b7,c3)
a9=b7[c3]
if(!(b9<i))return A.a(c0,b9)
c0[b9]=a7+a9
a9=c1[b9]
if(!(c3<b8.length))return A.a(b8,c3)
a7=b8[c3]
if(!(b9<i))return A.a(c1,b9)
c1[b9]=a9+a7
B.a.m(c2,b9,!0)}if(h)A.uh(g,f,c9,c0,c1,c2)
for(b9=0;b9<i;++b9){a7=c0[b9]
if(a7!==0||c1[b9]!==0)A.qg(c8,j,b9,a7*b0,c1[b9]*b0)}}},
dK(a){var s,r,q,p,o,n=this.a,m=a+1,l=n.getUint8(a)
if(l===0)return new A.e(null,m)
if((l&128)!==0){a=m+1
l=((l&127)<<8|n.getUint8(m))>>>0}else a=m
s=A.b([],t.X)
for(r=0;s.length<l;){m=a+1
q=n.getUint8(a)
p=(q&128)!==0
o=(q&127)+1
a=m
for(;;){if(!(o>0&&s.length<l))break
r+=p?n.getUint16(a,!1):n.getUint8(a)
a+=p?2:1
B.a.j(s,r);--o}}return new A.e(s,a)},
dJ(a,b){var s,r,q,p,o,n,m,l=A.b([],t.X)
for(s=this.a;l.length<b;){r=a+1
q=s.getUint8(a)
p=(q&63)+1
o=(q&64)!==0
n=(q&128)!==0
a=r
m=0
for(;;){if(!(m<p&&l.length<b))break
if(n)B.a.j(l,0)
else if(o){B.a.j(l,s.getInt16(a,!1))
a+=2}else{B.a.j(l,s.getInt8(a));++a}++m}}return new A.e(l,a)}}
A.iH.prototype={
$1(a){return this.b.a.getInt16(this.a.a+a*2,!1)/16384},
$S:6}
A.iF.prototype={
$1(a){var s=this.a.c
s.toString
return this.b.a.getInt16(s+a*2,!1)/16384},
$S:6}
A.iG.prototype={
$1(a){var s=this.a.b
s.toString
return this.b.a.getInt16(s+a*2,!1)/16384},
$S:6}
A.jI.prototype={
gaV(){return!0},
e2(a,b){var s,r=this
switch(a){case 1:s=r.hA(b)
break
case 2:s=r.fL(b)
break
case 3:s=r.fp(b)
break
case 4:s=r.fY(b)
break
case 5:s=r.fZ(b)
break
case 6:s=r.h_(b)
break
case 7:s=r.bG(b,!1)
break
case 8:s=r.bG(b,!0)
break
default:s=!1
break}return s},
aP(a,b,c,d){var s,r,q,p={}
p.a=c
s=new A.jK(p,this)
p=new A.jJ(p,this,d)
if((b&1)!==0){r=a.cx
q=s.$0()
if(typeof q!=="number")return A.a6(q)
a.cx=r+q}if((b&2)!==0){r=a.cy
q=s.$0()
if(typeof q!=="number")return A.a6(q)
a.cy=r+q}if((b&4)!==0){r=a.ch
q=s.$0()
if(typeof q!=="number")return A.a6(q)
a.ch=r+q}if((b&8)!==0)s.$0()
if((b&16)!==0){s=a.cx
r=p.$0()
if(typeof r!=="number")return A.a6(r)
a.cx=s+r}if((b&32)!==0){s=a.cy
r=p.$0()
if(typeof r!=="number")return A.a6(r)
a.cy=s+r}if((b&64)!==0){s=a.ch
p=p.$0()
if(typeof p!=="number")return A.a6(p)
a.ch=s+p}},
c4(a,b){var s,r,q,p,o
if(b===0)return 0
s=a+b
r=this.a
q=r.a
p=q.a
if(p.getUint16(s+4,!1)!==32768)return 0
q=q.y
q===$&&A.h()
o=q==null?null:q.e
if(o==null)return 0
return B.c.M(o.eh(p.getUint16(s,!1),p.getUint16(s+2,!1),r.b))},
bq(a){var s=this.a.a.a,r=s.getInt16(a+2,!1),q=s.getInt16(a+4,!1)
if(s.getUint16(a,!1)===3){r+=this.c4(a,s.getUint16(a+6,!1))
q+=this.c4(a,s.getUint16(a+8,!1))}return new A.e(r,q)},
da(a){var s=this.a.a.a,r=s.getUint16(a+2,!1),q=this.c,p=this.w
if(!(p>=0&&p<q.length))return A.a(q,p)
return A.aE(s,a+r,q[p].b)},
hA(a){var s,r,q,p=this,o=p.da(a)
if(o<0)return!1
s=p.a.a.a
r=s.getUint16(a+4,!1)
switch(s.getUint16(a,!1)){case 1:s=p.c
q=p.w
if(!(q>=0&&q<s.length))return A.a(s,q)
p.aP(s[q],r,a+6,a)
break
case 2:if(o>=s.getUint16(a+6,!1))return!1
s=p.c
q=p.w
if(!(q>=0&&q<s.length))return A.a(s,q)
p.aP(s[q],r,a+8+o*A.p3(r),a)
break
default:return!1}++p.w
return!0},
fL(a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=this,a4=a3.da(a5)
if(a4<0)return!1
s=a3.cY(a3.w,1)
if(s==null)return!1
r=a3.a.a.a
q=r.getUint16(a5+4,!1)
p=r.getUint16(a5+6,!1)
o=A.p3(q)
n=A.p3(p)
m=a3.c
l=a3.w
k=m.length
if(!(l>=0&&l<k))return A.a(m,l)
j=m[l]
if(s>>>0!==s||s>=k)return A.a(m,s)
i=m[s]
switch(r.getUint16(a5,!1)){case 1:if(a4>=r.getUint16(a5+8,!1))return!1
h=a5+r.getUint16(a5+10+a4*2,!1)
g=2+o+n
f=r.getUint16(h,!1)-1
m=h+2
d=0
for(;;){if(!(d<=f)){e=-1
break}c=B.b.I(d+f,1)
e=m+c*g
b=r.getUint16(e,!1)
l=i.b
if(l<b)f=c-1
else if(l>b)d=c+1
else break}if(e<0)return!1
r=e+2
a3.aP(j,q,r,h)
a3.aP(i,p,r+o,h)
break
case 2:a=A.c3(r,a5+r.getUint16(a5+8,!1),j.b)
a0=A.c3(r,a5+r.getUint16(a5+10,!1),i.b)
a1=r.getUint16(a5+12,!1)
a2=r.getUint16(a5+14,!1)
if(a>=a1||a0>=a2)return!1
g=a5+16+(a*a2+a0)*(o+n)
a3.aP(j,q,g,a5)
a3.aP(i,p,g+o,a5)
break
default:return!1}a3.w=p!==0?s+1:s
return!0},
fp(a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this,b=c.a.a.a,a=a2+b.getUint16(a2+2,!1),a0=c.c,a1=c.w
if(!(a1>=0&&a1<a0.length))return A.a(a0,a1)
s=a0[a1]
r=A.aE(b,a,s.b)
if(r<0||r>=b.getUint16(a2+4,!1))return!1
a1=a2+6
q=b.getUint16(a1+r*4,!1)
if(q===0)return!1
p=c.cY(c.w,-1)
if(p==null)return!1
if(p>>>0!==p||p>=a0.length)return A.a(a0,p)
o=a0[p]
n=A.aE(b,a,o.b)
if(n<0||n>=b.getUint16(a2+4,!1))return!1
m=b.getUint16(a1+n*4+2,!1)
if(m===0)return!1
l=c.bq(a2+m)
k=l.a
j=c.bq(a2+q)
i=j.a
if(c.y){b=B.c.L(k)
a1=o.cx
h=b+a1
o.ch-=h
o.cx=a1-h
s.ch=B.c.L(i)+s.cx}else{o.ch=B.c.L(k)+o.cx
b=B.c.L(i)
a1=s.cx
h=b+a1
s.ch-=h
s.cx=a1-h}g=c.w
f=j.b-l.b
b=c.d
b===$&&A.h()
if((b.b&1)===0){f=-f
e=g
g=p}else e=p
c.d5(e,g)
b=a0.length
if(!(e>=0&&e<b))return A.a(a0,e)
a1=a0[e]
a1.dx=2
d=g-e
a1.db=d
a1.cy=f
if(!(g>=0&&g<b))return A.a(a0,g)
b=a0[g]
if(b.db===-d)b.cy=b.db=0;++c.w
return!0},
d5(a,b){var s,r,q,p=this.c
if(!(a>=0&&a<p.length))return A.a(p,a)
s=p[a]
r=s.db
if(r===0||(s.dx&2)===0)return
s.db=0
q=a+r
if(q===b)return
this.d5(q,b)
if(!(q>=0&&q<p.length))return A.a(p,q)
p=p[q]
p.cy=-s.cy
p.db=-r
p.dx=s.dx},
d4(a,b){var s,r,q,p,o,n=this
for(s=n.w-1,r=n.c,q=n.a.a.a;s>=0;--s){if(!(s<r.length))return A.a(r,s)
p=r[s]
if(n.cH(p,8))continue
if((p.c&n.e)>>>0===0)continue
if(p.Q&&!p.f)continue
o=!1
if(b)if(!n.fF(s)){a.toString
o=A.aE(q,a,p.b)<0}if(o)continue
return s}return null},
f4(){return this.d4(null,!1)},
fF(a){var s,r,q,p=this.c,o=p.length
if(!(a>=0&&a<o))return A.a(p,a)
s=p[a]
if(s.w)r=(s.z>0?0:s.y)===0||a===0
else r=!0
if(r)return!0
r=a-1
if(!(r>=0&&r<o))return A.a(p,r)
q=p[r]
p=!0
if(q.d!==3)if(q.w)if(s.x===q.x){p=s.z>0?0:s.y
p=p!==(q.z>0?0:q.y)+1}return p},
bW(a,b,c,d){var s,r,q,p,o=this
if(c==null)return!1
s=o.bq(a+o.a.a.a.getUint16(a+2+b*4+2,!1))
r=o.bq(c)
q=o.c
p=o.w
if(!(p>=0&&p<q.length))return A.a(q,p)
p=q[p]
p.cx=B.c.L(r.a-s.a)
p.cy=B.c.L(r.b-s.b)
p.dx=1
q=o.w
p.db=d-q
o.w=q+1
return!0},
bU(a,b,c,d,e){var s,r,q=this.a.a.a
if(b>=q.getUint16(a,!1))return null
s=q.getUint16(c+2+d*4,!1)
if(s>=e)return null
r=q.getUint16(a+2+(b*e+s)*2,!1)
return r===0?null:a+r},
fY(a){var s,r,q,p,o,n,m=this,l=m.a.a.a,k=l.getUint16(a+2,!1),j=m.c,i=m.w
if(!(i>=0&&i<j.length))return A.a(j,i)
s=A.aE(l,a+k,j[i].b)
if(s<0)return!1
r=a+l.getUint16(a+4,!1)
q=m.d4(r,!0)
if(q==null)return!1
if(q>>>0!==q||q>=j.length)return A.a(j,q)
p=A.aE(l,r,j[q].b)
if(p<0)return!1
o=l.getUint16(a+6,!1)
n=a+l.getUint16(a+8,!1)
return m.bW(n,s,m.bU(a+l.getUint16(a+10,!1),p,n,s,o),q)},
fZ(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.c,e=g.w
if(!(e>=0&&e<f.length))return A.a(f,e)
s=f[e]
e=g.a.a.a
r=A.aE(e,a+e.getUint16(a+2,!1),s.b)
if(r<0)return!1
q=g.f4()
if(q==null)return!1
p=e.getUint16(a+4,!1)
if(q>>>0!==q||q>=f.length)return A.a(f,q)
o=A.aE(e,a+p,f[q].b)
if(o<0)return!1
n=e.getUint16(a+6,!1)
m=a+e.getUint16(a+8,!1)
l=a+e.getUint16(a+10,!1)
if(o>=e.getUint16(l,!1))return!1
k=l+e.getUint16(l+2+o*2,!1)
j=e.getUint16(k,!1)
if(j===0)return!1
if(q>>>0!==q||q>=f.length)return A.a(f,q)
i=f[q].x
f=!1
if(i!==0)if(i===s.x)f=(s.z>0?0:s.y)>0
if(f){f=s.z>0
if((f?0:s.y)<j)f=f?0:s.y
else f=j
h=f-1}else h=j-1
return g.bW(m,r,g.bU(k,h,m,r,n),q)},
h_(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=e.c,c=e.w
if(!(c>=0&&c<d.length))return A.a(d,c)
s=d[c]
c=e.a.a.a
r=A.aE(c,a+c.getUint16(a+2,!1),s.b)
if(r<0)return!1
q=e.w
p=e.d
p===$&&A.h()
o=e.eO(q,-1,p.b&4294967281)
if(o!=null){if(o>>>0!==o||o>=d.length)return A.a(d,o)
q=d[o].d!==3}else q=!0
if(q)return!1
if(o>>>0!==o||o>=d.length)return A.a(d,o)
n=d[o]
m=s.x
l=n.x
k=s.z>0?0:s.y
j=n.z>0?0:n.y
if(m===l)i=m===0||k===j
else if(!(m>0&&k===0)){d=l>0&&j===0
i=d}else i=!0
if(!i)return!1
h=A.aE(c,a+c.getUint16(a+4,!1),n.b)
if(h<0)return!1
g=c.getUint16(a+6,!1)
f=a+c.getUint16(a+8,!1)
return e.bW(f,r,e.bU(a+c.getUint16(a+10,!1),h,f,r,g),o)}}
A.jK.prototype={
$0(){var s=this.a,r=this.b.a.a.a.getInt16(s.a,!1)
s.a+=2
return r},
$S:8}
A.jJ.prototype={
$0(){var s=this.b,r=this.a,q=s.c4(this.c,s.a.a.a.getUint16(r.a,!1))
r.a+=2
return q},
$S:8}
A.k7.prototype={
gaV(){return!1},
e2(a,b){var s,r=this
switch(a){case 1:s=r.fM(b)
break
case 2:s=r.h1(b)
break
case 3:s=r.f2(b)
break
case 4:s=r.fT(b)
break
case 5:s=r.bG(b,!1)
break
case 6:s=r.bG(b,!0)
break
case 8:s=r.hp(b)
break
default:s=!1
break}return s},
bw(a){var s=this.a.a.a,r=s.getUint16(a+2,!1),q=this.c,p=this.w
if(!(p>=0&&p<q.length))return A.a(q,p)
return A.aE(s,a+r,q[p].b)},
cj(a,b,c,d,e){var s
a.b=b
a.f=!0
if(e){a.r=!0
a.w=!1}if(c)a.w=!0
s=this.a.a.y
s===$&&A.h()
if(s!=null&&s.b!=null){a.d=s.eH(b)
a.e=s.iB(b)}else if(d!==0)a.d=d},
b7(a,b){return this.cj(a,b,!1,0,!1)},
hl(a,b,c,d){return this.cj(a,b,!1,c,d)},
hk(a,b,c,d){return this.cj(a,b,c,d,!1)},
fM(a){var s,r,q,p=this,o=p.bw(a)
if(o<0)return!1
s=p.c
r=p.w
if(!(r>=0&&r<s.length))return A.a(s,r)
q=s[r]
s=p.a.a.a
switch(s.getUint16(a,!1)){case 1:p.b7(q,q.b+s.getInt16(a+4,!1)&65535)
break
case 2:if(o>=s.getUint16(a+4,!1))return!1
p.b7(q,s.getUint16(a+6+o*2,!1))
break
default:return!1}++p.w
return!0},
h1(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.bw(a)
if(f<0||f>=g.a.a.a.getUint16(a+4,!1))return!1
s=g.a.a.a
r=a+s.getUint16(a+6+f*2,!1)
q=s.getUint16(r,!1)
p=g.c
o=g.w
if(!(o>=0&&o<p.length))return A.a(p,o)
n=p[o]
if(q===1){g.b7(n,s.getUint16(r+2,!1));++g.w
return!0}if(q===0){B.a.bN(p,o)
return!0}m=n.d===2?1:0
o=n.x===0
l=A.b([],t.mX)
for(k=r+2,j=n.a,i=0;i<q;++i){h=new A.aT(j,n.b)
h.c=n.c
h.d=n.d
h.e=n.e
h.f=n.f
h.r=n.r
h.w=n.w
h.x=n.x
h.y=n.y
h.z=n.z
h.Q=n.Q
h.as=n.as
h.at=n.at
h.ax=n.ax
h.ay=n.ay
if(o){h.x=0
h.y=i
h.z=0}g.hk(h,s.getUint16(k+i*2,!1),!0,m)
B.a.j(l,h)}s=g.w
B.a.iQ(p,s,s+1,l)
g.w+=q
return!0},
f2(a){var s,r,q,p,o=this,n=o.bw(a)
if(n<0||n>=o.a.a.a.getUint16(a+4,!1))return!1
s=o.a.a.a
r=a+s.getUint16(a+6+n*2,!1)
if(s.getUint16(r,!1)===0)return!1
q=o.c
p=o.w
if(!(p>=0&&p<q.length))return A.a(q,p)
o.b7(q[p],s.getUint16(r+2,!1));++o.w
return!0},
fT(a){var s,r,q,p,o,n,m,l=this,k=l.bw(a)
if(k<0||k>=l.a.a.a.getUint16(a+4,!1))return!1
s=l.a.a.a
r=a+s.getUint16(a+6+k*2,!1)
for(q=r+2,p=0;p<s.getUint16(r,!1);++p){o=r+s.getUint16(q+p*2,!1)
n=s.getUint16(o+2,!1)
if(n===0)continue
m=l.cJ(n,new A.k9(l,o))
if(m==null)continue
l.fS(s.getUint16(o,!1),m.a,m.b)
return!0}return!1},
fS(a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=this
t.L.a(a2)
s=a0.c
r=B.a.gt(a2)
if(!(r>=0&&r<s.length))return A.a(s,r)
q=s[r]
r=q.d
p=r===1
o=r===3
for(r=A.aU(a2,1,null,A.D(a2).c),n=r.$ti,r=new A.a1(r,r.gk(0),n.i("a1<V.E>")),n=n.i("V.E");r.l();){m=r.d
if(m==null)m=n.a(m)
if(m>>>0!==m||m>=s.length)return A.a(s,m)
if(s[m].d!==3){p=!1
o=!1
break}}l=!p&&!o
k=l?a0.y++:0
j=q.x
i=q.gcz()
if(l){q.x=k
q.y=0
q.z=a3
if(q.at)q.at=!1}a0.hl(q,a1,l?2:0,!0)
h=A.bd(t.S)
for(r=!l,g=i,f=1;f<a2.length;++f){for(e=a2[f-1]+1,n=g-i;m=a2[f],e<m;++e){if(r)continue
if(!(e>=0&&e<s.length))return A.a(s,e)
d=s[e]
c=d.z>0?0:d.y
if(c===0)c=i
d.x=k
d.y=n+(c<i?c:i)
d.z=0}if(!(m>=0&&m<s.length))return A.a(s,m)
b=s[m]
j=b.x
i=b.z
i=i>0&&b.d===2?i:1
g+=i
h.j(0,m)}if(!o&&j!==0)for(e=B.a.gE(a2)+1,r=g-i;n=s.length,e<n;++e){if(!(e>=0))return A.a(s,e)
b=s[e]
if(b.x===j)n=(b.z>0?0:b.y)===0
else n=!0
if(n)break
b.x=k
n=b.z>0?0:b.y
b.y=r+(n<i?n:i)
b.z=0}r=A.W(h,h.$ti.c)
B.a.aD(r,new A.k8())
n=r.length
a=0
for(;a<r.length;r.length===n||(0,A.i)(r),++a)B.a.bN(s,r[a])
a0.w=B.a.gE(a2)+1-h.a},
hp(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.c,e=g.w
if(!(e>=0&&e<f.length))return A.a(f,e)
s=f[e]
e=g.a.a.a
r=A.aE(e,a+e.getUint16(a+2,!1),s.b)
if(r<0)return!1
q=e.getUint16(a+4,!1)
p=a+6
f=p+q*2
o=e.getUint16(f,!1)
n=f+2
m=n+o*2
if(r>=e.getUint16(m,!1))return!1
l=new A.kc(g,a)
k=g.w
for(j=0;j<q;++j,k=i){i=g.bn(k,-1,!0,new A.ka(l,p,j))
if(i==null)return!1}k=g.w
for(j=0;j<o;++j,k=h){h=g.bn(k,1,!0,new A.kb(l,n,j))
if(h==null)return!1}g.b7(s,e.getUint16(m+2+r*2,!1))
return!0}}
A.k9.prototype={
$2(a,b){return a.b===this.a.a.a.a.getUint16(this.b+4+(b-1)*2,!1)},
$S:4}
A.k8.prototype={
$2(a,b){A.v(a)
return A.v(b)-a},
$S:30}
A.kc.prototype={
$2(a,b){var s=this.a.a.a.a
return A.aE(s,this.b+s.getUint16(b,!1),a.b)>=0},
$S:4}
A.ka.prototype={
$1(a){return this.a.$2(a,this.b+this.c*2)},
$S:10}
A.kb.prototype={
$1(a){return this.a.$2(a,this.b+this.c*2)},
$S:10}
A.j1.prototype={
hO(a,b,c){var s,r,q,p,o,n=(b<<16|c)>>>0,m=this.a,l=m.getUint16(a,!1)-1
for(s=a+8,r=0;r<=l;){q=B.b.I(r+l,1)
p=s+q*6
o=m.getUint32(p,!1)
if(n<o)l=q-1
else if(n>o)r=q+1
else return m.getInt16(p+4,!1)}return 0},
hV(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g
t.hy.a(a)
if(c){s=A.D(a).i("aK<1>")
r=A.W(new A.aK(a,s),s.i("V.E"))}else r=a
for(s=this.b,q=s.length,p=0;p<s.length;s.length===q||(0,A.i)(s),++p){o=s[p]
n=o.a
m=o.b
for(l=0;o=r.length,l<o;){if(!(l>=0))return A.a(r,l)
k=r[l]
if((k.c&b)===0){++l
continue}j=l+1
for(;;){if(!(j<o&&r[j].d===3))break;++j}if(j>=o)break
i=this.hO(n,k.b,r[j].b)
if(i!==0){o=r.length
if(m){if(!(j<o))return A.a(r,j)
r[j].cy=i}else{h=B.b.I(i,1)
g=i-h
if(!(l<o))return A.a(r,l)
r[l].ch+=h
if(!(j<o))return A.a(r,j)
o=r[j]
o.ch+=g
o.cx+=g}}l=j}}}}
A.ip.prototype={
eH(a){var s=this.b
if(s==null)s=0
else s=A.c3(this.a,s,a)
return s},
iB(a){var s=this.c
if(s==null)s=0
else s=A.c3(this.a,s,a)
return s},
ip(a,b){var s,r=this.d
if(r==null||a>=this.a.getUint16(r+2,!1))return!1
s=this.a
return A.aE(s,r+s.getUint32(r+4+a*4,!1),b)>=0}}
A.dn.prototype={}
A.j_.prototype={
iv(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e
t.bF.a(a)
s=this.a
r=this.d
q=s.getUint16(r,!1)
for(p=a.length,o=t.X,n=r+2,m=0;m<a.length;a.length===p||(0,A.i)(a),++m){l=a[m]
for(k=0;k<q;++k){j=n+k*6
if(A.bq(A.b([s.getUint8(j),s.getUint8(j+1),s.getUint8(j+2),s.getUint8(j+3)],o),0,null)!==l)continue
i=r+s.getUint16(j+4,!1)
h=s.getUint16(i,!1)
if(h===0)continue
g=i+h
f=s.getUint16(g+2,!1)
r=f===65535?null:f
p=A.b([],o)
for(o=g+4,n=g+6,e=0;e<s.getUint16(o,!1);++e)p.push(s.getUint16(n+e*2,!1))
return new A.eP(p,r,l)}}return null},
ej(a){return A.oR(this.a,this.e+2+a*6)},
il(a){var s,r,q,p,o,n
for(s=this.a,r=this.e,q=r+2,p=t.X,o=0;o<s.getUint16(r,!1);++o){n=q+o*6
if(A.bq(A.b([s.getUint8(n),s.getUint8(n+1),s.getUint8(n+2),s.getUint8(n+3)],p),0,null)===a)return!0}return!1},
i9(a,b){var s,r,q,p=this.e,o=this.a,n=p+o.getUint16(p+2+a*6+4,!1),m=this.hH(a,b)
if(m!=null)n=m
p=A.b([],t.X)
for(s=n+2,r=n+4,q=0;q<o.getUint16(s,!1);++q)p.push(o.getUint16(r+q*2,!1))
return p},
hH(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this.r
if(c==null||b.length===0)return null
for(s=this.a,r=c+4,q=b.length,p=c+8,o=0;o<s.getUint32(r,!1);++o){n=p+o*8
m=c+s.getUint32(n,!1)
k=m+2
j=0
for(;;){l=!1
if(!(j<s.getUint16(m,!1))){l=!0
break}i=m+s.getUint32(k+j*4,!1)
if(s.getUint16(i,!1)!==1)break
h=s.getUint16(i+2,!1)
g=h<q?b[h]:0
if(g<s.getInt16(i+4,!1)/16384||g>s.getInt16(i+6,!1)/16384)break;++j}if(!l)continue
f=c+s.getUint32(n+4,!1)
for(r=f+4,q=f+6,e=0;e<s.getUint16(r,!1);++e){d=q+e*6
if(s.getUint16(d,!1)===a)return f+s.getUint32(d+2,!1)}return null}return null},
eq(a){var s=this.w,r=s.h(0,a)
if(r==null){r=new A.j0(this,a).$0()
s.m(0,a,r)
s=r}else s=r
return s}}
A.j0.prototype={
$0(){var s,r,q,p=this.a,o=p.f,n=p.a,m=o+n.getUint16(o+2+this.b*2,!1),l=n.getUint16(m,!1),k=n.getUint16(m+2,!1),j=n.getUint16(m+4,!1),i=A.b([],t.X)
for(p=l===p.c,o=m+6,s=l,r=0;r<j;++r){q=m+n.getUint16(o+r*2,!1)
if(p){s=n.getUint16(q+2,!1)
q+=n.getUint32(q+4,!1)}B.a.j(i,q)}return new A.dn(s,k,(k&16)!==0?n.getUint16(o+j*2,!1):0,i)},
$S:74}
A.fy.prototype={}
A.i2.prototype={
iD(a){var s,r,q,p,o,n,m,l,k,j,i
t.eM.a(a)
s=this.a
r=s.length
q=new Float64Array(r)
for(p=this.b,o=0;o<s.length;++o){n=s[o]
m=a.h(0,n.a)
if(m==null)m=n.c
l=n.b
k=n.d
j=B.c.H(m,l,k)
m=n.c
if(j<m)i=(j-m)/(m-l)
else i=j>m?(j-m)/(k-m):0
i=B.c.M(i*16384)/16384
if(o<p.length)i=B.c.M(A.tI(p[o],i)*16384)/16384
if(!(o<r))return A.a(q,o)
q[o]=i}return q}}
A.fI.prototype={
ghh(){var s,r,q=this,p=q.c
if(p===$){s=q.b
r=q.a.getUint32(s+2,!1)
q.c!==$&&A.t7()
p=q.c=s+r}return p},
eh(a,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
if(a1.length===0||a>=b.a.getUint16(b.b+6,!1))return 0
s=b.b
r=b.a
q=s+r.getUint32(s+8+a*4,!1)
if(a0>=r.getUint16(q,!1))return 0
p=r.getUint16(q+2,!1)
o=(p&32768)!==0
n=p&32767
m=r.getUint16(q+4,!1)
s=m-n
l=o?n*4+s*2:n*2+s
s=q+6
k=s+m*2+a0*l
for(j=0,i=0;i<m;++i){if(i<n){h=o?r.getInt32(k,!1):r.getInt16(k,!1)
k+=o?4:2}else{h=o?r.getInt16(k,!1):r.getInt8(k)
k+=o?2:1}if(h===0)continue
g=r.getUint16(s+i*2,!1)
f=b.ghh()
e=b.d
if(e===$){d=r.getUint16(f,!1)
b.d!==$&&A.t7()
b.d=d
e=d}c=f+4+g*e*6
j+=h*A.t4(a1,new A.iQ(b,c),new A.iR(b,c),new A.iS(b,c))}return j}}
A.iQ.prototype={
$1(a){return this.a.a.getInt16(this.b+a*6+2,!1)/16384},
$S:6}
A.iR.prototype={
$1(a){return this.a.a.getInt16(this.b+a*6,!1)/16384},
$S:6}
A.iS.prototype={
$1(a){return this.a.a.getInt16(this.b+a*6+4,!1)/16384},
$S:6}
A.i8.prototype={
h(a,b){var s,r,q,p,o,n,m,l,k,j,i,h
A.v(b)
s=this.a
r=this.b
q=s.getUint8(r)
p=s.getUint8(r+1)
o=q===0
n=r+2
m=o?s.getUint16(n,!1):s.getUint32(n,!1)
o=o?4:6
if(m===0)return new A.e(0,b)
l=Math.min(b,m-1)
k=(B.b.I(p,4)&3)+1
for(r=r+o+l*k,j=0,i=0;i<k;++i)j=(j<<8|s.getUint8(r+i))>>>0
h=(p&15)+1
return new A.e(B.b.bE(j,h),(j&B.b.aw(1,h)-1)>>>0)}}
A.o7.prototype={
$1(a){var s,r
for(s=a+1,r=this.a;s<r.length;++s)if(A.pt(r[s])!==1)return s
return null},
$S:75}
A.nW.prototype={
$2(a,b){var s=this.b,r=this.a
r.b=a*s+b*this.c
r.a=-b*s},
$S:17}
A.nV.prototype={
$2(a,b){var s=this,r=s.b,q=a*r+b*s.c,p=-b*r
r=s.a
s.d.ah(r.b,r.a,q,p)
r.b=q
r.a=p},
$S:17}
A.nX.prototype={
$4(a,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=h.b,f=h.c,e=a*g+a0*f,d=-a0*g,c=a1*g+a2*f,b=-a2*g
g=h.a
f=g.b-2*e+c
s=g.a-2*d+b
r=Math.max(1,Math.min(32,B.c.ae(Math.sqrt(Math.sqrt(f*f+s*s)*2))))
q=g.b
p=g.a
for(f=h.d,o=1;o<=r;++o,p=i,q=j){n=o/r
m=1-n
s=m*m
l=2*m*n
k=n*n
j=s*g.b+l*e+k*c
i=s*g.a+l*d+k*b
f.ah(q,p,j,i)}g.b=c
g.a=b},
$S:76}
A.it.prototype={
iE(a){var s,r,q
t.bF.a(a)
s=B.a.ab(a,"\x01")
r=this.e
q=r.h(0,s)
if(q==null){q=new A.iu(this,a).$0()
r.m(0,s,q)
r=q}else r=q
return r},
gk(a){return this.c.length},
el(a,b){var s=A.qe(b),r=this.f,q=a*1000+s,p=r.h(0,q)
if(p==null){p=this.c
if(!(a>=0&&a<p.length))return A.a(p,a)
p=p[a].j2(A.j4(["wght",s],t.N,t.i))
r.m(0,q,p)
r=p}else r=p
return r}}
A.iu.prototype={
$0(){var s,r,q,p,o,n,m,l=A.b([],t.X)
for(s=this.b,r=s.length,q=this.a,p=q.c,q=q.d,o=0;o<s.length;s.length===r||(0,A.i)(s),++o){n=A.qd(s[o])
for(m=0;m<p.length;++m){if(!(m<q.length))return A.a(q,m)
if(q[m]===n&&!B.a.u(l,m))B.a.j(l,m)}}for(m=0;m<p.length;++m)if(!B.a.u(l,m))B.a.j(l,m)
return l},
$S:77}
A.jX.prototype={}
A.lO.prototype={
$2(a,b){var s,r,q,p,o,n,m=t.X,l=A.b([],m),k=A.b([],m)
for(m=this.c,s=this.a,r=s.c,q=this.b,p=r.length,o=a;o<b;++o){if(o>a){B.a.j(l,32)
if(!(o<q.length))return A.a(q,o)
n=q[o]-1
if(!(n>=0&&n<p))return A.a(r,n)
B.a.j(k,r[n])}if(!(o<m.length))return A.a(m,o)
B.a.v(l,m[o])
if(!(o<q.length))return A.a(q,o)
n=q[o]
if(!(o<m.length))return A.a(m,o)
B.a.v(k,new Uint8Array(r.subarray(n,A.bi(n,n+m[o].length,p))))}return new A.dD(l,s.b,k)},
$S:78}
A.lN.prototype={
$2(a,b){return A.ct(a)+A.ct(b)},
$S:79}
A.oa.prototype={
$0(){var s=this,r=s.a,q=A.pW(r.a),p=r.a,o=p.length===0?0:B.a.gt(q.b),n=new A.dD(p,o,q.a)
if(!s.c){p=s.d
p=p==1/0||p==-1/0}else p=!0
p=p?A.b([n],t.q):A.vW(s.e,n,s.f,s.r,s.d,s.w)
B.a.v(s.b,p)
r.a=A.b([],t.X)},
$S:0}
A.m7.prototype={
$2(a,b){return Math.max(A.ct(a),t.hT.a(b).b)},
$S:80}
A.aJ.prototype={}
A.eN.prototype={
A(){var s,r,q,p,o,n,m
for(s=this.a,r=s.length,q=0,p=1,o=0;o<10;++o){n=this.b++
if(!(n<r))return A.a(s,n)
m=s[n]
q+=(m&127)*p
if(m<128)return q
p*=128}throw A.f(B.a1)},
ac(a){var s=this.A(),r=this.b
if(s>this.c-r)throw A.f(B.aD)
return s},
er(){var s=this,r=s.ac(0),q=s.b,p=q+r
s.b=p
return new A.eN(s.a,q,p)},
T(a,b){var s,r=this
switch(b){case 0:r.A()
break
case 1:r.b+=8
break
case 2:s=r.ac(0)
r.b+=s
break
case 5:r.b+=4
break
default:throw A.f(A.de("glyph pbf: wire type "+b,null,null))}}}
A.iy.prototype={
cD(a){var s=J.tE(t.bF.a(a),",")
return this.w.bg(s,new A.iz(this,s))},
iK(a){var s,r,q,p
for(s=a.ch,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].y
if(p.length!==0)this.cK(this.cD(p),"a")}},
cK(a,b){var s,r,q,p,o,n,m
for(s=new A.cO(b),r=this.y,q=this.z,p=a<<16,o=!0;s.l();){n=B.b.I(s.d,8)
m=(p|n)>>>0
if(q.u(0,m))continue
if(r.j(0,m))this.bt(a,n,m)
o=!1}return o},
bt(a,b,a0){var s=0,r=A.aj(t.H),q,p=2,o=[],n=this,m,l,k,j,i,h,g,f,e,d,c
var $async$bt=A.ak(function(a1,a2){if(a1===1){o.push(a2)
s=p}for(;;)switch(s){case 0:e=n.r
d=a-512
if(!(d>=0&&d<e.length)){q=A.a(e,d)
s=1
break}d=A.vJ(2,e[d],B.R,!1)
e=A.pG(n.b,"{fontstack}",d)
d=b*256
m=A.pG(e,"{range}",""+d+"-"+(d+255))
l=B.c6
p=4
s=7
return A.I(n.a.$1(m),$async$bt)
case 7:k=a2
if(k!=null)l=A.ug(k)
p=2
s=6
break
case 4:p=3
c=o.pop()
j=A.aG(c)
s=6
break
case 3:s=2
break
case 6:for(e=l,d=e.length,h=n.x,g=0;g<e.length;e.length===d||(0,A.i)(e),++g){f=e[g]
h.iL(a,f.a,f)}n.z.j(0,a0)
n.e.$2(a,l)
case 1:return A.ah(q,r)
case 2:return A.ag(o.at(-1),r)}})
return A.ai($async$bt,r)}}
A.iz.prototype={
$0(){var s=this.a.r
B.a.j(s,this.b)
return 512+s.length-1},
$S:8}
A.fB.prototype={}
A.bs.prototype={}
A.iA.prototype={
i5(a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5
t.L.a(a7)
s=this.d.bg(a6,new A.iD())
r=A.b([],t.eu)
q=a6.a[1]>0
for(p=J.B(a7);p.l();){o=p.gn()
if(s.K(o))n=s.h(0,o)
else{n=this.hM(a6,o)
s.m(0,o,n)}if(n!=null){m=n.a
m=(q?m*2+1:m)<=1024}else m=!1
if(m)B.a.j(r,new A.e(o,n))}l=A.b([],t.B)
for(p=r.length,k=0,j=0,i=0,h=0;o=r.length,h<o;r.length===p||(0,A.i)(r),++h){n=r[h].b
g=n.a
if(q)g=g*2+1
if(k+g>1024){j+=i+1
k=0
i=0}B.a.j(l,new A.e(k,j))
k+=g+1
i=Math.max(i,n.b)}f=Math.max(1,j+i+1)
e=new Uint8Array(1024*f*4)
d=new Float64Array(o*8)
for(p=A.oT(r,0,t.fY),o=J.B(p.a),m=p.b,p=new A.ba(o,m,A.q(p).i("ba<1>")),c=t.n;p.l();){b=p.c
b=b>=0?new A.e(m+b,o.gn()):A.aF(A.ae())
a=b.a
a0=b.b
n=a0.b
if(!(a>=0&&a<l.length))return A.a(l,a)
a1=l[a]
a2=a1.a
a3=a1.b
A.qf(e,1024,a2,a3,n,n.c)
a4=n.d
b=a4==null
if(!b)A.qf(e,1024,a2+n.a+1,a3,n,a4)
a5=n.a
b=b?-1:a2+a5+1
B.v.bR(d,a*8,A.b([a0.a,a2,a3,a5,n.b,b,n.e,n.f],c))}return new A.fB(1024,f,e,d)},
he(c6,c7,c8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1=null,c2=c6.a,c3=c2[3],c4=(c3&7)/8,c5=B.b.I(c3,3)/8
c3=this.b.h(0,c7)
s=c3==null?c1:c3.h(0,c8)
if(s==null||s.c===0)return c1
r=s.c+6
q=s.d+6
if(s.b.length<r*q)return c1
c3=c2[4]
p=(c3>0?c3/16:Math.pow(2,c2[5]/4))/24
o=(s.e-3)*p
n=(-s.f-3)*p
m=Math.floor(c4+o)-c4
l=Math.floor(c5+n)-c5
k=B.c.ae(r*p)+2
j=B.c.ae(q*p)+2
i=0.105/p
h=(c2[0]/4*1.19/8+0.105)/p
c2=c2[1]
g=(6-c2/4/p)/8
c3=k*j
f=new Uint8Array(c3)
if(c2>0)e=new Uint8Array(c3)
else e=c1
d=new A.iC()
c=new A.iB(r,q,s)
for(c2=e!=null,b=0.75-i,a=0.75+i,a0=0.75+2*h,a1=g-h,a2=g+h,a3=0;a3<j;++a3){a4=(l+a3+0.5-n)/p-0.5
a5=B.c.U(a4)
a6=a4-a5
for(a7=1-a6,a8=a5+1,a9=a3*k,b0=0;b0<k;++b0){b1=(m+b0+0.5-o)/p-0.5
b2=B.c.U(b1)
b3=b1-b2
b4=c.$2(b2,a5)
b5=1-b3
if(typeof b4!=="number")return b4.ag()
b6=b2+1
b7=c.$2(b6,a5)
if(typeof b7!=="number")return b7.ag()
b8=c.$2(b2,a8)
if(typeof b8!=="number")return b8.ag()
b6=c.$2(b6,a8)
if(typeof b6!=="number")return b6.ag()
b9=(b4*b5+b7*b3)*a7+(b8*b5+b6*b3)*a6
b6=a9+b0
b5=d.$3(b,a,b9)
if(typeof b5!=="number")return b5.ag()
b5=B.c.M(b5*255)
if(!(b6>=0&&b6<c3))return A.a(f,b6)
f[b6]=b5
if(c2){c0=d.$3(0.75,a0,b9)
b4=B.c.M(Math.min(d.$3(a1,a2,b9),1-c0)*255)
e.$flags&2&&A.r(e)
if(!(b6<e.length))return A.a(e,b6)
e[b6]=b4}}}return new A.bs(k,j,f,e,m,l)},
dB(a,b,c){var s,r,q,p=(a*10+B.b.C(A.qe(b),100)<<20|c)>>>0,o=this.c
if(o.K(p))return o.h(0,p)
s=this.a.el(a,b)
r=s.a.r
r===$&&A.h()
q=r.es(c,s.b)
s=q==null||q.c.length===0?null:q
o.m(0,p,s)
return s},
hM(a,b){var s,r
try{s=this.fJ(a,b)
return s}catch(r){return null}},
fJ(a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=B.b.I(a3,20),a1=a3&1048575
if(a0>=512)return this.he(a2,a0,a1)
s=a2.a
r=this.dB(a0,s[6],a1)
if(r==null)return null
q=Math.pow(2,s[5]/4)
p=this.a.c
if(!(a0<p.length))return A.a(p,a0)
p=p[a0].a.c
p===$&&A.h()
o=q/p
n=A.rT(r,o,s[2]?0.2*o:0)
if(n.b===0)return null
q=A.rL(n).a
m=q[0]
l=q[1]
k=q[2]
j=q[3]
i=s[1]/4
h=s[0]/4
g=Math.ceil(i+h*2+2)
q=g*2
f=B.c.ae(k-m+q)
e=B.c.ae(j-l+q)
d=A.rQ(n,f,e,g-m,g-l)
q=f*e
c=new Uint8Array(q)
for(p=d.length,b=0;b<q;++b){if(!(b<p))return A.a(d,b)
a=B.c.N(d[b]*255+0.5)
if(!(b<q))return A.a(c,b)
c[b]=a}s=s[1]>0?A.xQ(d,f,e,i,h):null
return new A.bs(f,e,c,s,m-g,l-g)},
ia(a,b,c,d){var s,r
t.L.a(d)
s=A.b([],t.A)
for(r=J.B(d);r.l();)s.push(this.fA(a,b,c,r.gn()))
return s},
fA(a,b,c,d){var s,r,q,p,o
try{s=this.dB(a,b,d)
if(s==null)q=null
else{p=this.a.c
if(!(a>=0&&a<p.length))return A.a(p,a)
p=p[a].a.c
p===$&&A.h()
q=A.xE(d,s,p,c)}r=q
p=r
if(p==null)p=A.qz(d)
return p}catch(o){p=A.qz(d)
return p}}}
A.iD.prototype={
$0(){return A.A(t.S,t.bA)},
$S:81}
A.iC.prototype={
$3(a,b,c){var s=B.c.H((c-a)/(b-a),0,1)
return s*s*(3-2*s)},
$S:35}
A.iB.prototype={
$2(a,b){var s,r,q=this
if(a<0||b<0||a>=q.a||b>=q.b)s=0
else{s=q.c.b
r=b*q.a+a
if(!(r>=0&&r<s.length))return A.a(s,r)
r=s[r]/255
s=r}return s},
$S:82}
A.fC.prototype={
e8(a,b){var s,r,q
if(a<0||a>=this.a.length||b<0)return null
s=this.a
if(!(a>=0&&a<s.length))return A.a(s,a)
r=s[a]
q=B.b.I(b,8)
if(r==null||q>=r.length)return null
if(!(q<r.length))return A.a(r,q)
s=r[q]
return s==null?null:s[b&255]},
iL(a,b,c){var s,r,q,p,o=this.$ti
o.c.a(c)
if(a<0||b<0)return
for(s=this.a;r=s.length,r<=a;)B.a.j(s,null)
if(!(a>=0))return A.a(s,a)
q=s[a]
if(q==null){q=A.b([],o.i("p<k<1?>?>"))
B.a.m(s,a,q)}p=B.b.I(b,8)
while(q.length<=p)B.a.j(q,null)
s=q[p]
if(s==null){o=A.a9(256,null,!1,o.i("1?"))
B.a.m(q,p,o)}else o=s
B.a.m(o,b&255,c)}}
A.lv.prototype={}
A.hp.prototype={}
A.ht.prototype={}
A.hu.prototype={}
A.hk.prototype={}
A.eo.prototype={
q(a){var s=this.c
if(!(s<175))return A.a(B.D,s)
return"ScriptRun("+this.a+".."+this.b+", "+B.D[s]+")"}}
A.jW.prototype={
gk(a){return this.a.length}}
A.h0.prototype={
eL(a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=this
t.L.a(a6)
s=a5.b
r=new A.e(a8,a7)
q=s.h(0,r)
if(q==null){q=A.vw(a5.a,a8,a7)
s.m(0,r,q)}if(a7){s=A.b([],t.X)
for(r=a6.length,p=a5.a.a,o=0;o<a6.length;a6.length===r||(0,A.i)(a6),++o){n=a6[o]
m=A.f7(B.K,2,n)
if(m<0)l=n
else{k=m+1
if(!(k<856))return A.a(B.K,k)
l=B.K[k]}k=!1
if(l!==n){k=p.x
k===$&&A.h()
k=k.a9(l)!==0}if(k)s.push(l)
else s.push(n)}j=s}else j=a6
s=a5.a
r=q.a
i=A.ye(s,j,r)
for(p=i.length,k=s.a,o=0;o<i.length;i.length===p||(0,A.i)(i),++o){h=i[o]
h.c=1
if(a7){g=h.a
m=A.f7(B.K,2,g)
if(m<0)f=g
else{e=m+1
if(!(e<856))return A.a(B.K,e)
f=B.K[e]}if(f!==g){e=k.x
e===$&&A.h()
e=e.a9(f)===0}else e=!1
if(e){e=h.c
d=q.c
d===$&&A.h()
h.c=(e|d)>>>0}}}if(r){r=q.d
r===$&&A.h()
A.v1(i,r)}r=k.y
r===$&&A.h()
for(p=i.length,e=r!=null,o=0;o<i.length;i.length===p||(0,A.i)(i),++o){h=i[o]
if(e&&r.b!=null){d=h.b
c=r.b
if(c==null)d=0
else{b=r.a
d=A.c3(b,c,d)}h.d=d
d=h.b
c=r.c
if(c==null)d=0
else{b=r.a
d=A.c3(b,c,d)}h.e=d}else h.d=h.at&&!h.Q?3:1}r=k.z
r===$&&A.h()
if(r!=null){a=new A.k7(s,r,i)
r=q.e
r===$&&A.h()
p=r.length
o=0
for(;o<r.length;r.length===p||(0,A.i)(r),++o)for(e=B.a.gp(r[o]);e.l();){d=e.gn()
a.e1(d.a,d.b,d.c,d.d)}}B.a.iP(i,new A.jY())
for(r=i.length,o=0;o<i.length;i.length===r||(0,A.i)(i),++o){h=i[o]
p=s.aR(h.b)
h.ch=p
if(h.ay)h.ch=A.xC(s,h.a,p)}r=k.Q
r===$&&A.h()
p=r==null
a0=!p
if(a0){a=new A.jI(a7,s,r,i)
e=q.f
e===$&&A.h()
d=e.length
o=0
for(;o<e.length;e.length===d||(0,A.i)(e),++o){a1=e[o]
a.e1(a1.a,a1.b,a1.c,a1.d)}}k=k.as
k===$&&A.h()
if(k!=null)a2=!a0||!r.il("kern")
else a2=!1
if(a2)k.hV(i,1,a7)
if(p)a3=!a2||!k.c
else a3=!1
for(r=i.length,p=!a7,o=0;o<r;++o){h=i[o]
if(h.d!==3)continue
if(a3&&p)h.cx=h.cx-h.ch
h.CW=h.ch=0}A.uR(i,a7)
if(a3)A.yh(s,i,a7)
a4=i.length
s=new Int32Array(a4)
r=new Float64Array(a4)
p=new Float64Array(a4)
k=new Float64Array(a4)
for(e=a4-1,m=0;m<a4;++m){d=a7?e-m:m
if(!(d>=0))return A.a(i,d)
h=i[d]
s[m]=h.b
r[m]=h.ch
p[m]=h.cx
k[m]=h.cy}return new A.jW(s,r,p,k)}}
A.jY.prototype={
$1(a){t.oH.a(a)
return a.Q&&!a.f},
$S:10}
A.bt.prototype={}
A.b1.prototype={}
A.hF.prototype={
eW(a,b,c,d){var s,r,q,p,o,n,m,l,k=this,j=A.b([],t.ha)
d.a=0
s=new A.ls(d,j)
s.$1("rvrn");++d.a
if(c){s.$1("rtla")
s.$2$global("rtlm",!1)}else{s.$1("ltra")
s.$1("ltrm")}if(k.a){s.$1("stch");++d.a
s.$2$manualZwj("ccmp",!0)
s.$2$manualZwj("locl",!0)
r=++d.a
for(q=0;q<7;++q){s.$2$global(B.aG[q],!1)
r=++d.a}d.a=r+1
s.$2$manualZwj("rlig",!0)
if(!(b<175))return A.a(B.D,b)
if(B.D[b]==="Arab")++d.a
s.$2$manualZwj("rclt",!0)
s.$2$manualZwj("calt",!0);++d.a
s.$1("mset")}for(q=0;q<14;++q)s.$1(B.bR[q])
for(r=j.length,p=2,q=0;q<r;++q){o=j[q]
if(o.c)o.e=1
else{o.e=p
p=p<<1>>>0}}r=A.r7(j,"rtlm")
k.c!==$&&A.at()
k.c=r
r=A.b([0],t.X)
for(q=0;q<7;++q)r.push(A.r7(j,B.aG[q]))
t.L.a(r)
k.d!==$&&A.at()
k.d=r
n=A.yg(b)
r=a.a
m=r.z
m===$&&A.h()
r=r.Q
r===$&&A.h()
l=d.a
m=m==null?B.c4:A.r6(m,n,j,a.b,l+1)
t.jx.a(m)
k.e!==$&&A.at()
k.e=m
r=r==null?B.c5:B.a.gt(A.r6(r,n,j,a.b,1))
t.nY.a(r)
k.f!==$&&A.at()
k.f=r}}
A.ls.prototype={
$3$global$manualZwj(a,b,c){var s=this.b
if(B.a.aj(s,new A.lt(a)))return
B.a.j(s,new A.bt(a,this.a.a,b,c))},
$1(a){return this.$3$global$manualZwj(a,!0,!1)},
$2$global(a,b){return this.$3$global$manualZwj(a,b,!1)},
$2$manualZwj(a,b){return this.$3$global$manualZwj(a,!0,b)},
$S:125}
A.lt.prototype={
$1(a){return t.n6.a(a).a===this.a},
$S:42}
A.lm.prototype={
$4(a,b,c,d){var s,r,q,p,o,n,m,l,k,j=this
for(s=j.a,r=s.i9(a,j.b),q=r.length,p=j.d===1,o=j.c,n=s.a,s=s.f,m=0;m<r.length;r.length===q||(0,A.i)(r),++m){l=r[m]
if(l>=n.getUint16(s,!1))continue
k=p?0:b
if(!(k<o.length))return A.a(o,k)
B.a.j(o[k],new A.b1(l,c,d,!0))}},
$S:85}
A.ln.prototype={
$1(a){return t.n6.a(a).a===this.a},
$S:42}
A.lo.prototype={
$0(){return new A.bt(this.a,0,!0,!1)},
$S:86}
A.lp.prototype={
$1(a){return this.a.ej(A.v(a))===this.b.a},
$S:15}
A.lq.prototype={
$0(){return-1},
$S:8}
A.lr.prototype={
$2(a,b){var s=t.jt
return s.a(a).a-s.a(b).a},
$S:87}
A.X.prototype={
ap(){return"BidiClass."+this.b}}
A.i4.prototype={}
A.d5.prototype={}
A.b7.prototype={
sa8(a){this.Q=t.h9.a(a)}}
A.c7.prototype={
iu(a,b,c,d){var s,r,q,p,o,n,m=1/B.b.a3(1,a),l=b*m,k=c*m
for(s=this.c,r="r|"+a+"/"+b+"/"+c+"|",q=0;q<s.length;++q){p=s[q]
o=p.f!=null||p.y||p.c.length===0
n=""+p.a
p.z=o?r+n+"|"+q:"p|"+n+"|"+p.c+"|"+B.c.U((l+p.d/4096*m)*d)+"|"+B.c.U((k+p.e/4096*m)*d)}},
bO(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=null,d=t.D,c=A.b([],d)
for(s=f.b,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q]
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
for(r=f.c,o=r.length,n=t.g2,q=0;q<r.length;r.length===o||(0,A.i)(r),++q){j=r[q]
i=[j.a,j.b,j.c,j.d,j.e,j.f,j.r,j.w,j.y,j.z,j.x,j.Q]
h=j.as
if(h!=null)i.push(A.b([h.e,h.f,h.r,h.d.length],n))
else i.push(e)
s.push(i)}d=A.b([],d)
for(r=f.d,o=r.length,q=0;q<r.length;r.length===o||(0,A.i)(r),++q){g=r[q]
n=g.b
i=g.e
d.push([g.r,g.w,g.x,g.y,g.z,g.a,J.oN(B.o.gaz(n),n.byteOffset,n.length),i.a,i.b,i.c,i.d,g.f])}r=f.fK()
o=f.a
return[c,s,d,r,o==null?e:o.bO()]},
fK(){var s,r,q,p,o,n,m,l
for(s=this.c,r=s.length,q=0,p=0;p<r;++p){o=s[p].as
o=o==null?null:o.d.length
q+=o==null?0:o}if(q===0)return null
n=new Float32Array(q)
for(m=0,p=0;p<s.length;s.length===r||(0,A.i)(s),++p){o=s[p].as
l=o==null?null:o.d
if(l==null)continue
B.n.bR(n,m,l)
m+=l.length}return n}}
A.i7.prototype={}
A.hL.prototype={
giz(a){var s=this.b
s===$&&A.h()
return s},
giN(a){var s=this.c
s===$&&A.h()
return s},
iA(a,b){return this.giz(this).$1(b)},
iO(a,b){return this.giN(this).$1(b)}}
A.b8.prototype={
shZ(a){this.e=t.nw.a(a)}}
A.jF.prototype={
eR(a,b){var s,r=this,q=r.a.b,p=t.gz.a(A.a9(q+2,B.a5,!1,t.kp))
r.b!==$&&A.at()
r.b=p
B.a.m(p,q+1,a)
for(;q>=0;--q){s=q+1
if(!(s<p.length))return A.a(p,s)
B.a.m(p,q,r.fH(p[s],q))}},
ea(a){var s=this.f.h(0,a)
s=s==null?null:s.e
return s==null?B.a5:s},
ix(a,b,c){var s={},r=A.b([],t.r)
s.a=0
B.a.Z(this.ea(a),new A.jH(s,r,b,c))
return r},
dY(a,b){var s,r=a.d
if(J.l(r.h(0,"cluster"),!0))return r.h(0,b.a)
s=this.d
s.sa8(r)
return b.iA(0,s)},
hJ(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
t.kp.a(b)
s=t.N
r=t.O
q=A.A(s,r)
for(p=f.c,o=p.length,n=f.d,m=0;m<p.length;p.length===o||(0,A.i)(p),++m){l=p[m]
k=f.dY(a,l)
for(j=b.length,i=l.a,h=0;h<b.length;b.length===j||(0,A.i)(b),++h){g=f.dY(b[h],l)
n.f=k
n.sa8(A.j4([i,g],s,r))
k=l.iO(0,n)}q.m(0,i,k)}return q},
fH(b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3=this
t.kp.a(b4)
s=b3.a
r=s.a/(512*B.b.a3(1,b5))
q=A.A(t.S,t.L)
p=new A.jG(r)
for(o=t.X,n=0;m=b4.length,n<m;++n){m=b4[n]
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
B.a.a1(i)
c=d.c
for(b=d.a,a=d.b,a0=c,a1=-1;a1<=1;++a1)for(a2=a+a1*r,a3=-1;a3<=1;++a3){a4=q.h(0,p.$2(b+a3*r,a2))
if(a4==null)continue
for(a5=a4.length,a6=0;a6<a4.length;a4.length===a5||(0,A.i)(a4),++a6){a7=a4[a6]
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
a=A.A(g,f)
if(o.length===0)a2=null
else{a2=A.b([],l)
for(a5=i.length,a6=0;a6<i.length;i.length===a5||(0,A.i)(i),++a6){a7=i[a6]
if(!(a7>=0&&a7<b4.length))return A.a(b4,a7)
a2.push(b4[a7])}a2=b3.hJ(d,a2)}if(a2!=null)a.v(0,a2)
a.m(0,"$id",b)
a.m(0,"cluster",!0)
a.m(0,"cluster_id",b)
a.m(0,"point_count",a0)
if(a0>=1e4)a2=""+B.c.M(a0/1000)+"k"
else a2=a0>=1000?A.u(B.c.M(a0/100)/10)+"k":a0
a.m(0,"point_count_abbreviated",a2)
a=new A.b8(b1/a0,b2/a0,a0,a)
a0=A.b([d],l)
for(a2=i.length,a6=0;a6<i.length;i.length===a2||(0,A.i)(i),++a6){a7=i[a6]
if(!(a7>=0&&a7<b4.length))return A.a(b4,a7)
a0.push(b4[a7])}a.shZ(a0)
a.f=b5
h.m(0,b,a)
B.a.j(j,a)}return j}}
A.jH.prototype={
$1(a){var s,r,q=this
t.el.a(a)
s=q.b
if(s.length>=q.c)return
r=a.e
if(r!=null)B.a.Z(r,q)
else if(q.a.a++>=q.d)B.a.j(s,a)},
$S:88}
A.jG.prototype={
$2(a,b){var s=this.a
return B.c.U(a/s)*67108864+B.c.U(b/s)},
$S:89}
A.fi.prototype={}
A.fw.prototype={
hR(c7,c8,c9,d0,d1,d2,d3,d4,d5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4=this,c5={},c6=t.L
c6.a(c9)
c6.a(d0)
if(d1<d2)return
s=c5.a=-1
r=c4.x
r.b=0
q=A.b([],t.X)
c6=c4.e
p=B.b.C(c6.b,4)
o=c4.r
n=o.b
c5.b=c5.c=c5.d=0
c5.e=p
m=new A.ic(c5,c4,r,q)
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
a2=A.bC(c8,a,(d+b)*2)
if(j){a2=A.yl(a2,d5)
b=a2.length/2|0}for(a=a2.length,a3=0,a4=0;a4<b;a4=a5){a5=a4+1
a6=B.b.P(a5,b)
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
g+=a2[a0]*a3/b}}else if(c5.a>=0)B.a.j(q,B.b.C(r.b,2))
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
r.aG(b0,b1);++a4
a8=B.b.P(a4,b)*2
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
a9[a7]=b0-b2}b4=j?A.yu(a9):null
for(a1=b4!=null,b5=0,a4=0;a4<b;++a4){a7=a4*2
if(!(a7<a0))return A.a(a9,a7)
b6=a9[a7]
a8=a7+1
if(!(a8<a0))return A.a(a9,a8)
b7=a9[a8]
if(b6===0&&b7===0)continue
a6=B.b.P(a4+1,b)
if(!(a7<a))return A.a(a2,a7)
a7=a2[a7]
if(!(a8<a))return A.a(a2,a8)
a8=a2[a8]
b8=a6*2
if(!(b8>=0&&b8<a))return A.a(a2,b8)
b9=a2[b8];++b8
if(!(b8<a))return A.a(a2,b8)
c6.ah(a7,a8,b9,a2[b8])
b8=b6*b6+b7*b7
c0=Math.sqrt(b8)
if(b5+c0>16384)b5=0
a7=B.c.L(b5*2)
b5+=c0
k.aG(B.c.L(b5*2)/2,a7/2)
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
l.ah(b8,b9,c1,b4[a7])}else{c2=Math.sqrt(b8)
a7=b6/c2
a8=b7/c2
l.ah(a7,a8,a7,a8)}}}m.$0()
c3=B.b.C(c6.b,4)-p
if(c3===0||f===0)return
if(d4!=null){c6=c4.ax
s=B.a.aT(c6,d4)
if(s<0){s=c6.length
B.a.j(c6,d4)}}B.a.j(c4.at,s)
c6=c4.w
c6.ah(d1,d2,h/f,g/f)
c6.ah(p,c3,n,o.b-n)
o=d3.d
c6.ah(d3.a*o,d3.b*o,d3.c*o,1)},
ig(e2,e3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9=this,e0={},e1=d9.w
if(e1.b===0)return null
s=d9.e
r=new Float32Array(A.N(A.bC(s.a,0,s.b)))
q=new Float32Array(A.N(A.bC(e1.a,0,e1.b)))
if(!e3){e1=d9.f
e1=new Float32Array(A.N(A.bC(e1.a,0,e1.b)))
s=d9.r
s=new Float32Array(A.N(A.bC(s.a,0,s.b)))
p=new Float32Array(0)
o=new Uint32Array(0)
n=A.q1(r,q)
m=A.W(d9.ax,t.N)
return A.q2(d9.a,r,e1,s,q,p,o,n,m)}for(p=e1.b,o=e1.a,n=o.length,l=0,k=0,j=0;j<p;j+=12){m=j+5
if(!(m<n))return A.a(o,m)
m=B.c.N(o[m])
i=j+7
if(!(i<n))return A.a(o,i)
i=B.c.N(o[i])
l+=m*4+i
k+=m*6+i}h=new Float32Array(l*13)
g=new Uint32Array(k)
p=d9.f
o=B.b.C(p.b,2)
f=new Int32Array(o)
B.a6.ak(f,0,o,-1)
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
a8=B.c.H(B.c.L(a0[a3]*255),0,255)
a3=B.c.M(a5*255)
a0=B.c.M(a6*255)
a1=B.c.M(a7*255)
a9=B.b.C(j,12)
if(!(a9<b.length))return A.a(b,a9)
b0=new A.id(e0,d9,h,a3+a0*256+a1*65536,a8,a4,a2,b[a9]+1)
a9=j+4
a1=e1.a
a0=a1.length
if(!(a9<a0))return A.a(a1,a9)
b1=B.c.N(a1[a9])
a9=j+5
if(!(a9<a0))return A.a(a1,a9)
for(a0=b1+B.c.N(a1[a9]),b2=a4*d,b3=a2*d,b4=b1;b4<a0;++b4){a1=b4*4
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
d0=B.b.C(e0.a,13)
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
d2=B.c.N(a1[a0])
a0=j+7
if(!(a0<a3))return A.a(a1,a0)
for(a0=d2+B.c.N(a1[a0]),b4=d2;b4<a0;++b4,a=d1){a1=n.a
if(!(b4>=0&&b4<a1.length))return A.a(a1,b4)
d3=B.c.N(a1[b4])
if(!(d3>=0&&d3<o))return A.a(f,d3)
if(f[d3]<0){a1=B.b.C(e0.a,13)
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
g[a]=a1}}d6=B.n.F(h,0,e0.a)
d7=B.o.F(g,0,a)
if(e2>0){d8=A.u9(d6,d7,e2)
d6=d8.a
d7=d8.b}e1=new Float32Array(A.N(A.bC(p.a,0,p.b)))
n=new Float32Array(A.N(A.bC(n.a,0,n.b)))
s=A.q1(r,q)
p=A.W(d9.ax,t.N)
return A.q2(d9.a,r,e1,n,q,d6,d7,s,p)}}
A.ic.prototype={
$0(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=f.a,d=e.b
if(d>0){s=Math.floor(e.d/d)
r=Math.floor(e.c/e.b)
for(q=e.e,d=f.b,p=d.e,o=d.Q;q<B.b.C(p.b,4);++q)o.aG(s,r)
if(e.a>=0&&f.c.b>=6)for(p=f.c,d=d.as,n=0;n<B.b.C(p.b,2);++n)d.aG(s,r)}e.b=e.d=e.c=0
d=f.b
e.e=B.b.C(d.e.b,4)
if(e.a<0||f.c.b<6){f.c.b=0
B.a.a1(f.d)
e.a=-1
return}p=f.c
o=f.d
m=A.q9(B.v.F(p.a,0,p.b),o)
l=d.f
k=l.b
j=B.b.C(k,2)
k+=p.b
if(k>l.a.length)l.bv(k)
k=l.a
i=l.b
B.v.R(k,i,i+p.b,p.a)
l.b=l.b+p.b
for(l=m.length,d=d.r,h=0;h<m.length;m.length===l||(0,A.i)(m),++h){g=m[h]
k=d.b
if(k===d.a.length)d.bv(k+1)
k=d.a
i=d.b++
k.$flags&2&&A.r(k)
if(!(i<k.length))return A.a(k,i)
k[i]=j+g}p.b=0
B.a.a1(o)
e.a=-1},
$S:0}
A.id.prototype={
$10(a,b,c,d,e,f,g,h,i,j){var s,r,q=this,p=q.c,o=q.a,n=o.a,m=o.a=n+1
p.$flags&2&&A.r(p)
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
n=n.c?B.c.H((f+Math.max(0,q.f))*Math.sqrt(Math.max(0,q.r)/150),0.7+0.28*(1-n.b.a),1):1}if(!(m<s))return A.a(p,m)
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
$S:90}
A.bE.prototype={
dg(a){var s,r,q,p,o,n,m,l,k,j=this,i="geometry",h=t.f
if(!h.b(a))return
switch(a.h(0,"type")){case"FeatureCollection":s=a.h(0,"features")
if(t.j.b(s))J.oO(s,j.gfI())
break
case"Feature":r=a.h(0,"properties")
q=A.A(t.N,t.O)
if(h.b(r))for(p=r.ga7(),p=p.gp(p);p.l();){o=p.gn()
q.m(0,A.u(o.a),o.b)}if(j.b)n=j.c++
else{p=j.a
n=p!=null?q.h(0,p):a.h(0,"id")}q.a5(0,"$id")
if(n!=null)q.m(0,"$id",n)
m=j.d
if(m!=null){l=a.h(0,i)
p=j.e
p.sa8(q)
k=h.b(l)?l.h(0,"type"):null
A:{if("Point"===k||"MultiPoint"===k){h="Point"
break A}if("LineString"===k||"MultiLineString"===k){h="LineString"
break A}if("Polygon"===k||"MultiPolygon"===k){h="Polygon"
break A}h=""
break A}p.c=h
if(!m.$1(p))return}j.c9(a.h(0,i),q)
break
default:j.c9(a,B.e)}},
c9(a,b){var s,r,q,p,o,n,m,l=this
t.U.a(b)
if(!t.f.b(a))return
s=a.h(0,"coordinates")
switch(a.h(0,"type")){case"Point":l.aO(1,b,A.b([A.fz([s])],t.w))
break
case"MultiPoint":if(t.j.b(s))l.aO(1,b,A.b([A.fz(s)],t.w))
break
case"LineString":if(t.j.b(s))l.aO(2,b,A.b([A.fz(s)],t.w))
break
case"MultiLineString":r=t.j
if(r.b(s)){q=A.b([],t.w)
for(p=J.B(s);p.l();){o=p.gn()
if(r.b(o))q.push(A.fz(o))}l.aO(2,b,q)}break
case"Polygon":if(t.j.b(s))l.aO(3,b,l.df(s))
break
case"MultiPolygon":r=t.j
if(r.b(s)){q=A.b([],t.w)
for(p=J.B(s);p.l();){n=p.gn()
if(r.b(n))B.a.v(q,l.df(n))}l.aO(3,b,q)}break
case"GeometryCollection":m=a.h(0,"geometries")
if(t.j.b(m))for(r=J.B(m);r.l();)l.c9(r.gn(),b)
break}},
df(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=A.b([],t.w)
for(s=J.n(a),r=t.j,q=0;q<s.gk(a);++q){p=s.h(a,q)
if(!r.b(p))continue
o=A.fz(p)
n=o.length
if(n<6)continue
if(A.ue(o)>0!==(q===0))for(m=n-2,n=o.$flags|0,l=0;l<m;l+=2,m-=2){k=o[l]
j=l+1
i=o[j]
h=o[m]
n&2&&A.r(o)
o[l]=h
h=m+1
o[j]=o[h]
o[m]=k
o[h]=i}B.a.j(g,o)}return g},
aO(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
t.U.a(b)
t.lt.a(c)
if(this.r&&a===1){for(s=c.length,r=this.w,q=0;q<c.length;c.length===s||(0,A.i)(c),++q){p=c[q]
for(o=p.length,n=0;n<o;n+=2){m=p[n]
l=n+1
if(!(l<o))return A.a(p,l)
B.a.j(r,new A.b8(m,p[l],1,b))}}return}for(s=c.length,k=1/0,j=1/0,i=-1/0,h=-1/0,q=0;q<s;++q){p=c[q]
for(r=p.length,n=0;n<r;n+=2){g=p[n]
if(g<k)k=g
if(g>i)i=g
o=n+1
if(!(o<r))return A.a(p,o)
f=p[o]
if(f<j)j=f
if(f>h)h=f}}if(k>i)return
B.a.j(this.f,new A.hs(a,b,c,k,j,i,h))},
ar(a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=B.b.a3(1,a5),b=d.y/4096/c,a=d.z/4096/c,a0=a6/c,a1=a7/c,a2=(a6+1)/c,a3=(a7+1)/c,a4=A.b([],t.Z)
for(s=d.f,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q]
o=p.a===2?a:b
for(n=p.d,m=1+o,l=p.f,k=-o,j=l<=1,i=n>=0,h=0;h<3;++h){g=B.bC[h]
f=g!==0
if(f&&n+g>m)continue
if(f&&l+g<k)continue
if(g<0&&j)continue
if(g>0&&i)continue
d.fb(p,g,c,a6,a7,o,a0,a1,a2,a3,a4)}}s=d.x
if(s==null)s=null
else{r=s.b
r===$&&A.h()
s=B.b.H(a5,0,s.a.b+1)
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]}if(s==null)s=B.a5
r=s.length
n=t.w
m=a0-b
l=a2+b
k=a1-b
j=a3+b
q=0
for(;q<s.length;s.length===r||(0,A.i)(s),++q){e=s[q]
i=e.a
f=!0
if(!(i<m))if(!(i>l)){f=e.b
f=f<k||f>j}if(f)continue
f=new Float64Array(2)
f[0]=B.c.L((i*c-a6)*4096*2)/2
f[1]=B.c.L((e.b*c-a7)*4096*2)/2
B.a.j(a4,new A.dy(null,1,e.d,A.b([f],n)))}return a4.length===0?B.aL:A.b([new A.hz(a4)],t.c)},
fb(a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
t.dg.a(a9)
if(a.f+a0<a5-a4||a.d+a0>a7+a4||a.r<a6-a4||a.e>a8+a4)return
s=A.b([],t.w)
r=a.a
q=r===2?A.b([],t.n):null
for(p=a.c,o=p.length,n=t.n,m=0;m<p.length;p.length===o||(0,A.i)(p),++m){l=p[m]
k=l.length
j=new Float64Array(k)
for(i=0;i<k;i+=2){h=B.c.L(((l[i]+a0)*a1-a2)*4096*2)
if(!(i<k))return A.a(j,i)
j[i]=h/2
h=i+1
if(!(h<k))return A.a(l,h)
g=B.c.L((l[h]*a1-a3)*4096*2)
if(!(h<k))return A.a(j,h)
j[h]=g/2}switch(r){case 1:B.a.j(s,j)
break
case 2:f=A.b([],n)
e=this.fc(j,s,f)
for(k=f.length,h=1/e,g=e===0,d=0;d<f.length;f.length===k||(0,A.i)(f),++d){c=f[d]
q.toString
B.a.j(q,g?0:c/e)
B.a.j(q,g?0:h)}break
default:b=this.fd(j)
if(b.length>=6)B.a.j(s,b)}}if(s.length!==0)B.a.j(a9,new A.dy(q,r,a.b,s))},
fc(a,b,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c={}
t.lt.a(b)
t.o.a(a0)
c.a=A.b([],t.n)
c.b=0
s=new A.ir(c,b,a0)
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
e=new A.iq(m)
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
fd(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d
for(s=this.y,r=4096+s,s=-s,q=t.n,p=a,o=0;o<4;++o){n=A.b([],q)
m=new A.is(this,o)
l=p.length
if(l<6)return new Float64Array(0)
k=p[l-2]
j=p[l-1]
i=m.$2(k,j)
for(h=0;h<l;h+=2,i=d,j=e,k=g){g=p[h]
f=h+1
if(!(f<l))return A.a(p,f)
e=p[f]
d=m.$2(g,e)
if(d!==i){switch(o){case 0:f=(s-k)/(g-k)
break
case 1:f=(r-k)/(g-k)
break
case 2:f=(s-j)/(e-j)
break
default:f=(r-j)/(e-j)
break}B.a.j(n,k+(g-k)*f)
B.a.j(n,j+(e-j)*f)}if(d){B.a.j(n,g)
B.a.j(n,e)}}p=new Float64Array(A.N(n))}return p}}
A.ir.prototype={
$0(){var s=this.a,r=s.a
if(r.length>=4){B.a.j(this.b,new Float64Array(A.N(r)))
B.a.j(this.c,s.b)}s.a=A.b([],t.n)},
$S:0}
A.iq.prototype={
$2(a,b){var s,r=this.a
if(!r.c)return
if(a===0){if(b<0)r.c=!1
return}s=b/a
if(a<0){if(s>r.b)r.c=!1
else if(s>r.a)r.a=s}else if(s<r.a)r.c=!1
else if(s<r.b)r.b=s},
$S:17}
A.is.prototype={
$2(a,b){var s=this.a.y
switch(this.b){case 0:s=a>=-s
break
case 1:s=a<=4096+s
break
case 2:s=b>=-s
break
default:s=b<=4096+s
break}return s},
$S:18}
A.hs.prototype={}
A.hz.prototype={
gai(){return""},
gaS(){return 4096},
$ibr:1,
gaI(){return this.a}}
A.dy.prototype={
aH(a){return this.c},
aW(a){var s,r,q,p,o,n,m,l,k
for(s=this.d,r=s.length,q=a.c,p=0;p<s.length;s.length===r||(0,A.i)(s),++p){o=s[p]
B.a.j(q,a.b>>>1)
for(n=o.length,m=0;m<n;m+=2){l=o[m]
k=m+1
if(!(k<n))return A.a(o,k)
a.bb(l,o[k])}}B.a.j(q,a.b>>>1)},
$ibN:1,
ga_(){return this.b}}
A.iI.prototype={}
A.iJ.prototype={
bO(){var s,r,q,p,o,n=this,m=n.b
m=J.oN(B.o.gaz(m),m.byteOffset,m.length)
s=A.b([],t.D)
for(r=n.r,q=r.length,p=0;p<r.length;r.length===q||(0,A.i)(r),++p){o=r[p]
s.push([o.a,o.b])}return[n.a,m,s,n.w,n.f,n.e]}}
A.iK.prototype={
$1(a){return B.b.H(B.c.M(a*128),-2048,2047)+2048},
$S:27}
A.iX.prototype={
ew(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.b
if(c!=null&&f!=null){s=g.fG(a,b,c,f,d)
if(s!=null)return s}r=A.og(b)
q=a.z?r.toUpperCase():r
p=A.pB(q,a.at)
if(f!=null){o=f.cD(a.y)
n=A.b([],t.X)
m=A.W(new A.aq(q),t.J.i("j.E"))
m=A.rW(m)
l=m.length
k=0
for(;k<m.length;m.length===l||(0,A.i)(m),++k){j=m[k]
if(j>=0)n.push(j)}if(f.cK(o,A.bq(n,0,null))){for(m=n.length,l=f.x,s=0,i=0,k=0;k<n.length;n.length===m||(0,A.i)(n),++k){h=l.e8(o,n[k])
if(h!=null){s+=h.r/24+p;++i}}return i===0?0:s-p}g.d=!0}n=g.e
m=n.h(0,b)
if(m==null){m=new A.iY(g,b,q,a,p).$0()
n.m(0,b,m)
n=m}else n=m
return n},
fG(a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=null,a2=A.b([],t.X),a3=A.W(new A.aq(a5),t.J.i("j.E"))
a3=A.rW(a3)
s=a3.length
r=0
for(;r<a3.length;a3.length===s||(0,A.i)(a3),++r){q=a3[r]
if(q>=0)a2.push(q)}p=A.pB(A.og(a5),a4.at)
for(a3=a7.x,s=a4.z,o=a4.y,n=t.j,m=t.N,l=0,k=0,j=0;i=a2.length,j<i;++j){h=a2[j]
if(h===57344&&j+1<i){++j
if(!(j<i))return A.a(a2,j)
k=a2[j]-57600
continue}i=a6.length
if(k<i){if(!(k>=0))return A.a(a6,k)
g=a6[k]}else g=a1
i=n.b(g)
if(i){f=A.f3(J.R(g,0))
if(f==null)f=a1
e=f==null?1:f}else e=1
if(h===57599){d=i&&J.S(g)>4?J.R(g,4):a1
if(typeof d=="string"){i=this.c.h(0,d)
c=i==null?a1:i.a}else c=a1
if(c!=null)l+=c*e/a8+p
continue}b=a7.cD(i&&n.b(J.R(g,1))?J.bx(n.a(J.R(g,1)),m):o)
if(s){a=new A.aq(A.O(h).toUpperCase()).gp(0)
if(!a.l())A.aF(A.ae())
q=a.gn()}else q=h
if(!a7.cK(b,A.O(q))){this.d=!0
return a1}a0=a3.e8(b,q)
if(a0!=null)l+=(a0.r/24+p)*e}return l},
sio(a){this.c=t.h.a(a)}}
A.iY.prototype={
$0(){var s,r=this,q=r.a.a
if(q==null)return new A.aq(r.b).gk(0)*0.55
s=r.d
s=A.rY(q,r.c,0,r.e,1.2,1/0,!0,s.y,s.w)
s=s==null?null:s.e
return s==null?new A.aq(r.b).gk(0)*0.55:s},
$S:92}
A.cJ.prototype={
siR(a){this.x=t.iu.a(a)}}
A.oc.prototype={
$3$end(a,b,c){var s,r,q=a+":",p=b.length
if(c){s=p-2
if(!(s>=0))return A.a(b,s)
s=b[s]
r=p-1
if(!(r>=0))return A.a(b,r)
r=q+A.u(s)+":"+A.u(b[r])
q=r}else{if(0>=p)return A.a(b,0)
s=b[0]
if(1>=p)return A.a(b,1)
s=q+A.u(s)+":"+A.u(b[1])
q=s}return q},
$S:93}
A.mt.prototype={
$1(a){return Math.floor(a*2+0.5)/2},
$S:3}
A.ms.prototype={
$0(){var s=this.a.a
if(s!=null&&s.length>=4)B.a.j(this.b,new Float32Array(A.N(s)))},
$S:0}
A.lK.prototype={
$1(a){var s=this.a,r=a*2
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
$S:6}
A.lL.prototype={
$1(a){var s=this.a,r=a*2+1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
$S:6}
A.lJ.prototype={
$4(a,b,c,d){var s=c-a,r=d-b
return Math.sqrt(s*s+r*r)},
$S:124}
A.ho.prototype={}
A.lU.prototype={
$2(a,b){return A.v(a)+A.v(b)},
$S:30}
A.hE.prototype={
cT(a){var s,r=a-4
if(r<0||r>=this.b.length)throw A.f(B.bn)
s=this.b
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
ei(a,b){var s,r,q,p,o,n=A.A(t.N,t.O)
for(s=this.a,r=a;r<b;r=o){if(!(r>=0&&r<s.length))return A.a(s,r)
q=this.cT(s[r])
if(typeof q!="string")throw A.f(B.bm)
p=this.cN(r+1,b)
o=p.b
n.m(0,q,p.a)}return n},
cN(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
if(a>=b)throw A.f(B.bp)
s=i.a
r=s.length
if(!(a>=0&&a<r))return A.a(s,a)
q=s[a]
if(0===q)return new A.e(!1,a+1)
if(1===q)return new A.e(!0,a+1)
if(2===q||3===q){p=a+1
if(p<b){if(!(p<r))return A.a(s,p)
o=s[p]
o=o<2||a+o>b}else o=!0
if(o)throw A.f(B.bf)
if(!(p<r))return A.a(s,p)
n=a+s[p]
if(q===2)return new A.e(i.ei(a+2,n),n)
m=[]
l=a+2
for(;l<n;l=j){k=i.cN(l,n)
j=k.b
m.push(k.a)}return new A.e(m,n)}return new A.e(i.cT(q),a+1)}}
A.hD.prototype={
eU(a,b,c,d,e,f){var s,r,q=this,p=A.b([],t.Z)
for(s=q.f.a.length,r=0;r<s;++r)p.push(new A.hC(q,r))
t.dg.a(p)
q.r!==$&&A.at()
q.r=p},
gaI(){var s=this.r
s===$&&A.h()
return s},
$ibr:1,
gai(){return this.a},
gaS(){return this.b}}
A.hC.prototype={
ga_(){var s,r=this.a.f.a,q=this.b
if(!(q<r.length))return A.a(r,q)
s=r[q]
A:{if(0===s||3===s){r=1
break A}if(1===s||4===s){r=2
break A}r=3
break A}return r},
aH(a){var s,r,q,p,o,n,m=this,l=m.a,k=l.c,j=k!=null&&m.b<J.S(k.a)?k.$ti.y[1].a(J.R(k.a,m.b)):null,i=A.A(t.N,t.O)
if(j!=null)i.m(0,"$id",j)
for(s=l.d,r=m.b,l=l.e,q=0;q<s.length;++q){if(!(q<l.length))return A.a(l,q)
p=l[q]
o=J.n(p)
n=r<o.gk(p)?o.h(p,r):null
if(n!=null){if(!(q<s.length))return A.a(s,q)
i.m(0,s[q],n)}}return i},
aW(a){var s,r,q,p,o,n,m,l=this.a.f,k=l.b,j=l.d,i=this.b,h=j.length
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
a.bb(m,k[n])}}B.a.j(p,a.b>>>1)},
$ibN:1}
A.jn.prototype={}
A.l_.prototype={
b4(a){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=h.x
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
B.a.j(g,A.rH(j,p.y)-p.z)
B.a.j(g,A.rH(B.b.I(j,1),p.y)-p.z)}else{if(!(l<k))return A.a(q,l)
i=q[l]*2
if(!(i>=0&&i<r))return A.a(s,i)
B.a.j(g,s[i])
l=i+1
if(!(l<r))return A.a(s,l)
B.a.j(g,s[l])}}}},
cn(a,b){var s,r,q
t.f8.a(a)
if(a==null||b>=a.length)s=0
else{s=a.length
if(!(b>=0&&b<s))return A.a(a,b)
r=a[b]
q=b-1
if(!(q>=0&&q<s))return A.a(a,q)
q=r-a[q]
s=q}return s},
dn(){var s=this
if(s.w)return s.cn(s.d,s.at++)
return s.cn(s.c,s.as)},
hX(){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.a,e=f.length,d=e+1,c=new Int32Array(d)
for(s=g.y,r=g.b,q=t.f8,p=r!=null,o=g.d!=null,n=g.c!=null,m=0;m<e;++m){l=s.length
if(!(m<d))return A.a(c,m)
c[m]=l
switch(f[m]){case 0:g.b4(1)
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
k=i-r[l]}g.b4(k)
g.as+=k
g.at+=k
break
case 1:k=g.dn();++g.as
g.b4(k)
if(p)++g.Q
break
case 2:g.dG()
if(p)++g.Q
break
case 4:l=g.Q++
q.a(r)
if(!p||l>=r.length)k=0
else{j=r.length
if(!(l<j))return A.a(r,l)
i=r[l];--l
if(!(l>=0&&l<j))return A.a(r,l)
k=i-r[l]}for(;k>0;--k){h=g.dn();++g.as
g.b4(h)}break
case 5:l=g.Q++
q.a(r)
if(!p||l>=r.length)k=0
else{j=r.length
if(!(l<j))return A.a(r,l)
i=r[l];--l
if(!(l>=0&&l<j))return A.a(r,l)
k=i-r[l]}for(;k>0;--k)g.dG()
break}}r=s.length
if(!(e<d))return A.a(c,e)
c[e]=r
r=g.x
B.a.j(s,r.length>>>1)
return new A.jn(f,new Int32Array(A.N(r)),new Int32Array(A.N(s)),c)},
dG(){var s,r,q,p,o,n,m=this
for(s=m.cn(m.c,m.as++),r=m.d,q=t.f8;s>0;--s){p=m.at++
q.a(r)
if(r==null||p>=r.length)p=0
else{o=r.length
if(!(p>=0&&p<o))return A.a(r,p)
n=r[p];--p
if(!(p>=0&&p<o))return A.a(r,p)
p=n-r[p]}m.b4(p)}}}
A.l0.prototype={
$1(a){A.v(a)
return a===2||a===5},
$S:15}
A.jo.prototype={}
A.jm.prototype={
A(){var s,r,q,p,o,n,m,l
for(s=this.a,r=s.length,q=0,p=0;p<28;p+=7){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
q=(q|B.b.aw(n&127,p))>>>0
if(n<128)return q}for(m=268435456,l=4;l<10;++l){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
q+=(n&127)*m
if(n<128)return q
m*=128}throw A.f(B.a1)},
aM(){var s,r=this,q=r.A(),p=r.a,o=r.b
if(q>p.length-o)throw A.f(B.bg)
s=B.R.ee(A.bQ(p,o,o+q),!0)
r.b+=q
return s},
siJ(a){this.b=A.v(a)}}
A.jp.prototype={}
A.ef.prototype={$ibr:1,
gai(){return this.a},
gaS(){return this.b},
gaI(){return this.e}}
A.ee.prototype={
aH(a){var s,r,q,p,o,n,m,l,k=this
t.dl.a(a)
s=A.A(t.N,t.O)
r=k.c
if(r!=null)s.m(0,"$id",r)
r=k.e
q=new A.bY(k.a,k.d,r)
for(p=a.c,o=a.d;q.b<r;){n=q.A()
m=q.A()
if(!(n<p.length))return A.a(p,n)
l=p[n]
if(!(m<o.length))return A.a(o,m)
s.m(0,l,o[m])}return s},
aW(a){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=h.r,f=new A.bY(h.a,h.f,g),e=h.b===1
if(e)B.a.j(a.c,a.b>>>1)
for(s=!e,r=a.c,q=0,p=0;f.b<g;){o=f.A()
n=o&7
m=o>>>3
if(n===1)for(l=0;l<m;++l){k=f.A()
j=f.A()
i=k>>>1
q+=(k&1)===0?i:-i-1
i=j>>>1
p+=(j&1)===0?i:-i-1
if(s)B.a.j(r,a.b>>>1)
a.bb(q,p)}else if(n===2)for(l=0;l<m;++l){k=f.A()
j=f.A()
i=k>>>1
q+=(k&1)===0?i:-i-1
i=j>>>1
p+=(j&1)===0?i:-i-1
a.bb(q,p)}}B.a.j(r,a.b>>>1)},
$ibN:1,
ga_(){return this.b}}
A.e4.prototype={
bb(a,b){var s,r,q=this,p=q.b,o=q.a,n=o.length
if(p+2>n){s=new Float64Array(n*2)
B.v.R(s,0,p,o)
q.a=s
p=s}else p=o
o=q.b
n=q.b=o+1
p.$flags&2&&A.r(p)
r=p.length
if(!(o<r))return A.a(p,o)
p[o]=a
q.b=n+1
if(!(n<r))return A.a(p,n)
p[n]=b}}
A.bY.prototype={
A(){var s,r,q,p,o,n,m,l
for(s=this.a,r=s.length,q=0,p=0;p<28;p+=7){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
q=(q|B.b.aw(n&127,p))>>>0
if(n<128)return q}for(m=268435456,l=4;l<10;++l){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
q+=(n&127)*m
if(n<128)return q
m*=128}throw A.f(B.a1)},
ac(a){var s=this.A(),r=this.b
if(s>this.c-r)throw A.f(B.aD)
return s},
aM(){var s=this,r=s.ac(0),q=s.b,p=B.R.ed(A.bQ(s.a,q,q+r))
s.b+=r
return p},
T(a,b){var s,r=this
switch(b){case 0:r.A()
break
case 1:r.b+=8
break
case 2:s=r.ac(0)
r.b+=s
break
case 5:r.b+=4
break}}}
A.jC.prototype={
gdL(){var s=this.a
return B.d.an(s,"http://")||B.d.an(s,"https://")},
ar(a,b,a0){var s=0,r=A.aj(t.p),q,p=this,o,n,m,l,k,j,i,h,g,f,e,d,c
var $async$ar=A.ak(function(a1,a2){if(a1===1)return A.ag(a2,r)
for(;;)switch(s){case 0:f=p.r
s=3
return A.I(f==null?p.r=p.aQ():f,$async$ar)
case 3:e=a2
if(a<e.f||a>e.r){q=new Uint8Array(0)
s=1
break}o=A.uP(a,b,a0)
n=e.a
f=p.w,m=e.b,l=e.d,k=A.q(f).i("aH<1>"),j=0
case 4:if(!(j<4)){s=6
break}i=A.uO(n,o)
if(i==null){q=new Uint8Array(0)
s=1
break}h=i.b
s=h>0?7:8
break
case 7:if(o>=i.a+h){q=new Uint8Array(0)
s=1
break}d=A
s=9
return A.I(p.aE(e.c+i.c,i.d),$async$ar)
case 9:q=d.ek(a2,e.e)
s=1
break
case 8:h=i.c
n=f.h(0,h)
s=n==null?10:11
break
case 10:d=A
c=A
s=13
return A.I(p.aE(m+h,i.d),$async$ar)
case 13:s=12
return A.I(c.ek(a2,l),$async$ar)
case 12:n=d.qC(a2)
f.m(0,h,n)
case 11:if(f.a>48){g=new A.aH(f,k).gp(0)
if(!g.l())A.aF(A.ae())
f.a5(0,g.gn())}case 5:++j
s=4
break
case 6:q=new Uint8Array(0)
s=1
break
case 1:return A.ah(q,r)}})
return A.ai($async$ar,r)},
aQ(){var s=0,r=A.aj(t.iM),q,p=this,o,n,m,l,k,j,i,h,g,f,e,d
var $async$aQ=A.ak(function(a,b){if(a===1)return A.ag(b,r)
for(;;)switch(s){case 0:s=3
return A.I(p.aE(0,16384),$async$aQ)
case 3:h=b
g=h.length
f=!0
if(g>=127)if(A.bq(B.E.F(h,0,7),0,null)==="PMTiles"){if(7>=g){q=A.a(h,7)
s=1
break}f=h[7]!==3}if(f)throw A.f(B.be)
f=new A.jE(A.c8(h,0,null))
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
return A.I(p.aE(o,n),$async$aQ)
case 8:case 6:s=4
return A.I(d.ek(b,m),$async$aQ)
case 4:l=e.qC(b)
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
break}q=new A.hw(l,k,f,m,j,i,h[101])
s=1
break
case 1:return A.ah(q,r)}})
return A.ai($async$aQ,r)},
aE(a,b){var s=0,r=A.aj(t.p),q,p=this,o,n,m,l,k,j
var $async$aE=A.ak(function(c,d){if(c===1)return A.ag(d,r)
for(;;)switch(s){case 0:if(!p.gdL()){o=p.f
q=(o==null?p.f=new A.ig(p.a):o).iM(a,b)
s=1
break}o=p.d
n=p.a
m=t.N
m=A.uu(p.c,m,m)
l=a+b
m.m(0,"range","bytes="+a+"-"+(l-1))
m.m(0,"accept-encoding","identity")
s=3
return A.I(o.eF(n,m,B.bb),$async$aE)
case 3:k=d
o=k.a
if(o!==206&&o!==200)throw A.f(A.qk(o,n))
j=k.b
q=o===200&&j.length>b?A.bQ(j,a,B.b.H(l,0,j.length)):j
s=1
break
case 1:return A.ah(q,r)}})
return A.ai($async$aE,r)}}
A.jE.prototype={
$1(a){var s=this.a
return s.getUint32(a,!0)+s.getUint32(a+4,!0)*4294967296},
$S:20}
A.jD.prototype={
$0(){var s,r,q,p,o,n,m,l
for(s=this.b,r=this.a,q=s.length,p=0,o=1,n=0;n<10;++n){m=r.a++
if(!(m<q))return A.a(s,m)
l=s[m]
p+=(l&127)*o
if(l<128)return p
o*=128}throw A.f(B.a1)},
$S:8}
A.hw.prototype={}
A.eF.prototype={
gk(a){return this.d}}
A.bU.prototype={}
A.ld.prototype={
bf(a){var s,r,q,p,o,n=this.a
B.a.j(n,a)
s=n.length-1
for(;s>0;s=r){r=B.b.I(s-1,1)
if(!(r<n.length))return A.a(n,r)
q=n[r]
p=q.e
p===$&&A.h()
o=a.e
o===$&&A.h()
if(p>=o)break
if(!(s>=0&&s<n.length))return A.a(n,s)
n[s]=q}B.a.m(n,s,a)},
iI(){var s,r,q,p,o,n,m,l,k,j=this.a,i=B.a.gt(j)
if(0>=j.length)return A.a(j,-1)
s=j.pop()
r=j.length
if(r!==0){for(q=0;;q=k){p=q*2+1
o=p+1
n=s.e
n===$&&A.h()
if(p<r){if(!(p<j.length))return A.a(j,p)
m=j[p].e
m===$&&A.h()
m=m>n}else m=!1
if(m){if(!(p<j.length))return A.a(j,p)
n=j[p].e
n===$&&A.h()
l=n
k=p}else{l=n
k=q}if(o<r){if(!(o<j.length))return A.a(j,o)
n=j[o].e
n===$&&A.h()
n=n>l}else n=!1
if(n)k=o
if(k===q)break
if(!(k>=0&&k<j.length))return A.a(j,k)
n=j[k]
if(!(q>=0&&q<j.length))return A.a(j,q)
j[q]=n}B.a.m(j,q,s)}return i}}
A.kR.prototype={}
A.b_.prototype={}
A.kQ.prototype={
$0(){var s,r=this.a,q=J.n(r),p=q.h(r,2)
p.toString
A.v(p)
s=q.h(r,3)
s.toString
A.v(s)
r=q.h(r,4)
r.toString
return new A.aZ(p,s,A.v(r),0)},
$S:95}
A.kP.prototype={
$1(a){var s=J.R(this.a,a)
s.toString
return A.ac(s)},
$S:6}
A.dP.prototype={}
A.dQ.prototype={}
A.ex.prototype={}
A.e2.prototype={}
A.ew.prototype={}
A.e3.prototype={}
A.ca.prototype={
ap(){return"ClusterQuestion."+this.b}}
A.dO.prototype={}
A.ax.prototype={}
A.hd.prototype={
aY(){var s=this.b
return[this.a,"labels",A.b([s.a,s.b,s.c,s.gaK(),this.c.bO()],t.G)]}}
A.hc.prototype={}
A.h9.prototype={
aY(){return[this.a,"built",this.c.bO()]}}
A.ha.prototype={
q(a){return this.a}}
A.eu.prototype={
aY(){var s=this.c
return[this.a,"failed",A.b([s.a,s.b],t.G)]}}
A.e1.prototype={
aY(){var s,r,q,p,o=A.b([],t.D)
for(s=this.b,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q]
o.push([p.a,p.b,p.c,p.d,p.e,p.f])}return[this.a,"found",o]}}
A.dT.prototype={
aY(){return[this.a,"zoom",this.b]}}
A.d7.prototype={
aY(){var s,r,q,p,o,n=A.b([],t.bo)
for(s=this.b,r=s.length,q=t.G,p=0;p<s.length;s.length===r||(0,A.i)(s),++p){o=s[p]
n.push(A.b([o.a,o.b,o.c],q))}return[this.a,"members",n]}}
A.fm.prototype={}
A.hb.prototype={}
A.ok.prototype={
$2(a,b){var s=this.a
return s>=a&&s<b},
$S:18}
A.mo.prototype={
$2(a,b){var s=this
return a>=s.a&&a<=s.b&&b>=s.c&&b<=s.d},
$S:18}
A.mm.prototype={
$8(a,b,c,d,e,f,g,h){var s=new A.mn(),r=s.$6(e,f,g,h,a,b),q=s.$6(e,f,g,h,c,d),p=s.$6(a,b,c,d,e,f),o=s.$6(a,b,c,d,g,h)
return r>0!==q>0&&p>0!==o>0},
$S:96}
A.mn.prototype={
$6(a,b,c,d,e,f){return(c-a)*(f-b)-(d-b)*(e-a)},
$S:29}
A.ol.prototype={
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
a0=Math.max(2,B.c.ae(Math.abs(a)/0.5235987755982988-0.000001))
for(a5=a4.b,a1=0;a1<=a0;++a1){a2=a*a1/a0
a9=Math.cos(a2)
a3=Math.sin(a2)
B.a.j(a5,i+e*a9-d*a3)
B.a.j(a5,h+e*a3+d*a9)}},
$S:43}
A.oq.prototype={
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
i.$flags&2&&A.r(i)
j=i.length
if(!(c<j))return A.a(i,c)
i[c]=g
g=c+1
h=h?0:m/k
if(!(g<j))return A.a(i,g)
i[g]=h},
$S:43}
A.cH.prototype={
ap(){return"LineJoin."+this.b}}
A.dl.prototype={
ap(){return"LineCap."+this.b}}
A.b0.prototype={
ap(){return"_Join."+this.b}}
A.ec.prototype={}
A.kZ.prototype={
cL(a,b){var s,r,q,p=this,o=p.Q
if(o>0&&o+a>16e3)p.cF()
p.ev(a)
o=p.as
s=o+b
r=p.x
q=r.length
if(s>q){q=Math.max(s,q*2)
q=new Uint16Array(q)
B.ap.R(q,0,o,r)
p.x=q}},
ev(a){var s=this,r=s.Q,q=(r+a)*2,p=s.f,o=p.length
if(q>o){o=Math.max(q,o*2)
o=new Float32Array(o)
B.n.R(o,0,r*2,p)
s.f=o
r=o}else r=p
p=s.a
if(p&&q>s.r.length){r=Math.max(q,r.length)
r=new Float32Array(r)
B.n.R(r,0,s.Q*2,s.r)
s.r=r}if(p&&B.b.C(q,2)>s.w.length){r=B.c.C(Math.max(q,s.f.length),2)
r=new Uint8Array(r)
B.E.R(r,0,s.Q,s.w)
s.w=r}if(s.b&&q>s.d.length){r=Math.max(q,s.f.length)
r=new Float32Array(r)
B.n.R(r,0,s.Q*2,s.d)
s.d=r}if(s.c&&q>s.e.length){r=Math.max(q,s.f.length)
r=new Float32Array(r)
B.n.R(r,0,s.Q*2,s.e)
s.e=r}},
cF(){var s,r,q,p,o,n,m=this,l=null,k=m.a
if(k&&(m.Q&1)===1){m.ev(1)
s=m.f
r=m.Q
q=r*2
s.$flags&2&&A.r(s)
p=s.length
if(!(q>=0&&q<p))return A.a(s,q)
s[q]=0
o=q+1
if(!(o<p))return A.a(s,o)
s[o]=0
s=m.r
s.$flags&2&&A.r(s)
p=s.length
if(!(q<p))return A.a(s,q)
s[q]=0
if(!(o<p))return A.a(s,o)
s[o]=0
s=m.w
s.$flags&2&&A.r(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=2
if(m.b){s=m.d
s.$flags&2&&A.r(s)
if(!(q<s.length))return A.a(s,q)
s[q]=0}if(m.c){s=m.e
s.$flags&2&&A.r(s)
p=s.length
if(!(q<p))return A.a(s,q)
s[q]=0
if(!(o<p))return A.a(s,o)
s[o]=0}m.Q=r+1}if(m.as>0){s=new Float32Array(A.N(A.ij(m.f,0,m.Q*2)))
r=k?new Float32Array(A.N(A.ij(m.r,0,m.Q*2))):l
q=new Uint16Array(A.N(A.qW(m.x,0,m.as)))
p=m.b?new Float32Array(A.N(A.ij(m.d,0,m.Q*2))):l
o=m.c?new Float32Array(A.N(A.ij(m.e,0,m.Q*2))):l
k=k?new Uint8Array(A.N(A.bQ(m.w,0,m.Q))):l
n=m.y
n=n.length===0?l:new Uint16Array(A.N(A.qW(n,0,m.z)))
B.a.j(m.at,new A.ec(n,s,r,q,p,o,k))}m.z=m.as=m.Q=0}}
A.ih.prototype={
e0(a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this
t.L.a(a3)
s=a2-a1
if(s<3||s>65e3)return
r=A.bC(a0,a1*2,a2*2)
q=!a.c
if(!q||a.d){p=a.fq(r,a3)
r=p.a
a3=p.b
s=r.length/2|0
if(s<3||s>65e3)return}o=A.q9(r,a3)
if(o.length===0)return
n=!q||a.d?a.hc(r,o):B.c0
q=a.a
m=n.length
q.cL(s+m,o.length+m*3)
l=q.Q
k=q.f
j=l*2
for(m=s*2,i=r.length,h=k.$flags|0,g=0;g<m;++g,j=f){f=j+1
if(!(g<i))return A.a(r,g)
e=r[g]
h&2&&A.r(k)
if(!(j>=0&&j<k.length))return A.a(k,j)
k[j]=e}d=q.x
c=q.as
for(m=o.length,i=d.$flags|0,g=0;g<m;++g,c=b){b=c+1
h=o[g]
i&2&&A.r(d)
if(!(c<d.length))return A.a(d,c)
d[c]=l+h}if(a.b)a.hq(l,s,a3)
q.Q+=s
q.as=c
if(n.length!==0)a.fE(l,r,n)},
fq(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e
t.L.a(b)
s=t.n
r=A.b([],s)
q=A.b([],t.X)
p=a.length
o=p/2|0
for(n=this.d,m=this.c,l=0;k=b.length,l<=k;++l){j=l===0
if(j)i=0
else{h=l-1
if(!(h>=0))return A.a(b,h)
i=b[h]}g=l<k?b[l]:o
k=A.b([],s)
for(f=i*2,h=g*2;f<h;++f){if(!(f>=0&&f<p))return A.a(a,f)
k.push(a[f])}e=m?A.qa(k,0,!0):k
if(n)e=A.qa(e,4096,!1)
if(e.length<6){if(j)return new A.e(new Float64Array(0),B.U)
continue}if(l>0)B.a.j(q,r.length/2|0)
B.a.v(r,e)}return new A.e(new Float64Array(A.N(r)),q)},
hc(a,b){var s,r,q,p,o,n,m,l,k,j,i
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
if(q&&i===0)B.a.j(s,new A.M(k,j,-32768))
if(r&&i===4096)B.a.j(s,new A.M(k,j,32767))}return s},
fE(a,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
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
l&2&&A.r(r)
c=r.length
if(!(f>=0&&f<c))return A.a(r,f)
r[f]=(e+d)/2;++f
if(!(f<c))return A.a(r,f)
r[f]=i.c
b=o+1
k&2&&A.r(q)
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
hq(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h
t.L.a(c)
s=this.a
r=s.y
q=r.length
p=s.z
o=p+b*2
if(q<o){q=Math.max(o,q*2)
q=new Uint16Array(q)
B.ap.R(q,0,p,r)
s.y=q
r=q}n=s.z
for(q=c.length,p=r.$flags|0,m=0;m<=q;++m){if(m===0)l=0
else{o=m-1
if(!(o>=0))return A.a(c,o)
l=c[o]}k=m<q?c[m]:b
for(j=l;j<k;){i=n+1
p&2&&A.r(r)
o=r.length
if(!(n>=0&&n<o))return A.a(r,n)
r[n]=a+j
n=i+1;++j
h=j<k?j:l
if(!(i>=0&&i<o))return A.a(r,i)
r[i]=a+h}}s.z=n}}
A.ii.prototype={
$1(a){var s=this.b
return this.a?a>=s:a<=s},
$S:22}
A.j2.prototype={
e_(g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9=this
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
q+=Math.sqrt(k*k+j*j)}f9.ct(g0,g1,r+1,g3,g4,g6,g7,g8,g9,h0)
f9.ct(g0,r,g2,g3,g4,g6,g7,g8,s?null:g9+q*h0,h0)
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
o&2&&A.r(s)
if(!(g<m))return A.a(s,g)
s[g]=f;++g
if(!(g<m))return A.a(s,g)
s[g]=e;++h}if(h<2)return
f9.a.cL(h*32+18,h*96+54)
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
s.$flags&2&&A.r(s)
if(!(o>=0&&o<m))return A.a(s,o)
s[o]=n;++o
if(1>=m)return A.a(s,1)
n=s[1]
if(!(o<m))return A.a(s,o)
s[o]=n;++h}b=g6===B.ak?1.05:f9.z
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
a3=A.qw(a1,a2,o,s[1])
a4=a3.a
a5=a3.b}else{a1=0
a2=0
a4=0
a5=0}for(o=g4===B.aj,n=g4===B.ai,l=g6.a,g=g6===B.bz,a6=g5,a7=a6,a8=0,a9=0,b0=!1,b1=0,b2=0,p=0;p<h;++p,a7=!0,a6=!0){d=p<a0
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
if(b3){b7=A.qw(a1,a2,b5,b6)
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
c5=c2<$.te()&&b0&&b3
c6=b1*a5-b2*a4>0
c7=Math.min(c3,2)
c8=b8*c7
c9=b9*c7
d0=B.c.H((c3-3)/5,0,1)
if(c5&&p>0){d1=a1-a8
d2=a2-a9
d3=Math.sqrt(d1*d1+d2*d2)
if(d3>240){d4=120/d3
d5=a1-B.c.L(d1*d4)
d6=a2-B.c.L(d2*d4)
k=d5-a8
j=d6-a9
f9.f=f9.f+Math.sqrt(k*k+j*j)
f9.aa(d5,d6,b1,b2,0,0,b1,b2)
a9=d6
a8=d5}}d7=b0&&b3
if(d7)if(g)d8=B.at
else{if(!(l<8))return A.a(B.aI,l)
d9=B.aI[l]
d8=d9}else if(g5)d8=B.ab
else{if(n)d9=B.a8
else d9=o?B.av:B.ab
d8=d9}if(d7&&d8===B.a8)if(c3<a)d8=B.Y
else if(c3<=2)d8=B.aa
if(d8===B.Y&&c3>b)d8=B.a9
if(d8===B.a9){if(c3>2)d8=B.au
if(c3<b)d8=B.Y}if(b0){k=a1-a8
j=a2-a9
f9.f=f9.f+Math.sqrt(k*k+j*j)}A:{if(B.Y===d8){f9.aa(a1,a2,b8*c3,b9*c3,0,0,c8,c9)
break A}if(B.au===d8){if(c3>100){e0=-a4
e1=-a5}else{k=b1-a4
j=b2-a5
b4=Math.sqrt(b4)
c4=Math.sqrt(k*k+j*j)
d9=c6?-1:1
d4=c3*b4/c4*d9
e0=-b9*d4
e1=b8*d4}f9.aa(a1,a2,e0,e1,0,0,c8+(e0-c8)*d0,c9+(e1-c9)*d0)
b4=-e0
c4=-e1
f9.aa(a1,a2,b4,c4,0,0,c8+(b4-c8)*d0,c9+(c4-c9)*d0)
break A}if(B.a9===d8||B.aa===d8){e2=-Math.sqrt(c3*c3-1)
e3=c6?e2:0
e4=c6?0:e2
if(b0)f9.aa(a1,a2,b1,b2,e3,e4,c8,c9)
if(d8===B.aa){e5=B.c.M(2*c4*180/3.141592653589793/20)
for(b4=a4-b1,c4=a5-b2,e6=1.0904+c1*(-3.2452+c1*(3.55645-c1*1.43519)),e7=0.848013+c1*(-1.06021+c1*0.215638),d9=-c8,e8=-c9,e9=1;e9<e5;++e9){f0=e9/e5
if(f0!==0.5){f1=f0-0.5
f0+=f0*f1*(f0-1)*(e6*f1*f1+e7)}f2=b4*f0+b1
f3=c4*f0+b2
f4=Math.sqrt(f2*f2+f3*f3)
d4=(c6?-1:1)/f4
f9.d=c6?d9:c8
f9.e=c6?e8:c9
f5=c6?1:0
f9.b9(f9.aq(a1,a2,f2*d4,f3*d4,f5),c6)}}if(b3)f9.aa(a1,a2,a4,a5,-e3,-e4,c8,c9)
break A}if(B.ab===d8){if(!b0)f9.dD(a1,a2,b8,b9,c8,c9,!1)
f9.aa(a1,a2,b8,b9,0,0,c8,c9)
if(b0)f9.dD(a1,a2,b8,b9,c8,c9,!0)
break A}if(B.av===d8){d4=b0?1:-1
f9.aa(a1,a2,b8,b9,d4,d4,c8,c9)
break A}if(B.at===d8){f9.aa(a1,a2,b1,b2,0,0,b1,b2)
f9.ax=f9.ay=-1
f9.aa(a1,a2,a4,a5,0,0,a4,a5)
break A}if(B.a8===d8){if(b0){f6=c8+(b1-c8)*d0
f7=c9+(b2-c9)*d0
f9.aa(a1,a2,b1,b2,0,0,f6,f7)
f9.d=f6
f9.e=f7
f9.dd(a1,a2,b1,b2,3.141592653589793,-1)}if(b3){f6=c8+(a4-c8)*d0
f7=c9+(a5-c9)*d0
f9.d=f6
f9.e=f7
f9.dd(a1,a2,a4,a5,3.141592653589793,1)
f9.ax=f9.ay=-1
f9.aa(a1,a2,a4,a5,0,0,f6,f7)}}}if(c5&&d){d1=b5-a1
d2=b6-a2
f8=Math.sqrt(d1*d1+d2*d2)
if(f8>240){d4=120/f8
d5=a1+B.c.L(d1*d4)
d6=a2+B.c.L(d2*d4)
k=d5-a1
j=d6-a2
f9.f=f9.f+Math.sqrt(k*k+j*j)
f9.aa(d5,d6,a4,a5,0,0,a4,a5)
a2=d6
a1=d5}}}},
ct(a,b,c,d,e,f,g,h,i,j){return this.e_(a,b,c,d,e,!1,f,g,h,i,j)},
hS(a,b,c,d,e){var s=null
return this.e_(a,b,c,d,B.G,e,s,s,s,s,0)},
b9(a,b){var s,r,q,p,o,n=this,m=n.ax
if(m>=0&&n.ay>=0){s=n.a
r=s.x
q=s.as
p=q+1
r.$flags&2&&A.r(r)
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
dD(a,b,c,d,e,f,g){var s,r,q,p,o,n=this
n.d=e
n.e=f
s=n.aq(a,b,c,d,0)
r=n.a
q=r.w
p=g?3:4
q.$flags&2&&A.r(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=p
n.b9(s,!1)
o=n.aq(a,b,-c,-d,1)
r=r.w
q=g?5:6
r.$flags&2&&A.r(r)
if(!(o>=0&&o<r.length))return A.a(r,o)
r[o]=q
n.b9(o,!0)},
aa(a,b,c,d,e,f,g,h){var s=this
s.d=g
s.e=h
s.b9(s.aq(a,b,c+d*e,d-c*e,0),!1)
s.b9(s.aq(a,b,-c+d*f,-d-c*f,1),!0)},
dd(a,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.c?0:0.5,e=g.ba(a,a0,0,0,0.5,!0),d=Math.max(1,B.c.ae(a3/0.5235987755982988)),c=a3/d*a4,b=1/Math.cos(c/2)
g.ba(a,a0,a1,a2,f,!0)
for(s=0;s<d;++s){r=c*(s+0.5)
q=Math.cos(r)*b
p=Math.sin(r)*b
g.ba(a,a0,a1*q-a2*p,a1*p+a2*q,f,!0)}o=a3*a4
q=Math.cos(o)
p=Math.sin(o)
g.ba(a,a0,a1*q-a2*p,a1*p+a2*q,f,!0)
o=g.a
n=o.x
m=o.as
for(l=n.$flags|0,k=e+1,j=e+2,s=0;s<=d;++s,m=i){i=m+1
l&2&&A.r(n)
h=n.length
if(!(m<h))return A.a(n,m)
n[m]=e
m=i+1
if(!(i<h))return A.a(n,i)
n[i]=k+s
i=m+1
if(!(m<h))return A.a(n,m)
n[m]=j+s}o.as=m},
ba(a,b,c,d,e,f){var s,r,q,p,o,n,m=this,l=m.a,k=l.Q,j=k*2,i=l.f
i.$flags&2&&A.r(i)
s=i.length
if(!(j>=0&&j<s))return A.a(i,j)
i[j]=a
r=j+1
if(!(r<s))return A.a(i,r)
i[r]=b
i=l.r
i.$flags&2&&A.r(i)
s=i.length
if(!(j<s))return A.a(i,j)
i[j]=c
if(!(r<s))return A.a(i,r)
i[r]=d
i=l.w
if(f)s=2
else s=e<0.5?0:1
i.$flags&2&&A.r(i)
if(!(k>=0&&k<i.length))return A.a(i,k)
i[k]=s
if(l.b){q=m.r
i=l.d
s=q==null
p=m.f
o=s?p:(q+p*m.w)*256
i.$flags&2&&A.r(i)
n=i.length
if(!(j<n))return A.a(i,j)
i[j]=o
s=s?e:p
if(!(r<n))return A.a(i,r)
i[r]=s}if(l.c){i=l.e
s=m.d
i.$flags&2&&A.r(i)
p=i.length
if(!(j<p))return A.a(i,j)
i[j]=s
s=m.e
if(!(r<p))return A.a(i,r)
i[r]=s}l.Q=k+1
return k},
aq(a,b,c,d,e){return this.ba(a,b,c,d,e,!1)},
hT(a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=this
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
s.cL(4,6)
d=a3.aq(n,l,f,e,0)
o=-f
m=-e
c=a3.aq(n,l,o,m,1)
b=a3.aq(k,j,f,e,0)
a=a3.aq(k,j,o,m,1)
a0=s.x
a1=s.as
a2=a1+1
a0.$flags&2&&A.r(a0)
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
A.aW.prototype={
siH(a){this.e=t.gE.a(a)}}
A.kf.prototype={
eS(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i=this
for(s=i.d,r=s.ax,q=i.x,p=i.e,o=t.X,n=0;n<r.length;++n){m=r[n]
if(m.c!==p)continue
m=m.d
l=q.h(0,m)
if(l==null){l=A.b([],o)
q.m(0,m,l)
m=l}else m=l
B.a.j(m,n)}for(r=s.ch,q=i.y,n=0;n<r.length;++n){m=r[n].b
if(m.b!==p)continue
m=m.c
l=q.h(0,m)
if(l==null){l=A.b([],o)
q.m(0,m,l)
m=l}else m=l
B.a.j(m,n)}if(i.w)for(s=s.ay,r=s.length,q=i.a,k=0;k<s.length;s.length===r||(0,A.i)(s),++k){j=s[k]
if(j instanceof A.bB)p=j.db!=null
else p=!1
if(p)q.j(0,j.b)}},
gcc(){var s=this,r=s.b
return r===$?s.b=new A.iX(s.f,s.r,B.cs,A.A(t.N,t.i)):r},
hy(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
t.lL.a(a)
s=this.f
if(s==null)return
for(r=a.length,q=this.d.ch,p=0;p<a.length;a.length===r||(0,A.i)(a),++p){o=a[p]
n=o.a
if(n<0||o.c.length===0)continue
if(!(n>=0&&n<q.length))return A.a(q,n)
m=q[n]
l=A.og(o.c)
k=m.z?l.toUpperCase():l
j=A.x1(new A.aq(k))
i=o.f!=null
n=A.pB(k,m.at)
h=m.ax
if(h==null)h=1.15
g=i?60:m.k2
switch(m.ay.a){case 0:f=j?1:-1
break
case 1:f=j?-1:1
break
case 4:f=j?1:-1
break
case 5:f=j?-1:1
break
default:f=0
break}o.as=A.rY(s,k,f,n,h,g,i,m.y,m.w)}},
hY(m5,m6,m7,m8,m9,n0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9,i0,i1,i2,i3,i4,i5,i6,i7,i8,i9,j0,j1,j2,j3,j4,j5,j6,j7,j8,j9,k0,k1,k2,k3,k4,k5,k6,k7,k8,k9,l0,l1,l2,l3,l4,l5,l6,l7,l8,l9,m0,m1,m2,m3=this,m4=null
t.mm.a(m5)
s=m3.d
r=s.ax
q=t.bQ
p=A.a9(r.length,m4,!1,q)
o=t.N
n=t.S
m=A.a9(r.length,0,!1,n)
l=A.a9(r.length,m4,!1,q)
k=A.b([],t.fw)
j=A.b([],t.oM)
q=t.aB
i=A.A(n,q)
h=A.A(n,q)
g=A.A(n,t.lc)
f=m6>=m7
e=f?0.75:2
q=s.e.a
d=q.length!==0?B.b.cl(512,Math.min(m6,30)):0
c=d>0?4096/d:0
b=f?0:2
a=m8>m6?m8:m6
a0=m3.ch=B.b.a3(1,a-m6)
a1=a+s.cy
n=m3.gcc()
n.d=!1
a2=new A.kp(a1,f)
a3=m3.z
a3.a=a1
a4=new A.kr(p,k,a3,A.A(o,t.ct),m,l)
for(a5=J.B(m5),a6=a1+1,a7=t.O,a8=s.ch,a9=t.gw,b0=m3.Q,b1=b0.c,b2=t.Y,b3=c>0,b4=t.n,b5=m3.a,b6=n0===0,b7=6.283185307179586*(n0+0.5),b8=m3.as,b9=m3.at,c0=t.X,c1=t.s,c2=s.c,c3=t.c3,c4=m3.e,s=s.CW,c5=m3.y,c6=m3.x;a5.l();){c7=a5.gn()
c8=A.b([],c0)
c9=c6.h(0,c7.gai())
if(c9==null)c9=B.U
d0=c9.length
d1=0
for(;d1<c9.length;c9.length===d0||(0,A.i)(c9),++d1){d2=c9[d1]
if(!(d2>=0&&d2<r.length))return A.a(r,d2)
d3=r[d2]
if(a2.$2(d3.cx,d3.cy))c8.push(d2)}c9=A.b([],c0)
d0=c5.h(0,c7.gai())
if(d0==null)d0=B.U
d3=d0.length
d1=0
for(;d1<d0.length;d0.length===d3||(0,A.i)(d0),++d1){d4=d0[d1]
if(!(d4>=0&&d4<a8.length))return A.a(a8,d4)
d5=a8[d4].b
if(a2.$2(d5.z,d5.Q))c9.push(d4)}if(c8.length===0&&c9.length===0)continue
d6=4096/c7.gaS()
d0=s.length
if(c4<d0){if(!(c4>=0))return A.a(s,c4)
d7=s[c4]}else d7=m4
d8=d7==null||d7 instanceof A.cd?m4:d7.cG(c7.gai())
d0=c7.gaI()
d3=A.b([],c0)
for(d5=c8.length,d1=0;d1<c8.length;c8.length===d5||(0,A.i)(c8),++d1){d2=c8[d1]
if(!(d2>=0&&d2<r.length))return A.a(r,d2)
if(r[d2].b==null)d3.push(d2)}c9=A.b([new A.M(d0,d3,c9)],c3)
for(d0=c8.length,d1=0;d1<c8.length;c8.length===d0||(0,A.i)(c8),++d1){d2=c8[d1]
if(!(d2>=0&&d2<r.length))return A.a(r,d2)
d9=r[d2].b
if(d9!=null)c9.push(new A.M(m3.f8(c7,d9,d8),A.b([d2],c0),B.U))}for(c8=c9.length,d0=d8!=null,d1=0;d1<c9.length;c9.length===c8||(0,A.i)(c9),++d1){d3=c9[d1]
e0=d3.b
e1=d3.c
for(d3=J.B(d3.a),d5=J.Q(e1),e2=J.Q(e0);d3.l();){e3={}
e4=d3.gn()
e5=e4.aH(c7)
if(d0&&e5.h(0,d8)!=null)e5.m(0,"$id",e5.h(0,d8))
a3.sa8(e5)
switch(e4.ga_()){case 1:e6="Point"
break
case 2:e6="LineString"
break
default:e6="Polygon"
break}a3.c=e6
e3.a=!1
e3.b=d6
e7=new A.kq(e3,m3,e4)
e8=new A.ks(e3,m3,e7)
a3.siy(new A.kl(e3,m3,e7,m6,m9,n0))
for(e6=e2.gp(e0),e9=e4 instanceof A.dy;e6.l();){f0=e6.gn()
if(f0>>>0!==f0||f0>=r.length)return A.a(r,f0)
f1=r[f0]
f2=f1.f
A:{if(B.a_===f2||B.af===f2){f3=e4.ga_()===3
break A}if(B.Q===f2){f3=!0
break A}if(B.P===f2){f3=f1.x?e4.ga_()===3:e4.ga_()!==1
break A}f3=m4}if(!f3||!f1.e.$1(a3))continue
f4=f1.a
if(f4!=null){e8.$0()
if(f4.r){f3=m3.c.h(0,A.xD(a3.b.h(0,"$id")))
a3.scX(f3==null?B.e:f3)}f3=f4.a.$1(a3)
if(!(typeof f3=="number"))if(typeof f3=="string")f3=A.L(f3)
else if(A.E(f3))f3=f3?1:0
else f3=m4
if(f3==null)f3=0
f5=Math.max(0,f3)
f3=f4.b.$1(a3)
if(!(typeof f3=="number"))if(typeof f3=="string")f3=A.L(f3)
else if(A.E(f3))f3=f3?1:0
else f3=m4
if(f3==null)f3=0
f6=Math.max(0,f3)
f7=A.aS(f4.c.$1(a3))
if(f7==null)f7=B.eA
B.a.a1(b8)
B.a.a1(b9)
for(f8=0;f8<b1.length-1;){B.a.j(b8,b1[f8]);++f8
if(!(f8<b1.length))return A.a(b1,f8)
B.a.j(b9,b1[f8])}f3=g.h(0,f0)
if(f3==null){f3=f4.d
f9=B.b.a3(1,m6)
g0=new Float64Array(256)
g1=new Float64Array(256)
g2=new Float64Array(256)
g3=new Float64Array(256)
g4=new Float64Array(256)
g5=new Float64Array(256)
g6=new Float64Array(256)
g7=new Float64Array(256)
f3=new A.fw(f0,c2,f3,-f9/8192,new A.aO(g0),new A.aO(g1),new A.aO(g2),new A.aO(g3),new A.aO(g4),new A.aO(g5),new A.aO(g6),new A.aO(g7),new A.aO(new Float64Array(256)),A.b([],c0),A.b([],c1))
g.m(0,f0,f3)
f0=f3}else f0=f3
f3=b0.a
f9=f4.e.$1(a3)
if(!(typeof f9=="number"))if(typeof f9=="string")f9=A.L(f9)
else if(A.E(f9))f9=f9?1:0
else f9=m4
if(f9==null)f9=0
g0=B.b.a3(1,m6)
g8=3.141592653589793-b7/g0
g1=Math.cos(Math.atan(0.5*(Math.exp(g8)-Math.exp(-g8))))
g2=f4.f
g9=g2==null?m4:g2.$1(a3)
B:{if(typeof g9=="string"){g2=g9.length!==0
h0=g9}else{h0=m4
g2=!1}if(g2){g2=h0
break B}g2=m4
break B}f0.hR(0,f3,b8,b9,f5,f6,f7,g2,f9/(40075016.68557849*g1)*g0*4096)
a3.scX(B.e)
continue}h1=a4.$2(f0,f1)
if(f2===B.a_){e7.$0()
f3=h1.c
if(f3==null){f0=b5.u(0,f0)
f3=B.b.a3(1,m6)
f3=h1.c=new A.ih(A.qZ(!1,!1,!1),f0,b6,n0===f3-1)
f0=f3}else f0=f3
m3.f0(f0,e3.b,b)
continue}e8.$0()
if(f2===B.Q){h2=h1.e
if(h2==null){h2=A.b([],b4)
h1.siH(h2)}h3=new A.kk(m3,h2)
for(f8=0;f8<b1.length-1;){h4=b1[f8]*2;++f8
h5=b1[f8]*2
for(h6=h4;h6<h5;h6+=2)h3.$1(h6)
f0=!1
if(e4.ga_()===3)if(h5-h4>=6){f0=b0.a
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
h7=h1.d=new A.j2(A.qZ(!0,f1.w,f1.y),f1.as,f1.z,f0)}for(f0=f1.x,f3=f1.Q,f9=f1.ay,g0=f1.ax,g1=f1.at,g2=f1.r,g3=f1.ch,g4=f9==null,g5=g0==null,g6=g1==null,g7=g3==null,f8=0;f8<b1.length-1;f8=h8){h4=b1[f8]
h8=f8+1
h5=b1[h8]
if(e4.ga_()===2){h9=f3&&e9?e4.a:m4
i0=h9!=null&&h9.length>f8*2+1
i1=b0.a
if(b3)i1=A.rR(i1,h4,h5,c)
i2=b3?0:h4
i3=b3?i1.length/2|0:h5
switch(g7?m4:g3.$1(a3)){case"round":i4=B.ai
break
case"square":i4=B.aj
break
case"butt":i4=B.G
break
default:i4=g2
break}switch(g6?m4:g1.$1(a3)){case"round":i5=B.aE
break
case"bevel":i5=B.ak
break
case"miter":i5=B.S
break
default:i5=m4
break}i6=g5?m4:g0.$1(a3)
if(!(typeof i6=="number"))if(typeof i6=="string")i6=A.L(i6)
else if(A.E(i6))i6=i6?1:0
else i6=m4
if(i6==null)i6=m4
i7=g4?m4:f9.$1(a3)
if(!(typeof i7=="number"))if(typeof i7=="string")i7=A.L(i7)
else if(A.E(i7))i7=i7?1:0
else i7=m4
if(i7==null)i7=m4
if(i0){i8=f8*2
if(!(i8<h9.length))return A.a(h9,i8)
i8=h9[i8]}else i8=f3?0:m4
if(i0){i9=f8*2+1
if(!(i9<h9.length))return A.a(h9,i9)
i9=h9[i9]/d6}else i9=0
h7.ct(i1,i2,i3,e,i4,i5,i6,i7,i8,i9)
continue}j0=h5-h4
if(j0<3)continue
i2=m3.ax
h2=j0+1
if(i2.length<h2*2)i2=m3.ax=new Float64Array(h2*4)
i3=j0*2
B.v.Y(i2,0,i3,b0.a,h4*2)
i2=m3.ax
i4=i2.length
if(0>=i4)return A.a(i2,0)
i5=i2[0]
i2.$flags&2&&A.r(i2)
if(!(i3>=0&&i3<i4))return A.a(i2,i3)
i2[i3]=i5;++i3
if(1>=i4)return A.a(i2,1)
i5=i2[1]
if(!(i3<i4))return A.a(i2,i3)
i2[i3]=i5
if(b3)j1=A.rR(i2,0,h2,c)
else j1=i2
if(b3)h2=j1.length/2|0
if(f0)h7.hT(j1,0,h2)
else h7.hS(j1,0,h2,e,!0)}}for(e6=d5.gp(e1);e6.l();){e9=e6.gn()
j2={}
if(e9>>>0!==e9||e9>=a8.length)return A.a(a8,e9)
j3=a8[e9]
f0=j3.b
if(!f0.d.$1(a3))continue
j2.a=null
j4=A.xZ(f0.e.$1(a3))
j5=j2.a=j4.a
j6=j4.b
f3=f0.f
j7=f3==null?"":A.P(f3.$1(a3))
if(A.og(j5).length===0&&!B.d.u(j5,A.O(57599))&&j7.length===0)continue
j8=A.u(f0.r.$1(a3))
j9=B.d.an(j8,"line")
f6=(a8.length-1-e9)*4096
k0=A.wH(j3,a3)
f3=f0.at.$1(a3)
if(!(typeof f3=="number"))if(typeof f3=="string")f3=A.L(f3)
else if(A.E(f3))f3=f3?1:0
else f3=m4
k1=(f3==null?0:f3)*3.141592653589793/180
f3=f0.ax
if(f3.gk(0)===0&&j6==null)k2=m4
else{f9=A.A(o,a7)
for(g0=f3.$ti,f3=new A.a1(f3,f3.gk(0),g0.i("a1<y.E>")),g0=g0.i("y.E");f3.l();){g1=f3.d
if(g1==null)g1=g0.a(g1)
if(B.d.an(g1,"$geometry:")){g2=$.pc.h(0,g1)
g2=g2==null?m4:g2.$1(a3)}else g2=a3.b.h(0,g1)
f9.m(0,g1,g2)}if(j6!=null)f9.m(0,"$format",j6)
k2=f9}if(e4.ga_()===3&&!j9){e8.$0()
for(f0=A.yi(b0),f3=f0.length,f9=f6+k0,k3=0;k3<f0.length;f0.length===f3||(0,A.i)(f0),++k3){g0=f0[k3]
k4=g0.a
k5=g0.b
if(k4<0||k5<0||k4>=4096||k5>=4096)continue
g0=new A.b7(e9,f9,j2.a,k4,k5,m4,j7,k1,!1,!0)
g0.sa8(k2)
B.a.j(j,g0)}continue}if(e4.ga_()===1){if(j9)continue
e8.$0()
for(e9=m3.dF(e9,f6+k0,j2.a,j7,k1),f0=e9.$ti,e9=new A.d_(e9.a(),f0.i("d_<1>")),f0=f0.c;e9.l();){f3=e9.b
if(f3==null)f3=f0.a(f3)
f3.sa8(k2)
B.a.j(j,f3)}continue}e8.$0()
k6=Math.max(0,B.c.ae(f0.z-a1))
f3=j8==="line-center"
k7=f3?1/0:f0.w*8/B.b.a3(1,k6)/a0
k8=a3.a
a3.a=a6
f9=j3.c
g8=f9.$1(a3)
if(!(typeof g8=="number"))if(typeof g8=="string"){g0=A.L(g8)
g8=g0}else{if(A.E(g8))g0=g8?1:0
else g0=m4
g8=g0}k9=g8!=null&&isFinite(g8)?g8:16
a3.a=18
g8=f9.$1(a3)
if(!(typeof g8=="number"))if(typeof g8=="string"){f9=A.L(g8)
g8=f9}else{if(A.E(g8))f9=g8?1:0
else f9=m4
g8=f9}l0=g8!=null&&isFinite(g8)?g8:k9
a3.a=k8
l1=l0*4096/512/a0
if(j9&&j2.a.length!==0&&!f0.x){f9=A.b([],b2)
for(f8=0;f8<b1.length-1;){g0=b0.a
g1=b1[f8]*2;++f8
f9.push(new Float32Array(A.N(new Float64Array(g0.subarray(g1,A.bi(g1,b1[f8]*2,g0.length))))))}f0=f0.as==null?50:k0
g0=j2.a
g1=n.ew(j3,g0,j6,k9)
g2=j3.cE
if(g2==null)g2=0.7853981633974483
l2=new A.cJ(0,f6+f0,g0,k7,g1*l1,l1,g2,k2,f9,j7)
if(j8==="line"&&f9.length!==0){f0=i.h(0,e9)
if(f0==null){f0=A.b([],a9)
i.m(0,e9,f0)
e9=f0}else e9=f0
J.fd(e9,l2)}else B.a.v(j,m3.fW(e9,l2,f3))
continue}if(!j9){l3=b0.a
for(f0=f0.as==null,f3=l3.length,f8=0;f8<b1.length-1;++f8){l4=b1[f8]*2
if(!(l4<f3))return A.a(l3,l4)
k4=l3[l4]
f9=l4+1
if(!(f9<f3))return A.a(l3,f9)
k5=l3[f9]
if(k4<0||k5<0||k4>=4096||k5>=4096)continue
f9=f0?50:k0
f9=new A.b7(e9,f6+f9,j2.a,k4,k5,m4,j7,k1,!1,!1)
f9.sa8(k2)
B.a.j(j,f9)}continue}l5=j2.a.length===0&&!f0.y
if(j7.length===0)l6=0
else{f9=n.c.h(0,j7)
f9=f9==null?m4:f9.a
if(f9==null)f9=0
g0=j3.k3.$1(a3)
if(!(typeof g0=="number"))if(typeof g0=="string")g0=A.L(g0)
else if(A.E(g0))g0=g0?1:0
else g0=m4
l6=f9*(g0==null?1:g0)*l1/24}f9=j2.a
f9=f9.length===0?0:n.ew(j3,f9,j6,k9)*l1
l7=Math.max(f9,l6)
if(j8==="line"&&j2.a.length!==0){f3=h.h(0,e9)
if(f3==null){f3=A.b([],a9)
h.m(0,e9,f3)
e9=f3}else e9=f3
f0=f0.as==null?50:k0
f3=j2.a
f9=j3.cE
if(f9==null)f9=0.7853981633974483
J.fd(e9,new A.cJ(k1,f6+f0,f3,k7,l7,l1,f9,k2,m3.dR(),j7))
continue}f0=m3.dR()
f9=j3.cE
if(f9==null)f9=0.7853981633974483
A.pu(f0,f3,l1,l7,f9,m3.ch,new A.km(j2,j,e9,f6,j3,k0,j7,l5,k1,k2),k7,j2.a.length!==0)}}}}for(s=new A.bH(h,h.$ti.i("bH<1,2>")).gp(0),r=t.nE;s.l();){l8={}
n=s.d
n.toString
l8.a=null
l8.a=n.a
l9=A.A(o,r)
for(n=A.rZ(n.b),a5=n.length,d1=0;d1<n.length;n.length===a5||(0,A.i)(n),++d1){i1=n[d1]
A.pu(i1.x,!1,i1.f,i1.e,i1.r,m3.ch,new A.kn(l8,l9,i1,j),i1.d,!0)}}for(s=new A.bH(i,i.$ti.i("bH<1,2>")).gp(0);s.l();){n=s.d
m0=n.a
l9=A.A(o,r)
for(n=A.rZ(n.b),a5=n.length,d1=0;d1<n.length;n.length===a5||(0,A.i)(n),++d1)B.a.v(j,m3.fX(m0,n[d1],l9))}m1=A.b([],t.hD)
B.a.aD(k,new A.ko())
for(s=k.length,d1=0;d1<k.length;k.length===s||(0,A.i)(k),++d1){h1=k[d1]
h2=h1.e
if(h2!=null&&h2.length!==0){r=new Float32Array(A.N(h2))
B.a.j(m1,new A.d5(h1.a,new A.ec(m4,r,m4,new Uint16Array(0),m4,m4,m4),h1.b))}r=h1.c
if(r==null)m2=m4
else{r=r.a
r.cF()
r=r.at
m2=r}if(m2==null){r=h1.d
if(r==null)m2=m4
else{r=r.a
r.cF()
r=r.at
m2=r}}if(m2==null)continue
for(r=m2.length,o=h1.a,n=h1.b,k3=0;k3<m2.length;m2.length===r||(0,A.i)(m2),++k3)B.a.j(m1,new A.d5(o,m2[k3],n))}m3.hy(j)
s=A.b([],t.dY)
for(r=new A.bI(g,g.r,g.e,g.$ti.i("bI<2>")),o=m3.w;r.l();){n=r.d
n=n.ig(q.length!==0?Math.max(B.b.cl(128,Math.min(m6,30)),2):0,o)
if(n!=null)s.push(n)}return new A.c7(o?m3.hE(m1,m6,a1):m4,m1,j,s)},
hE(a,b,c){var s
t.ke.a(a)
s=this.d
if(s.e.a.length===0)return A.qj(s,a,0,c)
return A.qj(s,a,Math.max(B.b.cl(128,Math.min(b,30)),2),c)},
f8(a,b,c){var s,r,q,p,o,n,m,l
t.u.a(b)
s=a.gaI()
r=A.ux(s.length,new A.kh(this,s,a,c,b),t.i)
q=s.length
p=J.qm(q,t.S)
for(o=0;o<q;++o)p[o]=o
B.a.aD(p,new A.ki(r))
n=A.b([],t.Z)
for(m=p.length,l=0;l<p.length;p.length===m||(0,A.i)(p),++l){o=p[l]
if(!(o<s.length))return A.a(s,o)
n.push(s[o])}return n},
ht(a){var s,r,q,p,o=this.Q,n=o.a
for(o=o.b,s=n.length,r=n.$flags|0,q=0;q<o;++q){if(!(q<s))return A.a(n,q)
p=n[q]
r&2&&A.r(n)
n[q]=p*a}},
f0(b2,b3,b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6=this,a7={},a8=a6.Q,a9=a8.a,b0=a8.b,b1=a6.ax
if(b0>b1.length)b0=a6.ax=new Float64Array(b0*2)
else b0=b1
s=b4*b4
r=s*4
a7.a=0
a7.b=-1
b1=a6.ay
B.a.a1(b1)
q=new A.kg(a7,a6,b2,b0)
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
n&2&&A.r(b0)
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
if(i>=0){b2.e0(b0,i,j,b1)
B.a.a1(b1)}a7.b=j}else{i=a7.b
if(i>=0)B.a.j(b1,j-i)
else a7.a=j}}q.$0()},
dR(){var s,r,q,p,o,n=A.b([],t.Y)
for(s=this.Q,r=s.c,q=0;q<r.length-1;){p=s.a
o=r[q]*2;++q
n.push(new Float32Array(A.N(new Float64Array(p.subarray(o,A.bi(o,r[q]*2,p.length))))))}return n},
dF(a,b,c,d,e){return new A.cr(this.hb(a,b,c,d,e),t.an)},
hb(a,b,c,d,e){var s=this
return function(){var r=a,q=b,p=c,o=d,n=e
var m=0,l=2,k=[],j,i,h,g,f,a0,a1
return function $async$dF(a2,a3,a4){if(a3===1){k.push(a4)
m=l}for(;;)switch(m){case 0:a0=s.Q
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
return a2.b=new A.b7(r,q,p,g,f,null,o,n,!1,!1),1
case 6:case 4:i+=2
m=3
break
case 5:case 1:return 0
case 2:return a2.c=k.at(-1),3}}}},
dm(a,b,c,d){var s
t.jT.a(d)
s=A.b([],t.oM)
A.pu(b.x,c,b.f,b.e,b.r,this.ch,new A.kj(d,b,s,a),b.d,!0)
return s},
fW(a,b,c){return this.dm(a,b,c,null)},
fX(a,b,c){return this.dm(a,b,!1,c)},
seN(a){this.c=t.gG.a(a)}}
A.kp.prototype={
$2(a,b){var s=this.a
if(b>s)s=this.b||a<s+1
else s=!1
return s},
$S:18}
A.kr.prototype={
$2(a,b){var s,r,q,p,o,n,m,l,k,j=this,i=b.CW,h=i.length
if(h===0){h=j.a
if(!(a>=0&&a<h.length))return A.a(h,a)
s=h[a]
if(s==null){s=new A.aW(a,null)
B.a.m(h,a,s)
B.a.j(j.b,s)}return s}r=[]
for(q=j.c,p=0;p<i.length;i.length===h||(0,A.i)(i),++p){o=i[p]
if(B.d.an(o,"$geometry:")){n=$.pc.h(0,o)
n=n==null?null:n.$1(q)}else n=q.b.h(0,o)
r.push(n)}m=""+a+"|"+B.a.ab(r,"\x01")
h=j.d
s=h.h(0,m)
if(s!=null)return s
l=B.a.u(i,"$id")?4096:64
q=j.e
if(!(a>=0&&a<q.length))return A.a(q,a)
n=q[a]
if(n>=l){h=j.f
if(!(a<h.length))return A.a(h,a)
h=h[a]
h.toString
return h}B.a.m(q,a,n+1)
q=A.A(t.N,t.O)
for(k=0;k<i.length;++k){if(!(k<r.length))return A.a(r,k)
n=r[k]
if(n!=null)q.m(0,i[k],n)}s=new A.aW(a,q)
B.a.m(j.f,a,s)
h.m(0,m,s)
B.a.j(j.b,s)
return s},
$S:98}
A.kq.prototype={
$0(){var s=this.a
if(s.a)return
s.a=!0
s=this.b.Q
s.b=0
B.a.a1(s.c)
this.c.aW(s)},
$S:0}
A.ks.prototype={
$0(){var s,r
this.c.$0()
s=this.a
r=s.b
if(r!==1){this.b.ht(r)
s.b=1}},
$S:0}
A.kl.prototype={
$0(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this
c.c.$0()
s=c.a.b/4096
r=B.b.a3(1,c.d)
q=A.b([],t.b)
for(p=c.b.Q,o=p.c,n=c.e,m=c.f,l=t.n,k=0;k<o.length-1;){j=A.b([],l)
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
B.a.v(j,A.b([(n+e*s)/r*360-180,Math.atan((Math.exp(d)-Math.exp(-d))/2)*180/3.141592653589793],l));++i}q.push(j)}return q},
$S:99}
A.kk.prototype={
$1(a){var s,r,q,p=this.a.Q.a,o=p.length
if(!(a<o))return A.a(p,a)
s=p[a]
r=a+1
if(!(r<o))return A.a(p,r)
q=p[r]
if(s<0||q<0||s>=4096||q>=4096)return
p=this.b
B.a.j(p,s)
B.a.j(p,q)},
$S:25}
A.km.prototype={
$4(a,b,c,d){var s=this,r=s.e.b.as==null?50:s.f,q=s.a.a,p=s.w,o=s.x
if(p)o=c+o
p=new A.b7(s.c,s.d+r,q,a,b,null,s.r,o,p,!0)
p.sa8(s.y)
return B.a.j(s.b,p)},
$S:32}
A.kn.prototype={
$4(a,b,c,d){var s,r=this,q=r.c
if(A.t5(r.b,q,a,b))return
s=new A.b7(r.a.a,q.b,q.c,a,b,null,q.y,q.a,!1,!0)
s.sa8(q.w)
B.a.j(r.d,s)},
$S:32}
A.ko.prototype={
$2(a,b){var s=t.ct
return s.a(a).a-s.a(b).a},
$S:101}
A.kh.prototype={
$1(a){var s,r=this,q=r.b
if(!(a<q.length))return A.a(q,a)
s=q[a].aH(r.c)
q=r.d
if(q!=null&&s.h(0,q)!=null)s.m(0,"$id",s.h(0,q))
q=r.a.z
q.sa8(s)
q=A.C(r.e.$1(q))
return q==null?0:q},
$S:6}
A.ki.prototype={
$2(a,b){var s,r,q,p
A.v(a)
A.v(b)
s=this.a
r=s.length
if(!(a>=0&&a<r))return A.a(s,a)
q=s[a]
if(!(b>=0&&b<r))return A.a(s,b)
p=B.c.a6(q,s[b])
return p!==0?p:B.b.a6(a,b)},
$S:30}
A.kg.prototype={
$0(){var s=this,r=s.a,q=r.b
if(q>=0)s.c.e0(s.d,q,r.a,s.b.ay)
r.b=-1
B.a.a1(s.b.ay)},
$S:0}
A.kj.prototype={
$4(a,b,c,d){var s,r=this,q=r.a
if(q!=null&&A.t5(q,r.b,a,b))return
q=r.b
s=new A.b7(r.d,q.b,q.c,a,b,d,q.y,0,!1,!1)
s.sa8(q.w)
B.a.j(r.c,s)},
$S:32}
A.aZ.prototype={
gaK(){var s=this.d,r=this.a
return s>r?s:r},
D(a,b){var s=this
if(b==null)return!1
return b instanceof A.aZ&&b.a===s.a&&b.b===s.b&&b.c===s.c&&b.gaK()===s.gaK()},
gS(a){var s=this,r=s.a
return(r*4194304+s.b)*4194304+s.c+s.gaK()-r},
q(a){var s=this,r=s.a,q=""+r+"/",p=""+s.b,o=""+s.c
return s.gaK()>r?q+p+"/"+o+"@"+s.gaK():q+p+"/"+o}}
A.lP.prototype={
$3(a,b,c){var s,r,q=this.b,p=a*2,o=this.c,n=p+o,m=J.n(q),l=m.h(q,n),k=b*2,j=m.h(q,k+o)
n=m.h(q,n)
s=1-o
p+=s
r=m.h(q,p)+(m.h(q,k+s)-m.h(q,p))*((c-l)/(j-n))
q=t.n
p=this.a.a
if(o===0)B.a.v(p,A.b([c,r],q))
else B.a.v(p,A.b([r,c],q))},
$S:102}
A.hH.prototype={$ibr:1,
gai(){return this.a},
gaS(){return this.b},
gaI(){return this.c}}
A.hG.prototype={
aH(a){return this.b},
aW(a){var s,r,q,p,o,n,m,l=this.a===1
if(l)B.a.j(a.c,a.b>>>1)
for(s=this.c,r=s.length,l=!l,q=a.c,p=0;p<s.length;s.length===r||(0,A.i)(s),++p){o=s[p]
if(l)B.a.j(q,a.b>>>1)
for(n=J.n(o),m=0;m<n.gk(o);m+=2)a.bb(n.h(o,m),n.h(o,m+1))}B.a.j(q,a.b>>>1)},
$ibN:1,
ga_(){return this.a}}
A.kx.prototype={
ib(a,b,c){var s,r=this,q=r.w
if(q!=null){s=r.r
s=s==null?null:!s.gdL()
s=s===!0}else s=!0
if(s)return null
return q+"/"+r.c+"/"+a+"/"+b+"/"+c+r.e},
bM(a,b,c,d){var s=0,r=A.aj(t.nh),q,p=this,o,n
var $async$bM=A.ak(function(e,f){if(e===1)return A.ag(f,r)
for(;;)switch(s){case 0:if(!p.b.ik(a,b,c)){q=new Uint8Array(0)
s=1
break}o=p.ib(a,b,c)
s=3
return A.I(p.bF(a,b,c,d),$async$bM)
case 3:n=f
if(o!=null&&n!=null&&!B.E.gB(n))A.pJ(o,n).bh(new A.ky(),new A.kz(),t.H)
q=n
s=1
break
case 1:return A.ah(q,r)}})
return A.ai($async$bM,r)},
bF(a,b,c,d){var s=0,r=A.aj(t.nh),q,p=this,o,n,m,l,k
var $async$bF=A.ak(function(e,f){if(e===1)return A.ag(f,r)
for(;;)switch(s){case 0:k=p.r
if(k!=null){q=k.ar(a,b,c)
s=1
break}o=p.b.c?B.b.a3(1,a)-1-c:c
s=3
return A.I(A.o_(p.d,p.a,a,b,o,p.f,d),$async$bF)
case 3:n=f
m=n.a
l=n.b
o=l.a
if(o===204){q=new Uint8Array(0)
s=1
break}if(o===404){q=null
s=1
break}if(o!==200)throw A.f(A.qk(o,m))
q=l.b
s=1
break
case 1:return A.ah(q,r)}})
return A.ai($async$bF,r)}}
A.ky.prototype={
$1(a){},
$S:103}
A.kz.prototype={
$1(a){},
$S:16}
A.aO.prototype={
aG(a,b){var s,r,q,p=this,o=p.b+2
if(o>p.a.length)p.bv(o)
o=p.a
s=p.b
r=p.b=s+1
o.$flags&2&&A.r(o)
q=o.length
if(!(s<q))return A.a(o,s)
o[s]=a
p.b=r+1
if(!(r<q))return A.a(o,r)
o[r]=b},
ah(a,b,c,d){var s,r,q,p=this,o=p.b+4
if(o>p.a.length)p.bv(o)
o=p.a
s=p.b
r=p.b=s+1
o.$flags&2&&A.r(o)
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
bv(a){var s,r=this.a,q=r.length*2
while(q<a)q*=2
s=new Float64Array(q)
B.v.R(s,0,this.b,r)
this.a=s},
gk(a){return this.b}}
A.iN.prototype={
j(a,b){var s=this,r=s.b,q=s.a,p=q.length
if(r===p){p=new Uint32Array(p*2)
B.o.R(p,0,r,q)
s.a=p
r=p}else r=q
q=s.b++
r.$flags&2&&A.r(r)
if(!(q<r.length))return A.a(r,q)
r[q]=b},
gk(a){return this.b}}
A.oE.prototype={
$1(a){var s,r=this.a,q=r.h(0,a)
if(q!=null)return q.a
s=new A.H($.G,t.ls)
r.m(0,a,new A.bT(s,t.hg))
this.b.$1([0,"fetch",a])
return s},
$S:104}
A.ov.prototype={
$2(a,b){t.a2.a(b)},
$S:105}
A.ot.prototype={
$1(a){return this.a.$1(a.aY())},
$S:106}
A.ow.prototype={
$1(a){t.h.a(a)
this.a.gcc().sio(a)
return a},
$S:107}
A.oJ.prototype={
$1(a){var s=this.a
return A.qb(a,s.f,s.w,s.r,s.x,s.cG(""))},
$S:108}
A.ox.prototype={
$0(){var s=0,r=A.aj(t.my),q,p=2,o=[],n=this,m,l,k,j
var $async$$0=A.ak(function(a,b){if(a===1){o.push(b)
s=p}for(;;)switch(s){case 0:k=n.a
if(typeof k!="string"){q=n.b.$1(k)
s=1
break}p=4
s=7
return A.I(n.c.eD(k,n.d.e.c),$async$$0)
case 7:m=b
k=n.b.$1(B.t.ef(B.R.ed(m.b),null))
q=k
s=1
break
p=2
s=6
break
case 4:p=3
j=o.pop()
k=A.qb(null,null,null,null,!1,null)
q=k
s=1
break
s=6
break
case 3:s=2
break
case 6:case 1:return A.ah(q,r)
case 2:return A.ag(o.at(-1),r)}})
return A.ai($async$$0,r)},
$S:109}
A.oK.prototype={
$1(a){var s,r,q,p,o,n,m=this,l=m.b
if(!(l instanceof A.dt))return
s=m.a
r=s.a
if(r!=null){r=r.r
if(r!=null)r.f=null}r=m.c.e
q=A.xi(a)
p=r.c
o=new A.fS()
n=B.d.an(a,"pmtiles://")
n=n?new A.jC(B.d.ao(a,10),p,o,!1,A.A(t.S,t.je)):null
s.a=new A.kx(a,l.r,"tiles-"+q,o,".pbf",p,n,r.a)
m.d.a1(0)
l=m.e
if((l.a.a&30)===0)l.i1()},
$S:110}
A.oz.prototype={
$2(a,b){var s=0,r=A.aj(t.p),q,p=this,o,n,m,l,k,j,i
var $async$$2=A.ak(function(c,d){if(c===1)return A.ag(d,r)
for(;;)switch(s){case 0:k=(a.a*4194304+a.b)*4194304+a.c
j=p.b
i=j.a5(0,k)
if(i!=null){j.m(0,k,i)
q=i
s=1
break}o=p.c
n=o.h(0,k)
if(n==null){m=new A.fj(A.b([],t.f7))
l=new A.oA(p.a,p.d,a,m,j,k).$0()
n=new A.eO(l,m,A.bd(t.S))
o.m(0,k,n)
l.bh(new A.oB(),new A.oC(),t.H).cO(new A.oD(o,k,l))}j=b==null?-1:b
n.c.j(0,j)
q=n.a
s=1
break
case 1:return A.ah(q,r)}})
return A.ai($async$$2,r)},
$S:111}
A.oA.prototype={
$0(){var s=0,r=A.aj(t.p),q,p=this,o,n,m
var $async$$0=A.ak(function(a,b){if(a===1)return A.ag(b,r)
for(;;)switch(s){case 0:m=p.a
s=m.a==null?3:4
break
case 3:s=5
return A.I(p.b.a,$async$$0)
case 5:case 4:o=p.c
s=6
return A.I(m.a.bM(o.a,o.b,o.c,p.d),$async$$0)
case 6:n=b
if(n==null)n=new Uint8Array(0)
m=p.e
m.m(0,p.f,n)
if(m.a>24)m.a5(0,new A.aH(m,A.q(m).i("aH<1>")).gt(0))
q=n
s=1
break
case 1:return A.ah(q,r)}})
return A.ai($async$$0,r)},
$S:112}
A.oB.prototype={
$1(a){t.p.a(a)},
$S:113}
A.oC.prototype={
$1(a){},
$S:16}
A.oD.prototype={
$0(){var s=this.a,r=this.b,q=s.h(0,r)
q=q==null?null:q.a
if(q===this.c)s.a5(0,r)},
$S:28}
A.ou.prototype={
$1(a){var s,r,q
if(!this.a.u(0,a))return
this.b.j(0,a)
for(s=this.c,s=new A.bI(s,s.r,s.e,A.q(s).i("bI<2>"));s.l();){r=s.d
q=r.c
if(q.a5(0,a)&&q.gB(q))r.b.aA()}},
$S:25}
A.oF.prototype={
$2(a,b){var s=0,r=A.aj(t.mm),q,p=this,o,n,m,l,k,j
var $async$$2=A.ak(function(c,d){if(c===1)return A.ag(d,r)
for(;;)switch(s){case 0:l=p.a
k=l.b
s=k!=null?3:4
break
case 3:s=5
return A.I(k,$async$$2)
case 5:q=d.ar(a.a,a.b,a.c)
s=1
break
case 4:k=a.a
l=l.c
s=k>l?6:7
break
case 6:o=k-l
n=new A.aZ(l,B.b.cU(a.b,o),B.b.cU(a.c,o),0)
j=A
s=8
return A.I(p.$2(n,b),$async$$2)
case 8:q=j.yt(d,n,a)
s=1
break
case 7:s=9
return A.I(p.b.$2(a,b),$async$$2)
case 9:m=d
if(b!=null&&p.c.u(0,b))throw A.f(B.ag)
if(m.length===0){q=B.aL
s=1
break}l=p.d
if(l instanceof A.dt&&l.w)l=A.xv(m)
else{l=A.uD(m).a
l=new A.bc(l,A.q(l).i("bc<2>"))}q=l
s=1
break
case 1:return A.ah(q,r)}})
return A.ai($async$$2,r)},
$1(a){return this.$2(a,null)},
$S:114}
A.oG.prototype={
$1(c0){var s=0,r=A.aj(t.c_),q,p=2,o=[],n=[],m=this,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9
var $async$$1=A.ak(function(c1,c2){if(c1===1){o.push(c2)
s=p}for(;;)switch(s){case 0:b4=c0 instanceof A.ew
b5=b4?c0.b:null
if(b4){a=A.A(t.O,t.U)
for(b4=b5.length,a0=0;a0<b5.length;b5.length===b4||(0,A.i)(b5),++a0){a1=b5[a0]
a.m(0,a1.a,a1.b)}m.b.seN(a)
q=null
s=1
break}b4=c0 instanceof A.ex
a2=b4?c0.b:null
if(b4){m.c.$1(a2)
q=null
s=1
break}a3=c0 instanceof A.dQ
if(a3)a4=c0.a
else a4=null
if(a3){m.d.$1(a4)
q=null
s=1
break}b4=c0 instanceof A.e2
if(b4){a5=c0.b
a6=c0.c}else{a5=null
a6=null}if(b4){a7=m.e.h(0,a5)
if(a7!=null&&(a7.a.a&30)===0)a7.bd(a6)
q=null
s=1
break}a8={}
l=null
a8.a=a8.b=null
a3=c0 instanceof A.dP
b4=null
a1=null
if(a3){l=c0.a
a9=c0.b
a8.b=a9
b0=c0.c
a8.a=b0
a1=b0
b4=a9}s=a3?3:4
break
case 3:b1=m.a
b1.c=a1
a1=m.f
a1.j(0,l)
p=6
k=0
s=9
return A.I(m.r.$2(b4,l),$async$$1)
case 9:j=c2
i=0
b4=m.b
h=new A.oH(a8,b1,b4,j)
b1=m.w
s=b1!=null?10:11
break
case 10:s=12
return A.I(b1,$async$$1)
case 12:case 11:g=J.d2(j)?new A.c7(null,B.al,B.aJ,B.aK):h.$0()
if(J.hY(j)&&b4.gcc().d&&m.x!=null){new A.oI(a8,m.x,h,m.y).$0()
b4=g.b
b1=g.d
g=new A.c7(g.a,b4,B.aJ,b1)}b4=l
b1=g
q=new A.h9(b1,b4)
n=[1]
s=7
break
n.push(8)
s=7
break
case 6:p=5
b6=o.pop()
b4=A.aG(b6)
if(b4 instanceof A.dR){b4=l
q=new A.eu(B.eK,b4)
n=[1]
s=7
break}else{f=b4
b4=l
b1=A.u(f)
q=new A.eu(new A.ha(b1,f instanceof A.a4),b4)
n=[1]
s=7
break}n.push(8)
s=7
break
case 5:n=[2]
case 7:p=2
a1.a5(0,l)
m.z.a5(0,l)
s=n.pop()
break
case 8:case 4:e=null
b4=c0 instanceof A.e3
if(b4)e=c0
s=b4?13:14
break
case 13:p=16
a=e.a
b9=A
s=19
return A.I(m.r.$1(e.b),$async$$1)
case 19:b4=b9.yj(c2,m.Q,m.as,e.c,e.d,e.e,e.f,e.r)
q=new A.e1(b4,a)
s=1
break
p=2
s=18
break
case 16:p=15
b7=o.pop()
a=e.a
q=new A.e1(B.c2,a)
s=1
break
s=18
break
case 15:s=2
break
case 18:case 14:d=null
b4=c0 instanceof A.dO
if(b4)d=c0
s=b4?20:21
break
case 20:c=d.c
p=23
b4=m.a.b
s=b4==null?26:28
break
case 26:c2=null
s=27
break
case 28:s=29
return A.I(b4,$async$$1)
case 29:c2=c2.x
case 27:b=c2
a=null
switch(d.b.a){case 0:b4=d.a
a1=b
if(a1==null)a1=null
else{b1=A.v(c)
b3=a1.f.h(0,b1)
a1=b3==null?null:b3.f+1}a=new A.dT(a1,b4)
break
case 1:b4=d.a
a1=b
a=new A.d7(A.ry(a1==null?null:a1.ea(c)),b4)
break
case 2:b4=d.a
a1=b
a=new A.d7(A.ry(a1==null?null:a1.ix(c,d.d,d.e)),b4)
break}a=a
q=a
s=1
break
p=2
s=25
break
case 23:p=22
b8=o.pop()
a=d.b===B.aA?new A.dT(null,d.a):new A.d7(B.c3,d.a)
q=a
s=1
break
s=25
break
case 22:s=2
break
case 25:case 21:case 1:return A.ah(q,r)
case 2:return A.ag(o.at(-1),r)}})
return A.ai($async$$1,r)},
$S:115}
A.oH.prototype={
$0(){var s=this,r=s.a,q=r.b,p=s.b,o=p.b,n=r.a
o=o==null?Math.max(n,18):n
q=s.c.hY(s.d,q.a,o,q.gaK(),q.b,q.c)
r=r.b
p=p.b==null?1024:16777216
q.iu(r.a,r.b,r.c,p)
return q},
$S:116}
A.oI.prototype={
$0(){var s=0,r=A.aj(t.a),q,p=this,o,n,m,l,k,j
var $async$$0=A.ak(function(a,b){if(a===1)return A.ag(b,r)
for(;;)switch(s){case 0:m=0
l=t.H
k=p.b
j=k.y
k=k.z
case 3:n=m
if(typeof n!=="number"){q=n.bQ()
s=1
break}if(!(n<300&&j.a-k.a>0)){s=4
break}s=5
return A.I(A.ud(B.ba,l),$async$$0)
case 5:n=m
if(typeof n!=="number"){q=n.af()
s=1
break}m=n+1
s=3
break
case 4:o=p.c.$0()
p.d.$1(new A.hd(p.a.b,new A.c7(null,B.al,o.c,B.aK),0))
case 1:return A.ah(q,r)}})
return A.ai($async$$0,r)},
$S:117}
A.oy.prototype={
$1(a){t.c_.a(a)
if(a!=null)this.a.$1(a)},
$S:118}
A.on.prototype={
$1(a){var s,r,q,p,o=null,n=A.aD(a).data,m=n==null?o:A.pg(t.dM.a(n))
n=this.a
s=n.a
if(s!=null){n=A.q(s)
n.c.a(m)
r=s.b
if(r>=4)A.aF(s.f3())
if((r&1)!==0)s.ck(m)
else if((r&3)===0)s.fu().j(0,new A.cU(m,n.i("cU<1>")))
return o}r=t.cI
q=new A.dw(o,o,o,o,r)
n.a=q
n=this.b
n.postMessage(null)
p=m.length
if(p===0)p=o
else{if(0>=p)return A.a(m,0)
p=m[0]}switch(p){case"vmap glyphs":p=A.xP()
break
case"vmap shade":p=A.yk()
break
default:p=A.yH()
break}p.$3(m,new A.om(n),new A.dz(q,r.i("dz<1>")))},
$S:119}
A.om.prototype={
$1(a){var s=A.b([],t.kG),r=a==null?null:A.pk(t.W.a(a),s)
this.a.postMessage(r,s)},
$S:12};(function aliases(){var s=J.cf.prototype
s.eQ=s.q
s=A.y.prototype
s.cZ=s.Y})();(function installTearOffs(){var s=hunkHelpers._static_2,r=hunkHelpers._instance_1i,q=hunkHelpers._static_1,p=hunkHelpers._static_0,o=hunkHelpers._instance_2u,n=hunkHelpers._instance_0u,m=hunkHelpers._instance_1u,l=hunkHelpers.installStaticTearOff,k=hunkHelpers._instance_0i
s(J,"wj","uo",120)
r(A.bk.prototype,"gec","u",11)
r(A.df.prototype,"gec","u",11)
q(A,"xc","vd",24)
q(A,"xd","ve",24)
q(A,"xe","vf",24)
p(A,"rK","x0",0)
s(A,"xg","wG",31)
p(A,"xf","wF",0)
o(A.H.prototype,"gfg","fh",31)
var j
n(j=A.cT.prototype,"gdz","by",0)
n(j,"gdA","bz",0)
n(j=A.dx.prototype,"gdz","by",0)
n(j,"gdA","bz",0)
m(j=A.c_.prototype,"gh4","h5",12)
o(j,"gh8","h9",31)
n(j,"gh6","h7",0)
q(A,"xq","w1",40)
q(A,"yB","v7",23)
l(A,"yk",3,null,["$3"],["fb"],26,0)
q(A,"xB","az",123)
q(A,"pF","jy",94)
m(A.fV.prototype,"gdE","cg",12)
q(A,"yA","t3",11)
k(A.eN.prototype,"gk","ac",8)
l(A,"xP",3,null,["$3"],["f8"],26,0)
m(A.bE.prototype,"gfI","dg",12)
k(A.bY.prototype,"gk","ac",8)
l(A,"yH",3,null,["$3"],["hU"],26,0)
q(A,"yc","yw",7)
q(A,"yb","ys",7)
q(A,"y9","rP",7)
q(A,"yd","yC",7)
q(A,"y6","x9",7)
q(A,"y7","xb",7)
q(A,"y8","xh",7)
q(A,"ya","y1",7)
q(A,"yf","pf",15)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.m,null)
q(A.m,[A.oX,J.fH,A.en,J.b6,A.j,A.dS,A.T,A.c9,A.Y,A.y,A.jU,A.a1,A.eb,A.ey,A.es,A.ep,A.e_,A.cQ,A.ba,A.a2,A.bR,A.ay,A.d9,A.bW,A.bK,A.kB,A.ju,A.e0,A.eT,A.j3,A.ea,A.bI,A.e9,A.dg,A.hB,A.ez,A.er,A.hJ,A.lB,A.be,A.hv,A.hM,A.ly,A.eA,A.d_,A.aB,A.kA,A.eC,A.bV,A.H,A.hm,A.cm,A.eU,A.hn,A.dx,A.eD,A.bh,A.c_,A.kS,A.hA,A.eG,A.eI,A.d8,A.fq,A.lh,A.lE,A.f1,A.bl,A.hq,A.fT,A.eq,A.l2,A.a4,A.a5,A.a3,A.hK,A.cO,A.bg,A.jt,A.bX,A.h4,A.hj,A.em,A.iM,A.fj,A.dR,A.fS,A.ig,A.ed,A.jV,A.af,A.z,A.cS,A.bD,A.bn,A.fV,A.bo,A.dV,A.k0,A.ib,A.ie,A.fx,A.kH,A.by,A.bJ,A.iL,A.fg,A.cn,A.p5,A.h3,A.k6,A.iZ,A.kG,A.kt,A.dv,A.kd,A.h5,A.fh,A.i3,A.dA,A.lj,A.cR,A.aT,A.j5,A.ik,A.dd,A.l1,A.fA,A.dB,A.iE,A.j1,A.ip,A.dn,A.j_,A.fy,A.i2,A.fI,A.i8,A.it,A.jX,A.aJ,A.eN,A.iy,A.fB,A.bs,A.iA,A.fC,A.lv,A.eo,A.jW,A.h0,A.bt,A.b1,A.hF,A.i4,A.d5,A.b7,A.c7,A.i7,A.hL,A.b8,A.jF,A.iI,A.fw,A.bE,A.hs,A.hz,A.dy,A.iX,A.cJ,A.ho,A.hE,A.hD,A.hC,A.jn,A.l_,A.jo,A.jm,A.jp,A.ef,A.ee,A.e4,A.bY,A.jC,A.hw,A.eF,A.bU,A.ld,A.kR,A.b_,A.ax,A.ha,A.fm,A.hb,A.ec,A.kZ,A.ih,A.j2,A.aW,A.kf,A.aZ,A.hH,A.hG,A.kx,A.aO,A.iN])
q(J.fH,[J.e5,J.e7,J.e8,J.dh,J.di,J.cF,J.ce])
q(J.e8,[J.cf,J.p,A.cg,A.eg])
q(J.cf,[J.fX,J.co,J.bG])
r(J.fJ,A.en)
r(J.iT,J.p)
q(J.cF,[J.e6,J.fK])
q(A.j,[A.cp,A.x,A.cI,A.aV,A.cP,A.bL,A.bS,A.bF,A.cX,A.hl,A.hI,A.cr,A.aq])
q(A.cp,[A.cy,A.f2])
r(A.eE,A.cy)
r(A.eB,A.f2)
r(A.bz,A.eB)
q(A.T,[A.cA,A.bb,A.hx])
q(A.c9,[A.fl,A.i5,A.fk,A.h7,A.o1,A.o3,A.kW,A.kV,A.lH,A.lb,A.jZ,A.jk,A.lf,A.oi,A.oj,A.kO,A.mh,A.op,A.jO,A.jN,A.jL,A.jM,A.jP,A.jQ,A.jS,A.mr,A.nL,A.nJ,A.nK,A.ml,A.my,A.mz,A.mA,A.mw,A.mx,A.lY,A.lZ,A.m_,A.m0,A.m1,A.m2,A.m3,A.m4,A.m5,A.o5,A.lM,A.m9,A.ma,A.mb,A.mc,A.md,A.me,A.m8,A.mf,A.mg,A.lS,A.lT,A.mp,A.mE,A.nH,A.nI,A.mF,A.mG,A.mH,A.mS,A.n2,A.nd,A.no,A.nz,A.nD,A.nE,A.nF,A.mI,A.mJ,A.mC,A.mK,A.mL,A.mM,A.mN,A.mO,A.mP,A.mQ,A.mR,A.mT,A.mU,A.mV,A.mW,A.mX,A.mY,A.mZ,A.n_,A.n0,A.n1,A.n3,A.n4,A.n5,A.n6,A.n7,A.n8,A.n9,A.na,A.nb,A.nc,A.ne,A.nf,A.ng,A.nh,A.ni,A.nj,A.mB,A.nk,A.nl,A.nm,A.nn,A.np,A.nq,A.nr,A.ns,A.nt,A.nu,A.nv,A.nw,A.nx,A.ny,A.nA,A.nB,A.nC,A.lQ,A.lR,A.im,A.o9,A.oL,A.jB,A.jx,A.jA,A.jz,A.k2,A.k1,A.kN,A.kL,A.kK,A.k5,A.nT,A.nU,A.o6,A.mu,A.nN,A.nO,A.ku,A.kv,A.kw,A.ke,A.jj,A.jb,A.ja,A.il,A.iw,A.ix,A.iv,A.iH,A.iF,A.iG,A.ka,A.kb,A.iQ,A.iR,A.iS,A.o7,A.nX,A.iC,A.jY,A.ls,A.lt,A.lm,A.ln,A.lp,A.jH,A.id,A.iK,A.oc,A.mt,A.lK,A.lL,A.lJ,A.l0,A.jE,A.kP,A.mm,A.mn,A.ol,A.oq,A.ii,A.kk,A.km,A.kn,A.kh,A.kj,A.lP,A.ky,A.kz,A.oE,A.ot,A.ow,A.oJ,A.oK,A.oB,A.oC,A.ou,A.oF,A.oG,A.oy,A.on,A.om])
q(A.fl,[A.i6,A.iU,A.o2,A.lI,A.mq,A.lc,A.jl,A.li,A.i9,A.nM,A.jq,A.oo,A.jR,A.m6,A.nG,A.nS,A.lk,A.ji,A.jf,A.jg,A.jh,A.jc,A.jd,A.je,A.j9,A.j6,A.j7,A.j8,A.k9,A.k8,A.kc,A.nW,A.nV,A.lO,A.lN,A.m7,A.iB,A.lr,A.jG,A.iq,A.is,A.lU,A.ok,A.mo,A.kp,A.kr,A.ko,A.ki,A.ov,A.oz])
q(A.Y,[A.dk,A.bO,A.fL,A.hg,A.h_,A.hr,A.dj,A.fe,A.b5,A.ev,A.hf,A.cl,A.fp])
r(A.du,A.y)
r(A.dU,A.du)
q(A.fk,[A.od,A.kX,A.kY,A.lz,A.io,A.l3,A.l7,A.l6,A.l5,A.l4,A.la,A.l9,A.l8,A.k_,A.lx,A.lw,A.ll,A.kU,A.kT,A.mi,A.lD,A.lC,A.jr,A.js,A.jT,A.mD,A.k3,A.kJ,A.kI,A.kM,A.jK,A.jJ,A.j0,A.iu,A.oa,A.iz,A.iD,A.lo,A.lq,A.ic,A.ir,A.iY,A.ms,A.jD,A.kQ,A.kq,A.ks,A.kl,A.kg,A.ox,A.oA,A.oD,A.oH,A.oI])
q(A.x,[A.V,A.dZ,A.aH,A.bc,A.bH,A.eH])
q(A.V,[A.bM,A.aQ,A.aK,A.hy])
r(A.dX,A.cI)
r(A.dY,A.cP)
r(A.dc,A.bL)
r(A.cC,A.bF)
q(A.ay,[A.dC,A.bZ,A.cq])
r(A.e,A.dC)
q(A.bZ,[A.M,A.eO,A.dD,A.eP])
q(A.cq,[A.bu,A.eQ,A.eR])
q(A.d9,[A.ap,A.cc])
q(A.bK,[A.da,A.eS])
q(A.da,[A.bk,A.df])
r(A.ej,A.bO)
q(A.h7,[A.h1,A.d4])
r(A.cG,A.bb)
r(A.dq,A.cg)
q(A.eg,[A.fP,A.av])
q(A.av,[A.eJ,A.eL])
r(A.eK,A.eJ)
r(A.ch,A.eK)
r(A.eM,A.eL)
r(A.aR,A.eM)
q(A.ch,[A.cK,A.cL])
q(A.aR,[A.fQ,A.cM,A.fR,A.cN,A.eh,A.ei,A.ci])
r(A.eX,A.hr)
r(A.bT,A.eC)
r(A.dw,A.eU)
r(A.eW,A.cm)
r(A.dz,A.eW)
r(A.cT,A.dx)
r(A.cU,A.eD)
r(A.cY,A.eS)
q(A.d8,[A.fu,A.fM])
r(A.fN,A.dj)
q(A.fq,[A.iW,A.iV,A.kF,A.hi])
r(A.lg,A.lh)
r(A.hh,A.fu)
q(A.b5,[A.cj,A.fG])
q(A.hq,[A.ds,A.cx,A.db,A.dE,A.X,A.ca,A.cH,A.dl,A.b0])
q(A.bo,[A.fF,A.he])
q(A.he,[A.fU,A.fE,A.fn,A.h8])
q(A.bJ,[A.fO,A.cE])
q(A.fO,[A.bB,A.dm,A.d6])
q(A.dv,[A.cd,A.dt])
q(A.j5,[A.jI,A.k7])
q(A.lv,[A.hp,A.ht,A.hu,A.hk])
q(A.iI,[A.fi,A.iJ])
q(A.b_,[A.dP,A.dQ,A.ex,A.e2,A.ew,A.e3,A.dO])
q(A.ax,[A.hd,A.hc,A.e1,A.dT,A.d7])
q(A.hc,[A.h9,A.eu])
s(A.du,A.bR)
s(A.f2,A.y)
s(A.eJ,A.y)
s(A.eK,A.a2)
s(A.eL,A.y)
s(A.eM,A.a2)
s(A.dw,A.hn)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{c:"int",d:"double",aA:"num",o:"String",w:"bool",a3:"Null",k:"List",m:"Object",K:"Map",a_:"JSObject"},mangledNames:{},types:["~()","m?(z)","w(z)","d(d)","w(aT,c)","o(z)","d(c)","d(aA)","c()","w(@)","w(aT)","w(m?)","~(m?)","d?(z)","d(z)","w(c)","a3(@)","~(d,d)","w(d,d)","w(o)","c(c)","af?(z)","w(d)","w(k<d>)","~(~())","~(c)","Z<~>(k<m?>,~(m?),cm<m?>)","c(d)","a3()","d(d,d,d,d,d,d)","c(c,c)","~(m,bf)","~(d,d,d,bm)","~(@)","by()","d(d,d,d)","@()","c(z)","@(o)","@(z)","@(@)","~(m?,m?)","w(bt)","~(c,c,c)","w(+(d,d))","c(m?,c)","c(bX,bX)","cS(z)","k<o>(z)","m?(z)(c)","k<@>?(z)","bn(z)","c?(z)","k<m?(z)>()","+(o,o)(a5<o,o>)","o(bD)","w(bD)","~(o,o)","m?(z)(d(d))","c?()","d(al,c)","m?(z)?(o)","w(a_)","a3(@,bf)","Z<~>()","w(o,o)","w(cb)","af?()","c(+(c,c),+(c,c))","o(o)","~(c,@)","d(c,d)","a3(~())","m(z)","dn()","c?(c)","~(d,d,d,d)","k<c>()","+codes,level,levels(k<c>,c,k<c>)(c,c)","d(d,d)","d(d,+(k<d>,d))","K<c,bs?>()","d(c,c)","a3(m,bf)","K<o,m?>(z)","~(c,c,c,w)","bt()","c(b1,b1)","~(b8)","c(d,d)","~(d,d,d,d,d,d,d,d,d,d)","m?(m?)","d()","o(o,bm{end!w})","k<d>(m?)","aZ()","w(d,d,d,d,d,d,d,d)","k<m?>(z)","aW(c,by)","k<k<d>>()","@(@,o)","c(aW,aW)","~(c,c,d)","a3(~)","Z<al?>(o)","~(c,k<aJ>)","~(ax)","K<o,+(d,d)>(K<o,+(d,d)>)","bE(m?)","Z<bE>()","~(o)","Z<al>(aZ,c?)","Z<al>()","a3(al)","Z<j<br>>(aZ[c?])","Z<ax?>(b_)","c7()","Z<a3>()","a3(ax?)","~(a_)","c(@,@)","m?(z,m?)","k<d>?(z)","o(m?)","d(d,d,d,d)","~(o{global:w,manualZwj:w})"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"2;":(a,b)=>c=>c instanceof A.e&&a.b(c.a)&&b.b(c.b),"3;":(a,b,c)=>d=>d instanceof A.M&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;bytes,cancel,jobs":(a,b,c)=>d=>d instanceof A.eO&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;codes,level,levels":(a,b,c)=>d=>d instanceof A.dD&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;features,required,script":(a,b,c)=>d=>d instanceof A.eP&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"4;":a=>b=>b instanceof A.bu&&A.pE(a,b.a),"7;blur,halo,italic,phase,sixteenths,size,weight":a=>b=>b instanceof A.eQ&&A.pE(a,b.a),"8;a,arg1,arg2,b,c,d,flags,glyph":a=>b=>b instanceof A.eR&&A.pE(a,b.a)}}
A.vG(v.typeUniverse,JSON.parse('{"bG":"cf","fX":"cf","co":"cf","yO":"cg","e5":{"w":[],"U":[]},"e7":{"a3":[],"U":[]},"e8":{"a_":[]},"cf":{"a_":[]},"p":{"k":["1"],"x":["1"],"a_":[],"j":["1"]},"fJ":{"en":[]},"iT":{"p":["1"],"k":["1"],"x":["1"],"a_":[],"j":["1"]},"b6":{"F":["1"]},"cF":{"d":[],"aA":[],"b9":["aA"]},"e6":{"d":[],"c":[],"aA":[],"b9":["aA"],"U":[]},"fK":{"d":[],"aA":[],"b9":["aA"],"U":[]},"ce":{"o":[],"b9":["o"],"jw":[],"U":[]},"cp":{"j":["2"]},"dS":{"F":["2"]},"cy":{"cp":["1","2"],"j":["2"],"j.E":"2"},"eE":{"cy":["1","2"],"cp":["1","2"],"x":["2"],"j":["2"],"j.E":"2"},"eB":{"y":["2"],"k":["2"],"cp":["1","2"],"x":["2"],"j":["2"]},"bz":{"eB":["1","2"],"y":["2"],"k":["2"],"cp":["1","2"],"x":["2"],"j":["2"],"y.E":"2","j.E":"2"},"cA":{"T":["3","4"],"K":["3","4"],"T.K":"3","T.V":"4"},"dk":{"Y":[]},"dU":{"y":["c"],"bR":["c"],"k":["c"],"x":["c"],"j":["c"],"y.E":"c","bR.E":"c"},"x":{"j":["1"]},"V":{"x":["1"],"j":["1"]},"bM":{"V":["1"],"x":["1"],"j":["1"],"j.E":"1","V.E":"1"},"a1":{"F":["1"]},"cI":{"j":["2"],"j.E":"2"},"dX":{"cI":["1","2"],"x":["2"],"j":["2"],"j.E":"2"},"eb":{"F":["2"]},"aQ":{"V":["2"],"x":["2"],"j":["2"],"j.E":"2","V.E":"2"},"aV":{"j":["1"],"j.E":"1"},"ey":{"F":["1"]},"cP":{"j":["1"],"j.E":"1"},"dY":{"cP":["1"],"x":["1"],"j":["1"],"j.E":"1"},"es":{"F":["1"]},"bL":{"j":["1"],"j.E":"1"},"dc":{"bL":["1"],"x":["1"],"j":["1"],"j.E":"1"},"ep":{"F":["1"]},"dZ":{"x":["1"],"j":["1"],"j.E":"1"},"e_":{"F":["1"]},"bS":{"j":["1"],"j.E":"1"},"cQ":{"F":["1"]},"bF":{"j":["+(c,1)"],"j.E":"+(c,1)"},"cC":{"bF":["1"],"x":["+(c,1)"],"j":["+(c,1)"],"j.E":"+(c,1)"},"ba":{"F":["+(c,1)"]},"du":{"y":["1"],"bR":["1"],"k":["1"],"x":["1"],"j":["1"]},"aK":{"V":["1"],"x":["1"],"j":["1"],"j.E":"1","V.E":"1"},"e":{"dC":[],"ay":[]},"M":{"bZ":[],"ay":[]},"eO":{"bZ":[],"ay":[]},"dD":{"bZ":[],"ay":[]},"eP":{"bZ":[],"ay":[]},"bu":{"cq":[],"ay":[]},"eQ":{"cq":[],"ay":[]},"eR":{"cq":[],"ay":[]},"d9":{"K":["1","2"]},"ap":{"d9":["1","2"],"K":["1","2"]},"cX":{"j":["1"],"j.E":"1"},"bW":{"F":["1"]},"cc":{"d9":["1","2"],"K":["1","2"]},"da":{"bK":["1"],"ck":["1"],"x":["1"],"j":["1"]},"bk":{"da":["1"],"bK":["1"],"ck":["1"],"x":["1"],"j":["1"]},"df":{"da":["1"],"bK":["1"],"ck":["1"],"x":["1"],"j":["1"]},"ej":{"bO":[],"Y":[]},"fL":{"Y":[]},"hg":{"Y":[]},"eT":{"bf":[]},"c9":{"cD":[]},"fk":{"cD":[]},"fl":{"cD":[]},"h7":{"cD":[]},"h1":{"cD":[]},"d4":{"cD":[]},"h_":{"Y":[]},"bb":{"T":["1","2"],"oZ":["1","2"],"K":["1","2"],"T.K":"1","T.V":"2"},"aH":{"x":["1"],"j":["1"],"j.E":"1"},"ea":{"F":["1"]},"bc":{"x":["1"],"j":["1"],"j.E":"1"},"bI":{"F":["1"]},"bH":{"x":["a5<1,2>"],"j":["a5<1,2>"],"j.E":"a5<1,2>"},"e9":{"F":["a5<1,2>"]},"cG":{"bb":["1","2"],"T":["1","2"],"oZ":["1","2"],"K":["1","2"],"T.K":"1","T.V":"2"},"dC":{"ay":[]},"bZ":{"ay":[]},"cq":{"ay":[]},"dg":{"uX":[],"jw":[]},"hB":{"el":[],"dp":[]},"hl":{"j":["el"],"j.E":"el"},"ez":{"F":["el"]},"er":{"dp":[]},"hI":{"j":["dp"],"j.E":"dp"},"hJ":{"F":["dp"]},"dq":{"cg":[],"a_":[],"U":[]},"ci":{"aR":[],"al":[],"y":["c"],"av":["c"],"k":["c"],"aP":["c"],"x":["c"],"a_":[],"j":["c"],"a2":["c"],"U":[],"y.E":"c","a2.E":"c"},"cg":{"a_":[],"U":[]},"eg":{"a_":[]},"fP":{"q3":[],"a_":[],"U":[]},"av":{"aP":["1"],"a_":[]},"ch":{"y":["d"],"av":["d"],"k":["d"],"aP":["d"],"x":["d"],"a_":[],"j":["d"],"a2":["d"]},"aR":{"y":["c"],"av":["c"],"k":["c"],"aP":["c"],"x":["c"],"a_":[],"j":["c"],"a2":["c"]},"cK":{"ch":[],"bm":[],"y":["d"],"av":["d"],"k":["d"],"aP":["d"],"x":["d"],"a_":[],"j":["d"],"a2":["d"],"U":[],"y.E":"d","a2.E":"d"},"cL":{"ch":[],"cb":[],"y":["d"],"av":["d"],"k":["d"],"aP":["d"],"x":["d"],"a_":[],"j":["d"],"a2":["d"],"U":[],"y.E":"d","a2.E":"d"},"fQ":{"aR":[],"y":["c"],"av":["c"],"k":["c"],"aP":["c"],"x":["c"],"a_":[],"j":["c"],"a2":["c"],"U":[],"y.E":"c","a2.E":"c"},"cM":{"aR":[],"iP":[],"y":["c"],"av":["c"],"k":["c"],"aP":["c"],"x":["c"],"a_":[],"j":["c"],"a2":["c"],"U":[],"y.E":"c","a2.E":"c"},"fR":{"aR":[],"y":["c"],"av":["c"],"k":["c"],"aP":["c"],"x":["c"],"a_":[],"j":["c"],"a2":["c"],"U":[],"y.E":"c","a2.E":"c"},"cN":{"aR":[],"kD":[],"y":["c"],"av":["c"],"k":["c"],"aP":["c"],"x":["c"],"a_":[],"j":["c"],"a2":["c"],"U":[],"y.E":"c","a2.E":"c"},"eh":{"aR":[],"kE":[],"y":["c"],"av":["c"],"k":["c"],"aP":["c"],"x":["c"],"a_":[],"j":["c"],"a2":["c"],"U":[],"y.E":"c","a2.E":"c"},"ei":{"aR":[],"y":["c"],"av":["c"],"k":["c"],"aP":["c"],"x":["c"],"a_":[],"j":["c"],"a2":["c"],"U":[],"y.E":"c","a2.E":"c"},"hr":{"Y":[]},"eX":{"bO":[],"Y":[]},"eA":{"fo":["1"]},"d_":{"F":["1"]},"cr":{"j":["1"],"j.E":"1"},"aB":{"Y":[]},"eC":{"fo":["1"]},"bT":{"eC":["1"],"fo":["1"]},"H":{"Z":["1"]},"eU":{"r8":["1"],"cV":["1"]},"dw":{"hn":["1"],"eU":["1"],"r8":["1"],"cV":["1"]},"dz":{"eW":["1"],"cm":["1"]},"cT":{"dx":["1"],"h2":["1"],"cV":["1"]},"dx":{"h2":["1"],"cV":["1"]},"eW":{"cm":["1"]},"cU":{"eD":["1"]},"cY":{"bK":["1"],"ck":["1"],"x":["1"],"j":["1"]},"eG":{"F":["1"]},"y":{"k":["1"],"x":["1"],"j":["1"]},"T":{"K":["1","2"]},"eH":{"x":["2"],"j":["2"],"j.E":"2"},"eI":{"F":["2"]},"bK":{"ck":["1"],"x":["1"],"j":["1"]},"eS":{"bK":["1"],"ck":["1"],"x":["1"],"j":["1"]},"hx":{"T":["o","@"],"K":["o","@"],"T.K":"o","T.V":"@"},"hy":{"V":["o"],"x":["o"],"j":["o"],"j.E":"o","V.E":"o"},"fu":{"d8":["o","k<c>"]},"dj":{"Y":[]},"fN":{"Y":[]},"fM":{"d8":["m?","o"]},"hh":{"d8":["o","k<c>"]},"d":{"aA":[],"b9":["aA"]},"bl":{"b9":["bl"]},"c":{"aA":[],"b9":["aA"]},"k":{"x":["1"],"j":["1"]},"aA":{"b9":["aA"]},"el":{"dp":[]},"ck":{"x":["1"],"j":["1"]},"o":{"b9":["o"],"jw":[]},"hq":{"bA":[]},"fe":{"Y":[]},"bO":{"Y":[]},"b5":{"Y":[]},"cj":{"Y":[]},"fG":{"cj":[],"Y":[]},"ev":{"Y":[]},"hf":{"Y":[]},"cl":{"Y":[]},"fp":{"Y":[]},"fT":{"Y":[]},"eq":{"Y":[]},"hK":{"bf":[]},"aq":{"j":["c"],"j.E":"c"},"cO":{"F":["c"]},"bg":{"v3":[]},"ds":{"bA":[]},"fF":{"bo":[]},"he":{"bo":[]},"fU":{"bo":[]},"fE":{"bo":[]},"fn":{"bo":[]},"h8":{"bo":[]},"cx":{"bA":[]},"db":{"bA":[]},"fO":{"bJ":[]},"bB":{"bJ":[]},"dm":{"bJ":[]},"d6":{"bJ":[]},"cE":{"bJ":[]},"cd":{"dv":[]},"dt":{"dv":[]},"dE":{"bA":[]},"X":{"bA":[]},"hz":{"br":[]},"dy":{"bN":[]},"hD":{"br":[]},"hC":{"bN":[]},"ef":{"br":[]},"ee":{"bN":[]},"ca":{"bA":[]},"dP":{"b_":[]},"dQ":{"b_":[]},"ex":{"b_":[]},"e2":{"b_":[]},"ew":{"b_":[]},"e3":{"b_":[]},"dO":{"b_":[]},"hd":{"ax":[]},"hc":{"ax":[]},"h9":{"ax":[]},"eu":{"ax":[]},"e1":{"ax":[]},"dT":{"ax":[]},"d7":{"ax":[]},"b0":{"bA":[]},"cH":{"bA":[]},"dl":{"bA":[]},"hH":{"br":[]},"hG":{"bN":[]},"ul":{"k":["c"],"x":["c"],"j":["c"]},"al":{"k":["c"],"x":["c"],"j":["c"]},"v9":{"k":["c"],"x":["c"],"j":["c"]},"uk":{"k":["c"],"x":["c"],"j":["c"]},"kD":{"k":["c"],"x":["c"],"j":["c"]},"iP":{"k":["c"],"x":["c"],"j":["c"]},"kE":{"k":["c"],"x":["c"],"j":["c"]},"bm":{"k":["d"],"x":["d"],"j":["d"]},"cb":{"k":["d"],"x":["d"],"j":["d"]}}'))
A.vF(v.typeUniverse,JSON.parse('{"du":1,"f2":2,"av":1,"eD":1,"eS":1,"fq":2}'))
var u={c:"Error handler must accept one Object or one Object and a StackTrace as arguments, and return a value of the returned future's type"}
var t=(function rtii(){var s=A.an
return{bm:s("@<~>"),v:s("aB"),oQ:s("X"),ea:s("by()"),el:s("b8"),j8:s("ca"),gS:s("dU"),bP:s("b9<@>"),j0:s("fo<al?>"),R:s("bk<o>"),jS:s("bl"),P:s("x<@>"),C:s("Y"),t:s("z"),lc:s("fw"),if:s("bB"),pk:s("bm"),kI:s("cb"),oX:s("dd"),oc:s("bD"),gY:s("cD"),iG:s("cc<c,c>"),my:s("bE"),aZ:s("fC<aJ>"),bW:s("iP"),mm:s("j<br>"),id:s("j<d>"),e7:s("j<@>"),fm:s("j<c>"),jQ:s("p<fg>"),de:s("p<X>"),lW:s("p<fh>"),o_:s("p<by>"),dY:s("p<fi>"),oM:s("p<b7>"),hD:s("p<d5>"),i9:s("p<fm>"),r:s("p<b8>"),nu:s("p<fx>"),Y:s("p<bm>"),w:s("p<cb>"),cY:s("p<dd>"),d1:s("p<fy>"),eJ:s("p<bD>"),kG:s("p<a_>"),ot:s("p<k<k<d>>>"),bo:s("p<k<m>>"),eH:s("p<k<+(d,d)>>"),jn:s("p<k<b1>>"),b:s("p<k<d>>"),fC:s("p<k<c>>"),D:s("p<k<m?>>"),bw:s("p<ec>"),ef:s("p<ee>"),gw:s("p<cJ>"),aA:s("p<ci>"),G:s("p<m>"),o9:s("p<bJ>"),A:s("p<aJ>"),kv:s("p<bo>"),cb:s("p<+(k<d>,d)>"),mH:s("p<+(o,k<m?>)>"),m_:s("p<+(o,o)>"),bU:s("p<+(d,cb)>"),I:s("p<+(d,d)>"),n_:s("p<+(c,cn)>"),eu:s("p<+(c,bs)>"),gd:s("p<+(c,w)>"),B:s("p<+(c,c)>"),cm:s("p<+(c,K<o,m?>?)>"),kb:s("p<+(m?,K<o,m?>)>"),lN:s("p<+(m?,m?)>"),c3:s("p<+(k<bN>,k<c>,k<c>)>"),q:s("p<+codes,level,levels(k<c>,c,k<c>)>"),eL:s("p<+(d,d,d)>"),iv:s("p<+(c,c,k<c>)>"),oZ:s("p<+(c,c,d)>"),Q:s("p<+(c,c,c)>"),hc:s("p<+(m?(z),K<o,m?(z)>,w)>"),o5:s("p<+a,arg1,arg2,b,c,d,flags,glyph(d,c,c,d,d,d,c,c)>"),m1:s("p<eo>"),mX:s("p<aT>"),s:s("p<o>"),in:s("p<cn>"),oW:s("p<h5>"),Z:s("p<bN>"),aq:s("p<hb>"),c:s("p<br>"),bs:s("p<al>"),jA:s("p<dv>"),ji:s("p<bU>"),c8:s("p<ho>"),fB:s("p<dA>"),a8:s("p<eF>"),ha:s("p<bt>"),hu:s("p<hs>"),fw:s("p<aW>"),eB:s("p<bX>"),cF:s("p<b1>"),d2:s("p<hL>"),d:s("p<w>"),n:s("p<d>"),dG:s("p<@>"),X:s("p<c>"),ez:s("p<k<k<aJ?>?>?>"),dM:s("p<m?>"),k9:s("p<+(cJ,k<bm>)?>"),e5:s("p<al?>"),nn:s("p<d?>"),g2:s("p<aA>"),V:s("p<m?(z)>"),f7:s("p<~()>"),T:s("e7"),m:s("a_"),et:s("bG"),dX:s("aP<@>"),dn:s("dm"),fc:s("k<X>"),lL:s("k<b7>"),ke:s("k<d5>"),kp:s("k<b8>"),iu:s("k<bm>"),lt:s("k<cb>"),gz:s("k<k<b8>>"),jx:s("k<k<b1>>"),x:s("k<k<d>>"),aB:s("k<cJ>"),a2:s("k<aJ>"),nE:s("k<+(d,d)>"),lK:s("k<+(c,c,d)>"),hy:s("k<aT>"),bF:s("k<o>"),ia:s("k<cn>"),dg:s("k<bN>"),je:s("k<eF>"),nY:s("k<b1>"),o:s("k<d>"),j:s("k<@>"),L:s("k<c>"),W:s("k<m?>"),n7:s("dn"),gc:s("a5<o,o>"),pp:s("K<o,o>"),eM:s("K<o,d>"),f:s("K<@,@>"),ju:s("K<c,aJ>"),h:s("K<o,+(d,d)>"),U:s("K<o,m?>"),dL:s("K<c,bs?>"),gG:s("K<m?,K<o,m?>>"),e:s("K<m?,m?>"),gQ:s("aQ<o,o>"),dl:s("ef"),eb:s("dq"),bi:s("cK"),g_:s("cL"),da:s("cM"),dQ:s("ch"),aj:s("aR"),nZ:s("cN"),ho:s("ci"),a:s("a3"),K:s("m"),jv:s("aJ"),b0:s("cj"),lZ:s("yP"),aK:s("+()"),hT:s("+(k<d>,d)"),l_:s("+(o,em)"),aL:s("+(d,d)"),fY:s("+(c,bs)"),lG:s("+(c,w)"),gn:s("+(c,c)"),E:s("+(m?,m?)"),cP:s("+bytes,cancel,jobs(Z<al>,fj,ck<c>)"),kT:s("+blur,halo,italic,phase,sixteenths,size,weight(c,c,w,c,c,c,c)"),aI:s("+a,arg1,arg2,b,c,d,flags,glyph(d,c,c,d,d,d,c,c)"),lu:s("el"),mk:s("em"),hl:s("aK<c>"),J:s("aq"),gi:s("ck<o>"),gp:s("h0"),oH:s("aT"),l:s("bf"),N:s("o"),gL:s("o(o)"),aJ:s("U"),do:s("bO"),hM:s("kD"),p:s("al"),cx:s("co"),no:s("aV<o>"),hg:s("bT<al?>"),ou:s("bT<~>"),cI:s("dw<m?>"),n6:s("bt"),k:s("H<w>"),_:s("H<@>"),h0:s("H<c>"),ls:s("H<al?>"),cU:s("H<~>"),ct:s("aW"),iM:s("hw"),dt:s("bX"),of:s("hF"),jt:s("b1"),d3:s("eV<m?>"),b6:s("c_<m?>"),an:s("cr<b7>"),y:s("w"),iW:s("w(m)"),jP:s("w(aT,c)"),dA:s("w(o)"),i:s("d"),f3:s("d(d)"),z:s("@"),mY:s("@()"),mq:s("@(m)"),ng:s("@(m,bf)"),S:s("c"),gK:s("Z<a3>?"),hY:s("fA?"),mU:s("a_?"),nw:s("k<b8>?"),n4:s("k<k<d>>()?"),gE:s("k<d>?"),lH:s("k<@>?"),f8:s("k<c>?"),jT:s("K<o,k<+(d,d)>>?"),h9:s("K<o,m?>?"),O:s("m?"),u:s("m?(z)"),bl:s("o?"),lf:s("kE?"),nh:s("al?"),c_:s("ax?"),bA:s("bs?"),F:s("bV<@,@>?"),bQ:s("aW?"),g:s("hA?"),fU:s("w?"),i7:s("w(aT)?"),jX:s("d?"),aV:s("c?"),jh:s("aA?"),jE:s("~()?"),cZ:s("aA"),H:s("~"),M:s("~()"),i6:s("~(m)"),b9:s("~(m,bf)"),jR:s("~(o,@)"),gJ:s("~(d,d)"),cE:s("~(d,d,d,d)"),lD:s("~(c,@)"),dq:s("~(m?)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.bu=J.fH.prototype
B.a=J.p.prototype
B.ah=J.e5.prototype
B.b=J.e6.prototype
B.c=J.cF.prototype
B.d=J.ce.prototype
B.bv=J.bG.prototype
B.bw=J.e8.prototype
B.n=A.cK.prototype
B.v=A.cL.prototype
B.a6=A.cM.prototype
B.ap=A.cN.prototype
B.o=A.eh.prototype
B.E=A.ci.prototype
B.aR=J.fX.prototype
B.as=J.co.prototype
B.f=new A.X(0,"l")
B.h=new A.X(1,"r")
B.C=new A.X(10,"b")
B.N=new A.X(11,"s")
B.O=new A.X(12,"ws")
B.I=new A.X(13,"on")
B.x=new A.X(14,"lre")
B.y=new A.X(15,"lro")
B.p=new A.X(16,"rle")
B.q=new A.X(17,"rlo")
B.z=new A.X(18,"pdf")
B.m=new A.X(19,"lri")
B.F=new A.X(2,"al")
B.i=new A.X(20,"rli")
B.j=new A.X(21,"fsi")
B.r=new A.X(22,"pdi")
B.k=new A.X(3,"en")
B.ac=new A.X(4,"es")
B.Z=new A.X(5,"et")
B.J=new A.X(6,"an")
B.ad=new A.X(7,"cs")
B.ae=new A.X(8,"nsm")
B.A=new A.X(9,"bn")
B.a_=new A.cx(0,"fill")
B.P=new A.cx(1,"line")
B.Q=new A.cx(2,"circle")
B.af=new A.cx(3,"extrusion")
B.ag=new A.dR()
B.aV=new A.e_(A.an("e_<0&>"))
B.ay=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.aW=function() {
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
B.b0=function(getTagFallback) {
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
B.aX=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.b_=function(hooks) {
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
B.aZ=function(hooks) {
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
B.aY=function(hooks) {
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
B.az=function(hooks) { return hooks; }

B.t=new A.fM()
B.b1=new A.fT()
B.B=new A.jU()
B.R=new A.hh()
B.b2=new A.kF()
B.l=new A.kS()
B.a0=new A.hK()
B.aA=new A.ca(0,"zoom")
B.aB=new A.db(0,"butt")
B.b5=new A.db(1,"round")
B.b6=new A.db(2,"square")
B.b7=new A.dV(6553.6,25.6,0.1,1e4)
B.b8=new A.dV(256,1,0.00390625,32768)
B.b9=new A.bl(0)
B.ba=new A.bl(1e4)
B.aC=new A.bl(2e7)
B.bb=new A.bl(3e7)
B.bc=new A.a4("Font data ends early",null,null)
B.bd=new A.a4("An MLT stream is larger than its tile",null,null)
B.be=new A.a4("Not a PMTiles version 3 archive",null,null)
B.bf=new A.a4("An MLT map nests past its end",null,null)
B.bg=new A.a4("A string runs past its tile",null,null)
B.bh=new A.a4("An MLT geometry has too many parts",null,null)
B.bi=new A.a4("A FastPFOR stream is misaligned",null,null)
B.bj=new A.a4("An MLT geometry has too many rings",null,null)
B.bk=new A.a4("An MLT tile reads past its end",null,null)
B.bl=new A.a4("A FastPFOR exception is missing",null,null)
B.bm=new A.a4("An MLT map key is not a string",null,null)
B.bn=new A.a4("An MLT map value is out of its dictionary",null,null)
B.bo=new A.a4("The PMTiles directory is corrupt",null,null)
B.bp=new A.a4("An MLT map value is cut off",null,null)
B.bq=new A.a4("Not a TrueType font",null,null)
B.a1=new A.a4("A varint runs over ten bytes",null,null)
B.br=new A.a4("The PMTiles archive is packed with brotli or zstd; only gzip is read",null,null)
B.bs=new A.a4("An MLT block runs past its tile",null,null)
B.bt=new A.a4("An MLT map runs past its values",null,null)
B.aD=new A.a4("A length runs past its message",null,null)
B.bx=new A.iV(null)
B.by=new A.iW(null)
B.G=new A.dl(0,"butt")
B.ai=new A.dl(1,"round")
B.aj=new A.dl(2,"square")
B.aE=new A.cH(0,"round")
B.ak=new A.cH(1,"bevel")
B.S=new A.cH(2,"miter")
B.bz=new A.cH(3,"none")
B.bA=s([1536,1541,8,1544,1544,8,1547,1547,8,1568,1568,2,1569,1569,8,1570,1573,3,1574,1574,2,1575,1575,3,1576,1576,2,1577,1577,3,1578,1582,2,1583,1586,3,1587,1599,2,1600,1600,5,1601,1607,2,1608,1608,3,1609,1610,2,1646,1647,2,1649,1651,3,1652,1652,8,1653,1655,3,1656,1671,2,1672,1689,3,1690,1727,2,1728,1728,3,1729,1730,2,1731,1739,3,1740,1740,2,1741,1741,3,1742,1742,2,1743,1743,3,1744,1745,2,1746,1747,3,1749,1749,3,1757,1757,8,1774,1775,3,1786,1788,2,1791,1791,2,1807,1807,1,1808,1808,6,1810,1812,2,1813,1814,7,1815,1817,3,1818,1821,2,1822,1822,3,1823,1831,2,1832,1832,3,1833,1833,2,1834,1834,7,1835,1835,2,1836,1836,3,1837,1838,2,1839,1839,7,1869,1869,3,1870,1880,2,1881,1883,3,1884,1898,2,1899,1900,3,1901,1904,2,1905,1905,3,1906,1906,2,1907,1908,3,1909,1911,2,1912,1913,3,1914,1919,2,1994,2026,2,2042,2042,5,2112,2112,3,2113,2117,2,2118,2119,3,2120,2120,2,2121,2121,3,2122,2131,2,2132,2132,3,2133,2133,2,2134,2136,3,2144,2144,2,2145,2145,8,2146,2149,2,2150,2150,8,2151,2151,3,2152,2152,2,2153,2154,3,2160,2178,3,2179,2181,5,2182,2182,2,2183,2184,8,2185,2189,2,2190,2190,3,2191,2191,2,2192,2193,8,2208,2217,2,2218,2220,3,2221,2221,8,2222,2222,3,2223,2224,2,2225,2226,3,2227,2232,2,2233,2233,3,2234,2248,2,2274,2274,8,6150,6150,8,6151,6151,2,6154,6154,5,6158,6158,8,6176,6264,2,6272,6276,8,6277,6278,1,6279,6312,2,6314,6314,2,8204,8204,8,8205,8205,5,8239,8239,8,8294,8297,8,43072,43121,2,43122,43122,4,43123,43123,8,68288,68292,2,68293,68293,3,68294,68294,8,68295,68295,3,68296,68296,8,68297,68298,3,68299,68300,8,68301,68301,4,68302,68306,3,68307,68310,2,68311,68311,4,68312,68316,2,68317,68317,3,68318,68320,2,68321,68321,3,68322,68323,8,68324,68324,3,68331,68334,2,68335,68335,3,68480,68480,2,68481,68481,3,68482,68482,2,68483,68485,3,68486,68488,2,68489,68489,3,68490,68491,2,68492,68492,3,68493,68493,2,68494,68495,3,68496,68496,2,68497,68497,3,68521,68524,3,68525,68526,2,68527,68527,8,68864,68864,4,68865,68897,2,68898,68898,3,68899,68899,2,69314,69314,3,69315,69316,2,69318,69319,2,69424,69426,2,69427,69427,3,69428,69444,2,69445,69445,8,69457,69459,2,69460,69460,3,69488,69491,2,69492,69493,3,69494,69505,2,69552,69552,2,69553,69553,8,69554,69555,2,69556,69558,3,69559,69559,8,69560,69560,2,69561,69562,3,69563,69564,2,69565,69565,3,69566,69567,2,69568,69568,8,69569,69569,2,69570,69571,3,69572,69572,2,69573,69576,8,69577,69577,3,69578,69578,2,69579,69579,4,69821,69821,8,69837,69837,8,125184,125251,2,125259,125259,1],t.X)
B.bB=s([0,4,6,12],t.X)
B.bC=s([0,-1,1],t.n)
B.a2=s([32,32,4,160,160,4,173,173,5,768,879,1,1155,1159,1,1160,1161,3,1425,1469,1,1471,1471,1,1473,1474,1,1476,1477,1,1479,1479,1,1536,1541,5,1552,1562,1,1564,1564,5,1611,1631,1,1648,1648,1,1750,1756,1,1757,1757,5,1759,1764,1,1767,1768,1,1770,1773,1,1807,1807,5,1809,1809,1,1840,1866,1,1958,1968,1,2027,2035,1,2045,2045,1,2070,2073,1,2075,2083,1,2085,2087,1,2089,2093,1,2137,2139,1,2192,2193,5,2199,2207,1,2250,2273,1,2274,2274,5,2275,2306,1,2307,2307,2,2362,2362,1,2363,2363,2,2364,2364,1,2366,2368,2,2369,2376,1,2377,2380,2,2381,2381,1,2382,2383,2,2385,2391,1,2402,2403,1,2433,2433,1,2434,2435,2,2492,2492,1,2494,2496,2,2497,2500,1,2503,2504,2,2507,2508,2,2509,2509,1,2519,2519,2,2530,2531,1,2558,2558,1,2561,2562,1,2563,2563,2,2620,2620,1,2622,2624,2,2625,2626,1,2631,2632,1,2635,2637,1,2641,2641,1,2672,2673,1,2677,2677,1,2689,2690,1,2691,2691,2,2748,2748,1,2750,2752,2,2753,2757,1,2759,2760,1,2761,2761,2,2763,2764,2,2765,2765,1,2786,2787,1,2810,2815,1,2817,2817,1,2818,2819,2,2876,2876,1,2878,2878,2,2879,2879,1,2880,2880,2,2881,2884,1,2887,2888,2,2891,2892,2,2893,2893,1,2901,2902,1,2903,2903,2,2914,2915,1,2946,2946,1,3006,3007,2,3008,3008,1,3009,3010,2,3014,3016,2,3018,3020,2,3021,3021,1,3031,3031,2,3072,3072,1,3073,3075,2,3076,3076,1,3132,3132,1,3134,3136,1,3137,3140,2,3142,3144,1,3146,3149,1,3157,3158,1,3170,3171,1,3201,3201,1,3202,3203,2,3260,3260,1,3262,3262,2,3263,3263,1,3264,3268,2,3270,3270,1,3271,3272,2,3274,3275,2,3276,3277,1,3285,3286,2,3298,3299,1,3315,3315,2,3328,3329,1,3330,3331,2,3387,3388,1,3390,3392,2,3393,3396,1,3398,3400,2,3402,3404,2,3405,3405,1,3415,3415,2,3426,3427,1,3457,3457,1,3458,3459,2,3530,3530,1,3535,3537,2,3538,3540,1,3542,3542,1,3544,3551,2,3570,3571,2,3633,3633,1,3636,3642,1,3655,3662,1,3761,3761,1,3764,3772,1,3784,3790,1,3864,3865,1,3893,3893,1,3895,3895,1,3897,3897,1,3902,3903,2,3953,3966,1,3967,3967,2,3968,3972,1,3974,3975,1,3981,3991,1,3993,4028,1,4038,4038,1,4139,4140,2,4141,4144,1,4145,4145,2,4146,4151,1,4152,4152,2,4153,4154,1,4155,4156,2,4157,4158,1,4182,4183,2,4184,4185,1,4190,4192,1,4194,4196,2,4199,4205,2,4209,4212,1,4226,4226,1,4227,4228,2,4229,4230,1,4231,4236,2,4237,4237,1,4239,4239,2,4250,4252,2,4253,4253,1,4957,4959,1,5760,5760,4,5906,5908,1,5909,5909,2,5938,5939,1,5940,5940,2,5970,5971,1,6002,6003,1,6068,6069,1,6070,6070,2,6071,6077,1,6078,6085,2,6086,6086,1,6087,6088,2,6089,6099,1,6109,6109,1,6155,6157,1,6158,6158,5,6159,6159,1,6277,6278,1,6313,6313,1,6432,6434,1,6435,6438,2,6439,6440,1,6441,6443,2,6448,6449,2,6450,6450,1,6451,6456,2,6457,6459,1,6679,6680,1,6681,6682,2,6683,6683,1,6741,6741,2,6742,6742,1,6743,6743,2,6744,6750,1,6752,6752,1,6753,6753,2,6754,6754,1,6755,6756,2,6757,6764,1,6765,6770,2,6771,6780,1,6783,6783,1,6832,6845,1,6846,6846,3,6847,6877,1,6880,6891,1,6912,6915,1,6916,6916,2,6964,6964,1,6965,6965,2,6966,6970,1,6971,6971,2,6972,6972,1,6973,6977,2,6978,6978,1,6979,6980,2,7019,7027,1,7040,7041,1,7042,7042,2,7073,7073,2,7074,7077,1,7078,7079,2,7080,7081,1,7082,7082,2,7083,7085,1,7142,7142,1,7143,7143,2,7144,7145,1,7146,7148,2,7149,7149,1,7150,7150,2,7151,7153,1,7154,7155,2,7204,7211,2,7212,7219,1,7220,7221,2,7222,7223,1,7376,7378,1,7380,7392,1,7393,7393,2,7394,7400,1,7405,7405,1,7412,7412,1,7415,7415,2,7416,7417,1,7616,7679,1,8192,8202,4,8203,8207,5,8234,8238,5,8239,8239,4,8287,8287,4,8288,8292,5,8294,8303,5,8400,8412,1,8413,8416,3,8417,8417,1,8418,8420,3,8421,8432,1,11503,11505,1,11647,11647,1,11744,11775,1,12288,12288,4,12330,12333,1,12334,12335,2,12441,12442,1,42607,42607,1,42608,42610,3,42612,42621,1,42654,42655,1,42736,42737,1,43010,43010,1,43014,43014,1,43019,43019,1,43043,43044,2,43045,43046,1,43047,43047,2,43052,43052,1,43136,43137,2,43188,43203,2,43204,43205,1,43232,43249,1,43263,43263,1,43302,43309,1,43335,43345,1,43346,43347,2,43392,43394,1,43395,43395,2,43443,43443,1,43444,43445,2,43446,43449,1,43450,43451,2,43452,43453,1,43454,43456,2,43493,43493,1,43561,43566,1,43567,43568,2,43569,43570,1,43571,43572,2,43573,43574,1,43587,43587,1,43596,43596,1,43597,43597,2,43643,43643,2,43644,43644,1,43645,43645,2,43696,43696,1,43698,43700,1,43703,43704,1,43710,43711,1,43713,43713,1,43755,43755,2,43756,43757,1,43758,43759,2,43765,43765,2,43766,43766,1,44003,44004,2,44005,44005,1,44006,44007,2,44008,44008,1,44009,44010,2,44012,44012,2,44013,44013,1,64286,64286,1,65024,65039,1,65056,65071,1,65279,65279,5,65529,65531,5,66045,66045,1,66272,66272,1,66422,66426,1,68097,68099,1,68101,68102,1,68108,68111,1,68152,68154,1,68159,68159,1,68325,68326,1,68900,68903,1,68969,68973,1,69291,69292,1,69370,69375,1,69446,69456,1,69506,69509,1,69632,69632,2,69633,69633,1,69634,69634,2,69688,69702,1,69744,69744,1,69747,69748,1,69759,69761,1,69762,69762,2,69808,69810,2,69811,69814,1,69815,69816,2,69817,69818,1,69821,69821,5,69826,69826,1,69837,69837,5,69888,69890,1,69927,69931,1,69932,69932,2,69933,69940,1,69957,69958,2,70003,70003,1,70016,70017,1,70018,70018,2,70067,70069,2,70070,70078,1,70079,70080,2,70089,70092,1,70094,70094,2,70095,70095,1,70188,70190,2,70191,70193,1,70194,70195,2,70196,70196,1,70197,70197,2,70198,70199,1,70206,70206,1,70209,70209,1,70367,70367,1,70368,70370,2,70371,70378,1,70400,70401,1,70402,70403,2,70459,70460,1,70462,70463,2,70464,70464,1,70465,70468,2,70471,70472,2,70475,70477,2,70487,70487,2,70498,70499,2,70502,70508,1,70512,70516,1,70584,70586,2,70587,70592,1,70594,70594,2,70597,70597,2,70599,70602,2,70604,70605,2,70606,70606,1,70607,70607,2,70608,70608,1,70610,70610,1,70625,70626,1,70709,70711,2,70712,70719,1,70720,70721,2,70722,70724,1,70725,70725,2,70726,70726,1,70750,70750,1,70832,70834,2,70835,70840,1,70841,70841,2,70842,70842,1,70843,70846,2,70847,70848,1,70849,70849,2,70850,70851,1,71087,71089,2,71090,71093,1,71096,71099,2,71100,71101,1,71102,71102,2,71103,71104,1,71132,71133,1,71216,71218,2,71219,71226,1,71227,71228,2,71229,71229,1,71230,71230,2,71231,71232,1,71339,71339,1,71340,71340,2,71341,71341,1,71342,71343,2,71344,71349,1,71350,71350,2,71351,71351,1,71453,71453,1,71454,71454,2,71455,71455,1,71456,71457,2,71458,71461,1,71462,71462,2,71463,71467,1,71724,71726,2,71727,71735,1,71736,71736,2,71737,71738,1,71984,71989,2,71991,71992,2,71995,71996,1,71997,71997,2,71998,71998,1,72e3,72e3,2,72002,72002,2,72003,72003,1,72145,72147,2,72148,72151,1,72154,72155,1,72156,72159,2,72160,72160,1,72164,72164,2,72193,72202,1,72243,72248,1,72249,72249,2,72251,72254,1,72263,72263,1,72273,72278,1,72279,72280,2,72281,72283,1,72330,72342,1,72343,72343,2,72344,72345,1,72544,72544,1,72545,72545,2,72546,72548,1,72549,72549,2,72550,72550,1,72551,72551,2,72751,72751,2,72752,72758,1,72760,72765,1,72766,72766,2,72767,72767,1,72850,72871,1,72873,72873,2,72874,72880,1,72881,72881,2,72882,72883,1,72884,72884,2,72885,72886,1,73009,73014,1,73018,73018,1,73020,73021,1,73023,73029,1,73031,73031,1,73098,73102,2,73104,73105,1,73107,73108,2,73109,73109,1,73110,73110,2,73111,73111,1,73459,73460,1,73461,73462,2,73472,73473,1,73475,73475,2,73524,73525,2,73526,73530,1,73534,73535,2,73536,73536,1,73537,73537,2,73538,73538,1,73562,73562,1,78896,78911,5,78912,78912,1,78919,78933,1,90398,90409,1,90410,90412,2,90413,90415,1,92912,92916,1,92976,92982,1,94031,94031,1,94033,94087,2,94095,94098,1,94180,94180,1,94192,94193,2,113821,113822,1,113824,113827,5,118528,118573,1,118576,118598,1,119141,119142,2,119143,119145,1,119149,119154,2,119155,119162,5,119163,119170,1,119173,119179,1,119210,119213,1,119362,119364,1,121344,121398,1,121403,121452,1,121461,121461,1,121476,121476,1,121499,121503,1,121505,121519,1,122880,122886,1,122888,122904,1,122907,122913,1,122915,122916,1,122918,122922,1,123023,123023,1,123184,123190,1,123566,123566,1,123628,123631,1,124140,124143,1,124398,124399,1,124643,124643,1,124646,124646,1,124654,124655,1,124661,124661,1,125136,125142,1,125252,125258,1,917505,917505,5,917536,917631,5,917760,917999,1],t.X)
B.bD=s([0,64,1,65,90,3,91,96,1,97,122,3,123,169,1,170,170,3,171,185,1,186,186,3,187,191,1,192,214,3,215,215,1,216,246,3,247,247,1,248,696,3,697,735,1,736,740,3,741,745,1,746,747,36,748,767,1,768,879,2,880,883,4,884,884,1,885,887,4,890,893,4,894,894,1,895,895,4,900,900,4,901,901,1,902,902,4,903,903,1,904,906,4,908,908,4,910,929,4,931,993,4,994,1007,55,1008,1023,4,1024,1156,5,1157,1158,2,1159,1327,5,1329,1366,6,1369,1418,6,1421,1423,6,1425,1479,7,1488,1514,7,1519,1524,7,1536,1540,8,1541,1541,1,1542,1547,8,1548,1548,1,1549,1562,8,1563,1563,1,1564,1566,8,1567,1567,1,1568,1599,8,1600,1600,1,1601,1610,8,1611,1621,2,1622,1647,8,1648,1648,2,1649,1756,8,1757,1757,1,1758,1791,8,1792,1805,9,1807,1866,9,1869,1871,9,1872,1919,8,1920,1969,10,1984,2042,66,2045,2047,66,2048,2093,82,2096,2110,82,2112,2139,95,2142,2142,95,2144,2154,9,2160,2193,8,2199,2273,8,2274,2274,1,2275,2303,8,2304,2384,11,2385,2388,2,2389,2403,11,2404,2405,1,2406,2431,11,2432,2435,12,2437,2444,12,2447,2448,12,2451,2472,12,2474,2480,12,2482,2482,12,2486,2489,12,2492,2500,12,2503,2504,12,2507,2510,12,2519,2519,12,2524,2525,12,2527,2531,12,2534,2558,12,2561,2563,13,2565,2570,13,2575,2576,13,2579,2600,13,2602,2608,13,2610,2611,13,2613,2614,13,2616,2617,13,2620,2620,13,2622,2626,13,2631,2632,13,2635,2637,13,2641,2641,13,2649,2652,13,2654,2654,13,2662,2678,13,2689,2691,14,2693,2701,14,2703,2705,14,2707,2728,14,2730,2736,14,2738,2739,14,2741,2745,14,2748,2757,14,2759,2761,14,2763,2765,14,2768,2768,14,2784,2787,14,2790,2801,14,2809,2815,14,2817,2819,15,2821,2828,15,2831,2832,15,2835,2856,15,2858,2864,15,2866,2867,15,2869,2873,15,2876,2884,15,2887,2888,15,2891,2893,15,2901,2903,15,2908,2909,15,2911,2915,15,2918,2935,15,2946,2947,16,2949,2954,16,2958,2960,16,2962,2965,16,2969,2970,16,2972,2972,16,2974,2975,16,2979,2980,16,2984,2986,16,2990,3001,16,3006,3010,16,3014,3016,16,3018,3021,16,3024,3024,16,3031,3031,16,3046,3066,16,3072,3084,17,3086,3088,17,3090,3112,17,3114,3129,17,3132,3140,17,3142,3144,17,3146,3149,17,3157,3158,17,3160,3162,17,3164,3165,17,3168,3171,17,3174,3183,17,3191,3199,17,3200,3212,18,3214,3216,18,3218,3240,18,3242,3251,18,3253,3257,18,3260,3268,18,3270,3272,18,3274,3277,18,3285,3286,18,3292,3294,18,3296,3299,18,3302,3311,18,3313,3315,18,3328,3340,19,3342,3344,19,3346,3396,19,3398,3400,19,3402,3407,19,3412,3427,19,3430,3455,19,3457,3459,20,3461,3478,20,3482,3505,20,3507,3515,20,3517,3517,20,3520,3526,20,3530,3530,20,3535,3540,20,3542,3542,20,3544,3551,20,3558,3567,20,3570,3572,20,3585,3642,21,3647,3647,1,3648,3675,21,3713,3714,22,3716,3716,22,3718,3722,22,3724,3747,22,3749,3749,22,3751,3773,22,3776,3780,22,3782,3782,22,3784,3790,22,3792,3801,22,3804,3807,22,3840,3911,23,3913,3948,23,3953,3991,23,3993,4028,23,4030,4044,23,4046,4052,23,4053,4056,1,4057,4058,23,4096,4255,24,4256,4293,25,4295,4295,25,4301,4301,25,4304,4346,25,4347,4347,1,4348,4351,25,4352,4607,26,4608,4680,27,4682,4685,27,4688,4694,27,4696,4696,27,4698,4701,27,4704,4744,27,4746,4749,27,4752,4784,27,4786,4789,27,4792,4798,27,4800,4800,27,4802,4805,27,4808,4822,27,4824,4880,27,4882,4885,27,4888,4954,27,4957,4988,27,4992,5017,27,5024,5109,28,5112,5117,28,5120,5759,29,5760,5788,30,5792,5866,31,5867,5869,1,5870,5880,31,5888,5909,42,5919,5919,42,5920,5940,43,5941,5942,1,5952,5971,44,5984,5996,45,5998,6000,45,6002,6003,45,6016,6109,32,6112,6121,32,6128,6137,32,6144,6145,33,6146,6147,1,6148,6148,33,6149,6149,1,6150,6169,33,6176,6264,33,6272,6314,33,6320,6389,29,6400,6430,46,6432,6443,46,6448,6459,46,6464,6464,46,6468,6479,46,6480,6509,47,6512,6516,47,6528,6571,56,6576,6601,56,6608,6618,56,6622,6623,56,6624,6655,32,6656,6683,54,6686,6687,54,6688,6750,78,6752,6780,78,6783,6793,78,6800,6809,78,6816,6829,78,6832,6877,2,6880,6891,2,6912,6988,62,6990,7039,62,7040,7103,67,7104,7155,93,7164,7167,93,7168,7223,68,7227,7241,68,7245,7247,68,7248,7295,69,7296,7306,5,7312,7354,25,7357,7359,25,7360,7367,67,7376,7378,2,7379,7379,1,7380,7392,2,7393,7393,1,7394,7400,2,7401,7404,1,7405,7405,2,7406,7411,1,7412,7412,2,7413,7415,1,7416,7417,2,7418,7418,1,7424,7461,3,7462,7466,4,7467,7467,5,7468,7516,3,7517,7521,4,7522,7525,3,7526,7530,4,7531,7543,3,7544,7544,5,7545,7614,3,7615,7615,4,7616,7679,2,7680,7935,3,7936,7957,4,7960,7965,4,7968,8005,4,8008,8013,4,8016,8023,4,8025,8025,4,8027,8027,4,8029,8029,4,8031,8061,4,8064,8116,4,8118,8132,4,8134,8147,4,8150,8155,4,8157,8175,4,8178,8180,4,8182,8190,4,8192,8203,1,8204,8205,2,8206,8292,1,8294,8304,1,8305,8305,3,8308,8318,1,8319,8319,3,8320,8334,1,8336,8348,3,8352,8385,1,8400,8432,2,8448,8485,1,8486,8486,4,8487,8489,1,8490,8491,3,8492,8497,1,8498,8498,3,8499,8525,1,8526,8526,3,8527,8543,1,8544,8584,3,8585,8587,1,8592,9257,1,9280,9290,1,9312,10239,1,10240,10495,53,10496,11123,1,11126,11263,1,11264,11359,57,11360,11391,3,11392,11507,55,11513,11519,55,11520,11557,25,11559,11559,25,11565,11565,25,11568,11623,58,11631,11632,58,11647,11647,58,11648,11670,27,11680,11686,27,11688,11694,27,11696,11702,27,11704,11710,27,11712,11718,27,11720,11726,27,11728,11734,27,11736,11742,27,11744,11775,5,11776,11869,1,11904,11929,37,11931,12019,37,12032,12245,37,12272,12292,1,12293,12293,37,12294,12294,1,12295,12295,37,12296,12320,1,12321,12329,37,12330,12333,2,12334,12335,26,12336,12343,1,12344,12347,37,12348,12351,1,12353,12438,34,12441,12442,2,12443,12444,1,12445,12447,34,12448,12448,1,12449,12538,35,12539,12540,1,12541,12543,35,12549,12591,36,12593,12686,26,12688,12703,1,12704,12735,36,12736,12773,1,12783,12783,1,12784,12799,35,12800,12830,26,12832,12895,1,12896,12926,26,12927,13007,1,13008,13054,35,13055,13055,1,13056,13143,35,13144,13311,1,13312,19903,37,19904,19967,1,19968,40959,37,40960,42124,38,42128,42182,38,42192,42239,83,42240,42539,70,42560,42655,5,42656,42743,84,42752,42785,1,42786,42887,3,42888,42890,1,42891,42972,3,42993,43007,3,43008,43052,59,43056,43065,1,43072,43127,65,43136,43205,71,43214,43225,71,43232,43263,11,43264,43309,72,43310,43310,1,43311,43311,72,43312,43347,73,43359,43359,73,43360,43388,26,43392,43469,85,43471,43471,1,43472,43481,85,43486,43487,85,43488,43518,24,43520,43574,77,43584,43597,77,43600,43609,77,43612,43615,77,43616,43647,24,43648,43714,79,43739,43743,79,43744,43766,86,43777,43782,27,43785,43790,27,43793,43798,27,43808,43814,27,43816,43822,27,43824,43866,3,43867,43867,1,43868,43876,3,43877,43877,4,43878,43881,3,43882,43883,1,43888,43967,28,43968,44013,86,44016,44025,86,44032,55203,26,55216,55238,26,55243,55291,26,63744,64109,37,64112,64217,37,64256,64262,3,64275,64279,6,64285,64310,7,64312,64316,7,64318,64318,7,64320,64321,7,64323,64324,7,64326,64335,7,64336,64829,8,64830,64831,1,64832,64975,8,65008,65023,8,65024,65039,2,65040,65049,1,65056,65069,2,65070,65071,5,65072,65106,1,65108,65126,1,65128,65131,1,65136,65140,8,65142,65276,8,65279,65279,1,65281,65312,1,65313,65338,3,65339,65344,1,65345,65370,3,65371,65381,1,65382,65391,35,65392,65392,1,65393,65437,35,65438,65439,1,65440,65470,26,65474,65479,26,65482,65487,26,65490,65495,26,65498,65500,26,65504,65510,1,65512,65518,1,65529,65533,1,65536,65547,48,65549,65574,48,65576,65594,48,65596,65597,48,65599,65613,48,65616,65629,48,65664,65786,48,65792,65794,1,65799,65843,1,65847,65855,1,65856,65934,4,65936,65948,1,65952,65952,4,66e3,66044,1,66045,66045,2,66176,66204,74,66208,66256,75,66272,66272,2,66273,66299,1,66304,66339,39,66349,66351,39,66352,66378,40,66384,66426,120,66432,66461,49,66463,66463,49,66464,66499,60,66504,66517,60,66560,66639,41,66640,66687,50,66688,66717,51,66720,66729,51,66736,66771,136,66776,66811,136,66816,66855,106,66864,66915,103,66927,66927,103,66928,66938,161,66940,66954,161,66956,66962,161,66964,66965,161,66967,66977,161,66979,66993,161,66995,67001,161,67003,67004,161,67008,67059,169,67072,67382,110,67392,67413,110,67424,67431,110,67456,67461,3,67463,67504,3,67506,67514,3,67584,67589,52,67592,67592,52,67594,67637,52,67639,67640,52,67644,67644,52,67647,67647,52,67648,67669,87,67671,67679,87,67680,67711,118,67712,67742,117,67751,67759,117,67808,67826,128,67828,67829,128,67835,67839,128,67840,67867,64,67871,67871,64,67872,67897,76,67903,67903,76,67904,67929,171,67968,67999,98,68e3,68023,97,68028,68047,97,68050,68095,97,68096,68099,61,68101,68102,61,68108,68115,61,68117,68119,61,68121,68149,61,68152,68154,61,68159,68168,61,68176,68184,61,68192,68223,88,68224,68255,116,68288,68326,112,68331,68342,112,68352,68405,80,68409,68415,80,68416,68437,89,68440,68447,89,68448,68466,90,68472,68479,90,68480,68497,121,68505,68508,121,68521,68527,121,68608,68680,91,68736,68786,130,68800,68850,130,68858,68863,130,68864,68903,146,68912,68921,146,68928,68965,164,68969,68997,164,69006,69007,164,69216,69246,8,69248,69289,156,69291,69293,156,69296,69297,156,69314,69319,8,69328,69336,8,69370,69375,8,69376,69415,148,69424,69465,147,69488,69513,158,69552,69579,153,69600,69622,149,69632,69709,94,69714,69749,94,69759,69759,94,69760,69826,92,69837,69837,92,69840,69864,101,69872,69881,101,69888,69940,96,69942,69959,96,69968,70006,111,70016,70111,100,70113,70132,20,70144,70161,109,70163,70209,109,70272,70278,129,70280,70280,129,70282,70285,129,70287,70301,129,70303,70313,129,70320,70378,123,70384,70393,123,70400,70403,107,70405,70412,107,70415,70416,107,70419,70440,107,70442,70448,107,70450,70451,107,70453,70457,107,70459,70459,2,70460,70468,107,70471,70472,107,70475,70477,107,70480,70480,107,70487,70487,107,70493,70499,107,70502,70508,107,70512,70516,107,70528,70537,170,70539,70539,170,70542,70542,170,70544,70581,170,70583,70592,170,70594,70594,170,70597,70597,170,70599,70602,170,70604,70613,170,70615,70616,170,70625,70626,170,70656,70747,135,70749,70753,135,70784,70855,124,70864,70873,124,71040,71093,122,71096,71133,122,71168,71236,114,71248,71257,114,71264,71276,33,71296,71353,102,71360,71369,102,71376,71395,24,71424,71450,126,71453,71467,126,71472,71494,126,71680,71739,142,71840,71922,125,71935,71935,125,71936,71942,154,71945,71945,154,71948,71955,154,71957,71958,154,71960,71989,154,71991,71992,154,71995,72006,154,72016,72025,154,72096,72103,150,72106,72151,150,72154,72164,150,72192,72263,141,72272,72354,140,72368,72383,29,72384,72440,119,72448,72457,11,72544,72551,100,72640,72673,168,72688,72697,168,72704,72712,133,72714,72758,133,72760,72773,133,72784,72812,133,72816,72847,134,72850,72871,134,72873,72886,134,72960,72966,138,72968,72969,138,72971,73014,138,73018,73018,138,73020,73021,138,73023,73031,138,73040,73049,138,73056,73061,143,73063,73064,143,73066,73102,143,73104,73105,143,73107,73112,143,73120,73129,143,73136,73179,173,73184,73193,173,73440,73464,144,73472,73488,162,73490,73530,162,73534,73562,162,73648,73648,83,73664,73713,16,73727,73727,16,73728,74649,63,74752,74862,63,74864,74868,63,74880,75075,63,77712,77810,157,77824,78933,81,78944,82938,81,82944,83526,127,90368,90425,165,92160,92728,84,92736,92766,115,92768,92777,115,92782,92783,115,92784,92862,159,92864,92873,159,92880,92909,104,92912,92917,104,92928,92997,108,93008,93017,108,93019,93025,108,93027,93047,108,93053,93071,108,93504,93561,166,93760,93850,145,93856,93880,174,93883,93907,174,93952,94026,99,94031,94087,99,94095,94111,99,94176,94176,137,94177,94177,139,94178,94179,37,94180,94180,155,94192,94198,37,94208,101119,137,101120,101589,155,101631,101631,155,101632,101662,137,101760,101874,137,110576,110579,35,110581,110587,35,110589,110590,35,110592,110592,35,110593,110879,34,110880,110882,35,110898,110898,34,110928,110930,34,110933,110933,35,110948,110951,35,110960,111355,139,113664,113770,105,113776,113788,105,113792,113800,105,113808,113817,105,113820,113823,105,113824,113827,1,117760,118012,1,118016,118451,1,118458,118480,1,118496,118512,1,118528,118573,2,118576,118598,2,118608,118723,1,118784,119029,1,119040,119078,1,119081,119142,1,119143,119145,2,119146,119162,1,119163,119170,2,119171,119172,1,119173,119179,2,119180,119209,1,119210,119213,2,119214,119274,1,119296,119365,4,119488,119507,1,119520,119539,1,119552,119638,1,119648,119672,1,119808,119892,1,119894,119964,1,119966,119967,1,119970,119970,1,119973,119974,1,119977,119980,1,119982,119993,1,119995,119995,1,119997,120003,1,120005,120069,1,120071,120074,1,120077,120084,1,120086,120092,1,120094,120121,1,120123,120126,1,120128,120132,1,120134,120134,1,120138,120144,1,120146,120485,1,120488,120779,1,120782,120831,1,120832,121483,131,121499,121503,131,121505,121519,131,122624,122654,3,122661,122666,3,122880,122886,57,122888,122904,57,122907,122913,57,122915,122916,57,122918,122922,57,122928,122989,5,123023,123023,5,123136,123180,151,123184,123197,151,123200,123209,151,123214,123215,151,123536,123566,160,123584,123641,152,123647,123647,152,124112,124153,163,124368,124410,167,124415,124415,167,124608,124638,172,124640,124661,172,124670,124671,172,124896,124902,27,124904,124907,27,124909,124910,27,124912,124926,27,124928,125124,113,125127,125142,113,125184,125259,132,125264,125273,132,125278,125279,132,126065,126132,1,126209,126269,1,126464,126467,8,126469,126495,8,126497,126498,8,126500,126500,8,126503,126503,8,126505,126514,8,126516,126519,8,126521,126521,8,126523,126523,8,126530,126530,8,126535,126535,8,126537,126537,8,126539,126539,8,126541,126543,8,126545,126546,8,126548,126548,8,126551,126551,8,126553,126553,8,126555,126555,8,126557,126557,8,126559,126559,8,126561,126562,8,126564,126564,8,126567,126570,8,126572,126578,8,126580,126583,8,126585,126588,8,126590,126590,8,126592,126601,8,126603,126619,8,126625,126627,8,126629,126633,8,126635,126651,8,126704,126705,8,126976,127019,1,127024,127123,1,127136,127150,1,127153,127167,1,127169,127183,1,127185,127221,1,127232,127405,1,127462,127487,1,127488,127488,34,127489,127490,1,127504,127547,1,127552,127560,1,127568,127569,1,127584,127589,1,127744,128728,1,128732,128748,1,128752,128764,1,128768,128985,1,128992,129003,1,129008,129008,1,129024,129035,1,129040,129095,1,129104,129113,1,129120,129159,1,129168,129197,1,129200,129211,1,129216,129217,1,129232,129240,1,129280,129623,1,129632,129645,1,129648,129660,1,129664,129674,1,129678,129734,1,129736,129736,1,129741,129756,1,129759,129770,1,129775,129784,1,129792,129938,1,129940,130042,1,131072,173791,37,173824,178205,37,178208,183981,37,183984,191456,37,191472,192093,37,194560,195101,37,196608,201546,37,201552,210041,37,917505,917505,1,917536,917631,1,917760,917999,2],t.X)
B.bE=s([32],t.X)
B.bF=s([46,44],t.X)
B.bG=s([768,788,230,789,789,232,790,793,220,794,794,232,795,795,216,796,800,220,801,802,202,803,806,220,807,808,202,809,819,220,820,824,1,825,828,220,829,836,230,837,837,240,838,838,230,839,841,220,842,844,230,845,846,220,848,850,230,851,854,220,855,855,230,856,856,232,857,858,220,859,859,230,860,860,233,861,862,234,863,863,233,864,865,234,866,866,233,867,879,230,1155,1159,230,1425,1425,220,1426,1429,230,1430,1430,220,1431,1433,230,1434,1434,222,1435,1435,220,1436,1441,230,1442,1447,220,1448,1449,230,1450,1450,220,1451,1452,230,1453,1453,222,1454,1454,228,1455,1455,230,1456,1456,10,1457,1457,11,1458,1458,12,1459,1459,13,1460,1460,14,1461,1461,15,1462,1462,16,1463,1463,17,1464,1464,18,1465,1466,19,1467,1467,20,1468,1468,21,1469,1469,22,1471,1471,23,1473,1473,24,1474,1474,25,1476,1476,230,1477,1477,220,1479,1479,18,1552,1559,230,1560,1560,30,1561,1561,31,1562,1562,32,1611,1611,27,1612,1612,28,1613,1613,29,1614,1614,30,1615,1615,31,1616,1616,32,1617,1617,33,1618,1618,34,1619,1620,230,1621,1622,220,1623,1627,230,1628,1628,220,1629,1630,230,1631,1631,220,1648,1648,35,1750,1756,230,1759,1762,230,1763,1763,220,1764,1764,230,1767,1768,230,1770,1770,220,1771,1772,230,1773,1773,220,1809,1809,36,1840,1840,230,1841,1841,220,1842,1843,230,1844,1844,220,1845,1846,230,1847,1849,220,1850,1850,230,1851,1852,220,1853,1853,230,1854,1854,220,1855,1857,230,1858,1858,220,1859,1859,230,1860,1860,220,1861,1861,230,1862,1862,220,1863,1863,230,1864,1864,220,1865,1866,230,2027,2033,230,2034,2034,220,2035,2035,230,2045,2045,220,2070,2073,230,2075,2083,230,2085,2087,230,2089,2093,230,2137,2139,220,2199,2200,230,2201,2203,220,2204,2207,230,2250,2254,230,2255,2259,220,2260,2273,230,2275,2275,220,2276,2277,230,2278,2278,220,2279,2280,230,2281,2281,220,2282,2284,230,2285,2287,220,2288,2288,27,2289,2289,28,2290,2290,29,2291,2293,230,2294,2294,220,2295,2296,230,2297,2298,220,2299,2303,230,2364,2364,7,2381,2381,9,2385,2385,230,2386,2386,220,2387,2388,230,2492,2492,7,2509,2509,9,2558,2558,230,2620,2620,7,2637,2637,9,2748,2748,7,2765,2765,9,2876,2876,7,2893,2893,9,3021,3021,9,3132,3132,7,3149,3149,9,3157,3157,84,3158,3158,91,3260,3260,7,3277,3277,9,3387,3388,9,3405,3405,9,3530,3530,9,3640,3641,103,3642,3642,9,3656,3659,107,3768,3769,118,3770,3770,9,3784,3787,122,3864,3865,220,3893,3893,220,3895,3895,220,3897,3897,216,3953,3953,129,3954,3954,130,3956,3956,132,3962,3965,130,3968,3968,130,3970,3971,230,3972,3972,9,3974,3975,230,4038,4038,220,4151,4151,7,4153,4154,9,4237,4237,220,4957,4959,230,5908,5909,9,5940,5940,9,6098,6098,9,6109,6109,230,6313,6313,228,6457,6457,222,6458,6458,230,6459,6459,220,6679,6679,230,6680,6680,220,6752,6752,9,6773,6780,230,6783,6783,220,6832,6836,230,6837,6842,220,6843,6844,230,6845,6845,220,6847,6848,220,6849,6850,230,6851,6852,220,6853,6857,230,6858,6858,220,6859,6876,230,6877,6877,220,6880,6885,230,6886,6886,220,6887,6890,230,6891,6891,234,6964,6964,7,6980,6980,9,7019,7019,230,7020,7020,220,7021,7027,230,7082,7083,9,7142,7142,7,7154,7155,9,7223,7223,7,7376,7378,230,7380,7380,1,7381,7385,220,7386,7387,230,7388,7391,220,7392,7392,230,7394,7400,1,7405,7405,220,7412,7412,230,7416,7417,230,7616,7617,230,7618,7618,220,7619,7625,230,7626,7626,220,7627,7628,230,7629,7629,234,7630,7630,214,7631,7631,220,7632,7632,202,7633,7669,230,7670,7670,232,7671,7672,228,7673,7673,220,7674,7674,218,7675,7675,230,7676,7676,233,7677,7677,220,7678,7678,230,7679,7679,220,8400,8401,230,8402,8403,1,8404,8407,230,8408,8410,1,8411,8412,230,8417,8417,230,8421,8422,1,8423,8423,230,8424,8424,220,8425,8425,230,8426,8427,1,8428,8431,220,8432,8432,230,11503,11505,230,11647,11647,9,11744,11775,230,12330,12330,218,12331,12331,228,12332,12332,232,12333,12333,222,12334,12335,224,12441,12442,8,42607,42607,230,42612,42621,230,42654,42655,230,42736,42737,230,43014,43014,9,43052,43052,9,43204,43204,9,43232,43249,230,43307,43309,220,43347,43347,9,43443,43443,7,43456,43456,9,43696,43696,230,43698,43699,230,43700,43700,220,43703,43704,230,43710,43711,230,43713,43713,230,43766,43766,9,44013,44013,9,64286,64286,26,65056,65062,230,65063,65069,220,65070,65071,230,66045,66045,220,66272,66272,220,66422,66426,230,68109,68109,220,68111,68111,230,68152,68152,230,68153,68153,1,68154,68154,220,68159,68159,9,68325,68325,230,68326,68326,220,68900,68903,230,68969,68973,230,69291,69292,230,69370,69371,220,69373,69375,220,69446,69447,220,69448,69450,230,69451,69451,220,69452,69452,230,69453,69456,220,69506,69506,230,69507,69507,220,69508,69508,230,69509,69509,220,69702,69702,9,69744,69744,9,69759,69759,9,69817,69817,9,69818,69818,7,69888,69890,230,69939,69940,9,70003,70003,7,70080,70080,9,70090,70090,7,70197,70197,9,70198,70198,7,70377,70377,7,70378,70378,9,70459,70460,7,70477,70477,9,70502,70508,230,70512,70516,230,70606,70608,9,70722,70722,9,70726,70726,7,70750,70750,230,70850,70850,9,70851,70851,7,71103,71103,9,71104,71104,7,71231,71231,9,71350,71350,9,71351,71351,7,71467,71467,9,71737,71737,9,71738,71738,7,71997,71998,9,72003,72003,7,72160,72160,9,72244,72244,9,72263,72263,9,72345,72345,9,72767,72767,9,73026,73026,7,73028,73029,9,73111,73111,9,73537,73538,9,90415,90415,9,92912,92916,1,92976,92982,230,94192,94193,6,113822,113822,1,119141,119142,216,119143,119145,1,119149,119149,226,119150,119154,216,119163,119170,220,119173,119177,230,119178,119179,220,119210,119213,230,119362,119364,230,122880,122886,230,122888,122904,230,122907,122913,230,122915,122916,230,122918,122922,230,123023,123023,230,123184,123190,230,123566,123566,230,123628,123631,230,124140,124141,232,124142,124142,220,124143,124143,230,124398,124398,230,124399,124399,220,124643,124643,230,124646,124646,230,124654,124655,230,124661,124661,230,125136,125142,220,125252,125257,230,125258,125258,7],t.X)
B.eg=new A.e(-1,-1)
B.dE=new A.e(1,-1)
B.dD=new A.e(1,1)
B.ef=new A.e(-1,1)
B.bH=s([B.eg,B.dE,B.dD,B.ef],t.I)
B.bJ=s([173,173,1,847,847,1,1564,1564,1,4447,4448,1,6068,6069,1,6155,6159,1,8203,8207,1,8234,8238,1,8288,8303,1,12644,12644,1,65024,65039,1,65279,65279,1,65440,65440,1,65520,65528,1,113824,113827,1,119155,119162,1,917504,921599,1],t.X)
B.bM=s(["text-transform","text-letter-spacing","text-max-width","text-justify","text-anchor","text-rotate","text-font","icon-anchor"],t.s)
B.K=s([40,41,41,40,60,62,62,60,91,93,93,91,123,125,125,123,171,187,187,171,3898,3899,3899,3898,3900,3901,3901,3900,5787,5788,5788,5787,8249,8250,8250,8249,8261,8262,8262,8261,8317,8318,8318,8317,8333,8334,8334,8333,8712,8715,8713,8716,8714,8717,8715,8712,8716,8713,8717,8714,8725,10741,8735,11262,8736,10659,8737,10651,8738,10656,8740,10990,8764,8765,8765,8764,8771,8909,8773,8780,8780,8773,8786,8787,8787,8786,8788,8789,8789,8788,8804,8805,8805,8804,8806,8807,8807,8806,8808,8809,8809,8808,8810,8811,8811,8810,8814,8815,8815,8814,8816,8817,8817,8816,8818,8819,8819,8818,8820,8821,8821,8820,8822,8823,8823,8822,8824,8825,8825,8824,8826,8827,8827,8826,8828,8829,8829,8828,8830,8831,8831,8830,8832,8833,8833,8832,8834,8835,8835,8834,8836,8837,8837,8836,8838,8839,8839,8838,8840,8841,8841,8840,8842,8843,8843,8842,8847,8848,8848,8847,8849,8850,8850,8849,8856,10680,8866,8867,8867,8866,8870,10974,8872,10980,8873,10979,8875,10981,8880,8881,8881,8880,8882,8883,8883,8882,8884,8885,8885,8884,8886,8887,8887,8886,8888,10204,8905,8906,8906,8905,8907,8908,8908,8907,8909,8771,8912,8913,8913,8912,8918,8919,8919,8918,8920,8921,8921,8920,8922,8923,8923,8922,8924,8925,8925,8924,8926,8927,8927,8926,8928,8929,8929,8928,8930,8931,8931,8930,8932,8933,8933,8932,8934,8935,8935,8934,8936,8937,8937,8936,8938,8939,8939,8938,8940,8941,8941,8940,8944,8945,8945,8944,8946,8954,8947,8955,8948,8956,8950,8957,8951,8958,8954,8946,8955,8947,8956,8948,8957,8950,8958,8951,8968,8969,8969,8968,8970,8971,8971,8970,9001,9002,9002,9001,10088,10089,10089,10088,10090,10091,10091,10090,10092,10093,10093,10092,10094,10095,10095,10094,10096,10097,10097,10096,10098,10099,10099,10098,10100,10101,10101,10100,10179,10180,10180,10179,10181,10182,10182,10181,10184,10185,10185,10184,10187,10189,10189,10187,10197,10198,10198,10197,10204,8888,10205,10206,10206,10205,10210,10211,10211,10210,10212,10213,10213,10212,10214,10215,10215,10214,10216,10217,10217,10216,10218,10219,10219,10218,10220,10221,10221,10220,10222,10223,10223,10222,10627,10628,10628,10627,10629,10630,10630,10629,10631,10632,10632,10631,10633,10634,10634,10633,10635,10636,10636,10635,10637,10640,10638,10639,10639,10638,10640,10637,10641,10642,10642,10641,10643,10644,10644,10643,10645,10646,10646,10645,10647,10648,10648,10647,10651,8737,10656,8738,10659,8736,10660,10661,10661,10660,10664,10665,10665,10664,10666,10667,10667,10666,10668,10669,10669,10668,10670,10671,10671,10670,10680,8856,10688,10689,10689,10688,10692,10693,10693,10692,10703,10704,10704,10703,10705,10706,10706,10705,10708,10709,10709,10708,10712,10713,10713,10712,10714,10715,10715,10714,10728,10729,10729,10728,10741,8725,10744,10745,10745,10744,10748,10749,10749,10748,10795,10796,10796,10795,10797,10798,10798,10797,10804,10805,10805,10804,10812,10813,10813,10812,10852,10853,10853,10852,10873,10874,10874,10873,10875,10876,10876,10875,10877,10878,10878,10877,10879,10880,10880,10879,10881,10882,10882,10881,10883,10884,10884,10883,10885,10886,10886,10885,10887,10888,10888,10887,10889,10890,10890,10889,10891,10892,10892,10891,10893,10894,10894,10893,10895,10896,10896,10895,10897,10898,10898,10897,10899,10900,10900,10899,10901,10902,10902,10901,10903,10904,10904,10903,10905,10906,10906,10905,10907,10908,10908,10907,10909,10910,10910,10909,10911,10912,10912,10911,10913,10914,10914,10913,10918,10919,10919,10918,10920,10921,10921,10920,10922,10923,10923,10922,10924,10925,10925,10924,10927,10928,10928,10927,10929,10930,10930,10929,10931,10932,10932,10931,10933,10934,10934,10933,10935,10936,10936,10935,10937,10938,10938,10937,10939,10940,10940,10939,10941,10942,10942,10941,10943,10944,10944,10943,10945,10946,10946,10945,10947,10948,10948,10947,10949,10950,10950,10949,10951,10952,10952,10951,10953,10954,10954,10953,10955,10956,10956,10955,10957,10958,10958,10957,10959,10960,10960,10959,10961,10962,10962,10961,10963,10964,10964,10963,10965,10966,10966,10965,10974,8870,10979,8873,10980,8872,10981,8875,10988,10989,10989,10988,10990,8740,10999,11e3,11e3,10999,11001,11002,11002,11001,11262,8735,11778,11779,11779,11778,11780,11781,11781,11780,11785,11786,11786,11785,11788,11789,11789,11788,11804,11805,11805,11804,11808,11809,11809,11808,11810,11811,11811,11810,11812,11813,11813,11812,11814,11815,11815,11814,11816,11817,11817,11816,11861,11862,11862,11861,11863,11864,11864,11863,11865,11866,11866,11865,11867,11868,11868,11867,12296,12297,12297,12296,12298,12299,12299,12298,12300,12301,12301,12300,12302,12303,12303,12302,12304,12305,12305,12304,12308,12309,12309,12308,12310,12311,12311,12310,12312,12313,12313,12312,12314,12315,12315,12314,65113,65114,65114,65113,65115,65116,65116,65115,65117,65118,65118,65117,65124,65125,65125,65124,65288,65289,65289,65288,65308,65310,65310,65308,65339,65341,65341,65339,65371,65373,65373,65371,65375,65376,65376,65375,65378,65379,65379,65378],t.X)
B.L=s([60,824,8814,61,824,8800,62,824,8815,65,768,192,65,769,193,65,770,194,65,771,195,65,772,256,65,774,258,65,775,550,65,776,196,65,777,7842,65,778,197,65,780,461,65,783,512,65,785,514,65,803,7840,65,805,7680,65,808,260,66,775,7682,66,803,7684,66,817,7686,67,769,262,67,770,264,67,775,266,67,780,268,67,807,199,68,775,7690,68,780,270,68,803,7692,68,807,7696,68,813,7698,68,817,7694,69,768,200,69,769,201,69,770,202,69,771,7868,69,772,274,69,774,276,69,775,278,69,776,203,69,777,7866,69,780,282,69,783,516,69,785,518,69,803,7864,69,807,552,69,808,280,69,813,7704,69,816,7706,70,775,7710,71,769,500,71,770,284,71,772,7712,71,774,286,71,775,288,71,780,486,71,807,290,72,770,292,72,775,7714,72,776,7718,72,780,542,72,803,7716,72,807,7720,72,814,7722,73,768,204,73,769,205,73,770,206,73,771,296,73,772,298,73,774,300,73,775,304,73,776,207,73,777,7880,73,780,463,73,783,520,73,785,522,73,803,7882,73,808,302,73,816,7724,74,770,308,75,769,7728,75,780,488,75,803,7730,75,807,310,75,817,7732,76,769,313,76,780,317,76,803,7734,76,807,315,76,813,7740,76,817,7738,77,769,7742,77,775,7744,77,803,7746,78,768,504,78,769,323,78,771,209,78,775,7748,78,780,327,78,803,7750,78,807,325,78,813,7754,78,817,7752,79,768,210,79,769,211,79,770,212,79,771,213,79,772,332,79,774,334,79,775,558,79,776,214,79,777,7886,79,779,336,79,780,465,79,783,524,79,785,526,79,795,416,79,803,7884,79,808,490,80,769,7764,80,775,7766,82,769,340,82,775,7768,82,780,344,82,783,528,82,785,530,82,803,7770,82,807,342,82,817,7774,83,769,346,83,770,348,83,775,7776,83,780,352,83,803,7778,83,806,536,83,807,350,84,775,7786,84,780,356,84,803,7788,84,806,538,84,807,354,84,813,7792,84,817,7790,85,768,217,85,769,218,85,770,219,85,771,360,85,772,362,85,774,364,85,776,220,85,777,7910,85,778,366,85,779,368,85,780,467,85,783,532,85,785,534,85,795,431,85,803,7908,85,804,7794,85,808,370,85,813,7798,85,816,7796,86,771,7804,86,803,7806,87,768,7808,87,769,7810,87,770,372,87,775,7814,87,776,7812,87,803,7816,88,775,7818,88,776,7820,89,768,7922,89,769,221,89,770,374,89,771,7928,89,772,562,89,775,7822,89,776,376,89,777,7926,89,803,7924,90,769,377,90,770,7824,90,775,379,90,780,381,90,803,7826,90,817,7828,97,768,224,97,769,225,97,770,226,97,771,227,97,772,257,97,774,259,97,775,551,97,776,228,97,777,7843,97,778,229,97,780,462,97,783,513,97,785,515,97,803,7841,97,805,7681,97,808,261,98,775,7683,98,803,7685,98,817,7687,99,769,263,99,770,265,99,775,267,99,780,269,99,807,231,100,775,7691,100,780,271,100,803,7693,100,807,7697,100,813,7699,100,817,7695,101,768,232,101,769,233,101,770,234,101,771,7869,101,772,275,101,774,277,101,775,279,101,776,235,101,777,7867,101,780,283,101,783,517,101,785,519,101,803,7865,101,807,553,101,808,281,101,813,7705,101,816,7707,102,775,7711,103,769,501,103,770,285,103,772,7713,103,774,287,103,775,289,103,780,487,103,807,291,104,770,293,104,775,7715,104,776,7719,104,780,543,104,803,7717,104,807,7721,104,814,7723,104,817,7830,105,768,236,105,769,237,105,770,238,105,771,297,105,772,299,105,774,301,105,776,239,105,777,7881,105,780,464,105,783,521,105,785,523,105,803,7883,105,808,303,105,816,7725,106,770,309,106,780,496,107,769,7729,107,780,489,107,803,7731,107,807,311,107,817,7733,108,769,314,108,780,318,108,803,7735,108,807,316,108,813,7741,108,817,7739,109,769,7743,109,775,7745,109,803,7747,110,768,505,110,769,324,110,771,241,110,775,7749,110,780,328,110,803,7751,110,807,326,110,813,7755,110,817,7753,111,768,242,111,769,243,111,770,244,111,771,245,111,772,333,111,774,335,111,775,559,111,776,246,111,777,7887,111,779,337,111,780,466,111,783,525,111,785,527,111,795,417,111,803,7885,111,808,491,112,769,7765,112,775,7767,114,769,341,114,775,7769,114,780,345,114,783,529,114,785,531,114,803,7771,114,807,343,114,817,7775,115,769,347,115,770,349,115,775,7777,115,780,353,115,803,7779,115,806,537,115,807,351,116,775,7787,116,776,7831,116,780,357,116,803,7789,116,806,539,116,807,355,116,813,7793,116,817,7791,117,768,249,117,769,250,117,770,251,117,771,361,117,772,363,117,774,365,117,776,252,117,777,7911,117,778,367,117,779,369,117,780,468,117,783,533,117,785,535,117,795,432,117,803,7909,117,804,7795,117,808,371,117,813,7799,117,816,7797,118,771,7805,118,803,7807,119,768,7809,119,769,7811,119,770,373,119,775,7815,119,776,7813,119,778,7832,119,803,7817,120,775,7819,120,776,7821,121,768,7923,121,769,253,121,770,375,121,771,7929,121,772,563,121,775,7823,121,776,255,121,777,7927,121,778,7833,121,803,7925,122,769,378,122,770,7825,122,775,380,122,780,382,122,803,7827,122,817,7829,168,768,8173,168,769,901,168,834,8129,194,768,7846,194,769,7844,194,771,7850,194,777,7848,196,772,478,197,769,506,198,769,508,198,772,482,199,769,7688,202,768,7872,202,769,7870,202,771,7876,202,777,7874,207,769,7726,212,768,7890,212,769,7888,212,771,7894,212,777,7892,213,769,7756,213,772,556,213,776,7758,214,772,554,216,769,510,220,768,475,220,769,471,220,772,469,220,780,473,226,768,7847,226,769,7845,226,771,7851,226,777,7849,228,772,479,229,769,507,230,769,509,230,772,483,231,769,7689,234,768,7873,234,769,7871,234,771,7877,234,777,7875,239,769,7727,244,768,7891,244,769,7889,244,771,7895,244,777,7893,245,769,7757,245,772,557,245,776,7759,246,772,555,248,769,511,252,768,476,252,769,472,252,772,470,252,780,474,258,768,7856,258,769,7854,258,771,7860,258,777,7858,259,768,7857,259,769,7855,259,771,7861,259,777,7859,274,768,7700,274,769,7702,275,768,7701,275,769,7703,332,768,7760,332,769,7762,333,768,7761,333,769,7763,346,775,7780,347,775,7781,352,775,7782,353,775,7783,360,769,7800,361,769,7801,362,776,7802,363,776,7803,383,775,7835,416,768,7900,416,769,7898,416,771,7904,416,777,7902,416,803,7906,417,768,7901,417,769,7899,417,771,7905,417,777,7903,417,803,7907,431,768,7914,431,769,7912,431,771,7918,431,777,7916,431,803,7920,432,768,7915,432,769,7913,432,771,7919,432,777,7917,432,803,7921,439,780,494,490,772,492,491,772,493,550,772,480,551,772,481,552,774,7708,553,774,7709,558,772,560,559,772,561,658,780,495,913,768,8122,913,769,902,913,772,8121,913,774,8120,913,787,7944,913,788,7945,913,837,8124,917,768,8136,917,769,904,917,787,7960,917,788,7961,919,768,8138,919,769,905,919,787,7976,919,788,7977,919,837,8140,921,768,8154,921,769,906,921,772,8153,921,774,8152,921,776,938,921,787,7992,921,788,7993,927,768,8184,927,769,908,927,787,8008,927,788,8009,929,788,8172,933,768,8170,933,769,910,933,772,8169,933,774,8168,933,776,939,933,788,8025,937,768,8186,937,769,911,937,787,8040,937,788,8041,937,837,8188,940,837,8116,942,837,8132,945,768,8048,945,769,940,945,772,8113,945,774,8112,945,787,7936,945,788,7937,945,834,8118,945,837,8115,949,768,8050,949,769,941,949,787,7952,949,788,7953,951,768,8052,951,769,942,951,787,7968,951,788,7969,951,834,8134,951,837,8131,953,768,8054,953,769,943,953,772,8145,953,774,8144,953,776,970,953,787,7984,953,788,7985,953,834,8150,959,768,8056,959,769,972,959,787,8000,959,788,8001,961,787,8164,961,788,8165,965,768,8058,965,769,973,965,772,8161,965,774,8160,965,776,971,965,787,8016,965,788,8017,965,834,8166,969,768,8060,969,769,974,969,787,8032,969,788,8033,969,834,8182,969,837,8179,970,768,8146,970,769,912,970,834,8151,971,768,8162,971,769,944,971,834,8167,974,837,8180,978,769,979,978,776,980,1030,776,1031,1040,774,1232,1040,776,1234,1043,769,1027,1045,768,1024,1045,774,1238,1045,776,1025,1046,774,1217,1046,776,1244,1047,776,1246,1048,768,1037,1048,772,1250,1048,774,1049,1048,776,1252,1050,769,1036,1054,776,1254,1059,772,1262,1059,774,1038,1059,776,1264,1059,779,1266,1063,776,1268,1067,776,1272,1069,776,1260,1072,774,1233,1072,776,1235,1075,769,1107,1077,768,1104,1077,774,1239,1077,776,1105,1078,774,1218,1078,776,1245,1079,776,1247,1080,768,1117,1080,772,1251,1080,774,1081,1080,776,1253,1082,769,1116,1086,776,1255,1091,772,1263,1091,774,1118,1091,776,1265,1091,779,1267,1095,776,1269,1099,776,1273,1101,776,1261,1110,776,1111,1140,783,1142,1141,783,1143,1240,776,1242,1241,776,1243,1256,776,1258,1257,776,1259,1575,1619,1570,1575,1620,1571,1575,1621,1573,1608,1620,1572,1610,1620,1574,1729,1620,1730,1746,1620,1747,1749,1620,1728,2344,2364,2345,2352,2364,2353,2355,2364,2356,2503,2494,2507,2503,2519,2508,2887,2878,2891,2887,2902,2888,2887,2903,2892,2962,3031,2964,3014,3006,3018,3014,3031,3020,3015,3006,3019,3142,3158,3144,3263,3285,3264,3270,3266,3274,3270,3285,3271,3270,3286,3272,3274,3285,3275,3398,3390,3402,3398,3415,3404,3399,3390,3403,3545,3530,3546,3545,3535,3548,3545,3551,3550,3548,3530,3549,4133,4142,4134,6917,6965,6918,6919,6965,6920,6921,6965,6922,6923,6965,6924,6925,6965,6926,6929,6965,6930,6970,6965,6971,6972,6965,6973,6974,6965,6976,6975,6965,6977,6978,6965,6979,7734,772,7736,7735,772,7737,7770,772,7772,7771,772,7773,7778,775,7784,7779,775,7785,7840,770,7852,7840,774,7862,7841,770,7853,7841,774,7863,7864,770,7878,7865,770,7879,7884,770,7896,7885,770,7897,7936,768,7938,7936,769,7940,7936,834,7942,7936,837,8064,7937,768,7939,7937,769,7941,7937,834,7943,7937,837,8065,7938,837,8066,7939,837,8067,7940,837,8068,7941,837,8069,7942,837,8070,7943,837,8071,7944,768,7946,7944,769,7948,7944,834,7950,7944,837,8072,7945,768,7947,7945,769,7949,7945,834,7951,7945,837,8073,7946,837,8074,7947,837,8075,7948,837,8076,7949,837,8077,7950,837,8078,7951,837,8079,7952,768,7954,7952,769,7956,7953,768,7955,7953,769,7957,7960,768,7962,7960,769,7964,7961,768,7963,7961,769,7965,7968,768,7970,7968,769,7972,7968,834,7974,7968,837,8080,7969,768,7971,7969,769,7973,7969,834,7975,7969,837,8081,7970,837,8082,7971,837,8083,7972,837,8084,7973,837,8085,7974,837,8086,7975,837,8087,7976,768,7978,7976,769,7980,7976,834,7982,7976,837,8088,7977,768,7979,7977,769,7981,7977,834,7983,7977,837,8089,7978,837,8090,7979,837,8091,7980,837,8092,7981,837,8093,7982,837,8094,7983,837,8095,7984,768,7986,7984,769,7988,7984,834,7990,7985,768,7987,7985,769,7989,7985,834,7991,7992,768,7994,7992,769,7996,7992,834,7998,7993,768,7995,7993,769,7997,7993,834,7999,8000,768,8002,8000,769,8004,8001,768,8003,8001,769,8005,8008,768,8010,8008,769,8012,8009,768,8011,8009,769,8013,8016,768,8018,8016,769,8020,8016,834,8022,8017,768,8019,8017,769,8021,8017,834,8023,8025,768,8027,8025,769,8029,8025,834,8031,8032,768,8034,8032,769,8036,8032,834,8038,8032,837,8096,8033,768,8035,8033,769,8037,8033,834,8039,8033,837,8097,8034,837,8098,8035,837,8099,8036,837,8100,8037,837,8101,8038,837,8102,8039,837,8103,8040,768,8042,8040,769,8044,8040,834,8046,8040,837,8104,8041,768,8043,8041,769,8045,8041,834,8047,8041,837,8105,8042,837,8106,8043,837,8107,8044,837,8108,8045,837,8109,8046,837,8110,8047,837,8111,8048,837,8114,8052,837,8130,8060,837,8178,8118,837,8119,8127,768,8141,8127,769,8142,8127,834,8143,8134,837,8135,8182,837,8183,8190,768,8157,8190,769,8158,8190,834,8159,8592,824,8602,8594,824,8603,8596,824,8622,8656,824,8653,8658,824,8655,8660,824,8654,8707,824,8708,8712,824,8713,8715,824,8716,8739,824,8740,8741,824,8742,8764,824,8769,8771,824,8772,8773,824,8775,8776,824,8777,8781,824,8813,8801,824,8802,8804,824,8816,8805,824,8817,8818,824,8820,8819,824,8821,8822,824,8824,8823,824,8825,8826,824,8832,8827,824,8833,8828,824,8928,8829,824,8929,8834,824,8836,8835,824,8837,8838,824,8840,8839,824,8841,8849,824,8930,8850,824,8931,8866,824,8876,8872,824,8877,8873,824,8878,8875,824,8879,8882,824,8938,8883,824,8939,8884,824,8940,8885,824,8941,12358,12441,12436,12363,12441,12364,12365,12441,12366,12367,12441,12368,12369,12441,12370,12371,12441,12372,12373,12441,12374,12375,12441,12376,12377,12441,12378,12379,12441,12380,12381,12441,12382,12383,12441,12384,12385,12441,12386,12388,12441,12389,12390,12441,12391,12392,12441,12393,12399,12441,12400,12399,12442,12401,12402,12441,12403,12402,12442,12404,12405,12441,12406,12405,12442,12407,12408,12441,12409,12408,12442,12410,12411,12441,12412,12411,12442,12413,12445,12441,12446,12454,12441,12532,12459,12441,12460,12461,12441,12462,12463,12441,12464,12465,12441,12466,12467,12441,12468,12469,12441,12470,12471,12441,12472,12473,12441,12474,12475,12441,12476,12477,12441,12478,12479,12441,12480,12481,12441,12482,12484,12441,12485,12486,12441,12487,12488,12441,12489,12495,12441,12496,12495,12442,12497,12498,12441,12499,12498,12442,12500,12501,12441,12502,12501,12442,12503,12504,12441,12505,12504,12442,12506,12507,12441,12508,12507,12442,12509,12527,12441,12535,12528,12441,12536,12529,12441,12537,12530,12441,12538,12541,12441,12542,67026,775,67017,67034,775,67044,69785,69818,69786,69787,69818,69788,69797,69818,69803,69937,69927,69934,69938,69927,69935,70471,70462,70475,70471,70487,70476,70530,70601,70531,70532,70587,70533,70539,70594,70542,70544,70601,70545,70594,70584,70599,70594,70594,70597,70594,70601,70600,70841,70832,70844,70841,70842,70843,70841,70845,70846,71096,71087,71098,71097,71087,71099,71989,71984,71992,90398,90398,90401,90398,90399,90403,90398,90400,90405,90398,90409,90402,90401,90399,90406,90401,90400,90408,90402,90399,90407,90409,90399,90404,93539,93543,93545,93543,93543,93544,93545,93543,93546],t.X)
B.aF=s([1570,65269,65270,0,0,1571,65271,65272,0,0,1573,65273,65274,0,0,1575,65275,65276,0,0,1609,64579,64646,0,0],t.X)
B.bP=s(["","@2x"],t.s)
B.bR=s(["abvm","blwm","ccmp","locl","mark","mkmk","rlig","calt","clig","curs","dist","kern","liga","rclt"],t.s)
B.bS=s(["line-color","line-opacity","line-width","line-gap-width","line-offset","line-blur","line-pattern","line-dasharray"],t.s)
B.bT=s(["heatmap-weight","heatmap-radius"],t.s)
B.dO=new A.e(3,10)
B.cI=new A.e(0,6)
B.cG=new A.e(0,4)
B.dN=new A.e(3,1)
B.cF=new A.e(0,3)
B.cE=new A.e(0,2)
B.cD=new A.e(0,1)
B.aS=new A.e(0,0)
B.aT=new A.e(3,0)
B.bU=s([B.dO,B.cI,B.cG,B.dN,B.cF,B.cE,B.cD,B.aS,B.aT],t.B)
B.T=s([192,65,768,193,65,769,194,65,770,195,65,771,196,65,776,197,65,778,199,67,807,200,69,768,201,69,769,202,69,770,203,69,776,204,73,768,205,73,769,206,73,770,207,73,776,209,78,771,210,79,768,211,79,769,212,79,770,213,79,771,214,79,776,217,85,768,218,85,769,219,85,770,220,85,776,221,89,769,224,97,768,225,97,769,226,97,770,227,97,771,228,97,776,229,97,778,231,99,807,232,101,768,233,101,769,234,101,770,235,101,776,236,105,768,237,105,769,238,105,770,239,105,776,241,110,771,242,111,768,243,111,769,244,111,770,245,111,771,246,111,776,249,117,768,250,117,769,251,117,770,252,117,776,253,121,769,255,121,776,256,65,772,257,97,772,258,65,774,259,97,774,260,65,808,261,97,808,262,67,769,263,99,769,264,67,770,265,99,770,266,67,775,267,99,775,268,67,780,269,99,780,270,68,780,271,100,780,274,69,772,275,101,772,276,69,774,277,101,774,278,69,775,279,101,775,280,69,808,281,101,808,282,69,780,283,101,780,284,71,770,285,103,770,286,71,774,287,103,774,288,71,775,289,103,775,290,71,807,291,103,807,292,72,770,293,104,770,296,73,771,297,105,771,298,73,772,299,105,772,300,73,774,301,105,774,302,73,808,303,105,808,304,73,775,308,74,770,309,106,770,310,75,807,311,107,807,313,76,769,314,108,769,315,76,807,316,108,807,317,76,780,318,108,780,323,78,769,324,110,769,325,78,807,326,110,807,327,78,780,328,110,780,332,79,772,333,111,772,334,79,774,335,111,774,336,79,779,337,111,779,340,82,769,341,114,769,342,82,807,343,114,807,344,82,780,345,114,780,346,83,769,347,115,769,348,83,770,349,115,770,350,83,807,351,115,807,352,83,780,353,115,780,354,84,807,355,116,807,356,84,780,357,116,780,360,85,771,361,117,771,362,85,772,363,117,772,364,85,774,365,117,774,366,85,778,367,117,778,368,85,779,369,117,779,370,85,808,371,117,808,372,87,770,373,119,770,374,89,770,375,121,770,376,89,776,377,90,769,378,122,769,379,90,775,380,122,775,381,90,780,382,122,780,416,79,795,417,111,795,431,85,795,432,117,795,461,65,780,462,97,780,463,73,780,464,105,780,465,79,780,466,111,780,467,85,780,468,117,780,469,220,772,470,252,772,471,220,769,472,252,769,473,220,780,474,252,780,475,220,768,476,252,768,478,196,772,479,228,772,480,550,772,481,551,772,482,198,772,483,230,772,486,71,780,487,103,780,488,75,780,489,107,780,490,79,808,491,111,808,492,490,772,493,491,772,494,439,780,495,658,780,496,106,780,500,71,769,501,103,769,504,78,768,505,110,768,506,197,769,507,229,769,508,198,769,509,230,769,510,216,769,511,248,769,512,65,783,513,97,783,514,65,785,515,97,785,516,69,783,517,101,783,518,69,785,519,101,785,520,73,783,521,105,783,522,73,785,523,105,785,524,79,783,525,111,783,526,79,785,527,111,785,528,82,783,529,114,783,530,82,785,531,114,785,532,85,783,533,117,783,534,85,785,535,117,785,536,83,806,537,115,806,538,84,806,539,116,806,542,72,780,543,104,780,550,65,775,551,97,775,552,69,807,553,101,807,554,214,772,555,246,772,556,213,772,557,245,772,558,79,775,559,111,775,560,558,772,561,559,772,562,89,772,563,121,772,832,768,0,833,769,0,835,787,0,836,776,769,884,697,0,894,59,0,901,168,769,902,913,769,903,183,0,904,917,769,905,919,769,906,921,769,908,927,769,910,933,769,911,937,769,912,970,769,938,921,776,939,933,776,940,945,769,941,949,769,942,951,769,943,953,769,944,971,769,970,953,776,971,965,776,972,959,769,973,965,769,974,969,769,979,978,769,980,978,776,1024,1045,768,1025,1045,776,1027,1043,769,1031,1030,776,1036,1050,769,1037,1048,768,1038,1059,774,1049,1048,774,1081,1080,774,1104,1077,768,1105,1077,776,1107,1075,769,1111,1110,776,1116,1082,769,1117,1080,768,1118,1091,774,1142,1140,783,1143,1141,783,1217,1046,774,1218,1078,774,1232,1040,774,1233,1072,774,1234,1040,776,1235,1072,776,1238,1045,774,1239,1077,774,1242,1240,776,1243,1241,776,1244,1046,776,1245,1078,776,1246,1047,776,1247,1079,776,1250,1048,772,1251,1080,772,1252,1048,776,1253,1080,776,1254,1054,776,1255,1086,776,1258,1256,776,1259,1257,776,1260,1069,776,1261,1101,776,1262,1059,772,1263,1091,772,1264,1059,776,1265,1091,776,1266,1059,779,1267,1091,779,1268,1063,776,1269,1095,776,1272,1067,776,1273,1099,776,1570,1575,1619,1571,1575,1620,1572,1608,1620,1573,1575,1621,1574,1610,1620,1728,1749,1620,1730,1729,1620,1747,1746,1620,2345,2344,2364,2353,2352,2364,2356,2355,2364,2392,2325,2364,2393,2326,2364,2394,2327,2364,2395,2332,2364,2396,2337,2364,2397,2338,2364,2398,2347,2364,2399,2351,2364,2507,2503,2494,2508,2503,2519,2524,2465,2492,2525,2466,2492,2527,2479,2492,2611,2610,2620,2614,2616,2620,2649,2582,2620,2650,2583,2620,2651,2588,2620,2654,2603,2620,2888,2887,2902,2891,2887,2878,2892,2887,2903,2908,2849,2876,2909,2850,2876,2964,2962,3031,3018,3014,3006,3019,3015,3006,3020,3014,3031,3144,3142,3158,3264,3263,3285,3271,3270,3285,3272,3270,3286,3274,3270,3266,3275,3274,3285,3402,3398,3390,3403,3399,3390,3404,3398,3415,3546,3545,3530,3548,3545,3535,3549,3548,3530,3550,3545,3551,3907,3906,4023,3917,3916,4023,3922,3921,4023,3927,3926,4023,3932,3931,4023,3945,3904,4021,3955,3953,3954,3957,3953,3956,3958,4018,3968,3960,4019,3968,3969,3953,3968,3987,3986,4023,3997,3996,4023,4002,4001,4023,4007,4006,4023,4012,4011,4023,4025,3984,4021,4134,4133,4142,6918,6917,6965,6920,6919,6965,6922,6921,6965,6924,6923,6965,6926,6925,6965,6930,6929,6965,6971,6970,6965,6973,6972,6965,6976,6974,6965,6977,6975,6965,6979,6978,6965,7680,65,805,7681,97,805,7682,66,775,7683,98,775,7684,66,803,7685,98,803,7686,66,817,7687,98,817,7688,199,769,7689,231,769,7690,68,775,7691,100,775,7692,68,803,7693,100,803,7694,68,817,7695,100,817,7696,68,807,7697,100,807,7698,68,813,7699,100,813,7700,274,768,7701,275,768,7702,274,769,7703,275,769,7704,69,813,7705,101,813,7706,69,816,7707,101,816,7708,552,774,7709,553,774,7710,70,775,7711,102,775,7712,71,772,7713,103,772,7714,72,775,7715,104,775,7716,72,803,7717,104,803,7718,72,776,7719,104,776,7720,72,807,7721,104,807,7722,72,814,7723,104,814,7724,73,816,7725,105,816,7726,207,769,7727,239,769,7728,75,769,7729,107,769,7730,75,803,7731,107,803,7732,75,817,7733,107,817,7734,76,803,7735,108,803,7736,7734,772,7737,7735,772,7738,76,817,7739,108,817,7740,76,813,7741,108,813,7742,77,769,7743,109,769,7744,77,775,7745,109,775,7746,77,803,7747,109,803,7748,78,775,7749,110,775,7750,78,803,7751,110,803,7752,78,817,7753,110,817,7754,78,813,7755,110,813,7756,213,769,7757,245,769,7758,213,776,7759,245,776,7760,332,768,7761,333,768,7762,332,769,7763,333,769,7764,80,769,7765,112,769,7766,80,775,7767,112,775,7768,82,775,7769,114,775,7770,82,803,7771,114,803,7772,7770,772,7773,7771,772,7774,82,817,7775,114,817,7776,83,775,7777,115,775,7778,83,803,7779,115,803,7780,346,775,7781,347,775,7782,352,775,7783,353,775,7784,7778,775,7785,7779,775,7786,84,775,7787,116,775,7788,84,803,7789,116,803,7790,84,817,7791,116,817,7792,84,813,7793,116,813,7794,85,804,7795,117,804,7796,85,816,7797,117,816,7798,85,813,7799,117,813,7800,360,769,7801,361,769,7802,362,776,7803,363,776,7804,86,771,7805,118,771,7806,86,803,7807,118,803,7808,87,768,7809,119,768,7810,87,769,7811,119,769,7812,87,776,7813,119,776,7814,87,775,7815,119,775,7816,87,803,7817,119,803,7818,88,775,7819,120,775,7820,88,776,7821,120,776,7822,89,775,7823,121,775,7824,90,770,7825,122,770,7826,90,803,7827,122,803,7828,90,817,7829,122,817,7830,104,817,7831,116,776,7832,119,778,7833,121,778,7835,383,775,7840,65,803,7841,97,803,7842,65,777,7843,97,777,7844,194,769,7845,226,769,7846,194,768,7847,226,768,7848,194,777,7849,226,777,7850,194,771,7851,226,771,7852,7840,770,7853,7841,770,7854,258,769,7855,259,769,7856,258,768,7857,259,768,7858,258,777,7859,259,777,7860,258,771,7861,259,771,7862,7840,774,7863,7841,774,7864,69,803,7865,101,803,7866,69,777,7867,101,777,7868,69,771,7869,101,771,7870,202,769,7871,234,769,7872,202,768,7873,234,768,7874,202,777,7875,234,777,7876,202,771,7877,234,771,7878,7864,770,7879,7865,770,7880,73,777,7881,105,777,7882,73,803,7883,105,803,7884,79,803,7885,111,803,7886,79,777,7887,111,777,7888,212,769,7889,244,769,7890,212,768,7891,244,768,7892,212,777,7893,244,777,7894,212,771,7895,244,771,7896,7884,770,7897,7885,770,7898,416,769,7899,417,769,7900,416,768,7901,417,768,7902,416,777,7903,417,777,7904,416,771,7905,417,771,7906,416,803,7907,417,803,7908,85,803,7909,117,803,7910,85,777,7911,117,777,7912,431,769,7913,432,769,7914,431,768,7915,432,768,7916,431,777,7917,432,777,7918,431,771,7919,432,771,7920,431,803,7921,432,803,7922,89,768,7923,121,768,7924,89,803,7925,121,803,7926,89,777,7927,121,777,7928,89,771,7929,121,771,7936,945,787,7937,945,788,7938,7936,768,7939,7937,768,7940,7936,769,7941,7937,769,7942,7936,834,7943,7937,834,7944,913,787,7945,913,788,7946,7944,768,7947,7945,768,7948,7944,769,7949,7945,769,7950,7944,834,7951,7945,834,7952,949,787,7953,949,788,7954,7952,768,7955,7953,768,7956,7952,769,7957,7953,769,7960,917,787,7961,917,788,7962,7960,768,7963,7961,768,7964,7960,769,7965,7961,769,7968,951,787,7969,951,788,7970,7968,768,7971,7969,768,7972,7968,769,7973,7969,769,7974,7968,834,7975,7969,834,7976,919,787,7977,919,788,7978,7976,768,7979,7977,768,7980,7976,769,7981,7977,769,7982,7976,834,7983,7977,834,7984,953,787,7985,953,788,7986,7984,768,7987,7985,768,7988,7984,769,7989,7985,769,7990,7984,834,7991,7985,834,7992,921,787,7993,921,788,7994,7992,768,7995,7993,768,7996,7992,769,7997,7993,769,7998,7992,834,7999,7993,834,8000,959,787,8001,959,788,8002,8000,768,8003,8001,768,8004,8000,769,8005,8001,769,8008,927,787,8009,927,788,8010,8008,768,8011,8009,768,8012,8008,769,8013,8009,769,8016,965,787,8017,965,788,8018,8016,768,8019,8017,768,8020,8016,769,8021,8017,769,8022,8016,834,8023,8017,834,8025,933,788,8027,8025,768,8029,8025,769,8031,8025,834,8032,969,787,8033,969,788,8034,8032,768,8035,8033,768,8036,8032,769,8037,8033,769,8038,8032,834,8039,8033,834,8040,937,787,8041,937,788,8042,8040,768,8043,8041,768,8044,8040,769,8045,8041,769,8046,8040,834,8047,8041,834,8048,945,768,8049,940,0,8050,949,768,8051,941,0,8052,951,768,8053,942,0,8054,953,768,8055,943,0,8056,959,768,8057,972,0,8058,965,768,8059,973,0,8060,969,768,8061,974,0,8064,7936,837,8065,7937,837,8066,7938,837,8067,7939,837,8068,7940,837,8069,7941,837,8070,7942,837,8071,7943,837,8072,7944,837,8073,7945,837,8074,7946,837,8075,7947,837,8076,7948,837,8077,7949,837,8078,7950,837,8079,7951,837,8080,7968,837,8081,7969,837,8082,7970,837,8083,7971,837,8084,7972,837,8085,7973,837,8086,7974,837,8087,7975,837,8088,7976,837,8089,7977,837,8090,7978,837,8091,7979,837,8092,7980,837,8093,7981,837,8094,7982,837,8095,7983,837,8096,8032,837,8097,8033,837,8098,8034,837,8099,8035,837,8100,8036,837,8101,8037,837,8102,8038,837,8103,8039,837,8104,8040,837,8105,8041,837,8106,8042,837,8107,8043,837,8108,8044,837,8109,8045,837,8110,8046,837,8111,8047,837,8112,945,774,8113,945,772,8114,8048,837,8115,945,837,8116,940,837,8118,945,834,8119,8118,837,8120,913,774,8121,913,772,8122,913,768,8123,902,0,8124,913,837,8126,953,0,8129,168,834,8130,8052,837,8131,951,837,8132,942,837,8134,951,834,8135,8134,837,8136,917,768,8137,904,0,8138,919,768,8139,905,0,8140,919,837,8141,8127,768,8142,8127,769,8143,8127,834,8144,953,774,8145,953,772,8146,970,768,8147,912,0,8150,953,834,8151,970,834,8152,921,774,8153,921,772,8154,921,768,8155,906,0,8157,8190,768,8158,8190,769,8159,8190,834,8160,965,774,8161,965,772,8162,971,768,8163,944,0,8164,961,787,8165,961,788,8166,965,834,8167,971,834,8168,933,774,8169,933,772,8170,933,768,8171,910,0,8172,929,788,8173,168,768,8174,901,0,8175,96,0,8178,8060,837,8179,969,837,8180,974,837,8182,969,834,8183,8182,837,8184,927,768,8185,908,0,8186,937,768,8187,911,0,8188,937,837,8189,180,0,8192,8194,0,8193,8195,0,8486,937,0,8490,75,0,8491,197,0,8602,8592,824,8603,8594,824,8622,8596,824,8653,8656,824,8654,8660,824,8655,8658,824,8708,8707,824,8713,8712,824,8716,8715,824,8740,8739,824,8742,8741,824,8769,8764,824,8772,8771,824,8775,8773,824,8777,8776,824,8800,61,824,8802,8801,824,8813,8781,824,8814,60,824,8815,62,824,8816,8804,824,8817,8805,824,8820,8818,824,8821,8819,824,8824,8822,824,8825,8823,824,8832,8826,824,8833,8827,824,8836,8834,824,8837,8835,824,8840,8838,824,8841,8839,824,8876,8866,824,8877,8872,824,8878,8873,824,8879,8875,824,8928,8828,824,8929,8829,824,8930,8849,824,8931,8850,824,8938,8882,824,8939,8883,824,8940,8884,824,8941,8885,824,9001,12296,0,9002,12297,0,10972,10973,824,12364,12363,12441,12366,12365,12441,12368,12367,12441,12370,12369,12441,12372,12371,12441,12374,12373,12441,12376,12375,12441,12378,12377,12441,12380,12379,12441,12382,12381,12441,12384,12383,12441,12386,12385,12441,12389,12388,12441,12391,12390,12441,12393,12392,12441,12400,12399,12441,12401,12399,12442,12403,12402,12441,12404,12402,12442,12406,12405,12441,12407,12405,12442,12409,12408,12441,12410,12408,12442,12412,12411,12441,12413,12411,12442,12436,12358,12441,12446,12445,12441,12460,12459,12441,12462,12461,12441,12464,12463,12441,12466,12465,12441,12468,12467,12441,12470,12469,12441,12472,12471,12441,12474,12473,12441,12476,12475,12441,12478,12477,12441,12480,12479,12441,12482,12481,12441,12485,12484,12441,12487,12486,12441,12489,12488,12441,12496,12495,12441,12497,12495,12442,12499,12498,12441,12500,12498,12442,12502,12501,12441,12503,12501,12442,12505,12504,12441,12506,12504,12442,12508,12507,12441,12509,12507,12442,12532,12454,12441,12535,12527,12441,12536,12528,12441,12537,12529,12441,12538,12530,12441,12542,12541,12441,63744,35912,0,63745,26356,0,63746,36554,0,63747,36040,0,63748,28369,0,63749,20018,0,63750,21477,0,63751,40860,0,63752,40860,0,63753,22865,0,63754,37329,0,63755,21895,0,63756,22856,0,63757,25078,0,63758,30313,0,63759,32645,0,63760,34367,0,63761,34746,0,63762,35064,0,63763,37007,0,63764,27138,0,63765,27931,0,63766,28889,0,63767,29662,0,63768,33853,0,63769,37226,0,63770,39409,0,63771,20098,0,63772,21365,0,63773,27396,0,63774,29211,0,63775,34349,0,63776,40478,0,63777,23888,0,63778,28651,0,63779,34253,0,63780,35172,0,63781,25289,0,63782,33240,0,63783,34847,0,63784,24266,0,63785,26391,0,63786,28010,0,63787,29436,0,63788,37070,0,63789,20358,0,63790,20919,0,63791,21214,0,63792,25796,0,63793,27347,0,63794,29200,0,63795,30439,0,63796,32769,0,63797,34310,0,63798,34396,0,63799,36335,0,63800,38706,0,63801,39791,0,63802,40442,0,63803,30860,0,63804,31103,0,63805,32160,0,63806,33737,0,63807,37636,0,63808,40575,0,63809,35542,0,63810,22751,0,63811,24324,0,63812,31840,0,63813,32894,0,63814,29282,0,63815,30922,0,63816,36034,0,63817,38647,0,63818,22744,0,63819,23650,0,63820,27155,0,63821,28122,0,63822,28431,0,63823,32047,0,63824,32311,0,63825,38475,0,63826,21202,0,63827,32907,0,63828,20956,0,63829,20940,0,63830,31260,0,63831,32190,0,63832,33777,0,63833,38517,0,63834,35712,0,63835,25295,0,63836,27138,0,63837,35582,0,63838,20025,0,63839,23527,0,63840,24594,0,63841,29575,0,63842,30064,0,63843,21271,0,63844,30971,0,63845,20415,0,63846,24489,0,63847,19981,0,63848,27852,0,63849,25976,0,63850,32034,0,63851,21443,0,63852,22622,0,63853,30465,0,63854,33865,0,63855,35498,0,63856,27578,0,63857,36784,0,63858,27784,0,63859,25342,0,63860,33509,0,63861,25504,0,63862,30053,0,63863,20142,0,63864,20841,0,63865,20937,0,63866,26753,0,63867,31975,0,63868,33391,0,63869,35538,0,63870,37327,0,63871,21237,0,63872,21570,0,63873,22899,0,63874,24300,0,63875,26053,0,63876,28670,0,63877,31018,0,63878,38317,0,63879,39530,0,63880,40599,0,63881,40654,0,63882,21147,0,63883,26310,0,63884,27511,0,63885,36706,0,63886,24180,0,63887,24976,0,63888,25088,0,63889,25754,0,63890,28451,0,63891,29001,0,63892,29833,0,63893,31178,0,63894,32244,0,63895,32879,0,63896,36646,0,63897,34030,0,63898,36899,0,63899,37706,0,63900,21015,0,63901,21155,0,63902,21693,0,63903,28872,0,63904,35010,0,63905,35498,0,63906,24265,0,63907,24565,0,63908,25467,0,63909,27566,0,63910,31806,0,63911,29557,0,63912,20196,0,63913,22265,0,63914,23527,0,63915,23994,0,63916,24604,0,63917,29618,0,63918,29801,0,63919,32666,0,63920,32838,0,63921,37428,0,63922,38646,0,63923,38728,0,63924,38936,0,63925,20363,0,63926,31150,0,63927,37300,0,63928,38584,0,63929,24801,0,63930,20102,0,63931,20698,0,63932,23534,0,63933,23615,0,63934,26009,0,63935,27138,0,63936,29134,0,63937,30274,0,63938,34044,0,63939,36988,0,63940,40845,0,63941,26248,0,63942,38446,0,63943,21129,0,63944,26491,0,63945,26611,0,63946,27969,0,63947,28316,0,63948,29705,0,63949,30041,0,63950,30827,0,63951,32016,0,63952,39006,0,63953,20845,0,63954,25134,0,63955,38520,0,63956,20523,0,63957,23833,0,63958,28138,0,63959,36650,0,63960,24459,0,63961,24900,0,63962,26647,0,63963,29575,0,63964,38534,0,63965,21033,0,63966,21519,0,63967,23653,0,63968,26131,0,63969,26446,0,63970,26792,0,63971,27877,0,63972,29702,0,63973,30178,0,63974,32633,0,63975,35023,0,63976,35041,0,63977,37324,0,63978,38626,0,63979,21311,0,63980,28346,0,63981,21533,0,63982,29136,0,63983,29848,0,63984,34298,0,63985,38563,0,63986,40023,0,63987,40607,0,63988,26519,0,63989,28107,0,63990,33256,0,63991,31435,0,63992,31520,0,63993,31890,0,63994,29376,0,63995,28825,0,63996,35672,0,63997,20160,0,63998,33590,0,63999,21050,0,64e3,20999,0,64001,24230,0,64002,25299,0,64003,31958,0,64004,23429,0,64005,27934,0,64006,26292,0,64007,36667,0,64008,34892,0,64009,38477,0,64010,35211,0,64011,24275,0,64012,20800,0,64013,21952,0,64016,22618,0,64018,26228,0,64021,20958,0,64022,29482,0,64023,30410,0,64024,31036,0,64025,31070,0,64026,31077,0,64027,31119,0,64028,38742,0,64029,31934,0,64030,32701,0,64032,34322,0,64034,35576,0,64037,36920,0,64038,37117,0,64042,39151,0,64043,39164,0,64044,39208,0,64045,40372,0,64046,37086,0,64047,38583,0,64048,20398,0,64049,20711,0,64050,20813,0,64051,21193,0,64052,21220,0,64053,21329,0,64054,21917,0,64055,22022,0,64056,22120,0,64057,22592,0,64058,22696,0,64059,23652,0,64060,23662,0,64061,24724,0,64062,24936,0,64063,24974,0,64064,25074,0,64065,25935,0,64066,26082,0,64067,26257,0,64068,26757,0,64069,28023,0,64070,28186,0,64071,28450,0,64072,29038,0,64073,29227,0,64074,29730,0,64075,30865,0,64076,31038,0,64077,31049,0,64078,31048,0,64079,31056,0,64080,31062,0,64081,31069,0,64082,31117,0,64083,31118,0,64084,31296,0,64085,31361,0,64086,31680,0,64087,32244,0,64088,32265,0,64089,32321,0,64090,32626,0,64091,32773,0,64092,33261,0,64093,33401,0,64094,33401,0,64095,33879,0,64096,35088,0,64097,35222,0,64098,35585,0,64099,35641,0,64100,36051,0,64101,36104,0,64102,36790,0,64103,36920,0,64104,38627,0,64105,38911,0,64106,38971,0,64107,24693,0,64108,148206,0,64109,33304,0,64112,20006,0,64113,20917,0,64114,20840,0,64115,20352,0,64116,20805,0,64117,20864,0,64118,21191,0,64119,21242,0,64120,21917,0,64121,21845,0,64122,21913,0,64123,21986,0,64124,22618,0,64125,22707,0,64126,22852,0,64127,22868,0,64128,23138,0,64129,23336,0,64130,24274,0,64131,24281,0,64132,24425,0,64133,24493,0,64134,24792,0,64135,24910,0,64136,24840,0,64137,24974,0,64138,24928,0,64139,25074,0,64140,25140,0,64141,25540,0,64142,25628,0,64143,25682,0,64144,25942,0,64145,26228,0,64146,26391,0,64147,26395,0,64148,26454,0,64149,27513,0,64150,27578,0,64151,27969,0,64152,28379,0,64153,28363,0,64154,28450,0,64155,28702,0,64156,29038,0,64157,30631,0,64158,29237,0,64159,29359,0,64160,29482,0,64161,29809,0,64162,29958,0,64163,30011,0,64164,30237,0,64165,30239,0,64166,30410,0,64167,30427,0,64168,30452,0,64169,30538,0,64170,30528,0,64171,30924,0,64172,31409,0,64173,31680,0,64174,31867,0,64175,32091,0,64176,32244,0,64177,32574,0,64178,32773,0,64179,33618,0,64180,33775,0,64181,34681,0,64182,35137,0,64183,35206,0,64184,35222,0,64185,35519,0,64186,35576,0,64187,35531,0,64188,35585,0,64189,35582,0,64190,35565,0,64191,35641,0,64192,35722,0,64193,36104,0,64194,36664,0,64195,36978,0,64196,37273,0,64197,37494,0,64198,38524,0,64199,38627,0,64200,38742,0,64201,38875,0,64202,38911,0,64203,38923,0,64204,38971,0,64205,39698,0,64206,40860,0,64207,141386,0,64208,141380,0,64209,144341,0,64210,15261,0,64211,16408,0,64212,16441,0,64213,152137,0,64214,154832,0,64215,163539,0,64216,40771,0,64217,40846,0,64285,1497,1460,64287,1522,1463,64298,1513,1473,64299,1513,1474,64300,64329,1473,64301,64329,1474,64302,1488,1463,64303,1488,1464,64304,1488,1468,64305,1489,1468,64306,1490,1468,64307,1491,1468,64308,1492,1468,64309,1493,1468,64310,1494,1468,64312,1496,1468,64313,1497,1468,64314,1498,1468,64315,1499,1468,64316,1500,1468,64318,1502,1468,64320,1504,1468,64321,1505,1468,64323,1507,1468,64324,1508,1468,64326,1510,1468,64327,1511,1468,64328,1512,1468,64329,1513,1468,64330,1514,1468,64331,1493,1465,64332,1489,1471,64333,1499,1471,64334,1508,1471,67017,67026,775,67044,67034,775,69786,69785,69818,69788,69787,69818,69803,69797,69818,69934,69937,69927,69935,69938,69927,70475,70471,70462,70476,70471,70487,70531,70530,70601,70533,70532,70587,70542,70539,70594,70545,70544,70601,70597,70594,70594,70599,70594,70584,70600,70594,70601,70843,70841,70842,70844,70841,70832,70846,70841,70845,71098,71096,71087,71099,71097,71087,71992,71989,71984,90401,90398,90398,90402,90398,90409,90403,90398,90399,90404,90409,90399,90405,90398,90400,90406,90401,90399,90407,90402,90399,90408,90401,90400,93544,93543,93543,93545,93539,93543,93546,93545,93543,119134,119127,119141,119135,119128,119141,119136,119135,119150,119137,119135,119151,119138,119135,119152,119139,119135,119153,119140,119135,119154,119227,119225,119141,119228,119226,119141,119229,119227,119150,119230,119228,119150,119231,119227,119151,119232,119228,119151,194560,20029,0,194561,20024,0,194562,20033,0,194563,131362,0,194564,20320,0,194565,20398,0,194566,20411,0,194567,20482,0,194568,20602,0,194569,20633,0,194570,20711,0,194571,20687,0,194572,13470,0,194573,132666,0,194574,20813,0,194575,20820,0,194576,20836,0,194577,20855,0,194578,132380,0,194579,13497,0,194580,20839,0,194581,20877,0,194582,132427,0,194583,20887,0,194584,20900,0,194585,20172,0,194586,20908,0,194587,20917,0,194588,168415,0,194589,20981,0,194590,20995,0,194591,13535,0,194592,21051,0,194593,21062,0,194594,21106,0,194595,21111,0,194596,13589,0,194597,21191,0,194598,21193,0,194599,21220,0,194600,21242,0,194601,21253,0,194602,21254,0,194603,21271,0,194604,21321,0,194605,21329,0,194606,21338,0,194607,21363,0,194608,21373,0,194609,21375,0,194610,21375,0,194611,21375,0,194612,133676,0,194613,28784,0,194614,21450,0,194615,21471,0,194616,133987,0,194617,21483,0,194618,21489,0,194619,21510,0,194620,21662,0,194621,21560,0,194622,21576,0,194623,21608,0,194624,21666,0,194625,21750,0,194626,21776,0,194627,21843,0,194628,21859,0,194629,21892,0,194630,21892,0,194631,21913,0,194632,21931,0,194633,21939,0,194634,21954,0,194635,22294,0,194636,22022,0,194637,22295,0,194638,22097,0,194639,22132,0,194640,20999,0,194641,22766,0,194642,22478,0,194643,22516,0,194644,22541,0,194645,22411,0,194646,22578,0,194647,22577,0,194648,22700,0,194649,136420,0,194650,22770,0,194651,22775,0,194652,22790,0,194653,22810,0,194654,22818,0,194655,22882,0,194656,136872,0,194657,136938,0,194658,23020,0,194659,23067,0,194660,23079,0,194661,23e3,0,194662,23142,0,194663,14062,0,194664,14076,0,194665,23304,0,194666,23358,0,194667,23358,0,194668,137672,0,194669,23491,0,194670,23512,0,194671,23527,0,194672,23539,0,194673,138008,0,194674,23551,0,194675,23558,0,194676,24403,0,194677,23586,0,194678,14209,0,194679,23648,0,194680,23662,0,194681,23744,0,194682,23693,0,194683,138724,0,194684,23875,0,194685,138726,0,194686,23918,0,194687,23915,0,194688,23932,0,194689,24033,0,194690,24034,0,194691,14383,0,194692,24061,0,194693,24104,0,194694,24125,0,194695,24169,0,194696,14434,0,194697,139651,0,194698,14460,0,194699,24240,0,194700,24243,0,194701,24246,0,194702,24266,0,194703,172946,0,194704,24318,0,194705,140081,0,194706,140081,0,194707,33281,0,194708,24354,0,194709,24354,0,194710,14535,0,194711,144056,0,194712,156122,0,194713,24418,0,194714,24427,0,194715,14563,0,194716,24474,0,194717,24525,0,194718,24535,0,194719,24569,0,194720,24705,0,194721,14650,0,194722,14620,0,194723,24724,0,194724,141012,0,194725,24775,0,194726,24904,0,194727,24908,0,194728,24910,0,194729,24908,0,194730,24954,0,194731,24974,0,194732,25010,0,194733,24996,0,194734,25007,0,194735,25054,0,194736,25074,0,194737,25078,0,194738,25104,0,194739,25115,0,194740,25181,0,194741,25265,0,194742,25300,0,194743,25424,0,194744,142092,0,194745,25405,0,194746,25340,0,194747,25448,0,194748,25475,0,194749,25572,0,194750,142321,0,194751,25634,0,194752,25541,0,194753,25513,0,194754,14894,0,194755,25705,0,194756,25726,0,194757,25757,0,194758,25719,0,194759,14956,0,194760,25935,0,194761,25964,0,194762,143370,0,194763,26083,0,194764,26360,0,194765,26185,0,194766,15129,0,194767,26257,0,194768,15112,0,194769,15076,0,194770,20882,0,194771,20885,0,194772,26368,0,194773,26268,0,194774,32941,0,194775,17369,0,194776,26391,0,194777,26395,0,194778,26401,0,194779,26462,0,194780,26451,0,194781,144323,0,194782,15177,0,194783,26618,0,194784,26501,0,194785,26706,0,194786,26757,0,194787,144493,0,194788,26766,0,194789,26655,0,194790,26900,0,194791,15261,0,194792,26946,0,194793,27043,0,194794,27114,0,194795,27304,0,194796,145059,0,194797,27355,0,194798,15384,0,194799,27425,0,194800,145575,0,194801,27476,0,194802,15438,0,194803,27506,0,194804,27551,0,194805,27578,0,194806,27579,0,194807,146061,0,194808,138507,0,194809,146170,0,194810,27726,0,194811,146620,0,194812,27839,0,194813,27853,0,194814,27751,0,194815,27926,0,194816,27966,0,194817,28023,0,194818,27969,0,194819,28009,0,194820,28024,0,194821,28037,0,194822,146718,0,194823,27956,0,194824,28207,0,194825,28270,0,194826,15667,0,194827,28363,0,194828,28359,0,194829,147153,0,194830,28153,0,194831,28526,0,194832,147294,0,194833,147342,0,194834,28614,0,194835,28729,0,194836,28702,0,194837,28699,0,194838,15766,0,194839,28746,0,194840,28797,0,194841,28791,0,194842,28845,0,194843,132389,0,194844,28997,0,194845,148067,0,194846,29084,0,194847,148395,0,194848,29224,0,194849,29237,0,194850,29264,0,194851,149e3,0,194852,29312,0,194853,29333,0,194854,149301,0,194855,149524,0,194856,29562,0,194857,29579,0,194858,16044,0,194859,29605,0,194860,16056,0,194861,16056,0,194862,29767,0,194863,29788,0,194864,29809,0,194865,29829,0,194866,29898,0,194867,16155,0,194868,29988,0,194869,150582,0,194870,30014,0,194871,150674,0,194872,30064,0,194873,139679,0,194874,30224,0,194875,151457,0,194876,151480,0,194877,151620,0,194878,16380,0,194879,16392,0,194880,30452,0,194881,151795,0,194882,151794,0,194883,151833,0,194884,151859,0,194885,30494,0,194886,30495,0,194887,30495,0,194888,30538,0,194889,16441,0,194890,30603,0,194891,16454,0,194892,16534,0,194893,152605,0,194894,30798,0,194895,30860,0,194896,30924,0,194897,16611,0,194898,153126,0,194899,31062,0,194900,153242,0,194901,153285,0,194902,31119,0,194903,31211,0,194904,16687,0,194905,31296,0,194906,31306,0,194907,31311,0,194908,153980,0,194909,154279,0,194910,154279,0,194911,31470,0,194912,16898,0,194913,154539,0,194914,31686,0,194915,31689,0,194916,16935,0,194917,154752,0,194918,31954,0,194919,17056,0,194920,31976,0,194921,31971,0,194922,32e3,0,194923,155526,0,194924,32099,0,194925,17153,0,194926,32199,0,194927,32258,0,194928,32325,0,194929,17204,0,194930,156200,0,194931,156231,0,194932,17241,0,194933,156377,0,194934,32634,0,194935,156478,0,194936,32661,0,194937,32762,0,194938,32773,0,194939,156890,0,194940,156963,0,194941,32864,0,194942,157096,0,194943,32880,0,194944,144223,0,194945,17365,0,194946,32946,0,194947,33027,0,194948,17419,0,194949,33086,0,194950,23221,0,194951,157607,0,194952,157621,0,194953,144275,0,194954,144284,0,194955,33281,0,194956,33284,0,194957,36766,0,194958,17515,0,194959,33425,0,194960,33419,0,194961,33437,0,194962,21171,0,194963,33457,0,194964,33459,0,194965,33469,0,194966,33510,0,194967,158524,0,194968,33509,0,194969,33565,0,194970,33635,0,194971,33709,0,194972,33571,0,194973,33725,0,194974,33767,0,194975,33879,0,194976,33619,0,194977,33738,0,194978,33740,0,194979,33756,0,194980,158774,0,194981,159083,0,194982,158933,0,194983,17707,0,194984,34033,0,194985,34035,0,194986,34070,0,194987,160714,0,194988,34148,0,194989,159532,0,194990,17757,0,194991,17761,0,194992,159665,0,194993,159954,0,194994,17771,0,194995,34384,0,194996,34396,0,194997,34407,0,194998,34409,0,194999,34473,0,195e3,34440,0,195001,34574,0,195002,34530,0,195003,34681,0,195004,34600,0,195005,34667,0,195006,34694,0,195007,17879,0,195008,34785,0,195009,34817,0,195010,17913,0,195011,34912,0,195012,34915,0,195013,161383,0,195014,35031,0,195015,35038,0,195016,17973,0,195017,35066,0,195018,13499,0,195019,161966,0,195020,162150,0,195021,18110,0,195022,18119,0,195023,35488,0,195024,35565,0,195025,35722,0,195026,35925,0,195027,162984,0,195028,36011,0,195029,36033,0,195030,36123,0,195031,36215,0,195032,163631,0,195033,133124,0,195034,36299,0,195035,36284,0,195036,36336,0,195037,133342,0,195038,36564,0,195039,36664,0,195040,165330,0,195041,165357,0,195042,37012,0,195043,37105,0,195044,37137,0,195045,165678,0,195046,37147,0,195047,37432,0,195048,37591,0,195049,37592,0,195050,37500,0,195051,37881,0,195052,37909,0,195053,166906,0,195054,38283,0,195055,18837,0,195056,38327,0,195057,167287,0,195058,18918,0,195059,38595,0,195060,23986,0,195061,38691,0,195062,168261,0,195063,168474,0,195064,19054,0,195065,19062,0,195066,38880,0,195067,168970,0,195068,19122,0,195069,169110,0,195070,38923,0,195071,38923,0,195072,38953,0,195073,169398,0,195074,39138,0,195075,19251,0,195076,39209,0,195077,39335,0,195078,39362,0,195079,39422,0,195080,19406,0,195081,170800,0,195082,39698,0,195083,4e4,0,195084,40189,0,195085,19662,0,195086,19693,0,195087,40295,0,195088,172238,0,195089,19704,0,195090,172293,0,195091,172558,0,195092,172689,0,195093,40635,0,195094,19798,0,195095,40697,0,195096,40702,0,195097,40709,0,195098,40719,0,195099,40726,0,195100,40763,0,195101,173568,0],t.X)
B.aG=s(["isol","fina","fin2","fin3","medi","med2","init"],t.s)
B.b3=new A.ca(1,"children")
B.b4=new A.ca(2,"leaves")
B.bV=s([B.aA,B.b3,B.b4],A.an("p<ca>"))
B.D=s(["Zzzz","Zyyy","Zinh","Latn","Grek","Cyrl","Armn","Hebr","Arab","Syrc","Thaa","Deva","Beng","Guru","Gujr","Orya","Taml","Telu","Knda","Mlym","Sinh","Thai","Laoo","Tibt","Mymr","Geor","Hang","Ethi","Cher","Cans","Ogam","Runr","Khmr","Mong","Hira","Kana","Bopo","Hani","Yiii","Ital","Goth","Dsrt","Tglg","Hano","Buhd","Tagb","Limb","Tale","Linb","Ugar","Shaw","Osma","Cprt","Brai","Bugi","Copt","Talu","Glag","Tfng","Sylo","Xpeo","Khar","Bali","Xsux","Phnx","Phag","Nkoo","Sund","Lepc","Olck","Vaii","Saur","Kali","Rjng","Lyci","Cari","Lydi","Cham","Lana","Tavt","Avst","Egyp","Samr","Lisu","Bamu","Java","Mtei","Armi","Sarb","Prti","Phli","Orkh","Kthi","Batk","Brah","Mand","Cakm","Merc","Mero","Plrd","Shrd","Sora","Takr","Aghb","Bass","Dupl","Elba","Gran","Hmng","Khoj","Lina","Mahj","Mani","Mend","Modi","Mroo","Narb","Nbat","Palm","Pauc","Perm","Phlp","Sidd","Sind","Tirh","Wara","Ahom","Hluw","Hatr","Mult","Hung","Sgnw","Adlm","Bhks","Marc","Newa","Osge","Tang","Gonm","Nshu","Soyo","Zanb","Dogr","Gong","Maka","Medf","Rohg","Sogd","Sogo","Elym","Nand","Hmnp","Wcho","Chrs","Diak","Kits","Yezi","Cpmn","Ougr","Tnsa","Toto","Vith","Kawi","Nagm","Gara","Gukh","Krai","Onao","Sunu","Todr","Tutg","Sidt","Tayo","Tols","Berf"],t.s)
B.dr=new A.e(1536,1540)
B.ds=new A.e(1542,1547)
B.dt=new A.e(1549,1562)
B.du=new A.e(1564,1566)
B.dv=new A.e(1568,1599)
B.dw=new A.e(1601,1610)
B.dx=new A.e(1622,1647)
B.dy=new A.e(1649,1756)
B.dz=new A.e(1758,1805)
B.dA=new A.e(1807,1866)
B.dB=new A.e(1869,1919)
B.dC=new A.e(1984,2042)
B.dF=new A.e(2045,2047)
B.dG=new A.e(2112,2139)
B.dH=new A.e(2142,2142)
B.dI=new A.e(2144,2154)
B.dJ=new A.e(2160,2193)
B.dK=new A.e(2199,2273)
B.dL=new A.e(2275,2303)
B.dQ=new A.e(6144,6145)
B.dR=new A.e(6148,6148)
B.dS=new A.e(6150,6169)
B.dT=new A.e(6176,6264)
B.dU=new A.e(6272,6314)
B.dP=new A.e(43072,43127)
B.dV=new A.e(64336,64829)
B.dW=new A.e(64832,64975)
B.dY=new A.e(65008,65023)
B.dZ=new A.e(65136,65140)
B.e_=new A.e(65142,65276)
B.e0=new A.e(68288,68326)
B.e1=new A.e(68331,68342)
B.e2=new A.e(68480,68497)
B.e3=new A.e(68505,68508)
B.e4=new A.e(68521,68527)
B.e5=new A.e(68864,68903)
B.e6=new A.e(68912,68921)
B.e7=new A.e(69216,69246)
B.e8=new A.e(69314,69319)
B.e9=new A.e(69328,69336)
B.ea=new A.e(69370,69375)
B.eb=new A.e(69424,69465)
B.ec=new A.e(69488,69513)
B.ed=new A.e(69552,69579)
B.ee=new A.e(71264,71276)
B.cJ=new A.e(113664,113770)
B.cK=new A.e(113776,113788)
B.cL=new A.e(113792,113800)
B.cM=new A.e(113808,113817)
B.cN=new A.e(113820,113823)
B.cP=new A.e(125184,125259)
B.cQ=new A.e(125264,125273)
B.cR=new A.e(125278,125279)
B.cS=new A.e(126464,126467)
B.cT=new A.e(126469,126495)
B.cU=new A.e(126497,126498)
B.cV=new A.e(126500,126500)
B.cW=new A.e(126503,126503)
B.cX=new A.e(126505,126514)
B.cY=new A.e(126516,126519)
B.cZ=new A.e(126521,126521)
B.d_=new A.e(126523,126523)
B.d0=new A.e(126530,126530)
B.d1=new A.e(126535,126535)
B.d2=new A.e(126537,126537)
B.d3=new A.e(126539,126539)
B.d4=new A.e(126541,126543)
B.d5=new A.e(126545,126546)
B.d6=new A.e(126548,126548)
B.d7=new A.e(126551,126551)
B.d8=new A.e(126553,126553)
B.d9=new A.e(126555,126555)
B.da=new A.e(126557,126557)
B.db=new A.e(126559,126559)
B.dc=new A.e(126561,126562)
B.dd=new A.e(126564,126564)
B.de=new A.e(126567,126570)
B.df=new A.e(126572,126578)
B.dg=new A.e(126580,126583)
B.dh=new A.e(126585,126588)
B.di=new A.e(126590,126590)
B.dj=new A.e(126592,126601)
B.dk=new A.e(126603,126619)
B.dl=new A.e(126625,126627)
B.dm=new A.e(126629,126633)
B.dn=new A.e(126635,126651)
B.dp=new A.e(126704,126705)
B.aH=s([B.dr,B.ds,B.dt,B.du,B.dv,B.dw,B.dx,B.dy,B.dz,B.dA,B.dB,B.dC,B.dF,B.dG,B.dH,B.dI,B.dJ,B.dK,B.dL,B.dQ,B.dR,B.dS,B.dT,B.dU,B.dP,B.dV,B.dW,B.dY,B.dZ,B.e_,B.e0,B.e1,B.e2,B.e3,B.e4,B.e5,B.e6,B.e7,B.e8,B.e9,B.ea,B.eb,B.ec,B.ed,B.ee,B.cJ,B.cK,B.cL,B.cM,B.cN,B.cP,B.cQ,B.cR,B.cS,B.cT,B.cU,B.cV,B.cW,B.cX,B.cY,B.cZ,B.d_,B.d0,B.d1,B.d2,B.d3,B.d4,B.d5,B.d6,B.d7,B.d8,B.d9,B.da,B.db,B.dc,B.dd,B.de,B.df,B.dg,B.dh,B.di,B.dj,B.dk,B.dl,B.dm,B.dn,B.dp],t.B)
B.bX=s(["text-color","text-opacity","text-halo-color","text-halo-width","text-halo-blur","icon-color","icon-opacity","icon-halo-color","icon-halo-width","icon-halo-blur"],t.s)
B.bY=s(["a","b","c"],t.s)
B.bZ=s(["bng2","beng"],t.s)
B.c_=s(["dev2","deva"],t.s)
B.a8=new A.b0(0,"round")
B.a9=new A.b0(1,"bevel")
B.Y=new A.b0(2,"miter")
B.at=new A.b0(3,"none")
B.aa=new A.b0(4,"fakeround")
B.au=new A.b0(5,"flipbevel")
B.ab=new A.b0(6,"butt")
B.av=new A.b0(7,"square")
B.aI=s([B.a8,B.a9,B.Y,B.at,B.aa,B.au,B.ab,B.av],A.an("p<b0>"))
B.aK=s([],t.dY)
B.aJ=s([],t.oM)
B.al=s([],t.hD)
B.c3=s([],t.i9)
B.a5=s([],t.r)
B.am=s([],t.w)
B.c4=s([],t.jn)
B.c6=s([],t.A)
B.an=s([],t.s)
B.c2=s([],t.aq)
B.aL=s([],t.c)
B.c5=s([],t.cF)
B.U=s([],t.X)
B.a3=s([],t.dM)
B.a4=s([],t.bU)
B.c0=s([],t.oZ)
B.cO=new A.e(11,1)
B.dq=new A.e(12,0)
B.c7=s([B.cO,B.dq],t.I)
B.c8=s(["gjr2","gujr"],t.s)
B.c9=s(["gur2","guru"],t.s)
B.ca=s(["kana"],t.s)
B.cb=s(["knd2","knda"],t.s)
B.ao=s(["linear"],t.s)
B.cc=s(["fill-outline-color","fill-opacity"],t.s)
B.cd=s(["mlm2","mlym"],t.s)
B.ce=s(["mym2","mymr"],t.s)
B.cf=s(["vai "],t.s)
B.f0=s([null,null,null,null],t.e5)
B.cg=s(["ory2","orya"],t.s)
B.V=s([40,41,0,41,40,1,91,93,0,93,91,1,123,125,0,125,123,1,3898,3899,0,3899,3898,1,3900,3901,0,3901,3900,1,5787,5788,0,5788,5787,1,8261,8262,0,8262,8261,1,8317,8318,0,8318,8317,1,8333,8334,0,8334,8333,1,8968,8969,0,8969,8968,1,8970,8971,0,8971,8970,1,9001,9002,0,9002,9001,1,10088,10089,0,10089,10088,1,10090,10091,0,10091,10090,1,10092,10093,0,10093,10092,1,10094,10095,0,10095,10094,1,10096,10097,0,10097,10096,1,10098,10099,0,10099,10098,1,10100,10101,0,10101,10100,1,10181,10182,0,10182,10181,1,10214,10215,0,10215,10214,1,10216,10217,0,10217,10216,1,10218,10219,0,10219,10218,1,10220,10221,0,10221,10220,1,10222,10223,0,10223,10222,1,10627,10628,0,10628,10627,1,10629,10630,0,10630,10629,1,10631,10632,0,10632,10631,1,10633,10634,0,10634,10633,1,10635,10636,0,10636,10635,1,10637,10640,0,10638,10639,1,10639,10638,0,10640,10637,1,10641,10642,0,10642,10641,1,10643,10644,0,10644,10643,1,10645,10646,0,10646,10645,1,10647,10648,0,10648,10647,1,10712,10713,0,10713,10712,1,10714,10715,0,10715,10714,1,10748,10749,0,10749,10748,1,11810,11811,0,11811,11810,1,11812,11813,0,11813,11812,1,11814,11815,0,11815,11814,1,11816,11817,0,11817,11816,1,11861,11862,0,11862,11861,1,11863,11864,0,11864,11863,1,11865,11866,0,11866,11865,1,11867,11868,0,11868,11867,1,12296,12297,0,12297,12296,1,12298,12299,0,12299,12298,1,12300,12301,0,12301,12300,1,12302,12303,0,12303,12302,1,12304,12305,0,12305,12304,1,12308,12309,0,12309,12308,1,12310,12311,0,12311,12310,1,12312,12313,0,12313,12312,1,12314,12315,0,12315,12314,1,65113,65114,0,65114,65113,1,65115,65116,0,65116,65115,1,65117,65118,0,65118,65117,1,65288,65289,0,65289,65288,1,65339,65341,0,65341,65339,1,65371,65373,0,65373,65371,1,65375,65376,0,65376,65375,1,65378,65379,0,65379,65378,1],t.X)
B.ch=s(["circle-color","circle-opacity","circle-radius","circle-stroke-color","circle-stroke-width","circle-stroke-opacity","circle-blur"],t.s)
B.ci=s([0,1,2,0,2,3],t.X)
B.cj=s(["yi  "],t.s)
B.H=new A.M(0,0,0)
B.w=new A.M(0,1,2)
B.a7=new A.M(0,1,1)
B.aq=new A.M(0,1,6)
B.bN=s([B.H,B.w,B.a7,B.w,B.a7,B.aq],t.Q)
B.eh=new A.M(0,3,5)
B.bK=s([B.H,B.w,B.a7,B.w,B.eh,B.aq],t.Q)
B.ev=new A.M(7,2,1)
B.ew=new A.M(7,2,3)
B.ex=new A.M(7,2,4)
B.ey=new A.M(7,2,6)
B.bO=s([B.H,B.w,B.ev,B.ew,B.ex,B.ey],t.Q)
B.en=new A.M(5,2,1)
B.eo=new A.M(5,2,3)
B.ep=new A.M(5,2,4)
B.eq=new A.M(5,2,6)
B.bQ=s([B.H,B.w,B.en,B.eo,B.ep,B.eq],t.Q)
B.er=new A.M(6,1,1)
B.es=new A.M(6,1,2)
B.eu=new A.M(6,3,5)
B.et=new A.M(6,1,6)
B.bW=s([B.H,B.w,B.er,B.es,B.eu,B.et],t.Q)
B.ej=new A.M(1,1,1)
B.ek=new A.M(1,1,2)
B.em=new A.M(1,3,5)
B.el=new A.M(1,1,6)
B.bL=s([B.H,B.w,B.ej,B.ek,B.em,B.el],t.Q)
B.ei=new A.M(0,4,5)
B.bI=s([B.H,B.w,B.a7,B.w,B.ei,B.aq],t.Q)
B.aM=s([B.bN,B.bK,B.bO,B.bQ,B.bW,B.bL,B.bI],A.an("p<k<+(c,c,c)>>"))
B.ck=s(["lao "],t.s)
B.W=s([0,8,9,9,9,11,10,10,10,11,11,11,12,12,12,13,13,10,14,27,9,28,30,10,31,31,11,32,32,12,33,34,13,35,37,5,38,42,13,43,43,4,44,44,7,45,45,4,46,47,7,48,57,3,58,58,7,59,64,13,91,96,13,123,126,13,127,132,9,133,133,10,134,159,9,160,160,7,161,161,13,162,165,5,166,169,13,171,172,13,173,173,9,174,175,13,176,177,5,178,179,3,180,180,13,182,184,13,185,185,3,187,191,13,215,215,13,247,247,13,697,698,13,706,719,13,722,735,13,741,749,13,751,767,13,768,879,8,884,885,13,894,894,13,900,901,13,903,903,13,1014,1014,13,1155,1161,8,1418,1418,13,1421,1422,13,1423,1423,5,1424,1424,1,1425,1469,8,1470,1470,1,1471,1471,8,1472,1472,1,1473,1474,8,1475,1475,1,1476,1477,8,1478,1478,1,1479,1479,8,1480,1535,1,1536,1541,6,1542,1543,13,1544,1544,2,1545,1546,5,1547,1547,2,1548,1548,7,1549,1549,2,1550,1551,13,1552,1562,8,1563,1610,2,1611,1631,8,1632,1641,6,1642,1642,5,1643,1644,6,1645,1647,2,1648,1648,8,1649,1749,2,1750,1756,8,1757,1757,6,1758,1758,13,1759,1764,8,1765,1766,2,1767,1768,8,1769,1769,13,1770,1773,8,1774,1775,2,1776,1785,3,1786,1808,2,1809,1809,8,1810,1839,2,1840,1866,8,1867,1957,2,1958,1968,8,1969,1983,2,1984,2026,1,2027,2035,8,2036,2037,1,2038,2041,13,2042,2044,1,2045,2045,8,2046,2069,1,2070,2073,8,2074,2074,1,2075,2083,8,2084,2084,1,2085,2087,8,2088,2088,1,2089,2093,8,2094,2136,1,2137,2139,8,2140,2143,1,2144,2191,2,2192,2193,6,2194,2198,2,2199,2207,8,2208,2249,2,2250,2273,8,2274,2274,6,2275,2306,8,2362,2362,8,2364,2364,8,2369,2376,8,2381,2381,8,2385,2391,8,2402,2403,8,2433,2433,8,2492,2492,8,2497,2500,8,2509,2509,8,2530,2531,8,2546,2547,5,2555,2555,5,2558,2558,8,2561,2562,8,2620,2620,8,2625,2626,8,2631,2632,8,2635,2637,8,2641,2641,8,2672,2673,8,2677,2677,8,2689,2690,8,2748,2748,8,2753,2757,8,2759,2760,8,2765,2765,8,2786,2787,8,2801,2801,5,2810,2815,8,2817,2817,8,2876,2876,8,2879,2879,8,2881,2884,8,2893,2893,8,2901,2902,8,2914,2915,8,2946,2946,8,3008,3008,8,3021,3021,8,3059,3064,13,3065,3065,5,3066,3066,13,3072,3072,8,3076,3076,8,3132,3132,8,3134,3136,8,3142,3144,8,3146,3149,8,3157,3158,8,3170,3171,8,3192,3198,13,3201,3201,8,3260,3260,8,3276,3277,8,3298,3299,8,3328,3329,8,3387,3388,8,3393,3396,8,3405,3405,8,3426,3427,8,3457,3457,8,3530,3530,8,3538,3540,8,3542,3542,8,3633,3633,8,3636,3642,8,3647,3647,5,3655,3662,8,3761,3761,8,3764,3772,8,3784,3790,8,3864,3865,8,3893,3893,8,3895,3895,8,3897,3897,8,3898,3901,13,3953,3966,8,3968,3972,8,3974,3975,8,3981,3991,8,3993,4028,8,4038,4038,8,4141,4144,8,4146,4151,8,4153,4154,8,4157,4158,8,4184,4185,8,4190,4192,8,4209,4212,8,4226,4226,8,4229,4230,8,4237,4237,8,4253,4253,8,4957,4959,8,5008,5017,13,5120,5120,13,5760,5760,12,5787,5788,13,5906,5908,8,5938,5939,8,5970,5971,8,6002,6003,8,6068,6069,8,6071,6077,8,6086,6086,8,6089,6099,8,6107,6107,5,6109,6109,8,6128,6137,13,6144,6154,13,6155,6157,8,6158,6158,9,6159,6159,8,6277,6278,8,6313,6313,8,6432,6434,8,6439,6440,8,6450,6450,8,6457,6459,8,6464,6464,13,6468,6469,13,6622,6655,13,6679,6680,8,6683,6683,8,6742,6742,8,6744,6750,8,6752,6752,8,6754,6754,8,6757,6764,8,6771,6780,8,6783,6783,8,6832,6877,8,6880,6891,8,6912,6915,8,6964,6964,8,6966,6970,8,6972,6972,8,6978,6978,8,7019,7027,8,7040,7041,8,7074,7077,8,7080,7081,8,7083,7085,8,7142,7142,8,7144,7145,8,7149,7149,8,7151,7153,8,7212,7219,8,7222,7223,8,7376,7378,8,7380,7392,8,7394,7400,8,7405,7405,8,7412,7412,8,7416,7417,8,7616,7679,8,8125,8125,13,8127,8129,13,8141,8143,13,8157,8159,13,8173,8175,13,8189,8190,13,8192,8202,12,8203,8205,9,8207,8207,1,8208,8231,13,8232,8232,12,8233,8233,10,8234,8234,14,8235,8235,16,8236,8236,18,8237,8237,15,8238,8238,17,8239,8239,7,8240,8244,5,8245,8259,13,8260,8260,7,8261,8286,13,8287,8287,12,8288,8293,9,8294,8294,19,8295,8295,20,8296,8296,21,8297,8297,22,8298,8303,9,8304,8304,3,8308,8313,3,8314,8315,4,8316,8318,13,8320,8329,3,8330,8331,4,8332,8334,13,8352,8399,5,8400,8432,8,8448,8449,13,8451,8454,13,8456,8457,13,8468,8468,13,8470,8472,13,8478,8483,13,8485,8485,13,8487,8487,13,8489,8489,13,8494,8494,5,8506,8507,13,8512,8516,13,8522,8525,13,8528,8543,13,8585,8587,13,8592,8721,13,8722,8722,4,8723,8723,5,8724,9013,13,9083,9108,13,9110,9257,13,9280,9290,13,9312,9351,13,9352,9371,3,9450,9899,13,9901,10239,13,10496,11123,13,11126,11263,13,11493,11498,13,11503,11505,8,11513,11519,13,11647,11647,8,11744,11775,8,11776,11869,13,11904,11929,13,11931,12019,13,12032,12245,13,12272,12287,13,12288,12288,12,12289,12292,13,12296,12320,13,12330,12333,8,12336,12336,13,12342,12343,13,12349,12351,13,12441,12442,8,12443,12444,13,12448,12448,13,12539,12539,13,12736,12773,13,12783,12783,13,12829,12830,13,12880,12895,13,12924,12926,13,12977,12991,13,13004,13007,13,13175,13178,13,13278,13279,13,13311,13311,13,19904,19967,13,42128,42182,13,42509,42511,13,42607,42610,8,42611,42611,13,42612,42621,8,42622,42623,13,42654,42655,8,42736,42737,8,42752,42785,13,42888,42888,13,43010,43010,8,43014,43014,8,43019,43019,8,43045,43046,8,43048,43051,13,43052,43052,8,43064,43065,5,43124,43127,13,43204,43205,8,43232,43249,8,43263,43263,8,43302,43309,8,43335,43345,8,43392,43394,8,43443,43443,8,43446,43449,8,43452,43453,8,43493,43493,8,43561,43566,8,43569,43570,8,43573,43574,8,43587,43587,8,43596,43596,8,43644,43644,8,43696,43696,8,43698,43700,8,43703,43704,8,43710,43711,8,43713,43713,8,43756,43757,8,43766,43766,8,43882,43883,13,44005,44005,8,44008,44008,8,44013,44013,8,64285,64285,1,64286,64286,8,64287,64296,1,64297,64297,4,64298,64335,1,64336,64450,2,64451,64466,13,64467,64829,2,64830,64847,13,64848,64911,2,64912,64913,13,64914,64967,2,64968,64975,13,64976,65007,9,65008,65020,2,65021,65023,13,65024,65039,8,65040,65049,13,65056,65071,8,65072,65103,13,65104,65104,7,65105,65105,13,65106,65106,7,65108,65108,13,65109,65109,7,65110,65118,13,65119,65119,5,65120,65121,13,65122,65123,4,65124,65126,13,65128,65128,13,65129,65130,5,65131,65131,13,65136,65278,2,65279,65279,9,65281,65282,13,65283,65285,5,65286,65290,13,65291,65291,4,65292,65292,7,65293,65293,4,65294,65295,7,65296,65305,3,65306,65306,7,65307,65312,13,65339,65344,13,65371,65381,13,65504,65505,5,65506,65508,13,65509,65510,5,65512,65518,13,65520,65528,9,65529,65533,13,65534,65535,9,65793,65793,13,65856,65932,13,65936,65948,13,65952,65952,13,66045,66045,8,66272,66272,8,66273,66299,3,66422,66426,8,67584,67870,1,67871,67871,13,67872,68096,1,68097,68099,8,68100,68100,1,68101,68102,8,68103,68107,1,68108,68111,8,68112,68151,1,68152,68154,8,68155,68158,1,68159,68159,8,68160,68324,1,68325,68326,8,68327,68408,1,68409,68415,13,68416,68863,1,68864,68899,2,68900,68903,8,68904,68911,2,68912,68921,6,68922,68927,2,68928,68937,6,68938,68968,1,68969,68973,8,68974,68974,13,68975,69215,1,69216,69246,6,69247,69290,1,69291,69292,8,69293,69311,1,69312,69327,2,69328,69336,13,69337,69369,2,69370,69375,8,69376,69423,1,69424,69445,2,69446,69456,8,69457,69487,2,69488,69505,1,69506,69509,8,69510,69631,1,69633,69633,8,69688,69702,8,69714,69733,13,69744,69744,8,69747,69748,8,69759,69761,8,69811,69814,8,69817,69818,8,69826,69826,8,69888,69890,8,69927,69931,8,69933,69940,8,70003,70003,8,70016,70017,8,70070,70078,8,70089,70092,8,70095,70095,8,70191,70193,8,70196,70196,8,70198,70199,8,70206,70206,8,70209,70209,8,70367,70367,8,70371,70378,8,70400,70401,8,70459,70460,8,70464,70464,8,70502,70508,8,70512,70516,8,70587,70592,8,70606,70606,8,70608,70608,8,70610,70610,8,70625,70626,8,70712,70719,8,70722,70724,8,70726,70726,8,70750,70750,8,70835,70840,8,70842,70842,8,70847,70848,8,70850,70851,8,71090,71093,8,71100,71101,8,71103,71104,8,71132,71133,8,71219,71226,8,71229,71229,8,71231,71232,8,71264,71276,13,71339,71339,8,71341,71341,8,71344,71349,8,71351,71351,8,71453,71453,8,71455,71455,8,71458,71461,8,71463,71467,8,71727,71735,8,71737,71738,8,71995,71996,8,71998,71998,8,72003,72003,8,72148,72151,8,72154,72155,8,72160,72160,8,72193,72198,8,72201,72202,8,72243,72248,8,72251,72254,8,72263,72263,8,72273,72278,8,72281,72283,8,72330,72342,8,72344,72345,8,72544,72544,8,72546,72548,8,72550,72550,8,72752,72758,8,72760,72765,8,72850,72871,8,72874,72880,8,72882,72883,8,72885,72886,8,73009,73014,8,73018,73018,8,73020,73021,8,73023,73029,8,73031,73031,8,73104,73105,8,73109,73109,8,73111,73111,8,73459,73460,8,73472,73473,8,73526,73530,8,73536,73536,8,73538,73538,8,73562,73562,8,73685,73692,13,73693,73696,5,73697,73713,13,78912,78912,8,78919,78933,8,90398,90409,8,90413,90415,8,92912,92916,8,92976,92982,8,94031,94031,8,94095,94098,8,94178,94178,13,94180,94180,8,113821,113822,8,113824,113827,9,117760,117973,13,118e3,118009,3,118010,118012,13,118016,118451,13,118458,118480,13,118496,118512,13,118528,118573,8,118576,118598,8,119143,119145,8,119155,119162,9,119163,119170,8,119173,119179,8,119210,119213,8,119273,119274,13,119296,119361,13,119362,119364,8,119365,119365,13,119552,119638,13,120513,120513,13,120539,120539,13,120571,120571,13,120597,120597,13,120629,120629,13,120655,120655,13,120687,120687,13,120713,120713,13,120745,120745,13,120771,120771,13,120782,120831,3,121344,121398,8,121403,121452,8,121461,121461,8,121476,121476,8,121499,121503,8,121505,121519,8,122880,122886,8,122888,122904,8,122907,122913,8,122915,122916,8,122918,122922,8,123023,123023,8,123184,123190,8,123566,123566,8,123628,123631,8,123647,123647,5,124140,124143,8,124398,124399,8,124643,124643,8,124646,124646,8,124654,124655,8,124661,124661,8,124928,125135,1,125136,125142,8,125143,125251,1,125252,125258,8,125259,126063,1,126064,126143,2,126144,126207,1,126208,126287,2,126288,126463,1,126464,126703,2,126704,126705,13,126706,126719,2,126720,126975,1,126976,127019,13,127024,127123,13,127136,127150,13,127153,127167,13,127169,127183,13,127185,127221,13,127232,127242,3,127243,127247,13,127279,127279,13,127338,127343,13,127405,127405,13,127584,127589,13,127744,128728,13,128732,128748,13,128752,128764,13,128768,128985,13,128992,129003,13,129008,129008,13,129024,129035,13,129040,129095,13,129104,129113,13,129120,129159,13,129168,129197,13,129200,129211,13,129216,129217,13,129232,129240,13,129280,129623,13,129632,129645,13,129648,129660,13,129664,129674,13,129678,129734,13,129736,129736,13,129741,129756,13,129759,129770,13,129775,129784,13,129792,129938,13,129940,130031,13,130032,130041,3,130042,130042,13,131070,131071,9,196606,196607,9,262142,262143,9,327678,327679,9,393214,393215,9,458750,458751,9,524286,524287,9,589822,589823,9,655358,655359,9,720894,720895,9,786430,786431,9,851966,851967,9,917502,917759,9,917760,917999,8,918e3,921599,9,983038,983039,9,1048574,1048575,9,1114110,1114111,9],t.X)
B.u=s([B.f,B.h,B.F,B.k,B.ac,B.Z,B.J,B.ad,B.ae,B.A,B.C,B.N,B.O,B.I,B.x,B.y,B.p,B.q,B.z,B.m,B.i,B.j,B.r],t.de)
B.cl=s(["tel2","telu"],t.s)
B.cm=s(["tml2","taml"],t.s)
B.aN=s([1569,65152,0,0,0,1570,65153,65154,0,0,1571,65155,65156,0,0,1572,65157,65158,0,0,1573,65159,65160,0,0,1574,65161,65162,65163,65164,1575,65165,65166,0,0,1576,65167,65168,65169,65170,1577,65171,65172,0,0,1578,65173,65174,65175,65176,1579,65177,65178,65179,65180,1580,65181,65182,65183,65184,1581,65185,65186,65187,65188,1582,65189,65190,65191,65192,1583,65193,65194,0,0,1584,65195,65196,0,0,1585,65197,65198,0,0,1586,65199,65200,0,0,1587,65201,65202,65203,65204,1588,65205,65206,65207,65208,1589,65209,65210,65211,65212,1590,65213,65214,65215,65216,1591,65217,65218,65219,65220,1592,65221,65222,65223,65224,1593,65225,65226,65227,65228,1594,65229,65230,65231,65232,1601,65233,65234,65235,65236,1602,65237,65238,65239,65240,1603,65241,65242,65243,65244,1604,65245,65246,65247,65248,1605,65249,65250,65251,65252,1606,65253,65254,65255,65256,1607,65257,65258,65259,65260,1608,65261,65262,0,0,1609,65263,65264,64488,64489,1610,65265,65266,65267,65268,1649,64336,64337,0,0,1655,64477,0,0,0,1657,64358,64359,64360,64361,1658,64350,64351,64352,64353,1659,64338,64339,64340,64341,1662,64342,64343,64344,64345,1663,64354,64355,64356,64357,1664,64346,64347,64348,64349,1667,64374,64375,64376,64377,1668,64370,64371,64372,64373,1670,64378,64379,64380,64381,1671,64382,64383,64384,64385,1672,64392,64393,0,0,1676,64388,64389,0,0,1677,64386,64387,0,0,1678,64390,64391,0,0,1681,64396,64397,0,0,1688,64394,64395,0,0,1700,64362,64363,64364,64365,1702,64366,64367,64368,64369,1705,64398,64399,64400,64401,1709,64467,64468,64469,64470,1711,64402,64403,64404,64405,1713,64410,64411,64412,64413,1715,64406,64407,64408,64409,1722,64414,64415,0,0,1723,64416,64417,64418,64419,1726,64426,64427,64428,64429,1728,64420,64421,0,0,1729,64422,64423,64424,64425,1733,64480,64481,0,0,1734,64473,64474,0,0,1735,64471,64472,0,0,1736,64475,64476,0,0,1737,64482,64483,0,0,1739,64478,64479,0,0,1740,64508,64509,64510,64511,1744,64484,64485,64486,64487,1746,64430,64431,0,0,1747,64432,64433,0,0],t.X)
B.aO=s(["heatmap-density"],t.s)
B.cn=s(["interpolate",B.ao,B.aO,0,"rgba(0, 0, 255, 0)",0.1,"royalblue",0.3,"cyan",0.5,"lime",0.7,"yellow",1,"red"],t.G)
B.co=s(["nko "],t.s)
B.cA={a:0,c:1,d:2,e:3,g:4,h:5,i:6,j:7,k:8,l:9,n:10,o:11,r:12,s:13,t:14,u:15,w:16,y:17,z:18}
B.cp=new A.ap(B.cA,["\xe0\xe1\xe2\xe3\xe4\xe5\u0101\u0103\u0105","\xe7\u0107\u0109\u010b\u010d","\u010f\u0111","\xe8\xe9\xea\xeb\u0113\u0115\u0117\u0119\u011b","\u011d\u011f\u0121\u0123","\u0125\u0127","\xec\xed\xee\xef\u0129\u012b\u012d\u012f\u0131","\u0135","\u0137","\u013a\u013c\u013e\u0140\u0142","\xf1\u0144\u0146\u0148\u0149","\xf2\xf3\xf4\xf5\xf6\xf8\u014d\u014f\u0151","\u0155\u0157\u0159","\u015b\u015d\u015f\u0161","\u0163\u0165\u0167","\xf9\xfa\xfb\xfc\u0169\u016b\u016d\u016f\u0171\u0173","\u0175","\xfd\xff\u0177","\u017a\u017c\u017e"],A.an("ap<o,o>"))
B.aP=new A.cc([32,0,160,0,8192,0.5,8193,1,8194,0.5,8195,1,8196,0.3333333333333333,8197,0.25,8198,0.16666666666666666,8199,-2,8200,-3,8201,0.2,8202,0.0625,8239,-1,8287,0.2222222222222222,12288,1],A.an("cc<c,d>"))
B.cq=new A.cc([10,22,11,15,12,16,13,17,14,23,15,18,16,19,17,20,18,21,19,14,20,24,21,12,22,25,23,13,24,10,25,11,27,28,28,29,29,30,30,31,31,32,32,33,33,27,84,0,91,0,103,3,130,132,132,131],t.iG)
B.M={}
B.ct=new A.ap(B.M,[],A.an("ap<o,m?(z)>"))
B.e=new A.ap(B.M,[],A.an("ap<o,m?>"))
B.cs=new A.ap(B.M,[],A.an("ap<o,+(d,d)>"))
B.aQ=new A.ap(B.M,[],A.an("ap<@,@>"))
B.cr=new A.ap(B.M,[],A.an("ap<m?,K<o,m?>>"))
B.X=new A.ap(B.M,[],A.an("ap<m?,m?>"))
B.cC={transparent:0,aliceblue:1,antiquewhite:2,aqua:3,aquamarine:4,azure:5,beige:6,bisque:7,black:8,blanchedalmond:9,blue:10,blueviolet:11,brown:12,burlywood:13,cadetblue:14,chartreuse:15,chocolate:16,coral:17,cornflowerblue:18,cornsilk:19,crimson:20,cyan:21,darkblue:22,darkcyan:23,darkgoldenrod:24,darkgray:25,darkgreen:26,darkgrey:27,darkkhaki:28,darkmagenta:29,darkolivegreen:30,darkorange:31,darkorchid:32,darkred:33,darksalmon:34,darkseagreen:35,darkslateblue:36,darkslategray:37,darkslategrey:38,darkturquoise:39,darkviolet:40,deeppink:41,deepskyblue:42,dimgray:43,dimgrey:44,dodgerblue:45,firebrick:46,floralwhite:47,forestgreen:48,fuchsia:49,gainsboro:50,ghostwhite:51,gold:52,goldenrod:53,gray:54,green:55,greenyellow:56,grey:57,honeydew:58,hotpink:59,indianred:60,indigo:61,ivory:62,khaki:63,lavender:64,lavenderblush:65,lawngreen:66,lemonchiffon:67,lightblue:68,lightcoral:69,lightcyan:70,lightgoldenrodyellow:71,lightgray:72,lightgreen:73,lightgrey:74,lightpink:75,lightsalmon:76,lightseagreen:77,lightskyblue:78,lightslategray:79,lightslategrey:80,lightsteelblue:81,lightyellow:82,lime:83,limegreen:84,linen:85,magenta:86,maroon:87,mediumaquamarine:88,mediumblue:89,mediumorchid:90,mediumpurple:91,mediumseagreen:92,mediumslateblue:93,mediumspringgreen:94,mediumturquoise:95,mediumvioletred:96,midnightblue:97,mintcream:98,mistyrose:99,moccasin:100,navajowhite:101,navy:102,oldlace:103,olive:104,olivedrab:105,orange:106,orangered:107,orchid:108,palegoldenrod:109,palegreen:110,paleturquoise:111,palevioletred:112,papayawhip:113,peachpuff:114,peru:115,pink:116,plum:117,powderblue:118,purple:119,rebeccapurple:120,red:121,rosybrown:122,royalblue:123,saddlebrown:124,salmon:125,sandybrown:126,seagreen:127,seashell:128,sienna:129,silver:130,skyblue:131,slateblue:132,slategray:133,slategrey:134,snow:135,springgreen:136,steelblue:137,tan:138,teal:139,thistle:140,tomato:141,turquoise:142,violet:143,wheat:144,white:145,whitesmoke:146,yellow:147,yellowgreen:148}
B.cu=new A.ap(B.cC,[0,4293982463,4294634455,4278255615,4286578644,4293984255,4294309340,4294960324,4278190080,4294962125,4278190335,4287245282,4289014314,4292786311,4284456608,4286578432,4291979550,4294934352,4284782061,4294965468,4292613180,4278255615,4278190219,4278225803,4290283019,4289309097,4278215680,4289309097,4290623339,4287299723,4283788079,4294937600,4288230092,4287299584,4293498490,4287609999,4282924427,4281290575,4281290575,4278243025,4287889619,4294907027,4278239231,4285098345,4285098345,4280193279,4289864226,4294966e3,4280453922,4294902015,4292664540,4294506751,4294956800,4292519200,4286611584,4278222848,4289593135,4286611584,4293984240,4294928820,4291648604,4283105410,4294967280,4293977740,4293322490,4294963445,4286381056,4294965965,4289583334,4293951616,4292935679,4294638290,4292072403,4287688336,4292072403,4294948545,4294942842,4280332970,4287090426,4286023833,4286023833,4289774814,4294967264,4278255360,4281519410,4294635750,4294902015,4286578688,4284927402,4278190285,4290401747,4287852763,4282168177,4286277870,4278254234,4282962380,4291237253,4279834992,4294311930,4294960353,4294960309,4294958765,4278190208,4294833638,4286611456,4285238819,4294944e3,4294919424,4292505814,4293847210,4288215960,4289720046,4292571283,4294963157,4294957753,4291659071,4294951115,4292714717,4289781990,4286578816,4284887961,4294901760,4290547599,4282477025,4287317267,4294606962,4294222944,4281240407,4294964718,4288696877,4290822336,4287090411,4285160141,4285563024,4285563024,4294966010,4278255487,4282811060,4291998860,4278222976,4292394968,4294927175,4282441936,4293821166,4294303411,4294967295,4294309365,4294967040,4288335154],A.an("ap<o,c>"))
B.cv=new A.cc([22,220,15,220,16,220,17,220,23,220,18,220,19,220,20,220,21,220,24,220,25,220,13,214,10,232,11,228,14,228,26,230,28,230,29,230,31,230,32,230,27,230,34,230,35,230,36,230,30,220,33,220,3,222,107,232,118,220,122,230,129,220,132,230,131,220],t.iG)
B.cH=new A.e(0,5)
B.dM=new A.e(32,4)
B.dX=new A.e(64,8)
B.ar=new A.bu([0,0,0,0])
B.ez=new A.af(0,0,0,0)
B.eA=new A.af(0,0,0,1)
B.cB={thin:0,hairline:1,extralight:2,ultralight:3,light:4,regular:5,normal:6,book:7,medium:8,semibold:9,demibold:10,demi:11,bold:12,extrabold:13,ultrabold:14,black:15,heavy:16,italic:17,oblique:18,condensed:19,semicondensed:20,expanded:21,extra:22,semi:23,ultra:24}
B.eB=new A.bk(B.cB,25,t.R)
B.cy={literal:0,get:1,has:2,"!":3,"==":4,"!=":5,"<":6,"<=":7,">":8,">=":9,all:10,any:11,none:12,case:13,match:14,coalesce:15,step:16,interpolate:17,"interpolate-hcl":18,"interpolate-lab":19,zoom:20,"geometry-type":21,"to-string":22,"to-number":23,"to-boolean":24,"to-color":25,string:26,number:27,boolean:28,array:29,object:30,concat:31,upcase:32,downcase:33,"+":34,"-":35,"*":36,"/":37,"%":38,"^":39,min:40,max:41,round:42,floor:43,ceil:44,abs:45,sqrt:46,ln:47,log10:48,log2:49,length:50,in:51,"!in":52,"!has":53,at:54,format:55,"number-format":56,rgb:57,rgba:58,var:59,let:60,id:61,properties:62,"feature-state":63,image:64,typeof:65,collator:66,"resolved-locale":67,"is-supported-script":68,slice:69,"index-of":70,e:71,pi:72,ln2:73,"line-progress":74,"heatmap-density":75,sin:76,cos:77,tan:78,asin:79,acos:80,atan:81,within:82,distance:83,accumulated:84,"to-rgba":85,hsl:86,hsla:87,split:88,join:89,semiliteral:90,$images:91,$transition:92}
B.eC=new A.bk(B.cy,93,t.R)
B.eD=new A.df([1620,1621,1624,1756,1763,1767,1768,2250,2251,2253,2254,2255,2259,2291],A.an("df<c>"))
B.cw={"raster-hue-rotate":0,"raster-saturation":1,"raster-contrast":2,"raster-brightness-min":3,"raster-brightness-max":4}
B.aU=new A.bk(B.cw,5,t.R)
B.cz={Arab:0,Syrc:1,Mong:2,Nkoo:3,Phag:4,Mand:5,Mani:6,Phlp:7,Adlm:8,Rohg:9,Sogd:10,Chrs:11,Ougr:12}
B.eE=new A.bk(B.cz,13,t.R)
B.cx={"user-agent":0,"accept-encoding":1}
B.eF=new A.bk(B.cx,2,t.R)
B.c1=s([],t.I)
B.eG=new A.h3(B.c1)
B.eH=new A.ds(0,"left")
B.eI=new A.ds(1,"right")
B.eJ=new A.ds(2,"center")
B.eK=new A.ha("cancelled",!1)
B.eL=A.b4("yI")
B.eM=A.b4("q3")
B.eN=A.b4("bm")
B.eO=A.b4("cb")
B.eP=A.b4("uk")
B.eQ=A.b4("iP")
B.eR=A.b4("ul")
B.eS=A.b4("a_")
B.eT=A.b4("m")
B.eU=A.b4("kD")
B.eV=A.b4("kE")
B.eW=A.b4("v9")
B.eX=A.b4("al")
B.eY=new A.hi(!1)
B.eZ=new A.hi(!0)
B.aw=new A.dE(0,"yes")
B.ax=new A.dE(1,"no")
B.f_=new A.dE(2,"maybe")})();(function staticFields(){$.le=null
$.aY=A.b([],t.G)
$.qF=null
$.pZ=null
$.pY=null
$.rU=null
$.rJ=null
$.t1=null
$.nR=null
$.o4=null
$.py=null
$.lu=A.b([],A.an("p<k<m>?>"))
$.dH=null
$.f5=null
$.f6=null
$.pe=!1
$.G=B.l
$.uZ=A.A(t.N,A.an("af?"))
$.f9=A.b([],A.an("p<K<o,m?(z)>>"))
$.pc=A.A(t.N,t.u)})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal
s($,"yK","tc",()=>A.nY("_$dart_dartClosure"))
s($,"yJ","pK",()=>A.nY("_$dart_dartClosure_dartJSInterop"))
s($,"za","tw",()=>B.l.bD(B.l,A.an("Z<~>()").a(new A.od()),A.an("Z<~>")))
s($,"z8","tv",()=>A.b([new J.fJ()],A.an("p<en>")))
s($,"yR","tf",()=>A.bP(A.kC({
toString:function(){return"$receiver$"}})))
s($,"yS","tg",()=>A.bP(A.kC({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"yT","th",()=>A.bP(A.kC(null)))
s($,"yU","ti",()=>A.bP(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"yX","tl",()=>A.bP(A.kC(void 0)))
s($,"yY","tm",()=>A.bP(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"yW","tk",()=>A.bP(A.qV(null)))
s($,"yV","tj",()=>A.bP(function(){try{null.$method$}catch(r){return r.message}}()))
s($,"z_","to",()=>A.bP(A.qV(void 0)))
s($,"yZ","tn",()=>A.bP(function(){try{(void 0).$method$}catch(r){return r.message}}()))
s($,"z0","pM",()=>A.vc())
s($,"yM","pL",()=>$.tw())
s($,"yL","td",()=>{var r=new A.H(B.l,t.k)
r.hx(!1)
return r})
s($,"z4","ts",()=>A.uI(4096))
s($,"z2","tq",()=>new A.lD().$0())
s($,"z3","tr",()=>new A.lC().$0())
s($,"z1","tp",()=>A.fZ("^[\\-\\.0-9A-Z_a-z~]*$"))
s($,"z6","fc",()=>A.oe(B.eT))
s($,"z7","tu",()=>{var r=A.xN()
return!A.up(A.tK(A.v4("document") in r))})
s($,"z5","tt",()=>{var r,q,p,o,n,m=t.S
m=A.A(m,m)
for(r=B.cp.ga7().gp(0);r.l();){q=r.gn()
p=q.a
for(q=A.v0(q.b).gp(0),o=p.length;q.l();){n=q.d
if(0>=o)return A.a(p,0)
m.m(0,n,p.charCodeAt(0))}}return m})
s($,"yN","te",()=>A.rP(0.6544984694978736))})();(function nativeSupport(){!function(){var s=function(a){var m={}
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
hunkHelpers.setOrUpdateInterceptorsByTag({SharedArrayBuffer:A.cg,ArrayBuffer:A.dq,ArrayBufferView:A.eg,DataView:A.fP,Float32Array:A.cK,Float64Array:A.cL,Int16Array:A.fQ,Int32Array:A.cM,Int8Array:A.fR,Uint16Array:A.cN,Uint32Array:A.eh,Uint8ClampedArray:A.ei,CanvasPixelArray:A.ei,Uint8Array:A.ci})
hunkHelpers.setOrUpdateLeafTags({SharedArrayBuffer:true,ArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.av.$nativeSuperclassTag="ArrayBufferView"
A.eJ.$nativeSuperclassTag="ArrayBufferView"
A.eK.$nativeSuperclassTag="ArrayBufferView"
A.ch.$nativeSuperclassTag="ArrayBufferView"
A.eL.$nativeSuperclassTag="ArrayBufferView"
A.eM.$nativeSuperclassTag="ArrayBufferView"
A.aR.$nativeSuperclassTag="ArrayBufferView"})()
Function.prototype.$1=function(a){return this(a)}
Function.prototype.$2=function(a,b){return this(a,b)}
Function.prototype.$0=function(){return this()}
Function.prototype.$3=function(a,b,c){return this(a,b,c)}
Function.prototype.$4=function(a,b,c,d){return this(a,b,c,d)}
Function.prototype.$5=function(a,b,c,d,e){return this(a,b,c,d,e)}
Function.prototype.$6=function(a,b,c,d,e,f){return this(a,b,c,d,e,f)}
Function.prototype.$2$0=function(){return this()}
Function.prototype.$1$0=function(){return this()}
Function.prototype.$1$1=function(a){return this(a)}
Function.prototype.$8=function(a,b,c,d,e,f,g,h){return this(a,b,c,d,e,f,g,h)}
Function.prototype.$10=function(a,b,c,d,e,f,g,h,i,j){return this(a,b,c,d,e,f,g,h,i,j)}
convertAllToFastObject(w)
convertToFastObject($);(function(a){if(typeof document==="undefined"){a(null)
return}if(typeof document.currentScript!="undefined"){a(document.currentScript)
return}var s=document.scripts
function onLoad(b){for(var q=0;q<s.length;++q){s[q].removeEventListener("load",onLoad,false)}a(b.target)}for(var r=0;r<s.length;++r){s[r].addEventListener("load",onLoad,false)}})(function(a){v.currentScript=a
var s=A.y3
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()