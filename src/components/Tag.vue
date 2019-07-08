<template>
  <div>
    <span><slot /></span>
  </div>
</template>

<style scoped>
div {
  border-radius: 4px;
}

span {
  color: white;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
  font-size: 0.75rem;
  height: 2em;
  line-height: 1.5;
  font-style: inherit;
  font-weight: inherit;
  -webkit-box-align: center;
  align-items: center;
  display: inline-flex;
  -webkit-box-pack: center;
  justify-content: center;
}
</style>
