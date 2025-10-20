import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (value) => {
    setSelected(value);
    setError(false);
  };

  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();

      // 🔍 Vérification stricte : doit être "Personnel" ou "Entreprise"
      if (selected !== "Personnel" && selected !== "Entreprise") {
        setError(true);
        return;
      }

      setSending(true);
      try {
        await mockContactApi();
        setSending(false);
        onSuccess();
      } catch (err) {
        setSending(false);
        onError(err);
      }
    },
    [selected, onSuccess, onError]
  );

  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field placeholder="Entrez votre Nom" label="Nom" />
          <Field placeholder="Entrez votre Prénom" label="Prénom" />

          <Select
            selection={["Personnel", "Entreprise"]}
            value={selected}
            onChange={handleChange}
            label="Personnel / Entreprise"
            type="large"
          />

          {error && (
            <p style={{ color: "red", marginTop: "4px" }}>
              ⚠️ Veuillez sélectionner `Personnel` ou `Entreprise`.
            </p>
          )}

          <Field
            placeholder="Entrez votre Email"
            label="Email"
            type="Email"
          />
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
}

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
}

export default Form;
