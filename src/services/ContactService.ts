import ContactModel, { IContact } from '../model/Contact';
import { FilterQuery } from 'mongoose';

class ContactService {
  public async create(data: Partial<IContact>, userId: string): Promise<IContact> {
    try {
      const contactData = { ...data, user: userId };
      const contact = new ContactModel(contactData);
      await contact.save();
      return contact;
    } catch (error) {
      console.error('Erro ao criar contato:', error);
      throw new Error('Erro ao criar contato.');
    }
  }

  public async getAll(userId: string, filters: FilterQuery<IContact>): Promise<IContact[]> {
    try {
      const query: FilterQuery<IContact> = { user: userId };

      if (filters.name) {
        query.name = { $regex: filters.name, $options: 'i' };
      }
      if (filters.email) {
        query.email = { $regex: filters.email, $options: 'i' };
      }

      const contacts = await ContactModel.find(query);
      return contacts;
    } catch (error) {
      console.error('Erro ao listar contatos:', error);
      throw new Error('Erro ao listar contatos.');
    }
  }

  // --- NÓS ESTAMOS ADICIONANDO ESTES MÉTODOS ABAIXO ---

  /**
   * Busca um contato específico pelo ID, mas APENAS se ele pertencer ao usuário.
   * @param contactId ID do Contato
   * @param userId ID do Usuário logado
   * @returns O contato encontrado ou null
   */
  public async getById(contactId: string, userId: string): Promise<IContact | null> {
    try {
      // A MÁGICA DA SEGURANÇA:
      // Procura um documento que tenha ao MESMO TEMPO o _id e o user: userId.
      // Se o ID existir mas for de outro usuário, ele não encontrará.
      const contact = await ContactModel.findOne({ _id: contactId, user: userId });
      return contact;
    } catch (error) {
      console.error('Erro ao buscar contato por ID:', error);
      throw new Error('Erro ao buscar contato por ID.');
    }
  }

  /**
   * Substitui (PUT) um contato, garantindo a posse.
   * @param contactId ID do Contato
   * @param userId ID do Usuário
   * @param data Novos dados (substituição completa)
   * @returns O contato atualizado ou null
   */
  public async replace(contactId: string, userId: string, data: IContact): Promise<IContact | null> {
    try {
      // O 'findOneAndReplace' substitui o objeto inteiro.
      // A query de filtro {_id: contactId, user: userId} garante que o usuário
      // só possa substituir um contato que lhe pertence.
      const updatedContact = await ContactModel.findOneAndReplace(
        { _id: contactId, user: userId },
        { ...data, user: userId }, // Garante que o 'user' não seja alterado
        { new: true, runValidators: true } // 'new: true' retorna o documento novo
      );
      return updatedContact;
    } catch (error) {
      console.error('Erro ao substituir (PUT) contato:', error);
      throw new Error('Erro ao substituir contato.');
    }
  }

  /**
   * Atualiza parcialmente (PATCH) um contato, garantindo a posse.
   * @param contactId ID do Contato
   * @param userId ID do Usuário
   * @param data Dados parciais (ex: { email: "novo@email.com" })
   * @returns O contato atualizado ou null
   */
  public async update(contactId: string, userId: string, data: Partial<IContact>): Promise<IContact | null> {
    try {
      // 'findOneAndUpdate' faz a "mesclagem" (merge) dos dados.
      const updatedContact = await ContactModel.findOneAndUpdate(
        { _id: contactId, user: userId },
        data,
        { new: true, runValidators: true }
      );
      return updatedContact;
    } catch (error) {
      console.error('Erro ao atualizar (PATCH) contato:', error);
      throw new Error('Erro ao atualizar contato.');
    }
  }

  /**
   * Deleta um contato, garantindo a posse.
   * @param contactId ID do Contato
   * @param userId ID do Usuário
   * @returns O contato que foi deletado ou null
   */
  public async deleteById(contactId: string, userId: string): Promise<IContact | null> {
    try {
      // 'findOneAndDelete' encontra e deleta, mas só se o 'user' bater.
      const deletedContact = await ContactModel.findOneAndDelete({ _id: contactId, user: userId });
      return deletedContact;
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
      throw new Error('Erro ao deletar contato.');
    }
  }
}

export default new ContactService();