// vmap web worker, built from lib dda20c63
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
if(a[b]!==s){A.xH(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.b(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.oW(b)
return new s(c,this)}:function(){if(s===null)s=A.oW(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.oW(a).prototype
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
p0(a,b,c,d){return{i:a,p:b,e:c,x:d}},
nF(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.oZ==null){A.x7()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.e(A.qo("Return interceptor for "+A.t(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.ln
if(o==null)o=$.ln=A.nE(n)
p=q[o]}if(p!=null)return p
p=A.xh(a)
if(p!=null)return p
if(typeof a=="function")return B.aP
s=Object.getPrototypeOf(a)
if(s==null)return B.ac
if(s===Object.prototype)return B.ac
if(typeof q=="function"){o=$.ln
if(o==null)o=$.ln=A.nE(n)
Object.defineProperty(q,o,{value:B.R,enumerable:false,writable:true,configurable:true})
return B.R}return B.R},
on(a,b){if(a<0||a>4294967295)throw A.e(A.a4(a,0,4294967295,"length",null))
return J.pO(new Array(a),b)},
aN(a,b){if(a>4294967295)throw A.e(A.a4(a,0,4294967295,"length",null))
return J.pO(new Array(a),b)},
pN(a,b){if(a<0)throw A.e(A.aM("Length must be a non-negative integer: "+a,null))
return A.b(new Array(a),b.i("k<0>"))},
om(a,b){if(a<0)throw A.e(A.aM("Length must be a non-negative integer: "+a,null))
return A.b(new Array(a),b.i("k<0>"))},
pO(a,b){var s=A.b(a,b.i("k<0>"))
s.$flags=1
return s},
u1(a,b){var s=t.bP
return J.rN(s.a(a),s.a(b))},
pP(a){if(a<256)switch(a){case 9:case 10:case 11:case 12:case 13:case 32:case 133:case 160:return!0
default:return!1}switch(a){case 5760:case 8192:case 8193:case 8194:case 8195:case 8196:case 8197:case 8198:case 8199:case 8200:case 8201:case 8202:case 8232:case 8233:case 8239:case 8287:case 12288:case 65279:return!0
default:return!1}},
pQ(a,b){var s,r
for(s=a.length;b<s;){r=a.charCodeAt(b)
if(r!==32&&r!==13&&!J.pP(r))break;++b}return b},
pR(a,b){var s,r,q
for(s=a.length;b>0;b=r){r=b-1
if(!(r<s))return A.a(a,r)
q=a.charCodeAt(r)
if(q!==32&&q!==13&&!J.pP(q))break}return b},
aj(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.eb.prototype
return J.fV.prototype}if(typeof a=="string")return J.bU.prototype
if(a==null)return J.ec.prototype
if(typeof a=="boolean")return J.ea.prototype
if(Array.isArray(a))return J.k.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bu.prototype
if(typeof a=="symbol")return J.de.prototype
if(typeof a=="bigint")return J.dd.prototype
return a}if(a instanceof A.o)return a
return J.nF(a)},
q(a){if(typeof a=="string")return J.bU.prototype
if(a==null)return a
if(Array.isArray(a))return J.k.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bu.prototype
if(typeof a=="symbol")return J.de.prototype
if(typeof a=="bigint")return J.dd.prototype
return a}if(a instanceof A.o)return a
return J.nF(a)},
a2(a){if(a==null)return a
if(Array.isArray(a))return J.k.prototype
if(typeof a!="object"){if(typeof a=="function")return J.bu.prototype
if(typeof a=="symbol")return J.de.prototype
if(typeof a=="bigint")return J.dd.prototype
return a}if(a instanceof A.o)return a
return J.nF(a)},
x_(a){if(typeof a=="number")return J.dc.prototype
if(typeof a=="string")return J.bU.prototype
if(a==null)return a
if(!(a instanceof A.o))return J.cF.prototype
return a},
x0(a){if(typeof a=="string")return J.bU.prototype
if(a==null)return a
if(!(a instanceof A.o))return J.cF.prototype
return a},
dM(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.bu.prototype
if(typeof a=="symbol")return J.de.prototype
if(typeof a=="bigint")return J.dd.prototype
return a}if(a instanceof A.o)return a
return J.nF(a)},
l(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.aj(a).B(a,b)},
aL(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.xc(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.q(a).h(a,b)},
ph(a,b,c){return J.a2(a).m(a,b,c)},
pi(a,b){return J.a2(a).k(a,b)},
rK(a,b){return J.x0(a).c6(a,b)},
pj(a,b,c){return J.dM(a).dB(a,b,c)},
pk(a,b,c){return J.dM(a).dC(a,b,c)},
rL(a,b,c){return J.dM(a).dD(a,b,c)},
rM(a,b,c){return J.dM(a).dE(a,b,c)},
pl(a,b,c){return J.dM(a).dF(a,b,c)},
fi(a,b){return J.a2(a).bu(a,b)},
rN(a,b){return J.x_(a).ab(a,b)},
pm(a,b){return J.q(a).u(a,b)},
fj(a,b){return J.a2(a).M(a,b)},
rO(a,b){return J.a2(a).aj(a,b)},
of(a,b){return J.a2(a).Y(a,b)},
pn(a){return J.dM(a).gao(a)},
ik(a){return J.a2(a).gv(a)},
b6(a){return J.aj(a).gR(a)},
dP(a){return J.q(a).gA(a)},
og(a){return J.q(a).gI(a)},
G(a){return J.a2(a).gt(a)},
Z(a){return J.q(a).gl(a)},
rP(a){return J.dM(a).gdS(a)},
po(a){return J.aj(a).gV(a)},
rQ(a,b,c){return J.a2(a).bb(a,b,c)},
rR(a,b,c){return J.q(a).aK(a,b,c)},
il(a,b,c){return J.a2(a).aL(a,b,c)},
rS(a,b){return J.q(a).sl(a,b)},
rT(a,b,c,d,e){return J.a2(a).a5(a,b,c,d,e)},
cV(a,b){return J.a2(a).T(a,b)},
rU(a,b){return J.a2(a).a1(a,b)},
rV(a,b,c){return J.a2(a).H(a,b,c)},
rW(a,b){return J.a2(a).e6(a,b)},
rX(a){return J.a2(a).e8(a)},
pp(a){return J.a2(a).e9(a)},
b7(a){return J.aj(a).q(a)},
pq(a,b){return J.a2(a).cw(a,b)},
fS:function fS(){},
ea:function ea(){},
ec:function ec(){},
ee:function ee(){},
bV:function bV(){},
hb:function hb(){},
cF:function cF(){},
bu:function bu(){},
dd:function dd(){},
de:function de(){},
k:function k(a){this.$ti=a},
fU:function fU(){},
jn:function jn(a){this.$ti=a},
aT:function aT(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
dc:function dc(){},
eb:function eb(){},
fV:function fV(){},
bU:function bU(){}},A={oo:function oo(){},
dW(a,b,c){if(t.U.b(a))return new A.eP(a,b.i("@<0>").G(c).i("eP<1,2>"))
return new A.ce(a,b.i("@<0>").G(c).i("ce<1,2>"))},
u2(a){return new A.df("Field '"+a+"' has been assigned during initialization.")},
u4(a){return new A.df("Field '"+a+"' has not been initialized.")},
u3(a){return new A.df("Field '"+a+"' has already been initialized.")},
bA(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
kw(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
fe(a,b,c){return a},
p_(a){var s,r
for(s=$.aK.length,r=0;r<s;++r)if(a===$.aK[r])return!0
return!1},
cD(a,b,c,d){A.ap(b,"start")
if(c!=null){A.ap(c,"end")
if(b>c)A.n(A.a4(b,0,c,"start",null))}return new A.bz(a,b,c,d.i("bz<0>"))},
q0(a,b,c,d){if(t.U.b(a))return new A.ci(a,b,c.i("@<0>").G(d).i("ci<1,2>"))
return new A.cv(a,b,c.i("@<0>").G(d).i("cv<1,2>"))},
qd(a,b,c){var s="count"
if(t.U.b(a)){A.dR(b,s,t.S)
A.ap(b,s)
return new A.d9(a,b,c.i("d9<0>"))}A.dR(b,s,t.S)
A.ap(b,s)
return new A.by(a,b,c.i("by<0>"))},
pK(a,b,c){return new A.d8(a,b,c.i("d8<0>"))},
aE(){return new A.c1("No element")},
pM(){return new A.c1("Too few elements")},
c7:function c7(){},
dX:function dX(a,b){this.a=a
this.$ti=b},
ce:function ce(a,b){this.a=a
this.$ti=b},
eP:function eP(a,b){this.a=a
this.$ti=b},
eN:function eN(){},
bn:function bn(a,b){this.a=a
this.$ti=b},
cf:function cf(a,b){this.a=a
this.$ti=b},
is:function is(a,b){this.a=a
this.b=b},
ir:function ir(a){this.a=a},
df:function df(a){this.a=a},
d2:function d2(a){this.a=a},
nU:function nU(){},
k0:function k0(){},
x:function x(){},
a0:function a0(){},
bz:function bz(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.$ti=d},
X:function X(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cv:function cv(a,b,c){this.a=a
this.b=b
this.$ti=c},
ci:function ci(a,b,c){this.a=a
this.b=b
this.$ti=c},
ej:function ej(a,b,c){var _=this
_.a=null
_.b=a
_.c=b
_.$ti=c},
an:function an(a,b,c){this.a=a
this.b=b
this.$ti=c},
cG:function cG(a,b,c){this.a=a
this.b=b
this.$ti=c},
eJ:function eJ(a,b,c){this.a=a
this.b=b
this.$ti=c},
by:function by(a,b,c){this.a=a
this.b=b
this.$ti=c},
d9:function d9(a,b,c){this.a=a
this.b=b
this.$ti=c},
eC:function eC(a,b,c){this.a=a
this.b=b
this.$ti=c},
e1:function e1(a){this.$ti=a},
e2:function e2(a){this.$ti=a},
bE:function bE(a,b){this.a=a
this.$ti=b},
cH:function cH(a,b){this.a=a
this.$ti=b},
cp:function cp(a,b,c){this.a=a
this.b=b
this.$ti=c},
d8:function d8(a,b,c){this.a=a
this.b=b
this.$ti=c},
bt:function bt(a,b,c){var _=this
_.a=a
_.b=b
_.c=-1
_.$ti=c},
a_:function a_(){},
bD:function bD(){},
dr:function dr(){},
bd:function bd(a,b){this.a=a
this.$ti=b},
fa:function fa(){},
tf(){throw A.e(A.ar("Cannot modify unmodifiable Map"))},
ri(a){var s=A.rh(a)
if(s!=null)return s
return"minified:"+a},
xc(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.dX.b(a)},
t(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.b7(a)
return s},
dm(a){var s,r=$.q5
if(r==null)r=$.q5=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
us(a,b){var s,r,q,p,o,n=null,m=/^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i.exec(a)
if(m==null)return n
if(3>=m.length)return A.a(m,3)
s=m[3]
if(b<2||b>36)throw A.e(A.a4(b,2,36,"radix",n))
if(b===10&&s!=null)return parseInt(a,10)
if(b<10||s==null){r=b<=10?47+b:86+b
q=m[1]
for(p=q.length,o=0;o<p;++o)if((q.charCodeAt(o)|32)>r)return n}return parseInt(a,b)},
P(a){var s,r
if(!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(a))return null
s=parseFloat(a)
if(isNaN(s)){r=B.d.aO(a)
if(r==="NaN"||r==="+NaN"||r==="-NaN")return s
return null}return s},
he(a){var s,r,q,p
if(a instanceof A.o)return A.aJ(A.aa(a),null)
s=J.aj(a)
if(s===B.aO||s===B.aQ||t.cx.b(a)){r=B.W(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.aJ(A.aa(a),null)},
q6(a){var s,r,q
if(a==null||typeof a=="number"||A.M(a))return J.b7(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.bM)return a.q(0)
if(a instanceof A.bg)return a.dt(!0)
s=$.rE()
for(r=0;r<1;++r){q=s[r].ic(a)
if(q!=null)return q}return"Instance of '"+A.he(a)+"'"},
q4(a){var s,r,q,p,o=a.length
if(o<=500)return String.fromCharCode.apply(null,a)
for(s="",r=0;r<o;r=q){q=r+500
p=q<o?q:o
s+=String.fromCharCode.apply(null,a.slice(r,p))}return s},
ut(a){var s,r,q,p=A.b([],t.t)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.i)(a),++r){q=a[r]
if(!A.dF(q))throw A.e(A.cT(q))
if(q<=65535)B.a.k(p,q)
else if(q<=1114111){B.a.k(p,55296+(B.b.L(q-65536,10)&1023))
B.a.k(p,56320+(q&1023))}else throw A.e(A.cT(q))}return A.q4(p)},
q7(a){var s,r,q
for(s=a.length,r=0;r<s;++r){q=a[r]
if(!A.dF(q))throw A.e(A.cT(q))
if(q<0)throw A.e(A.cT(q))
if(q>65535)return A.ut(a)}return A.q4(a)},
uu(a,b,c){var s,r,q,p
if(c<=500&&b===0&&c===a.length)return String.fromCharCode.apply(null,a)
for(s=b,r="";s<c;s=q){q=s+500
p=q<c?q:c
r+=String.fromCharCode.apply(null,a.subarray(s,p))}return r},
S(a){var s
if(0<=a){if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.b.L(s,10)|55296)>>>0,s&1023|56320)}}throw A.e(A.a4(a,0,1114111,null,null))},
ur(a){var s=a.$thrownJsError
if(s==null)return null
return A.ca(s)},
q8(a,b){var s
if(a.$thrownJsError==null){s=new Error()
A.a9(a,s)
a.$thrownJsError=s
s.stack=b.q(0)}},
ag(a){throw A.e(A.cT(a))},
a(a,b){if(a==null)J.Z(a)
throw A.e(A.nC(a,b))},
nC(a,b){var s,r="index"
if(!A.dF(b))return new A.aS(!0,b,r,null)
s=A.E(J.Z(a))
if(b<0||b>=s)return A.jl(b,s,a,r)
return A.q9(b,r)},
wU(a,b,c){if(a<0||a>c)return A.a4(a,0,c,"start",null)
if(b!=null)if(b<a||b>c)return A.a4(b,a,c,"end",null)
return new A.aS(!0,b,"end",null)},
cT(a){return new A.aS(!0,a,null,null)},
wO(a){return a},
e(a){return A.a9(a,new Error())},
a9(a,b){var s
if(a==null)a=new A.bB()
b.dartException=a
s=A.xK
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
xK(){return J.b7(this.dartException)},
n(a,b){throw A.a9(a,b==null?new Error():b)},
w(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.n(A.vR(a,b,c),s)},
vR(a,b,c){var s,r,q,p,o,n,m,l,k
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
return new A.eI("'"+s+"': Cannot "+o+" "+l+k+n)},
i(a){throw A.e(A.a6(a))},
bC(a){var s,r,q,p,o,n
a=A.rf(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.b([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.kU(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
kV(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
qm(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
op(a,b){var s=b==null,r=s?null:b.method
return new A.fW(a,r,s?null:b.receiver)},
bk(a){var s
if(a==null)return new A.jD(a)
if(a instanceof A.e3){s=a.a
return A.cb(a,s==null?A.b4(s):s)}if(typeof a!=="object")return a
if("dartException" in a)return A.cb(a,a.dartException)
return A.wF(a)},
cb(a,b){if(t.C.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
wF(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.b.L(r,16)&8191)===10)switch(q){case 438:return A.cb(a,A.op(A.t(s)+" (Error "+q+")",null))
case 445:case 5007:A.t(s)
return A.cb(a,new A.es())}}if(a instanceof TypeError){p=$.rn()
o=$.ro()
n=$.rp()
m=$.rq()
l=$.rt()
k=$.ru()
j=$.rs()
$.rr()
i=$.rw()
h=$.rv()
g=p.ak(s)
if(g!=null)return A.cb(a,A.op(A.Y(s),g))
else{g=o.ak(s)
if(g!=null){g.method="call"
return A.cb(a,A.op(A.Y(s),g))}else if(n.ak(s)!=null||m.ak(s)!=null||l.ak(s)!=null||k.ak(s)!=null||j.ak(s)!=null||m.ak(s)!=null||i.ak(s)!=null||h.ak(s)!=null){A.Y(s)
return A.cb(a,new A.es())}}return A.cb(a,new A.hD(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.eD()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.cb(a,new A.aS(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.eD()
return a},
ca(a){var s
if(a instanceof A.e3)return a.b
if(a==null)return new A.eZ(a)
s=a.$cachedTrace
if(s!=null)return s
s=new A.eZ(a)
if(typeof a==="object")a.$cachedTrace=s
return s},
nV(a){if(a==null)return J.b6(a)
if(typeof a=="object")return A.dm(a)
return J.b6(a)},
wQ(a){if(typeof a=="number")return B.c.gR(a)
if(a instanceof A.ic)return A.dm(a)
if(a instanceof A.bg)return a.gR(a)
return A.nV(a)},
r7(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.m(0,a[s],a[r])}return b},
w3(a,b,c,d,e,f){t.Z.a(a)
switch(A.E(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.e(new A.l6("Unsupported number of arguments for wrapped closure"))},
dL(a,b){var s=a.$identity
if(!!s)return s
s=A.wR(a,b)
a.$identity=s
return s},
wR(a,b){var s
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
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.w3)},
td(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.hm().constructor.prototype):Object.create(new A.cX(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.pw(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.t9(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.pw(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
t9(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.e("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.t3)}throw A.e("Error in functionType of tearoff")},
ta(a,b,c,d){var s=A.pu
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
pw(a,b,c,d){if(c)return A.tc(a,b,d)
return A.ta(b.length,d,a,b)},
tb(a,b,c,d){var s=A.pu,r=A.t4
switch(b?-1:a){case 0:throw A.e(new A.hg("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
tc(a,b,c){var s,r
if($.ps==null)$.ps=A.pr("interceptor")
if($.pt==null)$.pt=A.pr("receiver")
s=b.length
r=A.tb(s,c,a,b)
return r},
oW(a){return A.td(a)},
t3(a,b){return A.f7(v.typeUniverse,A.aa(a.a),b)},
pu(a){return a.a},
t4(a){return a.b},
pr(a){var s,r,q,p=new A.cX("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.e(A.aM("Field name "+a+" not found.",null))},
nE(a){return v.getIsolateTag(a)},
yn(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
xh(a){var s,r,q,p,o,n=A.Y($.r8.$1(a)),m=$.nD[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.nN[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.bh($.r2.$2(a,n))
if(q!=null){m=$.nD[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.nN[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.nR(s)
$.nD[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.nN[n]=s
return s}if(p==="-"){o=A.nR(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.rd(a,s)
if(p==="*")throw A.e(A.qo(n))
if(v.leafTags[n]===true){o=A.nR(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.rd(a,s)},
rd(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.p0(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
nR(a){return J.p0(a,!1,null,!!a.$iaF)},
xj(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.nR(s)
else return J.p0(s,c,null,null)},
x7(){if(!0===$.oZ)return
$.oZ=!0
A.x8()},
x8(){var s,r,q,p,o,n,m,l
$.nD=Object.create(null)
$.nN=Object.create(null)
A.x6()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.re.$1(o)
if(n!=null){m=A.xj(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
x6(){var s,r,q,p,o,n,m=B.aj()
m=A.dK(B.ak,A.dK(B.al,A.dK(B.X,A.dK(B.X,A.dK(B.am,A.dK(B.an,A.dK(B.ao(B.W),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.r8=new A.nK(p)
$.r2=new A.nL(o)
$.re=new A.nM(n)},
dK(a,b){return a(b)||b},
wT(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
pS(a,b,c,d,e,f){var s=b?"m":"",r=c?"":"i",q=d?"u":"",p=e?"s":"",o=function(g,h){try{return new RegExp(g,h)}catch(n){return n}}(a,s+r+q+p+f)
if(o instanceof RegExp)return o
throw A.e(A.iZ("Illegal RegExp pattern ("+String(o)+")",a,null))},
xC(a,b,c){var s=a.indexOf(b,c)
return s>=0},
wV(a){if(a.indexOf("$",0)>=0)return a.replace(/\$/g,"$$$$")
return a},
rf(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
p6(a,b,c){var s=A.xD(a,b,c)
return s},
xD(a,b,c){var s,r,q
if(b===""){if(a==="")return c
s=a.length
for(r=c,q=0;q<s;++q)r=r+a[q]+c
return r.charCodeAt(0)==0?r:r}if(a.indexOf(b,0)<0)return a
if(a.length<500||c.indexOf("$",0)>=0)return a.split(b).join(c)
return a.replace(new RegExp(A.rf(b),"g"),A.wV(c))},
o3(a,b,c,d){var s=a.indexOf(b,d)
if(s<0)return a
return A.xE(a,s,s+b.length,c)},
xE(a,b,c,d){return a.substring(0,b)+d+a.substring(c)},
z:function z(a,b){this.a=a
this.b=b},
b3:function b3(a,b,c){this.a=a
this.b=b
this.c=c},
d4:function d4(){},
al:function al(a,b,c){this.a=a
this.b=b
this.$ti=c},
cM:function cM(a,b){this.a=a
this.$ti=b},
bH:function bH(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
bQ:function bQ(a,b){this.a=a
this.$ti=b},
d5:function d5(){},
aW:function aW(a,b,c){this.a=a
this.b=b
this.$ti=c},
bR:function bR(a,b){this.a=a
this.$ti=b},
ex:function ex(){},
kU:function kU(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
es:function es(){},
fW:function fW(a,b,c){this.a=a
this.b=b
this.c=c},
hD:function hD(a){this.a=a},
jD:function jD(a){this.a=a},
e3:function e3(a,b){this.a=a
this.b=b},
eZ:function eZ(a){this.a=a
this.b=null},
bM:function bM(){},
fs:function fs(){},
ft:function ft(){},
ht:function ht(){},
hm:function hm(){},
cX:function cX(a,b){this.a=a
this.b=b},
hg:function hg(a){this.a=a},
aX:function aX(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
jo:function jo(a){this.a=a},
jv:function jv(a,b){var _=this
_.a=a
_.b=b
_.d=_.c=null},
am:function am(a,b){this.a=a
this.$ti=b},
eg:function eg(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
aY:function aY(a,b){this.a=a
this.$ti=b},
cu:function cu(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
cs:function cs(a,b){this.a=a
this.$ti=b},
ct:function ct(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
cq:function cq(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
nK:function nK(a){this.a=a},
nL:function nL(a){this.a=a},
nM:function nM(a){this.a=a},
bg:function bg(){},
dz:function dz(){},
dA:function dA(){},
ed:function ed(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
i4:function i4(a){this.b=a},
hF:function hF(a,b,c){this.a=a
this.b=b
this.c=c},
eK:function eK(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
eE:function eE(a,b){this.a=a
this.c=b},
i8:function i8(a,b,c){this.a=a
this.b=b
this.c=c},
i9:function i9(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
bK(a,b,c){},
a1(a){return a},
ue(a,b,c){var s
A.bK(a,b,c)
s=new DataView(a,b,c)
return s},
uf(a,b,c){A.bK(a,b,c)
return new Float32Array(a,b,c)},
ug(a,b,c){A.bK(a,b,c)
return new Float64Array(a,b,c)},
cz(a){return new Int32Array(A.a1(a))},
uh(a){return new Uint16Array(a)},
ui(a,b,c){A.bK(a,b,c)
return new Uint16Array(a,b,c)},
uj(a){return new Uint8Array(a)},
ot(a,b,c){A.bK(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
bJ(a,b,c){if(a>>>0!==a||a>=c)throw A.e(A.nC(b,a))},
bi(a,b,c){var s
if(!(a>>>0!==a))if(b==null)s=a>c
else s=b>>>0!==b||a>b||b>c
else s=!0
if(s)throw A.e(A.wU(a,b,c))
if(b==null)return c
return b},
bW:function bW(){},
dl:function dl(){},
eo:function eo(){},
lC:function lC(a){this.a=a},
en:function en(){},
ao:function ao(){},
bX:function bX(){},
aG:function aG(){},
cw:function cw(){},
cx:function cx(){},
h5:function h5(){},
cy:function cy(){},
h6:function h6(){},
cA:function cA(){},
ep:function ep(){},
eq:function eq(){},
bY:function bY(){},
eU:function eU(){},
eV:function eV(){},
eW:function eW(){},
eX:function eX(){},
ow(a,b){var s=b.c
return s==null?b.c=A.f5(a,"a7",[b.x]):s},
qc(a){var s=a.w
if(s===6||s===7)return A.qc(a.x)
return s===11||s===12},
uA(a){return a.as},
af(a){return A.lB(v.typeUniverse,a,!1)},
cS(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.cS(a1,s,a3,a4)
if(r===s)return a2
return A.qE(a1,r,!0)
case 7:s=a2.x
r=A.cS(a1,s,a3,a4)
if(r===s)return a2
return A.qD(a1,r,!0)
case 8:q=a2.y
p=A.dJ(a1,q,a3,a4)
if(p===q)return a2
return A.f5(a1,a2.x,p)
case 9:o=a2.x
n=A.cS(a1,o,a3,a4)
m=a2.y
l=A.dJ(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.oE(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.dJ(a1,j,a3,a4)
if(i===j)return a2
return A.qF(a1,k,i)
case 11:h=a2.x
g=A.cS(a1,h,a3,a4)
f=a2.y
e=A.wB(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.qC(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.dJ(a1,d,a3,a4)
o=a2.x
n=A.cS(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.oF(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.e(A.fm("Attempted to substitute unexpected RTI kind "+a0))}},
dJ(a,b,c,d){var s,r,q,p,o=b.length,n=A.lG(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.cS(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
wC(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.lG(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.cS(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
wB(a,b,c,d){var s,r=b.a,q=A.dJ(a,r,c,d),p=b.b,o=A.dJ(a,p,c,d),n=b.c,m=A.wC(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.hW()
s.a=q
s.b=o
s.c=m
return s},
b(a,b){a[v.arrayRti]=b
return a},
oX(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.x3(s)
return a.$S()}return null},
x9(a,b){var s
if(A.qc(b))if(a instanceof A.bM){s=A.oX(a)
if(s!=null)return s}return A.aa(a)},
aa(a){if(a instanceof A.o)return A.r(a)
if(Array.isArray(a))return A.L(a)
return A.oK(J.aj(a))},
L(a){var s=a[v.arrayRti],r=t.dG
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
r(a){var s=a.$ti
return s!=null?s:A.oK(a)},
oK(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.w_(a,s)},
w_(a,b){var s=a instanceof A.bM?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.vt(v.typeUniverse,s.name)
b.$ccache=r
return r},
x3(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.lB(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
x1(a){return A.bj(A.r(a))},
oT(a){var s
if(a instanceof A.bg)return a.d0()
s=a instanceof A.bM?A.oX(a):null
if(s!=null)return s
if(t.aJ.b(a))return J.po(a).a
if(Array.isArray(a))return A.L(a)
return A.aa(a)},
bj(a){var s=a.r
return s==null?a.r=new A.ic(a):s},
wW(a,b){var s,r,q=b,p=q.length
if(p===0)return t.aK
if(0>=p)return A.a(q,0)
s=A.f7(v.typeUniverse,A.oT(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.a(q,r)
s=A.qH(v.typeUniverse,s,A.oT(q[r]))}return A.f7(v.typeUniverse,s,a)},
aR(a){return A.bj(A.lB(v.typeUniverse,a,!1))},
vZ(a){var s=this
s.b=A.wz(s)
return s.b(a)},
wz(a){var s,r,q,p,o
if(a===t.K)return A.w9
if(A.cU(a))return A.wd
s=a.w
if(s===6)return A.vW
if(s===1)return A.qS
if(s===7)return A.w4
r=A.wy(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.cU)){a.f="$i"+q
if(q==="j")return A.w7
if(a===t.m)return A.w6
return A.wc}}else if(s===10){p=A.wT(a.x,a.y)
o=p==null?A.qS:p
return o==null?A.b4(o):o}return A.vU},
wy(a){if(a.w===8){if(a===t.S)return A.dF
if(a===t.i||a===t.cZ)return A.w8
if(a===t.N)return A.wb
if(a===t.y)return A.M}return null},
vY(a){var s=this,r=A.vT
if(A.cU(s))r=A.vF
else if(s===t.K)r=A.b4
else if(A.dN(s)){r=A.vV
if(s===t.aV)r=A.vD
else if(s===t.bl)r=A.bh
else if(s===t.fU)r=A.vB
else if(s===t.jh)r=A.ie
else if(s===t.jX)r=A.vC
else if(s===t.mU)r=A.vE}else if(s===t.S)r=A.E
else if(s===t.N)r=A.Y
else if(s===t.y)r=A.oG
else if(s===t.cZ)r=A.ae
else if(s===t.i)r=A.dD
else if(s===t.m)r=A.aQ
s.a=r
return s.a(a)},
vU(a){var s=this
if(a==null)return A.dN(s)
return A.xd(v.typeUniverse,A.x9(a,s),s)},
vW(a){if(a==null)return!0
return this.x.b(a)},
wc(a){var s,r=this
if(a==null)return A.dN(r)
s=r.f
if(a instanceof A.o)return!!a[s]
return!!J.aj(a)[s]},
w7(a){var s,r=this
if(a==null)return A.dN(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.o)return!!a[s]
return!!J.aj(a)[s]},
w6(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.o)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
qR(a){if(typeof a=="object"){if(a instanceof A.o)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
vT(a){var s=this
if(a==null){if(A.dN(s))return a}else if(s.b(a))return a
throw A.a9(A.qO(a,s),new Error())},
vV(a){var s=this
if(a==null||s.b(a))return a
throw A.a9(A.qO(a,s),new Error())},
qO(a,b){return new A.f3("TypeError: "+A.qr(a,A.aJ(b,null)))},
qr(a,b){return A.fJ(a)+": type '"+A.aJ(A.oT(a),null)+"' is not a subtype of type '"+b+"'"},
aP(a,b){return new A.f3("TypeError: "+A.qr(a,b))},
w4(a){var s=this
return s.x.b(a)||A.ow(v.typeUniverse,s).b(a)},
w9(a){return a!=null},
b4(a){if(a!=null)return a
throw A.a9(A.aP(a,"Object"),new Error())},
wd(a){return!0},
vF(a){return a},
qS(a){return!1},
M(a){return!0===a||!1===a},
oG(a){if(!0===a)return!0
if(!1===a)return!1
throw A.a9(A.aP(a,"bool"),new Error())},
vB(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.a9(A.aP(a,"bool?"),new Error())},
dD(a){if(typeof a=="number")return a
throw A.a9(A.aP(a,"double"),new Error())},
vC(a){if(typeof a=="number")return a
if(a==null)return a
throw A.a9(A.aP(a,"double?"),new Error())},
dF(a){return typeof a=="number"&&Math.floor(a)===a},
E(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.a9(A.aP(a,"int"),new Error())},
vD(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.a9(A.aP(a,"int?"),new Error())},
w8(a){return typeof a=="number"},
ae(a){if(typeof a=="number")return a
throw A.a9(A.aP(a,"num"),new Error())},
ie(a){if(typeof a=="number")return a
if(a==null)return a
throw A.a9(A.aP(a,"num?"),new Error())},
wb(a){return typeof a=="string"},
Y(a){if(typeof a=="string")return a
throw A.a9(A.aP(a,"String"),new Error())},
bh(a){if(typeof a=="string")return a
if(a==null)return a
throw A.a9(A.aP(a,"String?"),new Error())},
aQ(a){if(A.qR(a))return a
throw A.a9(A.aP(a,"JSObject"),new Error())},
vE(a){if(a==null)return a
if(A.qR(a))return a
throw A.a9(A.aP(a,"JSObject?"),new Error())},
r_(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.aJ(a[q],b)
return s},
wt(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.r_(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.aJ(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
qP(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
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
if(!(j===2||j===3||j===4||j===5||k===p))o+=" extends "+A.aJ(k,a4)}o+=">"}else o=""
p=a3.x
i=a3.y
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.aJ(p,a4)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.aJ(h[q],a4)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.aJ(f[q],a4)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.aJ(d[q+2],a4)+" "+d[q]}a+="}"}if(a2!=null){a4.toString
a4.length=a2}return o+"("+a+") => "+b},
aJ(a,b){var s,r,q,p,o,n,m,l=a.w
if(l===5)return"erased"
if(l===2)return"dynamic"
if(l===3)return"void"
if(l===1)return"Never"
if(l===4)return"any"
if(l===6){s=a.x
r=A.aJ(s,b)
q=s.w
return(q===11||q===12?"("+r+")":r)+"?"}if(l===7)return"FutureOr<"+A.aJ(a.x,b)+">"
if(l===8){p=A.wE(a.x)
o=a.y
return o.length>0?p+("<"+A.r_(o,b)+">"):p}if(l===10)return A.wt(a,b)
if(l===11)return A.qP(a,b,null)
if(l===12)return A.qP(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.a(b,n)
return b[n]}return"?"},
wE(a){var s=A.rh(a)
if(s!=null)return s
return"minified:"+a},
vu(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
vt(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.lB(a,b,!1)
else if(typeof m=="number"){s=m
r=A.f6(a,5,"#")
q=A.lG(s)
for(p=0;p<s;++p)q[p]=r
o=A.f5(a,b,q)
n[b]=o
return o}else return m},
vs(a,b){return A.qJ(a.tR,b)},
vr(a,b){return A.qJ(a.eT,b)},
lB(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.qG(a,null,b,!1)
r.set(b,s)
return s},
f7(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.qG(a,b,c,!0)
q.set(c,r)
return r},
qH(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.oE(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
qG(a,b,c,d){return A.vj(A.vd(a,b,c,d))},
c9(a,b){b.a=A.vY
b.b=A.vZ
return b},
f6(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.b_(null,null)
s.w=b
s.as=c
r=A.c9(a,s)
a.eC.set(c,r)
return r},
qE(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.vp(a,b,r,c)
a.eC.set(r,s)
return s},
vp(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.cU(b))if(!(b===t.P||b===t.T))if(s!==6)r=s===7&&A.dN(b.x)
if(r)return b
else if(s===1)return t.P}q=new A.b_(null,null)
q.w=6
q.x=b
q.as=c
return A.c9(a,q)},
qD(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.vn(a,b,r,c)
a.eC.set(r,s)
return s},
vn(a,b,c,d){var s,r
if(d){s=b.w
if(A.cU(b)||b===t.K)return b
else if(s===1)return A.f5(a,"a7",[b])
else if(b===t.P||b===t.T)return t.gK}r=new A.b_(null,null)
r.w=7
r.x=b
r.as=c
return A.c9(a,r)},
vq(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.b_(null,null)
s.w=13
s.x=b
s.as=q
r=A.c9(a,s)
a.eC.set(q,r)
return r},
f4(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
vm(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
f5(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.f4(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.b_(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.c9(a,r)
a.eC.set(p,q)
return q},
oE(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.f4(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.b_(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.c9(a,o)
a.eC.set(q,n)
return n},
qF(a,b,c){var s,r,q="+"+(b+"("+A.f4(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.b_(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.c9(a,s)
a.eC.set(q,r)
return r},
qC(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.f4(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.f4(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.vm(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.b_(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.c9(a,p)
a.eC.set(r,o)
return o},
oF(a,b,c,d){var s,r=b.as+("<"+A.f4(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.vo(a,b,c,r,d)
a.eC.set(r,s)
return s},
vo(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.lG(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.cS(a,b,r,0)
m=A.dJ(a,c,r,0)
return A.oF(a,n,m,c!==m)}}l=new A.b_(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.c9(a,l)},
vd(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
vj(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.vf(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.qx(a,r,l,k,!1)
else if(q===46)r=A.qx(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.cQ(a.u,a.e,k.pop()))
break
case 94:k.push(A.vq(a.u,k.pop()))
break
case 35:k.push(A.f6(a.u,5,"#"))
break
case 64:k.push(A.f6(a.u,2,"@"))
break
case 126:k.push(A.f6(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.vh(a,k)
break
case 38:A.vg(a,k)
break
case 63:p=a.u
k.push(A.qE(p,A.cQ(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.qD(p,A.cQ(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.ve(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.qy(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.vk(a.u,a.e,o)
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
return A.cQ(a.u,a.e,m)},
vf(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
qx(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.vu(s,o.x)[p]
if(n==null)A.n('No "'+p+'" in "'+A.uA(o)+'"')
d.push(A.f7(s,o,n))}else d.push(p)
return m},
vh(a,b){var s,r=a.u,q=A.qw(a,b),p=b.pop()
if(typeof p=="string")b.push(A.f5(r,p,q))
else{s=A.cQ(r,a.e,p)
switch(s.w){case 11:b.push(A.oF(r,s,q,a.n))
break
default:b.push(A.oE(r,s,q))
break}}},
ve(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.qw(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.cQ(p,a.e,o)
q=new A.hW()
q.a=s
q.b=n
q.c=m
b.push(A.qC(p,r,q))
return
case-4:b.push(A.qF(p,b.pop(),s))
return
default:throw A.e(A.fm("Unexpected state under `()`: "+A.t(o)))}},
vg(a,b){var s=b.pop()
if(0===s){b.push(A.f6(a.u,1,"0&"))
return}if(1===s){b.push(A.f6(a.u,4,"1&"))
return}throw A.e(A.fm("Unexpected extended operation "+A.t(s)))},
qw(a,b){var s=b.splice(a.p)
A.qy(a.u,a.e,s)
a.p=b.pop()
return s},
cQ(a,b,c){if(typeof c=="string")return A.f5(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.vi(a,b,c)}else return c},
qy(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.cQ(a,b,c[s])},
vk(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.cQ(a,b,c[s])},
vi(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.e(A.fm("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.e(A.fm("Bad index "+c+" for "+b.q(0)))},
xd(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.ac(a,b,null,c,null)
r.set(c,s)}return s},
ac(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.cU(d))return!0
s=b.w
if(s===4)return!0
if(A.cU(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.ac(a,c[b.x],c,d,e))return!0
q=d.w
p=t.P
if(b===p||b===t.T){if(q===7)return A.ac(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.ac(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.ac(a,b.x,c,d,e))return!1
return A.ac(a,A.ow(a,b),c,d,e)}if(s===6)return A.ac(a,p,c,d,e)&&A.ac(a,b.x,c,d,e)
if(q===7){if(A.ac(a,b,c,d.x,e))return!0
return A.ac(a,b,c,A.ow(a,d),e)}if(q===6)return A.ac(a,b,c,p,e)||A.ac(a,b,c,d.x,e)
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
if(!A.ac(a,j,c,i,e)||!A.ac(a,i,e,j,c))return!1}return A.qQ(a,b.x,c,d.x,e)}if(q===11){if(b===t.et)return!0
if(p)return!1
return A.qQ(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.w5(a,b,c,d,e)}if(o&&q===10)return A.wa(a,b,c,d,e)
return!1},
qQ(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.ac(a3,a4.x,a5,a6.x,a7))return!1
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
if(!A.ac(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.ac(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.ac(a3,k[h],a7,g,a5))return!1}f=s.c
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
if(!A.ac(a3,e[a+2],a7,g,a5))return!1
break}}while(b<d){if(f[b+1])return!1
b+=3}return!0},
w5(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.f7(a,b,r[o])
return A.qK(a,p,null,c,d.y,e)}return A.qK(a,b.y,null,c,d.y,e)},
qK(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.ac(a,b[s],d,e[s],f))return!1
return!0},
wa(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.ac(a,r[s],c,q[s],e))return!1
return!0},
dN(a){var s=a.w,r=!0
if(!(a===t.P||a===t.T))if(!A.cU(a))if(s!==6)r=s===7&&A.dN(a.x)
return r},
cU(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.O},
qJ(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
lG(a){return a>0?new Array(a):v.typeUniverse.sEA},
b_:function b_(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
hW:function hW(){this.c=this.b=this.a=null},
ic:function ic(a){this.a=a},
hQ:function hQ(){},
f3:function f3(a){this.a=a},
v_(){var s,r,q
if(self.scheduleImmediate!=null)return A.wI()
if(self.MutationObserver!=null&&self.document!=null){s={}
r=self.document.createElement("div")
q=self.document.createElement("span")
s.a=null
new self.MutationObserver(A.dL(new A.l2(s),1)).observe(r,{childList:true})
return new A.l1(s,r,q)}else if(self.setImmediate!=null)return A.wJ()
return A.wK()},
v0(a){self.scheduleImmediate(A.dL(new A.l3(t.M.a(a)),0))},
v1(a){self.setImmediate(A.dL(new A.l4(t.M.a(a)),0))},
v2(a){A.oz(B.ax,t.M.a(a))},
oz(a,b){return A.vl(a.a/1000|0,b)},
vl(a,b){var s=new A.lz()
s.ek(a,b)
return s},
av(a){return new A.hG(new A.K($.H,a.i("K<0>")),a.i("hG<0>"))},
au(a,b){a.$2(0,null)
b.b=!0
return b.a},
W(a,b){A.vG(a,b)},
at(a,b){b.ca(a)},
as(a,b){b.cb(A.bk(a),A.ca(a))},
vG(a,b){var s,r,q=new A.lI(b),p=new A.lJ(b)
if(a instanceof A.K)a.ds(q,p,t.z)
else{s=t.z
if(a instanceof A.K)a.b7(q,p,s)
else{r=new A.K($.H,t._)
r.a=8
r.c=a
r.ds(q,p,s)}}},
aw(a){var s=function(b,c){return function(d,e){while(true){try{b(d,e)
break}catch(r){e=r
d=c}}}}(a,1)
return $.H.cq(new A.nt(s),t.o,t.S,t.z)},
qB(a,b,c){return 0},
oh(a){var s
if(t.C.b(a)){s=a.gaR()
if(s!=null)return s}return B.x},
tA(a,b){var s
if(!b.b(null))throw A.e(A.io(null,"computation","The type parameter is not nullable"))
s=new A.K($.H,b.i("K<0>"))
A.ql(a,new A.j0(null,s,b))
return s},
w0(a,b){if($.H===B.f)return null
return null},
w1(a,b){if($.H!==B.f)A.w0(a,b)
if(b==null)if(t.C.b(a)){b=a.gaR()
if(b==null){A.q8(a,B.x)
b=B.x}}else b=B.x
else if(t.C.b(a))A.q8(a,b)
return new A.ah(a,b)},
lb(a,b,c){var s,r,q,p,o={},n=o.a=a
for(s=t._;r=n.a,(r&4)!==0;n=a){a=s.a(n.c)
o.a=a}if(n===b){s=A.qe()
b.aV(new A.ah(new A.aS(!0,n,null,"Cannot complete a future with itself"),s))
return}q=b.a&1
s=n.a=r|q
if((s&24)===0){p=t.F.a(b.c)
b.a=b.a&1|4
b.c=n
n.dg(p)
return}if(!c)if(b.c==null)n=(s&16)===0||q!==0
else n=!1
else n=!0
if(n){p=b.aY()
b.bf(o.a)
A.cL(b,p)
return}b.a^=2
A.dI(null,null,b.b,t.M.a(new A.lc(o,b)))},
cL(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d={},c=d.a=a
for(s=t.v,r=t.F;;){q={}
p=c.a
o=(p&16)===0
n=!o
if(b==null){if(n&&(p&1)===0){m=s.a(c.c)
A.ih(m.a,m.b)}return}q.a=b
l=b.a
for(c=b;l!=null;c=l,l=k){c.a=null
A.cL(d.a,c)
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
A.ih(j.a,j.b)
return}g=$.H
if(g!==h)$.H=h
else g=null
c=c.c
if((c&15)===8)new A.lg(q,d,n).$0()
else if(o){if((c&1)!==0)new A.lf(q,j).$0()}else if((c&2)!==0)new A.le(d,q).$0()
if(g!=null)$.H=g
c=q.c
if(c instanceof A.K){p=q.a.$ti
p=p.i("a7<2>").b(c)||!p.y[1].b(c)}else p=!1
if(p){f=q.a.b
if((c.a&24)!==0){e=r.a(f.c)
f.c=null
b=f.bn(e)
f.a=c.a&30|f.a&1
f.c=c.c
d.a=c
continue}else A.lb(c,f,!0)
return}}f=q.a.b
e=r.a(f.c)
f.c=null
b=f.bn(e)
c=q.b
p=q.c
if(!c){f.$ti.c.a(p)
f.a=8
f.c=p}else{s.a(p)
f.a=f.a&1|16
f.c=p}d.a=f
c=f}},
wu(a,b){var s
if(t.ng.b(a))return b.cq(a,t.z,t.K,t.l)
s=t.A
if(s.b(a))return s.a(a)
throw A.e(A.io(a,"onError",u.c))},
wm(){var s,r
for(s=$.dH;s!=null;s=$.dH){$.fc=null
r=s.b
$.dH=r
if(r==null)$.fb=null
s.a.$0()}},
wA(){$.oM=!0
try{A.wm()}finally{$.fc=null
$.oM=!1
if($.dH!=null)$.pd().$1(A.r3())}},
r0(a){var s=new A.hH(a),r=$.fb
if(r==null){$.dH=$.fb=s
if(!$.oM)$.pd().$1(A.r3())}else $.fb=r.b=s},
wx(a){var s,r,q,p=$.dH
if(p==null){A.r0(a)
$.fc=$.fb
return}s=new A.hH(a)
r=$.fc
if(r==null){s.b=p
$.dH=$.fc=s}else{q=r.b
s.b=q
$.fc=r.b=s
if(q==null)$.fb=s}},
xx(a){var s=null,r=$.H
if(B.f===r){A.dI(s,s,B.f,a)
return}A.dI(s,s,r,t.M.a(r.c9(a)))},
xU(a,b){return new A.cR(A.fe(a,"stream",t.K),b.i("cR<0>"))},
oR(a){return},
v3(a,b){if(b==null)b=A.wL()
if(t.b9.b(b))return a.cq(b,t.z,t.K,t.l)
if(t.i6.b(b))return t.A.a(b)
throw A.e(A.aM("handleError callback must take either an Object (the error), or both an Object (the error) and a StackTrace.",null))},
wo(a,b){A.ih(a,b)},
ql(a,b){var s=$.H
if(s===B.f)return A.oz(a,t.M.a(b))
return A.oz(a,t.M.a(s.c9(b)))},
ih(a,b){A.wx(new A.no(a,b))},
qY(a,b,c,d,e){var s,r=$.H
if(r===c)return d.$0()
$.H=c
s=r
try{r=d.$0()
return r}finally{$.H=s}},
qZ(a,b,c,d,e,f,g){var s,r=$.H
if(r===c)return d.$1(e)
$.H=c
s=r
try{r=d.$1(e)
return r}finally{$.H=s}},
ww(a,b,c,d,e,f,g,h,i){var s,r=$.H
if(r===c)return d.$2(e,f)
$.H=c
s=r
try{r=d.$2(e,f)
return r}finally{$.H=s}},
dI(a,b,c,d){t.M.a(d)
if(B.f!==c){d=c.c9(d)
d=d}A.r0(d)},
l2:function l2(a){this.a=a},
l1:function l1(a,b,c){this.a=a
this.b=b
this.c=c},
l3:function l3(a){this.a=a},
l4:function l4(a){this.a=a},
lz:function lz(){this.b=null},
lA:function lA(a,b){this.a=a
this.b=b},
hG:function hG(a,b){this.a=a
this.b=!1
this.$ti=b},
lI:function lI(a){this.a=a},
lJ:function lJ(a){this.a=a},
nt:function nt(a){this.a=a},
f2:function f2(a,b){var _=this
_.a=a
_.e=_.d=_.c=_.b=null
_.$ti=b},
dC:function dC(a,b){this.a=a
this.$ti=b},
ah:function ah(a,b){this.a=a
this.b=b},
j0:function j0(a,b,c){this.a=a
this.b=b
this.c=c},
kT:function kT(a,b){this.a=a
this.b=b},
hM:function hM(){},
eM:function eM(a,b){this.a=a
this.$ti=b},
b1:function b1(a,b,c,d,e){var _=this
_.a=null
_.b=a
_.c=b
_.d=c
_.e=d
_.$ti=e},
K:function K(a,b){var _=this
_.a=0
_.b=a
_.c=null
_.$ti=b},
l8:function l8(a,b){this.a=a
this.b=b},
ld:function ld(a,b){this.a=a
this.b=b},
lc:function lc(a,b){this.a=a
this.b=b},
la:function la(a,b){this.a=a
this.b=b},
l9:function l9(a,b){this.a=a
this.b=b},
lg:function lg(a,b,c){this.a=a
this.b=b
this.c=c},
lh:function lh(a,b){this.a=a
this.b=b},
li:function li(a){this.a=a},
lf:function lf(a,b){this.a=a
this.b=b},
le:function le(a,b){this.a=a
this.b=b},
lj:function lj(a,b){this.a=a
this.b=b},
lk:function lk(a,b,c){this.a=a
this.b=b
this.c=c},
ll:function ll(a,b){this.a=a
this.b=b},
hH:function hH(a){this.a=a
this.b=null},
dp:function dp(){},
k7:function k7(a,b){this.a=a
this.b=b},
k8:function k8(a,b){this.a=a
this.b=b},
f_:function f_(){},
ly:function ly(a){this.a=a},
lx:function lx(a){this.a=a},
hI:function hI(){},
du:function du(a,b,c,d,e){var _=this
_.a=null
_.b=0
_.d=a
_.e=b
_.f=c
_.r=d
_.$ti=e},
dy:function dy(a,b){this.a=a
this.$ti=b},
cI:function cI(a,b,c,d,e){var _=this
_.w=a
_.a=b
_.d=c
_.e=d
_.r=_.f=null
_.$ti=e},
dv:function dv(){},
f1:function f1(){},
eO:function eO(){},
cJ:function cJ(a,b){this.b=a
this.a=null
this.$ti=b},
b2:function b2(a){var _=this
_.a=0
_.c=_.b=null
_.$ti=a},
lt:function lt(a,b){this.a=a
this.b=b},
cR:function cR(a,b){var _=this
_.a=null
_.b=a
_.c=!1
_.$ti=b},
f9:function f9(){},
i7:function i7(){},
lw:function lw(a,b){this.a=a
this.b=b},
no:function no(a,b){this.a=a
this.b=b},
pX(a,b){return new A.aX(a.i("@<0>").G(b).i("aX<1,2>"))},
eh(a,b,c){return b.i("@<0>").G(c).i("oq<1,2>").a(A.r7(a,new A.aX(b.i("@<0>").G(c).i("aX<1,2>"))))},
C(a,b){return new A.aX(a.i("@<0>").G(b).i("aX<1,2>"))},
pY(a){return new A.cO(a.i("cO<0>"))},
aZ(a){return new A.cO(a.i("cO<0>"))},
oC(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
vc(a,b,c){var s=new A.cP(a,b,c.i("cP<0>"))
s.c=a.e
return s},
u_(a,b){var s=J.G(a)
if(s.n())return s.gp()
return null},
tZ(a,b,c){var s
A.ap(b,"index")
s=J.q(a)
if(b>=s.gl(a))return null
return s.M(a,b)},
u6(a,b){var s,r,q=A.pY(b)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.i)(a),++r)q.k(0,b.a(a[r]))
return q},
os(a){var s,r
if(A.p_(a))return"{...}"
s=new A.be("")
try{r={}
B.a.k($.aK,a)
s.a+="{"
r.a=!0
a.Y(0,new A.jx(r,s))
s.a+="}"}finally{if(0>=$.aK.length)return A.a($.aK,-1)
$.aK.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
u7(a,b,c){var s,r,q=A.L(b),p=new J.aT(b,b.length,q.i("aT<1>")),o=A.L(c),n=new J.aT(c,c.length,o.i("aT<1>")),m=p.n(),l=n.n()
q=q.c
o=o.c
for(;;){if(!(m&&l))break
s=p.d
if(s==null)s=q.a(s)
r=n.d
a.m(0,s,r==null?o.a(r):r)
m=p.n()
l=n.n()}if(m||l)throw A.e(A.aM("Iterables do not have same length.",null))},
cO:function cO(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
i3:function i3(a){this.a=a
this.b=null},
cP:function cP(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
y:function y(){},
O:function O(){},
jw:function jw(a){this.a=a},
jx:function jx(a,b){this.a=a
this.b=b},
eR:function eR(a,b){this.a=a
this.$ti=b},
eS:function eS(a,b,c){var _=this
_.a=a
_.b=b
_.c=null
_.$ti=c},
bx:function bx(){},
eY:function eY(){},
wq(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.bk(r)
q=A.iZ(String(s),null,null)
throw A.e(q)}q=A.lS(p)
return q},
lS(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.i0(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.lS(a[s])
return a},
vx(a,b,c){var s,r,q,p,o,n=c-b
if(n<=4096)s=$.rA()
else s=new Uint8Array(n)
for(r=a.length,q=0;q<n;++q){p=b+q
if(!(p<r))return A.a(a,p)
o=a[p]
if((o&255)!==o)o=255
s[q]=o}return s},
vw(a,b,c,d){var s=a?$.rz():$.ry()
if(s==null)return null
if(0===c&&d===b.length)return A.qI(s,b)
return A.qI(s,b.subarray(c,d))},
qI(a,b){var s,r
try{s=a.decode(b)
return s}catch(r){}return null},
pT(a,b,c){return new A.ef(a,b)},
vQ(a){return a.ip()},
v9(a,b){return new A.lp(a,[],A.wS())},
va(a,b,c){var s,r=new A.be(""),q=A.v9(r,b)
q.bE(a)
s=r.a
return s.charCodeAt(0)==0?s:s},
vy(a){switch(a){case 65:return"Missing extension byte"
case 67:return"Unexpected extension byte"
case 69:return"Invalid UTF-8 byte"
case 71:return"Overlong encoding"
case 73:return"Out of unicode range"
case 75:return"Encoded surrogate"
case 77:return"Unfinished UTF-8 octet sequence"
default:return""}},
i0:function i0(a,b){this.a=a
this.b=b
this.c=null},
lo:function lo(a){this.a=a},
i1:function i1(a){this.a=a},
lE:function lE(){},
lD:function lD(){},
d3:function d3(){},
fA:function fA(){},
fI:function fI(){},
ef:function ef(a,b){this.a=a
this.b=b},
fY:function fY(a,b){this.a=a
this.b=b},
fX:function fX(){},
jq:function jq(a){this.b=a},
jp:function jp(a){this.a=a},
lq:function lq(){},
lr:function lr(a,b){this.a=a
this.b=b},
lp:function lp(a,b,c){this.c=a
this.a=b
this.b=c},
hE:function hE(){},
kY:function kY(){},
lF:function lF(a){this.b=0
this.c=a},
kX:function kX(a){this.a=a},
id:function id(a){this.a=a
this.b=16
this.c=0},
tw(a,b){a=A.a9(a,new Error())
if(a==null)a=A.b4(a)
a.stack=b.q(0)
throw a},
T(a,b,c,d){var s,r=c?J.pN(a,d):J.on(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
pZ(a,b,c){var s,r,q=A.b([],c.i("k<0>"))
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.i)(a),++r)B.a.k(q,c.a(a[r]))
if(b)return q
q.$flags=1
return q},
a3(a,b){var s,r
if(Array.isArray(a))return A.b(a.slice(0),b.i("k<0>"))
s=A.b([],b.i("k<0>"))
for(r=J.G(a);r.n();)B.a.k(s,r.gp())
return s},
ei(a,b,c,d){var s,r=c?J.pN(a,d):J.on(a,d)
for(s=0;s<a;++s)B.a.m(r,s,b.$1(s))
return r},
or(a,b){var s=A.pZ(a,!1,b)
s.$flags=3
return s},
k9(a,b,c){var s,r,q,p,o
A.ap(b,"start")
s=c==null
r=!s
if(r){q=c-b
if(q<0)throw A.e(A.a4(c,b,null,"end",null))
if(q===0)return""}if(Array.isArray(a)){p=a
o=p.length
if(s)c=o
return A.q7(b>0||c<o?p.slice(b,c):p)}if(t.hD.b(a))return A.uK(a,b,c)
if(r)a=J.rW(a,c)
if(b>0)a=J.cV(a,b)
s=A.a3(a,t.S)
return A.q7(s)},
uK(a,b,c){var s=a.length
if(b>=s)return""
return A.uu(a,b,c==null||c>s?s:c)},
jO(a){return new A.ed(a,A.pS(a,!1,!0,!1,!1,""))},
qf(a,b,c){var s=J.G(b)
if(!s.n())return a
if(c.length===0){do a+=A.t(s.gp())
while(s.n())}else{a+=A.t(s.gp())
while(s.n())a=a+c+A.t(s.gp())}return a},
vv(a,b,c,d){var s,r,q,p,o,n="0123456789ABCDEF"
if(c===B.w){s=$.rx()
s=s.b.test(b)}else s=!1
if(s)return b
r=B.aq.cc(b)
for(s=r.length,q=0,p="";q<s;++q){o=r[q]
if(o<128&&("\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u03f6\x00\u0404\u03f4 \u03f4\u03f6\u01f6\u01f6\u03f6\u03fc\u01f4\u03ff\u03ff\u0584\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u05d4\u01f4\x00\u01f4\x00\u0504\u05c4\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u0400\x00\u0400\u0200\u03f7\u0200\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u03ff\u0200\u0200\u0200\u03f7\x00".charCodeAt(o)&a)!==0)p+=A.S(o)
else p=p+"%"+n[o>>>4&15]+n[o&15]}return p.charCodeAt(0)==0?p:p},
qe(){return A.ca(new Error())},
tv(a,b,c){var s,r
for(s=0;s<3;++s){r=a[s]
if(r.b===b)return r}throw A.e(A.io(b,"name","No enum value with that name"))},
fJ(a){if(typeof a=="number"||A.M(a)||a==null)return J.b7(a)
if(typeof a=="string")return JSON.stringify(a)
return A.q6(a)},
tx(a,b){A.fe(a,"error",t.K)
A.fe(b,"stackTrace",t.l)
A.tw(a,b)},
fm(a){return new A.fl(a)},
aM(a,b){return new A.aS(!1,null,b,a)},
io(a,b,c){return new A.aS(!0,a,b,c)},
dR(a,b,c){return a},
q9(a,b){return new A.ev(null,null,!0,a,b,"Value not in range")},
a4(a,b,c,d,e){return new A.ev(b,c,!0,a,d,"Invalid value")},
uv(a,b,c,d){if(a<b||a>c)throw A.e(A.a4(a,b,c,d,null))
return a},
az(a,b,c){if(0>a||a>c)throw A.e(A.a4(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.e(A.a4(b,a,c,"end",null))
return b}return c},
ap(a,b){if(a<0)throw A.e(A.a4(a,0,null,b,null))
return a},
jl(a,b,c,d){return new A.fR(b,!0,a,d,"Index out of range")},
ar(a){return new A.eI(a)},
qo(a){return new A.hC(a)},
cC(a){return new A.c1(a)},
a6(a){return new A.fw(a)},
iZ(a,b,c){return new A.e7(a,b,c)},
u0(a,b,c){var s,r
if(A.p_(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.b([],t.s)
B.a.k($.aK,a)
try{A.we(a,s)}finally{if(0>=$.aK.length)return A.a($.aK,-1)
$.aK.pop()}r=A.qf(b,t.e7.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
ol(a,b,c){var s,r
if(A.p_(a))return b+"..."+c
s=new A.be(b)
B.a.k($.aK,a)
try{r=s
r.a=A.qf(r.a,a,", ")}finally{if(0>=$.aK.length)return A.a($.aK,-1)
$.aK.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
we(a,b){var s,r,q,p,o,n,m,l=a.gt(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.n())return
s=A.t(l.gp())
B.a.k(b,s)
k+=s.length+2;++j}if(!l.n()){if(j<=5)return
if(0>=b.length)return A.a(b,-1)
r=b.pop()
if(0>=b.length)return A.a(b,-1)
q=b.pop()}else{p=l.gp();++j
if(!l.n()){if(j<=4){B.a.k(b,A.t(p))
return}r=A.t(p)
if(0>=b.length)return A.a(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gp();++j
for(;l.n();p=o,o=n){n=l.gp();++j
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
q_(a,b,c,d,e){return new A.cf(a,b.i("@<0>").G(c).G(d).G(e).i("cf<1,2,3,4>"))},
ou(a,b,c,d){var s
if(B.I===c){s=B.b.gR(a)
b=J.b6(b)
return A.kw(A.bA(A.bA($.ij(),s),b))}if(B.I===d){s=B.b.gR(a)
b=J.b6(b)
c=J.b6(c)
return A.kw(A.bA(A.bA(A.bA($.ij(),s),b),c))}s=B.b.gR(a)
b=J.b6(b)
c=J.b6(c)
d=J.b6(d)
d=A.kw(A.bA(A.bA(A.bA(A.bA($.ij(),s),b),c),d))
return d},
ul(a){var s,r,q=$.ij()
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.i)(a),++r)q=A.bA(q,J.b6(a[r]))
return A.kw(q)},
vN(a,b){return 65536+((a&1023)<<10)+(b&1023)},
b9:function b9(a){this.a=a},
hP:function hP(){},
V:function V(){},
fl:function fl(a){this.a=a},
bB:function bB(){},
aS:function aS(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ev:function ev(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
fR:function fR(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
eI:function eI(a){this.a=a},
hC:function hC(a){this.a=a},
c1:function c1(a){this.a=a},
fw:function fw(a){this.a=a},
h8:function h8(){},
eD:function eD(){},
l6:function l6(a){this.a=a},
e7:function e7(a,b,c){this.a=a
this.b=b
this.c=c},
f:function f(){},
a8:function a8(a,b,c){this.a=a
this.b=b
this.$ti=c},
ab:function ab(){},
o:function o(){},
ia:function ia(){},
c_:function c_(a){this.a=a},
dn:function dn(a){var _=this
_.a=a
_.c=_.b=0
_.d=-1},
be:function be(a){this.a=a},
qN(a,b,c,d){if(a)return""+d+"-"+c+"-begin"
if(b)return""+d+"-"+c+"-end"
return c},
qX(a){var s=$.dE.h(0,a)
if(s==null)return a
return a+"-"+A.t(s)},
vP(a){var s,r
if(!$.dE.J(a))return
s=$.dE.h(0,a)
s.toString
r=s-1
s=$.dE
if(r<=0)s.ap(0,a)
else s.m(0,a,r)},
wv(a,b,c,d,e){var s,r,q,p,o,n
if(c===9||c===11||c===10)return
if($.dG>1e4&&$.dE.a===0){$.fh().clearMarks()
$.fh().clearMeasures()
$.dG=0}s=c===1||c===5
r=c===2||c===7
q=A.qN(s,r,d,a)
if(s){p=$.dE.h(0,q)
if(p==null)p=0
$.dE.m(0,q,p+1)
q=A.qX(q)}o=$.fh()
o.toString
o.mark(q,A.aQ($.rD().parse(e)))
$.dG=$.dG+1
if(r){n=A.qN(!0,!1,d,a)
o=$.fh()
o.toString
o.measure(d,A.qX(n),q)
$.dG=$.dG+1
A.vP(n)}B.b.D($.dG,0,10001)},
qk(a,b){if($.fh()==null)return
A.wv(0,-1,4,a,A.vA(b))},
vA(a){var s=a.a
if(s===0)return"{}"
return B.e.ho(a)},
nl:function nl(){},
m5:function m5(){},
jC:function jC(a){this.a=a},
vK(a,b,c){t.Z.a(a)
if(A.E(c)>=1)return a.$1(b)
return a.$0()},
p5(a,b){var s=new A.K($.H,b.i("K<0>")),r=new A.eM(s,b.i("eM<0>"))
a.then(A.dL(new A.nW(r,b),1),A.dL(new A.nX(r),1))
return s},
nW:function nW(a,b){this.a=a
this.b=b},
nX:function nX(a){this.a=a},
c4:function c4(a,b){this.a=a
this.b=b},
pC(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g=b.length,f=g!==0
if(f){if(0>=g)return A.a(b,0)
s=b[0]*2}else s=a.length
r=A.pA(a,0,s,2,null,!0)
q=A.b([],t.t)
if(r!=null){g=r.e
g===$&&A.u()
p=r.d
p===$&&A.u()
p=g===p
g=p}else g=!0
if(g)return q
if(f)r=A.tk(a,b,r,2)
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
h=5e-324}A.fF(r,q,2,l,m,h,-2147483648)
return q},
fF(a,b,c,d,e,f,g){var s,r,q,p,o
if(a==null)return
s=g===-2147483648
if(s&&f!==5e-324)A.tn(a,d,e,f)
r=f!==5e-324
q=a
for(;;){p=a.d
p===$&&A.u()
o=a.e
o===$&&A.u()
if(!(p!==o))break
A:{if(r?A.tq(a,d,e,f):A.tp(a)){B.a.k(b,B.b.a7(p.a,c))
B.a.k(b,B.b.a7(a.a,c))
B.a.k(b,B.b.a7(o.a,c))
A.fH(a)
p=o.e
p===$&&A.u()
q=p
a=q
break A}if(o===q){if(s)A.fF(A.ch(o,null),b,c,d,e,f,1)
else if(g===1){s=A.ch(o,null)
s.toString
A.fF(A.tj(s,b,c),b,c,d,e,f,2)}else if(g===2)A.tu(o,b,c,d,e,f)
break}a=o}}},
tu(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k=-2147483648,j=a
do{s=j.e
s===$&&A.u()
s=s.e
s===$&&A.u()
r=j.a
q=j.b
p=j.c
o=s
for(;;){s=j.d
s===$&&A.u()
if(!(o!==s))break
n=o.a
m=!1
if(r!==n)if(j.e.a!==n)if(s.a!==n)if(!A.to(j,o)){s=!1
if(A.fG(j,o))if(A.fG(o,j))if(A.tr(j,o)){s=j.d
n=o.d
n===$&&A.u()
s=A.a5(s,j,n)!==0||A.a5(j,n,o)!==0}if(!s)if(q===o.b&&p===o.c)if(A.a5(j.d,j,j.e)>0){s=o.d
s===$&&A.u()
n=o.e
n===$&&A.u()
n=A.a5(s,o,n)>0
s=n}else s=m
else s=m
else s=!0}else s=m
else s=m
else s=m
else s=m
if(s){l=A.pB(j,o)
s=A.ch(j,j.e)
s.toString
r=l.e
r===$&&A.u()
r=A.ch(l,r)
r.toString
A.fF(s,b,c,d,e,f,k)
A.fF(r,b,c,d,e,f,k)
return}s=o.e
s===$&&A.u()
o=s}j=j.e}while(j!==a)},
tr(a,b){var s,r,q,p,o=(a.b+b.b)/2,n=(a.c+b.c)/2,m=a,l=!1
do{s=m.c
r=m.e
r===$&&A.u()
q=r.c
if(s>n!==q>n){p=m.b
p=o<(r.b-p)*(n-s)/(q-s)+p
s=p}else s=!1
if(s)l=!l
if(r!==a){m=r
continue}else break}while(!0)
return l},
to(a,b){var s,r,q,p=a.a,o=b.a,n=a
do{s=n.a
if(s!==p){r=n.e
r===$&&A.u()
q=r.a
s=q!==p&&s!==o&&q!==o&&A.pz(n,r,a,b)}else s=!1
if(s)return!0
s=n.e
s===$&&A.u()
if(s!==a){n=s
continue}else break}while(!0)
return!1},
pz(a,b,c,d){var s,r,q,p,o=a.b,n=c.b
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
if(s===0&&A.iR(a,c,b))return!0
if(r===0&&A.iR(a,d,b))return!0
if(q===0&&A.iR(c,a,d))return!0
if(p===0&&A.iR(c,b,d))return!0
return!1},
iR(a,b,c){var s=b.b,r=a.b,q=c.b,p=!1
if(s<=Math.max(r,q))if(s>=Math.min(r,q)){s=b.c
r=a.c
q=c.c
s=s<=Math.max(r,q)&&s>=Math.min(r,q)}else s=p
else s=p
return s},
tj(a,b,c){var s,r,q,p=a
do{s=p.d
s===$&&A.u()
r=p.e
r===$&&A.u()
q=r.e
q===$&&A.u()
if(!(s.b===q.b&&s.c===q.c)&&A.pz(s,p,r,q)&&A.fG(s,q)&&A.fG(q,s)){B.a.k(b,B.b.a7(s.a,c))
B.a.k(b,B.b.a7(p.a,c))
B.a.k(b,B.b.a7(q.a,c))
A.fH(p)
A.fH(p.e)
p=q
a=p}s=p.e
s===$&&A.u()
if(s!==a){p=s
continue}else break}while(!0)
return A.ch(s,null)},
tp(a){var s,r,q,p,o,n,m,l,k,j=a.d
j===$&&A.u()
s=a.e
s===$&&A.u()
if(A.a5(j,a,s)>=0)return!1
r=s.e
r===$&&A.u()
for(q=j.b,p=j.c,o=a.b,n=a.c,m=s.b,s=s.c,l=r;l!==j;l=r){if(A.e0(q,p,o,n,m,s,l.b,l.c)){r=l.d
r===$&&A.u()
k=l.e
k===$&&A.u()
k=A.a5(r,l,k)>=0
r=k}else r=!1
if(r)return!1
r=l.e
r===$&&A.u()}return!0},
tq(a,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a.d
b===$&&A.u()
s=a.e
s===$&&A.u()
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
j=A.oj(o,m,a0,a1,a2)
i=A.oj(l,k,a0,a1,a2)
h=a.w
g=a.x
f=a.d
e=a.e
for(;;){if(!(h!=null&&h.f>=j&&g!=null&&g.f<=i))break
d=!1
if(h!==f)if(h!==e)if(A.e0(r,b,q,n,p,s,h.b,h.c)){d=h.d
d===$&&A.u()
c=h.e
c===$&&A.u()
c=A.a5(d,h,c)>=0
d=c}if(d)return!1
h=h.w
d=!1
if(g!==f)if(g!==e)if(A.e0(r,b,q,n,p,s,g.b,g.c)){d=g.d
d===$&&A.u()
c=g.e
c===$&&A.u()
c=A.a5(d,g,c)>=0
d=c}if(d)return!1
g=g.x}for(;;){if(!(h!=null&&h.f>=j))break
d=!1
if(h!==f)if(h!==e)if(A.e0(r,b,q,n,p,s,h.b,h.c)){d=h.d
d===$&&A.u()
c=h.e
c===$&&A.u()
c=A.a5(d,h,c)>=0
d=c}if(d)return!1
h=h.w}for(;;){if(!(g!=null&&g.f<=i))break
d=!1
if(g!==f)if(g!==e)if(A.e0(r,b,q,n,p,s,g.b,g.c)){d=g.d
d===$&&A.u()
c=g.e
c===$&&A.u()
c=A.a5(d,g,c)>=0
d=c}if(d)return!1
g=g.x}return!0},
oj(a,b,c,d,e){var s=B.c.N(32767*(a-c)*e),r=B.c.N(32767*(b-d)*e)
s=(s|s<<8)&16711935
s=(s|s<<4)&252645135
s=(s|s<<2)&858993459
r=(r|r<<8)&16711935
r=(r|r<<4)&252645135
r=(r|r<<2)&858993459
return((s|s<<1)&1431655765|((r|r<<1)&1431655765)<<1)>>>0},
tn(a,b,c,d){var s,r=a
do{if(r.f===5e-324)r.f=A.oj(r.b,r.c,b,c,d)
s=r.d
s===$&&A.u()
r.w=s
s=r.e
s===$&&A.u()
r.x=s
if(s!==a){r=s
continue}else break}while(!0)
s.w=s.w.x=null
A.tt(s)},
tt(a){var s,r,q,p,o,n,m,l,k,j,i,h=1
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
tk(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=A.b([],t.eB),e=b.length
for(s=a.length,r=e-1,q=0;q<e;q=l){p=b.length
if(!(q<p))return A.a(b,q)
o=b[q]
if(q<r){n=q+1
if(!(n<p))return A.a(b,n)
m=b[n]*d}else m=s
l=q+1
k=A.pA(a,o*d,m,d,l,!1)
p=k==null
if(p)o=null
else{o=k.e
o===$&&A.u()}if(k==o)if(!p)k.r=!0
k.toString
B.a.k(f,A.tm(k))}B.a.az(f,new A.iQ())
for(r=f.length,j=0;j<f.length;f.length===r||(0,A.i)(f),++j,c=p){i=f[j]
h=A.tl(i,c)
if(h!=null){g=A.pB(h,i)
p=h.e
p===$&&A.u()
A.ch(h,p)
p=g.e
p===$&&A.u()
A.ch(g,p)}p=c.e
p===$&&A.u()
p=A.ch(c,p)
p.toString}return c},
ch(a,b){var s,r,q,p,o,n,m,l
if(b==null)b=a
s=a
do{r=s.d
r===$&&A.u()
q=r.y
p=s.y
o=s.e
o===$&&A.u()
n=o.y
m=!1
if(!s.r){l=s.b
if(!(l===o.b&&s.c===o.c))l=r.b===l&&r.c===s.c
else l=!0
if(l)m=!0
else if(q!=null||q!==0||n!=null||n!==0||q==n||q!=p)m=A.a5(r,s,o)===0}if(m){A.fH(s)
s=s.d
r=s.e
r===$&&A.u()
if(s===r){b=s
break}b=s}else s=o}while(m||s!==b)
return b},
a5(a,b,c){var s=b.c,r=b.b
return(s-a.c)*(c.b-r)-(r-a.b)*(c.c-s)},
pB(a,b){var s,r=A.oD(a.a,a.b,a.c),q=A.oD(b.a,b.b,b.c),p=a.e
p===$&&A.u()
s=b.d
s===$&&A.u()
r.y=a.y
q.y=b.y
a.e=b
b.d=a
r.e=p
q.e=p.d=r
s.e=r.d=q
q.d=s
return q},
tl(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=a.b,g=a.c,f=b,e=-17976931348623157e292,d=null
do{s=f.c
if(g<=s){r=f.e
r===$&&A.u()
r=g>=r.c}else r=!1
if(r){r=f.b
q=f.e
q===$&&A.u()
p=q.b
o=q.c
n=r+(g-s)*(p-r)/(o-s)
if(n<=h&&n>e){if(n===h){if(g===s)return f
if(g===o)return q}if(r<p)d=f
else d=q
e=n}}s=f.e
s===$&&A.u()
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
p=A.e0(q,g,m,l,p,g,r,f.c)
q=p}if(q){i=Math.abs(g-f.c)/(h-r)
q=!1
if(A.fG(f,a))if(!(i<j))if(i===j){p=k.b
if(!(r>p))if(r===p){r=k.d
r===$&&A.u()
p=f.d
p===$&&A.u()
if(A.a5(r,k,p)<0){r=f.e
r===$&&A.u()
q=k.e
q===$&&A.u()
q=A.a5(r,k,q)<0
r=q}else r=q}else r=q
else r=!0}else r=q
else r=!0
else r=q
if(r){j=i
k=f}}r=f.e
r===$&&A.u()
if(r!==d){f=r
continue}else break}while(!0)
return k},
fG(a,b){var s,r=a.d
r===$&&A.u()
s=a.e
s===$&&A.u()
if(A.a5(r,a,s)<0)r=A.a5(a,b,s)>=0&&A.a5(a,r,b)>=0
else r=A.a5(a,b,r)<0||A.a5(a,s,b)<0
return r},
e0(a,b,c,d,e,f,g,h){var s,r,q=e-g,p=b-h,o=a-g,n=f-h
if(q*p-o*n>=0){s=d-h
r=c-g
q=o*s-r*p>=0&&r*n-q*s>=0}else q=!1
return q},
tm(a){var s,r,q=a,p=q
do{s=p.b
r=q.b
if(!(s<r))s=s===r&&p.c<q.c
else s=!0
if(s)q=p
s=p.e
s===$&&A.u()
if(s!==a){p=s
continue}else break}while(!0)
return q},
pA(a,b,c,d,e,f){var s,r,q,p,o=null
if(f===A.ts(a,b,c,d)>0)for(s=a.length,r=b;r<c;r+=d){if(!(r>=0&&r<s))return A.a(a,r)
q=a[r]
p=r+1
if(!(p<s))return A.a(a,p)
o=A.py(r,q,a[p],o)
o.y=e}else for(r=c-d,s=a.length;r>=b;r-=d){if(!(r>=0&&r<s))return A.a(a,r)
q=a[r]
p=r+1
if(!(p<s))return A.a(a,p)
o=A.py(r,q,a[p],o)
o.y=e}if(o!=null){s=o.e
s===$&&A.u()
s=o.b===s.b&&o.c===s.c}else s=!1
if(s){A.fH(o)
s=o.e
s===$&&A.u()
s.y=e
o=s}return o},
fH(a){var s,r=a.e
r===$&&A.u()
s=a.d
s===$&&A.u()
r.d=s
a.d.e=r
r=a.w
if(r!=null)r.x=a.x
s=a.x
if(s!=null)s.w=r},
py(a,b,c,d){var s,r=A.oD(a,b,c)
if(d==null){r.d=r
r.e=r}else{s=d.e
s===$&&A.u()
r.e=s
r.d=d
d.e=d.e.d=r}return r},
ts(a,b,c,d){var s,r,q,p,o,n,m,l,k=c-d
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
oD(a,b,c){return new A.bI(a,b,c)},
iQ:function iQ(){},
bI:function bI(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.e=_.d=$
_.f=5e-324
_.r=!1
_.y=_.x=_.w=null},
bZ:function bZ(a,b){var _=this
_.a=a
_.b=b
_.ax=_.Q=_.f=_.e=_.d=_.c=null
_.ay=!1
_.cx=_.CW=_.ch=null},
uC(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e="read of 4 byte(s) at ",d=J.pj(B.j.gao(a),a.byteOffset,a.byteLength),c=new A.m(d,0)
if(d.byteLength<12)throw A.e(B.aJ)
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
if(s!==65536&&s!==1953658213&&s!==1330926671)throw A.e(A.h("unrecognised sfntVersion 0x"+B.d.dY(B.b.b8(s,16),8,"0")))
q=p+4
c.j(q,2)
o=d.getUint16(q,!1)
n=A.C(t.S,t.l1)
for(q=p+12,m=0;m<o;++m){l=q+m*16
k=l+4<=d.byteLength
if(!k)A.n(A.h(e+l+" overruns a "+c.gl(0)+"-byte font"))
j=d.getUint32(l,!1)
k=l+8
i=k+4<=d.byteLength
if(!i)A.n(A.h(e+k+" overruns a "+c.gl(0)+"-byte font"))
h=d.getUint32(k,!1)
k=l+12
i=k+4<=d.byteLength
if(!i)A.n(A.h(e+k+" overruns a "+c.gl(0)+"-byte font"))
g=d.getUint32(k,!1)
k=d.byteLength
if(h>=k)throw A.e(A.h("table "+A.aB(A.cE(j))+" starts at "+h+", past the "+c.gl(0)+"-byte file"))
f=h+g>k?k-h:g
i=l+4
k=i+4<=k
if(!k)A.n(A.h(e+i+" overruns a "+c.gl(0)+"-byte font"))
d.getUint32(i,!1)
n.m(0,j,new A.hs(j,h,f))}return new A.k1(c,n)},
hs:function hs(a,b,c){this.a=a
this.c=b
this.d=c},
k1:function k1(a,b){this.a=a
this.c=b},
dZ(a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b="read of 2 byte(s) at ",a=a0.b
if(!a0.W(a,4))throw A.e(B.aF)
s=a+2
a0.j(s,2)
r=a0.a
q=r.getUint16(s,!1)
s=a+4
if(!a0.W(s,q*8))throw A.e(A.h("cmap claims "+q+" encoding records it does not contain"))
p=A.b([],t.ig)
for(o=0;o<q;++o){n=s+o*8
m=n+4
if(m>=0)l=m+4<=r.byteLength
else l=!1
if(!l)A.n(A.h("read of 4 byte(s) at "+m+" overruns a "+a0.gl(0)+"-byte font"))
k=a+r.getUint32(m,!1)
m=k>=0
if(m)l=k+2<=r.byteLength
else l=!1
if(!l)continue
if(n>=0)l=n+2<=r.byteLength
else l=!1
if(!l)A.n(A.h(b+n+" overruns a "+a0.gl(0)+"-byte font"))
l=r.getUint16(n,!1)
j=n+2
if(j>=0)i=j+2<=r.byteLength
else i=!1
if(!i)A.n(A.h(b+j+" overruns a "+a0.gl(0)+"-byte font"))
j=r.getUint16(j,!1)
if(m)m=k+2<=r.byteLength
else m=!1
if(!m)A.n(A.h(b+k+" overruns a "+a0.gl(0)+"-byte font"))
B.a.k(p,new A.bo(l,j,k,r.getUint16(k,!1)))}if(p.length===0)throw A.e(B.aL)
s=t.aq
h=A.a3(p,s)
B.a.az(h,new A.iK())
r=h.length
e=0
for(;;){if(!(e<h.length)){g=null
f=null
break}A:{d=h[e]
c=A.te(a0,d.c)
if(c==null)break A
f=d
g=c
break}h.length===r||(0,A.i)(h);++e}if(g==null||f==null)throw A.e(B.aH)
for(r=p.length,e=0;e<r;++e){d=p[e]
if(d.d===14){A.v5(a0,d.c)
break}}A.or(p,s)
return new A.iJ(g,f)},
te(a,b){if(!a.W(b,2))return null
a.j(b,2)
switch(a.a.getUint16(b,!1)){case 0:return A.v4(a,b)
case 4:return A.v6(a,b)
case 6:return A.v7(a,b)
case 12:return A.qs(a,b,!1)
case 13:return A.qs(a,b,!0)
default:return null}},
v4(a,b){var s,r
if(!a.W(b,262))return null
s=b+6
a.j(s,256)
r=a.a
return new A.hS(J.pl(B.cW.gao(r),r.byteOffset+s,256))},
v6(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(!a.W(b,14))return null
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
if(!a.W(k,p))return null
j=new A.m(r,n).a_(o)
i=new A.m(r,m).a_(o)
h=new A.m(r,l).a_(o)
g=new A.m(r,k).a_(o)
f=b+q
if(f<k+p)f=r.byteLength
s=r.byteLength
return new A.hU(j,i,h,g,k,a,f>s?s:f)},
v7(a,b){var s,r,q,p
if(!a.W(b,10))return null
s=b+6
a.j(s,2)
r=a.a
q=r.getUint16(s,!1)
s=b+8
a.j(s,2)
p=r.getUint16(s,!1)
s=b+10
if(!a.W(s,p*2))return null
return new A.hV(q,new A.m(r,s).a_(p))},
qs(a,b,c){var s,r,q,p,o,n,m,l,k,j,i="read of 4 byte(s) at "
if(!a.W(b,16))return null
s=b+12
a.j(s,4)
r=a.a
q=r.getUint32(s,!1)
if(q>B.b.O(r.byteLength-b-16,12))return null
p=new Uint32Array(q)
o=new Uint32Array(q)
n=new Uint32Array(q)
for(s=b+16,m=0;m<q;++m){l=s+m*12
if(l>=0)k=l+4<=r.byteLength
else k=!1
if(!k)A.n(A.h(i+l+" overruns a "+a.gl(0)+"-byte font"))
k=r.getUint32(l,!1)
if(!(m<q))return A.a(p,m)
p[m]=k
k=l+4
if(k>=0)j=k+4<=r.byteLength
else j=!1
if(!j)A.n(A.h(i+k+" overruns a "+a.gl(0)+"-byte font"))
k=r.getUint32(k,!1)
if(!(m<q))return A.a(o,m)
o[m]=k
k=l+8
if(k>=0)j=k+4<=r.byteLength
else j=!1
if(!j)A.n(A.h(i+k+" overruns a "+a.gl(0)+"-byte font"))
k=r.getUint32(k,!1)
if(!(m<q))return A.a(n,m)
n[m]=k}return new A.hT(p,o,n,c)},
v5(a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5="read of 4 byte(s) at "
if(!a6.W(a7,10))return null
s=a7+6
a6.j(s,4)
r=a6.a
q=r.getUint32(s,!1)
s=a7+10
if(!a6.W(s,q*11))return null
p=new Uint32Array(q)
o=A.b([],t.fC)
n=A.b([],t.nb)
for(m=t.S,l=t.t,k=0;k<q;++k){j=s+k*11
p[k]=a6.cv(j)
i=j+3
if(i>=0)h=i+4<=r.byteLength
else h=!1
if(!h)A.n(A.h(a5+i+" overruns a "+a6.gl(0)+"-byte font"))
g=r.getUint32(i,!1)
i=j+7
if(i>=0)h=i+4<=r.byteLength
else h=!1
if(!h)A.n(A.h(a5+i+" overruns a "+a6.gl(0)+"-byte font"))
f=r.getUint32(i,!1)
e=A.b([],l)
if(g!==0){d=a7+g
i=d>=0
if(i)h=d+4<=r.byteLength
else h=!1
if(h){if(i)i=d+4<=r.byteLength
else i=!1
if(!i)A.n(A.h(a5+d+" overruns a "+a6.gl(0)+"-byte font"))
c=r.getUint32(d,!1)
i=d+4
if(i>=0)h=i+c*4<=r.byteLength
else h=!1
if(h)for(b=0;b<c;++b){a=i+b*4
a0=a6.cv(a)
B.a.k(e,a0)
h=a+3
if(h>=0)a1=h+1<=r.byteLength
else a1=!1
if(!a1)A.n(A.h("read of 1 byte(s) at "+h+" overruns a "+a6.gl(0)+"-byte font"))
B.a.k(e,a0+r.getUint8(h))}}}B.a.k(o,e)
a2=A.C(m,m)
if(f!==0){a3=a7+f
i=a3>=0
if(i)h=a3+4<=r.byteLength
else h=!1
if(h){if(i)i=a3+4<=r.byteLength
else i=!1
if(!i)A.n(A.h(a5+a3+" overruns a "+a6.gl(0)+"-byte font"))
a4=r.getUint32(a3,!1)
i=a3+4
if(i>=0)h=i+a4*5<=r.byteLength
else h=!1
if(h)for(b=0;b<a4;++b){a=i+b*5
h=a6.cv(a)
a+=3
if(a>=0)a1=a+2<=r.byteLength
else a1=!1
if(!a1)A.n(A.h("read of 2 byte(s) at "+a+" overruns a "+a6.gl(0)+"-byte font"))
a2.m(0,h,r.getUint16(a,!1))}}}B.a.k(n,a2)}return new A.l7()},
iJ:function iJ(a,b){this.a=a
this.d=b},
iK:function iK(){},
bo:function bo(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
hS:function hS(a){this.a=a},
hU:function hU(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
hV:function hV(a,b){this.a=a
this.b=b},
hT:function hT(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
l7:function l7(){},
tS(a){var s,r,q,p,o,n,m,l,k,j=a.b
if(!a.W(j,54))throw A.e(B.a_)
s=j+12
a.j(s,4)
r=a.a
q=r.getUint32(s,!1)
if(q!==1594834165)throw A.e(A.h("head.magicNumber is 0x"+B.b.b8(q,16)+", not 0x5F0F3CF5"))
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
A.jg(a,j+20)
A.jg(a,j+28)
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
return new A.fO(p,s,n,m,l,o)},
jg(a,b){var s,r,q
a.j(b,4)
s=a.a
r=s.getUint32(b,!1)
q=b+4
a.j(q,4)
return r*4294967296+s.getUint32(q,!1)},
fO:function fO(a,b,c,d,e,f){var _=this
_.f=a
_.x=b
_.y=c
_.z=d
_.Q=e
_.ay=f},
tU(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d="read of 2 byte(s) at "
if(c<1&&b>0)throw A.e(B.aK)
s=c>b?b:c
r=a.b
q=s*4
if(!a.W(r,q))throw A.e(A.h("hmtx holds fewer than the "+s+" metric pairs hhea promises"))
p=new Uint16Array(s)
o=new Int16Array(s)
for(n=a.a,m=0;m<s;++m){l=r+m*4
if(l>=0)k=l+2<=n.byteLength
else k=!1
if(!k)A.n(A.h(d+l+" overruns a "+a.gl(0)+"-byte font"))
k=n.getUint16(l,!1)
if(!(m<s))return A.a(p,m)
p[m]=k
k=l+2
if(k>=0)j=k+2<=n.byteLength
else j=!1
if(!j)A.n(A.h(d+k+" overruns a "+a.gl(0)+"-byte font"))
k=n.getInt16(k,!1)
if(!(m<s))return A.a(o,m)
o[m]=k}i=r+q
h=b-s
g=n.byteLength
f=B.b.D(B.b.O(g-i,2),0,h)
e=new Int16Array(h)
for(m=0;m<f;++m){q=i+m*2
if(q>=0)k=q+2<=n.byteLength
else k=!1
if(!k)A.n(A.h(d+q+" overruns a "+a.gl(0)+"-byte font"))
q=n.getInt16(q,!1)
if(!(m<h))return A.a(e,m)
e[m]=q}return new A.ji(p,e)},
ji:function ji(a,b){this.a=a
this.c=b},
t0(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e="read of 2 byte(s) at ",d=a.b
a.j(d,2)
s=a.a
r=s.getUint16(d,!1)
if(r!==1&&r!==2)throw A.e(A.h("avar version "+r+" is not 1 or 2"))
q=d+6
a.j(q,2)
p=s.getUint16(q,!1)
o=d+8
n=A.b([],t.iQ)
for(q=t.c5,m=0;m<p;++m){if(o>=0)l=o+2<=s.byteLength
else l=!1
if(!l)A.n(A.h(e+o+" overruns a "+a.gl(0)+"-byte font"))
k=s.getUint16(o,!1)
o+=2
l=k*4
if(o>=0)j=o+l<=s.byteLength
else j=!1
if(!j)throw A.e(B.aB)
i=J.aN(k,q)
for(h=0;h<k;++h){j=o+h*4
if(j>=0)g=j+2<=s.byteLength
else g=!1
if(!g)A.n(A.h(e+j+" overruns a "+a.gl(0)+"-byte font"))
g=s.getInt16(j,!1)
j+=2
if(j>=0)f=j+2<=s.byteLength
else f=!1
if(!f)A.n(A.h(e+j+" overruns a "+a.gl(0)+"-byte font"))
i[h]=new A.dT(g/16384,s.getInt16(j,!1)/16384)}o+=l
B.a.k(n,i)}if(r===2&&a.W(o,8)){a.j(o,4)
if(s.getUint32(o,!1)===0){q=o+4
a.j(q,4)
s.getUint32(q,!1)}}return new A.ip(n)},
dT:function dT(a,b){this.a=a
this.b=b},
ip:function ip(a){this.b=a},
tB(a){var s,r,q,p,o,n,m,l,k,j,i,h=a.b
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
if(!a.W(k,q))throw A.e(B.aE)
j=A.ei(o,new A.j1(k,n,a),!1,t.l0)
i=k+q
if(!a.W(i,m*l))throw A.e(B.aG)
A.ei(m,new A.j2(i,l,l>=s+6,a,o),!1,t.h7)
return new A.da(j)},
ds:function ds(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
dj:function dj(a){this.a=a},
da:function da(a){this.a=a},
j1:function j1(a,b,c){this.a=a
this.b=b
this.c=c},
j2:function j2(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
pL(a){var s,r,q,p,o,n,m,l,k,j,i=a.b
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
n=A.tX(a,i+p)
m=A.b([],t.mc)
for(q=i+8,l=0;l<o;++l){k=q+l*4
if(k>=0)j=k+4<=s.byteLength
else j=!1
if(!j)A.n(A.h("read of 4 byte(s) at "+k+" overruns a "+a.gl(0)+"-byte font"))
B.a.k(m,A.tW(a,i+s.getUint32(k,!1),n))}return new A.fT(a,n,m,null)},
tY(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=a.b
a.j(f,2)
s=a.a
r=s.getUint16(f,!1)
if(r!==1)throw A.e(A.h("HVAR version "+r))
q=f+4
a.j(q,4)
p=A.pL(new A.m(s,f+s.getUint32(q,!1)))
q=f+8
a.j(q,4)
o=s.getUint32(q,!1)
if(o===0)return p
q=f+o
n=new A.m(s,q)
n.j(q,1)
m=s.getUint8(q)
l=m===0
if(!l&&m!==1)A.n(A.h("DeltaSetIndexMap format "+m))
k=q+1
n.j(k,1)
j=s.getUint8(k)
k=q+2
if(l){n.j(k,2)
i=s.getUint16(k,!1)
h=q+4}else{n.j(k,4)
i=s.getUint32(k,!1)
h=q+6}g=(j>>>4&3)+1
if(!n.W(h,i*g))A.n(B.aC)
return new A.fT(p.a,p.b,p.c,new A.iP(n,h,i,g,(j&15)+1))},
tX(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d="read of 2 byte(s) at "
a.j(b,2)
s=a.a
r=s.getUint16(b,!1)
q=b+2
a.j(q,2)
p=s.getUint16(q,!1)
o=r*6
q=b+4
if(!a.W(q,p*o))throw A.e(B.aI)
n=A.b([],t.fb)
for(m=t.i,l=0;l<p;++l){k=A.T(r,0,!1,m)
j=A.T(r,0,!1,m)
i=A.T(r,0,!1,m)
h=q+l*o
for(g=0;g<r;++g,h+=6){if(h>=0)f=h+2<=s.byteLength
else f=!1
if(!f)A.n(A.h(d+h+" overruns a "+a.gl(0)+"-byte font"))
B.a.m(k,g,s.getInt16(h,!1)/16384)
f=h+2
if(f>=0)e=f+2<=s.byteLength
else e=!1
if(!e)A.n(A.h(d+f+" overruns a "+a.gl(0)+"-byte font"))
B.a.m(j,g,s.getInt16(f,!1)/16384)
f=h+4
if(f>=0)e=f+2<=s.byteLength
else e=!1
if(!e)A.n(A.h(d+f+" overruns a "+a.gl(0)+"-byte font"))
B.a.m(i,g,s.getInt16(f,!1)/16384)}B.a.k(n,new A.i6(k,j,i))}return n},
tW(a,b,c){var s,r,q,p,o,n,m,l,k,j
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
l=A.ei(o,new A.jm(a,b,c),!1,t.S)
s=o-m
k=n?m*4+s*2:m*2+s
j=b+6+o*2
if(!a.W(j,r*k))throw A.e(B.aD)
return new A.i_(r,l,m,n,j,k)},
i6:function i6(a,b,c){this.a=a
this.b=b
this.c=c},
i_:function i_(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
iP:function iP(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
fT:function fT(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jm:function jm(a,b,c){this.a=a
this.b=b
this.c=c},
cg(a){var s,r,q,p,o=a.b
a.j(o,2)
s=a.a
r=s.getUint16(o,!1)
switch(r){case 1:q=o+2
a.j(q,2)
p=s.getUint16(q,!1)
q=o+4
a.j(q,2)
return new A.hK(p,new A.m(s,o+6).a_(s.getUint16(q,!1)))
case 2:q=o+2
a.j(q,2)
return new A.hL(new A.m(s,o+4).a_(s.getUint16(q,!1)*3))
default:throw A.e(A.h("unknown ClassDef format "+r))}},
bL:function bL(){},
hJ:function hJ(){},
hK:function hK(a,b){this.a=a
this.b=b},
hL:function hL(a){this.a=a},
oB(a){var s=a&65535
s-=s>>>1&21845
s=(s&13107)+(B.b.L(s,2)&13107)
return((s+(s>>>4)&3855)*257>>>8&255)*2},
fE(a){var s,r,q,p,o,n,m,l=a.b
a.j(l,2)
s=a.a
r=s.getUint16(l,!1)
q=l+2
a.j(q,2)
p=s.getUint16(q,!1)
q=l+4
a.j(q,2)
o=s.getUint16(q,!1)
if(o===32768)return new A.fD(r,p,o,$.rk())
if(o<1||o>3)throw A.e(A.h("unknown Device deltaFormat "+o))
n=p>=r?p-r+1:0
m=B.b.bo(16,o)
return new A.fD(r,p,o,new A.m(s,l+6).a_(B.b.a7(n+m-1,m)))},
im(a){var s,r,q,p,o,n,m,l=null,k=a.b
a.j(k,2)
s=a.a
r=s.getUint16(k,!1)
q=k+2
a.j(q,2)
p=s.getInt16(q,!1)
q=k+4
a.j(q,2)
o=s.getInt16(q,!1)
switch(r){case 1:return new A.cW(p,o,l,l)
case 2:q=k+6
a.j(q,2)
s.getUint16(q,!1)
return new A.cW(p,o,l,l)
case 3:q=k+6
a.j(q,2)
n=s.getUint16(q,!1)
q=k+8
a.j(q,2)
m=s.getUint16(q,!1)
q=n===0?l:A.fE(new A.m(s,k+n))
return new A.cW(p,o,q,m===0?l:A.fE(new A.m(s,k+m)))
default:throw A.e(A.h("unknown Anchor format "+r))}},
rg(a,b,c){var s,r,q,p,o
if(a!==c)return new A.z(a,b)
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
return new A.z(o,new A.m(r,s+r.getUint32(p,!1)))},
fD:function fD(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
cW:function cW(a,b,c,d){var _=this
_.a=a
_.b=b
_.d=c
_.e=d},
U(a){var s,r,q,p=a.b
a.j(p,2)
s=a.a
r=s.getUint16(p,!1)
switch(r){case 1:q=p+2
a.j(q,2)
return new A.hN(new A.m(s,p+4).a_(s.getUint16(q,!1)))
case 2:q=p+2
a.j(q,2)
return new A.hO(new A.m(s,p+4).a_(s.getUint16(q,!1)*3))
default:throw A.e(A.h("unknown Coverage format "+r))}},
bp:function bp(){},
hN:function hN(a){this.a=a},
hO:function hO(a){this.a=a},
tC(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=a.b
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
h=A.T(s.getUint16(i,!1),null,!1,t.f1)}else h=null
i=o===0?B.h:A.cg(new A.m(s,g+o))
s=n===0?B.h:A.cg(new A.m(s,g+n))
q=q?0:g+m
return new A.db(a,i,s,q,l===0?0:g+l,h,p)},
db:function db(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.f=e
_.r=f
_.w=g
_.y=null
_.z=!1},
tM(a){var s=A.pU(a)
return new A.cm(s,new A.m(s.a.a,s.b),A.T(s.w.length,null,!1,t.l7))},
pF(a,b){var s,r
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.i)(a),++r)if(a[r].U(b))return!0
return!1},
tP(a,b){var s,r,q,p
for(s=a.a,r=a.b,q=0;q<s.length;++q){if(s[q].f!==3)continue
if(!(q<r.length))return A.a(r,q)
p=r[q]
p.b=p.a=0}},
tO(a){var s,r,q,p
for(s=a.a,r=a.b,q=0;q<s.length;++q){if(s[q].e!==5)continue
if(!(q<r.length))return A.a(r,q)
p=r[q]
p.d=p.c=p.b=p.a=0}},
tN(a){var s,r
for(s=a.a,r=0;r<s.length;++r)A.pG(a,r,64)},
pG(a,b,c){var s,r,q,p,o,n,m,l,k,j=a.b
if(!(b>=0&&b<j.length))return A.a(j,b)
s=j[b]
r=s.e
q=s.f
if(r===0)return
s.e=0
p=b+r
if(p<0||p>=a.a.length)return
if(c===0)return
A.pG(a,p,c-1)
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
cm:function cm(a,b,c){this.a=a
this.b=b
this.c=c},
tL(a,b){var s,r,q,p,o,n,m,l=b.b
b.j(l,2)
s=b.a
r=s.getUint16(l,!1)
switch(a){case 1:return A.uH(b,l,r)
case 2:return A.um(b,l,r)
case 3:if(r!==1)A.n(A.h("unknown CursivePos format "+r))
q=l+2
b.j(q,2)
return new A.fB(b,l,A.U(new A.m(s,l+s.getUint16(q,!1))))
case 4:if(r!==1)A.n(A.h("unknown MarkBasePos format "+r))
q=l+2
b.j(q,2)
q=A.U(new A.m(s,l+s.getUint16(q,!1)))
p=l+4
b.j(p,2)
p=A.U(new A.m(s,l+s.getUint16(p,!1)))
o=l+6
b.j(o,2)
o=s.getUint16(o,!1)
n=l+8
b.j(n,2)
n=s.getUint16(n,!1)
m=l+10
b.j(m,2)
return new A.h0(q,p,o,new A.eT(b,l+n),new A.eL(b,l+s.getUint16(m,!1)))
case 5:if(r!==1)A.n(A.h("unknown MarkLigPos format "+r))
q=l+2
b.j(q,2)
q=A.U(new A.m(s,l+s.getUint16(q,!1)))
p=l+4
b.j(p,2)
p=A.U(new A.m(s,l+s.getUint16(p,!1)))
o=l+6
b.j(o,2)
o=s.getUint16(o,!1)
n=l+8
b.j(n,2)
n=s.getUint16(n,!1)
m=l+10
b.j(m,2)
return new A.h1(b,q,p,o,new A.eT(b,l+n),l+s.getUint16(m,!1))
case 6:if(r!==1)A.n(A.h("unknown MarkMarkPos format "+r))
q=l+2
b.j(q,2)
q=A.U(new A.m(s,l+s.getUint16(q,!1)))
p=l+4
b.j(p,2)
p=A.U(new A.m(s,l+s.getUint16(p,!1)))
o=l+6
b.j(o,2)
o=s.getUint16(o,!1)
n=l+8
b.j(n,2)
n=s.getUint16(n,!1)
m=l+10
b.j(m,2)
return new A.h2(q,p,o,new A.eT(b,l+n),new A.eL(b,l+s.getUint16(m,!1)))
case 7:return A.tg(b,l,r)
case 8:return A.t6(b,l,r)
default:throw A.e(A.h("unknown GPOS lookup type "+a))}},
oV(a,b,c,d,e,f){var s,r,q,p,o,n,m,l={}
if(e===0)return
l.a=d
s=new A.nv(l,b)
if((e&1)!==0){r=f.c
q=s.$0()
if(typeof q!=="number")return A.ag(q)
f.c=r+q}if((e&2)!==0){r=f.d
s=s.$0()
if(typeof s!=="number")return A.ag(s)
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
l=new A.nu(l,b)
if((e&16)!==0){m=l.$0()
if(o&&m!==0)f.c=f.c+a.b3(A.fE(new A.m(b.a,c+m)),!1)}if((e&32)!==0){m=l.$0()
if(n&&m!==0)f.d=f.d+a.b3(A.fE(new A.m(b.a,c+m)),!0)}if((e&64)!==0){m=l.$0()
if(o&&m!==0)f.a=f.a+a.b3(A.fE(new A.m(b.a,c+m)),!1)}if((e&128)!==0)l.$0()},
uH(a,b,c){var s,r,q,p=b+2
a.j(p,2)
s=a.a
r=A.U(new A.m(s,b+s.getUint16(p,!1)))
p=b+4
a.j(p,2)
q=s.getUint16(p,!1)
switch(c){case 1:return new A.eA(a,b,r,q,!0)
case 2:return new A.eA(a,b,r,q,!1)
default:throw A.e(A.h("unknown SinglePos format "+c))}},
um(a,b,c){var s,r,q,p,o,n,m,l,k,j=b+2
a.j(j,2)
s=a.a
r=A.U(new A.m(s,b+s.getUint16(j,!1)))
j=b+4
a.j(j,2)
q=s.getUint16(j,!1)
j=b+6
a.j(j,2)
p=s.getUint16(j,!1)
switch(c){case 1:return new A.et(a,b,r,q,p,1,null,null,0,0)
case 2:j=b+8
a.j(j,2)
o=s.getUint16(j,!1)
j=b+10
a.j(j,2)
n=s.getUint16(j,!1)
j=o===0?B.h:A.cg(new A.m(s,b+o))
m=n===0?B.h:A.cg(new A.m(s,b+n))
l=b+12
a.j(l,2)
l=s.getUint16(l,!1)
k=b+14
a.j(k,2)
return new A.et(a,b,r,q,p,2,j,m,l,s.getUint16(k,!1))
default:throw A.e(A.h("unknown PairPos format "+c))}},
px(a,b,c){var s,r,q,p,o=a.length
if(!(b>=0&&b<o))return A.a(a,b)
s=a[b]
r=s.e
q=s.f
if(r===0||(q&2)===0)return
s.e=0
p=b+r
if(p===c)return
if(p<0||p>=o)return
A.px(a,p,c)
o=a.length
if(!(p>=0&&p<o))return A.a(a,p)
s=a[p]
if(!(b<o))return A.a(a,b)
s.d=-a[b].d
s.e=-r
s.f=q},
oH(a,b,c,d,e){var s,r,q,p,o,n,m
if(d==null)return!1
s=b.a
r=b.b
q=r+2+c*4+2
s.j(q,2)
s=s.a
p=s.getUint16(q,!1)
o=a.bt(p===0?new A.cW(0,0,null,null):A.im(new A.m(s,r+p)))
n=a.bt(d)
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
u8(a,b){var s=a.w,r=b.w
if(s===r)return s===0||a.x===b.x
if(!(s>0&&a.x===0))s=r>0&&b.x===0
else s=!0
return s},
lH(a,b,c,d){var s,r,q,p,o
for(s=c.length,r=b.length,q=0;q<s;++q){p=c[q]
o=p.a
if(o>=r)continue
a.w=b[o]
a.i0(p.b)}a.w=d},
mh(a,b,c,d,e){var s,r,q,p,o,n,m,l,k
if(b===0)return B.m
s=A.T(b,0,!1,t.S)
B.a.m(s,0,a.w)
r=a.w
for(q=d.a,p=a.a,o=a.d,n=1;n<b;++n){m=a.Q
if(m==null)m=a.Q=new A.aH(p,a.x,a.y,o)
l=c+(n-1)*2
if(l>=0)k=l+2<=q.byteLength
else k=!1
if(!k)A.n(A.h("read of 2 byte(s) at "+l+" overruns a "+d.gl(0)+"-byte font"))
r=a.hT(m,r,q.getUint16(l,!1),e)
if(r<0)return null
B.a.m(s,n,r)}return s},
qU(a,b,c,d,e){var s,r,q,p,o,n,m,l=a.w
for(s=d.a,r=a.a,q=a.d,p=0;p<b;++p){o=a.Q
if(o==null)o=a.Q=new A.aH(r,a.x,a.y,q)
n=c+p*2
if(n>=0)m=n+2<=s.byteLength
else m=!1
if(!m)A.n(A.h("read of 2 byte(s) at "+n+" overruns a "+d.gl(0)+"-byte font"))
l=a.e0(o,l,s.getUint16(n,!1),e,!1)
if(l<0)return!1}return!0},
qV(a,b,c,d,e,f){var s,r,q,p,o,n,m,l=f-1
for(s=d.a,r=a.a,q=a.d,p=0;p<b;++p){o=a.Q
if(o==null)o=a.Q=new A.aH(r,a.x,a.y,q)
n=c+p*2
if(n>=0)m=n+2<=s.byteLength
else m=!1
if(!m)A.n(A.h("read of 2 byte(s) at "+n+" overruns a "+d.gl(0)+"-byte font"))
l=a.cn(o,l,s.getUint16(n,!1),e,!1)
if(l<0)return!1}return!0},
nm(a,b,c){var s,r,q,p,o,n="read of 2 byte(s) at ",m=J.aN(c,t.ih)
for(s=a.a,r=0;r<c;++r){q=b+r*4
if(q>=0)p=q+2<=s.byteLength
else p=!1
if(!p)A.n(A.h(n+q+" overruns a "+a.gl(0)+"-byte font"))
p=s.getUint16(q,!1)
q+=2
if(q>=0)o=q+2<=s.byteLength
else o=!1
if(!o)A.n(A.h(n+q+" overruns a "+a.gl(0)+"-byte font"))
m[r]=new A.h_(p,s.getUint16(q,!1))}return m},
wk(a,b){return a.a===b},
tg(a,b,c){var s,r,q
switch(c){case 1:s=b+2
a.j(s,2)
r=a.a
return new A.d6(a,b,1,A.U(new A.m(r,b+r.getUint16(s,!1))),null)
case 2:s=b+4
a.j(s,2)
r=a.a
q=r.getUint16(s,!1)
s=b+2
a.j(s,2)
s=A.U(new A.m(r,b+r.getUint16(s,!1)))
return new A.d6(a,b,2,s,q===0?B.h:A.cg(new A.m(r,b+q)))
case 3:return new A.d6(a,b,3,null,null)
default:throw A.e(A.h("unknown ContextPos format "+c))}},
qM(a,b){return new A.lT(A.C(t.S,t.c),a,b)},
t6(a,b,c){var s,r,q,p=null
switch(c){case 1:s=b+2
a.j(s,2)
r=a.a
return new A.d_(a,b,1,A.U(new A.m(r,b+r.getUint16(s,!1))),p,p,p)
case 2:s=new A.iw(a,b)
r=b+2
a.j(r,2)
q=a.a
return new A.d_(a,b,2,A.U(new A.m(q,b+q.getUint16(r,!1))),s.$1(b+4),s.$1(b+6),s.$1(b+8))
case 3:return new A.d_(a,b,3,p,p,p,p)
default:throw A.e(A.h("unknown ChainContextPos format "+c))}},
h_:function h_(a,b){this.a=a
this.b=b},
jd:function jd(a,b,c,d,e,f,g){var _=this
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
aD:function aD(){},
nv:function nv(a,b){this.a=a
this.b=b},
nu:function nu(a,b){this.a=a
this.b=b},
eA:function eA(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
et:function et(a,b,c,d,e,f,g,h,i,j){var _=this
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
fB:function fB(a,b,c){this.a=a
this.b=b
this.c=c},
eT:function eT(a,b){this.a=a
this.b=b},
eL:function eL(a,b){this.a=a
this.b=b},
h0:function h0(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
h1:function h1(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
h2:function h2(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
d6:function d6(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
iL:function iL(a){this.a=a},
lT:function lT(a,b,c){this.a=a
this.b=b
this.c=c},
d_:function d_(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
iw:function iw(a,b){this.a=a
this.b=b},
it:function it(a){this.a=a},
iu:function iu(a){this.a=a},
iv:function iv(a){this.a=a},
tR(a){var s=A.pU(a)
return new A.cn(s,A.T(s.w.length,null,!1,t.hJ))},
hX:function hX(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
cn:function cn(a,b){this.a=a
this.b=b},
nS(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h=null,g=a.gt(0),f=A.T(b,0,!1,t.S)
B.a.m(f,0,a.f)
if(b===1)return f
s=a.a.a
r=a.f
if(!(r>=0&&r<s.length))return A.a(s,r)
q=s[r]
p=q.w
o=q.x
for(n=p!==0,m=o!==0,l=r,k=h,j=1;j<b;++j){l=g.cm(l)
if(l<0)return h
if(!(l<s.length))return A.a(s,l)
i=s[l]
if(!c.$2(j,i.a))return h
B.a.m(f,j,l)
if(n&&m){if(p!==i.w||o!==i.x){if(k==null)k=A.wi(a,p)
if(!k)return h}}else{r=i.w
if(r!==0&&i.x!==0&&r!==p)return h}}return f},
wi(a,b){var s,r,q=a.a.a,p=a.f,o=q.length
for(;;){if(p>0){r=p-1
if(!(r<o))return A.a(q,r)
r=q[r].w===b}else r=!1
if(!r){s=!1
break}--p
if(!(p>=0&&p<o))return A.a(q,p)
if(q[p].x===0){s=!0
break}}if(s){o=a.gt(0)
if(!(p>=0&&p<q.length))return A.a(q,p)
o=o.aF(q[p])}else o=!1
return o},
p1(a,b,c){var s,r,q=a.gt(0),p=a.f
for(s=a.a.a,r=0;r<b;++r){p=q.e_(p)
if(p<0)return!1
if(!(p<s.length))return A.a(s,p)
if(!c.$2(r,s[p].a))return!1}return!0},
p2(a,b,c,d){var s,r,q=a.gt(0),p=c-1
for(s=a.a.a,r=0;r<b;++r){p=q.cm(p)
if(p<0)return!1
if(!(p<s.length))return A.a(s,p)
if(!d.$2(r,s[p].a))return!1}return!0},
oU(a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a1.length,a=A.T(64,0,!1,t.S)
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
xt(a,b){var s,r,q,p,o,n,m=A.rg(a,b,7),l=m.a,k=m.b,j=k.b
k.j(j,2)
s=k.a
r=s.getUint16(j,!1)
switch(l){case 1:return A.uI(k,r)
case 2:return A.u9(k,r)
case 3:return A.rY(k,r)
case 4:return A.u5(k,r)
case 5:A:{if(1===r){j=k.b
q=j+2
k.j(q,2)
p=A.U(new A.m(s,j+s.getUint16(q,!1)))
q=j+4
k.j(q,2)
q=A.mk(k,j,j+6,s.getUint16(q,!1))
q=new A.fx(p,new A.dB(k,q,A.ra(),A.T(q.length,null,!1,t.B)))
s=q
break A}if(2===r){j=k.b
q=j+2
k.j(q,2)
p=A.U(new A.m(s,j+s.getUint16(q,!1)))
q=j+4
k.j(q,2)
o=s.getUint16(q,!1)
q=j+6
k.j(q,2)
n=s.getUint16(q,!1)
s=o===0?B.h:A.cg(new A.m(s,j+o))
q=A.mk(k,j,j+8,n)
q=new A.fy(p,s,new A.dB(k,q,A.ra(),A.T(q.length,null,!1,t.B)))
s=q
break A}if(3===r){s=A.th(k)
break A}s=A.n(A.h("unknown Context subst format "+r))}return s
case 6:B:{if(1===r){j=k.b
q=j+2
k.j(q,2)
p=A.U(new A.m(s,j+s.getUint16(q,!1)))
q=j+4
k.j(q,2)
q=A.mk(k,j,j+6,s.getUint16(q,!1))
q=new A.fp(p,new A.dB(k,q,A.r9(),A.T(q.length,null,!1,t.B)))
s=q
break B}if(2===r){s=A.t7(k)
break B}if(3===r){s=A.t8(k)
break B}s=A.n(A.h("unknown ChainContext subst format "+r))}return s
case 8:return A.ux(k,r)
default:throw A.e(A.h("unknown GSUB lookup type "+l))}},
uI(a,b){var s,r,q=a.b,p=q+2
a.j(p,2)
s=a.a
r=A.U(new A.m(s,q+s.getUint16(p,!1)))
switch(b){case 1:p=q+4
a.j(p,2)
return new A.eB(r,s.getInt16(p,!1),null)
case 2:p=q+4
a.j(p,2)
return new A.eB(r,0,new A.m(s,q+6).a_(s.getUint16(p,!1)))
default:throw A.e(A.h("unknown SingleSubst format "+b))}},
u9(a,b){var s,r,q,p,o,n,m,l,k
if(b!==1)throw A.e(A.h("unknown MultipleSubst format "+b))
s=a.b
r=s+2
a.j(r,2)
q=a.a
p=A.U(new A.m(q,s+q.getUint16(r,!1)))
r=s+4
a.j(r,2)
o=q.getUint16(r,!1)
n=J.aN(o,t.S)
for(r=s+6,m=0;m<o;++m){l=r+m*2
if(l>=0)k=l+2<=q.byteLength
else k=!1
if(!k)A.n(A.h("read of 2 byte(s) at "+l+" overruns a "+a.gl(0)+"-byte font"))
n[m]=s+q.getUint16(l,!1)}return new A.h4(p,a,n,A.T(o,null,!1,t.f8))},
rY(a,b){var s,r,q,p,o,n,m,l,k
if(b!==1)throw A.e(A.h("unknown AlternateSubst format "+b))
s=a.b
r=s+2
a.j(r,2)
q=a.a
p=A.U(new A.m(q,s+q.getUint16(r,!1)))
r=s+4
a.j(r,2)
o=q.getUint16(r,!1)
n=J.aN(o,t.S)
for(r=s+6,m=0;m<o;++m){l=r+m*2
if(l>=0)k=l+2<=q.byteLength
else k=!1
if(!k)A.n(A.h("read of 2 byte(s) at "+l+" overruns a "+a.gl(0)+"-byte font"))
n[m]=s+q.getUint16(l,!1)}return new A.fk(p,a,n,A.T(o,null,!1,t.f8))},
u5(a,b){var s,r,q,p,o,n,m,l,k
if(b!==1)throw A.e(A.h("unknown LigatureSubst format "+b))
s=a.b
r=s+2
a.j(r,2)
q=a.a
p=A.U(new A.m(q,s+q.getUint16(r,!1)))
r=s+4
a.j(r,2)
o=q.getUint16(r,!1)
n=J.aN(o,t.S)
for(r=s+6,m=0;m<o;++m){l=r+m*2
if(l>=0)k=l+2<=q.byteLength
else k=!1
if(!k)A.n(A.h("read of 2 byte(s) at "+l+" overruns a "+a.gl(0)+"-byte font"))
n[m]=s+q.getUint16(l,!1)}return new A.fZ(p,a,n,A.T(o,null,!1,t.d1))},
wh(a,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a.a,d=e.a,c=a0.length,b=c-1
if(!(b>=0))return A.a(a0,b)
s=a0[b]
A.wl(e,a.f,s+1)
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
l=n?A.vz(e):0
s=a.f
if(!(s>=0&&s<d.length))return A.a(d,s)
r=d[s]
k=r.w
if(n){r.w=l
r.x=0
if(r.e===1)r.e=6}a.bJ(s,a1,m)
for(j=1,i=0,o=1;o<c;++o){for(h=a0[o-1]+1,s=j-1;r=a0[o],h<r;++h){if(n){if(!(h>=0&&h<d.length))return A.a(d,h)
r=d[h]
g=r.x
if(g===0)g=1
r.w=l
r.x=s+(g<1?g:1)}++i}if(!(r>=0&&r<d.length))return A.a(d,r)
k=d[r].w;++j}for(s=e.b,o=b;o>=1;--o){B.a.aD(d,a0[o])
B.a.aD(s,a0[o])}f=a.f+1+i
if(!p&&k!==0)for(b=j-1,o=f;s=d.length,o<s;++o){if(!(o>=0))return A.a(d,o)
s=d[o]
if(s.w!==k)break
g=s.x
if(g===0)break
s.w=l
s.x=b+(g<1?g:1)}a.f=f},
vz(a){var s,r,q,p,o
for(s=a.a,r=s.length,q=0,p=0;p<r;++p){o=s[p].w
if(o>0&&o<8)q|=B.b.ag(1,o)}for(o=1;o<8;++o)if((q&B.b.ag(1,o))>>>0===0)return o
return 1},
wl(a,b,c){var s,r,q,p,o,n
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
nn(a,b,c){var s,r,q,p,o,n="read of 2 byte(s) at ",m=J.aN(c,t.nu)
for(s=a.a,r=0;r<c;++r){q=b+r*4
if(q>=0)p=q+2<=s.byteLength
else p=!1
if(!p)A.n(A.h(n+q+" overruns a "+a.gl(0)+"-byte font"))
p=s.getUint16(q,!1)
q+=2
if(q>=0)o=q+2<=s.byteLength
else o=!1
if(!o)A.n(A.h(n+q+" overruns a "+a.gl(0)+"-byte font"))
m[r]=new A.hh(p,s.getUint16(q,!1))}return m},
ws(a,b){var s,r,q,p,o,n
t.bb.a(a)
A.E(b)
a.j(b,2)
s=a.a
r=s.getUint16(b,!1)
q=b+2
a.j(q,2)
p=s.getUint16(q,!1)
q=b+4
o=r===0?0:r-1
n=new A.m(s,q).a_(o)
return new A.bF(B.m,n,B.m,A.nn(a,q+n.length*2,p))},
wr(a,b){var s,r,q,p,o,n,m,l,k
t.bb.a(a)
A.E(b)
a.j(b,2)
s=a.a
r=s.getUint16(b,!1)
q=new A.m(s,b+2).a_(r)
p=b+(2+r*2)
a.j(p,2)
o=s.getUint16(p,!1)
n=o===0?0:o-1
m=new A.m(s,p+2).a_(n)
p+=2+m.length*2
a.j(p,2)
l=s.getUint16(p,!1)
k=new A.m(s,p+2).a_(l)
p+=2+l*2
a.j(p,2)
return new A.bF(q,m,k,A.nn(a,p+2,s.getUint16(p,!1)))},
mk(a,b,c,d){return A.ei(d,new A.ml(a,c,b),!1,t.S)},
mg(a,b,c,d,e){var s,r,q=A.nS(a,b.b.length+1,d)
if(q==null)return!1
s=q.length
r=s-1
if(!(r>=0))return A.a(q,r)
s=q[r]
if(!A.p2(a,b.c.length,s+1,e))return!1
if(!A.p1(a,b.a.length,c))return!1
A.oU(a,q,q[r]+1,b.d)
return!0},
th(a){var s,r,q,p,o,n,m,l=a.b,k=l+2
a.j(k,2)
s=a.a
r=s.getUint16(k,!1)
k=l+4
a.j(k,2)
q=s.getUint16(k,!1)
p=J.aN(r,t.c)
for(k=l+6,o=0;o<r;++o){n=k+o*2
if(n>=0)m=n+2<=s.byteLength
else m=!1
if(!m)A.n(A.h("read of 2 byte(s) at "+n+" overruns a "+a.gl(0)+"-byte font"))
p[o]=A.U(new A.m(s,l+s.getUint16(n,!1)))}return new A.fz(p,A.nn(a,k+r*2,q))},
t7(a){var s,r,q,p,o,n=a.b,m=n+2
a.j(m,2)
s=a.a
r=A.U(new A.m(s,n+s.getUint16(m,!1)))
m=new A.iD(a,n)
q=n+10
a.j(q,2)
p=s.getUint16(q,!1)
q=m.$1(n+4)
s=m.$1(n+6)
m=m.$1(n+8)
o=A.mk(a,n,n+12,p)
return new A.fq(r,q,s,m,new A.dB(a,o,A.r9(),A.T(o.length,null,!1,t.B)))},
t8(a){var s,r,q,p,o,n={},m=a.b
n.a=m+2
s=new A.iH(n,a,m)
r=s.$0()
q=s.$0()
p=s.$0()
s=n.a
a.j(s,2)
o=a.a.getUint16(s,!1)
return new A.fr(r,q,p,A.nn(a,n.a+2,o))},
wn(a,b){return!1},
ux(a,b){var s,r,q,p,o,n,m,l={}
if(b!==1)throw A.e(A.h("unknown ReverseChainSingleSubst format "+b))
s=a.b
r=s+2
a.j(r,2)
q=a.a
p=A.U(new A.m(q,s+q.getUint16(r,!1)))
l.a=s+4
r=new A.jR(l,a,s)
o=r.$0()
n=r.$0()
r=l.a
a.j(r,2)
m=q.getUint16(r,!1)
return new A.hf(p,o,n,new A.m(q,l.a+2).a_(m))},
hh:function hh(a,b){this.a=a
this.b=b},
e8:function e8(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.x=_.w=_.r=_.f=0
_.y=null},
ay:function ay(){},
eB:function eB(a,b,c){this.a=a
this.b=b
this.c=c},
h4:function h4(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fk:function fk(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
cN:function cN(a,b){this.a=a
this.b=b},
fZ:function fZ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
js:function js(a,b){this.a=a
this.b=b},
jt:function jt(a){this.a=a},
bF:function bF(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
dB:function dB(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ml:function ml(a,b,c){this.a=a
this.b=b
this.c=c},
fx:function fx(a,b){this.a=a
this.b=b},
iM:function iM(a){this.a=a},
fy:function fy(a,b,c){this.a=a
this.b=b
this.c=c},
iN:function iN(a,b){this.a=a
this.b=b},
fz:function fz(a,b){this.a=a
this.b=b},
iO:function iO(a){this.a=a},
fp:function fp(a,b){this.a=a
this.b=b},
iy:function iy(a){this.a=a},
ix:function ix(a){this.a=a},
iz:function iz(a){this.a=a},
fq:function fq(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
iD:function iD(a,b){this.a=a
this.b=b},
iB:function iB(a,b){this.a=a
this.b=b},
iA:function iA(a,b){this.a=a
this.b=b},
iC:function iC(a,b){this.a=a
this.b=b},
fr:function fr(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
iH:function iH(a,b,c){this.a=a
this.b=b
this.c=c},
iE:function iE(a){this.a=a},
iF:function iF(a){this.a=a},
iG:function iG(a){this.a=a},
hf:function hf(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jR:function jR(a,b,c){this.a=a
this.b=b
this.c=c},
jP:function jP(a){this.a=a},
jQ:function jQ(a){this.a=a},
aH:function aH(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
pU(a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a="read of 4 byte(s) at ",a0="read of 2 byte(s) at ",a1=a2.b
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
l=A.C(q,q)
if(o!==0){k=a1+o
a2.j(k,2)
j=s.getUint16(k,!1)
for(q=k+2,i=0;i<j;++i){h=q+i*6
if(h>=0)g=h+4<=s.byteLength
else g=!1
if(!g)A.n(A.h(a+h+" overruns a "+a2.gl(0)+"-byte font"))
g=s.getUint32(h,!1)
f=h+4
if(f>=0)e=f+2<=s.byteLength
else e=!1
if(!e)A.n(A.h(a0+f+" overruns a "+a2.gl(0)+"-byte font"))
l.m(0,g,k+s.getUint16(f,!1))}}q=t.t
d=A.b([],q)
c=A.b([],q)
if(n!==0){k=a1+n
a2.j(k,2)
j=s.getUint16(k,!1)
for(g=k+2,i=0;i<j;++i){h=g+i*6
if(h>=0)f=h+4<=s.byteLength
else f=!1
if(!f)A.n(A.h(a+h+" overruns a "+a2.gl(0)+"-byte font"))
B.a.k(d,s.getUint32(h,!1))
f=h+4
if(f>=0)e=f+2<=s.byteLength
else e=!1
if(!e)A.n(A.h(a0+f+" overruns a "+a2.gl(0)+"-byte font"))
B.a.k(c,k+s.getUint16(f,!1))}}b=A.b([],q)
if(m!==0){k=a1+m
a2.j(k,2)
j=s.getUint16(k,!1)
for(q=k+2,i=0;i<j;++i){g=q+i*2
if(g>=0)f=g+2<=s.byteLength
else f=!1
if(!f)A.n(A.h(a0+g+" overruns a "+a2.gl(0)+"-byte font"))
B.a.k(b,k+s.getUint16(g,!1))}}return new A.jr(a2,a1,l,d,c,A.T(d.length,null,!1,t.f8),p,b)},
jr:function jr(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
hl:function hl(a,b){this.a=a
this.b=b},
k6:function k6(){},
t_(a){var s,r,q,p,o,n,m,l,k,j=a.a,i=j.length,h=A.T(i,7,!1,t.S)
for(s=0,r=-1,q=0;q<i;++q){if(!(q<j.length))return A.a(j,q)
p=A.rZ(j[q])
if(p<0){B.a.m(h,q,7)
continue}o=$.rF()
n=s*6+p
if(!(n<42))return A.a(o,n)
m=o[n]
l=m>>>8&15
k=m&15
if(l!==7&&r>=0)B.a.m(h,r,l)
B.a.m(h,q,m>>>4&15)
r=q
s=k}return h},
rZ(a){var s,r,q=a.d
if(q===5)return-1
s=a.b
if(s>=1792&&s<=1871){if(s===1808)return 4
if(B.dc.u(0,s))return 5}A:{r=3
if(1===q){r=1
break A}if(2===q){r=2
break A}if(3===q)break A
if(4===q)break A
r=0
break A}return r},
F(a,b,c){return(a<<8|b<<4|c)>>>0},
dQ:function dQ(){},
wP(a,b){var s,r
a.av(1920365166)
a.br()
if(a.c===B.k){a.av(1920232545)
a.bq(1920232557)}else{a.av(1819570785)
a.av(1819570797)}a.bq(1718772067)
a.bq(1853189490)
a.bq(1684959085)
b.dJ(a)
for(s=0;s<7;++s){r=B.cl[s]
a.aJ(r,(r===1835102827||r===1835756907?6:0)|1,1)}for(s=0;s<7;++s){r=B.cH[s]
a.aJ(r,(r===1801810542?8:0)|1,1)}},
ez:function ez(){},
fC:function fC(){},
aA:function aA(a,b,c,d,e,f,g,h,i,j,k){var _=this
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
bT:function bT(a){var _=this
_.a=a
_.f=_.e=_.d=_.c=_.b=0},
eF:function eF(a,b){this.a=a
this.b=b},
j6:function j6(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=0},
j7:function j7(){},
q1(a,b){var s,r,q,p=a.a
if(b===p)return
B.a.a8(p)
B.a.F(p,b)
p=a.b
B.a.a8(p)
s=b.length
r=J.om(s,t.lr)
for(q=0;q<s;++q)r[q]=new A.bT(0)
B.a.F(p,r)},
uk(a,b,c){var s,r,q,p=a.a,o=p.length
if(!(b>=0&&b<o))return A.a(p,b)
s=p[b].c
for(r=b+1;r<c;++r){if(!(r<o))return A.a(p,r)
q=p[r].c
if(q<s)s=q}for(r=b;r<c;++r){if(!(r<p.length))return A.a(p,r)
p[r].c=s}},
vM(a){var s,r,q,p,o,n,m,l,k,j,i
if(a>=44032&&a<55204){s=a-44032
r=B.b.X(s,28)
if(r!==0)return new A.z(44032+s-r,4519+r)
return new A.z(4352+B.b.O(s,588),4449+B.b.O(B.b.X(s,588),28))}q=$.rH()
p=q.length
o=(p/3|0)-1
for(n=0;n<=o;){m=B.b.L(n+o,1)
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
return new A.z(j,q[i])}}return B.ad},
vL(a,b){var s,r,q,p,o,n,m,l,k
if(a>=4352&&a<4371)if(b>=4449&&b<4470)return 44032+((a-4352)*21+(b-4449))*28
if(a>=44032&&a<55204)if(B.b.X(a-44032,28)===0&&b>4519&&b<4547)return a+(b-4519)
s=$.rG()
r=s.length
q=(r/3|0)-1
for(p=0;p<=q;){o=B.b.L(p+q,1)
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
h7:function h7(a,b){this.a=a
this.b=b},
jB:function jB(a){this.a=a},
mi:function mi(){},
uF(a){var s,r,q,p,o,n,m,l,k,j
for(s=a.a,r=0,q=1;p=s.length,q<=p;++q){if(q<p){o=s[q]
n=o.e
m=n===1||n===2||n===3||o.b===8205}else m=!1
if(m)continue
if(q-r>1){if(!(r>=0&&r<p))return A.a(s,r)
l=s[r].c
for(k=r+1;k<q;++k){j=s[k].c
if(j<l)l=j}for(k=r;k<q;++k){if(!(k<s.length))return A.a(s,k)
s[k].c=l}}r=q}},
uE(a){var s=B.db.u(0,a.d)?B.k:B.r
if(a.c===s)return
a.e3()
a.c=a.c===B.k?B.r:B.k},
uD(a,b){var s,r,q,p,o,n
if(b==null||b.b===B.h)return
for(s=a.a,r=s.length,q=b.b,p=b.c,o=0;o<s.length;s.length===r||(0,A.i)(s),++o){n=s[o]
n.f=q.P(n.a)
n.r=p.P(n.a)}},
xb(a){var s
if(a<173)return!1
s=!0
if(a!==173)if(a!==847)if(a!==1564)if(!(a>=4447&&a<=4448))if(!(a>=6068&&a<=6069))if(!(a>=6155&&a<=6159))if(!(a>=8203&&a<=8207))if(!(a>=8234&&a<=8238))if(!(a>=8288&&a<=8303))if(a!==12644)if(!(a>=65024&&a<=65039))if(a!==65279)if(a!==65440)if(!(a>=65520&&a<=65528))if(!(a>=113824&&a<=113827))if(!(a>=119155&&a<=119162))s=a>=917504&&a<=921599
return s},
hi:function hi(a,b,c){this.a=a
this.b=b
this.c=c},
k2:function k2(){},
hj:function hj(a,b,c){var _=this
_.a=a
_.b=b
_.c=$
_.d=c},
uG(a){var s
for(s=0;a>0;){++s
a=a>>>1}return s},
hd:function hd(a,b){this.a=a
this.b=b},
hc:function hc(a){this.a=a},
hk:function hk(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
bG:function bG(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.r=_.f=0},
k4:function k4(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.r=_.e=0},
k5:function k5(){},
t2(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=A.t1(a)
if(d.length<=1)return A.qz(a,null).e4()
s=J.q(a)
r=s.gl(a)
q=new Uint8Array(r)
r=t.J
p=A.b([],r)
o=A.b([],r)
n=A.b([],r)
for(m=0,l=0,k=0;k<d.length;++k,m=j){j=d[k]
i=A.qz(s.H(a,m,j),null).e4()
B.j.bG(q,m,i.a)
for(r=i.c,h=r.length,g=0;g<r.length;r.length===h||(0,A.i)(r),++g){f=r[g]
B.a.k(p,new A.bl(f.a+m,f.b+m,f.c))}for(r=i.d,h=r.length,g=0;g<r.length;r.length===h||(0,A.i)(r),++g){f=r[g]
B.a.k(o,new A.bl(f.a+m,f.b+m,f.c))}e=i.b
B.a.k(n,new A.bl(m,j,e))
if(k===0)l=e}return new A.dU(q,l,p,o)},
t1(a){var s,r,q,p=A.b([],t.t)
for(s=J.q(a),r=0;r<s.gl(a);++r){q=s.h(a,r)
if(A.ak($.pg(),q)!==10)continue
if(s.h(a,r)===13){q=r+1
q=q<s.gl(a)&&s.h(a,q)===10}else q=!1
if(q)continue
B.a.k(p,r+1)}if(p.length===0||B.a.gS(p)!==s.gl(a))B.a.k(p,s.gl(a))
return p},
qz(a,b){var s,r,q,p=J.q(a),o=p.gl(a),n=p.gl(a)
n=new Uint8Array(n)
s=p.gl(a)
s=new Uint8Array(s)
r=p.gl(a)
r=new Uint8Array(r)
q=p.gl(a)
q=new Int32Array(q)
p=p.gl(a)
p=new A.lv(a,b,o,n,s,r,q,new Int32Array(p))
p.ej(a,b)
return p},
v8(a,b,c,d,e){var s,r,q,p,o,n=b.length,m=t.S,l=J.aN(n,m)
for(s=a.e,r=b.length,q=s.length,p=0;p<n;++p){if(!(p<r))return A.a(b,p)
o=b[p]
if(!(o<q))return A.a(s,o)
l[p]=s[o]}s=new A.hZ(a,b,l,c,d,e)
m=A.a3(l,m)
m.$flags=1
s.d=t.L.a(m)
return s},
qv(a){var s
A:{if(0===a){s=0
break A}if(1===a||3===a||6===a){s=1
break A}s=-1
break A}return s},
qu(a){B.a.az(a,new A.lm())
return a},
qt(a){var s
A:{if(12296===a){s=9001
break A}if(12297===a){s=9002
break A}s=a
break A}return s},
bl:function bl(a,b,c){this.a=a
this.b=b
this.c=c},
dU:function dU(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
lv:function lv(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.z=_.y=_.x=$},
hZ:function hZ(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=$
_.e=d
_.f=e
_.r=f},
lm:function lm(){},
uB(a){var s,r,q,p,o,n,m,l,k=1145457748,j=a.length
if(j===0)return B.cu
s=A.b([],t.m1)
for(r=0,q=-1,p=0;p<j;++p){if(!(p<a.length))return A.a(a,p)
o=a[p]
n=A.ak($.rJ(),o)
if(n===$.rB()||n===$.rC()||n===0)continue
m=k
if(n>=0&&n<$.pe().length){o=$.pe()
if(!(n>=0&&n<o.length))return A.a(o,n)
l=o[n]}else l=m
if(q===-1)q=l
else if(l!==q){B.a.k(s,new A.ey(r,p,q))
q=l
r=p}}B.a.k(s,new A.ey(r,j,q===-1?k:q))
return s},
ey:function ey(a,b,c){this.a=a
this.b=b
this.c=c},
np:function np(){},
h(a){return new A.ax(a)},
m:function m(a,b){this.a=a
this.b=b},
ax:function ax(a){this.a=a},
t5(a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=a9.length,a3=a2/12|0,a4=a3*4,a5=new Float32Array(a4),a6=new Float32Array(256),a7=new Int32Array(256)
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
for(g=B.b.D(B.c.a4(l/4096*16),0,15),p=j/4096*16,i=m/4096*16,h=k/4096*16;g<=B.b.D(B.c.a4(p),0,15);++g)for(f=B.b.D(B.c.a4(i),0,15),e=g*16;f<=B.b.D(B.c.a4(h),0,15);++f){d=e+f
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
b[a]=a2+s}a2=B.c.N(b[256])
a0=new Float32Array(a2)
a1=new Int32Array(256)
for(r=0;r<a3;++r){s=r*4
p=s+1
if(!(p<a4))return A.a(a5,p)
g=B.b.D(B.c.a4(a5[p]/4096*16),0,15)
p=s+3
if(!(p<a4))return A.a(a5,p)
i=s+2
for(;g<=B.b.D(B.c.a4(a5[p]/4096*16),0,15);++g){if(!(s<a4))return A.a(a5,s)
f=B.b.D(B.c.a4(a5[s]/4096*16),0,15)
if(!(i<a4))return A.a(a5,i)
h=g*16
for(;f<=B.b.D(B.c.a4(a5[i]/4096*16),0,15);++f){d=h+f
if(!(d>=0&&d<257))return A.a(b,d)
e=B.c.N(b[d])
if(!(d<256))return A.a(a1,d)
c=a1[d]
if(!(d<256))return A.a(a1,d)
a1[d]=c+1
c=e+c
if(!(c>=0&&c<a2))return A.a(a0,c)
a0[c]=r}}}return new A.iq(a5,b,a0,a6)},
iq:function iq(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
uq(a,b){var s,r,q,p,o,n,m,l,k,j,i=A.b([],t.d2)
for(s=b.d.gah(),s=s.gt(s),r=t.u,q=t.j,p=t.s,o=t.G;s.n();){n=s.gp()
m=n.a
l=n.b
n=new A.ib(m)
l=q.b(l)?l:B.a8
k=J.q(l)
j=k.gA(l)?null:k.gv(l)
n.b=r.a(A.v(k.gl(l)>1?k.h(l,1):null))
n.c=r.a(A.v(typeof j=="string"?A.b([j,A.b(["accumulated"],p),A.b(["get",m],p)],o):j))
i.push(n)}i=new A.jL(b,i,new A.A(B.i),A.C(t.S,t.el))
i.eh(a,b)
return i},
iI:function iI(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ib:function ib(a){this.a=a
this.c=this.b=$},
aU:function aU(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=null
_.f=0},
jL:function jL(a,b,c,d){var _=this
_.a=a
_.b=$
_.c=b
_.d=c
_.e=1
_.f=d},
jN:function jN(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jM:function jM(a){this.a=a},
qa(a,b,c,d){var s,r,q=new A.jS(),p=new A.jT(),o=(a+16)/116,n=q.$1(o),m=q.$1(o+b/500)
if(typeof m!=="number")return A.ag(m)
s=0.96422*m
q=q.$1(o-c/200)
if(typeof q!=="number")return A.ag(q)
r=0.82521*q
return new A.ad(p.$1(3.1338561*s-1.6168667*n-0.4906146*r),p.$1(-0.9787684*s+1.9161415*n+0.033454*r),p.$1(0.0719453*s-0.2289914*n+1.4052427*r),d)},
bw(a){if(a instanceof A.ad)return a
if(typeof a!="string")return null
return $.uz.b5(a,new A.k_(a))},
uy(a){var s,r,q,p,o,n,m,l,k,j,i=null,h=B.d.aO(a).toLowerCase()
if(B.d.ar(h,"#")){s=B.d.aG(h,1)
r=s.length
if(r===3||r===4)s=new A.an(A.b(s.split(""),t.s),t.gL.a(new A.jW()),t.gQ).bB(0)
q=A.us(s,16)
if(q==null)return i
r=s.length
if(r===6)return new A.ad((B.b.L(q,16)&255)/255,(B.b.L(q,8)&255)/255,(q&255)/255,1)
if(r===8)return new A.ad((B.b.L(q,24)&255)/255,(B.b.L(q,16)&255)/255,(B.b.L(q,8)&255)/255,(q&255)/255)
return i}p=B.d.aC(h,"(")
if(p>0&&B.d.dO(h,")")){r=B.d.cE(B.d.a6(h,p+1,h.length-1),A.jO("[,/\\s]+"))
o=A.L(r)
n=o.i("cG<1>")
m=A.a3(new A.cG(r,o.i("B(1)").a(new A.jX()),n),n.i("f.E"))
r=new A.jY(m)
o=m.length
if(o<3)return i
l=o>3?r.$2(3,1):1
k=B.d.a6(h,0,p)
if(k==="rgb"||k==="rgba")return new A.ad(r.$2(0,255),r.$2(1,255),r.$2(2,255),l)
if(k==="hsl"||k==="hsla"){if(0>=m.length)return A.a(m,0)
o=m[0]
o=A.P(A.p6(o,"deg",""))
return A.qb(B.c.X(o==null?0:o,360)/360,r.$2(1,100),r.$2(2,100),l)}return i}j=B.cV.h(0,h)
if(j==null)return i
return new A.ad((j>>>16&255)/255,(j>>>8&255)/255,(j&255)/255,(j>>>24&255)/255)},
qb(a,b,c,d){var s=c<0.5?c*(1+b):c+b-c*b,r=new A.jZ(2*c-s,s)
return new A.ad(r.$1(a+0.3333333333333333),r.$1(a),r.$1(a-0.3333333333333333),d)},
ad:function ad(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jV:function jV(){},
jU:function jU(){},
jS:function jS(){},
jT:function jT(){},
k_:function k_(a){this.a=a},
jW:function jW(){},
jX:function jX(){},
jY:function jY(a){this.a=a},
jZ:function jZ(a,b){this.a=a
this.b=b},
D(a){var s
if(typeof a=="number")s=a
else if(typeof a=="string")s=A.P(a)
else if(A.M(a))s=a?1:0
else s=null
return s},
b5(a){if(a==null)return""
if(typeof a=="number"&&a===B.c.a0(a))return B.b.q(B.c.N(a))
return J.b7(a)},
r1(a){var s,r=!1
if(a!=null){s=J.aj(a)
if(!s.B(a,!1))if(!s.B(a,0))if(!s.B(a,""))r=!(typeof a=="number"&&isNaN(a))}return r},
qL(a,b){var s=new A.lP(a,b)
$.oJ.m(0,a,s)
return s},
ai(a){return new A.lR(a)},
v(a){var s
if(t.f.b(a))return a.J("stops")||a.J("property")?A.qT(a):A.ai(a)
if(t.j.b(a)){s=J.q(a)
s=s.gI(a)&&B.de.u(0,s.gv(a))}else s=!1
if(s){s=J.a2(a)
return A.wp(A.Y(s.gv(a)),s.a1(a,1))}return A.ai(a)},
ff(a){var s,r,q,p,o,n,m,l,k
if(typeof a!="string"||!B.d.u(a,"{"))return new A.nA(A.v(a))
s=A.b([],t.G)
for(r=A.jO("\\{([^}]*)\\}").c6(0,a),r=new A.eK(r.a,r.b,r.c),q=t.s,p=t.lu,o=0;r.n();){n=r.d
m=(n==null?p.a(n):n).b
l=m.index
if(l>o)B.a.k(s,B.d.a6(a,o,l))
if(1>=m.length)return A.a(m,1)
k=m[1]
k.toString
B.a.k(s,A.b([k],q))
o=l+m[0].length}if(o<a.length)B.a.k(s,B.d.aG(a,o))
return new A.nB(s)},
oY(a){if(a==null)return new A.ny()
return new A.nz(A.lU(a))},
lU(a){var s,r,q,p,o,n,m,l,k,j=t.j
if(!j.b(a)||J.dP(a))return A.ai(!J.l(a,!1))
s=J.a2(a)
r=s.gv(a)
q=s.a1(a,1)
p=new A.m3()
s=J.q(q)
if(s.gI(q))if(typeof s.gv(q)=="string"){o=q.length
n=!0
if(o>=2){if(1>=o)return A.a(q,1)
if(j.b(q[1])){o=J.aj(r)
o=o.B(r,"in")||o.B(r,"!in")}else o=n}else o=n
n=o}else n=!1
else n=!1
if("all"===r){j=A.b([],t.V)
for(s=q.length,m=0;m<q.length;q.length===s||(0,A.i)(q),++m)j.push(A.lU(q[m]))
return new A.lV(j)}if("any"===r){j=A.b([],t.V)
for(s=q.length,m=0;m<q.length;q.length===s||(0,A.i)(q),++m)j.push(A.lU(q[m]))
return new A.lW(j)}if("none"===r){j=A.b([],t.V)
for(s=q.length,m=0;m<q.length;q.length===s||(0,A.i)(q),++m)j.push(A.lU(q[m]))
return new A.lX(j)}if("!has"===r)return new A.lY(s.gv(q))
if("!in"===r){l=s.gv(q)
return new A.lZ(J.pp(s.a1(q,1)),p,l)}o=!1
if("in"===r)if(n){o=q.length
if(o===2){if(1>=o)return A.a(q,1)
j=!j.b(q[1])}else j=!0}else j=o
else j=o
if(j){l=s.gv(q)
return new A.m_(J.pp(s.a1(q,1)),p,l)}j="=="===r
if((j||"!="===r||"<"===r||"<="===r||">"===r||">="===r)&&n){l=s.gv(q)
if(1>=q.length)return A.a(q,1)
k=q[1]
A:{if(j){j=new A.m0(p,l,k)
break A}if("!="===r){j=new A.m1(p,l,k)
break A}j=new A.m2(r,p,l,k)
break A}return j}return A.v(a)},
vS(a){var s,r,q,p,o,n="case-sensitive",m=!1
if(a.length>2){s=a[2]
r=t.j
if(r.b(s)){q=t.z
if(J.l(A.u_(s,q),"collator")){if(2>=a.length)return A.a(a,2)
m=a[2]
m.toString
p=A.tZ(r.a(m),1,q)
A:{m=!1
if(t.f.b(p)){o=p.h(0,n)
if(o==null)s=p.J(n)
else s=!0
if(s)m=!0===o}break A}m=!m}}}return m},
oI(a,b,c){var s,r
if(typeof b=="number"&&typeof c=="number")s=B.c.ab(b,c)
else if(typeof b=="string"&&typeof c=="string")s=B.d.ab(b,c)
else return!1
A:{if("<"===a){r=s<0
break A}if("<="===a){r=s<=0
break A}if(">"===a){r=s>0
break A}r=s>=0
break A}return r},
wp(d1,d2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7=null,c8=new A.mn(d2),c9=new A.mm(d2),d0=new A.nj(c8)
if("literal"===d1){s=J.q(d2)
return A.ai(s.gA(d2)?c7:s.gv(d2))}if("get"===d1){s=J.q(d2)
r=s.gA(d2)?c7:s.gv(d2)
if(d2.length>1){q=c8.$1(0)
return new A.mo(c8.$1(1),q)}if(typeof r=="string")return new A.mp(r)
return new A.mq(c8.$1(0))}if("has"===d1){s=J.q(d2)
r=s.gA(d2)?c7:s.gv(d2)
if(d2.length>1){q=c8.$1(0)
return new A.mB(c8.$1(1),q)}return new A.mM(r)}if("!has"===d1){s=J.q(d2)
return new A.mX(s.gA(d2)?c7:s.gv(d2))}if("properties"===d1)return new A.n7()
if("id"===d1)return new A.ne()
if("accumulated"===d1)return new A.nf()
if("feature-state"===d1){s=J.q(d2)
return new A.ng(s.gA(d2)?c7:s.gv(d2))}if("let"===d1){p=A.C(t.N,t.u)
for(s=J.q(d2),o=0;n=o+2,n<d2.length;o=n){if(!(o>=0&&o<d2.length))return A.a(d2,o)
m=A.t(d2[o])
l=o+1
if(!(l>=0&&l<d2.length))return A.a(d2,l)
p.m(0,m,A.v(d2[l]))}B.a.k($.fd,p)
try{s=s.gA(d2)?A.ai(c7):A.v(s.gS(d2))
return s}finally{if(0>=$.fd.length)return A.a($.fd,-1)
$.fd.pop()}}if("var"===d1){for(s=A.L($.fd).i("bd<1>"),m=new A.bd($.fd,s),m=new A.X(m,m.gl(0),s.i("X<a0.E>")),l=J.q(d2),s=s.i("a0.E");m.n();){k=m.d
if(k==null)k=s.a(k)
j=k.h(0,l.gA(d2)?"":A.t(l.gv(d2)))
if(j!=null)return j}return A.ai(c7)}if("heatmap-density"===d1||"line-progress"===d1)return new A.nh()
if("image"===d1)return c8.$1(0)
if("is-supported-script"===d1)return A.ai(!0)
if("resolved-locale"===d1)return A.ai("en")
if("within"===d1){s=J.q(d2)
i=A.q2(s.gA(d2)?c7:s.gv(d2))
if(i==null)return A.ai(!1)
s=[d1]
B.a.F(s,d2)
return A.qL("$geometry:"+B.e.a9(s,c7),new A.mr(i))}if("distance"===d1){s=J.q(d2)
i=A.q2(s.gA(d2)?c7:s.gv(d2))
if(i==null)return A.ai(c7)
s=[d1]
B.a.F(s,d2)
return A.qL("$geometry:"+B.e.a9(s,c7),new A.ms(i))}if("typeof"===d1)return new A.mt(c8.$1(0))
if("to-rgba"===d1)return new A.mu(c8.$1(0))
if("slice"===d1){h=c8.$1(0)
g=c8.$1(1)
return new A.mv(h,g,d2.length>2?c8.$1(2):c7)}if("index-of"===d1){f=c8.$1(0)
e=c8.$1(1)
return new A.mw(e,f,d2.length>2?c8.$1(2):c7)}if("sin"===d1)return d0.$1(A.xp())
if("cos"===d1)return d0.$1(A.xn())
if("tan"===d1)return d0.$1(A.xr())
if("asin"===d1)return d0.$1(A.xl())
if("acos"===d1)return d0.$1(A.xk())
if("atan"===d1)return d0.$1(A.xm())
if("zoom"===d1)return new A.mx()
if("geometry-type"===d1)return new A.my()
if("!"===d1)return new A.mz(c8.$1(0))
d="=="===d1
c=c7
b=c7
a=!1
a0=c7
a1=!1
a2=c7
a3=!1
s=!0
if(!d){a4="!="===d1
a5=!a4
if(a5){c="<"===d1
a=!c
if(a){b="<="===d1
a1=!b
if(a1){a0=">"===d1
a3=!a0
if(a3){a2=">="===d1
s=a2}}}}}else{a4=c7
a5=!1}if(s&&A.vS(d2)){a6=c8.$1(0)
a7=c8.$1(1)
return new A.mA(a6,a7,d1==="=="||d1==="!=",d1)}if(d)return new A.mC(c8.$1(0),c8.$1(1))
if(a4)return new A.mD(c8.$1(0),c8.$1(1))
s=!0
if(!(a5?c:"<"===d1))if(!(a?b:"<="===d1))if(!(a1?a0:">"===d1))s=a3?a2:">="===d1
if(s)return new A.mE(d1,c8.$1(0),c8.$1(1))
if("all"===d1)return new A.mF(c9.$0())
if("any"===d1)return new A.mG(c9.$0())
if("none"===d1)return new A.mH(c9.$0())
if("case"===d1)return new A.mI(c9.$0())
if("match"===d1){h=c8.$1(0)
a8=A.C(t.O,t.u)
for(s=t.j,o=1;m=o+1,m<d2.length;o+=2){if(!(m>=0&&m<d2.length))return A.a(d2,m)
a9=A.v(d2[m])
if(!(o>=0&&o<d2.length))return A.a(d2,o)
b0=d2[o]
m=J.G(s.b(b0)?b0:[b0])
while(m.n())a8.m(0,m.gp(),a9)}if(o<d2.length){if(!(o>=0&&o<d2.length))return A.a(d2,o)
b1=A.v(d2[o])}else b1=A.ai(c7)
return new A.mJ(a8,h,b1)}if("coalesce"===d1)return new A.mK(c9.$0())
if("step"===d1){h=c8.$1(0)
b2=c8.$1(1)
b3=A.b([],t.n)
b4=A.b([],t.V)
for(o=2;s=o+1,s<d2.length;o+=2){if(!(o>=0&&o<d2.length))return A.a(d2,o)
m=d2[o]
if(!(typeof m=="number"))if(typeof m=="string")m=A.P(m)
else if(A.M(m))m=m?1:0
else m=c7
B.a.k(b3,m==null?0:m)
if(!(s>=0&&s<d2.length))return A.a(d2,s)
B.a.k(b4,A.v(d2[s]))}return new A.mL(h,b2,b3,b4)}if("interpolate"===d1||"interpolate-hcl"===d1||"interpolate-lab"===d1){s=J.q(d2)
if(s.gI(d2)&&t.j.b(s.gv(d2))){s=s.gv(d2)
s.toString
t.j.a(s)
b5=s}else b5=B.aa
s=t.n
b3=A.b([],s)
b4=A.b([],t.V)
for(o=2;m=o+1,m<d2.length;o+=2){if(!(o>=0&&o<d2.length))return A.a(d2,o)
l=d2[o]
if(!(typeof l=="number"))if(typeof l=="string")l=A.P(l)
else if(A.M(l))l=l?1:0
else l=c7
B.a.k(b3,l==null?0:l)
if(!(m>=0&&m<d2.length))return A.a(d2,m)
B.a.k(b4,A.v(d2[m]))}m=c8.$1(1)
A:{if("interpolate-hcl"===d1){l="hcl"
break A}if("interpolate-lab"===d1){l="lab"
break A}l=c7
break A}k=J.a2(b5)
if(J.l(k.gv(b5),"exponential")&&k.gl(b5)>1){b6=A.D(k.h(b5,1))
if(b6==null)b6=1}else b6=1
b7=J.l(k.gv(b5),"geometric")
if(J.l(k.gv(b5),"cubic-bezier")&&k.gl(b5)>4){s=A.b([],s)
for(o=1;o<5;++o){b8=k.h(b5,o)
if(!(typeof b8=="number"))if(typeof b8=="string")b8=A.P(b8)
else if(A.M(b8))b8=b8?1:0
else b8=c7
s.push(b8==null?0:b8)}}else s=c7
return A.oL(m,b3,b4,b6,s,b7,l)}if("to-string"===d1)return new A.mN(c8.$1(0))
if("number-format"===d1){a6=c8.$1(0)
if(d2.length>1){if(1<0||1>=d2.length)return A.a(d2,1)
s=t.f.b(d2[1])}else s=!1
if(s){if(1<0||1>=d2.length)return A.a(d2,1)
b9=t.f.a(d2[1])}else b9=B.B
s=A.D(b9.h(0,"min-fraction-digits"))
c0=s==null?c7:B.c.N(s)
if(c0==null)c0=0
s=A.D(b9.h(0,"max-fraction-digits"))
s=s==null?c7:B.c.N(s)
if(s==null)s=3
return new A.mO(a6,Math.max(c0,s),c0)}if("split"===d1)return new A.mP(c8.$1(0),c8.$1(1))
if("join"===d1)return new A.mQ(c8.$1(0),c8.$1(1))
if("hsl"===d1||"hsla"===d1)return new A.mR(c9.$0())
if("to-number"===d1||"number"===d1)return new A.mS(c9.$0(),d1)
if("to-boolean"===d1)return new A.mT(c8.$1(0))
if("to-color"===d1)return new A.mU(c8.$1(0))
if("string"===d1||"boolean"===d1||"array"===d1||"object"===d1)return new A.mV(c9.$0())
if("format"===d1){c1=A.b([],t.hc)
for(s=d2.length,m=t.j,l=t.f,k=t.N,b6=t.u,c2=0;c2<d2.length;d2.length===s||(0,A.i)(d2),++c2){a6=d2[c2]
if(l.b(a6)){b7=c1.length
if(b7===0)continue
if(0>=b7)return A.a(c1,-1)
c3=c1.pop()
b7=A.C(k,b6)
for(b8=a6.gah(),b8=b8.gt(b8);b8.n();){c4=b8.gp()
q=c4.a
c5=c4.b
b7.m(0,A.t(q),A.v(c5))}B.a.k(c1,new A.b3(c3.a,b7,c3.c))}else{b7=A.v(a6)
if(m.b(a6)){b8=J.q(a6)
b8=b8.gI(a6)&&J.l(b8.gv(a6),"image")}else b8=!1
B.a.k(c1,new A.b3(b7,B.cU,b8))}}return new A.mW(c1)}if("concat"===d1){s=A.b([],t.V)
for(m=d2.length,l=t.f,c2=0;c2<d2.length;d2.length===m||(0,A.i)(d2),++c2){a6=d2[c2]
if(!l.b(a6))s.push(A.v(a6))}return new A.mY(s)}if("upcase"===d1)return new A.mZ(c8.$1(0))
if("downcase"===d1)return new A.n_(c8.$1(0))
if("+"===d1||"*"===d1||"min"===d1||"max"===d1)return new A.n0(c9.$0(),d1)
if("-"===d1||"/"===d1||"%"===d1||"^"===d1){a6=c8.$1(0)
if(d2.length===1)return d0.$1(new A.n1())
return new A.n2(a6,c8.$1(1),d1)}if("round"===d1)return d0.$1(new A.n3())
if("floor"===d1)return d0.$1(new A.n4())
if("ceil"===d1)return d0.$1(new A.n5())
if("abs"===d1)return d0.$1(new A.n6())
if("sqrt"===d1)return d0.$1(A.xq())
if("ln"===d1)return d0.$1(A.xo())
if("log10"===d1)return d0.$1(new A.n8())
if("log2"===d1)return d0.$1(new A.n9())
if("e"===d1)return A.ai(2.718281828459045)
if("pi"===d1)return A.ai(3.141592653589793)
if("ln2"===d1)return A.ai(0.6931471805599453)
if("length"===d1)return new A.na(c8.$1(0))
if("in"===d1){f=c8.$1(0)
return new A.nb(c8.$1(1),f)}if("at"===d1){c6=c8.$1(0)
return new A.nc(c8.$1(1),c6)}if("rgb"===d1||"rgba"===d1)return new A.nd(c9.$0())
return A.ai(c7)},
oL(a,b,c,d,e,f,g){if(b.length===0)return A.ai(null)
return new A.m4(a,b,c,e,d,f,g)},
vI(a,b){var s,r,q,p,o,n,m=new A.lN()
for(s=0,r=1,q=0;q<24;++q){p=(s+r)/2
o=a.length
if(0>=o)return A.a(a,0)
n=a[0]
if(2>=o)return A.a(a,2)
n=m.$3(p,n,a[2])
if(typeof n!=="number")return n.ec()
if(n<b)s=p
else r=p}o=a.length
if(1>=o)return A.a(a,1)
n=a[1]
if(3>=o)return A.a(a,3)
return m.$3((s+r)/2,n,a[3])},
qT(a0){var s,r,q,p,o,n,m,l,k,j,i,h,g=a0.h(0,"property"),f=a0.h(0,"type"),e=a0.h(0,"default"),d=a0.h(0,"stops"),c=typeof g=="string",b=c?new A.m8(g):new A.m9(),a=J.aj(f)
if(a.B(f,"identity")||!t.j.b(d)||J.dP(d))return new A.ma(b,e)
if(c&&J.rO(d,new A.mb()))return A.vO(a0,d)
s=[]
r=[]
for(q=J.G(d),p=t.j,o=t.f;q.n();){n=q.gp()
if(p.b(n)){m=J.q(n)
m=m.gl(n)<2||o.b(m.gv(n))}else m=!0
if(m)return A.ai(e)
m=J.q(n)
s.push(m.h(n,0))
r.push(m.h(n,1))}if(a.B(f,"categorical")){c=t.O
l=A.pX(c,c)
A.u7(l,s,r)
return new A.mc(l,b,e)}k=B.a.aj(r,new A.md())
q=A.b([],t.n)
for(p=s.length,j=0;j<s.length;s.length===p||(0,A.i)(s),++j){i=s[j]
if(typeof i=="number")o=i
else if(typeof i=="string")o=A.P(i)
else if(A.M(i))o=i?1:0
else o=null
q.push(o==null?0:o)}p=A.b([],t.V)
for(o=r.length,j=0;j<r.length;r.length===o||(0,A.i)(r),++j)p.push(A.ai(r[j]))
if(!a.B(f,"interval"))a=!k&&!a.B(f,"exponential")
else a=!0
if(a)return new A.me(b,e,r,q)
a=A.D(a0.h(0,"base"))
if(a==null)a=1
h=A.oL(b,q,p,a,null,!1,A.bh(a0.h(0,"colorSpace")))
if(!c)return h
return new A.mf(g,e,h)},
vO(a,b){var s,r,q,p,o,n,m,l,k,j,i="colorSpace",h=t.W,g=A.C(t.i,h)
for(h=J.fi(b,h),s=h.$ti,h=new A.X(h,h.gl(0),s.i("X<y.E>")),r=t.f,s=s.i("y.E");h.n();){q=h.d
if(q==null)q=s.a(q)
p=J.a2(q)
o=p.gv(q)
o.toString
r.a(o)
n=o.h(0,"zoom")
if(typeof n=="number")m=n
else{if(typeof n=="string")n=A.P(n)
else if(A.M(n))n=n?1:0
else n=null
m=n}if(m==null)m=0
n=g.h(0,m)
if(n==null){n=[]
g.m(0,m,n)}o=o.h(0,"value")
B.a.k(n,[o,p.gl(q)>1?p.h(q,1):null])}h=g.$ti.i("am<1>")
l=A.a3(new A.am(g,h),h.i("f.E"))
B.a.aQ(l)
h=A.b([],t.V)
for(s=l.length,r=t.O,k=0;k<l.length;l.length===s||(0,A.i)(l),++k){j=l[k]
h.push(A.qT(A.eh(["type",a.h(0,"type"),"property",a.h(0,"property"),"default",a.h(0,"default"),"colorSpace",a.h(0,i),"stops",g.h(0,j)],r,r)))}s=A.D(a.h(0,"base"))
if(s==null)s=1
return A.oL(new A.lQ(),l,h,s,null,!1,A.bh(a.h(0,i)))},
A:function A(a){var _=this
_.a=0
_.b=a
_.c=""
_.r=_.f=null},
lP:function lP(a,b){this.a=a
this.b=b},
lR:function lR(a){this.a=a},
nA:function nA(a){this.a=a},
nB:function nB(a){this.a=a},
ny:function ny(){},
nz:function nz(a){this.a=a},
m3:function m3(){},
lV:function lV(a){this.a=a},
lW:function lW(a){this.a=a},
lX:function lX(a){this.a=a},
lY:function lY(a){this.a=a},
lZ:function lZ(a,b,c){this.a=a
this.b=b
this.c=c},
m_:function m_(a,b,c){this.a=a
this.b=b
this.c=c},
m0:function m0(a,b,c){this.a=a
this.b=b
this.c=c},
m1:function m1(a,b,c){this.a=a
this.b=b
this.c=c},
m2:function m2(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
mn:function mn(a){this.a=a},
mm:function mm(a){this.a=a},
nj:function nj(a){this.a=a},
nk:function nk(a,b){this.a=a
this.b=b},
mo:function mo(a,b){this.a=a
this.b=b},
mp:function mp(a){this.a=a},
mq:function mq(a){this.a=a},
mB:function mB(a,b){this.a=a
this.b=b},
mM:function mM(a){this.a=a},
mX:function mX(a){this.a=a},
n7:function n7(){},
ne:function ne(){},
nf:function nf(){},
ng:function ng(a){this.a=a},
nh:function nh(){},
mr:function mr(a){this.a=a},
ms:function ms(a){this.a=a},
mt:function mt(a){this.a=a},
mu:function mu(a){this.a=a},
mv:function mv(a,b,c){this.a=a
this.b=b
this.c=c},
ni:function ni(a){this.a=a},
mw:function mw(a,b,c){this.a=a
this.b=b
this.c=c},
mx:function mx(){},
my:function my(){},
mz:function mz(a){this.a=a},
mA:function mA(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
mC:function mC(a,b){this.a=a
this.b=b},
mD:function mD(a,b){this.a=a
this.b=b},
mE:function mE(a,b,c){this.a=a
this.b=b
this.c=c},
mF:function mF(a){this.a=a},
mG:function mG(a){this.a=a},
mH:function mH(a){this.a=a},
mI:function mI(a){this.a=a},
mJ:function mJ(a,b,c){this.a=a
this.b=b
this.c=c},
mK:function mK(a){this.a=a},
mL:function mL(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
mN:function mN(a){this.a=a},
mO:function mO(a,b,c){this.a=a
this.b=b
this.c=c},
mP:function mP(a,b){this.a=a
this.b=b},
mQ:function mQ(a,b){this.a=a
this.b=b},
mR:function mR(a){this.a=a},
mS:function mS(a,b){this.a=a
this.b=b},
mT:function mT(a){this.a=a},
mU:function mU(a){this.a=a},
mV:function mV(a){this.a=a},
mW:function mW(a){this.a=a},
mY:function mY(a){this.a=a},
mZ:function mZ(a){this.a=a},
n_:function n_(a){this.a=a},
n0:function n0(a,b){this.a=a
this.b=b},
n1:function n1(){},
n2:function n2(a,b,c){this.a=a
this.b=b
this.c=c},
n3:function n3(){},
n4:function n4(){},
n5:function n5(){},
n6:function n6(){},
n8:function n8(){},
n9:function n9(){},
na:function na(a){this.a=a},
nb:function nb(a,b){this.a=a
this.b=b},
nc:function nc(a,b){this.a=a
this.b=b},
nd:function nd(a){this.a=a},
m4:function m4(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
lN:function lN(){},
m8:function m8(a){this.a=a},
m9:function m9(){},
ma:function ma(a,b){this.a=a
this.b=b},
mb:function mb(){},
mc:function mc(a,b,c){this.a=a
this.b=b
this.c=c},
md:function md(){},
m7:function m7(){},
me:function me(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
mf:function mf(a,b,c){this.a=a
this.b=b
this.c=c},
lQ:function lQ(){},
fo:function fo(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
fK:function fK(a,b,c,d,e,f,g,h,i,j,k,l,m){var _=this
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
iT:function iT(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
iU:function iU(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
xf(a){var s,r,q,p,o,n,m,l,k
if(!(a instanceof A.ck))return new A.z(B.d.aO(J.b7(a==null?"":a)),null)
s=a.a
if(B.a.aj(s,new A.nP()))return new A.z(B.d.aO(a.q(0)),null)
for(r=0,q="";p=s.length,r<p;++r){o=s[r].b
if(r===0)o=B.d.ia(o)
if(r===s.length-1)o=B.d.ib(o)
q=q+A.S(57344)+A.S(57600+r)
if(!(r<s.length))return A.a(s,r)
q=s[r].a==null?q+o:q+A.S(57599)}n=[]
for(m=0;m<s.length;s.length===p||(0,A.i)(s),++m){l=s[m]
k=l.e
k=k==null?null:(B.c.a3(B.c.D(k.d,0,1)*255)<<24|B.c.a3(B.c.D(k.a,0,1)*255)<<16|B.c.a3(B.c.D(k.b,0,1)*255)<<8|B.c.a3(B.c.D(k.c,0,1)*255))>>>0
n.push([l.c,l.d,k,l.f,l.a])}return new A.z(q.charCodeAt(0)==0?q:q,n)},
p4(a){var s,r,q,p
if(!B.d.u(a,A.S(57344)))return a
s=new A.be("")
r=A.a3(new A.c_(a),t.mO.i("f.E"))
for(q=0;q<r.length;++q){p=r[q]
if(p===57344){++q
continue}if(p===57599)continue
p=A.S(p)
s.a+=p}p=s.a
return p.charCodeAt(0)==0?p:p},
br:function br(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
ck:function ck(a){this.a=a},
j_:function j_(){},
nP:function nP(){},
pD(a,b,c,d){var s=A.b([],t.ha),r=A.b([],t.r),q=b!=null
s=new A.bs(d,c,s,q,r)
s.cZ(a)
if(q)s.r=A.uq(r,b)
return s},
tD(a){var s,r,q,p,o,n,m=a.length,l=m-2
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
fL(a){var s,r,q,p,o,n,m=J.q(a),l=m.gl(a)*2,k=new Float64Array(l)
for(m=m.gt(a),s=t.j,r=0;m.n();){q=m.gp()
if(!s.b(q)||J.Z(q)<2)continue
p=r+1
o=J.q(q)
n=A.ae(o.h(q,0))
if(!(r<l))return A.a(k,r)
k[r]=(n+180)/360
r=p+1
o=A.p9(A.ae(o.h(q,1)))
if(!(p<l))return A.a(k,p)
k[p]=o}return r===l?k:A.cj(k,0,r)},
tE(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e={}
e.a=A.b([],t.n)
e.b=0
s=new A.j4(e,b,c)
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
g=new A.j3(o)
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
tF(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c
for(s=t.n,r=a,q=0;q<4;++q){p=A.b([],s)
o=new A.j5(q)
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
B.a.k(p,d)}}r=new Float64Array(A.a1(p))}return r},
bs:function bs(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=0
_.d=c
_.e=d
_.f=e
_.r=null},
j4:function j4(a,b,c){this.a=a
this.b=b
this.c=c},
j3:function j3(a){this.a=a},
j5:function j5(a){this.a=a},
hR:function hR(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
i2:function i2(a){this.a=a},
dw:function dw(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
xe(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=new A.nO(a),e=A.b([],t.t)
for(s=!1,r=0;q=a.length,r<q;++r){if(!(r>=0))return A.a(a,r)
p=a[r]
o=B.N.h(0,p)
if(o==null)o=0
n=!1
if(o===1){B.a.k(e,p)
continue}m=f.$1(r)
if(p===1604&&m!=null){if(m>>>0!==m||m>=a.length)return A.a(a,m)
l=B.cQ.h(0,a[m])}else l=null
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
q=B.N.h(0,a[m])
if(q==null)q=0
q=q===2||q===3||q===5
h=q}else h=n
else h=n
g=B.cR.h(0,p)
if(g==null)k=0
else{if(i)q=h?3:1
else q=h?2:0
k=g[q]}B.a.k(e,k===0?p:k)
s=h}return e},
nO:function nO(a){this.a=a},
xG(a){var s,r,q,p
for(s=new A.d2(a),r=t.gS,s=new A.X(s,s.gl(0),r.i("X<y.E>")),r=r.i("y.E");s.n();){q=s.d
if(q==null)q=r.a(q)
if(!(q>=1424&&q<=2303))p=q>=64285&&q<=65276
else p=!0
if(p)return!0
if(q>=65&&q<=591)return!1}return!1},
tG(a,b){var s,r,q,p,o,n=t.S,m=A.b([],t.oJ)
for(s=a.$ti,r=new A.X(a,a.gl(0),s.i("X<y.E>")),s=s.i("y.E");r.n();){q=r.d
m.push(new A.bZ(A.uC(q==null?s.a(q):q,0),null))}s=A.b([],t.s)
for(r=a.a,q=J.q(r),p=b!=null,o=0;o<q.gl(r);++o)s.push(A.pE(p&&o<J.Z(b.a)?b.$ti.y[1].a(J.aL(b.a,o)):""))
return new A.j8(m,s,A.C(t.N,t.L),A.C(n,t.kJ),A.C(n,t.gp))},
pE(a){var s,r,q,p,o=A.b([],t.s)
for(s=B.d.cE(a.toLowerCase(),A.jO("[\\s_-]+")),r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q]
if(p.length!==0&&!B.da.u(0,p))o.push(p)}return B.a.bB(o)},
tH(a){return B.b.D(B.c.a3(a/100)*100,100,900)},
oS(c5,c6,c7,c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1=1751474532,c2=t.n,c3=A.b([],c2),c4=J.q(c6)
if(c4.gA(c6))return new A.z(c3,0)
for(s=A.t2(c6).d,r=s.length,q=c8!==0,p=c5.c,o=J.a2(c9),n=c5.r,m=c7/100,l=t.S,k=t.gc,j=t.Q,i=t.q,h=0,g=0;g<s.length;s.length===r||(0,A.i)(s),++g){f=s[g]
e=c4.H(c6,f.a,f.b)
d=(f.c&1)===1
c=A.uB(e)
b=J.G(d?new A.bd(c,A.L(c).i("bd<1>")):c)
a=!d
a0=J.a2(e)
while(b.n()){a1=b.gp()
a2=a0.H(e,a1.a,a1.b)
a4=o.gt(c9)
a1=a1.c
a5=0
for(;;){if(!a4.n()){a3=null
break}a5=a4.gp()
a6=a5*1000+B.b.D(B.c.a3(m)*100,100,900)
a7=n.h(0,a6)
if(a7==null){a7=new A.hj(c5.hy(a5,c7),A.C(l,k),new A.j6(A.b([],j),A.b([],i),B.r))
n.m(0,a6,a7)
a6=a7}else a6=a7
a8=a6.ee(a2,d?B.k:B.r,a1)
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
b5=b4==null?null:new A.m(a4.a.a,b4.c)
if(b5==null)A.n(A.h("font has no "+A.aB(A.cE(c1))+" table"))
a1=a1.c=A.tS(b5)}else a1=a4
b6=a1.f
for(a1=a3.a,a4=a3.b,b7=0;b7<a1.length;++b7){b8=a1[b7]
if(!(b7<a4.length))return A.a(a4,b7)
b9=a4[b7]
c0=b9.a/b6
a6=b8.a
if(a6!==0)B.a.F(c3,A.b([a5,a6,h+b9.c/b6,-b9.d/b6,c0],c2))
h+=c0
if(a&&q&&c0>0)h+=c8}}}return new A.z(c3,h)},
vJ(a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=t.fC,c=A.b([],d),b=t.t,a=A.b([],b)
for(s=a1.length,r=0;r<a1.length;a1.length===s||(0,A.i)(a1),++r){q=a1[r]
if(q===32||q===160||q===12288){if(a.length!==0)B.a.k(c,a)
a=A.b([],b)}else B.a.k(a,q)}if(a.length!==0)B.a.k(c,a)
if(c.length<2)return A.b([a1],d)
s=A.oS(a0,B.aV,a2,a3,a5)
p=s==null?null:s.b
if(p==null)p=0.25
s=A.b([],t.n)
for(o=c.length,r=0;r<c.length;c.length===o||(0,A.i)(c),++r){n=c[r]
m=A.oS(a0,n,a2,a3,a5)
m=m==null?null:m.b
s.push(m==null?n.length*0.5:m)}l=B.a.dQ(s,0,new A.lO(),t.i)+p*(c.length-1)
if(l<=a4)return A.b([a1],d)
k=B.c.bw(l/a4)
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
B.a.F(h,c[f])
o=h.length
if(!(f<c.length))return A.a(c,f)
o=o===c[f].length?0:p
if(!(f<s.length))return A.a(s,f)
g+=o+s[f]}if(h.length!==0)B.a.k(i,h)
return i},
rb(a,b,c,d,e,f,g,h,i){var s,r,q,p,o={},n=a.hX(h),m=A.b([],t.fC)
o.a=A.b([],t.t)
s=new A.nQ(o,g,f,m,a,i,d,n)
for(r=new A.dn(b);r.n();){q=r.d
if(q===10||q===13||q===8232||q===8233){if(g)B.a.k(o.a,32)
else s.$0()
continue}p=o.a
B.a.k(p,q===9?32:q)}s.$0()
return A.wg(a,m,i,d,e,c,n)},
wg(a4,a5,a6,a7,a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=A.b([],t.k_)
for(s=a5.length,r=0;r<a5.length;a5.length===s||(0,A.i)(a5),++r){q=A.oS(a4,a5[r],a6,a7,b0)
if(q==null)return null
B.a.k(a3,q)}p=B.a.dQ(a3,0,new A.m6(),t.i)
s=A.E(J.ik(b0))
o=a4.c
if(!(s>=0&&s<o.length))return A.a(o,s)
n=o[s]
m=n.a.b6(1751672161)
l=n.ghB().f
s=m.b+4
m.j(s,2)
o=m.a
k=o.getInt16(s,!1)/l
s=m.b+6
m.j(s,2)
j=(a8-k- -o.getInt16(s,!1)/l)/2
s=t.n
i=A.b([],s)
for(o=A.pK(a3,0,t.hT),h=J.G(o.a),g=o.b,o=new A.bt(h,g,A.r(o).i("bt<1>")),f=a9>0,e=a9<0;o.n();){d=o.c
d=d>=0?new A.z(g+d,h.gp()):A.n(A.aE())
c=d.b
b=c.a
a=c.b
A:{if(e){a0=0
break A}if(f){a0=p-a
break A}a0=(p-a)/2
break A}a1=d.a*a8+j+k
for(d=J.q(b),a2=0;a2<d.gl(b);a2+=5)B.a.F(i,A.b([d.h(b,a2),d.h(b,a2+1),d.h(b,a2+2)+a0,d.h(b,a2+3)+a1,d.h(b,a2+4)],s))}s=new Float32Array(A.a1(i))
o=a3.length
return new A.k3(s,p,o*a8,o)},
j8:function j8(a,b,c,d,e){var _=this
_.c=a
_.d=b
_.e=c
_.f=d
_.r=e},
ja:function ja(a,b){this.a=a
this.b=b},
j9:function j9(a,b,c){this.a=a
this.b=b
this.c=c},
k3:function k3(a,b,c,d){var _=this
_.d=a
_.e=b
_.f=c
_.r=d},
lO:function lO(){},
nQ:function nQ(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
m6:function m6(){},
tJ(a){var s,r,q,p,o,n=A.b([],t.ez),m=a.length,l=new A.i5(a,0,m)
while(l.b<m){s=l.C()
r=s&7
if(s>>>3===1&&r===2){q=l.dW()
for(p=q.c;q.b<p;){s=q.C()
o=s&7
if(s>>>3===3&&o===2)B.a.k(n,A.tI(q.dW()))
else q.T(0,o)}}else l.T(0,r)}return n},
tI(a){var s,r,q,p,o,n,m
new Uint8Array(0)
for(s=a.c,r=a.a,q=0,p=0;a.b<s;){o=a.C()
switch(o>>>3){case 1:q=a.C()
break
case 2:n=a.C()
m=a.b
A.hB(r,m,m+n)
a.b+=n
break
case 3:a.C()
break
case 4:a.C()
break
case 5:a.C()
break
case 6:a.C()
break
case 7:p=a.C()
break
default:a.T(0,o&7)}}return new A.bv(q,p)},
bv:function bv(a,b){this.a=a
this.r=b},
i5:function i5(a,b,c){this.a=a
this.b=b
this.c=c},
jb:function jb(a,b,c,d,e,f,g,h,i){var _=this
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
jc:function jc(a,b){this.a=a
this.b=b},
fN(a,b){var s=new A.jf(),r=s.$1(a)
s=s.$1(b)
if(typeof s!=="number")return s.aP()
if(typeof r!=="number")return r.bF()
return r+s*4096},
tQ(a){var s,r,q,p,o,n,m,l
A:{s=a instanceof A.ba
r=null
q=!1
if(s){p=a.cx==null
if(p){r=!a.dx
q=r}o=p}else{p=null
o=!1}if(q){q=0
break A}if(s)q=o?r:!a.dx
else q=!1
if(q){q=2
break A}if(a instanceof A.d0){q=3
break A}if(a instanceof A.co){q=6
break A}q=a instanceof A.dh
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
pH(a,b){var s,r
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
pI(f7,f8,f9,g0,g1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5=null,f6=new A.A(B.i)
f6.a=g1
s=A.C(t.S,t.ke)
for(r=f8.length,q=t.D,p=0;p<f8.length;f8.length===r||(0,A.i)(f8),++p){o=f8[p]
n=o.a
m=s.h(0,n)
if(m==null){m=A.b([],q)
s.m(0,n,m)
n=m}else n=m
B.a.k(n,o)}l=new A.b8(new Float64Array(16384))
k=new A.jk(new Uint32Array(16384))
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
a1=A.tQ(a0)
if(a1<0)continue
a=s.h(0,a0.b)
if(a==null)a=B.a6
a2=a.length
a3=a1!==0
a4=a1*16384
a5=a1!==1
a6=a1===5
a7=a1!==3
a8=a1===6
a9=a1!==4
b0=a1===2
b1=a0 instanceof A.d0
p=0
for(;p<a.length;a.length===a2||(0,A.i)(a),++p){o=a[p]
b2=o.b
b3=!a7||a8
if(!b3&&b2.d.length===0)continue
if(b3&&b2.b.length===0)continue
b4=j.length
if(b4-c>=80){B.a.F(i,A.b([d,k.b-d,c],r))
d=k.b
c=j.length
b4=c}b5=b4-c
b4=o.c
B.a.k(j,new A.z(b,b4))
b6=B.b.O(l.b,6)
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
f6.saf(b4==null?B.i:b4)
b4=a0.dy
b4=b4==null?f5:b4.$1(f6)
if(!(typeof b4=="number"))if(typeof b4=="string")b4=A.P(b4)
else if(A.M(b4))b4=b4?1:0
else b4=f5
if(b4==null)b4=0
c8=Math.max(0,b4)}else{c7=0
c8=0}for(b4=b5+a4,c9=0;c9<c5;++c9){d0=B.b.O(l.b,6)
for(c6=c9*2,d1=c6+1,d2=0;d2<4;++d2){d3=B.aW[d2]
if(!(c6<c3))return A.a(b7,c6)
d4=b7[c6]
if(!(d1<c3))return A.a(b7,d1)
l.an(d4,b7[d1],A.fN(d3.a,d3.b),c8)
l.b0(b4,c7)}for(d2=0;d2<6;++d2)k.k(0,d0+B.cL[d2])}continue}d5=!a5||!a9||a6?g0:f9
if(d5>0){d6=A.b([],e)
b4=A.b([],r)
d7=new A.kt(8,4096/d5,d6,b4)
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
e3=A.pH(c4,c9)
if(!(e2<c6))return A.a(d8,e2)
d8[e2]=e3}e8=b2.d
for(c3=e8.length,e9=0;c6=e9+2,c6<c3;e9+=3){if(!(e9<c3))return A.a(e8,e9)
d3=e8[e9]
d9=e9+1
if(!(d9<c3))return A.a(e8,d9)
d7.h7(0,d8,d3,e8[d9],e8[c6])}for(c3=b5+a4,c9=0;c6=d6.length,c9<(c6/8|0);++c9){f0=c9*8
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
e2=A.fN(e1,d6[e2])
c6=e2}if(c2){e1=f0+4
if(!(e1<d6.length))return A.a(d6,e1)
e1=d6[e1]}else if(d4)e1=0
else{e1=f0+4
e2=d6.length
if(!(e1<e2))return A.a(d6,e1)
e1=d6[e1]
e3=f0+5
if(!(e3<e2))return A.a(d6,e3)
e3=A.fN(e1,d6[e3])
e1=e3}l.an(d3,d9,c6,e1)
e1=f0+7
if(!(e1<d6.length))return A.a(d6,e1)
e1=B.b.D(B.c.a3(d6[e1]),0,127)
if(d1)c6=0
else{c6=f0+6
if(!(c6<d6.length))return A.a(d6,c6)
c6=d6[c6]}l.b0(c3+e1*131072,c6)}for(c3=b4.length,d2=0;d2<b4.length;b4.length===c3||(0,A.i)(b4),++d2)k.k(0,b6+b4[d2])
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
e3=A.fN(e3,b9[e0])
e2=e3}if(c2){if(!(d4<c1.length))return A.a(c1,d4)
e0=c1[d4]}else if(d1)e0=0
else{e3=c0.length
if(!(d4<e3))return A.a(c0,d4)
e4=c0[d4]
if(!(e0<e3))return A.a(c0,e0)
e0=A.fN(e4,c0[e0])}l.an(d9,e1,e2,e0)
e0=A.pH(c4,c9)
if(b4)d4=0
else{d4+=c2?1:0
if(!(d4<c1.length))return A.a(c1,d4)
d4=c1[d4]}l.b0(c6+e0*131072,d4)}for(b4=b2.d,c3=b4.length,d2=0;d2<c3;++d2)k.k(0,b6+b4[d2])
f1=b2.a
if((!a3||b0)&&f1!=null&&f.a(a0).db!=null){f2=i.length/3|0
if(g.length!==0&&B.a.gS(g).a===b&&B.a.gS(g).b===f2)f3=B.a.gS(g).c
else{B.a.k(g,new A.b3(b,f2,A.b([],r)))
f3=B.a.gS(g).c}for(b4=f1.length,d2=0;d2<b4;++d2)B.a.k(f3,b6+f1[d2])}}}q=k.b
if(q===0)return f5
if(!(a<n))return A.a(h,a)
h[a]=q
B.a.F(i,A.b([d,q-d,c],r))
f4=A.b([],r)
for(q=g.length,p=0;p<g.length;g.length===q||(0,A.i)(g),++p){n=g[p]
f3=n.c
m=J.q(f3)
if(m.gA(f3))continue
B.a.F(f4,A.b([n.a,n.b,k.b,m.gl(f3)],r))
for(n=m.gt(f3);n.n();)k.k(0,n.gp())}r=new Float32Array(A.a1(A.cj(l.a,0,l.b)))
q=B.P.H(k.a,0,k.b)
n=new Int32Array(A.a1(i))
m=new Int32Array(A.a1(f4))
return new A.je(m,h,r,q,j,n)},
je:function je(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
jf:function jf(){},
ud(a){var s,r,q,p,o=A.C(t.N,t.dl),n=a.length,m=new A.c8(a,0,n)
while(m.b<n){s=m.C()
if(s===26){r=m.C()
q=m.b
p=A.ub(a,q,q+r)
o.m(0,p.a,p)
m.b+=r}else m.T(0,s&7)}return new A.jy(o)},
ub(a,b,c){var s,r,q,p,o,n=A.b([],t.s),m=[],l=A.b([],t.ef),k=new A.c8(a,b,c)
for(s="",r=4096;k.b<c;){q=k.C()
switch(q){case 10:s=k.bI()
break
case 18:p=k.C()
o=k.b
B.a.k(l,A.ua(a,o,o+p))
k.b+=p
break
case 26:B.a.k(n,k.bI())
break
case 34:p=k.C()
o=k.b
m.push(A.uc(a,o,o+p))
k.b+=p
break
case 40:r=k.C()
break
default:k.T(0,q&7)}}return new A.em(s,r,n,m,l)},
uc(a,b,c){var s,r,q,p,o=new A.c8(a,b,c)
for(s=null;o.b<c;){r=o.C()
switch(r){case 10:s=o.bI()
break
case 21:q=o.b
p=A.oi(a,q,q+4).getFloat32(0,!0)
o.b+=4
s=p
break
case 25:q=o.b
p=A.oi(a,q,q+8).getFloat64(0,!0)
o.b+=8
s=p
break
case 32:case 40:s=o.C()
break
case 48:p=o.C()
s=(p&1)===0?B.b.O(p,2):-B.b.O(p+1,2)
break
case 56:s=o.C()!==0
break
default:o.T(0,r&7)}}return s},
ua(a,b,c){var s,r,q,p,o,n,m,l,k=new A.c8(a,b,c)
for(s=0,r=null,q=0,p=0,o=0,n=0;k.b<c;){m=k.C()
switch(m){case 8:r=k.C()
break
case 18:l=k.C()
q=k.b
p=q+l
k.b=p
break
case 24:s=k.C()
break
case 34:l=k.C()
o=k.b
n=o+l
k.b=n
break
default:k.T(0,m&7)}}return new A.el(a,s,r,q,p,o,n)},
jy:function jy(a){this.a=a},
em:function em(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
el:function el(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
fM:function fM(a,b){this.a=a
this.b=0
this.c=b},
c8:function c8(a,b,c){this.a=a
this.b=b
this.c=c},
q2(a){var s=A.b([],t.n),r=A.b([],t.b),q=A.b([],t.ot),p=new A.ha(s,r,q)
p.bY(a)
return s.length===0&&r.length===0&&q.length===0?null:p},
jF(a){var s,r,q,p=t.n,o=A.b([],p),n=t.j
if(n.b(a))for(s=J.G(a);s.n();){r=s.gp()
if(n.b(r)){q=J.q(r)
q=q.gl(r)>=2&&typeof q.h(r,0)=="number"&&typeof q.h(r,1)=="number"}else q=!1
if(q){q=J.q(r)
B.a.F(o,A.b([A.ae(q.h(r,0)),A.ae(q.h(r,1))],p))}}return o},
un(a,b,c,d,e){var s=(a-c)*e,r=b-d
return Math.sqrt(s*s+r*r)},
ov(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=J.q(c)
if(e.gl(c)<4)return e.gl(c)<2?1/0:A.un(a,b,e.h(c,0),e.h(c,1),d)
for(s=1/0,r=0;q=r+3,q<e.gl(c);){p=e.h(c,r)
o=e.h(c,r+1)
r+=2
n=(e.h(c,r)-p)*d
m=e.h(c,q)-o
l=(a-p)*d
k=b-o
j=n*n+m*m
i=j===0?0:B.c.D((l*n+k*m)/j,0,1)
h=l-n*i
g=k-m*i
f=Math.sqrt(h*h+g*g)
if(f<s)s=f}return s},
ha:function ha(a,b,c){this.a=a
this.b=b
this.c=c},
jH:function jH(a){this.a=a},
jG:function jG(a,b,c){this.a=a
this.b=b
this.c=c},
pJ(a,b){return new A.jj(a,b)},
cB:function cB(a,b){this.a=a
this.b=b},
jj:function jj(a,b){this.a=a
this.b=b},
pa(a,b){var s=0,r=A.av(t.o)
var $async$pa=A.aw(function(c,d){if(c===1)return A.as(d,r)
for(;;)switch(s){case 0:return A.at(null,r)}})
return A.au($async$pa,r)},
nJ(a){var s=0,r=A.av(t.p),q,p,o,n
var $async$nJ=A.aw(function(b,c){if(b===1)return A.as(c,r)
for(;;)switch(s){case 0:p=v.G
o=A.aQ(A.aQ(A.aQ(new p.Blob(A.b([a],t.aA))).stream()).pipeThrough(A.aQ(new p.DecompressionStream("gzip"))))
n=A
s=3
return A.W(A.p5(A.aQ(A.aQ(new p.Response(o)).arrayBuffer()),t.eb),$async$nJ)
case 3:q=n.ot(c,0,null)
s=1
break
case 1:return A.at(q,r)}})
return A.au($async$nJ,r)},
er:function er(){},
jA:function jA(a,b){this.a=a
this.b=b},
jz:function jz(a){this.a=a},
iW:function iW(a){this.a=a},
oP(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=null,e=new A.be(""),d=[null]
for(s=J.G(a),r=t.e7,q=t.f,p=t.bW,o=t.p,n=t.kI,m=t.hM,l=t.pk;s.n();){k=s.gp()
if(k==null){e.a+="n"
d.push(f)
continue}j=A.M(k)
i=j?k:f
if(j){e.a+="b"
d.push(i)
continue}j=typeof k=="string"
i=j?k:f
if(j){e.a+="s"
d.push(i)
continue}j=A.dF(k)
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
d.push(A.ig(i,i,b))
continue}j=m.b(k)
i=j?k:f
if(j){e.a+="S"
d.push(A.ig(i,i,b))
continue}j=n.b(k)
i=j?k:f
if(j){e.a+="D"
d.push(A.ig(i,i,b))
continue}j=o.b(k)
i=j?k:f
if(j){e.a+="U"
d.push(A.ig(i,i,b))
continue}j=p.b(k)
i=j?k:f
if(j){e.a+="I"
d.push(A.ig(i,i,b))
continue}j=q.b(k)
i=j?k:f
if(j){e.a+="m"
j=[]
for(h=i.gah(),h=h.gt(h);h.n();){g=h.gp()
B.a.F(j,[g.a,g.b])}d.push(A.oP(j,b))
continue}j=r.b(k)
i=j?k:f
if(j){e.a+="l"
d.push(A.oP(i,b))
continue}throw A.e(A.aM("A "+J.po(k).q(0)+" cannot be sent to a worker",f))}s=e.a
B.a.m(d,0,s.charCodeAt(0)==0?s:s)
return d},
ig(a,b,c){var s
if(a.byteOffset===0&&a.byteLength===J.rP(J.pn(a))&&a.byteLength>0){s=t.eb.a(J.pn(a))
if(!B.a.b1(c,new A.mj(s)))B.a.k(c,s)}return b},
oN(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(0<0||0>=a.length)return A.a(a,0)
s=a[0]
s.toString
A.Y(s)
r=s.length
q=A.T(r,null,!0,t.O)
for(p=t.dM,o=t.da,n=t.hD,m=t.g_,l=t.nZ,k=t.bi,j=0;j<r;j=i){i=j+1
if(!(i>=0&&i<a.length))return A.a(a,i)
h=a[i]
g=s[j]
A:{if("n"===g){f=null
break A}if("b"===g){h.toString
A.oG(h)
f=h
break A}if("s"===g){h.toString
A.Y(h)
f=h
break A}if("i"===g){h.toString
h=A.E(A.dD(h))
f=h
break A}if("d"===g){h.toString
A.dD(h)
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
f=A.wj(A.oN(p.a(h)))
break A}h.toString
f=A.oN(p.a(h))
break A}B.a.m(q,j,f)}return q},
wj(a){var s,r,q,p,o=t.O
o=A.C(o,o)
for(s=0;r=a.length,s<r;s+=2){q=a[s]
p=s+1
if(!(p<r))return A.a(a,p)
o.m(0,q,a[p])}return o},
mj:function mj(a){this.a=a},
up(a,b,c){var s,r,q,p,o,n,m,l,k,j
for(s=0,r=1,q=0;q<a;++q){s+=r
r*=4}p=a===0?0:B.b.ae(1,a-1)
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
uo(a,b){var s,r,q=a.length,p=q-1
for(s=0;s<=p;){r=B.b.L(s+p,1)
if(!(r<q))return A.a(a,r)
if(a[r].a<=b)s=r+1
else p=r-1}if(p<0)q=null
else{if(!(p<q))return A.a(a,p)
q=a[p]}return q},
eu(a,b){var s=0,r=A.av(t.p),q,p
var $async$eu=A.aw(function(c,d){if(c===1)return A.as(d,r)
for(;;)switch(s){case 0:if(0===b||1===b){p=a
s=3
break}s=2===b?4:5
break
case 4:s=6
return A.W(A.nJ(a),$async$eu)
case 6:p=d
s=3
break
case 5:p=A.n(B.aN)
case 3:q=p
s=1
break
case 1:return A.at(q,r)}})
return A.au($async$eu,r)},
q3(a){var s,r,q,p,o,n,m,l,k,j,i,h,g={}
g.a=0
s=new A.jJ(g,a)
r=s.$0()
q=t.S
p=A.T(r,0,!1,q)
o=A.T(r,0,!1,q)
n=A.T(r,0,!1,q)
for(m=0,l=0;l<r;++l){q=s.$0()
if(typeof q!=="number")return A.ag(q)
m+=q
B.a.m(p,l,m)}for(l=0;l<r;++l)B.a.m(o,l,s.$0())
for(l=0;l<r;++l)B.a.m(n,l,s.$0())
k=A.b([],t.mE)
for(j=0,l=0;l<r;++l){i=s.$0()
h=i===0&&l>0?j:i-1
q=n[l]
j=h+q
B.a.k(k,new A.eQ(p[l],o[l],h,q))}return k},
jI:function jI(a,b,c,d){var _=this
_.a=a
_.c=b
_.d=c
_.r=_.f=null
_.w=d},
jK:function jK(a){this.a=a},
jJ:function jJ(a,b){this.a=a
this.b=b},
hY:function hY(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
eQ:function eQ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
uZ(a){var s,r,q,p,o,n,m,l,k=J.q(a),j=k.h(a,0)
j.toString
A.E(j)
s=new A.l_(a)
r=new A.kZ(a)
q=k.h(a,1)
A:{if("build"===q){p=s.$0()
k=k.h(a,5)
k.toString
j=new A.dV(p,A.E(k),j)
k=j
break A}if("find"===q){p=s.$0()
o=r.$1(5)
n=r.$1(6)
m=r.$1(7)
l=r.$1(8)
j=new A.e6(p,o,n,m,l,k.h(a,9)==null?null:new A.z(r.$1(9),r.$1(10)),j)
k=j
break A}if("cluster"===q){p=k.h(a,2)
p.toString
p=A.tv(B.cm,A.Y(p),t.j8)
o=k.h(a,3)
o.toString
A.E(o)
n=k.h(a,4)
n.toString
A.E(n)
k=k.h(a,5)
k.toString
j=new A.dS(p,o,n,A.E(k),j)
k=j
break A}k=A.n(A.aM("No worker request is called "+A.t(q),null))}return k},
l0:function l0(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
c6:function c6(){},
l_:function l_(a){this.a=a},
kZ:function kZ(a){this.a=a},
dV:function dV(a,b,c){this.b=a
this.c=b
this.a=c},
e6:function e6(a,b,c,d,e,f,g){var _=this
_.b=a
_.c=b
_.d=c
_.e=d
_.f=e
_.r=f
_.a=g},
bN:function bN(a,b){this.a=a
this.b=b},
dS:function dS(a,b,c,d,e){var _=this
_.b=a
_.c=b
_.d=c
_.e=d
_.a=e},
aC:function aC(){},
hz:function hz(){},
hv:function hv(a,b){this.c=a
this.a=b},
hy:function hy(a,b){this.c=a
this.a=b},
e5:function e5(a,b){this.b=a
this.a=b},
dY:function dY(a,b){this.b=a
this.a=b},
d1:function d1(a,b){this.b=a
this.a=b},
fu:function fu(a,b,c){this.a=a
this.b=b
this.c=c},
hx:function hx(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
xu(c2,c3,c4,c5,c6,c7,c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1=new A.A(B.i)
c1.a=c8
s=new Float64Array(4096)
r=t.t
q=A.b([],r)
p=new A.fM(s,q)
o=A.b([],t.cb)
n=new A.nY(c8)
for(s=J.G(c2),m=t.bs,l=m.i("X<a0.E>"),k=c3.at,j=c3.as,i=m.i("a0.E"),h=c3.ax,g=t.s,f=t.x,e=c3.ay;s.n();){d=s.gp()
c=A.b([],r)
for(b=0;b<k.length;++b){a=k[b].b
if(!(a>=0&&a<j.length))return A.a(j,a)
a=j[a]
a0=!1
if(a.c===c4)if(a.d===d.gaw()){if(!(b<k.length))return A.a(k,b)
a=k[b]
a=n.$2(a.c,a.d)}else a=a0
else a=a0
if(a)c.push(b)}a=A.b([],r)
for(b=0;b<h.length;++b){a0=h[b].b
a1=!1
if(a0.b===c4)if(a0.c===d.gaw()){if(!(b<h.length))return A.a(h,b)
a0=h[b].b
a0=n.$2(a0.z,a0.Q)}else a0=a1
else a0=a1
if(a0)a.push(b)}if(c.length===0&&a.length===0)continue
a2=4096/d.gcg()
a3=c5/a2
a4=c6/a2
a5=c7/a2
if(!(c4>=0&&c4<e.length))return A.a(e,c4)
a6=e[c4]
a7=a6 instanceof A.bS?null:a6.cj(d.gaw())
for(a0=d.gbx(),a1=a0.length,a8=a7!=null,a9=0;a9<a0.length;a0.length===a1||(0,A.i)(a0),++a9){b0=a0[a9]
p.b=0
B.a.a8(q)
b0.cp(p)
A:{if(f.b(c9)){b1=c9.a/a2
b2=c9.b/a2
b2=A.wD(b0.gK(),p,a3-b1,a4-b2,a3+b1,a4+b2)
b1=b2
break A}if(c9==null){b1=A.vX(b0.gK(),p,a3,a4,a5)
break A}b1=null}if(!b1)continue
b3=b0.bs(d)
if(a8&&b3.h(0,a7)!=null)b3.m(0,"$id",b3.h(0,a7))
c1.saf(b3)
b4=b0.gK()
B:{if(1===b4){b1="Point"
break B}if(2===b4){b1="LineString"
break B}b1="Polygon"
break B}c1.c=b1
b5=A.b([],g)
for(b1=new A.bd(a,m),b1=new A.X(b1,b1.gl(0),l),b6=-1;b1.n();){b2=b1.d
if(b2==null)b2=i.a(b2)
if(b2>>>0!==b2||b2>=h.length)return A.a(h,b2)
if(!h[b2].hv(c1))continue
if(b2>>>0!==b2||b2>=h.length)return A.a(h,b2)
B.a.k(b5,h[b2].a)
if(b6<0)b6=k.length+b2}for(b1=new A.bd(c,m),b1=new A.X(b1,b1.gl(0),l);b1.n();){b2=b1.d
b7=b2==null?i.a(b2):b2
if(b7>>>0!==b7||b7>=k.length)return A.a(k,b7)
b8=k[b7]
b2=b8.b
if(!(b2>=0&&b2<j.length))return A.a(j,b2)
b9=j[b2]
c0=b9.f
C:{if(B.u===c0||B.H===c0){b2=b0.gK()===3
break C}if(B.q===c0){b2=b0.gK()===1
break C}if(B.v===c0){b2=b0.gK()!==1
break C}b2=null}if(!b2||!b9.e.$1(c1))continue
b2=b8.a
if(!B.a.u(b5,b2))B.a.k(b5,b2)
if(b6<0)b6=b7}if(b5.length===0)continue
B.a.k(o,new A.hx(b6,d.gaw(),c1.c,b5,c1.b))}}return o},
vX(a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=a3.a
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
b=B.c.D(c===0?0:((a4-g)*o+(a5-f)*m)/c,0,1)
a=g+o*b-a4
a0=f+m*b-a5
if(a*a+a0*a0<=r)return!0}}}return k},
wD(a,b,c,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=b.a,d=new A.ns(c,a1,a0,a2)
if(a===1){for(s=e.length,r=0;r<b.b;r+=2){if(!(r<s))return A.a(e,r)
q=e[r]
p=r+1
if(!(p<s))return A.a(e,p)
if(d.$2(q,e[p]))return!0}return!1}o=new A.nq()
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
nY:function nY(a){this.a=a},
ns:function ns(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
nq:function nq(){},
nr:function nr(){},
ti(a){var s,r,q,p,o=a.h(0,"encoding")
A:{if("terrarium"===o){s=B.aw
break A}if("custom"===o){s=A.D(a.h(0,"redFactor"))
if(s==null)s=1
r=A.D(a.h(0,"greenFactor"))
if(r==null)r=1
q=A.D(a.h(0,"blueFactor"))
if(q==null)q=1
p=A.D(a.h(0,"baseShift"))
s=new A.e_(s,r,q,p==null?0:p)
break A}s=B.av
break A}return s},
bc:function bc(){},
fQ:function fQ(){},
hA:function hA(){},
h9:function h9(){},
fP:function fP(){},
e_:function e_(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fv:function fv(){},
hu:function hu(){},
xa(a,b,c,d){var s
if(a===c)s=a<0||a>4096
else s=!1
if(!s)if(b===d)s=b<0||b>4096
else s=!1
else s=!0
return s},
xv(a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a0.length,a=b/2|0
if(a1<=0||a<3)return a0
s=t.n
r=A.b([],s)
q=new A.nZ(a0,r,a1)
p=(a-1)*2
if(!(p>=0&&p<b))return A.a(a0,p)
o=a0[p];++p
if(!(p<b))return A.a(a0,p)
p=a0[p]
n=a0[0]
if(1>=b)return A.a(a0,1)
m=A.xa(o,p,n,a0[1])
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
B.a.k(r,a0[p])}else q.$3(B.b.X(l-1+a,a),l,j)}f=A.b([],s)
for(l=0;l<r.length;l+=2){e=B.c.a0(r[l]*2)/2
b=l+1
if(!(b<r.length))return A.a(r,b)
d=B.c.a0(r[b]*2)/2
c=f.length
if(c>0){b=c-2
if(!(b>=0))return A.a(f,b)
b=f[b]===e&&f[c-1]===d}else b=!1
if(b)continue
B.a.k(f,e)
B.a.k(f,d)}for(;;){b=f.length
if(!(b>2&&f[0]===f[b-2]&&f[1]===f[b-1]))break
B.a.sl(f,b-2)}if(b<6)return a0
return new Float64Array(A.a1(f))},
xz(a){var s,r,q,p=a.length/2|0,o=new Float64Array(p*4),n=new A.o1(a,o)
for(s=0;s<p;s=q){r=s*4
n.$3(s,B.b.X(s-1+p,p),r)
q=s+1
n.$3(s,q%p,r+2)}return o},
nZ:function nZ(a,b,c){this.a=a
this.b=b
this.c=c},
o1:function o1(a,b){this.a=a
this.b=b},
kP:function kP(a,b,c){this.a=a
this.b=b
this.c=c},
vb(a){var s,r,q,p,o,n,m,l=a.h(0,"id")
l=A.t(l==null?"":l)
s=a.h(0,"type")
r=t.eO
q=r.a(a.h(0,"paint"))
if(q==null)q=B.B
r=r.a(a.h(0,"layout"))
if(r==null)r=B.B
p=A.D(a.h(0,"minzoom"))
A:{if(typeof p=="number"){o=p>0
n=p}else{n=null
o=!1}if(o){o=n
break A}o=-24
break A}m=A.D(a.h(0,"maxzoom"))
return new A.ls(l,s,a,q,r,o,m==null?30:m)},
hp(a,b){var s,r,q=A.aZ(t.N)
for(s=b.length,r=0;r<b.length;b.length===s||(0,A.i)(b),++r)A.c2(a.h(0,b[r]),q)
return q},
c2(a,b){var s,r,q
if(t.j.b(a)){s=J.q(a)
if(s.gl(a)===2)r=(J.l(s.h(a,0),"get")||J.l(s.h(a,0),"has"))&&typeof s.h(a,1)=="string"
else r=!1
if(r)b.k(0,A.Y(s.h(a,1)))
if(s.gI(a))r=J.l(s.h(a,0),"feature-state")||J.l(s.h(a,0),"id")
else r=!1
if(r)b.k(0,"$id")
if(s.gI(a))r=J.l(s.h(a,0),"within")||J.l(s.h(a,0),"distance")
else r=!1
if(r)b.k(0,"$geometry:"+B.e.a9(a,null))
for(s=s.gt(a);s.n();)A.c2(s.gp(),b)}else if(t.f.b(a)){q=a.h(0,"property")
if(typeof q=="string")b.k(0,q)}},
uM(a){var s,r,q,p,o,n,m,l,k=null,j=t.j
if(!j.b(a)||J.Z(a)!==4)return k
s=new Float64Array(8)
for(r=J.q(a),q=0;q<4;++q){p=r.h(a,q)
if(!j.b(p)||J.Z(p)<2)return k
o=J.q(p)
n=o.h(p,0)
if(!(typeof n=="number"))if(typeof n=="string"){m=A.P(n)
n=m}else{if(A.M(n))m=n?1:0
else m=k
n=m}l=o.h(p,1)
if(!(typeof l=="number"))if(typeof l=="string"){o=A.P(l)
l=o}else{if(A.M(l))o=l?1:0
else o=k
l=o}if(n==null||l==null)return k
o=q*2
if(!(o<8))return A.a(s,o)
s[o]=(n+180)/360;++o
m=A.p9(l)
if(!(o<8))return A.a(s,o)
s[o]=m}return s},
uS(a){var s,r,q,p,o,n,m=null,l=t.j
if(l.b(a)){s=J.q(a)
s=s.gl(a)===2&&J.l(s.h(a,0),"literal")}else s=!1
r=s?J.aL(a,1):a
if(l.b(r)){l=J.q(r)
l=l.gA(r)||l.gl(r)>4}else l=!0
if(l)return m
l=A.b([],t.nn)
for(s=J.G(r);s.n();){q=s.gp()
if(typeof q=="number")p=q
else if(typeof q=="string")p=A.P(q)
else if(A.M(q))p=q?1:0
else p=m
l.push(p==null?m:p)}if(B.a.u(l,m))return m
s=l.length
p=s>=1
o=p?l[0]:m
if(!p)throw A.e(A.cC("Pattern matching error"))
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
J(a,b){var s=A.v(b)
if(a==null)return s
return new A.kp(A.v(a),s)},
uP(a){var s,r,q="viewport-y",p=new A.kj(a),o=a.h(0,"symbol-z-order")
if(o==null)o="auto"
s=J.aj(o)
r=!s.B(o,q)&&a.h(0,"symbol-sort-key")!=null
if(!s.B(o,q))s=s.B(o,"auto")&&!r
else s=!0
if(s)p=p.$2("text-overlap","text-allow-overlap")||p.$2("icon-overlap","icon-allow-overlap")||J.l(a.h(0,"text-ignore-placement"),!0)||J.l(a.h(0,"icon-ignore-placement"),!0)
else p=!1
return p},
kl(a,b){var s,r=a.h(0,b+"-overlap")
A:{if(typeof r=="string"){s=r
break A}s=J.l(a.h(0,b+"-allow-overlap"),!0)?"always":"never"
break A}return s},
uL(a,b){var s,r,q,p,o,n,m=t.j,l=null,k=!1,j=!1
if(m.b(a)){s=J.q(a)
if(s.gl(a)===2){k="literal"===s.h(a,0)
if(k){l=s.h(a,1)
j=m.b(l)}}}if(j){j=k?l:J.aL(a,1)
t.W.a(j)
r=j}else r=a
if(m.b(r)&&J.Z(r)>=2){q=A.b([],t.s)
p=A.b([],t.I)
for(j=J.q(r),o=0;s=o+1,s<j.gl(r);o+=2){n=j.h(r,o)
if(typeof n=="string"){B.a.k(q,n)
B.a.k(p,A.oy(j.h(r,s)))}}if(q.length!==0)return new A.z(q,p)}if(m.b(b)){m=J.pq(b,t.N)
m=A.a3(m,m.$ti.i("f.E"))}else m=B.a9
return new A.z(m,null)},
qh(a){var s
if(a!=null)if(t.j.b(a)){s=J.q(a)
s=s.gl(a)===2&&s.aj(a,new A.kk())}else s=!1
else s=!0
return s},
oy(a){var s,r,q=t.j
if(q.b(a)){s=J.q(a)
s=s.gl(a)===2&&J.l(s.h(a,0),"literal")}else s=!1
r=s?J.aL(a,1):a
if(!q.b(r)||J.Z(r)!==2)return B.d2
q=J.q(r)
s=A.D(q.h(r,0))
if(s==null)s=0
q=A.D(q.h(r,1))
return new A.z(s,q==null?0:q)},
qg(a,b){var s,r
if(t.j.b(a)){s=J.q(a)
s=s.gI(a)&&s.aj(a,new A.kf())}else s=!1
if(s){s=A.b([],t.V)
for(r=J.G(a);r.n();)s.push(A.v(r.gp()))
return s}return A.b([A.v(a==null?b:a)],t.V)},
qi(a,b){var s,r,q,p,o=t.j.b(a)?a:[a],n=t.n,m=A.b([],n)
for(s=J.G(o);s.n();){r=s.gp()
if(typeof r=="number")q=r
else if(typeof r=="string"){p=A.P(r)
q=p}else{if(A.M(r))p=r?1:0
else p=null
q=p}if(q!=null)m.push(q)}return m.length===0?A.b([b],n):m},
uO(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=A.b([],t.lN),e=null,d=!1
if(t.f.b(a)){s=a.h(0,"stops")
if(s==null)r=a.J("stops")
else r=!0
if(r)if(t.j.b(s)){d=a.h(0,"property")==null
e=s}}if(d)for(d=J.G(e),r=t.j;d.n();){q=d.gp()
if(r.b(q)&&J.Z(q)===2){p=J.q(q)
B.a.k(f,new A.z(p.h(q,0),p.h(q,1)))}}else{d=t.j
r=!1
if(d.b(a)){p=J.q(a)
if(p.gl(a)>=3)if("step"===p.h(a,0)){o=p.h(a,1)
if(d.b(o)){t.W.a(o)
d=J.q(o)
if(d.gl(o)===1)d="zoom"===d.h(o,0)
else d=r}else d=r}else d=r
else d=r}else d=r
if(d){d=J.q(a)
n=d.h(a,2)
m=d.a1(a,3)
B.a.k(f,new A.z(-1/0,n))
for(l=0;d=l+1,r=m.length,d<r;l+=2){if(!(l<r))return A.a(m,l)
B.a.k(f,new A.z(m[l],m[d]))}}else return B.z}k=A.b([],t.bU)
for(d=f.length,j=0;j<f.length;f.length===d||(0,A.i)(f),++j){r=f[j]
i=r.a
if(typeof i=="number")p=i==1/0||i==-1/0
else p=!1
if(p)h=i
else{if(typeof i=="number")p=i
else if(typeof i=="string")p=A.P(i)
else if(A.M(i))p=i?1:0
else p=null
h=p==null?null:p}g=A.kg(r.b)
if(h==null||g==null)return B.z
B.a.k(k,new A.z(h,g))}return k},
uN(a){var s=A.b([],t.w)
new A.kh(s).$1(a)
return s},
uR(a,b){var s,r,q=a.length,p=b.length
if(q!==p)return!1
for(s=0;s<q;++s){r=a[s]
if(!(s<p))return A.a(b,s)
if(r!==b[s])return!1}return!0},
kg(a){var s,r,q,p,o,n,m,l=null,k=t.j
if(k.b(a)){s=J.q(a)
s=s.gl(a)===2&&J.l(s.h(a,0),"literal")}else s=!1
r=s?J.aL(a,1):a
if(!k.b(r)||J.Z(r)<2)return l
k=J.q(r)
s=k.gl(r)
q=new Float64Array(s)
for(p=0,o=0;o<s;++o){n=k.h(r,o)
if(!(typeof n=="number"))if(typeof n=="string"){m=A.P(n)
n=m}else{if(A.M(n))m=n?1:0
else m=l
n=m}if(n==null||n<0)return l
if(!(o<s))return A.a(q,o)
q[o]=n
if((o&1)===1)p+=n}return p<=0?l:q},
uQ(a){var s,r,q,p,o,n,m
A:{s=t.j
r=s.b(a)
q=null
p=!1
o=!1
if(r){n=J.q(a)
if(n.gl(a)===2){p="literal"===n.h(a,0)
if(p){q=n.h(a,1)
s=s.b(q)}else s=o}else s=o}else s=o
if(s){s=p?q:J.aL(a,1)
t.W.a(s)
break A}if(r){s=a
break A}s=B.a8
break A}r=A.b([],t.s)
for(s=J.G(s);s.n();){m=s.gp()
if(typeof m=="string")r.push(m)}return r},
uT(a){if(B.d.u(a,"black")||B.d.u(a,"heavy"))return 900
if(B.d.u(a,"extrabold")||B.d.u(a,"extra bold"))return 800
if(B.d.u(a,"semibold")||B.d.u(a,"semi bold")||B.d.u(a,"demi"))return 600
if(B.d.u(a,"bold"))return 700
if(B.d.u(a,"medium"))return 500
if(B.d.u(a,"light"))return 300
if(B.d.u(a,"thin"))return 100
return 400},
ls:function ls(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
f8:function f8(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ho:function ho(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){var _=this
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
ko:function ko(a,b){this.a=a
this.b=b},
kd:function kd(a){this.a=a},
kc:function kc(a,b){this.a=a
this.b=b},
ka:function ka(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
kb:function kb(){},
ke:function ke(a,b,c,d,e,f,g,h,i,j,k,l){var _=this
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
_.Q=l},
kn:function kn(a,b){this.a=a
this.b=b},
km:function km(a,b,c){this.a=a
this.b=b
this.c=c},
kp:function kp(a,b){this.a=a
this.b=b},
kj:function kj(a){this.a=a},
kk:function kk(){},
kf:function kf(){},
kh:function kh(a){this.a=a},
ki:function ki(a){this.a=a},
ty(a){var s,r,q,p,o=t.f.b(a)?a:B.ab,n=new A.A(B.i),m=o.h(0,"position"),l=A.v(m==null?A.b([1.15,210,30],t.g2):m).$1(n)
m=o.h(0,"intensity")
m=A.D(A.v(m==null?0.5:m).$1(n))
if(m==null)m=0.5
s=o.h(0,"color")
A.bw(A.v(s==null?"#ffffff":s).$1(n))
if(t.j.b(l)&&J.Z(l)===3){s=A.b([],t.n)
for(r=J.G(l);r.n();){q=r.gp()
if(typeof q=="number")p=q
else if(typeof q=="string")p=A.P(q)
else if(A.M(q))p=q?1:0
else p=null
s.push(p==null?0:p)}}J.l(o.h(0,"anchor"),"map")
return new A.iV(m)},
pV(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1){return new A.dh(q,d,f,j,k,b,m,l)},
tT(a,b,c){var s,r,q,p,o=a==null?B.cM:a,n=t.n,m=A.b([],n)
if(t.j.b(o)){s=J.q(o)
s=s.gl(o)>4&&J.l(s.h(o,0),"interpolate")&&B.e.a9(s.h(o,1),null)==='["linear"]'&&B.e.a9(s.h(o,2),null)==='["heatmap-density"]'}else s=!1
if(s)for(s=J.q(o),r=3;r+1<s.gl(o);r+=2){q=s.h(o,r)
if(!(typeof q=="number"))if(typeof q=="string"){p=A.P(q)
q=p}else{if(A.M(q))p=q?1:0
else p=null
q=p}if(q!=null)B.a.k(m,B.c.D(q,0,1))}if(m.length<2){B.a.a8(m)
n=A.b([],n)
for(r=0;r<=8;++r)n.push(r/8)
B.a.F(m,n)}A.v(o)
return new A.jh()},
uV(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=B.e.a9(a,null),b=a.h(0,"source")
b.toString
A.E(b)
s=a.h(0,"sourceLayer")
s.toString
A.Y(s)
r=A.oY(a.h(0,"filter"))
q=a.h(0,"text")
A:{if(q==null){p=new A.kv()
break A}p=A.ff(q)
break A}o=a.h(0,"icon")
B:{if(o==null){n=null
break B}n=A.ff(o)
break B}m=A.v(a.h(0,"placement"))
l=a.h(0,"spacing")
l.toString
A.ae(l)
k=J.l(a.h(0,"textUpright"),!0)
j=J.l(a.h(0,"iconUpright"),!0)
i=a.h(0,"minZoom")
i.toString
A.ae(i)
h=a.h(0,"maxZoom")
h.toString
A.ae(h)
g=a.h(0,"sortKey")
C:{if(g==null){f=null
break C}f=A.v(g)
break C}e=a.h(0,"iconRotate")
e=A.v(e==null?0:e)
d=a.h(0,"paintKeys")
d.toString
return new A.ku(c,b,s,r,p,n,m,l,k,j,i,h,f,e,J.fi(t.j.a(d),t.N))},
eG(a){var s,r,q=a.h(0,"bounds"),p=A.D(a.h(0,"minzoom"))
p=p==null?null:B.c.N(p)
if(p==null)p=0
if(t.j.b(q)){s=J.q(q)
s=s.gl(q)===4&&s.aj(q,new A.kM())}else s=!1
if(s){s=A.b([],t.n)
for(r=J.G(q);r.n();)s.push(A.ae(r.gp()))}else s=null
return new A.kL(p,s,J.l(a.h(0,"scheme"),"tms"))},
qj(a){var s=A.uU(t.f.b(a)?a.h(0,"type"):null)
return s==null||s.length===0||B.a.aj(s,new A.kr())?B.df:new A.hq(s)},
kq(a){var s
A:{if("mercator"===a){s=0
break A}if("vertical-perspective"===a){s=1
break A}s=null
break A}return s},
uU(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=null,d=J.aj(a)
if(d.B(a,"globe"))return B.cE
s=A.kq(a)
if(s!=null)return A.b([new A.z(0,s)],t.I)
r=t.j
q=r.b(a)
p=!1
if(q)if(d.gl(a)>=3)if("interpolate"===d.h(a,0)){o=d.h(a,2)
if(r.b(o)){t.W.a(o)
n=J.q(o)
if(n.gl(o)===1)p="zoom"===n.h(o,0)}}if(p){m=d.a1(a,3)
l=A.b([],t.I)
for(k=0;d=k+1,r=m.length,d<r;k+=2){if(!(k<r))return A.a(m,k)
j=m[k]
i=A.kq(m[d])
if(typeof j!="number"||i==null)return e
B.a.k(l,new A.z(j,i))}return l}p=!1
if(q)if(d.gl(a)>=3)if("step"===d.h(a,0)){h=d.h(a,1)
if(r.b(h)){t.W.a(h)
r=J.q(h)
if(r.gl(h)===1)r="zoom"===r.h(h,0)
else r=p}else r=p}else r=p
else r=p
else r=p
if(r){g=d.h(a,2)
m=d.a1(a,3)
f=A.kq(g)
if(f==null)return e
l=A.b([new A.z(-1/0,f)],t.I)
for(k=0;d=k+1,r=m.length,d<r;k+=2){if(!(k<r))return A.a(m,k)
j=m[k]
i=A.kq(m[d])
if(typeof j!="number"||i==null)return e
B.a.k(l,new A.z(j-1e-9,B.a.gS(l).b))
B.a.k(l,new A.z(j,i))}return l}return e},
cd:function cd(a,b){this.a=a
this.b=b},
iS:function iS(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
iV:function iV(a){this.a=a},
e4:function e4(a,b){this.b=a
this.d=b},
cc:function cc(a,b,c,d,e,f,g,h,i,j,k,l,m,n){var _=this
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
_.ax=30
_.ay=0},
d7:function d7(a,b){this.a=a
this.b=b},
bb:function bb(){},
h3:function h3(){},
ba:function ba(a,b,c,d,e,f,g){var _=this
_.cx=a
_.db=b
_.dx=c
_.a=d
_.b=e
_.c=f
_.d=g},
dh:function dh(a,b,c,d,e,f,g,h){var _=this
_.cy=a
_.dy=b
_.fx=c
_.id=d
_.a=e
_.b=f
_.c=g
_.d=h},
d0:function d0(a,b,c,d,e,f,g){var _=this
_.db=a
_.dx=b
_.dy=c
_.a=d
_.b=e
_.c=f
_.d=g},
co:function co(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
jh:function jh(){},
ku:function ku(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
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
kv:function kv(){},
hr:function hr(a,b,c,d,e,f,g,h,i,j,k,l){var _=this
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
_.dP=l},
kL:function kL(a,b,c){this.a=a
this.b=b
this.c=c},
kM:function kM(){},
kN:function kN(a){this.a=a},
kO:function kO(a){this.a=a},
dt:function dt(){},
bS:function bS(a,b,c,d){var _=this
_.e=a
_.f=b
_.r=c
_.c=d},
eH:function eH(a,b){this.r=a
this.c=b},
fn:function fn(){},
c3:function c3(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ox:function ox(){},
hq:function hq(a){this.a=a},
kr:function kr(){},
ks:function ks(a,b,c,d,e,f,g,h,i){var _=this
_.d=a
_.f=b
_.as=c
_.at=d
_.ax=e
_.ay=f
_.CW=g
_.db=h
_.dx=i},
kt:function kt(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
qq(a,b,c){var s=new Float32Array(0),r=new Float32Array(0),q=new Float32Array(2048),p=new Float32Array(0),o=new Uint8Array(0),n=new Uint16Array(4096)
return new A.l5(a,b,c,s,r,q,p,o,n,new Uint16Array(0),A.b([],t.bw))},
pW(a,b,c,d){var s=c-a,r=d-b,q=Math.sqrt(s*s+r*r)
return new A.z(-r/q,s/q)},
cr:function cr(a,b){this.a=a
this.b=b},
dg:function dg(a,b){this.a=a
this.b=b},
aO:function aO(a,b){this.a=a
this.b=b},
ek:function ek(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
l5:function l5(a,b,c,d,e,f,g,h,i,j,k){var _=this
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
iX:function iX(a,b){this.a=a
this.b=b},
ju:function ju(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.f=_.e=_.d=0
_.r=null
_.w=0
_.Q=d
_.at=_.as=-1},
uX(a,b){var s,r=a.b.as
if(r==null)return 50
s=r.$1(b)
return typeof s=="number"?B.b.D(B.c.a3(s),0,4095):50},
xs(a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=A.b([],t.k9),c=t.N,b=t.S,a=A.C(c,b),a0=A.C(c,b),a1=new A.nT()
for(c=J.G(a2),b=t.E;c.n();){s=c.gp()
r=A.b([B.a.gv(s.w)],b)
q=s.b
p=a1.$3$end(q,B.a.gv(r),!1)
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
B.a.F(l,r)
B.a.F(l,s.b)
B.a.m(d,m,null)
a0.ap(0,p)
a.ap(0,o)
a0.m(0,a1.$3$end(q,B.a.gS(l),!0),n)}else if(l){if(n>>>0!==n||n>=d.length)return A.a(d,n)
B.a.F(d[n].b,r)
a0.ap(0,p)
a0.m(0,o,n)}else if(m!=null){if(m>>>0!==m||m>=d.length)return A.a(d,m)
B.a.ck(d[m].b,0,r)
a.ap(0,o)
a.m(0,p,m)}else{B.a.k(d,new A.z(s,r))
a.m(0,p,d.length-1)
a0.m(0,o,d.length-1)}}c=A.b([],t.gw)
for(s=d.length,q=t.x,l=t.iu,k=0;k<d.length;d.length===s||(0,A.i)(d),++k){j=d[k]
if(q.b(j)){i=j.a
h=A.b([A.wf(l.a(j.b))],b)
g=i.w
f=A.L(g)
e=new A.bz(g,1,null,f.i("bz<1>"))
e.cI(g,1,null,f.c)
B.a.F(h,e)
i.si3(h)
c.push(i)}}return c},
wf(a){var s,r,q,p,o,n=J.q(a)
if(n.gl(a)===1)return n.gv(a)
s=A.a3(n.gv(a),t.i)
for(n=n.T(a,1),r=n.$ti,n=new A.X(n,n.gl(0),r.i("X<a0.E>")),r=r.i("a0.E");n.n();){q=n.d
if(q==null)q=r.a(q)
p=A.aa(q)
o=new A.bz(q,2,null,p.i("bz<y.E>"))
o.cI(q,2,null,p.i("y.E"))
B.a.F(s,o)}return new Float32Array(A.a1(s))},
r5(a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1={},a2=A.b([],t.E),a3=t.n
a1.a=A.b([],a3)
s=new A.nx(a1,a2)
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
B.a.F(a1.a,A.b([b,a],a3))}B.a.F(a1.a,A.b([p+l*i,o+k*i],a3))
if(i<1)s.$0()}s.$0()
return a2},
oO(a){var s,r,q,p,o,n
for(s=a.length,r=0,q=2;q<s;q+=2){p=a[q]-a[q-2]
o=q+1
if(!(o<s))return A.a(a,o)
n=a[o]-a[q-1]
r+=Math.sqrt(p*p+n*n)}return r},
rc(a,b,c,d,e,f){var s,r,q,p=a.length
if(0>=p)return A.a(a,0)
s=a[0]
r=!0
if(s!==0)if(s!==4096){if(1>=p)return A.a(a,1)
p=a[1]
p=p===0||p===4096
r=p}p=b/4
if(b-c<p)b=c+p
q=A.oQ(a,r?B.c.X(b/2,b):B.c.X(c/2+d,b),b,c,e,f)
if(q.length===0&&!r)return A.oQ(a,A.oO(a)/2,b,c,e,f)
return q},
r4(a,b,c,d){var s=A.oO(a)/2,r=A.oQ(a,s,1/0,0,c,d),q=A.L(r),p=q.i("cG<1>")
r=A.a3(new A.cG(r,q.i("B(1)").a(new A.nw(b,s)),p),p.i("f.E"))
return r},
oQ(a4,a5,a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=a7/2,a=A.oO(a4),a0=A.b([],t.eL),a1=isFinite(a6),a2=a1?a5-a6:a5,a3=a1?a6:0
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
e=B.c.a0(m+j*f)
d=B.c.a0(l+n*f)
c=!1
if(e>=0)if(e<4096)if(d>=0)if(d<4096)if(g-b>=0)if(g+b<=a)c=!s||A.vH(a4,B.b.O(o,2)-1,e,d,a7,a8,a9)
if(c)B.a.k(a0,new A.b3(e,d,Math.atan2(n,j)))
if(a1){a2=g
p=!0
break}}o+=2
q=h}return a0},
vH(a,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
if(a3===0)return!0
s=new A.lL(a)
r=new A.lM(a)
q=new A.lK()
p=a0+1
for(o=-a3/2,n=a2,m=a1,l=0;l>o;){--p
if(p<0)return!1
k=q.$4(s.$1(p),r.$1(p),m,n)
if(typeof k!=="number")return A.ag(k)
l-=k
m=s.$1(p)
n=r.$1(p)}j=p+1
o=q.$4(s.$1(p),r.$1(p),s.$1(j),r.$1(j))
if(typeof o!=="number")return A.ag(o)
l+=o
i=A.b([],t.I)
h=a.length/2|0
for(o=a3/2,p=j,g=0;l<o;p=j){j=p+1
if(j>=h)return!1
k=r.$1(p)
f=p-1
e=r.$1(f)
if(typeof k!=="number")return k.aS()
if(typeof e!=="number")return A.ag(e)
d=s.$1(p)
f=s.$1(f)
if(typeof d!=="number")return d.aS()
if(typeof f!=="number")return A.ag(f)
c=Math.atan2(k-e,d-f)
f=r.$1(j)
d=r.$1(p)
if(typeof f!=="number")return f.aS()
if(typeof d!=="number")return A.ag(d)
e=s.$1(j)
k=s.$1(p)
if(typeof e!=="number")return e.aS()
if(typeof k!=="number")return A.ag(k)
b=Math.abs(B.c.X(c-Math.atan2(f-d,e-k)+9.42477796076938,6.283185307179586)-3.141592653589793)
B.a.k(i,new A.z(l,b))
g+=b
while(l-B.a.gv(i).a>a4)g-=B.a.aD(i,0).b
if(g>a5)return!1
k=q.$4(s.$1(p),r.$1(p),s.$1(j),r.$1(j))
if(typeof k!=="number")return A.ag(k)
l+=k}return!0},
cY:function cY(a,b,c){this.a=a
this.b=b
this.c=c},
bm:function bm(a,b,c,d,e,f,g,h,i,j){var _=this
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
cZ:function cZ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
aI:function aI(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
kx:function kx(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){var _=this
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
_.ch=p},
kH:function kH(a,b){this.a=a
this.b=b},
kJ:function kJ(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
kI:function kI(a,b,c){this.a=a
this.b=b
this.c=c},
kK:function kK(a,b,c){this.a=a
this.b=b
this.c=c},
kE:function kE(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
kD:function kD(a,b){this.a=a
this.b=b},
kF:function kF(a,b,c,d,e,f,g,h,i,j){var _=this
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
kG:function kG(){},
kz:function kz(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
kA:function kA(a){this.a=a},
kB:function kB(a,b,c){this.a=a
this.b=b
this.c=c},
ky:function ky(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
kC:function kC(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
dk:function dk(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
nT:function nT(){},
nx:function nx(a,b){this.a=a
this.b=b},
nw:function nw(a,b){this.a=a
this.b=b},
lL:function lL(a){this.a=a},
lM:function lM(a){this.a=a},
lK:function lK(){},
bf:function bf(a,b,c){this.a=a
this.b=b
this.c=c},
kQ:function kQ(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
kR:function kR(){},
kS:function kS(){},
b8:function b8(a){this.a=a
this.b=0},
jk:function jk(a){this.a=a
this.b=0},
ii(a,b,c){return A.xJ(a,b,c)},
xJ(c4,c5,c6){var s=0,r=A.av(t.o),q,p=2,o=[],n=[],m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3
var $async$ii=A.aw(function(c7,c8){if(c7===1){o.push(c8)
s=p}for(;;)switch(s){case 0:c2={}
c3=c4.length
if(0>=c3){q=A.a(c4,0)
s=1
break}j=c4[0]
j.toString
A.Y(j)
if(1>=c3){q=A.a(c4,1)
s=1
break}i=A.bh(c4[1])
if(2>=c3){q=A.a(c4,2)
s=1
break}h=c4[2]
h.toString
A.Y(h)
if(3>=c3){q=A.a(c4,3)
s=1
break}c3=c4[3]
c3.toString
g=t.f
f=t.N
c3=g.a(c3).bv(0,f,f)
if(4>=c4.length){q=A.a(c4,4)
s=1
break}e=c4[4]
e.toString
d=t.O
e=g.a(e).bv(0,f,d)
if(5>=c4.length){q=A.a(c4,5)
s=1
break}g=t.g
c=g.a(c4[5])
c=c==null?null:J.fi(c,f)
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
b=b==null?null:J.fi(b,t.p)}else b=null
if(c4.length>9){g=g.a(c4[9])
g=g==null?null:J.fi(g,f)}else g=null
a1=c4.length>10&&J.l(c4[10],!0)
a2=new A.er()
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
if(b4==null)b4=B.B
b5=A.t(a)
b2=A.qj(b3.a(b2.h(0,"projection"))).a.length!==0?b5+" globe":b5
b6=new A.ho(e,c,a,b4,a3,A.C(d,t.aV),a4,A.C(f,a5),a6,a7,a8,a9,b0,b1,new A.be(b2),A.C(a5,t.u)).hi()
b2=b6.ay
if(!(a0>=0&&a0<b2.length)){q=A.a(b2,a0)
s=1
break}b7=b2[a0]
b8=b6.dx
d=b==null
b9=d&&b8!=null?new A.jb(b8,h,c3,new A.o5(),A.b([],t.s),A.C(f,a5),A.b([],t.iE),A.aZ(a5),A.aZ(a5)):null
d=d?null:A.tG(b,g)
a3=t.L
a4=new Float64Array(4096)
a6=t.t
a7=A.b([],a6)
a8=A.b([],a6)
a9=A.b([],a6)
c0=new A.kx(A.aZ(a5),B.cT,b6,a0,d,b9,a1,A.C(f,a3),A.C(f,a3),new A.A(B.i),new A.fM(a4,a7),a8,a9,new Float64Array(4096),A.b([],a6),A.C(f,t.i))
c0.ei(b6,d,a1,b9,a0)
m=new A.o4(c5)
f=b6.db
c1=f.length===0?null:A.o2(f,a2,c3).e7(new A.o6(c0),t.a)
f=c2.a=c2.b=null
if(b7 instanceof A.bS)c2.b=new A.o7(b7.e,new A.oc(b7),a2,new A.l0(a1,g,b,j,new A.kP(i,h,c3),e,c,a,a0)).$0()
else if(b7 instanceof A.eH){h=A.wN(j)
g=new A.er()
e=B.d.ar(j,"pmtiles://")
if(e)f=new A.jI(B.d.aG(j,10),c3,g,A.C(a5,t.je))
c2.a=new A.kQ(j,b7.r,"tiles-"+h,g,".pbf",c3,f,i)}l=new A.oa(c2,new A.o9(c2,new A.o8(c2,A.C(a5,t.p))),c0,c1,b9,b6,a0)
c3=new A.cR(A.fe(c6,"stream",t.K),t.b6)
p=3
j=t.W,i=t.o
case 6:s=8
return A.W(c3.n(),$async$ii)
case 8:if(!c8){s=7
break}k=c3.gp()
h=k
h.toString
l.$1(A.uZ(j.a(h))).e7(m,i)
s=6
break
case 7:n.push(5)
s=4
break
case 3:n=[2]
case 4:p=2
s=9
return A.W(c3.b2(),$async$ii)
case 9:s=n.pop()
break
case 5:case 1:return A.at(q,r)
case 2:return A.as(o.at(-1),r)}})
return A.au($async$ii,r)},
qW(a){var s,r=A.b([],t.i9),q=a==null?B.A:a,p=q.length,o=0
for(;o<q.length;q.length===p||(0,A.i)(q),++o){s=q[o]
r.push(new A.fu(s.a,s.b,s.d))}return r},
o5:function o5(){},
o4:function o4(a){this.a=a},
o6:function o6(a){this.a=a},
oc:function oc(a){this.a=a},
o7:function o7(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
o8:function o8(a,b){this.a=a
this.b=b},
o9:function o9(a,b){this.a=a
this.b=b},
oa:function oa(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
ob:function ob(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
xw(){var s,r={},q=v.G
r.a=null
r=new A.o0(r,q)
if(typeof r=="function")A.n(A.aM("Attempting to rewrap a JS function.",null))
s=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.vK,r)
s[$.pb()]=r
q.onmessage=s},
o0:function o0(a,b){this.a=a
this.b=b},
o_:function o_(a){this.a=a},
oi(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.az(b,c,B.b.a7(a.byteLength,s))
return J.pj(B.j.gao(a),a.byteOffset+b*s,(c-b)*s)},
hB(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.az(b,c,B.b.a7(a.byteLength,s))
return J.pl(B.j.gao(a),a.byteOffset+b*s,(c-b)*s)},
qn(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.az(b,c,B.b.a7(a.byteLength,s))-b)*s
if(B.b.X(r,2)!==0)throw A.e(A.aM("The number of bytes to view must be a multiple of 2",null))
return J.rM(B.O.gao(a),a.byteOffset+b*s,B.b.O(r,2))},
iY(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.az(b,c,B.b.a7(a.byteLength,s))-b)*s
if(B.b.X(r,4)!==0)throw A.e(A.aM("The number of bytes to view must be a multiple of 4",null))
return J.pk(B.n.gao(a),a.byteOffset+b*s,B.b.O(r,4))},
cj(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.az(b,c,B.b.a7(a.byteLength,s))-b)*s
if(B.b.X(r,8)!==0)throw A.e(A.aM("The number of bytes to view must be a multiple of 8",null))
return J.rL(B.o.gao(a),a.byteOffset+b*s,B.b.O(r,8))},
rh(a){return v.mangledGlobalNames[a]},
xH(a){throw A.a9(A.u2(a),new Error())},
u(){throw A.a9(A.u4(""),new Error())},
p7(){throw A.a9(A.u3(""),new Error())},
xB(a){return Math.sqrt(A.ae(a))},
xy(a){return Math.sin(A.ae(a))},
r6(a){return Math.cos(A.ae(a))},
xF(a){return Math.tan(a)},
wG(a){return Math.acos(a)},
wH(a){return Math.asin(a)},
wM(a){return Math.atan(A.ae(a))},
xg(a){return Math.log(a)},
ak(a,b){var s,r,q,p,o=a.length,n=(o/3|0)-1
for(s=0;s<=n;){r=B.b.L(s+n,1)
q=r*3
if(!(q<o))return A.a(a,q)
if(b<a[q])n=r-1
else{p=q+1
if(!(p<o))return A.a(a,p)
if(b>a[p])s=r+1
else{p=q+2
if(!(p<o))return A.a(a,p)
return a[p]}}}return 0},
cE(a){return a},
uW(a){var s,r,q,p
for(s=a.length,r=0,q=0;q<4;++q){if(q<s){if(!(q<s))return A.a(a,q)
p=a.charCodeAt(q)}else p=32
r=(r<<8|p)>>>0}return r},
aB(a){return A.k9(A.b([B.b.L(a,24)&255,B.b.L(a,16)&255,B.b.L(a,8)&255,a&255],t.t),0,null)},
p9(a){var s=B.c.D(a,-85.0511,85.0511)*3.141592653589793/180
return(1-Math.log(Math.tan(s)+1/Math.cos(s))/3.141592653589793)/2},
p8(a){var s,r,q,p,o,n,m
if(!t.j.b(a))return null
s=A.b([],t.s)
for(r=J.pq(a,t.N),q=J.G(r.a),r=r.$ti,p=new A.cH(q,r.i("cH<1>")),r=r.c;p.n();){o=r.a(q.gp())
if(B.d.u(o,"{s}"))for(n=0;n<3;++n){m=B.co[n]
s.push(A.o3(o,"{s}",m,0))}else s.push(o)}return s.length===0?null:B.a.ac(s," ")},
xI(a,b,c,d){var s,r,q,p,o,n=a.split(" "),m=n.length,l=B.b.X(c+d,m),k=A.b([],t.s)
for(s=""+d,r=""+c,q=""+b,p=0;p<m;++p){o=n[B.b.X(l+p,m)]
o=A.o3(o,"{z}",q,0)
o=A.o3(o,"{x}",r,0)
k.push(A.o3(o,"{y}",s,0))}return k},
nG(a,b,c,d,e,f){return A.x2(a,b,c,d,e,f)},
x2(a,b,c,d,e,f){var s=0,r=A.av(t.l_),q,p=2,o=[],n,m,l,k,j,i,h,g
var $async$nG=A.aw(function(a0,a1){if(a0===1){o.push(a1)
s=p}for(;;)switch(s){case 0:i=A.xI(b,c,d,e)
h=0
case 3:n=J.l(h,J.Z(i)-1)
p=6
s=9
return A.W(a.ba(J.aL(i,h),f),$async$nG)
case 9:m=a1
l=m.a
if(n||J.l(l,200)||J.l(l,204)||J.l(l,404)){k=new A.z(J.aL(i,h),m)
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
if(typeof k!=="number"){q=k.bF()
s=1
break}h=k+1
s=3
break
case 4:case 1:return A.at(q,r)
case 2:return A.as(o.at(-1),r)}})
return A.au($async$nG,r)},
wN(a){var s,r,q,p
for(s=new A.d2(a),r=t.gS,s=new A.X(s,s.gl(0),r.i("X<y.E>")),r=r.i("y.E"),q=2166136261;s.n();){p=s.d
q=(q^(p==null?r.a(p):p))>>>0
q=q+(q<<1>>>0)+(q<<4>>>0)+(q<<7>>>0)+(q<<8>>>0)+(q<<24>>>0)>>>0}return B.b.b8(q,36)},
o2(a,b,c){return A.xA(a,b,c)},
xA(b5,b6,b7){var s=0,r=A.av(t.a),q,p=2,o=[],n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4
var $async$o2=A.aw(function(b8,b9){if(b8===1){o.push(b9)
s=p}for(;;)A:switch(s){case 0:b3=A.C(t.N,t.aL)
c=b5.length,b=t.f,a=t.L,a0=0
case 3:if(!(a0<b5.length)){s=5
break}a1=b5[a0]
n=null
n=a1.a
a2=a1.b
a3=B.d.aC(a2,"?")
a1=a3<0
m=a1?a2:B.d.a6(a2,0,a3)
l=a1?"":B.d.aG(a2,a3)
a4=0
case 6:if(!(a4<2)){s=8
break}k=B.cg[a4]
p=10
s=13
return A.W(b6.ba(A.t(m)+A.t(k)+".json"+A.t(l),b7),$async$o2)
case 13:j=b9
if(j.a!==200){s=7
break}a1=a.a(j.b)
i=b.a(B.e.dN(new A.id(!1).cT(a1,0,null,!0),null))
for(a1=i.gah(),a1=a1.gt(a1);a1.n();){h=a1.gp()
g=null
f=null
e=h
g=e.a
f=e.b
if(!b.b(f))continue
a5=A.ie(f.h(0,"pixelRatio"))
d=a5==null?1:a5
a6=A.t(n)
a7=A.t(g)
a8=A.ie(f.h(0,"width"))
if(a8==null)a8=0
a9=d
if(typeof a9!=="number"){q=A.ag(a9)
s=1
break A}b0=A.ie(f.h(0,"height"))
if(b0==null)b0=0
b1=d
if(typeof b1!=="number"){q=A.ag(b1)
s=1
break A}J.ph(b3,a6+a7,new A.z(a8/a9,b0/b1))}s=8
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
case 1:return A.at(q,r)
case 2:return A.as(o.at(-1),r)}})
return A.au($async$o2,r)},
xi(){return A.xw()}},B={}
var w=[A,J,B]
var $={}
A.oo.prototype={}
J.fS.prototype={
B(a,b){return a===b},
gR(a){return A.dm(a)},
q(a){return"Instance of '"+A.he(a)+"'"},
gV(a){return A.bj(A.oK(this))}}
J.ea.prototype={
q(a){return String(a)},
cz(a,b){A.oG(b)
return b&&a},
gR(a){return a?519018:218159},
gV(a){return A.bj(t.y)},
$iQ:1,
$iB:1}
J.ec.prototype={
B(a,b){return null==b},
q(a){return"null"},
gR(a){return 0},
$iQ:1,
$iab:1}
J.ee.prototype={$iN:1}
J.bV.prototype={
gR(a){return 0},
gV(a){return B.dr},
q(a){return String(a)}}
J.hb.prototype={}
J.cF.prototype={}
J.bu.prototype={
q(a){var s=a[$.rj()]
if(s==null)s=a[$.pb()]
if(s==null)return this.eg(a)
return"JavaScript function for "+J.b7(s)},
$icl:1}
J.dd.prototype={
gR(a){return 0},
q(a){return String(a)}}
J.de.prototype={
gR(a){return 0},
q(a){return String(a)}}
J.k.prototype={
bu(a,b){return new A.bn(a,A.L(a).i("@<1>").G(b).i("bn<1,2>"))},
k(a,b){A.L(a).c.a(b)
a.$flags&1&&A.w(a,29)
a.push(b)},
aD(a,b){a.$flags&1&&A.w(a,"removeAt",1)
if(b<0||b>=a.length)throw A.e(A.q9(b,null))
return a.splice(b,1)[0]},
ck(a,b,c){var s,r
A.L(a).i("f<1>").a(c)
a.$flags&1&&A.w(a,"insertAll",2)
A.uv(b,0,a.length,"index")
if(!t.U.b(c))c=J.rX(c)
s=J.Z(c)
a.length=a.length+s
r=b+s
this.a5(a,r,a.length,a,b)
this.Z(a,b,r,c)},
F(a,b){var s
A.L(a).i("f<1>").a(b)
a.$flags&1&&A.w(a,"addAll",2)
if(Array.isArray(b)){this.em(a,b)
return}for(s=J.G(b);s.n();)a.push(s.gp())},
em(a,b){var s,r
t.dG.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.e(A.a6(a))
for(r=0;r<s;++r)a.push(b[r])},
a8(a){a.$flags&1&&A.w(a,"clear","clear")
a.length=0},
Y(a,b){var s,r
A.L(a).i("~(1)").a(b)
s=a.length
for(r=0;r<s;++r){b.$1(a[r])
if(a.length!==s)throw A.e(A.a6(a))}},
aL(a,b,c){var s=A.L(a)
return new A.an(a,s.G(c).i("1(2)").a(b),s.i("@<1>").G(c).i("an<1,2>"))},
ac(a,b){var s,r=A.T(a.length,"",!1,t.N)
for(s=0;s<a.length;++s)this.m(r,s,A.t(a[s]))
return r.join(b)},
bB(a){return this.ac(a,"")},
e6(a,b){return A.cD(a,0,A.fe(b,"count",t.S),A.L(a).c)},
T(a,b){return A.cD(a,b,null,A.L(a).c)},
dQ(a,b,c,d){var s,r,q
d.a(b)
A.L(a).G(d).i("1(1,2)").a(c)
s=a.length
for(r=b,q=0;q<s;++q){r=c.$2(r,a[q])
if(a.length!==s)throw A.e(A.a6(a))}return r},
M(a,b){if(!(b>=0&&b<a.length))return A.a(a,b)
return a[b]},
H(a,b,c){if(b<0||b>a.length)throw A.e(A.a4(b,0,a.length,"start",null))
if(c==null)c=a.length
else if(c<b||c>a.length)throw A.e(A.a4(c,b,a.length,"end",null))
if(b===c)return A.b([],A.L(a))
return A.b(a.slice(b,c),A.L(a))},
a1(a,b){return this.H(a,b,null)},
bb(a,b,c){A.az(b,c,a.length)
return A.cD(a,b,c,A.L(a).c)},
gv(a){if(a.length>0)return a[0]
throw A.e(A.aE())},
gS(a){var s=a.length
if(s>0)return a[s-1]
throw A.e(A.aE())},
a5(a,b,c,d,e){var s,r,q,p,o
A.L(a).i("f<1>").a(d)
a.$flags&2&&A.w(a,5)
A.az(b,c,a.length)
s=c-b
if(s===0)return
A.ap(e,"skipCount")
if(t.j.b(d)){r=d
q=e}else{r=J.cV(d,e).aM(0,!1)
q=0}p=J.q(r)
if(q+s>p.gl(r))throw A.e(A.pM())
if(q<b)for(o=s-1;o>=0;--o)a[b+o]=p.h(r,q+o)
else for(o=0;o<s;++o)a[b+o]=p.h(r,q+o)},
Z(a,b,c,d){return this.a5(a,b,c,d,0)},
b1(a,b){var s,r
A.L(a).i("B(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.e(A.a6(a))}return!1},
aj(a,b){var s,r
A.L(a).i("B(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.e(A.a6(a))}return!0},
az(a,b){var s,r,q,p,o,n=A.L(a)
n.i("c(1,1)?").a(b)
a.$flags&2&&A.w(a,"sort")
s=a.length
if(s<2)return
if(b==null)b=J.w2()
if(s===2){r=a[0]
q=a[1]
n=b.$2(r,q)
if(typeof n!=="number")return n.im()
if(n>0){a[0]=q
a[1]=r}return}p=0
if(n.c.b(null))for(o=0;o<a.length;++o)if(a[o]===void 0){a[o]=null;++p}a.sort(A.dL(b,2))
if(p>0)this.fE(a,p)},
aQ(a){return this.az(a,null)},
fE(a,b){var s,r=a.length
for(;s=r-1,r>0;r=s)if(a[s]===null){a[s]=void 0;--b
if(b===0)break}},
aK(a,b,c){var s,r=a.length
if(c>=r)return-1
if(c<0)c=0
for(s=c;s<r;++s){if(!(s<a.length))return A.a(a,s)
if(J.l(a[s],b))return s}return-1},
aC(a,b){return this.aK(a,b,0)},
u(a,b){var s
for(s=0;s<a.length;++s)if(J.l(a[s],b))return!0
return!1},
gA(a){return a.length===0},
gI(a){return a.length!==0},
q(a){return A.ol(a,"[","]")},
aM(a,b){var s=A.b(a.slice(0),A.L(a))
return s},
e8(a){return this.aM(a,!0)},
e9(a){return A.u6(a,A.L(a).c)},
gt(a){return new J.aT(a,a.length,A.L(a).i("aT<1>"))},
gR(a){return A.dm(a)},
gl(a){return a.length},
sl(a,b){a.$flags&1&&A.w(a,"set length","change the length of")
if(b<0)throw A.e(A.a4(b,0,null,"newLength",null))
if(b>a.length)A.L(a).c.a(null)
a.length=b},
h(a,b){A.E(b)
if(!(b>=0&&b<a.length))throw A.e(A.nC(a,b))
return a[b]},
m(a,b,c){A.L(a).c.a(c)
a.$flags&2&&A.w(a)
if(!(b>=0&&b<a.length))throw A.e(A.nC(a,b))
a[b]=c},
cw(a,b){return new A.bE(a,b.i("bE<0>"))},
gV(a){return A.bj(A.L(a))},
$ix:1,
$if:1,
$ij:1,
hx(a,b){return this.gv(a).$1(b)},
hL(a,b){return this.gS(a).$1(b)}}
J.fU.prototype={
ic(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.he(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.jn.prototype={}
J.aT.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.i(q)
throw A.e(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$iI:1}
J.dc.prototype={
ab(a,b){var s
A.ae(b)
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gbA(b)
if(this.gbA(a)===s)return 0
if(this.gbA(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gbA(a){return a===0?1/a<0:a<0},
N(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.e(A.ar(""+a+".toInt()"))},
bw(a){var s,r
if(a>=0){if(a<=2147483647){s=a|0
return a===s?s:s+1}}else if(a>=-2147483648)return a|0
r=Math.ceil(a)
if(isFinite(r))return r
throw A.e(A.ar(""+a+".ceil()"))},
a4(a){var s,r
if(a>=0){if(a<=2147483647)return a|0}else if(a>=-2147483648){s=a|0
return a===s?s:s-1}r=Math.floor(a)
if(isFinite(r))return r
throw A.e(A.ar(""+a+".floor()"))},
a3(a){if(a>0){if(a!==1/0)return Math.round(a)}else if(a>-1/0)return 0-Math.round(0-a)
throw A.e(A.ar(""+a+".round()"))},
a0(a){if(a<0)return-Math.round(-a)
else return Math.round(a)},
D(a,b,c){if(this.ab(b,c)>0)throw A.e(A.cT(b))
if(this.ab(a,b)<0)return b
if(this.ab(a,c)>0)return c
return a},
i9(a,b){var s
if(b<0||b>20)throw A.e(A.a4(b,0,20,"fractionDigits",null))
s=a.toFixed(b)
if(a===0&&this.gbA(a))return"-"+s
return s},
b8(a,b){var s,r,q,p,o
if(b<2||b>36)throw A.e(A.a4(b,2,36,"radix",null))
s=a.toString(b)
r=s.length
q=r-1
if(!(q>=0))return A.a(s,q)
if(s.charCodeAt(q)!==41)return s
p=/^([\da-z]+)(?:\.([\da-z]+))?\(e\+(\d+)\)$/.exec(s)
if(p==null)A.n(A.ar("Unexpected toString result: "+s))
r=p.length
if(1>=r)return A.a(p,1)
s=p[1]
if(3>=r)return A.a(p,3)
o=+p[3]
r=p[2]
if(r!=null){s+=r
o-=r.length}return s+B.d.aP("0",o)},
q(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gR(a){var s,r,q,p,o=a|0
if(a===o)return o&536870911
s=Math.abs(a)
r=Math.log(s)/0.6931471805599453|0
q=Math.pow(2,r)
p=s<1?s/q:q/s
return((p*9007199254740992|0)+(p*3542243181176521|0))*599197+r*1259&536870911},
X(a,b){var s=a%b
if(s===0)return 0
if(s>0)return s
if(b<0)return s-b
else return s+b},
a7(a,b){if((a|0)===a)if(b>=1||b<-1)return a/b|0
return this.dq(a,b)},
O(a,b){return(a|0)===a?a/b|0:this.dq(a,b)},
dq(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.e(A.ar("Result of truncating division is "+A.t(s)+": "+A.t(a)+" ~/ "+b))},
ae(a,b){if(b<0)throw A.e(A.cT(b))
return b>31?0:a<<b>>>0},
ag(a,b){return b>31?0:a<<b>>>0},
L(a,b){var s
if(a>0)s=this.bo(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
c_(a,b){if(0>b)throw A.e(A.cT(b))
return this.bo(a,b)},
bo(a,b){return b>31?0:a>>>b},
gV(a){return A.bj(t.cZ)},
$iaV:1,
$id:1,
$iaq:1}
J.eb.prototype={
gV(a){return A.bj(t.S)},
$iQ:1,
$ic:1}
J.fV.prototype={
gV(a){return A.bj(t.i)},
$iQ:1}
J.bU.prototype={
c7(a,b,c){var s=b.length
if(c>s)throw A.e(A.a4(c,0,s,null,null))
return new A.i8(b,a,c)},
c6(a,b){return this.c7(a,b,0)},
dO(a,b){var s=b.length,r=a.length
if(s>r)return!1
return b===this.aG(a,r-s)},
cE(a,b){var s
if(typeof b=="string")return A.b(a.split(b),t.s)
else{if(b instanceof A.ed){s=b.e
s=!(s==null?b.e=b.eR():s)}else s=!1
if(s)return A.b(a.split(b.b),t.s)
else return this.eV(a,b)}},
eV(a,b){var s,r,q,p,o,n,m=A.b([],t.s)
for(s=J.rK(b,a),s=s.gt(s),r=0,q=1;s.n();){p=s.gp()
o=p.gcF()
n=p.gcf()
q=n-o
if(q===0&&r===o)continue
B.a.k(m,this.a6(a,r,o))
r=n}if(r<a.length||q>0)B.a.k(m,this.aG(a,r))
return m},
ar(a,b){var s=b.length
if(s>a.length)return!1
return b===a.substring(0,s)},
a6(a,b,c){return a.substring(b,A.az(b,c,a.length))},
aG(a,b){return this.a6(a,b,null)},
aO(a){var s,r,q,p=a.trim(),o=p.length
if(o===0)return p
if(0>=o)return A.a(p,0)
if(p.charCodeAt(0)===133){s=J.pQ(p,1)
if(s===o)return""}else s=0
r=o-1
if(!(r>=0))return A.a(p,r)
q=p.charCodeAt(r)===133?J.pR(p,r):o
if(s===0&&q===o)return p
return p.substring(s,q)},
ia(a){var s=a.trimStart(),r=s.length
if(r===0)return s
if(0>=r)return A.a(s,0)
if(s.charCodeAt(0)!==133)return s
return s.substring(J.pQ(s,1))},
ib(a){var s,r=a.trimEnd(),q=r.length
if(q===0)return r
s=q-1
if(!(s>=0))return A.a(r,s)
if(r.charCodeAt(s)!==133)return r
return r.substring(0,J.pR(r,s))},
aP(a,b){var s,r
if(0>=b)return""
if(b===1||a.length===0)return a
if(b!==b>>>0)throw A.e(B.ap)
for(s=a,r="";;){if((b&1)===1)r=s+r
b=b>>>1
if(b===0)break
s+=s}return r},
dY(a,b,c){var s=b-a.length
if(s<=0)return a
return this.aP(c,s)+a},
aK(a,b,c){var s
if(c<0||c>a.length)throw A.e(A.a4(c,0,a.length,null,null))
s=a.indexOf(b,c)
return s},
aC(a,b){return this.aK(a,b,0)},
u(a,b){return A.xC(a,b,0)},
ab(a,b){var s
A.Y(b)
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
gV(a){return A.bj(t.N)},
gl(a){return a.length},
$iQ:1,
$iaV:1,
$ijE:1,
$ip:1}
A.c7.prototype={
gt(a){return new A.dX(J.G(this.gai()),A.r(this).i("dX<1,2>"))},
gl(a){return J.Z(this.gai())},
gA(a){return J.dP(this.gai())},
gI(a){return J.og(this.gai())},
T(a,b){var s=A.r(this)
return A.dW(J.cV(this.gai(),b),s.c,s.y[1])},
M(a,b){return A.r(this).y[1].a(J.fj(this.gai(),b))},
gv(a){return A.r(this).y[1].a(J.ik(this.gai()))},
u(a,b){return J.pm(this.gai(),b)},
q(a){return J.b7(this.gai())}}
A.dX.prototype={
n(){return this.a.n()},
gp(){return this.$ti.y[1].a(this.a.gp())},
$iI:1}
A.ce.prototype={
gai(){return this.a}}
A.eP.prototype={$ix:1}
A.eN.prototype={
h(a,b){return this.$ti.y[1].a(J.aL(this.a,A.E(b)))},
m(a,b,c){var s=this.$ti
J.ph(this.a,b,s.c.a(s.y[1].a(c)))},
sl(a,b){J.rS(this.a,b)},
k(a,b){var s=this.$ti
J.pi(this.a,s.c.a(s.y[1].a(b)))},
bb(a,b,c){var s=this.$ti
return A.dW(J.rQ(this.a,b,c),s.c,s.y[1])},
a5(a,b,c,d,e){var s=this.$ti
J.rT(this.a,b,c,A.dW(s.i("f<2>").a(d),s.y[1],s.c),e)},
Z(a,b,c,d){return this.a5(0,b,c,d,0)},
$ix:1,
$ij:1}
A.bn.prototype={
bu(a,b){return new A.bn(this.a,this.$ti.i("@<1>").G(b).i("bn<1,2>"))},
gai(){return this.a}}
A.cf.prototype={
bv(a,b,c){return new A.cf(this.a,this.$ti.i("@<1,2>").G(b).G(c).i("cf<1,2,3,4>"))},
J(a){return this.a.J(a)},
h(a,b){return this.$ti.i("4?").a(this.a.h(0,b))},
Y(a,b){this.a.Y(0,new A.is(this,this.$ti.i("~(3,4)").a(b)))},
ga2(){var s=this.$ti
return A.dW(this.a.ga2(),s.c,s.y[2])},
gaE(){var s=this.$ti
return A.dW(this.a.gaE(),s.y[1],s.y[3])},
gl(a){var s=this.a
return s.gl(s)},
gA(a){var s=this.a
return s.gA(s)},
gI(a){var s=this.a
return s.gI(s)},
gah(){return this.a.gah().aL(0,new A.ir(this),this.$ti.i("a8<3,4>"))}}
A.is.prototype={
$2(a,b){var s=this.a.$ti
s.c.a(a)
s.y[1].a(b)
this.b.$2(s.y[2].a(a),s.y[3].a(b))},
$S(){return this.a.$ti.i("~(1,2)")}}
A.ir.prototype={
$1(a){var s=this.a.$ti
s.i("a8<1,2>").a(a)
return new A.a8(s.y[2].a(a.a),s.y[3].a(a.b),s.i("a8<3,4>"))},
$S(){return this.a.$ti.i("a8<3,4>(a8<1,2>)")}}
A.df.prototype={
q(a){return"LateInitializationError: "+this.a}}
A.d2.prototype={
gl(a){return this.a.length},
h(a,b){var s
A.E(b)
s=this.a
if(!(b>=0&&b<s.length))return A.a(s,b)
return s.charCodeAt(b)}}
A.nU.prototype={
$0(){var s=new A.K($.H,t.cU)
s.aU(null)
return s},
$S:41}
A.k0.prototype={}
A.x.prototype={}
A.a0.prototype={
gt(a){var s=this
return new A.X(s,s.gl(s),A.r(s).i("X<a0.E>"))},
gA(a){return this.gl(this)===0},
gv(a){if(this.gl(this)===0)throw A.e(A.aE())
return this.M(0,0)},
u(a,b){var s,r=this,q=r.gl(r)
for(s=0;s<q;++s){if(J.l(r.M(0,s),b))return!0
if(q!==r.gl(r))throw A.e(A.a6(r))}return!1},
b1(a,b){var s,r,q=this
A.r(q).i("B(a0.E)").a(b)
s=q.gl(q)
for(r=0;r<s;++r){if(b.$1(q.M(0,r)))return!0
if(s!==q.gl(q))throw A.e(A.a6(q))}return!1},
ac(a,b){var s,r,q,p=this,o=p.gl(p)
if(b.length!==0){if(o===0)return""
s=A.t(p.M(0,0))
if(o!==p.gl(p))throw A.e(A.a6(p))
for(r=s,q=1;q<o;++q){r=r+b+A.t(p.M(0,q))
if(o!==p.gl(p))throw A.e(A.a6(p))}return r.charCodeAt(0)==0?r:r}else{for(q=0,r="";q<o;++q){r+=A.t(p.M(0,q))
if(o!==p.gl(p))throw A.e(A.a6(p))}return r.charCodeAt(0)==0?r:r}},
bB(a){return this.ac(0,"")},
aL(a,b,c){var s=A.r(this)
return new A.an(this,s.G(c).i("1(a0.E)").a(b),s.i("@<a0.E>").G(c).i("an<1,2>"))},
T(a,b){return A.cD(this,b,null,A.r(this).i("a0.E"))}}
A.bz.prototype={
cI(a,b,c,d){var s,r=this.b
A.ap(r,"start")
s=this.c
if(s!=null){A.ap(s,"end")
if(r>s)throw A.e(A.a4(r,0,s,"start",null))}},
geX(){var s=J.Z(this.a),r=this.c
if(r==null||r>s)return s
return r},
gfS(){var s=J.Z(this.a),r=this.b
if(r>s)return s
return r},
gl(a){var s,r=J.Z(this.a),q=this.b
if(q>=r)return 0
s=this.c
if(s==null||s>=r)return r-q
return s-q},
M(a,b){var s=this,r=s.gfS()+b
if(b<0||r>=s.geX())throw A.e(A.jl(b,s.gl(0),s,"index"))
return J.fj(s.a,r)},
T(a,b){var s,r,q=this
A.ap(b,"count")
s=q.b+b
r=q.c
if(r!=null&&s>=r)return new A.e1(q.$ti.i("e1<1>"))
return A.cD(q.a,s,r,q.$ti.c)},
aM(a,b){var s,r,q,p=this,o=p.b,n=p.a,m=J.q(n),l=m.gl(n),k=p.c
if(k!=null&&k<l)l=k
s=l-o
if(s<=0){n=J.on(0,p.$ti.c)
return n}r=A.T(s,m.M(n,o),!1,p.$ti.c)
for(q=1;q<s;++q){B.a.m(r,q,m.M(n,o+q))
if(m.gl(n)<l)throw A.e(A.a6(p))}return r}}
A.X.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s,r=this,q=r.a,p=J.q(q),o=p.gl(q)
if(r.b!==o)throw A.e(A.a6(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.M(q,s);++r.c
return!0},
$iI:1}
A.cv.prototype={
gt(a){return new A.ej(J.G(this.a),this.b,A.r(this).i("ej<1,2>"))},
gl(a){return J.Z(this.a)},
gA(a){return J.dP(this.a)},
gv(a){return this.b.$1(J.ik(this.a))},
M(a,b){return this.b.$1(J.fj(this.a,b))}}
A.ci.prototype={$ix:1}
A.ej.prototype={
n(){var s=this,r=s.b
if(r.n()){s.a=s.c.$1(r.gp())
return!0}s.a=null
return!1},
gp(){var s=this.a
return s==null?this.$ti.y[1].a(s):s},
$iI:1}
A.an.prototype={
gl(a){return J.Z(this.a)},
M(a,b){return this.b.$1(J.fj(this.a,b))}}
A.cG.prototype={
gt(a){return new A.eJ(J.G(this.a),this.b,this.$ti.i("eJ<1>"))}}
A.eJ.prototype={
n(){var s,r
for(s=this.a,r=this.b;s.n();)if(r.$1(s.gp()))return!0
return!1},
gp(){return this.a.gp()},
$iI:1}
A.by.prototype={
T(a,b){A.dR(b,"count",t.S)
A.ap(b,"count")
return new A.by(this.a,this.b+b,A.r(this).i("by<1>"))},
gt(a){var s=this.a
return new A.eC(s.gt(s),this.b,A.r(this).i("eC<1>"))}}
A.d9.prototype={
gl(a){var s=this.a,r=s.gl(s)-this.b
if(r>=0)return r
return 0},
T(a,b){A.dR(b,"count",t.S)
A.ap(b,"count")
return new A.d9(this.a,this.b+b,this.$ti)},
$ix:1}
A.eC.prototype={
n(){var s,r
for(s=this.a,r=0;r<this.b;++r)s.n()
this.b=0
return s.n()},
gp(){return this.a.gp()},
$iI:1}
A.e1.prototype={
gt(a){return B.ai},
gA(a){return!0},
gl(a){return 0},
gv(a){throw A.e(A.aE())},
M(a,b){throw A.e(A.a4(b,0,0,"index",null))},
u(a,b){return!1},
T(a,b){A.ap(b,"count")
return this}}
A.e2.prototype={
n(){return!1},
gp(){throw A.e(A.aE())},
$iI:1}
A.bE.prototype={
gt(a){return new A.cH(J.G(this.a),this.$ti.i("cH<1>"))}}
A.cH.prototype={
n(){var s,r
for(s=this.a,r=this.$ti.c;s.n();)if(r.b(s.gp()))return!0
return!1},
gp(){return this.$ti.c.a(this.a.gp())},
$iI:1}
A.cp.prototype={
gl(a){return J.Z(this.a)},
gA(a){return J.dP(this.a)},
gI(a){return J.og(this.a)},
gv(a){return new A.z(this.b,J.ik(this.a))},
M(a,b){return new A.z(b+this.b,J.fj(this.a,b))},
u(a,b){var s,r,q,p=null,o=null,n=!1
if(t.x.b(b)){s=b.a
if(A.dF(s)){A.E(s)
r=b.b
n=s>=this.b
o=r
p=s}}if(n){if(typeof p!=="number")return p.aS()
n=J.cV(this.a,p-this.b)
q=n.gt(n)
return q.n()&&J.l(q.gp(),o)}return!1},
T(a,b){A.dR(b,"count",t.S)
A.ap(b,"count")
return new A.cp(J.cV(this.a,b),b+this.b,A.r(this).i("cp<1>"))},
gt(a){return new A.bt(J.G(this.a),this.b,A.r(this).i("bt<1>"))}}
A.d8.prototype={
u(a,b){var s,r,q,p,o=null,n=null,m=!1
if(t.x.b(b)){s=b.a
if(A.dF(s)){A.E(s)
r=b.b
m=s>=this.b
n=r
o=s}}if(m){if(typeof o!=="number")return o.aS()
q=o-this.b
m=this.a
p=J.q(m)
return q<p.gl(m)&&J.l(p.M(m,q),n)}return!1},
T(a,b){A.dR(b,"count",t.S)
A.ap(b,"count")
return new A.d8(J.cV(this.a,b),this.b+b,this.$ti)},
$ix:1}
A.bt.prototype={
n(){if(++this.c>=0&&this.a.n())return!0
this.c=-2
return!1},
gp(){var s=this.c
return s>=0?new A.z(this.b+s,this.a.gp()):A.n(A.aE())},
$iI:1}
A.a_.prototype={
sl(a,b){throw A.e(A.ar("Cannot change the length of a fixed-length list"))},
k(a,b){A.aa(a).i("a_.E").a(b)
throw A.e(A.ar("Cannot add to a fixed-length list"))}}
A.bD.prototype={
m(a,b,c){A.r(this).i("bD.E").a(c)
throw A.e(A.ar("Cannot modify an unmodifiable list"))},
sl(a,b){throw A.e(A.ar("Cannot change the length of an unmodifiable list"))},
k(a,b){A.r(this).i("bD.E").a(b)
throw A.e(A.ar("Cannot add to an unmodifiable list"))},
a5(a,b,c,d,e){A.r(this).i("f<bD.E>").a(d)
throw A.e(A.ar("Cannot modify an unmodifiable list"))},
Z(a,b,c,d){return this.a5(0,b,c,d,0)}}
A.dr.prototype={}
A.bd.prototype={
gl(a){return J.Z(this.a)},
M(a,b){var s=this.a,r=J.q(s)
return r.M(s,r.gl(s)-1-b)}}
A.fa.prototype={}
A.z.prototype={$r:"+(1,2)",$s:1}
A.b3.prototype={$r:"+(1,2,3)",$s:2}
A.d4.prototype={
bv(a,b,c){var s=A.r(this)
return A.q_(this,s.c,s.y[1],b,c)},
gA(a){return this.gl(this)===0},
gI(a){return this.gl(this)!==0},
q(a){return A.os(this)},
m(a,b,c){var s=A.r(this)
s.c.a(b)
s.y[1].a(c)
A.tf()},
gah(){return new A.dC(this.hq(),A.r(this).i("dC<a8<1,2>>"))},
hq(){var s=this
return function(){var r=0,q=1,p=[],o,n,m,l,k
return function $async$gah(a,b,c){if(b===1){p.push(c)
r=q}for(;;)switch(r){case 0:o=s.ga2(),o=o.gt(o),n=A.r(s),m=n.y[1],n=n.i("a8<1,2>")
case 2:if(!o.n()){r=3
break}l=o.gp()
k=s.h(0,l)
r=4
return a.b=new A.a8(l,k==null?m.a(k):k,n),1
case 4:r=2
break
case 3:return 0
case 1:return a.c=p.at(-1),3}}}},
$iR:1}
A.al.prototype={
gl(a){return this.b.length},
gd1(){var s=this.$keys
if(s==null){s=Object.keys(this.a)
this.$keys=s}return s},
J(a){if(typeof a!="string")return!1
if("__proto__"===a)return!1
return this.a.hasOwnProperty(a)},
h(a,b){if(!this.J(b))return null
return this.b[this.a[b]]},
Y(a,b){var s,r,q,p
this.$ti.i("~(1,2)").a(b)
s=this.gd1()
r=this.b
for(q=s.length,p=0;p<q;++p)b.$2(s[p],r[p])},
ga2(){return new A.cM(this.gd1(),this.$ti.i("cM<1>"))},
gaE(){return new A.cM(this.b,this.$ti.i("cM<2>"))}}
A.cM.prototype={
gl(a){return this.a.length},
gA(a){return 0===this.a.length},
gI(a){return 0!==this.a.length},
gt(a){var s=this.a
return new A.bH(s,s.length,this.$ti.i("bH<1>"))}}
A.bH.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$iI:1}
A.bQ.prototype={
au(){var s=this,r=s.$map
if(r==null){r=new A.cq(s.$ti.i("cq<1,2>"))
A.r7(s.a,r)
s.$map=r}return r},
J(a){return this.au().J(a)},
h(a,b){return this.au().h(0,b)},
Y(a,b){this.$ti.i("~(1,2)").a(b)
this.au().Y(0,b)},
ga2(){var s=this.au()
return new A.am(s,A.r(s).i("am<1>"))},
gaE(){var s=this.au()
return new A.aY(s,A.r(s).i("aY<2>"))},
gl(a){return this.au().a}}
A.d5.prototype={}
A.aW.prototype={
gl(a){return this.b},
gA(a){return this.b===0},
gI(a){return this.b!==0},
gt(a){var s,r=this,q=r.$keys
if(q==null){q=Object.keys(r.a)
r.$keys=q}s=q
return new A.bH(s,s.length,r.$ti.i("bH<1>"))},
u(a,b){if(typeof b!="string")return!1
if("__proto__"===b)return!1
return this.a.hasOwnProperty(b)}}
A.bR.prototype={
gl(a){return this.a.length},
gA(a){return this.a.length===0},
gI(a){return this.a.length!==0},
gt(a){var s=this.a
return new A.bH(s,s.length,this.$ti.i("bH<1>"))},
au(){var s,r,q,p,o=this,n=o.$map
if(n==null){n=new A.cq(o.$ti.i("cq<1,1>"))
for(s=o.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q]
n.m(0,p,p)}o.$map=n}return n},
u(a,b){return this.au().J(b)}}
A.ex.prototype={}
A.kU.prototype={
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
A.es.prototype={
q(a){return"Null check operator used on a null value"}}
A.fW.prototype={
q(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.hD.prototype={
q(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.jD.prototype={
q(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.e3.prototype={}
A.eZ.prototype={
q(a){var s,r=this.b
if(r!=null)return r
r=this.a
s=r!==null&&typeof r==="object"?r.stack:null
return this.b=s==null?"":s},
$ib0:1}
A.bM.prototype={
q(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.ri(r==null?"unknown":r)+"'"},
gV(a){var s=A.oX(this)
return A.bj(s==null?A.aa(this):s)},
$icl:1,
gil(){return this},
$C:"$1",
$R:1,
$D:null}
A.fs.prototype={$C:"$0",$R:0}
A.ft.prototype={$C:"$2",$R:2}
A.ht.prototype={}
A.hm.prototype={
q(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.ri(s)+"'"}}
A.cX.prototype={
B(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.cX))return!1
return this.$_target===b.$_target&&this.a===b.a},
gR(a){return(A.nV(this.a)^A.dm(this.$_target))>>>0},
q(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.he(this.a)+"'")}}
A.hg.prototype={
q(a){return"RuntimeError: "+this.a}}
A.aX.prototype={
gl(a){return this.a},
gA(a){return this.a===0},
gI(a){return this.a!==0},
ga2(){return new A.am(this,A.r(this).i("am<1>"))},
gaE(){return new A.aY(this,A.r(this).i("aY<2>"))},
gah(){return new A.cs(this,A.r(this).i("cs<1,2>"))},
J(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.hF(a)},
hF(a){var s=this.d
if(s==null)return!1
return this.b4(this.d_(s,a),a)>=0},
F(a,b){A.r(this).i("R<1,2>").a(b).Y(0,new A.jo(this))},
h(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.hG(b)},
hG(a){var s,r,q=this.d
if(q==null)return null
s=this.d_(q,a)
r=this.b4(s,a)
if(r<0)return null
return s[r].b},
m(a,b,c){var s,r,q=this,p=A.r(q)
p.c.a(b)
p.y[1].a(c)
if(typeof b=="string"){s=q.b
q.cJ(s==null?q.b=q.bW():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=q.c
q.cJ(r==null?q.c=q.bW():r,b,c)}else q.hI(b,c)},
hI(a,b){var s,r,q,p,o=this,n=A.r(o)
n.c.a(a)
n.y[1].a(b)
s=o.d
if(s==null)s=o.d=o.bW()
r=o.bz(a)
q=s[r]
if(q==null)s[r]=[o.bK(a,b)]
else{p=o.b4(q,a)
if(p>=0)q[p].b=b
else q.push(o.bK(a,b))}},
b5(a,b){var s,r,q=this,p=A.r(q)
p.c.a(a)
p.i("2()").a(b)
if(q.J(a)){s=q.h(0,a)
return s==null?p.y[1].a(s):s}r=b.$0()
q.m(0,a,r)
return r},
ap(a,b){var s=this
if(typeof b=="string")return s.dj(s.b,b)
else if(typeof b=="number"&&(b&0x3fffffff)===b)return s.dj(s.c,b)
else return s.hH(b)},
hH(a){var s,r,q,p,o=this,n=o.d
if(n==null)return null
s=o.bz(a)
r=n[s]
q=o.b4(r,a)
if(q<0)return null
p=r.splice(q,1)[0]
o.dv(p)
if(r.length===0)delete n[s]
return p.b},
Y(a,b){var s,r,q=this
A.r(q).i("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.e(A.a6(q))
s=s.c}},
cJ(a,b,c){var s,r=A.r(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.bK(b,c)
else s.b=c},
dj(a,b){var s
if(a==null)return null
s=a[b]
if(s==null)return null
this.dv(s)
delete a[b]
return s.b},
d6(){this.r=this.r+1&1073741823},
bK(a,b){var s=this,r=A.r(s),q=new A.jv(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else{r=s.f
r.toString
q.d=r
s.f=r.c=q}++s.a
s.d6()
return q},
dv(a){var s=this,r=a.d,q=a.c
if(r==null)s.e=q
else r.c=q
if(q==null)s.f=r
else q.d=r;--s.a
s.d6()},
bz(a){return J.b6(a)&1073741823},
d_(a,b){return a[this.bz(b)]},
b4(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.l(a[r].a,b))return r
return-1},
q(a){return A.os(this)},
bW(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$ioq:1}
A.jo.prototype={
$2(a,b){var s=this.a,r=A.r(s)
s.m(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.r(this.a).i("~(1,2)")}}
A.jv.prototype={}
A.am.prototype={
gl(a){return this.a.a},
gA(a){return this.a.a===0},
gt(a){var s=this.a
return new A.eg(s,s.r,s.e,this.$ti.i("eg<1>"))},
u(a,b){return this.a.J(b)}}
A.eg.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.a6(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$iI:1}
A.aY.prototype={
gl(a){return this.a.a},
gA(a){return this.a.a===0},
gt(a){var s=this.a
return new A.cu(s,s.r,s.e,this.$ti.i("cu<1>"))}}
A.cu.prototype={
gp(){return this.d},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.a6(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$iI:1}
A.cs.prototype={
gl(a){return this.a.a},
gA(a){return this.a.a===0},
gt(a){var s=this.a
return new A.ct(s,s.r,s.e,this.$ti.i("ct<1,2>"))}}
A.ct.prototype={
gp(){var s=this.d
s.toString
return s},
n(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.a6(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.a8(s.a,s.b,r.$ti.i("a8<1,2>"))
r.c=s.c
return!0}},
$iI:1}
A.cq.prototype={
bz(a){return A.wQ(a)&1073741823},
b4(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.l(a[r].a,b))return r
return-1}}
A.nK.prototype={
$1(a){return this.a(a)},
$S:26}
A.nL.prototype={
$2(a,b){return this.a(a,b)},
$S:47}
A.nM.prototype={
$1(a){return this.a(A.Y(a))},
$S:27}
A.bg.prototype={
gV(a){return A.bj(this.d0())},
d0(){return A.wW(this.$r,this.bU())},
q(a){return this.dt(!1)},
dt(a){var s,r,q,p,o,n=this.f_(),m=this.bU(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.a(m,q)
o=m[q]
l=a?l+A.q6(o):l+A.t(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
f_(){var s,r=this.$s
while($.lu.length<=r)B.a.k($.lu,null)
s=$.lu[r]
if(s==null){s=this.eQ()
B.a.m($.lu,r,s)}return s},
eQ(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=t.K,j=J.om(l,k)
for(s=0;s<l;++s)j[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.a.m(j,q,r[s])}}return A.or(j,k)}}
A.dz.prototype={
bU(){return[this.a,this.b]},
B(a,b){if(b==null)return!1
return b instanceof A.dz&&this.$s===b.$s&&J.l(this.a,b.a)&&J.l(this.b,b.b)},
gR(a){return A.ou(this.$s,this.a,this.b,B.I)}}
A.dA.prototype={
bU(){return[this.a,this.b,this.c]},
B(a,b){var s=this
if(b==null)return!1
return b instanceof A.dA&&s.$s===b.$s&&J.l(s.a,b.a)&&J.l(s.b,b.b)&&J.l(s.c,b.c)},
gR(a){var s=this
return A.ou(s.$s,s.a,s.b,s.c)}}
A.ed.prototype={
q(a){return"RegExp/"+this.a+"/"+this.b.flags},
gfj(){var s=this,r=s.c
if(r!=null)return r
r=s.b
return s.c=A.pS(s.a,r.multiline,!r.ignoreCase,r.unicode,r.dotAll,"g")},
eR(){var s,r=this.a
if(!B.d.u(r,"("))return!1
s=this.b.unicode?"u":""
return new RegExp("(?:)|"+r,s).exec("").length>1},
c7(a,b,c){var s=b.length
if(c>s)throw A.e(A.a4(c,0,s,null,null))
return new A.hF(this,b,c)},
c6(a,b){return this.c7(0,b,0)},
eZ(a,b){var s,r=this.gfj()
if(r==null)r=A.b4(r)
r.lastIndex=b
s=r.exec(a)
if(s==null)return null
return new A.i4(s)},
$ijE:1,
$iuw:1}
A.i4.prototype={
gcF(){return this.b.index},
gcf(){var s=this.b
return s.index+s[0].length},
$idi:1,
$iew:1}
A.hF.prototype={
gt(a){return new A.eK(this.a,this.b,this.c)}}
A.eK.prototype={
gp(){var s=this.d
return s==null?t.lu.a(s):s},
n(){var s,r,q,p,o,n,m=this,l=m.b
if(l==null)return!1
s=m.c
r=l.length
if(s<=r){q=m.a
p=q.eZ(l,s)
if(p!=null){m.d=p
o=p.gcf()
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
A.eE.prototype={
gcf(){return this.a+this.c.length},
$idi:1,
gcF(){return this.a}}
A.i8.prototype={
gt(a){return new A.i9(this.a,this.b,this.c)},
gv(a){var s=this.b,r=this.a.indexOf(s,this.c)
if(r>=0)return new A.eE(r,s)
throw A.e(A.aE())}}
A.i9.prototype={
n(){var s,r,q=this,p=q.c,o=q.b,n=o.length,m=q.a,l=m.length
if(p+n>l){q.d=null
return!1}s=m.indexOf(o,p)
if(s<0){q.c=l+1
q.d=null
return!1}r=s+n
q.d=new A.eE(s,o)
q.c=r===q.c?r+1:r
return!0},
gp(){var s=this.d
s.toString
return s},
$iI:1}
A.bW.prototype={
gdS(a){return a.byteLength},
gV(a){return B.dj},
dF(a,b,c){A.bK(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
dE(a,b,c){A.bK(a,b,c)
return new Uint16Array(a,b,c)},
dC(a,b,c){A.bK(a,b,c)
return new Float32Array(a,b,c)},
dD(a,b,c){A.bK(a,b,c)
return new Float64Array(a,b,c)},
dB(a,b,c){var s
A.bK(a,b,c)
s=new DataView(a,b,c)
return s},
$iQ:1,
$ibW:1}
A.dl.prototype={$idl:1}
A.eo.prototype={
gao(a){if(((a.$flags|0)&2)!==0)return new A.lC(a.buffer)
else return a.buffer},
fa(a,b,c,d){var s=A.a4(b,0,c,d,null)
throw A.e(s)},
cQ(a,b,c,d){if(b>>>0!==b||b>c)this.fa(a,b,c,d)}}
A.lC.prototype={
gdS(a){return this.a.byteLength},
dF(a,b,c){var s=A.ot(this.a,b,c)
s.$flags=3
return s},
dE(a,b,c){var s=A.ui(this.a,b,c)
s.$flags=3
return s},
dC(a,b,c){var s=A.uf(this.a,b,c)
s.$flags=3
return s},
dD(a,b,c){var s=A.ug(this.a,b,c)
s.$flags=3
return s},
dB(a,b,c){var s=A.ue(this.a,b,c)
s.$flags=3
return s}}
A.en.prototype={
gV(a){return B.dk},
$iQ:1,
$ipv:1}
A.ao.prototype={
gl(a){return a.length},
dm(a,b,c,d,e){var s,r,q=a.length
this.cQ(a,b,q,"start")
this.cQ(a,c,q,"end")
if(b>c)throw A.e(A.a4(b,0,c,null,null))
s=c-b
r=d.length
if(r-e<s)throw A.e(A.cC("Not enough elements"))
if(e!==0||r!==s)d=d.subarray(e,e+s)
a.set(d,b)},
$iaF:1}
A.bX.prototype={
h(a,b){A.E(b)
A.bJ(b,a,a.length)
return a[b]},
m(a,b,c){A.dD(c)
a.$flags&2&&A.w(a)
A.bJ(b,a,a.length)
a[b]=c},
a5(a,b,c,d,e){t.id.a(d)
a.$flags&2&&A.w(a,5)
if(t.dQ.b(d)){this.dm(a,b,c,d,e)
return}this.cH(a,b,c,d,e)},
Z(a,b,c,d){return this.a5(a,b,c,d,0)},
$ix:1,
$if:1,
$ij:1}
A.aG.prototype={
m(a,b,c){A.E(c)
a.$flags&2&&A.w(a)
A.bJ(b,a,a.length)
a[b]=c},
a5(a,b,c,d,e){t.fm.a(d)
a.$flags&2&&A.w(a,5)
if(t.aj.b(d)){this.dm(a,b,c,d,e)
return}this.cH(a,b,c,d,e)},
Z(a,b,c,d){return this.a5(a,b,c,d,0)},
$ix:1,
$if:1,
$ij:1}
A.cw.prototype={
gV(a){return B.dl},
H(a,b,c){return new Float32Array(a.subarray(b,A.bi(b,c,a.length)))},
a1(a,b){return this.H(a,b,null)},
$iQ:1,
$icw:1,
$ibO:1}
A.cx.prototype={
gV(a){return B.dm},
H(a,b,c){return new Float64Array(a.subarray(b,A.bi(b,c,a.length)))},
a1(a,b){return this.H(a,b,null)},
$iQ:1,
$icx:1,
$ibP:1}
A.h5.prototype={
gV(a){return B.dn},
h(a,b){A.E(b)
A.bJ(b,a,a.length)
return a[b]},
H(a,b,c){return new Int16Array(a.subarray(b,A.bi(b,c,a.length)))},
a1(a,b){return this.H(a,b,null)},
$iQ:1,
$iok:1}
A.cy.prototype={
gV(a){return B.dp},
h(a,b){A.E(b)
A.bJ(b,a,a.length)
return a[b]},
H(a,b,c){return new Int32Array(a.subarray(b,A.bi(b,c,a.length)))},
a1(a,b){return this.H(a,b,null)},
$iQ:1,
$icy:1,
$ie9:1}
A.h6.prototype={
gV(a){return B.dq},
h(a,b){A.E(b)
A.bJ(b,a,a.length)
return a[b]},
H(a,b,c){return new Int8Array(a.subarray(b,A.bi(b,c,a.length)))},
a1(a,b){return this.H(a,b,null)},
$iQ:1}
A.cA.prototype={
gV(a){return B.dt},
h(a,b){A.E(b)
A.bJ(b,a,a.length)
return a[b]},
H(a,b,c){return new Uint16Array(a.subarray(b,A.bi(b,c,a.length)))},
a1(a,b){return this.H(a,b,null)},
$iQ:1,
$icA:1,
$ikW:1}
A.ep.prototype={
gV(a){return B.du},
h(a,b){A.E(b)
A.bJ(b,a,a.length)
return a[b]},
H(a,b,c){return new Uint32Array(a.subarray(b,A.bi(b,c,a.length)))},
a1(a,b){return this.H(a,b,null)},
$iQ:1,
$ioA:1}
A.eq.prototype={
gV(a){return B.dv},
gl(a){return a.length},
h(a,b){A.E(b)
A.bJ(b,a,a.length)
return a[b]},
H(a,b,c){return new Uint8ClampedArray(a.subarray(b,A.bi(b,c,a.length)))},
a1(a,b){return this.H(a,b,null)},
$iQ:1}
A.bY.prototype={
gV(a){return B.dw},
gl(a){return a.length},
h(a,b){A.E(b)
A.bJ(b,a,a.length)
return a[b]},
H(a,b,c){return new Uint8Array(a.subarray(b,A.bi(b,c,a.length)))},
a1(a,b){return this.H(a,b,null)},
$iQ:1,
$ibY:1,
$ic5:1}
A.eU.prototype={}
A.eV.prototype={}
A.eW.prototype={}
A.eX.prototype={}
A.b_.prototype={
i(a){return A.f7(v.typeUniverse,this,a)},
G(a){return A.qH(v.typeUniverse,this,a)}}
A.hW.prototype={}
A.ic.prototype={
q(a){return A.aJ(this.a,null)}}
A.hQ.prototype={
q(a){return this.a}}
A.f3.prototype={$ibB:1}
A.l2.prototype={
$1(a){var s=this.a,r=s.a
s.a=null
r.$0()},
$S:17}
A.l1.prototype={
$1(a){var s,r
this.a.a=t.M.a(a)
s=this.b
r=this.c
s.firstChild?s.removeChild(r):s.appendChild(r)},
$S:57}
A.l3.prototype={
$0(){this.a.$0()},
$S:30}
A.l4.prototype={
$0(){this.a.$0()},
$S:30}
A.lz.prototype={
ek(a,b){if(self.setTimeout!=null)this.b=self.setTimeout(A.dL(new A.lA(this,b),0),a)
else throw A.e(A.ar("`setTimeout()` not found."))},
b2(){if(self.setTimeout!=null){var s=this.b
if(s==null)return
self.clearTimeout(s)
this.b=null}else throw A.e(A.ar("Canceling a timer."))}}
A.lA.prototype={
$0(){this.a.b=null
this.b.$0()},
$S:0}
A.hG.prototype={
ca(a){var s,r=this,q=r.$ti
q.i("1/?").a(a)
if(a==null)a=q.c.a(a)
if(!r.b)r.a.aU(a)
else{s=r.a
if(q.i("a7<1>").b(a))s.cP(a)
else s.bg(a)}},
cb(a,b){var s=this.a
if(this.b)s.aA(new A.ah(a,b))
else s.aV(new A.ah(a,b))}}
A.lI.prototype={
$1(a){return this.a.$2(0,a)},
$S:20}
A.lJ.prototype={
$2(a,b){this.a.$2(1,new A.e3(a,t.l.a(b)))},
$S:52}
A.nt.prototype={
$2(a,b){this.a(A.E(a),b)},
$S:54}
A.f2.prototype={
gp(){var s=this.b
return s==null?this.$ti.c.a(s):s},
fG(a,b){var s,r,q
a=A.E(a)
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
o.d=null}q=o.fG(m,n)
if(1===q)return!0
if(0===q){o.b=null
p=o.e
if(p==null||p.length===0){o.a=A.qB
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
o.a=A.qB
throw n
return!1}if(0>=p.length)return A.a(p,-1)
o.a=p.pop()
m=1
continue}throw A.e(A.cC("sync*"))}return!1},
io(a){var s,r,q=this
if(a instanceof A.dC){s=a.a()
r=q.e
if(r==null)r=q.e=[]
B.a.k(r,q.a)
q.a=s
return 2}else{q.d=J.G(a)
return 2}},
$iI:1}
A.dC.prototype={
gt(a){return new A.f2(this.a(),this.$ti.i("f2<1>"))}}
A.ah.prototype={
q(a){return A.t(this.a)},
$iV:1,
gaR(){return this.b}}
A.j0.prototype={
$0(){this.c.a(null)
this.b.bP(null)},
$S:0}
A.kT.prototype={
q(a){var s=this.b.q(0)
return"TimeoutException after "+s+": "+this.a}}
A.hM.prototype={
cb(a,b){var s=this.a
if((s.a&30)!==0)throw A.e(A.cC("Future already completed"))
s.aV(A.w1(a,b))},
dK(a){return this.cb(a,null)}}
A.eM.prototype={
ca(a){var s,r=this.$ti
r.i("1/?").a(a)
s=this.a
if((s.a&30)!==0)throw A.e(A.cC("Future already completed"))
s.aU(r.i("1/").a(a))}}
A.b1.prototype={
hS(a){if((this.c&15)!==6)return!0
return this.b.b.ct(t.iW.a(this.d),a.a,t.y,t.K)},
hz(a){var s,r=this,q=r.e,p=null,o=t.z,n=t.K,m=a.a,l=r.b.b
if(t.ng.b(q))p=l.i4(q,m,a.b,o,n,t.l)
else p=l.ct(t.A.a(q),m,o,n)
try{o=r.$ti.i("2/").a(p)
return o}catch(s){if(t.do.b(A.bk(s))){if((r.c&1)!==0)throw A.e(A.aM("The error handler of Future.then must return a value of the returned future's type","onError"))
throw A.e(A.aM("The error handler of Future.catchError must return a value of the future's type","onError"))}else throw s}}}
A.K.prototype={
b7(a,b,c){var s,r,q,p=this.$ti
p.G(c).i("1/(2)").a(a)
s=$.H
if(s===B.f){if(b!=null&&!t.ng.b(b)&&!t.A.b(b))throw A.e(A.io(b,"onError",u.c))}else{c.i("@<0/>").G(p.c).i("1(2)").a(a)
if(b!=null)b=A.wu(b,s)}r=new A.K(s,c.i("K<0>"))
q=b==null?1:3
this.aT(new A.b1(r,q,a,b,p.i("@<1>").G(c).i("b1<1,2>")))
return r},
e7(a,b){return this.b7(a,null,b)},
ds(a,b,c){var s,r=this.$ti
r.G(c).i("1/(2)").a(a)
s=new A.K($.H,c.i("K<0>"))
this.aT(new A.b1(s,19,a,b,r.i("@<1>").G(c).i("b1<1,2>")))
return s},
ii(a){var s,r
t.mY.a(a)
s=this.$ti
r=new A.K($.H,s)
this.aT(new A.b1(r,8,a,null,s.i("b1<1,1>")))
return r},
fN(a){this.$ti.c.a(a)
this.a=8
this.c=a},
fK(a){this.a=this.a&1|16
this.c=a},
bf(a){this.a=a.a&30|this.a&1
this.c=a.c},
aT(a){var s,r=this,q=r.a
if(q<=3){a.a=t.F.a(r.c)
r.c=a}else{if((q&4)!==0){s=t._.a(r.c)
if((s.a&24)===0){s.aT(a)
return}r.bf(s)}A.dI(null,null,r.b,t.M.a(new A.l8(r,a)))}},
dg(a){var s,r,q,p,o,n,m=this,l={}
l.a=a
if(a==null)return
s=m.a
if(s<=3){r=t.F.a(m.c)
m.c=a
if(r!=null){q=a.a
for(p=a;q!=null;p=q,q=o)o=q.a
p.a=r}}else{if((s&4)!==0){n=t._.a(m.c)
if((n.a&24)===0){n.dg(a)
return}m.bf(n)}l.a=m.bn(a)
A.dI(null,null,m.b,t.M.a(new A.ld(l,m)))}},
aY(){var s=t.F.a(this.c)
this.c=null
return this.bn(s)},
bn(a){var s,r,q
for(s=a,r=null;s!=null;r=s,s=q){q=s.a
s.a=r}return r},
bP(a){var s,r=this,q=r.$ti
q.i("1/").a(a)
if(q.i("a7<1>").b(a))A.lb(a,r,!0)
else{s=r.aY()
q.c.a(a)
r.a=8
r.c=a
A.cL(r,s)}},
bg(a){var s,r=this
r.$ti.c.a(a)
s=r.aY()
r.a=8
r.c=a
A.cL(r,s)},
eP(a){var s,r,q=this
if((a.a&16)!==0){s=q.b===a.b
s=!(s||s)}else s=!1
if(s)return
r=q.aY()
q.bf(a)
A.cL(q,r)},
aA(a){var s=this.aY()
this.fK(a)
A.cL(this,s)},
eO(a,b){A.b4(a)
t.l.a(b)
this.aA(new A.ah(a,b))},
aU(a){var s=this.$ti
s.i("1/").a(a)
if(s.i("a7<1>").b(a)){this.cP(a)
return}this.cO(a)},
cO(a){var s=this
s.$ti.c.a(a)
s.a^=2
A.dI(null,null,s.b,t.M.a(new A.la(s,a)))},
cP(a){A.lb(this.$ti.i("a7<1>").a(a),this,!1)
return},
aV(a){this.a^=2
A.dI(null,null,this.b,t.M.a(new A.l9(this,a)))},
i8(a){var s,r=this,q={}
if((r.a&24)!==0){q=new A.K($.H,r.$ti)
q.aU(r)
return q}s=new A.K($.H,r.$ti)
q.a=null
q.a=A.ql(a,new A.lj(s,a))
r.b7(new A.lk(q,r,s),new A.ll(q,s),t.P)
return s},
$ia7:1}
A.l8.prototype={
$0(){A.cL(this.a,this.b)},
$S:0}
A.ld.prototype={
$0(){A.cL(this.b,this.a.a)},
$S:0}
A.lc.prototype={
$0(){A.lb(this.a.a,this.b,!0)},
$S:0}
A.la.prototype={
$0(){this.a.bg(this.b)},
$S:0}
A.l9.prototype={
$0(){this.a.aA(this.b)},
$S:0}
A.lg.prototype={
$0(){var s,r,q,p,o,n,m,l,k=this,j=null
try{q=k.a.a
j=q.b.b.e5(t.mY.a(q.d),t.z)}catch(p){s=A.bk(p)
r=A.ca(p)
if(k.c&&t.v.a(k.b.a.c).a===s){q=k.a
q.c=t.v.a(k.b.a.c)}else{q=s
o=r
if(o==null)o=A.oh(q)
n=k.a
n.c=new A.ah(q,o)
q=n}q.b=!0
return}if(j instanceof A.K&&(j.a&24)!==0){if((j.a&16)!==0){q=k.a
q.c=t.v.a(j.c)
q.b=!0}return}if(j instanceof A.K){m=k.b.a
l=new A.K(m.b,m.$ti)
j.b7(new A.lh(l,m),new A.li(l),t.o)
q=k.a
q.c=l
q.b=!1}},
$S:0}
A.lh.prototype={
$1(a){this.a.eP(this.b)},
$S:17}
A.li.prototype={
$2(a,b){A.b4(a)
t.l.a(b)
this.a.aA(new A.ah(a,b))},
$S:34}
A.lf.prototype={
$0(){var s,r,q,p,o,n,m,l
try{q=this.a
p=q.a
o=p.$ti
n=o.c
m=n.a(this.b)
q.c=p.b.b.ct(o.i("2/(1)").a(p.d),m,o.i("2/"),n)}catch(l){s=A.bk(l)
r=A.ca(l)
q=s
p=r
if(p==null)p=A.oh(q)
o=this.a
o.c=new A.ah(q,p)
o.b=!0}},
$S:0}
A.le.prototype={
$0(){var s,r,q,p,o,n,m,l=this
try{s=t.v.a(l.a.a.c)
p=l.b
if(p.a.hS(s)&&p.a.e!=null){p.c=p.a.hz(s)
p.b=!1}}catch(o){r=A.bk(o)
q=A.ca(o)
p=t.v.a(l.a.a.c)
if(p.a===r){n=l.b
n.c=p
p=n}else{p=r
n=q
if(n==null)n=A.oh(p)
m=l.b
m.c=new A.ah(p,n)
p=m}p.b=!0}},
$S:0}
A.lj.prototype={
$0(){var s=A.qe()
this.a.aA(new A.ah(new A.kT("Future not completed",this.b),s))},
$S:0}
A.lk.prototype={
$1(a){var s
this.b.$ti.c.a(a)
s=this.a.a
if(s.b!=null){s.b2()
this.c.bg(a)}},
$S(){return this.b.$ti.i("ab(1)")}}
A.ll.prototype={
$2(a,b){var s
A.b4(a)
t.l.a(b)
s=this.a.a
if(s.b!=null){s.b2()
this.b.aA(new A.ah(a,b))}},
$S:34}
A.hH.prototype={}
A.dp.prototype={
gl(a){var s={},r=new A.K($.H,t.hy)
s.a=0
this.dT(new A.k7(s,this),!0,new A.k8(s,r),r.geN())
return r}}
A.k7.prototype={
$1(a){this.b.$ti.c.a(a);++this.a.a},
$S(){return this.b.$ti.i("~(1)")}}
A.k8.prototype={
$0(){this.b.bP(this.a.a)},
$S:0}
A.f_.prototype={
gfs(){var s,r=this
if((r.b&8)===0)return A.r(r).i("b2<1>?").a(r.a)
s=A.r(r)
return s.i("b2<1>?").a(s.i("f0<1>").a(r.a).gc1())},
eY(){var s,r,q=this
if((q.b&8)===0){s=q.a
if(s==null)s=q.a=new A.b2(A.r(q).i("b2<1>"))
return A.r(q).i("b2<1>").a(s)}r=A.r(q)
s=r.i("f0<1>").a(q.a).gc1()
return r.i("b2<1>").a(s)},
gfV(){var s=this.a
if((this.b&8)!==0)s=t.d3.a(s).gc1()
return A.r(this).i("cI<1>").a(s)},
eG(){if((this.b&4)!==0)return new A.c1("Cannot add event after closing")
return new A.c1("Cannot add event while adding a stream")},
fU(a,b,c,d){var s,r,q,p,o,n=this,m=A.r(n)
m.i("~(1)?").a(a)
t.jE.a(c)
if((n.b&3)!==0)throw A.e(A.cC("Stream has already been listened to."))
s=$.H
r=d?1:0
t.bm.G(m.c).i("1(2)").a(a)
A.v3(s,b)
t.M.a(c)
q=new A.cI(n,a,s,r|32,m.i("cI<1>"))
p=n.gfs()
if(((n.b|=1)&8)!==0){o=m.i("f0<1>").a(n.a)
o.sc1(q)
o.cs()}else n.a=q
q.fL(p)
q.bV(new A.ly(n))
return q},
fA(a){var s,r,q,p,o,n,m,l,k,j=this,i=A.r(j)
i.i("hn<1>").a(a)
s=null
if((j.b&8)!==0)s=i.i("f0<1>").a(j.a).b2()
j.a=null
j.b=j.b&4294967286|2
r=j.r
if(r!=null)if(s==null)try{q=r.$0()
if(q instanceof A.K)s=q}catch(n){p=A.bk(n)
o=A.ca(n)
m=new A.K($.H,t.cU)
i=A.b4(p)
l=t.l.a(o)
m.aV(new A.ah(i,l))
s=m}else s=s.ii(r)
i=new A.lx(j)
if(s!=null){l=s
t.mY.a(i)
k=l.$ti
m=new A.K($.H,k)
l.aT(new A.b1(m,8,i,null,k.i("b1<1,1>")))
s=m}else i.$0()
return s},
$iqA:1,
$icK:1}
A.ly.prototype={
$0(){A.oR(this.a.d)},
$S:0}
A.lx.prototype={
$0(){},
$S:0}
A.hI.prototype={
bZ(a){var s=this.$ti
s.c.a(a)
this.gfV().ew(new A.cJ(a,s.i("cJ<1>")))}}
A.du.prototype={}
A.dy.prototype={
gR(a){return(A.dm(this.a)^892482866)>>>0},
B(a,b){if(b==null)return!1
if(this===b)return!0
return b instanceof A.dy&&b.a===this.a}}
A.cI.prototype={
fk(){return this.w.fA(this)},
bl(){var s=this.w,r=A.r(s)
r.i("hn<1>").a(this)
if((s.b&8)!==0)r.i("f0<1>").a(s.a).dZ()
A.oR(s.e)},
bm(){var s=this.w,r=A.r(s)
r.i("hn<1>").a(this)
if((s.b&8)!==0)r.i("f0<1>").a(s.a).cs()
A.oR(s.f)}}
A.dv.prototype={
fL(a){var s=this
A.r(s).i("b2<1>?").a(a)
if(a==null)return
s.r=a
if(a.c!=null){s.e=(s.e|128)>>>0
a.bc(s)}},
dZ(){var s,r,q=this,p=q.e
if((p&8)!==0)return
s=(p+256|4)>>>0
q.e=s
if(p<256){r=q.r
if(r!=null)if(r.a===1)r.a=3}if((p&4)===0&&(s&64)===0)q.bV(q.gd7())},
cs(){var s=this,r=s.e
if((r&8)!==0)return
if(r>=256){r=s.e=r-256
if(r<256)if((r&128)!==0&&s.r.c!=null)s.r.bc(s)
else{r=(r&4294967291)>>>0
s.e=r
if((r&64)===0)s.bV(s.gd8())}}},
bl(){},
bm(){},
ew(a){var s,r=this,q=r.r
if(q==null)q=r.r=new A.b2(A.r(r).i("b2<1>"))
q.k(0,a)
s=r.e
if((s&128)===0){s=(s|128)>>>0
r.e=s
if(s<256)q.bc(r)}},
bZ(a){var s,r=this,q=A.r(r).c
q.a(a)
s=r.e
r.e=(s|64)>>>0
r.d.i6(r.a,a,q)
r.e=(r.e&4294967231)>>>0
r.cR((s&4)!==0)},
bV(a){var s,r=this
t.M.a(a)
s=r.e
r.e=(s|64)>>>0
a.$0()
r.e=(r.e&4294967231)>>>0
r.cR((s&4)!==0)},
cR(a){var s,r,q=this,p=q.e
if((p&128)!==0&&q.r.c==null){p=q.e=(p&4294967167)>>>0
s=!1
if((p&4)!==0)if(p<256){s=q.r
s=s==null?null:s.c==null
s=s!==!1}if(s){p=(p&4294967291)>>>0
q.e=p}}for(;;a=r){if((p&8)!==0){q.r=null
return}r=(p&4)!==0
if(a===r)break
q.e=(p^64)>>>0
if(r)q.bl()
else q.bm()
p=(q.e&4294967231)>>>0
q.e=p}if((p&128)!==0&&p<256)q.r.bc(q)},
$ihn:1,
$icK:1}
A.f1.prototype={
dT(a,b,c,d){var s=this.$ti
s.i("~(1)?").a(a)
t.jE.a(c)
return this.a.fU(s.i("~(1)?").a(a),d,c,!0)}}
A.eO.prototype={}
A.cJ.prototype={}
A.b2.prototype={
bc(a){var s,r=this
r.$ti.i("cK<1>").a(a)
s=r.a
if(s===1)return
if(s>=1){r.a=1
return}A.xx(new A.lt(r,a))
r.a=1},
k(a,b){var s=this,r=s.c
if(r==null)s.b=s.c=b
else s.c=r.a=b}}
A.lt.prototype={
$0(){var s,r,q,p=this.a,o=p.a
p.a=0
if(o===3)return
s=p.$ti.i("cK<1>").a(this.b)
r=p.b
q=r.a
p.b=q
if(q==null)p.c=null
A.r(r).i("cK<1>").a(s).bZ(r.b)},
$S:0}
A.cR.prototype={
gp(){var s=this
if(s.c)return s.$ti.c.a(s.b)
return s.$ti.c.a(null)},
n(){var s,r=this,q=r.a
if(q!=null){if(r.c){s=new A.K($.H,t.k)
r.b=s
r.c=!1
q.cs()
return s}throw A.e(A.cC("Already waiting for next."))}return r.f8()},
f8(){var s,r,q=this,p=q.b
if(p!=null){q.$ti.i("dp<1>").a(p)
s=new A.K($.H,t.k)
q.b=s
r=p.dT(q.gfl(),!0,q.gfn(),q.gfp())
if(q.b!=null)q.a=r
return s}return $.rl()},
b2(){var s,r,q=this,p=q.a,o=q.b
q.b=null
if(p!=null){q.a=null
if(!q.c)t.k.a(o).aU(!1)
else q.c=!1
s=p.e=(p.e&4294967279)>>>0
if((s&8)===0){s=p.e=(s|8)>>>0
if((s&128)!==0){r=p.r
if(r.a===1)r.a=3}if((s&64)===0)p.r=null
p.f=p.fk()}s=p.f
return s==null?$.pc():s}return $.pc()},
fm(a){var s,r,q=this
q.$ti.c.a(a)
if(q.a==null)return
s=t.k.a(q.b)
q.b=a
q.c=!0
s.bP(!0)
if(q.c){r=q.a
if(r!=null)r.dZ()}},
fq(a,b){var s,r,q=this
A.b4(a)
t.l.a(b)
s=q.a
r=t.k.a(q.b)
q.b=q.a=null
if(s!=null)r.aA(new A.ah(a,b))
else r.aV(new A.ah(a,b))},
fo(){var s=this,r=s.a,q=t.k.a(s.b)
s.b=s.a=null
if(r!=null)q.bg(!1)
else q.cO(!1)}}
A.f9.prototype={$iqp:1}
A.i7.prototype={
i5(a){var s,r,q
t.M.a(a)
try{if(B.f===$.H){a.$0()
return}A.qY(null,null,this,a,t.o)}catch(q){s=A.bk(q)
r=A.ca(q)
A.ih(A.b4(s),t.l.a(r))}},
i6(a,b,c){var s,r,q
c.i("~(0)").a(a)
c.a(b)
try{if(B.f===$.H){a.$1(b)
return}A.qZ(null,null,this,a,b,t.o,c)}catch(q){s=A.bk(q)
r=A.ca(q)
A.ih(A.b4(s),t.l.a(r))}},
c9(a){return new A.lw(this,t.M.a(a))},
e5(a,b){b.i("0()").a(a)
if($.H===B.f)return a.$0()
return A.qY(null,null,this,a,b)},
ct(a,b,c,d){c.i("@<0>").G(d).i("1(2)").a(a)
d.a(b)
if($.H===B.f)return a.$1(b)
return A.qZ(null,null,this,a,b,c,d)},
i4(a,b,c,d,e,f){d.i("@<0>").G(e).G(f).i("1(2,3)").a(a)
e.a(b)
f.a(c)
if($.H===B.f)return a.$2(b,c)
return A.ww(null,null,this,a,b,c,d,e,f)},
cq(a,b,c,d){return b.i("@<0>").G(c).G(d).i("1(2,3)").a(a)}}
A.lw.prototype={
$0(){return this.a.i5(this.b)},
$S:0}
A.no.prototype={
$0(){A.tx(this.a,this.b)},
$S:0}
A.cO.prototype={
gt(a){var s=this,r=new A.cP(s,s.r,A.r(s).i("cP<1>"))
r.c=s.e
return r},
gl(a){return this.a},
gA(a){return this.a===0},
gI(a){return this.a!==0},
u(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.nF.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.nF.a(r[b])!=null}else return this.eS(b)},
eS(a){var s=this.d
if(s==null)return!1
return this.cY(s[this.cS(a)],a)>=0},
gv(a){var s=this.e
if(s==null)throw A.e(A.cC("No elements"))
return A.r(this).c.a(s.a)},
k(a,b){var s,r,q=this
A.r(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.cL(s==null?q.b=A.oC():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.cL(r==null?q.c=A.oC():r,b)}else return q.el(b)},
el(a){var s,r,q,p=this
A.r(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.oC()
r=p.cS(a)
q=s[r]
if(q==null)s[r]=[p.bX(a)]
else{if(p.cY(q,a)>=0)return!1
q.push(p.bX(a))}return!0},
cL(a,b){A.r(this).c.a(b)
if(t.nF.a(a[b])!=null)return!1
a[b]=this.bX(b)
return!0},
bX(a){var s=this,r=new A.i3(A.r(s).c.a(a))
if(s.e==null)s.e=s.f=r
else s.f=s.f.b=r;++s.a
s.r=s.r+1&1073741823
return r},
cS(a){return J.b6(a)&1073741823},
cY(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.l(a[r].a,b))return r
return-1}}
A.i3.prototype={}
A.cP.prototype={
gp(){var s=this.d
return s==null?this.$ti.c.a(s):s},
n(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.e(A.a6(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.i("1?").a(r.a)
s.c=r.b
return!0}},
$iI:1}
A.y.prototype={
gt(a){return new A.X(a,this.gl(a),A.aa(a).i("X<y.E>"))},
M(a,b){return this.h(a,b)},
Y(a,b){var s,r
A.aa(a).i("~(y.E)").a(b)
s=this.gl(a)
for(r=0;r<s;++r){b.$1(this.h(a,r))
if(s!==this.gl(a))throw A.e(A.a6(a))}},
gA(a){return this.gl(a)===0},
gI(a){return!this.gA(a)},
gv(a){if(this.gl(a)===0)throw A.e(A.aE())
return this.h(a,0)},
gS(a){if(this.gl(a)===0)throw A.e(A.aE())
return this.h(a,this.gl(a)-1)},
u(a,b){var s,r=this.gl(a)
for(s=0;s<r;++s){if(J.l(this.h(a,s),b))return!0
if(r!==this.gl(a))throw A.e(A.a6(a))}return!1},
aj(a,b){var s,r
A.aa(a).i("B(y.E)").a(b)
s=this.gl(a)
for(r=0;r<s;++r){if(!b.$1(this.h(a,r)))return!1
if(s!==this.gl(a))throw A.e(A.a6(a))}return!0},
cw(a,b){return new A.bE(a,b.i("bE<0>"))},
aL(a,b,c){var s=A.aa(a)
return new A.an(a,s.G(c).i("1(y.E)").a(b),s.i("@<y.E>").G(c).i("an<1,2>"))},
T(a,b){return A.cD(a,b,null,A.aa(a).i("y.E"))},
e6(a,b){return A.cD(a,0,A.fe(b,"count",t.S),A.aa(a).i("y.E"))},
e9(a){var s,r=A.pY(A.aa(a).i("y.E"))
for(s=0;s<this.gl(a);++s)r.k(0,this.h(a,s))
return r},
k(a,b){var s
A.aa(a).i("y.E").a(b)
s=this.gl(a)
this.sl(a,s+1)
this.m(a,s,b)},
bu(a,b){return new A.bn(a,A.aa(a).i("@<y.E>").G(b).i("bn<1,2>"))},
H(a,b,c){var s,r=this.gl(a)
if(c==null)c=r
A.az(b,c,r)
s=A.a3(this.bb(a,b,c),A.aa(a).i("y.E"))
return s},
a1(a,b){return this.H(a,b,null)},
bb(a,b,c){A.az(b,c,this.gl(a))
return A.cD(a,b,c,A.aa(a).i("y.E"))},
by(a,b,c,d){var s
A.aa(a).i("y.E?").a(d)
A.az(b,c,this.gl(a))
for(s=b;s<c;++s)this.m(a,s,d)},
a5(a,b,c,d,e){var s,r,q,p,o
A.aa(a).i("f<y.E>").a(d)
A.az(b,c,this.gl(a))
s=c-b
if(s===0)return
A.ap(e,"skipCount")
if(t.j.b(d)){r=e
q=d}else{q=J.cV(d,e).aM(0,!1)
r=0}p=J.q(q)
if(r+s>p.gl(q))throw A.e(A.pM())
if(r<b)for(o=s-1;o>=0;--o)this.m(a,b+o,p.h(q,r+o))
else for(o=0;o<s;++o)this.m(a,b+o,p.h(q,r+o))},
Z(a,b,c,d){return this.a5(a,b,c,d,0)},
aK(a,b,c){var s
if(c<0)c=0
for(s=c;s<this.gl(a);++s)if(J.l(this.h(a,s),b))return s
return-1},
bG(a,b,c){var s,r
A.aa(a).i("f<y.E>").a(c)
if(t.j.b(c))this.Z(a,b,b+c.length,c)
else for(s=J.G(c);s.n();b=r){r=b+1
this.m(a,b,s.gp())}},
q(a){return A.ol(a,"[","]")},
$ix:1,
$if:1,
$ij:1}
A.O.prototype={
bv(a,b,c){var s=A.r(this)
return A.q_(this,s.i("O.K"),s.i("O.V"),b,c)},
Y(a,b){var s,r,q,p=A.r(this)
p.i("~(O.K,O.V)").a(b)
for(s=this.ga2(),s=s.gt(s),p=p.i("O.V");s.n();){r=s.gp()
q=this.h(0,r)
b.$2(r,q==null?p.a(q):q)}},
gah(){return this.ga2().aL(0,new A.jw(this),A.r(this).i("a8<O.K,O.V>"))},
J(a){return this.ga2().u(0,a)},
gl(a){var s=this.ga2()
return s.gl(s)},
gA(a){var s=this.ga2()
return s.gA(s)},
gI(a){var s=this.ga2()
return s.gI(s)},
gaE(){return new A.eR(this,A.r(this).i("eR<O.K,O.V>"))},
q(a){return A.os(this)},
$iR:1}
A.jw.prototype={
$1(a){var s=this.a,r=A.r(s)
r.i("O.K").a(a)
s=s.h(0,a)
if(s==null)s=r.i("O.V").a(s)
return new A.a8(a,s,r.i("a8<O.K,O.V>"))},
$S(){return A.r(this.a).i("a8<O.K,O.V>(O.K)")}}
A.jx.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.t(a)
r.a=(r.a+=s)+": "
s=A.t(b)
r.a+=s},
$S:24}
A.eR.prototype={
gl(a){var s=this.a
return s.gl(s)},
gA(a){var s=this.a
return s.gA(s)},
gI(a){var s=this.a
return s.gI(s)},
gv(a){var s=this.a,r=s.ga2()
r=s.h(0,r.gv(r))
return r==null?this.$ti.y[1].a(r):r},
gt(a){var s=this.a,r=s.ga2()
return new A.eS(r.gt(r),s,this.$ti.i("eS<1,2>"))}}
A.eS.prototype={
n(){var s=this,r=s.a
if(r.n()){s.c=s.b.h(0,r.gp())
return!0}s.c=null
return!1},
gp(){var s=this.c
return s==null?this.$ti.y[1].a(s):s},
$iI:1}
A.bx.prototype={
gA(a){return this.gl(this)===0},
gI(a){return this.gl(this)!==0},
q(a){return A.ol(this,"{","}")},
T(a,b){return A.qd(this,b,A.r(this).c)},
gv(a){var s=this.gt(this)
if(!s.n())throw A.e(A.aE())
return s.gp()},
M(a,b){var s,r
A.ap(b,"index")
s=this.gt(this)
for(r=b;s.n();){if(r===0)return s.gp();--r}throw A.e(A.jl(b,b-r,this,"index"))},
$ix:1,
$if:1,
$ic0:1}
A.eY.prototype={}
A.i0.prototype={
h(a,b){var s,r=this.b
if(r==null)return this.c.h(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.fw(b):s}},
gl(a){return this.b==null?this.c.a:this.aW().length},
gA(a){return this.gl(0)===0},
gI(a){return this.gl(0)>0},
ga2(){if(this.b==null){var s=this.c
return new A.am(s,A.r(s).i("am<1>"))}return new A.i1(this)},
gaE(){var s,r=this
if(r.b==null){s=r.c
return new A.aY(s,A.r(s).i("aY<2>"))}return A.q0(r.aW(),new A.lo(r),t.N,t.z)},
J(a){if(this.b==null)return this.c.J(a)
if(typeof a!="string")return!1
return Object.prototype.hasOwnProperty.call(this.a,a)},
Y(a,b){var s,r,q,p,o=this
t.jR.a(b)
if(o.b==null)return o.c.Y(0,b)
s=o.aW()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.lS(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.e(A.a6(o))}},
aW(){var s=t.g.a(this.c)
if(s==null)s=this.c=A.b(Object.keys(this.a),t.s)
return s},
fw(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.lS(this.a[a])
return this.b[a]=s}}
A.lo.prototype={
$1(a){return this.a.h(0,A.Y(a))},
$S:27}
A.i1.prototype={
gl(a){return this.a.gl(0)},
M(a,b){var s=this.a
if(s.b==null)s=s.ga2().M(0,b)
else{s=s.aW()
if(!(b>=0&&b<s.length))return A.a(s,b)
s=s[b]}return s},
gt(a){var s=this.a
if(s.b==null){s=s.ga2()
s=s.gt(s)}else{s=s.aW()
s=new J.aT(s,s.length,A.L(s).i("aT<1>"))}return s},
u(a,b){return this.a.J(b)}}
A.lE.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:true})
return s}catch(r){}return null},
$S:33}
A.lD.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:false})
return s}catch(r){}return null},
$S:33}
A.d3.prototype={}
A.fA.prototype={}
A.fI.prototype={}
A.ef.prototype={
q(a){var s=A.fJ(this.a)
return(this.b!=null?"Converting object to an encodable object failed:":"Converting object did not return an encodable object:")+" "+s}}
A.fY.prototype={
q(a){return"Cyclic error in JSON stringify"}}
A.fX.prototype={
dN(a,b){var s=A.wq(a,this.ghl().a)
return s},
a9(a,b){var s=A.va(a,this.ghp().b,null)
return s},
ho(a){return this.a9(a,null)},
ghp(){return B.aS},
ghl(){return B.aR}}
A.jq.prototype={}
A.jp.prototype={}
A.lq.prototype={
eb(a){var s,r,q,p,o,n,m=a.length
for(s=this.c,r=0,q=0;q<m;++q){p=a.charCodeAt(q)
if(p>92){if(p>=55296){o=p&64512
if(o===55296){n=q+1
n=!(n<m&&(a.charCodeAt(n)&64512)===56320)}else n=!1
if(!n)if(o===56320){o=q-1
o=!(o>=0&&(a.charCodeAt(o)&64512)===55296)}else o=!1
else o=!0
if(o){if(q>r)s.a+=B.d.a6(a,r,q)
r=q+1
o=A.S(92)
s.a+=o
o=A.S(117)
s.a+=o
o=A.S(100)
s.a+=o
o=p>>>8&15
o=A.S(o<10?48+o:87+o)
s.a+=o
o=p>>>4&15
o=A.S(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.S(o<10?48+o:87+o)
s.a+=o}}continue}if(p<32){if(q>r)s.a+=B.d.a6(a,r,q)
r=q+1
o=A.S(92)
s.a+=o
switch(p){case 8:o=A.S(98)
s.a+=o
break
case 9:o=A.S(116)
s.a+=o
break
case 10:o=A.S(110)
s.a+=o
break
case 12:o=A.S(102)
s.a+=o
break
case 13:o=A.S(114)
s.a+=o
break
default:o=A.S(117)
s.a+=o
o=A.S(48)
s.a=(s.a+=o)+o
o=p>>>4&15
o=A.S(o<10?48+o:87+o)
s.a+=o
o=p&15
o=A.S(o<10?48+o:87+o)
s.a+=o
break}}else if(p===34||p===92){if(q>r)s.a+=B.d.a6(a,r,q)
r=q+1
o=A.S(92)
s.a+=o
o=A.S(p)
s.a+=o}}if(r===0)s.a+=a
else if(r<m)s.a+=B.d.a6(a,r,m)},
bO(a){var s,r,q,p
for(s=this.a,r=s.length,q=0;q<r;++q){p=s[q]
if(a==null?p==null:a===p)throw A.e(new A.fY(a,null))}B.a.k(s,a)},
bE(a){var s,r,q,p,o=this
if(o.ea(a))return
o.bO(a)
try{s=o.b.$1(a)
if(!o.ea(s)){q=A.pT(a,null,o.gda())
throw A.e(q)}q=o.a
if(0>=q.length)return A.a(q,-1)
q.pop()}catch(p){r=A.bk(p)
q=A.pT(a,r,o.gda())
throw A.e(q)}},
ea(a){var s,r,q=this
if(typeof a=="number"){if(!isFinite(a))return!1
q.c.a+=B.c.q(a)
return!0}else if(a===!0){q.c.a+="true"
return!0}else if(a===!1){q.c.a+="false"
return!0}else if(a==null){q.c.a+="null"
return!0}else if(typeof a=="string"){s=q.c
s.a+='"'
q.eb(a)
s.a+='"'
return!0}else if(t.j.b(a)){q.bO(a)
q.ij(a)
s=q.a
if(0>=s.length)return A.a(s,-1)
s.pop()
return!0}else if(t.f.b(a)){q.bO(a)
r=q.ik(a)
s=q.a
if(0>=s.length)return A.a(s,-1)
s.pop()
return r}else return!1},
ij(a){var s,r,q=this.c
q.a+="["
s=J.q(a)
if(s.gI(a)){this.bE(s.h(a,0))
for(r=1;r<s.gl(a);++r){q.a+=","
this.bE(s.h(a,r))}}q.a+="]"},
ik(a){var s,r,q,p,o,n,m=this,l={}
if(a.gA(a)){m.c.a+="{}"
return!0}s=a.gl(a)*2
r=A.T(s,null,!1,t.O)
q=l.a=0
l.b=!0
a.Y(0,new A.lr(l,r))
if(!l.b)return!1
p=m.c
p.a+="{"
for(o='"';q<s;q+=2,o=',"'){p.a+=o
m.eb(A.Y(r[q]))
p.a+='":'
n=q+1
if(!(n<s))return A.a(r,n)
m.bE(r[n])}p.a+="}"
return!0}}
A.lr.prototype={
$2(a,b){var s,r
if(typeof a!="string")this.a.b=!1
s=this.b
r=this.a
B.a.m(s,r.a++,a)
B.a.m(s,r.a++,b)},
$S:24}
A.lp.prototype={
gda(){var s=this.c.a
return s.charCodeAt(0)==0?s:s}}
A.hE.prototype={
dM(a){t.L.a(a)
return B.dx.cc(a)}}
A.kY.prototype={
cc(a){var s,r,q,p=a.length,o=A.az(0,null,p)
if(o===0)return new Uint8Array(0)
s=new Uint8Array(o*3)
r=new A.lF(s)
if(r.f0(a,0,o)!==o){q=o-1
if(!(q>=0&&q<p))return A.a(a,q)
r.c2()}return B.j.H(s,0,r.b)}}
A.lF.prototype={
c2(){var s,r=this,q=r.c,p=r.b,o=r.b=p+1
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
h6(a,b){var s,r,q,p,o,n=this
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
return!0}else{n.c2()
return!1}},
f0(a,b,c){var s,r,q,p,o,n,m,l,k=this
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
if(k.h6(n,a.charCodeAt(m)))o=m}else if(m===56320){if(k.b+3>q)break
k.c2()}else if(n<=2047){m=k.b
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
A.kX.prototype={
cc(a){return new A.id(this.a).cT(t.L.a(a),0,null,!0)}}
A.id.prototype={
cT(a,b,c,d){var s,r,q,p,o,n,m,l=this
t.L.a(a)
s=A.az(b,c,a.length)
if(b===s)return""
if(a instanceof Uint8Array){r=a
q=r
p=0}else{q=A.vx(a,b,s)
s-=b
p=b
b=0}if(s-b>=15){o=l.a
n=A.vw(o,q,b,s)
if(n!=null){if(!o)return n
if(n.indexOf("\ufffd")<0)return n}}n=l.bQ(q,b,s,!0)
o=l.b
if((o&1)!==0){m=A.vy(o)
l.b=0
throw A.e(A.iZ(m,a,p+l.c))}return n},
bQ(a,b,c,d){var s,r,q=this
if(c-b>1000){s=B.b.O(b+c,2)
r=q.bQ(a,b,s,!1)
if((q.b&1)!==0)return r
return r+q.bQ(a,s,c,d)}return q.hk(a,b,c,d)},
hk(a,b,a0,a1){var s,r,q,p,o,n,m,l,k=this,j="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFFFFFFFFFFFFFFFFGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHIHHHJEEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBKCCCCCCCCCCCCDCLONNNMEEEEEEEEEEE",i=" \x000:XECCCCCN:lDb \x000:XECCCCCNvlDb \x000:XECCCCCN:lDb AAAAA\x00\x00\x00\x00\x00AAAAA00000AAAAA:::::AAAAAGG000AAAAA00KKKAAAAAG::::AAAAA:IIIIAAAAA000\x800AAAAA\x00\x00\x00\x00 AAAAA",h=65533,g=k.b,f=k.c,e=new A.be(""),d=b+1,c=a.length
if(!(b>=0&&b<c))return A.a(a,b)
s=a[b]
A:for(r=k.a;;){for(;;d=o){if(!(s>=0&&s<256))return A.a(j,s)
q=j.charCodeAt(s)&31
f=g<=32?s&61694>>>q:(s&63|f<<6)>>>0
p=g+q
if(!(p>=0&&p<144))return A.a(i,p)
g=i.charCodeAt(p)
if(g===0){p=A.S(f)
e.a+=p
if(d===a0)break A
break}else if((g&1)!==0){if(r)switch(g){case 69:case 67:p=A.S(h)
e.a+=p
break
case 65:p=A.S(h)
e.a+=p;--d
break
default:p=A.S(h)
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
p=A.S(a[l])
e.a+=p}else{p=A.k9(a,d,n)
e.a+=p}if(n===a0)break A
d=o}else d=o}if(a1&&g>32)if(r){c=A.S(h)
e.a+=c}else{k.b=77
k.c=a0
return""}k.b=g
k.c=f
c=e.a
return c.charCodeAt(0)==0?c:c}}
A.b9.prototype={
B(a,b){if(b==null)return!1
return b instanceof A.b9&&this.a===b.a},
gR(a){return B.b.gR(this.a)},
ab(a,b){return B.b.ab(this.a,t.jS.a(b).a)},
q(a){var s,r,q,p=this.a,o=p%36e8,n=B.b.O(o,6e7)
o%=6e7
s=n<10?"0":""
r=B.b.O(o,1e6)
q=r<10?"0":""
return""+(p/36e8|0)+":"+s+n+":"+q+r+"."+B.d.dY(B.b.q(o%1e6),6,"0")},
$iaV:1}
A.hP.prototype={
q(a){return this.al()},
$ibq:1}
A.V.prototype={
gaR(){return A.ur(this)}}
A.fl.prototype={
q(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.fJ(s)
return"Assertion failed"}}
A.bB.prototype={}
A.aS.prototype={
gbS(){return"Invalid argument"+(!this.a?"(s)":"")},
gbR(){return""},
q(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+A.t(p),n=s.gbS()+q+o
if(!s.a)return n
return n+s.gbR()+": "+A.fJ(s.gcl())},
gcl(){return this.b}}
A.ev.prototype={
gcl(){return A.ie(this.b)},
gbS(){return"RangeError"},
gbR(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.t(q):""
else if(q==null)s=": Not greater than or equal to "+A.t(r)
else if(q>r)s=": Not in inclusive range "+A.t(r)+".."+A.t(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.t(r)
return s}}
A.fR.prototype={
gcl(){return A.E(this.b)},
gbS(){return"RangeError"},
gbR(){if(A.E(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
gl(a){return this.f}}
A.eI.prototype={
q(a){return"Unsupported operation: "+this.a}}
A.hC.prototype={
q(a){return"UnimplementedError: "+this.a}}
A.c1.prototype={
q(a){return"Bad state: "+this.a}}
A.fw.prototype={
q(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.fJ(s)+"."}}
A.h8.prototype={
q(a){return"Out of Memory"},
gaR(){return null},
$iV:1}
A.eD.prototype={
q(a){return"Stack Overflow"},
gaR(){return null},
$iV:1}
A.l6.prototype={
q(a){return"Exception: "+this.a}}
A.e7.prototype={
q(a){var s,r,q,p,o,n,m,l,k,j,i,h=this.a,g=""!==h?"FormatException: "+h:"FormatException",f=this.c,e=this.b
if(typeof e=="string"){if(f!=null)s=f<0||f>e.length
else s=!1
if(s)f=null
if(f==null){if(e.length>78)e=B.d.a6(e,0,75)+"..."
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
k=""}return g+l+B.d.a6(e,i,j)+k+"\n"+B.d.aP(" ",f-i+l.length)+"^\n"}else return f!=null?g+(" (at offset "+A.t(f)+")"):g}}
A.f.prototype={
bu(a,b){return A.dW(this,A.r(this).i("f.E"),b)},
aL(a,b,c){var s=A.r(this)
return A.q0(this,s.G(c).i("1(f.E)").a(b),s.i("f.E"),c)},
cw(a,b){return new A.bE(this,b.i("bE<0>"))},
u(a,b){var s
for(s=this.gt(this);s.n();)if(J.l(s.gp(),b))return!0
return!1},
Y(a,b){var s
A.r(this).i("~(f.E)").a(b)
for(s=this.gt(this);s.n();)b.$1(s.gp())},
aj(a,b){var s
A.r(this).i("B(f.E)").a(b)
for(s=this.gt(this);s.n();)if(!b.$1(s.gp()))return!1
return!0},
ac(a,b){var s,r,q=this.gt(this)
if(!q.n())return""
s=J.b7(q.gp())
if(!q.n())return s
if(b.length===0){r=s
do r+=J.b7(q.gp())
while(q.n())}else{r=s
do r=r+b+J.b7(q.gp())
while(q.n())}return r.charCodeAt(0)==0?r:r},
b1(a,b){var s
A.r(this).i("B(f.E)").a(b)
for(s=this.gt(this);s.n();)if(b.$1(s.gp()))return!0
return!1},
aM(a,b){var s=A.r(this).i("f.E")
if(b)s=A.a3(this,s)
else{s=A.a3(this,s)
s.$flags=1
s=s}return s},
e8(a){return this.aM(0,!0)},
gl(a){var s,r=this.gt(this)
for(s=0;r.n();)++s
return s},
gA(a){return!this.gt(this).n()},
gI(a){return!this.gA(this)},
T(a,b){return A.qd(this,b,A.r(this).i("f.E"))},
gv(a){var s=this.gt(this)
if(!s.n())throw A.e(A.aE())
return s.gp()},
M(a,b){var s,r
A.ap(b,"index")
s=this.gt(this)
for(r=b;s.n();){if(r===0)return s.gp();--r}throw A.e(A.jl(b,b-r,this,"index"))},
q(a){return A.u0(this,"(",")")}}
A.a8.prototype={
q(a){return"MapEntry("+A.t(this.a)+": "+A.t(this.b)+")"}}
A.ab.prototype={
gR(a){return A.o.prototype.gR.call(this,0)},
q(a){return"null"}}
A.o.prototype={$io:1,
B(a,b){return this===b},
gR(a){return A.dm(this)},
q(a){return"Instance of '"+A.he(this)+"'"},
gV(a){return A.x1(this)},
toString(){return this.q(this)}}
A.ia.prototype={
q(a){return""},
$ib0:1}
A.c_.prototype={
gt(a){return new A.dn(this.a)}}
A.dn.prototype={
gp(){return this.d},
n(){var s,r,q,p=this,o=p.b=p.c,n=p.a,m=n.length
if(o===m){p.d=-1
return!1}if(!(o<m))return A.a(n,o)
s=n.charCodeAt(o)
r=o+1
if((s&64512)===55296&&r<m){if(!(r<m))return A.a(n,r)
q=n.charCodeAt(r)
if((q&64512)===56320){p.c=r+1
p.d=A.vN(s,q)
return!0}}p.c=r
p.d=s
return!0},
$iI:1}
A.be.prototype={
gl(a){return this.a.length},
q(a){var s=this.a
return s.charCodeAt(0)==0?s:s},
$iuJ:1}
A.nl.prototype={
$0(){var s=v.G.performance
if(t.m.b(s))if(s.measure!=null&&s.mark!=null&&s.clearMeasures!=null&&s.clearMarks!=null)return s
return null},
$S:69}
A.m5.prototype={
$0(){var s=v.G.JSON
if(t.m.b(s))return s
throw A.e(A.ar("Missing JSON.parse() support"))},
$S:73}
A.jC.prototype={
q(a){return"Promise was rejected with a value of `"+(this.a?"undefined":"null")+"`."}}
A.nW.prototype={
$1(a){return this.a.ca(this.b.i("0/?").a(a))},
$S:20}
A.nX.prototype={
$1(a){if(a==null)return this.a.dK(new A.jC(a===undefined))
return this.a.dK(a)},
$S:20}
A.c4.prototype={
al(){return"TextAlign."+this.b}}
A.iQ.prototype={
$2(a,b){var s=t.dt
s=s.a(a).b-s.a(b).b
if(s>0)return 1
else if(s<0)return-1
return 0},
$S:81}
A.bI.prototype={}
A.bZ.prototype={
ghB(){var s,r,q,p,o,n,m,l,k,j,i=this.c
if(i==null){i=this.a.b6(1751474532)
s=i.b
if(!i.W(s,54))A.n(B.a_)
r=s+12
i.j(r,4)
q=i.a
p=q.getUint32(r,!1)
if(p!==1594834165)A.n(A.h("head.magicNumber is 0x"+B.b.b8(p,16)+", not 0x5F0F3CF5"))
r=s+18
i.j(r,2)
o=q.getUint16(r,!1)
if(o<16||o>16384)A.n(A.h("head.unitsPerEm "+o+" is outside the legal 16\u202616384"))
r=s+50
i.j(r,2)
n=q.getInt16(r,!1)
if(n!==0&&n!==1)A.n(A.h("head.indexToLocFormat "+n+" is neither short nor long"))
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
A.jg(i,s+20)
A.jg(i,s+28)
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
k=this.c=new A.fO(o,r,m,l,k,n)
i=k}return i},
gdI(){var s=this.e
return s==null?this.e=A.dZ(this.a.b6(1668112752)):s},
du(a,b){var s=this.a.b6(a),r=s.b+b
s.j(r,2)
return s.a.getUint16(r,!1)},
ghD(){var s,r=this
if(r.ay)return r.ax
r.ay=!0
s=r.a.bD(1213612370)
if(s==null)return null
return r.ax=A.tY(s)},
gcC(){var s=this.CW
return s==null?this.CW=this.bk(1196643650,A.x5(),t.b0):s},
gcB(){var s=this.cx
return s==null?this.cx=this.bk(1196445523,A.x4(),t.fA):s},
c5(a){var s,r,q,p,o,n=this,m=n.f
if(m==null){m=n.a.b6(1752003704)
s=n.du(1751672161,34)
r=n.d
m=n.f=A.tU(m,r==null?n.d=n.du(1835104368,4):r,s)}q=m.c5(a)
p=n.b
if(p==null)return q
o=n.ghD()
if(o==null)return q
return q+B.c.a3(o.hm(a,p))},
hW(a){var s,r=this
t.eM.a(a)
s=r.Q
if(s==null)s=r.Q=r.bk(1719034226,A.wY(),t.kH)
if(s==null)return B.ct
return s.hV(a,r.a.bD(1635148146))},
bk(a,b,c){var s
c.i("0(m)").a(b)
s=this.a.bD(a)
return s==null?null:b.$1(s)}}
A.hs.prototype={
q(a){return A.aB(this.a)+"@"+this.c+"+"+this.d},
gl(a){return this.d}}
A.k1.prototype={
bD(a){var s=this.c.h(0,a)
return s==null?null:new A.m(this.a.a,s.c)},
b6(a){var s=this.bD(a)
if(s==null)throw A.e(A.h("font has no "+A.aB(A.cE(a))+" table"))
return s}}
A.iJ.prototype={
gdR(){var s=this.d
return s.a===3&&s.b===0},
ad(a){var s,r
if(a<0)return 0
s=this.a
r=s.ad(a)
if(r!==0||!this.gdR())return r
if(a<=255)return s.ad(61440+a)
return 0},
q(a){var s=this.d,r=this.gdR()?", symbolic":""
return"CmapTable(platform "+s.a+", encoding "+s.b+", format "+s.d+r+")"}}
A.iK.prototype={
$2(a,b){var s=t.aq
s.a(a)
s.a(b)
return B.b.ab(a.gdh(),b.gdh())},
$S:39}
A.bo.prototype={
gdh(){var s,r,q,p,o,n,m,l,k,j,i,h=null,g=this.a,f=this.b
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
A.hS.prototype={
ad(a){var s
if(a>=0&&a<256){s=this.a
if(!(a>=0&&a<s.length))return A.a(s,a)
s=s[a]}else s=0
return s},
$idx:1}
A.hU.prototype={
ad(a){var s,r,q,p,o,n,m,l,k,j,i=this
if(a<0||a>65535)return 0
s=i.a
r=s.length
q=r-1
for(p=0,o=-1;p<=q;){n=B.b.L(p+q,1)
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
$idx:1}
A.hV.prototype={
ad(a){var s,r=a-this.a
if(r>=0&&r<this.b.length){s=this.b
if(!(r>=0&&r<s.length))return A.a(s,r)
s=s[r]}else s=0
return s},
$idx:1}
A.hT.prototype={
ad(a){var s,r,q,p,o,n=this,m=n.a,l=m.length,k=l-1
for(s=n.b,r=s.length,q=0;q<=k;){p=B.b.L(q+k,1)
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
$idx:1}
A.l7.prototype={}
A.fO.prototype={
q(a){var s=this,r=s.ay===0?"short":"long"
return"HeadTable(unitsPerEm: "+s.f+", loca: "+r+", bbox: "+s.x+" "+s.y+" "+s.z+" "+s.Q+")"}}
A.ji.prototype={
c5(a){var s,r,q
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
A.dT.prototype={
q(a){return A.t(this.a)+"\u2192"+A.t(this.b)}}
A.ip.prototype={
hQ(a,b,c){var s,r,q,p,o,n=this.b,m=n.length
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
return m+(c-n)/o*(q.b-m)}return B.a.gS(s).b}}
A.ds.prototype={
q(a){var s=this
return"VariationAxis("+A.aB(s.a)+" "+A.t(s.b)+"/"+A.t(s.c)+"/"+A.t(s.d)+")"}}
A.dj.prototype={
q(a){return"NamedInstance("+A.t(this.a)+")"}}
A.da.prototype={
hV(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g
t.eM.a(a)
s=this.a
r=s.length
q=A.T(r,0,!1,t.i)
for(p=0;p<r;++p){o=s[p]
n=a.h(0,A.aB(o.a))
if(n==null)n=o.c
m=o.b
l=o.d
k=B.c.D(n,m,l)
n=o.c
if(k<n){j=n-m
i=j>0?(k-n)/j:0}else if(k>n){j=l-n
i=j>0?(k-n)/j:0}else i=0
h=B.c.a0(i*16384)/16384
if(h<-1)n=-1
else n=h>1?1:h
B.a.m(q,p,n)}if(b!=null){g=A.t0(b)
for(p=0;p<r;++p){h=B.c.a0(g.hQ(0,p,q[p])*16384)/16384
if(h<-1)s=-1
else s=h>1?1:h
B.a.m(q,p,s)}}return q}}
A.j1.prototype={
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
return new A.ds(r,q/65536,p/65536,o/65536)},
$S:44}
A.j2.prototype={
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
o=J.aN(p,t.i)
for(q=j+4,n=0;n<p;++n){m=q+n*4
if(m>=0)l=m+4<=r.byteLength
else l=!1
if(!l)A.n(A.h("read of 4 byte(s) at "+m+" overruns a "+s.gl(0)+"-byte font"))
o[n]=r.getInt32(m,!1)/65536}return new A.dj(o)},
$S:46}
A.i6.prototype={
ed(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
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
A.i_.prototype={}
A.iP.prototype={
gl(a){return this.c},
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
if(!k)A.n(A.h("read of 1 byte(s) at "+l+" overruns a "+p.gl(0)+"-byte font"))
n=(n<<8|o.getUint8(l))>>>0}s=j.e
return new A.z(B.b.bo(n,s),(n&B.b.ag(1,s)-1)>>>0)}}
A.fT.prototype={
cd(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e="read of 2 byte(s) at "
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
if(!h)A.n(A.h("read of 4 byte(s) at "+p+" overruns a "+n.gl(0)+"-byte font"))
g=k.getInt32(p,!1)
p+=4}else{if(p>=0)h=p+2<=k.byteLength
else h=!1
if(!h)A.n(A.h(e+p+" overruns a "+n.gl(0)+"-byte font"))
g=k.getInt16(p,!1)
p+=2}else if(m){if(p>=0)h=p+2<=k.byteLength
else h=!1
if(!h)A.n(A.h(e+p+" overruns a "+n.gl(0)+"-byte font"))
g=k.getInt16(p,!1)
p+=2}else{if(p>=0)h=p+1<=k.byteLength
else h=!1
if(!h)A.n(A.h("read of 1 byte(s) at "+p+" overruns a "+n.gl(0)+"-byte font"))
g=k.getInt8(p);++p}if(g===0)continue
h=s[i]
if(!(h<o.length))return A.a(o,h)
f=o[h].ed(c)
if(f!==0)j+=g*f}return j},
hm(a,b){var s,r
t.H.a(b)
s=this.d
if(s==null)return this.cd(0,a,b)
r=s.h(0,a)
return this.cd(r.a,r.b,b)}}
A.jm.prototype={
$1(a){var s,r=this.a,q=this.b+6+a*2
r.j(q,2)
s=r.a.getUint16(q,!1)
if(s>=this.c.length)throw A.e(A.h("region index "+s+" out of range"))
return s},
$S:14}
A.bL.prototype={}
A.hJ.prototype={
P(a){return 0}}
A.hK.prototype={
P(a){var s,r=a-this.a
if(r>=0&&r<this.b.length){s=this.b
if(!(r>=0&&r<s.length))return A.a(s,r)
s=s[r]}else s=0
return s}}
A.hL.prototype={
P(a){var s,r,q,p,o=this.a,n=o.length,m=(n/3|0)-1
for(s=0;s<=m;){r=B.b.L(s+m,1)
q=r*3
if(!(q<n))return A.a(o,q)
if(a<o[q])m=r-1
else{p=q+1
if(!(p<n))return A.a(o,p)
if(a>o[p])s=r+1
else{p=q+2
if(!(p<n))return A.a(o,p)
return o[p]}}}return 0}}
A.fD.prototype={
ig(a){var s,r,q,p,o,n,m,l,k=this,j=k.c
if(j===32768)return 0
s=k.a
if(a<s||a>k.b)return 0
r=B.b.ag(1,j)
q=B.b.a7(16,r)
p=a-s
o=B.b.a7(p,q)
j=k.d
s=j.length
if(o>=s)return 0
n=B.b.X(p,q)
m=B.b.ag(1,r)
if(!(o>=0))return A.a(j,o)
l=B.b.c_(j[o],16-r*(n+1))&m-1
return l>=B.b.ae(1,r-1)?l-m:l},
q(a){var s=this.c,r=""+this.a,q=""+this.b
return s===32768?"VariationIndex("+r+"/"+q+")":"Device("+r+"\u2026"+q+", fmt "+s+")"}}
A.cW.prototype={
q(a){return"Anchor("+this.a+","+this.b+")"}}
A.bp.prototype={}
A.hN.prototype={
E(a){var s,r,q,p=this.a,o=p.length,n=o-1
for(s=0;s<=n;){r=B.b.L(s+n,1)
if(!(r<o))return A.a(p,r)
q=p[r]
if(a<q)n=r-1
else if(a>q)s=r+1
else return r}return-1}}
A.hO.prototype={
E(a){var s,r,q,p,o,n=this.a,m=n.length,l=(m/3|0)-1
for(s=0;s<=l;){r=B.b.L(s+l,1)
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
A.db.prototype={
hJ(a,b){var s,r,q,p,o,n=this.r
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
r=A.U(new A.m(s,q+o))
B.a.m(n,a,r)}return r.E(b)>=0},
gih(){var s,r=this
if(r.z)return r.y
r.z=!0
s=r.f
if(s===0)return null
return r.y=A.pL(new A.m(r.a.a,s))},
q(a){return"GdefTable(1."+this.w+")"}}
A.cm.prototype={
dU(a){var s=this.b,r=this.a.w
if(!(a>=0&&a<r.length))return A.a(r,a)
r=r[a]+2
s.j(r,2)
return s.a.getUint16(r,!1)},
dV(a){var s,r,q,p=this.a.w
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
cG(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this.c
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
l=A.b([],t.fT)
for(n=q+6,k=0;k<m;++k){j=n+k*2
if(j>=0)i=j+2<=p.byteLength
else i=!1
if(!i)A.n(A.h("read of 2 byte(s) at "+j+" overruns a "+r.gl(0)+"-byte font"))
h=A.rg(o,new A.m(p,q+p.getUint16(j,!1)),9)
B.a.k(l,A.tL(h.a,h.b))}B.a.m(g,a,l)
return l},
he(a,b,c,d,e){var s,r,q,p,o,n,m,l=this
t.nE.a(c)
if(a<0||a>=l.a.w.length)return!1
s=l.cG(a)
if(s.length===0||b.a.length===0)return!1
r=new A.jd(b,l,e,d,c,0,0)
q=l.dU(a)
p=l.dV(a)
r.x=q
r.y=p
for(q=b.a,o=!1,p=0;n=q.length,p<n;){if(!(p>=0))return A.a(q,p)
m=q[p]
if((m.y&e)>>>0!==0){n=r.Q
n=!(n==null?r.Q=new A.aH(b,r.x,r.y,d):n).aF(m)}else n=!1
if(!(n&&A.pF(s,r)))p=++r.w
else{n=r.w
if(n<=p){++p
r.w=p}else p=n
o=!0}}return o},
hf(a,b){var s=this.a.w.length
if(a>=s)return!1
return A.pF(this.cG(a),b)},
q(a){return"GposTable("+this.a.q(0)+")"},
$itK:1}
A.h_.prototype={}
A.jd.prototype={
gt(a){var s=this,r=s.Q
return r==null?s.Q=new A.aH(s.a,s.x,s.y,s.d):r},
i0(a){var s,r,q,p,o,n=this,m=n.z
if(m===0)return!1
s=n.x
r=n.y
n.z=m-1
m=n.b
q=m.dU(a)
p=m.dV(a)
n.x=q
n.y=p
n.Q=null
o=m.hf(a,n)
n.x=s
n.y=r
n.Q=null;++n.z
return o},
d5(a,b,c,d){t.mA.a(c)
if(b&&(a.y&this.c)>>>0===0)return 1
if(c==null)return 2
return c.$2(a,d)?0:1},
cn(a,b,c,d,e){var s,r,q,p,o,n
t.mA.a(d)
for(s=this.a.a,r=b;;){r=a.cm(r)
if(r<0)return-1
if(!(r<s.length))return A.a(s,r)
q=s[r]
p=this.d5(q,e,d,c)
o=q.e===5
if(p!==0)n=p===2&&!o
else n=!0
if(n)return r
if(!o)return-1}},
dX(a,b){return this.cn(a,b,0,null,!0)},
hT(a,b,c,d){return this.cn(a,b,c,d,!0)},
e0(a,b,c,d,e){var s,r,q,p,o,n
t.mA.a(d)
for(s=this.a.a,r=b;;){r=a.e_(r)
if(r<0)return-1
if(!(r<s.length))return A.a(s,r)
q=s[r]
p=this.d5(q,e,d,c)
o=q.e===5
if(p!==0)n=p===2&&!o
else n=!0
if(n)return r
if(!o)return-1}},
co(a,b){return this.e0(a,b,0,null,!0)},
b3(a,b){var s,r,q,p,o=this
if(a.c===32768){s=o.d
r=s==null?null:s.gih()
q=o.e
if(r==null||q==null||q.length===0)return 0
return B.c.a3(r.cd(a.a,a.b,q))}p=b?o.r:o.f
return p===0?0:a.ig(p)},
bt(a){var s,r=a.a,q=a.b,p=a.d
if(p!=null)r+=this.b3(p,!1)
s=a.e
return new A.z(r,s!=null?q+this.b3(s,!0):q)}}
A.aD.prototype={}
A.nv.prototype={
$0(){var s,r=this.b,q=this.a,p=q.a
r.j(p,2)
s=r.a.getInt16(p,!1)
q.a+=2
return s},
$S:7}
A.nu.prototype={
$0(){var s,r=this.b,q=this.a,p=q.a
r.j(p,2)
s=r.a.getUint16(p,!1)
q.a+=2
return s},
$S:7}
A.eA.prototype={
U(a){var s,r,q,p=this,o=a.a,n=o.a,m=a.w
if(!(m>=0&&m<n.length))return A.a(n,m)
s=p.c.E(n[m].a)
if(s<0)return!1
if(p.e){n=p.b
r=n+6}else{n=p.a
m=p.b
q=m+6
n.j(q,2)
if(s>=n.a.getUint16(q,!1))return!1
r=m+8+s*A.oB(p.d)
n=m}o=o.b
m=a.w
if(!(m>=0&&m<o.length))return A.a(o,m)
A.oV(a,p.a,n,r,p.d,o[m]);++a.w
return!0}}
A.et.prototype={
U(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=a.w,d=f.c,c=a.a,b=c.a
if(!(e>=0&&e<b.length))return A.a(b,e)
if(d.E(b[e].a)<0)return!1
s=a.dX(a.gt(0),e)
if(s<0)return!1
r=f.d
q=A.oB(r)
p=f.e
o=A.oB(p)
n=b.length
if(f.f===1){if(!(e<n))return A.a(b,e)
n=f.b
m=f.a
d=n+10+d.E(b[e].a)*2
m.j(d,2)
l=n+m.a.getUint16(d,!1)
if(!(s<b.length))return A.a(b,s)
k=f.f1(l,b[s].a,q+o)
if(k<0)return!1
j=k+2
i=l}else{d=f.r
d.toString
if(!(e<n))return A.a(b,e)
h=d.P(b[e].a)
d=f.w
d.toString
if(!(s<b.length))return A.a(b,s)
g=d.P(b[s].a)
if(h>=f.x||g>=f.y)return!1
i=f.b
j=i+16+(h*f.y+g)*(q+o)}d=f.a
c=c.b
if(!(e<c.length))return A.a(c,e)
A.oV(a,d,i,j,r,c[e])
if(!(s<c.length))return A.a(c,s)
A.oV(a,d,i,j+q,p,c[s])
a.w=o!==0?s+1:s
return!0},
f1(a,b,c){var s,r,q,p,o,n,m,l,k,j=this.a
j.j(a,2)
s=j.a
r=2+c
q=s.getUint16(a,!1)-1
for(p=a+2,o=0;o<=q;){n=B.b.L(o+q,1)
m=p+n*r
if(m>=0)l=m+2<=s.byteLength
else l=!1
if(!l)A.n(A.h("read of 2 byte(s) at "+m+" overruns a "+j.gl(0)+"-byte font"))
k=s.getUint16(m,!1)
if(b<k)q=n-1
else if(b>k)o=n+1
else return m}return-1}}
A.fB.prototype={
U(a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a4.w,a1=this.c,a2=a4.a,a3=a2.a
if(!(a0>=0&&a0<a3.length))return A.a(a3,a0)
s=a1.E(a3[a0].a)
if(s<0)return!1
r=this.a
q=this.b
p=q+6
o=p+s*4+2
r.j(o,2)
n=r.a
m=n.getUint16(o,!1)
if(m===0)return!1
l=a4.dX(a4.gt(0),a0)
if(l<0)return!1
if(!(l<a3.length))return A.a(a3,l)
k=a1.E(a3[l].a)
if(k<0)return!1
a1=p+k*4
r.j(a1,2)
j=n.getUint16(a1,!1)
if(j===0)return!1
i=a4.bt(A.im(new A.m(n,q+m)))
h=i.a
g=a4.bt(A.im(new A.m(n,q+j)))
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
a=a0}A.px(e,a,b)
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
A.eT.prototype={
P(a){var s=this.a,r=this.b+2+a*4
s.j(r,2)
return s.a.getUint16(r,!1)}}
A.eL.prototype={
c8(a,b,c){var s,r,q,p=this,o=!0
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
return q===0?null:A.im(new A.m(o,s+q))}}
A.h0.prototype={
U(a){var s,r,q,p,o,n=this,m=a.a,l=m.a,k=a.w
if(!(k>=0&&k<l.length))return A.a(l,k)
s=n.a.E(l[k].a)
if(s<0)return!1
r=new A.aH(m,8,a.y,a.d)
q=a.w
for(;;){p=a.co(r,q)
if(p<0)return!1
if(!(p<l.length))return A.a(l,p)
q=p
break}if(!(q>=0&&q<l.length))return A.a(l,q)
o=n.b.E(l[q].a)
if(o<0)return!1
m=n.d
return A.oH(a,m,s,n.e.c8(o,m.P(s),n.c),q)}}
A.h1.prototype={
U(a){var s,r,q,p,o,n,m,l,k,j=this,i=a.a,h=i.a,g=a.w
if(!(g>=0&&g<h.length))return A.a(h,g)
s=j.b.E(h[g].a)
if(s<0)return!1
r=a.co(new A.aH(i,8,a.y,a.d),a.w)
if(r<0)return!1
if(!(r<h.length))return A.a(h,r)
q=j.c.E(h[r].a)
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
return A.oH(a,h,s,new A.eL(i,o).c8(k,h.P(s),j.d),r)}}
A.h2.prototype={
U(a){var s,r,q,p,o=this,n=a.a,m=n.a,l=a.w
if(!(l>=0&&l<m.length))return A.a(m,l)
s=o.a.E(m[l].a)
if(s<0)return!1
r=a.co(new A.aH(n,a.x&4294967281,a.y,a.d),a.w)
if(r<0)return!1
n=m.length
if(!(r<n))return A.a(m,r)
q=m[r]
if(q.f!==3)return!1
l=a.w
if(!(l>=0&&l<n))return A.a(m,l)
if(!A.u8(m[l],q))return!1
p=o.b.E(q.a)
if(p<0)return!1
n=o.d
return A.oH(a,n,s,o.e.c8(p,n.P(s),o.c),r)}}
A.d6.prototype={
U(a){var s,r,q,p=this,o=a.a.a,n=a.w
if(!(n>=0&&n<o.length))return A.a(o,n)
s=o[n].a
switch(p.c){case 1:r=p.d.E(s)
if(r<0)return!1
return p.cM(a,r,A.nH(),!1)
case 2:if(p.d.E(s)<0)return!1
o=p.e
q=o.P(s)
return p.cM(a,q,new A.iL(o),!0)
default:return p.bL(a)}},
cM(a,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b="read of 2 byte(s) at "
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
if(!j)A.n(A.h(b+q+" overruns a "+s.gl(0)+"-byte font"))
i=p.getUint16(q,!1)
if(i===0)continue
h=m+i
if(h>=0)q=h+2<=p.byteLength
else q=!1
if(!q)A.n(A.h(b+h+" overruns a "+s.gl(0)+"-byte font"))
g=p.getUint16(h,!1)
q=h+2
if(q>=0)j=q+2<=p.byteLength
else j=!1
if(!j)A.n(A.h(b+q+" overruns a "+s.gl(0)+"-byte font"))
f=p.getUint16(q,!1)
e=h+4
d=A.mh(a,g,e,s,a1)
if(d==null)continue
c=A.nm(s,e+(g===0?0:g-1)*2,f)
A.lH(a,d,c,d.length===0?a.w+1:B.a.gS(d)+1)
return!0}return!1},
bL(a){var s,r,q,p,o,n,m=this.a,l=this.b,k=l+2
m.j(k,2)
s=m.a
r=s.getUint16(k,!1)
if(r===0)return!1
k=l+4
m.j(k,2)
q=s.getUint16(k,!1)
p=l+6
m.j(p,2)
o=A.U(new A.m(s,l+s.getUint16(p,!1)))
k=a.a.a
s=a.w
if(!(s>=0&&s<k.length))return A.a(k,s)
if(o.E(k[s].a)<0)return!1
n=A.mh(a,r,p+2,m,A.qM(m,l))
if(n==null)return!1
A.lH(a,n,A.nm(m,p+r*2,q),B.a.gS(n)+1)
return!0}}
A.iL.prototype={
$2(a,b){return this.a.P(a.a)===b},
$S:8}
A.lT.prototype={
$2(a,b){var s=this.a,r=s.h(0,b)
if(r==null){r=A.U(new A.m(this.b.a,this.c+b))
s.m(0,b,r)
s=r}else s=r
return s.E(a.a)>=0},
$S:8}
A.d_.prototype={
U(a){var s,r,q,p=this,o=a.a.a,n=a.w
if(!(n>=0&&n<o.length))return A.a(o,n)
s=o[n].a
switch(p.c){case 1:r=p.d.E(s)
if(r<0)return!1
return p.cN(a,r,4,A.nH(),A.nH(),A.nH())
case 2:if(p.d.E(s)<0)return!1
o=p.e
o.toString
n=p.f
n.toString
q=p.r
q.toString
return p.cN(a,n.P(s),10,new A.it(o),new A.iu(n),new A.iv(q))
default:return p.bL(a)}},
cN(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j,i=t.dW
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
if(!k)A.n(A.h("read of 2 byte(s) at "+r+" overruns a "+i.gl(0)+"-byte font"))
j=q.getUint16(r,!1)
if(j===0)continue
if(this.eF(a,n+j,d,e,f))return!0}return!1},
eF(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h=t.dW
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
j=A.mh(a,o,n,h,d)
if(j==null)return!1
i=j.length===0?a.w+1:B.a.gS(j)+1
if(!A.qV(a,m,l,h,e,i))return!1
if(!A.qU(a,r,q,h,c))return!1
A.lH(a,j,A.nm(h,p+2,k),i)
return!0},
bL(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this.b,e=f+2,d=this.a
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
k=A.U(new A.m(s,f+s.getUint16(o,!1)))
s=a.a.a
j=a.w
if(!(j>=0&&j<s.length))return A.a(s,j)
if(k.E(s[j].a)<0)return!1
i=A.qM(d,f)
h=A.mh(a,p,o+2,d,i)
if(h==null)return!1
g=B.a.gS(h)+1
if(!A.qV(a,n,m,d,i,g))return!1
if(!A.qU(a,r,q,d,i))return!1
A.lH(a,h,A.nm(d,e+2,l),g)
return!0}}
A.iw.prototype={
$1(a){var s,r=this.a
r.j(a,2)
r=r.a
s=r.getUint16(a,!1)
return s===0?B.h:A.cg(new A.m(r,this.b+s))},
$S:28}
A.it.prototype={
$2(a,b){return this.a.P(a.a)===b},
$S:8}
A.iu.prototype={
$2(a,b){return this.a.P(a.a)===b},
$S:8}
A.iv.prototype={
$2(a,b){return this.a.P(a.a)===b},
$S:8}
A.hX.prototype={}
A.cn.prototype={
hd(a,b,c,d){var s,r,q=this
if(b.a.length===0)return!1
s=q.d4(a)
if(s.d.length===0)return!1
r=new A.e8(b,d,c,0,q.gfB())
r.bH(s.b,s.c)
return s.a===8?q.eC(s,r):q.eD(s,r)},
eD(a,b){var s,r,q,p,o,n,m,l,k,j,i=b.a
b.f=0
for(s=i.a,r=b.b,q=b.c,p=a.d,o=!1,n=0;m=s.length,n<m;){if(!(n>=0))return A.a(s,n)
l=s[n]
if((l.y&r)>>>0!==0){m=b.y
m=!(m==null?b.y=new A.aH(i,b.w,b.x,q):m).aF(l)}else m=!1
k=!1
if(m)for(m=p.length,j=0;j<p.length;p.length===m||(0,A.i)(p),++j)if(p[j].U(b)){k=!0
break}if(!k){++n
b.f=n
continue}m=b.f
if(m<=n){++n
b.f=n}else n=m
o=!0}return o},
eC(a,b){var s,r,q,p,o,n,m,l,k=b.a
for(s=k.a,r=b.f=s.length-1,q=a.d,p=b.b,o=b.c,n=!1;r>=0;r=--b.f){if(!(r<s.length))return A.a(s,r)
m=s[r]
if((m.y&p)>>>0===0)continue
r=b.y
if((r==null?b.y=new A.aH(k,b.w,b.x,o):r).aF(m))continue
for(r=q.length,l=0;l<q.length;q.length===r||(0,A.i)(q),++l)if(q[l].U(b)){n=!0
break}}return n},
fC(a,b){var s,r,q,p,o,n,m
if(a.r>=64)return!1
if(b>=this.b.length)return!1
s=a.f
if(s<0||s>=a.a.a.length)return!1
r=this.d4(b)
q=a.w
p=a.x
a.bH(r.b,r.c);++a.r
s=r.d
n=s.length
m=0
for(;;){if(!(m<s.length)){o=!1
break}if(s[m].U(a)){o=!0
break}s.length===n||(0,A.i)(s);++m}--a.r
a.bH(q,p)
return o},
d4(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(a<0||a>=this.b.length)throw A.e(A.h("GSUB lookup index "+a+" out of range"))
s=this.b
if(!(a>=0&&a<s.length))return A.a(s,a)
r=s[a]
if(r!=null)return r
q=this.a
p=q.a.a
o=new A.m(p,q.b)
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
i=A.b([],t.fL)
for(q=n+6,h=0;h<k;++h){g=q+h*2
if(g>=0)f=g+2<=p.byteLength
else f=!1
if(!f)A.n(A.h("read of 2 byte(s) at "+g+" overruns a "+o.gl(0)+"-byte font"))
B.a.k(i,A.xt(m,new A.m(p,n+p.getUint16(g,!1))))}q=new A.hX(i.length===0?m:B.a.gv(i).gK(),l,j,i)
B.a.m(s,a,q)
return q},
q(a){return"GsubTable("+this.b.length+" lookups, "+this.a.q(0)+")"}}
A.hh.prototype={
q(a){return"SequenceLookupRecord("+this.a+" \u2192 "+this.b+")"}}
A.e8.prototype={
bH(a,b){var s=this
if(a===s.w&&b===s.x)return
s.w=a
s.x=b
s.y=null},
gt(a){var s=this,r=s.y
return r==null?s.y=new A.aH(s.a,s.w,s.x,s.c):r},
bJ(a,b,c){var s,r,q=this.a.a
if(!(a>=0&&a<q.length))return A.a(q,a)
s=q[a]
s.a=b
r=this.c
if(r!=null&&r.b!==B.h){s.f=r.b.P(b)
s.r=r.c.P(b)}else if(c!==0)s.f=c},
be(a,b){return this.bJ(a,b,0)}}
A.ay.prototype={}
A.eB.prototype={
gK(){return 1},
fW(a){var s,r=this.a.E(a)
if(r<0)return null
s=this.c
if(s==null)return a+this.b&65535
return r<s.length?s[r]:null},
U(a){var s,r=a.a.a,q=a.f
if(!(q>=0&&q<r.length))return A.a(r,q)
s=this.fW(r[q].a)
if(s==null)return!1
a.be(a.f,s);++a.f
return!0}}
A.h4.prototype={
gK(){return 2},
U(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=a.a,e=f.a,d=a.f
if(!(d>=0&&d<e.length))return A.a(e,d)
s=g.a.E(e[d].a)
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
r=new A.m(o,p+2).a_(o.getUint16(p,!1))
B.a.m(d,s,r)}d=r.length
if(d===1){f=a.f
if(0>=d)return A.a(r,0)
a.be(f,r[0]);++a.f
return!0}if(d===0){B.a.aD(e,a.f)
B.a.aD(f.b,a.f)
return!0}n=a.f
if(!(n>=0&&n<e.length))return A.a(e,n)
m=e[n]
l=m.f===2?1:0
k=m.w
j=A.b([],t.Q)
for(q=k===0,i=0;i<d;++i){h=new A.aA(m.a,m.b,m.c,m.d,m.e,m.f,m.r,m.w,m.x,m.y,!1)
if(q){h.w=0
h.x=i}B.a.k(j,h)}B.a.aD(e,n)
f=f.b
B.a.aD(f,n)
B.a.ck(e,n,j)
e=A.b([],t.q)
for(i=0;i<d;++i)e.push(new A.bT(0))
B.a.ck(f,n,e)
for(i=0;i<d;++i)a.bJ(n+i,r[i],l)
a.f=n+d
return!0}}
A.fk.prototype={
gK(){return 3},
U(a){var s,r,q,p,o=this,n=a.a.a,m=a.f
if(!(m>=0&&m<n.length))return A.a(n,m)
s=o.a.E(n[m].a)
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
r=new A.m(p,q+2).a_(p.getUint16(q,!1))
B.a.m(n,s,r)}n=a.d
if(n>=r.length)return!1
a.be(a.f,r[n]);++a.f
return!0}}
A.cN.prototype={}
A.fZ.prototype={
gK(){return 4},
fe(a){var s,r,q,p,o=this,n=o.d
if(!(a>=0&&a<n.length))return A.a(n,a)
s=n[a]
if(s!=null)return s
r=o.c
if(!(a<r.length))return A.a(r,a)
q=r[a]
r=o.b
r.j(q,2)
p=A.ei(r.a.getUint16(q,!1),new A.js(o,q),!1,t.nx)
B.a.m(n,a,p)
return p},
U(a){var s,r,q,p,o,n=a.a.a,m=a.f
if(!(m>=0&&m<n.length))return A.a(n,m)
s=this.a.E(n[m].a)
if(s<0||s>=this.c.length)return!1
for(n=this.fe(s),m=n.length,r=0;r<m;++r){q=n[r]
p=q.b
o=A.nS(a,p.length+1,new A.jt(p))
if(o==null)continue
A.wh(a,o,q.a)
return!0}return!1}}
A.js.prototype={
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
return new A.cN(o,new A.m(s,r+4).a_(p))},
$S:64}
A.jt.prototype={
$2(a,b){var s=this.a,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===b},
$S:3}
A.bF.prototype={}
A.dB.prototype={
gl(a){return this.b.length},
h(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g=this
A.E(b)
if(b<0||b>=g.b.length)return B.L
s=g.d
if(!(b>=0&&b<s.length))return A.a(s,b)
r=s[b]
if(r!=null)return r
q=g.b
if(!(b<q.length))return A.a(q,b)
p=q[b]
if(p===0){B.a.m(s,b,B.L)
return B.L}q=g.a
q.j(p,2)
o=q.a
n=o.getUint16(p,!1)
m=J.aN(n,t.kr)
for(l=g.c,k=p+2,j=0;j<n;++j){i=k+j*2
if(i>=0)h=i+2<=o.byteLength
else h=!1
if(!h)A.n(A.h("read of 2 byte(s) at "+i+" overruns a "+q.gl(0)+"-byte font"))
m[j]=l.$2(q,p+o.getUint16(i,!1))}B.a.m(s,b,m)
return m}}
A.ml.prototype={
$1(a){var s,r=this.a,q=this.b+a*2
r.j(q,2)
s=r.a.getUint16(q,!1)
return s===0?0:this.c+s},
$S:14}
A.fx.prototype={
gK(){return 5},
U(a){var s,r,q,p=a.a.a,o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
s=this.a.E(p[o].a)
if(s<0)return!1
for(p=this.b.h(0,s),o=p.length,r=0;r<o;++r){q=p[r]
if(A.mg(a,q,A.nI(),new A.iM(q),A.nI()))return!0}return!1}}
A.iM.prototype={
$2(a,b){var s=this.a.b,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===b},
$S:3}
A.fy.prototype={
gK(){return 5},
U(a){var s,r,q=this,p=a.a.a,o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
if(q.a.E(p[o].a)<0)return!1
o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
for(p=q.c.h(0,q.b.P(p[o].a)),o=p.length,s=0;s<o;++s){r=p[s]
if(A.mg(a,r,A.nI(),new A.iN(q,r),A.nI()))return!0}return!1}}
A.iN.prototype={
$2(a,b){var s=this.b.b,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===this.a.b.P(b)},
$S:3}
A.fz.prototype={
gK(){return 5},
U(a){var s,r,q,p=this.a,o=p.length
if(o===0)return!1
if(0>=o)return A.a(p,0)
p=p[0]
s=a.a.a
r=a.f
if(!(r>=0&&r<s.length))return A.a(s,r)
if(p.E(s[r].a)<0)return!1
q=A.nS(a,o,new A.iO(this))
if(q==null)return!1
p=q.length
o=p-1
if(!(o>=0))return A.a(q,o)
A.oU(a,q,q[o]+1,this.b)
return!0}}
A.iO.prototype={
$2(a,b){var s=this.a.a
if(!(a<s.length))return A.a(s,a)
return s[a].E(b)>=0},
$S:3}
A.fp.prototype={
gK(){return 6},
U(a){var s,r,q,p=a.a.a,o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
s=this.a.E(p[o].a)
if(s<0)return!1
for(p=this.b.h(0,s),o=p.length,r=0;r<o;++r){q=p[r]
if(A.mg(a,q,new A.ix(q),new A.iy(q),new A.iz(q)))return!0}return!1}}
A.iy.prototype={
$2(a,b){var s=this.a.b,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===b},
$S:3}
A.ix.prototype={
$2(a,b){var s=this.a.a
if(!(a<s.length))return A.a(s,a)
return s[a]===b},
$S:3}
A.iz.prototype={
$2(a,b){var s=this.a.c
if(!(a<s.length))return A.a(s,a)
return s[a]===b},
$S:3}
A.fq.prototype={
gK(){return 6},
U(a){var s,r,q=this,p=a.a.a,o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
if(q.a.E(p[o].a)<0)return!1
o=a.f
if(!(o>=0&&o<p.length))return A.a(p,o)
for(p=q.e.h(0,q.c.P(p[o].a)),o=p.length,s=0;s<o;++s){r=p[s]
if(A.mg(a,r,new A.iA(q,r),new A.iB(q,r),new A.iC(q,r)))return!0}return!1}}
A.iD.prototype={
$1(a){var s,r=this.a
r.j(a,2)
r=r.a
s=r.getUint16(a,!1)
return s===0?B.h:A.cg(new A.m(r,this.b+s))},
$S:28}
A.iB.prototype={
$2(a,b){var s=this.b.b,r=a-1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]===this.a.c.P(b)},
$S:3}
A.iA.prototype={
$2(a,b){var s=this.b.a
if(!(a<s.length))return A.a(s,a)
return s[a]===this.a.b.P(b)},
$S:3}
A.iC.prototype={
$2(a,b){var s=this.b.c
if(!(a<s.length))return A.a(s,a)
return s[a]===this.a.d.P(b)},
$S:3}
A.fr.prototype={
gK(){return 6},
U(a){var s,r,q,p,o=this,n=o.b,m=n.length
if(m===0)return!1
if(0>=m)return A.a(n,0)
n=n[0]
s=a.a.a
r=a.f
if(!(r>=0&&r<s.length))return A.a(s,r)
if(n.E(s[r].a)<0)return!1
q=A.nS(a,m,new A.iE(o))
if(q==null)return!1
n=q.length
m=n-1
if(!(m>=0))return A.a(q,m)
p=q[m]+1
if(!A.p2(a,o.c.length,p,new A.iF(o)))return!1
if(!A.p1(a,o.a.length,new A.iG(o)))return!1
A.oU(a,q,p,o.d)
return!0}}
A.iH.prototype={
$0(){var s,r,q,p,o,n,m=this.b,l=this.a,k=l.a
m.j(k,2)
s=m.a
r=s.getUint16(k,!1)
q=J.aN(r,t.c)
for(k=this.c,p=0;p<r;++p){o=l.a+2+p*2
if(o>=0)n=o+2<=s.byteLength
else n=!1
if(!n)A.n(A.h("read of 2 byte(s) at "+o+" overruns a "+m.gl(0)+"-byte font"))
q[p]=A.U(new A.m(s,k+s.getUint16(o,!1)))}l.a=l.a+(2+r*2)
return q},
$S:37}
A.iE.prototype={
$2(a,b){var s=this.a.b
if(!(a<s.length))return A.a(s,a)
return s[a].E(b)>=0},
$S:3}
A.iF.prototype={
$2(a,b){var s=this.a.c
if(!(a<s.length))return A.a(s,a)
return s[a].E(b)>=0},
$S:3}
A.iG.prototype={
$2(a,b){var s=this.a.a
if(!(a<s.length))return A.a(s,a)
return s[a].E(b)>=0},
$S:3}
A.hf.prototype={
gK(){return 8},
U(a){var s,r,q,p=this
if(a.r!==0)return!1
s=a.a.a
r=a.f
if(!(r>=0&&r<s.length))return A.a(s,r)
q=p.a.E(s[r].a)
if(q<0||q>=p.d.length)return!1
if(!A.p1(a,p.b.length,new A.jP(p)))return!1
if(!A.p2(a,p.c.length,a.f+1,new A.jQ(p)))return!1
s=a.f
r=p.d
if(!(q>=0&&q<r.length))return A.a(r,q)
a.be(s,r[q])
return!0}}
A.jR.prototype={
$0(){var s,r,q,p,o,n,m=this.b,l=this.a,k=l.a
m.j(k,2)
s=m.a
r=s.getUint16(k,!1)
q=J.aN(r,t.c)
for(k=this.c,p=0;p<r;++p){o=l.a+2+p*2
if(o>=0)n=o+2<=s.byteLength
else n=!1
if(!n)A.n(A.h("read of 2 byte(s) at "+o+" overruns a "+m.gl(0)+"-byte font"))
q[p]=A.U(new A.m(s,k+s.getUint16(o,!1)))}l.a=l.a+(2+r*2)
return q},
$S:37}
A.jP.prototype={
$2(a,b){var s=this.a.b
if(!(a<s.length))return A.a(s,a)
return s[a].E(b)>=0},
$S:3}
A.jQ.prototype={
$2(a,b){var s=this.a.c
if(!(a<s.length))return A.a(s,a)
return s[a].E(b)>=0},
$S:3}
A.aH.prototype={
aF(a){var s,r,q,p=this,o=a.f
if(o>=1&&o<=3&&(p.b&B.b.ag(1,o))!==0)return!0
if(o!==3)return!1
s=p.b
if((s&16)!==0){r=p.d
if(r==null)return!0
return!r.hJ(p.c,a.a)}q=s&65280
if(q!==0)return a.r!==q>>>8
return!1},
cm(a){var s,r,q
for(s=a+1,r=this.a.a;q=r.length,s<q;++s){if(!(s>=0))return A.a(r,s)
if(!this.aF(r[s]))return s}return-1},
e_(a){var s=a-1,r=this.a.a,q=r.length
if(s>=q)s=q-1
for(;s>=0;--s){if(!(s<r.length))return A.a(r,s)
if(!this.aF(r[s]))return s}return-1}}
A.jr.prototype={
hs(a){var s,r,q,p,o,n,m,l,k,j,i,h=this
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
l=J.aN(m,t.S)
for(o=p+4,k=0;k<m;++k){j=o+k*2
if(j>=0)i=j+2<=n.byteLength
else i=!1
if(!i)A.n(A.h("read of 2 byte(s) at "+j+" overruns a "+q.gl(0)+"-byte font"))
l[k]=n.getUint16(j,!1)}B.a.m(s,a,l)
return l},
dG(a,b){var s,r,q,p,o,n,m=this.d2(b,a)
if(m==null)return B.Q
s=A.aZ(t.S)
for(r=this.cX(m),q=r.length,p=this.d,o=0;o<r.length;r.length===q||(0,A.i)(r),++o){n=r[o]
if(!(n>=0&&n<p.length))return A.a(p,n)
s.k(0,p[n])}return s},
ef(a,b,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=t.nO
c.a(a)
s=d.d2(a0,b)
if(s==null)return B.cs
r=t.S
q=A.C(r,c)
for(c=d.cX(s),p=c.length,o=d.d,n=0;n<c.length;c.length===p||(0,A.i)(c),++n){m=c[n]
if(!(m>=0&&m<o.length))return A.a(o,m)
l=o[m]
if(!a.u(0,l))continue
for(k=d.hs(m),j=k.length,i=0;i<j;++i){h=k[i]
g=q.h(0,h)
if(g==null){g=A.aZ(r)
q.m(0,h,g)}g.k(0,l)}}c=q.$ti.i("am<1>")
f=A.a3(new A.am(q,c),c.i("f.E"))
B.a.aQ(f)
c=A.b([],t.kR)
for(r=f.length,n=0;n<f.length;f.length===r||(0,A.i)(f),++n){e=f[n]
p=q.h(0,e)
p.toString
c.push(new A.hl(e,p))}return c},
d2(a,b){var s,r,q,p,o,n,m,l=this.c,k=l.h(0,a)
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
if(!n)A.n(A.h("read of 4 byte(s) at "+o+" overruns a "+l.gl(0)+"-byte font"))
if(r.getUint32(o,!1)===b){s=o+4
if(s>=0)n=s+2<=r.byteLength
else n=!1
if(!n)A.n(A.h("read of 2 byte(s) at "+s+" overruns a "+l.gl(0)+"-byte font"))
return k+r.getUint16(s,!1)}}}l=this.a
l.j(k,2)
m=l.a.getUint16(k,!1)
return m===0?null:k+m},
cX(a){var s,r,q,p,o,n,m,l,k=A.aZ(t.S),j=this.a,i=a+2
j.j(i,2)
s=j.a
r=s.getUint16(i,!1)
if(r!==65535&&r<this.d.length)k.k(0,r)
i=a+4
j.j(i,2)
q=s.getUint16(i,!1)
for(i=this.d,p=a+6,o=0;o<q;++o){n=p+o*2
if(n>=0)m=n+2<=s.byteLength
else m=!1
if(!m)A.n(A.h("read of 2 byte(s) at "+n+" overruns a "+j.gl(0)+"-byte font"))
l=s.getUint16(n,!1)
if(l<i.length)k.k(0,l)}j=A.a3(k,k.$ti.c)
B.a.aQ(j)
return j},
q(a){var s=this
return"LayoutTable(1."+s.r+", "+s.c.a+" scripts, "+s.d.length+" features, "+s.w.length+" lookups)"}}
A.hl.prototype={
q(a){var s=this.b,r=A.r(s)
return"StagedLookup("+this.a+", "+new A.ci(s,r.i("p(1)").a(new A.k6()),r.i("ci<1,p>")).ac(0,"+")+")"}}
A.k6.prototype={
$1(a){return A.aB(A.E(a))},
$S:75}
A.dQ.prototype={
dJ(a){var s
a.av(1937007464)
a.br()
a.av(1667460464)
a.av(1819239276)
a.br()
for(s=0;s<7;++s){a.h9(B.a4[s],8);++a.e}a.ce(1919118452,4)
a.ce(1667329140,4)
a.br()
a.av(1836279156)},
cD(a,b){var s,r,q,p,o,n,m,l=A.t_(a),k=A.b([],t.t)
for(s=b.r,r=0;r<7;++r){q=s.h(0,B.a4[r])
k.push(q==null?0:q)}k.push(0)
for(s=a.a,q=l.length,p=0;p<s.length;++p){o=s[p]
n=o.y
if(!(p<q))return A.a(l,p)
m=l[p]
if(!(m<k.length))return A.a(k,m)
o.y=(n|k[m])>>>0}},
e1(a,b,c){}}
A.ez.prototype={
dJ(a){},
cD(a,b){},
e1(a,b,c){}}
A.fC.prototype={}
A.aA.prototype={
q(a){return"GlyphInfo(gid: "+this.a+", cluster: "+this.c+")"}}
A.bT.prototype={
q(a){var s=this
return"GlyphPosition(adv: "+s.a+","+s.b+" off: "+s.c+","+s.d+")"}}
A.eF.prototype={
al(){return"TextDirection."+this.b}}
A.j6.prototype={
gl(a){return this.a.length},
e3(){var s,r,q,p,o,n,m
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
q(a){var s=this.a,r=A.L(s)
return"GlyphBuffer("+s.length+" glyphs, "+this.c.q(0)+", "+new A.an(s,r.i("c(1)").a(new A.j7()),r.i("an<1,c>")).ac(0," ")+")"}}
A.j7.prototype={
$1(a){return t.h.a(a).a},
$S:29}
A.h7.prototype={
al(){return"NormalizationMode."+this.b}}
A.jB.prototype={
hU(a,b){if(a.a.length===0)return
this.eU(a)
this.fQ(a,b)
this.fz(a)},
eU(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=1668112752,f=A.b([],t.Q)
for(s=a.a,r=s.length,q=this.a,p=q.a,o=p.c,n=0;n<s.length;s.length===r||(0,A.i)(s),++n){m=s[n]
l=m.b
k=q.e
if(k==null){j=o.h(0,g)
i=j==null?null:new A.m(p.a.a,j.c)
if(i==null)A.n(A.h("font has no "+A.aB(A.cE(g))+" table"))
k=q.e=A.dZ(i)}h=k.ad(l)
if(h!==0){m.a=h
B.a.k(f,m)
continue}if(!this.cU(f,m,m.b,!0)){l=m.b
k=q.e
if(k==null){j=o.h(0,g)
i=j==null?null:new A.m(p.a.a,j.c)
if(i==null)A.n(A.h("font has no "+A.aB(A.cE(g))+" table"))
k=q.e=A.dZ(i)}m.a=k.ad(l)
B.a.k(f,m)}}A.q1(a,f)},
cU(a,b,c,d){var s,r,q,p,o,n,m=this
t.n7.a(a)
s=A.vM(c)
r=s.a
q=s.b
if(r<0)return!1
p=q<0?0:m.a.gdI().ad(q)
o=q>=0
if(o&&p===0)return!1
n=m.a.gdI().ad(r)
if(d&&n!==0){B.a.k(a,m.aX(b,r,n))
if(o)B.a.k(a,m.aX(b,q,p))
return!0}if(m.cU(a,b,r,d)){if(o)B.a.k(a,m.aX(b,q,p))
return!0}if(n!==0){B.a.k(a,m.aX(b,r,n))
if(o)B.a.k(a,m.aX(b,q,p))
return!0}return!1},
fQ(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=a.a,g=h.length
for(s=0;s<g;++s){if(!(s>=0&&s<h.length))return A.a(h,s)
r=h[s].b
q=A.ak($.dO(),r)
r=$.fg()
p=r.length
if(q<p){if(!(q>=0))return A.a(r,q)
r=r[q]}else r=q
if(r===0)continue
o=s+1
n=o
for(;;){if(n<g){if(!(n<h.length))return A.a(h,n)
r=h[n].b
q=A.ak($.dO(),r)
r=$.fg()
p=r.length
if(q<p){if(!(q>=0))return A.a(r,q)
r=r[q]}else r=q
r=r!==0}else r=!1
if(!r)break;++n}if(n-s<=32){for(m=o;m<n;++m){if(!(m<h.length))return A.a(h,m)
l=h[m]
r=l.b
q=A.ak($.dO(),r)
r=$.fg()
p=r.length
if(q<p){if(!(q>=0))return A.a(r,q)
k=r[q]}else k=q
j=m
for(;;){if(j>s){r=j-1
if(!(r<h.length))return A.a(h,r)
r=h[r].b
q=A.ak($.dO(),r)
r=$.fg()
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
A.uk(a,j,m+1)}}b.e1(a,s,n)}s=n-1}},
fz(a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=1668112752,a4=a5.a
if(a4.length<2)return
s=A.b([B.a.gv(a4)],t.Q)
for(r=this.a,q=r.a,p=q.c,q=q.a.a,o=0,n=1;n<a4.length;++n){m=a4[n]
l=B.a.gS(s)
k=m.e
j=k===1||k===2||k===3
if(o!==s.length-1){k=l.b
i=$.dO()
h=A.ak(i,k)
k=$.fg()
g=k.length
if(h<g){if(!(h>=0))return A.a(k,h)
f=k[h]}else f=h
h=A.ak(i,m.b)
if(h<g){if(!(h>=0))return A.a(k,h)
k=k[h]}else k=h
e=f>=k}else e=!1
if(j&&!e){if(!(o>=0&&o<s.length))return A.a(s,o)
d=A.vL(s[o].b,m.b)
if(d>=0){k=r.e
if(k==null){c=p.h(0,a3)
b=c==null?null:new A.m(q,c.c)
if(b==null)A.n(A.h("font has no "+A.aB(A.cE(a3))+" table"))
k=r.e=A.dZ(b)}a=k.ad(d)
if(a!==0){a0=m.c
for(k=s.length,a1=o;a1<k;++a1){a2=s[a1].c
if(a2<a0)a0=a2}for(a1=o;k=s.length,a1<k;++a1)s[a1].c=a0
if(!(o<k))return A.a(s,o)
k=s[o]
k.b=d
k.a=a
k.e=A.ak($.od(),d)
k.d=A.ak($.oe(),d)
continue}}}B.a.k(s,m)
k=m.b
if(A.ak($.dO(),k)===0)o=s.length-1}A.q1(a5,s)},
aX(a,b,c){var s=a.c,r=A.ak($.od(),b)
return new A.aA(c,b,s,A.ak($.oe(),b),r,0,0,0,0,a.y,!1)}}
A.mi.prototype={
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
$S:82}
A.hi.prototype={
gl(a){return this.a.length},
q(a){var s=this.a,r=A.L(s)
return"ShapedRun("+s.length+" glyphs, "+this.c.q(0)+", "+new A.an(s,r.i("c(1)").a(new A.k2()),r.i("an<1,c>")).ac(0," ")+")"}}
A.k2.prototype={
$1(a){return t.h.a(a).a},
$S:29}
A.hj.prototype={
ee(a,b,c){var s,r
t.L.a(a)
s=A.b([],t.t)
for(r=0;r<a.length;++r)s.push(r)
return this.fP(a,s,b,B.cB,1145457748,c)},
fP(a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a=t.L
a.a(a0)
a.a(a1)
s=b.fu(a5,a4,a2,t.kT.a(a3))
r=B.af.u(0,a5)?new A.dQ():B.V
q=b.d
a=q.a
B.a.a8(a)
p=q.b
B.a.a8(p)
q.c=B.r
q.d=0
q.c=a2
q.d=a5
for(o=0;o<a0.length;++o){n=a0[o]
if(!(o<a1.length))return A.a(a1,o)
B.a.k(a,new A.aA(0,n,a1[o],0,0,0,0,0,0,0,!1))
B.a.k(p,new A.bT(0))}if(a.length===0)return new A.hi(B.cC,B.cD,a2)
b.fM(q,s)
A.uF(q)
A.uE(q)
b.fg(q,s)
m=b.c;(m===$?b.c=new A.jB(b.a):m).hU(q,r)
r.cD(q,s)
n=b.a
l=n.ch
if(l==null)l=n.ch=n.bk(1195656518,A.wZ(),t.lP)
A.uD(q,l)
k=n.gcC()
if(k!=null)for(j=s.d,i=j.length,h=0;h<j.length;j.length===i||(0,A.i)(j),++h)for(g=j[h].a,f=g.length,e=0;e<g.length;g.length===f||(0,A.i)(g),++e){d=g[e]
k.hd(d.a,q,l,d.b)}B.a.a8(p)
j=A.b([],t.q)
for(i=a.length,h=0;h<a.length;a.length===i||(0,A.i)(a),++h)j.push(new A.bT(n.c5(a[h].a)))
B.a.F(p,j)
c=n.gcB()
if(c!=null)for(j=s.e,i=j.length,n=n.b,h=0;h<j.length;j.length===i||(0,A.i)(j),++h)for(g=j[h].a,f=g.length,e=0;e<g.length;g.length===f||(0,A.i)(g),++e){d=g[e]
c.he(d.a,q,n,l,d.b)}A.tP(q,!1)
A.tO(q)
A.tN(q)
n=q.c
if(n===B.k)q.e3()
b.f6(q)
a=A.a3(a,t.h)
p=A.a3(p,t.lr)
return new A.hi(a,p,q.c)},
fu(a,b,c,d){var s,r,q,p,o,n,m,l
t.kT.a(d)
s=[]
for(r=0;!1;++r){q=d[r]
s.push(q.gi7().aP(0,31).bF(0,q.gie()))}p=A.ou(a,b,c,A.ul(s))
s=this.b
o=s.h(0,p)
if(o!=null)return o
n=new A.k4(a,b,c,A.b([],t.la))
A.wP(n,B.af.u(0,a)?new A.dQ():B.V)
for(r=0;!1;++r){q=d[r]
n.aJ(q.gi7(),1,q.gie())}m=this.a
l=m.gcC()
l=l==null?null:l.a
m=m.gcB()
m=n.hj(m==null?null:m.a,l)
s.m(0,p,m)
return m},
fM(a,b){var s,r,q,p,o,n
for(s=a.a,r=s.length,q=b.f,p=0;p<s.length;s.length===r||(0,A.i)(s),++p){o=s[p]
n=o.b
o.e=A.ak($.od(),n)
n=o.b
o.d=A.ak($.oe(),n)
o.y=q}},
fg(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=1668112752
if(a.c!==B.k)return
s=b.hR(1920232557)
for(r=a.a,q=r.length,p=s!==0,o=this.a,n=o.a,m=n.c,l=0;l<r.length;r.length===q||(0,A.i)(r),++l){k=r[l]
j=k.b
i=A.ak($.pf(),j)
h=i===0?-1:B.b.L(i,2)
if(h>0){j=o.e
if(j==null){g=m.h(0,e)
f=g==null?null:new A.m(n.a.a,g.c)
if(f==null)A.n(A.h("font has no "+A.aB(A.cE(e))+" table"))
j=o.e=A.dZ(f)}j=j.ad(h)!==0}else j=!1
if(j)k.b=h
else if(p)k.y=(k.y|s)>>>0}},
f6(a){var s,r,q,p,o,n,m,l,k,j,i,h=1668112752
for(s=a.a,r=a.b,q=this.a,p=q.a,o=p.c,n=-1,m=0;m<s.length;++m){l=s[m]
if(!A.xb(l.b))continue
if(n<0){k=q.e
if(k==null){j=o.h(0,h)
i=j==null?null:new A.m(p.a.a,j.c)
if(i==null)A.n(A.h("font has no "+A.aB(A.cE(h))+" table"))
k=q.e=A.dZ(i)}n=k.ad(32)}if(n!==0)l.a=n
if(!(m<r.length))return A.a(r,m)
k=r[m]
k.d=k.c=k.b=k.a=0}}}
A.hd.prototype={
q(a){return"PlannedLookup("+this.a+", mask 0x"+B.b.b8(this.b,16)+")"}}
A.hc.prototype={
q(a){return"PlanStage("+this.a.length+" lookups)"}}
A.hk.prototype={
hR(a){var s=this.r.h(0,a)
return s==null?0:s},
q(a){var s=this
return"ShapingPlan("+A.aB(s.a)+"/"+A.aB(s.b)+", "+s.c.q(0)+", "+s.d.length+" GSUB stages, "+s.e.length+" GPOS stages)"}}
A.bG.prototype={}
A.k4.prototype={
ce(a,b){return this.aJ(a,b|1,1)},
av(a){return this.ce(a,0)},
aJ(a,b,c){var s=(b&1)!==0?c:0,r=new A.bG(a,b,c,s,this.r++)
r.f=this.e
B.a.k(this.d,r)},
bq(a){return this.aJ(a,0,1)},
h9(a,b){return this.aJ(a,b,1)},
br(){return this.e++},
hj(a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=this,a3=A.pZ(a2.d,!0,t.bY)
B.a.az(a3,new A.k5())
s=A.b([],t.la)
for(r=a3.length,q=0;q<a3.length;a3.length===r||(0,A.i)(a3),++q){p=a3[q]
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
if(n<o.r)o.r=n}else B.a.k(s,p)}l=a5==null?B.Q:a5.dG(a2.b,a2.a)
k=a4==null?B.Q:a4.dG(a2.b,a2.a)
r=t.S
j=A.C(r,r)
i=A.aZ(r)
h=A.C(r,r)
g=A.C(r,r)
f=A.C(r,r)
for(r=s.length,e=1,d=1,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q]
n=p.a
c=l.u(0,n)
b=k.u(0,n)
m=!c
if(!m||b)i.k(0,n)
if(m&&!b&&(p.b&8)===0)continue
if((p.b&1)!==0&&p.c===1)a=1
else{a0=A.uG(p.c)
a1=e+a0
if(a1>32)continue
a=B.b.ag(B.b.ag(1,a0)-1,e)
d=(d|B.b.ag(p.d,e)&a)>>>0
e=a1}j.m(0,n,a)
h.m(0,n,p.b)
g.m(0,n,p.f)
f.m(0,n,p.r)}return new A.hk(a2.a,a2.b,a2.c,a2.dk(a5,j,h,g,a2.e),a2.dk(a4,j,h,f,0),d,j)},
dk(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h,g=t.mV
g.a(b)
g.a(c)
g.a(d)
if(a==null)return B.cr
s=A.b([],t.lE)
for(g=t.gX,r=this.a,q=this.b,p=A.r(d).i("ct<1,2>"),o=t.S,n=0;n<=e;++n){m=A.aZ(o)
for(l=new A.ct(d,d.r,d.e,p);l.n();){k=l.d
if(k.b===n)m.k(0,k.a)}if(m.a===0)continue
j=a.ef(m,q,r)
if(j.length===0)continue
l=A.b([],g)
for(i=j.length,h=0;h<j.length;j.length===i||(0,A.i)(j),++h)l.push(this.ft(j[h],m,b,c))
B.a.k(s,new A.hc(l))}return s},
ft(a,b,c,d){var s,r,q,p,o,n,m,l
t.nO.a(b)
s=t.mV
s.a(c)
s.a(d)
for(s=a.b,s=A.vc(s,s.r,A.r(s).c),r=s.$ti.c,q=0,p=!0,o=!0;s.n();){n=s.d
if(n==null)n=r.a(n)
if(!b.u(0,n))continue
m=c.h(0,n)
q=(q|(m==null?0:m))>>>0
l=d.h(0,n)
if(l==null)l=0
p=B.a0.cz(p,(l&2)===0)
o=B.a0.cz(o,(l&4)===0)}return new A.hd(a.a,q)}}
A.k5.prototype={
$2(a,b){var s,r=t.bY
r.a(a)
r.a(b)
r=a.a
s=b.a
return r!==s?r-s:a.e-b.e},
$S:85}
A.bl.prototype={
gl(a){return this.b-this.a},
q(a){return"BidiRun("+this.a+".."+this.b+", level "+this.c+")"}}
A.dU.prototype={}
A.lv.prototype={
ej(a,b){var s,r,q,p,o,n,m,l=this
for(s=l.c,r=l.d,q=l.a,p=J.q(q),o=r.$flags|0,n=0;n<s;++n){m=p.h(q,n)
m=A.ak($.pg(),m)
o&2&&A.w(r)
if(!(n<r.length))return A.a(r,n)
r[n]=m}B.j.bG(l.e,0,r)
l.eW()},
e4(){var s,r,q,p,o=this,n=o.c
if(n===0){n=new Uint8Array(0)
return new A.dU(n,0,B.J,B.J)}n=o.d9(0,n)
o.x=n
o.fF()
s=o.eK()
for(n=s.length,r=0;r<s.length;s.length===n||(0,A.i)(s),++r){q=s[r]
q.h_()
q.h0()
q.h1()
q.h2()
q.h3()
q.h4()
q.h5()
q.fh()
q.fi()
q.f7()}o.fc()
o.eE()
p=o.fd()
return new A.dU(o.f,o.x,p,o.fD(p))},
d9(a,b){var s,r,q,p,o,n
for(s=this.d,r=s.length,q=this.r,p=q.length,o=a;o<b;++o){if(!(o>=0&&o<r))return A.a(s,o)
n=s[o]
if(n===0)return 0
if(n===1||n===2)return 1
if(n===19||n===20||n===21){if(!(o<p))return A.a(q,o)
o=q[o]
if(o>=b)break}}return 0},
eW(){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=h.r,f=h.c
B.C.by(g,0,f,-1)
s=h.w
B.C.by(s,0,f,-1)
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
fF(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=this,a1=new Uint8Array(128),a2=new Uint8Array(128),a3=new Uint8Array(128),a4=a0.x
a4===$&&A.u()
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
b=a0.d9(g+1,d)===1}if(!(k>=0&&k<128))return A.a(a1,k)
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
eK(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1=this,b2=t.t,b3=A.b([],b2),b4=b1.c,b5=new Int32Array(b4)
B.C.by(b5,0,b4,-1)
for(s=b1.d,r=s.length,q=0;q<b4;++q){if(!(q<r))return A.a(s,q)
p=s[q]
if(p===15||p===14||p===17||p===16||p===18||p===9)continue
p=b3.length
if(!(q<b4))return A.a(b5,q)
b5[q]=p
B.a.k(b3,q)}p=t.L
p.a(b3)
b1.y!==$&&A.p7()
b1.y=b3
b1.z!==$&&A.p7()
b1.z=b5
if(b3.length===0)return B.cv
o=A.b([],b2)
n=A.b([],b2)
m=new Int32Array(b4)
B.C.by(m,0,b4,-1)
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
a0===$&&A.u()
a9=a0}a4=B.a.gS(a2)
if(!(a4<r))return A.a(s,a4)
a0=s[a4]
if(a0===19||a0===20||a0===21){if(!(a4<g))return A.a(h,a4)
a0=h[a4]>=b4}else a0=!1
if(a0){a0=b1.x
a0===$&&A.u()
b0=a0}else{if(!(a4<b4))return A.a(b5,a4)
a0=b5[a4]+1
a6=b3.length
if(a0<a6){if(!(a0>=0))return A.a(b3,a0)
a0=b3[a0]
if(!(a0<k))return A.a(l,a0)
b0=l[a0]}else{a0=b1.x
a0===$&&A.u()
b0=a0}}a0=((a7>a9?a7:a9)&1)===1?1:0
B.a.k(d,A.v8(b1,a2,a0,((a7>b0?a7:b0)&1)===1?1:0,a7))}return d},
fc(){var s,r,q,p,o,n,m,l,k=this
for(s=k.c,r=k.x,q=k.f,p=k.d,o=p.length,n=q.length,m=0;m<s;++m){if(!(m<o))return A.a(p,m)
l=p[m]
if(!(l===15||l===14||l===17||l===16||l===18||l===9))continue
if(m>0){l=m-1
if(!(l<n))return A.a(q,l)
l=q[l]}else{r===$&&A.u()
l=r}q.$flags&2&&A.w(q)
if(!(m<n))return A.a(q,m)
q[m]=l}},
eE(){var s,r,q,p,o,n,m,l,k,j,i,h=this
for(s=h.c,r=h.f,q=h.x,p=r.$flags|0,o=h.d,n=o.length,m=0;m<s;++m){if(!(m<n))return A.a(o,m)
l=o[m]
if(l!==10&&l!==11)continue
q===$&&A.u()
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
q===$&&A.u()
p&2&&A.w(r)
if(!(j<r.length))return A.a(r,j)
r[j]=q}},
fd(){var s,r,q,p,o,n,m=A.b([],t.J)
for(s=this.c,r=this.f,q=r.length,p=0,o=1;o<=s;++o){if(o!==s){if(!(o<q))return A.a(r,o)
n=r[o]
if(!(p>=0&&p<q))return A.a(r,p)
n=n!==r[p]}else n=!0
if(n){if(!(p>=0&&p<q))return A.a(r,p)
B.a.k(m,new A.bl(p,o,r[p]))
p=o}}return m},
fD(a){var s,r,q,p,o,n,m,l,k,j,i,h
t.kV.a(a)
s=a.length
if(s===0)return B.J
for(r=0,q=127,p=0;p<s;++p){o=a[p].c
if(o>r)r=o
if((o&1)===1&&o<q)q=o}n=A.a3(a,t.kb)
for(s=n.length,m=r;m>=q;--m)for(l=0;l<s;){if(!(l>=0))return A.a(n,l)
if(n[l].c<m){++l
continue}k=l
for(;;){if(!(k<s&&n[k].c>=m))break;++k}for(j=k-1,i=l;i<j;++i,--j){if(!(i<s))return A.a(n,i)
h=n[i]
if(!(j<s))return A.a(n,j)
n[i]=n[j]
n[j]=h}l=k}return n}}
A.hZ.prototype={
gl(a){return this.b.length},
h_(){var s,r,q,p,o=this.e
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
if(r[p]===8)B.a.m(r,p,o===19||o===20||o===21||o===22?13:o)
o=r[p]}},
h0(){var s,r,q,p,o,n=this.e
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
o=r[p]
if(o===0||o===1||o===2)n=o
else if(o===3&&n===2)B.a.m(r,p,6)}},
h1(){var s,r,q,p
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
if(r[p]===2)B.a.m(r,p,1)}},
h2(){var s,r,q,p,o,n,m,l
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
h3(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
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
h4(){var s,r,q,p,o
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
o=r[p]
if(o===5||o===4||o===7)B.a.m(r,p,13)}},
h5(){var s,r,q,p,o,n=this.e
for(s=this.b,r=this.c,q=r.length,p=0;p<s.length;++p){if(!(p<q))return A.a(r,p)
o=r[p]
if(o===0||o===1)n=o
else if(o===3&&n===0)B.a.m(r,p,0)}},
fh(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=(e.r&1)===1?1:0,c=d===0?1:0
for(s=e.eH(),r=s.length,q=e.c,p=q.length,o=e.e,n=0;n<s.length;s.length===r||(0,A.i)(s),++n){m=s[n]
l=m.a
k=m.b
i=l+1
h=!1
for(;;){if(!(i<k)){j=-1
break}A:{if(!(i>=0&&i<p))return A.a(q,i)
g=A.qv(q[i])
if(g===-1)break A
if(g===d){j=d
break}h=!0}++i}if(j===-1&&h){i=l-1
for(;;){if(!(i>=0)){f=o
break}if(!(i<p))return A.a(q,i)
g=A.qv(q[i])
if(g!==-1){f=g
break}--i}j=f===c?c:d}if(j===-1)continue
B.a.m(q,l,j)
B.a.m(q,k,j)
e.cK(l,j)
e.cK(k,j)}},
cK(a,b){var s,r=a+1,q=this.c,p=this.b
for(;;){if(r<p.length){s=this.d
s===$&&A.u()
if(!(r>=0&&r<s.length))return A.a(s,r)
s=s[r]===8}else s=!1
if(!s)break
B.a.m(q,r,b);++r}},
eH(){var s,r,q,p,o,n,m,l,k,j,i,h,g=t.t,f=A.b([],g),e=A.b([],g),d=A.b([],t.ho)
for(g=this.b,s=this.a.a,r=J.q(s),q=this.c,p=q.length,o=f.$flags|0,n=e.$flags|0,m=0;m<g.length;++m){if(!(m<p))return A.a(q,m)
if(q[m]!==13)continue
l=r.h(s,g[m])
k=$.pf()
switch(A.ak(k,l)&3){case 1:if(f.length===63)return A.qu(d)
j=A.ak(k,l)
B.a.k(f,A.qt(j===0?-1:B.b.L(j,2)))
B.a.k(e,m)
break
case 2:i=A.qt(l)
for(h=f.length-1;h>=0;--h){if(f[h]!==i)continue
if(!(h<e.length))return A.a(e,h)
B.a.k(d,new A.z(e[h],m))
k=f.length
o&1&&A.w(f,18)
A.az(h,k,k)
f.splice(h,k-h)
k=e.length
n&1&&A.w(e,18)
A.az(h,k,k)
e.splice(h,k-h)
break}break}}return A.qu(d)},
fi(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=(e.r&1)===1?1:0
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
f7(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this
for(s=e.b,r=s.length,q=e.a.f,p=q.$flags|0,o=e.r,n=(o&1)===0,m=e.c,l=m.length,k=o+1,j=o+2,i=0;i<r;++i){if(!(i<l))return A.a(m,i)
h=m[i]
if(n)if(h===1)g=k
else g=h===6||h===3?j:o
else g=h===0||h===3||h===6?k:o
f=s[i]
p&2&&A.w(q)
if(!(f<q.length))return A.a(q,f)
q[f]=g}}}
A.lm.prototype={
$2(a,b){var s=t.gn
return B.b.ab(s.a(a).a,s.a(b).a)},
$S:86}
A.ey.prototype={
gl(a){return this.b-this.a},
q(a){return"ScriptRun("+this.a+".."+this.b+", "+A.aB(this.c)+")"}}
A.np.prototype={
$0(){var s,r,q,p=new Int32Array(171)
for(s=0;s<171;++s){r=B.cS.h(0,B.M[s])
q=r==null?1145457748:A.uW(r)
if(!(s<171))return A.a(p,s)
p[s]=q}return p},
$S:89}
A.m.prototype={
gl(a){return this.a.byteLength},
W(a,b){return a>=0&&b>=0&&a+b<=this.a.byteLength},
cv(a){var s
this.j(a,3)
s=this.a
return(s.getUint8(a)<<16|s.getUint8(a+1)<<8|s.getUint8(a+2))>>>0},
a_(a){var s,r,q,p,o=this,n=a*2
o.j(o.b,n)
s=new Uint16Array(a)
for(r=o.a,q=0;q<a;++q){p=r.getUint16(o.b+q*2,!1)
if(!(q<a))return A.a(s,q)
s[q]=p}o.b+=n
return s},
j(a,b){if(!this.W(a,b))throw A.e(A.h("read of "+b+" byte(s) at "+a+" overruns a "+this.gl(0)+"-byte font"))}}
A.ax.prototype={
q(a){return"FontFormatException: "+this.a}}
A.iq.prototype={}
A.iI.prototype={}
A.ib.prototype={
ghO(a){var s=this.b
s===$&&A.u()
return s},
gi1(a){var s=this.c
s===$&&A.u()
return s},
hP(a,b){return this.ghO(this).$1(b)},
i2(a,b){return this.gi1(this).$1(b)}}
A.aU.prototype={
shh(a){this.e=t.nw.a(a)}}
A.jL.prototype={
eh(a,b){var s,r=this,q=r.a.b,p=t.gz.a(A.T(q+2,B.A,!1,t.kp))
r.b!==$&&A.p7()
r.b=p
B.a.m(p,q+1,a)
for(;q>=0;--q){s=q+1
if(!(s<p.length))return A.a(p,s)
B.a.m(p,q,r.f3(p[s],q))}},
dH(a){var s=this.f.h(0,a)
s=s==null?null:s.e
return s==null?B.A:s},
hM(a,b,c){var s={},r=A.b([],t.r)
s.a=0
B.a.Y(this.dH(a),new A.jN(s,r,b,c))
return r},
dw(a,b){var s,r=a.d
if(J.l(r.h(0,"cluster"),!0))return r.h(0,b.a)
s=this.d
s.saf(r)
return b.hP(0,s)},
fX(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
t.kp.a(b)
s=t.N
r=t.O
q=A.C(s,r)
for(p=f.c,o=p.length,n=f.d,m=0;m<p.length;p.length===o||(0,A.i)(p),++m){l=p[m]
k=f.dw(a,l)
for(j=b.length,i=l.a,h=0;h<b.length;b.length===j||(0,A.i)(b),++h){g=f.dw(b[h],l)
n.f=k
n.saf(A.eh([i,g],s,r))
k=l.i2(0,n)}q.m(0,i,k)}return q},
f3(b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3=this
t.kp.a(b4)
s=b3.a
r=s.a/(512*B.b.ae(1,b5))
q=A.C(t.S,t.L)
p=new A.jM(r)
for(o=t.t,n=0;m=b4.length,n<m;++n){m=b4[n]
m=p.$2(m.a,m.b)
l=q.h(0,m)
if(l==null){l=A.b([],o)
q.m(0,m,l)
m=l}else m=l
B.a.k(m,n)}k=new Uint8Array(m)
l=t.r
j=A.b([],l)
i=A.b([],o)
for(o=b3.c,h=b3.f,g=t.N,f=t.O,e=r*r,s=s.c,n=0;n<b4.length;++n){if(!(n<m))return A.a(k,n)
if(k[n]!==0)continue
d=b4[n]
B.a.a8(i)
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
for(a5=i.length,a6=0;a6<i.length;i.length===a5||(0,A.i)(i),++a6){a7=i[a6]
if(!(a7>=0&&a7<b4.length))return A.a(b4,a7)
a2.push(b4[a7])}a2=b3.fX(d,a2)}if(a2!=null)a.F(0,a2)
a.m(0,"$id",b)
a.m(0,"cluster",!0)
a.m(0,"cluster_id",b)
a.m(0,"point_count",a0)
if(a0>=1e4)a2=""+B.c.a3(a0/1000)+"k"
else a2=a0>=1000?A.t(B.c.a3(a0/100)/10)+"k":a0
a.m(0,"point_count_abbreviated",a2)
a=new A.aU(b1/a0,b2/a0,a0,a)
a0=A.b([d],l)
for(a2=i.length,a6=0;a6<i.length;i.length===a2||(0,A.i)(i),++a6){a7=i[a6]
if(!(a7>=0&&a7<b4.length))return A.a(b4,a7)
a0.push(b4[a7])}a.shh(a0)
a.f=b5
h.m(0,b,a)
B.a.k(j,a)}return j}}
A.jN.prototype={
$1(a){var s,r,q=this
t.el.a(a)
s=q.b
if(s.length>=q.c)return
r=a.e
if(r!=null)B.a.Y(r,q)
else if(q.a.a++>=q.d)B.a.k(s,a)},
$S:114}
A.jM.prototype={
$2(a,b){var s=this.a
return B.c.a4(a/s)*67108864+B.c.a4(b/s)},
$S:119}
A.ad.prototype={
gbj(){var s,r,q=new A.jV(),p=new A.jU(),o=this.a,n=q.$1(o),m=this.b,l=q.$1(m),k=this.c,j=q.$1(k),i=p.$1(0.2225045*n+0.7168786*l+0.0606169*j)
q=o===m
s=q&&m===k?i:p.$1((0.4360747*n+0.3850649*l+0.1430804*j)/0.96422)
r=q&&m===k?i:p.$1((0.0139322*n+0.0971045*l+0.7141733*j)/0.82521)
return new A.b3(Math.max(0,116*i-16),500*(s-i),200*(i-r))}}
A.jV.prototype={
$1(a){return a<=0.04045?a/12.92:Math.pow((a+0.055)/1.055,2.4)},
$S:4}
A.jU.prototype={
$1(a){return a>0.008856451679035631?Math.pow(a,0.3333333333333333):a/0.12841854934601665+0.13793103448275862},
$S:4}
A.jS.prototype={
$1(a){return a>0.20689655172413793?a*a*a:0.12841854934601665*(a-0.13793103448275862)},
$S:4}
A.jT.prototype={
$1(a){return B.c.D(a<=0.0031308?12.92*a:1.055*Math.pow(a,0.4166666666666667)-0.055,0,1)},
$S:4}
A.k_.prototype={
$0(){return A.uy(this.a)},
$S:40}
A.jW.prototype={
$1(a){A.Y(a)
return a+a},
$S:38}
A.jX.prototype={
$1(a){return A.Y(a).length!==0},
$S:42}
A.jY.prototype={
$2(a,b){var s,r=this.a
if(!(a<r.length))return A.a(r,a)
s=r[a]
if(B.d.dO(s,"%")){r=A.P(B.d.a6(s,0,s.length-1))
r=(r==null?0:r)/100}else{r=A.P(s)
r=(r==null?0:r)/b}return r},
$S:43}
A.jZ.prototype={
$1(a){var s,r=this
if(a<0)++a
if(a>1)--a
if(a<0.16666666666666666){s=r.a
return s+(r.b-s)*6*a}if(a<0.5)return r.b
if(a<0.6666666666666666){s=r.a
return s+(r.b-s)*(0.6666666666666666-a)*6}return r.a},
$S:4}
A.A.prototype={
saf(a){this.b=t.lb.a(a)},
shN(a){this.r=t.dw.a(a)}}
A.lP.prototype={
$1(a){t.X.a(a)
return a.r==null?a.b.h(0,this.a):this.b.$1(a)},
$S:2}
A.lR.prototype={
$1(a){t.X.a(a)
return this.a},
$S:2}
A.nA.prototype={
$1(a){var s=this.a.$1(a)
return s instanceof A.ck?s:B.d.aO(A.b5(s))},
$S:45}
A.nB.prototype={
$1(a){var s,r,q,p,o,n
for(s=this.a,r=s.length,q=t.j,p=0,o="";p<s.length;s.length===r||(0,A.i)(s),++p){n=s[p]
o+=typeof n=="string"?n:A.b5(a.b.h(0,B.a.gv(q.a(n))))}return B.d.aO(o.charCodeAt(0)==0?o:o)},
$S:5}
A.ny.prototype={
$1(a){return!0},
$S:1}
A.nz.prototype={
$1(a){return J.l(this.a.$1(a),!0)},
$S:1}
A.m3.prototype={
$2(a,b){return J.l(b,"$type")?a.c:a.b.h(0,b)},
$S:48}
A.lV.prototype={
$1(a){var s,r,q
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q)if(!J.l(s[q].$1(a),!0))return!1
return!0},
$S:1}
A.lW.prototype={
$1(a){var s,r,q
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q)if(J.l(s[q].$1(a),!0))return!0
return!1},
$S:1}
A.lX.prototype={
$1(a){var s,r,q
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q)if(J.l(s[q].$1(a),!0))return!1
return!0},
$S:1}
A.lY.prototype={
$1(a){return!t.X.a(a).b.J(this.a)},
$S:1}
A.lZ.prototype={
$1(a){return!this.a.u(0,this.b.$2(t.X.a(a),this.c))},
$S:1}
A.m_.prototype={
$1(a){return this.a.u(0,this.b.$2(t.X.a(a),this.c))},
$S:1}
A.m0.prototype={
$1(a){return J.l(this.a.$2(t.X.a(a),this.b),this.c)},
$S:1}
A.m1.prototype={
$1(a){return!J.l(this.a.$2(t.X.a(a),this.b),this.c)},
$S:1}
A.m2.prototype={
$1(a){var s=this
t.X.a(a)
return A.oI(A.Y(s.a),s.b.$2(a,s.c),s.d)},
$S:1}
A.mn.prototype={
$1(a){var s=this.a
return a<s.length?A.v(s[a]):A.ai(null)},
$S:49}
A.mm.prototype={
$0(){var s,r,q,p=A.b([],t.V)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q)p.push(A.v(s[q]))
return p},
$S:50}
A.nj.prototype={
$1(a){t.f3.a(a)
return new A.nk(this.a.$1(0),a)},
$S:51}
A.nk.prototype={
$1(a){var s=A.D(this.a.$1(t.X.a(a)))
return s==null?null:this.b.$1(s)},
$S:9}
A.mo.prototype={
$1(a){var s,r
t.X.a(a)
s=this.a.$1(a)
A:{if(t.f.b(s)){r=s.h(0,this.b.$1(a))
break A}r=null
break A}return r},
$S:2}
A.mp.prototype={
$1(a){return t.X.a(a).b.h(0,this.a)},
$S:2}
A.mq.prototype={
$1(a){t.X.a(a)
return a.b.h(0,this.a.$1(a))},
$S:2}
A.mB.prototype={
$1(a){var s,r
t.X.a(a)
s=this.a.$1(a)
A:{if(t.f.b(s)){r=s.J(this.b.$1(a))
break A}r=!1
break A}return r},
$S:1}
A.mM.prototype={
$1(a){return t.X.a(a).b.J(this.a)},
$S:1}
A.mX.prototype={
$1(a){return!t.X.a(a).b.J(this.a)},
$S:1}
A.n7.prototype={
$1(a){return t.X.a(a).b},
$S:53}
A.ne.prototype={
$1(a){return t.X.a(a).b.h(0,"$id")},
$S:2}
A.nf.prototype={
$1(a){return t.X.a(a).f},
$S:2}
A.ng.prototype={
$1(a){t.X.a(a)
return B.i.h(0,this.a)},
$S:2}
A.nh.prototype={
$1(a){t.X.a(a)
return 0},
$S:11}
A.mr.prototype={
$1(a){var s=a.r,r=s==null?null:s.$0()
return r!=null&&a.c!=="Polygon"&&this.a.hC(r)},
$S:1}
A.ms.prototype={
$1(a){var s=a.r,r=s==null?null:s.$0()
return r==null?null:this.a.hn(r,a.c!=="Point")},
$S:9}
A.mt.prototype={
$1(a){var s,r=this.a.$1(t.X.a(a))
A:{if(r==null){s="null"
break A}if(typeof r=="string"){s="string"
break A}if(typeof r=="number"){s="number"
break A}if(A.M(r)){s="boolean"
break A}if(t.j.b(r)){s="array"
break A}if(r instanceof A.ad){s="color"
break A}s="object"
break A}return s},
$S:5}
A.mu.prototype={
$1(a){var s=A.bw(this.a.$1(t.X.a(a)))
return s==null?null:A.b([s.a*255,s.b*255,s.c*255,s.d],t.n)},
$S:55}
A.mv.prototype={
$1(a){var s,r,q,p,o,n,m
t.X.a(a)
s=this.a.$1(a)
r=typeof s=="string"
if(r)q=s.length
else q=t.j.b(s)?J.Z(s):-1
if(q<0)return null
p=new A.ni(q)
o=p.$2(this.b.$1(a),0)
n=this.c
m=Math.max(o,A.wO(p.$2(n==null?null:n.$1(a),q)))
if(r)r=B.d.a6(s,o,m)
else{s.toString
r=J.rV(t.j.a(s),o,m)}return r},
$S:2}
A.ni.prototype={
$2(a,b){var s=A.D(a),r=s==null?null:B.c.N(s)
if(r==null)r=b
if(r<0)r+=this.a
return B.b.D(r,0,this.a)},
$S:56}
A.mw.prototype={
$1(a){var s,r,q,p
t.X.a(a)
s=this.a.$1(a)
r=this.b.$1(a)
q=this.c
q=A.D(q==null?null:q.$1(a))
p=q==null?null:B.c.N(q)
if(p==null)p=0
if(typeof s=="string"&&typeof r=="string")return B.d.aK(s,r,p)
if(t.j.b(s))return J.rR(s,r,p)
return-1},
$S:31}
A.mx.prototype={
$1(a){return t.X.a(a).a},
$S:11}
A.my.prototype={
$1(a){return t.X.a(a).c},
$S:5}
A.mz.prototype={
$1(a){return!A.r1(this.a.$1(t.X.a(a)))},
$S:1}
A.mA.prototype={
$1(a){var s,r,q=this
t.X.a(a)
s=q.a.$1(a)
if(typeof s=="string")s=s.toLowerCase()
r=q.b.$1(a)
if(typeof r=="string")r=r.toLowerCase()
if(q.c)return J.l(s,r)===(q.d==="==")
return A.oI(q.d,s,r)},
$S:1}
A.mC.prototype={
$1(a){t.X.a(a)
return J.l(this.a.$1(a),this.b.$1(a))},
$S:1}
A.mD.prototype={
$1(a){t.X.a(a)
return!J.l(this.a.$1(a),this.b.$1(a))},
$S:1}
A.mE.prototype={
$1(a){t.X.a(a)
return A.oI(this.a,this.b.$1(a),this.c.$1(a))},
$S:1}
A.mF.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].$1(a)
o=!1
if(p!=null){n=J.aj(p)
if(!n.B(p,!1))if(!n.B(p,0))if(!n.B(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(!p)return!1}return!0},
$S:1}
A.mG.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].$1(a)
o=!1
if(p!=null){n=J.aj(p)
if(!n.B(p,!1))if(!n.B(p,0))if(!n.B(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(p)return!0}return!1},
$S:1}
A.mH.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].$1(a)
o=!1
if(p!=null){n=J.aj(p)
if(!n.B(p,!1))if(!n.B(p,0))if(!n.B(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(p)return!1}return!0},
$S:1}
A.mI.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
for(s=this.a,r=0;q=r+1,p=s.length,q<p;r+=2){if(!(r<p))return A.a(s,r)
p=s[r].$1(a)
o=!1
if(p!=null){n=J.aj(p)
if(!n.B(p,!1))if(!n.B(p,0))if(!n.B(p,""))p=!(typeof p=="number"&&isNaN(p))
else p=o
else p=o
else p=o}else p=o
if(p){if(!(q<s.length))return A.a(s,q)
return s[q].$1(a)}}return r<p?s[r].$1(a):null},
$S:2}
A.mJ.prototype={
$1(a){var s
t.X.a(a)
s=this.a.h(0,this.b.$1(a))
return(s==null?this.c:s).$1(a)},
$S:2}
A.mK.prototype={
$1(a){var s,r,q,p
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].$1(a)
if(p!=null)return p}return null},
$S:2}
A.mL.prototype={
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
A.mN.prototype={
$1(a){return A.b5(this.a.$1(t.X.a(a)))},
$S:5}
A.mO.prototype={
$1(a){var s,r,q,p,o,n,m,l=A.D(this.a.$1(t.X.a(a)))
if(l==null)return""
s=this.b
r=B.c.i9(l,s)
q=this.c
if(s>q&&B.d.u(r,".")){s=B.d.aC(r,".")
p=q===0?0:1
o=s+q+p
n=r.length
m=n
for(;;){if(m>o){s=m-1
if(!(s>=0))return A.a(r,s)
s=r[s]==="0"}else s=!1
if(!s)break;--m}r=B.d.a6(r,0,m>0&&r[m-1]==="."?m-1:m)}return r},
$S:5}
A.mP.prototype={
$1(a){t.X.a(a)
return A.b(A.b5(this.a.$1(a)).split(A.b5(this.b.$1(a))),t.s)},
$S:58}
A.mQ.prototype={
$1(a){var s,r
t.X.a(a)
s=this.a.$1(a)
A:{if(t.j.b(s)){r=J.il(s,A.wX(),t.N).ac(0,A.b5(this.b.$1(a)))
break A}r=""
break A}return r},
$S:5}
A.mR.prototype={
$1(a){var s,r,q,p,o
t.X.a(a)
s=A.b([],t.n)
for(r=this.a,q=r.length,p=0;p<r.length;r.length===q||(0,A.i)(r),++p){o=r[p].$1(a)
if(!(typeof o=="number"))if(typeof o=="string")o=A.P(o)
else if(A.M(o))o=o?1:0
else o=null
s.push(o==null?0:o)}if(s.length<3)return null
r=B.c.X(s[0],360)
q=B.c.D(s[1]/100,0,1)
if(2>=s.length)return A.a(s,2)
o=B.c.D(s[2]/100,0,1)
s=s.length>3?s[3]:1
return A.qb(r/360,q,o,s)},
$S:23}
A.mS.prototype={
$1(a){var s,r,q,p,o
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].$1(a)
if(!(typeof p=="number"))if(typeof p=="string"){o=A.P(p)
p=o}else{if(A.M(p))o=p?1:0
else o=null
p=o}if(p!=null)return p}return this.b==="to-number"?0:null},
$S:9}
A.mT.prototype={
$1(a){return A.r1(this.a.$1(t.X.a(a)))},
$S:1}
A.mU.prototype={
$1(a){return A.bw(this.a.$1(t.X.a(a)))},
$S:23}
A.mV.prototype={
$1(a){var s,r,q,p
t.X.a(a)
for(s=this.a,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q].$1(a)
if(p!=null)return p}return null},
$S:2}
A.mW.prototype={
$1(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=null
t.X.a(a)
s=A.b([],t.eJ)
for(r=this.a,q=r.length,p=t.j,o=t.s,n=0;n<r.length;r.length===q||(0,A.i)(r),++n){m=r[n]
l=m.a
k=m.b
j=m.c
m=j?"":A.b5(l.$1(a))
i=j?A.b5(l.$1(a)):c
h=k.h(0,"font-scale")
h=h==null?c:h.$1(a)
if(!(typeof h=="number"))if(typeof h=="string")h=A.P(h)
else if(A.M(h))h=h?1:0
else h=c
if(h==null)h=1
g=k.h(0,"text-font")
f=g==null?c:g.$1(a)
A:{if(p.b(f)){g=A.b([],o)
for(e=J.G(f);e.n();)g.push(A.t(e.gp()))
break A}g=c
break A}e=k.h(0,"text-color")
e=A.bw(e==null?c:e.$1(a))
d=k.h(0,"vertical-align")
s.push(new A.br(i,m,h,g,e,A.bh(d==null?c:d.$1(a))))}return new A.ck(s)},
$S:60}
A.mY.prototype={
$1(a){var s,r,q,p
t.X.a(a)
for(s=this.a,r=s.length,q=0,p="";q<s.length;s.length===r||(0,A.i)(s),++q)p+=A.b5(s[q].$1(a))
return p.charCodeAt(0)==0?p:p},
$S:5}
A.mZ.prototype={
$1(a){return A.b5(this.a.$1(t.X.a(a))).toUpperCase()},
$S:5}
A.n_.prototype={
$1(a){return A.b5(this.a.$1(t.X.a(a))).toLowerCase()},
$S:5}
A.n0.prototype={
$1(a){var s,r,q,p,o,n,m
t.X.a(a)
for(s=this.a,r=s.length,q=this.b,p=null,o=0;o<s.length;s.length===r||(0,A.i)(s),++o){n=s[o].$1(a)
if(!(typeof n=="number"))if(typeof n=="string"){m=A.P(n)
n=m}else{if(A.M(n))m=n?1:0
else m=null
n=m}if(n==null)return null
if(p==null)p=n
else{A:{if("+"===q){m=p+n
break A}if("*"===q){m=p*n
break A}if("min"===q){m=Math.min(p,n)
break A}m=Math.max(p,n)
break A}p=m}}return p},
$S:9}
A.n1.prototype={
$1(a){return-a},
$S:4}
A.n2.prototype={
$1(a){var s,r,q,p
t.X.a(a)
s=A.D(this.a.$1(a))
r=A.D(this.b.$1(a))
if(s==null||r==null)return null
q=this.c
A:{if("-"===q){p=s-r
break A}if("/"===q){p=s/r
break A}if("%"===q){p=B.c.X(s,r)
break A}p=Math.pow(s,r)
break A}return p},
$S:9}
A.n3.prototype={
$1(a){return B.c.a0(a)},
$S:4}
A.n4.prototype={
$1(a){return Math.floor(a)},
$S:4}
A.n5.prototype={
$1(a){return Math.ceil(a)},
$S:4}
A.n6.prototype={
$1(a){return Math.abs(a)},
$S:4}
A.n8.prototype={
$1(a){return Math.log(a)/2.302585092994046},
$S:4}
A.n9.prototype={
$1(a){return Math.log(a)/0.6931471805599453},
$S:4}
A.na.prototype={
$1(a){var s,r=this.a.$1(t.X.a(a))
if(typeof r=="string")s=r.length
else s=t.j.b(r)?J.Z(r):null
return s},
$S:61}
A.nb.prototype={
$1(a){var s,r
t.X.a(a)
s=this.a.$1(a)
r=this.b.$1(a)
if(t.j.b(s))return J.pm(s,r)
if(typeof s=="string"&&typeof r=="string")return B.d.u(s,r)
return!1},
$S:1}
A.nc.prototype={
$1(a){var s,r,q
t.X.a(a)
s=this.a.$1(a)
r=A.D(this.b.$1(a))
q=r==null?null:B.c.N(r)
return t.j.b(s)&&q!=null&&q>=0&&q<J.Z(s)?J.aL(s,q):null},
$S:62}
A.nd.prototype={
$1(a){var s,r,q,p,o,n
t.X.a(a)
s=A.b([],t.n)
for(r=this.a,q=r.length,p=0;p<r.length;r.length===q||(0,A.i)(r),++p){o=r[p].$1(a)
if(!(typeof o=="number"))if(typeof o=="string")o=A.P(o)
else if(A.M(o))o=o?1:0
else o=null
s.push(o==null?0:o)}r=s.length
if(r<3)return null
q=s[0]
o=s[1]
n=s[2]
s=r>3?s[3]:1
return new A.ad(q/255,o/255,n/255,s)},
$S:23}
A.m4.prototype={
$1(a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this
t.X.a(a5)
s=A.D(a4.a.$1(a5))
if(s==null||s<=B.a.gv(a4.b))return B.a.hx(a4.c,a5)
r=a4.b
if(s>=B.a.gS(r))return B.a.hL(a4.c,a5)
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
if(r!=null){r=A.vI(r,m/n)
l=r}else{r=a4.e
r=r===1?m/n:(Math.pow(r,m)-1)/(Math.pow(r,n)-1)
l=r}}r=a4.c
if(!(q<r.length))return A.a(r,q)
k=r[q].$1(a5)
if(!(p<r.length))return A.a(r,p)
j=r[p].$1(a5)
if(typeof k=="number"&&typeof j=="number"){if(a4.f&&k>0&&j>0)return k*Math.pow(j/k,l)
return k+(j-k)*l}r=t.j
if(r.b(k)&&r.b(j)&&J.Z(k)===J.Z(j)){r=A.b([],t.n)
for(q=J.q(k),o=J.q(j),i=0;i<q.gl(k);++i){h=q.h(k,i)
if(!(typeof h=="number"))if(typeof h=="string")h=A.P(h)
else if(A.M(h))h=h?1:0
else h=null
if(h==null)h=0
g=o.h(j,i)
if(!(typeof g=="number"))if(typeof g=="string")g=A.P(g)
else if(A.M(g))g=g?1:0
else g=null
if(g==null)g=0
f=q.h(k,i)
if(!(typeof f=="number"))if(typeof f=="string")f=A.P(f)
else if(A.M(f))f=f?1:0
else f=null
r.push(h+(g-(f==null?0:f))*l)}return r}e=A.bw(k)
d=A.bw(j)
if(e!=null&&d!=null){c=a4.r
A:{if("hcl"===c){k=e.gbj()
j=d.gbj()
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
h=A.qa(r+(j.a-r)*l,q*a5,o*a5,h+(d.d-h)*l)
r=h
break A}if("lab"===c){k=e.gbj()
j=d.gbj()
r=k.a
q=k.b
o=k.c
h=e.d
h=A.qa(r+(j.a-r)*l,q+(j.b-q)*l,o+(j.c-o)*l,h+(d.d-h)*l)
r=h
break A}r=e.a
q=d.a
o=e.b
h=d.b
g=e.c
f=d.c
a3=e.d
a3=new A.ad(r+(q-r)*l,o+(h-o)*l,g+(f-g)*l,a3+(d.d-a3)*l)
r=a3
break A}return r}return k},
$S:2}
A.lN.prototype={
$3(a,b,c){var s=1-a,r=3*s
return r*s*a*b+r*a*a*c+a*a*a},
$S:63}
A.m8.prototype={
$1(a){return a.b.h(0,this.a)},
$S:2}
A.m9.prototype={
$1(a){return a.a},
$S:11}
A.ma.prototype={
$1(a){var s=this.a.$1(t.X.a(a))
return s==null?this.b:s},
$S:2}
A.mb.prototype={
$1(a){var s
if(t.j.b(a)){s=J.q(a)
s=s.gI(a)&&t.f.b(s.gv(a))}else s=!1
return s},
$S:12}
A.mc.prototype={
$1(a){var s=this.a.h(0,this.b.$1(t.X.a(a)))
return s==null?this.c:s},
$S:2}
A.md.prototype={
$1(a){var s
if(typeof a!="number"){if(t.j.b(a)){s=J.q(a)
s=s.gI(a)&&s.aj(a,new A.m7())}else s=!1
s=s||A.bw(a)!=null}else s=!0
return s},
$S:19}
A.m7.prototype={
$1(a){return typeof a=="number"},
$S:12}
A.me.prototype={
$1(a){var s,r,q,p,o,n,m=this,l=A.D(m.a.$1(t.X.a(a)))
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
A.mf.prototype={
$1(a){t.X.a(a)
return a.b.h(0,this.a)==null?this.b:this.c.$1(a)},
$S:2}
A.lQ.prototype={
$1(a){return a.a},
$S:11}
A.fo.prototype={}
A.fK.prototype={
h8(c7,c8,c9,d0,d1,d2,d3,d4,d5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4=this,c5={},c6=t.L
c6.a(c9)
c6.a(d0)
if(d1<d2)return
s=c5.a=-1
r=c4.x
r.b=0
q=A.b([],t.t)
c6=c4.e
p=B.b.O(c6.b,4)
o=c4.r
n=o.b
m=new A.iT(c5,c4,r,q)
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
a2=A.cj(c8,a,(d+b)*2)
if(j){a2=A.xv(a2,d5)
b=a2.length/2|0}for(a=a2.length,a3=0,a4=0;a4<b;a4=a5){a5=a4+1
a6=B.b.X(a5,b)
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
g+=a2[a0]*a3/b}}else if(c5.a>=0)B.a.k(q,B.b.O(r.b,2))
else continue
a0=b*2
a9=new Float64Array(a0)
for(a4=0;a4<b;){a1=a4*2
if(!(a1<a))return A.a(a2,a1)
b0=a2[a1]
a7=a1+1
if(!(a7<a))return A.a(a2,a7)
b1=a2[a7]
r.b0(b0,b1);++a4
a8=B.b.X(a4,b)*2
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
a9[a7]=b0-b2}b4=j?A.xz(a9):null
for(a1=b4!=null,b5=0,a4=0;a4<b;++a4){a7=a4*2
if(!(a7<a0))return A.a(a9,a7)
b6=a9[a7]
a8=a7+1
if(!(a8<a0))return A.a(a9,a8)
b7=a9[a8]
if(b6===0&&b7===0)continue
a6=B.b.X(a4+1,b)
if(!(a7<a))return A.a(a2,a7)
a7=a2[a7]
if(!(a8<a))return A.a(a2,a8)
a8=a2[a8]
b8=a6*2
if(!(b8>=0&&b8<a))return A.a(a2,b8)
b9=a2[b8];++b8
if(!(b8<a))return A.a(a2,b8)
c6.an(a7,a8,b9,a2[b8])
b8=b6*b6+b7*b7
c0=Math.sqrt(b8)
if(b5+c0>16384)b5=0
a7=B.c.a0(b5*2)
b5+=c0
k.b0(B.c.a0(b5*2)/2,a7/2)
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
l.an(b8,b9,c1,b4[a7])}else{c2=Math.sqrt(b8)
a7=b6/c2
a8=b7/c2
l.an(a7,a8,a7,a8)}}}m.$0()
c3=B.b.O(c6.b,4)-p
if(c3===0||f===0)return
if(d4!=null){c6=c4.as
s=B.a.aC(c6,d4)
if(s<0){s=c6.length
B.a.k(c6,d4)}}B.a.k(c4.Q,s)
c6=c4.w
c6.an(d1,d2,h/f,g/f)
c6.an(p,c3,n,o.b-n)
o=d3.d
c6.an(d3.a*o,d3.b*o,d3.c*o,1)},
hw(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3=this,c4={},c5=c3.w,c6=c5.b
if(c6===0)return null
for(s=c5.a,r=s.length,q=0,p=0;p<c6;p+=12){o=p+5
if(!(o<r))return A.a(s,o)
o=B.c.N(s[o])
n=p+7
if(!(n<r))return A.a(s,n)
q+=o*6+B.c.N(s[n])}m=new Float32Array(q*11)
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
b=B.c.D(B.c.a0(j[g]*255),0,255)
g=B.c.a3(e*255)
j=B.c.a3(d*255)
i=B.c.a3(c*255)
a=B.b.O(p,12)
if(!(a<k.length))return A.a(k,a)
a0=new A.iU(c4,c3,m,g+j*256+i*65536,b,f,h,k[a]+1)
a=p+4
i=c5.a
j=i.length
if(!(a<j))return A.a(i,a)
a1=B.c.N(i[a])
a=p+5
if(!(a<j))return A.a(i,a)
for(j=a1+B.c.N(i[a]),a2=f*n,a3=h*n,a4=a1;a4<j;++a4){i=a4*4
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
b8=B.c.N(i[j])
j=p+7
if(!(j<g))return A.a(i,j)
for(j=b8+B.c.N(i[j]),a4=b8;a4<j;++a4){i=c6.a
if(!(a4>=0&&a4<i.length))return A.a(i,a4)
i=B.c.N(i[a4])*2
g=s.a
a=g.length
if(!(i>=0&&i<a))return A.a(g,i)
b9=g[i];++i
if(!(i<a))return A.a(g,i)
c0=g[i]
a0.$8(b9,c0,h,0,0,1,b9,c0)}}c1=new Float32Array(A.a1(A.cj(l.a,0,l.b)))
c2=new Float32Array(A.a1(A.cj(c5.a,0,c5.b)))
c5=new Float32Array(A.a1(A.cj(s.a,0,s.b)))
c6=new Float32Array(A.a1(A.cj(c6.a,0,c6.b)))
s=A.t5(c1,c2)
r=A.a3(c3.as,t.N)
return new A.fo(s,m,r,c3.a,c1,c5,c6,c2)}}
A.iT.prototype={
$0(){var s,r,q,p,o,n,m,l,k,j,i=this,h=i.a
if(h.a<0||i.c.b<6)return
s=i.c
r=i.d
q=A.pC(B.o.H(s.a,0,s.b),r)
p=i.b
o=p.f
n=o.b
m=B.b.O(n,2)
n+=s.b
if(n>o.a.length)o.bi(n)
n=o.a
l=o.b
B.o.Z(n,l,l+s.b,s.a)
o.b=o.b+s.b
for(o=q.length,p=p.r,k=0;k<q.length;q.length===o||(0,A.i)(q),++k){j=q[k]
n=p.b
if(n===p.a.length)p.bi(n+1)
n=p.a
l=p.b++
n.$flags&2&&A.w(n)
if(!(l<n.length))return A.a(n,l)
n[l]=m+j}s.b=0
B.a.a8(r)
h.a=-1},
$S:0}
A.iU.prototype={
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
n=n.c?B.c.D((f+Math.max(0,q.f))*Math.sqrt(Math.max(0,q.r)/150),0.7+0.28*(1-n.b.a),1):1}if(!(m<s))return A.a(p,m)
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
$S:65}
A.br.prototype={}
A.ck.prototype={
q(a){var s=this.a,r=A.L(s)
return new A.an(s,r.i("p(1)").a(new A.j_()),r.i("an<1,p>")).bB(0)}}
A.j_.prototype={
$1(a){return t.oc.a(a).b},
$S:66}
A.nP.prototype={
$1(a){t.oc.a(a)
return a.c===1&&a.d==null&&a.e==null&&a.f==null&&a.a==null},
$S:67}
A.bs.prototype={
cZ(a){var s,r,q,p,o,n=this,m=t.f
if(!m.b(a))return
switch(a.h(0,"type")){case"FeatureCollection":s=a.h(0,"features")
if(t.j.b(s))J.of(s,n.gf4())
break
case"Feature":r=a.h(0,"properties")
q=A.C(t.N,t.O)
if(m.b(r))for(m=r.gah(),m=m.gt(m);m.n();){p=m.gp()
q.m(0,A.t(p.a),p.b)}if(n.b)o=n.c++
else{m=n.a
o=m!=null?q.h(0,m):a.h(0,"id")}q.ap(0,"$id")
if(o!=null)q.m(0,"$id",o)
n.bT(a.h(0,"geometry"),q)
break
default:n.bT(a,B.i)}},
bT(a,b){var s,r,q,p,o,n,m,l=this
t.lb.a(b)
if(!t.f.b(a))return
s=a.h(0,"coordinates")
switch(a.h(0,"type")){case"Point":l.aH(1,b,A.b([A.fL([s])],t.w))
break
case"MultiPoint":if(t.j.b(s))l.aH(1,b,A.b([A.fL(s)],t.w))
break
case"LineString":if(t.j.b(s))l.aH(2,b,A.b([A.fL(s)],t.w))
break
case"MultiLineString":r=t.j
if(r.b(s)){q=A.b([],t.w)
for(p=J.G(s);p.n();){o=p.gp()
if(r.b(o))q.push(A.fL(o))}l.aH(2,b,q)}break
case"Polygon":if(t.j.b(s))l.aH(3,b,l.df(s))
break
case"MultiPolygon":r=t.j
if(r.b(s)){q=A.b([],t.w)
for(p=J.G(s);p.n();){n=p.gp()
if(r.b(n))B.a.F(q,l.df(n))}l.aH(3,b,q)}break
case"GeometryCollection":m=a.h(0,"geometries")
if(t.j.b(m))for(r=J.G(m);r.n();)l.bT(r.gp(),b)
break}},
df(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=A.b([],t.w)
for(s=J.q(a),r=t.j,q=0;q<s.gl(a);++q){p=s.h(a,q)
if(!r.b(p))continue
o=A.fL(p)
n=o.length
if(n<6)continue
if(A.tD(o)>0!==(q===0))for(m=n-2,n=o.$flags|0,l=0;l<m;l+=2,m-=2){k=o[l]
j=l+1
i=o[j]
h=o[m]
n&2&&A.w(o)
o[l]=h
h=m+1
o[j]=o[h]
o[m]=k
o[h]=i}B.a.k(g,o)}return g},
aH(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
t.lb.a(b)
t.lt.a(c)
if(this.e&&a===1){for(s=c.length,r=this.f,q=0;q<c.length;c.length===s||(0,A.i)(c),++q){p=c[q]
for(o=p.length,n=0;n<o;n+=2){m=p[n]
l=n+1
if(!(l<o))return A.a(p,l)
B.a.k(r,new A.aU(m,p[l],1,b))}}return}for(s=c.length,k=1/0,j=1/0,i=-1/0,h=-1/0,q=0;q<s;++q){p=c[q]
for(r=p.length,n=0;n<r;n+=2){g=p[n]
if(g<k)k=g
if(g>i)i=g
o=n+1
if(!(o<r))return A.a(p,o)
f=p[o]
if(f<j)j=f
if(f>h)h=f}}if(k>i)return
B.a.k(this.d,new A.hR(a,b,c,k,j,i,h))},
aq(b4,b5,b6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6=B.b.ae(1,b4),a7=0.03125/a6,a8=0.25/a6,a9=b5/a6,b0=b6/a6,b1=(b5+1)/a6,b2=(b6+1)/a6,b3=A.b([],t.fB)
for(s=this.d,r=s.length,q=t.n,p=t.w,o=0;o<s.length;s.length===r||(0,A.i)(s),++o){n=s[o]
m=n.a
l=m===2
k=l?a8:a7
if(n.f<a9-k||n.d>b1+k||n.r<b0-k||n.e>b2+k)continue
j=A.b([],p)
i=l?A.b([],q):null
for(l=n.c,h=l.length,g=0;g<l.length;l.length===h||(0,A.i)(l),++g){f=l[g]
e=f.length
d=new Float64Array(e)
for(c=0;c<e;c+=2){b=B.c.a0((f[c]*a6-b5)*4096*2)
if(!(c<e))return A.a(d,c)
d[c]=b/2
b=c+1
if(!(b<e))return A.a(f,b)
a=B.c.a0((f[b]*a6-b6)*4096*2)
if(!(b<e))return A.a(d,b)
d[b]=a/2}switch(m){case 1:B.a.k(j,d)
break
case 2:a0=A.b([],q)
a1=A.tE(d,j,a0)
for(e=a0.length,b=1/a1,a=a1===0,a2=0;a2<a0.length;a0.length===e||(0,A.i)(a0),++a2){a3=a0[a2]
i.toString
B.a.k(i,a?0:a3/a1)
B.a.k(i,a?0:b)}break
default:a4=A.tF(d)
if(a4.length>=6)B.a.k(j,a4)}}if(j.length!==0)B.a.k(b3,new A.dw(i,m,n.b,j))}s=this.r
if(s==null)s=null
else{r=s.b
r===$&&A.u()
s=B.b.D(b4,0,s.a.b+1)
if(!(s>=0&&s<r.length))return A.a(r,s)
s=r[s]}if(s==null)s=B.A
r=s.length
q=a9-a7
m=b1+a7
l=b0-a7
h=b2+a7
o=0
for(;o<s.length;s.length===r||(0,A.i)(s),++o){a5=s[o]
e=a5.a
b=!0
if(!(e<q))if(!(e>m)){b=a5.b
b=b<l||b>h}if(b)continue
b=new Float64Array(2)
b[0]=B.c.a0((e*a6-b5)*4096*2)/2
b[1]=B.c.a0((a5.b*a6-b6)*4096*2)/2
B.a.k(b3,new A.dw(null,1,a5.d,A.b([b],p)))}return b3.length===0?B.a7:A.b([new A.i2(b3)],t.n5)}}
A.j4.prototype={
$0(){var s=this.a,r=s.a
if(r.length>=4){B.a.k(this.b,new Float64Array(A.a1(r)))
B.a.k(this.c,s.b)}s.a=A.b([],t.n)},
$S:0}
A.j3.prototype={
$2(a,b){var s,r=this.a
if(!r.c)return
if(a===0){if(b<0)r.c=!1
return}s=b/a
if(a<0){if(s>r.b)r.c=!1
else if(s>r.a)r.a=s}else if(s<r.a)r.c=!1
else if(s<r.b)r.b=s},
$S:68}
A.j5.prototype={
$2(a,b){var s,r=this.a
A:{if(0===r){s=a>=-128
break A}if(1===r){s=a<=4224
break A}if(2===r){s=b>=-128
break A}s=b<=4224
break A}return s},
$S:15}
A.hR.prototype={}
A.i2.prototype={
gaw(){return""},
gcg(){return 4096},
$idq:1,
gbx(){return this.a}}
A.dw.prototype={
bs(a){return this.c},
cp(a){var s,r,q,p,o,n,m,l,k
for(s=this.d,r=s.length,q=a.c,p=0;p<s.length;s.length===r||(0,A.i)(s),++p){o=s[p]
B.a.k(q,a.b>>>1)
for(n=o.length,m=0;m<n;m+=2){l=o[m]
k=m+1
if(!(k<n))return A.a(o,k)
a.c4(l,o[k])}}B.a.k(q,a.b>>>1)},
$ihw:1,
gK(){return this.b}}
A.nO.prototype={
$1(a){var s,r,q
for(s=a+1,r=this.a;s<r.length;++s){q=B.N.h(0,r[s])
if((q==null?0:q)!==1)return s}return null},
$S:70}
A.j8.prototype={
hX(a){var s,r,q
t.bF.a(a)
s=B.a.ac(a,"\x01")
r=this.e
q=r.h(0,s)
if(q==null){q=new A.ja(this,a).$0()
r.m(0,s,q)
r=q}else r=q
return r},
gl(a){return this.c.length},
hy(a,b){var s=A.tH(b),r=this.f,q=a*1000+s,p=r.h(0,q)
if(p==null){p=new A.j9(this,a,s).$0()
r.m(0,q,p)
r=p}else r=p
return r}}
A.ja.prototype={
$0(){var s,r,q,p,o,n,m,l=A.b([],t.t)
for(s=this.b,r=s.length,q=this.a,p=q.c,q=q.d,o=0;o<s.length;s.length===r||(0,A.i)(s),++o){n=A.pE(s[o])
for(m=0;m<p.length;++m){if(!(m<q.length))return A.a(q,m)
if(q[m]===n&&!B.a.u(l,m))B.a.k(l,m)}}for(m=0;m<p.length;++m)if(!B.a.u(l,m))B.a.k(l,m)
return l},
$S:71}
A.j9.prototype={
$0(){var s,r=this.a.c,q=this.b
if(!(q>=0&&q<r.length))return A.a(r,q)
s=r[q]
r=s.a
if(!r.c.J(1719034226))return s
q=t.i
return new A.bZ(r,A.or(t.H.a(s.hW(A.eh(["wght",this.c],t.N,q))),q))},
$S:72}
A.k3.prototype={}
A.lO.prototype={
$2(a,b){return A.dD(a)+A.dD(b)},
$S:32}
A.nQ.prototype={
$0(){var s,r,q,p,o=this
if(!o.b){s=o.c
s=s==1/0||s==-1/0}else s=!0
r=o.d
q=o.a
p=q.a
if(s)B.a.k(r,p)
else B.a.F(r,A.vJ(o.e,p,o.f,o.r,o.c,o.w))
q.a=A.b([],t.t)},
$S:0}
A.m6.prototype={
$2(a,b){return Math.max(A.dD(a),t.hT.a(b).b)},
$S:74}
A.bv.prototype={}
A.i5.prototype={
C(){var s,r,q,p,o,n
for(s=this.a,r=s.length,q=0,p=0;;){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
p=(p|B.b.ag(n&127,q))>>>0
if(n<128)return p
q+=7}},
dW(){var s=this,r=s.C(),q=s.b,p=q+r
s.b=p
return new A.i5(s.a,q,p)},
T(a,b){var s,r=this
switch(b){case 0:r.C()
break
case 1:r.b+=8
break
case 2:s=r.C()
r.b+=s
break
case 5:r.b+=4
break
default:throw A.e(A.iZ("glyph pbf: wire type "+b,null,null))}}}
A.jb.prototype={
hr(a){var s=B.a.ac(t.bF.a(a),",")
return this.f.b5(s,new A.jc(this,s))},
i_(a,b){var s,r,q,p,o,n,m
for(s=new A.dn(b),r=this.w,q=this.x,p=a<<16,o=!0;s.n();){n=B.b.L(s.d,8)
m=(p|n)>>>0
if(q.u(0,m))continue
if(r.k(0,m))this.bh(a,n,m)
o=!1}return o},
bh(a,b,a0){var s=0,r=A.av(t.o),q,p=2,o=[],n=this,m,l,k,j,i,h,g,f,e,d,c
var $async$bh=A.aw(function(a1,a2){if(a1===1){o.push(a2)
s=p}for(;;)switch(s){case 0:e=n.e
d=a-512
if(!(d>=0&&d<e.length)){q=A.a(e,d)
s=1
break}e=A.vv(2,e[d],B.w,!1)
e=A.p6(n.a,"{fontstack}",e)
j=b*256
m=A.p6(e,"{range}",""+j+"-"+(j+255))
l=B.cw
p=4
e=n.y
if(e==null)e=n.y=new A.er()
s=7
return A.W(e.ba(m,n.c),$async$bh)
case 7:k=a2
if(k.a===200)l=A.tJ(k.b)
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
h.m(0,f.a,f)}n.x.k(0,a0)
n.d.$2(a,l)
case 1:return A.at(q,r)
case 2:return A.as(o.at(-1),r)}})
return A.au($async$bh,r)}}
A.jc.prototype={
$0(){var s=this.a,r=s.e
B.a.k(r,this.b)
B.a.k(s.r,A.C(t.S,t.jv))
return 512+r.length-1},
$S:7}
A.je.prototype={
cu(){var s,r,q,p,o,n=this,m=n.d
m=J.pk(B.P.gao(m),m.byteOffset,m.length)
s=A.b([],t.dO)
for(r=n.e,q=r.length,p=0;p<r.length;r.length===q||(0,A.i)(r),++p){o=r[p]
s.push([o.a,o.b])}return[n.c,m,s,n.f,n.b,n.a]}}
A.jf.prototype={
$1(a){return B.b.D(B.c.a3(a*128),-2048,2047)+2048},
$S:18}
A.jy.prototype={}
A.em.prototype={$idq:1,
gaw(){return this.a},
gcg(){return this.b},
gbx(){return this.e}}
A.el.prototype={
bs(a){var s,r,q,p,o,n,m,l,k=this
t.dl.a(a)
s=A.C(t.N,t.O)
r=k.c
if(r!=null)s.m(0,"$id",r)
r=k.e
q=new A.c8(k.a,k.d,r)
for(p=a.c,o=a.d;q.b<r;){n=q.C()
m=q.C()
if(!(n<p.length))return A.a(p,n)
l=p[n]
if(!(m<o.length))return A.a(o,m)
s.m(0,l,o[m])}return s},
cp(a){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=h.r,f=new A.c8(h.a,h.f,g),e=h.b===1
if(e)B.a.k(a.c,a.b>>>1)
for(s=!e,r=a.c,q=0,p=0;f.b<g;){o=f.C()
n=o&7
m=o>>>3
if(n===1)for(l=0;l<m;++l){k=f.C()
j=f.C()
i=k>>>1
q+=(k&1)===0?i:-i-1
i=j>>>1
p+=(j&1)===0?i:-i-1
if(s)B.a.k(r,a.b>>>1)
a.c4(q,p)}else if(n===2)for(l=0;l<m;++l){k=f.C()
j=f.C()
i=k>>>1
q+=(k&1)===0?i:-i-1
i=j>>>1
p+=(j&1)===0?i:-i-1
a.c4(q,p)}}B.a.k(r,a.b>>>1)},
$ihw:1,
gK(){return this.b}}
A.fM.prototype={
c4(a,b){var s,r,q=this,p=q.b,o=q.a,n=o.length
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
A.c8.prototype={
C(){var s,r,q,p,o,n,m
for(s=this.a,r=s.length,q=0,p=0;p<28;p+=7){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
q=(q|B.b.ag(n&127,p))>>>0
if(n<128)return q}for(m=268435456;;){o=this.b++
if(!(o<r))return A.a(s,o)
n=s[o]
q+=(n&127)*m
if(n<128)return q
m*=128}},
bI(){var s=this,r=s.C(),q=s.b,p=B.w.dM(A.hB(s.a,q,q+r))
s.b+=r
return p},
T(a,b){var s=this
switch(b){case 0:s.C()
break
case 1:s.b+=8
break
case 2:s.b=s.b+s.C()
break
case 5:s.b+=4
break}}}
A.ha.prototype={
bY(a){var s,r,q,p,o,n,m,l,k,j=this
if(!t.f.b(a))return
s=a.h(0,"coordinates")
switch(a.h(0,"type")){case"FeatureCollection":r=a.h(0,"features")
if(t.j.b(r))J.of(r,j.gde())
break
case"Feature":j.bY(a.h(0,"geometry"))
break
case"GeometryCollection":q=a.h(0,"geometries")
if(t.j.b(q))J.of(q,j.gde())
break
case"Point":B.a.F(j.a,A.jF([s]))
break
case"MultiPoint":B.a.F(j.a,A.jF(s))
break
case"LineString":B.a.k(j.b,A.jF(s))
break
case"MultiLineString":if(t.j.b(s))B.a.F(j.b,J.il(s,A.p3(),t.H))
break
case"Polygon":if(t.j.b(s)){p=J.il(s,A.p3(),t.H)
p=A.a3(p,p.$ti.i("a0.E"))
B.a.k(j.c,p)}break
case"MultiPolygon":p=t.j
if(p.b(s))for(o=J.G(s),n=j.c,m=t.H;o.n();){l=o.gp()
if(p.b(l)){k=J.il(l,A.p3(),m)
k=A.a3(k,k.$ti.i("a0.E"))
B.a.k(n,k)}}break}},
hC(a){var s,r
t.H.a(a)
s=J.q(a)
if(s.gA(a)||this.c.length===0)return!1
for(r=0;r<s.gl(a);r+=2)if(!this.dd(s.h(a,r),s.h(a,r+1)))return!1
return!0},
dd(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
for(s=this.c,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){for(p=B.a.gt(s[q]),o=!1;p.n();){n=p.gp()
for(m=J.q(n),l=m.gl(n)-2,k=0;k<m.gl(n);j=k+2,l=k,k=j){i=m.h(n,k)
h=m.h(n,k+1)
g=m.h(n,l)
f=m.h(n,l+1)
if(h>b!==f>b&&a<(g-i)*(b-h)/(f-h)+i)o=!o}}if(o)return!0}return!1},
hn(a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a={}
t.H.a(a0)
s=J.q(a0)
if(s.gA(a0))return 1/0
r=Math.cos(s.h(a0,1)*3.141592653589793/180)
a.a=1/0
q=new A.jH(a)
for(p=b.c,o=b.b,n=b.a,m=0;m<s.gl(a0);m+=2){l=s.h(a0,m)
k=s.h(a0,m+1)
if(b.dd(l,k))return 0
for(j=0;i=n.length,j<i;j+=2){h=n[j]
g=j+1
if(!(g<i))return A.a(n,g)
f=(l-h)*r
e=k-n[g]
q.$1(Math.sqrt(f*f+e*e))}for(i=o.length,d=0;d<o.length;o.length===i||(0,A.i)(o),++d)q.$1(A.ov(l,k,o[d],r))
for(i=p.length,d=0;d<p.length;p.length===i||(0,A.i)(p),++d)for(h=B.a.gt(p[d]);h.n();)q.$1(A.ov(l,k,h.gp(),r))}if(a1){c=new A.jG(q,a0,r)
c.$1(n)
B.a.Y(o,c)
for(s=p.length,d=0;d<p.length;p.length===s||(0,A.i)(p),++d)B.a.Y(p[d],c)}return a.a*111319.49079327357}}
A.jH.prototype={
$1(a){var s=this.a
if(a<s.a)s.a=a},
$S:76}
A.jG.prototype={
$1(a){var s,r,q,p,o
t.H.a(a)
for(s=J.q(a),r=this.a,q=this.b,p=this.c,o=0;o<s.gl(a);o+=2)r.$1(A.ov(s.h(a,o),s.h(a,o+1),q,p))},
$S:77}
A.cB.prototype={}
A.jj.prototype={
q(a){return"HTTP "+this.a+" for "+this.b}}
A.er.prototype={
cA(a,b,c){return new A.jA(t.pp.a(b),a).$0().i8(c)},
ba(a,b){return this.cA(a,b,B.az)}}
A.jA.prototype={
$0(){var s=0,r=A.av(t.mk),q,p=this,o,n,m,l
var $async$$0=A.aw(function(a,b){if(a===1)return A.as(b,r)
for(;;)switch(s){case 0:m=v.G
l=A.aQ(new m.Headers())
p.a.Y(0,new A.jz(l))
s=3
return A.W(A.p5(A.aQ(m.fetch(p.b,{headers:l})),t.m),$async$$0)
case 3:o=b
s=4
return A.W(A.p5(A.aQ(o.arrayBuffer()),t.eb),$async$$0)
case 4:n=b
q=new A.cB(A.E(o.status),A.ot(n,0,null))
s=1
break
case 1:return A.at(q,r)}})
return A.au($async$$0,r)},
$S:78}
A.jz.prototype={
$2(a,b){A.Y(a)
A.Y(b)
if(!B.dd.u(0,a.toLowerCase()))this.a.append(a,b)},
$S:79}
A.iW.prototype={
hZ(a,b){return A.n(A.ar("A browser cannot read the file "+this.a))}}
A.mj.prototype={
$1(a){return A.aQ(a)===this.a},
$S:80}
A.jI.prototype={
gdi(){var s=this.a
return B.d.ar(s,"http://")||B.d.ar(s,"https://")},
aq(a,b,a0){var s=0,r=A.av(t.p),q,p=this,o,n,m,l,k,j,i,h,g,f,e,d,c
var $async$aq=A.aw(function(a1,a2){if(a1===1)return A.as(a2,r)
for(;;)switch(s){case 0:f=p.r
s=3
return A.W(f==null?p.r=p.aI():f,$async$aq)
case 3:e=a2
if(a<e.f||a>e.r){q=new Uint8Array(0)
s=1
break}o=A.up(a,b,a0)
n=e.a
f=p.w,m=e.b,l=e.d,k=A.r(f).i("am<1>"),j=0
case 4:if(!(j<4)){s=6
break}i=A.uo(n,o)
if(i==null){q=new Uint8Array(0)
s=1
break}h=i.b
s=h>0?7:8
break
case 7:if(o>=i.a+h){q=new Uint8Array(0)
s=1
break}d=A
s=9
return A.W(p.aB(e.c+i.c,i.d),$async$aq)
case 9:q=d.eu(a2,e.e)
s=1
break
case 8:h=i.c
n=f.h(0,h)
s=n==null?10:11
break
case 10:d=A
c=A
s=13
return A.W(p.aB(m+h,i.d),$async$aq)
case 13:s=12
return A.W(c.eu(a2,l),$async$aq)
case 12:n=d.q3(a2)
f.m(0,h,n)
case 11:if(f.a>48){g=new A.am(f,k).gt(0)
if(!g.n())A.n(A.aE())
f.ap(0,g.gp())}case 5:++j
s=4
break
case 6:q=new Uint8Array(0)
s=1
break
case 1:return A.at(q,r)}})
return A.au($async$aq,r)},
aI(){var s=0,r=A.av(t.iM),q,p=this,o,n,m,l,k,j,i,h,g,f,e,d
var $async$aI=A.aw(function(a,b){if(a===1)return A.as(b,r)
for(;;)switch(s){case 0:s=3
return A.W(p.aB(0,16384),$async$aI)
case 3:h=b
g=h.length
f=!0
if(g>=127)if(A.k9(B.j.H(h,0,7),0,null)==="PMTiles"){if(7>=g){q=A.a(h,7)
s=1
break}f=h[7]!==3}if(f)throw A.e(B.aM)
f=new A.jK(A.oi(h,0,null))
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
case 5:b=A.hB(h,o,l)
s=6
break
case 7:s=8
return A.W(p.aB(o,n),$async$aI)
case 8:case 6:s=4
return A.W(d.eu(b,m),$async$aI)
case 4:l=e.q3(b)
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
break}q=new A.hY(l,k,f,m,j,i,h[101])
s=1
break
case 1:return A.at(q,r)}})
return A.au($async$aI,r)},
aB(a,b){var s=0,r=A.av(t.p),q,p=this,o,n,m,l,k,j
var $async$aB=A.aw(function(c,d){if(c===1)return A.as(d,r)
for(;;)switch(s){case 0:if(!p.gdi()){o=p.f
q=(o==null?p.f=new A.iW(p.a):o).hZ(a,b)
s=1
break}o=p.d
n=p.a
m=t.N
m=A.pX(m,m)
m.F(0,p.c)
l=a+b
m.m(0,"range","bytes="+a+"-"+(l-1))
m.m(0,"accept-encoding","identity")
s=3
return A.W(o.cA(n,m,B.aA),$async$aB)
case 3:k=d
o=k.a
if(o!==206&&o!==200)throw A.e(A.pJ(o,n))
j=k.b
q=o===200&&j.length>b?A.hB(j,a,B.b.D(l,0,j.length)):j
s=1
break
case 1:return A.at(q,r)}})
return A.au($async$aB,r)}}
A.jK.prototype={
$1(a){var s=this.a
return s.getUint32(a,!0)+s.getUint32(a+4,!0)*4294967296},
$S:14}
A.jJ.prototype={
$0(){var s,r,q,p,o,n,m
for(s=this.b,r=this.a,q=s.length,p=0,o=1;;){n=r.a++
if(!(n<q))return A.a(s,n)
m=s[n]
p+=(m&127)*o
if(m<128)return p
o*=128}},
$S:7}
A.hY.prototype={}
A.eQ.prototype={
gl(a){return this.d}}
A.l0.prototype={}
A.c6.prototype={}
A.l_.prototype={
$0(){var s,r=this.a,q=J.q(r),p=q.h(r,2)
p.toString
A.E(p)
s=q.h(r,3)
s.toString
A.E(s)
r=q.h(r,4)
r.toString
return new A.bf(p,s,A.E(r))},
$S:122}
A.kZ.prototype={
$1(a){var s=J.aL(this.a,a)
s.toString
return A.ae(s)},
$S:16}
A.dV.prototype={}
A.e6.prototype={}
A.bN.prototype={
al(){return"ClusterQuestion."+this.b}}
A.dS.prototype={}
A.aC.prototype={}
A.hz.prototype={}
A.hv.prototype={
b9(){return[this.a,"built",this.c.cu()]}}
A.hy.prototype={
b9(){return[this.a,"failed",this.c]}}
A.e5.prototype={
b9(){var s,r,q,p,o=A.b([],t.dO)
for(s=this.b,r=s.length,q=0;q<s.length;s.length===r||(0,A.i)(s),++q){p=s[q]
o.push([p.a,p.b,p.c,p.d,p.e])}return[this.a,"found",o]}}
A.dY.prototype={
b9(){return[this.a,"zoom",this.b]}}
A.d1.prototype={
b9(){var s,r,q,p,o,n=A.b([],t.bo)
for(s=this.b,r=s.length,q=t.G,p=0;p<s.length;s.length===r||(0,A.i)(s),++p){o=s[p]
n.push(A.b([o.a,o.b,o.c],q))}return[this.a,"members",n]}}
A.fu.prototype={}
A.hx.prototype={}
A.nY.prototype={
$2(a,b){var s=this.a
return s>=a&&s<b},
$S:15}
A.ns.prototype={
$2(a,b){var s=this
return a>=s.a&&a<=s.b&&b>=s.c&&b<=s.d},
$S:15}
A.nq.prototype={
$8(a,b,c,d,e,f,g,h){var s=new A.nr(),r=s.$6(e,f,g,h,a,b),q=s.$6(e,f,g,h,c,d),p=s.$6(a,b,c,d,e,f),o=s.$6(a,b,c,d,g,h)
return r>0!==q>0&&p>0!==o>0},
$S:83}
A.nr.prototype={
$6(a,b,c,d,e,f){return(c-a)*(f-b)-(d-b)*(e-a)},
$S:84}
A.bc.prototype={}
A.fQ.prototype={}
A.hA.prototype={}
A.h9.prototype={}
A.fP.prototype={}
A.e_.prototype={
q(a){var s=this
return A.t(s.a)+","+A.t(s.b)+","+A.t(s.c)+","+A.t(s.d)}}
A.fv.prototype={}
A.hu.prototype={}
A.nZ.prototype={
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
a0=Math.max(2,B.c.bw(Math.abs(a)/0.5235987755982988-0.000001))
for(a5=a4.b,a1=0;a1<=a0;++a1){a2=a*a1/a0
a9=Math.cos(a2)
a3=Math.sin(a2)
B.a.k(a5,i+e*a9-d*a3)
B.a.k(a5,h+e*a3+d*a9)}},
$S:35}
A.o1.prototype={
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
$S:35}
A.kP.prototype={}
A.ls.prototype={
gaN(){var s,r=this.d.h(0,A.t(this.b)+"-translate")
A:{if(r==null){s=null
break A}s=A.v(r)
break A}return s}}
A.f8.prototype={}
A.ho.prototype={
f2(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=A.C(t.S,t.nY)
for(s=A.pK(this.x,0,t.kY),r=J.G(s.a),q=s.b,s=new A.bt(r,q,A.r(s).i("bt<1>")),p=this.Q,o=this.r;s.n();){n=s.c
n=n>=0?new A.z(q+n,r.gp()):A.n(A.aE())
m=n.b
if(!(m instanceof A.ba)||m.dx)continue
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
j.ay=Math.max(j.ay,i+1)
break}}return b},
hi(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7=this,b8=null,b9="url",c0="attribution",c1=b7.a,c2=c1.a
c1=c1.$ti.i("4?")
s=t.g.a(c1.a(c2.h(0,"layers")))
s=J.G(s==null?B.cx:s)
r=t.f
q=b7.gep()
p=b7.geu()
o=b7.gen()
n=b7.ger()
m=b7.gez()
l=b7.at
k=b7.x
j=b7.as
i=b7.z
h=b7.ay
while(s.n()){g=s.gp()
if(!r.b(g))continue
f=A.vb(g)
if(J.l(f.e.h(0,"visibility"),"none"))continue
e=f.b
A:{if("symbol"===e){d=m
break A}if("heatmap"===e){d=n
break A}if("circle"===e){d=o
break A}if("line"===e){d=p
break A}if("fill"===e||"fill-extrusion"===e){d=q
break A}d=b8
break A}if(d!=null){c=k.length
b=b7.fZ(f)
if(b!=null)d.$1(b)
if(J.l(e,"symbol")){b7.ch=k.length
b7.CW=new A.z(j.length,i.length)}a=f.d.h(0,A.t(e)+"-layer-opacity")
if(a!=null){a0=A.v(a)
for(a1=c;a1<k.length;++a1)h.m(0,a1,a0)}}else{d=J.aj(e)
if(d.B(e,"background")){a2=f.d
a3=a2.h(0,"background-pattern")
B.a.k(l,new A.z(k.length,new A.c3(-1,j.length,-1,0)))
A.J(a2.h(0,"background-color"),"#000000")
A.J(a2.h(0,"background-opacity"),1)
if(a3!=null)A.ff(a3)
B.a.k(j,new A.fn())}else if(d.B(e,"raster")||d.B(e,"hillshade")||d.B(e,"color-relief"))b7.ey(f)}}a4=b7.fI()
a5=c1.a(c2.h(0,"sprite"))
b7.f2()
b7.fY()
if(c1.a(c2.h(0,"sky"))!=null){a6=c1.a(c2.h(0,"sky"))
a6=r.b(a6)?a6:B.ab
s=a6.h(0,"sky-color")
A.v(s==null?"#88C6FC":s)
s=a6.h(0,"horizon-color")
A.v(s==null?"#ffffff":s)
s=a6.h(0,"sky-horizon-blend")
A.v(s==null?0.8:s)
s=a6.h(0,"fog-color")
A.v(s==null?"#ffffff":s)
s=a6.h(0,"fog-ground-blend")
A.v(s==null?0.5:s)
s=a6.h(0,"horizon-fog-blend")
A.v(s==null?0.8:s)}s=A.qj(c1.a(c2.h(0,"projection")))
q=A.ty(c1.a(c2.h(0,"light")))
b7.fb(a4)
B:{p=typeof a5=="string"
if(p)break B
a7=b8
a8=b8
a9=!1
o=!1
if(t.j.b(a5)){n=J.q(a5)
b0=n.gl(a5)>=1
if(b0){a7=n.h(a5,0)
a9=r.b(a7)
if(a9){t.d.a(a7)
a8=a7.h(0,b9)
n=a8
if(n==null){t.d.a(a7)
n=a7.J(b9)}else n=!0
if(n)o=typeof a8=="string"}}}else b0=!1
if(o){if(a9)o=a8
else{o=b0?a7:J.aL(a5,0)
a8=t.d.a(o).h(0,b9)
o=a8}A.Y(o)
break B}break B}o=A.b([],t.m_)
if(p)o.push(new A.z("",a5))
if(t.j.b(a5))for(p=J.G(a5);p.n();){b1=p.gp()
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
b4=b5}}}if(n){b6=A.Y(b3?b2:b1.h(0,b9))
o.push(new A.z(b4==="default"?"":A.t(b4)+":",b6))}}c1=A.bh(c1.a(c2.h(0,"glyphs")))
c2=A.aZ(t.N)
for(p=b7.d.gaE(),p=p.gt(p);p.n();){b1=p.gp()
if(r.b(b1)&&typeof b1.h(0,c0)=="string")c2.k(0,A.Y(b1.h(0,c0)))}A.a3(c2,c2.$ti.c)
return new A.ks(q,s,b7.r,k,b7.y,b7.e,b7.c,o,c1)},
fZ(a){var s,r,q,p=a.c,o=this.fR(p.h(0,"source"))
if(o==null)return null
s=p.h(0,"source-layer")
r=typeof s=="string"
if(!r){q=this.e
if(o>>>0!==o||o>=q.length)return A.a(q,o)
q=!(q[o] instanceof A.bS)}else q=!1
if(q)return null
r=r?s:""
return new A.f8(a,o,r,p.h(0,"filter"))},
fR(a){return this.f.b5(a,new A.ko(this,a))},
ey(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=null,d=a.d,c=f.d.h(0,a.c.h(0,"source"))
if(!t.f.b(c))return
if(d.ga2().b1(0,B.ae.gdL(B.ae))){A.J(d.h(0,"raster-hue-rotate"),0)
A.J(d.h(0,"raster-saturation"),0)
A.J(d.h(0,"raster-contrast"),0)
A.J(d.h(0,"raster-brightness-min"),0)
A.J(d.h(0,"raster-brightness-max"),1)}J.l(d.h(0,"raster-resampling"),"nearest")
s=d.h(0,"resampling")
if(s!=null)A.v(s)
A.J(d.h(0,"raster-opacity"),1)
r=A.bh(c.h(0,"url"))
q=A.p8(c.h(0,"tiles"))
p=A.D(c.h(0,"tileSize"))
if(p==null)p=512
s=A.D(c.h(0,"maxzoom"))
o=s==null?e:B.c.N(s)
n=a.b
m=c.h(0,"type")
A:{l="raster"===n
s=l
if(s){s="image"===m
k=m
j=!0}else{k=e
j=!1
s=!1}i=e
if(s){B:{if(A.uM(c.h(0,"coordinates"))!=null)s=r!=null
else s=!1
if(s){s=new A.fQ()
break B}s=i
break B}break A}if(l){if(j)s=k
else{s=m
k=s
j=!0}s="raster"===s}else s=!1
if(s){A.eG(c)
s=new A.h9()
break A}h="hillshade"===n
g=e
if(h){if(j)s=k
else{s=m
k=s
j=!0}g="raster-dem"===s
s=g}else s=!1
if(s){A.v(1)
A.eG(c)
J.l(c.h(0,"encoding"),"terrarium")
A.J(d.h(0,"hillshade-exaggeration"),0.5)
A.v("#000000")
A.v("#ffffff")
A.qg(d.h(0,"hillshade-shadow-color"),"#000000")
A.qg(d.h(0,"hillshade-highlight-color"),"#ffffff")
s=d.h(0,"hillshade-accent-color")
if(s!=null)A.v(s)
s=d.h(0,"hillshade-method")
A.t(s==null?"standard":s)
A.qi(d.h(0,"hillshade-illumination-direction"),335)
A.qi(d.h(0,"hillshade-illumination-altitude"),45)
s=new A.fP()
break A}if("color-relief"===n)if(h)s=g
else{g="raster-dem"===(j?k:m)
s=g}else s=!1
if(s){s=f.eM(a,c,o,r,p,q)
break A}s=i
break A}if(s==null)return
i=f.z
B.a.k(f.at,new A.z(f.x.length,new A.c3(i.length,-1,-1,0)))
B.a.k(i,s)},
eM(a,b,c,d,e,a0){var s,r,q,p,o,n,m,l=a.d,k=t.n,j=A.b([],k),i=A.b([],k),h=l.h(0,"color-relief-color"),g=t.j,f=!1
if(g.b(h)){s=J.q(h)
if(s.gl(h)>=3)if("interpolate"===s.h(h,0)){r=s.h(h,2)
if(g.b(r)){t.W.a(r)
g=J.q(r)
if(g.gl(r)===1)g="elevation"===g.h(r,0)
else g=f}else g=f}else g=f
else g=f}else g=f
if(g){q=J.rU(h,3)
p=new A.A(B.i)
for(o=0;g=o+1,f=q.length,g<f;o+=2){if(!(o<f))return A.a(q,o)
n=q[o]
if(!(typeof n=="number"))if(typeof n=="string"){f=A.P(n)
n=f}else{if(A.M(n))f=n?1:0
else f=null
n=f}if(n==null)continue
if(!(g<q.length))return A.a(q,g)
m=A.bw(A.v(q[g]).$1(p))
if(m==null)m=B.d8
B.a.k(j,n)
g=m.d
B.a.F(i,A.b([m.a*g,m.b*g,m.c*g,g],k))}}if(j.length===0){B.a.k(j,0)
B.a.F(i,A.b([0,0,0,0],k))}if(j.length<2){B.a.k(j,B.a.gv(j)+1)
B.a.F(i,B.a.H(i,0,4))}A.J(l.h(0,"color-relief-opacity"),1)
A.eG(b)
A.ti(b)
new Float64Array(A.a1(j))
new Float64Array(A.a1(i))
A.J(l.h(0,"resampling"),"linear")
return new A.fv()},
eA(e0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4=null,b5="text-font",b6="text-offset",b7="text-rotation-alignment",b8="viewport",b9="text-anchor",c0="icon-offset",c1="text-size",c2="icon-size",c3="symbol-sort-key",c4="text-transform",c5="lowercase",c6="text-letter-spacing",c7="text-max-width",c8="text-justify",c9="text-rotate",d0="vertical",d1="icon-padding",d2="icon-text-fit",d3=e0.a,d4=d3.d,d5=d3.e,d6=d5.h(0,"text-field"),d7=d5.h(0,"icon-image"),d8=d6!=null&&!J.l(d6,""),d9=d7!=null&&!J.l(d7,"")
if(!d8&&!d9)return
s=this.b
if(d8&&s!=null&&B.d.u(B.e.a9(d6,b4),"name")){r=A.b(["coalesce"],t.G)
for(q=s.$ti,p=new A.X(s,s.gl(0),q.i("X<y.E>")),o=t.s,q=q.i("y.E");p.n();){n=p.d
r.push(A.b(["get",n==null?q.a(n):n],o))}d6=r}r=d5.h(0,b5)
m=B.e.a9(r==null?"":r,b4).toLowerCase()
A.oy(d5.h(0,b6))
l=d5.h(0,"symbol-placement")
if(l==null)l="point"
k=A.D(d5.h(0,"symbol-spacing"))
if(k==null)k=250
j=J.l(d5.h(0,b7),b8)
i=J.l(d5.h(0,"icon-rotation-alignment"),b8)
d5.h(0,b9)
A.uL(d5.h(0,"text-variable-anchor-offset"),d5.h(0,"text-variable-anchor"))
d5.h(0,"icon-anchor")
A.oy(d5.h(0,c0))
r=t.N
h=A.aZ(r)
for(g=0;g<7;++g)A.c2(d4.h(0,B.cj[g]),h)
A.c2(d5.h(0,c1),h)
A.c2(d5.h(0,c2),h)
A.c2(d5.h(0,c0),h)
A.c2(d5.h(0,b6),h)
for(g=0;g<7;++g)A.c2(d5.h(0,B.cP[g]),h)
f=new A.kd(d5)
q=d8?d6:b4
p=d9?d7:b4
o=d5.h(0,c3)
n=d5.h(0,"icon-rotate")
if(n==null)n=0
e=A.a3(h,h.$ti.c)
B.a.aQ(e)
d=A.uV(A.eh(["source",e0.b,"sourceLayer",e0.c,"filter",e0.d,"text",q,"icon",p,"placement",l,"spacing",k,"textUpright",j,"iconUpright",i,"minZoom",d3.f,"maxZoom",d3.r,"sortKey",o,"iconRotate",n,"paintKeys",e],r,t.O))
q=A.J(d5.h(0,c1),16)
A.J(d4.h(0,"text-color"),"#000000")
A.J(d4.h(0,"text-opacity"),1)
A.v(d4.h(0,"text-halo-color"))
A.J(d4.h(0,"text-halo-width"),0)
p=A.uT(m)
if(!B.d.u(m,"italic"))B.d.u(m,"oblique")
o=A.uQ(d5.h(0,b5))
n=J.l(d5.h(0,c4),"uppercase")
if(f.$1(c4)==null)if(J.l(d5.h(0,c4),c5))A.v(c5)
f.$1(c6)
f.$1(c7)
f.$1(c8)
f.$1(b9)
f.$1(c9)
f.$1(b5)
if(J.l(l,"point")){c=d5.h(0,"text-writing-mode")
A:{if(t.j.b(c)){e=A.b([],t.df)
for(b=J.G(c);b.n();){a=b.gp()
a0=J.aj(a)
if(a0.B(a,d0)||a0.B(a,"horizontal"))e.push(a0.B(a,d0))}break A}break A}}e=A.D(d5.h(0,c6))
if(e==null)e=0
b=A.D(d5.h(0,"text-line-height"))
a1=d5.h(0,c8)
B:{if("left"===a1){a0=B.ag
break B}if("right"===a1){a0=B.ah
break B}a0=B.dg
break B}J.l(d5.h(0,c8),"auto")
A.D(d5.h(0,"text-padding"))
J.l(d5.h(0,b7),"map")
A.D(d5.h(0,d1))
A.uS(d5.h(0,d1))
J.l(d5.h(0,"text-ignore-placement"),!0)
a2=d5.h(0,"text-pitch-alignment")
C:{if("map"===a2)break C
if("viewport"===a2)break C
a3=d5.h(0,b7)
D:{if("map"===a3)break D
if("viewport"===a3)break D
if(typeof l=="string")B.d.ar(l,"line")
break D}break C}J.l(d5.h(0,"text-keep-upright"),!1)
J.l(d5.h(0,"icon-ignore-placement"),!0)
A.J(d4.h(0,"text-halo-blur"),0)
a4=A.D(d5.h(0,c7))
if(a4==null)a4=10
a5=A.J(d5.h(0,c2),1)
A.J(d4.h(0,"icon-opacity"),1)
A.J(d4.h(0,"icon-color"),"#000000")
A.D(d5.h(0,c9))
if(!A.qh(d5.h(0,b6)))A.v(d5.h(0,b6))
J.l(d5.h(0,"text-optional"),!0)
J.l(d5.h(0,"icon-optional"),!0)
A.kl(d5,"icon")
A.kl(d5,"text")
A.kl(d5,"icon")
A.kl(d5,"text")
A.uP(d5)
d5.h(0,c3)
A.c2(d5.h(0,c2),A.aZ(r))
r=d5.h(0,d2)
J.l(r==null?"none":r,"none")
d5.h(0,d2)
E:{break E}a6=d5.h(0,"icon-text-fit-padding")
F:{a7=b4
a8=!1
r=!1
if(t.j.b(a6)){a9=J.q(a6)
if(a9.gl(a6)===4){b0=a9.h(a6,0)
if(typeof b0=="number"){A.ae(b0)
b1=a9.h(a6,1)
if(typeof b1=="number"){A.ae(b1)
b2=a9.h(a6,2)
a8=typeof b2=="number"
if(a8){A.ae(b2)
a7=a9.h(a6,3)
r=typeof a7=="number"}}}}}if(r){A.ae(a8?a7:J.aL(a6,3))
break F}break F}A.D(d5.h(0,"text-radial-offset"))
if(!A.qh(d5.h(0,c0)))A.v(d5.h(0,c0))
r=d4.h(0,"text-translate")
if(r!=null)A.v(r)
J.l(d4.h(0,"text-translate-anchor"),b8)
r=d4.h(0,"icon-halo-color")
if(r!=null)A.v(r)
r=d4.h(0,"icon-halo-width")
if(r!=null)A.v(r)
r=d4.h(0,"icon-translate")
if(r!=null)A.v(r)
r=d4.h(0,"icon-halo-blur")
if(r!=null)A.v(r)
J.l(d4.h(0,"icon-translate-anchor"),b8)
b3=A.D(d5.h(0,"text-max-angle"))
G:{r=b4
if(b3!=null){r=b3*3.141592653589793/180
break G}break G}B.a.k(this.y,new A.hr(d3.a,d,q,p,o,n,e,b,a0,a4,a5,r))
r=this.ax
a5=B.e.a9(A.b(["s",d.a],t.s),b4)
r.a+=a5},
es(a){var s,r,q,p=a.a,o=p.d
A.J(o.h(0,"heatmap-radius"),30)
p.gaN()
J.l(o.h(0,A.t(p.b)+"-translate-anchor"),"viewport")
s=this.bN(a,B.q,A.hp(o,B.ci))
A.v("#ffffff")
A.J(o.h(0,"heatmap-opacity"),1)
r=A.J(o.h(0,"heatmap-weight"),1)
q=A.J(o.h(0,"heatmap-intensity"),1)
A.tT(o.h(0,"heatmap-color"),q,r)
B.a.k(this.x,new A.co(p.a,s,p.f,p.r))},
eo(a){var s,r,q,p,o,n="viewport",m="circle-blur",l=a.a,k=l.d,j=A.hp(k,B.cK)
A.J(k.h(0,"circle-radius"),5)
s=k.h(0,"circle-stroke-width")
l.gaN()
J.l(k.h(0,A.t(l.b)+"-translate-anchor"),n)
r=this.bN(a,B.q,j)
A.J(k.h(0,"circle-color"),"#000000")
A.J(k.h(0,"circle-opacity"),1)
if(s!=null){A.J(k.h(0,"circle-stroke-color"),"#000000")
A.v(s)
A.J(k.h(0,"circle-stroke-opacity"),1)}q=J.l(k.h(0,"circle-pitch-alignment"),"map")
p=J.l(k.h(0,"circle-pitch-scale"),n)
o=k.h(0,m)==null?null:A.v(k.h(0,m))
B.a.k(this.x,new A.d0(q,!p,o,l.a,r,l.f,l.r))},
ev(b8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6="line-gradient",a7=null,a8="line-cap",a9=b8.a,b0=a9.d,b1=a9.e,b2=A.hp(b0,B.ch),b3=b0.h(0,"line-offset"),b4=b0.h(0,"line-blur"),b5=b0.h(0,a6)!=null&&b3!=null?a7:b0.h(0,"line-dasharray"),b6=A.uO(b5),b7=b6.length===0&&A.kg(b5)==null?A.uN(b5):B.K
if(b6.length!==0)s=B.a.gv(b6).b
else s=b7.length!==0?B.a.gv(b7):A.kg(b5)
r=A.J(b0.h(0,"line-width"),1)
q=b0.h(0,"line-gap-width")
p=q==null?a7:A.v(q)
o=p!=null?new A.kc(r,p):r
n=b0.h(0,"line-pattern")
m=n==null
l=m?b0.h(0,a6):a7
k=b4!=null&&m&&l==null
j=a9.gaN()
i=J.l(b0.h(0,A.t(a9.b)+"-translate-anchor"),"viewport")
if(!m)h=B.l
else{g=b1.h(0,a8)
A:{if("round"===g){h=B.a1
break A}if("square"===g){h=B.a2
break A}h=B.l
break A}}f=s==null
e=!f||!m||k||l!=null
f=k&&f
d=l==null
c=b3==null
b=b1.h(0,"line-join")
B:{if("round"===b){a=B.aT
break B}if("bevel"===b){a=B.a3
break B}a=B.y
break B}a=this.eJ(b8,B.v,b2,h,e,f,a,!d,!c)
h=m&&d?A.J(b0.h(0,"line-color"),"#000000"):A.v("#ffffff")
f=d?a7:A.v(l)
e=A.J(b0.h(0,"line-opacity"),1)
d=c?a7:A.v(b3)
c=k?A.v(b4):a7
a0=m?s:a7
a1=m?b6:B.z
a2=m?b7:B.K
a3=m&&b7.length!==0?A.v(b5):a7
a4=b1.h(0,a8)
C:{if("round"===a4){a5=B.at
break C}if("square"===a4){a5=B.au
break C}a5=B.Z
break C}m=m?a7:A.ff(n)
B.a.k(this.x,A.pV(c,a,h,a0,a5,a2,a3,a1,p,f,a9.a,a9.r,a9.f,d,e,!1,m,b2.a!==0,j,i,o))},
eq(a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this,b=null,a="#000000",a0="-translate-anchor",a1="viewport",a2="fill-antialias",a3="fill-outline-color",a4=a9.a,a5=a4.d,a6=A.Y(a4.b),a7=a6+"-color",a8=a5.h(0,a7)
if(a8==null)a8=a
s=a6+"-opacity"
r=a5.h(0,s)
if(r==null)r=1
q=a6+"-pattern"
p=A.hp(a5,A.b([a7,s,q],t.s))
o=a5.h(0,q)
q=c.x
s=a4.a
a4.gaN()
J.l(a5.h(0,a6+a0),a1)
a7=c.bN(a9,B.u,p)
n=a4.f
m=a4.r
l=o==null
if(l)A.J(a8,a)
else A.v("#ffffff")
A.v(r)
k=l?b:A.ff(o)
if(!l)A.J(a8,a)
j=!1
if(a6==="fill")if(!J.l(a5.h(0,a2),!1))j=!l||a5.h(0,a3)==null
if(j)j=l?A.J(a8,a):A.v("#ffffff")
else j=b
i=a6==="fill-extrusion"
B.a.k(q,new A.ba(k,j,i,s,a7,n,m))
if(i){h=B.e.a9(["extrusion",a9.b,a9.c,a9.d,a5.h(0,"fill-extrusion-height"),a5.h(0,"fill-extrusion-base"),a8,a5.h(0,"fill-extrusion-vertical-gradient"),a4.e.h(0,"fill-extrusion-rounded-corner-distance"),o],b)
g=c.w.b5(h,new A.ka(c,a9,a5,o,a8,a4))
a7=c.r
if(!(g>=0&&g<a7.length))return A.a(a7,g)
f=a7[g]
if(n<f.ax)f.ax=n
if(m>f.ay)f.ay=m
a7=c.ax
k=B.e.a9(A.b([h,n,m],t.G),b)
a7.a+=k
A.v(r)
a4.gaN()
J.l(a5.h(0,a6+a0),a1)
B.a.k(c.Q,new A.e4(g,n))}e=a5.h(0,a3)
if(e==null||!l||J.l(a5.h(0,a2),!1))return
d=A.hp(a5,B.cI)
a7=a4.gaN()
l=J.l(a5.h(0,a6+a0),a1)
B.a.k(q,A.pV(b,c.eI(a9,B.v,d,!0),A.v(e),b,B.Z,B.K,b,B.z,b,b,s,m,n,b,A.v(r),!0,b,d.a!==0,a7,l,new A.kb()))},
bM(a,b,c,d,e,f,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h=this,g={}
t.gi.a(c)
g.a=g.b=g.c=null
s=a.a
r=a.b
g.c=r
q=a.c
g.b=q
p=a.d
g.a=p
o=A.a3(c,A.r(c).c)
B.a.aQ(o)
n=s.e.h(0,A.t(s.b)+"-sort-key")
m=B.e.a9([n,b.a,r,q,p,d.a,e,a3,a2,f,a1,a0.a,o],null)
l=h.w.b5(m,new A.ke(g,h,b,d,e,a3,a2,f,a1,a0,o,n))
g=h.r
if(!(l>=0&&l<g.length))return A.a(g,l)
k=g[l]
g=s.f
if(g<k.ax)k.ax=g
j=s.r
if(j>k.ay)k.ay=j
i=h.ax
j=B.e.a9(A.b([m,g,j],t.G),null)
i.a+=j
return l},
bN(a,b,c){return this.bM(a,b,c,B.l,!1,!1,B.y,!1,!1,!1)},
eJ(a,b,c,d,e,f,g,h,i){return this.bM(a,b,c,d,e,f,g,h,i,!1)},
eI(a,b,c,d){return this.bM(a,b,c,B.l,!1,!1,B.y,!1,!1,d)},
fb(a){var s,r,q,p,o,n,m,l,k
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
fY(){var s,r=this.a,q=r.$ti.i("4?").a(r.a.h(0,"terrain"))
r=t.f
if(!r.b(q))return null
s=this.d.h(0,q.h(0,"source"))
if(!r.b(s)||!J.l(s.h(0,"type"),"raster-dem"))return null
A.v(1)
A.bh(s.h(0,"url"))
A.p8(s.h(0,"tiles"))
A.D(s.h(0,"tileSize"))
r=A.D(s.h(0,"maxzoom"))
if(r!=null)B.c.N(r)
A.eG(s)
J.l(s.h(0,"encoding"),"terrarium")
A.D(q.h(0,"exaggeration"))
return new A.hu()},
fI(){var s,r,q,p,o,n,m,l,k,j,i,h=this,g={},f=h.x,e=A.b([],t.in)
g.a=0
s=new A.kn(h,f)
r=new A.km(g,e,s)
for(q=h.at,p=h.ay,o=0,n=0;n<=f.length;++n){for(;;){m=q.length
if(o<m){if(!(o>=0))return A.a(q,o)
m=q[o].a===n}else m=!1
if(!m)break
r.$1(n)
l=o+1
if(!(o>=0&&o<q.length))return A.a(q,o)
B.a.k(e,q[o].b)
o=l}m=!0
if(n!==f.length)if(n>g.a){if(J.l(s.$1(n),s.$1(g.a)))if(n!==h.ch){if(!(n<f.length))return A.a(f,n)
k=f[n].gbd()
j=g.a
if(!(j<f.length))return A.a(f,j)
if(k===f[j].gbd()){k=f.length
if(!(n<k))return A.a(f,n)
if(!(f[n] instanceof A.co)){j=g.a
if(!(j<k))return A.a(f,j)
if(!(f[j] instanceof A.co)){if(p.J(n)||p.J(g.a)){k=f.length
if(!(n<k))return A.a(f,n)
j=f[n]
i=n-1
if(!(i<k))return A.a(f,i)
i=j.a!==f[i].a
k=i}else k=!1
if(!k){k=f.length
if(!(n<k))return A.a(f,n)
j=f[n]
if(!(j instanceof A.ba&&j.dx)){m=g.a
if(!(m<k))return A.a(f,m)
m=f[m]
m=m instanceof A.ba&&m.dx}}}}}}}else m=!1
if(m)r.$1(n)}return e}}
A.ko.prototype={
$0(){var s,r,q,p,o,n,m,l,k,j,i,h=null,g="promoteId",f="generateId",e=this.a,d=this.b,c=e.d.h(0,d)
if(!t.f.b(c))return h
s=J.l(c.h(0,"type"),"geojson")
if(!s&&!J.l(c.h(0,"type"),"vector"))return h
A.p8(c.h(0,"tiles"))
r=c.h(0,"data")
q=A.D(c.h(0,"maxzoom"))
p=q==null?h:B.c.N(q)
if(s&&J.l(c.h(0,"cluster"),!0)){q=A.D(c.h(0,"clusterRadius"))
if(q==null)q=h
if(q==null)q=50
o=A.D(c.h(0,"clusterMaxZoom"))
o=o==null?h:B.c.N(o)
if(o==null)o=(p==null?18:p)-1
o=B.b.D(o,0,24)
n=A.D(c.h(0,"clusterMinPoints"))
n=n==null?h:B.c.N(n)
if(n==null)n=2
m=c.h(0,"clusterProperties")
A:{if(t.d.b(m)){l=A.C(t.N,t.O)
for(k=m.gah(),k=k.gt(k);k.n();){j=k.gp()
l.m(0,A.t(j.a),j.b)}break A}l=B.i
break A}i=new A.iI(q,o,n,l)}else i=h
e=e.e
if(s){A.t(d)
d=c.h(0,g)
q=J.l(c.h(0,f),!0)
A.t(typeof r=="string"?r:A.nV(r))
if(i!=null)B.e.a9(i.d,h)
A.t(c.h(0,g))
A.t(c.h(0,f))
d=new A.bS(r,i,q,d)}else{A.t(d)
A.bh(c.h(0,"url"))
d=c.h(0,g)
q=A.eG(c)
A.t(c.h(0,"url"))
A.t(c.h(0,g))
o=A.eG(c).b
if(o!=null)B.a.ac(o,",")
d=new A.eH(q,d)}B.a.k(e,d)
return e.length-1},
$S:87}
A.kd.prototype={
$1(a){var s=this.a,r=s.h(0,a)
A:{if(t.j.b(r)||t.f.b(r)){s=A.v(s.h(0,a))
break A}s=null
break A}return s},
$S:88}
A.kc.prototype={
$1(a){var s,r=A.D(this.a.$1(a))
if(r==null)r=1
s=A.D(this.b.$1(a))
if(s==null)s=0
return r*2+s},
$S:11}
A.ka.prototype={
$0(){var s,r=this,q=r.a.r,p=r.b,o=A.oY(p.d),n=r.c,m=A.J(n.h(0,"fill-extrusion-height"),0),l=A.J(n.h(0,"fill-extrusion-base"),0),k=r.d,j=k==null,i=j?A.J(r.e,"#000000"):A.v("#ffffff")
n=J.l(n.h(0,"fill-extrusion-vertical-gradient"),!1)
s=r.f.e.h(0,"fill-extrusion-rounded-corner-distance")
s=A.v(s==null?0:s)
k=j?null:A.ff(k)
B.a.k(q,new A.cc(new A.iS(m,l,i,!n,s,k),null,p.b,p.c,o,B.H,B.l,!1,!1,!1,!1,!1,B.y,B.a9))
return q.length-1},
$S:7}
A.kb.prototype={
$1(a){return 1},
$S:31}
A.ke.prototype={
$0(){var s,r=this,q=r.b.r,p=r.a,o=p.c,n=p.b
p=A.oY(p.a)
s=r.Q
s=s==null?null:A.v(s)
B.a.k(q,new A.cc(null,s,o,n,p,r.c,r.d,r.e,r.f,r.r,r.w,r.x,r.y,r.z))
return q.length-1},
$S:7}
A.kn.prototype={
$1(a){var s=this.a.r,r=this.b
if(!(a<r.length))return A.a(r,a)
r=r[a].b
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r].c},
$S:14}
A.km.prototype={
$1(a){var s=this.a,r=s.a
if(a>r)B.a.k(this.b,new A.c3(-1,-1,this.c.$1(r),s.a))
s.a=a},
$S:36}
A.kp.prototype={
$1(a){var s
t.X.a(a)
s=this.a.$1(a)
return s==null?this.b.$1(a):s},
$S:2}
A.kj.prototype={
$2(a,b){var s=this.a,r=s.h(0,a)
A:{if(typeof r=="string"){s=r!=="never"
break A}s=J.l(s.h(0,b),!0)
break A}return s},
$S:90}
A.kk.prototype={
$1(a){return typeof a=="number"},
$S:12}
A.kf.prototype={
$1(a){return typeof a=="string"&&A.bw(a)!=null},
$S:12}
A.kh.prototype={
$1(a){var s,r
if(!t.j.b(a))return
s=J.q(a)
if(s.gl(a)===2&&J.l(s.h(a,0),"literal")){r=A.kg(a)
if(r!=null&&!B.a.b1(this.a,new A.ki(r)))B.a.k(this.a,r)
return}for(s=s.gt(a);s.n();)this.$1(s.gp())},
$S:10}
A.ki.prototype={
$1(a){return A.uR(t.kI.a(a),this.a)},
$S:91}
A.cd.prototype={
al(){return"BucketKind."+this.b}}
A.iS.prototype={}
A.iV.prototype={}
A.e4.prototype={}
A.cc.prototype={}
A.d7.prototype={
al(){return"DashCap."+this.b}}
A.bb.prototype={
gbd(){return!1}}
A.h3.prototype={}
A.ba.prototype={}
A.dh.prototype={}
A.d0.prototype={
gbd(){return!0}}
A.co.prototype={
gbd(){return!0}}
A.jh.prototype={}
A.ku.prototype={}
A.kv.prototype={
$1(a){return""},
$S:5}
A.hr.prototype={
ghu(){return this.b.d},
hv(a){return this.ghu().$1(a)}}
A.kL.prototype={
hA(a,b,c){var s,r,q,p,o
if(a<this.a)return!1
s=this.b
if(s==null)return!0
r=new A.kN(a)
q=new A.kO(a)
if(0>=s.length)return A.a(s,0)
p=r.$1(s[0])
if(typeof p!=="number")return A.ag(p)
o=!1
if(b>=p){if(2>=s.length)return A.a(s,2)
r=r.$1(s[2])
if(typeof r!=="number")return A.ag(r)
if(b<=r){if(3>=s.length)return A.a(s,3)
r=q.$1(s[3])
if(typeof r!=="number")return A.ag(r)
if(c>=r){if(1>=s.length)return A.a(s,1)
r=q.$1(s[1])
if(typeof r!=="number")return A.ag(r)
r=c<=r}else r=o}else r=o}else r=o
return r}}
A.kM.prototype={
$1(a){return typeof a=="number"},
$S:12}
A.kN.prototype={
$1(a){var s=B.b.ae(1,this.a)
return B.b.D(B.c.a4((a+180)/360*s),0,s-1)},
$S:18}
A.kO.prototype={
$1(a){var s=B.b.ae(1,this.a)
return B.b.D(B.c.a4(A.p9(a)*s),0,s-1)},
$S:18}
A.dt.prototype={
cj(a){var s,r=this.c
A:{if(typeof r=="string"){s=r
break A}if(t.f.b(r)){s=A.bh(r.h(0,a))
break A}s=null
break A}return s}}
A.bS.prototype={}
A.eH.prototype={}
A.fn.prototype={}
A.c3.prototype={}
A.ox.prototype={}
A.hq.prototype={}
A.kr.prototype={
$1(a){return t.aL.a(a).b===0},
$S:92}
A.ks.prototype={}
A.kt.prototype={
h7(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i=this,h=A.b([i.c0(b,c),i.c0(b,d),i.c0(b,e)],t.b)
for(s=1/0,r=-1/0,q=0;q<3;++q){p=h[q]
if(0>=p.length)return A.a(p,0)
o=p[0]
s=Math.min(s,o)
r=Math.max(r,o)}for(o=i.b,n=B.c.a4(s/o)+1,m=h;l=n*o,l<r;++n,m=j){k=i.dn(m,0,l)
j=k.b
i.dl(k.a)
if(j.length<3)return}i.dl(m)},
c0(a,b){var s,r,q,p,o,n=A.b([],t.n)
for(s=this.a,r=b*s,q=a.length,p=0;p<s;++p){o=r+p
if(!(o<q))return A.a(a,o)
n.push(a[o])}return n},
dl(a){var s,r,q,p,o,n,m,l,k,j,i=this
t.jj.a(a)
s=a.length
if(s<3)return
for(r=1/0,q=-1/0,p=0;p<s;++p){o=a[p]
if(1>=o.length)return A.a(o,1)
n=o[1]
r=Math.min(r,n)
q=Math.max(q,n)}for(s=i.b,m=B.c.a4(r/s)+1,l=a;n=m*s,n<q;++m,l=j){k=i.dn(l,1,n)
j=k.b
i.cV(k.a)
if(j.length<3)return}i.cV(l)},
dn(a,b,c){var s,r,q,p,o,n,m,l,k,j,i
t.jj.a(a)
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
if(!(b<n.length))return A.a(n,b)
k=n[b]
if(!(b<l.length))return A.a(l,b)
j=l[b]
if(k<=c)B.a.k(r,n)
if(k>=c)B.a.k(q,n)
if(!(k<c&&j>c))s=k>c&&j<c
else s=!0
if(s){i=this.eT(n,l,b,c)
B.a.k(r,i)
B.a.k(q,i)}}return new A.z(r,q)},
eT(a,b,c,d){var s,r,q,p,o,n,m,l,k=t.H
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
cV(a){var s,r,q,p,o,n
t.jj.a(a)
s=a.length
if(s<3)return
r=this.c
q=B.b.a7(r.length,this.a)
for(p=0;p<a.length;a.length===s||(0,A.i)(a),++p)B.a.F(r,a[p])
for(s=this.d,o=1;n=o+1,n<a.length;o=n){B.a.k(s,q)
r=q+o
B.a.k(s,r)
B.a.k(s,r+1)}}}
A.cr.prototype={
al(){return"LineJoin."+this.b}}
A.dg.prototype={
al(){return"LineCap."+this.b}}
A.aO.prototype={
al(){return"_Join."+this.b}}
A.ek.prototype={}
A.l5.prototype={
cr(a,b){var s,r,q,p=this,o=p.Q
if(o>0&&o+a>16e3)p.ci()
p.e2(a)
o=p.as
s=o+b
r=p.x
q=r.length
if(s>q){q=Math.max(s,q*2)
q=new Uint16Array(q)
B.O.Z(q,0,o,r)
p.x=q}},
e2(a){var s=this,r=s.Q,q=(r+a)*2,p=s.f,o=p.length
if(q>o){o=Math.max(q,o*2)
o=new Float32Array(o)
B.n.Z(o,0,r*2,p)
s.f=o
r=o}else r=p
p=s.a
if(p&&q>s.r.length){r=Math.max(q,r.length)
r=new Float32Array(r)
B.n.Z(r,0,s.Q*2,s.r)
s.r=r}if(p&&B.b.O(q,2)>s.w.length){r=B.c.O(Math.max(q,s.f.length),2)
r=new Uint8Array(r)
B.j.Z(r,0,s.Q,s.w)
s.w=r}if(s.b&&q>s.d.length){r=Math.max(q,s.f.length)
r=new Float32Array(r)
B.n.Z(r,0,s.Q*2,s.d)
s.d=r}if(s.c&&q>s.e.length){r=Math.max(q,s.f.length)
r=new Float32Array(r)
B.n.Z(r,0,s.Q*2,s.e)
s.e=r}},
ci(){var s,r,q,p,o,n,m=this,l=null,k=m.a
if(k&&(m.Q&1)===1){m.e2(1)
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
s[o]=0}m.Q=r+1}if(m.as>0){s=new Float32Array(A.a1(A.iY(m.f,0,m.Q*2)))
r=k?new Float32Array(A.a1(A.iY(m.r,0,m.Q*2))):l
q=new Uint16Array(A.a1(A.qn(m.x,0,m.as)))
p=m.b?new Float32Array(A.a1(A.iY(m.d,0,m.Q*2))):l
o=m.c?new Float32Array(A.a1(A.iY(m.e,0,m.Q*2))):l
k=k?new Uint8Array(A.a1(A.hB(m.w,0,m.Q))):l
n=m.y
n=n.length===0?l:new Uint16Array(A.a1(A.qn(n,0,m.z)))
B.a.k(m.at,new A.ek(n,s,r,q,p,o,k))}m.z=m.as=m.Q=0}}
A.iX.prototype={
dA(a,b,c,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d
t.L.a(a0)
s=c-b
if(s<3||s>65e3)return
r=A.cj(a,b*2,c*2)
q=A.pC(r,a0)
p=q.length
if(p===0)return
o=this.a
o.cr(s,p)
n=o.Q
m=o.f
l=n*2
for(p=s*2,k=r.length,j=m.$flags|0,i=0;i<p;++i,l=h){h=l+1
if(!(i<k))return A.a(r,i)
g=r[i]
j&2&&A.w(m)
if(!(l>=0&&l<m.length))return A.a(m,l)
m[l]=g}f=o.x
e=o.as
for(p=q.length,k=f.$flags|0,i=0;i<p;++i,e=d){d=e+1
j=q[i]
k&2&&A.w(f)
if(!(e<f.length))return A.a(f,e)
f[e]=n+j}if(this.b)this.fH(n,s,a0)
o.Q+=s
o.as=e},
fH(a,b,c){var s,r,q,p,o,n,m,l,k,j,i,h
t.L.a(c)
s=this.a
r=s.y
q=r.length
p=s.z
o=p+b*2
if(q<o){q=Math.max(o,q*2)
q=new Uint16Array(q)
B.O.Z(q,0,p,r)
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
A.ju.prototype={
c3(f9,g0,g1,g2,g3,g4,g5,g6,g7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8=this
if(g5==null)g5=f8.b
s=g1-g0
if(s<2)return
if(s>1800){r=g0+1800-1
s=g6==null
q=0
if(!s)for(p=g0+1,o=f9.length;p<=r;++p){n=p*2
if(!(n>=0&&n<o))return A.a(f9,n)
m=f9[n]
l=n-2
if(!(l>=0&&l<o))return A.a(f9,l)
k=m-f9[l]
l=n+1
if(!(l<o))return A.a(f9,l)
l=f9[l];--n
if(!(n>=0&&n<o))return A.a(f9,n)
j=l-f9[n]
q+=Math.sqrt(k*k+j*j)}f8.dz(f9,g0,r+1,g2,g3,g5,g6,g7)
f8.dz(f9,r,g1,g2,g3,g5,s?null:g6+q*g7,g7)
return}f8.r=g6
f8.w=g7
o=f8.Q
if(s*2>o.length)s=f8.Q=new Float64Array(s*4)
else s=o
i=g2*g2
for(o=s.$flags|0,n=f9.length,m=s.length,l=g1-1,p=g0,h=0;p<g1;++p){g=p*2
if(!(g>=0&&g<n))return A.a(f9,g)
f=f9[g];++g
if(!(g<n))return A.a(f9,g)
e=f9[g]
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
f8.a.cr(h*32+18,h*96+54)
f8.f=0
f8.as=f8.at=-1
if(g4){for(;;){o=!1
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
s[o]=n;++h}b=g5===B.a3?1.05:2
a=h-1
if(g4){o=a*2
n=o-2
if(!(n>=0&&n<m))return A.a(s,n)
a0=s[n];--o
if(!(o>=0&&o<m))return A.a(s,o)
a1=s[o]
if(0>=m)return A.a(s,0)
o=s[0]
if(1>=m)return A.a(s,1)
a2=A.pW(a0,a1,o,s[1])
a3=a2.a
a4=a2.b}else{a0=0
a1=0
a3=0
a4=0}for(o=g3===B.a2,n=g3===B.a1,l=g5.a,g=g5===B.aU,a5=g4,a6=a5,a7=0,a8=0,a9=!1,b0=0,b1=0,p=0;p<h;++p,a6=!0,a5=!0){d=p<a
b2=d||g4
if(d){b3=p*2+2
if(!(b3<m))return A.a(s,b3)
b4=s[b3]}else{if(2>=m)return A.a(s,2)
b4=s[2]}if(d){b3=p*2+3
if(!(b3<m))return A.a(s,b3)
b5=s[b3]}else{if(3>=m)return A.a(s,3)
b5=s[3]}if(a5){b1=a4
b0=a3}if(a6){a8=a1
a7=a0
a9=!0}b3=p*2
if(!(b3<m))return A.a(s,b3)
a0=s[b3];++b3
if(!(b3<m))return A.a(s,b3)
a1=s[b3]
if(b2){b6=A.pW(a0,a1,b4,b5)
a3=b6.a
a4=b6.b}else{a4=b1
a3=b0}if(!a5){b1=a4
b0=a3}b7=b0+a3
b8=b1+a4
b3=b7*b7+b8*b8
b9=Math.sqrt(b3)
if(b9>0){b7/=b9
b8/=b9}c0=b0*a3+b1*a4
c1=b7*a3+b8*a4
c2=c1!==0?1/c1:1/0
c3=Math.sqrt(Math.max(0,2-2*c1))
c4=c1<$.rm()&&a9&&b2
c5=b0*a4-b1*a3>0
c6=Math.min(c2,2)
c7=b7*c6
c8=b8*c6
c9=B.c.D((c2-3)/5,0,1)
if(c4&&p>0){d0=a0-a7
d1=a1-a8
d2=Math.sqrt(d0*d0+d1*d1)
if(d2>240){d3=120/d2
d4=a0-B.c.a0(d0*d3)
d5=a1-B.c.a0(d1*d3)
k=d4-a7
j=d5-a8
f8.f=f8.f+Math.sqrt(k*k+j*j)
f8.aa(d4,d5,b0,b1,0,0,b0,b1)
a8=d5
a7=d4}}d6=a9&&b2
if(d6)if(g)d7=B.S
else{if(!(l<8))return A.a(B.a5,l)
d8=B.a5[l]
d7=d8}else if(g4)d7=B.G
else{if(n)d8=B.D
else d8=o?B.U:B.G
d7=d8}if(d6&&d7===B.D)if(c2<1.05)d7=B.t
else if(c2<=2)d7=B.F
if(d7===B.t&&c2>b)d7=B.E
if(d7===B.E){if(c2>2)d7=B.T
if(c2<b)d7=B.t}if(a9){k=a0-a7
j=a1-a8
f8.f=f8.f+Math.sqrt(k*k+j*j)}A:{if(B.t===d7){f8.aa(a0,a1,b7*c2,b8*c2,0,0,c7,c8)
break A}if(B.T===d7){if(c2>100){d9=-a3
e0=-a4}else{k=b0-a3
j=b1-a4
b3=Math.sqrt(b3)
c3=Math.sqrt(k*k+j*j)
d8=c5?-1:1
d3=c2*b3/c3*d8
d9=-b8*d3
e0=b7*d3}f8.aa(a0,a1,d9,e0,0,0,c7+(d9-c7)*c9,c8+(e0-c8)*c9)
b3=-d9
c3=-e0
f8.aa(a0,a1,b3,c3,0,0,c7+(b3-c7)*c9,c8+(c3-c8)*c9)
break A}if(B.E===d7||B.F===d7){e1=-Math.sqrt(c2*c2-1)
e2=c5?e1:0
e3=c5?0:e1
if(a9)f8.aa(a0,a1,b0,b1,e2,e3,c7,c8)
if(d7===B.F){e4=B.c.a3(2*c3*180/3.141592653589793/20)
for(b3=a3-b0,c3=a4-b1,e5=1.0904+c0*(-3.2452+c0*(3.55645-c0*1.43519)),e6=0.848013+c0*(-1.06021+c0*0.215638),d8=-c7,e7=-c8,e8=1;e8<e4;++e8){e9=e8/e4
if(e9!==0.5){f0=e9-0.5
e9+=e9*f0*(e9-1)*(e5*f0*f0+e6)}f1=b3*e9+b0
f2=c3*e9+b1
f3=Math.sqrt(f1*f1+f2*f2)
d3=(c5?-1:1)/f3
f8.d=c5?d8:c7
f8.e=c5?e7:c8
f4=c5?1:0
f8.aZ(f8.am(a0,a1,f1*d3,f2*d3,f4),c5)}}if(b2)f8.aa(a0,a1,a3,a4,-e2,-e3,c7,c8)
break A}if(B.G===d7){if(!a9)f8.dc(a0,a1,b7,b8,c7,c8,!1)
f8.aa(a0,a1,b7,b8,0,0,c7,c8)
if(a9)f8.dc(a0,a1,b7,b8,c7,c8,!0)
break A}if(B.U===d7){d3=a9?1:-1
f8.aa(a0,a1,b7,b8,d3,d3,c7,c8)
break A}if(B.S===d7){f8.aa(a0,a1,b0,b1,0,0,b0,b1)
f8.as=f8.at=-1
f8.aa(a0,a1,a3,a4,0,0,a3,a4)
break A}if(B.D===d7){if(a9){f5=c7+(b0-c7)*c9
f6=c8+(b1-c8)*c9
f8.aa(a0,a1,b0,b1,0,0,f5,f6)
f8.d=f5
f8.e=f6
f8.cW(a0,a1,b0,b1,3.141592653589793,-1)}if(b2){f5=c7+(a3-c7)*c9
f6=c8+(a4-c8)*c9
f8.d=f5
f8.e=f6
f8.cW(a0,a1,a3,a4,3.141592653589793,1)
f8.as=f8.at=-1
f8.aa(a0,a1,a3,a4,0,0,f5,f6)}}}if(c4&&d){d0=b4-a0
d1=b5-a1
f7=Math.sqrt(d0*d0+d1*d1)
if(f7>240){d3=120/f7
d4=a0+B.c.a0(d0*d3)
d5=a1+B.c.a0(d1*d3)
k=d4-a0
j=d5-a1
f8.f=f8.f+Math.sqrt(k*k+j*j)
f8.aa(d4,d5,a3,a4,0,0,a3,a4)
a1=d5
a0=d4}}}},
hb(a,b,c,d,e,f,g){return this.c3(a,b,c,d,e,!1,null,f,g)},
ha(a,b,c,d,e){return this.c3(a,b,c,d,B.l,e,null,null,0)},
dz(a,b,c,d,e,f,g,h){return this.c3(a,b,c,d,e,!1,f,g,h)},
aZ(a,b){var s,r,q,p,o,n=this,m=n.as
if(m>=0&&n.at>=0){s=n.a
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
m=n.at
if(!(q<o))return A.a(r,q)
r[q]=m
s.as=q+1}if(b)n.at=a
else n.as=a},
dc(a,b,c,d,e,f,g){var s,r,q,p,o,n=this
n.d=e
n.e=f
s=n.am(a,b,c,d,0)
r=n.a
q=r.w
p=g?3:4
q.$flags&2&&A.w(q)
if(!(s>=0&&s<q.length))return A.a(q,s)
q[s]=p
n.aZ(s,!1)
o=n.am(a,b,-c,-d,1)
r=r.w
q=g?5:6
r.$flags&2&&A.w(r)
if(!(o>=0&&o<r.length))return A.a(r,o)
r[o]=q
n.aZ(o,!0)},
aa(a,b,c,d,e,f,g,h){var s=this
s.d=g
s.e=h
s.aZ(s.am(a,b,c+d*e,d-c*e,0),!1)
s.aZ(s.am(a,b,-c+d*f,-d-c*f,1),!0)},
cW(a,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.c?0:0.5,e=g.b_(a,a0,0,0,0.5,!0),d=Math.max(1,B.c.bw(a3/0.5235987755982988)),c=a3/d*a4,b=1/Math.cos(c/2)
g.b_(a,a0,a1,a2,f,!0)
for(s=0;s<d;++s){r=c*(s+0.5)
q=Math.cos(r)*b
p=Math.sin(r)*b
g.b_(a,a0,a1*q-a2*p,a1*p+a2*q,f,!0)}o=a3*a4
q=Math.cos(o)
p=Math.sin(o)
g.b_(a,a0,a1*q-a2*p,a1*p+a2*q,f,!0)
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
b_(a,b,c,d,e,f){var s,r,q,p,o,n,m=this,l=m.a,k=l.Q,j=k*2,i=l.f
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
am(a,b,c,d,e){return this.b_(a,b,c,d,e,!1)},
hc(a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=this
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
s.cr(4,6)
d=a3.am(n,l,f,e,0)
o=-f
m=-e
c=a3.am(n,l,o,m,1)
b=a3.am(k,j,f,e,0)
a=a3.am(k,j,o,m,1)
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
A.cY.prototype={}
A.bm.prototype={
saf(a){this.Q=t.h9.a(a)}}
A.cZ.prototype={
hK(a,b,c,d){var s,r,q,p,o,n,m=1/B.b.ae(1,a),l=b*m,k=c*m
for(s=this.c,r="r|"+a+"/"+b+"/"+c+"|",q=0;q<s.length;++q){p=s[q]
o=p.f!=null||p.y||p.c.length===0
n=""+p.a
p.z=o?r+n+"|"+q:"p|"+n+"|"+p.c+"|"+B.c.a4((l+p.d/4096*m)*d)+"|"+B.c.a4((k+p.e/4096*m)*d)}},
cu(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=null,d=t.dO,c=A.b([],d)
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
n=g.a
d.push([g.d,g.e,g.f,g.r,g.w,g.b,n.a,n.b,n.c,n.d,g.c])}r=f.f5()
o=f.a
return[c,s,d,r,o==null?e:o.cu()]},
f5(){var s,r,q,p,o,n,m,l
for(s=this.c,r=s.length,q=0,p=0;p<r;++p){o=s[p].as
o=o==null?null:o.d.length
q+=o==null?0:o}if(q===0)return null
n=new Float32Array(q)
for(m=0,p=0;p<s.length;s.length===r||(0,A.i)(s),++p){o=s[p].as
l=o==null?null:o.d
if(l==null)continue
B.n.bG(n,m,l)
m+=l.length}return n}}
A.aI.prototype={
shY(a){this.e=t.nE.a(a)}}
A.kx.prototype={
ei(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i=this
for(s=i.c,r=s.as,q=i.x,p=i.d,o=t.t,n=0;n<r.length;++n){m=r[n]
if(m.c!==p)continue
m=m.d
l=q.h(0,m)
if(l==null){l=A.b([],o)
q.m(0,m,l)
m=l}else m=l
B.a.k(m,n)}for(r=s.ax,q=i.y,n=0;n<r.length;++n){m=r[n].b
if(m.b!==p)continue
m=m.c
l=q.h(0,m)
if(l==null){l=A.b([],o)
q.m(0,m,l)
m=l}else m=l
B.a.k(m,n)}if(i.w)for(s=s.at,r=s.length,q=i.a,k=0;k<s.length;s.length===r||(0,A.i)(s),++k){j=s[k]
if(j instanceof A.ba)p=j.db!=null
else p=!1
if(p)q.k(0,j.b)}},
fO(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
t.lL.a(a)
s=this.e
if(s==null)return
for(r=a.length,q=this.c.ax,p=0;p<a.length;a.length===r||(0,A.i)(a),++p){o=a[p]
n=o.a
if(n<0||o.c.length===0)continue
if(!(n>=0&&n<q.length))return A.a(q,n)
m=q[n]
l=A.p4(o.c)
k=m.z?l.toUpperCase():l
j=A.xG(k)
i=o.f!=null
n=m.ax
if(n==null)n=1.15
h=i?60:m.go
g=m.ay
A:{if(B.ag===g){f=j?1:-1
break A}if(B.ah===g){f=j?-1:1
break A}if(B.dh===g){f=j?1:-1
break A}if(B.di===g){f=j?-1:1
break A}f=0
break A}o.as=A.rb(s,k,f,m.at,n,h,i,m.y,m.w)}},
hg(k2,k3,k4,k5,k6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9,i0,i1,i2,i3,i4,i5,i6,i7,i8,i9,j0,j1,j2,j3,j4,j5,j6,j7,j8,j9,k0=this,k1=null
t.mm.a(k2)
s=k0.c
r=s.as
q=t.bQ
p=A.T(r.length,k1,!1,q)
o=t.N
n=t.S
m=A.T(r.length,0,!1,n)
l=A.T(r.length,k1,!1,q)
k=A.b([],t.fw)
j=A.b([],t.e)
i=A.C(n,t.aB)
h=A.C(n,t.lc)
g=k3>=k4
f=g?0.75:2
e=g?0:2
d=k3+s.CW
k0.r=!1
c=new A.kH(d,g)
b=k0.z
b.a=d
a=new A.kJ(p,k,b,A.C(o,t.ct),m,l)
for(q=J.G(k2),n=d+1,a0=t.O,a1=s.ax,a2=k0.Q,a3=a2.c,a4=t.E,a5=t.gw,a6=t.n,a7=k0.a,a8=6.283185307179586*(k6+0.5),a9=k0.as,b0=k0.at,b1=t.t,b2=t.s,b3=s.d,b4=t.c3,b5=k0.d,s=s.ay,b6=k0.y,b7=k0.x;q.n();){b8=q.gp()
b9=A.b([],b1)
c0=b7.h(0,b8.gaw())
if(c0==null)c0=B.m
c1=c0.length
c2=0
for(;c2<c0.length;c0.length===c1||(0,A.i)(c0),++c2){c3=c0[c2]
if(!(c3>=0&&c3<r.length))return A.a(r,c3)
c4=r[c3]
if(c.$2(c4.ax,c4.ay))b9.push(c3)}c0=A.b([],b1)
c1=b6.h(0,b8.gaw())
if(c1==null)c1=B.m
c4=c1.length
c2=0
for(;c2<c1.length;c1.length===c4||(0,A.i)(c1),++c2){c5=c1[c2]
if(!(c5>=0&&c5<a1.length))return A.a(a1,c5)
c6=a1[c5].b
if(c.$2(c6.z,c6.Q))c0.push(c5)}if(b9.length===0&&c0.length===0)continue
c7=4096/b8.gcg()
c1=s.length
if(b5<c1){if(!(b5>=0))return A.a(s,b5)
c8=s[b5]}else c8=k1
c9=c8==null||c8 instanceof A.bS?k1:c8.cj(b8.gaw())
c1=b8.gbx()
c4=A.b([],b1)
for(c6=b9.length,c2=0;c2<b9.length;b9.length===c6||(0,A.i)(b9),++c2){c3=b9[c2]
if(!(c3>=0&&c3<r.length))return A.a(r,c3)
if(r[c3].b==null)c4.push(c3)}c0=A.b([new A.b3(c1,c4,c0)],b4)
for(c1=b9.length,c2=0;c2<b9.length;b9.length===c1||(0,A.i)(b9),++c2){c3=b9[c2]
if(!(c3>=0&&c3<r.length))return A.a(r,c3)
d0=r[c3].b
if(d0!=null)c0.push(new A.b3(k0.eL(b8,d0,c9),A.b([c3],b1),B.m))}for(b9=c0.length,c1=c9!=null,c2=0;c2<c0.length;c0.length===b9||(0,A.i)(c0),++c2){c4=c0[c2]
d1=c4.b
d2=c4.c
for(c4=J.G(c4.a),c6=J.a2(d2),d3=J.a2(d1);c4.n();){d4={}
d5=c4.gp()
d6=d5.bs(b8)
if(c1&&d6.h(0,c9)!=null)d6.m(0,"$id",d6.h(0,c9))
b.saf(d6)
d7=d5.gK()
A:{if(1===d7){d8="Point"
break A}if(2===d7){d8="LineString"
break A}d8="Polygon"
break A}b.c=d8
d4.a=!1
d4.b=c7
d9=new A.kI(d4,k0,d5)
e0=new A.kK(d4,k0,d9)
b.shN(new A.kE(d4,k0,d9,k3,k5,k6))
for(d8=d3.gt(d1),e1=d5 instanceof A.dw;d8.n();){e2=d8.gp()
if(e2>>>0!==e2||e2>=r.length)return A.a(r,e2)
e3=r[e2]
e4=e3.f
B:{if(B.u===e4||B.H===e4){e5=d5.gK()===3
break B}if(B.q===e4){e5=!0
break B}if(B.v===e4){e5=e3.x?d5.gK()===3:d5.gK()!==1
break B}e5=k1}if(!e5||!e3.e.$1(b))continue
e6=e3.a
if(e6!=null){e0.$0()
e5=e6.a.$1(b)
if(!(typeof e5=="number"))if(typeof e5=="string")e5=A.P(e5)
else if(A.M(e5))e5=e5?1:0
else e5=k1
if(e5==null)e5=0
e7=Math.max(0,e5)
e5=e6.b.$1(b)
if(!(typeof e5=="number"))if(typeof e5=="string")e5=A.P(e5)
else if(A.M(e5))e5=e5?1:0
else e5=k1
if(e5==null)e5=0
e8=Math.max(0,e5)
e9=A.bw(e6.c.$1(b))
if(e9==null)e9=B.d9
B.a.a8(a9)
B.a.a8(b0)
for(f0=0;f0<a3.length-1;){B.a.k(a9,a3[f0]);++f0
if(!(f0<a3.length))return A.a(a3,f0)
B.a.k(b0,a3[f0])}e5=h.h(0,e2)
if(e5==null){e5=e6.d
f1=B.b.ae(1,k3)
f2=new Float64Array(256)
f3=new Float64Array(256)
f4=new Float64Array(256)
f5=new Float64Array(256)
f6=new Float64Array(256)
f7=new Float64Array(256)
e5=new A.fK(e2,b3,e5,-f1/8192,new A.b8(f2),new A.b8(f3),new A.b8(f4),new A.b8(f5),new A.b8(f6),new A.b8(f7),new A.b8(new Float64Array(256)),A.b([],b1),A.b([],b2))
h.m(0,e2,e5)
e2=e5}else e2=e5
e5=a2.a
f1=e6.e.$1(b)
if(!(typeof f1=="number"))if(typeof f1=="string")f1=A.P(f1)
else if(A.M(f1))f1=f1?1:0
else f1=k1
if(f1==null)f1=0
f2=B.b.ae(1,k3)
f8=3.141592653589793-a8/f2
f3=Math.cos(Math.atan(0.5*(Math.exp(f8)-Math.exp(-f8))))
f4=e6.f
f9=f4==null?k1:f4.$1(b)
C:{if(typeof f9=="string"){f4=f9.length!==0
g0=f9}else{g0=k1
f4=!1}if(f4){f4=g0
break C}f4=k1
break C}e2.h8(0,e5,a9,b0,e7,e8,e9,f4,f1/(40075016.68557849*f3)*f2*4096)
continue}g1=a.$2(e2,e3)
if(e4===B.u){d9.$0()
e5=g1.c
if(e5==null){e2=a7.u(0,e2)
e2=g1.c=new A.iX(A.qq(!1,!1,!1),e2)}else e2=e5
k0.ex(e2,d4.b,e)
continue}e0.$0()
if(e4===B.q){g2=g1.e
if(g2==null){g2=A.b([],a6)
g1.shY(g2)}g3=new A.kD(k0,g2)
for(f0=0;f0<a3.length-1;){g4=a3[f0]*2;++f0
g5=a3[f0]*2
for(g6=g4;g6<g5;g6+=2)g3.$1(g6)
e2=!1
if(d5.gK()===3)if(g5-g4>=6){e2=a2.a
e5=e2.length
if(!(g4<e5))return A.a(e2,g4)
f1=e2[g4]
f2=g5-2
if(!(f2>=0&&f2<e5))return A.a(e2,f2)
if(f1===e2[f2]){f1=g4+1
if(!(f1<e5))return A.a(e2,f1)
f1=e2[f1]
f2=g5-1
if(!(f2>=0&&f2<e5))return A.a(e2,f2)
f2=f1!==e2[f2]
e2=f2}else e2=!0}if(e2)g3.$1(g4)}continue}g7=g1.d
if(g7==null){e2=new Float64Array(512)
g7=g1.d=new A.ju(A.qq(!0,e3.w,e3.y),e3.as,e3.z,e2)}for(e2=e3.x,e5=e3.Q,f1=e3.r,f0=0;f0<a3.length-1;f0=g8){g4=a3[f0]
g8=f0+1
g5=a3[g8]
if(d5.gK()===2){g9=e5&&e1?d5.a:k1
h0=g9!=null&&g9.length>f0*2+1
f2=a2.a
if(h0){f3=f0*2
if(!(f3<g9.length))return A.a(g9,f3)
f3=g9[f3]}else f3=e5?0:k1
if(h0){f4=f0*2+1
if(!(f4<g9.length))return A.a(g9,f4)
f4=g9[f4]/c7}else f4=0
g7.hb(f2,g4,g5,f,f1,f3,f4)
continue}h1=g5-g4
if(h1<3)continue
f2=k0.ax
f3=h1+1
if(f2.length<f3*2)f2=k0.ax=new Float64Array(f3*4)
f4=h1*2
B.o.a5(f2,0,f4,a2.a,g4*2)
f2=k0.ax
f5=f2.length
if(0>=f5)return A.a(f2,0)
f6=f2[0]
f2.$flags&2&&A.w(f2)
if(!(f4>=0&&f4<f5))return A.a(f2,f4)
f2[f4]=f6;++f4
if(1>=f5)return A.a(f2,1)
f6=f2[1]
if(!(f4<f5))return A.a(f2,f4)
f2[f4]=f6
if(e2)g7.hc(f2,0,f3)
else g7.ha(f2,0,f3,f,!0)}}for(d8=c6.gt(d2);d8.n();){e1=d8.gp()
h2={}
if(e1>>>0!==e1||e1>=a1.length)return A.a(a1,e1)
h3=a1[e1]
e2=h3.b
if(!e2.d.$1(b))continue
h2.a=null
h4=A.xf(e2.e.$1(b))
h5=h2.a=h4.a
h6=h4.b
e5=e2.f
h7=e5==null?"":A.Y(e5.$1(b))
if(A.p4(h5).length===0&&!B.d.u(h5,A.S(57599))&&h7.length===0)continue
h8=A.t(e2.r.$1(b))
h9=B.d.ar(h8,"line")
e8=(a1.length-1-e1)*4096
i0=A.uX(h3,b)
e5=e2.at.$1(b)
if(!(typeof e5=="number"))if(typeof e5=="string")e5=A.P(e5)
else if(A.M(e5))e5=e5?1:0
else e5=k1
i1=(e5==null?0:e5)*3.141592653589793/180
e5=e2.ax
if(e5.gl(0)===0&&h6==null)i2=k1
else{f1=A.C(o,a0)
for(f2=e5.$ti,e5=new A.X(e5,e5.gl(0),f2.i("X<y.E>")),f2=f2.i("y.E");e5.n();){f3=e5.d
if(f3==null)f3=f2.a(f3)
if(B.d.ar(f3,"$geometry:")){f4=$.oJ.h(0,f3)
f4=f4==null?k1:f4.$1(b)}else f4=b.b.h(0,f3)
f1.m(0,f3,f4)}if(h6!=null)f1.m(0,"$format",h6)
i2=f1}if(d5.gK()===3&&!h9){e0.$0()
i3=k0.f9()
if(i3==null)continue
e1=new A.bm(e1,e8+i0,h2.a,i3.a,i3.b,k1,h7,i1,!1,!0)
e1.saf(i2)
B.a.k(j,e1)
continue}if(d5.gK()===1){if(h9)continue
e0.$0()
i4=k0.fv(e1,e8+i0,h2.a,h7,i1)
if(i4!=null){i4.saf(i2)
B.a.k(j,i4)}continue}e0.$0()
i5=Math.max(0,B.c.bw(e2.z-d))
e5=h8==="line-center"
i6=e5?1/0:e2.w*8/B.b.ae(1,i5)
i7=b.a
b.a=n
f8=h3.c.$1(b)
if(!(typeof f8=="number"))if(typeof f8=="string"){f1=A.P(f8)
f8=f1}else{if(A.M(f8))f1=f8?1:0
else f1=k1
f8=f1}i8=f8!=null&&isFinite(f8)?f8:16
b.a=i7
i9=i8*4096/512
if(h9&&h2.a.length!==0&&!e2.x){f1=A.b([],a4)
for(f0=0;f0<a3.length-1;){f2=a2.a
f3=a3[f0]*2;++f0
f1.push(new Float32Array(A.a1(new Float64Array(f2.subarray(f3,A.bi(f3,a3[f0]*2,f2.length))))))}e2=e2.as==null?50:i0
f2=h2.a
f3=k0.dr(h3,f2)
f4=h3.dP
if(f4==null)f4=0.7853981633974483
j0=new A.dk(e8+e2,f2,i6,f3*i9,i9,f4,i2,f1)
if(h8==="line"&&f1.length!==0){e2=i.h(0,e1)
if(e2==null){e2=A.b([],a5)
i.m(0,e1,e2)
e1=e2}else e1=e2
J.pi(e1,j0)}else B.a.F(j,k0.d3(e1,j0,e5))
continue}if(!h9){j1=a2.a
for(e2=e2.as==null,e5=j1.length,f0=0;f0<a3.length-1;++f0){i3=a3[f0]*2
if(!(i3<e5))return A.a(j1,i3)
j2=j1[i3]
f1=i3+1
if(!(f1<e5))return A.a(j1,f1)
j3=j1[f1]
if(j2<0||j3<0||j2>=4096||j3>=4096)continue
f1=e2?50:i0
f1=new A.bm(e1,e8+f1,h2.a,j2,j3,k1,h7,i1,!1,!1)
f1.saf(i2)
B.a.k(j,f1)}continue}j4=h2.a.length===0&&!e2.y
if(h7.length===0)j5=0
else{e2=k0.b.h(0,h7)
e2=e2==null?k1:e2.a
if(e2==null)e2=0
f1=h3.id.$1(b)
if(!(typeof f1=="number"))if(typeof f1=="string")f1=A.P(f1)
else if(A.M(f1))f1=f1?1:0
else f1=k1
j5=e2*(f1==null?1:f1)*i9/24}e2=h2.a
e2=e2.length===0?0:k0.dr(h3,e2)*i9
e2=Math.max(e2,j5)
f1=h3.dP
if(f1==null)f1=0.7853981633974483
k0.eB(i6,e2,i9,f1,e5,new A.kF(h2,j,e1,e8,h3,i0,h7,j4,i1,i2),h2.a.length!==0)}}}}for(s=new A.cs(i,i.$ti.i("cs<1,2>")).gt(0);s.n();){r=s.d
j6=r.a
for(r=A.xs(r.b),q=r.length,c2=0;c2<r.length;r.length===q||(0,A.i)(r),++c2)B.a.F(j,k0.ff(j6,r[c2]))}j7=A.b([],t.D)
B.a.az(k,new A.kG())
for(s=k.length,c2=0;c2<k.length;k.length===s||(0,A.i)(k),++c2){g1=k[c2]
g2=g1.e
if(g2!=null&&g2.length!==0){r=new Float32Array(A.a1(g2))
B.a.k(j7,new A.cY(g1.a,new A.ek(k1,r,k1,new Uint16Array(0),k1,k1,k1),g1.b))}r=g1.c
if(r==null)j8=k1
else{r=r.a
r.ci()
r=r.at
j8=r}if(j8==null){r=g1.d
if(r==null)j8=k1
else{r=r.a
r.ci()
r=r.at
j8=r}}if(j8==null)continue
for(r=j8.length,q=g1.a,o=g1.b,j9=0;j9<j8.length;j8.length===r||(0,A.i)(j8),++j9)B.a.k(j7,new A.cY(q,j8[j9],o))}k0.fO(j)
s=A.b([],t.dY)
for(r=new A.cu(h,h.r,h.e,h.$ti.i("cu<2>"));r.n();){q=r.d.hw()
if(q!=null)s.push(q)}return new A.cZ(k0.w?k0.fT(j7,k3,d):k1,j7,j,s)},
fT(a,b,c){var s,r
t.ke.a(a)
s=this.c
if(s.f.a.length===0)return A.pI(s,a,0,0,c)
r=Math.min(b,30)
return A.pI(s,a,Math.max(B.b.c_(128,r),2),B.b.c_(512,r),c)},
eB(a,b,c,d,e,f,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g
t.hi.a(f)
s=a0?0.6*c:0
for(r=this.Q,q=r.c,p=2*c,o=0;o<q.length-1;){n=r.a
m=q[o]*2;++o
for(n=A.r5(new Float32Array(A.a1(new Float64Array(n.subarray(m,A.bi(m,q[o]*2,n.length)))))),m=n.length,l=0;l<n.length;n.length===m||(0,A.i)(n),++l){k=n[l]
j=e?A.r4(k,b,s,d):A.rc(k,a,b,p,s,d)
for(i=j.length,h=0;h<j.length;j.length===i||(0,A.i)(j),++h){g=j[h]
f.$3(g.a,g.b,g.c)}}}},
eL(a,b,c){var s,r,q,p,o,n,m,l
t.u.a(b)
s=a.gbx()
r=A.ei(s.length,new A.kz(this,s,a,c,b),!0,t.i)
q=s.length
p=J.om(q,t.S)
for(o=0;o<q;++o)p[o]=o
B.a.az(p,new A.kA(r))
n=A.b([],t.fB)
for(m=p.length,l=0;l<p.length;p.length===m||(0,A.i)(p),++l){o=p[l]
if(!(o<s.length))return A.a(s,o)
n.push(s[o])}return n},
f9(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0=this.Q,c1=c0.a
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
a1=Math.max(a1,c0)}a2=new A.kB(c1,k,m)
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
fJ(a){var s,r,q,p,o=this.Q,n=o.a
for(o=o.b,s=n.length,r=n.$flags|0,q=0;q<o;++q){if(!(q<s))return A.a(n,q)
p=n[q]
r&2&&A.w(n)
n[q]=p*a}},
ex(b2,b3,b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6=this,a7={},a8=a6.Q,a9=a8.a,b0=a8.b,b1=a6.ax
if(b0>b1.length)b0=a6.ax=new Float64Array(b0*2)
else b0=b1
s=b4*b4
r=s*4
a7.a=0
a7.b=-1
b1=a6.ay
B.a.a8(b1)
q=new A.ky(a7,a6,b2,b0)
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
if(i>=0){b2.dA(b0,i,j,b1)
B.a.a8(b1)}a7.b=j}else{i=a7.b
if(i>=0)B.a.k(b1,j-i)
else a7.a=j}}q.$0()},
fv(a,b,c,d,e){var s,r,q,p=this.Q
if(p.b<2)return null
p=p.a
s=p.length
if(0>=s)return A.a(p,0)
r=p[0]
if(1>=s)return A.a(p,1)
q=p[1]
if(r<0||q<0||r>=4096||q>=4096)return null
return new A.bm(a,b,c,r,q,null,d,e,!1,!1)},
dr(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h=A.p4(b),g=a.z?h.toUpperCase():h,f=i.f
if(f!=null){s=f.hr(a.y)
r=A.b([],t.t)
q=A.a3(new A.c_(g),t.mO.i("f.E"))
q=A.xe(q)
p=q.length
o=0
for(;o<q.length;q.length===p||(0,A.i)(q),++o){n=q[o]
if(n>=0)r.push(n)}if(f.i_(s,A.k9(r,0,null))){for(q=r.length,p=f.r,m=s-512,l=a.at,k=0,o=0;o<r.length;r.length===q||(0,A.i)(r),++o){n=r[o]
if(!(m>=0&&m<p.length))return A.a(p,m)
j=p[m].h(0,n)
if(j!=null)k+=j.r/24+l}return k}i.r=!0}r=i.ch
q=r.h(0,b)
if(q==null){q=new A.kC(i,b,g,a).$0()
r.m(0,b,q)
r=q}else r=q
return r},
d3(a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=A.b([],t.e),b=a2.e,a=0.6*b,a0=2*b
for(b=a2.w,s=b.length,r=a2.a,q=a2.b,p=a2.r,o=a2.c,n=a2.d,m=a2.f,l=0;l<b.length;b.length===s||(0,A.i)(b),++l)for(k=A.r5(b[l]),j=k.length,i=0;i<k.length;k.length===j||(0,A.i)(k),++i){h=k[i]
g=a3?A.r4(h,n,a,m):A.rc(h,o,n,a0,a,m)
f=g.length
e=0
for(;e<g.length;g.length===f||(0,A.i)(g),++e){d=g[e]
d=new A.bm(a1,r,q,d.a,d.b,h,"",0,!1,!1)
d.saf(p)
B.a.k(c,d)}}return c},
ff(a,b){return this.d3(a,b,!1)},
shE(a){this.b=t.a.a(a)}}
A.kH.prototype={
$2(a,b){var s=this.a
if(b>s)s=this.b||a<s+1
else s=!1
return s},
$S:15}
A.kJ.prototype={
$2(a,b){var s,r,q,p,o,n,m,l,k,j=this,i=b.at,h=i.length
if(h===0){h=j.a
if(!(a>=0&&a<h.length))return A.a(h,a)
s=h[a]
if(s==null){s=new A.aI(a,null)
B.a.m(h,a,s)
B.a.k(j.b,s)}return s}r=[]
for(q=j.c,p=0;p<i.length;i.length===h||(0,A.i)(i),++p){o=i[p]
if(B.d.ar(o,"$geometry:")){n=$.oJ.h(0,o)
n=n==null?null:n.$1(q)}else n=q.b.h(0,o)
r.push(n)}m=""+a+"|"+B.a.ac(r,"\x01")
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
q=A.C(t.N,t.O)
for(k=0;k<i.length;++k){if(!(k<r.length))return A.a(r,k)
n=r[k]
if(n!=null)q.m(0,i[k],n)}s=new A.aI(a,q)
B.a.m(j.f,a,s)
h.m(0,m,s)
B.a.k(j.b,s)
return s},
$S:93}
A.kI.prototype={
$0(){var s=this.a
if(s.a)return
s.a=!0
s=this.b.Q
s.b=0
B.a.a8(s.c)
this.c.cp(s)},
$S:0}
A.kK.prototype={
$0(){var s,r
this.c.$0()
s=this.a
r=s.b
if(r!==1){this.b.fJ(r)
s.b=1}},
$S:0}
A.kE.prototype={
$0(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
f.c.$0()
s=f.a.b/4096
r=B.b.ae(1,f.d)
q=t.n
p=A.b([],q)
for(o=f.b.Q,n=f.e,m=f.f,l=0;l<o.b;l+=2){k=o.a
j=k.length
if(!(l<j))return A.a(k,l)
i=k[l]
h=l+1
if(!(h<j))return A.a(k,h)
g=3.141592653589793*(1-2*((m+k[h]*s)/r))
B.a.F(p,A.b([(n+i*s)/r*360-180,Math.atan((Math.exp(g)-Math.exp(-g))/2)*180/3.141592653589793],q))}return p},
$S:94}
A.kD.prototype={
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
$S:36}
A.kF.prototype={
$3(a,b,c){var s=this,r=s.e.b.as==null?50:s.f,q=s.a.a,p=s.w,o=s.x
if(p)o=c+o
p=new A.bm(s.c,s.d+r,q,a,b,null,s.r,o,p,!0)
p.saf(s.y)
return B.a.k(s.b,p)},
$S:95}
A.kG.prototype={
$2(a,b){var s=t.ct
return s.a(a).a-s.a(b).a},
$S:96}
A.kz.prototype={
$1(a){var s,r=this,q=r.b
if(!(a<q.length))return A.a(q,a)
s=q[a].bs(r.c)
q=r.d
if(q!=null&&s.h(0,q)!=null)s.m(0,"$id",s.h(0,q))
q=r.a.z
q.saf(s)
q=A.D(r.e.$1(q))
return q==null?0:q},
$S:16}
A.kA.prototype={
$2(a,b){var s,r,q,p
A.E(a)
A.E(b)
s=this.a
r=s.length
if(!(a>=0&&a<r))return A.a(s,a)
q=s[a]
if(!(b>=0&&b<r))return A.a(s,b)
p=B.c.ab(q,s[b])
return p!==0?p:B.b.ab(a,b)},
$S:97}
A.kB.prototype={
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
i=B.c.D(j===0?0:((a-s)*l+(a0-r)*k)/j,0,1)
h=s+l*i-a
g=r+k*i-a0
o=Math.min(o,h*h+g*g)}return p?o:-o},
$S:32}
A.ky.prototype={
$0(){var s=this,r=s.a,q=r.b
if(q>=0)s.c.dA(s.d,q,r.a,s.b.ay)
r.b=-1
B.a.a8(s.b.ay)},
$S:0}
A.kC.prototype={
$0(){var s,r=this,q=r.a.e
if(q==null)return new A.c_(r.b).gl(0)*0.55
s=r.d
s=A.rb(q,r.c,0,s.at,1.2,1/0,!0,s.y,s.w)
s=s==null?null:s.e
return s==null?new A.c_(r.b).gl(0)*0.55:s},
$S:98}
A.dk.prototype={
si3(a){this.w=t.iu.a(a)}}
A.nT.prototype={
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
$S:99}
A.nx.prototype={
$0(){var s=this.a,r=s.a
if(r.length>=4)B.a.k(this.b,new Float32Array(A.a1(r)))
s.a=A.b([],t.n)},
$S:0}
A.nw.prototype={
$1(a){t.lo.a(a)
return this.a<=this.b*2},
$S:100}
A.lL.prototype={
$1(a){var s=this.a,r=a*2
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
$S:16}
A.lM.prototype={
$1(a){var s=this.a,r=a*2+1
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
$S:16}
A.lK.prototype={
$4(a,b,c,d){var s=c-a,r=d-b
return Math.sqrt(s*s+r*r)},
$S:101}
A.bf.prototype={
B(a,b){if(b==null)return!1
return b instanceof A.bf&&b.a===this.a&&b.b===this.b&&b.c===this.c},
gR(a){return(this.a*4194304+this.b)*4194304+this.c},
q(a){return""+this.a+"/"+this.b+"/"+this.c}}
A.kQ.prototype={
ht(a,b,c){var s,r=this,q=r.w
if(q!=null){s=r.r
s=s==null?null:!s.gdi()
s=s===!0}else s=!0
if(s)return null
return q+"/"+r.c+"/"+a+"/"+b+"/"+c+r.e},
bC(a,b,c){var s=0,r=A.av(t.nh),q,p=this,o,n
var $async$bC=A.aw(function(d,e){if(d===1)return A.as(e,r)
for(;;)switch(s){case 0:if(!p.b.hA(a,b,c)){q=new Uint8Array(0)
s=1
break}o=p.ht(a,b,c)
s=3
return A.W(p.bp(a,b,c),$async$bC)
case 3:n=e
if(o!=null&&n!=null&&!B.j.gA(n))A.pa(o,n).b7(new A.kR(),new A.kS(),t.o)
q=n
s=1
break
case 1:return A.at(q,r)}})
return A.au($async$bC,r)},
bp(a,b,c){var s=0,r=A.av(t.nh),q,p=this,o,n,m,l,k
var $async$bp=A.aw(function(d,e){if(d===1)return A.as(e,r)
for(;;)switch(s){case 0:k=p.r
if(k!=null){q=k.aq(a,b,c)
s=1
break}o=p.b.c?B.b.ae(1,a)-1-c:c
s=3
return A.W(A.nG(p.d,p.a,a,b,o,p.f),$async$bp)
case 3:n=e
m=n.a
l=n.b
o=l.a
if(o===204){q=new Uint8Array(0)
s=1
break}if(o===404){q=null
s=1
break}if(o!==200)throw A.e(A.pJ(o,m))
q=l.b
s=1
break
case 1:return A.at(q,r)}})
return A.au($async$bp,r)}}
A.kR.prototype={
$1(a){},
$S:102}
A.kS.prototype={
$1(a){},
$S:17}
A.b8.prototype={
b0(a,b){var s,r,q,p=this,o=p.b+2
if(o>p.a.length)p.bi(o)
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
an(a,b,c,d){var s,r,q,p=this,o=p.b+4
if(o>p.a.length)p.bi(o)
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
bi(a){var s,r=this.a,q=r.length*2
while(q<a)q*=2
s=new Float64Array(q)
B.o.Z(s,0,this.b,r)
this.a=s},
gl(a){return this.b}}
A.jk.prototype={
k(a,b){var s=this,r=s.b,q=s.a,p=q.length
if(r===p){p=new Uint32Array(p*2)
B.P.Z(p,0,r,q)
s.a=p
r=p}else r=q
q=s.b++
r.$flags&2&&A.w(r)
if(!(q<r.length))return A.a(r,q)
r[q]=b},
gl(a){return this.b}}
A.o5.prototype={
$2(a,b){t.a2.a(b)},
$S:103}
A.o4.prototype={
$1(a){return this.a.$1(t.ec.a(a).b9())},
$S:104}
A.o6.prototype={
$1(a){t.a.a(a)
this.a.shE(a)
return a},
$S:105}
A.oc.prototype={
$1(a){var s=this.a
return A.pD(a,s.f,s.r,s.cj(""))},
$S:106}
A.o7.prototype={
$0(){var s=0,r=A.av(t.my),q,p=2,o=[],n=this,m,l,k,j
var $async$$0=A.aw(function(a,b){if(a===1){o.push(b)
s=p}for(;;)switch(s){case 0:k=n.a
if(typeof k!="string"){q=n.b.$1(k)
s=1
break}p=4
s=7
return A.W(n.c.ba(k,n.d.e.c),$async$$0)
case 7:m=b
k=n.b.$1(B.e.dN(B.w.dM(m.b),null))
q=k
s=1
break
p=2
s=6
break
case 4:p=3
j=o.pop()
k=A.pD(null,null,!1,null)
q=k
s=1
break
s=6
break
case 3:s=2
break
case 6:case 1:return A.at(q,r)
case 2:return A.as(o.at(-1),r)}})
return A.au($async$$0,r)},
$S:107}
A.o8.prototype={
$1(a){var s=0,r=A.av(t.p),q,p=this,o,n,m,l,k,j,i
var $async$$1=A.aw(function(b,c){if(b===1)return A.as(c,r)
for(;;)switch(s){case 0:n=a.a
m=a.b
l=a.c
k=(n*4194304+m)*4194304+l
j=p.b
i=j.ap(0,k)
if(i!=null){j.m(0,k,i)
q=i
s=1
break}s=3
return A.W(p.a.a.bC(n,m,l),$async$$1)
case 3:o=c
if(o==null)o=new Uint8Array(0)
j.m(0,k,o)
if(j.a>24)j.ap(0,new A.am(j,A.r(j).i("am<1>")).gv(0))
q=o
s=1
break
case 1:return A.at(q,r)}})
return A.au($async$$1,r)},
$S:108}
A.o9.prototype={
$1(a){var s=0,r=A.av(t.mm),q,p=this,o,n
var $async$$1=A.aw(function(b,c){if(b===1)return A.as(c,r)
for(;;)switch(s){case 0:n=p.a.b
s=n!=null?3:4
break
case 3:s=5
return A.W(n,$async$$1)
case 5:q=c.aq(a.a,a.b,a.c)
s=1
break
case 4:s=6
return A.W(p.b.$1(a),$async$$1)
case 6:o=c
if(o.length===0)n=B.a7
else{n=A.ud(o).a
n=new A.aY(n,A.r(n).i("aY<2>"))}q=n
s=1
break
case 1:return A.at(q,r)}})
return A.au($async$$1,r)},
$S:109}
A.oa.prototype={
$1(b3){var s=0,r=A.av(t.ec),q,p=2,o=[],n=this,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2
var $async$$1=A.aw(function(b4,b5){if(b4===1){o.push(b5)
s=p}for(;;)switch(s){case 0:a7={}
a8=null
a7.a=a7.b=null
a=b3 instanceof A.dV
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
return A.W(n.b.$1(a0),$async$$1)
case 9:l=b5
b=a0.a
a=a0.b
a0=a0.c
a2=Date.now()
a3=m
if(typeof a3!=="number"){q=A.ag(a3)
s=1
break}a4=t.z
A.qk("vmap.tile.fetched",A.eh(["id",""+b+"/"+a+"/"+a0,"ms",""+B.c.O(a2-a3,1000)],a4,a4))
k=Date.now()
a3=n.c
j=new A.ob(a7,n.a,a3,l)
b=n.d
s=b!=null?10:11
break
case 10:s=12
return A.W(b,$async$$1)
case 12:case 11:i=J.dP(l)?new A.cZ(null,B.a6,B.cp,B.cq):j.$0()
s=J.og(l)&&a3.r&&n.e!=null?13:14
break
case 13:h=0
b=t.o
a=n.e
case 15:a0=h
if(typeof a0!=="number"){q=a0.ec()
s=1
break}if(!(a0<300&&a.w.a-a.x.a>0)){s=16
break}s=17
return A.W(A.tA(B.ay,b),$async$$1)
case 17:a0=h
if(typeof a0!=="number"){q=a0.bF()
s=1
break}h=a0+1
s=15
break
case 16:i=j.$0()
case 14:b=a7.b
a=Date.now()
a0=k
if(typeof a0!=="number"){q=A.ag(a0)
s=1
break}A.qk("vmap.tile.built",A.eh(["id",""+b.a+"/"+b.b+"/"+b.c,"ms",""+B.c.O(a-a0,1000)],a4,a4))
a4=a8
a0=i
q=new A.hv(a0,a4)
s=1
break
p=2
s=8
break
case 6:p=5
a9=o.pop()
g=A.bk(a9)
b=a8
a=A.t(g)
q=new A.hy(a,b)
s=1
break
s=8
break
case 5:s=2
break
case 8:case 4:f=null
a=b3 instanceof A.e6
if(a)f=b3
s=a?18:19
break
case 18:p=21
b=f.a
b2=A
s=24
return A.W(n.b.$1(f.b),$async$$1)
case 24:a=b2.xu(b5,n.f,n.r,f.c,f.d,f.e,f.f,f.r)
q=new A.e5(a,b)
s=1
break
p=2
s=23
break
case 21:p=20
b0=o.pop()
b=f.a
q=new A.e5(B.cy,b)
s=1
break
s=23
break
case 20:s=2
break
case 23:case 19:e=null
a=b3 instanceof A.dS
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
return A.W(a,$async$$1)
case 34:b5=b5.r
case 32:c=b5
b=null
switch(e.b.a){case 0:a=e.a
a0=c
if(a0==null)a0=null
else{a2=A.E(d)
a6=a0.f.h(0,a2)
a0=a6==null?null:a6.f+1}b=new A.dY(a0,a)
break
case 1:a=e.a
a0=c
b=new A.d1(A.qW(a0==null?null:a0.dH(d)),a)
break
case 2:a=e.a
a0=c
b=new A.d1(A.qW(a0==null?null:a0.hM(d,e.d,e.e)),a)
break}b=b
q=b
s=1
break
p=2
s=30
break
case 28:p=27
b1=o.pop()
b=e.b===B.Y?new A.dY(null,e.a):new A.d1(B.cA,e.a)
q=b
s=1
break
s=30
break
case 27:s=2
break
case 30:case 26:case 1:return A.at(q,r)
case 2:return A.as(o.at(-1),r)}})
return A.au($async$$1,r)},
$S:110}
A.ob.prototype={
$0(){var s,r=this,q=r.a,p=q.b
p=r.c.hg(r.d,p.a,q.a,p.b,p.c)
q=q.b
s=r.b.b==null?1024:16777216
p.hK(q.a,q.b,q.c,s)
return p},
$S:111}
A.o0.prototype={
$1(a){var s,r,q,p=null,o=A.aQ(a).data,n=o==null?p:A.oN(t.dM.a(o))
o=this.a
s=o.a
if(s!=null){o=A.r(s)
o.c.a(n)
r=s.b
if(r>=4)A.n(s.eG())
if((r&1)!==0)s.bZ(n)
else if((r&3)===0)s.eY().k(0,new A.cJ(n,o.i("cJ<1>")))
return p}r=t.cI
q=new A.du(p,p,p,p,r)
o.a=q
o=this.b
o.postMessage(null)
n.toString
A.ii(n,new A.o_(o),new A.dy(q,r.i("dy<1>")))},
$S:112}
A.o_.prototype={
$1(a){var s=A.b([],t.kG),r=A.oP(a,s)
this.a.postMessage(r,s)},
$S:10};(function aliases(){var s=J.bV.prototype
s.eg=s.q
s=A.y.prototype
s.cH=s.a5})();(function installTearOffs(){var s=hunkHelpers._static_2,r=hunkHelpers._instance_1i,q=hunkHelpers._static_1,p=hunkHelpers._static_0,o=hunkHelpers._instance_2u,n=hunkHelpers._instance_0u,m=hunkHelpers._instance_1u
s(J,"w2","u1",113)
r(A.aW.prototype,"gdL","u",19)
r(A.bR.prototype,"gdL","u",19)
q(A,"wI","v0",22)
q(A,"wJ","v1",22)
q(A,"wK","v2",22)
p(A,"r3","wA",0)
s(A,"wL","wo",21)
o(A.K.prototype,"geN","eO",21)
var l
n(l=A.cI.prototype,"gd7","bl",0)
n(l,"gd8","bm",0)
n(l=A.dv.prototype,"gd7","bl",0)
n(l,"gd8","bm",0)
m(l=A.cR.prototype,"gfl","fm",10)
o(l,"gfp","fq",21)
n(l,"gfn","fo",0)
q(A,"wS","vQ",26)
q(A,"wY","tB",115)
q(A,"wZ","tC",116)
q(A,"x4","tM",117)
s(A,"nH","wk",8)
q(A,"x5","tR",118)
o(A.cn.prototype,"gfB","fC",59)
s(A,"ra","ws",25)
s(A,"r9","wr",25)
s(A,"nI","wn",3)
q(A,"wX","b5",120)
m(A.bs.prototype,"gf4","cZ",10)
q(A,"p3","jF",121)
m(A.ha.prototype,"gde","bY",10)
m(l=A.ho.prototype,"gez","eA",13)
m(l,"ger","es",13)
m(l,"gen","eo",13)
m(l,"geu","ev",13)
m(l,"gep","eq",13)
q(A,"xq","xB",6)
q(A,"xp","xy",6)
q(A,"xn","r6",6)
q(A,"xr","xF",6)
q(A,"xk","wG",6)
q(A,"xl","wH",6)
q(A,"xm","wM",6)
q(A,"xo","xg",6)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.o,null)
q(A.o,[A.oo,J.fS,A.ex,J.aT,A.f,A.dX,A.O,A.bM,A.V,A.y,A.k0,A.X,A.ej,A.eJ,A.eC,A.e2,A.cH,A.bt,A.a_,A.bD,A.bg,A.d4,A.bH,A.bx,A.kU,A.jD,A.e3,A.eZ,A.jv,A.eg,A.cu,A.ct,A.ed,A.i4,A.eK,A.eE,A.i9,A.lC,A.b_,A.hW,A.ic,A.lz,A.hG,A.f2,A.ah,A.kT,A.hM,A.b1,A.K,A.hH,A.dp,A.f_,A.hI,A.dv,A.eO,A.b2,A.cR,A.f9,A.i3,A.cP,A.eS,A.d3,A.fA,A.lq,A.lF,A.id,A.b9,A.hP,A.h8,A.eD,A.l6,A.e7,A.a8,A.ab,A.ia,A.dn,A.be,A.jC,A.bI,A.bZ,A.hs,A.k1,A.iJ,A.bo,A.hS,A.hU,A.hV,A.hT,A.l7,A.fO,A.ji,A.dT,A.ip,A.ds,A.dj,A.da,A.i6,A.i_,A.iP,A.fT,A.bL,A.fD,A.cW,A.bp,A.db,A.cm,A.h_,A.jd,A.aD,A.eT,A.eL,A.hX,A.cn,A.hh,A.e8,A.ay,A.cN,A.bF,A.dB,A.aH,A.jr,A.hl,A.ez,A.aA,A.bT,A.j6,A.jB,A.hi,A.hj,A.hd,A.hc,A.hk,A.bG,A.k4,A.bl,A.dU,A.lv,A.hZ,A.ey,A.m,A.ax,A.iq,A.iI,A.ib,A.aU,A.jL,A.ad,A.A,A.fo,A.fK,A.br,A.ck,A.bs,A.hR,A.i2,A.dw,A.j8,A.k3,A.bv,A.i5,A.jb,A.je,A.jy,A.em,A.el,A.fM,A.c8,A.ha,A.cB,A.jj,A.er,A.iW,A.jI,A.hY,A.eQ,A.l0,A.c6,A.aC,A.fu,A.hx,A.bc,A.e_,A.kP,A.ls,A.f8,A.ho,A.iS,A.iV,A.e4,A.cc,A.bb,A.jh,A.ku,A.hr,A.kL,A.dt,A.fn,A.c3,A.ox,A.hq,A.ks,A.kt,A.ek,A.l5,A.iX,A.ju,A.cY,A.bm,A.cZ,A.aI,A.kx,A.dk,A.bf,A.kQ,A.b8,A.jk])
q(J.fS,[J.ea,J.ec,J.ee,J.dd,J.de,J.dc,J.bU])
q(J.ee,[J.bV,J.k,A.bW,A.eo])
q(J.bV,[J.hb,J.cF,J.bu])
r(J.fU,A.ex)
r(J.jn,J.k)
q(J.dc,[J.eb,J.fV])
q(A.f,[A.c7,A.x,A.cv,A.cG,A.by,A.bE,A.cp,A.cM,A.hF,A.i8,A.dC,A.c_])
q(A.c7,[A.ce,A.fa])
r(A.eP,A.ce)
r(A.eN,A.fa)
r(A.bn,A.eN)
q(A.O,[A.cf,A.aX,A.i0])
q(A.bM,[A.ft,A.ir,A.fs,A.ht,A.nK,A.nM,A.l2,A.l1,A.lI,A.lh,A.lk,A.k7,A.jw,A.lo,A.nW,A.nX,A.j1,A.j2,A.jm,A.iw,A.js,A.ml,A.iD,A.k6,A.j7,A.k2,A.jN,A.jV,A.jU,A.jS,A.jT,A.jW,A.jX,A.jZ,A.lP,A.lR,A.nA,A.nB,A.ny,A.nz,A.lV,A.lW,A.lX,A.lY,A.lZ,A.m_,A.m0,A.m1,A.m2,A.mn,A.nj,A.nk,A.mo,A.mp,A.mq,A.mB,A.mM,A.mX,A.n7,A.ne,A.nf,A.ng,A.nh,A.mr,A.ms,A.mt,A.mu,A.mv,A.mw,A.mx,A.my,A.mz,A.mA,A.mC,A.mD,A.mE,A.mF,A.mG,A.mH,A.mI,A.mJ,A.mK,A.mL,A.mN,A.mO,A.mP,A.mQ,A.mR,A.mS,A.mT,A.mU,A.mV,A.mW,A.mY,A.mZ,A.n_,A.n0,A.n1,A.n2,A.n3,A.n4,A.n5,A.n6,A.n8,A.n9,A.na,A.nb,A.nc,A.nd,A.m4,A.lN,A.m8,A.m9,A.ma,A.mb,A.mc,A.md,A.m7,A.me,A.mf,A.lQ,A.iU,A.j_,A.nP,A.nO,A.jf,A.jH,A.jG,A.mj,A.jK,A.kZ,A.nq,A.nr,A.nZ,A.o1,A.kd,A.kc,A.kb,A.kn,A.km,A.kp,A.kk,A.kf,A.kh,A.ki,A.kv,A.kM,A.kN,A.kO,A.kr,A.kD,A.kF,A.kz,A.nT,A.nw,A.lL,A.lM,A.lK,A.kR,A.kS,A.o4,A.o6,A.oc,A.o8,A.o9,A.oa,A.o0,A.o_])
q(A.ft,[A.is,A.jo,A.nL,A.lJ,A.nt,A.li,A.ll,A.jx,A.lr,A.iQ,A.iK,A.iL,A.lT,A.it,A.iu,A.iv,A.jt,A.iM,A.iN,A.iO,A.iy,A.ix,A.iz,A.iB,A.iA,A.iC,A.iE,A.iF,A.iG,A.jP,A.jQ,A.k5,A.lm,A.jM,A.jY,A.m3,A.ni,A.j3,A.j5,A.lO,A.m6,A.jz,A.nY,A.ns,A.kj,A.kH,A.kJ,A.kG,A.kA,A.kB,A.o5])
q(A.V,[A.df,A.bB,A.fW,A.hD,A.hg,A.hQ,A.ef,A.fl,A.aS,A.eI,A.hC,A.c1,A.fw])
r(A.dr,A.y)
r(A.d2,A.dr)
q(A.fs,[A.nU,A.l3,A.l4,A.lA,A.j0,A.l8,A.ld,A.lc,A.la,A.l9,A.lg,A.lf,A.le,A.lj,A.k8,A.ly,A.lx,A.lt,A.lw,A.no,A.lE,A.lD,A.nl,A.m5,A.nv,A.nu,A.iH,A.jR,A.mi,A.np,A.k_,A.mm,A.iT,A.j4,A.ja,A.j9,A.nQ,A.jc,A.jA,A.jJ,A.l_,A.ko,A.ka,A.ke,A.kI,A.kK,A.kE,A.ky,A.kC,A.nx,A.o7,A.ob])
q(A.x,[A.a0,A.e1,A.am,A.aY,A.cs,A.eR])
q(A.a0,[A.bz,A.an,A.bd,A.i1])
r(A.ci,A.cv)
r(A.d9,A.by)
r(A.d8,A.cp)
q(A.bg,[A.dz,A.dA])
r(A.z,A.dz)
r(A.b3,A.dA)
q(A.d4,[A.al,A.bQ])
q(A.bx,[A.d5,A.eY])
q(A.d5,[A.aW,A.bR])
r(A.es,A.bB)
q(A.ht,[A.hm,A.cX])
r(A.cq,A.aX)
r(A.dl,A.bW)
q(A.eo,[A.en,A.ao])
q(A.ao,[A.eU,A.eW])
r(A.eV,A.eU)
r(A.bX,A.eV)
r(A.eX,A.eW)
r(A.aG,A.eX)
q(A.bX,[A.cw,A.cx])
q(A.aG,[A.h5,A.cy,A.h6,A.cA,A.ep,A.eq,A.bY])
r(A.f3,A.hQ)
r(A.eM,A.hM)
r(A.du,A.f_)
r(A.f1,A.dp)
r(A.dy,A.f1)
r(A.cI,A.dv)
r(A.cJ,A.eO)
r(A.i7,A.f9)
r(A.cO,A.eY)
q(A.d3,[A.fI,A.fX])
r(A.fY,A.ef)
q(A.fA,[A.jq,A.jp,A.kY,A.kX])
r(A.lp,A.lq)
r(A.hE,A.fI)
q(A.aS,[A.ev,A.fR])
q(A.hP,[A.c4,A.eF,A.h7,A.bN,A.cd,A.d7,A.cr,A.dg,A.aO])
q(A.bL,[A.hJ,A.hK,A.hL])
q(A.bp,[A.hN,A.hO])
q(A.aD,[A.eA,A.et,A.fB,A.h0,A.h1,A.h2,A.d6,A.d_])
q(A.ay,[A.eB,A.h4,A.fk,A.fZ,A.fx,A.fy,A.fz,A.fp,A.fq,A.fr,A.hf])
q(A.ez,[A.dQ,A.fC])
q(A.c6,[A.dV,A.e6,A.dS])
q(A.aC,[A.hz,A.e5,A.dY,A.d1])
q(A.hz,[A.hv,A.hy])
q(A.bc,[A.fQ,A.hA])
q(A.hA,[A.h9,A.fP,A.fv,A.hu])
q(A.bb,[A.h3,A.co])
q(A.h3,[A.ba,A.dh,A.d0])
q(A.dt,[A.bS,A.eH])
s(A.dr,A.bD)
s(A.fa,A.y)
s(A.eU,A.y)
s(A.eV,A.a_)
s(A.eW,A.y)
s(A.eX,A.a_)
s(A.du,A.hI)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{c:"int",d:"double",aq:"num",p:"String",B:"bool",ab:"Null",j:"List",o:"Object",R:"Map",N:"JSObject"},mangledNames:{},types:["~()","B(A)","o?(A)","B(c,c)","d(d)","p(A)","d(aq)","c()","B(aA,c)","d?(A)","~(o?)","d(A)","B(@)","~(f8)","c(c)","B(d,d)","d(c)","ab(@)","c(d)","B(o?)","~(@)","~(o,b0)","~(~())","ad?(A)","~(o?,o?)","bF(m,c)","@(@)","@(p)","bL(c)","c(aA)","ab()","c(A)","d(d,d)","@()","ab(o,b0)","~(c,c,c)","~(c)","j<bp>()","p(p)","c(bo,bo)","ad?()","a7<~>()","B(p)","d(c,d)","ds(c)","o(A)","dj(c)","@(@,p)","o?(A,o?)","o?(A)(c)","j<o?(A)>()","o?(A)(d(d))","ab(@,b0)","R<p,o?>(A)","~(c,@)","j<d>?(A)","c(o?,c)","ab(~())","j<p>(A)","B(e8,c)","ck(A)","c?(A)","@(A)","d(d,d,d)","cN(c)","~(d,d,d,d,d,d,d,d)","p(br)","B(br)","~(d,d)","N?()","c?(c)","j<c>()","bZ()","N()","d(d,+(j<d>,d))","p(c)","~(d)","~(j<d>)","a7<cB>()","~(p,p)","B(N)","c(bI,bI)","c5()","B(d,d,d,d,d,d,d,d)","d(d,d,d,d,d,d)","c(bG,bG)","c(+(c,c),+(c,c))","c?()","o?(A)?(p)","e9()","B(p,p)","B(bP)","B(+(d,d))","aI(c,cc)","j<d>()","~(d,d,d)","c(aI,aI)","c(c,c)","d()","p(p,bO{end!B})","B(+(d,d,d))","d(d,d,d,d)","ab(~)","~(c,j<bv>)","~(aC)","R<p,+(d,d)>(R<p,+(d,d)>)","bs(o?)","a7<bs>()","a7<c5>(bf)","a7<f<dq>>(bf)","a7<aC>(c6)","cZ()","~(N)","c(@,@)","~(aU)","da(m)","db(m)","cm(m)","cn(m)","c(d,d)","p(o?)","j<d>(o?)","bf()"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"2;":(a,b)=>c=>c instanceof A.z&&a.b(c.a)&&b.b(c.b),"3;":(a,b,c)=>d=>d instanceof A.b3&&a.b(d.a)&&b.b(d.b)&&c.b(d.c)}}
A.vs(v.typeUniverse,JSON.parse('{"bu":"bV","hb":"bV","cF":"bV","xS":"bW","ea":{"B":[],"Q":[]},"ec":{"ab":[],"Q":[]},"ee":{"N":[]},"bV":{"N":[]},"k":{"j":["1"],"x":["1"],"N":[],"f":["1"]},"fU":{"ex":[]},"jn":{"k":["1"],"j":["1"],"x":["1"],"N":[],"f":["1"]},"aT":{"I":["1"]},"dc":{"d":[],"aq":[],"aV":["aq"]},"eb":{"d":[],"c":[],"aq":[],"aV":["aq"],"Q":[]},"fV":{"d":[],"aq":[],"aV":["aq"],"Q":[]},"bU":{"p":[],"aV":["p"],"jE":[],"Q":[]},"c7":{"f":["2"]},"dX":{"I":["2"]},"ce":{"c7":["1","2"],"f":["2"],"f.E":"2"},"eP":{"ce":["1","2"],"c7":["1","2"],"x":["2"],"f":["2"],"f.E":"2"},"eN":{"y":["2"],"j":["2"],"c7":["1","2"],"x":["2"],"f":["2"]},"bn":{"eN":["1","2"],"y":["2"],"j":["2"],"c7":["1","2"],"x":["2"],"f":["2"],"y.E":"2","f.E":"2"},"cf":{"O":["3","4"],"R":["3","4"],"O.K":"3","O.V":"4"},"df":{"V":[]},"d2":{"y":["c"],"bD":["c"],"j":["c"],"x":["c"],"f":["c"],"y.E":"c","bD.E":"c"},"x":{"f":["1"]},"a0":{"x":["1"],"f":["1"]},"bz":{"a0":["1"],"x":["1"],"f":["1"],"f.E":"1","a0.E":"1"},"X":{"I":["1"]},"cv":{"f":["2"],"f.E":"2"},"ci":{"cv":["1","2"],"x":["2"],"f":["2"],"f.E":"2"},"ej":{"I":["2"]},"an":{"a0":["2"],"x":["2"],"f":["2"],"f.E":"2","a0.E":"2"},"cG":{"f":["1"],"f.E":"1"},"eJ":{"I":["1"]},"by":{"f":["1"],"f.E":"1"},"d9":{"by":["1"],"x":["1"],"f":["1"],"f.E":"1"},"eC":{"I":["1"]},"e1":{"x":["1"],"f":["1"],"f.E":"1"},"e2":{"I":["1"]},"bE":{"f":["1"],"f.E":"1"},"cH":{"I":["1"]},"cp":{"f":["+(c,1)"],"f.E":"+(c,1)"},"d8":{"cp":["1"],"x":["+(c,1)"],"f":["+(c,1)"],"f.E":"+(c,1)"},"bt":{"I":["+(c,1)"]},"dr":{"y":["1"],"bD":["1"],"j":["1"],"x":["1"],"f":["1"]},"bd":{"a0":["1"],"x":["1"],"f":["1"],"f.E":"1","a0.E":"1"},"z":{"dz":[],"bg":[]},"b3":{"dA":[],"bg":[]},"d4":{"R":["1","2"]},"al":{"d4":["1","2"],"R":["1","2"]},"cM":{"f":["1"],"f.E":"1"},"bH":{"I":["1"]},"bQ":{"d4":["1","2"],"R":["1","2"]},"d5":{"bx":["1"],"c0":["1"],"x":["1"],"f":["1"]},"aW":{"d5":["1"],"bx":["1"],"c0":["1"],"x":["1"],"f":["1"]},"bR":{"d5":["1"],"bx":["1"],"c0":["1"],"x":["1"],"f":["1"]},"es":{"bB":[],"V":[]},"fW":{"V":[]},"hD":{"V":[]},"eZ":{"b0":[]},"bM":{"cl":[]},"fs":{"cl":[]},"ft":{"cl":[]},"ht":{"cl":[]},"hm":{"cl":[]},"cX":{"cl":[]},"hg":{"V":[]},"aX":{"O":["1","2"],"oq":["1","2"],"R":["1","2"],"O.K":"1","O.V":"2"},"am":{"x":["1"],"f":["1"],"f.E":"1"},"eg":{"I":["1"]},"aY":{"x":["1"],"f":["1"],"f.E":"1"},"cu":{"I":["1"]},"cs":{"x":["a8<1,2>"],"f":["a8<1,2>"],"f.E":"a8<1,2>"},"ct":{"I":["a8<1,2>"]},"cq":{"aX":["1","2"],"O":["1","2"],"oq":["1","2"],"R":["1","2"],"O.K":"1","O.V":"2"},"dz":{"bg":[]},"dA":{"bg":[]},"ed":{"uw":[],"jE":[]},"i4":{"ew":[],"di":[]},"hF":{"f":["ew"],"f.E":"ew"},"eK":{"I":["ew"]},"eE":{"di":[]},"i8":{"f":["di"],"f.E":"di"},"i9":{"I":["di"]},"dl":{"bW":[],"N":[],"Q":[]},"bY":{"aG":[],"c5":[],"y":["c"],"ao":["c"],"j":["c"],"aF":["c"],"x":["c"],"N":[],"f":["c"],"a_":["c"],"Q":[],"y.E":"c","a_.E":"c"},"bW":{"N":[],"Q":[]},"eo":{"N":[]},"en":{"pv":[],"N":[],"Q":[]},"ao":{"aF":["1"],"N":[]},"bX":{"y":["d"],"ao":["d"],"j":["d"],"aF":["d"],"x":["d"],"N":[],"f":["d"],"a_":["d"]},"aG":{"y":["c"],"ao":["c"],"j":["c"],"aF":["c"],"x":["c"],"N":[],"f":["c"],"a_":["c"]},"cw":{"bX":[],"bO":[],"y":["d"],"ao":["d"],"j":["d"],"aF":["d"],"x":["d"],"N":[],"f":["d"],"a_":["d"],"Q":[],"y.E":"d","a_.E":"d"},"cx":{"bX":[],"bP":[],"y":["d"],"ao":["d"],"j":["d"],"aF":["d"],"x":["d"],"N":[],"f":["d"],"a_":["d"],"Q":[],"y.E":"d","a_.E":"d"},"h5":{"aG":[],"ok":[],"y":["c"],"ao":["c"],"j":["c"],"aF":["c"],"x":["c"],"N":[],"f":["c"],"a_":["c"],"Q":[],"y.E":"c","a_.E":"c"},"cy":{"aG":[],"e9":[],"y":["c"],"ao":["c"],"j":["c"],"aF":["c"],"x":["c"],"N":[],"f":["c"],"a_":["c"],"Q":[],"y.E":"c","a_.E":"c"},"h6":{"aG":[],"y":["c"],"ao":["c"],"j":["c"],"aF":["c"],"x":["c"],"N":[],"f":["c"],"a_":["c"],"Q":[],"y.E":"c","a_.E":"c"},"cA":{"aG":[],"kW":[],"y":["c"],"ao":["c"],"j":["c"],"aF":["c"],"x":["c"],"N":[],"f":["c"],"a_":["c"],"Q":[],"y.E":"c","a_.E":"c"},"ep":{"aG":[],"oA":[],"y":["c"],"ao":["c"],"j":["c"],"aF":["c"],"x":["c"],"N":[],"f":["c"],"a_":["c"],"Q":[],"y.E":"c","a_.E":"c"},"eq":{"aG":[],"y":["c"],"ao":["c"],"j":["c"],"aF":["c"],"x":["c"],"N":[],"f":["c"],"a_":["c"],"Q":[],"y.E":"c","a_.E":"c"},"hQ":{"V":[]},"f3":{"bB":[],"V":[]},"f2":{"I":["1"]},"dC":{"f":["1"],"f.E":"1"},"ah":{"V":[]},"eM":{"hM":["1"]},"K":{"a7":["1"]},"f_":{"qA":["1"],"cK":["1"]},"du":{"hI":["1"],"f_":["1"],"qA":["1"],"cK":["1"]},"dy":{"f1":["1"],"dp":["1"]},"cI":{"dv":["1"],"hn":["1"],"cK":["1"]},"dv":{"hn":["1"],"cK":["1"]},"f1":{"dp":["1"]},"cJ":{"eO":["1"]},"f9":{"qp":[]},"i7":{"f9":[],"qp":[]},"cO":{"bx":["1"],"c0":["1"],"x":["1"],"f":["1"]},"cP":{"I":["1"]},"y":{"j":["1"],"x":["1"],"f":["1"]},"O":{"R":["1","2"]},"eR":{"x":["2"],"f":["2"],"f.E":"2"},"eS":{"I":["2"]},"bx":{"c0":["1"],"x":["1"],"f":["1"]},"eY":{"bx":["1"],"c0":["1"],"x":["1"],"f":["1"]},"i0":{"O":["p","@"],"R":["p","@"],"O.K":"p","O.V":"@"},"i1":{"a0":["p"],"x":["p"],"f":["p"],"f.E":"p","a0.E":"p"},"fI":{"d3":["p","j<c>"]},"ef":{"V":[]},"fY":{"V":[]},"fX":{"d3":["o?","p"]},"hE":{"d3":["p","j<c>"]},"d":{"aq":[],"aV":["aq"]},"b9":{"aV":["b9"]},"c":{"aq":[],"aV":["aq"]},"j":{"x":["1"],"f":["1"]},"aq":{"aV":["aq"]},"ew":{"di":[]},"c0":{"x":["1"],"f":["1"]},"p":{"aV":["p"],"jE":[]},"hP":{"bq":[]},"fl":{"V":[]},"bB":{"V":[]},"aS":{"V":[]},"ev":{"V":[]},"fR":{"V":[]},"eI":{"V":[]},"hC":{"V":[]},"c1":{"V":[]},"fw":{"V":[]},"h8":{"V":[]},"eD":{"V":[]},"ia":{"b0":[]},"c_":{"f":["c"],"f.E":"c"},"dn":{"I":["c"]},"be":{"uJ":[]},"c4":{"bq":[]},"hS":{"dx":[]},"hU":{"dx":[]},"hV":{"dx":[]},"hT":{"dx":[]},"hJ":{"bL":[]},"hK":{"bL":[]},"hL":{"bL":[]},"hN":{"bp":[]},"hO":{"bp":[]},"cm":{"tK":[]},"eA":{"aD":[]},"et":{"aD":[]},"fB":{"aD":[]},"h0":{"aD":[]},"h1":{"aD":[]},"h2":{"aD":[]},"d6":{"aD":[]},"d_":{"aD":[]},"eB":{"ay":[]},"h4":{"ay":[]},"fk":{"ay":[]},"fZ":{"ay":[]},"fx":{"ay":[]},"fy":{"ay":[]},"fz":{"ay":[]},"fp":{"ay":[]},"fq":{"ay":[]},"fr":{"ay":[]},"hf":{"ay":[]},"dQ":{"ez":[]},"fC":{"ez":[]},"eF":{"bq":[]},"h7":{"bq":[]},"i2":{"dq":[]},"dw":{"hw":[]},"em":{"dq":[]},"el":{"hw":[]},"bN":{"bq":[]},"dV":{"c6":[]},"e6":{"c6":[]},"dS":{"c6":[]},"hz":{"aC":[]},"hv":{"aC":[]},"hy":{"aC":[]},"e5":{"aC":[]},"dY":{"aC":[]},"d1":{"aC":[]},"fQ":{"bc":[]},"hA":{"bc":[]},"h9":{"bc":[]},"fP":{"bc":[]},"fv":{"bc":[]},"hu":{"bc":[]},"cd":{"bq":[]},"d7":{"bq":[]},"h3":{"bb":[]},"ba":{"bb":[]},"dh":{"bb":[]},"d0":{"bb":[]},"co":{"bb":[]},"bS":{"dt":[]},"eH":{"dt":[]},"aO":{"bq":[]},"cr":{"bq":[]},"dg":{"bq":[]},"tV":{"j":["c"],"x":["c"],"f":["c"]},"c5":{"j":["c"],"x":["c"],"f":["c"]},"uY":{"j":["c"],"x":["c"],"f":["c"]},"ok":{"j":["c"],"x":["c"],"f":["c"]},"kW":{"j":["c"],"x":["c"],"f":["c"]},"e9":{"j":["c"],"x":["c"],"f":["c"]},"oA":{"j":["c"],"x":["c"],"f":["c"]},"bO":{"j":["d"],"x":["d"],"f":["d"]},"bP":{"j":["d"],"x":["d"],"f":["d"]}}'))
A.vr(v.typeUniverse,JSON.parse('{"dr":1,"fa":2,"ao":1,"eO":1,"eY":1,"fA":2}'))
var u={c:"Error handler must accept one Object or one Object and a StackTrace as arguments, and return a value of the returned future's type"}
var t=(function rtii(){var s=A.af
return{bm:s("@<~>"),v:s("ah"),c5:s("dT"),kb:s("bl"),bb:s("m"),el:s("aU"),j8:s("bN"),aq:s("bo"),gS:s("d2"),bP:s("aV<@>"),R:s("aW<p>"),c:s("bp"),jS:s("b9"),U:s("x<@>"),C:s("V"),X:s("A"),lc:s("fK"),nY:s("e4"),if:s("ba"),pk:s("bO"),kI:s("bP"),oc:s("br"),Z:s("cl"),kH:s("da"),lP:s("db"),nD:s("bQ<c,j<c>>"),Y:s("bR<c>"),my:s("bs"),h:s("aA"),lr:s("bT"),fA:s("cm"),b0:s("cn"),bW:s("e9"),mm:s("f<dq>"),id:s("f<d>"),e7:s("f<@>"),fm:s("f<c>"),jQ:s("k<fn>"),J:s("k<bl>"),o_:s("k<cc>"),dY:s("k<fo>"),e:s("k<bm>"),D:s("k<cY>"),i9:s("k<fu>"),r:s("k<aU>"),ig:s("k<bo>"),lW:s("k<e4>"),E:s("k<bO>"),w:s("k<bP>"),eJ:s("k<br>"),Q:s("k<aA>"),q:s("k<bT>"),fT:s("k<aD>"),fL:s("k<ay>"),kG:s("k<N>"),iQ:s("k<j<dT>>"),ot:s("k<j<j<d>>>"),bo:s("k<j<o>>"),b:s("k<j<d>>"),fC:s("k<j<c>>"),dO:s("k<j<o?>>"),iE:s("k<R<c,bv>>"),nb:s("k<R<c,c>>"),bw:s("k<ek>"),ef:s("k<el>"),gw:s("k<dk>"),aA:s("k<bY>"),G:s("k<o>"),oJ:s("k<bZ>"),o9:s("k<bb>"),ez:s("k<bv>"),lE:s("k<hc>"),gX:s("k<hd>"),kv:s("k<bc>"),k_:s("k<+(j<d>,d)>"),m_:s("k<+(p,p)>"),bU:s("k<+(d,bP)>"),I:s("k<+(d,d)>"),n_:s("k<+(c,c3)>"),ho:s("k<+(c,c)>"),cm:s("k<+(c,R<p,o?>?)>"),lN:s("k<+(o?,o?)>"),c3:s("k<+(j<hw>,j<c>,j<c>)>"),eL:s("k<+(d,d,d)>"),iv:s("k<+(c,c,j<c>)>"),hc:s("k<+(o?(A),R<p,o?(A)>,B)>"),m1:s("k<ey>"),kR:s("k<hl>"),s:s("k<p>"),in:s("k<c3>"),oW:s("k<hr>"),fB:s("k<hw>"),cb:s("k<hx>"),n5:s("k<dq>"),jA:s("k<dt>"),mE:s("k<eQ>"),ha:s("k<hR>"),la:s("k<bG>"),fw:s("k<aI>"),bD:s("k<hZ>"),mc:s("k<i_>"),eB:s("k<bI>"),fb:s("k<i6>"),d2:s("k<ib>"),df:s("k<B>"),n:s("k<d>"),dG:s("k<@>"),t:s("k<c>"),dM:s("k<o?>"),k9:s("k<+(dk,j<bO>)?>"),nn:s("k<d?>"),g2:s("k<aq>"),V:s("k<o?(A)>"),T:s("ec"),m:s("N"),et:s("bu"),dX:s("aF<@>"),dn:s("dh"),kV:s("j<bl>"),lL:s("j<bm>"),ke:s("j<cY>"),kp:s("j<aU>"),iu:s("j<bO>"),lt:s("j<bP>"),kT:s("j<tz>"),n7:s("j<aA>"),gz:s("j<j<aU>>"),jj:s("j<j<d>>"),aB:s("j<dk>"),a2:s("j<bv>"),bF:s("j<p>"),ia:s("j<c3>"),je:s("j<eQ>"),H:s("j<d>"),j:s("j<@>"),L:s("j<c>"),W:s("j<o?>"),ih:s("h_"),pp:s("R<p,p>"),eM:s("R<p,d>"),f:s("R<@,@>"),mV:s("R<c,c>"),a:s("R<p,+(d,d)>"),lb:s("R<p,o?>"),d:s("R<o?,o?>"),gQ:s("an<p,p>"),dl:s("em"),h7:s("dj"),eb:s("dl"),bi:s("cw"),g_:s("cx"),da:s("cy"),dQ:s("bX"),aj:s("aG"),nZ:s("cA"),hD:s("bY"),P:s("ab"),K:s("o"),kJ:s("bZ"),kY:s("bb"),jv:s("bv"),lZ:s("xT"),aK:s("+()"),hT:s("+(j<d>,d)"),l_:s("+(p,cB)"),aL:s("+(d,d)"),gn:s("+(c,c)"),x:s("+(o?,o?)"),lo:s("+(d,d,d)"),lu:s("ew"),mk:s("cB"),bs:s("bd<c>"),mO:s("c_"),nu:s("hh"),gi:s("c0<p>"),nO:s("c0<c>"),gp:s("hj"),gc:s("hk"),l:s("b0"),N:s("p"),gL:s("p(p)"),l1:s("hs"),aJ:s("Q"),do:s("bB"),hM:s("kW"),p:s("c5"),cx:s("cF"),l0:s("ds"),ec:s("aC"),cI:s("du<o?>"),kr:s("bF"),bY:s("bG"),k:s("K<B>"),_:s("K<@>"),hy:s("K<c>"),cU:s("K<~>"),ct:s("aI"),iM:s("hY"),nx:s("cN"),dt:s("bI"),d3:s("f0<o?>"),b6:s("cR<o?>"),y:s("B"),dW:s("B(aA,c)"),iW:s("B(o)"),i:s("d"),f3:s("d(d)"),z:s("@"),mY:s("@()"),A:s("@(o)"),ng:s("@(o,b0)"),S:s("c"),f1:s("bp?"),gK:s("a7<ab>?"),mU:s("N?"),nw:s("j<aU>?"),l7:s("j<aD>?"),B:s("j<bF>?"),d1:s("j<cN>?"),nE:s("j<d>?"),dw:s("j<d>()?"),g:s("j<@>?"),f8:s("j<c>?"),eO:s("R<@,@>?"),h9:s("R<p,o?>?"),O:s("o?"),u:s("o?(A)"),bl:s("p?"),nh:s("c5?"),F:s("b1<@,@>?"),bQ:s("aI?"),hJ:s("hX?"),nF:s("i3?"),fU:s("B?"),mA:s("B(aA,c)?"),jX:s("d?"),aV:s("c?"),jh:s("aq?"),jE:s("~()?"),cZ:s("aq"),o:s("~"),M:s("~()"),i6:s("~(o)"),b9:s("~(o,b0)"),jR:s("~(p,@)"),hi:s("~(d,d,d)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.aO=J.fS.prototype
B.a=J.k.prototype
B.a0=J.ea.prototype
B.b=J.eb.prototype
B.c=J.dc.prototype
B.d=J.bU.prototype
B.aP=J.bu.prototype
B.aQ=J.ee.prototype
B.cW=A.en.prototype
B.n=A.cw.prototype
B.o=A.cx.prototype
B.C=A.cy.prototype
B.O=A.cA.prototype
B.P=A.ep.prototype
B.j=A.bY.prototype
B.ac=J.hb.prototype
B.R=J.cF.prototype
B.u=new A.cd(0,"fill")
B.v=new A.cd(1,"line")
B.q=new A.cd(2,"circle")
B.H=new A.cd(3,"extrusion")
B.V=new A.fC()
B.ai=new A.e2(A.af("e2<0&>"))
B.W=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.aj=function() {
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
B.ao=function(getTagFallback) {
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
B.ak=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.an=function(hooks) {
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
B.am=function(hooks) {
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
B.al=function(hooks) {
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
B.X=function(hooks) { return hooks; }

B.e=new A.fX()
B.ap=new A.h8()
B.I=new A.k0()
B.w=new A.hE()
B.aq=new A.kY()
B.h=new A.hJ()
B.f=new A.i7()
B.x=new A.ia()
B.Y=new A.bN(0,"zoom")
B.Z=new A.d7(0,"butt")
B.at=new A.d7(1,"round")
B.au=new A.d7(2,"square")
B.av=new A.e_(6553.6,25.6,0.1,1e4)
B.aw=new A.e_(256,1,0.00390625,32768)
B.ax=new A.b9(0)
B.ay=new A.b9(1e4)
B.az=new A.b9(2e7)
B.aA=new A.b9(3e7)
B.a_=new A.ax("head is shorter than its 54 bytes")
B.aB=new A.ax("avar segment map overruns the font")
B.aC=new A.ax("DeltaSetIndexMap entries overrun the font")
B.aD=new A.ax("delta set rows overrun the font")
B.aE=new A.ax("fvar axis array overruns the font")
B.aF=new A.ax("cmap is too short to hold a header")
B.aG=new A.ax("fvar instance array overruns the font")
B.aH=new A.ax("cmap has no subtable in a format this parser supports")
B.aI=new A.ax("variation region list overruns the font")
B.aJ=new A.ax("too short to hold an SFNT header")
B.aK=new A.ax("hhea.numberOfHMetrics is 0, leaving every glyph without an advance")
B.aL=new A.ax("cmap has no usable encoding record")
B.aM=new A.e7("Not a PMTiles version 3 archive",null,null)
B.aN=new A.e7("The PMTiles archive is packed with brotli or zstd; only gzip is read",null,null)
B.aR=new A.jp(null)
B.aS=new A.jq(null)
B.l=new A.dg(0,"butt")
B.a1=new A.dg(1,"round")
B.a2=new A.dg(2,"square")
B.aT=new A.cr(0,"round")
B.a3=new A.cr(1,"bevel")
B.y=new A.cr(2,"miter")
B.aU=new A.cr(3,"none")
B.aV=s([32],t.t)
B.ad=new A.z(-1,-1)
B.d6=new A.z(1,-1)
B.d5=new A.z(1,1)
B.d7=new A.z(-1,1)
B.aW=s([B.ad,B.d6,B.d5,B.d7],t.I)
B.ce=s([60,824,8814,61,824,8800,62,824,8815,65,768,192,65,769,193,65,770,194,65,771,195,65,772,256,65,774,258,65,775,550,65,776,196,65,777,7842,65,778,197,65,780,461,65,783,512,65,785,514,65,803,7840,65,805,7680,65,808,260,66,775,7682,66,803,7684,66,817,7686,67,769,262,67,770,264,67,775,266,67,780,268,67,807,199,68,775,7690,68,780,270,68,803,7692,68,807,7696,68,813,7698,68,817,7694,69,768,200,69,769,201,69,770,202,69,771,7868,69,772,274,69,774,276,69,775,278,69,776,203,69,777,7866,69,780,282,69,783,516,69,785,518,69,803,7864,69,807,552,69,808,280,69,813,7704,69,816,7706,70,775,7710,71,769,500,71,770,284,71,772,7712,71,774,286,71,775,288,71,780,486,71,807,290,72,770,292,72,775,7714,72,776,7718,72,780,542,72,803,7716,72,807,7720,72,814,7722,73,768,204,73,769,205,73,770,206,73,771,296,73,772,298,73,774,300,73,775,304,73,776,207,73,777,7880,73,780,463,73,783,520,73,785,522,73,803,7882,73,808,302,73,816,7724,74,770,308,75,769,7728,75,780,488,75,803,7730,75,807,310,75,817,7732,76,769,313,76,780,317,76,803,7734,76,807,315,76,813,7740,76,817,7738,77,769,7742,77,775,7744,77,803,7746,78,768,504,78,769,323,78,771,209,78,775,7748,78,780,327,78,803,7750,78,807,325,78,813,7754,78,817,7752,79,768,210,79,769,211,79,770,212,79,771,213,79,772,332,79,774,334,79,775,558,79,776,214,79,777,7886,79,779,336,79,780,465,79,783,524,79,785,526,79,795,416,79,803,7884,79,808,490,80,769,7764,80,775,7766,82,769,340,82,775,7768,82,780,344,82,783,528,82,785,530,82,803,7770,82,807,342,82,817,7774,83,769,346,83,770,348,83,775,7776,83,780,352,83,803,7778,83,806,536,83,807,350,84,775,7786,84,780,356,84,803,7788,84,806,538,84,807,354,84,813,7792,84,817,7790,85,768,217,85,769,218,85,770,219,85,771,360,85,772,362,85,774,364,85,776,220,85,777,7910,85,778,366,85,779,368,85,780,467,85,783,532,85,785,534,85,795,431,85,803,7908,85,804,7794,85,808,370,85,813,7798,85,816,7796,86,771,7804,86,803,7806,87,768,7808,87,769,7810,87,770,372,87,775,7814,87,776,7812,87,803,7816,88,775,7818,88,776,7820,89,768,7922,89,769,221,89,770,374,89,771,7928,89,772,562,89,775,7822,89,776,376,89,777,7926,89,803,7924,90,769,377,90,770,7824,90,775,379,90,780,381,90,803,7826,90,817,7828,97,768,224,97,769,225,97,770,226,97,771,227,97,772,257,97,774,259,97,775,551,97,776,228,97,777,7843,97,778,229,97,780,462,97,783,513,97,785,515,97,803,7841,97,805,7681,97,808,261,98,775,7683,98,803,7685,98,817,7687,99,769,263,99,770,265,99,775,267,99,780,269,99,807,231,100,775,7691,100,780,271,100,803,7693,100,807,7697,100,813,7699,100,817,7695,101,768,232,101,769,233,101,770,234,101,771,7869,101,772,275,101,774,277,101,775,279,101,776,235,101,777,7867,101,780,283,101,783,517,101,785,519,101,803,7865,101,807,553,101,808,281,101,813,7705,101,816,7707,102,775,7711,103,769,501,103,770,285,103,772,7713,103,774,287,103,775,289,103,780,487,103,807,291,104,770,293,104,775,7715,104,776,7719,104,780,543,104,803,7717,104,807,7721,104,814,7723,104,817,7830,105,768,236,105,769,237,105,770,238,105,771,297,105,772,299,105,774,301,105,776,239,105,777,7881,105,780,464,105,783,521,105,785,523,105,803,7883,105,808,303,105,816,7725,106,770,309,106,780,496,107,769,7729,107,780,489,107,803,7731,107,807,311,107,817,7733,108,769,314,108,780,318,108,803,7735,108,807,316,108,813,7741,108,817,7739,109,769,7743,109,775,7745,109,803,7747,110,768,505,110,769,324,110,771,241,110,775,7749,110,780,328,110,803,7751,110,807,326,110,813,7755,110,817,7753,111,768,242,111,769,243,111,770,244,111,771,245,111,772,333,111,774,335,111,775,559,111,776,246,111,777,7887,111,779,337,111,780,466,111,783,525,111,785,527,111,795,417,111,803,7885,111,808,491,112,769,7765,112,775,7767,114,769,341,114,775,7769,114,780,345,114,783,529,114,785,531,114,803,7771,114,807,343,114,817,7775,115,769,347,115,770,349,115,775,7777,115,780,353,115,803,7779,115,806,537,115,807,351,116,775,7787,116,776,7831,116,780,357,116,803,7789,116,806,539,116,807,355,116,813,7793,116,817,7791,117,768,249,117,769,250,117,770,251,117,771,361,117,772,363,117,774,365,117,776,252,117,777,7911,117,778,367,117,779,369,117,780,468,117,783,533,117,785,535,117,795,432,117,803,7909,117,804,7795,117,808,371,117,813,7799,117,816,7797,118,771,7805,118,803,7807,119,768,7809,119,769,7811,119,770,373,119,775,7815,119,776,7813,119,778,7832,119,803,7817,120,775,7819,120,776,7821,121,768,7923,121,769,253,121,770,375,121,771,7929,121,772,563,121,775,7823,121,776,255,121,777,7927,121,778,7833,121,803,7925,122,769,378,122,770,7825,122,775,380,122,780,382,122,803,7827,122,817,7829,168,768,8173,168,769,901,168,834,8129,194,768,7846,194,769,7844,194,771,7850,194,777,7848,196,772,478,197,769,506,198,769,508,198,772,482,199,769,7688,202,768,7872,202,769,7870,202,771,7876,202,777,7874,207,769,7726,212,768,7890,212,769,7888,212,771,7894,212,777,7892,213,769,7756,213,772,556,213,776,7758,214,772,554,216,769,510,220,768,475,220,769,471,220,772,469,220,780,473,226,768,7847,226,769,7845,226,771,7851,226,777,7849,228,772,479,229,769,507,230,769,509,230,772,483,231,769,7689,234,768,7873,234,769,7871,234,771,7877,234,777,7875,239,769,7727,244,768,7891,244,769,7889,244,771,7895,244,777,7893,245,769,7757,245,772,557,245,776,7759,246,772,555,248,769,511,252,768,476,252,769,472,252,772,470,252,780,474,258,768,7856,258,769,7854,258,771,7860,258,777,7858,259,768,7857,259,769,7855,259,771,7861,259,777,7859,274,768,7700,274,769,7702,275,768,7701,275,769,7703,332,768,7760,332,769,7762,333,768,7761,333,769,7763,346,775,7780,347,775,7781,352,775,7782,353,775,7783,360,769,7800,361,769,7801,362,776,7802,363,776,7803,383,775,7835,416,768,7900,416,769,7898,416,771,7904,416,777,7902,416,803,7906,417,768,7901,417,769,7899,417,771,7905,417,777,7903,417,803,7907,431,768,7914,431,769,7912,431,771,7918,431,777,7916,431,803,7920,432,768,7915,432,769,7913,432,771,7919,432,777,7917,432,803,7921,439,780,494,490,772,492,491,772,493,550,772,480,551,772,481,552,774,7708,553,774,7709,558,772,560,559,772,561,658,780,495,913,768,8122,913,769,902,913,772,8121,913,774,8120,913,787,7944,913,788,7945,913,837,8124,917,768,8136,917,769,904,917,787,7960,917,788,7961,919,768,8138,919,769,905,919,787,7976,919,788,7977,919,837,8140,921,768,8154,921,769,906,921,772,8153,921,774,8152,921,776,938,921,787,7992,921,788,7993,927,768,8184,927,769,908,927,787,8008,927,788,8009,929,788,8172,933,768,8170,933,769,910,933,772,8169,933,774,8168,933,776,939,933,788,8025,937,768,8186,937,769,911,937,787,8040,937,788,8041,937,837,8188,940,837,8116,942,837,8132,945,768,8048,945,769,940,945,772,8113,945,774,8112,945,787,7936,945,788,7937,945,834,8118,945,837,8115,949,768,8050,949,769,941,949,787,7952,949,788,7953,951,768,8052,951,769,942,951,787,7968,951,788,7969,951,834,8134,951,837,8131,953,768,8054,953,769,943,953,772,8145,953,774,8144,953,776,970,953,787,7984,953,788,7985,953,834,8150,959,768,8056,959,769,972,959,787,8000,959,788,8001,961,787,8164,961,788,8165,965,768,8058,965,769,973,965,772,8161,965,774,8160,965,776,971,965,787,8016,965,788,8017,965,834,8166,969,768,8060,969,769,974,969,787,8032,969,788,8033,969,834,8182,969,837,8179,970,768,8146,970,769,912,970,834,8151,971,768,8162,971,769,944,971,834,8167,974,837,8180,978,769,979,978,776,980,1030,776,1031,1040,774,1232,1040,776,1234,1043,769,1027,1045,768,1024,1045,774,1238,1045,776,1025,1046,774,1217,1046,776,1244,1047,776,1246,1048,768,1037,1048,772,1250,1048,774,1049,1048,776,1252,1050,769,1036,1054,776,1254,1059,772,1262,1059,774,1038,1059,776,1264,1059,779,1266,1063,776,1268,1067,776,1272,1069,776,1260,1072,774,1233,1072,776,1235,1075,769,1107,1077,768,1104,1077,774,1239,1077,776,1105,1078,774,1218,1078,776,1245,1079,776,1247,1080,768,1117,1080,772,1251,1080,774,1081,1080,776,1253,1082,769,1116,1086,776,1255,1091,772,1263,1091,774,1118,1091,776,1265,1091,779,1267,1095,776,1269,1099,776,1273,1101,776,1261,1110,776,1111,1140,783,1142,1141,783,1143,1240,776,1242,1241,776,1243,1256,776,1258,1257,776,1259,1575,1619,1570,1575,1620,1571,1575,1621,1573,1608,1620,1572,1610,1620,1574,1729,1620,1730,1746,1620,1747,1749,1620,1728,2344,2364,2345,2352,2364,2353,2355,2364,2356,2503,2494,2507,2503,2519,2508,2887,2878,2891,2887,2902,2888,2887,2903,2892,2962,3031,2964,3014,3006,3018,3014,3031,3020,3015,3006,3019,3142,3158,3144,3263,3285,3264,3270,3266,3274,3270,3285,3271,3270,3286,3272,3274,3285,3275,3398,3390,3402,3398,3415,3404,3399,3390,3403,3545,3530,3546,3545,3535,3548,3545,3551,3550,3548,3530,3549,4133,4142,4134,6917,6965,6918,6919,6965,6920,6921,6965,6922,6923,6965,6924,6925,6965,6926,6929,6965,6930,6970,6965,6971,6972,6965,6973,6974,6965,6976,6975,6965,6977,6978,6965,6979,7734,772,7736,7735,772,7737,7770,772,7772,7771,772,7773,7778,775,7784,7779,775,7785,7840,770,7852,7840,774,7862,7841,770,7853,7841,774,7863,7864,770,7878,7865,770,7879,7884,770,7896,7885,770,7897,7936,768,7938,7936,769,7940,7936,834,7942,7936,837,8064,7937,768,7939,7937,769,7941,7937,834,7943,7937,837,8065,7938,837,8066,7939,837,8067,7940,837,8068,7941,837,8069,7942,837,8070,7943,837,8071,7944,768,7946,7944,769,7948,7944,834,7950,7944,837,8072,7945,768,7947,7945,769,7949,7945,834,7951,7945,837,8073,7946,837,8074,7947,837,8075,7948,837,8076,7949,837,8077,7950,837,8078,7951,837,8079,7952,768,7954,7952,769,7956,7953,768,7955,7953,769,7957,7960,768,7962,7960,769,7964,7961,768,7963,7961,769,7965,7968,768,7970,7968,769,7972,7968,834,7974,7968,837,8080,7969,768,7971,7969,769,7973,7969,834,7975,7969,837,8081,7970,837,8082,7971,837,8083,7972,837,8084,7973,837,8085,7974,837,8086,7975,837,8087,7976,768,7978,7976,769,7980,7976,834,7982,7976,837,8088,7977,768,7979,7977,769,7981,7977,834,7983,7977,837,8089,7978,837,8090,7979,837,8091,7980,837,8092,7981,837,8093,7982,837,8094,7983,837,8095,7984,768,7986,7984,769,7988,7984,834,7990,7985,768,7987,7985,769,7989,7985,834,7991,7992,768,7994,7992,769,7996,7992,834,7998,7993,768,7995,7993,769,7997,7993,834,7999,8000,768,8002,8000,769,8004,8001,768,8003,8001,769,8005,8008,768,8010,8008,769,8012,8009,768,8011,8009,769,8013,8016,768,8018,8016,769,8020,8016,834,8022,8017,768,8019,8017,769,8021,8017,834,8023,8025,768,8027,8025,769,8029,8025,834,8031,8032,768,8034,8032,769,8036,8032,834,8038,8032,837,8096,8033,768,8035,8033,769,8037,8033,834,8039,8033,837,8097,8034,837,8098,8035,837,8099,8036,837,8100,8037,837,8101,8038,837,8102,8039,837,8103,8040,768,8042,8040,769,8044,8040,834,8046,8040,837,8104,8041,768,8043,8041,769,8045,8041,834,8047,8041,837,8105,8042,837,8106,8043,837,8107,8044,837,8108,8045,837,8109,8046,837,8110,8047,837,8111,8048,837,8114,8052,837,8130,8060,837,8178,8118,837,8119,8127,768,8141,8127,769,8142,8127,834,8143,8134,837,8135,8182,837,8183,8190,768,8157,8190,769,8158,8190,834,8159,8592,824,8602,8594,824,8603,8596,824,8622,8656,824,8653,8658,824,8655,8660,824,8654,8707,824,8708,8712,824,8713,8715,824,8716,8739,824,8740,8741,824,8742,8764,824,8769,8771,824,8772,8773,824,8775,8776,824,8777,8781,824,8813,8801,824,8802,8804,824,8816,8805,824,8817,8818,824,8820,8819,824,8821,8822,824,8824,8823,824,8825,8826,824,8832,8827,824,8833,8828,824,8928,8829,824,8929,8834,824,8836,8835,824,8837,8838,824,8840,8839,824,8841,8849,824,8930,8850,824,8931,8866,824,8876,8872,824,8877,8873,824,8878,8875,824,8879,8882,824,8938,8883,824,8939,8884,824,8940,8885,824,8941,12358,12441,12436,12363,12441,12364,12365,12441,12366,12367,12441,12368,12369,12441,12370,12371,12441,12372,12373,12441,12374,12375,12441,12376,12377,12441,12378,12379,12441,12380,12381,12441,12382,12383,12441,12384,12385,12441,12386,12388,12441,12389,12390,12441,12391,12392,12441,12393,12399,12441,12400,12399,12442,12401,12402,12441,12403,12402,12442,12404,12405,12441,12406,12405,12442,12407,12408,12441,12409,12408,12442,12410,12411,12441,12412,12411,12442,12413,12445,12441,12446,12454,12441,12532,12459,12441,12460,12461,12441,12462,12463,12441,12464,12465,12441,12466,12467,12441,12468,12469,12441,12470,12471,12441,12472,12473,12441,12474,12475,12441,12476,12477,12441,12478,12479,12441,12480,12481,12441,12482,12484,12441,12485,12486,12441,12487,12488,12441,12489,12495,12441,12496,12495,12442,12497,12498,12441,12499,12498,12442,12500,12501,12441,12502,12501,12442,12503,12504,12441,12505,12504,12442,12506,12507,12441,12508,12507,12442,12509,12527,12441,12535,12528,12441,12536,12529,12441,12537,12530,12441,12538,12541,12441,12542,67026,775,67017,67034,775,67044,69785,69818,69786,69787,69818,69788,69797,69818,69803,69937,69927,69934,69938,69927,69935,70471,70462,70475,70471,70487,70476,70530,70601,70531,70532,70587,70533,70539,70594,70542,70544,70601,70545,70594,70584,70599,70594,70594,70597,70594,70601,70600,70841,70832,70844,70841,70842,70843,70841,70845,70846,71096,71087,71098,71097,71087,71099,71989,71984,71992,90398,90398,90401,90398,90399,90403,90398,90400,90405,90398,90409,90402,90401,90399,90406,90401,90400,90408,90402,90399,90407,90409,90399,90404,93539,93543,93545,93543,93543,93544,93545,93543,93546],t.t)
B.cf=s([192,65,768,193,65,769,194,65,770,195,65,771,196,65,776,197,65,778,199,67,807,200,69,768,201,69,769,202,69,770,203,69,776,204,73,768,205,73,769,206,73,770,207,73,776,209,78,771,210,79,768,211,79,769,212,79,770,213,79,771,214,79,776,217,85,768,218,85,769,219,85,770,220,85,776,221,89,769,224,97,768,225,97,769,226,97,770,227,97,771,228,97,776,229,97,778,231,99,807,232,101,768,233,101,769,234,101,770,235,101,776,236,105,768,237,105,769,238,105,770,239,105,776,241,110,771,242,111,768,243,111,769,244,111,770,245,111,771,246,111,776,249,117,768,250,117,769,251,117,770,252,117,776,253,121,769,255,121,776,256,65,772,257,97,772,258,65,774,259,97,774,260,65,808,261,97,808,262,67,769,263,99,769,264,67,770,265,99,770,266,67,775,267,99,775,268,67,780,269,99,780,270,68,780,271,100,780,274,69,772,275,101,772,276,69,774,277,101,774,278,69,775,279,101,775,280,69,808,281,101,808,282,69,780,283,101,780,284,71,770,285,103,770,286,71,774,287,103,774,288,71,775,289,103,775,290,71,807,291,103,807,292,72,770,293,104,770,296,73,771,297,105,771,298,73,772,299,105,772,300,73,774,301,105,774,302,73,808,303,105,808,304,73,775,308,74,770,309,106,770,310,75,807,311,107,807,313,76,769,314,108,769,315,76,807,316,108,807,317,76,780,318,108,780,323,78,769,324,110,769,325,78,807,326,110,807,327,78,780,328,110,780,332,79,772,333,111,772,334,79,774,335,111,774,336,79,779,337,111,779,340,82,769,341,114,769,342,82,807,343,114,807,344,82,780,345,114,780,346,83,769,347,115,769,348,83,770,349,115,770,350,83,807,351,115,807,352,83,780,353,115,780,354,84,807,355,116,807,356,84,780,357,116,780,360,85,771,361,117,771,362,85,772,363,117,772,364,85,774,365,117,774,366,85,778,367,117,778,368,85,779,369,117,779,370,85,808,371,117,808,372,87,770,373,119,770,374,89,770,375,121,770,376,89,776,377,90,769,378,122,769,379,90,775,380,122,775,381,90,780,382,122,780,416,79,795,417,111,795,431,85,795,432,117,795,461,65,780,462,97,780,463,73,780,464,105,780,465,79,780,466,111,780,467,85,780,468,117,780,469,220,772,470,252,772,471,220,769,472,252,769,473,220,780,474,252,780,475,220,768,476,252,768,478,196,772,479,228,772,480,550,772,481,551,772,482,198,772,483,230,772,486,71,780,487,103,780,488,75,780,489,107,780,490,79,808,491,111,808,492,490,772,493,491,772,494,439,780,495,658,780,496,106,780,500,71,769,501,103,769,504,78,768,505,110,768,506,197,769,507,229,769,508,198,769,509,230,769,510,216,769,511,248,769,512,65,783,513,97,783,514,65,785,515,97,785,516,69,783,517,101,783,518,69,785,519,101,785,520,73,783,521,105,783,522,73,785,523,105,785,524,79,783,525,111,783,526,79,785,527,111,785,528,82,783,529,114,783,530,82,785,531,114,785,532,85,783,533,117,783,534,85,785,535,117,785,536,83,806,537,115,806,538,84,806,539,116,806,542,72,780,543,104,780,550,65,775,551,97,775,552,69,807,553,101,807,554,214,772,555,246,772,556,213,772,557,245,772,558,79,775,559,111,775,560,558,772,561,559,772,562,89,772,563,121,772,832,768,-1,833,769,-1,835,787,-1,836,776,769,884,697,-1,894,59,-1,901,168,769,902,913,769,903,183,-1,904,917,769,905,919,769,906,921,769,908,927,769,910,933,769,911,937,769,912,970,769,938,921,776,939,933,776,940,945,769,941,949,769,942,951,769,943,953,769,944,971,769,970,953,776,971,965,776,972,959,769,973,965,769,974,969,769,979,978,769,980,978,776,1024,1045,768,1025,1045,776,1027,1043,769,1031,1030,776,1036,1050,769,1037,1048,768,1038,1059,774,1049,1048,774,1081,1080,774,1104,1077,768,1105,1077,776,1107,1075,769,1111,1110,776,1116,1082,769,1117,1080,768,1118,1091,774,1142,1140,783,1143,1141,783,1217,1046,774,1218,1078,774,1232,1040,774,1233,1072,774,1234,1040,776,1235,1072,776,1238,1045,774,1239,1077,774,1242,1240,776,1243,1241,776,1244,1046,776,1245,1078,776,1246,1047,776,1247,1079,776,1250,1048,772,1251,1080,772,1252,1048,776,1253,1080,776,1254,1054,776,1255,1086,776,1258,1256,776,1259,1257,776,1260,1069,776,1261,1101,776,1262,1059,772,1263,1091,772,1264,1059,776,1265,1091,776,1266,1059,779,1267,1091,779,1268,1063,776,1269,1095,776,1272,1067,776,1273,1099,776,1570,1575,1619,1571,1575,1620,1572,1608,1620,1573,1575,1621,1574,1610,1620,1728,1749,1620,1730,1729,1620,1747,1746,1620,2345,2344,2364,2353,2352,2364,2356,2355,2364,2392,2325,2364,2393,2326,2364,2394,2327,2364,2395,2332,2364,2396,2337,2364,2397,2338,2364,2398,2347,2364,2399,2351,2364,2507,2503,2494,2508,2503,2519,2524,2465,2492,2525,2466,2492,2527,2479,2492,2611,2610,2620,2614,2616,2620,2649,2582,2620,2650,2583,2620,2651,2588,2620,2654,2603,2620,2888,2887,2902,2891,2887,2878,2892,2887,2903,2908,2849,2876,2909,2850,2876,2964,2962,3031,3018,3014,3006,3019,3015,3006,3020,3014,3031,3144,3142,3158,3264,3263,3285,3271,3270,3285,3272,3270,3286,3274,3270,3266,3275,3274,3285,3402,3398,3390,3403,3399,3390,3404,3398,3415,3546,3545,3530,3548,3545,3535,3549,3548,3530,3550,3545,3551,3907,3906,4023,3917,3916,4023,3922,3921,4023,3927,3926,4023,3932,3931,4023,3945,3904,4021,3955,3953,3954,3957,3953,3956,3958,4018,3968,3960,4019,3968,3969,3953,3968,3987,3986,4023,3997,3996,4023,4002,4001,4023,4007,4006,4023,4012,4011,4023,4025,3984,4021,4134,4133,4142,6918,6917,6965,6920,6919,6965,6922,6921,6965,6924,6923,6965,6926,6925,6965,6930,6929,6965,6971,6970,6965,6973,6972,6965,6976,6974,6965,6977,6975,6965,6979,6978,6965,7680,65,805,7681,97,805,7682,66,775,7683,98,775,7684,66,803,7685,98,803,7686,66,817,7687,98,817,7688,199,769,7689,231,769,7690,68,775,7691,100,775,7692,68,803,7693,100,803,7694,68,817,7695,100,817,7696,68,807,7697,100,807,7698,68,813,7699,100,813,7700,274,768,7701,275,768,7702,274,769,7703,275,769,7704,69,813,7705,101,813,7706,69,816,7707,101,816,7708,552,774,7709,553,774,7710,70,775,7711,102,775,7712,71,772,7713,103,772,7714,72,775,7715,104,775,7716,72,803,7717,104,803,7718,72,776,7719,104,776,7720,72,807,7721,104,807,7722,72,814,7723,104,814,7724,73,816,7725,105,816,7726,207,769,7727,239,769,7728,75,769,7729,107,769,7730,75,803,7731,107,803,7732,75,817,7733,107,817,7734,76,803,7735,108,803,7736,7734,772,7737,7735,772,7738,76,817,7739,108,817,7740,76,813,7741,108,813,7742,77,769,7743,109,769,7744,77,775,7745,109,775,7746,77,803,7747,109,803,7748,78,775,7749,110,775,7750,78,803,7751,110,803,7752,78,817,7753,110,817,7754,78,813,7755,110,813,7756,213,769,7757,245,769,7758,213,776,7759,245,776,7760,332,768,7761,333,768,7762,332,769,7763,333,769,7764,80,769,7765,112,769,7766,80,775,7767,112,775,7768,82,775,7769,114,775,7770,82,803,7771,114,803,7772,7770,772,7773,7771,772,7774,82,817,7775,114,817,7776,83,775,7777,115,775,7778,83,803,7779,115,803,7780,346,775,7781,347,775,7782,352,775,7783,353,775,7784,7778,775,7785,7779,775,7786,84,775,7787,116,775,7788,84,803,7789,116,803,7790,84,817,7791,116,817,7792,84,813,7793,116,813,7794,85,804,7795,117,804,7796,85,816,7797,117,816,7798,85,813,7799,117,813,7800,360,769,7801,361,769,7802,362,776,7803,363,776,7804,86,771,7805,118,771,7806,86,803,7807,118,803,7808,87,768,7809,119,768,7810,87,769,7811,119,769,7812,87,776,7813,119,776,7814,87,775,7815,119,775,7816,87,803,7817,119,803,7818,88,775,7819,120,775,7820,88,776,7821,120,776,7822,89,775,7823,121,775,7824,90,770,7825,122,770,7826,90,803,7827,122,803,7828,90,817,7829,122,817,7830,104,817,7831,116,776,7832,119,778,7833,121,778,7835,383,775,7840,65,803,7841,97,803,7842,65,777,7843,97,777,7844,194,769,7845,226,769,7846,194,768,7847,226,768,7848,194,777,7849,226,777,7850,194,771,7851,226,771,7852,7840,770,7853,7841,770,7854,258,769,7855,259,769,7856,258,768,7857,259,768,7858,258,777,7859,259,777,7860,258,771,7861,259,771,7862,7840,774,7863,7841,774,7864,69,803,7865,101,803,7866,69,777,7867,101,777,7868,69,771,7869,101,771,7870,202,769,7871,234,769,7872,202,768,7873,234,768,7874,202,777,7875,234,777,7876,202,771,7877,234,771,7878,7864,770,7879,7865,770,7880,73,777,7881,105,777,7882,73,803,7883,105,803,7884,79,803,7885,111,803,7886,79,777,7887,111,777,7888,212,769,7889,244,769,7890,212,768,7891,244,768,7892,212,777,7893,244,777,7894,212,771,7895,244,771,7896,7884,770,7897,7885,770,7898,416,769,7899,417,769,7900,416,768,7901,417,768,7902,416,777,7903,417,777,7904,416,771,7905,417,771,7906,416,803,7907,417,803,7908,85,803,7909,117,803,7910,85,777,7911,117,777,7912,431,769,7913,432,769,7914,431,768,7915,432,768,7916,431,777,7917,432,777,7918,431,771,7919,432,771,7920,431,803,7921,432,803,7922,89,768,7923,121,768,7924,89,803,7925,121,803,7926,89,777,7927,121,777,7928,89,771,7929,121,771,7936,945,787,7937,945,788,7938,7936,768,7939,7937,768,7940,7936,769,7941,7937,769,7942,7936,834,7943,7937,834,7944,913,787,7945,913,788,7946,7944,768,7947,7945,768,7948,7944,769,7949,7945,769,7950,7944,834,7951,7945,834,7952,949,787,7953,949,788,7954,7952,768,7955,7953,768,7956,7952,769,7957,7953,769,7960,917,787,7961,917,788,7962,7960,768,7963,7961,768,7964,7960,769,7965,7961,769,7968,951,787,7969,951,788,7970,7968,768,7971,7969,768,7972,7968,769,7973,7969,769,7974,7968,834,7975,7969,834,7976,919,787,7977,919,788,7978,7976,768,7979,7977,768,7980,7976,769,7981,7977,769,7982,7976,834,7983,7977,834,7984,953,787,7985,953,788,7986,7984,768,7987,7985,768,7988,7984,769,7989,7985,769,7990,7984,834,7991,7985,834,7992,921,787,7993,921,788,7994,7992,768,7995,7993,768,7996,7992,769,7997,7993,769,7998,7992,834,7999,7993,834,8000,959,787,8001,959,788,8002,8000,768,8003,8001,768,8004,8000,769,8005,8001,769,8008,927,787,8009,927,788,8010,8008,768,8011,8009,768,8012,8008,769,8013,8009,769,8016,965,787,8017,965,788,8018,8016,768,8019,8017,768,8020,8016,769,8021,8017,769,8022,8016,834,8023,8017,834,8025,933,788,8027,8025,768,8029,8025,769,8031,8025,834,8032,969,787,8033,969,788,8034,8032,768,8035,8033,768,8036,8032,769,8037,8033,769,8038,8032,834,8039,8033,834,8040,937,787,8041,937,788,8042,8040,768,8043,8041,768,8044,8040,769,8045,8041,769,8046,8040,834,8047,8041,834,8048,945,768,8049,940,-1,8050,949,768,8051,941,-1,8052,951,768,8053,942,-1,8054,953,768,8055,943,-1,8056,959,768,8057,972,-1,8058,965,768,8059,973,-1,8060,969,768,8061,974,-1,8064,7936,837,8065,7937,837,8066,7938,837,8067,7939,837,8068,7940,837,8069,7941,837,8070,7942,837,8071,7943,837,8072,7944,837,8073,7945,837,8074,7946,837,8075,7947,837,8076,7948,837,8077,7949,837,8078,7950,837,8079,7951,837,8080,7968,837,8081,7969,837,8082,7970,837,8083,7971,837,8084,7972,837,8085,7973,837,8086,7974,837,8087,7975,837,8088,7976,837,8089,7977,837,8090,7978,837,8091,7979,837,8092,7980,837,8093,7981,837,8094,7982,837,8095,7983,837,8096,8032,837,8097,8033,837,8098,8034,837,8099,8035,837,8100,8036,837,8101,8037,837,8102,8038,837,8103,8039,837,8104,8040,837,8105,8041,837,8106,8042,837,8107,8043,837,8108,8044,837,8109,8045,837,8110,8046,837,8111,8047,837,8112,945,774,8113,945,772,8114,8048,837,8115,945,837,8116,940,837,8118,945,834,8119,8118,837,8120,913,774,8121,913,772,8122,913,768,8123,902,-1,8124,913,837,8126,953,-1,8129,168,834,8130,8052,837,8131,951,837,8132,942,837,8134,951,834,8135,8134,837,8136,917,768,8137,904,-1,8138,919,768,8139,905,-1,8140,919,837,8141,8127,768,8142,8127,769,8143,8127,834,8144,953,774,8145,953,772,8146,970,768,8147,912,-1,8150,953,834,8151,970,834,8152,921,774,8153,921,772,8154,921,768,8155,906,-1,8157,8190,768,8158,8190,769,8159,8190,834,8160,965,774,8161,965,772,8162,971,768,8163,944,-1,8164,961,787,8165,961,788,8166,965,834,8167,971,834,8168,933,774,8169,933,772,8170,933,768,8171,910,-1,8172,929,788,8173,168,768,8174,901,-1,8175,96,-1,8178,8060,837,8179,969,837,8180,974,837,8182,969,834,8183,8182,837,8184,927,768,8185,908,-1,8186,937,768,8187,911,-1,8188,937,837,8189,180,-1,8192,8194,-1,8193,8195,-1,8486,937,-1,8490,75,-1,8491,197,-1,8602,8592,824,8603,8594,824,8622,8596,824,8653,8656,824,8654,8660,824,8655,8658,824,8708,8707,824,8713,8712,824,8716,8715,824,8740,8739,824,8742,8741,824,8769,8764,824,8772,8771,824,8775,8773,824,8777,8776,824,8800,61,824,8802,8801,824,8813,8781,824,8814,60,824,8815,62,824,8816,8804,824,8817,8805,824,8820,8818,824,8821,8819,824,8824,8822,824,8825,8823,824,8832,8826,824,8833,8827,824,8836,8834,824,8837,8835,824,8840,8838,824,8841,8839,824,8876,8866,824,8877,8872,824,8878,8873,824,8879,8875,824,8928,8828,824,8929,8829,824,8930,8849,824,8931,8850,824,8938,8882,824,8939,8883,824,8940,8884,824,8941,8885,824,9001,12296,-1,9002,12297,-1,10972,10973,824,12364,12363,12441,12366,12365,12441,12368,12367,12441,12370,12369,12441,12372,12371,12441,12374,12373,12441,12376,12375,12441,12378,12377,12441,12380,12379,12441,12382,12381,12441,12384,12383,12441,12386,12385,12441,12389,12388,12441,12391,12390,12441,12393,12392,12441,12400,12399,12441,12401,12399,12442,12403,12402,12441,12404,12402,12442,12406,12405,12441,12407,12405,12442,12409,12408,12441,12410,12408,12442,12412,12411,12441,12413,12411,12442,12436,12358,12441,12446,12445,12441,12460,12459,12441,12462,12461,12441,12464,12463,12441,12466,12465,12441,12468,12467,12441,12470,12469,12441,12472,12471,12441,12474,12473,12441,12476,12475,12441,12478,12477,12441,12480,12479,12441,12482,12481,12441,12485,12484,12441,12487,12486,12441,12489,12488,12441,12496,12495,12441,12497,12495,12442,12499,12498,12441,12500,12498,12442,12502,12501,12441,12503,12501,12442,12505,12504,12441,12506,12504,12442,12508,12507,12441,12509,12507,12442,12532,12454,12441,12535,12527,12441,12536,12528,12441,12537,12529,12441,12538,12530,12441,12542,12541,12441,63744,35912,-1,63745,26356,-1,63746,36554,-1,63747,36040,-1,63748,28369,-1,63749,20018,-1,63750,21477,-1,63751,40860,-1,63752,40860,-1,63753,22865,-1,63754,37329,-1,63755,21895,-1,63756,22856,-1,63757,25078,-1,63758,30313,-1,63759,32645,-1,63760,34367,-1,63761,34746,-1,63762,35064,-1,63763,37007,-1,63764,27138,-1,63765,27931,-1,63766,28889,-1,63767,29662,-1,63768,33853,-1,63769,37226,-1,63770,39409,-1,63771,20098,-1,63772,21365,-1,63773,27396,-1,63774,29211,-1,63775,34349,-1,63776,40478,-1,63777,23888,-1,63778,28651,-1,63779,34253,-1,63780,35172,-1,63781,25289,-1,63782,33240,-1,63783,34847,-1,63784,24266,-1,63785,26391,-1,63786,28010,-1,63787,29436,-1,63788,37070,-1,63789,20358,-1,63790,20919,-1,63791,21214,-1,63792,25796,-1,63793,27347,-1,63794,29200,-1,63795,30439,-1,63796,32769,-1,63797,34310,-1,63798,34396,-1,63799,36335,-1,63800,38706,-1,63801,39791,-1,63802,40442,-1,63803,30860,-1,63804,31103,-1,63805,32160,-1,63806,33737,-1,63807,37636,-1,63808,40575,-1,63809,35542,-1,63810,22751,-1,63811,24324,-1,63812,31840,-1,63813,32894,-1,63814,29282,-1,63815,30922,-1,63816,36034,-1,63817,38647,-1,63818,22744,-1,63819,23650,-1,63820,27155,-1,63821,28122,-1,63822,28431,-1,63823,32047,-1,63824,32311,-1,63825,38475,-1,63826,21202,-1,63827,32907,-1,63828,20956,-1,63829,20940,-1,63830,31260,-1,63831,32190,-1,63832,33777,-1,63833,38517,-1,63834,35712,-1,63835,25295,-1,63836,27138,-1,63837,35582,-1,63838,20025,-1,63839,23527,-1,63840,24594,-1,63841,29575,-1,63842,30064,-1,63843,21271,-1,63844,30971,-1,63845,20415,-1,63846,24489,-1,63847,19981,-1,63848,27852,-1,63849,25976,-1,63850,32034,-1,63851,21443,-1,63852,22622,-1,63853,30465,-1,63854,33865,-1,63855,35498,-1,63856,27578,-1,63857,36784,-1,63858,27784,-1,63859,25342,-1,63860,33509,-1,63861,25504,-1,63862,30053,-1,63863,20142,-1,63864,20841,-1,63865,20937,-1,63866,26753,-1,63867,31975,-1,63868,33391,-1,63869,35538,-1,63870,37327,-1,63871,21237,-1,63872,21570,-1,63873,22899,-1,63874,24300,-1,63875,26053,-1,63876,28670,-1,63877,31018,-1,63878,38317,-1,63879,39530,-1,63880,40599,-1,63881,40654,-1,63882,21147,-1,63883,26310,-1,63884,27511,-1,63885,36706,-1,63886,24180,-1,63887,24976,-1,63888,25088,-1,63889,25754,-1,63890,28451,-1,63891,29001,-1,63892,29833,-1,63893,31178,-1,63894,32244,-1,63895,32879,-1,63896,36646,-1,63897,34030,-1,63898,36899,-1,63899,37706,-1,63900,21015,-1,63901,21155,-1,63902,21693,-1,63903,28872,-1,63904,35010,-1,63905,35498,-1,63906,24265,-1,63907,24565,-1,63908,25467,-1,63909,27566,-1,63910,31806,-1,63911,29557,-1,63912,20196,-1,63913,22265,-1,63914,23527,-1,63915,23994,-1,63916,24604,-1,63917,29618,-1,63918,29801,-1,63919,32666,-1,63920,32838,-1,63921,37428,-1,63922,38646,-1,63923,38728,-1,63924,38936,-1,63925,20363,-1,63926,31150,-1,63927,37300,-1,63928,38584,-1,63929,24801,-1,63930,20102,-1,63931,20698,-1,63932,23534,-1,63933,23615,-1,63934,26009,-1,63935,27138,-1,63936,29134,-1,63937,30274,-1,63938,34044,-1,63939,36988,-1,63940,40845,-1,63941,26248,-1,63942,38446,-1,63943,21129,-1,63944,26491,-1,63945,26611,-1,63946,27969,-1,63947,28316,-1,63948,29705,-1,63949,30041,-1,63950,30827,-1,63951,32016,-1,63952,39006,-1,63953,20845,-1,63954,25134,-1,63955,38520,-1,63956,20523,-1,63957,23833,-1,63958,28138,-1,63959,36650,-1,63960,24459,-1,63961,24900,-1,63962,26647,-1,63963,29575,-1,63964,38534,-1,63965,21033,-1,63966,21519,-1,63967,23653,-1,63968,26131,-1,63969,26446,-1,63970,26792,-1,63971,27877,-1,63972,29702,-1,63973,30178,-1,63974,32633,-1,63975,35023,-1,63976,35041,-1,63977,37324,-1,63978,38626,-1,63979,21311,-1,63980,28346,-1,63981,21533,-1,63982,29136,-1,63983,29848,-1,63984,34298,-1,63985,38563,-1,63986,40023,-1,63987,40607,-1,63988,26519,-1,63989,28107,-1,63990,33256,-1,63991,31435,-1,63992,31520,-1,63993,31890,-1,63994,29376,-1,63995,28825,-1,63996,35672,-1,63997,20160,-1,63998,33590,-1,63999,21050,-1,64e3,20999,-1,64001,24230,-1,64002,25299,-1,64003,31958,-1,64004,23429,-1,64005,27934,-1,64006,26292,-1,64007,36667,-1,64008,34892,-1,64009,38477,-1,64010,35211,-1,64011,24275,-1,64012,20800,-1,64013,21952,-1,64016,22618,-1,64018,26228,-1,64021,20958,-1,64022,29482,-1,64023,30410,-1,64024,31036,-1,64025,31070,-1,64026,31077,-1,64027,31119,-1,64028,38742,-1,64029,31934,-1,64030,32701,-1,64032,34322,-1,64034,35576,-1,64037,36920,-1,64038,37117,-1,64042,39151,-1,64043,39164,-1,64044,39208,-1,64045,40372,-1,64046,37086,-1,64047,38583,-1,64048,20398,-1,64049,20711,-1,64050,20813,-1,64051,21193,-1,64052,21220,-1,64053,21329,-1,64054,21917,-1,64055,22022,-1,64056,22120,-1,64057,22592,-1,64058,22696,-1,64059,23652,-1,64060,23662,-1,64061,24724,-1,64062,24936,-1,64063,24974,-1,64064,25074,-1,64065,25935,-1,64066,26082,-1,64067,26257,-1,64068,26757,-1,64069,28023,-1,64070,28186,-1,64071,28450,-1,64072,29038,-1,64073,29227,-1,64074,29730,-1,64075,30865,-1,64076,31038,-1,64077,31049,-1,64078,31048,-1,64079,31056,-1,64080,31062,-1,64081,31069,-1,64082,31117,-1,64083,31118,-1,64084,31296,-1,64085,31361,-1,64086,31680,-1,64087,32244,-1,64088,32265,-1,64089,32321,-1,64090,32626,-1,64091,32773,-1,64092,33261,-1,64093,33401,-1,64094,33401,-1,64095,33879,-1,64096,35088,-1,64097,35222,-1,64098,35585,-1,64099,35641,-1,64100,36051,-1,64101,36104,-1,64102,36790,-1,64103,36920,-1,64104,38627,-1,64105,38911,-1,64106,38971,-1,64107,24693,-1,64108,148206,-1,64109,33304,-1,64112,20006,-1,64113,20917,-1,64114,20840,-1,64115,20352,-1,64116,20805,-1,64117,20864,-1,64118,21191,-1,64119,21242,-1,64120,21917,-1,64121,21845,-1,64122,21913,-1,64123,21986,-1,64124,22618,-1,64125,22707,-1,64126,22852,-1,64127,22868,-1,64128,23138,-1,64129,23336,-1,64130,24274,-1,64131,24281,-1,64132,24425,-1,64133,24493,-1,64134,24792,-1,64135,24910,-1,64136,24840,-1,64137,24974,-1,64138,24928,-1,64139,25074,-1,64140,25140,-1,64141,25540,-1,64142,25628,-1,64143,25682,-1,64144,25942,-1,64145,26228,-1,64146,26391,-1,64147,26395,-1,64148,26454,-1,64149,27513,-1,64150,27578,-1,64151,27969,-1,64152,28379,-1,64153,28363,-1,64154,28450,-1,64155,28702,-1,64156,29038,-1,64157,30631,-1,64158,29237,-1,64159,29359,-1,64160,29482,-1,64161,29809,-1,64162,29958,-1,64163,30011,-1,64164,30237,-1,64165,30239,-1,64166,30410,-1,64167,30427,-1,64168,30452,-1,64169,30538,-1,64170,30528,-1,64171,30924,-1,64172,31409,-1,64173,31680,-1,64174,31867,-1,64175,32091,-1,64176,32244,-1,64177,32574,-1,64178,32773,-1,64179,33618,-1,64180,33775,-1,64181,34681,-1,64182,35137,-1,64183,35206,-1,64184,35222,-1,64185,35519,-1,64186,35576,-1,64187,35531,-1,64188,35585,-1,64189,35582,-1,64190,35565,-1,64191,35641,-1,64192,35722,-1,64193,36104,-1,64194,36664,-1,64195,36978,-1,64196,37273,-1,64197,37494,-1,64198,38524,-1,64199,38627,-1,64200,38742,-1,64201,38875,-1,64202,38911,-1,64203,38923,-1,64204,38971,-1,64205,39698,-1,64206,40860,-1,64207,141386,-1,64208,141380,-1,64209,144341,-1,64210,15261,-1,64211,16408,-1,64212,16441,-1,64213,152137,-1,64214,154832,-1,64215,163539,-1,64216,40771,-1,64217,40846,-1,64285,1497,1460,64287,1522,1463,64298,1513,1473,64299,1513,1474,64300,64329,1473,64301,64329,1474,64302,1488,1463,64303,1488,1464,64304,1488,1468,64305,1489,1468,64306,1490,1468,64307,1491,1468,64308,1492,1468,64309,1493,1468,64310,1494,1468,64312,1496,1468,64313,1497,1468,64314,1498,1468,64315,1499,1468,64316,1500,1468,64318,1502,1468,64320,1504,1468,64321,1505,1468,64323,1507,1468,64324,1508,1468,64326,1510,1468,64327,1511,1468,64328,1512,1468,64329,1513,1468,64330,1514,1468,64331,1493,1465,64332,1489,1471,64333,1499,1471,64334,1508,1471,67017,67026,775,67044,67034,775,69786,69785,69818,69788,69787,69818,69803,69797,69818,69934,69937,69927,69935,69938,69927,70475,70471,70462,70476,70471,70487,70531,70530,70601,70533,70532,70587,70542,70539,70594,70545,70544,70601,70597,70594,70594,70599,70594,70584,70600,70594,70601,70843,70841,70842,70844,70841,70832,70846,70841,70845,71098,71096,71087,71099,71097,71087,71992,71989,71984,90401,90398,90398,90402,90398,90409,90403,90398,90399,90404,90409,90399,90405,90398,90400,90406,90401,90399,90407,90402,90399,90408,90401,90400,93544,93543,93543,93545,93539,93543,93546,93545,93543,119134,119127,119141,119135,119128,119141,119136,119135,119150,119137,119135,119151,119138,119135,119152,119139,119135,119153,119140,119135,119154,119227,119225,119141,119228,119226,119141,119229,119227,119150,119230,119228,119150,119231,119227,119151,119232,119228,119151,194560,20029,-1,194561,20024,-1,194562,20033,-1,194563,131362,-1,194564,20320,-1,194565,20398,-1,194566,20411,-1,194567,20482,-1,194568,20602,-1,194569,20633,-1,194570,20711,-1,194571,20687,-1,194572,13470,-1,194573,132666,-1,194574,20813,-1,194575,20820,-1,194576,20836,-1,194577,20855,-1,194578,132380,-1,194579,13497,-1,194580,20839,-1,194581,20877,-1,194582,132427,-1,194583,20887,-1,194584,20900,-1,194585,20172,-1,194586,20908,-1,194587,20917,-1,194588,168415,-1,194589,20981,-1,194590,20995,-1,194591,13535,-1,194592,21051,-1,194593,21062,-1,194594,21106,-1,194595,21111,-1,194596,13589,-1,194597,21191,-1,194598,21193,-1,194599,21220,-1,194600,21242,-1,194601,21253,-1,194602,21254,-1,194603,21271,-1,194604,21321,-1,194605,21329,-1,194606,21338,-1,194607,21363,-1,194608,21373,-1,194609,21375,-1,194610,21375,-1,194611,21375,-1,194612,133676,-1,194613,28784,-1,194614,21450,-1,194615,21471,-1,194616,133987,-1,194617,21483,-1,194618,21489,-1,194619,21510,-1,194620,21662,-1,194621,21560,-1,194622,21576,-1,194623,21608,-1,194624,21666,-1,194625,21750,-1,194626,21776,-1,194627,21843,-1,194628,21859,-1,194629,21892,-1,194630,21892,-1,194631,21913,-1,194632,21931,-1,194633,21939,-1,194634,21954,-1,194635,22294,-1,194636,22022,-1,194637,22295,-1,194638,22097,-1,194639,22132,-1,194640,20999,-1,194641,22766,-1,194642,22478,-1,194643,22516,-1,194644,22541,-1,194645,22411,-1,194646,22578,-1,194647,22577,-1,194648,22700,-1,194649,136420,-1,194650,22770,-1,194651,22775,-1,194652,22790,-1,194653,22810,-1,194654,22818,-1,194655,22882,-1,194656,136872,-1,194657,136938,-1,194658,23020,-1,194659,23067,-1,194660,23079,-1,194661,23e3,-1,194662,23142,-1,194663,14062,-1,194664,14076,-1,194665,23304,-1,194666,23358,-1,194667,23358,-1,194668,137672,-1,194669,23491,-1,194670,23512,-1,194671,23527,-1,194672,23539,-1,194673,138008,-1,194674,23551,-1,194675,23558,-1,194676,24403,-1,194677,23586,-1,194678,14209,-1,194679,23648,-1,194680,23662,-1,194681,23744,-1,194682,23693,-1,194683,138724,-1,194684,23875,-1,194685,138726,-1,194686,23918,-1,194687,23915,-1,194688,23932,-1,194689,24033,-1,194690,24034,-1,194691,14383,-1,194692,24061,-1,194693,24104,-1,194694,24125,-1,194695,24169,-1,194696,14434,-1,194697,139651,-1,194698,14460,-1,194699,24240,-1,194700,24243,-1,194701,24246,-1,194702,24266,-1,194703,172946,-1,194704,24318,-1,194705,140081,-1,194706,140081,-1,194707,33281,-1,194708,24354,-1,194709,24354,-1,194710,14535,-1,194711,144056,-1,194712,156122,-1,194713,24418,-1,194714,24427,-1,194715,14563,-1,194716,24474,-1,194717,24525,-1,194718,24535,-1,194719,24569,-1,194720,24705,-1,194721,14650,-1,194722,14620,-1,194723,24724,-1,194724,141012,-1,194725,24775,-1,194726,24904,-1,194727,24908,-1,194728,24910,-1,194729,24908,-1,194730,24954,-1,194731,24974,-1,194732,25010,-1,194733,24996,-1,194734,25007,-1,194735,25054,-1,194736,25074,-1,194737,25078,-1,194738,25104,-1,194739,25115,-1,194740,25181,-1,194741,25265,-1,194742,25300,-1,194743,25424,-1,194744,142092,-1,194745,25405,-1,194746,25340,-1,194747,25448,-1,194748,25475,-1,194749,25572,-1,194750,142321,-1,194751,25634,-1,194752,25541,-1,194753,25513,-1,194754,14894,-1,194755,25705,-1,194756,25726,-1,194757,25757,-1,194758,25719,-1,194759,14956,-1,194760,25935,-1,194761,25964,-1,194762,143370,-1,194763,26083,-1,194764,26360,-1,194765,26185,-1,194766,15129,-1,194767,26257,-1,194768,15112,-1,194769,15076,-1,194770,20882,-1,194771,20885,-1,194772,26368,-1,194773,26268,-1,194774,32941,-1,194775,17369,-1,194776,26391,-1,194777,26395,-1,194778,26401,-1,194779,26462,-1,194780,26451,-1,194781,144323,-1,194782,15177,-1,194783,26618,-1,194784,26501,-1,194785,26706,-1,194786,26757,-1,194787,144493,-1,194788,26766,-1,194789,26655,-1,194790,26900,-1,194791,15261,-1,194792,26946,-1,194793,27043,-1,194794,27114,-1,194795,27304,-1,194796,145059,-1,194797,27355,-1,194798,15384,-1,194799,27425,-1,194800,145575,-1,194801,27476,-1,194802,15438,-1,194803,27506,-1,194804,27551,-1,194805,27578,-1,194806,27579,-1,194807,146061,-1,194808,138507,-1,194809,146170,-1,194810,27726,-1,194811,146620,-1,194812,27839,-1,194813,27853,-1,194814,27751,-1,194815,27926,-1,194816,27966,-1,194817,28023,-1,194818,27969,-1,194819,28009,-1,194820,28024,-1,194821,28037,-1,194822,146718,-1,194823,27956,-1,194824,28207,-1,194825,28270,-1,194826,15667,-1,194827,28363,-1,194828,28359,-1,194829,147153,-1,194830,28153,-1,194831,28526,-1,194832,147294,-1,194833,147342,-1,194834,28614,-1,194835,28729,-1,194836,28702,-1,194837,28699,-1,194838,15766,-1,194839,28746,-1,194840,28797,-1,194841,28791,-1,194842,28845,-1,194843,132389,-1,194844,28997,-1,194845,148067,-1,194846,29084,-1,194847,148395,-1,194848,29224,-1,194849,29237,-1,194850,29264,-1,194851,149e3,-1,194852,29312,-1,194853,29333,-1,194854,149301,-1,194855,149524,-1,194856,29562,-1,194857,29579,-1,194858,16044,-1,194859,29605,-1,194860,16056,-1,194861,16056,-1,194862,29767,-1,194863,29788,-1,194864,29809,-1,194865,29829,-1,194866,29898,-1,194867,16155,-1,194868,29988,-1,194869,150582,-1,194870,30014,-1,194871,150674,-1,194872,30064,-1,194873,139679,-1,194874,30224,-1,194875,151457,-1,194876,151480,-1,194877,151620,-1,194878,16380,-1,194879,16392,-1,194880,30452,-1,194881,151795,-1,194882,151794,-1,194883,151833,-1,194884,151859,-1,194885,30494,-1,194886,30495,-1,194887,30495,-1,194888,30538,-1,194889,16441,-1,194890,30603,-1,194891,16454,-1,194892,16534,-1,194893,152605,-1,194894,30798,-1,194895,30860,-1,194896,30924,-1,194897,16611,-1,194898,153126,-1,194899,31062,-1,194900,153242,-1,194901,153285,-1,194902,31119,-1,194903,31211,-1,194904,16687,-1,194905,31296,-1,194906,31306,-1,194907,31311,-1,194908,153980,-1,194909,154279,-1,194910,154279,-1,194911,31470,-1,194912,16898,-1,194913,154539,-1,194914,31686,-1,194915,31689,-1,194916,16935,-1,194917,154752,-1,194918,31954,-1,194919,17056,-1,194920,31976,-1,194921,31971,-1,194922,32e3,-1,194923,155526,-1,194924,32099,-1,194925,17153,-1,194926,32199,-1,194927,32258,-1,194928,32325,-1,194929,17204,-1,194930,156200,-1,194931,156231,-1,194932,17241,-1,194933,156377,-1,194934,32634,-1,194935,156478,-1,194936,32661,-1,194937,32762,-1,194938,32773,-1,194939,156890,-1,194940,156963,-1,194941,32864,-1,194942,157096,-1,194943,32880,-1,194944,144223,-1,194945,17365,-1,194946,32946,-1,194947,33027,-1,194948,17419,-1,194949,33086,-1,194950,23221,-1,194951,157607,-1,194952,157621,-1,194953,144275,-1,194954,144284,-1,194955,33281,-1,194956,33284,-1,194957,36766,-1,194958,17515,-1,194959,33425,-1,194960,33419,-1,194961,33437,-1,194962,21171,-1,194963,33457,-1,194964,33459,-1,194965,33469,-1,194966,33510,-1,194967,158524,-1,194968,33509,-1,194969,33565,-1,194970,33635,-1,194971,33709,-1,194972,33571,-1,194973,33725,-1,194974,33767,-1,194975,33879,-1,194976,33619,-1,194977,33738,-1,194978,33740,-1,194979,33756,-1,194980,158774,-1,194981,159083,-1,194982,158933,-1,194983,17707,-1,194984,34033,-1,194985,34035,-1,194986,34070,-1,194987,160714,-1,194988,34148,-1,194989,159532,-1,194990,17757,-1,194991,17761,-1,194992,159665,-1,194993,159954,-1,194994,17771,-1,194995,34384,-1,194996,34396,-1,194997,34407,-1,194998,34409,-1,194999,34473,-1,195e3,34440,-1,195001,34574,-1,195002,34530,-1,195003,34681,-1,195004,34600,-1,195005,34667,-1,195006,34694,-1,195007,17879,-1,195008,34785,-1,195009,34817,-1,195010,17913,-1,195011,34912,-1,195012,34915,-1,195013,161383,-1,195014,35031,-1,195015,35038,-1,195016,17973,-1,195017,35066,-1,195018,13499,-1,195019,161966,-1,195020,162150,-1,195021,18110,-1,195022,18119,-1,195023,35488,-1,195024,35565,-1,195025,35722,-1,195026,35925,-1,195027,162984,-1,195028,36011,-1,195029,36033,-1,195030,36123,-1,195031,36215,-1,195032,163631,-1,195033,133124,-1,195034,36299,-1,195035,36284,-1,195036,36336,-1,195037,133342,-1,195038,36564,-1,195039,36664,-1,195040,165330,-1,195041,165357,-1,195042,37012,-1,195043,37105,-1,195044,37137,-1,195045,165678,-1,195046,37147,-1,195047,37432,-1,195048,37591,-1,195049,37592,-1,195050,37500,-1,195051,37881,-1,195052,37909,-1,195053,166906,-1,195054,38283,-1,195055,18837,-1,195056,38327,-1,195057,167287,-1,195058,18918,-1,195059,38595,-1,195060,23986,-1,195061,38691,-1,195062,168261,-1,195063,168474,-1,195064,19054,-1,195065,19062,-1,195066,38880,-1,195067,168970,-1,195068,19122,-1,195069,169110,-1,195070,38923,-1,195071,38923,-1,195072,38953,-1,195073,169398,-1,195074,39138,-1,195075,19251,-1,195076,39209,-1,195077,39335,-1,195078,39362,-1,195079,39422,-1,195080,19406,-1,195081,170800,-1,195082,39698,-1,195083,4e4,-1,195084,40189,-1,195085,19662,-1,195086,19693,-1,195087,40295,-1,195088,172238,-1,195089,19704,-1,195090,172293,-1,195091,172558,-1,195092,172689,-1,195093,40635,-1,195094,19798,-1,195095,40697,-1,195096,40702,-1,195097,40709,-1,195098,40719,-1,195099,40726,-1,195100,40763,-1,195101,173568,-1],t.t)
B.cg=s(["","@2x"],t.s)
B.ch=s(["line-color","line-opacity","line-width","line-gap-width","line-offset","line-blur","line-pattern","line-dasharray"],t.s)
B.ci=s(["heatmap-weight","heatmap-radius"],t.s)
B.cj=s(["text-color","text-opacity","text-halo-color","text-halo-width","text-halo-blur","icon-color","icon-opacity"],t.s)
B.a4=s([1769172844,1718185569,1718185522,1718185523,1835361385,1835361330,1768843636],t.t)
B.ck=s([0,64,25,65,90,74,91,96,25,97,122,74,123,169,25,170,170,74,171,185,25,186,186,74,187,191,25,192,214,74,215,215,25,216,246,74,247,247,25,248,696,74,697,735,25,736,740,74,741,745,25,746,747,13,748,767,25,768,879,58,880,883,45,884,884,25,885,887,45,890,893,45,894,894,25,895,895,45,900,900,45,901,901,25,902,902,45,903,903,25,904,906,45,908,908,45,910,929,45,931,993,45,994,1007,26,1008,1023,45,1024,1156,30,1157,1158,58,1159,1327,30,1329,1366,5,1369,1418,5,1421,1423,5,1425,1479,55,1488,1514,55,1519,1524,55,1536,1540,4,1541,1541,25,1542,1547,4,1548,1548,25,1549,1562,4,1563,1563,25,1564,1566,4,1567,1567,25,1568,1599,4,1600,1600,25,1601,1610,4,1611,1621,58,1622,1647,4,1648,1648,58,1649,1756,4,1757,1757,25,1758,1791,4,1792,1805,144,1807,1866,144,1869,1871,144,1872,1919,4,1920,1969,155,1984,2042,105,2045,2047,105,2048,2093,131,2096,2110,131,2112,2139,85,2142,2142,85,2144,2154,144,2160,2190,4,2192,2193,4,2199,2273,4,2274,2274,25,2275,2303,4,2304,2384,32,2385,2388,58,2389,2403,32,2404,2405,25,2406,2431,32,2432,2435,11,2437,2444,11,2447,2448,11,2451,2472,11,2474,2480,11,2482,2482,11,2486,2489,11,2492,2500,11,2503,2504,11,2507,2510,11,2519,2519,11,2524,2525,11,2527,2531,11,2534,2558,11,2561,2563,48,2565,2570,48,2575,2576,48,2579,2600,48,2602,2608,48,2610,2611,48,2613,2614,48,2616,2617,48,2620,2620,48,2622,2626,48,2631,2632,48,2635,2637,48,2641,2641,48,2649,2652,48,2654,2654,48,2662,2678,48,2689,2691,46,2693,2701,46,2703,2705,46,2707,2728,46,2730,2736,46,2738,2739,46,2741,2745,46,2748,2757,46,2759,2761,46,2763,2765,46,2768,2768,46,2784,2787,46,2790,2801,46,2809,2815,46,2817,2819,120,2821,2828,120,2831,2832,120,2835,2856,120,2858,2864,120,2866,2867,120,2869,2873,120,2876,2884,120,2887,2888,120,2891,2893,120,2901,2903,120,2908,2909,120,2911,2915,120,2918,2935,120,2946,2947,151,2949,2954,151,2958,2960,151,2962,2965,151,2969,2970,151,2972,2972,151,2974,2975,151,2979,2980,151,2984,2986,151,2990,3001,151,3006,3010,151,3014,3016,151,3018,3021,151,3024,3024,151,3031,3031,151,3046,3066,151,3072,3084,154,3086,3088,154,3090,3112,154,3114,3129,154,3132,3140,154,3142,3144,154,3146,3149,154,3157,3158,154,3160,3162,154,3165,3165,154,3168,3171,154,3174,3183,154,3191,3199,154,3200,3212,63,3214,3216,63,3218,3240,63,3242,3251,63,3253,3257,63,3260,3268,63,3270,3272,63,3274,3277,63,3285,3286,63,3293,3294,63,3296,3299,63,3302,3311,63,3313,3315,63,3328,3340,84,3342,3344,84,3346,3396,84,3398,3400,84,3402,3407,84,3412,3427,84,3430,3455,84,3457,3459,137,3461,3478,137,3482,3505,137,3507,3515,137,3517,3517,137,3520,3526,137,3530,3530,137,3535,3540,137,3542,3542,137,3544,3551,137,3558,3567,137,3570,3572,137,3585,3642,156,3647,3647,25,3648,3675,156,3713,3714,73,3716,3716,73,3718,3722,73,3724,3747,73,3749,3749,73,3751,3773,73,3776,3780,73,3782,3782,73,3784,3790,73,3792,3801,73,3804,3807,73,3840,3911,157,3913,3948,157,3953,3991,157,3993,4028,157,4030,4044,157,4046,4052,157,4053,4056,25,4057,4058,157,4096,4255,99,4256,4293,41,4295,4295,41,4301,4301,41,4304,4346,41,4347,4347,25,4348,4351,41,4352,4607,51,4608,4680,39,4682,4685,39,4688,4694,39,4696,4696,39,4698,4701,39,4704,4744,39,4746,4749,39,4752,4784,39,4786,4789,39,4792,4798,39,4800,4800,39,4802,4805,39,4808,4822,39,4824,4880,39,4882,4885,39,4888,4954,39,4957,4988,39,4992,5017,39,5024,5109,23,5112,5117,23,5120,5759,18,5760,5788,108,5792,5866,130,5867,5869,25,5870,5880,130,5888,5909,145,5919,5919,145,5920,5940,53,5941,5942,25,5952,5971,17,5984,5996,146,5998,6000,146,6002,6003,146,6016,6109,69,6112,6121,69,6128,6137,69,6144,6145,96,6146,6147,25,6148,6148,96,6149,6149,25,6150,6169,96,6176,6264,96,6272,6314,96,6320,6389,18,6400,6430,76,6432,6443,76,6448,6459,76,6464,6464,76,6468,6479,76,6480,6509,147,6512,6516,147,6528,6571,103,6576,6601,103,6608,6618,103,6622,6623,103,6624,6655,69,6656,6683,16,6686,6687,16,6688,6750,148,6752,6780,148,6783,6793,148,6800,6809,148,6816,6829,148,6832,6862,58,6912,6988,7,6990,7039,7,7040,7103,141,7104,7155,10,7164,7167,10,7168,7223,75,7227,7241,75,7245,7247,75,7248,7295,109,7296,7306,30,7312,7354,41,7357,7359,41,7360,7367,141,7376,7378,58,7379,7379,25,7380,7392,58,7393,7393,25,7394,7400,58,7401,7404,25,7405,7405,58,7406,7411,25,7412,7412,58,7413,7415,25,7416,7417,58,7418,7418,25,7424,7461,74,7462,7466,45,7467,7467,30,7468,7516,74,7517,7521,45,7522,7525,74,7526,7530,45,7531,7543,74,7544,7544,30,7545,7614,74,7615,7615,45,7616,7679,58,7680,7935,74,7936,7957,45,7960,7965,45,7968,8005,45,8008,8013,45,8016,8023,45,8025,8025,45,8027,8027,45,8029,8029,45,8031,8061,45,8064,8116,45,8118,8132,45,8134,8147,45,8150,8155,45,8157,8175,45,8178,8180,45,8182,8190,45,8192,8203,25,8204,8205,58,8206,8292,25,8294,8304,25,8305,8305,74,8308,8318,25,8319,8319,74,8320,8334,25,8336,8348,74,8352,8384,25,8400,8432,58,8448,8485,25,8486,8486,45,8487,8489,25,8490,8491,74,8492,8497,25,8498,8498,74,8499,8525,25,8526,8526,74,8527,8543,25,8544,8584,74,8585,8587,25,8592,9257,25,9280,9290,25,9312,10239,25,10240,10495,15,10496,11123,25,11126,11157,25,11159,11263,25,11264,11359,42,11360,11391,74,11392,11507,26,11513,11519,26,11520,11557,41,11559,11559,41,11565,11565,41,11568,11623,158,11631,11632,158,11647,11647,158,11648,11670,39,11680,11686,39,11688,11694,39,11696,11702,39,11704,11710,39,11712,11718,39,11720,11726,39,11728,11734,39,11736,11742,39,11744,11775,30,11776,11869,25,11904,11929,50,11931,12019,50,12032,12245,50,12272,12292,25,12293,12293,50,12294,12294,25,12295,12295,50,12296,12320,25,12321,12329,50,12330,12333,58,12334,12335,51,12336,12343,25,12344,12347,50,12348,12351,25,12353,12438,56,12441,12442,58,12443,12444,25,12445,12447,56,12448,12448,25,12449,12538,64,12539,12540,25,12541,12543,64,12549,12591,13,12593,12686,51,12688,12703,25,12704,12735,13,12736,12773,25,12783,12783,25,12784,12799,64,12800,12830,51,12832,12895,25,12896,12926,51,12927,13007,25,13008,13054,64,13055,13055,25,13056,13143,64,13144,13311,25,13312,19903,50,19904,19967,25,19968,40959,50,40960,42124,169,42128,42182,169,42192,42239,79,42240,42539,164,42560,42655,30,42656,42743,8,42752,42785,25,42786,42887,74,42888,42890,25,42891,42957,74,42960,42961,74,42963,42963,74,42965,42972,74,42994,43007,74,43008,43052,143,43056,43065,25,43072,43127,126,43136,43205,132,43214,43225,132,43232,43263,32,43264,43309,66,43310,43310,25,43311,43311,66,43312,43347,129,43359,43359,129,43360,43388,51,43392,43469,61,43471,43471,25,43472,43481,61,43486,43487,61,43488,43518,99,43520,43574,22,43584,43597,22,43600,43609,22,43612,43615,22,43616,43647,99,43648,43714,149,43739,43743,149,43744,43766,90,43777,43782,39,43785,43790,39,43793,43798,39,43808,43814,39,43816,43822,39,43824,43866,74,43867,43867,25,43868,43876,74,43877,43877,45,43878,43881,74,43882,43883,25,43888,43967,23,43968,44013,90,44016,44025,90,44032,55203,51,55216,55238,51,55243,55291,51,63744,64109,50,64112,64217,50,64256,64262,74,64275,64279,5,64285,64310,55,64312,64316,55,64318,64318,55,64320,64321,55,64323,64324,55,64326,64335,55,64336,64450,4,64467,64829,4,64830,64831,25,64832,64911,4,64914,64967,4,64975,64975,4,65008,65023,4,65024,65039,58,65040,65049,25,65056,65069,58,65070,65071,30,65072,65106,25,65108,65126,25,65128,65131,25,65136,65140,4,65142,65276,4,65279,65279,25,65281,65312,25,65313,65338,74,65339,65344,25,65345,65370,74,65371,65381,25,65382,65391,64,65392,65392,25,65393,65437,64,65438,65439,25,65440,65470,51,65474,65479,51,65482,65487,51,65490,65495,51,65498,65500,51,65504,65510,25,65512,65518,25,65529,65533,25,65536,65547,78,65549,65574,78,65576,65594,78,65596,65597,78,65599,65613,78,65616,65629,78,65664,65786,78,65792,65794,25,65799,65843,25,65847,65855,25,65856,65934,45,65936,65948,25,65952,65952,45,66e3,66044,25,66045,66045,58,66176,66204,80,66208,66256,19,66272,66272,58,66273,66299,25,66304,66339,112,66349,66351,112,66352,66378,43,66384,66426,114,66432,66461,163,66463,66463,163,66464,66499,115,66504,66517,115,66560,66639,31,66640,66687,134,66688,66717,122,66720,66729,122,66736,66771,121,66776,66811,121,66816,66855,37,66864,66915,20,66927,66927,20,66928,66938,165,66940,66954,165,66956,66962,165,66964,66965,165,66967,66977,165,66979,66993,165,66995,67001,165,67003,67004,165,67008,67059,160,67072,67382,77,67392,67413,77,67424,67431,77,67456,67461,74,67463,67504,74,67506,67514,74,67584,67589,28,67592,67592,28,67594,67637,28,67639,67640,28,67644,67644,28,67647,67647,28,67648,67669,57,67671,67679,57,67680,67711,124,67712,67742,100,67751,67759,100,67808,67826,54,67828,67829,54,67835,67839,54,67840,67867,127,67871,67871,127,67872,67897,81,67903,67903,81,67968,67999,93,68e3,68023,92,68028,68047,92,68050,68095,92,68096,68099,67,68101,68102,67,68108,68115,67,68117,68119,67,68121,68149,67,68152,68154,67,68159,68168,67,68176,68184,67,68192,68223,117,68224,68255,113,68288,68326,86,68331,68342,86,68352,68405,6,68409,68415,6,68416,68437,60,68440,68447,60,68448,68466,59,68472,68479,59,68480,68497,128,68505,68508,128,68521,68527,128,68608,68680,118,68736,68786,111,68800,68850,111,68858,68863,111,68864,68903,52,68912,68921,52,68928,68965,40,68969,68997,40,69006,69007,40,69216,69246,4,69248,69289,168,69291,69293,168,69296,69297,168,69314,69316,4,69372,69375,4,69376,69415,116,69424,69465,138,69488,69513,119,69552,69579,24,69600,69622,38,69632,69709,14,69714,69749,14,69759,69759,14,69760,69826,62,69837,69837,62,69840,69864,139,69872,69881,139,69888,69940,21,69942,69959,21,69968,70006,82,70016,70111,133,70113,70132,137,70144,70161,70,70163,70209,70,70272,70278,98,70280,70280,98,70282,70285,98,70287,70301,98,70303,70313,98,70320,70378,71,70384,70393,71,70400,70403,44,70405,70412,44,70415,70416,44,70419,70440,44,70442,70448,44,70450,70451,44,70453,70457,44,70459,70459,58,70460,70468,44,70471,70472,44,70475,70477,44,70480,70480,44,70487,70487,44,70493,70499,44,70502,70508,44,70512,70516,44,70528,70537,162,70539,70539,162,70542,70542,162,70544,70581,162,70583,70592,162,70594,70594,162,70597,70597,162,70599,70602,162,70604,70613,162,70615,70616,162,70625,70626,162,70656,70747,104,70749,70753,104,70784,70855,159,70864,70873,159,71040,71093,135,71096,71133,135,71168,71236,95,71248,71257,95,71264,71276,96,71296,71353,150,71360,71369,150,71376,71395,99,71424,71450,2,71453,71467,2,71472,71494,2,71680,71739,34,71840,71922,167,71935,71935,167,71936,71942,33,71945,71945,33,71948,71955,33,71957,71958,33,71960,71989,33,71991,71992,33,71995,72006,33,72016,72025,33,72096,72103,102,72106,72151,102,72154,72164,102,72192,72263,170,72272,72354,140,72368,72383,18,72384,72440,125,72448,72457,32,72640,72673,142,72688,72697,142,72704,72712,12,72714,72758,12,72760,72773,12,72784,72812,12,72816,72847,87,72850,72871,87,72873,72886,87,72960,72966,88,72968,72969,88,72971,73014,88,73018,73018,88,73020,73021,88,73023,73031,88,73040,73049,88,73056,73061,47,73063,73064,47,73066,73102,47,73104,73105,47,73107,73112,47,73120,73129,47,73440,73464,83,73472,73488,65,73490,73530,65,73534,73562,65,73648,73648,79,73664,73713,151,73727,73727,151,73728,74649,27,74752,74862,27,74864,74868,27,74880,75075,27,77712,77810,29,77824,78933,36,78944,82938,36,82944,83526,3,90368,90425,49,92160,92728,8,92736,92766,97,92768,92777,97,92782,92783,97,92784,92862,152,92864,92873,152,92880,92909,9,92912,92917,9,92928,92997,123,93008,93017,123,93019,93025,123,93027,93047,123,93053,93071,123,93504,93561,72,93760,93850,89,93952,94026,94,94031,94087,94,94095,94111,94,94176,94176,153,94177,94177,106,94178,94179,50,94180,94180,68,94192,94193,50,94208,100343,153,100352,101119,153,101120,101589,68,101631,101631,68,101632,101640,153,110576,110579,64,110581,110587,64,110589,110590,64,110592,110592,64,110593,110879,56,110880,110882,64,110898,110898,56,110928,110930,56,110933,110933,64,110948,110951,64,110960,111355,106,113664,113770,35,113776,113788,35,113792,113800,35,113808,113817,35,113820,113823,35,113824,113827,25,117760,118009,25,118016,118451,25,118528,118573,58,118576,118598,58,118608,118723,25,118784,119029,25,119040,119078,25,119081,119142,25,119143,119145,58,119146,119162,25,119163,119170,58,119171,119172,25,119173,119179,58,119180,119209,25,119210,119213,58,119214,119274,25,119296,119365,45,119488,119507,25,119520,119539,25,119552,119638,25,119648,119672,25,119808,119892,25,119894,119964,25,119966,119967,25,119970,119970,25,119973,119974,25,119977,119980,25,119982,119993,25,119995,119995,25,119997,120003,25,120005,120069,25,120071,120074,25,120077,120084,25,120086,120092,25,120094,120121,25,120123,120126,25,120128,120132,25,120134,120134,25,120138,120144,25,120146,120485,25,120488,120779,25,120782,120831,25,120832,121483,136,121499,121503,136,121505,121519,136,122624,122654,74,122661,122666,74,122880,122886,42,122888,122904,42,122907,122913,42,122915,122916,42,122918,122922,42,122928,122989,30,123023,123023,30,123136,123180,107,123184,123197,107,123200,123209,107,123214,123215,107,123536,123566,161,123584,123641,166,123647,123647,166,124112,124153,101,124368,124410,110,124415,124415,110,124896,124902,39,124904,124907,39,124909,124910,39,124912,124926,39,124928,125124,91,125127,125142,91,125184,125259,1,125264,125273,1,125278,125279,1,126065,126132,25,126209,126269,25,126464,126467,4,126469,126495,4,126497,126498,4,126500,126500,4,126503,126503,4,126505,126514,4,126516,126519,4,126521,126521,4,126523,126523,4,126530,126530,4,126535,126535,4,126537,126537,4,126539,126539,4,126541,126543,4,126545,126546,4,126548,126548,4,126551,126551,4,126553,126553,4,126555,126555,4,126557,126557,4,126559,126559,4,126561,126562,4,126564,126564,4,126567,126570,4,126572,126578,4,126580,126583,4,126585,126588,4,126590,126590,4,126592,126601,4,126603,126619,4,126625,126627,4,126629,126633,4,126635,126651,4,126704,126705,4,126976,127019,25,127024,127123,25,127136,127150,25,127153,127167,25,127169,127183,25,127185,127221,25,127232,127405,25,127462,127487,25,127488,127488,56,127489,127490,25,127504,127547,25,127552,127560,25,127568,127569,25,127584,127589,25,127744,128727,25,128732,128748,25,128752,128764,25,128768,128886,25,128891,128985,25,128992,129003,25,129008,129008,25,129024,129035,25,129040,129095,25,129104,129113,25,129120,129159,25,129168,129197,25,129200,129211,25,129216,129217,25,129280,129619,25,129632,129645,25,129648,129660,25,129664,129673,25,129679,129734,25,129742,129756,25,129759,129769,25,129776,129784,25,129792,129938,25,129940,130041,25,131072,173791,50,173824,177977,50,177984,178205,50,178208,183969,50,183984,191456,50,191472,192093,50,194560,195101,50,196608,201546,50,201552,205743,50,917505,917505,25,917536,917631,25,917760,917999,58],t.t)
B.cl=s([1633842797,1651275629,1667460464,1819239276,1835102827,1835756907,1919707495],t.t)
B.ar=new A.bN(1,"children")
B.as=new A.bN(2,"leaves")
B.cm=s([B.Y,B.ar,B.as],A.af("k<bN>"))
B.cn=s([173,173,5,768,879,5,1155,1161,5,1425,1469,5,1471,1471,5,1473,1474,5,1476,1477,5,1479,1479,5,1552,1562,5,1564,1564,5,1568,1568,3,1570,1573,2,1574,1574,3,1575,1575,2,1576,1576,3,1577,1577,2,1578,1582,3,1583,1586,2,1587,1599,3,1600,1600,4,1601,1607,3,1608,1608,2,1609,1610,3,1611,1631,5,1646,1647,3,1648,1648,5,1649,1651,2,1653,1655,2,1656,1671,3,1672,1689,2,1690,1727,3,1728,1728,2,1729,1730,3,1731,1739,2,1740,1740,3,1741,1741,2,1742,1742,3,1743,1743,2,1744,1745,3,1746,1747,2,1749,1749,2,1750,1756,5,1759,1764,5,1767,1768,5,1770,1773,5,1774,1775,2,1786,1788,3,1791,1791,3,1807,1807,5,1808,1808,2,1809,1809,5,1810,1812,3,1813,1817,2,1818,1821,3,1822,1822,2,1823,1831,3,1832,1832,2,1833,1833,3,1834,1834,2,1835,1835,3,1836,1836,2,1837,1838,3,1839,1839,2,1840,1866,5,1869,1869,2,1870,1880,3,1881,1883,2,1884,1898,3,1899,1900,2,1901,1904,3,1905,1905,2,1906,1906,3,1907,1908,2,1909,1911,3,1912,1913,2,1914,1919,3,1958,1968,5,1994,2026,3,2027,2035,5,2042,2042,4,2045,2045,5,2070,2073,5,2075,2083,5,2085,2087,5,2089,2093,5,2112,2112,2,2113,2117,3,2118,2119,2,2120,2120,3,2121,2121,2,2122,2131,3,2132,2132,2,2133,2133,3,2134,2136,2,2137,2139,5,2144,2144,3,2146,2149,3,2151,2151,2,2152,2152,3,2153,2154,2,2160,2178,2,2179,2181,4,2182,2182,3,2185,2189,3,2190,2190,2,2199,2207,5,2208,2217,3,2218,2220,2,2222,2222,2,2223,2224,3,2225,2226,2,2227,2232,3,2233,2233,2,2234,2248,3,2250,2273,5,2275,2306,5,2362,2362,5,2364,2364,5,2369,2376,5,2381,2381,5,2385,2391,5,2402,2403,5,2433,2433,5,2492,2492,5,2497,2500,5,2509,2509,5,2530,2531,5,2558,2558,5,2561,2562,5,2620,2620,5,2625,2626,5,2631,2632,5,2635,2637,5,2641,2641,5,2672,2673,5,2677,2677,5,2689,2690,5,2748,2748,5,2753,2757,5,2759,2760,5,2765,2765,5,2786,2787,5,2810,2815,5,2817,2817,5,2876,2876,5,2879,2879,5,2881,2884,5,2893,2893,5,2901,2902,5,2914,2915,5,2946,2946,5,3008,3008,5,3021,3021,5,3072,3072,5,3076,3076,5,3132,3132,5,3134,3136,5,3142,3144,5,3146,3149,5,3157,3158,5,3170,3171,5,3201,3201,5,3260,3260,5,3263,3263,5,3270,3270,5,3276,3277,5,3298,3299,5,3328,3329,5,3387,3388,5,3393,3396,5,3405,3405,5,3426,3427,5,3457,3457,5,3530,3530,5,3538,3540,5,3542,3542,5,3633,3633,5,3636,3642,5,3655,3662,5,3761,3761,5,3764,3772,5,3784,3790,5,3864,3865,5,3893,3893,5,3895,3895,5,3897,3897,5,3953,3966,5,3968,3972,5,3974,3975,5,3981,3991,5,3993,4028,5,4038,4038,5,4141,4144,5,4146,4151,5,4153,4154,5,4157,4158,5,4184,4185,5,4190,4192,5,4209,4212,5,4226,4226,5,4229,4230,5,4237,4237,5,4253,4253,5,4957,4959,5,5906,5908,5,5938,5939,5,5970,5971,5,6002,6003,5,6068,6069,5,6071,6077,5,6086,6086,5,6089,6099,5,6109,6109,5,6151,6151,3,6154,6154,4,6155,6157,5,6159,6159,5,6176,6264,3,6277,6278,5,6279,6312,3,6313,6313,5,6314,6314,3,6432,6434,5,6439,6440,5,6450,6450,5,6457,6459,5,6679,6680,5,6683,6683,5,6742,6742,5,6744,6750,5,6752,6752,5,6754,6754,5,6757,6764,5,6771,6780,5,6783,6783,5,6832,6862,5,6912,6915,5,6964,6964,5,6966,6970,5,6972,6972,5,6978,6978,5,7019,7027,5,7040,7041,5,7074,7077,5,7080,7081,5,7083,7085,5,7142,7142,5,7144,7145,5,7149,7149,5,7151,7153,5,7212,7219,5,7222,7223,5,7376,7378,5,7380,7392,5,7394,7400,5,7405,7405,5,7412,7412,5,7416,7417,5,7616,7679,5,8203,8203,5,8205,8205,4,8206,8207,5,8234,8238,5,8288,8292,5,8298,8303,5,8400,8432,5,11503,11505,5,11647,11647,5,11744,11775,5,12330,12333,5,12441,12442,5,42607,42610,5,42612,42621,5,42654,42655,5,42736,42737,5,43010,43010,5,43014,43014,5,43019,43019,5,43045,43046,5,43052,43052,5,43072,43121,3,43122,43122,1,43204,43205,5,43232,43249,5,43263,43263,5,43302,43309,5,43335,43345,5,43392,43394,5,43443,43443,5,43446,43449,5,43452,43453,5,43493,43493,5,43561,43566,5,43569,43570,5,43573,43574,5,43587,43587,5,43596,43596,5,43644,43644,5,43696,43696,5,43698,43700,5,43703,43704,5,43710,43711,5,43713,43713,5,43756,43757,5,43766,43766,5,44005,44005,5,44008,44008,5,44013,44013,5,64286,64286,5,65024,65039,5,65056,65071,5,65279,65279,5,65529,65531,5,66045,66045,5,66272,66272,5,66422,66426,5,68097,68099,5,68101,68102,5,68108,68111,5,68152,68154,5,68159,68159,5,68288,68292,3,68293,68293,2,68295,68295,2,68297,68298,2,68301,68301,1,68302,68306,2,68307,68310,3,68311,68311,1,68312,68316,3,68317,68317,2,68318,68320,3,68321,68321,2,68324,68324,2,68325,68326,5,68331,68334,3,68335,68335,2,68480,68480,3,68481,68481,2,68482,68482,3,68483,68485,2,68486,68488,3,68489,68489,2,68490,68491,3,68492,68492,2,68493,68493,3,68494,68495,2,68496,68496,3,68497,68497,2,68521,68524,2,68525,68526,3,68864,68864,1,68865,68897,3,68898,68898,2,68899,68899,3,68900,68903,5,68969,68973,5,69291,69292,5,69314,69314,2,69315,69316,3,69372,69375,5,69424,69426,3,69427,69427,2,69428,69444,3,69446,69456,5,69457,69459,3,69460,69460,2,69488,69491,3,69492,69493,2,69494,69505,3,69506,69509,5,69552,69552,3,69554,69555,3,69556,69558,2,69560,69560,3,69561,69562,2,69563,69564,3,69565,69565,2,69566,69567,3,69569,69569,3,69570,69571,2,69572,69572,3,69577,69577,2,69578,69578,3,69579,69579,1,69633,69633,5,69688,69702,5,69744,69744,5,69747,69748,5,69759,69761,5,69811,69814,5,69817,69818,5,69826,69826,5,69888,69890,5,69927,69931,5,69933,69940,5,70003,70003,5,70016,70017,5,70070,70078,5,70089,70092,5,70095,70095,5,70191,70193,5,70196,70196,5,70198,70199,5,70206,70206,5,70209,70209,5,70367,70367,5,70371,70378,5,70400,70401,5,70459,70460,5,70464,70464,5,70502,70508,5,70512,70516,5,70587,70592,5,70606,70606,5,70608,70608,5,70610,70610,5,70625,70626,5,70712,70719,5,70722,70724,5,70726,70726,5,70750,70750,5,70835,70840,5,70842,70842,5,70847,70848,5,70850,70851,5,71090,71093,5,71100,71101,5,71103,71104,5,71132,71133,5,71219,71226,5,71229,71229,5,71231,71232,5,71339,71339,5,71341,71341,5,71344,71349,5,71351,71351,5,71453,71453,5,71455,71455,5,71458,71461,5,71463,71467,5,71727,71735,5,71737,71738,5,71995,71996,5,71998,71998,5,72003,72003,5,72148,72151,5,72154,72155,5,72160,72160,5,72193,72202,5,72243,72248,5,72251,72254,5,72263,72263,5,72273,72278,5,72281,72283,5,72330,72342,5,72344,72345,5,72752,72758,5,72760,72765,5,72767,72767,5,72850,72871,5,72874,72880,5,72882,72883,5,72885,72886,5,73009,73014,5,73018,73018,5,73020,73021,5,73023,73029,5,73031,73031,5,73104,73105,5,73109,73109,5,73111,73111,5,73459,73460,5,73472,73473,5,73526,73530,5,73536,73536,5,73538,73538,5,73562,73562,5,78896,78912,5,78919,78933,5,90398,90409,5,90413,90415,5,92912,92916,5,92976,92982,5,94031,94031,5,94095,94098,5,94180,94180,5,113821,113822,5,113824,113827,5,118528,118573,5,118576,118598,5,119143,119145,5,119155,119170,5,119173,119179,5,119210,119213,5,119362,119364,5,121344,121398,5,121403,121452,5,121461,121461,5,121476,121476,5,121499,121503,5,121505,121519,5,122880,122886,5,122888,122904,5,122907,122913,5,122915,122916,5,122918,122922,5,123023,123023,5,123184,123190,5,123566,123566,5,123628,123631,5,124140,124143,5,124398,124399,5,125136,125142,5,125184,125251,3,125252,125259,5,917505,917505,5,917536,917631,5,917760,917999,5],t.t)
B.co=s(["a","b","c"],t.s)
B.D=new A.aO(0,"round")
B.E=new A.aO(1,"bevel")
B.t=new A.aO(2,"miter")
B.S=new A.aO(3,"none")
B.F=new A.aO(4,"fakeround")
B.T=new A.aO(5,"flipbevel")
B.G=new A.aO(6,"butt")
B.U=new A.aO(7,"square")
B.a5=s([B.D,B.E,B.t,B.S,B.F,B.T,B.G,B.U],A.af("k<aO>"))
B.J=s([],t.J)
B.cq=s([],t.dY)
B.cp=s([],t.e)
B.a6=s([],t.D)
B.cA=s([],t.i9)
B.A=s([],t.r)
B.K=s([],t.w)
B.cB=s([],A.af("k<tz>"))
B.cC=s([],t.Q)
B.cD=s([],t.q)
B.cw=s([],t.ez)
B.cr=s([],t.lE)
B.cu=s([],t.m1)
B.cs=s([],t.kR)
B.a9=s([],t.s)
B.cy=s([],t.cb)
B.a7=s([],t.n5)
B.L=s([],A.af("k<bF>"))
B.cv=s([],t.bD)
B.ct=s([],t.n)
B.m=s([],t.t)
B.cx=s([],t.dG)
B.a8=s([],t.dM)
B.z=s([],t.bU)
B.d3=new A.z(11,1)
B.d4=new A.z(12,0)
B.cE=s([B.d3,B.d4],t.I)
B.cF=s([768,788,230,789,789,232,790,793,220,794,794,232,795,795,216,796,800,220,801,802,202,803,806,220,807,808,202,809,819,220,820,824,1,825,828,220,829,836,230,837,837,240,838,838,230,839,841,220,842,844,230,845,846,220,848,850,230,851,854,220,855,855,230,856,856,232,857,858,220,859,859,230,860,860,233,861,862,234,863,863,233,864,865,234,866,866,233,867,879,230,1155,1159,230,1425,1425,220,1426,1429,230,1430,1430,220,1431,1433,230,1434,1434,222,1435,1435,220,1436,1441,230,1442,1447,220,1448,1449,230,1450,1450,220,1451,1452,230,1453,1453,222,1454,1454,228,1455,1455,230,1456,1456,10,1457,1457,11,1458,1458,12,1459,1459,13,1460,1460,14,1461,1461,15,1462,1462,16,1463,1463,17,1464,1464,18,1465,1466,19,1467,1467,20,1468,1468,21,1469,1469,22,1471,1471,23,1473,1473,24,1474,1474,25,1476,1476,230,1477,1477,220,1479,1479,18,1552,1559,230,1560,1560,30,1561,1561,31,1562,1562,32,1611,1611,27,1612,1612,28,1613,1613,29,1614,1614,30,1615,1615,31,1616,1616,32,1617,1617,33,1618,1618,34,1619,1620,230,1621,1622,220,1623,1627,230,1628,1628,220,1629,1630,230,1631,1631,220,1648,1648,35,1750,1756,230,1759,1762,230,1763,1763,220,1764,1764,230,1767,1768,230,1770,1770,220,1771,1772,230,1773,1773,220,1809,1809,36,1840,1840,230,1841,1841,220,1842,1843,230,1844,1844,220,1845,1846,230,1847,1849,220,1850,1850,230,1851,1852,220,1853,1853,230,1854,1854,220,1855,1857,230,1858,1858,220,1859,1859,230,1860,1860,220,1861,1861,230,1862,1862,220,1863,1863,230,1864,1864,220,1865,1866,230,2027,2033,230,2034,2034,220,2035,2035,230,2045,2045,220,2070,2073,230,2075,2083,230,2085,2087,230,2089,2093,230,2137,2139,220,2199,2200,230,2201,2203,220,2204,2207,230,2250,2254,230,2255,2259,220,2260,2273,230,2275,2275,220,2276,2277,230,2278,2278,220,2279,2280,230,2281,2281,220,2282,2284,230,2285,2287,220,2288,2288,27,2289,2289,28,2290,2290,29,2291,2293,230,2294,2294,220,2295,2296,230,2297,2298,220,2299,2303,230,2364,2364,7,2381,2381,9,2385,2385,230,2386,2386,220,2387,2388,230,2492,2492,7,2509,2509,9,2558,2558,230,2620,2620,7,2637,2637,9,2748,2748,7,2765,2765,9,2876,2876,7,2893,2893,9,3021,3021,9,3132,3132,7,3149,3149,9,3157,3157,84,3158,3158,91,3260,3260,7,3277,3277,9,3387,3388,9,3405,3405,9,3530,3530,9,3640,3641,103,3642,3642,9,3656,3659,107,3768,3769,118,3770,3770,9,3784,3787,122,3864,3865,220,3893,3893,220,3895,3895,220,3897,3897,216,3953,3953,129,3954,3954,130,3956,3956,132,3962,3965,130,3968,3968,130,3970,3971,230,3972,3972,9,3974,3975,230,4038,4038,220,4151,4151,7,4153,4154,9,4237,4237,220,4957,4959,230,5908,5909,9,5940,5940,9,6098,6098,9,6109,6109,230,6313,6313,228,6457,6457,222,6458,6458,230,6459,6459,220,6679,6679,230,6680,6680,220,6752,6752,9,6773,6780,230,6783,6783,220,6832,6836,230,6837,6842,220,6843,6844,230,6845,6845,220,6847,6848,220,6849,6850,230,6851,6852,220,6853,6857,230,6858,6858,220,6859,6862,230,6964,6964,7,6980,6980,9,7019,7019,230,7020,7020,220,7021,7027,230,7082,7083,9,7142,7142,7,7154,7155,9,7223,7223,7,7376,7378,230,7380,7380,1,7381,7385,220,7386,7387,230,7388,7391,220,7392,7392,230,7394,7400,1,7405,7405,220,7412,7412,230,7416,7417,230,7616,7617,230,7618,7618,220,7619,7625,230,7626,7626,220,7627,7628,230,7629,7629,234,7630,7630,214,7631,7631,220,7632,7632,202,7633,7669,230,7670,7670,232,7671,7672,228,7673,7673,220,7674,7674,218,7675,7675,230,7676,7676,233,7677,7677,220,7678,7678,230,7679,7679,220,8400,8401,230,8402,8403,1,8404,8407,230,8408,8410,1,8411,8412,230,8417,8417,230,8421,8422,1,8423,8423,230,8424,8424,220,8425,8425,230,8426,8427,1,8428,8431,220,8432,8432,230,11503,11505,230,11647,11647,9,11744,11775,230,12330,12330,218,12331,12331,228,12332,12332,232,12333,12333,222,12334,12335,224,12441,12442,8,42607,42607,230,42612,42621,230,42654,42655,230,42736,42737,230,43014,43014,9,43052,43052,9,43204,43204,9,43232,43249,230,43307,43309,220,43347,43347,9,43443,43443,7,43456,43456,9,43696,43696,230,43698,43699,230,43700,43700,220,43703,43704,230,43710,43711,230,43713,43713,230,43766,43766,9,44013,44013,9,64286,64286,26,65056,65062,230,65063,65069,220,65070,65071,230,66045,66045,220,66272,66272,220,66422,66426,230,68109,68109,220,68111,68111,230,68152,68152,230,68153,68153,1,68154,68154,220,68159,68159,9,68325,68325,230,68326,68326,220,68900,68903,230,68969,68973,230,69291,69292,230,69373,69375,220,69446,69447,220,69448,69450,230,69451,69451,220,69452,69452,230,69453,69456,220,69506,69506,230,69507,69507,220,69508,69508,230,69509,69509,220,69702,69702,9,69744,69744,9,69759,69759,9,69817,69817,9,69818,69818,7,69888,69890,230,69939,69940,9,70003,70003,7,70080,70080,9,70090,70090,7,70197,70197,9,70198,70198,7,70377,70377,7,70378,70378,9,70459,70460,7,70477,70477,9,70502,70508,230,70512,70516,230,70606,70608,9,70722,70722,9,70726,70726,7,70750,70750,230,70850,70850,9,70851,70851,7,71103,71103,9,71104,71104,7,71231,71231,9,71350,71350,9,71351,71351,7,71467,71467,9,71737,71737,9,71738,71738,7,71997,71998,9,72003,72003,7,72160,72160,9,72244,72244,9,72263,72263,9,72345,72345,9,72767,72767,9,73026,73026,7,73028,73029,9,73111,73111,9,73537,73538,9,90415,90415,9,92912,92916,1,92976,92982,230,94192,94193,6,113822,113822,1,119141,119142,216,119143,119145,1,119149,119149,226,119150,119154,216,119163,119170,220,119173,119177,230,119178,119179,220,119210,119213,230,119362,119364,230,122880,122886,230,122888,122904,230,122907,122913,230,122915,122916,230,122918,122922,230,123023,123023,230,123184,123190,230,123566,123566,230,123628,123631,230,124140,124141,232,124142,124142,220,124143,124143,230,124398,124398,230,124399,124399,220,125136,125142,220,125252,125257,230,125258,125258,7],t.t)
B.M=s(["Unknown","Adlam","Ahom","Anatolian_Hieroglyphs","Arabic","Armenian","Avestan","Balinese","Bamum","Bassa_Vah","Batak","Bengali","Bhaiksuki","Bopomofo","Brahmi","Braille","Buginese","Buhid","Canadian_Aboriginal","Carian","Caucasian_Albanian","Chakma","Cham","Cherokee","Chorasmian","Common","Coptic","Cuneiform","Cypriot","Cypro_Minoan","Cyrillic","Deseret","Devanagari","Dives_Akuru","Dogra","Duployan","Egyptian_Hieroglyphs","Elbasan","Elymaic","Ethiopic","Garay","Georgian","Glagolitic","Gothic","Grantha","Greek","Gujarati","Gunjala_Gondi","Gurmukhi","Gurung_Khema","Han","Hangul","Hanifi_Rohingya","Hanunoo","Hatran","Hebrew","Hiragana","Imperial_Aramaic","Inherited","Inscriptional_Pahlavi","Inscriptional_Parthian","Javanese","Kaithi","Kannada","Katakana","Kawi","Kayah_Li","Kharoshthi","Khitan_Small_Script","Khmer","Khojki","Khudawadi","Kirat_Rai","Lao","Latin","Lepcha","Limbu","Linear_A","Linear_B","Lisu","Lycian","Lydian","Mahajani","Makasar","Malayalam","Mandaic","Manichaean","Marchen","Masaram_Gondi","Medefaidrin","Meetei_Mayek","Mende_Kikakui","Meroitic_Cursive","Meroitic_Hieroglyphs","Miao","Modi","Mongolian","Mro","Multani","Myanmar","Nabataean","Nag_Mundari","Nandinagari","New_Tai_Lue","Newa","Nko","Nushu","Nyiakeng_Puachue_Hmong","Ogham","Ol_Chiki","Ol_Onal","Old_Hungarian","Old_Italic","Old_North_Arabian","Old_Permic","Old_Persian","Old_Sogdian","Old_South_Arabian","Old_Turkic","Old_Uyghur","Oriya","Osage","Osmanya","Pahawh_Hmong","Palmyrene","Pau_Cin_Hau","Phags_Pa","Phoenician","Psalter_Pahlavi","Rejang","Runic","Samaritan","Saurashtra","Sharada","Shavian","Siddham","SignWriting","Sinhala","Sogdian","Sora_Sompeng","Soyombo","Sundanese","Sunuwar","Syloti_Nagri","Syriac","Tagalog","Tagbanwa","Tai_Le","Tai_Tham","Tai_Viet","Takri","Tamil","Tangsa","Tangut","Telugu","Thaana","Thai","Tibetan","Tifinagh","Tirhuta","Todhri","Toto","Tulu_Tigalari","Ugaritic","Vai","Vithkuqi","Wancho","Warang_Citi","Yezidi","Yi","Zanabazar_Square"],t.s)
B.cG=s([0,8,9,9,9,11,10,10,10,11,11,11,12,12,12,13,13,10,14,27,9,28,30,10,31,31,11,32,32,12,33,34,13,35,37,5,38,42,13,43,43,4,44,44,7,45,45,4,46,47,7,48,57,3,58,58,7,59,64,13,91,96,13,123,126,13,127,132,9,133,133,10,134,159,9,160,160,7,161,161,13,162,165,5,166,169,13,171,172,13,173,173,9,174,175,13,176,177,5,178,179,3,180,180,13,182,184,13,185,185,3,187,191,13,215,215,13,247,247,13,697,698,13,706,719,13,722,735,13,741,749,13,751,767,13,768,879,8,884,885,13,894,894,13,900,901,13,903,903,13,1014,1014,13,1155,1161,8,1418,1418,13,1421,1422,13,1423,1423,5,1424,1424,1,1425,1469,8,1470,1470,1,1471,1471,8,1472,1472,1,1473,1474,8,1475,1475,1,1476,1477,8,1478,1478,1,1479,1479,8,1480,1535,1,1536,1541,6,1542,1543,13,1544,1544,2,1545,1546,5,1547,1547,2,1548,1548,7,1549,1549,2,1550,1551,13,1552,1562,8,1563,1610,2,1611,1631,8,1632,1641,6,1642,1642,5,1643,1644,6,1645,1647,2,1648,1648,8,1649,1749,2,1750,1756,8,1757,1757,6,1758,1758,13,1759,1764,8,1765,1766,2,1767,1768,8,1769,1769,13,1770,1773,8,1774,1775,2,1776,1785,3,1786,1808,2,1809,1809,8,1810,1839,2,1840,1866,8,1867,1957,2,1958,1968,8,1969,1983,2,1984,2026,1,2027,2035,8,2036,2037,1,2038,2041,13,2042,2044,1,2045,2045,8,2046,2069,1,2070,2073,8,2074,2074,1,2075,2083,8,2084,2084,1,2085,2087,8,2088,2088,1,2089,2093,8,2094,2136,1,2137,2139,8,2140,2143,1,2144,2191,2,2192,2193,6,2194,2198,2,2199,2207,8,2208,2249,2,2250,2273,8,2274,2274,6,2275,2306,8,2362,2362,8,2364,2364,8,2369,2376,8,2381,2381,8,2385,2391,8,2402,2403,8,2433,2433,8,2492,2492,8,2497,2500,8,2509,2509,8,2530,2531,8,2546,2547,5,2555,2555,5,2558,2558,8,2561,2562,8,2620,2620,8,2625,2626,8,2631,2632,8,2635,2637,8,2641,2641,8,2672,2673,8,2677,2677,8,2689,2690,8,2748,2748,8,2753,2757,8,2759,2760,8,2765,2765,8,2786,2787,8,2801,2801,5,2810,2815,8,2817,2817,8,2876,2876,8,2879,2879,8,2881,2884,8,2893,2893,8,2901,2902,8,2914,2915,8,2946,2946,8,3008,3008,8,3021,3021,8,3059,3064,13,3065,3065,5,3066,3066,13,3072,3072,8,3076,3076,8,3132,3132,8,3134,3136,8,3142,3144,8,3146,3149,8,3157,3158,8,3170,3171,8,3192,3198,13,3201,3201,8,3260,3260,8,3276,3277,8,3298,3299,8,3328,3329,8,3387,3388,8,3393,3396,8,3405,3405,8,3426,3427,8,3457,3457,8,3530,3530,8,3538,3540,8,3542,3542,8,3633,3633,8,3636,3642,8,3647,3647,5,3655,3662,8,3761,3761,8,3764,3772,8,3784,3790,8,3864,3865,8,3893,3893,8,3895,3895,8,3897,3897,8,3898,3901,13,3953,3966,8,3968,3972,8,3974,3975,8,3981,3991,8,3993,4028,8,4038,4038,8,4141,4144,8,4146,4151,8,4153,4154,8,4157,4158,8,4184,4185,8,4190,4192,8,4209,4212,8,4226,4226,8,4229,4230,8,4237,4237,8,4253,4253,8,4957,4959,8,5008,5017,13,5120,5120,13,5760,5760,12,5787,5788,13,5906,5908,8,5938,5939,8,5970,5971,8,6002,6003,8,6068,6069,8,6071,6077,8,6086,6086,8,6089,6099,8,6107,6107,5,6109,6109,8,6128,6137,13,6144,6154,13,6155,6157,8,6158,6158,9,6159,6159,8,6277,6278,8,6313,6313,8,6432,6434,8,6439,6440,8,6450,6450,8,6457,6459,8,6464,6464,13,6468,6469,13,6622,6655,13,6679,6680,8,6683,6683,8,6742,6742,8,6744,6750,8,6752,6752,8,6754,6754,8,6757,6764,8,6771,6780,8,6783,6783,8,6832,6862,8,6912,6915,8,6964,6964,8,6966,6970,8,6972,6972,8,6978,6978,8,7019,7027,8,7040,7041,8,7074,7077,8,7080,7081,8,7083,7085,8,7142,7142,8,7144,7145,8,7149,7149,8,7151,7153,8,7212,7219,8,7222,7223,8,7376,7378,8,7380,7392,8,7394,7400,8,7405,7405,8,7412,7412,8,7416,7417,8,7616,7679,8,8125,8125,13,8127,8129,13,8141,8143,13,8157,8159,13,8173,8175,13,8189,8190,13,8192,8202,12,8203,8205,9,8207,8207,1,8208,8231,13,8232,8232,12,8233,8233,10,8234,8234,14,8235,8235,15,8236,8236,18,8237,8237,16,8238,8238,17,8239,8239,7,8240,8244,5,8245,8259,13,8260,8260,7,8261,8286,13,8287,8287,12,8288,8292,9,8294,8294,19,8295,8295,20,8296,8296,21,8297,8297,22,8298,8303,9,8304,8304,3,8308,8313,3,8314,8315,4,8316,8318,13,8320,8329,3,8330,8331,4,8332,8334,13,8352,8399,5,8400,8432,8,8448,8449,13,8451,8454,13,8456,8457,13,8468,8468,13,8470,8472,13,8478,8483,13,8485,8485,13,8487,8487,13,8489,8489,13,8494,8494,5,8506,8507,13,8512,8516,13,8522,8525,13,8528,8543,13,8585,8587,13,8592,8721,13,8722,8722,4,8723,8723,5,8724,9013,13,9083,9108,13,9110,9257,13,9280,9290,13,9312,9351,13,9352,9371,3,9450,9899,13,9901,10239,13,10496,11123,13,11126,11157,13,11159,11263,13,11493,11498,13,11503,11505,8,11513,11519,13,11647,11647,8,11744,11775,8,11776,11869,13,11904,11929,13,11931,12019,13,12032,12245,13,12272,12287,13,12288,12288,12,12289,12292,13,12296,12320,13,12330,12333,8,12336,12336,13,12342,12343,13,12349,12351,13,12441,12442,8,12443,12444,13,12448,12448,13,12539,12539,13,12736,12773,13,12783,12783,13,12829,12830,13,12880,12895,13,12924,12926,13,12977,12991,13,13004,13007,13,13175,13178,13,13278,13279,13,13311,13311,13,19904,19967,13,42128,42182,13,42509,42511,13,42607,42610,8,42611,42611,13,42612,42621,8,42622,42623,13,42654,42655,8,42736,42737,8,42752,42785,13,42888,42888,13,43010,43010,8,43014,43014,8,43019,43019,8,43045,43046,8,43048,43051,13,43052,43052,8,43064,43065,5,43124,43127,13,43204,43205,8,43232,43249,8,43263,43263,8,43302,43309,8,43335,43345,8,43392,43394,8,43443,43443,8,43446,43449,8,43452,43453,8,43493,43493,8,43561,43566,8,43569,43570,8,43573,43574,8,43587,43587,8,43596,43596,8,43644,43644,8,43696,43696,8,43698,43700,8,43703,43704,8,43710,43711,8,43713,43713,8,43756,43757,8,43766,43766,8,43882,43883,13,44005,44005,8,44008,44008,8,44013,44013,8,64285,64285,1,64286,64286,8,64287,64296,1,64297,64297,4,64298,64335,1,64336,64829,2,64830,64847,13,64848,64974,2,64975,64975,13,65008,65020,2,65021,65023,13,65024,65039,8,65040,65049,13,65056,65071,8,65072,65103,13,65104,65104,7,65105,65105,13,65106,65106,7,65108,65108,13,65109,65109,7,65110,65118,13,65119,65119,5,65120,65121,13,65122,65123,4,65124,65126,13,65128,65128,13,65129,65130,5,65131,65131,13,65136,65278,2,65279,65279,9,65281,65282,13,65283,65285,5,65286,65290,13,65291,65291,4,65292,65292,7,65293,65293,4,65294,65295,7,65296,65305,3,65306,65306,7,65307,65312,13,65339,65344,13,65371,65381,13,65504,65505,5,65506,65508,13,65509,65510,5,65512,65518,13,65529,65533,13,65793,65793,13,65856,65932,13,65936,65948,13,65952,65952,13,66045,66045,8,66272,66272,8,66273,66299,3,66422,66426,8,67584,67870,1,67871,67871,13,67872,68096,1,68097,68099,8,68100,68100,1,68101,68102,8,68103,68107,1,68108,68111,8,68112,68151,1,68152,68154,8,68155,68158,1,68159,68159,8,68160,68324,1,68325,68326,8,68327,68408,1,68409,68415,13,68416,68863,1,68864,68899,2,68900,68903,8,68904,68911,2,68912,68921,6,68922,68927,2,68928,68937,6,68938,68968,1,68969,68973,8,68974,68974,13,68975,69215,1,69216,69246,6,69247,69290,1,69291,69292,8,69293,69311,1,69312,69371,2,69372,69375,8,69376,69423,1,69424,69445,2,69446,69456,8,69457,69487,2,69488,69505,1,69506,69509,8,69510,69631,1,69633,69633,8,69688,69702,8,69714,69733,13,69744,69744,8,69747,69748,8,69759,69761,8,69811,69814,8,69817,69818,8,69826,69826,8,69888,69890,8,69927,69931,8,69933,69940,8,70003,70003,8,70016,70017,8,70070,70078,8,70089,70092,8,70095,70095,8,70191,70193,8,70196,70196,8,70198,70199,8,70206,70206,8,70209,70209,8,70367,70367,8,70371,70378,8,70400,70401,8,70459,70460,8,70464,70464,8,70502,70508,8,70512,70516,8,70587,70592,8,70606,70606,8,70608,70608,8,70610,70610,8,70625,70626,8,70712,70719,8,70722,70724,8,70726,70726,8,70750,70750,8,70835,70840,8,70842,70842,8,70847,70848,8,70850,70851,8,71090,71093,8,71100,71101,8,71103,71104,8,71132,71133,8,71219,71226,8,71229,71229,8,71231,71232,8,71264,71276,13,71339,71339,8,71341,71341,8,71344,71349,8,71351,71351,8,71453,71453,8,71455,71455,8,71458,71461,8,71463,71467,8,71727,71735,8,71737,71738,8,71995,71996,8,71998,71998,8,72003,72003,8,72148,72151,8,72154,72155,8,72160,72160,8,72193,72198,8,72201,72202,8,72243,72248,8,72251,72254,8,72263,72263,8,72273,72278,8,72281,72283,8,72330,72342,8,72344,72345,8,72752,72758,8,72760,72765,8,72850,72871,8,72874,72880,8,72882,72883,8,72885,72886,8,73009,73014,8,73018,73018,8,73020,73021,8,73023,73029,8,73031,73031,8,73104,73105,8,73109,73109,8,73111,73111,8,73459,73460,8,73472,73473,8,73526,73530,8,73536,73536,8,73538,73538,8,73562,73562,8,73685,73692,13,73693,73696,5,73697,73713,13,78912,78912,8,78919,78933,8,90398,90409,8,90413,90415,8,92912,92916,8,92976,92982,8,94031,94031,8,94095,94098,8,94178,94178,13,94180,94180,8,113821,113822,8,113824,113827,9,117760,117973,13,118e3,118009,3,118016,118451,13,118528,118573,8,118576,118598,8,119143,119145,8,119155,119162,9,119163,119170,8,119173,119179,8,119210,119213,8,119273,119274,13,119296,119361,13,119362,119364,8,119365,119365,13,119552,119638,13,120513,120513,13,120539,120539,13,120571,120571,13,120597,120597,13,120629,120629,13,120655,120655,13,120687,120687,13,120713,120713,13,120745,120745,13,120771,120771,13,120782,120831,3,121344,121398,8,121403,121452,8,121461,121461,8,121476,121476,8,121499,121503,8,121505,121519,8,122880,122886,8,122888,122904,8,122907,122913,8,122915,122916,8,122918,122922,8,123023,123023,8,123184,123190,8,123566,123566,8,123628,123631,8,123647,123647,5,124140,124143,8,124398,124399,8,124928,125135,1,125136,125142,8,125143,125251,1,125252,125258,8,125259,126063,1,126064,126143,2,126144,126207,1,126208,126287,2,126288,126463,1,126464,126703,2,126704,126705,13,126706,126719,2,126720,126975,1,126976,127019,13,127024,127123,13,127136,127150,13,127153,127167,13,127169,127183,13,127185,127221,13,127232,127242,3,127243,127247,13,127279,127279,13,127338,127343,13,127405,127405,13,127584,127589,13,127744,128727,13,128732,128748,13,128752,128764,13,128768,128886,13,128891,128985,13,128992,129003,13,129008,129008,13,129024,129035,13,129040,129095,13,129104,129113,13,129120,129159,13,129168,129197,13,129200,129211,13,129216,129217,13,129280,129619,13,129632,129645,13,129648,129660,13,129664,129673,13,129679,129734,13,129742,129756,13,129759,129769,13,129776,129784,13,129792,129938,13,129940,130031,13,130032,130041,3,917505,917505,9,917536,917631,9,917760,917999,8],t.t)
B.aa=s(["linear"],t.s)
B.cH=s([1667329140,1668049255,1668641395,1684632436,1801810542,1818847073,1919118452],t.t)
B.cI=s(["fill-outline-color","fill-opacity"],t.s)
B.cJ=s([40,40,165,41,41,162,91,91,373,93,93,366,123,123,501,125,125,494,3898,3898,15597,3899,3899,15594,3900,3900,15605,3901,3901,15602,5787,5787,23153,5788,5788,23150,8261,8261,33049,8262,8262,33046,8317,8317,33273,8318,8318,33270,8333,8333,33337,8334,8334,33334,8968,8968,35877,8969,8969,35874,8970,8970,35885,8971,8971,35882,9001,9001,36009,9002,9002,36006,10088,10088,40357,10089,10089,40354,10090,10090,40365,10091,10091,40362,10092,10092,40373,10093,10093,40370,10094,10094,40381,10095,10095,40378,10096,10096,40389,10097,10097,40386,10098,10098,40397,10099,10099,40394,10100,10100,40405,10101,10101,40402,10181,10181,40729,10182,10182,40726,10214,10214,40861,10215,10215,40858,10216,10216,40869,10217,10217,40866,10218,10218,40877,10219,10219,40874,10220,10220,40885,10221,10221,40882,10222,10222,40893,10223,10223,40890,10627,10627,42513,10628,10628,42510,10629,10629,42521,10630,10630,42518,10631,10631,42529,10632,10632,42526,10633,10633,42537,10634,10634,42534,10635,10635,42545,10636,10636,42542,10637,10637,42561,10638,10638,42558,10639,10639,42553,10640,10640,42550,10641,10641,42569,10642,10642,42566,10643,10643,42577,10644,10644,42574,10645,10645,42585,10646,10646,42582,10647,10647,42593,10648,10648,42590,10712,10712,42853,10713,10713,42850,10714,10714,42861,10715,10715,42858,10748,10748,42997,10749,10749,42994,11810,11810,47245,11811,11811,47242,11812,11812,47253,11813,11813,47250,11814,11814,47261,11815,11815,47258,11816,11816,47269,11817,11817,47266,11861,11861,47449,11862,11862,47446,11863,11863,47457,11864,11864,47454,11865,11865,47465,11866,11866,47462,11867,11867,47473,11868,11868,47470,12296,12296,49189,12297,12297,49186,12298,12298,49197,12299,12299,49194,12300,12300,49205,12301,12301,49202,12302,12302,49213,12303,12303,49210,12304,12304,49221,12305,12305,49218,12308,12308,49237,12309,12309,49234,12310,12310,49245,12311,12311,49242,12312,12312,49253,12313,12313,49250,12314,12314,49261,12315,12315,49258,65113,65113,260457,65114,65114,260454,65115,65115,260465,65116,65116,260462,65117,65117,260473,65118,65118,260470,65288,65288,261157,65289,65289,261154,65339,65339,261365,65341,65341,261358,65371,65371,261493,65373,65373,261486,65375,65375,261505,65376,65376,261502,65378,65378,261517,65379,65379,261514],t.t)
B.cK=s(["circle-color","circle-opacity","circle-radius","circle-stroke-color","circle-stroke-width","circle-stroke-opacity","circle-blur"],t.s)
B.cL=s([0,1,2,0,2,3],t.t)
B.cN=s(["heatmap-density"],t.s)
B.cM=s(["interpolate",B.aa,B.cN,0,"rgba(0, 0, 255, 0)",0.1,"royalblue",0.3,"cyan",0.5,"lime",0.7,"yellow",1,"red"],t.G)
B.cO=s([0,47,6,48,57,4,58,172,6,173,173,5,174,767,6,768,879,1,880,887,6,890,895,6,900,906,6,908,908,6,910,929,6,931,1154,6,1155,1159,1,1160,1161,3,1162,1327,6,1329,1366,6,1369,1418,6,1421,1423,6,1425,1469,1,1470,1470,6,1471,1471,1,1472,1472,6,1473,1474,1,1475,1475,6,1476,1477,1,1478,1478,6,1479,1479,1,1488,1514,6,1519,1524,6,1536,1541,5,1542,1551,6,1552,1562,1,1563,1563,6,1564,1564,5,1565,1610,6,1611,1631,1,1632,1641,4,1642,1647,6,1648,1648,1,1649,1749,6,1750,1756,1,1757,1757,5,1758,1758,6,1759,1764,1,1765,1766,6,1767,1768,1,1769,1769,6,1770,1773,1,1774,1775,6,1776,1785,4,1786,1805,6,1807,1807,5,1808,1808,6,1809,1809,1,1810,1839,6,1840,1866,1,1869,1957,6,1958,1968,1,1969,1969,6,1984,1993,4,1994,2026,6,2027,2035,1,2036,2042,6,2045,2045,1,2046,2069,6,2070,2073,1,2074,2074,6,2075,2083,1,2084,2084,6,2085,2087,1,2088,2088,6,2089,2093,1,2096,2110,6,2112,2136,6,2137,2139,1,2142,2142,6,2144,2154,6,2160,2190,6,2192,2193,5,2199,2207,1,2208,2249,6,2250,2273,1,2274,2274,5,2275,2306,1,2307,2307,2,2308,2361,6,2362,2362,1,2363,2363,2,2364,2364,1,2365,2365,6,2366,2368,2,2369,2376,1,2377,2380,2,2381,2381,1,2382,2383,2,2384,2384,6,2385,2391,1,2392,2401,6,2402,2403,1,2404,2405,6,2406,2415,4,2416,2432,6,2433,2433,1,2434,2435,2,2437,2444,6,2447,2448,6,2451,2472,6,2474,2480,6,2482,2482,6,2486,2489,6,2492,2492,1,2493,2493,6,2494,2496,2,2497,2500,1,2503,2504,2,2507,2508,2,2509,2509,1,2510,2510,6,2519,2519,2,2524,2525,6,2527,2529,6,2530,2531,1,2534,2543,4,2544,2557,6,2558,2558,1,2561,2562,1,2563,2563,2,2565,2570,6,2575,2576,6,2579,2600,6,2602,2608,6,2610,2611,6,2613,2614,6,2616,2617,6,2620,2620,1,2622,2624,2,2625,2626,1,2631,2632,1,2635,2637,1,2641,2641,1,2649,2652,6,2654,2654,6,2662,2671,4,2672,2673,1,2674,2676,6,2677,2677,1,2678,2678,6,2689,2690,1,2691,2691,2,2693,2701,6,2703,2705,6,2707,2728,6,2730,2736,6,2738,2739,6,2741,2745,6,2748,2748,1,2749,2749,6,2750,2752,2,2753,2757,1,2759,2760,1,2761,2761,2,2763,2764,2,2765,2765,1,2768,2768,6,2784,2785,6,2786,2787,1,2790,2799,4,2800,2801,6,2809,2809,6,2810,2815,1,2817,2817,1,2818,2819,2,2821,2828,6,2831,2832,6,2835,2856,6,2858,2864,6,2866,2867,6,2869,2873,6,2876,2876,1,2877,2877,6,2878,2878,2,2879,2879,1,2880,2880,2,2881,2884,1,2887,2888,2,2891,2892,2,2893,2893,1,2901,2902,1,2903,2903,2,2908,2909,6,2911,2913,6,2914,2915,1,2918,2927,4,2928,2935,6,2946,2946,1,2947,2947,6,2949,2954,6,2958,2960,6,2962,2965,6,2969,2970,6,2972,2972,6,2974,2975,6,2979,2980,6,2984,2986,6,2990,3001,6,3006,3007,2,3008,3008,1,3009,3010,2,3014,3016,2,3018,3020,2,3021,3021,1,3024,3024,6,3031,3031,2,3046,3055,4,3056,3066,6,3072,3072,1,3073,3075,2,3076,3076,1,3077,3084,6,3086,3088,6,3090,3112,6,3114,3129,6,3132,3132,1,3133,3133,6,3134,3136,1,3137,3140,2,3142,3144,1,3146,3149,1,3157,3158,1,3160,3162,6,3165,3165,6,3168,3169,6,3170,3171,1,3174,3183,4,3191,3200,6,3201,3201,1,3202,3203,2,3204,3212,6,3214,3216,6,3218,3240,6,3242,3251,6,3253,3257,6,3260,3260,1,3261,3261,6,3262,3262,2,3263,3263,1,3264,3268,2,3270,3270,1,3271,3272,2,3274,3275,2,3276,3277,1,3285,3286,2,3293,3294,6,3296,3297,6,3298,3299,1,3302,3311,4,3313,3314,6,3315,3315,2,3328,3329,1,3330,3331,2,3332,3340,6,3342,3344,6,3346,3386,6,3387,3388,1,3389,3389,6,3390,3392,2,3393,3396,1,3398,3400,2,3402,3404,2,3405,3405,1,3406,3407,6,3412,3414,6,3415,3415,2,3416,3425,6,3426,3427,1,3430,3439,4,3440,3455,6,3457,3457,1,3458,3459,2,3461,3478,6,3482,3505,6,3507,3515,6,3517,3517,6,3520,3526,6,3530,3530,1,3535,3537,2,3538,3540,1,3542,3542,1,3544,3551,2,3558,3567,4,3570,3571,2,3572,3572,6,3585,3632,6,3633,3633,1,3634,3635,6,3636,3642,1,3647,3654,6,3655,3662,1,3663,3663,6,3664,3673,4,3674,3675,6,3713,3714,6,3716,3716,6,3718,3722,6,3724,3747,6,3749,3749,6,3751,3760,6,3761,3761,1,3762,3763,6,3764,3772,1,3773,3773,6,3776,3780,6,3782,3782,6,3784,3790,1,3792,3801,4,3804,3807,6,3840,3863,6,3864,3865,1,3866,3871,6,3872,3881,4,3882,3892,6,3893,3893,1,3894,3894,6,3895,3895,1,3896,3896,6,3897,3897,1,3898,3901,6,3902,3903,2,3904,3911,6,3913,3948,6,3953,3966,1,3967,3967,2,3968,3972,1,3973,3973,6,3974,3975,1,3976,3980,6,3981,3991,1,3993,4028,1,4030,4037,6,4038,4038,1,4039,4044,6,4046,4058,6,4096,4138,6,4139,4140,2,4141,4144,1,4145,4145,2,4146,4151,1,4152,4152,2,4153,4154,1,4155,4156,2,4157,4158,1,4159,4159,6,4160,4169,4,4170,4181,6,4182,4183,2,4184,4185,1,4186,4189,6,4190,4192,1,4193,4193,6,4194,4196,2,4197,4198,6,4199,4205,2,4206,4208,6,4209,4212,1,4213,4225,6,4226,4226,1,4227,4228,2,4229,4230,1,4231,4236,2,4237,4237,1,4238,4238,6,4239,4239,2,4240,4249,4,4250,4252,2,4253,4253,1,4254,4293,6,4295,4295,6,4301,4301,6,4304,4680,6,4682,4685,6,4688,4694,6,4696,4696,6,4698,4701,6,4704,4744,6,4746,4749,6,4752,4784,6,4786,4789,6,4792,4798,6,4800,4800,6,4802,4805,6,4808,4822,6,4824,4880,6,4882,4885,6,4888,4954,6,4957,4959,1,4960,4988,6,4992,5017,6,5024,5109,6,5112,5117,6,5120,5788,6,5792,5880,6,5888,5905,6,5906,5908,1,5909,5909,2,5919,5937,6,5938,5939,1,5940,5940,2,5941,5942,6,5952,5969,6,5970,5971,1,5984,5996,6,5998,6000,6,6002,6003,1,6016,6067,6,6068,6069,1,6070,6070,2,6071,6077,1,6078,6085,2,6086,6086,1,6087,6088,2,6089,6099,1,6100,6108,6,6109,6109,1,6112,6121,4,6128,6137,6,6144,6154,6,6155,6157,1,6158,6158,5,6159,6159,1,6160,6169,4,6176,6264,6,6272,6276,6,6277,6278,1,6279,6312,6,6313,6313,1,6314,6314,6,6320,6389,6,6400,6430,6,6432,6434,1,6435,6438,2,6439,6440,1,6441,6443,2,6448,6449,2,6450,6450,1,6451,6456,2,6457,6459,1,6464,6464,6,6468,6469,6,6470,6479,4,6480,6509,6,6512,6516,6,6528,6571,6,6576,6601,6,6608,6617,4,6618,6618,6,6622,6678,6,6679,6680,1,6681,6682,2,6683,6683,1,6686,6740,6,6741,6741,2,6742,6742,1,6743,6743,2,6744,6750,1,6752,6752,1,6753,6753,2,6754,6754,1,6755,6756,2,6757,6764,1,6765,6770,2,6771,6780,1,6783,6783,1,6784,6793,4,6800,6809,4,6816,6829,6,6832,6845,1,6846,6846,3,6847,6862,1,6912,6915,1,6916,6916,2,6917,6963,6,6964,6964,1,6965,6965,2,6966,6970,1,6971,6971,2,6972,6972,1,6973,6977,2,6978,6978,1,6979,6980,2,6981,6988,6,6990,6991,6,6992,7001,4,7002,7018,6,7019,7027,1,7028,7039,6,7040,7041,1,7042,7042,2,7043,7072,6,7073,7073,2,7074,7077,1,7078,7079,2,7080,7081,1,7082,7082,2,7083,7085,1,7086,7087,6,7088,7097,4,7098,7141,6,7142,7142,1,7143,7143,2,7144,7145,1,7146,7148,2,7149,7149,1,7150,7150,2,7151,7153,1,7154,7155,2,7164,7203,6,7204,7211,2,7212,7219,1,7220,7221,2,7222,7223,1,7227,7231,6,7232,7241,4,7245,7247,6,7248,7257,4,7258,7306,6,7312,7354,6,7357,7367,6,7376,7378,1,7379,7379,6,7380,7392,1,7393,7393,2,7394,7400,1,7401,7404,6,7405,7405,1,7406,7411,6,7412,7412,1,7413,7414,6,7415,7415,2,7416,7417,1,7418,7418,6,7424,7615,6,7616,7679,1,7680,7957,6,7960,7965,6,7968,8005,6,8008,8013,6,8016,8023,6,8025,8025,6,8027,8027,6,8029,8029,6,8031,8061,6,8064,8116,6,8118,8132,6,8134,8147,6,8150,8155,6,8157,8175,6,8178,8180,6,8182,8190,6,8192,8202,6,8203,8207,5,8208,8233,6,8234,8238,5,8239,8287,6,8288,8292,5,8294,8303,5,8304,8305,6,8308,8334,6,8336,8348,6,8352,8384,6,8400,8412,1,8413,8416,3,8417,8417,1,8418,8420,3,8421,8432,1,8448,8587,6,8592,9257,6,9280,9290,6,9312,11123,6,11126,11157,6,11159,11502,6,11503,11505,1,11506,11507,6,11513,11557,6,11559,11559,6,11565,11565,6,11568,11623,6,11631,11632,6,11647,11647,1,11648,11670,6,11680,11686,6,11688,11694,6,11696,11702,6,11704,11710,6,11712,11718,6,11720,11726,6,11728,11734,6,11736,11742,6,11744,11775,1,11776,11869,6,11904,11929,6,11931,12019,6,12032,12245,6,12272,12329,6,12330,12333,1,12334,12335,2,12336,12351,6,12353,12438,6,12441,12442,1,12443,12543,6,12549,12591,6,12593,12686,6,12688,12773,6,12783,12830,6,12832,42124,6,42128,42182,6,42192,42527,6,42528,42537,4,42538,42539,6,42560,42606,6,42607,42607,1,42608,42610,3,42611,42611,6,42612,42621,1,42622,42653,6,42654,42655,1,42656,42735,6,42736,42737,1,42738,42743,6,42752,42957,6,42960,42961,6,42963,42963,6,42965,42972,6,42994,43009,6,43010,43010,1,43011,43013,6,43014,43014,1,43015,43018,6,43019,43019,1,43020,43042,6,43043,43044,2,43045,43046,1,43047,43047,2,43048,43051,6,43052,43052,1,43056,43065,6,43072,43127,6,43136,43137,2,43138,43187,6,43188,43203,2,43204,43205,1,43214,43215,6,43216,43225,4,43232,43249,1,43250,43262,6,43263,43263,1,43264,43273,4,43274,43301,6,43302,43309,1,43310,43334,6,43335,43345,1,43346,43347,2,43359,43388,6,43392,43394,1,43395,43395,2,43396,43442,6,43443,43443,1,43444,43445,2,43446,43449,1,43450,43451,2,43452,43453,1,43454,43456,2,43457,43469,6,43471,43471,6,43472,43481,4,43486,43492,6,43493,43493,1,43494,43503,6,43504,43513,4,43514,43518,6,43520,43560,6,43561,43566,1,43567,43568,2,43569,43570,1,43571,43572,2,43573,43574,1,43584,43586,6,43587,43587,1,43588,43595,6,43596,43596,1,43597,43597,2,43600,43609,4,43612,43642,6,43643,43643,2,43644,43644,1,43645,43645,2,43646,43695,6,43696,43696,1,43697,43697,6,43698,43700,1,43701,43702,6,43703,43704,1,43705,43709,6,43710,43711,1,43712,43712,6,43713,43713,1,43714,43714,6,43739,43754,6,43755,43755,2,43756,43757,1,43758,43759,2,43760,43764,6,43765,43765,2,43766,43766,1,43777,43782,6,43785,43790,6,43793,43798,6,43808,43814,6,43816,43822,6,43824,43883,6,43888,44002,6,44003,44004,2,44005,44005,1,44006,44007,2,44008,44008,1,44009,44010,2,44011,44011,6,44012,44012,2,44013,44013,1,44016,44025,4,44032,55203,6,55216,55238,6,55243,55291,6,55296,64109,6,64112,64217,6,64256,64262,6,64275,64279,6,64285,64285,6,64286,64286,1,64287,64310,6,64312,64316,6,64318,64318,6,64320,64321,6,64323,64324,6,64326,64450,6,64467,64911,6,64914,64967,6,64975,64975,6,65008,65023,6,65024,65039,1,65040,65049,6,65056,65071,1,65072,65106,6,65108,65126,6,65128,65131,6,65136,65140,6,65142,65276,6,65279,65279,5,65281,65295,6,65296,65305,4,65306,65470,6,65474,65479,6,65482,65487,6,65490,65495,6,65498,65500,6,65504,65510,6,65512,65518,6,65529,65531,5,65532,65533,6,65536,65547,6,65549,65574,6,65576,65594,6,65596,65597,6,65599,65613,6,65616,65629,6,65664,65786,6,65792,65794,6,65799,65843,6,65847,65934,6,65936,65948,6,65952,65952,6,66e3,66044,6,66045,66045,1,66176,66204,6,66208,66256,6,66272,66272,1,66273,66299,6,66304,66339,6,66349,66378,6,66384,66421,6,66422,66426,1,66432,66461,6,66463,66499,6,66504,66517,6,66560,66717,6,66720,66729,4,66736,66771,6,66776,66811,6,66816,66855,6,66864,66915,6,66927,66938,6,66940,66954,6,66956,66962,6,66964,66965,6,66967,66977,6,66979,66993,6,66995,67001,6,67003,67004,6,67008,67059,6,67072,67382,6,67392,67413,6,67424,67431,6,67456,67461,6,67463,67504,6,67506,67514,6,67584,67589,6,67592,67592,6,67594,67637,6,67639,67640,6,67644,67644,6,67647,67669,6,67671,67742,6,67751,67759,6,67808,67826,6,67828,67829,6,67835,67867,6,67871,67897,6,67903,67903,6,67968,68023,6,68028,68047,6,68050,68096,6,68097,68099,1,68101,68102,1,68108,68111,1,68112,68115,6,68117,68119,6,68121,68149,6,68152,68154,1,68159,68159,1,68160,68168,6,68176,68184,6,68192,68255,6,68288,68324,6,68325,68326,1,68331,68342,6,68352,68405,6,68409,68437,6,68440,68466,6,68472,68497,6,68505,68508,6,68521,68527,6,68608,68680,6,68736,68786,6,68800,68850,6,68858,68899,6,68900,68903,1,68912,68921,4,68928,68937,4,68938,68965,6,68969,68973,1,68974,68997,6,69006,69007,6,69216,69246,6,69248,69289,6,69291,69292,1,69293,69293,6,69296,69297,6,69314,69316,6,69372,69375,1,69376,69415,6,69424,69445,6,69446,69456,1,69457,69465,6,69488,69505,6,69506,69509,1,69510,69513,6,69552,69579,6,69600,69622,6,69632,69632,2,69633,69633,1,69634,69634,2,69635,69687,6,69688,69702,1,69703,69709,6,69714,69733,6,69734,69743,4,69744,69744,1,69745,69746,6,69747,69748,1,69749,69749,6,69759,69761,1,69762,69762,2,69763,69807,6,69808,69810,2,69811,69814,1,69815,69816,2,69817,69818,1,69819,69820,6,69821,69821,5,69822,69825,6,69826,69826,1,69837,69837,5,69840,69864,6,69872,69881,4,69888,69890,1,69891,69926,6,69927,69931,1,69932,69932,2,69933,69940,1,69942,69951,4,69952,69956,6,69957,69958,2,69959,69959,6,69968,70002,6,70003,70003,1,70004,70006,6,70016,70017,1,70018,70018,2,70019,70066,6,70067,70069,2,70070,70078,1,70079,70080,2,70081,70088,6,70089,70092,1,70093,70093,6,70094,70094,2,70095,70095,1,70096,70105,4,70106,70111,6,70113,70132,6,70144,70161,6,70163,70187,6,70188,70190,2,70191,70193,1,70194,70195,2,70196,70196,1,70197,70197,2,70198,70199,1,70200,70205,6,70206,70206,1,70207,70208,6,70209,70209,1,70272,70278,6,70280,70280,6,70282,70285,6,70287,70301,6,70303,70313,6,70320,70366,6,70367,70367,1,70368,70370,2,70371,70378,1,70384,70393,4,70400,70401,1,70402,70403,2,70405,70412,6,70415,70416,6,70419,70440,6,70442,70448,6,70450,70451,6,70453,70457,6,70459,70460,1,70461,70461,6,70462,70463,2,70464,70464,1,70465,70468,2,70471,70472,2,70475,70477,2,70480,70480,6,70487,70487,2,70493,70497,6,70498,70499,2,70502,70508,1,70512,70516,1,70528,70537,6,70539,70539,6,70542,70542,6,70544,70581,6,70583,70583,6,70584,70586,2,70587,70592,1,70594,70594,2,70597,70597,2,70599,70602,2,70604,70605,2,70606,70606,1,70607,70607,2,70608,70608,1,70609,70609,6,70610,70610,1,70611,70613,6,70615,70616,6,70625,70626,1,70656,70708,6,70709,70711,2,70712,70719,1,70720,70721,2,70722,70724,1,70725,70725,2,70726,70726,1,70727,70735,6,70736,70745,4,70746,70747,6,70749,70749,6,70750,70750,1,70751,70753,6,70784,70831,6,70832,70834,2,70835,70840,1,70841,70841,2,70842,70842,1,70843,70846,2,70847,70848,1,70849,70849,2,70850,70851,1,70852,70855,6,70864,70873,4,71040,71086,6,71087,71089,2,71090,71093,1,71096,71099,2,71100,71101,1,71102,71102,2,71103,71104,1,71105,71131,6,71132,71133,1,71168,71215,6,71216,71218,2,71219,71226,1,71227,71228,2,71229,71229,1,71230,71230,2,71231,71232,1,71233,71236,6,71248,71257,4,71264,71276,6,71296,71338,6,71339,71339,1,71340,71340,2,71341,71341,1,71342,71343,2,71344,71349,1,71350,71350,2,71351,71351,1,71352,71353,6,71360,71369,4,71376,71395,4,71424,71450,6,71453,71453,1,71454,71454,2,71455,71455,1,71456,71457,2,71458,71461,1,71462,71462,2,71463,71467,1,71472,71481,4,71482,71494,6,71680,71723,6,71724,71726,2,71727,71735,1,71736,71736,2,71737,71738,1,71739,71739,6,71840,71903,6,71904,71913,4,71914,71922,6,71935,71942,6,71945,71945,6,71948,71955,6,71957,71958,6,71960,71983,6,71984,71989,2,71991,71992,2,71995,71996,1,71997,71997,2,71998,71998,1,71999,71999,6,72e3,72e3,2,72001,72001,6,72002,72002,2,72003,72003,1,72004,72006,6,72016,72025,4,72096,72103,6,72106,72144,6,72145,72147,2,72148,72151,1,72154,72155,1,72156,72159,2,72160,72160,1,72161,72163,6,72164,72164,2,72192,72192,6,72193,72202,1,72203,72242,6,72243,72248,1,72249,72249,2,72250,72250,6,72251,72254,1,72255,72262,6,72263,72263,1,72272,72272,6,72273,72278,1,72279,72280,2,72281,72283,1,72284,72329,6,72330,72342,1,72343,72343,2,72344,72345,1,72346,72354,6,72368,72440,6,72448,72457,6,72640,72673,6,72688,72697,4,72704,72712,6,72714,72750,6,72751,72751,2,72752,72758,1,72760,72765,1,72766,72766,2,72767,72767,1,72768,72773,6,72784,72793,4,72794,72812,6,72816,72847,6,72850,72871,1,72873,72873,2,72874,72880,1,72881,72881,2,72882,72883,1,72884,72884,2,72885,72886,1,72960,72966,6,72968,72969,6,72971,73008,6,73009,73014,1,73018,73018,1,73020,73021,1,73023,73029,1,73030,73030,6,73031,73031,1,73040,73049,4,73056,73061,6,73063,73064,6,73066,73097,6,73098,73102,2,73104,73105,1,73107,73108,2,73109,73109,1,73110,73110,2,73111,73111,1,73112,73112,6,73120,73129,4,73440,73458,6,73459,73460,1,73461,73462,2,73463,73464,6,73472,73473,1,73474,73474,6,73475,73475,2,73476,73488,6,73490,73523,6,73524,73525,2,73526,73530,1,73534,73535,2,73536,73536,1,73537,73537,2,73538,73538,1,73539,73551,6,73552,73561,4,73562,73562,1,73648,73648,6,73664,73713,6,73727,74649,6,74752,74862,6,74864,74868,6,74880,75075,6,77712,77810,6,77824,78895,6,78896,78911,5,78912,78912,1,78913,78918,6,78919,78933,1,78944,82938,6,82944,83526,6,90368,90397,6,90398,90409,1,90410,90412,2,90413,90415,1,90416,90425,4,92160,92728,6,92736,92766,6,92768,92777,4,92782,92862,6,92864,92873,4,92880,92909,6,92912,92916,1,92917,92917,6,92928,92975,6,92976,92982,1,92983,92997,6,93008,93017,4,93019,93025,6,93027,93047,6,93053,93071,6,93504,93551,6,93552,93561,4,93760,93850,6,93952,94026,6,94031,94031,1,94032,94032,6,94033,94087,2,94095,94098,1,94099,94111,6,94176,94179,6,94180,94180,1,94192,94193,2,94208,100343,6,100352,101589,6,101631,101640,6,110576,110579,6,110581,110587,6,110589,110590,6,110592,110882,6,110898,110898,6,110928,110930,6,110933,110933,6,110948,110951,6,110960,111355,6,113664,113770,6,113776,113788,6,113792,113800,6,113808,113817,6,113820,113820,6,113821,113822,1,113823,113823,6,113824,113827,5,117760,117999,6,118e3,118009,4,118016,118451,6,118528,118573,1,118576,118598,1,118608,118723,6,118784,119029,6,119040,119078,6,119081,119140,6,119141,119142,2,119143,119145,1,119146,119148,6,119149,119154,2,119155,119162,5,119163,119170,1,119171,119172,6,119173,119179,1,119180,119209,6,119210,119213,1,119214,119274,6,119296,119361,6,119362,119364,1,119365,119365,6,119488,119507,6,119520,119539,6,119552,119638,6,119648,119672,6,119808,119892,6,119894,119964,6,119966,119967,6,119970,119970,6,119973,119974,6,119977,119980,6,119982,119993,6,119995,119995,6,119997,120003,6,120005,120069,6,120071,120074,6,120077,120084,6,120086,120092,6,120094,120121,6,120123,120126,6,120128,120132,6,120134,120134,6,120138,120144,6,120146,120485,6,120488,120779,6,120782,120831,4,120832,121343,6,121344,121398,1,121399,121402,6,121403,121452,1,121453,121460,6,121461,121461,1,121462,121475,6,121476,121476,1,121477,121483,6,121499,121503,1,121505,121519,1,122624,122654,6,122661,122666,6,122880,122886,1,122888,122904,1,122907,122913,1,122915,122916,1,122918,122922,1,122928,122989,6,123023,123023,1,123136,123180,6,123184,123190,1,123191,123197,6,123200,123209,4,123214,123215,6,123536,123565,6,123566,123566,1,123584,123627,6,123628,123631,1,123632,123641,4,123647,123647,6,124112,124139,6,124140,124143,1,124144,124153,4,124368,124397,6,124398,124399,1,124400,124400,6,124401,124410,4,124415,124415,6,124896,124902,6,124904,124907,6,124909,124910,6,124912,124926,6,124928,125124,6,125127,125135,6,125136,125142,1,125184,125251,6,125252,125258,1,125259,125259,6,125264,125273,4,125278,125279,6,126065,126132,6,126209,126269,6,126464,126467,6,126469,126495,6,126497,126498,6,126500,126500,6,126503,126503,6,126505,126514,6,126516,126519,6,126521,126521,6,126523,126523,6,126530,126530,6,126535,126535,6,126537,126537,6,126539,126539,6,126541,126543,6,126545,126546,6,126548,126548,6,126551,126551,6,126553,126553,6,126555,126555,6,126557,126557,6,126559,126559,6,126561,126562,6,126564,126564,6,126567,126570,6,126572,126578,6,126580,126583,6,126585,126588,6,126590,126590,6,126592,126601,6,126603,126619,6,126625,126627,6,126629,126633,6,126635,126651,6,126704,126705,6,126976,127019,6,127024,127123,6,127136,127150,6,127153,127167,6,127169,127183,6,127185,127221,6,127232,127405,6,127462,127490,6,127504,127547,6,127552,127560,6,127568,127569,6,127584,127589,6,127744,128727,6,128732,128748,6,128752,128764,6,128768,128886,6,128891,128985,6,128992,129003,6,129008,129008,6,129024,129035,6,129040,129095,6,129104,129113,6,129120,129159,6,129168,129197,6,129200,129211,6,129216,129217,6,129280,129619,6,129632,129645,6,129648,129660,6,129664,129673,6,129679,129734,6,129742,129756,6,129759,129769,6,129776,129784,6,129792,129938,6,129940,130031,6,130032,130041,4,131072,173791,6,173824,177977,6,177984,178205,6,178208,183969,6,183984,191456,6,191472,192093,6,194560,195101,6,196608,201546,6,201552,205743,6,917505,917505,5,917536,917631,5,917760,917999,1,983040,1048573,6,1048576,1114109,6],t.t)
B.cP=s(["text-transform","text-letter-spacing","text-max-width","text-justify","text-anchor","text-rotate","text-font"],t.s)
B.ca=s([65269,65270,0,0],t.t)
B.cb=s([65271,65272,0,0],t.t)
B.cc=s([65273,65274,0,0],t.t)
B.cd=s([65275,65276,0,0],t.t)
B.bA=s([64579,64646,0,0],t.t)
B.cQ=new A.bQ([1570,B.ca,1571,B.cb,1573,B.cc,1575,B.cd,1609,B.bA],t.nD)
B.N=new A.bQ([1552,1,1553,1,1554,1,1555,1,1556,1,1557,1,1558,1,1559,1,1560,1,1561,1,1562,1,1564,1,1568,2,1570,3,1571,3,1572,3,1573,3,1574,2,1575,3,1576,2,1577,3,1578,2,1579,2,1580,2,1581,2,1582,2,1583,3,1584,3,1585,3,1586,3,1587,2,1588,2,1589,2,1590,2,1591,2,1592,2,1593,2,1594,2,1595,2,1596,2,1597,2,1598,2,1599,2,1600,5,1601,2,1602,2,1603,2,1604,2,1605,2,1606,2,1607,2,1608,3,1609,2,1610,2,1611,1,1612,1,1613,1,1614,1,1615,1,1616,1,1617,1,1618,1,1619,1,1620,1,1621,1,1622,1,1623,1,1624,1,1625,1,1626,1,1627,1,1628,1,1629,1,1630,1,1631,1,1646,2,1647,2,1648,1,1649,3,1650,3,1651,3,1653,3,1654,3,1655,3,1656,2,1657,2,1658,2,1659,2,1660,2,1661,2,1662,2,1663,2,1664,2,1665,2,1666,2,1667,2,1668,2,1669,2,1670,2,1671,2,1672,3,1673,3,1674,3,1675,3,1676,3,1677,3,1678,3,1679,3,1680,3,1681,3,1682,3,1683,3,1684,3,1685,3,1686,3,1687,3,1688,3,1689,3,1690,2,1691,2,1692,2,1693,2,1694,2,1695,2,1696,2,1697,2,1698,2,1699,2,1700,2,1701,2,1702,2,1703,2,1704,2,1705,2,1706,2,1707,2,1708,2,1709,2,1710,2,1711,2,1712,2,1713,2,1714,2,1715,2,1716,2,1717,2,1718,2,1719,2,1720,2,1721,2,1722,2,1723,2,1724,2,1725,2,1726,2,1727,2,1728,3,1729,2,1730,2,1731,3,1732,3,1733,3,1734,3,1735,3,1736,3,1737,3,1738,3,1739,3,1740,2,1741,3,1742,2,1743,3,1744,2,1745,2,1746,3,1747,3,1749,3,1750,1,1751,1,1752,1,1753,1,1754,1,1755,1,1756,1,1759,1,1760,1,1761,1,1762,1,1763,1,1764,1,1767,1,1768,1,1770,1,1771,1,1772,1,1773,1,1774,3,1775,3,1786,2,1787,2,1788,2,1791,2,1807,1,1808,3,1809,1,1810,2,1811,2,1812,2,1813,3,1814,3,1815,3,1816,3,1817,3,1818,2,1819,2,1820,2,1821,2,1822,3,1823,2,1824,2,1825,2,1826,2,1827,2,1828,2,1829,2,1830,2,1831,2,1832,3,1833,2,1834,3,1835,2,1836,3,1837,2,1838,2,1839,3,1840,1,1841,1,1842,1,1843,1,1844,1,1845,1,1846,1,1847,1,1848,1,1849,1,1850,1,1851,1,1852,1,1853,1,1854,1,1855,1,1856,1,1857,1,1858,1,1859,1,1860,1,1861,1,1862,1,1863,1,1864,1,1865,1,1866,1,1869,3,1870,2,1871,2,1872,2,1873,2,1874,2,1875,2,1876,2,1877,2,1878,2,1879,2,1880,2,1881,3,1882,3,1883,3,1884,2,1885,2,1886,2,1887,2,1888,2,1889,2,1890,2,1891,2,1892,2,1893,2,1894,2,1895,2,1896,2,1897,2,1898,2,1899,3,1900,3,1901,2,1902,2,1903,2,1904,2,1905,3,1906,2,1907,3,1908,3,1909,2,1910,2,1911,2,1912,3,1913,3,1914,2,1915,2,1916,2,1917,2,1918,2,1919,2,1958,1,1959,1,1960,1,1961,1,1962,1,1963,1,1964,1,1965,1,1966,1,1967,1,1968,1,1994,2,1995,2,1996,2,1997,2,1998,2,1999,2,2000,2,2001,2,2002,2,2003,2,2004,2,2005,2,2006,2,2007,2,2008,2,2009,2,2010,2,2011,2,2012,2,2013,2,2014,2,2015,2,2016,2,2017,2,2018,2,2019,2,2020,2,2021,2,2022,2,2023,2,2024,2,2025,2,2026,2,2027,1,2028,1,2029,1,2030,1,2031,1,2032,1,2033,1,2034,1,2035,1,2042,5,2045,1,2070,1,2071,1,2072,1,2073,1,2075,1,2076,1,2077,1,2078,1,2079,1,2080,1,2081,1,2082,1,2083,1,2085,1,2086,1,2087,1,2089,1,2090,1,2091,1,2092,1,2093,1,2112,3,2113,2,2114,2,2115,2,2116,2,2117,2,2118,3,2119,3,2120,2,2121,3,2122,2,2123,2,2124,2,2125,2,2126,2,2127,2,2128,2,2129,2,2130,2,2131,2,2132,3,2133,2,2134,3,2135,3,2136,3,2137,1,2138,1,2139,1,2144,2,2146,2,2147,2,2148,2,2149,2,2151,3,2152,2,2153,3,2154,3,2160,3,2161,3,2162,3,2163,3,2164,3,2165,3,2166,3,2167,3,2168,3,2169,3,2170,3,2171,3,2172,3,2173,3,2174,3,2175,3,2176,3,2177,3,2178,3,2179,5,2180,5,2181,5,2182,2,2185,2,2186,2,2187,2,2188,2,2189,2,2190,3,2191,2,2199,1,2200,1,2201,1,2202,1,2203,1,2204,1,2205,1,2206,1,2207,1,2208,2,2209,2,2210,2,2211,2,2212,2,2213,2,2214,2,2215,2,2216,2,2217,2,2218,3,2219,3,2220,3,2222,3,2223,2,2224,2,2225,3,2226,3,2227,2,2228,2,2229,2,2230,2,2231,2,2232,2,2233,3,2234,2,2235,2,2236,2,2237,2,2238,2,2239,2,2240,2,2241,2,2242,2,2243,2,2244,2,2245,2,2246,2,2247,2,2248,2,2250,1,2251,1,2252,1,2253,1,2254,1,2255,1,2256,1,2257,1,2258,1,2259,1,2260,1,2261,1,2262,1,2263,1,2264,1,2265,1,2266,1,2267,1,2268,1,2269,1,2270,1,2271,1,2272,1,2273,1,2275,1,2276,1,2277,1,2278,1,2279,1,2280,1,2281,1,2282,1,2283,1,2284,1,2285,1,2286,1,2287,1,2288,1,2289,1,2290,1,2291,1,2292,1,2293,1,2294,1,2295,1,2296,1,2297,1,2298,1,2299,1,2300,1,2301,1,2302,1,2303,1,65279,1],A.af("bQ<c,c>"))
B.bB=s([65152,0,0,0],t.t)
B.bC=s([65153,65154,0,0],t.t)
B.bD=s([65155,65156,0,0],t.t)
B.bE=s([65157,65158,0,0],t.t)
B.bF=s([65159,65160,0,0],t.t)
B.bG=s([65161,65162,65163,65164],t.t)
B.bH=s([65165,65166,0,0],t.t)
B.bI=s([65167,65168,65169,65170],t.t)
B.bJ=s([65171,65172,0,0],t.t)
B.bK=s([65173,65174,65175,65176],t.t)
B.bL=s([65177,65178,65179,65180],t.t)
B.bM=s([65181,65182,65183,65184],t.t)
B.bN=s([65185,65186,65187,65188],t.t)
B.bO=s([65189,65190,65191,65192],t.t)
B.bP=s([65193,65194,0,0],t.t)
B.bQ=s([65195,65196,0,0],t.t)
B.bR=s([65197,65198,0,0],t.t)
B.bS=s([65199,65200,0,0],t.t)
B.bT=s([65201,65202,65203,65204],t.t)
B.bU=s([65205,65206,65207,65208],t.t)
B.bV=s([65209,65210,65211,65212],t.t)
B.bW=s([65213,65214,65215,65216],t.t)
B.bX=s([65217,65218,65219,65220],t.t)
B.bY=s([65221,65222,65223,65224],t.t)
B.bZ=s([65225,65226,65227,65228],t.t)
B.c_=s([65229,65230,65231,65232],t.t)
B.c0=s([65233,65234,65235,65236],t.t)
B.c1=s([65237,65238,65239,65240],t.t)
B.c2=s([65241,65242,65243,65244],t.t)
B.c3=s([65245,65246,65247,65248],t.t)
B.c4=s([65249,65250,65251,65252],t.t)
B.c5=s([65253,65254,65255,65256],t.t)
B.c6=s([65257,65258,65259,65260],t.t)
B.c7=s([65261,65262,0,0],t.t)
B.c8=s([65263,65264,64488,64489],t.t)
B.c9=s([65265,65266,65267,65268],t.t)
B.aX=s([64336,64337,0,0],t.t)
B.bu=s([64477,0,0,0],t.t)
B.b2=s([64358,64359,64360,64361],t.t)
B.b0=s([64350,64351,64352,64353],t.t)
B.aY=s([64338,64339,64340,64341],t.t)
B.aZ=s([64342,64343,64344,64345],t.t)
B.b1=s([64354,64355,64356,64357],t.t)
B.b_=s([64346,64347,64348,64349],t.t)
B.b6=s([64374,64375,64376,64377],t.t)
B.b5=s([64370,64371,64372,64373],t.t)
B.b7=s([64378,64379,64380,64381],t.t)
B.b8=s([64382,64383,64384,64385],t.t)
B.bc=s([64392,64393,0,0],t.t)
B.ba=s([64388,64389,0,0],t.t)
B.b9=s([64386,64387,0,0],t.t)
B.bb=s([64390,64391,0,0],t.t)
B.be=s([64396,64397,0,0],t.t)
B.bd=s([64394,64395,0,0],t.t)
B.b3=s([64362,64363,64364,64365],t.t)
B.b4=s([64366,64367,64368,64369],t.t)
B.bf=s([64398,64399,64400,64401],t.t)
B.bq=s([64467,64468,64469,64470],t.t)
B.bg=s([64402,64403,64404,64405],t.t)
B.bi=s([64410,64411,64412,64413],t.t)
B.bh=s([64406,64407,64408,64409],t.t)
B.bj=s([64414,64415,0,0],t.t)
B.bk=s([64416,64417,64418,64419],t.t)
B.bn=s([64426,64427,64428,64429],t.t)
B.bl=s([64420,64421,0,0],t.t)
B.bm=s([64422,64423,64424,64425],t.t)
B.bw=s([64480,64481,0,0],t.t)
B.bs=s([64473,64474,0,0],t.t)
B.br=s([64471,64472,0,0],t.t)
B.bt=s([64475,64476,0,0],t.t)
B.bx=s([64482,64483,0,0],t.t)
B.bv=s([64478,64479,0,0],t.t)
B.bz=s([64508,64509,64510,64511],t.t)
B.by=s([64484,64485,64486,64487],t.t)
B.bo=s([64430,64431,0,0],t.t)
B.bp=s([64432,64433,0,0],t.t)
B.cR=new A.bQ([1569,B.bB,1570,B.bC,1571,B.bD,1572,B.bE,1573,B.bF,1574,B.bG,1575,B.bH,1576,B.bI,1577,B.bJ,1578,B.bK,1579,B.bL,1580,B.bM,1581,B.bN,1582,B.bO,1583,B.bP,1584,B.bQ,1585,B.bR,1586,B.bS,1587,B.bT,1588,B.bU,1589,B.bV,1590,B.bW,1591,B.bX,1592,B.bY,1593,B.bZ,1594,B.c_,1601,B.c0,1602,B.c1,1603,B.c2,1604,B.c3,1605,B.c4,1606,B.c5,1607,B.c6,1608,B.c7,1609,B.c8,1610,B.c9,1649,B.aX,1655,B.bu,1657,B.b2,1658,B.b0,1659,B.aY,1662,B.aZ,1663,B.b1,1664,B.b_,1667,B.b6,1668,B.b5,1670,B.b7,1671,B.b8,1672,B.bc,1676,B.ba,1677,B.b9,1678,B.bb,1681,B.be,1688,B.bd,1700,B.b3,1702,B.b4,1705,B.bf,1709,B.bq,1711,B.bg,1713,B.bi,1715,B.bh,1722,B.bj,1723,B.bk,1726,B.bn,1728,B.bl,1729,B.bm,1733,B.bw,1734,B.bs,1735,B.br,1736,B.bt,1737,B.bx,1739,B.bv,1740,B.bz,1744,B.by,1746,B.bo,1747,B.bp],t.nD)
B.cY={Arabic:0,Syriac:1,Nko:2,Thaana:3,Mongolian:4,Adlam:5,Mandaic:6,Manichaean:7,Psalter_Pahlavi:8,Hanifi_Rohingya:9,Sogdian:10,Old_Sogdian:11,Old_Uyghur:12,Chorasmian:13,Phags_Pa:14,Latin:15,Cyrillic:16,Greek:17,Hebrew:18,Armenian:19,Georgian:20,Coptic:21,Glagolitic:22,Gothic:23,Runic:24,Ogham:25,Cherokee:26,Deseret:27,Osage:28,Shavian:29,Vai:30,Tifinagh:31,Ethiopic:32,Canadian_Aboriginal:33,Braille:34,Han:35,Hiragana:36,Katakana:37,Hangul:38,Bopomofo:39,Yi:40,Nushu:41,Tangut:42,Devanagari:43,Bengali:44,Gurmukhi:45,Gujarati:46,Oriya:47,Tamil:48,Telugu:49,Kannada:50,Malayalam:51,Sinhala:52,Myanmar:53,Khmer:54,Thai:55,Lao:56,Tibetan:57,Tai_Tham:58,Tai_Le:59,New_Tai_Lue:60,Tai_Viet:61,Balinese:62,Javanese:63,Sundanese:64,Batak:65,Buginese:66,Rejang:67,Cham:68,Kayah_Li:69,Lepcha:70,Limbu:71,Meetei_Mayek:72,Syloti_Nagri:73,Chakma:74,Sharada:75,Takri:76,Khojki:77,Khudawadi:78,Multani:79,Modi:80,Grantha:81,Tirhuta:82,Newa:83,Ahom:84,Brahmi:85,Kaithi:86,Kharoshthi:87,Saurashtra:88,Mahajani:89}
B.cS=new A.al(B.cY,["arab","syrc","nko","thaa","mong","adlm","mand","mani","phlp","rohg","sogd","sogo","ougr","chrs","phag","latn","cyrl","grek","hebr","armn","geor","copt","glag","goth","runr","ogam","cher","dsrt","osge","shaw","vai","tfng","ethi","cans","brai","hani","kana","kana","hang","bopo","yi","nshu","tang","dev2","bng2","gur2","gjr2","ory2","tml2","tel2","knd2","mlm2","sinh","mym2","khmr","thai","lao","tibt","lana","tale","talu","tavt","bali","java","sund","batk","bugi","rjng","cham","kali","lepc","limb","mtei","sylo","cakm","shrd","takr","khoj","sind","mult","modi","gran","tirh","newa","ahom","brah","kthi","khar","saur","mahj"],A.af("al<p,p>"))
B.p={}
B.cU=new A.al(B.p,[],A.af("al<p,o?(A)>"))
B.i=new A.al(B.p,[],A.af("al<p,o?>"))
B.cT=new A.al(B.p,[],A.af("al<p,+(d,d)>"))
B.ab=new A.al(B.p,[],A.af("al<@,@>"))
B.B=new A.al(B.p,[],A.af("al<o?,o?>"))
B.d1={transparent:0,aliceblue:1,antiquewhite:2,aqua:3,aquamarine:4,azure:5,beige:6,bisque:7,black:8,blanchedalmond:9,blue:10,blueviolet:11,brown:12,burlywood:13,cadetblue:14,chartreuse:15,chocolate:16,coral:17,cornflowerblue:18,cornsilk:19,crimson:20,cyan:21,darkblue:22,darkcyan:23,darkgoldenrod:24,darkgray:25,darkgreen:26,darkgrey:27,darkkhaki:28,darkmagenta:29,darkolivegreen:30,darkorange:31,darkorchid:32,darkred:33,darksalmon:34,darkseagreen:35,darkslateblue:36,darkslategray:37,darkslategrey:38,darkturquoise:39,darkviolet:40,deeppink:41,deepskyblue:42,dimgray:43,dimgrey:44,dodgerblue:45,firebrick:46,floralwhite:47,forestgreen:48,fuchsia:49,gainsboro:50,ghostwhite:51,gold:52,goldenrod:53,gray:54,green:55,greenyellow:56,grey:57,honeydew:58,hotpink:59,indianred:60,indigo:61,ivory:62,khaki:63,lavender:64,lavenderblush:65,lawngreen:66,lemonchiffon:67,lightblue:68,lightcoral:69,lightcyan:70,lightgoldenrodyellow:71,lightgray:72,lightgreen:73,lightgrey:74,lightpink:75,lightsalmon:76,lightseagreen:77,lightskyblue:78,lightslategray:79,lightslategrey:80,lightsteelblue:81,lightyellow:82,lime:83,limegreen:84,linen:85,magenta:86,maroon:87,mediumaquamarine:88,mediumblue:89,mediumorchid:90,mediumpurple:91,mediumseagreen:92,mediumslateblue:93,mediumspringgreen:94,mediumturquoise:95,mediumvioletred:96,midnightblue:97,mintcream:98,mistyrose:99,moccasin:100,navajowhite:101,navy:102,oldlace:103,olive:104,olivedrab:105,orange:106,orangered:107,orchid:108,palegoldenrod:109,palegreen:110,paleturquoise:111,palevioletred:112,papayawhip:113,peachpuff:114,peru:115,pink:116,plum:117,powderblue:118,purple:119,rebeccapurple:120,red:121,rosybrown:122,royalblue:123,saddlebrown:124,salmon:125,sandybrown:126,seagreen:127,seashell:128,sienna:129,silver:130,skyblue:131,slateblue:132,slategray:133,slategrey:134,snow:135,springgreen:136,steelblue:137,tan:138,teal:139,thistle:140,tomato:141,turquoise:142,violet:143,wheat:144,white:145,whitesmoke:146,yellow:147,yellowgreen:148}
B.cV=new A.al(B.d1,[0,4293982463,4294634455,4278255615,4286578644,4293984255,4294309340,4294960324,4278190080,4294962125,4278190335,4287245282,4289014314,4292786311,4284456608,4286578432,4291979550,4294934352,4284782061,4294965468,4292613180,4278255615,4278190219,4278225803,4290283019,4289309097,4278215680,4289309097,4290623339,4287299723,4283788079,4294937600,4288230092,4287299584,4293498490,4287609999,4282924427,4281290575,4281290575,4278243025,4287889619,4294907027,4278239231,4285098345,4285098345,4280193279,4289864226,4294966e3,4280453922,4294902015,4292664540,4294506751,4294956800,4292519200,4286611584,4278222848,4289593135,4286611584,4293984240,4294928820,4291648604,4283105410,4294967280,4293977740,4293322490,4294963445,4286381056,4294965965,4289583334,4293951616,4292935679,4294638290,4292072403,4287688336,4292072403,4294948545,4294942842,4280332970,4287090426,4286023833,4286023833,4289774814,4294967264,4278255360,4281519410,4294635750,4294902015,4286578688,4284927402,4278190285,4290401747,4287852763,4282168177,4286277870,4278254234,4282962380,4291237253,4279834992,4294311930,4294960353,4294960309,4294958765,4278190208,4294833638,4286611456,4285238819,4294944e3,4294919424,4292505814,4293847210,4288215960,4289720046,4292571283,4294963157,4294957753,4291659071,4294951115,4292714717,4289781990,4286578816,4284887961,4294901760,4290547599,4282477025,4287317267,4294606962,4294222944,4281240407,4294964718,4288696877,4290822336,4287090411,4285160141,4285563024,4285563024,4294966010,4278255487,4282811060,4291998860,4278222976,4292394968,4294927175,4282441936,4293821166,4294303411,4294967295,4294309365,4294967040,4288335154],A.af("al<p,c>"))
B.dy=new A.h7(2,"composedDiacritics")
B.d2=new A.z(0,0)
B.d8=new A.ad(0,0,0,0)
B.d9=new A.ad(0,0,0,1)
B.d0={thin:0,hairline:1,extralight:2,ultralight:3,light:4,regular:5,normal:6,book:7,medium:8,semibold:9,demibold:10,demi:11,bold:12,extrabold:13,ultrabold:14,black:15,heavy:16,italic:17,oblique:18,condensed:19,semicondensed:20,expanded:21,extra:22,semi:23,ultra:24}
B.da=new A.aW(B.d0,25,t.R)
B.db=new A.bR([1634885986,1937338979,1852534560,1952997729,1835101796,1633971309,1751474802,1935764850,1835363940,1835101801,1885891696,1919903847,1936680804,1936680815,1869965170,1667789427,1634889065,1635152756,1668313716,1802002802,1819894889,1835364975,1835364963,1851880034,1851941236,1885432941,1885891689,1885892216,1886549097,1935766114,1869769576,1751217266,1752526439,2036693609,1701607789],t.Y)
B.dc=new A.bR([1813,1814,1834,1792],t.Y)
B.cX={"raster-hue-rotate":0,"raster-saturation":1,"raster-contrast":2,"raster-brightness-min":3,"raster-brightness-max":4}
B.ae=new A.aW(B.cX,5,t.R)
B.af=new A.bR([1634885986,1937338979,1852534560,1836019303,1885888871,1835101796,1835101801,1885891696,1919903847,1936680804,1936680815,1869965170,1667789427],t.Y)
B.Q=new A.aW(B.p,0,A.af("aW<c>"))
B.cZ={"user-agent":0,"accept-encoding":1}
B.dd=new A.aW(B.cZ,2,t.R)
B.d_={literal:0,get:1,has:2,"!":3,"==":4,"!=":5,"<":6,"<=":7,">":8,">=":9,all:10,any:11,none:12,case:13,match:14,coalesce:15,step:16,interpolate:17,"interpolate-hcl":18,"interpolate-lab":19,zoom:20,"geometry-type":21,"to-string":22,"to-number":23,"to-boolean":24,"to-color":25,string:26,number:27,boolean:28,array:29,object:30,concat:31,upcase:32,downcase:33,"+":34,"-":35,"*":36,"/":37,"%":38,"^":39,min:40,max:41,round:42,floor:43,ceil:44,abs:45,sqrt:46,ln:47,log10:48,log2:49,length:50,in:51,"!in":52,"!has":53,at:54,format:55,"number-format":56,rgb:57,rgba:58,var:59,let:60,id:61,properties:62,"feature-state":63,image:64,typeof:65,collator:66,"resolved-locale":67,"is-supported-script":68,slice:69,"index-of":70,e:71,pi:72,ln2:73,"line-progress":74,"heatmap-density":75,sin:76,cos:77,tan:78,asin:79,acos:80,atan:81,within:82,distance:83,accumulated:84,"to-rgba":85,hsl:86,hsla:87,split:88,join:89}
B.de=new A.aW(B.d_,90,t.R)
B.cz=s([],t.I)
B.df=new A.hq(B.cz)
B.ag=new A.c4(0,"left")
B.ah=new A.c4(1,"right")
B.dg=new A.c4(2,"center")
B.dh=new A.c4(4,"start")
B.di=new A.c4(5,"end")
B.r=new A.eF(0,"ltr")
B.k=new A.eF(1,"rtl")
B.dj=A.aR("xL")
B.dk=A.aR("pv")
B.dl=A.aR("bO")
B.dm=A.aR("bP")
B.dn=A.aR("ok")
B.dp=A.aR("e9")
B.dq=A.aR("tV")
B.dr=A.aR("N")
B.ds=A.aR("o")
B.dt=A.aR("kW")
B.du=A.aR("oA")
B.dv=A.aR("uY")
B.dw=A.aR("c5")
B.dx=new A.kX(!1)})();(function staticFields(){$.ln=null
$.aK=A.b([],t.G)
$.q5=null
$.pt=null
$.ps=null
$.r8=null
$.r2=null
$.re=null
$.nD=null
$.nN=null
$.oZ=null
$.lu=A.b([],A.af("k<j<o>?>"))
$.dH=null
$.fb=null
$.fc=null
$.oM=!1
$.H=B.f
$.dG=0
$.dE=A.C(t.N,t.S)
$.uz=A.C(t.N,A.af("ad?"))
$.fd=A.b([],A.af("k<R<p,o?(A)>>"))
$.oJ=A.C(t.N,t.u)})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal,r=hunkHelpers.lazy
s($,"xN","rj",()=>A.nE("_$dart_dartClosure"))
s($,"xM","pb",()=>A.nE("_$dart_dartClosure_dartJSInterop"))
s($,"yq","rI",()=>B.f.e5(new A.nU(),A.af("a7<~>")))
s($,"yf","rE",()=>A.b([new J.fU()],A.af("k<ex>")))
s($,"xV","rn",()=>A.bC(A.kV({
toString:function(){return"$receiver$"}})))
s($,"xW","ro",()=>A.bC(A.kV({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"xX","rp",()=>A.bC(A.kV(null)))
s($,"xY","rq",()=>A.bC(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(q){return q.message}}()))
s($,"y0","rt",()=>A.bC(A.kV(void 0)))
s($,"y1","ru",()=>A.bC(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(q){return q.message}}()))
s($,"y_","rs",()=>A.bC(A.qm(null)))
s($,"xZ","rr",()=>A.bC(function(){try{null.$method$}catch(q){return q.message}}()))
s($,"y3","rw",()=>A.bC(A.qm(void 0)))
s($,"y2","rv",()=>A.bC(function(){try{(void 0).$method$}catch(q){return q.message}}()))
s($,"y4","pd",()=>A.v_())
s($,"xQ","pc",()=>$.rI())
s($,"xP","rl",()=>{var q=new A.K(B.f,t.k)
q.fN(!1)
return q})
s($,"y8","rA",()=>A.uj(4096))
s($,"y6","ry",()=>new A.lE().$0())
s($,"y7","rz",()=>new A.lD().$0())
s($,"y5","rx",()=>A.jO("^[\\-\\.0-9A-Z_a-z~]*$"))
s($,"ya","ij",()=>A.nV(B.ds))
r($,"ye","fh",()=>new A.nl().$0())
r($,"yc","rD",()=>new A.m5().$0())
s($,"xO","rk",()=>A.uh(0))
s($,"yg","rF",()=>A.b([A.F(7,7,0),A.F(7,0,2),A.F(7,0,1),A.F(7,0,2),A.F(7,0,1),A.F(7,0,6),A.F(7,7,0),A.F(7,0,2),A.F(7,0,1),A.F(7,0,2),A.F(7,2,5),A.F(7,0,6),A.F(7,7,0),A.F(7,0,2),A.F(6,1,1),A.F(6,1,3),A.F(6,1,4),A.F(6,1,6),A.F(7,7,0),A.F(7,0,2),A.F(4,1,1),A.F(4,1,3),A.F(4,1,4),A.F(4,1,6),A.F(7,7,0),A.F(7,0,2),A.F(5,0,1),A.F(5,0,2),A.F(5,2,5),A.F(5,0,6),A.F(7,7,0),A.F(7,0,2),A.F(0,0,1),A.F(0,0,2),A.F(0,2,5),A.F(0,0,6),A.F(7,7,0),A.F(7,0,2),A.F(7,0,1),A.F(7,0,2),A.F(7,3,5),A.F(7,0,6)],t.t))
s($,"yd","fg",()=>new A.mi().$0())
s($,"y9","rB",()=>B.a.aC(B.M,"Common"))
s($,"yb","rC",()=>B.a.aC(B.M,"Inherited"))
s($,"yh","pe",()=>new A.np().$0())
s($,"yp","oe",()=>A.cz(B.cn))
s($,"yo","od",()=>A.cz(B.cO))
s($,"yj","pg",()=>A.cz(B.cG))
s($,"yi","pf",()=>A.cz(B.cJ))
s($,"ym","dO",()=>A.cz(B.cF))
s($,"yr","rJ",()=>A.cz(B.ck))
s($,"yl","rH",()=>A.cz(B.cf))
s($,"yk","rG",()=>A.cz(B.ce))
s($,"xR","rm",()=>A.r6(0.6544984694978736))})();(function nativeSupport(){!function(){var s=function(a){var m={}
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
hunkHelpers.setOrUpdateInterceptorsByTag({SharedArrayBuffer:A.bW,ArrayBuffer:A.dl,ArrayBufferView:A.eo,DataView:A.en,Float32Array:A.cw,Float64Array:A.cx,Int16Array:A.h5,Int32Array:A.cy,Int8Array:A.h6,Uint16Array:A.cA,Uint32Array:A.ep,Uint8ClampedArray:A.eq,CanvasPixelArray:A.eq,Uint8Array:A.bY})
hunkHelpers.setOrUpdateLeafTags({SharedArrayBuffer:true,ArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.ao.$nativeSuperclassTag="ArrayBufferView"
A.eU.$nativeSuperclassTag="ArrayBufferView"
A.eV.$nativeSuperclassTag="ArrayBufferView"
A.bX.$nativeSuperclassTag="ArrayBufferView"
A.eW.$nativeSuperclassTag="ArrayBufferView"
A.eX.$nativeSuperclassTag="ArrayBufferView"
A.aG.$nativeSuperclassTag="ArrayBufferView"})()
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
var s=A.xi
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()