export const paginate = async (schema, query, page, document_per_page) =>{
    let total_documents = await schema.countDocuments(query)
    let total_pages = Math.ceil(total_documents/ document_per_page)
    let limit = document_per_page
    let skip = (page - 1) * document_per_page;
    let docs = await schema.find(query).skip(skip).limit(limit);
    let result = {
      total_documents: total_documents,
      total_pages: total_pages,
      current_page: page,
      document_per_page: document_per_page,
    };
    if (docs.length === 0) result.message = 'No documents found';
    else result.documents = docs;
    return result;
}