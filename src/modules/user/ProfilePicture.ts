import { Resolver, Mutation, Arg } from "type-graphql";
import { default as GraphQLUpload } from "graphql-upload/GraphQLUpload.mjs";
import { createWriteStream } from "fs";
import { Upload } from "../../types/Upload";

@Resolver()
export class ProfilePictureResolver {
  @Mutation(() => Boolean)
  async addProfilePicture(
    @Arg("picture", () => GraphQLUpload) { createReadStream, filename }: Upload
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(__dirname + `/../../../images/${filename}`))
        .on("finish", () => resolve(true))
        .on("error", () => reject(false))
    );
  }
}
