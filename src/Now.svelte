<script lang="ts">
    export let bornTime: Date
    export let nowTime: Date

    import {
        Button,
        TimePicker,
        Checkbox,
        TextArea
    } from "carbon-components-svelte"

    import Add16 from "carbon-icons-svelte/lib/Add16"

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

    interface todo {
        description?: string,
        finished: boolean,
        inputing: boolean,
        expiration: number | boolean
    }

    let getTodo = localStorage.getItem('todos')
    let defaultTodo = []
    if (getTodo) {
        defaultTodo = JSON.parse(getTodo)
        if (Array.isArray(defaultTodo)) {
            defaultTodo = defaultTodo.filter(todo => {
                return !todo.expiration || todo.expiration > nowTime.getTime()
            })
        }
    }

    let todos: todo[] = defaultTodo

    const addTodo = () => {
        todos.push({
            inputing: true,
            finished: false,
            expiration: false
        })
        todos = [...todos]
    }

    $: {
        localStorage.setItem('todos', JSON.stringify(todos))
    }

</script>

<div class="year">
    <div class="year-content">
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
        {#each todos as todo}
            <div class={todo.finished ? 'finished box todo' : 'box todo'} on:dblclick={() => todo.inputing = !todo.inputing}>
                <Checkbox labelText={todo.description || ''} bind:checked={todo.finished} on:change={() => {
                    if (!todo.finished) {
                        todo.expiration = new Date().getTime() + 86400000
                    } else {
                        todo.expiration = false
                    }
                }}/>
                {#if todo.inputing}
                    <TextArea bind:value={todo.description} />
                {/if}
            </div>
        {/each}
    </div>
    <Button kind="danger" on:click={() => bornShow = !bornShow}>生辰</Button> <Button kind="danger" on:click={addTodo} icon={Add16}>待办</Button> <slot/>
</div>

<style lang="scss">
    ::-webkit-scrollbar {
        display: none; /* Chrome Safari */
    }
    .year {
        line-height: 40px;
        font-size: 22px;
        &-content {
            max-height: calc(100vh - 400px);
            overflow: auto;
            scrollbar-width: none;
        }
        // font-weight: bold;
        .box {
            text-align: center;
            font-size: 14px;
            > span {
                font-size: 22px;
            }
            &.todo {
                text-align: left;
                padding: 10px;
                :global(.bx--text-area__wrapper){
                    width: calc(100% + 20px);
                    margin-bottom: -10px;
                    margin-left: -10px;
                    margin-right: -10px;
                    margin-top: 5px;
                }
                :global(.bx--checkbox-label-text){
                    line-height: 1.3em;
                }
                // :global(.bx--form-item){
                //     .bx--checkbox:checked {
                //         + .bx--checkbox-label {
                //             text-decoration: overline;
                //         }
                //     }
                // }
            }
            &.finished {
                :global(.bx--checkbox-wrapper){
                    opacity: .3;
                }
                :global(.bx--checkbox-label-text){
                    text-decoration: line-through;
                }
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