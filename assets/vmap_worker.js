// vmap web worker, built from lib 09da38e2
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
if(a[b]!==s){A.yc(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.b(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.pl(b)
return new s(c,this)}:function(){if(s===null)s=A.pl(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.pl(a).prototype
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
pq(a,b,c,d){return{i:a,p:b,e:c,x:d}},
o3(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.po==null){A.xC()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.e(A.qS("Return interceptor for "+A.t(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.lx
if(o==null)o=$.lx=A.o2(n)
p=q[o]}if(p!=null)return p
p=A.xM(a)
if(p!=null)return p
if(typeof a=="function")return B.aQ
s=Object.getPrototypeOf(a)
if(s==null)return B.ad
if(s===Object.prototype)return B.ad
if(typeof q=="function"){o=$.lx
if(o==null)o=$.lx=A.o2(n)
Object.defineProperty(q,o,{value:B.U,enumerable:false,writable:true,configurable:true})
return B.U}return B.U},
oM(a,b){if(a<0||a>4294967295)throw A.e(A.a4(a,0,4294967295,"length",null))
return J.qh(new Array(a),b)},
aR(a,b){if(a>4294967295)throw A.e(A.a4(a,0,4294967295,"length",null))
return J.qh(new Array(a),b)},
qg(a,b){if(a<0)throw A.e(A.aQ("Length must be a non-negative integer: "+a,null))
return A.b(new Array(a),b.i("l<0>"))},
oL(a,b){if(a<0)throw A.e(A.aQ("Length must be a non-negative integer: "+a,null))
return A.b(new Array(a),b.i("l<0>"))},
qh(a,b){var s=A.b(a,b.i("l<0>"))
s.$flags=1
return s},
uq(a,b){var s=t.bP
return J.tg(s.a(a),s.a(b))},
qi(a){if(a<256)switch(a){case 9:case 10:case 11:case 12:case 13:case 32:case 133:case 160:return!0
default:return!1}switch(a){case 5760:case 8192:case 8193:case 8194:case 8195:case 8196:case 8197:case 8198:case 8199:case 8200:case 8201:case 8202:case 8232:case 8233:case 8239:case 8287:case 12288:case 65279:return!0
default:return!1}},
qj(a,b){var s,r
for(s=a.length;b<s;){r=a.charCodeAt(b)
if(r!==32&&r!==13&&!J.qi(r))break;++b}return b},
qk(a,b){var s,r,q
for(s=a.length;b>0;b=r){r=b-1
if(!(r<s))return A.a(a,r)
q=a.charCodeAt(r)
if(q!==32&&q!==13&&!J.qi(q))break}return b},
al(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.ei.prototype
return J.h0.prototype}if(typeof a=="string")return J.bZ.prototype
if(a==null)return J.ej.prototype
if(typeof a=="boolean")return J.eh.prototype
if(Array.isArray(a))return J.l.prototype
if(typeof a!="object"){if(typeof a=="function")return J.by.prototype
if(typeof a=="symbol")return J.dm.prototype
if(typeof a=="bigint")return J.dl.prototype
return a}if(a instanceof A.m)return a
return J.o3(a)},
n(a){if(typeof a=="string")return J.bZ.prototype
if(a==null)return a
if(Array.isArray(a))return J.l.prototype
if(typeof a!="object"){if(typeof a=="function")return J.by.prototype
if(typeof a=="symbol")return J.dm.prototype
if(typeof a=="bigint")return J.dl.prototype
return a}if(a instanceof A.m)return a
return J.o3(a)},
Z(a){if(a==null)return a
if(Array.isArray(a))return J.l.prototype
if(typeof a!="object"){if(typeof a=="function")return J.by.prototype
if(typeof a=="symbol")return J.dm.prototype
if(typeof a=="bigint")return J.dl.prototype
return a}if(a instanceof A.m)return a
return J.o3(a)},
xu(a){if(typeof a=="number")return J.dj.prototype
if(typeof a=="string")return J.bZ.prototype
if(a==null)return a
if(!(a instanceof A.m))return J.cJ.prototype
return a},
xv(a){if(typeof a=="string")return J.bZ.prototype
if(a==null)return a
if(!(a instanceof A.m))return J.cJ.prototype
return a},
dU(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.by.prototype
if(typeof a=="symbol")return J.dm.prototype
if(typeof a=="bigint")return J.dl.prototype
return a}if(a instanceof A.m)return a
return J.o3(a)},
k(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.al(a).C(a,b)},
aP(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.xH(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.n(a).h(a,b)},
pH(a,b,c){return J.Z(a).n(a,b,c)},
pI(a,b){return J.Z(a).k(a,b)},
pJ(a,b){return J.xv(a).ca(a,b)},
pK(a,b,c){return J.dU(a).dH(a,b,c)},
pL(a,b,c){return J.dU(a).dI(a,b,c)},
te(a,b,c){return J.dU(a).dJ(a,b,c)},
tf(a,b,c){return J.dU(a).dK(a,b,c)},
pM(a,b,c){return J.dU(a).dL(a,b,c)},
dX(a,b){return J.Z(a).bx(a,b)},
tg(a,b){return J.xu(a).a6(a,b)},
pN(a,b){return J.n(a).v(a,b)},
fp(a,b){return J.Z(a).P(a,b)},
pO(a,b){return J.Z(a).ae(a,b)},
oE(a,b){return J.Z(a).a3(a,b)},
pP(a){return J.dU(a).gaq(a)},
it(a){return J.Z(a).gu(a)},
bb(a){return J.al(a).gR(a)},
d_(a){return J.n(a).gA(a)},
oF(a){return J.n(a).gH(a)},
G(a){return J.Z(a).gt(a)},
X(a){return J.n(a).gj(a)},
th(a){return J.dU(a).gdX(a)},
pQ(a){return J.al(a).gV(a)},
ti(a,b,c){return J.Z(a).bd(a,b,c)},
iu(a,b,c){return J.Z(a).aP(a,b,c)},
tj(a,b){return J.n(a).sj(a,b)},
tk(a,b,c,d,e){return J.Z(a).a8(a,b,c,d,e)},
d0(a,b){return J.Z(a).T(a,b)},
tl(a,b){return J.Z(a).a_(a,b)},
iv(a,b){return J.Z(a).al(a,b)},
tm(a){return J.Z(a).ec(a)},
pR(a){return J.Z(a).ed(a)},
bc(a){return J.al(a).q(a)},
pS(a,b){return J.Z(a).cE(a,b)},
fY:function fY(){},
eh:function eh(){},
ej:function ej(){},
ek:function ek(){},
c_:function c_(){},
hi:function hi(){},
cJ:function cJ(){},
by:function by(){},
dl:function dl(){},
dm:function dm(){},
l:function l(a){this.$ti=a},
h_:function h_(){},
jx:function jx(a){this.$ti=a},
aY:function aY(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
dj:function dj(){},
ei:function ei(){},
h0:function h0(){},
bZ:function bZ(){}},A={oN:function oN(){},
d6(a,b,c){if(t.Q.b(a))return new A.eX(a,b.i("@<0>").G(c).i("eX<1,2>"))
return new A.cj(a,b.i("@<0>").G(c).i("cj<1,2>"))},
ur(a){return new A.dn("Field '"+a+"' has been assigned during initialization.")},
ut(a){return new A.dn("Field '"+a+"' has not been initialized.")},
us(a){return new A.dn("Field '"+a+"' has already been initialized.")},
bD(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
kF(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
cf(a,b,c){return a},
pp(a){var s,r
for(s=$.aO.length,r=0;r<s;++r)if(a===$.aO[r])return!0
return!1},
aS(a,b,c,d){A.aa(b,"start")
if(c!=null){A.aa(c,"end")
if(b>c)A.p(A.a4(b,0,c,"start",null))}return new A.bC(a,b,c,d.i("bC<0>"))},
oT(a,b,c,d){if(t.Q.b(a))return new A.co(a,b,c.i("@<0>").G(d).i("co<1,2>"))
return new A.cz(a,b,c.i("@<0>").G(d).i("cz<1,2>"))},
qN(a,b,c){var s="takeCount"
A.bO(b,s,t.S)
A.aa(b,s)
if(t.Q.b(a))return new A.e7(a,b,c.i("e7<0>"))
return new A.cI(a,b,c.i("cI<0>"))},
qG(a,b,c){var s="count"
if(t.Q.b(a)){A.bO(b,s,t.S)
A.aa(b,s)
return new A.dg(a,b,c.i("dg<0>"))}A.bO(b,s,t.S)
A.aa(b,s)
return new A.bB(a,b,c.i("bB<0>"))},
qd(a,b,c){return new A.cn(a,b,c.i("cn<0>"))},
aG(){return new A.c6("No element")},
qf(){return new A.c6("Too few elements")},
cc:function cc(){},
e2:function e2(a,b){this.a=a
this.$ti=b},
cj:function cj(a,b){this.a=a
this.$ti=b},
eX:function eX(a,b){this.a=a
this.$ti=b},
eV:function eV(){},
bq:function bq(a,b){this.a=a
this.$ti=b},
ck:function ck(a,b){this.a=a
this.$ti=b},
iB:function iB(a,b){this.a=a
this.b=b},
iA:function iA(a){this.a=a},
dn:function dn(a){this.a=a},
da:function da(a){this.a=a},
oi:function oi(){},
kb:function kb(){},
x:function x(){},
a_:function a_(){},
bC:function bC(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.$ti=d},
a0:function a0(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cz:function cz(a,b,c){this.a=a
this.b=b
this.$ti=c},
co:function co(a,b,c){this.a=a
this.b=b
this.$ti=c},
ep:function ep(a,b,c){var _=this
_.a=null
_.b=a
_.c=b
_.$ti=c},
ao:function ao(a,b,c){this.a=a
this.b=b
this.$ti=c},
aK:function aK(a,b,c){this.a=a
this.b=b
this.$ti=c},
eR:function eR(a,b,c){this.a=a
this.b=b
this.$ti=c},
cI:function cI(a,b,c){this.a=a
this.b=b
this.$ti=c},
e7:function e7(a,b,c){this.a=a
this.b=b
this.$ti=c},
eL:function eL(a,b,c){this.a=a
this.b=b
this.$ti=c},
bB:function bB(a,b,c){this.a=a
this.b=b
this.$ti=c},
dg:function dg(a,b,c){this.a=a
this.b=b
this.$ti=c},
eI:function eI(a,b,c){this.a=a
this.b=b
this.$ti=c},
e8:function e8(a){this.$ti=a},
e9:function e9(a){this.$ti=a},
bH:function bH(a,b){this.a=a
this.$ti=b},
cK:function cK(a,b){this.a=a
this.$ti=b},
bw:function bw(a,b,c){this.a=a
this.b=b
this.$ti=c},
cn:function cn(a,b,c){this.a=a
this.b=b
this.$ti=c},
bx:function bx(a,b,c){var _=this
_.a=a
_.b=b
_.c=-1
_.$ti=c},
a3:function a3(){},
bG:function bG(){},
dA:function dA(){},
bi:function bi(a,b){this.a=a
this.$ti=b},
fi:function fi(){},
tF(){throw A.e(A.as("Cannot modify unmodifiable Map"))},
rM(a){var s=A.rL(a)
if(s!=null)return s
return"minified:"+a},
xH(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.dX.b(a)},
t(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.bc(a)
return s},
dv(a){var s,r=$.qy
if(r==null)r=$.qy=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
uU(a,b){var s,r,q,p,o,n=null,m=/^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i.exec(a)
if(m==null)return n
if(3>=m.length)return A.a(m,3)
s=m[3]
if(b<2||b>36)throw A.e(A.a4(b,2,36,"radix",n))
if(b===10&&s!=null)return parseInt(a,10)
if(b<10||s==null){r=b<=10?47+b:86+b
q=m[1]
for(p=q.length,o=0;o<p;++o)if((q.charCodeAt(o)|32)>r)return n}return parseInt(a,b)},
N(a){var s,r
if(!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(a))return null
s=parseFloat(a)
if(isNaN(s)){r=B.d.aH(a)
if(r==="NaN"||r==="+NaN"||r==="-NaN")return s
return null}return s},
hl(a){var s,r,q,p
if(a instanceof A.m)return A.aN(A.a6(a),null)
s=J.al(a)
if(s===B.aP||s===B.aR||t.cx.b(a)){r=B.Z(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.aN(A.a6(a),null)},
qz(a){var s,r,q
if(a==null||typeof a=="number"||A.H(a))return J.bc(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.bQ)return a.q(0)
if(a instanceof A.bj)return a.dA(!0)
s=$.t8()
for(r=0;r<1;++r){q=s[r].ip(a)
if(q!=null)return q}return"Instance of '"+A.hl(a)+"'"},
qx(a){var s,r,q,p,o=a.length
if(o<=500)return String.fromCharCode.apply(null,a)
for(s="",r=0;r<o;r=q){q=r+500
p=q<o?q:o
s+=String.fromCharCode.apply(null,a.slice(r,p))}return s},
uV(a){var s,r,q,p=A.b([],t.t)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.h)(a),++r){q=a[r]
if(!A.dN(q))throw A.e(A.cY(q))
if(q<=65535)B.a.k(p,q)
else if(q<=1114111){B.a.k(p,55296+(B.b.M(q-65536,10)&1023))
B.a.k(p,56320+(q&1023))}else throw A.e(A.cY(q))}return A.qx(p)},
qA(a){var s,r,q
for(s=a.length,r=0;r<s;++r){q=a[r]
if(!A.dN(q))throw A.e(A.cY(q))
if(q<0)throw A.e(A.cY(q))
if(q>65535)return A.uV(a)}return A.qx(a)},
uW(a,b,c){var s,r,q,p
if(c<=500&&b===0&&c===a.length)return String.fromCharCode.apply(null,a)
for(s=b,r="";s<c;s=q){q=s+500
p=q<c?q:c
r+=String.fromCharCode.apply(null,a.subarray(s,p))}return r},
Q(a){var s
if(0<=a){if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.b.M(s,10)|55296)>>>0,s&1023|56320)}}throw A.e(A.a4(a,0,1114111,null,null))},
uT(a){var s=a.$thrownJsError
if(s==null)return null
return A.cg(s)},
qB(a,b){var s
if(a.$thrownJsError==null){s=new Error()
A.ac(a,s)
a.$thrownJsError=s
s.stack=b.q(0)}},
ah(a){throw A.e(A.cY(a))},
a(a,b){if(a==null)J.X(a)
throw A.e(A.o0(a,b))},
o0(a,b){var s,r="index"
if(!A.dN(b))return new A.aX(!0,b,r,null)
s=A.E(J.X(a))
if(b<0||b>=s)return A.jv(b,s,a,r)
return A.qC(b,r)},
xo(a,b,c){if(a<0||a>c)return A.a4(a,0,c,"start",null)
if(b!=null)if(b<a||b>c)return A.a4(b,a,c,"end",null)
return new A.aX(!0,b,"end",null)},
cY(a){return new A.aX(!0,a,null,null)},
xh(a){return a},
e(a){return A.ac(a,new Error())},
ac(a,b){var s
if(a==null)a=new A.bE()
b.dartException=a
s=A.yf
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
yf(){return J.bc(this.dartException)},
p(a,b){throw A.ac(a,b==null?new Error():b)},
w(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.p(A.wk(a,b,c),s)},
wk(a,b,c){var s,r,q,p,o,n,m,l,k
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
return new A.eQ("'"+s+"': Cannot "+o+" "+l+k+n)},
h(a){throw A.e(A.a7(a))},
bF(a){var s,r,q,p,o,n
a=A.rJ(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.b([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.l3(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
l4(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
qQ(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
oO(a,b){var s=b==null,r=s?null:b.method
return new A.h1(a,r,s?null:b.receiver)},
bn(a){var s
if(a==null)return new A.jN(a)
if(a instanceof A.ea){s=a.a
return A.ch(a,s==null?A.ba(s):s)}if(typeof a!=="object")return a
if("dartException" in a)return A.ch(a,a.dartException)
return A.x8(a)},
ch(a,b){if(t.C.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
x8(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.b.M(r,16)&8191)===10)switch(q){case 438:return A.ch(a,A.oO(A.t(s)+" (Error "+q+")",null))
case 445:case 5007:A.t(s)
return A.ch(a,new A.ey())}}if(a instanceof TypeError){p=$.rR()
o=$.rS()
n=$.rT()
m=$.rU()
l=$.rX()
k=$.rY()
j=$.rW()
$.rV()
i=$.t_()
h=$.rZ()
g=p.ak(s)
if(g!=null)return A.ch(a,A.oO(A.U(s),g))
else{g=o.ak(s)
if(g!=null){g.method="call"
return A.ch(a,A.oO(A.U(s),g))}else if(n.ak(s)!=null||m.ak(s)!=null||l.ak(s)!=null||k.ak(s)!=null||j.ak(s)!=null||m.ak(s)!=null||i.ak(s)!=null||h.ak(s)!=null){A.U(s)
return A.ch(a,new A.ey())}}return A.ch(a,new A.hL(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.eJ()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.ch(a,new A.aX(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.eJ()
return a},
cg(a){var s
if(a instanceof A.ea)return a.b
if(a==null)return new A.f6(a)
s=a.$cachedTrace
if(s!=null)return s
s=new A.f6(a)
if(typeof a==="object")a.$cachedTrace=s
return s},
oj(a){if(a==null)return J.bb(a)
if(typeof a=="object")return A.dv(a)
return J.bb(a)},
xk(a){if(typeof a=="number")return B.c.gR(a)
if(a instanceof A.il)return A.dv(a)
if(a instanceof A.bj)return a.gR(a)
return A.oj(a)},
rB(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.n(0,a[s],a[r])}return b},
wx(a,b,c,d,e,f){t.Z.a(a)
switch(A.E(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.e(new A.lg("Unsupported number of arguments for wrapped closure"))},
dT(a,b){var s=a.$identity
if(!!s)return s
s=A.xl(a,b)
a.$identity=s
return s},
xl(a,b){var s
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
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.wx)},
tD(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.hu().constructor.prototype):Object.create(new A.d2(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.pZ(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.tz(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.pZ(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
tz(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.e("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.tt)}throw A.e("Error in functionType of tearoff")},
tA(a,b,c,d){var s=A.pW
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
pZ(a,b,c,d){if(c)return A.tC(a,b,d)
return A.tA(b.length,d,a,b)},
tB(a,b,c,d){var s=A.pW,r=A.tu
switch(b?-1:a){case 0:throw A.e(new A.ho("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
tC(a,b,c){var s,r
if($.pU==null)$.pU=A.pT("interceptor")
if($.pV==null)$.pV=A.pT("receiver")
s=b.length
r=A.tB(s,c,a,b)
return r},
pl(a){return A.tD(a)},
tt(a,b){return A.ff(v.typeUniverse,A.a6(a.a),b)},
pW(a){return a.a},
tu(a){return a.b},
pT(a){var s,r,q,p=new A.d2("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.e(A.aQ("Field name "+a+" not found.",null))},
o2(a){return v.getIsolateTag(a)},
yU(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
xM(a){var s,r,q,p,o,n=A.U($.rC.$1(a)),m=$.o1[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.ob[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.bk($.rx.$2(a,n))
if(q!=null){m=$.o1[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.ob[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.of(s)
$.o1[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.ob[n]=s
return s}if(p==="-"){o=A.of(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.rH(a,s)
if(p==="*")throw A.e(A.qS(n))
if(v.leafTags[n]===true){o=A.of(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.rH(a,s)},
rH(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.pq(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
of(a){return J.pq(a,!1,null,!!a.$iaH)},
xO(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.of(s)
else return J.pq(s,c,null,null)},
xC(){if(!0===$.po)return
$.po=!0
A.xD()},
xD(){var s,r,q,p,o,n,m,l
$.o1=Object.create(null)
$.ob=Object.create(null)
A.xB()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.rI.$1(o)
if(n!=null){m=A.xO(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
xB(){var s,r,q,p,o,n,m=B.ak()
m=A.dS(B.al,A.dS(B.am,A.dS(B.a_,A.dS(B.a_,A.dS(B.an,A.dS(B.ao,A.dS(B.ap(B.Z),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.rC=new A.o8(p)
$.rx=new A.o9(o)
$.rI=new A.oa(n)},
dS(a,b){return a(b)||b},
xn(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
ql(a,b,c,d,e,f){var s=b?"m":"",r=c?"":"i",q=d?"u":"",p=e?"s":"",o=function(g,h){try{return new RegExp(g,h)}catch(n){return n}}(a,s+r+q+p+f)
if(o instanceof RegExp)return o
throw A.e(A.j8("Illegal RegExp pattern ("+String(o)+")",a,null))},
y6(a,b,c){var s
if(typeof b=="string")return a.indexOf(b,c)>=0
else if(b instanceof A.dk){s=B.d.am(a,c)
return b.b.test(s)}else return!J.pJ(b,B.d.am(a,c)).gA(0)},
xp(a){if(a.indexOf("$",0)>=0)return a.replace(/\$/g,"$$$$")
return a},
rJ(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
pw(a,b,c){var s=A.y7(a,b,c)
return s},
y7(a,b,c){var s,r,q
if(b===""){if(a==="")return c
s=a.length
for(r=c,q=0;q<s;++q)r=r+a[q]+c
return r.charCodeAt(0)==0?r:r}if(a.indexOf(b,0)<0)return a
if(a.length<500||c.indexOf("$",0)>=0)return a.split(b).join(c)
return a.replace(new RegExp(A.rJ(b),"g"),A.xp(c))},
os(a,b,c,d){var s=a.indexOf(b,d)
if(s<0)return a
return A.y8(a,s,s+b.length,c)},
y8(a,b,c,d){return a.substring(0,b)+d+a.substring(c)},
z:function z(a,b){this.a=a
this.b=b},
aM:function aM(a,b,c){this.a=a
this.b=b
this.c=c},
dc:function dc(){},
aj:function aj(a,b,c){this.a=a
this.b=b
this.$ti=c},
cQ:function cQ(a,b){this.a=a
this.$ti=b},
bK:function bK(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
bV:function bV(a,b){this.a=a
this.$ti=b},
dd:function dd(){},
b0:function b0(a,b,c){this.a=a
this.b=b
this.$ti=c},
bW:function bW(a,b){this.a=a
this.$ti=b},
eD:function eD(){},
l3:function l3(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
ey:function ey(){},
h1:function h1(a,b,c){this.a=a
this.b=b
this.c=c},
hL:function hL(a){this.a=a},
jN:function jN(a){this.a=a},
ea:function ea(a,b){this.a=a
this.b=b},
f6:function f6(a){this.a=a
this.b=null},
bQ:function bQ(){},
fy:function fy(){},
fz:function fz(){},
hC:function hC(){},
hu:function hu(){},
d2:function d2(a,b){this.a=a
this.b=b},
ho:function ho(a){this.a=a},
b1:function b1(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
jy:function jy(a){this.a=a},
jF:function jF(a,b){var _=this
_.a=a
_.b=b
_.d=_.c=null},
an:function an(a,b){this.a=a
this.$ti=b},
em:function em(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
b2:function b2(a,b){this.a=a
this.$ti=b},
cy:function cy(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
cw:function cw(a,b){this.a=a
this.$ti=b},
cx:function cx(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
cu:function cu(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
o8:function o8(a){this.a=a},
o9:function o9(a){this.a=a},
oa:function oa(a){this.a=a},
bj:function bj(){},
dI:function dI(){},
dJ:function dJ(){},
dk:function dk(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
ic:function ic(a){this.b=a},
hN:function hN(a,b,c){this.a=a
this.b=b
this.c=c},
eS:function eS(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
eK:function eK(a,b){this.a=a
this.c=b},
ih:function ih(a,b,c){this.a=a
this.b=b
this.c=c},
ii:function ii(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
bN(a,b,c){},
a2(a){return a},
uE(a,b,c){var s
A.bN(a,b,c)
s=new DataView(a,b,c)
return s},
uF(a,b,c){A.bN(a,b,c)
return new Float32Array(a,b,c)},
uG(a,b,c){A.bN(a,b,c)
return new Float64Array(a,b,c)},
cD(a){return new Int32Array(A.a2(a))},
uH(a){return new Uint16Array(a)},
uI(a,b,c){A.bN(a,b,c)
return new Uint16Array(a,b,c)},
uJ(a){return new Uint8Array(a)},
oU(a,b,c){A.bN(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
bM(a,b,c){if(a>>>0!==a||a>=c)throw A.e(A.o0(b,a))},
bl(a,b,c){var s
if(!(a>>>0!==a))if(b==null)s=a>c
else s=b>>>0!==b||a>b||b>c
else s=!0
if(s)throw A.e(A.xo(a,b,c))
if(b==null)return c
return b},
c0:function c0(){},
du:function du(){},
eu:function eu(){},
lM:function lM(a){this.a=a},
et:function et(){},
ap:function ap(){},
c1:function c1(){},
aI:function aI(){},
cA:function cA(){},
cB:function cB(){},
hb:function hb(){},
cC:function cC(){},
hc:function hc(){},
cE:function cE(){},
ev:function ev(){},
ew:function ew(){},
c2:function c2(){},
f1:function f1(){},
f2:function f2(){},
f3:function f3(){},
f4:function f4(){},
oW(a,b){var s=b.c
return s==null?b.c=A.fd(a,"a8",[b.x]):s},
qF(a){var s=a.w
if(s===6||s===7)return A.qF(a.x)
return s===11||s===12},
v1(a){return a.as},
ak(a){return A.lL(v.typeUniverse,a,!1)},
cX(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.cX(a1,s,a3,a4)
if(r===s)return a2
return A.r7(a1,r,!0)
case 7:s=a2.x
r=A.cX(a1,s,a3,a4)
if(r===s)return a2
return A.r6(a1,r,!0)
case 8:q=a2.y
p=A.dR(a1,q,a3,a4)
if(p===q)return a2
return A.fd(a1,a2.x,p)
case 9:o=a2.x
n=A.cX(a1,o,a3,a4)
m=a2.y
l=A.dR(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.p3(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.dR(a1,j,a3,a4)
if(i===j)return a2
return A.r8(a1,k,i)
case 11:h=a2.x
g=A.cX(a1,h,a3,a4)
f=a2.y
e=A.x4(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.r5(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.dR(a1,d,a3,a4)
o=a2.x
n=A.cX(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.p4(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.e(A.fs("Attempted to substitute unexpected RTI kind "+a0))}},
dR(a,b,c,d){var s,r,q,p,o=b.length,n=A.lQ(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.cX(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
x5(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.lQ(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.cX(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
x4(a,b,c,d){var s,r=b.a,q=A.dR(a,r,c,d),p=b.b,o=A.dR(a,p,c,d),n=b.c,m=A.x5(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.i3()
s.a=q
s.b=o
s.c=m
return s},
b(a,b){a[v.arrayRti]=b
return a},
pm(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.xy(s)
return a.$S()}return null},
xE(a,b){var s
if(A.qF(b))if(a instanceof A.bQ){s=A.pm(a)
if(s!=null)return s}return A.a6(a)},
a6(a){if(a instanceof A.m)return A.r(a)
if(Array.isArray(a))return A.M(a)
return A.p9(J.al(a))},
M(a){var s=a[v.arrayRti],r=t.dG
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
r(a){var s=a.$ti
return s!=null?s:A.p9(a)},
p9(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.wt(a,s)},
wt(a,b){var s=a instanceof A.bQ?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.vX(v.typeUniverse,s.name)
b.$ccache=r
return r},
xy(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.lL(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
xw(a){return A.bm(A.r(a))},
ph(a){var s
if(a instanceof A.bj)return a.d5()
s=a instanceof A.bQ?A.pm(a):null
if(s!=null)return s
if(t.aJ.b(a))return J.pQ(a).a
if(Array.isArray(a))return A.M(a)
return A.a6(a)},
bm(a){var s=a.r
return s==null?a.r=new A.il(a):s},
xq(a,b){var s,r,q=b,p=q.length
if(p===0)return t.aK
if(0>=p)return A.a(q,0)
s=A.ff(v.typeUniverse,A.ph(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.a(q,r)
s=A.ra(v.typeUniverse,s,A.ph(q[r]))}return A.ff(v.typeUniverse,s,a)},
aW(a){return A.bm(A.lL(v.typeUniverse,a,!1))},
ws(a){var s=this
s.b=A.x2(s)
return s.b(a)},
x2(a){var s,r,q,p,o
if(a===t.K)return A.wD
if(A.cZ(a))return A.wH
s=a.w
if(s===6)return A.wo
if(s===1)return A.rm
if(s===7)return A.wy
r=A.x1(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.cZ)){a.f="$i"+q
if(q==="j")return A.wB
if(a===t.m)return A.wA
return A.wG}}else if(s===10){p=A.xn(a.x,a.y)
o=p==null?A.rm:p
return o==null?A.ba(o):o}return A.wm},
x1(a){if(a.w===8){if(a===t.S)return A.dN
if(a===t.i||a===t.cZ)return A.wC
if(a===t.N)return A.wF
if(a===t.y)return A.H}return null},
wr(a){var s=this,r=A.wl
if(A.cZ(s))r=A.w8
else if(s===t.K)r=A.ba
else if(A.dV(s)){r=A.wn
if(s===t.aV)r=A.w6
else if(s===t.bl)r=A.bk
else if(s===t.fU)r=A.w4
else if(s===t.jh)r=A.io
else if(s===t.jX)r=A.w5
else if(s===t.mU)r=A.w7}else if(s===t.S)r=A.E
else if(s===t.N)r=A.U
else if(s===t.y)r=A.p5
else if(s===t.cZ)r=A.ae
else if(s===t.i)r=A.cW
else if(s===t.m)r=A.aV
s.a=r
return s.a(a)},
wm(a){var s=this
if(a==null)return A.dV(s)
return A.xI(v.typeUniverse,A.xE(a,s),s)},
wo(a){if(a==null)return!0
return this.x.b(a)},
wG(a){var s,r=this
if(a==null)return A.dV(r)
s=r.f
if(a instanceof A.m)return!!a[s]
return!!J.al(a)[s]},
wB(a){var s,r=this
if(a==null)return A.dV(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.m)return!!a[s]
return!!J.al(a)[s]},
wA(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.m)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
rl(a){if(typeof a=="object"){if(a instanceof A.m)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
wl(a){var s=this
if(a==null){if(A.dV(s))return a}else if(s.b(a))return a
throw A.ac(A.ri(a,s),new Error())},
wn(a){var s=this
if(a==null||s.b(a))return a
throw A.ac(A.ri(a,s),new Error())},
ri(a,b){return new A.fb("TypeError: "+A.qV(a,A.aN(b,null)))},
qV(a,b){return A.fP(a)+": type '"+A.aN(A.ph(a),null)+"' is not a subtype of type '"+b+"'"},
aU(a,b){return new A.fb("TypeError: "+A.qV(a,b))},
wy(a){var s=this
return s.x.b(a)||A.oW(v.typeUniverse,s).b(a)},
wD(a){return a!=null},
ba(a){if(a!=null)return a
throw A.ac(A.aU(a,"Object"),new Error())},
wH(a){return!0},
w8(a){return a},
rm(a){return!1},
H(a){return!0===a||!1===a},
p5(a){if(!0===a)return!0
if(!1===a)return!1
throw A.ac(A.aU(a,"bool"),new Error())},
w4(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.ac(A.aU(a,"bool?"),new Error())},
cW(a){if(typeof a=="number")return a
throw A.ac(A.aU(a,"double"),new Error())},
w5(a){if(typeof a=="number")return a
if(a==null)return a
throw A.ac(A.aU(a,"double?"),new Error())},
dN(a){return typeof a=="number"&&Math.floor(a)===a},
E(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.ac(A.aU(a,"int"),new Error())},
w6(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.ac(A.aU(a,"int?"),new Error())},
wC(a){return typeof a=="number"},
ae(a){if(typeof a=="number")return a
throw A.ac(A.aU(a,"num"),new Error())},
io(a){if(typeof a=="number")return a
if(a==null)return a
throw A.ac(A.aU(a,"num?"),new Error())},
wF(a){return typeof a=="string"},
U(a){if(typeof a=="string")return a
throw A.ac(A.aU(a,"String"),new Error())},
bk(a){if(typeof a=="string")return a
if(a==null)return a
throw A.ac(A.aU(a,"String?"),new Error())},
aV(a){if(A.rl(a))return a
throw A.ac(A.aU(a,"JSObject"),new Error())},
w7(a){if(a==null)return a
if(A.rl(a))return a
throw A.ac(A.aU(a,"JSObject?"),new Error())},
rt(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.aN(a[q],b)
return s},
wX(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.rt(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.aN(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
rj(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
if(a5!=null){s=a5.length
if(a4==null)a4=A.b([],t.s)
else a2=a4.length
r=a4.length
for(q=s;q>0;--q)B.a.k(a4,"T"+(r+q))
for(p=t.O,o="<",n="",q=0;q<s;++q,n=a1){m=a4.length
l=m-1-q
if(!(l>=0))return A.a(a4,l)
o=o+n+a4[l]
k=a5[q]
j=k.w
if(!(j===2||j===3||j===4||j===5||k===p))o+=" extends "+A.aN(k,a4)}o+=">"}else o=""
p=a3.x
i=a3.y
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.aN(p,a4)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.aN(h[q],a4)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.aN(f[q],a4)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.aN(d[q+2],a4)+" "+d[q]}a+="}"}if(a2!=null){a4.toString
a4.length=a2}return o+"("+a+") => "+b},
aN(a,b){var s,r,q,p,o,n,m,l=a.w
if(l===5)return"erased"
if(l===2)return"dynamic"
if(l===3)return"void"
if(l===1)return"Never"
if(l===4)return"any"
if(l===6){s=a.x
r=A.aN(s,b)
q=s.w
return(q===11||q===12?"("+r+")":r)+"?"}if(l===7)return"FutureOr<"+A.aN(a.x,b)+">"
if(l===8){p=A.x7(a.x)
o=a.y
return o.length>0?p+("<"+A.rt(o,b)+">"):p}if(l===10)return A.wX(a,b)
if(l===11)return A.rj(a,b,null)
if(l===12)return A.rj(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.a(b,n)
return b[n]}return"?"},
x7(a){var s=A.rL(a)
if(s!=null)return s
return"minified:"+a},
vY(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
vX(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.lL(a,b,!1)
else if(typeof m=="number"){s=m
r=A.fe(a,5,"#")
q=A.lQ(s)
for(p=0;p<s;++p)q[p]=r
o=A.fd(a,b,q)
n[b]=o
return o}else return m},
vW(a,b){return A.rc(a.tR,b)},
vV(a,b){return A.rc(a.eT,b)},
lL(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.r9(a,null,b,!1)
r.set(b,s)
return s},
ff(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.r9(a,b,c,!0)
q.set(c,r)
return r},
ra(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.p3(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
r9(a,b,c,d){return A.vN(A.vH(a,b,c,d))},
ce(a,b){b.a=A.wr
b.b=A.ws
return b},
fe(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.b4(null,null)
s.w=b
s.as=c
r=A.ce(a,s)
a.eC.set(c,r)
return r},
r7(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.vT(a,b,r,c)
a.eC.set(r,s)
return s},
vT(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.cZ(b))if(!(b===t.P||b===t.T))if(s!==6)r=s===7&&A.dV(b.x)
if(r)return b
else if(s===1)return t.P}q=new A.b4(null,null)
q.w=6
q.x=b
q.as=c
return A.ce(a,q)},
r6(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.vR(a,b,r,c)
a.eC.set(r,s)
return s},
vR(a,b,c,d){var s,r
if(d){s=b.w
if(A.cZ(b)||b===t.K)return b
else if(s===1)return A.fd(a,"a8",[b])
else if(b===t.P||b===t.T)return t.gK}r=new A.b4(null,null)
r.w=7
r.x=b
r.as=c
return A.ce(a,r)},
vU(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.b4(null,null)
s.w=13
s.x=b
s.as=q
r=A.ce(a,s)
a.eC.set(q,r)
return r},
fc(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
vQ(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
fd(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.fc(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.b4(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.ce(a,r)
a.eC.set(p,q)
return q},
p3(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.fc(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.b4(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.ce(a,o)
a.eC.set(q,n)
return n},
r8(a,b,c){var s,r,q="+"+(b+"("+A.fc(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.b4(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.ce(a,s)
a.eC.set(q,r)
return r},
r5(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.fc(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.fc(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.vQ(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.b4(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.ce(a,p)
a.eC.set(r,o)
return o},
p4(a,b,c,d){var s,r=b.as+("<"+A.fc(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.vS(a,b,c,r,d)
a.eC.set(r,s)
return s},
vS(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.lQ(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.cX(a,b,r,0)
m=A.dR(a,c,r,0)
return A.p4(a,n,m,c!==m)}}l=new A.b4(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.ce(a,l)},
vH(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
vN(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.vJ(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.r0(a,r,l,k,!1)
else if(q===46)r=A.r0(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.cU(a.u,a.e,k.pop()))
break
case 94:k.push(A.vU(a.u,k.pop()))
break
case 35:k.push(A.fe(a.u,5,"#"))
break
case 64:k.push(A.fe(a.u,2,"@"))
break
case 126:k.push(A.fe(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.vL(a,k)
break
case 38:A.vK(a,k)
break
case 63:p=a.u
k.push(A.r7(p,A.cU(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.r6(p,A.cU(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.vI(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.r1(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.vO(a.u,a.e,o)
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
return A.cU(a.u,a.e,m)},
vJ(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
r0(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.vY(s,o.x)[p]
if(n==null)A.p('No "'+p+'" in "'+A.v1(o)+'"')
d.push(A.ff(s,o,n))}else d.push(p)
return m},
vL(a,b){var s,r=a.u,q=A.r_(a,b),p=b.pop()
if(typeof p=="string")b.push(A.fd(r,p,q))
else{s=A.cU(r,a.e,p)
switch(s.w){case 11:b.push(A.p4(r,s,q,a.n))
break
default:b.push(A.p3(r,s,q))
break}}},
vI(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.r_(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.cU(p,a.e,o)
q=new A.i3()
q.a=s
q.b=n
q.c=m
b.push(A.r5(p,r,q))
return
case-4:b.push(A.r8(p,b.pop(),s))
return
default:throw A.e(A.fs("Unexpected state under `()`: "+A.t(o)))}},
vK(a,b){var s=b.pop()
if(0===s){b.push(A.fe(a.u,1,"0&"))
return}if(1===s){b.push(A.fe(a.u,4,"1&"))
return}throw A.e(A.fs("Unexpected extended operation "+A.t(s)))},
r_(a,b){var s=b.splice(a.p)
A.r1(a.u,a.e,s)
a.p=b.pop()
return s},
cU(a,b,c){if(typeof c=="string")return A.fd(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.vM(a,b,c)}else return c},
r1(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.cU(a,b,c[s])},
vO(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.cU(a,b,c[s])},
vM(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.e(A.fs("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.e(A.fs("Bad index "+c+" for "+b.q(0)))},
xI(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.af(a,b,null,c,null)
r.set(c,s)}return s},
af(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.cZ(d))return!0
s=b.w
if(s===4)return!0
if(A.cZ(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.af(a,c[b.x],c,d,e))return!0
q=d.w
p=t.P
if(b===p||b===t.T){if(q===7)return A.af(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.af(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.af(a,b.x,c,d,e))return!1
return A.af(a,A.oW(a,b),c,d,e)}if(s===6)return A.af(a,p,c,d,e)&&A.af(a,b.x,c,d,e)
if(q===7){if(A.af(a,b,c,d.x,e))return!0
return A.af(a,b,c,A.oW(a,d),e)}if(q===6)return A.af(a,b,c,p,e)||A.af(a,b,c,d.x,e)
if(r)return!1
p=s!==11
if((!p||s===12)&&d===t.Z)return!0
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
if(!A.af(a,j,c,i,e)||!A.af(a,i,e,j,c))return!1}return A.rk(a,b.x,c,d.x,e)}if(q===11){if(b===t.et)return!0
if(p)return!1
return A.rk(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.wz(a,b,c,d,e)}if(o&&q===10)return A.wE(a,b,c,d,e)
return!1},
rk(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.af(a3,a4.x,a5,a6.x,a7))return!1
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
if(!A.af(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.af(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.af(a3,k[h],a7,g,a5))return!1}f=s.c
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
if(!A.af(a3,e[a+2],a7,g,a5))return!1
break}}while(b<d){if(f[b+1])return!1
b+=3}return!0},
wz(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.ff(a,b,r[o])
return A.rd(a,p,null,c,d.y,e)}return A.rd(a,b.y,null,c,d.y,e)},
rd(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.af(a,b[s],d,e[s],f))return!1
return!0},
wE(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.af(a,r[s],c,q[s],e))return!1
return!0},
dV(a){var s=a.w,r=!0
if(!(a===t.P||a===t.T))if(!A.cZ(a))if(s!==6)r=s===7&&A.dV(a.x)
return r},
cZ(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.O},
rc(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
lQ(a){return a>0?new Array(a):v.typeUniverse.sEA},
b4:function b4(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
i3:function i3(){this.c=this.b=this.a=null},
il:function il(a){this.a=a},
hY:function hY(){},
fb:function fb(a){this.a=a},
vt(){var s,r,q
if(self.scheduleImmediate!=null)return A.xb()
if(self.MutationObserver!=null&&self.document!=null){s={}
r=self.document.createElement("div")
q=self.document.createElement("span")
s.a=null
new self.MutationObserver(A.dT(new A.lc(s),1)).observe(r,{childList:true})
return new A.lb(s,r,q)}else if(self.setImmediate!=null)return A.xc()
return A.xd()},
vu(a){self.scheduleImmediate(A.dT(new A.ld(t.M.a(a)),0))},
vv(a){self.setImmediate(A.dT(new A.le(t.M.a(a)),0))},
vw(a){A.oZ(B.ay,t.M.a(a))},
oZ(a,b){return A.vP(a.a/1000|0,b)},
vP(a,b){var s=new A.lJ()
s.eo(a,b)
return s},
aw(a){return new A.hO(new A.L($.J,a.i("L<0>")),a.i("hO<0>"))},
av(a,b){a.$2(0,null)
b.b=!0
return b.a},
Y(a,b){A.w9(a,b)},
au(a,b){b.ce(a)},
at(a,b){b.cf(A.bn(a),A.cg(a))},
w9(a,b){var s,r,q=new A.lS(b),p=new A.lT(b)
if(a instanceof A.L)a.dz(q,p,t.z)
else{s=t.z
if(a instanceof A.L)a.b9(q,p,s)
else{r=new A.L($.J,t._)
r.a=8
r.c=a
r.dz(q,p,s)}}},
ax(a){var s=function(b,c){return function(d,e){while(true){try{b(d,e)
break}catch(r){e=r
d=c}}}}(a,1)
return $.J.cv(new A.nR(s),t.o,t.S,t.z)},
r4(a,b,c){return 0},
oG(a){var s
if(t.C.b(a)){s=a.gaU()
if(s!=null)return s}return B.z},
u0(a,b){var s
if(!b.b(null))throw A.e(A.ix(null,"computation","The type parameter is not nullable"))
s=new A.L($.J,b.i("L<0>"))
A.qP(a,new A.ja(null,s,b))
return s},
wu(a,b){if($.J===B.f)return null
return null},
wv(a,b){if($.J!==B.f)A.wu(a,b)
if(b==null)if(t.C.b(a)){b=a.gaU()
if(b==null){A.qB(a,B.z)
b=B.z}}else b=B.z
else if(t.C.b(a))A.qB(a,b)
return new A.ai(a,b)},
ll(a,b,c){var s,r,q,p,o={},n=o.a=a
for(s=t._;r=n.a,(r&4)!==0;n=a){a=s.a(n.c)
o.a=a}if(n===b){s=A.qH()
b.aY(new A.ai(new A.aX(!0,n,null,"Cannot complete a future with itself"),s))
return}q=b.a&1
s=n.a=r|q
if((s&24)===0){p=t.F.a(b.c)
b.a=b.a&1|4
b.c=n
n.dl(p)
return}if(!c)if(b.c==null)n=(s&16)===0||q!==0
else n=!1
else n=!0
if(n){p=b.b0()
b.bh(o.a)
A.cP(b,p)
return}b.a^=2
A.dQ(null,null,b.b,t.M.a(new A.lm(o,b)))},
cP(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d={},c=d.a=a
for(s=t.v,r=t.F;;){q={}
p=c.a
o=(p&16)===0
n=!o
if(b==null){if(n&&(p&1)===0){m=s.a(c.c)
A.iq(m.a,m.b)}return}q.a=b
l=b.a
for(c=b;l!=null;c=l,l=k){c.a=null
A.cP(d.a,c)
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
A.iq(j.a,j.b)
return}g=$.J
if(g!==h)$.J=h
else g=null
c=c.c
if((c&15)===8)new A.lq(q,d,n).$0()
else if(o){if((c&1)!==0)new A.lp(q,j).$0()}else if((c&2)!==0)new A.lo(d,q).$0()
if(g!=null)$.J=g
c=q.c
if(c instanceof A.L){p=q.a.$ti
p=p.i("a8<2>").b(c)||!p.y[1].b(c)}else p=!1
if(p){f=q.a.b
if((c.a&24)!==0){e=r.a(f.c)
f.c=null
b=f.bp(e)
f.a=c.a&30|f.a&1
f.c=c.c
d.a=c
continue}else A.ll(c,f,!0)
return}}f=q.a.b
e=r.a(f.c)
f.c=null
b=f.bp(e)
c=q.b
p=q.c
if(!c){f.$ti.c.a(p)
f.a=8
f.c=p}else{s.a(p)
f.a=f.a&1|16
f.c=p}d.a=f
c=f}},
wY(a,b){var s
if(t.ng.b(a))return b.cv(a,t.z,t.K,t.l)
s=t.B
if(s.b(a))return s.a(a)
throw A.e(A.ix(a,"onError",u.c))},
wQ(){var s,r
for(s=$.dP;s!=null;s=$.dP){$.fk=null
r=s.b
$.dP=r
if(r==null)$.fj=null
s.a.$0()}},
x3(){$.pb=!0
try{A.wQ()}finally{$.fk=null
$.pb=!1
if($.dP!=null)$.pD().$1(A.ry())}},
ru(a){var s=new A.hP(a),r=$.fj
if(r==null){$.dP=$.fj=s
if(!$.pb)$.pD().$1(A.ry())}else $.fj=r.b=s},
x0(a){var s,r,q,p=$.dP
if(p==null){A.ru(a)
$.fk=$.fj
return}s=new A.hP(a)
r=$.fk
if(r==null){s.b=p
$.dP=$.fk=s}else{q=r.b
s.b=q
$.fk=r.b=s
if(q==null)$.fj=s}},
y1(a){var s=null,r=$.J
if(B.f===r){A.dQ(s,s,B.f,a)
return}A.dQ(s,s,r,t.M.a(r.cd(a)))},
yp(a,b){return new A.cV(A.cf(a,"stream",t.K),b.i("cV<0>"))},
pf(a){return},
vx(a,b){if(b==null)b=A.xe()
if(t.b9.b(b))return a.cv(b,t.z,t.K,t.l)
if(t.i6.b(b))return t.B.a(b)
throw A.e(A.aQ("handleError callback must take either an Object (the error), or both an Object (the error) and a StackTrace.",null))},
wS(a,b){A.iq(a,b)},
qP(a,b){var s=$.J
if(s===B.f)return A.oZ(a,t.M.a(b))
return A.oZ(a,t.M.a(s.cd(b)))},
iq(a,b){A.x0(new A.nL(a,b))},
rr(a,b,c,d,e){var s,r=$.J
if(r===c)return d.$0()
$.J=c
s=r
try{r=d.$0()
return r}finally{$.J=s}},
rs(a,b,c,d,e,f,g){var s,r=$.J
if(r===c)return d.$1(e)
$.J=c
s=r
try{r=d.$1(e)
return r}finally{$.J=s}},
x_(a,b,c,d,e,f,g,h,i){var s,r=$.J
if(r===c)return d.$2(e,f)
$.J=c
s=r
try{r=d.$2(e,f)
return r}finally{$.J=s}},
dQ(a,b,c,d){t.M.a(d)
if(B.f!==c){d=c.cd(d)
d=d}A.ru(d)},
lc:function lc(a){this.a=a},
lb:function lb(a,b,c){this.a=a
this.b=b
this.c=c},
ld:function ld(a){this.a=a},
le:function le(a){this.a=a},
lJ:function lJ(){this.b=null},
lK:function lK(a,b){this.a=a
this.b=b},
hO:function hO(a,b){this.a=a
this.b=!1
this.$ti=b},
lS:function lS(a){this.a=a},
lT:function lT(a){this.a=a},
nR:function nR(a){this.a=a},
fa:function fa(a,b){var _=this
_.a=a
_.e=_.d=_.c=_.b=null
_.$ti=b},
dL:function dL(a,b){this.a=a
this.$ti=b},
ai:function ai(a,b){this.a=a
this.b=b},
ja:function ja(a,b,c){this.a=a
this.b=b
this.c=c},
l2:function l2(a,b){this.a=a
this.b=b},
hU:function hU(){},
eU:function eU(a,b){this.a=a
this.$ti=b},
b8:function b8(a,b,c,d,e){var _=this
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
li:function li(a,b){this.a=a
this.b=b},
ln:function ln(a,b){this.a=a
this.b=b},
lm:function lm(a,b){this.a=a
this.b=b},
lk:function lk(a,b){this.a=a
this.b=b},
lj:function lj(a,b){this.a=a
this.b=b},
lq:function lq(a,b,c){this.a=a
this.b=b
this.c=c},
lr:function lr(a,b){this.a=a
this.b=b},
ls:function ls(a){this.a=a},
lp:function lp(a,b){this.a=a
this.b=b},
lo:function lo(a,b){this.a=a
this.b=b},
lt:function lt(a,b){this.a=a
this.b=b},
lu:function lu(a,b,c){this.a=a
this.b=b
this.c=c},
lv:function lv(a,b){this.a=a
this.b=b},
hP:function hP(a){this.a=a
this.b=null},
dx:function dx(){},
ki:function ki(a,b){this.a=a
this.b=b},
kj:function kj(a,b){this.a=a
this.b=b},
f7:function f7(){},
lI:function lI(a){this.a=a},
lH:function lH(a){this.a=a},
hQ:function hQ(){},
dD:function dD(a,b,c,d,e){var _=this
_.a=null
_.b=0
_.d=a
_.e=b
_.f=c
_.r=d
_.$ti=e},
dH:function dH(a,b){this.a=a
this.$ti=b},
cM:function cM(a,b,c,d,e){var _=this
_.w=a
_.a=b
_.d=c
_.e=d
_.r=_.f=null
_.$ti=e},
dE:function dE(){},
f9:function f9(){},
eW:function eW(){},
cN:function cN(a,b){this.b=a
this.a=null
this.$ti=b},
b9:function b9(a){var _=this
_.a=0
_.c=_.b=null
_.$ti=a},
lD:function lD(a,b){this.a=a
this.b=b},
cV:function cV(a,b){var _=this
_.a=null
_.b=a
_.c=!1
_.$ti=b},
fh:function fh(){},
ig:function ig(){},
lG:function lG(a,b){this.a=a
this.b=b},
nL:function nL(a,b){this.a=a
this.b=b},
oQ(a,b){return new A.b1(a.i("@<0>").G(b).i("b1<1,2>"))},
en(a,b,c){return b.i("@<0>").G(c).i("oP<1,2>").a(A.rB(a,new A.b1(b.i("@<0>").G(c).i("b1<1,2>"))))},
C(a,b){return new A.b1(a.i("@<0>").G(b).i("b1<1,2>"))},
qq(a){return new A.cS(a.i("cS<0>"))},
b3(a){return new A.cS(a.i("cS<0>"))},
p1(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
vG(a,b,c){var s=new A.cT(a,b,c.i("cT<0>"))
s.c=a.e
return s},
uv(a,b,c){var s=A.oQ(b,c)
s.B(0,a)
return s},
uw(a,b){var s,r,q=A.qq(b)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.h)(a),++r)q.k(0,b.a(a[r]))
return q},
oS(a){var s,r
if(A.pp(a))return"{...}"
s=new A.b6("")
try{r={}
B.a.k($.aO,a)
s.a+="{"
r.a=!0
a.a3(0,new A.jH(r,s))
s.a+="}"}finally{if(0>=$.aO.length)return A.a($.aO,-1)
$.aO.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
ux(a,b,c){var s,r,q=A.M(b),p=new J.aY(b,b.length,q.i("aY<1>")),o=A.M(c),n=new J.aY(c,c.length,o.i("aY<1>")),m=p.m(),l=n.m()
q=q.c
o=o.c
for(;;){if(!(m&&l))break
s=p.d
if(s==null)s=q.a(s)
r=n.d
a.n(0,s,r==null?o.a(r):r)
m=p.m()
l=n.m()}if(m||l)throw A.e(A.aQ("Iterables do not have same length.",null))},
cS:function cS(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
ib:function ib(a){this.a=a
this.b=null},
cT:function cT(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
y:function y(){},
P:function P(){},
jG:function jG(a){this.a=a},
jH:function jH(a,b){this.a=a
this.b=b},
eZ:function eZ(a,b){this.a=a
this.$ti=b},
f_:function f_(a,b,c){var _=this
_.a=a
_.b=b
_.c=null
_.$ti=c},
bA:function bA(){},
f5:function f5(){},
wU(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.bn(r)
q=A.j8(String(s),null,null)
throw A.e(q)}q=A.m4(p)
return q},
m4(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.i8(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.m4(a[s])
return a},
w0(a,b,c){var s,r,q,p,o,n=c-b
if(n<=4096)s=$.t3()
else s=new Uint8Array(n)
for(r=a.length,q=0;q<n;++q){p=b+q
if(!(p<r))return A.a(a,p)
o=a[p]
if((o&255)!==o)o=255
s[q]=o}return s},
w_(a,b,c,d){var s=a?$.t2():$.t1()
if(s==null)return null
if(0===c&&d===b.length)return A.rb(s,b)
return A.rb(s,b.subarray(c,d))},
rb(a,b){var s,r
try{s=a.decode(b)
return s}catch(r){}return null},
qm(a,b,c){return new A.el(a,b)},
wj(a){return a.iz()},
vD(a,b){return new A.lz(a,[],A.xm())},
vE(a,b,c){var s,r=new A.b6(""),q=A.vD(r,b)
q.bH(a)
s=r.a
return s.charCodeAt(0)==0?s:s},
w1(a){switch(a){case 65:return"Missing extension byte"
case 67:return"Unexpected extension byte"
case 69:return"Invalid UTF-8 byte"
case 71:return"Overlong encoding"
case 73:return"Out of unicode range"
case 75:return"Encoded surrogate"
case 77:return"Unfinished UTF-8 octet sequence"
default:return""}},
i8:function i8(a,b){this.a=a
this.b=b
this.c=null},
ly:function ly(a){this.a=a},
i9:function i9(a){this.a=a},
lO:function lO(){},
lN:function lN(){},
db:function db(){},
fG:function fG(){},
fO:function fO(){},
el:function el(a,b){this.a=a
this.b=b},
h3:function h3(a,b){this.a=a
this.b=b},
h2:function h2(){},
jA:function jA(a){this.b=a},
jz:function jz(a){this.a=a},
lA:function lA(){},
lB:function lB(a,b){this.a=a
this.b=b},
lz:function lz(a,b,c){this.c=a
this.a=b
this.b=c},
hM:function hM(){},
l7:function l7(){},
lP:function lP(a){this.b=0
this.c=a},
l6:function l6(a){this.a=a},
im:function im(a){this.a=a
this.b=16
this.c=0},
tW(a,b){a=A.ac(a,new Error())
if(a==null)a=A.ba(a)
a.stack=b.q(0)
throw a},
T(a,b,c,d){var s,r=c?J.qg(a,d):J.oM(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
qr(a,b,c){var s,r,q=A.b([],c.i("l<0>"))
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.h)(a),++r)B.a.k(q,c.a(a[r]))
if(b)return q
q.$flags=1
return q},
a1(a,b){var s,r
if(Array.isArray(a))return A.b(a.slice(0),b.i("l<0>"))
s=A.b([],b.i("l<0>"))
for(r=J.G(a);r.m();)B.a.k(s,r.gp())
return s},
eo(a,b,c,d){var s,r=c?J.qg(a,d):J.oM(a,d)
for(s=0;s<a;++s)B.a.n(r,s,b.$1(s))
return r},
oR(a,b){var s=A.qr(a,!1,b)
s.$flags=3
return s},
dy(a,b,c){var s,r,q,p,o
A.aa(b,"start")
s=c==null
r=!s
if(r){q=c-b
if(q<0)throw A.e(A.a4(c,b,null,"end",null))
if(q===0)return""}if(Array.isArray(a)){p=a
o=p.length
if(s)c=o
return A.qA(b>0||c<o?p.slice(b,c):p)}if(t.ho.b(a))return A.vc(a,b,c)
if(r)a=J.iv(a,c)
if(b>0)a=J.d0(a,b)
s=A.a1(a,t.S)
return A.qA(s)},
vc(a,b,c){var s=a.length
if(b>=s)return""
return A.uW(a,b,c==null||c>s?s:c)},
hm(a){return new A.dk(a,A.ql(a,!1,!0,!1,!1,""))},
qI(a,b,c){var s=J.G(b)
if(!s.m())return a
if(c.length===0){do a+=A.t(s.gp())
while(s.m())}else{a+=A.t(s.gp())
while(s.m())a=a+c+A.t(s.gp())}return a},
vZ(a,b,c,d){var s,r,q,p,o,n="0123456789ABCDEF"
if(c===B.y){s=$.t0()
s=s.b.test(b)}else s=!1
if(s)return b
r=B.ar.cg(b)
for(s=r.length,q=0,p="";q<s;++q){o=r[q]
if(o<128&&("\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u03f6\x00\u0404\u03f4 \u03f4\u03f6\u01f6\u01f6\u03f6\u03fc\u01f4\u03ff\u03ff\u0584\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u05d4\u01f4\x00\u01f4\x00\u0504\u05c4\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u0400\x00\u0400\u0200\u03f7\u0200\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u0200\u0200\u0200\u03f7\x00".charCodeAt(o)&a)!==0)p+=A.Q(o)
else p=p+"%"+n[o>>>4&15]+n[o&15]}return p.charCodeAt(0)==0?p:p},
qH(){return A.cg(new Error())},
tV(a,b,c){var s,r
for(s=0;s<3;++s){r=a[s]
if(r.b===b)return r}throw A.e(A.ix(b,"name","No enum value with that name"))},
fP(a){if(typeof a=="number"||A.H(a)||a==null)return J.bc(a)
if(typeof a=="string")return JSON.stringify(a)
return A.qz(a)},
tX(a,b){A.cf(a,"error",t.K)
A.cf(b,"stackTrace",t.l)
A.tW(a,b)},
fs(a){return new A.fr(a)},
aQ(a,b){return new A.aX(!1,null,b,a)},
ix(a,b,c){return new A.aX(!0,a,b,c)},
bO(a,b,c){return a},
qC(a,b){return new A.eB(null,null,!0,a,b,"Value not in range")},
a4(a,b,c,d,e){return new A.eB(b,c,!0,a,d,"Invalid value")},
uX(a,b,c,d){if(a<b||a>c)throw A.e(A.a4(a,b,c,d,null))
return a},
aB(a,b,c){if(0>a||a>c)throw A.e(A.a4(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.e(A.a4(b,a,c,"end",null))
return b}return c},
aa(a,b){if(a<0)throw A.e(A.a4(a,0,null,b,null))
return a},
jv(a,b,c,d){return new A.fX(b,!0,a,d,"Index out of range")},
as(a){return new A.eQ(a)},
qS(a){return new A.hK(a)},
cG(a){return new A.c6(a)},
a7(a){return new A.fC(a)},
j8(a,b,c){return new A.ee(a,b,c)},
up(a,b,c){var s,r
if(A.pp(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.b([],t.s)
B.a.k($.aO,a)
try{A.wI(a,s)}finally{if(0>=$.aO.length)return A.a($.aO,-1)
$.aO.pop()}r=A.qI(b,t.e7.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
oK(a,b,c){var s,r
if(A.pp(a))return b+"..."+c
s=new A.b6(b)
B.a.k($.aO,a)
try{r=s
r.a=A.qI(r.a,a,", ")}finally{if(0>=$.aO.length)return A.a($.aO,-1)
$.aO.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
wI(a,b){var s,r,q,p,o,n,m,l=a.gt(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.m())return
s=A.t(l.gp())
B.a.k(b,s)
k+=s.length+2;++j}if(!l.m()){if(j<=5)return
if(0>=b.length)return A.a(b,-1)
r=b.pop()
if(0>=b.length)return A.a(b,-1)
q=b.pop()}else{p=l.gp();++j
if(!l.m()){if(j<=4){B.a.k(b,A.t(p))
return}r=A.t(p)
if(0>=b.length)return A.a(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gp();++j
for(;l.m();p=o,o=n){n=l.gp();++j
if(j>100){for(;;){if(!(k>75&&j>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2;--j}B.a.k(b,"...")
return}}q=A.t(p)
r=A.t(o)
k+=r.length+q.length+4}}if(j>b.length+2){k+=5
m="..."}else m=null
for(;;){if(!(k>80&&b.length>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2
if(m==null){k+=5
m="..."}}if(m!=null)B.a.k(b,m)
B.a.k(b,q)
B.a.k(b,r)},
qs(a,b,c,d,e){return new A.ck(a,b.i("@<0>").G(c).G(d).G(e).i("ck<1,2,3,4>"))},
oV(a,b,c,d){var s
if(B.I===c){s=B.b.gR(a)
b=J.bb(b)
return A.kF(A.bD(A.bD($.is(),s),b))}if(B.I===d){s=B.b.gR(a)
b=J.bb(b)
c=J.bb(c)
return A.kF(A.bD(A.bD(A.bD($.is(),s),b),c))}s=B.b.gR(a)
b=J.bb(b)
c=J.bb(c)
d=J.bb(d)
d=A.kF(A.bD(A.bD(A.bD(A.bD($.is(),s),b),c),d))
return d},
uL(a){var s,r,q=$.is()
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.h)(a),++r)q=A.bD(q,J.bb(a[r]))
return A.kF(q)},
v2(a){return new A.ar(a)},
wg(a,b){return 65536+((a&1023)<<10)+(b&1023)},
be:function be(a){this.a=a},
hX:function hX(){},
W:function W(){},
fr:function fr(a){this.a=a},
bE:function bE(){},
aX:function aX(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
eB:function eB(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
fX:function fX(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
eQ:function eQ(a){this.a=a},
hK:function hK(a){this.a=a},
c6:function c6(a){this.a=a},
fC:function fC(a){this.a=a},
he:function he(){},
eJ:function eJ(){},
lg:function lg(a){this.a=a},
ee:function ee(a,b,c){this.a=a
this.b=b
this.c=c},
f:function f(){},
a9:function a9(a,b,c){this.a=a
this.b=b
this.$ti=c},
ad:function ad(){},
m:function m(){},
ij:function ij(){},
ar:function ar(a){this.a=a},
dw:function dw(a){var _=this
_.a=a
_.c=_.b=0
_.d=-1},
b6:function b6(a){this.a=a},
rh(a,b,c,d){if(a)return""+d+"-"+c+"-begin"
if(b)return""+d+"-"+c+"-end"
return c},
rq(a){var s=$.dM.h(0,a)
if(s==null)return a
return a+"-"+A.t(s)},
wi(a){var s,r
if(!$.dM.J(a))return
s=$.dM.h(0,a)
s.toString
r=s-1
s=$.dM
if(r<=0)s.ar(0,a)
else s.n(0,a,r)},
wZ(a,b,c,d,e){var s,r,q,p,o,n
if(c===9||c===11||c===10)return
if($.dO>1e4&&$.dM.a===0){$.fo().clearMarks()
$.fo().clearMeasures()
$.dO=0}s=c===1||c===5
r=c===2||c===7
q=A.rh(s,r,d,a)
if(s){p=$.dM.h(0,q)
if(p==null)p=0
$.dM.n(0,q,p+1)
q=A.rq(q)}o=$.fo()
o.toString
o.mark(q,A.aV($.t7().parse(e)))
$.dO=$.dO+1
if(r){n=A.rh(!0,!1,d,a)
o=$.fo()
o.toString
o.measure(d,A.rq(n),q)
$.dO=$.dO+1
A.wi(n)}B.b.E($.dO,0,10001)},
qO(a,b){if($.fo()==null)return
A.wZ(0,-1,4,a,A.w3(b))},
w3(a){var s=a.a
if(s===0)return"{}"
return B.e.hx(a)},
nH:function nH(){},
mi:function mi(){},
jM:function jM(a){this.a=a},
wd(a,b,c){t.Z.a(a)
if(A.E(c)>=1)return a.$1(b)
return a.$0()},
pv(a,b){var s=new A.L($.J,b.i("L<0>")),r=new A.eU(s,b.i("eU<0>"))
a.then(A.dT(new A.ok(r,b),1),A.dT(new A.ol(r),1))
return s},
ok:function ok(a,b){this.a=a
this.b=b},
ol:function ol(a){this.a=a},
c9:function c9(a,b){this.a=a
this.b=b},
q4(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g=b.length,f=g!==0
if(f){if(0>=g)return A.a(b,0)
s=b[0]*2}else s=a.length
r=A.q2(a,0,s,2,null,!0)
q=A.b([],t.t)
if(r!=null){g=r.e
g===$&&A.v()
p=r.d
p===$&&A.v()
p=g===p
g=p}else g=!0
if(g)return q
if(f)r=A.tK(a,b,r,2)
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
h=5e-324}A.fL(r,q,2,l,m,h,-2147483648)
return q},
fL(a,b,c,d,e,f,g){var s,r,q,p,o
if(a==null)return
s=g===-2147483648
if(s&&f!==5e-324)A.tN(a,d,e,f)
r=f!==5e-324
q=a
for(;;){p=a.d
p===$&&A.v()
o=a.e
o===$&&A.v()
if(!(p!==o))break
A:{if(r?A.tQ(a,d,e,f):A.tP(a)){B.a.k(b,B.b.a9(p.a,c))
B.a.k(b,B.b.a9(a.a,c))
B.a.k(b,B.b.a9(o.a,c))
A.fN(a)
p=o.e
p===$&&A.v()
q=p
a=q
break A}if(o===q){if(s)A.fL(A.cm(o,null),b,c,d,e,f,1)
else if(g===1){s=A.cm(o,null)
s.toString
A.fL(A.tJ(s,b,c),b,c,d,e,f,2)}else if(g===2)A.tU(o,b,c,d,e,f)
break}a=o}}},
tU(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k=-2147483648,j=a
do{s=j.e
s===$&&A.v()
s=s.e
s===$&&A.v()
r=j.a
q=j.b
p=j.c
o=s
for(;;){s=j.d
s===$&&A.v()
if(!(o!==s))break
n=o.a
m=!1
if(r!==n)if(j.e.a!==n)if(s.a!==n)if(!A.tO(j,o)){s=!1
if(A.fM(j,o))if(A.fM(o,j))if(A.tR(j,o)){s=j.d
n=o.d
n===$&&A.v()
s=A.a5(s,j,n)!==0||A.a5(j,n,o)!==0}if(!s)if(q===o.b&&p===o.c)if(A.a5(j.d,j,j.e)>0){s=o.d
s===$&&A.v()
n=o.e
n===$&&A.v()
n=A.a5(s,o,n)>0
s=n}else s=m
else s=m
else s=!0}else s=m
else s=m
else s=m
else s=m
if(s){l=A.q3(j,o)
s=A.cm(j,j.e)
s.toString
r=l.e
r===$&&A.v()
r=A.cm(l,r)
r.toString
A.fL(s,b,c,d,e,f,k)
A.fL(r,b,c,d,e,f,k)
return}s=o.e
s===$&&A.v()
o=s}j=j.e}while(j!==a)},
tR(a,b){var s,r,q,p,o=(a.b+b.b)/2,n=(a.c+b.c)/2,m=a,l=!1
do{s=m.c
r=m.e
r===$&&A.v()
q=r.c
if(s>n!==q>n){p=m.b
p=o<(r.b-p)*(n-s)/(q-s)+p
s=p}else s=!1
if(s)l=!l
if(r!==a){m=r
continue}else break}while(!0)
return l},
tO(a,b){var s,r,q,p=a.a,o=b.a,n=a
do{s=n.a
if(s!==p){r=n.e
r===$&&A.v()
q=r.a
s=q!==p&&s!==o&&q!==o&&A.q1(n,r,a,b)}else s=!1
if(s)return!0
s=n.e
s===$&&A.v()
if(s!==a){n=s
continue}else break}while(!0)
return!1},
q1(a,b,c,d){var s,r,q,p,o=a.b,n=c.b
if(!(o===n&&a.c===c.c&&b.b===d.b&&b.c===d.c))o=o===d.b&&a.c===d.c&&n===b.b&&c.c===b.c
else o=!0
if(o)return!0
o=A.a5(a,b,c)
if(o>0)s=1
else s=o<0?-1:0
o=A.a5(a,b,d)
if(o>0)r=1
else r=o<0?-1:0
o=A.a5(c,d,a)
if(o>0)q=1
else q=o<0?-1:0
o=A.a5(c,d,b)
if(o>0)p=1
else p=o<0?-1:0
if(s!==r&&q!==p)return!0
if(s===0&&A.j_(a,c,b))return!0
if(r===0&&A.j_(a,d,b))return!0
if(q===0&&A.j_(c,a,d))return!0
if(p===0&&A.j_(c,b,d))return!0
return!1},
j_(a,b,c){var s=b.b,r=a.b,q=c.b,p=!1
if(s<=Math.max(r,q))if(s>=Math.min(r,q)){s=b.c
r=a.c
q=c.c
s=s<=Math.max(r,q)&&s>=Math.min(r,q)}else s=p
else s=p
return s},
tJ(a,b,c){var s,r,q,p=a
do{s=p.d
s===$&&A.v()
r=p.e
r===$&&A.v()
q=r.e
q===$&&A.v()
if(!(s.b===q.b&&s.c===q.c)&&A.q1(s,p,r,q)&&A.fM(s,q)&&A.fM(q,s)){B.a.k(b,B.b.a9(s.a,c))
B.a.k(b,B.b.a9(p.a,c))
B.a.k(b,B.b.a9(q.a,c))
A.fN(p)
A.fN(p.e)
p=q
a=p}s=p.e
s===$&&A.v()
if(s!==a){p=s
continue}else break}while(!0)
return A.cm(s,null)},
tP(a){var s,r,q,p,o,n,m,l,k,j=a.d
j===$&&A.v()
s=a.e
s===$&&A.v()
if(A.a5(j,a,s)>=0)return!1
r=s.e
r===$&&A.v()
for(q=j.b,p=j.c,o=a.b,n=a.c,m=s.b,s=s.c,l=r;l!==j;l=r){if(A.e6(q,p,o,n,m,s,l.b,l.c)){r=l.d
r===$&&A.v()
k=l.e
k===$&&A.v()
k=A.a5(r,l,k)>=0
r=k}else r=!1
if(r)return!1
r=l.e
r===$&&A.v()}return!0},
tQ(a,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a.d
b===$&&A.v()
s=a.e
s===$&&A.v()
if(A.a5(b,a,s)>=0)return!1
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
j=A.oI(o,m,a0,a1,a2)
i=A.oI(l,k,a0,a1,a2)
h=a.w
g=a.x
f=a.d
e=a.e
for(;;){if(!(h!=null&&h.f>=j&&g!=null&&g.f<=i))break
d=!1
if(h!==f)if(h!==e)if(A.e6(r,b,q,n,p,s,h.b,h.c)){d=h.d
d===$&&A.v()
c=h.e
c===$&&A.v()
c=A.a5(d,h,c)>=0
d=c}if(d)return!1
h=h.w
d=!1
if(g!==f)if(g!==e)if(A.e6(r,b,q,n,p,s,g.b,g.c)){d=g.d
d===$&&A.v()
c=g.e
c===$&&A.v()
c=A.a5(d,g,c)>=0
d=c}if(d)return!1
g=g.x}for(;;){if(!(h!=null&&h.f>=j))break
d=!1
if(h!==f)if(h!==e)if(A.e6(r,b,q,n,p,s,h.b,h.c)){d=h.d
d===$&&A.v()
c=h.e
c===$&&A.v()
c=A.a5(d,h,c)>=0
d=c}if(d)return!1
h=h.w}for(;;){if(!(g!=null&&g.f<=i))break
d=!1
if(g!==f)if(g!==e)if(A.e6(r,b,q,n,p,s,g.b,g.c)){d=g.d
d===$&&A.v()
c=g.e
c===$&&A.v()
c=A.a5(d,g,c)>=0
d=c}if(d)return!1
g=g.x}return!0},
oI(a,b,c,d,e){var s=B.c.K(32767*(a-c)*e),r=B.c.K(32767*(b-d)*e)
s=(s|s<<8)&16711935
s=(s|s<<4)&252645135
s=(s|s<<2)&858993459
r=(r|r<<8)&16711935
r=(r|r<<4)&252645135
r=(r|r<<2)&858993459
return((s|s<<1)&1431655765|((r|r<<1)&1431655765)<<1)>>>0},
tN(a,b,c,d){var s,r=a
do{if(r.f===5e-324)r.f=A.oI(r.b,r.c,b,c,d)
s=r.d
s===$&&A.v()
r.w=s
s=r.e
s===$&&A.v()
r.x=s
if(s!==a){r=s
continue}else break}while(!0)
s.w=s.w.x=null
A.tT(s)},
tT(a){var s,r,q,p,o,n,m,l,k,j,i,h=1
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
tK(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=A.b([],t.eB),e=b.length
for(s=a.length,r=e-1,q=0;q<e;q=l){p=b.length
if(!(q<p))return A.a(b,q)
o=b[q]
if(q<r){n=q+1
if(!(n<p))return A.a(b,n)
m=b[n]*d}else m=s
l=q+1
k=A.q2(a,o*d,m,d,l,!1)
p=k==null
if(p)o=null
else{o=k.e
o===$&&A.v()}if(k==o)if(!p)k.r=!0
k.toString
B.a.k(f,A.tM(k))}B.a.aC(f,new A.iZ())
for(r=f.length,j=0;j<f.length;f.length===r||(0,A.h)(f),++j,c=p){i=f[j]
h=A.tL(i,c)
if(h!=null){g=A.q3(h,i)
p=h.e
p===$&&A.v()
A.cm(h,p)
p=g.e
p===$&&A.v()
A.cm(g,p)}p=c.e
p===$&&A.v()
p=A.cm(c,p)
p.toString}return c},
cm(a,b){var s,r,q,p,o,n,m,l
if(b==null)b=a
s=a
do{r=s.d
r===$&&A.v()
q=r.y
p=s.y
o=s.e
o===$&&A.v()
n=o.y
m=!1
if(!s.r){l=s.b
if(!(l===o.b&&s.c===o.c))l=r.b===l&&r.c===s.c
else l=!0
if(l)m=!0
else if(q!=null||q!==0||n!=null||n!==0||q==n||q!=p)m=A.a5(r,s,o)===0}if(m){A.fN(s)
s=s.d
r=s.e
r===$&&A.v()
if(s===r){b=s
break}b=s}else s=o}while(m||s!==b)
return b},
a5(a,b,c){var s=b.c,r=b.b
return(s-a.c)*(c.b-r)-(r-a.b)*(c.c-s)},
q3(a,b){var s,r=A.p2(a.a,a.b,a.c),q=A.p2(b.a,b.b,b.c),p=a.e
p===$&&A.v()
s=b.d
s===$&&A.v()
r.y=a.y
q.y=b.y
a.e=b
b.d=a
r.e=p
q.e=p.d=r
s.e=r.d=q
q.d=s
return q},
tL(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=a.b,g=a.c,f=b,e=-17976931348623157e292,d=null
do{s=f.c
if(g<=s){r=f.e
r===$&&A.v()
r=g>=r.c}else r=!1
if(r){r=f.b
q=f.e
q===$&&A.v()
p=q.b
o=q.c
n=r+(g-s)*(p-r)/(o-s)
if(n<=h&&n>e){if(n===h){if(g===s)return f
if(g===o)return q}if(r<p)d=f
else d=q
e=n}}s=f.e
s===$&&A.v()
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
p=A.e6(q,g,m,l,p,g,r,f.c)
q=p}if(q){i=Math.abs(g-f.c)/(h-r)
q=!1
if(A.fM(f,a))if(!(i<j))if(i===j){p=k.b
if(!(r>p))if(r===p){r=k.d
r===$&&A.v()
p=f.d
p===$&&A.v()
if(A.a5(r,k,p)<0){r=f.e
r===$&&A.v()
q=k.e
q===$&&A.v()
q=A.a5(r,k,q)<0
r=q}else r=q}else r=q
else r=!0}else r=q
else r=!0
else r=q
if(r){j=i
k=f}}r=f.e
r===$&&A.v()
if(r!==d){f=r
continue}else break}while(!0)
return k},
fM(a,b){var s,r=a.d
r===$&&A.v()
s=a.e
s===$&&A.v()
if(A.a5(r,a,s)<0)r=A.a5(a,b,s)>=0&&A.a5(a,r,b)>=0
else r=A.a5(a,b,r)<0||A.a5(a,s,b)<0
return r},
e6(a,b,c,d,e,f,g,h){var s,r,q=e-g,p=b-h,o=a-g,n=f-h
if(q*p-o*n>=0){s=d-h
r=c-g
q=o*s-r*p>=0&&r*n-q*s>=0}else q=!1
return q},
tM(a){var s,r,q=a,p=q
do{s=p.b
r=q.b
if(!(s<r))s=s===r&&p.c<q.c
else s=!0
if(s)q=p
s=p.e
s===$&&A.v()
if(s!==a){p=s
continue}else break}while(!0)
return q},
q2(a,b,c,d,e,f){var s,r,q,p,o=null
if(f===A.tS(a,b,c,d)>0)for(s=a.length,r=b;r<c;r+=d){if(!(r>=0&&r<s))return A.a(a,r)
q=a[r]
p=r+1
if(!(p<s))return A.a(a,p)
o=A.q0(r,q,a[p],o)
o.y=e}else for(r=c-d,s=a.length;r>=b;r-=d){if(!(r>=0&&r<s))return A.a(a,r)
q=a[r]
p=r+1
if(!(p<s))return A.a(a,p)
o=A.q0(r,q,a[p],o)
o.y=e}if(o!=null){s=o.e
s===$&&A.v()
s=o.b===s.b&&o.c===s.c}else s=!1
if(s){A.fN(o)
s=o.e
s===$&&A.v()
s.y=e
o=s}return o},
fN(a){var s,r=a.e
r===$&&A.v()
s=a.d
s===$&&A.v()
r.d=s
a.d.e=r
r=a.w
if(r!=null)r.x=a.x
s=a.x
if(s!=null)s.w=r},
q0(a,b,c,d){var s,r=A.p2(a,b,c)
if(d==null){r.d=r
r.e=r}else{s=d.e
s===$&&A.v()
r.e=s
r.d=d
d.e=d.e.d=r}return r},
tS(a,b,c,d){var s,r,q,p,o,n,m,l,k=c-d
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
p2(a,b,c){return new A.bL(a,b,c)},
iZ:function iZ(){},
bL:function bL(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.e=_.d=$
_.f=5e-324
_.r=!1
_.y=_.x=_.w=null},
c3:function c3(a,b){var _=this
_.a=a
_.b=b
_.ax=_.Q=_.f=_.e=_.d=_.c=null
_.ay=!1
_.cx=_.CW=_.ch=null},
v4(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e="read of 4 byte(s) at ",d=J.pK(B.j.gaq(a),a.byteOffset,a.byteLength),c=new A.o(d,0)
if(d.byteLength<12)throw A.e(B.aK)
c.l(0,4)
s=d.getUint32(0,!1)
if(s===1953784678){c.l(8,4)
r=d.getUint32(8,!1)
if(b>=r)throw A.e(A.i("font index "+b+" out of range in a "+r+"-font collection"))
q=12+b*4
c.l(q,4)
p=d.getUint32(q,!1)
c.l(p,4)
s=d.getUint32(p,!1)}else p=0
if(s!==65536&&s!==1953658213&&s!==1330926671)throw A.e(A.i("unrecognised sfntVersion 0x"+B.d.e2(B.b.ba(s,16),8,"0")))
q=p+4
c.l(q,2)
o=d.getUint16(q,!1)
n=A.C(t.S,t.l1)
for(q=p+12,m=0;m<o;++m){l=q+m*16
k=l+4<=d.byteLength
if(!k)A.p(A.i(e+l+" overruns a "+c.gj(0)+"-byte font"))
j=d.getUint32(l,!1)
k=l+8
i=k+4<=d.byteLength
if(!i)A.p(A.i(e+k+" overruns a "+c.gj(0)+"-byte font"))
h=d.getUint32(k,!1)
k=l+12
i=k+4<=d.byteLength
if(!i)A.p(A.i(e+k+" overruns a "+c.gj(0)+"-byte font"))
g=d.getUint32(k,!1)
k=d.byteLength
if(h>=k)throw A.e(A.i("table "+A.aD(A.cH(j))+" starts at "+h+", past the "+c.gj(0)+"-byte file"))
f=h+g>k?k-h:g
i=l+4
k=i+4<=k
if(!k)A.p(A.i(e+i+" overruns a "+c.gj(0)+"-byte font"))
d.getUint32(i,!1)
n.n(0,j,new A.hB(j,h,f))}return new A.kc(c,n)},
hB:function hB(a,b,c){this.a=a
this.c=b
this.d=c},
kc:function kc(a,b){this.a=a
this.c=b},
e4(a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b="read of 2 byte(s) at ",a=a0.b
if(!a0.X(a,4))throw A.e(B.aG)
s=a+2
a0.l(s,2)
r=a0.a
q=r.getUint16(s,!1)
s=a+4
if(!a0.X(s,q*8))throw A.e(A.i("cmap claims "+q+" encoding records it does not contain"))
p=A.b([],t.ig)
for(o=0;o<q;++o){n=s+o*8
m=n+4
if(m>=0)l=m+4<=r.byteLength
else l=!1
if(!l)A.p(A.i("read of 4 byte(s) at "+m+" overruns a "+a0.gj(0)+"-byte font"))
k=a+r.getUint32(m,!1)
m=k>=0
if(m)l=k+2<=r.byteLength
else l=!1
if(!l)continue
if(n>=0)l=n+2<=r.byteLength
else l=!1
if(!l)A.p(A.i(b+n+" overruns a "+a0.gj(0)+"-byte font"))
l=r.getUint16(n,!1)
j=n+2
if(j>=0)i=j+2<=r.byteLength
else i=!1
if(!i)A.p(A.i(b+j+" overruns a "+a0.gj(0)+"-byte font"))
j=r.getUint16(j,!1)
if(m)m=k+2<=r.byteLength
else m=!1
if(!m)A.p(A.i(b+k+" overruns a "+a0.gj(0)+"-byte font"))
B.a.k(p,new A.br(l,j,k,r.getUint16(k,!1)))}if(p.length===0)throw A.e(B.aM)
s=t.aq
h=A.a1(p,s)
B.a.aC(h,new A.iT())
r=h.length
e=0
for(;;){if(!(e<h.length)){g=null
f=null
break}A:{d=h[e]
c=A.tE(a0,d.c)
if(c==null)break A
f=d
g=c
break}h.length===r||(0,A.h)(h);++e}if(g==null||f==null)throw A.e(B.aI)
for(r=p.length,e=0;e<r;++e){d=p[e]
if(d.d===14){A.vz(a0,d.c)
break}}A.oR(p,s)
return new A.iS(g,f)},
tE(a,b){if(!a.X(b,2))return null
a.l(b,2)
switch(a.a.getUint16(b,!1)){case 0:return A.vy(a,b)
case 4:return A.vA(a,b)
case 6:return A.vB(a,b)
case 12:return A.qW(a,b,!1)
case 13:return A.qW(a,b,!0)
default:return null}},
vy(a,b){var s,r
if(!a.X(b,262))return null
s=b+6
a.l(s,256)
r=a.a
return new A.i_(J.pM(B.cZ.gaq(r),r.byteOffset+s,256))},
vA(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
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
j=new A.o(r,n).a1(o)
i=new A.o(r,m).a1(o)
h=new A.o(r,l).a1(o)
g=new A.o(r,k).a1(o)
f=b+q
if(f<k+p)f=r.byteLength
s=r.byteLength
return new A.i1(j,i,h,g,k,a,f>s?s:f)},
vB(a,b){var s,r,q,p
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
return new A.i2(q,new A.o(r,s).a1(p))},
qW(a,b,c){var s,r,q,p,o,n,m,l,k,j,i="read of 4 byte(s) at "
if(!a.X(b,16))return null
s=b+12
a.l(s,4)
r=a.a
q=r.getUint32(s,!1)
if(q>B.b.N(r.byteLength-b-16,12))return null
p=new Uint32Array(q)
o=new Uint32Array(q)
n=new Uint32Array(q)
for(s=b+16,m=0;m<q;++m){l=s+m*12
if(l>=0)k=l+4<=r.byteLength
else k=!1
if(!k)A.p(A.i(i+l+" overruns a "+a.gj(0)+"-byte font"))
k=r.getUint32(l,!1)
if(!(m<q))return A.a(p,m)
p[m]=k
k=l+4
if(k>=0)j=k+4<=r.byteLength
else j=!1
if(!j)A.p(A.i(i+k+" overruns a "+a.gj(0)+"-byte font"))
k=r.getUint32(k,!1)
if(!(m<q))return A.a(o,m)
o[m]=k
k=l+8
if(k>=0)j=k+4<=r.byteLength
else j=!1
if(!j)A.p(A.i(i+k+" overruns a "+a.gj(0)+"-byte font"))
k=r.getUint32(k,!1)
if(!(m<q))return A.a(n,m)
n[m]=k}return new A.i0(p,o,n,c)},
vz(a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5="read of 4 byte(s) at "
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
p[k]=a6.cC(j)
i=j+3
if(i>=0)h=i+4<=r.byteLength
else h=!1
if(!h)A.p(A.i(a5+i+" overruns a "+a6.gj(0)+"-byte font"))
g=r.getUint32(i,!1)
i=j+7
if(i>=0)h=i+4<=r.byteLength
else h=!1
if(!h)A.p(A.i(a5+i+" overruns a "+a6.gj(0)+"-byte font"))
f=r.getUint32(i,!1)
e=A.b([],l)
if(g!==0){d=a7+g
i=d>=0
if(i)h=d+4<=r.byteLength
else h=!1
if(h){if(i)i=d+4<=r.byteLength
else i=!1
if(!i)A.p(A.i(a5+d+" overruns a "+a6.gj(0)+"-byte font"))
c=r.getUint32(d,!1)
i=d+4
if(i>=0)h=i+c*4<=r.byteLength
else h=!1
if(h)for(b=0;b<c;++b){a=i+b*4
a0=a6.cC(a)
B.a.k(e,a0)
h=a+3
if(h>=0)a1=h+1<=r.byteLength
else a1=!1
if(!a1)A.p(A.i("read of 1 byte(s) at "+h+" overruns a "+a6.gj(0)+"-byte font"))
B.a.k(e,a0+r.getUint8(h))}}}B.a.k(o,e)
a2=A.C(m,m)
if(f!==0){a3=a7+f
i=a3>=0
if(i)h=a3+4<=r.byteLength
else h=!1
if(h){if(i)i=a3+4<=r.byteLength
else i=!1
if(!i)A.p(A.i(a5+a3+" overruns a "+a6.gj(0)+"-byte font"))
a4=r.getUint32(a3,!1)
i=a3+4
if(i>=0)h=i+a4*5<=r.byteLength
else h=!1
if(h)for(b=0;b<a4;++b){a=i+b*5
h=a6.cC(a)
a+=3
if(a>=0)a1=a+2<=r.byteLength
else a1=!1
if(!a1)A.p(A.i("read of 2 byte(s) at "+a+" overruns a "+a6.gj(0)+"-byte font"))
a2.n(0,h,r.getUint16(a,!1))}}}B.a.k(n,a2)}return new A.lh()},
iS:function iS(a,b){this.a=a
this.d=b},
iT:function iT(){},
br:function br(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
i_:function i_(a){this.a=a},
i1:function i1(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
i2:function i2(a,b){this.a=a
this.b=b},
i0:function i0(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
lh:function lh(){},
ui(a){var s,r,q,p,o,n,m,l,k,j=a.b
if(!a.X(j,54))throw A.e(B.a2)
s=j+12
a.l(s,4)
r=a.a
q=r.getUint32(s,!1)
if(q!==1594834165)throw A.e(A.i("head.magicNumber is 0x"+B.b.ba(q,16)+", not 0x5F0F3CF5"))
s=j+18
a.l(s,2)
p=r.getUint16(s,!1)
if(p<16||p>16384)throw A.e(A.i("head.unitsPerEm "+p+" is outside the legal 16\u202616384"))
s=j+50
a.l(s,2)
o=r.getInt16(s,!1)
if(o!==0&&o!==1)throw A.e(A.i("head.indexToLocFormat "+o+" is neither short nor long"))
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
A.jq(a,j+20)
A.jq(a,j+28)
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
return new A.fU(p,s,n,m,l,o)},
jq(a,b){var s,r,q
a.l(b,4)
s=a.a
r=s.getUint32(b,!1)
q=b+4
a.l(q,4)
return r*4294967296+s.getUint32(q,!1)},
fU:function fU(a,b,c,d,e,f){var _=this
_.f=a
_.x=b
_.y=c
_.z=d
_.Q=e
_.ay=f},
uk(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d="read of 2 byte(s) at "
if(c<1&&b>0)throw A.e(B.aL)
s=c>b?b:c
r=a.b
q=s*4
if(!a.X(r,q))throw A.e(A.i("hmtx holds fewer than the "+s+" metric pairs hhea promises"))
p=new Uint16Array(s)
o=new Int16Array(s)
for(n=a.a,m=0;m<s;++m){l=r+m*4
if(l>=0)k=l+2<=n.byteLength
else k=!1
if(!k)A.p(A.i(d+l+" overruns a "+a.gj(0)+"-byte font"))
k=n.getUint16(l,!1)
if(!(m<s))return A.a(p,m)
p[m]=k
k=l+2
if(k>=0)j=k+2<=n.byteLength
else j=!1
if(!j)A.p(A.i(d+k+" overruns a "+a.gj(0)+"-byte font"))
k=n.getInt16(k,!1)
if(!(m<s))return A.a(o,m)
o[m]=k}i=r+q
h=b-s
g=n.byteLength
f=B.b.E(B.b.N(g-i,2),0,h)
e=new Int16Array(h)
for(m=0;m<f;++m){q=i+m*2
if(q>=0)k=q+2<=n.byteLength
else k=!1
if(!k)A.p(A.i(d+q+" overruns a "+a.gj(0)+"-byte font"))
q=n.getInt16(q,!1)
if(!(m<h))return A.a(e,m)
e[m]=q}return new A.js(p,e)},
js:function js(a,b){this.a=a
this.c=b},
tq(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e="read of 2 byte(s) at ",d=a.b
a.l(d,2)
s=a.a
r=s.getUint16(d,!1)
if(r!==1&&r!==2)throw A.e(A.i("avar version "+r+" is not 1 or 2"))
q=d+6
a.l(q,2)
p=s.getUint16(q,!1)
o=d+8
n=A.b([],t.iQ)
for(q=t.c5,m=0;m<p;++m){if(o>=0)l=o+2<=s.byteLength
else l=!1
if(!l)A.p(A.i(e+o+" overruns a "+a.gj(0)+"-byte font"))
k=s.getUint16(o,!1)
o+=2
l=k*4
if(o>=0)j=o+l<=s.byteLength
else j=!1
if(!j)throw A.e(B.aC)
i=J.aR(k,q)
for(h=0;h<k;++h){j=o+h*4
if(j>=0)g=j+2<=s.byteLength
else g=!1
if(!g)A.p(A.i(e+j+" overruns a "+a.gj(0)+"-byte font"))
g=s.getInt16(j,!1)
j+=2
if(j>=0)f=j+2<=s.byteLength
else f=!1
if(!f)A.p(A.i(e+j+" overruns a "+a.gj(0)+"-byte font"))
i[h]=new A.e_(g/16384,s.getInt16(j,!1)/16384)}o+=l
B.a.k(n,i)}if(r===2&&a.X(o,8)){a.l(o,4)
if(s.getUint32(o,!1)===0){q=o+4
a.l(q,4)
s.getUint32(q,!1)}}return new A.iy(n)},
e_:function e_(a,b){this.a=a
this.b=b},
iy:function iy(a){this.b=a},
u1(a){var s,r,q,p,o,n,m,l,k,j,i,h=a.b
a.l(h,2)
s=a.a
r=s.getUint16(h,!1)
if(r!==1)throw A.e(A.i("fvar version "+r+" is not 1"))
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
if(n<20)throw A.e(A.i("fvar axisSize "+n+" is below 20"))
s=o*4
if(l<s+4)throw A.e(A.i("fvar instanceSize "+l+" is too small"))
k=h+p
q=o*n
if(!a.X(k,q))throw A.e(B.aF)
j=A.eo(o,new A.jb(k,n,a),!1,t.l0)
i=k+q
if(!a.X(i,m*l))throw A.e(B.aH)
A.eo(m,new A.jc(i,l,l>=s+6,a,o),!1,t.h7)
return new A.dh(j)},
dB:function dB(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ds:function ds(a){this.a=a},
dh:function dh(a){this.a=a},
jb:function jb(a,b,c){this.a=a
this.b=b
this.c=c},
jc:function jc(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
qe(a){var s,r,q,p,o,n,m,l,k,j,i=a.b
a.l(i,2)
s=a.a
r=s.getUint16(i,!1)
if(r!==1)throw A.e(A.i("ItemVariationStore format "+r))
q=i+2
a.l(q,4)
p=s.getUint32(q,!1)
q=i+6
a.l(q,2)
o=s.getUint16(q,!1)
n=A.un(a,i+p)
m=A.b([],t.mc)
for(q=i+8,l=0;l<o;++l){k=q+l*4
if(k>=0)j=k+4<=s.byteLength
else j=!1
if(!j)A.p(A.i("read of 4 byte(s) at "+k+" overruns a "+a.gj(0)+"-byte font"))
B.a.k(m,A.um(a,i+s.getUint32(k,!1),n))}return new A.fZ(a,n,m,null)},
uo(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=a.b
a.l(f,2)
s=a.a
r=s.getUint16(f,!1)
if(r!==1)throw A.e(A.i("HVAR version "+r))
q=f+4
a.l(q,4)
p=A.qe(new A.o(s,f+s.getUint32(q,!1)))
q=f+8
a.l(q,4)
o=s.getUint32(q,!1)
if(o===0)return p
q=f+o
n=new A.o(s,q)
n.l(q,1)
m=s.getUint8(q)
l=m===0
if(!l&&m!==1)A.p(A.i("DeltaSetIndexMap format "+m))
k=q+1
n.l(k,1)
j=s.getUint8(k)
k=q+2
if(l){n.l(k,2)
i=s.getUint16(k,!1)
h=q+4}else{n.l(k,4)
i=s.getUint32(k,!1)
h=q+6}g=(j>>>4&3)+1
if(!n.X(h,i*g))A.p(B.aD)
return new A.fZ(p.a,p.b,p.c,new A.iY(n,h,i,g,(j&15)+1))},
un(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d="read of 2 byte(s) at "
a.l(b,2)
s=a.a
r=s.getUint16(b,!1)
q=b+2
a.l(q,2)
p=s.getUint16(q,!1)
o=r*6
q=b+4
if(!a.X(q,p*o))throw A.e(B.aJ)
n=A.b([],t.fb)
for(m=t.i,l=0;l<p;++l){k=A.T(r,0,!1,m)
j=A.T(r,0,!1,m)
i=A.T(r,0,!1,m)
h=q+l*o
for(g=0;g<r;++g,h+=6){if(h>=0)f=h+2<=s.byteLength
else f=!1
if(!f)A.p(A.i(d+h+" overruns a "+a.gj(0)+"-byte font"))
B.a.n(k,g,s.getInt16(h,!1)/16384)
f=h+2
if(f>=0)e=f+2<=s.byteLength
else e=!1
if(!e)A.p(A.i(d+f+" overruns a "+a.gj(0)+"-byte font"))
B.a.n(j,g,s.getInt16(f,!1)/16384)
f=h+4
if(f>=0)e=f+2<=s.byteLength
else e=!1
if(!e)A.p(A.i(d+f+" overruns a "+a.gj(0)+"-byte font"))
B.a.n(i,g,s.getInt16(f,!1)/16384)}B.a.k(n,new A.ie(k,j,i))}return n},
um(a,b,c){var s,r,q,p,o,n,m,l,k,j
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
if(m>o)throw A.e(A.i("ItemVariationData claims "+m+" wide columns of only "+o))
l=A.eo(o,new A.jw(a,b,c),!1,t.S)
s=o-m
k=n?m*4+s*2:m*2+s
j=b+6+o*2
if(!a.X(j,r*k))throw A.e(B.aE)
return new A.i7(r,l,m,n,j,k)},
ie:function ie(a,b,c){this.a=a
this.b=b
this.c=c},
i7:function i7(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
iY:function iY(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
fZ:function fZ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jw:function jw(a,b,c){this.a=a
this.b=b
this.c=c},
cl(a){var s,r,q,p,o=a.b
a.l(o,2)
s=a.a
r=s.getUint16(o,!1)
switch(r){case 1:q=o+2
a.l(q,2)
p=s.getUint16(q,!1)
q=o+4
a.l(q,2)
return new A.hS(p,new A.o(s,o+6).a1(s.getUint16(q,!1)))
case 2:q=o+2
a.l(q,2)
return new A.hT(new A.o(s,o+4).a1(s.getUint16(q,!1)*3))
default:throw A.e(A.i("unknown ClassDef format "+r))}},
bP:function bP(){},
hR:function hR(){},
hS:function hS(a,b){this.a=a
this.b=b},
hT:function hT(a){this.a=a},
p0(a){var s=a&65535
s-=s>>>1&21845
s=(s&13107)+(B.b.M(s,2)&13107)
return((s+(s>>>4)&3855)*257>>>8&255)*2},
fK(a){var s,r,q,p,o,n,m,l=a.b
a.l(l,2)
s=a.a
r=s.getUint16(l,!1)
q=l+2
a.l(q,2)
p=s.getUint16(q,!1)
q=l+4
a.l(q,2)
o=s.getUint16(q,!1)
if(o===32768)return new A.fJ(r,p,o,$.rO())
if(o<1||o>3)throw A.e(A.i("unknown Device deltaFormat "+o))
n=p>=r?p-r+1:0
m=B.b.bq(16,o)
return new A.fJ(r,p,o,new A.o(s,l+6).a1(B.b.a9(n+m-1,m)))},
iw(a){var s,r,q,p,o,n,m,l=null,k=a.b
a.l(k,2)
s=a.a
r=s.getUint16(k,!1)
q=k+2
a.l(q,2)
p=s.getInt16(q,!1)
q=k+4
a.l(q,2)
o=s.getInt16(q,!1)
switch(r){case 1:return new A.d1(p,o,l,l)
case 2:q=k+6
a.l(q,2)
s.getUint16(q,!1)
return new A.d1(p,o,l,l)
case 3:q=k+6
a.l(q,2)
n=s.getUint16(q,!1)
q=k+8
a.l(q,2)
m=s.getUint16(q,!1)
q=n===0?l:A.fK(new A.o(s,k+n))
return new A.d1(p,o,q,m===0?l:A.fK(new A.o(s,k+m)))
default:throw A.e(A.i("unknown Anchor format "+r))}},
rK(a,b,c){var s,r,q,p,o
if(a!==c)return new A.z(a,b)
s=b.b
b.l(s,2)
r=b.a
q=r.getUint16(s,!1)
if(q!==1)throw A.e(A.i("unknown extension subtable format "+q))
p=s+2
b.l(p,2)
o=r.getUint16(p,!1)
if(o===c)throw A.e(A.i("extension subtable nests another extension"))
p=s+4
b.l(p,4)
return new A.z(o,new A.o(r,s+r.getUint32(p,!1)))},
fJ:function fJ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
d1:function d1(a,b,c,d){var _=this
_.a=a
_.b=b
_.d=c
_.e=d},
V(a){var s,r,q,p=a.b
a.l(p,2)
s=a.a
r=s.getUint16(p,!1)
switch(r){case 1:q=p+2
a.l(q,2)
return new A.hV(new A.o(s,p+4).a1(s.getUint16(q,!1)))
case 2:q=p+2
a.l(q,2)
return new A.hW(new A.o(s,p+4).a1(s.getUint16(q,!1)*3))
default:throw A.e(A.i("unknown Coverage format "+r))}},
bs:function bs(){},
hV:function hV(a){this.a=a},
hW:function hW(a){this.a=a},
u2(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=a.b
a.l(g,2)
s=a.a
r=s.getUint16(g,!1)
q=g+2
a.l(q,2)
p=s.getUint16(q,!1)
if(r!==1)throw A.e(A.i("unsupported GDEF version "+r+"."+p))
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
if(j!==1)throw A.e(A.i("unknown MarkGlyphSets format "+j))
i=k+2
a.l(i,2)
h=A.T(s.getUint16(i,!1),null,!1,t.f1)}else h=null
i=o===0?B.i:A.cl(new A.o(s,g+o))
s=n===0?B.i:A.cl(new A.o(s,g+n))
q=q?0:g+m
return new A.di(a,i,s,q,l===0?0:g+l,h,p)},
di:function di(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.f=e
_.r=f
_.w=g
_.y=null
_.z=!1},
uc(a){var s=A.qn(a)
return new A.cr(s,new A.o(s.a.a,s.b),A.T(s.w.length,null,!1,t.l7))},
q8(a,b){var s,r
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.h)(a),++r)if(a[r].U(b))return!0
return!1},
uf(a,b){var s,r,q,p
for(s=a.a,r=a.b,q=0;q<s.length;++q){if(s[q].f!==3)continue
if(!(q<r.length))return A.a(r,q)
p=r[q]
p.b=p.a=0}},
ue(a){var s,r,q,p
for(s=a.a,r=a.b,q=0;q<s.length;++q){if(s[q].e!==5)continue
if(!(q<r.length))return A.a(r,q)
p=r[q]
p.d=p.c=p.b=p.a=0}},
ud(a){var s,r
for(s=a.a,r=0;r<s.length;++r)A.q9(a,r,64)},
q9(a,b,c){var s,r,q,p,o,n,m,l,k,j=a.b
if(!(b>=0&&b<j.length))return A.a(j,b)
s=j[b]
r=s.e
q=s.f
if(r===0)return
s.e=0
p=b+r
if(p<0||p>=a.a.length)return
if(c===0)return
A.q9(a,p,c-1)
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
if(a.c===B.k)for(l=p+1;l<=b;++l,m=k){if(!(l<s))return A.a(j,l)
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
cr:function cr(a,b,c){this.a=a
this.b=b
this.c=c},
ub(a,b){var s,r,q,p,o,n,m,l=b.b
b.l(l,2)
s=b.a
r=s.getUint16(l,!1)
switch(a){case 1:return A.v9(b,l,r)
case 2:return A.uM(b,l,r)
case 3:if(r!==1)A.p(A.i("unknown CursivePos format "+r))
q=l+2
b.l(q,2)
return new A.fH(b,l,A.V(new A.o(s,l+s.getUint16(q,!1))))
case 4:if(r!==1)A.p(A.i("unknown MarkBasePos format "+r))
q=l+2
b.l(q,2)
q=A.V(new A.o(s,l+s.getUint16(q,!1)))
p=l+4
b.l(p,2)
p=A.V(new A.o(s,l+s.getUint16(p,!1)))
o=l+6
b.l(o,2)
o=s.getUint16(o,!1)
n=l+8
b.l(n,2)
n=s.getUint16(n,!1)
m=l+10
b.l(m,2)
return new A.h6(q,p,o,new A.f0(b,l+n),new A.eT(b,l+s.getUint16(m,!1)))
case 5:if(r!==1)A.p(A.i("unknown MarkLigPos format "+r))
q=l+2
b.l(q,2)
q=A.V(new A.o(s,l+s.getUint16(q,!1)))
p=l+4
b.l(p,2)
p=A.V(new A.o(s,l+s.getUint16(p,!1)))
o=l+6
b.l(o,2)
o=s.getUint16(o,!1)
n=l+8
b.l(n,2)
n=s.getUint16(n,!1)
m=l+10
b.l(m,2)
return new A.h7(b,q,p,o,new A.f0(b,l+n),l+s.getUint16(m,!1))
case 6:if(r!==1)A.p(A.i("unknown MarkMarkPos format "+r))
q=l+2
b.l(q,2)
q=A.V(new A.o(s,l+s.getUint16(q,!1)))
p=l+4
b.l(p,2)
p=A.V(new A.o(s,l+s.getUint16(p,!1)))
o=l+6
b.l(o,2)
o=s.getUint16(o,!1)
n=l+8
b.l(n,2)
n=s.getUint16(n,!1)
m=l+10
b.l(m,2)
return new A.h8(q,p,o,new A.f0(b,l+n),new A.eT(b,l+s.getUint16(m,!1)))
case 7:return A.tG(b,l,r)
case 8:return A.tw(b,l,r)
default:throw A.e(A.i("unknown GPOS lookup type "+a))}},
pk(a,b,c,d,e,f){var s,r,q,p,o,n,m,l={}
if(e===0)return
l.a=d
s=new A.nT(l,b)
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
l=new A.nS(l,b)
if((e&16)!==0){m=l.$0()
if(o&&m!==0)f.c=f.c+a.b5(A.fK(new A.o(b.a,c+m)),!1)}if((e&32)!==0){m=l.$0()
if(n&&m!==0)f.d=f.d+a.b5(A.fK(new A.o(b.a,c+m)),!0)}if((e&64)!==0){m=l.$0()
if(o&&m!==0)f.a=f.a+a.b5(A.fK(new A.o(b.a,c+m)),!1)}if((e&128)!==0)l.$0()},
v9(a,b,c){var s,r,q,p=b+2
a.l(p,2)
s=a.a
r=A.V(new A.o(s,b+s.getUint16(p,!1)))
p=b+4
a.l(p,2)
q=s.getUint16(p,!1)
switch(c){case 1:return new A.eG(a,b,r,q,!0)
case 2:return new A.eG(a,b,r,q,!1)
default:throw A.e(A.i("unknown SinglePos format "+c))}},
uM(a,b,c){var s,r,q,p,o,n,m,l,k,j=b+2
a.l(j,2)
s=a.a
r=A.V(new A.o(s,b+s.getUint16(j,!1)))
j=b+4
a.l(j,2)
q=s.getUint16(j,!1)
j=b+6
a.l(j,2)
p=s.getUint16(j,!1)
switch(c){case 1:return new A.ez(a,b,r,q,p,1,null,null,0,0)
case 2:j=b+8
a.l(j,2)
o=s.getUint16(j,!1)
j=b+10
a.l(j,2)
n=s.getUint16(j,!1)
j=o===0?B.i:A.cl(new A.o(s,b+o))
m=n===0?B.i:A.cl(new A.o(s,b+n))
l=b+12
a.l(l,2)
l=s.getUint16(l,!1)
k=b+14
a.l(k,2)
return new A.ez(a,b,r,q,p,2,j,m,l,s.getUint16(k,!1))
default:throw A.e(A.i("unknown PairPos format "+c))}},
q_(a,b,c){var s,r,q,p,o=a.length
if(!(b>=0&&b<o))return A.a(a,b)
s=a[b]
r=s.e
q=s.f
if(r===0||(q&2)===0)return
s.e=0
p=b+r
if(p===c)return
if(p<0||p>=o)return
A.q_(a,p,c)
o=a.length
if(!(p>=0&&p<o))return A.a(a,p)
s=a[p]
if(!(b<o))return A.a(a,b)
s.d=-a[b].d
s.e=-r
s.f=q},
p6(a,b,c,d,e){var s,r,q,p,o,n,m
if(d==null)return!1
s=b.a
r=b.b
q=r+2+c*4+2
s.l(q,2)
s=s.a
p=s.getUint16(q,!1)
o=a.bw(p===0?new A.d1(0,0,null,null):A.iw(new A.o(s,r+p)))
n=a.bw(d)
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
uy(a,b){var s=a.w,r=b.w
if(s===r)return s===0||a.x===b.x
if(!(s>0&&a.x===0))s=r>0&&b.x===0
else s=!0
return s},
lR(a,b,c,d){var s,r,q,p,o
for(s=c.length,r=b.length,q=0;q<s;++q){p=c[q]
o=p.a
if(o>=r)continue
a.w=b[o]
a.ia(p.b)}a.w=d},
mv(a,b,c,d,e){var s,r,q,p,o,n,m,l,k
if(b===0)return B.m
s=A.T(b,0,!1,t.S)
B.a.n(s,0,a.w)
r=a.w
for(q=d.a,p=a.a,o=a.d,n=1;n<b;++n){m=a.Q
if(m==null)m=a.Q=new A.aJ(p,a.x,a.y,o)
l=c+(n-1)*2
if(l>=0)k=l+2<=q.byteLength
else k=!1
if(!k)A.p(A.i("read of 2 byte(s) at "+l+" overruns a "+d.gj(0)+"-byte font"))
r=a.i1(m,r,q.getUint16(l,!1),e)
if(r<0)return null
B.a.n(s,n,r)}return s},
rn(a,b,c,d,e){var s,r,q,p,o,n,m,l=a.w
for(s=d.a,r=a.a,q=a.d,p=0;p<b;++p){o=a.Q
if(o==null)o=a.Q=new A.aJ(r,a.x,a.y,q)
n=c+p*2
if(n>=0)m=n+2<=s.byteLength
else m=!1
if(!m)A.p(A.i("read of 2 byte(s) at "+n+" overruns a "+d.gj(0)+"-byte font"))
l=a.e5(o,l,s.getUint16(n,!1),e,!1)
if(l<0)return!1}return!0},
ro(a,b,c,d,e,f){var s,r,q,p,o,n,m,l=f-1
for(s=d.a,r=a.a,q=a.d,p=0;p<b;++p){o=a.Q
if(o==null)o=a.Q=new A.aJ(r,a.x,a.y,q)
n=c+p*2
if(n>=0)m=n+2<=s.byteLength
else m=!1
if(!m)A.p(A.i("read of 2 byte(s) at "+n+" overruns a "+d.gj(0)+"-byte font"))
l=a.cs(o,l,s.getUint16(n,!1),e,!1)
if(l<0)return!1}return!0},
nI(a,b,c){var s,r,q,p,o,n="read of 2 byte(s) at ",m=J.aR(c,t.ih)
for(s=a.a,r=0;r<c;++r){q=b+r*4
if(q>=0)p=q+2<=s.byteLength
else p=!1
if(!p)A.p(A.i(n+q+" overruns a "+a.gj(0)+"-byte font"))
p=s.getUint16(q,!1)
q+=2
if(q>=0)o=q+2<=s.byteLength
else o=!1
if(!o)A.p(A.i(n+q+" overruns a "+a.gj(0)+"-byte font"))
m[r]=new A.h5(p,s.getUint16(q,!1))}return m},
wO(a,b){return a.a===b},
tG(a,b,c){var s,r,q
switch(c){case 1:s=b+2
a.l(s,2)
r=a.a
return new A.de(a,b,1,A.V(new A.o(r,b+r.getUint16(s,!1))),null)
case 2:s=b+4
a.l(s,2)
r=a.a
q=r.getUint16(s,!1)
s=b+2
a.l(s,2)
s=A.V(new A.o(r,b+r.getUint16(s,!1)))
return new A.de(a,b,2,s,q===0?B.i:A.cl(new A.o(r,b+q)))
case 3:return new A.de(a,b,3,null,null)
default:throw A.e(A.i("unknown ContextPos format "+c))}},
rg(a,b){return new A.m5(A.C(t.S,t.c),a,b)},
tw(a,b,c){var s,r,q,p=null
switch(c){case 1:s=b+2
a.l(s,2)
r=a.a
return new A.d7(a,b,1,A.V(new A.o(r,b+r.getUint16(s,!1))),p,p,p)
case 2:s=new A.iF(a,b)
r=b+2
a.l(r,2)
q=a.a
return new A.d7(a,b,2,A.V(new A.o(q,b+q.getUint16(r,!1))),s.$1(b+4),s.$1(b+6),s.$1(b+8))
case 3:return new A.d7(a,b,3,p,p,p,p)
default:throw A.e(A.i("unknown ChainContextPos format "+c))}},
h5:function h5(a,b){this.a=a
this.b=b},
jn:function jn(a,b,c,d,e,f,g){var _=this
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
aF:function aF(){},
nT:function nT(a,b){this.a=a
this.b=b},
nS:function nS(a,b){this.a=a
this.b=b},
eG:function eG(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
ez:function ez(a,b,c,d,e,f,g,h,i,j){var _=this
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
fH:function fH(a,b,c){this.a=a
this.b=b
this.c=c},
f0:function f0(a,b){this.a=a
this.b=b},
eT:function eT(a,b){this.a=a
this.b=b},
h6:function h6(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
h7:function h7(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
h8:function h8(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
de:function de(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
iU:function iU(a){this.a=a},
m5:function m5(a,b,c){this.a=a
this.b=b
this.c=c},
d7:function d7(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
iF:function iF(a,b){this.a=a
this.b=b},
iC:function iC(a){this.a=a},
iD:function iD(a){this.a=a},
iE:function iE(a){this.a=a},
uh(a){var s=A.qn(a)
return new A.cs(s,A.T(s.w.length,null,!1,t.hJ))},
i4:function i4(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
cs:function cs(a,b){this.a=a
this.b=b},
og(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h=null,g=a.gt(0),f=A.T(b,0,!1,t.S)
B.a.n(f,0,a.f)
if(b===1)return f
s=a.a.a
r=a.f
if(!(r>=0&&r<s.length))return A.a(s,r)
q=s[r]
p=q.w
o=q.x
for(n=p!==0,m=o!==0,l=r,k=h,j=1;j<b;++j){l=g.cr(l)
if(l<0)return h
if(!(l<s.length))return A.a(s,l)
i=s[l]
if(!c.$2(j,i.a))return h
B.a.n(f,j,l)
if(n&&m){if(p!==i.w||o!==i.x){if(k==null)k=A.wM(a,p)
if(!k)return h}}else{r=i.w
if(r!==0&&i.x!==0&&r!==p)return h}}return f},
wM(a,b){var s,r,q=a.a.a,p=a.f,o=q.length
for(;;){if(p>0){r=p-1
if(!(r<o))return A.a(q,r)
r=q[r].w===b}else r=!1
if(!r){s=!1
break}--p
if(!(p>=0&&p<o))return A.a(q,p)
if(q[p].x===0){s=!0
break}}if(s){o=a.gt(0)
if(!(p>=0&&p<q.length))return A.a(q,p)
o=o.aK(q[p])}else o=!1
return o},
pr(a,b,c){var s,r,q=a.gt(0),p=a.f
for(s=a.a.a,r=0;r<b;++r){p=q.e4(p)
if(p<0)return!1
if(!(p<s.length))return A.a(s,p)
if(!c.$2(r,s[p].a))return!1}return!0},
ps(a,b,c,d){var s,r,q=a.gt(0),p=c-1
for(s=a.a.a,r=0;r<b;++r){p=q.cr(p)
if(p<0)return!1
if(!(p<s.length))return A.a(s,p)
if(!d.$2(r,s[p].a))return!1}return!0},
pj(a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a1.length,a=A.T(64,0,!1,t.S)
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
B.a.n(a,d,a[l]+1)}for(h=g;h<b;++h){if(!(h>=0&&h<64))return A.a(a,h)
B.a.n(a,h,a[h]+j)}}a0.f=p
return!0},
xY(a,b){var s,r,q,p,o,n,m=A.rK(a,b,7),l=m.a,k=m.b,j=k.b
k.l(j,2)
s=k.a
r=s.getUint16(j,!1)
switch(l){case 1:return A.va(k,r)
case 2:return A.uz(k,r)
case 3:return A.tn(k,r)
case 4:return A.uu(k,r)
case 5:A:{if(1===r){j=k.b
q=j+2
k.l(q,2)
p=A.V(new A.o(s,j+s.getUint16(q,!1)))
q=j+4
k.l(q,2)
q=A.my(k,j,j+6,s.getUint16(q,!1))
q=new A.fD(p,new A.dK(k,q,A.rE(),A.T(q.length,null,!1,t.D)))
s=q
break A}if(2===r){j=k.b
q=j+2
k.l(q,2)
p=A.V(new A.o(s,j+s.getUint16(q,!1)))
q=j+4
k.l(q,2)
o=s.getUint16(q,!1)
q=j+6
k.l(q,2)
n=s.getUint16(q,!1)
s=o===0?B.i:A.cl(new A.o(s,j+o))
q=A.my(k,j,j+8,n)
q=new A.fE(p,s,new A.dK(k,q,A.rE(),A.T(q.length,null,!1,t.D)))
s=q
break A}if(3===r){s=A.tH(k)
break A}s=A.p(A.i("unknown Context subst format "+r))}return s
case 6:B:{if(1===r){j=k.b
q=j+2
k.l(q,2)
p=A.V(new A.o(s,j+s.getUint16(q,!1)))
q=j+4
k.l(q,2)
q=A.my(k,j,j+6,s.getUint16(q,!1))
q=new A.fv(p,new A.dK(k,q,A.rD(),A.T(q.length,null,!1,t.D)))
s=q
break B}if(2===r){s=A.tx(k)
break B}if(3===r){s=A.ty(k)
break B}s=A.p(A.i("unknown ChainContext subst format "+r))}return s
case 8:return A.uZ(k,r)
default:throw A.e(A.i("unknown GSUB lookup type "+l))}},
va(a,b){var s,r,q=a.b,p=q+2
a.l(p,2)
s=a.a
r=A.V(new A.o(s,q+s.getUint16(p,!1)))
switch(b){case 1:p=q+4
a.l(p,2)
return new A.eH(r,s.getInt16(p,!1),null)
case 2:p=q+4
a.l(p,2)
return new A.eH(r,0,new A.o(s,q+6).a1(s.getUint16(p,!1)))
default:throw A.e(A.i("unknown SingleSubst format "+b))}},
uz(a,b){var s,r,q,p,o,n,m,l,k
if(b!==1)throw A.e(A.i("unknown MultipleSubst format "+b))
s=a.b
r=s+2
a.l(r,2)
q=a.a
p=A.V(new A.o(q,s+q.getUint16(r,!1)))
r=s+4
a.l(r,2)
o=q.getUint16(r,!1)
n=J.aR(o,t.S)
for(r=s+6,m=0;m<o;++m){l=r+m*2
if(l>=0)k=l+2<=q.byteLength
else k=!1
if(!k)A.p(A.i("read of 2 byte(s) at "+l+" overruns a "+a.gj(0)+"-byte font"))
n[m]=s+q.getUint16(l,!1)}return new A.ha(p,a,n,A.T(o,null,!1,t.f8))},
tn(a,b){var s,r,q,p,o,n,m,l,k
if(b!==1)throw A.e(A.i("unknown AlternateSubst format "+b))
s=a.b
r=s+2
a.l(r,2)
q=a.a
p=A.V(new A.o(q,s+q.getUint16(r,!1)))
r=s+4
a.l(r,2)
o=q.getUint16(r,!1)
n=J.aR(o,t.S)
for(r=s+6,m=0;m<o;++m){l=r+m*2
if(l>=0)k=l+2<=q.byteLength
else k=!1
if(!k)A.p(A.i("read of 2 byte(s) at "+l+" overruns a "+a.gj(0)+"-byte font"))
n[m]=s+q.getUint16(l,!1)}return new A.fq(p,a,n,A.T(o,null,!1,t.f8))},
uu(a,b){var s,r,q,p,o,n,m,l,k
if(b!==1)throw A.e(A.i("unknown LigatureSubst format "+b))
s=a.b
r=s+2
a.l(r,2)
q=a.a
p=A.V(new A.o(q,s+q.getUint16(r,!1)))
r=s+4
a.l(r,2)
o=q.getUint16(r,!1)
n=J.aR(o,t.S)
for(r=s+6,m=0;m<o;++m){l=r+m*2
if(l>=0)k=l+2<=q.byteLength
else k=!1
if(!k)A.p(A.i("read of 2 byte(s) at "+l+" overruns a "+a.gj(0)+"-byte font"))
n[m]=s+q.getUint16(l,!1)}return new A.h4(p,a,n,A.T(o,null,!1,t.d1))},
wL(a,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a.a,d=e.a,c=a0.length,b=c-1
if(!(b>=0))return A.a(a0,b)
s=a0[b]
A.wP(e,a.f,s+1)
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
l=n?A.w2(e):0
s=a.f
if(!(s>=0&&s<d.length))return A.a(d,s)
r=d[s]
k=r.w
if(n){r.w=l
r.x=0
if(r.e===1)r.e=6}a.bM(s,a1,m)
for(j=1,i=0,o=1;o<c;++o){for(h=a0[o-1]+1,s=j-1;r=a0[o],h<r;++h){if(n){if(!(h>=0&&h<d.length))return A.a(d,h)
r=d[h]
g=r.x
if(g===0)g=1
r.w=l
r.x=s+(g<1?g:1)}++i}if(!(r>=0&&r<d.length))return A.a(d,r)
k=d[r].w;++j}for(s=e.b,o=b;o>=1;--o){B.a.aG(d,a0[o])
B.a.aG(s,a0[o])}f=a.f+1+i
if(!p&&k!==0)for(b=j-1,o=f;s=d.length,o<s;++o){if(!(o>=0))return A.a(d,o)
s=d[o]
if(s.w!==k)break
g=s.x
if(g===0)break
s.w=l
s.x=b+(g<1?g:1)}a.f=f},
w2(a){var s,r,q,p,o
for(s=a.a,r=s.length,q=0,p=0;p<r;++p){o=s[p].w
if(o>0&&o<8)q|=B.b.ai(1,o)}for(o=1;o<8;++o)if((q&B.b.ai(1,o))>>>0===0)return o
return 1},
wP(a,b,c){var s,r,q,p,o,n
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
nJ(a,b,c){var s,r,q,p,o,n="read of 2 byte(s) at ",m=J.aR(c,t.nu)
for(s=a.a,r=0;r<c;++r){q=b+r*4
if(q>=0)p=q+2<=s.byteLength
else p=!1
if(!p)A.p(A.i(n+q+" overruns a "+a.gj(0)+"-byte font"))
p=s.getUint16(q,!1)
q+=2
if(q>=0)o=q+2<=s.byteLength
else o=!1
if(!o)A.p(A.i(n+q+" overruns a "+a.gj(0)+"-byte font"))
m[r]=new A.hp(p,s.getUint16(q,!1))}return m},
wW(a,b){var s,r,q,p,o,n
t.bb.a(a)
A.E(b)
a.l(b,2)
s=a.a
r=s.getUint16(b,!1)
q=b+2
a.l(q,2)
p=s.getUint16(q,!1)
q=b+4
o=r===0?0:r-1
n=new A.o(s,q).a1(o)
return new A.bI(B.m,n,B.m,A.nJ(a,q+n.length*2,p))},
wV(a,b){var s,r,q,p,o,n,m,l,k
t.bb.a(a)
A.E(b)
a.l(b,2)
s=a.a
r=s.getUint16(b,!1)
q=new A.o(s,b+2).a1(r)
p=b+(2+r*2)
a.l(p,2)
o=s.getUint16(p,!1)
n=o===0?0:o-1
m=new A.o(s,p+2).a1(n)
p+=2+m.length*2
a.l(p,2)
l=s.getUint16(p,!1)
k=new A.o(s,p+2).a1(l)
p+=2+l*2
a.l(p,2)
return new A.bI(q,m,k,A.nJ(a,p+2,s.getUint16(p,!1)))},
my(a,b,c,d){return A.eo(d,new A.mz(a,c,b),!1,t.S)},
mu(a,b,c,d,e){var s,r,q=A.og(a,b.b.length+1,d)
if(q==null)return!1
s=q.length
r=s-1
if(!(r>=0))return A.a(q,r)
s=q[r]
if(!A.ps(a,b.c.length,s+1,e))return!1
if(!A.pr(a,b.a.length,c))return!1
A.pj(a,q,q[r]+1,b.d)
return!0},
tH(a){var s,r,q,p,o,n,m,l=a.b,k=l+2
a.l(k,2)
s=a.a
r=s.getUint16(k,!1)
k=l+4
a.l(k,2)
q=s.getUint16(k,!1)
p=J.aR(r,t.c)
for(k=l+6,o=0;o<r;++o){n=k+o*2
if(n>=0)m=n+2<=s.byteLength
else m=!1
if(!m)A.p(A.i("read of 2 byte(s) at "+n+" overruns a "+a.gj(0)+"-byte font"))
p[o]=A.V(new A.o(s,l+s.getUint16(n,!1)))}return new A.fF(p,A.nJ(a,k+r*2,q))},
tx(a){var s,r,q,p,o,n=a.b,m=n+2
a.l(m,2)
s=a.a
r=A.V(new A.o(s,n+s.getUint16(m,!1)))
m=new A.iM(a,n)
q=n+10
a.l(q,2)
p=s.getUint16(q,!1)
q=m.$1(n+4)
s=m.$1(n+6)
m=m.$1(n+8)
o=A.my(a,n,n+12,p)
return new A.fw(r,q,s,m,new A.dK(a,o,A.rD(),A.T(o.length,null,!1,t.D)))},
ty(a){var s,r,q,p,o,n={},m=a.b
n.a=m+2
s=new A.iQ(n,a,m)
r=s.$0()
q=s.$0()
p=s.$0()
s=n.a
a.l(s,2)
o=a.a.getUint16(s,!1)
return new A.fx(r,q,p,A.nJ(a,n.a+2,o))},
wR(a,b){return!1},
uZ(a,b){var s,r,q,p,o,n,m,l={}
if(b!==1)throw A.e(A.i("unknown ReverseChainSingleSubst format "+b))
s=a.b
r=s+2
a.l(r,2)
q=a.a
p=A.V(new A.o(q,s+q.getUint16(r,!1)))
l.a=s+4
r=new A.k1(l,a,s)
o=r.$0()
n=r.$0()
r=l.a
a.l(r,2)
m=q.getUint16(r,!1)
return new A.hn(p,o,n,new A.o(q,l.a+2).a1(m))},
hp:function hp(a,b){this.a=a
this.b=b},
ef:function ef(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.x=_.w=_.r=_.f=0
_.y=null},
aA:function aA(){},
eH:function eH(a,b,c){this.a=a
this.b=b
this.c=c},
ha:function ha(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fq:function fq(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
cR:function cR(a,b){this.a=a
this.b=b},
h4:function h4(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jC:function jC(a,b){this.a=a
this.b=b},
jD:function jD(a){this.a=a},
bI:function bI(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
dK:function dK(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
mz:function mz(a,b,c){this.a=a
this.b=b
this.c=c},
fD:function fD(a,b){this.a=a
this.b=b},
iV:function iV(a){this.a=a},
fE:function fE(a,b,c){this.a=a
this.b=b
this.c=c},
iW:function iW(a,b){this.a=a
this.b=b},
fF:function fF(a,b){this.a=a
this.b=b},
iX:function iX(a){this.a=a},
fv:function fv(a,b){this.a=a
this.b=b},
iH:function iH(a){this.a=a},
iG:function iG(a){this.a=a},
iI:function iI(a){this.a=a},
fw:function fw(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
iM:function iM(a,b){this.a=a
this.b=b},
iK:function iK(a,b){this.a=a
this.b=b},
iJ:function iJ(a,b){this.a=a
this.b=b},
iL:function iL(a,b){this.a=a
this.b=b},
fx:function fx(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
iQ:function iQ(a,b,c){this.a=a
this.b=b
this.c=c},
iN:function iN(a){this.a=a},
iO:function iO(a){this.a=a},
iP:function iP(a){this.a=a},
hn:function hn(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
k1:function k1(a,b,c){this.a=a
this.b=b
this.c=c},
k_:function k_(a){this.a=a},
k0:function k0(a){this.a=a},
aJ:function aJ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
qn(a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a="read of 4 byte(s) at ",a0="read of 2 byte(s) at ",a1=a2.b
a2.l(a1,2)
s=a2.a
r=s.getUint16(a1,!1)
q=a1+2
a2.l(q,2)
p=s.getUint16(q,!1)
if(r!==1)throw A.e(A.i("unsupported layout table version "+r+"."+p))
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
if(!g)A.p(A.i(a+h+" overruns a "+a2.gj(0)+"-byte font"))
g=s.getUint32(h,!1)
f=h+4
if(f>=0)e=f+2<=s.byteLength
else e=!1
if(!e)A.p(A.i(a0+f+" overruns a "+a2.gj(0)+"-byte font"))
l.n(0,g,k+s.getUint16(f,!1))}}q=t.t
d=A.b([],q)
c=A.b([],q)
if(n!==0){k=a1+n
a2.l(k,2)
j=s.getUint16(k,!1)
for(g=k+2,i=0;i<j;++i){h=g+i*6
if(h>=0)f=h+4<=s.byteLength
else f=!1
if(!f)A.p(A.i(a+h+" overruns a "+a2.gj(0)+"-byte font"))
B.a.k(d,s.getUint32(h,!1))
f=h+4
if(f>=0)e=f+2<=s.byteLength
else e=!1
if(!e)A.p(A.i(a0+f+" overruns a "+a2.gj(0)+"-byte font"))
B.a.k(c,k+s.getUint16(f,!1))}}b=A.b([],q)
if(m!==0){k=a1+m
a2.l(k,2)
j=s.getUint16(k,!1)
for(q=k+2,i=0;i<j;++i){g=q+i*2
if(g>=0)f=g+2<=s.byteLength
else f=!1
if(!f)A.p(A.i(a0+g+" overruns a "+a2.gj(0)+"-byte font"))
B.a.k(b,k+s.getUint16(g,!1))}}return new A.jB(a2,a1,l,d,c,A.T(d.length,null,!1,t.f8),p,b)},
jB:function jB(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
ht:function ht(a,b){this.a=a
this.b=b},
kh:function kh(){},
tp(a){var s,r,q,p,o,n,m,l,k,j=a.a,i=j.length,h=A.T(i,7,!1,t.S)
for(s=0,r=-1,q=0;q<i;++q){if(!(q<j.length))return A.a(j,q)
p=A.to(j[q])
if(p<0){B.a.n(h,q,7)
continue}o=$.t9()
n=s*6+p
if(!(n<42))return A.a(o,n)
m=o[n]
l=m>>>8&15
k=m&15
if(l!==7&&r>=0)B.a.n(h,r,l)
B.a.n(h,q,m>>>4&15)
r=q
s=k}return h},
to(a){var s,r,q=a.d
if(q===5)return-1
s=a.b
if(s>=1792&&s<=1871){if(s===1808)return 4
if(B.dh.v(0,s))return 5}A:{r=3
if(1===q){r=1
break A}if(2===q){r=2
break A}if(3===q)break A
if(4===q)break A
r=0
break A}return r},
F(a,b,c){return(a<<8|b<<4|c)>>>0},
dY:function dY(){},
xi(a,b){var s,r
a.az(1920365166)
a.bu()
if(a.c===B.k){a.az(1920232545)
a.bt(1920232557)}else{a.az(1819570785)
a.az(1819570797)}a.bt(1718772067)
a.bt(1853189490)
a.bt(1684959085)
b.dP(a)
for(s=0;s<7;++s){r=B.cm[s]
a.aN(r,(r===1835102827||r===1835756907?6:0)|1,1)}for(s=0;s<7;++s){r=B.cK[s]
a.aN(r,(r===1801810542?8:0)|1,1)}},
eF:function eF(){},
fI:function fI(){},
aC:function aC(a,b,c,d,e,f,g,h,i,j,k){var _=this
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
bY:function bY(a){var _=this
_.a=a
_.f=_.e=_.d=_.c=_.b=0},
eM:function eM(a,b){this.a=a
this.b=b},
jg:function jg(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=0},
jh:function jh(){},
qt(a,b){var s,r,q,p=a.a
if(b===p)return
B.a.aa(p)
B.a.B(p,b)
p=a.b
B.a.aa(p)
s=b.length
r=J.oL(s,t.lr)
for(q=0;q<s;++q)r[q]=new A.bY(0)
B.a.B(p,r)},
uK(a,b,c){var s,r,q,p=a.a,o=p.length
if(!(b>=0&&b<o))return A.a(p,b)
s=p[b].c
for(r=b+1;r<c;++r){if(!(r<o))return A.a(p,r)
q=p[r].c
if(q<s)s=q}for(r=b;r<c;++r){if(!(r<p.length))return A.a(p,r)
p[r].c=s}},
wf(a){var s,r,q,p,o,n,m,l,k,j,i
if(a>=44032&&a<55204){s=a-44032
r=B.b.W(s,28)
if(r!==0)return new A.z(44032+s-r,4519+r)
return new A.z(4352+B.b.N(s,588),4449+B.b.N(B.b.W(s,588),28))}q=$.tb()
p=q.length
o=(p/3|0)-1
for(n=0;n<=o;){m=B.b.M(n+o,1)
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
return new A.z(j,q[i])}}return B.ae},
we(a,b){var s,r,q,p,o,n,m,l,k
if(a>=4352&&a<4371)if(b>=4449&&b<4470)return 44032+((a-4352)*21+(b-4449))*28
if(a>=44032&&a<55204)if(B.b.W(a-44032,28)===0&&b>4519&&b<4547)return a+(b-4519)
s=$.ta()
r=s.length
q=(r/3|0)-1
for(p=0;p<=q;){o=B.b.M(p+q,1)
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
hd:function hd(a,b){this.a=a
this.b=b},
jL:function jL(a){this.a=a},
mw:function mw(){},
v7(a){var s,r,q,p,o,n,m,l,k,j
for(s=a.a,r=0,q=1;p=s.length,q<=p;++q){if(q<p){o=s[q]
n=o.e
m=n===1||n===2||n===3||o.b===8205}else m=!1
if(m)continue
if(q-r>1){if(!(r>=0&&r<p))return A.a(s,r)
l=s[r].c
for(k=r+1;k<q;++k){j=s[k].c
if(j<l)l=j}for(k=r;k<q;++k){if(!(k<s.length))return A.a(s,k)
s[k].c=l}}r=q}},
v6(a){var s=B.dg.v(0,a.d)?B.k:B.v
if(a.c===s)return
a.e8()
a.c=a.c===B.k?B.v:B.k},
v5(a,b){var s,r,q,p,o,n
if(b==null||b.b===B.i)return
for(s=a.a,r=s.length,q=b.b,p=b.c,o=0;o<s.length;s.length===r||(0,A.h)(s),++o){n=s[o]
n.f=q.O(n.a)
n.r=p.O(n.a)}},
xG(a){var s
if(a<173)return!1
s=!0
if(a!==173)if(a!==847)if(a!==1564)if(!(a>=4447&&a<=4448))if(!(a>=6068&&a<=6069))if(!(a>=6155&&a<=6159))if(!(a>=8203&&a<=8207))if(!(a>=8234&&a<=8238))if(!(a>=8288&&a<=8303))if(a!==12644)if(!(a>=65024&&a<=65039))if(a!==65279)if(a!==65440)if(!(a>=65520&&a<=65528))if(!(a>=113824&&a<=113827))if(!(a>=119155&&a<=119162))s=a>=917504&&a<=921599
return s},
hq:function hq(a,b,c){this.a=a
this.b=b
this.c=c},
kd:function kd(){},
hr:function hr(a,b,c){var _=this
_.a=a
_.b=b
_.c=$
_.d=c},
v8(a){var s
for(s=0;a>0;){++s
a=a>>>1}return s},
hk:function hk(a,b){this.a=a
this.b=b},
hj:function hj(a){this.a=a},
hs:function hs(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
bJ:function bJ(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.r=_.f=0},
kf:function kf(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.r=_.e=0},
kg:function kg(){},
ts(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=A.tr(a)
if(d.length<=1)return A.r2(a,null).e9()
s=J.n(a)
r=s.gj(a)
q=new Uint8Array(r)
r=t.E
p=A.b([],r)
o=A.b([],r)
n=A.b([],r)
for(m=0,l=0,k=0;k<d.length;++k,m=j){j=d[k]
i=A.r2(s.I(a,m,j),null).e9()
B.j.bJ(q,m,i.a)
for(r=i.c,h=r.length,g=0;g<r.length;r.length===h||(0,A.h)(r),++g){f=r[g]
B.a.k(p,new A.bo(f.a+m,f.b+m,f.c))}for(r=i.d,h=r.length,g=0;g<r.length;r.length===h||(0,A.h)(r),++g){f=r[g]
B.a.k(o,new A.bo(f.a+m,f.b+m,f.c))}e=i.b
B.a.k(n,new A.bo(m,j,e))
if(k===0)l=e}return new A.e0(q,l,p,o)},
tr(a){var s,r,q,p=A.b([],t.t)
for(s=J.n(a),r=0;r<s.gj(a);++r){q=s.h(a,r)
if(A.am($.pG(),q)!==10)continue
if(s.h(a,r)===13){q=r+1
q=q<s.gj(a)&&s.h(a,q)===10}else q=!1
if(q)continue
B.a.k(p,r+1)}if(p.length===0||B.a.gS(p)!==s.gj(a))B.a.k(p,s.gj(a))
return p},
r2(a,b){var s,r,q,p=J.n(a),o=p.gj(a),n=p.gj(a)
n=new Uint8Array(n)
s=p.gj(a)
s=new Uint8Array(s)
r=p.gj(a)
r=new Uint8Array(r)
q=p.gj(a)
q=new Int32Array(q)
p=p.gj(a)
p=new A.lF(a,b,o,n,s,r,q,new Int32Array(p))
p.en(a,b)
return p},
vC(a,b,c,d,e){var s,r,q,p,o,n=b.length,m=t.S,l=J.aR(n,m)
for(s=a.e,r=b.length,q=s.length,p=0;p<n;++p){if(!(p<r))return A.a(b,p)
o=b[p]
if(!(o<q))return A.a(s,o)
l[p]=s[o]}s=new A.i6(a,b,l,c,d,e)
m=A.a1(l,m)
m.$flags=1
s.d=t.L.a(m)
return s},
qZ(a){var s
A:{if(0===a){s=0
break A}if(1===a||3===a||6===a){s=1
break A}s=-1
break A}return s},
qY(a){B.a.aC(a,new A.lw())
return a},
qX(a){var s
A:{if(12296===a){s=9001
break A}if(12297===a){s=9002
break A}s=a
break A}return s},
bo:function bo(a,b,c){this.a=a
this.b=b
this.c=c},
e0:function e0(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
lF:function lF(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.z=_.y=_.x=$},
i6:function i6(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=$
_.e=d
_.f=e
_.r=f},
lw:function lw(){},
v3(a){var s,r,q,p,o,n,m,l,k=1145457748,j=a.length
if(j===0)return B.cw
s=A.b([],t.m1)
for(r=0,q=-1,p=0;p<j;++p){if(!(p<a.length))return A.a(a,p)
o=a[p]
n=A.am($.td(),o)
if(n===$.t5()||n===$.t6()||n===0)continue
m=k
if(n>=0&&n<$.pE().length){o=$.pE()
if(!(n>=0&&n<o.length))return A.a(o,n)
l=o[n]}else l=m
if(q===-1)q=l
else if(l!==q){B.a.k(s,new A.eE(r,p,q))
q=l
r=p}}B.a.k(s,new A.eE(r,j,q===-1?k:q))
return s},
eE:function eE(a,b,c){this.a=a
this.b=b
this.c=c},
nM:function nM(){},
i(a){return new A.az(a)},
o:function o(a,b){this.a=a
this.b=b},
az:function az(a){this.a=a},
tv(a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=a9.length,a3=a2/12|0,a4=a3*4,a5=new Float32Array(a4),a6=new Float32Array(256),a7=new Int32Array(256)
for(s=a8.length,r=0;r<a3;++r){q=r*12
p=q+4
if(!(p<a2))return A.a(a9,p)
o=B.c.K(a9[p])
p=q+5
if(!(p<a2))return A.a(a9,p)
for(p=o+B.c.K(a9[p]),n=o,m=1/0,l=1/0,k=-1/0,j=-1/0;n<p;++n){i=n*4
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
for(g=B.b.E(B.c.a7(l/4096*16),0,15),p=j/4096*16,i=m/4096*16,h=k/4096*16;g<=B.b.E(B.c.a7(p),0,15);++g)for(f=B.b.E(B.c.a7(i),0,15),e=g*16;f<=B.b.E(B.c.a7(h),0,15);++f){d=e+f
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
b[a]=a2+s}a2=B.c.K(b[256])
a0=new Float32Array(a2)
a1=new Int32Array(256)
for(r=0;r<a3;++r){s=r*4
p=s+1
if(!(p<a4))return A.a(a5,p)
g=B.b.E(B.c.a7(a5[p]/4096*16),0,15)
p=s+3
if(!(p<a4))return A.a(a5,p)
i=s+2
for(;g<=B.b.E(B.c.a7(a5[p]/4096*16),0,15);++g){if(!(s<a4))return A.a(a5,s)
f=B.b.E(B.c.a7(a5[s]/4096*16),0,15)
if(!(i<a4))return A.a(a5,i)
h=g*16
for(;f<=B.b.E(B.c.a7(a5[i]/4096*16),0,15);++f){d=h+f
if(!(d>=0&&d<257))return A.a(b,d)
e=B.c.K(b[d])
if(!(d<256))return A.a(a1,d)
c=a1[d]
if(!(d<256))return A.a(a1,d)
a1[d]=c+1
c=e+c
if(!(c>=0&&c<a2))return A.a(a0,c)
a0[c]=r}}}return new A.iz(a5,b,a0,a6)},
iz:function iz(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
uS(a,b){var s,r,q,p,o,n,m,l,k,j,i=A.b([],t.d2)
for(s=b.d.gag(),s=s.gt(s),r=t.u,q=t.j,p=t.s,o=t.G;s.m();){n=s.gp()
m=n.a
l=n.b
n=new A.ik(m)
l=q.b(l)?l:B.a9
k=J.n(l)
j=k.gA(l)?null:k.gu(l)
n.b=r.a(A.u(k.gj(l)>1?k.h(l,1):null))
n.c=r.a(A.u(typeof j=="string"?A.b([j,A.b(["accumulated"],p),A.b(["get",m],p)],o):j))
i.push(n)}i=new A.jX(b,i,new A.A(B.h),A.C(t.S,t.el))
i.el(a,b)
return i},
iR:function iR(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ik:function ik(a){this.a=a
this.c=this.b=$},
aZ:function aZ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=null
_.f=0},
jX:function jX(a,b,c,d){var _=this
_.a=a
_.b=$
_.c=b
_.d=c
_.e=1
_.f=d},
jZ:function jZ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jY:function jY(a){this.a=a},
qD(a,b,c,d){var s,r,q=new A.k2(),p=new A.k3(),o=(a+16)/116,n=q.$1(o),m=q.$1(o+b/500)
if(typeof m!=="number")return A.ah(m)
s=0.96422*m
q=q.$1(o-c/200)
if(typeof q!=="number")return A.ah(q)
r=0.82521*q
return new A.ab(p.$1(3.1338561*s-1.6168667*n-0.4906146*r),p.$1(-0.9787684*s+1.9161415*n+0.033454*r),p.$1(0.0719453*s-0.2289914*n+1.4052427*r),d)},
c4(a){if(a instanceof A.ab)return a
if(typeof a!="string")return null
return $.v0.b7(a,new A.ka(a))},
v_(a){var s,r,q,p,o,n,m,l,k,j,i=null,h=B.d.aH(a).toLowerCase()
if(B.d.av(h,"#")){s=B.d.am(h,1)
r=s.length
if(r===3||r===4)s=new A.ao(A.b(s.split(""),t.s),t.gL.a(new A.k6()),t.gQ).bE(0)
q=A.uU(s,16)
if(q==null)return i
r=s.length
if(r===6)return new A.ab((B.b.M(q,16)&255)/255,(B.b.M(q,8)&255)/255,(q&255)/255,1)
if(r===8)return new A.ab((B.b.M(q,24)&255)/255,(B.b.M(q,16)&255)/255,(B.b.M(q,8)&255)/255,(q&255)/255)
return i}p=B.d.aA(h,"(")
if(p>0&&B.d.cl(h,")")){r=B.d.cK(B.d.a5(h,p+1,h.length-1),A.hm("[,/\\s]+"))
o=A.M(r)
n=o.i("aK<1>")
m=A.a1(new A.aK(r,o.i("B(1)").a(new A.k7()),n),n.i("f.E"))
r=new A.k8(m)
o=m.length
if(o<3)return i
l=o>3?r.$2(3,1):1
k=B.d.a5(h,0,p)
if(k==="rgb"||k==="rgba")return new A.ab(r.$2(0,255),r.$2(1,255),r.$2(2,255),l)
if(k==="hsl"||k==="hsla"){if(0>=m.length)return A.a(m,0)
o=m[0]
o=A.N(A.pw(o,"deg",""))
return A.qE(B.c.W(o==null?0:o,360)/360,r.$2(1,100),r.$2(2,100),l)}return i}j=B.cY.h(0,h)
if(j==null)return i
return new A.ab((j>>>16&255)/255,(j>>>8&255)/255,(j&255)/255,(j>>>24&255)/255)},
qE(a,b,c,d){var s=c<0.5?c*(1+b):c+b-c*b,r=new A.k9(2*c-s,s)
return new A.ab(r.$1(a+0.3333333333333333),r.$1(a),r.$1(a-0.3333333333333333),d)},
ab:function ab(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
k5:function k5(){},
k4:function k4(){},
k2:function k2(){},
k3:function k3(){},
ka:function ka(a){this.a=a},
k6:function k6(){},
k7:function k7(){},
k8:function k8(a){this.a=a},
k9:function k9(a,b){this.a=a
this.b=b},
D(a){var s
if(typeof a=="number")s=a
else if(typeof a=="string")s=A.N(a)
else if(A.H(a))s=a?1:0
else s=null
return s},
ay(a){if(a==null)return""
if(typeof a=="number"&&a===B.c.a2(a))return B.b.q(B.c.K(a))
return J.bc(a)},
pi(a){var s,r,q,p
if(a==null)return"null"
if(A.H(a))return"boolean"
if(typeof a=="number")return"number"
if(typeof a=="string")return"string"
if(a instanceof A.ab)return"color"
if(a instanceof A.bU)return"formatted"
if(t.j.b(a)){for(s=J.Z(a),r=s.gt(a),q=null;r.m();){p=A.pi(r.gp())
if(q==null)q=p
else if(q!==p){q="value"
break}}r=q==null?"value":q
return"array<"+r+", "+s.gj(a)+">"}return"object"},
rv(a){var s,r=!1
if(a!=null){s=J.al(a)
if(!s.C(a,!1))if(!s.C(a,0))if(!s.C(a,""))r=!(typeof a=="number"&&isNaN(a))}return r},
re(a,b){var s=new A.lZ(a,b)
$.p8.n(0,a,s)
return s},
ag(a){return new A.m3(a)},
u(a){var s
if(t.f.b(a))return a.J("stops")||a.J("property")?A.pd(a):A.ag(a)
if(t.j.b(a)){s=J.n(a)
s=s.gH(a)&&B.df.v(0,s.gu(a))}else s=!1
if(s){s=J.Z(a)
return A.wT(A.U(s.gu(a)),s.a_(a,1))}return A.ag(a)},
fm(a){var s,r,q,p,o,n,m,l,k
if(typeof a!="string"||!B.d.v(a,"{"))return new A.nZ(A.u(a))
s=A.b([],t.G)
for(r=A.hm("\\{([^}]*)\\}").ca(0,a),r=new A.eS(r.a,r.b,r.c),q=t.s,p=t.lu,o=0;r.m();){n=r.d
m=(n==null?p.a(n):n).b
l=m.index
if(l>o)B.a.k(s,B.d.a5(a,o,l))
if(1>=m.length)return A.a(m,1)
k=m[1]
k.toString
B.a.k(s,A.b([k],q))
o=l+m[0].length}if(o<a.length)B.a.k(s,B.d.am(a,o))
return new A.o_(s)},
xj(a){return A.fm(new A.nX().$1(a))},
pn(a){if(a==null)return new A.nV()
return new A.nW(A.m6(a))},
m6(a){var s,r,q,p,o,n,m,l,k,j=t.j
if(!j.b(a)||J.d_(a))return A.ag(!J.k(a,!1))
s=J.Z(a)
r=s.gu(a)
q=s.a_(a,1)
p=new A.mg()
s=J.n(q)
if(s.gH(q))if(typeof s.gu(q)=="string"){o=q.length
n=!0
if(o>=2){if(1>=o)return A.a(q,1)
if(j.b(q[1])){o=J.al(r)
o=o.C(r,"in")||o.C(r,"!in")}else o=n}else o=n
n=o}else n=!1
else n=!1
if("all"===r){j=A.b([],t.V)
for(s=q.length,m=0;m<q.length;q.length===s||(0,A.h)(q),++m)j.push(A.m6(q[m]))
return new A.m7(j)}if("any"===r){j=A.b([],t.V)
for(s=q.length,m=0;m<q.length;q.length===s||(0,A.h)(q),++m)j.push(A.m6(q[m]))
return new A.m8(j)}if("none"===r){j=A.b([],t.V)
for(s=q.length,m=0;m<q.length;q.length===s||(0,A.h)(q),++m)j.push(A.m6(q[m]))
return new A.m9(j)}if("!has"===r)return new A.ma(s.gu(q))
if("!in"===r){l=s.gu(q)
return new A.mb(J.pR(s.a_(q,1)),p,l)}o=!1
if("in"===r)if(n){o=q.length
if(o===2){if(1>=o)return A.a(q,1)
j=!j.b(q[1])}else j=!0}else j=o
else j=o
if(j){l=s.gu(q)
return new A.mc(J.pR(s.a_(q,1)),p,l)}j="=="===r
if((j||"!="===r||"<"===r||"<="===r||">"===r||">="===r)&&n){l=s.gu(q)
if(1>=q.length)return A.a(q,1)
k=q[1]
A:{if(j){j=new A.md(p,l,k)
break A}if("!="===r){j=new A.me(p,l,k)
break A}j=new A.mf(r,p,l,k)
break A}return j}return A.u(a)},
rw(a){var s=t.J
return A.dy(A.oT(new A.ar(a),s.i("c(f.E)").a(new A.nQ()),s.i("f.E"),t.S),0,null)},
p7(a,b,c){var s,r
if(typeof b=="number"&&typeof c=="number")s=B.c.a6(b,c)
else if(typeof b=="string"&&typeof c=="string")s=B.d.a6(b,c)
else return!1
A:{if("<"===a){r=s<0
break A}if("<="===a){r=s<=0
break A}if(">"===a){r=s>0
break A}r=s>=0
break A}return r},
wT(d1,d2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7=null,c8=new A.mD(d2),c9=new A.mC(d2),d0=new A.nF(c8)
if("literal"===d1){s=J.n(d2)
return A.ag(s.gA(d2)?c7:s.gu(d2))}if("get"===d1){s=J.n(d2)
r=s.gA(d2)?c7:s.gu(d2)
if(d2.length>1){q=c8.$1(0)
return new A.mE(c8.$1(1),q)}if(typeof r=="string")return new A.mF(r)
return new A.mG(c8.$1(0))}if("has"===d1){s=J.n(d2)
r=s.gA(d2)?c7:s.gu(d2)
if(d2.length>1){q=c8.$1(0)
return new A.mR(c8.$1(1),q)}return new A.n1(r)}if("!has"===d1){s=J.n(d2)
return new A.nc(s.gA(d2)?c7:s.gu(d2))}if("properties"===d1)return new A.nn()
if("id"===d1)return new A.ny()
if("accumulated"===d1)return new A.nB()
if("feature-state"===d1){s=J.n(d2)
r=s.gA(d2)?c7:s.gu(d2)
if(typeof r=="string")return new A.nC(r)
return new A.nD(c8.$1(0))}if("$images"===d1)return new A.mH(c9.$0())
if("semiliteral"===d1){s=J.n(d2)
p=s.gA(d2)?c7:s.gu(d2)
if(!t.j.b(p))return A.ag(p)
s=A.b([],t.V)
for(o=J.G(p);o.m();)s.push(A.u(o.gp()))
return new A.mI(s)}if("let"===d1){n=A.C(t.N,t.u)
for(s=J.n(d2),m=0;l=m+2,l<d2.length;m=l){if(!(m>=0&&m<d2.length))return A.a(d2,m)
o=A.t(d2[m])
k=m+1
if(!(k>=0&&k<d2.length))return A.a(d2,k)
n.n(0,o,A.u(d2[k]))}B.a.k($.fl,n)
try{s=s.gA(d2)?A.ag(c7):A.u(s.gS(d2))
return s}finally{if(0>=$.fl.length)return A.a($.fl,-1)
$.fl.pop()}}if("var"===d1){for(s=A.M($.fl).i("bi<1>"),o=new A.bi($.fl,s),o=new A.a0(o,o.gj(0),s.i("a0<a_.E>")),k=J.n(d2),s=s.i("a_.E");o.m();){j=o.d
if(j==null)j=s.a(j)
i=j.h(0,k.gA(d2)?"":A.t(k.gu(d2)))
if(i!=null)return i}return A.ag(c7)}if("heatmap-density"===d1||"line-progress"===d1)return new A.mJ()
if("image"===d1)return c8.$1(0)
if("is-supported-script"===d1)return A.ag(!0)
if("resolved-locale"===d1)return new A.mK(c8.$1(0))
if("within"===d1){s=J.n(d2)
h=A.qv(s.gA(d2)?c7:s.gu(d2))
if(h==null)return A.ag(!1)
s=[d1]
B.a.B(s,d2)
return A.re("$geometry:"+B.e.a0(s,c7),new A.mL(h))}if("distance"===d1){s=J.n(d2)
h=A.qv(s.gA(d2)?c7:s.gu(d2))
if(h==null)return A.ag(c7)
s=[d1]
B.a.B(s,d2)
return A.re("$geometry:"+B.e.a0(s,c7),new A.mM(h))}if("typeof"===d1)return new A.mN(c8.$1(0))
if("to-rgba"===d1)return new A.mO(c8.$1(0))
if("slice"===d1){g=c8.$1(0)
f=c8.$1(1)
return new A.mP(g,f,d2.length>2?c8.$1(2):c7)}if("index-of"===d1){e=c8.$1(0)
d=c8.$1(1)
return new A.mQ(d,e,d2.length>2?c8.$1(2):c7)}if("sin"===d1)return d0.$1(A.xU())
if("cos"===d1)return d0.$1(A.xS())
if("tan"===d1)return d0.$1(A.xW())
if("asin"===d1)return d0.$1(A.xQ())
if("acos"===d1)return d0.$1(A.xP())
if("atan"===d1)return d0.$1(A.xR())
if("zoom"===d1)return new A.mS()
if("geometry-type"===d1)return new A.mT()
if("!"===d1)return new A.mU(c8.$1(0))
c="=="===d1
b=c7
a=c7
a0=!1
a1=c7
a2=!1
a3=c7
a4=!1
s=!0
if(!c){a5="!="===d1
a6=!a5
if(a6){b="<"===d1
a0=!b
if(a0){a="<="===d1
a2=!a
if(a2){a1=">"===d1
a4=!a1
if(a4){a3=">="===d1
s=a3}}}}}else{a5=c7
a6=!1}if(s&&d2.length>2)return new A.mV(c8.$1(0),c8.$1(1),c8.$1(2),d1)
if("collator"===d1){s=J.n(d2)
if(s.gH(d2)&&t.f.b(s.gu(d2))){s=s.gu(d2)
s.toString
t.f.a(s)
a7=s}else a7=B.u
return new A.mW(A.u(a7.h(0,"case-sensitive")),A.u(a7.h(0,"diacritic-sensitive")),A.u(a7.h(0,"locale")))}if(c)return new A.mX(c8.$1(0),c8.$1(1))
if(a5)return new A.mY(c8.$1(0),c8.$1(1))
s=!0
if(!(a6?b:"<"===d1))if(!(a0?a:"<="===d1))if(!(a2?a1:">"===d1))s=a4?a3:">="===d1
if(s)return new A.mZ(d1,c8.$1(0),c8.$1(1))
if("all"===d1)return new A.n_(c9.$0())
if("any"===d1)return new A.n0(c9.$0())
if("none"===d1)return new A.n2(c9.$0())
if("case"===d1)return new A.n3(c9.$0())
if("match"===d1){g=c8.$1(0)
a8=A.C(t.O,t.u)
for(s=t.j,m=1;o=m+1,o<d2.length;m+=2){if(!(o>=0&&o<d2.length))return A.a(d2,o)
a9=A.u(d2[o])
if(!(m>=0&&m<d2.length))return A.a(d2,m)
b0=d2[m]
o=J.G(s.b(b0)?b0:[b0])
while(o.m())a8.n(0,o.gp(),a9)}if(m<d2.length){if(!(m>=0&&m<d2.length))return A.a(d2,m)
b1=A.u(d2[m])}else b1=A.ag(c7)
return new A.n4(a8,g,b1)}if("coalesce"===d1)return new A.n5(c9.$0())
if("step"===d1){g=c8.$1(0)
b2=c8.$1(1)
b3=A.b([],t.n)
b4=A.b([],t.V)
for(m=2;s=m+1,s<d2.length;m+=2){if(!(m>=0&&m<d2.length))return A.a(d2,m)
o=d2[m]
if(!(typeof o=="number"))if(typeof o=="string")o=A.N(o)
else if(A.H(o))o=o?1:0
else o=c7
B.a.k(b3,o==null?0:o)
if(!(s>=0&&s<d2.length))return A.a(d2,s)
B.a.k(b4,A.u(d2[s]))}return new A.n6(g,b2,b3,b4)}if("interpolate"===d1||"interpolate-hcl"===d1||"interpolate-lab"===d1){s=J.n(d2)
if(s.gH(d2)&&t.j.b(s.gu(d2))){s=s.gu(d2)
s.toString
t.j.a(s)
b5=s}else b5=B.ab
s=t.n
b3=A.b([],s)
b4=A.b([],t.V)
for(m=2;o=m+1,o<d2.length;m+=2){if(!(m>=0&&m<d2.length))return A.a(d2,m)
k=d2[m]
if(!(typeof k=="number"))if(typeof k=="string")k=A.N(k)
else if(A.H(k))k=k?1:0
else k=c7
B.a.k(b3,k==null?0:k)
if(!(o>=0&&o<d2.length))return A.a(d2,o)
B.a.k(b4,A.u(d2[o]))}o=c8.$1(1)
A:{if("interpolate-hcl"===d1){k="hcl"
break A}if("interpolate-lab"===d1){k="lab"
break A}k=c7
break A}j=J.Z(b5)
if(J.k(j.gu(b5),"exponential")&&j.gj(b5)>1){b6=A.D(j.h(b5,1))
if(b6==null)b6=1}else b6=1
b7=J.k(j.gu(b5),"geometric")
if(J.k(j.gu(b5),"cubic-bezier")&&j.gj(b5)>4){s=A.b([],s)
for(m=1;m<5;++m){b8=j.h(b5,m)
if(!(typeof b8=="number"))if(typeof b8=="string")b8=A.N(b8)
else if(A.H(b8))b8=b8?1:0
else b8=c7
s.push(b8==null?0:b8)}}else s=c7
return A.pa(o,b3,b4,b6,s,b7,k)}if("to-string"===d1)return new A.n7(c8.$1(0))
if("number-format"===d1){b9=c8.$1(0)
if(d2.length>1){if(1<0||1>=d2.length)return A.a(d2,1)
s=t.f.b(d2[1])}else s=!1
if(s){if(1<0||1>=d2.length)return A.a(d2,1)
a7=t.f.a(d2[1])}else a7=B.u
return new A.n8(b9,A.u(a7.h(0,"min-fraction-digits")),A.u(a7.h(0,"max-fraction-digits")))}if("split"===d1)return new A.n9(c8.$1(0),c8.$1(1))
if("join"===d1)return new A.na(c8.$1(0),c8.$1(1))
if("hsl"===d1||"hsla"===d1)return new A.nb(c9.$0())
if("to-number"===d1)return new A.nd(c9.$0())
if("number"===d1||"string"===d1||"boolean"===d1||"object"===d1)return new A.ne(c9.$0(),d1)
if("to-boolean"===d1)return new A.nf(c8.$1(0))
if("to-color"===d1)return new A.ng(c9.$0())
if("array"===d1){s=J.n(d2)
if(d2.length>1&&typeof s.gu(d2)=="string"){o=s.gu(d2)
o.toString
A.U(o)
c0=o}else c0=c7
if(d2.length>2){if(1<0||1>=d2.length)return A.a(d2,1)
o=A.D(d2[1])
c1=o==null?c7:B.c.K(o)}else c1=c7
return new A.nh(s.gA(d2)?A.ag(c7):A.u(s.gS(d2)),c1,c0)}if("format"===d1){c2=A.b([],t.hc)
for(s=d2.length,o=t.j,k=t.f,j=t.N,b6=t.u,c3=0;c3<d2.length;d2.length===s||(0,A.h)(d2),++c3){b9=d2[c3]
if(k.b(b9)){b7=c2.length
if(b7===0)continue
if(0>=b7)return A.a(c2,-1)
c4=c2.pop()
b7=A.C(j,b6)
for(b8=b9.gag(),b8=b8.gt(b8);b8.m();){c5=b8.gp()
q=c5.a
p=c5.b
b7.n(0,A.t(q),A.u(p))}B.a.k(c2,new A.aM(c4.a,b7,c4.c))}else{b7=A.u(b9)
if(o.b(b9)){b8=J.n(b9)
b8=b8.gH(b9)&&J.k(b8.gu(b9),"image")}else b8=!1
B.a.k(c2,new A.aM(b7,B.cX,b8))}}return new A.ni(c2)}if("concat"===d1){s=A.b([],t.V)
for(o=d2.length,k=t.f,c3=0;c3<d2.length;d2.length===o||(0,A.h)(d2),++c3){b9=d2[c3]
if(!k.b(b9))s.push(A.u(b9))}return new A.nj(s)}if("upcase"===d1)return new A.nk(c8.$1(0))
if("downcase"===d1)return new A.nl(c8.$1(0))
if("+"===d1||"*"===d1||"min"===d1||"max"===d1)return new A.nm(d1,c9.$0())
if("-"===d1||"/"===d1||"%"===d1||"^"===d1){b9=c8.$1(0)
if(d2.length===1)return d0.$1(new A.no())
return new A.np(b9,c8.$1(1),d1)}if("round"===d1)return d0.$1(new A.nq())
if("floor"===d1)return d0.$1(new A.nr())
if("ceil"===d1)return d0.$1(new A.ns())
if("abs"===d1)return d0.$1(new A.nt())
if("sqrt"===d1)return d0.$1(A.xV())
if("ln"===d1)return d0.$1(A.xT())
if("log10"===d1)return d0.$1(new A.nu())
if("log2"===d1)return d0.$1(new A.nv())
if("e"===d1)return A.ag(2.718281828459045)
if("pi"===d1)return A.ag(3.141592653589793)
if("ln2"===d1)return A.ag(0.6931471805599453)
if("length"===d1)return new A.nw(c8.$1(0))
if("in"===d1){e=c8.$1(0)
return new A.nx(c8.$1(1),e)}if("at"===d1){c6=c8.$1(0)
return new A.nz(c8.$1(1),c6)}if("rgb"===d1||"rgba"===d1)return new A.nA(c9.$0())
return A.ag(c7)},
wp(a,b,c){var s,r,q,p,o,n,m,l,k,j
if(!isFinite(a)){if(isNaN(a))s="NaN"
else s=a<0?"-\u221e":"\u221e"
return s}s=Math.abs(a)
r=B.c.q(s)
q=B.d.aA(r,".")
p=!B.d.v(r,"e")&&r.length-q-1<=c?r:B.c.il(s,Math.min(c,20))
if(B.d.v(p,".")){s=B.d.aA(p,".")
o=new A.z(B.d.a5(p,0,s),B.d.am(p,s+1))}else o=new A.z(p,"")
n=o.a
m=o.b
for(;;){s=m.length
if(!(s>b&&B.d.cl(m,"0")))break
m=B.d.a5(m,0,s-1)}m=B.d.i6(m,b,"0")
l=new A.b6("")
for(s=n.length,k=0,j="";k<s;++k){if(k>0&&B.b.W(s-k,3)===0)j=l.a=j+","
j+=n[k]
l.a=j}p=m.length===0?l.q(0):l.q(0)+"."+m
return a<0&&B.d.v(p,A.hm("[1-9]"))?"-"+p:p},
rf(a){var s,r,q,p,o
if(t.j.b(a)){s=J.n(a)
s=(s.gj(a)===3||s.gj(a)===4)&&s.ae(a,new A.m_())}else s=!1
if(s){s=A.b([],t.n)
for(r=J.G(a);r.m();)s.push(A.ae(r.gp()))
if(A.aS(s,0,A.cf(3,"count",t.S),t.i).aF(0,new A.m0()))return null
r=s.length
q=r>3?s[3]:1
if(q<0||q>1)return null
if(0>=r)return A.a(s,0)
p=s[0]
if(1>=r)return A.a(s,1)
o=s[1]
if(2>=r)return A.a(s,2)
return new A.ab(p/255,o/255,s[2]/255,q)}return A.c4(a)},
pa(a,b,c,d,e,f,g){if(b.length===0)return A.ag(null)
return new A.mh(a,b,c,e,d,f,g)},
wb(a,b){var s,r,q,p,o,n,m=new A.lX()
for(s=0,r=1,q=0;q<24;++q){p=(s+r)/2
o=a.length
if(0>=o)return A.a(a,0)
n=a[0]
if(2>=o)return A.a(a,2)
n=m.$3(p,n,a[2])
if(typeof n!=="number")return n.eg()
if(n<b)s=p
else r=p}o=a.length
if(1>=o)return A.a(a,1)
n=a[1]
if(3>=o)return A.a(a,3)
return m.$3((s+r)/2,n,a[3])},
pd(a0){var s,r,q,p,o,n,m,l,k,j,i,h,g=a0.h(0,"property"),f=a0.h(0,"type"),e=a0.h(0,"default"),d=a0.h(0,"stops"),c=typeof g=="string",b=c?new A.ml(g):new A.mm(),a=J.al(f)
if(a.C(f,"identity")||!t.j.b(d)||J.d_(d))return new A.mn(b,e)
if(c&&J.pO(d,new A.mo()))return A.wh(a0,d)
s=[]
r=[]
for(q=J.G(d),p=t.j,o=t.f;q.m();){n=q.gp()
if(p.b(n)){m=J.n(n)
m=m.gj(n)<2||o.b(m.gu(n))}else m=!0
if(m)return A.ag(e)
m=J.n(n)
s.push(m.h(n,0))
r.push(m.h(n,1))}if(a.C(f,"categorical")){c=t.O
l=A.oQ(c,c)
A.ux(l,s,r)
return new A.mp(l,b,e)}k=B.a.ae(r,new A.mq())
q=A.b([],t.n)
for(p=s.length,j=0;j<s.length;s.length===p||(0,A.h)(s),++j){i=s[j]
if(typeof i=="number")o=i
else if(typeof i=="string")o=A.N(i)
else if(A.H(i))o=i?1:0
else o=null
q.push(o==null?0:o)}p=A.b([],t.V)
for(o=r.length,j=0;j<r.length;r.length===o||(0,A.h)(r),++j)p.push(A.ag(r[j]))
if(!a.C(f,"interval"))a=!k&&!a.C(f,"exponential")
else a=!0
if(a)return new A.mr(b,e,r,q)
a=A.D(a0.h(0,"base"))
if(a==null)a=1
h=A.pa(b,q,p,a,null,!1,A.bk(a0.h(0,"colorSpace")))
if(!c)return h
return new A.ms(g,h,e)},
wh(a,b){var s,r,q,p,o,n,m,l,k,j,i="colorSpace",h=t.W,g=A.C(t.i,h)
for(h=J.dX(b,h),s=h.$ti,h=new A.a0(h,h.gj(0),s.i("a0<y.E>")),r=t.f,s=s.i("y.E");h.m();){q=h.d
if(q==null)q=s.a(q)
p=J.Z(q)
o=p.gu(q)
o.toString
r.a(o)
n=o.h(0,"zoom")
if(typeof n=="number")m=n
else{if(typeof n=="string")n=A.N(n)
else if(A.H(n))n=n?1:0
else n=null
m=n}if(m==null)m=0
n=g.h(0,m)
if(n==null){n=[]
g.n(0,m,n)}o=o.h(0,"value")
B.a.k(n,[o,p.gj(q)>1?p.h(q,1):null])}h=g.$ti.i("an<1>")
l=A.a1(new A.an(g,h),h.i("f.E"))
B.a.aT(l)
if(J.k(a.h(0,"type"),"interval")){h=A.b([],t.V)
for(s=l.length,r=t.O,k=0;k<l.length;l.length===s||(0,A.h)(l),++k){j=l[k]
q=A.oQ(r,r)
q.B(0,a)
q.n(0,"stops",g.h(0,j))
h.push(A.pd(q))}return new A.m1(l,h)}h=A.b([],t.V)
for(s=l.length,r=t.O,k=0;k<l.length;l.length===s||(0,A.h)(l),++k){j=l[k]
h.push(A.pd(A.en(["type",a.h(0,"type"),"property",a.h(0,"property"),"default",a.h(0,"default"),"colorSpace",a.h(0,i),"stops",g.h(0,j)],r,r)))}s=A.D(a.h(0,"base"))
if(s==null)s=1
return A.pa(new A.m2(),l,h,s,null,!1,A.bk(a.h(0,i)))},
A:function A(a){var _=this
_.a=0
_.b=a
_.c=""
_.r=_.f=null},
lZ:function lZ(a,b){this.a=a
this.b=b},
m3:function m3(a){this.a=a},
nZ:function nZ(a){this.a=a},
o_:function o_(a){this.a=a},
nX:function nX(){},
nY:function nY(){},
nV:function nV(){},
nW:function nW(a){this.a=a},
mg:function mg(){},
m7:function m7(a){this.a=a},
m8:function m8(a){this.a=a},
m9:function m9(a){this.a=a},
ma:function ma(a){this.a=a},
mb:function mb(a,b,c){this.a=a
this.b=b
this.c=c},
mc:function mc(a,b,c){this.a=a
this.b=b
this.c=c},
md:function md(a,b,c){this.a=a
this.b=b
this.c=c},
me:function me(a,b,c){this.a=a
this.b=b
this.c=c},
mf:function mf(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
cL:function cL(a,b,c){this.a=a
this.b=b
this.c=c},
nQ:function nQ(){},
mD:function mD(a){this.a=a},
mC:function mC(a){this.a=a},
nF:function nF(a){this.a=a},
nG:function nG(a,b){this.a=a
this.b=b},
mE:function mE(a,b){this.a=a
this.b=b},
mF:function mF(a){this.a=a},
mG:function mG(a){this.a=a},
mR:function mR(a,b){this.a=a
this.b=b},
n1:function n1(a){this.a=a},
nc:function nc(a){this.a=a},
nn:function nn(){},
ny:function ny(){},
nB:function nB(){},
nC:function nC(a){this.a=a},
nD:function nD(a){this.a=a},
mH:function mH(a){this.a=a},
mB:function mB(){},
mI:function mI(a){this.a=a},
mJ:function mJ(){},
mK:function mK(a){this.a=a},
mL:function mL(a){this.a=a},
mM:function mM(a){this.a=a},
mN:function mN(a){this.a=a},
mO:function mO(a){this.a=a},
mP:function mP(a,b,c){this.a=a
this.b=b
this.c=c},
nE:function nE(a){this.a=a},
mQ:function mQ(a,b,c){this.a=a
this.b=b
this.c=c},
mS:function mS(){},
mT:function mT(){},
mU:function mU(a){this.a=a},
mV:function mV(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
mW:function mW(a,b,c){this.a=a
this.b=b
this.c=c},
mX:function mX(a,b){this.a=a
this.b=b},
mY:function mY(a,b){this.a=a
this.b=b},
mZ:function mZ(a,b,c){this.a=a
this.b=b
this.c=c},
n_:function n_(a){this.a=a},
n0:function n0(a){this.a=a},
n2:function n2(a){this.a=a},
n3:function n3(a){this.a=a},
n4:function n4(a,b,c){this.a=a
this.b=b
this.c=c},
n5:function n5(a){this.a=a},
n6:function n6(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
n7:function n7(a){this.a=a},
n8:function n8(a,b,c){this.a=a
this.b=b
this.c=c},
n9:function n9(a,b){this.a=a
this.b=b},
na:function na(a,b){this.a=a
this.b=b},
nb:function nb(a){this.a=a},
nd:function nd(a){this.a=a},
ne:function ne(a,b){this.a=a
this.b=b},
nf:function nf(a){this.a=a},
ng:function ng(a){this.a=a},
nh:function nh(a,b,c){this.a=a
this.b=b
this.c=c},
mA:function mA(a){this.a=a},
ni:function ni(a){this.a=a},
nj:function nj(a){this.a=a},
nk:function nk(a){this.a=a},
nl:function nl(a){this.a=a},
nm:function nm(a,b){this.a=a
this.b=b},
no:function no(){},
np:function np(a,b,c){this.a=a
this.b=b
this.c=c},
nq:function nq(){},
nr:function nr(){},
ns:function ns(){},
nt:function nt(){},
nu:function nu(){},
nv:function nv(){},
nw:function nw(a){this.a=a},
nx:function nx(a,b){this.a=a
this.b=b},
nz:function nz(a,b){this.a=a
this.b=b},
nA:function nA(a){this.a=a},
m_:function m_(){},
m0:function m0(){},
mh:function mh(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
lX:function lX(){},
ml:function ml(a){this.a=a},
mm:function mm(){},
mn:function mn(a,b){this.a=a
this.b=b},
mo:function mo(){},
mp:function mp(a,b,c){this.a=a
this.b=b
this.c=c},
mq:function mq(){},
mk:function mk(){},
mr:function mr(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ms:function ms(a,b,c){this.a=a
this.b=b
this.c=c},
m1:function m1(a,b){this.a=a
this.b=b},
m2:function m2(){},
tY(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=A.b([],t.n),g=A.b([],t.t),f=new A.hz(11,4096/b,h,g),e=a.length/11|0
for(s=0;r=s+2,r<e;s+=3)f.dE(0,a,s,s+1,r)
r=g.length
q=r*11
p=new Float32Array(q)
for(o=h.length,n=0,m=0;m<r;++m)for(l=g[m]*11,k=0;k<11;++k,n=j){j=n+1
i=l+k
if(!(i<o))return A.a(h,i)
i=h[i]
if(!(n>=0&&n<q))return A.a(p,n)
p[n]=i}return p},
fu:function fu(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
fQ:function fQ(a,b,c,d,e,f,g,h,i,j,k,l,m){var _=this
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
j1:function j1(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
j2:function j2(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
xK(a){var s,r,q,p,o,n,m,l,k
if(!(a instanceof A.bU))return new A.z(B.d.aH(J.bc(a==null?"":a)),null)
s=a.a
if(B.a.ae(s,new A.od()))return new A.z(B.d.aH(a.q(0)),null)
for(r=0,q="";p=s.length,r<p;++r){o=s[r].b
if(r===0)o=B.d.im(o)
if(r===s.length-1)o=B.d.io(o)
q=q+A.Q(57344)+A.Q(57600+r)
if(!(r<s.length))return A.a(s,r)
q=s[r].a==null?q+o:q+A.Q(57599)}n=[]
for(m=0;m<s.length;s.length===p||(0,A.h)(s),++m){l=s[m]
k=l.e
k=k==null?null:(B.c.Y(B.c.E(k.d,0,1)*255)<<24|B.c.Y(B.c.E(k.a,0,1)*255)<<16|B.c.Y(B.c.E(k.b,0,1)*255)<<8|B.c.Y(B.c.E(k.c,0,1)*255))>>>0
n.push([l.c,l.d,k,l.f,l.a])}return new A.z(q.charCodeAt(0)==0?q:q,n)},
pu(a){var s,r,q,p
if(!B.d.v(a,A.Q(57344)))return a
s=new A.b6("")
r=A.a1(new A.ar(a),t.J.i("f.E"))
for(q=0;q<r.length;++q){p=r[q]
if(p===57344){++q
continue}if(p===57599)continue
p=A.Q(p)
s.a+=p}p=s.a
return p.charCodeAt(0)==0?p:p},
bu:function bu(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
bU:function bU(a){this.a=a},
j9:function j9(){},
od:function od(){},
q6(a,b,c,d){var s=A.b([],t.ha),r=A.b([],t.r),q=b!=null
s=new A.bv(d,c,s,q,r)
s.d3(a)
if(q)s.r=A.uS(r,b)
return s},
u3(a){var s,r,q,p,o,n,m=a.length,l=m-2
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
fR(a){var s,r,q,p,o,n,m=J.n(a),l=m.gj(a)*2,k=new Float64Array(l)
for(m=m.gt(a),s=t.j,r=0;m.m();){q=m.gp()
if(!s.b(q)||J.X(q)<2)continue
p=r+1
o=J.n(q)
n=A.ae(o.h(q,0))
if(!(r<l))return A.a(k,r)
k[r]=(n+180)/360
r=p+1
o=A.pz(A.ae(o.h(q,1)))
if(!(p<l))return A.a(k,p)
k[p]=o}return r===l?k:A.cp(k,0,r)},
u4(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e={}
e.a=A.b([],t.n)
e.b=0
s=new A.je(e,b,c)
for(r=a.length,q=0,p=2;p<r;p+=2,q=h){o={}
n=a[p-2]
m=a[p-1]
l=a[p]-n
k=p+1
if(!(k<r))return A.a(a,k)
j=a[k]-m
i=Math.sqrt(l*l+j*j)
h=q+i
o.a=0
o.b=1
k=o.c=!0
g=new A.jd(o)
g.$2(-l,n- -1024)
g.$2(l,5120-n)
g.$2(-j,m- -1024)
g.$2(j,5120-m)
if(!o.c){s.$0()
continue}if(!(o.a>0)?e.a.length===0:k){s.$0()
k=o.a
e.b=q+i*k
f=e.a
B.a.k(f,n+l*k)
B.a.k(f,m+j*o.a)}k=e.a
B.a.k(k,n+l*o.b)
B.a.k(k,m+j*o.b)
if(o.b<1)s.$0()}s.$0()
return q},
u5(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c
for(s=t.n,r=a,q=0;q<4;++q){p=A.b([],s)
o=new A.jf(q)
n=r.length
if(n<6)return new Float64Array(0)
m=r[n-2]
l=r[n-1]
k=o.$2(m,l)
for(j=2===q,i=1===q,h=0===q,g=0;g<n;g+=2,k=c,l=d,m=f){f=r[g]
e=g+1
if(!(e<n))return A.a(r,e)
d=r[e]
c=o.$2(f,d)
if(c!==k){A:{if(h){e=(-128-m)/(f-m)
break A}if(i){e=(4224-m)/(f-m)
break A}if(j){e=(-128-l)/(d-l)
break A}e=(4224-l)/(d-l)
break A}B.a.k(p,m+(f-m)*e)
B.a.k(p,l+(d-l)*e)}if(c){B.a.k(p,f)
B.a.k(p,d)}}r=new Float64Array(A.a2(p))}return r},
bv:function bv(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=0
_.d=c
_.e=d
_.f=e
_.r=null},
je:function je(a,b,c){this.a=a
this.b=b
this.c=c},
jd:function jd(a){this.a=a},
jf:function jf(a){this.a=a},
hZ:function hZ(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
ia:function ia(a){this.a=a},
dF:function dF(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
xJ(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=new A.oc(a),e=A.b([],t.t)
for(s=!1,r=0;q=a.length,r<q;++r){if(!(r>=0))return A.a(a,r)
p=a[r]
o=B.Q.h(0,p)
if(o==null)o=0
n=!1
if(o===1){B.a.k(e,p)
continue}m=f.$1(r)
if(p===1604&&m!=null){if(m>>>0!==m||m>=a.length)return A.a(a,m)
l=B.cT.h(0,a[m])}else l=null
if(l!=null){k=l[s?1:0]
q=k===0
B.a.k(e,q?p:k)
j=r+1
m.toString
for(;j<m;++j){if(!(j<a.length))return A.a(a,j)
B.a.k(e,a[j])}if(q){if(!(m>=0&&m<a.length))return A.a(a,m)
q=a[m]}else q=-1
B.a.k(e,q)
r=m
s=n
continue}if(s)i=o===2||o===3||o===5
else i=!1
if(o===2||o===4||o===5)if(m!=null){if(m>>>0!==m||m>=a.length)return A.a(a,m)
q=B.Q.h(0,a[m])
if(q==null)q=0
q=q===2||q===3||q===5
h=q}else h=n
else h=n
g=B.cU.h(0,p)
if(g==null)k=0
else{if(i)q=h?3:1
else q=h?2:0
k=g[q]}B.a.k(e,k===0?p:k)
s=h}return e},
oc:function oc(a){this.a=a},
yb(a){var s,r,q,p
for(s=new A.da(a),r=t.gS,s=new A.a0(s,s.gj(0),r.i("a0<y.E>")),r=r.i("y.E");s.m();){q=s.d
if(q==null)q=r.a(q)
if(!(q>=1424&&q<=2303))p=q>=64285&&q<=65276
else p=!0
if(p)return!0
if(q>=65&&q<=591)return!1}return!1},
u6(a,b){var s,r,q,p,o,n=t.S,m=A.b([],t.oJ)
for(s=a.$ti,r=new A.a0(a,a.gj(0),s.i("a0<y.E>")),s=s.i("y.E");r.m();){q=r.d
m.push(new A.c3(A.v4(q==null?s.a(q):q,0),null))}s=A.b([],t.s)
for(r=a.a,q=J.n(r),p=b!=null,o=0;o<q.gj(r);++o)s.push(A.q7(p&&o<J.X(b.a)?b.$ti.y[1].a(J.aP(b.a,o)):""))
return new A.ji(m,s,A.C(t.N,t.L),A.C(n,t.kJ),A.C(n,t.gp))},
q7(a){var s,r,q,p,o=A.b([],t.s)
for(s=B.d.cK(a.toLowerCase(),A.hm("[\\s_-]+")),r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q]
if(p.length!==0&&!B.de.v(0,p))o.push(p)}return B.a.bE(o)},
u7(a){return B.b.E(B.c.Y(a/100)*100,100,900)},
pg(c5,c6,c7,c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1=1751474532,c2=t.n,c3=A.b([],c2),c4=J.n(c6)
if(c4.gA(c6))return new A.z(c3,0)
for(s=A.ts(c6).d,r=s.length,q=c8!==0,p=c5.c,o=J.Z(c9),n=c5.r,m=c7/100,l=t.S,k=t.gc,j=t.R,i=t.q,h=0,g=0;g<s.length;s.length===r||(0,A.h)(s),++g){f=s[g]
e=c4.I(c6,f.a,f.b)
d=(f.c&1)===1
c=A.v3(e)
b=J.G(d?new A.bi(c,A.M(c).i("bi<1>")):c)
a=!d
a0=J.Z(e)
while(b.m()){a1=b.gp()
a2=a0.I(e,a1.a,a1.b)
a4=o.gt(c9)
a1=a1.c
a5=0
for(;;){if(!a4.m()){a3=null
break}a5=a4.gp()
a6=a5*1000+B.b.E(B.c.Y(m)*100,100,900)
a7=n.h(0,a6)
if(a7==null){a7=new A.hr(c5.hH(a5,c7),A.C(l,k),new A.jg(A.b([],j),A.b([],i),B.v))
n.n(0,a6,a7)
a6=a7}else a6=a7
a8=a6.ei(a2,d?B.k:B.v,a1)
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
b5=b4==null?null:new A.o(a4.a.a,b4.c)
if(b5==null)A.p(A.i("font has no "+A.aD(A.cH(c1))+" table"))
a1=a1.c=A.ui(b5)}else a1=a4
b6=a1.f
for(a1=a3.a,a4=a3.b,b7=0;b7<a1.length;++b7){b8=a1[b7]
if(!(b7<a4.length))return A.a(a4,b7)
b9=a4[b7]
c0=b9.a/b6
a6=b8.a
if(a6!==0)B.a.B(c3,A.b([a5,a6,h+b9.c/b6,-b9.d/b6,c0],c2))
h+=c0
if(a&&q&&c0>0)h+=c8}}}return new A.z(c3,h)},
wc(a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=t.fC,c=A.b([],d),b=t.t,a=A.b([],b)
for(s=a1.length,r=0;r<a1.length;a1.length===s||(0,A.h)(a1),++r){q=a1[r]
if(q===32||q===160||q===12288){if(a.length!==0)B.a.k(c,a)
a=A.b([],b)}else B.a.k(a,q)}if(a.length!==0)B.a.k(c,a)
if(c.length<2)return A.b([a1],d)
s=A.pg(a0,B.aW,a2,a3,a5)
p=s==null?null:s.b
if(p==null)p=0.25
s=A.b([],t.n)
for(o=c.length,r=0;r<c.length;c.length===o||(0,A.h)(c),++r){n=c[r]
m=A.pg(a0,n,a2,a3,a5)
m=m==null?null:m.b
s.push(m==null?n.length*0.5:m)}l=B.a.dV(s,0,new A.lY(),t.i)+p*(c.length-1)
if(l<=a4)return A.b([a1],d)
k=B.c.bz(l/a4)
j=l/k
i=A.b([],d)
h=A.b([],b)
for(d=k-1,g=0,f=0;f<c.length;++f){o=h.length===0
m=o?0:p
if(!(f<s.length))return A.a(s,f)
e=s[f]
if(!o){o=g+(m+e)
o=o>j&&o-j>j-g&&i.length<d}else o=!1
if(o){B.a.k(i,h)
h=A.b([],b)
g=0}if(h.length!==0)B.a.k(h,32)
if(!(f<c.length))return A.a(c,f)
B.a.B(h,c[f])
o=h.length
if(!(f<c.length))return A.a(c,f)
o=o===c[f].length?0:p
if(!(f<s.length))return A.a(s,f)
g+=o+s[f]}if(h.length!==0)B.a.k(i,h)
return i},
rF(a,b,c,d,e,f,g,h,i){var s,r,q,p,o={},n=a.i5(h),m=A.b([],t.fC)
o.a=A.b([],t.t)
s=new A.oe(o,g,f,m,a,i,d,n)
for(r=new A.dw(b);r.m();){q=r.d
if(q===10||q===13||q===8232||q===8233){if(g)B.a.k(o.a,32)
else s.$0()
continue}p=o.a
B.a.k(p,q===9?32:q)}s.$0()
return A.wK(a,m,i,d,e,c,n)},
wK(a4,a5,a6,a7,a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=A.b([],t.k_)
for(s=a5.length,r=0;r<a5.length;a5.length===s||(0,A.h)(a5),++r){q=A.pg(a4,a5[r],a6,a7,b0)
if(q==null)return null
B.a.k(a3,q)}p=B.a.dV(a3,0,new A.mj(),t.i)
s=A.E(J.it(b0))
o=a4.c
if(!(s>=0&&s<o.length))return A.a(o,s)
n=o[s]
m=n.a.b8(1751672161)
l=n.ghK().f
s=m.b+4
m.l(s,2)
o=m.a
k=o.getInt16(s,!1)/l
s=m.b+6
m.l(s,2)
j=(a8-k- -o.getInt16(s,!1)/l)/2
s=t.n
i=A.b([],s)
for(o=A.qd(a3,0,t.hT),h=J.G(o.a),g=o.b,o=new A.bx(h,g,A.r(o).i("bx<1>")),f=a9>0,e=a9<0;o.m();){d=o.c
d=d>=0?new A.z(g+d,h.gp()):A.p(A.aG())
c=d.b
b=c.a
a=c.b
A:{if(e){a0=0
break A}if(f){a0=p-a
break A}a0=(p-a)/2
break A}a1=d.a*a8+j+k
for(d=J.n(b),a2=0;a2<d.gj(b);a2+=5)B.a.B(i,A.b([d.h(b,a2),d.h(b,a2+1),d.h(b,a2+2)+a0,d.h(b,a2+3)+a1,d.h(b,a2+4)],s))}s=new Float32Array(A.a2(i))
o=a3.length
return new A.ke(s,p,o*a8,o)},
ji:function ji(a,b,c,d,e){var _=this
_.c=a
_.d=b
_.e=c
_.f=d
_.r=e},
jk:function jk(a,b){this.a=a
this.b=b},
jj:function jj(a,b,c){this.a=a
this.b=b
this.c=c},
ke:function ke(a,b,c,d){var _=this
_.d=a
_.e=b
_.f=c
_.r=d},
lY:function lY(){},
oe:function oe(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
mj:function mj(){},
u9(a){var s,r,q,p,o,n=A.b([],t.ez),m=a.length,l=new A.id(a,0,m)
while(l.b<m){s=l.D()
r=s&7
if(s>>>3===1&&r===2){q=l.e0()
for(p=q.c;q.b<p;){s=q.D()
o=s&7
if(s>>>3===3&&o===2)B.a.k(n,A.u8(q.e0()))
else q.T(0,o)}}else l.T(0,r)}return n},
u8(a){var s,r,q,p,o,n,m
new Uint8Array(0)
for(s=a.c,r=a.a,q=0,p=0;a.b<s;){o=a.D()
switch(o>>>3){case 1:q=a.D()
break
case 2:n=a.D()
m=a.b
A.hJ(r,m,m+n)
a.b+=n
break
case 3:a.D()
break
case 4:a.D()
break
case 5:a.D()
break
case 6:a.D()
break
case 7:p=a.D()
break
default:a.T(0,o&7)}}return new A.bz(q,p)},
bz:function bz(a,b){this.a=a
this.r=b},
id:function id(a,b,c){this.a=a
this.b=b
this.c=c},
jl:function jl(a,b,c,d,e,f,g,h,i){var _=this
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
jm:function jm(a,b){this.a=a
this.b=b},
fT(a,b){var s=new A.jp(),r=s.$1(a)
s=s.$1(b)
if(typeof s!=="number")return s.aJ()
if(typeof r!=="number")return r.bI()
return r+s*4096},
ug(a){var s,r,q,p,o,n,m,l
A:{s=a instanceof A.bf
r=null
q=!1
if(s){p=a.cx==null
if(p){r=!a.dx
q=r}o=p}else{p=null
o=!1}if(q){q=0
break A}if(s)q=o?r:!a.dx
else q=!1
if(q){q=2
break A}if(a instanceof A.d8){q=3
break A}if(a instanceof A.ct){q=6
break A}q=a instanceof A.dq
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
qa(a,b){var s,r
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
qb(f7,f8,f9,g0,g1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5=null,f6=new A.A(B.h)
f6.a=g1
s=A.C(t.S,t.ke)
for(r=f8.length,q=t.hD,p=0;p<f8.length;f8.length===r||(0,A.h)(f8),++p){o=f8[p]
n=o.a
m=s.h(0,n)
if(m==null){m=A.b([],q)
s.n(0,n,m)
n=m}else n=m
B.a.k(n,o)}l=new A.bd(new Float64Array(16384))
k=new A.ju(new Uint32Array(16384))
j=A.b([],t.cm)
r=t.t
i=A.b([],r)
q=f7.at
n=q.length+1
h=new Int32Array(n)
g=A.b([],t.iv)
for(m=t.dn,f=t.if,e=t.n,d=0,c=0,b=0;a=q.length,b<a;++b){a=k.b
if(!(b<n))return A.a(h,b)
h[b]=a
a0=q[b]
a1=A.ug(a0)
if(a1<0)continue
a=s.h(0,a0.b)
if(a==null)a=B.a7
a2=a.length
a3=a1!==0
a4=a1*16384
a5=a1!==1
a6=a1===5
a7=a1!==3
a8=a1===6
a9=a1!==4
b0=a1===2
b1=a0 instanceof A.d8
p=0
for(;p<a.length;a.length===a2||(0,A.h)(a),++p){o=a[p]
b2=o.b
b3=!a7||a8
if(!b3&&b2.d.length===0)continue
if(b3&&b2.b.length===0)continue
b4=j.length
if(b4-c>=80){B.a.B(i,A.b([d,k.b-d,c],r))
d=k.b
c=j.length
b4=c}b5=b4-c
b4=o.c
B.a.k(j,new A.z(b,b4))
b6=B.b.N(l.b,6)
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
f6.sah(b4==null?B.h:b4)
b4=a0.dy
b4=b4==null?f5:b4.$1(f6)
if(!(typeof b4=="number"))if(typeof b4=="string")b4=A.N(b4)
else if(A.H(b4))b4=b4?1:0
else b4=f5
if(b4==null)b4=0
c8=Math.max(0,b4)}else{c7=0
c8=0}for(b4=b5+a4,c9=0;c9<c5;++c9){d0=B.b.N(l.b,6)
for(c6=c9*2,d1=c6+1,d2=0;d2<4;++d2){d3=B.aX[d2]
if(!(c6<c3))return A.a(b7,c6)
d4=b7[c6]
if(!(d1<c3))return A.a(b7,d1)
l.ap(d4,b7[d1],A.fT(d3.a,d3.b),c8)
l.b3(b4,c7)}for(d2=0;d2<6;++d2)k.k(0,d0+B.cO[d2])}continue}d5=!a5||!a9||a6?g0:f9
if(d5>0){d6=A.b([],e)
b4=A.b([],r)
d7=new A.hz(8,4096/d5,d6,b4)
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
e3=A.qa(c4,c9)
if(!(e2<c6))return A.a(d8,e2)
d8[e2]=e3}e8=b2.d
for(c3=e8.length,e9=0;c6=e9+2,c6<c3;e9+=3){if(!(e9<c3))return A.a(e8,e9)
d3=e8[e9]
d9=e9+1
if(!(d9<c3))return A.a(e8,d9)
d7.dE(0,d8,d3,e8[d9],e8[c6])}for(c3=b5+a4,c9=0;c6=d6.length,c9<(c6/8|0);++c9){f0=c9*8
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
e2=A.fT(e1,d6[e2])
c6=e2}if(c2){e1=f0+4
if(!(e1<d6.length))return A.a(d6,e1)
e1=d6[e1]}else if(d4)e1=0
else{e1=f0+4
e2=d6.length
if(!(e1<e2))return A.a(d6,e1)
e1=d6[e1]
e3=f0+5
if(!(e3<e2))return A.a(d6,e3)
e3=A.fT(e1,d6[e3])
e1=e3}l.ap(d3,d9,c6,e1)
e1=f0+7
if(!(e1<d6.length))return A.a(d6,e1)
e1=B.b.E(B.c.Y(d6[e1]),0,127)
if(d1)c6=0
else{c6=f0+6
if(!(c6<d6.length))return A.a(d6,c6)
c6=d6[c6]}l.b3(c3+e1*131072,c6)}for(c3=b4.length,d2=0;d2<b4.length;b4.length===c3||(0,A.h)(b4),++d2)k.k(0,b6+b4[d2])
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
e3=A.fT(e3,b9[e0])
e2=e3}if(c2){if(!(d4<c1.length))return A.a(c1,d4)
e0=c1[d4]}else if(d1)e0=0
else{e3=c0.length
if(!(d4<e3))return A.a(c0,d4)
e4=c0[d4]
if(!(e0<e3))return A.a(c0,e0)
e0=A.fT(e4,c0[e0])}l.ap(d9,e1,e2,e0)
e0=A.qa(c4,c9)
if(b4)d4=0
else{d4+=c2?1:0
if(!(d4<c1.length))return A.a(c1,d4)
d4=c1[d4]}l.b3(c6+e0*131072,d4)}for(b4=b2.d,c3=b4.length,d2=0;d2<c3;++d2)k.k(0,b6+b4[d2])
f1=b2.a
if((!a3||b0)&&f1!=null&&f.a(a0).db!=null){f2=i.length/3|0
if(g.length!==0&&B.a.gS(g).a===b&&B.a.gS(g).b===f2)f3=B.a.gS(g).c
else{B.a.k(g,new A.aM(b,f2,A.b([],r)))
f3=B.a.gS(g).c}for(b4=f1.length,d2=0;d2<b4;++d2)B.a.k(f3,b6+f1[d2])}}}q=k.b
if(q===0)return f5
if(!(a<n))return A.a(h,a)
h[a]=q
B.a.B(i,A.b([d,q-d,c],r))
f4=A.b([],r)
for(q=g.length,p=0;p<g.length;g.length===q||(0,A.h)(g),++p){n=g[p]
f3=n.c
m=J.n(f3)
if(m.gA(f3))continue
B.a.B(f4,A.b([n.a,n.b,k.b,m.gj(f3)],r))
for(n=m.gt(f3);n.m();)k.k(0,n.gp())}r=new Float32Array(A.a2(A.cp(l.a,0,l.b)))
q=B.S.I(k.a,0,k.b)
n=new Int32Array(A.a2(i))
m=new Int32Array(A.a2(f4))
return new A.jo(m,h,r,q,j,n)},
jo:function jo(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
jp:function jp(){},
uD(a){var s,r,q,p,o=A.C(t.N,t.dl),n=a.length,m=new A.cd(a,0,n)
while(m.b<n){s=m.D()
if(s===26){r=m.D()
q=m.b
p=A.uB(a,q,q+r)
o.n(0,p.a,p)
m.b+=r}else m.T(0,s&7)}return new A.jI(o)},
uB(a,b,c){var s,r,q,p,o,n=A.b([],t.s),m=[],l=A.b([],t.ef),k=new A.cd(a,b,c)
for(s="",r=4096;k.b<c;){q=k.D()
switch(q){case 10:s=k.bL()
break
case 18:p=k.D()
o=k.b
B.a.k(l,A.uA(a,o,o+p))
k.b+=p
break
case 26:B.a.k(n,k.bL())
break
case 34:p=k.D()
o=k.b
m.push(A.uC(a,o,o+p))
k.b+=p
break
case 40:r=k.D()
break
default:k.T(0,q&7)}}return new A.es(s,r,n,m,l)},
uC(a,b,c){var s,r,q,p,o=new A.cd(a,b,c)
for(s=null;o.b<c;){r=o.D()
switch(r){case 10:s=o.bL()
break
case 21:q=o.b
p=A.oH(a,q,q+4).getFloat32(0,!0)
o.b+=4
s=p
break
case 25:q=o.b
p=A.oH(a,q,q+8).getFloat64(0,!0)
o.b+=8
s=p
break
case 32:case 40:s=o.D()
break
case 48:p=o.D()
s=(p&1)===0?B.b.N(p,2):-B.b.N(p+1,2)
break
case 56:s=o.D()!==0
break
default:o.T(0,r&7)}}return s},
uA(a,b,c){var s,r,q,p,o,n,m,l,k=new A.cd(a,b,c)
for(s=0,r=null,q=0,p=0,o=0,n=0;k.b<c;){m=k.D()
switch(m){case 8:r=k.D()
break
case 18:l=k.D()
q=k.b
p=q+l
k.b=p
break
case 24:s=k.D()
break
case 34:l=k.D()
o=k.b
n=o+l
k.b=n
break
default:k.T(0,m&7)}}return new A.er(a,s,r,q,p,o,n)},
jI:function jI(a){this.a=a},
es:function es(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
er:function er(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
fS:function fS(a,b){this.a=a
this.b=0
this.c=b},
cd:function cd(a,b,c){this.a=a
this.b=b
this.c=c},
qv(a){var s=A.b([],t.n),r=A.b([],t.b),q=A.b([],t.ot),p=new A.hg(s,r,q)
p.c1(a)
return s.length===0&&r.length===0&&q.length===0?null:p},
jQ(a){var s,r,q,p=t.n,o=A.b([],p),n=t.j
if(n.b(a))for(s=J.G(a);s.m();){r=s.gp()
if(n.b(r)){q=J.n(r)
q=q.gj(r)>=2&&typeof q.h(r,0)=="number"&&typeof q.h(r,1)=="number"}else q=!1
if(q){q=J.n(r)
B.a.B(o,A.b([A.ae(q.h(r,0)),A.ae(q.h(r,1))],p))}}return o},
uO(a,b,c,d,e,f,g,h){var s=new A.jP(),r=s.$6(e,f,g,h,a,b),q=s.$6(e,f,g,h,c,d),p=s.$6(a,b,c,d,e,f),o=s.$6(a,b,c,d,g,h)
return r*q<0&&p*o<0},
qu(a,b,c){var s,r,q,p,o,n,m,l,k
for(s=J.n(c),r=s.gj(c)-2,q=!1,p=0;p<s.gj(c);o=p+2,r=p,p=o){n=s.h(c,p)
m=s.h(c,p+1)
l=s.h(c,r)
k=s.h(c,r+1)
if(m>b!==k>b&&a<(l-n)*(b-m)/(k-m)+n)q=!q}return q},
uN(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=J.n(a)
if(e.gj(a)<2||J.X(b)<2)return 1/0
s=e.gj(a)<4?1:e.gj(a)-2
r=J.n(b)
q=r.gj(b)<4?1:r.gj(b)-2
for(p=1/0,o=0;o<s;o+=2){n=e.h(a,o)*c
m=e.h(a,o+1)
l=e.gj(a)<4?n:e.h(a,o+2)*c
k=e.gj(a)<4?m:e.h(a,o+3)
for(j=0;j<q;j+=2){i=r.h(b,j)*c
h=r.h(b,j+1)
g=r.gj(b)<4?i:r.h(b,j+2)*c
f=A.uP(n,m,l,k,i,h,g,r.gj(b)<4?h:r.h(b,j+3))
if(f<p)p=f}}return p},
uP(a,b,c,d,e,f,g,h){var s=new A.jR(),r=s.$6(e,f,g,h,a,b),q=s.$6(e,f,g,h,c,d),p=s.$6(a,b,c,d,e,f),o=s.$6(a,b,c,d,g,h)
if(!(r>0&&q<0))s=r<0&&q>0
else s=!0
if(s)if(!(p>0&&o<0))s=p<0&&o>0
else s=!0
else s=!1
if(s)return 0
return Math.min(Math.min(A.hh(a,b,e,f,g,h),A.hh(c,d,e,f,g,h)),Math.min(A.hh(e,f,a,b,c,d),A.hh(g,h,a,b,c,d)))},
hh(a,b,c,d,e,f){var s=e-c,r=f-d,q=s*s+r*r,p=q===0?0:B.c.E(((a-c)*s+(b-d)*r)/q,0,1),o=a-c-s*p,n=b-d-r*p
return Math.sqrt(o*o+n*n)},
hg:function hg(a,b,c){this.a=a
this.b=b
this.c=c},
jT:function jT(){},
jP:function jP(){},
jS:function jS(a,b){this.a=a
this.b=b},
jR:function jR(){},
qc(a,b){return new A.jt(a,b)},
cF:function cF(a,b){this.a=a
this.b=b},
jt:function jt(a,b){this.a=a
this.b=b},
pA(a,b){var s=0,r=A.aw(t.o)
var $async$pA=A.ax(function(c,d){if(c===1)return A.at(d,r)
for(;;)switch(s){case 0:return A.au(null,r)}})
return A.av($async$pA,r)},
o7(a){var s=0,r=A.aw(t.p),q,p,o,n
var $async$o7=A.ax(function(b,c){if(b===1)return A.at(c,r)
for(;;)switch(s){case 0:p=v.G
o=A.aV(A.aV(A.aV(new p.Blob(A.b([a],t.aA))).stream()).pipeThrough(A.aV(new p.DecompressionStream("gzip"))))
n=A
s=3
return A.Y(A.pv(A.aV(A.aV(new p.Response(o)).arrayBuffer()),t.eb),$async$o7)
case 3:q=n.oU(c,0,null)
s=1
break
case 1:return A.au(q,r)}})
return A.av($async$o7,r)},
ex:function ex(){},
jK:function jK(a,b){this.a=a
this.b=b},
jJ:function jJ(a){this.a=a},
j4:function j4(a){this.a=a},
pe(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=null,e=new A.b6(""),d=[null]
for(s=J.G(a),r=t.e7,q=t.f,p=t.bW,o=t.p,n=t.kI,m=t.hM,l=t.pk;s.m();){k=s.gp()
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
continue}j=A.dN(k)
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
d.push(A.ip(i,i,b))
continue}j=m.b(k)
i=j?k:f
if(j){e.a+="S"
d.push(A.ip(i,i,b))
continue}j=n.b(k)
i=j?k:f
if(j){e.a+="D"
d.push(A.ip(i,i,b))
continue}j=o.b(k)
i=j?k:f
if(j){e.a+="U"
d.push(A.ip(i,i,b))
continue}j=p.b(k)
i=j?k:f
if(j){e.a+="I"
d.push(A.ip(i,i,b))
continue}j=q.b(k)
i=j?k:f
if(j){e.a+="m"
j=[]
for(h=i.gag(),h=h.gt(h);h.m();){g=h.gp()
B.a.B(j,[g.a,g.b])}d.push(A.pe(j,b))
continue}j=r.b(k)
i=j?k:f
if(j){e.a+="l"
d.push(A.pe(i,b))
continue}throw A.e(A.aQ("A "+J.pQ(k).q(0)+" cannot be sent to a worker",f))}s=e.a
B.a.n(d,0,s.charCodeAt(0)==0?s:s)
return d},
ip(a,b,c){var s
if(a.byteOffset===0&&a.byteLength===J.th(J.pP(a))&&a.byteLength>0){s=t.eb.a(J.pP(a))
if(!B.a.aF(c,new A.mx(s)))B.a.k(c,s)}return b},
pc(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(0<0||0>=a.length)return A.a(a,0)
s=a[0]
s.toString
A.U(s)
r=s.length
q=A.T(r,null,!0,t.O)
for(p=t.dM,o=t.da,n=t.ho,m=t.g_,l=t.nZ,k=t.bi,j=0;j<r;j=i){i=j+1
if(!(i>=0&&i<a.length))return A.a(a,i)
h=a[i]
g=s[j]
A:{if("n"===g){f=null
break A}if("b"===g){h.toString
A.p5(h)
f=h
break A}if("s"===g){h.toString
A.U(h)
f=h
break A}if("i"===g){h.toString
h=A.E(A.cW(h))
f=h
break A}if("d"===g){h.toString
A.cW(h)
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
f=A.wN(A.pc(p.a(h)))
break A}h.toString
f=A.pc(p.a(h))
break A}B.a.n(q,j,f)}return q},
wN(a){var s,r,q,p,o=t.O
o=A.C(o,o)
for(s=0;r=a.length,s<r;s+=2){q=a[s]
p=s+1
if(!(p<r))return A.a(a,p)
o.n(0,q,a[p])}return o},
mx:function mx(a){this.a=a},
uR(a,b,c){var s,r,q,p,o,n,m,l,k,j
for(s=0,r=1,q=0;q<a;++q){s+=r
r*=4}p=a===0?0:B.b.ab(1,a-1)
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
uQ(a,b){var s,r,q=a.length,p=q-1
for(s=0;s<=p;){r=B.b.M(s+p,1)
if(!(r<q))return A.a(a,r)
if(a[r].a<=b)s=r+1
else p=r-1}if(p<0)q=null
else{if(!(p<q))return A.a(a,p)
q=a[p]}return q},
eA(a,b){var s=0,r=A.aw(t.p),q,p
var $async$eA=A.ax(function(c,d){if(c===1)return A.at(d,r)
for(;;)switch(s){case 0:if(0===b||1===b){p=a
s=3
break}s=2===b?4:5
break
case 4:s=6
return A.Y(A.o7(a),$async$eA)
case 6:p=d
s=3
break
case 5:p=A.p(B.aO)
case 3:q=p
s=1
break
case 1:return A.au(q,r)}})
return A.av($async$eA,r)},
qw(a){var s,r,q,p,o,n,m,l,k,j,i,h,g={}
g.a=0
s=new A.jV(g,a)
r=s.$0()
q=t.S
p=A.T(r,0,!1,q)
o=A.T(r,0,!1,q)
n=A.T(r,0,!1,q)
for(m=0,l=0;l<r;++l){q=s.$0()
if(typeof q!=="number")return A.ah(q)
m+=q
B.a.n(p,l,m)}for(l=0;l<r;++l)B.a.n(o,l,s.$0())
for(l=0;l<r;++l)B.a.n(n,l,s.$0())
k=A.b([],t.mE)
for(j=0,l=0;l<r;++l){i=s.$0()
h=i===0&&l>0?j:i-1
q=n[l]
j=h+q
B.a.k(k,new A.eY(p[l],o[l],h,q))}return k},
jU:function jU(a,b,c,d){var _=this
_.a=a
_.c=b
_.d=c
_.r=_.f=null
_.w=d},
jW:function jW(a){this.a=a},
jV:function jV(a,b){this.a=a
this.b=b},
i5:function i5(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
eY:function eY(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
vs(a){var s,r,q,p,o,n,m,l,k=J.n(a),j=k.h(a,0)
j.toString
A.E(j)
s=new A.l9(a)
r=new A.l8(a)
q=k.h(a,1)
A:{if("build"===q){p=s.$0()
o=k.h(a,6)
o.toString
A.E(o)
n=p.a
m=p.b
p=p.c
k=k.h(a,5)
k.toString
j=new A.e1(new A.b7(n,m,p,o),A.E(k),j)
k=j
break A}if("find"===q){p=s.$0()
o=r.$1(5)
n=r.$1(6)
m=r.$1(7)
l=r.$1(8)
j=new A.ed(p,o,n,m,l,k.h(a,9)==null?null:new A.z(r.$1(9),r.$1(10)),j)
k=j
break A}if("cluster"===q){p=k.h(a,2)
p.toString
p=A.tV(B.cn,A.U(p),t.j8)
o=k.h(a,3)
o.toString
A.E(o)
n=k.h(a,4)
n.toString
A.E(n)
k=k.h(a,5)
k.toString
j=new A.dZ(p,o,n,A.E(k),j)
k=j
break A}k=A.p(A.aQ("No worker request is called "+A.t(q),null))}return k},
la:function la(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
cb:function cb(){},
l9:function l9(a){this.a=a},
l8:function l8(a){this.a=a},
e1:function e1(a,b,c){this.b=a
this.c=b
this.a=c},
ed:function ed(a,b,c,d,e,f,g){var _=this
_.b=a
_.c=b
_.d=c
_.e=d
_.f=e
_.r=f
_.a=g},
bR:function bR(a,b){this.a=a
this.b=b},
dZ:function dZ(a,b,c,d,e){var _=this
_.b=a
_.c=b
_.d=c
_.e=d
_.a=e},
aE:function aE(){},
hH:function hH(){},
hE:function hE(a,b){this.c=a
this.a=b},
hG:function hG(a,b){this.c=a
this.a=b},
ec:function ec(a,b){this.b=a
this.a=b},
e3:function e3(a,b){this.b=a
this.a=b},
d9:function d9(a,b){this.b=a
this.a=b},
fA:function fA(a,b,c){this.a=a
this.b=b
this.c=c},
hF:function hF(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
xZ(c2,c3,c4,c5,c6,c7,c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1=new A.A(B.h)
c1.a=c8
s=new Float64Array(4096)
r=t.t
q=A.b([],r)
p=new A.fS(s,q)
o=A.b([],t.cb)
n=new A.om(c8)
for(s=J.G(c2),m=t.bs,l=m.i("a0<a_.E>"),k=c3.at,j=c3.as,i=m.i("a_.E"),h=c3.ax,g=t.s,f=t.A,e=c3.ay;s.m();){d=s.gp()
c=A.b([],r)
for(b=0;b<k.length;++b){a=k[b].b
if(!(a>=0&&a<j.length))return A.a(j,a)
a=j[a]
a0=!1
if(a.c===c4)if(a.d===d.gaB()){if(!(b<k.length))return A.a(k,b)
a=k[b]
a=n.$2(a.c,a.d)}else a=a0
else a=a0
if(a)c.push(b)}a=A.b([],r)
for(b=0;b<h.length;++b){a0=h[b].b
a1=!1
if(a0.b===c4)if(a0.c===d.gaB()){if(!(b<h.length))return A.a(h,b)
a0=h[b].b
a0=n.$2(a0.z,a0.Q)}else a0=a1
else a0=a1
if(a0)a.push(b)}if(c.length===0&&a.length===0)continue
a2=4096/d.gcm()
a3=c5/a2
a4=c6/a2
a5=c7/a2
if(!(c4>=0&&c4<e.length))return A.a(e,c4)
a6=e[c4]
a7=a6 instanceof A.bX?null:a6.co(d.gaB())
for(a0=d.gbA(),a1=a0.length,a8=a7!=null,a9=0;a9<a0.length;a0.length===a1||(0,A.h)(a0),++a9){b0=a0[a9]
p.b=0
B.a.aa(q)
b0.cu(p)
A:{if(f.b(c9)){b1=c9.a/a2
b2=c9.b/a2
b2=A.x6(b0.gL(),p,a3-b1,a4-b2,a3+b1,a4+b2)
b1=b2
break A}if(c9==null){b1=A.wq(b0.gL(),p,a3,a4,a5)
break A}b1=null}if(!b1)continue
b3=b0.bv(d)
if(a8&&b3.h(0,a7)!=null)b3.n(0,"$id",b3.h(0,a7))
c1.sah(b3)
b4=b0.gL()
B:{if(1===b4){b1="Point"
break B}if(2===b4){b1="LineString"
break B}b1="Polygon"
break B}c1.c=b1
b5=A.b([],g)
for(b1=new A.bi(a,m),b1=new A.a0(b1,b1.gj(0),l),b6=-1;b1.m();){b2=b1.d
if(b2==null)b2=i.a(b2)
if(b2>>>0!==b2||b2>=h.length)return A.a(h,b2)
if(!h[b2].hE(c1))continue
if(b2>>>0!==b2||b2>=h.length)return A.a(h,b2)
B.a.k(b5,h[b2].a)
if(b6<0)b6=k.length+b2}for(b1=new A.bi(c,m),b1=new A.a0(b1,b1.gj(0),l);b1.m();){b2=b1.d
b7=b2==null?i.a(b2):b2
if(b7>>>0!==b7||b7>=k.length)return A.a(k,b7)
b8=k[b7]
b2=b8.b
if(!(b2>=0&&b2<j.length))return A.a(j,b2)
b9=j[b2]
c0=b9.f
C:{if(B.x===c0||B.H===c0){b2=b0.gL()===3
break C}if(B.r===c0){b2=b0.gL()===1
break C}if(B.q===c0){b2=b0.gL()!==1
break C}b2=null}if(!b2||!b9.e.$1(c1))continue
b2=b8.a
if(!B.a.v(b5,b2))B.a.k(b5,b2)
if(b6<0)b6=b7}if(b5.length===0)continue
B.a.k(o,new A.hF(b6,d.gaB(),c1.c,b5,c1.b))}}return o},
wq(a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=a3.a
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
x6(a,b,c,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=b.a,d=new A.nP(c,a1,a0,a2)
if(a===1){for(s=e.length,r=0;r<b.b;r+=2){if(!(r<s))return A.a(e,r)
q=e[r]
p=r+1
if(!(p<s))return A.a(e,p)
if(d.$2(q,e[p]))return!0}return!1}o=new A.nN()
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
om:function om(a){this.a=a},
nP:function nP(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
nN:function nN(){},
nO:function nO(){},
tI(a){var s,r,q,p,o=a.h(0,"encoding")
A:{if("terrarium"===o){s=B.ax
break A}if("custom"===o){s=A.D(a.h(0,"redFactor"))
if(s==null)s=1
r=A.D(a.h(0,"greenFactor"))
if(r==null)r=1
q=A.D(a.h(0,"blueFactor"))
if(q==null)q=1
p=A.D(a.h(0,"baseShift"))
s=new A.e5(s,r,q,p==null?0:p)
break A}s=B.aw
break A}return s},
bh:function bh(){},
fW:function fW(){},
hI:function hI(){},
hf:function hf(){},
fV:function fV(){},
e5:function e5(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fB:function fB(){},
hD:function hD(){},
xF(a,b,c,d){var s
if(a===c)s=a<0||a>4096
else s=!1
if(!s)if(b===d)s=b<0||b>4096
else s=!1
else s=!0
return s},
y_(a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a0.length,a=b/2|0
if(a1<=0||a<3)return a0
s=t.n
r=A.b([],s)
q=new A.on(a0,r,a1)
p=(a-1)*2
if(!(p>=0&&p<b))return A.a(a0,p)
o=a0[p];++p
if(!(p<b))return A.a(a0,p)
p=a0[p]
n=a0[0]
if(1>=b)return A.a(a0,1)
m=A.xF(o,p,n,a0[1])
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
if(m||g){B.a.k(r,o)
B.a.k(r,a0[p])}else q.$3(B.b.W(l-1+a,a),l,j)}f=A.b([],s)
for(l=0;l<r.length;l+=2){e=B.c.a2(r[l]*2)/2
b=l+1
if(!(b<r.length))return A.a(r,b)
d=B.c.a2(r[b]*2)/2
c=f.length
if(c>0){b=c-2
if(!(b>=0))return A.a(f,b)
b=f[b]===e&&f[c-1]===d}else b=!1
if(b)continue
B.a.k(f,e)
B.a.k(f,d)}for(;;){b=f.length
if(!(b>2&&f[0]===f[b-2]&&f[1]===f[b-1]))break
B.a.sj(f,b-2)}if(b<6)return a0
return new Float64Array(A.a2(f))},
y3(a){var s,r,q,p=a.length/2|0,o=new Float64Array(p*4),n=new A.oq(a,o)
for(s=0;s<p;s=q){r=s*4
n.$3(s,B.b.W(s-1+p,p),r)
q=s+1
n.$3(s,q%p,r+2)}return o},
on:function on(a,b,c){this.a=a
this.b=b
this.c=c},
oq:function oq(a,b){this.a=a
this.b=b},
kZ:function kZ(a,b,c){this.a=a
this.b=b
this.c=c},
vF(a){var s,r,q,p,o,n,m,l=a.h(0,"id")
l=A.t(l==null?"":l)
s=a.h(0,"type")
r=t.eO
q=r.a(a.h(0,"paint"))
if(q==null)q=B.u
r=r.a(a.h(0,"layout"))
if(r==null)r=B.u
p=A.D(a.h(0,"minzoom"))
A:{if(typeof p=="number"){o=p>0
n=p}else{n=null
o=!1}if(o){o=n
break A}o=-24
break A}m=A.D(a.h(0,"maxzoom"))
return new A.lC(l,s,a,q,r,o,m==null?30:m)},
hx(a,b){var s,r,q=A.b3(t.N)
for(s=b.length,r=0;r<b.length;b.length===s||(0,A.h)(b),++r)A.c7(a.h(0,b[r]),q)
return q},
c7(a,b){var s,r,q
if(t.j.b(a)){s=J.n(a)
if(s.gj(a)===2)r=(J.k(s.h(a,0),"get")||J.k(s.h(a,0),"has"))&&typeof s.h(a,1)=="string"
else r=!1
if(r)b.k(0,A.U(s.h(a,1)))
if(s.gH(a))r=J.k(s.h(a,0),"feature-state")||J.k(s.h(a,0),"id")
else r=!1
if(r)b.k(0,"$id")
if(s.gH(a))r=J.k(s.h(a,0),"within")||J.k(s.h(a,0),"distance")
else r=!1
if(r)b.k(0,"$geometry:"+B.e.a0(a,null))
for(s=s.gt(a);s.m();)A.c7(s.gp(),b)}else if(t.f.b(a)){q=a.h(0,"property")
if(typeof q=="string")b.k(0,q)}},
ve(a){var s,r,q,p,o,n,m,l,k=null,j=t.j
if(!j.b(a)||J.X(a)!==4)return k
s=new Float64Array(8)
for(r=J.n(a),q=0;q<4;++q){p=r.h(a,q)
if(!j.b(p)||J.X(p)<2)return k
o=J.n(p)
n=o.h(p,0)
if(!(typeof n=="number"))if(typeof n=="string"){m=A.N(n)
n=m}else{if(A.H(n))m=n?1:0
else m=k
n=m}l=o.h(p,1)
if(!(typeof l=="number"))if(typeof l=="string"){o=A.N(l)
l=o}else{if(A.H(l))o=l?1:0
else o=k
l=o}if(n==null||l==null)return k
o=q*2
if(!(o<8))return A.a(s,o)
s[o]=(n+180)/360;++o
m=A.pz(l)
if(!(o<8))return A.a(s,o)
s[o]=m}return s},
vk(a){var s,r,q,p,o,n,m=null,l=t.j
if(l.b(a)){s=J.n(a)
s=s.gj(a)===2&&J.k(s.h(a,0),"literal")}else s=!1
r=s?J.aP(a,1):a
if(l.b(r)){l=J.n(r)
l=l.gA(r)||l.gj(r)>4}else l=!0
if(l)return m
l=A.b([],t.nn)
for(s=J.G(r);s.m();){q=s.gp()
if(typeof q=="number")p=q
else if(typeof q=="string")p=A.N(q)
else if(A.H(q))p=q?1:0
else p=m
l.push(p==null?m:p)}if(B.a.v(l,m))return m
s=l.length
p=s>=1
o=p?l[0]:m
if(!p)throw A.e(A.cG("Pattern matching error"))
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
K(a,b){var s=A.u(b)
if(a==null)return s
return new A.kz(A.u(a),s)},
vh(a){var s,r,q="viewport-y",p=new A.kt(a),o=a.h(0,"symbol-z-order")
if(o==null)o="auto"
s=J.al(o)
r=!s.C(o,q)&&a.h(0,"symbol-sort-key")!=null
if(!s.C(o,q))s=s.C(o,"auto")&&!r
else s=!0
if(s)p=p.$2("text-overlap","text-allow-overlap")||p.$2("icon-overlap","icon-allow-overlap")||J.k(a.h(0,"text-ignore-placement"),!0)||J.k(a.h(0,"icon-ignore-placement"),!0)
else p=!1
return p},
kv(a,b){var s,r=a.h(0,b+"-overlap")
A:{if(typeof r=="string"){s=r
break A}s=J.k(a.h(0,b+"-allow-overlap"),!0)?"always":"never"
break A}return s},
vd(a,b){var s,r,q,p,o,n,m=t.j,l=null,k=!1,j=!1
if(m.b(a)){s=J.n(a)
if(s.gj(a)===2){k="literal"===s.h(a,0)
if(k){l=s.h(a,1)
j=m.b(l)}}}if(j){j=k?l:J.aP(a,1)
t.W.a(j)
r=j}else r=a
if(m.b(r)&&J.X(r)>=2){q=A.b([],t.s)
p=A.b([],t.I)
for(j=J.n(r),o=0;s=o+1,s<j.gj(r);o+=2){n=j.h(r,o)
if(typeof n=="string"){B.a.k(q,n)
B.a.k(p,A.oY(j.h(r,s)))}}if(q.length!==0)return new A.z(q,p)}if(m.b(b)){m=J.pS(b,t.N)
m=A.a1(m,m.$ti.i("f.E"))}else m=B.aa
return new A.z(m,null)},
qK(a){var s
if(a!=null)if(t.j.b(a)){s=J.n(a)
s=s.gj(a)===2&&s.ae(a,new A.ku())}else s=!1
else s=!0
return s},
oY(a){var s,r,q=t.j
if(q.b(a)){s=J.n(a)
s=s.gj(a)===2&&J.k(s.h(a,0),"literal")}else s=!1
r=s?J.aP(a,1):a
if(!q.b(r)||J.X(r)!==2)return B.d6
q=J.n(r)
s=A.D(q.h(r,0))
if(s==null)s=0
q=A.D(q.h(r,1))
return new A.z(s,q==null?0:q)},
qJ(a,b){var s,r
if(t.j.b(a)){s=J.n(a)
s=s.gH(a)&&s.ae(a,new A.kp())}else s=!1
if(s){s=A.b([],t.V)
for(r=J.G(a);r.m();)s.push(A.u(r.gp()))
return s}return A.b([A.u(a==null?b:a)],t.V)},
qL(a,b){var s,r,q,p,o=t.j.b(a)?a:[a],n=t.n,m=A.b([],n)
for(s=J.G(o);s.m();){r=s.gp()
if(typeof r=="number")q=r
else if(typeof r=="string"){p=A.N(r)
q=p}else{if(A.H(r))p=r?1:0
else p=null
q=p}if(q!=null)m.push(q)}return m.length===0?A.b([b],n):m},
vg(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=A.b([],t.lN),e=null,d=!1
if(t.f.b(a)){s=a.h(0,"stops")
if(s==null)r=a.J("stops")
else r=!0
if(r)if(t.j.b(s)){d=a.h(0,"property")==null
e=s}}if(d)for(d=J.G(e),r=t.j;d.m();){q=d.gp()
if(r.b(q)&&J.X(q)===2){p=J.n(q)
B.a.k(f,new A.z(p.h(q,0),p.h(q,1)))}}else{d=t.j
r=!1
if(d.b(a)){p=J.n(a)
if(p.gj(a)>=3)if("step"===p.h(a,0)){o=p.h(a,1)
if(d.b(o)){t.W.a(o)
d=J.n(o)
if(d.gj(o)===1)d="zoom"===d.h(o,0)
else d=r}else d=r}else d=r
else d=r}else d=r
if(d){d=J.n(a)
n=d.h(a,2)
m=d.a_(a,3)
B.a.k(f,new A.z(-1/0,n))
for(l=0;d=l+1,r=m.length,d<r;l+=2){if(!(l<r))return A.a(m,l)
B.a.k(f,new A.z(m[l],m[d]))}}else return B.A}k=A.b([],t.bU)
for(d=f.length,j=0;j<f.length;f.length===d||(0,A.h)(f),++j){r=f[j]
i=r.a
if(typeof i=="number")p=i==1/0||i==-1/0
else p=!1
if(p)h=i
else{if(typeof i=="number")p=i
else if(typeof i=="string")p=A.N(i)
else if(A.H(i))p=i?1:0
else p=null
h=p==null?null:p}g=A.kq(r.b)
if(h==null||g==null)return B.A
B.a.k(k,new A.z(h,g))}return k},
vf(a){var s=A.b([],t.w)
new A.kr(s).$1(a)
return s},
vj(a,b){var s,r,q=a.length,p=b.length
if(q!==p)return!1
for(s=0;s<q;++s){r=a[s]
if(!(s<p))return A.a(b,s)
if(r!==b[s])return!1}return!0},
kq(a){var s,r,q,p,o,n,m,l=null,k=t.j
if(k.b(a)){s=J.n(a)
s=s.gj(a)===2&&J.k(s.h(a,0),"literal")}else s=!1
r=s?J.aP(a,1):a
if(!k.b(r)||J.X(r)<2)return l
k=J.n(r)
s=k.gj(r)
q=new Float64Array(s)
for(p=0,o=0;o<s;++o){n=k.h(r,o)
if(!(typeof n=="number"))if(typeof n=="string"){m=A.N(n)
n=m}else{if(A.H(n))m=n?1:0
else m=l
n=m}if(n==null||n<0)return l
if(!(o<s))return A.a(q,o)
q[o]=n
if((o&1)===1)p+=n}return p<=0?l:q},
vi(a){var s,r,q,p,o,n,m
A:{s=t.j
r=s.b(a)
q=null
p=!1
o=!1
if(r){n=J.n(a)
if(n.gj(a)===2){p="literal"===n.h(a,0)
if(p){q=n.h(a,1)
s=s.b(q)}else s=o}else s=o}else s=o
if(s){s=p?q:J.aP(a,1)
t.W.a(s)
break A}if(r){s=a
break A}s=B.a9
break A}r=A.b([],t.s)
for(s=J.G(s);s.m();){m=s.gp()
if(typeof m=="string")r.push(m)}return r},
vl(a){if(B.d.v(a,"black")||B.d.v(a,"heavy"))return 900
if(B.d.v(a,"extrabold")||B.d.v(a,"extra bold"))return 800
if(B.d.v(a,"semibold")||B.d.v(a,"semi bold")||B.d.v(a,"demi"))return 600
if(B.d.v(a,"bold"))return 700
if(B.d.v(a,"medium"))return 500
if(B.d.v(a,"light"))return 300
if(B.d.v(a,"thin"))return 100
return 400},
lC:function lC(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
fg:function fg(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
hw:function hw(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){var _=this
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
ky:function ky(a,b){this.a=a
this.b=b},
kn:function kn(a){this.a=a},
km:function km(a,b){this.a=a
this.b=b},
kk:function kk(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
kl:function kl(){},
ko:function ko(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){var _=this
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
kx:function kx(a,b){this.a=a
this.b=b},
kw:function kw(a,b,c){this.a=a
this.b=b
this.c=c},
kz:function kz(a,b){this.a=a
this.b=b},
kt:function kt(a){this.a=a},
ku:function ku(){},
kp:function kp(){},
kr:function kr(a){this.a=a},
ks:function ks(a){this.a=a},
tZ(a){var s,r,q,p,o=t.f.b(a)?a:B.ac,n=new A.A(B.h),m=o.h(0,"position"),l=A.u(m==null?A.b([1.15,210,30],t.g2):m).$1(n)
m=o.h(0,"intensity")
m=A.D(A.u(m==null?0.5:m).$1(n))
if(m==null)m=0.5
s=o.h(0,"color")
A.c4(A.u(s==null?"#ffffff":s).$1(n))
if(t.j.b(l)&&J.X(l)===3){s=A.b([],t.n)
for(r=J.G(l);r.m();){q=r.gp()
if(typeof q=="number")p=q
else if(typeof q=="string")p=A.N(q)
else if(A.H(q))p=q?1:0
else p=null
s.push(p==null?0:p)}}J.k(o.h(0,"anchor"),"map")
return new A.j3(m)},
pX(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r){return new A.d3(i,q,a,b,c,d,e,g,o,n,h,l,j,k,m,p,f,r)},
qo(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1){return new A.dq(q,d,f,j,k,b,m,l)},
uj(a,b,c){var s,r,q,p,o=a==null?B.cP:a,n=t.n,m=A.b([],n)
if(t.j.b(o)){s=J.n(o)
s=s.gj(o)>4&&J.k(s.h(o,0),"interpolate")&&B.e.a0(s.h(o,1),null)==='["linear"]'&&B.e.a0(s.h(o,2),null)==='["heatmap-density"]'}else s=!1
if(s)for(s=J.n(o),r=3;r+1<s.gj(o);r+=2){q=s.h(o,r)
if(!(typeof q=="number"))if(typeof q=="string"){p=A.N(q)
q=p}else{if(A.H(q))p=q?1:0
else p=null
q=p}if(q!=null)B.a.k(m,B.c.E(q,0,1))}if(m.length<2){B.a.aa(m)
n=A.b([],n)
for(r=0;r<=8;++r)n.push(r/8)
B.a.B(m,n)}A.u(o)
return new A.jr()},
vo(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=B.e.a0(a,null),b=a.h(0,"source")
b.toString
A.E(b)
s=a.h(0,"sourceLayer")
s.toString
A.U(s)
r=A.pn(a.h(0,"filter"))
q=a.h(0,"text")
A:{if(q==null){p=new A.kE()
break A}p=A.fm(q)
break A}o=a.h(0,"icon")
B:{if(o==null){n=null
break B}n=A.xj(o)
break B}m=A.u(a.h(0,"placement"))
l=a.h(0,"spacing")
l.toString
A.ae(l)
k=J.k(a.h(0,"textUpright"),!0)
j=J.k(a.h(0,"iconUpright"),!0)
i=a.h(0,"minZoom")
i.toString
A.ae(i)
h=a.h(0,"maxZoom")
h.toString
A.ae(h)
g=a.h(0,"sortKey")
C:{if(g==null){f=null
break C}f=A.u(g)
break C}e=a.h(0,"iconRotate")
e=A.u(e==null?0:e)
d=a.h(0,"paintKeys")
d.toString
return new A.kD(c,b,s,r,p,n,m,l,k,j,i,h,f,e,J.dX(t.j.a(d),t.N))},
eN(a){var s,r,q=a.h(0,"bounds"),p=A.D(a.h(0,"minzoom"))
p=p==null?null:B.c.K(p)
if(p==null)p=0
if(t.j.b(q)){s=J.n(q)
s=s.gj(q)===4&&s.ae(q,new A.kW())}else s=!1
if(s){s=A.b([],t.n)
for(r=J.G(q);r.m();)s.push(A.ae(r.gp()))}else s=null
return new A.kV(p,s,J.k(a.h(0,"scheme"),"tms"))},
qM(a){var s=A.vm(t.f.b(a)?a.h(0,"type"):null)
return s==null||s.length===0||B.a.ae(s,new A.kB())?B.dj:new A.hy(s)},
kA(a){var s
A:{if("mercator"===a){s=0
break A}if("vertical-perspective"===a){s=1
break A}s=null
break A}return s},
vm(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=null,d=J.al(a)
if(d.C(a,"globe"))return B.cH
s=A.kA(a)
if(s!=null)return A.b([new A.z(0,s)],t.I)
r=t.j
q=r.b(a)
p=!1
if(q)if(d.gj(a)>=3)if("interpolate"===d.h(a,0)){o=d.h(a,2)
if(r.b(o)){t.W.a(o)
n=J.n(o)
if(n.gj(o)===1)p="zoom"===n.h(o,0)}}if(p){m=d.a_(a,3)
l=A.b([],t.I)
for(k=0;d=k+1,r=m.length,d<r;k+=2){if(!(k<r))return A.a(m,k)
j=m[k]
i=A.kA(m[d])
if(typeof j!="number"||i==null)return e
B.a.k(l,new A.z(j,i))}return l}p=!1
if(q)if(d.gj(a)>=3)if("step"===d.h(a,0)){h=d.h(a,1)
if(r.b(h)){t.W.a(h)
r=J.n(h)
if(r.gj(h)===1)r="zoom"===r.h(h,0)
else r=p}else r=p}else r=p
else r=p
else r=p
if(r){g=d.h(a,2)
m=d.a_(a,3)
f=A.kA(g)
if(f==null)return e
l=A.b([new A.z(-1/0,f)],t.I)
for(k=0;d=k+1,r=m.length,d<r;k+=2){if(!(k<r))return A.a(m,k)
j=m[k]
i=A.kA(m[d])
if(typeof j!="number"||i==null)return e
B.a.k(l,new A.z(j-1e-9,B.a.gS(l).b))
B.a.k(l,new A.z(j,i))}return l}return e},
ci:function ci(a,b){this.a=a
this.b=b},
j0:function j0(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
j3:function j3(a){this.a=a},
eb:function eb(a,b){this.b=a
this.d=b},
d3:function d3(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r){var _=this
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
df:function df(a,b){this.a=a
this.b=b},
bg:function bg(){},
h9:function h9(){},
bf:function bf(a,b,c,d,e,f,g){var _=this
_.cx=a
_.db=b
_.dx=c
_.a=d
_.b=e
_.c=f
_.d=g},
dq:function dq(a,b,c,d,e,f,g,h){var _=this
_.cy=a
_.dy=b
_.fx=c
_.id=d
_.a=e
_.b=f
_.c=g
_.d=h},
d8:function d8(a,b,c,d,e,f,g){var _=this
_.db=a
_.dx=b
_.dy=c
_.a=d
_.b=e
_.c=f
_.d=g},
ct:function ct(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jr:function jr(){},
kD:function kD(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
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
kE:function kE(){},
hA:function hA(a,b,c,d,e,f,g,h,i,j,k,l){var _=this
_.a=a
_.b=b
_.c=c
_.w=d
_.y=e
_.z=f
_.at=g
_.ax=h
_.ay=i
_.go=j
_.id=k
_.dU=l},
kV:function kV(a,b,c){this.a=a
this.b=b
this.c=c},
kW:function kW(){},
kX:function kX(a){this.a=a},
kY:function kY(a){this.a=a},
dC:function dC(){},
bX:function bX(a,b,c,d){var _=this
_.e=a
_.f=b
_.r=c
_.c=d},
eP:function eP(a,b){this.r=a
this.c=b},
ft:function ft(){},
c8:function c8(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
oX:function oX(){},
hy:function hy(a){this.a=a},
kB:function kB(){},
kC:function kC(a,b,c,d,e,f,g,h,i){var _=this
_.d=a
_.f=b
_.as=c
_.at=d
_.ax=e
_.ay=f
_.CW=g
_.db=h
_.dx=i},
vn(a){var s
t.H.a(a)
s=J.n(a)
return s.h(a,1)<-32767.5||s.h(a,1)>32766.5},
hz:function hz(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
qU(a,b,c){var s=new Float32Array(0),r=new Float32Array(0),q=new Float32Array(2048),p=new Float32Array(0),o=new Uint8Array(0),n=new Uint16Array(4096)
return new A.lf(a,b,c,s,r,q,p,o,n,new Uint16Array(0),A.b([],t.bw))},
q5(a,b,c){var s,r,q,p,o,n,m,l=new A.j6(c,b),k=t.n,j=A.b([],k),i=a.length/2|0
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
if(l.$1(o))B.a.B(j,A.b([p,o],k))
if(!J.k(l.$1(o),l.$1(m)))B.a.B(j,A.b([p+(n-p)*((b-o)/(m-o)),b],k))}return j},
qp(a,b,c,d){var s=c-a,r=d-b,q=Math.sqrt(s*s+r*r)
return new A.z(-r/q,s/q)},
cv:function cv(a,b){this.a=a
this.b=b},
dp:function dp(a,b){this.a=a
this.b=b},
aT:function aT(a,b){this.a=a
this.b=b},
eq:function eq(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
lf:function lf(a,b,c,d,e,f,g,h,i,j,k){var _=this
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
j5:function j5(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
j6:function j6(a,b){this.a=a
this.b=b},
jE:function jE(a,b,c,d){var _=this
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
vq(a,b){var s,r=a.b.as
if(r==null)return 50
s=r.$1(b)
return typeof s=="number"?B.b.E(B.c.Y(s),0,4095):50},
xX(a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=A.b([],t.k9),c=t.N,b=t.S,a=A.C(c,b),a0=A.C(c,b),a1=new A.oh()
for(c=J.G(a2),b=t.Y;c.m();){s=c.gp()
r=A.b([B.a.gu(s.w)],b)
q=s.b
p=a1.$3$end(q,B.a.gu(r),!1)
o=a1.$3$end(q,B.a.gS(r),!0)
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
B.a.B(l,r)
B.a.B(l,s.b)
B.a.n(d,m,null)
a0.ar(0,p)
a.ar(0,o)
a0.n(0,a1.$3$end(q,B.a.gS(l),!0),n)}else if(l){if(n>>>0!==n||n>=d.length)return A.a(d,n)
B.a.B(d[n].b,r)
a0.ar(0,p)
a0.n(0,o,n)}else if(m!=null){if(m>>>0!==m||m>=d.length)return A.a(d,m)
B.a.cp(d[m].b,0,r)
a.ar(0,o)
a.n(0,p,m)}else{B.a.k(d,new A.z(s,r))
a.n(0,p,d.length-1)
a0.n(0,o,d.length-1)}}c=A.b([],t.gw)
for(s=d.length,q=t.A,l=t.iu,k=0;k<d.length;d.length===s||(0,A.h)(d),++k){j=d[k]
if(q.b(j)){i=j.a
h=A.b([A.wJ(l.a(j.b))],b)
g=i.w
f=A.M(g)
e=new A.bC(g,1,null,f.i("bC<1>"))
e.cO(g,1,null,f.c)
B.a.B(h,e)
i.sie(h)
c.push(i)}}return c},
wJ(a){var s,r,q,p,o,n=J.n(a)
if(n.gj(a)===1)return n.gu(a)
s=A.a1(n.gu(a),t.i)
for(n=n.T(a,1),r=n.$ti,n=new A.a0(n,n.gj(0),r.i("a0<a_.E>")),r=r.i("a_.E");n.m();){q=n.d
if(q==null)q=r.a(q)
p=A.a6(q)
o=new A.bC(q,2,null,p.i("bC<y.E>"))
o.cO(q,2,null,p.i("y.E"))
B.a.B(s,o)}return new Float32Array(A.a2(s))},
rz(a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1={},a2=A.b([],t.Y),a3=t.n
a1.a=A.b([],a3)
s=new A.nU(a1,a2)
for(r=a4.length,q=2;q<r;q+=2){p=a4[q-2]
o=a4[q-1]
n=a4[q]
m=q+1
if(!(m<r))return A.a(a4,m)
l=n-p
k=a4[m]-o
for(m=[new A.z(-l,p),new A.z(l,4096-p),new A.z(-k,o),new A.z(k,4096-o)],j=0,i=1,h=!0,g=0;g<4;++g){f=m[g]
e=f.a
d=f.b
if(e===0){if(d<0)h=!1
continue}c=d/e
if(e<0){if(c>i)h=!1
if(c>j)j=c}else{if(c<j)h=!1
if(c<i)i=c}}if(!h){s.$0()
continue}b=p+l*j
a=o+k*j
m=a1.a
f=m.length
if(f!==0){a0=f-2
if(!(a0>=0))return A.a(m,a0)
m=m[a0]!==b||B.a.gS(m)!==a}else m=!0
if(m){s.$0()
B.a.B(a1.a,A.b([b,a],a3))}B.a.B(a1.a,A.b([p+l*i,o+k*i],a3))
if(i<1)s.$0()}s.$0()
return a2},
mt(a){var s,r,q,p,o,n
for(s=a.length,r=0,q=2;q<s;q+=2){p=a[q]-a[q-2]
o=q+1
if(!(o<s))return A.a(a,o)
n=a[o]-a[q-1]
r+=Math.sqrt(p*p+n*n)}return r},
rG(a,b,c,d,e,f,g){var s,r,q,p=a.length
if(0>=p)return A.a(a,0)
s=a[0]
r=!0
if(s!==0)if(s!==4096){if(1>=p)return A.a(a,1)
p=a[1]
p=p===0||p===4096
r=p}p=b/4
if(b-c<p)b=c+p
q=A.nK(a,r?B.c.W(b/2*g,b):B.c.W((c/2+d)*g,b),b,c,e,f)
if(q.length===0&&!r)return A.nK(a,A.mt(a)/2,b,c,e,f)
return q},
nK(a4,a5,a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a7/2,a=A.mt(a4),a0=A.b([],t.eL),a1=isFinite(a6),a2=a1?a5-a6:a5,a3=a1?a6:0
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
e=B.c.a2(m+j*f)
d=B.c.a2(l+n*f)
c=!1
if(e>=0)if(e<4096)if(d>=0)if(d<4096)if(g-b>=0)if(g+b<=a)c=!s||A.wa(a4,B.b.N(o,2)-1,e,d,a7,a8,a9)
if(c)B.a.k(a0,new A.aM(e,d,Math.atan2(n,j)))
if(a1){a2=g
p=!0
break}}o+=2
q=h}return a0},
wa(a,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
if(a3===0)return!0
s=new A.lV(a)
r=new A.lW(a)
q=new A.lU()
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
i=A.b([],t.I)
h=a.length/2|0
for(o=a3/2,p=j,g=0;l<o;p=j){j=p+1
if(j>=h)return!1
k=r.$1(p)
f=p-1
e=r.$1(f)
if(typeof k!=="number")return k.aV()
if(typeof e!=="number")return A.ah(e)
d=s.$1(p)
f=s.$1(f)
if(typeof d!=="number")return d.aV()
if(typeof f!=="number")return A.ah(f)
c=Math.atan2(k-e,d-f)
f=r.$1(j)
d=r.$1(p)
if(typeof f!=="number")return f.aV()
if(typeof d!=="number")return A.ah(d)
e=s.$1(j)
k=s.$1(p)
if(typeof e!=="number")return e.aV()
if(typeof k!=="number")return A.ah(k)
b=Math.abs(B.c.W(c-Math.atan2(f-d,e-k)+9.42477796076938,6.283185307179586)-3.141592653589793)
B.a.k(i,new A.z(l,b))
g+=b
while(l-B.a.gu(i).a>a4)g-=B.a.aG(i,0).b
if(g>a5)return!1
k=q.$4(s.$1(p),r.$1(p),s.$1(j),r.$1(j))
if(typeof k!=="number")return A.ah(k)
l+=k}return!0},
d4:function d4(a,b,c){this.a=a
this.b=b
this.c=c},
bp:function bp(a,b,c,d,e,f,g,h,i,j){var _=this
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
d5:function d5(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
aL:function aL(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
kG:function kG(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=!1
_.w=g
_.x=h
_.y=i
_.z=j
_.Q=k
_.as=l
_.at=m
_.ax=n
_.ay=o
_.ch=1
_.CW=p},
kR:function kR(a,b){this.a=a
this.b=b},
kT:function kT(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
kS:function kS(a,b,c){this.a=a
this.b=b
this.c=c},
kU:function kU(a,b,c){this.a=a
this.b=b
this.c=c},
kO:function kO(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
kN:function kN(a,b){this.a=a
this.b=b},
kP:function kP(a,b,c,d,e,f,g,h,i,j){var _=this
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
kQ:function kQ(){},
kI:function kI(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
kJ:function kJ(a){this.a=a},
kK:function kK(a,b,c){this.a=a
this.b=b
this.c=c},
kH:function kH(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
kM:function kM(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
kL:function kL(a,b,c){this.a=a
this.b=b
this.c=c},
dt:function dt(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
oh:function oh(){},
nU:function nU(a,b){this.a=a
this.b=b},
lV:function lV(a){this.a=a},
lW:function lW(a){this.a=a},
lU:function lU(){},
b7:function b7(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
l_:function l_(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
l0:function l0(){},
l1:function l1(){},
bd:function bd(a){this.a=a
this.b=0},
ju:function ju(a){this.a=a
this.b=0},
ir(a,b,c){return A.ye(a,b,c)},
ye(c4,c5,c6){var s=0,r=A.aw(t.o),q,p=2,o=[],n=[],m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3
var $async$ir=A.ax(function(c7,c8){if(c7===1){o.push(c8)
s=p}for(;;)switch(s){case 0:c2={}
c3=c4.length
if(0>=c3){q=A.a(c4,0)
s=1
break}j=c4[0]
j.toString
A.U(j)
if(1>=c3){q=A.a(c4,1)
s=1
break}i=A.bk(c4[1])
if(2>=c3){q=A.a(c4,2)
s=1
break}h=c4[2]
h.toString
A.U(h)
if(3>=c3){q=A.a(c4,3)
s=1
break}c3=c4[3]
c3.toString
g=t.f
f=t.N
c3=g.a(c3).by(0,f,f)
if(4>=c4.length){q=A.a(c4,4)
s=1
break}e=c4[4]
e.toString
d=t.O
e=g.a(e).by(0,f,d)
if(5>=c4.length){q=A.a(c4,5)
s=1
break}g=t.g
c=g.a(c4[5])
c=c==null?null:J.dX(c,f)
b=c4.length
if(6>=b){q=A.a(c4,6)
s=1
break}a=c4[6]
a.toString
A.ae(a)
if(7>=b){q=A.a(c4,7)
s=1
break}a0=c4[7]
a0.toString
A.E(a0)
if(b>8){b=g.a(c4[8])
b=b==null?null:J.dX(b,t.p)}else b=null
if(c4.length>9){g=g.a(c4[9])
g=g==null?null:J.dX(g,f)}else g=null
a1=c4.length>10&&J.k(c4[10],!0)
a2=new A.ex()
a3=A.b([],t.jA)
a4=A.b([],t.o_)
a5=t.S
a6=A.b([],t.o9)
a7=A.b([],t.oW)
a8=A.b([],t.kv)
a9=A.b([],t.lW)
b0=A.b([],t.jQ)
b1=A.b([],t.n_)
b2=e.a
b3=e.$ti.i("4?")
b4=t.eO.a(b3.a(b2.h(0,"sources")))
if(b4==null)b4=B.u
b5=A.t(a)
b2=A.qM(b3.a(b2.h(0,"projection"))).a.length!==0?b5+" globe":b5
b6=new A.hw(e,c,a,b4,a3,A.C(d,t.aV),a4,A.C(f,a5),a6,a7,a8,a9,b0,b1,new A.b6(b2),A.C(a5,t.u)).hr()
b2=b6.ay
if(!(a0>=0&&a0<b2.length)){q=A.a(b2,a0)
s=1
break}b7=b2[a0]
b8=b6.dx
d=b==null
b9=d&&b8!=null?new A.jl(b8,h,c3,new A.ou(),A.b([],t.s),A.C(f,a5),A.b([],t.iE),A.b3(a5),A.b3(a5)):null
d=d?null:A.u6(b,g)
a3=t.L
a4=new Float64Array(4096)
a6=t.t
a7=A.b([],a6)
a8=A.b([],a6)
a9=A.b([],a6)
c0=new A.kG(A.b3(a5),B.cW,b6,a0,d,b9,a1,A.C(f,a3),A.C(f,a3),new A.A(B.h),new A.fS(a4,a7),a8,a9,new Float64Array(4096),A.b([],a6),A.C(f,t.i))
c0.em(b6,d,a1,b9,a0)
m=new A.ot(c5)
f=b6.db
c1=f.length===0?null:A.or(f,a2,c3).eb(new A.ov(c0),t.a)
f=c2.a=c2.b=null
if(b7 instanceof A.bX)c2.b=new A.ow(b7.e,new A.oB(b7),a2,new A.la(a1,g,b,j,new A.kZ(i,h,c3),e,c,a,a0)).$0()
else if(b7 instanceof A.eP){h=A.xg(j)
g=new A.ex()
e=B.d.av(j,"pmtiles://")
if(e)f=new A.jU(B.d.am(j,10),c3,g,A.C(a5,t.je))
c2.a=new A.l_(j,b7.r,"tiles-"+h,g,".pbf",c3,f,i)}l=new A.oz(c2,new A.oy(c2,new A.ox(c2,A.C(a5,t.p))),c0,c1,b9,b6,a0)
c3=new A.cV(A.cf(c6,"stream",t.K),t.b6)
p=3
j=t.W,i=t.o
case 6:s=8
return A.Y(c3.m(),$async$ir)
case 8:if(!c8){s=7
break}k=c3.gp()
h=k
h.toString
l.$1(A.vs(j.a(h))).eb(m,i)
s=6
break
case 7:n.push(5)
s=4
break
case 3:n=[2]
case 4:p=2
s=9
return A.Y(c3.b4(),$async$ir)
case 9:s=n.pop()
break
case 5:case 1:return A.au(q,r)
case 2:return A.at(o.at(-1),r)}})
return A.av($async$ir,r)},
rp(a){var s,r=A.b([],t.i9),q=a==null?B.B:a,p=q.length,o=0
for(;o<q.length;q.length===p||(0,A.h)(q),++o){s=q[o]
r.push(new A.fA(s.a,s.b,s.d))}return r},
ou:function ou(){},
ot:function ot(a){this.a=a},
ov:function ov(a){this.a=a},
oB:function oB(a){this.a=a},
ow:function ow(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ox:function ox(a,b){this.a=a
this.b=b},
oy:function oy(a,b){this.a=a
this.b=b},
oz:function oz(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
oA:function oA(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
y0(){var s,r={},q=v.G
r.a=null
r=new A.op(r,q)
if(typeof r=="function")A.p(A.aQ("Attempting to rewrap a JS function.",null))
s=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.wd,r)
s[$.pB()]=r
q.onmessage=s},
op:function op(a,b){this.a=a
this.b=b},
oo:function oo(a){this.a=a},
oH(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.aB(b,c,B.b.a9(a.byteLength,s))
return J.pK(B.j.gaq(a),a.byteOffset+b*s,(c-b)*s)},
hJ(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.aB(b,c,B.b.a9(a.byteLength,s))
return J.pM(B.j.gaq(a),a.byteOffset+b*s,(c-b)*s)},
qR(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.aB(b,c,B.b.a9(a.byteLength,s))-b)*s
if(B.b.W(r,2)!==0)throw A.e(A.aQ("The number of bytes to view must be a multiple of 2",null))
return J.tf(B.R.gaq(a),a.byteOffset+b*s,B.b.N(r,2))},
j7(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.aB(b,c,B.b.a9(a.byteLength,s))-b)*s
if(B.b.W(r,4)!==0)throw A.e(A.aQ("The number of bytes to view must be a multiple of 4",null))
return J.pL(B.n.gaq(a),a.byteOffset+b*s,B.b.N(r,4))},
cp(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.aB(b,c,B.b.a9(a.byteLength,s))-b)*s
if(B.b.W(r,8)!==0)throw A.e(A.aQ("The number of bytes to view must be a multiple of 8",null))
return J.te(B.o.gaq(a),a.byteOffset+b*s,B.b.N(r,8))},
rL(a){return v.mangledGlobalNames[a]},
yc(a){throw A.ac(A.ur(a),new Error())},
v(){throw A.ac(A.ut(""),new Error())},
px(){throw A.ac(A.us(""),new Error())},
y5(a){return Math.sqrt(A.ae(a))},
y2(a){return Math.sin(A.ae(a))},
rA(a){return Math.cos(A.ae(a))},
ya(a){return Math.tan(a)},
x9(a){return Math.acos(a)},
xa(a){return Math.asin(a)},
xf(a){return Math.atan(A.ae(a))},
xL(a){return Math.log(a)},
am(a,b){var s,r,q,p,o=a.length,n=(o/3|0)-1
for(s=0;s<=n;){r=B.b.M(s+n,1)
q=r*3
if(!(q<o))return A.a(a,q)
if(b<a[q])n=r-1
else{p=q+1
if(!(p<o))return A.a(a,p)
if(b>a[p])s=r+1
else{p=q+2
if(!(p<o))return A.a(a,p)
return a[p]}}}return 0},
cH(a){return a},
vp(a){var s,r,q,p
for(s=a.length,r=0,q=0;q<4;++q){if(q<s){if(!(q<s))return A.a(a,q)
p=a.charCodeAt(q)}else p=32
r=(r<<8|p)>>>0}return r},
aD(a){return A.dy(A.b([B.b.M(a,24)&255,B.b.M(a,16)&255,B.b.M(a,8)&255,a&255],t.t),0,null)},
pz(a){var s=B.c.E(a,-85.0511,85.0511)*3.141592653589793/180
return(1-Math.log(Math.tan(s)+1/Math.cos(s))/3.141592653589793)/2},
py(a){var s,r,q,p,o,n,m
if(!t.j.b(a))return null
s=A.b([],t.s)
for(r=J.pS(a,t.N),q=J.G(r.a),r=r.$ti,p=new A.cK(q,r.i("cK<1>")),r=r.c;p.m();){o=r.a(q.gp())
if(B.d.v(o,"{s}"))for(n=0;n<3;++n){m=B.cq[n]
s.push(A.os(o,"{s}",m,0))}else s.push(o)}return s.length===0?null:B.a.ac(s," ")},
yd(a,b,c,d){var s,r,q,p,o,n=a.split(" "),m=n.length,l=B.b.W(c+d,m),k=A.b([],t.s)
for(s=""+d,r=""+c,q=""+b,p=0;p<m;++p){o=n[B.b.W(l+p,m)]
o=A.os(o,"{z}",q,0)
o=A.os(o,"{x}",r,0)
k.push(A.os(o,"{y}",s,0))}return k},
o4(a,b,c,d,e,f){return A.xx(a,b,c,d,e,f)},
xx(a,b,c,d,e,f){var s=0,r=A.aw(t.l_),q,p=2,o=[],n,m,l,k,j,i,h,g
var $async$o4=A.ax(function(a0,a1){if(a0===1){o.push(a1)
s=p}for(;;)switch(s){case 0:i=A.yd(b,c,d,e)
h=0
case 3:n=J.k(h,J.X(i)-1)
p=6
s=9
return A.Y(a.bc(J.aP(i,h),f),$async$o4)
case 9:m=a1
l=m.a
if(n||J.k(l,200)||J.k(l,204)||J.k(l,404)){k=new A.z(J.aP(i,h),m)
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
if(typeof k!=="number"){q=k.bI()
s=1
break}h=k+1
s=3
break
case 4:case 1:return A.au(q,r)
case 2:return A.at(o.at(-1),r)}})
return A.av($async$o4,r)},
xg(a){var s,r,q,p
for(s=new A.da(a),r=t.gS,s=new A.a0(s,s.gj(0),r.i("a0<y.E>")),r=r.i("y.E"),q=2166136261;s.m();){p=s.d
q=(q^(p==null?r.a(p):p))>>>0
q=q+(q<<1>>>0)+(q<<4>>>0)+(q<<7>>>0)+(q<<8>>>0)+(q<<24>>>0)>>>0}return B.b.ba(q,36)},
or(a,b,c){return A.y4(a,b,c)},
y4(b5,b6,b7){var s=0,r=A.aw(t.a),q,p=2,o=[],n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4
var $async$or=A.ax(function(b8,b9){if(b8===1){o.push(b9)
s=p}for(;;)A:switch(s){case 0:b3=A.C(t.N,t.aL)
c=b5.length,b=t.f,a=t.L,a0=0
case 3:if(!(a0<b5.length)){s=5
break}a1=b5[a0]
n=null
n=a1.a
a2=a1.b
a3=B.d.aA(a2,"?")
a1=a3<0
m=a1?a2:B.d.a5(a2,0,a3)
l=a1?"":B.d.am(a2,a3)
a4=0
case 6:if(!(a4<2)){s=8
break}k=B.ci[a4]
p=10
s=13
return A.Y(b6.bc(A.t(m)+A.t(k)+".json"+A.t(l),b7),$async$or)
case 13:j=b9
if(j.a!==200){s=7
break}a1=a.a(j.b)
i=b.a(B.e.dT(new A.im(!1).cZ(a1,0,null,!0),null))
for(a1=i.gag(),a1=a1.gt(a1);a1.m();){h=a1.gp()
g=null
f=null
e=h
g=e.a
f=e.b
if(!b.b(f))continue
a5=A.io(f.h(0,"pixelRatio"))
d=a5==null?1:a5
a6=A.t(n)
a7=A.t(g)
a8=A.io(f.h(0,"width"))
if(a8==null)a8=0
a9=d
if(typeof a9!=="number"){q=A.ah(a9)
s=1
break A}b0=A.io(f.h(0,"height"))
if(b0==null)b0=0
b1=d
if(typeof b1!=="number"){q=A.ah(b1)
s=1
break A}J.pH(b3,a6+a7,new A.z(a8/a9,b0/b1))}s=8
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
case 1:return A.au(q,r)
case 2:return A.at(o.at(-1),r)}})
return A.av($async$or,r)},
xN(){return A.y0()}},B={}
var w=[A,J,B]
var $={}
A.oN.prototype={}
J.fY.prototype={
C(a,b){return a===b},
gR(a){return A.dv(a)},
q(a){return"Instance of '"+A.hl(a)+"'"},
gV(a){return A.bm(A.p9(this))}}
J.eh.prototype={
q(a){return String(a)},
cF(a,b){A.p5(b)
return b&&a},
gR(a){return a?519018:218159},
gV(a){return A.bm(t.y)},
$iR:1,
$iB:1}
J.ej.prototype={
C(a,b){return null==b},
q(a){return"null"},
gR(a){return 0},
$iR:1,
$iad:1}
J.ek.prototype={$iO:1}
J.c_.prototype={
gR(a){return 0},
gV(a){return B.dv},
q(a){return String(a)}}
J.hi.prototype={}
J.cJ.prototype={}
J.by.prototype={
q(a){var s=a[$.rN()]
if(s==null)s=a[$.pB()]
if(s==null)return this.ek(a)
return"JavaScript function for "+J.bc(s)},
$icq:1}
J.dl.prototype={
gR(a){return 0},
q(a){return String(a)}}
J.dm.prototype={
gR(a){return 0},
q(a){return String(a)}}
J.l.prototype={
bx(a,b){return new A.bq(a,A.M(a).i("@<1>").G(b).i("bq<1,2>"))},
k(a,b){A.M(a).c.a(b)
a.$flags&1&&A.w(a,29)
a.push(b)},
aG(a,b){a.$flags&1&&A.w(a,"removeAt",1)
if(b<0||b>=a.length)throw A.e(A.qC(b,null))
return a.splice(b,1)[0]},
cp(a,b,c){var s,r
A.M(a).i("f<1>").a(c)
a.$flags&1&&A.w(a,"insertAll",2)
A.uX(b,0,a.length,"index")
if(!t.Q.b(c))c=J.tm(c)
s=J.X(c)
a.length=a.length+s
r=b+s
this.a8(a,r,a.length,a,b)
this.Z(a,b,r,c)},
cD(a,b){var s=A.M(a)
return new A.aK(a,s.i("B(1)").a(b),s.i("aK<1>"))},
B(a,b){var s
A.M(a).i("f<1>").a(b)
a.$flags&1&&A.w(a,"addAll",2)
if(Array.isArray(b)){this.eq(a,b)
return}for(s=J.G(b);s.m();)a.push(s.gp())},
eq(a,b){var s,r
t.dG.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.e(A.a7(a))
for(r=0;r<s;++r)a.push(b[r])},
aa(a){a.$flags&1&&A.w(a,"clear","clear")
a.length=0},
a3(a,b){var s,r
A.M(a).i("~(1)").a(b)
s=a.length
for(r=0;r<s;++r){b.$1(a[r])
if(a.length!==s)throw A.e(A.a7(a))}},
aP(a,b,c){var s=A.M(a)
return new A.ao(a,s.G(c).i("1(2)").a(b),s.i("@<1>").G(c).i("ao<1,2>"))},
ac(a,b){var s,r=A.T(a.length,"",!1,t.N)
for(s=0;s<a.length;++s)this.n(r,s,A.t(a[s]))
return r.join(b)},
bE(a){return this.ac(a,"")},
al(a,b){return A.aS(a,0,A.cf(b,"count",t.S),A.M(a).c)},
T(a,b){return A.aS(a,b,null,A.M(a).c)},
dV(a,b,c,d){var s,r,q
d.a(b)
A.M(a).G(d).i("1(1,2)").a(c)
s=a.length
for(r=b,q=0;q<s;++q){r=c.$2(r,a[q])
if(a.length!==s)throw A.e(A.a7(a))}return r},
P(a,b){if(!(b>=0&&b<a.length))return A.a(a,b)
return a[b]},
I(a,b,c){if(b<0||b>a.length)throw A.e(A.a4(b,0,a.length,"start",null))
if(c==null)c=a.length
else if(c<b||c>a.length)throw A.e(A.a4(c,b,a.length,"end",null))
if(b===c)return A.b([],A.M(a))
return A.b(a.slice(b,c),A.M(a))},
a_(a,b){return this.I(a,b,null)},
bd(a,b,c){A.aB(b,c,a.length)
return A.aS(a,b,c,A.M(a).c)},
gu(a){if(a.length>0)return a[0]
throw A.e(A.aG())},
gS(a){var s=a.length
if(s>0)return a[s-1]
throw A.e(A.aG())},
a8(a,b,c,d,e){var s,r,q,p,o
A.M(a).i("f<1>").a(d)
a.$flags&2&&A.w(a,5)
A.aB(b,c,a.length)
s=c-b
if(s===0)return
A.aa(e,"skipCount")
if(t.j.b(d)){r=d
q=e}else{r=J.d0(d,e).aR(0,!1)
q=0}p=J.n(r)
if(q+s>p.gj(r))throw A.e(A.qf())
if(q<b)for(o=s-1;o>=0;--o)a[b+o]=p.h(r,q+o)
else for(o=0;o<s;++o)a[b+o]=p.h(r,q+o)},
Z(a,b,c,d){return this.a8(a,b,c,d,0)},
aF(a,b){var s,r
A.M(a).i("B(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.e(A.a7(a))}return!1},
ae(a,b){var s,r
A.M(a).i("B(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.e(A.a7(a))}return!0},
aC(a,b){var s,r,q,p,o,n=A.M(a)
n.i("c(1,1)?").a(b)
a.$flags&2&&A.w(a,"sort")
s=a.length
if(s<2)return
if(b==null)b=J.ww()
if(s===2){r=a[0]
q=a[1]
n=b.$2(r,q)
if(typeof n!=="number")return n.ix()
if(n>0){a[0]=q
a[1]=r}return}p=0
if(n.c.b(null))for(o=0;o<a.length;++o)if(a[o]===void 0){a[o]=null;++p}a.sort(A.dT(b,2))
if(p>0)this.fO(a,p)},
aT(a){return this.aC(a,null)},
fO(a,b){var s,r=a.length
for(;s=r-1,r>0;r=s)if(a[s]===null){a[s]=void 0;--b
if(b===0)break}},
aO(a,b,c){var s,r=a.length
if(c>=r)return-1
if(c<0)c=0
for(s=c;s<r;++s){if(!(s<a.length))return A.a(a,s)
if(J.k(a[s],b))return s}return-1},
aA(a,b){return this.aO(a,b,0)},
v(a,b){var s
for(s=0;s<a.length;++s)if(J.k(a[s],b))return!0
return!1},
gA(a){return a.length===0},
gH(a){return a.length!==0},
q(a){return A.oK(a,"[","]")},
aR(a,b){var s=A.b(a.slice(0),A.M(a))
return s},
ec(a){return this.aR(a,!0)},
ed(a){return A.uw(a,A.M(a).c)},
gt(a){return new J.aY(a,a.length,A.M(a).i("aY<1>"))},
gR(a){return A.dv(a)},
gj(a){return a.length},
sj(a,b){a.$flags&1&&A.w(a,"set length","change the length of")
if(b<0)throw A.e(A.a4(b,0,null,"newLength",null))
if(b>a.length)A.M(a).c.a(null)
a.length=b},
h(a,b){A.E(b)
if(!(b>=0&&b<a.length))throw A.e(A.o0(a,b))
return a[b]},
n(a,b,c){A.M(a).c.a(c)
a.$flags&2&&A.w(a)
if(!(b>=0&&b<a.length))throw A.e(A.o0(a,b))
a[b]=c},
cE(a,b){return new A.bH(a,b.i("bH<0>"))},
gV(a){return A.bm(A.M(a))},
$ix:1,
$if:1,
$ij:1,
hG(a,b){return this.gu(a).$1(b)},
hU(a,b){return this.gS(a).$1(b)}}
J.h_.prototype={
ip(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.hl(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.jx.prototype={}
J.aY.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
m(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.h(q)
throw A.e(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$iI:1}
J.dj.prototype={
a6(a,b){var s
A.ae(b)
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gbD(b)
if(this.gbD(a)===s)return 0
if(this.gbD(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gbD(a){return a===0?1/a<0:a<0},
K(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.e(A.as(""+a+".toInt()"))},
bz(a){var s,r
if(a>=0){if(a<=2147483647){s=a|0
return a===s?s:s+1}}else if(a>=-2147483648)return a|0
r=Math.ceil(a)
if(isFinite(r))return r
throw A.e(A.as(""+a+".ceil()"))},
a7(a){var s,r
if(a>=0){if(a<=2147483647)return a|0}else if(a>=-2147483648){s=a|0
return a===s?s:s-1}r=Math.floor(a)
if(isFinite(r))return r
throw A.e(A.as(""+a+".floor()"))},
Y(a){if(a>0){if(a!==1/0)return Math.round(a)}else if(a>-1/0)return 0-Math.round(0-a)
throw A.e(A.as(""+a+".round()"))},
a2(a){if(a<0)return-Math.round(-a)
else return Math.round(a)},
E(a,b,c){if(this.a6(b,c)>0)throw A.e(A.cY(b))
if(this.a6(a,b)<0)return b
if(this.a6(a,c)>0)return c
return a},
il(a,b){var s
if(b<0||b>20)throw A.e(A.a4(b,0,20,"fractionDigits",null))
s=a.toFixed(b)
if(a===0&&this.gbD(a))return"-"+s
return s},
ba(a,b){var s,r,q,p,o
if(b<2||b>36)throw A.e(A.a4(b,2,36,"radix",null))
s=a.toString(b)
r=s.length
q=r-1
if(!(q>=0))return A.a(s,q)
if(s.charCodeAt(q)!==41)return s
p=/^([\da-z]+)(?:\.([\da-z]+))?\(e\+(\d+)\)$/.exec(s)
if(p==null)A.p(A.as("Unexpected toString result: "+s))
r=p.length
if(1>=r)return A.a(p,1)
s=p[1]
if(3>=r)return A.a(p,3)
o=+p[3]
r=p[2]
if(r!=null){s+=r
o-=r.length}return s+B.d.aJ("0",o)},
q(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gR(a){var s,r,q,p,o=a|0
if(a===o)return o&536870911
s=Math.abs(a)
r=Math.log(s)/0.6931471805599453|0
q=Math.pow(2,r)
p=s<1?s/q:q/s
return((p*9007199254740992|0)+(p*3542243181176521|0))*599197+r*1259&536870911},
W(a,b){var s=a%b
if(s===0)return 0
if(s>0)return s
if(b<0)return s-b
else return s+b},
a9(a,b){if((a|0)===a)if(b>=1||b<-1)return a/b|0
return this.dv(a,b)},
N(a,b){return(a|0)===a?a/b|0:this.dv(a,b)},
dv(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.e(A.as("Result of truncating division is "+A.t(s)+": "+A.t(a)+" ~/ "+b))},
ab(a,b){if(b<0)throw A.e(A.cY(b))
return b>31?0:a<<b>>>0},
ai(a,b){return b>31?0:a<<b>>>0},
M(a,b){var s
if(a>0)s=this.bq(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
br(a,b){if(0>b)throw A.e(A.cY(b))
return this.bq(a,b)},
bq(a,b){return b>31?0:a>>>b},
gV(a){return A.bm(t.cZ)},
$ib_:1,
$id:1,
$iaq:1}
J.ei.prototype={
gV(a){return A.bm(t.S)},
$iR:1,
$ic:1}
J.h0.prototype={
gV(a){return A.bm(t.i)},
$iR:1}
J.bZ.prototype={
cb(a,b,c){var s=b.length
if(c>s)throw A.e(A.a4(c,0,s,null,null))
return new A.ih(b,a,c)},
ca(a,b){return this.cb(a,b,0)},
cl(a,b){var s=b.length,r=a.length
if(s>r)return!1
return b===this.am(a,r-s)},
cK(a,b){var s
if(typeof b=="string")return A.b(a.split(b),t.s)
else{if(b instanceof A.dk){s=b.e
s=!(s==null?b.e=b.eX():s)}else s=!1
if(s)return A.b(a.split(b.b),t.s)
else return this.f1(a,b)}},
f1(a,b){var s,r,q,p,o,n,m=A.b([],t.s)
for(s=J.pJ(b,a),s=s.gt(s),r=0,q=1;s.m();){p=s.gp()
o=p.gcL()
n=p.gck()
q=n-o
if(q===0&&r===o)continue
B.a.k(m,this.a5(a,r,o))
r=n}if(r<a.length||q>0)B.a.k(m,this.am(a,r))
return m},
av(a,b){var s=b.length
if(s>a.length)return!1
return b===a.substring(0,s)},
a5(a,b,c){return a.substring(b,A.aB(b,c,a.length))},
am(a,b){return this.a5(a,b,null)},
aH(a){var s,r,q,p=a.trim(),o=p.length
if(o===0)return p
if(0>=o)return A.a(p,0)
if(p.charCodeAt(0)===133){s=J.qj(p,1)
if(s===o)return""}else s=0
r=o-1
if(!(r>=0))return A.a(p,r)
q=p.charCodeAt(r)===133?J.qk(p,r):o
if(s===0&&q===o)return p
return p.substring(s,q)},
im(a){var s=a.trimStart(),r=s.length
if(r===0)return s
if(0>=r)return A.a(s,0)
if(s.charCodeAt(0)!==133)return s
return s.substring(J.qj(s,1))},
io(a){var s,r=a.trimEnd(),q=r.length
if(q===0)return r
s=q-1
if(!(s>=0))return A.a(r,s)
if(r.charCodeAt(s)!==133)return r
return r.substring(0,J.qk(r,s))},
aJ(a,b){var s,r
if(0>=b)return""
if(b===1||a.length===0)return a
if(b!==b>>>0)throw A.e(B.aq)
for(s=a,r="";;){if((b&1)===1)r=s+r
b=b>>>1
if(b===0)break
s+=s}return r},
e2(a,b,c){var s=b-a.length
if(s<=0)return a
return this.aJ(c,s)+a},
i6(a,b,c){var s=b-a.length
if(s<=0)return a
return a+this.aJ(c,s)},
aO(a,b,c){var s
if(c<0||c>a.length)throw A.e(A.a4(c,0,a.length,null,null))
s=a.indexOf(b,c)
return s},
aA(a,b){return this.aO(a,b,0)},
v(a,b){return A.y6(a,b,0)},
a6(a,b){var s
A.U(b)
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
gV(a){return A.bm(t.N)},
gj(a){return a.length},
$iR:1,
$ib_:1,
$ijO:1,
$iq:1}
A.cc.prototype={
gt(a){return new A.e2(J.G(this.gaj()),A.r(this).i("e2<1,2>"))},
gj(a){return J.X(this.gaj())},
gA(a){return J.d_(this.gaj())},
gH(a){return J.oF(this.gaj())},
T(a,b){var s=A.r(this)
return A.d6(J.d0(this.gaj(),b),s.c,s.y[1])},
al(a,b){var s=A.r(this)
return A.d6(J.iv(this.gaj(),b),s.c,s.y[1])},
P(a,b){return A.r(this).y[1].a(J.fp(this.gaj(),b))},
gu(a){return A.r(this).y[1].a(J.it(this.gaj()))},
v(a,b){return J.pN(this.gaj(),b)},
q(a){return J.bc(this.gaj())}}
A.e2.prototype={
m(){return this.a.m()},
gp(){return this.$ti.y[1].a(this.a.gp())},
$iI:1}
A.cj.prototype={
gaj(){return this.a}}
A.eX.prototype={$ix:1}
A.eV.prototype={
h(a,b){return this.$ti.y[1].a(J.aP(this.a,A.E(b)))},
n(a,b,c){var s=this.$ti
J.pH(this.a,b,s.c.a(s.y[1].a(c)))},
sj(a,b){J.tj(this.a,b)},
k(a,b){var s=this.$ti
J.pI(this.a,s.c.a(s.y[1].a(b)))},
bd(a,b,c){var s=this.$ti
return A.d6(J.ti(this.a,b,c),s.c,s.y[1])},
a8(a,b,c,d,e){var s=this.$ti
J.tk(this.a,b,c,A.d6(s.i("f<2>").a(d),s.y[1],s.c),e)},
Z(a,b,c,d){return this.a8(0,b,c,d,0)},
$ix:1,
$ij:1}
A.bq.prototype={
bx(a,b){return new A.bq(this.a,this.$ti.i("@<1>").G(b).i("bq<1,2>"))},
gaj(){return this.a}}
A.ck.prototype={
by(a,b,c){return new A.ck(this.a,this.$ti.i("@<1,2>").G(b).G(c).i("ck<1,2,3,4>"))},
J(a){return this.a.J(a)},
h(a,b){return this.$ti.i("4?").a(this.a.h(0,b))},
a3(a,b){this.a.a3(0,new A.iB(this,this.$ti.i("~(3,4)").a(b)))},
ga4(){var s=this.$ti
return A.d6(this.a.ga4(),s.c,s.y[2])},
gaI(){var s=this.$ti
return A.d6(this.a.gaI(),s.y[1],s.y[3])},
gj(a){var s=this.a
return s.gj(s)},
gA(a){var s=this.a
return s.gA(s)},
gH(a){var s=this.a
return s.gH(s)},
gag(){return this.a.gag().aP(0,new A.iA(this),this.$ti.i("a9<3,4>"))}}
A.iB.prototype={
$2(a,b){var s=this.a.$ti
s.c.a(a)
s.y[1].a(b)
this.b.$2(s.y[2].a(a),s.y[3].a(b))},
$S(){return this.a.$ti.i("~(1,2)")}}
A.iA.prototype={
$1(a){var s=this.a.$ti
s.i("a9<1,2>").a(a)
return new A.a9(s.y[2].a(a.a),s.y[3].a(a.b),s.i("a9<3,4>"))},
$S(){return this.a.$ti.i("a9<3,4>(a9<1,2>)")}}
A.dn.prototype={
q(a){return"LateInitializationError: "+this.a}}
A.da.prototype={
gj(a){return this.a.length},
h(a,b){var s
A.E(b)
s=this.a
if(!(b>=0&&b<s.length))return A.a(s,b)
return s.charCodeAt(b)}}
A.oi.prototype={
$0(){var s=new A.L($.J,t.cU)
s.aX(null)
return s},
$S:117}
A.kb.prototype={}
A.x.prototype={}
A.a_.prototype={
gt(a){var s=this
return new A.a0(s,s.gj(s),A.r(s).i("a0<a_.E>"))},
gA(a){return this.gj(this)===0},
gu(a){if(this.gj(this)===0)throw A.e(A.aG())
return this.P(0,0)},
v(a,b){var s,r=this,q=r.gj(r)
for(s=0;s<q;++s){if(J.k(r.P(0,s),b))return!0
if(q!==r.gj(r))throw A.e(A.a7(r))}return!1},
aF(a,b){var s,r,q=this
A.r(q).i("B(a_.E)").a(b)
s=q.gj(q)
for(r=0;r<s;++r){if(b.$1(q.P(0,r)))return!0
if(s!==q.gj(q))throw A.e(A.a7(q))}return!1},
ac(a,b){var s,r,q,p=this,o=p.gj(p)
if(b.length!==0){if(o===0)return""
s=A.t(p.P(0,0))
if(o!==p.gj(p))throw A.e(A.a7(p))
for(r=s,q=1;q<o;++q){r=r+b+A.t(p.P(0,q))
if(o!==p.gj(p))throw A.e(A.a7(p))}return r.charCodeAt(0)==0?r:r}else{for(q=0,r="";q<o;++q){r+=A.t(p.P(0,q))
if(o!==p.gj(p))throw A.e(A.a7(p))}return r.charCodeAt(0)==0?r:r}},
bE(a){return this.ac(0,"")},
aP(a,b,c){var s=A.r(this)
return new A.ao(this,s.G(c).i("1(a_.E)").a(b),s.i("@<a_.E>").G(c).i("ao<1,2>"))},
T(a,b){return A.aS(this,b,null,A.r(this).i("a_.E"))},
al(a,b){return A.aS(this,0,A.cf(b,"count",t.S),A.r(this).i("a_.E"))}}
A.bC.prototype={
cO(a,b,c,d){var s,r=this.b
A.aa(r,"start")
s=this.c
if(s!=null){A.aa(s,"end")
if(r>s)throw A.e(A.a4(r,0,s,"start",null))}},
gf3(){var s=J.X(this.a),r=this.c
if(r==null||r>s)return s
return r},
gh1(){var s=J.X(this.a),r=this.b
if(r>s)return s
return r},
gj(a){var s,r=J.X(this.a),q=this.b
if(q>=r)return 0
s=this.c
if(s==null||s>=r)return r-q
return s-q},
P(a,b){var s=this,r=s.gh1()+b
if(b<0||r>=s.gf3())throw A.e(A.jv(b,s.gj(0),s,"index"))
return J.fp(s.a,r)},
T(a,b){var s,r,q=this
A.aa(b,"count")
s=q.b+b
r=q.c
if(r!=null&&s>=r)return new A.e8(q.$ti.i("e8<1>"))
return A.aS(q.a,s,r,q.$ti.c)},
al(a,b){var s,r,q,p=this
A.aa(b,"count")
s=p.c
r=p.b
q=r+b
if(s==null)return A.aS(p.a,r,q,p.$ti.c)
else{if(s<q)return p
return A.aS(p.a,r,q,p.$ti.c)}},
aR(a,b){var s,r,q,p=this,o=p.b,n=p.a,m=J.n(n),l=m.gj(n),k=p.c
if(k!=null&&k<l)l=k
s=l-o
if(s<=0){n=J.oM(0,p.$ti.c)
return n}r=A.T(s,m.P(n,o),!1,p.$ti.c)
for(q=1;q<s;++q){B.a.n(r,q,m.P(n,o+q))
if(m.gj(n)<l)throw A.e(A.a7(p))}return r}}
A.a0.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
m(){var s,r=this,q=r.a,p=J.n(q),o=p.gj(q)
if(r.b!==o)throw A.e(A.a7(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.P(q,s);++r.c
return!0},
$iI:1}
A.cz.prototype={
gt(a){return new A.ep(J.G(this.a),this.b,A.r(this).i("ep<1,2>"))},
gj(a){return J.X(this.a)},
gA(a){return J.d_(this.a)},
gu(a){return this.b.$1(J.it(this.a))},
P(a,b){return this.b.$1(J.fp(this.a,b))}}
A.co.prototype={$ix:1}
A.ep.prototype={
m(){var s=this,r=s.b
if(r.m()){s.a=s.c.$1(r.gp())
return!0}s.a=null
return!1},
gp(){var s=this.a
return s==null?this.$ti.y[1].a(s):s},
$iI:1}
A.ao.prototype={
gj(a){return J.X(this.a)},
P(a,b){return this.b.$1(J.fp(this.a,b))}}
A.aK.prototype={
gt(a){return new A.eR(J.G(this.a),this.b,this.$ti.i("eR<1>"))}}
A.eR.prototype={
m(){var s,r
for(s=this.a,r=this.b;s.m();)if(r.$1(s.gp()))return!0
return!1},
gp(){return this.a.gp()},
$iI:1}
A.cI.prototype={
gt(a){var s=this.a
return new A.eL(s.gt(s),this.b,A.r(this).i("eL<1>"))}}
A.e7.prototype={
gj(a){var s=this.a,r=s.gj(s)
s=this.b
if(r>s)return s
return r},
$ix:1}
A.eL.prototype={
m(){if(--this.b>=0)return this.a.m()
this.b=-1
return!1},
gp(){if(this.b<0){this.$ti.c.a(null)
return null}return this.a.gp()},
$iI:1}
A.bB.prototype={
T(a,b){A.bO(b,"count",t.S)
A.aa(b,"count")
return new A.bB(this.a,this.b+b,A.r(this).i("bB<1>"))},
gt(a){var s=this.a
return new A.eI(s.gt(s),this.b,A.r(this).i("eI<1>"))}}
A.dg.prototype={
gj(a){var s=this.a,r=s.gj(s)-this.b
if(r>=0)return r
return 0},
T(a,b){A.bO(b,"count",t.S)
A.aa(b,"count")
return new A.dg(this.a,this.b+b,this.$ti)},
$ix:1}
A.eI.prototype={
m(){var s,r
for(s=this.a,r=0;r<this.b;++r)s.m()
this.b=0
return s.m()},
gp(){return this.a.gp()},
$iI:1}
A.e8.prototype={
gt(a){return B.aj},
gA(a){return!0},
gj(a){return 0},
gu(a){throw A.e(A.aG())},
P(a,b){throw A.e(A.a4(b,0,0,"index",null))},
v(a,b){return!1},
T(a,b){A.aa(b,"count")
return this},
al(a,b){A.aa(b,"count")
return this}}
A.e9.prototype={
m(){return!1},
gp(){throw A.e(A.aG())},
$iI:1}
A.bH.prototype={
gt(a){return new A.cK(J.G(this.a),this.$ti.i("cK<1>"))}}
A.cK.prototype={
m(){var s,r
for(s=this.a,r=this.$ti.c;s.m();)if(r.b(s.gp()))return!0
return!1},
gp(){return this.$ti.c.a(this.a.gp())},
$iI:1}
A.bw.prototype={
gj(a){return J.X(this.a)},
gA(a){return J.d_(this.a)},
gH(a){return J.oF(this.a)},
gu(a){return new A.z(this.b,J.it(this.a))},
P(a,b){return new A.z(b+this.b,J.fp(this.a,b))},
v(a,b){var s,r,q,p=null,o=null,n=!1
if(t.A.b(b)){s=b.a
if(A.dN(s)){A.E(s)
r=b.b
n=s>=this.b
o=r
p=s}}if(n){if(typeof p!=="number")return p.aV()
n=J.d0(this.a,p-this.b)
q=n.gt(n)
return q.m()&&J.k(q.gp(),o)}return!1},
al(a,b){A.bO(b,"count",t.S)
A.aa(b,"count")
return new A.bw(J.iv(this.a,b),this.b,A.r(this).i("bw<1>"))},
T(a,b){A.bO(b,"count",t.S)
A.aa(b,"count")
return new A.bw(J.d0(this.a,b),b+this.b,A.r(this).i("bw<1>"))},
gt(a){return new A.bx(J.G(this.a),this.b,A.r(this).i("bx<1>"))}}
A.cn.prototype={
v(a,b){var s,r,q,p,o=null,n=null,m=!1
if(t.A.b(b)){s=b.a
if(A.dN(s)){A.E(s)
r=b.b
m=s>=this.b
n=r
o=s}}if(m){if(typeof o!=="number")return o.aV()
q=o-this.b
m=this.a
p=J.n(m)
return q<p.gj(m)&&J.k(p.P(m,q),n)}return!1},
al(a,b){A.bO(b,"count",t.S)
A.aa(b,"count")
return new A.cn(J.iv(this.a,b),this.b,this.$ti)},
T(a,b){A.bO(b,"count",t.S)
A.aa(b,"count")
return new A.cn(J.d0(this.a,b),this.b+b,this.$ti)},
$ix:1}
A.bx.prototype={
m(){if(++this.c>=0&&this.a.m())return!0
this.c=-2
return!1},
gp(){var s=this.c
return s>=0?new A.z(this.b+s,this.a.gp()):A.p(A.aG())},
$iI:1}
A.a3.prototype={
sj(a,b){throw A.e(A.as("Cannot change the length of a fixed-length list"))},
k(a,b){A.a6(a).i("a3.E").a(b)
throw A.e(A.as("Cannot add to a fixed-length list"))}}
A.bG.prototype={
n(a,b,c){A.r(this).i("bG.E").a(c)
throw A.e(A.as("Cannot modify an unmodifiable list"))},
sj(a,b){throw A.e(A.as("Cannot change the length of an unmodifiable list"))},
k(a,b){A.r(this).i("bG.E").a(b)
throw A.e(A.as("Cannot add to an unmodifiable list"))},
a8(a,b,c,d,e){A.r(this).i("f<bG.E>").a(d)
throw A.e(A.as("Cannot modify an unmodifiable list"))},
Z(a,b,c,d){return this.a8(0,b,c,d,0)}}
A.dA.prototype={}
A.bi.prototype={
gj(a){return J.X(this.a)},
P(a,b){var s=this.a,r=J.n(s)
return r.P(s,r.gj(s)-1-b)}}
A.fi.prototype={}
A.z.prototype={$r:"+(1,2)",$s:1}
A.aM.prototype={$r:"+(1,2,3)",$s:2}
A.dc.prototype={
by(a,b,c){var s=A.r(this)
return A.qs(this,s.c,s.y[1],b,c)},
gA(a){return this.gj(this)===0},
gH(a){return this.gj(this)!==0},
q(a){return A.oS(this)},
n(a,b,c){var s=A.r(this)
s.c.a(b)
s.y[1].a(c)
A.tF()},
gag(){return new A.dL(this.hz(),A.r(this).i("dL<a9<1,2>>"))},
hz(){var s=this
return function(){var r=0,q=1,p=[],o,n,m,l,k
return function $async$gag(a,b,c){if(b===1){p.push(c)
r=q}for(;;)switch(r){case 0:o=s.ga4(),o=o.gt(o),n=A.r(s),m=n.y[1],n=n.i("a9<1,2>")
case 2:if(!o.m()){r=3
break}l=o.gp()
k=s.h(0,l)
r=4
return a.b=new A.a9(l,k==null?m.a(k):k,n),1
case 4:r=2
break
case 3:return 0
case 1:return a.c=p.at(-1),3}}}},
$iS:1}
A.aj.prototype={
gj(a){return this.b.length},
gd6(){var s=this.$keys
if(s==null){s=Object.keys(this.a)
this.$keys=s}return s},
J(a){if(typeof a!="string")return!1
if("__proto__"===a)return!1
return this.a.hasOwnProperty(a)},
h(a,b){if(!this.J(b))return null
return this.b[this.a[b]]},
a3(a,b){var s,r,q,p
this.$ti.i("~(1,2)").a(b)
s=this.gd6()
r=this.b
for(q=s.length,p=0;p<q;++p)b.$2(s[p],r[p])},
ga4(){return new A.cQ(this.gd6(),this.$ti.i("cQ<1>"))},
gaI(){return new A.cQ(this.b,this.$ti.i("cQ<2>"))}}
A.cQ.prototype={
gj(a){return this.a.length},
gA(a){return 0===this.a.length},
gH(a){return 0!==this.a.length},
gt(a){var s=this.a
return new A.bK(s,s.length,this.$ti.i("bK<1>"))}}
A.bK.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
m(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$iI:1}
A.bV.prototype={
aw(){var s=this,r=s.$map
if(r==null){r=new A.cu(s.$ti.i("cu<1,2>"))
A.rB(s.a,r)
s.$map=r}return r},
J(a){return this.aw().J(a)},
h(a,b){return this.aw().h(0,b)},
a3(a,b){this.$ti.i("~(1,2)").a(b)
this.aw().a3(0,b)},
ga4(){var s=this.aw()
return new A.an(s,A.r(s).i("an<1>"))},
gaI(){var s=this.aw()
return new A.b2(s,A.r(s).i("b2<2>"))},
gj(a){return this.aw().a}}
A.dd.prototype={}
A.b0.prototype={
gj(a){return this.b},
gA(a){return this.b===0},
gH(a){return this.b!==0},
gt(a){var s,r=this,q=r.$keys
if(q==null){q=Object.keys(r.a)
r.$keys=q}s=q
return new A.bK(s,s.length,r.$ti.i("bK<1>"))},
v(a,b){if(typeof b!="string")return!1
if("__proto__"===b)return!1
return this.a.hasOwnProperty(b)}}
A.bW.prototype={
gj(a){return this.a.length},
gA(a){return this.a.length===0},
gH(a){return this.a.length!==0},
gt(a){var s=this.a
return new A.bK(s,s.length,this.$ti.i("bK<1>"))},
aw(){var s,r,q,p,o=this,n=o.$map
if(n==null){n=new A.cu(o.$ti.i("cu<1,1>"))
for(s=o.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q]
n.n(0,p,p)}o.$map=n}return n},
v(a,b){return this.aw().J(b)}}
A.eD.prototype={}
A.l3.prototype={
ak(a){var s,r,q=this,p=new RegExp(q.a).exec(a)
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
A.ey.prototype={
q(a){return"Null check operator used on a null value"}}
A.h1.prototype={
q(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.hL.prototype={
q(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.jN.prototype={
q(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.ea.prototype={}
A.f6.prototype={
q(a){var s,r=this.b
if(r!=null)return r
r=this.a
s=r!==null&&typeof r==="object"?r.stack:null
return this.b=s==null?"":s},
$ib5:1}
A.bQ.prototype={
q(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.rM(r==null?"unknown":r)+"'"},
gV(a){var s=A.pm(this)
return A.bm(s==null?A.a6(this):s)},
$icq:1,
giw(){return this},
$C:"$1",
$R:1,
$D:null}
A.fy.prototype={$C:"$0",$R:0}
A.fz.prototype={$C:"$2",$R:2}
A.hC.prototype={}
A.hu.prototype={
q(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.rM(s)+"'"}}
A.d2.prototype={
C(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.d2))return!1
return this.$_target===b.$_target&&this.a===b.a},
gR(a){return(A.oj(this.a)^A.dv(this.$_target))>>>0},
q(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.hl(this.a)+"'")}}
A.ho.prototype={
q(a){return"RuntimeError: "+this.a}}
A.b1.prototype={
gj(a){return this.a},
gA(a){return this.a===0},
gH(a){return this.a!==0},
ga4(){return new A.an(this,A.r(this).i("an<1>"))},
gaI(){return new A.b2(this,A.r(this).i("b2<2>"))},
gag(){return new A.cw(this,A.r(this).i("cw<1,2>"))},
J(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.hO(a)},
hO(a){var s=this.d
if(s==null)return!1
return this.b6(this.d4(s,a),a)>=0},
B(a,b){A.r(this).i("S<1,2>").a(b).a3(0,new A.jy(this))},
h(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.hP(b)},
hP(a){var s,r,q=this.d
if(q==null)return null
s=this.d4(q,a)
r=this.b6(s,a)
if(r<0)return null
return s[r].b},
n(a,b,c){var s,r,q=this,p=A.r(q)
p.c.a(b)
p.y[1].a(c)
if(typeof b=="string"){s=q.b
q.cP(s==null?q.b=q.c_():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=q.c
q.cP(r==null?q.c=q.c_():r,b,c)}else q.hR(b,c)},
hR(a,b){var s,r,q,p,o=this,n=A.r(o)
n.c.a(a)
n.y[1].a(b)
s=o.d
if(s==null)s=o.d=o.c_()
r=o.bC(a)
q=s[r]
if(q==null)s[r]=[o.bN(a,b)]
else{p=o.b6(q,a)
if(p>=0)q[p].b=b
else q.push(o.bN(a,b))}},
b7(a,b){var s,r,q=this,p=A.r(q)
p.c.a(a)
p.i("2()").a(b)
if(q.J(a)){s=q.h(0,a)
return s==null?p.y[1].a(s):s}r=b.$0()
q.n(0,a,r)
return r},
ar(a,b){var s=this
if(typeof b=="string")return s.dq(s.b,b)
else if(typeof b=="number"&&(b&0x3fffffff)===b)return s.dq(s.c,b)
else return s.hQ(b)},
hQ(a){var s,r,q,p,o=this,n=o.d
if(n==null)return null
s=o.bC(a)
r=n[s]
q=o.b6(r,a)
if(q<0)return null
p=r.splice(q,1)[0]
o.dC(p)
if(r.length===0)delete n[s]
return p.b},
a3(a,b){var s,r,q=this
A.r(q).i("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.e(A.a7(q))
s=s.c}},
cP(a,b,c){var s,r=A.r(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.bN(b,c)
else s.b=c},
dq(a,b){var s
if(a==null)return null
s=a[b]
if(s==null)return null
this.dC(s)
delete a[b]
return s.b},
dc(){this.r=this.r+1&1073741823},
bN(a,b){var s=this,r=A.r(s),q=new A.jF(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else{r=s.f
r.toString
q.d=r
s.f=r.c=q}++s.a
s.dc()
return q},
dC(a){var s=this,r=a.d,q=a.c
if(r==null)s.e=q
else r.c=q
if(q==null)s.f=r
else q.d=r;--s.a
s.dc()},
bC(a){return J.bb(a)&1073741823},
d4(a,b){return a[this.bC(b)]},
b6(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.k(a[r].a,b))return r
return-1},
q(a){return A.oS(this)},
c_(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$ioP:1}
A.jy.prototype={
$2(a,b){var s=this.a,r=A.r(s)
s.n(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.r(this.a).i("~(1,2)")}}
A.jF.prototype={}
A.an.prototype={
gj(a){return this.a.a},
gA(a){return this.a.a===0},
gt(a){var s=this.a
return new A.em(s,s.r,s.e,this.$ti.i("em<1>"))},
v(a,b){return this.a.J(b)}}
A.em.prototype={
gp(){return this.d},
m(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.a7(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$iI:1}
A.b2.prototype={
gj(a){return this.a.a},
gA(a){return this.a.a===0},
gt(a){var s=this.a
return new A.cy(s,s.r,s.e,this.$ti.i("cy<1>"))}}
A.cy.prototype={
gp(){return this.d},
m(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.a7(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$iI:1}
A.cw.prototype={
gj(a){return this.a.a},
gA(a){return this.a.a===0},
gt(a){var s=this.a
return new A.cx(s,s.r,s.e,this.$ti.i("cx<1,2>"))}}
A.cx.prototype={
gp(){var s=this.d
s.toString
return s},
m(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.a7(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.a9(s.a,s.b,r.$ti.i("a9<1,2>"))
r.c=s.c
return!0}},
$iI:1}
A.cu.prototype={
bC(a){return A.xk(a)&1073741823},
b6(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.k(a[r].a,b))return r
return-1}}
A.o8.prototype={
$1(a){return this.a(a)},
$S:39}
A.o9.prototype={
$2(a,b){return this.a(a,b)},
$S:90}
A.oa.prototype={
$1(a){return this.a(A.U(a))},
$S:37}
A.bj.prototype={
gV(a){return A.bm(this.d5())},
d5(){return A.xq(this.$r,this.bY())},
q(a){return this.dA(!1)},
dA(a){var s,r,q,p,o,n=this.f6(),m=this.bY(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.a(m,q)
o=m[q]
l=a?l+A.qz(o):l+A.t(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
f6(){var s,r=this.$s
while($.lE.length<=r)B.a.k($.lE,null)
s=$.lE[r]
if(s==null){s=this.eW()
B.a.n($.lE,r,s)}return s},
eW(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=t.K,j=J.oL(l,k)
for(s=0;s<l;++s)j[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.a.n(j,q,r[s])}}return A.oR(j,k)}}
A.dI.prototype={
bY(){return[this.a,this.b]},
C(a,b){if(b==null)return!1
return b instanceof A.dI&&this.$s===b.$s&&J.k(this.a,b.a)&&J.k(this.b,b.b)},
gR(a){return A.oV(this.$s,this.a,this.b,B.I)}}
A.dJ.prototype={
bY(){return[this.a,this.b,this.c]},
C(a,b){var s=this
if(b==null)return!1
return b instanceof A.dJ&&s.$s===b.$s&&J.k(s.a,b.a)&&J.k(s.b,b.b)&&J.k(s.c,b.c)},
gR(a){var s=this
return A.oV(s.$s,s.a,s.b,s.c)}}
A.dk.prototype={
q(a){return"RegExp/"+this.a+"/"+this.b.flags},
gft(){var s=this,r=s.c
if(r!=null)return r
r=s.b
return s.c=A.ql(s.a,r.multiline,!r.ignoreCase,r.unicode,r.dotAll,"g")},
eX(){var s,r=this.a
if(!B.d.v(r,"("))return!1
s=this.b.unicode?"u":""
return new RegExp("(?:)|"+r,s).exec("").length>1},
cb(a,b,c){var s=b.length
if(c>s)throw A.e(A.a4(c,0,s,null,null))
return new A.hN(this,b,c)},
ca(a,b){return this.cb(0,b,0)},
f5(a,b){var s,r=this.gft()
if(r==null)r=A.ba(r)
r.lastIndex=b
s=r.exec(a)
if(s==null)return null
return new A.ic(s)},
$ijO:1,
$iuY:1}
A.ic.prototype={
gcL(){return this.b.index},
gck(){var s=this.b
return s.index+s[0].length},
$idr:1,
$ieC:1}
A.hN.prototype={
gt(a){return new A.eS(this.a,this.b,this.c)}}
A.eS.prototype={
gp(){var s=this.d
return s==null?t.lu.a(s):s},
m(){var s,r,q,p,o,n,m=this,l=m.b
if(l==null)return!1
s=m.c
r=l.length
if(s<=r){q=m.a
p=q.f5(l,s)
if(p!=null){m.d=p
o=p.gck()
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
A.eK.prototype={
gck(){return this.a+this.c.length},
$idr:1,
gcL(){return this.a}}
A.ih.prototype={
gt(a){return new A.ii(this.a,this.b,this.c)},
gu(a){var s=this.b,r=this.a.indexOf(s,this.c)
if(r>=0)return new A.eK(r,s)
throw A.e(A.aG())}}
A.ii.prototype={
m(){var s,r,q=this,p=q.c,o=q.b,n=o.length,m=q.a,l=m.length
if(p+n>l){q.d=null
return!1}s=m.indexOf(o,p)
if(s<0){q.c=l+1
q.d=null
return!1}r=s+n
q.d=new A.eK(s,o)
q.c=r===q.c?r+1:r
return!0},
gp(){var s=this.d
s.toString
return s},
$iI:1}
A.c0.prototype={
gdX(a){return a.byteLength},
gV(a){return B.dn},
dL(a,b,c){A.bN(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
dK(a,b,c){A.bN(a,b,c)
return new Uint16Array(a,b,c)},
dI(a,b,c){A.bN(a,b,c)
return new Float32Array(a,b,c)},
dJ(a,b,c){A.bN(a,b,c)
return new Float64Array(a,b,c)},
dH(a,b,c){var s
A.bN(a,b,c)
s=new DataView(a,b,c)
return s},
$iR:1,
$ic0:1}
A.du.prototype={$idu:1}
A.eu.prototype={
gaq(a){if(((a.$flags|0)&2)!==0)return new A.lM(a.buffer)
else return a.buffer},
fi(a,b,c,d){var s=A.a4(b,0,c,d,null)
throw A.e(s)},
cW(a,b,c,d){if(b>>>0!==b||b>c)this.fi(a,b,c,d)}}
A.lM.prototype={
gdX(a){return this.a.byteLength},
dL(a,b,c){var s=A.oU(this.a,b,c)
s.$flags=3
return s},
dK(a,b,c){var s=A.uI(this.a,b,c)
s.$flags=3
return s},
dI(a,b,c){var s=A.uF(this.a,b,c)
s.$flags=3
return s},
dJ(a,b,c){var s=A.uG(this.a,b,c)
s.$flags=3
return s},
dH(a,b,c){var s=A.uE(this.a,b,c)
s.$flags=3
return s}}
A.et.prototype={
gV(a){return B.dp},
$iR:1,
$ipY:1}
A.ap.prototype={
gj(a){return a.length},
dt(a,b,c,d,e){var s,r,q=a.length
this.cW(a,b,q,"start")
this.cW(a,c,q,"end")
if(b>c)throw A.e(A.a4(b,0,c,null,null))
s=c-b
r=d.length
if(r-e<s)throw A.e(A.cG("Not enough elements"))
if(e!==0||r!==s)d=d.subarray(e,e+s)
a.set(d,b)},
$iaH:1}
A.c1.prototype={
h(a,b){A.E(b)
A.bM(b,a,a.length)
return a[b]},
n(a,b,c){A.cW(c)
a.$flags&2&&A.w(a)
A.bM(b,a,a.length)
a[b]=c},
a8(a,b,c,d,e){t.id.a(d)
a.$flags&2&&A.w(a,5)
if(t.dQ.b(d)){this.dt(a,b,c,d,e)
return}this.cN(a,b,c,d,e)},
Z(a,b,c,d){return this.a8(a,b,c,d,0)},
$ix:1,
$if:1,
$ij:1}
A.aI.prototype={
n(a,b,c){A.E(c)
a.$flags&2&&A.w(a)
A.bM(b,a,a.length)
a[b]=c},
a8(a,b,c,d,e){t.fm.a(d)
a.$flags&2&&A.w(a,5)
if(t.aj.b(d)){this.dt(a,b,c,d,e)
return}this.cN(a,b,c,d,e)},
Z(a,b,c,d){return this.a8(a,b,c,d,0)},
$ix:1,
$if:1,
$ij:1}
A.cA.prototype={
gV(a){return B.dq},
I(a,b,c){return new Float32Array(a.subarray(b,A.bl(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iR:1,
$icA:1,
$ibS:1}
A.cB.prototype={
gV(a){return B.dr},
I(a,b,c){return new Float64Array(a.subarray(b,A.bl(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iR:1,
$icB:1,
$ibT:1}
A.hb.prototype={
gV(a){return B.ds},
h(a,b){A.E(b)
A.bM(b,a,a.length)
return a[b]},
I(a,b,c){return new Int16Array(a.subarray(b,A.bl(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iR:1,
$ioJ:1}
A.cC.prototype={
gV(a){return B.dt},
h(a,b){A.E(b)
A.bM(b,a,a.length)
return a[b]},
I(a,b,c){return new Int32Array(a.subarray(b,A.bl(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iR:1,
$icC:1,
$ieg:1}
A.hc.prototype={
gV(a){return B.du},
h(a,b){A.E(b)
A.bM(b,a,a.length)
return a[b]},
I(a,b,c){return new Int8Array(a.subarray(b,A.bl(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iR:1}
A.cE.prototype={
gV(a){return B.dx},
h(a,b){A.E(b)
A.bM(b,a,a.length)
return a[b]},
I(a,b,c){return new Uint16Array(a.subarray(b,A.bl(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iR:1,
$icE:1,
$il5:1}
A.ev.prototype={
gV(a){return B.dy},
h(a,b){A.E(b)
A.bM(b,a,a.length)
return a[b]},
I(a,b,c){return new Uint32Array(a.subarray(b,A.bl(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iR:1,
$ip_:1}
A.ew.prototype={
gV(a){return B.dz},
gj(a){return a.length},
h(a,b){A.E(b)
A.bM(b,a,a.length)
return a[b]},
I(a,b,c){return new Uint8ClampedArray(a.subarray(b,A.bl(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iR:1}
A.c2.prototype={
gV(a){return B.dA},
gj(a){return a.length},
h(a,b){A.E(b)
A.bM(b,a,a.length)
return a[b]},
I(a,b,c){return new Uint8Array(a.subarray(b,A.bl(b,c,a.length)))},
a_(a,b){return this.I(a,b,null)},
$iR:1,
$ic2:1,
$ica:1}
A.f1.prototype={}
A.f2.prototype={}
A.f3.prototype={}
A.f4.prototype={}
A.b4.prototype={
i(a){return A.ff(v.typeUniverse,this,a)},
G(a){return A.ra(v.typeUniverse,this,a)}}
A.i3.prototype={}
A.il.prototype={
q(a){return A.aN(this.a,null)}}
A.hY.prototype={
q(a){return this.a}}
A.fb.prototype={$ibE:1}
A.lc.prototype={
$1(a){var s=this.a,r=s.a
s.a=null
r.$0()},
$S:19}
A.lb.prototype={
$1(a){var s,r
this.a.a=t.M.a(a)
s=this.b
r=this.c
s.firstChild?s.removeChild(r):s.appendChild(r)},
$S:48}
A.ld.prototype={
$0(){this.a.$0()},
$S:36}
A.le.prototype={
$0(){this.a.$0()},
$S:36}
A.lJ.prototype={
eo(a,b){if(self.setTimeout!=null)this.b=self.setTimeout(A.dT(new A.lK(this,b),0),a)
else throw A.e(A.as("`setTimeout()` not found."))},
b4(){if(self.setTimeout!=null){var s=this.b
if(s==null)return
self.clearTimeout(s)
this.b=null}else throw A.e(A.as("Canceling a timer."))}}
A.lK.prototype={
$0(){this.a.b=null
this.b.$0()},
$S:0}
A.hO.prototype={
ce(a){var s,r=this,q=r.$ti
q.i("1/?").a(a)
if(a==null)a=q.c.a(a)
if(!r.b)r.a.aX(a)
else{s=r.a
if(q.i("a8<1>").b(a))s.cV(a)
else s.bi(a)}},
cf(a,b){var s=this.a
if(this.b)s.aD(new A.ai(a,b))
else s.aY(new A.ai(a,b))}}
A.lS.prototype={
$1(a){return this.a.$2(0,a)},
$S:20}
A.lT.prototype={
$2(a,b){this.a.$2(1,new A.ea(a,t.l.a(b)))},
$S:44}
A.nR.prototype={
$2(a,b){this.a(A.E(a),b)},
$S:46}
A.fa.prototype={
gp(){var s=this.b
return s==null?this.$ti.c.a(s):s},
fQ(a,b){var s,r,q
a=A.E(a)
b=b
s=this.a
for(;;)try{r=s(this,a,b)
return r}catch(q){b=q
a=1}},
m(){var s,r,q,p,o=this,n=null,m=0
for(;;){s=o.d
if(s!=null)try{if(s.m()){o.b=s.gp()
return!0}else o.d=null}catch(r){n=r
m=1
o.d=null}q=o.fQ(m,n)
if(1===q)return!0
if(0===q){o.b=null
p=o.e
if(p==null||p.length===0){o.a=A.r4
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
o.a=A.r4
throw n
return!1}if(0>=p.length)return A.a(p,-1)
o.a=p.pop()
m=1
continue}throw A.e(A.cG("sync*"))}return!1},
iy(a){var s,r,q=this
if(a instanceof A.dL){s=a.a()
r=q.e
if(r==null)r=q.e=[]
B.a.k(r,q.a)
q.a=s
return 2}else{q.d=J.G(a)
return 2}},
$iI:1}
A.dL.prototype={
gt(a){return new A.fa(this.a(),this.$ti.i("fa<1>"))}}
A.ai.prototype={
q(a){return A.t(this.a)},
$iW:1,
gaU(){return this.b}}
A.ja.prototype={
$0(){this.c.a(null)
this.b.bS(null)},
$S:0}
A.l2.prototype={
q(a){var s=this.b.q(0)
return"TimeoutException after "+s+": "+this.a}}
A.hU.prototype={
cf(a,b){var s=this.a
if((s.a&30)!==0)throw A.e(A.cG("Future already completed"))
s.aY(A.wv(a,b))},
dQ(a){return this.cf(a,null)}}
A.eU.prototype={
ce(a){var s,r=this.$ti
r.i("1/?").a(a)
s=this.a
if((s.a&30)!==0)throw A.e(A.cG("Future already completed"))
s.aX(r.i("1/").a(a))}}
A.b8.prototype={
i0(a){if((this.c&15)!==6)return!0
return this.b.b.cA(t.iW.a(this.d),a.a,t.y,t.K)},
hI(a){var s,r=this,q=r.e,p=null,o=t.z,n=t.K,m=a.a,l=r.b.b
if(t.ng.b(q))p=l.ig(q,m,a.b,o,n,t.l)
else p=l.cA(t.B.a(q),m,o,n)
try{o=r.$ti.i("2/").a(p)
return o}catch(s){if(t.do.b(A.bn(s))){if((r.c&1)!==0)throw A.e(A.aQ("The error handler of Future.then must return a value of the returned future's type","onError"))
throw A.e(A.aQ("The error handler of Future.catchError must return a value of the future's type","onError"))}else throw s}}}
A.L.prototype={
b9(a,b,c){var s,r,q,p=this.$ti
p.G(c).i("1/(2)").a(a)
s=$.J
if(s===B.f){if(b!=null&&!t.ng.b(b)&&!t.B.b(b))throw A.e(A.ix(b,"onError",u.c))}else{c.i("@<0/>").G(p.c).i("1(2)").a(a)
if(b!=null)b=A.wY(b,s)}r=new A.L(s,c.i("L<0>"))
q=b==null?1:3
this.aW(new A.b8(r,q,a,b,p.i("@<1>").G(c).i("b8<1,2>")))
return r},
eb(a,b){return this.b9(a,null,b)},
dz(a,b,c){var s,r=this.$ti
r.G(c).i("1/(2)").a(a)
s=new A.L($.J,c.i("L<0>"))
this.aW(new A.b8(s,19,a,b,r.i("@<1>").G(c).i("b8<1,2>")))
return s},
it(a){var s,r
t.mY.a(a)
s=this.$ti
r=new A.L($.J,s)
this.aW(new A.b8(r,8,a,null,s.i("b8<1,1>")))
return r},
fX(a){this.$ti.c.a(a)
this.a=8
this.c=a},
fU(a){this.a=this.a&1|16
this.c=a},
bh(a){this.a=a.a&30|this.a&1
this.c=a.c},
aW(a){var s,r=this,q=r.a
if(q<=3){a.a=t.F.a(r.c)
r.c=a}else{if((q&4)!==0){s=t._.a(r.c)
if((s.a&24)===0){s.aW(a)
return}r.bh(s)}A.dQ(null,null,r.b,t.M.a(new A.li(r,a)))}},
dl(a){var s,r,q,p,o,n,m=this,l={}
l.a=a
if(a==null)return
s=m.a
if(s<=3){r=t.F.a(m.c)
m.c=a
if(r!=null){q=a.a
for(p=a;q!=null;p=q,q=o)o=q.a
p.a=r}}else{if((s&4)!==0){n=t._.a(m.c)
if((n.a&24)===0){n.dl(a)
return}m.bh(n)}l.a=m.bp(a)
A.dQ(null,null,m.b,t.M.a(new A.ln(l,m)))}},
b0(){var s=t.F.a(this.c)
this.c=null
return this.bp(s)},
bp(a){var s,r,q
for(s=a,r=null;s!=null;r=s,s=q){q=s.a
s.a=r}return r},
bS(a){var s,r=this,q=r.$ti
q.i("1/").a(a)
if(q.i("a8<1>").b(a))A.ll(a,r,!0)
else{s=r.b0()
q.c.a(a)
r.a=8
r.c=a
A.cP(r,s)}},
bi(a){var s,r=this
r.$ti.c.a(a)
s=r.b0()
r.a=8
r.c=a
A.cP(r,s)},
eV(a){var s,r,q=this
if((a.a&16)!==0){s=q.b===a.b
s=!(s||s)}else s=!1
if(s)return
r=q.b0()
q.bh(a)
A.cP(q,r)},
aD(a){var s=this.b0()
this.fU(a)
A.cP(this,s)},
eU(a,b){A.ba(a)
t.l.a(b)
this.aD(new A.ai(a,b))},
aX(a){var s=this.$ti
s.i("1/").a(a)
if(s.i("a8<1>").b(a)){this.cV(a)
return}this.cU(a)},
cU(a){var s=this
s.$ti.c.a(a)
s.a^=2
A.dQ(null,null,s.b,t.M.a(new A.lk(s,a)))},
cV(a){A.ll(this.$ti.i("a8<1>").a(a),this,!1)
return},
aY(a){this.a^=2
A.dQ(null,null,this.b,t.M.a(new A.lj(this,a)))},
ik(a){var s,r=this,q={}
if((r.a&24)!==0){q=new A.L($.J,r.$ti)
q.aX(r)
return q}s=new A.L($.J,r.$ti)
q.a=null
q.a=A.qP(a,new A.lt(s,a))
r.b9(new A.lu(q,r,s),new A.lv(q,s),t.P)
return s},
$ia8:1}
A.li.prototype={
$0(){A.cP(this.a,this.b)},
$S:0}
A.ln.prototype={
$0(){A.cP(this.b,this.a.a)},
$S:0}
A.lm.prototype={
$0(){A.ll(this.a.a,this.b,!0)},
$S:0}
A.lk.prototype={
$0(){this.a.bi(this.b)},
$S:0}
A.lj.prototype={
$0(){this.a.aD(this.b)},
$S:0}
A.lq.prototype={
$0(){var s,r,q,p,o,n,m,l,k=this,j=null
try{q=k.a.a
j=q.b.b.ea(t.mY.a(q.d),t.z)}catch(p){s=A.bn(p)
r=A.cg(p)
if(k.c&&t.v.a(k.b.a.c).a===s){q=k.a
q.c=t.v.a(k.b.a.c)}else{q=s
o=r
if(o==null)o=A.oG(q)
n=k.a
n.c=new A.ai(q,o)
q=n}q.b=!0
return}if(j instanceof A.L&&(j.a&24)!==0){if((j.a&16)!==0){q=k.a
q.c=t.v.a(j.c)
q.b=!0}return}if(j instanceof A.L){m=k.b.a
l=new A.L(m.b,m.$ti)
j.b9(new A.lr(l,m),new A.ls(l),t.o)
q=k.a
q.c=l
q.b=!1}},
$S:0}
A.lr.prototype={
$1(a){this.a.eV(this.b)},
$S:19}
A.ls.prototype={
$2(a,b){A.ba(a)
t.l.a(b)
this.a.aD(new A.ai(a,b))},
$S:35}
A.lp.prototype={
$0(){var s,r,q,p,o,n,m,l
try{q=this.a
p=q.a
o=p.$ti
n=o.c
m=n.a(this.b)
q.c=p.b.b.cA(o.i("2/(1)").a(p.d),m,o.i("2/"),n)}catch(l){s=A.bn(l)
r=A.cg(l)
q=s
p=r
if(p==null)p=A.oG(q)
o=this.a
o.c=new A.ai(q,p)
o.b=!0}},
$S:0}
A.lo.prototype={
$0(){var s,r,q,p,o,n,m,l=this
try{s=t.v.a(l.a.a.c)
p=l.b
if(p.a.i0(s)&&p.a.e!=null){p.c=p.a.hI(s)
p.b=!1}}catch(o){r=A.bn(o)
q=A.cg(o)
p=t.v.a(l.a.a.c)
if(p.a===r){n=l.b
n.c=p
p=n}else{p=r
n=q
if(n==null)n=A.oG(p)
m=l.b
m.c=new A.ai(p,n)
p=m}p.b=!0}},
$S:0}
A.lt.prototype={
$0(){var s=A.qH()
this.a.aD(new A.ai(new A.l2("Future not completed",this.b),s))},
$S:0}
A.lu.prototype={
$1(a){var s
this.b.$ti.c.a(a)
s=this.a.a
if(s.b!=null){s.b4()
this.c.bi(a)}},
$S(){return this.b.$ti.i("ad(1)")}}
A.lv.prototype={
$2(a,b){var s
A.ba(a)
t.l.a(b)
s=this.a.a
if(s.b!=null){s.b4()
this.b.aD(new A.ai(a,b))}},
$S:35}
A.hP.prototype={}
A.dx.prototype={
gj(a){var s={},r=new A.L($.J,t.hy)
s.a=0
this.dY(new A.ki(s,this),!0,new A.kj(s,r),r.geT())
return r}}
A.ki.prototype={
$1(a){this.b.$ti.c.a(a);++this.a.a},
$S(){return this.b.$ti.i("~(1)")}}
A.kj.prototype={
$0(){this.b.bS(this.a.a)},
$S:0}
A.f7.prototype={
gfD(){var s,r=this
if((r.b&8)===0)return A.r(r).i("b9<1>?").a(r.a)
s=A.r(r)
return s.i("b9<1>?").a(s.i("f8<1>").a(r.a).gc5())},
f4(){var s,r,q=this
if((q.b&8)===0){s=q.a
if(s==null)s=q.a=new A.b9(A.r(q).i("b9<1>"))
return A.r(q).i("b9<1>").a(s)}r=A.r(q)
s=r.i("f8<1>").a(q.a).gc5()
return r.i("b9<1>").a(s)},
gh4(){var s=this.a
if((this.b&8)!==0)s=t.d3.a(s).gc5()
return A.r(this).i("cM<1>").a(s)},
eK(){if((this.b&4)!==0)return new A.c6("Cannot add event after closing")
return new A.c6("Cannot add event while adding a stream")},
h3(a,b,c,d){var s,r,q,p,o,n=this,m=A.r(n)
m.i("~(1)?").a(a)
t.jE.a(c)
if((n.b&3)!==0)throw A.e(A.cG("Stream has already been listened to."))
s=$.J
r=d?1:0
t.bm.G(m.c).i("1(2)").a(a)
A.vx(s,b)
t.M.a(c)
q=new A.cM(n,a,s,r|32,m.i("cM<1>"))
p=n.gfD()
if(((n.b|=1)&8)!==0){o=m.i("f8<1>").a(n.a)
o.sc5(q)
o.cz()}else n.a=q
q.fV(p)
q.bZ(new A.lI(n))
return q},
fK(a){var s,r,q,p,o,n,m,l,k,j=this,i=A.r(j)
i.i("hv<1>").a(a)
s=null
if((j.b&8)!==0)s=i.i("f8<1>").a(j.a).b4()
j.a=null
j.b=j.b&4294967286|2
r=j.r
if(r!=null)if(s==null)try{q=r.$0()
if(q instanceof A.L)s=q}catch(n){p=A.bn(n)
o=A.cg(n)
m=new A.L($.J,t.cU)
i=A.ba(p)
l=t.l.a(o)
m.aY(new A.ai(i,l))
s=m}else s=s.it(r)
i=new A.lH(j)
if(s!=null){l=s
t.mY.a(i)
k=l.$ti
m=new A.L($.J,k)
l.aW(new A.b8(m,8,i,null,k.i("b8<1,1>")))
s=m}else i.$0()
return s},
$ir3:1,
$icO:1}
A.lI.prototype={
$0(){A.pf(this.a.d)},
$S:0}
A.lH.prototype={
$0(){},
$S:0}
A.hQ.prototype={
c2(a){var s=this.$ti
s.c.a(a)
this.gh4().eA(new A.cN(a,s.i("cN<1>")))}}
A.dD.prototype={}
A.dH.prototype={
gR(a){return(A.dv(this.a)^892482866)>>>0},
C(a,b){if(b==null)return!1
if(this===b)return!0
return b instanceof A.dH&&b.a===this.a}}
A.cM.prototype={
fu(){return this.w.fK(this)},
bn(){var s=this.w,r=A.r(s)
r.i("hv<1>").a(this)
if((s.b&8)!==0)r.i("f8<1>").a(s.a).e3()
A.pf(s.e)},
bo(){var s=this.w,r=A.r(s)
r.i("hv<1>").a(this)
if((s.b&8)!==0)r.i("f8<1>").a(s.a).cz()
A.pf(s.f)}}
A.dE.prototype={
fV(a){var s=this
A.r(s).i("b9<1>?").a(a)
if(a==null)return
s.r=a
if(a.c!=null){s.e=(s.e|128)>>>0
a.be(s)}},
e3(){var s,r,q=this,p=q.e
if((p&8)!==0)return
s=(p+256|4)>>>0
q.e=s
if(p<256){r=q.r
if(r!=null)if(r.a===1)r.a=3}if((p&4)===0&&(s&64)===0)q.bZ(q.gdd())},
cz(){var s=this,r=s.e
if((r&8)!==0)return
if(r>=256){r=s.e=r-256
if(r<256)if((r&128)!==0&&s.r.c!=null)s.r.be(s)
else{r=(r&4294967291)>>>0
s.e=r
if((r&64)===0)s.bZ(s.gde())}}},
bn(){},
bo(){},
eA(a){var s,r=this,q=r.r
if(q==null)q=r.r=new A.b9(A.r(r).i("b9<1>"))
q.k(0,a)
s=r.e
if((s&128)===0){s=(s|128)>>>0
r.e=s
if(s<256)q.be(r)}},
c2(a){var s,r=this,q=A.r(r).c
q.a(a)
s=r.e
r.e=(s|64)>>>0
r.d.ii(r.a,a,q)
r.e=(r.e&4294967231)>>>0
r.cX((s&4)!==0)},
bZ(a){var s,r=this
t.M.a(a)
s=r.e
r.e=(s|64)>>>0
a.$0()
r.e=(r.e&4294967231)>>>0
r.cX((s&4)!==0)},
cX(a){var s,r,q=this,p=q.e
if((p&128)!==0&&q.r.c==null){p=q.e=(p&4294967167)>>>0
s=!1
if((p&4)!==0)if(p<256){s=q.r
s=s==null?null:s.c==null
s=s!==!1}if(s){p=(p&4294967291)>>>0
q.e=p}}for(;;a=r){if((p&8)!==0){q.r=null
return}r=(p&4)!==0
if(a===r)break
q.e=(p^64)>>>0
if(r)q.bn()
else q.bo()
p=(q.e&4294967231)>>>0
q.e=p}if((p&128)!==0&&p<256)q.r.be(q)},
$ihv:1,
$icO:1}
A.f9.prototype={
dY(a,b,c,d){var s=this.$ti
s.i("~(1)?").a(a)
t.jE.a(c)
return this.a.h3(s.i("~(1)?").a(a),d,c,!0)}}
A.eW.prototype={}
A.cN.prototype={}
A.b9.prototype={
be(a){var s,r=this
r.$ti.i("cO<1>").a(a)
s=r.a
if(s===1)return
if(s>=1){r.a=1
return}A.y1(new A.lD(r,a))
r.a=1},
k(a,b){var s=this,r=s.c
if(r==null)s.b=s.c=b
else s.c=r.a=b}}
A.lD.prototype={
$0(){var s,r,q,p=this.a,o=p.a
p.a=0
if(o===3)return
s=p.$ti.i("cO<1>").a(this.b)
r=p.b
q=r.a
p.b=q
if(q==null)p.c=null
A.r(r).i("cO<1>").a(s).c2(r.b)},
$S:0}
A.cV.prototype={
gp(){var s=this
if(s.c)return s.$ti.c.a(s.b)
return s.$ti.c.a(null)},
m(){var s,r=this,q=r.a
if(q!=null){if(r.c){s=new A.L($.J,t.k)
r.b=s
r.c=!1
q.cz()
return s}throw A.e(A.cG("Already waiting for next."))}return r.fg()},
fg(){var s,r,q=this,p=q.b
if(p!=null){q.$ti.i("dx<1>").a(p)
s=new A.L($.J,t.k)
q.b=s
r=p.dY(q.gfv(),!0,q.gfz(),q.gfB())
if(q.b!=null)q.a=r
return s}return $.rP()},
b4(){var s,r,q=this,p=q.a,o=q.b
q.b=null
if(p!=null){q.a=null
if(!q.c)t.k.a(o).aX(!1)
else q.c=!1
s=p.e=(p.e&4294967279)>>>0
if((s&8)===0){s=p.e=(s|8)>>>0
if((s&128)!==0){r=p.r
if(r.a===1)r.a=3}if((s&64)===0)p.r=null
p.f=p.fu()}s=p.f
return s==null?$.pC():s}return $.pC()},
fw(a){var s,r,q=this
q.$ti.c.a(a)
if(q.a==null)return
s=t.k.a(q.b)
q.b=a
q.c=!0
s.bS(!0)
if(q.c){r=q.a
if(r!=null)r.e3()}},
fC(a,b){var s,r,q=this
A.ba(a)
t.l.a(b)
s=q.a
r=t.k.a(q.b)
q.b=q.a=null
if(s!=null)r.aD(new A.ai(a,b))
else r.aY(new A.ai(a,b))},
fA(){var s=this,r=s.a,q=t.k.a(s.b)
s.b=s.a=null
if(r!=null)q.bi(!1)
else q.cU(!1)}}
A.fh.prototype={$iqT:1}
A.ig.prototype={
ih(a){var s,r,q
t.M.a(a)
try{if(B.f===$.J){a.$0()
return}A.rr(null,null,this,a,t.o)}catch(q){s=A.bn(q)
r=A.cg(q)
A.iq(A.ba(s),t.l.a(r))}},
ii(a,b,c){var s,r,q
c.i("~(0)").a(a)
c.a(b)
try{if(B.f===$.J){a.$1(b)
return}A.rs(null,null,this,a,b,t.o,c)}catch(q){s=A.bn(q)
r=A.cg(q)
A.iq(A.ba(s),t.l.a(r))}},
cd(a){return new A.lG(this,t.M.a(a))},
ea(a,b){b.i("0()").a(a)
if($.J===B.f)return a.$0()
return A.rr(null,null,this,a,b)},
cA(a,b,c,d){c.i("@<0>").G(d).i("1(2)").a(a)
d.a(b)
if($.J===B.f)return a.$1(b)
return A.rs(null,null,this,a,b,c,d)},
ig(a,b,c,d,e,f){d.i("@<0>").G(e).G(f).i("1(2,3)").a(a)
e.a(b)
f.a(c)
if($.J===B.f)return a.$2(b,c)
return A.x_(null,null,this,a,b,c,d,e,f)},
cv(a,b,c,d){return b.i("@<0>").G(c).G(d).i("1(2,3)").a(a)}}
A.lG.prototype={
$0(){return this.a.ih(this.b)},
$S:0}
A.nL.prototype={
$0(){A.tX(this.a,this.b)},
$S:0}
A.cS.prototype={
gt(a){var s=this,r=new A.cT(s,s.r,A.r(s).i("cT<1>"))
r.c=s.e
return r},
gj(a){return this.a},
gA(a){return this.a===0},
gH(a){return this.a!==0},
v(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.nF.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.nF.a(r[b])!=null}else return this.eY(b)},
eY(a){var s=this.d
if(s==null)return!1
return this.d2(s[this.cY(a)],a)>=0},
gu(a){var s=this.e
if(s==null)throw A.e(A.cG("No elements"))
return A.r(this).c.a(s.a)},
k(a,b){var s,r,q=this
A.r(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.cR(s==null?q.b=A.p1():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.cR(r==null?q.c=A.p1():r,b)}else return q.ep(b)},
ep(a){var s,r,q,p=this
A.r(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.p1()
r=p.cY(a)
q=s[r]
if(q==null)s[r]=[p.c0(a)]
else{if(p.d2(q,a)>=0)return!1
q.push(p.c0(a))}return!0},
cR(a,b){A.r(this).c.a(b)
if(t.nF.a(a[b])!=null)return!1
a[b]=this.c0(b)
return!0},
c0(a){var s=this,r=new A.ib(A.r(s).c.a(a))
if(s.e==null)s.e=s.f=r
else s.f=s.f.b=r;++s.a
s.r=s.r+1&1073741823
return r},
cY(a){return J.bb(a)&1073741823},
d2(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.k(a[r].a,b))return r
return-1}}
A.ib.prototype={}
A.cT.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
m(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.e(A.a7(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.i("1?").a(r.a)
s.c=r.b
return!0}},
$iI:1}
A.y.prototype={
gt(a){return new A.a0(a,this.gj(a),A.a6(a).i("a0<y.E>"))},
P(a,b){return this.h(a,b)},
a3(a,b){var s,r
A.a6(a).i("~(y.E)").a(b)
s=this.gj(a)
for(r=0;r<s;++r){b.$1(this.h(a,r))
if(s!==this.gj(a))throw A.e(A.a7(a))}},
gA(a){return this.gj(a)===0},
gH(a){return!this.gA(a)},
gu(a){if(this.gj(a)===0)throw A.e(A.aG())
return this.h(a,0)},
gS(a){if(this.gj(a)===0)throw A.e(A.aG())
return this.h(a,this.gj(a)-1)},
v(a,b){var s,r=this.gj(a)
for(s=0;s<r;++s){if(J.k(this.h(a,s),b))return!0
if(r!==this.gj(a))throw A.e(A.a7(a))}return!1},
ae(a,b){var s,r
A.a6(a).i("B(y.E)").a(b)
s=this.gj(a)
for(r=0;r<s;++r){if(!b.$1(this.h(a,r)))return!1
if(s!==this.gj(a))throw A.e(A.a7(a))}return!0},
cD(a,b){var s=A.a6(a)
return new A.aK(a,s.i("B(y.E)").a(b),s.i("aK<y.E>"))},
cE(a,b){return new A.bH(a,b.i("bH<0>"))},
aP(a,b,c){var s=A.a6(a)
return new A.ao(a,s.G(c).i("1(y.E)").a(b),s.i("@<y.E>").G(c).i("ao<1,2>"))},
T(a,b){return A.aS(a,b,null,A.a6(a).i("y.E"))},
al(a,b){return A.aS(a,0,A.cf(b,"count",t.S),A.a6(a).i("y.E"))},
ed(a){var s,r=A.qq(A.a6(a).i("y.E"))
for(s=0;s<this.gj(a);++s)r.k(0,this.h(a,s))
return r},
k(a,b){var s
A.a6(a).i("y.E").a(b)
s=this.gj(a)
this.sj(a,s+1)
this.n(a,s,b)},
bx(a,b){return new A.bq(a,A.a6(a).i("@<y.E>").G(b).i("bq<1,2>"))},
I(a,b,c){var s,r=this.gj(a)
if(c==null)c=r
A.aB(b,c,r)
s=A.a1(this.bd(a,b,c),A.a6(a).i("y.E"))
return s},
a_(a,b){return this.I(a,b,null)},
bd(a,b,c){A.aB(b,c,this.gj(a))
return A.aS(a,b,c,A.a6(a).i("y.E"))},
bB(a,b,c,d){var s
A.a6(a).i("y.E?").a(d)
A.aB(b,c,this.gj(a))
for(s=b;s<c;++s)this.n(a,s,d)},
a8(a,b,c,d,e){var s,r,q,p,o
A.a6(a).i("f<y.E>").a(d)
A.aB(b,c,this.gj(a))
s=c-b
if(s===0)return
A.aa(e,"skipCount")
if(t.j.b(d)){r=e
q=d}else{q=J.d0(d,e).aR(0,!1)
r=0}p=J.n(q)
if(r+s>p.gj(q))throw A.e(A.qf())
if(r<b)for(o=s-1;o>=0;--o)this.n(a,b+o,p.h(q,r+o))
else for(o=0;o<s;++o)this.n(a,b+o,p.h(q,r+o))},
Z(a,b,c,d){return this.a8(a,b,c,d,0)},
aO(a,b,c){var s
if(c<0)c=0
for(s=c;s<this.gj(a);++s)if(J.k(this.h(a,s),b))return s
return-1},
bJ(a,b,c){var s,r
A.a6(a).i("f<y.E>").a(c)
if(t.j.b(c))this.Z(a,b,b+c.length,c)
else for(s=J.G(c);s.m();b=r){r=b+1
this.n(a,b,s.gp())}},
q(a){return A.oK(a,"[","]")},
$ix:1,
$if:1,
$ij:1}
A.P.prototype={
by(a,b,c){var s=A.r(this)
return A.qs(this,s.i("P.K"),s.i("P.V"),b,c)},
a3(a,b){var s,r,q,p=A.r(this)
p.i("~(P.K,P.V)").a(b)
for(s=this.ga4(),s=s.gt(s),p=p.i("P.V");s.m();){r=s.gp()
q=this.h(0,r)
b.$2(r,q==null?p.a(q):q)}},
gag(){return this.ga4().aP(0,new A.jG(this),A.r(this).i("a9<P.K,P.V>"))},
J(a){return this.ga4().v(0,a)},
gj(a){var s=this.ga4()
return s.gj(s)},
gA(a){var s=this.ga4()
return s.gA(s)},
gH(a){var s=this.ga4()
return s.gH(s)},
gaI(){return new A.eZ(this,A.r(this).i("eZ<P.K,P.V>"))},
q(a){return A.oS(this)},
$iS:1}
A.jG.prototype={
$1(a){var s=this.a,r=A.r(s)
r.i("P.K").a(a)
s=s.h(0,a)
if(s==null)s=r.i("P.V").a(s)
return new A.a9(a,s,r.i("a9<P.K,P.V>"))},
$S(){return A.r(this.a).i("a9<P.K,P.V>(P.K)")}}
A.jH.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.t(a)
r.a=(r.a+=s)+": "
s=A.t(b)
r.a+=s},
$S:33}
A.eZ.prototype={
gj(a){var s=this.a
return s.gj(s)},
gA(a){var s=this.a
return s.gA(s)},
gH(a){var s=this.a
return s.gH(s)},
gu(a){var s=this.a,r=s.ga4()
r=s.h(0,r.gu(r))
return r==null?this.$ti.y[1].a(r):r},
gt(a){var s=this.a,r=s.ga4()
return new A.f_(r.gt(r),s,this.$ti.i("f_<1,2>"))}}
A.f_.prototype={
m(){var s=this,r=s.a
if(r.m()){s.c=s.b.h(0,r.gp())
return!0}s.c=null
return!1},
gp(){var s=this.c
return s==null?this.$ti.y[1].a(s):s},
$iI:1}
A.bA.prototype={
gA(a){return this.gj(this)===0},
gH(a){return this.gj(this)!==0},
q(a){return A.oK(this,"{","}")},
al(a,b){return A.qN(this,b,A.r(this).c)},
T(a,b){return A.qG(this,b,A.r(this).c)},
gu(a){var s=this.gt(this)
if(!s.m())throw A.e(A.aG())
return s.gp()},
P(a,b){var s,r
A.aa(b,"index")
s=this.gt(this)
for(r=b;s.m();){if(r===0)return s.gp();--r}throw A.e(A.jv(b,b-r,this,"index"))},
$ix:1,
$if:1,
$ic5:1}
A.f5.prototype={}
A.i8.prototype={
h(a,b){var s,r=this.b
if(r==null)return this.c.h(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.fI(b):s}},
gj(a){return this.b==null?this.c.a:this.aZ().length},
gA(a){return this.gj(0)===0},
gH(a){return this.gj(0)>0},
ga4(){if(this.b==null){var s=this.c
return new A.an(s,A.r(s).i("an<1>"))}return new A.i9(this)},
gaI(){var s,r=this
if(r.b==null){s=r.c
return new A.b2(s,A.r(s).i("b2<2>"))}return A.oT(r.aZ(),new A.ly(r),t.N,t.z)},
J(a){if(this.b==null)return this.c.J(a)
if(typeof a!="string")return!1
return Object.prototype.hasOwnProperty.call(this.a,a)},
a3(a,b){var s,r,q,p,o=this
t.jR.a(b)
if(o.b==null)return o.c.a3(0,b)
s=o.aZ()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.m4(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.e(A.a7(o))}},
aZ(){var s=t.g.a(this.c)
if(s==null)s=this.c=A.b(Object.keys(this.a),t.s)
return s},
fI(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.m4(this.a[a])
return this.b[a]=s}}
A.ly.prototype={
$1(a){return this.a.h(0,A.U(a))},
$S:37}
A.i9.prototype={
gj(a){return this.a.gj(0)},
P(a,b){var s=this.a
if(s.b==null)s=s.ga4().P(0,b)
else{s=s.aZ()
if(!(b>=0&&b<s.length))return A.a(s,b)
s=s[b]}return s},
gt(a){var s=this.a
if(s.b==null){s=s.ga4()
s=s.gt(s)}else{s=s.aZ()
s=new J.aY(s,s.length,A.M(s).i("aY<1>"))}return s},
v(a,b){return this.a.J(b)}}
A.lO.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:true})
return s}catch(r){}return null},
$S:31}
A.lN.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:false})
return s}catch(r){}return null},
$S:31}
A.db.prototype={}
A.fG.prototype={}
A.fO.prototype={}
A.el.prototype={
q(a){var s=A.fP(this.a)
return(this.b!=null?"Converting object to an encodable object failed:":"Converting object did not return an encodable object:")+" "+s}}
A.h3.prototype={
q(a){return"Cyclic error in JSON stringify"}}
A.h2.prototype={
dT(a,b){var s=A.wU(a,this.ghu().a)
return s},
a0(a,b){var s=A.vE(a,this.ghy().b,null)
return s},
hx(a){return this.a0(a,null)},
ghy(){return B.aT},
ghu(){return B.aS}}
A.jA.prototype={}
A.jz.prototype={}
A.lA.prototype={
ef(a){var s,r,q,p,o,n,m=a.length
for(s=this.c,r=0,q=0;q<m;++q){p=a.charCodeAt(q)
if(p>92){if(p>=55296){o=p&64512
if(o===55296){n=q+1
n=!(n<m&&(a.charCodeAt(n)&64512)===56320)}else n=!1
if(!n)if(o===56320){o=q-1
o=!(o>=0&&(a.charCodeAt(o)&64512)===55296)}else o=!1
else o=!0
if(o){if(q>r)s.a+=B.d.a5(a,r,q)
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
s.a+=o}}continue}if(p<32){if(q>r)s.a+=B.d.a5(a,r,q)
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
break}}else if(p===34||p===92){if(q>r)s.a+=B.d.a5(a,r,q)
r=q+1
o=A.Q(92)
s.a+=o
o=A.Q(p)
s.a+=o}}if(r===0)s.a+=a
else if(r<m)s.a+=B.d.a5(a,r,m)},
bR(a){var s,r,q,p
for(s=this.a,r=s.length,q=0;q<r;++q){p=s[q]
if(a==null?p==null:a===p)throw A.e(new A.h3(a,null))}B.a.k(s,a)},
bH(a){var s,r,q,p,o=this
if(o.ee(a))return
o.bR(a)
try{s=o.b.$1(a)
if(!o.ee(s)){q=A.qm(a,null,o.gdg())
throw A.e(q)}q=o.a
if(0>=q.length)return A.a(q,-1)
q.pop()}catch(p){r=A.bn(p)
q=A.qm(a,r,o.gdg())
throw A.e(q)}},
ee(a){var s,r,q=this
if(typeof a=="number"){if(!isFinite(a))return!1
q.c.a+=B.c.q(a)
return!0}else if(a===!0){q.c.a+="true"
return!0}else if(a===!1){q.c.a+="false"
return!0}else if(a==null){q.c.a+="null"
return!0}else if(typeof a=="string"){s=q.c
s.a+='"'
q.ef(a)
s.a+='"'
return!0}else if(t.j.b(a)){q.bR(a)
q.iu(a)
s=q.a
if(0>=s.length)return A.a(s,-1)
s.pop()
return!0}else if(t.f.b(a)){q.bR(a)
r=q.iv(a)
s=q.a
if(0>=s.length)return A.a(s,-1)
s.pop()
return r}else return!1},
iu(a){var s,r,q=this.c
q.a+="["
s=J.n(a)
if(s.gH(a)){this.bH(s.h(a,0))
for(r=1;r<s.gj(a);++r){q.a+=","
this.bH(s.h(a,r))}}q.a+="]"},
iv(a){var s,r,q,p,o,n,m=this,l={}
if(a.gA(a)){m.c.a+="{}"
return!0}s=a.gj(a)*2
r=A.T(s,null,!1,t.O)
q=l.a=0
l.b=!0
a.a3(0,new A.lB(l,r))
if(!l.b)return!1
p=m.c
p.a+="{"
for(o='"';q<s;q+=2,o=',"'){p.a+=o
m.ef(A.U(r[q]))
p.a+='":'
n=q+1
if(!(n<s))return A.a(r,n)
m.bH(r[n])}p.a+="}"
return!0}}
A.lB.prototype={
$2(a,b){var s,r
if(typeof a!="string")this.a.b=!1
s=this.b
r=this.a
B.a.n(s,r.a++,a)
B.a.n(s,r.a++,b)},
$S:33}
A.lz.prototype={
gdg(){var s=this.c.a
return s.charCodeAt(0)==0?s:s}}
A.hM.prototype={
dS(a){t.L.a(a)
return B.dB.cg(a)}}
A.l7.prototype={
cg(a){var s,r,q,p=a.length,o=A.aB(0,null,p)
if(o===0)return new Uint8Array(0)
s=new Uint8Array(o*3)
r=new A.lP(s)
if(r.f7(a,0,o)!==o){q=o-1
if(!(q>=0&&q<p))return A.a(a,q)
r.c6()}return B.j.I(s,0,r.b)}}
A.lP.prototype={
c6(){var s,r=this,q=r.c,p=r.b,o=r.b=p+1
q.$flags&2&&A.w(q)
s=q.length
if(!(p<s))return A.a(q,p)
q[p]=239
p=r.b=o+1
if(!(o<s))return A.a(q,o)
q[o]=191
r.b=p+1
if(!(p<s))return A.a(q,p)
q[p]=189},
hg(a,b){var s,r,q,p,o,n=this
if((b&64512)===56320){s=65536+((a&1023)<<10)|b&1023
r=n.c
q=n.b
p=n.b=q+1
r.$flags&2&&A.w(r)
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
return!0}else{n.c6()
return!1}},
f7(a,b,c){var s,r,q,p,o,n,m,l,k=this
if(b!==c){s=c-1
if(!(s>=0&&s<a.length))return A.a(a,s)
s=(a.charCodeAt(s)&64512)===55296}else s=!1
if(s)--c
for(s=k.c,r=s.$flags|0,q=s.length,p=a.length,o=b;o<c;++o){if(!(o<p))return A.a(a,o)
n=a.charCodeAt(o)
if(n<=127){m=k.b
if(m>=q)break
k.b=m+1
r&2&&A.w(s)
s[m]=n}else{m=n&64512
if(m===55296){if(k.b+4>q)break
m=o+1
if(!(m<p))return A.a(a,m)
if(k.hg(n,a.charCodeAt(m)))o=m}else if(m===56320){if(k.b+3>q)break
k.c6()}else if(n<=2047){m=k.b
l=m+1
if(l>=q)break
k.b=l
r&2&&A.w(s)
if(!(m<q))return A.a(s,m)
s[m]=n>>>6|192
k.b=l+1
s[l]=n&63|128}else{m=k.b
if(m+2>=q)break
l=k.b=m+1
r&2&&A.w(s)
if(!(m<q))return A.a(s,m)
s[m]=n>>>12|224
m=k.b=l+1
if(!(l<q))return A.a(s,l)
s[l]=n>>>6&63|128
k.b=m+1
if(!(m<q))return A.a(s,m)
s[m]=n&63|128}}}return o}}
A.l6.prototype={
cg(a){return new A.im(this.a).cZ(t.L.a(a),0,null,!0)}}
A.im.prototype={
cZ(a,b,c,d){var s,r,q,p,o,n,m,l=this
t.L.a(a)
s=A.aB(b,c,a.length)
if(b===s)return""
if(a instanceof Uint8Array){r=a
q=r
p=0}else{q=A.w0(a,b,s)
s-=b
p=b
b=0}if(s-b>=15){o=l.a
n=A.w_(o,q,b,s)
if(n!=null){if(!o)return n
if(n.indexOf("\ufffd")<0)return n}}n=l.bT(q,b,s,!0)
o=l.b
if((o&1)!==0){m=A.w1(o)
l.b=0
throw A.e(A.j8(m,a,p+l.c))}return n},
bT(a,b,c,d){var s,r,q=this
if(c-b>1000){s=B.b.N(b+c,2)
r=q.bT(a,b,s,!1)
if((q.b&1)!==0)return r
return r+q.bT(a,s,c,d)}return q.ht(a,b,c,d)},
ht(a,b,a0,a1){var s,r,q,p,o,n,m,l,k=this,j="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFFFFFFFFFFFFFFFFGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHIHHHJEEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBKCCCCCCCCCCCCDCLONNNMEEEEEEEEEEE",i=" \x000:XECCCCCN:lDb \x000:XECCCCCNvlDb \x000:XECCCCCN:lDb AAAAA\x00\x00\x00\x00\x00AAAAA00000AAAAA:::::AAAAAGG000AAAAA00KKKAAAAAG::::AAAAA:IIIIAAAAA000\x800AAAAA\x00\x00\x00\x00 AAAAA",h=65533,g=k.b,f=k.c,e=new A.b6(""),d=b+1,c=a.length
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
e.a+=p}else{p=A.dy(a,d,n)
e.a+=p}if(n===a0)break A
d=o}else d=o}if(a1&&g>32)if(r){c=A.Q(h)
e.a+=c}else{k.b=77
k.c=a0
return""}k.b=g
k.c=f
c=e.a
return c.charCodeAt(0)==0?c:c}}
A.be.prototype={
C(a,b){if(b==null)return!1
return b instanceof A.be&&this.a===b.a},
gR(a){return B.b.gR(this.a)},
a6(a,b){return B.b.a6(this.a,t.jS.a(b).a)},
q(a){var s,r,q,p=this.a,o=p%36e8,n=B.b.N(o,6e7)
o%=6e7
s=n<10?"0":""
r=B.b.N(o,1e6)
q=r<10?"0":""
return""+(p/36e8|0)+":"+s+n+":"+q+r+"."+B.d.e2(B.b.q(o%1e6),6,"0")},
$ib_:1}
A.hX.prototype={
q(a){return this.an()},
$ibt:1}
A.W.prototype={
gaU(){return A.uT(this)}}
A.fr.prototype={
q(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.fP(s)
return"Assertion failed"}}
A.bE.prototype={}
A.aX.prototype={
gbW(){return"Invalid argument"+(!this.a?"(s)":"")},
gbV(){return""},
q(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+A.t(p),n=s.gbW()+q+o
if(!s.a)return n
return n+s.gbV()+": "+A.fP(s.gcq())},
gcq(){return this.b}}
A.eB.prototype={
gcq(){return A.io(this.b)},
gbW(){return"RangeError"},
gbV(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.t(q):""
else if(q==null)s=": Not greater than or equal to "+A.t(r)
else if(q>r)s=": Not in inclusive range "+A.t(r)+".."+A.t(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.t(r)
return s}}
A.fX.prototype={
gcq(){return A.E(this.b)},
gbW(){return"RangeError"},
gbV(){if(A.E(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
gj(a){return this.f}}
A.eQ.prototype={
q(a){return"Unsupported operation: "+this.a}}
A.hK.prototype={
q(a){return"UnimplementedError: "+this.a}}
A.c6.prototype={
q(a){return"Bad state: "+this.a}}
A.fC.prototype={
q(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.fP(s)+"."}}
A.he.prototype={
q(a){return"Out of Memory"},
gaU(){return null},
$iW:1}
A.eJ.prototype={
q(a){return"Stack Overflow"},
gaU(){return null},
$iW:1}
A.lg.prototype={
q(a){return"Exception: "+this.a}}
A.ee.prototype={
q(a){var s,r,q,p,o,n,m,l,k,j,i,h=this.a,g=""!==h?"FormatException: "+h:"FormatException",f=this.c,e=this.b
if(typeof e=="string"){if(f!=null)s=f<0||f>e.length
else s=!1
if(s)f=null
if(f==null){if(e.length>78)e=B.d.a5(e,0,75)+"..."
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
k=""}return g+l+B.d.a5(e,i,j)+k+"\n"+B.d.aJ(" ",f-i+l.length)+"^\n"}else return f!=null?g+(" (at offset "+A.t(f)+")"):g}}
A.f.prototype={
bx(a,b){return A.d6(this,A.r(this).i("f.E"),b)},
aP(a,b,c){var s=A.r(this)
return A.oT(this,s.G(c).i("1(f.E)").a(b),s.i("f.E"),c)},
cD(a,b){var s=A.r(this)
return new A.aK(this,s.i("B(f.E)").a(b),s.i("aK<f.E>"))},
cE(a,b){return new A.bH(this,b.i("bH<0>"))},
v(a,b){var s
for(s=this.gt(this);s.m();)if(J.k(s.gp(),b))return!0
return!1},
a3(a,b){var s
A.r(this).i("~(f.E)").a(b)
for(s=this.gt(this);s.m();)b.$1(s.gp())},
ae(a,b){var s
A.r(this).i("B(f.E)").a(b)
for(s=this.gt(this);s.m();)if(!b.$1(s.gp()))return!1
return!0},
ac(a,b){var s,r,q=this.gt(this)
if(!q.m())return""
s=J.bc(q.gp())
if(!q.m())return s
if(b.length===0){r=s
do r+=J.bc(q.gp())
while(q.m())}else{r=s
do r=r+b+J.bc(q.gp())
while(q.m())}return r.charCodeAt(0)==0?r:r},
aF(a,b){var s
A.r(this).i("B(f.E)").a(b)
for(s=this.gt(this);s.m();)if(b.$1(s.gp()))return!0
return!1},
aR(a,b){var s=A.r(this).i("f.E")
if(b)s=A.a1(this,s)
else{s=A.a1(this,s)
s.$flags=1
s=s}return s},
ec(a){return this.aR(0,!0)},
gj(a){var s,r=this.gt(this)
for(s=0;r.m();)++s
return s},
gA(a){return!this.gt(this).m()},
gH(a){return!this.gA(this)},
al(a,b){return A.qN(this,b,A.r(this).i("f.E"))},
T(a,b){return A.qG(this,b,A.r(this).i("f.E"))},
gu(a){var s=this.gt(this)
if(!s.m())throw A.e(A.aG())
return s.gp()},
P(a,b){var s,r
A.aa(b,"index")
s=this.gt(this)
for(r=b;s.m();){if(r===0)return s.gp();--r}throw A.e(A.jv(b,b-r,this,"index"))},
q(a){return A.up(this,"(",")")}}
A.a9.prototype={
q(a){return"MapEntry("+A.t(this.a)+": "+A.t(this.b)+")"}}
A.ad.prototype={
gR(a){return A.m.prototype.gR.call(this,0)},
q(a){return"null"}}
A.m.prototype={$im:1,
C(a,b){return this===b},
gR(a){return A.dv(this)},
q(a){return"Instance of '"+A.hl(this)+"'"},
gV(a){return A.xw(this)},
toString(){return this.q(this)}}
A.ij.prototype={
q(a){return""},
$ib5:1}
A.ar.prototype={
gt(a){return new A.dw(this.a)}}
A.dw.prototype={
gp(){return this.d},
m(){var s,r,q,p=this,o=p.b=p.c,n=p.a,m=n.length
if(o===m){p.d=-1
return!1}if(!(o<m))return A.a(n,o)
s=n.charCodeAt(o)
r=o+1
if((s&64512)===55296&&r<m){if(!(r<m))return A.a(n,r)
q=n.charCodeAt(r)
if((q&64512)===56320){p.c=r+1
p.d=A.wg(s,q)
return!0}}p.c=r
p.d=s
return!0},
$iI:1}
A.b6.prototype={
gj(a){return this.a.length},
q(a){var s=this.a
return s.charCodeAt(0)==0?s:s},
$ivb:1}
A.nH.prototype={
$0(){var s=v.G.performance
if(t.m.b(s))if(s.measure!=null&&s.mark!=null&&s.clearMeasures!=null&&s.clearMarks!=null)return s
return null},
$S:53}
A.mi.prototype={
$0(){var s=v.G.JSON
if(t.m.b(s))return s
throw A.e(A.as("Missing JSON.parse() support"))},
$S:64}
A.jM.prototype={
q(a){return"Promise was rejected with a value of `"+(this.a?"undefined":"null")+"`."}}
A.ok.prototype={
$1(a){return this.a.ce(this.b.i("0/?").a(a))},
$S:20}
A.ol.prototype={
$1(a){if(a==null)return this.a.dQ(new A.jM(a===undefined))
return this.a.dQ(a)},
$S:20}
A.c9.prototype={
an(){return"TextAlign."+this.b}}
A.iZ.prototype={
$2(a,b){var s=t.dt
s=s.a(a).b-s.a(b).b
if(s>0)return 1
else if(s<0)return-1
return 0},
$S:68}
A.bL.prototype={}
A.c3.prototype={
ghK(){var s,r,q,p,o,n,m,l,k,j,i=this.c
if(i==null){i=this.a.b8(1751474532)
s=i.b
if(!i.X(s,54))A.p(B.a2)
r=s+12
i.l(r,4)
q=i.a
p=q.getUint32(r,!1)
if(p!==1594834165)A.p(A.i("head.magicNumber is 0x"+B.b.ba(p,16)+", not 0x5F0F3CF5"))
r=s+18
i.l(r,2)
o=q.getUint16(r,!1)
if(o<16||o>16384)A.p(A.i("head.unitsPerEm "+o+" is outside the legal 16\u202616384"))
r=s+50
i.l(r,2)
n=q.getInt16(r,!1)
if(n!==0&&n!==1)A.p(A.i("head.indexToLocFormat "+n+" is neither short nor long"))
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
A.jq(i,s+20)
A.jq(i,s+28)
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
k=this.c=new A.fU(o,r,m,l,k,n)
i=k}return i},
gdO(){var s=this.e
return s==null?this.e=A.e4(this.a.b8(1668112752)):s},
dB(a,b){var s=this.a.b8(a),r=s.b+b
s.l(r,2)
return s.a.getUint16(r,!1)},
ghM(){var s,r=this
if(r.ay)return r.ax
r.ay=!0
s=r.a.bG(1213612370)
if(s==null)return null
return r.ax=A.uo(s)},
gcI(){var s=this.CW
return s==null?this.CW=this.bm(1196643650,A.xA(),t.b0):s},
gcH(){var s=this.cx
return s==null?this.cx=this.bm(1196445523,A.xz(),t.fA):s},
c9(a){var s,r,q,p,o,n=this,m=n.f
if(m==null){m=n.a.b8(1752003704)
s=n.dB(1751672161,34)
r=n.d
m=n.f=A.uk(m,r==null?n.d=n.dB(1835104368,4):r,s)}q=m.c9(a)
p=n.b
if(p==null)return q
o=n.ghM()
if(o==null)return q
return q+B.c.Y(o.hv(a,p))},
i4(a){var s,r=this
t.eM.a(a)
s=r.Q
if(s==null)s=r.Q=r.bm(1719034226,A.xs(),t.kH)
if(s==null)return B.cv
return s.i3(a,r.a.bG(1635148146))},
bm(a,b,c){var s
c.i("0(o)").a(b)
s=this.a.bG(a)
return s==null?null:b.$1(s)}}
A.hB.prototype={
q(a){return A.aD(this.a)+"@"+this.c+"+"+this.d},
gj(a){return this.d}}
A.kc.prototype={
bG(a){var s=this.c.h(0,a)
return s==null?null:new A.o(this.a.a,s.c)},
b8(a){var s=this.bG(a)
if(s==null)throw A.e(A.i("font has no "+A.aD(A.cH(a))+" table"))
return s}}
A.iS.prototype={
gdW(){var s=this.d
return s.a===3&&s.b===0},
af(a){var s,r
if(a<0)return 0
s=this.a
r=s.af(a)
if(r!==0||!this.gdW())return r
if(a<=255)return s.af(61440+a)
return 0},
q(a){var s=this.d,r=this.gdW()?", symbolic":""
return"CmapTable(platform "+s.a+", encoding "+s.b+", format "+s.d+r+")"}}
A.iT.prototype={
$2(a,b){var s=t.aq
s.a(a)
s.a(b)
return B.b.a6(a.gdm(),b.gdm())},
$S:78}
A.br.prototype={
gdm(){var s,r,q,p,o,n,m,l,k,j,i,h=null,g=this.a,f=this.b
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
A.i_.prototype={
af(a){var s
if(a>=0&&a<256){s=this.a
if(!(a>=0&&a<s.length))return A.a(s,a)
s=s[a]}else s=0
return s},
$idG:1}
A.i1.prototype={
af(a){var s,r,q,p,o,n,m,l,k,j,i=this
if(a<0||a>65535)return 0
s=i.a
r=s.length
q=r-1
for(p=0,o=-1;p<=q;){n=B.b.M(p+q,1)
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
$idG:1}
A.i2.prototype={
af(a){var s,r=a-this.a
if(r>=0&&r<this.b.length){s=this.b
if(!(r>=0&&r<s.length))return A.a(s,r)
s=s[r]}else s=0
return s},
$idG:1}
A.i0.prototype={
af(a){var s,r,q,p,o,n=this,m=n.a,l=m.length,k=l-1
for(s=n.b,r=s.length,q=0;q<=k;){p=B.b.M(q+k,1)
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
$idG:1}
A.lh.prototype={}
A.fU.prototype={
q(a){var s=this,r=s.ay===0?"short":"long"
return"HeadTable(unitsPerEm: "+s.f+", loca: "+r+", bbox: "+s.x+" "+s.y+" "+s.z+" "+s.Q+")"}}
A.js.prototype={
c9(a){var s,r,q
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
A.e_.prototype={
q(a){return A.t(this.a)+"\u2192"+A.t(this.b)}}
A.iy.prototype={
hZ(a,b,c){var s,r,q,p,o,n=this.b,m=n.length
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
return m+(c-n)/o*(q.b-m)}return B.a.gS(s).b}}
A.dB.prototype={
q(a){var s=this
return"VariationAxis("+A.aD(s.a)+" "+A.t(s.b)+"/"+A.t(s.c)+"/"+A.t(s.d)+")"}}
A.ds.prototype={
q(a){return"NamedInstance("+A.t(this.a)+")"}}
A.dh.prototype={
i3(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g
t.eM.a(a)
s=this.a
r=s.length
q=A.T(r,0,!1,t.i)
for(p=0;p<r;++p){o=s[p]
n=a.h(0,A.aD(o.a))
if(n==null)n=o.c
m=o.b
l=o.d
k=B.c.E(n,m,l)
n=o.c
if(k<n){j=n-m
i=j>0?(k-n)/j:0}else if(k>n){j=l-n
i=j>0?(k-n)/j:0}else i=0
h=B.c.a2(i*16384)/16384
if(h<-1)n=-1
else n=h>1?1:h
B.a.n(q,p,n)}if(b!=null){g=A.tq(b)
for(p=0;p<r;++p){h=B.c.a2(g.hZ(0,p,q[p])*16384)/16384
if(h<-1)s=-1
else s=h>1?1:h
B.a.n(q,p,s)}}return q}}
A.jb.prototype={
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
return new A.dB(r,q/65536,p/65536,o/65536)},
$S:62}
A.jc.prototype={
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
o=J.aR(p,t.i)
for(q=j+4,n=0;n<p;++n){m=q+n*4
if(m>=0)l=m+4<=r.byteLength
else l=!1
if(!l)A.p(A.i("read of 4 byte(s) at "+m+" overruns a "+s.gj(0)+"-byte font"))
o[n]=r.getInt32(m,!1)/65536}return new A.ds(o)},
$S:122}
A.ie.prototype={
eh(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
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
A.i7.prototype={}
A.iY.prototype={
gj(a){return this.c},
h(a,b){var s,r,q,p,o,n,m,l,k,j=this
A.E(b)
s=j.c
if(s===0)return new A.z(0,b)
if(b>=s)r=s-1
else r=b<0?0:b
s=j.d
q=j.b+r*s
for(p=j.a,o=p.a,n=0,m=0;m<s;++m){l=q+m
if(l>=0)k=l+1<=o.byteLength
else k=!1
if(!k)A.p(A.i("read of 1 byte(s) at "+l+" overruns a "+p.gj(0)+"-byte font"))
n=(n<<8|o.getUint8(l))>>>0}s=j.e
return new A.z(B.b.bq(n,s),(n&B.b.ai(1,s)-1)>>>0)}}
A.fZ.prototype={
ci(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e="read of 2 byte(s) at "
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
if(!h)A.p(A.i("read of 4 byte(s) at "+p+" overruns a "+n.gj(0)+"-byte font"))
g=k.getInt32(p,!1)
p+=4}else{if(p>=0)h=p+2<=k.byteLength
else h=!1
if(!h)A.p(A.i(e+p+" overruns a "+n.gj(0)+"-byte font"))
g=k.getInt16(p,!1)
p+=2}else if(m){if(p>=0)h=p+2<=k.byteLength
else h=!1
if(!h)A.p(A.i(e+p+" overruns a "+n.gj(0)+"-byte font"))
g=k.getInt16(p,!1)
p+=2}else{if(p>=0)h=p+1<=k.byteLength
else h=!1
if(!h)A.p(A.i("read of 1 byte(s) at "+p+" overruns a "+n.gj(0)+"-byte font"))
g=k.getInt8(p);++p}if(g===0)continue
h=s[i]
if(!(h<o.length))return A.a(o,h)
f=o[h].eh(c)
if(f!==0)j+=g*f}return j},
hv(a,b){var s,r
t.H.a(b)
s=this.d
if(s==null)return this.ci(0,a,b)
r=s.h(0,a)
return this.ci(r.a,r.b,b)}}
A.jw.prototype={
$1(a){var s,r=this.a,q=this.b+6+a*2
r.l(q,2)
s=r.a.getUint16(q,!1)
if(s>=this.c.length)throw A.e(A.i("region index "+s+" out of range"))
return s},
$S:14}
A.bP.prototype={}
A.hR.prototype={
O(a){return 0}}
A.hS.prototype={
O(a){var s,r=a-this.a
if(r>=0&&r<this.b.length){s=this.b
if(!(r>=0&&r<s.length))return A.a(s,r)
s=s[r]}else s=0
return s}}
A.hT.prototype={
O(a){var s,r,q,p,o=this.a,n=o.length,m=(n/3|0)-1
for(s=0;s<=m;){r=B.b.M(s+m,1)
q=r*3
if(!(q<n))return A.a(o,q)
if(a<o[q])m=r-1
else{p=q+1
if(!(p<n))return A.a(o,p)
if(a>o[p])s=r+1
else{p=q+2
if(!(p<n))return A.a(o,p)
return o[p]}}}return 0}}
A.fJ.prototype={
ir(a){var s,r,q,p,o,n,m,l,k=this,j=k.c
if(j===32768)return 0
s=k.a
if(a<s||a>k.b)return 0
r=B.b.ai(1,j)
q=B.b.a9(16,r)
p=a-s
o=B.b.a9(p,q)
j=k.d
s=j.length
if(o>=s)return 0
n=B.b.W(p,q)
m=B.b.ai(1,r)
if(!(o>=0))return A.a(j,o)
l=B.b.br(j[o],16-r*(n+1))&m-1
return l>=B.b.ab(1,r-1)?l-m:l},
q(a){var s=this.c,r=""+this.a,q=""+this.b
return s===32768?"VariationIndex("+r+"/"+q+")":"Device("+r+"\u2026"+q+", fmt "+s+")"}}
A.d1.prototype={
q(a){return"Anchor("+this.a+","+this.b+")"}}
A.bs.prototype={}
A.hV.prototype={
F(a){var s,r,q,p=this.a,o=p.length,n=o-1
for(s=0;s<=n;){r=B.b.M(s+n,1)
if(!(r<o))return A.a(p,r)
q=p[r]
if(a<q)n=r-1
else if(a>q)s=r+1
else return r}return-1}}
A.hW.prototype={
F(a){var s,r,q,p,o,n=this.a,m=n.length,l=(m/3|0)-1
for(s=0;s<=l;){r=B.b.M(s+l,1)
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
A.di.prototype={
hS(a,b){var s,r,q,p,o,n=this.r
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
r=A.V(new A.o(s,q+o))
B.a.n(n,a,r)}return r.F(b)>=0},
gis(){var s,r=this
if(r.z)return r.y
r.z=!0
s=r.f
if(s===0)return null
return r.y=A.qe(new A.o(r.a.a,s))},
q(a){return"GdefTable(1."+this.w+")"}}
A.cr.prototype={
dZ(a){var s=this.b,r=this.a.w
if(!(a>=0&&a<r.length))return A.a(r,a)
r=r[a]+2
s.l(r,2)
return s.a.getUint16(r,!1)},
e_(a){var s,r,q,p=this.a.w
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
cM(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this.c
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
if(!i)A.p(A.i("read of 2 byte(s) at "+j+" overruns a "+r.gj(0)+"-byte font"))
h=A.rK(o,new A.o(p,q+p.getUint16(j,!1)),9)
B.a.k(l,A.ub(h.a,h.b))}B.a.n(g,a,l)
return l},
hm(a,b,c,d,e){var s,r,q,p,o,n,m,l=this
t.nE.a(c)
if(a<0||a>=l.a.w.length)return!1
s=l.cM(a)
if(s.length===0||b.a.length===0)return!1
r=new A.jn(b,l,e,d,c,0,0)
q=l.dZ(a)
p=l.e_(a)
r.x=q
r.y=p
for(q=b.a,o=!1,p=0;n=q.length,p<n;){if(!(p>=0))return A.a(q,p)
m=q[p]
if((m.y&e)>>>0!==0){n=r.Q
n=!(n==null?r.Q=new A.aJ(b,r.x,r.y,d):n).aK(m)}else n=!1
if(!(n&&A.q8(s,r)))p=++r.w
else{n=r.w
if(n<=p){++p
r.w=p}else p=n
o=!0}}return o},
hn(a,b){var s=this.a.w.length
if(a>=s)return!1
return A.q8(this.cM(a),b)},
q(a){return"GposTable("+this.a.q(0)+")"},
$iua:1}
A.h5.prototype={}
A.jn.prototype={
gt(a){var s=this,r=s.Q
return r==null?s.Q=new A.aJ(s.a,s.x,s.y,s.d):r},
ia(a){var s,r,q,p,o,n=this,m=n.z
if(m===0)return!1
s=n.x
r=n.y
n.z=m-1
m=n.b
q=m.dZ(a)
p=m.e_(a)
n.x=q
n.y=p
n.Q=null
o=m.hn(a,n)
n.x=s
n.y=r
n.Q=null;++n.z
return o},
da(a,b,c,d){t.mA.a(c)
if(b&&(a.y&this.c)>>>0===0)return 1
if(c==null)return 2
return c.$2(a,d)?0:1},
cs(a,b,c,d,e){var s,r,q,p,o,n
t.mA.a(d)
for(s=this.a.a,r=b;;){r=a.cr(r)
if(r<0)return-1
if(!(r<s.length))return A.a(s,r)
q=s[r]
p=this.da(q,e,d,c)
o=q.e===5
if(p!==0)n=p===2&&!o
else n=!0
if(n)return r
if(!o)return-1}},
e1(a,b){return this.cs(a,b,0,null,!0)},
i1(a,b,c,d){return this.cs(a,b,c,d,!0)},
e5(a,b,c,d,e){var s,r,q,p,o,n
t.mA.a(d)
for(s=this.a.a,r=b;;){r=a.e4(r)
if(r<0)return-1
if(!(r<s.length))return A.a(s,r)
q=s[r]
p=this.da(q,e,d,c)
o=q.e===5
if(p!==0)n=p===2&&!o
else n=!0
if(n)return r
if(!o)return-1}},
ct(a,b){return this.e5(a,b,0,null,!0)},
b5(a,b){var s,r,q,p,o=this
if(a.c===32768){s=o.d
r=s==null?null:s.gis()
q=o.e
if(r==null||q==null||q.length===0)return 0
return B.c.Y(r.ci(a.a,a.b,q))}p=b?o.r:o.f
return p===0?0:a.ir(p)},
bw(a){var s,r=a.a,q=a.b,p=a.d
if(p!=null)r+=this.b5(p,!1)
s=a.e
return new A.z(r,s!=null?q+this.b5(s,!0):q)}}
A.aF.prototype={}
A.nT.prototype={
$0(){var s,r=this.b,q=this.a,p=q.a
r.l(p,2)
s=r.a.getInt16(p,!1)
q.a+=2
return s},
$S:8}
A.nS.prototype={
$0(){var s,r=this.b,q=this.a,p=q.a
r.l(p,2)
s=r.a.getUint16(p,!1)
q.a+=2
return s},
$S:8}
A.eG.prototype={
U(a){var s,r,q,p=this,o=a.a,n=o.a,m=a.w
if(!(m>=0&&m<n.length))return A.a(n,m)
s=p.c.F(n[m].a)
if(s<0)return!1
if(p.e){n=p.b
r=n+6}else{n=p.a
m=p.b
q=m+6
n.l(q,2)
if(s>=n.a.getUint16(q,!1))return!1
r=m+8+s*A.p0(p.d)
n=m}o=o.b
m=a.w
if(!(m>=0&&m<o.length))return A.a(o,m)
A.pk(a,p.a,n,r,p.d,o[m]);++a.w
return!0}}
A.ez.prototype={
U(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=a.w,d=f.c,c=a.a,b=c.a
if(!(e>=0&&e<b.length))return A.a(b,e)
if(d.F(b[e].a)<0)return!1
s=a.e1(a.gt(0),e)
if(s<0)return!1
r=f.d
q=A.p0(r)
p=f.e
o=A.p0(p)
n=b.length
if(f.f===1){if(!(e<n))return A.a(b,e)
n=f.b
m=f.a
d=n+10+d.F(b[e].a)*2
m.l(d,2)
l=n+m.a.getUint16(d,!1)
if(!(s<b.length))return A.a(b,s)
k=f.f9(l,b[s].a,q+o)
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
A.pk(a,d,i,j,r,c[e])
if(!(s<c.length))return A.a(c,s)
A.pk(a,d,i,j+q,p,c[s])
a.w=o!==0?s+1:s
return!0},
f9(a,b,c){var s,r,q,p,o,n,m,l,k,j=this.a
j.l(a,2)
s=j.a
r=2+c
q=s.getUint16(a,!1)-1
for(p=a+2,o=0;o<=q;){n=B.b.M(o+q,1)
m=p+n*r
if(m>=0)l=m+2<=s.byteLength
else l=!1
if(!l)A.p(A.i("read of 2 byte(s) at "+m+" overruns a "+j.gj(0)+"-byte font"))
k=s.getUint16(m,!1)
if(b<k)q=n-1
else if(b>k)o=n+1
else return m}return-1}}
A.fH.prototype={
U(a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a4.w,a1=this.c,a2=a4.a,a3=a2.a
if(!(a0>=0&&a0<a3.length))return A.a(a3,a0)
s=a1.F(a3[a0].a)
if(s<0)return!1
r=this.a
q=this.b
p=q+6
o=p+s*4+2
r.l(o,2)
n=r.a
m=n.getUint16(o,!1)
if(m===0)return!1
l=a4.e1(a4.gt(0),a0)
if(l<0)return!1
if(!(l<a3.length))return A.a(a3,l)
k=a1.F(a3[l].a)
if(k<0)return!1
a1=p+k*4
r.l(a1,2)
j=n.getUint16(a1,!1)
if(j===0)return!1
i=a4.bw(A.iw(new A.o(n,q+m)))
h=i.a
g=a4.bw(A.iw(new A.o(n,q+j)))
f=g.a
e=a2.b
a1=a2.c
a2=e.length
if(a1===B.k){if(!(a0<a2))return A.a(e,a0)
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
a=a0}A.q_(e,a,b)
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
A.f0.prototype={
O(a){var s=this.a,r=this.b+2+a*4
s.l(r,2)
return s.a.getUint16(r,!1)}}
A.eT.prototype={
cc(a,b,c){var s,r,q,p=this,o=!0
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
return q===0?null:A.iw(new A.o(o,s+q))}}
A.h6.prototype={
U(a){var s,r,q,p,o,n=this,m=a.a,l=m.a,k=a.w
if(!(k>=0&&k<l.length))return A.a(l,k)
s=n.a.F(l[k].a)
if(s<0)return!1
r=new A.aJ(m,8,a.y,a.d)
q=a.w
for(;;){p=a.ct(r,q)
if(p<0)return!1
if(!(p<l.length))return A.a(l,p)
q=p
break}if(!(q>=0&&q<l.length))return A.a(l,q)
o=n.b.F(l[q].a)
if(o<0)return!1
m=n.d
return A.p6(a,m,s,n.e.cc(o,m.O(s),n.c),q)}}
A.h7.prototype={
U(a){var s,r,q,p,o,n,m,l,k,j=this,i=a.a,h=i.a,g=a.w
if(!(g>=0&&g<h.length))return A.a(h,g)
s=j.b.F(h[g].a)
if(s<0)return!1
r=a.ct(new A.aJ(i,8,a.y,a.d),a.w)
if(r<0)return!1
if(!(r<h.length))return A.a(h,r)
q=j.c.F(h[r].a)
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
return A.p6(a,h,s,new A.eT(i,o).cc(k,h.O(s),j.d),r)}}
A.h8.prototype={
U(a){var s,r,q,p,o=this,n=a.a,m=n.a,l=a.w
if(!(l>=0&&l<m.length))return A.a(m,l)
s=o.a.F(m[l].a)
if(s<0)return!1
r=a.ct(new A.aJ(n,a.x&4294967281,a.y,a.d),a.w)
if(r<0)return!1
n=m.length
if(!(r<n))return A.a(m,r)
q=m[r]
if(q.f!==3)return!1
l=a.w
if(!(l>=0&&l<n))return A.a(m,l)
if(!A.uy(m[l],q))return!1
p=o.b.F(q.a)
if(p<0)return!1
n=o.d
return A.p6(a,n,s,o.e.cc(p,n.O(s),o.c),r)}}
A.de.prototype={
U(a){var s,r,q,p=this,o=a.a.a,n=a.w
if(!(n>=0&&n<o.length))return A.a(o,n)
s=o[n].a
switch(p.c){case 1:r=p.d.F(s)
if(r<0)return!1
return p.cS(a,r,A.o5(),!1)
case 2:if(p.d.F(s)<0)return!1
o=p.e
q=o.O(s)
return p.cS(a,q,new A.iU(o),!0)
default:return p.bO(a)}},
cS(a,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b="read of 2 byte(s) at "
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
if(!j)A.p(A.i(b+q+" overruns a "+s.gj(0)+"-byte font"))
i=p.getUint16(q,!1)
if(i===0)continue
h=m+i
if(h>=0)q=h+2<=p.byteLength
else q=!1
if(!q)A.p(A.i(b+h+" overruns a "+s.gj(0)+"-byte font"))
g=p.getUint16(h,!1)
q=h+2
if(q>=0)j=q+2<=p.byteLength
else j=!1
if(!j)A.p(A.i(b+q+" overruns a "+s.gj(0)+"-byte font"))
f=p.getUint16(q,!1)
e=h+4
d=A.mv(a,g,e,s,a1)
if(d==null)continue
c=A.nI(s,e+(g===0?0:g-1)*2,f)
A.lR(a,d,c,d.length===0?a.w+1:B.a.gS(d)+1)
return!0}return!1},
bO(a){var s,r,q,p,o,n,m=this.a,l=this.b,k=l+2
m.l(k,2)
s=m.a
r=s.getUint16(k,!1)
if(r===0)return!1
k=l+4
m.l(k,2)
q=s.getUint16(k,!1)
p=l+6
m.l(p,2)
o=A.V(new A.o(s,l+s.getUint16(p,!1)))
k=a.a.a
s=a.w
if(!(s>=0&&s<k.length))return A.a(k,s)
if(o.F(k[s].a)<0)return!1
n=A.mv(a,r,p+2,m,A.rg(m,l))
if(n==null)return!1
A.lR(a,n,A.nI(m,p+r*2,q),B.a.gS(n)+1)
return!0}}
A.iU.prototype={
$2(a,b){return this.a.O(a.a)===b},
$S:9}
A.m5.prototype={
$2(a,b){var s=this.a,r=s.h(0,b)
if(r==null){r=A.V(new A.o(this.b.a,this.c+b))
s.n(0,b,r)
s=r}else s=r
return s.F(a.a)>=0},
$S:9}
A.d7.prototype={
U(a){var s,r,q,p=this,o=a.a.a,n=a.w
if(!(n>=0&&n<o.length))return A.a(o,n)
s=o[n].a
switch(p.c){case 1:r=p.d.F(s)
if(r<0)return!1
return p.cT(a,r,4,A.o5(),A.o5(),A.o5())
case 2:if(p.d.F(s)<0)return!1
o=p.e
o.toString
n=p.f
n.toString
q=p.r
q.toString
return p.cT(a,n.O(s),10,new A.iC(o),new A.iD(n),new A.iE(q))
default:return p.bO(a)}},
cT(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j,i=t.dW
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
if(!k)A.p(A.i("read of 2 byte(s) at "+r+" overruns a "+i.gj(0)+"-byte font"))
j=q.getUint16(r,!1)
if(j===0)continue
if(this.eJ(a,n+j,d,e,f))return!0}return!1},
eJ(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h=t.dW
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
j=A.mv(a,o,n,h,d)
if(j==null)return!1
i=j.length===0?a.w+1:B.a.gS(j)+1
if(!A.ro(a,m,l,h,e,i))return!1
if(!A.rn(a,r,q,h,c))return!1
A.lR(a,j,A.nI(h,p+2,k),i)
return!0},
bO(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this.b,e=f+2,d=this.a
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
k=A.V(new A.o(s,f+s.getUint16(o,!1)))
s=a.a.a
j=a.w
if(!(j>=0&&j<s.length))return A.a(s,j)
if(k.F(s[j].a)<0)return!1
i=A.rg(d,f)
h=A.mv(a,p,o+2,d,i)
if(h==null)return!1
g=B.a.gS(h)+1
if(!A.ro(a,n,m,d,i,g))return!1
if(!A.rn(a,r,q,d,i))return!1
A.lR(a,h,A.nI(d,e+2,l),g)
return!0}}
A.iF.prototype={
$1(a){var s,r=this.a
r.l(a,2)
r=r.a
s=r.getUint16(a,!1)
return s===0?B.i:A.cl(new A.o(r,this.b+s))},
$S:27}
A.iC.prototype={
$2(a,b){return this.a.O(a.a)===b},
$S:9}
A.iD.prototype={
$2(a,b){return this.a.O(a.a)===b},
$S:9}
A.iE.prototype={
$2(a,b){return this.a.O(a.a)===b},
$S:9}
A.i4.prototype={}
A.cs.prototype={
hl(a,b,c,d){var s,r,q=this
if(b.a.length===0)return!1
s=q.d9(a)
if(s.d.length===0)return!1
r=new A.ef(b,d,c,0,q.gfL())
r.bK(s.b,s.c)
return s.a===8?q.eG(s,r):q.eH(s,r)},
eH(a,b){var s,r,q,p,o,n,m,l,k,j,i=b.a
b.f=0
for(s=i.a,r=b.b,q=b.c,p=a.d,o=!1,n=0;m=s.length,n<m;){if(!(n>=0))return A.a(s,n)
l=s[n]
if((l.y&r)>>>0!==0){m=b.y
m=!(m==null?b.y=new A.aJ(i,b.w,b.x,q):m).aK(l)}else m=!1
k=!1
if(m)for(m=p.length,j=0;j<p.length;p.length===m||(0,A.h)(p),++j)if(p[j].U(b)){k=!0
break}if(!k){++n
b.f=n
continue}m=b.f
if(m<=n){++n
b.f=n}else n=m
o=!0}return o},
eG(a,b){var s,r,q,p,o,n,m,l,k=b.a
for(s=k.a,r=b.f=s.length-1,q=a.d,p=b.b,o=b.c,n=!1;r>=0;r=--b.f){if(!(r<s.length))return A.a(s,r)
m=s[r]
if((m.y&p)>>>0===0)continue
r=b.y
if((r==null?b.y=new A.aJ(k,b.w,b.x,o):r).aK(m))continue
for(r=q.length,l=0;l<q.length;q.length===r||(0,A.h)(q),++l)if(q[l].U(b)){n=!0
break}}return n},
fM(a,b){var s,r,q,p,o,n,m
if(a.r>=64)return!1
if(b>=this.b.length)return!1
s=a.f
if(s<0||s>=a.a.a.length)return!1
r=this.d9(b)
q=a.w
p=a.x
a.bK(r.b,r.c);++a.r
s=r.d
n=s.length
m=0
for(;;){if(!(m<s.length)){o=!1
break}if(s[m].U(a)){o=!0
break}s.length===n||(0,A.h)(s);++m}--a.r
a.bK(q,p)
return o},
d9(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(a<0||a>=this.b.length)throw A.e(A.i("GSUB lookup index "+a+" out of range"))
s=this.b
if(!(a>=0&&a<s.length))return A.a(s,a)
r=s[a]
if(r!=null)return r
q=this.a
p=q.a.a
o=new A.o(p,q.b)
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
if(!f)A.p(A.i("read of 2 byte(s) at "+g+" overruns a "+o.gj(0)+"-byte font"))
B.a.k(i,A.xY(m,new A.o(p,n+p.getUint16(g,!1))))}q=new A.i4(i.length===0?m:B.a.gu(i).gL(),l,j,i)
B.a.n(s,a,q)
return q},
q(a){return"GsubTable("+this.b.length+" lookups, "+this.a.q(0)+")"}}
A.hp.prototype={
q(a){return"SequenceLookupRecord("+this.a+" \u2192 "+this.b+")"}}
A.ef.prototype={
bK(a,b){var s=this
if(a===s.w&&b===s.x)return
s.w=a
s.x=b
s.y=null},
gt(a){var s=this,r=s.y
return r==null?s.y=new A.aJ(s.a,s.w,s.x,s.c):r},
bM(a,b,c){var s,r,q=this.a.a
if(!(a>=0&&a<q.length))return A.a(q,a)
s=q[a]
s.a=b
r=this.c
if(r!=null&&r.b!==B.i){s.f=r.b.O(b)
s.r=r.c.O(b)}else if(c!==0)s.f=c},
bg(a,b){return this.bM(a,b,0)}}
A.aA.prototype={}
A.eH.prototype={
gL(){return 1},
h5(a){var s,r=this.a.F(a)
if(r<0)return null
s=this.c
if(s==null)return a+this.b&65535
return r<s.length?s[r]:null},
U(a){var s,r=a.a.a,q=a.f
if(!(q>=0&&q<r.length))return A.a(r,q)
s=this.h5(r[q].a)
if(s==null)return!1
a.bg(a.f,s);++a.f
return!0}}
A.ha.prototype={
gL(){return 2},
U(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=a.a,e=f.a,d=a.f
if(!(d>=0&&d<e.length))return A.a(e,d)
s=g.a.F(e[d].a)
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
r=new A.o(o,p+2).a1(o.getUint16(p,!1))
B.a.n(d,s,r)}d=r.length
if(d===1){f=a.f
if(0>=d)return A.a(r,0)
a.bg(f,r[0]);++a.f
return!0}if(d===0){B.a.aG(e,a.f)
B.a.aG(f.b,a.f)
return!0}n=a.f
if(!(n>=0&&n<e.length))return A.a(e,n)
m=e[n]
l=m.f===2?1:0
k=m.w
j=A.b([],t.R)
for(q=k===0,i=0;i<d;++i){h=new A.aC(m.a,m.b,m.c,m.d,m.e,m.f,m.r,m.w,m.x,m.y,!1)
if(q){h.w=0
h.x=i}B.a.k(j,h)}B.a.aG(e,n)
f=f.b
B.a.aG(f,n)
B.a.cp(e,n,j)
e=A.b([],t.q)
for(i=0;i<d;++i)e.push(new A.bY(0))
B.a.cp(f,n,e)
for(i=0;i<d;++i)a.bM(n+i,r[i],l)
a.f=n+d
return!0}}
A.fq.prototype={
gL(){return 3},
U(a){var s,r,q,p,o=this,n=a.a.a,m=a.f
if(!(m>=0&&m<n.length))return A.a(n,m)
s=o.a.F(n[m].a)
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
r=new A.o(p,q+2).a1(p.getUint16(q,!1))
B.a.n(n,s,r)}n=a.d
if(n>=r.length)return!1
a.bg(a.f,r[n]);++a.f
return!0}}
A.cR.prototype={}
A.h4.prototype={
gL(){return 4},
fm(a){var s,r,q,p,o=this,n=o.d
if(!(a>=0&&a<n.length))return A.a(n,a)
s=n[a]
if(s!=null)return s
r=o.c
if(!(a<r.length))return A.a(r,a)
q=r[a]
r=o.b
r.l(q,2)
p=A.eo(r.a.getUint16(q,!1),new A.jC(o,q),!1,t.nx)
B.a.n(n,a,p)
return p},
U(a){var s,r,q,p,o,n=a.a.a,m=a.f
if(!(m>=0&&m<n.length))return A.a(n,m)
s=this.a.F(n[m].a)
if(s<0||s>=this.c.length)return!1
for(n=this.fm(s),m=n.length,r=0;r<m;++r){q=n[r]
p=q.b
o=A.og(a,p.length+1,new A.jD(p))
if(o==null)continue
A.wL(a,o,q.a)
return!0}return!1}}
A.jC.prototype={
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
return new A.cR(o,new A.o(s,r+4).a1(p))},
$S:59}
A.jD.prototype={
$2(a,b){var s=this.a,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===b},
$S:3}
A.bI.prototype={}
A.dK.prototype={
gj(a){return this.b.length},
h(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g=this
A.E(b)
if(b<0||b>=g.b.length)return B.O
s=g.d
if(!(b>=0&&b<s.length))return A.a(s,b)
r=s[b]
if(r!=null)return r
q=g.b
if(!(b<q.length))return A.a(q,b)
p=q[b]
if(p===0){B.a.n(s,b,B.O)
return B.O}q=g.a
q.l(p,2)
o=q.a
n=o.getUint16(p,!1)
m=J.aR(n,t.kr)
for(l=g.c,k=p+2,j=0;j<n;++j){i=k+j*2
if(i>=0)h=i+2<=o.byteLength
else h=!1
if(!h)A.p(A.i("read of 2 byte(s) at "+i+" overruns a "+q.gj(0)+"-byte font"))
m[j]=l.$2(q,p+o.getUint16(i,!1))}B.a.n(s,b,m)
return m}}
A.mz.prototype={
$1(a){var s,r=this.a,q=this.b+a*2
r.l(q,2)
s=r.a.getUint16(q,!1)
return s===0?0:this.c+s},
$S:14}
A.fD.prototype={
gL(){return 5},
U(a){var s,r,q,p=a.a.a,o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
s=this.a.F(p[o].a)
if(s<0)return!1
for(p=this.b.h(0,s),o=p.length,r=0;r<o;++r){q=p[r]
if(A.mu(a,q,A.o6(),new A.iV(q),A.o6()))return!0}return!1}}
A.iV.prototype={
$2(a,b){var s=this.a.b,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===b},
$S:3}
A.fE.prototype={
gL(){return 5},
U(a){var s,r,q=this,p=a.a.a,o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
if(q.a.F(p[o].a)<0)return!1
o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
for(p=q.c.h(0,q.b.O(p[o].a)),o=p.length,s=0;s<o;++s){r=p[s]
if(A.mu(a,r,A.o6(),new A.iW(q,r),A.o6()))return!0}return!1}}
A.iW.prototype={
$2(a,b){var s=this.b.b,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===this.a.b.O(b)},
$S:3}
A.fF.prototype={
gL(){return 5},
U(a){var s,r,q,p=this.a,o=p.length
if(o===0)return!1
if(0>=o)return A.a(p,0)
p=p[0]
s=a.a.a
r=a.f
if(!(r>=0&&r<s.length))return A.a(s,r)
if(p.F(s[r].a)<0)return!1
q=A.og(a,o,new A.iX(this))
if(q==null)return!1
p=q.length
o=p-1
if(!(o>=0))return A.a(q,o)
A.pj(a,q,q[o]+1,this.b)
return!0}}
A.iX.prototype={
$2(a,b){var s=this.a.a
if(!(a<s.length))return A.a(s,a)
return s[a].F(b)>=0},
$S:3}
A.fv.prototype={
gL(){return 6},
U(a){var s,r,q,p=a.a.a,o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
s=this.a.F(p[o].a)
if(s<0)return!1
for(p=this.b.h(0,s),o=p.length,r=0;r<o;++r){q=p[r]
if(A.mu(a,q,new A.iG(q),new A.iH(q),new A.iI(q)))return!0}return!1}}
A.iH.prototype={
$2(a,b){var s=this.a.b,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===b},
$S:3}
A.iG.prototype={
$2(a,b){var s=this.a.a
if(!(a<s.length))return A.a(s,a)
return s[a]===b},
$S:3}
A.iI.prototype={
$2(a,b){var s=this.a.c
if(!(a<s.length))return A.a(s,a)
return s[a]===b},
$S:3}
A.fw.prototype={
gL(){return 6},
U(a){var s,r,q=this,p=a.a.a,o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
if(q.a.F(p[o].a)<0)return!1
o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
for(p=q.e.h(0,q.c.O(p[o].a)),o=p.length,s=0;s<o;++s){r=p[s]
if(A.mu(a,r,new A.iJ(q,r),new A.iK(q,r),new A.iL(q,r)))return!0}return!1}}
A.iM.prototype={
$1(a){var s,r=this.a
r.l(a,2)
r=r.a
s=r.getUint16(a,!1)
return s===0?B.i:A.cl(new A.o(r,this.b+s))},
$S:27}
A.iK.prototype={
$2(a,b){var s=this.b.b,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===this.a.c.O(b)},
$S:3}
A.iJ.prototype={
$2(a,b){var s=this.b.a
if(!(a<s.length))return A.a(s,a)
return s[a]===this.a.b.O(b)},
$S:3}
A.iL.prototype={
$2(a,b){var s=this.b.c
if(!(a<s.length))return A.a(s,a)
return s[a]===this.a.d.O(b)},
$S:3}
A.fx.prototype={
gL(){return 6},
U(a){var s,r,q,p,o=this,n=o.b,m=n.length
if(m===0)return!1
if(0>=m)return A.a(n,0)
n=n[0]
s=a.a.a
r=a.f
if(!(r>=0&&r<s.length))return A.a(s,r)
if(n.F(s[r].a)<0)return!1
q=A.og(a,m,new A.iN(o))
if(q==null)return!1
n=q.length
m=n-1
if(!(m>=0))return A.a(q,m)
p=q[m]+1
if(!A.ps(a,o.c.length,p,new A.iO(o)))return!1
if(!A.pr(a,o.a.length,new A.iP(o)))return!1
A.pj(a,q,p,o.d)
return!0}}
A.iQ.prototype={
$0(){var s,r,q,p,o,n,m=this.b,l=this.a,k=l.a
m.l(k,2)
s=m.a
r=s.getUint16(k,!1)
q=J.aR(r,t.c)
for(k=this.c,p=0;p<r;++p){o=l.a+2+p*2
if(o>=0)n=o+2<=s.byteLength
else n=!1
if(!n)A.p(A.i("read of 2 byte(s) at "+o+" overruns a "+m.gj(0)+"-byte font"))
q[p]=A.V(new A.o(s,k+s.getUint16(o,!1)))}l.a=l.a+(2+r*2)
return q},
$S:26}
A.iN.prototype={
$2(a,b){var s=this.a.b
if(!(a<s.length))return A.a(s,a)
return s[a].F(b)>=0},
$S:3}
A.iO.prototype={
$2(a,b){var s=this.a.c
if(!(a<s.length))return A.a(s,a)
return s[a].F(b)>=0},
$S:3}
A.iP.prototype={
$2(a,b){var s=this.a.a
if(!(a<s.length))return A.a(s,a)
return s[a].F(b)>=0},
$S:3}
A.hn.prototype={
gL(){return 8},
U(a){var s,r,q,p=this
if(a.r!==0)return!1
s=a.a.a
r=a.f
if(!(r>=0&&r<s.length))return A.a(s,r)
q=p.a.F(s[r].a)
if(q<0||q>=p.d.length)return!1
if(!A.pr(a,p.b.length,new A.k_(p)))return!1
if(!A.ps(a,p.c.length,a.f+1,new A.k0(p)))return!1
s=a.f
r=p.d
if(!(q>=0&&q<r.length))return A.a(r,q)
a.bg(s,r[q])
return!0}}
A.k1.prototype={
$0(){var s,r,q,p,o,n,m=this.b,l=this.a,k=l.a
m.l(k,2)
s=m.a
r=s.getUint16(k,!1)
q=J.aR(r,t.c)
for(k=this.c,p=0;p<r;++p){o=l.a+2+p*2
if(o>=0)n=o+2<=s.byteLength
else n=!1
if(!n)A.p(A.i("read of 2 byte(s) at "+o+" overruns a "+m.gj(0)+"-byte font"))
q[p]=A.V(new A.o(s,k+s.getUint16(o,!1)))}l.a=l.a+(2+r*2)
return q},
$S:26}
A.k_.prototype={
$2(a,b){var s=this.a.b
if(!(a<s.length))return A.a(s,a)
return s[a].F(b)>=0},
$S:3}
A.k0.prototype={
$2(a,b){var s=this.a.c
if(!(a<s.length))return A.a(s,a)
return s[a].F(b)>=0},
$S:3}
A.aJ.prototype={
aK(a){var s,r,q,p=this,o=a.f
if(o>=1&&o<=3&&(p.b&B.b.ai(1,o))!==0)return!0
if(o!==3)return!1
s=p.b
if((s&16)!==0){r=p.d
if(r==null)return!0
return!r.hS(p.c,a.a)}q=s&65280
if(q!==0)return a.r!==q>>>8
return!1},
cr(a){var s,r,q
for(s=a+1,r=this.a.a;q=r.length,s<q;++s){if(!(s>=0))return A.a(r,s)
if(!this.aK(r[s]))return s}return-1},
e4(a){var s=a-1,r=this.a.a,q=r.length
if(s>=q)s=q-1
for(;s>=0;--s){if(!(s<r.length))return A.a(r,s)
if(!this.aK(r[s]))return s}return-1}}
A.jB.prototype={
hB(a){var s,r,q,p,o,n,m,l,k,j,i,h=this
if(a<0||a>=h.e.length)throw A.e(A.i("feature index "+a+" out of range"))
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
l=J.aR(m,t.S)
for(o=p+4,k=0;k<m;++k){j=o+k*2
if(j>=0)i=j+2<=n.byteLength
else i=!1
if(!i)A.p(A.i("read of 2 byte(s) at "+j+" overruns a "+q.gj(0)+"-byte font"))
l[k]=n.getUint16(j,!1)}B.a.n(s,a,l)
return l},
dM(a,b){var s,r,q,p,o,n,m=this.d7(b,a)
if(m==null)return B.T
s=A.b3(t.S)
for(r=this.d1(m),q=r.length,p=this.d,o=0;o<r.length;r.length===q||(0,A.h)(r),++o){n=r[o]
if(!(n>=0&&n<p.length))return A.a(p,n)
s.k(0,p[n])}return s},
ej(a,b,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=t.nO
c.a(a)
s=d.d7(a0,b)
if(s==null)return B.cu
r=t.S
q=A.C(r,c)
for(c=d.d1(s),p=c.length,o=d.d,n=0;n<c.length;c.length===p||(0,A.h)(c),++n){m=c[n]
if(!(m>=0&&m<o.length))return A.a(o,m)
l=o[m]
if(!a.v(0,l))continue
for(k=d.hB(m),j=k.length,i=0;i<j;++i){h=k[i]
g=q.h(0,h)
if(g==null){g=A.b3(r)
q.n(0,h,g)}g.k(0,l)}}c=q.$ti.i("an<1>")
f=A.a1(new A.an(q,c),c.i("f.E"))
B.a.aT(f)
c=A.b([],t.kR)
for(r=f.length,n=0;n<f.length;f.length===r||(0,A.h)(f),++n){e=f[n]
p=q.h(0,e)
p.toString
c.push(new A.ht(e,p))}return c},
d7(a,b){var s,r,q,p,o,n,m,l=this.c,k=l.h(0,a)
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
if(!n)A.p(A.i("read of 4 byte(s) at "+o+" overruns a "+l.gj(0)+"-byte font"))
if(r.getUint32(o,!1)===b){s=o+4
if(s>=0)n=s+2<=r.byteLength
else n=!1
if(!n)A.p(A.i("read of 2 byte(s) at "+s+" overruns a "+l.gj(0)+"-byte font"))
return k+r.getUint16(s,!1)}}}l=this.a
l.l(k,2)
m=l.a.getUint16(k,!1)
return m===0?null:k+m},
d1(a){var s,r,q,p,o,n,m,l,k=A.b3(t.S),j=this.a,i=a+2
j.l(i,2)
s=j.a
r=s.getUint16(i,!1)
if(r!==65535&&r<this.d.length)k.k(0,r)
i=a+4
j.l(i,2)
q=s.getUint16(i,!1)
for(i=this.d,p=a+6,o=0;o<q;++o){n=p+o*2
if(n>=0)m=n+2<=s.byteLength
else m=!1
if(!m)A.p(A.i("read of 2 byte(s) at "+n+" overruns a "+j.gj(0)+"-byte font"))
l=s.getUint16(n,!1)
if(l<i.length)k.k(0,l)}j=A.a1(k,k.$ti.c)
B.a.aT(j)
return j},
q(a){var s=this
return"LayoutTable(1."+s.r+", "+s.c.a+" scripts, "+s.d.length+" features, "+s.w.length+" lookups)"}}
A.ht.prototype={
q(a){var s=this.b,r=A.r(s)
return"StagedLookup("+this.a+", "+new A.co(s,r.i("q(1)").a(new A.kh()),r.i("co<1,q>")).ac(0,"+")+")"}}
A.kh.prototype={
$1(a){return A.aD(A.E(a))},
$S:74}
A.dY.prototype={
dP(a){var s
a.az(1937007464)
a.bu()
a.az(1667460464)
a.az(1819239276)
a.bu()
for(s=0;s<7;++s){a.hi(B.a5[s],8);++a.e}a.cj(1919118452,4)
a.cj(1667329140,4)
a.bu()
a.az(1836279156)},
cJ(a,b){var s,r,q,p,o,n,m,l=A.tp(a),k=A.b([],t.t)
for(s=b.r,r=0;r<7;++r){q=s.h(0,B.a5[r])
k.push(q==null?0:q)}k.push(0)
for(s=a.a,q=l.length,p=0;p<s.length;++p){o=s[p]
n=o.y
if(!(p<q))return A.a(l,p)
m=l[p]
if(!(m<k.length))return A.a(k,m)
o.y=(n|k[m])>>>0}},
e6(a,b,c){}}
A.eF.prototype={
dP(a){},
cJ(a,b){},
e6(a,b,c){}}
A.fI.prototype={}
A.aC.prototype={
q(a){return"GlyphInfo(gid: "+this.a+", cluster: "+this.c+")"}}
A.bY.prototype={
q(a){var s=this
return"GlyphPosition(adv: "+s.a+","+s.b+" off: "+s.c+","+s.d+")"}}
A.eM.prototype={
an(){return"TextDirection."+this.b}}
A.jg.prototype={
gj(a){return this.a.length},
e8(){var s,r,q,p,o,n,m
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
return"GlyphBuffer("+s.length+" glyphs, "+this.c.q(0)+", "+new A.ao(s,r.i("c(1)").a(new A.jh()),r.i("ao<1,c>")).ac(0," ")+")"}}
A.jh.prototype={
$1(a){return t.h.a(a).a},
$S:34}
A.hd.prototype={
an(){return"NormalizationMode."+this.b}}
A.jL.prototype={
i2(a,b){if(a.a.length===0)return
this.f0(a)
this.h_(a,b)
this.fJ(a)},
f0(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=1668112752,f=A.b([],t.R)
for(s=a.a,r=s.length,q=this.a,p=q.a,o=p.c,n=0;n<s.length;s.length===r||(0,A.h)(s),++n){m=s[n]
l=m.b
k=q.e
if(k==null){j=o.h(0,g)
i=j==null?null:new A.o(p.a.a,j.c)
if(i==null)A.p(A.i("font has no "+A.aD(A.cH(g))+" table"))
k=q.e=A.e4(i)}h=k.af(l)
if(h!==0){m.a=h
B.a.k(f,m)
continue}if(!this.d_(f,m,m.b,!0)){l=m.b
k=q.e
if(k==null){j=o.h(0,g)
i=j==null?null:new A.o(p.a.a,j.c)
if(i==null)A.p(A.i("font has no "+A.aD(A.cH(g))+" table"))
k=q.e=A.e4(i)}m.a=k.af(l)
B.a.k(f,m)}}A.qt(a,f)},
d_(a,b,c,d){var s,r,q,p,o,n,m=this
t.n7.a(a)
s=A.wf(c)
r=s.a
q=s.b
if(r<0)return!1
p=q<0?0:m.a.gdO().af(q)
o=q>=0
if(o&&p===0)return!1
n=m.a.gdO().af(r)
if(d&&n!==0){B.a.k(a,m.b_(b,r,n))
if(o)B.a.k(a,m.b_(b,q,p))
return!0}if(m.d_(a,b,r,d)){if(o)B.a.k(a,m.b_(b,q,p))
return!0}if(n!==0){B.a.k(a,m.b_(b,r,n))
if(o)B.a.k(a,m.b_(b,q,p))
return!0}return!1},
h_(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=a.a,g=h.length
for(s=0;s<g;++s){if(!(s>=0&&s<h.length))return A.a(h,s)
r=h[s].b
q=A.am($.dW(),r)
r=$.fn()
p=r.length
if(q<p){if(!(q>=0))return A.a(r,q)
r=r[q]}else r=q
if(r===0)continue
o=s+1
n=o
for(;;){if(n<g){if(!(n<h.length))return A.a(h,n)
r=h[n].b
q=A.am($.dW(),r)
r=$.fn()
p=r.length
if(q<p){if(!(q>=0))return A.a(r,q)
r=r[q]}else r=q
r=r!==0}else r=!1
if(!r)break;++n}if(n-s<=32){for(m=o;m<n;++m){if(!(m<h.length))return A.a(h,m)
l=h[m]
r=l.b
q=A.am($.dW(),r)
r=$.fn()
p=r.length
if(q<p){if(!(q>=0))return A.a(r,q)
k=r[q]}else k=q
j=m
for(;;){if(j>s){r=j-1
if(!(r<h.length))return A.a(h,r)
r=h[r].b
q=A.am($.dW(),r)
r=$.fn()
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
A.uK(a,j,m+1)}}b.e6(a,s,n)}s=n-1}},
fJ(a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=1668112752,a4=a5.a
if(a4.length<2)return
s=A.b([B.a.gu(a4)],t.R)
for(r=this.a,q=r.a,p=q.c,q=q.a.a,o=0,n=1;n<a4.length;++n){m=a4[n]
l=B.a.gS(s)
k=m.e
j=k===1||k===2||k===3
if(o!==s.length-1){k=l.b
i=$.dW()
h=A.am(i,k)
k=$.fn()
g=k.length
if(h<g){if(!(h>=0))return A.a(k,h)
f=k[h]}else f=h
h=A.am(i,m.b)
if(h<g){if(!(h>=0))return A.a(k,h)
k=k[h]}else k=h
e=f>=k}else e=!1
if(j&&!e){if(!(o>=0&&o<s.length))return A.a(s,o)
d=A.we(s[o].b,m.b)
if(d>=0){k=r.e
if(k==null){c=p.h(0,a3)
b=c==null?null:new A.o(q,c.c)
if(b==null)A.p(A.i("font has no "+A.aD(A.cH(a3))+" table"))
k=r.e=A.e4(b)}a=k.af(d)
if(a!==0){a0=m.c
for(k=s.length,a1=o;a1<k;++a1){a2=s[a1].c
if(a2<a0)a0=a2}for(a1=o;k=s.length,a1<k;++a1)s[a1].c=a0
if(!(o<k))return A.a(s,o)
k=s[o]
k.b=d
k.a=a
k.e=A.am($.oC(),d)
k.d=A.am($.oD(),d)
continue}}}B.a.k(s,m)
k=m.b
if(A.am($.dW(),k)===0)o=s.length-1}A.qt(a5,s)},
b_(a,b,c){var s=a.c,r=A.am($.oC(),b)
return new A.aC(c,b,s,A.am($.oD(),b),r,0,0,0,0,a.y,!1)}}
A.mw.prototype={
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
$S:80}
A.hq.prototype={
gj(a){return this.a.length},
q(a){var s=this.a,r=A.M(s)
return"ShapedRun("+s.length+" glyphs, "+this.c.q(0)+", "+new A.ao(s,r.i("c(1)").a(new A.kd()),r.i("ao<1,c>")).ac(0," ")+")"}}
A.kd.prototype={
$1(a){return t.h.a(a).a},
$S:34}
A.hr.prototype={
ei(a,b,c){var s,r
t.L.a(a)
s=A.b([],t.t)
for(r=0;r<a.length;++r)s.push(r)
return this.fZ(a,s,b,B.cE,1145457748,c)},
fZ(a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a=t.L
a.a(a0)
a.a(a1)
s=b.fF(a5,a4,a2,t.kT.a(a3))
r=B.ag.v(0,a5)?new A.dY():B.Y
q=b.d
a=q.a
B.a.aa(a)
p=q.b
B.a.aa(p)
q.c=B.v
q.d=0
q.c=a2
q.d=a5
for(o=0;o<a0.length;++o){n=a0[o]
if(!(o<a1.length))return A.a(a1,o)
B.a.k(a,new A.aC(0,n,a1[o],0,0,0,0,0,0,0,!1))
B.a.k(p,new A.bY(0))}if(a.length===0)return new A.hq(B.cF,B.cG,a2)
b.fW(q,s)
A.v7(q)
A.v6(q)
b.fp(q,s)
m=b.c;(m===$?b.c=new A.jL(b.a):m).i2(q,r)
r.cJ(q,s)
n=b.a
l=n.ch
if(l==null)l=n.ch=n.bm(1195656518,A.xt(),t.lP)
A.v5(q,l)
k=n.gcI()
if(k!=null)for(j=s.d,i=j.length,h=0;h<j.length;j.length===i||(0,A.h)(j),++h)for(g=j[h].a,f=g.length,e=0;e<g.length;g.length===f||(0,A.h)(g),++e){d=g[e]
k.hl(d.a,q,l,d.b)}B.a.aa(p)
j=A.b([],t.q)
for(i=a.length,h=0;h<a.length;a.length===i||(0,A.h)(a),++h)j.push(new A.bY(n.c9(a[h].a)))
B.a.B(p,j)
c=n.gcH()
if(c!=null)for(j=s.e,i=j.length,n=n.b,h=0;h<j.length;j.length===i||(0,A.h)(j),++h)for(g=j[h].a,f=g.length,e=0;e<g.length;g.length===f||(0,A.h)(g),++e){d=g[e]
c.hm(d.a,q,n,l,d.b)}A.uf(q,!1)
A.ue(q)
A.ud(q)
n=q.c
if(n===B.k)q.e8()
b.fe(q)
a=A.a1(a,t.h)
p=A.a1(p,t.lr)
return new A.hq(a,p,q.c)},
fF(a,b,c,d){var s,r,q,p,o,n,m,l
t.kT.a(d)
s=[]
for(r=0;!1;++r){q=d[r]
s.push(q.gij().aJ(0,31).bI(0,q.giq()))}p=A.oV(a,b,c,A.uL(s))
s=this.b
o=s.h(0,p)
if(o!=null)return o
n=new A.kf(a,b,c,A.b([],t.la))
A.xi(n,B.ag.v(0,a)?new A.dY():B.Y)
for(r=0;!1;++r){q=d[r]
n.aN(q.gij(),1,q.giq())}m=this.a
l=m.gcI()
l=l==null?null:l.a
m=m.gcH()
m=n.hs(m==null?null:m.a,l)
s.n(0,p,m)
return m},
fW(a,b){var s,r,q,p,o,n
for(s=a.a,r=s.length,q=b.f,p=0;p<s.length;s.length===r||(0,A.h)(s),++p){o=s[p]
n=o.b
o.e=A.am($.oC(),n)
n=o.b
o.d=A.am($.oD(),n)
o.y=q}},
fp(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=1668112752
if(a.c!==B.k)return
s=b.i_(1920232557)
for(r=a.a,q=r.length,p=s!==0,o=this.a,n=o.a,m=n.c,l=0;l<r.length;r.length===q||(0,A.h)(r),++l){k=r[l]
j=k.b
i=A.am($.pF(),j)
h=i===0?-1:B.b.M(i,2)
if(h>0){j=o.e
if(j==null){g=m.h(0,e)
f=g==null?null:new A.o(n.a.a,g.c)
if(f==null)A.p(A.i("font has no "+A.aD(A.cH(e))+" table"))
j=o.e=A.e4(f)}j=j.af(h)!==0}else j=!1
if(j)k.b=h
else if(p)k.y=(k.y|s)>>>0}},
fe(a){var s,r,q,p,o,n,m,l,k,j,i,h=1668112752
for(s=a.a,r=a.b,q=this.a,p=q.a,o=p.c,n=-1,m=0;m<s.length;++m){l=s[m]
if(!A.xG(l.b))continue
if(n<0){k=q.e
if(k==null){j=o.h(0,h)
i=j==null?null:new A.o(p.a.a,j.c)
if(i==null)A.p(A.i("font has no "+A.aD(A.cH(h))+" table"))
k=q.e=A.e4(i)}n=k.af(32)}if(n!==0)l.a=n
if(!(m<r.length))return A.a(r,m)
k=r[m]
k.d=k.c=k.b=k.a=0}}}
A.hk.prototype={
q(a){return"PlannedLookup("+this.a+", mask 0x"+B.b.ba(this.b,16)+")"}}
A.hj.prototype={
q(a){return"PlanStage("+this.a.length+" lookups)"}}
A.hs.prototype={
i_(a){var s=this.r.h(0,a)
return s==null?0:s},
q(a){var s=this
return"ShapingPlan("+A.aD(s.a)+"/"+A.aD(s.b)+", "+s.c.q(0)+", "+s.d.length+" GSUB stages, "+s.e.length+" GPOS stages)"}}
A.bJ.prototype={}
A.kf.prototype={
cj(a,b){return this.aN(a,b|1,1)},
az(a){return this.cj(a,0)},
aN(a,b,c){var s=(b&1)!==0?c:0,r=new A.bJ(a,b,c,s,this.r++)
r.f=this.e
B.a.k(this.d,r)},
bt(a){return this.aN(a,0,1)},
hi(a,b){return this.aN(a,b,1)},
bu(){return this.e++},
hs(a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=this,a3=A.qr(a2.d,!0,t.bY)
B.a.aC(a3,new A.kg())
s=A.b([],t.la)
for(r=a3.length,q=0;q<a3.length;a3.length===r||(0,A.h)(a3),++q){p=a3[q]
if(s.length!==0&&B.a.gS(s).a===p.a){o=B.a.gS(s)
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
if(n<o.r)o.r=n}else B.a.k(s,p)}l=a5==null?B.T:a5.dM(a2.b,a2.a)
k=a4==null?B.T:a4.dM(a2.b,a2.a)
r=t.S
j=A.C(r,r)
i=A.b3(r)
h=A.C(r,r)
g=A.C(r,r)
f=A.C(r,r)
for(r=s.length,e=1,d=1,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q]
n=p.a
c=l.v(0,n)
b=k.v(0,n)
m=!c
if(!m||b)i.k(0,n)
if(m&&!b&&(p.b&8)===0)continue
if((p.b&1)!==0&&p.c===1)a=1
else{a0=A.v8(p.c)
a1=e+a0
if(a1>32)continue
a=B.b.ai(B.b.ai(1,a0)-1,e)
d=(d|B.b.ai(p.d,e)&a)>>>0
e=a1}j.n(0,n,a)
h.n(0,n,p.b)
g.n(0,n,p.f)
f.n(0,n,p.r)}return new A.hs(a2.a,a2.b,a2.c,a2.dr(a5,j,h,g,a2.e),a2.dr(a4,j,h,f,0),d,j)},
dr(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h,g=t.mV
g.a(b)
g.a(c)
g.a(d)
if(a==null)return B.ct
s=A.b([],t.lE)
for(g=t.gX,r=this.a,q=this.b,p=A.r(d).i("cx<1,2>"),o=t.S,n=0;n<=e;++n){m=A.b3(o)
for(l=new A.cx(d,d.r,d.e,p);l.m();){k=l.d
if(k.b===n)m.k(0,k.a)}if(m.a===0)continue
j=a.ej(m,q,r)
if(j.length===0)continue
l=A.b([],g)
for(i=j.length,h=0;h<j.length;j.length===i||(0,A.h)(j),++h)l.push(this.fE(j[h],m,b,c))
B.a.k(s,new A.hj(l))}return s},
fE(a,b,c,d){var s,r,q,p,o,n,m,l
t.nO.a(b)
s=t.mV
s.a(c)
s.a(d)
for(s=a.b,s=A.vG(s,s.r,A.r(s).c),r=s.$ti.c,q=0,p=!0,o=!0;s.m();){n=s.d
if(n==null)n=r.a(n)
if(!b.v(0,n))continue
m=c.h(0,n)
q=(q|(m==null?0:m))>>>0
l=d.h(0,n)
if(l==null)l=0
p=B.a3.cF(p,(l&2)===0)
o=B.a3.cF(o,(l&4)===0)}return new A.hk(a.a,q)}}
A.kg.prototype={
$2(a,b){var s,r=t.bY
r.a(a)
r.a(b)
r=a.a
s=b.a
return r!==s?r-s:a.e-b.e},
$S:81}
A.bo.prototype={
gj(a){return this.b-this.a},
q(a){return"BidiRun("+this.a+".."+this.b+", level "+this.c+")"}}
A.e0.prototype={}
A.lF.prototype={
en(a,b){var s,r,q,p,o,n,m,l=this
for(s=l.c,r=l.d,q=l.a,p=J.n(q),o=r.$flags|0,n=0;n<s;++n){m=p.h(q,n)
m=A.am($.pG(),m)
o&2&&A.w(r)
if(!(n<r.length))return A.a(r,n)
r[n]=m}B.j.bJ(l.e,0,r)
l.f2()},
e9(){var s,r,q,p,o=this,n=o.c
if(n===0){n=new Uint8Array(0)
return new A.e0(n,0,B.M,B.M)}n=o.df(0,n)
o.x=n
o.fP()
s=o.eO()
for(n=s.length,r=0;r<s.length;s.length===n||(0,A.h)(s),++r){q=s[r]
q.h9()
q.ha()
q.hb()
q.hc()
q.hd()
q.he()
q.hf()
q.fq()
q.fs()
q.ff()}o.fk()
o.eI()
p=o.fl()
return new A.e0(o.f,o.x,p,o.fN(p))},
df(a,b){var s,r,q,p,o,n
for(s=this.d,r=s.length,q=this.r,p=q.length,o=a;o<b;++o){if(!(o>=0&&o<r))return A.a(s,o)
n=s[o]
if(n===0)return 0
if(n===1||n===2)return 1
if(n===19||n===20||n===21){if(!(o<p))return A.a(q,o)
o=q[o]
if(o>=b)break}}return 0},
f2(){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=h.r,f=h.c
B.C.bB(g,0,f,-1)
s=h.w
B.C.bB(s,0,f,-1)
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
if(j===0){o&2&&A.w(s)
if(!(k<s.length))return A.a(s,k)
s[k]=n
l=k
break}}++k}r&2&&A.w(g)
if(!(n<g.length))return A.a(g,n)
g[n]=l}},
fP(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=this,a1=new Uint8Array(128),a2=new Uint8Array(128),a3=new Uint8Array(128),a4=a0.x
a4===$&&A.v()
a1[0]=a4
a2[0]=255
for(a4=a0.c,s=a0.f,r=s.$flags|0,q=a0.d,p=q.length,o=a0.e,n=o.$flags|0,m=a0.r,l=m.length,k=0,j=0,i=0,h=0,g=0;g<a4;++g){if(!(g<p))return A.a(q,g)
f=q[g]
e=0
switch(f){case 15:case 14:case 17:case 16:if(!(k>=0&&k<128))return A.a(a1,k)
d=a1[k]
r&2&&A.w(s)
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
b=a0.df(g+1,d)===1}if(!(k>=0&&k<128))return A.a(a1,k)
d=a1[k]
r&2&&A.w(s)
if(!(g<s.length))return A.a(s,g)
s[g]=d
d=a2[k]
if(d!==255){n&2&&A.w(o)
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
r&2&&A.w(s)
if(!(g<s.length))return A.a(s,g)
s[g]=d
d=a2[k]
if(d!==255){n&2&&A.w(o)
if(!(g<o.length))return A.a(o,g)
o[g]=d}break
case 18:if(!(j>0))if(i>0)--i
else{if(!(k>=0&&k<128))return A.a(a3,k)
if(a3[k]===0&&k>=1)--k}if(!(k>=0&&k<128))return A.a(a1,k)
d=a1[k]
r&2&&A.w(s)
if(!(g<s.length))return A.a(s,g)
s[g]=d
break
case 10:d=a0.x
r&2&&A.w(s)
if(!(g<s.length))return A.a(s,g)
s[g]=d
i=e
k=0
j=0
h=0
break
default:if(!(k>=0&&k<128))return A.a(a1,k)
d=a1[k]
r&2&&A.w(s)
if(!(g<s.length))return A.a(s,g)
s[g]=d
d=a2[k]
if(d!==255){n&2&&A.w(o)
if(!(g<o.length))return A.a(o,g)
o[g]=d}}}for(g=0;g<a4;++g){if(!(g<p))return A.a(q,g)
s=q[g]
if(s===15||s===14||s===17||s===16||s===18||s===9){n&2&&A.w(o)
if(!(g<o.length))return A.a(o,g)
o[g]=9}}},
eO(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1=this,b2=t.t,b3=A.b([],b2),b4=b1.c,b5=new Int32Array(b4)
B.C.bB(b5,0,b4,-1)
for(s=b1.d,r=s.length,q=0;q<b4;++q){if(!(q<r))return A.a(s,q)
p=s[q]
if(p===15||p===14||p===17||p===16||p===18||p===9)continue
p=b3.length
if(!(q<b4))return A.a(b5,q)
b5[q]=p
B.a.k(b3,q)}p=t.L
p.a(b3)
b1.y!==$&&A.px()
b1.y=b3
b1.z!==$&&A.px()
b1.z=b5
if(b3.length===0)return B.cx
o=A.b([],b2)
n=A.b([],b2)
m=new Int32Array(b4)
B.C.bB(m,0,b4,-1)
for(l=b1.f,k=l.length,j=0,i=1;h=b3.length,i<=h;++i){if(i!==h){if(!(i<h))return A.a(b3,i)
g=b3[i]
if(!(g<k))return A.a(l,g)
g=l[g]
if(!(j>=0&&j<h))return A.a(b3,j)
h=b3[j]
if(!(h<k))return A.a(l,h)
h=g!==l[h]}else h=!0
if(h){f=o.length
B.a.k(o,j)
B.a.k(n,i)
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
B.a.k(a2,b3[i]);++i}a4=B.a.gS(a2)
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
a0===$&&A.v()
a9=a0}a4=B.a.gS(a2)
if(!(a4<r))return A.a(s,a4)
a0=s[a4]
if(a0===19||a0===20||a0===21){if(!(a4<g))return A.a(h,a4)
a0=h[a4]>=b4}else a0=!1
if(a0){a0=b1.x
a0===$&&A.v()
b0=a0}else{if(!(a4<b4))return A.a(b5,a4)
a0=b5[a4]+1
a6=b3.length
if(a0<a6){if(!(a0>=0))return A.a(b3,a0)
a0=b3[a0]
if(!(a0<k))return A.a(l,a0)
b0=l[a0]}else{a0=b1.x
a0===$&&A.v()
b0=a0}}a0=((a7>a9?a7:a9)&1)===1?1:0
B.a.k(d,A.vC(b1,a2,a0,((a7>b0?a7:b0)&1)===1?1:0,a7))}return d},
fk(){var s,r,q,p,o,n,m,l,k=this
for(s=k.c,r=k.x,q=k.f,p=k.d,o=p.length,n=q.length,m=0;m<s;++m){if(!(m<o))return A.a(p,m)
l=p[m]
if(!(l===15||l===14||l===17||l===16||l===18||l===9))continue
if(m>0){l=m-1
if(!(l<n))return A.a(q,l)
l=q[l]}else{r===$&&A.v()
l=r}q.$flags&2&&A.w(q)
if(!(m<n))return A.a(q,m)
q[m]=l}},
eI(){var s,r,q,p,o,n,m,l,k,j,i,h=this
for(s=h.c,r=h.f,q=h.x,p=r.$flags|0,o=h.d,n=o.length,m=0;m<s;++m){if(!(m<n))return A.a(o,m)
l=o[m]
if(l!==10&&l!==11)continue
q===$&&A.v()
p&2&&A.w(r)
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
q===$&&A.v()
p&2&&A.w(r)
if(!(j<r.length))return A.a(r,j)
r[j]=q}},
fl(){var s,r,q,p,o,n,m=A.b([],t.E)
for(s=this.c,r=this.f,q=r.length,p=0,o=1;o<=s;++o){if(o!==s){if(!(o<q))return A.a(r,o)
n=r[o]
if(!(p>=0&&p<q))return A.a(r,p)
n=n!==r[p]}else n=!0
if(n){if(!(p>=0&&p<q))return A.a(r,p)
B.a.k(m,new A.bo(p,o,r[p]))
p=o}}return m},
fN(a){var s,r,q,p,o,n,m,l,k,j,i,h
t.kV.a(a)
s=a.length
if(s===0)return B.M
for(r=0,q=127,p=0;p<s;++p){o=a[p].c
if(o>r)r=o
if((o&1)===1&&o<q)q=o}n=A.a1(a,t.kb)
for(s=n.length,m=r;m>=q;--m)for(l=0;l<s;){if(!(l>=0))return A.a(n,l)
if(n[l].c<m){++l
continue}k=l
for(;;){if(!(k<s&&n[k].c>=m))break;++k}for(j=k-1,i=l;i<j;++i,--j){if(!(i<s))return A.a(n,i)
h=n[i]
if(!(j<s))return A.a(n,j)
n[i]=n[j]
n[j]=h}l=k}return n}}
A.i6.prototype={
gj(a){return this.b.length},
h9(){var s,r,q,p,o=this.e
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
if(r[p]===8)B.a.n(r,p,o===19||o===20||o===21||o===22?13:o)
o=r[p]}},
ha(){var s,r,q,p,o,n=this.e
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
o=r[p]
if(o===0||o===1||o===2)n=o
else if(o===3&&n===2)B.a.n(r,p,6)}},
hb(){var s,r,q,p
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
if(r[p]===2)B.a.n(r,p,1)}},
hc(){var s,r,q,p,o,n,m,l
for(s=this.b,r=this.c,q=r.length,p=1;p<s.length-1;++p){if(!(p<q))return A.a(r,p)
o=r[p]
if(o!==4&&o!==7)continue
n=p-1
if(!(n<q))return A.a(r,n)
m=r[n]
n=p+1
if(!(n<q))return A.a(r,n)
l=r[n]
if(m===3&&l===3)B.a.n(r,p,3)
else if(o===7&&m===6&&l===6)B.a.n(r,p,6)}},
hd(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
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
if(i===3||h===3)for(g=n;g<l;++g)B.a.n(p,g,3)
n=l-1}},
he(){var s,r,q,p,o
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
o=r[p]
if(o===5||o===4||o===7)B.a.n(r,p,13)}},
hf(){var s,r,q,p,o,n=this.e
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
o=r[p]
if(o===0||o===1)n=o
else if(o===3&&n===0)B.a.n(r,p,0)}},
fq(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=(e.r&1)===1?1:0,c=d===0?1:0
for(s=e.eL(),r=s.length,q=e.c,p=q.length,o=e.e,n=0;n<s.length;s.length===r||(0,A.h)(s),++n){m=s[n]
l=m.a
k=m.b
i=l+1
h=!1
for(;;){if(!(i<k)){j=-1
break}A:{if(!(i>=0&&i<p))return A.a(q,i)
g=A.qZ(q[i])
if(g===-1)break A
if(g===d){j=d
break}h=!0}++i}if(j===-1&&h){i=l-1
for(;;){if(!(i>=0)){f=o
break}if(!(i<p))return A.a(q,i)
g=A.qZ(q[i])
if(g!==-1){f=g
break}--i}j=f===c?c:d}if(j===-1)continue
B.a.n(q,l,j)
B.a.n(q,k,j)
e.cQ(l,j)
e.cQ(k,j)}},
cQ(a,b){var s,r=a+1,q=this.c,p=this.b
for(;;){if(r<p.length){s=this.d
s===$&&A.v()
if(!(r>=0&&r<s.length))return A.a(s,r)
s=s[r]===8}else s=!1
if(!s)break
B.a.n(q,r,b);++r}},
eL(){var s,r,q,p,o,n,m,l,k,j,i,h,g=t.t,f=A.b([],g),e=A.b([],g),d=A.b([],t.hp)
for(g=this.b,s=this.a.a,r=J.n(s),q=this.c,p=q.length,o=f.$flags|0,n=e.$flags|0,m=0;m<g.length;++m){if(!(m<p))return A.a(q,m)
if(q[m]!==13)continue
l=r.h(s,g[m])
k=$.pF()
switch(A.am(k,l)&3){case 1:if(f.length===63)return A.qY(d)
j=A.am(k,l)
B.a.k(f,A.qX(j===0?-1:B.b.M(j,2)))
B.a.k(e,m)
break
case 2:i=A.qX(l)
for(h=f.length-1;h>=0;--h){if(f[h]!==i)continue
if(!(h<e.length))return A.a(e,h)
B.a.k(d,new A.z(e[h],m))
k=f.length
o&1&&A.w(f,18)
A.aB(h,k,k)
f.splice(h,k-h)
k=e.length
n&1&&A.w(e,18)
A.aB(h,k,k)
e.splice(h,k-h)
break}break}}return A.qY(d)},
fs(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=(e.r&1)===1?1:0
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
for(f=n;f<k;++f)B.a.n(r,f,g)
n=k-1}},
ff(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this
for(s=e.b,r=s.length,q=e.a.f,p=q.$flags|0,o=e.r,n=(o&1)===0,m=e.c,l=m.length,k=o+1,j=o+2,i=0;i<r;++i){if(!(i<l))return A.a(m,i)
h=m[i]
if(n)if(h===1)g=k
else g=h===6||h===3?j:o
else g=h===0||h===3||h===6?k:o
f=s[i]
p&2&&A.w(q)
if(!(f<q.length))return A.a(q,f)
q[f]=g}}}
A.lw.prototype={
$2(a,b){var s=t.gn
return B.b.a6(s.a(a).a,s.a(b).a)},
$S:82}
A.eE.prototype={
gj(a){return this.b-this.a},
q(a){return"ScriptRun("+this.a+".."+this.b+", "+A.aD(this.c)+")"}}
A.nM.prototype={
$0(){var s,r,q,p=new Int32Array(171)
for(s=0;s<171;++s){r=B.cV.h(0,B.P[s])
q=r==null?1145457748:A.vp(r)
if(!(s<171))return A.a(p,s)
p[s]=q}return p},
$S:83}
A.o.prototype={
gj(a){return this.a.byteLength},
X(a,b){return a>=0&&b>=0&&a+b<=this.a.byteLength},
cC(a){var s
this.l(a,3)
s=this.a
return(s.getUint8(a)<<16|s.getUint8(a+1)<<8|s.getUint8(a+2))>>>0},
a1(a){var s,r,q,p,o=this,n=a*2
o.l(o.b,n)
s=new Uint16Array(a)
for(r=o.a,q=0;q<a;++q){p=r.getUint16(o.b+q*2,!1)
if(!(q<a))return A.a(s,q)
s[q]=p}o.b+=n
return s},
l(a,b){if(!this.X(a,b))throw A.e(A.i("read of "+b+" byte(s) at "+a+" overruns a "+this.gj(0)+"-byte font"))}}
A.az.prototype={
q(a){return"FontFormatException: "+this.a}}
A.iz.prototype={}
A.iR.prototype={}
A.ik.prototype={
ghX(a){var s=this.b
s===$&&A.v()
return s},
gib(a){var s=this.c
s===$&&A.v()
return s},
hY(a,b){return this.ghX(this).$1(b)},
ic(a,b){return this.gib(this).$1(b)}}
A.aZ.prototype={
shp(a){this.e=t.nw.a(a)}}
A.jX.prototype={
el(a,b){var s,r=this,q=r.a.b,p=t.gz.a(A.T(q+2,B.B,!1,t.kp))
r.b!==$&&A.px()
r.b=p
B.a.n(p,q+1,a)
for(;q>=0;--q){s=q+1
if(!(s<p.length))return A.a(p,s)
B.a.n(p,q,r.fb(p[s],q))}},
dN(a){var s=this.f.h(0,a)
s=s==null?null:s.e
return s==null?B.B:s},
hV(a,b,c){var s={},r=A.b([],t.r)
s.a=0
B.a.a3(this.dN(a),new A.jZ(s,r,b,c))
return r},
dD(a,b){var s,r=a.d
if(J.k(r.h(0,"cluster"),!0))return r.h(0,b.a)
s=this.d
s.sah(r)
return b.hY(0,s)},
h6(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
t.kp.a(b)
s=t.N
r=t.O
q=A.C(s,r)
for(p=f.c,o=p.length,n=f.d,m=0;m<p.length;p.length===o||(0,A.h)(p),++m){l=p[m]
k=f.dD(a,l)
for(j=b.length,i=l.a,h=0;h<b.length;b.length===j||(0,A.h)(b),++h){g=f.dD(b[h],l)
n.f=k
n.sah(A.en([i,g],s,r))
k=l.ic(0,n)}q.n(0,i,k)}return q},
fb(b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3=this
t.kp.a(b4)
s=b3.a
r=s.a/(512*B.b.ab(1,b5))
q=A.C(t.S,t.L)
p=new A.jY(r)
for(o=t.t,n=0;m=b4.length,n<m;++n){m=b4[n]
m=p.$2(m.a,m.b)
l=q.h(0,m)
if(l==null){l=A.b([],o)
q.n(0,m,l)
m=l}else m=l
B.a.k(m,n)}k=new Uint8Array(m)
l=t.r
j=A.b([],l)
i=A.b([],o)
for(o=b3.c,h=b3.f,g=t.N,f=t.O,e=r*r,s=s.c,n=0;n<b4.length;++n){if(!(n<m))return A.a(k,n)
if(k[n]!==0)continue
d=b4[n]
B.a.aa(i)
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
B.a.k(i,a7)
if(!(a7<b4.length))return A.a(b4,a7)
a0+=b4[a7].c}}if(!(n<m))return A.a(k,n)
k[n]=1
a2=i.length
if(a2===0||a0<s){B.a.k(j,d)
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
a2.push(b4[a7])}a2=b3.h6(d,a2)}if(a2!=null)a.B(0,a2)
a.n(0,"$id",b)
a.n(0,"cluster",!0)
a.n(0,"cluster_id",b)
a.n(0,"point_count",a0)
if(a0>=1e4)a2=""+B.c.Y(a0/1000)+"k"
else a2=a0>=1000?A.t(B.c.Y(a0/100)/10)+"k":a0
a.n(0,"point_count_abbreviated",a2)
a=new A.aZ(b1/a0,b2/a0,a0,a)
a0=A.b([d],l)
for(a2=i.length,a6=0;a6<i.length;i.length===a2||(0,A.h)(i),++a6){a7=i[a6]
if(!(a7>=0&&a7<b4.length))return A.a(b4,a7)
a0.push(b4[a7])}a.shp(a0)
a.f=b5
h.n(0,b,a)
B.a.k(j,a)}return j}}
A.jZ.prototype={
$1(a){var s,r,q=this
t.el.a(a)
s=q.b
if(s.length>=q.c)return
r=a.e
if(r!=null)B.a.a3(r,q)
else if(q.a.a++>=q.d)B.a.k(s,a)},
$S:87}
A.jY.prototype={
$2(a,b){var s=this.a
return B.c.a7(a/s)*67108864+B.c.a7(b/s)},
$S:89}
A.ab.prototype={
gbl(){var s,r,q=new A.k5(),p=new A.k4(),o=this.a,n=q.$1(o),m=this.b,l=q.$1(m),k=this.c,j=q.$1(k),i=p.$1(0.2225045*n+0.7168786*l+0.0606169*j)
q=o===m
s=q&&m===k?i:p.$1((0.4360747*n+0.3850649*l+0.1430804*j)/0.96422)
r=q&&m===k?i:p.$1((0.0139322*n+0.0971045*l+0.7141733*j)/0.82521)
return new A.aM(Math.max(0,116*i-16),500*(s-i),200*(i-r))}}
A.k5.prototype={
$1(a){return a<=0.04045?a/12.92:Math.pow((a+0.055)/1.055,2.4)},
$S:5}
A.k4.prototype={
$1(a){return a>0.008856451679035631?Math.pow(a,0.3333333333333333):a/0.12841854934601665+0.13793103448275862},
$S:5}
A.k2.prototype={
$1(a){return a>0.20689655172413793?a*a*a:0.12841854934601665*(a-0.13793103448275862)},
$S:5}
A.k3.prototype={
$1(a){return B.c.E(a<=0.0031308?12.92*a:1.055*Math.pow(a,0.4166666666666667)-0.055,0,1)},
$S:5}
A.ka.prototype={
$0(){return A.v_(this.a)},
$S:93}
A.k6.prototype={
$1(a){A.U(a)
return a+a},
$S:42}
A.k7.prototype={
$1(a){return A.U(a).length!==0},
$S:41}
A.k8.prototype={
$2(a,b){var s,r=this.a
if(!(a<r.length))return A.a(r,a)
s=r[a]
if(B.d.cl(s,"%")){r=A.N(B.d.a5(s,0,s.length-1))
r=(r==null?0:r)/100}else{r=A.N(s)
r=(r==null?0:r)/b}return r},
$S:43}
A.k9.prototype={
$1(a){var s,r=this
if(a<0)++a
if(a>1)--a
if(a<0.16666666666666666){s=r.a
return s+(r.b-s)*6*a}if(a<0.5)return r.b
if(a<0.6666666666666666){s=r.a
return s+(r.b-s)*(0.6666666666666666-a)*6}return r.a},
$S:5}
A.A.prototype={
sah(a){this.b=t.lb.a(a)},
shW(a){this.r=t.n4.a(a)}}
A.lZ.prototype={
$1(a){t.X.a(a)
return a.r==null?a.b.h(0,this.a):this.b.$1(a)},
$S:2}
A.m3.prototype={
$1(a){t.X.a(a)
return this.a},
$S:2}
A.nZ.prototype={
$1(a){var s=this.a.$1(a)
return s instanceof A.bU?s:B.d.aH(A.ay(s))},
$S:45}
A.o_.prototype={
$1(a){var s,r,q,p,o,n
for(s=this.a,r=s.length,q=t.j,p=0,o="";p<s.length;s.length===r||(0,A.h)(s),++p){n=s[p]
o+=typeof n=="string"?n:A.ay(a.b.h(0,B.a.gu(q.a(n))))}return B.d.aH(o.charCodeAt(0)==0?o:o)},
$S:4}
A.nX.prototype={
$1(a){var s,r,q,p
A:{s=t.j.b(a)
r=null
q=!1
if(s){p=J.n(a)
if(p.gj(a)>=1)if("coalesce"===p.h(a,0)){r=p.a_(a,1)
q=J.n(r)
q=q.gH(r)&&q.ae(r,new A.nY())}}if(q){s=["$images"]
B.a.B(s,r)
break A}if(s){s=[]
for(q=J.G(a);q.m();)s.push(this.$1(q.gp()))
break A}s=a
break A}return s},
$S:47}
A.nY.prototype={
$1(a){var s
if(t.j.b(a)){s=J.n(a)
s=s.gH(a)&&J.k(s.gu(a),"image")}else s=!1
return s},
$S:16}
A.nV.prototype={
$1(a){return!0},
$S:1}
A.nW.prototype={
$1(a){return J.k(this.a.$1(a),!0)},
$S:1}
A.mg.prototype={
$2(a,b){return J.k(b,"$type")?a.c:a.b.h(0,b)},
$S:49}
A.m7.prototype={
$1(a){var s,r,q
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q)if(!J.k(s[q].$1(a),!0))return!1
return!0},
$S:1}
A.m8.prototype={
$1(a){var s,r,q
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q)if(J.k(s[q].$1(a),!0))return!0
return!1},
$S:1}
A.m9.prototype={
$1(a){var s,r,q
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q)if(J.k(s[q].$1(a),!0))return!1
return!0},
$S:1}
A.ma.prototype={
$1(a){return!t.X.a(a).b.J(this.a)},
$S:1}
A.mb.prototype={
$1(a){return!this.a.v(0,this.b.$2(t.X.a(a),this.c))},
$S:1}
A.mc.prototype={
$1(a){return this.a.v(0,this.b.$2(t.X.a(a),this.c))},
$S:1}
A.md.prototype={
$1(a){return J.k(this.a.$2(t.X.a(a),this.b),this.c)},
$S:1}
A.me.prototype={
$1(a){return!J.k(this.a.$2(t.X.a(a),this.b),this.c)},
$S:1}
A.mf.prototype={
$1(a){var s=this
t.X.a(a)
return A.p7(A.U(s.a),s.b.$2(a,s.c),s.d)},
$S:1}
A.cL.prototype={
hq(a,b){var s,r,q,p,o,n=a.toLowerCase(),m=b.toLowerCase(),l=B.d.a6(A.rw(n),A.rw(m))
if(l===0&&this.b)l=B.d.a6(n,m)
if(l===0&&this.a){s=t.J.i("f.E")
r=A.a1(new A.ar(a),s)
q=A.a1(new A.ar(b),s)
p=0
for(;;){if(!(l===0&&p<r.length&&p<q.length))break
if(!(p<r.length))return A.a(r,p)
o=A.Q(r[p])
s=o===o.toLowerCase()?0:1
if(!(p<q.length))return A.a(q,p)
o=A.Q(q[p])
l=B.b.a6(s,o===o.toLowerCase()?0:1);++p}}if(l>0)s=1
else s=l<0?-1:l
return s}}
A.nQ.prototype={
$1(a){var s
A.E(a)
s=$.t4().h(0,a)
return s==null?a:s},
$S:14}
A.mD.prototype={
$1(a){var s=this.a
return a<s.length?A.u(s[a]):A.ag(null)},
$S:50}
A.mC.prototype={
$0(){var s,r,q,p=A.b([],t.V)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q)p.push(A.u(s[q]))
return p},
$S:51}
A.nF.prototype={
$1(a){t.f3.a(a)
return new A.nG(this.a.$1(0),a)},
$S:52}
A.nG.prototype={
$1(a){var s=A.D(this.a.$1(t.X.a(a)))
return s==null?null:this.b.$1(s)},
$S:15}
A.mE.prototype={
$1(a){var s,r
t.X.a(a)
s=this.a.$1(a)
A:{if(t.f.b(s)){r=s.h(0,this.b.$1(a))
break A}r=null
break A}return r},
$S:2}
A.mF.prototype={
$1(a){return t.X.a(a).b.h(0,this.a)},
$S:2}
A.mG.prototype={
$1(a){t.X.a(a)
return a.b.h(0,this.a.$1(a))},
$S:2}
A.mR.prototype={
$1(a){var s,r
t.X.a(a)
s=this.a.$1(a)
A:{if(t.f.b(s)){r=s.J(this.b.$1(a))
break A}r=!1
break A}return r},
$S:1}
A.n1.prototype={
$1(a){return t.X.a(a).b.J(this.a)},
$S:1}
A.nc.prototype={
$1(a){return!t.X.a(a).b.J(this.a)},
$S:1}
A.nn.prototype={
$1(a){return t.X.a(a).b},
$S:54}
A.ny.prototype={
$1(a){return t.X.a(a).b.h(0,"$id")},
$S:2}
A.nB.prototype={
$1(a){return t.X.a(a).f},
$S:2}
A.nC.prototype={
$1(a){t.X.a(a)
return B.h.h(0,this.a)},
$S:2}
A.nD.prototype={
$1(a){return B.h.h(0,this.a.$1(t.X.a(a)))},
$S:2}
A.mH.prototype={
$1(a){var s,r,q,p
t.X.a(a)
s=A.b([],t.s)
for(r=this.a,q=r.length,p=0;p<r.length;r.length===q||(0,A.h)(r),++p)s.push(A.ay(r[p].$1(a)))
return new A.aK(s,t.dA.a(new A.mB()),t.cF).ac(0,"\x1f")},
$S:4}
A.mB.prototype={
$1(a){return A.U(a).length!==0},
$S:41}
A.mI.prototype={
$1(a){var s,r,q,p
t.X.a(a)
s=[]
for(r=this.a,q=r.length,p=0;p<r.length;r.length===q||(0,A.h)(r),++p)s.push(r[p].$1(a))
return s},
$S:55}
A.mJ.prototype={
$1(a){t.X.a(a)
return 0},
$S:11}
A.mK.prototype={
$1(a){var s,r,q,p,o=this.a.$1(t.X.a(a))
A:{s=o instanceof A.cL
r=null
if(s){r=o.c
q=r
q=typeof q=="string"}else q=!1
if(q){p=s?r:o.c
if(p==null)p=A.U(p)
q=p
break A}q="en"
break A}return q},
$S:4}
A.mL.prototype={
$1(a){var s=a.r,r=s==null?null:s.$0()
if(r!=null){s=a.c
s=s!=="Polygon"&&this.a.hL(r,s==="LineString")}else s=!1
return s},
$S:1}
A.mM.prototype={
$1(a){var s=a.r,r=s==null?null:s.$0()
return r==null?null:this.a.hw(r,a.c)},
$S:15}
A.mN.prototype={
$1(a){return A.pi(this.a.$1(t.X.a(a)))},
$S:4}
A.mO.prototype={
$1(a){var s=A.rf(this.a.$1(t.X.a(a)))
return s==null?null:A.b([s.a*255,s.b*255,s.c*255,s.d],t.n)},
$S:57}
A.mP.prototype={
$1(a){var s,r,q,p,o,n,m,l,k
t.X.a(a)
s=this.a.$1(a)
r=typeof s=="string"
if(r)q=A.a1(new A.ar(s),t.J.i("f.E"))
else q=s
if(!t.j.b(q))return null
p=J.n(q)
o=p.gj(q)
n=new A.nE(o)
m=n.$2(this.b.$1(a),0)
l=this.c
k=p.I(q,m,Math.max(m,A.xh(n.$2(l==null?null:l.$1(a),o))))
return r?A.dy(J.dX(k,t.S),0,null):k},
$S:2}
A.nE.prototype={
$2(a,b){var s=A.D(a),r=s==null?null:B.c.K(s)
if(r==null)r=b
if(r<0)r+=this.a
return B.b.E(r,0,this.a)},
$S:58}
A.mQ.prototype={
$1(a){var s,r,q,p,o,n,m,l,k,j=null
t.X.a(a)
s=this.a.$1(a)
r=this.b.$1(a)
q=this.c
p=q==null
o=A.D(p?j:q.$1(a))
o=o==null?j:B.c.K(o)
if(o==null)o=0
n=Math.max(0,o)
if(typeof s=="string"){m=A.a1(new A.ar(s),t.J.i("f.E"))
q=A.dy(A.aS(m,0,A.cf(n,"count",t.S),A.M(m).c),0,j)
if(A.H(r))p=A.t(r)
else p=r==null?"null":A.ay(r)
l=B.d.aO(s,p,q.length)
return l<0?-1:new A.ar(B.d.a5(s,0,l)).gj(0)}if(t.j.b(s)){q=A.D(p?j:q.$1(a))
k=q==null?j:B.c.K(q)
if(k==null)k=0
if(k<0)k=Math.max(0,k+J.X(s))
q=J.n(s)
return k>=q.gj(s)?-1:q.aO(s,r,k)}return-1},
$S:28}
A.mS.prototype={
$1(a){return t.X.a(a).a},
$S:11}
A.mT.prototype={
$1(a){return t.X.a(a).c},
$S:4}
A.mU.prototype={
$1(a){return!A.rv(this.a.$1(t.X.a(a)))},
$S:1}
A.mV.prototype={
$1(a){var s,r,q,p,o,n,m,l=this
t.X.a(a)
s=l.a.$1(a)
r=l.b.$1(a)
q=l.c.$1(a)
if(typeof s=="string"&&typeof r=="string"&&q instanceof A.cL){p=q.hq(s,r)
o=l.d
A:{if("=="===o){n=p===0
break A}if("!="===o){n=p!==0
break A}if("<"===o){n=p<0
break A}if("<="===o){n=p<=0
break A}if(">"===o){n=p>0
break A}n=p>=0
break A}return n}m=l.d
B:{if("=="===m){n=J.k(s,r)
break B}if("!="===m){n=!J.k(s,r)
break B}n=A.p7(m,s,r)
break B}return n},
$S:1}
A.mW.prototype={
$1(a){var s,r,q,p
t.X.a(a)
s=J.k(this.a.$1(a),!0)
r=J.k(this.b.$1(a),!0)
q=this.c.$1(a)
A:{if(typeof q=="string"){p=q
break A}p=null
break A}return new A.cL(s,r,p)},
$S:60}
A.mX.prototype={
$1(a){t.X.a(a)
return J.k(this.a.$1(a),this.b.$1(a))},
$S:1}
A.mY.prototype={
$1(a){t.X.a(a)
return!J.k(this.a.$1(a),this.b.$1(a))},
$S:1}
A.mZ.prototype={
$1(a){t.X.a(a)
return A.p7(this.a,this.b.$1(a),this.c.$1(a))},
$S:1}
A.n_.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q].$1(a)
o=!1
if(p!=null){n=J.al(p)
if(!n.C(p,!1))if(!n.C(p,0))if(!n.C(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(!p)return!1}return!0},
$S:1}
A.n0.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q].$1(a)
o=!1
if(p!=null){n=J.al(p)
if(!n.C(p,!1))if(!n.C(p,0))if(!n.C(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(p)return!0}return!1},
$S:1}
A.n2.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q].$1(a)
o=!1
if(p!=null){n=J.al(p)
if(!n.C(p,!1))if(!n.C(p,0))if(!n.C(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(p)return!1}return!0},
$S:1}
A.n3.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=0;q=r+1,p=s.length,q<p;r+=2){if(!(r<p))return A.a(s,r)
p=s[r].$1(a)
o=!1
if(p!=null){n=J.al(p)
if(!n.C(p,!1))if(!n.C(p,0))if(!n.C(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(p){if(!(q<s.length))return A.a(s,q)
return s[q].$1(a)}}return r<p?s[r].$1(a):null},
$S:2}
A.n4.prototype={
$1(a){var s
t.X.a(a)
s=this.a.h(0,this.b.$1(a))
return(s==null?this.c:s).$1(a)},
$S:2}
A.n5.prototype={
$1(a){var s,r,q,p
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q].$1(a)
if(p!=null)return p}return null},
$S:2}
A.n6.prototype={
$1(a){var s,r,q,p,o,n,m,l=this
t.X.a(a)
s=A.D(l.a.$1(a))
if(s==null)return l.b.$1(a)
r=l.b
q=l.d
p=q.length
o=l.c
n=o.length
m=0
for(;;){if(!(m<n&&o[m]<=s))break
if(!(m<p))return A.a(q,m)
r=q[m];++m}return r.$1(a)},
$S:2}
A.n7.prototype={
$1(a){var s,r,q=this.a.$1(t.X.a(a))
A:{if(q instanceof A.ab){s="rgba("+B.c.Y(q.a*255)+","+B.c.Y(q.b*255)+","+B.c.Y(q.c*255)+","+A.ay(q.d)+")"
break A}if(t.j.b(q)){s=B.e.a0(q,null)
break A}if(t.f.b(q)){s=B.e.a0(q,null)
break A}s=A.H(q)
if(s)r=A.t(q)
else r=q==null?"null":A.ay(q)
if(r==="null")s=""
else if(s)s=A.t(q)
else s=q==null?"null":A.ay(q)
break A}return s},
$S:4}
A.n8.prototype={
$1(a){var s,r,q
t.X.a(a)
s=A.D(this.a.$1(a))
if(s==null)return""
r=A.D(this.b.$1(a))
q=r==null?null:B.c.K(r)
if(q==null)q=0
r=A.D(this.c.$1(a))
r=r==null?null:B.c.K(r)
if(r==null)r=3
return A.wp(s,q,Math.max(q,r))},
$S:4}
A.n9.prototype={
$1(a){t.X.a(a)
return A.b(A.ay(this.a.$1(a)).split(A.ay(this.b.$1(a))),t.s)},
$S:61}
A.na.prototype={
$1(a){var s,r
t.X.a(a)
s=this.a.$1(a)
A:{if(t.j.b(s)){r=J.iu(s,A.xr(),t.N).ac(0,A.ay(this.b.$1(a)))
break A}r=""
break A}return r},
$S:4}
A.nb.prototype={
$1(a){var s,r,q,p,o
t.X.a(a)
s=A.b([],t.n)
for(r=this.a,q=r.length,p=0;p<r.length;r.length===q||(0,A.h)(r),++p){o=r[p].$1(a)
if(!(typeof o=="number"))if(typeof o=="string")o=A.N(o)
else if(A.H(o))o=o?1:0
else o=null
s.push(o==null?0:o)}if(s.length<3)return null
r=B.c.W(s[0],360)
q=B.c.E(s[1]/100,0,1)
if(2>=s.length)return A.a(s,2)
o=B.c.E(s[2]/100,0,1)
s=s.length>3?s[3]:1
return A.qE(r/360,q,o,s)},
$S:18}
A.nd.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q].$1(a)
if(p!=null)o=typeof p=="string"&&B.d.aH(p).length===0
else o=!0
if(o)return 0
if(typeof p=="number")n=p
else if(typeof p=="string"){o=A.N(p)
n=o}else{if(A.H(p))o=p?1:0
else o=null
n=o}if(n!=null&&!isNaN(n))return n}return null},
$S:15}
A.ne.prototype={
$1(a){var s,r,q,p,o,n,m
t.X.a(a)
for(s=this.a,r=s.length,q=t.f,p=this.b,o=0;o<s.length;s.length===r||(0,A.h)(s),++o){n=s[o].$1(a)
A:{if("number"===p){m=typeof n=="number"
break A}if("string"===p){m=typeof n=="string"
break A}if("boolean"===p){m=A.H(n)
break A}m=q.b(n)
break A}if(m)return n}return null},
$S:2}
A.nf.prototype={
$1(a){return A.rv(this.a.$1(t.X.a(a)))},
$S:1}
A.ng.prototype={
$1(a){var s,r,q,p
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=A.rf(s[q].$1(a))
if(p!=null)return p}return null},
$S:18}
A.nh.prototype={
$1(a){var s,r=this.a.$1(t.X.a(a))
if(!t.j.b(r))return null
s=this.b
if(s!=null&&J.X(r)!==s)return null
s=this.c
if(s!=null&&s!=="value"&&!J.pO(r,new A.mA(s)))return null
return r},
$S:63}
A.mA.prototype={
$1(a){return A.pi(a)===this.a},
$S:7}
A.ni.prototype={
$1(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=null
t.X.a(a)
s=A.b([],t.eJ)
for(r=this.a,q=r.length,p=t.j,o=t.s,n=0;n<r.length;r.length===q||(0,A.h)(r),++n){m=r[n]
l=m.a
k=m.b
j=m.c
m=j?"":A.ay(l.$1(a))
i=j?A.ay(l.$1(a)):c
h=k.h(0,"font-scale")
h=h==null?c:h.$1(a)
if(!(typeof h=="number"))if(typeof h=="string")h=A.N(h)
else if(A.H(h))h=h?1:0
else h=c
if(h==null)h=1
g=k.h(0,"text-font")
f=g==null?c:g.$1(a)
A:{if(p.b(f)){g=A.b([],o)
for(e=J.G(f);e.m();)g.push(A.t(e.gp()))
break A}g=c
break A}e=k.h(0,"text-color")
e=A.c4(e==null?c:e.$1(a))
d=k.h(0,"vertical-align")
s.push(new A.bu(i,m,h,g,e,A.bk(d==null?c:d.$1(a))))}return new A.bU(s)},
$S:65}
A.nj.prototype={
$1(a){var s,r,q,p
t.X.a(a)
for(s=this.a,r=s.length,q=0,p="";q<s.length;s.length===r||(0,A.h)(s),++q)p+=A.ay(s[q].$1(a))
return p.charCodeAt(0)==0?p:p},
$S:4}
A.nk.prototype={
$1(a){return A.ay(this.a.$1(t.X.a(a))).toUpperCase()},
$S:4}
A.nl.prototype={
$1(a){return A.ay(this.a.$1(t.X.a(a))).toLowerCase()},
$S:4}
A.nm.prototype={
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
if(!(typeof m=="number"))if(typeof m=="string"){p=A.N(m)
m=p}else{if(A.H(m))p=m?1:0
else p=null
m=p}if(m==null)return null
if(o==null)o=m
else{B:{if("+"===s){p=o+m
break B}if("*"===s){p=o*m
break B}if("min"===s){p=Math.min(o,m)
break B}p=Math.max(o,m)
break B}o=p}}return o},
$S:15}
A.no.prototype={
$1(a){return-a},
$S:5}
A.np.prototype={
$1(a){var s,r,q,p
t.X.a(a)
s=A.D(this.a.$1(a))
r=A.D(this.b.$1(a))
if(s==null||r==null)return null
q=this.c
A:{if("-"===q){p=s-r
break A}if("/"===q){p=s/r
break A}if("%"===q){p=B.c.W(s,r)
break A}p=Math.pow(s,r)
break A}return p},
$S:15}
A.nq.prototype={
$1(a){return B.c.a2(a)},
$S:5}
A.nr.prototype={
$1(a){return Math.floor(a)},
$S:5}
A.ns.prototype={
$1(a){return Math.ceil(a)},
$S:5}
A.nt.prototype={
$1(a){return Math.abs(a)},
$S:5}
A.nu.prototype={
$1(a){return Math.log(a)/2.302585092994046},
$S:5}
A.nv.prototype={
$1(a){return Math.log(a)/0.6931471805599453},
$S:5}
A.nw.prototype={
$1(a){var s,r=this.a.$1(t.X.a(a))
if(typeof r=="string")s=new A.ar(r).gj(0)
else s=t.j.b(r)?J.X(r):null
return s},
$S:66}
A.nx.prototype={
$1(a){var s,r,q
t.X.a(a)
s=this.a.$1(a)
r=this.b.$1(a)
if(t.j.b(s))return J.pN(s,r)
if(typeof s=="string"){if(r!=null){if(A.H(r))q=A.t(r)
else q=A.ay(r)
q=B.d.v(s,q)&&s.length!==0}else q=!1
return q}return!1},
$S:1}
A.nz.prototype={
$1(a){var s,r,q
t.X.a(a)
s=this.a.$1(a)
r=A.D(this.b.$1(a))
q=r==null?null:B.c.K(r)
return t.j.b(s)&&q!=null&&q>=0&&q<J.X(s)?J.aP(s,q):null},
$S:67}
A.nA.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
s=A.b([],t.n)
for(r=this.a,q=r.length,p=0;p<r.length;r.length===q||(0,A.h)(r),++p){o=r[p].$1(a)
if(!(typeof o=="number"))if(typeof o=="string")o=A.N(o)
else if(A.H(o))o=o?1:0
else o=null
s.push(o==null?0:o)}r=s.length
if(r<3)return null
q=s[0]
o=s[1]
n=s[2]
s=r>3?s[3]:1
return new A.ab(q/255,o/255,n/255,s)},
$S:18}
A.m_.prototype={
$1(a){return typeof a=="number"},
$S:7}
A.m0.prototype={
$1(a){A.cW(a)
return a<0||a>255},
$S:30}
A.mh.prototype={
$1(a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this
t.X.a(a5)
s=A.D(a4.a.$1(a5))
if(s==null||s<=B.a.gu(a4.b))return B.a.hG(a4.c,a5)
r=a4.b
if(s>=B.a.gS(r))return B.a.hU(a4.c,a5)
q=r.length
p=1
for(;;){if(!(p<q))return A.a(r,p)
o=r[p]
if(!(o<s))break;++p}q=p-1
r=r[q]
n=o-r
m=s-r
if(n===0)l=0
else{r=a4.d
if(r!=null){r=A.wb(r,m/n)
l=r}else{r=a4.e
r=r===1?m/n:(Math.pow(r,m)-1)/(Math.pow(r,n)-1)
l=r}}r=a4.c
if(!(q<r.length))return A.a(r,q)
k=r[q].$1(a5)
if(!(p<r.length))return A.a(r,p)
j=r[p].$1(a5)
if(typeof k=="number"&&typeof j=="number"){if(a4.f&&k>0&&j>0)return k*Math.pow(j/k,l)
return k+(j-k)*l}r=t.j
if(r.b(k)&&r.b(j)&&J.X(k)===J.X(j)){r=A.b([],t.n)
for(q=J.n(k),o=J.n(j),i=0;i<q.gj(k);++i){h=q.h(k,i)
if(!(typeof h=="number"))if(typeof h=="string")h=A.N(h)
else if(A.H(h))h=h?1:0
else h=null
if(h==null)h=0
g=o.h(j,i)
if(!(typeof g=="number"))if(typeof g=="string")g=A.N(g)
else if(A.H(g))g=g?1:0
else g=null
if(g==null)g=0
f=q.h(k,i)
if(!(typeof f=="number"))if(typeof f=="string")f=A.N(f)
else if(A.H(f))f=f?1:0
else f=null
r.push(h+(g-(f==null?0:f))*l)}return r}e=A.c4(k)
d=A.c4(j)
if(e!=null&&d!=null){c=a4.r
A:{if("hcl"===c){k=e.gbl()
j=d.gbl()
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
h=A.qD(r+(j.a-r)*l,q*a5,o*a5,h+(d.d-h)*l)
r=h
break A}if("lab"===c){k=e.gbl()
j=d.gbl()
r=k.a
q=k.b
o=k.c
h=e.d
h=A.qD(r+(j.a-r)*l,q+(j.b-q)*l,o+(j.c-o)*l,h+(d.d-h)*l)
r=h
break A}r=e.a
q=d.a
o=e.b
h=d.b
g=e.c
f=d.c
a3=e.d
a3=new A.ab(r+(q-r)*l,o+(h-o)*l,g+(f-g)*l,a3+(d.d-a3)*l)
r=a3
break A}return r}return k},
$S:2}
A.lX.prototype={
$3(a,b,c){var s=1-a,r=3*s
return r*s*a*b+r*a*a*c+a*a*a},
$S:69}
A.ml.prototype={
$1(a){return a.b.h(0,this.a)},
$S:2}
A.mm.prototype={
$1(a){return a.a},
$S:11}
A.mn.prototype={
$1(a){var s=this.a.$1(t.X.a(a))
return s==null?this.b:s},
$S:2}
A.mo.prototype={
$1(a){var s
if(t.j.b(a)){s=J.n(a)
s=s.gH(a)&&t.f.b(s.gu(a))}else s=!1
return s},
$S:7}
A.mp.prototype={
$1(a){var s=this.a.h(0,this.b.$1(t.X.a(a)))
return s==null?this.c:s},
$S:2}
A.mq.prototype={
$1(a){var s
if(typeof a!="number"){if(t.j.b(a)){s=J.n(a)
s=s.gH(a)&&s.ae(a,new A.mk())}else s=!1
s=s||A.c4(a)!=null}else s=!0
return s},
$S:16}
A.mk.prototype={
$1(a){return typeof a=="number"},
$S:7}
A.mr.prototype={
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
$S:2}
A.ms.prototype={
$1(a){t.X.a(a)
return typeof a.b.h(0,this.a)=="number"?this.b.$1(a):this.c},
$S:2}
A.m1.prototype={
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
$S:2}
A.m2.prototype={
$1(a){return a.a},
$S:11}
A.fu.prototype={}
A.fQ.prototype={
hh(c7,c8,c9,d0,d1,d2,d3,d4,d5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4=this,c5={},c6=t.L
c6.a(c9)
c6.a(d0)
if(d1<d2)return
s=c5.a=-1
r=c4.x
r.b=0
q=A.b([],t.t)
c6=c4.e
p=B.b.N(c6.b,4)
o=c4.r
n=o.b
m=new A.j1(c5,c4,r,q)
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
a2=A.cp(c8,a,(d+b)*2)
if(j){a2=A.y_(a2,d5)
b=a2.length/2|0}for(a=a2.length,a3=0,a4=0;a4<b;a4=a5){a5=a4+1
a6=B.b.W(a5,b)
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
g+=a2[a0]*a3/b}}else if(c5.a>=0)B.a.k(q,B.b.N(r.b,2))
else continue
a0=b*2
a9=new Float64Array(a0)
for(a4=0;a4<b;){a1=a4*2
if(!(a1<a))return A.a(a2,a1)
b0=a2[a1]
a7=a1+1
if(!(a7<a))return A.a(a2,a7)
b1=a2[a7]
r.b3(b0,b1);++a4
a8=B.b.W(a4,b)*2
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
a9[a7]=b0-b2}b4=j?A.y3(a9):null
for(a1=b4!=null,b5=0,a4=0;a4<b;++a4){a7=a4*2
if(!(a7<a0))return A.a(a9,a7)
b6=a9[a7]
a8=a7+1
if(!(a8<a0))return A.a(a9,a8)
b7=a9[a8]
if(b6===0&&b7===0)continue
a6=B.b.W(a4+1,b)
if(!(a7<a))return A.a(a2,a7)
a7=a2[a7]
if(!(a8<a))return A.a(a2,a8)
a8=a2[a8]
b8=a6*2
if(!(b8>=0&&b8<a))return A.a(a2,b8)
b9=a2[b8];++b8
if(!(b8<a))return A.a(a2,b8)
c6.ap(a7,a8,b9,a2[b8])
b8=b6*b6+b7*b7
c0=Math.sqrt(b8)
if(b5+c0>16384)b5=0
a7=B.c.a2(b5*2)
b5+=c0
k.b3(B.c.a2(b5*2)/2,a7/2)
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
l.ap(b8,b9,c1,b4[a7])}else{c2=Math.sqrt(b8)
a7=b6/c2
a8=b7/c2
l.ap(a7,a8,a7,a8)}}}m.$0()
c3=B.b.N(c6.b,4)-p
if(c3===0||f===0)return
if(d4!=null){c6=c4.as
s=B.a.aA(c6,d4)
if(s<0){s=c6.length
B.a.k(c6,d4)}}B.a.k(c4.Q,s)
c6=c4.w
c6.ap(d1,d2,h/f,g/f)
c6.ap(p,c3,n,o.b-n)
o=d3.d
c6.ap(d3.a*o,d3.b*o,d3.c*o,1)},
hF(c7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3=this,c4={},c5=c3.w,c6=c5.b
if(c6===0)return null
for(s=c5.a,r=s.length,q=0,p=0;p<c6;p+=12){o=p+5
if(!(o<r))return A.a(s,o)
o=B.c.K(s[o])
n=p+7
if(!(n<r))return A.a(s,n)
q+=o*6+B.c.K(s[n])}m=new Float32Array(q*11)
c4.a=0
for(c6=c3.r,s=c3.f,r=c3.y,o=c3.z,n=c3.d,l=c3.e,k=c3.Q,p=0;p<c5.b;p+=12){j=c5.a
i=j.length
if(!(p<i))return A.a(j,p)
h=j[p]
g=p+1
if(!(g<i))return A.a(j,g)
f=j[g]
g=p+8
if(!(g<i))return A.a(j,g)
e=j[g]
g=p+9
if(!(g<i))return A.a(j,g)
d=j[g]
g=p+10
if(!(g<i))return A.a(j,g)
c=j[g]
g=p+11
if(!(g<i))return A.a(j,g)
b=B.c.E(B.c.a2(j[g]*255),0,255)
g=B.c.Y(e*255)
j=B.c.Y(d*255)
i=B.c.Y(c*255)
a=B.b.N(p,12)
if(!(a<k.length))return A.a(k,a)
a0=new A.j2(c4,c3,m,g+j*256+i*65536,b,f,h,k[a]+1)
a=p+4
i=c5.a
j=i.length
if(!(a<j))return A.a(i,a)
a1=B.c.K(i[a])
a=p+5
if(!(a<j))return A.a(i,a)
for(j=a1+B.c.K(i[a]),a2=f*n,a3=h*n,a4=a1;a4<j;++a4){i=a4*4
g=l.a
a=g.length
if(!(i>=0&&i<a))return A.a(g,i)
a5=g[i]
a6=i+1
if(!(a6<a))return A.a(g,a6)
a7=g[a6]
a8=i+2
if(!(a8<a))return A.a(g,a8)
a9=g[a8]
b0=i+3
if(!(b0<a))return A.a(g,b0)
b1=g[b0]
if(a5===a9&&a7===b1)continue
g=r.a
a=g.length
if(!(i<a))return A.a(g,i)
b2=g[i]
if(!(a6<a))return A.a(g,a6)
b3=g[a6]
if(!(a8<a))return A.a(g,a8)
b4=g[a8]
if(!(b0<a))return A.a(g,b0)
b5=g[b0]
b0=a4*2
g=o.a
a=g.length
if(!(b0>=0&&b0<a))return A.a(g,b0)
b6=g[b0];++b0
if(!(b0<a))return A.a(g,b0)
b7=g[b0]
a0.$8(a5,a7,f,b2,b3,0,b6,a2)
a0.$8(a9,b1,f,b4,b5,0,b7,a2)
a0.$8(a9,b1,h,b4,b5,1,b7,a3)
a0.$8(a5,a7,f,b2,b3,0,b6,a2)
a0.$8(a9,b1,h,b4,b5,1,b7,a3)
a0.$8(a5,a7,h,b2,b3,1,b6,a3)}j=p+6
i=c5.a
g=i.length
if(!(j<g))return A.a(i,j)
b8=B.c.K(i[j])
j=p+7
if(!(j<g))return A.a(i,j)
for(j=b8+B.c.K(i[j]),a4=b8;a4<j;++a4){i=c6.a
if(!(a4>=0&&a4<i.length))return A.a(i,a4)
i=B.c.K(i[a4])*2
g=s.a
a=g.length
if(!(i>=0&&i<a))return A.a(g,i)
b9=g[i];++i
if(!(i<a))return A.a(g,i)
c0=g[i]
a0.$8(b9,c0,h,0,0,1,b9,c0)}}c1=new Float32Array(A.a2(A.cp(l.a,0,l.b)))
c2=new Float32Array(A.a2(A.cp(c5.a,0,c5.b)))
c5=new Float32Array(A.a2(A.cp(s.a,0,s.b)))
c6=new Float32Array(A.a2(A.cp(c6.a,0,c6.b)))
s=c7>0?A.tY(m,c7):m
r=A.tv(c1,c2)
o=A.a1(c3.as,t.N)
return new A.fu(r,s,o,c3.a,c1,c5,c6,c2)}}
A.j1.prototype={
$0(){var s,r,q,p,o,n,m,l,k,j,i=this,h=i.a
if(h.a<0||i.c.b<6)return
s=i.c
r=i.d
q=A.q4(B.o.I(s.a,0,s.b),r)
p=i.b
o=p.f
n=o.b
m=B.b.N(n,2)
n+=s.b
if(n>o.a.length)o.bk(n)
n=o.a
l=o.b
B.o.Z(n,l,l+s.b,s.a)
o.b=o.b+s.b
for(o=q.length,p=p.r,k=0;k<q.length;q.length===o||(0,A.h)(q),++k){j=q[k]
n=p.b
if(n===p.a.length)p.bk(n+1)
n=p.a
l=p.b++
n.$flags&2&&A.w(n)
if(!(l<n.length))return A.a(n,l)
n[l]=m+j}s.b=0
B.a.aa(r)
h.a=-1},
$S:0}
A.j2.prototype={
$8(a,b,c,d,e,f,g,h){var s,r,q=this,p=q.c,o=q.a,n=o.a,m=o.a=n+1
p.$flags&2&&A.w(p)
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
o.a=r+1
if(!(r<s))return A.a(p,r)
p[r]=q.w},
$S:70}
A.bu.prototype={}
A.bU.prototype={
q(a){var s=this.a,r=A.M(s)
return new A.ao(s,r.i("q(1)").a(new A.j9()),r.i("ao<1,q>")).bE(0)}}
A.j9.prototype={
$1(a){return t.oc.a(a).b},
$S:71}
A.od.prototype={
$1(a){t.oc.a(a)
return a.c===1&&a.d==null&&a.e==null&&a.f==null&&a.a==null},
$S:72}
A.bv.prototype={
d3(a){var s,r,q,p,o,n=this,m=t.f
if(!m.b(a))return
switch(a.h(0,"type")){case"FeatureCollection":s=a.h(0,"features")
if(t.j.b(s))J.oE(s,n.gfc())
break
case"Feature":r=a.h(0,"properties")
q=A.C(t.N,t.O)
if(m.b(r))for(m=r.gag(),m=m.gt(m);m.m();){p=m.gp()
q.n(0,A.t(p.a),p.b)}if(n.b)o=n.c++
else{m=n.a
o=m!=null?q.h(0,m):a.h(0,"id")}q.ar(0,"$id")
if(o!=null)q.n(0,"$id",o)
n.bX(a.h(0,"geometry"),q)
break
default:n.bX(a,B.h)}},
bX(a,b){var s,r,q,p,o,n,m,l=this
t.lb.a(b)
if(!t.f.b(a))return
s=a.h(0,"coordinates")
switch(a.h(0,"type")){case"Point":l.aL(1,b,A.b([A.fR([s])],t.w))
break
case"MultiPoint":if(t.j.b(s))l.aL(1,b,A.b([A.fR(s)],t.w))
break
case"LineString":if(t.j.b(s))l.aL(2,b,A.b([A.fR(s)],t.w))
break
case"MultiLineString":r=t.j
if(r.b(s)){q=A.b([],t.w)
for(p=J.G(s);p.m();){o=p.gp()
if(r.b(o))q.push(A.fR(o))}l.aL(2,b,q)}break
case"Polygon":if(t.j.b(s))l.aL(3,b,l.dk(s))
break
case"MultiPolygon":r=t.j
if(r.b(s)){q=A.b([],t.w)
for(p=J.G(s);p.m();){n=p.gp()
if(r.b(n))B.a.B(q,l.dk(n))}l.aL(3,b,q)}break
case"GeometryCollection":m=a.h(0,"geometries")
if(t.j.b(m))for(r=J.G(m);r.m();)l.bX(r.gp(),b)
break}},
dk(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=A.b([],t.w)
for(s=J.n(a),r=t.j,q=0;q<s.gj(a);++q){p=s.h(a,q)
if(!r.b(p))continue
o=A.fR(p)
n=o.length
if(n<6)continue
if(A.u3(o)>0!==(q===0))for(m=n-2,n=o.$flags|0,l=0;l<m;l+=2,m-=2){k=o[l]
j=l+1
i=o[j]
h=o[m]
n&2&&A.w(o)
o[l]=h
h=m+1
o[j]=o[h]
o[m]=k
o[h]=i}B.a.k(g,o)}return g},
aL(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
t.lb.a(b)
t.lt.a(c)
if(this.e&&a===1){for(s=c.length,r=this.f,q=0;q<c.length;c.length===s||(0,A.h)(c),++q){p=c[q]
for(o=p.length,n=0;n<o;n+=2){m=p[n]
l=n+1
if(!(l<o))return A.a(p,l)
B.a.k(r,new A.aZ(m,p[l],1,b))}}return}for(s=c.length,k=1/0,j=1/0,i=-1/0,h=-1/0,q=0;q<s;++q){p=c[q]
for(r=p.length,n=0;n<r;n+=2){g=p[n]
if(g<k)k=g
if(g>i)i=g
o=n+1
if(!(o<r))return A.a(p,o)
f=p[o]
if(f<j)j=f
if(f>h)h=f}}if(k>i)return
B.a.k(this.d,new A.hZ(a,b,c,k,j,i,h))},
au(a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=B.b.ab(1,a4),c=0.03125/d,b=0.25/d,a=a5/d,a0=a6/d,a1=(a5+1)/d,a2=(a6+1)/d,a3=A.b([],t.fB)
for(s=this.d,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q]
o=p.a===2?b:c
for(n=p.d,m=1+o,l=p.f,k=-o,j=l<=1,i=n>=0,h=0;h<3;++h){g=B.aV[h]
f=g!==0
if(f&&n+g>m)continue
if(f&&l+g<k)continue
if(g<0&&j)continue
if(g>0&&i)continue
this.eR(p,g,d,a5,a6,o,a,a0,a1,a2,a3)}}s=this.r
if(s==null)s=null
else{r=s.b
r===$&&A.v()
s=B.b.E(a4,0,s.a.b+1)
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]}if(s==null)s=B.B
r=s.length
n=t.w
m=a-c
l=a1+c
k=a0-c
j=a2+c
q=0
for(;q<s.length;s.length===r||(0,A.h)(s),++q){e=s[q]
i=e.a
f=!0
if(!(i<m))if(!(i>l)){f=e.b
f=f<k||f>j}if(f)continue
f=new Float64Array(2)
f[0]=B.c.a2((i*d-a5)*4096*2)/2
f[1]=B.c.a2((e.b*d-a6)*4096*2)/2
B.a.k(a3,new A.dF(null,1,e.d,A.b([f],n)))}return a3.length===0?B.a8:A.b([new A.ia(a3)],t.n5)},
eR(a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
t.dg.a(a9)
if(a.f+a0<a5-a4||a.d+a0>a7+a4||a.r<a6-a4||a.e>a8+a4)return
s=A.b([],t.w)
r=a.a
q=r===2?A.b([],t.n):null
for(p=a.c,o=p.length,n=t.n,m=0;m<p.length;p.length===o||(0,A.h)(p),++m){l=p[m]
k=l.length
j=new Float64Array(k)
for(i=0;i<k;i+=2){h=B.c.a2(((l[i]+a0)*a1-a2)*4096*2)
if(!(i<k))return A.a(j,i)
j[i]=h/2
h=i+1
if(!(h<k))return A.a(l,h)
g=B.c.a2((l[h]*a1-a3)*4096*2)
if(!(h<k))return A.a(j,h)
j[h]=g/2}switch(r){case 1:B.a.k(s,j)
break
case 2:f=A.b([],n)
e=A.u4(j,s,f)
for(k=f.length,h=1/e,g=e===0,d=0;d<f.length;f.length===k||(0,A.h)(f),++d){c=f[d]
q.toString
B.a.k(q,g?0:c/e)
B.a.k(q,g?0:h)}break
default:b=A.u5(j)
if(b.length>=6)B.a.k(s,b)}}if(s.length!==0)B.a.k(a9,new A.dF(q,r,a.b,s))}}
A.je.prototype={
$0(){var s=this.a,r=s.a
if(r.length>=4){B.a.k(this.b,new Float64Array(A.a2(r)))
B.a.k(this.c,s.b)}s.a=A.b([],t.n)},
$S:0}
A.jd.prototype={
$2(a,b){var s,r=this.a
if(!r.c)return
if(a===0){if(b<0)r.c=!1
return}s=b/a
if(a<0){if(s>r.b)r.c=!1
else if(s>r.a)r.a=s}else if(s<r.a)r.c=!1
else if(s<r.b)r.b=s},
$S:73}
A.jf.prototype={
$2(a,b){var s,r=this.a
A:{if(0===r){s=a>=-128
break A}if(1===r){s=a<=4224
break A}if(2===r){s=b>=-128
break A}s=b<=4224
break A}return s},
$S:13}
A.hZ.prototype={}
A.ia.prototype={
gaB(){return""},
gcm(){return 4096},
$idz:1,
gbA(){return this.a}}
A.dF.prototype={
bv(a){return this.c},
cu(a){var s,r,q,p,o,n,m,l,k
for(s=this.d,r=s.length,q=a.c,p=0;p<s.length;s.length===r||(0,A.h)(s),++p){o=s[p]
B.a.k(q,a.b>>>1)
for(n=o.length,m=0;m<n;m+=2){l=o[m]
k=m+1
if(!(k<n))return A.a(o,k)
a.c8(l,o[k])}}B.a.k(q,a.b>>>1)},
$ieO:1,
gL(){return this.b}}
A.oc.prototype={
$1(a){var s,r,q
for(s=a+1,r=this.a;s<r.length;++s){q=B.Q.h(0,r[s])
if((q==null?0:q)!==1)return s}return null},
$S:75}
A.ji.prototype={
i5(a){var s,r,q
t.bF.a(a)
s=B.a.ac(a,"\x01")
r=this.e
q=r.h(0,s)
if(q==null){q=new A.jk(this,a).$0()
r.n(0,s,q)
r=q}else r=q
return r},
gj(a){return this.c.length},
hH(a,b){var s=A.u7(b),r=this.f,q=a*1000+s,p=r.h(0,q)
if(p==null){p=new A.jj(this,a,s).$0()
r.n(0,q,p)
r=p}else r=p
return r}}
A.jk.prototype={
$0(){var s,r,q,p,o,n,m,l=A.b([],t.t)
for(s=this.b,r=s.length,q=this.a,p=q.c,q=q.d,o=0;o<s.length;s.length===r||(0,A.h)(s),++o){n=A.q7(s[o])
for(m=0;m<p.length;++m){if(!(m<q.length))return A.a(q,m)
if(q[m]===n&&!B.a.v(l,m))B.a.k(l,m)}}for(m=0;m<p.length;++m)if(!B.a.v(l,m))B.a.k(l,m)
return l},
$S:76}
A.jj.prototype={
$0(){var s,r=this.a.c,q=this.b
if(!(q>=0&&q<r.length))return A.a(r,q)
s=r[q]
r=s.a
if(!r.c.J(1719034226))return s
q=t.i
return new A.c3(r,A.oR(t.H.a(s.i4(A.en(["wght",this.c],t.N,q))),q))},
$S:77}
A.ke.prototype={}
A.lY.prototype={
$2(a,b){return A.cW(a)+A.cW(b)},
$S:32}
A.oe.prototype={
$0(){var s,r,q,p,o=this
if(!o.b){s=o.c
s=s==1/0||s==-1/0}else s=!0
r=o.d
q=o.a
p=q.a
if(s)B.a.k(r,p)
else B.a.B(r,A.wc(o.e,p,o.f,o.r,o.c,o.w))
q.a=A.b([],t.t)},
$S:0}
A.mj.prototype={
$2(a,b){return Math.max(A.cW(a),t.hT.a(b).b)},
$S:79}
A.bz.prototype={}
A.id.prototype={
D(){var s,r,q,p,o,n
for(s=this.a,r=s.length,q=0,p=0;;){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
p=(p|B.b.ai(n&127,q))>>>0
if(n<128)return p
q+=7}},
e0(){var s=this,r=s.D(),q=s.b,p=q+r
s.b=p
return new A.id(s.a,q,p)},
T(a,b){var s,r=this
switch(b){case 0:r.D()
break
case 1:r.b+=8
break
case 2:s=r.D()
r.b+=s
break
case 5:r.b+=4
break
default:throw A.e(A.j8("glyph pbf: wire type "+b,null,null))}}}
A.jl.prototype={
hA(a){var s=B.a.ac(t.bF.a(a),",")
return this.f.b7(s,new A.jm(this,s))},
i9(a,b){var s,r,q,p,o,n,m
for(s=new A.dw(b),r=this.w,q=this.x,p=a<<16,o=!0;s.m();){n=B.b.M(s.d,8)
m=(p|n)>>>0
if(q.v(0,m))continue
if(r.k(0,m))this.bj(a,n,m)
o=!1}return o},
bj(a,b,a0){var s=0,r=A.aw(t.o),q,p=2,o=[],n=this,m,l,k,j,i,h,g,f,e,d,c
var $async$bj=A.ax(function(a1,a2){if(a1===1){o.push(a2)
s=p}for(;;)switch(s){case 0:e=n.e
d=a-512
if(!(d>=0&&d<e.length)){q=A.a(e,d)
s=1
break}e=A.vZ(2,e[d],B.y,!1)
e=A.pw(n.a,"{fontstack}",e)
j=b*256
m=A.pw(e,"{range}",""+j+"-"+(j+255))
l=B.cy
p=4
e=n.y
if(e==null)e=n.y=new A.ex()
s=7
return A.Y(e.bc(m,n.c),$async$bj)
case 7:k=a2
if(k.a===200)l=A.u9(k.b)
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
h.n(0,f.a,f)}n.x.k(0,a0)
n.d.$2(a,l)
case 1:return A.au(q,r)
case 2:return A.at(o.at(-1),r)}})
return A.av($async$bj,r)}}
A.jm.prototype={
$0(){var s=this.a,r=s.e
B.a.k(r,this.b)
B.a.k(s.r,A.C(t.S,t.jv))
return 512+r.length-1},
$S:8}
A.jo.prototype={
cB(){var s,r,q,p,o,n=this,m=n.d
m=J.pL(B.S.gaq(m),m.byteOffset,m.length)
s=A.b([],t.dO)
for(r=n.e,q=r.length,p=0;p<r.length;r.length===q||(0,A.h)(r),++p){o=r[p]
s.push([o.a,o.b])}return[n.c,m,s,n.f,n.b,n.a]}}
A.jp.prototype={
$1(a){return B.b.E(B.c.Y(a*128),-2048,2047)+2048},
$S:21}
A.jI.prototype={}
A.es.prototype={$idz:1,
gaB(){return this.a},
gcm(){return this.b},
gbA(){return this.e}}
A.er.prototype={
bv(a){var s,r,q,p,o,n,m,l,k=this
t.dl.a(a)
s=A.C(t.N,t.O)
r=k.c
if(r!=null)s.n(0,"$id",r)
r=k.e
q=new A.cd(k.a,k.d,r)
for(p=a.c,o=a.d;q.b<r;){n=q.D()
m=q.D()
if(!(n<p.length))return A.a(p,n)
l=p[n]
if(!(m<o.length))return A.a(o,m)
s.n(0,l,o[m])}return s},
cu(a){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=h.r,f=new A.cd(h.a,h.f,g),e=h.b===1
if(e)B.a.k(a.c,a.b>>>1)
for(s=!e,r=a.c,q=0,p=0;f.b<g;){o=f.D()
n=o&7
m=o>>>3
if(n===1)for(l=0;l<m;++l){k=f.D()
j=f.D()
i=k>>>1
q+=(k&1)===0?i:-i-1
i=j>>>1
p+=(j&1)===0?i:-i-1
if(s)B.a.k(r,a.b>>>1)
a.c8(q,p)}else if(n===2)for(l=0;l<m;++l){k=f.D()
j=f.D()
i=k>>>1
q+=(k&1)===0?i:-i-1
i=j>>>1
p+=(j&1)===0?i:-i-1
a.c8(q,p)}}B.a.k(r,a.b>>>1)},
$ieO:1,
gL(){return this.b}}
A.fS.prototype={
c8(a,b){var s,r,q=this,p=q.b,o=q.a,n=o.length
if(p+2>n){s=new Float64Array(n*2)
B.o.Z(s,0,p,o)
q.a=s
p=s}else p=o
o=q.b
n=q.b=o+1
p.$flags&2&&A.w(p)
r=p.length
if(!(o<r))return A.a(p,o)
p[o]=a
q.b=n+1
if(!(n<r))return A.a(p,n)
p[n]=b}}
A.cd.prototype={
D(){var s,r,q,p,o,n,m
for(s=this.a,r=s.length,q=0,p=0;p<28;p+=7){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
q=(q|B.b.ai(n&127,p))>>>0
if(n<128)return q}for(m=268435456;;){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
q+=(n&127)*m
if(n<128)return q
m*=128}},
bL(){var s=this,r=s.D(),q=s.b,p=B.y.dS(A.hJ(s.a,q,q+r))
s.b+=r
return p},
T(a,b){var s=this
switch(b){case 0:s.D()
break
case 1:s.b+=8
break
case 2:s.b=s.b+s.D()
break
case 5:s.b+=4
break}}}
A.hg.prototype={
c1(a){var s,r,q,p,o,n,m,l,k,j=this
if(!t.f.b(a))return
s=a.h(0,"coordinates")
switch(a.h(0,"type")){case"FeatureCollection":r=a.h(0,"features")
if(t.j.b(r))J.oE(r,j.gdj())
break
case"Feature":j.c1(a.h(0,"geometry"))
break
case"GeometryCollection":q=a.h(0,"geometries")
if(t.j.b(q))J.oE(q,j.gdj())
break
case"Point":B.a.B(j.a,A.jQ([s]))
break
case"MultiPoint":B.a.B(j.a,A.jQ(s))
break
case"LineString":B.a.k(j.b,A.jQ(s))
break
case"MultiLineString":if(t.j.b(s))B.a.B(j.b,J.iu(s,A.pt(),t.H))
break
case"Polygon":if(t.j.b(s)){p=J.iu(s,A.pt(),t.H)
p=A.a1(p,p.$ti.i("a_.E"))
B.a.k(j.c,p)}break
case"MultiPolygon":p=t.j
if(p.b(s))for(o=J.G(s),n=j.c,m=t.H;o.m();){l=o.gp()
if(p.b(l)){k=J.iu(l,A.pt(),m)
k=A.a1(k,k.$ti.i("a_.E"))
B.a.k(n,k)}}break}},
hL(a,b){var s,r,q,p,o,n,m,l=this
t.x.a(a)
s=J.Z(a)
if(s.ae(a,new A.jT())||l.c.length===0)return!1
for(r=s.gt(a);r.m();){q=r.gp()
for(p=J.n(q),o=0;o<p.gj(q);o+=2){n=p.h(q,o)
m=p.h(q,o+1)
if(!(l.c3(n,m)||l.c3(n+360,m)||l.c3(n-360,m)))return!1}}if(!b)return!0
for(s=s.gt(a);s.m();)if(!l.eQ(s.gp()))return!1
return!0},
eQ(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
t.H.a(a)
for(s=J.n(a),r=this.c,q=0;p=q+3,p<s.gj(a);q=m)for(o=r.length,n=q+1,m=q+2,l=0;l<r.length;r.length===o||(0,A.h)(r),++l)for(k=B.a.gt(r[l]);k.m();){j=k.gp()
for(i=J.n(j),h=0;g=h+3,g<i.gj(j);h=f){f=h+2
if(A.uO(s.h(a,q),s.h(a,n),s.h(a,m),s.h(a,p),i.h(j,h),i.h(j,h+1),i.h(j,f),i.h(j,g)))return!1}}return!0},
c3(a,b){var s,r,q,p,o,n,m,l,k
for(s=this.c,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q)for(p=B.a.gt(s[q]);p.m();){o=p.gp()
for(n=J.n(o),m=0;l=m+3,l<n.gj(o);m=k){k=m+2
if(A.hh(a,b,n.h(o,m),n.h(o,m+1),n.h(o,k),n.h(o,l))===0)return!1}}return this.di(a,b)},
di(a,b){var s,r,q,p,o
for(s=this.c,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){for(p=B.a.gt(s[q]),o=!1;p.m();)if(A.qu(a,b,p.gp()))o=!o
if(o)return!0}return!1},
hw(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=this
t.x.a(a1)
s=t.n
r=A.b([],s)
for(q=J.Z(a1),p=q.gt(a1);p.m();)B.a.B(r,p.gp())
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
p.push(A.b([h,j[e]],s))}B.a.B(p,a0.b)
for(s=a0.c,j=s.length,d=0;d<s.length;s.length===j||(0,A.h)(s),++d)B.a.B(p,s[d])
for(k=0;s=r.length,k<s;k+=2){j=r[k]
i=k+1
if(!(i<s))return A.a(r,i)
if(a0.di(j,r[i]))return 0}if(a2==="Polygon")for(s=p.length,d=0;d<p.length;p.length===s||(0,A.h)(p),++d){c=p[d]
for(r=J.n(c),k=0;k+1<r.gj(c);k+=2)if((q.cD(a1,new A.jS(c,k)).gj(0)&1)===1)return 0}for(s=J.G(g),b=1/0;s.m();){r=s.gp()
for(q=p.length,d=0;d<p.length;p.length===q||(0,A.h)(p),++d){a=A.uN(r,p[d],l)
if(a<b)b=a}}return b*m}}
A.jT.prototype={
$1(a){return J.d_(t.H.a(a))},
$S:25}
A.jP.prototype={
$6(a,b,c,d,e,f){return(c-a)*(f-b)-(d-b)*(e-a)},
$S:24}
A.jS.prototype={
$1(a){var s,r,q
t.H.a(a)
s=this.a
r=this.b
q=J.n(s)
return A.qu(q.h(s,r),q.h(s,r+1),a)},
$S:25}
A.jR.prototype={
$6(a,b,c,d,e,f){return(c-a)*(f-b)-(d-b)*(e-a)},
$S:24}
A.cF.prototype={}
A.jt.prototype={
q(a){return"HTTP "+this.a+" for "+this.b}}
A.ex.prototype={
cG(a,b,c){return new A.jK(t.pp.a(b),a).$0().ik(c)},
bc(a,b){return this.cG(a,b,B.aA)}}
A.jK.prototype={
$0(){var s=0,r=A.aw(t.mk),q,p=this,o,n,m,l
var $async$$0=A.ax(function(a,b){if(a===1)return A.at(b,r)
for(;;)switch(s){case 0:m=v.G
l=A.aV(new m.Headers())
p.a.a3(0,new A.jJ(l))
s=3
return A.Y(A.pv(A.aV(m.fetch(p.b,{headers:l})),t.m),$async$$0)
case 3:o=b
s=4
return A.Y(A.pv(A.aV(o.arrayBuffer()),t.eb),$async$$0)
case 4:n=b
q=new A.cF(A.E(o.status),A.oU(n,0,null))
s=1
break
case 1:return A.au(q,r)}})
return A.av($async$$0,r)},
$S:125}
A.jJ.prototype={
$2(a,b){A.U(a)
A.U(b)
if(!B.di.v(0,a.toLowerCase()))this.a.append(a,b)},
$S:84}
A.j4.prototype={
i8(a,b){return A.p(A.as("A browser cannot read the file "+this.a))}}
A.mx.prototype={
$1(a){return A.aV(a)===this.a},
$S:85}
A.jU.prototype={
gdn(){var s=this.a
return B.d.av(s,"http://")||B.d.av(s,"https://")},
au(a,b,a0){var s=0,r=A.aw(t.p),q,p=this,o,n,m,l,k,j,i,h,g,f,e,d,c
var $async$au=A.ax(function(a1,a2){if(a1===1)return A.at(a2,r)
for(;;)switch(s){case 0:f=p.r
s=3
return A.Y(f==null?p.r=p.aM():f,$async$au)
case 3:e=a2
if(a<e.f||a>e.r){q=new Uint8Array(0)
s=1
break}o=A.uR(a,b,a0)
n=e.a
f=p.w,m=e.b,l=e.d,k=A.r(f).i("an<1>"),j=0
case 4:if(!(j<4)){s=6
break}i=A.uQ(n,o)
if(i==null){q=new Uint8Array(0)
s=1
break}h=i.b
s=h>0?7:8
break
case 7:if(o>=i.a+h){q=new Uint8Array(0)
s=1
break}d=A
s=9
return A.Y(p.aE(e.c+i.c,i.d),$async$au)
case 9:q=d.eA(a2,e.e)
s=1
break
case 8:h=i.c
n=f.h(0,h)
s=n==null?10:11
break
case 10:d=A
c=A
s=13
return A.Y(p.aE(m+h,i.d),$async$au)
case 13:s=12
return A.Y(c.eA(a2,l),$async$au)
case 12:n=d.qw(a2)
f.n(0,h,n)
case 11:if(f.a>48){g=new A.an(f,k).gt(0)
if(!g.m())A.p(A.aG())
f.ar(0,g.gp())}case 5:++j
s=4
break
case 6:q=new Uint8Array(0)
s=1
break
case 1:return A.au(q,r)}})
return A.av($async$au,r)},
aM(){var s=0,r=A.aw(t.iM),q,p=this,o,n,m,l,k,j,i,h,g,f,e,d
var $async$aM=A.ax(function(a,b){if(a===1)return A.at(b,r)
for(;;)switch(s){case 0:s=3
return A.Y(p.aE(0,16384),$async$aM)
case 3:h=b
g=h.length
f=!0
if(g>=127)if(A.dy(B.j.I(h,0,7),0,null)==="PMTiles"){if(7>=g){q=A.a(h,7)
s=1
break}f=h[7]!==3}if(f)throw A.e(B.aN)
f=new A.jW(A.oH(h,0,null))
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
case 5:b=A.hJ(h,o,l)
s=6
break
case 7:s=8
return A.Y(p.aE(o,n),$async$aM)
case 8:case 6:s=4
return A.Y(d.eA(b,m),$async$aM)
case 4:l=e.qw(b)
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
break}q=new A.i5(l,k,f,m,j,i,h[101])
s=1
break
case 1:return A.au(q,r)}})
return A.av($async$aM,r)},
aE(a,b){var s=0,r=A.aw(t.p),q,p=this,o,n,m,l,k,j
var $async$aE=A.ax(function(c,d){if(c===1)return A.at(d,r)
for(;;)switch(s){case 0:if(!p.gdn()){o=p.f
q=(o==null?p.f=new A.j4(p.a):o).i8(a,b)
s=1
break}o=p.d
n=p.a
m=t.N
m=A.uv(p.c,m,m)
l=a+b
m.n(0,"range","bytes="+a+"-"+(l-1))
m.n(0,"accept-encoding","identity")
s=3
return A.Y(o.cG(n,m,B.aB),$async$aE)
case 3:k=d
o=k.a
if(o!==206&&o!==200)throw A.e(A.qc(o,n))
j=k.b
q=o===200&&j.length>b?A.hJ(j,a,B.b.E(l,0,j.length)):j
s=1
break
case 1:return A.au(q,r)}})
return A.av($async$aE,r)}}
A.jW.prototype={
$1(a){var s=this.a
return s.getUint32(a,!0)+s.getUint32(a+4,!0)*4294967296},
$S:14}
A.jV.prototype={
$0(){var s,r,q,p,o,n,m
for(s=this.b,r=this.a,q=s.length,p=0,o=1;;){n=r.a++
if(!(n<q))return A.a(s,n)
m=s[n]
p+=(m&127)*o
if(m<128)return p
o*=128}},
$S:8}
A.i5.prototype={}
A.eY.prototype={
gj(a){return this.d}}
A.la.prototype={}
A.cb.prototype={}
A.l9.prototype={
$0(){var s,r=this.a,q=J.n(r),p=q.h(r,2)
p.toString
A.E(p)
s=q.h(r,3)
s.toString
A.E(s)
r=q.h(r,4)
r.toString
return new A.b7(p,s,A.E(r),0)},
$S:86}
A.l8.prototype={
$1(a){var s=J.aP(this.a,a)
s.toString
return A.ae(s)},
$S:17}
A.e1.prototype={}
A.ed.prototype={}
A.bR.prototype={
an(){return"ClusterQuestion."+this.b}}
A.dZ.prototype={}
A.aE.prototype={}
A.hH.prototype={}
A.hE.prototype={
bb(){return[this.a,"built",this.c.cB()]}}
A.hG.prototype={
bb(){return[this.a,"failed",this.c]}}
A.ec.prototype={
bb(){var s,r,q,p,o=A.b([],t.dO)
for(s=this.b,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q]
o.push([p.a,p.b,p.c,p.d,p.e])}return[this.a,"found",o]}}
A.e3.prototype={
bb(){return[this.a,"zoom",this.b]}}
A.d9.prototype={
bb(){var s,r,q,p,o,n=A.b([],t.bo)
for(s=this.b,r=s.length,q=t.G,p=0;p<s.length;s.length===r||(0,A.h)(s),++p){o=s[p]
n.push(A.b([o.a,o.b,o.c],q))}return[this.a,"members",n]}}
A.fA.prototype={}
A.hF.prototype={}
A.om.prototype={
$2(a,b){var s=this.a
return s>=a&&s<b},
$S:13}
A.nP.prototype={
$2(a,b){var s=this
return a>=s.a&&a<=s.b&&b>=s.c&&b<=s.d},
$S:13}
A.nN.prototype={
$8(a,b,c,d,e,f,g,h){var s=new A.nO(),r=s.$6(e,f,g,h,a,b),q=s.$6(e,f,g,h,c,d),p=s.$6(a,b,c,d,e,f),o=s.$6(a,b,c,d,g,h)
return r>0!==q>0&&p>0!==o>0},
$S:88}
A.nO.prototype={
$6(a,b,c,d,e,f){return(c-a)*(f-b)-(d-b)*(e-a)},
$S:24}
A.bh.prototype={}
A.fW.prototype={}
A.hI.prototype={}
A.hf.prototype={}
A.fV.prototype={}
A.e5.prototype={
q(a){var s=this
return A.t(s.a)+","+A.t(s.b)+","+A.t(s.c)+","+A.t(s.d)}}
A.fB.prototype={}
A.hD.prototype={}
A.on.prototype={
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
B.a.k(a5,s)
B.a.k(a5,r)
return}q/=m
p/=m
o/=l
n/=l
k=q*o+p*n
if(Math.abs(k)>Math.cos(0.08726646259971647)){a5=a4.b
B.a.k(a5,s)
B.a.k(a5,r)
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
a0=Math.max(2,B.c.bz(Math.abs(a)/0.5235987755982988-0.000001))
for(a5=a4.b,a1=0;a1<=a0;++a1){a2=a*a1/a0
a9=Math.cos(a2)
a3=Math.sin(a2)
B.a.k(a5,i+e*a9-d*a3)
B.a.k(a5,h+e*a3+d*a9)}},
$S:38}
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
i.$flags&2&&A.w(i)
j=i.length
if(!(c<j))return A.a(i,c)
i[c]=g
g=c+1
h=h?0:m/k
if(!(g<j))return A.a(i,g)
i[g]=h},
$S:38}
A.kZ.prototype={}
A.lC.prototype={
gaS(){var s,r=this.d.h(0,A.t(this.b)+"-translate")
A:{if(r==null){s=null
break A}s=A.u(r)
break A}return s}}
A.fg.prototype={}
A.hw.prototype={
fa(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=A.C(t.S,t.nY)
for(s=A.qd(this.x,0,t.kY),r=J.G(s.a),q=s.b,s=new A.bx(r,q,A.r(s).i("bx<1>")),p=this.Q,o=this.r;s.m();){n=s.c
n=n>=0?new A.z(q+n,r.gp()):A.p(A.aG())
m=n.b
if(!(m instanceof A.bf)||m.dx)continue
l=m.b
k=o.length
if(!(l>=0&&l<k))return A.a(o,l)
j=o[l]
for(l=p.length,i=m.d,h=j.c,g=j.d,f=0;f<l;++f){e=p[f]
d=e.b
if(!(d>=0&&d<k))return A.a(o,d)
c=o[d]
if(i!==e.d||h!==c.c||g!==c.d)continue
b.n(0,n.a,e)
j.cy=Math.max(j.cy,i+1)
break}}return b},
hr(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7=this,b8=null,b9="url",c0="attribution",c1=b7.a,c2=c1.a
c1=c1.$ti.i("4?")
s=t.g.a(c1.a(c2.h(0,"layers")))
s=J.G(s==null?B.cB:s)
r=t.f
q=b7.geu()
p=b7.gey()
o=b7.ger()
n=b7.gew()
m=b7.geD()
l=b7.at
k=b7.x
j=b7.as
i=b7.z
h=b7.ay
while(s.m()){g=s.gp()
if(!r.b(g))continue
f=A.vF(g)
if(J.k(f.e.h(0,"visibility"),"none"))continue
e=f.b
A:{if("symbol"===e){d=m
break A}if("heatmap"===e){d=n
break A}if("circle"===e){d=o
break A}if("line"===e){d=p
break A}if("fill"===e||"fill-extrusion"===e){d=q
break A}d=b8
break A}if(d!=null){c=k.length
b=b7.h8(f)
if(b!=null)d.$1(b)
if(J.k(e,"symbol")){b7.ch=k.length
b7.CW=new A.z(j.length,i.length)}a=f.d.h(0,A.t(e)+"-layer-opacity")
if(a!=null){a0=A.u(a)
for(a1=c;a1<k.length;++a1)h.n(0,a1,a0)}}else{d=J.al(e)
if(d.C(e,"background")){a2=f.d
a3=a2.h(0,"background-pattern")
B.a.k(l,new A.z(k.length,new A.c8(-1,j.length,-1,0)))
A.K(a2.h(0,"background-color"),"#000000")
A.K(a2.h(0,"background-opacity"),1)
if(a3!=null)A.fm(a3)
B.a.k(j,new A.ft())}else if(d.C(e,"raster")||d.C(e,"hillshade")||d.C(e,"color-relief"))b7.eC(f)}}a4=b7.fS()
a5=c1.a(c2.h(0,"sprite"))
b7.fa()
b7.h7()
if(c1.a(c2.h(0,"sky"))!=null){a6=c1.a(c2.h(0,"sky"))
a6=r.b(a6)?a6:B.ac
s=a6.h(0,"sky-color")
A.u(s==null?"#88C6FC":s)
s=a6.h(0,"horizon-color")
A.u(s==null?"#ffffff":s)
s=a6.h(0,"sky-horizon-blend")
A.u(s==null?0.8:s)
s=a6.h(0,"fog-color")
A.u(s==null?"#ffffff":s)
s=a6.h(0,"fog-ground-blend")
A.u(s==null?0.5:s)
s=a6.h(0,"horizon-fog-blend")
A.u(s==null?0.8:s)
s=a6.h(0,"atmosphere-blend")
A.u(s==null?0.8:s)}s=A.qM(c1.a(c2.h(0,"projection")))
q=A.tZ(c1.a(c2.h(0,"light")))
b7.fj(a4)
B:{p=typeof a5=="string"
if(p)break B
a7=b8
a8=b8
a9=!1
o=!1
if(t.j.b(a5)){n=J.n(a5)
b0=n.gj(a5)>=1
if(b0){a7=n.h(a5,0)
a9=r.b(a7)
if(a9){t.d.a(a7)
a8=a7.h(0,b9)
n=a8
if(n==null){t.d.a(a7)
n=a7.J(b9)}else n=!0
if(n)o=typeof a8=="string"}}}else b0=!1
if(o){if(a9)o=a8
else{o=b0?a7:J.aP(a5,0)
a8=t.d.a(o).h(0,b9)
o=a8}A.U(o)
break B}break B}o=A.b([],t.m_)
if(p)o.push(new A.z("",a5))
if(t.j.b(a5))for(p=J.G(a5);p.m();){b1=p.gp()
b2=b8
b3=!1
b4=b8
n=!1
if(r.b(b1)){b5=b1.h(0,"id")
if(b5==null)m=b1.J("id")
else m=!0
if(m){b3=typeof b5=="string"
if(b3){b2=b1.h(0,b9)
if(b2==null)m=b1.J(b9)
else m=!0
if(m)n=typeof b2=="string"
b4=b5}}}if(n){b6=A.U(b3?b2:b1.h(0,b9))
o.push(new A.z(b4==="default"?"":A.t(b4)+":",b6))}}c1=A.bk(c1.a(c2.h(0,"glyphs")))
c2=A.b3(t.N)
for(p=b7.d.gaI(),p=p.gt(p);p.m();){b1=p.gp()
if(r.b(b1)&&typeof b1.h(0,c0)=="string")c2.k(0,A.U(b1.h(0,c0)))}A.a1(c2,c2.$ti.c)
return new A.kC(q,s,b7.r,k,b7.y,b7.e,b7.c,o,c1)},
h8(a){var s,r,q,p=a.c,o=this.h0(p.h(0,"source"))
if(o==null)return null
s=p.h(0,"source-layer")
r=typeof s=="string"
if(!r){q=this.e
if(o>>>0!==o||o>=q.length)return A.a(q,o)
q=!(q[o] instanceof A.bX)}else q=!1
if(q)return null
r=r?s:""
return new A.fg(a,o,r,p.h(0,"filter"))},
h0(a){return this.f.b7(a,new A.ky(this,a))},
eC(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=null,d=a.d,c=f.d.h(0,a.c.h(0,"source"))
if(!t.f.b(c))return
if(d.ga4().aF(0,B.af.gdR(B.af))){A.K(d.h(0,"raster-hue-rotate"),0)
A.K(d.h(0,"raster-saturation"),0)
A.K(d.h(0,"raster-contrast"),0)
A.K(d.h(0,"raster-brightness-min"),0)
A.K(d.h(0,"raster-brightness-max"),1)}J.k(d.h(0,"raster-resampling"),"nearest")
s=d.h(0,"resampling")
if(s!=null)A.u(s)
A.K(d.h(0,"raster-opacity"),1)
r=A.bk(c.h(0,"url"))
q=A.py(c.h(0,"tiles"))
p=A.D(c.h(0,"tileSize"))
if(p==null)p=512
s=A.D(c.h(0,"maxzoom"))
o=s==null?e:B.c.K(s)
n=a.b
m=c.h(0,"type")
A:{l="raster"===n
s=l
if(s){s="image"===m
k=m
j=!0}else{k=e
j=!1
s=!1}i=e
if(s){B:{if(A.ve(c.h(0,"coordinates"))!=null)s=r!=null
else s=!1
if(s){s=new A.fW()
break B}s=i
break B}break A}if(l){if(j)s=k
else{s=m
k=s
j=!0}s="raster"===s}else s=!1
if(s){A.eN(c)
s=new A.hf()
break A}h="hillshade"===n
g=e
if(h){if(j)s=k
else{s=m
k=s
j=!0}g="raster-dem"===s
s=g}else s=!1
if(s){A.u(1)
A.eN(c)
J.k(c.h(0,"encoding"),"terrarium")
A.K(d.h(0,"hillshade-exaggeration"),0.5)
A.u("#000000")
A.u("#ffffff")
A.qJ(d.h(0,"hillshade-shadow-color"),"#000000")
A.qJ(d.h(0,"hillshade-highlight-color"),"#ffffff")
s=d.h(0,"hillshade-accent-color")
if(s!=null)A.u(s)
s=d.h(0,"hillshade-method")
A.t(s==null?"standard":s)
A.qL(d.h(0,"hillshade-illumination-direction"),335)
A.qL(d.h(0,"hillshade-illumination-altitude"),45)
s=new A.fV()
break A}if("color-relief"===n)if(h)s=g
else{g="raster-dem"===(j?k:m)
s=g}else s=!1
if(s){s=f.eS(a,c,o,r,p,q)
break A}s=i
break A}if(s==null)return
i=f.z
B.a.k(f.at,new A.z(f.x.length,new A.c8(i.length,-1,-1,0)))
B.a.k(i,s)},
eS(a,b,c,d,e,a0){var s,r,q,p,o,n,m,l=a.d,k=t.n,j=A.b([],k),i=A.b([],k),h=l.h(0,"color-relief-color"),g=t.j,f=!1
if(g.b(h)){s=J.n(h)
if(s.gj(h)>=3)if("interpolate"===s.h(h,0)){r=s.h(h,2)
if(g.b(r)){t.W.a(r)
g=J.n(r)
if(g.gj(r)===1)g="elevation"===g.h(r,0)
else g=f}else g=f}else g=f
else g=f}else g=f
if(g){q=J.tl(h,3)
p=new A.A(B.h)
for(o=0;g=o+1,f=q.length,g<f;o+=2){if(!(o<f))return A.a(q,o)
n=q[o]
if(!(typeof n=="number"))if(typeof n=="string"){f=A.N(n)
n=f}else{if(A.H(n))f=n?1:0
else f=null
n=f}if(n==null)continue
if(!(g<q.length))return A.a(q,g)
m=A.c4(A.u(q[g]).$1(p))
if(m==null)m=B.dc
B.a.k(j,n)
g=m.d
B.a.B(i,A.b([m.a*g,m.b*g,m.c*g,g],k))}}if(j.length===0){B.a.k(j,0)
B.a.B(i,A.b([0,0,0,0],k))}if(j.length<2){B.a.k(j,B.a.gu(j)+1)
B.a.B(i,B.a.I(i,0,4))}A.K(l.h(0,"color-relief-opacity"),1)
A.eN(b)
A.tI(b)
new Float64Array(A.a2(j))
new Float64Array(A.a2(i))
A.K(l.h(0,"resampling"),"linear")
return new A.fB()},
eE(e2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6=null,b7="text-font",b8="text-offset",b9="text-rotation-alignment",c0="viewport",c1="text-anchor",c2="icon-offset",c3="text-size",c4="icon-size",c5="symbol-sort-key",c6="text-transform",c7="lowercase",c8="text-letter-spacing",c9="text-max-width",d0="text-justify",d1="text-rotate",d2="vertical",d3="icon-padding",d4="icon-text-fit",d5=e2.a,d6=d5.d,d7=d5.e,d8=d7.h(0,"text-field"),d9=d7.h(0,"icon-image"),e0=d8!=null&&!J.k(d8,""),e1=d9!=null&&!J.k(d9,"")
if(!e0&&!e1)return
s=this.b
if(e0&&s!=null&&B.d.v(B.e.a0(d8,b6),"name")){r=A.b(["coalesce"],t.G)
for(q=s.$ti,p=new A.a0(s,s.gj(0),q.i("a0<y.E>")),o=t.s,q=q.i("y.E");p.m();){n=p.d
r.push(A.b(["get",n==null?q.a(n):n],o))}d8=r}r=d7.h(0,b7)
m=B.e.a0(r==null?"":r,b6).toLowerCase()
A.oY(d7.h(0,b8))
l=d7.h(0,"symbol-placement")
if(l==null)l="point"
k=A.D(d7.h(0,"symbol-spacing"))
if(k==null)k=250
j=J.k(d7.h(0,b9),c0)
i=J.k(d7.h(0,"icon-rotation-alignment"),c0)
d7.h(0,c1)
A.vd(d7.h(0,"text-variable-anchor-offset"),d7.h(0,"text-variable-anchor"))
h=d7.h(0,"icon-anchor")
A.oY(d7.h(0,c2))
r=t.N
g=A.b3(r)
for(f=0;f<10;++f)A.c7(d6.h(0,B.cp[f]),g)
A.c7(d7.h(0,c3),g)
A.c7(d7.h(0,c4),g)
A.c7(d7.h(0,c2),g)
A.c7(d7.h(0,b8),g)
for(f=0;f<8;++f)A.c7(d7.h(0,B.cf[f]),g)
e=new A.kn(d7)
q=e0?d8:b6
p=e1?d9:b6
o=d7.h(0,c5)
n=d7.h(0,"icon-rotate")
if(n==null)n=0
d=A.a1(g,g.$ti.c)
B.a.aT(d)
c=A.vo(A.en(["source",e2.b,"sourceLayer",e2.c,"filter",e2.d,"text",q,"icon",p,"placement",l,"spacing",k,"textUpright",j,"iconUpright",i,"minZoom",d5.f,"maxZoom",d5.r,"sortKey",o,"iconRotate",n,"paintKeys",d],r,t.O))
q=A.K(d7.h(0,c3),16)
A.K(d6.h(0,"text-color"),"#000000")
A.K(d6.h(0,"text-opacity"),1)
A.u(d6.h(0,"text-halo-color"))
A.K(d6.h(0,"text-halo-width"),0)
p=A.vl(m)
if(!B.d.v(m,"italic"))B.d.v(m,"oblique")
o=A.vi(d7.h(0,b7))
n=J.k(d7.h(0,c6),"uppercase")
if(e.$1(c6)==null)if(J.k(d7.h(0,c6),c7))A.u(c7)
e.$1(c8)
e.$1(c9)
e.$1(d0)
e.$1(c1)
e.$1(d1)
e.$1(b7)
if(J.k(l,"point")){b=d7.h(0,"text-writing-mode")
A:{if(t.j.b(b)){d=A.b([],t.df)
for(a=J.G(b);a.m();){a0=a.gp()
a1=J.al(a0)
if(a1.C(a0,d2)||a1.C(a0,"horizontal"))d.push(a1.C(a0,d2))}break A}break A}}d=A.D(d7.h(0,c8))
if(d==null)d=0
a=A.D(d7.h(0,"text-line-height"))
a2=d7.h(0,d0)
B:{if("left"===a2){a1=B.ah
break B}if("right"===a2){a1=B.ai
break B}a1=B.dk
break B}J.k(d7.h(0,d0),"auto")
A.D(d7.h(0,"text-padding"))
J.k(d7.h(0,b9),"map")
A.D(d7.h(0,d3))
A.vk(d7.h(0,d3))
J.k(d7.h(0,"text-ignore-placement"),!0)
a3=d7.h(0,"text-pitch-alignment")
C:{if("map"===a3)break C
if("viewport"===a3)break C
a4=d7.h(0,b9)
D:{if("map"===a4)break D
if("viewport"===a4)break D
if(typeof l=="string")B.d.av(l,"line")
break D}break C}J.k(d7.h(0,"text-keep-upright"),!1)
J.k(d7.h(0,"icon-ignore-placement"),!0)
A.K(d6.h(0,"text-halo-blur"),0)
a5=A.D(d7.h(0,c9))
if(a5==null)a5=10
a6=A.K(d7.h(0,c4),1)
A.K(d6.h(0,"icon-opacity"),1)
A.K(d6.h(0,"icon-color"),"#000000")
A.D(d7.h(0,d1))
if(!A.qK(d7.h(0,b8)))A.u(d7.h(0,b8))
J.k(d7.h(0,"text-optional"),!0)
J.k(d7.h(0,"icon-optional"),!0)
A.kv(d7,"icon")
A.kv(d7,"text")
A.kv(d7,"icon")
A.kv(d7,"text")
A.vh(d7)
d7.h(0,c5)
A.c7(d7.h(0,c4),A.b3(r))
r=d7.h(0,d4)
J.k(r==null?"none":r,"none")
d7.h(0,d4)
E:{break E}a7=d7.h(0,"icon-text-fit-padding")
F:{r=t.j
a8=b6
a9=!1
b0=!1
if(r.b(a7)){b1=J.n(a7)
if(b1.gj(a7)===4){b2=b1.h(a7,0)
if(typeof b2=="number"){A.ae(b2)
b3=b1.h(a7,1)
if(typeof b3=="number"){A.ae(b3)
b4=b1.h(a7,2)
a9=typeof b4=="number"
if(a9){A.ae(b4)
a8=b1.h(a7,3)
b0=typeof a8=="number"}}}}}if(b0){A.ae(a9?a8:J.aP(a7,3))
break F}break F}A.D(d7.h(0,"text-radial-offset"))
if(r.b(h)||t.f.b(h))A.u(h)
if(!A.qK(d7.h(0,c2)))A.u(d7.h(0,c2))
r=d6.h(0,"text-translate")
if(r!=null)A.u(r)
J.k(d6.h(0,"text-translate-anchor"),c0)
r=d6.h(0,"icon-halo-color")
if(r!=null)A.u(r)
r=d6.h(0,"icon-halo-width")
if(r!=null)A.u(r)
r=d6.h(0,"icon-translate")
if(r!=null)A.u(r)
r=d6.h(0,"icon-halo-blur")
if(r!=null)A.u(r)
J.k(d6.h(0,"icon-translate-anchor"),c0)
b5=A.D(d7.h(0,"text-max-angle"))
G:{r=b6
if(b5!=null){r=b5*3.141592653589793/180
break G}break G}B.a.k(this.y,new A.hA(d5.a,c,q,p,o,n,d,a,a1,a5,a6,r))
r=this.ax
a6=B.e.a0(A.b(["s",c.a],t.s),b6)
r.a+=a6},
ex(a){var s,r,q,p=a.a,o=p.d
A.K(o.h(0,"heatmap-radius"),30)
p.gaS()
J.k(o.h(0,A.t(p.b)+"-translate-anchor"),"viewport")
s=this.bQ(a,B.r,A.hx(o,B.ck))
A.u("#ffffff")
A.K(o.h(0,"heatmap-opacity"),1)
r=A.K(o.h(0,"heatmap-weight"),1)
q=A.K(o.h(0,"heatmap-intensity"),1)
A.uj(o.h(0,"heatmap-color"),q,r)
B.a.k(this.x,new A.ct(p.a,s,p.f,p.r))},
es(a){var s,r,q,p,o,n="viewport",m="circle-blur",l=a.a,k=l.d,j=A.hx(k,B.cN)
A.K(k.h(0,"circle-radius"),5)
s=k.h(0,"circle-stroke-width")
l.gaS()
J.k(k.h(0,A.t(l.b)+"-translate-anchor"),n)
r=this.bQ(a,B.r,j)
A.K(k.h(0,"circle-color"),"#000000")
A.K(k.h(0,"circle-opacity"),1)
if(s!=null){A.K(k.h(0,"circle-stroke-color"),"#000000")
A.u(s)
A.K(k.h(0,"circle-stroke-opacity"),1)}q=J.k(k.h(0,"circle-pitch-alignment"),"map")
p=J.k(k.h(0,"circle-pitch-scale"),n)
o=k.h(0,m)==null?null:A.u(k.h(0,m))
B.a.k(this.x,new A.d8(q,!p,o,l.a,r,l.f,l.r))},
ez(b8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6="line-gradient",a7=null,a8="line-cap",a9=b8.a,b0=a9.d,b1=a9.e,b2=A.hx(b0,B.cj),b3=b0.h(0,"line-offset"),b4=b0.h(0,"line-blur"),b5=b0.h(0,a6)!=null&&b3!=null?a7:b0.h(0,"line-dasharray"),b6=A.vg(b5),b7=b6.length===0&&A.kq(b5)==null?A.vf(b5):B.N
if(b6.length!==0)s=B.a.gu(b6).b
else s=b7.length!==0?B.a.gu(b7):A.kq(b5)
r=A.K(b0.h(0,"line-width"),1)
q=b0.h(0,"line-gap-width")
p=q==null?a7:A.u(q)
o=p!=null?new A.km(r,p):r
n=b0.h(0,"line-pattern")
m=n==null
l=m?b0.h(0,a6):a7
k=this.ax
j=!m
i=l==null
h=!i
g=B.e.a0(A.b(["l",j,h],t.G),a7)
k.a+=g
f=b4!=null&&m&&i
k=a9.gaS()
g=J.k(b0.h(0,A.t(a9.b)+"-translate-anchor"),"viewport")
if(j)j=B.l
else{e=b1.h(0,a8)
A:{if("round"===e){j=B.J
break A}if("square"===e){j=B.K
break A}j=B.l
break A}}d=s==null
c=!d||!m||f||h
d=f&&d
b=b3==null
a=b1.h(0,"line-join")
B:{if("round"===a){a0=B.a4
break B}if("bevel"===a){a0=B.L
break B}a0=B.t
break B}h=this.eN(b8,B.q,b2,j,c,d,a0,h,!b)
j=m&&i?A.K(b0.h(0,"line-color"),"#000000"):A.u("#ffffff")
i=i?a7:A.u(l)
d=A.K(b0.h(0,"line-opacity"),1)
c=b?a7:A.u(b3)
b=f?A.u(b4):a7
a0=m?s:a7
a1=m?b6:B.A
a2=m?b7:B.N
a3=m&&b7.length!==0?A.u(b5):a7
a4=b1.h(0,a8)
C:{if("round"===a4){a5=B.au
break C}if("square"===a4){a5=B.av
break C}a5=B.a1
break C}m=m?a7:A.fm(n)
B.a.k(this.x,A.qo(b,h,j,a0,a5,a2,a3,a1,p,i,a9.a,a9.r,a9.f,c,d,!1,m,b2.a!==0,k,g,o))},
ev(b1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=null,a1="#000000",a2="-translate-anchor",a3="viewport",a4="fill-antialias",a5="fill-outline-color",a6=b1.a,a7=a6.d,a8=A.U(a6.b),a9=a8+"-color",b0=a7.h(0,a9)
if(b0==null)b0=a1
s=a8+"-opacity"
r=a7.h(0,s)
if(r==null)r=1
q=a8+"-pattern"
p=A.hx(a7,A.b([a9,s,q],t.s))
o=a7.h(0,q)
q=a.ax
s=o==null
a9=t.G
n=B.e.a0(A.b(["f",!s],a9),a0)
q.a+=n
n=a.x
m=a6.a
a6.gaS()
J.k(a7.h(0,a8+a2),a3)
l=a.bQ(b1,B.x,p)
k=a6.f
j=a6.r
if(s)A.K(b0,a1)
else A.u("#ffffff")
A.u(r)
i=s?a0:A.fm(o)
if(!s)A.K(b0,a1)
h=!1
if(a8==="fill")if(!J.k(a7.h(0,a4),!1))h=!s||a7.h(0,a5)==null
if(h)h=s?A.K(b0,a1):A.u("#ffffff")
else h=a0
g=a8==="fill-extrusion"
B.a.k(n,new A.bf(i,h,g,m,l,k,j))
if(g){f=B.e.a0(["extrusion",b1.b,b1.c,b1.d,a7.h(0,"fill-extrusion-height"),a7.h(0,"fill-extrusion-base"),b0,a7.h(0,"fill-extrusion-vertical-gradient"),a6.e.h(0,"fill-extrusion-rounded-corner-distance"),o],a0)
e=a.w.b7(f,new A.kk(a,b1,a7,o,b0,a6))
l=a.r
if(!(e>=0&&e<l.length))return A.a(l,e)
d=l[e]
if(k<d.cx)d.cx=k
if(j>d.cy)d.cy=j
a9=B.e.a0(A.b([f,k,j],a9),a0)
q.a+=a9
A.u(r)
a6.gaS()
J.k(a7.h(0,a8+a2),a3)
B.a.k(a.Q,new A.eb(e,k))}c=a7.h(0,a5)
if(c==null||!s||J.k(a7.h(0,a4),!1))return
b=A.hx(a7,B.cL)
a9=a6.gaS()
s=J.k(a7.h(0,a8+a2),a3)
B.a.k(n,A.qo(a0,a.eM(b1,B.q,b,!0),A.u(c),a0,B.a1,B.N,a0,B.A,a0,a0,m,j,k,a0,A.u(r),!0,a0,b.a!==0,a9,s,new A.kl()))},
bP(a0,a1,a2,a3,a4,a5,a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this,b=null,a={}
t.gi.a(a2)
a.a=a.b=a.c=null
s=a0.a
r=a0.b
a.c=r
q=a0.c
a.b=q
p=a0.d
a.a=p
o=a1===B.q
n=o?s.e.h(0,"line-join"):b
m=o?s.e.h(0,"line-cap"):b
l=t.j
k=l.b(m)||t.f.b(m)?m:b
j=o?s.e.h(0,"line-miter-limit"):b
i=o?s.e.h(0,"line-round-limit"):b
h=A.a1(a2,A.r(a2).c)
B.a.aT(h)
g=s.e.h(0,A.t(s.b)+"-sort-key")
o=[g,a1.a,r,q,p,a3.a,a4,a9,a8,a5,a7,a6.a,h]
if(l.b(n)||t.f.b(n))o.push(n)
if(k!=null)o.push(k)
if(j!=null)o.push(j)
if(i!=null)o.push(i)
f=B.e.a0(o,b)
e=c.w.b7(f,new A.ko(a,c,a1,a3,a4,a9,a8,a5,a7,a6,n,j,k,i,h,g))
a=c.r
if(!(e>=0&&e<a.length))return A.a(a,e)
d=a[e]
a=s.f
if(a<d.cx)d.cx=a
o=s.r
if(o>d.cy)d.cy=o
l=c.ax
o=B.e.a0(A.b([f,a,o],t.G),b)
l.a+=o
return e},
bQ(a,b,c){return this.bP(a,b,c,B.l,!1,!1,B.t,!1,!1,!1)},
eN(a,b,c,d,e,f,g,h,i){return this.bP(a,b,c,d,e,f,g,h,i,!1)},
eM(a,b,c,d){return this.bP(a,b,c,B.l,!1,!1,B.t,!1,!1,d)},
fj(a){var s,r,q,p,o,n,m,l,k
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
h7(){var s,r=this.a,q=r.$ti.i("4?").a(r.a.h(0,"terrain"))
r=t.f
if(!r.b(q))return null
s=this.d.h(0,q.h(0,"source"))
if(!r.b(s)||!J.k(s.h(0,"type"),"raster-dem"))return null
A.u(1)
A.bk(s.h(0,"url"))
A.py(s.h(0,"tiles"))
A.D(s.h(0,"tileSize"))
r=A.D(s.h(0,"maxzoom"))
if(r!=null)B.c.K(r)
A.eN(s)
J.k(s.h(0,"encoding"),"terrarium")
A.D(q.h(0,"exaggeration"))
return new A.hD()},
fS(){var s,r,q,p,o,n,m,l,k,j,i,h=this,g={},f=h.x,e=A.b([],t.in)
g.a=0
s=new A.kx(h,f)
r=new A.kw(g,e,s)
for(q=h.at,p=h.ay,o=0,n=0;n<=f.length;++n){for(;;){m=q.length
if(o<m){if(!(o>=0))return A.a(q,o)
m=q[o].a===n}else m=!1
if(!m)break
r.$1(n)
l=o+1
if(!(o>=0&&o<q.length))return A.a(q,o)
B.a.k(e,q[o].b)
o=l}m=!0
if(n!==f.length)if(n>g.a){if(J.k(s.$1(n),s.$1(g.a)))if(n!==h.ch){if(!(n<f.length))return A.a(f,n)
k=f[n].gbf()
j=g.a
if(!(j<f.length))return A.a(f,j)
if(k===f[j].gbf()){k=f.length
if(!(n<k))return A.a(f,n)
if(!(f[n] instanceof A.ct)){j=g.a
if(!(j<k))return A.a(f,j)
if(!(f[j] instanceof A.ct)){if(p.J(n)||p.J(g.a)){k=f.length
if(!(n<k))return A.a(f,n)
j=f[n]
i=n-1
if(!(i<k))return A.a(f,i)
i=j.a!==f[i].a
k=i}else k=!1
if(!k){k=f.length
if(!(n<k))return A.a(f,n)
j=f[n]
if(!(j instanceof A.bf&&j.dx)){m=g.a
if(!(m<k))return A.a(f,m)
m=f[m]
m=m instanceof A.bf&&m.dx}}}}}}}else m=!1
if(m)r.$1(n)}return e}}
A.ky.prototype={
$0(){var s,r,q,p,o,n,m,l,k,j,i,h=null,g="promoteId",f="generateId",e=this.a,d=this.b,c=e.d.h(0,d)
if(!t.f.b(c))return h
s=J.k(c.h(0,"type"),"geojson")
if(!s&&!J.k(c.h(0,"type"),"vector"))return h
A.py(c.h(0,"tiles"))
r=c.h(0,"data")
q=A.D(c.h(0,"maxzoom"))
p=q==null?h:B.c.K(q)
if(s&&J.k(c.h(0,"cluster"),!0)){q=A.D(c.h(0,"clusterRadius"))
if(q==null)q=h
if(q==null)q=50
o=A.D(c.h(0,"clusterMaxZoom"))
o=o==null?h:B.c.K(o)
if(o==null)o=(p==null?18:p)-1
o=B.b.E(o,0,24)
n=A.D(c.h(0,"clusterMinPoints"))
n=n==null?h:B.c.K(n)
if(n==null)n=2
m=c.h(0,"clusterProperties")
A:{if(t.d.b(m)){l=A.C(t.N,t.O)
for(k=m.gag(),k=k.gt(k);k.m();){j=k.gp()
l.n(0,A.t(j.a),j.b)}break A}l=B.h
break A}i=new A.iR(q,o,n,l)}else i=h
e=e.e
if(s){A.t(d)
d=c.h(0,g)
q=J.k(c.h(0,f),!0)
A.t(typeof r=="string"?r:A.oj(r))
if(i!=null)B.e.a0(i.d,h)
A.t(c.h(0,g))
A.t(c.h(0,f))
d=new A.bX(r,i,q,d)}else{A.t(d)
A.bk(c.h(0,"url"))
d=c.h(0,g)
q=A.eN(c)
A.t(c.h(0,"url"))
A.t(c.h(0,g))
o=A.eN(c).b
if(o!=null)B.a.ac(o,",")
d=new A.eP(q,d)}B.a.k(e,d)
return e.length-1},
$S:91}
A.kn.prototype={
$1(a){var s=this.a,r=s.h(0,a)
A:{if(t.j.b(r)||t.f.b(r)){s=A.u(s.h(0,a))
break A}s=null
break A}return s},
$S:92}
A.km.prototype={
$1(a){var s,r=A.D(this.a.$1(a))
if(r==null)r=1
s=A.D(this.b.$1(a))
if(s==null)s=0
return r*2+s},
$S:11}
A.kk.prototype={
$0(){var s,r=this,q=null,p=r.a.r,o=r.b,n=A.pn(o.d),m=r.c,l=A.K(m.h(0,"fill-extrusion-height"),0),k=A.K(m.h(0,"fill-extrusion-base"),0),j=r.d,i=j==null,h=i?A.K(r.e,"#000000"):A.u("#ffffff")
m=J.k(m.h(0,"fill-extrusion-vertical-gradient"),!1)
s=r.f.e.h(0,"fill-extrusion-rounded-corner-distance")
s=A.u(s==null?0:s)
j=i?q:A.fm(j)
B.a.k(p,A.pX(o.b,o.c,n,B.H,B.l,q,!1,!1,new A.j0(l,k,h,!m,s,j),B.t,q,!1,q,!1,!1,q,q,B.aa))
return p.length-1},
$S:8}
A.kl.prototype={
$1(a){return 1},
$S:28}
A.ko.prototype={
$0(){var s,r,q,p,o,n=this,m=null,l=n.b.r,k=n.a,j=k.c,i=k.b
k=A.pn(k.a)
s=n.z
s=t.j.b(s)||t.f.b(s)?A.u(s):m
r=n.Q
r=r==null?m:A.u(r)
q=n.as
q=q==null?m:A.u(q)
p=n.at
p=p==null?m:A.u(p)
o=n.ay
o=o==null?m:A.u(o)
B.a.k(l,A.pX(j,i,k,n.c,n.d,q,n.e,n.w,m,n.y,s,n.x,r,n.r,n.f,p,o,n.ax))
return l.length-1},
$S:8}
A.kx.prototype={
$1(a){var s=this.a.r,r=this.b
if(!(a<r.length))return A.a(r,a)
r=r[a].b
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r].c},
$S:14}
A.kw.prototype={
$1(a){var s=this.a,r=s.a
if(a>r)B.a.k(this.b,new A.c8(-1,-1,this.c.$1(r),s.a))
s.a=a},
$S:40}
A.kz.prototype={
$1(a){var s
t.X.a(a)
s=this.a.$1(a)
return s==null?this.b.$1(a):s},
$S:2}
A.kt.prototype={
$2(a,b){var s=this.a,r=s.h(0,a)
A:{if(typeof r=="string"){s=r!=="never"
break A}s=J.k(s.h(0,b),!0)
break A}return s},
$S:94}
A.ku.prototype={
$1(a){return typeof a=="number"},
$S:7}
A.kp.prototype={
$1(a){return typeof a=="string"&&A.c4(a)!=null},
$S:7}
A.kr.prototype={
$1(a){var s,r
if(!t.j.b(a))return
s=J.n(a)
if(s.gj(a)===2&&J.k(s.h(a,0),"literal")){r=A.kq(a)
if(r!=null&&!B.a.aF(this.a,new A.ks(r)))B.a.k(this.a,r)
return}for(s=s.gt(a);s.m();)this.$1(s.gp())},
$S:12}
A.ks.prototype={
$1(a){return A.vj(t.kI.a(a),this.a)},
$S:95}
A.ci.prototype={
an(){return"BucketKind."+this.b}}
A.j0.prototype={}
A.j3.prototype={}
A.eb.prototype={}
A.d3.prototype={}
A.df.prototype={
an(){return"DashCap."+this.b}}
A.bg.prototype={
gbf(){return!1}}
A.h9.prototype={}
A.bf.prototype={}
A.dq.prototype={}
A.d8.prototype={
gbf(){return!0}}
A.ct.prototype={
gbf(){return!0}}
A.jr.prototype={}
A.kD.prototype={}
A.kE.prototype={
$1(a){return""},
$S:4}
A.hA.prototype={
ghD(){return this.b.d},
hE(a){return this.ghD().$1(a)}}
A.kV.prototype={
hJ(a,b,c){var s,r,q,p,o
if(a<this.a)return!1
s=this.b
if(s==null)return!0
r=new A.kX(a)
q=new A.kY(a)
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
A.kW.prototype={
$1(a){return typeof a=="number"},
$S:7}
A.kX.prototype={
$1(a){var s=B.b.ab(1,this.a)
return B.b.E(B.c.a7((a+180)/360*s),0,s-1)},
$S:21}
A.kY.prototype={
$1(a){var s=B.b.ab(1,this.a)
return B.b.E(B.c.a7(A.pz(a)*s),0,s-1)},
$S:21}
A.dC.prototype={
co(a){var s,r=this.c
A:{if(typeof r=="string"){s=r
break A}if(t.f.b(r)){s=A.bk(r.h(0,a))
break A}s=null
break A}return s}}
A.bX.prototype={}
A.eP.prototype={}
A.ft.prototype={}
A.c8.prototype={}
A.oX.prototype={}
A.hy.prototype={}
A.kB.prototype={
$1(a){return t.aL.a(a).b===0},
$S:96}
A.kC.prototype={}
A.hz.prototype={
dE(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i=this,h=A.b([i.c4(b,c),i.c4(b,d),i.c4(b,e)],t.b)
for(s=1/0,r=-1/0,q=0;q<3;++q){p=h[q]
if(0>=p.length)return A.a(p,0)
o=p[0]
s=Math.min(s,o)
r=Math.max(r,o)}for(o=i.b,n=B.c.a7(s/o)+1,m=h;l=n*o,l<r;++n,m=j){k=i.du(m,0,l)
j=k.b
i.ds(k.a)
if(j.length<3)return}i.ds(m)},
c4(a,b){var s,r,q,p,o,n=A.b([],t.n)
for(s=this.a,r=b*s,q=a.length,p=0;p<s;++p){o=r+p
if(!(o<q))return A.a(a,o)
n.push(a[o])}return n},
ds(a){var s,r,q,p,o,n,m,l,k,j,i=this
t.x.a(a)
if(a.length<3)return
if(B.a.aF(a,A.y9())){i.bU(a)
return}for(s=a.length,r=1/0,q=-1/0,p=0;p<s;++p){o=a[p]
if(1>=o.length)return A.a(o,1)
n=o[1]
r=Math.min(r,n)
q=Math.max(q,n)}for(s=i.b,m=B.c.a7(r/s)+1,l=a;n=m*s,n<q;++m,l=j){k=i.du(l,1,n)
j=k.b
i.bU(k.a)
if(j.length<3)return}i.bU(l)},
du(a,b,c){var s,r,q,p,o,n,m,l,k,j,i
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
if(m<-32767.5||m>32766.5){B.a.k(r,n)
B.a.k(q,n)
continue}if(!(b<s))return A.a(n,b)
k=n[b]
if(!(b<l.length))return A.a(l,b)
j=l[b]
if(k<=c)B.a.k(r,n)
if(k>=c)B.a.k(q,n)
if(1>=l.length)return A.a(l,1)
s=l[1]
if(s<-32767.5||s>32766.5)continue
if(!(k<c&&j>c))s=k>c&&j<c
else s=!0
if(s){i=this.eZ(n,l,b,c)
B.a.k(r,i)
B.a.k(q,i)}}return new A.z(r,q)},
eZ(a,b,c,d){var s,r,q,p,o,n,m,l,k=t.H
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
bU(a){var s,r,q,p,o,n
t.x.a(a)
s=a.length
if(s<3)return
r=this.c
q=B.b.a9(r.length,this.a)
for(p=0;p<a.length;a.length===s||(0,A.h)(a),++p)B.a.B(r,a[p])
for(s=this.d,o=1;n=o+1,n<a.length;o=n){B.a.k(s,q)
r=q+o
B.a.k(s,r)
B.a.k(s,r+1)}}}
A.cv.prototype={
an(){return"LineJoin."+this.b}}
A.dp.prototype={
an(){return"LineCap."+this.b}}
A.aT.prototype={
an(){return"_Join."+this.b}}
A.eq.prototype={}
A.lf.prototype={
cw(a,b){var s,r,q,p=this,o=p.Q
if(o>0&&o+a>16e3)p.cn()
p.e7(a)
o=p.as
s=o+b
r=p.x
q=r.length
if(s>q){q=Math.max(s,q*2)
q=new Uint16Array(q)
B.R.Z(q,0,o,r)
p.x=q}},
e7(a){var s=this,r=s.Q,q=(r+a)*2,p=s.f,o=p.length
if(q>o){o=Math.max(q,o*2)
o=new Float32Array(o)
B.n.Z(o,0,r*2,p)
s.f=o
r=o}else r=p
p=s.a
if(p&&q>s.r.length){r=Math.max(q,r.length)
r=new Float32Array(r)
B.n.Z(r,0,s.Q*2,s.r)
s.r=r}if(p&&B.b.N(q,2)>s.w.length){r=B.c.N(Math.max(q,s.f.length),2)
r=new Uint8Array(r)
B.j.Z(r,0,s.Q,s.w)
s.w=r}if(s.b&&q>s.d.length){r=Math.max(q,s.f.length)
r=new Float32Array(r)
B.n.Z(r,0,s.Q*2,s.d)
s.d=r}if(s.c&&q>s.e.length){r=Math.max(q,s.f.length)
r=new Float32Array(r)
B.n.Z(r,0,s.Q*2,s.e)
s.e=r}},
cn(){var s,r,q,p,o,n,m=this,l=null,k=m.a
if(k&&(m.Q&1)===1){m.e7(1)
s=m.f
r=m.Q
q=r*2
s.$flags&2&&A.w(s)
p=s.length
if(!(q>=0&&q<p))return A.a(s,q)
s[q]=0
o=q+1
if(!(o<p))return A.a(s,o)
s[o]=0
s=m.r
s.$flags&2&&A.w(s)
p=s.length
if(!(q<p))return A.a(s,q)
s[q]=0
if(!(o<p))return A.a(s,o)
s[o]=0
s=m.w
s.$flags&2&&A.w(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=2
if(m.b){s=m.d
s.$flags&2&&A.w(s)
if(!(q<s.length))return A.a(s,q)
s[q]=0}if(m.c){s=m.e
s.$flags&2&&A.w(s)
p=s.length
if(!(q<p))return A.a(s,q)
s[q]=0
if(!(o<p))return A.a(s,o)
s[o]=0}m.Q=r+1}if(m.as>0){s=new Float32Array(A.a2(A.j7(m.f,0,m.Q*2)))
r=k?new Float32Array(A.a2(A.j7(m.r,0,m.Q*2))):l
q=new Uint16Array(A.a2(A.qR(m.x,0,m.as)))
p=m.b?new Float32Array(A.a2(A.j7(m.d,0,m.Q*2))):l
o=m.c?new Float32Array(A.a2(A.j7(m.e,0,m.Q*2))):l
k=k?new Uint8Array(A.a2(A.hJ(m.w,0,m.Q))):l
n=m.y
n=n.length===0?l:new Uint16Array(A.a2(A.qR(n,0,m.z)))
B.a.k(m.at,new A.eq(n,s,r,q,p,o,k))}m.z=m.as=m.Q=0}}
A.j5.prototype={
dG(a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this
t.L.a(a3)
s=a2-a1
if(s<3||s>65e3)return
r=A.cp(a0,a1*2,a2*2)
q=!a.c
if(!q||a.d){p=a.f_(r,a3)
r=p.a
a3=p.b
s=r.length/2|0
if(s<3||s>65e3)return}o=A.q4(r,a3)
if(o.length===0)return
n=!q||a.d?a.fH(r,o):B.cz
q=a.a
m=n.length
q.cw(s+m,o.length+m*3)
l=q.Q
k=q.f
j=l*2
for(m=s*2,i=r.length,h=k.$flags|0,g=0;g<m;++g,j=f){f=j+1
if(!(g<i))return A.a(r,g)
e=r[g]
h&2&&A.w(k)
if(!(j>=0&&j<k.length))return A.a(k,j)
k[j]=e}d=q.x
c=q.as
for(m=o.length,i=d.$flags|0,g=0;g<m;++g,c=b){b=c+1
h=o[g]
i&2&&A.w(d)
if(!(c<d.length))return A.a(d,c)
d[c]=l+h}if(a.b)a.fR(l,s,a3)
q.Q+=s
q.as=c
if(n.length!==0)a.f8(l,r,n)},
f_(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e
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
k.push(a[f])}e=m?A.q5(k,0,!0):k
if(n)e=A.q5(e,4096,!1)
if(e.length<6){if(j)return new A.z(new Float64Array(0),B.m)
continue}if(l>0)B.a.k(q,r.length/2|0)
B.a.B(r,e)}return new A.z(new Float64Array(A.a2(r)),q)},
fH(a,b){var s,r,q,p,o,n,m,l,k,j,i
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
if(q&&i===0)B.a.k(s,new A.aM(k,j,-32768))
if(r&&i===4096)B.a.k(s,new A.aM(k,j,32767))}return s},
f8(a,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
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
l&2&&A.w(r)
c=r.length
if(!(f>=0&&f<c))return A.a(r,f)
r[f]=(e+d)/2;++f
if(!(f<c))return A.a(r,f)
r[f]=i.c
b=o+1
k&2&&A.w(q)
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
fR(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h
t.L.a(c)
s=this.a
r=s.y
q=r.length
p=s.z
o=p+b*2
if(q<o){q=Math.max(o,q*2)
q=new Uint16Array(q)
B.R.Z(q,0,p,r)
s.y=q
r=q}n=s.z
for(q=c.length,p=r.$flags|0,m=0;m<=q;++m){if(m===0)l=0
else{o=m-1
if(!(o>=0))return A.a(c,o)
l=c[o]}k=m<q?c[m]:b
for(j=l;j<k;){i=n+1
p&2&&A.w(r)
o=r.length
if(!(n>=0&&n<o))return A.a(r,n)
r[n]=a+j
n=i+1;++j
h=j<k?j:l
if(!(i>=0&&i<o))return A.a(r,i)
r[i]=a+h}}s.z=n}}
A.j6.prototype={
$1(a){var s=this.b
return this.a?a>=s:a<=s},
$S:30}
A.jE.prototype={
dF(g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9=this
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
q+=Math.sqrt(k*k+j*j)}f9.c7(g0,g1,r+1,g3,g4,g6,g7,g8,g9,h0)
f9.c7(g0,r,g2,g3,g4,g6,g7,g8,s?null:g9+q*h0,h0)
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
o&2&&A.w(s)
if(!(g<m))return A.a(s,g)
s[g]=f;++g
if(!(g<m))return A.a(s,g)
s[g]=e;++h}if(h<2)return
f9.a.cw(h*32+18,h*96+54)
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
s.$flags&2&&A.w(s)
if(!(o>=0&&o<m))return A.a(s,o)
s[o]=n;++o
if(1>=m)return A.a(s,1)
n=s[1]
if(!(o<m))return A.a(s,o)
s[o]=n;++h}b=g6===B.L?1.05:f9.z
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
a3=A.qp(a1,a2,o,s[1])
a4=a3.a
a5=a3.b}else{a1=0
a2=0
a4=0
a5=0}for(o=g4===B.K,n=g4===B.J,l=g6.a,g=g6===B.aU,a6=g5,a7=a6,a8=0,a9=0,b0=!1,b1=0,b2=0,p=0;p<h;++p,a7=!0,a6=!0){d=p<a0
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
if(b3){b7=A.qp(a1,a2,b5,b6)
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
c5=c2<$.rQ()&&b0&&b3
c6=b1*a5-b2*a4>0
c7=Math.min(c3,2)
c8=b8*c7
c9=b9*c7
d0=B.c.E((c3-3)/5,0,1)
if(c5&&p>0){d1=a1-a8
d2=a2-a9
d3=Math.sqrt(d1*d1+d2*d2)
if(d3>240){d4=120/d3
d5=a1-B.c.a2(d1*d4)
d6=a2-B.c.a2(d2*d4)
k=d5-a8
j=d6-a9
f9.f=f9.f+Math.sqrt(k*k+j*j)
f9.ad(d5,d6,b1,b2,0,0,b1,b2)
a9=d6
a8=d5}}d7=b0&&b3
if(d7)if(g)d8=B.V
else{if(!(l<8))return A.a(B.a6,l)
d9=B.a6[l]
d8=d9}else if(g5)d8=B.G
else{if(n)d9=B.D
else d9=o?B.X:B.G
d8=d9}if(d7&&d8===B.D)if(c3<a)d8=B.w
else if(c3<=2)d8=B.F
if(d8===B.w&&c3>b)d8=B.E
if(d8===B.E){if(c3>2)d8=B.W
if(c3<b)d8=B.w}if(b0){k=a1-a8
j=a2-a9
f9.f=f9.f+Math.sqrt(k*k+j*j)}A:{if(B.w===d8){f9.ad(a1,a2,b8*c3,b9*c3,0,0,c8,c9)
break A}if(B.W===d8){if(c3>100){e0=-a4
e1=-a5}else{k=b1-a4
j=b2-a5
b4=Math.sqrt(b4)
c4=Math.sqrt(k*k+j*j)
d9=c6?-1:1
d4=c3*b4/c4*d9
e0=-b9*d4
e1=b8*d4}f9.ad(a1,a2,e0,e1,0,0,c8+(e0-c8)*d0,c9+(e1-c9)*d0)
b4=-e0
c4=-e1
f9.ad(a1,a2,b4,c4,0,0,c8+(b4-c8)*d0,c9+(c4-c9)*d0)
break A}if(B.E===d8||B.F===d8){e2=-Math.sqrt(c3*c3-1)
e3=c6?e2:0
e4=c6?0:e2
if(b0)f9.ad(a1,a2,b1,b2,e3,e4,c8,c9)
if(d8===B.F){e5=B.c.Y(2*c4*180/3.141592653589793/20)
for(b4=a4-b1,c4=a5-b2,e6=1.0904+c1*(-3.2452+c1*(3.55645-c1*1.43519)),e7=0.848013+c1*(-1.06021+c1*0.215638),d9=-c8,e8=-c9,e9=1;e9<e5;++e9){f0=e9/e5
if(f0!==0.5){f1=f0-0.5
f0+=f0*f1*(f0-1)*(e6*f1*f1+e7)}f2=b4*f0+b1
f3=c4*f0+b2
f4=Math.sqrt(f2*f2+f3*f3)
d4=(c6?-1:1)/f4
f9.d=c6?d9:c8
f9.e=c6?e8:c9
f5=c6?1:0
f9.b1(f9.ao(a1,a2,f2*d4,f3*d4,f5),c6)}}if(b3)f9.ad(a1,a2,a4,a5,-e3,-e4,c8,c9)
break A}if(B.G===d8){if(!b0)f9.dh(a1,a2,b8,b9,c8,c9,!1)
f9.ad(a1,a2,b8,b9,0,0,c8,c9)
if(b0)f9.dh(a1,a2,b8,b9,c8,c9,!0)
break A}if(B.X===d8){d4=b0?1:-1
f9.ad(a1,a2,b8,b9,d4,d4,c8,c9)
break A}if(B.V===d8){f9.ad(a1,a2,b1,b2,0,0,b1,b2)
f9.ax=f9.ay=-1
f9.ad(a1,a2,a4,a5,0,0,a4,a5)
break A}if(B.D===d8){if(b0){f6=c8+(b1-c8)*d0
f7=c9+(b2-c9)*d0
f9.ad(a1,a2,b1,b2,0,0,f6,f7)
f9.d=f6
f9.e=f7
f9.d0(a1,a2,b1,b2,3.141592653589793,-1)}if(b3){f6=c8+(a4-c8)*d0
f7=c9+(a5-c9)*d0
f9.d=f6
f9.e=f7
f9.d0(a1,a2,a4,a5,3.141592653589793,1)
f9.ax=f9.ay=-1
f9.ad(a1,a2,a4,a5,0,0,f6,f7)}}}if(c5&&d){d1=b5-a1
d2=b6-a2
f8=Math.sqrt(d1*d1+d2*d2)
if(f8>240){d4=120/f8
d5=a1+B.c.a2(d1*d4)
d6=a2+B.c.a2(d2*d4)
k=d5-a1
j=d6-a2
f9.f=f9.f+Math.sqrt(k*k+j*j)
f9.ad(d5,d6,a4,a5,0,0,a4,a5)
a2=d6
a1=d5}}}},
c7(a,b,c,d,e,f,g,h,i,j){return this.dF(a,b,c,d,e,!1,f,g,h,i,j)},
hj(a,b,c,d,e){var s=null
return this.dF(a,b,c,d,B.l,e,s,s,s,s,0)},
b1(a,b){var s,r,q,p,o,n=this,m=n.ax
if(m>=0&&n.ay>=0){s=n.a
r=s.x
q=s.as
p=q+1
r.$flags&2&&A.w(r)
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
dh(a,b,c,d,e,f,g){var s,r,q,p,o,n=this
n.d=e
n.e=f
s=n.ao(a,b,c,d,0)
r=n.a
q=r.w
p=g?3:4
q.$flags&2&&A.w(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=p
n.b1(s,!1)
o=n.ao(a,b,-c,-d,1)
r=r.w
q=g?5:6
r.$flags&2&&A.w(r)
if(!(o>=0&&o<r.length))return A.a(r,o)
r[o]=q
n.b1(o,!0)},
ad(a,b,c,d,e,f,g,h){var s=this
s.d=g
s.e=h
s.b1(s.ao(a,b,c+d*e,d-c*e,0),!1)
s.b1(s.ao(a,b,-c+d*f,-d-c*f,1),!0)},
d0(a,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.c?0:0.5,e=g.b2(a,a0,0,0,0.5,!0),d=Math.max(1,B.c.bz(a3/0.5235987755982988)),c=a3/d*a4,b=1/Math.cos(c/2)
g.b2(a,a0,a1,a2,f,!0)
for(s=0;s<d;++s){r=c*(s+0.5)
q=Math.cos(r)*b
p=Math.sin(r)*b
g.b2(a,a0,a1*q-a2*p,a1*p+a2*q,f,!0)}o=a3*a4
q=Math.cos(o)
p=Math.sin(o)
g.b2(a,a0,a1*q-a2*p,a1*p+a2*q,f,!0)
o=g.a
n=o.x
m=o.as
for(l=n.$flags|0,k=e+1,j=e+2,s=0;s<=d;++s,m=i){i=m+1
l&2&&A.w(n)
h=n.length
if(!(m<h))return A.a(n,m)
n[m]=e
m=i+1
if(!(i<h))return A.a(n,i)
n[i]=k+s
i=m+1
if(!(m<h))return A.a(n,m)
n[m]=j+s}o.as=m},
b2(a,b,c,d,e,f){var s,r,q,p,o,n,m=this,l=m.a,k=l.Q,j=k*2,i=l.f
i.$flags&2&&A.w(i)
s=i.length
if(!(j>=0&&j<s))return A.a(i,j)
i[j]=a
r=j+1
if(!(r<s))return A.a(i,r)
i[r]=b
i=l.r
i.$flags&2&&A.w(i)
s=i.length
if(!(j<s))return A.a(i,j)
i[j]=c
if(!(r<s))return A.a(i,r)
i[r]=d
i=l.w
if(f)s=2
else s=e<0.5?0:1
i.$flags&2&&A.w(i)
if(!(k>=0&&k<i.length))return A.a(i,k)
i[k]=s
if(l.b){q=m.r
i=l.d
s=q==null
p=m.f
o=s?p:(q+p*m.w)*256
i.$flags&2&&A.w(i)
n=i.length
if(!(j<n))return A.a(i,j)
i[j]=o
s=s?e:p
if(!(r<n))return A.a(i,r)
i[r]=s}if(l.c){i=l.e
s=m.d
i.$flags&2&&A.w(i)
p=i.length
if(!(j<p))return A.a(i,j)
i[j]=s
s=m.e
if(!(r<p))return A.a(i,r)
i[r]=s}l.Q=k+1
return k},
ao(a,b,c,d,e){return this.b2(a,b,c,d,e,!1)},
hk(a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=this
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
s.cw(4,6)
d=a3.ao(n,l,f,e,0)
o=-f
m=-e
c=a3.ao(n,l,o,m,1)
b=a3.ao(k,j,f,e,0)
a=a3.ao(k,j,o,m,1)
a0=s.x
a1=s.as
a2=a1+1
a0.$flags&2&&A.w(a0)
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
A.d4.prototype={}
A.bp.prototype={
sah(a){this.Q=t.h9.a(a)}}
A.d5.prototype={
hT(a,b,c,d){var s,r,q,p,o,n,m=1/B.b.ab(1,a),l=b*m,k=c*m
for(s=this.c,r="r|"+a+"/"+b+"/"+c+"|",q=0;q<s.length;++q){p=s[q]
o=p.f!=null||p.y||p.c.length===0
n=""+p.a
p.z=o?r+n+"|"+q:"p|"+n+"|"+p.c+"|"+B.c.a7((l+p.d/4096*m)*d)+"|"+B.c.a7((k+p.e/4096*m)*d)}},
cB(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=null,d=t.dO,c=A.b([],d)
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
n=g.a
d.push([g.d,g.e,g.f,g.r,g.w,g.b,n.a,n.b,n.c,n.d,g.c])}r=f.fd()
o=f.a
return[c,s,d,r,o==null?e:o.cB()]},
fd(){var s,r,q,p,o,n,m,l
for(s=this.c,r=s.length,q=0,p=0;p<r;++p){o=s[p].as
o=o==null?null:o.d.length
q+=o==null?0:o}if(q===0)return null
n=new Float32Array(q)
for(m=0,p=0;p<s.length;s.length===r||(0,A.h)(s),++p){o=s[p].as
l=o==null?null:o.d
if(l==null)continue
B.n.bJ(n,m,l)
m+=l.length}return n}}
A.aL.prototype={
si7(a){this.e=t.nE.a(a)}}
A.kG.prototype={
em(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i=this
for(s=i.c,r=s.as,q=i.x,p=i.d,o=t.t,n=0;n<r.length;++n){m=r[n]
if(m.c!==p)continue
m=m.d
l=q.h(0,m)
if(l==null){l=A.b([],o)
q.n(0,m,l)
m=l}else m=l
B.a.k(m,n)}for(r=s.ax,q=i.y,n=0;n<r.length;++n){m=r[n].b
if(m.b!==p)continue
m=m.c
l=q.h(0,m)
if(l==null){l=A.b([],o)
q.n(0,m,l)
m=l}else m=l
B.a.k(m,n)}if(i.w)for(s=s.at,r=s.length,q=i.a,k=0;k<s.length;s.length===r||(0,A.h)(s),++k){j=s[k]
if(j instanceof A.bf)p=j.db!=null
else p=!1
if(p)q.k(0,j.b)}},
fY(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
t.lL.a(a)
s=this.e
if(s==null)return
for(r=a.length,q=this.c.ax,p=0;p<a.length;a.length===r||(0,A.h)(a),++p){o=a[p]
n=o.a
if(n<0||o.c.length===0)continue
if(!(n>=0&&n<q.length))return A.a(q,n)
m=q[n]
l=A.pu(o.c)
k=m.z?l.toUpperCase():l
j=A.yb(k)
i=o.f!=null
n=m.ax
if(n==null)n=1.15
h=i?60:m.go
g=m.ay
A:{if(B.ah===g){f=j?1:-1
break A}if(B.ai===g){f=j?-1:1
break A}if(B.dl===g){f=j?1:-1
break A}if(B.dm===g){f=j?-1:1
break A}f=0
break A}o.as=A.rF(s,k,f,m.at,n,h,i,m.y,m.w)}},
ho(l4,l5,l6,l7,l8,l9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9,i0,i1,i2,i3,i4,i5,i6,i7,i8,i9,j0,j1,j2,j3,j4,j5,j6,j7,j8,j9,k0,k1,k2,k3,k4,k5,k6,k7,k8,k9,l0,l1,l2=this,l3=null
t.mm.a(l4)
s=l2.c
r=s.as
q=t.bQ
p=A.T(r.length,l3,!1,q)
o=t.N
n=t.S
m=A.T(r.length,0,!1,n)
l=A.T(r.length,l3,!1,q)
k=A.b([],t.fw)
j=A.b([],t.oM)
i=A.C(n,t.aB)
h=A.C(n,t.lc)
g=l5>=l6
f=g?0.75:2
e=g?0:2
d=l7>l5?l7:l5
c=l2.ch=B.b.ab(1,d-l5)
b=d+s.CW
l2.r=!1
a=new A.kR(b,g)
a0=l2.z
a0.a=b
a1=new A.kT(p,k,a0,A.C(o,t.ct),m,l)
for(q=J.G(l4),n=b+1,a2=t.O,a3=s.ax,a4=l2.Q,a5=a4.c,a6=t.Y,a7=t.gw,a8=t.n,a9=l2.a,b0=l9===0,b1=6.283185307179586*(l9+0.5),b2=l2.as,b3=l2.at,b4=t.t,b5=t.s,b6=s.d,b7=t.c3,b8=l2.d,b9=s.ay,c0=l2.y,c1=l2.x;q.m();){c2=q.gp()
c3=A.b([],b4)
c4=c1.h(0,c2.gaB())
if(c4==null)c4=B.m
c5=c4.length
c6=0
for(;c6<c4.length;c4.length===c5||(0,A.h)(c4),++c6){c7=c4[c6]
if(!(c7>=0&&c7<r.length))return A.a(r,c7)
c8=r[c7]
if(a.$2(c8.cx,c8.cy))c3.push(c7)}c4=A.b([],b4)
c5=c0.h(0,c2.gaB())
if(c5==null)c5=B.m
c8=c5.length
c6=0
for(;c6<c5.length;c5.length===c8||(0,A.h)(c5),++c6){c9=c5[c6]
if(!(c9>=0&&c9<a3.length))return A.a(a3,c9)
d0=a3[c9].b
if(a.$2(d0.z,d0.Q))c4.push(c9)}if(c3.length===0&&c4.length===0)continue
d1=4096/c2.gcm()
c5=b9.length
if(b8<c5){if(!(b8>=0))return A.a(b9,b8)
d2=b9[b8]}else d2=l3
d3=d2==null||d2 instanceof A.bX?l3:d2.co(c2.gaB())
c5=c2.gbA()
c8=A.b([],b4)
for(d0=c3.length,c6=0;c6<c3.length;c3.length===d0||(0,A.h)(c3),++c6){c7=c3[c6]
if(!(c7>=0&&c7<r.length))return A.a(r,c7)
if(r[c7].b==null)c8.push(c7)}c4=A.b([new A.aM(c5,c8,c4)],b7)
for(c5=c3.length,c6=0;c6<c3.length;c3.length===c5||(0,A.h)(c3),++c6){c7=c3[c6]
if(!(c7>=0&&c7<r.length))return A.a(r,c7)
d4=r[c7].b
if(d4!=null)c4.push(new A.aM(l2.eP(c2,d4,d3),A.b([c7],b4),B.m))}for(c3=c4.length,c5=d3!=null,c6=0;c6<c4.length;c4.length===c3||(0,A.h)(c4),++c6){c8=c4[c6]
d5=c8.b
d6=c8.c
for(c8=J.G(c8.a),d0=J.Z(d6),d7=J.Z(d5);c8.m();){d8={}
d9=c8.gp()
e0=d9.bv(c2)
if(c5&&e0.h(0,d3)!=null)e0.n(0,"$id",e0.h(0,d3))
a0.sah(e0)
e1=d9.gL()
A:{if(1===e1){e2="Point"
break A}if(2===e1){e2="LineString"
break A}e2="Polygon"
break A}a0.c=e2
d8.a=!1
d8.b=d1
e3=new A.kS(d8,l2,d9)
e4=new A.kU(d8,l2,e3)
a0.shW(new A.kO(d8,l2,e3,l5,l8,l9))
for(e2=d7.gt(d5),e5=d9 instanceof A.dF;e2.m();){e6=e2.gp()
if(e6>>>0!==e6||e6>=r.length)return A.a(r,e6)
e7=r[e6]
e8=e7.f
B:{if(B.x===e8||B.H===e8){e9=d9.gL()===3
break B}if(B.r===e8){e9=!0
break B}if(B.q===e8){e9=e7.x?d9.gL()===3:d9.gL()!==1
break B}e9=l3}if(!e9||!e7.e.$1(a0))continue
f0=e7.a
if(f0!=null){e4.$0()
e9=f0.a.$1(a0)
if(!(typeof e9=="number"))if(typeof e9=="string")e9=A.N(e9)
else if(A.H(e9))e9=e9?1:0
else e9=l3
if(e9==null)e9=0
f1=Math.max(0,e9)
e9=f0.b.$1(a0)
if(!(typeof e9=="number"))if(typeof e9=="string")e9=A.N(e9)
else if(A.H(e9))e9=e9?1:0
else e9=l3
if(e9==null)e9=0
f2=Math.max(0,e9)
f3=A.c4(f0.c.$1(a0))
if(f3==null)f3=B.dd
B.a.aa(b2)
B.a.aa(b3)
for(f4=0;f4<a5.length-1;){B.a.k(b2,a5[f4]);++f4
if(!(f4<a5.length))return A.a(a5,f4)
B.a.k(b3,a5[f4])}e9=h.h(0,e6)
if(e9==null){e9=f0.d
f5=B.b.ab(1,l5)
f6=new Float64Array(256)
f7=new Float64Array(256)
f8=new Float64Array(256)
f9=new Float64Array(256)
g0=new Float64Array(256)
g1=new Float64Array(256)
e9=new A.fQ(e6,b6,e9,-f5/8192,new A.bd(f6),new A.bd(f7),new A.bd(f8),new A.bd(f9),new A.bd(g0),new A.bd(g1),new A.bd(new Float64Array(256)),A.b([],b4),A.b([],b5))
h.n(0,e6,e9)
e6=e9}else e6=e9
e9=a4.a
f5=f0.e.$1(a0)
if(!(typeof f5=="number"))if(typeof f5=="string")f5=A.N(f5)
else if(A.H(f5))f5=f5?1:0
else f5=l3
if(f5==null)f5=0
f6=B.b.ab(1,l5)
g2=3.141592653589793-b1/f6
f7=Math.cos(Math.atan(0.5*(Math.exp(g2)-Math.exp(-g2))))
f8=f0.f
g3=f8==null?l3:f8.$1(a0)
C:{if(typeof g3=="string"){f8=g3.length!==0
g4=g3}else{g4=l3
f8=!1}if(f8){f8=g4
break C}f8=l3
break C}e6.hh(0,e9,b2,b3,f1,f2,f3,f8,f5/(40075016.68557849*f7)*f6*4096)
continue}g5=a1.$2(e6,e7)
if(e8===B.x){e3.$0()
e9=g5.c
if(e9==null){e6=a9.v(0,e6)
e9=B.b.ab(1,l5)
e9=g5.c=new A.j5(A.qU(!1,!1,!1),e6,b0,l9===e9-1)
e6=e9}else e6=e9
l2.eB(e6,d8.b,e)
continue}e4.$0()
if(e8===B.r){g6=g5.e
if(g6==null){g6=A.b([],a8)
g5.si7(g6)}g7=new A.kN(l2,g6)
for(f4=0;f4<a5.length-1;){g8=a5[f4]*2;++f4
g9=a5[f4]*2
for(h0=g8;h0<g9;h0+=2)g7.$1(h0)
e6=!1
if(d9.gL()===3)if(g9-g8>=6){e6=a4.a
e9=e6.length
if(!(g8<e9))return A.a(e6,g8)
f5=e6[g8]
f6=g9-2
if(!(f6>=0&&f6<e9))return A.a(e6,f6)
if(f5===e6[f6]){f5=g8+1
if(!(f5<e9))return A.a(e6,f5)
f5=e6[f5]
f6=g9-1
if(!(f6>=0&&f6<e9))return A.a(e6,f6)
f6=f5!==e6[f6]
e6=f6}else e6=!0}if(e6)g7.$1(g8)}continue}h1=g5.d
if(h1==null){e6=new Float64Array(512)
h1=g5.d=new A.jE(A.qU(!0,e7.w,e7.y),e7.as,e7.z,e6)}for(e6=e7.x,e9=e7.Q,f5=e7.ay,f6=e7.ax,f7=e7.at,f8=e7.r,f9=e7.ch,f4=0;f4<a5.length-1;f4=h2){g8=a5[f4]
h2=f4+1
g9=a5[h2]
if(d9.gL()===2){h3=e9&&e5?d9.a:l3
h4=h3!=null&&h3.length>f4*2+1
g0=a4.a
h5=f9==null?l3:f9.$1(a0)
D:{if("round"===h5){g1=B.J
break D}if("square"===h5){g1=B.K
break D}if("butt"===h5){g1=B.l
break D}g1=f8
break D}h6=f7==null?l3:f7.$1(a0)
E:{if("round"===h6){h7=B.a4
break E}if("bevel"===h6){h7=B.L
break E}if("miter"===h6){h7=B.t
break E}h7=l3
break E}h8=f6==null?l3:f6.$1(a0)
if(!(typeof h8=="number"))if(typeof h8=="string")h8=A.N(h8)
else if(A.H(h8))h8=h8?1:0
else h8=l3
if(h8==null)h8=l3
h9=f5==null?l3:f5.$1(a0)
if(!(typeof h9=="number"))if(typeof h9=="string")h9=A.N(h9)
else if(A.H(h9))h9=h9?1:0
else h9=l3
if(h9==null)h9=l3
if(h4){i0=f4*2
if(!(i0<h3.length))return A.a(h3,i0)
i0=h3[i0]}else i0=e9?0:l3
if(h4){i1=f4*2+1
if(!(i1<h3.length))return A.a(h3,i1)
i1=h3[i1]/d1}else i1=0
h1.c7(g0,g8,g9,f,g1,h7,h8,h9,i0,i1)
continue}i2=g9-g8
if(i2<3)continue
g0=l2.ax
g1=i2+1
if(g0.length<g1*2)g0=l2.ax=new Float64Array(g1*4)
h7=i2*2
B.o.a8(g0,0,h7,a4.a,g8*2)
g0=l2.ax
h8=g0.length
if(0>=h8)return A.a(g0,0)
h9=g0[0]
g0.$flags&2&&A.w(g0)
if(!(h7>=0&&h7<h8))return A.a(g0,h7)
g0[h7]=h9;++h7
if(1>=h8)return A.a(g0,1)
h9=g0[1]
if(!(h7<h8))return A.a(g0,h7)
g0[h7]=h9
if(e6)h1.hk(g0,0,g1)
else h1.hj(g0,0,g1,f,!0)}}for(e2=d0.gt(d6);e2.m();){e5=e2.gp()
i3={}
if(e5>>>0!==e5||e5>=a3.length)return A.a(a3,e5)
i4=a3[e5]
e6=i4.b
if(!e6.d.$1(a0))continue
i3.a=null
i5=A.xK(e6.e.$1(a0))
i6=i3.a=i5.a
i7=i5.b
e9=e6.f
i8=e9==null?"":A.U(e9.$1(a0))
if(A.pu(i6).length===0&&!B.d.v(i6,A.Q(57599))&&i8.length===0)continue
i9=A.t(e6.r.$1(a0))
j0=B.d.av(i9,"line")
f2=(a3.length-1-e5)*4096
j1=A.vq(i4,a0)
e9=e6.at.$1(a0)
if(!(typeof e9=="number"))if(typeof e9=="string")e9=A.N(e9)
else if(A.H(e9))e9=e9?1:0
else e9=l3
j2=(e9==null?0:e9)*3.141592653589793/180
e9=e6.ax
if(e9.gj(0)===0&&i7==null)j3=l3
else{f5=A.C(o,a2)
for(f6=e9.$ti,e9=new A.a0(e9,e9.gj(0),f6.i("a0<y.E>")),f6=f6.i("y.E");e9.m();){f7=e9.d
if(f7==null)f7=f6.a(f7)
if(B.d.av(f7,"$geometry:")){f8=$.p8.h(0,f7)
f8=f8==null?l3:f8.$1(a0)}else f8=a0.b.h(0,f7)
f5.n(0,f7,f8)}if(i7!=null)f5.n(0,"$format",i7)
j3=f5}if(d9.gL()===3&&!j0){e4.$0()
j4=l2.fh()
if(j4==null)continue
e5=new A.bp(e5,f2+j1,i3.a,j4.a,j4.b,l3,i8,j2,!1,!0)
e5.sah(j3)
B.a.k(j,e5)
continue}if(d9.gL()===1){if(j0)continue
e4.$0()
j5=l2.fG(e5,f2+j1,i3.a,i8,j2)
if(j5!=null){j5.sah(j3)
B.a.k(j,j5)}continue}e4.$0()
j6=Math.max(0,B.c.bz(e6.z-b))
e9=i9==="line-center"
j7=e9?1/0:e6.w*8/B.b.ab(1,j6)/c
j8=a0.a
a0.a=n
g2=i4.c.$1(a0)
if(!(typeof g2=="number"))if(typeof g2=="string"){f5=A.N(g2)
g2=f5}else{if(A.H(g2))f5=g2?1:0
else f5=l3
g2=f5}j9=g2!=null&&isFinite(g2)?g2:16
a0.a=j8
k0=j9*4096/512/c
if(j0&&i3.a.length!==0&&!e6.x){f5=A.b([],a6)
for(f4=0;f4<a5.length-1;){f6=a4.a
f7=a5[f4]*2;++f4
f5.push(new Float32Array(A.a2(new Float64Array(f6.subarray(f7,A.bl(f7,a5[f4]*2,f6.length))))))}e6=e6.as==null?50:j1
f6=i3.a
f7=l2.dw(i4,f6)
f8=i4.dU
if(f8==null)f8=0.7853981633974483
k1=new A.dt(f2+e6,f6,j7,f7*k0,k0,f8,j3,f5,i8)
if(i9==="line"&&f5.length!==0){e6=i.h(0,e5)
if(e6==null){e6=A.b([],a7)
i.n(0,e5,e6)
e5=e6}else e5=e6
J.pI(e5,k1)}else B.a.B(j,l2.fn(e5,k1,e9))
continue}if(!j0){k2=a4.a
for(e6=e6.as==null,e9=k2.length,f4=0;f4<a5.length-1;++f4){j4=a5[f4]*2
if(!(j4<e9))return A.a(k2,j4)
k3=k2[j4]
f5=j4+1
if(!(f5<e9))return A.a(k2,f5)
k4=k2[f5]
if(k3<0||k4<0||k3>=4096||k4>=4096)continue
f5=e6?50:j1
f5=new A.bp(e5,f2+f5,i3.a,k3,k4,l3,i8,j2,!1,!1)
f5.sah(j3)
B.a.k(j,f5)}continue}k5=i3.a.length===0&&!e6.y
if(i8.length===0)k6=0
else{e6=l2.b.h(0,i8)
e6=e6==null?l3:e6.a
if(e6==null)e6=0
f5=i4.id.$1(a0)
if(!(typeof f5=="number"))if(typeof f5=="string")f5=A.N(f5)
else if(A.H(f5))f5=f5?1:0
else f5=l3
k6=e6*(f5==null?1:f5)*k0/24}e6=i3.a
e6=e6.length===0?0:l2.dw(i4,e6)*k0
e6=Math.max(e6,k6)
f5=i4.dU
if(f5==null)f5=0.7853981633974483
l2.eF(j7,e6,k0,f5,e9,new A.kP(i3,j,e5,f2,i4,j1,i8,k5,j2,j3),i3.a.length!==0)}}}}for(r=new A.cw(i,i.$ti.i("cw<1,2>")).gt(0),q=t.gE;r.m();){n=r.d
k7=n.a
k8=A.C(o,q)
for(n=A.xX(n.b),a2=n.length,c6=0;c6<n.length;n.length===a2||(0,A.h)(n),++c6)B.a.B(j,l2.fo(k7,n[c6],k8))}k9=A.b([],t.hD)
B.a.aC(k,new A.kQ())
for(r=k.length,c6=0;c6<k.length;k.length===r||(0,A.h)(k),++c6){g5=k[c6]
g6=g5.e
if(g6!=null&&g6.length!==0){q=new Float32Array(A.a2(g6))
B.a.k(k9,new A.d4(g5.a,new A.eq(l3,q,l3,new Uint16Array(0),l3,l3,l3),g5.b))}q=g5.c
if(q==null)l0=l3
else{q=q.a
q.cn()
q=q.at
l0=q}if(l0==null){q=g5.d
if(q==null)l0=l3
else{q=q.a
q.cn()
q=q.at
l0=q}}if(l0==null)continue
for(q=l0.length,o=g5.a,n=g5.b,l1=0;l1<l0.length;l0.length===q||(0,A.h)(l0),++l1)B.a.k(k9,new A.d4(o,l0[l1],n))}l2.fY(j)
r=A.b([],t.dY)
for(q=new A.cy(h,h.r,h.e,h.$ti.i("cy<2>")),s=s.f.a;q.m();){o=q.d
o=o.hF(s.length!==0?Math.max(B.b.br(128,Math.min(l5,30)),2):0)
if(o!=null)r.push(o)}return new A.d5(l2.w?l2.h2(k9,l5,b):l3,k9,j,r)},
h2(a,b,c){var s,r
t.ke.a(a)
s=this.c
if(s.f.a.length===0)return A.qb(s,a,0,0,c)
r=Math.min(b,30)
return A.qb(s,a,Math.max(B.b.br(128,r),2),B.b.br(512,r),c)},
eF(a,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
t.hi.a(a4)
s=a5?0.6*a1:0
for(r=this.Q,q=r.c,p=2*a1,o=t.Y,n=0;n<q.length-1;){m=r.a
l=q[n]*2;++n
k=new Float32Array(A.a2(new Float64Array(m.subarray(l,A.bl(l,q[n]*2,m.length)))))
m=a3?A.b([k],o):A.rz(k)
l=m.length
j=0
for(;j<m.length;m.length===l||(0,A.h)(m),++j){i=m[j]
h=a3?A.nK(i,A.mt(i)/2,1/0,a0,s,a2):A.rG(i,a,a0,p,s,a2,this.ch)
for(g=h.length,f=0;f<h.length;h.length===g||(0,A.h)(h),++f){e=h[f]
d=e.a
c=e.b
if(a3)b=!(d>=0&&d<4096&&c>=0&&c<4096)
else b=!1
if(b)continue
a4.$3(d,c,e.c)}}}},
eP(a,b,c){var s,r,q,p,o,n,m,l
t.u.a(b)
s=a.gbA()
r=A.eo(s.length,new A.kI(this,s,a,c,b),!0,t.i)
q=s.length
p=J.oL(q,t.S)
for(o=0;o<q;++o)p[o]=o
B.a.aC(p,new A.kJ(r))
n=A.b([],t.fB)
for(m=p.length,l=0;l<p.length;p.length===m||(0,A.h)(p),++l){o=p[l]
if(!(o<s.length))return A.a(s,o)
n.push(s[o])}return n},
fh(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0=this.Q,c1=c0.a
for(c0=c0.c,s=c0.length,r=s-1,q=c1.length,p=-1,o=0,n=0;n<r;n=l){m=c0[n]
l=n+1
k=c0[l]
if(k-m<3)continue
j=k*2
i=j-2
if(!(i>=0&&i<q))return A.a(c1,i)
h=c1[i];--j
if(!(j>=0&&j<q))return A.a(c1,j)
g=c1[j]
for(f=m,e=0;f<k;++f,g=d,h=c){j=f*2
i=j+1
if(!(i<q))return A.a(c1,i)
d=c1[i]
if(!(j<q))return A.a(c1,j)
c=c1[j]
e+=h*d-c*g}if(e>o){o=e
p=n}}if(p<0)return null
if(!(p<s))return A.a(c0,p)
m=c0[p]
r=p+1
if(!(r<s))return A.a(c0,r)
k=c0[r]
for(f=m,b=1/0,a=1/0,a0=-1/0,a1=-1/0;f<k;++f){c0=f*2
if(!(c0<q))return A.a(c1,c0)
s=c1[c0]
b=Math.min(b,s)
a0=Math.max(a0,s);++c0
if(!(c0<q))return A.a(c1,c0)
c0=c1[c0]
a=Math.min(a,c0)
a1=Math.max(a1,c0)}a2=new A.kK(c1,k,m)
a3=(b+a0)/2
a4=(a+a1)/2
a5=a2.$2(a3,a4)
a6=(a0-b)/8
a7=(a1-a)/8
a8=b+a6/2
a9=a+a7/2
for(b0=0;b0<3;++b0,a4=b1,a3=b2,a8=0,a9=0){for(c0=b0===0,b1=a4,b2=a3,b3=0;b3<8;++b3)for(b4=a4+(b3-3.5)*a7,b5=a9+b3*a7,b6=0;b6<8;++b6){b7=c0?a8+b6*a6:a3+(b6-3.5)*a6
b8=c0?b5:b4
b9=a2.$2(b7,b8)
if(b9>a5){a5=b9
b1=b8
b2=b7}}a6/=4
a7/=4}if(a5<=0)return null
if(a3<0||a4<0||a3>=4096||a4>=4096)return null
return new A.z(a3,a4)},
fT(a){var s,r,q,p,o=this.Q,n=o.a
for(o=o.b,s=n.length,r=n.$flags|0,q=0;q<o;++q){if(!(q<s))return A.a(n,q)
p=n[q]
r&2&&A.w(n)
n[q]=p*a}},
eB(b2,b3,b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6=this,a7={},a8=a6.Q,a9=a8.a,b0=a8.b,b1=a6.ax
if(b0>b1.length)b0=a6.ax=new Float64Array(b0*2)
else b0=b1
s=b4*b4
r=s*4
a7.a=0
a7.b=-1
b1=a6.ay
B.a.aa(b1)
q=new A.kH(a7,a6,b2,b0)
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
n&2&&A.w(b0)
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
if(i>=0){b2.dG(b0,i,j,b1)
B.a.aa(b1)}a7.b=j}else{i=a7.b
if(i>=0)B.a.k(b1,j-i)
else a7.a=j}}q.$0()},
fG(a,b,c,d,e){var s,r,q,p=this.Q
if(p.b<2)return null
p=p.a
s=p.length
if(0>=s)return A.a(p,0)
r=p[0]
if(1>=s)return A.a(p,1)
q=p[1]
if(r<0||q<0||r>=4096||q>=4096)return null
return new A.bp(a,b,c,r,q,null,d,e,!1,!1)},
dw(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h=A.pu(b),g=a.z?h.toUpperCase():h,f=i.f
if(f!=null){s=f.hA(a.y)
r=A.b([],t.t)
q=A.a1(new A.ar(g),t.J.i("f.E"))
q=A.xJ(q)
p=q.length
o=0
for(;o<q.length;q.length===p||(0,A.h)(q),++o){n=q[o]
if(n>=0)r.push(n)}if(f.i9(s,A.dy(r,0,null))){for(q=r.length,p=f.r,m=s-512,l=a.at,k=0,o=0;o<r.length;r.length===q||(0,A.h)(r),++o){n=r[o]
if(!(m>=0&&m<p.length))return A.a(p,m)
j=p[m].h(0,n)
if(j!=null)k+=j.r/24+l}return k}i.r=!0}r=i.CW
q=r.h(0,b)
if(q==null){q=new A.kM(i,b,g,a).$0()
r.n(0,b,q)
r=q}else r=q
return r},
d8(a7,a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=a8.c,a2=new A.kL(t.jT.a(b0),a8,a1/2),a3=A.b([],t.oM),a4=a8.e,a5=0.6*a4,a6=2*a4
for(a4=a8.w,s=a4.length,r=a8.a,q=a8.b,p=a8.x,o=a8.r,n=a8.d,m=a8.f,l=t.Y,k=0;k<a4.length;a4.length===s||(0,A.h)(a4),++k){j=a4[k]
i=a9?A.b([j],l):A.rz(j)
h=i.length
g=0
for(;g<i.length;i.length===h||(0,A.h)(i),++g){f=i[g]
e=a9?A.nK(f,A.mt(f)/2,1/0,n,a5,m):A.rG(f,a1,n,a6,a5,m,this.ch)
d=e.length
c=0
for(;c<e.length;e.length===d||(0,A.h)(e),++c){b=e[c]
a=b.a
a0=b.b
if(a9)b=!(a>=0&&a<4096&&a0>=0&&a0<4096)
else b=!1
if(b)continue
if(a2.$2(a,a0))continue
b=new A.bp(a7,r,q,a,a0,f,p,0,!1,!1)
b.sah(o)
B.a.k(a3,b)}}}return a3},
fn(a,b,c){return this.d8(a,b,c,null)},
fo(a,b,c){return this.d8(a,b,!1,c)},
shN(a){this.b=t.a.a(a)}}
A.kR.prototype={
$2(a,b){var s=this.a
if(b>s)s=this.b||a<s+1
else s=!1
return s},
$S:13}
A.kT.prototype={
$2(a,b){var s,r,q,p,o,n,m,l,k,j=this,i=b.CW,h=i.length
if(h===0){h=j.a
if(!(a>=0&&a<h.length))return A.a(h,a)
s=h[a]
if(s==null){s=new A.aL(a,null)
B.a.n(h,a,s)
B.a.k(j.b,s)}return s}r=[]
for(q=j.c,p=0;p<i.length;i.length===h||(0,A.h)(i),++p){o=i[p]
if(B.d.av(o,"$geometry:")){n=$.p8.h(0,o)
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
return h}B.a.n(q,a,n+1)
q=A.C(t.N,t.O)
for(k=0;k<i.length;++k){if(!(k<r.length))return A.a(r,k)
n=r[k]
if(n!=null)q.n(0,i[k],n)}s=new A.aL(a,q)
B.a.n(j.f,a,s)
h.n(0,m,s)
B.a.k(j.b,s)
return s},
$S:97}
A.kS.prototype={
$0(){var s=this.a
if(s.a)return
s.a=!0
s=this.b.Q
s.b=0
B.a.aa(s.c)
this.c.cu(s)},
$S:0}
A.kU.prototype={
$0(){var s,r
this.c.$0()
s=this.a
r=s.b
if(r!==1){this.b.fT(r)
s.b=1}},
$S:0}
A.kO.prototype={
$0(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this
c.c.$0()
s=c.a.b/4096
r=B.b.ab(1,c.d)
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
B.a.B(j,A.b([(n+e*s)/r*360-180,Math.atan((Math.exp(d)-Math.exp(-d))/2)*180/3.141592653589793],l));++i}q.push(j)}return q},
$S:98}
A.kN.prototype={
$1(a){var s,r,q,p=this.a.Q.a,o=p.length
if(!(a<o))return A.a(p,a)
s=p[a]
r=a+1
if(!(r<o))return A.a(p,r)
q=p[r]
if(s<0||q<0||s>=4096||q>=4096)return
p=this.b
B.a.k(p,s)
B.a.k(p,q)},
$S:40}
A.kP.prototype={
$3(a,b,c){var s=this,r=s.e.b.as==null?50:s.f,q=s.a.a,p=s.w,o=s.x
if(p)o=c+o
p=new A.bp(s.c,s.d+r,q,a,b,null,s.r,o,p,!0)
p.sah(s.y)
return B.a.k(s.b,p)},
$S:99}
A.kQ.prototype={
$2(a,b){var s=t.ct
return s.a(a).a-s.a(b).a},
$S:100}
A.kI.prototype={
$1(a){var s,r=this,q=r.b
if(!(a<q.length))return A.a(q,a)
s=q[a].bv(r.c)
q=r.d
if(q!=null&&s.h(0,q)!=null)s.n(0,"$id",s.h(0,q))
q=r.a.z
q.sah(s)
q=A.D(r.e.$1(q))
return q==null?0:q},
$S:17}
A.kJ.prototype={
$2(a,b){var s,r,q,p
A.E(a)
A.E(b)
s=this.a
r=s.length
if(!(a>=0&&a<r))return A.a(s,a)
q=s[a]
if(!(b>=0&&b<r))return A.a(s,b)
p=B.c.a6(q,s[b])
return p!==0?p:B.b.a6(a,b)},
$S:101}
A.kK.prototype={
$2(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this.a,e=this.b,d=e*2,c=d-2,b=f.length
if(!(c>=0&&c<b))return A.a(f,c)
s=f[c];--d
if(!(d>=0&&d<b))return A.a(f,d)
r=f[d]
for(q=this.c,p=!1,o=1/0;q<e;++q,r=m,s=n){d=q*2
if(!(d<b))return A.a(f,d)
n=f[d];++d
if(!(d<b))return A.a(f,d)
m=f[d]
if(r>a0!==m>a0&&a<(n-s)*(a0-r)/(m-r)+s)p=!p
l=n-s
k=m-r
j=l*l+k*k
i=B.c.E(j===0?0:((a-s)*l+(a0-r)*k)/j,0,1)
h=s+l*i-a
g=r+k*i-a0
o=Math.min(o,h*h+g*g)}return p?o:-o},
$S:32}
A.kH.prototype={
$0(){var s=this,r=s.a,q=r.b
if(q>=0)s.c.dG(s.d,q,r.a,s.b.ay)
r.b=-1
B.a.aa(s.b.ay)},
$S:0}
A.kM.prototype={
$0(){var s,r=this,q=r.a.e
if(q==null)return new A.ar(r.b).gj(0)*0.55
s=r.d
s=A.rF(q,r.c,0,s.at,1.2,1/0,!0,s.y,s.w)
s=s==null?null:s.e
return s==null?new A.ar(r.b).gj(0)*0.55:s},
$S:102}
A.kL.prototype={
$2(a,b){var s,r,q,p,o,n,m=this.a
if(m==null)return!1
s=this.b.b
r=m.h(0,s)
if(r==null){r=A.b([],t.I)
m.n(0,s,r)}for(m=r.length,s=this.c,s*=s,q=0;q<m;++q){p=r[q]
o=p.a-a
n=p.b-b
if(o*o+n*n<s)return!0}B.a.k(r,new A.z(a,b))
return!1},
$S:13}
A.dt.prototype={
sie(a){this.w=t.iu.a(a)}}
A.oh.prototype={
$3$end(a,b,c){var s,r,q=a+":",p=b.length
if(c){s=p-2
if(!(s>=0))return A.a(b,s)
s=b[s]
r=p-1
if(!(r>=0))return A.a(b,r)
r=q+A.t(s)+":"+A.t(b[r])
q=r}else{if(0>=p)return A.a(b,0)
s=b[0]
if(1>=p)return A.a(b,1)
s=q+A.t(s)+":"+A.t(b[1])
q=s}return q},
$S:103}
A.nU.prototype={
$0(){var s=this.a,r=s.a
if(r.length>=4)B.a.k(this.b,new Float32Array(A.a2(r)))
s.a=A.b([],t.n)},
$S:0}
A.lV.prototype={
$1(a){var s=this.a,r=a*2
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
$S:17}
A.lW.prototype={
$1(a){var s=this.a,r=a*2+1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
$S:17}
A.lU.prototype={
$4(a,b,c,d){var s=c-a,r=d-b
return Math.sqrt(s*s+r*r)},
$S:104}
A.b7.prototype={
gaQ(){var s=this.d,r=this.a
return s>r?s:r},
C(a,b){var s=this
if(b==null)return!1
return b instanceof A.b7&&b.a===s.a&&b.b===s.b&&b.c===s.c&&b.gaQ()===s.gaQ()},
gR(a){var s=this,r=s.a
return(r*4194304+s.b)*4194304+s.c+s.gaQ()-r},
q(a){var s=this,r=s.a,q=""+r+"/",p=""+s.b,o=""+s.c
return s.gaQ()>r?q+p+"/"+o+"@"+s.gaQ():q+p+"/"+o}}
A.l_.prototype={
hC(a,b,c){var s,r=this,q=r.w
if(q!=null){s=r.r
s=s==null?null:!s.gdn()
s=s===!0}else s=!0
if(s)return null
return q+"/"+r.c+"/"+a+"/"+b+"/"+c+r.e},
bF(a,b,c){var s=0,r=A.aw(t.nh),q,p=this,o,n
var $async$bF=A.ax(function(d,e){if(d===1)return A.at(e,r)
for(;;)switch(s){case 0:if(!p.b.hJ(a,b,c)){q=new Uint8Array(0)
s=1
break}o=p.hC(a,b,c)
s=3
return A.Y(p.bs(a,b,c),$async$bF)
case 3:n=e
if(o!=null&&n!=null&&!B.j.gA(n))A.pA(o,n).b9(new A.l0(),new A.l1(),t.o)
q=n
s=1
break
case 1:return A.au(q,r)}})
return A.av($async$bF,r)},
bs(a,b,c){var s=0,r=A.aw(t.nh),q,p=this,o,n,m,l,k
var $async$bs=A.ax(function(d,e){if(d===1)return A.at(e,r)
for(;;)switch(s){case 0:k=p.r
if(k!=null){q=k.au(a,b,c)
s=1
break}o=p.b.c?B.b.ab(1,a)-1-c:c
s=3
return A.Y(A.o4(p.d,p.a,a,b,o,p.f),$async$bs)
case 3:n=e
m=n.a
l=n.b
o=l.a
if(o===204){q=new Uint8Array(0)
s=1
break}if(o===404){q=null
s=1
break}if(o!==200)throw A.e(A.qc(o,m))
q=l.b
s=1
break
case 1:return A.au(q,r)}})
return A.av($async$bs,r)}}
A.l0.prototype={
$1(a){},
$S:105}
A.l1.prototype={
$1(a){},
$S:19}
A.bd.prototype={
b3(a,b){var s,r,q,p=this,o=p.b+2
if(o>p.a.length)p.bk(o)
o=p.a
s=p.b
r=p.b=s+1
o.$flags&2&&A.w(o)
q=o.length
if(!(s<q))return A.a(o,s)
o[s]=a
p.b=r+1
if(!(r<q))return A.a(o,r)
o[r]=b},
ap(a,b,c,d){var s,r,q,p=this,o=p.b+4
if(o>p.a.length)p.bk(o)
o=p.a
s=p.b
r=p.b=s+1
o.$flags&2&&A.w(o)
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
bk(a){var s,r=this.a,q=r.length*2
while(q<a)q*=2
s=new Float64Array(q)
B.o.Z(s,0,this.b,r)
this.a=s},
gj(a){return this.b}}
A.ju.prototype={
k(a,b){var s=this,r=s.b,q=s.a,p=q.length
if(r===p){p=new Uint32Array(p*2)
B.S.Z(p,0,r,q)
s.a=p
r=p}else r=q
q=s.b++
r.$flags&2&&A.w(r)
if(!(q<r.length))return A.a(r,q)
r[q]=b},
gj(a){return this.b}}
A.ou.prototype={
$2(a,b){t.a2.a(b)},
$S:106}
A.ot.prototype={
$1(a){return this.a.$1(t.ec.a(a).bb())},
$S:107}
A.ov.prototype={
$1(a){t.a.a(a)
this.a.shN(a)
return a},
$S:108}
A.oB.prototype={
$1(a){var s=this.a
return A.q6(a,s.f,s.r,s.co(""))},
$S:109}
A.ow.prototype={
$0(){var s=0,r=A.aw(t.my),q,p=2,o=[],n=this,m,l,k,j
var $async$$0=A.ax(function(a,b){if(a===1){o.push(b)
s=p}for(;;)switch(s){case 0:k=n.a
if(typeof k!="string"){q=n.b.$1(k)
s=1
break}p=4
s=7
return A.Y(n.c.bc(k,n.d.e.c),$async$$0)
case 7:m=b
k=n.b.$1(B.e.dT(B.y.dS(m.b),null))
q=k
s=1
break
p=2
s=6
break
case 4:p=3
j=o.pop()
k=A.q6(null,null,!1,null)
q=k
s=1
break
s=6
break
case 3:s=2
break
case 6:case 1:return A.au(q,r)
case 2:return A.at(o.at(-1),r)}})
return A.av($async$$0,r)},
$S:110}
A.ox.prototype={
$1(a){var s=0,r=A.aw(t.p),q,p=this,o,n,m,l,k,j,i
var $async$$1=A.ax(function(b,c){if(b===1)return A.at(c,r)
for(;;)switch(s){case 0:n=a.a
m=a.b
l=a.c
k=(n*4194304+m)*4194304+l
j=p.b
i=j.ar(0,k)
if(i!=null){j.n(0,k,i)
q=i
s=1
break}s=3
return A.Y(p.a.a.bF(n,m,l),$async$$1)
case 3:o=c
if(o==null)o=new Uint8Array(0)
j.n(0,k,o)
if(j.a>24)j.ar(0,new A.an(j,A.r(j).i("an<1>")).gu(0))
q=o
s=1
break
case 1:return A.au(q,r)}})
return A.av($async$$1,r)},
$S:111}
A.oy.prototype={
$1(a){var s=0,r=A.aw(t.mm),q,p=this,o,n
var $async$$1=A.ax(function(b,c){if(b===1)return A.at(c,r)
for(;;)switch(s){case 0:n=p.a.b
s=n!=null?3:4
break
case 3:s=5
return A.Y(n,$async$$1)
case 5:q=c.au(a.a,a.b,a.c)
s=1
break
case 4:s=6
return A.Y(p.b.$1(a),$async$$1)
case 6:o=c
if(o.length===0)n=B.a8
else{n=A.uD(o).a
n=new A.b2(n,A.r(n).i("b2<2>"))}q=n
s=1
break
case 1:return A.au(q,r)}})
return A.av($async$$1,r)},
$S:112}
A.oz.prototype={
$1(b3){var s=0,r=A.aw(t.ec),q,p=2,o=[],n=this,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2
var $async$$1=A.ax(function(b4,b5){if(b4===1){o.push(b5)
s=p}for(;;)switch(s){case 0:a7={}
a8=null
a7.a=a7.b=null
a=b3 instanceof A.e1
a0=null
if(a){a8=b3.a
a1=b3.b
a7.b=a1
a7.a=b3.c
a0=a1}s=a?3:4
break
case 3:p=6
m=Date.now()
s=9
return A.Y(n.b.$1(a0),$async$$1)
case 9:l=b5
b=a0.a
a=a0.b
a0=a0.c
a2=Date.now()
a3=m
if(typeof a3!=="number"){q=A.ah(a3)
s=1
break}a4=t.z
A.qO("vmap.tile.fetched",A.en(["id",""+b+"/"+a+"/"+a0,"ms",""+B.c.N(a2-a3,1000)],a4,a4))
k=Date.now()
a3=n.c
j=new A.oA(a7,n.a,a3,l)
b=n.d
s=b!=null?10:11
break
case 10:s=12
return A.Y(b,$async$$1)
case 12:case 11:i=J.d_(l)?new A.d5(null,B.a7,B.cr,B.cs):j.$0()
s=J.oF(l)&&a3.r&&n.e!=null?13:14
break
case 13:h=0
b=t.o
a=n.e
case 15:a0=h
if(typeof a0!=="number"){q=a0.eg()
s=1
break}if(!(a0<300&&a.w.a-a.x.a>0)){s=16
break}s=17
return A.Y(A.u0(B.az,b),$async$$1)
case 17:a0=h
if(typeof a0!=="number"){q=a0.bI()
s=1
break}h=a0+1
s=15
break
case 16:i=j.$0()
case 14:b=a7.b
a=Date.now()
a0=k
if(typeof a0!=="number"){q=A.ah(a0)
s=1
break}A.qO("vmap.tile.built",A.en(["id",""+b.a+"/"+b.b+"/"+b.c,"ms",""+B.c.N(a-a0,1000)],a4,a4))
a4=a8
a0=i
q=new A.hE(a0,a4)
s=1
break
p=2
s=8
break
case 6:p=5
a9=o.pop()
g=A.bn(a9)
b=a8
a=A.t(g)
q=new A.hG(a,b)
s=1
break
s=8
break
case 5:s=2
break
case 8:case 4:f=null
a=b3 instanceof A.ed
if(a)f=b3
s=a?18:19
break
case 18:p=21
b=f.a
b2=A
s=24
return A.Y(n.b.$1(f.b),$async$$1)
case 24:a=b2.xZ(b5,n.f,n.r,f.c,f.d,f.e,f.f,f.r)
q=new A.ec(a,b)
s=1
break
p=2
s=23
break
case 21:p=20
b0=o.pop()
b=f.a
q=new A.ec(B.cA,b)
s=1
break
s=23
break
case 20:s=2
break
case 23:case 19:e=null
a=b3 instanceof A.dZ
if(a)e=b3
s=a?25:26
break
case 25:d=e.c
p=28
a=n.a.b
s=a==null?31:33
break
case 31:b5=null
s=32
break
case 33:s=34
return A.Y(a,$async$$1)
case 34:b5=b5.r
case 32:c=b5
b=null
switch(e.b.a){case 0:a=e.a
a0=c
if(a0==null)a0=null
else{a2=A.E(d)
a6=a0.f.h(0,a2)
a0=a6==null?null:a6.f+1}b=new A.e3(a0,a)
break
case 1:a=e.a
a0=c
b=new A.d9(A.rp(a0==null?null:a0.dN(d)),a)
break
case 2:a=e.a
a0=c
b=new A.d9(A.rp(a0==null?null:a0.hV(d,e.d,e.e)),a)
break}b=b
q=b
s=1
break
p=2
s=30
break
case 28:p=27
b1=o.pop()
b=e.b===B.a0?new A.e3(null,e.a):new A.d9(B.cD,e.a)
q=b
s=1
break
s=30
break
case 27:s=2
break
case 30:case 26:case 1:return A.au(q,r)
case 2:return A.at(o.at(-1),r)}})
return A.av($async$$1,r)},
$S:113}
A.oA.prototype={
$0(){var s,r=this,q=r.a,p=q.b
p=r.c.ho(r.d,p.a,q.a,p.gaQ(),p.b,p.c)
q=q.b
s=r.b.b==null?1024:16777216
p.hT(q.a,q.b,q.c,s)
return p},
$S:114}
A.op.prototype={
$1(a){var s,r,q,p=null,o=A.aV(a).data,n=o==null?p:A.pc(t.dM.a(o))
o=this.a
s=o.a
if(s!=null){o=A.r(s)
o.c.a(n)
r=s.b
if(r>=4)A.p(s.eK())
if((r&1)!==0)s.c2(n)
else if((r&3)===0)s.f4().k(0,new A.cN(n,o.i("cN<1>")))
return p}r=t.cI
q=new A.dD(p,p,p,p,r)
o.a=q
o=this.b
o.postMessage(null)
n.toString
A.ir(n,new A.oo(o),new A.dH(q,r.i("dH<1>")))},
$S:115}
A.oo.prototype={
$1(a){var s=A.b([],t.kG),r=A.pe(a,s)
this.a.postMessage(r,s)},
$S:12};(function aliases(){var s=J.c_.prototype
s.ek=s.q
s=A.y.prototype
s.cN=s.a8})();(function installTearOffs(){var s=hunkHelpers._static_2,r=hunkHelpers._instance_1i,q=hunkHelpers._static_1,p=hunkHelpers._static_0,o=hunkHelpers._instance_2u,n=hunkHelpers._instance_0u,m=hunkHelpers._instance_1u
s(J,"ww","uq",116)
r(A.b0.prototype,"gdR","v",16)
r(A.bW.prototype,"gdR","v",16)
q(A,"xb","vu",23)
q(A,"xc","vv",23)
q(A,"xd","vw",23)
p(A,"ry","x3",0)
s(A,"xe","wS",22)
o(A.L.prototype,"geT","eU",22)
var l
n(l=A.cM.prototype,"gdd","bn",0)
n(l,"gde","bo",0)
n(l=A.dE.prototype,"gdd","bn",0)
n(l,"gde","bo",0)
m(l=A.cV.prototype,"gfv","fw",12)
o(l,"gfB","fC",22)
n(l,"gfz","fA",0)
q(A,"xm","wj",39)
q(A,"xs","u1",118)
q(A,"xt","u2",119)
q(A,"xz","uc",120)
s(A,"o5","wO",9)
q(A,"xA","uh",121)
o(A.cs.prototype,"gfL","fM",56)
s(A,"rE","wW",29)
s(A,"rD","wV",29)
s(A,"o6","wR",3)
q(A,"xr","ay",123)
m(A.bv.prototype,"gfc","d3",12)
q(A,"pt","jQ",124)
m(A.hg.prototype,"gdj","c1",12)
m(l=A.hw.prototype,"geD","eE",10)
m(l,"gew","ex",10)
m(l,"ger","es",10)
m(l,"gey","ez",10)
m(l,"geu","ev",10)
q(A,"y9","vn",25)
q(A,"xV","y5",6)
q(A,"xU","y2",6)
q(A,"xS","rA",6)
q(A,"xW","ya",6)
q(A,"xP","x9",6)
q(A,"xQ","xa",6)
q(A,"xR","xf",6)
q(A,"xT","xL",6)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.m,null)
q(A.m,[A.oN,J.fY,A.eD,J.aY,A.f,A.e2,A.P,A.bQ,A.W,A.y,A.kb,A.a0,A.ep,A.eR,A.eL,A.eI,A.e9,A.cK,A.bx,A.a3,A.bG,A.bj,A.dc,A.bK,A.bA,A.l3,A.jN,A.ea,A.f6,A.jF,A.em,A.cy,A.cx,A.dk,A.ic,A.eS,A.eK,A.ii,A.lM,A.b4,A.i3,A.il,A.lJ,A.hO,A.fa,A.ai,A.l2,A.hU,A.b8,A.L,A.hP,A.dx,A.f7,A.hQ,A.dE,A.eW,A.b9,A.cV,A.fh,A.ib,A.cT,A.f_,A.db,A.fG,A.lA,A.lP,A.im,A.be,A.hX,A.he,A.eJ,A.lg,A.ee,A.a9,A.ad,A.ij,A.dw,A.b6,A.jM,A.bL,A.c3,A.hB,A.kc,A.iS,A.br,A.i_,A.i1,A.i2,A.i0,A.lh,A.fU,A.js,A.e_,A.iy,A.dB,A.ds,A.dh,A.ie,A.i7,A.iY,A.fZ,A.bP,A.fJ,A.d1,A.bs,A.di,A.cr,A.h5,A.jn,A.aF,A.f0,A.eT,A.i4,A.cs,A.hp,A.ef,A.aA,A.cR,A.bI,A.dK,A.aJ,A.jB,A.ht,A.eF,A.aC,A.bY,A.jg,A.jL,A.hq,A.hr,A.hk,A.hj,A.hs,A.bJ,A.kf,A.bo,A.e0,A.lF,A.i6,A.eE,A.o,A.az,A.iz,A.iR,A.ik,A.aZ,A.jX,A.ab,A.A,A.cL,A.fu,A.fQ,A.bu,A.bU,A.bv,A.hZ,A.ia,A.dF,A.ji,A.ke,A.bz,A.id,A.jl,A.jo,A.jI,A.es,A.er,A.fS,A.cd,A.hg,A.cF,A.jt,A.ex,A.j4,A.jU,A.i5,A.eY,A.la,A.cb,A.aE,A.fA,A.hF,A.bh,A.e5,A.kZ,A.lC,A.fg,A.hw,A.j0,A.j3,A.eb,A.d3,A.bg,A.jr,A.kD,A.hA,A.kV,A.dC,A.ft,A.c8,A.oX,A.hy,A.kC,A.hz,A.eq,A.lf,A.j5,A.jE,A.d4,A.bp,A.d5,A.aL,A.kG,A.dt,A.b7,A.l_,A.bd,A.ju])
q(J.fY,[J.eh,J.ej,J.ek,J.dl,J.dm,J.dj,J.bZ])
q(J.ek,[J.c_,J.l,A.c0,A.eu])
q(J.c_,[J.hi,J.cJ,J.by])
r(J.h_,A.eD)
r(J.jx,J.l)
q(J.dj,[J.ei,J.h0])
q(A.f,[A.cc,A.x,A.cz,A.aK,A.cI,A.bB,A.bH,A.bw,A.cQ,A.hN,A.ih,A.dL,A.ar])
q(A.cc,[A.cj,A.fi])
r(A.eX,A.cj)
r(A.eV,A.fi)
r(A.bq,A.eV)
q(A.P,[A.ck,A.b1,A.i8])
q(A.bQ,[A.fz,A.iA,A.fy,A.hC,A.o8,A.oa,A.lc,A.lb,A.lS,A.lr,A.lu,A.ki,A.jG,A.ly,A.ok,A.ol,A.jb,A.jc,A.jw,A.iF,A.jC,A.mz,A.iM,A.kh,A.jh,A.kd,A.jZ,A.k5,A.k4,A.k2,A.k3,A.k6,A.k7,A.k9,A.lZ,A.m3,A.nZ,A.o_,A.nX,A.nY,A.nV,A.nW,A.m7,A.m8,A.m9,A.ma,A.mb,A.mc,A.md,A.me,A.mf,A.nQ,A.mD,A.nF,A.nG,A.mE,A.mF,A.mG,A.mR,A.n1,A.nc,A.nn,A.ny,A.nB,A.nC,A.nD,A.mH,A.mB,A.mI,A.mJ,A.mK,A.mL,A.mM,A.mN,A.mO,A.mP,A.mQ,A.mS,A.mT,A.mU,A.mV,A.mW,A.mX,A.mY,A.mZ,A.n_,A.n0,A.n2,A.n3,A.n4,A.n5,A.n6,A.n7,A.n8,A.n9,A.na,A.nb,A.nd,A.ne,A.nf,A.ng,A.nh,A.mA,A.ni,A.nj,A.nk,A.nl,A.nm,A.no,A.np,A.nq,A.nr,A.ns,A.nt,A.nu,A.nv,A.nw,A.nx,A.nz,A.nA,A.m_,A.m0,A.mh,A.lX,A.ml,A.mm,A.mn,A.mo,A.mp,A.mq,A.mk,A.mr,A.ms,A.m1,A.m2,A.j2,A.j9,A.od,A.oc,A.jp,A.jT,A.jP,A.jS,A.jR,A.mx,A.jW,A.l8,A.nN,A.nO,A.on,A.oq,A.kn,A.km,A.kl,A.kx,A.kw,A.kz,A.ku,A.kp,A.kr,A.ks,A.kE,A.kW,A.kX,A.kY,A.kB,A.j6,A.kN,A.kP,A.kI,A.oh,A.lV,A.lW,A.lU,A.l0,A.l1,A.ot,A.ov,A.oB,A.ox,A.oy,A.oz,A.op,A.oo])
q(A.fz,[A.iB,A.jy,A.o9,A.lT,A.nR,A.ls,A.lv,A.jH,A.lB,A.iZ,A.iT,A.iU,A.m5,A.iC,A.iD,A.iE,A.jD,A.iV,A.iW,A.iX,A.iH,A.iG,A.iI,A.iK,A.iJ,A.iL,A.iN,A.iO,A.iP,A.k_,A.k0,A.kg,A.lw,A.jY,A.k8,A.mg,A.nE,A.jd,A.jf,A.lY,A.mj,A.jJ,A.om,A.nP,A.kt,A.kR,A.kT,A.kQ,A.kJ,A.kK,A.kL,A.ou])
q(A.W,[A.dn,A.bE,A.h1,A.hL,A.ho,A.hY,A.el,A.fr,A.aX,A.eQ,A.hK,A.c6,A.fC])
r(A.dA,A.y)
r(A.da,A.dA)
q(A.fy,[A.oi,A.ld,A.le,A.lK,A.ja,A.li,A.ln,A.lm,A.lk,A.lj,A.lq,A.lp,A.lo,A.lt,A.kj,A.lI,A.lH,A.lD,A.lG,A.nL,A.lO,A.lN,A.nH,A.mi,A.nT,A.nS,A.iQ,A.k1,A.mw,A.nM,A.ka,A.mC,A.j1,A.je,A.jk,A.jj,A.oe,A.jm,A.jK,A.jV,A.l9,A.ky,A.kk,A.ko,A.kS,A.kU,A.kO,A.kH,A.kM,A.nU,A.ow,A.oA])
q(A.x,[A.a_,A.e8,A.an,A.b2,A.cw,A.eZ])
q(A.a_,[A.bC,A.ao,A.bi,A.i9])
r(A.co,A.cz)
r(A.e7,A.cI)
r(A.dg,A.bB)
r(A.cn,A.bw)
q(A.bj,[A.dI,A.dJ])
r(A.z,A.dI)
r(A.aM,A.dJ)
q(A.dc,[A.aj,A.bV])
q(A.bA,[A.dd,A.f5])
q(A.dd,[A.b0,A.bW])
r(A.ey,A.bE)
q(A.hC,[A.hu,A.d2])
r(A.cu,A.b1)
r(A.du,A.c0)
q(A.eu,[A.et,A.ap])
q(A.ap,[A.f1,A.f3])
r(A.f2,A.f1)
r(A.c1,A.f2)
r(A.f4,A.f3)
r(A.aI,A.f4)
q(A.c1,[A.cA,A.cB])
q(A.aI,[A.hb,A.cC,A.hc,A.cE,A.ev,A.ew,A.c2])
r(A.fb,A.hY)
r(A.eU,A.hU)
r(A.dD,A.f7)
r(A.f9,A.dx)
r(A.dH,A.f9)
r(A.cM,A.dE)
r(A.cN,A.eW)
r(A.ig,A.fh)
r(A.cS,A.f5)
q(A.db,[A.fO,A.h2])
r(A.h3,A.el)
q(A.fG,[A.jA,A.jz,A.l7,A.l6])
r(A.lz,A.lA)
r(A.hM,A.fO)
q(A.aX,[A.eB,A.fX])
q(A.hX,[A.c9,A.eM,A.hd,A.bR,A.ci,A.df,A.cv,A.dp,A.aT])
q(A.bP,[A.hR,A.hS,A.hT])
q(A.bs,[A.hV,A.hW])
q(A.aF,[A.eG,A.ez,A.fH,A.h6,A.h7,A.h8,A.de,A.d7])
q(A.aA,[A.eH,A.ha,A.fq,A.h4,A.fD,A.fE,A.fF,A.fv,A.fw,A.fx,A.hn])
q(A.eF,[A.dY,A.fI])
q(A.cb,[A.e1,A.ed,A.dZ])
q(A.aE,[A.hH,A.ec,A.e3,A.d9])
q(A.hH,[A.hE,A.hG])
q(A.bh,[A.fW,A.hI])
q(A.hI,[A.hf,A.fV,A.fB,A.hD])
q(A.bg,[A.h9,A.ct])
q(A.h9,[A.bf,A.dq,A.d8])
q(A.dC,[A.bX,A.eP])
s(A.dA,A.bG)
s(A.fi,A.y)
s(A.f1,A.y)
s(A.f2,A.a3)
s(A.f3,A.y)
s(A.f4,A.a3)
s(A.dD,A.hQ)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{c:"int",d:"double",aq:"num",q:"String",B:"bool",ad:"Null",j:"List",m:"Object",S:"Map",O:"JSObject"},mangledNames:{},types:["~()","B(A)","m?(A)","B(c,c)","q(A)","d(d)","d(aq)","B(@)","c()","B(aC,c)","~(fg)","d(A)","~(m?)","B(d,d)","c(c)","d?(A)","B(m?)","d(c)","ab?(A)","ad(@)","~(@)","c(d)","~(m,b5)","~(~())","d(d,d,d,d,d,d)","B(j<d>)","j<bs>()","bP(c)","c(A)","bI(o,c)","B(d)","@()","d(d,d)","~(m?,m?)","c(aC)","ad(m,b5)","ad()","@(q)","~(c,c,c)","@(@)","~(c)","B(q)","q(q)","d(c,d)","ad(@,b5)","m(A)","~(c,@)","m?(m?)","ad(~())","m?(A,m?)","m?(A)(c)","j<m?(A)>()","m?(A)(d(d))","O?()","S<q,m?>(A)","j<m?>(A)","B(ef,c)","j<d>?(A)","c(m?,c)","cR(c)","cL(A)","j<q>(A)","dB(c)","j<@>?(A)","O()","bU(A)","c?(A)","@(A)","c(bL,bL)","d(d,d,d)","~(d,d,d,d,d,d,d,d)","q(bu)","B(bu)","~(d,d)","q(c)","c?(c)","j<c>()","c3()","c(br,br)","d(d,+(j<d>,d))","ca()","c(bJ,bJ)","c(+(c,c),+(c,c))","eg()","~(q,q)","B(O)","b7()","~(aZ)","B(d,d,d,d,d,d,d,d)","c(d,d)","@(@,q)","c?()","m?(A)?(q)","ab?()","B(q,q)","B(bT)","B(+(d,d))","aL(c,d3)","j<j<d>>()","~(d,d,d)","c(aL,aL)","c(c,c)","d()","q(q,bS{end!B})","d(d,d,d,d)","ad(~)","~(c,j<bz>)","~(aE)","S<q,+(d,d)>(S<q,+(d,d)>)","bv(m?)","a8<bv>()","a8<ca>(b7)","a8<f<dz>>(b7)","a8<aE>(cb)","d5()","~(O)","c(@,@)","a8<~>()","dh(o)","di(o)","cr(o)","cs(o)","ds(c)","q(m?)","j<d>(m?)","a8<cF>()"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"2;":(a,b)=>c=>c instanceof A.z&&a.b(c.a)&&b.b(c.b),"3;":(a,b,c)=>d=>d instanceof A.aM&&a.b(d.a)&&b.b(d.b)&&c.b(d.c)}}
A.vW(v.typeUniverse,JSON.parse('{"by":"c_","hi":"c_","cJ":"c_","yn":"c0","eh":{"B":[],"R":[]},"ej":{"ad":[],"R":[]},"ek":{"O":[]},"c_":{"O":[]},"l":{"j":["1"],"x":["1"],"O":[],"f":["1"]},"h_":{"eD":[]},"jx":{"l":["1"],"j":["1"],"x":["1"],"O":[],"f":["1"]},"aY":{"I":["1"]},"dj":{"d":[],"aq":[],"b_":["aq"]},"ei":{"d":[],"c":[],"aq":[],"b_":["aq"],"R":[]},"h0":{"d":[],"aq":[],"b_":["aq"],"R":[]},"bZ":{"q":[],"b_":["q"],"jO":[],"R":[]},"cc":{"f":["2"]},"e2":{"I":["2"]},"cj":{"cc":["1","2"],"f":["2"],"f.E":"2"},"eX":{"cj":["1","2"],"cc":["1","2"],"x":["2"],"f":["2"],"f.E":"2"},"eV":{"y":["2"],"j":["2"],"cc":["1","2"],"x":["2"],"f":["2"]},"bq":{"eV":["1","2"],"y":["2"],"j":["2"],"cc":["1","2"],"x":["2"],"f":["2"],"y.E":"2","f.E":"2"},"ck":{"P":["3","4"],"S":["3","4"],"P.K":"3","P.V":"4"},"dn":{"W":[]},"da":{"y":["c"],"bG":["c"],"j":["c"],"x":["c"],"f":["c"],"y.E":"c","bG.E":"c"},"x":{"f":["1"]},"a_":{"x":["1"],"f":["1"]},"bC":{"a_":["1"],"x":["1"],"f":["1"],"f.E":"1","a_.E":"1"},"a0":{"I":["1"]},"cz":{"f":["2"],"f.E":"2"},"co":{"cz":["1","2"],"x":["2"],"f":["2"],"f.E":"2"},"ep":{"I":["2"]},"ao":{"a_":["2"],"x":["2"],"f":["2"],"f.E":"2","a_.E":"2"},"aK":{"f":["1"],"f.E":"1"},"eR":{"I":["1"]},"cI":{"f":["1"],"f.E":"1"},"e7":{"cI":["1"],"x":["1"],"f":["1"],"f.E":"1"},"eL":{"I":["1"]},"bB":{"f":["1"],"f.E":"1"},"dg":{"bB":["1"],"x":["1"],"f":["1"],"f.E":"1"},"eI":{"I":["1"]},"e8":{"x":["1"],"f":["1"],"f.E":"1"},"e9":{"I":["1"]},"bH":{"f":["1"],"f.E":"1"},"cK":{"I":["1"]},"bw":{"f":["+(c,1)"],"f.E":"+(c,1)"},"cn":{"bw":["1"],"x":["+(c,1)"],"f":["+(c,1)"],"f.E":"+(c,1)"},"bx":{"I":["+(c,1)"]},"dA":{"y":["1"],"bG":["1"],"j":["1"],"x":["1"],"f":["1"]},"bi":{"a_":["1"],"x":["1"],"f":["1"],"f.E":"1","a_.E":"1"},"z":{"dI":[],"bj":[]},"aM":{"dJ":[],"bj":[]},"dc":{"S":["1","2"]},"aj":{"dc":["1","2"],"S":["1","2"]},"cQ":{"f":["1"],"f.E":"1"},"bK":{"I":["1"]},"bV":{"dc":["1","2"],"S":["1","2"]},"dd":{"bA":["1"],"c5":["1"],"x":["1"],"f":["1"]},"b0":{"dd":["1"],"bA":["1"],"c5":["1"],"x":["1"],"f":["1"]},"bW":{"dd":["1"],"bA":["1"],"c5":["1"],"x":["1"],"f":["1"]},"ey":{"bE":[],"W":[]},"h1":{"W":[]},"hL":{"W":[]},"f6":{"b5":[]},"bQ":{"cq":[]},"fy":{"cq":[]},"fz":{"cq":[]},"hC":{"cq":[]},"hu":{"cq":[]},"d2":{"cq":[]},"ho":{"W":[]},"b1":{"P":["1","2"],"oP":["1","2"],"S":["1","2"],"P.K":"1","P.V":"2"},"an":{"x":["1"],"f":["1"],"f.E":"1"},"em":{"I":["1"]},"b2":{"x":["1"],"f":["1"],"f.E":"1"},"cy":{"I":["1"]},"cw":{"x":["a9<1,2>"],"f":["a9<1,2>"],"f.E":"a9<1,2>"},"cx":{"I":["a9<1,2>"]},"cu":{"b1":["1","2"],"P":["1","2"],"oP":["1","2"],"S":["1","2"],"P.K":"1","P.V":"2"},"dI":{"bj":[]},"dJ":{"bj":[]},"dk":{"uY":[],"jO":[]},"ic":{"eC":[],"dr":[]},"hN":{"f":["eC"],"f.E":"eC"},"eS":{"I":["eC"]},"eK":{"dr":[]},"ih":{"f":["dr"],"f.E":"dr"},"ii":{"I":["dr"]},"du":{"c0":[],"O":[],"R":[]},"c2":{"aI":[],"ca":[],"y":["c"],"ap":["c"],"j":["c"],"aH":["c"],"x":["c"],"O":[],"f":["c"],"a3":["c"],"R":[],"y.E":"c","a3.E":"c"},"c0":{"O":[],"R":[]},"eu":{"O":[]},"et":{"pY":[],"O":[],"R":[]},"ap":{"aH":["1"],"O":[]},"c1":{"y":["d"],"ap":["d"],"j":["d"],"aH":["d"],"x":["d"],"O":[],"f":["d"],"a3":["d"]},"aI":{"y":["c"],"ap":["c"],"j":["c"],"aH":["c"],"x":["c"],"O":[],"f":["c"],"a3":["c"]},"cA":{"c1":[],"bS":[],"y":["d"],"ap":["d"],"j":["d"],"aH":["d"],"x":["d"],"O":[],"f":["d"],"a3":["d"],"R":[],"y.E":"d","a3.E":"d"},"cB":{"c1":[],"bT":[],"y":["d"],"ap":["d"],"j":["d"],"aH":["d"],"x":["d"],"O":[],"f":["d"],"a3":["d"],"R":[],"y.E":"d","a3.E":"d"},"hb":{"aI":[],"oJ":[],"y":["c"],"ap":["c"],"j":["c"],"aH":["c"],"x":["c"],"O":[],"f":["c"],"a3":["c"],"R":[],"y.E":"c","a3.E":"c"},"cC":{"aI":[],"eg":[],"y":["c"],"ap":["c"],"j":["c"],"aH":["c"],"x":["c"],"O":[],"f":["c"],"a3":["c"],"R":[],"y.E":"c","a3.E":"c"},"hc":{"aI":[],"y":["c"],"ap":["c"],"j":["c"],"aH":["c"],"x":["c"],"O":[],"f":["c"],"a3":["c"],"R":[],"y.E":"c","a3.E":"c"},"cE":{"aI":[],"l5":[],"y":["c"],"ap":["c"],"j":["c"],"aH":["c"],"x":["c"],"O":[],"f":["c"],"a3":["c"],"R":[],"y.E":"c","a3.E":"c"},"ev":{"aI":[],"p_":[],"y":["c"],"ap":["c"],"j":["c"],"aH":["c"],"x":["c"],"O":[],"f":["c"],"a3":["c"],"R":[],"y.E":"c","a3.E":"c"},"ew":{"aI":[],"y":["c"],"ap":["c"],"j":["c"],"aH":["c"],"x":["c"],"O":[],"f":["c"],"a3":["c"],"R":[],"y.E":"c","a3.E":"c"},"hY":{"W":[]},"fb":{"bE":[],"W":[]},"fa":{"I":["1"]},"dL":{"f":["1"],"f.E":"1"},"ai":{"W":[]},"eU":{"hU":["1"]},"L":{"a8":["1"]},"f7":{"r3":["1"],"cO":["1"]},"dD":{"hQ":["1"],"f7":["1"],"r3":["1"],"cO":["1"]},"dH":{"f9":["1"],"dx":["1"]},"cM":{"dE":["1"],"hv":["1"],"cO":["1"]},"dE":{"hv":["1"],"cO":["1"]},"f9":{"dx":["1"]},"cN":{"eW":["1"]},"fh":{"qT":[]},"ig":{"fh":[],"qT":[]},"cS":{"bA":["1"],"c5":["1"],"x":["1"],"f":["1"]},"cT":{"I":["1"]},"y":{"j":["1"],"x":["1"],"f":["1"]},"P":{"S":["1","2"]},"eZ":{"x":["2"],"f":["2"],"f.E":"2"},"f_":{"I":["2"]},"bA":{"c5":["1"],"x":["1"],"f":["1"]},"f5":{"bA":["1"],"c5":["1"],"x":["1"],"f":["1"]},"i8":{"P":["q","@"],"S":["q","@"],"P.K":"q","P.V":"@"},"i9":{"a_":["q"],"x":["q"],"f":["q"],"f.E":"q","a_.E":"q"},"fO":{"db":["q","j<c>"]},"el":{"W":[]},"h3":{"W":[]},"h2":{"db":["m?","q"]},"hM":{"db":["q","j<c>"]},"d":{"aq":[],"b_":["aq"]},"be":{"b_":["be"]},"c":{"aq":[],"b_":["aq"]},"j":{"x":["1"],"f":["1"]},"aq":{"b_":["aq"]},"eC":{"dr":[]},"c5":{"x":["1"],"f":["1"]},"q":{"b_":["q"],"jO":[]},"hX":{"bt":[]},"fr":{"W":[]},"bE":{"W":[]},"aX":{"W":[]},"eB":{"W":[]},"fX":{"W":[]},"eQ":{"W":[]},"hK":{"W":[]},"c6":{"W":[]},"fC":{"W":[]},"he":{"W":[]},"eJ":{"W":[]},"ij":{"b5":[]},"ar":{"f":["c"],"f.E":"c"},"dw":{"I":["c"]},"b6":{"vb":[]},"c9":{"bt":[]},"i_":{"dG":[]},"i1":{"dG":[]},"i2":{"dG":[]},"i0":{"dG":[]},"hR":{"bP":[]},"hS":{"bP":[]},"hT":{"bP":[]},"hV":{"bs":[]},"hW":{"bs":[]},"cr":{"ua":[]},"eG":{"aF":[]},"ez":{"aF":[]},"fH":{"aF":[]},"h6":{"aF":[]},"h7":{"aF":[]},"h8":{"aF":[]},"de":{"aF":[]},"d7":{"aF":[]},"eH":{"aA":[]},"ha":{"aA":[]},"fq":{"aA":[]},"h4":{"aA":[]},"fD":{"aA":[]},"fE":{"aA":[]},"fF":{"aA":[]},"fv":{"aA":[]},"fw":{"aA":[]},"fx":{"aA":[]},"hn":{"aA":[]},"dY":{"eF":[]},"fI":{"eF":[]},"eM":{"bt":[]},"hd":{"bt":[]},"ia":{"dz":[]},"dF":{"eO":[]},"es":{"dz":[]},"er":{"eO":[]},"bR":{"bt":[]},"e1":{"cb":[]},"ed":{"cb":[]},"dZ":{"cb":[]},"hH":{"aE":[]},"hE":{"aE":[]},"hG":{"aE":[]},"ec":{"aE":[]},"e3":{"aE":[]},"d9":{"aE":[]},"fW":{"bh":[]},"hI":{"bh":[]},"hf":{"bh":[]},"fV":{"bh":[]},"fB":{"bh":[]},"hD":{"bh":[]},"ci":{"bt":[]},"df":{"bt":[]},"h9":{"bg":[]},"bf":{"bg":[]},"dq":{"bg":[]},"d8":{"bg":[]},"ct":{"bg":[]},"bX":{"dC":[]},"eP":{"dC":[]},"aT":{"bt":[]},"cv":{"bt":[]},"dp":{"bt":[]},"ul":{"j":["c"],"x":["c"],"f":["c"]},"ca":{"j":["c"],"x":["c"],"f":["c"]},"vr":{"j":["c"],"x":["c"],"f":["c"]},"oJ":{"j":["c"],"x":["c"],"f":["c"]},"l5":{"j":["c"],"x":["c"],"f":["c"]},"eg":{"j":["c"],"x":["c"],"f":["c"]},"p_":{"j":["c"],"x":["c"],"f":["c"]},"bS":{"j":["d"],"x":["d"],"f":["d"]},"bT":{"j":["d"],"x":["d"],"f":["d"]}}'))
A.vV(v.typeUniverse,JSON.parse('{"dA":1,"fi":2,"ap":1,"eW":1,"f5":1,"fG":2}'))
var u={c:"Error handler must accept one Object or one Object and a StackTrace as arguments, and return a value of the returned future's type"}
var t=(function rtii(){var s=A.ak
return{bm:s("@<~>"),v:s("ai"),c5:s("e_"),kb:s("bo"),bb:s("o"),el:s("aZ"),j8:s("bR"),aq:s("br"),gS:s("da"),bP:s("b_<@>"),p1:s("aj<q,q>"),U:s("b0<q>"),c:s("bs"),jS:s("be"),Q:s("x<@>"),C:s("W"),X:s("A"),lc:s("fQ"),nY:s("eb"),if:s("bf"),pk:s("bS"),kI:s("bT"),oc:s("bu"),Z:s("cq"),kH:s("dh"),lP:s("di"),nD:s("bV<c,j<c>>"),e:s("bW<c>"),my:s("bv"),h:s("aC"),lr:s("bY"),fA:s("cr"),b0:s("cs"),bW:s("eg"),mm:s("f<dz>"),id:s("f<d>"),e7:s("f<@>"),fm:s("f<c>"),jQ:s("l<ft>"),E:s("l<bo>"),o_:s("l<d3>"),dY:s("l<fu>"),oM:s("l<bp>"),hD:s("l<d4>"),i9:s("l<fA>"),r:s("l<aZ>"),ig:s("l<br>"),lW:s("l<eb>"),Y:s("l<bS>"),w:s("l<bT>"),eJ:s("l<bu>"),R:s("l<aC>"),q:s("l<bY>"),fT:s("l<aF>"),fL:s("l<aA>"),kG:s("l<O>"),iQ:s("l<j<e_>>"),ot:s("l<j<j<d>>>"),bo:s("l<j<m>>"),b:s("l<j<d>>"),fC:s("l<j<c>>"),dO:s("l<j<m?>>"),iE:s("l<S<c,bz>>"),nb:s("l<S<c,c>>"),bw:s("l<eq>"),ef:s("l<er>"),gw:s("l<dt>"),aA:s("l<c2>"),G:s("l<m>"),oJ:s("l<c3>"),o9:s("l<bg>"),ez:s("l<bz>"),lE:s("l<hj>"),gX:s("l<hk>"),kv:s("l<bh>"),k_:s("l<+(j<d>,d)>"),m_:s("l<+(q,q)>"),bU:s("l<+(d,bT)>"),I:s("l<+(d,d)>"),n_:s("l<+(c,c8)>"),hp:s("l<+(c,c)>"),cm:s("l<+(c,S<q,m?>?)>"),lN:s("l<+(m?,m?)>"),c3:s("l<+(j<eO>,j<c>,j<c>)>"),eL:s("l<+(d,d,d)>"),iv:s("l<+(c,c,j<c>)>"),oZ:s("l<+(c,c,d)>"),hc:s("l<+(m?(A),S<q,m?(A)>,B)>"),m1:s("l<eE>"),kR:s("l<ht>"),s:s("l<q>"),in:s("l<c8>"),oW:s("l<hA>"),fB:s("l<eO>"),cb:s("l<hF>"),n5:s("l<dz>"),jA:s("l<dC>"),mE:s("l<eY>"),ha:s("l<hZ>"),la:s("l<bJ>"),fw:s("l<aL>"),bD:s("l<i6>"),mc:s("l<i7>"),eB:s("l<bL>"),fb:s("l<ie>"),d2:s("l<ik>"),df:s("l<B>"),n:s("l<d>"),dG:s("l<@>"),t:s("l<c>"),dM:s("l<m?>"),k9:s("l<+(dt,j<bS>)?>"),nn:s("l<d?>"),g2:s("l<aq>"),V:s("l<m?(A)>"),T:s("ej"),m:s("O"),et:s("by"),dX:s("aH<@>"),dn:s("dq"),kV:s("j<bo>"),lL:s("j<bp>"),ke:s("j<d4>"),kp:s("j<aZ>"),iu:s("j<bS>"),lt:s("j<bT>"),kT:s("j<u_>"),n7:s("j<aC>"),gz:s("j<j<aZ>>"),x:s("j<j<d>>"),aB:s("j<dt>"),a2:s("j<bz>"),gE:s("j<+(d,d)>"),lK:s("j<+(c,c,d)>"),bF:s("j<q>"),ia:s("j<c8>"),dg:s("j<eO>"),je:s("j<eY>"),H:s("j<d>"),j:s("j<@>"),L:s("j<c>"),W:s("j<m?>"),ih:s("h5"),pp:s("S<q,q>"),eM:s("S<q,d>"),f:s("S<@,@>"),mV:s("S<c,c>"),a:s("S<q,+(d,d)>"),lb:s("S<q,m?>"),d:s("S<m?,m?>"),gQ:s("ao<q,q>"),dl:s("es"),h7:s("ds"),eb:s("du"),bi:s("cA"),g_:s("cB"),da:s("cC"),dQ:s("c1"),aj:s("aI"),nZ:s("cE"),ho:s("c2"),P:s("ad"),K:s("m"),kJ:s("c3"),kY:s("bg"),jv:s("bz"),lZ:s("yo"),aK:s("+()"),hT:s("+(j<d>,d)"),l_:s("+(q,cF)"),aL:s("+(d,d)"),gn:s("+(c,c)"),A:s("+(m?,m?)"),lu:s("eC"),mk:s("cF"),bs:s("bi<c>"),J:s("ar"),nu:s("hp"),gi:s("c5<q>"),nO:s("c5<c>"),gp:s("hr"),gc:s("hs"),l:s("b5"),N:s("q"),gL:s("q(q)"),l1:s("hB"),aJ:s("R"),do:s("bE"),hM:s("l5"),p:s("ca"),cx:s("cJ"),l0:s("dB"),cF:s("aK<q>"),ec:s("aE"),cI:s("dD<m?>"),kr:s("bI"),bY:s("bJ"),k:s("L<B>"),_:s("L<@>"),hy:s("L<c>"),cU:s("L<~>"),ct:s("aL"),iM:s("i5"),nx:s("cR"),dt:s("bL"),d3:s("f8<m?>"),b6:s("cV<m?>"),y:s("B"),dW:s("B(aC,c)"),iW:s("B(m)"),dA:s("B(q)"),i:s("d"),f3:s("d(d)"),z:s("@"),mY:s("@()"),B:s("@(m)"),ng:s("@(m,b5)"),S:s("c"),f1:s("bs?"),gK:s("a8<ad>?"),mU:s("O?"),nw:s("j<aZ>?"),l7:s("j<aF>?"),n4:s("j<j<d>>()?"),D:s("j<bI>?"),d1:s("j<cR>?"),nE:s("j<d>?"),g:s("j<@>?"),f8:s("j<c>?"),eO:s("S<@,@>?"),jT:s("S<q,j<+(d,d)>>?"),h9:s("S<q,m?>?"),O:s("m?"),u:s("m?(A)"),bl:s("q?"),nh:s("ca?"),F:s("b8<@,@>?"),bQ:s("aL?"),hJ:s("i4?"),nF:s("ib?"),fU:s("B?"),mA:s("B(aC,c)?"),jX:s("d?"),aV:s("c?"),jh:s("aq?"),jE:s("~()?"),cZ:s("aq"),o:s("~"),M:s("~()"),i6:s("~(m)"),b9:s("~(m,b5)"),jR:s("~(q,@)"),hi:s("~(d,d,d)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.aP=J.fY.prototype
B.a=J.l.prototype
B.a3=J.eh.prototype
B.b=J.ei.prototype
B.c=J.dj.prototype
B.d=J.bZ.prototype
B.aQ=J.by.prototype
B.aR=J.ek.prototype
B.cZ=A.et.prototype
B.n=A.cA.prototype
B.o=A.cB.prototype
B.C=A.cC.prototype
B.R=A.cE.prototype
B.S=A.ev.prototype
B.j=A.c2.prototype
B.ad=J.hi.prototype
B.U=J.cJ.prototype
B.x=new A.ci(0,"fill")
B.q=new A.ci(1,"line")
B.r=new A.ci(2,"circle")
B.H=new A.ci(3,"extrusion")
B.Y=new A.fI()
B.aj=new A.e9(A.ak("e9<0&>"))
B.Z=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.ak=function() {
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
B.ap=function(getTagFallback) {
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
B.al=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.ao=function(hooks) {
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
B.an=function(hooks) {
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
B.am=function(hooks) {
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
B.a_=function(hooks) { return hooks; }

B.e=new A.h2()
B.aq=new A.he()
B.I=new A.kb()
B.y=new A.hM()
B.ar=new A.l7()
B.i=new A.hR()
B.f=new A.ig()
B.z=new A.ij()
B.a0=new A.bR(0,"zoom")
B.a1=new A.df(0,"butt")
B.au=new A.df(1,"round")
B.av=new A.df(2,"square")
B.aw=new A.e5(6553.6,25.6,0.1,1e4)
B.ax=new A.e5(256,1,0.00390625,32768)
B.ay=new A.be(0)
B.az=new A.be(1e4)
B.aA=new A.be(2e7)
B.aB=new A.be(3e7)
B.a2=new A.az("head is shorter than its 54 bytes")
B.aC=new A.az("avar segment map overruns the font")
B.aD=new A.az("DeltaSetIndexMap entries overrun the font")
B.aE=new A.az("delta set rows overrun the font")
B.aF=new A.az("fvar axis array overruns the font")
B.aG=new A.az("cmap is too short to hold a header")
B.aH=new A.az("fvar instance array overruns the font")
B.aI=new A.az("cmap has no subtable in a format this parser supports")
B.aJ=new A.az("variation region list overruns the font")
B.aK=new A.az("too short to hold an SFNT header")
B.aL=new A.az("hhea.numberOfHMetrics is 0, leaving every glyph without an advance")
B.aM=new A.az("cmap has no usable encoding record")
B.aN=new A.ee("Not a PMTiles version 3 archive",null,null)
B.aO=new A.ee("The PMTiles archive is packed with brotli or zstd; only gzip is read",null,null)
B.aS=new A.jz(null)
B.aT=new A.jA(null)
B.l=new A.dp(0,"butt")
B.J=new A.dp(1,"round")
B.K=new A.dp(2,"square")
B.a4=new A.cv(0,"round")
B.L=new A.cv(1,"bevel")
B.t=new A.cv(2,"miter")
B.aU=new A.cv(3,"none")
B.aV=s([0,-1,1],t.n)
B.aW=s([32],t.t)
B.ae=new A.z(-1,-1)
B.da=new A.z(1,-1)
B.d9=new A.z(1,1)
B.db=new A.z(-1,1)
B.aX=s([B.ae,B.da,B.d9,B.db],t.I)
B.cf=s(["text-transform","text-letter-spacing","text-max-width","text-justify","text-anchor","text-rotate","text-font","icon-anchor"],t.s)
B.cg=s([60,824,8814,61,824,8800,62,824,8815,65,768,192,65,769,193,65,770,194,65,771,195,65,772,256,65,774,258,65,775,550,65,776,196,65,777,7842,65,778,197,65,780,461,65,783,512,65,785,514,65,803,7840,65,805,7680,65,808,260,66,775,7682,66,803,7684,66,817,7686,67,769,262,67,770,264,67,775,266,67,780,268,67,807,199,68,775,7690,68,780,270,68,803,7692,68,807,7696,68,813,7698,68,817,7694,69,768,200,69,769,201,69,770,202,69,771,7868,69,772,274,69,774,276,69,775,278,69,776,203,69,777,7866,69,780,282,69,783,516,69,785,518,69,803,7864,69,807,552,69,808,280,69,813,7704,69,816,7706,70,775,7710,71,769,500,71,770,284,71,772,7712,71,774,286,71,775,288,71,780,486,71,807,290,72,770,292,72,775,7714,72,776,7718,72,780,542,72,803,7716,72,807,7720,72,814,7722,73,768,204,73,769,205,73,770,206,73,771,296,73,772,298,73,774,300,73,775,304,73,776,207,73,777,7880,73,780,463,73,783,520,73,785,522,73,803,7882,73,808,302,73,816,7724,74,770,308,75,769,7728,75,780,488,75,803,7730,75,807,310,75,817,7732,76,769,313,76,780,317,76,803,7734,76,807,315,76,813,7740,76,817,7738,77,769,7742,77,775,7744,77,803,7746,78,768,504,78,769,323,78,771,209,78,775,7748,78,780,327,78,803,7750,78,807,325,78,813,7754,78,817,7752,79,768,210,79,769,211,79,770,212,79,771,213,79,772,332,79,774,334,79,775,558,79,776,214,79,777,7886,79,779,336,79,780,465,79,783,524,79,785,526,79,795,416,79,803,7884,79,808,490,80,769,7764,80,775,7766,82,769,340,82,775,7768,82,780,344,82,783,528,82,785,530,82,803,7770,82,807,342,82,817,7774,83,769,346,83,770,348,83,775,7776,83,780,352,83,803,7778,83,806,536,83,807,350,84,775,7786,84,780,356,84,803,7788,84,806,538,84,807,354,84,813,7792,84,817,7790,85,768,217,85,769,218,85,770,219,85,771,360,85,772,362,85,774,364,85,776,220,85,777,7910,85,778,366,85,779,368,85,780,467,85,783,532,85,785,534,85,795,431,85,803,7908,85,804,7794,85,808,370,85,813,7798,85,816,7796,86,771,7804,86,803,7806,87,768,7808,87,769,7810,87,770,372,87,775,7814,87,776,7812,87,803,7816,88,775,7818,88,776,7820,89,768,7922,89,769,221,89,770,374,89,771,7928,89,772,562,89,775,7822,89,776,376,89,777,7926,89,803,7924,90,769,377,90,770,7824,90,775,379,90,780,381,90,803,7826,90,817,7828,97,768,224,97,769,225,97,770,226,97,771,227,97,772,257,97,774,259,97,775,551,97,776,228,97,777,7843,97,778,229,97,780,462,97,783,513,97,785,515,97,803,7841,97,805,7681,97,808,261,98,775,7683,98,803,7685,98,817,7687,99,769,263,99,770,265,99,775,267,99,780,269,99,807,231,100,775,7691,100,780,271,100,803,7693,100,807,7697,100,813,7699,100,817,7695,101,768,232,101,769,233,101,770,234,101,771,7869,101,772,275,101,774,277,101,775,279,101,776,235,101,777,7867,101,780,283,101,783,517,101,785,519,101,803,7865,101,807,553,101,808,281,101,813,7705,101,816,7707,102,775,7711,103,769,501,103,770,285,103,772,7713,103,774,287,103,775,289,103,780,487,103,807,291,104,770,293,104,775,7715,104,776,7719,104,780,543,104,803,7717,104,807,7721,104,814,7723,104,817,7830,105,768,236,105,769,237,105,770,238,105,771,297,105,772,299,105,774,301,105,776,239,105,777,7881,105,780,464,105,783,521,105,785,523,105,803,7883,105,808,303,105,816,7725,106,770,309,106,780,496,107,769,7729,107,780,489,107,803,7731,107,807,311,107,817,7733,108,769,314,108,780,318,108,803,7735,108,807,316,108,813,7741,108,817,7739,109,769,7743,109,775,7745,109,803,7747,110,768,505,110,769,324,110,771,241,110,775,7749,110,780,328,110,803,7751,110,807,326,110,813,7755,110,817,7753,111,768,242,111,769,243,111,770,244,111,771,245,111,772,333,111,774,335,111,775,559,111,776,246,111,777,7887,111,779,337,111,780,466,111,783,525,111,785,527,111,795,417,111,803,7885,111,808,491,112,769,7765,112,775,7767,114,769,341,114,775,7769,114,780,345,114,783,529,114,785,531,114,803,7771,114,807,343,114,817,7775,115,769,347,115,770,349,115,775,7777,115,780,353,115,803,7779,115,806,537,115,807,351,116,775,7787,116,776,7831,116,780,357,116,803,7789,116,806,539,116,807,355,116,813,7793,116,817,7791,117,768,249,117,769,250,117,770,251,117,771,361,117,772,363,117,774,365,117,776,252,117,777,7911,117,778,367,117,779,369,117,780,468,117,783,533,117,785,535,117,795,432,117,803,7909,117,804,7795,117,808,371,117,813,7799,117,816,7797,118,771,7805,118,803,7807,119,768,7809,119,769,7811,119,770,373,119,775,7815,119,776,7813,119,778,7832,119,803,7817,120,775,7819,120,776,7821,121,768,7923,121,769,253,121,770,375,121,771,7929,121,772,563,121,775,7823,121,776,255,121,777,7927,121,778,7833,121,803,7925,122,769,378,122,770,7825,122,775,380,122,780,382,122,803,7827,122,817,7829,168,768,8173,168,769,901,168,834,8129,194,768,7846,194,769,7844,194,771,7850,194,777,7848,196,772,478,197,769,506,198,769,508,198,772,482,199,769,7688,202,768,7872,202,769,7870,202,771,7876,202,777,7874,207,769,7726,212,768,7890,212,769,7888,212,771,7894,212,777,7892,213,769,7756,213,772,556,213,776,7758,214,772,554,216,769,510,220,768,475,220,769,471,220,772,469,220,780,473,226,768,7847,226,769,7845,226,771,7851,226,777,7849,228,772,479,229,769,507,230,769,509,230,772,483,231,769,7689,234,768,7873,234,769,7871,234,771,7877,234,777,7875,239,769,7727,244,768,7891,244,769,7889,244,771,7895,244,777,7893,245,769,7757,245,772,557,245,776,7759,246,772,555,248,769,511,252,768,476,252,769,472,252,772,470,252,780,474,258,768,7856,258,769,7854,258,771,7860,258,777,7858,259,768,7857,259,769,7855,259,771,7861,259,777,7859,274,768,7700,274,769,7702,275,768,7701,275,769,7703,332,768,7760,332,769,7762,333,768,7761,333,769,7763,346,775,7780,347,775,7781,352,775,7782,353,775,7783,360,769,7800,361,769,7801,362,776,7802,363,776,7803,383,775,7835,416,768,7900,416,769,7898,416,771,7904,416,777,7902,416,803,7906,417,768,7901,417,769,7899,417,771,7905,417,777,7903,417,803,7907,431,768,7914,431,769,7912,431,771,7918,431,777,7916,431,803,7920,432,768,7915,432,769,7913,432,771,7919,432,777,7917,432,803,7921,439,780,494,490,772,492,491,772,493,550,772,480,551,772,481,552,774,7708,553,774,7709,558,772,560,559,772,561,658,780,495,913,768,8122,913,769,902,913,772,8121,913,774,8120,913,787,7944,913,788,7945,913,837,8124,917,768,8136,917,769,904,917,787,7960,917,788,7961,919,768,8138,919,769,905,919,787,7976,919,788,7977,919,837,8140,921,768,8154,921,769,906,921,772,8153,921,774,8152,921,776,938,921,787,7992,921,788,7993,927,768,8184,927,769,908,927,787,8008,927,788,8009,929,788,8172,933,768,8170,933,769,910,933,772,8169,933,774,8168,933,776,939,933,788,8025,937,768,8186,937,769,911,937,787,8040,937,788,8041,937,837,8188,940,837,8116,942,837,8132,945,768,8048,945,769,940,945,772,8113,945,774,8112,945,787,7936,945,788,7937,945,834,8118,945,837,8115,949,768,8050,949,769,941,949,787,7952,949,788,7953,951,768,8052,951,769,942,951,787,7968,951,788,7969,951,834,8134,951,837,8131,953,768,8054,953,769,943,953,772,8145,953,774,8144,953,776,970,953,787,7984,953,788,7985,953,834,8150,959,768,8056,959,769,972,959,787,8000,959,788,8001,961,787,8164,961,788,8165,965,768,8058,965,769,973,965,772,8161,965,774,8160,965,776,971,965,787,8016,965,788,8017,965,834,8166,969,768,8060,969,769,974,969,787,8032,969,788,8033,969,834,8182,969,837,8179,970,768,8146,970,769,912,970,834,8151,971,768,8162,971,769,944,971,834,8167,974,837,8180,978,769,979,978,776,980,1030,776,1031,1040,774,1232,1040,776,1234,1043,769,1027,1045,768,1024,1045,774,1238,1045,776,1025,1046,774,1217,1046,776,1244,1047,776,1246,1048,768,1037,1048,772,1250,1048,774,1049,1048,776,1252,1050,769,1036,1054,776,1254,1059,772,1262,1059,774,1038,1059,776,1264,1059,779,1266,1063,776,1268,1067,776,1272,1069,776,1260,1072,774,1233,1072,776,1235,1075,769,1107,1077,768,1104,1077,774,1239,1077,776,1105,1078,774,1218,1078,776,1245,1079,776,1247,1080,768,1117,1080,772,1251,1080,774,1081,1080,776,1253,1082,769,1116,1086,776,1255,1091,772,1263,1091,774,1118,1091,776,1265,1091,779,1267,1095,776,1269,1099,776,1273,1101,776,1261,1110,776,1111,1140,783,1142,1141,783,1143,1240,776,1242,1241,776,1243,1256,776,1258,1257,776,1259,1575,1619,1570,1575,1620,1571,1575,1621,1573,1608,1620,1572,1610,1620,1574,1729,1620,1730,1746,1620,1747,1749,1620,1728,2344,2364,2345,2352,2364,2353,2355,2364,2356,2503,2494,2507,2503,2519,2508,2887,2878,2891,2887,2902,2888,2887,2903,2892,2962,3031,2964,3014,3006,3018,3014,3031,3020,3015,3006,3019,3142,3158,3144,3263,3285,3264,3270,3266,3274,3270,3285,3271,3270,3286,3272,3274,3285,3275,3398,3390,3402,3398,3415,3404,3399,3390,3403,3545,3530,3546,3545,3535,3548,3545,3551,3550,3548,3530,3549,4133,4142,4134,6917,6965,6918,6919,6965,6920,6921,6965,6922,6923,6965,6924,6925,6965,6926,6929,6965,6930,6970,6965,6971,6972,6965,6973,6974,6965,6976,6975,6965,6977,6978,6965,6979,7734,772,7736,7735,772,7737,7770,772,7772,7771,772,7773,7778,775,7784,7779,775,7785,7840,770,7852,7840,774,7862,7841,770,7853,7841,774,7863,7864,770,7878,7865,770,7879,7884,770,7896,7885,770,7897,7936,768,7938,7936,769,7940,7936,834,7942,7936,837,8064,7937,768,7939,7937,769,7941,7937,834,7943,7937,837,8065,7938,837,8066,7939,837,8067,7940,837,8068,7941,837,8069,7942,837,8070,7943,837,8071,7944,768,7946,7944,769,7948,7944,834,7950,7944,837,8072,7945,768,7947,7945,769,7949,7945,834,7951,7945,837,8073,7946,837,8074,7947,837,8075,7948,837,8076,7949,837,8077,7950,837,8078,7951,837,8079,7952,768,7954,7952,769,7956,7953,768,7955,7953,769,7957,7960,768,7962,7960,769,7964,7961,768,7963,7961,769,7965,7968,768,7970,7968,769,7972,7968,834,7974,7968,837,8080,7969,768,7971,7969,769,7973,7969,834,7975,7969,837,8081,7970,837,8082,7971,837,8083,7972,837,8084,7973,837,8085,7974,837,8086,7975,837,8087,7976,768,7978,7976,769,7980,7976,834,7982,7976,837,8088,7977,768,7979,7977,769,7981,7977,834,7983,7977,837,8089,7978,837,8090,7979,837,8091,7980,837,8092,7981,837,8093,7982,837,8094,7983,837,8095,7984,768,7986,7984,769,7988,7984,834,7990,7985,768,7987,7985,769,7989,7985,834,7991,7992,768,7994,7992,769,7996,7992,834,7998,7993,768,7995,7993,769,7997,7993,834,7999,8000,768,8002,8000,769,8004,8001,768,8003,8001,769,8005,8008,768,8010,8008,769,8012,8009,768,8011,8009,769,8013,8016,768,8018,8016,769,8020,8016,834,8022,8017,768,8019,8017,769,8021,8017,834,8023,8025,768,8027,8025,769,8029,8025,834,8031,8032,768,8034,8032,769,8036,8032,834,8038,8032,837,8096,8033,768,8035,8033,769,8037,8033,834,8039,8033,837,8097,8034,837,8098,8035,837,8099,8036,837,8100,8037,837,8101,8038,837,8102,8039,837,8103,8040,768,8042,8040,769,8044,8040,834,8046,8040,837,8104,8041,768,8043,8041,769,8045,8041,834,8047,8041,837,8105,8042,837,8106,8043,837,8107,8044,837,8108,8045,837,8109,8046,837,8110,8047,837,8111,8048,837,8114,8052,837,8130,8060,837,8178,8118,837,8119,8127,768,8141,8127,769,8142,8127,834,8143,8134,837,8135,8182,837,8183,8190,768,8157,8190,769,8158,8190,834,8159,8592,824,8602,8594,824,8603,8596,824,8622,8656,824,8653,8658,824,8655,8660,824,8654,8707,824,8708,8712,824,8713,8715,824,8716,8739,824,8740,8741,824,8742,8764,824,8769,8771,824,8772,8773,824,8775,8776,824,8777,8781,824,8813,8801,824,8802,8804,824,8816,8805,824,8817,8818,824,8820,8819,824,8821,8822,824,8824,8823,824,8825,8826,824,8832,8827,824,8833,8828,824,8928,8829,824,8929,8834,824,8836,8835,824,8837,8838,824,8840,8839,824,8841,8849,824,8930,8850,824,8931,8866,824,8876,8872,824,8877,8873,824,8878,8875,824,8879,8882,824,8938,8883,824,8939,8884,824,8940,8885,824,8941,12358,12441,12436,12363,12441,12364,12365,12441,12366,12367,12441,12368,12369,12441,12370,12371,12441,12372,12373,12441,12374,12375,12441,12376,12377,12441,12378,12379,12441,12380,12381,12441,12382,12383,12441,12384,12385,12441,12386,12388,12441,12389,12390,12441,12391,12392,12441,12393,12399,12441,12400,12399,12442,12401,12402,12441,12403,12402,12442,12404,12405,12441,12406,12405,12442,12407,12408,12441,12409,12408,12442,12410,12411,12441,12412,12411,12442,12413,12445,12441,12446,12454,12441,12532,12459,12441,12460,12461,12441,12462,12463,12441,12464,12465,12441,12466,12467,12441,12468,12469,12441,12470,12471,12441,12472,12473,12441,12474,12475,12441,12476,12477,12441,12478,12479,12441,12480,12481,12441,12482,12484,12441,12485,12486,12441,12487,12488,12441,12489,12495,12441,12496,12495,12442,12497,12498,12441,12499,12498,12442,12500,12501,12441,12502,12501,12442,12503,12504,12441,12505,12504,12442,12506,12507,12441,12508,12507,12442,12509,12527,12441,12535,12528,12441,12536,12529,12441,12537,12530,12441,12538,12541,12441,12542,67026,775,67017,67034,775,67044,69785,69818,69786,69787,69818,69788,69797,69818,69803,69937,69927,69934,69938,69927,69935,70471,70462,70475,70471,70487,70476,70530,70601,70531,70532,70587,70533,70539,70594,70542,70544,70601,70545,70594,70584,70599,70594,70594,70597,70594,70601,70600,70841,70832,70844,70841,70842,70843,70841,70845,70846,71096,71087,71098,71097,71087,71099,71989,71984,71992,90398,90398,90401,90398,90399,90403,90398,90400,90405,90398,90409,90402,90401,90399,90406,90401,90400,90408,90402,90399,90407,90409,90399,90404,93539,93543,93545,93543,93543,93544,93545,93543,93546],t.t)
B.ch=s([192,65,768,193,65,769,194,65,770,195,65,771,196,65,776,197,65,778,199,67,807,200,69,768,201,69,769,202,69,770,203,69,776,204,73,768,205,73,769,206,73,770,207,73,776,209,78,771,210,79,768,211,79,769,212,79,770,213,79,771,214,79,776,217,85,768,218,85,769,219,85,770,220,85,776,221,89,769,224,97,768,225,97,769,226,97,770,227,97,771,228,97,776,229,97,778,231,99,807,232,101,768,233,101,769,234,101,770,235,101,776,236,105,768,237,105,769,238,105,770,239,105,776,241,110,771,242,111,768,243,111,769,244,111,770,245,111,771,246,111,776,249,117,768,250,117,769,251,117,770,252,117,776,253,121,769,255,121,776,256,65,772,257,97,772,258,65,774,259,97,774,260,65,808,261,97,808,262,67,769,263,99,769,264,67,770,265,99,770,266,67,775,267,99,775,268,67,780,269,99,780,270,68,780,271,100,780,274,69,772,275,101,772,276,69,774,277,101,774,278,69,775,279,101,775,280,69,808,281,101,808,282,69,780,283,101,780,284,71,770,285,103,770,286,71,774,287,103,774,288,71,775,289,103,775,290,71,807,291,103,807,292,72,770,293,104,770,296,73,771,297,105,771,298,73,772,299,105,772,300,73,774,301,105,774,302,73,808,303,105,808,304,73,775,308,74,770,309,106,770,310,75,807,311,107,807,313,76,769,314,108,769,315,76,807,316,108,807,317,76,780,318,108,780,323,78,769,324,110,769,325,78,807,326,110,807,327,78,780,328,110,780,332,79,772,333,111,772,334,79,774,335,111,774,336,79,779,337,111,779,340,82,769,341,114,769,342,82,807,343,114,807,344,82,780,345,114,780,346,83,769,347,115,769,348,83,770,349,115,770,350,83,807,351,115,807,352,83,780,353,115,780,354,84,807,355,116,807,356,84,780,357,116,780,360,85,771,361,117,771,362,85,772,363,117,772,364,85,774,365,117,774,366,85,778,367,117,778,368,85,779,369,117,779,370,85,808,371,117,808,372,87,770,373,119,770,374,89,770,375,121,770,376,89,776,377,90,769,378,122,769,379,90,775,380,122,775,381,90,780,382,122,780,416,79,795,417,111,795,431,85,795,432,117,795,461,65,780,462,97,780,463,73,780,464,105,780,465,79,780,466,111,780,467,85,780,468,117,780,469,220,772,470,252,772,471,220,769,472,252,769,473,220,780,474,252,780,475,220,768,476,252,768,478,196,772,479,228,772,480,550,772,481,551,772,482,198,772,483,230,772,486,71,780,487,103,780,488,75,780,489,107,780,490,79,808,491,111,808,492,490,772,493,491,772,494,439,780,495,658,780,496,106,780,500,71,769,501,103,769,504,78,768,505,110,768,506,197,769,507,229,769,508,198,769,509,230,769,510,216,769,511,248,769,512,65,783,513,97,783,514,65,785,515,97,785,516,69,783,517,101,783,518,69,785,519,101,785,520,73,783,521,105,783,522,73,785,523,105,785,524,79,783,525,111,783,526,79,785,527,111,785,528,82,783,529,114,783,530,82,785,531,114,785,532,85,783,533,117,783,534,85,785,535,117,785,536,83,806,537,115,806,538,84,806,539,116,806,542,72,780,543,104,780,550,65,775,551,97,775,552,69,807,553,101,807,554,214,772,555,246,772,556,213,772,557,245,772,558,79,775,559,111,775,560,558,772,561,559,772,562,89,772,563,121,772,832,768,-1,833,769,-1,835,787,-1,836,776,769,884,697,-1,894,59,-1,901,168,769,902,913,769,903,183,-1,904,917,769,905,919,769,906,921,769,908,927,769,910,933,769,911,937,769,912,970,769,938,921,776,939,933,776,940,945,769,941,949,769,942,951,769,943,953,769,944,971,769,970,953,776,971,965,776,972,959,769,973,965,769,974,969,769,979,978,769,980,978,776,1024,1045,768,1025,1045,776,1027,1043,769,1031,1030,776,1036,1050,769,1037,1048,768,1038,1059,774,1049,1048,774,1081,1080,774,1104,1077,768,1105,1077,776,1107,1075,769,1111,1110,776,1116,1082,769,1117,1080,768,1118,1091,774,1142,1140,783,1143,1141,783,1217,1046,774,1218,1078,774,1232,1040,774,1233,1072,774,1234,1040,776,1235,1072,776,1238,1045,774,1239,1077,774,1242,1240,776,1243,1241,776,1244,1046,776,1245,1078,776,1246,1047,776,1247,1079,776,1250,1048,772,1251,1080,772,1252,1048,776,1253,1080,776,1254,1054,776,1255,1086,776,1258,1256,776,1259,1257,776,1260,1069,776,1261,1101,776,1262,1059,772,1263,1091,772,1264,1059,776,1265,1091,776,1266,1059,779,1267,1091,779,1268,1063,776,1269,1095,776,1272,1067,776,1273,1099,776,1570,1575,1619,1571,1575,1620,1572,1608,1620,1573,1575,1621,1574,1610,1620,1728,1749,1620,1730,1729,1620,1747,1746,1620,2345,2344,2364,2353,2352,2364,2356,2355,2364,2392,2325,2364,2393,2326,2364,2394,2327,2364,2395,2332,2364,2396,2337,2364,2397,2338,2364,2398,2347,2364,2399,2351,2364,2507,2503,2494,2508,2503,2519,2524,2465,2492,2525,2466,2492,2527,2479,2492,2611,2610,2620,2614,2616,2620,2649,2582,2620,2650,2583,2620,2651,2588,2620,2654,2603,2620,2888,2887,2902,2891,2887,2878,2892,2887,2903,2908,2849,2876,2909,2850,2876,2964,2962,3031,3018,3014,3006,3019,3015,3006,3020,3014,3031,3144,3142,3158,3264,3263,3285,3271,3270,3285,3272,3270,3286,3274,3270,3266,3275,3274,3285,3402,3398,3390,3403,3399,3390,3404,3398,3415,3546,3545,3530,3548,3545,3535,3549,3548,3530,3550,3545,3551,3907,3906,4023,3917,3916,4023,3922,3921,4023,3927,3926,4023,3932,3931,4023,3945,3904,4021,3955,3953,3954,3957,3953,3956,3958,4018,3968,3960,4019,3968,3969,3953,3968,3987,3986,4023,3997,3996,4023,4002,4001,4023,4007,4006,4023,4012,4011,4023,4025,3984,4021,4134,4133,4142,6918,6917,6965,6920,6919,6965,6922,6921,6965,6924,6923,6965,6926,6925,6965,6930,6929,6965,6971,6970,6965,6973,6972,6965,6976,6974,6965,6977,6975,6965,6979,6978,6965,7680,65,805,7681,97,805,7682,66,775,7683,98,775,7684,66,803,7685,98,803,7686,66,817,7687,98,817,7688,199,769,7689,231,769,7690,68,775,7691,100,775,7692,68,803,7693,100,803,7694,68,817,7695,100,817,7696,68,807,7697,100,807,7698,68,813,7699,100,813,7700,274,768,7701,275,768,7702,274,769,7703,275,769,7704,69,813,7705,101,813,7706,69,816,7707,101,816,7708,552,774,7709,553,774,7710,70,775,7711,102,775,7712,71,772,7713,103,772,7714,72,775,7715,104,775,7716,72,803,7717,104,803,7718,72,776,7719,104,776,7720,72,807,7721,104,807,7722,72,814,7723,104,814,7724,73,816,7725,105,816,7726,207,769,7727,239,769,7728,75,769,7729,107,769,7730,75,803,7731,107,803,7732,75,817,7733,107,817,7734,76,803,7735,108,803,7736,7734,772,7737,7735,772,7738,76,817,7739,108,817,7740,76,813,7741,108,813,7742,77,769,7743,109,769,7744,77,775,7745,109,775,7746,77,803,7747,109,803,7748,78,775,7749,110,775,7750,78,803,7751,110,803,7752,78,817,7753,110,817,7754,78,813,7755,110,813,7756,213,769,7757,245,769,7758,213,776,7759,245,776,7760,332,768,7761,333,768,7762,332,769,7763,333,769,7764,80,769,7765,112,769,7766,80,775,7767,112,775,7768,82,775,7769,114,775,7770,82,803,7771,114,803,7772,7770,772,7773,7771,772,7774,82,817,7775,114,817,7776,83,775,7777,115,775,7778,83,803,7779,115,803,7780,346,775,7781,347,775,7782,352,775,7783,353,775,7784,7778,775,7785,7779,775,7786,84,775,7787,116,775,7788,84,803,7789,116,803,7790,84,817,7791,116,817,7792,84,813,7793,116,813,7794,85,804,7795,117,804,7796,85,816,7797,117,816,7798,85,813,7799,117,813,7800,360,769,7801,361,769,7802,362,776,7803,363,776,7804,86,771,7805,118,771,7806,86,803,7807,118,803,7808,87,768,7809,119,768,7810,87,769,7811,119,769,7812,87,776,7813,119,776,7814,87,775,7815,119,775,7816,87,803,7817,119,803,7818,88,775,7819,120,775,7820,88,776,7821,120,776,7822,89,775,7823,121,775,7824,90,770,7825,122,770,7826,90,803,7827,122,803,7828,90,817,7829,122,817,7830,104,817,7831,116,776,7832,119,778,7833,121,778,7835,383,775,7840,65,803,7841,97,803,7842,65,777,7843,97,777,7844,194,769,7845,226,769,7846,194,768,7847,226,768,7848,194,777,7849,226,777,7850,194,771,7851,226,771,7852,7840,770,7853,7841,770,7854,258,769,7855,259,769,7856,258,768,7857,259,768,7858,258,777,7859,259,777,7860,258,771,7861,259,771,7862,7840,774,7863,7841,774,7864,69,803,7865,101,803,7866,69,777,7867,101,777,7868,69,771,7869,101,771,7870,202,769,7871,234,769,7872,202,768,7873,234,768,7874,202,777,7875,234,777,7876,202,771,7877,234,771,7878,7864,770,7879,7865,770,7880,73,777,7881,105,777,7882,73,803,7883,105,803,7884,79,803,7885,111,803,7886,79,777,7887,111,777,7888,212,769,7889,244,769,7890,212,768,7891,244,768,7892,212,777,7893,244,777,7894,212,771,7895,244,771,7896,7884,770,7897,7885,770,7898,416,769,7899,417,769,7900,416,768,7901,417,768,7902,416,777,7903,417,777,7904,416,771,7905,417,771,7906,416,803,7907,417,803,7908,85,803,7909,117,803,7910,85,777,7911,117,777,7912,431,769,7913,432,769,7914,431,768,7915,432,768,7916,431,777,7917,432,777,7918,431,771,7919,432,771,7920,431,803,7921,432,803,7922,89,768,7923,121,768,7924,89,803,7925,121,803,7926,89,777,7927,121,777,7928,89,771,7929,121,771,7936,945,787,7937,945,788,7938,7936,768,7939,7937,768,7940,7936,769,7941,7937,769,7942,7936,834,7943,7937,834,7944,913,787,7945,913,788,7946,7944,768,7947,7945,768,7948,7944,769,7949,7945,769,7950,7944,834,7951,7945,834,7952,949,787,7953,949,788,7954,7952,768,7955,7953,768,7956,7952,769,7957,7953,769,7960,917,787,7961,917,788,7962,7960,768,7963,7961,768,7964,7960,769,7965,7961,769,7968,951,787,7969,951,788,7970,7968,768,7971,7969,768,7972,7968,769,7973,7969,769,7974,7968,834,7975,7969,834,7976,919,787,7977,919,788,7978,7976,768,7979,7977,768,7980,7976,769,7981,7977,769,7982,7976,834,7983,7977,834,7984,953,787,7985,953,788,7986,7984,768,7987,7985,768,7988,7984,769,7989,7985,769,7990,7984,834,7991,7985,834,7992,921,787,7993,921,788,7994,7992,768,7995,7993,768,7996,7992,769,7997,7993,769,7998,7992,834,7999,7993,834,8000,959,787,8001,959,788,8002,8000,768,8003,8001,768,8004,8000,769,8005,8001,769,8008,927,787,8009,927,788,8010,8008,768,8011,8009,768,8012,8008,769,8013,8009,769,8016,965,787,8017,965,788,8018,8016,768,8019,8017,768,8020,8016,769,8021,8017,769,8022,8016,834,8023,8017,834,8025,933,788,8027,8025,768,8029,8025,769,8031,8025,834,8032,969,787,8033,969,788,8034,8032,768,8035,8033,768,8036,8032,769,8037,8033,769,8038,8032,834,8039,8033,834,8040,937,787,8041,937,788,8042,8040,768,8043,8041,768,8044,8040,769,8045,8041,769,8046,8040,834,8047,8041,834,8048,945,768,8049,940,-1,8050,949,768,8051,941,-1,8052,951,768,8053,942,-1,8054,953,768,8055,943,-1,8056,959,768,8057,972,-1,8058,965,768,8059,973,-1,8060,969,768,8061,974,-1,8064,7936,837,8065,7937,837,8066,7938,837,8067,7939,837,8068,7940,837,8069,7941,837,8070,7942,837,8071,7943,837,8072,7944,837,8073,7945,837,8074,7946,837,8075,7947,837,8076,7948,837,8077,7949,837,8078,7950,837,8079,7951,837,8080,7968,837,8081,7969,837,8082,7970,837,8083,7971,837,8084,7972,837,8085,7973,837,8086,7974,837,8087,7975,837,8088,7976,837,8089,7977,837,8090,7978,837,8091,7979,837,8092,7980,837,8093,7981,837,8094,7982,837,8095,7983,837,8096,8032,837,8097,8033,837,8098,8034,837,8099,8035,837,8100,8036,837,8101,8037,837,8102,8038,837,8103,8039,837,8104,8040,837,8105,8041,837,8106,8042,837,8107,8043,837,8108,8044,837,8109,8045,837,8110,8046,837,8111,8047,837,8112,945,774,8113,945,772,8114,8048,837,8115,945,837,8116,940,837,8118,945,834,8119,8118,837,8120,913,774,8121,913,772,8122,913,768,8123,902,-1,8124,913,837,8126,953,-1,8129,168,834,8130,8052,837,8131,951,837,8132,942,837,8134,951,834,8135,8134,837,8136,917,768,8137,904,-1,8138,919,768,8139,905,-1,8140,919,837,8141,8127,768,8142,8127,769,8143,8127,834,8144,953,774,8145,953,772,8146,970,768,8147,912,-1,8150,953,834,8151,970,834,8152,921,774,8153,921,772,8154,921,768,8155,906,-1,8157,8190,768,8158,8190,769,8159,8190,834,8160,965,774,8161,965,772,8162,971,768,8163,944,-1,8164,961,787,8165,961,788,8166,965,834,8167,971,834,8168,933,774,8169,933,772,8170,933,768,8171,910,-1,8172,929,788,8173,168,768,8174,901,-1,8175,96,-1,8178,8060,837,8179,969,837,8180,974,837,8182,969,834,8183,8182,837,8184,927,768,8185,908,-1,8186,937,768,8187,911,-1,8188,937,837,8189,180,-1,8192,8194,-1,8193,8195,-1,8486,937,-1,8490,75,-1,8491,197,-1,8602,8592,824,8603,8594,824,8622,8596,824,8653,8656,824,8654,8660,824,8655,8658,824,8708,8707,824,8713,8712,824,8716,8715,824,8740,8739,824,8742,8741,824,8769,8764,824,8772,8771,824,8775,8773,824,8777,8776,824,8800,61,824,8802,8801,824,8813,8781,824,8814,60,824,8815,62,824,8816,8804,824,8817,8805,824,8820,8818,824,8821,8819,824,8824,8822,824,8825,8823,824,8832,8826,824,8833,8827,824,8836,8834,824,8837,8835,824,8840,8838,824,8841,8839,824,8876,8866,824,8877,8872,824,8878,8873,824,8879,8875,824,8928,8828,824,8929,8829,824,8930,8849,824,8931,8850,824,8938,8882,824,8939,8883,824,8940,8884,824,8941,8885,824,9001,12296,-1,9002,12297,-1,10972,10973,824,12364,12363,12441,12366,12365,12441,12368,12367,12441,12370,12369,12441,12372,12371,12441,12374,12373,12441,12376,12375,12441,12378,12377,12441,12380,12379,12441,12382,12381,12441,12384,12383,12441,12386,12385,12441,12389,12388,12441,12391,12390,12441,12393,12392,12441,12400,12399,12441,12401,12399,12442,12403,12402,12441,12404,12402,12442,12406,12405,12441,12407,12405,12442,12409,12408,12441,12410,12408,12442,12412,12411,12441,12413,12411,12442,12436,12358,12441,12446,12445,12441,12460,12459,12441,12462,12461,12441,12464,12463,12441,12466,12465,12441,12468,12467,12441,12470,12469,12441,12472,12471,12441,12474,12473,12441,12476,12475,12441,12478,12477,12441,12480,12479,12441,12482,12481,12441,12485,12484,12441,12487,12486,12441,12489,12488,12441,12496,12495,12441,12497,12495,12442,12499,12498,12441,12500,12498,12442,12502,12501,12441,12503,12501,12442,12505,12504,12441,12506,12504,12442,12508,12507,12441,12509,12507,12442,12532,12454,12441,12535,12527,12441,12536,12528,12441,12537,12529,12441,12538,12530,12441,12542,12541,12441,63744,35912,-1,63745,26356,-1,63746,36554,-1,63747,36040,-1,63748,28369,-1,63749,20018,-1,63750,21477,-1,63751,40860,-1,63752,40860,-1,63753,22865,-1,63754,37329,-1,63755,21895,-1,63756,22856,-1,63757,25078,-1,63758,30313,-1,63759,32645,-1,63760,34367,-1,63761,34746,-1,63762,35064,-1,63763,37007,-1,63764,27138,-1,63765,27931,-1,63766,28889,-1,63767,29662,-1,63768,33853,-1,63769,37226,-1,63770,39409,-1,63771,20098,-1,63772,21365,-1,63773,27396,-1,63774,29211,-1,63775,34349,-1,63776,40478,-1,63777,23888,-1,63778,28651,-1,63779,34253,-1,63780,35172,-1,63781,25289,-1,63782,33240,-1,63783,34847,-1,63784,24266,-1,63785,26391,-1,63786,28010,-1,63787,29436,-1,63788,37070,-1,63789,20358,-1,63790,20919,-1,63791,21214,-1,63792,25796,-1,63793,27347,-1,63794,29200,-1,63795,30439,-1,63796,32769,-1,63797,34310,-1,63798,34396,-1,63799,36335,-1,63800,38706,-1,63801,39791,-1,63802,40442,-1,63803,30860,-1,63804,31103,-1,63805,32160,-1,63806,33737,-1,63807,37636,-1,63808,40575,-1,63809,35542,-1,63810,22751,-1,63811,24324,-1,63812,31840,-1,63813,32894,-1,63814,29282,-1,63815,30922,-1,63816,36034,-1,63817,38647,-1,63818,22744,-1,63819,23650,-1,63820,27155,-1,63821,28122,-1,63822,28431,-1,63823,32047,-1,63824,32311,-1,63825,38475,-1,63826,21202,-1,63827,32907,-1,63828,20956,-1,63829,20940,-1,63830,31260,-1,63831,32190,-1,63832,33777,-1,63833,38517,-1,63834,35712,-1,63835,25295,-1,63836,27138,-1,63837,35582,-1,63838,20025,-1,63839,23527,-1,63840,24594,-1,63841,29575,-1,63842,30064,-1,63843,21271,-1,63844,30971,-1,63845,20415,-1,63846,24489,-1,63847,19981,-1,63848,27852,-1,63849,25976,-1,63850,32034,-1,63851,21443,-1,63852,22622,-1,63853,30465,-1,63854,33865,-1,63855,35498,-1,63856,27578,-1,63857,36784,-1,63858,27784,-1,63859,25342,-1,63860,33509,-1,63861,25504,-1,63862,30053,-1,63863,20142,-1,63864,20841,-1,63865,20937,-1,63866,26753,-1,63867,31975,-1,63868,33391,-1,63869,35538,-1,63870,37327,-1,63871,21237,-1,63872,21570,-1,63873,22899,-1,63874,24300,-1,63875,26053,-1,63876,28670,-1,63877,31018,-1,63878,38317,-1,63879,39530,-1,63880,40599,-1,63881,40654,-1,63882,21147,-1,63883,26310,-1,63884,27511,-1,63885,36706,-1,63886,24180,-1,63887,24976,-1,63888,25088,-1,63889,25754,-1,63890,28451,-1,63891,29001,-1,63892,29833,-1,63893,31178,-1,63894,32244,-1,63895,32879,-1,63896,36646,-1,63897,34030,-1,63898,36899,-1,63899,37706,-1,63900,21015,-1,63901,21155,-1,63902,21693,-1,63903,28872,-1,63904,35010,-1,63905,35498,-1,63906,24265,-1,63907,24565,-1,63908,25467,-1,63909,27566,-1,63910,31806,-1,63911,29557,-1,63912,20196,-1,63913,22265,-1,63914,23527,-1,63915,23994,-1,63916,24604,-1,63917,29618,-1,63918,29801,-1,63919,32666,-1,63920,32838,-1,63921,37428,-1,63922,38646,-1,63923,38728,-1,63924,38936,-1,63925,20363,-1,63926,31150,-1,63927,37300,-1,63928,38584,-1,63929,24801,-1,63930,20102,-1,63931,20698,-1,63932,23534,-1,63933,23615,-1,63934,26009,-1,63935,27138,-1,63936,29134,-1,63937,30274,-1,63938,34044,-1,63939,36988,-1,63940,40845,-1,63941,26248,-1,63942,38446,-1,63943,21129,-1,63944,26491,-1,63945,26611,-1,63946,27969,-1,63947,28316,-1,63948,29705,-1,63949,30041,-1,63950,30827,-1,63951,32016,-1,63952,39006,-1,63953,20845,-1,63954,25134,-1,63955,38520,-1,63956,20523,-1,63957,23833,-1,63958,28138,-1,63959,36650,-1,63960,24459,-1,63961,24900,-1,63962,26647,-1,63963,29575,-1,63964,38534,-1,63965,21033,-1,63966,21519,-1,63967,23653,-1,63968,26131,-1,63969,26446,-1,63970,26792,-1,63971,27877,-1,63972,29702,-1,63973,30178,-1,63974,32633,-1,63975,35023,-1,63976,35041,-1,63977,37324,-1,63978,38626,-1,63979,21311,-1,63980,28346,-1,63981,21533,-1,63982,29136,-1,63983,29848,-1,63984,34298,-1,63985,38563,-1,63986,40023,-1,63987,40607,-1,63988,26519,-1,63989,28107,-1,63990,33256,-1,63991,31435,-1,63992,31520,-1,63993,31890,-1,63994,29376,-1,63995,28825,-1,63996,35672,-1,63997,20160,-1,63998,33590,-1,63999,21050,-1,64e3,20999,-1,64001,24230,-1,64002,25299,-1,64003,31958,-1,64004,23429,-1,64005,27934,-1,64006,26292,-1,64007,36667,-1,64008,34892,-1,64009,38477,-1,64010,35211,-1,64011,24275,-1,64012,20800,-1,64013,21952,-1,64016,22618,-1,64018,26228,-1,64021,20958,-1,64022,29482,-1,64023,30410,-1,64024,31036,-1,64025,31070,-1,64026,31077,-1,64027,31119,-1,64028,38742,-1,64029,31934,-1,64030,32701,-1,64032,34322,-1,64034,35576,-1,64037,36920,-1,64038,37117,-1,64042,39151,-1,64043,39164,-1,64044,39208,-1,64045,40372,-1,64046,37086,-1,64047,38583,-1,64048,20398,-1,64049,20711,-1,64050,20813,-1,64051,21193,-1,64052,21220,-1,64053,21329,-1,64054,21917,-1,64055,22022,-1,64056,22120,-1,64057,22592,-1,64058,22696,-1,64059,23652,-1,64060,23662,-1,64061,24724,-1,64062,24936,-1,64063,24974,-1,64064,25074,-1,64065,25935,-1,64066,26082,-1,64067,26257,-1,64068,26757,-1,64069,28023,-1,64070,28186,-1,64071,28450,-1,64072,29038,-1,64073,29227,-1,64074,29730,-1,64075,30865,-1,64076,31038,-1,64077,31049,-1,64078,31048,-1,64079,31056,-1,64080,31062,-1,64081,31069,-1,64082,31117,-1,64083,31118,-1,64084,31296,-1,64085,31361,-1,64086,31680,-1,64087,32244,-1,64088,32265,-1,64089,32321,-1,64090,32626,-1,64091,32773,-1,64092,33261,-1,64093,33401,-1,64094,33401,-1,64095,33879,-1,64096,35088,-1,64097,35222,-1,64098,35585,-1,64099,35641,-1,64100,36051,-1,64101,36104,-1,64102,36790,-1,64103,36920,-1,64104,38627,-1,64105,38911,-1,64106,38971,-1,64107,24693,-1,64108,148206,-1,64109,33304,-1,64112,20006,-1,64113,20917,-1,64114,20840,-1,64115,20352,-1,64116,20805,-1,64117,20864,-1,64118,21191,-1,64119,21242,-1,64120,21917,-1,64121,21845,-1,64122,21913,-1,64123,21986,-1,64124,22618,-1,64125,22707,-1,64126,22852,-1,64127,22868,-1,64128,23138,-1,64129,23336,-1,64130,24274,-1,64131,24281,-1,64132,24425,-1,64133,24493,-1,64134,24792,-1,64135,24910,-1,64136,24840,-1,64137,24974,-1,64138,24928,-1,64139,25074,-1,64140,25140,-1,64141,25540,-1,64142,25628,-1,64143,25682,-1,64144,25942,-1,64145,26228,-1,64146,26391,-1,64147,26395,-1,64148,26454,-1,64149,27513,-1,64150,27578,-1,64151,27969,-1,64152,28379,-1,64153,28363,-1,64154,28450,-1,64155,28702,-1,64156,29038,-1,64157,30631,-1,64158,29237,-1,64159,29359,-1,64160,29482,-1,64161,29809,-1,64162,29958,-1,64163,30011,-1,64164,30237,-1,64165,30239,-1,64166,30410,-1,64167,30427,-1,64168,30452,-1,64169,30538,-1,64170,30528,-1,64171,30924,-1,64172,31409,-1,64173,31680,-1,64174,31867,-1,64175,32091,-1,64176,32244,-1,64177,32574,-1,64178,32773,-1,64179,33618,-1,64180,33775,-1,64181,34681,-1,64182,35137,-1,64183,35206,-1,64184,35222,-1,64185,35519,-1,64186,35576,-1,64187,35531,-1,64188,35585,-1,64189,35582,-1,64190,35565,-1,64191,35641,-1,64192,35722,-1,64193,36104,-1,64194,36664,-1,64195,36978,-1,64196,37273,-1,64197,37494,-1,64198,38524,-1,64199,38627,-1,64200,38742,-1,64201,38875,-1,64202,38911,-1,64203,38923,-1,64204,38971,-1,64205,39698,-1,64206,40860,-1,64207,141386,-1,64208,141380,-1,64209,144341,-1,64210,15261,-1,64211,16408,-1,64212,16441,-1,64213,152137,-1,64214,154832,-1,64215,163539,-1,64216,40771,-1,64217,40846,-1,64285,1497,1460,64287,1522,1463,64298,1513,1473,64299,1513,1474,64300,64329,1473,64301,64329,1474,64302,1488,1463,64303,1488,1464,64304,1488,1468,64305,1489,1468,64306,1490,1468,64307,1491,1468,64308,1492,1468,64309,1493,1468,64310,1494,1468,64312,1496,1468,64313,1497,1468,64314,1498,1468,64315,1499,1468,64316,1500,1468,64318,1502,1468,64320,1504,1468,64321,1505,1468,64323,1507,1468,64324,1508,1468,64326,1510,1468,64327,1511,1468,64328,1512,1468,64329,1513,1468,64330,1514,1468,64331,1493,1465,64332,1489,1471,64333,1499,1471,64334,1508,1471,67017,67026,775,67044,67034,775,69786,69785,69818,69788,69787,69818,69803,69797,69818,69934,69937,69927,69935,69938,69927,70475,70471,70462,70476,70471,70487,70531,70530,70601,70533,70532,70587,70542,70539,70594,70545,70544,70601,70597,70594,70594,70599,70594,70584,70600,70594,70601,70843,70841,70842,70844,70841,70832,70846,70841,70845,71098,71096,71087,71099,71097,71087,71992,71989,71984,90401,90398,90398,90402,90398,90409,90403,90398,90399,90404,90409,90399,90405,90398,90400,90406,90401,90399,90407,90402,90399,90408,90401,90400,93544,93543,93543,93545,93539,93543,93546,93545,93543,119134,119127,119141,119135,119128,119141,119136,119135,119150,119137,119135,119151,119138,119135,119152,119139,119135,119153,119140,119135,119154,119227,119225,119141,119228,119226,119141,119229,119227,119150,119230,119228,119150,119231,119227,119151,119232,119228,119151,194560,20029,-1,194561,20024,-1,194562,20033,-1,194563,131362,-1,194564,20320,-1,194565,20398,-1,194566,20411,-1,194567,20482,-1,194568,20602,-1,194569,20633,-1,194570,20711,-1,194571,20687,-1,194572,13470,-1,194573,132666,-1,194574,20813,-1,194575,20820,-1,194576,20836,-1,194577,20855,-1,194578,132380,-1,194579,13497,-1,194580,20839,-1,194581,20877,-1,194582,132427,-1,194583,20887,-1,194584,20900,-1,194585,20172,-1,194586,20908,-1,194587,20917,-1,194588,168415,-1,194589,20981,-1,194590,20995,-1,194591,13535,-1,194592,21051,-1,194593,21062,-1,194594,21106,-1,194595,21111,-1,194596,13589,-1,194597,21191,-1,194598,21193,-1,194599,21220,-1,194600,21242,-1,194601,21253,-1,194602,21254,-1,194603,21271,-1,194604,21321,-1,194605,21329,-1,194606,21338,-1,194607,21363,-1,194608,21373,-1,194609,21375,-1,194610,21375,-1,194611,21375,-1,194612,133676,-1,194613,28784,-1,194614,21450,-1,194615,21471,-1,194616,133987,-1,194617,21483,-1,194618,21489,-1,194619,21510,-1,194620,21662,-1,194621,21560,-1,194622,21576,-1,194623,21608,-1,194624,21666,-1,194625,21750,-1,194626,21776,-1,194627,21843,-1,194628,21859,-1,194629,21892,-1,194630,21892,-1,194631,21913,-1,194632,21931,-1,194633,21939,-1,194634,21954,-1,194635,22294,-1,194636,22022,-1,194637,22295,-1,194638,22097,-1,194639,22132,-1,194640,20999,-1,194641,22766,-1,194642,22478,-1,194643,22516,-1,194644,22541,-1,194645,22411,-1,194646,22578,-1,194647,22577,-1,194648,22700,-1,194649,136420,-1,194650,22770,-1,194651,22775,-1,194652,22790,-1,194653,22810,-1,194654,22818,-1,194655,22882,-1,194656,136872,-1,194657,136938,-1,194658,23020,-1,194659,23067,-1,194660,23079,-1,194661,23e3,-1,194662,23142,-1,194663,14062,-1,194664,14076,-1,194665,23304,-1,194666,23358,-1,194667,23358,-1,194668,137672,-1,194669,23491,-1,194670,23512,-1,194671,23527,-1,194672,23539,-1,194673,138008,-1,194674,23551,-1,194675,23558,-1,194676,24403,-1,194677,23586,-1,194678,14209,-1,194679,23648,-1,194680,23662,-1,194681,23744,-1,194682,23693,-1,194683,138724,-1,194684,23875,-1,194685,138726,-1,194686,23918,-1,194687,23915,-1,194688,23932,-1,194689,24033,-1,194690,24034,-1,194691,14383,-1,194692,24061,-1,194693,24104,-1,194694,24125,-1,194695,24169,-1,194696,14434,-1,194697,139651,-1,194698,14460,-1,194699,24240,-1,194700,24243,-1,194701,24246,-1,194702,24266,-1,194703,172946,-1,194704,24318,-1,194705,140081,-1,194706,140081,-1,194707,33281,-1,194708,24354,-1,194709,24354,-1,194710,14535,-1,194711,144056,-1,194712,156122,-1,194713,24418,-1,194714,24427,-1,194715,14563,-1,194716,24474,-1,194717,24525,-1,194718,24535,-1,194719,24569,-1,194720,24705,-1,194721,14650,-1,194722,14620,-1,194723,24724,-1,194724,141012,-1,194725,24775,-1,194726,24904,-1,194727,24908,-1,194728,24910,-1,194729,24908,-1,194730,24954,-1,194731,24974,-1,194732,25010,-1,194733,24996,-1,194734,25007,-1,194735,25054,-1,194736,25074,-1,194737,25078,-1,194738,25104,-1,194739,25115,-1,194740,25181,-1,194741,25265,-1,194742,25300,-1,194743,25424,-1,194744,142092,-1,194745,25405,-1,194746,25340,-1,194747,25448,-1,194748,25475,-1,194749,25572,-1,194750,142321,-1,194751,25634,-1,194752,25541,-1,194753,25513,-1,194754,14894,-1,194755,25705,-1,194756,25726,-1,194757,25757,-1,194758,25719,-1,194759,14956,-1,194760,25935,-1,194761,25964,-1,194762,143370,-1,194763,26083,-1,194764,26360,-1,194765,26185,-1,194766,15129,-1,194767,26257,-1,194768,15112,-1,194769,15076,-1,194770,20882,-1,194771,20885,-1,194772,26368,-1,194773,26268,-1,194774,32941,-1,194775,17369,-1,194776,26391,-1,194777,26395,-1,194778,26401,-1,194779,26462,-1,194780,26451,-1,194781,144323,-1,194782,15177,-1,194783,26618,-1,194784,26501,-1,194785,26706,-1,194786,26757,-1,194787,144493,-1,194788,26766,-1,194789,26655,-1,194790,26900,-1,194791,15261,-1,194792,26946,-1,194793,27043,-1,194794,27114,-1,194795,27304,-1,194796,145059,-1,194797,27355,-1,194798,15384,-1,194799,27425,-1,194800,145575,-1,194801,27476,-1,194802,15438,-1,194803,27506,-1,194804,27551,-1,194805,27578,-1,194806,27579,-1,194807,146061,-1,194808,138507,-1,194809,146170,-1,194810,27726,-1,194811,146620,-1,194812,27839,-1,194813,27853,-1,194814,27751,-1,194815,27926,-1,194816,27966,-1,194817,28023,-1,194818,27969,-1,194819,28009,-1,194820,28024,-1,194821,28037,-1,194822,146718,-1,194823,27956,-1,194824,28207,-1,194825,28270,-1,194826,15667,-1,194827,28363,-1,194828,28359,-1,194829,147153,-1,194830,28153,-1,194831,28526,-1,194832,147294,-1,194833,147342,-1,194834,28614,-1,194835,28729,-1,194836,28702,-1,194837,28699,-1,194838,15766,-1,194839,28746,-1,194840,28797,-1,194841,28791,-1,194842,28845,-1,194843,132389,-1,194844,28997,-1,194845,148067,-1,194846,29084,-1,194847,148395,-1,194848,29224,-1,194849,29237,-1,194850,29264,-1,194851,149e3,-1,194852,29312,-1,194853,29333,-1,194854,149301,-1,194855,149524,-1,194856,29562,-1,194857,29579,-1,194858,16044,-1,194859,29605,-1,194860,16056,-1,194861,16056,-1,194862,29767,-1,194863,29788,-1,194864,29809,-1,194865,29829,-1,194866,29898,-1,194867,16155,-1,194868,29988,-1,194869,150582,-1,194870,30014,-1,194871,150674,-1,194872,30064,-1,194873,139679,-1,194874,30224,-1,194875,151457,-1,194876,151480,-1,194877,151620,-1,194878,16380,-1,194879,16392,-1,194880,30452,-1,194881,151795,-1,194882,151794,-1,194883,151833,-1,194884,151859,-1,194885,30494,-1,194886,30495,-1,194887,30495,-1,194888,30538,-1,194889,16441,-1,194890,30603,-1,194891,16454,-1,194892,16534,-1,194893,152605,-1,194894,30798,-1,194895,30860,-1,194896,30924,-1,194897,16611,-1,194898,153126,-1,194899,31062,-1,194900,153242,-1,194901,153285,-1,194902,31119,-1,194903,31211,-1,194904,16687,-1,194905,31296,-1,194906,31306,-1,194907,31311,-1,194908,153980,-1,194909,154279,-1,194910,154279,-1,194911,31470,-1,194912,16898,-1,194913,154539,-1,194914,31686,-1,194915,31689,-1,194916,16935,-1,194917,154752,-1,194918,31954,-1,194919,17056,-1,194920,31976,-1,194921,31971,-1,194922,32e3,-1,194923,155526,-1,194924,32099,-1,194925,17153,-1,194926,32199,-1,194927,32258,-1,194928,32325,-1,194929,17204,-1,194930,156200,-1,194931,156231,-1,194932,17241,-1,194933,156377,-1,194934,32634,-1,194935,156478,-1,194936,32661,-1,194937,32762,-1,194938,32773,-1,194939,156890,-1,194940,156963,-1,194941,32864,-1,194942,157096,-1,194943,32880,-1,194944,144223,-1,194945,17365,-1,194946,32946,-1,194947,33027,-1,194948,17419,-1,194949,33086,-1,194950,23221,-1,194951,157607,-1,194952,157621,-1,194953,144275,-1,194954,144284,-1,194955,33281,-1,194956,33284,-1,194957,36766,-1,194958,17515,-1,194959,33425,-1,194960,33419,-1,194961,33437,-1,194962,21171,-1,194963,33457,-1,194964,33459,-1,194965,33469,-1,194966,33510,-1,194967,158524,-1,194968,33509,-1,194969,33565,-1,194970,33635,-1,194971,33709,-1,194972,33571,-1,194973,33725,-1,194974,33767,-1,194975,33879,-1,194976,33619,-1,194977,33738,-1,194978,33740,-1,194979,33756,-1,194980,158774,-1,194981,159083,-1,194982,158933,-1,194983,17707,-1,194984,34033,-1,194985,34035,-1,194986,34070,-1,194987,160714,-1,194988,34148,-1,194989,159532,-1,194990,17757,-1,194991,17761,-1,194992,159665,-1,194993,159954,-1,194994,17771,-1,194995,34384,-1,194996,34396,-1,194997,34407,-1,194998,34409,-1,194999,34473,-1,195e3,34440,-1,195001,34574,-1,195002,34530,-1,195003,34681,-1,195004,34600,-1,195005,34667,-1,195006,34694,-1,195007,17879,-1,195008,34785,-1,195009,34817,-1,195010,17913,-1,195011,34912,-1,195012,34915,-1,195013,161383,-1,195014,35031,-1,195015,35038,-1,195016,17973,-1,195017,35066,-1,195018,13499,-1,195019,161966,-1,195020,162150,-1,195021,18110,-1,195022,18119,-1,195023,35488,-1,195024,35565,-1,195025,35722,-1,195026,35925,-1,195027,162984,-1,195028,36011,-1,195029,36033,-1,195030,36123,-1,195031,36215,-1,195032,163631,-1,195033,133124,-1,195034,36299,-1,195035,36284,-1,195036,36336,-1,195037,133342,-1,195038,36564,-1,195039,36664,-1,195040,165330,-1,195041,165357,-1,195042,37012,-1,195043,37105,-1,195044,37137,-1,195045,165678,-1,195046,37147,-1,195047,37432,-1,195048,37591,-1,195049,37592,-1,195050,37500,-1,195051,37881,-1,195052,37909,-1,195053,166906,-1,195054,38283,-1,195055,18837,-1,195056,38327,-1,195057,167287,-1,195058,18918,-1,195059,38595,-1,195060,23986,-1,195061,38691,-1,195062,168261,-1,195063,168474,-1,195064,19054,-1,195065,19062,-1,195066,38880,-1,195067,168970,-1,195068,19122,-1,195069,169110,-1,195070,38923,-1,195071,38923,-1,195072,38953,-1,195073,169398,-1,195074,39138,-1,195075,19251,-1,195076,39209,-1,195077,39335,-1,195078,39362,-1,195079,39422,-1,195080,19406,-1,195081,170800,-1,195082,39698,-1,195083,4e4,-1,195084,40189,-1,195085,19662,-1,195086,19693,-1,195087,40295,-1,195088,172238,-1,195089,19704,-1,195090,172293,-1,195091,172558,-1,195092,172689,-1,195093,40635,-1,195094,19798,-1,195095,40697,-1,195096,40702,-1,195097,40709,-1,195098,40719,-1,195099,40726,-1,195100,40763,-1,195101,173568,-1],t.t)
B.ci=s(["","@2x"],t.s)
B.cj=s(["line-color","line-opacity","line-width","line-gap-width","line-offset","line-blur","line-pattern","line-dasharray"],t.s)
B.ck=s(["heatmap-weight","heatmap-radius"],t.s)
B.a5=s([1769172844,1718185569,1718185522,1718185523,1835361385,1835361330,1768843636],t.t)
B.cl=s([0,64,25,65,90,74,91,96,25,97,122,74,123,169,25,170,170,74,171,185,25,186,186,74,187,191,25,192,214,74,215,215,25,216,246,74,247,247,25,248,696,74,697,735,25,736,740,74,741,745,25,746,747,13,748,767,25,768,879,58,880,883,45,884,884,25,885,887,45,890,893,45,894,894,25,895,895,45,900,900,45,901,901,25,902,902,45,903,903,25,904,906,45,908,908,45,910,929,45,931,993,45,994,1007,26,1008,1023,45,1024,1156,30,1157,1158,58,1159,1327,30,1329,1366,5,1369,1418,5,1421,1423,5,1425,1479,55,1488,1514,55,1519,1524,55,1536,1540,4,1541,1541,25,1542,1547,4,1548,1548,25,1549,1562,4,1563,1563,25,1564,1566,4,1567,1567,25,1568,1599,4,1600,1600,25,1601,1610,4,1611,1621,58,1622,1647,4,1648,1648,58,1649,1756,4,1757,1757,25,1758,1791,4,1792,1805,144,1807,1866,144,1869,1871,144,1872,1919,4,1920,1969,155,1984,2042,105,2045,2047,105,2048,2093,131,2096,2110,131,2112,2139,85,2142,2142,85,2144,2154,144,2160,2190,4,2192,2193,4,2199,2273,4,2274,2274,25,2275,2303,4,2304,2384,32,2385,2388,58,2389,2403,32,2404,2405,25,2406,2431,32,2432,2435,11,2437,2444,11,2447,2448,11,2451,2472,11,2474,2480,11,2482,2482,11,2486,2489,11,2492,2500,11,2503,2504,11,2507,2510,11,2519,2519,11,2524,2525,11,2527,2531,11,2534,2558,11,2561,2563,48,2565,2570,48,2575,2576,48,2579,2600,48,2602,2608,48,2610,2611,48,2613,2614,48,2616,2617,48,2620,2620,48,2622,2626,48,2631,2632,48,2635,2637,48,2641,2641,48,2649,2652,48,2654,2654,48,2662,2678,48,2689,2691,46,2693,2701,46,2703,2705,46,2707,2728,46,2730,2736,46,2738,2739,46,2741,2745,46,2748,2757,46,2759,2761,46,2763,2765,46,2768,2768,46,2784,2787,46,2790,2801,46,2809,2815,46,2817,2819,120,2821,2828,120,2831,2832,120,2835,2856,120,2858,2864,120,2866,2867,120,2869,2873,120,2876,2884,120,2887,2888,120,2891,2893,120,2901,2903,120,2908,2909,120,2911,2915,120,2918,2935,120,2946,2947,151,2949,2954,151,2958,2960,151,2962,2965,151,2969,2970,151,2972,2972,151,2974,2975,151,2979,2980,151,2984,2986,151,2990,3001,151,3006,3010,151,3014,3016,151,3018,3021,151,3024,3024,151,3031,3031,151,3046,3066,151,3072,3084,154,3086,3088,154,3090,3112,154,3114,3129,154,3132,3140,154,3142,3144,154,3146,3149,154,3157,3158,154,3160,3162,154,3165,3165,154,3168,3171,154,3174,3183,154,3191,3199,154,3200,3212,63,3214,3216,63,3218,3240,63,3242,3251,63,3253,3257,63,3260,3268,63,3270,3272,63,3274,3277,63,3285,3286,63,3293,3294,63,3296,3299,63,3302,3311,63,3313,3315,63,3328,3340,84,3342,3344,84,3346,3396,84,3398,3400,84,3402,3407,84,3412,3427,84,3430,3455,84,3457,3459,137,3461,3478,137,3482,3505,137,3507,3515,137,3517,3517,137,3520,3526,137,3530,3530,137,3535,3540,137,3542,3542,137,3544,3551,137,3558,3567,137,3570,3572,137,3585,3642,156,3647,3647,25,3648,3675,156,3713,3714,73,3716,3716,73,3718,3722,73,3724,3747,73,3749,3749,73,3751,3773,73,3776,3780,73,3782,3782,73,3784,3790,73,3792,3801,73,3804,3807,73,3840,3911,157,3913,3948,157,3953,3991,157,3993,4028,157,4030,4044,157,4046,4052,157,4053,4056,25,4057,4058,157,4096,4255,99,4256,4293,41,4295,4295,41,4301,4301,41,4304,4346,41,4347,4347,25,4348,4351,41,4352,4607,51,4608,4680,39,4682,4685,39,4688,4694,39,4696,4696,39,4698,4701,39,4704,4744,39,4746,4749,39,4752,4784,39,4786,4789,39,4792,4798,39,4800,4800,39,4802,4805,39,4808,4822,39,4824,4880,39,4882,4885,39,4888,4954,39,4957,4988,39,4992,5017,39,5024,5109,23,5112,5117,23,5120,5759,18,5760,5788,108,5792,5866,130,5867,5869,25,5870,5880,130,5888,5909,145,5919,5919,145,5920,5940,53,5941,5942,25,5952,5971,17,5984,5996,146,5998,6000,146,6002,6003,146,6016,6109,69,6112,6121,69,6128,6137,69,6144,6145,96,6146,6147,25,6148,6148,96,6149,6149,25,6150,6169,96,6176,6264,96,6272,6314,96,6320,6389,18,6400,6430,76,6432,6443,76,6448,6459,76,6464,6464,76,6468,6479,76,6480,6509,147,6512,6516,147,6528,6571,103,6576,6601,103,6608,6618,103,6622,6623,103,6624,6655,69,6656,6683,16,6686,6687,16,6688,6750,148,6752,6780,148,6783,6793,148,6800,6809,148,6816,6829,148,6832,6862,58,6912,6988,7,6990,7039,7,7040,7103,141,7104,7155,10,7164,7167,10,7168,7223,75,7227,7241,75,7245,7247,75,7248,7295,109,7296,7306,30,7312,7354,41,7357,7359,41,7360,7367,141,7376,7378,58,7379,7379,25,7380,7392,58,7393,7393,25,7394,7400,58,7401,7404,25,7405,7405,58,7406,7411,25,7412,7412,58,7413,7415,25,7416,7417,58,7418,7418,25,7424,7461,74,7462,7466,45,7467,7467,30,7468,7516,74,7517,7521,45,7522,7525,74,7526,7530,45,7531,7543,74,7544,7544,30,7545,7614,74,7615,7615,45,7616,7679,58,7680,7935,74,7936,7957,45,7960,7965,45,7968,8005,45,8008,8013,45,8016,8023,45,8025,8025,45,8027,8027,45,8029,8029,45,8031,8061,45,8064,8116,45,8118,8132,45,8134,8147,45,8150,8155,45,8157,8175,45,8178,8180,45,8182,8190,45,8192,8203,25,8204,8205,58,8206,8292,25,8294,8304,25,8305,8305,74,8308,8318,25,8319,8319,74,8320,8334,25,8336,8348,74,8352,8384,25,8400,8432,58,8448,8485,25,8486,8486,45,8487,8489,25,8490,8491,74,8492,8497,25,8498,8498,74,8499,8525,25,8526,8526,74,8527,8543,25,8544,8584,74,8585,8587,25,8592,9257,25,9280,9290,25,9312,10239,25,10240,10495,15,10496,11123,25,11126,11157,25,11159,11263,25,11264,11359,42,11360,11391,74,11392,11507,26,11513,11519,26,11520,11557,41,11559,11559,41,11565,11565,41,11568,11623,158,11631,11632,158,11647,11647,158,11648,11670,39,11680,11686,39,11688,11694,39,11696,11702,39,11704,11710,39,11712,11718,39,11720,11726,39,11728,11734,39,11736,11742,39,11744,11775,30,11776,11869,25,11904,11929,50,11931,12019,50,12032,12245,50,12272,12292,25,12293,12293,50,12294,12294,25,12295,12295,50,12296,12320,25,12321,12329,50,12330,12333,58,12334,12335,51,12336,12343,25,12344,12347,50,12348,12351,25,12353,12438,56,12441,12442,58,12443,12444,25,12445,12447,56,12448,12448,25,12449,12538,64,12539,12540,25,12541,12543,64,12549,12591,13,12593,12686,51,12688,12703,25,12704,12735,13,12736,12773,25,12783,12783,25,12784,12799,64,12800,12830,51,12832,12895,25,12896,12926,51,12927,13007,25,13008,13054,64,13055,13055,25,13056,13143,64,13144,13311,25,13312,19903,50,19904,19967,25,19968,40959,50,40960,42124,169,42128,42182,169,42192,42239,79,42240,42539,164,42560,42655,30,42656,42743,8,42752,42785,25,42786,42887,74,42888,42890,25,42891,42957,74,42960,42961,74,42963,42963,74,42965,42972,74,42994,43007,74,43008,43052,143,43056,43065,25,43072,43127,126,43136,43205,132,43214,43225,132,43232,43263,32,43264,43309,66,43310,43310,25,43311,43311,66,43312,43347,129,43359,43359,129,43360,43388,51,43392,43469,61,43471,43471,25,43472,43481,61,43486,43487,61,43488,43518,99,43520,43574,22,43584,43597,22,43600,43609,22,43612,43615,22,43616,43647,99,43648,43714,149,43739,43743,149,43744,43766,90,43777,43782,39,43785,43790,39,43793,43798,39,43808,43814,39,43816,43822,39,43824,43866,74,43867,43867,25,43868,43876,74,43877,43877,45,43878,43881,74,43882,43883,25,43888,43967,23,43968,44013,90,44016,44025,90,44032,55203,51,55216,55238,51,55243,55291,51,63744,64109,50,64112,64217,50,64256,64262,74,64275,64279,5,64285,64310,55,64312,64316,55,64318,64318,55,64320,64321,55,64323,64324,55,64326,64335,55,64336,64450,4,64467,64829,4,64830,64831,25,64832,64911,4,64914,64967,4,64975,64975,4,65008,65023,4,65024,65039,58,65040,65049,25,65056,65069,58,65070,65071,30,65072,65106,25,65108,65126,25,65128,65131,25,65136,65140,4,65142,65276,4,65279,65279,25,65281,65312,25,65313,65338,74,65339,65344,25,65345,65370,74,65371,65381,25,65382,65391,64,65392,65392,25,65393,65437,64,65438,65439,25,65440,65470,51,65474,65479,51,65482,65487,51,65490,65495,51,65498,65500,51,65504,65510,25,65512,65518,25,65529,65533,25,65536,65547,78,65549,65574,78,65576,65594,78,65596,65597,78,65599,65613,78,65616,65629,78,65664,65786,78,65792,65794,25,65799,65843,25,65847,65855,25,65856,65934,45,65936,65948,25,65952,65952,45,66e3,66044,25,66045,66045,58,66176,66204,80,66208,66256,19,66272,66272,58,66273,66299,25,66304,66339,112,66349,66351,112,66352,66378,43,66384,66426,114,66432,66461,163,66463,66463,163,66464,66499,115,66504,66517,115,66560,66639,31,66640,66687,134,66688,66717,122,66720,66729,122,66736,66771,121,66776,66811,121,66816,66855,37,66864,66915,20,66927,66927,20,66928,66938,165,66940,66954,165,66956,66962,165,66964,66965,165,66967,66977,165,66979,66993,165,66995,67001,165,67003,67004,165,67008,67059,160,67072,67382,77,67392,67413,77,67424,67431,77,67456,67461,74,67463,67504,74,67506,67514,74,67584,67589,28,67592,67592,28,67594,67637,28,67639,67640,28,67644,67644,28,67647,67647,28,67648,67669,57,67671,67679,57,67680,67711,124,67712,67742,100,67751,67759,100,67808,67826,54,67828,67829,54,67835,67839,54,67840,67867,127,67871,67871,127,67872,67897,81,67903,67903,81,67968,67999,93,68e3,68023,92,68028,68047,92,68050,68095,92,68096,68099,67,68101,68102,67,68108,68115,67,68117,68119,67,68121,68149,67,68152,68154,67,68159,68168,67,68176,68184,67,68192,68223,117,68224,68255,113,68288,68326,86,68331,68342,86,68352,68405,6,68409,68415,6,68416,68437,60,68440,68447,60,68448,68466,59,68472,68479,59,68480,68497,128,68505,68508,128,68521,68527,128,68608,68680,118,68736,68786,111,68800,68850,111,68858,68863,111,68864,68903,52,68912,68921,52,68928,68965,40,68969,68997,40,69006,69007,40,69216,69246,4,69248,69289,168,69291,69293,168,69296,69297,168,69314,69316,4,69372,69375,4,69376,69415,116,69424,69465,138,69488,69513,119,69552,69579,24,69600,69622,38,69632,69709,14,69714,69749,14,69759,69759,14,69760,69826,62,69837,69837,62,69840,69864,139,69872,69881,139,69888,69940,21,69942,69959,21,69968,70006,82,70016,70111,133,70113,70132,137,70144,70161,70,70163,70209,70,70272,70278,98,70280,70280,98,70282,70285,98,70287,70301,98,70303,70313,98,70320,70378,71,70384,70393,71,70400,70403,44,70405,70412,44,70415,70416,44,70419,70440,44,70442,70448,44,70450,70451,44,70453,70457,44,70459,70459,58,70460,70468,44,70471,70472,44,70475,70477,44,70480,70480,44,70487,70487,44,70493,70499,44,70502,70508,44,70512,70516,44,70528,70537,162,70539,70539,162,70542,70542,162,70544,70581,162,70583,70592,162,70594,70594,162,70597,70597,162,70599,70602,162,70604,70613,162,70615,70616,162,70625,70626,162,70656,70747,104,70749,70753,104,70784,70855,159,70864,70873,159,71040,71093,135,71096,71133,135,71168,71236,95,71248,71257,95,71264,71276,96,71296,71353,150,71360,71369,150,71376,71395,99,71424,71450,2,71453,71467,2,71472,71494,2,71680,71739,34,71840,71922,167,71935,71935,167,71936,71942,33,71945,71945,33,71948,71955,33,71957,71958,33,71960,71989,33,71991,71992,33,71995,72006,33,72016,72025,33,72096,72103,102,72106,72151,102,72154,72164,102,72192,72263,170,72272,72354,140,72368,72383,18,72384,72440,125,72448,72457,32,72640,72673,142,72688,72697,142,72704,72712,12,72714,72758,12,72760,72773,12,72784,72812,12,72816,72847,87,72850,72871,87,72873,72886,87,72960,72966,88,72968,72969,88,72971,73014,88,73018,73018,88,73020,73021,88,73023,73031,88,73040,73049,88,73056,73061,47,73063,73064,47,73066,73102,47,73104,73105,47,73107,73112,47,73120,73129,47,73440,73464,83,73472,73488,65,73490,73530,65,73534,73562,65,73648,73648,79,73664,73713,151,73727,73727,151,73728,74649,27,74752,74862,27,74864,74868,27,74880,75075,27,77712,77810,29,77824,78933,36,78944,82938,36,82944,83526,3,90368,90425,49,92160,92728,8,92736,92766,97,92768,92777,97,92782,92783,97,92784,92862,152,92864,92873,152,92880,92909,9,92912,92917,9,92928,92997,123,93008,93017,123,93019,93025,123,93027,93047,123,93053,93071,123,93504,93561,72,93760,93850,89,93952,94026,94,94031,94087,94,94095,94111,94,94176,94176,153,94177,94177,106,94178,94179,50,94180,94180,68,94192,94193,50,94208,100343,153,100352,101119,153,101120,101589,68,101631,101631,68,101632,101640,153,110576,110579,64,110581,110587,64,110589,110590,64,110592,110592,64,110593,110879,56,110880,110882,64,110898,110898,56,110928,110930,56,110933,110933,64,110948,110951,64,110960,111355,106,113664,113770,35,113776,113788,35,113792,113800,35,113808,113817,35,113820,113823,35,113824,113827,25,117760,118009,25,118016,118451,25,118528,118573,58,118576,118598,58,118608,118723,25,118784,119029,25,119040,119078,25,119081,119142,25,119143,119145,58,119146,119162,25,119163,119170,58,119171,119172,25,119173,119179,58,119180,119209,25,119210,119213,58,119214,119274,25,119296,119365,45,119488,119507,25,119520,119539,25,119552,119638,25,119648,119672,25,119808,119892,25,119894,119964,25,119966,119967,25,119970,119970,25,119973,119974,25,119977,119980,25,119982,119993,25,119995,119995,25,119997,120003,25,120005,120069,25,120071,120074,25,120077,120084,25,120086,120092,25,120094,120121,25,120123,120126,25,120128,120132,25,120134,120134,25,120138,120144,25,120146,120485,25,120488,120779,25,120782,120831,25,120832,121483,136,121499,121503,136,121505,121519,136,122624,122654,74,122661,122666,74,122880,122886,42,122888,122904,42,122907,122913,42,122915,122916,42,122918,122922,42,122928,122989,30,123023,123023,30,123136,123180,107,123184,123197,107,123200,123209,107,123214,123215,107,123536,123566,161,123584,123641,166,123647,123647,166,124112,124153,101,124368,124410,110,124415,124415,110,124896,124902,39,124904,124907,39,124909,124910,39,124912,124926,39,124928,125124,91,125127,125142,91,125184,125259,1,125264,125273,1,125278,125279,1,126065,126132,25,126209,126269,25,126464,126467,4,126469,126495,4,126497,126498,4,126500,126500,4,126503,126503,4,126505,126514,4,126516,126519,4,126521,126521,4,126523,126523,4,126530,126530,4,126535,126535,4,126537,126537,4,126539,126539,4,126541,126543,4,126545,126546,4,126548,126548,4,126551,126551,4,126553,126553,4,126555,126555,4,126557,126557,4,126559,126559,4,126561,126562,4,126564,126564,4,126567,126570,4,126572,126578,4,126580,126583,4,126585,126588,4,126590,126590,4,126592,126601,4,126603,126619,4,126625,126627,4,126629,126633,4,126635,126651,4,126704,126705,4,126976,127019,25,127024,127123,25,127136,127150,25,127153,127167,25,127169,127183,25,127185,127221,25,127232,127405,25,127462,127487,25,127488,127488,56,127489,127490,25,127504,127547,25,127552,127560,25,127568,127569,25,127584,127589,25,127744,128727,25,128732,128748,25,128752,128764,25,128768,128886,25,128891,128985,25,128992,129003,25,129008,129008,25,129024,129035,25,129040,129095,25,129104,129113,25,129120,129159,25,129168,129197,25,129200,129211,25,129216,129217,25,129280,129619,25,129632,129645,25,129648,129660,25,129664,129673,25,129679,129734,25,129742,129756,25,129759,129769,25,129776,129784,25,129792,129938,25,129940,130041,25,131072,173791,50,173824,177977,50,177984,178205,50,178208,183969,50,183984,191456,50,191472,192093,50,194560,195101,50,196608,201546,50,201552,205743,50,917505,917505,25,917536,917631,25,917760,917999,58],t.t)
B.cm=s([1633842797,1651275629,1667460464,1819239276,1835102827,1835756907,1919707495],t.t)
B.as=new A.bR(1,"children")
B.at=new A.bR(2,"leaves")
B.cn=s([B.a0,B.as,B.at],A.ak("l<bR>"))
B.co=s([173,173,5,768,879,5,1155,1161,5,1425,1469,5,1471,1471,5,1473,1474,5,1476,1477,5,1479,1479,5,1552,1562,5,1564,1564,5,1568,1568,3,1570,1573,2,1574,1574,3,1575,1575,2,1576,1576,3,1577,1577,2,1578,1582,3,1583,1586,2,1587,1599,3,1600,1600,4,1601,1607,3,1608,1608,2,1609,1610,3,1611,1631,5,1646,1647,3,1648,1648,5,1649,1651,2,1653,1655,2,1656,1671,3,1672,1689,2,1690,1727,3,1728,1728,2,1729,1730,3,1731,1739,2,1740,1740,3,1741,1741,2,1742,1742,3,1743,1743,2,1744,1745,3,1746,1747,2,1749,1749,2,1750,1756,5,1759,1764,5,1767,1768,5,1770,1773,5,1774,1775,2,1786,1788,3,1791,1791,3,1807,1807,5,1808,1808,2,1809,1809,5,1810,1812,3,1813,1817,2,1818,1821,3,1822,1822,2,1823,1831,3,1832,1832,2,1833,1833,3,1834,1834,2,1835,1835,3,1836,1836,2,1837,1838,3,1839,1839,2,1840,1866,5,1869,1869,2,1870,1880,3,1881,1883,2,1884,1898,3,1899,1900,2,1901,1904,3,1905,1905,2,1906,1906,3,1907,1908,2,1909,1911,3,1912,1913,2,1914,1919,3,1958,1968,5,1994,2026,3,2027,2035,5,2042,2042,4,2045,2045,5,2070,2073,5,2075,2083,5,2085,2087,5,2089,2093,5,2112,2112,2,2113,2117,3,2118,2119,2,2120,2120,3,2121,2121,2,2122,2131,3,2132,2132,2,2133,2133,3,2134,2136,2,2137,2139,5,2144,2144,3,2146,2149,3,2151,2151,2,2152,2152,3,2153,2154,2,2160,2178,2,2179,2181,4,2182,2182,3,2185,2189,3,2190,2190,2,2199,2207,5,2208,2217,3,2218,2220,2,2222,2222,2,2223,2224,3,2225,2226,2,2227,2232,3,2233,2233,2,2234,2248,3,2250,2273,5,2275,2306,5,2362,2362,5,2364,2364,5,2369,2376,5,2381,2381,5,2385,2391,5,2402,2403,5,2433,2433,5,2492,2492,5,2497,2500,5,2509,2509,5,2530,2531,5,2558,2558,5,2561,2562,5,2620,2620,5,2625,2626,5,2631,2632,5,2635,2637,5,2641,2641,5,2672,2673,5,2677,2677,5,2689,2690,5,2748,2748,5,2753,2757,5,2759,2760,5,2765,2765,5,2786,2787,5,2810,2815,5,2817,2817,5,2876,2876,5,2879,2879,5,2881,2884,5,2893,2893,5,2901,2902,5,2914,2915,5,2946,2946,5,3008,3008,5,3021,3021,5,3072,3072,5,3076,3076,5,3132,3132,5,3134,3136,5,3142,3144,5,3146,3149,5,3157,3158,5,3170,3171,5,3201,3201,5,3260,3260,5,3263,3263,5,3270,3270,5,3276,3277,5,3298,3299,5,3328,3329,5,3387,3388,5,3393,3396,5,3405,3405,5,3426,3427,5,3457,3457,5,3530,3530,5,3538,3540,5,3542,3542,5,3633,3633,5,3636,3642,5,3655,3662,5,3761,3761,5,3764,3772,5,3784,3790,5,3864,3865,5,3893,3893,5,3895,3895,5,3897,3897,5,3953,3966,5,3968,3972,5,3974,3975,5,3981,3991,5,3993,4028,5,4038,4038,5,4141,4144,5,4146,4151,5,4153,4154,5,4157,4158,5,4184,4185,5,4190,4192,5,4209,4212,5,4226,4226,5,4229,4230,5,4237,4237,5,4253,4253,5,4957,4959,5,5906,5908,5,5938,5939,5,5970,5971,5,6002,6003,5,6068,6069,5,6071,6077,5,6086,6086,5,6089,6099,5,6109,6109,5,6151,6151,3,6154,6154,4,6155,6157,5,6159,6159,5,6176,6264,3,6277,6278,5,6279,6312,3,6313,6313,5,6314,6314,3,6432,6434,5,6439,6440,5,6450,6450,5,6457,6459,5,6679,6680,5,6683,6683,5,6742,6742,5,6744,6750,5,6752,6752,5,6754,6754,5,6757,6764,5,6771,6780,5,6783,6783,5,6832,6862,5,6912,6915,5,6964,6964,5,6966,6970,5,6972,6972,5,6978,6978,5,7019,7027,5,7040,7041,5,7074,7077,5,7080,7081,5,7083,7085,5,7142,7142,5,7144,7145,5,7149,7149,5,7151,7153,5,7212,7219,5,7222,7223,5,7376,7378,5,7380,7392,5,7394,7400,5,7405,7405,5,7412,7412,5,7416,7417,5,7616,7679,5,8203,8203,5,8205,8205,4,8206,8207,5,8234,8238,5,8288,8292,5,8298,8303,5,8400,8432,5,11503,11505,5,11647,11647,5,11744,11775,5,12330,12333,5,12441,12442,5,42607,42610,5,42612,42621,5,42654,42655,5,42736,42737,5,43010,43010,5,43014,43014,5,43019,43019,5,43045,43046,5,43052,43052,5,43072,43121,3,43122,43122,1,43204,43205,5,43232,43249,5,43263,43263,5,43302,43309,5,43335,43345,5,43392,43394,5,43443,43443,5,43446,43449,5,43452,43453,5,43493,43493,5,43561,43566,5,43569,43570,5,43573,43574,5,43587,43587,5,43596,43596,5,43644,43644,5,43696,43696,5,43698,43700,5,43703,43704,5,43710,43711,5,43713,43713,5,43756,43757,5,43766,43766,5,44005,44005,5,44008,44008,5,44013,44013,5,64286,64286,5,65024,65039,5,65056,65071,5,65279,65279,5,65529,65531,5,66045,66045,5,66272,66272,5,66422,66426,5,68097,68099,5,68101,68102,5,68108,68111,5,68152,68154,5,68159,68159,5,68288,68292,3,68293,68293,2,68295,68295,2,68297,68298,2,68301,68301,1,68302,68306,2,68307,68310,3,68311,68311,1,68312,68316,3,68317,68317,2,68318,68320,3,68321,68321,2,68324,68324,2,68325,68326,5,68331,68334,3,68335,68335,2,68480,68480,3,68481,68481,2,68482,68482,3,68483,68485,2,68486,68488,3,68489,68489,2,68490,68491,3,68492,68492,2,68493,68493,3,68494,68495,2,68496,68496,3,68497,68497,2,68521,68524,2,68525,68526,3,68864,68864,1,68865,68897,3,68898,68898,2,68899,68899,3,68900,68903,5,68969,68973,5,69291,69292,5,69314,69314,2,69315,69316,3,69372,69375,5,69424,69426,3,69427,69427,2,69428,69444,3,69446,69456,5,69457,69459,3,69460,69460,2,69488,69491,3,69492,69493,2,69494,69505,3,69506,69509,5,69552,69552,3,69554,69555,3,69556,69558,2,69560,69560,3,69561,69562,2,69563,69564,3,69565,69565,2,69566,69567,3,69569,69569,3,69570,69571,2,69572,69572,3,69577,69577,2,69578,69578,3,69579,69579,1,69633,69633,5,69688,69702,5,69744,69744,5,69747,69748,5,69759,69761,5,69811,69814,5,69817,69818,5,69826,69826,5,69888,69890,5,69927,69931,5,69933,69940,5,70003,70003,5,70016,70017,5,70070,70078,5,70089,70092,5,70095,70095,5,70191,70193,5,70196,70196,5,70198,70199,5,70206,70206,5,70209,70209,5,70367,70367,5,70371,70378,5,70400,70401,5,70459,70460,5,70464,70464,5,70502,70508,5,70512,70516,5,70587,70592,5,70606,70606,5,70608,70608,5,70610,70610,5,70625,70626,5,70712,70719,5,70722,70724,5,70726,70726,5,70750,70750,5,70835,70840,5,70842,70842,5,70847,70848,5,70850,70851,5,71090,71093,5,71100,71101,5,71103,71104,5,71132,71133,5,71219,71226,5,71229,71229,5,71231,71232,5,71339,71339,5,71341,71341,5,71344,71349,5,71351,71351,5,71453,71453,5,71455,71455,5,71458,71461,5,71463,71467,5,71727,71735,5,71737,71738,5,71995,71996,5,71998,71998,5,72003,72003,5,72148,72151,5,72154,72155,5,72160,72160,5,72193,72202,5,72243,72248,5,72251,72254,5,72263,72263,5,72273,72278,5,72281,72283,5,72330,72342,5,72344,72345,5,72752,72758,5,72760,72765,5,72767,72767,5,72850,72871,5,72874,72880,5,72882,72883,5,72885,72886,5,73009,73014,5,73018,73018,5,73020,73021,5,73023,73029,5,73031,73031,5,73104,73105,5,73109,73109,5,73111,73111,5,73459,73460,5,73472,73473,5,73526,73530,5,73536,73536,5,73538,73538,5,73562,73562,5,78896,78912,5,78919,78933,5,90398,90409,5,90413,90415,5,92912,92916,5,92976,92982,5,94031,94031,5,94095,94098,5,94180,94180,5,113821,113822,5,113824,113827,5,118528,118573,5,118576,118598,5,119143,119145,5,119155,119170,5,119173,119179,5,119210,119213,5,119362,119364,5,121344,121398,5,121403,121452,5,121461,121461,5,121476,121476,5,121499,121503,5,121505,121519,5,122880,122886,5,122888,122904,5,122907,122913,5,122915,122916,5,122918,122922,5,123023,123023,5,123184,123190,5,123566,123566,5,123628,123631,5,124140,124143,5,124398,124399,5,125136,125142,5,125184,125251,3,125252,125259,5,917505,917505,5,917536,917631,5,917760,917999,5],t.t)
B.cp=s(["text-color","text-opacity","text-halo-color","text-halo-width","text-halo-blur","icon-color","icon-opacity","icon-halo-color","icon-halo-width","icon-halo-blur"],t.s)
B.cq=s(["a","b","c"],t.s)
B.D=new A.aT(0,"round")
B.E=new A.aT(1,"bevel")
B.w=new A.aT(2,"miter")
B.V=new A.aT(3,"none")
B.F=new A.aT(4,"fakeround")
B.W=new A.aT(5,"flipbevel")
B.G=new A.aT(6,"butt")
B.X=new A.aT(7,"square")
B.a6=s([B.D,B.E,B.w,B.V,B.F,B.W,B.G,B.X],A.ak("l<aT>"))
B.M=s([],t.E)
B.cs=s([],t.dY)
B.cr=s([],t.oM)
B.a7=s([],t.hD)
B.cD=s([],t.i9)
B.B=s([],t.r)
B.N=s([],t.w)
B.cE=s([],A.ak("l<u_>"))
B.cF=s([],t.R)
B.cG=s([],t.q)
B.cy=s([],t.ez)
B.ct=s([],t.lE)
B.cw=s([],t.m1)
B.cu=s([],t.kR)
B.aa=s([],t.s)
B.cA=s([],t.cb)
B.a8=s([],t.n5)
B.O=s([],A.ak("l<bI>"))
B.cx=s([],t.bD)
B.cv=s([],t.n)
B.m=s([],t.t)
B.cB=s([],t.dG)
B.a9=s([],t.dM)
B.A=s([],t.bU)
B.cz=s([],t.oZ)
B.d7=new A.z(11,1)
B.d8=new A.z(12,0)
B.cH=s([B.d7,B.d8],t.I)
B.cI=s([768,788,230,789,789,232,790,793,220,794,794,232,795,795,216,796,800,220,801,802,202,803,806,220,807,808,202,809,819,220,820,824,1,825,828,220,829,836,230,837,837,240,838,838,230,839,841,220,842,844,230,845,846,220,848,850,230,851,854,220,855,855,230,856,856,232,857,858,220,859,859,230,860,860,233,861,862,234,863,863,233,864,865,234,866,866,233,867,879,230,1155,1159,230,1425,1425,220,1426,1429,230,1430,1430,220,1431,1433,230,1434,1434,222,1435,1435,220,1436,1441,230,1442,1447,220,1448,1449,230,1450,1450,220,1451,1452,230,1453,1453,222,1454,1454,228,1455,1455,230,1456,1456,10,1457,1457,11,1458,1458,12,1459,1459,13,1460,1460,14,1461,1461,15,1462,1462,16,1463,1463,17,1464,1464,18,1465,1466,19,1467,1467,20,1468,1468,21,1469,1469,22,1471,1471,23,1473,1473,24,1474,1474,25,1476,1476,230,1477,1477,220,1479,1479,18,1552,1559,230,1560,1560,30,1561,1561,31,1562,1562,32,1611,1611,27,1612,1612,28,1613,1613,29,1614,1614,30,1615,1615,31,1616,1616,32,1617,1617,33,1618,1618,34,1619,1620,230,1621,1622,220,1623,1627,230,1628,1628,220,1629,1630,230,1631,1631,220,1648,1648,35,1750,1756,230,1759,1762,230,1763,1763,220,1764,1764,230,1767,1768,230,1770,1770,220,1771,1772,230,1773,1773,220,1809,1809,36,1840,1840,230,1841,1841,220,1842,1843,230,1844,1844,220,1845,1846,230,1847,1849,220,1850,1850,230,1851,1852,220,1853,1853,230,1854,1854,220,1855,1857,230,1858,1858,220,1859,1859,230,1860,1860,220,1861,1861,230,1862,1862,220,1863,1863,230,1864,1864,220,1865,1866,230,2027,2033,230,2034,2034,220,2035,2035,230,2045,2045,220,2070,2073,230,2075,2083,230,2085,2087,230,2089,2093,230,2137,2139,220,2199,2200,230,2201,2203,220,2204,2207,230,2250,2254,230,2255,2259,220,2260,2273,230,2275,2275,220,2276,2277,230,2278,2278,220,2279,2280,230,2281,2281,220,2282,2284,230,2285,2287,220,2288,2288,27,2289,2289,28,2290,2290,29,2291,2293,230,2294,2294,220,2295,2296,230,2297,2298,220,2299,2303,230,2364,2364,7,2381,2381,9,2385,2385,230,2386,2386,220,2387,2388,230,2492,2492,7,2509,2509,9,2558,2558,230,2620,2620,7,2637,2637,9,2748,2748,7,2765,2765,9,2876,2876,7,2893,2893,9,3021,3021,9,3132,3132,7,3149,3149,9,3157,3157,84,3158,3158,91,3260,3260,7,3277,3277,9,3387,3388,9,3405,3405,9,3530,3530,9,3640,3641,103,3642,3642,9,3656,3659,107,3768,3769,118,3770,3770,9,3784,3787,122,3864,3865,220,3893,3893,220,3895,3895,220,3897,3897,216,3953,3953,129,3954,3954,130,3956,3956,132,3962,3965,130,3968,3968,130,3970,3971,230,3972,3972,9,3974,3975,230,4038,4038,220,4151,4151,7,4153,4154,9,4237,4237,220,4957,4959,230,5908,5909,9,5940,5940,9,6098,6098,9,6109,6109,230,6313,6313,228,6457,6457,222,6458,6458,230,6459,6459,220,6679,6679,230,6680,6680,220,6752,6752,9,6773,6780,230,6783,6783,220,6832,6836,230,6837,6842,220,6843,6844,230,6845,6845,220,6847,6848,220,6849,6850,230,6851,6852,220,6853,6857,230,6858,6858,220,6859,6862,230,6964,6964,7,6980,6980,9,7019,7019,230,7020,7020,220,7021,7027,230,7082,7083,9,7142,7142,7,7154,7155,9,7223,7223,7,7376,7378,230,7380,7380,1,7381,7385,220,7386,7387,230,7388,7391,220,7392,7392,230,7394,7400,1,7405,7405,220,7412,7412,230,7416,7417,230,7616,7617,230,7618,7618,220,7619,7625,230,7626,7626,220,7627,7628,230,7629,7629,234,7630,7630,214,7631,7631,220,7632,7632,202,7633,7669,230,7670,7670,232,7671,7672,228,7673,7673,220,7674,7674,218,7675,7675,230,7676,7676,233,7677,7677,220,7678,7678,230,7679,7679,220,8400,8401,230,8402,8403,1,8404,8407,230,8408,8410,1,8411,8412,230,8417,8417,230,8421,8422,1,8423,8423,230,8424,8424,220,8425,8425,230,8426,8427,1,8428,8431,220,8432,8432,230,11503,11505,230,11647,11647,9,11744,11775,230,12330,12330,218,12331,12331,228,12332,12332,232,12333,12333,222,12334,12335,224,12441,12442,8,42607,42607,230,42612,42621,230,42654,42655,230,42736,42737,230,43014,43014,9,43052,43052,9,43204,43204,9,43232,43249,230,43307,43309,220,43347,43347,9,43443,43443,7,43456,43456,9,43696,43696,230,43698,43699,230,43700,43700,220,43703,43704,230,43710,43711,230,43713,43713,230,43766,43766,9,44013,44013,9,64286,64286,26,65056,65062,230,65063,65069,220,65070,65071,230,66045,66045,220,66272,66272,220,66422,66426,230,68109,68109,220,68111,68111,230,68152,68152,230,68153,68153,1,68154,68154,220,68159,68159,9,68325,68325,230,68326,68326,220,68900,68903,230,68969,68973,230,69291,69292,230,69373,69375,220,69446,69447,220,69448,69450,230,69451,69451,220,69452,69452,230,69453,69456,220,69506,69506,230,69507,69507,220,69508,69508,230,69509,69509,220,69702,69702,9,69744,69744,9,69759,69759,9,69817,69817,9,69818,69818,7,69888,69890,230,69939,69940,9,70003,70003,7,70080,70080,9,70090,70090,7,70197,70197,9,70198,70198,7,70377,70377,7,70378,70378,9,70459,70460,7,70477,70477,9,70502,70508,230,70512,70516,230,70606,70608,9,70722,70722,9,70726,70726,7,70750,70750,230,70850,70850,9,70851,70851,7,71103,71103,9,71104,71104,7,71231,71231,9,71350,71350,9,71351,71351,7,71467,71467,9,71737,71737,9,71738,71738,7,71997,71998,9,72003,72003,7,72160,72160,9,72244,72244,9,72263,72263,9,72345,72345,9,72767,72767,9,73026,73026,7,73028,73029,9,73111,73111,9,73537,73538,9,90415,90415,9,92912,92916,1,92976,92982,230,94192,94193,6,113822,113822,1,119141,119142,216,119143,119145,1,119149,119149,226,119150,119154,216,119163,119170,220,119173,119177,230,119178,119179,220,119210,119213,230,119362,119364,230,122880,122886,230,122888,122904,230,122907,122913,230,122915,122916,230,122918,122922,230,123023,123023,230,123184,123190,230,123566,123566,230,123628,123631,230,124140,124141,232,124142,124142,220,124143,124143,230,124398,124398,230,124399,124399,220,125136,125142,220,125252,125257,230,125258,125258,7],t.t)
B.P=s(["Unknown","Adlam","Ahom","Anatolian_Hieroglyphs","Arabic","Armenian","Avestan","Balinese","Bamum","Bassa_Vah","Batak","Bengali","Bhaiksuki","Bopomofo","Brahmi","Braille","Buginese","Buhid","Canadian_Aboriginal","Carian","Caucasian_Albanian","Chakma","Cham","Cherokee","Chorasmian","Common","Coptic","Cuneiform","Cypriot","Cypro_Minoan","Cyrillic","Deseret","Devanagari","Dives_Akuru","Dogra","Duployan","Egyptian_Hieroglyphs","Elbasan","Elymaic","Ethiopic","Garay","Georgian","Glagolitic","Gothic","Grantha","Greek","Gujarati","Gunjala_Gondi","Gurmukhi","Gurung_Khema","Han","Hangul","Hanifi_Rohingya","Hanunoo","Hatran","Hebrew","Hiragana","Imperial_Aramaic","Inherited","Inscriptional_Pahlavi","Inscriptional_Parthian","Javanese","Kaithi","Kannada","Katakana","Kawi","Kayah_Li","Kharoshthi","Khitan_Small_Script","Khmer","Khojki","Khudawadi","Kirat_Rai","Lao","Latin","Lepcha","Limbu","Linear_A","Linear_B","Lisu","Lycian","Lydian","Mahajani","Makasar","Malayalam","Mandaic","Manichaean","Marchen","Masaram_Gondi","Medefaidrin","Meetei_Mayek","Mende_Kikakui","Meroitic_Cursive","Meroitic_Hieroglyphs","Miao","Modi","Mongolian","Mro","Multani","Myanmar","Nabataean","Nag_Mundari","Nandinagari","New_Tai_Lue","Newa","Nko","Nushu","Nyiakeng_Puachue_Hmong","Ogham","Ol_Chiki","Ol_Onal","Old_Hungarian","Old_Italic","Old_North_Arabian","Old_Permic","Old_Persian","Old_Sogdian","Old_South_Arabian","Old_Turkic","Old_Uyghur","Oriya","Osage","Osmanya","Pahawh_Hmong","Palmyrene","Pau_Cin_Hau","Phags_Pa","Phoenician","Psalter_Pahlavi","Rejang","Runic","Samaritan","Saurashtra","Sharada","Shavian","Siddham","SignWriting","Sinhala","Sogdian","Sora_Sompeng","Soyombo","Sundanese","Sunuwar","Syloti_Nagri","Syriac","Tagalog","Tagbanwa","Tai_Le","Tai_Tham","Tai_Viet","Takri","Tamil","Tangsa","Tangut","Telugu","Thaana","Thai","Tibetan","Tifinagh","Tirhuta","Todhri","Toto","Tulu_Tigalari","Ugaritic","Vai","Vithkuqi","Wancho","Warang_Citi","Yezidi","Yi","Zanabazar_Square"],t.s)
B.cJ=s([0,8,9,9,9,11,10,10,10,11,11,11,12,12,12,13,13,10,14,27,9,28,30,10,31,31,11,32,32,12,33,34,13,35,37,5,38,42,13,43,43,4,44,44,7,45,45,4,46,47,7,48,57,3,58,58,7,59,64,13,91,96,13,123,126,13,127,132,9,133,133,10,134,159,9,160,160,7,161,161,13,162,165,5,166,169,13,171,172,13,173,173,9,174,175,13,176,177,5,178,179,3,180,180,13,182,184,13,185,185,3,187,191,13,215,215,13,247,247,13,697,698,13,706,719,13,722,735,13,741,749,13,751,767,13,768,879,8,884,885,13,894,894,13,900,901,13,903,903,13,1014,1014,13,1155,1161,8,1418,1418,13,1421,1422,13,1423,1423,5,1424,1424,1,1425,1469,8,1470,1470,1,1471,1471,8,1472,1472,1,1473,1474,8,1475,1475,1,1476,1477,8,1478,1478,1,1479,1479,8,1480,1535,1,1536,1541,6,1542,1543,13,1544,1544,2,1545,1546,5,1547,1547,2,1548,1548,7,1549,1549,2,1550,1551,13,1552,1562,8,1563,1610,2,1611,1631,8,1632,1641,6,1642,1642,5,1643,1644,6,1645,1647,2,1648,1648,8,1649,1749,2,1750,1756,8,1757,1757,6,1758,1758,13,1759,1764,8,1765,1766,2,1767,1768,8,1769,1769,13,1770,1773,8,1774,1775,2,1776,1785,3,1786,1808,2,1809,1809,8,1810,1839,2,1840,1866,8,1867,1957,2,1958,1968,8,1969,1983,2,1984,2026,1,2027,2035,8,2036,2037,1,2038,2041,13,2042,2044,1,2045,2045,8,2046,2069,1,2070,2073,8,2074,2074,1,2075,2083,8,2084,2084,1,2085,2087,8,2088,2088,1,2089,2093,8,2094,2136,1,2137,2139,8,2140,2143,1,2144,2191,2,2192,2193,6,2194,2198,2,2199,2207,8,2208,2249,2,2250,2273,8,2274,2274,6,2275,2306,8,2362,2362,8,2364,2364,8,2369,2376,8,2381,2381,8,2385,2391,8,2402,2403,8,2433,2433,8,2492,2492,8,2497,2500,8,2509,2509,8,2530,2531,8,2546,2547,5,2555,2555,5,2558,2558,8,2561,2562,8,2620,2620,8,2625,2626,8,2631,2632,8,2635,2637,8,2641,2641,8,2672,2673,8,2677,2677,8,2689,2690,8,2748,2748,8,2753,2757,8,2759,2760,8,2765,2765,8,2786,2787,8,2801,2801,5,2810,2815,8,2817,2817,8,2876,2876,8,2879,2879,8,2881,2884,8,2893,2893,8,2901,2902,8,2914,2915,8,2946,2946,8,3008,3008,8,3021,3021,8,3059,3064,13,3065,3065,5,3066,3066,13,3072,3072,8,3076,3076,8,3132,3132,8,3134,3136,8,3142,3144,8,3146,3149,8,3157,3158,8,3170,3171,8,3192,3198,13,3201,3201,8,3260,3260,8,3276,3277,8,3298,3299,8,3328,3329,8,3387,3388,8,3393,3396,8,3405,3405,8,3426,3427,8,3457,3457,8,3530,3530,8,3538,3540,8,3542,3542,8,3633,3633,8,3636,3642,8,3647,3647,5,3655,3662,8,3761,3761,8,3764,3772,8,3784,3790,8,3864,3865,8,3893,3893,8,3895,3895,8,3897,3897,8,3898,3901,13,3953,3966,8,3968,3972,8,3974,3975,8,3981,3991,8,3993,4028,8,4038,4038,8,4141,4144,8,4146,4151,8,4153,4154,8,4157,4158,8,4184,4185,8,4190,4192,8,4209,4212,8,4226,4226,8,4229,4230,8,4237,4237,8,4253,4253,8,4957,4959,8,5008,5017,13,5120,5120,13,5760,5760,12,5787,5788,13,5906,5908,8,5938,5939,8,5970,5971,8,6002,6003,8,6068,6069,8,6071,6077,8,6086,6086,8,6089,6099,8,6107,6107,5,6109,6109,8,6128,6137,13,6144,6154,13,6155,6157,8,6158,6158,9,6159,6159,8,6277,6278,8,6313,6313,8,6432,6434,8,6439,6440,8,6450,6450,8,6457,6459,8,6464,6464,13,6468,6469,13,6622,6655,13,6679,6680,8,6683,6683,8,6742,6742,8,6744,6750,8,6752,6752,8,6754,6754,8,6757,6764,8,6771,6780,8,6783,6783,8,6832,6862,8,6912,6915,8,6964,6964,8,6966,6970,8,6972,6972,8,6978,6978,8,7019,7027,8,7040,7041,8,7074,7077,8,7080,7081,8,7083,7085,8,7142,7142,8,7144,7145,8,7149,7149,8,7151,7153,8,7212,7219,8,7222,7223,8,7376,7378,8,7380,7392,8,7394,7400,8,7405,7405,8,7412,7412,8,7416,7417,8,7616,7679,8,8125,8125,13,8127,8129,13,8141,8143,13,8157,8159,13,8173,8175,13,8189,8190,13,8192,8202,12,8203,8205,9,8207,8207,1,8208,8231,13,8232,8232,12,8233,8233,10,8234,8234,14,8235,8235,15,8236,8236,18,8237,8237,16,8238,8238,17,8239,8239,7,8240,8244,5,8245,8259,13,8260,8260,7,8261,8286,13,8287,8287,12,8288,8292,9,8294,8294,19,8295,8295,20,8296,8296,21,8297,8297,22,8298,8303,9,8304,8304,3,8308,8313,3,8314,8315,4,8316,8318,13,8320,8329,3,8330,8331,4,8332,8334,13,8352,8399,5,8400,8432,8,8448,8449,13,8451,8454,13,8456,8457,13,8468,8468,13,8470,8472,13,8478,8483,13,8485,8485,13,8487,8487,13,8489,8489,13,8494,8494,5,8506,8507,13,8512,8516,13,8522,8525,13,8528,8543,13,8585,8587,13,8592,8721,13,8722,8722,4,8723,8723,5,8724,9013,13,9083,9108,13,9110,9257,13,9280,9290,13,9312,9351,13,9352,9371,3,9450,9899,13,9901,10239,13,10496,11123,13,11126,11157,13,11159,11263,13,11493,11498,13,11503,11505,8,11513,11519,13,11647,11647,8,11744,11775,8,11776,11869,13,11904,11929,13,11931,12019,13,12032,12245,13,12272,12287,13,12288,12288,12,12289,12292,13,12296,12320,13,12330,12333,8,12336,12336,13,12342,12343,13,12349,12351,13,12441,12442,8,12443,12444,13,12448,12448,13,12539,12539,13,12736,12773,13,12783,12783,13,12829,12830,13,12880,12895,13,12924,12926,13,12977,12991,13,13004,13007,13,13175,13178,13,13278,13279,13,13311,13311,13,19904,19967,13,42128,42182,13,42509,42511,13,42607,42610,8,42611,42611,13,42612,42621,8,42622,42623,13,42654,42655,8,42736,42737,8,42752,42785,13,42888,42888,13,43010,43010,8,43014,43014,8,43019,43019,8,43045,43046,8,43048,43051,13,43052,43052,8,43064,43065,5,43124,43127,13,43204,43205,8,43232,43249,8,43263,43263,8,43302,43309,8,43335,43345,8,43392,43394,8,43443,43443,8,43446,43449,8,43452,43453,8,43493,43493,8,43561,43566,8,43569,43570,8,43573,43574,8,43587,43587,8,43596,43596,8,43644,43644,8,43696,43696,8,43698,43700,8,43703,43704,8,43710,43711,8,43713,43713,8,43756,43757,8,43766,43766,8,43882,43883,13,44005,44005,8,44008,44008,8,44013,44013,8,64285,64285,1,64286,64286,8,64287,64296,1,64297,64297,4,64298,64335,1,64336,64829,2,64830,64847,13,64848,64974,2,64975,64975,13,65008,65020,2,65021,65023,13,65024,65039,8,65040,65049,13,65056,65071,8,65072,65103,13,65104,65104,7,65105,65105,13,65106,65106,7,65108,65108,13,65109,65109,7,65110,65118,13,65119,65119,5,65120,65121,13,65122,65123,4,65124,65126,13,65128,65128,13,65129,65130,5,65131,65131,13,65136,65278,2,65279,65279,9,65281,65282,13,65283,65285,5,65286,65290,13,65291,65291,4,65292,65292,7,65293,65293,4,65294,65295,7,65296,65305,3,65306,65306,7,65307,65312,13,65339,65344,13,65371,65381,13,65504,65505,5,65506,65508,13,65509,65510,5,65512,65518,13,65529,65533,13,65793,65793,13,65856,65932,13,65936,65948,13,65952,65952,13,66045,66045,8,66272,66272,8,66273,66299,3,66422,66426,8,67584,67870,1,67871,67871,13,67872,68096,1,68097,68099,8,68100,68100,1,68101,68102,8,68103,68107,1,68108,68111,8,68112,68151,1,68152,68154,8,68155,68158,1,68159,68159,8,68160,68324,1,68325,68326,8,68327,68408,1,68409,68415,13,68416,68863,1,68864,68899,2,68900,68903,8,68904,68911,2,68912,68921,6,68922,68927,2,68928,68937,6,68938,68968,1,68969,68973,8,68974,68974,13,68975,69215,1,69216,69246,6,69247,69290,1,69291,69292,8,69293,69311,1,69312,69371,2,69372,69375,8,69376,69423,1,69424,69445,2,69446,69456,8,69457,69487,2,69488,69505,1,69506,69509,8,69510,69631,1,69633,69633,8,69688,69702,8,69714,69733,13,69744,69744,8,69747,69748,8,69759,69761,8,69811,69814,8,69817,69818,8,69826,69826,8,69888,69890,8,69927,69931,8,69933,69940,8,70003,70003,8,70016,70017,8,70070,70078,8,70089,70092,8,70095,70095,8,70191,70193,8,70196,70196,8,70198,70199,8,70206,70206,8,70209,70209,8,70367,70367,8,70371,70378,8,70400,70401,8,70459,70460,8,70464,70464,8,70502,70508,8,70512,70516,8,70587,70592,8,70606,70606,8,70608,70608,8,70610,70610,8,70625,70626,8,70712,70719,8,70722,70724,8,70726,70726,8,70750,70750,8,70835,70840,8,70842,70842,8,70847,70848,8,70850,70851,8,71090,71093,8,71100,71101,8,71103,71104,8,71132,71133,8,71219,71226,8,71229,71229,8,71231,71232,8,71264,71276,13,71339,71339,8,71341,71341,8,71344,71349,8,71351,71351,8,71453,71453,8,71455,71455,8,71458,71461,8,71463,71467,8,71727,71735,8,71737,71738,8,71995,71996,8,71998,71998,8,72003,72003,8,72148,72151,8,72154,72155,8,72160,72160,8,72193,72198,8,72201,72202,8,72243,72248,8,72251,72254,8,72263,72263,8,72273,72278,8,72281,72283,8,72330,72342,8,72344,72345,8,72752,72758,8,72760,72765,8,72850,72871,8,72874,72880,8,72882,72883,8,72885,72886,8,73009,73014,8,73018,73018,8,73020,73021,8,73023,73029,8,73031,73031,8,73104,73105,8,73109,73109,8,73111,73111,8,73459,73460,8,73472,73473,8,73526,73530,8,73536,73536,8,73538,73538,8,73562,73562,8,73685,73692,13,73693,73696,5,73697,73713,13,78912,78912,8,78919,78933,8,90398,90409,8,90413,90415,8,92912,92916,8,92976,92982,8,94031,94031,8,94095,94098,8,94178,94178,13,94180,94180,8,113821,113822,8,113824,113827,9,117760,117973,13,118e3,118009,3,118016,118451,13,118528,118573,8,118576,118598,8,119143,119145,8,119155,119162,9,119163,119170,8,119173,119179,8,119210,119213,8,119273,119274,13,119296,119361,13,119362,119364,8,119365,119365,13,119552,119638,13,120513,120513,13,120539,120539,13,120571,120571,13,120597,120597,13,120629,120629,13,120655,120655,13,120687,120687,13,120713,120713,13,120745,120745,13,120771,120771,13,120782,120831,3,121344,121398,8,121403,121452,8,121461,121461,8,121476,121476,8,121499,121503,8,121505,121519,8,122880,122886,8,122888,122904,8,122907,122913,8,122915,122916,8,122918,122922,8,123023,123023,8,123184,123190,8,123566,123566,8,123628,123631,8,123647,123647,5,124140,124143,8,124398,124399,8,124928,125135,1,125136,125142,8,125143,125251,1,125252,125258,8,125259,126063,1,126064,126143,2,126144,126207,1,126208,126287,2,126288,126463,1,126464,126703,2,126704,126705,13,126706,126719,2,126720,126975,1,126976,127019,13,127024,127123,13,127136,127150,13,127153,127167,13,127169,127183,13,127185,127221,13,127232,127242,3,127243,127247,13,127279,127279,13,127338,127343,13,127405,127405,13,127584,127589,13,127744,128727,13,128732,128748,13,128752,128764,13,128768,128886,13,128891,128985,13,128992,129003,13,129008,129008,13,129024,129035,13,129040,129095,13,129104,129113,13,129120,129159,13,129168,129197,13,129200,129211,13,129216,129217,13,129280,129619,13,129632,129645,13,129648,129660,13,129664,129673,13,129679,129734,13,129742,129756,13,129759,129769,13,129776,129784,13,129792,129938,13,129940,130031,13,130032,130041,3,917505,917505,9,917536,917631,9,917760,917999,8],t.t)
B.ab=s(["linear"],t.s)
B.cK=s([1667329140,1668049255,1668641395,1684632436,1801810542,1818847073,1919118452],t.t)
B.cL=s(["fill-outline-color","fill-opacity"],t.s)
B.cM=s([40,40,165,41,41,162,91,91,373,93,93,366,123,123,501,125,125,494,3898,3898,15597,3899,3899,15594,3900,3900,15605,3901,3901,15602,5787,5787,23153,5788,5788,23150,8261,8261,33049,8262,8262,33046,8317,8317,33273,8318,8318,33270,8333,8333,33337,8334,8334,33334,8968,8968,35877,8969,8969,35874,8970,8970,35885,8971,8971,35882,9001,9001,36009,9002,9002,36006,10088,10088,40357,10089,10089,40354,10090,10090,40365,10091,10091,40362,10092,10092,40373,10093,10093,40370,10094,10094,40381,10095,10095,40378,10096,10096,40389,10097,10097,40386,10098,10098,40397,10099,10099,40394,10100,10100,40405,10101,10101,40402,10181,10181,40729,10182,10182,40726,10214,10214,40861,10215,10215,40858,10216,10216,40869,10217,10217,40866,10218,10218,40877,10219,10219,40874,10220,10220,40885,10221,10221,40882,10222,10222,40893,10223,10223,40890,10627,10627,42513,10628,10628,42510,10629,10629,42521,10630,10630,42518,10631,10631,42529,10632,10632,42526,10633,10633,42537,10634,10634,42534,10635,10635,42545,10636,10636,42542,10637,10637,42561,10638,10638,42558,10639,10639,42553,10640,10640,42550,10641,10641,42569,10642,10642,42566,10643,10643,42577,10644,10644,42574,10645,10645,42585,10646,10646,42582,10647,10647,42593,10648,10648,42590,10712,10712,42853,10713,10713,42850,10714,10714,42861,10715,10715,42858,10748,10748,42997,10749,10749,42994,11810,11810,47245,11811,11811,47242,11812,11812,47253,11813,11813,47250,11814,11814,47261,11815,11815,47258,11816,11816,47269,11817,11817,47266,11861,11861,47449,11862,11862,47446,11863,11863,47457,11864,11864,47454,11865,11865,47465,11866,11866,47462,11867,11867,47473,11868,11868,47470,12296,12296,49189,12297,12297,49186,12298,12298,49197,12299,12299,49194,12300,12300,49205,12301,12301,49202,12302,12302,49213,12303,12303,49210,12304,12304,49221,12305,12305,49218,12308,12308,49237,12309,12309,49234,12310,12310,49245,12311,12311,49242,12312,12312,49253,12313,12313,49250,12314,12314,49261,12315,12315,49258,65113,65113,260457,65114,65114,260454,65115,65115,260465,65116,65116,260462,65117,65117,260473,65118,65118,260470,65288,65288,261157,65289,65289,261154,65339,65339,261365,65341,65341,261358,65371,65371,261493,65373,65373,261486,65375,65375,261505,65376,65376,261502,65378,65378,261517,65379,65379,261514],t.t)
B.cN=s(["circle-color","circle-opacity","circle-radius","circle-stroke-color","circle-stroke-width","circle-stroke-opacity","circle-blur"],t.s)
B.cO=s([0,1,2,0,2,3],t.t)
B.cQ=s(["heatmap-density"],t.s)
B.cP=s(["interpolate",B.ab,B.cQ,0,"rgba(0, 0, 255, 0)",0.1,"royalblue",0.3,"cyan",0.5,"lime",0.7,"yellow",1,"red"],t.G)
B.cR=s([0,47,6,48,57,4,58,172,6,173,173,5,174,767,6,768,879,1,880,887,6,890,895,6,900,906,6,908,908,6,910,929,6,931,1154,6,1155,1159,1,1160,1161,3,1162,1327,6,1329,1366,6,1369,1418,6,1421,1423,6,1425,1469,1,1470,1470,6,1471,1471,1,1472,1472,6,1473,1474,1,1475,1475,6,1476,1477,1,1478,1478,6,1479,1479,1,1488,1514,6,1519,1524,6,1536,1541,5,1542,1551,6,1552,1562,1,1563,1563,6,1564,1564,5,1565,1610,6,1611,1631,1,1632,1641,4,1642,1647,6,1648,1648,1,1649,1749,6,1750,1756,1,1757,1757,5,1758,1758,6,1759,1764,1,1765,1766,6,1767,1768,1,1769,1769,6,1770,1773,1,1774,1775,6,1776,1785,4,1786,1805,6,1807,1807,5,1808,1808,6,1809,1809,1,1810,1839,6,1840,1866,1,1869,1957,6,1958,1968,1,1969,1969,6,1984,1993,4,1994,2026,6,2027,2035,1,2036,2042,6,2045,2045,1,2046,2069,6,2070,2073,1,2074,2074,6,2075,2083,1,2084,2084,6,2085,2087,1,2088,2088,6,2089,2093,1,2096,2110,6,2112,2136,6,2137,2139,1,2142,2142,6,2144,2154,6,2160,2190,6,2192,2193,5,2199,2207,1,2208,2249,6,2250,2273,1,2274,2274,5,2275,2306,1,2307,2307,2,2308,2361,6,2362,2362,1,2363,2363,2,2364,2364,1,2365,2365,6,2366,2368,2,2369,2376,1,2377,2380,2,2381,2381,1,2382,2383,2,2384,2384,6,2385,2391,1,2392,2401,6,2402,2403,1,2404,2405,6,2406,2415,4,2416,2432,6,2433,2433,1,2434,2435,2,2437,2444,6,2447,2448,6,2451,2472,6,2474,2480,6,2482,2482,6,2486,2489,6,2492,2492,1,2493,2493,6,2494,2496,2,2497,2500,1,2503,2504,2,2507,2508,2,2509,2509,1,2510,2510,6,2519,2519,2,2524,2525,6,2527,2529,6,2530,2531,1,2534,2543,4,2544,2557,6,2558,2558,1,2561,2562,1,2563,2563,2,2565,2570,6,2575,2576,6,2579,2600,6,2602,2608,6,2610,2611,6,2613,2614,6,2616,2617,6,2620,2620,1,2622,2624,2,2625,2626,1,2631,2632,1,2635,2637,1,2641,2641,1,2649,2652,6,2654,2654,6,2662,2671,4,2672,2673,1,2674,2676,6,2677,2677,1,2678,2678,6,2689,2690,1,2691,2691,2,2693,2701,6,2703,2705,6,2707,2728,6,2730,2736,6,2738,2739,6,2741,2745,6,2748,2748,1,2749,2749,6,2750,2752,2,2753,2757,1,2759,2760,1,2761,2761,2,2763,2764,2,2765,2765,1,2768,2768,6,2784,2785,6,2786,2787,1,2790,2799,4,2800,2801,6,2809,2809,6,2810,2815,1,2817,2817,1,2818,2819,2,2821,2828,6,2831,2832,6,2835,2856,6,2858,2864,6,2866,2867,6,2869,2873,6,2876,2876,1,2877,2877,6,2878,2878,2,2879,2879,1,2880,2880,2,2881,2884,1,2887,2888,2,2891,2892,2,2893,2893,1,2901,2902,1,2903,2903,2,2908,2909,6,2911,2913,6,2914,2915,1,2918,2927,4,2928,2935,6,2946,2946,1,2947,2947,6,2949,2954,6,2958,2960,6,2962,2965,6,2969,2970,6,2972,2972,6,2974,2975,6,2979,2980,6,2984,2986,6,2990,3001,6,3006,3007,2,3008,3008,1,3009,3010,2,3014,3016,2,3018,3020,2,3021,3021,1,3024,3024,6,3031,3031,2,3046,3055,4,3056,3066,6,3072,3072,1,3073,3075,2,3076,3076,1,3077,3084,6,3086,3088,6,3090,3112,6,3114,3129,6,3132,3132,1,3133,3133,6,3134,3136,1,3137,3140,2,3142,3144,1,3146,3149,1,3157,3158,1,3160,3162,6,3165,3165,6,3168,3169,6,3170,3171,1,3174,3183,4,3191,3200,6,3201,3201,1,3202,3203,2,3204,3212,6,3214,3216,6,3218,3240,6,3242,3251,6,3253,3257,6,3260,3260,1,3261,3261,6,3262,3262,2,3263,3263,1,3264,3268,2,3270,3270,1,3271,3272,2,3274,3275,2,3276,3277,1,3285,3286,2,3293,3294,6,3296,3297,6,3298,3299,1,3302,3311,4,3313,3314,6,3315,3315,2,3328,3329,1,3330,3331,2,3332,3340,6,3342,3344,6,3346,3386,6,3387,3388,1,3389,3389,6,3390,3392,2,3393,3396,1,3398,3400,2,3402,3404,2,3405,3405,1,3406,3407,6,3412,3414,6,3415,3415,2,3416,3425,6,3426,3427,1,3430,3439,4,3440,3455,6,3457,3457,1,3458,3459,2,3461,3478,6,3482,3505,6,3507,3515,6,3517,3517,6,3520,3526,6,3530,3530,1,3535,3537,2,3538,3540,1,3542,3542,1,3544,3551,2,3558,3567,4,3570,3571,2,3572,3572,6,3585,3632,6,3633,3633,1,3634,3635,6,3636,3642,1,3647,3654,6,3655,3662,1,3663,3663,6,3664,3673,4,3674,3675,6,3713,3714,6,3716,3716,6,3718,3722,6,3724,3747,6,3749,3749,6,3751,3760,6,3761,3761,1,3762,3763,6,3764,3772,1,3773,3773,6,3776,3780,6,3782,3782,6,3784,3790,1,3792,3801,4,3804,3807,6,3840,3863,6,3864,3865,1,3866,3871,6,3872,3881,4,3882,3892,6,3893,3893,1,3894,3894,6,3895,3895,1,3896,3896,6,3897,3897,1,3898,3901,6,3902,3903,2,3904,3911,6,3913,3948,6,3953,3966,1,3967,3967,2,3968,3972,1,3973,3973,6,3974,3975,1,3976,3980,6,3981,3991,1,3993,4028,1,4030,4037,6,4038,4038,1,4039,4044,6,4046,4058,6,4096,4138,6,4139,4140,2,4141,4144,1,4145,4145,2,4146,4151,1,4152,4152,2,4153,4154,1,4155,4156,2,4157,4158,1,4159,4159,6,4160,4169,4,4170,4181,6,4182,4183,2,4184,4185,1,4186,4189,6,4190,4192,1,4193,4193,6,4194,4196,2,4197,4198,6,4199,4205,2,4206,4208,6,4209,4212,1,4213,4225,6,4226,4226,1,4227,4228,2,4229,4230,1,4231,4236,2,4237,4237,1,4238,4238,6,4239,4239,2,4240,4249,4,4250,4252,2,4253,4253,1,4254,4293,6,4295,4295,6,4301,4301,6,4304,4680,6,4682,4685,6,4688,4694,6,4696,4696,6,4698,4701,6,4704,4744,6,4746,4749,6,4752,4784,6,4786,4789,6,4792,4798,6,4800,4800,6,4802,4805,6,4808,4822,6,4824,4880,6,4882,4885,6,4888,4954,6,4957,4959,1,4960,4988,6,4992,5017,6,5024,5109,6,5112,5117,6,5120,5788,6,5792,5880,6,5888,5905,6,5906,5908,1,5909,5909,2,5919,5937,6,5938,5939,1,5940,5940,2,5941,5942,6,5952,5969,6,5970,5971,1,5984,5996,6,5998,6000,6,6002,6003,1,6016,6067,6,6068,6069,1,6070,6070,2,6071,6077,1,6078,6085,2,6086,6086,1,6087,6088,2,6089,6099,1,6100,6108,6,6109,6109,1,6112,6121,4,6128,6137,6,6144,6154,6,6155,6157,1,6158,6158,5,6159,6159,1,6160,6169,4,6176,6264,6,6272,6276,6,6277,6278,1,6279,6312,6,6313,6313,1,6314,6314,6,6320,6389,6,6400,6430,6,6432,6434,1,6435,6438,2,6439,6440,1,6441,6443,2,6448,6449,2,6450,6450,1,6451,6456,2,6457,6459,1,6464,6464,6,6468,6469,6,6470,6479,4,6480,6509,6,6512,6516,6,6528,6571,6,6576,6601,6,6608,6617,4,6618,6618,6,6622,6678,6,6679,6680,1,6681,6682,2,6683,6683,1,6686,6740,6,6741,6741,2,6742,6742,1,6743,6743,2,6744,6750,1,6752,6752,1,6753,6753,2,6754,6754,1,6755,6756,2,6757,6764,1,6765,6770,2,6771,6780,1,6783,6783,1,6784,6793,4,6800,6809,4,6816,6829,6,6832,6845,1,6846,6846,3,6847,6862,1,6912,6915,1,6916,6916,2,6917,6963,6,6964,6964,1,6965,6965,2,6966,6970,1,6971,6971,2,6972,6972,1,6973,6977,2,6978,6978,1,6979,6980,2,6981,6988,6,6990,6991,6,6992,7001,4,7002,7018,6,7019,7027,1,7028,7039,6,7040,7041,1,7042,7042,2,7043,7072,6,7073,7073,2,7074,7077,1,7078,7079,2,7080,7081,1,7082,7082,2,7083,7085,1,7086,7087,6,7088,7097,4,7098,7141,6,7142,7142,1,7143,7143,2,7144,7145,1,7146,7148,2,7149,7149,1,7150,7150,2,7151,7153,1,7154,7155,2,7164,7203,6,7204,7211,2,7212,7219,1,7220,7221,2,7222,7223,1,7227,7231,6,7232,7241,4,7245,7247,6,7248,7257,4,7258,7306,6,7312,7354,6,7357,7367,6,7376,7378,1,7379,7379,6,7380,7392,1,7393,7393,2,7394,7400,1,7401,7404,6,7405,7405,1,7406,7411,6,7412,7412,1,7413,7414,6,7415,7415,2,7416,7417,1,7418,7418,6,7424,7615,6,7616,7679,1,7680,7957,6,7960,7965,6,7968,8005,6,8008,8013,6,8016,8023,6,8025,8025,6,8027,8027,6,8029,8029,6,8031,8061,6,8064,8116,6,8118,8132,6,8134,8147,6,8150,8155,6,8157,8175,6,8178,8180,6,8182,8190,6,8192,8202,6,8203,8207,5,8208,8233,6,8234,8238,5,8239,8287,6,8288,8292,5,8294,8303,5,8304,8305,6,8308,8334,6,8336,8348,6,8352,8384,6,8400,8412,1,8413,8416,3,8417,8417,1,8418,8420,3,8421,8432,1,8448,8587,6,8592,9257,6,9280,9290,6,9312,11123,6,11126,11157,6,11159,11502,6,11503,11505,1,11506,11507,6,11513,11557,6,11559,11559,6,11565,11565,6,11568,11623,6,11631,11632,6,11647,11647,1,11648,11670,6,11680,11686,6,11688,11694,6,11696,11702,6,11704,11710,6,11712,11718,6,11720,11726,6,11728,11734,6,11736,11742,6,11744,11775,1,11776,11869,6,11904,11929,6,11931,12019,6,12032,12245,6,12272,12329,6,12330,12333,1,12334,12335,2,12336,12351,6,12353,12438,6,12441,12442,1,12443,12543,6,12549,12591,6,12593,12686,6,12688,12773,6,12783,12830,6,12832,42124,6,42128,42182,6,42192,42527,6,42528,42537,4,42538,42539,6,42560,42606,6,42607,42607,1,42608,42610,3,42611,42611,6,42612,42621,1,42622,42653,6,42654,42655,1,42656,42735,6,42736,42737,1,42738,42743,6,42752,42957,6,42960,42961,6,42963,42963,6,42965,42972,6,42994,43009,6,43010,43010,1,43011,43013,6,43014,43014,1,43015,43018,6,43019,43019,1,43020,43042,6,43043,43044,2,43045,43046,1,43047,43047,2,43048,43051,6,43052,43052,1,43056,43065,6,43072,43127,6,43136,43137,2,43138,43187,6,43188,43203,2,43204,43205,1,43214,43215,6,43216,43225,4,43232,43249,1,43250,43262,6,43263,43263,1,43264,43273,4,43274,43301,6,43302,43309,1,43310,43334,6,43335,43345,1,43346,43347,2,43359,43388,6,43392,43394,1,43395,43395,2,43396,43442,6,43443,43443,1,43444,43445,2,43446,43449,1,43450,43451,2,43452,43453,1,43454,43456,2,43457,43469,6,43471,43471,6,43472,43481,4,43486,43492,6,43493,43493,1,43494,43503,6,43504,43513,4,43514,43518,6,43520,43560,6,43561,43566,1,43567,43568,2,43569,43570,1,43571,43572,2,43573,43574,1,43584,43586,6,43587,43587,1,43588,43595,6,43596,43596,1,43597,43597,2,43600,43609,4,43612,43642,6,43643,43643,2,43644,43644,1,43645,43645,2,43646,43695,6,43696,43696,1,43697,43697,6,43698,43700,1,43701,43702,6,43703,43704,1,43705,43709,6,43710,43711,1,43712,43712,6,43713,43713,1,43714,43714,6,43739,43754,6,43755,43755,2,43756,43757,1,43758,43759,2,43760,43764,6,43765,43765,2,43766,43766,1,43777,43782,6,43785,43790,6,43793,43798,6,43808,43814,6,43816,43822,6,43824,43883,6,43888,44002,6,44003,44004,2,44005,44005,1,44006,44007,2,44008,44008,1,44009,44010,2,44011,44011,6,44012,44012,2,44013,44013,1,44016,44025,4,44032,55203,6,55216,55238,6,55243,55291,6,55296,64109,6,64112,64217,6,64256,64262,6,64275,64279,6,64285,64285,6,64286,64286,1,64287,64310,6,64312,64316,6,64318,64318,6,64320,64321,6,64323,64324,6,64326,64450,6,64467,64911,6,64914,64967,6,64975,64975,6,65008,65023,6,65024,65039,1,65040,65049,6,65056,65071,1,65072,65106,6,65108,65126,6,65128,65131,6,65136,65140,6,65142,65276,6,65279,65279,5,65281,65295,6,65296,65305,4,65306,65470,6,65474,65479,6,65482,65487,6,65490,65495,6,65498,65500,6,65504,65510,6,65512,65518,6,65529,65531,5,65532,65533,6,65536,65547,6,65549,65574,6,65576,65594,6,65596,65597,6,65599,65613,6,65616,65629,6,65664,65786,6,65792,65794,6,65799,65843,6,65847,65934,6,65936,65948,6,65952,65952,6,66e3,66044,6,66045,66045,1,66176,66204,6,66208,66256,6,66272,66272,1,66273,66299,6,66304,66339,6,66349,66378,6,66384,66421,6,66422,66426,1,66432,66461,6,66463,66499,6,66504,66517,6,66560,66717,6,66720,66729,4,66736,66771,6,66776,66811,6,66816,66855,6,66864,66915,6,66927,66938,6,66940,66954,6,66956,66962,6,66964,66965,6,66967,66977,6,66979,66993,6,66995,67001,6,67003,67004,6,67008,67059,6,67072,67382,6,67392,67413,6,67424,67431,6,67456,67461,6,67463,67504,6,67506,67514,6,67584,67589,6,67592,67592,6,67594,67637,6,67639,67640,6,67644,67644,6,67647,67669,6,67671,67742,6,67751,67759,6,67808,67826,6,67828,67829,6,67835,67867,6,67871,67897,6,67903,67903,6,67968,68023,6,68028,68047,6,68050,68096,6,68097,68099,1,68101,68102,1,68108,68111,1,68112,68115,6,68117,68119,6,68121,68149,6,68152,68154,1,68159,68159,1,68160,68168,6,68176,68184,6,68192,68255,6,68288,68324,6,68325,68326,1,68331,68342,6,68352,68405,6,68409,68437,6,68440,68466,6,68472,68497,6,68505,68508,6,68521,68527,6,68608,68680,6,68736,68786,6,68800,68850,6,68858,68899,6,68900,68903,1,68912,68921,4,68928,68937,4,68938,68965,6,68969,68973,1,68974,68997,6,69006,69007,6,69216,69246,6,69248,69289,6,69291,69292,1,69293,69293,6,69296,69297,6,69314,69316,6,69372,69375,1,69376,69415,6,69424,69445,6,69446,69456,1,69457,69465,6,69488,69505,6,69506,69509,1,69510,69513,6,69552,69579,6,69600,69622,6,69632,69632,2,69633,69633,1,69634,69634,2,69635,69687,6,69688,69702,1,69703,69709,6,69714,69733,6,69734,69743,4,69744,69744,1,69745,69746,6,69747,69748,1,69749,69749,6,69759,69761,1,69762,69762,2,69763,69807,6,69808,69810,2,69811,69814,1,69815,69816,2,69817,69818,1,69819,69820,6,69821,69821,5,69822,69825,6,69826,69826,1,69837,69837,5,69840,69864,6,69872,69881,4,69888,69890,1,69891,69926,6,69927,69931,1,69932,69932,2,69933,69940,1,69942,69951,4,69952,69956,6,69957,69958,2,69959,69959,6,69968,70002,6,70003,70003,1,70004,70006,6,70016,70017,1,70018,70018,2,70019,70066,6,70067,70069,2,70070,70078,1,70079,70080,2,70081,70088,6,70089,70092,1,70093,70093,6,70094,70094,2,70095,70095,1,70096,70105,4,70106,70111,6,70113,70132,6,70144,70161,6,70163,70187,6,70188,70190,2,70191,70193,1,70194,70195,2,70196,70196,1,70197,70197,2,70198,70199,1,70200,70205,6,70206,70206,1,70207,70208,6,70209,70209,1,70272,70278,6,70280,70280,6,70282,70285,6,70287,70301,6,70303,70313,6,70320,70366,6,70367,70367,1,70368,70370,2,70371,70378,1,70384,70393,4,70400,70401,1,70402,70403,2,70405,70412,6,70415,70416,6,70419,70440,6,70442,70448,6,70450,70451,6,70453,70457,6,70459,70460,1,70461,70461,6,70462,70463,2,70464,70464,1,70465,70468,2,70471,70472,2,70475,70477,2,70480,70480,6,70487,70487,2,70493,70497,6,70498,70499,2,70502,70508,1,70512,70516,1,70528,70537,6,70539,70539,6,70542,70542,6,70544,70581,6,70583,70583,6,70584,70586,2,70587,70592,1,70594,70594,2,70597,70597,2,70599,70602,2,70604,70605,2,70606,70606,1,70607,70607,2,70608,70608,1,70609,70609,6,70610,70610,1,70611,70613,6,70615,70616,6,70625,70626,1,70656,70708,6,70709,70711,2,70712,70719,1,70720,70721,2,70722,70724,1,70725,70725,2,70726,70726,1,70727,70735,6,70736,70745,4,70746,70747,6,70749,70749,6,70750,70750,1,70751,70753,6,70784,70831,6,70832,70834,2,70835,70840,1,70841,70841,2,70842,70842,1,70843,70846,2,70847,70848,1,70849,70849,2,70850,70851,1,70852,70855,6,70864,70873,4,71040,71086,6,71087,71089,2,71090,71093,1,71096,71099,2,71100,71101,1,71102,71102,2,71103,71104,1,71105,71131,6,71132,71133,1,71168,71215,6,71216,71218,2,71219,71226,1,71227,71228,2,71229,71229,1,71230,71230,2,71231,71232,1,71233,71236,6,71248,71257,4,71264,71276,6,71296,71338,6,71339,71339,1,71340,71340,2,71341,71341,1,71342,71343,2,71344,71349,1,71350,71350,2,71351,71351,1,71352,71353,6,71360,71369,4,71376,71395,4,71424,71450,6,71453,71453,1,71454,71454,2,71455,71455,1,71456,71457,2,71458,71461,1,71462,71462,2,71463,71467,1,71472,71481,4,71482,71494,6,71680,71723,6,71724,71726,2,71727,71735,1,71736,71736,2,71737,71738,1,71739,71739,6,71840,71903,6,71904,71913,4,71914,71922,6,71935,71942,6,71945,71945,6,71948,71955,6,71957,71958,6,71960,71983,6,71984,71989,2,71991,71992,2,71995,71996,1,71997,71997,2,71998,71998,1,71999,71999,6,72e3,72e3,2,72001,72001,6,72002,72002,2,72003,72003,1,72004,72006,6,72016,72025,4,72096,72103,6,72106,72144,6,72145,72147,2,72148,72151,1,72154,72155,1,72156,72159,2,72160,72160,1,72161,72163,6,72164,72164,2,72192,72192,6,72193,72202,1,72203,72242,6,72243,72248,1,72249,72249,2,72250,72250,6,72251,72254,1,72255,72262,6,72263,72263,1,72272,72272,6,72273,72278,1,72279,72280,2,72281,72283,1,72284,72329,6,72330,72342,1,72343,72343,2,72344,72345,1,72346,72354,6,72368,72440,6,72448,72457,6,72640,72673,6,72688,72697,4,72704,72712,6,72714,72750,6,72751,72751,2,72752,72758,1,72760,72765,1,72766,72766,2,72767,72767,1,72768,72773,6,72784,72793,4,72794,72812,6,72816,72847,6,72850,72871,1,72873,72873,2,72874,72880,1,72881,72881,2,72882,72883,1,72884,72884,2,72885,72886,1,72960,72966,6,72968,72969,6,72971,73008,6,73009,73014,1,73018,73018,1,73020,73021,1,73023,73029,1,73030,73030,6,73031,73031,1,73040,73049,4,73056,73061,6,73063,73064,6,73066,73097,6,73098,73102,2,73104,73105,1,73107,73108,2,73109,73109,1,73110,73110,2,73111,73111,1,73112,73112,6,73120,73129,4,73440,73458,6,73459,73460,1,73461,73462,2,73463,73464,6,73472,73473,1,73474,73474,6,73475,73475,2,73476,73488,6,73490,73523,6,73524,73525,2,73526,73530,1,73534,73535,2,73536,73536,1,73537,73537,2,73538,73538,1,73539,73551,6,73552,73561,4,73562,73562,1,73648,73648,6,73664,73713,6,73727,74649,6,74752,74862,6,74864,74868,6,74880,75075,6,77712,77810,6,77824,78895,6,78896,78911,5,78912,78912,1,78913,78918,6,78919,78933,1,78944,82938,6,82944,83526,6,90368,90397,6,90398,90409,1,90410,90412,2,90413,90415,1,90416,90425,4,92160,92728,6,92736,92766,6,92768,92777,4,92782,92862,6,92864,92873,4,92880,92909,6,92912,92916,1,92917,92917,6,92928,92975,6,92976,92982,1,92983,92997,6,93008,93017,4,93019,93025,6,93027,93047,6,93053,93071,6,93504,93551,6,93552,93561,4,93760,93850,6,93952,94026,6,94031,94031,1,94032,94032,6,94033,94087,2,94095,94098,1,94099,94111,6,94176,94179,6,94180,94180,1,94192,94193,2,94208,100343,6,100352,101589,6,101631,101640,6,110576,110579,6,110581,110587,6,110589,110590,6,110592,110882,6,110898,110898,6,110928,110930,6,110933,110933,6,110948,110951,6,110960,111355,6,113664,113770,6,113776,113788,6,113792,113800,6,113808,113817,6,113820,113820,6,113821,113822,1,113823,113823,6,113824,113827,5,117760,117999,6,118e3,118009,4,118016,118451,6,118528,118573,1,118576,118598,1,118608,118723,6,118784,119029,6,119040,119078,6,119081,119140,6,119141,119142,2,119143,119145,1,119146,119148,6,119149,119154,2,119155,119162,5,119163,119170,1,119171,119172,6,119173,119179,1,119180,119209,6,119210,119213,1,119214,119274,6,119296,119361,6,119362,119364,1,119365,119365,6,119488,119507,6,119520,119539,6,119552,119638,6,119648,119672,6,119808,119892,6,119894,119964,6,119966,119967,6,119970,119970,6,119973,119974,6,119977,119980,6,119982,119993,6,119995,119995,6,119997,120003,6,120005,120069,6,120071,120074,6,120077,120084,6,120086,120092,6,120094,120121,6,120123,120126,6,120128,120132,6,120134,120134,6,120138,120144,6,120146,120485,6,120488,120779,6,120782,120831,4,120832,121343,6,121344,121398,1,121399,121402,6,121403,121452,1,121453,121460,6,121461,121461,1,121462,121475,6,121476,121476,1,121477,121483,6,121499,121503,1,121505,121519,1,122624,122654,6,122661,122666,6,122880,122886,1,122888,122904,1,122907,122913,1,122915,122916,1,122918,122922,1,122928,122989,6,123023,123023,1,123136,123180,6,123184,123190,1,123191,123197,6,123200,123209,4,123214,123215,6,123536,123565,6,123566,123566,1,123584,123627,6,123628,123631,1,123632,123641,4,123647,123647,6,124112,124139,6,124140,124143,1,124144,124153,4,124368,124397,6,124398,124399,1,124400,124400,6,124401,124410,4,124415,124415,6,124896,124902,6,124904,124907,6,124909,124910,6,124912,124926,6,124928,125124,6,125127,125135,6,125136,125142,1,125184,125251,6,125252,125258,1,125259,125259,6,125264,125273,4,125278,125279,6,126065,126132,6,126209,126269,6,126464,126467,6,126469,126495,6,126497,126498,6,126500,126500,6,126503,126503,6,126505,126514,6,126516,126519,6,126521,126521,6,126523,126523,6,126530,126530,6,126535,126535,6,126537,126537,6,126539,126539,6,126541,126543,6,126545,126546,6,126548,126548,6,126551,126551,6,126553,126553,6,126555,126555,6,126557,126557,6,126559,126559,6,126561,126562,6,126564,126564,6,126567,126570,6,126572,126578,6,126580,126583,6,126585,126588,6,126590,126590,6,126592,126601,6,126603,126619,6,126625,126627,6,126629,126633,6,126635,126651,6,126704,126705,6,126976,127019,6,127024,127123,6,127136,127150,6,127153,127167,6,127169,127183,6,127185,127221,6,127232,127405,6,127462,127490,6,127504,127547,6,127552,127560,6,127568,127569,6,127584,127589,6,127744,128727,6,128732,128748,6,128752,128764,6,128768,128886,6,128891,128985,6,128992,129003,6,129008,129008,6,129024,129035,6,129040,129095,6,129104,129113,6,129120,129159,6,129168,129197,6,129200,129211,6,129216,129217,6,129280,129619,6,129632,129645,6,129648,129660,6,129664,129673,6,129679,129734,6,129742,129756,6,129759,129769,6,129776,129784,6,129792,129938,6,129940,130031,6,130032,130041,4,131072,173791,6,173824,177977,6,177984,178205,6,178208,183969,6,183984,191456,6,191472,192093,6,194560,195101,6,196608,201546,6,201552,205743,6,917505,917505,5,917536,917631,5,917760,917999,1,983040,1048573,6,1048576,1114109,6],t.t)
B.d3={a:0,c:1,d:2,e:3,g:4,h:5,i:6,j:7,k:8,l:9,n:10,o:11,r:12,s:13,t:14,u:15,w:16,y:17,z:18}
B.cS=new A.aj(B.d3,["\xe0\xe1\xe2\xe3\xe4\xe5\u0101\u0103\u0105","\xe7\u0107\u0109\u010b\u010d","\u010f\u0111","\xe8\xe9\xea\xeb\u0113\u0115\u0117\u0119\u011b","\u011d\u011f\u0121\u0123","\u0125\u0127","\xec\xed\xee\xef\u0129\u012b\u012d\u012f\u0131","\u0135","\u0137","\u013a\u013c\u013e\u0140\u0142","\xf1\u0144\u0146\u0148\u0149","\xf2\xf3\xf4\xf5\xf6\xf8\u014d\u014f\u0151","\u0155\u0157\u0159","\u015b\u015d\u015f\u0161","\u0163\u0165\u0167","\xf9\xfa\xfb\xfc\u0169\u016b\u016d\u016f\u0171\u0173","\u0175","\xfd\xff\u0177","\u017a\u017c\u017e"],t.p1)
B.cb=s([65269,65270,0,0],t.t)
B.cc=s([65271,65272,0,0],t.t)
B.cd=s([65273,65274,0,0],t.t)
B.ce=s([65275,65276,0,0],t.t)
B.bB=s([64579,64646,0,0],t.t)
B.cT=new A.bV([1570,B.cb,1571,B.cc,1573,B.cd,1575,B.ce,1609,B.bB],t.nD)
B.Q=new A.bV([1552,1,1553,1,1554,1,1555,1,1556,1,1557,1,1558,1,1559,1,1560,1,1561,1,1562,1,1564,1,1568,2,1570,3,1571,3,1572,3,1573,3,1574,2,1575,3,1576,2,1577,3,1578,2,1579,2,1580,2,1581,2,1582,2,1583,3,1584,3,1585,3,1586,3,1587,2,1588,2,1589,2,1590,2,1591,2,1592,2,1593,2,1594,2,1595,2,1596,2,1597,2,1598,2,1599,2,1600,5,1601,2,1602,2,1603,2,1604,2,1605,2,1606,2,1607,2,1608,3,1609,2,1610,2,1611,1,1612,1,1613,1,1614,1,1615,1,1616,1,1617,1,1618,1,1619,1,1620,1,1621,1,1622,1,1623,1,1624,1,1625,1,1626,1,1627,1,1628,1,1629,1,1630,1,1631,1,1646,2,1647,2,1648,1,1649,3,1650,3,1651,3,1653,3,1654,3,1655,3,1656,2,1657,2,1658,2,1659,2,1660,2,1661,2,1662,2,1663,2,1664,2,1665,2,1666,2,1667,2,1668,2,1669,2,1670,2,1671,2,1672,3,1673,3,1674,3,1675,3,1676,3,1677,3,1678,3,1679,3,1680,3,1681,3,1682,3,1683,3,1684,3,1685,3,1686,3,1687,3,1688,3,1689,3,1690,2,1691,2,1692,2,1693,2,1694,2,1695,2,1696,2,1697,2,1698,2,1699,2,1700,2,1701,2,1702,2,1703,2,1704,2,1705,2,1706,2,1707,2,1708,2,1709,2,1710,2,1711,2,1712,2,1713,2,1714,2,1715,2,1716,2,1717,2,1718,2,1719,2,1720,2,1721,2,1722,2,1723,2,1724,2,1725,2,1726,2,1727,2,1728,3,1729,2,1730,2,1731,3,1732,3,1733,3,1734,3,1735,3,1736,3,1737,3,1738,3,1739,3,1740,2,1741,3,1742,2,1743,3,1744,2,1745,2,1746,3,1747,3,1749,3,1750,1,1751,1,1752,1,1753,1,1754,1,1755,1,1756,1,1759,1,1760,1,1761,1,1762,1,1763,1,1764,1,1767,1,1768,1,1770,1,1771,1,1772,1,1773,1,1774,3,1775,3,1786,2,1787,2,1788,2,1791,2,1807,1,1808,3,1809,1,1810,2,1811,2,1812,2,1813,3,1814,3,1815,3,1816,3,1817,3,1818,2,1819,2,1820,2,1821,2,1822,3,1823,2,1824,2,1825,2,1826,2,1827,2,1828,2,1829,2,1830,2,1831,2,1832,3,1833,2,1834,3,1835,2,1836,3,1837,2,1838,2,1839,3,1840,1,1841,1,1842,1,1843,1,1844,1,1845,1,1846,1,1847,1,1848,1,1849,1,1850,1,1851,1,1852,1,1853,1,1854,1,1855,1,1856,1,1857,1,1858,1,1859,1,1860,1,1861,1,1862,1,1863,1,1864,1,1865,1,1866,1,1869,3,1870,2,1871,2,1872,2,1873,2,1874,2,1875,2,1876,2,1877,2,1878,2,1879,2,1880,2,1881,3,1882,3,1883,3,1884,2,1885,2,1886,2,1887,2,1888,2,1889,2,1890,2,1891,2,1892,2,1893,2,1894,2,1895,2,1896,2,1897,2,1898,2,1899,3,1900,3,1901,2,1902,2,1903,2,1904,2,1905,3,1906,2,1907,3,1908,3,1909,2,1910,2,1911,2,1912,3,1913,3,1914,2,1915,2,1916,2,1917,2,1918,2,1919,2,1958,1,1959,1,1960,1,1961,1,1962,1,1963,1,1964,1,1965,1,1966,1,1967,1,1968,1,1994,2,1995,2,1996,2,1997,2,1998,2,1999,2,2000,2,2001,2,2002,2,2003,2,2004,2,2005,2,2006,2,2007,2,2008,2,2009,2,2010,2,2011,2,2012,2,2013,2,2014,2,2015,2,2016,2,2017,2,2018,2,2019,2,2020,2,2021,2,2022,2,2023,2,2024,2,2025,2,2026,2,2027,1,2028,1,2029,1,2030,1,2031,1,2032,1,2033,1,2034,1,2035,1,2042,5,2045,1,2070,1,2071,1,2072,1,2073,1,2075,1,2076,1,2077,1,2078,1,2079,1,2080,1,2081,1,2082,1,2083,1,2085,1,2086,1,2087,1,2089,1,2090,1,2091,1,2092,1,2093,1,2112,3,2113,2,2114,2,2115,2,2116,2,2117,2,2118,3,2119,3,2120,2,2121,3,2122,2,2123,2,2124,2,2125,2,2126,2,2127,2,2128,2,2129,2,2130,2,2131,2,2132,3,2133,2,2134,3,2135,3,2136,3,2137,1,2138,1,2139,1,2144,2,2146,2,2147,2,2148,2,2149,2,2151,3,2152,2,2153,3,2154,3,2160,3,2161,3,2162,3,2163,3,2164,3,2165,3,2166,3,2167,3,2168,3,2169,3,2170,3,2171,3,2172,3,2173,3,2174,3,2175,3,2176,3,2177,3,2178,3,2179,5,2180,5,2181,5,2182,2,2185,2,2186,2,2187,2,2188,2,2189,2,2190,3,2191,2,2199,1,2200,1,2201,1,2202,1,2203,1,2204,1,2205,1,2206,1,2207,1,2208,2,2209,2,2210,2,2211,2,2212,2,2213,2,2214,2,2215,2,2216,2,2217,2,2218,3,2219,3,2220,3,2222,3,2223,2,2224,2,2225,3,2226,3,2227,2,2228,2,2229,2,2230,2,2231,2,2232,2,2233,3,2234,2,2235,2,2236,2,2237,2,2238,2,2239,2,2240,2,2241,2,2242,2,2243,2,2244,2,2245,2,2246,2,2247,2,2248,2,2250,1,2251,1,2252,1,2253,1,2254,1,2255,1,2256,1,2257,1,2258,1,2259,1,2260,1,2261,1,2262,1,2263,1,2264,1,2265,1,2266,1,2267,1,2268,1,2269,1,2270,1,2271,1,2272,1,2273,1,2275,1,2276,1,2277,1,2278,1,2279,1,2280,1,2281,1,2282,1,2283,1,2284,1,2285,1,2286,1,2287,1,2288,1,2289,1,2290,1,2291,1,2292,1,2293,1,2294,1,2295,1,2296,1,2297,1,2298,1,2299,1,2300,1,2301,1,2302,1,2303,1,65279,1],A.ak("bV<c,c>"))
B.bC=s([65152,0,0,0],t.t)
B.bD=s([65153,65154,0,0],t.t)
B.bE=s([65155,65156,0,0],t.t)
B.bF=s([65157,65158,0,0],t.t)
B.bG=s([65159,65160,0,0],t.t)
B.bH=s([65161,65162,65163,65164],t.t)
B.bI=s([65165,65166,0,0],t.t)
B.bJ=s([65167,65168,65169,65170],t.t)
B.bK=s([65171,65172,0,0],t.t)
B.bL=s([65173,65174,65175,65176],t.t)
B.bM=s([65177,65178,65179,65180],t.t)
B.bN=s([65181,65182,65183,65184],t.t)
B.bO=s([65185,65186,65187,65188],t.t)
B.bP=s([65189,65190,65191,65192],t.t)
B.bQ=s([65193,65194,0,0],t.t)
B.bR=s([65195,65196,0,0],t.t)
B.bS=s([65197,65198,0,0],t.t)
B.bT=s([65199,65200,0,0],t.t)
B.bU=s([65201,65202,65203,65204],t.t)
B.bV=s([65205,65206,65207,65208],t.t)
B.bW=s([65209,65210,65211,65212],t.t)
B.bX=s([65213,65214,65215,65216],t.t)
B.bY=s([65217,65218,65219,65220],t.t)
B.bZ=s([65221,65222,65223,65224],t.t)
B.c_=s([65225,65226,65227,65228],t.t)
B.c0=s([65229,65230,65231,65232],t.t)
B.c1=s([65233,65234,65235,65236],t.t)
B.c2=s([65237,65238,65239,65240],t.t)
B.c3=s([65241,65242,65243,65244],t.t)
B.c4=s([65245,65246,65247,65248],t.t)
B.c5=s([65249,65250,65251,65252],t.t)
B.c6=s([65253,65254,65255,65256],t.t)
B.c7=s([65257,65258,65259,65260],t.t)
B.c8=s([65261,65262,0,0],t.t)
B.c9=s([65263,65264,64488,64489],t.t)
B.ca=s([65265,65266,65267,65268],t.t)
B.aY=s([64336,64337,0,0],t.t)
B.bv=s([64477,0,0,0],t.t)
B.b3=s([64358,64359,64360,64361],t.t)
B.b1=s([64350,64351,64352,64353],t.t)
B.aZ=s([64338,64339,64340,64341],t.t)
B.b_=s([64342,64343,64344,64345],t.t)
B.b2=s([64354,64355,64356,64357],t.t)
B.b0=s([64346,64347,64348,64349],t.t)
B.b7=s([64374,64375,64376,64377],t.t)
B.b6=s([64370,64371,64372,64373],t.t)
B.b8=s([64378,64379,64380,64381],t.t)
B.b9=s([64382,64383,64384,64385],t.t)
B.bd=s([64392,64393,0,0],t.t)
B.bb=s([64388,64389,0,0],t.t)
B.ba=s([64386,64387,0,0],t.t)
B.bc=s([64390,64391,0,0],t.t)
B.bf=s([64396,64397,0,0],t.t)
B.be=s([64394,64395,0,0],t.t)
B.b4=s([64362,64363,64364,64365],t.t)
B.b5=s([64366,64367,64368,64369],t.t)
B.bg=s([64398,64399,64400,64401],t.t)
B.br=s([64467,64468,64469,64470],t.t)
B.bh=s([64402,64403,64404,64405],t.t)
B.bj=s([64410,64411,64412,64413],t.t)
B.bi=s([64406,64407,64408,64409],t.t)
B.bk=s([64414,64415,0,0],t.t)
B.bl=s([64416,64417,64418,64419],t.t)
B.bo=s([64426,64427,64428,64429],t.t)
B.bm=s([64420,64421,0,0],t.t)
B.bn=s([64422,64423,64424,64425],t.t)
B.bx=s([64480,64481,0,0],t.t)
B.bt=s([64473,64474,0,0],t.t)
B.bs=s([64471,64472,0,0],t.t)
B.bu=s([64475,64476,0,0],t.t)
B.by=s([64482,64483,0,0],t.t)
B.bw=s([64478,64479,0,0],t.t)
B.bA=s([64508,64509,64510,64511],t.t)
B.bz=s([64484,64485,64486,64487],t.t)
B.bp=s([64430,64431,0,0],t.t)
B.bq=s([64432,64433,0,0],t.t)
B.cU=new A.bV([1569,B.bC,1570,B.bD,1571,B.bE,1572,B.bF,1573,B.bG,1574,B.bH,1575,B.bI,1576,B.bJ,1577,B.bK,1578,B.bL,1579,B.bM,1580,B.bN,1581,B.bO,1582,B.bP,1583,B.bQ,1584,B.bR,1585,B.bS,1586,B.bT,1587,B.bU,1588,B.bV,1589,B.bW,1590,B.bX,1591,B.bY,1592,B.bZ,1593,B.c_,1594,B.c0,1601,B.c1,1602,B.c2,1603,B.c3,1604,B.c4,1605,B.c5,1606,B.c6,1607,B.c7,1608,B.c8,1609,B.c9,1610,B.ca,1649,B.aY,1655,B.bv,1657,B.b3,1658,B.b1,1659,B.aZ,1662,B.b_,1663,B.b2,1664,B.b0,1667,B.b7,1668,B.b6,1670,B.b8,1671,B.b9,1672,B.bd,1676,B.bb,1677,B.ba,1678,B.bc,1681,B.bf,1688,B.be,1700,B.b4,1702,B.b5,1705,B.bg,1709,B.br,1711,B.bh,1713,B.bj,1715,B.bi,1722,B.bk,1723,B.bl,1726,B.bo,1728,B.bm,1729,B.bn,1733,B.bx,1734,B.bt,1735,B.bs,1736,B.bu,1737,B.by,1739,B.bw,1740,B.bA,1744,B.bz,1746,B.bp,1747,B.bq],t.nD)
B.d0={Arabic:0,Syriac:1,Nko:2,Thaana:3,Mongolian:4,Adlam:5,Mandaic:6,Manichaean:7,Psalter_Pahlavi:8,Hanifi_Rohingya:9,Sogdian:10,Old_Sogdian:11,Old_Uyghur:12,Chorasmian:13,Phags_Pa:14,Latin:15,Cyrillic:16,Greek:17,Hebrew:18,Armenian:19,Georgian:20,Coptic:21,Glagolitic:22,Gothic:23,Runic:24,Ogham:25,Cherokee:26,Deseret:27,Osage:28,Shavian:29,Vai:30,Tifinagh:31,Ethiopic:32,Canadian_Aboriginal:33,Braille:34,Han:35,Hiragana:36,Katakana:37,Hangul:38,Bopomofo:39,Yi:40,Nushu:41,Tangut:42,Devanagari:43,Bengali:44,Gurmukhi:45,Gujarati:46,Oriya:47,Tamil:48,Telugu:49,Kannada:50,Malayalam:51,Sinhala:52,Myanmar:53,Khmer:54,Thai:55,Lao:56,Tibetan:57,Tai_Tham:58,Tai_Le:59,New_Tai_Lue:60,Tai_Viet:61,Balinese:62,Javanese:63,Sundanese:64,Batak:65,Buginese:66,Rejang:67,Cham:68,Kayah_Li:69,Lepcha:70,Limbu:71,Meetei_Mayek:72,Syloti_Nagri:73,Chakma:74,Sharada:75,Takri:76,Khojki:77,Khudawadi:78,Multani:79,Modi:80,Grantha:81,Tirhuta:82,Newa:83,Ahom:84,Brahmi:85,Kaithi:86,Kharoshthi:87,Saurashtra:88,Mahajani:89}
B.cV=new A.aj(B.d0,["arab","syrc","nko","thaa","mong","adlm","mand","mani","phlp","rohg","sogd","sogo","ougr","chrs","phag","latn","cyrl","grek","hebr","armn","geor","copt","glag","goth","runr","ogam","cher","dsrt","osge","shaw","vai","tfng","ethi","cans","brai","hani","kana","kana","hang","bopo","yi","nshu","tang","dev2","bng2","gur2","gjr2","ory2","tml2","tel2","knd2","mlm2","sinh","mym2","khmr","thai","lao","tibt","lana","tale","talu","tavt","bali","java","sund","batk","bugi","rjng","cham","kali","lepc","limb","mtei","sylo","cakm","shrd","takr","khoj","sind","mult","modi","gran","tirh","newa","ahom","brah","kthi","khar","saur","mahj"],t.p1)
B.p={}
B.cX=new A.aj(B.p,[],A.ak("aj<q,m?(A)>"))
B.h=new A.aj(B.p,[],A.ak("aj<q,m?>"))
B.cW=new A.aj(B.p,[],A.ak("aj<q,+(d,d)>"))
B.ac=new A.aj(B.p,[],A.ak("aj<@,@>"))
B.u=new A.aj(B.p,[],A.ak("aj<m?,m?>"))
B.d5={transparent:0,aliceblue:1,antiquewhite:2,aqua:3,aquamarine:4,azure:5,beige:6,bisque:7,black:8,blanchedalmond:9,blue:10,blueviolet:11,brown:12,burlywood:13,cadetblue:14,chartreuse:15,chocolate:16,coral:17,cornflowerblue:18,cornsilk:19,crimson:20,cyan:21,darkblue:22,darkcyan:23,darkgoldenrod:24,darkgray:25,darkgreen:26,darkgrey:27,darkkhaki:28,darkmagenta:29,darkolivegreen:30,darkorange:31,darkorchid:32,darkred:33,darksalmon:34,darkseagreen:35,darkslateblue:36,darkslategray:37,darkslategrey:38,darkturquoise:39,darkviolet:40,deeppink:41,deepskyblue:42,dimgray:43,dimgrey:44,dodgerblue:45,firebrick:46,floralwhite:47,forestgreen:48,fuchsia:49,gainsboro:50,ghostwhite:51,gold:52,goldenrod:53,gray:54,green:55,greenyellow:56,grey:57,honeydew:58,hotpink:59,indianred:60,indigo:61,ivory:62,khaki:63,lavender:64,lavenderblush:65,lawngreen:66,lemonchiffon:67,lightblue:68,lightcoral:69,lightcyan:70,lightgoldenrodyellow:71,lightgray:72,lightgreen:73,lightgrey:74,lightpink:75,lightsalmon:76,lightseagreen:77,lightskyblue:78,lightslategray:79,lightslategrey:80,lightsteelblue:81,lightyellow:82,lime:83,limegreen:84,linen:85,magenta:86,maroon:87,mediumaquamarine:88,mediumblue:89,mediumorchid:90,mediumpurple:91,mediumseagreen:92,mediumslateblue:93,mediumspringgreen:94,mediumturquoise:95,mediumvioletred:96,midnightblue:97,mintcream:98,mistyrose:99,moccasin:100,navajowhite:101,navy:102,oldlace:103,olive:104,olivedrab:105,orange:106,orangered:107,orchid:108,palegoldenrod:109,palegreen:110,paleturquoise:111,palevioletred:112,papayawhip:113,peachpuff:114,peru:115,pink:116,plum:117,powderblue:118,purple:119,rebeccapurple:120,red:121,rosybrown:122,royalblue:123,saddlebrown:124,salmon:125,sandybrown:126,seagreen:127,seashell:128,sienna:129,silver:130,skyblue:131,slateblue:132,slategray:133,slategrey:134,snow:135,springgreen:136,steelblue:137,tan:138,teal:139,thistle:140,tomato:141,turquoise:142,violet:143,wheat:144,white:145,whitesmoke:146,yellow:147,yellowgreen:148}
B.cY=new A.aj(B.d5,[0,4293982463,4294634455,4278255615,4286578644,4293984255,4294309340,4294960324,4278190080,4294962125,4278190335,4287245282,4289014314,4292786311,4284456608,4286578432,4291979550,4294934352,4284782061,4294965468,4292613180,4278255615,4278190219,4278225803,4290283019,4289309097,4278215680,4289309097,4290623339,4287299723,4283788079,4294937600,4288230092,4287299584,4293498490,4287609999,4282924427,4281290575,4281290575,4278243025,4287889619,4294907027,4278239231,4285098345,4285098345,4280193279,4289864226,4294966e3,4280453922,4294902015,4292664540,4294506751,4294956800,4292519200,4286611584,4278222848,4289593135,4286611584,4293984240,4294928820,4291648604,4283105410,4294967280,4293977740,4293322490,4294963445,4286381056,4294965965,4289583334,4293951616,4292935679,4294638290,4292072403,4287688336,4292072403,4294948545,4294942842,4280332970,4287090426,4286023833,4286023833,4289774814,4294967264,4278255360,4281519410,4294635750,4294902015,4286578688,4284927402,4278190285,4290401747,4287852763,4282168177,4286277870,4278254234,4282962380,4291237253,4279834992,4294311930,4294960353,4294960309,4294958765,4278190208,4294833638,4286611456,4285238819,4294944e3,4294919424,4292505814,4293847210,4288215960,4289720046,4292571283,4294963157,4294957753,4291659071,4294951115,4292714717,4289781990,4286578816,4284887961,4294901760,4290547599,4282477025,4287317267,4294606962,4294222944,4281240407,4294964718,4288696877,4290822336,4287090411,4285160141,4285563024,4285563024,4294966010,4278255487,4282811060,4291998860,4278222976,4292394968,4294927175,4282441936,4293821166,4294303411,4294967295,4294309365,4294967040,4288335154],A.ak("aj<q,c>"))
B.dC=new A.hd(2,"composedDiacritics")
B.d6=new A.z(0,0)
B.dc=new A.ab(0,0,0,0)
B.dd=new A.ab(0,0,0,1)
B.d4={thin:0,hairline:1,extralight:2,ultralight:3,light:4,regular:5,normal:6,book:7,medium:8,semibold:9,demibold:10,demi:11,bold:12,extrabold:13,ultrabold:14,black:15,heavy:16,italic:17,oblique:18,condensed:19,semicondensed:20,expanded:21,extra:22,semi:23,ultra:24}
B.de=new A.b0(B.d4,25,t.U)
B.d2={literal:0,get:1,has:2,"!":3,"==":4,"!=":5,"<":6,"<=":7,">":8,">=":9,all:10,any:11,none:12,case:13,match:14,coalesce:15,step:16,interpolate:17,"interpolate-hcl":18,"interpolate-lab":19,zoom:20,"geometry-type":21,"to-string":22,"to-number":23,"to-boolean":24,"to-color":25,string:26,number:27,boolean:28,array:29,object:30,concat:31,upcase:32,downcase:33,"+":34,"-":35,"*":36,"/":37,"%":38,"^":39,min:40,max:41,round:42,floor:43,ceil:44,abs:45,sqrt:46,ln:47,log10:48,log2:49,length:50,in:51,"!in":52,"!has":53,at:54,format:55,"number-format":56,rgb:57,rgba:58,var:59,let:60,id:61,properties:62,"feature-state":63,image:64,typeof:65,collator:66,"resolved-locale":67,"is-supported-script":68,slice:69,"index-of":70,e:71,pi:72,ln2:73,"line-progress":74,"heatmap-density":75,sin:76,cos:77,tan:78,asin:79,acos:80,atan:81,within:82,distance:83,accumulated:84,"to-rgba":85,hsl:86,hsla:87,split:88,join:89,semiliteral:90,$images:91}
B.df=new A.b0(B.d2,92,t.U)
B.dg=new A.bW([1634885986,1937338979,1852534560,1952997729,1835101796,1633971309,1751474802,1935764850,1835363940,1835101801,1885891696,1919903847,1936680804,1936680815,1869965170,1667789427,1634889065,1635152756,1668313716,1802002802,1819894889,1835364975,1835364963,1851880034,1851941236,1885432941,1885891689,1885892216,1886549097,1935766114,1869769576,1751217266,1752526439,2036693609,1701607789],t.e)
B.dh=new A.bW([1813,1814,1834,1792],t.e)
B.d_={"raster-hue-rotate":0,"raster-saturation":1,"raster-contrast":2,"raster-brightness-min":3,"raster-brightness-max":4}
B.af=new A.b0(B.d_,5,t.U)
B.ag=new A.bW([1634885986,1937338979,1852534560,1836019303,1885888871,1835101796,1835101801,1885891696,1919903847,1936680804,1936680815,1869965170,1667789427],t.e)
B.T=new A.b0(B.p,0,A.ak("b0<c>"))
B.d1={"user-agent":0,"accept-encoding":1}
B.di=new A.b0(B.d1,2,t.U)
B.cC=s([],t.I)
B.dj=new A.hy(B.cC)
B.ah=new A.c9(0,"left")
B.ai=new A.c9(1,"right")
B.dk=new A.c9(2,"center")
B.dl=new A.c9(4,"start")
B.dm=new A.c9(5,"end")
B.v=new A.eM(0,"ltr")
B.k=new A.eM(1,"rtl")
B.dn=A.aW("yg")
B.dp=A.aW("pY")
B.dq=A.aW("bS")
B.dr=A.aW("bT")
B.ds=A.aW("oJ")
B.dt=A.aW("eg")
B.du=A.aW("ul")
B.dv=A.aW("O")
B.dw=A.aW("m")
B.dx=A.aW("l5")
B.dy=A.aW("p_")
B.dz=A.aW("vr")
B.dA=A.aW("ca")
B.dB=new A.l6(!1)})();(function staticFields(){$.lx=null
$.aO=A.b([],t.G)
$.qy=null
$.pV=null
$.pU=null
$.rC=null
$.rx=null
$.rI=null
$.o1=null
$.ob=null
$.po=null
$.lE=A.b([],A.ak("l<j<m>?>"))
$.dP=null
$.fj=null
$.fk=null
$.pb=!1
$.J=B.f
$.dO=0
$.dM=A.C(t.N,t.S)
$.v0=A.C(t.N,A.ak("ab?"))
$.fl=A.b([],A.ak("l<S<q,m?(A)>>"))
$.p8=A.C(t.N,t.u)})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal,r=hunkHelpers.lazy
s($,"yi","rN",()=>A.o2("_$dart_dartClosure"))
s($,"yh","pB",()=>A.o2("_$dart_dartClosure_dartJSInterop"))
s($,"yX","tc",()=>B.f.ea(new A.oi(),A.ak("a8<~>")))
s($,"yM","t8",()=>A.b([new J.h_()],A.ak("l<eD>")))
s($,"yq","rR",()=>A.bF(A.l4({
toString:function(){return"$receiver$"}})))
s($,"yr","rS",()=>A.bF(A.l4({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"ys","rT",()=>A.bF(A.l4(null)))
s($,"yt","rU",()=>A.bF(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(q){return q.message}}()))
s($,"yw","rX",()=>A.bF(A.l4(void 0)))
s($,"yx","rY",()=>A.bF(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(q){return q.message}}()))
s($,"yv","rW",()=>A.bF(A.qQ(null)))
s($,"yu","rV",()=>A.bF(function(){try{null.$method$}catch(q){return q.message}}()))
s($,"yz","t_",()=>A.bF(A.qQ(void 0)))
s($,"yy","rZ",()=>A.bF(function(){try{(void 0).$method$}catch(q){return q.message}}()))
s($,"yA","pD",()=>A.vt())
s($,"yl","pC",()=>$.tc())
s($,"yk","rP",()=>{var q=new A.L(B.f,t.k)
q.fX(!1)
return q})
s($,"yE","t3",()=>A.uJ(4096))
s($,"yC","t1",()=>new A.lO().$0())
s($,"yD","t2",()=>new A.lN().$0())
s($,"yB","t0",()=>A.hm("^[\\-\\.0-9A-Z_a-z~]*$"))
s($,"yH","is",()=>A.oj(B.dw))
r($,"yL","fo",()=>new A.nH().$0())
r($,"yJ","t7",()=>new A.mi().$0())
s($,"yj","rO",()=>A.uH(0))
s($,"yN","t9",()=>A.b([A.F(7,7,0),A.F(7,0,2),A.F(7,0,1),A.F(7,0,2),A.F(7,0,1),A.F(7,0,6),A.F(7,7,0),A.F(7,0,2),A.F(7,0,1),A.F(7,0,2),A.F(7,2,5),A.F(7,0,6),A.F(7,7,0),A.F(7,0,2),A.F(6,1,1),A.F(6,1,3),A.F(6,1,4),A.F(6,1,6),A.F(7,7,0),A.F(7,0,2),A.F(4,1,1),A.F(4,1,3),A.F(4,1,4),A.F(4,1,6),A.F(7,7,0),A.F(7,0,2),A.F(5,0,1),A.F(5,0,2),A.F(5,2,5),A.F(5,0,6),A.F(7,7,0),A.F(7,0,2),A.F(0,0,1),A.F(0,0,2),A.F(0,2,5),A.F(0,0,6),A.F(7,7,0),A.F(7,0,2),A.F(7,0,1),A.F(7,0,2),A.F(7,3,5),A.F(7,0,6)],t.t))
s($,"yK","fn",()=>new A.mw().$0())
s($,"yG","t5",()=>B.a.aA(B.P,"Common"))
s($,"yI","t6",()=>B.a.aA(B.P,"Inherited"))
s($,"yO","pE",()=>new A.nM().$0())
s($,"yW","oD",()=>A.cD(B.co))
s($,"yV","oC",()=>A.cD(B.cR))
s($,"yQ","pG",()=>A.cD(B.cJ))
s($,"yP","pF",()=>A.cD(B.cM))
s($,"yT","dW",()=>A.cD(B.cI))
s($,"yY","td",()=>A.cD(B.cl))
s($,"yS","tb",()=>A.cD(B.ch))
s($,"yR","ta",()=>A.cD(B.cg))
s($,"yF","t4",()=>{var q,p,o,n,m,l=t.S
l=A.C(l,l)
for(q=B.cS.gag().gt(0);q.m();){p=q.gp()
o=p.a
for(p=A.v2(p.b).gt(0),n=o.length;p.m();){m=p.d
if(0>=n)return A.a(o,0)
l.n(0,m,o.charCodeAt(0))}}return l})
s($,"ym","rQ",()=>A.rA(0.6544984694978736))})();(function nativeSupport(){!function(){var s=function(a){var m={}
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
hunkHelpers.setOrUpdateInterceptorsByTag({SharedArrayBuffer:A.c0,ArrayBuffer:A.du,ArrayBufferView:A.eu,DataView:A.et,Float32Array:A.cA,Float64Array:A.cB,Int16Array:A.hb,Int32Array:A.cC,Int8Array:A.hc,Uint16Array:A.cE,Uint32Array:A.ev,Uint8ClampedArray:A.ew,CanvasPixelArray:A.ew,Uint8Array:A.c2})
hunkHelpers.setOrUpdateLeafTags({SharedArrayBuffer:true,ArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.ap.$nativeSuperclassTag="ArrayBufferView"
A.f1.$nativeSuperclassTag="ArrayBufferView"
A.f2.$nativeSuperclassTag="ArrayBufferView"
A.c1.$nativeSuperclassTag="ArrayBufferView"
A.f3.$nativeSuperclassTag="ArrayBufferView"
A.f4.$nativeSuperclassTag="ArrayBufferView"
A.aI.$nativeSuperclassTag="ArrayBufferView"})()
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
convertAllToFastObject(w)
convertToFastObject($);(function(a){if(typeof document==="undefined"){a(null)
return}if(typeof document.currentScript!="undefined"){a(document.currentScript)
return}var s=document.scripts
function onLoad(b){for(var q=0;q<s.length;++q){s[q].removeEventListener("load",onLoad,false)}a(b.target)}for(var r=0;r<s.length;++r){s[r].addEventListener("load",onLoad,false)}})(function(a){v.currentScript=a
var s=A.xN
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()