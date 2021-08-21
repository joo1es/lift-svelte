<script lang="ts">
    export let bornTime: Date
    export let nowTime: Date

    import {
        Button,
        TimePicker
    } from "carbon-components-svelte"

    $: nowTimeStamp = nowTime.getTime()
    
    $: currentMinute = ((nowTimeStamp - bornTime.getTime()) / 60 / 1000).toFixed(2)
    $: currentHour = ((nowTimeStamp - bornTime.getTime()) / 60 / 60 / 1000).toFixed(2)
    $: currentDay = ((nowTimeStamp - bornTime.getTime()) / 60 / 60 / 24 / 1000).toFixed(3)
    $: currentAge = ((nowTimeStamp - bornTime.getTime()) / 60 / 60 / 24 / 365.242 / 1000).toFixed(9)

    let nowStartTime = '08:30'

	if (localStorage.getItem('upTime')) {
		nowStartTime = localStorage.getItem('upTime')
	}

    $: offWorkTime = (() => {
        const [hour, min] = nowStartTime.split(':')
        if(Number(hour) < 8 || (Number(hour) === 8 && Number(min) < 30) ) return '17:30'
        return `${Number(hour) + 9}:${min}`
    })()

    $: computedSeconds = (() => {
        const [hour, min] = offWorkTime.split(':')
        return (new Date().setHours(Number(hour), Number(min), 0) - nowTimeStamp) / 1000
    })()

    $: leaveTimeSeconds = (() => {
        return Math.abs(computedSeconds).toFixed(0)
    })()
    $: leaveTimeMinutes = (Number(leaveTimeSeconds) / 60).toFixed(2)
    $: leaveTimeHours = (Number(leaveTimeMinutes) / 60).toFixed(2)

    let startTime = nowStartTime

    $: {
        const Rex = /^\d+:\d+$/
        if (Rex.test(startTime)) {
            nowStartTime = startTime
            localStorage.setItem('upTime', nowStartTime)
        }
    }

    let bornShow:boolean = !!localStorage.getItem('bornShow')

    $: {
        if (bornShow) {
            localStorage.setItem('bornShow', '1')
        } else {
            localStorage.removeItem('bornShow')
        }
    }

</script>

<div class="year">
    <div class="box">
        <div class="year-down">
            <div class="year-down-now">
                今日
                <TimePicker bind:value={startTime} size="xl" placeholder="hh:mm"></TimePicker>
                上班，距离 {offWorkTime} {computedSeconds > 0 ? '还剩' : '已经过去'}
            </div>
            <div class="year-down-how">
                {leaveTimeSeconds} <span class="year-down-minutes">秒</span><br>
                {leaveTimeMinutes} <span class="year-down-minutes">分钟</span><br>
                {leaveTimeHours} <span class="year-down-minutes">小时</span>
            </div>
        </div>
    </div>
    {#if bornShow}
        <div style="margin-top: 10px; color: #fff; font-size: 14px; line-height: 28px; text-align: center;">
            曾几何时,开始细数生辰
        </div>
        <div class="box">
            你已经 <span>{currentAge}</span> 岁了
        </div>
        <div class="box">
            <div class="year-down">
                <div class="year-down-now">
                    你存在
                </div>
                <div class="year-down-how">
                    {currentDay} <span class="year-down-minutes">天</span><br>
                    {currentHour} <span class="year-down-minutes">小时</span><br>
                    {currentMinute} <span class="year-down-minutes">分钟</span>
                </div>
            </div>
        </div>
    {/if}
    <Button kind="danger" on:click={() => bornShow = !bornShow}>生辰</Button> <slot/>
</div>

<style lang="scss">
    .year {
        line-height: 40px;
        font-size: 22px;
        // font-weight: bold;
        .box {
            text-align: center;
            font-size: 14px;
            > span {
                font-size: 22px;
            }
        }
        &-down {
            display: flex;
            font-size: 22px;
            &-now {
                font-size: 14px;
                text-align: left;
                line-height: 48px;
                flex: 1;
                // display: flex;
                :global(.bx--form-item) {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 10px;
                    max-width: 78px !important;
                    overflow: hidden;
                }
            }
            &-how {
                text-align: right;
                flex: 1;
            }
            &-minutes {
                font-size: 14px;
                vertical-align: middle;
            }
        }
        :global(.bx--btn--danger) {
            background-color: #ff8c00;
            &:hover {
                opacity: .9;
            }
        }
    }
</style>