webpackJsonp([0],{"3qsT":function(t,n){},"Ef/r":function(t,n){},FFrK:function(t,n){},"LvU+":function(t,n){},NHnr:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=e("7+uW"),r=e("2aIq"),s=e.n(r),i=e("NYxO"),c=(e("VU/8")({Wall:function(t){return{data:t}},Collection:function(t){return{data:t}},Card:function(t){return{data:t,status:!0}}},null,!1,null,null,null).exports,e("lhjn"));a.a.use(i.a);var o=new i.a.Store({state:{walls:[],activeWallId:0},mutations:{myMutation:function(t,n){n.param},init:function(t,n){s()(n),t.walls=c.walls},setCardsStatus:function(t,n){var e=n.cardIds,a=n.status;e.forEach(function(t,n){var e=o.getters.getCardById(t);o.commit("setCardStatus",{card:e,status:a})})},setCardStatus:function(t,n){var e=n.card,r=n.status;a.a.set(e,"status",r)}},getters:{myGetter:function(t){return function(t){return!0}},getCardById:function(t){return function(n){var e=void 0;return t.walls[t.activeWallId].collections.forEach(function(t,a){var r=t.cards.find(function(t){return t.id==n});r&&(e=r)}),e}},getConnectionsByCardId:function(t){return function(n){return t.walls[t.activeWallId].connections.filter(function(t){return-1!=t.members.indexOf(n)})}}}}),u={name:"App",created:function(){o.commit("init",{})}},l={render:function(){var t=this.$createElement,n=this._self._c||t;return n("div",{attrs:{id:"app"}},[this._v("\n  Kedja\n  "),n("router-view")],1)},staticRenderFns:[]};var d=e("VU/8")(u,l,!1,function(t){e("LvU+")},null,null).exports,f=e("/ocq"),m={name:"Card",data:function(){return{}},props:{card:""},computed:{connections:function(){return o.getters.getConnectionsByCardId(this.card.id)},connectedCardIds:function(){var t=this,n=[];return this.connections.forEach(function(e,a){e.members[0]!=t.card.id&&n.push(e.members[0]),e.members[1]!=t.card.id&&n.push(e.members[1])}),n}},methods:{setStatus:function(t){o.commit("setCardsStatus",{cardIds:this.connectedCardIds,status:t})}}},v={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"Card",class:{connected:t.card.status},on:{mouseover:function(n){return t.setStatus(!0)},mouseout:function(n){return t.setStatus(!1)}}},[t._v("\n  Kort: "+t._s(t.card)+"\n  "),e("br"),t._v("\n  Kopplingar: "+t._s(t.connections)+"\n")])},staticRenderFns:[]};var p={name:"Collection",components:{Card:e("VU/8")(m,v,!1,function(t){e("Ef/r")},"data-v-df3ac328",null).exports},data:function(){return{}},props:{collection:""}},h={render:function(){var t=this.$createElement,n=this._self._c||t;return n("div",{staticClass:"Collection"},[n("h2",[this._v("\n    "+this._s(this.collection.name)+"\n  ")]),this._v(" "),this._l(this.collection.cards,function(t){return n("card",{attrs:{card:t}})})],2)},staticRenderFns:[]};var _={name:"Wall",components:{Collection:e("VU/8")(p,h,!1,function(t){e("3qsT")},"data-v-3517eed2",null).exports},data:function(){return{}},props:{wall:""}},C={render:function(){var t=this.$createElement,n=this._self._c||t;return n("div",{staticClass:"Wall"},[n("h1",[this._v("\n    "+this._s(this.wall.name)+"\n  ")]),this._v(" "),this._l(this.wall.collections,function(t){return n("collection",{attrs:{collection:t}})})],2)},staticRenderFns:[]};var w={name:"Landing",components:{Wall:e("VU/8")(_,C,!1,function(t){e("FFrK")},"data-v-190085fb",null).exports},data:function(){return{}},props:{},computed:{walls:function(){return o.state.walls},activeWallId:function(){return o.state.activeWallId}},methods:{},mounted:function(){}},I={render:function(){var t=this.$createElement,n=this._self._c||t;return n("div",{staticClass:"Landing"},[n("wall",{attrs:{wall:this.walls[this.activeWallId]}})],1)},staticRenderFns:[]};var g=e("VU/8")(w,I,!1,function(t){e("s491")},"data-v-18539648",null).exports;a.a.use(f.a);var E=new f.a({mode:"history",routes:[{path:"/",name:"Landing",component:g}]});a.a.config.productionTip=!1,new a.a({el:"#app",router:E,components:{App:d},template:"<App/>"})},lhjn:function(t,n){t.exports={walls:[{name:"Min vägg",collections:[{name:"Resurser",cards:[{name:"Min resurs 1",id:"2345"},{name:"Min resurs 2",id:"4635"}]},{name:"Aktiviteter",cards:[{name:"Min aktivitet 1",id:"3433"},{name:"Min aktivitet 2",id:"4652"}]},{name:"Resultat",cards:[{name:"Mitt resultat 1",id:"8975"},{name:"Mitt resultat 2",id:"2757"}]},{name:"Effekter",cards:[{name:"Min effekt 1",id:"5368"},{name:"Min effekt 2",id:"3456"}]}],connections:[{id:"3242",members:["2345","4652"]}]}]}},s491:function(t,n){}},["NHnr"]);
//# sourceMappingURL=app.c0e956d08c5da06f3f73.js.map