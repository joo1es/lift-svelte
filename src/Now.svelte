<script lang="ts">
    export let bornTime: Date
    export let nowTime: Date

    import {
        TimePicker,
    } from "carbon-components-svelte"

    $: nowTimeStamp = nowTime.getTime()

    $: currentTime = ((nowTimeStamp - bornTime.getTime()) / 60 / 60 / 24 / 365.242 / 1000).toFixed(9)

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

</script>

<div class="year">
    <!-- <div class="box">
        你已经 <span>{currentTime}</span> 岁了
    </div> -->
    <div class="box">
        <div class="year-down">
            <div class="year-down-now">
                今日
                <TimePicker bind:value={startTime} size="xl" placeholder="hh:mm"></TimePicker>
                上班，距离 {offWorkTime} {computedSeconds > 0 ? '还剩' : '过去'}
            </div>
            <div class="year-down-how">
                {leaveTimeSeconds} <span class="year-down-minutes">秒</span><br>
                {leaveTimeMinutes} <span class="year-down-minutes">分钟</span><br>
                {leaveTimeHours} <span class="year-down-minutes">小时</span>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .year {
        line-height: 40px;
        font-size: 22px;
        // font-weight: bold;
        .box {
            text-align: center;
            // > span {
            //     font-size: 32px;
            // }
        }
        &-down {
            display: flex;
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
    }
</style>