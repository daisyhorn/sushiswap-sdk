import { Fee } from '../enums'
import { Token } from '../entities'
import { computePoolInitCodeHash } from './computePoolInitCodeHash'
import { defaultAbiCoder } from '@ethersproject/abi'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256 } from '@ethersproject/solidity'

const MASTER_DEPLOYER_ADDRESS = '0x7166D2efffCA02c6A21A235732131660c3E61f9F'

const CONSTANT_PRODUCT_POOL_CREATION_CODE =
  '0x6101806040523480156200001257600080fd5b50604051620040213803806200402183398101604081905262000035916200049e565b604080518082018252600e81526d29bab9b434902628102a37b5b2b760911b6020918201528151808301835260018152603160f81b9082015281517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f918101919091527fc2bf45081e840722410522aa366600d7fe4da5bfb5a5b417f4d5125b4ed180a4918101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6606082015246608082018190523060a08301529060c001604051602081830303815290604052805190602001206080818152505050600080600080858060200190518101906200013291906200043e565b929650909450925090506001600160a01b038416620001875760405162461bcd60e51b815260206004820152600c60248201526b5a45524f5f4144445245535360a01b60448201526064015b60405180910390fd5b826001600160a01b0316846001600160a01b03161415620001eb5760405162461bcd60e51b815260206004820152601360248201527f4944454e544943414c5f4144445245535345530000000000000000000000000060448201526064016200017e565b612710821115620002325760405162461bcd60e51b815260206004820152601060248201526f494e56414c49445f535741505f46454560801b60448201526064016200017e565b60408051600481526024810182526020810180516001600160e01b0316634da3182760e01b17905290516000916001600160a01b038816916200027691906200056b565b600060405180830381855afa9150503d8060008114620002b3576040519150601f19603f3d011682016040523d82523d6000602084013e620002b8565b606091505b5060408051600481526024810182526020810180516001600160e01b0316630605066960e11b1790529051919350600092506001600160a01b038916916200030191906200056b565b600060405180830381855afa9150503d80600081146200033e576040519150601f19603f3d011682016040523d82523d6000602084013e62000343565b606091505b506001600160601b0319606089811b82166101405288901b166101605260a086905291506200037790508461271062000589565b60c052815162000391908301602090810190840162000417565b60601b6001600160601b031916610100528051620003b9906020908301810190830162000417565b6001600160601b0319606091821b811660e0529088901b166101205260016008558215620003f757600780546001600160e01b0316600160e01b1790555b505050505050505062000611565b80516200041281620005f8565b919050565b6000602082840312156200042a57600080fd5b81516200043781620005f8565b9392505050565b600080600080608085870312156200045557600080fd5b84516200046281620005f8565b60208601519094506200047581620005f8565b60408601516060870151919450925080151581146200049357600080fd5b939692955090935050565b60008060408385031215620004b257600080fd5b82516001600160401b0380821115620004ca57600080fd5b818501915085601f830112620004df57600080fd5b815181811115620004f457620004f4620005e2565b604051601f8201601f19908116603f011681019083821181831017156200051f576200051f620005e2565b816040528281528860208487010111156200053957600080fd5b6200054c836020830160208801620005af565b8096505050505050620005626020840162000405565b90509250929050565b600082516200057f818460208701620005af565b9190910192915050565b600082821015620005aa57634e487b7160e01b600052601160045260246000fd5b500390565b60005b83811015620005cc578181015183820152602001620005b2565b83811115620005dc576000848401525b50505050565b634e487b7160e01b600052604160045260246000fd5b6001600160a01b03811681146200060e57600080fd5b50565b60805160a05160c05160e05160601c6101005160601c6101205160601c6101405160601c6101605160601c6138c26200075f6000396000818161057a0152818161075a015281816108910152818161093f01528181610fcc015281816110e20152818161131b01528181611396015281816115ff01528181611e8b01528181611f2b015261297c015260008181610308015281816106d601528181610a2401528181610b5b01528181610fa001528181611079015281816112c60152818161144f0152818161159101528181611bef01528181611f6c01528181612068015261287d015260008181610553015281816117d70152612e700152600081816103d3015281816125e50152818161275b015281816128410152612a250152600081816102bc0152612f3d015260006124e7015260006103fa0152600081816103ac01526121e401526138c26000f3fe608060405234801561001057600080fd5b50600436106101e55760003560e01c80635a3d54931161010f578063a69840a8116100a2578063cf58879a11610071578063cf58879a1461054e578063d21220a714610575578063d505accf1461059c578063dd62ed3e146105b157600080fd5b8063a69840a8146104ee578063a8f1f52e14610515578063a9059cbb14610528578063af8c09bf1461053b57600080fd5b80637464fc3d116100de5780637464fc3d146104765780637ba0e2e71461047f5780637ecebe001461049257806395d89b41146104b257600080fd5b80635a3d549314610425578063627dd56a1461042e57806367e4ac2c1461044157806370a082311461045657600080fd5b806323b872dd116101875780633644e515116101565780633644e515146103a75780634da31827146103ce57806354cf2aeb146103f55780635909c0d51461041c57600080fd5b806323b872dd146103335780632a07b6c71461034657806330adf81f14610366578063313ce5671461038d57600080fd5b8063095ea7b3116101c3578063095ea7b3146102945780630c0a0cd2146102b75780630dfe16811461030357806318160ddd1461032a57600080fd5b8063053da1c8146101ea57806306fdde03146102105780630902f1ac14610259575b600080fd5b6101fd6101f83660046134ef565b6105dc565b6040519081526020015b60405180910390f35b61024c6040518060400160405280600e81526020017f5375736869204c5020546f6b656e00000000000000000000000000000000000081525081565b604051610207919061369f565b610261610c17565b604080516dffffffffffffffffffffffffffff948516815293909216602084015263ffffffff1690820152606001610207565b6102a76102a23660046133d2565b610c80565b6040519015158152602001610207565b6102de7f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610207565b6102de7f000000000000000000000000000000000000000000000000000000000000000081565b6101fd60005481565b6102a7610341366004613437565b610cf9565b6103596103543660046134ef565b610e45565b604051610207919061363a565b6101fd7f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c981565b610395601281565b60405160ff9091168152602001610207565b6101fd7f000000000000000000000000000000000000000000000000000000000000000081565b6102de7f000000000000000000000000000000000000000000000000000000000000000081565b6101fd7f000000000000000000000000000000000000000000000000000000000000000081565b6101fd60045481565b6101fd60055481565b6101fd61043c3660046134ef565b6111c5565b61044961156f565b60405161020791906135e0565b6101fd610464366004613206565b60016020526000908152604090205481565b6101fd60065481565b6101fd61048d3660046134ef565b61166e565b6101fd6104a0366004613206565b60036020526000908152604090205481565b61024c6040518060400160405280600381526020017f534c50000000000000000000000000000000000000000000000000000000000081525081565b6101fd7f54726964656e743a436f6e7374616e7450726f6475637400000000000000000081565b6101fd6105233660046134ef565b611b78565b6102a76105363660046133d2565b611cab565b6101fd6105493660046134ef565b611d30565b6102de7f000000000000000000000000000000000000000000000000000000000000000081565b6102de7f000000000000000000000000000000000000000000000000000000000000000081565b6105af6105aa366004613478565b61212b565b005b6101fd6105bf3660046133fe565b600260209081526000928352604080842090915290825290205481565b600060085460011461064f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600660248201527f4c4f434b4544000000000000000000000000000000000000000000000000000060448201526064015b60405180910390fd5b60026008556000808080806106668789018961328e565b9450945094509450945060008060006106ce6007546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b9250925092507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff16141561093d5761075385846dffffffffffffffffffffffffffff16846dffffffffffffffffffffffffffff166124df565b98506107817f00000000000000000000000000000000000000000000000000000000000000008a8989612542565b6040517fbd50c7b1000000000000000000000000000000000000000000000000000000008152339063bd50c7b1906107bd90879060040161369f565b600060405180830381600087803b1580156107d757600080fd5b505af11580156107eb573d6000803e3d6000fd5b505050506000806107fa61283a565b90925090508661081a6dffffffffffffffffffffffffffff87168461371b565b1015610882576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601660248201527f494e53554646494349454e545f414d4f554e545f494e000000000000000000006044820152606401610646565b61088f8282878787612ab2565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff167fcd3829a3813dc3cdd188fd3d01dcf3268c16be2fdd2dd21d0665418816e460628a8f60405161092e929190918252602082015260400190565b60405180910390a45050610c03565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff16146109f2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f494e56414c49445f494e5055545f544f4b454e000000000000000000000000006044820152606401610646565b610a1d85836dffffffffffffffffffffffffffff16856dffffffffffffffffffffffffffff166124df565b9850610a4b7f00000000000000000000000000000000000000000000000000000000000000008a8989612542565b6040517fbd50c7b1000000000000000000000000000000000000000000000000000000008152339063bd50c7b190610a8790879060040161369f565b600060405180830381600087803b158015610aa157600080fd5b505af1158015610ab5573d6000803e3d6000fd5b50505050600080610ac461283a565b909250905086610ae46dffffffffffffffffffffffffffff86168361371b565b1015610b4c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601660248201527f494e53554646494349454e545f414d4f554e545f494e000000000000000000006044820152606401610646565b610b598282878787612ab2565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff167fcd3829a3813dc3cdd188fd3d01dcf3268c16be2fdd2dd21d0665418816e460628a8f604051610bf8929190918252602082015260400190565b60405180910390a450505b505060016008555094979650505050505050565b6000806000610c756007546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b925092509250909192565b33600081815260026020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92590610ce89086815260200190565b60405180910390a350600192915050565b73ffffffffffffffffffffffffffffffffffffffff831660009081526002602090815260408083203384529091528120547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff14610d965773ffffffffffffffffffffffffffffffffffffffff8416600090815260026020908152604080832033845290915281208054849290610d9090849061371b565b90915550505b73ffffffffffffffffffffffffffffffffffffffff841660009081526001602052604081208054849290610dcb90849061371b565b909155505073ffffffffffffffffffffffffffffffffffffffff808416600081815260016020526040908190208054860190555190918616907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90610e339086815260200190565b60405180910390a35060019392505050565b6060600854600114610eb3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600660248201527f4c4f434b454400000000000000000000000000000000000000000000000000006044820152606401610646565b6002600855600080610ec78486018661339d565b915091506000806000610f296007546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b925092509250600080610f3a61283a565b60008054308252600160205260409091205492945090925090610f5e878784612dc8565b50600082610f6c86846136de565b610f7691906136ca565b9050600083610f8586856136de565b610f8f91906136ca565b9050610f9b3084612f6e565b610fc77f0000000000000000000000000000000000000000000000000000000000000000838d8d612542565b610ff37f0000000000000000000000000000000000000000000000000000000000000000828d8d612542565b610ffd828761371b565b9550611009818661371b565b945061101886868b8b8b612ab2565b61102a61102586886136de565b613001565b6006556040805160028082526060820190925290816020015b6040805180820190915260008082526020820152815260200190600190039081611043579050509b5060405180604001604052807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168152602001838152508c6000815181106110ca576110ca613809565b602002602001018190525060405180604001604052807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168152602001828152508c60018151811061113357611133613809565b60200260200101819052508a73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d8193649684846040516111a6929190918252602082015260400190565b60405180910390a35050600160085550979a9950505050505050505050565b6000600854600114611233576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600660248201527f4c4f434b454400000000000000000000000000000000000000000000000000006044820152606401610646565b60026008556000808061124885870187613247565b92509250925060008060006112ac6007546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b9250925092506000806112bd61283a565b915091506000807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff16141561139457507f00000000000000000000000000000000000000000000000000000000000000006113546dffffffffffffffffffffffffffff88168561371b565b915061138182886dffffffffffffffffffffffffffff16886dffffffffffffffffffffffffffff166124df565b9a5061138d8b8461371b565b92506114d7565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff1614611449576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f494e56414c49445f494e5055545f544f4b454e000000000000000000000000006044820152606401610646565b506007547f00000000000000000000000000000000000000000000000000000000000000009061149b906e01000000000000000000000000000090046dffffffffffffffffffffffffffff168461371b565b91506114c882876dffffffffffffffffffffffffffff16896dffffffffffffffffffffffffffff166124df565b9a506114d48b8561371b565b93505b6114e3818c8b8b612542565b6114f08484898989612ab2565b8073ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff167fcd3829a3813dc3cdd188fd3d01dcf3268c16be2fdd2dd21d0665418816e46062858f604051610bf8929190918252602082015260400190565b60408051600280825260608083018452926020830190803683370190505090507f0000000000000000000000000000000000000000000000000000000000000000816000815181106115c3576115c3613809565b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250507f00000000000000000000000000000000000000000000000000000000000000008160018151811061163157611631613809565b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505090565b60006008546001146116dc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600660248201527f4c4f434b454400000000000000000000000000000000000000000000000000006044820152606401610646565b600260085560006116ef83850185613206565b9050600080600061174f6007546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b92509250925060008061176061283a565b6000549193509150611773868683612dc8565b5060006117906dffffffffffffffffffffffffffff88168561371b565b905060006117ae6dffffffffffffffffffffffffffff88168561371b565b905060006117bf61102586886136de565b905083611a41576117d360006103e8613186565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16637cd07e476040518163ffffffff1660e01b815260040160206040518083038186803b15801561183b57600080fd5b505afa15801561184f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611873919061322a565b90503373ffffffffffffffffffffffffffffffffffffffff821614156119ae578073ffffffffffffffffffffffffffffffffffffffff166340dc0e376040518163ffffffff1660e01b815260040160206040518083038186803b1580156118d957600080fd5b505afa1580156118ed573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119119190613561565b9b5060008c11801561194357507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8c14155b6119a9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f4241445f444553495245445f4c495155494449545900000000000000000000006044820152606401610646565b611a3b565b73ffffffffffffffffffffffffffffffffffffffff811615611a2c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600d60248201527f4f4e4c595f4d49475241544f52000000000000000000000000000000000000006044820152606401610646565b611a386103e88361371b565b9b505b50611a89565b6000611a636110256dffffffffffffffffffffffffffff808c16908d166136de565b90508085611a71828561371b565b611a7b91906136de565b611a8591906136ca565b9b50505b60008b11611af3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f494e53554646494349454e545f4c49515549444954595f4d494e5445440000006044820152606401610646565b611afd8a8c613186565b611b0a86868b8b8b612ab2565b6006819055604080518481526020810184905273ffffffffffffffffffffffffffffffffffffffff8c169133917fdbba30eb0402b389513e87f51f4db2db80bed454384ec6925a24097c3548a02a910160405180910390a35050600160085550969998505050505050505050565b60008080611b88848601866133d2565b91509150600080611be86007546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b50915091507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415611c7357611c6c83836dffffffffffffffffffffffffffff16836dffffffffffffffffffffffffffff166124df565b9450611ca1565b611c9e83826dffffffffffffffffffffffffffff16846dffffffffffffffffffffffffffff166124df565b94505b5050505092915050565b33600090815260016020526040812080548391908390611ccc90849061371b565b909155505073ffffffffffffffffffffffffffffffffffffffff8316600081815260016020526040908190208054850190555133907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90610ce89086815260200190565b6000600854600114611d9e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600660248201527f4c4f434b454400000000000000000000000000000000000000000000000000006044820152606401610646565b600260085560008080611db385870187613247565b9250925092506000806000611e176007546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b925092509250600080611e2861283a565b60008054308252600160205260409091205492945090925090611e4c878784612dc8565b50600082611e5a86846136de565b611e6491906136ca565b9050600083611e7386856136de565b611e7d91906136ca565b9050611e893084612f6e565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168c73ffffffffffffffffffffffffffffffffffffffff161415611f6a57611f1a82611efb816dffffffffffffffffffffffffffff8d1661371b565b611f15846dffffffffffffffffffffffffffff8d1661371b565b6124df565b611f2490826136b2565b9050611f527f0000000000000000000000000000000000000000000000000000000000000000828d8d612542565b611f5c818661371b565b9450809c50600091506120a3565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168c73ffffffffffffffffffffffffffffffffffffffff161461201f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f494e56414c49445f4f55545055545f544f4b454e0000000000000000000000006044820152606401610646565b6120578161203d816dffffffffffffffffffffffffffff8c1661371b565b611f15856dffffffffffffffffffffffffffff8e1661371b565b61206190836136b2565b915061208f7f0000000000000000000000000000000000000000000000000000000000000000838d8d612542565b612099828761371b565b9550819c50600090505b6120b086868b8b8b612ab2565b6120bd61102586886136de565b600655604080518381526020810183905273ffffffffffffffffffffffffffffffffffffffff8d169133917fdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496910160405180910390a35050600160085550989b9a5050505050505050505050565b428410156121bb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f54726964656e7445524332303a205045524d49545f444541444c494e455f455860448201527f50495245440000000000000000000000000000000000000000000000000000006064820152608401610646565b73ffffffffffffffffffffffffffffffffffffffff8716600090815260036020526040812080547f0000000000000000000000000000000000000000000000000000000000000000917f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9918b918b918b91876122368361375e565b9091555060408051602081019690965273ffffffffffffffffffffffffffffffffffffffff94851690860152929091166060840152608083015260a082015260c0810187905260e001604051602081830303815290604052805190602001206040516020016122d79291907f190100000000000000000000000000000000000000000000000000000000000081526002810192909252602282015260420190565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181528282528051602091820120600080855291840180845281905260ff88169284019290925260608301869052608083018590529092509060019060a0016020604051602081039080840390855afa158015612360573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff8116158015906123db57508873ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b612467576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f54726964656e7445524332303a20494e56414c49445f5045524d49545f53494760448201527f4e415455524500000000000000000000000000000000000000000000000000006064820152608401610646565b73ffffffffffffffffffffffffffffffffffffffff81811660009081526002602090815260408083208c8516808552908352928190208b9055518a815291928c16917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050505050505050565b60008061250c7f0000000000000000000000000000000000000000000000000000000000000000866136de565b90508061251b612710866136de565b61252591906136b2565b61252f84836136de565b61253991906136ca565b95945050505050565b80156126c4576040805173ffffffffffffffffffffffffffffffffffffffff8681166024830152306044830152848116606483015260006084830181905260a48084018890528451808503909101815260c490930184526020830180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f97da6d300000000000000000000000000000000000000000000000000000000017905292517f000000000000000000000000000000000000000000000000000000000000000090911691612611916135c4565b6000604051808303816000865af19150503d806000811461264e576040519150601f19603f3d011682016040523d82523d6000602084013e612653565b606091505b50509050806126be576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600f60248201527f57495448445241575f4641494c454400000000000000000000000000000000006044820152606401610646565b50612834565b6040805173ffffffffffffffffffffffffffffffffffffffff8681166024830152306044830152848116606483015260848083018790528351808403909101815260a490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167ff18d03cc0000000000000000000000000000000000000000000000000000000017905291516000927f00000000000000000000000000000000000000000000000000000000000000001691612785916135c4565b6000604051808303816000865af19150503d80600081146127c2576040519150601f19603f3d011682016040523d82523d6000602084013e6127c7565b606091505b5050905080612832576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600f60248201527f5452414e534645525f4641494c454400000000000000000000000000000000006044820152606401610646565b505b50505050565b60008060007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663f7888aec7f0000000000000000000000000000000000000000000000000000000000000000306040516024016128d092919073ffffffffffffffffffffffffffffffffffffffff92831681529116602082015260400190565b6040516020818303038152906040529060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505060405161291e91906135c4565b600060405180830381855afa9150503d8060008114612959576040519150601f19603f3d011682016040523d82523d6000602084013e61295e565b606091505b50915050808060200190518101906129769190613561565b604080517f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff90811660248301523060448084019190915283518084039091018152606490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167ff7888aec0000000000000000000000000000000000000000000000000000000017905291519295506000927f000000000000000000000000000000000000000000000000000000000000000090921691612a5291906135c4565b600060405180830381855afa9150503d8060008114612a8d576040519150601f19603f3d011682016040523d82523d6000602084013e612a92565b606091505b5091505080806020019051810190612aaa9190613561565b925050509091565b6dffffffffffffffffffffffffffff8511801590612ade57506dffffffffffffffffffffffffffff8411155b612b44576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600860248201527f4f564552464c4f570000000000000000000000000000000000000000000000006044820152606401610646565b6007547c0100000000000000000000000000000000000000000000000000000000900463ffffffff16612bc857600780546dffffffffffffffffffffffffffff8681166e010000000000000000000000000000027fffffffff0000000000000000000000000000000000000000000000000000000090921690881617179055612d88565b6000612bd964010000000042613797565b90508163ffffffff168163ffffffff1614158015612c0657506dffffffffffffffffffffffffffff841615155b8015612c2157506dffffffffffffffffffffffffffff831615155b15612ce65781810360006dffffffffffffffffffffffffffff86167bffffffffffffffffffffffffffff0000000000000000000000000000607087901b1681612c6c57612c6c6137da565b600480549290910463ffffffff851681029092019055905060006dffffffffffffffffffffffffffff8616607088901b7bffffffffffffffffffffffffffff00000000000000000000000000001681612cc757612cc76137da565b0490508263ffffffff1681026005600082825401925050819055505050505b6007805463ffffffff9092167c0100000000000000000000000000000000000000000000000000000000027bffffffffffffffffffffffffffffffffffffffffffffffffffffffff6dffffffffffffffffffffffffffff8881166e010000000000000000000000000000027fffffffff00000000000000000000000000000000000000000000000000000000909516908a161793909317929092169190911790555b60408051868152602081018690527fcf2aa50876cdfbb541206f89af0ee78d44a2abf8d328e37fa4917f982149848a910160405180910390a15050505050565b6006546000908015612f6657612df46110256dffffffffffffffffffffffffffff8087169088166136de565b915080821115612f665760408051600481526024810182526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fc14ad80200000000000000000000000000000000000000000000000000000000179052905160009173ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001691612e9b91906135c4565b600060405180830381855afa9150503d8060008114612ed6576040519150601f19603f3d011682016040523d82523d6000602084013e612edb565b606091505b50915050600081806020019051810190612ef59190613561565b905060006127108583612f08878361371b565b612f12908a6136de565b612f1c91906136de565b612f2691906136ca565b612f3091906136ca565b90508015612f6257612f627f000000000000000000000000000000000000000000000000000000000000000082613186565b5050505b509392505050565b73ffffffffffffffffffffffffffffffffffffffff821660009081526001602052604081208054839290612fa390849061371b565b909155505060008054829003815560405182815273ffffffffffffffffffffffffffffffffffffffff8416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906020015b60405180910390a35050565b60008161301057506000919050565b81600170010000000000000000000000000000000082106130365760809190911c9060401b5b6801000000000000000082106130515760409190911c9060201b5b64010000000082106130685760209190911c9060101b5b62010000821061307d5760109190911c9060081b5b61010082106130915760089190911c9060041b5b601082106130a45760049190911c9060021b5b600882106130b05760011b5b60018185816130c1576130c16137da565b048201901c905060018185816130d9576130d96137da565b048201901c905060018185816130f1576130f16137da565b048201901c90506001818581613109576131096137da565b048201901c90506001818581613121576131216137da565b048201901c90506001818581613139576131396137da565b048201901c90506001818581613151576131516137da565b048201901c90506000818581613169576131696137da565b049050808210613179578061317b565b815b93505050505b919050565b8060008082825461319791906136b2565b909155505073ffffffffffffffffffffffffffffffffffffffff82166000818152600160209081526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9101612ff5565b8035801515811461318157600080fd5b60006020828403121561321857600080fd5b813561322381613867565b9392505050565b60006020828403121561323c57600080fd5b815161322381613867565b60008060006060848603121561325c57600080fd5b833561326781613867565b9250602084013561327781613867565b9150613285604085016131f6565b90509250925092565b600080600080600060a086880312156132a657600080fd5b85356132b181613867565b945060208601356132c181613867565b93506132cf604087016131f6565b925060608601359150608086013567ffffffffffffffff808211156132f357600080fd5b818801915088601f83011261330757600080fd5b81358181111561331957613319613838565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f0116810190838211818310171561335f5761335f613838565b816040528281528b602084870101111561337857600080fd5b8260208601602083013760006020848301015280955050505050509295509295909350565b600080604083850312156133b057600080fd5b82356133bb81613867565b91506133c9602084016131f6565b90509250929050565b600080604083850312156133e557600080fd5b82356133f081613867565b946020939093013593505050565b6000806040838503121561341157600080fd5b823561341c81613867565b9150602083013561342c81613867565b809150509250929050565b60008060006060848603121561344c57600080fd5b833561345781613867565b9250602084013561346781613867565b929592945050506040919091013590565b600080600080600080600060e0888a03121561349357600080fd5b873561349e81613867565b965060208801356134ae81613867565b95506040880135945060608801359350608088013560ff811681146134d257600080fd5b9699959850939692959460a0840135945060c09093013592915050565b6000806020838503121561350257600080fd5b823567ffffffffffffffff8082111561351a57600080fd5b818501915085601f83011261352e57600080fd5b81358181111561353d57600080fd5b86602082850101111561354f57600080fd5b60209290920196919550909350505050565b60006020828403121561357357600080fd5b5051919050565b60008151808452613592816020860160208601613732565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b600082516135d6818460208701613732565b9190910192915050565b6020808252825182820181905260009190848201906040850190845b8181101561362e57835173ffffffffffffffffffffffffffffffffffffffff16835292840192918401916001016135fc565b50909695505050505050565b602080825282518282018190526000919060409081850190868401855b82811015613692578151805173ffffffffffffffffffffffffffffffffffffffff168552860151868501529284019290850190600101613657565b5091979650505050505050565b602081526000613223602083018461357a565b600082198211156136c5576136c56137ab565b500190565b6000826136d9576136d96137da565b500490565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615613716576137166137ab565b500290565b60008282101561372d5761372d6137ab565b500390565b60005b8381101561374d578181015183820152602001613735565b838111156128345750506000910152565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415613790576137906137ab565b5060010190565b6000826137a6576137a66137da565b500690565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b73ffffffffffffffffffffffffffffffffffffffff8116811461388957600080fd5b5056fea264697066735822122081f16cdfeb50cb855448d6a1d084f13b10dfe63da9d711f3f5981c752cb9c47664736f6c63430008070033'

export const computeConstantProductPoolAddress = ({
  factoryAddress,
  tokenA,
  tokenB,
  fee,
  twap
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
  fee: Fee
  twap: boolean
}): string => {
  // does safety checks
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

  // Encode deploy data
  const deployData = defaultAbiCoder.encode(
    ['address', 'address', 'uint256', 'bool'],
    [token0.address, token1.address, fee, twap]
  )

  // Compute init code hash based off the bytecode, deployData & masterDeployerAddress
  const CONSTANT_PRODUCT_POOL_INIT_CODE_HASH = computePoolInitCodeHash({
    creationCode: CONSTANT_PRODUCT_POOL_CREATION_CODE,
    deployData,
    masterDeployerAddress: MASTER_DEPLOYER_ADDRESS
  })

  // Compute pool address
  return getCreate2Address(factoryAddress, keccak256(['bytes'], [deployData]), CONSTANT_PRODUCT_POOL_INIT_CODE_HASH)
}
