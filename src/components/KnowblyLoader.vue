<template>
    <div>
        <svg class="kds--svg-standard know-rotate-animation">
            <use xlink:href="#redo"></use>
        </svg>
        <div class="align-center">
            {{text || 'Loading' }}...
        </div>
    </div>
</template>

<script>
export default {
    name: 'knowbly-loader',
    props:['text']
}
</script>


