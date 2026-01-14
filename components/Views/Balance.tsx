import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient.ts'; // Importamos el cable que acabas de crear
export const Balance = () => {
  // Estados para guardar la información de la base de datos
  const [utilidad, setUtilidad] = useState(0);
  const [ocupacion, setOcupacion] = useState(0);
  const [loading, setLoading] = useState(true);

  // Estados de los selectores (deben coincidir con tus botones)
  const [selectedMonth, setSelectedMonth] = useState('MAR');
  const [selectedYear, setSelectedYear] = useState(2024);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Obtenemos al usuario que inició sesión
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // 2. Buscamos sus datos específicos en la tabla
          const { data, error } = await supabase
            .from('reportes_mensuales')
            .select('ingreso_neto_distribuido, ocupacion_porcentaje')
            .eq('socio_id', user.id) // Filtro de seguridad: solo sus datos
            .eq('mes', selectedMonth)
            .eq('anio', selectedYear)
            .maybeSingle(); // Traemos solo una fila

          if (data) {
            setUtilidad(data.ingreso_neto_distribuido);
            setOcupacion(data.ocupacion_porcentaje);
          } else {
            // Si no hay datos para ese mes/año, volvemos a cero
            setUtilidad(0);
            setOcupacion(0);
          }
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedMonth, selectedYear]); // Se ejecuta cada vez que cambias el mes o año

  // AQUÍ VA TU DISEÑO (FRONTEND)
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Estado de Cuenta</h1>
      
      {/* Visualización de la Utilidad */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <p className="text-gray-500">Utilidad Neta Distribuida</p>
        <h2 className="text-4xl font-bold text-green-600">
          {loading ? 'Cargando...' : `$${utilidad.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        </h2>
      </div>

      {/* Aquí puedes seguir pegando el resto de tu diseño de UI (gráficas, etc.) */}
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-500">Ocupación Actual</p>
        <p className="text-3xl font-semibold">{ocupacion}%</p>
      </div>
    </div>
  );
};
