<template>
  <table ref="info">
    <tr>
      <td>All features:</td>
      <td ref="all"></td>
    </tr>
    <tr>
      <td>Hotel features:</td>
      <td ref="hotel"></td>
    </tr>
    <tr>
      <td>Restaurant features:</td>
      <td ref="restaurant"></td>
    </tr>
  </table>
</template>

<script>
export default {
  async mounted() {
    let {
      format: { WMSGetFeatureInfo },
    } = ol
    let res = await this.$axios({
      type:'get',
      url:this.$withBase("/data/wmsgetfeatureinfo/osm-restaurant-hotel.xml")
    })
    const allFeatures = new WMSGetFeatureInfo().readFeatures(res.data)
    this.$refs.all.innerText = allFeatures.length.toString()
    const hotelFeatures = new WMSGetFeatureInfo({
      layers: ["hotel"],
    }).readFeatures(res.data)
    this.$refs.hotel.innerText = hotelFeatures.length.toString()
    const restaurantFeatures = new WMSGetFeatureInfo({
      layers: ["restaurant"],
    }).readFeatures(res.data)
    this.$refs.restaurant.innerText = restaurantFeatures.length.toString()
  },
}
</script>