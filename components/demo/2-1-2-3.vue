<template>
  <div class="content">
    <div ref="map" class="map" />
    <div class="handle">
      <label for="speed">
        速度:&nbsp;
        <input
          ref="speed"
          type="range"
          min="10"
          max="999"
          step="10"
          value="60"
        />
      </label>
      <button ref="startanimation">开始</button>
      <button ref="pauseanimation">暂停</button>
      <button ref="continueanimation">继续</button>
      <button ref="stopanimation">结束</button>
    </div>
  </div>
</template>
  
  <script>
let {
  geom: { Point, LineString },
  format: { Polyline },
  Feature,
  Map,
  View,
  layer: { Tile: TileLayer, Vector: VectorLayer },
  source: { OSM, Vector: VectorSource, XYZ },
  style: { Circle: CircleStyle, Fill, Stroke, Style, Icon },
  interaction: { Draw, Modify, Snap },
  proj: { get },
} = ol;
export default {
  data() {
    return {
      center: [-5639523.95, -3501274.52],
      map: null,
      polyline: "",
      route: null,
      routes: null,
      routeLength: 0,
      routeCoords: [],
      routeCoordsX: [],
      routeCoordsY: [],
      routeFeature: null,
      geoMarker: null,
      startMarker: null,
      endMarker: null,
      styles: {},
      animating: false,
      vectorLayer: null,
      startTime: undefined,
      startButton: undefined,
      stoptime: null,
      timer: null,
      elapsedTime: 0,
      timerFlag: false,
      index: 0,
    };
  },
  mounted() {
    const that = this;
    this.map = new Map({
      target: this.$refs.map,
      view: new View({
        center: this.center,
        zoom: 10,
        minZoom: 2,
        maxZoom: 18,
      }),
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
            projection: "EPSG:3857",
          }),
        }),
      ],
    });
    this.polyline =
      "hldhx@lnau`BCG_EaC??cFjAwDjF??uBlKMd@}@z@??aC^yk@z_@se@b[wFdE??wFfE}NfIoGxB_I\\gG}@eHoCyTmPqGaBaHOoD\\??yVrGotA|N??o[N_STiwAtEmHGeHcAkiA}^aMyBiHOkFNoI`CcVvM??gG^gF_@iJwC??eCcA]OoL}DwFyCaCgCcCwDcGwHsSoX??wI_EkUFmq@hBiOqBgTwS??iYse@gYq\\cp@ce@{vA}s@csJqaE}{@iRaqE{lBeRoIwd@_T{]_Ngn@{PmhEwaA{SeF_u@kQuyAw]wQeEgtAsZ}LiCarAkVwI}D??_}RcjEinPspDwSqCgs@sPua@_OkXaMeT_Nwk@ob@gV}TiYs[uTwXoNmT{Uyb@wNg]{Nqa@oDgNeJu_@_G}YsFw]kDuZyDmm@i_@uyIJe~@jCg|@nGiv@zUi_BfNqaAvIow@dEed@dCcf@r@qz@Egs@{Acu@mCum@yIey@gGig@cK_m@aSku@qRil@we@{mAeTej@}Tkz@cLgr@aHko@qOmcEaJw~C{w@kai@qBchBq@kmBS{kDnBscBnFu_Dbc@_~QHeU`IuyDrC_}@bByp@fCyoA?qMbD}{AIkeAgBk_A_A{UsDke@gFej@qH{o@qGgb@qH{`@mMgm@uQus@kL{_@yOmd@ymBgwE}x@ouBwtA__DuhEgaKuWct@gp@cnBii@mlBa_@}|Asj@qrCg^eaC}L{dAaJ_aAiOyjByH{nAuYu`GsAwXyn@ywMyOyqD{_@cfIcDe}@y@aeBJmwA`CkiAbFkhBlTgdDdPyiB`W}xDnSa}DbJyhCrXitAhT}x@bE}Z_@qW_Kwv@qKaaAiBgXvIm}A~JovAxCqW~WanB`XewBbK{_A`K}fBvAmi@xBycBeCauBoF}}@qJioAww@gjHaPopA_NurAyJku@uGmi@cDs[eRaiBkQstAsQkcByNmaCsK_uBcJgbEw@gkB_@ypEqDoqSm@eZcDwjBoGw`BoMegBaU_`Ce_@_uBqb@ytBwkFqiT_fAqfEwe@mfCka@_eC_UmlB}MmaBeWkkDeHwqAoX}~DcBsZmLcxBqOwqE_DkyAuJmrJ\\o~CfIewG|YibQxBssB?es@qGciA}RorAoVajA_nAodD{[y`AgPqp@mKwr@ms@umEaW{dAmb@umAw|@ojBwzDaaJsmBwbEgdCsrFqhAihDquAi`Fux@}_Dui@_eB_u@guCuyAuiHukA_lKszAu|OmaA{wKm}@clHs_A_rEahCssKo\\sgBsSglAqk@yvDcS_wAyTwpBmPc|BwZknFoFscB_GsaDiZmyMyLgtHgQonHqT{hKaPg}Dqq@m~Hym@c`EuiBudIabB{hF{pWifx@snAw`GkFyVqf@y~BkoAi}Lel@wtc@}`@oaXi_C}pZsi@eqGsSuqJ|Lqeb@e]kgPcaAu}SkDwzGhn@gjYh\\qlNZovJieBqja@ed@siO{[ol\\kCmjMe\\isHorCmec@uLebB}EqiBaCg}@m@qwHrT_vFps@kkI`uAszIrpHuzYxx@e{Crw@kpDhN{wBtQarDy@knFgP_yCu\\wyCwyA{kHo~@omEoYmoDaEcPiuAosDagD}rO{{AsyEihCayFilLaiUqm@_bAumFo}DgqA_uByi@swC~AkzDlhA}xEvcBa}Cxk@ql@`rAo|@~bBq{@``Bye@djDww@z_C_cAtn@ye@nfC_eC|gGahH~s@w}@``Fi~FpnAooC|u@wlEaEedRlYkrPvKerBfYs}Arg@m}AtrCkzElw@gjBbh@woBhR{gCwGkgCc[wtCuOapAcFoh@uBy[yBgr@c@iq@o@wvEv@sp@`FajBfCaq@fIipAdy@ewJlUc`ExGuaBdEmbBpBssArAuqBBg}@s@g{AkB{bBif@_bYmC}r@kDgm@sPq_BuJ_s@{X_{AsK_d@eM{d@wVgx@oWcu@??aDmOkNia@wFoSmDyMyCkPiBePwAob@XcQ|@oNdCoSfFwXhEmOnLi\\lbAulB`X_d@|k@au@bc@oc@bqC}{BhwDgcD`l@ed@??bL{G|a@eTje@oS~]cLr~Bgh@|b@}Jv}EieAlv@sPluD{z@nzA_]`|KchCtd@sPvb@wSb{@ko@f`RooQ~e[upZbuIolI|gFafFzu@iq@nMmJ|OeJn^{Qjh@yQhc@uJ~j@iGdd@kAp~BkBxO{@|QsAfYgEtYiGd]}Jpd@wRhVoNzNeK`j@ce@vgK}cJnSoSzQkVvUm^rSgc@`Uql@xIq\\vIgg@~kDyq[nIir@jNoq@xNwc@fYik@tk@su@neB}uBhqEesFjoGeyHtCoD|D}Ed|@ctAbIuOzqB_}D~NgY`\\um@v[gm@v{Cw`G`w@o{AdjAwzBh{C}`Gpp@ypAxn@}mAfz@{bBbNia@??jIab@`CuOlC}YnAcV`@_^m@aeB}@yk@YuTuBg^uCkZiGk\\yGeY}Lu_@oOsZiTe[uWi[sl@mo@soAauAsrBgzBqgAglAyd@ig@asAcyAklA}qAwHkGi{@s~@goAmsAyDeEirB_{B}IsJuEeFymAssAkdAmhAyTcVkFeEoKiH}l@kp@wg@sj@ku@ey@uh@kj@}EsFmG}Jk^_r@_f@m~@ym@yjA??a@cFd@kBrCgDbAUnAcBhAyAdk@et@??kF}D??OL";

    this.route = new Polyline({
      factor: 1e6,
    }).readGeometry(this.polyline, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
    for (var i = 0; i < this.route.flatCoordinates.length; i++) {
      if (i % 2 == 0) {
        this.routeCoordsX.push(this.route.flatCoordinates[i]);
      } else {
        this.routeCoordsY.push(this.route.flatCoordinates[i]);
      }
    }
    // 将[1,2,3,4,5,6...]转为[[1,2],[3,4],[5,6]...]
    for (var i = 0; i < this.routeCoordsX.length; i++) {
      this.routeCoords.push([this.routeCoordsX[i], this.routeCoordsY[i]]);
    }
    // 矢量元素要呈现的几何图形的特征属性LineString代表线段
    this.routes = new LineString(this.routeCoords);
    console.log(this.routes);
    this.routeLength = this.routeCoords.length;
    this.routeFeature = new Feature({
      type: "route",
      geometry: this.routes,
    });
    this.geoMarker = new Feature({
      type: "geoMarker",
      geometry: new Point(this.routeCoords[0]),
    });
    this.startMarker = new Feature({
      type: "iconStart",
      geometry: new Point(this.routeCoords[0]),
    });
    this.endMarker = new Feature({
      type: "iconEnd",
      geometry: new Point(this.routeCoords[this.routeLength - 1]),
    });
    this.styles = {
      route: new Style({
        stroke: new Stroke({
          width: 6,
          color: [237, 212, 0, 0.8],
        }),
      }),
      iconStart: new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          src: this.$withBase("/data/square.svg"),
        }),
      }),
      iconEnd: new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          src: this.$withBase("/data/dot.svg"),
        }),
      }),
      geoMarker: new Style({
        image: new Icon({
          anchor: [0.5, 0.5], // 图标中心
          src: this.$withBase("/data/dot.svg"),
          scale: 0.6,
          rotation: -Math.atan2(
            this.routeCoords[0][1] - this.routeCoords[1][1],
            this.routeCoords[0][0] - this.routeCoords[1][0]
          ),
          rotateWithView: true,
        }),
      }),
    };
    this.vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [
          this.routeFeature,
          this.geoMarker,
          this.startMarker,
          this.endMarker,
        ],
      }),
      style: function (feature) {
        if (that.animating && feature.get("type") === "geoMarker") {
          return null;
        }
        return that.styles[feature.get("type")];
      },
    });
    this.map.addLayer(this.vectorLayer);
    this.$refs.startanimation.addEventListener(
      "click",
      function () {
        this.animating = true;
        this.startTime = new Date().getTime();
        // 隐藏geoMarker
        this.geoMarker.changed();
        this.map.getView().setCenter(this.center);
        // 添加事件，地图渲染时触发
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
          moveFeature.call(this);
        }, 60);
        this.elapsedTime = 0;
      }.bind(this),
      false
    );
    this.$refs.pauseanimation.addEventListener(
      "click",
      function () {
        clearInterval(this.timer);
        this.timerFlag = true;
      }.bind(this),
      false
    );
    this.$refs.continueanimation.addEventListener(
      "click",
      function () {
        if (this.timerFlag) {
          this.map.getView().setCenter(this.center);
          // 添加事件，地图渲染时触发
          this.timer = setInterval(() => {
            moveFeature.call(this);
          }, 60);
        }
        this.timerFlag = false;
      }.bind(this),
      false
    );
    this.$refs.stopanimation.addEventListener(
      "click",
      function (ended) {
        clearInterval(this.timer);
        this.vectorLayer.getSource().clear();
        this.vectorLayer.getSource().addFeature(this.routeFeature);
        this.vectorLayer.getSource().addFeature(this.startMarker);
        this.vectorLayer.getSource().addFeature(this.endMarker);
      }.bind(this),
      false
    );
    function moveFeature(event) {
      if (!this.vectorLayer.getVisible()) {
        this.vectorLayer.setVisible(true);
      }
      var carStyle, rotation;
      // 开始动画
      this.elapsedTime++; // elapsedTime 已过时间
      this.index = Math.round(
        (Number(this.$refs.speed.value) * this.elapsedTime) / 60
      ); // 已经走了多少个点
      var x, y;
      if (this.index >= this.routeCoords.length) {
        clearInterval(this.timer);
        return;
      }
      if (this.routeCoords[this.index] && this.routeCoords[this.index + 1]) {
        x =
          this.routeCoords[this.index][0] - this.routeCoords[this.index + 1][0];
        y =
          this.routeCoords[this.index][1] - this.routeCoords[this.index + 1][1];
        // 返回从原点(0,0)到(x,y)点的线段与x轴正方向之间的弧度值
        rotation = Math.atan2(y, x);
      } else {
        rotation = 0;
      }
      carStyle = new Style({
        image: new Icon({
          src: this.$withBase("/data/icon.png"),
          rotateWithView: false,
          rotation:
            -rotation +
            Math.atan2(
              this.routeCoords[0][1] - this.routeCoords[1][1],
              this.routeCoords[0][0] - this.routeCoords[1][0]
            ) /
              2,
          scale: 0.6,
          anchor: [0.5, 0.5], // 图标中心
        }),
      });
      var line = new Feature({
        geometry: new LineString(this.routeCoords),
      });
      var lineStyle = new Style({
        stroke: new Stroke({
          width: 6,
          color: [237, 212, 0, 0.8],
        }),
      });
      line.setStyle(lineStyle);
      var currentPoint = new Point(this.routeCoords[this.index]);
      // 添加矢量元素
      var feature = new Feature(currentPoint);
      this.vectorLayer.getSource().clear();
      feature.setStyle(carStyle);
      this.vectorLayer.getSource().addFeature(this.routeFeature);
      this.vectorLayer.getSource().addFeature(this.startMarker);
      this.vectorLayer.getSource().addFeature(this.endMarker);
      this.vectorLayer.getSource().addFeature(feature);
      this.map.render();
    }
  },
};
</script>
<style>
.content {
  width: 100%;
  height: 100%;
  position: relative;
}
.map {
  width: 100%;
  height: 100%;
}
.handle{
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>