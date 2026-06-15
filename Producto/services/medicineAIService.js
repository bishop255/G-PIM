const API_URL = 'http://192.168.1.100:3001/api/medicine-info';

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