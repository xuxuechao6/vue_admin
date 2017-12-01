<template>
	<div class="wrapper">
		<v-head></v-head>
		<v-sidebar></v-sidebar>
		<div class="content">
			<transition name="move" mode="out-in">
				<router-view></router-view>
			</transition>
		</div>
	</div>
</template>

<script>

	import vHead from './Header.vue';
	import vSidebar from './Sidebar.vue';
	export default {
		components: {
			vHead,
			vSidebar
		},

        data() {
            return {
            }
        },

	}

</script>
<style>
  .ms-doc {
    width: 100%;
    min-width: 650px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  }

  .ms-doc h3 {
    padding: 9px 10px 10px;
    margin: 0;
    font-size: 14px;
    line-height: 25px;
    background-color: #f5f5f5;
    border: 1px solid #d8d8d8;
    border-bottom: 0;
    border-radius: 3px 3px 0 0;
  }

  .ms-doc article {
    padding: 45px;
    word-wrap: break-word;
    background-color: #fff;
    border: 1px solid #ddd;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  .ms-doc article>div {
    padding: 10px 0;
  }
  .btn_back {
		color: #00d1b2;
		cursor: pointer;
	}
</style>
