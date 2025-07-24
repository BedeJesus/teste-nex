export default interface ITransaction {
  id: number;
  cpf: string;
  description: string;
  transactionDate: string;
  valueInPoint: number;
  value: number;
  status: string;
}