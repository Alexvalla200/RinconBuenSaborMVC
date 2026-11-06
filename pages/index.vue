<template>
  <div style="padding: 2rem; font-family: sans-serif; max-width: 800px; margin: auto;">
    <h2> Ingresar Nuevo Plato</h2>

    <!-- Formulario de Registro -->
    <form @submit.prevent="guardarPlato" style="display: flex; flex-direction: column; gap: 1rem; background: #f9fafb; padding: 1.5rem; border-radius: 8px; border: 1px solid #e5e7eb;">
      <div style="display: flex; flex-direction: column;">
        <label style="font-weight: 600; margin-bottom: 0.3rem;">Nombre del Plato:</label>
        <input type="text" v-model="formulario.nombre" placeholder="Ej. Seco de Pollo, Sopa de Res..." required style="padding: 0.6rem; border: 1px solid #d1d5db; border-radius: 4px;" />
      </div>
      
      <div style="display: flex; flex-direction: column;">
        <label style="font-weight: 600; margin-bottom: 0.3rem;">Tipo (Sopa o Segundo):</label>
        <select v-model="formulario.tipo_id" required style="padding: 0.6rem; border: 1px solid #d1d5db; border-radius: 4px;">
          <option value="1">Sopa</option>
          <option value="2">Segundo</option>
        </select>
      </div>

      <!-- Dropdown 1: Categoría -->
      <div style="display: flex; flex-direction: column;">
        <label style="font-weight: 600; margin-bottom: 0.3rem;">Grupo de Alimento:</label>
        <select v-model="categoriaSeleccionada" @change="filtrarProteinas" required style="padding: 0.6rem; border: 1px solid #d1d5db; border-radius: 4px;">
          <option value="">Seleccione un grupo...</option>
          <option v-for="cat in categoriasDb" :key="cat.id" :value="cat.id">
            {{ cat.nombre }}
          </option>
        </select>
      </div>

      <!-- Dropdown 2: Proteína en cascada -->
      <div style="display: flex; flex-direction: column;">
        <label style="font-weight: 600; margin-bottom: 0.3rem;">Proteína Específica:</label>
        <select v-model="formulario.proteina_id" :disabled="!proteinasFiltradas.length" required style="padding: 0.6rem; border: 1px solid #d1d5db; border-radius: 4px;">
          <option value="">Seleccione la proteína...</option>
          <option v-for="prot in proteinasFiltradas" :key="prot.id" :value="prot.id">
            {{ prot.nombre }}
          </option>
        </select>
      </div>

      <button type="submit" style="padding: 0.8rem; background-color: #2563eb; color: white; font-weight: bold; cursor: pointer; border: none; border-radius: 4px; margin-top: 0.5rem;">
        Guardar Plato
      </button>
    </form>

    <!-- ÁREA INFERIOR: Cuadro de Platos Registrados -->
    <div style="margin-top: 3rem; border: 2px solid #ef4444; padding: 1.5rem; border-radius: 8px; background: #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
      <h3 style="margin-top: 0; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem;">Menú de Platos Registrados en el Sistema</h3>
      
      <div v-if="platosList.length === 0" style="color: #6b7280; text-align: center; padding: 2rem;">
        No hay platos registrados todavía. ¡Agrega el primero arriba!
      </div>

      <table v-else style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
        <thead>
          <tr style="background-color: #f3f4f6; text-align: left; border-bottom: 2px solid #d1d5db;">
            <th style="padding: 0.75rem;">Plato</th>
            <th style="padding: 0.75rem;">Tipo</th>
            <th style="padding: 0.75rem;">Grupo</th>
            <th style="padding: 0.75rem;">Proteína</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plato in platosList" :key="plato.id" style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 0.75rem; font-weight: 500;">{{ plato.nombre }}</td>
            <td style="padding: 0.75rem;">
              <span :style="{ background: plato.tipo === 'Sopa' ? '#dbeafe' : '#fef3c7', color: plato.tipo === 'Sopa' ? '#1e40af' : '#92400e', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }">
                {{ plato.tipo }}
              </span>
            </td>
            <td style="padding: 0.75rem;">{{ plato.categoria }}</td>
            <td style="padding: 0.75rem; font-weight: 600; color: #2563eb;">{{ plato.proteina }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const formulario = ref({ nombre: '', tipo_id: 1, proteina_id: '' })
const categoriaSeleccionada = ref('')
const proteinasFiltradas = ref([])
const platosList = ref([])

// Categorías sincronizadas con tu BD
const categoriasDb = [
  { id: 1, nombre: 'Carnes Rojas' },
  { id: 2, nombre: 'Aves' },
  { id: 3, nombre: 'Mariscos' }
]

// Proteínas organizadas por categoría de acuerdo a tu base de datos
const proteinasPorCategoria = {
  1: [
    { id: 1, nombre: 'Res' }, 
    { id: 2, nombre: 'Cerdo' }
  ],
  2: [
    { id: 3, nombre: 'Pollo' }
  ],
  3: [
    { id: 4, nombre: 'Tilapia' }, 
    { id: 5, nombre: 'Albacora' }, 
    { id: 6, nombre: 'Camarón' }
  ]
}

const filtrarProteinas = () => {
  formulario.value.proteina_id = ''
  proteinasFiltradas.value = categoriaSeleccionada.value ? proteinasPorCategoria[categoriaSeleccionada.value] : []
}

// Función para obtener los platos de la base de datos
const obtenerPlatos = async () => {
  try {
    const res = await $fetch('/api/platos')
    if (res.success) {
      platosList.value = res.platos
    }
  } catch (error) {
    console.error('Error al cargar la lista de platos:', error)
  }
}

// Función para guardar plato y actualizar la tabla automáticamente
const guardarPlato = async () => {
  try {
    await $fetch('/api/platos', {
      method: 'POST',
      body: formulario.value
    })
    
    alert('¡Plato guardado con éxito en SQL Server!')
    
    // Limpiar formulario
    formulario.value.nombre = ''
    formulario.value.tipo_id = 1
    formulario.value.proteina_id = ''
    categoriaSeleccionada.value = ''
    proteinasFiltradas.value = []

    // Recargar la tabla inmediatamente
    await obtenerPlatos()
  } catch (error) {
    alert(error?.data?.statusMessage || 'Error al guardar el plato')
  }
}

// Cargar los platos automáticamente al abrir la página
onMounted(() => {
  obtenerPlatos()
})
</script>