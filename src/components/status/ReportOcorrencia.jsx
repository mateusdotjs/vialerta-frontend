import { useContext, useState } from "react";
import Button from "../global/Button";
import Error from "../global/Error";
import Select from "./Select";
import { userContext } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";

const options = [
  {
    text: "Selecione uma ocorrência",
    placeholder: true,
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

const ReportOcorrencia = () => {
  const { user } = useContext(userContext);
  const [type, setType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();

  async function handleClick() {
    if (type == null) return;
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + `/ocorrencias/${id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            type,
            authorId: user.id,
          }),
        }
      );

      if (!response.ok) throw new Error("Erro ao reportar ocorrência");
      setError(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-slide">
      <Select
        options={options}
        label={"Reportar uma ocorrência:"}
        setType={setType}
      />
      <Button onClick={handleClick} disabled={loading} css={["w-full"]}>
        {loading ? "Carregando..." : "Relatar ocorrência"}
      </Button>
      {error && <Error error={error} />}
      {error === false && (
        <p className="mt-1 font-semibold text-green-600">Ocorrência enviada.</p>
      )}
    </div>
  );
};

export default ReportOcorrencia;
