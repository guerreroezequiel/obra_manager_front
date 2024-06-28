<template>
  <div :class="{ 'w-80 ease-out ': open, 'w-0 ease-in': !open }"
    class="flex flex-col sticky top-0 left-0 h-screen pt-10 bg-neutral-50 justify-center text-stone-700 duration-300 border-r-2 border-r-neutral-400">

    <button :class="{ 'ease-out': open, 'ease-in': !open }" @click="open = !open"
      class="absolute -right-9 p-1 bg-gray-200 border-r-2 border-b-2 border-neutral-400 text-black top-24  rounded-r-xl transition-all items-center active:scale-95 duration-100">
      <Icon v-if="open" name="mdi:folder-open-outline" class="h-12 hover:cursor-pointer " size="25">
      </Icon>
      <Icon v-else name="mdi:folder-search-outline" class="h-12 hover:cursor-pointer " size="25"></Icon>
    </button>

    <button :class="{ 'ease-out bg-gray-200': !isEditing, 'ease-in bg-red-300': isEditing }"
      @click="isEditing = !isEditing"
      class="absolute -right-9 p-1  border-r-2 border-b-2 border-neutral-400 text-black top-40  rounded-r-xl transition-all items-center active:scale-95 duration-100">
      <Icon v-if="!isEditing" name="simple-line-icons:pencil" class="h-12 hover:cursor-pointer " size="25">
      </Icon>
      <Icon v-else name="simple-line-icons:ban" class="h-12 hover:cursor-pointer " size="25"></Icon>
    </button>

    <button v-show="isEditing" @click="isEditing = !isEditing"
      class="absolute -right-9 p-1 bg-blue-300 border-r-2 border-b-2 border-neutral-400 text-black top-56  rounded-r-xl transition-all items-center active:scale-95 duration-100">
      <Icon name="line-md:confirm" class="h-12 hover:cursor-pointer " size="25"></Icon>
    </button>

    <div class="flex flex-col mt-12 items-center p-4 " v-if="obra"
      :class="{ 'visible delay-150': open, 'invisible duration-150': !open }">
      <div class="flex flex-row min-h-10 w-full justify-between ring-1 focus:ring-blue-500 rounded-md">
        <input class="p-1 rounded-l-md w-5/6 bg-gray-200 focus:outline-none text-black " type="text"
          placeholder="Buscar" />
        <button class="flex w-1/6 bg-slate-400 rounded-r-md items-center justify-center active:scale-95">
          <Icon name="simple-line-icons:magnifier" class=""></Icon>
        </button>
      </div>

      <div class="flex flex-col ml-5 p-2 ">
        <button>Favorito 1</button>
        <button>Favorito 2</button>
        <button>Favorito 3</button>
      </div>
    </div>
    <div class="h-full overflow-x-auto">
      <div class="ml-5" v-if="obra" :class="{ 'visible delay-150': open, 'invisible duration-150': !open }">
        <ul>
          <li class="p-4">
            <a href="#" class=" p-4">{{ obra.obra.nombre }}</a>
            <ul>
              <li class=" p-4 border" v-for="etapa in obra.obra.etapas" :key="etapa.id">
                <a href="#" class=" p-4">{{ etapa.nombre }}</a>
                <ul>
                  <li class=" p-4 border" v-for="modulo in etapa.modulos" :key="modulo.id">
                    <a href="#" class=" p-4">{{ modulo.nombre }}</a>
                    <ul>
                      <li class=" p-4" v-for="tarea in modulo.tareas" :key="tarea.id">
                        <a href="#" class=" p-4 border">{{ tarea.nombre }}</a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    table: {
      type: String,
      required: true
    }
  },

  setup(props) {
    let obra = ref(null);
    let open = ref(false);
    let isEditing = ref(false);

    onMounted(async () => {
      const response = await fetch(`http://localhost:3333/${props.table}/${props.id}/relations`);
      // console.log(props.table, props.id)
      if (response.ok) {
        obra.value = await response.json();
      } else {
        console.error('HTTP-Error-del-SIDEBAR: ' + response.status);
      }
    });

    return {
      obra,
      open,
      isEditing,
    };
  },
};
</script>
