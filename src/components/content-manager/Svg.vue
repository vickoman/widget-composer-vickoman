<template>
    <div>
        <svg>
            <use :xlink:href="icon"></use>
        </svg>
    </div>
</template>
<script>
    export default {
        name: 'svg',
        props:['icon']
    }
</script>