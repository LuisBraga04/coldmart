function convertFormToJSON(form) {
    return $(form)
        .serializeArray()
        .reduce(function (json, { name, value }) {
            json[name] = value;
            return json;
        }, {});
}

$('form').submit(async function () {
    document.querySelector('.loading').classList.add('d-block');
    document.querySelector('.error-message').classList.remove('d-block');
    document.querySelector('.sent-message').classList.remove('d-block');
    var form = $(this);
    var dados = convertFormToJSON(form);
    let usuarioLogado = JSON.parse(localStorage.getItem('userLogado'))
    dados.nomeProfessor = usuarioLogado.nome;
    dados.codigoPlaylist = (new URL(dados.linkPlaylist)).searchParams.get('list');
    var cursos = localStorage.getItem('cursos') ? JSON.parse(localStorage.getItem('cursos')) : [];
    if (!dados.codigoPlaylist) {
        document.querySelector('.loading').classList.remove('d-block');
        document.querySelector('.error-message').innerHTML = `link de playlist inválido. Confira se o link utilizado contém uma playlist relacionada.`;
        document.querySelector('.error-message').classList.add('d-block');
        return
    }
    else if (cursos.find(f => f.nomeCurso == dados.nomeCurso)) {
        document.querySelector('.loading').classList.remove('d-block');
        document.querySelector('.error-message').innerHTML = 'Curso já cadastrado no sistema.';
        document.querySelector('.error-message').classList.add('d-block');
        return
    }
    else {
        try {
            $.ajax({
                url: 'https://www.googleapis.com/youtube/v3/playlistItems',
                data: { key: "AIzaSyDixVymybe7geYX_mijLr70sUGu1OJPwsc", playlistId: dados.codigoPlaylist, part: 'snippet', maxResults: 150 },
            }).then(function (d) {
                dados.linkThumb = d.items[0].snippet.thumbnails.standard.url;
                cursos.push(dados);
                localStorage.setItem('cursos', JSON.stringify(cursos));
                setTimeout(() => {
                    document.querySelector('.butao').parentElement.style.display = 'none';
                    document.querySelector('.loading').classList.remove('d-block');
                    document.querySelector('.sent-message').classList.add('d-block');
                    let div_qtAula = document.getElementById('quantidade-aulas');
                    div_qtAula.value = d.items.length;
                    div_qtAula.parentElement.parentElement.classList.remove('d-none');
                    let div_nvAula = document.getElementById('nivel-curso');
                    div_nvAula.value = d.items.length > 25 ? 5 : Math.floor(d.items.length / 5);
                    div_nvAula.parentElement.parentElement.classList.remove('d-none');
                    let div_imagemCurso = document.getElementById('imagem-curso');
                    div_imagemCurso.style.display = 'flex';
                    div_imagemCurso.querySelector('img').src = dados.linkThumb;
                }, 600);
            });
        } catch (error) {
            document.querySelector('.loading').classList.remove('d-block');
            document.querySelector('.error-message').innerHTML = 'Erro ao buscar dados da playlist';
            document.querySelector('.error-message').classList.add('d-block');
        }
    }
});