const API_URL = 'https://g-pim.onrender.com/api/medicine-info';

export const getMedicineAIInfo = async (medicineName) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      medicineName,
    }),
  });

  const data = await response.json();

  if (!data?.ok || !data?.aiInfo) {
    throw new Error(data?.message || 'Respuesta inválida de la API IA');
  }

  return data.aiInfo;
};