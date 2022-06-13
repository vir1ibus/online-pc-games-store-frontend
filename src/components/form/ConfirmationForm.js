import { useFormik } from "formik";
import { signIn } from "../../scripts/api";
let $ = require( "jquery" );

function ConfirmationForm(props) {
    const confirmationForm = useFormik({
        initialValues: {
            confirmCode: ''
        },
        onSubmit: async values => {
            await signIn(values.login, values.password).then(response => {
                $(".offcanvas-backdrop").hide();
            });
        }
    });

    return (
        <div className="form-check">
            <form className={confirmationForm.errors['confirmation'] ?
                ("d-flex flex-column align-content-center justify-content-center is-invalid") :
                ("d-flex flex-column align-content-center justify-content-center")}
                  onSubmit={confirmationForm.handleSubmit}>
                <div className="mt-2 mb-2">
                    <input name="confirmCode"
                           placeholder="Код подтверждения"
                           className="form-control rounded-pill"
                           onChange={confirmationForm.handleChange}
                           value={confirmationForm.values.login}
                           required/>
                </div>
                <button className="btn btn-primary rounded-pill" type="submit">Подтвердить</button>
            </form>
            <div className="invalid-feedback">
                Неправильный код.
            </div>
        </div>
    );
}

export default ConfirmationForm;