// vmap web worker, built from lib f7b11ce8
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
if(a[b]!==s){A.wK(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.c(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.ol(b)
return new s(c,this)}:function(){if(s===null)s=A.ol(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.ol(a).prototype
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
oq(a,b,c,d){return{i:a,p:b,e:c,x:d}},
nd(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.oo==null){A.wg()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.e(A.pE("Return interceptor for "+A.w(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.kY
if(o==null)o=$.kY=A.nc(n)
p=q[o]}if(p!=null)return p
p=A.wo(a)
if(p!=null)return p
if(typeof a=="function")return B.az
s=Object.getPrototypeOf(a)
if(s==null)return B.Z
if(s===Object.prototype)return B.Z
if(typeof q=="function"){o=$.kY
if(o==null)o=$.kY=A.nc(n)
Object.defineProperty(q,o,{value:B.I,enumerable:false,writable:true,configurable:true})
return B.I}return B.I},
nQ(a,b){if(a<0||a>4294967295)throw A.e(A.a3(a,0,4294967295,"length",null))
return J.p8(new Array(a),b)},
aJ(a,b){if(a>4294967295)throw A.e(A.a3(a,0,4294967295,"length",null))
return J.p8(new Array(a),b)},
td(a,b){if(a<0)throw A.e(A.aI("Length must be a non-negative integer: "+a,null))
return A.c(new Array(a),b.i("m<0>"))},
p7(a,b){if(a<0)throw A.e(A.aI("Length must be a non-negative integer: "+a,null))
return A.c(new Array(a),b.i("m<0>"))},
p8(a,b){var s=A.c(a,b.i("m<0>"))
s.$flags=1
return s},
te(a,b){var s=t.bP
return J.r1(s.a(a),s.a(b))},
p9(a){if(a<256)switch(a){case 9:case 10:case 11:case 12:case 13:case 32:case 133:case 160:return!0
default:return!1}switch(a){case 5760:case 8192:case 8193:case 8194:case 8195:case 8196:case 8197:case 8198:case 8199:case 8200:case 8201:case 8202:case 8232:case 8233:case 8239:case 8287:case 12288:case 65279:return!0
default:return!1}},
tf(a,b){var s,r
for(s=a.length;b<s;){r=a.charCodeAt(b)
if(r!==32&&r!==13&&!J.p9(r))break;++b}return b},
tg(a,b){var s,r,q
for(s=a.length;b>0;b=r){r=b-1
if(!(r<s))return A.a(a,r)
q=a.charCodeAt(r)
if(q!==32&&q!==13&&!J.p9(q))break}return b},
ak(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.dX.prototype
return J.fI.prototype}if(typeof a=="string")return J.bK.prototype
if(a==null)return J.dY.prototype
if(typeof a=="boolean")return J.dW.prototype
if(Array.isArray(a))return J.m.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bi.prototype
if(typeof a=="symbol")return J.d0.prototype
if(typeof a=="bigint")return J.d_.prototype
return a}if(a instanceof A.n)return a
return J.nd(a)},
t(a){if(typeof a=="string")return J.bK.prototype
if(a==null)return a
if(Array.isArray(a))return J.m.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bi.prototype
if(typeof a=="symbol")return J.d0.prototype
if(typeof a=="bigint")return J.d_.prototype
return a}if(a instanceof A.n)return a
return J.nd(a)},
a4(a){if(a==null)return a
if(Array.isArray(a))return J.m.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bi.prototype
if(typeof a=="symbol")return J.d0.prototype
if(typeof a=="bigint")return J.d_.prototype
return a}if(a instanceof A.n)return a
return J.nd(a)},
w8(a){if(typeof a=="number")return J.cZ.prototype
if(typeof a=="string")return J.bK.prototype
if(a==null)return a
if(!(a instanceof A.n))return J.cq.prototype
return a},
w9(a){if(typeof a=="string")return J.bK.prototype
if(a==null)return a
if(!(a instanceof A.n))return J.cq.prototype
return a},
dx(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.bi.prototype
if(typeof a=="symbol")return J.d0.prototype
if(typeof a=="bigint")return J.d_.prototype
return a}if(a instanceof A.n)return a
return J.nd(a)},
p(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.ak(a).D(a,b)},
b0(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.wk(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.t(a).h(a,b)},
qY(a,b,c){return J.a4(a).m(a,b,c)},
qZ(a,b){return J.w9(a).bY(a,b)},
oG(a,b,c){return J.dx(a).dk(a,b,c)},
oH(a,b,c){return J.dx(a).dl(a,b,c)},
r_(a,b,c){return J.dx(a).dm(a,b,c)},
r0(a,b,c){return J.dx(a).dn(a,b,c)},
oI(a,b,c){return J.dx(a).dq(a,b,c)},
f5(a,b){return J.a4(a).bn(a,b)},
r1(a,b){return J.w8(a).ac(a,b)},
oJ(a,b){return J.t(a).u(a,b)},
f6(a,b){return J.a4(a).L(a,b)},
r2(a,b){return J.a4(a).aG(a,b)},
nI(a,b){return J.a4(a).W(a,b)},
oK(a){return J.dx(a).gai(a)},
i4(a){return J.a4(a).gv(a)},
b1(a){return J.ak(a).gO(a)},
dA(a){return J.t(a).gA(a)},
nJ(a){return J.t(a).gI(a)},
M(a){return J.a4(a).gt(a)},
Z(a){return J.t(a).gk(a)},
r3(a){return J.dx(a).gdE(a)},
oL(a){return J.ak(a).gS(a)},
r4(a,b,c){return J.a4(a).b4(a,b,c)},
r5(a,b,c){return J.t(a).aH(a,b,c)},
i5(a,b,c){return J.a4(a).aI(a,b,c)},
r6(a,b,c,d,e){return J.a4(a).a1(a,b,c,d,e)},
cG(a,b){return J.a4(a).T(a,b)},
r7(a,b,c){return J.a4(a).G(a,b,c)},
r8(a,b){return J.a4(a).dU(a,b)},
r9(a){return J.a4(a).dV(a)},
oM(a){return J.a4(a).dW(a)},
ba(a){return J.ak(a).p(a)},
oN(a,b){return J.a4(a).cp(a,b)},
fF:function fF(){},
dW:function dW(){},
dY:function dY(){},
e_:function e_(){},
bL:function bL(){},
h_:function h_(){},
cq:function cq(){},
bi:function bi(){},
d_:function d_(){},
d0:function d0(){},
m:function m(a){this.$ti=a},
fH:function fH(){},
j6:function j6(a){this.$ti=a},
aO:function aO(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cZ:function cZ(){},
dX:function dX(){},
fI:function fI(){},
bK:function bK(){}},A={nR:function nR(){},
dH(a,b,c){if(t.U.b(a))return new A.eD(a,b.i("@<0>").E(c).i("eD<1,2>"))
return new A.c1(a,b.i("@<0>").E(c).i("c1<1,2>"))},
th(a){return new A.d1("Field '"+a+"' has been assigned during initialization.")},
tj(a){return new A.d1("Field '"+a+"' has not been initialized.")},
ti(a){return new A.d1("Field '"+a+"' has already been initialized.")},
bp(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
k7(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
f2(a,b,c){return a},
op(a){var s,r
for(s=$.aH.length,r=0;r<s;++r)if(a===$.aH[r])return!0
return!1},
cn(a,b,c,d){A.ap(b,"start")
if(c!=null){A.ap(c,"end")
if(b>c)A.k(A.a3(b,0,c,"start",null))}return new A.et(a,b,c,d.i("et<0>"))},
pi(a,b,c,d){if(t.U.b(a))return new A.c5(a,b,c.i("@<0>").E(d).i("c5<1,2>"))
return new A.cf(a,b,c.i("@<0>").E(d).i("cf<1,2>"))},
pv(a,b,c){var s="count"
if(t.U.b(a)){A.dC(b,s,t.S)
A.ap(b,s)
return new A.cU(a,b,c.i("cU<0>"))}A.dC(b,s,t.S)
A.ap(b,s)
return new A.bn(a,b,c.i("bn<0>"))},
p4(a,b,c){return new A.cT(a,b,c.i("cT<0>"))},
aB(){return new A.bR("No element")},
p6(){return new A.bR("Too few elements")},
bV:function bV(){},
dI:function dI(a,b){this.a=a
this.$ti=b},
c1:function c1(a,b){this.a=a
this.$ti=b},
eD:function eD(a,b){this.a=a
this.$ti=b},
eB:function eB(){},
bd:function bd(a,b){this.a=a
this.$ti=b},
c2:function c2(a,b){this.a=a
this.$ti=b},
ib:function ib(a,b){this.a=a
this.b=b},
ia:function ia(a){this.a=a},
d1:function d1(a){this.a=a},
cN:function cN(a){this.a=a},
nq:function nq(){},
jK:function jK(){},
u:function u(){},
Y:function Y(){},
et:function et(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.$ti=d},
V:function V(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cf:function cf(a,b,c){this.a=a
this.b=b
this.$ti=c},
c5:function c5(a,b,c){this.a=a
this.b=b
this.$ti=c},
e5:function e5(a,b,c){var _=this
_.a=null
_.b=a
_.c=b
_.$ti=c},
ao:function ao(a,b,c){this.a=a
this.b=b
this.$ti=c},
cr:function cr(a,b,c){this.a=a
this.b=b
this.$ti=c},
ex:function ex(a,b,c){this.a=a
this.b=b
this.$ti=c},
bn:function bn(a,b,c){this.a=a
this.b=b
this.$ti=c},
cU:function cU(a,b,c){this.a=a
this.b=b
this.$ti=c},
ep:function ep(a,b,c){this.a=a
this.b=b
this.$ti=c},
dN:function dN(a){this.$ti=a},
dO:function dO(a){this.$ti=a},
bs:function bs(a,b){this.a=a
this.$ti=b},
cs:function cs(a,b){this.a=a
this.$ti=b},
ca:function ca(a,b,c){this.a=a
this.b=b
this.$ti=c},
cT:function cT(a,b,c){this.a=a
this.b=b
this.$ti=c},
bh:function bh(a,b,c){var _=this
_.a=a
_.b=b
_.c=-1
_.$ti=c},
al:function al(){},
bT:function bT(){},
da:function da(){},
b4:function b4(a,b){this.a=a
this.$ti=b},
eZ:function eZ(){},
rs(){throw A.e(A.aK("Cannot modify unmodifiable Map"))},
qx(a){var s=A.qw(a)
if(s!=null)return s
return"minified:"+a},
wk(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.dX.b(a)},
w(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.ba(a)
return s},
d5(a){var s,r=$.pn
if(r==null)r=$.pn=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
tH(a,b){var s,r,q,p,o,n=null,m=/^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i.exec(a)
if(m==null)return n
if(3>=m.length)return A.a(m,3)
s=m[3]
if(b<2||b>36)throw A.e(A.a3(b,2,36,"radix",n))
if(b===10&&s!=null)return parseInt(a,10)
if(b<10||s==null){r=b<=10?47+b:86+b
q=m[1]
for(p=q.length,o=0;o<p;++o)if((q.charCodeAt(o)|32)>r)return n}return parseInt(a,b)},
T(a){var s,r
if(!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(a))return null
s=parseFloat(a)
if(isNaN(s)){r=B.d.bv(a)
if(r==="NaN"||r==="+NaN"||r==="-NaN")return s
return null}return s},
h2(a){var s,r,q,p
if(a instanceof A.n)return A.aG(A.ae(a),null)
s=J.ak(a)
if(s===B.ay||s===B.aA||t.cx.b(a)){r=B.K(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.aG(A.ae(a),null)},
po(a){var s,r,q
if(a==null||typeof a=="number"||A.R(a))return J.ba(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.bC)return a.p(0)
if(a instanceof A.b6)return a.de(!0)
s=$.qS()
for(r=0;r<1;++r){q=s[r].hU(a)
if(q!=null)return q}return"Instance of '"+A.h2(a)+"'"},
pm(a){var s,r,q,p,o=a.length
if(o<=500)return String.fromCharCode.apply(null,a)
for(s="",r=0;r<o;r=q){q=r+500
p=q<o?q:o
s+=String.fromCharCode.apply(null,a.slice(r,p))}return s},
tI(a){var s,r,q,p=A.c([],t.t)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.i)(a),++r){q=a[r]
if(!A.dq(q))throw A.e(A.cE(q))
if(q<=65535)B.a.l(p,q)
else if(q<=1114111){B.a.l(p,55296+(B.b.J(q-65536,10)&1023))
B.a.l(p,56320+(q&1023))}else throw A.e(A.cE(q))}return A.pm(p)},
pp(a){var s,r,q
for(s=a.length,r=0;r<s;++r){q=a[r]
if(!A.dq(q))throw A.e(A.cE(q))
if(q<0)throw A.e(A.cE(q))
if(q>65535)return A.tI(a)}return A.pm(a)},
tJ(a,b,c){var s,r,q,p
if(c<=500&&b===0&&c===a.length)return String.fromCharCode.apply(null,a)
for(s=b,r="";s<c;s=q){q=s+500
p=q<c?q:c
r+=String.fromCharCode.apply(null,a.subarray(s,p))}return r},
X(a){var s
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.b.J(s,10)|55296)>>>0,s&1023|56320)}throw A.e(A.a3(a,0,1114111,null,null))},
tG(a){var s=a.$thrownJsError
if(s==null)return null
return A.bY(s)},
pq(a,b){var s
if(a.$thrownJsError==null){s=new Error()
A.a5(a,s)
a.$thrownJsError=s
s.stack=b.p(0)}},
ai(a){throw A.e(A.cE(a))},
a(a,b){if(a==null)J.Z(a)
throw A.e(A.na(a,b))},
na(a,b){var s,r="index"
if(!A.dq(b))return new A.aN(!0,b,r,null)
s=A.Q(J.Z(a))
if(b<0||b>=s)return A.j4(b,s,a,r)
return A.pr(b,r)},
w2(a,b,c){if(a<0||a>c)return A.a3(a,0,c,"start",null)
if(b!=null)if(b<a||b>c)return A.a3(b,a,c,"end",null)
return new A.aN(!0,b,"end",null)},
cE(a){return new A.aN(!0,a,null,null)},
vW(a){return a},
e(a){return A.a5(a,new Error())},
a5(a,b){var s
if(a==null)a=new A.bq()
b.dartException=a
s=A.wN
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
wN(){return J.ba(this.dartException)},
k(a,b){throw A.a5(a,b==null?new Error():b)},
y(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.k(A.v_(a,b,c),s)},
v_(a,b,c){var s,r,q,p,o,n,m,l,k
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
return new A.ew("'"+s+"': Cannot "+o+" "+l+k+n)},
i(a){throw A.e(A.a6(a))},
br(a){var s,r,q,p,o,n
a=A.qu(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.c([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.kt(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
ku(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
pD(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
nS(a,b){var s=b==null,r=s?null:b.method
return new A.fJ(a,r,s?null:b.receiver)},
b9(a){var s
if(a==null)return new A.jm(a)
if(a instanceof A.dP){s=a.a
return A.bZ(a,s==null?A.b_(s):s)}if(typeof a!=="object")return a
if("dartException" in a)return A.bZ(a,a.dartException)
return A.vN(a)},
bZ(a,b){if(t.C.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
vN(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.b.J(r,16)&8191)===10)switch(q){case 438:return A.bZ(a,A.nS(A.w(s)+" (Error "+q+")",null))
case 445:case 5007:A.w(s)
return A.bZ(a,new A.ef())}}if(a instanceof TypeError){p=$.qB()
o=$.qC()
n=$.qD()
m=$.qE()
l=$.qH()
k=$.qI()
j=$.qG()
$.qF()
i=$.qK()
h=$.qJ()
g=p.af(s)
if(g!=null)return A.bZ(a,A.nS(A.S(s),g))
else{g=o.af(s)
if(g!=null){g.method="call"
return A.bZ(a,A.nS(A.S(s),g))}else if(n.af(s)!=null||m.af(s)!=null||l.af(s)!=null||k.af(s)!=null||j.af(s)!=null||m.af(s)!=null||i.af(s)!=null||h.af(s)!=null){A.S(s)
return A.bZ(a,new A.ef())}}return A.bZ(a,new A.hq(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.eq()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.bZ(a,new A.aN(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.eq()
return a},
bY(a){var s
if(a instanceof A.dP)return a.b
if(a==null)return new A.eN(a)
s=a.$cachedTrace
if(s!=null)return s
s=new A.eN(a)
if(typeof a==="object")a.$cachedTrace=s
return s},
nr(a){if(a==null)return J.b1(a)
if(typeof a=="object")return A.d5(a)
return J.b1(a)},
vY(a){if(typeof a=="number")return B.c.gO(a)
if(a instanceof A.i_)return A.d5(a)
if(a instanceof A.b6)return a.gO(a)
return A.nr(a)},
qm(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.m(0,a[s],a[r])}return b},
vc(a,b,c,d,e,f){t.Z.a(a)
switch(A.Q(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.e(new A.kH("Unsupported number of arguments for wrapped closure"))},
dw(a,b){var s=a.$identity
if(!!s)return s
s=A.vZ(a,b)
a.$identity=s
return s},
vZ(a,b){var s
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
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.vc)},
rq(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.ha().constructor.prototype):Object.create(new A.cI(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.oT(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.rm(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.oT(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
rm(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.e("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.rg)}throw A.e("Error in functionType of tearoff")},
rn(a,b,c,d){var s=A.oR
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
oT(a,b,c,d){if(c)return A.rp(a,b,d)
return A.rn(b.length,d,a,b)},
ro(a,b,c,d){var s=A.oR,r=A.rh
switch(b?-1:a){case 0:throw A.e(new A.h4("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
rp(a,b,c){var s,r
if($.oP==null)$.oP=A.oO("interceptor")
if($.oQ==null)$.oQ=A.oO("receiver")
s=b.length
r=A.ro(s,c,a,b)
return r},
ol(a){return A.rq(a)},
rg(a,b){return A.eW(v.typeUniverse,A.ae(a.a),b)},
oR(a){return a.a},
rh(a){return a.b},
oO(a){var s,r,q,p=new A.cI("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.e(A.aI("Field name "+a+" not found.",null))},
nc(a){return v.getIsolateTag(a)},
xp(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
wo(a){var s,r,q,p,o,n=A.S($.qn.$1(a)),m=$.nb[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.nl[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.bx($.qi.$2(a,n))
if(q!=null){m=$.nb[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.nl[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.no(s)
$.nb[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.nl[n]=s
return s}if(p==="-"){o=A.no(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.qs(a,s)
if(p==="*")throw A.e(A.pE(n))
if(v.leafTags[n]===true){o=A.no(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.qs(a,s)},
qs(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.oq(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
no(a){return J.oq(a,!1,null,!!a.$iaC)},
wq(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.no(s)
else return J.oq(s,c,null,null)},
wg(){if(!0===$.oo)return
$.oo=!0
A.wh()},
wh(){var s,r,q,p,o,n,m,l
$.nb=Object.create(null)
$.nl=Object.create(null)
A.wf()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.qt.$1(o)
if(n!=null){m=A.wq(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
wf(){var s,r,q,p,o,n,m=B.a5()
m=A.dv(B.a6,A.dv(B.a7,A.dv(B.L,A.dv(B.L,A.dv(B.a8,A.dv(B.a9,A.dv(B.aa(B.K),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.qn=new A.ni(p)
$.qi=new A.nj(o)
$.qt=new A.nk(n)},
dv(a,b){return a(b)||b},
w1(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
pa(a,b,c,d,e,f){var s=b?"m":"",r=c?"":"i",q=d?"u":"",p=e?"s":"",o=function(g,h){try{return new RegExp(g,h)}catch(n){return n}}(a,s+r+q+p+f)
if(o instanceof RegExp)return o
throw A.e(A.iJ("Illegal RegExp pattern ("+String(o)+")",a,null))},
wF(a,b,c){var s=a.indexOf(b,c)
return s>=0},
w3(a){if(a.indexOf("$",0)>=0)return a.replace(/\$/g,"$$$$")
return a},
qu(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
ov(a,b,c){var s=A.wG(a,b,c)
return s},
wG(a,b,c){var s,r,q
if(b===""){if(a==="")return c
s=a.length
for(r=c,q=0;q<s;++q)r=r+a[q]+c
return r.charCodeAt(0)==0?r:r}if(a.indexOf(b,0)<0)return a
if(a.length<500||c.indexOf("$",0)>=0)return a.split(b).join(c)
return a.replace(new RegExp(A.qu(b),"g"),A.w3(c))},
nx(a,b,c,d){var s=a.indexOf(b,d)
if(s<0)return a
return A.wH(a,s,s+b.length,c)},
wH(a,b,c,d){return a.substring(0,b)+d+a.substring(c)},
G:function G(a,b){this.a=a
this.b=b},
dk:function dk(a,b,c){this.a=a
this.b=b
this.c=c},
cP:function cP(){},
aR:function aR(a,b,c){this.a=a
this.b=b
this.$ti=c},
cx:function cx(a,b){this.a=a
this.$ti=b},
bv:function bv(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
bG:function bG(a,b){this.a=a
this.$ti=b},
cQ:function cQ(){},
aS:function aS(a,b,c){this.a=a
this.b=b
this.$ti=c},
bH:function bH(a,b){this.a=a
this.$ti=b},
ek:function ek(){},
kt:function kt(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
ef:function ef(){},
fJ:function fJ(a,b,c){this.a=a
this.b=b
this.c=c},
hq:function hq(a){this.a=a},
jm:function jm(a){this.a=a},
dP:function dP(a,b){this.a=a
this.b=b},
eN:function eN(a){this.a=a
this.b=null},
bC:function bC(){},
fe:function fe(){},
ff:function ff(){},
hh:function hh(){},
ha:function ha(){},
cI:function cI(a,b){this.a=a
this.b=b},
h4:function h4(a){this.a=a},
aT:function aT(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
j7:function j7(a){this.a=a},
je:function je(a,b){var _=this
_.a=a
_.b=b
_.d=_.c=null},
ag:function ag(a,b){this.a=a
this.$ti=b},
e3:function e3(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
aU:function aU(a,b){this.a=a
this.$ti=b},
ce:function ce(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
e2:function e2(a,b){this.a=a
this.$ti=b},
cd:function cd(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
cb:function cb(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
ni:function ni(a){this.a=a},
nj:function nj(a){this.a=a},
nk:function nk(a){this.a=a},
b6:function b6(){},
di:function di(){},
dj:function dj(){},
dZ:function dZ(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
hS:function hS(a){this.b=a},
hs:function hs(a,b,c){this.a=a
this.b=b
this.c=c},
ey:function ey(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
er:function er(a,b){this.a=a
this.c=b},
hW:function hW(a,b,c){this.a=a
this.b=b
this.c=c},
hX:function hX(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
bz(a,b,c){},
ad(a){return a},
tt(a,b,c){var s
A.bz(a,b,c)
s=new DataView(a,b,c)
return s},
tu(a,b,c){A.bz(a,b,c)
return new Float32Array(a,b,c)},
tv(a,b,c){A.bz(a,b,c)
return new Float64Array(a,b,c)},
ci(a){return new Int32Array(A.ad(a))},
tw(a){return new Uint16Array(a)},
tx(a,b,c){A.bz(a,b,c)
return new Uint16Array(a,b,c)},
ty(a){return new Uint8Array(a)},
nW(a,b,c){A.bz(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
by(a,b,c){if(a>>>0!==a||a>=c)throw A.e(A.na(b,a))},
b7(a,b,c){var s
if(!(a>>>0!==a))if(b==null)s=a>c
else s=b>>>0!==b||a>b||b>c
else s=!0
if(s)throw A.e(A.w2(a,b,c))
if(b==null)return c
return b},
bM:function bM(){},
d4:function d4(){},
eb:function eb(){},
lc:function lc(a){this.a=a},
e9:function e9(){},
ah:function ah(){},
bN:function bN(){},
aD:function aD(){},
cg:function cg(){},
ch:function ch(){},
fU:function fU(){},
ea:function ea(){},
fV:function fV(){},
cj:function cj(){},
ec:function ec(){},
ed:function ed(){},
bO:function bO(){},
eI:function eI(){},
eJ:function eJ(){},
eK:function eK(){},
eL:function eL(){},
nZ(a,b){var s=b.c
return s==null?b.c=A.eU(a,"a1",[b.x]):s},
pu(a){var s=a.w
if(s===6||s===7)return A.pu(a.x)
return s===11||s===12},
tP(a){return a.as},
aw(a){return A.lb(v.typeUniverse,a,!1)},
cD(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.cD(a1,s,a3,a4)
if(r===s)return a2
return A.pU(a1,r,!0)
case 7:s=a2.x
r=A.cD(a1,s,a3,a4)
if(r===s)return a2
return A.pT(a1,r,!0)
case 8:q=a2.y
p=A.du(a1,q,a3,a4)
if(p===q)return a2
return A.eU(a1,a2.x,p)
case 9:o=a2.x
n=A.cD(a1,o,a3,a4)
m=a2.y
l=A.du(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.o4(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.du(a1,j,a3,a4)
if(i===j)return a2
return A.pV(a1,k,i)
case 11:h=a2.x
g=A.cD(a1,h,a3,a4)
f=a2.y
e=A.vJ(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.pS(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.du(a1,d,a3,a4)
o=a2.x
n=A.cD(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.o5(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.e(A.f9("Attempted to substitute unexpected RTI kind "+a0))}},
du(a,b,c,d){var s,r,q,p,o=b.length,n=A.lh(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.cD(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
vK(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.lh(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.cD(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
vJ(a,b,c,d){var s,r=b.a,q=A.du(a,r,c,d),p=b.b,o=A.du(a,p,c,d),n=b.c,m=A.vK(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.hJ()
s.a=q
s.b=o
s.c=m
return s},
c(a,b){a[v.arrayRti]=b
return a},
om(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.wc(s)
return a.$S()}return null},
wi(a,b){var s
if(A.pu(b))if(a instanceof A.bC){s=A.om(a)
if(s!=null)return s}return A.ae(a)},
ae(a){if(a instanceof A.n)return A.o(a)
if(Array.isArray(a))return A.L(a)
return A.o9(J.ak(a))},
L(a){var s=a[v.arrayRti],r=t.b
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
o(a){var s=a.$ti
return s!=null?s:A.o9(a)},
o9(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.v8(a,s)},
v8(a,b){var s=a instanceof A.bC?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.uC(v.typeUniverse,s.name)
b.$ccache=r
return r},
wc(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.lb(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
wa(a){return A.b8(A.o(a))},
oi(a){var s
if(a instanceof A.b6)return a.cS()
s=a instanceof A.bC?A.om(a):null
if(s!=null)return s
if(t.aJ.b(a))return J.oL(a).a
if(Array.isArray(a))return A.L(a)
return A.ae(a)},
b8(a){var s=a.r
return s==null?a.r=new A.i_(a):s},
w4(a,b){var s,r,q=b,p=q.length
if(p===0)return t.aK
if(0>=p)return A.a(q,0)
s=A.eW(v.typeUniverse,A.oi(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.a(q,r)
s=A.pX(v.typeUniverse,s,A.oi(q[r]))}return A.eW(v.typeUniverse,s,a)},
aM(a){return A.b8(A.lb(v.typeUniverse,a,!1))},
v7(a){var s=this
s.b=A.vH(s)
return s.b(a)},
vH(a){var s,r,q,p,o
if(a===t.K)return A.vi
if(A.cF(a))return A.vm
s=a.w
if(s===6)return A.v4
if(s===1)return A.q7
if(s===7)return A.vd
r=A.vG(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.cF)){a.f="$i"+q
if(q==="l")return A.vg
if(a===t.m)return A.vf
return A.vl}}else if(s===10){p=A.w1(a.x,a.y)
o=p==null?A.q7:p
return o==null?A.b_(o):o}return A.v2},
vG(a){if(a.w===8){if(a===t.S)return A.dq
if(a===t.i||a===t.cZ)return A.vh
if(a===t.N)return A.vk
if(a===t.y)return A.R}return null},
v6(a){var s=this,r=A.v1
if(A.cF(s))r=A.uO
else if(s===t.K)r=A.b_
else if(A.dy(s)){r=A.v3
if(s===t.aV)r=A.uM
else if(s===t.bl)r=A.bx
else if(s===t.oa)r=A.uK
else if(s===t.jh)r=A.q0
else if(s===t.jX)r=A.uL
else if(s===t.mU)r=A.uN}else if(s===t.S)r=A.Q
else if(s===t.N)r=A.S
else if(s===t.y)r=A.o6
else if(s===t.cZ)r=A.aa
else if(s===t.i)r=A.dn
else if(s===t.m)r=A.aZ
s.a=r
return s.a(a)},
v2(a){var s=this
if(a==null)return A.dy(s)
return A.wl(v.typeUniverse,A.wi(a,s),s)},
v4(a){if(a==null)return!0
return this.x.b(a)},
vl(a){var s,r=this
if(a==null)return A.dy(r)
s=r.f
if(a instanceof A.n)return!!a[s]
return!!J.ak(a)[s]},
vg(a){var s,r=this
if(a==null)return A.dy(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.n)return!!a[s]
return!!J.ak(a)[s]},
vf(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.n)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
q6(a){if(typeof a=="object"){if(a instanceof A.n)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
v1(a){var s=this
if(a==null){if(A.dy(s))return a}else if(s.b(a))return a
throw A.a5(A.q3(a,s),new Error())},
v3(a){var s=this
if(a==null||s.b(a))return a
throw A.a5(A.q3(a,s),new Error())},
q3(a,b){return new A.eS("TypeError: "+A.pH(a,A.aG(b,null)))},
pH(a,b){return A.fu(a)+": type '"+A.aG(A.oi(a),null)+"' is not a subtype of type '"+b+"'"},
aL(a,b){return new A.eS("TypeError: "+A.pH(a,b))},
vd(a){var s=this
return s.x.b(a)||A.nZ(v.typeUniverse,s).b(a)},
vi(a){return a!=null},
b_(a){if(a!=null)return a
throw A.a5(A.aL(a,"Object"),new Error())},
vm(a){return!0},
uO(a){return a},
q7(a){return!1},
R(a){return!0===a||!1===a},
o6(a){if(!0===a)return!0
if(!1===a)return!1
throw A.a5(A.aL(a,"bool"),new Error())},
uK(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.a5(A.aL(a,"bool?"),new Error())},
dn(a){if(typeof a=="number")return a
throw A.a5(A.aL(a,"double"),new Error())},
uL(a){if(typeof a=="number")return a
if(a==null)return a
throw A.a5(A.aL(a,"double?"),new Error())},
dq(a){return typeof a=="number"&&Math.floor(a)===a},
Q(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.a5(A.aL(a,"int"),new Error())},
uM(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.a5(A.aL(a,"int?"),new Error())},
vh(a){return typeof a=="number"},
aa(a){if(typeof a=="number")return a
throw A.a5(A.aL(a,"num"),new Error())},
q0(a){if(typeof a=="number")return a
if(a==null)return a
throw A.a5(A.aL(a,"num?"),new Error())},
vk(a){return typeof a=="string"},
S(a){if(typeof a=="string")return a
throw A.a5(A.aL(a,"String"),new Error())},
bx(a){if(typeof a=="string")return a
if(a==null)return a
throw A.a5(A.aL(a,"String?"),new Error())},
aZ(a){if(A.q6(a))return a
throw A.a5(A.aL(a,"JSObject"),new Error())},
uN(a){if(a==null)return a
if(A.q6(a))return a
throw A.a5(A.aL(a,"JSObject?"),new Error())},
qf(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.aG(a[q],b)
return s},
vB(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.qf(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.aG(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
q4(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
if(a5!=null){s=a5.length
if(a4==null)a4=A.c([],t.s)
else a2=a4.length
r=a4.length
for(q=s;q>0;--q)B.a.l(a4,"T"+(r+q))
for(p=t.O,o="<",n="",q=0;q<s;++q,n=a1){m=a4.length
l=m-1-q
if(!(l>=0))return A.a(a4,l)
o=o+n+a4[l]
k=a5[q]
j=k.w
if(!(j===2||j===3||j===4||j===5||k===p))o+=" extends "+A.aG(k,a4)}o+=">"}else o=""
p=a3.x
i=a3.y
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.aG(p,a4)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.aG(h[q],a4)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.aG(f[q],a4)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.aG(d[q+2],a4)+" "+d[q]}a+="}"}if(a2!=null){a4.toString
a4.length=a2}return o+"("+a+") => "+b},
aG(a,b){var s,r,q,p,o,n,m,l=a.w
if(l===5)return"erased"
if(l===2)return"dynamic"
if(l===3)return"void"
if(l===1)return"Never"
if(l===4)return"any"
if(l===6){s=a.x
r=A.aG(s,b)
q=s.w
return(q===11||q===12?"("+r+")":r)+"?"}if(l===7)return"FutureOr<"+A.aG(a.x,b)+">"
if(l===8){p=A.vM(a.x)
o=a.y
return o.length>0?p+("<"+A.qf(o,b)+">"):p}if(l===10)return A.vB(a,b)
if(l===11)return A.q4(a,b,null)
if(l===12)return A.q4(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.a(b,n)
return b[n]}return"?"},
vM(a){var s=A.qw(a)
if(s!=null)return s
return"minified:"+a},
uD(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
uC(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.lb(a,b,!1)
else if(typeof m=="number"){s=m
r=A.eV(a,5,"#")
q=A.lh(s)
for(p=0;p<s;++p)q[p]=r
o=A.eU(a,b,q)
n[b]=o
return o}else return m},
uB(a,b){return A.pZ(a.tR,b)},
uA(a,b){return A.pZ(a.eT,b)},
lb(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.pW(a,null,b,!1)
r.set(b,s)
return s},
eW(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.pW(a,b,c,!0)
q.set(c,r)
return r},
pX(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.o4(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
pW(a,b,c,d){return A.us(A.um(a,b,c,d))},
bX(a,b){b.a=A.v6
b.b=A.v7
return b},
eV(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.aV(null,null)
s.w=b
s.as=c
r=A.bX(a,s)
a.eC.set(c,r)
return r},
pU(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.uy(a,b,r,c)
a.eC.set(r,s)
return s},
uy(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.cF(b))if(!(b===t.P||b===t.T))if(s!==6)r=s===7&&A.dy(b.x)
if(r)return b
else if(s===1)return t.P}q=new A.aV(null,null)
q.w=6
q.x=b
q.as=c
return A.bX(a,q)},
pT(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.uw(a,b,r,c)
a.eC.set(r,s)
return s},
uw(a,b,c,d){var s,r
if(d){s=b.w
if(A.cF(b)||b===t.K)return b
else if(s===1)return A.eU(a,"a1",[b])
else if(b===t.P||b===t.T)return t.gK}r=new A.aV(null,null)
r.w=7
r.x=b
r.as=c
return A.bX(a,r)},
uz(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.aV(null,null)
s.w=13
s.x=b
s.as=q
r=A.bX(a,s)
a.eC.set(q,r)
return r},
eT(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
uv(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
eU(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.eT(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.aV(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.bX(a,r)
a.eC.set(p,q)
return q},
o4(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.eT(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.aV(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.bX(a,o)
a.eC.set(q,n)
return n},
pV(a,b,c){var s,r,q="+"+(b+"("+A.eT(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.aV(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.bX(a,s)
a.eC.set(q,r)
return r},
pS(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.eT(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.eT(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.uv(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.aV(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.bX(a,p)
a.eC.set(r,o)
return o},
o5(a,b,c,d){var s,r=b.as+("<"+A.eT(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.ux(a,b,c,r,d)
a.eC.set(r,s)
return s},
ux(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.lh(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.cD(a,b,r,0)
m=A.du(a,c,r,0)
return A.o5(a,n,m,c!==m)}}l=new A.aV(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.bX(a,l)},
um(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
us(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.uo(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.pN(a,r,l,k,!1)
else if(q===46)r=A.pN(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.cB(a.u,a.e,k.pop()))
break
case 94:k.push(A.uz(a.u,k.pop()))
break
case 35:k.push(A.eV(a.u,5,"#"))
break
case 64:k.push(A.eV(a.u,2,"@"))
break
case 126:k.push(A.eV(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.uq(a,k)
break
case 38:A.up(a,k)
break
case 63:p=a.u
k.push(A.pU(p,A.cB(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.pT(p,A.cB(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.un(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.pO(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.ut(a.u,a.e,o)
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
return A.cB(a.u,a.e,m)},
uo(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
pN(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.uD(s,o.x)[p]
if(n==null)A.k('No "'+p+'" in "'+A.tP(o)+'"')
d.push(A.eW(s,o,n))}else d.push(p)
return m},
uq(a,b){var s,r=a.u,q=A.pM(a,b),p=b.pop()
if(typeof p=="string")b.push(A.eU(r,p,q))
else{s=A.cB(r,a.e,p)
switch(s.w){case 11:b.push(A.o5(r,s,q,a.n))
break
default:b.push(A.o4(r,s,q))
break}}},
un(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.pM(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.cB(p,a.e,o)
q=new A.hJ()
q.a=s
q.b=n
q.c=m
b.push(A.pS(p,r,q))
return
case-4:b.push(A.pV(p,b.pop(),s))
return
default:throw A.e(A.f9("Unexpected state under `()`: "+A.w(o)))}},
up(a,b){var s=b.pop()
if(0===s){b.push(A.eV(a.u,1,"0&"))
return}if(1===s){b.push(A.eV(a.u,4,"1&"))
return}throw A.e(A.f9("Unexpected extended operation "+A.w(s)))},
pM(a,b){var s=b.splice(a.p)
A.pO(a.u,a.e,s)
a.p=b.pop()
return s},
cB(a,b,c){if(typeof c=="string")return A.eU(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.ur(a,b,c)}else return c},
pO(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.cB(a,b,c[s])},
ut(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.cB(a,b,c[s])},
ur(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.e(A.f9("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.e(A.f9("Bad index "+c+" for "+b.p(0)))},
wl(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.a8(a,b,null,c,null)
r.set(c,s)}return s},
a8(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.cF(d))return!0
s=b.w
if(s===4)return!0
if(A.cF(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.a8(a,c[b.x],c,d,e))return!0
q=d.w
p=t.P
if(b===p||b===t.T){if(q===7)return A.a8(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.a8(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.a8(a,b.x,c,d,e))return!1
return A.a8(a,A.nZ(a,b),c,d,e)}if(s===6)return A.a8(a,p,c,d,e)&&A.a8(a,b.x,c,d,e)
if(q===7){if(A.a8(a,b,c,d.x,e))return!0
return A.a8(a,b,c,A.nZ(a,d),e)}if(q===6)return A.a8(a,b,c,p,e)||A.a8(a,b,c,d.x,e)
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
if(!A.a8(a,j,c,i,e)||!A.a8(a,i,e,j,c))return!1}return A.q5(a,b.x,c,d.x,e)}if(q===11){if(b===t.et)return!0
if(p)return!1
return A.q5(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.ve(a,b,c,d,e)}if(o&&q===10)return A.vj(a,b,c,d,e)
return!1},
q5(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.a8(a3,a4.x,a5,a6.x,a7))return!1
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
if(!A.a8(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.a8(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.a8(a3,k[h],a7,g,a5))return!1}f=s.c
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
if(!A.a8(a3,e[a+2],a7,g,a5))return!1
break}}while(b<d){if(f[b+1])return!1
b+=3}return!0},
ve(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.eW(a,b,r[o])
return A.q_(a,p,null,c,d.y,e)}return A.q_(a,b.y,null,c,d.y,e)},
q_(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.a8(a,b[s],d,e[s],f))return!1
return!0},
vj(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.a8(a,r[s],c,q[s],e))return!1
return!0},
dy(a){var s=a.w,r=!0
if(!(a===t.P||a===t.T))if(!A.cF(a))if(s!==6)r=s===7&&A.dy(a.x)
return r},
cF(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.O},
pZ(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
lh(a){return a>0?new Array(a):v.typeUniverse.sEA},
aV:function aV(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
hJ:function hJ(){this.c=this.b=this.a=null},
i_:function i_(a){this.a=a},
hD:function hD(){},
eS:function eS(a){this.a=a},
u9(){var s,r,q
if(self.scheduleImmediate!=null)return A.vQ()
if(self.MutationObserver!=null&&self.document!=null){s={}
r=self.document.createElement("div")
q=self.document.createElement("span")
s.a=null
new self.MutationObserver(A.dw(new A.kD(s),1)).observe(r,{childList:true})
return new A.kC(s,r,q)}else if(self.setImmediate!=null)return A.vR()
return A.vS()},
ua(a){self.scheduleImmediate(A.dw(new A.kE(t.M.a(a)),0))},
ub(a){self.setImmediate(A.dw(new A.kF(t.M.a(a)),0))},
uc(a){A.o_(B.ah,t.M.a(a))},
o_(a,b){return A.uu(a.a/1000|0,b)},
uu(a,b){var s=new A.l9()
s.e6(a,b)
return s},
au(a){return new A.ht(new A.F($.D,a.i("F<0>")),a.i("ht<0>"))},
at(a,b){a.$2(0,null)
b.b=!0
return b.a},
U(a,b){A.uP(a,b)},
as(a,b){b.c3(a)},
ar(a,b){b.c4(A.b9(a),A.bY(a))},
uP(a,b){var s,r,q=new A.lj(b),p=new A.lk(b)
if(a instanceof A.F)a.dd(q,p,t.z)
else{s=t.z
if(a instanceof A.F)a.b_(q,p,s)
else{r=new A.F($.D,t._)
r.a=8
r.c=a
r.dd(q,p,s)}}},
av(a){var s=function(b,c){return function(d,e){while(true){try{b(d,e)
break}catch(r){e=r
d=c}}}}(a,1)
return $.D.ck(new A.n1(s),t.o,t.S,t.z)},
pR(a,b,c){return 0},
nK(a){var s
if(t.C.b(a)){s=a.gaL()
if(s!=null)return s}return B.v},
rL(a,b){var s
if(!b.b(null))throw A.e(A.i7(null,"computation","The type parameter is not nullable"))
s=new A.F($.D,b.i("F<0>"))
A.pC(a,new A.iK(null,s,b))
return s},
v9(a,b){if($.D===B.e)return null
return null},
va(a,b){if($.D!==B.e)A.v9(a,b)
if(b==null)if(t.C.b(a)){b=a.gaL()
if(b==null){A.pq(a,B.v)
b=B.v}}else b=B.v
else if(t.C.b(a))A.pq(a,b)
return new A.ab(a,b)},
kM(a,b,c){var s,r,q,p,o={},n=o.a=a
for(s=t._;r=n.a,(r&4)!==0;n=a){a=s.a(n.c)
o.a=a}if(n===b){s=A.pw()
b.aQ(new A.ab(new A.aN(!0,n,null,"Cannot complete a future with itself"),s))
return}q=b.a&1
s=n.a=r|q
if((s&24)===0){p=t.F.a(b.c)
b.a=b.a&1|4
b.c=n
n.d4(p)
return}if(!c)if(b.c==null)n=(s&16)===0||q!==0
else n=!1
else n=!0
if(n){p=b.aT()
b.b8(o.a)
A.cw(b,p)
return}b.a^=2
A.dt(null,null,b.b,t.M.a(new A.kN(o,b)))},
cw(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d={},c=d.a=a
for(s=t.u,r=t.F;;){q={}
p=c.a
o=(p&16)===0
n=!o
if(b==null){if(n&&(p&1)===0){m=s.a(c.c)
A.i0(m.a,m.b)}return}q.a=b
l=b.a
for(c=b;l!=null;c=l,l=k){c.a=null
A.cw(d.a,c)
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
A.i0(j.a,j.b)
return}g=$.D
if(g!==h)$.D=h
else g=null
c=c.c
if((c&15)===8)new A.kR(q,d,n).$0()
else if(o){if((c&1)!==0)new A.kQ(q,j).$0()}else if((c&2)!==0)new A.kP(d,q).$0()
if(g!=null)$.D=g
c=q.c
if(c instanceof A.F){p=q.a.$ti
p=p.i("a1<2>").b(c)||!p.y[1].b(c)}else p=!1
if(p){f=q.a.b
if((c.a&24)!==0){e=r.a(f.c)
f.c=null
b=f.bg(e)
f.a=c.a&30|f.a&1
f.c=c.c
d.a=c
continue}else A.kM(c,f,!0)
return}}f=q.a.b
e=r.a(f.c)
f.c=null
b=f.bg(e)
c=q.b
p=q.c
if(!c){f.$ti.c.a(p)
f.a=8
f.c=p}else{s.a(p)
f.a=f.a&1|16
f.c=p}d.a=f
c=f}},
vC(a,b){var s
if(t.ng.b(a))return b.ck(a,t.z,t.K,t.l)
s=t.v
if(s.b(a))return s.a(a)
throw A.e(A.i7(a,"onError",u.c))},
vu(){var s,r
for(s=$.ds;s!=null;s=$.ds){$.f0=null
r=s.b
$.ds=r
if(r==null)$.f_=null
s.a.$0()}},
vI(){$.ob=!0
try{A.vu()}finally{$.f0=null
$.ob=!1
if($.ds!=null)$.oC().$1(A.qj())}},
qg(a){var s=new A.hu(a),r=$.f_
if(r==null){$.ds=$.f_=s
if(!$.ob)$.oC().$1(A.qj())}else $.f_=r.b=s},
vF(a){var s,r,q,p=$.ds
if(p==null){A.qg(a)
$.f0=$.f_
return}s=new A.hu(a)
r=$.f0
if(r==null){s.b=p
$.ds=$.f0=s}else{q=r.b
s.b=q
$.f0=r.b=s
if(q==null)$.f_=s}},
wC(a){var s=null,r=$.D
if(B.e===r){A.dt(s,s,B.e,a)
return}A.dt(s,s,r,t.M.a(r.c1(a)))},
wW(a,b){return new A.cC(A.f2(a,"stream",t.K),b.i("cC<0>"))},
og(a){return},
ud(a,b){if(b==null)b=A.vT()
if(t.b9.b(b))return a.ck(b,t.z,t.K,t.l)
if(t.i6.b(b))return t.v.a(b)
throw A.e(A.aI("handleError callback must take either an Object (the error), or both an Object (the error) and a StackTrace.",null))},
vw(a,b){A.i0(a,b)},
pC(a,b){var s=$.D
if(s===B.e)return A.o_(a,t.M.a(b))
return A.o_(a,t.M.a(s.c1(b)))},
i0(a,b){A.vF(new A.mX(a,b))},
qd(a,b,c,d,e){var s,r=$.D
if(r===c)return d.$0()
$.D=c
s=r
try{r=d.$0()
return r}finally{$.D=s}},
qe(a,b,c,d,e,f,g){var s,r=$.D
if(r===c)return d.$1(e)
$.D=c
s=r
try{r=d.$1(e)
return r}finally{$.D=s}},
vE(a,b,c,d,e,f,g,h,i){var s,r=$.D
if(r===c)return d.$2(e,f)
$.D=c
s=r
try{r=d.$2(e,f)
return r}finally{$.D=s}},
dt(a,b,c,d){t.M.a(d)
if(B.e!==c){d=c.c1(d)
d=d}A.qg(d)},
kD:function kD(a){this.a=a},
kC:function kC(a,b,c){this.a=a
this.b=b
this.c=c},
kE:function kE(a){this.a=a},
kF:function kF(a){this.a=a},
l9:function l9(){this.b=null},
la:function la(a,b){this.a=a
this.b=b},
ht:function ht(a,b){this.a=a
this.b=!1
this.$ti=b},
lj:function lj(a){this.a=a},
lk:function lk(a){this.a=a},
n1:function n1(a){this.a=a},
eR:function eR(a,b){var _=this
_.a=a
_.e=_.d=_.c=_.b=null
_.$ti=b},
dm:function dm(a,b){this.a=a
this.$ti=b},
ab:function ab(a,b){this.a=a
this.b=b},
iK:function iK(a,b,c){this.a=a
this.b=b
this.c=c},
ks:function ks(a,b){this.a=a
this.b=b},
hz:function hz(){},
eA:function eA(a,b){this.a=a
this.$ti=b},
aX:function aX(a,b,c,d,e){var _=this
_.a=null
_.b=a
_.c=b
_.d=c
_.e=d
_.$ti=e},
F:function F(a,b){var _=this
_.a=0
_.b=a
_.c=null
_.$ti=b},
kJ:function kJ(a,b){this.a=a
this.b=b},
kO:function kO(a,b){this.a=a
this.b=b},
kN:function kN(a,b){this.a=a
this.b=b},
kL:function kL(a,b){this.a=a
this.b=b},
kK:function kK(a,b){this.a=a
this.b=b},
kR:function kR(a,b,c){this.a=a
this.b=b
this.c=c},
kS:function kS(a,b){this.a=a
this.b=b},
kT:function kT(a){this.a=a},
kQ:function kQ(a,b){this.a=a
this.b=b},
kP:function kP(a,b){this.a=a
this.b=b},
kU:function kU(a,b){this.a=a
this.b=b},
kV:function kV(a,b,c){this.a=a
this.b=b
this.c=c},
kW:function kW(a,b){this.a=a
this.b=b},
hu:function hu(a){this.a=a
this.b=null},
d8:function d8(){},
jR:function jR(a,b){this.a=a
this.b=b},
jS:function jS(a,b){this.a=a
this.b=b},
eO:function eO(){},
l8:function l8(a){this.a=a},
l7:function l7(a){this.a=a},
hv:function hv(){},
dd:function dd(a,b,c,d,e){var _=this
_.a=null
_.b=0
_.d=a
_.e=b
_.f=c
_.r=d
_.$ti=e},
dh:function dh(a,b){this.a=a
this.$ti=b},
ct:function ct(a,b,c,d,e){var _=this
_.w=a
_.a=b
_.d=c
_.e=d
_.r=_.f=null
_.$ti=e},
de:function de(){},
eQ:function eQ(){},
eC:function eC(){},
cu:function cu(a,b){this.b=a
this.a=null
this.$ti=b},
aY:function aY(a){var _=this
_.a=0
_.c=_.b=null
_.$ti=a},
l3:function l3(a,b){this.a=a
this.b=b},
cC:function cC(a,b){var _=this
_.a=null
_.b=a
_.c=!1
_.$ti=b},
eY:function eY(){},
hV:function hV(){},
l6:function l6(a,b){this.a=a
this.b=b},
mX:function mX(a,b){this.a=a
this.b=b},
pe(a,b){return new A.aT(a.i("@<0>").E(b).i("aT<1,2>"))},
e4(a,b,c){return b.i("@<0>").E(c).i("nT<1,2>").a(A.qm(a,new A.aT(b.i("@<0>").E(c).i("aT<1,2>"))))},
A(a,b){return new A.aT(a.i("@<0>").E(b).i("aT<1,2>"))},
pf(a){return new A.cz(a.i("cz<0>"))},
bj(a){return new A.cz(a.i("cz<0>"))},
o2(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
ul(a,b,c){var s=new A.cA(a,b,c.i("cA<0>"))
s.c=a.e
return s},
tb(a,b){var s=J.M(a)
if(s.n())return s.gq()
return null},
ta(a,b,c){var s
A.ap(b,"index")
s=J.t(a)
if(b>=s.gk(a))return null
return s.L(a,b)},
tl(a,b){var s,r,q=A.pf(b)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.i)(a),++r)q.l(0,b.a(a[r]))
return q},
nV(a){var s,r
if(A.op(a))return"{...}"
s=new A.bo("")
try{r={}
B.a.l($.aH,a)
s.a+="{"
r.a=!0
a.W(0,new A.jg(r,s))
s.a+="}"}finally{if(0>=$.aH.length)return A.a($.aH,-1)
$.aH.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
tm(a,b,c){var s,r,q=A.L(b),p=new J.aO(b,b.length,q.i("aO<1>")),o=A.L(c),n=new J.aO(c,c.length,o.i("aO<1>")),m=p.n(),l=n.n()
q=q.c
o=o.c
for(;;){if(!(m&&l))break
s=p.d
if(s==null)s=q.a(s)
r=n.d
a.m(0,s,r==null?o.a(r):r)
m=p.n()
l=n.n()}if(m||l)throw A.e(A.aI("Iterables do not have same length.",null))},
cz:function cz(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
hR:function hR(a){this.a=a
this.b=null},
cA:function cA(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
x:function x(){},
I:function I(){},
jf:function jf(a){this.a=a},
jg:function jg(a,b){this.a=a
this.b=b},
eF:function eF(a,b){this.a=a
this.$ti=b},
eG:function eG(a,b,c){var _=this
_.a=a
_.b=b
_.c=null
_.$ti=c},
bm:function bm(){},
eM:function eM(){},
vy(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.b9(r)
q=A.iJ(String(s),null,null)
throw A.e(q)}q=A.ls(p)
return q},
ls(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.hO(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.ls(a[s])
return a},
uG(a,b,c){var s,r,q,p,o,n=c-b
if(n<=4096)s=$.qO()
else s=new Uint8Array(n)
for(r=a.length,q=0;q<n;++q){p=b+q
if(!(p<r))return A.a(a,p)
o=a[p]
if((o&255)!==o)o=255
s[q]=o}return s},
uF(a,b,c,d){var s=a?$.qN():$.qM()
if(s==null)return null
if(0===c&&d===b.length)return A.pY(s,b)
return A.pY(s,b.subarray(c,d))},
pY(a,b){var s,r
try{s=a.decode(b)
return s}catch(r){}return null},
pb(a,b,c){return new A.e0(a,b)},
uZ(a){return a.i3()},
uj(a,b){return new A.l_(a,[],A.w_())},
uk(a,b,c){var s,r=new A.bo(""),q=A.uj(r,b)
q.bw(a)
s=r.a
return s.charCodeAt(0)==0?s:s},
uH(a){switch(a){case 65:return"Missing extension byte"
case 67:return"Unexpected extension byte"
case 69:return"Invalid UTF-8 byte"
case 71:return"Overlong encoding"
case 73:return"Out of unicode range"
case 75:return"Encoded surrogate"
case 77:return"Unfinished UTF-8 octet sequence"
default:return""}},
hO:function hO(a,b){this.a=a
this.b=b
this.c=null},
kZ:function kZ(a){this.a=a},
hP:function hP(a){this.a=a},
lf:function lf(){},
le:function le(){},
cO:function cO(){},
fl:function fl(){},
ft:function ft(){},
e0:function e0(a,b){this.a=a
this.b=b},
fL:function fL(a,b){this.a=a
this.b=b},
fK:function fK(){},
j9:function j9(a){this.b=a},
j8:function j8(a){this.a=a},
l0:function l0(){},
l1:function l1(a,b){this.a=a
this.b=b},
l_:function l_(a,b,c){this.c=a
this.a=b
this.b=c},
hr:function hr(){},
ky:function ky(){},
lg:function lg(a){this.b=0
this.c=a},
kx:function kx(a){this.a=a},
ld:function ld(a){this.a=a
this.b=16
this.c=0},
rI(a,b){a=A.a5(a,new Error())
if(a==null)a=A.b_(a)
a.stack=b.p(0)
throw a},
N(a,b,c,d){var s,r=c?J.td(a,d):J.nQ(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
pg(a,b,c){var s,r,q=A.c([],c.i("m<0>"))
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.i)(a),++r)B.a.l(q,c.a(a[r]))
if(b)return q
q.$flags=1
return q},
a7(a,b){var s,r
if(Array.isArray(a))return A.c(a.slice(0),b.i("m<0>"))
s=A.c([],b.i("m<0>"))
for(r=J.M(a);r.n();)B.a.l(s,r.gq())
return s},
fN(a,b,c,d){var s,r=J.nQ(a,d)
for(s=0;s<a;++s)B.a.m(r,s,b.$1(s))
return r},
nU(a,b){var s=A.pg(a,!1,b)
s.$flags=3
return s},
jT(a,b,c){var s,r,q,p,o
A.ap(b,"start")
s=c==null
r=!s
if(r){q=c-b
if(q<0)throw A.e(A.a3(c,b,null,"end",null))
if(q===0)return""}if(Array.isArray(a)){p=a
o=p.length
if(s)c=o
return A.pp(b>0||c<o?p.slice(b,c):p)}if(t.hD.b(a))return A.tZ(a,b,c)
if(r)a=J.r8(a,c)
if(b>0)a=J.cG(a,b)
s=A.a7(a,t.S)
return A.pp(s)},
tZ(a,b,c){var s=a.length
if(b>=s)return""
return A.tJ(a,b,c==null||c>s?s:c)},
jx(a){return new A.dZ(a,A.pa(a,!1,!0,!1,!1,""))},
px(a,b,c){var s=J.M(b)
if(!s.n())return a
if(c.length===0){do a+=A.w(s.gq())
while(s.n())}else{a+=A.w(s.gq())
while(s.n())a=a+c+A.w(s.gq())}return a},
uE(a,b,c,d){var s,r,q,p,o,n="0123456789ABCDEF"
if(c===B.u){s=$.qL()
s=s.b.test(b)}else s=!1
if(s)return b
r=B.ac.c5(b)
for(s=r.length,q=0,p="";q<s;++q){o=r[q]
if(o<128&&("\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u03f6\x00\u0404\u03f4 \u03f4\u03f6\u01f6\u01f6\u03f6\u03fc\u01f4\u03ff\u03ff\u0584\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u05d4\u01f4\x00\u01f4\x00\u0504\u05c4\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u0400\x00\u0400\u0200\u03f7\u0200\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u0200\u0200\u0200\u03f7\x00".charCodeAt(o)&a)!==0)p+=A.X(o)
else p=p+"%"+n[o>>>4&15]+n[o&15]}return p.charCodeAt(0)==0?p:p},
pw(){return A.bY(new Error())},
rH(a,b,c){var s,r
for(s=0;s<3;++s){r=a[s]
if(r.b===b)return r}throw A.e(A.i7(b,"name","No enum value with that name"))},
fu(a){if(typeof a=="number"||A.R(a)||a==null)return J.ba(a)
if(typeof a=="string")return JSON.stringify(a)
return A.po(a)},
rJ(a,b){A.f2(a,"error",t.K)
A.f2(b,"stackTrace",t.l)
A.rI(a,b)},
f9(a){return new A.f8(a)},
aI(a,b){return new A.aN(!1,null,b,a)},
i7(a,b,c){return new A.aN(!0,a,b,c)},
dC(a,b,c){return a},
pr(a,b){return new A.ei(null,null,!0,a,b,"Value not in range")},
a3(a,b,c,d,e){return new A.ei(b,c,!0,a,d,"Invalid value")},
tK(a,b,c,d){if(a<b||a>c)throw A.e(A.a3(a,b,c,d,null))
return a},
aq(a,b,c){if(0>a||a>c)throw A.e(A.a3(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.e(A.a3(b,a,c,"end",null))
return b}return c},
ap(a,b){if(a<0)throw A.e(A.a3(a,0,null,b,null))
return a},
j4(a,b,c,d){return new A.fD(b,!0,a,d,"Index out of range")},
aK(a){return new A.ew(a)},
pE(a){return new A.hp(a)},
d7(a){return new A.bR(a)},
a6(a){return new A.fh(a)},
iJ(a,b,c){return new A.dU(a,b,c)},
tc(a,b,c){var s,r
if(A.op(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.c([],t.s)
B.a.l($.aH,a)
try{A.vn(a,s)}finally{if(0>=$.aH.length)return A.a($.aH,-1)
$.aH.pop()}r=A.px(b,t.e7.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
nP(a,b,c){var s,r
if(A.op(a))return b+"..."+c
s=new A.bo(b)
B.a.l($.aH,a)
try{r=s
r.a=A.px(r.a,a,", ")}finally{if(0>=$.aH.length)return A.a($.aH,-1)
$.aH.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
vn(a,b){var s,r,q,p,o,n,m,l=a.gt(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.n())return
s=A.w(l.gq())
B.a.l(b,s)
k+=s.length+2;++j}if(!l.n()){if(j<=5)return
if(0>=b.length)return A.a(b,-1)
r=b.pop()
if(0>=b.length)return A.a(b,-1)
q=b.pop()}else{p=l.gq();++j
if(!l.n()){if(j<=4){B.a.l(b,A.w(p))
return}r=A.w(p)
if(0>=b.length)return A.a(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gq();++j
for(;l.n();p=o,o=n){n=l.gq();++j
if(j>100){for(;;){if(!(k>75&&j>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2;--j}B.a.l(b,"...")
return}}q=A.w(p)
r=A.w(o)
k+=r.length+q.length+4}}if(j>b.length+2){k+=5
m="..."}else m=null
for(;;){if(!(k>80&&b.length>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2
if(m==null){k+=5
m="..."}}if(m!=null)B.a.l(b,m)
B.a.l(b,q)
B.a.l(b,r)},
ph(a,b,c,d,e){return new A.c2(a,b.i("@<0>").E(c).E(d).E(e).i("c2<1,2,3,4>"))},
nX(a,b,c,d){var s
if(B.A===c){s=B.b.gO(a)
b=J.b1(b)
return A.k7(A.bp(A.bp($.i3(),s),b))}if(B.A===d){s=B.b.gO(a)
b=J.b1(b)
c=J.b1(c)
return A.k7(A.bp(A.bp(A.bp($.i3(),s),b),c))}s=B.b.gO(a)
b=J.b1(b)
c=J.b1(c)
d=J.b1(d)
d=A.k7(A.bp(A.bp(A.bp(A.bp($.i3(),s),b),c),d))
return d},
tA(a){var s,r,q=$.i3()
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.i)(a),++r)q=A.bp(q,J.b1(a[r]))
return A.k7(q)},
uW(a,b){return 65536+((a&1023)<<10)+(b&1023)},
b2:function b2(a){this.a=a},
hC:function hC(){},
P:function P(){},
f8:function f8(a){this.a=a},
bq:function bq(){},
aN:function aN(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ei:function ei(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
fD:function fD(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
ew:function ew(a){this.a=a},
hp:function hp(a){this.a=a},
bR:function bR(a){this.a=a},
fh:function fh(a){this.a=a},
fX:function fX(){},
eq:function eq(){},
kH:function kH(a){this.a=a},
dU:function dU(a,b,c){this.a=a
this.b=b
this.c=c},
f:function f(){},
a2:function a2(a,b,c){this.a=a
this.b=b
this.$ti=c},
a0:function a0(){},
n:function n(){},
hY:function hY(){},
cm:function cm(a){this.a=a},
d6:function d6(a){var _=this
_.a=a
_.c=_.b=0
_.d=-1},
bo:function bo(a){this.a=a},
q2(a,b,c,d){if(a)return""+d+"-"+c+"-begin"
if(b)return""+d+"-"+c+"-end"
return c},
qc(a){var s=$.dp.h(0,a)
if(s==null)return a
return a+"-"+A.w(s)},
uY(a){var s,r
if(!$.dp.K(a))return
s=$.dp.h(0,a)
s.toString
r=s-1
s=$.dp
if(r<=0)s.bt(0,a)
else s.m(0,a,r)},
vD(a,b,c,d,e){var s,r,q,p,o,n
if(c===9||c===11||c===10)return
if($.dr>1e4&&$.dp.a===0){$.f4().clearMarks()
$.f4().clearMeasures()
$.dr=0}s=c===1||c===5
r=c===2||c===7
q=A.q2(s,r,d,a)
if(s){p=$.dp.h(0,q)
if(p==null)p=0
$.dp.m(0,q,p+1)
q=A.qc(q)}o=$.f4()
o.toString
o.mark(q,A.aZ($.qR().parse(e)))
$.dr=$.dr+1
if(r){n=A.q2(!0,!1,d,a)
o=$.f4()
o.toString
o.measure(d,A.qc(n),q)
$.dr=$.dr+1
A.uY(n)}B.b.F($.dr,0,10001)},
pB(a,b){if($.f4()==null)return
A.vD(0,-1,4,a,A.uJ(b))},
uJ(a){var s=a.a
if(s===0)return"{}"
return B.f.h8(a)},
mU:function mU(){},
lG:function lG(){},
jl:function jl(a){this.a=a},
uT(a,b,c){t.Z.a(a)
if(A.Q(c)>=1)return a.$1(b)
return a.$0()},
ou(a,b){var s=new A.F($.D,b.i("F<0>")),r=new A.eA(s,b.i("eA<0>"))
a.then(A.dw(new A.ns(r,b),1),A.dw(new A.nt(r),1))
return s},
ns:function ns(a,b){this.a=a
this.b=b},
nt:function nt(a){this.a=a},
bS:function bS(a,b){this.a=a
this.b=b},
oZ(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g=b.length,f=g!==0
if(f){if(0>=g)return A.a(b,0)
s=b[0]*2}else s=a.length
r=A.oX(a,0,s,2,null,!0)
q=A.c([],t.t)
if(r!=null){g=r.e
g===$&&A.r()
p=r.d
p===$&&A.r()
p=g===p
g=p}else g=!0
if(g)return q
if(f)r=A.rw(a,b,r,2)
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
h=5e-324}A.fq(r,q,2,l,m,h,-2147483648)
return q},
fq(a,b,c,d,e,f,g){var s,r,q,p,o
if(a==null)return
s=g===-2147483648
if(s&&f!==5e-324)A.rz(a,d,e,f)
r=f!==5e-324
q=a
for(;;){p=a.d
p===$&&A.r()
o=a.e
o===$&&A.r()
if(!(p!==o))break
A:{if(r?A.rC(a,d,e,f):A.rB(a)){B.a.l(b,B.b.a5(p.a,c))
B.a.l(b,B.b.a5(a.a,c))
B.a.l(b,B.b.a5(o.a,c))
A.fs(a)
p=o.e
p===$&&A.r()
q=p
a=q
break A}if(o===q){if(s)A.fq(A.c4(o,null),b,c,d,e,f,1)
else if(g===1){s=A.c4(o,null)
s.toString
A.fq(A.rv(s,b,c),b,c,d,e,f,2)}else if(g===2)A.rG(o,b,c,d,e,f)
break}a=o}}},
rG(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k=-2147483648,j=a
do{s=j.e
s===$&&A.r()
s=s.e
s===$&&A.r()
r=j.a
q=j.b
p=j.c
o=s
for(;;){s=j.d
s===$&&A.r()
if(!(o!==s))break
n=o.a
m=!1
if(r!==n)if(j.e.a!==n)if(s.a!==n)if(!A.rA(j,o)){s=!1
if(A.fr(j,o))if(A.fr(o,j))if(A.rD(j,o)){s=j.d
n=o.d
n===$&&A.r()
s=A.a_(s,j,n)!==0||A.a_(j,n,o)!==0}if(!s)if(q===o.b&&p===o.c)if(A.a_(j.d,j,j.e)>0){s=o.d
s===$&&A.r()
n=o.e
n===$&&A.r()
n=A.a_(s,o,n)>0
s=n}else s=m
else s=m
else s=!0}else s=m
else s=m
else s=m
else s=m
if(s){l=A.oY(j,o)
s=A.c4(j,j.e)
s.toString
r=l.e
r===$&&A.r()
r=A.c4(l,r)
r.toString
A.fq(s,b,c,d,e,f,k)
A.fq(r,b,c,d,e,f,k)
return}s=o.e
s===$&&A.r()
o=s}j=j.e}while(j!==a)},
rD(a,b){var s,r,q,p,o=(a.b+b.b)/2,n=(a.c+b.c)/2,m=a,l=!1
do{s=m.c
r=m.e
r===$&&A.r()
q=r.c
if(s>n!==q>n){p=m.b
p=o<(r.b-p)*(n-s)/(q-s)+p
s=p}else s=!1
if(s)l=!l
if(r!==a){m=r
continue}else break}while(!0)
return l},
rA(a,b){var s,r,q,p=a.a,o=b.a,n=a
do{s=n.a
if(s!==p){r=n.e
r===$&&A.r()
q=r.a
s=q!==p&&s!==o&&q!==o&&A.oW(n,r,a,b)}else s=!1
if(s)return!0
s=n.e
s===$&&A.r()
if(s!==a){n=s
continue}else break}while(!0)
return!1},
oW(a,b,c,d){var s,r,q,p,o=a.b,n=c.b
if(!(o===n&&a.c===c.c&&b.b===d.b&&b.c===d.c))o=o===d.b&&a.c===d.c&&n===b.b&&c.c===b.c
else o=!0
if(o)return!0
o=A.a_(a,b,c)
if(o>0)s=1
else s=o<0?-1:0
o=A.a_(a,b,d)
if(o>0)r=1
else r=o<0?-1:0
o=A.a_(c,d,a)
if(o>0)q=1
else q=o<0?-1:0
o=A.a_(c,d,b)
if(o>0)p=1
else p=o<0?-1:0
if(s!==r&&q!==p)return!0
if(s===0&&A.iC(a,c,b))return!0
if(r===0&&A.iC(a,d,b))return!0
if(q===0&&A.iC(c,a,d))return!0
if(p===0&&A.iC(c,b,d))return!0
return!1},
iC(a,b,c){var s=b.b,r=a.b,q=c.b,p=!1
if(s<=Math.max(r,q))if(s>=Math.min(r,q)){s=b.c
r=a.c
q=c.c
s=s<=Math.max(r,q)&&s>=Math.min(r,q)}else s=p
else s=p
return s},
rv(a,b,c){var s,r,q,p=a
do{s=p.d
s===$&&A.r()
r=p.e
r===$&&A.r()
q=r.e
q===$&&A.r()
if(!(s.b===q.b&&s.c===q.c)&&A.oW(s,p,r,q)&&A.fr(s,q)&&A.fr(q,s)){B.a.l(b,B.b.a5(s.a,c))
B.a.l(b,B.b.a5(p.a,c))
B.a.l(b,B.b.a5(q.a,c))
A.fs(p)
A.fs(p.e)
p=q
a=p}s=p.e
s===$&&A.r()
if(s!==a){p=s
continue}else break}while(!0)
return A.c4(s,null)},
rB(a){var s,r,q,p,o,n,m,l,k,j=a.d
j===$&&A.r()
s=a.e
s===$&&A.r()
if(A.a_(j,a,s)>=0)return!1
r=s.e
r===$&&A.r()
for(q=j.b,p=j.c,o=a.b,n=a.c,m=s.b,s=s.c,l=r;l!==j;l=r){if(A.dM(q,p,o,n,m,s,l.b,l.c)){r=l.d
r===$&&A.r()
k=l.e
k===$&&A.r()
k=A.a_(r,l,k)>=0
r=k}else r=!1
if(r)return!1
r=l.e
r===$&&A.r()}return!0},
rC(a,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a.d
b===$&&A.r()
s=a.e
s===$&&A.r()
if(A.a_(b,a,s)>=0)return!1
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
j=A.nM(o,m,a0,a1,a2)
i=A.nM(l,k,a0,a1,a2)
h=a.w
g=a.x
f=a.d
e=a.e
for(;;){if(!(h!=null&&h.f>=j&&g!=null&&g.f<=i))break
d=!1
if(h!==f)if(h!==e)if(A.dM(r,b,q,n,p,s,h.b,h.c)){d=h.d
d===$&&A.r()
c=h.e
c===$&&A.r()
c=A.a_(d,h,c)>=0
d=c}if(d)return!1
h=h.w
d=!1
if(g!==f)if(g!==e)if(A.dM(r,b,q,n,p,s,g.b,g.c)){d=g.d
d===$&&A.r()
c=g.e
c===$&&A.r()
c=A.a_(d,g,c)>=0
d=c}if(d)return!1
g=g.x}for(;;){if(!(h!=null&&h.f>=j))break
d=!1
if(h!==f)if(h!==e)if(A.dM(r,b,q,n,p,s,h.b,h.c)){d=h.d
d===$&&A.r()
c=h.e
c===$&&A.r()
c=A.a_(d,h,c)>=0
d=c}if(d)return!1
h=h.w}for(;;){if(!(g!=null&&g.f<=i))break
d=!1
if(g!==f)if(g!==e)if(A.dM(r,b,q,n,p,s,g.b,g.c)){d=g.d
d===$&&A.r()
c=g.e
c===$&&A.r()
c=A.a_(d,g,c)>=0
d=c}if(d)return!1
g=g.x}return!0},
nM(a,b,c,d,e){var s=B.c.M(32767*(a-c)*e),r=B.c.M(32767*(b-d)*e)
s=(s|s<<8)&16711935
s=(s|s<<4)&252645135
s=(s|s<<2)&858993459
r=(r|r<<8)&16711935
r=(r|r<<4)&252645135
r=(r|r<<2)&858993459
return((s|s<<1)&1431655765|((r|r<<1)&1431655765)<<1)>>>0},
rz(a,b,c,d){var s,r=a
do{if(r.f===5e-324)r.f=A.nM(r.b,r.c,b,c,d)
s=r.d
s===$&&A.r()
r.w=s
s=r.e
s===$&&A.r()
r.x=s
if(s!==a){r=s
continue}else break}while(!0)
s.w=s.w.x=null
A.rF(s)},
rF(a){var s,r,q,p,o,n,m,l,k,j,i,h=1
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
rw(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=A.c([],t.eB),e=b.length
for(s=a.length,r=e-1,q=0;q<e;q=l){p=b.length
if(!(q<p))return A.a(b,q)
o=b[q]
if(q<r){n=q+1
if(!(n<p))return A.a(b,n)
m=b[n]*d}else m=s
l=q+1
k=A.oX(a,o*d,m,d,l,!1)
p=k==null
if(p)o=null
else{o=k.e
o===$&&A.r()}if(k==o)if(!p)k.r=!0
k.toString
B.a.l(f,A.ry(k))}B.a.aA(f,new A.iB())
for(r=f.length,j=0;j<f.length;f.length===r||(0,A.i)(f),++j,c=p){i=f[j]
h=A.rx(i,c)
if(h!=null){g=A.oY(h,i)
p=h.e
p===$&&A.r()
A.c4(h,p)
p=g.e
p===$&&A.r()
A.c4(g,p)}p=c.e
p===$&&A.r()
p=A.c4(c,p)
p.toString}return c},
c4(a,b){var s,r,q,p,o,n,m,l
if(b==null)b=a
s=a
do{r=s.d
r===$&&A.r()
q=r.y
p=s.y
o=s.e
o===$&&A.r()
n=o.y
m=!1
if(!s.r){l=s.b
if(!(l===o.b&&s.c===o.c))l=r.b===l&&r.c===s.c
else l=!0
if(l)m=!0
else if(q!=null||q!==0||n!=null||n!==0||q==n||q!=p)m=A.a_(r,s,o)===0}if(m){A.fs(s)
s=s.d
r=s.e
r===$&&A.r()
if(s===r){b=s
break}b=s}else s=o}while(m||s!==b)
return b},
a_(a,b,c){var s=b.c,r=b.b
return(s-a.c)*(c.b-r)-(r-a.b)*(c.c-s)},
oY(a,b){var s,r=A.o3(a.a,a.b,a.c),q=A.o3(b.a,b.b,b.c),p=a.e
p===$&&A.r()
s=b.d
s===$&&A.r()
r.y=a.y
q.y=b.y
a.e=b
b.d=a
r.e=p
q.e=p.d=r
s.e=r.d=q
q.d=s
return q},
rx(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=a.b,g=a.c,f=b,e=-17976931348623157e292,d=null
do{s=f.c
if(g<=s){r=f.e
r===$&&A.r()
r=g>=r.c}else r=!1
if(r){r=f.b
q=f.e
q===$&&A.r()
p=q.b
o=q.c
n=r+(g-s)*(p-r)/(o-s)
if(n<=h&&n>e){if(n===h){if(g===s)return f
if(g===o)return q}if(r<p)d=f
else d=q
e=n}}s=f.e
s===$&&A.r()
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
p=A.dM(q,g,m,l,p,g,r,f.c)
q=p}if(q){i=Math.abs(g-f.c)/(h-r)
q=!1
if(A.fr(f,a))if(!(i<j))if(i===j){p=k.b
if(!(r>p))if(r===p){r=k.d
r===$&&A.r()
p=f.d
p===$&&A.r()
if(A.a_(r,k,p)<0){r=f.e
r===$&&A.r()
q=k.e
q===$&&A.r()
q=A.a_(r,k,q)<0
r=q}else r=q}else r=q
else r=!0}else r=q
else r=!0
else r=q
if(r){j=i
k=f}}r=f.e
r===$&&A.r()
if(r!==d){f=r
continue}else break}while(!0)
return k},
fr(a,b){var s,r=a.d
r===$&&A.r()
s=a.e
s===$&&A.r()
if(A.a_(r,a,s)<0)r=A.a_(a,b,s)>=0&&A.a_(a,r,b)>=0
else r=A.a_(a,b,r)<0||A.a_(a,s,b)<0
return r},
dM(a,b,c,d,e,f,g,h){var s,r,q=e-g,p=b-h,o=a-g,n=f-h
if(q*p-o*n>=0){s=d-h
r=c-g
q=o*s-r*p>=0&&r*n-q*s>=0}else q=!1
return q},
ry(a){var s,r,q=a,p=q
do{s=p.b
r=q.b
if(!(s<r))s=s===r&&p.c<q.c
else s=!0
if(s)q=p
s=p.e
s===$&&A.r()
if(s!==a){p=s
continue}else break}while(!0)
return q},
oX(a,b,c,d,e,f){var s,r,q,p,o=null
if(f===A.rE(a,b,c,d)>0)for(s=a.length,r=b;r<c;r+=d){if(!(r>=0&&r<s))return A.a(a,r)
q=a[r]
p=r+1
if(!(p<s))return A.a(a,p)
o=A.oV(r,q,a[p],o)
o.y=e}else for(r=c-d,s=a.length;r>=b;r-=d){if(!(r>=0&&r<s))return A.a(a,r)
q=a[r]
p=r+1
if(!(p<s))return A.a(a,p)
o=A.oV(r,q,a[p],o)
o.y=e}if(o!=null){s=o.e
s===$&&A.r()
s=o.b===s.b&&o.c===s.c}else s=!1
if(s){A.fs(o)
s=o.e
s===$&&A.r()
s.y=e
o=s}return o},
fs(a){var s,r=a.e
r===$&&A.r()
s=a.d
s===$&&A.r()
r.d=s
a.d.e=r
r=a.w
if(r!=null)r.x=a.x
s=a.x
if(s!=null)s.w=r},
oV(a,b,c,d){var s,r=A.o3(a,b,c)
if(d==null){r.d=r
r.e=r}else{s=d.e
s===$&&A.r()
r.e=s
r.d=d
d.e=d.e.d=r}return r},
rE(a,b,c,d){var s,r,q,p,o,n,m,l,k=c-d
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
o3(a,b,c){return new A.bw(a,b,c)},
iB:function iB(){},
bw:function bw(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.e=_.d=$
_.f=5e-324
_.r=!1
_.y=_.x=_.w=null},
bP:function bP(a,b){var _=this
_.a=a
_.b=b
_.ax=_.Q=_.f=_.e=_.d=_.c=null
_.ay=!1
_.cx=_.CW=_.ch=null},
tR(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e="read of 4 byte(s) at ",d=J.oG(B.j.gai(a),a.byteOffset,a.byteLength),c=new A.j(d,0)
if(d.byteLength<12)throw A.e(B.at)
c.j(0,4)
s=d.getUint32(0,!1)
if(s===1953784678){c.j(8,4)
r=d.getUint32(8,!1)
if(b>=r)throw A.e(A.h("font index "+b+" out of range in a "+r+"-font collection"))
q=12+b*4
c.j(q,4)
p=d.getUint32(q,!1)
c.j(p,4)
s=d.getUint32(p,!1)}else p=0
if(s!==65536&&s!==1953658213&&s!==1330926671)throw A.e(A.h("unrecognised sfntVersion 0x"+B.d.dK(B.b.b0(s,16),8,"0")))
q=p+4
c.j(q,2)
o=d.getUint16(q,!1)
n=A.A(t.S,t.l1)
for(q=p+12,m=0;m<o;++m){l=q+m*16
k=l+4<=d.byteLength
if(!k)A.k(A.h(e+l+" overruns a "+c.gk(0)+"-byte font"))
j=d.getUint32(l,!1)
k=l+8
i=k+4<=d.byteLength
if(!i)A.k(A.h(e+k+" overruns a "+c.gk(0)+"-byte font"))
h=d.getUint32(k,!1)
k=l+12
i=k+4<=d.byteLength
if(!i)A.k(A.h(e+k+" overruns a "+c.gk(0)+"-byte font"))
g=d.getUint32(k,!1)
k=d.byteLength
if(h>=k)throw A.e(A.h("table "+A.ay(A.co(j))+" starts at "+h+", past the "+c.gk(0)+"-byte file"))
f=h+g>k?k-h:g
i=l+4
k=i+4<=k
if(!k)A.k(A.h(e+i+" overruns a "+c.gk(0)+"-byte font"))
d.getUint32(i,!1)
n.m(0,j,new A.hg(j,h,f))}return new A.jL(c,n)},
hg:function hg(a,b,c){this.a=a
this.c=b
this.d=c},
jL:function jL(a,b){this.a=a
this.c=b},
dL(a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b="read of 2 byte(s) at ",a=a0.b
if(!a0.V(a,4))throw A.e(B.ap)
s=a+2
a0.j(s,2)
r=a0.a
q=r.getUint16(s,!1)
s=a+4
if(!a0.V(s,q*8))throw A.e(A.h("cmap claims "+q+" encoding records it does not contain"))
p=A.c([],t.ig)
for(o=0;o<q;++o){n=s+o*8
m=n+4
if(m>=0)l=m+4<=r.byteLength
else l=!1
if(!l)A.k(A.h("read of 4 byte(s) at "+m+" overruns a "+a0.gk(0)+"-byte font"))
k=a+r.getUint32(m,!1)
m=k>=0
if(m)l=k+2<=r.byteLength
else l=!1
if(!l)continue
if(n>=0)l=n+2<=r.byteLength
else l=!1
if(!l)A.k(A.h(b+n+" overruns a "+a0.gk(0)+"-byte font"))
l=r.getUint16(n,!1)
j=n+2
if(j>=0)i=j+2<=r.byteLength
else i=!1
if(!i)A.k(A.h(b+j+" overruns a "+a0.gk(0)+"-byte font"))
j=r.getUint16(j,!1)
if(m)m=k+2<=r.byteLength
else m=!1
if(!m)A.k(A.h(b+k+" overruns a "+a0.gk(0)+"-byte font"))
B.a.l(p,new A.be(l,j,k,r.getUint16(k,!1)))}if(p.length===0)throw A.e(B.av)
s=t.aq
h=A.a7(p,s)
B.a.aA(h,new A.iv())
r=h.length
e=0
for(;;){if(!(e<h.length)){g=null
f=null
break}A:{d=h[e]
c=A.rr(a0,d.c)
if(c==null)break A
f=d
g=c
break}h.length===r||(0,A.i)(h);++e}if(g==null||f==null)throw A.e(B.ar)
for(r=p.length,e=0;e<r;++e){d=p[e]
if(d.d===14){A.uf(a0,d.c)
break}}A.nU(p,s)
return new A.iu(g,f)},
rr(a,b){if(!a.V(b,2))return null
a.j(b,2)
switch(a.a.getUint16(b,!1)){case 0:return A.ue(a,b)
case 4:return A.ug(a,b)
case 6:return A.uh(a,b)
case 12:return A.pI(a,b,!1)
case 13:return A.pI(a,b,!0)
default:return null}},
ue(a,b){var s,r
if(!a.V(b,262))return null
s=b+6
a.j(s,256)
r=a.a
return new A.hF(J.oI(B.cz.gai(r),r.byteOffset+s,256))},
ug(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(!a.V(b,14))return null
s=b+2
a.j(s,2)
r=a.a
q=r.getUint16(s,!1)
s=b+6
a.j(s,2)
p=r.getUint16(s,!1)
if(p===0||(p&1)===1)return null
o=p>>>1
n=b+14
m=n+p+2
l=m+p
k=l+p
if(!a.V(k,p))return null
j=new A.j(r,n).X(o)
i=new A.j(r,m).X(o)
h=new A.j(r,l).X(o)
g=new A.j(r,k).X(o)
f=b+q
if(f<k+p)f=r.byteLength
s=r.byteLength
return new A.hH(j,i,h,g,k,a,f>s?s:f)},
uh(a,b){var s,r,q,p
if(!a.V(b,10))return null
s=b+6
a.j(s,2)
r=a.a
q=r.getUint16(s,!1)
s=b+8
a.j(s,2)
p=r.getUint16(s,!1)
s=b+10
if(!a.V(s,p*2))return null
return new A.hI(q,new A.j(r,s).X(p))},
pI(a,b,c){var s,r,q,p,o,n,m,l,k,j,i="read of 4 byte(s) at "
if(!a.V(b,16))return null
s=b+12
a.j(s,4)
r=a.a
q=r.getUint32(s,!1)
if(q>B.b.U(r.byteLength-b-16,12))return null
p=new Uint32Array(q)
o=new Uint32Array(q)
n=new Uint32Array(q)
for(s=b+16,m=0;m<q;++m){l=s+m*12
if(l>=0)k=l+4<=r.byteLength
else k=!1
if(!k)A.k(A.h(i+l+" overruns a "+a.gk(0)+"-byte font"))
k=r.getUint32(l,!1)
if(!(m<q))return A.a(p,m)
p[m]=k
k=l+4
if(k>=0)j=k+4<=r.byteLength
else j=!1
if(!j)A.k(A.h(i+k+" overruns a "+a.gk(0)+"-byte font"))
k=r.getUint32(k,!1)
if(!(m<q))return A.a(o,m)
o[m]=k
k=l+8
if(k>=0)j=k+4<=r.byteLength
else j=!1
if(!j)A.k(A.h(i+k+" overruns a "+a.gk(0)+"-byte font"))
k=r.getUint32(k,!1)
if(!(m<q))return A.a(n,m)
n[m]=k}return new A.hG(p,o,n,c)},
uf(a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5="read of 4 byte(s) at "
if(!a6.V(a7,10))return null
s=a7+6
a6.j(s,4)
r=a6.a
q=r.getUint32(s,!1)
s=a7+10
if(!a6.V(s,q*11))return null
p=new Uint32Array(q)
o=A.c([],t.D)
n=A.c([],t.nb)
for(m=t.S,l=t.t,k=0;k<q;++k){j=s+k*11
p[k]=a6.co(j)
i=j+3
if(i>=0)h=i+4<=r.byteLength
else h=!1
if(!h)A.k(A.h(a5+i+" overruns a "+a6.gk(0)+"-byte font"))
g=r.getUint32(i,!1)
i=j+7
if(i>=0)h=i+4<=r.byteLength
else h=!1
if(!h)A.k(A.h(a5+i+" overruns a "+a6.gk(0)+"-byte font"))
f=r.getUint32(i,!1)
e=A.c([],l)
if(g!==0){d=a7+g
i=d>=0
if(i)h=d+4<=r.byteLength
else h=!1
if(h){if(i)i=d+4<=r.byteLength
else i=!1
if(!i)A.k(A.h(a5+d+" overruns a "+a6.gk(0)+"-byte font"))
c=r.getUint32(d,!1)
i=d+4
if(i>=0)h=i+c*4<=r.byteLength
else h=!1
if(h)for(b=0;b<c;++b){a=i+b*4
a0=a6.co(a)
B.a.l(e,a0)
h=a+3
if(h>=0)a1=h+1<=r.byteLength
else a1=!1
if(!a1)A.k(A.h("read of 1 byte(s) at "+h+" overruns a "+a6.gk(0)+"-byte font"))
B.a.l(e,a0+r.getUint8(h))}}}B.a.l(o,e)
a2=A.A(m,m)
if(f!==0){a3=a7+f
i=a3>=0
if(i)h=a3+4<=r.byteLength
else h=!1
if(h){if(i)i=a3+4<=r.byteLength
else i=!1
if(!i)A.k(A.h(a5+a3+" overruns a "+a6.gk(0)+"-byte font"))
a4=r.getUint32(a3,!1)
i=a3+4
if(i>=0)h=i+a4*5<=r.byteLength
else h=!1
if(h)for(b=0;b<a4;++b){a=i+b*5
h=a6.co(a)
a+=3
if(a>=0)a1=a+2<=r.byteLength
else a1=!1
if(!a1)A.k(A.h("read of 2 byte(s) at "+a+" overruns a "+a6.gk(0)+"-byte font"))
a2.m(0,h,r.getUint16(a,!1))}}}B.a.l(n,a2)}return new A.kI()},
iu:function iu(a,b){this.a=a
this.d=b},
iv:function iv(){},
be:function be(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
hF:function hF(a){this.a=a},
hH:function hH(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
hI:function hI(a,b){this.a=a
this.b=b},
hG:function hG(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
kI:function kI(){},
t3(a){var s,r,q,p,o,n,m,l,k,j=a.b
if(!a.V(j,54))throw A.e(B.O)
s=j+12
a.j(s,4)
r=a.a
q=r.getUint32(s,!1)
if(q!==1594834165)throw A.e(A.h("head.magicNumber is 0x"+B.b.b0(q,16)+", not 0x5F0F3CF5"))
s=j+18
a.j(s,2)
p=r.getUint16(s,!1)
if(p<16||p>16384)throw A.e(A.h("head.unitsPerEm "+p+" is outside the legal 16\u202616384"))
s=j+50
a.j(s,2)
o=r.getInt16(s,!1)
if(o!==0&&o!==1)throw A.e(A.h("head.indexToLocFormat "+o+" is neither short nor long"))
a.j(j,2)
r.getUint16(j,!1)
s=j+2
a.j(s,2)
r.getUint16(s,!1)
s=j+4
a.j(s,4)
r.getUint32(s,!1)
s=j+8
a.j(s,4)
r.getUint32(s,!1)
s=j+16
a.j(s,2)
r.getUint16(s,!1)
A.j_(a,j+20)
A.j_(a,j+28)
s=j+36
a.j(s,2)
s=r.getInt16(s,!1)
n=j+38
a.j(n,2)
n=r.getInt16(n,!1)
m=j+40
a.j(m,2)
m=r.getInt16(m,!1)
l=j+42
a.j(l,2)
l=r.getInt16(l,!1)
k=j+44
a.j(k,2)
r.getUint16(k,!1)
k=j+46
a.j(k,2)
r.getUint16(k,!1)
k=j+48
a.j(k,2)
r.getInt16(k,!1)
k=j+52
a.j(k,2)
r.getInt16(k,!1)
return new A.fA(p,s,n,m,l,o)},
j_(a,b){var s,r,q
a.j(b,4)
s=a.a
r=s.getUint32(b,!1)
q=b+4
a.j(q,4)
return r*4294967296+s.getUint32(q,!1)},
fA:function fA(a,b,c,d,e,f){var _=this
_.f=a
_.x=b
_.y=c
_.z=d
_.Q=e
_.ay=f},
t5(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d="read of 2 byte(s) at "
if(c<1&&b>0)throw A.e(B.au)
s=c>b?b:c
r=a.b
q=s*4
if(!a.V(r,q))throw A.e(A.h("hmtx holds fewer than the "+s+" metric pairs hhea promises"))
p=new Uint16Array(s)
o=new Int16Array(s)
for(n=a.a,m=0;m<s;++m){l=r+m*4
if(l>=0)k=l+2<=n.byteLength
else k=!1
if(!k)A.k(A.h(d+l+" overruns a "+a.gk(0)+"-byte font"))
k=n.getUint16(l,!1)
if(!(m<s))return A.a(p,m)
p[m]=k
k=l+2
if(k>=0)j=k+2<=n.byteLength
else j=!1
if(!j)A.k(A.h(d+k+" overruns a "+a.gk(0)+"-byte font"))
k=n.getInt16(k,!1)
if(!(m<s))return A.a(o,m)
o[m]=k}i=r+q
h=b-s
g=n.byteLength
f=B.b.F(B.b.U(g-i,2),0,h)
e=new Int16Array(h)
for(m=0;m<f;++m){q=i+m*2
if(q>=0)k=q+2<=n.byteLength
else k=!1
if(!k)A.k(A.h(d+q+" overruns a "+a.gk(0)+"-byte font"))
q=n.getInt16(q,!1)
if(!(m<h))return A.a(e,m)
e[m]=q}return new A.j1(p,e)},
j1:function j1(a,b){this.a=a
this.c=b},
rd(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e="read of 2 byte(s) at ",d=a.b
a.j(d,2)
s=a.a
r=s.getUint16(d,!1)
if(r!==1&&r!==2)throw A.e(A.h("avar version "+r+" is not 1 or 2"))
q=d+6
a.j(q,2)
p=s.getUint16(q,!1)
o=d+8
n=A.c([],t.iQ)
for(q=t.c5,m=0;m<p;++m){if(o>=0)l=o+2<=s.byteLength
else l=!1
if(!l)A.k(A.h(e+o+" overruns a "+a.gk(0)+"-byte font"))
k=s.getUint16(o,!1)
o+=2
l=k*4
if(o>=0)j=o+l<=s.byteLength
else j=!1
if(!j)throw A.e(B.al)
i=J.aJ(k,q)
for(h=0;h<k;++h){j=o+h*4
if(j>=0)g=j+2<=s.byteLength
else g=!1
if(!g)A.k(A.h(e+j+" overruns a "+a.gk(0)+"-byte font"))
g=s.getInt16(j,!1)
j+=2
if(j>=0)f=j+2<=s.byteLength
else f=!1
if(!f)A.k(A.h(e+j+" overruns a "+a.gk(0)+"-byte font"))
i[h]=new A.dE(g/16384,s.getInt16(j,!1)/16384)}o+=l
B.a.l(n,i)}if(r===2&&a.V(o,8)){a.j(o,4)
if(s.getUint32(o,!1)===0){q=o+4
a.j(q,4)
s.getUint32(q,!1)}}return new A.i8(n)},
dE:function dE(a,b){this.a=a
this.b=b},
i8:function i8(a){this.b=a},
rM(a){var s,r,q,p,o,n,m,l,k,j,i,h=a.b
a.j(h,2)
s=a.a
r=s.getUint16(h,!1)
if(r!==1)throw A.e(A.h("fvar version "+r+" is not 1"))
q=h+4
a.j(q,2)
p=s.getUint16(q,!1)
q=h+8
a.j(q,2)
o=s.getUint16(q,!1)
q=h+10
a.j(q,2)
n=s.getUint16(q,!1)
q=h+12
a.j(q,2)
m=s.getUint16(q,!1)
q=h+14
a.j(q,2)
l=s.getUint16(q,!1)
if(n<20)throw A.e(A.h("fvar axisSize "+n+" is below 20"))
s=o*4
if(l<s+4)throw A.e(A.h("fvar instanceSize "+l+" is too small"))
k=h+p
q=o*n
if(!a.V(k,q))throw A.e(B.ao)
j=A.fN(o,new A.iL(k,n,a),!1,t.l0)
i=k+q
if(!a.V(i,m*l))throw A.e(B.aq)
A.fN(m,new A.iM(i,l,l>=s+6,a,o),!1,t.h7)
return new A.cW(j)},
db:function db(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
d3:function d3(a){this.a=a},
cW:function cW(a){this.a=a},
iL:function iL(a,b,c){this.a=a
this.b=b
this.c=c},
iM:function iM(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
p5(a){var s,r,q,p,o,n,m,l,k,j,i=a.b
a.j(i,2)
s=a.a
r=s.getUint16(i,!1)
if(r!==1)throw A.e(A.h("ItemVariationStore format "+r))
q=i+2
a.j(q,4)
p=s.getUint32(q,!1)
q=i+6
a.j(q,2)
o=s.getUint16(q,!1)
n=A.t8(a,i+p)
m=A.c([],t.mc)
for(q=i+8,l=0;l<o;++l){k=q+l*4
if(k>=0)j=k+4<=s.byteLength
else j=!1
if(!j)A.k(A.h("read of 4 byte(s) at "+k+" overruns a "+a.gk(0)+"-byte font"))
B.a.l(m,A.t7(a,i+s.getUint32(k,!1),n))}return new A.fG(a,n,m,null)},
t9(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=a.b
a.j(f,2)
s=a.a
r=s.getUint16(f,!1)
if(r!==1)throw A.e(A.h("HVAR version "+r))
q=f+4
a.j(q,4)
p=A.p5(new A.j(s,f+s.getUint32(q,!1)))
q=f+8
a.j(q,4)
o=s.getUint32(q,!1)
if(o===0)return p
q=f+o
n=new A.j(s,q)
n.j(q,1)
m=s.getUint8(q)
l=m===0
if(!l&&m!==1)A.k(A.h("DeltaSetIndexMap format "+m))
k=q+1
n.j(k,1)
j=s.getUint8(k)
k=q+2
if(l){n.j(k,2)
i=s.getUint16(k,!1)
h=q+4}else{n.j(k,4)
i=s.getUint32(k,!1)
h=q+6}g=(j>>>4&3)+1
if(!n.V(h,i*g))A.k(B.am)
return new A.fG(p.a,p.b,p.c,new A.iA(n,h,i,g,(j&15)+1))},
t8(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d="read of 2 byte(s) at "
a.j(b,2)
s=a.a
r=s.getUint16(b,!1)
q=b+2
a.j(q,2)
p=s.getUint16(q,!1)
o=r*6
q=b+4
if(!a.V(q,p*o))throw A.e(B.as)
n=A.c([],t.fb)
for(m=t.i,l=0;l<p;++l){k=A.N(r,0,!1,m)
j=A.N(r,0,!1,m)
i=A.N(r,0,!1,m)
h=q+l*o
for(g=0;g<r;++g,h+=6){if(h>=0)f=h+2<=s.byteLength
else f=!1
if(!f)A.k(A.h(d+h+" overruns a "+a.gk(0)+"-byte font"))
B.a.m(k,g,s.getInt16(h,!1)/16384)
f=h+2
if(f>=0)e=f+2<=s.byteLength
else e=!1
if(!e)A.k(A.h(d+f+" overruns a "+a.gk(0)+"-byte font"))
B.a.m(j,g,s.getInt16(f,!1)/16384)
f=h+4
if(f>=0)e=f+2<=s.byteLength
else e=!1
if(!e)A.k(A.h(d+f+" overruns a "+a.gk(0)+"-byte font"))
B.a.m(i,g,s.getInt16(f,!1)/16384)}B.a.l(n,new A.hU(k,j,i))}return n},
t7(a,b,c){var s,r,q,p,o,n,m,l,k,j
a.j(b,2)
s=a.a
r=s.getUint16(b,!1)
q=b+2
a.j(q,2)
p=s.getUint16(q,!1)
q=b+4
a.j(q,2)
o=s.getUint16(q,!1)
n=(p&32768)!==0
m=p&32767
if(m>o)throw A.e(A.h("ItemVariationData claims "+m+" wide columns of only "+o))
l=A.fN(o,new A.j5(a,b,c),!1,t.S)
s=o-m
k=n?m*4+s*2:m*2+s
j=b+6+o*2
if(!a.V(j,r*k))throw A.e(B.an)
return new A.hN(r,l,m,n,j,k)},
hU:function hU(a,b,c){this.a=a
this.b=b
this.c=c},
hN:function hN(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
iA:function iA(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
fG:function fG(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
j5:function j5(a,b,c){this.a=a
this.b=b
this.c=c},
c3(a){var s,r,q,p,o=a.b
a.j(o,2)
s=a.a
r=s.getUint16(o,!1)
switch(r){case 1:q=o+2
a.j(q,2)
p=s.getUint16(q,!1)
q=o+4
a.j(q,2)
return new A.hx(p,new A.j(s,o+6).X(s.getUint16(q,!1)))
case 2:q=o+2
a.j(q,2)
return new A.hy(new A.j(s,o+4).X(s.getUint16(q,!1)*3))
default:throw A.e(A.h("unknown ClassDef format "+r))}},
bB:function bB(){},
hw:function hw(){},
hx:function hx(a,b){this.a=a
this.b=b},
hy:function hy(a){this.a=a},
o1(a){var s=a&65535
s-=s>>>1&21845
s=(s&13107)+(B.b.J(s,2)&13107)
return((s+(s>>>4)&3855)*257>>>8&255)*2},
fp(a){var s,r,q,p,o,n,m,l=a.b
a.j(l,2)
s=a.a
r=s.getUint16(l,!1)
q=l+2
a.j(q,2)
p=s.getUint16(q,!1)
q=l+4
a.j(q,2)
o=s.getUint16(q,!1)
if(o===32768)return new A.fo(r,p,o,$.qz())
if(o<1||o>3)throw A.e(A.h("unknown Device deltaFormat "+o))
n=p>=r?p-r+1:0
m=B.b.bh(16,o)
return new A.fo(r,p,o,new A.j(s,l+6).X(B.b.a5(n+m-1,m)))},
i6(a){var s,r,q,p,o,n,m,l=null,k=a.b
a.j(k,2)
s=a.a
r=s.getUint16(k,!1)
q=k+2
a.j(q,2)
p=s.getInt16(q,!1)
q=k+4
a.j(q,2)
o=s.getInt16(q,!1)
switch(r){case 1:return new A.cH(p,o,l,l)
case 2:q=k+6
a.j(q,2)
s.getUint16(q,!1)
return new A.cH(p,o,l,l)
case 3:q=k+6
a.j(q,2)
n=s.getUint16(q,!1)
q=k+8
a.j(q,2)
m=s.getUint16(q,!1)
q=n===0?l:A.fp(new A.j(s,k+n))
return new A.cH(p,o,q,m===0?l:A.fp(new A.j(s,k+m)))
default:throw A.e(A.h("unknown Anchor format "+r))}},
qv(a,b,c){var s,r,q,p,o
if(a!==c)return new A.G(a,b)
s=b.b
b.j(s,2)
r=b.a
q=r.getUint16(s,!1)
if(q!==1)throw A.e(A.h("unknown extension subtable format "+q))
p=s+2
b.j(p,2)
o=r.getUint16(p,!1)
if(o===c)throw A.e(A.h("extension subtable nests another extension"))
p=s+4
b.j(p,4)
return new A.G(o,new A.j(r,s+r.getUint32(p,!1)))},
fo:function fo(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
cH:function cH(a,b,c,d){var _=this
_.a=a
_.b=b
_.d=c
_.e=d},
O(a){var s,r,q,p=a.b
a.j(p,2)
s=a.a
r=s.getUint16(p,!1)
switch(r){case 1:q=p+2
a.j(q,2)
return new A.hA(new A.j(s,p+4).X(s.getUint16(q,!1)))
case 2:q=p+2
a.j(q,2)
return new A.hB(new A.j(s,p+4).X(s.getUint16(q,!1)*3))
default:throw A.e(A.h("unknown Coverage format "+r))}},
bf:function bf(){},
hA:function hA(a){this.a=a},
hB:function hB(a){this.a=a},
rN(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=a.b
a.j(g,2)
s=a.a
r=s.getUint16(g,!1)
q=g+2
a.j(q,2)
p=s.getUint16(q,!1)
if(r!==1)throw A.e(A.h("unsupported GDEF version "+r+"."+p))
q=g+4
a.j(q,2)
o=s.getUint16(q,!1)
q=g+8
a.j(q,2)
s.getUint16(q,!1)
q=g+10
a.j(q,2)
n=s.getUint16(q,!1)
if(p>=2){q=g+12
a.j(q,2)
m=s.getUint16(q,!1)}else m=0
if(p>=3){q=g+14
a.j(q,4)
l=s.getUint32(q,!1)}else l=0
q=m===0
if(!q){k=g+m
a.j(k,2)
j=s.getUint16(k,!1)
if(j!==1)throw A.e(A.h("unknown MarkGlyphSets format "+j))
i=k+2
a.j(i,2)
h=A.N(s.getUint16(i,!1),null,!1,t.f1)}else h=null
i=o===0?B.h:A.c3(new A.j(s,g+o))
s=n===0?B.h:A.c3(new A.j(s,g+n))
q=q?0:g+m
return new A.cX(a,i,s,q,l===0?0:g+l,h,p)},
cX:function cX(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.f=e
_.r=f
_.w=g
_.y=null
_.z=!1},
rX(a){var s=A.pc(a)
return new A.c8(s,new A.j(s.a.a,s.b),A.N(s.w.length,null,!1,t.l7))},
p1(a,b){var s,r
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.i)(a),++r)if(a[r].R(b))return!0
return!1},
t_(a,b){var s,r,q,p
for(s=a.a,r=a.b,q=0;q<s.length;++q){if(s[q].f!==3)continue
if(!(q<r.length))return A.a(r,q)
p=r[q]
p.b=p.a=0}},
rZ(a){var s,r,q,p
for(s=a.a,r=a.b,q=0;q<s.length;++q){if(s[q].e!==5)continue
if(!(q<r.length))return A.a(r,q)
p=r[q]
p.d=p.c=p.b=p.a=0}},
rY(a){var s,r
for(s=a.a,r=0;r<s.length;++r)A.p2(a,r,64)},
p2(a,b,c){var s,r,q,p,o,n,m,l,k,j=a.b
if(!(b>=0&&b<j.length))return A.a(j,b)
s=j[b]
r=s.e
q=s.f
if(r===0)return
s.e=0
p=b+r
if(p<0||p>=a.a.length)return
if(c===0)return
A.p2(a,p,c-1)
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
if(a.c===B.i)for(l=p+1;l<=b;++l,m=k){if(!(l<s))return A.a(j,l)
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
c8:function c8(a,b,c){this.a=a
this.b=b
this.c=c},
rW(a,b){var s,r,q,p,o,n,m,l=b.b
b.j(l,2)
s=b.a
r=s.getUint16(l,!1)
switch(a){case 1:return A.tW(b,l,r)
case 2:return A.tB(b,l,r)
case 3:if(r!==1)A.k(A.h("unknown CursivePos format "+r))
q=l+2
b.j(q,2)
return new A.fm(b,l,A.O(new A.j(s,l+s.getUint16(q,!1))))
case 4:if(r!==1)A.k(A.h("unknown MarkBasePos format "+r))
q=l+2
b.j(q,2)
q=A.O(new A.j(s,l+s.getUint16(q,!1)))
p=l+4
b.j(p,2)
p=A.O(new A.j(s,l+s.getUint16(p,!1)))
o=l+6
b.j(o,2)
o=s.getUint16(o,!1)
n=l+8
b.j(n,2)
n=s.getUint16(n,!1)
m=l+10
b.j(m,2)
return new A.fP(q,p,o,new A.eH(b,l+n),new A.ez(b,l+s.getUint16(m,!1)))
case 5:if(r!==1)A.k(A.h("unknown MarkLigPos format "+r))
q=l+2
b.j(q,2)
q=A.O(new A.j(s,l+s.getUint16(q,!1)))
p=l+4
b.j(p,2)
p=A.O(new A.j(s,l+s.getUint16(p,!1)))
o=l+6
b.j(o,2)
o=s.getUint16(o,!1)
n=l+8
b.j(n,2)
n=s.getUint16(n,!1)
m=l+10
b.j(m,2)
return new A.fQ(b,q,p,o,new A.eH(b,l+n),l+s.getUint16(m,!1))
case 6:if(r!==1)A.k(A.h("unknown MarkMarkPos format "+r))
q=l+2
b.j(q,2)
q=A.O(new A.j(s,l+s.getUint16(q,!1)))
p=l+4
b.j(p,2)
p=A.O(new A.j(s,l+s.getUint16(p,!1)))
o=l+6
b.j(o,2)
o=s.getUint16(o,!1)
n=l+8
b.j(n,2)
n=s.getUint16(n,!1)
m=l+10
b.j(m,2)
return new A.fR(q,p,o,new A.eH(b,l+n),new A.ez(b,l+s.getUint16(m,!1)))
case 7:return A.rt(b,l,r)
case 8:return A.rj(b,l,r)
default:throw A.e(A.h("unknown GPOS lookup type "+a))}},
ok(a,b,c,d,e,f){var s,r,q,p,o,n,m,l={}
if(e===0)return
l.a=d
s=new A.n3(l,b)
if((e&1)!==0){r=f.c
q=s.$0()
if(typeof q!=="number")return A.ai(q)
f.c=r+q}if((e&2)!==0){r=f.d
s=s.$0()
if(typeof s!=="number")return A.ai(s)
f.d=r+s}if((e&4)!==0){s=f.a
r=l.a
b.j(r,2)
f.a=s+b.a.getInt16(r,!1)
l.a+=2}if((e&8)!==0)l.a+=2
if((e&240)===0)return
s=a.e
s=s==null?null:s.length!==0
p=s===!0
o=a.f!==0||p
n=a.r!==0||p
if(!o&&!n)return
l=new A.n2(l,b)
if((e&16)!==0){m=l.$0()
if(o&&m!==0)f.c=f.c+a.aV(A.fp(new A.j(b.a,c+m)),!1)}if((e&32)!==0){m=l.$0()
if(n&&m!==0)f.d=f.d+a.aV(A.fp(new A.j(b.a,c+m)),!0)}if((e&64)!==0){m=l.$0()
if(o&&m!==0)f.a=f.a+a.aV(A.fp(new A.j(b.a,c+m)),!1)}if((e&128)!==0)l.$0()},
tW(a,b,c){var s,r,q,p=b+2
a.j(p,2)
s=a.a
r=A.O(new A.j(s,b+s.getUint16(p,!1)))
p=b+4
a.j(p,2)
q=s.getUint16(p,!1)
switch(c){case 1:return new A.en(a,b,r,q,!0)
case 2:return new A.en(a,b,r,q,!1)
default:throw A.e(A.h("unknown SinglePos format "+c))}},
tB(a,b,c){var s,r,q,p,o,n,m,l,k,j=b+2
a.j(j,2)
s=a.a
r=A.O(new A.j(s,b+s.getUint16(j,!1)))
j=b+4
a.j(j,2)
q=s.getUint16(j,!1)
j=b+6
a.j(j,2)
p=s.getUint16(j,!1)
switch(c){case 1:return new A.eg(a,b,r,q,p,1,null,null,0,0)
case 2:j=b+8
a.j(j,2)
o=s.getUint16(j,!1)
j=b+10
a.j(j,2)
n=s.getUint16(j,!1)
j=o===0?B.h:A.c3(new A.j(s,b+o))
m=n===0?B.h:A.c3(new A.j(s,b+n))
l=b+12
a.j(l,2)
l=s.getUint16(l,!1)
k=b+14
a.j(k,2)
return new A.eg(a,b,r,q,p,2,j,m,l,s.getUint16(k,!1))
default:throw A.e(A.h("unknown PairPos format "+c))}},
oU(a,b,c){var s,r,q,p,o=a.length
if(!(b>=0&&b<o))return A.a(a,b)
s=a[b]
r=s.e
q=s.f
if(r===0||(q&2)===0)return
s.e=0
p=b+r
if(p===c)return
if(p<0||p>=o)return
A.oU(a,p,c)
o=a.length
if(!(p>=0&&p<o))return A.a(a,p)
s=a[p]
if(!(b<o))return A.a(a,b)
s.d=-a[b].d
s.e=-r
s.f=q},
o7(a,b,c,d,e){var s,r,q,p,o,n,m
if(d==null)return!1
s=b.a
r=b.b
q=r+2+c*4+2
s.j(q,2)
s=s.a
p=s.getUint16(q,!1)
o=a.bm(p===0?new A.cH(0,0,null,null):A.i6(new A.j(s,r+p)))
n=a.bm(d)
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
tn(a,b){var s=a.w,r=b.w
if(s===r)return s===0||a.x===b.x
if(!(s>0&&a.x===0))s=r>0&&b.x===0
else s=!0
return s},
li(a,b,c,d){var s,r,q,p,o
for(s=c.length,r=b.length,q=0;q<s;++q){p=c[q]
o=p.a
if(o>=r)continue
a.w=b[o]
a.hK(p.b)}a.w=d},
lR(a,b,c,d,e){var s,r,q,p,o,n,m,l,k
if(b===0)return B.p
s=A.N(b,0,!1,t.S)
B.a.m(s,0,a.w)
r=a.w
for(q=d.a,p=a.a,o=a.d,n=1;n<b;++n){m=a.Q
if(m==null)m=a.Q=new A.aE(p,a.x,a.y,o)
l=c+(n-1)*2
if(l>=0)k=l+2<=q.byteLength
else k=!1
if(!k)A.k(A.h("read of 2 byte(s) at "+l+" overruns a "+d.gk(0)+"-byte font"))
r=a.hC(m,r,q.getUint16(l,!1),e)
if(r<0)return null
B.a.m(s,n,r)}return s},
q9(a,b,c,d,e){var s,r,q,p,o,n,m,l=a.w
for(s=d.a,r=a.a,q=a.d,p=0;p<b;++p){o=a.Q
if(o==null)o=a.Q=new A.aE(r,a.x,a.y,q)
n=c+p*2
if(n>=0)m=n+2<=s.byteLength
else m=!1
if(!m)A.k(A.h("read of 2 byte(s) at "+n+" overruns a "+d.gk(0)+"-byte font"))
l=a.dN(o,l,s.getUint16(n,!1),e,!1)
if(l<0)return!1}return!0},
qa(a,b,c,d,e,f){var s,r,q,p,o,n,m,l=f-1
for(s=d.a,r=a.a,q=a.d,p=0;p<b;++p){o=a.Q
if(o==null)o=a.Q=new A.aE(r,a.x,a.y,q)
n=c+p*2
if(n>=0)m=n+2<=s.byteLength
else m=!1
if(!m)A.k(A.h("read of 2 byte(s) at "+n+" overruns a "+d.gk(0)+"-byte font"))
l=a.cg(o,l,s.getUint16(n,!1),e,!1)
if(l<0)return!1}return!0},
mV(a,b,c){var s,r,q,p,o,n="read of 2 byte(s) at ",m=J.aJ(c,t.eJ)
for(s=a.a,r=0;r<c;++r){q=b+r*4
if(q>=0)p=q+2<=s.byteLength
else p=!1
if(!p)A.k(A.h(n+q+" overruns a "+a.gk(0)+"-byte font"))
p=s.getUint16(q,!1)
q+=2
if(q>=0)o=q+2<=s.byteLength
else o=!1
if(!o)A.k(A.h(n+q+" overruns a "+a.gk(0)+"-byte font"))
m[r]=new A.fO(p,s.getUint16(q,!1))}return m},
vs(a,b){return a.a===b},
rt(a,b,c){var s,r,q
switch(c){case 1:s=b+2
a.j(s,2)
r=a.a
return new A.cR(a,b,1,A.O(new A.j(r,b+r.getUint16(s,!1))),null)
case 2:s=b+4
a.j(s,2)
r=a.a
q=r.getUint16(s,!1)
s=b+2
a.j(s,2)
s=A.O(new A.j(r,b+r.getUint16(s,!1)))
return new A.cR(a,b,2,s,q===0?B.h:A.c3(new A.j(r,b+q)))
case 3:return new A.cR(a,b,3,null,null)
default:throw A.e(A.h("unknown ContextPos format "+c))}},
q1(a,b){return new A.lt(A.A(t.S,t.c),a,b)},
rj(a,b,c){var s,r,q,p=null
switch(c){case 1:s=b+2
a.j(s,2)
r=a.a
return new A.cL(a,b,1,A.O(new A.j(r,b+r.getUint16(s,!1))),p,p,p)
case 2:s=new A.ig(a,b)
r=b+2
a.j(r,2)
q=a.a
return new A.cL(a,b,2,A.O(new A.j(q,b+q.getUint16(r,!1))),s.$1(b+4),s.$1(b+6),s.$1(b+8))
case 3:return new A.cL(a,b,3,p,p,p,p)
default:throw A.e(A.h("unknown ChainContextPos format "+c))}},
fO:function fO(a,b){this.a=a
this.b=b},
iX:function iX(a,b,c,d,e,f,g){var _=this
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
aA:function aA(){},
n3:function n3(a,b){this.a=a
this.b=b},
n2:function n2(a,b){this.a=a
this.b=b},
en:function en(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
eg:function eg(a,b,c,d,e,f,g,h,i,j){var _=this
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
fm:function fm(a,b,c){this.a=a
this.b=b
this.c=c},
eH:function eH(a,b){this.a=a
this.b=b},
ez:function ez(a,b){this.a=a
this.b=b},
fP:function fP(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
fQ:function fQ(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
fR:function fR(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
cR:function cR(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
iw:function iw(a){this.a=a},
lt:function lt(a,b,c){this.a=a
this.b=b
this.c=c},
cL:function cL(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
ig:function ig(a,b){this.a=a
this.b=b},
ic:function ic(a){this.a=a},
id:function id(a){this.a=a},
ie:function ie(a){this.a=a},
t2(a){var s=A.pc(a)
return new A.c9(s,A.N(s.w.length,null,!1,t.hJ))},
hK:function hK(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
c9:function c9(a,b){this.a=a
this.b=b},
np(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h=null,g=a.gt(0),f=A.N(b,0,!1,t.S)
B.a.m(f,0,a.f)
if(b===1)return f
s=a.a.a
r=a.f
if(!(r>=0&&r<s.length))return A.a(s,r)
q=s[r]
p=q.w
o=q.x
for(n=p!==0,m=o!==0,l=r,k=h,j=1;j<b;++j){l=g.cf(l)
if(l<0)return h
if(!(l<s.length))return A.a(s,l)
i=s[l]
if(!c.$2(j,i.a))return h
B.a.m(f,j,l)
if(n&&m){if(p!==i.w||o!==i.x){if(k==null)k=A.vq(a,p)
if(!k)return h}}else{r=i.w
if(r!==0&&i.x!==0&&r!==p)return h}}return f},
vq(a,b){var s,r,q=a.a.a,p=a.f,o=q.length
for(;;){if(p>0){r=p-1
if(!(r<o))return A.a(q,r)
r=q[r].w===b}else r=!1
if(!r){s=!1
break}--p
if(!(p>=0&&p<o))return A.a(q,p)
if(q[p].x===0){s=!0
break}}if(s){o=a.gt(0)
if(!(p>=0&&p<q.length))return A.a(q,p)
o=o.az(q[p])}else o=!1
return o},
or(a,b,c){var s,r,q=a.gt(0),p=a.f
for(s=a.a.a,r=0;r<b;++r){p=q.dM(p)
if(p<0)return!1
if(!(p<s.length))return A.a(s,p)
if(!c.$2(r,s[p].a))return!1}return!0},
os(a,b,c,d){var s,r,q=a.gt(0),p=c-1
for(s=a.a.a,r=0;r<b;++r){p=q.cf(p)
if(p<0)return!1
if(!(p<s.length))return A.a(s,p)
if(!d.$2(r,s[p].a))return!1}return!0},
oj(a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a1.length,a=A.N(64,0,!1,t.S)
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
wz(a,b){var s,r,q,p,o,n,m=A.qv(a,b,7),l=m.a,k=m.b,j=k.b
k.j(j,2)
s=k.a
r=s.getUint16(j,!1)
switch(l){case 1:return A.tX(k,r)
case 2:return A.to(k,r)
case 3:return A.ra(k,r)
case 4:return A.tk(k,r)
case 5:A:{if(1===r){j=k.b
q=j+2
k.j(q,2)
p=A.O(new A.j(s,j+s.getUint16(q,!1)))
q=j+4
k.j(q,2)
q=A.lU(k,j,j+6,s.getUint16(q,!1))
q=new A.fi(p,new A.dl(k,q,A.qp(),A.N(q.length,null,!1,t.x)))
s=q
break A}if(2===r){j=k.b
q=j+2
k.j(q,2)
p=A.O(new A.j(s,j+s.getUint16(q,!1)))
q=j+4
k.j(q,2)
o=s.getUint16(q,!1)
q=j+6
k.j(q,2)
n=s.getUint16(q,!1)
s=o===0?B.h:A.c3(new A.j(s,j+o))
q=A.lU(k,j,j+8,n)
q=new A.fj(p,s,new A.dl(k,q,A.qp(),A.N(q.length,null,!1,t.x)))
s=q
break A}if(3===r){s=A.ru(k)
break A}s=A.k(A.h("unknown Context subst format "+r))}return s
case 6:B:{if(1===r){j=k.b
q=j+2
k.j(q,2)
p=A.O(new A.j(s,j+s.getUint16(q,!1)))
q=j+4
k.j(q,2)
q=A.lU(k,j,j+6,s.getUint16(q,!1))
q=new A.fb(p,new A.dl(k,q,A.qo(),A.N(q.length,null,!1,t.x)))
s=q
break B}if(2===r){s=A.rk(k)
break B}if(3===r){s=A.rl(k)
break B}s=A.k(A.h("unknown ChainContext subst format "+r))}return s
case 8:return A.tM(k,r)
default:throw A.e(A.h("unknown GSUB lookup type "+l))}},
tX(a,b){var s,r,q=a.b,p=q+2
a.j(p,2)
s=a.a
r=A.O(new A.j(s,q+s.getUint16(p,!1)))
switch(b){case 1:p=q+4
a.j(p,2)
return new A.eo(r,s.getInt16(p,!1),null)
case 2:p=q+4
a.j(p,2)
return new A.eo(r,0,new A.j(s,q+6).X(s.getUint16(p,!1)))
default:throw A.e(A.h("unknown SingleSubst format "+b))}},
to(a,b){var s,r,q,p,o,n,m,l,k
if(b!==1)throw A.e(A.h("unknown MultipleSubst format "+b))
s=a.b
r=s+2
a.j(r,2)
q=a.a
p=A.O(new A.j(q,s+q.getUint16(r,!1)))
r=s+4
a.j(r,2)
o=q.getUint16(r,!1)
n=J.aJ(o,t.S)
for(r=s+6,m=0;m<o;++m){l=r+m*2
if(l>=0)k=l+2<=q.byteLength
else k=!1
if(!k)A.k(A.h("read of 2 byte(s) at "+l+" overruns a "+a.gk(0)+"-byte font"))
n[m]=s+q.getUint16(l,!1)}return new A.fT(p,a,n,A.N(o,null,!1,t.f8))},
ra(a,b){var s,r,q,p,o,n,m,l,k
if(b!==1)throw A.e(A.h("unknown AlternateSubst format "+b))
s=a.b
r=s+2
a.j(r,2)
q=a.a
p=A.O(new A.j(q,s+q.getUint16(r,!1)))
r=s+4
a.j(r,2)
o=q.getUint16(r,!1)
n=J.aJ(o,t.S)
for(r=s+6,m=0;m<o;++m){l=r+m*2
if(l>=0)k=l+2<=q.byteLength
else k=!1
if(!k)A.k(A.h("read of 2 byte(s) at "+l+" overruns a "+a.gk(0)+"-byte font"))
n[m]=s+q.getUint16(l,!1)}return new A.f7(p,a,n,A.N(o,null,!1,t.f8))},
tk(a,b){var s,r,q,p,o,n,m,l,k
if(b!==1)throw A.e(A.h("unknown LigatureSubst format "+b))
s=a.b
r=s+2
a.j(r,2)
q=a.a
p=A.O(new A.j(q,s+q.getUint16(r,!1)))
r=s+4
a.j(r,2)
o=q.getUint16(r,!1)
n=J.aJ(o,t.S)
for(r=s+6,m=0;m<o;++m){l=r+m*2
if(l>=0)k=l+2<=q.byteLength
else k=!1
if(!k)A.k(A.h("read of 2 byte(s) at "+l+" overruns a "+a.gk(0)+"-byte font"))
n[m]=s+q.getUint16(l,!1)}return new A.fM(p,a,n,A.N(o,null,!1,t.d1))},
vp(a,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a.a,d=e.a,c=a0.length,b=c-1
if(!(b>=0))return A.a(a0,b)
s=a0[b]
A.vt(e,a.f,s+1)
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
l=n?A.uI(e):0
s=a.f
if(!(s>=0&&s<d.length))return A.a(d,s)
r=d[s]
k=r.w
if(n){r.w=l
r.x=0
if(r.e===1)r.e=6}a.bB(s,a1,m)
for(j=1,i=0,o=1;o<c;++o){for(h=a0[o-1]+1,s=j-1;r=a0[o],h<r;++h){if(n){if(!(h>=0&&h<d.length))return A.a(d,h)
r=d[h]
g=r.x
if(g===0)g=1
r.w=l
r.x=s+(g<1?g:1)}++i}if(!(r>=0&&r<d.length))return A.a(d,r)
k=d[r].w;++j}for(s=e.b,o=b;o>=1;--o){B.a.au(d,a0[o])
B.a.au(s,a0[o])}f=a.f+1+i
if(!p&&k!==0)for(b=j-1,o=f;s=d.length,o<s;++o){if(!(o>=0))return A.a(d,o)
s=d[o]
if(s.w!==k)break
g=s.x
if(g===0)break
s.w=l
s.x=b+(g<1?g:1)}a.f=f},
uI(a){var s,r,q,p,o
for(s=a.a,r=s.length,q=0,p=0;p<r;++p){o=s[p].w
if(o>0&&o<8)q|=B.b.ab(1,o)}for(o=1;o<8;++o)if((q&B.b.ab(1,o))>>>0===0)return o
return 1},
vt(a,b,c){var s,r,q,p,o,n
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
mW(a,b,c){var s,r,q,p,o,n="read of 2 byte(s) at ",m=J.aJ(c,t.nu)
for(s=a.a,r=0;r<c;++r){q=b+r*4
if(q>=0)p=q+2<=s.byteLength
else p=!1
if(!p)A.k(A.h(n+q+" overruns a "+a.gk(0)+"-byte font"))
p=s.getUint16(q,!1)
q+=2
if(q>=0)o=q+2<=s.byteLength
else o=!1
if(!o)A.k(A.h(n+q+" overruns a "+a.gk(0)+"-byte font"))
m[r]=new A.h5(p,s.getUint16(q,!1))}return m},
vA(a,b){var s,r,q,p,o,n
t.bb.a(a)
A.Q(b)
a.j(b,2)
s=a.a
r=s.getUint16(b,!1)
q=b+2
a.j(q,2)
p=s.getUint16(q,!1)
q=b+4
o=r===0?0:r-1
n=new A.j(s,q).X(o)
return new A.bt(B.p,n,B.p,A.mW(a,q+n.length*2,p))},
vz(a,b){var s,r,q,p,o,n,m,l,k
t.bb.a(a)
A.Q(b)
a.j(b,2)
s=a.a
r=s.getUint16(b,!1)
q=new A.j(s,b+2).X(r)
p=b+(2+r*2)
a.j(p,2)
o=s.getUint16(p,!1)
n=o===0?0:o-1
m=new A.j(s,p+2).X(n)
p+=2+m.length*2
a.j(p,2)
l=s.getUint16(p,!1)
k=new A.j(s,p+2).X(l)
p+=2+l*2
a.j(p,2)
return new A.bt(q,m,k,A.mW(a,p+2,s.getUint16(p,!1)))},
lU(a,b,c,d){return A.fN(d,new A.lV(a,c,b),!1,t.S)},
lQ(a,b,c,d,e){var s,r,q=A.np(a,b.b.length+1,d)
if(q==null)return!1
s=q.length
r=s-1
if(!(r>=0))return A.a(q,r)
s=q[r]
if(!A.os(a,b.c.length,s+1,e))return!1
if(!A.or(a,b.a.length,c))return!1
A.oj(a,q,q[r]+1,b.d)
return!0},
ru(a){var s,r,q,p,o,n,m,l=a.b,k=l+2
a.j(k,2)
s=a.a
r=s.getUint16(k,!1)
k=l+4
a.j(k,2)
q=s.getUint16(k,!1)
p=J.aJ(r,t.c)
for(k=l+6,o=0;o<r;++o){n=k+o*2
if(n>=0)m=n+2<=s.byteLength
else m=!1
if(!m)A.k(A.h("read of 2 byte(s) at "+n+" overruns a "+a.gk(0)+"-byte font"))
p[o]=A.O(new A.j(s,l+s.getUint16(n,!1)))}return new A.fk(p,A.mW(a,k+r*2,q))},
rk(a){var s,r,q,p,o,n=a.b,m=n+2
a.j(m,2)
s=a.a
r=A.O(new A.j(s,n+s.getUint16(m,!1)))
m=new A.io(a,n)
q=n+10
a.j(q,2)
p=s.getUint16(q,!1)
q=m.$1(n+4)
s=m.$1(n+6)
m=m.$1(n+8)
o=A.lU(a,n,n+12,p)
return new A.fc(r,q,s,m,new A.dl(a,o,A.qo(),A.N(o.length,null,!1,t.x)))},
rl(a){var s,r,q,p,o,n={},m=a.b
n.a=m+2
s=new A.is(n,a,m)
r=s.$0()
q=s.$0()
p=s.$0()
s=n.a
a.j(s,2)
o=a.a.getUint16(s,!1)
return new A.fd(r,q,p,A.mW(a,n.a+2,o))},
vv(a,b){return!1},
tM(a,b){var s,r,q,p,o,n,m,l={}
if(b!==1)throw A.e(A.h("unknown ReverseChainSingleSubst format "+b))
s=a.b
r=s+2
a.j(r,2)
q=a.a
p=A.O(new A.j(q,s+q.getUint16(r,!1)))
l.a=s+4
r=new A.jA(l,a,s)
o=r.$0()
n=r.$0()
r=l.a
a.j(r,2)
m=q.getUint16(r,!1)
return new A.h3(p,o,n,new A.j(q,l.a+2).X(m))},
h5:function h5(a,b){this.a=a
this.b=b},
dV:function dV(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.x=_.w=_.r=_.f=0
_.y=null},
an:function an(){},
eo:function eo(a,b,c){this.a=a
this.b=b
this.c=c},
fT:function fT(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
f7:function f7(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
cy:function cy(a,b){this.a=a
this.b=b},
fM:function fM(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jb:function jb(a,b){this.a=a
this.b=b},
jc:function jc(a){this.a=a},
bt:function bt(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
dl:function dl(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
lV:function lV(a,b,c){this.a=a
this.b=b
this.c=c},
fi:function fi(a,b){this.a=a
this.b=b},
ix:function ix(a){this.a=a},
fj:function fj(a,b,c){this.a=a
this.b=b
this.c=c},
iy:function iy(a,b){this.a=a
this.b=b},
fk:function fk(a,b){this.a=a
this.b=b},
iz:function iz(a){this.a=a},
fb:function fb(a,b){this.a=a
this.b=b},
ii:function ii(a){this.a=a},
ih:function ih(a){this.a=a},
ij:function ij(a){this.a=a},
fc:function fc(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
io:function io(a,b){this.a=a
this.b=b},
il:function il(a,b){this.a=a
this.b=b},
ik:function ik(a,b){this.a=a
this.b=b},
im:function im(a,b){this.a=a
this.b=b},
fd:function fd(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
is:function is(a,b,c){this.a=a
this.b=b
this.c=c},
ip:function ip(a){this.a=a},
iq:function iq(a){this.a=a},
ir:function ir(a){this.a=a},
h3:function h3(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jA:function jA(a,b,c){this.a=a
this.b=b
this.c=c},
jy:function jy(a){this.a=a},
jz:function jz(a){this.a=a},
aE:function aE(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
pc(a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a="read of 4 byte(s) at ",a0="read of 2 byte(s) at ",a1=a2.b
a2.j(a1,2)
s=a2.a
r=s.getUint16(a1,!1)
q=a1+2
a2.j(q,2)
p=s.getUint16(q,!1)
if(r!==1)throw A.e(A.h("unsupported layout table version "+r+"."+p))
q=a1+4
a2.j(q,2)
o=s.getUint16(q,!1)
q=a1+6
a2.j(q,2)
n=s.getUint16(q,!1)
q=a1+8
a2.j(q,2)
m=s.getUint16(q,!1)
if(p>=1){q=a1+10
a2.j(q,4)
s.getUint32(q,!1)}q=t.S
l=A.A(q,q)
if(o!==0){k=a1+o
a2.j(k,2)
j=s.getUint16(k,!1)
for(q=k+2,i=0;i<j;++i){h=q+i*6
if(h>=0)g=h+4<=s.byteLength
else g=!1
if(!g)A.k(A.h(a+h+" overruns a "+a2.gk(0)+"-byte font"))
g=s.getUint32(h,!1)
f=h+4
if(f>=0)e=f+2<=s.byteLength
else e=!1
if(!e)A.k(A.h(a0+f+" overruns a "+a2.gk(0)+"-byte font"))
l.m(0,g,k+s.getUint16(f,!1))}}q=t.t
d=A.c([],q)
c=A.c([],q)
if(n!==0){k=a1+n
a2.j(k,2)
j=s.getUint16(k,!1)
for(g=k+2,i=0;i<j;++i){h=g+i*6
if(h>=0)f=h+4<=s.byteLength
else f=!1
if(!f)A.k(A.h(a+h+" overruns a "+a2.gk(0)+"-byte font"))
B.a.l(d,s.getUint32(h,!1))
f=h+4
if(f>=0)e=f+2<=s.byteLength
else e=!1
if(!e)A.k(A.h(a0+f+" overruns a "+a2.gk(0)+"-byte font"))
B.a.l(c,k+s.getUint16(f,!1))}}b=A.c([],q)
if(m!==0){k=a1+m
a2.j(k,2)
j=s.getUint16(k,!1)
for(q=k+2,i=0;i<j;++i){g=q+i*2
if(g>=0)f=g+2<=s.byteLength
else f=!1
if(!f)A.k(A.h(a0+g+" overruns a "+a2.gk(0)+"-byte font"))
B.a.l(b,k+s.getUint16(g,!1))}}return new A.ja(a2,a1,l,d,c,A.N(d.length,null,!1,t.f8),p,b)},
ja:function ja(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
h9:function h9(a,b){this.a=a
this.b=b},
jQ:function jQ(){},
rc(a){var s,r,q,p,o,n,m,l,k,j=a.a,i=j.length,h=A.N(i,7,!1,t.S)
for(s=0,r=-1,q=0;q<i;++q){if(!(q<j.length))return A.a(j,q)
p=A.rb(j[q])
if(p<0){B.a.m(h,q,7)
continue}o=$.qT()
n=s*6+p
if(!(n<42))return A.a(o,n)
m=o[n]
l=m>>>8&15
k=m&15
if(l!==7&&r>=0)B.a.m(h,r,l)
B.a.m(h,q,m>>>4&15)
r=q
s=k}return h},
rb(a){var s,r,q=a.d
if(q===5)return-1
s=a.b
if(s>=1792&&s<=1871){if(s===1808)return 4
if(B.cN.u(0,s))return 5}A:{r=3
if(1===q){r=1
break A}if(2===q){r=2
break A}if(3===q)break A
if(4===q)break A
r=0
break A}return r},
B(a,b,c){return(a<<8|b<<4|c)>>>0},
dB:function dB(){},
vX(a,b){var s,r
a.am(1920365166)
a.bk()
if(a.c===B.i){a.am(1920232545)
a.bj(1920232557)}else{a.am(1819570785)
a.am(1819570797)}a.bj(1718772067)
a.bj(1853189490)
a.bj(1684959085)
b.du(a)
for(s=0;s<7;++s){r=B.c1[s]
a.aF(r,(r===1835102827||r===1835756907?6:0)|1,1)}for(s=0;s<7;++s){r=B.cp[s]
a.aF(r,(r===1801810542?8:0)|1,1)}},
em:function em(){},
fn:function fn(){},
ax:function ax(a,b,c,d,e,f,g,h,i,j,k){var _=this
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
bJ:function bJ(a){var _=this
_.a=a
_.f=_.e=_.d=_.c=_.b=0},
eu:function eu(a,b){this.a=a
this.b=b},
iQ:function iQ(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=0},
iR:function iR(){},
pj(a,b){var s,r,q,p=a.a
if(b===p)return
B.a.a2(p)
B.a.P(p,b)
p=a.b
B.a.a2(p)
s=b.length
r=J.p7(s,t.lr)
for(q=0;q<s;++q)r[q]=new A.bJ(0)
B.a.P(p,r)},
tz(a,b,c){var s,r,q,p=a.a,o=p.length
if(!(b>=0&&b<o))return A.a(p,b)
s=p[b].c
for(r=b+1;r<c;++r){if(!(r<o))return A.a(p,r)
q=p[r].c
if(q<s)s=q}for(r=b;r<c;++r){if(!(r<p.length))return A.a(p,r)
p[r].c=s}},
uV(a){var s,r,q,p,o,n,m,l,k,j,i
if(a>=44032&&a<55204){s=a-44032
r=B.b.Y(s,28)
if(r!==0)return new A.G(44032+s-r,4519+r)
return new A.G(4352+B.b.U(s,588),4449+B.b.U(B.b.Y(s,588),28))}q=$.qV()
p=q.length
o=(p/3|0)-1
for(n=0;n<=o;){m=B.b.J(n+o,1)
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
return new A.G(j,q[i])}}return B.a_},
uU(a,b){var s,r,q,p,o,n,m,l,k
if(a>=4352&&a<4371)if(b>=4449&&b<4470)return 44032+((a-4352)*21+(b-4449))*28
if(a>=44032&&a<55204)if(B.b.Y(a-44032,28)===0&&b>4519&&b<4547)return a+(b-4519)
s=$.qU()
r=s.length
q=(r/3|0)-1
for(p=0;p<=q;){o=B.b.J(p+q,1)
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
fW:function fW(a,b){this.a=a
this.b=b},
jk:function jk(a){this.a=a},
lS:function lS(){},
tU(a){var s,r,q,p,o,n,m,l,k,j
for(s=a.a,r=0,q=1;p=s.length,q<=p;++q){if(q<p){o=s[q]
n=o.e
m=n===1||n===2||n===3||o.b===8205}else m=!1
if(m)continue
if(q-r>1){if(!(r>=0&&r<p))return A.a(s,r)
l=s[r].c
for(k=r+1;k<q;++k){j=s[k].c
if(j<l)l=j}for(k=r;k<q;++k){if(!(k<s.length))return A.a(s,k)
s[k].c=l}}r=q}},
tT(a){var s=B.cM.u(0,a.d)?B.i:B.q
if(a.c===s)return
a.dR()
a.c=a.c===B.i?B.q:B.i},
tS(a,b){var s,r,q,p,o,n
if(b==null||b.b===B.h)return
for(s=a.a,r=s.length,q=b.b,p=b.c,o=0;o<s.length;s.length===r||(0,A.i)(s),++o){n=s[o]
n.f=q.N(n.a)
n.r=p.N(n.a)}},
wj(a){var s
if(a<173)return!1
s=!0
if(a!==173)if(a!==847)if(a!==1564)if(!(a>=4447&&a<=4448))if(!(a>=6068&&a<=6069))if(!(a>=6155&&a<=6159))if(!(a>=8203&&a<=8207))if(!(a>=8234&&a<=8238))if(!(a>=8288&&a<=8303))if(a!==12644)if(!(a>=65024&&a<=65039))if(a!==65279)if(a!==65440)if(!(a>=65520&&a<=65528))if(!(a>=113824&&a<=113827))if(!(a>=119155&&a<=119162))s=a>=917504&&a<=921599
return s},
h6:function h6(a,b,c){this.a=a
this.b=b
this.c=c},
jM:function jM(){},
h7:function h7(a,b,c){var _=this
_.a=a
_.b=b
_.c=$
_.d=c},
tV(a){var s
for(s=0;a>0;){++s
a=a>>>1}return s},
h1:function h1(a,b){this.a=a
this.b=b},
h0:function h0(a){this.a=a},
h8:function h8(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
bu:function bu(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.r=_.f=0},
jO:function jO(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.r=_.e=0},
jP:function jP(){},
rf(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=A.re(a)
if(d.length<=1)return A.pP(a,null).dS()
s=J.t(a)
r=s.gk(a)
q=new Uint8Array(r)
r=t.A
p=A.c([],r)
o=A.c([],r)
n=A.c([],r)
for(m=0,l=0,k=0;k<d.length;++k,m=j){j=d[k]
i=A.pP(s.G(a,m,j),null).dS()
B.j.by(q,m,i.a)
for(r=i.c,h=r.length,g=0;g<r.length;r.length===h||(0,A.i)(r),++g){f=r[g]
B.a.l(p,new A.bb(f.a+m,f.b+m,f.c))}for(r=i.d,h=r.length,g=0;g<r.length;r.length===h||(0,A.i)(r),++g){f=r[g]
B.a.l(o,new A.bb(f.a+m,f.b+m,f.c))}e=i.b
B.a.l(n,new A.bb(m,j,e))
if(k===0)l=e}return new A.dF(q,l,p,o)},
re(a){var s,r,q,p=A.c([],t.t)
for(s=J.t(a),r=0;r<s.gk(a);++r){q=s.h(a,r)
if(A.af($.oF(),q)!==10)continue
if(s.h(a,r)===13){q=r+1
q=q<s.gk(a)&&s.h(a,q)===10}else q=!1
if(q)continue
B.a.l(p,r+1)}if(p.length===0||B.a.ga0(p)!==s.gk(a))B.a.l(p,s.gk(a))
return p},
pP(a,b){var s,r,q,p=J.t(a),o=p.gk(a),n=p.gk(a)
n=new Uint8Array(n)
s=p.gk(a)
s=new Uint8Array(s)
r=p.gk(a)
r=new Uint8Array(r)
q=p.gk(a)
q=new Int32Array(q)
p=p.gk(a)
p=new A.l5(a,b,o,n,s,r,q,new Int32Array(p))
p.e5(a,b)
return p},
ui(a,b,c,d,e){var s,r,q,p,o,n=b.length,m=t.S,l=J.aJ(n,m)
for(s=a.e,r=b.length,q=s.length,p=0;p<n;++p){if(!(p<r))return A.a(b,p)
o=b[p]
if(!(o<q))return A.a(s,o)
l[p]=s[o]}s=new A.hM(a,b,l,c,d,e)
m=A.a7(l,m)
m.$flags=1
s.d=t.L.a(m)
return s},
pL(a){var s
A:{if(0===a){s=0
break A}if(1===a||3===a||6===a){s=1
break A}s=-1
break A}return s},
pK(a){B.a.aA(a,new A.kX())
return a},
pJ(a){var s
A:{if(12296===a){s=9001
break A}if(12297===a){s=9002
break A}s=a
break A}return s},
bb:function bb(a,b,c){this.a=a
this.b=b
this.c=c},
dF:function dF(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
l5:function l5(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.z=_.y=_.x=$},
hM:function hM(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=$
_.e=d
_.f=e
_.r=f},
kX:function kX(){},
tQ(a){var s,r,q,p,o,n,m,l,k=1145457748,j=a.length
if(j===0)return B.cb
s=A.c([],t.m1)
for(r=0,q=-1,p=0;p<j;++p){if(!(p<a.length))return A.a(a,p)
o=a[p]
n=A.af($.qX(),o)
if(n===$.qP()||n===$.qQ()||n===0)continue
m=k
if(n>=0&&n<$.oD().length){o=$.oD()
if(!(n>=0&&n<o.length))return A.a(o,n)
l=o[n]}else l=m
if(q===-1)q=l
else if(l!==q){B.a.l(s,new A.el(r,p,q))
q=l
r=p}}B.a.l(s,new A.el(r,j,q===-1?k:q))
return s},
el:function el(a,b,c){this.a=a
this.b=b
this.c=c},
mY:function mY(){},
h(a){return new A.am(a)},
j:function j(a,b){this.a=a
this.b=b},
am:function am(a){this.a=a},
ri(a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=a9.length,a3=a2/12|0,a4=a3*4,a5=new Float32Array(a4),a6=new Float32Array(256),a7=new Int32Array(256)
for(s=a8.length,r=0;r<a3;++r){q=r*12
p=q+4
if(!(p<a2))return A.a(a9,p)
o=B.c.M(a9[p])
p=q+5
if(!(p<a2))return A.a(a9,p)
for(p=o+B.c.M(a9[p]),n=o,m=1/0,l=1/0,k=-1/0,j=-1/0;n<p;++n){i=n*4
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
for(g=B.b.F(B.c.a6(l/4096*16),0,15),p=j/4096*16,i=m/4096*16,h=k/4096*16;g<=B.b.F(B.c.a6(p),0,15);++g)for(f=B.b.F(B.c.a6(i),0,15),e=g*16;f<=B.b.F(B.c.a6(h),0,15);++f){d=e+f
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
b[a]=a2+s}a2=B.c.M(b[256])
a0=new Float32Array(a2)
a1=new Int32Array(256)
for(r=0;r<a3;++r){s=r*4
p=s+1
if(!(p<a4))return A.a(a5,p)
g=B.b.F(B.c.a6(a5[p]/4096*16),0,15)
p=s+3
if(!(p<a4))return A.a(a5,p)
i=s+2
for(;g<=B.b.F(B.c.a6(a5[p]/4096*16),0,15);++g){if(!(s<a4))return A.a(a5,s)
f=B.b.F(B.c.a6(a5[s]/4096*16),0,15)
if(!(i<a4))return A.a(a5,i)
h=g*16
for(;f<=B.b.F(B.c.a6(a5[i]/4096*16),0,15);++f){d=h+f
if(!(d>=0&&d<257))return A.a(b,d)
e=B.c.M(b[d])
if(!(d<256))return A.a(a1,d)
c=a1[d]
if(!(d<256))return A.a(a1,d)
a1[d]=c+1
c=e+c
if(!(c>=0&&c<a2))return A.a(a0,c)
a0[c]=r}}}return new A.i9(a5,b,a0,a6)},
i9:function i9(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
tF(a,b){var s,r,q,p,o,n,m,l,k,j,i=A.c([],t.dG)
for(s=b.d.gaj(),s=s.gt(s),r=t.I,q=t.j,p=t.s,o=t.G;s.n();){n=s.gq()
m=n.a
l=n.b
n=new A.hZ(m)
l=q.b(l)?l:B.W
k=J.t(l)
j=k.gA(l)?null:k.gv(l)
n.b=r.a(A.q(k.gk(l)>1?k.h(l,1):null))
n.c=r.a(A.q(typeof j=="string"?A.c([j,A.c(["accumulated"],p),A.c(["get",m],p)],o):j))
i.push(n)}i=new A.ju(b,i,new A.z(B.k),A.A(t.S,t.el))
i.e3(a,b)
return i},
it:function it(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
hZ:function hZ(a){this.a=a
this.c=this.b=$},
aP:function aP(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=null
_.f=0},
ju:function ju(a,b,c,d){var _=this
_.a=a
_.b=$
_.c=b
_.d=c
_.e=1
_.f=d},
jw:function jw(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jv:function jv(a){this.a=a},
ps(a,b,c,d){var s,r,q=new A.jB(),p=new A.jC(),o=(a+16)/116,n=q.$1(o),m=q.$1(o+b/500)
if(typeof m!=="number")return A.ai(m)
s=0.96422*m
q=q.$1(o-c/200)
if(typeof q!=="number")return A.ai(q)
r=0.82521*q
return new A.a9(p.$1(3.1338561*s-1.6168667*n-0.4906146*r),p.$1(-0.9787684*s+1.9161415*n+0.033454*r),p.$1(0.0719453*s-0.2289914*n+1.4052427*r),d)},
cl(a){if(a instanceof A.a9)return a
if(typeof a!="string")return null
return $.tO.aY(a,new A.jJ(a))},
tN(a){var s,r,q,p,o,n,m,l,k,j,i=null,h=B.d.bv(a).toLowerCase()
if(B.d.aB(h,"#")){s=B.d.aN(h,1)
r=s.length
if(r===3||r===4)s=new A.ao(A.c(s.split(""),t.s),t.gL.a(new A.jF()),t.gQ).ce(0)
q=A.tH(s,16)
if(q==null)return i
r=s.length
if(r===6)return new A.a9((B.b.J(q,16)&255)/255,(B.b.J(q,8)&255)/255,(q&255)/255,1)
if(r===8)return new A.a9((B.b.J(q,24)&255)/255,(B.b.J(q,16)&255)/255,(B.b.J(q,8)&255)/255,(q&255)/255)
return i}p=B.d.aW(h,"(")
if(p>0&&B.d.dA(h,")")){r=B.d.cv(B.d.a4(h,p+1,h.length-1),A.jx("[,/\\s]+"))
o=A.L(r)
n=o.i("cr<1>")
m=A.a7(new A.cr(r,o.i("H(1)").a(new A.jG()),n),n.i("f.E"))
r=new A.jH(m)
o=m.length
if(o<3)return i
l=o>3?r.$2(3,1):1
k=B.d.a4(h,0,p)
if(k==="rgb"||k==="rgba")return new A.a9(r.$2(0,255),r.$2(1,255),r.$2(2,255),l)
if(k==="hsl"||k==="hsla"){if(0>=m.length)return A.a(m,0)
o=m[0]
o=A.T(A.ov(o,"deg",""))
return A.pt(B.c.Y(o==null?0:o,360)/360,r.$2(1,100),r.$2(2,100),l)}return i}j=B.cx.h(0,h)
if(j==null)return i
return new A.a9((j>>>16&255)/255,(j>>>8&255)/255,(j&255)/255,(j>>>24&255)/255)},
pt(a,b,c,d){var s=c<0.5?c*(1+b):c+b-c*b,r=new A.jI(2*c-s,s)
return new A.a9(r.$1(a+0.3333333333333333),r.$1(a),r.$1(a-0.3333333333333333),d)},
a9:function a9(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jE:function jE(){},
jD:function jD(){},
jB:function jB(){},
jC:function jC(){},
jJ:function jJ(a){this.a=a},
jF:function jF(){},
jG:function jG(){},
jH:function jH(a){this.a=a},
jI:function jI(a,b){this.a=a
this.b=b},
C(a){var s
if(typeof a=="number")s=a
else if(typeof a=="string")s=A.T(a)
else if(A.R(a))s=a?1:0
else s=null
return s},
bA(a){if(a==null)return""
if(typeof a=="number"&&a===B.c.av(a))return B.b.p(B.c.M(a))
return J.ba(a)},
qh(a){var s,r=!1
if(a!=null){s=J.ak(a)
if(!s.D(a,!1))if(!s.D(a,0))if(!s.D(a,""))r=!(typeof a=="number"&&isNaN(a))}return r},
ac(a){return new A.lr(a)},
q(a){var s
if(t.f.b(a))return a.K("stops")||a.K("property")?A.q8(a):A.ac(a)
if(t.j.b(a)){s=J.t(a)
s=s.gI(a)&&B.cP.u(0,s.gv(a))}else s=!1
if(s){s=J.a4(a)
return A.vx(A.S(s.gv(a)),s.a3(a,1))}return A.ac(a)},
i1(a){var s,r,q,p,o,n,m,l,k
if(typeof a!="string"||!B.d.u(a,"{"))return new A.n8(A.q(a))
s=A.c([],t.G)
for(r=A.jx("\\{([^}]*)\\}").bY(0,a),r=new A.ey(r.a,r.b,r.c),q=t.s,p=t.lu,o=0;r.n();){n=r.d
m=(n==null?p.a(n):n).b
l=m.index
if(l>o)B.a.l(s,B.d.a4(a,o,l))
if(1>=m.length)return A.a(m,1)
k=m[1]
k.toString
B.a.l(s,A.c([k],q))
o=l+m[0].length}if(o<a.length)B.a.l(s,B.d.aN(a,o))
return new A.n9(s)},
on(a){if(a==null)return new A.n6()
return new A.n7(A.lu(a))},
lu(a){var s,r,q,p,o,n,m,l,k,j=t.j
if(!j.b(a)||J.dA(a))return A.ac(!J.p(a,!1))
s=J.a4(a)
r=s.gv(a)
q=s.a3(a,1)
p=new A.lE()
s=J.t(q)
if(s.gI(q))if(typeof s.gv(q)=="string"){o=q.length
n=!0
if(o>=2){if(1>=o)return A.a(q,1)
if(j.b(q[1])){o=J.ak(r)
o=o.D(r,"in")||o.D(r,"!in")}else o=n}else o=n
n=o}else n=!1
else n=!1
if("all"===r){j=A.c([],t.V)
for(s=q.length,m=0;m<q.length;q.length===s||(0,A.i)(q),++m)j.push(A.lu(q[m]))
return new A.lv(j)}if("any"===r){j=A.c([],t.V)
for(s=q.length,m=0;m<q.length;q.length===s||(0,A.i)(q),++m)j.push(A.lu(q[m]))
return new A.lw(j)}if("none"===r){j=A.c([],t.V)
for(s=q.length,m=0;m<q.length;q.length===s||(0,A.i)(q),++m)j.push(A.lu(q[m]))
return new A.lx(j)}if("!has"===r)return new A.ly(s.gv(q))
if("!in"===r){l=s.gv(q)
return new A.lz(J.oM(s.a3(q,1)),p,l)}o=!1
if("in"===r)if(n){o=q.length
if(o===2){if(1>=o)return A.a(q,1)
j=!j.b(q[1])}else j=!0}else j=o
else j=o
if(j){l=s.gv(q)
return new A.lA(J.oM(s.a3(q,1)),p,l)}j="=="===r
if((j||"!="===r||"<"===r||"<="===r||">"===r||">="===r)&&n){l=s.gv(q)
if(1>=q.length)return A.a(q,1)
k=q[1]
A:{if(j){j=new A.lB(p,l,k)
break A}if("!="===r){j=new A.lC(p,l,k)
break A}j=new A.lD(r,p,l,k)
break A}return j}return A.q(a)},
v0(a){var s,r,q,p,o,n="case-sensitive",m=!1
if(a.length>2){s=a[2]
r=t.j
if(r.b(s)){q=t.z
if(J.p(A.tb(s,q),"collator")){if(2>=a.length)return A.a(a,2)
m=a[2]
m.toString
p=A.ta(r.a(m),1,q)
A:{m=!1
if(t.f.b(p)){o=p.h(0,n)
if(o==null)s=p.K(n)
else s=!0
if(s)m=!0===o}break A}m=!m}}}return m},
o8(a,b,c){var s,r
if(typeof b=="number"&&typeof c=="number")s=B.c.ac(b,c)
else if(typeof b=="string"&&typeof c=="string")s=B.d.ac(b,c)
else return!1
A:{if("<"===a){r=s<0
break A}if("<="===a){r=s<=0
break A}if(">"===a){r=s>0
break A}r=s>=0
break A}return r},
vx(c7,c8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3=null,c4=new A.lX(c8),c5=new A.lW(c8),c6=new A.mS(c4)
if("literal"===c7){s=J.t(c8)
return A.ac(s.gA(c8)?c3:s.gv(c8))}if("get"===c7){s=J.t(c8)
r=s.gA(c8)?c3:s.gv(c8)
if(c8.length>1){q=c4.$1(0)
return new A.lY(c4.$1(1),q)}if(typeof r=="string")return new A.lZ(r)
return new A.m_(c4.$1(0))}if("has"===c7){s=J.t(c8)
r=s.gA(c8)?c3:s.gv(c8)
if(c8.length>1){q=c4.$1(0)
return new A.ma(c4.$1(1),q)}return new A.ml(r)}if("!has"===c7){s=J.t(c8)
return new A.mw(s.gA(c8)?c3:s.gv(c8))}if("properties"===c7)return new A.mH()
if("id"===c7)return new A.mN()
if("accumulated"===c7)return new A.mO()
if("feature-state"===c7){s=J.t(c8)
return new A.mP(s.gA(c8)?c3:s.gv(c8))}if("let"===c7){p=A.A(t.N,t.I)
for(s=J.t(c8),o=0;n=o+2,n<c8.length;o=n){if(!(o>=0&&o<c8.length))return A.a(c8,o)
m=A.w(c8[o])
l=o+1
if(!(l>=0&&l<c8.length))return A.a(c8,l)
p.m(0,m,A.q(c8[l]))}B.a.l($.f1,p)
try{s=s.gA(c8)?A.ac(c3):A.q(s.ga0(c8))
return s}finally{if(0>=$.f1.length)return A.a($.f1,-1)
$.f1.pop()}}if("var"===c7){for(s=A.L($.f1).i("b4<1>"),m=new A.b4($.f1,s),m=new A.V(m,m.gk(0),s.i("V<Y.E>")),l=J.t(c8),s=s.i("Y.E");m.n();){k=m.d
if(k==null)k=s.a(k)
j=k.h(0,l.gA(c8)?"":A.w(l.gv(c8)))
if(j!=null)return j}return A.ac(c3)}if("heatmap-density"===c7||"line-progress"===c7)return new A.mQ()
if("image"===c7)return c4.$1(0)
if("is-supported-script"===c7)return A.ac(!0)
if("resolved-locale"===c7)return A.ac("en")
if("within"===c7){s=J.t(c8)
i=A.pk(s.gA(c8)?c3:s.gv(c8))
if(i==null)return A.ac(!1)
return new A.m0(i)}if("distance"===c7){s=J.t(c8)
i=A.pk(s.gA(c8)?c3:s.gv(c8))
if(i==null)return A.ac(c3)
return new A.m1(i)}if("typeof"===c7)return new A.m2(c4.$1(0))
if("to-rgba"===c7)return new A.m3(c4.$1(0))
if("slice"===c7){h=c4.$1(0)
g=c4.$1(1)
return new A.m4(h,g,c8.length>2?c4.$1(2):c3)}if("index-of"===c7){f=c4.$1(0)
e=c4.$1(1)
return new A.m5(e,f,c8.length>2?c4.$1(2):c3)}if("sin"===c7)return c6.$1(A.ww())
if("cos"===c7)return c6.$1(A.wu())
if("tan"===c7)return c6.$1(A.wy())
if("asin"===c7)return c6.$1(A.ws())
if("acos"===c7)return c6.$1(A.wr())
if("atan"===c7)return c6.$1(A.wt())
if("zoom"===c7)return new A.m6()
if("geometry-type"===c7)return new A.m7()
if("!"===c7)return new A.m8(c4.$1(0))
d="=="===c7
c=c3
b=c3
a=!1
a0=c3
a1=!1
a2=c3
a3=!1
s=!0
if(!d){a4="!="===c7
a5=!a4
if(a5){c="<"===c7
a=!c
if(a){b="<="===c7
a1=!b
if(a1){a0=">"===c7
a3=!a0
if(a3){a2=">="===c7
s=a2}}}}}else{a4=c3
a5=!1}if(s&&A.v0(c8)){a6=c4.$1(0)
a7=c4.$1(1)
return new A.m9(a6,a7,c7==="=="||c7==="!=",c7)}if(d)return new A.mb(c4.$1(0),c4.$1(1))
if(a4)return new A.mc(c4.$1(0),c4.$1(1))
s=!0
if(!(a5?c:"<"===c7))if(!(a?b:"<="===c7))if(!(a1?a0:">"===c7))s=a3?a2:">="===c7
if(s)return new A.md(c7,c4.$1(0),c4.$1(1))
if("all"===c7)return new A.me(c5.$0())
if("any"===c7)return new A.mf(c5.$0())
if("none"===c7)return new A.mg(c5.$0())
if("case"===c7)return new A.mh(c5.$0())
if("match"===c7){h=c4.$1(0)
a8=A.A(t.O,t.I)
for(s=t.j,o=1;m=o+1,m<c8.length;o+=2){if(!(m>=0&&m<c8.length))return A.a(c8,m)
a9=A.q(c8[m])
if(!(o>=0&&o<c8.length))return A.a(c8,o)
b0=c8[o]
m=J.M(s.b(b0)?b0:[b0])
while(m.n())a8.m(0,m.gq(),a9)}if(o<c8.length){if(!(o>=0&&o<c8.length))return A.a(c8,o)
b1=A.q(c8[o])}else b1=A.ac(c3)
return new A.mi(a8,h,b1)}if("coalesce"===c7)return new A.mj(c5.$0())
if("step"===c7){h=c4.$1(0)
b2=c4.$1(1)
b3=A.c([],t.n)
b4=A.c([],t.V)
for(o=2;s=o+1,s<c8.length;o+=2){if(!(o>=0&&o<c8.length))return A.a(c8,o)
m=c8[o]
if(!(typeof m=="number"))if(typeof m=="string")m=A.T(m)
else if(A.R(m))m=m?1:0
else m=c3
B.a.l(b3,m==null?0:m)
if(!(s>=0&&s<c8.length))return A.a(c8,s)
B.a.l(b4,A.q(c8[s]))}return new A.mk(h,b2,b3,b4)}if("interpolate"===c7||"interpolate-hcl"===c7||"interpolate-lab"===c7){s=J.t(c8)
if(s.gI(c8)&&t.j.b(s.gv(c8))){s=s.gv(c8)
s.toString
t.j.a(s)
b5=s}else b5=B.X
s=t.n
b3=A.c([],s)
b4=A.c([],t.V)
for(o=2;m=o+1,m<c8.length;o+=2){if(!(o>=0&&o<c8.length))return A.a(c8,o)
l=c8[o]
if(!(typeof l=="number"))if(typeof l=="string")l=A.T(l)
else if(A.R(l))l=l?1:0
else l=c3
B.a.l(b3,l==null?0:l)
if(!(m>=0&&m<c8.length))return A.a(c8,m)
B.a.l(b4,A.q(c8[m]))}m=c4.$1(1)
A:{if("interpolate-hcl"===c7){l="hcl"
break A}if("interpolate-lab"===c7){l="lab"
break A}l=c3
break A}k=J.a4(b5)
if(J.p(k.gv(b5),"exponential")&&k.gk(b5)>1){b6=A.C(k.h(b5,1))
if(b6==null)b6=1}else b6=1
b7=J.p(k.gv(b5),"geometric")
if(J.p(k.gv(b5),"cubic-bezier")&&k.gk(b5)>4){s=A.c([],s)
for(o=1;o<5;++o){b8=k.h(b5,o)
if(!(typeof b8=="number"))if(typeof b8=="string")b8=A.T(b8)
else if(A.R(b8))b8=b8?1:0
else b8=c3
s.push(b8==null?0:b8)}}else s=c3
return A.oa(m,b3,b4,b6,s,b7,l)}if("to-string"===c7)return new A.mm(c4.$1(0))
if("number-format"===c7){a6=c4.$1(0)
if(c8.length>1){if(1<0||1>=c8.length)return A.a(c8,1)
s=t.f.b(c8[1])}else s=!1
if(s){if(1<0||1>=c8.length)return A.a(c8,1)
b9=t.f.a(c8[1])}else b9=B.x
s=A.C(b9.h(0,"min-fraction-digits"))
c0=s==null?c3:B.c.M(s)
if(c0==null)c0=0
s=A.C(b9.h(0,"max-fraction-digits"))
s=s==null?c3:B.c.M(s)
if(s==null)s=3
return new A.mn(a6,Math.max(c0,s),c0)}if("split"===c7)return new A.mo(c4.$1(0),c4.$1(1))
if("join"===c7)return new A.mp(c4.$1(0),c4.$1(1))
if("hsl"===c7||"hsla"===c7)return new A.mq(c5.$0())
if("to-number"===c7||"number"===c7)return new A.mr(c5.$0(),c7)
if("to-boolean"===c7)return new A.ms(c4.$1(0))
if("to-color"===c7)return new A.mt(c4.$1(0))
if("string"===c7||"boolean"===c7||"array"===c7||"object"===c7)return new A.mu(c5.$0())
if("concat"===c7||"format"===c7){s=A.c([],t.V)
for(m=c8.length,l=t.f,c1=0;c1<c8.length;c8.length===m||(0,A.i)(c8),++c1){a6=c8[c1]
if(!l.b(a6))s.push(A.q(a6))}return new A.mv(s)}if("upcase"===c7)return new A.mx(c4.$1(0))
if("downcase"===c7)return new A.my(c4.$1(0))
if("+"===c7||"*"===c7||"min"===c7||"max"===c7)return new A.mz(c5.$0(),c7)
if("-"===c7||"/"===c7||"%"===c7||"^"===c7){a6=c4.$1(0)
if(c8.length===1)return c6.$1(new A.mA())
return new A.mB(a6,c4.$1(1),c7)}if("round"===c7)return c6.$1(new A.mC())
if("floor"===c7)return c6.$1(new A.mD())
if("ceil"===c7)return c6.$1(new A.mE())
if("abs"===c7)return c6.$1(new A.mF())
if("sqrt"===c7)return c6.$1(A.wx())
if("ln"===c7)return c6.$1(A.wv())
if("log10"===c7)return c6.$1(new A.mG())
if("log2"===c7)return c6.$1(new A.mI())
if("e"===c7)return A.ac(2.718281828459045)
if("pi"===c7)return A.ac(3.141592653589793)
if("ln2"===c7)return A.ac(0.6931471805599453)
if("length"===c7)return new A.mJ(c4.$1(0))
if("in"===c7){f=c4.$1(0)
return new A.mK(c4.$1(1),f)}if("at"===c7){c2=c4.$1(0)
return new A.mL(c4.$1(1),c2)}if("rgb"===c7||"rgba"===c7)return new A.mM(c5.$0())
return A.ac(c3)},
oa(a,b,c,d,e,f,g){if(b.length===0)return A.ac(null)
return new A.lF(a,b,c,e,d,f,g)},
uR(a,b){var s,r,q,p,o,n,m=new A.lo()
for(s=0,r=1,q=0;q<24;++q){p=(s+r)/2
o=a.length
if(0>=o)return A.a(a,0)
n=a[0]
if(2>=o)return A.a(a,2)
n=m.$3(p,n,a[2])
if(typeof n!=="number")return n.dZ()
if(n<b)s=p
else r=p}o=a.length
if(1>=o)return A.a(a,1)
n=a[1]
if(3>=o)return A.a(a,3)
return m.$3((s+r)/2,n,a[3])},
q8(a0){var s,r,q,p,o,n,m,l,k,j,i,h,g=a0.h(0,"property"),f=a0.h(0,"type"),e=a0.h(0,"default"),d=a0.h(0,"stops"),c=typeof g=="string",b=c?new A.lI(g):new A.lJ(),a=J.ak(f)
if(a.D(f,"identity")||!t.j.b(d)||J.dA(d))return new A.lK(b,e)
if(c&&J.r2(d,new A.lL()))return A.uX(a0,d)
s=[]
r=[]
for(q=J.M(d),p=t.j,o=t.f;q.n();){n=q.gq()
if(p.b(n)){m=J.t(n)
m=m.gk(n)<2||o.b(m.gv(n))}else m=!0
if(m)return A.ac(e)
m=J.t(n)
s.push(m.h(n,0))
r.push(m.h(n,1))}if(a.D(f,"categorical")){c=t.O
l=A.pe(c,c)
A.tm(l,s,r)
return new A.lM(l,b,e)}k=B.a.aG(r,new A.lN())
q=A.c([],t.n)
for(p=s.length,j=0;j<s.length;s.length===p||(0,A.i)(s),++j){i=s[j]
if(typeof i=="number")o=i
else if(typeof i=="string")o=A.T(i)
else if(A.R(i))o=i?1:0
else o=null
q.push(o==null?0:o)}p=A.c([],t.V)
for(o=r.length,j=0;j<r.length;r.length===o||(0,A.i)(r),++j)p.push(A.ac(r[j]))
if(!a.D(f,"interval"))a=!k&&!a.D(f,"exponential")
else a=!0
if(a)return new A.lO(b,e,r,q)
a=A.C(a0.h(0,"base"))
if(a==null)a=1
h=A.oa(b,q,p,a,null,!1,A.bx(a0.h(0,"colorSpace")))
if(!c)return h
return new A.lP(g,e,h)},
uX(a,b){var s,r,q,p,o,n,m,l,k,j,i="colorSpace",h=t.W,g=A.A(t.i,h)
for(h=J.f5(b,h),s=h.$ti,h=new A.V(h,h.gk(0),s.i("V<x.E>")),r=t.f,s=s.i("x.E");h.n();){q=h.d
if(q==null)q=s.a(q)
p=J.a4(q)
o=p.gv(q)
o.toString
r.a(o)
n=o.h(0,"zoom")
if(typeof n=="number")m=n
else{if(typeof n=="string")n=A.T(n)
else if(A.R(n))n=n?1:0
else n=null
m=n}if(m==null)m=0
n=g.h(0,m)
if(n==null){n=[]
g.m(0,m,n)}o=o.h(0,"value")
B.a.l(n,[o,p.gk(q)>1?p.h(q,1):null])}h=g.$ti.i("ag<1>")
l=A.a7(new A.ag(g,h),h.i("f.E"))
B.a.aK(l)
h=A.c([],t.V)
for(s=l.length,r=t.O,k=0;k<l.length;l.length===s||(0,A.i)(l),++k){j=l[k]
h.push(A.q8(A.e4(["type",a.h(0,"type"),"property",a.h(0,"property"),"default",a.h(0,"default"),"colorSpace",a.h(0,i),"stops",g.h(0,j)],r,r)))}s=A.C(a.h(0,"base"))
if(s==null)s=1
return A.oa(new A.lq(),l,h,s,null,!1,A.bx(a.h(0,i)))},
z:function z(a){var _=this
_.a=0
_.b=a
_.c=""
_.r=_.f=null},
lr:function lr(a){this.a=a},
n8:function n8(a){this.a=a},
n9:function n9(a){this.a=a},
n6:function n6(){},
n7:function n7(a){this.a=a},
lE:function lE(){},
lv:function lv(a){this.a=a},
lw:function lw(a){this.a=a},
lx:function lx(a){this.a=a},
ly:function ly(a){this.a=a},
lz:function lz(a,b,c){this.a=a
this.b=b
this.c=c},
lA:function lA(a,b,c){this.a=a
this.b=b
this.c=c},
lB:function lB(a,b,c){this.a=a
this.b=b
this.c=c},
lC:function lC(a,b,c){this.a=a
this.b=b
this.c=c},
lD:function lD(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
lX:function lX(a){this.a=a},
lW:function lW(a){this.a=a},
mS:function mS(a){this.a=a},
mT:function mT(a,b){this.a=a
this.b=b},
lY:function lY(a,b){this.a=a
this.b=b},
lZ:function lZ(a){this.a=a},
m_:function m_(a){this.a=a},
ma:function ma(a,b){this.a=a
this.b=b},
ml:function ml(a){this.a=a},
mw:function mw(a){this.a=a},
mH:function mH(){},
mN:function mN(){},
mO:function mO(){},
mP:function mP(a){this.a=a},
mQ:function mQ(){},
m0:function m0(a){this.a=a},
m1:function m1(a){this.a=a},
m2:function m2(a){this.a=a},
m3:function m3(a){this.a=a},
m4:function m4(a,b,c){this.a=a
this.b=b
this.c=c},
mR:function mR(a){this.a=a},
m5:function m5(a,b,c){this.a=a
this.b=b
this.c=c},
m6:function m6(){},
m7:function m7(){},
m8:function m8(a){this.a=a},
m9:function m9(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
mb:function mb(a,b){this.a=a
this.b=b},
mc:function mc(a,b){this.a=a
this.b=b},
md:function md(a,b,c){this.a=a
this.b=b
this.c=c},
me:function me(a){this.a=a},
mf:function mf(a){this.a=a},
mg:function mg(a){this.a=a},
mh:function mh(a){this.a=a},
mi:function mi(a,b,c){this.a=a
this.b=b
this.c=c},
mj:function mj(a){this.a=a},
mk:function mk(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
mm:function mm(a){this.a=a},
mn:function mn(a,b,c){this.a=a
this.b=b
this.c=c},
mo:function mo(a,b){this.a=a
this.b=b},
mp:function mp(a,b){this.a=a
this.b=b},
mq:function mq(a){this.a=a},
mr:function mr(a,b){this.a=a
this.b=b},
ms:function ms(a){this.a=a},
mt:function mt(a){this.a=a},
mu:function mu(a){this.a=a},
mv:function mv(a){this.a=a},
mx:function mx(a){this.a=a},
my:function my(a){this.a=a},
mz:function mz(a,b){this.a=a
this.b=b},
mA:function mA(){},
mB:function mB(a,b,c){this.a=a
this.b=b
this.c=c},
mC:function mC(){},
mD:function mD(){},
mE:function mE(){},
mF:function mF(){},
mG:function mG(){},
mI:function mI(){},
mJ:function mJ(a){this.a=a},
mK:function mK(a,b){this.a=a
this.b=b},
mL:function mL(a,b){this.a=a
this.b=b},
mM:function mM(a){this.a=a},
lF:function lF(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
lo:function lo(){},
lI:function lI(a){this.a=a},
lJ:function lJ(){},
lK:function lK(a,b){this.a=a
this.b=b},
lL:function lL(){},
lM:function lM(a,b,c){this.a=a
this.b=b
this.c=c},
lN:function lN(){},
lO:function lO(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
lP:function lP(a,b,c){this.a=a
this.b=b
this.c=c},
lq:function lq(){},
fa:function fa(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
fv:function fv(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
iE:function iE(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
iF:function iF(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
iG:function iG(a){this.a=a},
p_(a,b,c,d){var s=A.c([],t.ha),r=A.c([],t.r),q=b!=null
s=new A.bg(d,c,s,q,r)
s.cQ(a)
if(q)s.r=A.tF(r,b)
return s},
rO(a){var s,r,q,p,o,n,m=a.length,l=m-2
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
fy(a){var s,r,q,p,o,n,m=J.t(a),l=m.gk(a)*2,k=new Float64Array(l)
for(m=m.gt(a),s=t.j,r=0;m.n();){q=m.gq()
if(!s.b(q)||J.Z(q)<2)continue
p=r+1
o=J.t(q)
n=A.aa(o.h(q,0))
if(!(r<l))return A.a(k,r)
k[r]=(n+180)/360
r=p+1
o=A.oy(A.aa(o.h(q,1)))
if(!(p<l))return A.a(k,p)
k[p]=o}return r===l?k:A.cV(k,0,r)},
rP(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e={}
e.a=A.c([],t.n)
e.b=0
s=new A.iO(e,b,c)
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
g=new A.iN(o)
g.$2(-l,n- -128)
g.$2(l,4224-n)
g.$2(-j,m- -128)
g.$2(j,4224-m)
if(!o.c){s.$0()
continue}if(!(o.a>0)?e.a.length===0:k){s.$0()
k=o.a
e.b=q+i*k
f=e.a
B.a.l(f,n+l*k)
B.a.l(f,m+j*o.a)}k=e.a
B.a.l(k,n+l*o.b)
B.a.l(k,m+j*o.b)
if(o.b<1)s.$0()}s.$0()
return q},
rQ(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c
for(s=t.n,r=a,q=0;q<4;++q){p=A.c([],s)
o=new A.iP(q)
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
break A}B.a.l(p,m+(f-m)*e)
B.a.l(p,l+(d-l)*e)}if(c){B.a.l(p,f)
B.a.l(p,d)}}r=new Float64Array(A.ad(p))}return r},
bg:function bg(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=0
_.d=c
_.e=d
_.f=e
_.r=null},
iO:function iO(a,b,c){this.a=a
this.b=b
this.c=c},
iN:function iN(a){this.a=a},
iP:function iP(a){this.a=a},
hE:function hE(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
hQ:function hQ(a){this.a=a},
df:function df(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
wm(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=new A.nm(a),e=A.c([],t.t)
for(s=!1,r=0;q=a.length,r<q;++r){if(!(r>=0))return A.a(a,r)
p=a[r]
o=B.E.h(0,p)
if(o==null)o=0
n=!1
if(o===1){B.a.l(e,p)
continue}m=f.$1(r)
if(p===1604&&m!=null){if(m>>>0!==m||m>=a.length)return A.a(a,m)
l=B.cv.h(0,a[m])}else l=null
if(l!=null){k=l[s?1:0]
q=k===0
B.a.l(e,q?p:k)
j=r+1
m.toString
for(;j<m;++j){if(!(j<a.length))return A.a(a,j)
B.a.l(e,a[j])}if(q){if(!(m>=0&&m<a.length))return A.a(a,m)
q=a[m]}else q=-1
B.a.l(e,q)
r=m
s=n
continue}if(s)i=o===2||o===3||o===5
else i=!1
if(o===2||o===4||o===5)if(m!=null){if(m>>>0!==m||m>=a.length)return A.a(a,m)
q=B.E.h(0,a[m])
if(q==null)q=0
q=q===2||q===3||q===5
h=q}else h=n
else h=n
g=B.cw.h(0,p)
if(g==null)k=0
else{if(i)q=h?3:1
else q=h?2:0
k=g[q]}B.a.l(e,k===0?p:k)
s=h}return e},
nm:function nm(a){this.a=a},
wJ(a){var s,r,q,p
for(s=new A.cN(a),r=t.gS,s=new A.V(s,s.gk(0),r.i("V<x.E>")),r=r.i("x.E");s.n();){q=s.d
if(q==null)q=r.a(q)
if(!(q>=1424&&q<=2303))p=q>=64285&&q<=65276
else p=!0
if(p)return!0
if(q>=65&&q<=591)return!1}return!1},
rR(a,b){var s,r,q,p,o,n=t.S,m=A.c([],t.oJ)
for(s=a.$ti,r=new A.V(a,a.gk(0),s.i("V<x.E>")),s=s.i("x.E");r.n();){q=r.d
m.push(new A.bP(A.tR(q==null?s.a(q):q,0),null))}s=A.c([],t.s)
for(r=a.a,q=J.t(r),p=b!=null,o=0;o<q.gk(r);++o)s.push(A.p0(p&&o<J.Z(b.a)?b.$ti.y[1].a(J.b0(b.a,o)):""))
return new A.iS(m,s,A.A(t.N,t.L),A.A(n,t.kJ),A.A(n,t.gp))},
p0(a){var s,r,q,p,o=A.c([],t.s)
for(s=B.d.cv(a.toLowerCase(),A.jx("[\\s_-]+")),r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q]
if(p.length!==0&&!B.cL.u(0,p))o.push(p)}return B.a.ce(o)},
rS(a){return B.b.F(B.c.ah(a/100)*100,100,900)},
oh(c5,c6,c7,c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1=1751474532,c2=t.n,c3=A.c([],c2),c4=J.t(c6)
if(c4.gA(c6))return new A.G(c3,0)
for(s=A.rf(c6).d,r=s.length,q=c8!==0,p=c5.c,o=J.a4(c9),n=c5.r,m=c7/100,l=t.S,k=t.gc,j=t.Q,i=t.q,h=0,g=0;g<s.length;s.length===r||(0,A.i)(s),++g){f=s[g]
e=c4.G(c6,f.a,f.b)
d=(f.c&1)===1
c=A.tQ(e)
b=J.M(d?new A.b4(c,A.L(c).i("b4<1>")):c)
a=!d
a0=J.a4(e)
while(b.n()){a1=b.gq()
a2=a0.G(e,a1.a,a1.b)
a4=o.gt(c9)
a1=a1.c
a5=0
for(;;){if(!a4.n()){a3=null
break}a5=a4.gq()
a6=a5*1000+B.b.F(B.c.ah(m)*100,100,900)
a7=n.h(0,a6)
if(a7==null){a7=new A.h7(c5.hi(a5,c7),A.A(l,k),new A.iQ(A.c([],j),A.c([],i),B.q))
n.m(0,a6,a7)
a6=a7}else a6=a7
a8=a6.e0(a2,d?B.i:B.q,a1)
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
b5=b4==null?null:new A.j(a4.a.a,b4.c)
if(b5==null)A.k(A.h("font has no "+A.ay(A.co(c1))+" table"))
a1=a1.c=A.t3(b5)}else a1=a4
b6=a1.f
for(a1=a3.a,a4=a3.b,b7=0;b7<a1.length;++b7){b8=a1[b7]
if(!(b7<a4.length))return A.a(a4,b7)
b9=a4[b7]
c0=b9.a/b6
a6=b8.a
if(a6!==0)B.a.P(c3,A.c([a5,a6,h+b9.c/b6,-b9.d/b6,c0],c2))
h+=c0
if(a&&q&&c0>0)h+=c8}}}return new A.G(c3,h)},
uS(a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=t.D,c=A.c([],d),b=t.t,a=A.c([],b)
for(s=a1.length,r=0;r<a1.length;a1.length===s||(0,A.i)(a1),++r){q=a1[r]
if(q===32||q===160||q===12288){if(a.length!==0)B.a.l(c,a)
a=A.c([],b)}else B.a.l(a,q)}if(a.length!==0)B.a.l(c,a)
if(c.length<2)return A.c([a1],d)
s=A.oh(a0,B.aD,a2,a3,a5)
p=s==null?null:s.b
if(p==null)p=0.25
s=A.c([],t.n)
for(o=c.length,r=0;r<c.length;c.length===o||(0,A.i)(c),++r){n=c[r]
m=A.oh(a0,n,a2,a3,a5)
m=m==null?null:m.b
s.push(m==null?n.length*0.5:m)}l=B.a.dB(s,0,new A.lp(),t.i)+p*(c.length-1)
if(l<=a4)return A.c([a1],d)
k=B.c.c2(l/a4)
j=l/k
i=A.c([],d)
h=A.c([],b)
for(d=k-1,g=0,f=0;f<c.length;++f){o=h.length===0
m=o?0:p
if(!(f<s.length))return A.a(s,f)
e=s[f]
if(!o){o=g+(m+e)
o=o>j&&o-j>j-g&&i.length<d}else o=!1
if(o){B.a.l(i,h)
h=A.c([],b)
g=0}if(h.length!==0)B.a.l(h,32)
if(!(f<c.length))return A.a(c,f)
B.a.P(h,c[f])
o=h.length
if(!(f<c.length))return A.a(c,f)
o=o===c[f].length?0:p
if(!(f<s.length))return A.a(s,f)
g+=o+s[f]}if(h.length!==0)B.a.l(i,h)
return i},
qq(a,b,c,d,e,f,g,h,i){var s,r,q,p,o={},n=a.hG(h),m=A.c([],t.D)
o.a=A.c([],t.t)
s=new A.nn(o,g,f,m,a,i,d,n)
for(r=new A.d6(b);r.n();){q=r.d
if(q===10||q===13||q===8232||q===8233){if(g)B.a.l(o.a,32)
else s.$0()
continue}p=o.a
B.a.l(p,q===9?32:q)}s.$0()
return A.vo(a,m,i,d,e,c,n)},
vo(a4,a5,a6,a7,a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=A.c([],t.k_)
for(s=a5.length,r=0;r<a5.length;a5.length===s||(0,A.i)(a5),++r){q=A.oh(a4,a5[r],a6,a7,b0)
if(q==null)return null
B.a.l(a3,q)}p=B.a.dB(a3,0,new A.lH(),t.i)
s=A.Q(J.i4(b0))
o=a4.c
if(!(s>=0&&s<o.length))return A.a(o,s)
n=o[s]
m=n.a.aZ(1751672161)
l=n.ghl().f
s=m.b+4
m.j(s,2)
o=m.a
k=o.getInt16(s,!1)/l
s=m.b+6
m.j(s,2)
j=(a8-k- -o.getInt16(s,!1)/l)/2
s=t.n
i=A.c([],s)
for(o=A.p4(a3,0,t.hT),h=J.M(o.a),g=o.b,o=new A.bh(h,g,A.o(o).i("bh<1>")),f=a9>0,e=a9<0;o.n();){d=o.c
d=d>=0?new A.G(g+d,h.gq()):A.k(A.aB())
c=d.b
b=c.a
a=c.b
A:{if(e){a0=0
break A}if(f){a0=p-a
break A}a0=(p-a)/2
break A}a1=d.a*a8+j+k
for(d=J.t(b),a2=0;a2<d.gk(b);a2+=5)B.a.P(i,A.c([d.h(b,a2),d.h(b,a2+1),d.h(b,a2+2)+a0,d.h(b,a2+3)+a1,d.h(b,a2+4)],s))}s=new Float32Array(A.ad(i))
o=a3.length
return new A.jN(s,p,o*a8,o)},
iS:function iS(a,b,c,d,e){var _=this
_.c=a
_.d=b
_.e=c
_.f=d
_.r=e},
iU:function iU(a,b){this.a=a
this.b=b},
iT:function iT(a,b,c){this.a=a
this.b=b
this.c=c},
jN:function jN(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
lp:function lp(){},
nn:function nn(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
lH:function lH(){},
rU(a){var s,r,q,p,o,n=A.c([],t.ez),m=a.length,l=new A.hT(a,0,m)
while(l.b<m){s=l.B()
r=s&7
if(s>>>3===1&&r===2){q=l.dI()
for(p=q.c;q.b<p;){s=q.B()
o=s&7
if(s>>>3===3&&o===2)B.a.l(n,A.rT(q.dI()))
else q.T(0,o)}}else l.T(0,r)}return n},
rT(a){var s,r,q,p,o,n,m
new Uint8Array(0)
for(s=a.c,r=a.a,q=0,p=0;a.b<s;){o=a.B()
switch(o>>>3){case 1:q=a.B()
break
case 2:n=a.B()
m=a.b
A.kw(r,m,m+n)
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
default:a.T(0,o&7)}}return new A.bk(q,p)},
bk:function bk(a,b){this.a=a
this.r=b},
hT:function hT(a,b,c){this.a=a
this.b=b
this.c=c},
iV:function iV(a,b,c,d,e,f,g,h,i){var _=this
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
iW:function iW(a,b){this.a=a
this.b=b},
nN(a,b){var s=new A.iZ(),r=s.$1(a)
s=s.$1(b)
if(typeof s!=="number")return s.ao()
if(typeof r!=="number")return r.b3()
return r+s*4096},
t1(a){var s,r,q,p,o,n,m,l
A:{s=a instanceof A.bF
r=null
q=!1
if(s){p=a.cx==null
if(p){r=!a.cy
q=r}o=p}else{p=null
o=!1}if(q){q=0
break A}if(s)q=o?r:!a.cy
else q=!1
if(q){q=2
break A}if(a instanceof A.dJ){q=3
break A}q=a instanceof A.e1
n=null
m=!1
l=!1
if(q)if(s?p:a.cy==null){n=a.fx==null
l=n
m=!0}if(l){q=1
break A}if(q)l=m?n:a.fx==null
else l=!1
if(l){q=4
break A}if(q){q=5
break A}q=-1
break A}return q},
t0(d3,d4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1=null,d2=A.A(t.S,t.ke)
for(s=d4.length,r=t.B,q=0;q<d4.length;d4.length===s||(0,A.i)(d4),++q){p=d4[q]
o=p.a
n=d2.h(0,o)
if(n==null){n=A.c([],r)
d2.m(0,o,n)
o=n}else o=n
B.a.l(o,p)}m=new A.bE(new Float64Array(16384))
l=new A.j3(new Uint32Array(16384))
k=A.c([],t.cm)
s=t.t
j=A.c([],s)
r=d3.z
o=r.length+1
i=new Int32Array(o)
for(h=0,g=0,f=0;n=r.length,f<n;++f){n=l.b
if(!(f<o))return A.a(i,f)
i[f]=n
e=r[f]
d=A.t1(e)
if(d<0)continue
n=d2.h(0,e.b)
if(n==null)n=B.U
c=n.length
b=d*16384
a=d===3
a0=d===4
a1=d!==1
a2=!a
a3=!a0
a4=d===5
q=0
for(;q<n.length;n.length===c||(0,A.i)(n),++q){p=n[q]
a5=p.b
if(a2&&a5.c.length===0)continue
if(a&&a5.a.length===0)continue
a6=k.length
if(a6-g>=120){B.a.P(j,A.c([h,l.b-h,g],s))
h=l.b
g=k.length
a6=g}a7=a6-g
B.a.l(k,new A.G(f,p.c))
a8=B.b.U(m.b,6)
a9=a5.a
b0=!a1||!a3||a4
b1=b0?a5.b:d1
b2=b0?a5.e:d1
b3=b0?a5.d:d1
b4=a0?b3:d1
a6=a9.length
b5=a6/2|0
if(a){for(b6=a7+b,b7=0;b7<b5;++b7){b8=B.b.U(m.b,6)
for(b9=b7*2,c0=b9+1,c1=0;c1<4;++c1){c2=B.aE[c1]
if(!(b9<a6))return A.a(a9,b9)
c3=a9[b9]
if(!(c0<a6))return A.a(a9,c0)
m.aE(c3,a9[c0],A.nN(c2.a,c2.b),0)
m.bV(b6,0)}for(c1=0;c1<6;++c1)l.l(0,b8+B.cs[c1])}continue}for(b6=b3==null,b9=b4==null,c0=a7+b,c2=b2==null,c3=b1==null,b7=0;b7<b5;++b7){c4=b7*2
if(!(c4<a6))return A.a(a9,c4)
c5=a9[c4]
c6=c4+1
if(!(c6<a6))return A.a(a9,c6)
c7=a9[c6]
if(c3)c8=0
else{c8=b1.length
if(!(c4<c8))return A.a(b1,c4)
c9=b1[c4]
if(!(c6<c8))return A.a(b1,c6)
c9=A.nN(c9,b1[c6])
c8=c9}if(c2)c9=0
else{c9=b2.length
if(!(c4<c9))return A.a(b2,c4)
d0=b2[c4]
if(!(c6<c9))return A.a(b2,c6)
d0=A.nN(d0,b2[c6])
c9=d0}m.aE(c5,c7,c8,c9)
if(b9)c5=0
else{if(!(c6<b4.length))return A.a(b4,c6)
c5=B.c.ah(B.c.F(b4[c6],0,1)*127)*131072}if(b6)c4=0
else{if(!(c4<b3.length))return A.a(b3,c4)
c4=b3[c4]}m.bV(c0+c5,c4)}for(a6=a5.c,b6=a6.length,c1=0;c1<b6;++c1)l.l(0,a8+a6[c1])}}r=l.b
if(r===0)return d1
if(!(n<o))return A.a(i,n)
i[n]=r
B.a.P(j,A.c([h,r-h,g],s))
return new A.iY(i,new Float32Array(A.ad(A.cV(m.a,0,m.b))),B.F.G(l.a,0,l.b),k,new Int32Array(A.ad(j)))},
iY:function iY(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
iZ:function iZ(){},
ts(a){var s,r,q,p,o=A.A(t.N,t.dl),n=a.length,m=new A.bW(a,0,n)
while(m.b<n){s=m.B()
if(s===26){r=m.B()
q=m.b
p=A.tq(a,q,q+r)
o.m(0,p.a,p)
m.b+=r}else m.T(0,s&7)}return new A.jh(o)},
tq(a,b,c){var s,r,q,p,o,n=A.c([],t.s),m=[],l=A.c([],t.ef),k=new A.bW(a,b,c)
for(s="",r=4096;k.b<c;){q=k.B()
switch(q){case 10:s=k.bA()
break
case 18:p=k.B()
o=k.b
B.a.l(l,A.tp(a,o,o+p))
k.b+=p
break
case 26:B.a.l(n,k.bA())
break
case 34:p=k.B()
o=k.b
m.push(A.tr(a,o,o+p))
k.b+=p
break
case 40:r=k.B()
break
default:k.T(0,q&7)}}return new A.e8(s,r,n,m,l)},
tr(a,b,c){var s,r,q,p,o=new A.bW(a,b,c)
for(s=null;o.b<c;){r=o.B()
switch(r){case 10:s=o.bA()
break
case 21:q=o.b
p=A.nL(a,q,q+4).getFloat32(0,!0)
o.b+=4
s=p
break
case 25:q=o.b
p=A.nL(a,q,q+8).getFloat64(0,!0)
o.b+=8
s=p
break
case 32:case 40:s=o.B()
break
case 48:p=o.B()
s=(p&1)===0?B.b.U(p,2):-B.b.U(p+1,2)
break
case 56:s=o.B()!==0
break
default:o.T(0,r&7)}}return s},
tp(a,b,c){var s,r,q,p,o,n,m,l,k=new A.bW(a,b,c)
for(s=0,r=null,q=0,p=0,o=0,n=0;k.b<c;){m=k.B()
switch(m){case 8:r=k.B()
break
case 18:l=k.B()
q=k.b
p=q+l
k.b=p
break
case 24:s=k.B()
break
case 34:l=k.B()
o=k.b
n=o+l
k.b=n
break
default:k.T(0,m&7)}}return new A.e7(a,s,r,q,p,o,n)},
jh:function jh(a){this.a=a},
e8:function e8(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
e7:function e7(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
fz:function fz(a,b){this.a=a
this.b=0
this.c=b},
bW:function bW(a,b,c){this.a=a
this.b=b
this.c=c},
pk(a){var s=A.c([],t.n),r=A.c([],t.iA),q=A.c([],t.ot),p=new A.fZ(s,r,q)
p.bQ(a)
return s.length===0&&r.length===0&&q.length===0?null:p},
jo(a){var s,r,q,p=t.n,o=A.c([],p),n=t.j
if(n.b(a))for(s=J.M(a);s.n();){r=s.gq()
if(n.b(r)){q=J.t(r)
q=q.gk(r)>=2&&typeof q.h(r,0)=="number"&&typeof q.h(r,1)=="number"}else q=!1
if(q){q=J.t(r)
B.a.P(o,A.c([A.aa(q.h(r,0)),A.aa(q.h(r,1))],p))}}return o},
tC(a,b,c,d,e){var s=(a-c)*e,r=b-d
return Math.sqrt(s*s+r*r)},
nY(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=J.t(c)
if(e.gk(c)<4)return e.gk(c)<2?1/0:A.tC(a,b,e.h(c,0),e.h(c,1),d)
for(s=1/0,r=0;q=r+3,q<e.gk(c);){p=e.h(c,r)
o=e.h(c,r+1)
r+=2
n=(e.h(c,r)-p)*d
m=e.h(c,q)-o
l=(a-p)*d
k=b-o
j=n*n+m*m
i=j===0?0:B.c.F((l*n+k*m)/j,0,1)
h=l-n*i
g=k-m*i
f=Math.sqrt(h*h+g*g)
if(f<s)s=f}return s},
fZ:function fZ(a,b,c){this.a=a
this.b=b
this.c=c},
jq:function jq(a){this.a=a},
jp:function jp(a,b,c){this.a=a
this.b=b
this.c=c},
p3(a,b){return new A.j2(a,b)},
ck:function ck(a,b){this.a=a
this.b=b},
j2:function j2(a,b){this.a=a
this.b=b},
oz(a,b){var s=0,r=A.au(t.o)
var $async$oz=A.av(function(c,d){if(c===1)return A.ar(d,r)
for(;;)switch(s){case 0:return A.as(null,r)}})
return A.at($async$oz,r)},
nh(a){var s=0,r=A.au(t.p),q,p,o,n
var $async$nh=A.av(function(b,c){if(b===1)return A.ar(c,r)
for(;;)switch(s){case 0:p=v.G
o=A.aZ(A.aZ(A.aZ(new p.Blob(A.c([a],t.aA))).stream()).pipeThrough(A.aZ(new p.DecompressionStream("gzip"))))
n=A
s=3
return A.U(A.ou(A.aZ(A.aZ(new p.Response(o)).arrayBuffer()),t.a),$async$nh)
case 3:q=n.nW(c,0,null)
s=1
break
case 1:return A.as(q,r)}})
return A.at($async$nh,r)},
ee:function ee(){},
jj:function jj(a,b){this.a=a
this.b=b},
ji:function ji(a){this.a=a},
iH:function iH(a){this.a=a},
tE(a,b,c){var s,r,q,p,o,n,m,l,k,j
for(s=0,r=1,q=0;q<a;++q){s+=r
r*=4}p=a===0?0:B.b.ad(1,a-1)
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
tD(a,b){var s,r,q=a.length,p=q-1
for(s=0;s<=p;){r=B.b.J(s+p,1)
if(!(r<q))return A.a(a,r)
if(a[r].a<=b)s=r+1
else p=r-1}if(p<0)q=null
else{if(!(p<q))return A.a(a,p)
q=a[p]}return q},
eh(a,b){var s=0,r=A.au(t.p),q,p
var $async$eh=A.av(function(c,d){if(c===1)return A.ar(d,r)
for(;;)switch(s){case 0:if(0===b||1===b){p=a
s=3
break}s=2===b?4:5
break
case 4:s=6
return A.U(A.nh(a),$async$eh)
case 6:p=d
s=3
break
case 5:p=A.k(B.ax)
case 3:q=p
s=1
break
case 1:return A.as(q,r)}})
return A.at($async$eh,r)},
pl(a){var s,r,q,p,o,n,m,l,k,j,i,h,g={}
g.a=0
s=new A.js(g,a)
r=s.$0()
q=t.S
p=A.N(r,0,!1,q)
o=A.N(r,0,!1,q)
n=A.N(r,0,!1,q)
for(m=0,l=0;l<r;++l){q=s.$0()
if(typeof q!=="number")return A.ai(q)
m+=q
B.a.m(p,l,m)}for(l=0;l<r;++l)B.a.m(o,l,s.$0())
for(l=0;l<r;++l)B.a.m(n,l,s.$0())
k=A.c([],t.mE)
for(j=0,l=0;l<r;++l){i=s.$0()
h=i===0&&l>0?j:i-1
q=n[l]
j=h+q
B.a.l(k,new A.eE(p[l],o[l],h,q))}return k},
jr:function jr(a,b,c,d){var _=this
_.a=a
_.c=b
_.d=c
_.r=_.f=null
_.w=d},
jt:function jt(a){this.a=a},
js:function js(a,b){this.a=a
this.b=b},
hL:function hL(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
eE:function eE(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
u8(a){var s,r,q,p,o,n,m,l,k=J.t(a),j=k.h(a,0)
j.toString
A.Q(j)
s=new A.kA(a)
r=new A.kz(a)
q=k.h(a,1)
A:{if("build"===q){p=s.$0()
k=k.h(a,5)
k.toString
j=new A.dG(p,A.Q(k),j)
k=j
break A}if("find"===q){p=s.$0()
o=r.$1(5)
n=r.$1(6)
m=r.$1(7)
l=r.$1(8)
j=new A.dS(p,o,n,m,l,k.h(a,9)==null?null:new A.G(r.$1(9),r.$1(10)),j)
k=j
break A}if("cluster"===q){p=k.h(a,2)
p.toString
p=A.rH(B.c2,A.S(p),t.j8)
o=k.h(a,3)
o.toString
A.Q(o)
n=k.h(a,4)
n.toString
A.Q(n)
k=k.h(a,5)
k.toString
j=new A.dD(p,o,n,A.Q(k),j)
k=j
break A}k=A.k(A.aI("No worker request is called "+A.w(q),null))}return k},
kB:function kB(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
bU:function bU(){},
kA:function kA(a){this.a=a},
kz:function kz(a){this.a=a},
dG:function dG(a,b,c){this.b=a
this.c=b
this.a=c},
dS:function dS(a,b,c,d,e,f,g){var _=this
_.b=a
_.c=b
_.d=c
_.e=d
_.f=e
_.r=f
_.a=g},
bD:function bD(a,b){this.a=a
this.b=b},
dD:function dD(a,b,c,d,e){var _=this
_.b=a
_.c=b
_.d=c
_.e=d
_.a=e},
az:function az(){},
hn:function hn(){},
hj:function hj(a,b){this.c=a
this.a=b},
hm:function hm(a,b){this.c=a
this.a=b},
dR:function dR(a,b){this.b=a
this.a=b},
dK:function dK(a,b){this.b=a
this.a=b},
cM:function cM(a,b){this.b=a
this.a=b},
fg:function fg(a,b,c){this.a=a
this.b=b
this.c=c},
hl:function hl(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
wA(c2,c3,c4,c5,c6,c7,c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1=new A.z(B.k)
c1.a=c8
s=new Float64Array(4096)
r=t.t
q=A.c([],r)
p=new A.fz(s,q)
o=A.c([],t.cb)
n=new A.nu(c8)
for(s=J.M(c2),m=t.bs,l=m.i("V<Y.E>"),k=c3.z,j=c3.y,i=m.i("Y.E"),h=c3.Q,g=t.s,f=t.fe,e=c3.as;s.n();){d=s.gq()
c=A.c([],r)
for(b=0;b<k.length;++b){a=k[b].b
if(!(a>=0&&a<j.length))return A.a(j,a)
a=j[a]
a0=!1
if(a.b===c4)if(a.c===d.gan()){if(!(b<k.length))return A.a(k,b)
a=k[b]
a=n.$2(a.c,a.d)}else a=a0
else a=a0
if(a)c.push(b)}a=A.c([],r)
for(b=0;b<h.length;++b){a0=h[b].b
a1=!1
if(a0.b===c4)if(a0.c===d.gan()){if(!(b<h.length))return A.a(h,b)
a0=h[b].b
a0=n.$2(a0.z,a0.Q)}else a0=a1
else a0=a1
if(a0)a.push(b)}if(c.length===0&&a.length===0)continue
a2=4096/d.gc9()
a3=c5/a2
a4=c6/a2
a5=c7/a2
if(!(c4>=0&&c4<e.length))return A.a(e,c4)
a6=e[c4]
a7=a6 instanceof A.bI?null:a6.cc(d.gan())
for(a0=d.gca(),a1=a0.length,a8=a7!=null,a9=0;a9<a0.length;a0.length===a1||(0,A.i)(a0),++a9){b0=a0[a9]
p.b=0
B.a.a2(q)
b0.cj(p)
A:{if(f.b(c9)){b1=c9.a/a2
b2=c9.b/a2
b2=A.vL(b0.gH(),p,a3-b1,a4-b2,a3+b1,a4+b2)
b1=b2
break A}if(c9==null){b1=A.v5(b0.gH(),p,a3,a4,a5)
break A}b1=null}if(!b1)continue
b3=b0.c_(d)
if(a8&&b3.h(0,a7)!=null)b3.m(0,"$id",b3.h(0,a7))
c1.sag(b3)
b4=b0.gH()
B:{if(1===b4){b1="Point"
break B}if(2===b4){b1="LineString"
break B}b1="Polygon"
break B}c1.c=b1
b5=A.c([],g)
for(b1=new A.b4(a,m),b1=new A.V(b1,b1.gk(0),l),b6=-1;b1.n();){b2=b1.d
if(b2==null)b2=i.a(b2)
if(b2>>>0!==b2||b2>=h.length)return A.a(h,b2)
if(!h[b2].hf(c1))continue
if(b2>>>0!==b2||b2>=h.length)return A.a(h,b2)
B.a.l(b5,h[b2].a)
if(b6<0)b6=k.length+b2}for(b1=new A.b4(c,m),b1=new A.V(b1,b1.gk(0),l);b1.n();){b2=b1.d
b7=b2==null?i.a(b2):b2
if(b7>>>0!==b7||b7>=k.length)return A.a(k,b7)
b8=k[b7]
b2=b8.b
if(!(b2>=0&&b2<j.length))return A.a(j,b2)
b9=j[b2]
c0=b9.e
C:{if(B.r===c0||B.z===c0){b2=b0.gH()===3
break C}if(B.n===c0){b2=b0.gH()===1
break C}if(B.t===c0){b2=b0.gH()!==1
break C}b2=null}if(!b2||!b9.d.$1(c1))continue
b2=b8.a
if(!B.a.u(b5,b2))B.a.l(b5,b2)
if(b6<0)b6=b7}if(b5.length===0)continue
B.a.l(o,new A.hl(b6,d.gan(),c1.c,b5,c1.b))}}return o},
v5(a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=a3.a
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
b=B.c.F(c===0?0:((a4-g)*o+(a5-f)*m)/c,0,1)
a=g+o*b-a4
a0=f+m*b-a5
if(a*a+a0*a0<=r)return!0}}}return k},
vL(a,b,c,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=b.a,d=new A.n0(c,a1,a0,a2)
if(a===1){for(s=e.length,r=0;r<b.b;r+=2){if(!(r<s))return A.a(e,r)
q=e[r]
p=r+1
if(!(p<s))return A.a(e,p)
if(d.$2(q,e[p]))return!0}return!1}o=new A.mZ()
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
nu:function nu(a){this.a=a},
n0:function n0(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
mZ:function mZ(){},
n_:function n_(){},
bl:function bl(){},
fC:function fC(){},
ho:function ho(){},
fY:function fY(){},
fB:function fB(){},
hi:function hi(){},
ko:function ko(a,b,c){this.a=a
this.b=b
this.c=c},
u_(a,b,c){var s=A.c([],t.jA),r=A.c([],t.o_),q=t.S,p=A.c([],t.o9),o=A.c([],t.oW),n=A.c([],t.kv),m=A.c([],t.lW),l=A.c([],t.t),k=t.eO.a(a.$ti.i("4?").a(a.a.h(0,"sources")))
if(k==null)k=B.x
return new A.hc(a,b,c,k,s,A.A(t.O,t.aV),r,A.A(t.N,q),p,o,n,m,l,new A.bo(A.w(c)),new A.jZ(),new A.jY(),A.A(q,t.I))},
he(a,b){var s,r,q=A.bj(t.N)
for(s=b.length,r=0;r<b.length;b.length===s||(0,A.i)(b),++r)A.hd(a.h(0,b[r]),q)
return q},
hd(a,b){var s,r,q
if(t.j.b(a)){s=J.t(a)
if(s.gk(a)===2)r=(J.p(s.h(a,0),"get")||J.p(s.h(a,0),"has"))&&typeof s.h(a,1)=="string"
else r=!1
if(r)b.l(0,A.S(s.h(a,1)))
if(s.gI(a))r=J.p(s.h(a,0),"feature-state")||J.p(s.h(a,0),"id")
else r=!1
if(r)b.l(0,"$id")
for(s=s.gt(a);s.n();)A.hd(s.gq(),b)}else if(t.f.b(a)){q=a.h(0,"property")
if(typeof q=="string")b.l(0,q)}},
u0(a){var s,r,q,p,o,n,m,l,k=null,j=t.j
if(!j.b(a)||J.Z(a)!==4)return k
s=new Float64Array(8)
for(r=J.t(a),q=0;q<4;++q){p=r.h(a,q)
if(!j.b(p)||J.Z(p)<2)return k
o=J.t(p)
n=o.h(p,0)
if(!(typeof n=="number"))if(typeof n=="string"){m=A.T(n)
n=m}else{if(A.R(n))m=n?1:0
else m=k
n=m}l=o.h(p,1)
if(!(typeof l=="number"))if(typeof l=="string"){o=A.T(l)
l=o}else{if(A.R(l))o=l?1:0
else o=k
l=o}if(n==null||l==null)return k
o=q*2
if(!(o<8))return A.a(s,o)
s[o]=(n+180)/360;++o
m=A.oy(l)
if(!(o<8))return A.a(s,o)
s[o]=m}return s},
pA(a){var s,r,q=t.j
if(q.b(a)){s=J.t(a)
s=s.gk(a)===2&&J.p(s.h(a,0),"literal")}else s=!1
r=s?J.b0(a,1):a
if(!q.b(r)||J.Z(r)!==2)return B.cG
q=J.t(r)
s=A.C(q.h(r,0))
if(s==null)s=0
q=A.C(q.h(r,1))
return new A.G(s,q==null?0:q)},
py(a,b){var s,r
if(t.j.b(a)){s=J.t(a)
s=s.gI(a)&&s.aG(a,new A.k0())}else s=!1
if(s){s=A.c([],t.V)
for(r=J.M(a);r.n();)s.push(A.q(r.gq()))
return s}return A.c([A.q(a==null?b:a)],t.V)},
pz(a,b){var s,r,q,p,o=t.j.b(a)?a:[a],n=t.n,m=A.c([],n)
for(s=J.M(o);s.n();){r=s.gq()
if(typeof r=="number")q=r
else if(typeof r=="string"){p=A.T(r)
q=p}else{if(A.R(r))p=r?1:0
else p=null
q=p}if(q!=null)m.push(q)}return m.length===0?A.c([b],n):m},
u1(a){var s,r,q,p,o,n,m,l=null,k=t.j
if(k.b(a)){s=J.t(a)
s=s.gk(a)===2&&J.p(s.h(a,0),"literal")}else s=!1
r=s?J.b0(a,1):a
if(!k.b(r)||J.Z(r)<2)return l
k=J.t(r)
s=k.gk(r)
q=new Float64Array(s)
for(p=0,o=0;o<s;++o){n=k.h(r,o)
if(!(typeof n=="number"))if(typeof n=="string"){m=A.T(n)
n=m}else{if(A.R(n))m=n?1:0
else m=l
n=m}if(n==null||n<0)return l
if(!(o<s))return A.a(q,o)
q[o]=n
if((o&1)===1)p+=n}return p<=0?l:q},
u2(a){var s,r,q,p,o,n,m
A:{s=t.j
r=s.b(a)
q=null
p=!1
o=!1
if(r){n=J.t(a)
if(n.gk(a)===2){p="literal"===n.h(a,0)
if(p){q=n.h(a,1)
s=s.b(q)}else s=o}else s=o}else s=o
if(s){s=p?q:J.b0(a,1)
t.W.a(s)
break A}if(r){s=a
break A}s=B.W
break A}r=A.c([],t.s)
for(s=J.M(s);s.n();){m=s.gq()
if(typeof m=="string")r.push(m)}return r},
u3(a){if(B.d.u(a,"black")||B.d.u(a,"heavy"))return 900
if(B.d.u(a,"extrabold")||B.d.u(a,"extra bold"))return 800
if(B.d.u(a,"semibold")||B.d.u(a,"semi bold")||B.d.u(a,"demi"))return 600
if(B.d.u(a,"bold"))return 700
if(B.d.u(a,"medium"))return 500
if(B.d.u(a,"light"))return 300
if(B.d.u(a,"thin"))return 100
return 400},
l2:function l2(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
eX:function eX(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
hc:function hc(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){var _=this
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
_.ay=null
_.ch=p
_.CW=q},
jZ:function jZ(){},
jY:function jY(){},
k3:function k3(a,b){this.a=a
this.b=b},
jU:function jU(a,b){this.a=a
this.b=b},
jX:function jX(a,b){this.a=a
this.b=b},
jV:function jV(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jW:function jW(){},
k_:function k_(a,b,c,d,e,f,g,h,i,j,k){var _=this
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
k2:function k2(a,b){this.a=a
this.b=b},
k1:function k1(a,b,c){this.a=a
this.b=b
this.c=c},
k0:function k0(){},
pd(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){return new A.e1(m,g,h,b,j,i)},
t4(a,b,c){var s,r,q,p,o=a==null?B.c4:a,n=t.n,m=A.c([],n)
if(t.j.b(o)){s=J.t(o)
s=s.gk(o)>4&&J.p(s.h(o,0),"interpolate")&&B.f.aa(s.h(o,1),null)==='["linear"]'&&B.f.aa(s.h(o,2),null)==='["heatmap-density"]'}else s=!1
if(s)for(s=J.t(o),r=3;r+1<s.gk(o);r+=2){q=s.h(o,r)
if(!(typeof q=="number"))if(typeof q=="string"){p=A.T(q)
q=p}else{if(A.R(q))p=q?1:0
else p=null
q=p}if(q!=null)B.a.l(m,B.c.F(q,0,1))}if(m.length<2){B.a.a2(m)
n=A.c([],n)
for(r=0;r<=8;++r)n.push(r/8)
B.a.P(m,n)}A.q(o)
return new A.j0()},
u4(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=B.f.aa(a,null),b=a.h(0,"source")
b.toString
A.Q(b)
s=a.h(0,"sourceLayer")
s.toString
A.S(s)
r=A.on(a.h(0,"filter"))
q=a.h(0,"text")
A:{if(q==null){p=new A.k6()
break A}p=A.i1(q)
break A}o=a.h(0,"icon")
B:{if(o==null){n=null
break B}n=A.i1(o)
break B}m=A.q(a.h(0,"placement"))
l=a.h(0,"spacing")
l.toString
A.aa(l)
k=J.p(a.h(0,"textUpright"),!0)
j=J.p(a.h(0,"iconUpright"),!0)
i=a.h(0,"minZoom")
i.toString
A.aa(i)
h=a.h(0,"maxZoom")
h.toString
A.aa(h)
g=a.h(0,"sortKey")
C:{if(g==null){f=null
break C}f=A.q(g)
break C}e=a.h(0,"iconRotate")
e.toString
A.aa(e)
d=a.h(0,"paintKeys")
d.toString
return new A.k5(c,b,s,r,p,n,m,l,k,j,i,h,f,e,J.f5(t.j.a(d),t.N))},
hk(a){var s,r,q=a.h(0,"bounds"),p=A.C(a.h(0,"minzoom"))
p=p==null?null:B.c.M(p)
if(p==null)p=0
if(t.j.b(q)){s=J.t(q)
s=s.gk(q)===4&&s.aG(q,new A.kk())}else s=!1
if(s){s=A.c([],t.n)
for(r=J.M(q);r.n();)s.push(A.aa(r.gq()))}else s=null
return new A.kj(p,s,J.p(a.h(0,"scheme"),"tms"))},
c0:function c0(a,b){this.a=a
this.b=b},
iD:function iD(a,b,c){this.a=a
this.b=b
this.c=c},
dQ:function dQ(a,b){this.b=a
this.d=b},
c_:function c_(a,b,c,d,e,f,g,h,i,j,k,l,m){var _=this
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
_.at=30
_.ax=0},
cS:function cS(a,b){this.a=a
this.b=b},
b3:function b3(){},
fS:function fS(){},
bF:function bF(a,b,c,d,e,f){var _=this
_.cx=a
_.cy=b
_.a=c
_.b=d
_.c=e
_.d=f},
e1:function e1(a,b,c,d,e,f){var _=this
_.cy=a
_.fx=b
_.a=c
_.b=d
_.c=e
_.d=f},
dJ:function dJ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
cY:function cY(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
j0:function j0(){},
k5:function k5(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
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
k6:function k6(){},
hf:function hf(a,b,c,d,e,f,g,h,i,j,k){var _=this
_.a=a
_.b=b
_.c=c
_.w=d
_.y=e
_.z=f
_.Q=g
_.as=h
_.at=i
_.dy=j
_.x1=k},
kj:function kj(a,b,c){this.a=a
this.b=b
this.c=c},
kk:function kk(){},
kl:function kl(a){this.a=a},
km:function km(a){this.a=a},
dc:function dc(){},
bI:function bI(a,b,c,d){var _=this
_.e=a
_.f=b
_.r=c
_.c=d},
ev:function ev(a,b){this.r=a
this.c=b},
es:function es(){},
k4:function k4(a,b,c,d,e,f){var _=this
_.y=a
_.z=b
_.Q=c
_.as=d
_.ax=e
_.CW=f},
pG(a,b,c){var s=new Float32Array(0),r=new Float32Array(0),q=new Float32Array(2048),p=new Float32Array(0)
return new A.kG(a,b,c,s,r,q,p,new Uint16Array(4096),A.c([],t.bw))},
cc:function cc(a,b){this.a=a
this.b=b},
e6:function e6(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
kG:function kG(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.y=_.x=0
_.z=i},
iI:function iI(a){this.a=a},
jd:function jd(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.f=_.e=_.d=0
_.r=null
_.w=0
_.x=d},
u6(a,b){var s,r=a.b.as
if(r==null)return 50
s=r.$1(b)
return typeof s=="number"?B.b.F(B.c.ah(s),0,4095):50},
ql(a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1={},a2=A.c([],t.mr),a3=t.n
a1.a=A.c([],a3)
s=new A.n5(a1,a2)
for(r=a4.length,q=2;q<r;q+=2){p=a4[q-2]
o=a4[q-1]
n=a4[q]
m=q+1
if(!(m<r))return A.a(a4,m)
l=n-p
k=a4[m]-o
for(m=[new A.G(-l,p),new A.G(l,4096-p),new A.G(-k,o),new A.G(k,4096-o)],j=0,i=1,h=!0,g=0;g<4;++g){f=m[g]
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
m=m[a0]!==b||B.a.ga0(m)!==a}else m=!0
if(m){s.$0()
B.a.P(a1.a,A.c([b,a],a3))}B.a.P(a1.a,A.c([p+l*i,o+k*i],a3))
if(i<1)s.$0()}s.$0()
return a2},
od(a){var s,r,q,p,o,n
for(s=a.length,r=0,q=2;q<s;q+=2){p=a[q]-a[q-2]
o=q+1
if(!(o<s))return A.a(a,o)
n=a[o]-a[q-1]
r+=Math.sqrt(p*p+n*n)}return r},
qr(a,b,c,d,e,f){var s,r,q,p=a.length
if(0>=p)return A.a(a,0)
s=a[0]
r=!0
if(s!==0)if(s!==4096){if(1>=p)return A.a(a,1)
p=a[1]
p=p===0||p===4096
r=p}p=b/4
if(b-c<p)b=c+p
q=A.of(a,r?B.c.Y(b/2,b):B.c.Y(c/2+d,b),b,c,e,f)
if(q.length===0&&!r)return A.of(a,A.od(a)/2,b,c,e,f)
return q},
qk(a,b,c,d){var s=A.od(a)/2,r=A.of(a,s,1/0,0,c,d),q=A.L(r),p=q.i("cr<1>")
r=A.a7(new A.cr(r,q.i("H(1)").a(new A.n4(b,s)),p),p.i("f.E"))
return r},
of(a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=a5/2,c=A.od(a2),b=A.c([],t.eL),a=isFinite(a4),a0=a?a3-a4:a3,a1=a?a4:0
a=!a
s=a2.length
r=0
q=!1
p=2
for(;;){if(!(p<s&&!q))break
o=p-2
if(!(o<s))return A.a(a2,o)
n=a2[o]
o=p-1
if(!(o<s))return A.a(a2,o)
m=a2[o]
if(!(p<s))return A.a(a2,p)
l=a2[p]
o=p+1
if(!(o<s))return A.a(a2,o)
k=l-n
o=a2[o]-m
j=Math.sqrt(k*k+o*o)
for(i=r+j;h=a0+a1,h<i;a0=h){g=(h-r)/j
f=B.c.av(n+k*g)
e=B.c.av(m+o*g)
if(f>=0&&f<4096&&e>=0&&e<4096&&h-d>=0&&h+d<=c&&A.uQ(a2,B.b.U(p,2)-1,f,e,a5,a6,a7))B.a.l(b,new A.dk(f,e,Math.atan2(o,k)))
if(a){a0=h
q=!0
break}}p+=2
r=i}return b},
uQ(a,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
if(a3===0)return!0
s=new A.lm(a)
r=new A.ln(a)
q=new A.ll()
p=a0+1
for(o=-a3/2,n=a2,m=a1,l=0;l>o;){--p
if(p<0)return!1
k=q.$4(s.$1(p),r.$1(p),m,n)
if(typeof k!=="number")return A.ai(k)
l-=k
m=s.$1(p)
n=r.$1(p)}j=p+1
o=q.$4(s.$1(p),r.$1(p),s.$1(j),r.$1(j))
if(typeof o!=="number")return A.ai(o)
l+=o
i=A.c([],t.fU)
h=a.length/2|0
for(o=a3/2,p=j,g=0;l<o;p=j){j=p+1
if(j>=h)return!1
k=r.$1(p)
f=p-1
e=r.$1(f)
if(typeof k!=="number")return k.aM()
if(typeof e!=="number")return A.ai(e)
d=s.$1(p)
f=s.$1(f)
if(typeof d!=="number")return d.aM()
if(typeof f!=="number")return A.ai(f)
c=Math.atan2(k-e,d-f)
f=r.$1(j)
d=r.$1(p)
if(typeof f!=="number")return f.aM()
if(typeof d!=="number")return A.ai(d)
e=s.$1(j)
k=s.$1(p)
if(typeof e!=="number")return e.aM()
if(typeof k!=="number")return A.ai(k)
b=Math.abs(B.c.Y(c-Math.atan2(f-d,e-k)+9.42477796076938,6.283185307179586)-3.141592653589793)
B.a.l(i,new A.G(l,b))
g+=b
while(l-B.a.gv(i).a>a4)g-=B.a.au(i,0).b
if(g>a5)return!1
k=q.$4(s.$1(p),r.$1(p),s.$1(j),r.$1(j))
if(typeof k!=="number")return A.ai(k)
l+=k}return!0},
cJ:function cJ(a,b,c){this.a=a
this.b=b
this.c=c},
bc:function bc(a,b,c,d,e,f,g,h,i,j){var _=this
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
cK:function cK(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
aF:function aF(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
k8:function k8(a,b,c,d,e,f,g,h,i,j,k,l,m,n){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=!1
_.f=e
_.r=f
_.w=g
_.x=h
_.y=i
_.z=j
_.Q=k
_.as=l
_.at=m
_.ax=n},
kf:function kf(a,b){this.a=a
this.b=b},
kh:function kh(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
kg:function kg(a,b,c){this.a=a
this.b=b
this.c=c},
ki:function ki(a,b,c){this.a=a
this.b=b
this.c=c},
kc:function kc(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
kd:function kd(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
ke:function ke(){},
ka:function ka(a,b,c){this.a=a
this.b=b
this.c=c},
k9:function k9(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
kb:function kb(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
n5:function n5(a,b){this.a=a
this.b=b},
n4:function n4(a,b){this.a=a
this.b=b},
lm:function lm(a){this.a=a},
ln:function ln(a){this.a=a},
ll:function ll(){},
b5:function b5(a,b,c){this.a=a
this.b=b
this.c=c},
kp:function kp(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
kq:function kq(){},
kr:function kr(){},
bE:function bE(a){this.a=a
this.b=0},
j3:function j3(a){this.a=a
this.b=0},
i2(a,b,c){return A.wM(a,b,c)},
wM(b5,b6,b7){var s=0,r=A.au(t.o),q,p=2,o=[],n=[],m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4
var $async$i2=A.av(function(b8,b9){if(b8===1){o.push(b9)
s=p}for(;;)switch(s){case 0:b3={}
b4=b5.length
if(0>=b4){q=A.a(b5,0)
s=1
break}j=b5[0]
j.toString
A.S(j)
if(1>=b4){q=A.a(b5,1)
s=1
break}i=A.bx(b5[1])
if(2>=b4){q=A.a(b5,2)
s=1
break}h=b5[2]
h.toString
A.S(h)
if(3>=b4){q=A.a(b5,3)
s=1
break}b4=b5[3]
b4.toString
g=t.f
f=t.N
b4=g.a(b4).bo(0,f,f)
if(4>=b5.length){q=A.a(b5,4)
s=1
break}e=b5[4]
e.toString
e=g.a(e).bo(0,f,t.O)
if(5>=b5.length){q=A.a(b5,5)
s=1
break}g=t.g
d=g.a(b5[5])
d=d==null?null:J.f5(d,f)
c=b5.length
if(6>=c){q=A.a(b5,6)
s=1
break}b=b5[6]
b.toString
A.aa(b)
if(7>=c){q=A.a(b5,7)
s=1
break}a=b5[7]
a.toString
A.Q(a)
if(c>8){c=g.a(b5[8])
c=c==null?null:J.f5(c,t.p)}else c=null
if(b5.length>9){g=g.a(b5[9])
g=g==null?null:J.f5(g,f)}else g=null
a0=b5.length>10&&J.p(b5[10],!0)
a1=A.u_(e,d,b).h1()
a2=a1.as
if(!(a>=0&&a<a2.length)){q=A.a(a2,a)
s=1
break}a3=a2[a]
a4=a1.CW
a2=c==null
if(a2&&a4!=null){a5=t.S
a6=new A.iV(a4,h,b4,new A.nz(),A.c([],t.s),A.A(f,a5),A.c([],t.iE),A.bj(a5),A.bj(a5))}else a6=null
a2=a2?null:A.rR(c,g)
a5=t.L
a7=new Float64Array(4096)
a8=t.t
a9=A.c([],a8)
b0=A.c([],a8)
b1=A.c([],a8)
b2=new A.k8(a1,a,a2,a6,a0,A.A(f,a5),A.A(f,a5),new A.z(B.k),new A.fz(a7,a9),b0,b1,new Float64Array(4096),A.c([],a8),A.A(f,t.i))
b2.e4(a1,a2,a0,a6,a)
m=new A.ny(b6)
f=b3.a=b3.b=null
if(a3 instanceof A.bI)b3.b=new A.nA(a3.e,new A.nF(a3),new A.ee(),new A.kB(a0,g,c,j,new A.ko(i,h,b4),e,d,b,a)).$0()
else if(a3 instanceof A.ev){h=A.vV(j)
g=new A.ee()
e=B.d.aB(j,"pmtiles://")
if(e)f=new A.jr(B.d.aN(j,10),b4,g,A.A(t.S,t.je))
b3.a=new A.kp(j,a3.r,"tiles-"+h,g,".pbf",b4,f,i)}l=new A.nD(b3,new A.nC(b3,new A.nB(b3,A.A(t.S,t.p))),b2,a6,a1,a)
b4=new A.cC(A.f2(b7,"stream",t.K),t.b6)
p=3
j=t.W,i=t.o
case 6:s=8
return A.U(b4.n(),$async$i2)
case 8:if(!b9){s=7
break}k=b4.gq()
h=k
h.toString
l.$1(A.u8(j.a(h))).hR(m,i)
s=6
break
case 7:n.push(5)
s=4
break
case 3:n=[2]
case 4:p=2
s=9
return A.U(b4.aU(),$async$i2)
case 9:s=n.pop()
break
case 5:case 1:return A.as(q,r)
case 2:return A.ar(o.at(-1),r)}})
return A.at($async$i2,r)},
qb(a){var s,r=A.c([],t.i9),q=a==null?B.w:a,p=q.length,o=0
for(;o<q.length;q.length===p||(0,A.i)(q),++o){s=q[o]
r.push(new A.fg(s.a,s.b,s.d))}return r},
nz:function nz(){},
ny:function ny(a){this.a=a},
nF:function nF(a){this.a=a},
nA:function nA(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
nB:function nB(a,b){this.a=a
this.b=b},
nC:function nC(a,b){this.a=a
this.b=b},
nD:function nD(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
nE:function nE(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
wB(){var s,r={},q=v.G
r.a=null
r=new A.nw(r,q)
if(typeof r=="function")A.k(A.aI("Attempting to rewrap a JS function.",null))
s=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.uT,r)
s[$.oA()]=r
q.onmessage=s},
nw:function nw(a,b){this.a=a
this.b=b},
nv:function nv(a){this.a=a},
nL(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.aq(b,c,B.b.a5(a.byteLength,s))
return J.oG(B.j.gai(a),a.byteOffset+b*s,(c-b)*s)},
kw(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.aq(b,c,B.b.a5(a.byteLength,s))
return J.oI(B.j.gai(a),a.byteOffset+b*s,(c-b)*s)},
fx(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.aq(b,c,B.b.a5(a.byteLength,s))-b)*s
if(B.b.Y(r,4)!==0)throw A.e(A.aI("The number of bytes to view must be a multiple of 4",null))
return J.oH(B.l.gai(a),a.byteOffset+b*s,B.b.U(r,4))},
cV(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.aq(b,c,B.b.a5(a.byteLength,s))-b)*s
if(B.b.Y(r,8)!==0)throw A.e(A.aI("The number of bytes to view must be a multiple of 8",null))
return J.r_(B.m.gai(a),a.byteOffset+b*s,B.b.U(r,8))},
qw(a){return v.mangledGlobalNames[a]},
wK(a){throw A.a5(A.th(a),new Error())},
r(){throw A.a5(A.tj(""),new Error())},
ow(){throw A.a5(A.ti(""),new Error())},
wE(a){return Math.sqrt(A.aa(a))},
wD(a){return Math.sin(A.aa(a))},
w0(a){return Math.cos(A.aa(a))},
wI(a){return Math.tan(a)},
vO(a){return Math.acos(a)},
vP(a){return Math.asin(a)},
vU(a){return Math.atan(a)},
wn(a){return Math.log(a)},
af(a,b){var s,r,q,p,o=a.length,n=(o/3|0)-1
for(s=0;s<=n;){r=B.b.J(s+n,1)
q=r*3
if(!(q<o))return A.a(a,q)
if(b<a[q])n=r-1
else{p=q+1
if(!(p<o))return A.a(a,p)
if(b>a[p])s=r+1
else{p=q+2
if(!(p<o))return A.a(a,p)
return a[p]}}}return 0},
co(a){return a},
u5(a){var s,r,q,p
for(s=a.length,r=0,q=0;q<4;++q){if(q<s){if(!(q<s))return A.a(a,q)
p=a.charCodeAt(q)}else p=32
r=(r<<8|p)>>>0}return r},
ay(a){return A.jT(A.c([B.b.J(a,24)&255,B.b.J(a,16)&255,B.b.J(a,8)&255,a&255],t.t),0,null)},
oy(a){var s=B.c.F(a,-85.0511,85.0511)*3.141592653589793/180
return(1-Math.log(Math.tan(s)+1/Math.cos(s))/3.141592653589793)/2},
ox(a){var s,r,q,p,o,n,m
if(!t.j.b(a))return null
s=A.c([],t.s)
for(r=J.oN(a,t.N),q=J.M(r.a),r=r.$ti,p=new A.cs(q,r.i("cs<1>")),r=r.c;p.n();){o=r.a(q.gq())
if(B.d.u(o,"{s}"))for(n=0;n<3;++n){m=B.c5[n]
s.push(A.nx(o,"{s}",m,0))}else s.push(o)}return s.length===0?null:B.a.a7(s," ")},
wL(a,b,c,d){var s,r,q,p,o,n=a.split(" "),m=n.length,l=B.b.Y(c+d,m),k=A.c([],t.s)
for(s=""+d,r=""+c,q=""+b,p=0;p<m;++p){o=n[B.b.Y(l+p,m)]
o=A.nx(o,"{z}",q,0)
o=A.nx(o,"{x}",r,0)
k.push(A.nx(o,"{y}",s,0))}return k},
ne(a,b,c,d,e,f){return A.wb(a,b,c,d,e,f)},
wb(a,b,c,d,e,f){var s=0,r=A.au(t.l_),q,p=2,o=[],n,m,l,k,j,i,h,g
var $async$ne=A.av(function(a0,a1){if(a0===1){o.push(a1)
s=p}for(;;)switch(s){case 0:i=A.wL(b,c,d,e)
h=0
case 3:n=J.p(h,J.Z(i)-1)
p=6
s=9
return A.U(a.bx(J.b0(i,h),f),$async$ne)
case 9:m=a1
l=m.a
if(n||J.p(l,200)||J.p(l,204)||J.p(l,404)){k=new A.G(J.b0(i,h),m)
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
if(typeof k!=="number"){q=k.b3()
s=1
break}h=k+1
s=3
break
case 4:case 1:return A.as(q,r)
case 2:return A.ar(o.at(-1),r)}})
return A.at($async$ne,r)},
vV(a){var s,r,q,p
for(s=new A.cN(a),r=t.gS,s=new A.V(s,s.gk(0),r.i("V<x.E>")),r=r.i("x.E"),q=2166136261;s.n();){p=s.d
q=(q^(p==null?r.a(p):p))>>>0
q=q+(q<<1>>>0)+(q<<4>>>0)+(q<<7>>>0)+(q<<8>>>0)+(q<<24>>>0)>>>0}return B.b.b0(q,36)},
oe(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g=null,f=new A.bo(""),e=[null]
for(s=J.M(a),r=t.e7,q=t.f,p=t.p,o=t.kI,n=t.hM,m=t.pk;s.n();){l=s.gq()
if(l==null){f.a+="n"
e.push(g)
continue}k=A.R(l)
j=k?l:g
if(k){f.a+="b"
e.push(j)
continue}k=typeof l=="string"
j=k?l:g
if(k){f.a+="s"
e.push(j)
continue}k=A.dq(l)
j=k?l:g
if(k){f.a+="i"
e.push(j)
continue}k=typeof l=="number"
j=k?l:g
if(k){f.a+="d"
e.push(j)
continue}k=m.b(l)
j=k?l:g
if(k){f.a+="F"
e.push(A.lT(j,j,b))
continue}k=n.b(l)
j=k?l:g
if(k){f.a+="S"
e.push(A.lT(j,j,b))
continue}k=o.b(l)
j=k?l:g
if(k){f.a+="D"
e.push(A.lT(j,j,b))
continue}k=p.b(l)
j=k?l:g
if(k){f.a+="U"
e.push(A.lT(j,j,b))
continue}k=q.b(l)
j=k?l:g
if(k){f.a+="m"
k=[]
for(i=j.gaj(),i=i.gt(i);i.n();){h=i.gq()
B.a.P(k,[h.a,h.b])}e.push(A.oe(k,b))
continue}k=r.b(l)
j=k?l:g
if(k){f.a+="l"
e.push(A.oe(j,b))
continue}throw A.e(A.aI("A "+J.oL(l).p(0)+" cannot be sent to a worker",g))}s=f.a
B.a.m(e,0,s.charCodeAt(0)==0?s:s)
return e},
lT(a,b,c){if(a.byteOffset===0&&a.byteLength===J.r3(J.oK(a))&&a.byteLength>0)B.a.l(c,t.a.a(J.oK(a)))
return b},
oc(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(0<0||0>=a.length)return A.a(a,0)
s=a[0]
s.toString
A.S(s)
r=s.length
q=A.N(r,null,!0,t.O)
for(p=t.J,o=t.hD,n=t.g_,m=t.nZ,l=t.bi,k=0;k<r;k=j){j=k+1
if(!(j>=0&&j<a.length))return A.a(a,j)
i=a[j]
h=s[k]
A:{if("n"===h){g=null
break A}if("b"===h){i.toString
A.o6(i)
g=i
break A}if("s"===h){i.toString
A.S(i)
g=i
break A}if("i"===h){i.toString
i=A.Q(A.dn(i))
g=i
break A}if("d"===h){i.toString
A.dn(i)
g=i
break A}if("F"===h){i.toString
l.a(i)
g=i
break A}if("S"===h){i.toString
m.a(i)
g=i
break A}if("D"===h){i.toString
n.a(i)
g=i
break A}if("U"===h){i.toString
o.a(i)
g=i
break A}if("m"===h){i.toString
g=A.vr(A.oc(p.a(i)))
break A}i.toString
g=A.oc(p.a(i))
break A}B.a.m(q,k,g)}return q},
vr(a){var s,r,q,p,o=t.O
o=A.A(o,o)
for(s=0;r=a.length,s<r;s+=2){q=a[s]
p=s+1
if(!(p<r))return A.a(a,p)
o.m(0,q,a[p])}return o},
wp(){return A.wB()}},B={}
var w=[A,J,B]
var $={}
A.nR.prototype={}
J.fF.prototype={
D(a,b){return a===b},
gO(a){return A.d5(a)},
p(a){return"Instance of '"+A.h2(a)+"'"},
gS(a){return A.b8(A.o9(this))}}
J.dW.prototype={
p(a){return String(a)},
cq(a,b){A.o6(b)
return b&&a},
gO(a){return a?519018:218159},
gS(a){return A.b8(t.y)},
$iJ:1,
$iH:1}
J.dY.prototype={
D(a,b){return null==b},
p(a){return"null"},
gO(a){return 0},
$iJ:1,
$ia0:1}
J.e_.prototype={$iK:1}
J.bL.prototype={
gO(a){return 0},
gS(a){return B.d_},
p(a){return String(a)}}
J.h_.prototype={}
J.cq.prototype={}
J.bi.prototype={
p(a){var s=a[$.qy()]
if(s==null)s=a[$.oA()]
if(s==null)return this.e2(a)
return"JavaScript function for "+J.ba(s)},
$ic7:1}
J.d_.prototype={
gO(a){return 0},
p(a){return String(a)}}
J.d0.prototype={
gO(a){return 0},
p(a){return String(a)}}
J.m.prototype={
bn(a,b){return new A.bd(a,A.L(a).i("@<1>").E(b).i("bd<1,2>"))},
l(a,b){A.L(a).c.a(b)
a.$flags&1&&A.y(a,29)
a.push(b)},
au(a,b){a.$flags&1&&A.y(a,"removeAt",1)
if(b<0||b>=a.length)throw A.e(A.pr(b,null))
return a.splice(b,1)[0]},
dC(a,b,c){var s,r
A.L(a).i("f<1>").a(c)
a.$flags&1&&A.y(a,"insertAll",2)
A.tK(b,0,a.length,"index")
if(!t.U.b(c))c=J.r9(c)
s=J.Z(c)
a.length=a.length+s
r=b+s
this.a1(a,r,a.length,a,b)
this.Z(a,b,r,c)},
P(a,b){var s
A.L(a).i("f<1>").a(b)
a.$flags&1&&A.y(a,"addAll",2)
if(Array.isArray(b)){this.e8(a,b)
return}for(s=J.M(b);s.n();)a.push(s.gq())},
e8(a,b){var s,r
t.b.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.e(A.a6(a))
for(r=0;r<s;++r)a.push(b[r])},
a2(a){a.$flags&1&&A.y(a,"clear","clear")
a.length=0},
W(a,b){var s,r
A.L(a).i("~(1)").a(b)
s=a.length
for(r=0;r<s;++r){b.$1(a[r])
if(a.length!==s)throw A.e(A.a6(a))}},
aI(a,b,c){var s=A.L(a)
return new A.ao(a,s.E(c).i("1(2)").a(b),s.i("@<1>").E(c).i("ao<1,2>"))},
a7(a,b){var s,r=A.N(a.length,"",!1,t.N)
for(s=0;s<a.length;++s)this.m(r,s,A.w(a[s]))
return r.join(b)},
ce(a){return this.a7(a,"")},
dU(a,b){return A.cn(a,0,A.f2(b,"count",t.S),A.L(a).c)},
T(a,b){return A.cn(a,b,null,A.L(a).c)},
dB(a,b,c,d){var s,r,q
d.a(b)
A.L(a).E(d).i("1(1,2)").a(c)
s=a.length
for(r=b,q=0;q<s;++q){r=c.$2(r,a[q])
if(a.length!==s)throw A.e(A.a6(a))}return r},
L(a,b){if(!(b>=0&&b<a.length))return A.a(a,b)
return a[b]},
G(a,b,c){if(b<0||b>a.length)throw A.e(A.a3(b,0,a.length,"start",null))
if(c==null)c=a.length
else if(c<b||c>a.length)throw A.e(A.a3(c,b,a.length,"end",null))
if(b===c)return A.c([],A.L(a))
return A.c(a.slice(b,c),A.L(a))},
a3(a,b){return this.G(a,b,null)},
b4(a,b,c){A.aq(b,c,a.length)
return A.cn(a,b,c,A.L(a).c)},
gv(a){if(a.length>0)return a[0]
throw A.e(A.aB())},
ga0(a){var s=a.length
if(s>0)return a[s-1]
throw A.e(A.aB())},
a1(a,b,c,d,e){var s,r,q,p,o
A.L(a).i("f<1>").a(d)
a.$flags&2&&A.y(a,5)
A.aq(b,c,a.length)
s=c-b
if(s===0)return
A.ap(e,"skipCount")
if(t.j.b(d)){r=d
q=e}else{r=J.cG(d,e).aJ(0,!1)
q=0}p=J.t(r)
if(q+s>p.gk(r))throw A.e(A.p6())
if(q<b)for(o=s-1;o>=0;--o)a[b+o]=p.h(r,q+o)
else for(o=0;o<s;++o)a[b+o]=p.h(r,q+o)},
Z(a,b,c,d){return this.a1(a,b,c,d,0)},
aG(a,b){var s,r
A.L(a).i("H(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.e(A.a6(a))}return!0},
aA(a,b){var s,r,q,p,o,n=A.L(a)
n.i("b(1,1)?").a(b)
a.$flags&2&&A.y(a,"sort")
s=a.length
if(s<2)return
if(b==null)b=J.vb()
if(s===2){r=a[0]
q=a[1]
n=b.$2(r,q)
if(typeof n!=="number")return n.i1()
if(n>0){a[0]=q
a[1]=r}return}p=0
if(n.c.b(null))for(o=0;o<a.length;++o)if(a[o]===void 0){a[o]=null;++p}a.sort(A.dw(b,2))
if(p>0)this.fm(a,p)},
aK(a){return this.aA(a,null)},
fm(a,b){var s,r=a.length
for(;s=r-1,r>0;r=s)if(a[s]===null){a[s]=void 0;--b
if(b===0)break}},
aH(a,b,c){var s,r=a.length
if(c>=r)return-1
if(c<0)c=0
for(s=c;s<r;++s){if(!(s<a.length))return A.a(a,s)
if(J.p(a[s],b))return s}return-1},
aW(a,b){return this.aH(a,b,0)},
u(a,b){var s
for(s=0;s<a.length;++s)if(J.p(a[s],b))return!0
return!1},
gA(a){return a.length===0},
gI(a){return a.length!==0},
p(a){return A.nP(a,"[","]")},
aJ(a,b){var s=A.c(a.slice(0),A.L(a))
return s},
dV(a){return this.aJ(a,!0)},
dW(a){return A.tl(a,A.L(a).c)},
gt(a){return new J.aO(a,a.length,A.L(a).i("aO<1>"))},
gO(a){return A.d5(a)},
gk(a){return a.length},
h(a,b){A.Q(b)
if(!(b>=0&&b<a.length))throw A.e(A.na(a,b))
return a[b]},
m(a,b,c){A.L(a).c.a(c)
a.$flags&2&&A.y(a)
if(!(b>=0&&b<a.length))throw A.e(A.na(a,b))
a[b]=c},
cp(a,b){return new A.bs(a,b.i("bs<0>"))},
gS(a){return A.b8(A.L(a))},
$iu:1,
$if:1,
$il:1,
hh(a,b){return this.gv(a).$1(b)},
hu(a,b){return this.ga0(a).$1(b)}}
J.fH.prototype={
hU(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.h2(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.j6.prototype={}
J.aO.prototype={
gq(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.i(q)
throw A.e(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$iE:1}
J.cZ.prototype={
ac(a,b){var s
A.aa(b)
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gbr(b)
if(this.gbr(a)===s)return 0
if(this.gbr(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gbr(a){return a===0?1/a<0:a<0},
M(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.e(A.aK(""+a+".toInt()"))},
c2(a){var s,r
if(a>=0){if(a<=2147483647){s=a|0
return a===s?s:s+1}}else if(a>=-2147483648)return a|0
r=Math.ceil(a)
if(isFinite(r))return r
throw A.e(A.aK(""+a+".ceil()"))},
a6(a){var s,r
if(a>=0){if(a<=2147483647)return a|0}else if(a>=-2147483648){s=a|0
return a===s?s:s-1}r=Math.floor(a)
if(isFinite(r))return r
throw A.e(A.aK(""+a+".floor()"))},
ah(a){if(a>0){if(a!==1/0)return Math.round(a)}else if(a>-1/0)return 0-Math.round(0-a)
throw A.e(A.aK(""+a+".round()"))},
av(a){if(a<0)return-Math.round(-a)
else return Math.round(a)},
F(a,b,c){if(this.ac(b,c)>0)throw A.e(A.cE(b))
if(this.ac(a,b)<0)return b
if(this.ac(a,c)>0)return c
return a},
hT(a,b){var s
if(b<0||b>20)throw A.e(A.a3(b,0,20,"fractionDigits",null))
s=a.toFixed(b)
if(a===0&&this.gbr(a))return"-"+s
return s},
b0(a,b){var s,r,q,p,o
if(b<2||b>36)throw A.e(A.a3(b,2,36,"radix",null))
s=a.toString(b)
r=s.length
q=r-1
if(!(q>=0))return A.a(s,q)
if(s.charCodeAt(q)!==41)return s
p=/^([\da-z]+)(?:\.([\da-z]+))?\(e\+(\d+)\)$/.exec(s)
if(p==null)A.k(A.aK("Unexpected toString result: "+s))
r=p.length
if(1>=r)return A.a(p,1)
s=p[1]
if(3>=r)return A.a(p,3)
o=+p[3]
r=p[2]
if(r!=null){s+=r
o-=r.length}return s+B.d.ao("0",o)},
p(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gO(a){var s,r,q,p,o=a|0
if(a===o)return o&536870911
s=Math.abs(a)
r=Math.log(s)/0.6931471805599453|0
q=Math.pow(2,r)
p=s<1?s/q:q/s
return((p*9007199254740992|0)+(p*3542243181176521|0))*599197+r*1259&536870911},
Y(a,b){var s=a%b
if(s===0)return 0
if(s>0)return s
if(b<0)return s-b
else return s+b},
a5(a,b){if((a|0)===a)if(b>=1||b<-1)return a/b|0
return this.da(a,b)},
U(a,b){return(a|0)===a?a/b|0:this.da(a,b)},
da(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.e(A.aK("Result of truncating division is "+A.w(s)+": "+A.w(a)+" ~/ "+b))},
ad(a,b){if(b<0)throw A.e(A.cE(b))
return b>31?0:a<<b>>>0},
ab(a,b){return b>31?0:a<<b>>>0},
J(a,b){var s
if(a>0)s=this.bh(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
fA(a,b){if(0>b)throw A.e(A.cE(b))
return this.bh(a,b)},
bh(a,b){return b>31?0:a>>>b},
gS(a){return A.b8(t.cZ)},
$iaQ:1,
$id:1,
$iaj:1}
J.dX.prototype={
gS(a){return A.b8(t.S)},
$iJ:1,
$ib:1}
J.fI.prototype={
gS(a){return A.b8(t.i)},
$iJ:1}
J.bK.prototype={
bZ(a,b,c){var s=b.length
if(c>s)throw A.e(A.a3(c,0,s,null,null))
return new A.hW(b,a,c)},
bY(a,b){return this.bZ(a,b,0)},
dA(a,b){var s=b.length,r=a.length
if(s>r)return!1
return b===this.aN(a,r-s)},
cv(a,b){var s
if(typeof b=="string")return A.c(a.split(b),t.s)
else{if(b instanceof A.dZ){s=b.e
s=!(s==null?b.e=b.eC():s)}else s=!1
if(s)return A.c(a.split(b.b),t.s)
else return this.eG(a,b)}},
eG(a,b){var s,r,q,p,o,n,m=A.c([],t.s)
for(s=J.qZ(b,a),s=s.gt(s),r=0,q=1;s.n();){p=s.gq()
o=p.gcw()
n=p.gc8()
q=n-o
if(q===0&&r===o)continue
B.a.l(m,this.a4(a,r,o))
r=n}if(r<a.length||q>0)B.a.l(m,this.aN(a,r))
return m},
aB(a,b){var s=b.length
if(s>a.length)return!1
return b===a.substring(0,s)},
a4(a,b,c){return a.substring(b,A.aq(b,c,a.length))},
aN(a,b){return this.a4(a,b,null)},
bv(a){var s,r,q,p=a.trim(),o=p.length
if(o===0)return p
if(0>=o)return A.a(p,0)
if(p.charCodeAt(0)===133){s=J.tf(p,1)
if(s===o)return""}else s=0
r=o-1
if(!(r>=0))return A.a(p,r)
q=p.charCodeAt(r)===133?J.tg(p,r):o
if(s===0&&q===o)return p
return p.substring(s,q)},
ao(a,b){var s,r
if(0>=b)return""
if(b===1||a.length===0)return a
if(b!==b>>>0)throw A.e(B.ab)
for(s=a,r="";;){if((b&1)===1)r=s+r
b=b>>>1
if(b===0)break
s+=s}return r},
dK(a,b,c){var s=b-a.length
if(s<=0)return a
return this.ao(c,s)+a},
aH(a,b,c){var s
if(c<0||c>a.length)throw A.e(A.a3(c,0,a.length,null,null))
s=a.indexOf(b,c)
return s},
aW(a,b){return this.aH(a,b,0)},
u(a,b){return A.wF(a,b,0)},
ac(a,b){var s
A.S(b)
if(a===b)s=0
else s=a<b?-1:1
return s},
p(a){return a},
gO(a){var s,r,q
for(s=a.length,r=0,q=0;q<s;++q){r=r+a.charCodeAt(q)&536870911
r=r+((r&524287)<<10)&536870911
r^=r>>6}r=r+((r&67108863)<<3)&536870911
r^=r>>11
return r+((r&16383)<<15)&536870911},
gS(a){return A.b8(t.N)},
gk(a){return a.length},
$iJ:1,
$iaQ:1,
$ijn:1,
$iv:1}
A.bV.prototype={
gt(a){return new A.dI(J.M(this.gae()),A.o(this).i("dI<1,2>"))},
gk(a){return J.Z(this.gae())},
gA(a){return J.dA(this.gae())},
gI(a){return J.nJ(this.gae())},
T(a,b){var s=A.o(this)
return A.dH(J.cG(this.gae(),b),s.c,s.y[1])},
L(a,b){return A.o(this).y[1].a(J.f6(this.gae(),b))},
gv(a){return A.o(this).y[1].a(J.i4(this.gae()))},
u(a,b){return J.oJ(this.gae(),b)},
p(a){return J.ba(this.gae())}}
A.dI.prototype={
n(){return this.a.n()},
gq(){return this.$ti.y[1].a(this.a.gq())},
$iE:1}
A.c1.prototype={
gae(){return this.a}}
A.eD.prototype={$iu:1}
A.eB.prototype={
h(a,b){return this.$ti.y[1].a(J.b0(this.a,b))},
m(a,b,c){var s=this.$ti
J.qY(this.a,b,s.c.a(s.y[1].a(c)))},
b4(a,b,c){var s=this.$ti
return A.dH(J.r4(this.a,b,c),s.c,s.y[1])},
a1(a,b,c,d,e){var s=this.$ti
J.r6(this.a,b,c,A.dH(s.i("f<2>").a(d),s.y[1],s.c),e)},
Z(a,b,c,d){return this.a1(0,b,c,d,0)},
$iu:1,
$il:1}
A.bd.prototype={
bn(a,b){return new A.bd(this.a,this.$ti.i("@<1>").E(b).i("bd<1,2>"))},
gae(){return this.a}}
A.c2.prototype={
bo(a,b,c){return new A.c2(this.a,this.$ti.i("@<1,2>").E(b).E(c).i("c2<1,2,3,4>"))},
K(a){return this.a.K(a)},
h(a,b){return this.$ti.i("4?").a(this.a.h(0,b))},
W(a,b){this.a.W(0,new A.ib(this,this.$ti.i("~(3,4)").a(b)))},
ga_(){var s=this.$ti
return A.dH(this.a.ga_(),s.c,s.y[2])},
gaw(){var s=this.$ti
return A.dH(this.a.gaw(),s.y[1],s.y[3])},
gk(a){var s=this.a
return s.gk(s)},
gA(a){var s=this.a
return s.gA(s)},
gI(a){var s=this.a
return s.gI(s)},
gaj(){return this.a.gaj().aI(0,new A.ia(this),this.$ti.i("a2<3,4>"))}}
A.ib.prototype={
$2(a,b){var s=this.a.$ti
s.c.a(a)
s.y[1].a(b)
this.b.$2(s.y[2].a(a),s.y[3].a(b))},
$S(){return this.a.$ti.i("~(1,2)")}}
A.ia.prototype={
$1(a){var s=this.a.$ti
s.i("a2<1,2>").a(a)
return new A.a2(s.y[2].a(a.a),s.y[3].a(a.b),s.i("a2<3,4>"))},
$S(){return this.a.$ti.i("a2<3,4>(a2<1,2>)")}}
A.d1.prototype={
p(a){return"LateInitializationError: "+this.a}}
A.cN.prototype={
gk(a){return this.a.length},
h(a,b){var s=this.a
if(!(b>=0&&b<s.length))return A.a(s,b)
return s.charCodeAt(b)}}
A.nq.prototype={
$0(){var s=new A.F($.D,t.cU)
s.aP(null)
return s},
$S:37}
A.jK.prototype={}
A.u.prototype={}
A.Y.prototype={
gt(a){var s=this
return new A.V(s,s.gk(s),A.o(s).i("V<Y.E>"))},
gA(a){return this.gk(this)===0},
gv(a){if(this.gk(this)===0)throw A.e(A.aB())
return this.L(0,0)},
u(a,b){var s,r=this,q=r.gk(r)
for(s=0;s<q;++s){if(J.p(r.L(0,s),b))return!0
if(q!==r.gk(r))throw A.e(A.a6(r))}return!1},
dj(a,b){var s,r,q=this
A.o(q).i("H(Y.E)").a(b)
s=q.gk(q)
for(r=0;r<s;++r){if(b.$1(q.L(0,r)))return!0
if(s!==q.gk(q))throw A.e(A.a6(q))}return!1},
a7(a,b){var s,r,q,p=this,o=p.gk(p)
if(b.length!==0){if(o===0)return""
s=A.w(p.L(0,0))
if(o!==p.gk(p))throw A.e(A.a6(p))
for(r=s,q=1;q<o;++q){r=r+b+A.w(p.L(0,q))
if(o!==p.gk(p))throw A.e(A.a6(p))}return r.charCodeAt(0)==0?r:r}else{for(q=0,r="";q<o;++q){r+=A.w(p.L(0,q))
if(o!==p.gk(p))throw A.e(A.a6(p))}return r.charCodeAt(0)==0?r:r}},
ce(a){return this.a7(0,"")},
aI(a,b,c){var s=A.o(this)
return new A.ao(this,s.E(c).i("1(Y.E)").a(b),s.i("@<Y.E>").E(c).i("ao<1,2>"))},
T(a,b){return A.cn(this,b,null,A.o(this).i("Y.E"))}}
A.et.prototype={
geI(){var s=J.Z(this.a),r=this.c
if(r==null||r>s)return s
return r},
gfD(){var s=J.Z(this.a),r=this.b
if(r>s)return s
return r},
gk(a){var s,r=J.Z(this.a),q=this.b
if(q>=r)return 0
s=this.c
if(s==null||s>=r)return r-q
return s-q},
L(a,b){var s=this,r=s.gfD()+b
if(b<0||r>=s.geI())throw A.e(A.j4(b,s.gk(0),s,"index"))
return J.f6(s.a,r)},
T(a,b){var s,r,q=this
A.ap(b,"count")
s=q.b+b
r=q.c
if(r!=null&&s>=r)return new A.dN(q.$ti.i("dN<1>"))
return A.cn(q.a,s,r,q.$ti.c)},
aJ(a,b){var s,r,q,p=this,o=p.b,n=p.a,m=J.t(n),l=m.gk(n),k=p.c
if(k!=null&&k<l)l=k
s=l-o
if(s<=0){n=J.nQ(0,p.$ti.c)
return n}r=A.N(s,m.L(n,o),!1,p.$ti.c)
for(q=1;q<s;++q){B.a.m(r,q,m.L(n,o+q))
if(m.gk(n)<l)throw A.e(A.a6(p))}return r}}
A.V.prototype={
gq(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=J.t(q),o=p.gk(q)
if(r.b!==o)throw A.e(A.a6(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.L(q,s);++r.c
return!0},
$iE:1}
A.cf.prototype={
gt(a){return new A.e5(J.M(this.a),this.b,A.o(this).i("e5<1,2>"))},
gk(a){return J.Z(this.a)},
gA(a){return J.dA(this.a)},
gv(a){return this.b.$1(J.i4(this.a))},
L(a,b){return this.b.$1(J.f6(this.a,b))}}
A.c5.prototype={$iu:1}
A.e5.prototype={
n(){var s=this,r=s.b
if(r.n()){s.a=s.c.$1(r.gq())
return!0}s.a=null
return!1},
gq(){var s=this.a
return s==null?this.$ti.y[1].a(s):s},
$iE:1}
A.ao.prototype={
gk(a){return J.Z(this.a)},
L(a,b){return this.b.$1(J.f6(this.a,b))}}
A.cr.prototype={
gt(a){return new A.ex(J.M(this.a),this.b,this.$ti.i("ex<1>"))}}
A.ex.prototype={
n(){var s,r
for(s=this.a,r=this.b;s.n();)if(r.$1(s.gq()))return!0
return!1},
gq(){return this.a.gq()},
$iE:1}
A.bn.prototype={
T(a,b){A.dC(b,"count",t.S)
A.ap(b,"count")
return new A.bn(this.a,this.b+b,A.o(this).i("bn<1>"))},
gt(a){var s=this.a
return new A.ep(s.gt(s),this.b,A.o(this).i("ep<1>"))}}
A.cU.prototype={
gk(a){var s=this.a,r=s.gk(s)-this.b
if(r>=0)return r
return 0},
T(a,b){A.dC(b,"count",t.S)
A.ap(b,"count")
return new A.cU(this.a,this.b+b,this.$ti)},
$iu:1}
A.ep.prototype={
n(){var s,r
for(s=this.a,r=0;r<this.b;++r)s.n()
this.b=0
return s.n()},
gq(){return this.a.gq()},
$iE:1}
A.dN.prototype={
gt(a){return B.a4},
gA(a){return!0},
gk(a){return 0},
gv(a){throw A.e(A.aB())},
L(a,b){throw A.e(A.a3(b,0,0,"index",null))},
u(a,b){return!1},
T(a,b){A.ap(b,"count")
return this}}
A.dO.prototype={
n(){return!1},
gq(){throw A.e(A.aB())},
$iE:1}
A.bs.prototype={
gt(a){return new A.cs(J.M(this.a),this.$ti.i("cs<1>"))}}
A.cs.prototype={
n(){var s,r
for(s=this.a,r=this.$ti.c;s.n();)if(r.b(s.gq()))return!0
return!1},
gq(){return this.$ti.c.a(this.a.gq())},
$iE:1}
A.ca.prototype={
gk(a){return J.Z(this.a)},
gA(a){return J.dA(this.a)},
gI(a){return J.nJ(this.a)},
gv(a){return new A.G(this.b,J.i4(this.a))},
L(a,b){return new A.G(b+this.b,J.f6(this.a,b))},
u(a,b){var s,r,q,p=null,o=null,n=!1
if(t.fe.b(b)){s=b.a
if(A.dq(s)){A.Q(s)
r=b.b
n=s>=this.b
o=r
p=s}}if(n){if(typeof p!=="number")return p.aM()
n=J.cG(this.a,p-this.b)
q=n.gt(n)
return q.n()&&J.p(q.gq(),o)}return!1},
T(a,b){A.dC(b,"count",t.S)
A.ap(b,"count")
return new A.ca(J.cG(this.a,b),b+this.b,A.o(this).i("ca<1>"))},
gt(a){return new A.bh(J.M(this.a),this.b,A.o(this).i("bh<1>"))}}
A.cT.prototype={
u(a,b){var s,r,q,p,o=null,n=null,m=!1
if(t.fe.b(b)){s=b.a
if(A.dq(s)){A.Q(s)
r=b.b
m=s>=this.b
n=r
o=s}}if(m){if(typeof o!=="number")return o.aM()
q=o-this.b
m=this.a
p=J.t(m)
return q<p.gk(m)&&J.p(p.L(m,q),n)}return!1},
T(a,b){A.dC(b,"count",t.S)
A.ap(b,"count")
return new A.cT(J.cG(this.a,b),this.b+b,this.$ti)},
$iu:1}
A.bh.prototype={
n(){if(++this.c>=0&&this.a.n())return!0
this.c=-2
return!1},
gq(){var s=this.c
return s>=0?new A.G(this.b+s,this.a.gq()):A.k(A.aB())},
$iE:1}
A.al.prototype={}
A.bT.prototype={
m(a,b,c){A.o(this).i("bT.E").a(c)
throw A.e(A.aK("Cannot modify an unmodifiable list"))},
a1(a,b,c,d,e){A.o(this).i("f<bT.E>").a(d)
throw A.e(A.aK("Cannot modify an unmodifiable list"))},
Z(a,b,c,d){return this.a1(0,b,c,d,0)}}
A.da.prototype={}
A.b4.prototype={
gk(a){return J.Z(this.a)},
L(a,b){var s=this.a,r=J.t(s)
return r.L(s,r.gk(s)-1-b)}}
A.eZ.prototype={}
A.G.prototype={$r:"+(1,2)",$s:1}
A.dk.prototype={$r:"+(1,2,3)",$s:2}
A.cP.prototype={
bo(a,b,c){var s=A.o(this)
return A.ph(this,s.c,s.y[1],b,c)},
gA(a){return this.gk(this)===0},
gI(a){return this.gk(this)!==0},
p(a){return A.nV(this)},
m(a,b,c){var s=A.o(this)
s.c.a(b)
s.y[1].a(c)
A.rs()},
gaj(){return new A.dm(this.ha(),A.o(this).i("dm<a2<1,2>>"))},
ha(){var s=this
return function(){var r=0,q=1,p=[],o,n,m,l,k
return function $async$gaj(a,b,c){if(b===1){p.push(c)
r=q}for(;;)switch(r){case 0:o=s.ga_(),o=o.gt(o),n=A.o(s),m=n.y[1],n=n.i("a2<1,2>")
case 2:if(!o.n()){r=3
break}l=o.gq()
k=s.h(0,l)
r=4
return a.b=new A.a2(l,k==null?m.a(k):k,n),1
case 4:r=2
break
case 3:return 0
case 1:return a.c=p.at(-1),3}}}},
$iW:1}
A.aR.prototype={
gk(a){return this.b.length},
gcT(){var s=this.$keys
if(s==null){s=Object.keys(this.a)
this.$keys=s}return s},
K(a){if(typeof a!="string")return!1
if("__proto__"===a)return!1
return this.a.hasOwnProperty(a)},
h(a,b){if(!this.K(b))return null
return this.b[this.a[b]]},
W(a,b){var s,r,q,p
this.$ti.i("~(1,2)").a(b)
s=this.gcT()
r=this.b
for(q=s.length,p=0;p<q;++p)b.$2(s[p],r[p])},
ga_(){return new A.cx(this.gcT(),this.$ti.i("cx<1>"))},
gaw(){return new A.cx(this.b,this.$ti.i("cx<2>"))}}
A.cx.prototype={
gk(a){return this.a.length},
gA(a){return 0===this.a.length},
gI(a){return 0!==this.a.length},
gt(a){var s=this.a
return new A.bv(s,s.length,this.$ti.i("bv<1>"))}}
A.bv.prototype={
gq(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$iE:1}
A.bG.prototype={
al(){var s=this,r=s.$map
if(r==null){r=new A.cb(s.$ti.i("cb<1,2>"))
A.qm(s.a,r)
s.$map=r}return r},
K(a){return this.al().K(a)},
h(a,b){return this.al().h(0,b)},
W(a,b){this.$ti.i("~(1,2)").a(b)
this.al().W(0,b)},
ga_(){var s=this.al()
return new A.ag(s,A.o(s).i("ag<1>"))},
gaw(){var s=this.al()
return new A.aU(s,A.o(s).i("aU<2>"))},
gk(a){return this.al().a}}
A.cQ.prototype={}
A.aS.prototype={
gk(a){return this.b},
gA(a){return this.b===0},
gI(a){return this.b!==0},
gt(a){var s,r=this,q=r.$keys
if(q==null){q=Object.keys(r.a)
r.$keys=q}s=q
return new A.bv(s,s.length,r.$ti.i("bv<1>"))},
u(a,b){if(typeof b!="string")return!1
if("__proto__"===b)return!1
return this.a.hasOwnProperty(b)}}
A.bH.prototype={
gk(a){return this.a.length},
gA(a){return this.a.length===0},
gI(a){return this.a.length!==0},
gt(a){var s=this.a
return new A.bv(s,s.length,this.$ti.i("bv<1>"))},
al(){var s,r,q,p,o=this,n=o.$map
if(n==null){n=new A.cb(o.$ti.i("cb<1,1>"))
for(s=o.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q]
n.m(0,p,p)}o.$map=n}return n},
u(a,b){return this.al().K(b)}}
A.ek.prototype={}
A.kt.prototype={
af(a){var s,r,q=this,p=new RegExp(q.a).exec(a)
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
A.ef.prototype={
p(a){return"Null check operator used on a null value"}}
A.fJ.prototype={
p(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.hq.prototype={
p(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.jm.prototype={
p(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.dP.prototype={}
A.eN.prototype={
p(a){var s,r=this.b
if(r!=null)return r
r=this.a
s=r!==null&&typeof r==="object"?r.stack:null
return this.b=s==null?"":s},
$iaW:1}
A.bC.prototype={
p(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.qx(r==null?"unknown":r)+"'"},
gS(a){var s=A.om(this)
return A.b8(s==null?A.ae(this):s)},
$ic7:1,
gi0(){return this},
$C:"$1",
$R:1,
$D:null}
A.fe.prototype={$C:"$0",$R:0}
A.ff.prototype={$C:"$2",$R:2}
A.hh.prototype={}
A.ha.prototype={
p(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.qx(s)+"'"}}
A.cI.prototype={
D(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.cI))return!1
return this.$_target===b.$_target&&this.a===b.a},
gO(a){return(A.nr(this.a)^A.d5(this.$_target))>>>0},
p(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.h2(this.a)+"'")}}
A.h4.prototype={
p(a){return"RuntimeError: "+this.a}}
A.aT.prototype={
gk(a){return this.a},
gA(a){return this.a===0},
gI(a){return this.a!==0},
ga_(){return new A.ag(this,A.o(this).i("ag<1>"))},
gaw(){return new A.aU(this,A.o(this).i("aU<2>"))},
gaj(){return new A.e2(this,A.o(this).i("e2<1,2>"))},
K(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.ho(a)},
ho(a){var s=this.d
if(s==null)return!1
return this.aX(this.cR(s,a),a)>=0},
P(a,b){A.o(this).i("W<1,2>").a(b).W(0,new A.j7(this))},
h(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.hp(b)},
hp(a){var s,r,q=this.d
if(q==null)return null
s=this.cR(q,a)
r=this.aX(s,a)
if(r<0)return null
return s[r].b},
m(a,b,c){var s,r,q=this,p=A.o(q)
p.c.a(b)
p.y[1].a(c)
if(typeof b=="string"){s=q.b
q.cB(s==null?q.b=q.bO():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=q.c
q.cB(r==null?q.c=q.bO():r,b,c)}else q.hr(b,c)},
hr(a,b){var s,r,q,p,o=this,n=A.o(o)
n.c.a(a)
n.y[1].a(b)
s=o.d
if(s==null)s=o.d=o.bO()
r=o.bq(a)
q=s[r]
if(q==null)s[r]=[o.bC(a,b)]
else{p=o.aX(q,a)
if(p>=0)q[p].b=b
else q.push(o.bC(a,b))}},
aY(a,b){var s,r,q=this,p=A.o(q)
p.c.a(a)
p.i("2()").a(b)
if(q.K(a)){s=q.h(0,a)
return s==null?p.y[1].a(s):s}r=b.$0()
q.m(0,a,r)
return r},
bt(a,b){var s=this
if(typeof b=="string")return s.d7(s.b,b)
else if(typeof b=="number"&&(b&0x3fffffff)===b)return s.d7(s.c,b)
else return s.hq(b)},
hq(a){var s,r,q,p,o=this,n=o.d
if(n==null)return null
s=o.bq(a)
r=n[s]
q=o.aX(r,a)
if(q<0)return null
p=r.splice(q,1)[0]
o.dg(p)
if(r.length===0)delete n[s]
return p.b},
W(a,b){var s,r,q=this
A.o(q).i("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.e(A.a6(q))
s=s.c}},
cB(a,b,c){var s,r=A.o(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.bC(b,c)
else s.b=c},
d7(a,b){var s
if(a==null)return null
s=a[b]
if(s==null)return null
this.dg(s)
delete a[b]
return s.b},
cX(){this.r=this.r+1&1073741823},
bC(a,b){var s=this,r=A.o(s),q=new A.je(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else{r=s.f
r.toString
q.d=r
s.f=r.c=q}++s.a
s.cX()
return q},
dg(a){var s=this,r=a.d,q=a.c
if(r==null)s.e=q
else r.c=q
if(q==null)s.f=r
else q.d=r;--s.a
s.cX()},
bq(a){return J.b1(a)&1073741823},
cR(a,b){return a[this.bq(b)]},
aX(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.p(a[r].a,b))return r
return-1},
p(a){return A.nV(this)},
bO(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$inT:1}
A.j7.prototype={
$2(a,b){var s=this.a,r=A.o(s)
s.m(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.o(this.a).i("~(1,2)")}}
A.je.prototype={}
A.ag.prototype={
gk(a){return this.a.a},
gA(a){return this.a.a===0},
gt(a){var s=this.a
return new A.e3(s,s.r,s.e,this.$ti.i("e3<1>"))},
u(a,b){return this.a.K(b)}}
A.e3.prototype={
gq(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.a6(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$iE:1}
A.aU.prototype={
gk(a){return this.a.a},
gA(a){return this.a.a===0},
gt(a){var s=this.a
return new A.ce(s,s.r,s.e,this.$ti.i("ce<1>"))}}
A.ce.prototype={
gq(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.a6(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$iE:1}
A.e2.prototype={
gk(a){return this.a.a},
gA(a){return this.a.a===0},
gt(a){var s=this.a
return new A.cd(s,s.r,s.e,this.$ti.i("cd<1,2>"))}}
A.cd.prototype={
gq(){var s=this.d
s.toString
return s},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.a6(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.a2(s.a,s.b,r.$ti.i("a2<1,2>"))
r.c=s.c
return!0}},
$iE:1}
A.cb.prototype={
bq(a){return A.vY(a)&1073741823},
aX(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.p(a[r].a,b))return r
return-1}}
A.ni.prototype={
$1(a){return this.a(a)},
$S:34}
A.nj.prototype={
$2(a,b){return this.a(a,b)},
$S:46}
A.nk.prototype={
$1(a){return this.a(A.S(a))},
$S:32}
A.b6.prototype={
gS(a){return A.b8(this.cS())},
cS(){return A.w4(this.$r,this.bM())},
p(a){return this.de(!1)},
de(a){var s,r,q,p,o,n=this.eL(),m=this.bM(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.a(m,q)
o=m[q]
l=a?l+A.po(o):l+A.w(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
eL(){var s,r=this.$s
while($.l4.length<=r)B.a.l($.l4,null)
s=$.l4[r]
if(s==null){s=this.eB()
B.a.m($.l4,r,s)}return s},
eB(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=t.K,j=J.p7(l,k)
for(s=0;s<l;++s)j[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.a.m(j,q,r[s])}}return A.nU(j,k)}}
A.di.prototype={
bM(){return[this.a,this.b]},
D(a,b){if(b==null)return!1
return b instanceof A.di&&this.$s===b.$s&&J.p(this.a,b.a)&&J.p(this.b,b.b)},
gO(a){return A.nX(this.$s,this.a,this.b,B.A)}}
A.dj.prototype={
bM(){return[this.a,this.b,this.c]},
D(a,b){var s=this
if(b==null)return!1
return b instanceof A.dj&&s.$s===b.$s&&J.p(s.a,b.a)&&J.p(s.b,b.b)&&J.p(s.c,b.c)},
gO(a){var s=this
return A.nX(s.$s,s.a,s.b,s.c)}}
A.dZ.prototype={
p(a){return"RegExp/"+this.a+"/"+this.b.flags},
gf4(){var s=this,r=s.c
if(r!=null)return r
r=s.b
return s.c=A.pa(s.a,r.multiline,!r.ignoreCase,r.unicode,r.dotAll,"g")},
eC(){var s,r=this.a
if(!B.d.u(r,"("))return!1
s=this.b.unicode?"u":""
return new RegExp("(?:)|"+r,s).exec("").length>1},
bZ(a,b,c){var s=b.length
if(c>s)throw A.e(A.a3(c,0,s,null,null))
return new A.hs(this,b,c)},
bY(a,b){return this.bZ(0,b,0)},
eK(a,b){var s,r=this.gf4()
if(r==null)r=A.b_(r)
r.lastIndex=b
s=r.exec(a)
if(s==null)return null
return new A.hS(s)},
$ijn:1,
$itL:1}
A.hS.prototype={
gcw(){return this.b.index},
gc8(){var s=this.b
return s.index+s[0].length},
$id2:1,
$iej:1}
A.hs.prototype={
gt(a){return new A.ey(this.a,this.b,this.c)}}
A.ey.prototype={
gq(){var s=this.d
return s==null?t.lu.a(s):s},
n(){var s,r,q,p,o,n,m=this,l=m.b
if(l==null)return!1
s=m.c
r=l.length
if(s<=r){q=m.a
p=q.eK(l,s)
if(p!=null){m.d=p
o=p.gc8()
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
$iE:1}
A.er.prototype={
gc8(){return this.a+this.c.length},
$id2:1,
gcw(){return this.a}}
A.hW.prototype={
gt(a){return new A.hX(this.a,this.b,this.c)},
gv(a){var s=this.b,r=this.a.indexOf(s,this.c)
if(r>=0)return new A.er(r,s)
throw A.e(A.aB())}}
A.hX.prototype={
n(){var s,r,q=this,p=q.c,o=q.b,n=o.length,m=q.a,l=m.length
if(p+n>l){q.d=null
return!1}s=m.indexOf(o,p)
if(s<0){q.c=l+1
q.d=null
return!1}r=s+n
q.d=new A.er(s,o)
q.c=r===q.c?r+1:r
return!0},
gq(){var s=this.d
s.toString
return s},
$iE:1}
A.bM.prototype={
gdE(a){return a.byteLength},
gS(a){return B.cT},
dq(a,b,c){A.bz(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
dn(a,b,c){A.bz(a,b,c)
return new Uint16Array(a,b,c)},
dl(a,b,c){A.bz(a,b,c)
return new Float32Array(a,b,c)},
dm(a,b,c){A.bz(a,b,c)
return new Float64Array(a,b,c)},
dk(a,b,c){var s
A.bz(a,b,c)
s=new DataView(a,b,c)
return s},
$iJ:1,
$ibM:1}
A.d4.prototype={$id4:1}
A.eb.prototype={
gai(a){if(((a.$flags|0)&2)!==0)return new A.lc(a.buffer)
else return a.buffer},
eW(a,b,c,d){var s=A.a3(b,0,c,d,null)
throw A.e(s)},
cI(a,b,c,d){if(b>>>0!==b||b>c)this.eW(a,b,c,d)}}
A.lc.prototype={
gdE(a){return this.a.byteLength},
dq(a,b,c){var s=A.nW(this.a,b,c)
s.$flags=3
return s},
dn(a,b,c){var s=A.tx(this.a,b,c)
s.$flags=3
return s},
dl(a,b,c){var s=A.tu(this.a,b,c)
s.$flags=3
return s},
dm(a,b,c){var s=A.tv(this.a,b,c)
s.$flags=3
return s},
dk(a,b,c){var s=A.tt(this.a,b,c)
s.$flags=3
return s}}
A.e9.prototype={
gS(a){return B.cU},
$iJ:1,
$ioS:1}
A.ah.prototype={
gk(a){return a.length},
d9(a,b,c,d,e){var s,r,q=a.length
this.cI(a,b,q,"start")
this.cI(a,c,q,"end")
if(b>c)throw A.e(A.a3(b,0,c,null,null))
s=c-b
r=d.length
if(r-e<s)throw A.e(A.d7("Not enough elements"))
if(e!==0||r!==s)d=d.subarray(e,e+s)
a.set(d,b)},
$iaC:1}
A.bN.prototype={
h(a,b){A.by(b,a,a.length)
return a[b]},
m(a,b,c){A.dn(c)
a.$flags&2&&A.y(a)
A.by(b,a,a.length)
a[b]=c},
a1(a,b,c,d,e){t.id.a(d)
a.$flags&2&&A.y(a,5)
if(t.dQ.b(d)){this.d9(a,b,c,d,e)
return}this.cA(a,b,c,d,e)},
Z(a,b,c,d){return this.a1(a,b,c,d,0)},
$iu:1,
$if:1,
$il:1}
A.aD.prototype={
m(a,b,c){A.Q(c)
a.$flags&2&&A.y(a)
A.by(b,a,a.length)
a[b]=c},
a1(a,b,c,d,e){t.fm.a(d)
a.$flags&2&&A.y(a,5)
if(t.aj.b(d)){this.d9(a,b,c,d,e)
return}this.cA(a,b,c,d,e)},
Z(a,b,c,d){return this.a1(a,b,c,d,0)},
$iu:1,
$if:1,
$il:1}
A.cg.prototype={
gS(a){return B.cV},
G(a,b,c){return new Float32Array(a.subarray(b,A.b7(b,c,a.length)))},
a3(a,b){return this.G(a,b,null)},
$iJ:1,
$icg:1,
$ifw:1}
A.ch.prototype={
gS(a){return B.cW},
G(a,b,c){return new Float64Array(a.subarray(b,A.b7(b,c,a.length)))},
a3(a,b){return this.G(a,b,null)},
$iJ:1,
$ich:1,
$idT:1}
A.fU.prototype={
gS(a){return B.cX},
h(a,b){A.by(b,a,a.length)
return a[b]},
G(a,b,c){return new Int16Array(a.subarray(b,A.b7(b,c,a.length)))},
a3(a,b){return this.G(a,b,null)},
$iJ:1,
$inO:1}
A.ea.prototype={
gS(a){return B.cY},
h(a,b){A.by(b,a,a.length)
return a[b]},
G(a,b,c){return new Int32Array(a.subarray(b,A.b7(b,c,a.length)))},
a3(a,b){return this.G(a,b,null)},
$iJ:1,
$ifE:1}
A.fV.prototype={
gS(a){return B.cZ},
h(a,b){A.by(b,a,a.length)
return a[b]},
G(a,b,c){return new Int8Array(a.subarray(b,A.b7(b,c,a.length)))},
a3(a,b){return this.G(a,b,null)},
$iJ:1}
A.cj.prototype={
gS(a){return B.d1},
h(a,b){A.by(b,a,a.length)
return a[b]},
G(a,b,c){return new Uint16Array(a.subarray(b,A.b7(b,c,a.length)))},
a3(a,b){return this.G(a,b,null)},
$iJ:1,
$icj:1,
$ikv:1}
A.ec.prototype={
gS(a){return B.d2},
h(a,b){A.by(b,a,a.length)
return a[b]},
G(a,b,c){return new Uint32Array(a.subarray(b,A.b7(b,c,a.length)))},
a3(a,b){return this.G(a,b,null)},
$iJ:1,
$io0:1}
A.ed.prototype={
gS(a){return B.d3},
gk(a){return a.length},
h(a,b){A.by(b,a,a.length)
return a[b]},
G(a,b,c){return new Uint8ClampedArray(a.subarray(b,A.b7(b,c,a.length)))},
a3(a,b){return this.G(a,b,null)},
$iJ:1}
A.bO.prototype={
gS(a){return B.d4},
gk(a){return a.length},
h(a,b){A.by(b,a,a.length)
return a[b]},
G(a,b,c){return new Uint8Array(a.subarray(b,A.b7(b,c,a.length)))},
a3(a,b){return this.G(a,b,null)},
$iJ:1,
$ibO:1,
$icp:1}
A.eI.prototype={}
A.eJ.prototype={}
A.eK.prototype={}
A.eL.prototype={}
A.aV.prototype={
i(a){return A.eW(v.typeUniverse,this,a)},
E(a){return A.pX(v.typeUniverse,this,a)}}
A.hJ.prototype={}
A.i_.prototype={
p(a){return A.aG(this.a,null)}}
A.hD.prototype={
p(a){return this.a}}
A.eS.prototype={$ibq:1}
A.kD.prototype={
$1(a){var s=this.a,r=s.a
s.a=null
r.$0()},
$S:21}
A.kC.prototype={
$1(a){var s,r
this.a.a=t.M.a(a)
s=this.b
r=this.c
s.firstChild?s.removeChild(r):s.appendChild(r)},
$S:56}
A.kE.prototype={
$0(){this.a.$0()},
$S:30}
A.kF.prototype={
$0(){this.a.$0()},
$S:30}
A.l9.prototype={
e6(a,b){if(self.setTimeout!=null)this.b=self.setTimeout(A.dw(new A.la(this,b),0),a)
else throw A.e(A.aK("`setTimeout()` not found."))},
aU(){if(self.setTimeout!=null){var s=this.b
if(s==null)return
self.clearTimeout(s)
this.b=null}else throw A.e(A.aK("Canceling a timer."))}}
A.la.prototype={
$0(){this.a.b=null
this.b.$0()},
$S:0}
A.ht.prototype={
c3(a){var s,r=this,q=r.$ti
q.i("1/?").a(a)
if(a==null)a=q.c.a(a)
if(!r.b)r.a.aP(a)
else{s=r.a
if(q.i("a1<1>").b(a))s.cH(a)
else s.b9(a)}},
c4(a,b){var s=this.a
if(this.b)s.ap(new A.ab(a,b))
else s.aQ(new A.ab(a,b))}}
A.lj.prototype={
$1(a){return this.a.$2(0,a)},
$S:19}
A.lk.prototype={
$2(a,b){this.a.$2(1,new A.dP(a,t.l.a(b)))},
$S:51}
A.n1.prototype={
$2(a,b){this.a(A.Q(a),b)},
$S:53}
A.eR.prototype={
gq(){var s=this.b
return s==null?this.$ti.c.a(s):s},
fo(a,b){var s,r,q
a=A.Q(a)
b=b
s=this.a
for(;;)try{r=s(this,a,b)
return r}catch(q){b=q
a=1}},
n(){var s,r,q,p,o=this,n=null,m=0
for(;;){s=o.d
if(s!=null)try{if(s.n()){o.b=s.gq()
return!0}else o.d=null}catch(r){n=r
m=1
o.d=null}q=o.fo(m,n)
if(1===q)return!0
if(0===q){o.b=null
p=o.e
if(p==null||p.length===0){o.a=A.pR
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
o.a=A.pR
throw n
return!1}if(0>=p.length)return A.a(p,-1)
o.a=p.pop()
m=1
continue}throw A.e(A.d7("sync*"))}return!1},
i2(a){var s,r,q=this
if(a instanceof A.dm){s=a.a()
r=q.e
if(r==null)r=q.e=[]
B.a.l(r,q.a)
q.a=s
return 2}else{q.d=J.M(a)
return 2}},
$iE:1}
A.dm.prototype={
gt(a){return new A.eR(this.a(),this.$ti.i("eR<1>"))}}
A.ab.prototype={
p(a){return A.w(this.a)},
$iP:1,
gaL(){return this.b}}
A.iK.prototype={
$0(){this.c.a(null)
this.b.bH(null)},
$S:0}
A.ks.prototype={
p(a){var s=this.b.p(0)
return"TimeoutException after "+s+": "+this.a}}
A.hz.prototype={
c4(a,b){var s=this.a
if((s.a&30)!==0)throw A.e(A.d7("Future already completed"))
s.aQ(A.va(a,b))},
dv(a){return this.c4(a,null)}}
A.eA.prototype={
c3(a){var s,r=this.$ti
r.i("1/?").a(a)
s=this.a
if((s.a&30)!==0)throw A.e(A.d7("Future already completed"))
s.aP(r.i("1/").a(a))}}
A.aX.prototype={
hB(a){if((this.c&15)!==6)return!0
return this.b.b.cm(t.iW.a(this.d),a.a,t.y,t.K)},
hj(a){var s,r=this,q=r.e,p=null,o=t.z,n=t.K,m=a.a,l=r.b.b
if(t.ng.b(q))p=l.hN(q,m,a.b,o,n,t.l)
else p=l.cm(t.v.a(q),m,o,n)
try{o=r.$ti.i("2/").a(p)
return o}catch(s){if(t.do.b(A.b9(s))){if((r.c&1)!==0)throw A.e(A.aI("The error handler of Future.then must return a value of the returned future's type","onError"))
throw A.e(A.aI("The error handler of Future.catchError must return a value of the future's type","onError"))}else throw s}}}
A.F.prototype={
b_(a,b,c){var s,r,q,p=this.$ti
p.E(c).i("1/(2)").a(a)
s=$.D
if(s===B.e){if(b!=null&&!t.ng.b(b)&&!t.v.b(b))throw A.e(A.i7(b,"onError",u.c))}else{c.i("@<0/>").E(p.c).i("1(2)").a(a)
if(b!=null)b=A.vC(b,s)}r=new A.F(s,c.i("F<0>"))
q=b==null?1:3
this.aO(new A.aX(r,q,a,b,p.i("@<1>").E(c).i("aX<1,2>")))
return r},
hR(a,b){return this.b_(a,null,b)},
dd(a,b,c){var s,r=this.$ti
r.E(c).i("1/(2)").a(a)
s=new A.F($.D,c.i("F<0>"))
this.aO(new A.aX(s,19,a,b,r.i("@<1>").E(c).i("aX<1,2>")))
return s},
hY(a){var s,r
t.mY.a(a)
s=this.$ti
r=new A.F($.D,s)
this.aO(new A.aX(r,8,a,null,s.i("aX<1,1>")))
return r},
fv(a){this.$ti.c.a(a)
this.a=8
this.c=a},
fs(a){this.a=this.a&1|16
this.c=a},
b8(a){this.a=a.a&30|this.a&1
this.c=a.c},
aO(a){var s,r=this,q=r.a
if(q<=3){a.a=t.F.a(r.c)
r.c=a}else{if((q&4)!==0){s=t._.a(r.c)
if((s.a&24)===0){s.aO(a)
return}r.b8(s)}A.dt(null,null,r.b,t.M.a(new A.kJ(r,a)))}},
d4(a){var s,r,q,p,o,n,m=this,l={}
l.a=a
if(a==null)return
s=m.a
if(s<=3){r=t.F.a(m.c)
m.c=a
if(r!=null){q=a.a
for(p=a;q!=null;p=q,q=o)o=q.a
p.a=r}}else{if((s&4)!==0){n=t._.a(m.c)
if((n.a&24)===0){n.d4(a)
return}m.b8(n)}l.a=m.bg(a)
A.dt(null,null,m.b,t.M.a(new A.kO(l,m)))}},
aT(){var s=t.F.a(this.c)
this.c=null
return this.bg(s)},
bg(a){var s,r,q
for(s=a,r=null;s!=null;r=s,s=q){q=s.a
s.a=r}return r},
bH(a){var s,r=this,q=r.$ti
q.i("1/").a(a)
if(q.i("a1<1>").b(a))A.kM(a,r,!0)
else{s=r.aT()
q.c.a(a)
r.a=8
r.c=a
A.cw(r,s)}},
b9(a){var s,r=this
r.$ti.c.a(a)
s=r.aT()
r.a=8
r.c=a
A.cw(r,s)},
eA(a){var s,r,q=this
if((a.a&16)!==0){s=q.b===a.b
s=!(s||s)}else s=!1
if(s)return
r=q.aT()
q.b8(a)
A.cw(q,r)},
ap(a){var s=this.aT()
this.fs(a)
A.cw(this,s)},
ez(a,b){A.b_(a)
t.l.a(b)
this.ap(new A.ab(a,b))},
aP(a){var s=this.$ti
s.i("1/").a(a)
if(s.i("a1<1>").b(a)){this.cH(a)
return}this.cG(a)},
cG(a){var s=this
s.$ti.c.a(a)
s.a^=2
A.dt(null,null,s.b,t.M.a(new A.kL(s,a)))},
cH(a){A.kM(this.$ti.i("a1<1>").a(a),this,!1)
return},
aQ(a){this.a^=2
A.dt(null,null,this.b,t.M.a(new A.kK(this,a)))},
hS(a){var s,r=this,q={}
if((r.a&24)!==0){q=new A.F($.D,r.$ti)
q.aP(r)
return q}s=new A.F($.D,r.$ti)
q.a=null
q.a=A.pC(a,new A.kU(s,a))
r.b_(new A.kV(q,r,s),new A.kW(q,s),t.P)
return s},
$ia1:1}
A.kJ.prototype={
$0(){A.cw(this.a,this.b)},
$S:0}
A.kO.prototype={
$0(){A.cw(this.b,this.a.a)},
$S:0}
A.kN.prototype={
$0(){A.kM(this.a.a,this.b,!0)},
$S:0}
A.kL.prototype={
$0(){this.a.b9(this.b)},
$S:0}
A.kK.prototype={
$0(){this.a.ap(this.b)},
$S:0}
A.kR.prototype={
$0(){var s,r,q,p,o,n,m,l,k=this,j=null
try{q=k.a.a
j=q.b.b.dT(t.mY.a(q.d),t.z)}catch(p){s=A.b9(p)
r=A.bY(p)
if(k.c&&t.u.a(k.b.a.c).a===s){q=k.a
q.c=t.u.a(k.b.a.c)}else{q=s
o=r
if(o==null)o=A.nK(q)
n=k.a
n.c=new A.ab(q,o)
q=n}q.b=!0
return}if(j instanceof A.F&&(j.a&24)!==0){if((j.a&16)!==0){q=k.a
q.c=t.u.a(j.c)
q.b=!0}return}if(j instanceof A.F){m=k.b.a
l=new A.F(m.b,m.$ti)
j.b_(new A.kS(l,m),new A.kT(l),t.o)
q=k.a
q.c=l
q.b=!1}},
$S:0}
A.kS.prototype={
$1(a){this.a.eA(this.b)},
$S:21}
A.kT.prototype={
$2(a,b){A.b_(a)
t.l.a(b)
this.a.ap(new A.ab(a,b))},
$S:29}
A.kQ.prototype={
$0(){var s,r,q,p,o,n,m,l
try{q=this.a
p=q.a
o=p.$ti
n=o.c
m=n.a(this.b)
q.c=p.b.b.cm(o.i("2/(1)").a(p.d),m,o.i("2/"),n)}catch(l){s=A.b9(l)
r=A.bY(l)
q=s
p=r
if(p==null)p=A.nK(q)
o=this.a
o.c=new A.ab(q,p)
o.b=!0}},
$S:0}
A.kP.prototype={
$0(){var s,r,q,p,o,n,m,l=this
try{s=t.u.a(l.a.a.c)
p=l.b
if(p.a.hB(s)&&p.a.e!=null){p.c=p.a.hj(s)
p.b=!1}}catch(o){r=A.b9(o)
q=A.bY(o)
p=t.u.a(l.a.a.c)
if(p.a===r){n=l.b
n.c=p
p=n}else{p=r
n=q
if(n==null)n=A.nK(p)
m=l.b
m.c=new A.ab(p,n)
p=m}p.b=!0}},
$S:0}
A.kU.prototype={
$0(){var s=A.pw()
this.a.ap(new A.ab(new A.ks("Future not completed",this.b),s))},
$S:0}
A.kV.prototype={
$1(a){var s
this.b.$ti.c.a(a)
s=this.a.a
if(s.b!=null){s.aU()
this.c.b9(a)}},
$S(){return this.b.$ti.i("a0(1)")}}
A.kW.prototype={
$2(a,b){var s
A.b_(a)
t.l.a(b)
s=this.a.a
if(s.b!=null){s.aU()
this.b.ap(new A.ab(a,b))}},
$S:29}
A.hu.prototype={}
A.d8.prototype={
gk(a){var s={},r=new A.F($.D,t.hy)
s.a=0
this.dF(new A.jR(s,this),!0,new A.jS(s,r),r.gey())
return r}}
A.jR.prototype={
$1(a){this.b.$ti.c.a(a);++this.a.a},
$S(){return this.b.$ti.i("~(1)")}}
A.jS.prototype={
$0(){this.b.bH(this.a.a)},
$S:0}
A.eO.prototype={
gfc(){var s,r=this
if((r.b&8)===0)return A.o(r).i("aY<1>?").a(r.a)
s=A.o(r)
return s.i("aY<1>?").a(s.i("eP<1>").a(r.a).gbT())},
eJ(){var s,r,q=this
if((q.b&8)===0){s=q.a
if(s==null)s=q.a=new A.aY(A.o(q).i("aY<1>"))
return A.o(q).i("aY<1>").a(s)}r=A.o(q)
s=r.i("eP<1>").a(q.a).gbT()
return r.i("aY<1>").a(s)},
gfF(){var s=this.a
if((this.b&8)!==0)s=t.d2.a(s).gbT()
return A.o(this).i("ct<1>").a(s)},
es(){if((this.b&4)!==0)return new A.bR("Cannot add event after closing")
return new A.bR("Cannot add event while adding a stream")},
fE(a,b,c,d){var s,r,q,p,o,n=this,m=A.o(n)
m.i("~(1)?").a(a)
t.jE.a(c)
if((n.b&3)!==0)throw A.e(A.d7("Stream has already been listened to."))
s=$.D
r=d?1:0
t.bm.E(m.c).i("1(2)").a(a)
A.ud(s,b)
t.M.a(c)
q=new A.ct(n,a,s,r|32,m.i("ct<1>"))
p=n.gfc()
if(((n.b|=1)&8)!==0){o=m.i("eP<1>").a(n.a)
o.sbT(q)
o.cl()}else n.a=q
q.ft(p)
q.bN(new A.l8(n))
return q},
fi(a){var s,r,q,p,o,n,m,l,k,j=this,i=A.o(j)
i.i("hb<1>").a(a)
s=null
if((j.b&8)!==0)s=i.i("eP<1>").a(j.a).aU()
j.a=null
j.b=j.b&4294967286|2
r=j.r
if(r!=null)if(s==null)try{q=r.$0()
if(q instanceof A.F)s=q}catch(n){p=A.b9(n)
o=A.bY(n)
m=new A.F($.D,t.cU)
i=A.b_(p)
l=t.l.a(o)
m.aQ(new A.ab(i,l))
s=m}else s=s.hY(r)
i=new A.l7(j)
if(s!=null){l=s
t.mY.a(i)
k=l.$ti
m=new A.F($.D,k)
l.aO(new A.aX(m,8,i,null,k.i("aX<1,1>")))
s=m}else i.$0()
return s},
$ipQ:1,
$icv:1}
A.l8.prototype={
$0(){A.og(this.a.d)},
$S:0}
A.l7.prototype={
$0(){},
$S:0}
A.hv.prototype={
bS(a){var s=this.$ti
s.c.a(a)
this.gfF().ei(new A.cu(a,s.i("cu<1>")))}}
A.dd.prototype={}
A.dh.prototype={
gO(a){return(A.d5(this.a)^892482866)>>>0},
D(a,b){if(b==null)return!1
if(this===b)return!0
return b instanceof A.dh&&b.a===this.a}}
A.ct.prototype={
f5(){return this.w.fi(this)},
be(){var s=this.w,r=A.o(s)
r.i("hb<1>").a(this)
if((s.b&8)!==0)r.i("eP<1>").a(s.a).dL()
A.og(s.e)},
bf(){var s=this.w,r=A.o(s)
r.i("hb<1>").a(this)
if((s.b&8)!==0)r.i("eP<1>").a(s.a).cl()
A.og(s.f)}}
A.de.prototype={
ft(a){var s=this
A.o(s).i("aY<1>?").a(a)
if(a==null)return
s.r=a
if(a.c!=null){s.e=(s.e|128)>>>0
a.b5(s)}},
dL(){var s,r,q=this,p=q.e
if((p&8)!==0)return
s=(p+256|4)>>>0
q.e=s
if(p<256){r=q.r
if(r!=null)if(r.a===1)r.a=3}if((p&4)===0&&(s&64)===0)q.bN(q.gcY())},
cl(){var s=this,r=s.e
if((r&8)!==0)return
if(r>=256){r=s.e=r-256
if(r<256)if((r&128)!==0&&s.r.c!=null)s.r.b5(s)
else{r=(r&4294967291)>>>0
s.e=r
if((r&64)===0)s.bN(s.gcZ())}}},
be(){},
bf(){},
ei(a){var s,r=this,q=r.r
if(q==null)q=r.r=new A.aY(A.o(r).i("aY<1>"))
q.l(0,a)
s=r.e
if((s&128)===0){s=(s|128)>>>0
r.e=s
if(s<256)q.b5(r)}},
bS(a){var s,r=this,q=A.o(r).c
q.a(a)
s=r.e
r.e=(s|64)>>>0
r.d.hP(r.a,a,q)
r.e=(r.e&4294967231)>>>0
r.cJ((s&4)!==0)},
bN(a){var s,r=this
t.M.a(a)
s=r.e
r.e=(s|64)>>>0
a.$0()
r.e=(r.e&4294967231)>>>0
r.cJ((s&4)!==0)},
cJ(a){var s,r,q=this,p=q.e
if((p&128)!==0&&q.r.c==null){p=q.e=(p&4294967167)>>>0
s=!1
if((p&4)!==0)if(p<256){s=q.r
s=s==null?null:s.c==null
s=s!==!1}if(s){p=(p&4294967291)>>>0
q.e=p}}for(;;a=r){if((p&8)!==0){q.r=null
return}r=(p&4)!==0
if(a===r)break
q.e=(p^64)>>>0
if(r)q.be()
else q.bf()
p=(q.e&4294967231)>>>0
q.e=p}if((p&128)!==0&&p<256)q.r.b5(q)},
$ihb:1,
$icv:1}
A.eQ.prototype={
dF(a,b,c,d){var s=this.$ti
s.i("~(1)?").a(a)
t.jE.a(c)
return this.a.fE(s.i("~(1)?").a(a),d,c,!0)}}
A.eC.prototype={}
A.cu.prototype={}
A.aY.prototype={
b5(a){var s,r=this
r.$ti.i("cv<1>").a(a)
s=r.a
if(s===1)return
if(s>=1){r.a=1
return}A.wC(new A.l3(r,a))
r.a=1},
l(a,b){var s=this,r=s.c
if(r==null)s.b=s.c=b
else s.c=r.a=b}}
A.l3.prototype={
$0(){var s,r,q,p=this.a,o=p.a
p.a=0
if(o===3)return
s=p.$ti.i("cv<1>").a(this.b)
r=p.b
q=r.a
p.b=q
if(q==null)p.c=null
A.o(r).i("cv<1>").a(s).bS(r.b)},
$S:0}
A.cC.prototype={
gq(){var s=this
if(s.c)return s.$ti.c.a(s.b)
return s.$ti.c.a(null)},
n(){var s,r=this,q=r.a
if(q!=null){if(r.c){s=new A.F($.D,t.k)
r.b=s
r.c=!1
q.cl()
return s}throw A.e(A.d7("Already waiting for next."))}return r.eU()},
eU(){var s,r,q=this,p=q.b
if(p!=null){q.$ti.i("d8<1>").a(p)
s=new A.F($.D,t.k)
q.b=s
r=p.dF(q.gf6(),!0,q.gf8(),q.gfa())
if(q.b!=null)q.a=r
return s}return $.qA()},
aU(){var s,r,q=this,p=q.a,o=q.b
q.b=null
if(p!=null){q.a=null
if(!q.c)t.k.a(o).aP(!1)
else q.c=!1
s=p.e=(p.e&4294967279)>>>0
if((s&8)===0){s=p.e=(s|8)>>>0
if((s&128)!==0){r=p.r
if(r.a===1)r.a=3}if((s&64)===0)p.r=null
p.f=p.f5()}s=p.f
return s==null?$.oB():s}return $.oB()},
f7(a){var s,r,q=this
q.$ti.c.a(a)
if(q.a==null)return
s=t.k.a(q.b)
q.b=a
q.c=!0
s.bH(!0)
if(q.c){r=q.a
if(r!=null)r.dL()}},
fb(a,b){var s,r,q=this
A.b_(a)
t.l.a(b)
s=q.a
r=t.k.a(q.b)
q.b=q.a=null
if(s!=null)r.ap(new A.ab(a,b))
else r.aQ(new A.ab(a,b))},
f9(){var s=this,r=s.a,q=t.k.a(s.b)
s.b=s.a=null
if(r!=null)q.b9(!1)
else q.cG(!1)}}
A.eY.prototype={$ipF:1}
A.hV.prototype={
hO(a){var s,r,q
t.M.a(a)
try{if(B.e===$.D){a.$0()
return}A.qd(null,null,this,a,t.o)}catch(q){s=A.b9(q)
r=A.bY(q)
A.i0(A.b_(s),t.l.a(r))}},
hP(a,b,c){var s,r,q
c.i("~(0)").a(a)
c.a(b)
try{if(B.e===$.D){a.$1(b)
return}A.qe(null,null,this,a,b,t.o,c)}catch(q){s=A.b9(q)
r=A.bY(q)
A.i0(A.b_(s),t.l.a(r))}},
c1(a){return new A.l6(this,t.M.a(a))},
dT(a,b){b.i("0()").a(a)
if($.D===B.e)return a.$0()
return A.qd(null,null,this,a,b)},
cm(a,b,c,d){c.i("@<0>").E(d).i("1(2)").a(a)
d.a(b)
if($.D===B.e)return a.$1(b)
return A.qe(null,null,this,a,b,c,d)},
hN(a,b,c,d,e,f){d.i("@<0>").E(e).E(f).i("1(2,3)").a(a)
e.a(b)
f.a(c)
if($.D===B.e)return a.$2(b,c)
return A.vE(null,null,this,a,b,c,d,e,f)},
ck(a,b,c,d){return b.i("@<0>").E(c).E(d).i("1(2,3)").a(a)}}
A.l6.prototype={
$0(){return this.a.hO(this.b)},
$S:0}
A.mX.prototype={
$0(){A.rJ(this.a,this.b)},
$S:0}
A.cz.prototype={
gt(a){var s=this,r=new A.cA(s,s.r,A.o(s).i("cA<1>"))
r.c=s.e
return r},
gk(a){return this.a},
gA(a){return this.a===0},
gI(a){return this.a!==0},
u(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.nF.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.nF.a(r[b])!=null}else return this.eD(b)},
eD(a){var s=this.d
if(s==null)return!1
return this.cP(s[this.cK(a)],a)>=0},
gv(a){var s=this.e
if(s==null)throw A.e(A.d7("No elements"))
return A.o(this).c.a(s.a)},
l(a,b){var s,r,q=this
A.o(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.cD(s==null?q.b=A.o2():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.cD(r==null?q.c=A.o2():r,b)}else return q.e7(b)},
e7(a){var s,r,q,p=this
A.o(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.o2()
r=p.cK(a)
q=s[r]
if(q==null)s[r]=[p.bP(a)]
else{if(p.cP(q,a)>=0)return!1
q.push(p.bP(a))}return!0},
cD(a,b){A.o(this).c.a(b)
if(t.nF.a(a[b])!=null)return!1
a[b]=this.bP(b)
return!0},
bP(a){var s=this,r=new A.hR(A.o(s).c.a(a))
if(s.e==null)s.e=s.f=r
else s.f=s.f.b=r;++s.a
s.r=s.r+1&1073741823
return r},
cK(a){return J.b1(a)&1073741823},
cP(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.p(a[r].a,b))return r
return-1}}
A.hR.prototype={}
A.cA.prototype={
gq(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.e(A.a6(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.i("1?").a(r.a)
s.c=r.b
return!0}},
$iE:1}
A.x.prototype={
gt(a){return new A.V(a,this.gk(a),A.ae(a).i("V<x.E>"))},
L(a,b){return this.h(a,b)},
W(a,b){var s,r
A.ae(a).i("~(x.E)").a(b)
s=this.gk(a)
for(r=0;r<s;++r){b.$1(this.h(a,r))
if(s!==this.gk(a))throw A.e(A.a6(a))}},
gA(a){return this.gk(a)===0},
gI(a){return!this.gA(a)},
gv(a){if(this.gk(a)===0)throw A.e(A.aB())
return this.h(a,0)},
ga0(a){if(this.gk(a)===0)throw A.e(A.aB())
return this.h(a,this.gk(a)-1)},
u(a,b){var s,r=this.gk(a)
for(s=0;s<r;++s){if(J.p(this.h(a,s),b))return!0
if(r!==this.gk(a))throw A.e(A.a6(a))}return!1},
aG(a,b){var s,r
A.ae(a).i("H(x.E)").a(b)
s=this.gk(a)
for(r=0;r<s;++r){if(!b.$1(this.h(a,r)))return!1
if(s!==this.gk(a))throw A.e(A.a6(a))}return!0},
cp(a,b){return new A.bs(a,b.i("bs<0>"))},
aI(a,b,c){var s=A.ae(a)
return new A.ao(a,s.E(c).i("1(x.E)").a(b),s.i("@<x.E>").E(c).i("ao<1,2>"))},
T(a,b){return A.cn(a,b,null,A.ae(a).i("x.E"))},
dU(a,b){return A.cn(a,0,A.f2(b,"count",t.S),A.ae(a).i("x.E"))},
dW(a){var s,r=A.pf(A.ae(a).i("x.E"))
for(s=0;s<this.gk(a);++s)r.l(0,this.h(a,s))
return r},
bn(a,b){return new A.bd(a,A.ae(a).i("@<x.E>").E(b).i("bd<1,2>"))},
G(a,b,c){var s,r=this.gk(a)
if(c==null)c=r
A.aq(b,c,r)
s=A.a7(this.b4(a,b,c),A.ae(a).i("x.E"))
return s},
a3(a,b){return this.G(a,b,null)},
b4(a,b,c){A.aq(b,c,this.gk(a))
return A.cn(a,b,c,A.ae(a).i("x.E"))},
bp(a,b,c,d){var s
A.ae(a).i("x.E?").a(d)
A.aq(b,c,this.gk(a))
for(s=b;s<c;++s)this.m(a,s,d)},
a1(a,b,c,d,e){var s,r,q,p,o
A.ae(a).i("f<x.E>").a(d)
A.aq(b,c,this.gk(a))
s=c-b
if(s===0)return
A.ap(e,"skipCount")
if(t.j.b(d)){r=e
q=d}else{q=J.cG(d,e).aJ(0,!1)
r=0}p=J.t(q)
if(r+s>p.gk(q))throw A.e(A.p6())
if(r<b)for(o=s-1;o>=0;--o)this.m(a,b+o,p.h(q,r+o))
else for(o=0;o<s;++o)this.m(a,b+o,p.h(q,r+o))},
Z(a,b,c,d){return this.a1(a,b,c,d,0)},
aH(a,b,c){var s
if(c<0)c=0
for(s=c;s<this.gk(a);++s)if(J.p(this.h(a,s),b))return s
return-1},
by(a,b,c){var s,r
A.ae(a).i("f<x.E>").a(c)
if(t.j.b(c))this.Z(a,b,b+c.length,c)
else for(s=J.M(c);s.n();b=r){r=b+1
this.m(a,b,s.gq())}},
p(a){return A.nP(a,"[","]")},
$iu:1,
$if:1,
$il:1}
A.I.prototype={
bo(a,b,c){var s=A.o(this)
return A.ph(this,s.i("I.K"),s.i("I.V"),b,c)},
W(a,b){var s,r,q,p=A.o(this)
p.i("~(I.K,I.V)").a(b)
for(s=this.ga_(),s=s.gt(s),p=p.i("I.V");s.n();){r=s.gq()
q=this.h(0,r)
b.$2(r,q==null?p.a(q):q)}},
gaj(){return this.ga_().aI(0,new A.jf(this),A.o(this).i("a2<I.K,I.V>"))},
K(a){return this.ga_().u(0,a)},
gk(a){var s=this.ga_()
return s.gk(s)},
gA(a){var s=this.ga_()
return s.gA(s)},
gI(a){var s=this.ga_()
return s.gI(s)},
gaw(){return new A.eF(this,A.o(this).i("eF<I.K,I.V>"))},
p(a){return A.nV(this)},
$iW:1}
A.jf.prototype={
$1(a){var s=this.a,r=A.o(s)
r.i("I.K").a(a)
s=s.h(0,a)
if(s==null)s=r.i("I.V").a(s)
return new A.a2(a,s,r.i("a2<I.K,I.V>"))},
$S(){return A.o(this.a).i("a2<I.K,I.V>(I.K)")}}
A.jg.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.w(a)
r.a=(r.a+=s)+": "
s=A.w(b)
r.a+=s},
$S:31}
A.eF.prototype={
gk(a){var s=this.a
return s.gk(s)},
gA(a){var s=this.a
return s.gA(s)},
gI(a){var s=this.a
return s.gI(s)},
gv(a){var s=this.a,r=s.ga_()
r=s.h(0,r.gv(r))
return r==null?this.$ti.y[1].a(r):r},
gt(a){var s=this.a,r=s.ga_()
return new A.eG(r.gt(r),s,this.$ti.i("eG<1,2>"))}}
A.eG.prototype={
n(){var s=this,r=s.a
if(r.n()){s.c=s.b.h(0,r.gq())
return!0}s.c=null
return!1},
gq(){var s=this.c
return s==null?this.$ti.y[1].a(s):s},
$iE:1}
A.bm.prototype={
gA(a){return this.gk(this)===0},
gI(a){return this.gk(this)!==0},
p(a){return A.nP(this,"{","}")},
T(a,b){return A.pv(this,b,A.o(this).c)},
gv(a){var s=this.gt(this)
if(!s.n())throw A.e(A.aB())
return s.gq()},
L(a,b){var s,r
A.ap(b,"index")
s=this.gt(this)
for(r=b;s.n();){if(r===0)return s.gq();--r}throw A.e(A.j4(b,b-r,this,"index"))},
$iu:1,
$if:1,
$ibQ:1}
A.eM.prototype={}
A.hO.prototype={
h(a,b){var s,r=this.b
if(r==null)return this.c.h(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.fg(b):s}},
gk(a){return this.b==null?this.c.a:this.aR().length},
gA(a){return this.gk(0)===0},
gI(a){return this.gk(0)>0},
ga_(){if(this.b==null){var s=this.c
return new A.ag(s,A.o(s).i("ag<1>"))}return new A.hP(this)},
gaw(){var s,r=this
if(r.b==null){s=r.c
return new A.aU(s,A.o(s).i("aU<2>"))}return A.pi(r.aR(),new A.kZ(r),t.N,t.z)},
K(a){if(this.b==null)return this.c.K(a)
if(typeof a!="string")return!1
return Object.prototype.hasOwnProperty.call(this.a,a)},
W(a,b){var s,r,q,p,o=this
t.jQ.a(b)
if(o.b==null)return o.c.W(0,b)
s=o.aR()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.ls(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.e(A.a6(o))}},
aR(){var s=t.g.a(this.c)
if(s==null)s=this.c=A.c(Object.keys(this.a),t.s)
return s},
fg(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.ls(this.a[a])
return this.b[a]=s}}
A.kZ.prototype={
$1(a){return this.a.h(0,A.S(a))},
$S:32}
A.hP.prototype={
gk(a){return this.a.gk(0)},
L(a,b){var s=this.a
if(s.b==null)s=s.ga_().L(0,b)
else{s=s.aR()
if(!(b>=0&&b<s.length))return A.a(s,b)
s=s[b]}return s},
gt(a){var s=this.a
if(s.b==null){s=s.ga_()
s=s.gt(s)}else{s=s.aR()
s=new J.aO(s,s.length,A.L(s).i("aO<1>"))}return s},
u(a,b){return this.a.K(b)}}
A.lf.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:true})
return s}catch(r){}return null},
$S:25}
A.le.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:false})
return s}catch(r){}return null},
$S:25}
A.cO.prototype={}
A.fl.prototype={}
A.ft.prototype={}
A.e0.prototype={
p(a){var s=A.fu(this.a)
return(this.b!=null?"Converting object to an encodable object failed:":"Converting object did not return an encodable object:")+" "+s}}
A.fL.prototype={
p(a){return"Cyclic error in JSON stringify"}}
A.fK.prototype={
h3(a,b){var s=A.vy(a,this.gh5().a)
return s},
aa(a,b){var s=A.uk(a,this.gh9().b,null)
return s},
h8(a){return this.aa(a,null)},
gh9(){return B.aC},
gh5(){return B.aB}}
A.j9.prototype={}
A.j8.prototype={}
A.l0.prototype={
dY(a){var s,r,q,p,o,n,m=a.length
for(s=this.c,r=0,q=0;q<m;++q){p=a.charCodeAt(q)
if(p>92){if(p>=55296){o=p&64512
if(o===55296){n=q+1
n=!(n<m&&(a.charCodeAt(n)&64512)===56320)}else n=!1
if(!n)if(o===56320){o=q-1
o=!(o>=0&&(a.charCodeAt(o)&64512)===55296)}else o=!1
else o=!0
if(o){if(q>r)s.a+=B.d.a4(a,r,q)
r=q+1
o=A.X(92)
s.a+=o
o=A.X(117)
s.a+=o
o=A.X(100)
s.a+=o
o=p>>>8&15
o=A.X(o<10?48+o:87+o)
s.a+=o
o=p>>>4&15
o=A.X(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.X(o<10?48+o:87+o)
s.a+=o}}continue}if(p<32){if(q>r)s.a+=B.d.a4(a,r,q)
r=q+1
o=A.X(92)
s.a+=o
switch(p){case 8:o=A.X(98)
s.a+=o
break
case 9:o=A.X(116)
s.a+=o
break
case 10:o=A.X(110)
s.a+=o
break
case 12:o=A.X(102)
s.a+=o
break
case 13:o=A.X(114)
s.a+=o
break
default:o=A.X(117)
s.a+=o
o=A.X(48)
s.a=(s.a+=o)+o
o=p>>>4&15
o=A.X(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.X(o<10?48+o:87+o)
s.a+=o
break}}else if(p===34||p===92){if(q>r)s.a+=B.d.a4(a,r,q)
r=q+1
o=A.X(92)
s.a+=o
o=A.X(p)
s.a+=o}}if(r===0)s.a+=a
else if(r<m)s.a+=B.d.a4(a,r,m)},
bG(a){var s,r,q,p
for(s=this.a,r=s.length,q=0;q<r;++q){p=s[q]
if(a==null?p==null:a===p)throw A.e(new A.fL(a,null))}B.a.l(s,a)},
bw(a){var s,r,q,p,o=this
if(o.dX(a))return
o.bG(a)
try{s=o.b.$1(a)
if(!o.dX(s)){q=A.pb(a,null,o.gd0())
throw A.e(q)}q=o.a
if(0>=q.length)return A.a(q,-1)
q.pop()}catch(p){r=A.b9(p)
q=A.pb(a,r,o.gd0())
throw A.e(q)}},
dX(a){var s,r,q=this
if(typeof a=="number"){if(!isFinite(a))return!1
q.c.a+=B.c.p(a)
return!0}else if(a===!0){q.c.a+="true"
return!0}else if(a===!1){q.c.a+="false"
return!0}else if(a==null){q.c.a+="null"
return!0}else if(typeof a=="string"){s=q.c
s.a+='"'
q.dY(a)
s.a+='"'
return!0}else if(t.j.b(a)){q.bG(a)
q.hZ(a)
s=q.a
if(0>=s.length)return A.a(s,-1)
s.pop()
return!0}else if(t.f.b(a)){q.bG(a)
r=q.i_(a)
s=q.a
if(0>=s.length)return A.a(s,-1)
s.pop()
return r}else return!1},
hZ(a){var s,r,q=this.c
q.a+="["
s=J.t(a)
if(s.gI(a)){this.bw(s.h(a,0))
for(r=1;r<s.gk(a);++r){q.a+=","
this.bw(s.h(a,r))}}q.a+="]"},
i_(a){var s,r,q,p,o,n,m=this,l={}
if(a.gA(a)){m.c.a+="{}"
return!0}s=a.gk(a)*2
r=A.N(s,null,!1,t.O)
q=l.a=0
l.b=!0
a.W(0,new A.l1(l,r))
if(!l.b)return!1
p=m.c
p.a+="{"
for(o='"';q<s;q+=2,o=',"'){p.a+=o
m.dY(A.S(r[q]))
p.a+='":'
n=q+1
if(!(n<s))return A.a(r,n)
m.bw(r[n])}p.a+="}"
return!0}}
A.l1.prototype={
$2(a,b){var s,r
if(typeof a!="string")this.a.b=!1
s=this.b
r=this.a
B.a.m(s,r.a++,a)
B.a.m(s,r.a++,b)},
$S:31}
A.l_.prototype={
gd0(){var s=this.c.a
return s.charCodeAt(0)==0?s:s}}
A.hr.prototype={
dz(a){t.L.a(a)
return B.d5.c5(a)}}
A.ky.prototype={
c5(a){var s,r,q,p=a.length,o=A.aq(0,null,p)
if(o===0)return new Uint8Array(0)
s=new Uint8Array(o*3)
r=new A.lg(s)
if(r.eM(a,0,o)!==o){q=o-1
if(!(q>=0&&q<p))return A.a(a,q)
r.bU()}return B.j.G(s,0,r.b)}}
A.lg.prototype={
bU(){var s,r=this,q=r.c,p=r.b,o=r.b=p+1
q.$flags&2&&A.y(q)
s=q.length
if(!(p<s))return A.a(q,p)
q[p]=239
p=r.b=o+1
if(!(o<s))return A.a(q,o)
q[o]=191
r.b=p+1
if(!(p<s))return A.a(q,p)
q[p]=189},
fS(a,b){var s,r,q,p,o,n=this
if((b&64512)===56320){s=65536+((a&1023)<<10)|b&1023
r=n.c
q=n.b
p=n.b=q+1
r.$flags&2&&A.y(r)
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
return!0}else{n.bU()
return!1}},
eM(a,b,c){var s,r,q,p,o,n,m,l,k=this
if(b!==c){s=c-1
if(!(s>=0&&s<a.length))return A.a(a,s)
s=(a.charCodeAt(s)&64512)===55296}else s=!1
if(s)--c
for(s=k.c,r=s.$flags|0,q=s.length,p=a.length,o=b;o<c;++o){if(!(o<p))return A.a(a,o)
n=a.charCodeAt(o)
if(n<=127){m=k.b
if(m>=q)break
k.b=m+1
r&2&&A.y(s)
s[m]=n}else{m=n&64512
if(m===55296){if(k.b+4>q)break
m=o+1
if(!(m<p))return A.a(a,m)
if(k.fS(n,a.charCodeAt(m)))o=m}else if(m===56320){if(k.b+3>q)break
k.bU()}else if(n<=2047){m=k.b
l=m+1
if(l>=q)break
k.b=l
r&2&&A.y(s)
if(!(m<q))return A.a(s,m)
s[m]=n>>>6|192
k.b=l+1
s[l]=n&63|128}else{m=k.b
if(m+2>=q)break
l=k.b=m+1
r&2&&A.y(s)
if(!(m<q))return A.a(s,m)
s[m]=n>>>12|224
m=k.b=l+1
if(!(l<q))return A.a(s,l)
s[l]=n>>>6&63|128
k.b=m+1
if(!(m<q))return A.a(s,m)
s[m]=n&63|128}}}return o}}
A.kx.prototype={
c5(a){return new A.ld(this.a).eE(t.L.a(a),0,null,!0)}}
A.ld.prototype={
eE(a,b,c,d){var s,r,q,p,o,n,m,l=this
t.L.a(a)
s=A.aq(b,c,a.length)
if(b===s)return""
if(a instanceof Uint8Array){r=a
q=r
p=0}else{q=A.uG(a,b,s)
s-=b
p=b
b=0}if(s-b>=15){o=l.a
n=A.uF(o,q,b,s)
if(n!=null){if(!o)return n
if(n.indexOf("\ufffd")<0)return n}}n=l.bI(q,b,s,!0)
o=l.b
if((o&1)!==0){m=A.uH(o)
l.b=0
throw A.e(A.iJ(m,a,p+l.c))}return n},
bI(a,b,c,d){var s,r,q=this
if(c-b>1000){s=B.b.U(b+c,2)
r=q.bI(a,b,s,!1)
if((q.b&1)!==0)return r
return r+q.bI(a,s,c,d)}return q.h4(a,b,c,d)},
h4(a,b,a0,a1){var s,r,q,p,o,n,m,l,k=this,j="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFFFFFFFFFFFFFFFFGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHIHHHJEEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBKCCCCCCCCCCCCDCLONNNMEEEEEEEEEEE",i=" \x000:XECCCCCN:lDb \x000:XECCCCCNvlDb \x000:XECCCCCN:lDb AAAAA\x00\x00\x00\x00\x00AAAAA00000AAAAA:::::AAAAAGG000AAAAA00KKKAAAAAG::::AAAAA:IIIIAAAAA000\x800AAAAA\x00\x00\x00\x00 AAAAA",h=65533,g=k.b,f=k.c,e=new A.bo(""),d=b+1,c=a.length
if(!(b>=0&&b<c))return A.a(a,b)
s=a[b]
A:for(r=k.a;;){for(;;d=o){if(!(s>=0&&s<256))return A.a(j,s)
q=j.charCodeAt(s)&31
f=g<=32?s&61694>>>q:(s&63|f<<6)>>>0
p=g+q
if(!(p>=0&&p<144))return A.a(i,p)
g=i.charCodeAt(p)
if(g===0){p=A.X(f)
e.a+=p
if(d===a0)break A
break}else if((g&1)!==0){if(r)switch(g){case 69:case 67:p=A.X(h)
e.a+=p
break
case 65:p=A.X(h)
e.a+=p;--d
break
default:p=A.X(h)
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
p=A.X(a[l])
e.a+=p}else{p=A.jT(a,d,n)
e.a+=p}if(n===a0)break A
d=o}else d=o}if(a1&&g>32)if(r){c=A.X(h)
e.a+=c}else{k.b=77
k.c=a0
return""}k.b=g
k.c=f
c=e.a
return c.charCodeAt(0)==0?c:c}}
A.b2.prototype={
D(a,b){if(b==null)return!1
return b instanceof A.b2&&this.a===b.a},
gO(a){return B.b.gO(this.a)},
ac(a,b){return B.b.ac(this.a,t.jS.a(b).a)},
p(a){var s,r,q,p=this.a,o=p%36e8,n=B.b.U(o,6e7)
o%=6e7
s=n<10?"0":""
r=B.b.U(o,1e6)
q=r<10?"0":""
return""+(p/36e8|0)+":"+s+n+":"+q+r+"."+B.d.dK(B.b.p(o%1e6),6,"0")},
$iaQ:1}
A.hC.prototype={
p(a){return this.aq()},
$ic6:1}
A.P.prototype={
gaL(){return A.tG(this)}}
A.f8.prototype={
p(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.fu(s)
return"Assertion failed"}}
A.bq.prototype={}
A.aN.prototype={
gbK(){return"Invalid argument"+(!this.a?"(s)":"")},
gbJ(){return""},
p(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+A.w(p),n=s.gbK()+q+o
if(!s.a)return n
return n+s.gbJ()+": "+A.fu(s.gcd())},
gcd(){return this.b}}
A.ei.prototype={
gcd(){return A.q0(this.b)},
gbK(){return"RangeError"},
gbJ(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.w(q):""
else if(q==null)s=": Not greater than or equal to "+A.w(r)
else if(q>r)s=": Not in inclusive range "+A.w(r)+".."+A.w(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.w(r)
return s}}
A.fD.prototype={
gcd(){return A.Q(this.b)},
gbK(){return"RangeError"},
gbJ(){if(A.Q(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
gk(a){return this.f}}
A.ew.prototype={
p(a){return"Unsupported operation: "+this.a}}
A.hp.prototype={
p(a){return"UnimplementedError: "+this.a}}
A.bR.prototype={
p(a){return"Bad state: "+this.a}}
A.fh.prototype={
p(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.fu(s)+"."}}
A.fX.prototype={
p(a){return"Out of Memory"},
gaL(){return null},
$iP:1}
A.eq.prototype={
p(a){return"Stack Overflow"},
gaL(){return null},
$iP:1}
A.kH.prototype={
p(a){return"Exception: "+this.a}}
A.dU.prototype={
p(a){var s,r,q,p,o,n,m,l,k,j,i,h=this.a,g=""!==h?"FormatException: "+h:"FormatException",f=this.c,e=this.b
if(typeof e=="string"){if(f!=null)s=f<0||f>e.length
else s=!1
if(s)f=null
if(f==null){if(e.length>78)e=B.d.a4(e,0,75)+"..."
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
k=""}return g+l+B.d.a4(e,i,j)+k+"\n"+B.d.ao(" ",f-i+l.length)+"^\n"}else return f!=null?g+(" (at offset "+A.w(f)+")"):g}}
A.f.prototype={
bn(a,b){return A.dH(this,A.o(this).i("f.E"),b)},
aI(a,b,c){var s=A.o(this)
return A.pi(this,s.E(c).i("1(f.E)").a(b),s.i("f.E"),c)},
cp(a,b){return new A.bs(this,b.i("bs<0>"))},
u(a,b){var s
for(s=this.gt(this);s.n();)if(J.p(s.gq(),b))return!0
return!1},
W(a,b){var s
A.o(this).i("~(f.E)").a(b)
for(s=this.gt(this);s.n();)b.$1(s.gq())},
aG(a,b){var s
A.o(this).i("H(f.E)").a(b)
for(s=this.gt(this);s.n();)if(!b.$1(s.gq()))return!1
return!0},
a7(a,b){var s,r,q=this.gt(this)
if(!q.n())return""
s=J.ba(q.gq())
if(!q.n())return s
if(b.length===0){r=s
do r+=J.ba(q.gq())
while(q.n())}else{r=s
do r=r+b+J.ba(q.gq())
while(q.n())}return r.charCodeAt(0)==0?r:r},
dj(a,b){var s
A.o(this).i("H(f.E)").a(b)
for(s=this.gt(this);s.n();)if(b.$1(s.gq()))return!0
return!1},
aJ(a,b){var s=A.o(this).i("f.E")
if(b)s=A.a7(this,s)
else{s=A.a7(this,s)
s.$flags=1
s=s}return s},
dV(a){return this.aJ(0,!0)},
gk(a){var s,r=this.gt(this)
for(s=0;r.n();)++s
return s},
gA(a){return!this.gt(this).n()},
gI(a){return!this.gA(this)},
T(a,b){return A.pv(this,b,A.o(this).i("f.E"))},
gv(a){var s=this.gt(this)
if(!s.n())throw A.e(A.aB())
return s.gq()},
L(a,b){var s,r
A.ap(b,"index")
s=this.gt(this)
for(r=b;s.n();){if(r===0)return s.gq();--r}throw A.e(A.j4(b,b-r,this,"index"))},
p(a){return A.tc(this,"(",")")}}
A.a2.prototype={
p(a){return"MapEntry("+A.w(this.a)+": "+A.w(this.b)+")"}}
A.a0.prototype={
gO(a){return A.n.prototype.gO.call(this,0)},
p(a){return"null"}}
A.n.prototype={$in:1,
D(a,b){return this===b},
gO(a){return A.d5(this)},
p(a){return"Instance of '"+A.h2(this)+"'"},
gS(a){return A.wa(this)},
toString(){return this.p(this)}}
A.hY.prototype={
p(a){return""},
$iaW:1}
A.cm.prototype={
gt(a){return new A.d6(this.a)}}
A.d6.prototype={
gq(){return this.d},
n(){var s,r,q,p=this,o=p.b=p.c,n=p.a,m=n.length
if(o===m){p.d=-1
return!1}if(!(o<m))return A.a(n,o)
s=n.charCodeAt(o)
r=o+1
if((s&64512)===55296&&r<m){if(!(r<m))return A.a(n,r)
q=n.charCodeAt(r)
if((q&64512)===56320){p.c=r+1
p.d=A.uW(s,q)
return!0}}p.c=r
p.d=s
return!0},
$iE:1}
A.bo.prototype={
gk(a){return this.a.length},
p(a){var s=this.a
return s.charCodeAt(0)==0?s:s},
$itY:1}
A.mU.prototype={
$0(){var s=v.G.performance
if(t.m.b(s))if(s.measure!=null&&s.mark!=null&&s.clearMeasures!=null&&s.clearMarks!=null)return s
return null},
$S:64}
A.lG.prototype={
$0(){var s=v.G.JSON
if(t.m.b(s))return s
throw A.e(A.aK("Missing JSON.parse() support"))},
$S:66}
A.jl.prototype={
p(a){return"Promise was rejected with a value of `"+(this.a?"undefined":"null")+"`."}}
A.ns.prototype={
$1(a){return this.a.c3(this.b.i("0/?").a(a))},
$S:19}
A.nt.prototype={
$1(a){if(a==null)return this.a.dv(new A.jl(a===undefined))
return this.a.dv(a)},
$S:19}
A.bS.prototype={
aq(){return"TextAlign."+this.b}}
A.iB.prototype={
$2(a,b){var s=t.dt
s=s.a(a).b-s.a(b).b
if(s>0)return 1
else if(s<0)return-1
return 0},
$S:73}
A.bw.prototype={}
A.bP.prototype={
ghl(){var s,r,q,p,o,n,m,l,k,j,i=this.c
if(i==null){i=this.a.aZ(1751474532)
s=i.b
if(!i.V(s,54))A.k(B.O)
r=s+12
i.j(r,4)
q=i.a
p=q.getUint32(r,!1)
if(p!==1594834165)A.k(A.h("head.magicNumber is 0x"+B.b.b0(p,16)+", not 0x5F0F3CF5"))
r=s+18
i.j(r,2)
o=q.getUint16(r,!1)
if(o<16||o>16384)A.k(A.h("head.unitsPerEm "+o+" is outside the legal 16\u202616384"))
r=s+50
i.j(r,2)
n=q.getInt16(r,!1)
if(n!==0&&n!==1)A.k(A.h("head.indexToLocFormat "+n+" is neither short nor long"))
i.j(s,2)
q.getUint16(s,!1)
r=s+2
i.j(r,2)
q.getUint16(r,!1)
r=s+4
i.j(r,4)
q.getUint32(r,!1)
r=s+8
i.j(r,4)
q.getUint32(r,!1)
r=s+16
i.j(r,2)
q.getUint16(r,!1)
A.j_(i,s+20)
A.j_(i,s+28)
r=s+36
i.j(r,2)
r=q.getInt16(r,!1)
m=s+38
i.j(m,2)
m=q.getInt16(m,!1)
l=s+40
i.j(l,2)
l=q.getInt16(l,!1)
k=s+42
i.j(k,2)
k=q.getInt16(k,!1)
j=s+44
i.j(j,2)
q.getUint16(j,!1)
j=s+46
i.j(j,2)
q.getUint16(j,!1)
j=s+48
i.j(j,2)
q.getInt16(j,!1)
j=s+52
i.j(j,2)
q.getInt16(j,!1)
k=this.c=new A.fA(o,r,m,l,k,n)
i=k}return i},
gdt(){var s=this.e
return s==null?this.e=A.dL(this.a.aZ(1668112752)):s},
df(a,b){var s=this.a.aZ(a),r=s.b+b
s.j(r,2)
return s.a.getUint16(r,!1)},
ghn(){var s,r=this
if(r.ay)return r.ax
r.ay=!0
s=r.a.bu(1213612370)
if(s==null)return null
return r.ax=A.t9(s)},
gct(){var s=this.CW
return s==null?this.CW=this.bd(1196643650,A.we(),t.b0):s},
gcs(){var s=this.cx
return s==null?this.cx=this.bd(1196445523,A.wd(),t.eb):s},
bX(a){var s,r,q,p,o,n=this,m=n.f
if(m==null){m=n.a.aZ(1752003704)
s=n.df(1751672161,34)
r=n.d
m=n.f=A.t5(m,r==null?n.d=n.df(1835104368,4):r,s)}q=m.bX(a)
p=n.b
if(p==null)return q
o=n.ghn()
if(o==null)return q
return q+B.c.ah(o.h6(a,p))},
hF(a){var s,r=this
t.eM.a(a)
s=r.Q
if(s==null)s=r.Q=r.bd(1719034226,A.w6(),t.kH)
if(s==null)return B.ca
return s.hE(a,r.a.bu(1635148146))},
bd(a,b,c){var s
c.i("0(j)").a(b)
s=this.a.bu(a)
return s==null?null:b.$1(s)}}
A.hg.prototype={
p(a){return A.ay(this.a)+"@"+this.c+"+"+this.d},
gk(a){return this.d}}
A.jL.prototype={
bu(a){var s=this.c.h(0,a)
return s==null?null:new A.j(this.a.a,s.c)},
aZ(a){var s=this.bu(a)
if(s==null)throw A.e(A.h("font has no "+A.ay(A.co(a))+" table"))
return s}}
A.iu.prototype={
gdD(){var s=this.d
return s.a===3&&s.b===0},
a8(a){var s,r
if(a<0)return 0
s=this.a
r=s.a8(a)
if(r!==0||!this.gdD())return r
if(a<=255)return s.a8(61440+a)
return 0},
p(a){var s=this.d,r=this.gdD()?", symbolic":""
return"CmapTable(platform "+s.a+", encoding "+s.b+", format "+s.d+r+")"}}
A.iv.prototype={
$2(a,b){var s=t.aq
s.a(a)
s.a(b)
return B.b.ac(a.gd5(),b.gd5())},
$S:39}
A.be.prototype={
gd5(){var s,r,q,p,o,n,m,l,k,j,i,h=null,g=this.a,f=this.b
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
p(a){return"cmap("+this.a+","+this.b+") format "+this.d}}
A.hF.prototype={
a8(a){var s
if(a>=0&&a<256){s=this.a
if(!(a>=0&&a<s.length))return A.a(s,a)
s=s[a]}else s=0
return s},
$idg:1}
A.hH.prototype={
a8(a){var s,r,q,p,o,n,m,l,k,j,i=this
if(a<0||a>65535)return 0
s=i.a
r=s.length
q=r-1
for(p=0,o=-1;p<=q;){n=B.b.J(p+q,1)
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
s.j(k,2)
j=s.a.getUint16(k,!1)
return j===0?0:j+m&65535},
$idg:1}
A.hI.prototype={
a8(a){var s,r=a-this.a
if(r>=0&&r<this.b.length){s=this.b
if(!(r>=0&&r<s.length))return A.a(s,r)
s=s[r]}else s=0
return s},
$idg:1}
A.hG.prototype={
a8(a){var s,r,q,p,o,n=this,m=n.a,l=m.length,k=l-1
for(s=n.b,r=s.length,q=0;q<=k;){p=B.b.J(q+k,1)
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
$idg:1}
A.kI.prototype={}
A.fA.prototype={
p(a){var s=this,r=s.ay===0?"short":"long"
return"HeadTable(unitsPerEm: "+s.f+", loca: "+r+", bbox: "+s.x+" "+s.y+" "+s.z+" "+s.Q+")"}}
A.j1.prototype={
bX(a){var s,r,q
if(a>=0){s=this.a.length
s=a>=s+this.c.length||s===0}else s=!0
if(s)return 0
s=this.a
r=s.length
q=a<r?a:r-1
if(!(q>=0&&q<r))return A.a(s,q)
return s[q]},
p(a){var s=this.a.length
return"HmtxTable("+(s+this.c.length)+" glyphs, "+s+" metric pairs)"}}
A.dE.prototype={
p(a){return A.w(this.a)+"\u2192"+A.w(this.b)}}
A.i8.prototype={
hz(a,b,c){var s,r,q,p,o,n=this.b,m=n.length
if(b>=m)return c
if(!(b<m))return A.a(n,b)
s=n[b]
n=s.length
if(n<2)return c
if(c<=B.a.gv(s).a)return B.a.gv(s).b
for(r=1;r<n;++r){q=s[r]
m=q.a
if(c>m)continue
p=s[r-1]
n=p.a
o=m-n
if(o<=0)return q.b
m=p.b
return m+(c-n)/o*(q.b-m)}return B.a.ga0(s).b}}
A.db.prototype={
p(a){var s=this
return"VariationAxis("+A.ay(s.a)+" "+A.w(s.b)+"/"+A.w(s.c)+"/"+A.w(s.d)+")"}}
A.d3.prototype={
p(a){return"NamedInstance("+A.w(this.a)+")"}}
A.cW.prototype={
hE(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g
t.eM.a(a)
s=this.a
r=s.length
q=A.N(r,0,!1,t.i)
for(p=0;p<r;++p){o=s[p]
n=a.h(0,A.ay(o.a))
if(n==null)n=o.c
m=o.b
l=o.d
k=B.c.F(n,m,l)
n=o.c
if(k<n){j=n-m
i=j>0?(k-n)/j:0}else if(k>n){j=l-n
i=j>0?(k-n)/j:0}else i=0
h=B.c.av(i*16384)/16384
if(h<-1)n=-1
else n=h>1?1:h
B.a.m(q,p,n)}if(b!=null){g=A.rd(b)
for(p=0;p<r;++p){h=B.c.av(g.hz(0,p,q[p])*16384)/16384
if(h<-1)s=-1
else s=h>1?1:h
B.a.m(q,p,s)}}return q}}
A.iL.prototype={
$1(a){var s,r,q,p,o,n,m=this.a+a*this.b,l=this.c
l.j(m,4)
s=l.a
r=s.getUint32(m,!1)
q=m+4
l.j(q,4)
q=s.getInt32(q,!1)
p=m+8
l.j(p,4)
p=s.getInt32(p,!1)
o=m+12
l.j(o,4)
o=s.getInt32(o,!1)
n=m+16
l.j(n,2)
s.getUint16(n,!1)
n=m+18
l.j(n,2)
s.getUint16(n,!1)
return new A.db(r,q/65536,p/65536,o/65536)},
$S:44}
A.iM.prototype={
$1(a){var s,r,q,p,o,n,m,l,k=this,j=k.a+a*k.b
if(k.c){s=k.d
r=j+4+k.e*4
s.j(r,2)
s.a.getUint16(r,!1)}s=k.d
s.j(j,2)
r=s.a
r.getUint16(j,!1)
q=j+2
s.j(q,2)
r.getUint16(q,!1)
p=k.e
o=J.aJ(p,t.i)
for(q=j+4,n=0;n<p;++n){m=q+n*4
if(m>=0)l=m+4<=r.byteLength
else l=!1
if(!l)A.k(A.h("read of 4 byte(s) at "+m+" overruns a "+s.gk(0)+"-byte font"))
o[n]=r.getInt32(m,!1)/65536}return new A.d3(o)},
$S:45}
A.hU.prototype={
e_(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
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
A.hN.prototype={}
A.iA.prototype={
gk(a){return this.c},
h(a,b){var s,r,q,p,o,n,m,l,k=this,j=k.c
if(j===0)return new A.G(0,b)
if(b>=j)s=j-1
else s=b<0?0:b
j=k.d
r=k.b+s*j
for(q=k.a,p=q.a,o=0,n=0;n<j;++n){m=r+n
if(m>=0)l=m+1<=p.byteLength
else l=!1
if(!l)A.k(A.h("read of 1 byte(s) at "+m+" overruns a "+q.gk(0)+"-byte font"))
o=(o<<8|p.getUint8(m))>>>0}j=k.e
return new A.G(B.b.bh(o,j),(o&B.b.ab(1,j)-1)>>>0)}}
A.fG.prototype={
c6(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e="read of 2 byte(s) at "
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
if(!h)A.k(A.h("read of 4 byte(s) at "+p+" overruns a "+n.gk(0)+"-byte font"))
g=k.getInt32(p,!1)
p+=4}else{if(p>=0)h=p+2<=k.byteLength
else h=!1
if(!h)A.k(A.h(e+p+" overruns a "+n.gk(0)+"-byte font"))
g=k.getInt16(p,!1)
p+=2}else if(m){if(p>=0)h=p+2<=k.byteLength
else h=!1
if(!h)A.k(A.h(e+p+" overruns a "+n.gk(0)+"-byte font"))
g=k.getInt16(p,!1)
p+=2}else{if(p>=0)h=p+1<=k.byteLength
else h=!1
if(!h)A.k(A.h("read of 1 byte(s) at "+p+" overruns a "+n.gk(0)+"-byte font"))
g=k.getInt8(p);++p}if(g===0)continue
h=s[i]
if(!(h<o.length))return A.a(o,h)
f=o[h].e_(c)
if(f!==0)j+=g*f}return j},
h6(a,b){var s,r
t.H.a(b)
s=this.d
if(s==null)return this.c6(0,a,b)
r=s.h(0,a)
return this.c6(r.a,r.b,b)}}
A.j5.prototype={
$1(a){var s,r=this.a,q=this.b+6+a*2
r.j(q,2)
s=r.a.getUint16(q,!1)
if(s>=this.c.length)throw A.e(A.h("region index "+s+" out of range"))
return s},
$S:15}
A.bB.prototype={}
A.hw.prototype={
N(a){return 0}}
A.hx.prototype={
N(a){var s,r=a-this.a
if(r>=0&&r<this.b.length){s=this.b
if(!(r>=0&&r<s.length))return A.a(s,r)
s=s[r]}else s=0
return s}}
A.hy.prototype={
N(a){var s,r,q,p,o=this.a,n=o.length,m=(n/3|0)-1
for(s=0;s<=m;){r=B.b.J(s+m,1)
q=r*3
if(!(q<n))return A.a(o,q)
if(a<o[q])m=r-1
else{p=q+1
if(!(p<n))return A.a(o,p)
if(a>o[p])s=r+1
else{p=q+2
if(!(p<n))return A.a(o,p)
return o[p]}}}return 0}}
A.fo.prototype={
hW(a){var s,r,q,p,o,n,m,l,k=this,j=k.c
if(j===32768)return 0
s=k.a
if(a<s||a>k.b)return 0
r=B.b.ab(1,j)
q=B.b.a5(16,r)
p=a-s
o=B.b.a5(p,q)
j=k.d
s=j.length
if(o>=s)return 0
n=B.b.Y(p,q)
m=B.b.ab(1,r)
if(!(o>=0))return A.a(j,o)
l=B.b.fA(j[o],16-r*(n+1))&m-1
return l>=B.b.ad(1,r-1)?l-m:l},
p(a){var s=this.c,r=""+this.a,q=""+this.b
return s===32768?"VariationIndex("+r+"/"+q+")":"Device("+r+"\u2026"+q+", fmt "+s+")"}}
A.cH.prototype={
p(a){return"Anchor("+this.a+","+this.b+")"}}
A.bf.prototype={}
A.hA.prototype={
C(a){var s,r,q,p=this.a,o=p.length,n=o-1
for(s=0;s<=n;){r=B.b.J(s+n,1)
if(!(r<o))return A.a(p,r)
q=p[r]
if(a<q)n=r-1
else if(a>q)s=r+1
else return r}return-1}}
A.hB.prototype={
C(a){var s,r,q,p,o,n=this.a,m=n.length,l=(m/3|0)-1
for(s=0;s<=l;){r=B.b.J(s+l,1)
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
A.cX.prototype={
hs(a,b){var s,r,q,p,o,n=this.r
if(n!=null)s=a>=n.length
else s=!0
if(s)return!1
if(!(a<n.length))return A.a(n,a)
r=n[a]
if(r==null){s=this.a
q=this.d
p=q+4+a*4
s.j(p,4)
s=s.a
o=s.getUint32(p,!1)
if(o===0)return!1
r=A.O(new A.j(s,q+o))
B.a.m(n,a,r)}return r.C(b)>=0},
ghX(){var s,r=this
if(r.z)return r.y
r.z=!0
s=r.f
if(s===0)return null
return r.y=A.p5(new A.j(r.a.a,s))},
p(a){return"GdefTable(1."+this.w+")"}}
A.c8.prototype={
dG(a){var s=this.b,r=this.a.w
if(!(a>=0&&a<r.length))return A.a(r,a)
r=r[a]+2
s.j(r,2)
return s.a.getUint16(r,!1)},
dH(a){var s,r,q,p=this.a.w
if(!(a>=0&&a<p.length))return A.a(p,a)
s=p[a]
p=this.b
r=s+2
p.j(r,2)
q=p.a
if((q.getUint16(r,!1)&16)===0)return 0
r=s+4
p.j(r,2)
r=s+6+q.getUint16(r,!1)*2
p.j(r,2)
return q.getUint16(r,!1)},
cz(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this.c
if(!(a>=0&&a<g.length))return A.a(g,a)
s=g[a]
if(s!=null)return s
r=this.a.w
if(!(a<r.length))return A.a(r,a)
q=r[a]
r=this.b
r.j(q,2)
p=r.a
o=p.getUint16(q,!1)
n=q+4
r.j(n,2)
m=p.getUint16(n,!1)
l=A.c([],t.fT)
for(n=q+6,k=0;k<m;++k){j=n+k*2
if(j>=0)i=j+2<=p.byteLength
else i=!1
if(!i)A.k(A.h("read of 2 byte(s) at "+j+" overruns a "+r.gk(0)+"-byte font"))
h=A.qv(o,new A.j(p,q+p.getUint16(j,!1)),9)
B.a.l(l,A.rW(h.a,h.b))}B.a.m(g,a,l)
return l},
fY(a,b,c,d,e){var s,r,q,p,o,n,m,l=this
t.nE.a(c)
if(a<0||a>=l.a.w.length)return!1
s=l.cz(a)
if(s.length===0||b.a.length===0)return!1
r=new A.iX(b,l,e,d,c,0,0)
q=l.dG(a)
p=l.dH(a)
r.x=q
r.y=p
for(q=b.a,o=!1,p=0;n=q.length,p<n;){if(!(p>=0))return A.a(q,p)
m=q[p]
if((m.y&e)>>>0!==0){n=r.Q
n=!(n==null?r.Q=new A.aE(b,r.x,r.y,d):n).az(m)}else n=!1
if(!(n&&A.p1(s,r)))p=++r.w
else{n=r.w
if(n<=p){++p
r.w=p}else p=n
o=!0}}return o},
fZ(a,b){var s=this.a.w.length
if(a>=s)return!1
return A.p1(this.cz(a),b)},
p(a){return"GposTable("+this.a.p(0)+")"},
$irV:1}
A.fO.prototype={}
A.iX.prototype={
gt(a){var s=this,r=s.Q
return r==null?s.Q=new A.aE(s.a,s.x,s.y,s.d):r},
hK(a){var s,r,q,p,o,n=this,m=n.z
if(m===0)return!1
s=n.x
r=n.y
n.z=m-1
m=n.b
q=m.dG(a)
p=m.dH(a)
n.x=q
n.y=p
n.Q=null
o=m.fZ(a,n)
n.x=s
n.y=r
n.Q=null;++n.z
return o},
cW(a,b,c,d){t.mA.a(c)
if(b&&(a.y&this.c)>>>0===0)return 1
if(c==null)return 2
return c.$2(a,d)?0:1},
cg(a,b,c,d,e){var s,r,q,p,o,n
t.mA.a(d)
for(s=this.a.a,r=b;;){r=a.cf(r)
if(r<0)return-1
if(!(r<s.length))return A.a(s,r)
q=s[r]
p=this.cW(q,e,d,c)
o=q.e===5
if(p!==0)n=p===2&&!o
else n=!0
if(n)return r
if(!o)return-1}},
dJ(a,b){return this.cg(a,b,0,null,!0)},
hC(a,b,c,d){return this.cg(a,b,c,d,!0)},
dN(a,b,c,d,e){var s,r,q,p,o,n
t.mA.a(d)
for(s=this.a.a,r=b;;){r=a.dM(r)
if(r<0)return-1
if(!(r<s.length))return A.a(s,r)
q=s[r]
p=this.cW(q,e,d,c)
o=q.e===5
if(p!==0)n=p===2&&!o
else n=!0
if(n)return r
if(!o)return-1}},
ci(a,b){return this.dN(a,b,0,null,!0)},
aV(a,b){var s,r,q,p,o=this
if(a.c===32768){s=o.d
r=s==null?null:s.ghX()
q=o.e
if(r==null||q==null||q.length===0)return 0
return B.c.ah(r.c6(a.a,a.b,q))}p=b?o.r:o.f
return p===0?0:a.hW(p)},
bm(a){var s,r=a.a,q=a.b,p=a.d
if(p!=null)r+=this.aV(p,!1)
s=a.e
return new A.G(r,s!=null?q+this.aV(s,!0):q)}}
A.aA.prototype={}
A.n3.prototype={
$0(){var s,r=this.b,q=this.a,p=q.a
r.j(p,2)
s=r.a.getInt16(p,!1)
q.a+=2
return s},
$S:7}
A.n2.prototype={
$0(){var s,r=this.b,q=this.a,p=q.a
r.j(p,2)
s=r.a.getUint16(p,!1)
q.a+=2
return s},
$S:7}
A.en.prototype={
R(a){var s,r,q,p=this,o=a.a,n=o.a,m=a.w
if(!(m>=0&&m<n.length))return A.a(n,m)
s=p.c.C(n[m].a)
if(s<0)return!1
if(p.e){n=p.b
r=n+6}else{n=p.a
m=p.b
q=m+6
n.j(q,2)
if(s>=n.a.getUint16(q,!1))return!1
r=m+8+s*A.o1(p.d)
n=m}o=o.b
m=a.w
if(!(m>=0&&m<o.length))return A.a(o,m)
A.ok(a,p.a,n,r,p.d,o[m]);++a.w
return!0}}
A.eg.prototype={
R(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=a.w,d=f.c,c=a.a,b=c.a
if(!(e>=0&&e<b.length))return A.a(b,e)
if(d.C(b[e].a)<0)return!1
s=a.dJ(a.gt(0),e)
if(s<0)return!1
r=f.d
q=A.o1(r)
p=f.e
o=A.o1(p)
n=b.length
if(f.f===1){if(!(e<n))return A.a(b,e)
n=f.b
m=f.a
d=n+10+d.C(b[e].a)*2
m.j(d,2)
l=n+m.a.getUint16(d,!1)
if(!(s<b.length))return A.a(b,s)
k=f.eN(l,b[s].a,q+o)
if(k<0)return!1
j=k+2
i=l}else{d=f.r
d.toString
if(!(e<n))return A.a(b,e)
h=d.N(b[e].a)
d=f.w
d.toString
if(!(s<b.length))return A.a(b,s)
g=d.N(b[s].a)
if(h>=f.x||g>=f.y)return!1
i=f.b
j=i+16+(h*f.y+g)*(q+o)}d=f.a
c=c.b
if(!(e<c.length))return A.a(c,e)
A.ok(a,d,i,j,r,c[e])
if(!(s<c.length))return A.a(c,s)
A.ok(a,d,i,j+q,p,c[s])
a.w=o!==0?s+1:s
return!0},
eN(a,b,c){var s,r,q,p,o,n,m,l,k,j=this.a
j.j(a,2)
s=j.a
r=2+c
q=s.getUint16(a,!1)-1
for(p=a+2,o=0;o<=q;){n=B.b.J(o+q,1)
m=p+n*r
if(m>=0)l=m+2<=s.byteLength
else l=!1
if(!l)A.k(A.h("read of 2 byte(s) at "+m+" overruns a "+j.gk(0)+"-byte font"))
k=s.getUint16(m,!1)
if(b<k)q=n-1
else if(b>k)o=n+1
else return m}return-1}}
A.fm.prototype={
R(a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a4.w,a1=this.c,a2=a4.a,a3=a2.a
if(!(a0>=0&&a0<a3.length))return A.a(a3,a0)
s=a1.C(a3[a0].a)
if(s<0)return!1
r=this.a
q=this.b
p=q+6
o=p+s*4+2
r.j(o,2)
n=r.a
m=n.getUint16(o,!1)
if(m===0)return!1
l=a4.dJ(a4.gt(0),a0)
if(l<0)return!1
if(!(l<a3.length))return A.a(a3,l)
k=a1.C(a3[l].a)
if(k<0)return!1
a1=p+k*4
r.j(a1,2)
j=n.getUint16(a1,!1)
if(j===0)return!1
i=a4.bm(A.i6(new A.j(n,q+m)))
h=i.a
g=a4.bm(A.i6(new A.j(n,q+j)))
f=g.a
e=a2.b
a1=a2.c
a2=e.length
if(a1===B.i){if(!(a0<a2))return A.a(e,a0)
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
a=a0}A.oU(e,a,b)
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
A.eH.prototype={
N(a){var s=this.a,r=this.b+2+a*4
s.j(r,2)
return s.a.getUint16(r,!1)}}
A.ez.prototype={
c0(a,b,c){var s,r,q,p=this,o=!0
if(a>=0)if(b<c){o=p.a
s=p.b
o.j(s,2)
s=a>=o.a.getUint16(s,!1)
o=s}if(o)return null
o=p.a
s=p.b
r=s+2+(a*c+b)*2
o.j(r,2)
o=o.a
q=o.getUint16(r,!1)
return q===0?null:A.i6(new A.j(o,s+q))}}
A.fP.prototype={
R(a){var s,r,q,p,o,n=this,m=a.a,l=m.a,k=a.w
if(!(k>=0&&k<l.length))return A.a(l,k)
s=n.a.C(l[k].a)
if(s<0)return!1
r=new A.aE(m,8,a.y,a.d)
q=a.w
for(;;){p=a.ci(r,q)
if(p<0)return!1
if(!(p<l.length))return A.a(l,p)
q=p
break}if(!(q>=0&&q<l.length))return A.a(l,q)
o=n.b.C(l[q].a)
if(o<0)return!1
m=n.d
return A.o7(a,m,s,n.e.c0(o,m.N(s),n.c),q)}}
A.fQ.prototype={
R(a){var s,r,q,p,o,n,m,l,k,j=this,i=a.a,h=i.a,g=a.w
if(!(g>=0&&g<h.length))return A.a(h,g)
s=j.b.C(h[g].a)
if(s<0)return!1
r=a.ci(new A.aE(i,8,a.y,a.d),a.w)
if(r<0)return!1
if(!(r<h.length))return A.a(h,r)
q=j.c.C(h[r].a)
if(q<0)return!1
i=j.a
g=j.f
i.j(g,2)
p=i.a
if(q>=p.getUint16(g,!1))return!1
o=g+2+q*2
i.j(o,2)
o=g+p.getUint16(o,!1)
i.j(o,2)
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
return A.o7(a,h,s,new A.ez(i,o).c0(k,h.N(s),j.d),r)}}
A.fR.prototype={
R(a){var s,r,q,p,o=this,n=a.a,m=n.a,l=a.w
if(!(l>=0&&l<m.length))return A.a(m,l)
s=o.a.C(m[l].a)
if(s<0)return!1
r=a.ci(new A.aE(n,a.x&4294967281,a.y,a.d),a.w)
if(r<0)return!1
n=m.length
if(!(r<n))return A.a(m,r)
q=m[r]
if(q.f!==3)return!1
l=a.w
if(!(l>=0&&l<n))return A.a(m,l)
if(!A.tn(m[l],q))return!1
p=o.b.C(q.a)
if(p<0)return!1
n=o.d
return A.o7(a,n,s,o.e.c0(p,n.N(s),o.c),r)}}
A.cR.prototype={
R(a){var s,r,q,p=this,o=a.a.a,n=a.w
if(!(n>=0&&n<o.length))return A.a(o,n)
s=o[n].a
switch(p.c){case 1:r=p.d.C(s)
if(r<0)return!1
return p.cE(a,r,A.nf(),!1)
case 2:if(p.d.C(s)<0)return!1
o=p.e
q=o.N(s)
return p.cE(a,q,new A.iw(o),!0)
default:return p.bD(a)}},
cE(a,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b="read of 2 byte(s) at "
t.dW.a(a1)
s=this.a
r=this.b
q=r+(a2?6:4)
s.j(q,2)
p=s.a
o=p.getUint16(q,!1)
if(a0<0||a0>=o)return!1
q=r+(a2?8:6)+a0*2
s.j(q,2)
n=p.getUint16(q,!1)
if(n===0)return!1
m=r+n
s.j(m,2)
l=p.getUint16(m,!1)
for(r=m+2,k=0;k<l;++k){q=r+k*2
if(q>=0)j=q+2<=p.byteLength
else j=!1
if(!j)A.k(A.h(b+q+" overruns a "+s.gk(0)+"-byte font"))
i=p.getUint16(q,!1)
if(i===0)continue
h=m+i
if(h>=0)q=h+2<=p.byteLength
else q=!1
if(!q)A.k(A.h(b+h+" overruns a "+s.gk(0)+"-byte font"))
g=p.getUint16(h,!1)
q=h+2
if(q>=0)j=q+2<=p.byteLength
else j=!1
if(!j)A.k(A.h(b+q+" overruns a "+s.gk(0)+"-byte font"))
f=p.getUint16(q,!1)
e=h+4
d=A.lR(a,g,e,s,a1)
if(d==null)continue
c=A.mV(s,e+(g===0?0:g-1)*2,f)
A.li(a,d,c,d.length===0?a.w+1:B.a.ga0(d)+1)
return!0}return!1},
bD(a){var s,r,q,p,o,n,m=this.a,l=this.b,k=l+2
m.j(k,2)
s=m.a
r=s.getUint16(k,!1)
if(r===0)return!1
k=l+4
m.j(k,2)
q=s.getUint16(k,!1)
p=l+6
m.j(p,2)
o=A.O(new A.j(s,l+s.getUint16(p,!1)))
k=a.a.a
s=a.w
if(!(s>=0&&s<k.length))return A.a(k,s)
if(o.C(k[s].a)<0)return!1
n=A.lR(a,r,p+2,m,A.q1(m,l))
if(n==null)return!1
A.li(a,n,A.mV(m,p+r*2,q),B.a.ga0(n)+1)
return!0}}
A.iw.prototype={
$2(a,b){return this.a.N(a.a)===b},
$S:8}
A.lt.prototype={
$2(a,b){var s=this.a,r=s.h(0,b)
if(r==null){r=A.O(new A.j(this.b.a,this.c+b))
s.m(0,b,r)
s=r}else s=r
return s.C(a.a)>=0},
$S:8}
A.cL.prototype={
R(a){var s,r,q,p=this,o=a.a.a,n=a.w
if(!(n>=0&&n<o.length))return A.a(o,n)
s=o[n].a
switch(p.c){case 1:r=p.d.C(s)
if(r<0)return!1
return p.cF(a,r,4,A.nf(),A.nf(),A.nf())
case 2:if(p.d.C(s)<0)return!1
o=p.e
o.toString
n=p.f
n.toString
q=p.r
q.toString
return p.cF(a,n.N(s),10,new A.ic(o),new A.id(n),new A.ie(q))
default:return p.bD(a)}},
cF(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j,i=t.dW
i.a(d)
i.a(e)
i.a(f)
i=this.a
s=this.b
r=s+c
i.j(r,2)
q=i.a
p=q.getUint16(r,!1)
if(b<0||b>=p)return!1
r=r+2+b*2
i.j(r,2)
o=q.getUint16(r,!1)
if(o===0)return!1
n=s+o
i.j(n,2)
m=q.getUint16(n,!1)
for(s=n+2,l=0;l<m;++l){r=s+l*2
if(r>=0)k=r+2<=q.byteLength
else k=!1
if(!k)A.k(A.h("read of 2 byte(s) at "+r+" overruns a "+i.gk(0)+"-byte font"))
j=q.getUint16(r,!1)
if(j===0)continue
if(this.er(a,n+j,d,e,f))return!0}return!1},
er(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h=t.dW
h.a(c)
h.a(d)
h.a(e)
h=this.a
h.j(b,2)
s=h.a
r=s.getUint16(b,!1)
q=b+2
p=q+r*2
h.j(p,2)
o=s.getUint16(p,!1)
n=p+2
p=n+(o===0?0:o-1)*2
h.j(p,2)
m=s.getUint16(p,!1)
l=p+2
p=l+m*2
h.j(p,2)
k=s.getUint16(p,!1)
j=A.lR(a,o,n,h,d)
if(j==null)return!1
i=j.length===0?a.w+1:B.a.ga0(j)+1
if(!A.qa(a,m,l,h,e,i))return!1
if(!A.q9(a,r,q,h,c))return!1
A.li(a,j,A.mV(h,p+2,k),i)
return!0},
bD(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this.b,e=f+2,d=this.a
d.j(e,2)
s=d.a
r=s.getUint16(e,!1)
q=e+2
e=q+r*2
d.j(e,2)
p=s.getUint16(e,!1)
o=e+2
e=o+p*2
d.j(e,2)
n=s.getUint16(e,!1)
m=e+2
e=m+n*2
d.j(e,2)
l=s.getUint16(e,!1)
if(p===0)return!1
d.j(o,2)
k=A.O(new A.j(s,f+s.getUint16(o,!1)))
s=a.a.a
j=a.w
if(!(j>=0&&j<s.length))return A.a(s,j)
if(k.C(s[j].a)<0)return!1
i=A.q1(d,f)
h=A.lR(a,p,o+2,d,i)
if(h==null)return!1
g=B.a.ga0(h)+1
if(!A.qa(a,n,m,d,i,g))return!1
if(!A.q9(a,r,q,d,i))return!1
A.li(a,h,A.mV(d,e+2,l),g)
return!0}}
A.ig.prototype={
$1(a){var s,r=this.a
r.j(a,2)
r=r.a
s=r.getUint16(a,!1)
return s===0?B.h:A.c3(new A.j(r,this.b+s))},
$S:35}
A.ic.prototype={
$2(a,b){return this.a.N(a.a)===b},
$S:8}
A.id.prototype={
$2(a,b){return this.a.N(a.a)===b},
$S:8}
A.ie.prototype={
$2(a,b){return this.a.N(a.a)===b},
$S:8}
A.hK.prototype={}
A.c9.prototype={
fX(a,b,c,d){var s,r,q=this
if(b.a.length===0)return!1
s=q.cV(a)
if(s.d.length===0)return!1
r=new A.dV(b,d,c,0,q.gfj())
r.bz(s.b,s.c)
return s.a===8?q.eo(s,r):q.ep(s,r)},
ep(a,b){var s,r,q,p,o,n,m,l,k,j,i=b.a
b.f=0
for(s=i.a,r=b.b,q=b.c,p=a.d,o=!1,n=0;m=s.length,n<m;){if(!(n>=0))return A.a(s,n)
l=s[n]
if((l.y&r)>>>0!==0){m=b.y
m=!(m==null?b.y=new A.aE(i,b.w,b.x,q):m).az(l)}else m=!1
k=!1
if(m)for(m=p.length,j=0;j<p.length;p.length===m||(0,A.i)(p),++j)if(p[j].R(b)){k=!0
break}if(!k){++n
b.f=n
continue}m=b.f
if(m<=n){++n
b.f=n}else n=m
o=!0}return o},
eo(a,b){var s,r,q,p,o,n,m,l,k=b.a
for(s=k.a,r=b.f=s.length-1,q=a.d,p=b.b,o=b.c,n=!1;r>=0;r=--b.f){if(!(r<s.length))return A.a(s,r)
m=s[r]
if((m.y&p)>>>0===0)continue
r=b.y
if((r==null?b.y=new A.aE(k,b.w,b.x,o):r).az(m))continue
for(r=q.length,l=0;l<q.length;q.length===r||(0,A.i)(q),++l)if(q[l].R(b)){n=!0
break}}return n},
fk(a,b){var s,r,q,p,o,n,m
if(a.r>=64)return!1
if(b>=this.b.length)return!1
s=a.f
if(s<0||s>=a.a.a.length)return!1
r=this.cV(b)
q=a.w
p=a.x
a.bz(r.b,r.c);++a.r
s=r.d
n=s.length
m=0
for(;;){if(!(m<s.length)){o=!1
break}if(s[m].R(a)){o=!0
break}s.length===n||(0,A.i)(s);++m}--a.r
a.bz(q,p)
return o},
cV(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(a<0||a>=this.b.length)throw A.e(A.h("GSUB lookup index "+a+" out of range"))
s=this.b
if(!(a>=0&&a<s.length))return A.a(s,a)
r=s[a]
if(r!=null)return r
q=this.a
p=q.a.a
o=new A.j(p,q.b)
q=q.w
if(!(a<q.length))return A.a(q,a)
n=q[a]
o.j(n,2)
m=p.getUint16(n,!1)
q=n+2
o.j(q,2)
l=p.getUint16(q,!1)
q=n+4
o.j(q,2)
k=p.getUint16(q,!1)
if((l&16)!==0){q=n+6+k*2
o.j(q,2)
j=p.getUint16(q,!1)}else j=0
i=A.c([],t.fL)
for(q=n+6,h=0;h<k;++h){g=q+h*2
if(g>=0)f=g+2<=p.byteLength
else f=!1
if(!f)A.k(A.h("read of 2 byte(s) at "+g+" overruns a "+o.gk(0)+"-byte font"))
B.a.l(i,A.wz(m,new A.j(p,n+p.getUint16(g,!1))))}q=new A.hK(i.length===0?m:B.a.gv(i).gH(),l,j,i)
B.a.m(s,a,q)
return q},
p(a){return"GsubTable("+this.b.length+" lookups, "+this.a.p(0)+")"}}
A.h5.prototype={
p(a){return"SequenceLookupRecord("+this.a+" \u2192 "+this.b+")"}}
A.dV.prototype={
bz(a,b){var s=this
if(a===s.w&&b===s.x)return
s.w=a
s.x=b
s.y=null},
gt(a){var s=this,r=s.y
return r==null?s.y=new A.aE(s.a,s.w,s.x,s.c):r},
bB(a,b,c){var s,r,q=this.a.a
if(!(a>=0&&a<q.length))return A.a(q,a)
s=q[a]
s.a=b
r=this.c
if(r!=null&&r.b!==B.h){s.f=r.b.N(b)
s.r=r.c.N(b)}else if(c!==0)s.f=c},
b7(a,b){return this.bB(a,b,0)}}
A.an.prototype={}
A.eo.prototype={
gH(){return 1},
fG(a){var s,r=this.a.C(a)
if(r<0)return null
s=this.c
if(s==null)return a+this.b&65535
return r<s.length?s[r]:null},
R(a){var s,r=a.a.a,q=a.f
if(!(q>=0&&q<r.length))return A.a(r,q)
s=this.fG(r[q].a)
if(s==null)return!1
a.b7(a.f,s);++a.f
return!0}}
A.fT.prototype={
gH(){return 2},
R(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=a.a,e=f.a,d=a.f
if(!(d>=0&&d<e.length))return A.a(e,d)
s=g.a.C(e[d].a)
if(s<0||s>=g.c.length)return!1
d=g.d
if(!(s>=0&&s<d.length))return A.a(d,s)
r=d[s]
if(r==null){q=g.b
p=g.c
if(!(s<p.length))return A.a(p,s)
p=p[s]
o=q.a
q.j(p,2)
r=new A.j(o,p+2).X(o.getUint16(p,!1))
B.a.m(d,s,r)}d=r.length
if(d===1){f=a.f
if(0>=d)return A.a(r,0)
a.b7(f,r[0]);++a.f
return!0}if(d===0){B.a.au(e,a.f)
B.a.au(f.b,a.f)
return!0}n=a.f
if(!(n>=0&&n<e.length))return A.a(e,n)
m=e[n]
l=m.f===2?1:0
k=m.w
j=A.c([],t.Q)
for(q=k===0,i=0;i<d;++i){h=new A.ax(m.a,m.b,m.c,m.d,m.e,m.f,m.r,m.w,m.x,m.y,!1)
if(q){h.w=0
h.x=i}B.a.l(j,h)}B.a.au(e,n)
f=f.b
B.a.au(f,n)
B.a.dC(e,n,j)
e=A.c([],t.q)
for(i=0;i<d;++i)e.push(new A.bJ(0))
B.a.dC(f,n,e)
for(i=0;i<d;++i)a.bB(n+i,r[i],l)
a.f=n+d
return!0}}
A.f7.prototype={
gH(){return 3},
R(a){var s,r,q,p,o=this,n=a.a.a,m=a.f
if(!(m>=0&&m<n.length))return A.a(n,m)
s=o.a.C(n[m].a)
if(s<0||s>=o.c.length)return!1
n=o.d
if(!(s>=0&&s<n.length))return A.a(n,s)
r=n[s]
if(r==null){m=o.b
q=o.c
if(!(s<q.length))return A.a(q,s)
q=q[s]
p=m.a
m.j(q,2)
r=new A.j(p,q+2).X(p.getUint16(q,!1))
B.a.m(n,s,r)}n=a.d
if(n>=r.length)return!1
a.b7(a.f,r[n]);++a.f
return!0}}
A.cy.prototype={}
A.fM.prototype={
gH(){return 4},
eZ(a){var s,r,q,p,o=this,n=o.d
if(!(a>=0&&a<n.length))return A.a(n,a)
s=n[a]
if(s!=null)return s
r=o.c
if(!(a<r.length))return A.a(r,a)
q=r[a]
r=o.b
r.j(q,2)
p=A.fN(r.a.getUint16(q,!1),new A.jb(o,q),!1,t.nx)
B.a.m(n,a,p)
return p},
R(a){var s,r,q,p,o,n=a.a.a,m=a.f
if(!(m>=0&&m<n.length))return A.a(n,m)
s=this.a.C(n[m].a)
if(s<0||s>=this.c.length)return!1
for(n=this.eZ(s),m=n.length,r=0;r<m;++r){q=n[r]
p=q.b
o=A.np(a,p.length+1,new A.jc(p))
if(o==null)continue
A.vp(a,o,q.a)
return!0}return!1}}
A.jb.prototype={
$1(a){var s,r,q,p=this.b,o=this.a.b,n=p+2+a*2
o.j(n,2)
s=o.a
r=p+s.getUint16(n,!1)
n=r+2
o.j(n,2)
q=s.getUint16(n,!1)
o.j(r,2)
o=s.getUint16(r,!1)
p=q===0?0:q-1
return new A.cy(o,new A.j(s,r+4).X(p))},
$S:62}
A.jc.prototype={
$2(a,b){var s=this.a,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===b},
$S:3}
A.bt.prototype={}
A.dl.prototype={
gk(a){return this.b.length},
h(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g=this
if(b<0||b>=g.b.length)return B.C
s=g.d
if(!(b>=0&&b<s.length))return A.a(s,b)
r=s[b]
if(r!=null)return r
q=g.b
if(!(b<q.length))return A.a(q,b)
p=q[b]
if(p===0){B.a.m(s,b,B.C)
return B.C}q=g.a
q.j(p,2)
o=q.a
n=o.getUint16(p,!1)
m=J.aJ(n,t.kr)
for(l=g.c,k=p+2,j=0;j<n;++j){i=k+j*2
if(i>=0)h=i+2<=o.byteLength
else h=!1
if(!h)A.k(A.h("read of 2 byte(s) at "+i+" overruns a "+q.gk(0)+"-byte font"))
m[j]=l.$2(q,p+o.getUint16(i,!1))}B.a.m(s,b,m)
return m}}
A.lV.prototype={
$1(a){var s,r=this.a,q=this.b+a*2
r.j(q,2)
s=r.a.getUint16(q,!1)
return s===0?0:this.c+s},
$S:15}
A.fi.prototype={
gH(){return 5},
R(a){var s,r,q,p=a.a.a,o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
s=this.a.C(p[o].a)
if(s<0)return!1
for(p=this.b.h(0,s),o=p.length,r=0;r<o;++r){q=p[r]
if(A.lQ(a,q,A.ng(),new A.ix(q),A.ng()))return!0}return!1}}
A.ix.prototype={
$2(a,b){var s=this.a.b,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===b},
$S:3}
A.fj.prototype={
gH(){return 5},
R(a){var s,r,q=this,p=a.a.a,o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
if(q.a.C(p[o].a)<0)return!1
o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
for(p=q.c.h(0,q.b.N(p[o].a)),o=p.length,s=0;s<o;++s){r=p[s]
if(A.lQ(a,r,A.ng(),new A.iy(q,r),A.ng()))return!0}return!1}}
A.iy.prototype={
$2(a,b){var s=this.b.b,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===this.a.b.N(b)},
$S:3}
A.fk.prototype={
gH(){return 5},
R(a){var s,r,q,p=this.a,o=p.length
if(o===0)return!1
if(0>=o)return A.a(p,0)
p=p[0]
s=a.a.a
r=a.f
if(!(r>=0&&r<s.length))return A.a(s,r)
if(p.C(s[r].a)<0)return!1
q=A.np(a,o,new A.iz(this))
if(q==null)return!1
p=q.length
o=p-1
if(!(o>=0))return A.a(q,o)
A.oj(a,q,q[o]+1,this.b)
return!0}}
A.iz.prototype={
$2(a,b){var s=this.a.a
if(!(a<s.length))return A.a(s,a)
return s[a].C(b)>=0},
$S:3}
A.fb.prototype={
gH(){return 6},
R(a){var s,r,q,p=a.a.a,o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
s=this.a.C(p[o].a)
if(s<0)return!1
for(p=this.b.h(0,s),o=p.length,r=0;r<o;++r){q=p[r]
if(A.lQ(a,q,new A.ih(q),new A.ii(q),new A.ij(q)))return!0}return!1}}
A.ii.prototype={
$2(a,b){var s=this.a.b,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===b},
$S:3}
A.ih.prototype={
$2(a,b){var s=this.a.a
if(!(a<s.length))return A.a(s,a)
return s[a]===b},
$S:3}
A.ij.prototype={
$2(a,b){var s=this.a.c
if(!(a<s.length))return A.a(s,a)
return s[a]===b},
$S:3}
A.fc.prototype={
gH(){return 6},
R(a){var s,r,q=this,p=a.a.a,o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
if(q.a.C(p[o].a)<0)return!1
o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
for(p=q.e.h(0,q.c.N(p[o].a)),o=p.length,s=0;s<o;++s){r=p[s]
if(A.lQ(a,r,new A.ik(q,r),new A.il(q,r),new A.im(q,r)))return!0}return!1}}
A.io.prototype={
$1(a){var s,r=this.a
r.j(a,2)
r=r.a
s=r.getUint16(a,!1)
return s===0?B.h:A.c3(new A.j(r,this.b+s))},
$S:35}
A.il.prototype={
$2(a,b){var s=this.b.b,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===this.a.c.N(b)},
$S:3}
A.ik.prototype={
$2(a,b){var s=this.b.a
if(!(a<s.length))return A.a(s,a)
return s[a]===this.a.b.N(b)},
$S:3}
A.im.prototype={
$2(a,b){var s=this.b.c
if(!(a<s.length))return A.a(s,a)
return s[a]===this.a.d.N(b)},
$S:3}
A.fd.prototype={
gH(){return 6},
R(a){var s,r,q,p,o=this,n=o.b,m=n.length
if(m===0)return!1
if(0>=m)return A.a(n,0)
n=n[0]
s=a.a.a
r=a.f
if(!(r>=0&&r<s.length))return A.a(s,r)
if(n.C(s[r].a)<0)return!1
q=A.np(a,m,new A.ip(o))
if(q==null)return!1
n=q.length
m=n-1
if(!(m>=0))return A.a(q,m)
p=q[m]+1
if(!A.os(a,o.c.length,p,new A.iq(o)))return!1
if(!A.or(a,o.a.length,new A.ir(o)))return!1
A.oj(a,q,p,o.d)
return!0}}
A.is.prototype={
$0(){var s,r,q,p,o,n,m=this.b,l=this.a,k=l.a
m.j(k,2)
s=m.a
r=s.getUint16(k,!1)
q=J.aJ(r,t.c)
for(k=this.c,p=0;p<r;++p){o=l.a+2+p*2
if(o>=0)n=o+2<=s.byteLength
else n=!1
if(!n)A.k(A.h("read of 2 byte(s) at "+o+" overruns a "+m.gk(0)+"-byte font"))
q[p]=A.O(new A.j(s,k+s.getUint16(o,!1)))}l.a=l.a+(2+r*2)
return q},
$S:26}
A.ip.prototype={
$2(a,b){var s=this.a.b
if(!(a<s.length))return A.a(s,a)
return s[a].C(b)>=0},
$S:3}
A.iq.prototype={
$2(a,b){var s=this.a.c
if(!(a<s.length))return A.a(s,a)
return s[a].C(b)>=0},
$S:3}
A.ir.prototype={
$2(a,b){var s=this.a.a
if(!(a<s.length))return A.a(s,a)
return s[a].C(b)>=0},
$S:3}
A.h3.prototype={
gH(){return 8},
R(a){var s,r,q,p=this
if(a.r!==0)return!1
s=a.a.a
r=a.f
if(!(r>=0&&r<s.length))return A.a(s,r)
q=p.a.C(s[r].a)
if(q<0||q>=p.d.length)return!1
if(!A.or(a,p.b.length,new A.jy(p)))return!1
if(!A.os(a,p.c.length,a.f+1,new A.jz(p)))return!1
s=a.f
r=p.d
if(!(q>=0&&q<r.length))return A.a(r,q)
a.b7(s,r[q])
return!0}}
A.jA.prototype={
$0(){var s,r,q,p,o,n,m=this.b,l=this.a,k=l.a
m.j(k,2)
s=m.a
r=s.getUint16(k,!1)
q=J.aJ(r,t.c)
for(k=this.c,p=0;p<r;++p){o=l.a+2+p*2
if(o>=0)n=o+2<=s.byteLength
else n=!1
if(!n)A.k(A.h("read of 2 byte(s) at "+o+" overruns a "+m.gk(0)+"-byte font"))
q[p]=A.O(new A.j(s,k+s.getUint16(o,!1)))}l.a=l.a+(2+r*2)
return q},
$S:26}
A.jy.prototype={
$2(a,b){var s=this.a.b
if(!(a<s.length))return A.a(s,a)
return s[a].C(b)>=0},
$S:3}
A.jz.prototype={
$2(a,b){var s=this.a.c
if(!(a<s.length))return A.a(s,a)
return s[a].C(b)>=0},
$S:3}
A.aE.prototype={
az(a){var s,r,q,p=this,o=a.f
if(o>=1&&o<=3&&(p.b&B.b.ab(1,o))!==0)return!0
if(o!==3)return!1
s=p.b
if((s&16)!==0){r=p.d
if(r==null)return!0
return!r.hs(p.c,a.a)}q=s&65280
if(q!==0)return a.r!==q>>>8
return!1},
cf(a){var s,r,q
for(s=a+1,r=this.a.a;q=r.length,s<q;++s){if(!(s>=0))return A.a(r,s)
if(!this.az(r[s]))return s}return-1},
dM(a){var s=a-1,r=this.a.a,q=r.length
if(s>=q)s=q-1
for(;s>=0;--s){if(!(s<r.length))return A.a(r,s)
if(!this.az(r[s]))return s}return-1}}
A.ja.prototype={
hc(a){var s,r,q,p,o,n,m,l,k,j,i,h=this
if(a<0||a>=h.e.length)throw A.e(A.h("feature index "+a+" out of range"))
s=h.f
if(!(a>=0&&a<s.length))return A.a(s,a)
r=s[a]
if(r!=null)return r
q=h.e
if(!(a<q.length))return A.a(q,a)
p=q[a]
q=h.a
o=p+2
q.j(o,2)
n=q.a
m=n.getUint16(o,!1)
l=J.aJ(m,t.S)
for(o=p+4,k=0;k<m;++k){j=o+k*2
if(j>=0)i=j+2<=n.byteLength
else i=!1
if(!i)A.k(A.h("read of 2 byte(s) at "+j+" overruns a "+q.gk(0)+"-byte font"))
l[k]=n.getUint16(j,!1)}B.a.m(s,a,l)
return l},
dr(a,b){var s,r,q,p,o,n,m=this.cU(b,a)
if(m==null)return B.H
s=A.bj(t.S)
for(r=this.cO(m),q=r.length,p=this.d,o=0;o<r.length;r.length===q||(0,A.i)(r),++o){n=r[o]
if(!(n>=0&&n<p.length))return A.a(p,n)
s.l(0,p[n])}return s},
e1(a,b,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=t.nO
c.a(a)
s=d.cU(a0,b)
if(s==null)return B.c9
r=t.S
q=A.A(r,c)
for(c=d.cO(s),p=c.length,o=d.d,n=0;n<c.length;c.length===p||(0,A.i)(c),++n){m=c[n]
if(!(m>=0&&m<o.length))return A.a(o,m)
l=o[m]
if(!a.u(0,l))continue
for(k=d.hc(m),j=k.length,i=0;i<j;++i){h=k[i]
g=q.h(0,h)
if(g==null){g=A.bj(r)
q.m(0,h,g)}g.l(0,l)}}c=q.$ti.i("ag<1>")
f=A.a7(new A.ag(q,c),c.i("f.E"))
B.a.aK(f)
c=A.c([],t.kR)
for(r=f.length,n=0;n<f.length;f.length===r||(0,A.i)(f),++n){e=f[n]
p=q.h(0,e)
p.toString
c.push(new A.h9(e,p))}return c},
cU(a,b){var s,r,q,p,o,n,m,l=this.c,k=l.h(0,a)
if(k==null)k=l.h(0,1145457748)
if(k==null)return null
if(b!==0&&b!==1145457748){l=this.a
s=k+2
l.j(s,2)
r=l.a
q=r.getUint16(s,!1)
for(s=k+4,p=0;p<q;++p){o=s+p*6
if(o>=0)n=o+4<=r.byteLength
else n=!1
if(!n)A.k(A.h("read of 4 byte(s) at "+o+" overruns a "+l.gk(0)+"-byte font"))
if(r.getUint32(o,!1)===b){s=o+4
if(s>=0)n=s+2<=r.byteLength
else n=!1
if(!n)A.k(A.h("read of 2 byte(s) at "+s+" overruns a "+l.gk(0)+"-byte font"))
return k+r.getUint16(s,!1)}}}l=this.a
l.j(k,2)
m=l.a.getUint16(k,!1)
return m===0?null:k+m},
cO(a){var s,r,q,p,o,n,m,l,k=A.bj(t.S),j=this.a,i=a+2
j.j(i,2)
s=j.a
r=s.getUint16(i,!1)
if(r!==65535&&r<this.d.length)k.l(0,r)
i=a+4
j.j(i,2)
q=s.getUint16(i,!1)
for(i=this.d,p=a+6,o=0;o<q;++o){n=p+o*2
if(n>=0)m=n+2<=s.byteLength
else m=!1
if(!m)A.k(A.h("read of 2 byte(s) at "+n+" overruns a "+j.gk(0)+"-byte font"))
l=s.getUint16(n,!1)
if(l<i.length)k.l(0,l)}j=A.a7(k,k.$ti.c)
B.a.aK(j)
return j},
p(a){var s=this
return"LayoutTable(1."+s.r+", "+s.c.a+" scripts, "+s.d.length+" features, "+s.w.length+" lookups)"}}
A.h9.prototype={
p(a){var s=this.b,r=A.o(s)
return"StagedLookup("+this.a+", "+new A.c5(s,r.i("v(1)").a(new A.jQ()),r.i("c5<1,v>")).a7(0,"+")+")"}}
A.jQ.prototype={
$1(a){return A.ay(A.Q(a))},
$S:70}
A.dB.prototype={
du(a){var s
a.am(1937007464)
a.bk()
a.am(1667460464)
a.am(1819239276)
a.bk()
for(s=0;s<7;++s){a.fU(B.T[s],8);++a.e}a.c7(1919118452,4)
a.c7(1667329140,4)
a.bk()
a.am(1836279156)},
cu(a,b){var s,r,q,p,o,n,m,l=A.rc(a),k=A.c([],t.t)
for(s=b.r,r=0;r<7;++r){q=s.h(0,B.T[r])
k.push(q==null?0:q)}k.push(0)
for(s=a.a,q=l.length,p=0;p<s.length;++p){o=s[p]
n=o.y
if(!(p<q))return A.a(l,p)
m=l[p]
if(!(m<k.length))return A.a(k,m)
o.y=(n|k[m])>>>0}},
dO(a,b,c){}}
A.em.prototype={
du(a){},
cu(a,b){},
dO(a,b,c){}}
A.fn.prototype={}
A.ax.prototype={
p(a){return"GlyphInfo(gid: "+this.a+", cluster: "+this.c+")"}}
A.bJ.prototype={
p(a){var s=this
return"GlyphPosition(adv: "+s.a+","+s.b+" off: "+s.c+","+s.d+")"}}
A.eu.prototype={
aq(){return"TextDirection."+this.b}}
A.iQ.prototype={
gk(a){return this.a.length},
dR(){var s,r,q,p,o,n,m
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
p(a){var s=this.a,r=A.L(s)
return"GlyphBuffer("+s.length+" glyphs, "+this.c.p(0)+", "+new A.ao(s,r.i("b(1)").a(new A.iR()),r.i("ao<1,b>")).a7(0," ")+")"}}
A.iR.prototype={
$1(a){return t.h.a(a).a},
$S:27}
A.fW.prototype={
aq(){return"NormalizationMode."+this.b}}
A.jk.prototype={
hD(a,b){if(a.a.length===0)return
this.eF(a)
this.fB(a,b)
this.fh(a)},
eF(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=1668112752,f=A.c([],t.Q)
for(s=a.a,r=s.length,q=this.a,p=q.a,o=p.c,n=0;n<s.length;s.length===r||(0,A.i)(s),++n){m=s[n]
l=m.b
k=q.e
if(k==null){j=o.h(0,g)
i=j==null?null:new A.j(p.a.a,j.c)
if(i==null)A.k(A.h("font has no "+A.ay(A.co(g))+" table"))
k=q.e=A.dL(i)}h=k.a8(l)
if(h!==0){m.a=h
B.a.l(f,m)
continue}if(!this.cL(f,m,m.b,!0)){l=m.b
k=q.e
if(k==null){j=o.h(0,g)
i=j==null?null:new A.j(p.a.a,j.c)
if(i==null)A.k(A.h("font has no "+A.ay(A.co(g))+" table"))
k=q.e=A.dL(i)}m.a=k.a8(l)
B.a.l(f,m)}}A.pj(a,f)},
cL(a,b,c,d){var s,r,q,p,o,n,m=this
t.n7.a(a)
s=A.uV(c)
r=s.a
q=s.b
if(r<0)return!1
p=q<0?0:m.a.gdt().a8(q)
o=q>=0
if(o&&p===0)return!1
n=m.a.gdt().a8(r)
if(d&&n!==0){B.a.l(a,m.aS(b,r,n))
if(o)B.a.l(a,m.aS(b,q,p))
return!0}if(m.cL(a,b,r,d)){if(o)B.a.l(a,m.aS(b,q,p))
return!0}if(n!==0){B.a.l(a,m.aS(b,r,n))
if(o)B.a.l(a,m.aS(b,q,p))
return!0}return!1},
fB(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=a.a,g=h.length
for(s=0;s<g;++s){if(!(s>=0&&s<h.length))return A.a(h,s)
r=h[s].b
q=A.af($.dz(),r)
r=$.f3()
p=r.length
if(q<p){if(!(q>=0))return A.a(r,q)
r=r[q]}else r=q
if(r===0)continue
o=s+1
n=o
for(;;){if(n<g){if(!(n<h.length))return A.a(h,n)
r=h[n].b
q=A.af($.dz(),r)
r=$.f3()
p=r.length
if(q<p){if(!(q>=0))return A.a(r,q)
r=r[q]}else r=q
r=r!==0}else r=!1
if(!r)break;++n}if(n-s<=32){for(m=o;m<n;++m){if(!(m<h.length))return A.a(h,m)
l=h[m]
r=l.b
q=A.af($.dz(),r)
r=$.f3()
p=r.length
if(q<p){if(!(q>=0))return A.a(r,q)
k=r[q]}else k=q
j=m
for(;;){if(j>s){r=j-1
if(!(r<h.length))return A.a(h,r)
r=h[r].b
q=A.af($.dz(),r)
r=$.f3()
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
A.tz(a,j,m+1)}}b.dO(a,s,n)}s=n-1}},
fh(a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=1668112752,a4=a5.a
if(a4.length<2)return
s=A.c([B.a.gv(a4)],t.Q)
for(r=this.a,q=r.a,p=q.c,q=q.a.a,o=0,n=1;n<a4.length;++n){m=a4[n]
l=B.a.ga0(s)
k=m.e
j=k===1||k===2||k===3
if(o!==s.length-1){k=l.b
i=$.dz()
h=A.af(i,k)
k=$.f3()
g=k.length
if(h<g){if(!(h>=0))return A.a(k,h)
f=k[h]}else f=h
h=A.af(i,m.b)
if(h<g){if(!(h>=0))return A.a(k,h)
k=k[h]}else k=h
e=f>=k}else e=!1
if(j&&!e){if(!(o>=0&&o<s.length))return A.a(s,o)
d=A.uU(s[o].b,m.b)
if(d>=0){k=r.e
if(k==null){c=p.h(0,a3)
b=c==null?null:new A.j(q,c.c)
if(b==null)A.k(A.h("font has no "+A.ay(A.co(a3))+" table"))
k=r.e=A.dL(b)}a=k.a8(d)
if(a!==0){a0=m.c
for(k=s.length,a1=o;a1<k;++a1){a2=s[a1].c
if(a2<a0)a0=a2}for(a1=o;k=s.length,a1<k;++a1)s[a1].c=a0
if(!(o<k))return A.a(s,o)
k=s[o]
k.b=d
k.a=a
k.e=A.af($.nG(),d)
k.d=A.af($.nH(),d)
continue}}}B.a.l(s,m)
k=m.b
if(A.af($.dz(),k)===0)o=s.length-1}A.pj(a5,s)},
aS(a,b,c){var s=a.c,r=A.af($.nG(),b)
return new A.ax(c,b,s,A.af($.nH(),b),r,0,0,0,0,a.y,!1)}}
A.lS.prototype={
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
$S:77}
A.h6.prototype={
gk(a){return this.a.length},
p(a){var s=this.a,r=A.L(s)
return"ShapedRun("+s.length+" glyphs, "+this.c.p(0)+", "+new A.ao(s,r.i("b(1)").a(new A.jM()),r.i("ao<1,b>")).a7(0," ")+")"}}
A.jM.prototype={
$1(a){return t.h.a(a).a},
$S:27}
A.h7.prototype={
e0(a,b,c){var s,r
t.L.a(a)
s=A.c([],t.t)
for(r=0;r<a.length;++r)s.push(r)
return this.fz(a,s,b,B.ci,1145457748,c)},
fz(a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a=t.L
a.a(a0)
a.a(a1)
s=b.fe(a5,a4,a2,t.kT.a(a3))
r=B.a1.u(0,a5)?new A.dB():B.J
q=b.d
a=q.a
B.a.a2(a)
p=q.b
B.a.a2(p)
q.c=B.q
q.d=0
q.c=a2
q.d=a5
for(o=0;o<a0.length;++o){n=a0[o]
if(!(o<a1.length))return A.a(a1,o)
B.a.l(a,new A.ax(0,n,a1[o],0,0,0,0,0,0,0,!1))
B.a.l(p,new A.bJ(0))}if(a.length===0)return new A.h6(B.cj,B.ck,a2)
b.fu(q,s)
A.tU(q)
A.tT(q)
b.f0(q,s)
m=b.c;(m===$?b.c=new A.jk(b.a):m).hD(q,r)
r.cu(q,s)
n=b.a
l=n.ch
if(l==null)l=n.ch=n.bd(1195656518,A.w7(),t.lP)
A.tS(q,l)
k=n.gct()
if(k!=null)for(j=s.d,i=j.length,h=0;h<j.length;j.length===i||(0,A.i)(j),++h)for(g=j[h].a,f=g.length,e=0;e<g.length;g.length===f||(0,A.i)(g),++e){d=g[e]
k.fX(d.a,q,l,d.b)}B.a.a2(p)
j=A.c([],t.q)
for(i=a.length,h=0;h<a.length;a.length===i||(0,A.i)(a),++h)j.push(new A.bJ(n.bX(a[h].a)))
B.a.P(p,j)
c=n.gcs()
if(c!=null)for(j=s.e,i=j.length,n=n.b,h=0;h<j.length;j.length===i||(0,A.i)(j),++h)for(g=j[h].a,f=g.length,e=0;e<g.length;g.length===f||(0,A.i)(g),++e){d=g[e]
c.fY(d.a,q,n,l,d.b)}A.t_(q,!1)
A.rZ(q)
A.rY(q)
n=q.c
if(n===B.i)q.dR()
b.eS(q)
a=A.a7(a,t.h)
p=A.a7(p,t.lr)
return new A.h6(a,p,q.c)},
fe(a,b,c,d){var s,r,q,p,o,n,m,l
t.kT.a(d)
s=[]
for(r=0;!1;++r){q=d[r]
s.push(q.ghQ().ao(0,31).b3(0,q.ghV()))}p=A.nX(a,b,c,A.tA(s))
s=this.b
o=s.h(0,p)
if(o!=null)return o
n=new A.jO(a,b,c,A.c([],t.la))
A.vX(n,B.a1.u(0,a)?new A.dB():B.J)
for(r=0;!1;++r){q=d[r]
n.aF(q.ghQ(),1,q.ghV())}m=this.a
l=m.gct()
l=l==null?null:l.a
m=m.gcs()
m=n.h2(m==null?null:m.a,l)
s.m(0,p,m)
return m},
fu(a,b){var s,r,q,p,o,n
for(s=a.a,r=s.length,q=b.f,p=0;p<s.length;s.length===r||(0,A.i)(s),++p){o=s[p]
n=o.b
o.e=A.af($.nG(),n)
n=o.b
o.d=A.af($.nH(),n)
o.y=q}},
f0(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=1668112752
if(a.c!==B.i)return
s=b.hA(1920232557)
for(r=a.a,q=r.length,p=s!==0,o=this.a,n=o.a,m=n.c,l=0;l<r.length;r.length===q||(0,A.i)(r),++l){k=r[l]
j=k.b
i=A.af($.oE(),j)
h=i===0?-1:B.b.J(i,2)
if(h>0){j=o.e
if(j==null){g=m.h(0,e)
f=g==null?null:new A.j(n.a.a,g.c)
if(f==null)A.k(A.h("font has no "+A.ay(A.co(e))+" table"))
j=o.e=A.dL(f)}j=j.a8(h)!==0}else j=!1
if(j)k.b=h
else if(p)k.y=(k.y|s)>>>0}},
eS(a){var s,r,q,p,o,n,m,l,k,j,i,h=1668112752
for(s=a.a,r=a.b,q=this.a,p=q.a,o=p.c,n=-1,m=0;m<s.length;++m){l=s[m]
if(!A.wj(l.b))continue
if(n<0){k=q.e
if(k==null){j=o.h(0,h)
i=j==null?null:new A.j(p.a.a,j.c)
if(i==null)A.k(A.h("font has no "+A.ay(A.co(h))+" table"))
k=q.e=A.dL(i)}n=k.a8(32)}if(n!==0)l.a=n
if(!(m<r.length))return A.a(r,m)
k=r[m]
k.d=k.c=k.b=k.a=0}}}
A.h1.prototype={
p(a){return"PlannedLookup("+this.a+", mask 0x"+B.b.b0(this.b,16)+")"}}
A.h0.prototype={
p(a){return"PlanStage("+this.a.length+" lookups)"}}
A.h8.prototype={
hA(a){var s=this.r.h(0,a)
return s==null?0:s},
p(a){var s=this
return"ShapingPlan("+A.ay(s.a)+"/"+A.ay(s.b)+", "+s.c.p(0)+", "+s.d.length+" GSUB stages, "+s.e.length+" GPOS stages)"}}
A.bu.prototype={}
A.jO.prototype={
c7(a,b){return this.aF(a,b|1,1)},
am(a){return this.c7(a,0)},
aF(a,b,c){var s=(b&1)!==0?c:0,r=new A.bu(a,b,c,s,this.r++)
r.f=this.e
B.a.l(this.d,r)},
bj(a){return this.aF(a,0,1)},
fU(a,b){return this.aF(a,b,1)},
bk(){return this.e++},
h2(a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=this,a3=A.pg(a2.d,!0,t.bY)
B.a.aA(a3,new A.jP())
s=A.c([],t.la)
for(r=a3.length,q=0;q<a3.length;a3.length===r||(0,A.i)(a3),++q){p=a3[q]
if(s.length!==0&&B.a.ga0(s).a===p.a){o=B.a.ga0(s)
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
if(n<o.r)o.r=n}else B.a.l(s,p)}l=a5==null?B.H:a5.dr(a2.b,a2.a)
k=a4==null?B.H:a4.dr(a2.b,a2.a)
r=t.S
j=A.A(r,r)
i=A.bj(r)
h=A.A(r,r)
g=A.A(r,r)
f=A.A(r,r)
for(r=s.length,e=1,d=1,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q]
n=p.a
c=l.u(0,n)
b=k.u(0,n)
m=!c
if(!m||b)i.l(0,n)
if(m&&!b&&(p.b&8)===0)continue
if((p.b&1)!==0&&p.c===1)a=1
else{a0=A.tV(p.c)
a1=e+a0
if(a1>32)continue
a=B.b.ab(B.b.ab(1,a0)-1,e)
d=(d|B.b.ab(p.d,e)&a)>>>0
e=a1}j.m(0,n,a)
h.m(0,n,p.b)
g.m(0,n,p.f)
f.m(0,n,p.r)}return new A.h8(a2.a,a2.b,a2.c,a2.d8(a5,j,h,g,a2.e),a2.d8(a4,j,h,f,0),d,j)},
d8(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h,g=t.mV
g.a(b)
g.a(c)
g.a(d)
if(a==null)return B.c8
s=A.c([],t.lE)
for(g=t.gX,r=this.a,q=this.b,p=A.o(d).i("cd<1,2>"),o=t.S,n=0;n<=e;++n){m=A.bj(o)
for(l=new A.cd(d,d.r,d.e,p);l.n();){k=l.d
if(k.b===n)m.l(0,k.a)}if(m.a===0)continue
j=a.e1(m,q,r)
if(j.length===0)continue
l=A.c([],g)
for(i=j.length,h=0;h<j.length;j.length===i||(0,A.i)(j),++h)l.push(this.fd(j[h],m,b,c))
B.a.l(s,new A.h0(l))}return s},
fd(a,b,c,d){var s,r,q,p,o,n,m,l
t.nO.a(b)
s=t.mV
s.a(c)
s.a(d)
for(s=a.b,s=A.ul(s,s.r,A.o(s).c),r=s.$ti.c,q=0,p=!0,o=!0;s.n();){n=s.d
if(n==null)n=r.a(n)
if(!b.u(0,n))continue
m=c.h(0,n)
q=(q|(m==null?0:m))>>>0
l=d.h(0,n)
if(l==null)l=0
p=B.P.cq(p,(l&2)===0)
o=B.P.cq(o,(l&4)===0)}return new A.h1(a.a,q)}}
A.jP.prototype={
$2(a,b){var s,r=t.bY
r.a(a)
r.a(b)
r=a.a
s=b.a
return r!==s?r-s:a.e-b.e},
$S:80}
A.bb.prototype={
gk(a){return this.b-this.a},
p(a){return"BidiRun("+this.a+".."+this.b+", level "+this.c+")"}}
A.dF.prototype={}
A.l5.prototype={
e5(a,b){var s,r,q,p,o,n,m,l=this
for(s=l.c,r=l.d,q=l.a,p=J.t(q),o=r.$flags|0,n=0;n<s;++n){m=p.h(q,n)
m=A.af($.oF(),m)
o&2&&A.y(r)
if(!(n<r.length))return A.a(r,n)
r[n]=m}B.j.by(l.e,0,r)
l.eH()},
dS(){var s,r,q,p,o=this,n=o.c
if(n===0){n=new Uint8Array(0)
return new A.dF(n,0,B.B,B.B)}n=o.d_(0,n)
o.x=n
o.fn()
s=o.ex()
for(n=s.length,r=0;r<s.length;s.length===n||(0,A.i)(s),++r){q=s[r]
q.fL()
q.fM()
q.fN()
q.fO()
q.fP()
q.fQ()
q.fR()
q.f2()
q.f3()
q.eT()}o.eX()
o.eq()
p=o.eY()
return new A.dF(o.f,o.x,p,o.fl(p))},
d_(a,b){var s,r,q,p,o,n
for(s=this.d,r=s.length,q=this.r,p=q.length,o=a;o<b;++o){if(!(o>=0&&o<r))return A.a(s,o)
n=s[o]
if(n===0)return 0
if(n===1||n===2)return 1
if(n===19||n===20||n===21){if(!(o<p))return A.a(q,o)
o=q[o]
if(o>=b)break}}return 0},
eH(){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=h.r,f=h.c
B.y.bp(g,0,f,-1)
s=h.w
B.y.bp(s,0,f,-1)
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
if(j===0){o&2&&A.y(s)
if(!(k<s.length))return A.a(s,k)
s[k]=n
l=k
break}}++k}r&2&&A.y(g)
if(!(n<g.length))return A.a(g,n)
g[n]=l}},
fn(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=this,a1=new Uint8Array(128),a2=new Uint8Array(128),a3=new Uint8Array(128),a4=a0.x
a4===$&&A.r()
a1[0]=a4
a2[0]=255
for(a4=a0.c,s=a0.f,r=s.$flags|0,q=a0.d,p=q.length,o=a0.e,n=o.$flags|0,m=a0.r,l=m.length,k=0,j=0,i=0,h=0,g=0;g<a4;++g){if(!(g<p))return A.a(q,g)
f=q[g]
e=0
switch(f){case 15:case 14:case 17:case 16:if(!(k>=0&&k<128))return A.a(a1,k)
d=a1[k]
r&2&&A.y(s)
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
b=a0.d_(g+1,d)===1}if(!(k>=0&&k<128))return A.a(a1,k)
d=a1[k]
r&2&&A.y(s)
if(!(g<s.length))return A.a(s,g)
s[g]=d
d=a2[k]
if(d!==255){n&2&&A.y(o)
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
r&2&&A.y(s)
if(!(g<s.length))return A.a(s,g)
s[g]=d
d=a2[k]
if(d!==255){n&2&&A.y(o)
if(!(g<o.length))return A.a(o,g)
o[g]=d}break
case 18:if(!(j>0))if(i>0)--i
else{if(!(k>=0&&k<128))return A.a(a3,k)
if(a3[k]===0&&k>=1)--k}if(!(k>=0&&k<128))return A.a(a1,k)
d=a1[k]
r&2&&A.y(s)
if(!(g<s.length))return A.a(s,g)
s[g]=d
break
case 10:d=a0.x
r&2&&A.y(s)
if(!(g<s.length))return A.a(s,g)
s[g]=d
i=e
k=0
j=0
h=0
break
default:if(!(k>=0&&k<128))return A.a(a1,k)
d=a1[k]
r&2&&A.y(s)
if(!(g<s.length))return A.a(s,g)
s[g]=d
d=a2[k]
if(d!==255){n&2&&A.y(o)
if(!(g<o.length))return A.a(o,g)
o[g]=d}}}for(g=0;g<a4;++g){if(!(g<p))return A.a(q,g)
s=q[g]
if(s===15||s===14||s===17||s===16||s===18||s===9){n&2&&A.y(o)
if(!(g<o.length))return A.a(o,g)
o[g]=9}}},
ex(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1=this,b2=t.t,b3=A.c([],b2),b4=b1.c,b5=new Int32Array(b4)
B.y.bp(b5,0,b4,-1)
for(s=b1.d,r=s.length,q=0;q<b4;++q){if(!(q<r))return A.a(s,q)
p=s[q]
if(p===15||p===14||p===17||p===16||p===18||p===9)continue
p=b3.length
if(!(q<b4))return A.a(b5,q)
b5[q]=p
B.a.l(b3,q)}p=t.L
p.a(b3)
b1.y!==$&&A.ow()
b1.y=b3
b1.z!==$&&A.ow()
b1.z=b5
if(b3.length===0)return B.cc
o=A.c([],b2)
n=A.c([],b2)
m=new Int32Array(b4)
B.y.bp(m,0,b4,-1)
for(l=b1.f,k=l.length,j=0,i=1;h=b3.length,i<=h;++i){if(i!==h){if(!(i<h))return A.a(b3,i)
g=b3[i]
if(!(g<k))return A.a(l,g)
g=l[g]
if(!(j>=0&&j<h))return A.a(b3,j)
h=b3[j]
if(!(h<k))return A.a(l,h)
h=g!==l[h]}else h=!0
if(h){f=o.length
B.a.l(o,j)
B.a.l(n,i)
for(h=b3.length,e=j;e<i;++e){if(!(e>=0&&e<h))return A.a(b3,e)
g=b3[e]
if(!(g<b4))return A.a(m,g)
m[g]=f}j=i}}d=A.c([],t.bD)
for(h=b1.r,g=h.length,c=b1.w,b=c.length,a=0;a<o.length;++a){a0=o[a]
if(!(a0<b3.length))return A.a(b3,a0)
a1=b3[a0]
if(!(a1<r))return A.a(s,a1)
if(s[a1]===22){if(!(a1<b))return A.a(c,a1)
a0=c[a1]>=0}else a0=!1
if(a0)continue
a2=A.c([],b2)
for(a3=a;;a3=a5){if(!(a3>=0&&a3<o.length))return A.a(o,a3)
i=o[a3]
for(;;){if(!(a3<n.length))return A.a(n,a3)
if(!(i<n[a3]))break
if(!(i<b3.length))return A.a(b3,i)
B.a.l(a2,b3[i]);++i}a4=B.a.ga0(a2)
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
a0=B.a.gv(a2)
if(!(a0<k))return A.a(l,a0)
a7=l[a0]
a0=B.a.gv(a2)
if(!(a0<b4))return A.a(b5,a0)
a8=b5[a0]
if(a8>0){a0=a8-1
if(!(a0<b3.length))return A.a(b3,a0)
a0=b3[a0]
if(!(a0<k))return A.a(l,a0)
a9=l[a0]}else{a0=b1.x
a0===$&&A.r()
a9=a0}a4=B.a.ga0(a2)
if(!(a4<r))return A.a(s,a4)
a0=s[a4]
if(a0===19||a0===20||a0===21){if(!(a4<g))return A.a(h,a4)
a0=h[a4]>=b4}else a0=!1
if(a0){a0=b1.x
a0===$&&A.r()
b0=a0}else{if(!(a4<b4))return A.a(b5,a4)
a0=b5[a4]+1
a6=b3.length
if(a0<a6){if(!(a0>=0))return A.a(b3,a0)
a0=b3[a0]
if(!(a0<k))return A.a(l,a0)
b0=l[a0]}else{a0=b1.x
a0===$&&A.r()
b0=a0}}a0=((a7>a9?a7:a9)&1)===1?1:0
B.a.l(d,A.ui(b1,a2,a0,((a7>b0?a7:b0)&1)===1?1:0,a7))}return d},
eX(){var s,r,q,p,o,n,m,l,k=this
for(s=k.c,r=k.x,q=k.f,p=k.d,o=p.length,n=q.length,m=0;m<s;++m){if(!(m<o))return A.a(p,m)
l=p[m]
if(!(l===15||l===14||l===17||l===16||l===18||l===9))continue
if(m>0){l=m-1
if(!(l<n))return A.a(q,l)
l=q[l]}else{r===$&&A.r()
l=r}q.$flags&2&&A.y(q)
if(!(m<n))return A.a(q,m)
q[m]=l}},
eq(){var s,r,q,p,o,n,m,l,k,j,i,h=this
for(s=h.c,r=h.f,q=h.x,p=r.$flags|0,o=h.d,n=o.length,m=0;m<s;++m){if(!(m<n))return A.a(o,m)
l=o[m]
if(l!==10&&l!==11)continue
q===$&&A.r()
p&2&&A.y(r)
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
q===$&&A.r()
p&2&&A.y(r)
if(!(j<r.length))return A.a(r,j)
r[j]=q}},
eY(){var s,r,q,p,o,n,m=A.c([],t.A)
for(s=this.c,r=this.f,q=r.length,p=0,o=1;o<=s;++o){if(o!==s){if(!(o<q))return A.a(r,o)
n=r[o]
if(!(p>=0&&p<q))return A.a(r,p)
n=n!==r[p]}else n=!0
if(n){if(!(p>=0&&p<q))return A.a(r,p)
B.a.l(m,new A.bb(p,o,r[p]))
p=o}}return m},
fl(a){var s,r,q,p,o,n,m,l,k,j,i,h
t.kV.a(a)
s=a.length
if(s===0)return B.B
for(r=0,q=127,p=0;p<s;++p){o=a[p].c
if(o>r)r=o
if((o&1)===1&&o<q)q=o}n=A.a7(a,t.kb)
for(s=n.length,m=r;m>=q;--m)for(l=0;l<s;){if(!(l>=0))return A.a(n,l)
if(n[l].c<m){++l
continue}k=l
for(;;){if(!(k<s&&n[k].c>=m))break;++k}for(j=k-1,i=l;i<j;++i,--j){if(!(i<s))return A.a(n,i)
h=n[i]
if(!(j<s))return A.a(n,j)
n[i]=n[j]
n[j]=h}l=k}return n}}
A.hM.prototype={
gk(a){return this.b.length},
fL(){var s,r,q,p,o=this.e
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
if(r[p]===8)B.a.m(r,p,o===19||o===20||o===21||o===22?13:o)
o=r[p]}},
fM(){var s,r,q,p,o,n=this.e
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
o=r[p]
if(o===0||o===1||o===2)n=o
else if(o===3&&n===2)B.a.m(r,p,6)}},
fN(){var s,r,q,p
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
if(r[p]===2)B.a.m(r,p,1)}},
fO(){var s,r,q,p,o,n,m,l
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
fP(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
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
fQ(){var s,r,q,p,o
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
o=r[p]
if(o===5||o===4||o===7)B.a.m(r,p,13)}},
fR(){var s,r,q,p,o,n=this.e
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
o=r[p]
if(o===0||o===1)n=o
else if(o===3&&n===0)B.a.m(r,p,0)}},
f2(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=(e.r&1)===1?1:0,c=d===0?1:0
for(s=e.eu(),r=s.length,q=e.c,p=q.length,o=e.e,n=0;n<s.length;s.length===r||(0,A.i)(s),++n){m=s[n]
l=m.a
k=m.b
i=l+1
h=!1
for(;;){if(!(i<k)){j=-1
break}A:{if(!(i>=0&&i<p))return A.a(q,i)
g=A.pL(q[i])
if(g===-1)break A
if(g===d){j=d
break}h=!0}++i}if(j===-1&&h){i=l-1
for(;;){if(!(i>=0)){f=o
break}if(!(i<p))return A.a(q,i)
g=A.pL(q[i])
if(g!==-1){f=g
break}--i}j=f===c?c:d}if(j===-1)continue
B.a.m(q,l,j)
B.a.m(q,k,j)
e.cC(l,j)
e.cC(k,j)}},
cC(a,b){var s,r=a+1,q=this.c,p=this.b
for(;;){if(r<p.length){s=this.d
s===$&&A.r()
if(!(r>=0&&r<s.length))return A.a(s,r)
s=s[r]===8}else s=!1
if(!s)break
B.a.m(q,r,b);++r}},
eu(){var s,r,q,p,o,n,m,l,k,j,i,h,g=t.t,f=A.c([],g),e=A.c([],g),d=A.c([],t.ho)
for(g=this.b,s=this.a.a,r=J.t(s),q=this.c,p=q.length,o=f.$flags|0,n=e.$flags|0,m=0;m<g.length;++m){if(!(m<p))return A.a(q,m)
if(q[m]!==13)continue
l=r.h(s,g[m])
k=$.oE()
switch(A.af(k,l)&3){case 1:if(f.length===63)return A.pK(d)
j=A.af(k,l)
B.a.l(f,A.pJ(j===0?-1:B.b.J(j,2)))
B.a.l(e,m)
break
case 2:i=A.pJ(l)
for(h=f.length-1;h>=0;--h){if(f[h]!==i)continue
if(!(h<e.length))return A.a(e,h)
B.a.l(d,new A.G(e[h],m))
k=f.length
o&1&&A.y(f,18)
A.aq(h,k,k)
f.splice(h,k-h)
k=e.length
n&1&&A.y(e,18)
A.aq(h,k,k)
e.splice(h,k-h)
break}break}}return A.pK(d)},
f3(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=(e.r&1)===1?1:0
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
eT(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this
for(s=e.b,r=s.length,q=e.a.f,p=q.$flags|0,o=e.r,n=(o&1)===0,m=e.c,l=m.length,k=o+1,j=o+2,i=0;i<r;++i){if(!(i<l))return A.a(m,i)
h=m[i]
if(n)if(h===1)g=k
else g=h===6||h===3?j:o
else g=h===0||h===3||h===6?k:o
f=s[i]
p&2&&A.y(q)
if(!(f<q.length))return A.a(q,f)
q[f]=g}}}
A.kX.prototype={
$2(a,b){var s=t.gn
return B.b.ac(s.a(a).a,s.a(b).a)},
$S:102}
A.el.prototype={
gk(a){return this.b-this.a},
p(a){return"ScriptRun("+this.a+".."+this.b+", "+A.ay(this.c)+")"}}
A.mY.prototype={
$0(){var s,r,q,p=new Int32Array(171)
for(s=0;s<171;++s){r=B.cy.h(0,B.D[s])
q=r==null?1145457748:A.u5(r)
if(!(s<171))return A.a(p,s)
p[s]=q}return p},
$S:107}
A.j.prototype={
gk(a){return this.a.byteLength},
V(a,b){return a>=0&&b>=0&&a+b<=this.a.byteLength},
co(a){var s
this.j(a,3)
s=this.a
return(s.getUint8(a)<<16|s.getUint8(a+1)<<8|s.getUint8(a+2))>>>0},
X(a){var s,r,q,p,o=this,n=a*2
o.j(o.b,n)
s=new Uint16Array(a)
for(r=o.a,q=0;q<a;++q){p=r.getUint16(o.b+q*2,!1)
if(!(q<a))return A.a(s,q)
s[q]=p}o.b+=n
return s},
j(a,b){if(!this.V(a,b))throw A.e(A.h("read of "+b+" byte(s) at "+a+" overruns a "+this.gk(0)+"-byte font"))}}
A.am.prototype={
p(a){return"FontFormatException: "+this.a}}
A.i9.prototype={}
A.it.prototype={}
A.hZ.prototype={
ghx(a){var s=this.b
s===$&&A.r()
return s},
ghL(a){var s=this.c
s===$&&A.r()
return s},
hy(a,b){return this.ghx(this).$1(b)},
hM(a,b){return this.ghL(this).$1(b)}}
A.aP.prototype={
sh0(a){this.e=t.nw.a(a)}}
A.ju.prototype={
e3(a,b){var s,r=this,q=r.a.b,p=t.gz.a(A.N(q+2,B.w,!1,t.kp))
r.b!==$&&A.ow()
r.b=p
B.a.m(p,q+1,a)
for(;q>=0;--q){s=q+1
if(!(s<p.length))return A.a(p,s)
B.a.m(p,q,r.eP(p[s],q))}},
ds(a){var s=this.f.h(0,a)
s=s==null?null:s.e
return s==null?B.w:s},
hv(a,b,c){var s={},r=A.c([],t.r)
s.a=0
B.a.W(this.ds(a),new A.jw(s,r,b,c))
return r},
dh(a,b){var s,r=a.d
if(J.p(r.h(0,"cluster"),!0))return r.h(0,b.a)
s=this.d
s.sag(r)
return b.hy(0,s)},
fH(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
t.kp.a(b)
s=t.N
r=t.O
q=A.A(s,r)
for(p=f.c,o=p.length,n=f.d,m=0;m<p.length;p.length===o||(0,A.i)(p),++m){l=p[m]
k=f.dh(a,l)
for(j=b.length,i=l.a,h=0;h<b.length;b.length===j||(0,A.i)(b),++h){g=f.dh(b[h],l)
n.f=k
n.sag(A.e4([i,g],s,r))
k=l.hM(0,n)}q.m(0,i,k)}return q},
eP(b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3=this
t.kp.a(b4)
s=b3.a
r=s.a/(512*B.b.ad(1,b5))
q=A.A(t.S,t.L)
p=new A.jv(r)
for(o=t.t,n=0;m=b4.length,n<m;++n){m=b4[n]
m=p.$2(m.a,m.b)
l=q.h(0,m)
if(l==null){l=A.c([],o)
q.m(0,m,l)
m=l}else m=l
B.a.l(m,n)}k=new Uint8Array(m)
l=t.r
j=A.c([],l)
i=A.c([],o)
for(o=b3.c,h=b3.f,g=t.N,f=t.O,e=r*r,s=s.c,n=0;n<b4.length;++n){if(!(n<m))return A.a(k,n)
if(k[n]!==0)continue
d=b4[n]
B.a.a2(i)
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
B.a.l(i,a7)
if(!(a7<b4.length))return A.a(b4,a7)
a0+=b4[a7].c}}if(!(n<m))return A.a(k,n)
k[n]=1
a2=i.length
if(a2===0||a0<s){B.a.l(j,d)
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
else{a2=A.c([],l)
for(a5=i.length,a6=0;a6<i.length;i.length===a5||(0,A.i)(i),++a6){a7=i[a6]
if(!(a7>=0&&a7<b4.length))return A.a(b4,a7)
a2.push(b4[a7])}a2=b3.fH(d,a2)}if(a2!=null)a.P(0,a2)
a.m(0,"$id",b)
a.m(0,"cluster",!0)
a.m(0,"cluster_id",b)
a.m(0,"point_count",a0)
if(a0>=1e4)a2=""+B.c.ah(a0/1000)+"k"
else a2=a0>=1000?A.w(B.c.ah(a0/100)/10)+"k":a0
a.m(0,"point_count_abbreviated",a2)
a=new A.aP(b1/a0,b2/a0,a0,a)
a0=A.c([d],l)
for(a2=i.length,a6=0;a6<i.length;i.length===a2||(0,A.i)(i),++a6){a7=i[a6]
if(!(a7>=0&&a7<b4.length))return A.a(b4,a7)
a0.push(b4[a7])}a.sh0(a0)
a.f=b5
h.m(0,b,a)
B.a.l(j,a)}return j}}
A.jw.prototype={
$1(a){var s,r,q=this
t.el.a(a)
s=q.b
if(s.length>=q.c)return
r=a.e
if(r!=null)B.a.W(r,q)
else if(q.a.a++>=q.d)B.a.l(s,a)},
$S:36}
A.jv.prototype={
$2(a,b){var s=this.a
return B.c.a6(a/s)*67108864+B.c.a6(b/s)},
$S:38}
A.a9.prototype={
gbc(){var s,r,q=new A.jE(),p=new A.jD(),o=this.a,n=q.$1(o),m=this.b,l=q.$1(m),k=this.c,j=q.$1(k),i=p.$1(0.2225045*n+0.7168786*l+0.0606169*j)
q=o===m
s=q&&m===k?i:p.$1((0.4360747*n+0.3850649*l+0.1430804*j)/0.96422)
r=q&&m===k?i:p.$1((0.0139322*n+0.0971045*l+0.7141733*j)/0.82521)
return new A.dk(Math.max(0,116*i-16),500*(s-i),200*(i-r))}}
A.jE.prototype={
$1(a){return a<=0.04045?a/12.92:Math.pow((a+0.055)/1.055,2.4)},
$S:4}
A.jD.prototype={
$1(a){return a>0.008856451679035631?Math.pow(a,0.3333333333333333):a/0.12841854934601665+0.13793103448275862},
$S:4}
A.jB.prototype={
$1(a){return a>0.20689655172413793?a*a*a:0.12841854934601665*(a-0.13793103448275862)},
$S:4}
A.jC.prototype={
$1(a){return B.c.F(a<=0.0031308?12.92*a:1.055*Math.pow(a,0.4166666666666667)-0.055,0,1)},
$S:4}
A.jJ.prototype={
$0(){return A.tN(this.a)},
$S:40}
A.jF.prototype={
$1(a){A.S(a)
return a+a},
$S:41}
A.jG.prototype={
$1(a){return A.S(a).length!==0},
$S:42}
A.jH.prototype={
$2(a,b){var s,r=this.a
if(!(a<r.length))return A.a(r,a)
s=r[a]
if(B.d.dA(s,"%")){r=A.T(B.d.a4(s,0,s.length-1))
r=(r==null?0:r)/100}else{r=A.T(s)
r=(r==null?0:r)/b}return r},
$S:43}
A.jI.prototype={
$1(a){var s,r=this
if(a<0)++a
if(a>1)--a
if(a<0.16666666666666666){s=r.a
return s+(r.b-s)*6*a}if(a<0.5)return r.b
if(a<0.6666666666666666){s=r.a
return s+(r.b-s)*(0.6666666666666666-a)*6}return r.a},
$S:4}
A.z.prototype={
sag(a){this.b=t.lb.a(a)},
shw(a){this.r=t.dw.a(a)}}
A.lr.prototype={
$1(a){t.X.a(a)
return this.a},
$S:2}
A.n8.prototype={
$1(a){return B.d.bv(A.bA(this.a.$1(t.X.a(a))))},
$S:5}
A.n9.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=s.length,q=t.j,p=0,o="";p<s.length;s.length===r||(0,A.i)(s),++p){n=s[p]
o+=typeof n=="string"?n:A.bA(a.b.h(0,B.a.gv(q.a(n))))}return B.d.bv(o.charCodeAt(0)==0?o:o)},
$S:5}
A.n6.prototype={
$1(a){return!0},
$S:1}
A.n7.prototype={
$1(a){return J.p(this.a.$1(a),!0)},
$S:1}
A.lE.prototype={
$2(a,b){var s=J.ak(b)
if(s.D(b,"$type"))s=a.c
else s=s.D(b,"$id")?null:a.b.h(0,b)
return s},
$S:47}
A.lv.prototype={
$1(a){var s,r,q
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q)if(!J.p(s[q].$1(a),!0))return!1
return!0},
$S:1}
A.lw.prototype={
$1(a){var s,r,q
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q)if(J.p(s[q].$1(a),!0))return!0
return!1},
$S:1}
A.lx.prototype={
$1(a){var s,r,q
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q)if(J.p(s[q].$1(a),!0))return!1
return!0},
$S:1}
A.ly.prototype={
$1(a){return!t.X.a(a).b.K(this.a)},
$S:1}
A.lz.prototype={
$1(a){return!this.a.u(0,this.b.$2(t.X.a(a),this.c))},
$S:1}
A.lA.prototype={
$1(a){return this.a.u(0,this.b.$2(t.X.a(a),this.c))},
$S:1}
A.lB.prototype={
$1(a){return J.p(this.a.$2(t.X.a(a),this.b),this.c)},
$S:1}
A.lC.prototype={
$1(a){return!J.p(this.a.$2(t.X.a(a),this.b),this.c)},
$S:1}
A.lD.prototype={
$1(a){var s=this
t.X.a(a)
return A.o8(A.S(s.a),s.b.$2(a,s.c),s.d)},
$S:1}
A.lX.prototype={
$1(a){var s=this.a
return a<s.length?A.q(s[a]):A.ac(null)},
$S:48}
A.lW.prototype={
$0(){var s,r,q,p=A.c([],t.V)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q)p.push(A.q(s[q]))
return p},
$S:49}
A.mS.prototype={
$1(a){t.f3.a(a)
return new A.mT(this.a.$1(0),a)},
$S:50}
A.mT.prototype={
$1(a){var s=A.C(this.a.$1(t.X.a(a)))
return s==null?null:this.b.$1(s)},
$S:11}
A.lY.prototype={
$1(a){var s,r
t.X.a(a)
s=this.a.$1(a)
A:{if(t.f.b(s)){r=s.h(0,this.b.$1(a))
break A}r=null
break A}return r},
$S:2}
A.lZ.prototype={
$1(a){return t.X.a(a).b.h(0,this.a)},
$S:2}
A.m_.prototype={
$1(a){t.X.a(a)
return a.b.h(0,this.a.$1(a))},
$S:2}
A.ma.prototype={
$1(a){var s,r
t.X.a(a)
s=this.a.$1(a)
A:{if(t.f.b(s)){r=s.K(this.b.$1(a))
break A}r=!1
break A}return r},
$S:1}
A.ml.prototype={
$1(a){return t.X.a(a).b.K(this.a)},
$S:1}
A.mw.prototype={
$1(a){return!t.X.a(a).b.K(this.a)},
$S:1}
A.mH.prototype={
$1(a){return t.X.a(a).b},
$S:52}
A.mN.prototype={
$1(a){return t.X.a(a).b.h(0,"$id")},
$S:2}
A.mO.prototype={
$1(a){return t.X.a(a).f},
$S:2}
A.mP.prototype={
$1(a){t.X.a(a)
return B.k.h(0,this.a)},
$S:2}
A.mQ.prototype={
$1(a){t.X.a(a)
return 0},
$S:9}
A.m0.prototype={
$1(a){var s,r
t.X.a(a)
s=a.r
r=s==null?null:s.$0()
return r!=null&&a.c!=="Polygon"&&this.a.hm(r)},
$S:1}
A.m1.prototype={
$1(a){var s,r
t.X.a(a)
s=a.r
r=s==null?null:s.$0()
return r==null?null:this.a.h7(r,a.c!=="Point")},
$S:11}
A.m2.prototype={
$1(a){var s,r=this.a.$1(t.X.a(a))
A:{if(r==null){s="null"
break A}if(typeof r=="string"){s="string"
break A}if(typeof r=="number"){s="number"
break A}if(A.R(r)){s="boolean"
break A}if(t.j.b(r)){s="array"
break A}if(r instanceof A.a9){s="color"
break A}s="object"
break A}return s},
$S:5}
A.m3.prototype={
$1(a){var s=A.cl(this.a.$1(t.X.a(a)))
return s==null?null:A.c([s.a*255,s.b*255,s.c*255,s.d],t.n)},
$S:54}
A.m4.prototype={
$1(a){var s,r,q,p,o,n,m
t.X.a(a)
s=this.a.$1(a)
r=typeof s=="string"
if(r)q=s.length
else q=t.j.b(s)?J.Z(s):-1
if(q<0)return null
p=new A.mR(q)
o=p.$2(this.b.$1(a),0)
n=this.c
m=Math.max(o,A.vW(p.$2(n==null?null:n.$1(a),q)))
if(r)r=B.d.a4(s,o,m)
else{s.toString
r=J.r7(t.j.a(s),o,m)}return r},
$S:2}
A.mR.prototype={
$2(a,b){var s=A.C(a),r=s==null?null:B.c.M(s)
if(r==null)r=b
if(r<0)r+=this.a
return B.b.F(r,0,this.a)},
$S:55}
A.m5.prototype={
$1(a){var s,r,q,p
t.X.a(a)
s=this.a.$1(a)
r=this.b.$1(a)
q=this.c
q=A.C(q==null?null:q.$1(a))
p=q==null?null:B.c.M(q)
if(p==null)p=0
if(typeof s=="string"&&typeof r=="string")return B.d.aH(s,r,p)
if(t.j.b(s))return J.r5(s,r,p)
return-1},
$S:20}
A.m6.prototype={
$1(a){return t.X.a(a).a},
$S:9}
A.m7.prototype={
$1(a){return t.X.a(a).c},
$S:5}
A.m8.prototype={
$1(a){return!A.qh(this.a.$1(t.X.a(a)))},
$S:1}
A.m9.prototype={
$1(a){var s,r,q=this
t.X.a(a)
s=q.a.$1(a)
if(typeof s=="string")s=s.toLowerCase()
r=q.b.$1(a)
if(typeof r=="string")r=r.toLowerCase()
if(q.c)return J.p(s,r)===(q.d==="==")
return A.o8(q.d,s,r)},
$S:1}
A.mb.prototype={
$1(a){t.X.a(a)
return J.p(this.a.$1(a),this.b.$1(a))},
$S:1}
A.mc.prototype={
$1(a){t.X.a(a)
return!J.p(this.a.$1(a),this.b.$1(a))},
$S:1}
A.md.prototype={
$1(a){t.X.a(a)
return A.o8(this.a,this.b.$1(a),this.c.$1(a))},
$S:1}
A.me.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].$1(a)
o=!1
if(p!=null){n=J.ak(p)
if(!n.D(p,!1))if(!n.D(p,0))if(!n.D(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(!p)return!1}return!0},
$S:1}
A.mf.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].$1(a)
o=!1
if(p!=null){n=J.ak(p)
if(!n.D(p,!1))if(!n.D(p,0))if(!n.D(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(p)return!0}return!1},
$S:1}
A.mg.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].$1(a)
o=!1
if(p!=null){n=J.ak(p)
if(!n.D(p,!1))if(!n.D(p,0))if(!n.D(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(p)return!1}return!0},
$S:1}
A.mh.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=0;q=r+1,p=s.length,q<p;r+=2){if(!(r<p))return A.a(s,r)
p=s[r].$1(a)
o=!1
if(p!=null){n=J.ak(p)
if(!n.D(p,!1))if(!n.D(p,0))if(!n.D(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(p){if(!(q<s.length))return A.a(s,q)
return s[q].$1(a)}}return r<p?s[r].$1(a):null},
$S:2}
A.mi.prototype={
$1(a){var s
t.X.a(a)
s=this.a.h(0,this.b.$1(a))
return(s==null?this.c:s).$1(a)},
$S:2}
A.mj.prototype={
$1(a){var s,r,q,p
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].$1(a)
if(p!=null)return p}return null},
$S:2}
A.mk.prototype={
$1(a){var s,r,q,p,o,n,m,l=this
t.X.a(a)
s=A.C(l.a.$1(a))
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
A.mm.prototype={
$1(a){return A.bA(this.a.$1(t.X.a(a)))},
$S:5}
A.mn.prototype={
$1(a){var s,r,q,p,o,n,m,l=A.C(this.a.$1(t.X.a(a)))
if(l==null)return""
s=this.b
r=B.c.hT(l,s)
q=this.c
if(s>q&&B.d.u(r,".")){s=B.d.aW(r,".")
p=q===0?0:1
o=s+q+p
n=r.length
m=n
for(;;){if(m>o){s=m-1
if(!(s>=0))return A.a(r,s)
s=r[s]==="0"}else s=!1
if(!s)break;--m}r=B.d.a4(r,0,m>0&&r[m-1]==="."?m-1:m)}return r},
$S:5}
A.mo.prototype={
$1(a){t.X.a(a)
return A.c(A.bA(this.a.$1(a)).split(A.bA(this.b.$1(a))),t.s)},
$S:57}
A.mp.prototype={
$1(a){var s,r
t.X.a(a)
s=this.a.$1(a)
A:{if(t.j.b(s)){r=J.i5(s,A.w5(),t.N).a7(0,A.bA(this.b.$1(a)))
break A}r=""
break A}return r},
$S:5}
A.mq.prototype={
$1(a){var s,r,q,p,o
t.X.a(a)
s=A.c([],t.n)
for(r=this.a,q=r.length,p=0;p<r.length;r.length===q||(0,A.i)(r),++p){o=r[p].$1(a)
if(!(typeof o=="number"))if(typeof o=="string")o=A.T(o)
else if(A.R(o))o=o?1:0
else o=null
s.push(o==null?0:o)}if(s.length<3)return null
r=B.c.Y(s[0],360)
q=B.c.F(s[1]/100,0,1)
if(2>=s.length)return A.a(s,2)
o=B.c.F(s[2]/100,0,1)
s=s.length>3?s[3]:1
return A.pt(r/360,q,o,s)},
$S:13}
A.mr.prototype={
$1(a){var s,r,q,p,o
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].$1(a)
if(!(typeof p=="number"))if(typeof p=="string"){o=A.T(p)
p=o}else{if(A.R(p))o=p?1:0
else o=null
p=o}if(p!=null)return p}return this.b==="to-number"?0:null},
$S:11}
A.ms.prototype={
$1(a){return A.qh(this.a.$1(t.X.a(a)))},
$S:1}
A.mt.prototype={
$1(a){return A.cl(this.a.$1(t.X.a(a)))},
$S:13}
A.mu.prototype={
$1(a){var s,r,q,p
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].$1(a)
if(p!=null)return p}return null},
$S:2}
A.mv.prototype={
$1(a){var s,r,q,p
t.X.a(a)
for(s=this.a,r=s.length,q=0,p="";q<s.length;s.length===r||(0,A.i)(s),++q)p+=A.bA(s[q].$1(a))
return p.charCodeAt(0)==0?p:p},
$S:5}
A.mx.prototype={
$1(a){return A.bA(this.a.$1(t.X.a(a))).toUpperCase()},
$S:5}
A.my.prototype={
$1(a){return A.bA(this.a.$1(t.X.a(a))).toLowerCase()},
$S:5}
A.mz.prototype={
$1(a){var s,r,q,p,o,n,m
t.X.a(a)
for(s=this.a,r=s.length,q=this.b,p=null,o=0;o<s.length;s.length===r||(0,A.i)(s),++o){n=s[o].$1(a)
if(!(typeof n=="number"))if(typeof n=="string"){m=A.T(n)
n=m}else{if(A.R(n))m=n?1:0
else m=null
n=m}if(n==null)return null
if(p==null)p=n
else{A:{if("+"===q){m=p+n
break A}if("*"===q){m=p*n
break A}if("min"===q){m=Math.min(p,n)
break A}m=Math.max(p,n)
break A}p=m}}return p},
$S:11}
A.mA.prototype={
$1(a){return-a},
$S:4}
A.mB.prototype={
$1(a){var s,r,q,p
t.X.a(a)
s=A.C(this.a.$1(a))
r=A.C(this.b.$1(a))
if(s==null||r==null)return null
q=this.c
A:{if("-"===q){p=s-r
break A}if("/"===q){p=s/r
break A}if("%"===q){p=B.c.Y(s,r)
break A}p=Math.pow(s,r)
break A}return p},
$S:11}
A.mC.prototype={
$1(a){return B.c.av(a)},
$S:4}
A.mD.prototype={
$1(a){return Math.floor(a)},
$S:4}
A.mE.prototype={
$1(a){return Math.ceil(a)},
$S:4}
A.mF.prototype={
$1(a){return Math.abs(a)},
$S:4}
A.mG.prototype={
$1(a){return Math.log(a)/2.302585092994046},
$S:4}
A.mI.prototype={
$1(a){return Math.log(a)/0.6931471805599453},
$S:4}
A.mJ.prototype={
$1(a){var s,r=this.a.$1(t.X.a(a))
if(typeof r=="string")s=r.length
else s=t.j.b(r)?J.Z(r):null
return s},
$S:59}
A.mK.prototype={
$1(a){var s,r
t.X.a(a)
s=this.a.$1(a)
r=this.b.$1(a)
if(t.j.b(s))return J.oJ(s,r)
if(typeof s=="string"&&typeof r=="string")return B.d.u(s,r)
return!1},
$S:1}
A.mL.prototype={
$1(a){var s,r,q
t.X.a(a)
s=this.a.$1(a)
r=A.C(this.b.$1(a))
q=r==null?null:B.c.M(r)
return t.j.b(s)&&q!=null&&q>=0&&q<J.Z(s)?J.b0(s,q):null},
$S:60}
A.mM.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
s=A.c([],t.n)
for(r=this.a,q=r.length,p=0;p<r.length;r.length===q||(0,A.i)(r),++p){o=r[p].$1(a)
if(!(typeof o=="number"))if(typeof o=="string")o=A.T(o)
else if(A.R(o))o=o?1:0
else o=null
s.push(o==null?0:o)}r=s.length
if(r<3)return null
q=s[0]
o=s[1]
n=s[2]
s=r>3?s[3]:1
return new A.a9(q/255,o/255,n/255,s)},
$S:13}
A.lF.prototype={
$1(a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this
t.X.a(a5)
s=A.C(a4.a.$1(a5))
if(s==null||s<=B.a.gv(a4.b))return B.a.hh(a4.c,a5)
r=a4.b
if(s>=B.a.ga0(r))return B.a.hu(a4.c,a5)
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
if(r!=null){r=A.uR(r,m/n)
l=r}else{r=a4.e
r=r===1?m/n:(Math.pow(r,m)-1)/(Math.pow(r,n)-1)
l=r}}r=a4.c
if(!(q<r.length))return A.a(r,q)
k=r[q].$1(a5)
if(!(p<r.length))return A.a(r,p)
j=r[p].$1(a5)
if(typeof k=="number"&&typeof j=="number"){if(a4.f&&k>0&&j>0)return k*Math.pow(j/k,l)
return k+(j-k)*l}r=t.j
if(r.b(k)&&r.b(j)&&J.Z(k)===J.Z(j)){r=A.c([],t.n)
for(q=J.t(k),o=J.t(j),i=0;i<q.gk(k);++i){h=q.h(k,i)
if(!(typeof h=="number"))if(typeof h=="string")h=A.T(h)
else if(A.R(h))h=h?1:0
else h=null
if(h==null)h=0
g=o.h(j,i)
if(!(typeof g=="number"))if(typeof g=="string")g=A.T(g)
else if(A.R(g))g=g?1:0
else g=null
if(g==null)g=0
f=q.h(k,i)
if(!(typeof f=="number"))if(typeof f=="string")f=A.T(f)
else if(A.R(f))f=f?1:0
else f=null
r.push(h+(g-(f==null?0:f))*l)}return r}e=A.cl(k)
d=A.cl(j)
if(e!=null&&d!=null){c=a4.r
A:{if("hcl"===c){k=e.gbc()
j=d.gbc()
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
h=A.ps(r+(j.a-r)*l,q*a5,o*a5,h+(d.d-h)*l)
r=h
break A}if("lab"===c){k=e.gbc()
j=d.gbc()
r=k.a
q=k.b
o=k.c
h=e.d
h=A.ps(r+(j.a-r)*l,q+(j.b-q)*l,o+(j.c-o)*l,h+(d.d-h)*l)
r=h
break A}r=e.a
q=d.a
o=e.b
h=d.b
g=e.c
f=d.c
a3=e.d
a3=new A.a9(r+(q-r)*l,o+(h-o)*l,g+(f-g)*l,a3+(d.d-a3)*l)
r=a3
break A}return r}return k},
$S:2}
A.lo.prototype={
$3(a,b,c){var s=1-a,r=3*s
return r*s*a*b+r*a*a*c+a*a*a},
$S:61}
A.lI.prototype={
$1(a){return a.b.h(0,this.a)},
$S:2}
A.lJ.prototype={
$1(a){return a.a},
$S:9}
A.lK.prototype={
$1(a){var s=this.a.$1(t.X.a(a))
return s==null?this.b:s},
$S:2}
A.lL.prototype={
$1(a){var s
if(t.j.b(a)){s=J.t(a)
s=s.gI(a)&&t.f.b(s.gv(a))}else s=!1
return s},
$S:22}
A.lM.prototype={
$1(a){var s=this.a.h(0,this.b.$1(t.X.a(a)))
return s==null?this.c:s},
$S:2}
A.lN.prototype={
$1(a){return typeof a=="number"||A.cl(a)!=null},
$S:24}
A.lO.prototype={
$1(a){var s,r,q,p,o,n,m=this,l=A.C(m.a.$1(t.X.a(a)))
if(l==null)return m.b
s=m.c
r=B.a.gv(s)
q=s.length
p=m.d
o=p.length
n=0
for(;;){if(!(n<o&&p[n]<=l))break
if(!(n<q))return A.a(s,n)
r=s[n];++n}return r},
$S:2}
A.lP.prototype={
$1(a){t.X.a(a)
return a.b.h(0,this.a)==null?this.b:this.c.$1(a)},
$S:2}
A.lq.prototype={
$1(a){return a.a},
$S:9}
A.fa.prototype={}
A.fv.prototype={
fT(a9,b0,b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6=this,a7={},a8=t.L
a8.a(b1)
a8.a(b2)
if(b3<b4)return
a7.a=-1
s=a6.f
s.b=0
r=A.c([],t.t)
a8=a6.b
q=B.b.U(a8.b,4)
p=a6.d
o=p.b
n=new A.iE(a7,a6,s,r)
for(m=b0.length,l=0,k=0,j=0,i=0;i<b1.length;++i){h=b1[i]
if(!(i<b2.length))return A.a(b2,i)
g=b2[i]
f=g-h
if(f<3)continue
e=h*2
if(!(e<m))return A.a(b0,e)
d=b0[e]
c=(g-1)*2
if(!(c>=0&&c<m))return A.a(b0,c)
if(d===b0[c]){++e
if(!(e<m))return A.a(b0,e)
e=b0[e];++c
if(!(c<m))return A.a(b0,c)
c=e===b0[c]
e=c}else e=!1
if(e)--f
for(b=0,a=0;a<f;a=a0){a0=a+1
a1=B.b.Y(a0,f)
e=(h+a)*2
if(!(e<m))return A.a(b0,e)
d=b0[e]
c=(h+a1)*2
a2=c+1
if(!(a2>=0&&a2<m))return A.a(b0,a2)
a2=b0[a2]
if(!(c>=0&&c<m))return A.a(b0,c)
c=b0[c];++e
if(!(e<m))return A.a(b0,e)
b+=d*a2-c*b0[e]}if(Math.abs(b)<1)continue
if(b>0){n.$0()
a=a7.a=0
j+=b
for(;a<f;++a){e=(h+a)*2
if(!(e<m))return A.a(b0,e)
l+=b0[e]*b/f;++e
if(!(e<m))return A.a(b0,e)
k+=b0[e]*b/f}}else if(a7.a>=0)B.a.l(r,B.b.U(s.b,2))
else continue
for(a=0;a<f;){e=(h+a)*2
if(!(e<m))return A.a(b0,e)
a3=b0[e];++e
if(!(e<m))return A.a(b0,e)
a4=b0[e]
s.bV(a3,a4);++a
e=(h+B.b.Y(a,f))*2
if(!(e>=0&&e<m))return A.a(b0,e)
d=b0[e];++e
if(!(e<m))return A.a(b0,e)
a8.aE(a3,a4,d,b0[e])}}n.$0()
a5=B.b.U(a8.b,4)-q
if(a5===0||j===0)return
a8=a6.e
a8.aE(b3,b4,l/j,k/j)
a8.aE(q,a5,o,p.b-o)
a8.aE(b5.a,b5.b,b5.c,b5.d)},
hg(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1=this,b2={},b3=b1.e,b4=b3.b
if(b4===0)return null
for(s=b3.a,r=s.length,q=0,p=0;p<b4;p+=12){o=p+5
if(!(o<r))return A.a(s,o)
o=B.c.M(s[o])
n=p+7
if(!(n<r))return A.a(s,n)
q+=o*6+B.c.M(s[n])}m=new Float32Array(q*5)
b2.a=0
for(b4=b1.d,s=b1.c,r=b1.b,p=0;p<b3.b;p+=12){o=b3.a
n=o.length
if(!(p<n))return A.a(o,p)
l=o[p]
k=p+1
if(!(k<n))return A.a(o,k)
j=o[k]
k=p+8
if(!(k<n))return A.a(o,k)
i=o[k]
k=p+9
if(!(k<n))return A.a(o,k)
h=o[k]
k=p+10
if(!(k<n))return A.a(o,k)
g=o[k]
k=p+11
if(!(k<n))return A.a(o,k)
f=new A.iF(b2,m,i,h,g,B.c.F(B.c.av(o[k]*255),0,255))
k=p+4
o=b3.a
n=o.length
if(!(k<n))return A.a(o,k)
e=B.c.M(o[k])
k=p+5
if(!(k<n))return A.a(o,k)
for(o=e+B.c.M(o[k]),d=e;d<o;++d){n=d*4
k=r.a
c=k.length
if(!(n>=0&&n<c))return A.a(k,n)
b=k[n]
a=n+1
if(!(a<c))return A.a(k,a)
a0=k[a]
a=n+2
if(!(a<c))return A.a(k,a)
a1=k[a]
n+=3
if(!(n<c))return A.a(k,n)
a2=k[n]
a3=a2-a0
a4=b-a1
a5=Math.sqrt(a3*a3+a4*a4)
a6=0.72+0.2*(a5===0?0:(a3*-0.6+a4*-0.8)/a5)
a7=a6*0.82
f.$4(b,a0,j,a7)
f.$4(a1,a2,j,a7)
f.$4(a1,a2,l,a6)
f.$4(b,a0,j,a7)
f.$4(a1,a2,l,a6)
f.$4(b,a0,l,a6)}o=p+6
n=b3.a
k=n.length
if(!(o<k))return A.a(n,o)
a8=B.c.M(n[o])
o=p+7
if(!(o<k))return A.a(n,o)
for(o=a8+B.c.M(n[o]),d=a8;d<o;++d){n=b4.a
if(!(d>=0&&d<n.length))return A.a(n,d)
n=B.c.M(n[d])*2
k=s.a
c=k.length
if(!(n>=0&&n<c))return A.a(k,n)
a=k[n];++n
if(!(n<c))return A.a(k,n)
f.$4(a,k[n],l,1)}}a9=new Float32Array(A.ad(A.cV(r.a,0,r.b)))
b0=new Float32Array(A.ad(A.cV(b3.a,0,b3.b)))
b3=new Float32Array(A.ad(A.cV(s.a,0,s.b)))
b4=new Float32Array(A.ad(A.cV(b4.a,0,b4.b)))
return new A.fa(A.ri(a9,b0),m,b1.a,a9,b3,b4,b0)}}
A.iE.prototype={
$0(){var s,r,q,p,o,n,m,l,k,j,i=this,h=i.a
if(h.a<0||i.c.b<6)return
s=i.c
r=i.d
q=A.oZ(B.m.G(s.a,0,s.b),r)
p=i.b
o=p.c
n=o.b
m=B.b.U(n,2)
n+=s.b
if(n>o.a.length)o.bb(n)
n=o.a
l=o.b
B.m.Z(n,l,l+s.b,s.a)
o.b=o.b+s.b
for(o=q.length,p=p.d,k=0;k<q.length;q.length===o||(0,A.i)(q),++k){j=q[k]
n=p.b
if(n===p.a.length)p.bb(n+1)
n=p.a
l=p.b++
n.$flags&2&&A.y(n)
if(!(l<n.length))return A.a(n,l)
n[l]=m+j}s.b=0
B.a.a2(r)
h.a=-1},
$S:0}
A.iF.prototype={
$4(a,b,c,d){var s,r,q,p=this,o=new A.iG(d),n=p.b,m=p.a,l=m.a,k=m.a=l+1
n.$flags&2&&A.y(n)
s=n.length
if(!(l<s))return A.a(n,l)
n[l]=a
r=m.a=k+1
if(!(k<s))return A.a(n,k)
n[k]=b
k=m.a=r+1
if(!(r<s))return A.a(n,r)
n[r]=c
m.a=k+1
l=o.$1(p.c)
q=o.$1(p.d)
if(typeof q!=="number")return q.ao()
if(typeof l!=="number")return l.b3()
o=o.$1(p.e)
if(typeof o!=="number")return o.ao()
if(!(k<s))return A.a(n,k)
n[k]=l+q*256+o*65536
m=m.a++
if(!(m<s))return A.a(n,m)
n[m]=p.f},
$S:63}
A.iG.prototype={
$1(a){return B.b.F(B.c.ah(a*this.a*255),0,255)},
$S:16}
A.bg.prototype={
cQ(a){var s,r,q,p,o,n=this,m=t.f
if(!m.b(a))return
switch(a.h(0,"type")){case"FeatureCollection":s=a.h(0,"features")
if(t.j.b(s))J.nI(s,n.geQ())
break
case"Feature":r=a.h(0,"properties")
q=A.A(t.N,t.O)
if(m.b(r))for(m=r.gaj(),m=m.gt(m);m.n();){p=m.gq()
q.m(0,A.w(p.a),p.b)}if(n.b)o=n.c++
else{m=n.a
o=m!=null?q.h(0,m):a.h(0,"id")}if(o!=null)q.m(0,"$id",o)
n.bL(a.h(0,"geometry"),q)
break
default:n.bL(a,B.k)}},
bL(a,b){var s,r,q,p,o,n,m,l=this
t.lb.a(b)
if(!t.f.b(a))return
s=a.h(0,"coordinates")
switch(a.h(0,"type")){case"Point":l.aC(1,b,A.c([A.fy([s])],t.w))
break
case"MultiPoint":if(t.j.b(s))l.aC(1,b,A.c([A.fy(s)],t.w))
break
case"LineString":if(t.j.b(s))l.aC(2,b,A.c([A.fy(s)],t.w))
break
case"MultiLineString":r=t.j
if(r.b(s)){q=A.c([],t.w)
for(p=J.M(s);p.n();){o=p.gq()
if(r.b(o))q.push(A.fy(o))}l.aC(2,b,q)}break
case"Polygon":if(t.j.b(s))l.aC(3,b,l.d3(s))
break
case"MultiPolygon":r=t.j
if(r.b(s)){q=A.c([],t.w)
for(p=J.M(s);p.n();){n=p.gq()
if(r.b(n))B.a.P(q,l.d3(n))}l.aC(3,b,q)}break
case"GeometryCollection":m=a.h(0,"geometries")
if(t.j.b(m))for(r=J.M(m);r.n();)l.bL(r.gq(),b)
break}},
d3(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=A.c([],t.w)
for(s=J.t(a),r=t.j,q=0;q<s.gk(a);++q){p=s.h(a,q)
if(!r.b(p))continue
o=A.fy(p)
n=o.length
if(n<6)continue
if(A.rO(o)>0!==(q===0))for(m=n-2,n=o.$flags|0,l=0;l<m;l+=2,m-=2){k=o[l]
j=l+1
i=o[j]
h=o[m]
n&2&&A.y(o)
o[l]=h
h=m+1
o[j]=o[h]
o[m]=k
o[h]=i}B.a.l(g,o)}return g},
aC(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
t.lb.a(b)
t.lt.a(c)
if(this.e&&a===1){for(s=c.length,r=this.f,q=0;q<c.length;c.length===s||(0,A.i)(c),++q){p=c[q]
for(o=p.length,n=0;n<o;n+=2){m=p[n]
l=n+1
if(!(l<o))return A.a(p,l)
B.a.l(r,new A.aP(m,p[l],1,b))}}return}for(s=c.length,k=1/0,j=1/0,i=-1/0,h=-1/0,q=0;q<s;++q){p=c[q]
for(r=p.length,n=0;n<r;n+=2){g=p[n]
if(g<k)k=g
if(g>i)i=g
o=n+1
if(!(o<r))return A.a(p,o)
f=p[o]
if(f<j)j=f
if(f>h)h=f}}if(k>i)return
B.a.l(this.d,new A.hE(a,b,c,k,j,i,h))},
ak(b2,b3,b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9=B.b.ad(1,b2),b0=0.03125/a9,b1=A.c([],t.fB)
for(s=this.d,r=s.length,q=t.n,p=t.w,o=b3/a9-b0,n=(b3+1)/a9+b0,m=b4/a9-b0,l=(b4+1)/a9+b0,k=0;k<s.length;s.length===r||(0,A.i)(s),++k){j=s[k]
if(j.f<o||j.d>n||j.r<m||j.e>l)continue
i=A.c([],p)
h=j.a
g=h===2?A.c([],q):null
for(f=j.c,e=f.length,d=0;d<f.length;f.length===e||(0,A.i)(f),++d){c=f[d]
b=c.length
a=new Float64Array(b)
for(a0=0;a0<b;a0+=2){a1=c[a0]
if(!(a0<b))return A.a(a,a0)
a[a0]=(a1*a9-b3)*4096
a1=a0+1
if(!(a1<b))return A.a(c,a1)
a2=c[a1]
if(!(a1<b))return A.a(a,a1)
a[a1]=(a2*a9-b4)*4096}switch(h){case 1:B.a.l(i,a)
break
case 2:a3=A.c([],q)
a4=A.rP(a,i,a3)
for(b=a3.length,a1=1/a4,a2=a4===0,a5=0;a5<a3.length;a3.length===b||(0,A.i)(a3),++a5){a6=a3[a5]
g.toString
B.a.l(g,a2?0:a6/a4)
B.a.l(g,a2?0:a1)}break
default:a7=A.rQ(a)
if(a7.length>=6)B.a.l(i,a7)}}if(i.length!==0)B.a.l(b1,new A.df(g,h,j.b,i))}s=this.r
if(s==null)s=null
else{r=s.b
r===$&&A.r()
s=B.b.F(b2,0,s.a.b+1)
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]}if(s==null)s=B.w
r=s.length
k=0
for(;k<s.length;s.length===r||(0,A.i)(s),++k){a8=s[k]
q=a8.a
h=!0
if(!(q<o))if(!(q>n)){h=a8.b
h=h<m||h>l}if(h)continue
h=new Float64Array(2)
h[0]=(q*a9-b3)*4096
h[1]=(a8.b*a9-b4)*4096
B.a.l(b1,new A.df(null,1,a8.d,A.c([h],p)))}return b1.length===0?B.V:A.c([new A.hQ(b1)],t.n5)}}
A.iO.prototype={
$0(){var s=this.a,r=s.a
if(r.length>=4){B.a.l(this.b,new Float64Array(A.ad(r)))
B.a.l(this.c,s.b)}s.a=A.c([],t.n)},
$S:0}
A.iN.prototype={
$2(a,b){var s,r=this.a
if(!r.c)return
if(a===0){if(b<0)r.c=!1
return}s=b/a
if(a<0){if(s>r.b)r.c=!1
else if(s>r.a)r.a=s}else if(s<r.a)r.c=!1
else if(s<r.b)r.b=s},
$S:65}
A.iP.prototype={
$2(a,b){var s,r=this.a
A:{if(0===r){s=a>=-128
break A}if(1===r){s=a<=4224
break A}if(2===r){s=b>=-128
break A}s=b<=4224
break A}return s},
$S:12}
A.hE.prototype={}
A.hQ.prototype={
gan(){return""},
gc9(){return 4096},
$id9:1,
gca(){return this.a}}
A.df.prototype={
c_(a){return this.c},
cj(a){var s,r,q,p,o,n,m,l,k
for(s=this.d,r=s.length,q=a.c,p=0;p<s.length;s.length===r||(0,A.i)(s),++p){o=s[p]
B.a.l(q,a.b>>>1)
for(n=o.length,m=0;m<n;m+=2){l=o[m]
k=m+1
if(!(k<n))return A.a(o,k)
a.bW(l,o[k])}}B.a.l(q,a.b>>>1)},
$ikn:1,
gH(){return this.b}}
A.nm.prototype={
$1(a){var s,r,q
for(s=a+1,r=this.a;s<r.length;++s){q=B.E.h(0,r[s])
if((q==null?0:q)!==1)return s}return null},
$S:67}
A.iS.prototype={
hG(a){var s,r,q
t.bF.a(a)
s=B.a.a7(a,"\x01")
r=this.e
q=r.h(0,s)
if(q==null){q=new A.iU(this,a).$0()
r.m(0,s,q)
r=q}else r=q
return r},
gk(a){return this.c.length},
hi(a,b){var s=A.rS(b),r=this.f,q=a*1000+s,p=r.h(0,q)
if(p==null){p=new A.iT(this,a,s).$0()
r.m(0,q,p)
r=p}else r=p
return r}}
A.iU.prototype={
$0(){var s,r,q,p,o,n,m,l=A.c([],t.t)
for(s=this.b,r=s.length,q=this.a,p=q.c,q=q.d,o=0;o<s.length;s.length===r||(0,A.i)(s),++o){n=A.p0(s[o])
for(m=0;m<p.length;++m){if(!(m<q.length))return A.a(q,m)
if(q[m]===n&&!B.a.u(l,m))B.a.l(l,m)}}for(m=0;m<p.length;++m)if(!B.a.u(l,m))B.a.l(l,m)
return l},
$S:68}
A.iT.prototype={
$0(){var s,r=this.a.c,q=this.b
if(!(q>=0&&q<r.length))return A.a(r,q)
s=r[q]
r=s.a
if(!r.c.K(1719034226))return s
q=t.i
return new A.bP(r,A.nU(t.H.a(s.hF(A.e4(["wght",this.c],t.N,q))),q))},
$S:69}
A.jN.prototype={}
A.lp.prototype={
$2(a,b){return A.dn(a)+A.dn(b)},
$S:33}
A.nn.prototype={
$0(){var s,r,q,p,o=this
if(!o.b){s=o.c
s=s==1/0||s==-1/0}else s=!0
r=o.d
q=o.a
p=q.a
if(s)B.a.l(r,p)
else B.a.P(r,A.uS(o.e,p,o.f,o.r,o.c,o.w))
q.a=A.c([],t.t)},
$S:0}
A.lH.prototype={
$2(a,b){return Math.max(A.dn(a),t.hT.a(b).b)},
$S:71}
A.bk.prototype={}
A.hT.prototype={
B(){var s,r,q,p,o,n
for(s=this.a,r=s.length,q=0,p=0;;){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
p=(p|B.b.ab(n&127,q))>>>0
if(n<128)return p
q+=7}},
dI(){var s=this,r=s.B(),q=s.b,p=q+r
s.b=p
return new A.hT(s.a,q,p)},
T(a,b){var s,r=this
switch(b){case 0:r.B()
break
case 1:r.b+=8
break
case 2:s=r.B()
r.b+=s
break
case 5:r.b+=4
break
default:throw A.e(A.iJ("glyph pbf: wire type "+b,null,null))}}}
A.iV.prototype={
hb(a){var s=B.a.a7(t.bF.a(a),",")
return this.f.aY(s,new A.iW(this,s))},
hJ(a,b){var s,r,q,p,o,n,m
for(s=new A.d6(b),r=this.w,q=this.x,p=a<<16,o=!0;s.n();){n=B.b.J(s.d,8)
m=(p|n)>>>0
if(q.u(0,m))continue
if(r.l(0,m))this.ba(a,n,m)
o=!1}return o},
ba(a,b,a0){var s=0,r=A.au(t.o),q,p=2,o=[],n=this,m,l,k,j,i,h,g,f,e,d,c
var $async$ba=A.av(function(a1,a2){if(a1===1){o.push(a2)
s=p}for(;;)switch(s){case 0:e=n.e
d=a-512
if(!(d>=0&&d<e.length)){q=A.a(e,d)
s=1
break}e=A.uE(2,e[d],B.u,!1)
e=A.ov(n.a,"{fontstack}",e)
j=b*256
m=A.ov(e,"{range}",""+j+"-"+(j+255))
l=B.cd
p=4
e=n.y
if(e==null)e=n.y=new A.ee()
s=7
return A.U(e.bx(m,n.c),$async$ba)
case 7:k=a2
if(k.a===200)l=A.rU(k.b)
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
for(e=l,d=e.length,g=0;g<e.length;e.length===d||(0,A.i)(e),++g){f=e[g]
h.m(0,f.a,f)}n.x.l(0,a0)
n.d.$2(a,l)
case 1:return A.as(q,r)
case 2:return A.ar(o.at(-1),r)}})
return A.at($async$ba,r)}}
A.iW.prototype={
$0(){var s=this.a,r=s.e
B.a.l(r,this.b)
B.a.l(s.r,A.A(t.S,t.jv))
return 512+r.length-1},
$S:7}
A.iY.prototype={
cn(){var s,r,q,p,o,n=this,m=n.c
m=J.oH(B.F.gai(m),m.byteOffset,m.length)
s=A.c([],t.E)
for(r=n.d,q=r.length,p=0;p<r.length;r.length===q||(0,A.i)(r),++p){o=r[p]
s.push([o.a,o.b])}return[n.b,m,s,n.e,n.a]}}
A.iZ.prototype={
$1(a){return B.b.F(B.c.ah(a*128),-2048,2047)+2048},
$S:16}
A.jh.prototype={}
A.e8.prototype={$id9:1,
gan(){return this.a},
gc9(){return this.b},
gca(){return this.e}}
A.e7.prototype={
c_(a){var s,r,q,p,o,n,m,l,k=this
t.dl.a(a)
s=A.A(t.N,t.O)
r=k.c
if(r!=null)s.m(0,"$id",r)
r=k.e
q=new A.bW(k.a,k.d,r)
for(p=a.c,o=a.d;q.b<r;){n=q.B()
m=q.B()
if(!(n<p.length))return A.a(p,n)
l=p[n]
if(!(m<o.length))return A.a(o,m)
s.m(0,l,o[m])}return s},
cj(a){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=h.r,f=new A.bW(h.a,h.f,g),e=h.b===1
if(e)B.a.l(a.c,a.b>>>1)
for(s=!e,r=a.c,q=0,p=0;f.b<g;){o=f.B()
n=o&7
m=o>>>3
if(n===1)for(l=0;l<m;++l){k=f.B()
j=f.B()
i=k>>>1
q+=(k&1)===0?i:-i-1
i=j>>>1
p+=(j&1)===0?i:-i-1
if(s)B.a.l(r,a.b>>>1)
a.bW(q,p)}else if(n===2)for(l=0;l<m;++l){k=f.B()
j=f.B()
i=k>>>1
q+=(k&1)===0?i:-i-1
i=j>>>1
p+=(j&1)===0?i:-i-1
a.bW(q,p)}}B.a.l(r,a.b>>>1)},
$ikn:1,
gH(){return this.b}}
A.fz.prototype={
bW(a,b){var s,r,q=this,p=q.b,o=q.a,n=o.length
if(p+2>n){s=new Float64Array(n*2)
B.m.Z(s,0,p,o)
q.a=s
p=s}else p=o
o=q.b
n=q.b=o+1
p.$flags&2&&A.y(p)
r=p.length
if(!(o<r))return A.a(p,o)
p[o]=a
q.b=n+1
if(!(n<r))return A.a(p,n)
p[n]=b}}
A.bW.prototype={
B(){var s,r,q,p,o,n,m
for(s=this.a,r=s.length,q=0,p=0;p<28;p+=7){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
q=(q|B.b.ab(n&127,p))>>>0
if(n<128)return q}for(m=268435456;;){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
q+=(n&127)*m
if(n<128)return q
m*=128}},
bA(){var s=this,r=s.B(),q=s.b,p=B.u.dz(A.kw(s.a,q,q+r))
s.b+=r
return p},
T(a,b){var s=this
switch(b){case 0:s.B()
break
case 1:s.b+=8
break
case 2:s.b=s.b+s.B()
break
case 5:s.b+=4
break}}}
A.fZ.prototype={
bQ(a){var s,r,q,p,o,n,m,l,k,j=this
if(!t.f.b(a))return
s=a.h(0,"coordinates")
switch(a.h(0,"type")){case"FeatureCollection":r=a.h(0,"features")
if(t.j.b(r))J.nI(r,j.gd2())
break
case"Feature":j.bQ(a.h(0,"geometry"))
break
case"GeometryCollection":q=a.h(0,"geometries")
if(t.j.b(q))J.nI(q,j.gd2())
break
case"Point":B.a.P(j.a,A.jo([s]))
break
case"MultiPoint":B.a.P(j.a,A.jo(s))
break
case"LineString":B.a.l(j.b,A.jo(s))
break
case"MultiLineString":if(t.j.b(s))B.a.P(j.b,J.i5(s,A.ot(),t.H))
break
case"Polygon":if(t.j.b(s)){p=J.i5(s,A.ot(),t.H)
p=A.a7(p,p.$ti.i("Y.E"))
B.a.l(j.c,p)}break
case"MultiPolygon":p=t.j
if(p.b(s))for(o=J.M(s),n=j.c,m=t.H;o.n();){l=o.gq()
if(p.b(l)){k=J.i5(l,A.ot(),m)
k=A.a7(k,k.$ti.i("Y.E"))
B.a.l(n,k)}}break}},
hm(a){var s,r
t.H.a(a)
s=J.t(a)
if(s.gA(a)||this.c.length===0)return!1
for(r=0;r<s.gk(a);r+=2)if(!this.d1(s.h(a,r),s.h(a,r+1)))return!1
return!0},
d1(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
for(s=this.c,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){for(p=B.a.gt(s[q]),o=!1;p.n();){n=p.gq()
for(m=J.t(n),l=m.gk(n)-2,k=0;k<m.gk(n);j=k+2,l=k,k=j){i=m.h(n,k)
h=m.h(n,k+1)
g=m.h(n,l)
f=m.h(n,l+1)
if(h>b!==f>b&&a<(g-i)*(b-h)/(f-h)+i)o=!o}}if(o)return!0}return!1},
h7(a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a={}
t.H.a(a0)
s=J.t(a0)
if(s.gA(a0))return 1/0
r=Math.cos(s.h(a0,1)*3.141592653589793/180)
a.a=1/0
q=new A.jq(a)
for(p=b.c,o=b.b,n=b.a,m=0;m<s.gk(a0);m+=2){l=s.h(a0,m)
k=s.h(a0,m+1)
if(b.d1(l,k))return 0
for(j=0;i=n.length,j<i;j+=2){h=n[j]
g=j+1
if(!(g<i))return A.a(n,g)
f=(l-h)*r
e=k-n[g]
q.$1(Math.sqrt(f*f+e*e))}for(i=o.length,d=0;d<o.length;o.length===i||(0,A.i)(o),++d)q.$1(A.nY(l,k,o[d],r))
for(i=p.length,d=0;d<p.length;p.length===i||(0,A.i)(p),++d)for(h=B.a.gt(p[d]);h.n();)q.$1(A.nY(l,k,h.gq(),r))}if(a1){c=new A.jp(q,a0,r)
c.$1(n)
B.a.W(o,c)
for(s=p.length,d=0;d<p.length;p.length===s||(0,A.i)(p),++d)B.a.W(p[d],c)}return a.a*111319.49079327357}}
A.jq.prototype={
$1(a){var s=this.a
if(a<s.a)s.a=a},
$S:72}
A.jp.prototype={
$1(a){var s,r,q,p,o
t.H.a(a)
for(s=J.t(a),r=this.a,q=this.b,p=this.c,o=0;o<s.gk(a);o+=2)r.$1(A.nY(s.h(a,o),s.h(a,o+1),q,p))},
$S:110}
A.ck.prototype={}
A.j2.prototype={
p(a){return"HTTP "+this.a+" for "+this.b}}
A.ee.prototype={
cr(a,b,c){return new A.jj(t.pp.a(b),a).$0().hS(c)},
bx(a,b){return this.cr(a,b,B.aj)}}
A.jj.prototype={
$0(){var s=0,r=A.au(t.mk),q,p=this,o,n,m,l
var $async$$0=A.av(function(a,b){if(a===1)return A.ar(b,r)
for(;;)switch(s){case 0:m=v.G
l=A.aZ(new m.Headers())
p.a.W(0,new A.ji(l))
s=3
return A.U(A.ou(A.aZ(m.fetch(p.b,{headers:l})),t.m),$async$$0)
case 3:o=b
s=4
return A.U(A.ou(A.aZ(o.arrayBuffer()),t.a),$async$$0)
case 4:n=b
q=new A.ck(A.Q(o.status),A.nW(n,0,null))
s=1
break
case 1:return A.as(q,r)}})
return A.at($async$$0,r)},
$S:74}
A.ji.prototype={
$2(a,b){A.S(a)
A.S(b)
if(!B.cO.u(0,a.toLowerCase()))this.a.append(a,b)},
$S:75}
A.iH.prototype={
hI(a,b){return A.k(A.aK("A browser cannot read the file "+this.a))}}
A.jr.prototype={
gd6(){var s=this.a
return B.d.aB(s,"http://")||B.d.aB(s,"https://")},
ak(a,b,a0){var s=0,r=A.au(t.p),q,p=this,o,n,m,l,k,j,i,h,g,f,e,d,c
var $async$ak=A.av(function(a1,a2){if(a1===1)return A.ar(a2,r)
for(;;)switch(s){case 0:f=p.r
s=3
return A.U(f==null?p.r=p.aD():f,$async$ak)
case 3:e=a2
if(a<e.f||a>e.r){q=new Uint8Array(0)
s=1
break}o=A.tE(a,b,a0)
n=e.a
f=p.w,m=e.b,l=e.d,k=A.o(f).i("ag<1>"),j=0
case 4:if(!(j<4)){s=6
break}i=A.tD(n,o)
if(i==null){q=new Uint8Array(0)
s=1
break}h=i.b
s=h>0?7:8
break
case 7:if(o>=i.a+h){q=new Uint8Array(0)
s=1
break}d=A
s=9
return A.U(p.ar(e.c+i.c,i.d),$async$ak)
case 9:q=d.eh(a2,e.e)
s=1
break
case 8:h=i.c
n=f.h(0,h)
s=n==null?10:11
break
case 10:d=A
c=A
s=13
return A.U(p.ar(m+h,i.d),$async$ak)
case 13:s=12
return A.U(c.eh(a2,l),$async$ak)
case 12:n=d.pl(a2)
f.m(0,h,n)
case 11:if(f.a>48){g=new A.ag(f,k).gt(0)
if(!g.n())A.k(A.aB())
f.bt(0,g.gq())}case 5:++j
s=4
break
case 6:q=new Uint8Array(0)
s=1
break
case 1:return A.as(q,r)}})
return A.at($async$ak,r)},
aD(){var s=0,r=A.au(t.iM),q,p=this,o,n,m,l,k,j,i,h,g,f,e,d
var $async$aD=A.av(function(a,b){if(a===1)return A.ar(b,r)
for(;;)switch(s){case 0:s=3
return A.U(p.ar(0,16384),$async$aD)
case 3:h=b
g=h.length
f=!0
if(g>=127)if(A.jT(B.j.G(h,0,7),0,null)==="PMTiles"){if(7>=g){q=A.a(h,7)
s=1
break}f=h[7]!==3}if(f)throw A.e(B.aw)
f=new A.jt(A.nL(h,0,null))
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
case 5:b=A.kw(h,o,l)
s=6
break
case 7:s=8
return A.U(p.ar(o,n),$async$aD)
case 8:case 6:s=4
return A.U(d.eh(b,m),$async$aD)
case 4:l=e.pl(b)
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
break}q=new A.hL(l,k,f,m,j,i,h[101])
s=1
break
case 1:return A.as(q,r)}})
return A.at($async$aD,r)},
ar(a,b){var s=0,r=A.au(t.p),q,p=this,o,n,m,l,k,j
var $async$ar=A.av(function(c,d){if(c===1)return A.ar(d,r)
for(;;)switch(s){case 0:if(!p.gd6()){o=p.f
q=(o==null?p.f=new A.iH(p.a):o).hI(a,b)
s=1
break}o=p.d
n=p.a
m=t.N
m=A.pe(m,m)
m.P(0,p.c)
l=a+b
m.m(0,"range","bytes="+a+"-"+(l-1))
m.m(0,"accept-encoding","identity")
s=3
return A.U(o.cr(n,m,B.ak),$async$ar)
case 3:k=d
o=k.a
if(o!==206&&o!==200)throw A.e(A.p3(o,n))
j=k.b
q=o===200&&j.length>b?A.kw(j,a,B.b.F(l,0,j.length)):j
s=1
break
case 1:return A.as(q,r)}})
return A.at($async$ar,r)}}
A.jt.prototype={
$1(a){var s=this.a
return s.getUint32(a,!0)+s.getUint32(a+4,!0)*4294967296},
$S:15}
A.js.prototype={
$0(){var s,r,q,p,o,n,m
for(s=this.b,r=this.a,q=s.length,p=0,o=1;;){n=r.a++
if(!(n<q))return A.a(s,n)
m=s[n]
p+=(m&127)*o
if(m<128)return p
o*=128}},
$S:7}
A.hL.prototype={}
A.eE.prototype={
gk(a){return this.d}}
A.kB.prototype={}
A.bU.prototype={}
A.kA.prototype={
$0(){var s,r=this.a,q=J.t(r),p=q.h(r,2)
p.toString
A.Q(p)
s=q.h(r,3)
s.toString
A.Q(s)
r=q.h(r,4)
r.toString
return new A.b5(p,s,A.Q(r))},
$S:76}
A.kz.prototype={
$1(a){var s=J.b0(this.a,a)
s.toString
return A.aa(s)},
$S:23}
A.dG.prototype={}
A.dS.prototype={}
A.bD.prototype={
aq(){return"ClusterQuestion."+this.b}}
A.dD.prototype={}
A.az.prototype={}
A.hn.prototype={}
A.hj.prototype={
b1(){return[this.a,"built",this.c.cn()]}}
A.hm.prototype={
b1(){return[this.a,"failed",this.c]}}
A.dR.prototype={
b1(){var s,r,q,p,o=A.c([],t.E)
for(s=this.b,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q]
o.push([p.a,p.b,p.c,p.d,p.e])}return[this.a,"found",o]}}
A.dK.prototype={
b1(){return[this.a,"zoom",this.b]}}
A.cM.prototype={
b1(){var s,r,q,p,o,n=A.c([],t.bo)
for(s=this.b,r=s.length,q=t.G,p=0;p<s.length;s.length===r||(0,A.i)(s),++p){o=s[p]
n.push(A.c([o.a,o.b,o.c],q))}return[this.a,"members",n]}}
A.fg.prototype={}
A.hl.prototype={}
A.nu.prototype={
$2(a,b){var s=this.a
return s>=a&&s<b},
$S:12}
A.n0.prototype={
$2(a,b){var s=this
return a>=s.a&&a<=s.b&&b>=s.c&&b<=s.d},
$S:12}
A.mZ.prototype={
$8(a,b,c,d,e,f,g,h){var s=new A.n_(),r=s.$6(e,f,g,h,a,b),q=s.$6(e,f,g,h,c,d),p=s.$6(a,b,c,d,e,f),o=s.$6(a,b,c,d,g,h)
return r>0!==q>0&&p>0!==o>0},
$S:78}
A.n_.prototype={
$6(a,b,c,d,e,f){return(c-a)*(f-b)-(d-b)*(e-a)},
$S:79}
A.bl.prototype={}
A.fC.prototype={}
A.ho.prototype={}
A.fY.prototype={}
A.fB.prototype={}
A.hi.prototype={}
A.ko.prototype={}
A.l2.prototype={
gb2(){var s,r=this.d.h(0,A.w(this.b)+"-translate")
A:{if(r==null){s=null
break A}s=A.q(r)
break A}return s}}
A.eX.prototype={}
A.hc.prototype={
eO(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=A.A(t.S,t.nY)
for(s=A.p4(this.x,0,t.kY),r=J.M(s.a),q=s.b,s=new A.bh(r,q,A.o(s).i("bh<1>")),p=this.Q,o=this.r;s.n();){n=s.c
n=n>=0?new A.G(q+n,r.gq()):A.k(A.aB())
m=n.b
if(!(m instanceof A.bF)||m.cy)continue
l=m.b
k=o.length
if(!(l>=0&&l<k))return A.a(o,l)
j=o[l]
for(l=p.length,i=m.d,h=j.b,g=j.c,f=0;f<l;++f){e=p[f]
d=e.b
if(!(d>=0&&d<k))return A.a(o,d)
c=o[d]
if(i!==e.d||h!==c.b||g!==c.c)continue
b.m(0,n.a,e)
j.ax=Math.max(j.ax,i+1)
break}}return b},
h1(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0=this,b1=null,b2="attribution",b3=b0.a,b4=b3.a
b3=b3.$ti.i("4?")
s=t.g.a(b3.a(b4.h(0,"layers")))
s=J.M(s==null?B.ce:s)
r=t.eO
q=t.f
p=b0.gec()
o=b0.geg()
n=b0.gea()
m=b0.gee()
l=b0.gel()
k=b0.x
j=b0.CW
while(s.n()){i=s.gq()
if(!q.b(i))continue
h=i.h(0,"id")
h=A.w(h==null?"":h)
g=i.h(0,"type")
f=r.a(i.h(0,"paint"))
if(f==null)f=B.x
e=r.a(i.h(0,"layout"))
if(e==null)e=B.x
d=i.h(0,"minzoom")
if(!(typeof d=="number"))if(typeof d=="string")d=A.T(d)
else if(A.R(d))d=d?1:0
else d=b1
if(d==null)d=0
c=i.h(0,"maxzoom")
if(!(typeof c=="number"))if(typeof c=="string")c=A.T(c)
else if(A.R(c))c=c?1:0
else c=b1
b=new A.l2(h,g,i,f,e,d,c==null?30:c)
if(J.p(e.h(0,"visibility"),"none"))continue
A:{if("symbol"===g){h=l
break A}if("heatmap"===g){h=m
break A}if("circle"===g){h=n
break A}if("line"===g){h=o
break A}if("fill"===g||"fill-extrusion"===g){h=p
break A}h=b1
break A}if(h!=null){a=k.length
a0=b0.fJ(b)
if(a0!=null)h.$1(a0)
a1=f.h(0,A.w(g)+"-layer-opacity")
if(a1!=null){a2=A.q(a1)
for(a3=a;a3<k.length;++a3)j.m(0,a3,a2)}}else{h=J.ak(g)
if(h.D(g,"background"))b0.e9(b)
else if(h.D(g,"raster")||h.D(g,"hillshade"))b0.ek(b)}}a4=b3.a(b4.h(0,"sprite"))
b0.eO()
b0.fI()
b0.fp()
B:{if(typeof a4=="string")break B
a5=b1
a6=b1
a7=!1
s=!1
if(t.j.b(a4)){r=J.t(a4)
a8=r.gk(a4)>=1
if(a8){a5=r.h(a4,0)
a7=q.b(a5)
if(a7){t.d.a(a5)
a6=a5.h(0,"url")
r=a6
if(r==null){t.d.a(a5)
r=a5.K("url")}else r=!0
if(r)s=typeof a6=="string"}}}else a8=!1
if(s){if(a7)s=a6
else{s=a8?a5:J.b0(a4,0)
a6=t.d.a(s).h(0,"url")
s=a6}A.S(s)
break B}break B}b3=A.bx(b3.a(b4.h(0,"glyphs")))
b4=A.bj(t.N)
for(s=b0.d.gaw(),s=s.gt(s);s.n();){a9=s.gq()
if(q.b(a9)&&typeof a9.h(0,b2)=="string")b4.l(0,A.S(a9.h(0,b2)))}A.a7(b4,b4.$ti.c)
return new A.k4(b0.r,k,b0.y,b0.e,b0.c,b3)},
fJ(a){var s,r,q,p=a.c,o=this.fC(p.h(0,"source"))
if(o==null)return null
s=p.h(0,"source-layer")
r=typeof s=="string"
if(!r){q=this.e
if(o>>>0!==o||o>=q.length)return A.a(q,o)
q=!(q[o] instanceof A.bI)}else q=!1
if(q)return null
r=r?s:""
return new A.eX(a,o,r,p.h(0,"filter"))},
fC(a){return this.f.aY(a,new A.k3(this,a))},
e9(a){var s,r,q=a.d,p=q.h(0,"background-color"),o=A.q(p==null?"#000000":p)
p=q.h(0,"background-opacity")
s=A.q(p==null?1:p)
r=q.h(0,"background-pattern")
this.ay=r==null?null:A.i1(r)
this.ch=s
this.ax=new A.jU(o,s)},
ek(a){var s,r,q,p,o,n,m,l,k=this,j=null,i=a.d,h=k.d.h(0,a.c.h(0,"source"))
if(!t.f.b(h))return
if(i.ga_().dj(0,B.a0.gdw(B.a0))){s=i.h(0,"raster-hue-rotate")
A.q(s==null?0:s)
s=i.h(0,"raster-saturation")
A.q(s==null?0:s)
s=i.h(0,"raster-contrast")
A.q(s==null?0:s)
s=i.h(0,"raster-brightness-min")
A.q(s==null?0:s)
s=i.h(0,"raster-brightness-max")
A.q(s==null?1:s)}J.p(i.h(0,"raster-resampling"),"nearest")
s=i.h(0,"raster-opacity")
A.q(s==null?1:s)
r=A.bx(h.h(0,"url"))
A.ox(h.h(0,"tiles"))
A.C(h.h(0,"tileSize"))
s=A.C(h.h(0,"maxzoom"))
if(s!=null)B.c.M(s)
q=a.b
p=h.h(0,"type")
A:{o="raster"===q
s=o
if(s){s="image"===p
n=p
m=!0}else{n=j
m=!1
s=!1}l=j
if(s){B:{if(A.u0(h.h(0,"coordinates"))!=null)s=r!=null
else s=!1
if(s){s=new A.fC()
break B}s=l
break B}break A}if(o){if(m)s=n
else{s=p
n=s
m=!0}s="raster"===s}else s=!1
if(s){A.hk(h)
s=new A.fY()
break A}if("hillshade"===q)s="raster-dem"===(m?n:p)
else s=!1
if(s){A.q(1)
A.hk(h)
J.p(h.h(0,"encoding"),"terrarium")
s=i.h(0,"hillshade-exaggeration")
A.q(s==null?0.5:s)
A.q("#000000")
A.q("#ffffff")
A.py(i.h(0,"hillshade-shadow-color"),"#000000")
A.py(i.h(0,"hillshade-highlight-color"),"#ffffff")
s=i.h(0,"hillshade-accent-color")
if(s!=null)A.q(s)
s=i.h(0,"hillshade-method")
A.w(s==null?"standard":s)
A.pz(i.h(0,"hillshade-illumination-direction"),335)
A.pz(i.h(0,"hillshade-illumination-altitude"),45)
s=new A.fB()
break A}s=l
break A}if(s==null)return
B.a.l(k.as,k.x.length)
B.a.l(k.z,s)},
em(c8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3=null,b4="text-font",b5="text-rotation-alignment",b6="viewport",b7="text-size",b8="icon-size",b9="text-justify",c0="icon-text-fit",c1=c8.a,c2=c1.d,c3=c1.e,c4=c3.h(0,"text-field"),c5=c3.h(0,"icon-image"),c6=c4!=null&&!J.p(c4,""),c7=c5!=null&&!J.p(c5,"")
if(!c6&&!c7)return
s=this.b
if(c6&&s!=null&&B.d.u(B.f.aa(c4,b3),"name")){r=A.c(["coalesce"],t.G)
for(q=s.$ti,p=new A.V(s,s.gk(0),q.i("V<x.E>")),o=t.s,q=q.i("x.E");p.n();){n=p.d
r.push(A.c(["get",n==null?q.a(n):n],o))}c4=r}r=c3.h(0,b4)
m=B.f.aa(r==null?"":r,b3).toLowerCase()
A.pA(c3.h(0,"text-offset"))
l=c3.h(0,"symbol-placement")
if(l==null)l="point"
k=A.C(c3.h(0,"symbol-spacing"))
if(k==null)k=250
j=J.p(c3.h(0,b5),b6)
i=J.p(c3.h(0,"icon-rotation-alignment"),b6)
c3.h(0,"text-anchor")
h=c3.h(0,"text-variable-anchor")
c3.h(0,"icon-anchor")
A.pA(c3.h(0,"icon-offset"))
r=t.N
g=A.bj(r)
for(f=0;f<7;++f)A.hd(c2.h(0,B.c_[f]),g)
A.hd(c3.h(0,b7),g)
A.hd(c3.h(0,b8),g)
q=c6?c4:b3
p=c7?c5:b3
o=c3.h(0,"symbol-sort-key")
n=A.C(c3.h(0,"icon-rotate"))
if(n==null)n=0
e=A.a7(g,g.$ti.c)
B.a.aK(e)
d=A.u4(A.e4(["source",c8.b,"sourceLayer",c8.c,"filter",c8.d,"text",q,"icon",p,"placement",l,"spacing",k,"textUpright",j,"iconUpright",i,"minZoom",c1.f,"maxZoom",c1.r,"sortKey",o,"iconRotate",n,"paintKeys",e],r,t.O))
q=c3.h(0,b7)
q=A.q(q==null?16:q)
p=c2.h(0,"text-color")
A.q(p==null?"#000000":p)
p=c2.h(0,"text-opacity")
A.q(p==null?1:p)
A.q(c2.h(0,"text-halo-color"))
p=c2.h(0,"text-halo-width")
A.q(p==null?0:p)
p=A.u3(m)
if(!B.d.u(m,"italic"))B.d.u(m,"oblique")
o=A.u2(c3.h(0,b4))
n=J.p(c3.h(0,"text-transform"),"uppercase")
e=A.C(c3.h(0,"text-letter-spacing"))
if(e==null)e=0
c=A.C(c3.h(0,"text-line-height"))
b=c3.h(0,b9)
A:{if("left"===b){a=B.a2
break A}if("right"===b){a=B.a3
break A}a=B.cQ
break A}J.p(c3.h(0,b9),"auto")
A.C(c3.h(0,"text-padding"))
A.C(c3.h(0,"icon-padding"))
J.p(c3.h(0,"text-ignore-placement"),!0)
a0=c3.h(0,"text-pitch-alignment")
B:{if("map"===a0)break B
if("viewport"===a0)break B
a1=c3.h(0,b5)
C:{if("map"===a1)break C
if("viewport"===a1)break C
if(typeof l=="string")B.d.aB(l,"line")
break C}break B}J.p(c3.h(0,"text-keep-upright"),!1)
J.p(c3.h(0,"icon-ignore-placement"),!0)
a2=c2.h(0,"text-halo-blur")
A.q(a2==null?0:a2)
a2=A.C(c3.h(0,"text-max-width"))
if(a2==null)a2=10
a3=c3.h(0,b8)
A.q(a3==null?1:a3)
a3=c2.h(0,"icon-opacity")
A.q(a3==null?1:a3)
a3=c2.h(0,"icon-color")
A.q(a3==null?"#000000":a3)
A.C(c3.h(0,"text-rotate"))
J.p(c3.h(0,"text-optional"),!0)
J.p(c3.h(0,"icon-optional"),!0)
J.p(c3.h(0,"icon-allow-overlap"),!0)
J.p(c3.h(0,"text-allow-overlap"),!0)
a3=c3.h(0,c0)
J.p(a3==null?"none":a3,"none")
c3.h(0,c0)
D:{break D}a4=c3.h(0,"icon-text-fit-padding")
E:{a3=t.j
a5=b3
a6=!1
a7=!1
if(a3.b(a4)){a8=J.t(a4)
if(a8.gk(a4)===4){a9=a8.h(a4,0)
if(typeof a9=="number"){A.aa(a9)
b0=a8.h(a4,1)
if(typeof b0=="number"){A.aa(b0)
b1=a8.h(a4,2)
a6=typeof b1=="number"
if(a6){A.aa(b1)
a5=a8.h(a4,3)
a7=typeof a5=="number"}}}}}if(a7){A.aa(a6?a5:J.b0(a4,3))
break E}break E}if(a3.b(h)){r=J.oN(h,r)
A.a7(r,r.$ti.i("f.E"))}A.C(c3.h(0,"text-radial-offset"))
r=c2.h(0,"text-translate")
if(r!=null)A.q(r)
J.p(c2.h(0,"text-translate-anchor"),b6)
r=c2.h(0,"icon-halo-color")
if(r!=null)A.q(r)
r=c2.h(0,"icon-halo-width")
if(r!=null)A.q(r)
r=c2.h(0,"icon-translate")
if(r!=null)A.q(r)
r=c2.h(0,"icon-halo-blur")
if(r!=null)A.q(r)
J.p(c2.h(0,"icon-translate-anchor"),b6)
b2=A.C(c3.h(0,"text-max-angle"))
F:{r=b3
if(b2!=null){r=b2*3.141592653589793/180
break F}break F}B.a.l(this.y,new A.hf(c1.a,d,q,p,o,n,e,c,a,a2,r))
r=this.at
a2=B.f.aa(A.c(["s",d.a],t.s),b3)
r.a+=a2},
ef(a){var s,r,q=a.a,p=q.d,o=p.h(0,"heatmap-radius")
A.q(o==null?30:o)
q.gb2()
J.p(p.h(0,A.w(q.b)+"-translate-anchor"),"viewport")
o=this.bF(a,B.n,A.he(p,B.cn))
A.q("#ffffff")
s=p.h(0,"heatmap-opacity")
A.q(s==null?1:s)
s=p.h(0,"heatmap-weight")
s=A.q(s==null?1:s)
r=p.h(0,"heatmap-intensity")
r=A.q(r==null?1:r)
A.t4(p.h(0,"heatmap-color"),r,s)
B.a.l(this.x,new A.cY(q.a,o,q.f,q.r))},
eb(a){var s,r,q=a.a,p=q.d,o=A.he(p,B.bY),n=p.h(0,"circle-radius")
A.q(n==null?5:n)
s=p.h(0,"circle-stroke-width")
q.gb2()
J.p(p.h(0,A.w(q.b)+"-translate-anchor"),"viewport")
n=this.bF(a,B.n,o)
r=p.h(0,"circle-color")
A.q(r==null?"#000000":r)
r=p.h(0,"circle-opacity")
A.q(r==null?1:r)
if(s!=null){r=p.h(0,"circle-stroke-color")
A.q(r==null?"#000000":r)
A.q(s)
r=p.h(0,"circle-stroke-opacity")
A.q(r==null?1:r)}B.a.l(this.x,new A.dJ(q.a,n,q.f,q.r))},
eh(b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=null,d="line-cap",c=b0.a,b=c.d,a=c.e,a0=A.he(b,B.cm),a1=b.h(0,"line-offset"),a2=b.h(0,"line-blur"),a3=A.u1(b.h(0,"line-dasharray")),a4=b.h(0,"line-width"),a5=A.q(a4==null?1:a4),a6=b.h(0,"line-gap-width"),a7=a6==null?e:A.q(a6),a8=a7!=null?new A.jX(a5,a7):a5,a9=b.h(0,"line-pattern")
a4=a3==null
s=a4&&a9==null?b.h(0,"line-gradient"):e
r=a2!=null&&a9==null&&s==null
q=c.gb2()
p=J.p(b.h(0,A.w(c.b)+"-translate-anchor"),"viewport")
o=a4&&a9==null&&J.p(a.h(0,d),"round")
n=!a4||a9!=null||r||s!=null
a4=r&&a4
m=s==null
l=a1==null
k=a.h(0,"line-join")
A:{if("round"===k){j=B.Q
break A}if("bevel"===k){j=B.R
break A}j=B.o
break A}j=this.ew(b0,B.t,a0,o,n,a4,j,!m,!l)
a4=a9==null
if(a4&&m){o=b.h(0,"line-color")
if(o==null)o="#000000"}else o="#ffffff"
o=A.q(o)
n=m?e:A.q(s)
m=b.h(0,"line-opacity")
m=A.q(m==null?1:m)
l=l?e:A.q(a1)
i=r?A.q(a2):e
h=a4?a3:e
g=a.h(0,d)
B:{if("round"===g){f=B.af
break B}if("square"===g){f=B.ag
break B}f=B.N
break B}a4=a4?e:A.i1(a9)
B.a.l(this.x,A.pd(i,j,o,h,f,a7,n,c.a,c.r,c.f,l,m,a4,a0.a!==0,q,p,a8))},
ed(a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=null,b="-translate-anchor",a="viewport",a0=a5.a,a1=a0.d,a2=A.S(a0.b),a3=a2+"-color",a4=a1.h(0,a3)
if(a4==null)a4="#000000"
s=a2+"-opacity"
r=a1.h(0,s)
if(r==null)r=1
q=A.he(a1,A.c([a3,s],t.s))
p=a1.h(0,"fill-pattern")
a3=d.x
s=a0.a
a0.gb2()
J.p(a1.h(0,a2+b),a)
o=d.bF(a5,B.r,q)
n=a0.f
m=a0.r
l=p==null
A.q(l?a4:"#ffffff")
A.q(r)
k=l?c:A.i1(p)
j=a2==="fill-extrusion"
B.a.l(a3,new A.bF(k,j,s,o,n,m))
if(j){i=B.f.aa(["extrusion",a5.b,a5.c,a5.d,a1.h(0,"fill-extrusion-height"),a1.h(0,"fill-extrusion-base"),a4],c)
h=d.w.aY(i,new A.jV(d,a5,a1,a4))
o=d.r
if(!(h>=0&&h<o.length))return A.a(o,h)
g=o[h]
if(n<g.at)g.at=n
if(m>g.ax)g.ax=m
o=d.at
k=B.f.aa(A.c([i,n,m],t.G),c)
o.a+=k
A.q(r)
B.a.l(d.Q,new A.dQ(h,n))}f=a1.h(0,"fill-outline-color")
if(f==null||!l||J.p(a1.h(0,"fill-antialias"),!1))return
e=A.he(a1,B.cq)
o=a0.gb2()
l=J.p(a1.h(0,a2+b),a)
B.a.l(a3,A.pd(c,d.ev(a5,B.t,e,!0),A.q(f),c,B.N,c,c,s,m,n,c,A.q(r),c,e.a!==0,o,l,new A.jW()))},
bE(a,b,c,d,e,f,g,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i=this,h={}
t.gi.a(c)
h.a=h.b=h.c=null
s=a.a
r=a.b
h.c=r
q=a.c
h.b=q
p=a.d
h.a=p
o=A.a7(c,A.o(c).c)
B.a.aK(o)
n=B.f.aa([b.a,r,q,p,d,e,a2,a1,f,a0,g.a,o],null)
m=i.w.aY(n,new A.k_(h,i,b,d,e,a2,a1,f,a0,g,o))
h=i.r
if(!(m>=0&&m<h.length))return A.a(h,m)
l=h[m]
h=s.f
if(h<l.at)l.at=h
k=s.r
if(k>l.ax)l.ax=k
j=i.at
k=B.f.aa(A.c([n,h,k],t.G),null)
j.a+=k
return m},
bF(a,b,c){return this.bE(a,b,c,!1,!1,!1,B.o,!1,!1,!1)},
ew(a,b,c,d,e,f,g,h,i){return this.bE(a,b,c,d,e,f,g,h,i,!1)},
ev(a,b,c,d){return this.bE(a,b,c,!1,!1,!1,B.o,!1,!1,d)},
fI(){var s,r=this.a,q=r.$ti.i("4?").a(r.a.h(0,"terrain"))
r=t.f
if(!r.b(q))return null
s=this.d.h(0,q.h(0,"source"))
if(!r.b(s)||!J.p(s.h(0,"type"),"raster-dem"))return null
A.q(1)
A.bx(s.h(0,"url"))
A.ox(s.h(0,"tiles"))
A.C(s.h(0,"tileSize"))
r=A.C(s.h(0,"maxzoom"))
if(r!=null)B.c.M(r)
A.hk(s)
J.p(s.h(0,"encoding"),"terrarium")
A.C(q.h(0,"exaggeration"))
return new A.hi()},
fp(){var s,r,q,p,o,n,m,l,k,j=this,i={},h=j.x,g=A.c([],t.in)
i.a=0
s=new A.k2(j,h)
r=new A.k1(i,g,s)
for(q=j.as,p=j.CW,o=0,n=0;n<=h.length;++n){for(;;){m=q.length
if(o<m){if(!(o>=0))return A.a(q,o)
m=q[o]===n}else m=!1
if(!m)break
r.$1(n);++o
B.a.l(g,new A.es())}m=!0
if(n!==h.length)if(n>i.a){if(J.p(s.$1(n),s.$1(i.a))){if(!(n<h.length))return A.a(h,n)
l=h[n].gb6()
k=i.a
if(!(k<h.length))return A.a(h,k)
if(l===h[k].gb6()){l=h.length
if(!(n<l))return A.a(h,n)
if(!(h[n] instanceof A.cY)){k=i.a
if(!(k<l))return A.a(h,k)
if(!(h[k] instanceof A.cY))if(!p.K(n))if(!p.K(i.a)){l=h.length
if(!(n<l))return A.a(h,n)
k=h[n]
if(!(k instanceof A.bF&&k.cy)){m=i.a
if(!(m<l))return A.a(h,m)
m=h[m]
m=m instanceof A.bF&&m.cy}}}}}}else m=!1
if(m)r.$1(n)}return g}}
A.jZ.prototype={
$1(a){return null},
$S:81}
A.jY.prototype={
$1(a){return 1},
$S:20}
A.k3.prototype={
$0(){var s,r,q,p,o,n,m,l,k,j,i,h=null,g="promoteId",f="generateId",e=this.a,d=this.b,c=e.d.h(0,d)
if(!t.f.b(c))return h
s=J.p(c.h(0,"type"),"geojson")
if(!s&&!J.p(c.h(0,"type"),"vector"))return h
A.ox(c.h(0,"tiles"))
r=c.h(0,"data")
q=A.C(c.h(0,"maxzoom"))
p=q==null?h:B.c.M(q)
if(s&&J.p(c.h(0,"cluster"),!0)){q=A.C(c.h(0,"clusterRadius"))
if(q==null)q=h
if(q==null)q=50
o=A.C(c.h(0,"clusterMaxZoom"))
o=o==null?h:B.c.M(o)
if(o==null)o=(p==null?18:p)-1
o=B.b.F(o,0,24)
n=A.C(c.h(0,"clusterMinPoints"))
n=n==null?h:B.c.M(n)
if(n==null)n=2
m=c.h(0,"clusterProperties")
A:{if(t.d.b(m)){l=A.A(t.N,t.O)
for(k=m.gaj(),k=k.gt(k);k.n();){j=k.gq()
l.m(0,A.w(j.a),j.b)}break A}l=B.k
break A}i=new A.it(q,o,n,l)}else i=h
e=e.e
if(s){A.w(d)
d=c.h(0,g)
q=J.p(c.h(0,f),!0)
A.w(typeof r=="string"?r:A.nr(r))
if(i!=null)B.f.aa(i.d,h)
A.w(c.h(0,g))
A.w(c.h(0,f))
d=new A.bI(r,i,q,d)}else{A.w(d)
A.bx(c.h(0,"url"))
d=c.h(0,g)
q=A.hk(c)
A.w(c.h(0,"url"))
A.w(c.h(0,g))
o=A.hk(c).b
if(o!=null)B.a.a7(o,",")
d=new A.ev(q,d)}B.a.l(e,d)
return e.length-1},
$S:82}
A.jU.prototype={
$1(a){var s=A.cl(this.a.$1(a)),r=A.C(this.b.$1(a))
if(r==null)r=1
return s==null?null:new A.a9(s.a,s.b,s.c,s.d*r)},
$S:13}
A.jX.prototype={
$1(a){var s,r=A.C(this.a.$1(a))
if(r==null)r=1
s=A.C(this.b.$1(a))
if(s==null)s=0
return r*2+s},
$S:9}
A.jV.prototype={
$0(){var s=this,r=s.a.r,q=s.b,p=A.on(q.d),o=s.c,n=o.h(0,"fill-extrusion-height")
n=A.q(n==null?0:n)
o=o.h(0,"fill-extrusion-base")
B.a.l(r,new A.c_(new A.iD(n,A.q(o==null?0:o),A.q(s.d)),q.b,q.c,p,B.z,!1,!1,!1,!1,!1,!1,B.o,B.cg))
return r.length-1},
$S:7}
A.jW.prototype={
$1(a){return 1},
$S:20}
A.k_.prototype={
$0(){var s=this,r=s.b.r,q=s.a
B.a.l(r,new A.c_(null,q.c,q.b,A.on(q.a),s.c,s.d,s.e,s.f,s.r,s.w,s.x,s.y,s.z))
return r.length-1},
$S:7}
A.k2.prototype={
$1(a){var s=this.a.r,r=this.b
if(!(a<r.length))return A.a(r,a)
r=r[a].b
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r].b},
$S:15}
A.k1.prototype={
$1(a){var s=this.a,r=s.a
if(a>r){this.c.$1(r)
B.a.l(this.b,new A.es())}s.a=a},
$S:83}
A.k0.prototype={
$1(a){return typeof a=="string"&&A.cl(a)!=null},
$S:22}
A.c0.prototype={
aq(){return"BucketKind."+this.b}}
A.iD.prototype={}
A.dQ.prototype={}
A.c_.prototype={}
A.cS.prototype={
aq(){return"DashCap."+this.b}}
A.b3.prototype={
gb6(){return!1}}
A.fS.prototype={}
A.bF.prototype={}
A.e1.prototype={}
A.dJ.prototype={
gb6(){return!0}}
A.cY.prototype={
gb6(){return!0}}
A.j0.prototype={}
A.k5.prototype={}
A.k6.prototype={
$1(a){t.X.a(a)
return""},
$S:5}
A.hf.prototype={
ghe(){return this.b.d},
hf(a){return this.ghe().$1(a)}}
A.kj.prototype={
hk(a,b,c){var s,r,q,p,o
if(a<this.a)return!1
s=this.b
if(s==null)return!0
r=new A.kl(a)
q=new A.km(a)
if(0>=s.length)return A.a(s,0)
p=r.$1(s[0])
if(typeof p!=="number")return A.ai(p)
o=!1
if(b>=p){if(2>=s.length)return A.a(s,2)
r=r.$1(s[2])
if(typeof r!=="number")return A.ai(r)
if(b<=r){if(3>=s.length)return A.a(s,3)
r=q.$1(s[3])
if(typeof r!=="number")return A.ai(r)
if(c>=r){if(1>=s.length)return A.a(s,1)
r=q.$1(s[1])
if(typeof r!=="number")return A.ai(r)
r=c<=r}else r=o}else r=o}else r=o
return r}}
A.kk.prototype={
$1(a){return typeof a=="number"},
$S:22}
A.kl.prototype={
$1(a){var s=B.b.ad(1,this.a)
return B.b.F(B.c.a6((a+180)/360*s),0,s-1)},
$S:16}
A.km.prototype={
$1(a){var s=B.b.ad(1,this.a)
return B.b.F(B.c.a6(A.oy(a)*s),0,s-1)},
$S:16}
A.dc.prototype={
cc(a){var s,r=this.c
A:{if(typeof r=="string"){s=r
break A}if(t.f.b(r)){s=A.bx(r.h(0,a))
break A}s=null
break A}return s}}
A.bI.prototype={}
A.ev.prototype={}
A.es.prototype={}
A.k4.prototype={}
A.cc.prototype={
aq(){return"LineJoin."+this.b}}
A.e6.prototype={}
A.kG.prototype={
dP(a,b){var s,r,q,p=this,o=p.x
if(o>0&&o+a>16e3)p.cb()
p.dQ(a)
o=p.y
s=o+b
r=p.w
q=r.length
if(s>q){q=Math.max(s,q*2)
q=new Uint16Array(q)
B.Y.Z(q,0,o,r)
p.w=q}},
dQ(a){var s=this,r=s.x,q=(r+a)*2,p=s.f,o=p.length
if(q>o){o=Math.max(q,o*2)
o=new Float32Array(o)
B.l.Z(o,0,r*2,p)
s.f=o
r=o}else r=p
if(s.a&&q>s.r.length){r=Math.max(q,r.length)
r=new Float32Array(r)
B.l.Z(r,0,s.x*2,s.r)
s.r=r}if(s.b&&q>s.d.length){r=Math.max(q,s.f.length)
r=new Float32Array(r)
B.l.Z(r,0,s.x*2,s.d)
s.d=r}if(s.c&&q>s.e.length){r=Math.max(q,s.f.length)
r=new Float32Array(r)
B.l.Z(r,0,s.x*2,s.e)
s.e=r}},
cb(){var s,r,q,p,o,n,m,l=this,k=null,j=l.a
if(j&&(l.x&1)===1){l.dQ(1)
s=l.f
r=l.x
q=r*2
s.$flags&2&&A.y(s)
p=s.length
if(!(q>=0&&q<p))return A.a(s,q)
s[q]=0
o=q+1
if(!(o<p))return A.a(s,o)
s[o]=0
s=l.r
s.$flags&2&&A.y(s)
p=s.length
if(!(q<p))return A.a(s,q)
s[q]=0
if(!(o<p))return A.a(s,o)
s[o]=0
if(l.b){s=l.d
s.$flags&2&&A.y(s)
if(!(q<s.length))return A.a(s,q)
s[q]=0}if(l.c){s=l.e
s.$flags&2&&A.y(s)
p=s.length
if(!(q<p))return A.a(s,q)
s[q]=0
if(!(o<p))return A.a(s,o)
s[o]=0}l.x=r+1}if(l.y>0){s=new Float32Array(A.ad(A.fx(l.f,0,l.x*2)))
j=j?new Float32Array(A.ad(A.fx(l.r,0,l.x*2))):k
r=l.w
q=l.y
n=r.BYTES_PER_ELEMENT
m=A.aq(0,q,B.b.a5(r.byteLength,n))*n
if(B.b.Y(m,2)!==0)A.k(A.aI("The number of bytes to view must be a multiple of 2",k))
r=new Uint16Array(A.ad(J.r0(B.Y.gai(r),r.byteOffset+0*n,B.b.U(m,2))))
q=l.b?new Float32Array(A.ad(A.fx(l.d,0,l.x*2))):k
p=l.c?new Float32Array(A.ad(A.fx(l.e,0,l.x*2))):k
B.a.l(l.z,new A.e6(s,j,r,q,p))}l.y=l.x=0}}
A.iI.prototype={
di(a,b,c,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d
t.L.a(a0)
s=c-b
if(s<3||s>65e3)return
r=A.cV(a,b*2,c*2)
q=A.oZ(r,a0)
p=q.length
if(p===0)return
o=this.a
o.dP(s,p)
n=o.x
m=o.f
l=n*2
for(p=s*2,k=r.length,j=m.$flags|0,i=0;i<p;++i,l=h){h=l+1
if(!(i<k))return A.a(r,i)
g=r[i]
j&2&&A.y(m)
if(!(l>=0&&l<m.length))return A.a(m,l)
m[l]=g}f=o.w
e=o.y
for(p=q.length,k=f.$flags|0,i=0;i<p;++i,e=d){d=e+1
j=q[i]
k&2&&A.y(f)
if(!(e<f.length))return A.a(f,e)
f[e]=n+j}o.x=n+s
o.y=e}}
A.jd.prototype={
f1(a){var s
A:{if(B.o===a){s=-0.5
break A}if(B.R===a){s=0.8
break A}s=0.5
break A}return s},
bl(b6,b7,b8,b9,c0,c1,c2,c3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5=this
if(c1==null)c1=b5.b
s=b8-b7
if(s<2)return
if(s>4000){r=b7+4000-1
s=c2==null
q=0
if(!s)for(p=b7+1,o=b6.length;p<=r;++p){n=p*2
if(!(n>=0&&n<o))return A.a(b6,n)
m=b6[n]
l=n-2
if(!(l>=0&&l<o))return A.a(b6,l)
k=m-b6[l]
l=n+1
if(!(l<o))return A.a(b6,l)
l=b6[l];--n
if(!(n>=0&&n<o))return A.a(b6,n)
j=l-b6[n]
q+=Math.sqrt(k*k+j*j)}b5.bl(b6,b7,r+1,b9,c0,c1,c2,c3)
b5.bl(b6,r,b8,b9,c0,c1,s?null:c2+q*c3,c3)
return}b5.r=c2
b5.w=c3
i=b5.f1(c1)
o=b5.x
if(s*2>o.length)s=b5.x=new Float64Array(s*4)
else s=o
h=b9*b9
for(o=s.$flags|0,n=b6.length,m=s.length,l=b8-1,p=b7,g=0;p<b8;++p){f=p*2
if(!(f>=0&&f<n))return A.a(b6,f)
e=b6[f];++f
if(!(f<n))return A.a(b6,f)
d=b6[f]
if(g>0){f=g*2
c=f-2
if(!(c>=0&&c<m))return A.a(s,c)
k=e-s[c];--f
if(!(f>=0&&f<m))return A.a(s,f)
j=d-s[f]
b=k*k+j*j
if(b!==0)f=b<h&&p!==l
else f=!0
if(f)continue}f=g*2
o&2&&A.y(s)
if(!(f<m))return A.a(s,f)
s[f]=e;++f
if(!(f<m))return A.a(s,f)
s[f]=d;++g}if(g<2)return
b5.a.dP(g*11+14,g*21+30)
if(2>=m)return A.a(s,2)
k=s[2]-s[0]
if(3>=m)return A.a(s,3)
j=s[3]-s[1]
a=Math.sqrt(k*k+j*j)
j/=a
b5.f=0
o=b5.d=-j
k=b5.e=k/a
if(c0)b5.cM(s[0],s[1],o,k,3.141592653589793,1)
a0=b5.a9(s[0],s[1],o,k,0)
a1=b5.a9(s[0],s[1],j,-k,1)
for(o=c1!==B.S,n=g-1,l=c1!==B.Q,a2=a,p=1;p<g;++p,a2=a,j=a4,k=a3){f=p*2
if(!(f<m))return A.a(s,f)
e=s[f]
c=f+1
if(!(c<m))return A.a(s,c)
d=s[c]
b5.f+=a2
if(p===n){s=b5.d=-j
b5.e=k
b5.bR(a0,a1,b5.a9(e,d,s,k,0),b5.a9(e,d,j,-k,1))
if(c0)b5.cM(e,d,s,k,3.141592653589793,-1)
break}c=f+2
if(!(c<m))return A.a(s,c)
a3=s[c]-e
f+=3
if(!(f<m))return A.a(s,f)
a4=s[f]-d
a=Math.sqrt(a3*a3+a4*a4)
a3/=a
a4/=a
a5=k*a3+j*a4
f=1/(1+a5)
a6=Math.min(f,2)
c=-j
a7=c-a4
b5.d=a7*a6
a8=k+a3
b5.e=a8*a6
if(a5>i){a9=a7*f
b0=a8*f
b1=b5.a9(e,d,a9,b0,0)
b2=b5.a9(e,d,-a9,-b0,1)
b5.bR(a0,a1,b1,b2)
a1=b2
a0=b1}else{b5.bR(a0,a1,b5.a9(e,d,c,k,0),b5.a9(e,d,j,-k,1))
if(o){b3=k*a4-j*a3
f=b3>0
b4=f?-1:1
a7=Math.atan2(Math.abs(b3),a5)
f=f?1:-1
b5.cN(e,d,c*b4,k*b4,a7,f,l)}a0=b5.a9(e,d,-a4,a3,0)
a1=b5.a9(e,d,a4,-a3,1)}}},
fW(a,b,c,d,e,f,g){return this.bl(a,b,c,d,e,null,f,g)},
fV(a,b,c,d,e,f){return this.bl(a,b,c,d,e,f,null,0)},
bR(a,b,c,d){var s,r=this.a,q=r.w,p=r.y,o=p+1
q.$flags&2&&A.y(q)
s=q.length
if(!(p<s))return A.a(q,p)
q[p]=a
p=o+1
if(!(o<s))return A.a(q,o)
q[o]=b
o=p+1
if(!(p<s))return A.a(q,p)
q[p]=c
p=o+1
if(!(o<s))return A.a(q,o)
q[o]=b
o=p+1
if(!(p<s))return A.a(q,p)
q[p]=d
if(!(o<s))return A.a(q,o)
q[o]=c
r.y=o+1},
cN(a,b,c,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=a3?1:Math.max(1,B.c.c2(a1/0.6283185307179586)),e=g.fK(a,b,0,0),d=a1/f*a2
for(s=g.c,r=0;r<=f;++r){q=d*r
p=Math.cos(q)
o=Math.sin(q)
n=s?0:0.5
g.a9(a,b,c*p-a0*o,c*o+a0*p,n)}s=g.a
m=s.w
l=s.y
for(n=m.$flags|0,k=e+1,j=e+2,r=0;r<f;++r,l=i){i=l+1
n&2&&A.y(m)
h=m.length
if(!(l<h))return A.a(m,l)
m[l]=e
l=i+1
if(!(i<h))return A.a(m,i)
m[i]=k+r
i=l+1
if(!(l<h))return A.a(m,l)
m[l]=j+r}s.y=l},
cM(a,b,c,d,e,f){return this.cN(a,b,c,d,e,f,!1)},
a9(a,b,c,d,e){var s,r,q,p,o=this,n=o.a,m=n.x,l=m*2,k=n.f
k.$flags&2&&A.y(k)
s=k.length
if(!(l>=0&&l<s))return A.a(k,l)
k[l]=a
r=l+1
if(!(r<s))return A.a(k,r)
k[r]=b
k=n.r
k.$flags&2&&A.y(k)
s=k.length
if(!(l<s))return A.a(k,l)
k[l]=c
if(!(r<s))return A.a(k,r)
k[r]=d
if(n.b){q=o.r
k=n.d
s=o.f
s=q==null?s:(q+s*o.w)*256
k.$flags&2&&A.y(k)
p=k.length
if(!(l<p))return A.a(k,l)
k[l]=s
if(!(r<p))return A.a(k,r)
k[r]=e}if(n.c){k=n.e
s=o.d
k.$flags&2&&A.y(k)
p=k.length
if(!(l<p))return A.a(k,l)
k[l]=s
s=o.e
if(!(r<p))return A.a(k,r)
k[r]=s}n.x=m+1
return m},
fK(a,b,c,d){return this.a9(a,b,c,d,0.5)}}
A.cJ.prototype={}
A.bc.prototype={
sag(a){this.Q=t.h9.a(a)}}
A.cK.prototype={
ht(a,b,c,d){var s,r,q,p,o,n,m=1/B.b.ad(1,a),l=b*m,k=c*m
for(s=this.c,r="r|"+a+"/"+b+"/"+c+"|",q=0;q<s.length;++q){p=s[q]
o=p.f!=null||p.y||p.c.length===0
n=""+p.a
p.z=o?r+n+"|"+q:"p|"+n+"|"+p.c+"|"+B.c.a6((l+p.d/4096*m)*d)+"|"+B.c.a6((k+p.e/4096*m)*d)}},
cn(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=null,d=t.E,c=A.c([],d)
for(s=f.b,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q]
o=p.b
n=[p.a,o.a]
m=o.b
if(m!=null)n.push(m)
else n.push(e)
n.push(o.c)
l=o.d
if(l!=null)n.push(l)
else n.push(e)
n.push(p.c)
k=o.e
if(k!=null)n.push(k)
else n.push(e)
c.push(n)}s=A.c([],d)
for(r=f.c,o=r.length,n=t.g2,q=0;q<r.length;r.length===o||(0,A.i)(r),++q){j=r[q]
i=[j.a,j.b,j.c,j.d,j.e,j.f,j.r,j.w,j.y,j.z,j.x,j.Q]
h=j.as
if(h!=null)i.push(A.c([h.b,h.c,h.d,h.a.length],n))
else i.push(e)
s.push(i)}d=A.c([],d)
for(r=f.d,o=r.length,q=0;q<r.length;r.length===o||(0,A.i)(r),++q){g=r[q]
n=g.a
d.push([g.c,g.d,g.e,g.f,g.r,g.b,n.a,n.b,n.c,n.d])}r=f.eR()
o=f.a
return[c,s,d,r,o==null?e:o.cn()]},
eR(){var s,r,q,p,o,n,m,l
for(s=this.c,r=s.length,q=0,p=0;p<r;++p){o=s[p].as
o=o==null?null:o.a.length
q+=o==null?0:o}if(q===0)return null
n=new Float32Array(q)
for(m=0,p=0;p<s.length;s.length===r||(0,A.i)(s),++p){o=s[p].as
l=o==null?null:o.a
if(l==null)continue
B.l.by(n,m,l)
m+=l.length}return n}}
A.aF.prototype={
shH(a){this.e=t.nE.a(a)}}
A.k8.prototype={
e4(a,b,c,d,e){var s,r,q,p,o,n,m,l,k=this
for(s=k.a,r=s.y,q=k.r,p=k.b,o=t.t,n=0;n<r.length;++n){m=r[n]
if(m.b!==p)continue
m=m.c
l=q.h(0,m)
if(l==null){l=A.c([],o)
q.m(0,m,l)
m=l}else m=l
B.a.l(m,n)}for(s=s.Q,r=k.w,n=0;n<s.length;++n){q=s[n].b
if(q.b!==p)continue
q=q.c
m=r.h(0,q)
if(m==null){m=A.c([],o)
r.m(0,q,m)
q=m}else q=m
B.a.l(q,n)}},
fw(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
t.lL.a(a)
s=this.c
if(s==null)return
for(r=a.length,q=this.a.Q,p=0;p<a.length;a.length===r||(0,A.i)(a),++p){o=a[p]
n=o.a
if(n<0||o.c.length===0)continue
if(!(n>=0&&n<q.length))return A.a(q,n)
m=q[n]
l=o.c
if(m.z)l=l.toUpperCase()
k=A.wJ(l)
j=o.f!=null
n=m.as
if(n==null)n=1.15
i=j?60:m.dy
h=m.at
A:{if(B.a2===h){g=k?1:-1
break A}if(B.a3===h){g=k?-1:1
break A}if(B.cR===h){g=k?1:-1
break A}if(B.cS===h){g=k?-1:1
break A}g=0
break A}o.as=A.qq(s,l,g,m.Q,n,i,j,m.y,m.w)}},
h_(i0,i1,i2,i3,i4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8=this,h9=null
t.mm.a(i0)
s=h8.a
r=s.y
q=t.bQ
p=A.N(r.length,h9,!1,q)
o=t.N
n=t.S
m=A.N(r.length,0,!1,n)
l=A.N(r.length,h9,!1,q)
k=A.c([],t.fw)
j=A.c([],t.e)
i=A.A(n,t.lc)
h=i1>=i2
g=h?0.75:2
f=h?0:2
e=i1+s.ax
h8.e=!1
d=new A.kf(e,h)
c=h8.x
c.a=e
b=new A.kh(p,k,c,A.A(o,t.ct),m,l)
for(q=J.M(i0),n=e+1,a=t.O,a0=s.Q,a1=h8.y,a2=a1.c,a3=t.n,a4=h8.z,a5=h8.Q,a6=h8.b,a7=s.as,a8=h8.w,a9=t.t,b0=h8.r;q.n();){b1=q.gq()
b2=A.c([],a9)
b3=b0.h(0,b1.gan())
if(b3==null)b3=B.p
b4=b3.length
b5=0
for(;b5<b3.length;b3.length===b4||(0,A.i)(b3),++b5){b6=b3[b5]
if(!(b6>=0&&b6<r.length))return A.a(r,b6)
b7=r[b6]
if(d.$2(b7.at,b7.ax))b2.push(b6)}b3=A.c([],a9)
b4=a8.h(0,b1.gan())
if(b4==null)b4=B.p
b7=b4.length
b5=0
for(;b5<b4.length;b4.length===b7||(0,A.i)(b4),++b5){b8=b4[b5]
if(!(b8>=0&&b8<a0.length))return A.a(a0,b8)
b9=a0[b8].b
if(d.$2(b9.z,b9.Q))b3.push(b8)}if(b2.length===0&&b3.length===0)continue
c0=4096/b1.gc9()
b4=a7.length
if(a6<b4){if(!(a6>=0))return A.a(a7,a6)
c1=a7[a6]}else c1=h9
c2=c1==null||c1 instanceof A.bI?h9:c1.cc(b1.gan())
for(b4=b1.gca(),b7=b4.length,b9=c2!=null,b5=0;b5<b4.length;b4.length===b7||(0,A.i)(b4),++b5){c3={}
c4=b4[b5]
c5=c4.c_(b1)
if(b9&&c5.h(0,c2)!=null)c5.m(0,"$id",c5.h(0,c2))
c.sag(c5)
c6=c4.gH()
A:{if(1===c6){c7="Point"
break A}if(2===c6){c7="LineString"
break A}c7="Polygon"
break A}c.c=c7
c3.a=!1
c3.b=c0
c8=new A.kg(c3,h8,c4)
c9=new A.ki(c3,h8,c8)
c.shw(new A.kc(c3,h8,c8,i1,i3,i4))
for(c7=b2.length,d0=c4 instanceof A.df,d1=0;d1<b2.length;b2.length===c7||(0,A.i)(b2),++d1){b6=b2[d1]
if(!(b6>=0&&b6<r.length))return A.a(r,b6)
d2=r[b6]
d3=d2.e
B:{if(B.r===d3||B.z===d3){d4=c4.gH()===3
break B}if(B.n===d3){d4=c4.gH()===1
break B}if(B.t===d3){d4=d2.w?c4.gH()===3:c4.gH()!==1
break B}d4=h9}if(!d4||!d2.d.$1(c))continue
d5=d2.a
if(d5!=null){c9.$0()
d4=d5.a.$1(c)
if(typeof d4=="number")d6=d4
else{if(typeof d4=="string")d4=A.T(d4)
else if(A.R(d4))d4=d4?1:0
else d4=h9
d6=d4}if(d6==null)d6=0
d4=d5.b.$1(c)
if(typeof d4=="number")d7=d4
else{if(typeof d4=="string")d4=A.T(d4)
else if(A.R(d4))d4=d4?1:0
else d4=h9
d7=d4}if(d7==null)d7=0
d8=A.cl(d5.c.$1(c))
if(d8==null)d8=B.cK
B.a.a2(a4)
B.a.a2(a5)
for(d9=0;d9<a2.length-1;){B.a.l(a4,a2[d9]);++d9
if(!(d9<a2.length))return A.a(a2,d9)
B.a.l(a5,a2[d9])}d4=i.h(0,b6)
if(d4==null){d4=new Float64Array(256)
e0=new Float64Array(256)
e1=new Float64Array(256)
e2=new Float64Array(256)
d4=new A.fv(b6,new A.bE(d4),new A.bE(e0),new A.bE(e1),new A.bE(e2),new A.bE(new Float64Array(256)))
i.m(0,b6,d4)}d4.fT(0,a1.a,a4,a5,d6,d7,d8)
continue}e3=b.$2(b6,d2)
if(d3===B.r){c8.$0()
d4=e3.c
if(d4==null)d4=e3.c=new A.iI(A.pG(!1,!1,!1))
h8.ej(d4,c3.b,f)
continue}c9.$0()
if(d3===B.n){e4=e3.e
if(e4==null){e4=A.c([],a3)
e3.shH(e4)}for(e5=0;e5<a1.b;e5+=2){d4=a1.a
e0=d4.length
if(!(e5<e0))return A.a(d4,e5)
e6=d4[e5]
e1=e5+1
if(!(e1<e0))return A.a(d4,e1)
e7=d4[e1]
if(e6<0||e7<0||e6>=4096||e7>=4096)continue
B.a.l(e4,e6)
B.a.l(e4,e7)}continue}e8=e3.d
if(e8==null){d4=new Float64Array(512)
e8=e3.d=new A.jd(A.pG(!0,d2.r,d2.x),d2.Q,d2.y,d4)}for(d4=d2.w,e0=d2.z,e1=d2.f,d9=0;d9<a2.length-1;d9=f0){e9=a2[d9]
f0=d9+1
f1=a2[f0]
if(c4.gH()===2){f2=e0&&d0?c4.a:h9
f3=f2!=null&&f2.length>d9*2+1
e2=a1.a
if(f3){f4=d9*2
if(!(f4<f2.length))return A.a(f2,f4)
f4=f2[f4]}else f4=e0?0:h9
if(f3){f5=d9*2+1
if(!(f5<f2.length))return A.a(f2,f5)
f5=f2[f5]/c0}else f5=0
e8.fW(e2,e9,f1,g,e1,f4,f5)
continue}f6=f1-e9
if(f6<3)continue
e2=h8.as
f4=f6+1
if(e2.length<f4*2)e2=h8.as=new Float64Array(f4*4)
f5=f6*2
B.m.a1(e2,0,f5,a1.a,e9*2)
e2=h8.as
f7=e2.length
if(0>=f7)return A.a(e2,0)
f8=e2[0]
e2.$flags&2&&A.y(e2)
if(!(f5>=0&&f5<f7))return A.a(e2,f5)
e2[f5]=f8;++f5
if(1>=f7)return A.a(e2,1)
f8=e2[1]
if(!(f5<f7))return A.a(e2,f5)
e2[f5]=f8
e8.fV(e2,0,f4,g,!1,d4?B.S:h9)}}for(c7=b3.length,d1=0;d1<b3.length;b3.length===c7||(0,A.i)(b3),++d1){b8=b3[d1]
if(!(b8>=0&&b8<a0.length))return A.a(a0,b8)
f9=a0[b8]
d0=f9.b
if(!d0.d.$1(c))continue
g0=A.S(d0.e.$1(c))
d4=d0.f
g1=d4==null?"":A.S(d4.$1(c))
d4=g0.length===0
if(d4&&g1.length===0)continue
g2=A.w(d0.r.$1(c))
g3=B.d.aB(g2,"line")
d7=(a0.length-1-b8)*4096
g4=A.u6(f9,c)
e0=d0.ax
if(e0.gk(0)===0)g5=h9
else{e1=A.A(o,a)
for(e2=e0.$ti,e0=new A.V(e0,e0.gk(0),e2.i("V<x.E>")),e2=e2.i("x.E");e0.n();){f4=e0.d
if(f4==null)f4=e2.a(f4)
e1.m(0,f4,c.b.h(0,f4))}g5=e1}if(c4.gH()===3){if(g3)continue
c9.$0()
g6=h8.eV()
if(g6==null)continue
d0=new A.bc(b8,d7+g4,g0,g6.a,g6.b,h9,g1,0,!1,!0)
d0.sag(g5)
B.a.l(j,d0)
continue}if(c4.gH()===1){if(g3)continue
c9.$0()
g7=h8.ff(b8,d7+g4,g0,g1)
if(g7!=null){g7.sag(g5)
B.a.l(j,g7)}continue}c9.$0()
g8=Math.max(0,B.c.c2(d0.z-e))
e0=g2==="line-center"
g9=e0?1/0:d0.w*8/B.b.ad(1,g8)
h0=c.a
c.a=n
e1=f9.c.$1(c)
if(typeof e1=="number")h1=e1
else{if(typeof e1=="string")e1=A.T(e1)
else if(A.R(e1))e1=e1?1:0
else e1=h9
h1=e1}if(h1==null)h1=16
c.a=h0
h2=h1*4096/512
if(g3&&!d4&&!d0.x){d0=d0.as==null?50:g4
d4=h8.dc(f9,g0)
e1=f9.x1
if(e1==null)e1=0.7853981633974483
e0=h8.f_(b8,d7+d0,g0,g9,d4*h2,h2,e1,e0)
e1=e0.length
h3=0
for(;h3<e0.length;e0.length===e1||(0,A.i)(e0),++h3){g7=e0[h3]
g7.sag(g5)
B.a.l(j,g7)}continue}if(!g3){h4=a1.a
for(d4=d0.at*3.141592653589793/180,d0=d0.as==null,e0=h4.length,d9=0;d9<a2.length-1;++d9){g6=a2[d9]*2
if(!(g6<e0))return A.a(h4,g6)
e6=h4[g6]
e1=g6+1
if(!(e1<e0))return A.a(h4,e1)
e7=h4[e1]
if(e6<0||e7<0||e6>=4096||e7>=4096)continue
e1=new A.bc(b8,d7+(d0?50:g4),g0,e6,e7,h9,g1,d4,!1,!1)
e1.sag(g5)
B.a.l(j,e1)}continue}h5=d4&&!d0.y
d0=d4?0:h8.dc(f9,g0)*h2
d4=f9.x1
if(d4==null)d4=0.7853981633974483
h8.en(g9,d0,h2,d4,e0,new A.kd(j,b8,d7,f9,g4,g0,g1,h5,g5))}}}h6=A.c([],t.B)
B.a.aA(k,new A.ke())
for(r=k.length,b5=0;b5<k.length;k.length===r||(0,A.i)(k),++b5){e3=k[b5]
e4=e3.e
if(e4!=null&&e4.length!==0){q=new Float32Array(A.ad(e4))
B.a.l(h6,new A.cJ(e3.a,new A.e6(q,h9,new Uint16Array(0),h9,h9),e3.b))}q=e3.c
if(q==null)h7=h9
else{q=q.a
q.cb()
q=q.z
h7=q}if(h7==null){q=e3.d
if(q==null)h7=h9
else{q=q.a
q.cb()
q=q.z
h7=q}}if(h7==null)continue
for(q=h7.length,o=e3.a,n=e3.b,d1=0;d1<h7.length;h7.length===q||(0,A.i)(h7),++d1)B.a.l(h6,new A.cJ(o,h7[d1],n))}h8.fw(j)
r=A.c([],t.dY)
for(q=new A.ce(i,i.r,i.e,i.$ti.i("ce<2>"));q.n();){o=q.d.hg()
if(o!=null)r.push(o)}return new A.cK(h8.f?A.t0(s,h6):h9,h6,j,r)},
en(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j,i,h,g
t.hi.a(f)
for(s=this.y,r=s.c,q=2*c,p=0.6*c,o=0;o<r.length-1;){n=s.a
m=r[o]*2;++o
for(n=A.ql(new Float32Array(A.ad(new Float64Array(n.subarray(m,A.b7(m,r[o]*2,n.length)))))),m=n.length,l=0;l<n.length;n.length===m||(0,A.i)(n),++l){k=n[l]
j=e?A.qk(k,b,p,d):A.qr(k,a,b,q,p,d)
for(i=j.length,h=0;h<j.length;j.length===i||(0,A.i)(j),++h){g=j[h]
f.$3(g.a,g.b,g.c)}}}},
eV(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0=this.y,c1=c0.a
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
a1=Math.max(a1,c0)}a2=new A.ka(c1,k,m)
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
return new A.G(a3,a4)},
fq(a){var s,r,q,p,o=this.y,n=o.a
for(o=o.b,s=n.length,r=n.$flags|0,q=0;q<o;++q){if(!(q<s))return A.a(n,q)
p=n[q]
r&2&&A.y(n)
n[q]=p*a}},
ej(b2,b3,b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6=this,a7={},a8=a6.y,a9=a8.a,b0=a8.b,b1=a6.as
if(b0>b1.length)b0=a6.as=new Float64Array(b0*2)
else b0=b1
s=b4*b4
r=s*4
a7.a=0
a7.b=-1
b1=a6.at
B.a.a2(b1)
q=new A.k9(a7,a6,b2,b0)
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
n&2&&A.y(b0)
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
if(i>=0){b2.di(b0,i,j,b1)
B.a.a2(b1)}a7.b=j}else{i=a7.b
if(i>=0)B.a.l(b1,j-i)
else a7.a=j}}q.$0()},
ff(a,b,c,d){var s,r,q,p=this.y
if(p.b<2)return null
p=p.a
s=p.length
if(0>=s)return A.a(p,0)
r=p[0]
if(1>=s)return A.a(p,1)
q=p[1]
if(r<0||q<0||r>=4096||q>=4096)return null
return new A.bc(a,b,c,r,q,null,d,0,!1,!1)},
dc(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h=a.z?b.toUpperCase():b,g=i.d
if(g!=null){s=g.hb(a.y)
r=A.c([],t.t)
q=A.a7(new A.cm(h),t.mO.i("f.E"))
q=A.wm(q)
p=q.length
o=0
for(;o<q.length;q.length===p||(0,A.i)(q),++o){n=q[o]
if(n>=0)r.push(n)}if(g.hJ(s,A.jT(r,0,null))){for(q=r.length,p=g.r,m=s-512,l=a.Q,k=0,o=0;o<r.length;r.length===q||(0,A.i)(r),++o){n=r[o]
if(!(m>=0&&m<p.length))return A.a(p,m)
j=p[m].h(0,n)
if(j!=null)k+=j.r/24+l}return k}i.e=!0}r=i.ax
q=r.h(0,b)
if(q==null){q=new A.kb(i,b,h,a).$0()
r.m(0,b,q)
r=q}else r=q
return r},
f_(a,b,c,d,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g=A.c([],t.e),f=0.6*a1,e=2*a1
for(s=this.y,r=s.c,q=0;q<r.length-1;){p=r[q]
o=s.a
n=p*2;++q
for(o=A.ql(A.fx(new Float32Array(A.ad(new Float64Array(o.subarray(n,A.b7(n,r[q]*2,o.length))))),0,null)),n=o.length,m=0;m<o.length;o.length===n||(0,A.i)(o),++m){l=o[m]
k=a3?A.qk(l,a0,f,a2):A.qr(l,d,a0,e,f,a2)
j=k.length
i=0
for(;i<k.length;k.length===j||(0,A.i)(k),++i){h=k[i]
B.a.l(g,new A.bc(a,b,c,h.a,h.b,l,"",0,!1,!1))}}}return g}}
A.kf.prototype={
$2(a,b){var s=this.a
if(b>s)s=this.b||a<s+1
else s=!1
return s},
$S:12}
A.kh.prototype={
$2(a,b){var s,r,q,p,o,n,m,l,k,j=this,i=b.as,h=i.length
if(h===0){h=j.a
if(!(a>=0&&a<h.length))return A.a(h,a)
s=h[a]
if(s==null){s=new A.aF(a,null)
B.a.m(h,a,s)
B.a.l(j.b,s)}return s}r=[]
for(q=j.c,p=0;p<i.length;i.length===h||(0,A.i)(i),++p){o=i[p]
r.push(q.b.h(0,o))}n=""+a+"|"+B.a.a7(r,"\x01")
h=j.d
s=h.h(0,n)
if(s!=null)return s
m=B.a.u(i,"$id")?4096:64
q=j.e
if(!(a>=0&&a<q.length))return A.a(q,a)
l=q[a]
if(l>=m){h=j.f
if(!(a<h.length))return A.a(h,a)
h=h[a]
h.toString
return h}B.a.m(q,a,l+1)
q=A.A(t.N,t.O)
for(k=0;k<i.length;++k){if(!(k<r.length))return A.a(r,k)
l=r[k]
if(l!=null)q.m(0,i[k],l)}s=new A.aF(a,q)
B.a.m(j.f,a,s)
h.m(0,n,s)
B.a.l(j.b,s)
return s},
$S:84}
A.kg.prototype={
$0(){var s=this.a
if(s.a)return
s.a=!0
s=this.b.y
s.b=0
B.a.a2(s.c)
this.c.cj(s)},
$S:0}
A.ki.prototype={
$0(){var s,r
this.c.$0()
s=this.a
r=s.b
if(r!==1){this.b.fq(r)
s.b=1}},
$S:0}
A.kc.prototype={
$0(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
f.c.$0()
s=f.a.b/4096
r=B.b.ad(1,f.d)
q=t.n
p=A.c([],q)
for(o=f.b.y,n=f.e,m=f.f,l=0;l<o.b;l+=2){k=o.a
j=k.length
if(!(l<j))return A.a(k,l)
i=k[l]
h=l+1
if(!(h<j))return A.a(k,h)
g=3.141592653589793*(1-2*((m+k[h]*s)/r))
B.a.P(p,A.c([(n+i*s)/r*360-180,Math.atan((Math.exp(g)-Math.exp(-g))/2)*180/3.141592653589793],q))}return p},
$S:85}
A.kd.prototype={
$3(a,b,c){var s=this,r=s.d.b,q=r.as==null?50:s.e,p=s.w
r=r.at*3.141592653589793
r=p?c+r/180:r/180
p=new A.bc(s.b,s.c+q,s.f,a,b,null,s.r,r,p,!0)
p.sag(s.x)
return B.a.l(s.a,p)},
$S:86}
A.ke.prototype={
$2(a,b){var s=t.ct
return s.a(a).a-s.a(b).a},
$S:87}
A.ka.prototype={
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
i=B.c.F(j===0?0:((a-s)*l+(a0-r)*k)/j,0,1)
h=s+l*i-a
g=r+k*i-a0
o=Math.min(o,h*h+g*g)}return p?o:-o},
$S:33}
A.k9.prototype={
$0(){var s=this,r=s.a,q=r.b
if(q>=0)s.c.di(s.d,q,r.a,s.b.at)
r.b=-1
B.a.a2(s.b.at)},
$S:0}
A.kb.prototype={
$0(){var s,r=this,q=r.a.c
if(q==null)return new A.cm(r.b).gk(0)*0.55
s=r.d
s=A.qq(q,r.c,0,s.Q,1.2,1/0,!0,s.y,s.w)
s=s==null?null:s.b
return s==null?new A.cm(r.b).gk(0)*0.55:s},
$S:88}
A.n5.prototype={
$0(){var s=this.a,r=s.a
if(r.length>=4)B.a.l(this.b,new Float32Array(A.ad(r)))
s.a=A.c([],t.n)},
$S:0}
A.n4.prototype={
$1(a){t.lo.a(a)
return this.a<=this.b*2},
$S:89}
A.lm.prototype={
$1(a){var s=this.a,r=a*2
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
$S:23}
A.ln.prototype={
$1(a){var s=this.a,r=a*2+1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
$S:23}
A.ll.prototype={
$4(a,b,c,d){var s=c-a,r=d-b
return Math.sqrt(s*s+r*r)},
$S:90}
A.b5.prototype={
D(a,b){if(b==null)return!1
return b instanceof A.b5&&b.a===this.a&&b.b===this.b&&b.c===this.c},
gO(a){return(this.a*4194304+this.b)*4194304+this.c},
p(a){return""+this.a+"/"+this.b+"/"+this.c}}
A.kp.prototype={
hd(a,b,c){var s,r=this,q=r.w
if(q!=null){s=r.r
s=s==null?null:!s.gd6()
s=s===!0}else s=!0
if(s)return null
return q+"/"+r.c+"/"+a+"/"+b+"/"+c+r.e},
bs(a,b,c){var s=0,r=A.au(t.p),q,p=this,o,n
var $async$bs=A.av(function(d,e){if(d===1)return A.ar(e,r)
for(;;)switch(s){case 0:if(!p.b.hk(a,b,c)){q=new Uint8Array(0)
s=1
break}o=p.hd(a,b,c)
s=3
return A.U(p.bi(a,b,c),$async$bs)
case 3:n=e
if(o!=null&&!B.j.gA(n))A.oz(o,n).b_(new A.kq(),new A.kr(),t.o)
q=n
s=1
break
case 1:return A.as(q,r)}})
return A.at($async$bs,r)},
bi(a,b,c){var s=0,r=A.au(t.p),q,p=this,o,n,m,l,k
var $async$bi=A.av(function(d,e){if(d===1)return A.ar(e,r)
for(;;)switch(s){case 0:k=p.r
if(k!=null){q=k.ak(a,b,c)
s=1
break}o=p.b.c?B.b.ad(1,a)-1-c:c
s=3
return A.U(A.ne(p.d,p.a,a,b,o,p.f),$async$bi)
case 3:n=e
m=n.a
l=n.b
o=l.a
if(o===204||o===404){q=new Uint8Array(0)
s=1
break}if(o!==200)throw A.e(A.p3(o,m))
q=l.b
s=1
break
case 1:return A.as(q,r)}})
return A.at($async$bi,r)}}
A.kq.prototype={
$1(a){},
$S:91}
A.kr.prototype={
$1(a){},
$S:21}
A.bE.prototype={
bV(a,b){var s,r,q,p=this,o=p.b+2
if(o>p.a.length)p.bb(o)
o=p.a
s=p.b
r=p.b=s+1
o.$flags&2&&A.y(o)
q=o.length
if(!(s<q))return A.a(o,s)
o[s]=a
p.b=r+1
if(!(r<q))return A.a(o,r)
o[r]=b},
aE(a,b,c,d){var s,r,q,p=this,o=p.b+4
if(o>p.a.length)p.bb(o)
o=p.a
s=p.b
r=p.b=s+1
o.$flags&2&&A.y(o)
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
bb(a){var s,r=this.a,q=r.length*2
while(q<a)q*=2
s=new Float64Array(q)
B.m.Z(s,0,this.b,r)
this.a=s},
gk(a){return this.b}}
A.j3.prototype={
l(a,b){var s=this,r=s.b,q=s.a,p=q.length
if(r===p){p=new Uint32Array(p*2)
B.F.Z(p,0,r,q)
s.a=p
r=p}else r=q
q=s.b++
r.$flags&2&&A.y(r)
if(!(q<r.length))return A.a(r,q)
r[q]=b},
gk(a){return this.b}}
A.nz.prototype={
$2(a,b){t.a2.a(b)},
$S:92}
A.ny.prototype={
$1(a){return this.a.$1(t.ec.a(a).b1())},
$S:93}
A.nF.prototype={
$1(a){var s=this.a
return A.p_(a,s.f,s.r,s.cc(""))},
$S:94}
A.nA.prototype={
$0(){var s=0,r=A.au(t.my),q,p=2,o=[],n=this,m,l,k,j
var $async$$0=A.av(function(a,b){if(a===1){o.push(b)
s=p}for(;;)switch(s){case 0:k=n.a
if(typeof k!="string"){q=n.b.$1(k)
s=1
break}p=4
s=7
return A.U(n.c.bx(k,n.d.e.c),$async$$0)
case 7:m=b
k=n.b.$1(B.f.h3(B.u.dz(m.b),null))
q=k
s=1
break
p=2
s=6
break
case 4:p=3
j=o.pop()
k=A.p_(null,null,!1,null)
q=k
s=1
break
s=6
break
case 3:s=2
break
case 6:case 1:return A.as(q,r)
case 2:return A.ar(o.at(-1),r)}})
return A.at($async$$0,r)},
$S:95}
A.nB.prototype={
$1(a){var s=0,r=A.au(t.p),q,p=this,o,n,m,l,k,j,i
var $async$$1=A.av(function(b,c){if(b===1)return A.ar(c,r)
for(;;)switch(s){case 0:n=a.a
m=a.b
l=a.c
k=(n*4194304+m)*4194304+l
j=p.b
i=j.bt(0,k)
if(i!=null){j.m(0,k,i)
q=i
s=1
break}s=3
return A.U(p.a.a.bs(n,m,l),$async$$1)
case 3:o=c
j.m(0,k,o)
if(j.a>24)j.bt(0,new A.ag(j,A.o(j).i("ag<1>")).gv(0))
q=o
s=1
break
case 1:return A.as(q,r)}})
return A.at($async$$1,r)},
$S:96}
A.nC.prototype={
$1(a){var s=0,r=A.au(t.mm),q,p=this,o,n
var $async$$1=A.av(function(b,c){if(b===1)return A.ar(c,r)
for(;;)switch(s){case 0:n=p.a.b
s=n!=null?3:4
break
case 3:s=5
return A.U(n,$async$$1)
case 5:q=c.ak(a.a,a.b,a.c)
s=1
break
case 4:s=6
return A.U(p.b.$1(a),$async$$1)
case 6:o=c
if(o.length===0)n=B.V
else{n=A.ts(o).a
n=new A.aU(n,A.o(n).i("aU<2>"))}q=n
s=1
break
case 1:return A.as(q,r)}})
return A.at($async$$1,r)},
$S:97}
A.nD.prototype={
$1(b3){var s=0,r=A.au(t.ec),q,p=2,o=[],n=this,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2
var $async$$1=A.av(function(b4,b5){if(b4===1){o.push(b5)
s=p}for(;;)switch(s){case 0:a7={}
a8=null
a7.a=a7.b=null
a=b3 instanceof A.dG
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
return A.U(n.b.$1(a0),$async$$1)
case 9:l=b5
b=a0.a
a=a0.b
a0=a0.c
a2=Date.now()
a3=m
if(typeof a3!=="number"){q=A.ai(a3)
s=1
break}a4=t.z
A.pB("vmap.tile.fetched",A.e4(["id",""+b+"/"+a+"/"+a0,"ms",""+B.c.U(a2-a3,1000)],a4,a4))
k=Date.now()
a3=n.c
j=new A.nE(a7,n.a,a3,l)
i=J.dA(l)?new A.cK(null,B.U,B.c6,B.c7):j.$0()
s=J.nJ(l)&&a3.e&&n.d!=null?10:11
break
case 10:h=0
b=t.o
a=n.d
case 12:a0=h
if(typeof a0!=="number"){q=a0.dZ()
s=1
break}if(!(a0<300&&a.w.a-a.x.a>0)){s=13
break}s=14
return A.U(A.rL(B.ai,b),$async$$1)
case 14:a0=h
if(typeof a0!=="number"){q=a0.b3()
s=1
break}h=a0+1
s=12
break
case 13:i=j.$0()
case 11:b=a7.b
a=Date.now()
a0=k
if(typeof a0!=="number"){q=A.ai(a0)
s=1
break}A.pB("vmap.tile.built",A.e4(["id",""+b.a+"/"+b.b+"/"+b.c,"ms",""+B.c.U(a-a0,1000)],a4,a4))
a4=a8
a0=i
q=new A.hj(a0,a4)
s=1
break
p=2
s=8
break
case 6:p=5
a9=o.pop()
g=A.b9(a9)
b=a8
a=A.w(g)
q=new A.hm(a,b)
s=1
break
s=8
break
case 5:s=2
break
case 8:case 4:f=null
a=b3 instanceof A.dS
if(a)f=b3
s=a?15:16
break
case 15:p=18
b=f.a
b2=A
s=21
return A.U(n.b.$1(f.b),$async$$1)
case 21:a=b2.wA(b5,n.e,n.f,f.c,f.d,f.e,f.f,f.r)
q=new A.dR(a,b)
s=1
break
p=2
s=20
break
case 18:p=17
b0=o.pop()
b=f.a
q=new A.dR(B.cf,b)
s=1
break
s=20
break
case 17:s=2
break
case 20:case 16:e=null
a=b3 instanceof A.dD
if(a)e=b3
s=a?22:23
break
case 22:d=e.c
p=25
a=n.a.b
s=a==null?28:30
break
case 28:b5=null
s=29
break
case 30:s=31
return A.U(a,$async$$1)
case 31:b5=b5.r
case 29:c=b5
b=null
switch(e.b.a){case 0:a=e.a
a0=c
if(a0==null)a0=null
else{a2=A.Q(d)
a6=a0.f.h(0,a2)
a0=a6==null?null:a6.f+1}b=new A.dK(a0,a)
break
case 1:a=e.a
a0=c
b=new A.cM(A.qb(a0==null?null:a0.ds(d)),a)
break
case 2:a=e.a
a0=c
b=new A.cM(A.qb(a0==null?null:a0.hv(d,e.d,e.e)),a)
break}b=b
q=b
s=1
break
p=2
s=27
break
case 25:p=24
b1=o.pop()
b=e.b===B.M?new A.dK(null,e.a):new A.cM(B.ch,e.a)
q=b
s=1
break
s=27
break
case 24:s=2
break
case 27:case 23:case 1:return A.as(q,r)
case 2:return A.ar(o.at(-1),r)}})
return A.at($async$$1,r)},
$S:98}
A.nE.prototype={
$0(){var s,r=this,q=r.a,p=q.b
p=r.c.h_(r.d,p.a,q.a,p.b,p.c)
q=q.b
s=r.b.b==null?1024:16777216
p.ht(q.a,q.b,q.c,s)
return p},
$S:99}
A.nw.prototype={
$1(a){var s,r,q,p=null,o=A.aZ(a).data,n=o==null?p:A.oc(t.J.a(o))
o=this.a
s=o.a
if(s!=null){o=A.o(s)
o.c.a(n)
r=s.b
if(r>=4)A.k(s.es())
if((r&1)!==0)s.bS(n)
else if((r&3)===0)s.eJ().l(0,new A.cu(n,o.i("cu<1>")))
return p}r=t.cI
q=new A.dd(p,p,p,p,r)
o.a=q
o=this.b
o.postMessage(null)
n.toString
A.i2(n,new A.nv(o),new A.dh(q,r.i("dh<1>")))},
$S:100}
A.nv.prototype={
$1(a){var s=A.c([],t.kG),r=A.oe(a,s)
this.a.postMessage(r,s)},
$S:14};(function aliases(){var s=J.bL.prototype
s.e2=s.p
s=A.x.prototype
s.cA=s.a1})();(function installTearOffs(){var s=hunkHelpers._static_2,r=hunkHelpers._instance_1i,q=hunkHelpers._static_1,p=hunkHelpers._static_0,o=hunkHelpers._instance_2u,n=hunkHelpers._instance_0u,m=hunkHelpers._instance_1u
s(J,"vb","te",101)
r(A.aS.prototype,"gdw","u",24)
r(A.bH.prototype,"gdw","u",24)
q(A,"vQ","ua",18)
q(A,"vR","ub",18)
q(A,"vS","uc",18)
p(A,"qj","vI",0)
s(A,"vT","vw",17)
o(A.F.prototype,"gey","ez",17)
var l
n(l=A.ct.prototype,"gcY","be",0)
n(l,"gcZ","bf",0)
n(l=A.de.prototype,"gcY","be",0)
n(l,"gcZ","bf",0)
m(l=A.cC.prototype,"gf6","f7",14)
o(l,"gfa","fb",17)
n(l,"gf8","f9",0)
q(A,"w_","uZ",34)
q(A,"w6","rM",103)
q(A,"w7","rN",104)
q(A,"wd","rX",105)
s(A,"nf","vs",8)
q(A,"we","t2",106)
o(A.c9.prototype,"gfj","fk",58)
s(A,"qp","vA",28)
s(A,"qo","vz",28)
s(A,"ng","vv",3)
q(A,"w5","bA",108)
m(A.bg.prototype,"geQ","cQ",14)
q(A,"ot","jo",109)
m(A.fZ.prototype,"gd2","bQ",14)
m(l=A.hc.prototype,"gel","em",10)
m(l,"gee","ef",10)
m(l,"gea","eb",10)
m(l,"geg","eh",10)
m(l,"gec","ed",10)
q(A,"wx","wE",6)
q(A,"ww","wD",6)
q(A,"wu","w0",6)
q(A,"wy","wI",6)
q(A,"wr","vO",6)
q(A,"ws","vP",6)
q(A,"wt","vU",6)
q(A,"wv","wn",6)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.n,null)
q(A.n,[A.nR,J.fF,A.ek,J.aO,A.f,A.dI,A.I,A.bC,A.P,A.x,A.jK,A.V,A.e5,A.ex,A.ep,A.dO,A.cs,A.bh,A.al,A.bT,A.b6,A.cP,A.bv,A.bm,A.kt,A.jm,A.dP,A.eN,A.je,A.e3,A.ce,A.cd,A.dZ,A.hS,A.ey,A.er,A.hX,A.lc,A.aV,A.hJ,A.i_,A.l9,A.ht,A.eR,A.ab,A.ks,A.hz,A.aX,A.F,A.hu,A.d8,A.eO,A.hv,A.de,A.eC,A.aY,A.cC,A.eY,A.hR,A.cA,A.eG,A.cO,A.fl,A.l0,A.lg,A.ld,A.b2,A.hC,A.fX,A.eq,A.kH,A.dU,A.a2,A.a0,A.hY,A.d6,A.bo,A.jl,A.bw,A.bP,A.hg,A.jL,A.iu,A.be,A.hF,A.hH,A.hI,A.hG,A.kI,A.fA,A.j1,A.dE,A.i8,A.db,A.d3,A.cW,A.hU,A.hN,A.iA,A.fG,A.bB,A.fo,A.cH,A.bf,A.cX,A.c8,A.fO,A.iX,A.aA,A.eH,A.ez,A.hK,A.c9,A.h5,A.dV,A.an,A.cy,A.bt,A.dl,A.aE,A.ja,A.h9,A.em,A.ax,A.bJ,A.iQ,A.jk,A.h6,A.h7,A.h1,A.h0,A.h8,A.bu,A.jO,A.bb,A.dF,A.l5,A.hM,A.el,A.j,A.am,A.i9,A.it,A.hZ,A.aP,A.ju,A.a9,A.z,A.fa,A.fv,A.bg,A.hE,A.hQ,A.df,A.iS,A.jN,A.bk,A.hT,A.iV,A.iY,A.jh,A.e8,A.e7,A.fz,A.bW,A.fZ,A.ck,A.j2,A.ee,A.iH,A.jr,A.hL,A.eE,A.kB,A.bU,A.az,A.fg,A.hl,A.bl,A.ko,A.l2,A.eX,A.hc,A.iD,A.dQ,A.c_,A.b3,A.j0,A.k5,A.hf,A.kj,A.dc,A.es,A.k4,A.e6,A.kG,A.iI,A.jd,A.cJ,A.bc,A.cK,A.aF,A.k8,A.b5,A.kp,A.bE,A.j3])
q(J.fF,[J.dW,J.dY,J.e_,J.d_,J.d0,J.cZ,J.bK])
q(J.e_,[J.bL,J.m,A.bM,A.eb])
q(J.bL,[J.h_,J.cq,J.bi])
r(J.fH,A.ek)
r(J.j6,J.m)
q(J.cZ,[J.dX,J.fI])
q(A.f,[A.bV,A.u,A.cf,A.cr,A.bn,A.bs,A.ca,A.cx,A.hs,A.hW,A.dm,A.cm])
q(A.bV,[A.c1,A.eZ])
r(A.eD,A.c1)
r(A.eB,A.eZ)
r(A.bd,A.eB)
q(A.I,[A.c2,A.aT,A.hO])
q(A.bC,[A.ff,A.ia,A.fe,A.hh,A.ni,A.nk,A.kD,A.kC,A.lj,A.kS,A.kV,A.jR,A.jf,A.kZ,A.ns,A.nt,A.iL,A.iM,A.j5,A.ig,A.jb,A.lV,A.io,A.jQ,A.iR,A.jM,A.jw,A.jE,A.jD,A.jB,A.jC,A.jF,A.jG,A.jI,A.lr,A.n8,A.n9,A.n6,A.n7,A.lv,A.lw,A.lx,A.ly,A.lz,A.lA,A.lB,A.lC,A.lD,A.lX,A.mS,A.mT,A.lY,A.lZ,A.m_,A.ma,A.ml,A.mw,A.mH,A.mN,A.mO,A.mP,A.mQ,A.m0,A.m1,A.m2,A.m3,A.m4,A.m5,A.m6,A.m7,A.m8,A.m9,A.mb,A.mc,A.md,A.me,A.mf,A.mg,A.mh,A.mi,A.mj,A.mk,A.mm,A.mn,A.mo,A.mp,A.mq,A.mr,A.ms,A.mt,A.mu,A.mv,A.mx,A.my,A.mz,A.mA,A.mB,A.mC,A.mD,A.mE,A.mF,A.mG,A.mI,A.mJ,A.mK,A.mL,A.mM,A.lF,A.lo,A.lI,A.lJ,A.lK,A.lL,A.lM,A.lN,A.lO,A.lP,A.lq,A.iF,A.iG,A.nm,A.iZ,A.jq,A.jp,A.jt,A.kz,A.mZ,A.n_,A.jZ,A.jY,A.jU,A.jX,A.jW,A.k2,A.k1,A.k0,A.k6,A.kk,A.kl,A.km,A.kd,A.n4,A.lm,A.ln,A.ll,A.kq,A.kr,A.ny,A.nF,A.nB,A.nC,A.nD,A.nw,A.nv])
q(A.ff,[A.ib,A.j7,A.nj,A.lk,A.n1,A.kT,A.kW,A.jg,A.l1,A.iB,A.iv,A.iw,A.lt,A.ic,A.id,A.ie,A.jc,A.ix,A.iy,A.iz,A.ii,A.ih,A.ij,A.il,A.ik,A.im,A.ip,A.iq,A.ir,A.jy,A.jz,A.jP,A.kX,A.jv,A.jH,A.lE,A.mR,A.iN,A.iP,A.lp,A.lH,A.ji,A.nu,A.n0,A.kf,A.kh,A.ke,A.ka,A.nz])
q(A.P,[A.d1,A.bq,A.fJ,A.hq,A.h4,A.hD,A.e0,A.f8,A.aN,A.ew,A.hp,A.bR,A.fh])
r(A.da,A.x)
r(A.cN,A.da)
q(A.fe,[A.nq,A.kE,A.kF,A.la,A.iK,A.kJ,A.kO,A.kN,A.kL,A.kK,A.kR,A.kQ,A.kP,A.kU,A.jS,A.l8,A.l7,A.l3,A.l6,A.mX,A.lf,A.le,A.mU,A.lG,A.n3,A.n2,A.is,A.jA,A.lS,A.mY,A.jJ,A.lW,A.iE,A.iO,A.iU,A.iT,A.nn,A.iW,A.jj,A.js,A.kA,A.k3,A.jV,A.k_,A.kg,A.ki,A.kc,A.k9,A.kb,A.n5,A.nA,A.nE])
q(A.u,[A.Y,A.dN,A.ag,A.aU,A.e2,A.eF])
q(A.Y,[A.et,A.ao,A.b4,A.hP])
r(A.c5,A.cf)
r(A.cU,A.bn)
r(A.cT,A.ca)
q(A.b6,[A.di,A.dj])
r(A.G,A.di)
r(A.dk,A.dj)
q(A.cP,[A.aR,A.bG])
q(A.bm,[A.cQ,A.eM])
q(A.cQ,[A.aS,A.bH])
r(A.ef,A.bq)
q(A.hh,[A.ha,A.cI])
r(A.cb,A.aT)
r(A.d4,A.bM)
q(A.eb,[A.e9,A.ah])
q(A.ah,[A.eI,A.eK])
r(A.eJ,A.eI)
r(A.bN,A.eJ)
r(A.eL,A.eK)
r(A.aD,A.eL)
q(A.bN,[A.cg,A.ch])
q(A.aD,[A.fU,A.ea,A.fV,A.cj,A.ec,A.ed,A.bO])
r(A.eS,A.hD)
r(A.eA,A.hz)
r(A.dd,A.eO)
r(A.eQ,A.d8)
r(A.dh,A.eQ)
r(A.ct,A.de)
r(A.cu,A.eC)
r(A.hV,A.eY)
r(A.cz,A.eM)
q(A.cO,[A.ft,A.fK])
r(A.fL,A.e0)
q(A.fl,[A.j9,A.j8,A.ky,A.kx])
r(A.l_,A.l0)
r(A.hr,A.ft)
q(A.aN,[A.ei,A.fD])
q(A.hC,[A.bS,A.eu,A.fW,A.bD,A.c0,A.cS,A.cc])
q(A.bB,[A.hw,A.hx,A.hy])
q(A.bf,[A.hA,A.hB])
q(A.aA,[A.en,A.eg,A.fm,A.fP,A.fQ,A.fR,A.cR,A.cL])
q(A.an,[A.eo,A.fT,A.f7,A.fM,A.fi,A.fj,A.fk,A.fb,A.fc,A.fd,A.h3])
q(A.em,[A.dB,A.fn])
q(A.bU,[A.dG,A.dS,A.dD])
q(A.az,[A.hn,A.dR,A.dK,A.cM])
q(A.hn,[A.hj,A.hm])
q(A.bl,[A.fC,A.ho])
q(A.ho,[A.fY,A.fB,A.hi])
q(A.b3,[A.fS,A.cY])
q(A.fS,[A.bF,A.e1,A.dJ])
q(A.dc,[A.bI,A.ev])
s(A.da,A.bT)
s(A.eZ,A.x)
s(A.eI,A.x)
s(A.eJ,A.al)
s(A.eK,A.x)
s(A.eL,A.al)
s(A.dd,A.hv)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{b:"int",d:"double",aj:"num",v:"String",H:"bool",a0:"Null",l:"List",n:"Object",W:"Map",K:"JSObject"},mangledNames:{},types:["~()","H(z)","n?(z)","H(b,b)","d(d)","v(z)","d(aj)","b()","H(ax,b)","d(z)","~(eX)","d?(z)","H(d,d)","a9?(z)","~(n?)","b(b)","b(d)","~(n,aW)","~(~())","~(@)","b(z)","a0(@)","H(@)","d(b)","H(n?)","@()","l<bf>()","b(ax)","bt(j,b)","a0(n,aW)","a0()","~(n?,n?)","@(v)","d(d,d)","@(@)","bB(b)","~(aP)","a1<~>()","b(d,d)","b(be,be)","a9?()","v(v)","H(v)","d(b,d)","db(b)","d3(b)","@(@,v)","n?(z,n?)","n?(z)(b)","l<n?(z)>()","n?(z)(d(d))","a0(@,aW)","W<v,n?>(z)","~(b,@)","l<d>?(z)","b(n?,b)","a0(~())","l<v>(z)","H(dV,b)","b?(z)","@(z)","d(d,d,d)","cy(b)","~(d,d,d,d)","K?()","~(d,d)","K()","b?(b)","l<b>()","bP()","v(b)","d(d,+(l<d>,d))","~(d)","b(bw,bw)","a1<ck>()","~(v,v)","b5()","cp()","H(d,d,d,d,d,d,d,d)","d(d,d,d,d,d,d)","b(bu,bu)","a0(z)","b?()","~(b)","aF(b,c_)","l<d>()","~(d,d,d)","b(aF,aF)","d()","H(+(d,d,d))","d(d,d,d,d)","a0(~)","~(b,l<bk>)","~(az)","bg(n?)","a1<bg>()","a1<cp>(b5)","a1<f<d9>>(b5)","a1<az>(bU)","cK()","~(K)","b(@,@)","b(+(b,b),+(b,b))","cW(j)","cX(j)","c8(j)","c9(j)","fE()","v(n?)","l<d>(n?)","~(l<d>)"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"2;":(a,b)=>c=>c instanceof A.G&&a.b(c.a)&&b.b(c.b),"3;":(a,b,c)=>d=>d instanceof A.dk&&a.b(d.a)&&b.b(d.b)&&c.b(d.c)}}
A.uB(v.typeUniverse,JSON.parse('{"bi":"bL","h_":"bL","cq":"bL","wU":"bM","dW":{"H":[],"J":[]},"dY":{"a0":[],"J":[]},"e_":{"K":[]},"bL":{"K":[]},"m":{"l":["1"],"u":["1"],"K":[],"f":["1"]},"fH":{"ek":[]},"j6":{"m":["1"],"l":["1"],"u":["1"],"K":[],"f":["1"]},"aO":{"E":["1"]},"cZ":{"d":[],"aj":[],"aQ":["aj"]},"dX":{"d":[],"b":[],"aj":[],"aQ":["aj"],"J":[]},"fI":{"d":[],"aj":[],"aQ":["aj"],"J":[]},"bK":{"v":[],"aQ":["v"],"jn":[],"J":[]},"bV":{"f":["2"]},"dI":{"E":["2"]},"c1":{"bV":["1","2"],"f":["2"],"f.E":"2"},"eD":{"c1":["1","2"],"bV":["1","2"],"u":["2"],"f":["2"],"f.E":"2"},"eB":{"x":["2"],"l":["2"],"bV":["1","2"],"u":["2"],"f":["2"]},"bd":{"eB":["1","2"],"x":["2"],"l":["2"],"bV":["1","2"],"u":["2"],"f":["2"],"x.E":"2","f.E":"2"},"c2":{"I":["3","4"],"W":["3","4"],"I.K":"3","I.V":"4"},"d1":{"P":[]},"cN":{"x":["b"],"bT":["b"],"l":["b"],"u":["b"],"f":["b"],"x.E":"b","bT.E":"b"},"u":{"f":["1"]},"Y":{"u":["1"],"f":["1"]},"et":{"Y":["1"],"u":["1"],"f":["1"],"f.E":"1","Y.E":"1"},"V":{"E":["1"]},"cf":{"f":["2"],"f.E":"2"},"c5":{"cf":["1","2"],"u":["2"],"f":["2"],"f.E":"2"},"e5":{"E":["2"]},"ao":{"Y":["2"],"u":["2"],"f":["2"],"f.E":"2","Y.E":"2"},"cr":{"f":["1"],"f.E":"1"},"ex":{"E":["1"]},"bn":{"f":["1"],"f.E":"1"},"cU":{"bn":["1"],"u":["1"],"f":["1"],"f.E":"1"},"ep":{"E":["1"]},"dN":{"u":["1"],"f":["1"],"f.E":"1"},"dO":{"E":["1"]},"bs":{"f":["1"],"f.E":"1"},"cs":{"E":["1"]},"ca":{"f":["+(b,1)"],"f.E":"+(b,1)"},"cT":{"ca":["1"],"u":["+(b,1)"],"f":["+(b,1)"],"f.E":"+(b,1)"},"bh":{"E":["+(b,1)"]},"da":{"x":["1"],"bT":["1"],"l":["1"],"u":["1"],"f":["1"]},"b4":{"Y":["1"],"u":["1"],"f":["1"],"f.E":"1","Y.E":"1"},"G":{"di":[],"b6":[]},"dk":{"dj":[],"b6":[]},"cP":{"W":["1","2"]},"aR":{"cP":["1","2"],"W":["1","2"]},"cx":{"f":["1"],"f.E":"1"},"bv":{"E":["1"]},"bG":{"cP":["1","2"],"W":["1","2"]},"cQ":{"bm":["1"],"bQ":["1"],"u":["1"],"f":["1"]},"aS":{"cQ":["1"],"bm":["1"],"bQ":["1"],"u":["1"],"f":["1"]},"bH":{"cQ":["1"],"bm":["1"],"bQ":["1"],"u":["1"],"f":["1"]},"ef":{"bq":[],"P":[]},"fJ":{"P":[]},"hq":{"P":[]},"eN":{"aW":[]},"bC":{"c7":[]},"fe":{"c7":[]},"ff":{"c7":[]},"hh":{"c7":[]},"ha":{"c7":[]},"cI":{"c7":[]},"h4":{"P":[]},"aT":{"I":["1","2"],"nT":["1","2"],"W":["1","2"],"I.K":"1","I.V":"2"},"ag":{"u":["1"],"f":["1"],"f.E":"1"},"e3":{"E":["1"]},"aU":{"u":["1"],"f":["1"],"f.E":"1"},"ce":{"E":["1"]},"e2":{"u":["a2<1,2>"],"f":["a2<1,2>"],"f.E":"a2<1,2>"},"cd":{"E":["a2<1,2>"]},"cb":{"aT":["1","2"],"I":["1","2"],"nT":["1","2"],"W":["1","2"],"I.K":"1","I.V":"2"},"di":{"b6":[]},"dj":{"b6":[]},"dZ":{"tL":[],"jn":[]},"hS":{"ej":[],"d2":[]},"hs":{"f":["ej"],"f.E":"ej"},"ey":{"E":["ej"]},"er":{"d2":[]},"hW":{"f":["d2"],"f.E":"d2"},"hX":{"E":["d2"]},"d4":{"bM":[],"K":[],"J":[]},"bO":{"aD":[],"cp":[],"x":["b"],"ah":["b"],"l":["b"],"aC":["b"],"u":["b"],"K":[],"f":["b"],"al":["b"],"J":[],"x.E":"b"},"bM":{"K":[],"J":[]},"eb":{"K":[]},"e9":{"oS":[],"K":[],"J":[]},"ah":{"aC":["1"],"K":[]},"bN":{"x":["d"],"ah":["d"],"l":["d"],"aC":["d"],"u":["d"],"K":[],"f":["d"],"al":["d"]},"aD":{"x":["b"],"ah":["b"],"l":["b"],"aC":["b"],"u":["b"],"K":[],"f":["b"],"al":["b"]},"cg":{"bN":[],"fw":[],"x":["d"],"ah":["d"],"l":["d"],"aC":["d"],"u":["d"],"K":[],"f":["d"],"al":["d"],"J":[],"x.E":"d"},"ch":{"bN":[],"dT":[],"x":["d"],"ah":["d"],"l":["d"],"aC":["d"],"u":["d"],"K":[],"f":["d"],"al":["d"],"J":[],"x.E":"d"},"fU":{"aD":[],"nO":[],"x":["b"],"ah":["b"],"l":["b"],"aC":["b"],"u":["b"],"K":[],"f":["b"],"al":["b"],"J":[],"x.E":"b"},"ea":{"aD":[],"fE":[],"x":["b"],"ah":["b"],"l":["b"],"aC":["b"],"u":["b"],"K":[],"f":["b"],"al":["b"],"J":[],"x.E":"b"},"fV":{"aD":[],"x":["b"],"ah":["b"],"l":["b"],"aC":["b"],"u":["b"],"K":[],"f":["b"],"al":["b"],"J":[],"x.E":"b"},"cj":{"aD":[],"kv":[],"x":["b"],"ah":["b"],"l":["b"],"aC":["b"],"u":["b"],"K":[],"f":["b"],"al":["b"],"J":[],"x.E":"b"},"ec":{"aD":[],"o0":[],"x":["b"],"ah":["b"],"l":["b"],"aC":["b"],"u":["b"],"K":[],"f":["b"],"al":["b"],"J":[],"x.E":"b"},"ed":{"aD":[],"x":["b"],"ah":["b"],"l":["b"],"aC":["b"],"u":["b"],"K":[],"f":["b"],"al":["b"],"J":[],"x.E":"b"},"hD":{"P":[]},"eS":{"bq":[],"P":[]},"eR":{"E":["1"]},"dm":{"f":["1"],"f.E":"1"},"ab":{"P":[]},"eA":{"hz":["1"]},"F":{"a1":["1"]},"eO":{"pQ":["1"],"cv":["1"]},"dd":{"hv":["1"],"eO":["1"],"pQ":["1"],"cv":["1"]},"dh":{"eQ":["1"],"d8":["1"]},"ct":{"de":["1"],"hb":["1"],"cv":["1"]},"de":{"hb":["1"],"cv":["1"]},"eQ":{"d8":["1"]},"cu":{"eC":["1"]},"eY":{"pF":[]},"hV":{"eY":[],"pF":[]},"cz":{"bm":["1"],"bQ":["1"],"u":["1"],"f":["1"]},"cA":{"E":["1"]},"x":{"l":["1"],"u":["1"],"f":["1"]},"I":{"W":["1","2"]},"eF":{"u":["2"],"f":["2"],"f.E":"2"},"eG":{"E":["2"]},"bm":{"bQ":["1"],"u":["1"],"f":["1"]},"eM":{"bm":["1"],"bQ":["1"],"u":["1"],"f":["1"]},"hO":{"I":["v","@"],"W":["v","@"],"I.K":"v","I.V":"@"},"hP":{"Y":["v"],"u":["v"],"f":["v"],"f.E":"v","Y.E":"v"},"ft":{"cO":["v","l<b>"]},"e0":{"P":[]},"fL":{"P":[]},"fK":{"cO":["n?","v"]},"hr":{"cO":["v","l<b>"]},"d":{"aj":[],"aQ":["aj"]},"b2":{"aQ":["b2"]},"b":{"aj":[],"aQ":["aj"]},"l":{"u":["1"],"f":["1"]},"aj":{"aQ":["aj"]},"ej":{"d2":[]},"bQ":{"u":["1"],"f":["1"]},"v":{"aQ":["v"],"jn":[]},"hC":{"c6":[]},"f8":{"P":[]},"bq":{"P":[]},"aN":{"P":[]},"ei":{"P":[]},"fD":{"P":[]},"ew":{"P":[]},"hp":{"P":[]},"bR":{"P":[]},"fh":{"P":[]},"fX":{"P":[]},"eq":{"P":[]},"hY":{"aW":[]},"cm":{"f":["b"],"f.E":"b"},"d6":{"E":["b"]},"bo":{"tY":[]},"bS":{"c6":[]},"hF":{"dg":[]},"hH":{"dg":[]},"hI":{"dg":[]},"hG":{"dg":[]},"hw":{"bB":[]},"hx":{"bB":[]},"hy":{"bB":[]},"hA":{"bf":[]},"hB":{"bf":[]},"c8":{"rV":[]},"en":{"aA":[]},"eg":{"aA":[]},"fm":{"aA":[]},"fP":{"aA":[]},"fQ":{"aA":[]},"fR":{"aA":[]},"cR":{"aA":[]},"cL":{"aA":[]},"eo":{"an":[]},"fT":{"an":[]},"f7":{"an":[]},"fM":{"an":[]},"fi":{"an":[]},"fj":{"an":[]},"fk":{"an":[]},"fb":{"an":[]},"fc":{"an":[]},"fd":{"an":[]},"h3":{"an":[]},"dB":{"em":[]},"fn":{"em":[]},"eu":{"c6":[]},"fW":{"c6":[]},"hQ":{"d9":[]},"df":{"kn":[]},"e8":{"d9":[]},"e7":{"kn":[]},"bD":{"c6":[]},"dG":{"bU":[]},"dS":{"bU":[]},"dD":{"bU":[]},"hn":{"az":[]},"hj":{"az":[]},"hm":{"az":[]},"dR":{"az":[]},"dK":{"az":[]},"cM":{"az":[]},"fC":{"bl":[]},"ho":{"bl":[]},"fY":{"bl":[]},"fB":{"bl":[]},"hi":{"bl":[]},"c0":{"c6":[]},"cS":{"c6":[]},"fS":{"b3":[]},"bF":{"b3":[]},"e1":{"b3":[]},"dJ":{"b3":[]},"cY":{"b3":[]},"bI":{"dc":[]},"ev":{"dc":[]},"cc":{"c6":[]},"t6":{"l":["b"],"u":["b"],"f":["b"]},"cp":{"l":["b"],"u":["b"],"f":["b"]},"u7":{"l":["b"],"u":["b"],"f":["b"]},"nO":{"l":["b"],"u":["b"],"f":["b"]},"kv":{"l":["b"],"u":["b"],"f":["b"]},"fE":{"l":["b"],"u":["b"],"f":["b"]},"o0":{"l":["b"],"u":["b"],"f":["b"]},"fw":{"l":["d"],"u":["d"],"f":["d"]},"dT":{"l":["d"],"u":["d"],"f":["d"]}}'))
A.uA(v.typeUniverse,JSON.parse('{"da":1,"eZ":2,"ah":1,"eC":1,"eM":1,"fl":2}'))
var u={c:"Error handler must accept one Object or one Object and a StackTrace as arguments, and return a value of the returned future's type"}
var t=(function rtii(){var s=A.aw
return{bm:s("@<~>"),u:s("ab"),c5:s("dE"),kb:s("bb"),bb:s("j"),el:s("aP"),j8:s("bD"),aq:s("be"),gS:s("cN"),bP:s("aQ<@>"),R:s("aS<v>"),c:s("bf"),jS:s("b2"),U:s("u<@>"),C:s("P"),X:s("z"),lc:s("fv"),nY:s("dQ"),pk:s("fw"),kI:s("dT"),Z:s("c7"),kH:s("cW"),lP:s("cX"),nD:s("bG<b,l<b>>"),Y:s("bH<b>"),my:s("bg"),h:s("ax"),lr:s("bJ"),eb:s("c8"),b0:s("c9"),mm:s("f<d9>"),id:s("f<d>"),e7:s("f<@>"),fm:s("f<b>"),A:s("m<bb>"),o_:s("m<c_>"),dY:s("m<fa>"),e:s("m<bc>"),B:s("m<cJ>"),i9:s("m<fg>"),r:s("m<aP>"),ig:s("m<be>"),lW:s("m<dQ>"),mr:s("m<fw>"),w:s("m<dT>"),Q:s("m<ax>"),q:s("m<bJ>"),fT:s("m<aA>"),fL:s("m<an>"),kG:s("m<K>"),iQ:s("m<l<dE>>"),ot:s("m<l<l<d>>>"),bo:s("m<l<n>>"),iA:s("m<l<d>>"),D:s("m<l<b>>"),E:s("m<l<n?>>"),iE:s("m<W<b,bk>>"),nb:s("m<W<b,b>>"),bw:s("m<e6>"),ef:s("m<e7>"),aA:s("m<bO>"),G:s("m<n>"),oJ:s("m<bP>"),o9:s("m<b3>"),ez:s("m<bk>"),lE:s("m<h0>"),gX:s("m<h1>"),kv:s("m<bl>"),k_:s("m<+(l<d>,d)>"),fU:s("m<+(d,d)>"),ho:s("m<+(b,b)>"),cm:s("m<+(b,W<v,n?>?)>"),eL:s("m<+(d,d,d)>"),m1:s("m<el>"),kR:s("m<h9>"),s:s("m<v>"),in:s("m<es>"),oW:s("m<hf>"),fB:s("m<kn>"),cb:s("m<hl>"),n5:s("m<d9>"),jA:s("m<dc>"),mE:s("m<eE>"),ha:s("m<hE>"),la:s("m<bu>"),fw:s("m<aF>"),bD:s("m<hM>"),mc:s("m<hN>"),eB:s("m<bw>"),fb:s("m<hU>"),dG:s("m<hZ>"),n:s("m<d>"),b:s("m<@>"),t:s("m<b>"),J:s("m<n?>"),g2:s("m<aj>"),V:s("m<n?(z)>"),T:s("dY"),m:s("K"),et:s("bi"),dX:s("aC<@>"),kV:s("l<bb>"),lL:s("l<bc>"),ke:s("l<cJ>"),kp:s("l<aP>"),lt:s("l<dT>"),kT:s("l<rK>"),n7:s("l<ax>"),gz:s("l<l<aP>>"),a2:s("l<bk>"),bF:s("l<v>"),je:s("l<eE>"),H:s("l<d>"),j:s("l<@>"),L:s("l<b>"),W:s("l<n?>"),eJ:s("fO"),pp:s("W<v,v>"),eM:s("W<v,d>"),f:s("W<@,@>"),mV:s("W<b,b>"),lb:s("W<v,n?>"),d:s("W<n?,n?>"),gQ:s("ao<v,v>"),dl:s("e8"),h7:s("d3"),a:s("d4"),bi:s("cg"),g_:s("ch"),dQ:s("bN"),aj:s("aD"),nZ:s("cj"),hD:s("bO"),P:s("a0"),K:s("n"),kJ:s("bP"),kY:s("b3"),jv:s("bk"),lZ:s("wV"),aK:s("+()"),hT:s("+(l<d>,d)"),l_:s("+(v,ck)"),gn:s("+(b,b)"),fe:s("+(n?,n?)"),lo:s("+(d,d,d)"),lu:s("ej"),mk:s("ck"),bs:s("b4<b>"),mO:s("cm"),nu:s("h5"),gi:s("bQ<v>"),nO:s("bQ<b>"),gp:s("h7"),gc:s("h8"),l:s("aW"),N:s("v"),gL:s("v(v)"),l1:s("hg"),aJ:s("J"),do:s("bq"),hM:s("kv"),p:s("cp"),cx:s("cq"),l0:s("db"),ec:s("az"),cI:s("dd<n?>"),kr:s("bt"),bY:s("bu"),k:s("F<H>"),_:s("F<@>"),hy:s("F<b>"),cU:s("F<~>"),ct:s("aF"),iM:s("hL"),nx:s("cy"),dt:s("bw"),d2:s("eP<n?>"),b6:s("cC<n?>"),y:s("H"),dW:s("H(ax,b)"),iW:s("H(n)"),i:s("d"),f3:s("d(d)"),z:s("@"),mY:s("@()"),v:s("@(n)"),ng:s("@(n,aW)"),S:s("b"),f1:s("bf?"),gK:s("a1<a0>?"),mU:s("K?"),nw:s("l<aP>?"),l7:s("l<aA>?"),x:s("l<bt>?"),d1:s("l<cy>?"),nE:s("l<d>?"),dw:s("l<d>()?"),g:s("l<@>?"),f8:s("l<b>?"),eO:s("W<@,@>?"),h9:s("W<v,n?>?"),O:s("n?"),I:s("n?(z)"),bl:s("v?"),F:s("aX<@,@>?"),bQ:s("aF?"),hJ:s("hK?"),nF:s("hR?"),oa:s("H?"),mA:s("H(ax,b)?"),jX:s("d?"),aV:s("b?"),jh:s("aj?"),jE:s("~()?"),cZ:s("aj"),o:s("~"),M:s("~()"),i6:s("~(n)"),b9:s("~(n,aW)"),jQ:s("~(v,@)"),hi:s("~(d,d,d)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.ay=J.fF.prototype
B.a=J.m.prototype
B.P=J.dW.prototype
B.b=J.dX.prototype
B.c=J.cZ.prototype
B.d=J.bK.prototype
B.az=J.bi.prototype
B.aA=J.e_.prototype
B.cz=A.e9.prototype
B.l=A.cg.prototype
B.m=A.ch.prototype
B.y=A.ea.prototype
B.Y=A.cj.prototype
B.F=A.ec.prototype
B.j=A.bO.prototype
B.Z=J.h_.prototype
B.I=J.cq.prototype
B.r=new A.c0(0,"fill")
B.t=new A.c0(1,"line")
B.n=new A.c0(2,"circle")
B.z=new A.c0(3,"extrusion")
B.J=new A.fn()
B.a4=new A.dO(A.aw("dO<0&>"))
B.K=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.a5=function() {
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
B.aa=function(getTagFallback) {
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
B.a6=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.a9=function(hooks) {
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
B.a8=function(hooks) {
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
B.a7=function(hooks) {
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
B.L=function(hooks) { return hooks; }

B.f=new A.fK()
B.ab=new A.fX()
B.A=new A.jK()
B.u=new A.hr()
B.ac=new A.ky()
B.h=new A.hw()
B.e=new A.hV()
B.v=new A.hY()
B.M=new A.bD(0,"zoom")
B.N=new A.cS(0,"butt")
B.af=new A.cS(1,"round")
B.ag=new A.cS(2,"square")
B.ah=new A.b2(0)
B.ai=new A.b2(1e4)
B.aj=new A.b2(2e7)
B.ak=new A.b2(3e7)
B.O=new A.am("head is shorter than its 54 bytes")
B.al=new A.am("avar segment map overruns the font")
B.am=new A.am("DeltaSetIndexMap entries overrun the font")
B.an=new A.am("delta set rows overrun the font")
B.ao=new A.am("fvar axis array overruns the font")
B.ap=new A.am("cmap is too short to hold a header")
B.aq=new A.am("fvar instance array overruns the font")
B.ar=new A.am("cmap has no subtable in a format this parser supports")
B.as=new A.am("variation region list overruns the font")
B.at=new A.am("too short to hold an SFNT header")
B.au=new A.am("hhea.numberOfHMetrics is 0, leaving every glyph without an advance")
B.av=new A.am("cmap has no usable encoding record")
B.aw=new A.dU("Not a PMTiles version 3 archive",null,null)
B.ax=new A.dU("The PMTiles archive is packed with brotli or zstd; only gzip is read",null,null)
B.aB=new A.j8(null)
B.aC=new A.j9(null)
B.Q=new A.cc(0,"round")
B.R=new A.cc(1,"bevel")
B.o=new A.cc(2,"miter")
B.S=new A.cc(3,"none")
B.aD=s([32],t.t)
B.a_=new A.G(-1,-1)
B.cI=new A.G(1,-1)
B.cH=new A.G(1,1)
B.cJ=new A.G(-1,1)
B.aE=s([B.a_,B.cI,B.cH,B.cJ],t.fU)
B.bX=s([60,824,8814,61,824,8800,62,824,8815,65,768,192,65,769,193,65,770,194,65,771,195,65,772,256,65,774,258,65,775,550,65,776,196,65,777,7842,65,778,197,65,780,461,65,783,512,65,785,514,65,803,7840,65,805,7680,65,808,260,66,775,7682,66,803,7684,66,817,7686,67,769,262,67,770,264,67,775,266,67,780,268,67,807,199,68,775,7690,68,780,270,68,803,7692,68,807,7696,68,813,7698,68,817,7694,69,768,200,69,769,201,69,770,202,69,771,7868,69,772,274,69,774,276,69,775,278,69,776,203,69,777,7866,69,780,282,69,783,516,69,785,518,69,803,7864,69,807,552,69,808,280,69,813,7704,69,816,7706,70,775,7710,71,769,500,71,770,284,71,772,7712,71,774,286,71,775,288,71,780,486,71,807,290,72,770,292,72,775,7714,72,776,7718,72,780,542,72,803,7716,72,807,7720,72,814,7722,73,768,204,73,769,205,73,770,206,73,771,296,73,772,298,73,774,300,73,775,304,73,776,207,73,777,7880,73,780,463,73,783,520,73,785,522,73,803,7882,73,808,302,73,816,7724,74,770,308,75,769,7728,75,780,488,75,803,7730,75,807,310,75,817,7732,76,769,313,76,780,317,76,803,7734,76,807,315,76,813,7740,76,817,7738,77,769,7742,77,775,7744,77,803,7746,78,768,504,78,769,323,78,771,209,78,775,7748,78,780,327,78,803,7750,78,807,325,78,813,7754,78,817,7752,79,768,210,79,769,211,79,770,212,79,771,213,79,772,332,79,774,334,79,775,558,79,776,214,79,777,7886,79,779,336,79,780,465,79,783,524,79,785,526,79,795,416,79,803,7884,79,808,490,80,769,7764,80,775,7766,82,769,340,82,775,7768,82,780,344,82,783,528,82,785,530,82,803,7770,82,807,342,82,817,7774,83,769,346,83,770,348,83,775,7776,83,780,352,83,803,7778,83,806,536,83,807,350,84,775,7786,84,780,356,84,803,7788,84,806,538,84,807,354,84,813,7792,84,817,7790,85,768,217,85,769,218,85,770,219,85,771,360,85,772,362,85,774,364,85,776,220,85,777,7910,85,778,366,85,779,368,85,780,467,85,783,532,85,785,534,85,795,431,85,803,7908,85,804,7794,85,808,370,85,813,7798,85,816,7796,86,771,7804,86,803,7806,87,768,7808,87,769,7810,87,770,372,87,775,7814,87,776,7812,87,803,7816,88,775,7818,88,776,7820,89,768,7922,89,769,221,89,770,374,89,771,7928,89,772,562,89,775,7822,89,776,376,89,777,7926,89,803,7924,90,769,377,90,770,7824,90,775,379,90,780,381,90,803,7826,90,817,7828,97,768,224,97,769,225,97,770,226,97,771,227,97,772,257,97,774,259,97,775,551,97,776,228,97,777,7843,97,778,229,97,780,462,97,783,513,97,785,515,97,803,7841,97,805,7681,97,808,261,98,775,7683,98,803,7685,98,817,7687,99,769,263,99,770,265,99,775,267,99,780,269,99,807,231,100,775,7691,100,780,271,100,803,7693,100,807,7697,100,813,7699,100,817,7695,101,768,232,101,769,233,101,770,234,101,771,7869,101,772,275,101,774,277,101,775,279,101,776,235,101,777,7867,101,780,283,101,783,517,101,785,519,101,803,7865,101,807,553,101,808,281,101,813,7705,101,816,7707,102,775,7711,103,769,501,103,770,285,103,772,7713,103,774,287,103,775,289,103,780,487,103,807,291,104,770,293,104,775,7715,104,776,7719,104,780,543,104,803,7717,104,807,7721,104,814,7723,104,817,7830,105,768,236,105,769,237,105,770,238,105,771,297,105,772,299,105,774,301,105,776,239,105,777,7881,105,780,464,105,783,521,105,785,523,105,803,7883,105,808,303,105,816,7725,106,770,309,106,780,496,107,769,7729,107,780,489,107,803,7731,107,807,311,107,817,7733,108,769,314,108,780,318,108,803,7735,108,807,316,108,813,7741,108,817,7739,109,769,7743,109,775,7745,109,803,7747,110,768,505,110,769,324,110,771,241,110,775,7749,110,780,328,110,803,7751,110,807,326,110,813,7755,110,817,7753,111,768,242,111,769,243,111,770,244,111,771,245,111,772,333,111,774,335,111,775,559,111,776,246,111,777,7887,111,779,337,111,780,466,111,783,525,111,785,527,111,795,417,111,803,7885,111,808,491,112,769,7765,112,775,7767,114,769,341,114,775,7769,114,780,345,114,783,529,114,785,531,114,803,7771,114,807,343,114,817,7775,115,769,347,115,770,349,115,775,7777,115,780,353,115,803,7779,115,806,537,115,807,351,116,775,7787,116,776,7831,116,780,357,116,803,7789,116,806,539,116,807,355,116,813,7793,116,817,7791,117,768,249,117,769,250,117,770,251,117,771,361,117,772,363,117,774,365,117,776,252,117,777,7911,117,778,367,117,779,369,117,780,468,117,783,533,117,785,535,117,795,432,117,803,7909,117,804,7795,117,808,371,117,813,7799,117,816,7797,118,771,7805,118,803,7807,119,768,7809,119,769,7811,119,770,373,119,775,7815,119,776,7813,119,778,7832,119,803,7817,120,775,7819,120,776,7821,121,768,7923,121,769,253,121,770,375,121,771,7929,121,772,563,121,775,7823,121,776,255,121,777,7927,121,778,7833,121,803,7925,122,769,378,122,770,7825,122,775,380,122,780,382,122,803,7827,122,817,7829,168,768,8173,168,769,901,168,834,8129,194,768,7846,194,769,7844,194,771,7850,194,777,7848,196,772,478,197,769,506,198,769,508,198,772,482,199,769,7688,202,768,7872,202,769,7870,202,771,7876,202,777,7874,207,769,7726,212,768,7890,212,769,7888,212,771,7894,212,777,7892,213,769,7756,213,772,556,213,776,7758,214,772,554,216,769,510,220,768,475,220,769,471,220,772,469,220,780,473,226,768,7847,226,769,7845,226,771,7851,226,777,7849,228,772,479,229,769,507,230,769,509,230,772,483,231,769,7689,234,768,7873,234,769,7871,234,771,7877,234,777,7875,239,769,7727,244,768,7891,244,769,7889,244,771,7895,244,777,7893,245,769,7757,245,772,557,245,776,7759,246,772,555,248,769,511,252,768,476,252,769,472,252,772,470,252,780,474,258,768,7856,258,769,7854,258,771,7860,258,777,7858,259,768,7857,259,769,7855,259,771,7861,259,777,7859,274,768,7700,274,769,7702,275,768,7701,275,769,7703,332,768,7760,332,769,7762,333,768,7761,333,769,7763,346,775,7780,347,775,7781,352,775,7782,353,775,7783,360,769,7800,361,769,7801,362,776,7802,363,776,7803,383,775,7835,416,768,7900,416,769,7898,416,771,7904,416,777,7902,416,803,7906,417,768,7901,417,769,7899,417,771,7905,417,777,7903,417,803,7907,431,768,7914,431,769,7912,431,771,7918,431,777,7916,431,803,7920,432,768,7915,432,769,7913,432,771,7919,432,777,7917,432,803,7921,439,780,494,490,772,492,491,772,493,550,772,480,551,772,481,552,774,7708,553,774,7709,558,772,560,559,772,561,658,780,495,913,768,8122,913,769,902,913,772,8121,913,774,8120,913,787,7944,913,788,7945,913,837,8124,917,768,8136,917,769,904,917,787,7960,917,788,7961,919,768,8138,919,769,905,919,787,7976,919,788,7977,919,837,8140,921,768,8154,921,769,906,921,772,8153,921,774,8152,921,776,938,921,787,7992,921,788,7993,927,768,8184,927,769,908,927,787,8008,927,788,8009,929,788,8172,933,768,8170,933,769,910,933,772,8169,933,774,8168,933,776,939,933,788,8025,937,768,8186,937,769,911,937,787,8040,937,788,8041,937,837,8188,940,837,8116,942,837,8132,945,768,8048,945,769,940,945,772,8113,945,774,8112,945,787,7936,945,788,7937,945,834,8118,945,837,8115,949,768,8050,949,769,941,949,787,7952,949,788,7953,951,768,8052,951,769,942,951,787,7968,951,788,7969,951,834,8134,951,837,8131,953,768,8054,953,769,943,953,772,8145,953,774,8144,953,776,970,953,787,7984,953,788,7985,953,834,8150,959,768,8056,959,769,972,959,787,8000,959,788,8001,961,787,8164,961,788,8165,965,768,8058,965,769,973,965,772,8161,965,774,8160,965,776,971,965,787,8016,965,788,8017,965,834,8166,969,768,8060,969,769,974,969,787,8032,969,788,8033,969,834,8182,969,837,8179,970,768,8146,970,769,912,970,834,8151,971,768,8162,971,769,944,971,834,8167,974,837,8180,978,769,979,978,776,980,1030,776,1031,1040,774,1232,1040,776,1234,1043,769,1027,1045,768,1024,1045,774,1238,1045,776,1025,1046,774,1217,1046,776,1244,1047,776,1246,1048,768,1037,1048,772,1250,1048,774,1049,1048,776,1252,1050,769,1036,1054,776,1254,1059,772,1262,1059,774,1038,1059,776,1264,1059,779,1266,1063,776,1268,1067,776,1272,1069,776,1260,1072,774,1233,1072,776,1235,1075,769,1107,1077,768,1104,1077,774,1239,1077,776,1105,1078,774,1218,1078,776,1245,1079,776,1247,1080,768,1117,1080,772,1251,1080,774,1081,1080,776,1253,1082,769,1116,1086,776,1255,1091,772,1263,1091,774,1118,1091,776,1265,1091,779,1267,1095,776,1269,1099,776,1273,1101,776,1261,1110,776,1111,1140,783,1142,1141,783,1143,1240,776,1242,1241,776,1243,1256,776,1258,1257,776,1259,1575,1619,1570,1575,1620,1571,1575,1621,1573,1608,1620,1572,1610,1620,1574,1729,1620,1730,1746,1620,1747,1749,1620,1728,2344,2364,2345,2352,2364,2353,2355,2364,2356,2503,2494,2507,2503,2519,2508,2887,2878,2891,2887,2902,2888,2887,2903,2892,2962,3031,2964,3014,3006,3018,3014,3031,3020,3015,3006,3019,3142,3158,3144,3263,3285,3264,3270,3266,3274,3270,3285,3271,3270,3286,3272,3274,3285,3275,3398,3390,3402,3398,3415,3404,3399,3390,3403,3545,3530,3546,3545,3535,3548,3545,3551,3550,3548,3530,3549,4133,4142,4134,6917,6965,6918,6919,6965,6920,6921,6965,6922,6923,6965,6924,6925,6965,6926,6929,6965,6930,6970,6965,6971,6972,6965,6973,6974,6965,6976,6975,6965,6977,6978,6965,6979,7734,772,7736,7735,772,7737,7770,772,7772,7771,772,7773,7778,775,7784,7779,775,7785,7840,770,7852,7840,774,7862,7841,770,7853,7841,774,7863,7864,770,7878,7865,770,7879,7884,770,7896,7885,770,7897,7936,768,7938,7936,769,7940,7936,834,7942,7936,837,8064,7937,768,7939,7937,769,7941,7937,834,7943,7937,837,8065,7938,837,8066,7939,837,8067,7940,837,8068,7941,837,8069,7942,837,8070,7943,837,8071,7944,768,7946,7944,769,7948,7944,834,7950,7944,837,8072,7945,768,7947,7945,769,7949,7945,834,7951,7945,837,8073,7946,837,8074,7947,837,8075,7948,837,8076,7949,837,8077,7950,837,8078,7951,837,8079,7952,768,7954,7952,769,7956,7953,768,7955,7953,769,7957,7960,768,7962,7960,769,7964,7961,768,7963,7961,769,7965,7968,768,7970,7968,769,7972,7968,834,7974,7968,837,8080,7969,768,7971,7969,769,7973,7969,834,7975,7969,837,8081,7970,837,8082,7971,837,8083,7972,837,8084,7973,837,8085,7974,837,8086,7975,837,8087,7976,768,7978,7976,769,7980,7976,834,7982,7976,837,8088,7977,768,7979,7977,769,7981,7977,834,7983,7977,837,8089,7978,837,8090,7979,837,8091,7980,837,8092,7981,837,8093,7982,837,8094,7983,837,8095,7984,768,7986,7984,769,7988,7984,834,7990,7985,768,7987,7985,769,7989,7985,834,7991,7992,768,7994,7992,769,7996,7992,834,7998,7993,768,7995,7993,769,7997,7993,834,7999,8000,768,8002,8000,769,8004,8001,768,8003,8001,769,8005,8008,768,8010,8008,769,8012,8009,768,8011,8009,769,8013,8016,768,8018,8016,769,8020,8016,834,8022,8017,768,8019,8017,769,8021,8017,834,8023,8025,768,8027,8025,769,8029,8025,834,8031,8032,768,8034,8032,769,8036,8032,834,8038,8032,837,8096,8033,768,8035,8033,769,8037,8033,834,8039,8033,837,8097,8034,837,8098,8035,837,8099,8036,837,8100,8037,837,8101,8038,837,8102,8039,837,8103,8040,768,8042,8040,769,8044,8040,834,8046,8040,837,8104,8041,768,8043,8041,769,8045,8041,834,8047,8041,837,8105,8042,837,8106,8043,837,8107,8044,837,8108,8045,837,8109,8046,837,8110,8047,837,8111,8048,837,8114,8052,837,8130,8060,837,8178,8118,837,8119,8127,768,8141,8127,769,8142,8127,834,8143,8134,837,8135,8182,837,8183,8190,768,8157,8190,769,8158,8190,834,8159,8592,824,8602,8594,824,8603,8596,824,8622,8656,824,8653,8658,824,8655,8660,824,8654,8707,824,8708,8712,824,8713,8715,824,8716,8739,824,8740,8741,824,8742,8764,824,8769,8771,824,8772,8773,824,8775,8776,824,8777,8781,824,8813,8801,824,8802,8804,824,8816,8805,824,8817,8818,824,8820,8819,824,8821,8822,824,8824,8823,824,8825,8826,824,8832,8827,824,8833,8828,824,8928,8829,824,8929,8834,824,8836,8835,824,8837,8838,824,8840,8839,824,8841,8849,824,8930,8850,824,8931,8866,824,8876,8872,824,8877,8873,824,8878,8875,824,8879,8882,824,8938,8883,824,8939,8884,824,8940,8885,824,8941,12358,12441,12436,12363,12441,12364,12365,12441,12366,12367,12441,12368,12369,12441,12370,12371,12441,12372,12373,12441,12374,12375,12441,12376,12377,12441,12378,12379,12441,12380,12381,12441,12382,12383,12441,12384,12385,12441,12386,12388,12441,12389,12390,12441,12391,12392,12441,12393,12399,12441,12400,12399,12442,12401,12402,12441,12403,12402,12442,12404,12405,12441,12406,12405,12442,12407,12408,12441,12409,12408,12442,12410,12411,12441,12412,12411,12442,12413,12445,12441,12446,12454,12441,12532,12459,12441,12460,12461,12441,12462,12463,12441,12464,12465,12441,12466,12467,12441,12468,12469,12441,12470,12471,12441,12472,12473,12441,12474,12475,12441,12476,12477,12441,12478,12479,12441,12480,12481,12441,12482,12484,12441,12485,12486,12441,12487,12488,12441,12489,12495,12441,12496,12495,12442,12497,12498,12441,12499,12498,12442,12500,12501,12441,12502,12501,12442,12503,12504,12441,12505,12504,12442,12506,12507,12441,12508,12507,12442,12509,12527,12441,12535,12528,12441,12536,12529,12441,12537,12530,12441,12538,12541,12441,12542,67026,775,67017,67034,775,67044,69785,69818,69786,69787,69818,69788,69797,69818,69803,69937,69927,69934,69938,69927,69935,70471,70462,70475,70471,70487,70476,70530,70601,70531,70532,70587,70533,70539,70594,70542,70544,70601,70545,70594,70584,70599,70594,70594,70597,70594,70601,70600,70841,70832,70844,70841,70842,70843,70841,70845,70846,71096,71087,71098,71097,71087,71099,71989,71984,71992,90398,90398,90401,90398,90399,90403,90398,90400,90405,90398,90409,90402,90401,90399,90406,90401,90400,90408,90402,90399,90407,90409,90399,90404,93539,93543,93545,93543,93543,93544,93545,93543,93546],t.t)
B.bY=s(["circle-color","circle-opacity","circle-radius","circle-stroke-color","circle-stroke-width","circle-stroke-opacity"],t.s)
B.bZ=s([192,65,768,193,65,769,194,65,770,195,65,771,196,65,776,197,65,778,199,67,807,200,69,768,201,69,769,202,69,770,203,69,776,204,73,768,205,73,769,206,73,770,207,73,776,209,78,771,210,79,768,211,79,769,212,79,770,213,79,771,214,79,776,217,85,768,218,85,769,219,85,770,220,85,776,221,89,769,224,97,768,225,97,769,226,97,770,227,97,771,228,97,776,229,97,778,231,99,807,232,101,768,233,101,769,234,101,770,235,101,776,236,105,768,237,105,769,238,105,770,239,105,776,241,110,771,242,111,768,243,111,769,244,111,770,245,111,771,246,111,776,249,117,768,250,117,769,251,117,770,252,117,776,253,121,769,255,121,776,256,65,772,257,97,772,258,65,774,259,97,774,260,65,808,261,97,808,262,67,769,263,99,769,264,67,770,265,99,770,266,67,775,267,99,775,268,67,780,269,99,780,270,68,780,271,100,780,274,69,772,275,101,772,276,69,774,277,101,774,278,69,775,279,101,775,280,69,808,281,101,808,282,69,780,283,101,780,284,71,770,285,103,770,286,71,774,287,103,774,288,71,775,289,103,775,290,71,807,291,103,807,292,72,770,293,104,770,296,73,771,297,105,771,298,73,772,299,105,772,300,73,774,301,105,774,302,73,808,303,105,808,304,73,775,308,74,770,309,106,770,310,75,807,311,107,807,313,76,769,314,108,769,315,76,807,316,108,807,317,76,780,318,108,780,323,78,769,324,110,769,325,78,807,326,110,807,327,78,780,328,110,780,332,79,772,333,111,772,334,79,774,335,111,774,336,79,779,337,111,779,340,82,769,341,114,769,342,82,807,343,114,807,344,82,780,345,114,780,346,83,769,347,115,769,348,83,770,349,115,770,350,83,807,351,115,807,352,83,780,353,115,780,354,84,807,355,116,807,356,84,780,357,116,780,360,85,771,361,117,771,362,85,772,363,117,772,364,85,774,365,117,774,366,85,778,367,117,778,368,85,779,369,117,779,370,85,808,371,117,808,372,87,770,373,119,770,374,89,770,375,121,770,376,89,776,377,90,769,378,122,769,379,90,775,380,122,775,381,90,780,382,122,780,416,79,795,417,111,795,431,85,795,432,117,795,461,65,780,462,97,780,463,73,780,464,105,780,465,79,780,466,111,780,467,85,780,468,117,780,469,220,772,470,252,772,471,220,769,472,252,769,473,220,780,474,252,780,475,220,768,476,252,768,478,196,772,479,228,772,480,550,772,481,551,772,482,198,772,483,230,772,486,71,780,487,103,780,488,75,780,489,107,780,490,79,808,491,111,808,492,490,772,493,491,772,494,439,780,495,658,780,496,106,780,500,71,769,501,103,769,504,78,768,505,110,768,506,197,769,507,229,769,508,198,769,509,230,769,510,216,769,511,248,769,512,65,783,513,97,783,514,65,785,515,97,785,516,69,783,517,101,783,518,69,785,519,101,785,520,73,783,521,105,783,522,73,785,523,105,785,524,79,783,525,111,783,526,79,785,527,111,785,528,82,783,529,114,783,530,82,785,531,114,785,532,85,783,533,117,783,534,85,785,535,117,785,536,83,806,537,115,806,538,84,806,539,116,806,542,72,780,543,104,780,550,65,775,551,97,775,552,69,807,553,101,807,554,214,772,555,246,772,556,213,772,557,245,772,558,79,775,559,111,775,560,558,772,561,559,772,562,89,772,563,121,772,832,768,-1,833,769,-1,835,787,-1,836,776,769,884,697,-1,894,59,-1,901,168,769,902,913,769,903,183,-1,904,917,769,905,919,769,906,921,769,908,927,769,910,933,769,911,937,769,912,970,769,938,921,776,939,933,776,940,945,769,941,949,769,942,951,769,943,953,769,944,971,769,970,953,776,971,965,776,972,959,769,973,965,769,974,969,769,979,978,769,980,978,776,1024,1045,768,1025,1045,776,1027,1043,769,1031,1030,776,1036,1050,769,1037,1048,768,1038,1059,774,1049,1048,774,1081,1080,774,1104,1077,768,1105,1077,776,1107,1075,769,1111,1110,776,1116,1082,769,1117,1080,768,1118,1091,774,1142,1140,783,1143,1141,783,1217,1046,774,1218,1078,774,1232,1040,774,1233,1072,774,1234,1040,776,1235,1072,776,1238,1045,774,1239,1077,774,1242,1240,776,1243,1241,776,1244,1046,776,1245,1078,776,1246,1047,776,1247,1079,776,1250,1048,772,1251,1080,772,1252,1048,776,1253,1080,776,1254,1054,776,1255,1086,776,1258,1256,776,1259,1257,776,1260,1069,776,1261,1101,776,1262,1059,772,1263,1091,772,1264,1059,776,1265,1091,776,1266,1059,779,1267,1091,779,1268,1063,776,1269,1095,776,1272,1067,776,1273,1099,776,1570,1575,1619,1571,1575,1620,1572,1608,1620,1573,1575,1621,1574,1610,1620,1728,1749,1620,1730,1729,1620,1747,1746,1620,2345,2344,2364,2353,2352,2364,2356,2355,2364,2392,2325,2364,2393,2326,2364,2394,2327,2364,2395,2332,2364,2396,2337,2364,2397,2338,2364,2398,2347,2364,2399,2351,2364,2507,2503,2494,2508,2503,2519,2524,2465,2492,2525,2466,2492,2527,2479,2492,2611,2610,2620,2614,2616,2620,2649,2582,2620,2650,2583,2620,2651,2588,2620,2654,2603,2620,2888,2887,2902,2891,2887,2878,2892,2887,2903,2908,2849,2876,2909,2850,2876,2964,2962,3031,3018,3014,3006,3019,3015,3006,3020,3014,3031,3144,3142,3158,3264,3263,3285,3271,3270,3285,3272,3270,3286,3274,3270,3266,3275,3274,3285,3402,3398,3390,3403,3399,3390,3404,3398,3415,3546,3545,3530,3548,3545,3535,3549,3548,3530,3550,3545,3551,3907,3906,4023,3917,3916,4023,3922,3921,4023,3927,3926,4023,3932,3931,4023,3945,3904,4021,3955,3953,3954,3957,3953,3956,3958,4018,3968,3960,4019,3968,3969,3953,3968,3987,3986,4023,3997,3996,4023,4002,4001,4023,4007,4006,4023,4012,4011,4023,4025,3984,4021,4134,4133,4142,6918,6917,6965,6920,6919,6965,6922,6921,6965,6924,6923,6965,6926,6925,6965,6930,6929,6965,6971,6970,6965,6973,6972,6965,6976,6974,6965,6977,6975,6965,6979,6978,6965,7680,65,805,7681,97,805,7682,66,775,7683,98,775,7684,66,803,7685,98,803,7686,66,817,7687,98,817,7688,199,769,7689,231,769,7690,68,775,7691,100,775,7692,68,803,7693,100,803,7694,68,817,7695,100,817,7696,68,807,7697,100,807,7698,68,813,7699,100,813,7700,274,768,7701,275,768,7702,274,769,7703,275,769,7704,69,813,7705,101,813,7706,69,816,7707,101,816,7708,552,774,7709,553,774,7710,70,775,7711,102,775,7712,71,772,7713,103,772,7714,72,775,7715,104,775,7716,72,803,7717,104,803,7718,72,776,7719,104,776,7720,72,807,7721,104,807,7722,72,814,7723,104,814,7724,73,816,7725,105,816,7726,207,769,7727,239,769,7728,75,769,7729,107,769,7730,75,803,7731,107,803,7732,75,817,7733,107,817,7734,76,803,7735,108,803,7736,7734,772,7737,7735,772,7738,76,817,7739,108,817,7740,76,813,7741,108,813,7742,77,769,7743,109,769,7744,77,775,7745,109,775,7746,77,803,7747,109,803,7748,78,775,7749,110,775,7750,78,803,7751,110,803,7752,78,817,7753,110,817,7754,78,813,7755,110,813,7756,213,769,7757,245,769,7758,213,776,7759,245,776,7760,332,768,7761,333,768,7762,332,769,7763,333,769,7764,80,769,7765,112,769,7766,80,775,7767,112,775,7768,82,775,7769,114,775,7770,82,803,7771,114,803,7772,7770,772,7773,7771,772,7774,82,817,7775,114,817,7776,83,775,7777,115,775,7778,83,803,7779,115,803,7780,346,775,7781,347,775,7782,352,775,7783,353,775,7784,7778,775,7785,7779,775,7786,84,775,7787,116,775,7788,84,803,7789,116,803,7790,84,817,7791,116,817,7792,84,813,7793,116,813,7794,85,804,7795,117,804,7796,85,816,7797,117,816,7798,85,813,7799,117,813,7800,360,769,7801,361,769,7802,362,776,7803,363,776,7804,86,771,7805,118,771,7806,86,803,7807,118,803,7808,87,768,7809,119,768,7810,87,769,7811,119,769,7812,87,776,7813,119,776,7814,87,775,7815,119,775,7816,87,803,7817,119,803,7818,88,775,7819,120,775,7820,88,776,7821,120,776,7822,89,775,7823,121,775,7824,90,770,7825,122,770,7826,90,803,7827,122,803,7828,90,817,7829,122,817,7830,104,817,7831,116,776,7832,119,778,7833,121,778,7835,383,775,7840,65,803,7841,97,803,7842,65,777,7843,97,777,7844,194,769,7845,226,769,7846,194,768,7847,226,768,7848,194,777,7849,226,777,7850,194,771,7851,226,771,7852,7840,770,7853,7841,770,7854,258,769,7855,259,769,7856,258,768,7857,259,768,7858,258,777,7859,259,777,7860,258,771,7861,259,771,7862,7840,774,7863,7841,774,7864,69,803,7865,101,803,7866,69,777,7867,101,777,7868,69,771,7869,101,771,7870,202,769,7871,234,769,7872,202,768,7873,234,768,7874,202,777,7875,234,777,7876,202,771,7877,234,771,7878,7864,770,7879,7865,770,7880,73,777,7881,105,777,7882,73,803,7883,105,803,7884,79,803,7885,111,803,7886,79,777,7887,111,777,7888,212,769,7889,244,769,7890,212,768,7891,244,768,7892,212,777,7893,244,777,7894,212,771,7895,244,771,7896,7884,770,7897,7885,770,7898,416,769,7899,417,769,7900,416,768,7901,417,768,7902,416,777,7903,417,777,7904,416,771,7905,417,771,7906,416,803,7907,417,803,7908,85,803,7909,117,803,7910,85,777,7911,117,777,7912,431,769,7913,432,769,7914,431,768,7915,432,768,7916,431,777,7917,432,777,7918,431,771,7919,432,771,7920,431,803,7921,432,803,7922,89,768,7923,121,768,7924,89,803,7925,121,803,7926,89,777,7927,121,777,7928,89,771,7929,121,771,7936,945,787,7937,945,788,7938,7936,768,7939,7937,768,7940,7936,769,7941,7937,769,7942,7936,834,7943,7937,834,7944,913,787,7945,913,788,7946,7944,768,7947,7945,768,7948,7944,769,7949,7945,769,7950,7944,834,7951,7945,834,7952,949,787,7953,949,788,7954,7952,768,7955,7953,768,7956,7952,769,7957,7953,769,7960,917,787,7961,917,788,7962,7960,768,7963,7961,768,7964,7960,769,7965,7961,769,7968,951,787,7969,951,788,7970,7968,768,7971,7969,768,7972,7968,769,7973,7969,769,7974,7968,834,7975,7969,834,7976,919,787,7977,919,788,7978,7976,768,7979,7977,768,7980,7976,769,7981,7977,769,7982,7976,834,7983,7977,834,7984,953,787,7985,953,788,7986,7984,768,7987,7985,768,7988,7984,769,7989,7985,769,7990,7984,834,7991,7985,834,7992,921,787,7993,921,788,7994,7992,768,7995,7993,768,7996,7992,769,7997,7993,769,7998,7992,834,7999,7993,834,8000,959,787,8001,959,788,8002,8000,768,8003,8001,768,8004,8000,769,8005,8001,769,8008,927,787,8009,927,788,8010,8008,768,8011,8009,768,8012,8008,769,8013,8009,769,8016,965,787,8017,965,788,8018,8016,768,8019,8017,768,8020,8016,769,8021,8017,769,8022,8016,834,8023,8017,834,8025,933,788,8027,8025,768,8029,8025,769,8031,8025,834,8032,969,787,8033,969,788,8034,8032,768,8035,8033,768,8036,8032,769,8037,8033,769,8038,8032,834,8039,8033,834,8040,937,787,8041,937,788,8042,8040,768,8043,8041,768,8044,8040,769,8045,8041,769,8046,8040,834,8047,8041,834,8048,945,768,8049,940,-1,8050,949,768,8051,941,-1,8052,951,768,8053,942,-1,8054,953,768,8055,943,-1,8056,959,768,8057,972,-1,8058,965,768,8059,973,-1,8060,969,768,8061,974,-1,8064,7936,837,8065,7937,837,8066,7938,837,8067,7939,837,8068,7940,837,8069,7941,837,8070,7942,837,8071,7943,837,8072,7944,837,8073,7945,837,8074,7946,837,8075,7947,837,8076,7948,837,8077,7949,837,8078,7950,837,8079,7951,837,8080,7968,837,8081,7969,837,8082,7970,837,8083,7971,837,8084,7972,837,8085,7973,837,8086,7974,837,8087,7975,837,8088,7976,837,8089,7977,837,8090,7978,837,8091,7979,837,8092,7980,837,8093,7981,837,8094,7982,837,8095,7983,837,8096,8032,837,8097,8033,837,8098,8034,837,8099,8035,837,8100,8036,837,8101,8037,837,8102,8038,837,8103,8039,837,8104,8040,837,8105,8041,837,8106,8042,837,8107,8043,837,8108,8044,837,8109,8045,837,8110,8046,837,8111,8047,837,8112,945,774,8113,945,772,8114,8048,837,8115,945,837,8116,940,837,8118,945,834,8119,8118,837,8120,913,774,8121,913,772,8122,913,768,8123,902,-1,8124,913,837,8126,953,-1,8129,168,834,8130,8052,837,8131,951,837,8132,942,837,8134,951,834,8135,8134,837,8136,917,768,8137,904,-1,8138,919,768,8139,905,-1,8140,919,837,8141,8127,768,8142,8127,769,8143,8127,834,8144,953,774,8145,953,772,8146,970,768,8147,912,-1,8150,953,834,8151,970,834,8152,921,774,8153,921,772,8154,921,768,8155,906,-1,8157,8190,768,8158,8190,769,8159,8190,834,8160,965,774,8161,965,772,8162,971,768,8163,944,-1,8164,961,787,8165,961,788,8166,965,834,8167,971,834,8168,933,774,8169,933,772,8170,933,768,8171,910,-1,8172,929,788,8173,168,768,8174,901,-1,8175,96,-1,8178,8060,837,8179,969,837,8180,974,837,8182,969,834,8183,8182,837,8184,927,768,8185,908,-1,8186,937,768,8187,911,-1,8188,937,837,8189,180,-1,8192,8194,-1,8193,8195,-1,8486,937,-1,8490,75,-1,8491,197,-1,8602,8592,824,8603,8594,824,8622,8596,824,8653,8656,824,8654,8660,824,8655,8658,824,8708,8707,824,8713,8712,824,8716,8715,824,8740,8739,824,8742,8741,824,8769,8764,824,8772,8771,824,8775,8773,824,8777,8776,824,8800,61,824,8802,8801,824,8813,8781,824,8814,60,824,8815,62,824,8816,8804,824,8817,8805,824,8820,8818,824,8821,8819,824,8824,8822,824,8825,8823,824,8832,8826,824,8833,8827,824,8836,8834,824,8837,8835,824,8840,8838,824,8841,8839,824,8876,8866,824,8877,8872,824,8878,8873,824,8879,8875,824,8928,8828,824,8929,8829,824,8930,8849,824,8931,8850,824,8938,8882,824,8939,8883,824,8940,8884,824,8941,8885,824,9001,12296,-1,9002,12297,-1,10972,10973,824,12364,12363,12441,12366,12365,12441,12368,12367,12441,12370,12369,12441,12372,12371,12441,12374,12373,12441,12376,12375,12441,12378,12377,12441,12380,12379,12441,12382,12381,12441,12384,12383,12441,12386,12385,12441,12389,12388,12441,12391,12390,12441,12393,12392,12441,12400,12399,12441,12401,12399,12442,12403,12402,12441,12404,12402,12442,12406,12405,12441,12407,12405,12442,12409,12408,12441,12410,12408,12442,12412,12411,12441,12413,12411,12442,12436,12358,12441,12446,12445,12441,12460,12459,12441,12462,12461,12441,12464,12463,12441,12466,12465,12441,12468,12467,12441,12470,12469,12441,12472,12471,12441,12474,12473,12441,12476,12475,12441,12478,12477,12441,12480,12479,12441,12482,12481,12441,12485,12484,12441,12487,12486,12441,12489,12488,12441,12496,12495,12441,12497,12495,12442,12499,12498,12441,12500,12498,12442,12502,12501,12441,12503,12501,12442,12505,12504,12441,12506,12504,12442,12508,12507,12441,12509,12507,12442,12532,12454,12441,12535,12527,12441,12536,12528,12441,12537,12529,12441,12538,12530,12441,12542,12541,12441,63744,35912,-1,63745,26356,-1,63746,36554,-1,63747,36040,-1,63748,28369,-1,63749,20018,-1,63750,21477,-1,63751,40860,-1,63752,40860,-1,63753,22865,-1,63754,37329,-1,63755,21895,-1,63756,22856,-1,63757,25078,-1,63758,30313,-1,63759,32645,-1,63760,34367,-1,63761,34746,-1,63762,35064,-1,63763,37007,-1,63764,27138,-1,63765,27931,-1,63766,28889,-1,63767,29662,-1,63768,33853,-1,63769,37226,-1,63770,39409,-1,63771,20098,-1,63772,21365,-1,63773,27396,-1,63774,29211,-1,63775,34349,-1,63776,40478,-1,63777,23888,-1,63778,28651,-1,63779,34253,-1,63780,35172,-1,63781,25289,-1,63782,33240,-1,63783,34847,-1,63784,24266,-1,63785,26391,-1,63786,28010,-1,63787,29436,-1,63788,37070,-1,63789,20358,-1,63790,20919,-1,63791,21214,-1,63792,25796,-1,63793,27347,-1,63794,29200,-1,63795,30439,-1,63796,32769,-1,63797,34310,-1,63798,34396,-1,63799,36335,-1,63800,38706,-1,63801,39791,-1,63802,40442,-1,63803,30860,-1,63804,31103,-1,63805,32160,-1,63806,33737,-1,63807,37636,-1,63808,40575,-1,63809,35542,-1,63810,22751,-1,63811,24324,-1,63812,31840,-1,63813,32894,-1,63814,29282,-1,63815,30922,-1,63816,36034,-1,63817,38647,-1,63818,22744,-1,63819,23650,-1,63820,27155,-1,63821,28122,-1,63822,28431,-1,63823,32047,-1,63824,32311,-1,63825,38475,-1,63826,21202,-1,63827,32907,-1,63828,20956,-1,63829,20940,-1,63830,31260,-1,63831,32190,-1,63832,33777,-1,63833,38517,-1,63834,35712,-1,63835,25295,-1,63836,27138,-1,63837,35582,-1,63838,20025,-1,63839,23527,-1,63840,24594,-1,63841,29575,-1,63842,30064,-1,63843,21271,-1,63844,30971,-1,63845,20415,-1,63846,24489,-1,63847,19981,-1,63848,27852,-1,63849,25976,-1,63850,32034,-1,63851,21443,-1,63852,22622,-1,63853,30465,-1,63854,33865,-1,63855,35498,-1,63856,27578,-1,63857,36784,-1,63858,27784,-1,63859,25342,-1,63860,33509,-1,63861,25504,-1,63862,30053,-1,63863,20142,-1,63864,20841,-1,63865,20937,-1,63866,26753,-1,63867,31975,-1,63868,33391,-1,63869,35538,-1,63870,37327,-1,63871,21237,-1,63872,21570,-1,63873,22899,-1,63874,24300,-1,63875,26053,-1,63876,28670,-1,63877,31018,-1,63878,38317,-1,63879,39530,-1,63880,40599,-1,63881,40654,-1,63882,21147,-1,63883,26310,-1,63884,27511,-1,63885,36706,-1,63886,24180,-1,63887,24976,-1,63888,25088,-1,63889,25754,-1,63890,28451,-1,63891,29001,-1,63892,29833,-1,63893,31178,-1,63894,32244,-1,63895,32879,-1,63896,36646,-1,63897,34030,-1,63898,36899,-1,63899,37706,-1,63900,21015,-1,63901,21155,-1,63902,21693,-1,63903,28872,-1,63904,35010,-1,63905,35498,-1,63906,24265,-1,63907,24565,-1,63908,25467,-1,63909,27566,-1,63910,31806,-1,63911,29557,-1,63912,20196,-1,63913,22265,-1,63914,23527,-1,63915,23994,-1,63916,24604,-1,63917,29618,-1,63918,29801,-1,63919,32666,-1,63920,32838,-1,63921,37428,-1,63922,38646,-1,63923,38728,-1,63924,38936,-1,63925,20363,-1,63926,31150,-1,63927,37300,-1,63928,38584,-1,63929,24801,-1,63930,20102,-1,63931,20698,-1,63932,23534,-1,63933,23615,-1,63934,26009,-1,63935,27138,-1,63936,29134,-1,63937,30274,-1,63938,34044,-1,63939,36988,-1,63940,40845,-1,63941,26248,-1,63942,38446,-1,63943,21129,-1,63944,26491,-1,63945,26611,-1,63946,27969,-1,63947,28316,-1,63948,29705,-1,63949,30041,-1,63950,30827,-1,63951,32016,-1,63952,39006,-1,63953,20845,-1,63954,25134,-1,63955,38520,-1,63956,20523,-1,63957,23833,-1,63958,28138,-1,63959,36650,-1,63960,24459,-1,63961,24900,-1,63962,26647,-1,63963,29575,-1,63964,38534,-1,63965,21033,-1,63966,21519,-1,63967,23653,-1,63968,26131,-1,63969,26446,-1,63970,26792,-1,63971,27877,-1,63972,29702,-1,63973,30178,-1,63974,32633,-1,63975,35023,-1,63976,35041,-1,63977,37324,-1,63978,38626,-1,63979,21311,-1,63980,28346,-1,63981,21533,-1,63982,29136,-1,63983,29848,-1,63984,34298,-1,63985,38563,-1,63986,40023,-1,63987,40607,-1,63988,26519,-1,63989,28107,-1,63990,33256,-1,63991,31435,-1,63992,31520,-1,63993,31890,-1,63994,29376,-1,63995,28825,-1,63996,35672,-1,63997,20160,-1,63998,33590,-1,63999,21050,-1,64e3,20999,-1,64001,24230,-1,64002,25299,-1,64003,31958,-1,64004,23429,-1,64005,27934,-1,64006,26292,-1,64007,36667,-1,64008,34892,-1,64009,38477,-1,64010,35211,-1,64011,24275,-1,64012,20800,-1,64013,21952,-1,64016,22618,-1,64018,26228,-1,64021,20958,-1,64022,29482,-1,64023,30410,-1,64024,31036,-1,64025,31070,-1,64026,31077,-1,64027,31119,-1,64028,38742,-1,64029,31934,-1,64030,32701,-1,64032,34322,-1,64034,35576,-1,64037,36920,-1,64038,37117,-1,64042,39151,-1,64043,39164,-1,64044,39208,-1,64045,40372,-1,64046,37086,-1,64047,38583,-1,64048,20398,-1,64049,20711,-1,64050,20813,-1,64051,21193,-1,64052,21220,-1,64053,21329,-1,64054,21917,-1,64055,22022,-1,64056,22120,-1,64057,22592,-1,64058,22696,-1,64059,23652,-1,64060,23662,-1,64061,24724,-1,64062,24936,-1,64063,24974,-1,64064,25074,-1,64065,25935,-1,64066,26082,-1,64067,26257,-1,64068,26757,-1,64069,28023,-1,64070,28186,-1,64071,28450,-1,64072,29038,-1,64073,29227,-1,64074,29730,-1,64075,30865,-1,64076,31038,-1,64077,31049,-1,64078,31048,-1,64079,31056,-1,64080,31062,-1,64081,31069,-1,64082,31117,-1,64083,31118,-1,64084,31296,-1,64085,31361,-1,64086,31680,-1,64087,32244,-1,64088,32265,-1,64089,32321,-1,64090,32626,-1,64091,32773,-1,64092,33261,-1,64093,33401,-1,64094,33401,-1,64095,33879,-1,64096,35088,-1,64097,35222,-1,64098,35585,-1,64099,35641,-1,64100,36051,-1,64101,36104,-1,64102,36790,-1,64103,36920,-1,64104,38627,-1,64105,38911,-1,64106,38971,-1,64107,24693,-1,64108,148206,-1,64109,33304,-1,64112,20006,-1,64113,20917,-1,64114,20840,-1,64115,20352,-1,64116,20805,-1,64117,20864,-1,64118,21191,-1,64119,21242,-1,64120,21917,-1,64121,21845,-1,64122,21913,-1,64123,21986,-1,64124,22618,-1,64125,22707,-1,64126,22852,-1,64127,22868,-1,64128,23138,-1,64129,23336,-1,64130,24274,-1,64131,24281,-1,64132,24425,-1,64133,24493,-1,64134,24792,-1,64135,24910,-1,64136,24840,-1,64137,24974,-1,64138,24928,-1,64139,25074,-1,64140,25140,-1,64141,25540,-1,64142,25628,-1,64143,25682,-1,64144,25942,-1,64145,26228,-1,64146,26391,-1,64147,26395,-1,64148,26454,-1,64149,27513,-1,64150,27578,-1,64151,27969,-1,64152,28379,-1,64153,28363,-1,64154,28450,-1,64155,28702,-1,64156,29038,-1,64157,30631,-1,64158,29237,-1,64159,29359,-1,64160,29482,-1,64161,29809,-1,64162,29958,-1,64163,30011,-1,64164,30237,-1,64165,30239,-1,64166,30410,-1,64167,30427,-1,64168,30452,-1,64169,30538,-1,64170,30528,-1,64171,30924,-1,64172,31409,-1,64173,31680,-1,64174,31867,-1,64175,32091,-1,64176,32244,-1,64177,32574,-1,64178,32773,-1,64179,33618,-1,64180,33775,-1,64181,34681,-1,64182,35137,-1,64183,35206,-1,64184,35222,-1,64185,35519,-1,64186,35576,-1,64187,35531,-1,64188,35585,-1,64189,35582,-1,64190,35565,-1,64191,35641,-1,64192,35722,-1,64193,36104,-1,64194,36664,-1,64195,36978,-1,64196,37273,-1,64197,37494,-1,64198,38524,-1,64199,38627,-1,64200,38742,-1,64201,38875,-1,64202,38911,-1,64203,38923,-1,64204,38971,-1,64205,39698,-1,64206,40860,-1,64207,141386,-1,64208,141380,-1,64209,144341,-1,64210,15261,-1,64211,16408,-1,64212,16441,-1,64213,152137,-1,64214,154832,-1,64215,163539,-1,64216,40771,-1,64217,40846,-1,64285,1497,1460,64287,1522,1463,64298,1513,1473,64299,1513,1474,64300,64329,1473,64301,64329,1474,64302,1488,1463,64303,1488,1464,64304,1488,1468,64305,1489,1468,64306,1490,1468,64307,1491,1468,64308,1492,1468,64309,1493,1468,64310,1494,1468,64312,1496,1468,64313,1497,1468,64314,1498,1468,64315,1499,1468,64316,1500,1468,64318,1502,1468,64320,1504,1468,64321,1505,1468,64323,1507,1468,64324,1508,1468,64326,1510,1468,64327,1511,1468,64328,1512,1468,64329,1513,1468,64330,1514,1468,64331,1493,1465,64332,1489,1471,64333,1499,1471,64334,1508,1471,67017,67026,775,67044,67034,775,69786,69785,69818,69788,69787,69818,69803,69797,69818,69934,69937,69927,69935,69938,69927,70475,70471,70462,70476,70471,70487,70531,70530,70601,70533,70532,70587,70542,70539,70594,70545,70544,70601,70597,70594,70594,70599,70594,70584,70600,70594,70601,70843,70841,70842,70844,70841,70832,70846,70841,70845,71098,71096,71087,71099,71097,71087,71992,71989,71984,90401,90398,90398,90402,90398,90409,90403,90398,90399,90404,90409,90399,90405,90398,90400,90406,90401,90399,90407,90402,90399,90408,90401,90400,93544,93543,93543,93545,93539,93543,93546,93545,93543,119134,119127,119141,119135,119128,119141,119136,119135,119150,119137,119135,119151,119138,119135,119152,119139,119135,119153,119140,119135,119154,119227,119225,119141,119228,119226,119141,119229,119227,119150,119230,119228,119150,119231,119227,119151,119232,119228,119151,194560,20029,-1,194561,20024,-1,194562,20033,-1,194563,131362,-1,194564,20320,-1,194565,20398,-1,194566,20411,-1,194567,20482,-1,194568,20602,-1,194569,20633,-1,194570,20711,-1,194571,20687,-1,194572,13470,-1,194573,132666,-1,194574,20813,-1,194575,20820,-1,194576,20836,-1,194577,20855,-1,194578,132380,-1,194579,13497,-1,194580,20839,-1,194581,20877,-1,194582,132427,-1,194583,20887,-1,194584,20900,-1,194585,20172,-1,194586,20908,-1,194587,20917,-1,194588,168415,-1,194589,20981,-1,194590,20995,-1,194591,13535,-1,194592,21051,-1,194593,21062,-1,194594,21106,-1,194595,21111,-1,194596,13589,-1,194597,21191,-1,194598,21193,-1,194599,21220,-1,194600,21242,-1,194601,21253,-1,194602,21254,-1,194603,21271,-1,194604,21321,-1,194605,21329,-1,194606,21338,-1,194607,21363,-1,194608,21373,-1,194609,21375,-1,194610,21375,-1,194611,21375,-1,194612,133676,-1,194613,28784,-1,194614,21450,-1,194615,21471,-1,194616,133987,-1,194617,21483,-1,194618,21489,-1,194619,21510,-1,194620,21662,-1,194621,21560,-1,194622,21576,-1,194623,21608,-1,194624,21666,-1,194625,21750,-1,194626,21776,-1,194627,21843,-1,194628,21859,-1,194629,21892,-1,194630,21892,-1,194631,21913,-1,194632,21931,-1,194633,21939,-1,194634,21954,-1,194635,22294,-1,194636,22022,-1,194637,22295,-1,194638,22097,-1,194639,22132,-1,194640,20999,-1,194641,22766,-1,194642,22478,-1,194643,22516,-1,194644,22541,-1,194645,22411,-1,194646,22578,-1,194647,22577,-1,194648,22700,-1,194649,136420,-1,194650,22770,-1,194651,22775,-1,194652,22790,-1,194653,22810,-1,194654,22818,-1,194655,22882,-1,194656,136872,-1,194657,136938,-1,194658,23020,-1,194659,23067,-1,194660,23079,-1,194661,23e3,-1,194662,23142,-1,194663,14062,-1,194664,14076,-1,194665,23304,-1,194666,23358,-1,194667,23358,-1,194668,137672,-1,194669,23491,-1,194670,23512,-1,194671,23527,-1,194672,23539,-1,194673,138008,-1,194674,23551,-1,194675,23558,-1,194676,24403,-1,194677,23586,-1,194678,14209,-1,194679,23648,-1,194680,23662,-1,194681,23744,-1,194682,23693,-1,194683,138724,-1,194684,23875,-1,194685,138726,-1,194686,23918,-1,194687,23915,-1,194688,23932,-1,194689,24033,-1,194690,24034,-1,194691,14383,-1,194692,24061,-1,194693,24104,-1,194694,24125,-1,194695,24169,-1,194696,14434,-1,194697,139651,-1,194698,14460,-1,194699,24240,-1,194700,24243,-1,194701,24246,-1,194702,24266,-1,194703,172946,-1,194704,24318,-1,194705,140081,-1,194706,140081,-1,194707,33281,-1,194708,24354,-1,194709,24354,-1,194710,14535,-1,194711,144056,-1,194712,156122,-1,194713,24418,-1,194714,24427,-1,194715,14563,-1,194716,24474,-1,194717,24525,-1,194718,24535,-1,194719,24569,-1,194720,24705,-1,194721,14650,-1,194722,14620,-1,194723,24724,-1,194724,141012,-1,194725,24775,-1,194726,24904,-1,194727,24908,-1,194728,24910,-1,194729,24908,-1,194730,24954,-1,194731,24974,-1,194732,25010,-1,194733,24996,-1,194734,25007,-1,194735,25054,-1,194736,25074,-1,194737,25078,-1,194738,25104,-1,194739,25115,-1,194740,25181,-1,194741,25265,-1,194742,25300,-1,194743,25424,-1,194744,142092,-1,194745,25405,-1,194746,25340,-1,194747,25448,-1,194748,25475,-1,194749,25572,-1,194750,142321,-1,194751,25634,-1,194752,25541,-1,194753,25513,-1,194754,14894,-1,194755,25705,-1,194756,25726,-1,194757,25757,-1,194758,25719,-1,194759,14956,-1,194760,25935,-1,194761,25964,-1,194762,143370,-1,194763,26083,-1,194764,26360,-1,194765,26185,-1,194766,15129,-1,194767,26257,-1,194768,15112,-1,194769,15076,-1,194770,20882,-1,194771,20885,-1,194772,26368,-1,194773,26268,-1,194774,32941,-1,194775,17369,-1,194776,26391,-1,194777,26395,-1,194778,26401,-1,194779,26462,-1,194780,26451,-1,194781,144323,-1,194782,15177,-1,194783,26618,-1,194784,26501,-1,194785,26706,-1,194786,26757,-1,194787,144493,-1,194788,26766,-1,194789,26655,-1,194790,26900,-1,194791,15261,-1,194792,26946,-1,194793,27043,-1,194794,27114,-1,194795,27304,-1,194796,145059,-1,194797,27355,-1,194798,15384,-1,194799,27425,-1,194800,145575,-1,194801,27476,-1,194802,15438,-1,194803,27506,-1,194804,27551,-1,194805,27578,-1,194806,27579,-1,194807,146061,-1,194808,138507,-1,194809,146170,-1,194810,27726,-1,194811,146620,-1,194812,27839,-1,194813,27853,-1,194814,27751,-1,194815,27926,-1,194816,27966,-1,194817,28023,-1,194818,27969,-1,194819,28009,-1,194820,28024,-1,194821,28037,-1,194822,146718,-1,194823,27956,-1,194824,28207,-1,194825,28270,-1,194826,15667,-1,194827,28363,-1,194828,28359,-1,194829,147153,-1,194830,28153,-1,194831,28526,-1,194832,147294,-1,194833,147342,-1,194834,28614,-1,194835,28729,-1,194836,28702,-1,194837,28699,-1,194838,15766,-1,194839,28746,-1,194840,28797,-1,194841,28791,-1,194842,28845,-1,194843,132389,-1,194844,28997,-1,194845,148067,-1,194846,29084,-1,194847,148395,-1,194848,29224,-1,194849,29237,-1,194850,29264,-1,194851,149e3,-1,194852,29312,-1,194853,29333,-1,194854,149301,-1,194855,149524,-1,194856,29562,-1,194857,29579,-1,194858,16044,-1,194859,29605,-1,194860,16056,-1,194861,16056,-1,194862,29767,-1,194863,29788,-1,194864,29809,-1,194865,29829,-1,194866,29898,-1,194867,16155,-1,194868,29988,-1,194869,150582,-1,194870,30014,-1,194871,150674,-1,194872,30064,-1,194873,139679,-1,194874,30224,-1,194875,151457,-1,194876,151480,-1,194877,151620,-1,194878,16380,-1,194879,16392,-1,194880,30452,-1,194881,151795,-1,194882,151794,-1,194883,151833,-1,194884,151859,-1,194885,30494,-1,194886,30495,-1,194887,30495,-1,194888,30538,-1,194889,16441,-1,194890,30603,-1,194891,16454,-1,194892,16534,-1,194893,152605,-1,194894,30798,-1,194895,30860,-1,194896,30924,-1,194897,16611,-1,194898,153126,-1,194899,31062,-1,194900,153242,-1,194901,153285,-1,194902,31119,-1,194903,31211,-1,194904,16687,-1,194905,31296,-1,194906,31306,-1,194907,31311,-1,194908,153980,-1,194909,154279,-1,194910,154279,-1,194911,31470,-1,194912,16898,-1,194913,154539,-1,194914,31686,-1,194915,31689,-1,194916,16935,-1,194917,154752,-1,194918,31954,-1,194919,17056,-1,194920,31976,-1,194921,31971,-1,194922,32e3,-1,194923,155526,-1,194924,32099,-1,194925,17153,-1,194926,32199,-1,194927,32258,-1,194928,32325,-1,194929,17204,-1,194930,156200,-1,194931,156231,-1,194932,17241,-1,194933,156377,-1,194934,32634,-1,194935,156478,-1,194936,32661,-1,194937,32762,-1,194938,32773,-1,194939,156890,-1,194940,156963,-1,194941,32864,-1,194942,157096,-1,194943,32880,-1,194944,144223,-1,194945,17365,-1,194946,32946,-1,194947,33027,-1,194948,17419,-1,194949,33086,-1,194950,23221,-1,194951,157607,-1,194952,157621,-1,194953,144275,-1,194954,144284,-1,194955,33281,-1,194956,33284,-1,194957,36766,-1,194958,17515,-1,194959,33425,-1,194960,33419,-1,194961,33437,-1,194962,21171,-1,194963,33457,-1,194964,33459,-1,194965,33469,-1,194966,33510,-1,194967,158524,-1,194968,33509,-1,194969,33565,-1,194970,33635,-1,194971,33709,-1,194972,33571,-1,194973,33725,-1,194974,33767,-1,194975,33879,-1,194976,33619,-1,194977,33738,-1,194978,33740,-1,194979,33756,-1,194980,158774,-1,194981,159083,-1,194982,158933,-1,194983,17707,-1,194984,34033,-1,194985,34035,-1,194986,34070,-1,194987,160714,-1,194988,34148,-1,194989,159532,-1,194990,17757,-1,194991,17761,-1,194992,159665,-1,194993,159954,-1,194994,17771,-1,194995,34384,-1,194996,34396,-1,194997,34407,-1,194998,34409,-1,194999,34473,-1,195e3,34440,-1,195001,34574,-1,195002,34530,-1,195003,34681,-1,195004,34600,-1,195005,34667,-1,195006,34694,-1,195007,17879,-1,195008,34785,-1,195009,34817,-1,195010,17913,-1,195011,34912,-1,195012,34915,-1,195013,161383,-1,195014,35031,-1,195015,35038,-1,195016,17973,-1,195017,35066,-1,195018,13499,-1,195019,161966,-1,195020,162150,-1,195021,18110,-1,195022,18119,-1,195023,35488,-1,195024,35565,-1,195025,35722,-1,195026,35925,-1,195027,162984,-1,195028,36011,-1,195029,36033,-1,195030,36123,-1,195031,36215,-1,195032,163631,-1,195033,133124,-1,195034,36299,-1,195035,36284,-1,195036,36336,-1,195037,133342,-1,195038,36564,-1,195039,36664,-1,195040,165330,-1,195041,165357,-1,195042,37012,-1,195043,37105,-1,195044,37137,-1,195045,165678,-1,195046,37147,-1,195047,37432,-1,195048,37591,-1,195049,37592,-1,195050,37500,-1,195051,37881,-1,195052,37909,-1,195053,166906,-1,195054,38283,-1,195055,18837,-1,195056,38327,-1,195057,167287,-1,195058,18918,-1,195059,38595,-1,195060,23986,-1,195061,38691,-1,195062,168261,-1,195063,168474,-1,195064,19054,-1,195065,19062,-1,195066,38880,-1,195067,168970,-1,195068,19122,-1,195069,169110,-1,195070,38923,-1,195071,38923,-1,195072,38953,-1,195073,169398,-1,195074,39138,-1,195075,19251,-1,195076,39209,-1,195077,39335,-1,195078,39362,-1,195079,39422,-1,195080,19406,-1,195081,170800,-1,195082,39698,-1,195083,4e4,-1,195084,40189,-1,195085,19662,-1,195086,19693,-1,195087,40295,-1,195088,172238,-1,195089,19704,-1,195090,172293,-1,195091,172558,-1,195092,172689,-1,195093,40635,-1,195094,19798,-1,195095,40697,-1,195096,40702,-1,195097,40709,-1,195098,40719,-1,195099,40726,-1,195100,40763,-1,195101,173568,-1],t.t)
B.c_=s(["text-color","text-opacity","text-halo-color","text-halo-width","text-halo-blur","icon-color","icon-opacity"],t.s)
B.T=s([1769172844,1718185569,1718185522,1718185523,1835361385,1835361330,1768843636],t.t)
B.c0=s([0,64,25,65,90,74,91,96,25,97,122,74,123,169,25,170,170,74,171,185,25,186,186,74,187,191,25,192,214,74,215,215,25,216,246,74,247,247,25,248,696,74,697,735,25,736,740,74,741,745,25,746,747,13,748,767,25,768,879,58,880,883,45,884,884,25,885,887,45,890,893,45,894,894,25,895,895,45,900,900,45,901,901,25,902,902,45,903,903,25,904,906,45,908,908,45,910,929,45,931,993,45,994,1007,26,1008,1023,45,1024,1156,30,1157,1158,58,1159,1327,30,1329,1366,5,1369,1418,5,1421,1423,5,1425,1479,55,1488,1514,55,1519,1524,55,1536,1540,4,1541,1541,25,1542,1547,4,1548,1548,25,1549,1562,4,1563,1563,25,1564,1566,4,1567,1567,25,1568,1599,4,1600,1600,25,1601,1610,4,1611,1621,58,1622,1647,4,1648,1648,58,1649,1756,4,1757,1757,25,1758,1791,4,1792,1805,144,1807,1866,144,1869,1871,144,1872,1919,4,1920,1969,155,1984,2042,105,2045,2047,105,2048,2093,131,2096,2110,131,2112,2139,85,2142,2142,85,2144,2154,144,2160,2190,4,2192,2193,4,2199,2273,4,2274,2274,25,2275,2303,4,2304,2384,32,2385,2388,58,2389,2403,32,2404,2405,25,2406,2431,32,2432,2435,11,2437,2444,11,2447,2448,11,2451,2472,11,2474,2480,11,2482,2482,11,2486,2489,11,2492,2500,11,2503,2504,11,2507,2510,11,2519,2519,11,2524,2525,11,2527,2531,11,2534,2558,11,2561,2563,48,2565,2570,48,2575,2576,48,2579,2600,48,2602,2608,48,2610,2611,48,2613,2614,48,2616,2617,48,2620,2620,48,2622,2626,48,2631,2632,48,2635,2637,48,2641,2641,48,2649,2652,48,2654,2654,48,2662,2678,48,2689,2691,46,2693,2701,46,2703,2705,46,2707,2728,46,2730,2736,46,2738,2739,46,2741,2745,46,2748,2757,46,2759,2761,46,2763,2765,46,2768,2768,46,2784,2787,46,2790,2801,46,2809,2815,46,2817,2819,120,2821,2828,120,2831,2832,120,2835,2856,120,2858,2864,120,2866,2867,120,2869,2873,120,2876,2884,120,2887,2888,120,2891,2893,120,2901,2903,120,2908,2909,120,2911,2915,120,2918,2935,120,2946,2947,151,2949,2954,151,2958,2960,151,2962,2965,151,2969,2970,151,2972,2972,151,2974,2975,151,2979,2980,151,2984,2986,151,2990,3001,151,3006,3010,151,3014,3016,151,3018,3021,151,3024,3024,151,3031,3031,151,3046,3066,151,3072,3084,154,3086,3088,154,3090,3112,154,3114,3129,154,3132,3140,154,3142,3144,154,3146,3149,154,3157,3158,154,3160,3162,154,3165,3165,154,3168,3171,154,3174,3183,154,3191,3199,154,3200,3212,63,3214,3216,63,3218,3240,63,3242,3251,63,3253,3257,63,3260,3268,63,3270,3272,63,3274,3277,63,3285,3286,63,3293,3294,63,3296,3299,63,3302,3311,63,3313,3315,63,3328,3340,84,3342,3344,84,3346,3396,84,3398,3400,84,3402,3407,84,3412,3427,84,3430,3455,84,3457,3459,137,3461,3478,137,3482,3505,137,3507,3515,137,3517,3517,137,3520,3526,137,3530,3530,137,3535,3540,137,3542,3542,137,3544,3551,137,3558,3567,137,3570,3572,137,3585,3642,156,3647,3647,25,3648,3675,156,3713,3714,73,3716,3716,73,3718,3722,73,3724,3747,73,3749,3749,73,3751,3773,73,3776,3780,73,3782,3782,73,3784,3790,73,3792,3801,73,3804,3807,73,3840,3911,157,3913,3948,157,3953,3991,157,3993,4028,157,4030,4044,157,4046,4052,157,4053,4056,25,4057,4058,157,4096,4255,99,4256,4293,41,4295,4295,41,4301,4301,41,4304,4346,41,4347,4347,25,4348,4351,41,4352,4607,51,4608,4680,39,4682,4685,39,4688,4694,39,4696,4696,39,4698,4701,39,4704,4744,39,4746,4749,39,4752,4784,39,4786,4789,39,4792,4798,39,4800,4800,39,4802,4805,39,4808,4822,39,4824,4880,39,4882,4885,39,4888,4954,39,4957,4988,39,4992,5017,39,5024,5109,23,5112,5117,23,5120,5759,18,5760,5788,108,5792,5866,130,5867,5869,25,5870,5880,130,5888,5909,145,5919,5919,145,5920,5940,53,5941,5942,25,5952,5971,17,5984,5996,146,5998,6000,146,6002,6003,146,6016,6109,69,6112,6121,69,6128,6137,69,6144,6145,96,6146,6147,25,6148,6148,96,6149,6149,25,6150,6169,96,6176,6264,96,6272,6314,96,6320,6389,18,6400,6430,76,6432,6443,76,6448,6459,76,6464,6464,76,6468,6479,76,6480,6509,147,6512,6516,147,6528,6571,103,6576,6601,103,6608,6618,103,6622,6623,103,6624,6655,69,6656,6683,16,6686,6687,16,6688,6750,148,6752,6780,148,6783,6793,148,6800,6809,148,6816,6829,148,6832,6862,58,6912,6988,7,6990,7039,7,7040,7103,141,7104,7155,10,7164,7167,10,7168,7223,75,7227,7241,75,7245,7247,75,7248,7295,109,7296,7306,30,7312,7354,41,7357,7359,41,7360,7367,141,7376,7378,58,7379,7379,25,7380,7392,58,7393,7393,25,7394,7400,58,7401,7404,25,7405,7405,58,7406,7411,25,7412,7412,58,7413,7415,25,7416,7417,58,7418,7418,25,7424,7461,74,7462,7466,45,7467,7467,30,7468,7516,74,7517,7521,45,7522,7525,74,7526,7530,45,7531,7543,74,7544,7544,30,7545,7614,74,7615,7615,45,7616,7679,58,7680,7935,74,7936,7957,45,7960,7965,45,7968,8005,45,8008,8013,45,8016,8023,45,8025,8025,45,8027,8027,45,8029,8029,45,8031,8061,45,8064,8116,45,8118,8132,45,8134,8147,45,8150,8155,45,8157,8175,45,8178,8180,45,8182,8190,45,8192,8203,25,8204,8205,58,8206,8292,25,8294,8304,25,8305,8305,74,8308,8318,25,8319,8319,74,8320,8334,25,8336,8348,74,8352,8384,25,8400,8432,58,8448,8485,25,8486,8486,45,8487,8489,25,8490,8491,74,8492,8497,25,8498,8498,74,8499,8525,25,8526,8526,74,8527,8543,25,8544,8584,74,8585,8587,25,8592,9257,25,9280,9290,25,9312,10239,25,10240,10495,15,10496,11123,25,11126,11157,25,11159,11263,25,11264,11359,42,11360,11391,74,11392,11507,26,11513,11519,26,11520,11557,41,11559,11559,41,11565,11565,41,11568,11623,158,11631,11632,158,11647,11647,158,11648,11670,39,11680,11686,39,11688,11694,39,11696,11702,39,11704,11710,39,11712,11718,39,11720,11726,39,11728,11734,39,11736,11742,39,11744,11775,30,11776,11869,25,11904,11929,50,11931,12019,50,12032,12245,50,12272,12292,25,12293,12293,50,12294,12294,25,12295,12295,50,12296,12320,25,12321,12329,50,12330,12333,58,12334,12335,51,12336,12343,25,12344,12347,50,12348,12351,25,12353,12438,56,12441,12442,58,12443,12444,25,12445,12447,56,12448,12448,25,12449,12538,64,12539,12540,25,12541,12543,64,12549,12591,13,12593,12686,51,12688,12703,25,12704,12735,13,12736,12773,25,12783,12783,25,12784,12799,64,12800,12830,51,12832,12895,25,12896,12926,51,12927,13007,25,13008,13054,64,13055,13055,25,13056,13143,64,13144,13311,25,13312,19903,50,19904,19967,25,19968,40959,50,40960,42124,169,42128,42182,169,42192,42239,79,42240,42539,164,42560,42655,30,42656,42743,8,42752,42785,25,42786,42887,74,42888,42890,25,42891,42957,74,42960,42961,74,42963,42963,74,42965,42972,74,42994,43007,74,43008,43052,143,43056,43065,25,43072,43127,126,43136,43205,132,43214,43225,132,43232,43263,32,43264,43309,66,43310,43310,25,43311,43311,66,43312,43347,129,43359,43359,129,43360,43388,51,43392,43469,61,43471,43471,25,43472,43481,61,43486,43487,61,43488,43518,99,43520,43574,22,43584,43597,22,43600,43609,22,43612,43615,22,43616,43647,99,43648,43714,149,43739,43743,149,43744,43766,90,43777,43782,39,43785,43790,39,43793,43798,39,43808,43814,39,43816,43822,39,43824,43866,74,43867,43867,25,43868,43876,74,43877,43877,45,43878,43881,74,43882,43883,25,43888,43967,23,43968,44013,90,44016,44025,90,44032,55203,51,55216,55238,51,55243,55291,51,63744,64109,50,64112,64217,50,64256,64262,74,64275,64279,5,64285,64310,55,64312,64316,55,64318,64318,55,64320,64321,55,64323,64324,55,64326,64335,55,64336,64450,4,64467,64829,4,64830,64831,25,64832,64911,4,64914,64967,4,64975,64975,4,65008,65023,4,65024,65039,58,65040,65049,25,65056,65069,58,65070,65071,30,65072,65106,25,65108,65126,25,65128,65131,25,65136,65140,4,65142,65276,4,65279,65279,25,65281,65312,25,65313,65338,74,65339,65344,25,65345,65370,74,65371,65381,25,65382,65391,64,65392,65392,25,65393,65437,64,65438,65439,25,65440,65470,51,65474,65479,51,65482,65487,51,65490,65495,51,65498,65500,51,65504,65510,25,65512,65518,25,65529,65533,25,65536,65547,78,65549,65574,78,65576,65594,78,65596,65597,78,65599,65613,78,65616,65629,78,65664,65786,78,65792,65794,25,65799,65843,25,65847,65855,25,65856,65934,45,65936,65948,25,65952,65952,45,66e3,66044,25,66045,66045,58,66176,66204,80,66208,66256,19,66272,66272,58,66273,66299,25,66304,66339,112,66349,66351,112,66352,66378,43,66384,66426,114,66432,66461,163,66463,66463,163,66464,66499,115,66504,66517,115,66560,66639,31,66640,66687,134,66688,66717,122,66720,66729,122,66736,66771,121,66776,66811,121,66816,66855,37,66864,66915,20,66927,66927,20,66928,66938,165,66940,66954,165,66956,66962,165,66964,66965,165,66967,66977,165,66979,66993,165,66995,67001,165,67003,67004,165,67008,67059,160,67072,67382,77,67392,67413,77,67424,67431,77,67456,67461,74,67463,67504,74,67506,67514,74,67584,67589,28,67592,67592,28,67594,67637,28,67639,67640,28,67644,67644,28,67647,67647,28,67648,67669,57,67671,67679,57,67680,67711,124,67712,67742,100,67751,67759,100,67808,67826,54,67828,67829,54,67835,67839,54,67840,67867,127,67871,67871,127,67872,67897,81,67903,67903,81,67968,67999,93,68e3,68023,92,68028,68047,92,68050,68095,92,68096,68099,67,68101,68102,67,68108,68115,67,68117,68119,67,68121,68149,67,68152,68154,67,68159,68168,67,68176,68184,67,68192,68223,117,68224,68255,113,68288,68326,86,68331,68342,86,68352,68405,6,68409,68415,6,68416,68437,60,68440,68447,60,68448,68466,59,68472,68479,59,68480,68497,128,68505,68508,128,68521,68527,128,68608,68680,118,68736,68786,111,68800,68850,111,68858,68863,111,68864,68903,52,68912,68921,52,68928,68965,40,68969,68997,40,69006,69007,40,69216,69246,4,69248,69289,168,69291,69293,168,69296,69297,168,69314,69316,4,69372,69375,4,69376,69415,116,69424,69465,138,69488,69513,119,69552,69579,24,69600,69622,38,69632,69709,14,69714,69749,14,69759,69759,14,69760,69826,62,69837,69837,62,69840,69864,139,69872,69881,139,69888,69940,21,69942,69959,21,69968,70006,82,70016,70111,133,70113,70132,137,70144,70161,70,70163,70209,70,70272,70278,98,70280,70280,98,70282,70285,98,70287,70301,98,70303,70313,98,70320,70378,71,70384,70393,71,70400,70403,44,70405,70412,44,70415,70416,44,70419,70440,44,70442,70448,44,70450,70451,44,70453,70457,44,70459,70459,58,70460,70468,44,70471,70472,44,70475,70477,44,70480,70480,44,70487,70487,44,70493,70499,44,70502,70508,44,70512,70516,44,70528,70537,162,70539,70539,162,70542,70542,162,70544,70581,162,70583,70592,162,70594,70594,162,70597,70597,162,70599,70602,162,70604,70613,162,70615,70616,162,70625,70626,162,70656,70747,104,70749,70753,104,70784,70855,159,70864,70873,159,71040,71093,135,71096,71133,135,71168,71236,95,71248,71257,95,71264,71276,96,71296,71353,150,71360,71369,150,71376,71395,99,71424,71450,2,71453,71467,2,71472,71494,2,71680,71739,34,71840,71922,167,71935,71935,167,71936,71942,33,71945,71945,33,71948,71955,33,71957,71958,33,71960,71989,33,71991,71992,33,71995,72006,33,72016,72025,33,72096,72103,102,72106,72151,102,72154,72164,102,72192,72263,170,72272,72354,140,72368,72383,18,72384,72440,125,72448,72457,32,72640,72673,142,72688,72697,142,72704,72712,12,72714,72758,12,72760,72773,12,72784,72812,12,72816,72847,87,72850,72871,87,72873,72886,87,72960,72966,88,72968,72969,88,72971,73014,88,73018,73018,88,73020,73021,88,73023,73031,88,73040,73049,88,73056,73061,47,73063,73064,47,73066,73102,47,73104,73105,47,73107,73112,47,73120,73129,47,73440,73464,83,73472,73488,65,73490,73530,65,73534,73562,65,73648,73648,79,73664,73713,151,73727,73727,151,73728,74649,27,74752,74862,27,74864,74868,27,74880,75075,27,77712,77810,29,77824,78933,36,78944,82938,36,82944,83526,3,90368,90425,49,92160,92728,8,92736,92766,97,92768,92777,97,92782,92783,97,92784,92862,152,92864,92873,152,92880,92909,9,92912,92917,9,92928,92997,123,93008,93017,123,93019,93025,123,93027,93047,123,93053,93071,123,93504,93561,72,93760,93850,89,93952,94026,94,94031,94087,94,94095,94111,94,94176,94176,153,94177,94177,106,94178,94179,50,94180,94180,68,94192,94193,50,94208,100343,153,100352,101119,153,101120,101589,68,101631,101631,68,101632,101640,153,110576,110579,64,110581,110587,64,110589,110590,64,110592,110592,64,110593,110879,56,110880,110882,64,110898,110898,56,110928,110930,56,110933,110933,64,110948,110951,64,110960,111355,106,113664,113770,35,113776,113788,35,113792,113800,35,113808,113817,35,113820,113823,35,113824,113827,25,117760,118009,25,118016,118451,25,118528,118573,58,118576,118598,58,118608,118723,25,118784,119029,25,119040,119078,25,119081,119142,25,119143,119145,58,119146,119162,25,119163,119170,58,119171,119172,25,119173,119179,58,119180,119209,25,119210,119213,58,119214,119274,25,119296,119365,45,119488,119507,25,119520,119539,25,119552,119638,25,119648,119672,25,119808,119892,25,119894,119964,25,119966,119967,25,119970,119970,25,119973,119974,25,119977,119980,25,119982,119993,25,119995,119995,25,119997,120003,25,120005,120069,25,120071,120074,25,120077,120084,25,120086,120092,25,120094,120121,25,120123,120126,25,120128,120132,25,120134,120134,25,120138,120144,25,120146,120485,25,120488,120779,25,120782,120831,25,120832,121483,136,121499,121503,136,121505,121519,136,122624,122654,74,122661,122666,74,122880,122886,42,122888,122904,42,122907,122913,42,122915,122916,42,122918,122922,42,122928,122989,30,123023,123023,30,123136,123180,107,123184,123197,107,123200,123209,107,123214,123215,107,123536,123566,161,123584,123641,166,123647,123647,166,124112,124153,101,124368,124410,110,124415,124415,110,124896,124902,39,124904,124907,39,124909,124910,39,124912,124926,39,124928,125124,91,125127,125142,91,125184,125259,1,125264,125273,1,125278,125279,1,126065,126132,25,126209,126269,25,126464,126467,4,126469,126495,4,126497,126498,4,126500,126500,4,126503,126503,4,126505,126514,4,126516,126519,4,126521,126521,4,126523,126523,4,126530,126530,4,126535,126535,4,126537,126537,4,126539,126539,4,126541,126543,4,126545,126546,4,126548,126548,4,126551,126551,4,126553,126553,4,126555,126555,4,126557,126557,4,126559,126559,4,126561,126562,4,126564,126564,4,126567,126570,4,126572,126578,4,126580,126583,4,126585,126588,4,126590,126590,4,126592,126601,4,126603,126619,4,126625,126627,4,126629,126633,4,126635,126651,4,126704,126705,4,126976,127019,25,127024,127123,25,127136,127150,25,127153,127167,25,127169,127183,25,127185,127221,25,127232,127405,25,127462,127487,25,127488,127488,56,127489,127490,25,127504,127547,25,127552,127560,25,127568,127569,25,127584,127589,25,127744,128727,25,128732,128748,25,128752,128764,25,128768,128886,25,128891,128985,25,128992,129003,25,129008,129008,25,129024,129035,25,129040,129095,25,129104,129113,25,129120,129159,25,129168,129197,25,129200,129211,25,129216,129217,25,129280,129619,25,129632,129645,25,129648,129660,25,129664,129673,25,129679,129734,25,129742,129756,25,129759,129769,25,129776,129784,25,129792,129938,25,129940,130041,25,131072,173791,50,173824,177977,50,177984,178205,50,178208,183969,50,183984,191456,50,191472,192093,50,194560,195101,50,196608,201546,50,201552,205743,50,917505,917505,25,917536,917631,25,917760,917999,58],t.t)
B.c1=s([1633842797,1651275629,1667460464,1819239276,1835102827,1835756907,1919707495],t.t)
B.ad=new A.bD(1,"children")
B.ae=new A.bD(2,"leaves")
B.c2=s([B.M,B.ad,B.ae],A.aw("m<bD>"))
B.c3=s([173,173,5,768,879,5,1155,1161,5,1425,1469,5,1471,1471,5,1473,1474,5,1476,1477,5,1479,1479,5,1552,1562,5,1564,1564,5,1568,1568,3,1570,1573,2,1574,1574,3,1575,1575,2,1576,1576,3,1577,1577,2,1578,1582,3,1583,1586,2,1587,1599,3,1600,1600,4,1601,1607,3,1608,1608,2,1609,1610,3,1611,1631,5,1646,1647,3,1648,1648,5,1649,1651,2,1653,1655,2,1656,1671,3,1672,1689,2,1690,1727,3,1728,1728,2,1729,1730,3,1731,1739,2,1740,1740,3,1741,1741,2,1742,1742,3,1743,1743,2,1744,1745,3,1746,1747,2,1749,1749,2,1750,1756,5,1759,1764,5,1767,1768,5,1770,1773,5,1774,1775,2,1786,1788,3,1791,1791,3,1807,1807,5,1808,1808,2,1809,1809,5,1810,1812,3,1813,1817,2,1818,1821,3,1822,1822,2,1823,1831,3,1832,1832,2,1833,1833,3,1834,1834,2,1835,1835,3,1836,1836,2,1837,1838,3,1839,1839,2,1840,1866,5,1869,1869,2,1870,1880,3,1881,1883,2,1884,1898,3,1899,1900,2,1901,1904,3,1905,1905,2,1906,1906,3,1907,1908,2,1909,1911,3,1912,1913,2,1914,1919,3,1958,1968,5,1994,2026,3,2027,2035,5,2042,2042,4,2045,2045,5,2070,2073,5,2075,2083,5,2085,2087,5,2089,2093,5,2112,2112,2,2113,2117,3,2118,2119,2,2120,2120,3,2121,2121,2,2122,2131,3,2132,2132,2,2133,2133,3,2134,2136,2,2137,2139,5,2144,2144,3,2146,2149,3,2151,2151,2,2152,2152,3,2153,2154,2,2160,2178,2,2179,2181,4,2182,2182,3,2185,2189,3,2190,2190,2,2199,2207,5,2208,2217,3,2218,2220,2,2222,2222,2,2223,2224,3,2225,2226,2,2227,2232,3,2233,2233,2,2234,2248,3,2250,2273,5,2275,2306,5,2362,2362,5,2364,2364,5,2369,2376,5,2381,2381,5,2385,2391,5,2402,2403,5,2433,2433,5,2492,2492,5,2497,2500,5,2509,2509,5,2530,2531,5,2558,2558,5,2561,2562,5,2620,2620,5,2625,2626,5,2631,2632,5,2635,2637,5,2641,2641,5,2672,2673,5,2677,2677,5,2689,2690,5,2748,2748,5,2753,2757,5,2759,2760,5,2765,2765,5,2786,2787,5,2810,2815,5,2817,2817,5,2876,2876,5,2879,2879,5,2881,2884,5,2893,2893,5,2901,2902,5,2914,2915,5,2946,2946,5,3008,3008,5,3021,3021,5,3072,3072,5,3076,3076,5,3132,3132,5,3134,3136,5,3142,3144,5,3146,3149,5,3157,3158,5,3170,3171,5,3201,3201,5,3260,3260,5,3263,3263,5,3270,3270,5,3276,3277,5,3298,3299,5,3328,3329,5,3387,3388,5,3393,3396,5,3405,3405,5,3426,3427,5,3457,3457,5,3530,3530,5,3538,3540,5,3542,3542,5,3633,3633,5,3636,3642,5,3655,3662,5,3761,3761,5,3764,3772,5,3784,3790,5,3864,3865,5,3893,3893,5,3895,3895,5,3897,3897,5,3953,3966,5,3968,3972,5,3974,3975,5,3981,3991,5,3993,4028,5,4038,4038,5,4141,4144,5,4146,4151,5,4153,4154,5,4157,4158,5,4184,4185,5,4190,4192,5,4209,4212,5,4226,4226,5,4229,4230,5,4237,4237,5,4253,4253,5,4957,4959,5,5906,5908,5,5938,5939,5,5970,5971,5,6002,6003,5,6068,6069,5,6071,6077,5,6086,6086,5,6089,6099,5,6109,6109,5,6151,6151,3,6154,6154,4,6155,6157,5,6159,6159,5,6176,6264,3,6277,6278,5,6279,6312,3,6313,6313,5,6314,6314,3,6432,6434,5,6439,6440,5,6450,6450,5,6457,6459,5,6679,6680,5,6683,6683,5,6742,6742,5,6744,6750,5,6752,6752,5,6754,6754,5,6757,6764,5,6771,6780,5,6783,6783,5,6832,6862,5,6912,6915,5,6964,6964,5,6966,6970,5,6972,6972,5,6978,6978,5,7019,7027,5,7040,7041,5,7074,7077,5,7080,7081,5,7083,7085,5,7142,7142,5,7144,7145,5,7149,7149,5,7151,7153,5,7212,7219,5,7222,7223,5,7376,7378,5,7380,7392,5,7394,7400,5,7405,7405,5,7412,7412,5,7416,7417,5,7616,7679,5,8203,8203,5,8205,8205,4,8206,8207,5,8234,8238,5,8288,8292,5,8298,8303,5,8400,8432,5,11503,11505,5,11647,11647,5,11744,11775,5,12330,12333,5,12441,12442,5,42607,42610,5,42612,42621,5,42654,42655,5,42736,42737,5,43010,43010,5,43014,43014,5,43019,43019,5,43045,43046,5,43052,43052,5,43072,43121,3,43122,43122,1,43204,43205,5,43232,43249,5,43263,43263,5,43302,43309,5,43335,43345,5,43392,43394,5,43443,43443,5,43446,43449,5,43452,43453,5,43493,43493,5,43561,43566,5,43569,43570,5,43573,43574,5,43587,43587,5,43596,43596,5,43644,43644,5,43696,43696,5,43698,43700,5,43703,43704,5,43710,43711,5,43713,43713,5,43756,43757,5,43766,43766,5,44005,44005,5,44008,44008,5,44013,44013,5,64286,64286,5,65024,65039,5,65056,65071,5,65279,65279,5,65529,65531,5,66045,66045,5,66272,66272,5,66422,66426,5,68097,68099,5,68101,68102,5,68108,68111,5,68152,68154,5,68159,68159,5,68288,68292,3,68293,68293,2,68295,68295,2,68297,68298,2,68301,68301,1,68302,68306,2,68307,68310,3,68311,68311,1,68312,68316,3,68317,68317,2,68318,68320,3,68321,68321,2,68324,68324,2,68325,68326,5,68331,68334,3,68335,68335,2,68480,68480,3,68481,68481,2,68482,68482,3,68483,68485,2,68486,68488,3,68489,68489,2,68490,68491,3,68492,68492,2,68493,68493,3,68494,68495,2,68496,68496,3,68497,68497,2,68521,68524,2,68525,68526,3,68864,68864,1,68865,68897,3,68898,68898,2,68899,68899,3,68900,68903,5,68969,68973,5,69291,69292,5,69314,69314,2,69315,69316,3,69372,69375,5,69424,69426,3,69427,69427,2,69428,69444,3,69446,69456,5,69457,69459,3,69460,69460,2,69488,69491,3,69492,69493,2,69494,69505,3,69506,69509,5,69552,69552,3,69554,69555,3,69556,69558,2,69560,69560,3,69561,69562,2,69563,69564,3,69565,69565,2,69566,69567,3,69569,69569,3,69570,69571,2,69572,69572,3,69577,69577,2,69578,69578,3,69579,69579,1,69633,69633,5,69688,69702,5,69744,69744,5,69747,69748,5,69759,69761,5,69811,69814,5,69817,69818,5,69826,69826,5,69888,69890,5,69927,69931,5,69933,69940,5,70003,70003,5,70016,70017,5,70070,70078,5,70089,70092,5,70095,70095,5,70191,70193,5,70196,70196,5,70198,70199,5,70206,70206,5,70209,70209,5,70367,70367,5,70371,70378,5,70400,70401,5,70459,70460,5,70464,70464,5,70502,70508,5,70512,70516,5,70587,70592,5,70606,70606,5,70608,70608,5,70610,70610,5,70625,70626,5,70712,70719,5,70722,70724,5,70726,70726,5,70750,70750,5,70835,70840,5,70842,70842,5,70847,70848,5,70850,70851,5,71090,71093,5,71100,71101,5,71103,71104,5,71132,71133,5,71219,71226,5,71229,71229,5,71231,71232,5,71339,71339,5,71341,71341,5,71344,71349,5,71351,71351,5,71453,71453,5,71455,71455,5,71458,71461,5,71463,71467,5,71727,71735,5,71737,71738,5,71995,71996,5,71998,71998,5,72003,72003,5,72148,72151,5,72154,72155,5,72160,72160,5,72193,72202,5,72243,72248,5,72251,72254,5,72263,72263,5,72273,72278,5,72281,72283,5,72330,72342,5,72344,72345,5,72752,72758,5,72760,72765,5,72767,72767,5,72850,72871,5,72874,72880,5,72882,72883,5,72885,72886,5,73009,73014,5,73018,73018,5,73020,73021,5,73023,73029,5,73031,73031,5,73104,73105,5,73109,73109,5,73111,73111,5,73459,73460,5,73472,73473,5,73526,73530,5,73536,73536,5,73538,73538,5,73562,73562,5,78896,78912,5,78919,78933,5,90398,90409,5,90413,90415,5,92912,92916,5,92976,92982,5,94031,94031,5,94095,94098,5,94180,94180,5,113821,113822,5,113824,113827,5,118528,118573,5,118576,118598,5,119143,119145,5,119155,119170,5,119173,119179,5,119210,119213,5,119362,119364,5,121344,121398,5,121403,121452,5,121461,121461,5,121476,121476,5,121499,121503,5,121505,121519,5,122880,122886,5,122888,122904,5,122907,122913,5,122915,122916,5,122918,122922,5,123023,123023,5,123184,123190,5,123566,123566,5,123628,123631,5,124140,124143,5,124398,124399,5,125136,125142,5,125184,125251,3,125252,125259,5,917505,917505,5,917536,917631,5,917760,917999,5],t.t)
B.X=s(["linear"],t.s)
B.ct=s(["heatmap-density"],t.s)
B.c4=s(["interpolate",B.X,B.ct,0,"rgba(0,0,255,0)",0.3,"royalblue",0.6,"lime",1,"red"],t.G)
B.c5=s(["a","b","c"],t.s)
B.B=s([],t.A)
B.c7=s([],t.dY)
B.c6=s([],t.e)
B.U=s([],t.B)
B.ch=s([],t.i9)
B.w=s([],t.r)
B.ci=s([],A.aw("m<rK>"))
B.cj=s([],t.Q)
B.ck=s([],t.q)
B.cd=s([],t.ez)
B.c8=s([],t.lE)
B.cb=s([],t.m1)
B.c9=s([],t.kR)
B.cg=s([],t.s)
B.cf=s([],t.cb)
B.V=s([],t.n5)
B.C=s([],A.aw("m<bt>"))
B.cc=s([],t.bD)
B.ca=s([],t.n)
B.p=s([],t.t)
B.ce=s([],t.b)
B.W=s([],t.J)
B.cl=s([768,788,230,789,789,232,790,793,220,794,794,232,795,795,216,796,800,220,801,802,202,803,806,220,807,808,202,809,819,220,820,824,1,825,828,220,829,836,230,837,837,240,838,838,230,839,841,220,842,844,230,845,846,220,848,850,230,851,854,220,855,855,230,856,856,232,857,858,220,859,859,230,860,860,233,861,862,234,863,863,233,864,865,234,866,866,233,867,879,230,1155,1159,230,1425,1425,220,1426,1429,230,1430,1430,220,1431,1433,230,1434,1434,222,1435,1435,220,1436,1441,230,1442,1447,220,1448,1449,230,1450,1450,220,1451,1452,230,1453,1453,222,1454,1454,228,1455,1455,230,1456,1456,10,1457,1457,11,1458,1458,12,1459,1459,13,1460,1460,14,1461,1461,15,1462,1462,16,1463,1463,17,1464,1464,18,1465,1466,19,1467,1467,20,1468,1468,21,1469,1469,22,1471,1471,23,1473,1473,24,1474,1474,25,1476,1476,230,1477,1477,220,1479,1479,18,1552,1559,230,1560,1560,30,1561,1561,31,1562,1562,32,1611,1611,27,1612,1612,28,1613,1613,29,1614,1614,30,1615,1615,31,1616,1616,32,1617,1617,33,1618,1618,34,1619,1620,230,1621,1622,220,1623,1627,230,1628,1628,220,1629,1630,230,1631,1631,220,1648,1648,35,1750,1756,230,1759,1762,230,1763,1763,220,1764,1764,230,1767,1768,230,1770,1770,220,1771,1772,230,1773,1773,220,1809,1809,36,1840,1840,230,1841,1841,220,1842,1843,230,1844,1844,220,1845,1846,230,1847,1849,220,1850,1850,230,1851,1852,220,1853,1853,230,1854,1854,220,1855,1857,230,1858,1858,220,1859,1859,230,1860,1860,220,1861,1861,230,1862,1862,220,1863,1863,230,1864,1864,220,1865,1866,230,2027,2033,230,2034,2034,220,2035,2035,230,2045,2045,220,2070,2073,230,2075,2083,230,2085,2087,230,2089,2093,230,2137,2139,220,2199,2200,230,2201,2203,220,2204,2207,230,2250,2254,230,2255,2259,220,2260,2273,230,2275,2275,220,2276,2277,230,2278,2278,220,2279,2280,230,2281,2281,220,2282,2284,230,2285,2287,220,2288,2288,27,2289,2289,28,2290,2290,29,2291,2293,230,2294,2294,220,2295,2296,230,2297,2298,220,2299,2303,230,2364,2364,7,2381,2381,9,2385,2385,230,2386,2386,220,2387,2388,230,2492,2492,7,2509,2509,9,2558,2558,230,2620,2620,7,2637,2637,9,2748,2748,7,2765,2765,9,2876,2876,7,2893,2893,9,3021,3021,9,3132,3132,7,3149,3149,9,3157,3157,84,3158,3158,91,3260,3260,7,3277,3277,9,3387,3388,9,3405,3405,9,3530,3530,9,3640,3641,103,3642,3642,9,3656,3659,107,3768,3769,118,3770,3770,9,3784,3787,122,3864,3865,220,3893,3893,220,3895,3895,220,3897,3897,216,3953,3953,129,3954,3954,130,3956,3956,132,3962,3965,130,3968,3968,130,3970,3971,230,3972,3972,9,3974,3975,230,4038,4038,220,4151,4151,7,4153,4154,9,4237,4237,220,4957,4959,230,5908,5909,9,5940,5940,9,6098,6098,9,6109,6109,230,6313,6313,228,6457,6457,222,6458,6458,230,6459,6459,220,6679,6679,230,6680,6680,220,6752,6752,9,6773,6780,230,6783,6783,220,6832,6836,230,6837,6842,220,6843,6844,230,6845,6845,220,6847,6848,220,6849,6850,230,6851,6852,220,6853,6857,230,6858,6858,220,6859,6862,230,6964,6964,7,6980,6980,9,7019,7019,230,7020,7020,220,7021,7027,230,7082,7083,9,7142,7142,7,7154,7155,9,7223,7223,7,7376,7378,230,7380,7380,1,7381,7385,220,7386,7387,230,7388,7391,220,7392,7392,230,7394,7400,1,7405,7405,220,7412,7412,230,7416,7417,230,7616,7617,230,7618,7618,220,7619,7625,230,7626,7626,220,7627,7628,230,7629,7629,234,7630,7630,214,7631,7631,220,7632,7632,202,7633,7669,230,7670,7670,232,7671,7672,228,7673,7673,220,7674,7674,218,7675,7675,230,7676,7676,233,7677,7677,220,7678,7678,230,7679,7679,220,8400,8401,230,8402,8403,1,8404,8407,230,8408,8410,1,8411,8412,230,8417,8417,230,8421,8422,1,8423,8423,230,8424,8424,220,8425,8425,230,8426,8427,1,8428,8431,220,8432,8432,230,11503,11505,230,11647,11647,9,11744,11775,230,12330,12330,218,12331,12331,228,12332,12332,232,12333,12333,222,12334,12335,224,12441,12442,8,42607,42607,230,42612,42621,230,42654,42655,230,42736,42737,230,43014,43014,9,43052,43052,9,43204,43204,9,43232,43249,230,43307,43309,220,43347,43347,9,43443,43443,7,43456,43456,9,43696,43696,230,43698,43699,230,43700,43700,220,43703,43704,230,43710,43711,230,43713,43713,230,43766,43766,9,44013,44013,9,64286,64286,26,65056,65062,230,65063,65069,220,65070,65071,230,66045,66045,220,66272,66272,220,66422,66426,230,68109,68109,220,68111,68111,230,68152,68152,230,68153,68153,1,68154,68154,220,68159,68159,9,68325,68325,230,68326,68326,220,68900,68903,230,68969,68973,230,69291,69292,230,69373,69375,220,69446,69447,220,69448,69450,230,69451,69451,220,69452,69452,230,69453,69456,220,69506,69506,230,69507,69507,220,69508,69508,230,69509,69509,220,69702,69702,9,69744,69744,9,69759,69759,9,69817,69817,9,69818,69818,7,69888,69890,230,69939,69940,9,70003,70003,7,70080,70080,9,70090,70090,7,70197,70197,9,70198,70198,7,70377,70377,7,70378,70378,9,70459,70460,7,70477,70477,9,70502,70508,230,70512,70516,230,70606,70608,9,70722,70722,9,70726,70726,7,70750,70750,230,70850,70850,9,70851,70851,7,71103,71103,9,71104,71104,7,71231,71231,9,71350,71350,9,71351,71351,7,71467,71467,9,71737,71737,9,71738,71738,7,71997,71998,9,72003,72003,7,72160,72160,9,72244,72244,9,72263,72263,9,72345,72345,9,72767,72767,9,73026,73026,7,73028,73029,9,73111,73111,9,73537,73538,9,90415,90415,9,92912,92916,1,92976,92982,230,94192,94193,6,113822,113822,1,119141,119142,216,119143,119145,1,119149,119149,226,119150,119154,216,119163,119170,220,119173,119177,230,119178,119179,220,119210,119213,230,119362,119364,230,122880,122886,230,122888,122904,230,122907,122913,230,122915,122916,230,122918,122922,230,123023,123023,230,123184,123190,230,123566,123566,230,123628,123631,230,124140,124141,232,124142,124142,220,124143,124143,230,124398,124398,230,124399,124399,220,125136,125142,220,125252,125257,230,125258,125258,7],t.t)
B.cm=s(["line-color","line-opacity","line-width","line-gap-width","line-offset"],t.s)
B.D=s(["Unknown","Adlam","Ahom","Anatolian_Hieroglyphs","Arabic","Armenian","Avestan","Balinese","Bamum","Bassa_Vah","Batak","Bengali","Bhaiksuki","Bopomofo","Brahmi","Braille","Buginese","Buhid","Canadian_Aboriginal","Carian","Caucasian_Albanian","Chakma","Cham","Cherokee","Chorasmian","Common","Coptic","Cuneiform","Cypriot","Cypro_Minoan","Cyrillic","Deseret","Devanagari","Dives_Akuru","Dogra","Duployan","Egyptian_Hieroglyphs","Elbasan","Elymaic","Ethiopic","Garay","Georgian","Glagolitic","Gothic","Grantha","Greek","Gujarati","Gunjala_Gondi","Gurmukhi","Gurung_Khema","Han","Hangul","Hanifi_Rohingya","Hanunoo","Hatran","Hebrew","Hiragana","Imperial_Aramaic","Inherited","Inscriptional_Pahlavi","Inscriptional_Parthian","Javanese","Kaithi","Kannada","Katakana","Kawi","Kayah_Li","Kharoshthi","Khitan_Small_Script","Khmer","Khojki","Khudawadi","Kirat_Rai","Lao","Latin","Lepcha","Limbu","Linear_A","Linear_B","Lisu","Lycian","Lydian","Mahajani","Makasar","Malayalam","Mandaic","Manichaean","Marchen","Masaram_Gondi","Medefaidrin","Meetei_Mayek","Mende_Kikakui","Meroitic_Cursive","Meroitic_Hieroglyphs","Miao","Modi","Mongolian","Mro","Multani","Myanmar","Nabataean","Nag_Mundari","Nandinagari","New_Tai_Lue","Newa","Nko","Nushu","Nyiakeng_Puachue_Hmong","Ogham","Ol_Chiki","Ol_Onal","Old_Hungarian","Old_Italic","Old_North_Arabian","Old_Permic","Old_Persian","Old_Sogdian","Old_South_Arabian","Old_Turkic","Old_Uyghur","Oriya","Osage","Osmanya","Pahawh_Hmong","Palmyrene","Pau_Cin_Hau","Phags_Pa","Phoenician","Psalter_Pahlavi","Rejang","Runic","Samaritan","Saurashtra","Sharada","Shavian","Siddham","SignWriting","Sinhala","Sogdian","Sora_Sompeng","Soyombo","Sundanese","Sunuwar","Syloti_Nagri","Syriac","Tagalog","Tagbanwa","Tai_Le","Tai_Tham","Tai_Viet","Takri","Tamil","Tangsa","Tangut","Telugu","Thaana","Thai","Tibetan","Tifinagh","Tirhuta","Todhri","Toto","Tulu_Tigalari","Ugaritic","Vai","Vithkuqi","Wancho","Warang_Citi","Yezidi","Yi","Zanabazar_Square"],t.s)
B.cn=s(["heatmap-weight"],t.s)
B.co=s([0,8,9,9,9,11,10,10,10,11,11,11,12,12,12,13,13,10,14,27,9,28,30,10,31,31,11,32,32,12,33,34,13,35,37,5,38,42,13,43,43,4,44,44,7,45,45,4,46,47,7,48,57,3,58,58,7,59,64,13,91,96,13,123,126,13,127,132,9,133,133,10,134,159,9,160,160,7,161,161,13,162,165,5,166,169,13,171,172,13,173,173,9,174,175,13,176,177,5,178,179,3,180,180,13,182,184,13,185,185,3,187,191,13,215,215,13,247,247,13,697,698,13,706,719,13,722,735,13,741,749,13,751,767,13,768,879,8,884,885,13,894,894,13,900,901,13,903,903,13,1014,1014,13,1155,1161,8,1418,1418,13,1421,1422,13,1423,1423,5,1424,1424,1,1425,1469,8,1470,1470,1,1471,1471,8,1472,1472,1,1473,1474,8,1475,1475,1,1476,1477,8,1478,1478,1,1479,1479,8,1480,1535,1,1536,1541,6,1542,1543,13,1544,1544,2,1545,1546,5,1547,1547,2,1548,1548,7,1549,1549,2,1550,1551,13,1552,1562,8,1563,1610,2,1611,1631,8,1632,1641,6,1642,1642,5,1643,1644,6,1645,1647,2,1648,1648,8,1649,1749,2,1750,1756,8,1757,1757,6,1758,1758,13,1759,1764,8,1765,1766,2,1767,1768,8,1769,1769,13,1770,1773,8,1774,1775,2,1776,1785,3,1786,1808,2,1809,1809,8,1810,1839,2,1840,1866,8,1867,1957,2,1958,1968,8,1969,1983,2,1984,2026,1,2027,2035,8,2036,2037,1,2038,2041,13,2042,2044,1,2045,2045,8,2046,2069,1,2070,2073,8,2074,2074,1,2075,2083,8,2084,2084,1,2085,2087,8,2088,2088,1,2089,2093,8,2094,2136,1,2137,2139,8,2140,2143,1,2144,2191,2,2192,2193,6,2194,2198,2,2199,2207,8,2208,2249,2,2250,2273,8,2274,2274,6,2275,2306,8,2362,2362,8,2364,2364,8,2369,2376,8,2381,2381,8,2385,2391,8,2402,2403,8,2433,2433,8,2492,2492,8,2497,2500,8,2509,2509,8,2530,2531,8,2546,2547,5,2555,2555,5,2558,2558,8,2561,2562,8,2620,2620,8,2625,2626,8,2631,2632,8,2635,2637,8,2641,2641,8,2672,2673,8,2677,2677,8,2689,2690,8,2748,2748,8,2753,2757,8,2759,2760,8,2765,2765,8,2786,2787,8,2801,2801,5,2810,2815,8,2817,2817,8,2876,2876,8,2879,2879,8,2881,2884,8,2893,2893,8,2901,2902,8,2914,2915,8,2946,2946,8,3008,3008,8,3021,3021,8,3059,3064,13,3065,3065,5,3066,3066,13,3072,3072,8,3076,3076,8,3132,3132,8,3134,3136,8,3142,3144,8,3146,3149,8,3157,3158,8,3170,3171,8,3192,3198,13,3201,3201,8,3260,3260,8,3276,3277,8,3298,3299,8,3328,3329,8,3387,3388,8,3393,3396,8,3405,3405,8,3426,3427,8,3457,3457,8,3530,3530,8,3538,3540,8,3542,3542,8,3633,3633,8,3636,3642,8,3647,3647,5,3655,3662,8,3761,3761,8,3764,3772,8,3784,3790,8,3864,3865,8,3893,3893,8,3895,3895,8,3897,3897,8,3898,3901,13,3953,3966,8,3968,3972,8,3974,3975,8,3981,3991,8,3993,4028,8,4038,4038,8,4141,4144,8,4146,4151,8,4153,4154,8,4157,4158,8,4184,4185,8,4190,4192,8,4209,4212,8,4226,4226,8,4229,4230,8,4237,4237,8,4253,4253,8,4957,4959,8,5008,5017,13,5120,5120,13,5760,5760,12,5787,5788,13,5906,5908,8,5938,5939,8,5970,5971,8,6002,6003,8,6068,6069,8,6071,6077,8,6086,6086,8,6089,6099,8,6107,6107,5,6109,6109,8,6128,6137,13,6144,6154,13,6155,6157,8,6158,6158,9,6159,6159,8,6277,6278,8,6313,6313,8,6432,6434,8,6439,6440,8,6450,6450,8,6457,6459,8,6464,6464,13,6468,6469,13,6622,6655,13,6679,6680,8,6683,6683,8,6742,6742,8,6744,6750,8,6752,6752,8,6754,6754,8,6757,6764,8,6771,6780,8,6783,6783,8,6832,6862,8,6912,6915,8,6964,6964,8,6966,6970,8,6972,6972,8,6978,6978,8,7019,7027,8,7040,7041,8,7074,7077,8,7080,7081,8,7083,7085,8,7142,7142,8,7144,7145,8,7149,7149,8,7151,7153,8,7212,7219,8,7222,7223,8,7376,7378,8,7380,7392,8,7394,7400,8,7405,7405,8,7412,7412,8,7416,7417,8,7616,7679,8,8125,8125,13,8127,8129,13,8141,8143,13,8157,8159,13,8173,8175,13,8189,8190,13,8192,8202,12,8203,8205,9,8207,8207,1,8208,8231,13,8232,8232,12,8233,8233,10,8234,8234,14,8235,8235,15,8236,8236,18,8237,8237,16,8238,8238,17,8239,8239,7,8240,8244,5,8245,8259,13,8260,8260,7,8261,8286,13,8287,8287,12,8288,8292,9,8294,8294,19,8295,8295,20,8296,8296,21,8297,8297,22,8298,8303,9,8304,8304,3,8308,8313,3,8314,8315,4,8316,8318,13,8320,8329,3,8330,8331,4,8332,8334,13,8352,8399,5,8400,8432,8,8448,8449,13,8451,8454,13,8456,8457,13,8468,8468,13,8470,8472,13,8478,8483,13,8485,8485,13,8487,8487,13,8489,8489,13,8494,8494,5,8506,8507,13,8512,8516,13,8522,8525,13,8528,8543,13,8585,8587,13,8592,8721,13,8722,8722,4,8723,8723,5,8724,9013,13,9083,9108,13,9110,9257,13,9280,9290,13,9312,9351,13,9352,9371,3,9450,9899,13,9901,10239,13,10496,11123,13,11126,11157,13,11159,11263,13,11493,11498,13,11503,11505,8,11513,11519,13,11647,11647,8,11744,11775,8,11776,11869,13,11904,11929,13,11931,12019,13,12032,12245,13,12272,12287,13,12288,12288,12,12289,12292,13,12296,12320,13,12330,12333,8,12336,12336,13,12342,12343,13,12349,12351,13,12441,12442,8,12443,12444,13,12448,12448,13,12539,12539,13,12736,12773,13,12783,12783,13,12829,12830,13,12880,12895,13,12924,12926,13,12977,12991,13,13004,13007,13,13175,13178,13,13278,13279,13,13311,13311,13,19904,19967,13,42128,42182,13,42509,42511,13,42607,42610,8,42611,42611,13,42612,42621,8,42622,42623,13,42654,42655,8,42736,42737,8,42752,42785,13,42888,42888,13,43010,43010,8,43014,43014,8,43019,43019,8,43045,43046,8,43048,43051,13,43052,43052,8,43064,43065,5,43124,43127,13,43204,43205,8,43232,43249,8,43263,43263,8,43302,43309,8,43335,43345,8,43392,43394,8,43443,43443,8,43446,43449,8,43452,43453,8,43493,43493,8,43561,43566,8,43569,43570,8,43573,43574,8,43587,43587,8,43596,43596,8,43644,43644,8,43696,43696,8,43698,43700,8,43703,43704,8,43710,43711,8,43713,43713,8,43756,43757,8,43766,43766,8,43882,43883,13,44005,44005,8,44008,44008,8,44013,44013,8,64285,64285,1,64286,64286,8,64287,64296,1,64297,64297,4,64298,64335,1,64336,64829,2,64830,64847,13,64848,64974,2,64975,64975,13,65008,65020,2,65021,65023,13,65024,65039,8,65040,65049,13,65056,65071,8,65072,65103,13,65104,65104,7,65105,65105,13,65106,65106,7,65108,65108,13,65109,65109,7,65110,65118,13,65119,65119,5,65120,65121,13,65122,65123,4,65124,65126,13,65128,65128,13,65129,65130,5,65131,65131,13,65136,65278,2,65279,65279,9,65281,65282,13,65283,65285,5,65286,65290,13,65291,65291,4,65292,65292,7,65293,65293,4,65294,65295,7,65296,65305,3,65306,65306,7,65307,65312,13,65339,65344,13,65371,65381,13,65504,65505,5,65506,65508,13,65509,65510,5,65512,65518,13,65529,65533,13,65793,65793,13,65856,65932,13,65936,65948,13,65952,65952,13,66045,66045,8,66272,66272,8,66273,66299,3,66422,66426,8,67584,67870,1,67871,67871,13,67872,68096,1,68097,68099,8,68100,68100,1,68101,68102,8,68103,68107,1,68108,68111,8,68112,68151,1,68152,68154,8,68155,68158,1,68159,68159,8,68160,68324,1,68325,68326,8,68327,68408,1,68409,68415,13,68416,68863,1,68864,68899,2,68900,68903,8,68904,68911,2,68912,68921,6,68922,68927,2,68928,68937,6,68938,68968,1,68969,68973,8,68974,68974,13,68975,69215,1,69216,69246,6,69247,69290,1,69291,69292,8,69293,69311,1,69312,69371,2,69372,69375,8,69376,69423,1,69424,69445,2,69446,69456,8,69457,69487,2,69488,69505,1,69506,69509,8,69510,69631,1,69633,69633,8,69688,69702,8,69714,69733,13,69744,69744,8,69747,69748,8,69759,69761,8,69811,69814,8,69817,69818,8,69826,69826,8,69888,69890,8,69927,69931,8,69933,69940,8,70003,70003,8,70016,70017,8,70070,70078,8,70089,70092,8,70095,70095,8,70191,70193,8,70196,70196,8,70198,70199,8,70206,70206,8,70209,70209,8,70367,70367,8,70371,70378,8,70400,70401,8,70459,70460,8,70464,70464,8,70502,70508,8,70512,70516,8,70587,70592,8,70606,70606,8,70608,70608,8,70610,70610,8,70625,70626,8,70712,70719,8,70722,70724,8,70726,70726,8,70750,70750,8,70835,70840,8,70842,70842,8,70847,70848,8,70850,70851,8,71090,71093,8,71100,71101,8,71103,71104,8,71132,71133,8,71219,71226,8,71229,71229,8,71231,71232,8,71264,71276,13,71339,71339,8,71341,71341,8,71344,71349,8,71351,71351,8,71453,71453,8,71455,71455,8,71458,71461,8,71463,71467,8,71727,71735,8,71737,71738,8,71995,71996,8,71998,71998,8,72003,72003,8,72148,72151,8,72154,72155,8,72160,72160,8,72193,72198,8,72201,72202,8,72243,72248,8,72251,72254,8,72263,72263,8,72273,72278,8,72281,72283,8,72330,72342,8,72344,72345,8,72752,72758,8,72760,72765,8,72850,72871,8,72874,72880,8,72882,72883,8,72885,72886,8,73009,73014,8,73018,73018,8,73020,73021,8,73023,73029,8,73031,73031,8,73104,73105,8,73109,73109,8,73111,73111,8,73459,73460,8,73472,73473,8,73526,73530,8,73536,73536,8,73538,73538,8,73562,73562,8,73685,73692,13,73693,73696,5,73697,73713,13,78912,78912,8,78919,78933,8,90398,90409,8,90413,90415,8,92912,92916,8,92976,92982,8,94031,94031,8,94095,94098,8,94178,94178,13,94180,94180,8,113821,113822,8,113824,113827,9,117760,117973,13,118e3,118009,3,118016,118451,13,118528,118573,8,118576,118598,8,119143,119145,8,119155,119162,9,119163,119170,8,119173,119179,8,119210,119213,8,119273,119274,13,119296,119361,13,119362,119364,8,119365,119365,13,119552,119638,13,120513,120513,13,120539,120539,13,120571,120571,13,120597,120597,13,120629,120629,13,120655,120655,13,120687,120687,13,120713,120713,13,120745,120745,13,120771,120771,13,120782,120831,3,121344,121398,8,121403,121452,8,121461,121461,8,121476,121476,8,121499,121503,8,121505,121519,8,122880,122886,8,122888,122904,8,122907,122913,8,122915,122916,8,122918,122922,8,123023,123023,8,123184,123190,8,123566,123566,8,123628,123631,8,123647,123647,5,124140,124143,8,124398,124399,8,124928,125135,1,125136,125142,8,125143,125251,1,125252,125258,8,125259,126063,1,126064,126143,2,126144,126207,1,126208,126287,2,126288,126463,1,126464,126703,2,126704,126705,13,126706,126719,2,126720,126975,1,126976,127019,13,127024,127123,13,127136,127150,13,127153,127167,13,127169,127183,13,127185,127221,13,127232,127242,3,127243,127247,13,127279,127279,13,127338,127343,13,127405,127405,13,127584,127589,13,127744,128727,13,128732,128748,13,128752,128764,13,128768,128886,13,128891,128985,13,128992,129003,13,129008,129008,13,129024,129035,13,129040,129095,13,129104,129113,13,129120,129159,13,129168,129197,13,129200,129211,13,129216,129217,13,129280,129619,13,129632,129645,13,129648,129660,13,129664,129673,13,129679,129734,13,129742,129756,13,129759,129769,13,129776,129784,13,129792,129938,13,129940,130031,13,130032,130041,3,917505,917505,9,917536,917631,9,917760,917999,8],t.t)
B.cp=s([1667329140,1668049255,1668641395,1684632436,1801810542,1818847073,1919118452],t.t)
B.cq=s(["fill-outline-color","fill-opacity"],t.s)
B.cr=s([40,40,165,41,41,162,91,91,373,93,93,366,123,123,501,125,125,494,3898,3898,15597,3899,3899,15594,3900,3900,15605,3901,3901,15602,5787,5787,23153,5788,5788,23150,8261,8261,33049,8262,8262,33046,8317,8317,33273,8318,8318,33270,8333,8333,33337,8334,8334,33334,8968,8968,35877,8969,8969,35874,8970,8970,35885,8971,8971,35882,9001,9001,36009,9002,9002,36006,10088,10088,40357,10089,10089,40354,10090,10090,40365,10091,10091,40362,10092,10092,40373,10093,10093,40370,10094,10094,40381,10095,10095,40378,10096,10096,40389,10097,10097,40386,10098,10098,40397,10099,10099,40394,10100,10100,40405,10101,10101,40402,10181,10181,40729,10182,10182,40726,10214,10214,40861,10215,10215,40858,10216,10216,40869,10217,10217,40866,10218,10218,40877,10219,10219,40874,10220,10220,40885,10221,10221,40882,10222,10222,40893,10223,10223,40890,10627,10627,42513,10628,10628,42510,10629,10629,42521,10630,10630,42518,10631,10631,42529,10632,10632,42526,10633,10633,42537,10634,10634,42534,10635,10635,42545,10636,10636,42542,10637,10637,42561,10638,10638,42558,10639,10639,42553,10640,10640,42550,10641,10641,42569,10642,10642,42566,10643,10643,42577,10644,10644,42574,10645,10645,42585,10646,10646,42582,10647,10647,42593,10648,10648,42590,10712,10712,42853,10713,10713,42850,10714,10714,42861,10715,10715,42858,10748,10748,42997,10749,10749,42994,11810,11810,47245,11811,11811,47242,11812,11812,47253,11813,11813,47250,11814,11814,47261,11815,11815,47258,11816,11816,47269,11817,11817,47266,11861,11861,47449,11862,11862,47446,11863,11863,47457,11864,11864,47454,11865,11865,47465,11866,11866,47462,11867,11867,47473,11868,11868,47470,12296,12296,49189,12297,12297,49186,12298,12298,49197,12299,12299,49194,12300,12300,49205,12301,12301,49202,12302,12302,49213,12303,12303,49210,12304,12304,49221,12305,12305,49218,12308,12308,49237,12309,12309,49234,12310,12310,49245,12311,12311,49242,12312,12312,49253,12313,12313,49250,12314,12314,49261,12315,12315,49258,65113,65113,260457,65114,65114,260454,65115,65115,260465,65116,65116,260462,65117,65117,260473,65118,65118,260470,65288,65288,261157,65289,65289,261154,65339,65339,261365,65341,65341,261358,65371,65371,261493,65373,65373,261486,65375,65375,261505,65376,65376,261502,65378,65378,261517,65379,65379,261514],t.t)
B.cs=s([0,1,2,0,2,3],t.t)
B.cu=s([0,47,6,48,57,4,58,172,6,173,173,5,174,767,6,768,879,1,880,887,6,890,895,6,900,906,6,908,908,6,910,929,6,931,1154,6,1155,1159,1,1160,1161,3,1162,1327,6,1329,1366,6,1369,1418,6,1421,1423,6,1425,1469,1,1470,1470,6,1471,1471,1,1472,1472,6,1473,1474,1,1475,1475,6,1476,1477,1,1478,1478,6,1479,1479,1,1488,1514,6,1519,1524,6,1536,1541,5,1542,1551,6,1552,1562,1,1563,1563,6,1564,1564,5,1565,1610,6,1611,1631,1,1632,1641,4,1642,1647,6,1648,1648,1,1649,1749,6,1750,1756,1,1757,1757,5,1758,1758,6,1759,1764,1,1765,1766,6,1767,1768,1,1769,1769,6,1770,1773,1,1774,1775,6,1776,1785,4,1786,1805,6,1807,1807,5,1808,1808,6,1809,1809,1,1810,1839,6,1840,1866,1,1869,1957,6,1958,1968,1,1969,1969,6,1984,1993,4,1994,2026,6,2027,2035,1,2036,2042,6,2045,2045,1,2046,2069,6,2070,2073,1,2074,2074,6,2075,2083,1,2084,2084,6,2085,2087,1,2088,2088,6,2089,2093,1,2096,2110,6,2112,2136,6,2137,2139,1,2142,2142,6,2144,2154,6,2160,2190,6,2192,2193,5,2199,2207,1,2208,2249,6,2250,2273,1,2274,2274,5,2275,2306,1,2307,2307,2,2308,2361,6,2362,2362,1,2363,2363,2,2364,2364,1,2365,2365,6,2366,2368,2,2369,2376,1,2377,2380,2,2381,2381,1,2382,2383,2,2384,2384,6,2385,2391,1,2392,2401,6,2402,2403,1,2404,2405,6,2406,2415,4,2416,2432,6,2433,2433,1,2434,2435,2,2437,2444,6,2447,2448,6,2451,2472,6,2474,2480,6,2482,2482,6,2486,2489,6,2492,2492,1,2493,2493,6,2494,2496,2,2497,2500,1,2503,2504,2,2507,2508,2,2509,2509,1,2510,2510,6,2519,2519,2,2524,2525,6,2527,2529,6,2530,2531,1,2534,2543,4,2544,2557,6,2558,2558,1,2561,2562,1,2563,2563,2,2565,2570,6,2575,2576,6,2579,2600,6,2602,2608,6,2610,2611,6,2613,2614,6,2616,2617,6,2620,2620,1,2622,2624,2,2625,2626,1,2631,2632,1,2635,2637,1,2641,2641,1,2649,2652,6,2654,2654,6,2662,2671,4,2672,2673,1,2674,2676,6,2677,2677,1,2678,2678,6,2689,2690,1,2691,2691,2,2693,2701,6,2703,2705,6,2707,2728,6,2730,2736,6,2738,2739,6,2741,2745,6,2748,2748,1,2749,2749,6,2750,2752,2,2753,2757,1,2759,2760,1,2761,2761,2,2763,2764,2,2765,2765,1,2768,2768,6,2784,2785,6,2786,2787,1,2790,2799,4,2800,2801,6,2809,2809,6,2810,2815,1,2817,2817,1,2818,2819,2,2821,2828,6,2831,2832,6,2835,2856,6,2858,2864,6,2866,2867,6,2869,2873,6,2876,2876,1,2877,2877,6,2878,2878,2,2879,2879,1,2880,2880,2,2881,2884,1,2887,2888,2,2891,2892,2,2893,2893,1,2901,2902,1,2903,2903,2,2908,2909,6,2911,2913,6,2914,2915,1,2918,2927,4,2928,2935,6,2946,2946,1,2947,2947,6,2949,2954,6,2958,2960,6,2962,2965,6,2969,2970,6,2972,2972,6,2974,2975,6,2979,2980,6,2984,2986,6,2990,3001,6,3006,3007,2,3008,3008,1,3009,3010,2,3014,3016,2,3018,3020,2,3021,3021,1,3024,3024,6,3031,3031,2,3046,3055,4,3056,3066,6,3072,3072,1,3073,3075,2,3076,3076,1,3077,3084,6,3086,3088,6,3090,3112,6,3114,3129,6,3132,3132,1,3133,3133,6,3134,3136,1,3137,3140,2,3142,3144,1,3146,3149,1,3157,3158,1,3160,3162,6,3165,3165,6,3168,3169,6,3170,3171,1,3174,3183,4,3191,3200,6,3201,3201,1,3202,3203,2,3204,3212,6,3214,3216,6,3218,3240,6,3242,3251,6,3253,3257,6,3260,3260,1,3261,3261,6,3262,3262,2,3263,3263,1,3264,3268,2,3270,3270,1,3271,3272,2,3274,3275,2,3276,3277,1,3285,3286,2,3293,3294,6,3296,3297,6,3298,3299,1,3302,3311,4,3313,3314,6,3315,3315,2,3328,3329,1,3330,3331,2,3332,3340,6,3342,3344,6,3346,3386,6,3387,3388,1,3389,3389,6,3390,3392,2,3393,3396,1,3398,3400,2,3402,3404,2,3405,3405,1,3406,3407,6,3412,3414,6,3415,3415,2,3416,3425,6,3426,3427,1,3430,3439,4,3440,3455,6,3457,3457,1,3458,3459,2,3461,3478,6,3482,3505,6,3507,3515,6,3517,3517,6,3520,3526,6,3530,3530,1,3535,3537,2,3538,3540,1,3542,3542,1,3544,3551,2,3558,3567,4,3570,3571,2,3572,3572,6,3585,3632,6,3633,3633,1,3634,3635,6,3636,3642,1,3647,3654,6,3655,3662,1,3663,3663,6,3664,3673,4,3674,3675,6,3713,3714,6,3716,3716,6,3718,3722,6,3724,3747,6,3749,3749,6,3751,3760,6,3761,3761,1,3762,3763,6,3764,3772,1,3773,3773,6,3776,3780,6,3782,3782,6,3784,3790,1,3792,3801,4,3804,3807,6,3840,3863,6,3864,3865,1,3866,3871,6,3872,3881,4,3882,3892,6,3893,3893,1,3894,3894,6,3895,3895,1,3896,3896,6,3897,3897,1,3898,3901,6,3902,3903,2,3904,3911,6,3913,3948,6,3953,3966,1,3967,3967,2,3968,3972,1,3973,3973,6,3974,3975,1,3976,3980,6,3981,3991,1,3993,4028,1,4030,4037,6,4038,4038,1,4039,4044,6,4046,4058,6,4096,4138,6,4139,4140,2,4141,4144,1,4145,4145,2,4146,4151,1,4152,4152,2,4153,4154,1,4155,4156,2,4157,4158,1,4159,4159,6,4160,4169,4,4170,4181,6,4182,4183,2,4184,4185,1,4186,4189,6,4190,4192,1,4193,4193,6,4194,4196,2,4197,4198,6,4199,4205,2,4206,4208,6,4209,4212,1,4213,4225,6,4226,4226,1,4227,4228,2,4229,4230,1,4231,4236,2,4237,4237,1,4238,4238,6,4239,4239,2,4240,4249,4,4250,4252,2,4253,4253,1,4254,4293,6,4295,4295,6,4301,4301,6,4304,4680,6,4682,4685,6,4688,4694,6,4696,4696,6,4698,4701,6,4704,4744,6,4746,4749,6,4752,4784,6,4786,4789,6,4792,4798,6,4800,4800,6,4802,4805,6,4808,4822,6,4824,4880,6,4882,4885,6,4888,4954,6,4957,4959,1,4960,4988,6,4992,5017,6,5024,5109,6,5112,5117,6,5120,5788,6,5792,5880,6,5888,5905,6,5906,5908,1,5909,5909,2,5919,5937,6,5938,5939,1,5940,5940,2,5941,5942,6,5952,5969,6,5970,5971,1,5984,5996,6,5998,6000,6,6002,6003,1,6016,6067,6,6068,6069,1,6070,6070,2,6071,6077,1,6078,6085,2,6086,6086,1,6087,6088,2,6089,6099,1,6100,6108,6,6109,6109,1,6112,6121,4,6128,6137,6,6144,6154,6,6155,6157,1,6158,6158,5,6159,6159,1,6160,6169,4,6176,6264,6,6272,6276,6,6277,6278,1,6279,6312,6,6313,6313,1,6314,6314,6,6320,6389,6,6400,6430,6,6432,6434,1,6435,6438,2,6439,6440,1,6441,6443,2,6448,6449,2,6450,6450,1,6451,6456,2,6457,6459,1,6464,6464,6,6468,6469,6,6470,6479,4,6480,6509,6,6512,6516,6,6528,6571,6,6576,6601,6,6608,6617,4,6618,6618,6,6622,6678,6,6679,6680,1,6681,6682,2,6683,6683,1,6686,6740,6,6741,6741,2,6742,6742,1,6743,6743,2,6744,6750,1,6752,6752,1,6753,6753,2,6754,6754,1,6755,6756,2,6757,6764,1,6765,6770,2,6771,6780,1,6783,6783,1,6784,6793,4,6800,6809,4,6816,6829,6,6832,6845,1,6846,6846,3,6847,6862,1,6912,6915,1,6916,6916,2,6917,6963,6,6964,6964,1,6965,6965,2,6966,6970,1,6971,6971,2,6972,6972,1,6973,6977,2,6978,6978,1,6979,6980,2,6981,6988,6,6990,6991,6,6992,7001,4,7002,7018,6,7019,7027,1,7028,7039,6,7040,7041,1,7042,7042,2,7043,7072,6,7073,7073,2,7074,7077,1,7078,7079,2,7080,7081,1,7082,7082,2,7083,7085,1,7086,7087,6,7088,7097,4,7098,7141,6,7142,7142,1,7143,7143,2,7144,7145,1,7146,7148,2,7149,7149,1,7150,7150,2,7151,7153,1,7154,7155,2,7164,7203,6,7204,7211,2,7212,7219,1,7220,7221,2,7222,7223,1,7227,7231,6,7232,7241,4,7245,7247,6,7248,7257,4,7258,7306,6,7312,7354,6,7357,7367,6,7376,7378,1,7379,7379,6,7380,7392,1,7393,7393,2,7394,7400,1,7401,7404,6,7405,7405,1,7406,7411,6,7412,7412,1,7413,7414,6,7415,7415,2,7416,7417,1,7418,7418,6,7424,7615,6,7616,7679,1,7680,7957,6,7960,7965,6,7968,8005,6,8008,8013,6,8016,8023,6,8025,8025,6,8027,8027,6,8029,8029,6,8031,8061,6,8064,8116,6,8118,8132,6,8134,8147,6,8150,8155,6,8157,8175,6,8178,8180,6,8182,8190,6,8192,8202,6,8203,8207,5,8208,8233,6,8234,8238,5,8239,8287,6,8288,8292,5,8294,8303,5,8304,8305,6,8308,8334,6,8336,8348,6,8352,8384,6,8400,8412,1,8413,8416,3,8417,8417,1,8418,8420,3,8421,8432,1,8448,8587,6,8592,9257,6,9280,9290,6,9312,11123,6,11126,11157,6,11159,11502,6,11503,11505,1,11506,11507,6,11513,11557,6,11559,11559,6,11565,11565,6,11568,11623,6,11631,11632,6,11647,11647,1,11648,11670,6,11680,11686,6,11688,11694,6,11696,11702,6,11704,11710,6,11712,11718,6,11720,11726,6,11728,11734,6,11736,11742,6,11744,11775,1,11776,11869,6,11904,11929,6,11931,12019,6,12032,12245,6,12272,12329,6,12330,12333,1,12334,12335,2,12336,12351,6,12353,12438,6,12441,12442,1,12443,12543,6,12549,12591,6,12593,12686,6,12688,12773,6,12783,12830,6,12832,42124,6,42128,42182,6,42192,42527,6,42528,42537,4,42538,42539,6,42560,42606,6,42607,42607,1,42608,42610,3,42611,42611,6,42612,42621,1,42622,42653,6,42654,42655,1,42656,42735,6,42736,42737,1,42738,42743,6,42752,42957,6,42960,42961,6,42963,42963,6,42965,42972,6,42994,43009,6,43010,43010,1,43011,43013,6,43014,43014,1,43015,43018,6,43019,43019,1,43020,43042,6,43043,43044,2,43045,43046,1,43047,43047,2,43048,43051,6,43052,43052,1,43056,43065,6,43072,43127,6,43136,43137,2,43138,43187,6,43188,43203,2,43204,43205,1,43214,43215,6,43216,43225,4,43232,43249,1,43250,43262,6,43263,43263,1,43264,43273,4,43274,43301,6,43302,43309,1,43310,43334,6,43335,43345,1,43346,43347,2,43359,43388,6,43392,43394,1,43395,43395,2,43396,43442,6,43443,43443,1,43444,43445,2,43446,43449,1,43450,43451,2,43452,43453,1,43454,43456,2,43457,43469,6,43471,43471,6,43472,43481,4,43486,43492,6,43493,43493,1,43494,43503,6,43504,43513,4,43514,43518,6,43520,43560,6,43561,43566,1,43567,43568,2,43569,43570,1,43571,43572,2,43573,43574,1,43584,43586,6,43587,43587,1,43588,43595,6,43596,43596,1,43597,43597,2,43600,43609,4,43612,43642,6,43643,43643,2,43644,43644,1,43645,43645,2,43646,43695,6,43696,43696,1,43697,43697,6,43698,43700,1,43701,43702,6,43703,43704,1,43705,43709,6,43710,43711,1,43712,43712,6,43713,43713,1,43714,43714,6,43739,43754,6,43755,43755,2,43756,43757,1,43758,43759,2,43760,43764,6,43765,43765,2,43766,43766,1,43777,43782,6,43785,43790,6,43793,43798,6,43808,43814,6,43816,43822,6,43824,43883,6,43888,44002,6,44003,44004,2,44005,44005,1,44006,44007,2,44008,44008,1,44009,44010,2,44011,44011,6,44012,44012,2,44013,44013,1,44016,44025,4,44032,55203,6,55216,55238,6,55243,55291,6,55296,64109,6,64112,64217,6,64256,64262,6,64275,64279,6,64285,64285,6,64286,64286,1,64287,64310,6,64312,64316,6,64318,64318,6,64320,64321,6,64323,64324,6,64326,64450,6,64467,64911,6,64914,64967,6,64975,64975,6,65008,65023,6,65024,65039,1,65040,65049,6,65056,65071,1,65072,65106,6,65108,65126,6,65128,65131,6,65136,65140,6,65142,65276,6,65279,65279,5,65281,65295,6,65296,65305,4,65306,65470,6,65474,65479,6,65482,65487,6,65490,65495,6,65498,65500,6,65504,65510,6,65512,65518,6,65529,65531,5,65532,65533,6,65536,65547,6,65549,65574,6,65576,65594,6,65596,65597,6,65599,65613,6,65616,65629,6,65664,65786,6,65792,65794,6,65799,65843,6,65847,65934,6,65936,65948,6,65952,65952,6,66e3,66044,6,66045,66045,1,66176,66204,6,66208,66256,6,66272,66272,1,66273,66299,6,66304,66339,6,66349,66378,6,66384,66421,6,66422,66426,1,66432,66461,6,66463,66499,6,66504,66517,6,66560,66717,6,66720,66729,4,66736,66771,6,66776,66811,6,66816,66855,6,66864,66915,6,66927,66938,6,66940,66954,6,66956,66962,6,66964,66965,6,66967,66977,6,66979,66993,6,66995,67001,6,67003,67004,6,67008,67059,6,67072,67382,6,67392,67413,6,67424,67431,6,67456,67461,6,67463,67504,6,67506,67514,6,67584,67589,6,67592,67592,6,67594,67637,6,67639,67640,6,67644,67644,6,67647,67669,6,67671,67742,6,67751,67759,6,67808,67826,6,67828,67829,6,67835,67867,6,67871,67897,6,67903,67903,6,67968,68023,6,68028,68047,6,68050,68096,6,68097,68099,1,68101,68102,1,68108,68111,1,68112,68115,6,68117,68119,6,68121,68149,6,68152,68154,1,68159,68159,1,68160,68168,6,68176,68184,6,68192,68255,6,68288,68324,6,68325,68326,1,68331,68342,6,68352,68405,6,68409,68437,6,68440,68466,6,68472,68497,6,68505,68508,6,68521,68527,6,68608,68680,6,68736,68786,6,68800,68850,6,68858,68899,6,68900,68903,1,68912,68921,4,68928,68937,4,68938,68965,6,68969,68973,1,68974,68997,6,69006,69007,6,69216,69246,6,69248,69289,6,69291,69292,1,69293,69293,6,69296,69297,6,69314,69316,6,69372,69375,1,69376,69415,6,69424,69445,6,69446,69456,1,69457,69465,6,69488,69505,6,69506,69509,1,69510,69513,6,69552,69579,6,69600,69622,6,69632,69632,2,69633,69633,1,69634,69634,2,69635,69687,6,69688,69702,1,69703,69709,6,69714,69733,6,69734,69743,4,69744,69744,1,69745,69746,6,69747,69748,1,69749,69749,6,69759,69761,1,69762,69762,2,69763,69807,6,69808,69810,2,69811,69814,1,69815,69816,2,69817,69818,1,69819,69820,6,69821,69821,5,69822,69825,6,69826,69826,1,69837,69837,5,69840,69864,6,69872,69881,4,69888,69890,1,69891,69926,6,69927,69931,1,69932,69932,2,69933,69940,1,69942,69951,4,69952,69956,6,69957,69958,2,69959,69959,6,69968,70002,6,70003,70003,1,70004,70006,6,70016,70017,1,70018,70018,2,70019,70066,6,70067,70069,2,70070,70078,1,70079,70080,2,70081,70088,6,70089,70092,1,70093,70093,6,70094,70094,2,70095,70095,1,70096,70105,4,70106,70111,6,70113,70132,6,70144,70161,6,70163,70187,6,70188,70190,2,70191,70193,1,70194,70195,2,70196,70196,1,70197,70197,2,70198,70199,1,70200,70205,6,70206,70206,1,70207,70208,6,70209,70209,1,70272,70278,6,70280,70280,6,70282,70285,6,70287,70301,6,70303,70313,6,70320,70366,6,70367,70367,1,70368,70370,2,70371,70378,1,70384,70393,4,70400,70401,1,70402,70403,2,70405,70412,6,70415,70416,6,70419,70440,6,70442,70448,6,70450,70451,6,70453,70457,6,70459,70460,1,70461,70461,6,70462,70463,2,70464,70464,1,70465,70468,2,70471,70472,2,70475,70477,2,70480,70480,6,70487,70487,2,70493,70497,6,70498,70499,2,70502,70508,1,70512,70516,1,70528,70537,6,70539,70539,6,70542,70542,6,70544,70581,6,70583,70583,6,70584,70586,2,70587,70592,1,70594,70594,2,70597,70597,2,70599,70602,2,70604,70605,2,70606,70606,1,70607,70607,2,70608,70608,1,70609,70609,6,70610,70610,1,70611,70613,6,70615,70616,6,70625,70626,1,70656,70708,6,70709,70711,2,70712,70719,1,70720,70721,2,70722,70724,1,70725,70725,2,70726,70726,1,70727,70735,6,70736,70745,4,70746,70747,6,70749,70749,6,70750,70750,1,70751,70753,6,70784,70831,6,70832,70834,2,70835,70840,1,70841,70841,2,70842,70842,1,70843,70846,2,70847,70848,1,70849,70849,2,70850,70851,1,70852,70855,6,70864,70873,4,71040,71086,6,71087,71089,2,71090,71093,1,71096,71099,2,71100,71101,1,71102,71102,2,71103,71104,1,71105,71131,6,71132,71133,1,71168,71215,6,71216,71218,2,71219,71226,1,71227,71228,2,71229,71229,1,71230,71230,2,71231,71232,1,71233,71236,6,71248,71257,4,71264,71276,6,71296,71338,6,71339,71339,1,71340,71340,2,71341,71341,1,71342,71343,2,71344,71349,1,71350,71350,2,71351,71351,1,71352,71353,6,71360,71369,4,71376,71395,4,71424,71450,6,71453,71453,1,71454,71454,2,71455,71455,1,71456,71457,2,71458,71461,1,71462,71462,2,71463,71467,1,71472,71481,4,71482,71494,6,71680,71723,6,71724,71726,2,71727,71735,1,71736,71736,2,71737,71738,1,71739,71739,6,71840,71903,6,71904,71913,4,71914,71922,6,71935,71942,6,71945,71945,6,71948,71955,6,71957,71958,6,71960,71983,6,71984,71989,2,71991,71992,2,71995,71996,1,71997,71997,2,71998,71998,1,71999,71999,6,72e3,72e3,2,72001,72001,6,72002,72002,2,72003,72003,1,72004,72006,6,72016,72025,4,72096,72103,6,72106,72144,6,72145,72147,2,72148,72151,1,72154,72155,1,72156,72159,2,72160,72160,1,72161,72163,6,72164,72164,2,72192,72192,6,72193,72202,1,72203,72242,6,72243,72248,1,72249,72249,2,72250,72250,6,72251,72254,1,72255,72262,6,72263,72263,1,72272,72272,6,72273,72278,1,72279,72280,2,72281,72283,1,72284,72329,6,72330,72342,1,72343,72343,2,72344,72345,1,72346,72354,6,72368,72440,6,72448,72457,6,72640,72673,6,72688,72697,4,72704,72712,6,72714,72750,6,72751,72751,2,72752,72758,1,72760,72765,1,72766,72766,2,72767,72767,1,72768,72773,6,72784,72793,4,72794,72812,6,72816,72847,6,72850,72871,1,72873,72873,2,72874,72880,1,72881,72881,2,72882,72883,1,72884,72884,2,72885,72886,1,72960,72966,6,72968,72969,6,72971,73008,6,73009,73014,1,73018,73018,1,73020,73021,1,73023,73029,1,73030,73030,6,73031,73031,1,73040,73049,4,73056,73061,6,73063,73064,6,73066,73097,6,73098,73102,2,73104,73105,1,73107,73108,2,73109,73109,1,73110,73110,2,73111,73111,1,73112,73112,6,73120,73129,4,73440,73458,6,73459,73460,1,73461,73462,2,73463,73464,6,73472,73473,1,73474,73474,6,73475,73475,2,73476,73488,6,73490,73523,6,73524,73525,2,73526,73530,1,73534,73535,2,73536,73536,1,73537,73537,2,73538,73538,1,73539,73551,6,73552,73561,4,73562,73562,1,73648,73648,6,73664,73713,6,73727,74649,6,74752,74862,6,74864,74868,6,74880,75075,6,77712,77810,6,77824,78895,6,78896,78911,5,78912,78912,1,78913,78918,6,78919,78933,1,78944,82938,6,82944,83526,6,90368,90397,6,90398,90409,1,90410,90412,2,90413,90415,1,90416,90425,4,92160,92728,6,92736,92766,6,92768,92777,4,92782,92862,6,92864,92873,4,92880,92909,6,92912,92916,1,92917,92917,6,92928,92975,6,92976,92982,1,92983,92997,6,93008,93017,4,93019,93025,6,93027,93047,6,93053,93071,6,93504,93551,6,93552,93561,4,93760,93850,6,93952,94026,6,94031,94031,1,94032,94032,6,94033,94087,2,94095,94098,1,94099,94111,6,94176,94179,6,94180,94180,1,94192,94193,2,94208,100343,6,100352,101589,6,101631,101640,6,110576,110579,6,110581,110587,6,110589,110590,6,110592,110882,6,110898,110898,6,110928,110930,6,110933,110933,6,110948,110951,6,110960,111355,6,113664,113770,6,113776,113788,6,113792,113800,6,113808,113817,6,113820,113820,6,113821,113822,1,113823,113823,6,113824,113827,5,117760,117999,6,118e3,118009,4,118016,118451,6,118528,118573,1,118576,118598,1,118608,118723,6,118784,119029,6,119040,119078,6,119081,119140,6,119141,119142,2,119143,119145,1,119146,119148,6,119149,119154,2,119155,119162,5,119163,119170,1,119171,119172,6,119173,119179,1,119180,119209,6,119210,119213,1,119214,119274,6,119296,119361,6,119362,119364,1,119365,119365,6,119488,119507,6,119520,119539,6,119552,119638,6,119648,119672,6,119808,119892,6,119894,119964,6,119966,119967,6,119970,119970,6,119973,119974,6,119977,119980,6,119982,119993,6,119995,119995,6,119997,120003,6,120005,120069,6,120071,120074,6,120077,120084,6,120086,120092,6,120094,120121,6,120123,120126,6,120128,120132,6,120134,120134,6,120138,120144,6,120146,120485,6,120488,120779,6,120782,120831,4,120832,121343,6,121344,121398,1,121399,121402,6,121403,121452,1,121453,121460,6,121461,121461,1,121462,121475,6,121476,121476,1,121477,121483,6,121499,121503,1,121505,121519,1,122624,122654,6,122661,122666,6,122880,122886,1,122888,122904,1,122907,122913,1,122915,122916,1,122918,122922,1,122928,122989,6,123023,123023,1,123136,123180,6,123184,123190,1,123191,123197,6,123200,123209,4,123214,123215,6,123536,123565,6,123566,123566,1,123584,123627,6,123628,123631,1,123632,123641,4,123647,123647,6,124112,124139,6,124140,124143,1,124144,124153,4,124368,124397,6,124398,124399,1,124400,124400,6,124401,124410,4,124415,124415,6,124896,124902,6,124904,124907,6,124909,124910,6,124912,124926,6,124928,125124,6,125127,125135,6,125136,125142,1,125184,125251,6,125252,125258,1,125259,125259,6,125264,125273,4,125278,125279,6,126065,126132,6,126209,126269,6,126464,126467,6,126469,126495,6,126497,126498,6,126500,126500,6,126503,126503,6,126505,126514,6,126516,126519,6,126521,126521,6,126523,126523,6,126530,126530,6,126535,126535,6,126537,126537,6,126539,126539,6,126541,126543,6,126545,126546,6,126548,126548,6,126551,126551,6,126553,126553,6,126555,126555,6,126557,126557,6,126559,126559,6,126561,126562,6,126564,126564,6,126567,126570,6,126572,126578,6,126580,126583,6,126585,126588,6,126590,126590,6,126592,126601,6,126603,126619,6,126625,126627,6,126629,126633,6,126635,126651,6,126704,126705,6,126976,127019,6,127024,127123,6,127136,127150,6,127153,127167,6,127169,127183,6,127185,127221,6,127232,127405,6,127462,127490,6,127504,127547,6,127552,127560,6,127568,127569,6,127584,127589,6,127744,128727,6,128732,128748,6,128752,128764,6,128768,128886,6,128891,128985,6,128992,129003,6,129008,129008,6,129024,129035,6,129040,129095,6,129104,129113,6,129120,129159,6,129168,129197,6,129200,129211,6,129216,129217,6,129280,129619,6,129632,129645,6,129648,129660,6,129664,129673,6,129679,129734,6,129742,129756,6,129759,129769,6,129776,129784,6,129792,129938,6,129940,130031,6,130032,130041,4,131072,173791,6,173824,177977,6,177984,178205,6,178208,183969,6,183984,191456,6,191472,192093,6,194560,195101,6,196608,201546,6,201552,205743,6,917505,917505,5,917536,917631,5,917760,917999,1,983040,1048573,6,1048576,1114109,6],t.t)
B.bT=s([65269,65270,0,0],t.t)
B.bU=s([65271,65272,0,0],t.t)
B.bV=s([65273,65274,0,0],t.t)
B.bW=s([65275,65276,0,0],t.t)
B.bi=s([64579,64646,0,0],t.t)
B.cv=new A.bG([1570,B.bT,1571,B.bU,1573,B.bV,1575,B.bW,1609,B.bi],t.nD)
B.E=new A.bG([1552,1,1553,1,1554,1,1555,1,1556,1,1557,1,1558,1,1559,1,1560,1,1561,1,1562,1,1564,1,1568,2,1570,3,1571,3,1572,3,1573,3,1574,2,1575,3,1576,2,1577,3,1578,2,1579,2,1580,2,1581,2,1582,2,1583,3,1584,3,1585,3,1586,3,1587,2,1588,2,1589,2,1590,2,1591,2,1592,2,1593,2,1594,2,1595,2,1596,2,1597,2,1598,2,1599,2,1600,5,1601,2,1602,2,1603,2,1604,2,1605,2,1606,2,1607,2,1608,3,1609,2,1610,2,1611,1,1612,1,1613,1,1614,1,1615,1,1616,1,1617,1,1618,1,1619,1,1620,1,1621,1,1622,1,1623,1,1624,1,1625,1,1626,1,1627,1,1628,1,1629,1,1630,1,1631,1,1646,2,1647,2,1648,1,1649,3,1650,3,1651,3,1653,3,1654,3,1655,3,1656,2,1657,2,1658,2,1659,2,1660,2,1661,2,1662,2,1663,2,1664,2,1665,2,1666,2,1667,2,1668,2,1669,2,1670,2,1671,2,1672,3,1673,3,1674,3,1675,3,1676,3,1677,3,1678,3,1679,3,1680,3,1681,3,1682,3,1683,3,1684,3,1685,3,1686,3,1687,3,1688,3,1689,3,1690,2,1691,2,1692,2,1693,2,1694,2,1695,2,1696,2,1697,2,1698,2,1699,2,1700,2,1701,2,1702,2,1703,2,1704,2,1705,2,1706,2,1707,2,1708,2,1709,2,1710,2,1711,2,1712,2,1713,2,1714,2,1715,2,1716,2,1717,2,1718,2,1719,2,1720,2,1721,2,1722,2,1723,2,1724,2,1725,2,1726,2,1727,2,1728,3,1729,2,1730,2,1731,3,1732,3,1733,3,1734,3,1735,3,1736,3,1737,3,1738,3,1739,3,1740,2,1741,3,1742,2,1743,3,1744,2,1745,2,1746,3,1747,3,1749,3,1750,1,1751,1,1752,1,1753,1,1754,1,1755,1,1756,1,1759,1,1760,1,1761,1,1762,1,1763,1,1764,1,1767,1,1768,1,1770,1,1771,1,1772,1,1773,1,1774,3,1775,3,1786,2,1787,2,1788,2,1791,2,1807,1,1808,3,1809,1,1810,2,1811,2,1812,2,1813,3,1814,3,1815,3,1816,3,1817,3,1818,2,1819,2,1820,2,1821,2,1822,3,1823,2,1824,2,1825,2,1826,2,1827,2,1828,2,1829,2,1830,2,1831,2,1832,3,1833,2,1834,3,1835,2,1836,3,1837,2,1838,2,1839,3,1840,1,1841,1,1842,1,1843,1,1844,1,1845,1,1846,1,1847,1,1848,1,1849,1,1850,1,1851,1,1852,1,1853,1,1854,1,1855,1,1856,1,1857,1,1858,1,1859,1,1860,1,1861,1,1862,1,1863,1,1864,1,1865,1,1866,1,1869,3,1870,2,1871,2,1872,2,1873,2,1874,2,1875,2,1876,2,1877,2,1878,2,1879,2,1880,2,1881,3,1882,3,1883,3,1884,2,1885,2,1886,2,1887,2,1888,2,1889,2,1890,2,1891,2,1892,2,1893,2,1894,2,1895,2,1896,2,1897,2,1898,2,1899,3,1900,3,1901,2,1902,2,1903,2,1904,2,1905,3,1906,2,1907,3,1908,3,1909,2,1910,2,1911,2,1912,3,1913,3,1914,2,1915,2,1916,2,1917,2,1918,2,1919,2,1958,1,1959,1,1960,1,1961,1,1962,1,1963,1,1964,1,1965,1,1966,1,1967,1,1968,1,1994,2,1995,2,1996,2,1997,2,1998,2,1999,2,2000,2,2001,2,2002,2,2003,2,2004,2,2005,2,2006,2,2007,2,2008,2,2009,2,2010,2,2011,2,2012,2,2013,2,2014,2,2015,2,2016,2,2017,2,2018,2,2019,2,2020,2,2021,2,2022,2,2023,2,2024,2,2025,2,2026,2,2027,1,2028,1,2029,1,2030,1,2031,1,2032,1,2033,1,2034,1,2035,1,2042,5,2045,1,2070,1,2071,1,2072,1,2073,1,2075,1,2076,1,2077,1,2078,1,2079,1,2080,1,2081,1,2082,1,2083,1,2085,1,2086,1,2087,1,2089,1,2090,1,2091,1,2092,1,2093,1,2112,3,2113,2,2114,2,2115,2,2116,2,2117,2,2118,3,2119,3,2120,2,2121,3,2122,2,2123,2,2124,2,2125,2,2126,2,2127,2,2128,2,2129,2,2130,2,2131,2,2132,3,2133,2,2134,3,2135,3,2136,3,2137,1,2138,1,2139,1,2144,2,2146,2,2147,2,2148,2,2149,2,2151,3,2152,2,2153,3,2154,3,2160,3,2161,3,2162,3,2163,3,2164,3,2165,3,2166,3,2167,3,2168,3,2169,3,2170,3,2171,3,2172,3,2173,3,2174,3,2175,3,2176,3,2177,3,2178,3,2179,5,2180,5,2181,5,2182,2,2185,2,2186,2,2187,2,2188,2,2189,2,2190,3,2191,2,2199,1,2200,1,2201,1,2202,1,2203,1,2204,1,2205,1,2206,1,2207,1,2208,2,2209,2,2210,2,2211,2,2212,2,2213,2,2214,2,2215,2,2216,2,2217,2,2218,3,2219,3,2220,3,2222,3,2223,2,2224,2,2225,3,2226,3,2227,2,2228,2,2229,2,2230,2,2231,2,2232,2,2233,3,2234,2,2235,2,2236,2,2237,2,2238,2,2239,2,2240,2,2241,2,2242,2,2243,2,2244,2,2245,2,2246,2,2247,2,2248,2,2250,1,2251,1,2252,1,2253,1,2254,1,2255,1,2256,1,2257,1,2258,1,2259,1,2260,1,2261,1,2262,1,2263,1,2264,1,2265,1,2266,1,2267,1,2268,1,2269,1,2270,1,2271,1,2272,1,2273,1,2275,1,2276,1,2277,1,2278,1,2279,1,2280,1,2281,1,2282,1,2283,1,2284,1,2285,1,2286,1,2287,1,2288,1,2289,1,2290,1,2291,1,2292,1,2293,1,2294,1,2295,1,2296,1,2297,1,2298,1,2299,1,2300,1,2301,1,2302,1,2303,1,65279,1],A.aw("bG<b,b>"))
B.bj=s([65152,0,0,0],t.t)
B.bk=s([65153,65154,0,0],t.t)
B.bl=s([65155,65156,0,0],t.t)
B.bm=s([65157,65158,0,0],t.t)
B.bn=s([65159,65160,0,0],t.t)
B.bo=s([65161,65162,65163,65164],t.t)
B.bp=s([65165,65166,0,0],t.t)
B.bq=s([65167,65168,65169,65170],t.t)
B.br=s([65171,65172,0,0],t.t)
B.bs=s([65173,65174,65175,65176],t.t)
B.bt=s([65177,65178,65179,65180],t.t)
B.bu=s([65181,65182,65183,65184],t.t)
B.bv=s([65185,65186,65187,65188],t.t)
B.bw=s([65189,65190,65191,65192],t.t)
B.bx=s([65193,65194,0,0],t.t)
B.by=s([65195,65196,0,0],t.t)
B.bz=s([65197,65198,0,0],t.t)
B.bA=s([65199,65200,0,0],t.t)
B.bB=s([65201,65202,65203,65204],t.t)
B.bC=s([65205,65206,65207,65208],t.t)
B.bD=s([65209,65210,65211,65212],t.t)
B.bE=s([65213,65214,65215,65216],t.t)
B.bF=s([65217,65218,65219,65220],t.t)
B.bG=s([65221,65222,65223,65224],t.t)
B.bH=s([65225,65226,65227,65228],t.t)
B.bI=s([65229,65230,65231,65232],t.t)
B.bJ=s([65233,65234,65235,65236],t.t)
B.bK=s([65237,65238,65239,65240],t.t)
B.bL=s([65241,65242,65243,65244],t.t)
B.bM=s([65245,65246,65247,65248],t.t)
B.bN=s([65249,65250,65251,65252],t.t)
B.bO=s([65253,65254,65255,65256],t.t)
B.bP=s([65257,65258,65259,65260],t.t)
B.bQ=s([65261,65262,0,0],t.t)
B.bR=s([65263,65264,64488,64489],t.t)
B.bS=s([65265,65266,65267,65268],t.t)
B.aF=s([64336,64337,0,0],t.t)
B.bc=s([64477,0,0,0],t.t)
B.aL=s([64358,64359,64360,64361],t.t)
B.aJ=s([64350,64351,64352,64353],t.t)
B.aG=s([64338,64339,64340,64341],t.t)
B.aH=s([64342,64343,64344,64345],t.t)
B.aK=s([64354,64355,64356,64357],t.t)
B.aI=s([64346,64347,64348,64349],t.t)
B.aP=s([64374,64375,64376,64377],t.t)
B.aO=s([64370,64371,64372,64373],t.t)
B.aQ=s([64378,64379,64380,64381],t.t)
B.aR=s([64382,64383,64384,64385],t.t)
B.aV=s([64392,64393,0,0],t.t)
B.aT=s([64388,64389,0,0],t.t)
B.aS=s([64386,64387,0,0],t.t)
B.aU=s([64390,64391,0,0],t.t)
B.aX=s([64396,64397,0,0],t.t)
B.aW=s([64394,64395,0,0],t.t)
B.aM=s([64362,64363,64364,64365],t.t)
B.aN=s([64366,64367,64368,64369],t.t)
B.aY=s([64398,64399,64400,64401],t.t)
B.b8=s([64467,64468,64469,64470],t.t)
B.aZ=s([64402,64403,64404,64405],t.t)
B.b0=s([64410,64411,64412,64413],t.t)
B.b_=s([64406,64407,64408,64409],t.t)
B.b1=s([64414,64415,0,0],t.t)
B.b2=s([64416,64417,64418,64419],t.t)
B.b5=s([64426,64427,64428,64429],t.t)
B.b3=s([64420,64421,0,0],t.t)
B.b4=s([64422,64423,64424,64425],t.t)
B.be=s([64480,64481,0,0],t.t)
B.ba=s([64473,64474,0,0],t.t)
B.b9=s([64471,64472,0,0],t.t)
B.bb=s([64475,64476,0,0],t.t)
B.bf=s([64482,64483,0,0],t.t)
B.bd=s([64478,64479,0,0],t.t)
B.bh=s([64508,64509,64510,64511],t.t)
B.bg=s([64484,64485,64486,64487],t.t)
B.b6=s([64430,64431,0,0],t.t)
B.b7=s([64432,64433,0,0],t.t)
B.cw=new A.bG([1569,B.bj,1570,B.bk,1571,B.bl,1572,B.bm,1573,B.bn,1574,B.bo,1575,B.bp,1576,B.bq,1577,B.br,1578,B.bs,1579,B.bt,1580,B.bu,1581,B.bv,1582,B.bw,1583,B.bx,1584,B.by,1585,B.bz,1586,B.bA,1587,B.bB,1588,B.bC,1589,B.bD,1590,B.bE,1591,B.bF,1592,B.bG,1593,B.bH,1594,B.bI,1601,B.bJ,1602,B.bK,1603,B.bL,1604,B.bM,1605,B.bN,1606,B.bO,1607,B.bP,1608,B.bQ,1609,B.bR,1610,B.bS,1649,B.aF,1655,B.bc,1657,B.aL,1658,B.aJ,1659,B.aG,1662,B.aH,1663,B.aK,1664,B.aI,1667,B.aP,1668,B.aO,1670,B.aQ,1671,B.aR,1672,B.aV,1676,B.aT,1677,B.aS,1678,B.aU,1681,B.aX,1688,B.aW,1700,B.aM,1702,B.aN,1705,B.aY,1709,B.b8,1711,B.aZ,1713,B.b0,1715,B.b_,1722,B.b1,1723,B.b2,1726,B.b5,1728,B.b3,1729,B.b4,1733,B.be,1734,B.ba,1735,B.b9,1736,B.bb,1737,B.bf,1739,B.bd,1740,B.bh,1744,B.bg,1746,B.b6,1747,B.b7],t.nD)
B.cD={transparent:0,black:1,white:2,red:3,green:4,blue:5,yellow:6,orange:7,gray:8,grey:9,silver:10,lightgray:11,lightgrey:12,darkgray:13,darkgrey:14,dimgray:15,whitesmoke:16,gainsboro:17,purple:18,brown:19,pink:20,cyan:21,magenta:22,navy:23,teal:24,beige:25,ivory:26,lightblue:27,steelblue:28,darkblue:29,darkgreen:30}
B.cx=new A.aR(B.cD,[0,4278190080,4294967295,4294901760,4278222848,4278190335,4294967040,4294944e3,4286611584,4286611584,4290822336,4292072403,4292072403,4289309097,4289309097,4285098345,4294309365,4292664540,4286578816,4289014314,4294951115,4278255615,4294902015,4278190208,4278222976,4294309340,4294967280,4289583334,4282811060,4278190219,4278215680],A.aw("aR<v,b>"))
B.cB={Arabic:0,Syriac:1,Nko:2,Thaana:3,Mongolian:4,Adlam:5,Mandaic:6,Manichaean:7,Psalter_Pahlavi:8,Hanifi_Rohingya:9,Sogdian:10,Old_Sogdian:11,Old_Uyghur:12,Chorasmian:13,Phags_Pa:14,Latin:15,Cyrillic:16,Greek:17,Hebrew:18,Armenian:19,Georgian:20,Coptic:21,Glagolitic:22,Gothic:23,Runic:24,Ogham:25,Cherokee:26,Deseret:27,Osage:28,Shavian:29,Vai:30,Tifinagh:31,Ethiopic:32,Canadian_Aboriginal:33,Braille:34,Han:35,Hiragana:36,Katakana:37,Hangul:38,Bopomofo:39,Yi:40,Nushu:41,Tangut:42,Devanagari:43,Bengali:44,Gurmukhi:45,Gujarati:46,Oriya:47,Tamil:48,Telugu:49,Kannada:50,Malayalam:51,Sinhala:52,Myanmar:53,Khmer:54,Thai:55,Lao:56,Tibetan:57,Tai_Tham:58,Tai_Le:59,New_Tai_Lue:60,Tai_Viet:61,Balinese:62,Javanese:63,Sundanese:64,Batak:65,Buginese:66,Rejang:67,Cham:68,Kayah_Li:69,Lepcha:70,Limbu:71,Meetei_Mayek:72,Syloti_Nagri:73,Chakma:74,Sharada:75,Takri:76,Khojki:77,Khudawadi:78,Multani:79,Modi:80,Grantha:81,Tirhuta:82,Newa:83,Ahom:84,Brahmi:85,Kaithi:86,Kharoshthi:87,Saurashtra:88,Mahajani:89}
B.cy=new A.aR(B.cB,["arab","syrc","nko","thaa","mong","adlm","mand","mani","phlp","rohg","sogd","sogo","ougr","chrs","phag","latn","cyrl","grek","hebr","armn","geor","copt","glag","goth","runr","ogam","cher","dsrt","osge","shaw","vai","tfng","ethi","cans","brai","hani","kana","kana","hang","bopo","yi","nshu","tang","dev2","bng2","gur2","gjr2","ory2","tml2","tel2","knd2","mlm2","sinh","mym2","khmr","thai","lao","tibt","lana","tale","talu","tavt","bali","java","sund","batk","bugi","rjng","cham","kali","lepc","limb","mtei","sylo","cakm","shrd","takr","khoj","sind","mult","modi","gran","tirh","newa","ahom","brah","kthi","khar","saur","mahj"],A.aw("aR<v,v>"))
B.G={}
B.k=new A.aR(B.G,[],A.aw("aR<v,n?>"))
B.x=new A.aR(B.G,[],A.aw("aR<n?,n?>"))
B.d6=new A.fW(2,"composedDiacritics")
B.cG=new A.G(0,0)
B.cK=new A.a9(0,0,0,1)
B.cF={thin:0,hairline:1,extralight:2,ultralight:3,light:4,regular:5,normal:6,book:7,medium:8,semibold:9,demibold:10,demi:11,bold:12,extrabold:13,ultrabold:14,black:15,heavy:16,italic:17,oblique:18,condensed:19,semicondensed:20,expanded:21,extra:22,semi:23,ultra:24}
B.cL=new A.aS(B.cF,25,t.R)
B.cM=new A.bH([1634885986,1937338979,1852534560,1952997729,1835101796,1633971309,1751474802,1935764850,1835363940,1835101801,1885891696,1919903847,1936680804,1936680815,1869965170,1667789427,1634889065,1635152756,1668313716,1802002802,1819894889,1835364975,1835364963,1851880034,1851941236,1885432941,1885891689,1885892216,1886549097,1935766114,1869769576,1751217266,1752526439,2036693609,1701607789],t.Y)
B.cN=new A.bH([1813,1814,1834,1792],t.Y)
B.cA={"raster-hue-rotate":0,"raster-saturation":1,"raster-contrast":2,"raster-brightness-min":3,"raster-brightness-max":4}
B.a0=new A.aS(B.cA,5,t.R)
B.a1=new A.bH([1634885986,1937338979,1852534560,1836019303,1885888871,1835101796,1835101801,1885891696,1919903847,1936680804,1936680815,1869965170,1667789427],t.Y)
B.H=new A.aS(B.G,0,A.aw("aS<b>"))
B.cC={"user-agent":0,"accept-encoding":1}
B.cO=new A.aS(B.cC,2,t.R)
B.cE={literal:0,get:1,has:2,"!":3,"==":4,"!=":5,"<":6,"<=":7,">":8,">=":9,all:10,any:11,none:12,case:13,match:14,coalesce:15,step:16,interpolate:17,"interpolate-hcl":18,"interpolate-lab":19,zoom:20,"geometry-type":21,"to-string":22,"to-number":23,"to-boolean":24,"to-color":25,string:26,number:27,boolean:28,array:29,object:30,concat:31,upcase:32,downcase:33,"+":34,"-":35,"*":36,"/":37,"%":38,"^":39,min:40,max:41,round:42,floor:43,ceil:44,abs:45,sqrt:46,ln:47,log10:48,log2:49,length:50,in:51,"!in":52,"!has":53,at:54,format:55,"number-format":56,rgb:57,rgba:58,var:59,let:60,id:61,properties:62,"feature-state":63,image:64,typeof:65,collator:66,"resolved-locale":67,"is-supported-script":68,slice:69,"index-of":70,e:71,pi:72,ln2:73,"line-progress":74,"heatmap-density":75,sin:76,cos:77,tan:78,asin:79,acos:80,atan:81,within:82,distance:83,accumulated:84,"to-rgba":85,hsl:86,hsla:87,split:88,join:89}
B.cP=new A.aS(B.cE,90,t.R)
B.a2=new A.bS(0,"left")
B.a3=new A.bS(1,"right")
B.cQ=new A.bS(2,"center")
B.cR=new A.bS(4,"start")
B.cS=new A.bS(5,"end")
B.q=new A.eu(0,"ltr")
B.i=new A.eu(1,"rtl")
B.cT=A.aM("wO")
B.cU=A.aM("oS")
B.cV=A.aM("fw")
B.cW=A.aM("dT")
B.cX=A.aM("nO")
B.cY=A.aM("fE")
B.cZ=A.aM("t6")
B.d_=A.aM("K")
B.d0=A.aM("n")
B.d1=A.aM("kv")
B.d2=A.aM("o0")
B.d3=A.aM("u7")
B.d4=A.aM("cp")
B.d5=new A.kx(!1)})();(function staticFields(){$.kY=null
$.aH=A.c([],t.G)
$.pn=null
$.oQ=null
$.oP=null
$.qn=null
$.qi=null
$.qt=null
$.nb=null
$.nl=null
$.oo=null
$.l4=A.c([],A.aw("m<l<n>?>"))
$.ds=null
$.f_=null
$.f0=null
$.ob=!1
$.D=B.e
$.dr=0
$.dp=A.A(t.N,t.S)
$.tO=A.A(t.N,A.aw("a9?"))
$.f1=A.c([],A.aw("m<W<v,n?(z)>>"))})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal,r=hunkHelpers.lazy
s($,"wQ","qy",()=>A.nc("_$dart_dartClosure"))
s($,"wP","oA",()=>A.nc("_$dart_dartClosure_dartJSInterop"))
s($,"xs","qW",()=>B.e.dT(new A.nq(),A.aw("a1<~>")))
s($,"xh","qS",()=>A.c([new J.fH()],A.aw("m<ek>")))
s($,"wX","qB",()=>A.br(A.ku({
toString:function(){return"$receiver$"}})))
s($,"wY","qC",()=>A.br(A.ku({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"wZ","qD",()=>A.br(A.ku(null)))
s($,"x_","qE",()=>A.br(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(q){return q.message}}()))
s($,"x2","qH",()=>A.br(A.ku(void 0)))
s($,"x3","qI",()=>A.br(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(q){return q.message}}()))
s($,"x1","qG",()=>A.br(A.pD(null)))
s($,"x0","qF",()=>A.br(function(){try{null.$method$}catch(q){return q.message}}()))
s($,"x5","qK",()=>A.br(A.pD(void 0)))
s($,"x4","qJ",()=>A.br(function(){try{(void 0).$method$}catch(q){return q.message}}()))
s($,"x6","oC",()=>A.u9())
s($,"wT","oB",()=>$.qW())
s($,"wS","qA",()=>{var q=new A.F(B.e,t.k)
q.fv(!1)
return q})
s($,"xa","qO",()=>A.ty(4096))
s($,"x8","qM",()=>new A.lf().$0())
s($,"x9","qN",()=>new A.le().$0())
s($,"x7","qL",()=>A.jx("^[\\-\\.0-9A-Z_a-z~]*$"))
s($,"xc","i3",()=>A.nr(B.d0))
r($,"xg","f4",()=>new A.mU().$0())
r($,"xe","qR",()=>new A.lG().$0())
s($,"wR","qz",()=>A.tw(0))
s($,"xi","qT",()=>A.c([A.B(7,7,0),A.B(7,0,2),A.B(7,0,1),A.B(7,0,2),A.B(7,0,1),A.B(7,0,6),A.B(7,7,0),A.B(7,0,2),A.B(7,0,1),A.B(7,0,2),A.B(7,2,5),A.B(7,0,6),A.B(7,7,0),A.B(7,0,2),A.B(6,1,1),A.B(6,1,3),A.B(6,1,4),A.B(6,1,6),A.B(7,7,0),A.B(7,0,2),A.B(4,1,1),A.B(4,1,3),A.B(4,1,4),A.B(4,1,6),A.B(7,7,0),A.B(7,0,2),A.B(5,0,1),A.B(5,0,2),A.B(5,2,5),A.B(5,0,6),A.B(7,7,0),A.B(7,0,2),A.B(0,0,1),A.B(0,0,2),A.B(0,2,5),A.B(0,0,6),A.B(7,7,0),A.B(7,0,2),A.B(7,0,1),A.B(7,0,2),A.B(7,3,5),A.B(7,0,6)],t.t))
s($,"xf","f3",()=>new A.lS().$0())
s($,"xb","qP",()=>B.a.aW(B.D,"Common"))
s($,"xd","qQ",()=>B.a.aW(B.D,"Inherited"))
s($,"xj","oD",()=>new A.mY().$0())
s($,"xr","nH",()=>A.ci(B.c3))
s($,"xq","nG",()=>A.ci(B.cu))
s($,"xl","oF",()=>A.ci(B.co))
s($,"xk","oE",()=>A.ci(B.cr))
s($,"xo","dz",()=>A.ci(B.cl))
s($,"xt","qX",()=>A.ci(B.c0))
s($,"xn","qV",()=>A.ci(B.bZ))
s($,"xm","qU",()=>A.ci(B.bX))})();(function nativeSupport(){!function(){var s=function(a){var m={}
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
hunkHelpers.setOrUpdateInterceptorsByTag({SharedArrayBuffer:A.bM,ArrayBuffer:A.d4,ArrayBufferView:A.eb,DataView:A.e9,Float32Array:A.cg,Float64Array:A.ch,Int16Array:A.fU,Int32Array:A.ea,Int8Array:A.fV,Uint16Array:A.cj,Uint32Array:A.ec,Uint8ClampedArray:A.ed,CanvasPixelArray:A.ed,Uint8Array:A.bO})
hunkHelpers.setOrUpdateLeafTags({SharedArrayBuffer:true,ArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.ah.$nativeSuperclassTag="ArrayBufferView"
A.eI.$nativeSuperclassTag="ArrayBufferView"
A.eJ.$nativeSuperclassTag="ArrayBufferView"
A.bN.$nativeSuperclassTag="ArrayBufferView"
A.eK.$nativeSuperclassTag="ArrayBufferView"
A.eL.$nativeSuperclassTag="ArrayBufferView"
A.aD.$nativeSuperclassTag="ArrayBufferView"})()
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
convertAllToFastObject(w)
convertToFastObject($);(function(a){if(typeof document==="undefined"){a(null)
return}if(typeof document.currentScript!="undefined"){a(document.currentScript)
return}var s=document.scripts
function onLoad(b){for(var q=0;q<s.length;++q){s[q].removeEventListener("load",onLoad,false)}a(b.target)}for(var r=0;r<s.length;++r){s[r].addEventListener("load",onLoad,false)}})(function(a){v.currentScript=a
var s=A.wp
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()