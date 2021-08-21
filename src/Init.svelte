<script lang="ts">
    export let bornTime: Date | undefined = undefined;

    import { Button, DatePicker, DatePickerInput } from "carbon-components-svelte"

    let defaultTime = '06/05/1999'

	$: handleFinish = () => {
        bornTime = new Date(defaultTime)
		localStorage.setItem('Born', bornTime.toString())
	}
</script>

<!-- <div class='step-title'>
    设置
</div> -->

<div class="box">

    <DatePicker
        datePickerType="single"
        bind:value={defaultTime}
    >
        <DatePickerInput labelText="出生日期" placeholder="mm/dd/yyyy" />
    </DatePicker>

</div>

<Button kind="secondary" on:click={handleFinish}>完成</Button>

<!-- <style lang="scss">
    .step-title {
        font-size: 32px;
        margin-bottom: 20px;
        font-weight: bold;
        // color: rgb(15, 98, 254);
        color: #fff;
    }
</style> -->