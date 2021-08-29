<script lang="ts">
	import { Button } from "carbon-components-svelte"
	import Login16 from "carbon-icons-svelte/lib/Login16"

	import { onDestroy } from 'svelte'

	import Init from './Init.svelte'
	import Now from './Now.svelte'

	let bornTime: Date | undefined
	if (localStorage.getItem('Born')) {
		bornTime = new Date(localStorage.getItem('Born'))
	}
	$: init = !bornTime as boolean

    let nowTime = new Date()
    const timeUpdater = setInterval(() => nowTime = new Date(), 4)
	onDestroy(() => clearInterval(timeUpdater))

	$: clearTime = () => {
		bornTime = undefined
		localStorage.removeItem('Born')
	}

	$: nowHours = nowTime.getHours()
	$: isNight = nowHours >= 18 || nowHours < 6

	const days = ['日', '一', '二', '三', '四', '五', '六']
</script>

<main style={`background-image: linear-gradient(to bottom, ${isNight ? '#353751, #222331' : 'rgb(15, 150, 258), rgb(38, 172, 232)'})`}>
	<div class="sun" style={`left: ${Math.min(Math.max(nowHours / 24 * 100, 40), 60)}%`} />
	<div class='step'>
		<div style="color: #fff; font-size: 24px; margin-bottom: 15px">
			{ nowTime.getHours().toString().padStart(2, '0') }:{ nowTime.getMinutes().toString().padStart(2, '0') }:{ nowTime.getSeconds().toString().padStart(2, '0') }
			<span style="font-size: 14px">周{days[nowTime.getDay()]}</span>
		</div>
		{#if init}
			<Init bind:bornTime/>
		{:else}
			<Now {bornTime} {nowTime}>
				<Button kind="secondary" on:click={clearTime} icon={Login16}>重新选择日期</Button>
			</Now>
		{/if}
	</div>
</main>

<style lang='scss'>
	:global(body) {
		overflow: hidden;
	}
    .sun {
        position: fixed;
        height: 100px;
        width: 100px;
        background-image: linear-gradient(to bottom, orange, #ff8c00);
        top: 10vh;
		left: 0;
        border-radius: 50%;
    }
	main {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		overflow: hidden;
		// background-image: url(/img/bg.jpg);
		// background-size: cover;
	}
	.step {
		// background-color: #ffffffc0;
		// backdrop-filter: blur(10px);
		// padding: 20px;
		// border-radius: 5px;
		z-index: 1;
		width: 720px;
		@media (max-width: 720px) {
			padding: 0 10px;
			width: 100%;
		}
		// box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		:global(.bx--btn) {
			margin-top: 10px;
		}
	}
	:global(.box) {
		background-color: #ffffff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		padding: 20px;
		border-radius: 5px;
		z-index: 1;
		&:not(:first-child) {
			margin-top: 10px;
		}
	}
</style>