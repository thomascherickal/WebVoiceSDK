self.importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.1/dist/tf.min.js')
self.importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm')

let model
onmessage = async function (msg) {
    switch (msg.data.method) {
        case "process":
            infer(msg.data.features)
            break
        case "configure":
            await tf.wasm.setWasmPath(msg.data.wasmPath)
            await tf.setBackend('wasm');
            console.log(tf.getBackend())
            model = await tf.loadLayersModel("http://localhost:1234/hotwords/linto/1/model.json")
            let test = [
                [-4.38008932, 1.76596543, -0.0308356101, -0.156199529, -0.397121688, -0.783466278, -0.787654801, -0.419249497, -0.120861649, 0.260230085, 0.607665989, 0.850428494, 0.916728505],
                [-4.09551338, 2.25335205, 0.0533512501, 0.0725439359, -1.01972772, -1.44374983, -1.3206918, -0.675359225, -0.558259242, -0.351135791, 0.274224135, 0.259443871, 0.904525084],
                [-3.52781061, 2.88930734, 0.282867405, -0.136680913, -0.808622853, -1.45548755, -0.947083111, -0.365134028, -0.302294658, 0.134336649, 0.751214957, 0.835920619, 0.96841239],
                [-4.29776455, 2.70671134, -0.177238749, -0.538447794, -1.30105624, -1.4773676, -1.12704211, -0.955920985, -0.636687012, 0.0657674936, 0.731238647, 0.913259118, 1.10797327],
                [-4.12729569, 2.8620651, 0.716300335, 0.155563939, -0.750983376, -1.34964942, -1.09407937, -0.833589153, -1.20469651, -0.275990827, 0.39305448, 0.119211472, 0.537550067],
                [-3.58579432, 2.57469779, -0.317373955, -0.84109169, -0.655994283, -0.677140194, -0.624641542, -0.332758445, 0.0728994533, -0.385605975, -0.0748194961, 0.0435817116, 0.691950144],
                [-4.30428993, 2.48476168, 0.183693467, 0.434575535, -0.442395911, -0.648624579, -1.09130452, -0.4178634, -0.0959858388, -0.110498213, 0.0522227509, -0.0253282818, 0.734317081],
                [-4.91304521, 2.50551286, 1.43929738, 0.381034213, -0.735090489, -0.542894551, -0.636766668, -0.852146943, -0.495285956, -0.141213196, -0.0636680513, 0.335533989, 0.476417667],
                [-0.427360964, 3.93597892, 0.604851932, -1.69633253, -2.65410935, -2.39826036, -0.829797773, -0.413035423, -0.307016623, -0.281572587, -0.245707014, 0.304634782, -0.310205149],
                [1.77209372, 4.15738591, 0.821396588, -2.57959444, -1.16375659, -2.27547712, -0.51151281, -0.217220605, -1.16802891, -0.420795455, -0.0306340278, 0.833065309, 0.234412253],
                [0.270434385, 1.89066135, -0.321973213, -4.31893335, -3.2130628, -2.25136163, 1.38385157, 0.203690185, -0.646266389, -1.55336597, 0.363183255, 0.817445555, -1.00377851],
                [0.620080696, 2.21767825, 0.867206688, -4.76909644, -3.46245787, -1.67501476, 0.700457253, 0.0965212353, -2.09722433, -1.99719488, 0.394173792, 0.53326854, -1.2411494],
                [2.29262538, 2.0270789, -0.580996395, -2.77729593, -3.49112203, -3.21365787, -1.95340531, -0.246499653, -1.53127052, -1.38861099, -0.255321403, -0.973843064, -0.826781617],
                [3.24712014, 2.05095288, -1.79230505, -2.82493822, -4.15582703, -3.06668066, -1.4405551, -0.296126559, 0.0672050772, -1.77263161, -1.78060064, -1.0675954, -0.464863312],
                [3.11993884, 4.0094732, -0.666527958, -2.01777911, -2.33210446, -1.21297788, -0.426121069, 0.0678108298, -0.204946887, -1.02173724, -0.864180385, -0.531604772, -0.536195977],
                [-3.63048645, 1.41531766, -0.550340815, -0.807989872, -1.38020165, -0.783624251, -0.657301073, -0.0933816515, 0.148196814, 0.0761242274, -0.183913678, -0.339289209, -0.010976863],
                [-6.98358185, 1.5351882, -2.63604619, -0.217256379, -0.950752499, -2.06591442, 2.43558848, -0.402773458, -0.548052958, -1.18643821, -0.867316986, 0.162670304, -0.703376932],
                [1.91580605, -1.43947851, -4.15514708, -1.98505014, -2.5393228, -2.28958513, -0.46589275, 2.03420914, 2.03164348, -1.24956195, -2.81157531, 0.395267171, 0.995003963],
                [3.37775354, -1.69389077, -4.5951282, -3.4163552, -1.18853124, -1.15385748, -0.0673854628, 1.74394398, 1.57944889, -0.626750388, -2.26350577, -0.549587021, 0.340400787],
                [4.9356596, -0.746508838, -4.59125805, -3.05600063, 0.00649860152, 0.0977547794, -1.21134417, 1.27447558, 1.89479328, -0.176771369, -1.55497116, -0.617279936, 0.267150697],
                [4.43836512, 0.445409359, -4.91050813, -2.44372431, -0.775861174, -0.768724566, -1.08451789, 0.79969338, 1.58750137, -0.0646091117, -1.29683925, -1.01203743, -0.130524777],
                [-0.70022742, 0.635182527, -3.12990196, -2.15505906, -0.742920572, -0.679553718, -0.560216256, 1.09901861, 1.55243768, 0.164977627, -0.613744519, -0.628506372, -0.304526375],
                [-4.60609099, -0.21347621, -2.47991145, -1.10891446, -0.0630822304, -0.0720569676, -0.109073892, 0.948862265, 0.716054174, -0.0193461039, -0.74914487, -1.03144319, -0.328551686],
                [-5.35074227, 0.925960999, -0.583658246, 0.33418518, 0.455341765, 0.651955088, 0.737237692, 1.01988712, 0.81240765, 0.357149265, -0.450204019, 0.0369009119, 0.32094178],
                [-6.51637686, 0.802751281, -0.109909573, 1.06338168, 0.867674103, 0.578382001, 0.833700501, 0.94111913, 0.722829357, 0.692769526, 0.131227069, 0.349975479, 0.145879407],
                [-6.24029563, 1.7047842, 0.824908684, 0.421228342, 0.0932127908, 0.87024871, 0.741458137, 0.327415464, 0.248111207, 0.22962777, 0.446759996, 0.558767565, 0.457374521],
                [-6.63735725, 1.58400464, 0.248662656, -0.250539174, -0.358811896, 0.316783235, 0.27706732, 0.741034925, -0.000610791286, -0.474215986, -0.492331195, -0.423340234, -0.0804243832],
                [-6.60225857, 0.702976513, -0.07397058, 0.555260527, 0.34305891, 0.321996613, 0.848315854, 1.02406058, 0.350751644, 0.353425131, -0.325770249, -0.385196676, -0.118903005],
                [-5.55128412, 1.27720589, 0.158881944, 0.256605177, 0.617337206, 0.427488211, -0.0182689801, -0.0690620297, 0.145695014, -0.361450596, -0.120643787, 0.253712035, 0.101093121],
                [-6.94585766, 1.20004979, 0.919041167, 0.956390244, -0.658770946, -0.663719272, 0.000502870769, 0.12090373, -0.157117691, 0.0528729242, -0.0477412027, 0.275221787, 0.673658524]
            ]
            let testTensor = tf.tensor3d(new Array(test))
            const inference = model.predict(testTensor)
            console.log(inference)
            const value = inference.dataSync()[0]
            console.log(value)
    }
}

let tensor
function infer(features) {
    tensor = tf.tensor3d(new Array(features))
    const inference = model.predict(tensor)
    const value = inference.dataSync()[0]
    console.log(value)
    //postMessage(value)
}