import {
  createNewFormInput,
  CreateNewFormInputType,
  getCreatedFormInput,
  GetCreatedFormInputType,
  getOneSpecificForm,
  GetOneSpecificFormInputType,
  updateCreatedFormInput,
  UpdateCreatedFormInputType,
} from "./model";

class FormService {
  public async createNewForm(paylaod: CreateNewFormInputType) {
    const {
      title,
      description,
      createdBy,
      slug,
      status,
      visibilityMode,
      isPasswordProtected,
      passwordHash,
      expiresAt,
    } = await createNewFormInput.parseAsync(paylaod);
  }

  public async getCreatedForms(payload: GetCreatedFormInputType) {
    const { userId } = await getCreatedFormInput.parseAsync(payload);
  }

  public async updateCreatedForm(payload: UpdateCreatedFormInputType) {
    const {
      formId,
      title,
      description,
      slug,
      status,
      visibilityMode,
      isPasswordProtected,
      passwordHash,
      expiresAt,
    } = await updateCreatedFormInput.parseAsync(payload);
  }

  public async getOneSpcificForm(payload: GetOneSpecificFormInputType) {
    const { formId } = await getOneSpecificForm.parseAsync(payload);
  }
}

export { FormService };
