let uidCouter = 0;

export default class File {
  name: string;
  content: string;
  uid: number;

  constructor(obj: { name: string, content?: string }) {
    this.name = obj.name;
    this.content = obj.content || '';
    this.uid = File.getUid();
  }

  static getUid() {
    uidCouter += 1;
    return uidCouter;
  }
}
