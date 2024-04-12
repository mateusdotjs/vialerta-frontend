import { useEffect, useState } from "react";
import Select from "./Select";
import { useParams } from "react-router-dom";

const options = [
  {
    text: "Todas",
  },
  {
    text: "Velocidade reduzida",
  },
  {
    text: "Paralisada - falha nos trens",
  },
  {
    text: "Greve",
  },
];

const dateIntervals = [
  {
    timestamp: "1m",
    stateName: "month",
    header: "No último mês:",
  },
  {
    timestamp: "1w",
    stateName: "week",
    header: "Na última semana:",
  },
  {
    timestamp: "24h",
    stateName: "day",
    header: "No último dia:",
  },
  {
    timestamp: "1h",
    stateName: "hour",
    header: "Na última hora:",
  },
];

const TotalOcorrencias = () => {
  const [ocorrencias, setOcorrencias] = useState();
  const [type, setType] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    //cria estados para cada tempo
    const intervals = dateIntervals.map((dateInterval) => {
      return {
        timestamp: dateInterval.timestamp,
        callback: (count) => {
          setOcorrencias((ocorrencias) => ({
            ...ocorrencias,
            [dateInterval.stateName]: count,
          }));
        },
      };
    });

    //inicia  os fetchs
    setLoading(true);
    Promise.allSettled(
      intervals.map((interval) =>
        getCount(interval.timestamp, interval.callback)
      )
    ).finally(() => setLoading(false));

    //executa o fetch
    async function getCount(timestamp, callback) {
      const params = new URLSearchParams({
        time: timestamp,
        type,
      });

      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + `/ocorrencias/${id}?${params}`,
          {
            credentials: "include",
          }
        );

        const json = await response.json();
        callback(json.count.toString());
      } catch (error) {
        callback(null);
      }
    }
  }, [id, type]);

  return (
    <div className=" animate-slide">
      <h1 className="mb-3 text-lg font-semibold text-gray-950 md:text-xl">
        Total de ocorrências relatadas:
      </h1>
      <Select options={options} setType={setType} />
      {loading ? (
        "Carregando..."
      ) : (
        <table>
          <tbody>
            {dateIntervals.map((interval) => {
              return (
                <tr key={interval.header}>
                  <th className="text-left">{interval.header}</th>
                  <td className="pl-2">
                    {ocorrencias[interval.stateName]
                      ? ocorrencias[interval.stateName]
                      : "Dado indisponível"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TotalOcorrencias;
