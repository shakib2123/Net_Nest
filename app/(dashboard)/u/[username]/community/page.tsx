import { format } from "date-fns";

import { getBlockedUsers } from "@/lib/block-service";
import { DataTable } from "./_components/data-table";

import { columns } from "./_components/columns";

const CommunityPage = async () => {
  const { blockedUsersIds, blockedUsers } = await getBlockedUsers();

  const userMap = blockedUsersIds.reduce((map, user) => {
    map[user.blockedId] = user;
    return map;
  }, {});

  const formattedData = blockedUsers.map((block) => {
    const blockedUser = userMap[block._id];
    return {
      blockedUser: blockedUser,
      userId: block._id,
      imageUrl: block.imageUrl,
      username: block.username,
      createdAt: format(new Date(blockedUser.createdAt), "dd/MM/yyyy"),
    };
  });

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Community Settings</h1>
      </div>
      <DataTable columns={columns} data={formattedData} />
    </div>
  );
};

export default CommunityPage;
