(()=>{"use strict";var e;e={},Object.defineProperty(e,"__esModule",{value:!0}),e.SimplifyTo=e.Simplify=e.BinarySearch=e.MaxDistance=e.DefaultDistanceFunc=e.ShortestDistance=e.PerpendicularDistance=void 0,e.PerpendicularDistance=(e,t,i)=>{let n;if(t.x===i.x)n=Math.abs(e.x-t.x);else if(t.y===i.y)n=Math.abs(e.y-t.y);else{const a=(i.y-t.y)/(i.x-t.x),s=t.y-a*t.x;n=Math.abs(a*e.x-e.y+s)/Math.sqrt(Math.pow(a,2)+1)}return n},e.ShortestDistance=(e,t,i)=>{const n=(e,t)=>Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2);let a;const s=n(t,i);if(0===s)a=n(e,t);else{const l=((e.x-t.x)*(i.x-t.x)+(e.y-t.y)*(i.y-t.y))/s;a=n(e,l<0?t:l>1?i:{x:t.x+l*(i.x-t.x),y:t.y+l*(i.y-t.y)})}return Math.sqrt(a)},e.DefaultDistanceFunc=e.ShortestDistance,e.MaxDistance=(t,i=e.DefaultDistanceFunc)=>{const n=t[0],a=t[t.length-1];let s=-1,l=0;for(let e=1;e<t.length-1;e++){let r=i(t[e],n,a);r>l&&(l=r,s=e)}return{distance:l,index:s}},e.BinarySearch=(e,t=1,i=Number.MAX_SAFE_INTEGER)=>{let n=Math.floor(t),a=Math.floor(i),s=Math.floor(n+(a-n)/2);for(;n<=a;){const t=e(s);if(0==t||a-n<1)return s;t<0?a=s-1:n=s+1,s=Math.floor(n+(a-n)/2)}return s},e.Simplify=(t,i,n=e.DefaultDistanceFunc)=>{if(i<0)throw new Error("Epsilon must not be negative.");var a;if(0===i||t.length<3)a=t.slice(0);else{const s=e.MaxDistance(t,n);a=s.distance>i?[...e.Simplify(t.slice(0,s.index+1),i,n).slice(0,-1),...e.Simplify(t.slice(s.index),i,n)]:[t[0],t[t.length-1]]}return a},e.SimplifyTo=(t,i,n=e.DefaultDistanceFunc)=>{let a;if(i<3)a=[t[0],t[t.length-1]];else if(i>=t.length)a=t.slice(0);else{const s=e.MaxDistance(t,n).distance,l=Number.MAX_SAFE_INTEGER;a=e.Simplify(t,s*e.BinarySearch((a=>e.Simplify(t,s/l*a,n).length-i),1,l)/l,n)}return a}})();