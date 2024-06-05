<template>
  <div :class="{ 'w-80 ease-out ': open, 'w-0 ease-in': !open }"
    class="flex flex-col sticky top-0 left-0 h-screen pt-10 bg-zinc-300 text-stone-700 duration-300">

    <button :class="{ 'ease-out': open, 'ease-in opacity-80': !open }" @click="open = !open"
      class="absolute -right-8 p-1 bg-zinc-300 border-r-2 border-b-2 border-stone-600 text-black top-20  rounded-r-xl transition-all duration-300 items-center hover:opacity-100 hover:text-white">
      <Icon v-if="open" name="mdi:folder-open-outline" class="h-12 hover:cursor-pointer " size="25">
      </Icon>
      <Icon v-else name="mdi:folder-search-outline" class="h-12 hover:cursor-pointer " size="25"></Icon>
    </button>

    <div class="flex flex-col my-10 p-2" v-if="obra"
      :class="{ 'visible delay-150': open, 'invisible duration-150': !open }">
      <input class="rounded-md p-2 w-5/6 bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text" placeholder="Buscar" />
      <button>O</button>
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
              <li class=" p-4" v-for="etapa in obra.obra.etapas" :key="etapa.id">
                <a href="#" class=" p-4">{{ etapa.nombre }}</a>
                <ul>
                  <li class=" p-4" v-for="modulo in etapa.modulos" :key="modulo.id">
                    <a href="#" class=" p-4">{{ modulo.nombre }}</a>
                    <ul>
                      <li class=" p-4" v-for="tarea in modulo.tareas" :key="tarea.id">
                        <a href="#" class=" p-4">{{ tarea.nombre }}</a>
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
    let open = ref(true);

    onMounted(async () => {
      const response = await fetch(`http://localhost:3333/${props.table}/${props.id}/details`);
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
    };
  },
};
</script>
