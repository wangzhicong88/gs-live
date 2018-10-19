<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  
  name: 'App'
}
</script>

<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.regBtn {
	width: 100%;
	padding: 0;
	height: .85rem;
	font-size: .3rem;
}
.login-main {
  .bd {
    padding: .8rem .5rem .3rem .5rem;
  }
  .pwsLogin {
    text-align: center;
    margin-top: 10px;
    .link {
      display: block;
      color: #999;
      font-size: 14px;
    }
  }
  .login-head {
    background: url(assets/img/login-hend.jpg) no-repeat 50% 0;
		background-size: cover;
		height: 3.84rem;
		display: -webkit-box;
		  display: -webkit-flex;
		  display: box;
		  display: flex;
		justify-content: center;
		-webkit-justify-content: center;
		align-items: center;
		-webkit-align-items: center;
		.logo {
			width: 17%;
		}
  }
  li {margin-bottom: .5rem}
	li.item-input {
		border-bottom: 1px solid #feb900;
		height: .8rem;
    line-height: .8rem;
    input {color: #feb900;}
    input:focus{
      outline: none;  
    }
		.input {
			border:0;
			height: .8rem;
      background: none;
      font-size: 0.28rem;
    }
    input:-webkit-autofill {
		  -webkit-box-shadow: 0 0 0px 1000px white inset;
		}
		.txt-vcode {
			width: 75%
		}
		.reg-vcode {
			padding: 0 .2rem;
			color: #ffffff;
			height: .6rem;
			background: #FF5600;
    }
    .reg-vcode.codeGray {
      opacity: .7;
    }
	} 
	li.item-input:before {
		content: "";
		background: url(assets/img/Student-active.png) no-repeat;
		background-size: .36rem auto;
		width: .5rem;
		height: .36rem;
		display: block;
	}
	li.item-input:nth-child(2):before {
		content: "";
		background: url(assets/img/Pass.png) no-repeat;
		background-size: .36rem auto;
		width: .5rem;
		height: .38rem;
		display: block;
	}
	.item-text,
	.item-text a {
		color: #888888;
		font-size: 0.26rem;
		padding-bottom: 0.5rem;
	}
	.item-text a  {
		display: block;
		line-height: .8rem;
	}
	.item-text.tac,
	.item-submit {padding-bottom: 0;}
	.regBtnGray {
		background: #cdcdcd;
	}
}
</style>