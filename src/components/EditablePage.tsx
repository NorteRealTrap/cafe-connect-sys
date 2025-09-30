import React from 'react';

interface EditablePageProps {
  page: {
    id: string;
    título: string;
    corpo: string;
    imagem: string;
  };
}

export const EditablePage: React.FC<EditablePageProps> = ({ page }) => {
  return (
    <div data-sb-object-id={page.id}>
      <h1 data-sb-field-path="título">{page.título}</h1>
      <p data-sb-field-path="corpo">{page.corpo}</p>
      <img data-sb-field-path="imagem" src={page.imagem} alt="Imagem da página" />
    </div>
  );
};

export default EditablePage;