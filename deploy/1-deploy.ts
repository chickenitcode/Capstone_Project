import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("====================");
  console.log(hre.network.name);
  console.log("====================");

  console.log("====================");
  console.log("Deploy MockERC20 Contract");
  console.log("====================");

  const mockERC20 = await deploy("MockERC20", {
    contract: "MockERC20",
    args: ["MockToken", "MTK"],
    from: deployer,
    log: true,
    autoMine: true,
    skipIfAlreadyDeployed: false,
  });

  console.log("MockERC20 deployed at:", mockERC20.address);

  console.log("====================");
  console.log("Deploy Voting Contract");
  console.log("====================");

  const voting = await deploy("Voting", {
    contract: "Voting",
    args: [mockERC20.address],
    from: deployer,
    log: true,
    autoMine: true,
    skipIfAlreadyDeployed: false,
  });

  console.log("Voting deployed at:", voting.address);
};

func.tags = ["deploy"];
export default func;
