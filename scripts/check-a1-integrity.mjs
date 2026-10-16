import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";

function read(path){return fs.readFileSync(path);}
function sha(buffer){return createHash("sha1").update("blob "+buffer.byteLength+"\0").update(buffer).digest("hex");}
function identical(original,preview,expected,label){
 const a=read(original),b=read(preview);
 assert.equal(sha(a),expected,label+" original checksum changed");
 assert.equal(sha(b),expected,label+" preview checksum changed");
 assert.deepEqual(b,a,label+" differs between original and preview");
}
const root=read("index.html");
assert.equal(sha(root),"46ac0428d84a74b972777b3bd499589ba2e9460a",
 "Live A1 root page must not be modified");
identical("assets/index-DRCE9iGL.js","preview/assets/index-DRCE9iGL.js",
 "63f90f55f7de004da8fe78e30ea4fa0230064d0f","A1 course React bundle (24 units, 576 questions, videos and progress)");
identical("assets/index-OVjCbFV6.css","preview/assets/index-OVjCbFV6.css",
 "12809de74d7059008caa13a5c770ddad6859cb78","A1 original stylesheet");
identical("og.png","preview/og.png",
 "bc5c41f82a7d2cb8d43178a1778375e86c890c18","A1 original social artwork");
const html=read("preview/index.html").toString("utf8");
for(const source of ["./assets/index-DRCE9iGL.js","./assets/index-OVjCbFV6.css",
 "./ayda-a1-hybrid.css","./ayda-a1-hybrid.js","./og.png",
 "https://onurqlp.github.io/ayda-pass/access-control.js"]){
 assert.ok(html.includes(source),"Preview is missing "+source);
}
assert.ok(html.includes("noindex,nofollow"),"Preview should not be indexed");
const bundle=read("preview/assets/index-DRCE9iGL.js").toString("utf8");
for(let i=1;i<=24;i++)assert.match(bundle,new RegExp("number:"+i+"(?:,|})"),"Unit "+i+" missing");
assert.ok(bundle.includes("ayda-a1-progress-v3"),"Original progress key was removed");
assert.ok(bundle.includes("Kısa konu tekrarı")&&bundle.includes("Konuşma kalıpları"),"Video mapping missing");
const enhanced=read("preview/ayda-a1-hybrid.js").toString("utf8");
assert.ok(enhanced.includes("24 kısa soru"),"Four six-question practice flow missing");
assert.ok(enhanced.includes("file/d/")&&enhanced.includes("/preview"),"In-page video support missing");
console.log("PASS: All original A1 materials unchanged: 24 units, 576 exercises, three video links per unit.");
console.log("PASS: Live A1 index, video player sources, password service and progress data retained.");
