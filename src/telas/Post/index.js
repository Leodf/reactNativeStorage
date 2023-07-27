import { useState } from "react";
import {
  Image,
  LogBox,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IconeClicavel } from "../../componentes/IconeClicavel";
import { MenuSelecaoInferior } from "../../componentes/MenuSelecaoInferior";
import {
  atualizarPost,
  deletarPost,
  salvarPost,
} from "../../servicos/firestore";
import { deletarImagem, salvarImagem } from "../../servicos/storage";
import {
  alteraDados,
  escolherImagemDaGaleria,
  verificarItens,
} from "../../utils/comum";
import { entradas } from "./entradas";
import estilos from "./estilos";

const imagemGalaxia =
  "https://img.freepik.com/fotos-gratis/fundo-de-galaxia-espacial_53876-93121.jpg?w=1380&t=st=1670244963~exp=1670245563~hmac=f67b50518f25bd1278963ec472362c64905851115ae154cc3866fd99a3cea7c1";

import uploadImagemPadrao from "../../assets/upload.jpeg";

LogBox.ignoreAllLogs();

export default function Post({ navigation, route }) {
  const [desabilitarEnvio, setDesabilitarEnvio] = useState(false);
  const { item } = route?.params || {};

  const [imagem, setImagem] = useState(item?.imagemUrl || null);
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const [post, setPost] = useState({
    titulo: item?.titulo || "",
    fonte: item?.fonte || "",
    descricao: item?.descricao || "",
    imagemUrl: item?.imagemUrl || null,
  });

  async function salvar() {
    setDesabilitarEnvio(true);

    if (item) {
      if (!verificarItens(post.imagemUrl, imagem)) {
        atualizarPostComImagem(item.id);
      }
      atualizarPost(item.id, post);
      return navigation.goBack();
    }

    const idPost = await salvarPost({
      ...post,
      imagemUrl: imagem ? "" : null,
    });
    navigation.goBack();

    if (imagem != null) {
      atualizarPostComImagem(idPost);
    }
  }

  async function atualizarPostComImagem(idPost) {
    const url = await salvarImagem(imagem, idPost);
    await atualizarPost(idPost, {
      imagemUrl: url,
    });
  }

  async function removerImagemPost() {
    if (!item) return;
    if (await deletarImagem(item.id)) {
      await atualizarPost(item.id, {
        imagemUrl: null,
      });
      navigation.goBack();
    }
  }

  async function excluirPostCompleto() {
    if (!item) return;
    deletarPost(item.id);
    if (item.imagemUrl != null) {
      deletarImagem(item.id);
    }
    navigation.goBack();
  }

  return (
    <View style={estilos.container}>
      <View style={estilos.containerTitulo}>
        <Text style={estilos.titulo}>{item ? "Editar post" : "Novo Post"}</Text>
        <IconeClicavel
          exibir={!!item}
          onPress={excluirPostCompleto}
          iconeNome="trash-2"
        />
      </View>
      <ScrollView style={{ width: "100%" }}>
        {entradas?.map((entrada) => (
          <View key={entrada.id}>
            <Text style={estilos.texto}>{entrada.label}</Text>
            <TextInput
              value={post[entrada.name]}
              placeholder={entrada.label}
              multiline={entrada.multiline}
              onChangeText={(valor) =>
                alteraDados(entrada.name, valor, post, setPost)
              }
              style={[
                estilos.entrada,
                entrada.multiline && estilos.entradaDescricao,
              ]}
            />
          </View>
        ))}

        <TouchableOpacity
          style={estilos.imagem}
          onPress={() => setMostrarMenu(true)}
        >
          <Image
            source={imagem ? { uri: imagem } : uploadImagemPadrao}
            style={estilos.imagem}
          />
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={estilos.botao}
        onPress={salvar}
        disabled={desabilitarEnvio}
      >
        <Text style={estilos.textoBotao}>Salvar</Text>
      </TouchableOpacity>

      <MenuSelecaoInferior
        setMostrarMenu={setMostrarMenu}
        mostrarMenu={mostrarMenu}
      >
        <TouchableOpacity
          style={estilos.opcao}
          onPress={() => escolherImagemDaGaleria(setImagem)}
        >
          <Text>Adicionar foto</Text>
          <Text> &#128247;</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.opcao} onPress={removerImagemPost}>
          <Text>Remover foto</Text>
          <Text> &#128465;</Text>
        </TouchableOpacity>
      </MenuSelecaoInferior>
    </View>
  );
}
